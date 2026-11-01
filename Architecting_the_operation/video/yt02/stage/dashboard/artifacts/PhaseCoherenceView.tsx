import React, {useState, type JSX} from 'react';
import {useTokens, MathText, type InstrumentMode} from '@stage';
import {color, Tokens} from '../../tokens';

export type PhaseCoherenceViewProps = {
  mode: InstrumentMode;            // 'compact' | 'expanded' | 'settings'
  width: number; height: number;   // the content box you must fill (no panel chrome: no border,
                                   // background or outer padding; the integrator adds the panel)
  interactive: boolean;            // true only on the website
  era?: {log: number; fields: Record<string, unknown>};  // an entry of yt02/dashboard_eras.json
};

export type PhaseCoherenceInputs = {
  modelDefault: boolean;
  K: number;
  sig: number;
  tau: number;
  eng: number;
  hist: boolean;
  year: number;
  activeAxes: Record<string, boolean>;
  phiLoadOverride?: number;
};

export const AXES = [
  {k: 'race', name: 'Race', y: 0},
  {k: 'gender', name: 'Gender', y: 1972},
  {k: 'nat', name: 'Nationality', y: 1974},
  {k: 'sex', name: 'Sexuality', y: 1977},
  {k: 'rel', name: 'Religion', y: 1979},
  {k: 'abl', name: 'Ability', y: 1990},
] as const;

export const ANES_REFERENCES = [
  {y0: 1960, y1: 1964, val: 0.078, label: 'ANES pre-1964'},
  {y0: 1965, y1: 1980, val: 0.214, label: 'activation'},
  {y0: 1980, y1: 1990, val: 0.403, label: 'post-1980'},
] as const;

const N = 24;
const DT = 0.01;
const Y0 = 1960;
const Y1 = 2030;

function rng(seed: number) {
  return function(): number {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeDraw(rFn: () => number) {
  return function(): number[] {
    const a: number[] = [];
    for (let j = 0; j < N; j++) a.push(2 * rFn() - 1);
    return a;
  };
}

function makeGauss(rFn: () => number) {
  return function(): number {
    const u = rFn() || 1e-9;
    const v = rFn();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

function order(ph: number[]): {r: number; psi: number} {
  let c = 0;
  let s = 0;
  for (let j = 0; j < ph.length; j++) {
    c += Math.cos(ph[j]);
    s += Math.sin(ph[j]);
  }
  c /= ph.length;
  s /= ph.length;
  return {r: Math.hypot(c, s), psi: Math.atan2(s, c)};
}

function bisect(fn: (x: number) => number, target: number): number {
  let lo = 0;
  let hi = 3;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) < target) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

function computeOffsets(
  on: Record<string, boolean>,
  amp: Record<string, number>,
  u: Record<string, number[]>
): number[] {
  const o: number[] = new Array(N).fill(0);
  for (const a of AXES) {
    if (on[a.k] && u[a.k]) {
      const uArr = u[a.k];
      const factor = amp[a.k] || 0;
      for (let j = 0; j < N; j++) {
        o[j] += factor * uArr[j];
      }
    }
  }
  return o;
}

// Module-level precomputed calibration
const initialCalib = (() => {
  const R = rng(20260611);
  const draw = makeDraw(R);
  const initialU: Record<string, number[]> = {};
  for (const a of AXES) {
    initialU[a.k] = draw();
  }

  const ar = bisect(x => {
    const o = computeOffsets({race: true}, {race: x}, initialU);
    return 1 - order(o).r;
  }, 0.078);

  const an = bisect(x => {
    const ampTest = {race: ar, gender: x, nat: x, sex: x, rel: x, abl: x};
    const o = computeOffsets({race: true, gender: true, nat: true, sex: true, rel: true}, ampTest, initialU);
    return 1 - order(o).r;
  }, 0.403);

  const amp = {race: ar, gender: an, nat: an, sex: an, rel: an, abl: an};
  return {initialU, amp};
})();

export type SimSnapshot = {
  phi: number;
  r: number;
  psi: number;
  phases: number[];
  on: Record<string, boolean>;
};

export type SimResult = {
  hist: [number, number][]; // [year, phi_load]
  elections: number[];
  yearly: Record<number, SimSnapshot>;
};

const simCache = new Map<string, SimResult>();

export function runSimulation(inputs: {
  K: number;
  sig: number;
  tau: number;
  eng: number;
  hist: boolean;
}): SimResult {
  const cacheKey = `${inputs.K}_${inputs.sig}_${inputs.tau}_${inputs.eng}_${inputs.hist}`;
  const existing = simCache.get(cacheKey);
  if (existing) return existing;

  const R = rng(20260611);
  const draw = makeDraw(R);
  const gauss = makeGauss(R);
  for (let i = 0; i < AXES.length; i++) draw(); // Replicate the artifact's restart() sequence

  const u: Record<string, number[]> = {};
  for (const a of AXES) {
    u[a.k] = [...initialCalib.initialU[a.k]];
  }

  let t = Y0;
  const hist: [number, number][] = [];
  const elections: number[] = [];
  const theta: number[] = [];
  const w: number[] = [];
  for (let j = 0; j < N; j++) {
    theta.push(0);
    w.push(gauss());
  }

  const on: Record<string, boolean> = {};
  for (const a of AXES) {
    on[a.k] = inputs.hist ? a.y === 0 : true;
  }
  if (inputs.hist) on.race = true;

  let lastE = Y0;

  const calcPhases = () => {
    const o = computeOffsets(on, initialCalib.amp, u);
    return theta.map((th, j) => th + o[j]);
  };

  const step = () => {
    const ph = calcPhases();
    const z = order(ph);
    for (let j = 0; j < N; j++) {
      theta[j] += DT * (inputs.sig * w[j] + inputs.K * z.r * Math.sin(z.psi - ph[j]));
    }
    const y0 = t;
    t += DT;
    if (inputs.hist) {
      for (const a of AXES) {
        if (a.y && y0 < a.y && t >= a.y) {
          on[a.k] = true;
          u[a.k] = draw();
        }
      }
    }
    if (inputs.eng > 0) {
      const ey = Math.floor(t / inputs.eng) * inputs.eng;
      if (ey > lastE && ey > Y0) {
        lastE = ey;
        elections.push(ey);
        for (const a of AXES) {
          if (on[a.k]) u[a.k] = draw();
        }
      }
    }
  };

  const yearly: Record<number, SimSnapshot> = {};
  let curPhases = calcPhases();
  let curZ = order(curPhases);
  hist.push([t, 1 - curZ.r]);
  yearly[Math.floor(t)] = {
    phi: 1 - curZ.r,
    r: curZ.r,
    psi: curZ.psi,
    phases: curPhases,
    on: {...on},
  };

  while (t < Y1) {
    for (let k = 0; k < 4; k++) step();
    curPhases = calcPhases();
    curZ = order(curPhases);
    hist.push([t, 1 - curZ.r]);
    const yr = Math.floor(t);
    if (!yearly[yr]) {
      yearly[yr] = {
        phi: 1 - curZ.r,
        r: curZ.r,
        psi: curZ.psi,
        phases: curPhases,
        on: {...on},
      };
    }
  }

  yearly[Math.floor(t)] = {
    phi: 1 - curZ.r,
    r: curZ.r,
    psi: curZ.psi,
    phases: curPhases,
    on: {...on},
  };

  const result: SimResult = {hist, elections, yearly};
  simCache.set(cacheKey, result);
  return result;
}

export function phaseCoherenceFromEra(
  era?: {log: number; fields: Record<string, unknown>}
): PhaseCoherenceInputs {
  const base: PhaseCoherenceInputs = {
    modelDefault: true,
    K: 0,
    sig: 0,
    tau: 0.90,
    eng: 4,
    hist: true,
    year: 1980,
    activeAxes: {race: true, gender: true, nat: true, sex: true, rel: true, abl: false},
  };

  if (!era) {
    return base;
  }

  if (era.log === 14) {
    return {
      ...base,
      modelDefault: false,
      year: 1981,
      activeAxes: {race: true, gender: true, nat: true, sex: true, rel: true, abl: false},
    };
  }

  if (era.log === 15) {
    return {
      ...base,
      modelDefault: false,
      year: 2005,
      activeAxes: {race: true, gender: true, nat: true, sex: true, rel: true, abl: true},
    };
  }

  if (era.log === 17) {
    return {
      ...base,
      modelDefault: false,
      year: 2020,
      activeAxes: {race: true, gender: true, nat: true, sex: true, rel: true, abl: true},
    };
  }

  return {
    ...base,
    modelDefault: true,
  };
}

export function PhaseCoherenceView(props: PhaseCoherenceViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractivePhaseCoherenceView {...props} />;
  }
  return <StaticPhaseCoherenceView {...props} />;
}

function getActiveSnapshot(
  inputs: PhaseCoherenceInputs,
  sim: SimResult
): {phi: number; r: number; psi: number; phases: number[]; on: Record<string, boolean>} {
  const yr = Math.max(Y0, Math.min(Y1, Math.floor(inputs.year)));
  const baseSnap = sim.yearly[yr] || sim.yearly[Y0];

  if (!inputs.hist) {
    const o = computeOffsets(inputs.activeAxes, initialCalib.amp, initialCalib.initialU);
    const ord = order(o);
    return {
      phi: 1 - ord.r,
      r: ord.r,
      psi: ord.psi,
      phases: o,
      on: inputs.activeAxes,
    };
  }

  return baseSnap;
}

function StaticPhaseCoherenceView(props: PhaseCoherenceViewProps): JSX.Element {
  const inputs = phaseCoherenceFromEra(props.era);
  const sim = runSimulation({
    K: inputs.K,
    sig: inputs.sig,
    tau: inputs.tau,
    eng: inputs.eng,
    hist: inputs.hist,
  });

  const snap = getActiveSnapshot(inputs, sim);

  if (props.mode === 'compact') {
    return (
      <CompactPhaseCoherence
        width={props.width}
        height={props.height}
        inputs={inputs}
        snapshot={snap}
      />
    );
  }

  if (props.mode === 'settings') {
    return (
      <SettingsPhaseCoherence
        width={props.width}
        height={props.height}
        inputs={inputs}
        snapshot={snap}
        era={props.era}
      />
    );
  }

  return (
    <ExpandedPhaseCoherence
      width={props.width}
      height={props.height}
      inputs={inputs}
      snapshot={snap}
      sim={sim}
      interactive={false}
    />
  );
}

function CompactPhaseCoherence({
  width,
  height,
  inputs,
  snapshot,
}: {
  width: number;
  height: number;
  inputs: PhaseCoherenceInputs;
  snapshot: SimSnapshot;
}) {
  const r = snapshot.r;
  const phi = snapshot.phi;
  const tau = inputs.tau;
  const isPastTau = r >= tau;
  const tauCoral = '#FF7A6B';
  const teal = '#4CC2C2';
  const arrowCol = isPastTau ? tauCoral : color('color/fill/accent');

  // Mini circle geometry (viewBox 0 0 200 200, center 100, 100, R=76)
  const C = 100;
  const Rr = 76;
  const tx = C + Rr * r * Math.cos(snapshot.psi);
  const ty = C - Rr * r * Math.sin(snapshot.psi);
  const a = Math.atan2(ty - C, tx - C);
  const hl = 10;

  return (
    <div
      data-instrument="phase-coherence"
      data-mode="compact"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: Tokens.fonts.mono,
        color: color('color/text/primary'),
        padding: '3px 6px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontSize: 11,
          lineHeight: '13px',
          letterSpacing: '0.04em',
        }}
      >
        <span style={{color: color('color/text/primary'), fontWeight: 500}}>PHASE COHERENCE</span>
        <span style={{fontSize: 9.5, color: color('color/text/dim')}}>{Math.floor(inputs.year)}</span>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 7, flex: 1, minHeight: 0}}>
        <svg
          width={58}
          height={58}
          viewBox="0 0 200 200"
          style={{display: 'block', flexShrink: 0}}
          aria-label="Phase circle mini"
        >
          <circle cx={C} cy={C} r={Rr} fill="none" stroke={color('color/line/chart')} strokeWidth={1.5} />
          <circle
            cx={C}
            cy={C}
            r={Rr * tau}
            fill="none"
            stroke={tauCoral}
            strokeWidth={1.4}
            strokeDasharray="4 3"
          />
          <line x1={C - Rr - 4} y1={C} x2={C + Rr + 4} y2={C} stroke={color('color/line/chart')} strokeOpacity={0.4} />
          <line x1={C} y1={C - Rr - 4} x2={C} y2={C + Rr + 4} stroke={color('color/line/chart')} strokeOpacity={0.4} />
          {snapshot.phases.map((p, idx) => (
            <circle
              key={idx}
              cx={Number((C + Rr * Math.cos(p)).toFixed(1))}
              cy={Number((C - Rr * Math.sin(p)).toFixed(1))}
              r={3}
              fill={teal}
              fillOpacity={0.85}
            />
          ))}
          <line
            x1={C}
            y1={C}
            x2={Number((tx - hl * Math.cos(a)).toFixed(1))}
            y2={Number((ty - hl * Math.sin(a)).toFixed(1))}
            stroke={arrowCol}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M${tx.toFixed(1)} ${ty.toFixed(1)} L${(tx - hl * Math.cos(a) + 5 * Math.sin(a)).toFixed(1)} ${(ty - hl * Math.sin(a) - 5 * Math.cos(a)).toFixed(1)} L${(tx - hl * Math.cos(a) - 5 * Math.sin(a)).toFixed(1)} ${(ty - hl * Math.sin(a) + 5 * Math.cos(a)).toFixed(1)}Z`}
            fill={arrowCol}
          />
          <circle cx={C} cy={C} r={2.5} fill={color('color/text/primary')} />
        </svg>

        <div style={{display: 'flex', flexDirection: 'column', gap: 2, fontSize: 11, lineHeight: '14px'}}>
          <div style={{display: 'flex', gap: 4, alignItems: 'baseline'}}>
            <span style={{color: color('color/text/muted'), fontSize: 10}}>Φ</span>
            <span style={{fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>{phi.toFixed(2)}</span>
          </div>
          <div style={{display: 'flex', gap: 4, alignItems: 'baseline'}}>
            <span style={{color: color('color/text/muted'), fontSize: 10}}>r</span>
            <span
              style={{
                fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
                color: isPastTau ? tauCoral : color('color/text/primary'),
              }}
            >
              {r.toFixed(2)}
            </span>
          </div>
          <div style={{fontSize: 9, color: color('color/text/dim'), whiteSpace: 'nowrap'}}>
            {`τ ${tau.toFixed(2)}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandedPhaseCoherence({
  width,
  height,
  inputs,
  snapshot,
  sim,
  interactive,
  onChangeK,
  onChangeSig,
  onChangeTau,
  onChangeEng,
  onToggleHist,
  onToggleAxis,
  onChangeYear,
}: {
  width: number;
  height: number;
  inputs: PhaseCoherenceInputs;
  snapshot: SimSnapshot;
  sim: SimResult;
  interactive: boolean;
  onChangeK?: (v: number) => void;
  onChangeSig?: (v: number) => void;
  onChangeTau?: (v: number) => void;
  onChangeEng?: (v: number) => void;
  onToggleHist?: (v: boolean) => void;
  onToggleAxis?: (key: string) => void;
  onChangeYear?: (v: number) => void;
}) {
  const tokens = useTokens();
  const tauCoral = '#FF7A6B';
  const teal = '#4CC2C2';
  const C = 220;
  const Rr = 170;
  const r = snapshot.r;
  const phi = snapshot.phi;
  const tau = inputs.tau;
  const isPastTau = r >= tau;
  const arrowCol = isPastTau ? tauCoral : color('color/fill/accent');
  const tx = C + Rr * r * Math.cos(snapshot.psi);
  const ty = C - Rr * r * Math.sin(snapshot.psi);
  const a = Math.atan2(ty - C, tx - C);
  const hl = 14;

  const activeAxesCount = AXES.filter(ax => snapshot.on[ax.k]).length;

  let verdict = '';
  if (isPastTau) {
    verdict = 'Coherent: the phases are aligned enough that the summed signal reaches τ. This is the kernel-threat condition.';
  } else if (inputs.K === 0) {
    verdict = `Kernel-safe. The injected offsets cancel ${Math.round(100 * phi)}% of the solidarity signal, and nothing pulls the phases back together. Raise K to model deliberate alignment.`;
  } else {
    verdict = `Kernel-safe for now: alignment K pulls the phases together, and the Engine re-scatters them ${
      inputs.eng ? 'every ' + inputs.eng + ' years' : 'only when an axis switches on'
    }.`;
  }

  // Series SVG helpers
  const sW = 900;
  const sH = 340;
  const sL = 56;
  const sRr = 20;
  const sT = 20;
  const sB = 40;
  const mapX = (yVal: number) => sL + ((yVal - Y0) / (Y1 - Y0)) * (sW - sL - sRr);
  const mapY = (vVal: number) => sT + (1 - vVal) * (sH - sT - sB);

  const seriesPath = sim.hist
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${mapX(p[0]).toFixed(1)} ${mapY(p[1]).toFixed(1)}`)
    .join(' ');

  const currentYearX = mapX(inputs.year);

  // Wave SVG helpers
  const wW = 1200;
  const wH = 170;
  const wL = 40;
  const wRr = 20;
  const wMid = 85;
  const wA = 65;
  const waveMapX = (u: number) => wL + (u / (4 * Math.PI)) * (wW - wL - wRr);

  return (
    <div
      data-instrument="phase-coherence"
      data-mode="expanded"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        fontFamily: Tokens.fonts.sans,
        color: color('color/text/primary'),
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderBottom: `1px solid ${color('color/line/chart-faint')}`,
          paddingBottom: 6,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 21,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: color('color/text/primary'),
          }}
        >
          Phase Coherence
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            lineHeight: 1.4,
            color: color('color/text/muted'),
            maxWidth: 1100,
          }}
        >
          Each dot is a subgroup's class-solidarity phase <MathText>{'Φ_j'}</MathText>. The
          Interference Engine injects identity offsets on each active axis, and the dots spread out:{' '}
          <MathText>{'Φ_{load} = 1 − |mean e^{iΦ}|'}</MathText> rises (eq. 1.11). Solidarity reaches τ
          only when the phases align. The Snubber Circuit must therefore include phase coherence: the
          deliberate alignment of resistance signals (:14668).
        </p>
      </header>

      {/* Main Two Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '460px minmax(0, 1fr)',
          gap: 14,
          alignItems: 'start',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left Column: Phase Circle + Stats + Verdict */}
        <section
          style={{
            background: color('color/surface/1'),
            border: `1px solid ${color('color/line/chart-faint')}`,
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: color('color/text/dim'),
              }}
            >
              Subgroup phases ·{' '}
              <span style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                {Math.floor(inputs.year)}
              </span>
            </h2>
            <span style={{fontSize: 11, fontFamily: Tokens.fonts.mono, color: color('color/text/muted')}}>
              N = 24
            </span>
          </div>

          <svg
            viewBox="0 0 440 440"
            style={{
              width: 320,
              height: 320,
              margin: '0 auto',
              display: 'block',
              fontFamily: Tokens.fonts.mono,
            }}
            role="img"
            aria-label="Subgroup phases on the unit circle and their mean vector"
          >
            <defs>
              <filter id="pc-gl" filterUnits="userSpaceOnUse" x="0" y="0" width="440" height="440">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={C} cy={C} r={Rr} fill="none" stroke={color('color/line/chart')} strokeWidth={1.6} />
            <circle
              cx={C}
              cy={C}
              r={Number((Rr * tau).toFixed(1))}
              fill="none"
              stroke={tauCoral}
              strokeWidth={1.6}
              strokeDasharray="6 5"
            />
            <text
              x={Number((C + Rr * tau * 0.71 + 6).toFixed(1))}
              y={Number((C - Rr * tau * 0.71 - 6).toFixed(1))}
              fontSize={13}
              fill={tauCoral}
            >
              τ
            </text>
            <line
              x1={C - Rr - 10}
              y1={C}
              x2={C + Rr + 10}
              y2={C}
              stroke={color('color/line/chart')}
              strokeOpacity={0.4}
            />
            <line
              x1={C}
              y1={C - Rr - 10}
              x2={C}
              y2={C + Rr + 10}
              stroke={color('color/line/chart')}
              strokeOpacity={0.4}
            />
            <text x={C + Rr + 14} y={C + 4} fontSize={12} fill={color('color/text/dim')}>
              0
            </text>
            <text x={C - Rr - 14} y={C + 4} textAnchor="end" fontSize={12} fill={color('color/text/dim')}>
              π
            </text>
            {snapshot.phases.map((p, idx) => (
              <circle
                key={idx}
                cx={Number((C + Rr * Math.cos(p)).toFixed(1))}
                cy={Number((C - Rr * Math.sin(p)).toFixed(1))}
                r={6}
                fill={teal}
                fillOpacity={0.85}
              />
            ))}
            <g filter="url(#pc-gl)">
              <line
                x1={C}
                y1={C}
                x2={Number((tx - hl * Math.cos(a)).toFixed(1))}
                y2={Number((ty - hl * Math.sin(a)).toFixed(1))}
                stroke={arrowCol}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                d={`M${tx.toFixed(1)} ${ty.toFixed(1)} L${(tx - hl * Math.cos(a) + 7 * Math.sin(a)).toFixed(1)} ${(ty - hl * Math.sin(a) - 7 * Math.cos(a)).toFixed(1)} L${(tx - hl * Math.cos(a) - 7 * Math.sin(a)).toFixed(1)} ${(ty - hl * Math.sin(a) + 7 * Math.cos(a)).toFixed(1)}Z`}
                fill={arrowCol}
              />
            </g>
            <circle cx={C} cy={C} r={4} fill={color('color/text/primary')} />
            <text x={14} y={430} fontSize={11} fill={color('color/text/muted')}>
              arrow: mean vector, length r
            </text>
          </svg>

          {/* Stats 4-grid */}
          <dl
            style={{
              margin: '2px 0 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              borderTop: `1px solid ${color('color/line/chart-faint')}`,
              paddingTop: 8,
            }}
          >
            <div>
              <dt style={{fontSize: 11, color: color('color/text/muted')}}>
                <MathText>{'Φ_{load}'}</MathText>
              </dt>
              <dd style={{margin: '2px 0 0', fontFamily: Tokens.fonts.mono, fontSize: 13.5, fontWeight: 500}}>
                {phi.toFixed(3)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 11, color: color('color/text/muted')}}>Coherence r</dt>
              <dd
                style={{
                  margin: '2px 0 0',
                  fontFamily: Tokens.fonts.mono,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: isPastTau ? tauCoral : color('color/text/primary'),
                }}
              >
                {r.toFixed(3)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 11, color: color('color/text/muted')}}>
                τ needs <MathText>{'r ≥'}</MathText>
              </dt>
              <dd style={{margin: '2px 0 0', fontFamily: Tokens.fonts.mono, fontSize: 13.5, fontWeight: 500}}>
                {tau.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 11, color: color('color/text/muted')}}>Active axes</dt>
              <dd style={{margin: '2px 0 0', fontFamily: Tokens.fonts.mono, fontSize: 13.5, fontWeight: 500}}>
                {activeAxesCount} / 6
              </dd>
            </div>
          </dl>

          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.42,
              color: isPastTau ? tauCoral : color('color/text/muted'),
            }}
          >
            {verdict}
          </p>
        </section>

        {/* Right Column: Time Series + Controls */}
        <section
          style={{
            background: color('color/surface/1'),
            border: `1px solid ${color('color/line/chart-faint')}`,
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxSizing: 'border-box',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <h2
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: color('color/text/dim'),
              }}
            >
              <MathText>{'Φ_{load}'}</MathText> over time
            </h2>
            <span style={{fontSize: 11, fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
              1960–2030
            </span>
          </div>

          <svg
            viewBox={`0 0 ${sW} ${sH}`}
            style={{
              width: '100%',
              height: 250,
              display: 'block',
              fontFamily: Tokens.fonts.mono,
            }}
            role="img"
            aria-label="Phase loading over time with the manuscript's ANES reference levels"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
              <g key={v}>
                <line
                  x1={sL}
                  y1={mapY(v)}
                  x2={sW - sRr}
                  y2={mapY(v)}
                  stroke={color('color/line/chart')}
                  strokeOpacity={0.25}
                />
                <text
                  x={sL - 8}
                  y={mapY(v) + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={color('color/text/dim')}
                >
                  {v.toFixed(2)}
                </text>
              </g>
            ))}

            {/* Year labels */}
            {[1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030].map(y => (
              <text
                key={y}
                x={mapX(y)}
                y={sH - sB + 18}
                textAnchor="middle"
                fontSize={11}
                fill={color('color/text/dim')}
              >
                {y}
              </text>
            ))}

            {/* Tau zone rect */}
            {(() => {
              const ty = 1 - tau;
              const yTop = mapY(ty);
              const yBottom = mapY(0);
              return (
                <g>
                  <rect
                    x={sL}
                    y={yTop}
                    width={sW - sL - sRr}
                    height={yBottom - yTop}
                    fill={tauCoral}
                    fillOpacity={0.1}
                  />
                  <text
                    x={sW - sRr - 6}
                    y={yBottom - 6}
                    textAnchor="end"
                    fontSize={11}
                    fill={tauCoral}
                  >
                    {`τ zone: Φload ≤ ${ty.toFixed(2)}`}
                  </text>
                </g>
              );
            })()}

            {/* Elections ticks */}
            {sim.elections.map(e => (
              <line
                key={e}
                x1={Number(mapX(e).toFixed(1))}
                y1={sH - sB}
                x2={Number(mapX(e).toFixed(1))}
                y2={sH - sB - 8}
                stroke={color('color/fill/gold')}
                strokeWidth={1.5}
              />
            ))}

            {/* Axis activation vertical lines */}
            {AXES.map(a => {
              if (a.y && inputs.hist && a.y <= inputs.year) {
                return (
                  <line
                    key={a.k}
                    x1={Number(mapX(a.y).toFixed(1))}
                    y1={sT}
                    x2={Number(mapX(a.y).toFixed(1))}
                    y2={sH - sB}
                    stroke={color('color/fill/accent')}
                    strokeOpacity={0.35}
                    strokeDasharray="3 4"
                  />
                );
              }
              return null;
            })}

            {/* ANES reference lines */}
            {ANES_REFERENCES.map(ref => (
              <line
                key={ref.label}
                x1={Number(mapX(ref.y0).toFixed(1))}
                y1={Number(mapY(ref.val).toFixed(1))}
                x2={Number(mapX(ref.y1).toFixed(1))}
                y2={Number(mapY(ref.val).toFixed(1))}
                stroke={color('color/text/primary')}
                strokeWidth={4}
                strokeOpacity={0.55}
              />
            ))}
            <text
              x={mapX(1981)}
              y={mapY(0.403) - 8}
              fontSize={11}
              fill={color('color/text/primary')}
              fillOpacity={0.8}
            >
              ANES reference
            </text>

            {/* Simulated history curve */}
            <path d={seriesPath} fill="none" stroke={color('color/fill/accent')} strokeWidth={2.2} />

            {/* Current year marker */}
            <line
              x1={Number(currentYearX.toFixed(1))}
              y1={sT}
              x2={Number(currentYearX.toFixed(1))}
              y2={sH - sB}
              stroke={color('color/fill/gold')}
              strokeWidth={1.5}
              strokeDasharray="2 2"
            />
            <circle
              cx={Number(currentYearX.toFixed(1))}
              cy={Number(mapY(phi).toFixed(1))}
              r={4}
              fill={color('color/fill/gold')}
            />

            <text x={sL} y={sH - 6} fontSize={10.5} fill={color('color/text/muted')}>
              gold ticks: elections that redraw the offsets · dotted: axis switched on
            </text>
          </svg>

          {/* Axis Chips */}
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
            {AXES.map(ax => {
              const active = !!snapshot.on[ax.k];
              const chipStyle: React.CSSProperties = {
                fontFamily: Tokens.fonts.sans,
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 9px',
                borderRadius: 5,
                border: `1px solid ${active ? color('color/fill/accent') : color('color/line/chart-faint')}`,
                background: color('color/surface/well'),
                color: active ? color('color/fill/accent') : color('color/text/muted'),
                cursor: interactive ? 'pointer' : 'default',
              };
              if (interactive && onToggleAxis) {
                return (
                  <button
                    key={ax.k}
                    type="button"
                    onClick={() => onToggleAxis(ax.k)}
                    style={chipStyle}
                    aria-pressed={active}
                  >
                    {ax.name}
                    {ax.y ? (
                      <span style={{fontSize: 10, color: color('color/text/dim'), marginLeft: 4}}>{ax.y}</span>
                    ) : null}
                  </button>
                );
              }
              return (
                <div key={ax.k} style={chipStyle} aria-pressed={active}>
                  {ax.name}
                  {ax.y ? (
                    <span style={{fontSize: 10, color: color('color/text/dim'), marginLeft: 4}}>{ax.y}</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Parameter Readouts / Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 16px',
              fontSize: 12.5,
              borderTop: `1px solid ${color('color/line/chart-faint')}`,
              paddingTop: 8,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: color('color/text/muted')}}>
                <i>K</i> phase coherence
              </span>
              <span style={{fontFamily: Tokens.fonts.mono, fontWeight: 500}}>{inputs.K.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: color('color/text/muted')}}>
                <i>σ</i> natural drift
              </span>
              <span style={{fontFamily: Tokens.fonts.mono, fontWeight: 500}}>{inputs.sig.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: color('color/text/muted')}}>
                τ coherence <MathText>{'r_τ'}</MathText>
              </span>
              <span style={{fontFamily: Tokens.fonts.mono, fontWeight: 500}}>{inputs.tau.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: color('color/text/muted')}}>Engine carrier</span>
              <span style={{fontFamily: Tokens.fonts.mono, fontWeight: 500}}>
                {inputs.eng === 0 ? 'static' : `${inputs.eng}-yr carrier`}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section: Summed solidarity wave against τ */}
      <section
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart-faint')}`,
          borderRadius: 8,
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          boxSizing: 'border-box',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <h2
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: color('color/text/dim'),
            }}
          >
            The summed solidarity wave against τ
          </h2>
          <span style={{fontSize: 10.5, fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            two cycles (4π)
          </span>
        </div>

        <svg
          viewBox={`0 0 ${wW} ${wH}`}
          style={{
            width: '100%',
            height: 100,
            display: 'block',
            fontFamily: Tokens.fonts.mono,
          }}
          role="img"
          aria-label="The sum of the subgroup waves over one cycle, with the tau band"
        >
          {/* Top and Bottom tau zone rects */}
          <rect
            x={wL}
            y={wMid - wA}
            width={wW - wL - wRr}
            height={Number((wA * (1 - tau)).toFixed(1))}
            fill={tauCoral}
            fillOpacity={0.12}
          />
          <rect
            x={wL}
            y={Number((wMid + wA * tau).toFixed(1))}
            width={wW - wL - wRr}
            height={Number((wA * (1 - tau)).toFixed(1))}
            fill={tauCoral}
            fillOpacity={0.12}
          />

          {/* Tau limit dashed lines */}
          {[tau, -tau].map(v => (
            <line
              key={v}
              x1={wL}
              y1={Number((wMid - wA * v).toFixed(1))}
              x2={wW - wRr}
              y2={Number((wMid - wA * v).toFixed(1))}
              stroke={tauCoral}
              strokeWidth={1.4}
              strokeDasharray="6 5"
            />
          ))}

          {/* Zero baseline wire */}
          <line
            x1={wL}
            y1={wMid}
            x2={wW - wRr}
            y2={wMid}
            stroke={color('color/text/primary')}
            strokeWidth={1.2}
            strokeOpacity={0.6}
          />

          {/* 24 subgroup waves in teal */}
          {snapshot.phases.map((p, idx) => {
            let d = '';
            const nPts = 120;
            for (let i = 0; i <= nPts; i++) {
              const u = (4 * Math.PI * i) / nPts;
              d += `${i === 0 ? 'M' : 'L'}${waveMapX(u).toFixed(1)} ${(wMid - wA * Math.cos(u + p)).toFixed(1)}`;
            }
            return (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke={teal}
                strokeOpacity={0.22}
                strokeWidth={1}
              />
            );
          })}

          {/* Average solidarity wave in orange/coral */}
          {(() => {
            let d = '';
            const nPts = 120;
            for (let i = 0; i <= nPts; i++) {
              const u = (4 * Math.PI * i) / nPts;
              let s = 0;
              for (let j = 0; j < snapshot.phases.length; j++) {
                s += Math.cos(u + snapshot.phases[j]);
              }
              const yVal = wMid - (wA * s) / N;
              d += `${i === 0 ? 'M' : 'L'}${waveMapX(u).toFixed(1)} ${yVal.toFixed(1)}`;
            }
            return (
              <path
                d={d}
                fill="none"
                stroke={arrowCol}
                strokeWidth={3}
              />
            );
          })()}

          <text
            x={wW - wRr}
            y={Number((wMid - wA * tau - 6).toFixed(1))}
            textAnchor="end"
            fontSize={12}
            fill={tauCoral}
          >
            τ
          </text>
        </svg>

        <p
          style={{
            margin: 0,
            fontSize: 11.5,
            lineHeight: 1.4,
            color: color('color/text/muted'),
          }}
        >
          The thin lines are the subgroup waves cos(ωt + <MathText>{'Φ_j'}</MathText>). Their
          average, in orange, has amplitude r = 1 − <MathText>{'Φ_{load}'}</MathText>. Aligned
          phases add up; spread phases cancel. The crash condition is the zero-sequence case: all
          phases in step (:1230).
        </p>
      </section>
    </div>
  );
}

function SettingsPhaseCoherence({
  width,
  height,
  inputs,
  snapshot,
  era,
}: {
  width: number;
  height: number;
  inputs: PhaseCoherenceInputs;
  snapshot: SimSnapshot;
  era?: {log: number; fields: Record<string, unknown>};
}) {
  return (
    <div
      data-instrument="phase-coherence"
      data-mode="settings"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        fontFamily: Tokens.fonts.sans,
        color: color('color/text/primary'),
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
        padding: '8px 12px',
      }}
    >
      <header
        style={{
          borderBottom: `1px solid ${color('color/line/chart-faint')}`,
          paddingBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: color('color/text/primary'),
            }}
          >
            SETTINGS · PHASE COHERENCE
          </h1>
          {inputs.modelDefault && (
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                fontWeight: 500,
                color: color('color/fill/accent'),
                fontFamily: Tokens.fonts.mono,
              }}
            >
              Model default: this log does not set this instrument.
            </p>
          )}
        </div>
        <span style={{fontFamily: Tokens.fonts.mono, fontSize: 11, color: color('color/text/dim')}}>
          {era ? `Runtime Log ${era.log}` : 'Model Default'}
        </span>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '460px minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
          flex: 1,
        }}
      >
        {/* Left Column: Model Parameters (read-only readouts) */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div>
            <h2
              style={{
                margin: '0 0 8px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: color('color/text/dim'),
              }}
            >
              Model Parameters
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '170px minmax(0, 1fr)',
                gap: '8px 10px',
                alignItems: 'center',
                fontSize: 12.5,
              }}
            >
              <span style={{color: color('color/text/muted')}}>
                <i>K</i> (coupling gain)
              </span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {inputs.K.toFixed(2)}
              </div>

              <span style={{color: color('color/text/muted')}}>
                <i>σ</i> (natural drift)
              </span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {inputs.sig.toFixed(2)}
              </div>

              <span style={{color: color('color/text/muted')}}>
                τ coherence (<MathText>{'r_τ'}</MathText>)
              </span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {inputs.tau.toFixed(2)}
              </div>

              <span style={{color: color('color/text/muted')}}>Engine carrier</span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {inputs.eng === 0 ? 'static' : `${inputs.eng}-year electoral carrier`}
              </div>

              <span style={{color: color('color/text/muted')}}>Follow history</span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {inputs.hist ? 'On (switch axes at dates)' : 'Off (manual)'}
              </div>

              <span style={{color: color('color/text/muted')}}>Timeline year</span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                {Math.floor(inputs.year)}
              </div>

              <span style={{color: color('color/text/muted')}}>Calibrated <MathText>{'a_{race}'}</MathText></span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                0.679 (<MathText>{'Φ_{load} = 0.078'}</MathText>)
              </div>

              <span style={{color: color('color/text/muted')}}>Calibrated <MathText>{'a_{identity}'}</MathText></span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                0.878 (<MathText>{'Φ_{load} = 0.403'}</MathText>)
              </div>

              <span style={{color: color('color/text/muted')}}>Subgroups N</span>
              <div
                style={{
                  background: color('color/surface/well'),
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontFamily: Tokens.fonts.mono,
                }}
              >
                24 (seed 20260611)
              </div>
            </div>
          </div>

          <div style={{borderTop: `1px solid ${color('color/line/chart-faint')}`, paddingTop: 10}}>
            <h2
              style={{
                margin: '0 0 6px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: color('color/text/dim'),
              }}
            >
              Active Identity Axes
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12}}>
              {AXES.map(ax => {
                const on = !!snapshot.on[ax.k];
                return (
                  <div
                    key={ax.k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '3px 8px',
                      background: color('color/surface/well'),
                      borderRadius: 4,
                      color: on ? color('color/fill/accent') : color('color/text/muted'),
                    }}
                  >
                    <span>{ax.name}</span>
                    <span style={{fontFamily: Tokens.fonts.mono, fontSize: 11}}>
                      {ax.y ? `activated ${ax.y}` : 'baseline (1960)'} · {on ? 'active' : 'inactive'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: What comes from where / Sources */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div>
            <h2
              style={{
                margin: '0 0 8px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: color('color/text/dim'),
              }}
            >
              What the page assumes
            </h2>
            <div style={{fontSize: 12.5, lineHeight: 1.5, color: color('color/text/muted')}}>
              <p style={{margin: '0 0 10px'}}>
                <strong style={{color: color('color/text/primary')}}>From the manuscript:</strong>{' '}
                <MathText>{'Φ_{load}'}</MathText> as circular dispersion, the Kuramoto order
                parameter (eqs. 1.11 and 8.17,{' '}
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  Paper/The_Original_Power.tex:2517
                </code>
                ,{' '}
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  :7193
                </code>
                ); the axis table and activation dates, gender 1972, nationality 1974, sexuality
                1977, religion 1979 (
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  :7215–:7256
                </code>
                ); the ANES calibration, <MathText>{'Φ_{load} ≈ 0.078'}</MathText> before 1964,{' '}
                <MathText>{'≈ 0.214'}</MathText> during activation,{' '}
                <MathText>{'≈ 0.403'}</MathText> after 1980 (
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  :2522
                </code>
                ); the Engine as a phase-locked control system on the electoral clock, 24.1:1
                identity-band power at the 4-year cycle and 12.8:1 at the 2-year cycle (
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  :14640–:14665
                </code>
                ); phase coherence as part of the Snubber Circuit (
                <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/primary')}}>
                  :14668
                </code>
                ). The ability axis has no date in that list; the page uses the ADA, 1990, from the
                axis table.
              </p>
              <p style={{margin: '0 0 10px'}}>
                <strong style={{color: color('color/text/primary')}}>The model:</strong> 24 subgroups.
                Each phase is <MathText>{'Φ_j = θ_j + Σ_k a_k u_{kj}'}</MathText>, with fixed random
                draws <MathText>{'u_{kj}'}</MathText> in [−1, 1] per active axis (opposite signs drive
                subgroups into antagonism, as the manuscript defines). The base phases follow the
                Kuramoto equation <MathText>{'dθ_j/dt = σ ω_j + K r sin(ψ − Φ_j)'}</MathText>, where K
                is deliberate alignment and σ spreads the natural frequencies <MathText>{'ω_j'}</MathText>
                . The page sets the axis amplitudes so that, with K = 0, the race axis alone gives{' '}
                <MathText>{'Φ_{load} = 0.078'}</MathText> and race plus the four 1965–1980 axes give
                0.403, the manuscript's two ANES endpoints.
              </p>
              <p style={{margin: 0}}>
                With an electoral carrier on, the Engine redraws the offsets <MathText>{'u_{kj}'}</MathText>{' '}
                at each election: a new set of wedge issues. The τ level is illustrative; at the
                default <MathText>{'r_τ = 0.90'}</MathText>, the pre-1964 race-only state sits just
                above it, the kernel-breach condition of the civil-rights era.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractivePhaseCoherenceView(props: PhaseCoherenceViewProps): JSX.Element {
  const fromEraInputs = phaseCoherenceFromEra(props.era);
  const [K, setK] = useState(fromEraInputs.K);
  const [sig, setSig] = useState(fromEraInputs.sig);
  const [tau, setTau] = useState(fromEraInputs.tau);
  const [eng, setEng] = useState(fromEraInputs.eng);
  const [hist, setHist] = useState(fromEraInputs.hist);
  const [year, setYear] = useState(fromEraInputs.year);
  const [activeAxes, setActiveAxes] = useState<Record<string, boolean>>({
    ...fromEraInputs.activeAxes,
  });

  const inputs: PhaseCoherenceInputs = {
    modelDefault: fromEraInputs.modelDefault,
    K,
    sig,
    tau,
    eng,
    hist,
    year,
    activeAxes,
  };

  const sim = runSimulation({K, sig, tau, eng, hist});
  const snap = getActiveSnapshot(inputs, sim);

  if (props.mode === 'compact') {
    return (
      <CompactPhaseCoherence
        width={props.width}
        height={props.height}
        inputs={inputs}
        snapshot={snap}
      />
    );
  }

  if (props.mode === 'settings') {
    return (
      <SettingsPhaseCoherence
        width={props.width}
        height={props.height}
        inputs={inputs}
        snapshot={snap}
        era={props.era}
      />
    );
  }

  return (
    <ExpandedPhaseCoherence
      width={props.width}
      height={props.height}
      inputs={inputs}
      snapshot={snap}
      sim={sim}
      interactive={true}
      onChangeK={setK}
      onChangeSig={setSig}
      onChangeTau={setTau}
      onChangeEng={setEng}
      onToggleHist={setHist}
      onToggleAxis={k => {
        setActiveAxes(prev => ({...prev, [k]: !prev[k]}));
        setHist(false);
      }}
      onChangeYear={setYear}
    />
  );
}
