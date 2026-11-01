import React, {useState, type JSX} from 'react';
import {MathText, useTokens, type InstrumentMode} from '@stage';
import {color} from '../../tokens';
import engineData from './data/interference-engine.json';

export type LogEntry = {
  n: number;
  title: string;
  phi: [number, number] | null;
  rho: [number, number] | null;
  point: number | null;
};

export const LOGS = engineData.log as LogEntry[];

export type Preset = {
  name: string;
  u: number;
  phi: number | null;
  on: Record<string, number>;
  note: string;
};

export const PRESETS: Preset[] = [
  {name: 'Pre-1964', u: 0, phi: 0.078, on: {race: 1, gender: 0, rel: 0, sex: 0, nat: 0, abl: 0}, note: 'race axis only; ANES phi_load 0.078'},
  {name: 'Post-1980', u: 0.6, phi: 0.403, on: {race: 1, gender: 1, rel: 1, sex: 1, nat: 1, abl: 0}, note: 'four axes added; ANES phi_load 0.403'},
  {name: 'Weimar 1932', u: 1 / 1.03, phi: null, on: {race: 0, gender: 0, rel: 0, sex: 0, nat: 1, abl: 0}, note: 'one channel; class/identity power 0.03'},
  {name: 'Google Trends 2024', u: 1 / 1.016, phi: null, on: {race: 1, gender: 1, rel: 1, sex: 1, nat: 1, abl: 1}, note: 'class share 0.016'},
];

export const AXES = [
  {k: 'race', name: 'Race', f: 0.40},
  {k: 'gender', name: 'Gender', f: 0.50},
  {k: 'rel', name: 'Religion', f: 0.67},
  {k: 'sex', name: 'Sexuality', f: 0.80},
  {k: 'nat', name: 'Nationality', f: 1.00},
  {k: 'abl', name: 'Ability', f: 1.20},
] as const;

export const DEFAULT_AXES_ON: Record<string, number> = {
  race: 1,
  gender: 1,
  rel: 1,
  sex: 1,
  nat: 1,
  abl: 0,
};

export const NG = 24;
export const UO: readonly number[] = [
  -0.9765904936939478, -0.8760834848508239, 0.95381526555866, 0.39805741142481565,
  0.042890537064522505, -0.18895662389695644, -0.06753473496064544, -0.5201496281661093,
  0.10665120789781213, 0.4596441797912121, -0.48436887795105577, -0.6881032721139491,
  0.5281797731295228, 0.03680509142577648, -0.6057254797779024, -0.2640828131698072,
  -0.4135053241625428, 0.06947905104607344, -0.40733950352296233, 0.9558922089636326,
  -0.5049328114837408, 0.7555591911077499, -0.6184165813028812, -0.7126852278597653,
];

export function meanR(a: number): number {
  let c = 0;
  let s = 0;
  for (let j = 0; j < NG; j++) {
    c += Math.cos(a * UO[j]);
    s += Math.sin(a * UO[j]);
  }
  return Math.hypot(c, s) / NG;
}

const ampCache = new Map<number, number>();
export function ampFor(phi: number): number {
  const key = Math.round(phi * 10000);
  const cached = ampCache.get(key);
  if (cached !== undefined) return cached;
  let lo = 0;
  let hi = Math.PI;
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    if (1 - meanR(m) < phi) lo = m;
    else hi = m;
  }
  const res = (lo + hi) / 2;
  ampCache.set(key, res);
  return res;
}

export function pclassOf(u: number, n: number, on: Record<string, number>): number {
  const act = AXES.some(a => Boolean(on[a.k]));
  return (1 - n) * (act ? 1 - u : 1);
}

export function rhoOf(m0: number, u: number, n: number, phi: number, on: Record<string, number>): number {
  const pc = pclassOf(u, n, on);
  return m0 * pc * Math.pow(1 - phi, 2);
}

export function needM0(
  e: {phi?: [number, number] | null; rho?: [number, number] | null},
  u = 0.6,
  n = 0.1,
  on: Record<string, number> = DEFAULT_AXES_ON,
): number {
  if (!e.phi || !e.rho) return NaN;
  const pm = (e.phi[0] + e.phi[1]) / 2;
  const rm = (e.rho[0] + e.rho[1]) / 2;
  const pc = pclassOf(u, n, on);
  const denom = pc * Math.pow(1 - pm, 2);
  return denom > 0 ? rm / denom : NaN;
}

export function fmt(v: number): string {
  if (!isFinite(v)) return '—';
  const a = Math.abs(v);
  return a >= 1000
    ? Math.round(v).toLocaleString('en-US')
    : a >= 100
      ? v.toFixed(0)
      : a >= 10
        ? v.toFixed(1)
        : a >= 1
          ? v.toFixed(2)
          : v.toFixed(3);
}

export function computeVerdict(
  r: number,
  m0: number,
  n: number,
  phi: number,
  u: number,
  pc: number,
  coh: number,
): string {
  if (r >= 1) {
    return `ρ_τ = ${r >= 10 ? r.toFixed(1) : r.toFixed(2)}: the class signal that survives both levers reaches τ. This is the crash condition.`;
  }
  const nu = 1 - 1 / (m0 * (1 - n) * coh);
  const nphi = 1 - Math.sqrt(1 / (m0 * pc));
  const parts: string[] = [];
  if (nu > 0) {
    parts.push(`the spectral lever falls from u = ${u.toFixed(2)} to ${nu.toFixed(2)}`);
  }
  if (isFinite(nphi) && nphi > 0) {
    parts.push(`the phase lever falls from Φ_load = ${phi.toFixed(2)} to ${nphi.toFixed(2)}`);
  }
  return `ρ_τ = ${r.toFixed(2)}: kernel-safe. ${
    parts.length
      ? `At this class pressure, τ comes into reach when ${parts.join(', or when ')}.`
      : 'At this class pressure, neither lever alone can bring τ into reach; both must fall, or the pressure must rise.'
  }`;
}

export type InterferenceEngineModel = {
  u: number;
  n: number;
  phi: number;
  m0: number;
  A: number;
  on: Record<string, number>;
  log: number;
  rhoCrash?: number | null;
};

export type InterferenceEngineEraResult = InterferenceEngineModel & {
  modelDefault: boolean;
};

export function interferenceEngineFromEra(
  era?: {log: number; fields: Record<string, unknown>},
): InterferenceEngineEraResult {
  const defaultInputs: InterferenceEngineModel = {
    u: 0.6,
    n: 0.1,
    phi: 0.403,
    m0: 3,
    A: 1,
    on: {...DEFAULT_AXES_ON},
    log: 15,
    rhoCrash: null,
  };

  if (!era || !era.fields || typeof era.fields !== 'object') {
    return {...defaultInputs, modelDefault: true};
  }

  const istate = era.fields.interference_state as
    | {
        phi_load?: [number, number] | null;
        rho_tau?: [number, number] | null;
        rho_tau_crash?: number | null;
      }
    | undefined;

  if (
    !istate ||
    !Array.isArray(istate.phi_load) ||
    istate.phi_load.length < 2 ||
    !Array.isArray(istate.rho_tau) ||
    istate.rho_tau.length < 2
  ) {
    return {...defaultInputs, modelDefault: true};
  }

  const phi = (Number(istate.phi_load[0]) + Number(istate.phi_load[1])) / 2;
  const rhoMid = (Number(istate.rho_tau[0]) + Number(istate.rho_tau[1])) / 2;
  const u = 0.6;
  const n = 0.1;
  const on = {...DEFAULT_AXES_ON};
  const pc = pclassOf(u, n, on);
  const coh = Math.pow(1 - phi, 2);
  const denom = pc * coh;
  const rawM0 = denom > 0 ? rhoMid / denom : 3;
  const m0 = Math.max(0.2, Math.min(1000, rawM0));
  const log = typeof era.log === 'number' ? era.log : 15;
  const rhoCrash = istate.rho_tau_crash != null ? Number(istate.rho_tau_crash) : null;

  return {
    u,
    n,
    phi,
    m0,
    A: 1,
    on,
    log,
    rhoCrash,
    modelDefault: false,
  };
}

export type InterferenceEngineViewProps = {
  mode: InstrumentMode;
  width: number;
  height: number;
  interactive: boolean;
  era?: {log: number; fields: Record<string, unknown>};
};

export function InterferenceEngineView(props: InterferenceEngineViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveInterferenceEngineView {...props} />;
  }
  return <StaticInterferenceEngineView {...props} />;
}

function StaticInterferenceEngineView(props: InterferenceEngineViewProps): JSX.Element {
  const tokens = useTokens();
  const eraResult = interferenceEngineFromEra(props.era);

  if (props.mode === 'compact') {
    return <CompactView model={eraResult} width={props.width} height={props.height} tokens={tokens} />;
  }

  if (props.mode === 'settings') {
    return <SettingsView model={eraResult} width={props.width} height={props.height} tokens={tokens} />;
  }

  return (
    <ExpandedView
      model={eraResult}
      width={props.width}
      height={props.height}
      tokens={tokens}
      interactive={false}
    />
  );
}

function InteractiveInterferenceEngineView(props: InterferenceEngineViewProps): JSX.Element {
  const tokens = useTokens();
  const eraResult = interferenceEngineFromEra(props.era);
  const [u, setU] = useState(eraResult.u);
  const [n, setN] = useState(eraResult.n);
  const [phi, setPhi] = useState(eraResult.phi);
  const [m0, setM0] = useState(eraResult.m0);
  const [selectedLog, setSelectedLog] = useState(eraResult.log);
  const [axesOn, setAxesOn] = useState<Record<string, number>>(eraResult.on);

  const model: InterferenceEngineEraResult = {
    u,
    n,
    phi,
    m0,
    A: 1,
    on: axesOn,
    log: selectedLog,
    rhoCrash: eraResult.rhoCrash,
    modelDefault: eraResult.modelDefault,
  };

  if (props.mode === 'compact') {
    return <CompactView model={model} width={props.width} height={props.height} tokens={tokens} />;
  }

  if (props.mode === 'settings') {
    return <SettingsView model={model} width={props.width} height={props.height} tokens={tokens} />;
  }

  const handlePreset = (p: Preset) => {
    setU(p.u);
    if (p.phi != null) setPhi(p.phi);
    setAxesOn({...DEFAULT_AXES_ON, ...p.on});
  };

  const handleFit = () => {
    const entry = LOGS.find(x => x.n === selectedLog);
    if (!entry || !entry.phi || !entry.rho) return;
    const pm = (entry.phi[0] + entry.phi[1]) / 2;
    setPhi(pm);
    const fitM0 = needM0(entry, u, n, axesOn);
    if (isFinite(fitM0)) {
      setM0(Math.max(0.2, Math.min(1000, fitM0)));
    }
  };

  return (
    <ExpandedView
      model={model}
      width={props.width}
      height={props.height}
      tokens={tokens}
      interactive={true}
      onUChange={setU}
      onNChange={setN}
      onPhiChange={setPhi}
      onM0Change={setM0}
      onSelectLog={setSelectedLog}
      onPreset={handlePreset}
      onFit={handleFit}
    />
  );
}

function CompactView({
  model,
  width,
  height,
  tokens,
}: {
  model: InterferenceEngineEraResult;
  width: number;
  height: number;
  tokens: ReturnType<typeof useTokens>;
}): JSX.Element {
  const currentRho = rhoOf(model.m0, model.u, model.n, model.phi, model.on);
  const a = ampFor(model.phi);

  const miniDots: Array<{cx: number; cy: number}> = [];
  let cs = 0;
  let sn = 0;
  for (let j = 0; j < NG; j++) {
    const p = a * UO[j] + Math.PI / 2;
    cs += Math.cos(p);
    sn += Math.sin(p);
    miniDots.push({
      cx: 22 + 18 * Math.cos(p),
      cy: 22 - 18 * Math.sin(p),
    });
  }
  cs /= NG;
  sn /= NG;
  const miniArrowX = 22 + 18 * cs;
  const miniArrowY = 22 - 18 * sn;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px 8px',
        fontFamily: tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: tokens.fonts.mono,
          color: color('color/text/dim'),
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          lineHeight: '12px',
        }}
      >
        <span><MathText>{'INTERFERENCE ENGINE'}</MathText></span>
        <span style={{fontSize: 10, color: color('color/text/dim')}}><MathText>{'ρ_τ'}</MathText></span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          flex: 1,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: 3, flex: 1}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 4}}>
            <span
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 22,
                fontWeight: 600,
                lineHeight: '24px',
                color: currentRho >= 1 ? '#FF7A6B' : color('color/text/primary'),
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {currentRho >= 10 ? currentRho.toFixed(1) : currentRho.toFixed(2)}
            </span>
            {model.rhoCrash != null && (
              <span
                style={{
                  fontSize: 9,
                  fontFamily: tokens.fonts.mono,
                  color: '#FF7A6B',
                  border: '1px solid #FF7A6B',
                  borderRadius: 3,
                  padding: '1px 3px',
                  lineHeight: '10px',
                }}
              >
                crash &gt; 1.00
              </span>
            )}
          </div>

          <div style={{width: 106, position: 'relative'}}>
            <div
              style={{
                height: 5,
                width: '100%',
                background: color('color/surface/well'),
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (Math.min(currentRho, 1.2) / 1.2) * 100).toFixed(1)}%`,
                  background: currentRho >= 1 ? '#FF7A6B' : color('color/fill/accent'),
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: `${((1.0 / 1.2) * 100).toFixed(1)}%`,
                top: -1,
                width: 2,
                height: 7,
                background: '#FF7A6B',
              }}
              title="τ = 1.0"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 8,
                fontFamily: tokens.fonts.mono,
                color: color('color/text/dim'),
                marginTop: 2,
                lineHeight: '9px',
              }}
            >
              <span>0</span>
              <span style={{color: '#FF7A6B'}}>τ 1.0</span>
              <span>1.2</span>
            </div>
          </div>
        </div>

        <div style={{width: 44, height: 44, flexShrink: 0}}>
          <svg viewBox="0 0 44 44" width={44} height={44} role="img" aria-label="Mini phase circle">
            <circle cx={22} cy={22} r={18} fill="none" stroke={color('color/line/chart')} strokeWidth={1} />
            <line x1={2} y1={22} x2={42} y2={22} stroke={color('color/line/chart')} strokeOpacity={0.3} />
            <line x1={22} y1={2} x2={22} y2={42} stroke={color('color/line/chart')} strokeOpacity={0.3} />
            {miniDots.map((d, i) => (
              <circle key={i} cx={d.cx.toFixed(1)} cy={d.cy.toFixed(1)} r={1.2} fill="#4CC2C2" />
            ))}
            <line
              x1={22}
              y1={22}
              x2={miniArrowX.toFixed(1)}
              y2={miniArrowY.toFixed(1)}
              stroke={currentRho >= 1 ? '#FF7A6B' : color('color/fill/accent')}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle cx={22} cy={22} r={1.5} fill={color('color/text/primary')} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ExpandedView({
  model,
  width,
  height,
  tokens,
  interactive,
  onUChange,
  onNChange,
  onPhiChange,
  onM0Change,
  onSelectLog,
  onPreset,
  onFit,
}: {
  model: InterferenceEngineEraResult;
  width: number;
  height: number;
  tokens: ReturnType<typeof useTokens>;
  interactive: boolean;
  onUChange?: (u: number) => void;
  onNChange?: (n: number) => void;
  onPhiChange?: (phi: number) => void;
  onM0Change?: (m0: number) => void;
  onSelectLog?: (log: number) => void;
  onPreset?: (preset: Preset) => void;
  onFit?: () => void;
}): JSX.Element {
  const currentRho = rhoOf(model.m0, model.u, model.n, model.phi, model.on);
  const pc = pclassOf(model.u, model.n, model.on);
  const coh = Math.pow(1 - model.phi, 2);
  const verdictText = computeVerdict(currentRho, model.m0, model.n, model.phi, model.u, pc, coh);

  // Phase circle parameters
  const C_pc = 160;
  const R_pc = 120;
  const a_pc = ampFor(model.phi);
  let cs_pc = 0;
  let sn_pc = 0;
  const dots: Array<{cx: number; cy: number}> = [];
  for (let j = 0; j < NG; j++) {
    const p = a_pc * UO[j] + Math.PI / 2;
    cs_pc += Math.cos(p);
    sn_pc += Math.sin(p);
    dots.push({
      cx: C_pc + R_pc * Math.cos(p),
      cy: C_pc - R_pc * Math.sin(p),
    });
  }
  cs_pc /= NG;
  sn_pc /= NG;
  const tx_pc = C_pc + R_pc * cs_pc;
  const ty_pc = C_pc - R_pc * sn_pc;
  const ang_pc = Math.atan2(ty_pc - C_pc, tx_pc - C_pc);
  const hl_pc = 12;
  const col_pc = currentRho >= 1 ? '#FF7A6B' : color('color/fill/accent');
  const showArrow_pc = Math.hypot(tx_pc - C_pc, ty_pc - C_pc) > hl_pc + 2;

  // Dial parameters
  const CX_dial = 220;
  const CY_dial = 200;
  const R_dial = 160;
  const MAX_dial = 2;
  const P_dial = (x: number, r: number): [number, number] => {
    const t = Math.PI * (1 - Math.min(x, MAX_dial) / MAX_dial);
    return [CX_dial + r * Math.cos(t), CY_dial - r * Math.sin(t)];
  };
  const arc_dial = (a0: number, b0: number, r: number) => {
    const p = P_dial(a0, r);
    const q = P_dial(b0, r);
    return `M${p[0].toFixed(1)} ${p[1].toFixed(1)} A${r} ${r} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  };
  const nd_dial = P_dial(currentRho, R_dial - 34);
  const tauLineA = P_dial(1, R_dial - 16);
  const tauLineB = P_dial(1, R_dial + 14);

  // Field chart parameters
  const W_f = 900;
  const H_f = 470;
  const L_f = 60;
  const Rr_f = 20;
  const T_f = 20;
  const B_f = 46;
  const YM_f = 1.3;
  const X_f = (p: number) => L_f + p * (W_f - L_f - Rr_f);
  const Y_f = (r: number) => T_f + ((YM_f - Math.min(r, YM_f)) / YM_f) * (H_f - T_f - B_f);

  let curveD = '';
  for (let i = 0; i <= 200; i++) {
    const p = (i / 200) * 0.99;
    const rv = rhoOf(model.m0, model.u, model.n, p, model.on);
    curveD += (i === 0 ? 'M' : 'L') + X_f(p).toFixed(1) + ' ' + Y_f(rv).toFixed(1);
  }

  const selectedLogEntry = LOGS.find(x => x.n === model.log);
  const earlyLogs = LOGS.filter(x => x.phi && x.rho && x.n <= 5);
  const lateLogs = LOGS.filter(x => x.phi && x.rho && x.n >= 14);
  const earlyM0s = earlyLogs.map(x => needM0(x, model.u, model.n, model.on)).filter(isFinite);
  const lateM0s = lateLogs.map(x => needM0(x, model.u, model.n, model.on)).filter(isFinite);
  const minEarly = earlyM0s.length ? Math.min(...earlyM0s) : NaN;
  const maxEarly = earlyM0s.length ? Math.max(...earlyM0s) : NaN;
  const minLate = lateM0s.length ? Math.min(...lateM0s) : NaN;
  const maxLate = lateM0s.length ? Math.max(...lateM0s) : NaN;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontFamily: tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      {/* Top Card: Readout - Distance to tau */}
      <section
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '12px 18px',
          boxSizing: 'border-box',
          height: 382,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        aria-label="Engine readout"
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2
            style={{
              font: `600 12px/1.3 ${tokens.fonts.sans}`,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: color('color/text/dim'),
              margin: 0,
            }}
          >
            Readout: distance to <span style={{textTransform: 'none', letterSpacing: 0}}>τ</span>
          </h2>
          {interactive && (
            <div style={{display: 'flex', gap: 6}}>
              {PRESETS.map((p, idx) => {
                const isSelected =
                  Math.abs(p.u - model.u) < 1e-6 &&
                  (p.phi == null || Math.abs(p.phi - model.phi) < 1e-6) &&
                  AXES.every(a => Boolean(p.on[a.k]) === Boolean(model.on[a.k]));
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onPreset?.(p)}
                    style={{
                      font: `500 12px ${tokens.fonts.sans}`,
                      padding: '4px 8px',
                      borderRadius: 5,
                      border: `1px solid ${isSelected ? color('color/fill/gold') : color('color/line/chart')}`,
                      background: color('color/surface/well'),
                      color: isSelected ? color('color/fill/gold') : color('color/text/primary'),
                      cursor: 'pointer',
                    }}
                    title={p.note}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.95fr) minmax(0, 1.15fr)',
            gap: 16,
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          {/* Column 1: Levers */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {/* Spectral lever u */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                <span>
                  Spectral lever <i>u</i> <small style={{color: color('color/text/dim')}}>share out of class band</small>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontVariantNumeric: 'tabular-nums'}}>
                  {model.u.toFixed(3)}
                </span>
              </div>
              {interactive ? (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.001"
                  value={model.u}
                  onChange={e => onUChange?.(Number(e.target.value))}
                  style={{width: '100%', margin: '4px 0'}}
                />
              ) : (
                <div style={{height: 4, background: color('color/surface/well'), borderRadius: 2, margin: '4px 0'}}>
                  <div style={{height: '100%', width: `${(model.u * 100).toFixed(1)}%`, background: color('color/fill/accent')}} />
                </div>
              )}
            </div>

            {/* Phase lever phi */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                <span>
                  <MathText>{'Phase lever Φ_{load}'}</MathText> <small style={{color: color('color/text/dim')}}>dispersion of class phases</small>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontVariantNumeric: 'tabular-nums'}}>
                  {model.phi.toFixed(3)}
                </span>
              </div>
              {interactive ? (
                <input
                  type="range"
                  min="0"
                  max="0.99"
                  step="0.001"
                  value={model.phi}
                  onChange={e => onPhiChange?.(Number(e.target.value))}
                  style={{width: '100%', margin: '4px 0'}}
                />
              ) : (
                <div style={{height: 4, background: color('color/surface/well'), borderRadius: 2, margin: '4px 0'}}>
                  <div style={{height: '100%', width: `${(model.phi * 100).toFixed(1)}%`, background: color('color/fill/accent')}} />
                </div>
              )}
            </div>

            {/* Class pressure M0 */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                <span>
                  <MathText>{'Class pressure M₀'}</MathText> <small style={{color: color('color/text/dim')}}>raw drive in units of τ (log scale)</small>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontVariantNumeric: 'tabular-nums'}}>
                  {fmt(model.m0)}
                </span>
              </div>
              {interactive ? (
                <input
                  type="range"
                  min="-0.7"
                  max="3"
                  step="0.01"
                  value={Math.log10(model.m0)}
                  onChange={e => onM0Change?.(Math.pow(10, Number(e.target.value)))}
                  style={{width: '100%', margin: '4px 0'}}
                />
              ) : (
                <div style={{height: 4, background: color('color/surface/well'), borderRadius: 2, margin: '4px 0'}}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(0, Math.min(100, ((Math.log10(model.m0) - (-0.7)) / 3.7) * 100)).toFixed(1)}%`,
                      background: color('color/fill/accent'),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Noise floor n */}
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                <span>Noise floor η</span>
                <span style={{fontFamily: tokens.fonts.mono, fontVariantNumeric: 'tabular-nums'}}>
                  {model.n.toFixed(2)}
                </span>
              </div>
              {interactive ? (
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.01"
                  value={model.n}
                  onChange={e => onNChange?.(Number(e.target.value))}
                  style={{width: '100%', margin: '4px 0'}}
                />
              ) : (
                <div style={{height: 4, background: color('color/surface/well'), borderRadius: 2, margin: '4px 0'}}>
                  <div style={{height: '100%', width: `${((model.n / 0.4) * 100).toFixed(1)}%`, background: color('color/fill/accent')}} />
                </div>
              )}
            </div>

            <p style={{fontSize: 12, color: color('color/text/dim'), margin: '4px 0 0', lineHeight: 1.4}}>
              <MathText>{'ρ_τ = M₀ · P_{class} · (1 − Φ_{load})²'}</MathText>.{' '}
              <MathText>{'P_{class} = (1 − η)(1 − u)'}</MathText> is the share of attention still in the class band;{' '}
              <MathText>{'(1 − Φ_{load})²'}</MathText> is the part of that power the subgroups add up coherently. The crash condition is <MathText>{'ρ_τ ≥ 1'}</MathText>.
            </p>
          </div>

          {/* Column 2: Phase circle */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <svg viewBox="0 0 320 320" style={{width: 210, height: 210}} role="img" aria-label="Subgroup class phases on the unit circle">
              <circle cx={C_pc} cy={C_pc} r={R_pc} fill="none" stroke={color('color/line/chart')} strokeWidth={1.6} />
              <line x1={C_pc - R_pc - 8} y1={C_pc} x2={C_pc + R_pc + 8} y2={C_pc} stroke={color('color/line/chart')} strokeOpacity={0.45} />
              <line x1={C_pc} y1={C_pc - R_pc - 8} x2={C_pc} y2={C_pc + R_pc + 8} stroke={color('color/line/chart')} strokeOpacity={0.45} />
              {dots.map((d, i) => (
                <circle key={i} cx={d.cx.toFixed(1)} cy={d.cy.toFixed(1)} r={6} fill="#4CC2C2" fillOpacity={0.85} />
              ))}
              {showArrow_pc && (
                <>
                  <line
                    x1={C_pc}
                    y1={C_pc}
                    x2={(tx_pc - hl_pc * Math.cos(ang_pc)).toFixed(1)}
                    y2={(ty_pc - hl_pc * Math.sin(ang_pc)).toFixed(1)}
                    stroke={col_pc}
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${tx_pc.toFixed(1)} ${ty_pc.toFixed(1)} L${(tx_pc - hl_pc * Math.cos(ang_pc) + 6 * Math.sin(ang_pc)).toFixed(1)} ${(ty_pc - hl_pc * Math.sin(ang_pc) - 6 * Math.cos(ang_pc)).toFixed(1)} L${(tx_pc - hl_pc * Math.cos(ang_pc) - 6 * Math.sin(ang_pc)).toFixed(1)} ${(ty_pc - hl_pc * Math.sin(ang_pc) + 6 * Math.cos(ang_pc)).toFixed(1)}Z`}
                    fill={col_pc}
                  />
                </>
              )}
              <circle cx={C_pc} cy={C_pc} r={4} fill={color('color/text/primary')} />
            </svg>
            <p style={{fontSize: 11, color: color('color/text/dim'), textAlign: 'center', margin: '2px 0 0'}}>
              Phase Coherence: 24 subgroup phases; arrow length is <MathText>{'1 − Φ_{load}'}</MathText>
            </p>
          </div>

          {/* Column 3: Dial & Phi bar */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <svg viewBox="0 0 440 240" style={{width: 320, height: 160}} role="img" aria-label="Rho tau dial with the tau mark">
              <path d={arc_dial(0, MAX_dial, R_dial)} fill="none" stroke={color('color/surface/well')} strokeWidth={22} />
              <path d={arc_dial(1, MAX_dial, R_dial)} fill="none" stroke="#FF7A6B" strokeOpacity={0.18} strokeWidth={22} />
              {currentRho > 0.002 && (
                <path
                  d={arc_dial(0, Math.min(currentRho, MAX_dial), R_dial)}
                  fill="none"
                  stroke={currentRho >= 1 ? '#FF7A6B' : color('color/fill/accent')}
                  strokeWidth={22}
                />
              )}
              {[0, 0.5, 1, 1.5, 2].map(t => {
                const pt = P_dial(t, R_dial + 22);
                return (
                  <text
                    key={t}
                    x={pt[0].toFixed(1)}
                    y={(pt[1] + 4).toFixed(1)}
                    textAnchor="middle"
                    fontSize={12}
                    fill={color('color/text/dim')}
                    fontFamily={tokens.fonts.mono}
                  >
                    {t}
                  </text>
                );
              })}
              <line
                x1={tauLineA[0].toFixed(1)}
                y1={tauLineA[1].toFixed(1)}
                x2={tauLineB[0].toFixed(1)}
                y2={tauLineB[1].toFixed(1)}
                stroke="#FF7A6B"
                strokeWidth={4}
              />
              <text x={CX_dial + 12} y={CY_dial - R_dial - 26} fontSize={15} fill="#FF7A6B" fontFamily={tokens.fonts.mono}>
                τ
              </text>
              <line
                x1={CX_dial}
                y1={CY_dial}
                x2={nd_dial[0].toFixed(1)}
                y2={nd_dial[1].toFixed(1)}
                stroke={color('color/text/primary')}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={CX_dial} cy={CY_dial} r={6} fill={color('color/text/primary')} />
              <text
                x={CX_dial}
                y={CY_dial - 56}
                textAnchor="middle"
                fontSize={30}
                fontWeight={500}
                fill={currentRho >= 1 ? '#FF7A6B' : color('color/text/primary')}
                fontFamily={tokens.fonts.mono}
              >
                {currentRho >= 10 ? currentRho.toFixed(1) : currentRho.toFixed(2)}
              </text>
              <text
                x={CX_dial}
                y={CY_dial - 32}
                textAnchor="middle"
                fontSize={13}
                fill={color('color/text/dim')}
                fontFamily={tokens.fonts.mono}
              >
                <MathText svg>{'ρ_τ = M/τ'}</MathText>
              </text>
              {currentRho > MAX_dial && (
                <text x={CX_dial + R_dial + 6} y={CY_dial + 16} textAnchor="end" fontSize={12} fill="#FF7A6B" fontFamily={tokens.fonts.mono}>
                  off scale
                </text>
              )}
            </svg>

            {/* Phi bar */}
            <svg viewBox="0 0 440 64" style={{width: 320, height: 44}} role="img" aria-label="Phi load bar">
              <rect x={20} y={20} width={400} height={16} rx={8} fill={color('color/surface/well')} />
              <rect x={20} y={20} width={(400 * Math.min(1, Math.max(0, model.phi))).toFixed(1)} height={16} rx={8} fill={color('color/fill/accent')} />
              {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <text key={t} x={20 + 400 * t} y={54} textAnchor="middle" fontSize={11} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
                  {t}
                </text>
              ))}
              <text x={20} y={13} fontSize={12} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
                <MathText svg>{'Φ_{load} = ' + model.phi.toFixed(3)}</MathText>
              </text>
            </svg>

            {/* 3 stats */}
            <div style={{display: 'flex', gap: 20, marginTop: 4}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 11, color: color('color/text/dim')}}><MathText>{'ρ_τ'}</MathText></div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 14, fontWeight: 500}}>
                  {currentRho >= 10 ? currentRho.toFixed(1) : currentRho.toFixed(2)}
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 11, color: color('color/text/dim')}}><MathText>{'P_{class}'}</MathText></div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 14, fontWeight: 500}}>
                  {pc.toFixed(3)}
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: 11, color: color('color/text/dim')}}>Coherent part</div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 14, fontWeight: 500}}>
                  {coh.toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict paragraph */}
        <div style={{fontSize: 13, color: color('color/text/primary'), borderTop: `1px solid ${color('color/line/chart')}`, paddingTop: 6, marginTop: 4}}>
          {verdictText}
        </div>
      </section>

      {/* Bottom Card: Runtime log field */}
      <section
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '12px 18px',
          boxSizing: 'border-box',
          height: 432,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        aria-label="Runtime log field"
      >
        <h2
          style={{
            font: `600 12px/1.3 ${tokens.fonts.sans}`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: color('color/text/dim'),
            margin: '0 0 6px',
          }}
        >
          Interference State: the runtime log against the model
        </h2>

        <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: 20, alignItems: 'start', flex: 1}}>
          {/* Field SVG */}
          <svg viewBox="0 0 900 470" style={{width: '100%', height: 350}} role="img" aria-label="Runtime log eras as boxes on the phase-loading and rho-tau plane">
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
              <g key={t}>
                <line x1={X_f(t)} y1={T_f} x2={X_f(t)} y2={H_f - B_f} stroke={color('color/line/chart')} strokeOpacity={0.25} />
                <text x={X_f(t)} y={H_f - B_f + 18} textAnchor="middle" fontSize={12} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
                  {t}
                </text>
              </g>
            ))}
            {[0, 0.25, 0.5, 0.75, 1, 1.25].map(t => (
              <text key={t} x={L_f - 8} y={Y_f(t) + 4} textAnchor="end" fontSize={12} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
                {t}
              </text>
            ))}
            {/* Tau danger zone */}
            <rect x={L_f} y={Y_f(YM_f)} width={W_f - L_f - Rr_f} height={Y_f(1) - Y_f(YM_f)} fill="#FF7A6B" fillOpacity={0.08} />
            <line x1={L_f} y1={Y_f(1)} x2={W_f - Rr_f} y2={Y_f(1)} stroke="#FF7A6B" strokeWidth={2} />
            <text x={W_f - Rr_f - 4} y={Y_f(1) - 6} textAnchor="end" fontSize={13} fill="#FF7A6B" fontFamily={tokens.fonts.mono}>
              τ
            </text>

            {/* Boxes for each log */}
            {LOGS.map(e => {
              if (!e.phi || !e.rho) return null;
              const isSel = e.n === model.log;
              const bx = X_f(e.phi[0]);
              const bw = X_f(e.phi[1]) - bx;
              const by = Y_f(e.rho[1]);
              const bh = Y_f(e.rho[0]) - by;
              return (
                <g key={e.n}>
                  <rect
                    x={bx.toFixed(1)}
                    y={by.toFixed(1)}
                    width={bw.toFixed(1)}
                    height={bh.toFixed(1)}
                    fill={color('color/fill/gold')}
                    stroke={color('color/fill/gold')}
                    fillOpacity={isSel ? 0.28 : 0.06}
                    strokeOpacity={isSel ? 1 : 0.5}
                    strokeWidth={isSel ? 2.2 : 1.1}
                  />
                  <text
                    x={(bx + 4).toFixed(1)}
                    y={(by + 13).toFixed(1)}
                    fontSize={11}
                    fill={color('color/fill/gold')}
                    fillOpacity={isSel ? 1 : 0.7}
                    fontFamily={tokens.fonts.mono}
                  >
                    {e.n}
                  </text>
                </g>
              );
            })}

            {/* Model curve */}
            <path d={curveD} fill="none" stroke={color('color/fill/accent')} strokeWidth={2.6} />

            {/* Current point */}
            <circle
              cx={X_f(model.phi).toFixed(1)}
              cy={Y_f(currentRho).toFixed(1)}
              r={8}
              fill={currentRho >= 1 ? '#FF7A6B' : color('color/fill/accent')}
              stroke={color('color/text/primary')}
              strokeWidth={2}
            />

            <text x={W_f - Rr_f} y={H_f - 6} textAnchor="end" fontSize={12} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
              <MathText svg>{'Φ_{load}'}</MathText>
            </text>
            <text x={L_f + 6} y={T_f + 12} fontSize={12} fill={color('color/text/dim')} fontFamily={tokens.fonts.mono}>
              <MathText svg>{'ρ_τ'}</MathText>
            </text>
          </svg>

          {/* Right side: Log selector & notes */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <p style={{fontSize: 12.5, color: color('color/text/dim'), margin: 0, lineHeight: 1.4}}>
              Boxes: the <MathText>{'Φ_{load}'}</MathText> and <MathText>{'ρ_τ'}</MathText> ranges from the Compiled Runtime Log (author estimates). Orange curve: <MathText>{'ρ_τ'}</MathText> from the model across all values of <MathText>{'Φ_{load}'}</MathText>. Dot: current state.
            </p>

            {/* Log chips */}
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, margin: '4px 0'}}>
              {LOGS.filter(x => x.phi && x.rho).map(x => {
                const isSel = x.n === model.log;
                return (
                  <button
                    key={x.n}
                    type="button"
                    onClick={() => interactive && onSelectLog?.(x.n)}
                    style={{
                      font: `500 12px ${tokens.fonts.sans}`,
                      padding: '4px 8px',
                      borderRadius: 5,
                      border: `1px solid ${isSel ? color('color/fill/gold') : color('color/line/chart')}`,
                      background: color('color/surface/well'),
                      color: isSel ? color('color/fill/gold') : color('color/text/primary'),
                      cursor: interactive ? 'pointer' : 'default',
                    }}
                    title={x.title}
                  >
                    {x.n}
                  </button>
                );
              })}
            </div>

            {/* Selected log note */}
            {selectedLogEntry && selectedLogEntry.phi && selectedLogEntry.rho && (
              <div style={{fontSize: 12.5, color: color('color/text/dim'), lineHeight: 1.45}}>
                <b style={{color: color('color/text/primary')}}>Log {selectedLogEntry.n}</b> ({selectedLogEntry.title.toLowerCase()}):{' '}
                <MathText>{`Φ_{load} ${selectedLogEntry.phi[0]}–${selectedLogEntry.phi[1]}, ρ_τ ${selectedLogEntry.rho[0]}–${selectedLogEntry.rho[1]}`}</MathText>.
                At the box midpoints and the current spectral lever, the model needs a class pressure <MathText>{`M₀ ≈ ${fmt(needM0(selectedLogEntry, model.u, model.n, model.on))}`}</MathText>.
                Early logs (1–5) need <MathText>{`M₀ ≈ ${fmt(minEarly)}–${fmt(maxEarly)}`}</MathText>; late logs (14 on) need <MathText>{`M₀ ≈ ${fmt(minLate)}–${fmt(maxLate)}`}</MathText>.
                Read through the model, the log indicates the Engine loads phases hardest when class pressure is highest.
              </div>
            )}

            {interactive && (
              <div style={{marginTop: 6}}>
                <button
                  type="button"
                  onClick={onFit}
                  style={{
                    font: `500 13px ${tokens.fonts.sans}`,
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: `1px solid ${color('color/line/chart')}`,
                    background: color('color/surface/well'),
                    color: color('color/text/primary'),
                    cursor: 'pointer',
                  }}
                >
                  Move the model into the selected log
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingsView({
  model,
  width,
  height,
  tokens,
}: {
  model: InterferenceEngineEraResult;
  width: number;
  height: number;
  tokens: ReturnType<typeof useTokens>;
}): JSX.Element {
  const currentRho = rhoOf(model.m0, model.u, model.n, model.phi, model.on);
  const pc = pclassOf(model.u, model.n, model.on);
  const coh = Math.pow(1 - model.phi, 2);

  return (
    <div
      style={{
        width,
        height,
        overflow: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
        gap: 16,
        fontFamily: tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      {/* Left panel: Model parameters */}
      <section
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '16px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h2
          style={{
            font: `600 12px/1.3 ${tokens.fonts.sans}`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: color('color/text/dim'),
            margin: 0,
          }}
        >
          Model Parameters (Read-Only)
        </h2>

        {model.modelDefault && (
          <div
            style={{
              padding: '8px 12px',
              background: 'rgba(224,163,60,0.15)',
              border: `1px solid ${color('color/fill/gold')}`,
              borderRadius: 6,
              color: color('color/fill/gold'),
              fontSize: 13,
              fontFamily: tokens.fonts.sans,
            }}
          >
            Model default: this log does not set this instrument.
          </div>
        )}

        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {[
            {label: 'Spectral lever u', value: model.u.toFixed(3), math: false},
            {label: 'Phase lever Φ_{load}', value: model.phi.toFixed(3), math: true},
            {label: 'Class pressure M₀', value: fmt(model.m0), math: true},
            {label: 'Noise floor η', value: model.n.toFixed(2), math: false},
            {label: 'Active log era', value: `Log ${model.log}`, math: false},
            {label: 'Proximity to τ (ρ_τ)', value: fmt(currentRho), math: true},
            {label: 'Class power share P_{class}', value: fmt(pc), math: true},
            {label: 'Coherent sum (1 − Φ_{load})²', value: fmt(coh), math: true},
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                background: color('color/surface/well'),
                borderRadius: 4,
                fontSize: 13,
              }}
            >
              <span style={{color: color('color/text/dim')}}>
                {item.math ? <MathText>{item.label}</MathText> : item.label}
              </span>
              <span style={{fontFamily: tokens.fonts.mono, fontVariantNumeric: 'tabular-nums'}}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{borderTop: `1px solid ${color('color/line/chart')}`, paddingTop: 10}}>
          <div style={{fontSize: 12, color: color('color/text/dim'), textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6}}>
            Governing Equations
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontFamily: tokens.fonts.mono}}>
            <div><MathText>{'ρ_τ = M₀ · P_{class} · (1 − Φ_{load})²'}</MathText></div>
            <div><MathText>{'P_{class} = (1 − η)(1 − u)'}</MathText></div>
            <div><MathText>{'Crash condition: ρ_τ ≥ 1'}</MathText></div>
          </div>
        </div>

        <div style={{borderTop: `1px solid ${color('color/line/chart')}`, paddingTop: 10}}>
          <div style={{fontSize: 12, color: color('color/text/dim'), textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6}}>
            Active Identity Modes
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
            {AXES.map(ax => {
              const active = Boolean(model.on[ax.k]);
              return (
                <div
                  key={ax.k}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: color('color/surface/well'),
                    border: `1px solid ${active ? color('color/fill/gold') : color('color/line/chart')}`,
                    color: active ? color('color/fill/gold') : color('color/text/dim'),
                    fontSize: 12,
                    fontFamily: tokens.fonts.sans,
                  }}
                >
                  {ax.name} ({ax.f.toFixed(2)} cycles/yr)
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right panel: Sources & Manuscript line references */}
      <section
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '16px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <h2
          style={{
            font: `600 12px/1.3 ${tokens.fonts.sans}`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: color('color/text/dim'),
            margin: 0,
          }}
        >
          What the Page Assumes
        </h2>

        <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.5, color: color('color/text/primary')}}>
          <p style={{margin: 0}}>
            From the manuscript: Model C and the control objective with total power held constant (eqs. 8.12–8.16,{' '}
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>Paper/The_Original_Power.tex:6914–:6946</code>); the bands (
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:6955</code>); circular dispersion <MathText>{'Φ_{load}'}</MathText> and its relation to the band-power ratio, &quot;two faces of the same control&quot; (eqs. 8.17 and 8.22,{' '}
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:7195–:7210</code>); the ANES calibration of <MathText>{'Φ_{load}'}</MathText>, 0.078 before 1964 and 0.403 after 1980 (
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:2522</code>); the Compiled Runtime Log (via{' '}
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>tools/interference_state/data/runtime_log.json</code>); the four Laplace fits (
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:7032–:7035</code>); the Weimar <MathText>{'ℛ_{suppress} ≈ 0.03'}</MathText> (
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:7006</code>); the spectral carrier chapter (
            <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>:14446–:14670</code>).
          </p>

          <p style={{margin: 0}}>
            <strong style={{color: color('color/fill/gold')}}>The joint measure is the page&apos;s construction.</strong> The manuscript states the two levers separately. The page joins them with one identity of signal arithmetic: N subgroup carriers with phases <MathText>{'Φ_j'}</MathText> sum to an amplitude <MathText>{'N·|mean e^{iΦ}| = N·(1 − Φ_{load})'}</MathText>, so the coherent class power scales as <MathText>{'(1 − Φ_{load})²'}</MathText>. <MathText>{'M₀'}</MathText> is the class pressure before the Engine acts, in units of τ. It is not calibrated; the runtime-log panel shows the <MathText>{'M₀'}</MathText> each logged era implies.
          </p>

          <p style={{margin: 0}}>
            <strong style={{color: color('color/fill/gold')}}>Data panels.</strong> The page embeds the three processed CSVs from <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>Paper/data/</code> and the runtime log (built by <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>tools/interference_engine/scripts/build_data.py</code>). It applies the corrected methods of <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>Paper/scripts/spectral_fourier.ipynb</code> (ANES at 1 sample per year; within-series shares; seasonality removal by the mean ISO-week profile) and of <code style={{fontFamily: tokens.fonts.mono, color: color('color/fill/gold')}}>Paper/scripts/eq_fourier_electoral_cycle.py</code> (one-sided spectrum with the Nyquist bin; both bracketing bins for an off-grid target).
          </p>
        </div>
      </section>
    </div>
  );
}
