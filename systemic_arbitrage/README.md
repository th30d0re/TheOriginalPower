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
├── spectral.py           # FFT/Welch utilities
├── ingest_trends.py      # Google Trends ingestion with CSV fallback
├── interference_engine.py# Compute O_x and P_real from trends
├── trigger_engine.py     # Phase 3 deterministic triggers (stub)
├── polymarket/           # Phase 3 Polymarket client (stub)
├── data/
│   ├── historical/       # Curated CSVs for 1920-1971 windows
│   ├── live/             # signal_snapshot.json output
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

## Phase 3 and 4

Paper-trading and ML fine-tuning are planned as follow-on work. The trigger
engine and Polymarket client are stubbed; live execution requires an explicit
opt-in flag and a compliance review.

## Responsible use

This is research software. It does not provide financial advice. Live trading
requires review of Polymarket Terms of Service, applicable regulations, and the
project risk policies. The default mode is paper-trading only.
