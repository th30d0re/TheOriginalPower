import React, {useId, useState, type JSX} from 'react';
import {useTokens, MathText, type InstrumentMode} from '@stage';
import {color} from '../../tokens';
import shocksData from './data/backlash-oscillator.json';

export type ShockPreset = {
  y: number;
  name: string;
  z: number;
  wn: number;
  proxy: string;
};

export const SHOCKS: ShockPreset[] = shocksData as ShockPreset[];

export type DriveMode = 'impulse' | 'charge' | 'periodic';

export type BacklashOscillatorModel = {
  R: number;
  L: number;
  C: number;
  V0: number;
  mode: DriveMode;
  w: number;
  year: number;
  preset: number;
};

export type BacklashOscillatorFromEraResult = BacklashOscillatorModel & {
  modelDefault: boolean;
};

export type BacklashOscillatorViewProps = {
  mode: InstrumentMode;
  width: number;
  height: number;
  interactive: boolean;
  era?: {log: number; fields: Record<string, unknown>};
};

export const DEFAULT_MODEL: BacklashOscillatorModel = {
  R: 0.102,
  L: 1,
  C: 1 / (0.3 * 0.3),
  V0: 1,
  mode: 'impulse',
  w: 1,
  year: 1865,
  preset: 0,
};

export function backlashOscillatorFromEra(era?: {
  log: number;
  fields: Record<string, unknown>;
}): BacklashOscillatorFromEraResult {
  const log = era?.log;
  if (log === 5 || log === 9) {
    const s = SHOCKS[0];
    return {
      R: 2 * s.z * s.wn,
      L: 1,
      C: 1 / (s.wn * s.wn),
      V0: 1,
      mode: 'impulse',
      w: 1,
      year: s.y,
      preset: 0,
      modelDefault: false,
    };
  }
  if (log === 14) {
    const s = SHOCKS[1];
    return {
      R: 2 * s.z * s.wn,
      L: 1,
      C: 1 / (s.wn * s.wn),
      V0: 1,
      mode: 'impulse',
      w: 1,
      year: s.y,
      preset: 1,
      modelDefault: false,
    };
  }
  if (log === 15) {
    const s = SHOCKS[2];
    return {
      R: 2 * s.z * s.wn,
      L: 1,
      C: 1 / (s.wn * s.wn),
      V0: 1,
      mode: 'impulse',
      w: 1,
      year: s.y,
      preset: 2,
      modelDefault: false,
    };
  }
  if (log === 17) {
    const s = SHOCKS[3];
    return {
      R: 2 * s.z * s.wn,
      L: 1,
      C: 1 / (s.wn * s.wn),
      V0: 1,
      mode: 'impulse',
      w: 1,
      year: s.y,
      preset: 3,
      modelDefault: false,
    };
  }
  return {
    ...DEFAULT_MODEL,
    modelDefault: true,
  };
}

export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

export function f(v: number, d?: number): string {
  if (!isFinite(v)) return '—';
  const a = Math.abs(v);
  return a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : v.toFixed(d == null ? 2 : d);
}

export type CircuitParams = {
  a: number;
  w0: number;
  z: number;
  wd: number;
  Q: number;
};

export function computeParams(R: number, L: number, C: number): CircuitParams {
  const safeL = Math.max(1e-6, L);
  const safeC = Math.max(1e-6, C);
  const a = R / (2 * safeL);
  const w0 = 1 / Math.sqrt(safeL * safeC);
  const z = a / w0;
  const wd = z < 1 ? w0 * Math.sqrt(1 - z * z) : 0;
  const Q = R > 0 ? Math.sqrt(safeL / safeC) / R : Infinity;
  return {a, w0, z, wd, Q};
}

export function computeHorizon(p: CircuitParams, mode: DriveMode, w: number): number {
  if (mode === 'periodic') {
    const safeW = Math.max(1e-3, w * p.w0);
    return clamp((14 * 2 * Math.PI) / safeW, 2, 400);
  }
  let t = p.a > 1e-6 ? 6 / p.a : (40 * 2 * Math.PI) / p.w0;
  if (p.wd > 0) {
    t = Math.max(t, (2.5 * 2 * Math.PI) / p.wd);
  }
  return clamp(t, 1, 400);
}

export type SimPoint = [number, number];

export type SimulationResult = {
  pts: SimPoint[];
  p: CircuitParams;
  T: number;
  qmax: number;
  qmin: number;
  pk: SimPoint | null;
  tr: SimPoint | null;
  cross: number | null;
};

const simCache = new Map<string, SimulationResult>();

export function getSimulation(
  R: number,
  L: number,
  C: number,
  V0: number,
  mode: DriveMode,
  w: number,
  N = 700,
): SimulationResult {
  const key = `${R.toFixed(5)}_${L.toFixed(5)}_${C.toFixed(5)}_${V0.toFixed(5)}_${mode}_${w.toFixed(5)}_${N}`;
  const hit = simCache.get(key);
  if (hit) return hit;

  const p = computeParams(R, L, C);
  const T = computeHorizon(p, mode, w);
  const dt = T / N;
  let q = 0;
  let v = 0;
  let t = 0;
  if (mode === 'impulse') {
    q = 0;
    v = V0 / Math.max(1e-6, L);
  } else if (mode === 'charge') {
    q = V0;
    v = 0;
  } else {
    q = 0;
    v = 0;
  }

  const wdrv = w * p.w0;
  const safeL = Math.max(1e-6, L);
  const safeC = Math.max(1e-6, C);
  const V = (tt: number) => (mode === 'periodic' ? V0 * Math.cos(wdrv * tt) : 0);
  const acc = (tt: number, qq: number, vv: number) => (V(tt) - R * vv - qq / safeC) / safeL;

  const sub = Math.max(1, Math.ceil(dt * p.w0 * 8));
  const h = dt / sub;
  const pts: SimPoint[] = [[0, q]];
  let qmax = q;
  let qmin = q;

  for (let i = 0; i < N; i++) {
    for (let k = 0; k < sub; k++) {
      const k1q = v;
      const k1v = acc(t, q, v);
      const k2q = v + (h / 2) * k1v;
      const k2v = acc(t + h / 2, q + (h / 2) * k1q, v + (h / 2) * k1v);
      const k3q = v + (h / 2) * k2v;
      const k3v = acc(t + h / 2, q + (h / 2) * k2q, v + (h / 2) * k2v);
      const k4q = v + h * k3v;
      const k4v = acc(t + h, q + h * k3q, v + h * k3v);
      q += (h / 6) * (k1q + 2 * k2q + 2 * k3q + k4q);
      v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      t += h;
    }
    pts.push([t, q]);
    if (q > qmax) qmax = q;
    if (q < qmin) qmin = q;
  }

  let pk: SimPoint | null = null;
  let tr: SimPoint | null = null;
  if (mode === 'charge') {
    pk = pts[0];
  }
  for (let i = 1; i < pts.length - 1; i++) {
    if (!pk && pts[i][1] > 0 && pts[i][1] >= pts[i - 1][1] && pts[i][1] >= pts[i + 1][1]) {
      pk = pts[i];
    }
    if (pk && !tr && pts[i][1] < 0 && pts[i][1] <= pts[i - 1][1] && pts[i][1] <= pts[i + 1][1]) {
      tr = pts[i];
    }
  }

  let cross: number | null = null;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i - 1][1] >= 0 && pts[i][1] < 0) {
      cross = pts[i][0];
      break;
    }
  }

  const res: SimulationResult = {pts, p, T, qmax, qmin, pk, tr, cross};
  simCache.set(key, res);
  return res;
}

export function BacklashOscillatorView(props: BacklashOscillatorViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveBacklashOscillatorView {...props} />;
  }
  return <StaticBacklashOscillatorView {...props} />;
}

function useOscillatorTokens() {
  const tokens = useTokens();
  return {
    tokens,
    paper: color('color/bg/field'),
    zone: '#1B1E2B',
    panel: color('color/surface/1'),
    well: color('color/surface/well'),
    wire: color('color/line/wire'),
    ink: color('color/text/primary'),
    ink2: color('color/text/muted'),
    rule: color('color/line/chart'),
    labelSm: color('color/text/dim'),
    gold: color('color/fill/gold'),
    red: '#E0604A',
    green: '#7CC08A',
    accent: color('color/line/accent'),
  };
}

function StaticBacklashOscillatorView(props: BacklashOscillatorViewProps): JSX.Element {
  const derived = backlashOscillatorFromEra(props.era);
  return (
    <BacklashOscillatorPresentation
      model={derived}
      modelDefault={derived.modelDefault}
      mode={props.mode}
      width={props.width}
      height={props.height}
      interactive={false}
    />
  );
}

function InteractiveBacklashOscillatorView(props: BacklashOscillatorViewProps): JSX.Element {
  const initial = backlashOscillatorFromEra(props.era);
  const [model, setModel] = useState<BacklashOscillatorModel>(initial);

  return (
    <BacklashOscillatorPresentation
      model={model}
      modelDefault={initial.modelDefault}
      mode={props.mode}
      width={props.width}
      height={props.height}
      interactive={true}
      onChangeModel={setModel}
    />
  );
}

function BacklashOscillatorPresentation({
  model,
  modelDefault,
  mode,
  width,
  height,
  interactive,
  onChangeModel,
}: {
  model: BacklashOscillatorModel;
  modelDefault: boolean;
  mode: InstrumentMode;
  width: number;
  height: number;
  interactive: boolean;
  onChangeModel?: React.Dispatch<React.SetStateAction<BacklashOscillatorModel>>;
}): JSX.Element {
  if (mode === 'compact') {
    return (
      <CompactOscillatorView
        model={model}
        width={width}
        height={height}
      />
    );
  }
  if (mode === 'settings') {
    return (
      <SettingsOscillatorView
        model={model}
        modelDefault={modelDefault}
        width={width}
        height={height}
      />
    );
  }
  return (
    <ExpandedOscillatorView
      model={model}
      width={width}
      height={height}
      interactive={interactive}
      onChangeModel={onChangeModel}
    />
  );
}

function CompactOscillatorView({
  model,
  width,
  height,
}: {
  model: BacklashOscillatorModel;
  width: number;
  height: number;
}): JSX.Element {
  const c = useOscillatorTokens();
  const sim = getSimulation(model.R, model.L, model.C, model.V0, model.mode, model.w, 160);
  const p = sim.p;
  const T = sim.T;
  const pts = sim.pts;

  let mx = 0;
  for (let i = 0; i < pts.length; i++) {
    const val = Math.abs(pts[i][1]);
    if (val > mx) mx = val;
  }
  const A = Math.max(mx, 1e-6);

  const sparkW = Math.max(40, width - 12);
  const sparkH = Math.max(20, height - 42);
  const y0 = sparkH / 2;

  let seg = '';
  let st: boolean | null = null;
  const pathNodes: JSX.Element[] = [];

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i];
    const x = ((pt[0] / T) * sparkW).toFixed(1);
    const y = (y0 - (pt[1] / A) * (y0 - 2)).toFixed(1);
    const s2 = pt[1] >= 0;
    if (st === null) st = s2;
    if (s2 !== st) {
      seg += `L${x} ${y}`;
      pathNodes.push(
        <path
          key={i}
          d={seg}
          fill="none"
          stroke={st ? c.accent : c.red}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />,
      );
      seg = `M${x} ${y}`;
      st = s2;
    } else {
      seg += (seg ? 'L' : 'M') + `${x} ${y}`;
    }
  }
  if (seg) {
    pathNodes.push(
      <path
        key="tail"
        d={seg}
        fill="none"
        stroke={st ? c.accent : c.red}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />,
    );
  }

  const periodStr = `${f((2 * Math.PI) / p.w0, 1)} yr`;
  const zetaStr = `ζ ${f(p.z, 2)}`;
  const valStr = model.year ? `${model.year} · ${zetaStr} · ${periodStr}` : `${zetaStr} · ${periodStr}`;

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '3px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        color: c.ink,
        fontFamily: c.tokens.fonts.mono,
      }}
    >
      <div
        style={{
          fontSize: 11,
          lineHeight: '13px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: c.labelSm,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        BACKLASH OSCILLATOR
      </div>

      <div style={{width: sparkW, height: sparkH, position: 'relative'}}>
        <svg
          width={sparkW}
          height={sparkH}
          viewBox={`0 0 ${sparkW} ${sparkH}`}
          style={{display: 'block'}}
          aria-hidden="true"
        >
          <rect
            x={0}
            y={y0}
            width={sparkW}
            height={sparkH - y0}
            fill={c.zone}
          />
          <line
            x1={0}
            y1={y0}
            x2={sparkW}
            y2={y0}
            stroke={c.rule}
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          {pathNodes}
        </svg>
      </div>

      <div
        style={{
          fontSize: 11,
          lineHeight: '14px',
          color: c.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {valStr}
      </div>
    </div>
  );
}

function SettingsOscillatorView({
  model,
  modelDefault,
  width,
  height,
}: {
  model: BacklashOscillatorModel;
  modelDefault: boolean;
  width: number;
  height: number;
}): JSX.Element {
  const c = useOscillatorTokens();
  const sim = getSimulation(model.R, model.L, model.C, model.V0, model.mode, model.w, 700);
  const p = sim.p;
  const depth = sim.pk && sim.tr ? -sim.tr[1] / sim.pk[1] : 0;

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        padding: '24px 32px',
        overflowY: 'auto',
        color: c.ink,
        fontFamily: c.tokens.fonts.sans,
      }}
    >
      <div style={{marginBottom: 16}}>
        <h1
          style={{
            margin: '0 0 6px',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: c.gold,
            fontFamily: c.tokens.fonts.mono,
          }}
        >
          SETTINGS · BACKLASH OSCILLATOR
        </h1>
        <p style={{margin: 0, fontSize: 13.5, color: c.ink2}}>
          Series RLC circuit model parameters, fitted shock data, and manuscript references.
        </p>
      </div>

      {modelDefault && (
        <div
          style={{
            marginBottom: 20,
            padding: '10px 14px',
            borderRadius: 6,
            background: c.well,
            border: `1px solid ${c.rule}`,
            color: c.gold,
            fontSize: 13.5,
            fontFamily: c.tokens.fonts.mono,
          }}
        >
          Model default: this log does not set this instrument.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 20,
          marginBottom: 24,
        }}
      >
        <section
          style={{
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '14px 18px',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: c.labelSm,
            }}
          >
            ACTIVE MODEL PARAMETERS
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '160px minmax(0, 1fr)',
              gap: '6px 14px',
              fontSize: 13,
              fontFamily: c.tokens.fonts.mono,
            }}
          >
            <span style={{color: c.ink2}}>Resistance R</span>
            <span>{f(model.R, 3)} (friction)</span>

            <span style={{color: c.ink2}}>Inductance L</span>
            <span>{f(model.L, 3)} (inertia)</span>

            <span style={{color: c.ink2}}>Capacitance C</span>
            <span>{f(model.C, 3)} (absorption)</span>

            <span style={{color: c.ink2}}>Shock size V₀</span>
            <span>{f(model.V0, 2)}</span>

            <span style={{color: c.ink2}}>Drive mode</span>
            <span>{model.mode}</span>

            {model.mode === 'periodic' && (
              <>
                <span style={{color: c.ink2}}>Frequency ω/ω₀</span>
                <span>{f(model.w, 2)}</span>
              </>
            )}

            <span style={{color: c.ink2}}>Damping ratio ζ</span>
            <span>{f(p.z, 2)}</span>

            <span style={{color: c.ink2}}>Natural period</span>
            <span>{f((2 * Math.PI) / p.w0, 1)} yr</span>

            <span style={{color: c.ink2}}>Decay rate α</span>
            <span>{f(p.a, 3)} /yr</span>

            <span style={{color: c.ink2}}>Settling time 4/α</span>
            <span>{p.a > 0 ? `${f(4 / p.a, 1)} yr` : 'never'}</span>

            <span style={{color: c.ink2}}>Backlash depth</span>
            <span>{sim.tr ? `${Math.round(100 * depth)}% of peak` : 'none'}</span>

            <span style={{color: c.ink2}}>Regime</span>
            <span>{p.z < 1 ? 'underdamped' : p.z === 1 ? 'critical' : 'overdamped'}</span>
          </div>
        </section>

        <section
          style={{
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '14px 18px',
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: c.labelSm,
            }}
          >
            FOUR FITTED SHOCKS (CALIBRATION)
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {SHOCKS.map((s, idx) => (
              <div
                key={s.y}
                style={{
                  borderBottom: idx < SHOCKS.length - 1 ? `1px solid rgba(138,106,69,0.3)` : 'none',
                  paddingBottom: 8,
                }}
              >
                <div style={{fontWeight: 600, fontSize: 13, color: c.ink}}>
                  {s.y} · {s.name}
                </div>
                <div style={{fontSize: 12, color: c.ink2, fontFamily: c.tokens.fonts.mono}}>
                  ζ {s.z.toFixed(2)} · ω_n {s.wn.toFixed(2)} rad/yr · period{' '}
                  {( (2 * Math.PI) / s.wn).toFixed(1)} yr
                </div>
                <div style={{fontSize: 11.5, color: c.labelSm}}>{s.proxy}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section
        style={{
          background: c.well,
          border: `1px solid ${c.rule}`,
          borderRadius: 8,
          padding: '14px 18px',
        }}
      >
        <h2
          style={{
            margin: '0 0 10px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: c.labelSm,
          }}
        >
          SOURCES AND MANUSCRIPT LINE REFERENCES
        </h2>
        <p style={{margin: '0 0 10px', fontSize: 13, lineHeight: 1.6, color: c.ink2}}>
          Sources: the governing equation and solution, eq. 1.7a–1.7b (
          <code>Paper/The_Original_Power.tex:2208</code>); the convergence prediction and the resonance
          escape condition (<code>:2316</code>, <code>:2319</code>); the four fits from{' '}
          <code>Paper/scripts/spectral_laplace.ipynb</code> with proxies in{' '}
          <code>Paper/data/backlash_proxies.csv</code> (<code>:7029</code>–<code>:7034</code>). The
          fits identify ζ and ω_n only, so each preset fixes L = 1 and sets C = 1/ω_n² and R = 2ζω_n.
          The manuscript states that R, L, and C are not read off the record; the supported claim is
          ordinal: damping rises and the period shortens from shock to shock (<code>:2390</code>).
        </p>
        <p style={{margin: 0, fontSize: 13, lineHeight: 1.6, color: c.ink2}}>
          From 1865 to 2020 the damping ratio rises from 0.17 to 0.97 and the natural period shrinks from
          about 21 years to under one year. Each card uses its own time window, so the shapes compare
          damping and swing, not duration. The first backlash depth falls from 58% of the peak (1865) to
          0% (2020): each wave of backlash comes faster and swings less.
        </p>
      </section>
    </div>
  );
}

function ExpandedOscillatorView({
  model,
  width,
  height,
  interactive,
  onChangeModel,
}: {
  model: BacklashOscillatorModel;
  width: number;
  height: number;
  interactive: boolean;
  onChangeModel?: React.Dispatch<React.SetStateAction<BacklashOscillatorModel>>;
}): JSX.Element {
  const c = useOscillatorTokens();
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const sim = getSimulation(model.R, model.L, model.C, model.V0, model.mode, model.w, 700);
  const p = sim.p;
  const T = sim.T;
  const pts = sim.pts;

  let qmax = sim.qmax;
  let qmin = sim.qmin;
  const A = Math.max(qmax, -qmin, 1e-9);
  const top = A * 1.15;
  const bot = -A * 0.95;

  const PW = 980;
  const PH = 540;
  const PL = 70;
  const PR = 40;
  const PT = 40;
  const PB = 60;

  const X = (t: number) => PL + (t / T) * (PW - PL - PR);
  const Y = (q: number) => PT + ((top - q) / (top - bot)) * (PH - PT - PB);
  const y0 = Y(0);

  // Time grid step
  const step = T > 150 ? 25 : T > 60 ? 10 : T > 25 ? 5 : T > 8 ? 2 : T > 3 ? 1 : 0.25;
  const gridLines: JSX.Element[] = [];
  for (let t = step; t < T * 0.98; t += step) {
    const x = X(t);
    const label = model.year
      ? `${model.year + (step < 1 ? t : Math.round(t))}`
      : `+${step < 1 ? t : Math.round(t)}`;
    gridLines.push(
      <g key={t}>
        <line
          x1={x.toFixed(1)}
          y1={PT}
          x2={x.toFixed(1)}
          y2={PH - PB}
          stroke={c.rule}
          strokeOpacity={0.35}
        />
        <text
          x={x.toFixed(1)}
          y={PH - PB + 22}
          textAnchor="middle"
          fontSize={14}
          fill={c.labelSm}
          fontFamily={c.tokens.fonts.mono}
        >
          {label}
        </text>
      </g>,
    );
  }

  // Segmenting the q(t) trace into positive (accent) and negative (red)
  let seg = '';
  let state: boolean | null = null;
  const pathNodes: JSX.Element[] = [];

  for (let i = 0; i < pts.length; i++) {
    const s = pts[i];
    const st = s[1] >= 0;
    const xy = `${X(s[0]).toFixed(1)} ${Y(s[1]).toFixed(1)}`;
    if (state === null) state = st;
    if (st !== state) {
      seg += `L${xy}`;
      pathNodes.push(
        <path
          key={i}
          d={seg}
          fill="none"
          stroke={state ? c.accent : c.red}
          strokeWidth={3.5}
          strokeLinejoin="round"
          filter={`url(#${id}-glow)`}
        />,
      );
      seg = `M${xy}`;
      state = st;
    } else {
      seg += (seg ? 'L' : 'M') + xy;
    }
  }
  if (seg) {
    pathNodes.push(
      <path
        key="tail"
        d={seg}
        fill="none"
        stroke={state ? c.accent : c.red}
        strokeWidth={3.5}
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />,
    );
  }

  // Periodic drive overlay path
  let periodicPath = '';
  if (model.mode === 'periodic') {
    for (let u = 0; u <= 60; u++) {
      const tt = (u / 60) * Math.min(T, (4 * 2 * Math.PI) / (model.w * p.w0));
      periodicPath += `${u ? 'L' : 'M'}${X(tt).toFixed(1)} ${(y0 - 18 * Math.cos(model.w * p.w0 * tt)).toFixed(1)}`;
    }
  }

  // First peak & trough
  const pk = sim.pk;
  const tr = sim.tr;
  const depth = pk && tr ? -tr[1] / pk[1] : 0;

  // Stats strings
  const statsList = [
    {label: 'Damping ratio ζ', val: f(p.z, 2)},
    {label: 'Natural period 2π/ω₀', val: `${f((2 * Math.PI) / p.w0, 1)} yr`},
    {label: 'Decay rate α = R/2L', val: `${f(p.a, 3)} /yr`},
    {label: 'Settling time (4/α)', val: p.a > 0 ? `${f(4 / p.a, 1)} yr` : 'never'},
    {label: 'First backlash depth', val: tr ? `${Math.round(100 * depth)}% of the peak` : 'none'},
    {
      label: 'First crossing below 0',
      val:
        sim.cross == null
          ? 'none'
          : model.year
            ? `${Math.round(model.year + sim.cross)} (+${f(sim.cross, 1)} yr)`
            : `+${f(sim.cross, 1)} yr`,
    },
    {label: 'Quality factor Q', val: isFinite(p.Q) ? f(p.Q, 2) : '∞'},
    {label: 'Regime', val: p.z < 1 ? 'underdamped' : p.z === 1 ? 'critical' : 'overdamped'},
  ];

  // Verdict string
  let verdict = '';
  if (model.mode === 'periodic') {
    let amp = 0;
    const n = pts.length;
    for (let j = Math.floor(n * 0.75); j < n; j++) {
      amp = Math.max(amp, Math.abs(pts[j][1]));
    }
    const res = model.R > 0 ? model.V0 / (model.R * p.w0) : Infinity;
    verdict = `Sustained drive at ${f(model.w, 2)}×ω₀: late swing amplitude ${f(amp, 2)}. At resonance (ω = ω₀) the steady amplitude is V₀/(Rω₀) = ${
      isFinite(res) ? f(res, 2) : 'unbounded'
    }, which is Q = ${isFinite(p.Q) ? f(p.Q, 2) : '∞'} times the off-resonance response. The manuscript reads this as the only forcing that can exceed the circuit’s absorption capacity (:2319).`;
  } else {
    verdict =
      p.z < 1
        ? `Underdamped: the shock lifts q above the baseline, and the circuit swings it ${
            tr ? Math.round(100 * (-tr[1] / pk![1])) + '% of that height ' : ''
          }below zero into backlash, then decays toward q = 0. Without a sustained V(t), q(t) → 0 (:2316).`
        : 'Overdamped or critical: q returns to the baseline without swinging below it. The manuscript’s fitted shocks are all underdamped (ζ < 1).';
  }

  const loadShock = (i: number) => {
    if (!onChangeModel) return;
    const s = SHOCKS[i];
    onChangeModel({
      R: 2 * s.z * s.wn,
      L: 1,
      C: 1 / (s.wn * s.wn),
      V0: 1,
      mode: 'impulse',
      w: 1,
      year: s.y,
      preset: i,
    });
  };

  const updateParam = (key: 'R' | 'L' | 'C' | 'V0' | 'w', val: number) => {
    if (!onChangeModel) return;
    onChangeModel(prev => ({
      ...prev,
      [key]: val,
      preset: -1,
      year: 0,
    }));
  };

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '430px minmax(0, 1fr)',
        gap: 20,
        padding: '16px 20px',
        overflow: 'hidden',
        color: c.ink,
        fontFamily: c.tokens.fonts.sans,
      }}
    >
      {/* Left Column: Circuit & Presets */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        <section
          style={{
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '12px 14px',
          }}
          aria-label="Circuit"
        >
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: c.labelSm,
            }}
          >
            THE CIRCUIT
          </h2>

          <svg
            viewBox="0 0 700 520"
            role="img"
            aria-label="Series RLC circuit: source V(t), resistor R, inductor L, capacitor C."
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            {/* Wires */}
            <path
              d="M60 215 V120 H140 M270 120 H315 M452 120 H552 M568 120 H660 V385 H60 V291"
              fill="none"
              stroke={c.wire}
              strokeWidth={3}
              strokeLinejoin="miter"
            />
            {/* Source */}
            <g aria-label="Reform shock size">
              <circle cx="60" cy="253" r="38" fill="none" stroke={c.gold} strokeWidth={3.5} />
              <path
                d="M38 253 C46 230, 54 230, 60 253 S74 276, 82 253"
                fill="none"
                stroke={c.gold}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <text x="116" y="268" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="34" fill={c.gold}>
                V(t)
              </text>
              <text x="116" y="296" fontSize="17" fill={c.gold} fontFamily={c.tokens.fonts.sans}>
                reform shock
              </text>
            </g>
            {/* Resistor R */}
            <g aria-label="Resistor R: bureaucratic and carceral friction">
              <rect x="132" y="88" width="146" height="64" fill="transparent" />
              <path
                d="M140 120 L148 120 L160 100 L176 140 L192 100 L208 140 L224 100 L240 140 L256 100 L264 120 L270 120"
                fill="none"
                stroke={c.red}
                strokeWidth={3.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <text x="205" y="58" textAnchor="middle" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.red}>
                R
              </text>
            </g>
            {/* Inductor L */}
            <g aria-label="Inductor L: cultural inertia">
              <rect x="308" y="80" width="152" height="64" fill="transparent" />
              <path
                d="M315 120 C315 72, 349 72, 349 120 M349 120 C349 72, 383 72, 383 120 M383 120 C383 72, 417 72, 417 120 M417 120 C417 72, 451 72, 451 120"
                fill="none"
                stroke={c.green}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <text x="383" y="58" textAnchor="middle" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.green}>
                L
              </text>
            </g>
            {/* Capacitor C */}
            <g aria-label="Capacitor C: token-reform absorption capacity">
              <rect x="536" y="80" width="48" height="84" fill="transparent" />
              <line x1="552" y1="84" x2="552" y2="156" stroke={c.wire} strokeWidth={4} strokeLinecap="round" />
              <line x1="568" y1="84" x2="568" y2="156" stroke={c.wire} strokeWidth={4} strokeLinecap="round" />
              <text x="560" y="58" textAnchor="middle" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.wire}>
                C
              </text>
            </g>
            {/* Governing equation */}
            <g aria-label="L q double dot plus R q dot plus q over C equals V of t">
              <text x="84" y="486" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.ink}>
                L q̈ + R q̇ +
              </text>
              <text x="324" y="461" textAnchor="middle" fontFamily="'STIX Two Text', serif" fontSize="34" fill={c.ink}>
                1
              </text>
              <line x1="306" y1="473" x2="342" y2="473" stroke={c.ink} strokeWidth="2" />
              <text x="324" y="512" textAnchor="middle" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.ink}>
                C
              </text>
              <text x="352" y="486" fontStyle="italic" fontFamily="'STIX Two Text', serif" fontSize="40" fill={c.ink}>
                q = V(t)
              </text>
            </g>
          </svg>

          {/* Slider / Readouts */}
          <div style={{marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6}}>
            {/* R */}
            <div style={{display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr) 55px', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 12.5, fontFamily: "'STIX Two Text', serif", fontStyle: 'italic'}}>
                R <span style={{fontStyle: 'normal', fontSize: 11, color: c.ink2}}>friction</span>
              </span>
              {interactive ? (
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.01"
                  value={model.R}
                  onChange={e => updateParam('R', +e.target.value)}
                  style={{width: '100%', accentColor: c.red}}
                />
              ) : (
                <div style={{height: 6, borderRadius: 3, background: c.zone, overflow: 'hidden'}}>
                  <div style={{width: `${clamp((model.R / 15) * 100, 0, 100)}%`, height: '100%', background: c.red}} />
                </div>
              )}
              <span style={{fontSize: 12, fontFamily: c.tokens.fonts.mono, textAlign: 'right'}}>{f(model.R, 3)}</span>
            </div>

            {/* L */}
            <div style={{display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr) 55px', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 12.5, fontFamily: "'STIX Two Text', serif", fontStyle: 'italic'}}>
                L <span style={{fontStyle: 'normal', fontSize: 11, color: c.ink2}}>inertia</span>
              </span>
              {interactive ? (
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={Math.log10(model.L)}
                  onChange={e => updateParam('L', Math.pow(10, +e.target.value))}
                  style={{width: '100%', accentColor: c.green}}
                />
              ) : (
                <div style={{height: 6, borderRadius: 3, background: c.zone, overflow: 'hidden'}}>
                  <div style={{width: `${clamp(((Math.log10(model.L) + 1) / 2) * 100, 0, 100)}%`, height: '100%', background: c.green}} />
                </div>
              )}
              <span style={{fontSize: 12, fontFamily: c.tokens.fonts.mono, textAlign: 'right'}}>{f(model.L, 3)}</span>
            </div>

            {/* C */}
            <div style={{display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr) 55px', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 12.5, fontFamily: "'STIX Two Text', serif", fontStyle: 'italic'}}>
                C <span style={{fontStyle: 'normal', fontSize: 11, color: c.ink2}}>absorption</span>
              </span>
              {interactive ? (
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.01"
                  value={Math.log10(model.C)}
                  onChange={e => updateParam('C', Math.pow(10, +e.target.value))}
                  style={{width: '100%', accentColor: c.wire}}
                />
              ) : (
                <div style={{height: 6, borderRadius: 3, background: c.zone, overflow: 'hidden'}}>
                  <div style={{width: `${clamp(((Math.log10(model.C) + 2.5) / 5) * 100, 0, 100)}%`, height: '100%', background: c.wire}} />
                </div>
              )}
              <span style={{fontSize: 12, fontFamily: c.tokens.fonts.mono, textAlign: 'right'}}>{f(model.C, 3)}</span>
            </div>

            {/* V0 */}
            <div style={{display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr) 55px', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 12.5, fontFamily: "'STIX Two Text', serif", fontStyle: 'italic'}}>
                V₀ <span style={{fontStyle: 'normal', fontSize: 11, color: c.ink2}}>shock</span>
              </span>
              {interactive ? (
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={model.V0}
                  onChange={e => updateParam('V0', +e.target.value)}
                  style={{width: '100%', accentColor: c.gold}}
                />
              ) : (
                <div style={{height: 6, borderRadius: 3, background: c.zone, overflow: 'hidden'}}>
                  <div style={{width: `${clamp(((model.V0 - 0.1) / 2.9) * 100, 0, 100)}%`, height: '100%', background: c.gold}} />
                </div>
              )}
              <span style={{fontSize: 12, fontFamily: c.tokens.fonts.mono, textAlign: 'right'}}>{f(model.V0, 2)}</span>
            </div>
          </div>
        </section>

        {/* Four Fitted Shocks Cards */}
        <section
          style={{
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '12px 14px',
          }}
          aria-label="Fitted shocks"
        >
          <h2
            style={{
              margin: '0 0 10px',
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: c.labelSm,
            }}
          >
            FOUR FITTED SHOCKS
          </h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8}}>
            {SHOCKS.map((s, idx) => {
              const active = idx === model.preset;
              const a = s.z * s.wn;
              const wd = s.wn * Math.sqrt(1 - s.z * s.z);
              const cardT = Math.max(4 / a, (2.2 * 2 * Math.PI) / wd);
              const W = 180;
              const H = 60;
              const ptsList: [number, number][] = [];
              let mx = 0;
              for (let u = 0; u <= 100; u++) {
                const tt = (u / 100) * cardT;
                const qq = Math.exp(-a * tt) * Math.sin(wd * tt);
                ptsList.push([tt, qq]);
                mx = Math.max(mx, Math.abs(qq));
              }

              let cardSeg = '';
              let cardSt: boolean | null = null;
              const cardPaths: JSX.Element[] = [];
              for (let j = 0; j < ptsList.length; j++) {
                const ptt = ptsList[j];
                const xx = (4 + (ptt[0] / cardT) * (W - 8)).toFixed(1);
                const yy = (H / 2 - (ptt[1] / mx) * (H / 2 - 6)).toFixed(1);
                const s2 = ptt[1] >= 0;
                if (cardSt === null) cardSt = s2;
                if (s2 !== cardSt) {
                  cardSeg += `L${xx} ${yy}`;
                  cardPaths.push(
                    <path
                      key={j}
                      d={cardSeg}
                      fill="none"
                      stroke={cardSt ? c.accent : c.red}
                      strokeWidth={1.8}
                    />,
                  );
                  cardSeg = `M${xx} ${yy}`;
                  cardSt = s2;
                } else {
                  cardSeg += (cardSeg ? 'L' : 'M') + `${xx} ${yy}`;
                }
              }
              if (cardSeg) {
                cardPaths.push(
                  <path
                    key="tail"
                    d={cardSeg}
                    fill="none"
                    stroke={cardSt ? c.accent : c.red}
                    strokeWidth={1.8}
                  />,
                );
              }

              const cardContent = (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: active ? c.gold : c.ink,
                      marginBottom: 4,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.y} · {s.name}
                  </div>
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    style={{display: 'block', width: '100%', height: 'auto', marginBottom: 4}}
                    aria-hidden="true"
                  >
                    <rect x="0" y={H / 2} width={W} height={H / 2} fill={c.zone} />
                    <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke={c.wire} strokeWidth={1} strokeOpacity={0.4} />
                    {cardPaths}
                  </svg>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontFamily: c.tokens.fonts.mono,
                      color: c.ink2,
                      lineHeight: 1.35,
                    }}
                  >
                    ζ {s.z.toFixed(2)} · {((2 * Math.PI) / s.wn).toFixed(1)} yr
                  </div>
                </>
              );

              if (interactive) {
                return (
                  <button
                    key={s.y}
                    type="button"
                    onClick={() => loadShock(idx)}
                    aria-pressed={active}
                    style={{
                      background: c.well,
                      border: `1px solid ${active ? c.gold : c.rule}`,
                      borderRadius: 6,
                      padding: '8px 8px 6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: c.ink,
                      boxSizing: 'border-box',
                    }}
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <div
                  key={s.y}
                  aria-pressed={active}
                  style={{
                    background: c.well,
                    border: `1px solid ${active ? c.gold : c.rule}`,
                    borderRadius: 6,
                    padding: '8px 8px 6px',
                    textAlign: 'left',
                    color: c.ink,
                    boxSizing: 'border-box',
                  }}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>

          <p style={{margin: '8px 0 0', fontSize: 11, color: c.ink2, lineHeight: 1.4}}>
            From 1865 to 2020 the damping ratio rises from 0.17 to 0.97 and the natural period shrinks from 21 years to under 1 year.
          </p>
        </section>
      </div>

      {/* Right Column: Response & Stats */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        {/* Header lede */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12}}>
          <div>
            <h1
              style={{
                margin: '0 0 4px',
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: c.ink,
              }}
            >
              Backlash Oscillator
            </h1>
            <p style={{margin: 0, fontSize: 12.5, lineHeight: 1.4, color: c.ink2}}>
              The manuscript’s series RLC circuit (eq. 1.7a): a reform shock V(t) displaces the equality-surplus charge q(t) above the extraction baseline, pulling back into backlash below zero.
            </p>
          </div>

          {/* Drive mode selection */}
          <div style={{display: 'flex', gap: 6, flexShrink: 0}} role="group" aria-label="Drive">
            {(
              [
                ['impulse', 'Impulse shock'],
                ['charge', 'Initial charge Q₀'],
                ['periodic', 'Sustained drive'],
              ] as const
            ).map(([m, label]) => {
              const active = model.mode === m;
              if (interactive) {
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      if (!onChangeModel) return;
                      onChangeModel(prev => ({...prev, mode: m}));
                    }}
                    aria-pressed={active}
                    style={{
                      fontSize: 11.5,
                      padding: '5px 9px',
                      border: `1px solid ${active ? c.gold : c.rule}`,
                      borderRadius: 5,
                      background: c.well,
                      color: active ? c.gold : c.ink,
                      cursor: 'pointer',
                      fontFamily: c.tokens.fonts.sans,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </button>
                );
              }
              return (
                <div
                  key={m}
                  aria-pressed={active}
                  style={{
                    fontSize: 11.5,
                    padding: '5px 9px',
                    border: `1px solid ${active ? c.gold : c.rule}`,
                    borderRadius: 5,
                    background: c.well,
                    color: active ? c.gold : c.ink2,
                    fontFamily: c.tokens.fonts.sans,
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Plot SVG */}
        <section
          style={{
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '8px 12px 10px',
            position: 'relative',
          }}
          aria-label="The response"
        >
          <svg
            viewBox={`0 0 ${PW} ${PH}`}
            role="img"
            aria-label="q of t over time, with the extraction baseline at q equals zero"
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            <defs>
              <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="0" y="0" width={PW} height={PH}>
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id={`${id}-ah`}
                viewBox="0 0 12 12"
                refX="6"
                refY="6"
                markerWidth="16"
                markerHeight="16"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.wire} />
              </marker>
              <marker
                id={`${id}-ag`}
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerWidth="26"
                markerHeight="26"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M0,0 L12,6 L0,12 z" fill={c.gold} />
              </marker>
            </defs>

            {/* Backlash extraction zone */}
            <rect
              x={PL}
              y={y0.toFixed(1)}
              width={PW - PL - PR}
              height={(PH - PB - y0).toFixed(1)}
              fill={c.zone}
            />
            <text
              x={PL + 18}
              y={PH - PB - 14}
              fontSize="17"
              fill={c.red}
              fontFamily={c.tokens.fonts.sans}
            >
              below q = 0 · backlash into the extraction zone
            </text>

            {/* Time grid */}
            {gridLines}

            {/* Vertical axis */}
            <line
              x1={PL}
              y1={PH - PB + 6}
              x2={PL}
              y2={PT - 12}
              stroke={c.wire}
              strokeWidth={2.5}
              markerEnd={`url(#${id}-ah)`}
            />

            {/* Baseline axis */}
            <line
              x1={PL}
              y1={y0.toFixed(1)}
              x2={PW - PR + 20}
              y2={y0.toFixed(1)}
              stroke={c.wire}
              strokeWidth={2.5}
              markerEnd={`url(#${id}-ah)`}
            />

            {/* Axis text */}
            <text
              x={PL + 16}
              y={PT + 4}
              fontStyle="italic"
              fontFamily="'STIX Two Text', serif"
              fontSize="28"
              fill={c.ink}
            >
              q(t)
            </text>
            <text
              x={PL + 86}
              y={PT}
              fontSize="16"
              fill={c.ink2}
              fontFamily={c.tokens.fonts.sans}
            >
              equality-surplus charge
            </text>

            <text
              x={PW - PR}
              y={(y0 - 12).toFixed(1)}
              textAnchor="end"
              fontSize="16"
              fill={c.ink}
              fontFamily={c.tokens.fonts.sans}
            >
              q = 0 · extraction baseline
            </text>
            <text
              x={PW - PR}
              y={(y0 + 36).toFixed(1)}
              textAnchor="end"
              fontStyle="italic"
              fontFamily="'STIX Two Text', serif"
              fontSize="26"
              fill={c.ink}
            >
              t
            </text>

            {/* Drive mode indicators */}
            {model.mode === 'impulse' && (
              <line
                x1={PL + 8}
                y1={y0.toFixed(1)}
                x2={PL + 8}
                y2={PT + 28}
                stroke={c.gold}
                strokeWidth={5}
                markerEnd={`url(#${id}-ag)`}
              />
            )}
            {model.mode === 'charge' && (
              <circle
                cx={X(0)}
                cy={Y(model.V0).toFixed(1)}
                r="7"
                fill={c.gold}
              />
            )}
            {model.mode === 'periodic' && (
              <path
                d={periodicPath}
                fill="none"
                stroke={c.gold}
                strokeWidth={2}
                strokeOpacity={0.6}
              />
            )}

            {/* Main response curve */}
            {pathNodes}

            {/* Peak indicator */}
            {pk && (
              <g>
                <circle cx={X(pk[0]).toFixed(1)} cy={Y(pk[1]).toFixed(1)} r={5} fill={c.accent} />
                <text
                  x={(X(pk[0]) + 10).toFixed(1)}
                  y={(Y(pk[1]) + 22).toFixed(1)}
                  fontSize="14"
                  fill={c.accent}
                  fontFamily={c.tokens.fonts.sans}
                >
                  reform displacement
                </text>
              </g>
            )}

            {/* Trough indicator */}
            {tr && (
              <g>
                <circle cx={X(tr[0]).toFixed(1)} cy={Y(tr[1]).toFixed(1)} r={5} fill={c.red} />
                <text
                  x={(X(tr[0]) + 10).toFixed(1)}
                  y={(Y(tr[1]) + 22).toFixed(1)}
                  fontSize="14"
                  fill={c.red}
                  fontFamily={c.tokens.fonts.sans}
                >
                  first backlash
                </text>
              </g>
            )}
          </svg>
        </section>

        {/* 8 Stats Grid */}
        <dl
          style={{
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '8px 14px',
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          {statsList.map(st => (
            <div key={st.label}>
              <dt style={{fontSize: 11, color: c.ink2, margin: 0}}>{st.label}</dt>
              <dd
                style={{
                  margin: '2px 0 0',
                  fontSize: 13.5,
                  fontWeight: 500,
                  fontFamily: c.tokens.fonts.mono,
                  fontVariantNumeric: 'tabular-nums',
                  color: c.ink,
                }}
              >
                {st.val}
              </dd>
            </div>
          ))}
        </dl>

        {/* Verdict text */}
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: c.ink,
            background: c.well,
            border: `1px solid ${c.rule}`,
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          {verdict}
        </p>
      </div>
    </div>
  );
}
