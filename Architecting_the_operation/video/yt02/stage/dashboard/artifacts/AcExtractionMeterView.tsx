import React, { useState, type JSX } from 'react';
import { useTokens, MathText, type InstrumentMode } from '@stage';
import { color } from '../../tokens';

export type AcExtractionMeterInputs = {
  modelDefault: boolean;
  th: number;    // θ phase angle in degrees, default 55
  V: number;     // |V| state voltage, default 1.0
  I: number;     // |I| labor current, default 1.0
  dc: number;    // DC level 1619–1865, default 1.0
  hw: number;    // Rectified share 1865–1965, default 0.60
  ac: number;    // AC |V||I| 1965–2026, default 1.0
  activeEra?: 'dc' | 'hw' | 'ac';
  eraYear?: number;
};

export type AcExtractionMeterViewProps = {
  mode: InstrumentMode;            // 'compact' | 'expanded' | 'settings'
  width: number; height: number;   // content box to fill (no outer panel chrome)
  interactive: boolean;            // true only on the website
  era?: {log: number; fields: Record<string, unknown>};  // an entry of yt02/dashboard_eras.json
};

export const DEFAULT_INPUTS: AcExtractionMeterInputs = {
  modelDefault: true,
  th: 55,
  V: 1.0,
  I: 1.0,
  dc: 1.0,
  hw: 0.6,
  ac: 1.0,
};

export function acExtractionMeterFromEra(
  era?: {log: number; fields: Record<string, unknown>}
): AcExtractionMeterInputs {
  if (!era) {
    return {...DEFAULT_INPUTS};
  }

  let activeEra: 'dc' | 'hw' | 'ac' | undefined;
  let eraYear: number | undefined;

  switch (era.log) {
    case 2:
      eraYear = 1486;
      break;
    case 3:
      activeEra = 'dc';
      eraYear = 1705;
      break;
    case 5:
      activeEra = 'dc';
      eraYear = 1785;
      break;
    case 9:
      activeEra = 'hw';
      eraYear = 1930;
      break;
    case 14:
      activeEra = 'ac';
      eraYear = 1981;
      break;
    case 15:
      activeEra = 'ac';
      eraYear = 2010;
      break;
    case 17:
      activeEra = 'ac';
      eraYear = 2018;
      break;
    default:
      break;
  }

  return {
    ...DEFAULT_INPUTS,
    modelDefault: true,
    activeEra,
    eraYear,
  };
}

function f(v: number, d = 2): string {
  return (Math.abs(v) < 0.0005 ? 0 : v).toFixed(d);
}

function clock(th: number): string {
  let h = (((6 - th / 30) % 12) + 12) % 12;
  if (h < 0.25 || h > 11.75) return '12:00';
  let H = Math.floor(h);
  let M = Math.round((h - H) * 60);
  if (M === 60) {
    H++;
    M = 0;
  }
  return (H === 0 ? 12 : H) + ':' + (M < 10 ? '0' : '') + M;
}

function verdictText(th: number): string {
  const a = Math.abs(th);
  const R = Math.PI / 180;
  let t = '';
  if (a < 2) {
    t = 'DC limit: θ = 0, so W = ψ_m (eq. 0.7a). Open, unidirectional extraction; the system needs no status wage and no phase-shifting Buffer Class.';
  } else if (a < 88) {
    t = `AC mode: covert, plausibly neutral extraction. Real power still flows (${Math.round(100 * Math.cos(a * R))}% of |S|), and the reactive part hides its direction.`;
  } else if (a <= 92) {
    t = 'Pure reactive power: the wage is all status. No net work moves; the system runs on culture war.';
  } else {
    t = 'Quadrant II: cos θ < 0. Real power reverses, so the Elite extract material wealth from the Buffer Class while ψ_s stays inflated.';
  }
  if (th < -2) {
    t += ' With θ < 0, ψ_s is negative: status inversion (buffer demotion).';
  }
  return t;
}

const REGIMES = [
  {label: 'DC (θ = 0°)', th: 0},
  {label: 'AC, covert', th: 55},
  {label: 'Pure reactive', th: 90},
  {label: 'Quadrant II', th: 125},
] as const;

const ERAS = [
  {a: 1619, b: 1865, k: 'dc' as const, col: '#E0604A', name: 'DC: chattel slavery'},
  {a: 1865, b: 1965, k: 'hw' as const, col: 'var(--ac-gold)', name: 'Rectified: 13th Am., Jim Crow'},
  {a: 1965, b: 2026, k: 'ac' as const, col: 'var(--ac-accent)', name: 'AC: phase-shifted'},
] as const;

// Module-level computation and memoization
type WaveformData = {
  c: number;
  s: number;
  VI: number;
  pathV: string;
  pathI: string;
  pathReal: string;
  pathReac: string;
  pathTotal: string;
  fillReal: string;
  meanY: number;
  netWorkReactive: number;
};

const waveformCache = new Map<string, WaveformData>();

function computeWaveform(th: number, V: number, I: number): WaveformData {
  const key = `${th.toFixed(1)}:${V.toFixed(2)}:${I.toFixed(2)}`;
  const cached = waveformCache.get(key);
  if (cached) return cached;

  const W = 900, L = 60, Rr = 20, cyc = 2, N = 400;
  const R = Math.PI / 180;
  const c = Math.cos(th * R);
  const s = Math.sin(th * R);
  const VI = V * I;
  const top = {y0: 130, k: 70};
  const bot = {y0: 390, k: 58};

  const X = (u: number) => L + (u / (2 * Math.PI * cyc)) * (W - L - Rr);
  const real = (u: number) => VI * c * (1 + Math.cos(2 * u));
  const reac = (u: number) => VI * s * Math.sin(2 * u);

  const pathFor = (fn: (u: number) => number, p: {y0: number; k: number}) => {
    let d = '';
    for (let n = 0; n <= N; n++) {
      const u = (2 * Math.PI * cyc * n) / N;
      d += (n ? ' L ' : 'M ') + X(u).toFixed(1) + ' ' + (p.y0 - p.k * fn(u)).toFixed(1);
    }
    return d;
  };

  const pathV = pathFor(u => V * Math.cos(u), top);
  const pathI = pathFor(u => I * Math.cos(u - th * R), top);
  const pathReal = pathFor(real, bot);
  const pathReac = pathFor(reac, bot);
  const pathTotal = pathFor(u => real(u) + reac(u), bot);

  let fillReal = 'M ' + X(0).toFixed(1) + ' ' + bot.y0.toFixed(1);
  for (let n = 0; n <= N; n++) {
    const u = (2 * Math.PI * cyc * n) / N;
    fillReal += ' L ' + X(u).toFixed(1) + ' ' + (bot.y0 - bot.k * real(u)).toFixed(1);
  }
  fillReal += ' L ' + X(2 * Math.PI * cyc).toFixed(1) + ' ' + bot.y0.toFixed(1) + ' Z';

  let qi = 0;
  const dt = (2 * Math.PI * cyc) / 4000;
  for (let n = 0; n < 4000; n++) {
    qi += reac((n + 0.5) * dt) * dt;
  }

  const result: WaveformData = {
    c, s, VI,
    pathV, pathI, pathReal, pathReac, pathTotal, fillReal,
    meanY: bot.y0 - bot.k * VI * c,
    netWorkReactive: Math.abs(qi) < 0.0005 ? 0 : qi,
  };
  waveformCache.set(key, result);
  return result;
}

type IntegralData = {
  pathRealFill: string;
  pathRealStroke: string;
  pathIntegralStroke: string;
  tot: {dc: number; hw: number; ac: number};
  all: number;
  y0Y: number;
  accY: number;
  X: (y: number) => number;
  Y: (p: number) => number;
};

const integralCache = new Map<string, IntegralData>();

function computeIntegral(th: number, dc: number, hw: number, ac: number): IntegralData {
  const key = `${th.toFixed(1)}:${dc.toFixed(2)}:${hw.toFixed(2)}:${ac.toFixed(2)}`;
  const cached = integralCache.get(key);
  if (cached) return cached;

  const W = 1200, H = 380, L = 70, Rr = 70, T = 56, B = 46, y0 = 1619, y1 = 2026;
  const R = Math.PI / 180;
  const pf = Math.cos(th * R);

  const powerAt = (y: number) => {
    if (y < 1865) return dc;
    if (y < 1965) return dc * (hw + (1 - hw) * pf);
    return ac * pf;
  };

  const X = (y: number) => L + ((y - y0) / (y1 - y0)) * (W - L - Rr);
  const pmax = 1.6, pmin = -1.6;
  const Y = (p: number) => T + ((pmax - p) / (pmax - pmin)) * (H - T - B);

  const cum: [number, number][] = [];
  let acc = 0;
  const tot = {dc: 0, hw: 0, ac: 0};
  const pts: [number, number][] = [];

  for (let y = y0; y <= y1; y += 0.5) {
    const p = powerAt(y);
    pts.push([y, p]);
    if (y < y1) {
      acc += p * 0.5;
      if (y < 1865) tot.dc += p * 0.5;
      else if (y < 1965) tot.hw += p * 0.5;
      else tot.ac += p * 0.5;
    }
    cum.push([y, acc]);
  }

  const cmax = Math.max(1, Math.max(...cum.map(c => Math.abs(c[1]))));
  const YC = (c: number) => Y(0) - (c / cmax) * (Y(0) - T);

  let pathRealFill = 'M ' + X(y0).toFixed(1) + ' ' + Y(0).toFixed(1);
  pts.forEach(p => {
    pathRealFill += ' L ' + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1);
  });
  pathRealFill += ' L ' + X(y1).toFixed(1) + ' ' + Y(0).toFixed(1) + ' Z';

  let pathRealStroke = '';
  pts.forEach((p, k) => {
    pathRealStroke += (k ? ' L ' : 'M ') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1);
  });

  let pathIntegralStroke = '';
  cum.forEach((c, k) => {
    pathIntegralStroke += (k ? ' L ' : 'M ') + X(c[0]).toFixed(1) + ' ' + YC(c[1]).toFixed(1);
  });

  const all = tot.dc + tot.hw + tot.ac;

  const result: IntegralData = {
    pathRealFill,
    pathRealStroke,
    pathIntegralStroke,
    tot,
    all,
    y0Y: Y(0),
    accY: YC(acc),
    X,
    Y,
  };
  integralCache.set(key, result);
  return result;
}

function ArrowSvg({
  x1, y1, x2, y2, col, w,
}: {
  x1: number; y1: number; x2: number; y2: number; col: string; w: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = Math.hypot(x2 - x1, y2 - y1);
  const hl = Math.min(16, L * 0.4);
  const bx = x2 - hl * Math.cos(a);
  const by = y2 - hl * Math.sin(a);

  return (
    <g>
      <line
        x1={x1.toFixed(1)}
        y1={y1.toFixed(1)}
        x2={bx.toFixed(1)}
        y2={by.toFixed(1)}
        stroke={col}
        strokeWidth={w}
        strokeLinecap="round"
      />
      {L > 4 && (
        <path
          d={`M ${x2.toFixed(1)} ${y2.toFixed(1)} L ${(bx + hl * 0.45 * Math.sin(a)).toFixed(1)} ${(
            by - hl * 0.45 * Math.cos(a)
          ).toFixed(1)} L ${(bx - hl * 0.45 * Math.sin(a)).toFixed(1)} ${(
            by + hl * 0.45 * Math.cos(a)
          ).toFixed(1)} Z`}
          fill={col}
        />
      )}
    </g>
  );
}

function PhasorSvg({
  th, V, I, width, height,
}: {
  th: number; V: number; I: number; width?: string | number; height?: string | number;
}) {
  const C = 240, K = 110;
  const R = Math.PI / 180;
  const P = V * I * Math.cos(th * R);
  const Q = V * I * Math.sin(th * R);
  const sx = C + Q * K;
  const sy = C + P * K;

  const ar = 46;
  const steps = Math.max(2, Math.round(Math.abs(th) / 4));
  let arcD = '';
  for (let k = 0; k <= steps; k++) {
    const t = (th * R * k) / steps;
    arcD += (k ? ' L ' : 'M ') + (C + ar * Math.sin(t)).toFixed(1) + ' ' + (C + ar * Math.cos(t)).toFixed(1);
  }
  const tm = (th * R) / 2;
  const arcTextX = C + (ar + 16) * Math.sin(tm);
  const arcTextY = C + (ar + 16) * Math.cos(tm) + 5;

  const ix = C + I * K * Math.sin(-th * R);
  const iy = C + I * K * Math.cos(-th * R);

  const colWire = color('color/text/primary');
  const colGold = color('color/fill/gold');
  const colAccent = color('color/text/accent');
  const colRule = color('color/line/chart');
  const colGreen = '#7CC08A';
  const colRed = '#E0604A';
  const colTeal = '#4CC2C2';
  const colLabel = color('color/text/dim');

  return (
    <svg
      viewBox="0 0 480 480"
      width={width ?? '100%'}
      height={height ?? 'auto'}
      style={{display: 'block', overflow: 'visible'}}
      role="img"
      aria-label="Phasor diagram of V, I and S on the wage plane"
    >
      <defs>
        <filter id="ac-meter-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="480" height="480">
          <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.55" />
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Reference grid circles */}
      {[1, 2].map(r => (
        <circle
          key={r}
          cx={C}
          cy={C}
          r={r * K}
          fill="none"
          stroke={colRule}
          strokeOpacity={0.45}
          strokeDasharray="3 5"
        />
      ))}

      {/* Axes */}
      <line x1={C} y1={C - 215} x2={C} y2={C} stroke={colRed} strokeWidth={2} />
      <line x1={C} y1={C} x2={C} y2={C + 215} stroke={colGreen} strokeWidth={2} />
      <line x1={C - 215} y1={C} x2={C + 215} y2={C} stroke={colRule} strokeWidth={2} />

      {/* Axis labels */}
      <text x={C + 8} y={C + 210} fontSize={13} fill={colGreen}>
        <MathText svg>+ψ_m  real power</MathText>
      </text>
      <text x={C + 8} y={C - 200} fontSize={13} fill={colRed}>
        <MathText svg>−ψ_m</MathText>
      </text>
      <text x={C + 212} y={C - 8} textAnchor="end" fontSize={13} fill={colLabel}>
        <MathText svg>+ψ_s  reactive</MathText>
      </text>
      <text x={C - 212} y={C - 8} fontSize={13} fill={colLabel}>
        <MathText svg>−ψ_s</MathText>
      </text>

      {/* Clock numbers */}
      {[
        ['12', 0, -1],
        ['3', 1, 0],
        ['6', 0, 1],
        ['9', -1, 0],
      ].map(c => {
        const num = c[0] as string;
        const dx = c[1] as number;
        const dy = c[2] as number;
        return (
          <text
            key={num}
            x={C + dx * 228}
            y={C + dy * 228 + (dy > 0 ? 12 : dy < 0 ? 0 : 5)}
            textAnchor="middle"
            fontSize={12}
            fill={colLabel}
          >
            {num}
          </text>
        );
      })}

      {/* Power triangle */}
      <line
        x1={C}
        y1={sy.toFixed(1)}
        x2={sx.toFixed(1)}
        y2={sy.toFixed(1)}
        stroke={colLabel}
        strokeDasharray="5 4"
        strokeWidth={1.5}
      />
      <line
        x1={sx.toFixed(1)}
        y1={C}
        x2={sx.toFixed(1)}
        y2={sy.toFixed(1)}
        stroke={P >= 0 ? colGreen : colRed}
        strokeDasharray="5 4"
        strokeWidth={1.5}
      />

      {/* Theta arc */}
      <path d={arcD} fill="none" stroke={colGold} strokeWidth={1.6} />
      <text
        x={arcTextX.toFixed(1)}
        y={arcTextY.toFixed(1)}
        textAnchor="middle"
        fontSize={17}
        fill={colGold}
        fontStyle="italic"
      >
        θ
      </text>

      {/* V reference along +psi_m */}
      <ArrowSvg x1={C} y1={C} x2={C} y2={C + V * K} col={colWire} w={2.2} />
      <text x={C - 10} y={C + V * K + 4} textAnchor="end" fontSize={17} fill={colWire} fontStyle="italic">
        V
      </text>

      {/* I labor current at -theta */}
      <ArrowSvg x1={C} y1={C} x2={ix} y2={iy} col={colTeal} w={2.2} />
      <text
        x={(ix + (ix < C ? -10 : 10)).toFixed(1)}
        y={(iy + 4).toFixed(1)}
        textAnchor={ix < C ? 'end' : 'start'}
        fontSize={17}
        fill={colTeal}
        fontStyle="italic"
      >
        I
      </text>

      {/* S = W complex power */}
      <g filter="url(#ac-meter-glow)">
        <ArrowSvg x1={C} y1={C} x2={sx} y2={sy} col={colAccent} w={4.5} />
      </g>
      <text
        x={(sx + (sx < C ? -12 : 12)).toFixed(1)}
        y={(sy + (sy < C ? -8 : 18)).toFixed(1)}
        textAnchor={sx < C ? 'end' : 'start'}
        fontSize={15}
        fill={colAccent}
      >
        S = W
      </text>

      {/* Origin pivot */}
      <circle cx={C} cy={C} r={4} fill={colWire} />
    </svg>
  );
}

function WaveformSvg({
  th, V, I, width, height,
}: {
  th: number; V: number; I: number; width?: string | number; height?: string | number;
}) {
  const data = computeWaveform(th, V, I);
  const W = 900, H = 520, L = 60, Rr = 20, cyc = 2;
  const X = (u: number) => L + (u / (2 * Math.PI * cyc)) * (W - L - Rr);

  const colWire = color('color/text/primary');
  const colGold = color('color/fill/gold');
  const colAccent = color('color/text/accent');
  const colRule = color('color/line/chart');
  const colGreen = '#7CC08A';
  const colRed = '#E0604A';
  const colTeal = '#4CC2C2';
  const colLabel = color('color/text/dim');
  const colMuted = color('color/text/muted');

  const gridQuarterLines: number[] = [];
  for (let g = 1; g < cyc * 4; g++) {
    gridQuarterLines.push(X((g * Math.PI) / 2));
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width ?? '100%'}
      height={height ?? 'auto'}
      style={{display: 'block'}}
      role="img"
      aria-label="v of t, i of t, and the two parts of instantaneous power"
    >
      {/* Panel labels */}
      <text x={L} y={26} fontSize={14} fill={colLabel}>
        v(t), i(t)
      </text>
      <text x={L} y={280} fontSize={14} fill={colLabel}>
        p(t) = real part + reactive part
      </text>

      {/* Baseline horizontal axes */}
      <line x1={L} y1={data.VI ? 130 : 130} x2={W - Rr} y2={130} stroke={colWire} strokeWidth={1.6} />
      <line x1={L} y1={390} x2={W - Rr} y2={390} stroke={colWire} strokeWidth={1.6} />

      {/* Cycle grids */}
      {gridQuarterLines.map((gx, idx) => (
        <line key={idx} x1={gx} y1={40} x2={gx} y2={H - 14} stroke={colRule} strokeOpacity={0.3} />
      ))}

      {/* Top panel: v(t) and i(t) */}
      <path d={data.pathV} fill="none" stroke={colWire} strokeWidth={2.2} />
      <path d={data.pathI} fill="none" stroke={colTeal} strokeWidth={2.2} />
      <text x={W - Rr} y={130 - 70 * 1.25} textAnchor="end" fontSize={13} fill={colWire}>
        v(t)
      </text>
      <text x={W - Rr - 50} y={130 - 70 * 1.25} textAnchor="end" fontSize={13} fill={colTeal}>
        i(t)
      </text>

      {/* Bottom panel: p(t) split */}
      <path d={data.fillReal} fill={data.c >= 0 ? colGreen : colRed} fillOpacity={0.14} />
      <path d={data.pathReal} fill="none" stroke={data.c >= 0 ? colGreen : colRed} strokeWidth={2.2} />
      <path d={data.pathReac} fill="none" stroke={colLabel} strokeWidth={2} strokeDasharray="6 4" />
      <path d={data.pathTotal} fill="none" stroke={colAccent} strokeWidth={2.6} />

      {/* Mean line */}
      <line
        x1={L}
        y1={data.meanY.toFixed(1)}
        x2={W - Rr}
        y2={data.meanY.toFixed(1)}
        stroke={colGold}
        strokeWidth={1.6}
        strokeDasharray="8 5"
      />
      <text x={L + 6} y={(data.meanY - 6).toFixed(1)} fontSize={13} fill={colGold}>
        <MathText svg>mean = P = ψ_m</MathText>
      </text>

      {/* Legend */}
      {[
        [colAccent, 'p(t)', false],
        [data.c >= 0 ? colGreen : colRed, 'real part', false],
        [colLabel, 'reactive part', true],
      ].map((e, k) => (
        <g key={k}>
          <line
            x1={W - Rr - 330 + k * 104}
            y1={296}
            x2={W - Rr - 310 + k * 104}
            y2={296}
            stroke={e[0] as string}
            strokeWidth={3}
            strokeDasharray={e[2] ? '6 4' : undefined}
          />
          <text x={W - Rr - 304 + k * 104} y={300} fontSize={12} fill={colMuted}>
            {e[1] as string}
          </text>
        </g>
      ))}

      <text x={W - Rr} y={H - 2} textAnchor="end" fontSize={12} fill={colLabel}>
        two cycles of the carrier
      </text>
    </svg>
  );
}

function IntegralSvg({
  th, dc, hw, ac, width, height,
}: {
  th: number; dc: number; hw: number; ac: number; width?: string | number; height?: string | number;
}) {
  const data = computeIntegral(th, dc, hw, ac);
  const W = 1200, H = 380, L = 70, Rr = 70, T = 56, B = 46;

  const colWire = color('color/text/primary');
  const colAccent = color('color/text/accent');
  const colRule = color('color/line/chart');
  const colGreen = '#7CC08A';
  const colLabel = color('color/text/dim');
  const colMuted = color('color/text/muted');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width ?? '100%'}
      height={height ?? 'auto'}
      style={{display: 'block'}}
      role="img"
      aria-label="Real power flow from O to E by era, and its running integral"
    >
      {/* Era shaded wash backgrounds */}
      {ERAS.map(e => (
        <g key={e.k}>
          <rect
            x={data.X(e.a)}
            y={T}
            width={data.X(e.b) - data.X(e.a)}
            height={H - T - B}
            fill={e.k === 'dc' ? '#E0604A' : e.k === 'hw' ? color('color/fill/gold') : color('color/text/accent')}
            fillOpacity={0.06}
          />
          <text
            x={data.X(e.a) + 6}
            y={T - 12}
            textAnchor="start"
            fontSize={13}
            fill={e.k === 'dc' ? '#E0604A' : e.k === 'hw' ? color('color/fill/gold') : color('color/text/accent')}
          >
            {e.name}
          </text>
        </g>
      ))}

      {/* Year vertical gridlines */}
      {[1700, 1800, 1865, 1900, 1965, 2000].map(y => (
        <g key={y}>
          <line
            x1={data.X(y)}
            y1={T}
            x2={data.X(y)}
            y2={H - B}
            stroke={colRule}
            strokeOpacity={0.35}
          />
          <text x={data.X(y)} y={H - B + 20} textAnchor="middle" fontSize={13} fill={colLabel}>
            {y}
          </text>
        </g>
      ))}

      {/* Zero baseline */}
      <line x1={L} y1={data.y0Y} x2={W - Rr} y2={data.y0Y} stroke={colWire} strokeWidth={1.6} />

      {/* Shaded real power and stroke */}
      <path d={data.pathRealFill} fill={colGreen} fillOpacity={0.16} />
      <path d={data.pathRealStroke} fill="none" stroke={colGreen} strokeWidth={2} />

      {/* Running integral curve */}
      <path d={data.pathIntegralStroke} fill="none" stroke={colAccent} strokeWidth={2.8} />

      {/* Curve markers & labels */}
      <text x={W - Rr + 6} y={data.accY + 4} fontSize={14} fill={colAccent}>
        ℛ
      </text>
      <text x={L - 8} y={data.y0Y + 4} textAnchor="end" fontSize={12} fill={colLabel}>
        0
      </text>
      <text x={L} y={H - 6} fontSize={12} fill={colMuted}>
        green: real power from O into E, Re[V I*] · orange: running integral ℛ (scaled to fit)
      </text>
    </svg>
  );
}

function StaticSliderRow({
  label, value, min, max, formattedValue,
}: {
  label: string; value: number; min: number; max: number; formattedValue: string;
}) {
  const tokens = useTokens();
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div style={{display: 'grid', gridTemplateColumns: '128px 1fr 70px', gap: 10, alignItems: 'center', margin: '6px 0'}}>
      <label style={{fontSize: 13, color: color('color/text/primary'), fontFamily: tokens.fonts.sans}}>
        <MathText>{label}</MathText>
      </label>
      <div style={{position: 'relative', height: 14, display: 'flex', alignItems: 'center'}}>
        <div style={{width: '100%', height: 4, borderRadius: 2, background: 'rgba(232,201,155,0.12)'}}>
          <div
            style={{
              width: `${pct.toFixed(1)}%`,
              height: '100%',
              borderRadius: 2,
              background: color('color/text/accent'),
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
            background: color('color/text/accent'),
            border: `1.5px solid ${color('color/text/primary')}`,
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: tokens.fonts.mono,
          fontSize: 13,
          textAlign: 'right',
          color: color('color/text/primary'),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formattedValue}
      </div>
    </div>
  );
}

function InteractiveSliderRow({
  label, value, min, max, step, formattedValue, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; formattedValue: string; onChange: (v: number) => void;
}) {
  const tokens = useTokens();

  return (
    <div style={{display: 'grid', gridTemplateColumns: '128px 1fr 70px', gap: 10, alignItems: 'center', margin: '6px 0'}}>
      <label style={{fontSize: 13, color: color('color/text/primary'), fontFamily: tokens.fonts.sans}}>
        <MathText>{label}</MathText>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{width: '100%', minWidth: 0, accentColor: color('color/text/primary'), cursor: 'pointer'}}
      />
      <output
        style={{
          fontFamily: tokens.fonts.mono,
          fontSize: 13,
          textAlign: 'right',
          color: color('color/text/primary'),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formattedValue}
      </output>
    </div>
  );
}

// Compact Mode (177 × 80 content box)
function CompactView({
  inputs, width, height,
}: {
  inputs: AcExtractionMeterInputs; width: number; height: number;
}) {
  const tokens = useTokens();
  const {th, V, I} = inputs;
  const R = Math.PI / 180;
  const cosTh = Math.cos(th * R);
  const clk = clock(th);

  // Mini phasor coordinates: center (34, 34), radius 26
  const mcx = 34, mcy = 34, mr = 26;
  const colWire = color('color/text/primary');
  const colAccent = color('color/text/accent');
  const colRule = color('color/line/chart');
  const colGreen = '#7CC08A';
  const colRed = '#E0604A';
  const colTeal = '#4CC2C2';

  const six = mcx + I * mr * Math.sin(-th * R);
  const siy = mcy + I * mr * Math.cos(-th * R);
  const ssx = mcx + V * I * mr * Math.sin(th * R);
  const ssy = mcy + V * I * mr * Math.cos(th * R);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '4px 6px',
        color: colWire,
      }}
    >
      <svg
        viewBox="0 0 68 68"
        width={62}
        height={62}
        style={{flexShrink: 0, display: 'block'}}
        role="img"
        aria-label="AC extraction mini phasor"
      >
        <circle cx={mcx} cy={mcy} r={mr} fill="none" stroke={colRule} strokeOpacity={0.45} strokeDasharray="2 3" />
        <line x1={mcx} y1={mcy - mr} x2={mcx} y2={mcy} stroke={colRed} strokeWidth={1.5} />
        <line x1={mcx} y1={mcy} x2={mcx} y2={mcy + mr} stroke={colGreen} strokeWidth={1.5} />
        <line x1={mcx - mr} y1={mcy} x2={mcx + mr} y2={mcy} stroke={colRule} strokeWidth={1.5} />
        {/* V vector */}
        <line x1={mcx} y1={mcy} x2={mcx} y2={mcy + V * mr} stroke={colWire} strokeWidth={1.8} strokeLinecap="round" />
        {/* I vector */}
        <line x1={mcx} y1={mcy} x2={six} y2={siy} stroke={colTeal} strokeWidth={1.8} strokeLinecap="round" />
        {/* S vector */}
        <line x1={mcx} y1={mcy} x2={ssx} y2={ssy} stroke={colAccent} strokeWidth={2.8} strokeLinecap="round" />
        <circle cx={mcx} cy={mcy} r={2} fill={colWire} />
      </svg>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 11,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: color('color/text/muted'),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          AC EXTRACTION
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 13,
            fontWeight: 500,
            color: colWire,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          cos θ {f(cosTh)}
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 11,
            color: color('color/text/dim'),
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {clk}
        </div>
      </div>
    </div>
  );
}

// Settings Mode
function SettingsView({
  inputs, width, height,
}: {
  inputs: AcExtractionMeterInputs; width: number; height: number;
}) {
  const tokens = useTokens();
  const {th, V, I, dc, hw, ac, modelDefault, activeEra} = inputs;
  const R = Math.PI / 180;
  const P = V * I * Math.cos(th * R);
  const Q = V * I * Math.sin(th * R);
  const colWire = color('color/text/primary');
  const colGold = color('color/fill/gold');
  const colRule = color('color/line/chart');
  const colPanel = 'rgba(19, 37, 56, 0.85)';

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '16px 20px',
        color: colWire,
        fontFamily: tokens.fonts.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div>
        <h2
          style={{
            margin: '0 0 6px',
            font: `600 18px ${tokens.fonts.sans}`,
            color: colWire,
          }}
        >
          AC Extraction Meter — Model Parameters & Sources
        </h2>
        {modelDefault && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: 'rgba(224,163,60,0.12)',
              border: `1px solid ${colGold}`,
              color: colGold,
              fontFamily: tokens.fonts.mono,
              fontSize: 12,
              margin: '8px 0',
            }}
          >
            Model default: this log does not set this instrument.
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.4fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Model parameters table */}
        <div
          style={{
            background: colPanel,
            border: `1px solid ${colRule}`,
            borderRadius: 8,
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: colGold,
              marginBottom: 10,
            }}
          >
            Model Parameters & State Readouts
          </div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
            <tbody>
              {[
                ['Phase angle θ', `${th}°`],
                ['State voltage |V|', f(V)],
                ['Labor current |I|', f(I)],
                ['DC level (1619–1865)', f(dc)],
                ['Rectified share (1865–1965)', f(hw)],
                ['AC |V||I| (1965–2026)', f(ac)],
                ['Real power P = ψ_m', `${f(P)} (|V||I| cos θ)`],
                ['Reactive power Q = ψ_s', `${f(Q)} (|V||I| sin θ)`],
                ['Apparent power |S| = |W|', `${f(V * I)}`],
                ['Power factor', f(Math.cos(th * R))],
                ['Clock position', clock(th)],
                ['Active era span', activeEra ? activeEra.toUpperCase() : 'None (pre-1619)'],
              ].map(([k, val]) => (
                <tr key={k} style={{borderBottom: '1px solid rgba(138,106,69,0.3)'}}>
                  <td style={{padding: '7px 4px', color: color('color/text/muted')}}>
                    <MathText>{k}</MathText>
                  </td>
                  <td
                    style={{
                      padding: '7px 4px',
                      textAlign: 'right',
                      fontFamily: tokens.fonts.mono,
                      fontVariantNumeric: 'tabular-nums',
                      color: colWire,
                    }}
                  >
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verbatim manuscript sources and assumptions */}
        <div
          style={{
            background: colPanel,
            border: `1px solid ${colRule}`,
            borderRadius: 8,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: colGold,
            }}
          >
            What the page assumes (Sources)
          </div>

          <p style={{margin: 0, fontSize: 13, lineHeight: 1.5, color: color('color/text/muted')}}>
            <MathText>{'From the manuscript: DC mode, P = V·I and W = ψ_m with θ = 0 (eqs. 0.7, 0.7a); AC mode, S = V·I* = P + jQ with P = ψ_m and Q = ψ_s (eqs. 0.8–0.9); the regimes by θ, including Quadrant II for θ > 90° (Paper/The_Original_Power.tex:1150); the Variable Swap as DC → AC migration and the carceral state as a half-wave rectifier (:1240–:1275); systemic work and the Buffer-Class Work Theorem (eqs. 0.13–0.15); the Reparations Integral and its limits, t_0 = 1619, t_{now} = 2026 (eq. 0.16, :1385).'}</MathText>
          </p>

          <p style={{margin: 0, fontSize: 13, lineHeight: 1.5, color: color('color/text/muted')}}>
            <MathText>{'Orientation follows the complex wage plane: +ψ_m points down (6 o’clock), +ψ_s points right, and the clock reading is 6 − θ/30. V is the reference phasor; I is drawn at −θ so that S = V·I* sits at +θ.'}</MathText>
          </p>

          <p style={{margin: 0, fontSize: 13, lineHeight: 1.5, color: color('color/text/muted')}}>
            The manuscript states that the shape of the real-power curve is illustrative and implies no calibrated values. The era levels here are also illustrative, so the era shares show how the regimes add up under your settings, not a measured split. The dollar estimates the manuscript cites (Craemer, about $14–17 trillion; Darity and Mullen, about $10–12 trillion) come from those studies, not from this page.
          </p>

          <p style={{margin: 0, fontSize: 13, lineHeight: 1.5, color: color('color/text/muted')}}>
            The AC era uses the θ set above (P = |V||I| cos θ). The 1865–1965 era runs a half-wave rectifier inside the AC envelope: the share you set passes as DC labor (the 13th Amendment exception, Jim Crow statutes), and the rest follows the AC era&apos;s power factor.
          </p>
        </div>
      </div>
    </div>
  );
}

// Expanded View Content (Pure presentation)
function ExpandedContent({
  inputs,
  width,
  height,
  interactive,
  onUpdateInput,
}: {
  inputs: AcExtractionMeterInputs;
  width: number;
  height: number;
  interactive: boolean;
  onUpdateInput?: (key: keyof AcExtractionMeterInputs, value: number) => void;
}) {
  const tokens = useTokens();
  const {th, V, I, dc, hw, ac} = inputs;
  const R = Math.PI / 180;
  const P = V * I * Math.cos(th * R);
  const Q = V * I * Math.sin(th * R);
  const clk = clock(th);
  const verdict = verdictText(th);

  const integralData = computeIntegral(th, dc, hw, ac);
  const waveformData = computeWaveform(th, V, I);

  const colWire = color('color/text/primary');
  const colGold = color('color/fill/gold');
  const colRule = color('color/line/chart');
  const colPanel = 'rgba(19, 37, 56, 0.85)';
  const colMuted = color('color/text/muted');

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '16px 20px',
        color: colWire,
        fontFamily: tokens.fonts.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div>
        <h1
          style={{
            margin: '0 0 6px',
            font: `600 22px ${tokens.fonts.sans}`,
            letterSpacing: '-0.01em',
            color: colWire,
          }}
        >
          AC Extraction Meter
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.5,
            color: colMuted,
            maxWidth: '92ch',
          }}
        >
          The complex wage is complex power: S = V·I* = P + jQ, with <MathText>P = ψ_m</MathText> (real power, material work) and <MathText>Q = ψ_s</MathText> (reactive power, status that does no net work) (eqs. 0.8–0.9). The phase angle θ is the system&apos;s tuning knob. The lower panel integrates the real power over the eras to give the Reparations Integral (eq. 0.16).
        </p>
      </div>

      {/* Main Grid: Left Column (Phasor + Stats) and Right Column (Waveforms + Integral) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(400px, 460px) minmax(600px, 1fr)',
          gap: 18,
          alignItems: 'start',
          height: 700,
        }}
      >
        {/* Left Column: Phasor Diagram card */}
        <section
          style={{
            background: colPanel,
            border: `1px solid ${colRule}`,
            borderRadius: 10,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
          aria-label="Phasor"
        >
          <h2
            style={{
              margin: '0 0 4px',
              font: `600 12px ${tokens.fonts.sans}`,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colGold,
            }}
          >
            The wage as complex power
          </h2>

          {/* Regime presets */}
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, margin: '2px 0 6px'}}>
            {REGIMES.map(r => {
              const active = Math.abs(th - r.th) < 1;
              if (interactive && onUpdateInput) {
                return (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => onUpdateInput('th', r.th)}
                    style={{
                      font: `500 12px ${tokens.fonts.sans}`,
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: `1px solid ${active ? colGold : colRule}`,
                      background: active ? 'rgba(224,163,60,0.18)' : 'rgba(8,20,33,0.7)',
                      color: active ? colGold : colWire,
                      cursor: 'pointer',
                    }}
                  >
                    {r.label}
                  </button>
                );
              }
              return (
                <span
                  key={r.label}
                  style={{
                    font: `500 12px ${tokens.fonts.sans}`,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${active ? colGold : colRule}`,
                    background: active ? 'rgba(224,163,60,0.18)' : 'rgba(8,20,33,0.7)',
                    color: active ? colGold : colWire,
                  }}
                >
                  {r.label}
                </span>
              );
            })}
          </div>

          {/* Phasor SVG */}
          <div style={{width: '100%', maxWidth: 440, margin: '0 auto'}}>
            <PhasorSvg th={th} V={V} I={I} height={260} />
          </div>

          {/* Sliders / Static controls */}
          <div style={{marginTop: 6}}>
            {interactive && onUpdateInput ? (
              <>
                <InteractiveSliderRow
                  label="θ phase angle"
                  value={th}
                  min={-180}
                  max={180}
                  step={1}
                  formattedValue={`${th}°`}
                  onChange={v => onUpdateInput('th', v)}
                />
                <InteractiveSliderRow
                  label="|V| state voltage"
                  value={V}
                  min={0.2}
                  max={1.5}
                  step={0.01}
                  formattedValue={f(V)}
                  onChange={v => onUpdateInput('V', v)}
                />
                <InteractiveSliderRow
                  label="|I| labor current"
                  value={I}
                  min={0.2}
                  max={1.5}
                  step={0.01}
                  formattedValue={f(I)}
                  onChange={v => onUpdateInput('I', v)}
                />
              </>
            ) : (
              <>
                <StaticSliderRow label="θ phase angle" value={th} min={-180} max={180} formattedValue={`${th}°`} />
                <StaticSliderRow label="|V| state voltage" value={V} min={0.2} max={1.5} formattedValue={f(V)} />
                <StaticSliderRow label="|I| labor current" value={I} min={0.2} max={1.5} formattedValue={f(I)} />
              </>
            )}
          </div>

          {/* Key readouts */}
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '8px 12px',
              margin: '10px 0 0',
              padding: 0,
            }}
          >
            <div>
              <dt style={{fontSize: 12, color: colMuted, margin: 0}}>
                <MathText>P = ψ_m</MathText>
              </dt>
              <dd style={{margin: '2px 0 0', font: `500 15px ${tokens.fonts.mono}`, fontVariantNumeric: 'tabular-nums'}}>
                {f(P)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 12, color: colMuted, margin: 0}}>
                <MathText>Q = ψ_s</MathText>
              </dt>
              <dd style={{margin: '2px 0 0', font: `500 15px ${tokens.fonts.mono}`, fontVariantNumeric: 'tabular-nums'}}>
                {f(Q)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 12, color: colMuted, margin: 0}}>
                <MathText>|S| = |W|</MathText>
              </dt>
              <dd style={{margin: '2px 0 0', font: `500 15px ${tokens.fonts.mono}`, fontVariantNumeric: 'tabular-nums'}}>
                {f(V * I)}
              </dd>
            </div>
            <div>
              <dt style={{fontSize: 12, color: colMuted, margin: 0}}>
                cos θ · clock
              </dt>
              <dd style={{margin: '2px 0 0', font: `500 15px ${tokens.fonts.mono}`, fontVariantNumeric: 'tabular-nums'}}>
                {f(Math.cos(th * R))} · {clk}
              </dd>
            </div>
          </dl>

          {/* Verdict note */}
          <div
            style={{
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.45,
              color: colWire,
              borderTop: `1px solid rgba(138,106,69,0.35)`,
              paddingTop: 8,
            }}
          >
            <MathText>{verdict}</MathText>
          </div>
        </section>

        {/* Right Column: Waveforms & Reparations Integral cards */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, height: 700}}>
          {/* Waveforms Card */}
          <section
            style={{
              background: colPanel,
              border: `1px solid ${colRule}`,
              borderRadius: 10,
              padding: '14px 16px',
              height: 288,
              overflow: 'hidden',
            }}
            aria-label="Waveforms"
          >
            <h2
              style={{
                margin: '0 0 10px',
                font: `600 12px ${tokens.fonts.sans}`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colGold,
              }}
            >
              One cycle, instant by instant
            </h2>
            <div style={{width: '100%', margin: '0 auto'}}>
              <WaveformSvg th={th} V={V} I={I} height={145} />
            </div>
            <p style={{fontSize: 13, color: colMuted, margin: '8px 0 0', lineHeight: 1.45}}>
              p(t) = v(t)·i(t) splits into two parts. The real part, P(1 + cos 2ωt), always flows one way. The reactive part, Q·sin 2ωt, flows back and forth and averages to zero. Over the window shown, the net work of the reactive part is{' '}
              <b style={{fontFamily: tokens.fonts.mono, color: colWire}}>{f(waveformData.netWorkReactive, 3)}</b>. This is the Buffer-Class Work Theorem (eq. 0.15): status delivered as <MathText>ψ_s</MathText> does no cumulative material work.
            </p>
          </section>

          {/* Reparations Integral Card */}
          <section
            style={{
              background: colPanel,
              border: `1px solid ${colRule}`,
              borderRadius: 10,
              padding: '14px 16px',
              height: 400,
              overflow: 'hidden',
            }}
            aria-label="Reparations integral"
          >
            <h2
              style={{
                margin: '0 0 10px',
                font: `600 12px ${tokens.fonts.sans}`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colGold,
              }}
            >
              The Reparations Integral, 1619–2026
            </h2>
            <div style={{width: '100%', margin: '0 auto'}}>
              <IntegralSvg th={th} dc={dc} hw={hw} ac={ac} height={110} />
            </div>

            {/* Sliders for Integral */}
            <div style={{marginTop: 8}}>
              {interactive && onUpdateInput ? (
                <>
                  <InteractiveSliderRow
                    label="DC level, 1619–1865"
                    value={dc}
                    min={0}
                    max={1.5}
                    step={0.01}
                    formattedValue={f(dc)}
                    onChange={v => onUpdateInput('dc', v)}
                  />
                  <InteractiveSliderRow
                    label="Rectified share, 1865–1965"
                    value={hw}
                    min={0}
                    max={1}
                    step={0.01}
                    formattedValue={f(hw)}
                    onChange={v => onUpdateInput('hw', v)}
                  />
                  <InteractiveSliderRow
                    label="AC |V||I|, 1965–2026"
                    value={ac}
                    min={0}
                    max={1.5}
                    step={0.01}
                    formattedValue={f(ac)}
                    onChange={v => onUpdateInput('ac', v)}
                  />
                </>
              ) : (
                <>
                  <StaticSliderRow label="DC level, 1619–1865" value={dc} min={0} max={1.5} formattedValue={f(dc)} />
                  <StaticSliderRow label="Rectified share, 1865–1965" value={hw} min={0} max={1} formattedValue={f(hw)} />
                  <StaticSliderRow label="AC |V||I|, 1965–2026" value={ac} min={0} max={1.5} formattedValue={f(ac)} />
                </>
              )}
            </div>

            <p style={{fontSize: 13, color: colMuted, margin: '8px 0 10px', lineHeight: 1.45}}>
              The AC era uses the θ set above (P = |V||I| cos θ). The 1865–1965 era runs a half-wave rectifier inside the AC envelope: the share you set passes as DC labor (the 13th Amendment exception, Jim Crow statutes), and the rest follows the AC era&apos;s power factor.
            </p>

            {/* Shares cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '10px 16px',
                marginTop: 10,
              }}
            >
              {ERAS.map(e => {
                const sharePct = integralData.all > 0 ? Math.round((100 * integralData.tot[e.k]) / integralData.all) + '%' : '—';
                const eraCol = e.k === 'dc' ? '#E0604A' : e.k === 'hw' ? color('color/fill/gold') : color('color/text/accent');
                return (
                  <div
                    key={e.k}
                    style={{
                      borderLeft: `3px solid ${eraCol}`,
                      paddingLeft: 10,
                    }}
                  >
                    <b
                      style={{
                        display: 'block',
                        font: `500 15px ${tokens.fonts.mono}`,
                        color: colWire,
                      }}
                    >
                      {sharePct}
                    </b>
                    <span style={{fontSize: 12, color: colMuted}}>
                      {e.name} · {f(integralData.tot[e.k], 0)} unit-years
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Static View (Deterministic, NO React state or effect hooks)
function StaticAcExtractionMeterView({
  mode, width, height, inputs,
}: {
  mode: InstrumentMode; width: number; height: number; inputs: AcExtractionMeterInputs;
}) {
  if (mode === 'compact') {
    return <CompactView inputs={inputs} width={width} height={height} />;
  }
  if (mode === 'settings') {
    return <SettingsView inputs={inputs} width={width} height={height} />;
  }
  return <ExpandedContent inputs={inputs} width={width} height={height} interactive={false} />;
}

// Interactive View (Website only, uses useState)
function InteractiveAcExtractionMeterView(props: AcExtractionMeterViewProps) {
  const [inputs, setInputs] = useState<AcExtractionMeterInputs>(() => acExtractionMeterFromEra(props.era));

  const handleUpdate = (key: keyof AcExtractionMeterInputs, value: number) => {
    setInputs(prev => ({...prev, [key]: value, modelDefault: false}));
  };

  if (props.mode === 'compact') {
    return <CompactView inputs={inputs} width={props.width} height={props.height} />;
  }
  if (props.mode === 'settings') {
    return <SettingsView inputs={inputs} width={props.width} height={props.height} />;
  }
  return (
    <ExpandedContent
      inputs={inputs}
      width={props.width}
      height={props.height}
      interactive={true}
      onUpdateInput={handleUpdate}
    />
  );
}

export function AcExtractionMeterView(props: AcExtractionMeterViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveAcExtractionMeterView {...props} />;
  }
  const inputs = acExtractionMeterFromEra(props.era);
  return <StaticAcExtractionMeterView mode={props.mode} width={props.width} height={props.height} inputs={inputs} />;
}
