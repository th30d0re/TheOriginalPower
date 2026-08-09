# TASK L9 — Decompose the identity band into the manuscript's six axes

You are extending `systemic_arbitrage/` so the interference engine resolves
identity pressure **per axis** instead of collapsing it into one scalar. Do not
redesign anything. This is an additive change with a backward-compatible seam.

## Why this exists

The backtest reports `brier_skill: -0.403` — the model is a genuine anti-signal,
predicting 40.3% where the market says 11.1% and reality is 9.8%. The diagnosed
root cause is that `interference_engine.py` reduces all identity pressure to a
single `identity_band` column built from five keywords, so the model cannot tell
which axis is firing. Per-axis resolution is the only change that can move that
verdict.

## The axes are already specified — do not invent them

`Paper/The_Original_Power.tex`, section `\label{sec:phase_loading_algebra}`
(search for "Axis-by-axis" — around line 6720), contains a table titled
**"Axis-by-axis $\phi_{k,j}$ definitions"** with six rows:

| Axis | Canonical deployment mechanism (abridged) |
|---|---|
| Race | White primaries → Variable Swap → War on Drugs proxies; "law and order" |
| Gender | Anti-ERA (1972–82); "war on men" media; feminism routed corporate |
| Religion | Moral Majority (1979); evangelical mobilization on abortion/prayer |
| Sexuality | Anita Bryant (1977); DOMA (1996); anti-trans legislation |
| Nationality | Anti-busing; immigration restriction; nativist partition |
| Ability | ADA as individual accommodation; disability as medical category |

**Read that table in the .tex before writing any keyword list.** The
"Canonical deployment mechanism" column is your specification for what each
axis contains. Equation `eq:8.22-45b` in the same section gives the governing
form and does not change:

`R_class(t) = P_class(t) / (P_class(t) + P_id(t) + P_eta)`

Your change is that `P_id` becomes a sum over axes, `P_id = sum_k P_k`.

## What to change

### 1. `systemic_arbitrage/variables.yaml`

Keep `keywords.class_band` exactly as it is. Under `keywords`, add an
`identity_axes` mapping with one keyword list per axis, keyed
`race`, `gender`, `religion`, `sexuality`, `nationality`, `ability`.

Constraints on the keyword lists:

- 4–8 terms per axis. Terms must be plausible **US Google Trends** queries —
  short, commonly typed, no boolean syntax.
- Every existing `identity_band` term must land in exactly one axis:
  `crt` and `dei` are race; `transgender` is sexuality; `woke` and
  `culture war` are cross-axis — put them in a seventh list named
  `unattributed` and **exclude `unattributed` from the per-axis sum**, so a
  term that names no single axis cannot be silently attributed to one.
- Add a `# source:` comment above each axis list naming the manuscript's
  deployment mechanism the terms are drawn from. A term that cannot be traced
  to that column does not go in the list.

### 2. `systemic_arbitrage/ingest_trends.py`

`build_dataframe` currently emits two columns. It must emit, in addition:
one `identity_<axis>` column per axis, plus `identity_unattributed`.

`identity_band` **must keep its current meaning and dtype** — every existing
consumer reads it. Compute it as the mean over the union of all identity terms
(axes plus unattributed), which is what it is today. Assert in code that the
union of the axis lists plus `unattributed` equals the old `identity_band`
membership, so the two definitions cannot drift apart silently.

Google Trends caps a request at 5 keywords. The existing code fetches
`set(class + identity)` in one call, which already exceeds that and works only
because of the fallback CSV. With ~40 terms you must **batch**: chunk into
groups of 5 with one shared anchor term present in every chunk, then rescale
each chunk by the anchor so the columns are comparable. Use `rent` as the
anchor. If the anchor is missing or flat-zero in a chunk, raise — do not
silently skip the rescale.

The fallback snapshot will not have the new columns. Handle that explicitly:
if a keyword is absent from the fetched/fallback frame, log a warning naming
the axis and the missing term and omit it from that axis's composite; if an
entire axis has no terms present, that axis's column is `NaN`, never `0.0`.
A zero would read as "no pressure on this axis," which is a different claim
from "not measured."

### 3. `systemic_arbitrage/interference_engine.py`

Currently line ~64 reads `identity_band` and line ~94 hardcodes `ve = 0.0`.

- Compute per-axis high-frequency power `P_k` using the **same** `compute_ox`
  band settings already in `variables.yaml.spectral`. Do not retune the bands.
- Emit a `per_axis` block in the output: for each axis, its band power, its
  share of `P_id`, and its own `O_x`-style ratio. Keep every existing
  top-level field byte-identical in meaning so nothing downstream breaks.
- Where an axis is `NaN` (unmeasured), it must be excluded from the share
  denominator rather than counted as zero.
- **Leave `ve = 0.0` alone.** Wiring `V_E` is a separate task; do not touch it.

### 4. Tests

Add `systemic_arbitrage/tests/test_per_axis.py`:

- A golden-file test on a frozen synthetic input: inject a known sinusoid into
  exactly one axis and assert that axis's share dominates. This is the test
  that proves decomposition works at all.
- Assert `identity_band` is unchanged to within 1e-12 against the pre-change
  computation on the fallback snapshot. **This is the backward-compatibility
  guarantee and the most important test in the file.**
- Assert an unmeasured axis yields `NaN` and is excluded from the denominator,
  not counted as zero.
- Assert the `unattributed` list never enters the per-axis sum.

## Hard constraints

- Do NOT run any `git` command. Do not commit, branch, stage, or stash.
- Do NOT edit `Paper/` — it is manuscript source and read-only for you.
- Do NOT touch `live_executor.py`, its `NotImplementedError`, or the
  `SYSTEMIC_ARBITRAGE_LIVE` environment gate. No order-placement code.
- Do NOT re-run or modify the backtest, and do not edit `backtest.py`,
  `costs.py`, or `risk_controls.py`. Changing the signal and the evaluator in
  one pass makes the result uninterpretable.
- Do NOT tune keyword lists against backtest output. Choose the terms from the
  manuscript table, write them once, and stop. Fitting the basket to the
  result is the exact failure this project is built to avoid.

## Verify before finishing

```bash
make arbitrage-test
```

166 tests pass today. The bar is: all 166 still pass, plus your new ones.
A single pre-existing test that starts failing means you broke a consumer of
`identity_band` — fix it rather than updating the test's expectation.

## Report

Write `systemic_arbitrage/docs/L9-findings.md` covering: the keyword list per
axis with the manuscript mechanism each term traces to; which terms you could
not attribute and why; the batching/anchor rescale approach and whether the
fallback snapshot covered the new terms; the test results; and any place where
the manuscript's specification was ambiguous enough that you had to choose.

State plainly what you did not measure. Do not report a number you did not
compute — the two prior loops in this directory were valuable precisely because
they refused to.
