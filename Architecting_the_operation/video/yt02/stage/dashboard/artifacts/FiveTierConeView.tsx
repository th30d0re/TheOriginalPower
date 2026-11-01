import React, {useState, type JSX} from 'react';
import {MathText, useTokens, type InstrumentMode} from '@stage';
import {color, Tokens} from '../../tokens';

export type FiveTierConeViewProps = {
  mode: InstrumentMode; // 'compact' | 'expanded' | 'settings'
  width: number;
  height: number; // content box to fill (no panel chrome)
  interactive: boolean; // true only on the website
  era?: {log: number; fields: Record<string, unknown>}; // an entry of yt02/dashboard_eras.json
};

export type FiveTierConeModel = {
  el: number; // elevation in degrees (-90 to 90)
  az: number; // azimuth in degrees (-180 to 180)
  al: number; // tier alignment (0 to 1)
  e1: number; // communal capacity (0 to 1)
  e2: number; // mobility (0 to 1)
  e3: number; // epistemic enclosure (0 to 1)
  lock: boolean; // enclosure limits view
};

export type FiveTierConeEraResult = FiveTierConeModel & {
  modelDefault: boolean;
  deployedTiers: string[];
};

export const DEFAULT_MODEL: FiveTierConeModel = {
  el: 22,
  az: -28,
  al: 1.0,
  e1: 0.3,
  e2: 0.3,
  e3: 0.3,
  lock: true,
};

// Geometry constants from five-tier-cone.html
const H = 5;
const RB = 4;
const SC = 54;
const X0 = 360;
const Y0 = 290;
const D2R = Math.PI / 180;

export type TierKey = 'E' | 'P' | 'F' | 'I';

export type TierDef = {
  k: TierKey;
  name: string;
  mathLabel: string;
  z: number;
  r: number;
  color: string;
  off: [number, number];
  circuitRole: string;
  labelXOffset?: number;
  labelYOffset?: number;
};

export const TIERS_DEF: TierDef[] = [
  {
    k: 'E',
    name: 'E',
    mathLabel: 'E',
    z: 4.55,
    r: RB * (1 - 4.55 / H), // 0.36
    color: color('color/fill/accent'), // #E08A3C orange
    off: [-2.6, 2.0],
    circuitRole:
      'Voltage source: sets the potential across the network; never touched by the current it generates.',
  },
  {
    k: 'P',
    name: 'P_uppet',
    mathLabel: 'P_{uppet}',
    z: 3.45,
    r: RB * (1 - 3.45 / H), // 1.24
    color: color('color/fill/gold'), // #D4A84B / gold token
    off: [-0.5, -1.5],
    circuitRole:
      'Potential divider: turns E’s potential into policy-level drops and absorbs blame that would arc to E.',
  },
  {
    k: 'F',
    name: 'F_enforce',
    mathLabel: 'F_{enforce}',
    z: 2.35,
    r: RB * (1 - 2.35 / H), // 2.12
    color: '#E0604A', // red
    off: [1.0, 2.0],
    circuitRole:
      'Current source: the conductive path that makes law executable as amperage.',
  },
  {
    k: 'I',
    name: 'I_buffer',
    mathLabel: 'I_{buffer}',
    z: 1.25,
    r: RB * (1 - 1.25 / H), // 3.00
    color: '#4CC2C2', // teal
    off: [1.4, -1.6],
    circuitRole:
      'Dielectric: receives W = ψ_m + jψ_s, stores energy in the ideological field, passes no current to E.',
  },
];

export const BASE_O_DEF = {
  k: 'O',
  name: 'O',
  mathLabel: 'O',
  z: 0,
  r: RB, // 4.00
  color: '#7CC08A', // green
  circuitRole: 'Sink / ground: all net current flows here.',
};

// S_enc = (1/√2)·√(((e₁ + e₂)/2)² + e₃²) (eq. 1.1)
export function computeEnclosure(e1: number, e2: number, e3: number): number {
  const m = (e1 + e2) / 2;
  return Math.sqrt(m * m + e3 * e3) / Math.SQRT2;
}

// Highest view allowed = -90° + 180°·(1 - S_enc)
export function computeElMax(e1: number, e2: number, e3: number, lock: boolean): number {
  return lock ? -90 + 180 * (1 - computeEnclosure(e1, e2, e3)) : 90;
}

function tierCtr(t: TierDef, al: number): [number, number] {
  const a = 1 - al;
  return [a * t.off[0], a * t.off[1]];
}

export function proj3D(
  x: number,
  y: number,
  z: number,
  az: number,
  el: number,
  sc = SC,
  x0 = X0,
  y0 = Y0,
): {x: number; y: number; d: number} {
  const ca = Math.cos(az * D2R);
  const sa = Math.sin(az * D2R);
  const ce = Math.cos(el * D2R);
  const se = Math.sin(el * D2R);
  const x1 = x * ca - y * sa;
  const y1 = x * sa + y * ca;
  const zz = z - 2.5;
  return {
    x: x0 + sc * x1,
    y: y0 - sc * (zz * ce - y1 * se),
    d: -y1 * ce + zz * se,
  };
}

// 2D convex hull via Monotone Chain
function convexHull(pts: [number, number][]): [number, number][] {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  const up: [number, number][] = [];
  p.forEach(pt => {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop();
    lo.push(pt);
  });
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i];
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pt) <= 0) up.pop();
    up.push(pt);
  }
  up.pop();
  lo.pop();
  return lo.concat(up);
}

// Memoized cone hull by angle
const hullCache = new Map<string, [number, number][]>();
export function computeConeHull(
  az: number,
  el: number,
  sc = SC,
  x0 = X0,
  y0 = Y0,
): [number, number][] {
  const key = `${Math.round(az * 10)},${Math.round(el * 10)},${sc},${x0},${y0}`;
  const hit = hullCache.get(key);
  if (hit) return hit;
  const pts: [number, number][] = [];
  const ap = proj3D(0, 0, H, az, el, sc, x0, y0);
  pts.push([ap.x, ap.y]);
  for (let i = 0; i < 96; i++) {
    const a = (2 * Math.PI * i) / 96;
    const p = proj3D(RB * Math.cos(a), RB * Math.sin(a), 0, az, el, sc, x0, y0);
    pts.push([p.x, p.y]);
  }
  const res = convexHull(pts);
  hullCache.set(key, res);
  return res;
}

// Share of E's disc not covered by P, F, I in axis view (grid sampled 41×41)
const visibleCache = new Map<number, number>();
export function computeVisible(al: number): number {
  const key = Math.round(al * 1000);
  const cached = visibleCache.get(key);
  if (cached !== undefined) return cached;
  const E = TIERS_DEF[0];
  const a = 1 - al;
  const ce = [a * E.off[0], a * E.off[1]];
  let n = 0;
  let v = 0;
  for (let i = -20; i <= 20; i++) {
    for (let j = -20; j <= 20; j++) {
      const x = (i / 20) * E.r;
      const y = (j / 20) * E.r;
      if (x * x + y * y > E.r * E.r) continue;
      n++;
      const px = ce[0] + x;
      const py = ce[1] + y;
      let cov = false;
      for (let k = 1; k < TIERS_DEF.length; k++) {
        const t = TIERS_DEF[k];
        const cx = a * t.off[0];
        const cy = a * t.off[1];
        if ((px - cx) * (px - cx) + (py - cy) * (py - cy) <= t.r * t.r) {
          cov = true;
          break;
        }
      }
      if (!cov) v++;
    }
  }
  const res = n > 0 ? v / n : 0;
  visibleCache.set(key, res);
  return res;
}

export function verdictText(el: number, lock: boolean, maxEl: number, vis: number): string {
  if (el < -80 && vis < 0.01) {
    return 'Flat Ceiling: from inside O, the observer sees only the underside of I_{buffer}. P, F, and E sit behind it on the same sightline, so the system looks like Oppressor against Oppressed.';
  }
  if (el < -80) {
    return `From inside O with the proxies off the axis, ${Math.round(100 * vis)}% of E shows past the lower layers. Elite Obscuration depends on keeping the tiers aligned.`;
  }
  if (lock && el >= maxEl - 0.5 && maxEl < 90) {
    return `The enclosure stops the observer at ${Math.round(maxEl)}°. Lower e₁, e₂, or e₃ to let the observer climb out and see more of the cone.`;
  }
  return 'From outside the cone, all five tiers are visible. The trap hides its architecture only from the inside.';
}

export function fiveTierConeFromEra(era?: {
  log: number;
  fields: Record<string, unknown>;
}): FiveTierConeEraResult {
  const deployedTiers: string[] = [];
  if (era && era.fields) {
    const loaded = Array.isArray(era.fields.variables_loaded)
      ? (era.fields.variables_loaded as string[])
      : [];
    const deployed = Array.isArray(era.fields.variables_deployed)
      ? (era.fields.variables_deployed as string[])
      : [];
    const allVars = [...loaded, ...deployed].join(' ');

    if (/E\b|Elite/i.test(allVars)) deployedTiers.push('E');
    if (/P_uppet|Puppet|\bP\b/i.test(allVars)) deployedTiers.push('P');
    if (/F_enforce|Enforce|\bF\b/i.test(allVars)) deployedTiers.push('F');
    if (/I_buffer|Buffer|\bI\b/i.test(allVars)) deployedTiers.push('I');
    if (/O_racialized|Out-group|\bO\b/i.test(allVars)) deployedTiers.push('O');
  }

  return {
    modelDefault: true,
    ...DEFAULT_MODEL,
    deployedTiers: deployedTiers.length > 0 ? deployedTiers : ['E', 'P', 'F', 'I', 'O'],
  };
}

export function FiveTierConeView(props: FiveTierConeViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveFiveTierConeView {...props} />;
  }
  return <StaticFiveTierConeView {...props} />;
}

// ---------------------------------------------------------------------------
// STATIC RENDER (deterministic: zero useState / useEffect / useReducer)
// ---------------------------------------------------------------------------
function StaticFiveTierConeView(props: FiveTierConeViewProps): JSX.Element {
  const eraData = fiveTierConeFromEra(props.era);
  const model: FiveTierConeModel = {
    el: eraData.el,
    az: eraData.az,
    al: eraData.al,
    e1: eraData.e1,
    e2: eraData.e2,
    e3: eraData.e3,
    lock: eraData.lock,
  };

  if (props.mode === 'compact') {
    return <CompactView width={props.width} height={props.height} model={model} />;
  }
  if (props.mode === 'settings') {
    return (
      <SettingsView
        width={props.width}
        height={props.height}
        model={model}
        modelDefault={eraData.modelDefault}
      />
    );
  }
  return (
    <ExpandedView
      width={props.width}
      height={props.height}
      model={model}
      interactive={false}
      deployedTiers={eraData.deployedTiers}
    />
  );
}

// ---------------------------------------------------------------------------
// INTERACTIVE RENDER (client-side only, when interactive: true)
// ---------------------------------------------------------------------------
function InteractiveFiveTierConeView(props: FiveTierConeViewProps): JSX.Element {
  const eraData = fiveTierConeFromEra(props.era);
  const [model, setModel] = useState<FiveTierConeModel>({
    el: eraData.el,
    az: eraData.az,
    al: eraData.al,
    e1: eraData.e1,
    e2: eraData.e2,
    e3: eraData.e3,
    lock: eraData.lock,
  });

  const enc = computeEnclosure(model.e1, model.e2, model.e3);
  const maxEl = model.lock ? -90 + 180 * (1 - enc) : 90;
  const clampedEl = Math.min(model.el, maxEl);

  const setViewPreset = (el: number, az: number) => {
    setModel(prev => ({...prev, el: Math.min(el, maxEl), az}));
  };

  if (props.mode === 'compact') {
    return <CompactView width={props.width} height={props.height} model={{...model, el: clampedEl}} />;
  }
  if (props.mode === 'settings') {
    return (
      <SettingsView
        width={props.width}
        height={props.height}
        model={{...model, el: clampedEl}}
        modelDefault={eraData.modelDefault}
      />
    );
  }

  return (
    <ExpandedView
      width={props.width}
      height={props.height}
      model={{...model, el: clampedEl}}
      interactive={true}
      deployedTiers={eraData.deployedTiers}
      onUpdateModel={next => setModel(prev => ({...prev, ...next}))}
      onSelectPreset={setViewPreset}
    />
  );
}

// ---------------------------------------------------------------------------
// 1. COMPACT VIEW (content box 177 × 80)
// ---------------------------------------------------------------------------
function CompactView({
  width,
  height,
  model,
}: {
  width: number;
  height: number;
  model: FiveTierConeModel;
}) {
  const enc = computeEnclosure(model.e1, model.e2, model.e3);
  const maxEl = computeElMax(model.e1, model.e2, model.e3, model.lock);
  const effEl = Math.min(model.el, maxEl);
  const vis = computeVisible(model.al);

  // Palette from stage tokens
  const cInk = color('color/text/primary');
  const cInk2 = color('color/text/muted');
  const cGold = color('color/fill/gold');
  const cDim = color('color/text/dim');
  const cRule = color('color/line/chart');

  // Side-elevation mini-graphic (el ~ 12° gives 3D depth to discs)
  const miniEl = effEl < -80 ? -90 : 12;
  const miniAz = -28;
  const se = Math.abs(Math.sin(miniEl * D2R));

  const miniSc = 6.2;
  const mx0 = 33;
  const my0 = 28;

  const bc = proj3D(0, 0, 0, miniAz, miniEl, miniSc, mx0, my0);
  const ap = proj3D(0, 0, H, miniAz, miniEl, miniSc, mx0, my0);

  type MiniItem = {d: number; node: React.ReactNode};
  const items: MiniItem[] = [];

  // Base O
  items.push({
    d: bc.d,
    node: (
      <ellipse
        key="O"
        cx={bc.x.toFixed(1)}
        cy={bc.y.toFixed(1)}
        rx={(RB * miniSc).toFixed(1)}
        ry={Math.max(0.6, RB * miniSc * se).toFixed(1)}
        fill={BASE_O_DEF.color}
        fillOpacity={0.15}
        stroke={BASE_O_DEF.color}
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />
    ),
  });

  // Tiers E, P, F, I
  TIERS_DEF.forEach(t => {
    const c = tierCtr(t, model.al);
    const p = proj3D(c[0], c[1], t.z, miniAz, miniEl, miniSc, mx0, my0);
    const rx = t.r * miniSc;
    const ry = Math.max(0.6, t.r * miniSc * se);
    items.push({
      d: p.d,
      node: (
        <ellipse
          key={t.k}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          rx={rx.toFixed(1)}
          ry={ry.toFixed(1)}
          fill={t.color}
          stroke={color('color/surface/well')}
          strokeWidth={1}
        />
      ),
    });
  });

  items.sort((a, b) => a.d - b.d);

  // Hull path for mini cone
  const hullPts = computeConeHull(miniAz, miniEl, miniSc, mx0, my0);
  const dh = hullPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z';

  return (
    <div
      data-view="compact"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px 8px 6px',
        fontFamily: Tokens.fonts.mono,
        color: cInk,
        overflow: 'hidden',
      }}
    >
      {/* 11 px mono title */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.04em',
          color: cInk2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          lineHeight: '13px',
        }}
      >
        <span>FIVE-TIER CONE</span>
        <span style={{fontSize: 9, color: cDim}}>3D HIERARCHY</span>
      </div>

      {/* Mini-graphic and values */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          flex: 1,
        }}
      >
        <svg
          width={66}
          height={52}
          viewBox="0 0 66 52"
          role="img"
          aria-label="Five-tier cone side view"
          style={{display: 'block', flexShrink: 0}}
        >
          <path d={dh} fill={cRule} fillOpacity={0.12} />
          {items.map(it => it.node)}
          <path d={dh} fill="none" stroke={cRule} strokeWidth={1} strokeOpacity={0.7} />
          <line
            x1={ap.x.toFixed(1)}
            y1={ap.y.toFixed(1)}
            x2={ap.x.toFixed(1)}
            y2={(ap.y - 4).toFixed(1)}
            stroke={cInk}
            strokeWidth={1}
          />
        </svg>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2.5,
            flex: 1,
            minWidth: 0,
            textAlign: 'right',
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: cInk,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            E vis <span style={{color: vis === 0 ? '#7CC08A' : color('color/fill/accent')}}>{Math.round(vis * 100)}%</span>
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: cInk2,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <MathText>{'S_{enc}'}</MathText>{' '}
            <span style={{color: cGold, fontWeight: 500}}>{enc.toFixed(2)}</span>
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: cDim,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {`max el ${Math.round(maxEl)}°`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. EXPANDED VIEW (content box 1368 × 828)
// ---------------------------------------------------------------------------
function ExpandedView({
  width,
  height,
  model,
  interactive,
  deployedTiers,
  onUpdateModel,
  onSelectPreset,
}: {
  width: number;
  height: number;
  model: FiveTierConeModel;
  interactive: boolean;
  deployedTiers?: string[];
  onUpdateModel?: (next: Partial<FiveTierConeModel>) => void;
  onSelectPreset?: (el: number, az: number) => void;
}) {
  const enc = computeEnclosure(model.e1, model.e2, model.e3);
  const maxEl = computeElMax(model.e1, model.e2, model.e3, model.lock);
  const effEl = Math.min(model.el, maxEl);
  const vis = computeVisible(model.al);
  const verdict = verdictText(effEl, model.lock, maxEl, vis);

  const cInk = color('color/text/primary');
  const cInk2 = color('color/text/muted');
  const cGold = color('color/fill/gold');
  const cDim = color('color/text/dim');
  const cRule = color('color/line/chart');
  const cWell = color('color/surface/well');
  const cPanel = color('color/surface/1');

  const activePreset =
    effEl < -80 ? 'in' : Math.abs(effEl) < 3 && model.az === -28 ? 'side' : effEl === 22 && model.az === -28 ? 'out' : null;

  return (
    <div
      data-view="expanded"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: Tokens.fonts.sans,
        color: cInk,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid rgba(138,106,69,0.45)`,
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: cInk,
            }}
          >
            Five-Tier Cone
          </h1>
          <span
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 11,
              letterSpacing: '0.06em',
              color: cGold,
              textTransform: 'uppercase',
            }}
          >
            Orthographic 3D Hierarchy
          </span>
        </div>
        <p style={{margin: 0, fontSize: 13, lineHeight: 1.45, color: cInk2, maxWidth: '120ch'}}>
          <MathText>
            {
              'The hierarchy is a 3-D cone: E at the apex, P_{uppet}, F_{enforce}, and I_{buffer} as descending layers, O enclosed at the base. From inside O, looking up the axis, orthographic projection hides the apex behind the lower layers: the Flat Ceiling. Enclosure keeps the observer from stepping outside to see the whole cone.'
            }
          </MathText>
        </p>
      </header>

      {/* Main 2-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '700px minmax(0, 1fr)',
          gap: 22,
          flex: 1,
          minHeight: 0,
          alignItems: 'start',
        }}
      >
        {/* Left column: Cone card */}
        <section
          style={{
            background: cPanel,
            border: `1px solid ${cRule}`,
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
          aria-label="Cone visualization"
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2
              style={{
                fontFamily: Tokens.fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: cDim,
                margin: 0,
              }}
            >
              The cone{' '}
              {interactive && (
                <span style={{textTransform: 'none', letterSpacing: 0, color: cInk2}}>
                  · drag to rotate; drag down to sink into O
                </span>
              )}
            </h2>
            <div style={{display: 'flex', gap: 6}}>
              {(
                [
                  {id: 'out', label: 'Outside view', el: 22, az: -28},
                  {id: 'side', label: 'Side view', el: 0, az: -28},
                  {id: 'in', label: 'From inside O', el: -90, az: 0},
                ] as const
              ).map(btn => {
                const isActive = activePreset === btn.id;
                return interactive ? (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => onSelectPreset?.(btn.el, btn.az)}
                    style={{
                      fontFamily: Tokens.fonts.sans,
                      fontSize: 11.5,
                      fontWeight: 500,
                      padding: '4px 8px',
                      border: `1px solid ${isActive ? cGold : cRule}`,
                      borderRadius: 5,
                      background: cWell,
                      color: isActive ? cGold : cInk,
                      cursor: 'pointer',
                    }}
                  >
                    {btn.label}
                  </button>
                ) : (
                  <div
                    key={btn.id}
                    style={{
                      fontFamily: Tokens.fonts.sans,
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '3px 7px',
                      border: `1px solid ${isActive ? cGold : 'rgba(138,106,69,0.4)'}`,
                      borderRadius: 5,
                      background: cWell,
                      color: isActive ? cGold : cDim,
                    }}
                  >
                    {btn.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cone 3D SVG */}
          <ConeSvg
            width={668}
            height={440}
            el={effEl}
            az={model.az}
            al={model.al}
            interactive={interactive}
            onDrag={(dAz, dEl) => {
              if (!interactive || !onUpdateModel) return;
              const nextAz = (((model.az + dAz + 540) % 360) - 180);
              const nextEl = Math.max(-90, Math.min(maxEl, model.el + dEl));
              onUpdateModel({az: nextAz, el: nextEl});
            }}
            deployedTiers={deployedTiers}
          />

          {/* Controls: Elevation & Azimuth */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2}}>
            <ControlRow
              label="Elevation"
              sub="−90° looks up from O"
              value={effEl}
              min={-90}
              max={90}
              step={1}
              unit="°"
              interactive={interactive}
              onChange={v => onUpdateModel?.({el: Math.min(v, maxEl)})}
            />
            <ControlRow
              label="Azimuth"
              value={model.az}
              min={-180}
              max={180}
              step={1}
              unit="°"
              interactive={interactive}
              onChange={v => onUpdateModel?.({az: v})}
            />
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              paddingTop: 6,
              borderTop: `1px solid rgba(138,106,69,0.35)`,
            }}
          >
            <div>
              <div style={{fontSize: 11, color: cInk2}}>E visible from inside O</div>
              <div
                style={{
                  fontFamily: Tokens.fonts.mono,
                  fontSize: 14,
                  fontWeight: 500,
                  color: vis === 0 ? '#7CC08A' : color('color/fill/accent'),
                  marginTop: 2,
                }}
              >
                {Math.round(100 * vis)}%
              </div>
            </div>
            <div>
              <div style={{fontSize: 11, color: cInk2}}>
                <MathText>{'Enclosure S_{enc}'}</MathText>
              </div>
              <div
                style={{
                  fontFamily: Tokens.fonts.mono,
                  fontSize: 14,
                  fontWeight: 500,
                  color: cGold,
                  marginTop: 2,
                }}
              >
                {enc.toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 11, color: cInk2}}>Highest view allowed</div>
              <div
                style={{
                  fontFamily: Tokens.fonts.mono,
                  fontSize: 14,
                  fontWeight: 500,
                  color: cInk,
                  marginTop: 2,
                }}
              >
                {Math.round(maxEl)}°
              </div>
            </div>
          </div>

          {/* Verdict paragraph */}
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.45,
              color: effEl < -80 && vis < 0.01 ? '#7CC08A' : cInk,
              background: cWell,
              padding: '6px 10px',
              borderRadius: 6,
              border: `1px solid rgba(138,106,69,0.3)`,
            }}
          >
            <MathText>{verdict}</MathText>
          </div>
        </section>

        {/* Right column: Controls & Legend */}
        <section
          style={{
            background: cPanel,
            border: `1px solid ${cRule}`,
            borderRadius: 10,
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
          aria-label="Alignment and enclosure parameters"
        >
          <h2
            style={{
              fontFamily: Tokens.fonts.sans,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cDim,
              margin: 0,
            }}
          >
            Alignment and enclosure
          </h2>

          <ControlRow
            label="Tier alignment"
            sub="θ-collapse, eq. 14.5"
            value={model.al}
            min={0}
            max={1}
            step={0.01}
            digits={2}
            interactive={interactive}
            onChange={v => onUpdateModel?.({al: v})}
          />
          <p style={{margin: '0 0 4px', fontSize: 12, lineHeight: 1.4, color: cInk2}}>
            {`At 1.00, P, F, and I sit on E’s sightline, so the four nodes eclipse.${interactive ? ' Lower it to pull the tiers off their common axis and watch E come into view from below.' : ''}`}
          </p>

          <div
            style={{
              borderTop: `1px solid rgba(138,106,69,0.35)`,
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <h3
              style={{
                fontFamily: Tokens.fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                color: cInk,
                margin: '0 0 2px',
              }}
            >
              Tri-Modal Enclosure
            </h3>

            <ControlRow
              label={
                <span>
                  <MathText>{'e_1'}</MathText> communal capacity
                </span>
              }
              value={model.e1}
              min={0}
              max={1}
              step={0.01}
              digits={2}
              interactive={interactive}
              onChange={v => onUpdateModel?.({e1: v})}
            />
            <ControlRow
              label={
                <span>
                  <MathText>{'e_2'}</MathText> mobility
                </span>
              }
              value={model.e2}
              min={0}
              max={1}
              step={0.01}
              digits={2}
              interactive={interactive}
              onChange={v => onUpdateModel?.({e2: v})}
            />
            <ControlRow
              label={
                <span>
                  <MathText>{'e_3'}</MathText> epistemic
                </span>
              }
              value={model.e3}
              min={0}
              max={1}
              step={0.01}
              digits={2}
              interactive={interactive}
              onChange={v => onUpdateModel?.({e3: v})}
            />

            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 2}}>
              {interactive ? (
                <input
                  type="checkbox"
                  id="ftc-lock-toggle"
                  checked={model.lock}
                  onChange={e => onUpdateModel?.({lock: e.target.checked})}
                  style={{accentColor: cGold, cursor: 'pointer'}}
                />
              ) : (
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 3,
                    background: model.lock ? cGold : cWell,
                    border: `1px solid ${cRule}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: cWell,
                    fontWeight: 700,
                  }}
                >
                  {model.lock ? '✓' : ''}
                </div>
              )}
              <label
                htmlFor="ftc-lock-toggle"
                style={{fontSize: 12.5, color: cInk, cursor: interactive ? 'pointer' : 'default'}}
              >
                Enclosure limits the observer’s view
              </label>
            </div>
            <p style={{margin: '2px 0 6px', fontSize: 11.5, lineHeight: 1.4, color: cInk2}}>
              <MathText>
                {
                  'S_{enc} = (1/√2)·√(((e_1 + e_2)/2)^2 + e_3^2) (eq. 1.1). With the limit on, the highest elevation the observer can reach is −90° + 180°·(1 − S_{enc}). At total enclosure the observer is held at −90°, under the Flat Ceiling.'
                }
              </MathText>
            </p>
          </div>

          {/* Circuit nodes legend */}
          <div
            style={{
              borderTop: `1px solid rgba(138,106,69,0.35)`,
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <h3
              style={{
                fontFamily: Tokens.fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                color: cInk,
                margin: '0 0 2px',
              }}
            >
              Nodes as circuit elements
            </h3>
            <ul style={{listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 5}}>
              {TIERS_DEF.map(t => (
                <li
                  key={t.k}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '12px 64px minmax(0, 1fr)',
                    gap: 8,
                    alignItems: 'baseline',
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: t.color,
                      transform: 'translateY(1px)',
                    }}
                  />
                  <b style={{fontFamily: Tokens.fonts.mono, fontSize: 12, color: cInk}}>
                    <MathText>{t.mathLabel}</MathText>
                  </b>
                  <span style={{color: cInk2, lineHeight: 1.35}}>{t.circuitRole}</span>
                </li>
              ))}
              <li
                style={{
                  display: 'grid',
                  gridTemplateColumns: '12px 64px minmax(0, 1fr)',
                  gap: 8,
                  alignItems: 'baseline',
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: BASE_O_DEF.color,
                    transform: 'translateY(1px)',
                  }}
                />
                <b style={{fontFamily: Tokens.fonts.mono, fontSize: 12, color: cInk}}>O</b>
                <span style={{color: cInk2, lineHeight: 1.35}}>{BASE_O_DEF.circuitRole}</span>
              </li>
            </ul>
            <div style={{fontSize: 11.5, color: cGold, marginTop: 4}}>
              <MathText>
                {'Benefit(E) ≫ Benefit(P) > Benefit(F) > Benefit(I) > Benefit(O) (eq. 0.2).'}
              </MathText>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. SETTINGS VIEW (content box 1368 × 828)
// ---------------------------------------------------------------------------
function SettingsView({
  width,
  height,
  model,
  modelDefault,
}: {
  width: number;
  height: number;
  model: FiveTierConeModel;
  modelDefault: boolean;
}) {
  const enc = computeEnclosure(model.e1, model.e2, model.e3);
  const maxEl = computeElMax(model.e1, model.e2, model.e3, model.lock);

  const cInk = color('color/text/primary');
  const cInk2 = color('color/text/muted');
  const cGold = color('color/fill/gold');
  const cRule = color('color/line/chart');
  const cWell = color('color/surface/well');
  const cPanel = color('color/surface/1');

  return (
    <div
      data-view="settings"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: Tokens.fonts.sans,
        color: cInk,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid rgba(138,106,69,0.45)`,
          paddingBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 3px',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: cInk,
            }}
          >
            SETTINGS · FIVE-TIER CONE
          </h1>
          <p style={{margin: 0, fontSize: 13, color: cInk2}}>
            Hierarchy geometry, Tri-Modal Enclosure parameters, and node circuit specs
          </p>
        </div>
        <div
          style={{
            fontFamily: Tokens.fonts.mono,
            fontSize: 11,
            letterSpacing: '0.06em',
            color: cGold,
          }}
        >
          MODEL PARAMETERS &amp; SOURCES
        </div>
      </header>

      {/* Model default note if applicable */}
      {modelDefault && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(224,163,60,0.12)',
            border: `1px solid ${cGold}`,
            borderRadius: 6,
            fontFamily: Tokens.fonts.mono,
            fontSize: 12.5,
            color: cGold,
          }}
        >
          Model default: this log does not set this instrument.
        </div>
      )}

      {/* 3-Column Specifications Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.2fr',
          gap: 18,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Col 1: Model parameters */}
        <div
          style={{
            background: cPanel,
            border: `1px solid ${cRule}`,
            borderRadius: 8,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <h2
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cGold,
              margin: 0,
            }}
          >
            Model parameters (read-only)
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {[
              {label: <span>Elevation (el)</span>, val: `${model.el}°`, note: <span>range −90° to 90°</span>},
              {label: <span>Azimuth (az)</span>, val: `${model.az}°`, note: <span>range −180° to 180°</span>},
              {label: <span>Alignment (al)</span>, val: model.al.toFixed(2), note: <span><MathText>{'θ_{collapse}, eq. 14.5'}</MathText></span>},
              {label: <span>Communal capacity (<MathText>{'e_1'}</MathText>)</span>, val: model.e1.toFixed(2), note: <span>Tri-Modal axis 1</span>},
              {label: <span>Mobility enclosure (<MathText>{'e_2'}</MathText>)</span>, val: model.e2.toFixed(2), note: <span>Tri-Modal axis 2</span>},
              {label: <span>Epistemic enclosure (<MathText>{'e_3'}</MathText>)</span>, val: model.e3.toFixed(2), note: <span>Tri-Modal axis 3</span>},
              {label: <span>Enclosure score (<MathText>{'S_{enc}'}</MathText>)</span>, val: enc.toFixed(2), note: <span>eq. 1.1 unrationalized</span>},
              {label: <span>Highest view allowed</span>, val: `${Math.round(maxEl)}°`, note: <span><MathText>{'−90° + 180°·(1 − S_{enc})'}</MathText></span>},
              {label: <span>Enclosure limits view</span>, val: model.lock ? 'true' : 'false', note: <span>view lock toggle</span>},
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  background: cWell,
                  padding: '5px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{color: cInk}}>{row.label}</span>
                  <span style={{fontSize: 10, color: cInk2, marginLeft: 6}}>({row.note})</span>
                </div>
                <span
                  style={{
                    fontFamily: Tokens.fonts.mono,
                    fontWeight: 500,
                    color: cGold,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Geometry & Circuit Roles */}
        <div
          style={{
            background: cPanel,
            border: `1px solid ${cRule}`,
            borderRadius: 8,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <h2
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cGold,
              margin: 0,
            }}
          >
            Tier Geometry &amp; Circuit Elements
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {TIERS_DEF.map(t => (
              <div
                key={t.k}
                style={{
                  background: cWell,
                  padding: '7px 9px',
                  borderRadius: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <span style={{fontFamily: Tokens.fonts.mono, fontSize: 13, fontWeight: 600, color: t.color}}>
                    <MathText>{t.mathLabel}</MathText>
                  </span>
                  <span style={{fontFamily: Tokens.fonts.mono, fontSize: 11, color: cInk2}}>
                    z = {t.z} · r = {t.r.toFixed(2)}
                  </span>
                </div>
                <div style={{fontSize: 11.5, color: cInk, lineHeight: 1.35}}>
                  {t.circuitRole}
                </div>
              </div>
            ))}
            <div
              style={{
                background: cWell,
                padding: '7px 9px',
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span
                  style={{
                    fontFamily: Tokens.fonts.mono,
                    fontSize: 13,
                    fontWeight: 600,
                    color: BASE_O_DEF.color,
                  }}
                >
                  O (Out-group)
                </span>
                <span style={{fontFamily: Tokens.fonts.mono, fontSize: 11, color: cInk2}}>
                  z = 0 · r = 4.00
                </span>
              </div>
              <div style={{fontSize: 11.5, color: cInk, lineHeight: 1.35}}>
                {BASE_O_DEF.circuitRole}
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: What comes from where / Sources */}
        <div
          style={{
            background: cPanel,
            border: `1px solid ${cRule}`,
            borderRadius: 8,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <h2
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cGold,
              margin: 0,
            }}
          >
            What comes from where / Sources
          </h2>

          <div
            style={{
              background: cWell,
              padding: '10px 12px',
              borderRadius: 6,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: cInk,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div>
              <b style={{color: cGold}}>From the manuscript:</b> the five nodes and the 3-D cone,
              E at the apex on the z-axis and O enclosed at the base (
              <code>Paper/The_Original_Power.tex:486</code>–<code>:593</code>); the node-to-circuit-element
              table and the voltage-drop ordering, eq. 0.2 (<code>:604</code>–<code>:650</code>);
              the Tri-Modal Enclosure score, eq. 1.1 (<code>:713</code>); the Flat Ceiling, Elite
              Obscuration, and the observer on the axis (<code>:770</code>–<code>:810</code>); the
              angular-collapse condition θ<sub>E</sub> = θ<sub>P</sub> = θ<sub>F</sub> = θ<sub>I</sub>,
              eq. 14.5 (<code>:13751</code>).
            </div>

            <div>
              <b style={{color: cGold}}>Projection &amp; Model:</b> The page draws the cone in
              orthographic projection, as the manuscript specifies. Tier heights and radii follow
              the manuscript’s figure: each layer is a slice of the cone, so a lower layer is wider
              than the ones above it.
            </div>

            <div>
              <b style={{color: cGold}}>Page devices:</b> Two links are the page’s own devices:
              the elevation limit tied to S<sub>enc</sub> (the manuscript says enclosure prevents
              the observer from stepping outside the cone; the page turns that into a limit on the
              viewing angle), and the alignment control (the page shifts the four upper tiers apart,
              off their common axis, by fixed amounts to show what the θ-collapse prevents).
              &ldquo;E visible from inside O&rdquo; is the share of E’s disc that no lower disc
              covers in the view straight up the axis.
            </div>

            <div style={{color: cGold, fontSize: 12}}>
              <MathText>
                {'S_{enc} = (1/√2)·√(((e_1 + e_2)/2)^2 + e_3^2) (eq. 1.1 · 1/√2 unrationalized).'}
              </MathText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELPER: CONE SVG RENDERER (720 × 560 viewBox scaled to container)
// ---------------------------------------------------------------------------
function ConeSvg({
  width,
  height,
  el,
  az,
  al,
  interactive,
  onDrag,
  deployedTiers,
}: {
  width: number;
  height: number;
  el: number;
  az: number;
  al: number;
  interactive: boolean;
  onDrag?: (dAz: number, dEl: number) => void;
  deployedTiers?: string[];
}) {
  const se = Math.abs(Math.sin(el * D2R));
  const cInk = color('color/text/primary');
  const cInk2 = color('color/text/muted');
  const cRule = color('color/line/chart');
  const cWell = color('color/surface/well');
  const cWire = color('color/text/primary');

  const ap = proj3D(0, 0, H, az, el);
  const bc = proj3D(0, 0, 0, az, el);
  const hullPts = computeConeHull(az, el);
  const dh = hullPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('') + 'Z';

  type DepthItem = {d: number; node: React.ReactNode};
  const items: DepthItem[] = [];

  // Base O
  const isODeployed = !deployedTiers || deployedTiers.includes('O');
  items.push({
    d: bc.d,
    node: (
      <g key="O">
        <ellipse
          cx={bc.x.toFixed(1)}
          cy={bc.y.toFixed(1)}
          rx={(RB * SC).toFixed(1)}
          ry={Math.max(0.8, RB * SC * se).toFixed(1)}
          fill={BASE_O_DEF.color}
          fillOpacity={isODeployed ? 0.10 : 0.04}
          stroke={BASE_O_DEF.color}
          strokeWidth={2}
          strokeDasharray="7 5"
        />
        {/* Top shadow on O */}
        {el > 0.5 && (
          <g clipPath="url(#ftc-cp-O)" opacity={0.42}>
            {TIERS_DEF.map(t => {
              const c = tierCtr(t, al);
              const p = proj3D(c[0], c[1], 0, az, el);
              return (
                <ellipse
                  key={t.k}
                  cx={p.x.toFixed(1)}
                  cy={p.y.toFixed(1)}
                  rx={(t.r * SC).toFixed(1)}
                  ry={Math.max(0.8, t.r * SC * se).toFixed(1)}
                  fill="#000"
                />
              );
            })}
          </g>
        )}
        <text
          x={(bc.x + RB * SC * 0.72).toFixed(1)}
          y={(bc.y + Math.max(14, RB * SC * se * 0.72) + 4).toFixed(1)}
          fontSize={15}
          fontFamily={Tokens.fonts.mono}
          fill={BASE_O_DEF.color}
        >
          O
        </text>
      </g>
    ),
  });

  // Tiers E, P, F, I
  TIERS_DEF.forEach(t => {
    const isDeployed = !deployedTiers || deployedTiers.includes(t.k);
    const c = tierCtr(t, al);
    const p = proj3D(c[0], c[1], t.z, az, el);
    const rx = t.r * SC;
    const ry = Math.max(0.8, t.r * SC * se);
    const lx = p.x + rx * Math.cos(-0.6);
    const ly = p.y + ry * Math.sin(-0.6) - (se < 0.25 ? 10 : 0);

    items.push({
      d: p.d,
      node: (
        <g key={t.k}>
          <ellipse
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            rx={rx.toFixed(1)}
            ry={ry.toFixed(1)}
            fill={t.color}
            stroke={cWell}
            strokeWidth={2}
            fillOpacity={isDeployed ? 1 : 0.28}
            filter={t.k === 'E' ? 'url(#ftc-gl)' : undefined}
          />
          {/* Top shadows from tiers above t */}
          {el > 0.5 && (
            <g clipPath={`url(#ftc-cp-${t.k})`} opacity={0.42}>
              {TIERS_DEF.filter(other => other.z > t.z + 1e-6).map(other => {
                const oc = tierCtr(other, al);
                const op = proj3D(oc[0], oc[1], t.z, az, el);
                return (
                  <ellipse
                    key={other.k}
                    cx={op.x.toFixed(1)}
                    cy={op.y.toFixed(1)}
                    rx={(other.r * SC).toFixed(1)}
                    ry={Math.max(0.8, other.r * SC * se).toFixed(1)}
                    fill="#000"
                  />
                );
              })}
            </g>
          )}
          {/* Underside shadow when looking from below */}
          {el < -0.5 && (
            <ellipse
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              rx={rx.toFixed(1)}
              ry={ry.toFixed(1)}
              fill="#000"
              fillOpacity={0.34}
            />
          )}
          {/* Tier Label */}
          <text
            x={(lx + 6).toFixed(1)}
            y={(ly - 4).toFixed(1)}
            fontSize={15}
            fontWeight={500}
            fontFamily={Tokens.fonts.mono}
            fill={cInk}
            style={{
              paintOrder: 'stroke',
              stroke: cWell,
              strokeWidth: 4,
            }}
          >
            {t.k}
          </text>
        </g>
      ),
    });
  });

  items.sort((a, b) => a.d - b.d);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 720 560"
      role="img"
      aria-label="The five-tier cone, orthographic 3D projection"
      style={{
        display: 'block',
        background: cWell,
        borderRadius: 8,
        touchAction: 'none',
        cursor: interactive ? 'grab' : 'default',
      }}
      onPointerDown={e => {
        if (!interactive || !onDrag) return;
        const target = e.currentTarget;
        const startX = e.clientX;
        const startY = e.clientY;
        const b = target.getBoundingClientRect();
        const k = 360 / (b.width || 720);

        const onMove = (ev: PointerEvent) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          onDrag(dx * k * 0.6, -dy * k * 0.5);
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
      }}
    >
      <defs>
        <filter id="ftc-gl" filterUnits="userSpaceOnUse" x="0" y="0" width="720" height="560">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ClipPaths for shadows */}
        <clipPath id="ftc-cp-O">
          <ellipse
            cx={bc.x.toFixed(1)}
            cy={bc.y.toFixed(1)}
            rx={(RB * SC).toFixed(1)}
            ry={Math.max(0.8, RB * SC * se).toFixed(1)}
          />
        </clipPath>
        {TIERS_DEF.map(t => {
          const c = tierCtr(t, al);
          const p = proj3D(c[0], c[1], t.z, az, el);
          return (
            <clipPath key={t.k} id={`ftc-cp-${t.k}`}>
              <ellipse
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                rx={(t.r * SC).toFixed(1)}
                ry={Math.max(0.8, t.r * SC * se).toFixed(1)}
              />
            </clipPath>
          );
        })}
      </defs>

      {/* Cone hull fill */}
      <path d={dh} fill={cRule} fillOpacity={0.10} />

      {/* Items in depth order */}
      {items.map(it => it.node)}

      {/* Cone hull stroke */}
      <path d={dh} fill="none" stroke={cRule} strokeWidth={1.6} strokeOpacity={0.8} />

      {/* Axis line or bottom observer note */}
      {el < -80 ? (
        <text
          x={20}
          y={540}
          fontSize={13}
          fontFamily={Tokens.fonts.mono}
          fill={cInk2}
        >
          observer in O, looking straight up the z-axis
        </text>
      ) : (
        (() => {
          const za = proj3D(0, 0, H + 0.6, az, el);
          return (
            <g>
              <line
                x1={ap.x.toFixed(1)}
                y1={ap.y.toFixed(1)}
                x2={za.x.toFixed(1)}
                y2={za.y.toFixed(1)}
                stroke={cWire}
                strokeWidth={1.5}
              />
              <text
                x={(za.x + 6).toFixed(1)}
                y={za.y.toFixed(1)}
                fontSize={13}
                fontFamily={Tokens.fonts.mono}
                fill={cWire}
              >
                z
              </text>
            </g>
          );
        })()
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// HELPER: CONTROL ROW (interactive input or static bar)
// ---------------------------------------------------------------------------
function ControlRow({
  label,
  sub,
  value,
  min,
  max,
  step,
  digits = 0,
  unit = '',
  interactive,
  onChange,
}: {
  label: React.ReactNode;
  sub?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  unit?: string;
  interactive: boolean;
  onChange?: (v: number) => void;
}) {
  const cInk = color('color/text/primary');
  const cInk2 = color('color/text/muted');
  const cGold = color('color/fill/gold');
  const cRule = color('color/line/chart');
  const cPanel = color('color/surface/well');

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '170px minmax(0, 1fr) 56px',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <div style={{fontSize: 13, color: cInk}}>
        <div>{label}</div>
        {sub && <div style={{fontSize: 11, color: cInk2}}>{sub}</div>}
      </div>

      <div>
        {interactive && onChange ? (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: cGold,
              minWidth: 0,
              cursor: 'pointer',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              position: 'relative',
              height: 14,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: 4,
                borderRadius: 99,
                background: cPanel,
                border: `1px solid ${cRule}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${pct.toFixed(1)}%`,
                  background: cGold,
                  opacity: 0.7,
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: `calc(${pct.toFixed(1)}% - 5px)`,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: cGold,
                border: `1.2px solid ${cInk}`,
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          fontFamily: Tokens.fonts.mono,
          fontSize: 12.5,
          fontWeight: 500,
          color: cInk,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toFixed(digits)}
        {unit}
      </div>
    </div>
  );
}
