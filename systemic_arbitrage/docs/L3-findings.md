# L3 Outcome → Coefficient Findings

```json
{"source": "replayed_backtest"}
```

## Scope and provenance

The stability results in this document come exclusively from
`data/backtest/resolved_markets.csv`. They do not represent paper trades and do
not satisfy any part of L3's real-data minimum. The real paper-trade file is
absent, so the genuine closed-trade count is **0 of 100 required** and the L3
exit criterion remains **NOT MET**.

The replay source contains `delta_p_at_entry`, `market_prob_at_entry`, and
`resolution_outcome`. It lacks the original `O_x`, `P_real`, `T`, and `V_E`
inputs needed to reconstruct the coefficient equation. The replay harness uses
`market_prob_at_entry` as a replay-only `O_x` proxy, fixes `P_real = T = 1`, and
preserves the recorded delta at the baseline `alpha = beta = 1`. Every in-memory
record and emitted report carries `"source": "replayed_backtest"`.

## Method

The harness fits a calibration map on all 538 resolved rows, obtains a
full-sample alpha/beta reference, and performs 25 chronological rolling refits
plus 25 seeded bootstrap refits. The default subset contains 100 trades. For
each coefficient, the reported statistic is the largest pairwise symmetric
relative change among the full-sample reference and all refits:

`abs(left - right) / max(abs(left), abs(right), 1e-12)`.

The random seed is 1729. Repeated runs with identical inputs and arguments
produce identical output. Stability requires every coefficient's maximum
relative change to be strictly below 5%.

## Results

The full 538-row replay fit produced `alpha = 1.086915` and
`beta = 1.002538`.

| Refit subset | Alpha range | Alpha max change | Beta range | Beta max change | Stable at <5% |
|---:|---:|---:|---:|---:|:---:|
| 100 | 0.100000–5.000000 | 98.00% | 0.000000–1.792941 | 100.00% | No |
| 200 | 0.100000–5.000000 | 98.00% | 0.000000–1.286467 | 100.00% | No |
| 400 | 0.354991–5.000000 | 92.90% | 1.001362–1.129571 | 11.35% | No |
| 538 | 0.463624–5.000000 | 90.73% | 1.001421–1.162462 | 13.85% | No |

At the specified 100-trade sample, **beta moves most**, reaching 100% maximum
relative change. Alpha reaches 98% and repeatedly reaches both
optimization bounds. At larger samples alpha becomes the dominant problem.

## Judgment

One hundred trades is not sufficient to establish 5% refit stability on this
replayed dataset. The observed variance remains material at 400 observations
and in full-size bootstrap samples. A defensible larger minimum cannot be
estimated from these 538 rows because alpha repeatedly reaches its upper bound;
that behavior indicates weak identification or model misspecification rather
than ordinary sampling error alone.

The 5% threshold remains useful as a conservative promotion gate. Current
evidence does not support weakening it. The sample-size requirement should be
treated as a floor, with promotion requiring both at least 100 genuine closed
trades and the unchanged per-coefficient stability test. If genuine data shows
the same boundary behavior, the alpha/beta parameterization, input capture, and
objective need review before collecting a larger sample or promoting fitted
values.

The replay findings also align with the existing failed strategy gate described
for the selected trades. Coefficients learned from this replay should never be
persisted or used for paper or live decisions. The Make target prints them for
diagnostic exercise only and writes no coefficient or trade artifact.

## Counting discrepancy

`status_report.py` currently counts every JSON object with a truthy `closed`
field. It does not exclude records tagged `"source": "replayed_backtest"`.
Its present count of zero is correct because `data/paper_trades.jsonl` does not
exist. Its counting rule would be wrong if replayed records were ever placed in
that file. The L3 readiness function rejects replay-tagged records explicitly
and raises on malformed JSON instead of silently ignoring it. No replay record
is written to the paper-trade path by this machinery.
