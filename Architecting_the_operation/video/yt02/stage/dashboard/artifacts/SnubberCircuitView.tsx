import React, {useState, type JSX} from 'react';
import {MathText, useTokens, type InstrumentMode} from '@stage';
import {color, Tokens} from '../../tokens';

export type SnubberCircuitViewProps = {
  mode: InstrumentMode; // 'compact' | 'expanded' | 'settings'
  width: number;
  height: number; // the content box you must fill (no panel chrome: no border, background or outer padding)
  interactive: boolean; // true only on the website
  era?: {log: number; fields: Record<string, unknown>}; // an entry of yt02/dashboard_eras.json
};

export type SnubberCircuitInputs = {
  modelDefault: boolean;
  I0: number;
  L: number;
  Ch: number;
  Cs: number;
  Rs: number;
  Vbr: number;
  h: boolean;
  s: boolean;
  t: boolean;
  preset: number;
};

export const DEFAULT_SNUBBER_CIRCUIT_INPUTS: SnubberCircuitInputs = {
  modelDefault: true,
  I0: 1.0,
  L: 1.0,
  Ch: 0.1,
  Cs: 0.1,
  Rs: 1.0,
  Vbr: 3.0,
  h: true,
  s: false,
  t: false,
  preset: 1,
};

export function snubberCircuitFromEra(
  era?: {log: number; fields: Record<string, unknown>},
): SnubberCircuitInputs {
  // The catalogue notes: "A driver could open the switch when rho_tau first passes 1.0
  // and select a path preset by era, but the page defines no such rule."
  // Where the catalogue calls a mapping a suggestion or the log has no value, return defaults with modelDefault: true.
  return {...DEFAULT_SNUBBER_CIRCUIT_INPUTS, modelDefault: true};
}

export const PRESETS = [
  {name: 'Unprotected', h: false, s: false, t: false, Vbr: 3.0},
  {name: 'Elite recovery only', h: true, s: false, t: false, Vbr: 3.0},
  {name: 'Snubber grid', h: true, s: true, t: false, Vbr: 3.0},
  {name: 'Snubber + TVS', h: true, s: true, t: true, Vbr: 1.2},
  {name: 'Decoupled grid', h: false, s: true, t: true, Vbr: 1.2},
] as const;

const CP = 0.002;
const RL = 0.05;
const RH = 0.5;

export type SimulationResult = {
  pts: [number, number][];
  peak: number;
  U: number;
  parts: {
    elite: number;
    grid: number;
    tvs: number;
    coil: number;
    field: number;
  };
};

function f(v: number, d?: number): string {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  return a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : v.toFixed(d == null ? 2 : d);
}

function runSimulation(
  I0: number,
  L: number,
  Ch: number,
  Cs: number,
  Rs: number,
  Vbr: number,
  withH: boolean,
  withS: boolean,
  withT: boolean,
): SimulationResult {
  const T = 6;
  const dt = 4e-5;
  const N = Math.round(T / dt);
  const every = Math.round(N / 700);
  let i = I0;
  let v = 0;
  let vh = 0;
  let vs = 0;
  const E = {RL: 0, Rh: 0, Rs: 0, TVS: 0};
  const out: [number, number][] = [];
  let peak = 0;

  function deriv(curI: number, curV: number, curVh: number, curVs: number) {
    const ih = withH ? Math.max(0, (curV - curVh) / RH) : 0;
    const is = withS ? (curV - curVs) / Rs : 0;
    let ic = curI - ih - is;
    let it = 0;
    if (withT && ((curV >= Vbr && ic > 0) || (curV <= -Vbr && ic < 0))) {
      it = ic;
      ic = 0;
    }
    return {
      di: (-curV - RL * curI) / L,
      dv: ic / CP,
      dvh: withH ? ih / Ch : 0,
      dvs: withS ? is / Cs : 0,
      ih,
      is,
      it,
    };
  }

  for (let n = 0; n <= N; n++) {
    const a = deriv(i, v, vh, vs);
    const b = deriv(
      i + (dt / 2) * a.di,
      v + (dt / 2) * a.dv,
      vh + (dt / 2) * a.dvh,
      vs + (dt / 2) * a.dvs,
    );
    const c = deriv(
      i + (dt / 2) * b.di,
      v + (dt / 2) * b.dv,
      vh + (dt / 2) * b.dvh,
      vs + (dt / 2) * b.dvs,
    );
    const d = deriv(
      i + dt * c.di,
      v + dt * c.dv,
      vh + dt * c.dvh,
      vs + dt * c.dvs,
    );

    E.RL += RL * i * i * dt;
    E.Rh += RH * b.ih * b.ih * dt;
    if (withS) E.Rs += Rs * b.is * b.is * dt;
    E.TVS += Math.abs(v) * Math.abs(b.it) * dt;

    i += (dt / 6) * (a.di + 2 * b.di + 2 * c.di + d.di);
    v += (dt / 6) * (a.dv + 2 * b.dv + 2 * c.dv + d.dv);
    vh += (dt / 6) * (a.dvh + 2 * b.dvh + 2 * c.dvh + d.dvh);
    vs += (dt / 6) * (a.dvs + 2 * b.dvs + 2 * c.dvs + d.dvs);

    if (withT) {
      if (v > Vbr) v = Vbr;
      if (v < -Vbr) v = -Vbr;
    }
    if (Math.abs(v) > peak) peak = Math.abs(v);
    if (n % every === 0) out.push([n * dt, v]);
  }

  const U = 0.5 * L * I0 * I0;
  const stored = {
    h: 0.5 * Ch * vh * vh,
    s: 0.5 * Cs * vs * vs,
    field: 0.5 * L * i * i + 0.5 * CP * v * v,
  };

  return {
    pts: out,
    peak,
    U,
    parts: {
      elite: E.Rh + stored.h,
      grid: E.Rs + stored.s,
      tvs: E.TVS,
      coil: E.RL,
      field: stored.field,
    },
  };
}

const simulationCache = new Map<string, SimulationResult>();

export function getSimulation(
  I0: number,
  L: number,
  Ch: number,
  Cs: number,
  Rs: number,
  Vbr: number,
  withH: boolean,
  withS: boolean,
  withT: boolean,
): SimulationResult {
  const key = `${I0.toFixed(4)}_${L.toFixed(4)}_${Ch.toFixed(4)}_${Cs.toFixed(4)}_${Rs.toFixed(4)}_${Vbr.toFixed(4)}_${withH}_${withS}_${withT}`;
  const hit = simulationCache.get(key);
  if (hit) return hit;
  const res = runSimulation(I0, L, Ch, Cs, Rs, Vbr, withH, withS, withT);
  simulationCache.set(key, res);
  return res;
}

const KEYS = [
  {id: 'elite', hex: '#E0604A', label: 'Recovered by the Elite (next coil)'},
  {id: 'grid', hex: '#4CC2C2', label: 'Absorbed by the snubber grid'},
  {id: 'tvs', hex: 'rgba(224,163,60,1)', label: 'Clamped by the TVS node'},
  {id: 'coil', hex: '#4A5566', label: 'Lost in the coil'},
  {id: 'field', hex: 'rgba(232,201,155,1)', label: 'Still ringing in the field'},
] as const;

function getVerdict(
  r: SimulationResult,
  free: SimulationResult,
  h: boolean,
  s: boolean,
  t: boolean,
): string {
  let tot = 0;
  for (const k of KEYS) {
    tot += r.parts[k.id as keyof typeof r.parts];
  }
  const e = r.parts.elite / tot;
  const g = (r.parts.grid + r.parts.tvs) / tot;
  const red = 1 - r.peak / free.peak;
  if (!h && !s && !t) {
    return 'With no path for it, the surge rings at full height and the energy stays in the field, wasting only in the coil. This is the uncontrolled back-EMF that, in ordinary circuits, destroys components.';
  } else if (h && !s && !t) {
    return (
      'With only the Elite’s path open, the Elite recover ' +
      Math.round(100 * e) +
      '% of the field’s energy into the next coil: the energy recovery circuit of eq. 1.7e.'
    );
  } else {
    return (
      'The Out-group’s paths take ' +
      Math.round(100 * g) +
      '% of the energy and the Elite recover ' +
      Math.round(100 * e) +
      '%. The surge peak falls by ' +
      Math.round(100 * red) +
      '% against an unprotected circuit.' +
      (h ? '' : ' With the Elite’s path removed, nothing is carried into the next coil.')
    );
  }
}

// ---------------------------------------------------------------------------
// Main Component Entry Point
// ---------------------------------------------------------------------------
export function SnubberCircuitView(props: SnubberCircuitViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveSnubberCircuitView {...props} />;
  }
  return <StaticSnubberCircuitView {...props} />;
}

// ---------------------------------------------------------------------------
// Static (Deterministic) View — zero hooks, no state, no effects, pure SSR safe
// ---------------------------------------------------------------------------
function StaticSnubberCircuitView(props: SnubberCircuitViewProps): JSX.Element {
  const {mode, width, height, era} = props;
  const inputs = snubberCircuitFromEra(era);
  const r = getSimulation(
    inputs.I0,
    inputs.L,
    inputs.Ch,
    inputs.Cs,
    inputs.Rs,
    inputs.Vbr,
    inputs.h,
    inputs.s,
    inputs.t,
  );
  const free = getSimulation(
    inputs.I0,
    inputs.L,
    inputs.Ch,
    inputs.Cs,
    inputs.Rs,
    inputs.Vbr,
    false,
    false,
    false,
  );

  if (mode === 'compact') {
    return <CompactView width={width} height={height} r={r} free={free} />;
  }

  if (mode === 'settings') {
    return (
      <SettingsView
        width={width}
        height={height}
        inputs={inputs}
        modelDefault={inputs.modelDefault}
      />
    );
  }

  return (
    <ExpandedView
      width={width}
      height={height}
      inputs={inputs}
      r={r}
      free={free}
      interactive={false}
    />
  );
}

// ---------------------------------------------------------------------------
// Compact View: 177 × 80 content box
// ---------------------------------------------------------------------------
function CompactView({
  width,
  height,
  r,
  free,
}: {
  width: number;
  height: number;
  r: SimulationResult;
  free: SimulationResult;
}): JSX.Element {
  const tokens = useTokens();
  let tot = 0;
  for (const k of KEYS) {
    tot += r.parts[k.id as keyof typeof r.parts];
  }
  const redPct = Math.round(100 * (1 - r.peak / free.peak));
  const elitePct = Math.round(100 * (r.parts.elite / tot));

  const cPL = 4;
  const cPR = 4;
  const cPT = 3;
  const cPB = 3;
  const svgW = width;
  const svgH = 34;
  const pts = r.pts;
  const T = pts[pts.length - 1][0] || 6;
  const top = Math.max(r.peak, 0.5) * 1.15;
  const bot = -top;

  const X = (t: number) => cPL + (t / T) * (svgW - cPL - cPR);
  const Y = (v: number) => cPT + ((top - v) / (top - bot)) * (svgH - cPT - cPB);

  let sparkD = '';
  for (let idx = 0; idx < pts.length; idx++) {
    const pt = pts[idx];
    sparkD += (idx === 0 ? 'M' : 'L') + X(pt[0]).toFixed(1) + ' ' + Y(pt[1]).toFixed(1);
  }

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: tokens.fonts.sans ?? Tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      {/* Title & Peak */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
          fontSize: 11,
          lineHeight: '13px',
          letterSpacing: '0.04em',
        }}
      >
        <span style={{fontWeight: 600, color: color('color/text/primary')}}>SNUBBER</span>
        <span style={{color: color('color/fill/accent'), fontWeight: 500}}>
          peak {f(r.peak, 1)}
        </span>
      </div>

      {/* Mini Sparkline */}
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{width: svgW, height: svgH, display: 'block'}}
      >
        <line
          x1={cPL}
          y1={Y(0).toFixed(1)}
          x2={svgW - cPR}
          y2={Y(0).toFixed(1)}
          stroke={color('color/line/chart-faint')}
          strokeWidth={1}
        />
        <path
          d={sparkD}
          fill="none"
          stroke={color('color/line/accent')}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>

      {/* Energy Bar */}
      <div
        style={{
          display: 'flex',
          height: 6,
          borderRadius: 2,
          overflow: 'hidden',
          background: color('color/surface/well'),
          border: `1px solid ${color('color/line/chart')}`,
        }}
        role="img"
        aria-label="Energy shares"
      >
        {KEYS.map(k => {
          const sh = r.parts[k.id as keyof typeof r.parts] / tot;
          if (sh <= 0.001) return null;
          return (
            <span
              key={k.id}
              style={{
                width: `${(100 * sh).toFixed(2)}%`,
                height: '100%',
                background: k.hex,
                display: 'block',
              }}
              title={k.label}
            />
          );
        })}
      </div>

      {/* Values */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
          fontSize: 10,
          color: color('color/text/muted'),
          lineHeight: '12px',
        }}
      >
        <span>{elitePct}% elite</span>
        <span style={{color: color('color/text/accent')}}>−{redPct}% surge</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expanded View: 1368 × 828 content box
// ---------------------------------------------------------------------------
function ExpandedView({
  width,
  height,
  inputs,
  r,
  free,
  interactive,
  onSelectPreset,
  onToggleBranch,
  onChangeParam,
}: {
  width: number;
  height: number;
  inputs: SnubberCircuitInputs;
  r: SimulationResult;
  free: SimulationResult;
  interactive: boolean;
  onSelectPreset?: (presetIndex: number) => void;
  onToggleBranch?: (branch: 'h' | 's' | 't') => void;
  onChangeParam?: (key: keyof SnubberCircuitInputs, val: number) => void;
}): JSX.Element {
  const tokens = useTokens();
  let tot = 0;
  for (const k of KEYS) {
    tot += r.parts[k.id as keyof typeof r.parts];
  }
  const redPct = Math.round(100 * (1 - r.peak / free.peak));

  const wireColor = color('color/line/wire');
  const accentColor = color('color/line/accent');
  const goldColor = color('color/fill/gold');
  const dimColor = color('color/text/dim');
  const mutedColor = color('color/text/muted');

  const PW = 980;
  const PH = 470;
  const PL = 70;
  const PR = 30;
  const PT = 30;
  const PB = 50;

  const pts = r.pts;
  const T = pts[pts.length - 1][0] || 6;
  const A = Math.max(r.peak, 0.5);
  const top = A * 1.12;
  const bot = -A * 1.12;

  const X = (t: number) => PL + (t / T) * (PW - PL - PR);
  const Y = (v: number) => PT + ((top - v) / (top - bot)) * (PH - PT - PB);

  let plotD = '';
  for (let idx = 0; idx < pts.length; idx++) {
    const pt = pts[idx];
    plotD += (idx === 0 ? 'M' : 'L') + X(pt[0]).toFixed(1) + ' ' + Y(pt[1]).toFixed(1);
  }

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
        gap: '16px 24px',
        alignItems: 'start',
        fontFamily: tokens.fonts.sans ?? Tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      {/* Left Column: Circuit schematic and parameters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '14px 16px',
          boxSizing: 'border-box',
          height: '100%',
          overflowY: 'auto',
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
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: dimColor,
              margin: 0,
            }}
          >
            The switching moment
          </h2>
        </div>

        {/* Preset chips */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, margin: '2px 0 6px'}}>
          {PRESETS.map((p, idx) => {
            const isSelected = inputs.preset === idx;
            const chipStyle: React.CSSProperties = {
              fontFamily: tokens.fonts.sans ?? Tokens.fonts.sans,
              fontSize: 12,
              fontWeight: 500,
              padding: '5px 9px',
              borderRadius: 6,
              border: `1px solid ${isSelected ? goldColor : color('color/line/chart')}`,
              background: color('color/surface/well'),
              color: isSelected ? goldColor : color('color/text/primary'),
              cursor: interactive ? 'pointer' : 'default',
              opacity: !interactive && !isSelected ? 0.65 : 1,
            };
            if (!interactive) {
              return (
                <span key={p.name} style={{...chipStyle, display: 'inline-block'}}>
                  {p.name}
                </span>
              );
            }
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => onSelectPreset?.(idx)}
                style={chipStyle}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Schematic SVG */}
        <svg
          viewBox="0 0 720 450"
          style={{width: '100%', height: 'auto', display: 'block'}}
          role="img"
          aria-label="Coil L with a breach switch and three parallel paths: Elite recovery, snubber, TVS clamp."
        >
          <defs>
            <filter id="snubber-glw" filterUnits="userSpaceOnUse" x="0" y="0" width="720" height="450">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rails */}
          <path
            d="M80 300 V380 H600 M80 160 V100 H120 M200 100 H600"
            fill="none"
            stroke={wireColor}
            strokeWidth="3"
          />

          {/* Coil (vertical) */}
          <path
            d="M80 160 C112 160,112 195,80 195 C112 195,112 230,80 230 C112 230,112 265,80 265 C112 265,112 300,80 300"
            fill="none"
            stroke="#7CC08A"
            strokeWidth="3.5"
            filter="url(#snubber-glw)"
          />
          <text x="122" y="236" fontFamily="STIX Two Text, serif" fontStyle="italic" fontSize="34" fill="#7CC08A">
            L
          </text>
          <text x="20" y="330" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#7CC08A">
            <MathText svg text="I_0: the era’s field" />
          </text>

          {/* Switch */}
          <circle cx="120" cy="100" r="4.5" fill={wireColor} />
          <circle cx="200" cy="100" r="4.5" fill={wireColor} />
          <line x1="120" y1="100" x2="192" y2="62" stroke={wireColor} strokeWidth="3" strokeLinecap="round" />
          <text x="160" y="40" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill={wireColor}>
            opens at t = 0 · kernel breach
          </text>
          <text x="214" y="88" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="14" fill={accentColor}>
            <MathText svg text="v(t) surge" />
          </text>

          {/* Branch: Elite recovery */}
          <g
            style={{
              opacity: inputs.h ? 1 : 0.28,
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={() => onToggleBranch?.('h')}
            role={interactive ? 'switch' : undefined}
            aria-checked={inputs.h}
            aria-label="Elite recovery path"
          >
            <rect x="262" y="100" width="120" height="282" fill="transparent" />
            <path d="M300 100 V128 M300 168 V180 M300 250 V282 M300 296 V380" fill="none" stroke={wireColor} strokeWidth="3" />
            <path d="M286 128 H314 L300 152 Z" fill="#E0604A" />
            <line x1="286" y1="154" x2="314" y2="154" stroke="#E0604A" strokeWidth="3.5" />
            <line x1="300" y1="154" x2="300" y2="168" stroke="#E0604A" strokeWidth="3" />
            <path d="M300 180 L288 188 L312 200 L288 212 L312 224 L288 236 L312 244 L300 250" fill="none" stroke="#E0604A" strokeWidth="3" strokeLinejoin="round" />
            <line x1="282" y1="282" x2="318" y2="282" stroke="#E0604A" strokeWidth="4" />
            <line x1="282" y1="296" x2="318" y2="296" stroke="#E0604A" strokeWidth="4" />
            <text x="324" y="218" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#E0604A">
              <MathText svg text="R_h" />
            </text>
            <text x="324" y="294" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#E0604A">
              <MathText svg text="C_{next}" />
            </text>
            <text x="300" y="414" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#E0604A">
              Elite recovery
            </text>
            <text x="300" y="432" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="12" fill={mutedColor}>
              next coil
            </text>
          </g>

          {/* Branch: Snubber */}
          <g
            style={{
              opacity: inputs.s ? 1 : 0.28,
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={() => onToggleBranch?.('s')}
            role={interactive ? 'switch' : undefined}
            aria-checked={inputs.s}
            aria-label="Snubber grid path"
          >
            <rect x="412" y="100" width="120" height="282" fill="transparent" />
            <path d="M450 100 V150 M450 228 V272 M450 286 V380" fill="none" stroke={wireColor} strokeWidth="3" />
            <path d="M450 150 L438 158 L462 170 L438 182 L462 194 L438 206 L462 218 L450 228" fill="none" stroke="#4CC2C2" strokeWidth="3" strokeLinejoin="round" />
            <line x1="432" y1="272" x2="468" y2="272" stroke="#4CC2C2" strokeWidth="4" />
            <line x1="432" y1="286" x2="468" y2="286" stroke="#4CC2C2" strokeWidth="4" />
            <text x="474" y="194" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#4CC2C2">
              <MathText svg text="R_s" />
            </text>
            <text x="474" y="284" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#4CC2C2">
              <MathText svg text="C_s" />
            </text>
            <text x="450" y="414" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill="#4CC2C2">
              Snubber grid
            </text>
            <text x="450" y="432" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="12" fill={mutedColor}>
              Out-group
            </text>
          </g>

          {/* Branch: TVS */}
          <g
            style={{
              opacity: inputs.t ? 1 : 0.28,
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={() => onToggleBranch?.('t')}
            role={interactive ? 'switch' : undefined}
            aria-checked={inputs.t}
            aria-label="TVS clamp path"
          >
            <rect x="560" y="100" width="130" height="282" fill="transparent" />
            <path d="M600 100 V214 M600 252 V380" fill="none" stroke={wireColor} strokeWidth="3" />
            <path d="M584 214 H616 L600 240 Z" fill={goldColor} />
            <path d="M580 248 L584 242 H616 L620 236" fill="none" stroke={goldColor} strokeWidth="3.5" />
            <path d="M584 252 H616 L600 226 Z" fill={goldColor} opacity="0.9" />
            <text x="626" y="240" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill={goldColor}>
              <MathText svg text="V_{br}" />
            </text>
            <text x="612" y="414" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="13" fill={goldColor}>
              TVS clamp
            </text>
            <text x="612" y="432" textAnchor="middle" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="12" fill={mutedColor}>
              armed deterrence
            </text>
          </g>
        </svg>

        {interactive && (
          <p style={{fontSize: 12, color: mutedColor, margin: '2px 0 6px'}}>
            Select a path in the drawing to switch it on or off.
          </p>
        )}

        {/* Parameter Rows */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4}}>
          <ParamRow
            label="I_0 field current"
            value={inputs.I0}
            min={0.2}
            max={2}
            step={0.01}
            displayVal={f(inputs.I0)}
            isLog={false}
            interactive={interactive}
            onChange={v => onChangeParam?.('I0', v)}
          />
          <ParamRow
            label="L coil"
            value={inputs.L}
            min={-0.7}
            max={0.7}
            step={0.01}
            displayVal={f(inputs.L, 2)}
            isLog={true}
            interactive={interactive}
            onChange={v => onChangeParam?.('L', v)}
          />
          <ParamRow
            label="C_{next} next coil"
            value={inputs.Ch}
            min={-2}
            max={0}
            step={0.01}
            displayVal={f(inputs.Ch, 3)}
            isLog={true}
            interactive={interactive}
            onChange={v => onChangeParam?.('Ch', v)}
          />
          <ParamRow
            label="C_s grid capacity"
            value={inputs.Cs}
            min={-2.5}
            max={0}
            step={0.01}
            displayVal={f(inputs.Cs, 3)}
            isLog={true}
            interactive={interactive}
            onChange={v => onChangeParam?.('Cs', v)}
          />
          <ParamRow
            label="R_s grid absorption"
            value={inputs.Rs}
            min={-1.5}
            max={1}
            step={0.01}
            displayVal={f(inputs.Rs, 2)}
            isLog={true}
            interactive={interactive}
            onChange={v => onChangeParam?.('Rs', v)}
          />
          <ParamRow
            label="V_{br} clamp level"
            value={inputs.Vbr}
            min={0.5}
            max={20}
            step={0.1}
            displayVal={f(inputs.Vbr, 1)}
            isLog={false}
            interactive={interactive}
            onChange={v => onChangeParam?.('Vbr', v)}
          />
        </div>
      </div>

      {/* Right Column: Surge plot, energy ledger, and verdict */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '14px 16px',
          boxSizing: 'border-box',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: dimColor,
            margin: 0,
          }}
        >
          The surge <span style={{textTransform: 'none', letterSpacing: 0}}>v(t)</span>
        </h2>

        {/* Plot SVG */}
        <svg
          viewBox={`0 0 ${PW} ${PH}`}
          style={{width: '100%', height: 'auto', display: 'block'}}
          role="img"
          aria-label="The backlash surge v of t after the breach"
        >
          <defs>
            <filter id="snubber-pg" filterUnits="userSpaceOnUse" x="0" y="0" width={PW} height={PH}>
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="snubber-ah"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              markerWidth="15"
              markerHeight="15"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M0,0 L12,6 L0,12 z" fill={wireColor} />
            </marker>
          </defs>

          {/* Grid lines and ticks */}
          {[1, 2, 3, 4, 5].map(t => (
            <React.Fragment key={t}>
              <line
                x1={X(t)}
                y1={PT}
                x2={X(t)}
                y2={PH - PB}
                stroke={color('color/line/chart')}
                strokeOpacity="0.35"
              />
              <text
                x={X(t)}
                y={PH - PB + 22}
                textAnchor="middle"
                fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono}
                fontSize="14"
                fill={dimColor}
              >
                {t}
              </text>
            </React.Fragment>
          ))}

          {/* Vbr clamp threshold lines */}
          {inputs.t &&
            [inputs.Vbr, -inputs.Vbr].map(v => (
              <line
                key={v}
                x1={PL}
                y1={Y(v).toFixed(1)}
                x2={PW - PR}
                y2={Y(v).toFixed(1)}
                stroke={goldColor}
                strokeWidth="1.6"
                strokeDasharray="7 5"
              />
            ))}
          {inputs.t && (
            <text
              x={PW - PR}
              y={(Y(inputs.Vbr) - 8).toFixed(1)}
              textAnchor="end"
              fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono}
              fontSize="14"
              fill={goldColor}
            >
              <MathText svg text={'V_{br} = ' + f(inputs.Vbr, 1)} />
            </text>
          )}

          {/* Axes */}
          <line
            x1={PL}
            y1={PH - PB + 6}
            x2={PL}
            y2={PT - 10}
            stroke={wireColor}
            strokeWidth="2.5"
            markerEnd="url(#snubber-ah)"
          />
          <line
            x1={PL}
            y1={Y(0).toFixed(1)}
            x2={PW - PR + 16}
            y2={Y(0).toFixed(1)}
            stroke={wireColor}
            strokeWidth="2"
          />

          <text x={PL + 14} y={PT + 16} fontFamily="STIX Two Text, serif" fontStyle="italic" fontSize="26" fill={color('color/text/primary')}>
            v(t)
          </text>
          <text x={PL + 74} y={PT + 12} fontFamily={tokens.fonts.sans ?? Tokens.fonts.sans} fontSize="15" fill={mutedColor}>
            backlash surge
          </text>
          <text x={PW - PR} y={PH - PB + 40} textAnchor="end" fontFamily={tokens.fonts.mono ?? Tokens.fonts.mono} fontSize="14" fill={dimColor}>
            t after the breach (illustrative units)
          </text>

          {/* Surge curve */}
          <path
            d={plotD}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.6"
            strokeLinejoin="round"
            filter="url(#snubber-pg)"
          />
        </svg>

        {/* Energy Ledger */}
        <div style={{marginTop: 6}}>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: dimColor,
              margin: '0 0 8px',
            }}
          >
            Where the field’s energy goes
          </h2>
          <div
            style={{
              display: 'flex',
              height: 22,
              borderRadius: 5,
              overflow: 'hidden',
              background: color('color/surface/well'),
              border: `1px solid ${color('color/line/chart')}`,
            }}
            role="img"
            aria-label="Energy shares"
          >
            {KEYS.map(k => {
              const sh = r.parts[k.id as keyof typeof r.parts] / tot;
              if (sh <= 0.001) return null;
              return (
                <span
                  key={k.id}
                  style={{
                    width: `${(100 * sh).toFixed(2)}%`,
                    height: '100%',
                    background: k.hex,
                    display: 'block',
                  }}
                  title={k.label}
                />
              );
            })}
          </div>

          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '6px 18px',
              margin: '10px 0 0',
              padding: 0,
              listStyle: 'none',
              fontSize: '13.5px',
            }}
          >
            {KEYS.map(k => {
              const sh = r.parts[k.id as keyof typeof r.parts] / tot;
              return (
                <li
                  key={k.id}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'baseline',
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      flex: 'none',
                      transform: 'translateY(1px)',
                      background: k.hex,
                    }}
                  />
                  <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {k.label}
                  </span>
                  <b
                    style={{
                      fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
                      fontSize: 13,
                      marginLeft: 'auto',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {Math.round(100 * sh)}%
                  </b>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stats */}
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '10px 16px',
            margin: '10px 0 0',
          }}
        >
          <div>
            <dt style={{fontSize: 12, color: mutedColor}}>Peak surge</dt>
            <dd style={{margin: 0, fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono, fontSize: 15, fontWeight: 500}}>
              {f(r.peak, 1)}
            </dd>
          </div>
          <div>
            <dt style={{fontSize: 12, color: mutedColor}}>Unprotected peak</dt>
            <dd style={{margin: 0, fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono, fontSize: 15, fontWeight: 500}}>
              {f(free.peak, 1)}
            </dd>
          </div>
          <div>
            <dt style={{fontSize: 12, color: mutedColor}}>Surge reduction</dt>
            <dd style={{margin: 0, fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono, fontSize: 15, fontWeight: 500}}>
              {redPct}%
            </dd>
          </div>
        </dl>

        {/* Verdict */}
        <p style={{margin: '10px 0 0', fontSize: '14.5px', lineHeight: 1.5}}>
          {getVerdict(r, free, inputs.h, inputs.s, inputs.t)}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ParamRow Helper
// ---------------------------------------------------------------------------
function ParamRow({
  label,
  value,
  min,
  max,
  step,
  displayVal,
  isLog,
  interactive,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayVal: string;
  isLog: boolean;
  interactive: boolean;
  onChange: (val: number) => void;
}): JSX.Element {
  const tokens = useTokens();
  const sliderVal = isLog ? Math.log10(value) : value;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '130px minmax(0, 1fr) 60px',
        gap: 10,
        alignItems: 'center',
        margin: '2px 0',
      }}
    >
      <label style={{fontSize: 13}}>
        <MathText text={label} />
      </label>
      {interactive ? (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderVal}
          onChange={e => {
            const raw = +e.target.value;
            onChange(isLog ? Math.pow(10, raw) : raw);
          }}
          style={{
            width: '100%',
            accentColor: color('color/line/wire'),
          }}
        />
      ) : (
        <div
          style={{
            height: 4,
            background: color('color/surface/well'),
            borderRadius: 2,
            position: 'relative',
            border: `1px solid ${color('color/line/chart')}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.max(0, Math.min(100, ((sliderVal - min) / (max - min)) * 100))}%`,
              background: color('color/line/wire'),
            }}
          />
        </div>
      )}
      <span
        style={{
          fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
          fontSize: 13,
          fontWeight: 500,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayVal}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings View: 1368 × 828 content box
// ---------------------------------------------------------------------------
function SettingsView({
  width,
  height,
  inputs,
  modelDefault,
}: {
  width: number;
  height: number;
  inputs: SnubberCircuitInputs;
  modelDefault: boolean;
}): JSX.Element {
  const tokens = useTokens();
  const dimColor = color('color/text/dim');
  const mutedColor = color('color/text/muted');

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: tokens.fonts.sans ?? Tokens.fonts.sans,
        color: color('color/text/primary'),
      }}
    >
      {modelDefault && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            background: color('color/surface/well'),
            border: `1px solid ${color('color/fill/gold')}`,
            color: color('color/fill/gold'),
            fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
            fontSize: 13,
          }}
        >
          Model default: this log does not set this instrument.
        </div>
      )}

      {/* Model Parameters Readout Card */}
      <div
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '16px 18px',
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: dimColor,
            margin: '0 0 12px',
          }}
        >
          Model parameters (read-only)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '10px 24px',
            fontFamily: tokens.fonts.mono ?? Tokens.fonts.mono,
            fontSize: 13,
          }}
        >
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="I_0" /> (field current):{' '}
            </span>
            <b>{f(inputs.I0)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>L (coil inductance): </span>
            <b>{f(inputs.L, 2)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="C_{next}" /> (next coil):{' '}
            </span>
            <b>{f(inputs.Ch, 3)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="C_s" /> (grid capacity):{' '}
            </span>
            <b>{f(inputs.Cs, 3)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="R_s" /> (grid absorption):{' '}
            </span>
            <b>{f(inputs.Rs, 2)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="V_{br}" /> (clamp level):{' '}
            </span>
            <b>{f(inputs.Vbr, 1)}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>Elite recovery path: </span>
            <b>{inputs.h ? 'Enabled' : 'Disabled'}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>Snubber grid path: </span>
            <b>{inputs.s ? 'Enabled' : 'Disabled'}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>TVS clamp path: </span>
            <b>{inputs.t ? 'Enabled' : 'Disabled'}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="C_p" /> (stray capacitance):{' '}
            </span>
            <b>{CP}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="R_L" /> (coil resistance):{' '}
            </span>
            <b>{RL}</b>
          </div>
          <div>
            <span style={{color: mutedColor}}>
              <MathText text="R_h" /> (recovery resistance):{' '}
            </span>
            <b>{RH}</b>
          </div>
        </div>
      </div>

      {/* Verbatim Sources Card */}
      <div
        style={{
          background: color('color/surface/1'),
          border: `1px solid ${color('color/line/chart')}`,
          borderRadius: 10,
          padding: '16px 18px',
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: dimColor,
            margin: '0 0 12px',
          }}
        >
          What the page assumes
        </h2>
        <div style={{fontSize: '13.5px', color: mutedColor, display: 'flex', flexDirection: 'column', gap: 10, lineHeight: 1.55}}>
          <p style={{margin: 0}}>
            From the manuscript: the back-EMF surge as backlash,{' '}
            <MathText text="v = -L di/dt" /> (eq. 1.7d), and the stored energy{' '}
            <MathText text="U = \frac{1}{2}LI^2" /> (eq. 1.7e), with the Elite harvesting it into
            the next era's capacitors (<code><MathText>{'Paper/The_Original_Power.tex:2416'}</MathText></code>–<code>:2440</code>);
            the snubber as the Out-group routing its energy through local, open-source grids (
            <code>:14435</code>, <code>:14348</code>); the TVS diode as armed deterrence that clamps
            strikes above <MathText text="V_{br}" /> (<code>:11598</code>–<code>:11630</code>).
          </p>
          <p style={{margin: 0}}>
            The circuit: when the switch opens at <MathText text="t = 0" />, the coil current I flows
            into the node and splits among a small stray capacitance (always present, 0.002), the
            Elite's recovery path (an ideal diode and <MathText text="R_h = 0.5" /> into{' '}
            <MathText text="C_{next}" />, which starts empty), the snubber (<MathText text="R_s" /> in
            series with <MathText text="C_s" />), and the TVS clamp (an ideal clamp at{' '}
            <MathText text="\pm V_{br}" />). The coil has a small resistance (0.05). The page
            integrates the circuit numerically and adds up the energy in each path. Energy that
            charges <MathText text="C_{next}" /> or heats <MathText text="R_h" /> counts as recovered
            by the Elite; energy in <MathText text="R_s" /> or left in <MathText text="C_s" /> counts as
            absorbed by the grid.
          </p>
          <p style={{margin: 0}}>
            The manuscript gives no values for these parts. Every number here is illustrative, so
            the page shows how the paths compete, not how large any historical surge was.
          </p>
          <p style={{margin: 0}}>
            L, <MathText text="C_{next}" />, <MathText text="C_s" />, and <MathText text="R_s" /> move
            on log scales. <MathText text="V_{br}" /> keeps its electrical meaning: a lower{' '}
            <MathText text="V_{br}" /> clamps the surge sooner. The manuscript says arms and training
            raise <MathText text="V_{br}" /> (<code>:11611</code>). In a real TVS diode, a higher{' '}
            <MathText text="V_{br}" /> lets a larger surge through before the clamp acts, so the two
            readings conflict (see the README).
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive View: allows state updates when interactive === true
// ---------------------------------------------------------------------------
function InteractiveSnubberCircuitView(props: SnubberCircuitViewProps): JSX.Element {
  const {mode, width, height, era} = props;
  const initialInputs = snubberCircuitFromEra(era);

  const [inputs, setInputs] = useState<SnubberCircuitInputs>(initialInputs);

  const r = getSimulation(
    inputs.I0,
    inputs.L,
    inputs.Ch,
    inputs.Cs,
    inputs.Rs,
    inputs.Vbr,
    inputs.h,
    inputs.s,
    inputs.t,
  );
  const free = getSimulation(
    inputs.I0,
    inputs.L,
    inputs.Ch,
    inputs.Cs,
    inputs.Rs,
    inputs.Vbr,
    false,
    false,
    false,
  );

  const handleSelectPreset = (idx: number) => {
    const p = PRESETS[idx];
    setInputs(prev => ({
      ...prev,
      h: p.h,
      s: p.s,
      t: p.t,
      Vbr: p.Vbr ?? prev.Vbr,
      preset: idx,
    }));
  };

  const handleToggleBranch = (branch: 'h' | 's' | 't') => {
    setInputs(prev => ({
      ...prev,
      [branch]: !prev[branch],
      preset: -1,
    }));
  };

  const handleChangeParam = (key: keyof SnubberCircuitInputs, val: number) => {
    setInputs(prev => ({
      ...prev,
      [key]: val,
      preset: -1,
    }));
  };

  if (mode === 'compact') {
    return <CompactView width={width} height={height} r={r} free={free} />;
  }

  if (mode === 'settings') {
    return (
      <SettingsView
        width={width}
        height={height}
        inputs={inputs}
        modelDefault={inputs.modelDefault}
      />
    );
  }

  return (
    <ExpandedView
      width={width}
      height={height}
      inputs={inputs}
      r={r}
      free={free}
      interactive={true}
      onSelectPreset={handleSelectPreset}
      onToggleBranch={handleToggleBranch}
      onChangeParam={handleChangeParam}
    />
  );
}
