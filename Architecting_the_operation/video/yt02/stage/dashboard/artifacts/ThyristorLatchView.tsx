import React, {useContext, useEffect, useRef, useState, type JSX} from 'react';
import {MathText, useTokens, type InstrumentMode} from '@stage';
import {color, Tokens} from '../../tokens';

export type ThyristorLatchViewProps = {
  mode: InstrumentMode; // 'compact' | 'expanded' | 'settings'
  width: number; // content box width (no panel chrome)
  height: number; // content box height (no panel chrome)
  interactive: boolean; // true only on the website
  era?: {log: number; fields: Record<string, unknown>};
};

export type ThyristorLatchModel = {
  s: number; // share routed to own grid (0..1)
  eta: number; // feedback efficiency (0.4..2)
  lam: number; // field decay / yr (0.1..0.6)
};

export type ThyristorLatchEraResult = {
  modelDefault: boolean;
  s: number;
  eta: number;
  lam: number;
};

export const defaultModel: ThyristorLatchModel = {
  s: 0.1,
  eta: 1.0,
  lam: 0.3,
};

export const E0 = 1;
export const K = 1;
export const DT = 0.02;
export const WIN = 60;
export const GATE = 2.6;

export function f(v: number, d = 2): string {
  return v.toFixed(d);
}

export function g(B: number): number {
  return (B * B) / (B * B + K * K);
}

export function aCoeff(s: number, eta: number): number {
  return eta * (1 - s) * E0;
}

export function onB(s: number, eta: number, lam: number): number | null {
  const r = aCoeff(s, eta) / lam;
  const disc = r * r - 4 * K * K;
  return disc >= 0 ? (r + Math.sqrt(disc)) / 2 : null;
}

export function midB(s: number, eta: number, lam: number): number | null {
  const r = aCoeff(s, eta) / lam;
  const disc = r * r - 4 * K * K;
  return disc >= 0 ? (r - Math.sqrt(disc)) / 2 : null;
}

export function latched(B: number, s: number, eta: number, lam: number): boolean {
  const m = midB(s, eta, lam);
  return m != null && B > m;
}

export function IH(eta: number, lam: number): number {
  return (lam * K) / eta;
}

export function scrit(eta: number, lam: number): number {
  return Math.max(0, 1 - (2 * lam * K) / (eta * E0));
}

export function cur(B: number, s: number): number {
  return (1 - s) * E0 * g(B);
}

export function onB0(eta: number, lam: number): number {
  const r = (eta * E0) / lam;
  const d = Math.max(0, r * r - 4 * K * K);
  return (r + Math.sqrt(d)) / 2;
}

export function thyristorLatchFromEra(
  _era?: {log: number; fields: Record<string, unknown>}
): ThyristorLatchEraResult {
  return {
    modelDefault: true,
    s: defaultModel.s,
    eta: defaultModel.eta,
    lam: defaultModel.lam,
  };
}

// Module-level memoisation for bifurcation curves
const bifPathCache = new Map<string, {up: string; dn: string}>();

function getBifPaths(
  sc: number,
  eta: number,
  lam: number,
  X: (s: number) => number,
  Y: (b: number) => number
): {up: string; dn: string} {
  const key = `${sc.toFixed(4)}_${eta.toFixed(4)}_${lam.toFixed(4)}`;
  const cached = bifPathCache.get(key);
  if (cached) return cached;

  let up = '';
  let dn = '';
  for (let k = 0; k <= 400; k++) {
    const s = (sc * k) / 400;
    const r = (eta * (1 - s) * E0) / lam;
    const d = Math.max(0, r * r - 4 * K * K);
    const xCoord = X(s).toFixed(1);
    const yUp = Y((r + Math.sqrt(d)) / 2).toFixed(1);
    const yDn = Y((r - Math.sqrt(d)) / 2).toFixed(1);
    up += (k ? 'L' : 'M') + xCoord + ' ' + yUp;
    dn += (k ? 'L' : 'M') + xCoord + ' ' + yDn;
  }
  const result = {up, dn};
  bifPathCache.set(key, result);
  return result;
}

const palette = {
  paper: color('color/bg/field'),
  panel: color('color/surface/1'),
  well: color('color/surface/well'),
  wire: color('color/line/wire'),
  ink: color('color/text/primary'),
  ink2: color('color/text/muted'),
  rule: color('color/line/chart'),
  labelSm: color('color/text/dim'),
  red: color('color/marker/race'),
  teal: color('color/marker/sexuality'),
  gold: color('color/fill/gold'),
  accent: color('color/fill/accent'),
  dim: color('color/fill/panel'),
};

export function ThyristorLatchView(props: ThyristorLatchViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveThyristorLatchView {...props} />;
  }
  return <StaticThyristorLatchView {...props} />;
}

// ---------------------------------------------------------------------------
// Static View (Pure deterministic render: no useState, useEffect, refs, rAF)
// ---------------------------------------------------------------------------
function StaticThyristorLatchView(props: ThyristorLatchViewProps) {
  const tokens = useTokens();
  const {mode, width, height, era} = props;
  const eraData = thyristorLatchFromEra(era);
  const s = eraData.s;
  const eta = eraData.eta;
  const lam = eraData.lam;

  const steadyB = onB(s, eta, lam) ?? 0;
  const curI = cur(steadyB, s);
  const ih = IH(eta, lam);
  const sc = scrit(eta, lam);
  const mb = midB(s, eta, lam);
  const isLatched = latched(steadyB, s, eta, lam);

  if (mode === 'compact') {
    return renderCompact({width, height, isLatched, curI, ih, s, sc, tokens});
  }

  if (mode === 'settings') {
    return renderSettings({width, height, s, eta, lam, curI, ih, sc, steadyB, mb, isLatched, modelDefault: eraData.modelDefault, tokens});
  }

  // mode === 'expanded'
  return renderExpandedStatic({
    width,
    height,
    s,
    eta,
    lam,
    B: steadyB,
    curI,
    ih,
    sc,
    mb,
    isLatched,
    tokens,
  });
}

// ---------------------------------------------------------------------------
// Compact Mode Render (177 × 80)
// ---------------------------------------------------------------------------
function renderCompact({
  width,
  height,
  isLatched,
  curI,
  ih,
  s,
  sc,
  tokens,
}: {
  width: number;
  height: number;
  isLatched: boolean;
  curI: number;
  ih: number;
  s: number;
  sc: number;
  tokens: ReturnType<typeof useTokens>;
}) {
  const badgeColor = isLatched ? palette.red : palette.teal;
  const barW = 86;
  const filledW = Math.max(0, Math.min(barW, barW * curI));
  const tickX = Math.max(0, Math.min(barW, barW * ih));

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
        padding: '6px 8px',
        fontFamily: tokens.fonts.mono,
        color: palette.ink,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: palette.ink,
        }}
      >
        <span>THYRISTOR LATCH</span>
        <span style={{fontSize: 9, color: palette.labelSm}}>eq. 0.1a</span>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0'}}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.04em',
            padding: '1px 5px',
            borderRadius: 4,
            border: `1px solid ${badgeColor}`,
            color: badgeColor,
            lineHeight: '14px',
            flexShrink: 0,
          }}
        >
          {isLatched ? 'LATCHED' : 'RELEASED'}
        </span>
        <svg width={barW} height="14" viewBox={`0 0 ${barW} 14`} style={{display: 'block', flex: 1}}>
          <rect
            x="0"
            y="3"
            width={barW}
            height="8"
            rx="2"
            fill={palette.well}
            stroke={palette.rule}
            strokeWidth="0.8"
          />
          <rect x="0" y="3" width={filledW} height="8" rx="2" fill={palette.accent} />
          <line x1={tickX} y1="1" x2={tickX} y2="13" stroke={palette.red} strokeWidth="1.8" />
        </svg>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10,
          color: palette.ink2,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>
          s {f(s)} / <MathText>{'s^*'}</MathText> {f(sc)}
        </span>
        <span>
          <MathText>{'I'}</MathText> {f(curI)} · <MathText>{'I_H'}</MathText> {f(ih)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static Expanded Mode Render (1368 × 828)
// ---------------------------------------------------------------------------
function renderExpandedStatic({
  width,
  height,
  s,
  eta,
  lam,
  B,
  curI,
  ih,
  sc,
  mb,
  isLatched,
  tokens,
}: {
  width: number;
  height: number;
  s: number;
  eta: number;
  lam: number;
  B: number;
  curI: number;
  ih: number;
  sc: number;
  mb: number | null;
  isLatched: boolean;
  tokens: ReturnType<typeof useTokens>;
}) {
  const cardStyle: React.CSSProperties = {
    background: palette.panel,
    border: `1px solid ${palette.rule}`,
    borderRadius: 10,
    padding: '14px 16px',
    boxSizing: 'border-box',
    minWidth: 0,
  };

  const h2Style: React.CSSProperties = {
    fontFamily: tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: palette.labelSm,
    margin: '0 0 8px',
  };

  let verdictText = '';
  if (isLatched) {
    verdictText =
      'The field is above the latch threshold and the current stays above I_H, so the latch holds. The field the extraction funds keeps the extraction flowing.';
  } else if (s > sc) {
    verdictText = `Released. With ${Math.round(100 * s)}% of the supply on the Out-group’s own grid, no on state exists: a gate pulse lifts the field for a moment, and then it decays.`;
  } else {
    verdictText =
      'Released, and the off state holds even though s is below s*. The machine stays down until the Elite fire the gate hard enough to cross the latch threshold.';
  }

  // Precomputed static history lines
  const W_strip = 900;
  const H_strip = 470;
  const L_strip = 60;
  const Rr_strip = 20;
  const T_strip = 24;
  const mid_strip = 250;
  const B2_strip = 40;
  const Imax = 1.05;
  const Bmax_strip = Math.max(3.5, (onB(s, eta, lam) || 0) * 1.1);

  const YI = (iVal: number) => T_strip + ((Imax - iVal) / Imax) * (mid_strip - T_strip - 20);
  const YB = (bVal: number) => mid_strip + 20 + ((Bmax_strip - bVal) / Bmax_strip) * (H_strip - B2_strip - mid_strip - 20);

  const xStart = L_strip;
  const xEnd = W_strip - Rr_strip;
  const dI = `M${xStart} ${YI(curI).toFixed(1)} L${xEnd} ${YI(curI).toFixed(1)}`;
  const dB = `M${xStart} ${YB(B).toFixed(1)} L${xEnd} ${YB(B).toFixed(1)}`;

  // Bifurcation paths
  const W_bif = 1200;
  const H_bif = 360;
  const L_bif = 70;
  const Rr_bif = 30;
  const T_bif = 24;
  const B_bif = 50;
  const Bmax_bif = Math.max(4, (eta * E0 / lam) * 1.05);

  const XBif = (sVal: number) => L_bif + sVal * (W_bif - L_bif - Rr_bif);
  const YBif = (bVal: number) => T_bif + ((Bmax_bif - bVal) / Bmax_bif) * (H_bif - T_bif - B_bif);

  const {up, dn} = getBifPaths(sc, eta, lam, XBif, YBif);
  const onB0Val = onB0(eta, lam);

  const br = 12 + 18 * Math.min(1, B / 3.2);
  const wWire = (1.5 + 6 * curI).toFixed(1);
  const wSnubber = (1.5 + 6 * s).toFixed(1);

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '12px 16px',
        fontFamily: tokens.fonts.sans,
        color: palette.ink,
      }}
    >
      {/* Header */}
      <header style={{flexShrink: 0}}>
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1.2,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
            color: palette.ink,
          }}
        >
          Thyristor Latch
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.45,
            color: palette.ink2,
            maxWidth: '110ch',
          }}
        >
          A thyristor stays on after its gate pulse ends, as long as the current through it stays
          above the holding current <MathText>{'I_H'}</MathText>. The Elite&apos;s extraction loop
          latches the same way: extraction funds the cultural field B (eq. 0.1a), and the field
          keeps the extraction flowing. When the Out-group routes enough of its energy through its
          own grid, the current falls below <MathText>{'I_H'}</MathText> and the machine powers
          down (Parasitic System Collapse Theorem).
        </p>
      </header>

      {/* Main Grid: Loop Schematic (Left) & Strip Chart (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Card 1: Loop schematic */}
        <section style={cardStyle} aria-label="Circuit and controls">
          <h2 style={h2Style}>The self-exciting loop</h2>
          <svg
            viewBox="0 0 640 330"
            role="img"
            aria-label="The Out-group's supply feeds extraction through the Elite's latch; a feedback tap funds the field; a snubber grid diverts a share of the supply"
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            <defs>
              <marker
                id="thyristor-ar-static"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="9"
                markerHeight="9"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={palette.wire} />
              </marker>
            </defs>

            {/* Out-group supply rail */}
            <rect x="24" y="130" width="120" height="70" rx="8" fill="none" stroke={palette.teal} strokeWidth="2" />
            <text x="84" y="160" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              Out-group
            </text>
            <text x="84" y="180" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              <MathText svg>{'V_{cc}'}</MathText> rail
            </text>

            {/* Wire to SCR */}
            <path
              d="M144 165 H300"
              fill="none"
              stroke={palette.accent}
              strokeWidth={wWire}
              strokeDasharray="14 14"
            />

            {/* SCR symbol */}
            <path
              d="M300 140 L300 190 L345 165 Z"
              fill={isLatched ? palette.red : palette.dim}
            />
            <line
              x1="345"
              y1="138"
              x2="345"
              y2="192"
              stroke={isLatched ? palette.red : palette.dim}
              strokeWidth="4"
            />
            <line x1="345" y1="165" x2="372" y2="190" stroke={palette.gold} strokeWidth="3" />
            <text x="322" y="126" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              Elite latch
            </text>
            <text x="384" y="208" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.gold}>
              gate
            </text>

            {/* Extracted wealth */}
            <path
              d="M345 165 H520"
              fill="none"
              stroke={palette.accent}
              strokeWidth={wWire}
              strokeDasharray="14 14"
            />
            <rect x="520" y="130" width="100" height="70" rx="8" fill="none" stroke={palette.red} strokeWidth="2" />
            <text x="570" y="160" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              extracted
            </text>
            <text x="570" y="180" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              wealth
            </text>

            {/* Feedback tap to field */}
            <path
              d="M570 130 V60 H190"
              fill="none"
              stroke={palette.wire}
              strokeWidth="2"
              markerEnd="url(#thyristor-ar-static)"
            />
            <text x="400" y="50" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.wire}>
              feedback tap η: media, campaigns, policing
            </text>

            {/* Field B circle */}
            <circle cx="160" cy="60" r={br.toFixed(1)} fill="none" stroke={palette.gold} strokeWidth="2.5" />
            <text x="160" y="66" textAnchor="middle" fontStyle="italic" fontSize="18" fontFamily="serif" fill={palette.gold}>
              B
            </text>
            <path
              d={`M${(160 + br * 0.7).toFixed(1)} ${(60 + br * 0.7).toFixed(1)} C 150 230 330 240 368 194`}
              fill="none"
              stroke={palette.gold}
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#thyristor-ar-static)"
            />
            <text x="40" y="20" fontSize="12" fontFamily={tokens.fonts.mono} fill={palette.ink2}>
              field holds compliance
            </text>

            {/* Snubber diversion */}
            <path
              d="M84 200 V280 H300"
              fill="none"
              stroke={palette.teal}
              strokeWidth={wSnubber}
              strokeDasharray="14 14"
            />
            <rect x="300" y="250" width="200" height="60" rx="8" fill="none" stroke={palette.teal} strokeWidth="2" />
            <text x="400" y="276" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              snubber grid
            </text>
            <text x="400" y="296" textAnchor="middle" fontSize="12" fontFamily={tokens.fonts.mono} fill={palette.ink2}>
              share s = {Math.round(100 * s)}%
            </text>
          </svg>

          {/* Static parameter readouts */}
          <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
              <span style={{color: palette.ink}}>
                <i>s</i> routed to own grid
              </span>
              <span style={{fontFamily: tokens.fonts.mono, color: palette.ink}}>
                {f(s)} ({Math.round(s * 100)}%)
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
              <span style={{color: palette.ink}}>
                <i>η</i> feedback efficiency
              </span>
              <span style={{fontFamily: tokens.fonts.mono, color: palette.ink}}>
                {f(eta)}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
              <span style={{color: palette.ink}}>
                <i>λ</i> field decay / yr
              </span>
              <span style={{fontFamily: tokens.fonts.mono, color: palette.ink}}>
                {f(lam)}
              </span>
            </div>
          </div>
        </section>

        {/* Card 2: Strip Chart */}
        <section style={cardStyle} aria-label="Current and field over time">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
            <h2 style={{...h2Style, margin: 0}}>Current through the latch</h2>
            <span
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: 4,
                border: `1px solid ${isLatched ? palette.red : palette.teal}`,
                color: isLatched ? palette.red : palette.teal,
              }}
            >
              {isLatched ? 'LATCHED' : 'RELEASED'}
            </span>
          </div>

          <svg
            viewBox="0 0 900 470"
            role="img"
            aria-label="Extraction current and holding current over the last 60 years"
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            <text x={L_strip} y={T_strip - 6} fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.labelSm}>
              extraction current I
            </text>
            <text x={L_strip} y={mid_strip + 14} fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.labelSm}>
              cultural field B
            </text>
            <line x1={L_strip} y1={YI(0)} x2={W_strip - Rr_strip} y2={YI(0)} stroke={palette.wire} strokeWidth="1.4" />
            <line x1={L_strip} y1={YB(0)} x2={W_strip - Rr_strip} y2={YB(0)} stroke={palette.wire} strokeWidth="1.4" />

            <line
              x1={L_strip}
              y1={YI(ih).toFixed(1)}
              x2={W_strip - Rr_strip}
              y2={YI(ih).toFixed(1)}
              stroke={palette.red}
              strokeWidth="1.6"
              strokeDasharray="8 5"
            />
            <text
              x={W_strip - Rr_strip}
              y={(YI(ih) - 6).toFixed(1)}
              textAnchor="end"
              fontSize="13"
              fontFamily={tokens.fonts.mono}
              fill={palette.red}
            >
              <MathText svg>{'I_H'}</MathText> = {f(ih)}
            </text>

            {mb != null && (
              <>
                <line
                  x1={L_strip}
                  y1={YB(mb).toFixed(1)}
                  x2={W_strip - Rr_strip}
                  y2={YB(mb).toFixed(1)}
                  stroke={palette.gold}
                  strokeWidth="1.2"
                  strokeDasharray="4 5"
                  strokeOpacity="0.7"
                />
                <text
                  x={W_strip - Rr_strip}
                  y={(YB(mb) - 5).toFixed(1)}
                  textAnchor="end"
                  fontSize="12"
                  fontFamily={tokens.fonts.mono}
                  fill={palette.gold}
                >
                  latch threshold
                </text>
              </>
            )}

            <path d={dI} fill="none" stroke={palette.accent} strokeWidth="2.6" />
            <path d={dB} fill="none" stroke={palette.gold} strokeWidth="2.2" />

            {[0, 10, 20, 30, 40, 50, 60].map(yVal => {
              const xx = L_strip + (yVal / WIN) * (W_strip - L_strip - Rr_strip);
              const label = yVal === 60 ? 'now' : `${yVal - 60} yr`;
              return (
                <text
                  key={yVal}
                  x={xx.toFixed(1)}
                  y={H_strip - 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily={tokens.fonts.mono}
                  fill={palette.labelSm}
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* 4 Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '10px 16px',
              marginTop: 10,
            }}
          >
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Current <i>I</i>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(curI)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Holding <MathText>{'I_H'}</MathText>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(ih)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Field <i>B</i>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(B)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Critical share <MathText>{'s^*'}</MathText>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(sc)}
              </div>
            </div>
          </div>

          <p style={{margin: '10px 0 0', fontSize: 13.5, color: palette.ink, lineHeight: 1.4}}>
            {verdictText}
          </p>
        </section>
      </div>

      {/* Card 3: Bifurcation diagram */}
      <section style={cardStyle} aria-label="Bifurcation diagram">
        <h2 style={h2Style}>Where the latch can hold</h2>
        <svg
          viewBox="0 0 1200 360"
          role="img"
          aria-label="Steady-state field B against the routed share s: the on branch, the unstable threshold, and the off state"
          style={{display: 'block', width: '100%', height: 'auto'}}
        >
          <rect
            x={XBif(sc).toFixed(1)}
            y={T_bif}
            width={(XBif(1) - XBif(sc)).toFixed(1)}
            height={H_bif - T_bif - B_bif}
            fill={palette.teal}
            fillOpacity="0.08"
          />
          <text
            x={(XBif(sc) + 10).toFixed(1)}
            y={T_bif + 18}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            s &gt; <MathText svg>{'s^*'}</MathText>: the latch cannot hold
          </text>
          <line
            x1={XBif(sc).toFixed(1)}
            y1={T_bif}
            x2={XBif(sc).toFixed(1)}
            y2={H_bif - B_bif}
            stroke={palette.teal}
            strokeWidth="1.6"
            strokeDasharray="6 4"
          />
          <text
            x={XBif(sc).toFixed(1)}
            y={H_bif - B_bif + 36}
            textAnchor="middle"
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            <MathText svg>{'s^*'}</MathText> = {f(sc)}
          </text>

          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(sVal => (
            <text
              key={sVal}
              x={XBif(sVal)}
              y={H_bif - B_bif + 18}
              textAnchor="middle"
              fontSize="12"
              fontFamily={tokens.fonts.mono}
              fill={palette.labelSm}
            >
              {sVal.toFixed(1)}
            </text>
          ))}
          <text
            x={W_bif - Rr_bif}
            y={H_bif - 6}
            textAnchor="end"
            fontSize="12"
            fontFamily={tokens.fonts.mono}
            fill={palette.labelSm}
          >
            share s routed through the Out-group’s own grid
          </text>
          <text
            x={L_bif - 10}
            y={T_bif + 10}
            textAnchor="end"
            fontStyle="italic"
            fontSize="18"
            fontFamily="serif"
            fill={palette.gold}
          >
            B
          </text>

          <path d={up} fill="none" stroke={palette.red} strokeWidth="3" />
          <path d={dn} fill="none" stroke={palette.gold} strokeWidth="2" strokeDasharray="7 5" />
          <line x1={XBif(0)} y1={YBif(0)} x2={XBif(1)} y2={YBif(0)} stroke={palette.teal} strokeWidth="3" />
          <text
            x={XBif(0) + 8}
            y={(YBif(onB0Val) - 10).toFixed(1)}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.red}
          >
            on: latched
          </text>
          <text
            x={XBif(0) + 8}
            y={(YBif(0) - 8).toFixed(1)}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            off: powered down
          </text>

          <circle
            cx={XBif(s).toFixed(1)}
            cy={YBif(Math.min(B, Bmax_bif)).toFixed(1)}
            r="8"
            fill={palette.accent}
            stroke={palette.wire}
            strokeWidth="2"
          />
        </svg>
        <p style={{margin: '8px 0 0', fontSize: 13, color: palette.ink2, lineHeight: 1.45}}>
          Solid lines are states the loop can rest in; the dashed line is the threshold between
          them. Left of s*, both the on state and the off state are stable, so history decides which
          one holds (hysteresis). Right of s*, only the off state exists: no gate pulse can latch the
          machine.
        </p>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Mode Render (1368 × 828)
// ---------------------------------------------------------------------------
function renderSettings({
  width,
  height,
  s,
  eta,
  lam,
  curI,
  ih,
  sc,
  steadyB,
  mb,
  isLatched,
  modelDefault,
  tokens,
}: {
  width: number;
  height: number;
  s: number;
  eta: number;
  lam: number;
  curI: number;
  ih: number;
  sc: number;
  steadyB: number;
  mb: number | null;
  isLatched: boolean;
  modelDefault: boolean;
  tokens: ReturnType<typeof useTokens>;
}) {
  const cardStyle: React.CSSProperties = {
    background: palette.panel,
    border: `1px solid ${palette.rule}`,
    borderRadius: 8,
    padding: '14px 18px',
    boxSizing: 'border-box',
  };

  const h2Style: React.CSSProperties = {
    fontFamily: tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: palette.labelSm,
    margin: '0 0 10px',
  };

  return (
    <div
      data-settings="Thyristor latch"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: tokens.fonts.sans,
        color: palette.ink,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingBottom: 10,
          borderBottom: `1px solid ${palette.rule}`,
          flexShrink: 0,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div
            style={{
              fontFamily: tokens.fonts.mono,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: palette.ink,
            }}
          >
            SETTINGS · THYRISTOR LATCH
          </div>
          <div style={{fontSize: 12, color: palette.ink2}}>
            Secondary configuration &amp; provenance · Thyristor Latch
          </div>
        </div>

        {modelDefault && (
          <div
            style={{
              fontFamily: tokens.fonts.mono,
              fontSize: 12.5,
              color: palette.gold,
              padding: '6px 10px',
              background: palette.well,
              borderRadius: 6,
              border: `1px solid ${palette.rule}`,
            }}
          >
            Model default: this log does not set this instrument.
          </div>
        )}
      </header>

      {/* Two Columns: Model Parameters (Left) & Verbatim Assumptions (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '500px minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Model Parameters */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <section style={cardStyle}>
            <h2 style={h2Style}>Model parameters (read-only)</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{fontFamily: tokens.fonts.mono, fontWeight: 500, color: palette.ink}}>
                    s
                  </span>{' '}
                  <span style={{fontSize: 12.5, color: palette.ink2}}>
                    share routed to Out-group’s own grid
                  </span>
                </div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.ink}}>
                  {f(s)}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{fontFamily: tokens.fonts.mono, fontWeight: 500, color: palette.ink}}>
                    η
                  </span>{' '}
                  <span style={{fontSize: 12.5, color: palette.ink2}}>
                    feedback efficiency (media, campaigns, policing)
                  </span>
                </div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.ink}}>
                  {f(eta)}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{fontFamily: tokens.fonts.mono, fontWeight: 500, color: palette.ink}}>
                    λ
                  </span>{' '}
                  <span style={{fontSize: 12.5, color: palette.ink2}}>
                    field decay / yr
                  </span>
                </div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.ink}}>
                  {f(lam)}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{fontFamily: tokens.fonts.mono, fontWeight: 500, color: palette.ink}}>
                    <MathText>{'E_0'}</MathText>
                  </span>{' '}
                  <span style={{fontSize: 12.5, color: palette.ink2}}>
                    baseline extraction scale (fixed)
                  </span>
                </div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.ink}}>
                  {f(E0)}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div>
                  <span style={{fontFamily: tokens.fonts.mono, fontWeight: 500, color: palette.ink}}>
                    K
                  </span>{' '}
                  <span style={{fontSize: 12.5, color: palette.ink2}}>
                    compliance half-saturation constant (fixed)
                  </span>
                </div>
                <div style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.ink}}>
                  {f(K)}
                </div>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={h2Style}>Derived thresholds &amp; equilibria</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>
                  Critical share <MathText>{'s^* = 1 - 2\\lambda K/(\\eta E_0)'}</MathText>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.teal}}>
                  {f(sc)}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>
                  Holding current <MathText>{'I_H = \\lambda K/\\eta'}</MathText>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.red}}>
                  {f(ih)}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>
                  On-state field <MathText>{'B_{on}'}</MathText>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.gold}}>
                  {f(steadyB)}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>
                  Latch threshold <MathText>{'B_{threshold}'}</MathText>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.gold}}>
                  {mb != null ? f(mb) : 'None'}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>
                  Extraction current <MathText>{'I(B_{on})'}</MathText>
                </span>
                <span style={{fontFamily: tokens.fonts.mono, fontSize: 13, color: palette.accent}}>
                  {f(curI)}
                </span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 12.5, color: palette.ink2}}>Loop status</span>
                <span
                  style={{
                    fontFamily: tokens.fonts.mono,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isLatched ? palette.red : palette.teal,
                  }}
                >
                  {isLatched ? 'LATCHED' : 'RELEASED'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Verbatim Sources and Manuscript Line References */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <section style={cardStyle}>
            <h2 style={h2Style}>What the page assumes</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <p style={{margin: 0, fontSize: 13.5, lineHeight: 1.5, color: palette.ink2}}>
                From the manuscript: the self-exciting field, ∂B/∂t = η·(extraction) − λB (eq. 0.1a,{' '}
                <code style={{fontFamily: tokens.fonts.mono, fontSize: 12.5, color: palette.labelSm}}>
                  Paper/The_Original_Power.tex:474
                </code>
                ); the reinforcing extraction loop and the Parasitic System Collapse Theorem, where
                routing energy through local, open-source grids severs <MathText>{'V_{cc}'}</MathText> and
                the holding current <MathText>{'I_H'}</MathText> drops (
                <code style={{fontFamily: tokens.fonts.mono, fontSize: 12.5, color: palette.labelSm}}>
                  :14412
                </code>
                –
                <code style={{fontFamily: tokens.fonts.mono, fontSize: 12.5, color: palette.labelSm}}>
                  :14440
                </code>
                ); the enforcement nodes as the holding current of the extraction machine (
                <code style={{fontFamily: tokens.fonts.mono, fontSize: 12.5, color: palette.labelSm}}>
                  :12222
                </code>
                ).
              </p>
              <p style={{margin: 0, fontSize: 13.5, lineHeight: 1.5, color: palette.ink2}}>
                The page adds one assumption. Eq. 0.1a is linear: with a fixed extraction term, the
                field settles at η·E/λ and reaches zero only when extraction stops completely. A
                latch needs feedback in the other direction too. Here, extraction depends on the
                field, because compliance depends on it: I = (1 − s)·E₀·B²/(B² + K²). With that, the
                loop has a threshold. The on state exists only while η(1 − s)E₀ ≥ 2λK, so the critical
                share is s* = 1 − 2λK/(ηE₀), and the holding current is <MathText>{'I_H'}</MathText> =
                λK/η, the current at the fold. E₀ = 1 and K = 1; time is in years. The values are
                illustrative.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={h2Style}>Runtime log &amp; era mapping</h2>
            <p style={{margin: 0, fontSize: 13.5, lineHeight: 1.5, color: palette.ink2}}>
              Runtime Log / Era Mapping: This instrument has no log input in yt02/dashboard_eras.json.
              A driver could pulse the gate when system_stress.level is CRITICAL (logs 3, 14, 15) or
              when rho_tau_crash is set (log 3), and raise s as ρ_τ approaches 1. Because this mapping
              rule is unapproved by the author, model defaults are retained.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive View (Used ONLY when props.interactive === true)
// ---------------------------------------------------------------------------
function InteractiveThyristorLatchView(props: ThyristorLatchViewProps) {
  const tokens = useTokens();
  const {mode, width, height, era} = props;
  const eraData = thyristorLatchFromEra(era);

  const [s, setS] = useState(eraData.s);
  const [eta, setEta] = useState(eraData.eta);
  const [lam, setLam] = useState(eraData.lam);

  const [B, setB] = useState<number>(() => onB(eraData.s, eraData.eta, eraData.lam) ?? 0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stateRef = useRef({
    B: onB(eraData.s, eraData.eta, eraData.lam) ?? 0,
    t: 0,
    gate: 0,
    pulses: [] as number[],
    hist: [] as {t: number; I: number; B: number}[],
  });

  // Initialize history
  if (stateRef.current.hist.length === 0) {
    const initB = stateRef.current.B;
    const initI = cur(initB, s);
    for (let k = 0; k <= WIN / DT / 5; k++) {
      stateRef.current.hist.push({t: -WIN + k * DT * 5, I: initI, B: initB});
    }
  }

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    let acc = 0;

    const tick = () => {
      if (isPlaying) {
        const st = stateRef.current;
        for (let k = 0; k < 6; k++) {
          const gin = st.gate > 0 ? GATE / 0.5 : 0;
          if (st.gate > 0) st.gate -= DT;
          const currentCur = cur(st.B, s);
          const dB = eta * currentCur + gin - lam * st.B;
          st.B = Math.max(0, st.B + DT * dB);
          st.t += DT;
          acc++;
          if (acc % 5 === 0) {
            st.hist.push({t: st.t, I: cur(st.B, s), B: st.B});
          }
        }
        while (st.hist.length && st.hist[0].t < st.t - WIN) st.hist.shift();
        while (st.pulses.length && st.pulses[0] < st.t - WIN) st.pulses.shift();
        setB(st.B);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, s, eta, lam]);

  const handleGatePulse = () => {
    const st = stateRef.current;
    st.gate = 0.5;
    st.pulses.push(st.t);
    if (!isPlaying) {
      for (let k = 0; k < 60; k++) {
        const gin = st.gate > 0 ? GATE / 0.5 : 0;
        if (st.gate > 0) st.gate -= DT;
        const dB = eta * cur(st.B, s) + gin - lam * st.B;
        st.B = Math.max(0, st.B + DT * dB);
        st.t += DT;
      }
      st.hist.push({t: st.t, I: cur(st.B, s), B: st.B});
      setB(st.B);
    }
  };

  const handleReset = () => {
    setS(0.1);
    setEta(1.0);
    setLam(0.3);
    const initB = onB(0.1, 1.0, 0.3) ?? 0;
    const initI = cur(initB, 0.1);
    const st = stateRef.current;
    st.B = initB;
    st.t = 0;
    st.gate = 0;
    st.pulses = [];
    st.hist = [];
    for (let k = 0; k <= WIN / DT / 5; k++) {
      st.hist.push({t: -WIN + k * DT * 5, I: initI, B: initB});
    }
    setB(initB);
  };

  const curI = cur(B, s);
  const ih = IH(eta, lam);
  const sc = scrit(eta, lam);
  const mb = midB(s, eta, lam);
  const isLatched = latched(B, s, eta, lam);

  if (mode === 'compact') {
    return renderCompact({width, height, isLatched, curI, ih, s, sc, tokens});
  }

  if (mode === 'settings') {
    return renderSettings({
      width,
      height,
      s,
      eta,
      lam,
      curI,
      ih,
      sc,
      steadyB: B,
      mb,
      isLatched,
      modelDefault: eraData.modelDefault,
      tokens,
    });
  }

  // Expanded interactive
  const cardStyle: React.CSSProperties = {
    background: palette.panel,
    border: `1px solid ${palette.rule}`,
    borderRadius: 10,
    padding: '14px 16px',
    boxSizing: 'border-box',
    minWidth: 0,
  };

  const h2Style: React.CSSProperties = {
    fontFamily: tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: palette.labelSm,
    margin: '0 0 8px',
  };

  let verdictText = '';
  if (isLatched) {
    verdictText =
      'The field is above the latch threshold and the current stays above I_H, so the latch holds. The field the extraction funds keeps the extraction flowing.';
  } else if (s > sc) {
    verdictText = `Released. With ${Math.round(100 * s)}% of the supply on the Out-group’s own grid, no on state exists: a gate pulse lifts the field for a moment, and then it decays.`;
  } else {
    verdictText =
      'Released, and the off state holds even though s is below s*. The machine stays down until the Elite fire the gate hard enough to cross the latch threshold.';
  }

  // Strip chart calculations
  const W_strip = 900;
  const H_strip = 470;
  const L_strip = 60;
  const Rr_strip = 20;
  const T_strip = 24;
  const mid_strip = 250;
  const B2_strip = 40;
  const Imax = 1.05;
  const Bmax_strip = Math.max(3.5, (onB(s, eta, lam) || 0) * 1.1);

  const tNow = stateRef.current.t;
  const X_strip = (tVal: number) => L_strip + ((tVal - (tNow - WIN)) / WIN) * (W_strip - L_strip - Rr_strip);
  const YI = (iVal: number) => T_strip + ((Imax - iVal) / Imax) * (mid_strip - T_strip - 20);
  const YB = (bVal: number) => mid_strip + 20 + ((Bmax_strip - bVal) / Bmax_strip) * (H_strip - B2_strip - mid_strip - 20);

  let dI = '';
  let dB = '';
  stateRef.current.hist.forEach((p, idx) => {
    dI += (idx ? 'L' : 'M') + X_strip(p.t).toFixed(1) + ' ' + YI(p.I).toFixed(1);
    dB += (idx ? 'L' : 'M') + X_strip(p.t).toFixed(1) + ' ' + YB(p.B).toFixed(1);
  });

  // Bifurcation paths
  const W_bif = 1200;
  const H_bif = 360;
  const L_bif = 70;
  const Rr_bif = 30;
  const T_bif = 24;
  const B_bif = 50;
  const Bmax_bif = Math.max(4, (eta * E0 / lam) * 1.05);

  const XBif = (sVal: number) => L_bif + sVal * (W_bif - L_bif - Rr_bif);
  const YBif = (bVal: number) => T_bif + ((Bmax_bif - bVal) / Bmax_bif) * (H_bif - T_bif - B_bif);

  const {up, dn} = getBifPaths(sc, eta, lam, XBif, YBif);
  const onB0Val = onB0(eta, lam);

  const br = 12 + 18 * Math.min(1, B / 3.2);
  const wWire = (1.5 + 6 * curI).toFixed(1);
  const wSnubber = (1.5 + 6 * s).toFixed(1);

  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '12px 16px',
        fontFamily: tokens.fonts.sans,
        color: palette.ink,
      }}
    >
      <style>{`
        @keyframes thyristorFlow { to { stroke-dashoffset: -28px; } }
        .thyristor-flow { animation: thyristorFlow 1s linear infinite; }
      `}</style>

      {/* Header */}
      <header style={{flexShrink: 0}}>
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1.2,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
            color: palette.ink,
          }}
        >
          Thyristor Latch
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.45,
            color: palette.ink2,
            maxWidth: '110ch',
          }}
        >
          A thyristor stays on after its gate pulse ends, as long as the current through it stays
          above the holding current <MathText>{'I_H'}</MathText>. The Elite&apos;s extraction loop
          latches the same way: extraction funds the cultural field B (eq. 0.1a), and the field
          keeps the extraction flowing. When the Out-group routes enough of its energy through its
          own grid, the current falls below <MathText>{'I_H'}</MathText> and the machine powers
          down (Parasitic System Collapse Theorem).
        </p>
      </header>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Card 1: Circuit schematic + controls */}
        <section style={cardStyle} aria-label="Circuit and controls">
          <h2 style={h2Style}>The self-exciting loop</h2>
          <svg
            viewBox="0 0 640 330"
            role="img"
            aria-label="The Out-group's supply feeds extraction through the Elite's latch; a feedback tap funds the field; a snubber grid diverts a share of the supply"
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            <defs>
              <marker
                id="thyristor-ar-interactive"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="9"
                markerHeight="9"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={palette.wire} />
              </marker>
            </defs>

            {/* Out-group supply rail */}
            <rect x="24" y="130" width="120" height="70" rx="8" fill="none" stroke={palette.teal} strokeWidth="2" />
            <text x="84" y="160" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              Out-group
            </text>
            <text x="84" y="180" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              <MathText svg>{'V_{cc}'}</MathText> rail
            </text>

            {/* Wire to SCR */}
            <path
              d="M144 165 H300"
              fill="none"
              stroke={palette.accent}
              strokeWidth={wWire}
              strokeDasharray="14 14"
              className="thyristor-flow"
            />

            {/* SCR symbol */}
            <path
              d="M300 140 L300 190 L345 165 Z"
              fill={isLatched ? palette.red : palette.dim}
            />
            <line
              x1="345"
              y1="138"
              x2="345"
              y2="192"
              stroke={isLatched ? palette.red : palette.dim}
              strokeWidth="4"
            />
            <line x1="345" y1="165" x2="372" y2="190" stroke={palette.gold} strokeWidth="3" />
            <text x="322" y="126" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              Elite latch
            </text>
            <text x="384" y="208" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.gold}>
              gate
            </text>

            {/* Extracted wealth */}
            <path
              d="M345 165 H520"
              fill="none"
              stroke={palette.accent}
              strokeWidth={wWire}
              strokeDasharray="14 14"
              className="thyristor-flow"
            />
            <rect x="520" y="130" width="100" height="70" rx="8" fill="none" stroke={palette.red} strokeWidth="2" />
            <text x="570" y="160" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              extracted
            </text>
            <text x="570" y="180" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.red}>
              wealth
            </text>

            {/* Feedback tap to field */}
            <path
              d="M570 130 V60 H190"
              fill="none"
              stroke={palette.wire}
              strokeWidth="2"
              markerEnd="url(#thyristor-ar-interactive)"
            />
            <text x="400" y="50" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.wire}>
              feedback tap η: media, campaigns, policing
            </text>

            {/* Field B circle */}
            <circle cx="160" cy="60" r={br.toFixed(1)} fill="none" stroke={palette.gold} strokeWidth="2.5" />
            <text x="160" y="66" textAnchor="middle" fontStyle="italic" fontSize="18" fontFamily="serif" fill={palette.gold}>
              B
            </text>
            <path
              d={`M${(160 + br * 0.7).toFixed(1)} ${(60 + br * 0.7).toFixed(1)} C 150 230 330 240 368 194`}
              fill="none"
              stroke={palette.gold}
              strokeWidth="2"
              strokeDasharray="4 4"
              markerEnd="url(#thyristor-ar-interactive)"
            />
            <text x="40" y="20" fontSize="12" fontFamily={tokens.fonts.mono} fill={palette.ink2}>
              field holds compliance
            </text>

            {/* Snubber diversion */}
            <path
              d="M84 200 V280 H300"
              fill="none"
              stroke={palette.teal}
              strokeWidth={wSnubber}
              strokeDasharray="14 14"
              className="thyristor-flow"
            />
            <rect x="300" y="250" width="200" height="60" rx="8" fill="none" stroke={palette.teal} strokeWidth="2" />
            <text x="400" y="276" textAnchor="middle" fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.teal}>
              snubber grid
            </text>
            <text x="400" y="296" textAnchor="middle" fontSize="12" fontFamily={tokens.fonts.mono} fill={palette.ink2}>
              share s = {Math.round(100 * s)}%
            </text>
          </svg>

          {/* Interactive Sliders */}
          <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6}}>
            <div style={{display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 50px', gap: 10, alignItems: 'center'}}>
              <label htmlFor="s-slider-s" style={{fontSize: 13, color: palette.ink}}>
                <i>s</i> routed to own grid
              </label>
              <input
                id="s-slider-s"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={s}
                onChange={e => setS(parseFloat(e.target.value))}
                style={{accentColor: palette.wire, cursor: 'pointer'}}
              />
              <output style={{fontFamily: tokens.fonts.mono, fontSize: 13, textAlign: 'right', color: palette.ink}}>
                {f(s)}
              </output>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 50px', gap: 10, alignItems: 'center'}}>
              <label htmlFor="s-slider-eta" style={{fontSize: 13, color: palette.ink}}>
                <i>η</i> feedback efficiency
              </label>
              <input
                id="s-slider-eta"
                type="range"
                min="0.4"
                max="2"
                step="0.01"
                value={eta}
                onChange={e => setEta(parseFloat(e.target.value))}
                style={{accentColor: palette.wire, cursor: 'pointer'}}
              />
              <output style={{fontFamily: tokens.fonts.mono, fontSize: 13, textAlign: 'right', color: palette.ink}}>
                {f(eta)}
              </output>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 50px', gap: 10, alignItems: 'center'}}>
              <label htmlFor="s-slider-lam" style={{fontSize: 13, color: palette.ink}}>
                <i>λ</i> field decay / yr
              </label>
              <input
                id="s-slider-lam"
                type="range"
                min="0.1"
                max="0.6"
                step="0.01"
                value={lam}
                onChange={e => setLam(parseFloat(e.target.value))}
                style={{accentColor: palette.wire, cursor: 'pointer'}}
              />
              <output style={{fontFamily: tokens.fonts.mono, fontSize: 13, textAlign: 'right', color: palette.ink}}>
                {f(lam)}
              </output>
            </div>

            <div style={{display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap'}}>
              <button
                type="button"
                onClick={handleGatePulse}
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: `1px solid ${palette.red}`,
                  background: palette.well,
                  color: palette.red,
                  cursor: 'pointer',
                }}
              >
                Gate pulse (manufactured crisis)
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: `1px solid ${palette.rule}`,
                  background: palette.well,
                  color: palette.ink,
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: `1px solid ${palette.rule}`,
                  background: palette.well,
                  color: palette.ink,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
            <p style={{margin: '6px 0 0', fontSize: 12.5, color: palette.ink2, lineHeight: 1.4}}>
              Try it: raise <i>s</i> slowly until the latch releases, then lower it again. The
              machine stays off until the Elite fire the gate, and the gate fails while <i>s</i>{' '}
              stays above the critical share.
            </p>
          </div>
        </section>

        {/* Card 2: Strip Chart */}
        <section style={cardStyle} aria-label="Current and field over time">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
            <h2 style={{...h2Style, margin: 0}}>Current through the latch</h2>
            <span
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: 4,
                border: `1px solid ${isLatched ? palette.red : palette.teal}`,
                color: isLatched ? palette.red : palette.teal,
              }}
            >
              {isLatched ? 'LATCHED' : 'RELEASED'}
            </span>
          </div>

          <svg
            viewBox="0 0 900 470"
            role="img"
            aria-label="Extraction current and holding current over the last 60 years"
            style={{display: 'block', width: '100%', height: 'auto'}}
          >
            <text x={L_strip} y={T_strip - 6} fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.labelSm}>
              extraction current I
            </text>
            <text x={L_strip} y={mid_strip + 14} fontSize="13" fontFamily={tokens.fonts.mono} fill={palette.labelSm}>
              cultural field B
            </text>
            <line x1={L_strip} y1={YI(0)} x2={W_strip - Rr_strip} y2={YI(0)} stroke={palette.wire} strokeWidth="1.4" />
            <line x1={L_strip} y1={YB(0)} x2={W_strip - Rr_strip} y2={YB(0)} stroke={palette.wire} strokeWidth="1.4" />

            <line
              x1={L_strip}
              y1={YI(ih).toFixed(1)}
              x2={W_strip - Rr_strip}
              y2={YI(ih).toFixed(1)}
              stroke={palette.red}
              strokeWidth="1.6"
              strokeDasharray="8 5"
            />
            <text
              x={W_strip - Rr_strip}
              y={(YI(ih) - 6).toFixed(1)}
              textAnchor="end"
              fontSize="13"
              fontFamily={tokens.fonts.mono}
              fill={palette.red}
            >
              <MathText svg>{'I_H'}</MathText> = {f(ih)}
            </text>

            {mb != null && (
              <>
                <line
                  x1={L_strip}
                  y1={YB(mb).toFixed(1)}
                  x2={W_strip - Rr_strip}
                  y2={YB(mb).toFixed(1)}
                  stroke={palette.gold}
                  strokeWidth="1.2"
                  strokeDasharray="4 5"
                  strokeOpacity="0.7"
                />
                <text
                  x={W_strip - Rr_strip}
                  y={(YB(mb) - 5).toFixed(1)}
                  textAnchor="end"
                  fontSize="12"
                  fontFamily={tokens.fonts.mono}
                  fill={palette.gold}
                >
                  latch threshold
                </text>
              </>
            )}

            {stateRef.current.pulses.map((p, idx) => (
              <g key={idx}>
                <line
                  x1={X_strip(p).toFixed(1)}
                  y1={T_strip}
                  x2={X_strip(p).toFixed(1)}
                  y2={YB(0)}
                  stroke={palette.red}
                  strokeOpacity="0.5"
                />
                <text
                  x={(X_strip(p) + 4).toFixed(1)}
                  y={T_strip + 12}
                  fontSize="11"
                  fontFamily={tokens.fonts.mono}
                  fill={palette.red}
                >
                  gate
                </text>
              </g>
            ))}

            <path d={dI} fill="none" stroke={palette.accent} strokeWidth="2.6" />
            <path d={dB} fill="none" stroke={palette.gold} strokeWidth="2.2" />

            {[0, 10, 20, 30, 40, 50, 60].map(yVal => {
              const xx = X_strip(tNow - WIN + yVal);
              const label = yVal === 60 ? 'now' : `${yVal - 60} yr`;
              return (
                <text
                  key={yVal}
                  x={xx.toFixed(1)}
                  y={H_strip - 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily={tokens.fonts.mono}
                  fill={palette.labelSm}
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* 4 Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '10px 16px',
              marginTop: 10,
            }}
          >
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Current <i>I</i>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(curI)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Holding <MathText>{'I_H'}</MathText>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(ih)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Field <i>B</i>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(B)}
              </div>
            </div>
            <div>
              <div style={{fontSize: 12, color: palette.ink2}}>
                Critical share <MathText>{'s^*'}</MathText>
              </div>
              <div style={{fontFamily: tokens.fonts.mono, fontSize: 15, fontWeight: 500, color: palette.ink}}>
                {f(sc)}
              </div>
            </div>
          </div>

          <p style={{margin: '10px 0 0', fontSize: 13.5, color: palette.ink, lineHeight: 1.4}}>
            {verdictText}
          </p>
        </section>
      </div>

      {/* Card 3: Bifurcation diagram */}
      <section style={cardStyle} aria-label="Bifurcation diagram">
        <h2 style={h2Style}>Where the latch can hold</h2>
        <svg
          viewBox="0 0 1200 360"
          role="img"
          aria-label="Steady-state field B against the routed share s: the on branch, the unstable threshold, and the off state"
          style={{display: 'block', width: '100%', height: 'auto'}}
        >
          <rect
            x={XBif(sc).toFixed(1)}
            y={T_bif}
            width={(XBif(1) - XBif(sc)).toFixed(1)}
            height={H_bif - T_bif - B_bif}
            fill={palette.teal}
            fillOpacity="0.08"
          />
          <text
            x={(XBif(sc) + 10).toFixed(1)}
            y={T_bif + 18}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            s &gt; <MathText svg>{'s^*'}</MathText>: the latch cannot hold
          </text>
          <line
            x1={XBif(sc).toFixed(1)}
            y1={T_bif}
            x2={XBif(sc).toFixed(1)}
            y2={H_bif - B_bif}
            stroke={palette.teal}
            strokeWidth="1.6"
            strokeDasharray="6 4"
          />
          <text
            x={XBif(sc).toFixed(1)}
            y={H_bif - B_bif + 36}
            textAnchor="middle"
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            <MathText svg>{'s^*'}</MathText> = {f(sc)}
          </text>

          {[0, 0.2, 0.4, 0.6, 0.8, 1].map(sVal => (
            <text
              key={sVal}
              x={XBif(sVal)}
              y={H_bif - B_bif + 18}
              textAnchor="middle"
              fontSize="12"
              fontFamily={tokens.fonts.mono}
              fill={palette.labelSm}
            >
              {sVal.toFixed(1)}
            </text>
          ))}
          <text
            x={W_bif - Rr_bif}
            y={H_bif - 6}
            textAnchor="end"
            fontSize="12"
            fontFamily={tokens.fonts.mono}
            fill={palette.labelSm}
          >
            share s routed through the Out-group’s own grid
          </text>
          <text
            x={L_bif - 10}
            y={T_bif + 10}
            textAnchor="end"
            fontStyle="italic"
            fontSize="18"
            fontFamily="serif"
            fill={palette.gold}
          >
            B
          </text>

          <path d={up} fill="none" stroke={palette.red} strokeWidth="3" />
          <path d={dn} fill="none" stroke={palette.gold} strokeWidth="2" strokeDasharray="7 5" />
          <line x1={XBif(0)} y1={YBif(0)} x2={XBif(1)} y2={YBif(0)} stroke={palette.teal} strokeWidth="3" />
          <text
            x={XBif(0) + 8}
            y={(YBif(onB0Val) - 10).toFixed(1)}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.red}
          >
            on: latched
          </text>
          <text
            x={XBif(0) + 8}
            y={(YBif(0) - 8).toFixed(1)}
            fontSize="13"
            fontFamily={tokens.fonts.mono}
            fill={palette.teal}
          >
            off: powered down
          </text>

          <circle
            cx={XBif(s).toFixed(1)}
            cy={YBif(Math.min(B, Bmax_bif)).toFixed(1)}
            r="8"
            fill={palette.accent}
            stroke={palette.wire}
            strokeWidth="2"
          />
        </svg>
        <p style={{margin: '8px 0 0', fontSize: 13, color: palette.ink2, lineHeight: 1.45}}>
          Solid lines are states the loop can rest in; the dashed line is the threshold between
          them. Left of s*, both the on state and the off state are stable, so history decides which
          one holds (hysteresis). Right of s*, only the off state exists: no gate pulse can latch the
          machine.
        </p>
      </section>
    </div>
  );
}
