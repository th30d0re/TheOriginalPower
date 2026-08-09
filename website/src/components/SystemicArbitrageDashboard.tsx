import { useEffect, useMemo, useState } from 'react';
import './SystemicArbitrageDashboard.css';

type NullableNumber = number | null;
type NumericRange = [NullableNumber, NullableNumber] | null;
type LoopStatus = 'done' | 'blocked' | 'not_built' | 'partial';
type VerdictState = 'NO-GO' | 'GO' | 'BLOCKED';
type SignalValue = string | number | boolean | null;

// An axis the engine could not measure reports null rather than zero, so the
// dashboard can show it as awaiting coverage instead of as a real reading.
interface AxisMeasurement {
  band_power: NullableNumber;
  share_of_P_id: NullableNumber;
  O_x: NullableNumber;
}

interface ArbitrageStatus {
  generated_utc: string;
  verdict: {
    state: VerdictState;
    headline: string;
    reasons: string[];
    can_paper_trade: boolean;
    can_go_live: boolean;
  };
  backtest: {
    report_file: string;
    run_utc: string;
    n_folds: NullableNumber;
    n_trades_total: NullableNumber;
    n_trades_evaluated: NullableNumber;
    n_trades_aborted: NullableNumber;
    mean_notional_usd: NullableNumber;
    edge_mean: NullableNumber;
    edge_ci: NumericRange;
    hit_rate: NullableNumber;
    hit_rate_ci: NumericRange;
    brier: {
      model: NullableNumber;
      market: NullableNumber;
      momentum: NullableNumber;
      coin: NullableNumber;
    };
    brier_skill: NullableNumber;
    brier_skill_momentum: NullableNumber;
    beats_market: boolean;
    beats_momentum: boolean;
  };
  selected_trades_diagnostic: {
    n: NullableNumber;
    model_mean_prob: NullableNumber;
    market_mean_prob: NullableNumber;
    realized_rate: NullableNumber;
    model_abs_error: NullableNumber;
    market_abs_error: NullableNumber;
    interpretation: string;
  };
  signal: {
    snapshot: Record<string, SignalValue>;
    inert_variables: string[];
    axis_resolution: string;
    per_axis: Record<string, AxisMeasurement>;
  };
  paper_trading: {
    closed_trades: NullableNumber;
    required_for_promotion: NullableNumber;
    blocked: boolean;
    blocked_reason: string;
  };
  loops: Array<{
    id: string;
    name: string;
    status: LoopStatus;
    blocked_by: string[];
    exit_criterion: string;
    note: string;
  }>;
  next_actions: Array<{
    priority: NullableNumber;
    title: string;
    why: string;
  }>;
  data_caveats: string[];
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: ArbitrageStatus }
  | { kind: 'missing' }
  | { kind: 'error'; message: string };

const STATUS_URL = '/data/arbitrage_status.json';

const isFiniteNumber = (value: NullableNumber): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const formatDecimal = (value: NullableNumber, digits = 3) =>
  isFiniteNumber(value) ? value.toFixed(digits) : 'Unavailable';

const formatPercent = (value: NullableNumber) =>
  isFiniteNumber(value) ? `${(value * 100).toFixed(1)}%` : 'Unavailable';

const formatCurrency = (value: NullableNumber) =>
  isFiniteNumber(value)
    ? new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value)
    : 'Unavailable';

const formatCount = (value: NullableNumber) =>
  isFiniteNumber(value) ? new Intl.NumberFormat().format(value) : 'Unavailable';

const formatRange = (
  range: NumericRange,
  formatter: (value: NullableNumber) => string,
) => {
  if (!Array.isArray(range) || range.length < 2) return 'CI unavailable';
  return `${formatter(range[0])}–${formatter(range[1])}`;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatSignalValue = (value: SignalValue) => {
  if (typeof value === 'number') return formatDecimal(value, 4);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value ?? 'Unavailable';
};

const probabilityPosition = (value: NullableNumber) => {
  if (!isFiniteNumber(value)) return null;
  return Math.min(100, Math.max(0, value * 100));
};

interface DiagnosticChartProps {
  diagnostic: ArbitrageStatus['selected_trades_diagnostic'];
}

const DiagnosticChart = ({ diagnostic }: DiagnosticChartProps) => {
  const series = [
    {
      key: 'model',
      label: 'Model predicted',
      value: diagnostic.model_mean_prob,
      error: diagnostic.model_abs_error,
    },
    {
      key: 'market',
      label: 'Market predicted',
      value: diagnostic.market_mean_prob,
      error: diagnostic.market_abs_error,
    },
    {
      key: 'reality',
      label: 'Reality',
      value: diagnostic.realized_rate,
      error: null,
    },
  ] as const;
  const realityPosition = probabilityPosition(diagnostic.realized_rate);

  return (
    <div
      className="diagnostic-chart"
      role="img"
      aria-label={`Selected trades comparison. Model ${formatPercent(
        diagnostic.model_mean_prob,
      )}; market ${formatPercent(diagnostic.market_mean_prob)}; reality ${formatPercent(
        diagnostic.realized_rate,
      )}.`}
    >
      <div className="diagnostic-axis-labels" aria-hidden="true">
        <span>Lower probability</span>
        <span>Higher probability</span>
      </div>
      <div className="diagnostic-plot">
        {series.map((item) => {
          const position = probabilityPosition(item.value);
          const errorStart =
            item.key !== 'reality' && position !== null && realityPosition !== null
              ? Math.min(position, realityPosition)
              : null;
          const errorWidth =
            item.key !== 'reality' && position !== null && realityPosition !== null
              ? Math.abs(position - realityPosition)
              : null;

          return (
            <div className={`diagnostic-row diagnostic-row-${item.key}`} key={item.key}>
              <div className="diagnostic-series-label">
                <strong>{item.label}</strong>
                <span>{formatPercent(item.value)}</span>
              </div>
              <div className="diagnostic-track" aria-hidden="true">
                {realityPosition !== null && (
                  <span
                    className="reality-reference"
                    style={{ left: `${realityPosition}%` }}
                  >
                    {item.key === 'model' && <span>Reality reference</span>}
                  </span>
                )}
                {errorStart !== null && errorWidth !== null && (
                  <div
                    className={`diagnostic-error-line diagnostic-error-${item.key}`}
                    style={{ left: `${errorStart}%`, width: `${errorWidth}%` }}
                  />
                )}
                {position !== null && (
                  <span
                    className={`diagnostic-marker diagnostic-marker-${item.key}`}
                    style={{ left: `${position}%` }}
                  />
                )}
              </div>
              <div className="diagnostic-error-label">
                {item.key === 'reality' ? (
                  <span>Observed outcome</span>
                ) : (
                  <span>Absolute error: {formatPercent(item.error)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface BrierChartProps {
  backtest: ArbitrageStatus['backtest'];
}

const BrierChart = ({ backtest }: BrierChartProps) => {
  const entries = [
    { key: 'model', label: 'Model', value: backtest.brier.model },
    { key: 'market', label: 'Market — benchmark to beat', value: backtest.brier.market },
    { key: 'momentum', label: 'Momentum', value: backtest.brier.momentum },
    { key: 'coin', label: 'Coin flip', value: backtest.brier.coin },
  ] as const;
  const availableValues = entries.map(({ value }) => value).filter(isFiniteNumber);
  const maximum = availableValues.length > 0 ? Math.max(...availableValues) : null;

  return (
    <div
      className="brier-chart"
      role="group"
      aria-label="Brier score comparison; lower scores are better"
    >
      <div className="brier-direction">
        <strong>Lower is better</strong>
        <span>The market bar is the benchmark to beat.</span>
      </div>
      {entries.map((entry) => {
        const width =
          isFiniteNumber(entry.value) && isFiniteNumber(maximum) && maximum > 0
            ? (entry.value / maximum) * 100
            : 0;
        return (
          <div className={`brier-row brier-row-${entry.key}`} key={entry.key}>
            <div className="brier-label">
              <span>{entry.label}</span>
              <strong>{formatDecimal(entry.value, 4)}</strong>
            </div>
            <div className="brier-track" aria-hidden="true">
              <div className="brier-bar" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface MetricProps {
  label: string;
  value: string;
  detail?: string;
}

const Metric = ({ label, value, detail }: MetricProps) => (
  <div className="metric-row">
    <span className="metric-label">{label}</span>
    <span className="metric-reading">
      <span className="metric-value">{value}</span>
      {detail && <span className="metric-detail">{detail}</span>}
    </span>
  </div>
);

interface DashboardContentProps {
  data: ArbitrageStatus;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  const sortedActions = useMemo(
    () =>
      data.next_actions
        .map((action, index) => ({ action, index }))
        .sort((left, right) => {
          const leftPriority = left.action.priority;
          const rightPriority = right.action.priority;
          if (!isFiniteNumber(leftPriority) && !isFiniteNumber(rightPriority)) {
            return left.index - right.index;
          }
          if (!isFiniteNumber(leftPriority)) return 1;
          if (!isFiniteNumber(rightPriority)) return -1;
          return leftPriority - rightPriority || left.index - right.index;
        })
        .map(({ action }) => action),
    [data.next_actions],
  );
  const hasConfidenceWarning =
    isFiniteNumber(data.backtest.edge_mean) &&
    data.backtest.edge_mean > 0 &&
    isFiniteNumber(data.backtest.brier_skill) &&
    data.backtest.brier_skill < 0;
  const inertVariables = new Set(data.signal.inert_variables);
  const axisEntries = Object.entries(data.signal.per_axis ?? {});
  const measuredAxes = axisEntries.filter(([, v]) => isFiniteNumber(v.O_x));

  return (
    <>
      <section className={`arbitrage-card verdict-card verdict-${data.verdict.state.toLowerCase()}`}>
        <div className="section-kicker">Current decision</div>
        <div className="verdict-heading">
          <span className="verdict-icon" aria-hidden="true">
            {data.verdict.state === 'GO' ? '✓' : data.verdict.state === 'BLOCKED' ? '!' : '×'}
          </span>
          <div>
            <h1>{data.verdict.state}</h1>
            <p>{data.verdict.headline}</p>
          </div>
        </div>
        <ul className="verdict-reasons">
          {data.verdict.reasons.map((reason, index) => (
            <li key={`${reason}-${index}`}>{reason}</li>
          ))}
        </ul>
        <div className="verdict-chips" aria-label="Trading permissions">
          <span className={`status-badge ${data.verdict.can_paper_trade ? 'pass' : 'fail'}`}>
            Paper trade: {data.verdict.can_paper_trade ? 'YES' : 'NO'}
          </span>
          <span className="status-badge human-gated">Live: HUMAN-GATED</span>
        </div>
        <div className="verdict-meta">
          <span>Generated {formatDateTime(data.generated_utc)}</span>
          <span aria-label={`Emitter live permission: ${data.verdict.can_go_live ? 'yes' : 'no'}`}>
            Emitter live flag: {data.verdict.can_go_live ? 'YES' : 'NO'}
          </span>
        </div>
      </section>

      <main className="arbitrage-content">
        <section className="arbitrage-card diagnostic-card" aria-labelledby="diagnostic-title">
          <div className="section-heading">
            <div>
              <div className="section-kicker">The central finding</div>
              <h2 id="diagnostic-title">What the chosen trades predicted—and what happened</h2>
            </div>
            <span className="sample-size">Selected trades: {formatCount(data.selected_trades_diagnostic.n)}</span>
          </div>
          <DiagnosticChart diagnostic={data.selected_trades_diagnostic} />
          <p className="diagnostic-interpretation">
            {data.selected_trades_diagnostic.interpretation}
          </p>
        </section>

        <section className="arbitrage-card scoreboard-card" aria-labelledby="scoreboard-title">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Backtest scoreboard</div>
              <h2 id="scoreboard-title">Did the model earn its confidence?</h2>
            </div>
            <span className="status-badge benchmark-result">
              {data.backtest.beats_market ? '✓ BEATS MARKET' : '× DOES NOT BEAT MARKET'}
            </span>
          </div>
          <div className="scoreboard-layout">
            <BrierChart backtest={data.backtest} />
            <div className="scoreboard-metrics">
              <Metric
                label="Trades evaluated"
                value={`${formatCount(data.backtest.n_trades_evaluated)} / ${formatCount(
                  data.backtest.n_trades_total,
                )}`}
                detail={`${formatCount(data.backtest.n_trades_aborted)} aborted`}
              />
              <Metric label="Mean notional" value={formatCurrency(data.backtest.mean_notional_usd)} />
              <Metric
                label="Hit rate"
                value={formatPercent(data.backtest.hit_rate)}
                detail={`CI ${formatRange(data.backtest.hit_rate_ci, formatPercent)}`}
              />
              <Metric
                label="Mean edge"
                value={formatPercent(data.backtest.edge_mean)}
                detail={`CI ${formatRange(data.backtest.edge_ci, formatPercent)}`}
              />
              <Metric label="Brier skill vs market" value={formatPercent(data.backtest.brier_skill)} />
              <Metric
                label="Brier skill vs momentum"
                value={formatPercent(data.backtest.brier_skill_momentum)}
                detail={data.backtest.beats_momentum ? 'Beats momentum' : 'Does not beat momentum'}
              />
              <Metric label="Cross-validation folds" value={formatCount(data.backtest.n_folds)} />
            </div>
          </div>
          {hasConfidenceWarning && (
            <div className="confidence-warning" role="alert">
              <strong>⚠ Confidence warning</strong>
              <span>{data.selected_trades_diagnostic.interpretation}</span>
            </div>
          )}
          <div className="scoreboard-source">
            <span>Run {formatDateTime(data.backtest.run_utc)}</span>
            <span>{data.backtest.report_file}</span>
          </div>
        </section>

        <section className="arbitrage-card loops-card" aria-labelledby="loops-title">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Where are we?</div>
              <h2 id="loops-title">Loop status</h2>
            </div>
          </div>
          <div className="loop-scroll" tabIndex={0} aria-label="Scrollable loop pipeline">
            <ol className="loop-pipeline">
              {data.loops.map((loop) => (
                <li className={`loop-stage loop-stage-${loop.status}`} key={loop.id}>
                  <div className="loop-stage-header">
                    <span className="loop-id">{loop.id}</span>
                    <span
                      className={`status-badge ${
                        loop.status === 'done'
                          ? 'pass'
                          : loop.status === 'blocked'
                            ? 'fail'
                            : loop.status
                      }`}
                    >
                      {loop.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3>{loop.name}</h3>
                  <p>{loop.note}</p>
                  <div className="loop-detail">
                    <strong>Exit criterion</strong>
                    <span>{loop.exit_criterion}</span>
                  </div>
                  <div className="loop-detail">
                    <strong>Blocked by</strong>
                    {loop.blocked_by.length > 0 ? (
                      <ul>
                        {loop.blocked_by.map((blocker) => (
                          <li key={blocker}>{blocker}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>Nothing currently listed</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="arbitrage-grid lower-grid">
          <section className="arbitrage-card signals-card" aria-labelledby="signals-title">
            <div className="section-heading">
              <div>
                <div className="section-kicker">Live inputs</div>
                <h2 id="signals-title">Signal snapshot</h2>
              </div>
              <span className="axis-resolution">Resolution: {data.signal.axis_resolution}</span>
            </div>
            <div className="signal-grid">
              {Object.entries(data.signal.snapshot)
                .filter(([, value]) => value === null || typeof value !== 'object')
                .map(([name, value]) => {
                  const isInert = inertVariables.has(name);
                  return (
                    <div className={`signal-tile ${isInert ? 'signal-inert' : ''}`} key={name}>
                      <span className="signal-name">{name}</span>
                      <span className="signal-value">{formatSignalValue(value)}</span>
                      {isInert && <span className="inert-flag">⚠ INERT / PINNED</span>}
                    </div>
                  );
                })}
            </div>
            {axisEntries.length > 0 && (
              <div className="axis-breakdown">
                <div className="axis-breakdown-head">
                  <strong>Identity band by axis</strong>
                  <span>
                    {measuredAxes.length} of {axisEntries.length} measured
                  </span>
                </div>
                <div className="axis-grid">
                  {axisEntries.map(([axis, values]) => {
                    const measured = isFiniteNumber(values.O_x);
                    const share = isFiniteNumber(values.share_of_P_id)
                      ? Math.min(100, Math.max(0, values.share_of_P_id * 100))
                      : 0;
                    return (
                      <div className={`axis-row ${measured ? '' : 'axis-unmeasured'}`} key={axis}>
                        <span className="axis-name">{axis}</span>
                        <span className="axis-bar" aria-hidden="true">
                          <span className="axis-bar-fill" style={{ width: `${share}%` }} />
                        </span>
                        <span className="axis-value">
                          {measured ? formatDecimal(values.O_x, 4) : 'awaiting keywords'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {data.signal.inert_variables.length > 0 && (
              <div className="inert-summary">
                <strong>Inert variables</strong>
                <span>{data.signal.inert_variables.join(', ')}</span>
              </div>
            )}
          </section>

          <section className="arbitrage-card paper-card" aria-labelledby="paper-title">
            <div className="section-heading">
              <div>
                <div className="section-kicker">Promotion gate</div>
                <h2 id="paper-title">Paper trading</h2>
              </div>
              <span className={`status-badge ${data.paper_trading.blocked ? 'fail' : 'pass'}`}>
                {data.paper_trading.blocked ? 'BLOCKED' : 'OPEN'}
              </span>
            </div>
            <div className="promotion-count">
              <span>Closed trades</span>
              <strong>
                {formatCount(data.paper_trading.closed_trades)} /{' '}
                {formatCount(data.paper_trading.required_for_promotion)}
              </strong>
              <span>required for promotion</span>
            </div>
            {data.paper_trading.blocked_reason && (
              <p className="blocked-reason">{data.paper_trading.blocked_reason}</p>
            )}
          </section>
        </div>

        <section className="arbitrage-card actions-card" aria-labelledby="actions-title">
          <div className="section-heading">
            <div>
              <div className="section-kicker">What’s next?</div>
              <h2 id="actions-title">Next actions</h2>
            </div>
          </div>
          <ol className="action-list">
            {sortedActions.map((action, index) => (
              <li key={`${action.title}-${index}`}>
                <span className="action-priority">
                  {isFiniteNumber(action.priority) ? `Priority ${formatCount(action.priority)}` : 'Priority pending'}
                </span>
                <div>
                  <h3>{action.title}</h3>
                  <p>{action.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {data.data_caveats.length > 0 && (
          <section className="caveats" aria-labelledby="caveats-title">
            <h2 id="caveats-title">Data caveats</h2>
            <ul>
              {data.data_caveats.map((caveat, index) => (
                <li key={`${caveat}-${index}`}>{caveat}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
};

const SystemicArbitrageDashboard = () => {
  const [loadState, setLoadState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    const loadStatus = async () => {
      try {
        const response = await fetch(STATUS_URL, { signal: controller.signal });
        if (response.status === 404) {
          setLoadState({ kind: 'missing' });
          return;
        }
        if (!response.ok) {
          throw new Error(`Status request failed (${response.status})`);
        }
        if (response.headers.get('content-type')?.includes('text/html')) {
          setLoadState({ kind: 'missing' });
          return;
        }
        const data = (await response.json()) as ArbitrageStatus;
        setLoadState({ kind: 'ready', data });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadState({
          kind: 'error',
          message: error instanceof Error ? error.message : 'Unknown fetch error',
        });
      }
    };

    void loadStatus();
    return () => controller.abort();
  }, []);

  return (
    <div className="arbitrage-dashboard">
      {loadState.kind === 'loading' && (
        <div className="arbitrage-state" role="status">
          <span className="state-symbol" aria-hidden="true">…</span>
          <h1>Loading arbitrage status</h1>
          <p>Reading the latest generated decision document.</p>
        </div>
      )}
      {loadState.kind === 'missing' && (
        <div className="arbitrage-state arbitrage-missing" role="alert">
          <span className="state-symbol" aria-hidden="true">!</span>
          <h1>Status not yet generated</h1>
          <p>
            Run <code>make arbitrage-status</code> to create the dashboard data.
          </p>
        </div>
      )}
      {loadState.kind === 'error' && (
        <div className="arbitrage-state arbitrage-error" role="alert">
          <span className="state-symbol" aria-hidden="true">×</span>
          <h1>Arbitrage status unavailable</h1>
          <p>{loadState.message}</p>
          <p>Confirm the data service is reachable, then reload this page.</p>
        </div>
      )}
      {loadState.kind === 'ready' && <DashboardContent data={loadState.data} />}
    </div>
  );
};

export default SystemicArbitrageDashboard;
