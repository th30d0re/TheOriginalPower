import React, {useState, type JSX} from 'react';
import {MathText, useTokens, type InstrumentMode} from '@stage';
import {color, Tokens} from '../../tokens';
import rawSourcedShocks from './data/compounding-ledger.json';

export type Shock = {
  k: string;
  y0: number;
  y1: number;
  name: string;
  short: string;
  f: number;
  src: string;
};

export const SOURCED_SHOCKS: readonly Shock[] = rawSourcedShocks as readonly Shock[];

export type CompoundingLedgerInputs = {
  modelDefault: boolean;
  factors: [number, number, number, number];
  scale: 'log' | 'lin';
  order: [number, number, number, number];
  ratio: number;
  lam: number;
  activeShocksCount: number;
};

export type CompoundingLedgerViewProps = {
  mode: InstrumentMode;
  width: number;
  height: number;
  interactive: boolean;
  era?: {log: number; fields: Record<string, unknown>};
};

export function compoundingLedgerFromEra(
  era?: {log: number; fields: Record<string, unknown>},
): CompoundingLedgerInputs {
  const baseDefaults: Omit<CompoundingLedgerInputs, 'modelDefault' | 'activeShocksCount'> = {
    factors: [0.09, 0.61, 0.48, 0.73],
    scale: 'log',
    order: [0, 1, 2, 3],
    ratio: 3.73,
    lam: 0.5,
  };

  if (!era) {
    return {
      modelDefault: true,
      activeShocksCount: 4,
      ...baseDefaults,
    };
  }

  // Catalogue: log 5 (1704–1865) → enslavement;
  // log 9 (1894–1965) → 13th Amendment and redlining;
  // logs 14, 15, 17 → War on Drugs.
  // Log 2 (1486) predates 1619 (pre-racialization baseline = 1.0).
  // Log 3 (1676–1787) is within enslavement era.
  switch (era.log) {
    case 2:
      return {
        modelDefault: true,
        activeShocksCount: 0,
        ...baseDefaults,
      };
    case 3:
      return {
        modelDefault: false,
        activeShocksCount: 1,
        ...baseDefaults,
      };
    case 5:
      return {
        modelDefault: false,
        activeShocksCount: 1,
        ...baseDefaults,
      };
    case 9:
      return {
        modelDefault: false,
        activeShocksCount: 3,
        ...baseDefaults,
      };
    case 14:
    case 15:
    case 17:
      return {
        modelDefault: false,
        activeShocksCount: 4,
        ...baseDefaults,
      };
    default:
      return {
        modelDefault: true,
        activeShocksCount: 4,
        ...baseDefaults,
      };
  }
}

export function computeChain(order: readonly number[], factors: readonly number[]): number[] {
  const v = [1.0];
  for (const idx of order) {
    v.push(v[v.length - 1] * factors[idx]);
  }
  return v;
}

export function fx(v: number): string {
  if (v >= 0.1) return v.toFixed(2);
  if (v >= 0.01) return v.toFixed(3);
  return v.toPrecision(2);
}

// Module-level memoization for erfcx and Mittag-Leffler
const erfcxMemoryCache = new Map<number, {d1: string; d2: string; e6: number; m6: number}>();

export function erfcx(x: number): number {
  const t = 1 / (1 + 0.5 * x);
  return (
    t *
    Math.exp(
      -1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t *
                                      (-0.82215223 +
                                        t * 0.17087277))))))))
    )
  );
}

export function ml(lam: number, t: number): number {
  return erfcx(lam * Math.sqrt(t));
}

export function getMemoryPlotData(lam: number): {d1: string; d2: string; e6: number; m6: number} {
  const cached = erfcxMemoryCache.get(lam);
  if (cached) return cached;

  const W = 700;
  const H = 300;
  const L = 50;
  const Rr = 20;
  const T = 20;
  const B = 44;
  const G = 12;

  const X = (g: number) => L + (g / G) * (W - L - Rr);
  const Y = (v: number) => T + (1 - v) * (H - T - B);

  let d1 = '';
  let d2 = '';
  for (let i = 0; i <= 240; i++) {
    const t = (G * i) / 240;
    d1 += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(Math.exp(-lam * t)).toFixed(1);
    d2 += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(ml(lam, t)).toFixed(1);
  }

  const result = {
    d1,
    d2,
    e6: Math.exp(-lam * 6),
    m6: ml(lam, 6),
  };
  erfcxMemoryCache.set(lam, result);
  return result;
}

const PALETTE = {
  green: '#7CC08A',
  red: '#E0604A',
  teal: '#4CC2C2',
  dim: '#4A5566',
};

const ORDERS: readonly [readonly [number, number, number, number], string][] = [
  [[0, 1, 2, 3], 'Historical'],
  [[3, 2, 1, 0], 'Reversed'],
  [[2, 3, 0, 1], 'Redlining first'],
  [[1, 3, 2, 0], 'Enslavement last'],
] as const;

export function CompoundingLedgerView(props: CompoundingLedgerViewProps): JSX.Element {
  if (props.interactive) {
    return <InteractiveCompoundingLedgerView {...props} />;
  }
  return <StaticCompoundingLedgerView {...props} />;
}

/* =========================================================================
   STATIC VIEW (No React hooks called: deterministic SSR)
   ========================================================================= */

function StaticCompoundingLedgerView(props: CompoundingLedgerViewProps): JSX.Element {
  const inputs = compoundingLedgerFromEra(props.era);

  if (props.mode === 'compact') {
    return <CompactView inputs={inputs} width={props.width} height={props.height} />;
  }

  if (props.mode === 'settings') {
    return <SettingsView inputs={inputs} width={props.width} height={props.height} />;
  }

  return (
    <ExpandedView
      inputs={inputs}
      width={props.width}
      height={props.height}
      interactive={false}
    />
  );
}

/* =========================================================================
   INTERACTIVE VIEW (Client-side interactive state)
   ========================================================================= */

function InteractiveCompoundingLedgerView(props: CompoundingLedgerViewProps): JSX.Element {
  const defaultInputs = compoundingLedgerFromEra(props.era);

  const [scale, setScale] = useState<'log' | 'lin'>(defaultInputs.scale);
  const [factors, setFactors] = useState<[number, number, number, number]>(defaultInputs.factors);
  const [ratio, setRatio] = useState<number>(defaultInputs.ratio);
  const [lam, setLam] = useState<number>(defaultInputs.lam);
  const [orderIdx, setOrderIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'asym' | 'latent' | 'order' | 'mem' | 'table'>('asym');

  const currentInputs: CompoundingLedgerInputs = {
    modelDefault: defaultInputs.modelDefault,
    scale,
    factors,
    ratio,
    lam,
    order: ORDERS[orderIdx][0] as [number, number, number, number],
    activeShocksCount: defaultInputs.activeShocksCount,
  };

  if (props.mode === 'compact') {
    return <CompactView inputs={currentInputs} width={props.width} height={props.height} />;
  }

  if (props.mode === 'settings') {
    return <SettingsView inputs={currentInputs} width={props.width} height={props.height} />;
  }

  return (
    <ExpandedView
      inputs={currentInputs}
      width={props.width}
      height={props.height}
      interactive={true}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onScaleChange={setScale}
      onRatioChange={setRatio}
      onLamChange={setLam}
      onOrderChange={setOrderIdx}
      selectedOrderIdx={orderIdx}
      onFactorChange={(index, val) => {
        const next: [number, number, number, number] = [...factors];
        next[index] = val;
        setFactors(next);
      }}
      onResetFactors={() => {
        setFactors([0.09, 0.61, 0.48, 0.73]);
      }}
    />
  );
}

/* =========================================================================
   COMPACT VIEW (177 × 80 content box)
   ========================================================================= */

function CompactView({
  inputs,
  width,
  height,
}: {
  inputs: CompoundingLedgerInputs;
  width: number;
  height: number;
}): JSX.Element {
  const chain = computeChain(inputs.order, inputs.factors);
  const activeCount = inputs.activeShocksCount;
  const currentVal = chain[activeCount];
  const percentStripped = Math.round(1000 * (1 - currentVal)) / 10;

  // 5-step descending staircase
  const W = 88;
  const H = 48;
  const n = 5;
  const bw = 13.5;
  const gap = (W - n * bw) / (n - 1);
  const lo = Math.log10(0.005);

  const Y = (x: number) => {
    const l = Math.log10(Math.max(x, 0.005));
    return 4 + ((0 - l) / (0 - lo)) * (H - 10);
  };

  const yBase = Y(0.005);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: Tokens.fonts.mono,
        boxSizing: 'border-box',
        padding: '2px 4px 2px 2px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.06em',
          color: color('color/text/dim'),
          lineHeight: '13px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        COMPOUNDING LEDGER
      </div>

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
          viewBox={`0 0 ${W} ${H}`}
          style={{width: W, height: H, display: 'block', flexShrink: 0}}
          aria-label="Compact staircase of remaining capacity"
        >
          {chain.map((val, i) => {
            const x = i * (bw + gap);
            const yv = Y(val);
            const barH = Math.max(2, yBase - yv);
            const isActive = i <= activeCount;

            const barFill =
              i === 0
                ? PALETTE.green
                : i === n - 1
                ? color('color/fill/accent')
                : PALETTE.teal;

            return (
              <g key={i}>
                <rect
                  x={x.toFixed(1)}
                  y={yv.toFixed(1)}
                  width={bw.toFixed(1)}
                  height={barH.toFixed(1)}
                  fill={isActive ? barFill : 'none'}
                  stroke={isActive ? 'none' : color('color/line/hairline')}
                  strokeWidth={isActive ? 0 : 1}
                  fillOpacity={isActive ? (i === 0 ? 0.75 : 0.88) : 0.2}
                />
              </g>
            );
          })}
        </svg>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: activeCount === 0 ? PALETTE.green : color('color/fill/accent'),
              lineHeight: '18px',
              letterSpacing: '-0.02em',
            }}
          >
            O {fx(currentVal)}
          </div>
          <div
            style={{
              fontSize: 10,
              color: color('color/text/muted'),
              lineHeight: '13px',
              marginTop: 2,
            }}
          >
            {activeCount === 0 ? 'baseline' : `-${percentStripped}%`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   EXPANDED VIEW (1368 × 828 content box)
   ========================================================================= */

function ExpandedView({
  inputs,
  width,
  height,
  interactive,
  activeTab = 'asym',
  onTabChange,
  onScaleChange,
  onRatioChange,
  onLamChange,
  onOrderChange,
  selectedOrderIdx = 0,
  onFactorChange,
  onResetFactors,
}: {
  inputs: CompoundingLedgerInputs;
  width: number;
  height: number;
  interactive: boolean;
  activeTab?: 'asym' | 'latent' | 'order' | 'mem' | 'table';
  onTabChange?: (tab: 'asym' | 'latent' | 'order' | 'mem' | 'table') => void;
  onScaleChange?: (scale: 'log' | 'lin') => void;
  onRatioChange?: (ratio: number) => void;
  onLamChange?: (lam: number) => void;
  onOrderChange?: (idx: number) => void;
  selectedOrderIdx?: number;
  onFactorChange?: (index: number, val: number) => void;
  onResetFactors?: () => void;
}): JSX.Element {
  const chain = computeChain(inputs.order, inputs.factors);
  const term = chain[chain.length - 1];
  const percentStripped = Math.round(1000 * (1 - term)) / 10;
  const sumLoss = inputs.factors.reduce((a, f) => a + (1 - f), 0);
  const lossRemaining = 1 - sumLoss;

  const cardStyle: React.CSSProperties = {
    background: color('color/surface/1'),
    border: `1px solid ${color('color/line/chart')}`,
    borderRadius: 8,
    padding: '14px 16px',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: Tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: color('color/text/dim'),
    margin: '0 0 8px 0',
  };

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        color: color('color/text/primary'),
        fontFamily: Tokens.fonts.sans,
        gap: 12,
      }}
    >
      {/* Title & Lede Bar */}
      <div style={{flexShrink: 0}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Compounding Ledger
          </h1>
          <span
            style={{
              fontSize: 12,
              fontFamily: Tokens.fonts.mono,
              color: color('color/text/dim'),
            }}
          >
            <MathText>{'O_t = O_{t−1} · (1 − αP_t)'}</MathText> (eq. 6.5) · Terminal O = {fx(term)} (eq. 6.12)
          </span>
        </div>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: color('color/text/muted'),
            lineHeight: 1.45,
          }}
        >
          Harm compounds; it does not add. Each policy shock multiplies the Out-group&apos;s remaining capacity
          by a retention factor: <MathText>{'O_t = O_{t−1}·(1 − αP_t)'}</MathText> (eq. 6.5). Four sourced shocks take
          a normalized 1450 baseline of 1.0 down to {fx(term)} by the War on Drugs (eq. 6.12).
        </p>
      </div>

      {/* Main 2-Column Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '770px 1fr',
          gap: 14,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left Column: Waterfall & Additive vs Multiplicative Verdict */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 0,
          }}
        >
          {/* Waterfall Card */}
          <div
            style={{
              ...cardStyle,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <div style={headerStyle}>The Compounding Chain</div>
              <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                {interactive ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onScaleChange?.('lin')}
                      style={{
                        padding: '3px 8px',
                        fontSize: 11,
                        fontFamily: Tokens.fonts.mono,
                        background: inputs.scale === 'lin' ? color('color/fill/gold') : color('color/surface/well'),
                        color: inputs.scale === 'lin' ? color('color/bg/field') : color('color/text/primary'),
                        border: `1px solid ${color('color/line/chart')}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Linear scale
                    </button>
                    <button
                      type="button"
                      onClick={() => onScaleChange?.('log')}
                      style={{
                        padding: '3px 8px',
                        fontSize: 11,
                        fontFamily: Tokens.fonts.mono,
                        background: inputs.scale === 'log' ? color('color/fill/gold') : color('color/surface/well'),
                        color: inputs.scale === 'log' ? color('color/bg/field') : color('color/text/primary'),
                        border: `1px solid ${color('color/line/chart')}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Log scale
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: Tokens.fonts.mono,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: color('color/surface/well'),
                      border: `1px solid ${color('color/line/chart')}`,
                      color: color('color/fill/gold'),
                    }}
                  >
                    {inputs.scale === 'log' ? 'Log scale' : 'Linear scale'}
                  </span>
                )}
              </div>
            </div>

            {/* Waterfall SVG */}
            <div style={{flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <WaterfallSvg
                chain={chain}
                scale={inputs.scale}
                factors={inputs.factors}
                activeShocksCount={inputs.activeShocksCount}
              />
            </div>

            <div
              style={{
                fontSize: 11,
                color: color('color/text/muted'),
                marginTop: 4,
                lineHeight: 1.35,
              }}
            >
              Bars show the capacity left after each shock; the grey cap on each bar is the capacity that shock
              removed. On the log scale, every shock with the same retention factor drops the bar by the same height,
              whatever came before.
            </div>
          </div>

          {/* Verdict Card */}
          <div style={{...cardStyle, flexShrink: 0, padding: '12px 16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <div style={{fontSize: 24, fontFamily: Tokens.fonts.mono, fontWeight: 600, color: color('color/fill/accent')}}>
                O = {fx(term)}
              </div>
              <div style={{fontSize: 12, fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
                {percentStripped}% of the baseline stripped
              </div>
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 12.5,
                color: color('color/text/primary'),
                lineHeight: 1.4,
              }}
            >
              An additive model would subtract the losses: 1 − ({inputs.factors.map(f => (1 - f).toFixed(2)).join(' + ')}) ={' '}
              {lossRemaining.toFixed(2)}
              {lossRemaining < 0 ? ', an impossible negative capacity' : ''}. The multiplicative model gives {fx(term)}:
              each shock takes its share of what the earlier shocks left.
            </div>
          </div>
        </div>

        {/* Right Column: Sourced Retention Factors & Secondary Panels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {/* Sourced Factors Card */}
          <div style={{...cardStyle, flexShrink: 0}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <div style={headerStyle}>
                Retention Factors <span style={{textTransform: 'none', letterSpacing: 0}}>(1 − factor)</span>
              </div>
              {interactive && onResetFactors && (
                <button
                  type="button"
                  onClick={onResetFactors}
                  style={{
                    padding: '2px 7px',
                    fontSize: 11,
                    fontFamily: Tokens.fonts.mono,
                    background: color('color/surface/well'),
                    color: color('color/text/primary'),
                    border: `1px solid ${color('color/line/chart')}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Restore sourced
                </button>
              )}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              {SOURCED_SHOCKS.map((s, i) => {
                const currentF = inputs.factors[i];
                return (
                  <div
                    key={s.k}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: interactive ? '1fr 100px 42px' : '1fr 50px',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{fontWeight: 500, color: color('color/text/primary')}}>{s.name}</div>
                      <div style={{fontSize: 11, color: color('color/text/muted')}}>
                        {s.y0}–{s.y1} · {s.src}
                      </div>
                    </div>
                    {interactive ? (
                      <input
                        type="range"
                        min="0.01"
                        max="1.0"
                        step="0.01"
                        value={currentF}
                        onChange={e => onFactorChange?.(i, Number(e.target.value))}
                        style={{width: '100%', accentColor: color('color/text/primary')}}
                      />
                    ) : null}
                    <div
                      style={{
                        fontFamily: Tokens.fonts.mono,
                        fontSize: 12,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: color('color/fill/gold'),
                      }}
                    >
                      ×{currentF.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary Card (Tabs in interactive, or stacked panels in static) */}
          {interactive ? (
            <div style={{...cardStyle, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0}}>
              {/* Tab Header */}
              <div style={{display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap'}}>
                {[
                  {id: 'asym', label: 'Asymmetry'},
                  {id: 'latent', label: 'Latent/SCF'},
                  {id: 'order', label: 'Order'},
                  {id: 'mem', label: 'Memory Gap'},
                  {id: 'table', label: 'Ledger'},
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange?.(tab.id as any)}
                    style={{
                      padding: '3px 8px',
                      fontSize: 11,
                      fontFamily: Tokens.fonts.mono,
                      background: activeTab === tab.id ? color('color/fill/gold') : color('color/surface/well'),
                      color: activeTab === tab.id ? color('color/bg/field') : color('color/text/primary'),
                      border: `1px solid ${color('color/line/chart')}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{flex: 1, minHeight: 0, overflowY: 'auto'}}>
                {activeTab === 'asym' && (
                  <AsymmetrySection
                    ratio={inputs.ratio}
                    warOnDrugsFactor={inputs.factors[3]}
                    interactive={interactive}
                    onRatioChange={onRatioChange}
                  />
                )}
                {activeTab === 'latent' && <LatentSection term={term} />}
                {activeTab === 'order' && (
                  <OrderSection
                    order={inputs.order}
                    factors={inputs.factors}
                    interactive={interactive}
                    selectedOrderIdx={selectedOrderIdx}
                    onOrderChange={onOrderChange}
                  />
                )}
                {activeTab === 'mem' && (
                  <MemorySection
                    lam={inputs.lam}
                    interactive={interactive}
                    onLamChange={onLamChange}
                  />
                )}
                {activeTab === 'table' && <LedgerTableSection factors={inputs.factors} chain={chain} />}
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, flex: 1}}>
              <div style={cardStyle}>
                <AsymmetrySection
                  ratio={inputs.ratio}
                  warOnDrugsFactor={inputs.factors[3]}
                  interactive={false}
                />
              </div>
              <div style={cardStyle}>
                <LatentSection term={term} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   WATERFALL SVG COMPONENT
   ========================================================================= */

function WaterfallSvg({
  chain,
  scale,
  factors,
  activeShocksCount,
}: {
  chain: number[];
  scale: 'log' | 'lin';
  factors: readonly number[];
  activeShocksCount: number;
}): JSX.Element {
  const W = 900;
  const H = 470;
  const L = 70;
  const Rr = 20;
  const T = 30;
  const B = 90;
  const n = 5;
  const bw = ((W - L - Rr) / n) * 0.62;
  const gap = (W - L - Rr) / n;

  const isLog = scale === 'log';
  const lo = Math.log10(0.005);

  const Y = (x: number) => {
    if (isLog) {
      const l = Math.log10(Math.max(x, 0.005));
      return T + ((0 - l) / (0 - lo)) * (H - T - B);
    }
    return T + (1 - x) * (H - T - B);
  };

  const ticks = isLog ? [1, 0.1, 0.01] : [0, 0.25, 0.5, 0.75, 1];
  const labels = ['1450 baseline', ...SOURCED_SHOCKS.map(s => `${s.y1} · ${s.short}`)];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{width: '100%', height: '100%', display: 'block'}}
      role="img"
      aria-label="Waterfall of remaining capacity after each policy shock"
    >
      {/* Ticks and horizontal graticules */}
      {ticks.map(t => {
        const y = Y(t);
        return (
          <g key={t}>
            <line
              x1={L}
              y1={y.toFixed(1)}
              x2={W - Rr}
              y2={y.toFixed(1)}
              stroke={color('color/line/chart')}
              strokeOpacity={0.35}
            />
            <text
              x={L - 8}
              y={(y + 4).toFixed(1)}
              textAnchor="end"
              fontSize={13}
              fontFamily={Tokens.fonts.mono}
              fill={color('color/text/dim')}
            >
              {t}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {Array.from({length: n}).map((_, i) => {
        const x = L + gap * i + (gap - bw) / 2;
        const yv = Y(chain[i]);
        const yb = Y(isLog ? 0.005 : 0);
        const isActive = i <= activeShocksCount;

        const barColor =
          i === 0
            ? PALETTE.green
            : i === n - 1
            ? color('color/fill/accent')
            : PALETTE.teal;

        const isTall = yb - yv > 26;
        const labelParts = labels[i].split(' · ');

        return (
          <g key={i}>
            {/* Removed capacity cap for i > 0 */}
            {i > 0 && (
              <>
                <rect
                  x={x.toFixed(1)}
                  y={Y(chain[i - 1]).toFixed(1)}
                  width={bw.toFixed(1)}
                  height={(yv - Y(chain[i - 1])).toFixed(1)}
                  fill={PALETTE.dim}
                  fillOpacity={0.55}
                />
                <line
                  x1={(x - gap + bw).toFixed(1)}
                  y1={Y(chain[i - 1]).toFixed(1)}
                  x2={x.toFixed(1)}
                  y2={Y(chain[i - 1]).toFixed(1)}
                  stroke={color('color/line/chart')}
                  strokeDasharray="3 3"
                />
                <text
                  x={(x + bw / 2).toFixed(1)}
                  y={(Y(chain[i - 1]) - 8).toFixed(1)}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily={Tokens.fonts.mono}
                  fill={color('color/text/dim')}
                >
                  ×{factors[i - 1].toFixed(2)}
                </text>
              </>
            )}

            {/* Remaining Capacity Bar */}
            <rect
              x={x.toFixed(1)}
              y={yv.toFixed(1)}
              width={bw.toFixed(1)}
              height={Math.max(1, yb - yv).toFixed(1)}
              fill={barColor}
              fillOpacity={isActive ? (i === 0 ? 0.7 : 0.85) : 0.25}
            />

            {/* Value Label */}
            <text
              x={(x + bw / 2).toFixed(1)}
              y={(isTall ? yv + 20 : yv - 8).toFixed(1)}
              textAnchor="middle"
              fontSize={14}
              fontWeight={500}
              fontFamily={Tokens.fonts.mono}
              fill={isTall ? color('color/bg/field') : color('color/text/primary')}
            >
              {fx(chain[i])}
            </text>

            {/* X-axis Labels */}
            <text
              x={(x + bw / 2).toFixed(1)}
              y={H - B + 22}
              textAnchor="middle"
              fontSize={13}
              fontFamily={Tokens.fonts.sans}
              fill={color('color/text/dim')}
            >
              {labelParts[0]}
            </text>
            {labelParts.length > 1 && (
              <text
                x={(x + bw / 2).toFixed(1)}
                y={H - B + 40}
                textAnchor="middle"
                fontSize={12}
                fontFamily={Tokens.fonts.sans}
                fill={color('color/text/muted')}
              >
                {labelParts[1]}
              </text>
            )}
          </g>
        );
      })}

      {/* Baseline caption */}
      <text
        x={L}
        y={H - 12}
        fontSize={12}
        fontFamily={Tokens.fonts.mono}
        fill={color('color/text/muted')}
      >
        O capacity, normalized to the 1450 pre-racialization baseline = 1.0
      </text>
    </svg>
  );
}

/* =========================================================================
   SECONDARY PANELS (Asymmetry, Latent, Order, Memory, Ledger)
   ========================================================================= */

function AsymmetrySection({
  ratio,
  warOnDrugsFactor,
  interactive,
  onRatioChange,
}: {
  ratio: number;
  warOnDrugsFactor: number;
  interactive: boolean;
  onRatioChange?: (ratio: number) => void;
}): JSX.Element {
  const W = 700;
  const H = 250;
  const L = 150;
  const Rr = 60;
  const fo = warOnDrugsFactor;
  const fi = 1 - (1 - fo) / ratio;

  const X = (v: number) => L + v * (W - L - Rr);

  return (
    <div>
      <div
        style={{
          fontFamily: Tokens.fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color('color/text/dim'),
          marginBottom: 6,
        }}
      >
        Same behavior, asymmetric shock
      </div>

      {interactive && onRatioChange ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 12}}>
          <label style={{color: color('color/text/muted')}}>
            Enforcement ratio: Black/white cannabis arrests
          </label>
          <input
            type="range"
            min="1"
            max="9.6"
            step="0.01"
            value={ratio}
            onChange={e => onRatioChange(Number(e.target.value))}
            style={{flex: 1, accentColor: color('color/text/primary')}}
          />
          <output style={{fontFamily: Tokens.fonts.mono, color: color('color/fill/gold'), fontWeight: 600}}>
            {ratio.toFixed(2)}×
          </output>
        </div>
      ) : (
        <div style={{fontSize: 11, color: color('color/text/muted'), marginBottom: 6}}>
          Enforcement ratio: <strong style={{color: color('color/fill/gold')}}>{ratio.toFixed(2)}×</strong> (Black/white cannabis arrests at equal use)
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', height: 'auto', display: 'block'}}>
        <text x={L} y={30} fontSize={13} fontFamily={Tokens.fonts.sans} fill={color('color/text/dim')}>
          War on Drugs retention factor, same behavior
        </text>

        {/* Out-group */}
        <g>
          <text
            x={L - 12}
            y={82}
            textAnchor="end"
            fontSize={14}
            fontFamily={Tokens.fonts.sans}
            fill={color('color/text/primary')}
          >
            Out-group
          </text>
          <rect x={L} y={60} width={X(1) - L} height={34} fill={color('color/surface/well')} />
          <rect
            x={L}
            y={60}
            width={(X(fo) - L).toFixed(1)}
            height={34}
            fill={color('color/fill/accent')}
            fillOpacity={0.85}
          />
          <text
            x={(X(fo) + 8).toFixed(1)}
            y={83}
            fontSize={14}
            fontFamily={Tokens.fonts.mono}
            fill={color('color/text/primary')}
          >
            ×{fo.toFixed(3)}
          </text>
        </g>

        {/* Buffer Class */}
        <g>
          <text
            x={L - 12}
            y={162}
            textAnchor="end"
            fontSize={14}
            fontFamily={Tokens.fonts.sans}
            fill={color('color/text/primary')}
          >
            Buffer Class
          </text>
          <rect x={L} y={140} width={X(1) - L} height={34} fill={color('color/surface/well')} />
          <rect
            x={L}
            y={140}
            width={(X(fi) - L).toFixed(1)}
            height={34}
            fill={PALETTE.teal}
            fillOpacity={0.85}
          />
          <text
            x={(X(fi) + 8).toFixed(1)}
            y={163}
            fontSize={14}
            fontFamily={Tokens.fonts.mono}
            fill={color('color/text/primary')}
          >
            ×{fi.toFixed(3)}
          </text>
        </g>

        <text
          x={L}
          y={H - 14}
          fontSize={12}
          fontFamily={Tokens.fonts.mono}
          fill={color('color/text/muted')}
        >
          loss: {Math.round(100 * (1 - fo))}% against {(100 * (1 - fi)).toFixed(1)}%
        </text>
      </svg>

      <div style={{fontSize: 11, color: color('color/text/muted'), marginTop: 4, lineHeight: 1.35}}>
        <MathText>{'eq. 6.6: α_O P_t ≈ 3.73 · α_{I∖E} P_t'}</MathText>. The page applies the ratio to the War on Drugs shock
        only, the one the manuscript calibrates it on. National ratio 3.73× (2010) and 3.64× (2018); states range from
        about 2.1× to 9.6× (Montana).
      </div>
    </div>
  );
}

function LatentSection({term}: {term: number}): JSX.Element {
  const obs = 44.89 / 285.01;
  const W = 700;
  const H = 260;
  const L = 200;
  const Rr = 70;

  const X = (v: number) => L + (v / 0.2) * (W - L - Rr);

  const rows = [
    {label: 'Latent capacity (chain)', sub: 'chain', val: term, fill: color('color/fill/accent'), y: 50},
    {label: 'Observed wealth ratio (SCF 2022)', sub: 'SCF 2022', val: obs, fill: color('color/fill/gold'), y: 130},
  ];

  return (
    <div>
      <div
        style={{
          fontFamily: Tokens.fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color('color/text/dim'),
          marginBottom: 6,
        }}
      >
        Latent capacity and observed wealth
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', height: 'auto', display: 'block'}}>
        {rows.map((r, idx) => (
          <g key={idx}>
            <text
              x={L - 12}
              y={r.y + 22}
              textAnchor="end"
              fontSize={13}
              fontFamily={Tokens.fonts.sans}
              fill={color('color/text/primary')}
            >
              {r.label.split(' (')[0]}
            </text>
            <text
              x={L - 12}
              y={r.y + 40}
              textAnchor="end"
              fontSize={12}
              fontFamily={Tokens.fonts.sans}
              fill={color('color/text/muted')}
            >
              ({r.sub})
            </text>
            <rect
              x={L}
              y={r.y}
              width={Math.max(2, X(Math.min(r.val, 0.2)) - L).toFixed(1)}
              height={34}
              fill={r.fill}
              fillOpacity={0.85}
            />
            <text
              x={(X(Math.min(r.val, 0.2)) + 8).toFixed(1)}
              y={r.y + 23}
              fontSize={14}
              fontFamily={Tokens.fonts.mono}
              fill={color('color/text/primary')}
            >
              {fx(r.val)}
            </text>
          </g>
        ))}

        {/* Ticks */}
        {[0, 0.05, 0.1, 0.15, 0.2].map(t => (
          <g key={t}>
            <line
              x1={X(t)}
              y1={40}
              x2={X(t)}
              y2={H - 40}
              stroke={color('color/line/chart')}
              strokeOpacity={0.3}
            />
            <text
              x={X(t)}
              y={H - 22}
              textAnchor="middle"
              fontSize={12}
              fontFamily={Tokens.fonts.mono}
              fill={color('color/text/dim')}
            >
              {t}
            </text>
          </g>
        ))}
      </svg>

      <div style={{fontSize: 11, color: color('color/text/muted'), marginTop: 4, lineHeight: 1.35}}>
        The chain&apos;s {fx(term)} is latent capacity before transfers, adaptation, public support, informal economies,
        and partial recovery. The observed ratio is the Federal Reserve SCF 2022 median family wealth: $44.89k Black
        against $285.01k white, 15.75%. The manuscript models the observed ratio as an output transform of the latent
        value, not as the same number.
      </div>
    </div>
  );
}

function OrderSection({
  order,
  factors,
  interactive,
  selectedOrderIdx = 0,
  onOrderChange,
}: {
  order: readonly number[];
  factors: readonly number[];
  interactive: boolean;
  selectedOrderIdx?: number;
  onOrderChange?: (idx: number) => void;
}): JSX.Element {
  const W = 700;
  const H = 340;
  const L = 60;
  const Rr = 44;
  const T = 26;
  const B = 50;
  const lo = Math.log10(0.005);

  const X = (i: number) => L + (i / 4) * (W - L - Rr);
  const Y = (x: number) => T + ((0 - Math.log10(Math.max(x, 0.005))) / (0 - lo)) * (H - T - B);

  const a = computeChain([0, 1, 2, 3], factors);
  const b = computeChain(order, factors);

  let mx = 0;
  for (let i = 1; i < 4; i++) {
    mx = Math.max(mx, Math.abs(Math.log10(a[i] / b[i])));
  }

  const renderPath = (v: number[], strokeColor: string, isDashed: boolean) => {
    let d = '';
    v.forEach((x, i) => {
      d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x).toFixed(1);
    });
    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.6}
          strokeDasharray={isDashed ? '7 5' : undefined}
        />
        {v.map((x, i) => (
          <circle key={i} cx={X(i).toFixed(1)} cy={Y(x).toFixed(1)} r={4.5} fill={strokeColor} />
        ))}
      </g>
    );
  };

  const isHistorical = order.join() === '0,1,2,3';

  return (
    <div>
      <div
        style={{
          fontFamily: Tokens.fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color('color/text/dim'),
          marginBottom: 6,
        }}
      >
        Order changes the path, not the end
      </div>

      {interactive && onOrderChange && (
        <div style={{display: 'flex', gap: 6, marginBottom: 8}}>
          {ORDERS.map((o, idx) => (
            <button
              key={o[1]}
              type="button"
              onClick={() => onOrderChange(idx)}
              style={{
                padding: '3px 8px',
                fontSize: 11,
                fontFamily: Tokens.fonts.mono,
                background: selectedOrderIdx === idx ? color('color/fill/gold') : color('color/surface/well'),
                color: selectedOrderIdx === idx ? color('color/bg/field') : color('color/text/primary'),
                border: `1px solid ${color('color/line/chart')}`,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {o[1]}
            </button>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', height: 'auto', display: 'block'}}>
        {[1, 0.1, 0.01].map(t => (
          <g key={t}>
            <line
              x1={L}
              y1={Y(t)}
              x2={W - Rr}
              y2={Y(t)}
              stroke={color('color/line/chart')}
              strokeOpacity={0.35}
            />
            <text
              x={L - 8}
              y={Y(t) + 4}
              textAnchor="end"
              fontSize={12}
              fontFamily={Tokens.fonts.mono}
              fill={color('color/text/dim')}
            >
              {t}
            </text>
          </g>
        ))}

        {[0, 1, 2, 3, 4].map(i => (
          <text
            key={i}
            x={X(i)}
            y={H - B + 20}
            textAnchor="middle"
            fontSize={12}
            fontFamily={Tokens.fonts.mono}
            fill={color('color/text/dim')}
          >
            {i === 0 ? 'start' : `shock ${i}`}
          </text>
        ))}

        {/* Historical order */}
        {renderPath(a, PALETTE.teal, false)}

        {/* Non-historical order */}
        {!isHistorical && (
          <>
            {renderPath(b, color('color/fill/accent'), true)}
            {order.map((k, i) => (
              <text
                key={i}
                x={X(i + 1).toFixed(1)}
                y={T + 12}
                textAnchor="middle"
                fontSize={11}
                fontFamily={Tokens.fonts.mono}
                fill={color('color/fill/accent')}
              >
                {SOURCED_SHOCKS[k].short}
              </text>
            ))}
          </>
        )}

        <text x={L} y={H - 6} fontSize={12} fontFamily={Tokens.fonts.mono} fill={color('color/text/muted')}>
          teal: historical order · orange: selected order (log scale)
        </text>
      </svg>

      <div style={{fontSize: 11, color: color('color/text/muted'), marginTop: 4, lineHeight: 1.35}}>
        {isHistorical
          ? 'Select another order to compare. Multiplication commutes, so every order ends at the same value; the path to it differs.'
          : `Both orders end at ${fx(b[4])}. On the way, the two paths differ by up to a factor of ${Math.pow(10, mx).toFixed(1)}. That gap is the difference in what each later shock had left to take, and the reason the manuscript calls the sequence non-commutative in its intermediate states (eq. 6.7).`}
      </div>
    </div>
  );
}

function MemorySection({
  lam,
  interactive,
  onLamChange,
}: {
  lam: number;
  interactive: boolean;
  onLamChange?: (lam: number) => void;
}): JSX.Element {
  const W = 700;
  const H = 300;
  const L = 50;
  const Rr = 20;
  const T = 20;
  const B = 44;
  const G = 12;

  const X = (g: number) => L + (g / G) * (W - L - Rr);
  const Y = (v: number) => T + (1 - v) * (H - T - B);

  const {d1, d2, e6, m6} = getMemoryPlotData(lam);

  return (
    <div>
      <div
        style={{
          fontFamily: Tokens.fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color('color/text/dim'),
          marginBottom: 6,
        }}
      >
        The memory gap
      </div>

      {interactive && onLamChange ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 12}}>
          <label style={{color: color('color/text/muted')}}>
            Decay rate λ (per generation)
          </label>
          <input
            type="range"
            min="0.1"
            max="1.2"
            step="0.01"
            value={lam}
            onChange={e => onLamChange(Number(e.target.value))}
            style={{flex: 1, accentColor: color('color/text/primary')}}
          />
          <output style={{fontFamily: Tokens.fonts.mono, color: color('color/fill/gold'), fontWeight: 600}}>
            {lam.toFixed(2)}
          </output>
        </div>
      ) : (
        <div style={{fontSize: 11, color: color('color/text/muted'), marginBottom: 6}}>
          Decay rate λ: <strong style={{color: color('color/fill/gold')}}>{lam.toFixed(2)}</strong> per generation
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', height: 'auto', display: 'block'}}>
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <g key={v}>
            <line
              x1={L}
              y1={Y(v)}
              x2={W - Rr}
              y2={Y(v)}
              stroke={color('color/line/chart')}
              strokeOpacity={0.3}
            />
            <text
              x={L - 8}
              y={Y(v) + 4}
              textAnchor="end"
              fontSize={12}
              fontFamily={Tokens.fonts.mono}
              fill={color('color/text/dim')}
            >
              {v}
            </text>
          </g>
        ))}

        {[0, 2, 4, 6, 8, 10, 12].map(g => (
          <text
            key={g}
            x={X(g)}
            y={H - B + 18}
            textAnchor="middle"
            fontSize={12}
            fontFamily={Tokens.fonts.mono}
            fill={color('color/text/dim')}
          >
            {g}
          </text>
        ))}

        <path d={d1} fill="none" stroke={color('color/text/muted')} strokeWidth={2} strokeDasharray="7 5" />
        <path d={d2} fill="none" stroke={PALETTE.red} strokeWidth={2.8} />

        {/* Generation 6 vertical marker */}
        <line
          x1={X(6)}
          y1={T}
          x2={X(6)}
          y2={H - B}
          stroke={PALETTE.teal}
          strokeDasharray="5 4"
        />
        <text
          x={X(6) + 6}
          y={T + 12}
          fontSize={12}
          fontFamily={Tokens.fonts.sans}
          fill={PALETTE.teal}
        >
          ≈ 6 generations since enslavement
        </text>

        {/* Gap line */}
        <line
          x1={(X(6) + 14).toFixed(1)}
          y1={Y(e6).toFixed(1)}
          x2={(X(6) + 14).toFixed(1)}
          y2={Y(m6).toFixed(1)}
          stroke={PALETTE.red}
          strokeWidth={2}
        />
        <text
          x={(X(6) + 20).toFixed(1)}
          y={((Y(e6) + Y(m6)) / 2 + 4).toFixed(1)}
          fontSize={13}
          fontFamily={Tokens.fonts.sans}
          fill={PALETTE.red}
        >
          memory gap
        </text>

        <text x={L} y={H - 6} fontSize={12} fontFamily={Tokens.fonts.mono} fill={color('color/text/muted')}>
          dashed: e^(−λt), integer order · red: E½(−λ√t), fractional order · generations
        </text>
      </svg>

      <div style={{fontSize: 11, color: color('color/text/muted'), marginTop: 4, lineHeight: 1.35}}>
        At generation 6, integer-order decay leaves {(100 * e6).toFixed(1)}% of the initial damage; fractional-order
        memory leaves {(100 * m6).toFixed(1)}%. A reform timeline that assumes exponential decay expects the damage to
        be gone; the power-law kernel keeps it.
      </div>
    </div>
  );
}

function LedgerTableSection({
  factors,
  chain,
}: {
  factors: readonly number[];
  chain: readonly number[];
}): JSX.Element {
  return (
    <div>
      <div
        style={{
          fontFamily: Tokens.fonts.sans,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color('color/text/dim'),
          marginBottom: 8,
        }}
      >
        The Ledger
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          fontFamily: Tokens.fonts.mono,
        }}
      >
        <thead>
          <tr style={{borderBottom: `1px solid ${color('color/line/chart')}`}}>
            <th style={{textAlign: 'left', padding: '6px 4px', color: color('color/text/dim')}}>Shock</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>Years</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>Retention</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>Before</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>Removed</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>After</th>
            <th style={{textAlign: 'right', padding: '6px 4px', color: color('color/text/dim')}}>On 1.0</th>
          </tr>
        </thead>
        <tbody>
          {SOURCED_SHOCKS.map((s, i) => {
            const before = chain[i];
            const after = chain[i + 1];
            const removed = before - after;
            return (
              <tr key={s.k} style={{borderBottom: `1px solid rgba(138,106,69,0.2)`}}>
                <td style={{textAlign: 'left', padding: '6px 4px', fontFamily: Tokens.fonts.sans}}>{s.name}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{s.y0}–{s.y1}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{factors[i].toFixed(2)}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{fx(before)}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{fx(removed)}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{fx(after)}</td>
                <td style={{textAlign: 'right', padding: '6px 4px'}}>{(1 - factors[i]).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================================
   SETTINGS VIEW (1368 × 828 content box)
   ========================================================================= */

function SettingsView({
  inputs,
  width,
  height,
}: {
  inputs: CompoundingLedgerInputs;
  width: number;
  height: number;
}): JSX.Element {
  const chain = computeChain(inputs.order, inputs.factors);
  const term = chain[chain.length - 1];

  const cardStyle: React.CSSProperties = {
    background: color('color/surface/1'),
    border: `1px solid ${color('color/line/chart')}`,
    borderRadius: 8,
    padding: '16px 20px',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: Tokens.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: color('color/text/dim'),
    marginBottom: 10,
  };

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowY: 'auto',
        color: color('color/text/primary'),
        fontFamily: Tokens.fonts.sans,
        gap: 16,
      }}
    >
      {/* Title */}
      <div>
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Compounding Ledger · Settings &amp; Sources
        </h1>
        <p style={{margin: 0, fontSize: 13, color: color('color/text/muted')}}>
          Model parameters, empirical calibrations, and manuscript line citations.
        </p>
      </div>

      {/* Model default note if applicable */}
      {inputs.modelDefault && (
        <div
          style={{
            ...cardStyle,
            borderColor: color('color/fill/gold'),
            background: color('color/surface/well'),
            padding: '12px 16px',
          }}
        >
          <div
            style={{
              fontFamily: Tokens.fonts.mono,
              fontSize: 13,
              fontWeight: 500,
              color: color('color/fill/gold'),
            }}
          >
            Model default: this log does not set this instrument.
          </div>
        </div>
      )}

      {/* Model Parameters Readout */}
      <div style={cardStyle}>
        <div style={headerStyle}>Model Parameters (Read-Only)</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '8px 24px',
            fontSize: 13,
            fontFamily: Tokens.fonts.mono,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Baseline normalized capacity (1450):</span>
            <span style={{color: color('color/fill/accent'), fontWeight: 600}}>1.000</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Terminal capacity O (chain):</span>
            <span style={{color: color('color/fill/accent'), fontWeight: 600}}>{fx(term)}</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Enslavement retention factor (1619–1865):</span>
            <span>{inputs.factors[0].toFixed(2)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>13th Am. leasing factor (1865–1934):</span>
            <span>{inputs.factors[1].toFixed(2)}</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Redlining exclusion factor (1934–1968):</span>
            <span>{inputs.factors[2].toFixed(2)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>War on Drugs factor (1971–2020):</span>
            <span>{inputs.factors[3].toFixed(2)}</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Enforcement ratio (cannabis arrest):</span>
            <span>{inputs.ratio.toFixed(2)}×</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Memory decay rate λ:</span>
            <span>{inputs.lam.toFixed(2)} / gen</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Active scale display:</span>
            <span>{inputs.scale}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(138,106,69,0.2)`, padding: '4px 0'}}>
            <span style={{color: color('color/text/muted')}}>Observed wealth ratio (SCF 2022):</span>
            <span>15.75% ($44.89k / $285.01k)</span>
          </div>
        </div>
      </div>

      {/* Verbatim Sources and Assumptions */}
      <div style={cardStyle}>
        <div style={headerStyle}>What the page assumes (Verbatim Sources &amp; Citations)</div>
        <p style={{fontSize: 13, lineHeight: 1.55, color: color('color/text/muted'), margin: '0 0 10px'}}>
          From the manuscript: the compounding model, eq. 6.5, and the full chain, eqs. 6.8–6.12 (
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            Paper/The_Original_Power.tex:5345
          </code>
          –
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5420
          </code>
          ); the sourced factors and their notes (
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            Paper/data/eq33_cannabis_redlining.csv
          </code>
          ): enslavement 0.09 (Baptist 2014; Darity and Mullen 2020), 13th Amendment exception and convict leasing 0.61
          (Blackmon 2008), HOLC redlining and FHA exclusion 0.48 (Mapping Inequality; Rothstein 2017), War on Drugs 0.73
          (ACLU 2020); the asymmetric enforcement multiplier, eq. 6.6 (
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5365
          </code>
          ); the latent-versus-observed qualifier and SCF 2022 values (
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5509
          </code>
          –
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5510
          </code>
          ); the fractional-order memory figure (
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5521
          </code>
          –
          <code style={{fontFamily: Tokens.fonts.mono, color: color('color/text/dim')}}>
            :5566
          </code>
          ).
        </p>
        <p style={{fontSize: 13, lineHeight: 1.55, color: color('color/text/muted'), margin: 0}}>
          The memory panel computes the Mittag-Leffler function <MathText>{'E_{1/2}(−λ√t) = e^{λ²t}·erfc(λ√t)'}</MathText> exactly.
          The manuscript&apos;s figure draws a rational curve as a stand-in for the same function, so the two curves differ
          in detail; both show the same gap. The Buffer-Class comparison in the asymmetry panel divides the War on Drugs
          capacity loss by the enforcement ratio; this is the page&apos;s reading of eq. 6.6, not a sourced Buffer-Class factor.
        </p>
      </div>
    </div>
  );
}
