# Systemic Arbitrage Engine

This package implements the execution plan in
`.cursor/plans/systemic_arbitrage_engine_59b06ceb.plan.md`. It calibrates *The
Original Power* framework variables against historical cases, computes live
spectral signals from Google Trends, and executes deterministic paper trades on
Polymarket.

## Package layout

```
systemic_arbitrage/
├── __init__.py
├── variables.yaml        # Symbol registry, data sources, falsification criteria
├── config.yaml           # Runtime paths, thresholds, position sizing
├── calibrate.py          # Phase 1 historical calibration (Test A + Test B)
├── calibration_map.py    # Probability calibration map (isotonic-style fit)
├── spectral.py           # FFT/Welch utilities
├── ingest_trends.py      # Google Trends ingestion with CSV fallback
├── interference_engine.py# Compute O_x and P_real from trends
├── trigger_engine.py     # Phase 3 deterministic triggers
├── paper_trader.py       # Paper-trading session over the trigger engine
├── backtest.py           # Walk-forward backtest over resolved markets
├── build_backtest_data.py# Build resolved_markets.csv from Polymarket + Trends
├── costs.py              # Polymarket cost model (fees, spread, slippage)
├── risk_controls.py      # Intraday risk gate for trading sessions
├── fit_coefficients.py   # Fit alpha/beta coefficients from closed paper trades
├── live_executor.py      # Live execution gate (requires SYSTEMIC_ARBITRAGE_LIVE=1)
├── graph_build.py        # L0: build data/graph/framework_kg.json (framework-kg/1)
├── prompt_budget.py      # L6: graph loading, hop-budgeted neighbourhoods, encoders
├── eval/                 # L6 encoding x heuristic benchmark harness + results
├── polymarket/           # Phase 3 Polymarket client (paper trading; live path gated)
├── data/
│   ├── historical/       # Curated CSVs for 1920-1971 windows
│   ├── live/             # signal_snapshot.json output
│   ├── graph/            # framework_kg.json knowledge-graph artifact
│   └── raw/              # Cached Google Trends raw exports
└── requirements.txt
```

## Quick start

Create the dedicated virtual environment and install dependencies:

```bash
python3 -m venv .venv-arbitrage
source .venv-arbitrage/bin/activate
pip install -r systemic_arbitrage/requirements.txt
```

Run historical calibration:

```bash
make arbitrage-calibrate
```

Refresh live signals:

```bash
make arbitrage-signals
```

Run the arbitrage test suite:

```bash
make arbitrage-test
```

## Phase 1: Historical calibration

`calibrate.py` loads `variables.yaml` plus the CSVs in `data/historical/` and
runs two tests:

- **Test A (Concession vector, 1920–1935):** predicts Great Compression / New
  Deal timing from buffer-class-dominant labor threat.
- **Test B (Neutralization vector, 1966–1971):** predicts COINTELPRO / carceral
  response from out-group-dominant Rainbow Coalition threat.

Pass conditions are directional and focus on timing, not point forecasts,
because several 1920–1935 proxies are Tier 2/3 estimates.

## Phase 2: Signal processing

`interference_engine.py` reads Google Trends class-band and identity-band
keyword baskets, applies a 2-year FFT, and splits power into:

- **P_real:** low-frequency band (periods >= 90 days) representing structural
  economic/class anxiety.
- **O_x:** high-frequency band (periods 1–7 days) representing the Orthographic
  Illusion / psychological-wage noise.

The engine writes `data/live/signal_snapshot.json` on each run.

## Phase 3: Deterministic triggers

`trigger_engine.py` evaluates the three triggers from the execution plan:

- **Heat Shield Reversal:** buffer-class-dominant threat with P_real approaching
  tau → LONG reform.
- **COINTELPRO Metric:** out-group-dominant threat with P_real approaching tau
  → SHORT reform, LONG defense/surveillance/police.
- **Interference Engine Spike:** crowd prices structural change but O_x is high
  and P_real is flat → SHORT the event.

`polymarket/client.py` logs intended paper trades to `data/paper_trades.jsonl`
in dry-run mode. Live order placement is gated behind
`SYSTEMIC_ARBITRAGE_LIVE=1` and currently raises `NotImplementedError`.

## Knowledge graph (loops L0 + L6)

`graph_build.py` materializes the framework knowledge graph to
`data/graph/framework_kg.json` under the versioned `framework-kg/1` contract
documented in `GRAPH.md` (§3). `prompt_budget.py` loads that artifact,
extracts hop-budgeted neighbourhoods (1-hop default, logged 2-hop
escalation), and renders them as text in three GraphQA encodings;
`eval/encoding_bench.py` scores encoding × prompt-heuristic pairs on the
fixed query set in `eval/queries.yaml`.

Rebuild the graph:

```bash
.venv-arbitrage/bin/python3 -m systemic_arbitrage.graph_build
```

## Phase 4

ML fine-tuning via QLoRA/DPO and live Polygon wallet execution are planned as
follow-on work.

## Responsible use

This is research software. It does not provide financial advice. Live trading
requires review of Polymarket Terms of Service, applicable regulations, and the
project risk policies. The default mode is paper-trading only.
