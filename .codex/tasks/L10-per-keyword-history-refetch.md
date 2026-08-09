# TASK L10 — Unify the keyword definitions and refetch per-keyword history

Depends on L9 (`.codex/tasks/L9-per-axis-decomposition.md`) being merged. Read
`systemic_arbitrage/docs/L9-findings.md` first — the axis keyword lists it
produced are your input.

## The defect

There are **two disagreeing definitions of the identity basket** in this package:

- `variables.yaml` → `woke`, `crt`, `transgender`, `dei`, `culture war`
  (used by `ingest_trends.py` → `interference_engine.py`, the live signal path)
- `build_backtest_data.py:248` → `transgender`, `woke`, `diversity`,
  `critical race theory` (hardcoded, used to build the backtest input)

The class basket diverges too: `variables.yaml` lists six terms, the backtest
fetches four. **The backtest is therefore validating a signal the production
engine does not compute.** The reported `brier_skill: -0.403` was measured on a
different basket than the one that runs live. Fixing this is a precondition for
that number meaning anything.

Second defect: `fetch_trends()` collapses to `class_band`/`identity_band` before
writing `data/raw/google_trends_historical.csv`, so the cached history has **no
per-keyword columns at all** (verified: its header is
`date,class_band,identity_band,class_z,O_x,P_real,delta_P`, 74 rows). L9's
decomposition cannot reach the backtest through this file no matter how correct
it is.

## Two defects inherited from L9 — fix these first

**L9's keyword lists are mostly dead terms.** The L9 brief told you to source
terms from the manuscript's "Canonical deployment mechanism" column. That column
describes the **1965–1980** activation, so the result was historical event names
used as contemporary search queries. Measured live against Trends over
2020–2026:

| term | mean | nonzero fraction |
|---|---:|---:|
| `rent` (anchor) | 74.07 | 1.00 |
| `anita bryant` | 0.01 | 0.01 |
| `moral majority` | 0.00 | 0.00 |
| `anti busing` | 0.00 | 0.00 |
| `war on men` | 0.00 | 0.00 |
| `doma` | 0.04 | 0.04 |
| `save our children` | 0.00 | 0.00 |
| `nativism` | 0.00 | 0.00 |
| `medical model of disability` | 0.00 | 0.00 |

The **axes are correct and stay as they are.** Replace the terms with
*contemporary expressions of the same axis*: the manuscript's mechanism defines
what the axis measures, and your job is to find the query a person types in
2020–2026 that expresses it. Keep the `# source:` comment naming the mechanism.

Also disambiguate. `ada` is currently in the `ability` axis and is a Cardano
ticker, the American Dental Association, and a given name; as a raw search term
it would inject crypto-market noise into an oppression axis. Use pytrends topic
mids (`pytrends.suggestions`) rather than raw strings wherever a term is
ambiguous, and record the mid in the config.

**A flat-zero term reads as "no pressure," not "not measured."**
`_build_axis_composite` in `ingest_trends.py` handles a column that is *absent*
(returns `NaN`) but averages a present all-zero column in as `0.0`. An axis built
from dead terms therefore reports `band_power ≈ 0`, which is a substantive claim
about the world rather than a gap in the instrument. Extend the same `NaN`
treatment to terms that are flat-zero or below the viability floor over the
window.

### Term viability gate

Before any term enters a basket, it must pass, measured over the actual fetch
window: **nonzero fraction ≥ 0.5 and mean ≥ 1.0.** Terms that fail are recorded
in the findings with their measured statistics and excluded — never silently
swapped for something that passes. Write the gate as a reusable function with
tests; it is the check that would have caught this before it shipped.

## What to change

### 1. Delete the hardcoded lists

`build_backtest_data.py` must read its keywords from `variables.yaml` via the
same loader `ingest_trends.py` uses. One definition, one file. Add a test that
fails if any keyword list is hardcoded anywhere outside `variables.yaml`.

### 2. Cache per-keyword, derive bands downstream

`google_trends_historical.csv` must store **one column per keyword**, plus the
date index, and nothing pre-aggregated. `class_band`, `identity_band`, the
per-axis columns, `O_x`, `P_real` and `delta_P` are all derived at read time by
the existing code paths. Aggregating at rest is what destroyed the per-keyword
signal in the first place.

Write the new file to `data/raw/google_trends_historical_perkw.csv` and leave the
old file in place untouched. Do not overwrite the input the current backtest
baseline was measured on — the comparison against `-0.403` is only meaningful if
the old artifact still exists.

### 3. Batched fetch with an anchor

Google Trends returns values normalized **within a request**, so columns from
different requests are not comparable. pytrends is confirmed reachable from this
machine (a 2-keyword, 5-month fetch returned 153 rows).

- Chunk keywords into groups of **at most 5**, with `rent` present in every
  chunk as the anchor.
- Rescale each chunk by the ratio of its anchor series to the first chunk's
  anchor series, so all columns land on one scale.
- If the anchor is missing, all-zero, or has zero variance in a chunk, **raise** —
  a silently unscaled chunk corrupts every column in it.
- `time.sleep(3)` between requests minimum, and handle 429 by backing off and
  retrying rather than falling through to the zero-signal path.
- Timeframe `2020-01-01 2026-01-01`, `geo="US"`, matching the current call.

The existing `except Exception: return pd.DataFrame()` "using zero signals"
fallback must go. A failed fetch has to fail loudly; silently substituting zeros
produces a backtest that looks like it ran.

### 4. Provenance

Write a sidecar `google_trends_historical_perkw.meta.json` recording: fetch
timestamp, every keyword requested, the chunk composition, the anchor rescale
factor applied per chunk, and any keyword that came back empty. Without this the
CSV is unauditable.

## Do not

- Do NOT run the backtest, and do NOT edit `backtest.py`, `costs.py`,
  `risk_controls.py`, `paper_trader.py`, or `live_executor.py`. Changing the
  input and the evaluator in one pass makes the result uninterpretable.
- Do NOT run any `git` command.
- Do NOT edit `Paper/`.
- Do NOT tune keyword lists. They come from L9, which took them from the
  manuscript. If a term returns no data, record that in the findings; do not
  substitute a different term to fill the column.

## Verify

```bash
make arbitrage-test
```

All existing tests pass, plus yours. Then confirm by inspection that
`google_trends_historical_perkw.csv` has one column per configured keyword and
that the old `google_trends_historical.csv` is byte-identical to what it was.

## Report

`systemic_arbitrage/docs/L10-findings.md`: the unified keyword set; which terms
returned usable series and which came back empty or flat; the anchor rescale
factor per chunk; how many of the six axes are measurable over the full window;
and whether any rate limiting truncated the fetch. State the row count and date
span actually retrieved — not the span requested.
