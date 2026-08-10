# TT-OOS-02 — Gender Branch Trajectory on the Extraction Chart

**Status:** pre-registered, untested at time of commit
**Registered:** 2026-08-09
**Precedent:** `tt-oos-01-suppression-conservation.md` (registered `d032213`, results `16b859a`)

## 1. The hypothesis under test

Emmanuel's working hypothesis for *The Gender Wars*: the Buffer Class position on the
gendered axis is shifting away from men, or is at minimum **contested**, with both
gendered branches receiving a material and psychological wage pair.

Framework translation. The Buffer Matching Theorem defines `I_buffer` by an electrical
signature: `P_real = 0`, `Q_reactive ≠ 0`. With `W = ψ_m + jψ_s` an impedance
`z = r + jx`, the buffer is the branch with `r ≈ 0`, `x ≠ 0`. A **contested** axis has
`r > 0` on both branches, so neither is purely reactive and the axis is not a partition
but a two-branch divider in which each side's reflected wave terminates in the other.

## 2. What this test can and cannot decide

**It cannot test the buffer criterion.** `apx_extraction_chart.tex:471` falsifies Buffer
Matching with "a longitudinal dataset showing that `I_buffer` accumulates real material
wealth attributable to the psychological wage, net of its own labor contribution." No
gender-resolved wealth series exists in `Paper/data/`. `gdelt_per_axis.csv` and its raw
source are empty (header only); `nyt_per_axis_raw.csv` is `-1` sentinels throughout.
That criterion stays untested and must not be claimed either way.

**It can test the trajectory.** `apx_extraction_chart.tex:353` places gender at
`δ = +0.833`, inductive, "far from match", from a natural period of ~6 yr driven at the
4-yr carrier. Far from match means high reflection and poor absorption — which is the
**opposite** of what the contested-axis reading predicts, since a two-branch mutually
loading axis should absorb better, not worse. Both cannot hold. This test asks which.

## 3. Data and estimator

`Paper/data/congressional_record_word_freq_per_axis.csv`, 1965–2024, n = 60 annual.
Series: `gender_share = gender_word_freq / identity_word_freq`, and the race analogue.
Shares rather than raw counts, so total volume growth does not enter.

**Modeling assumption, stated openly.** `xc.15` reads phase loading as current division,
`ρ_k = Y_k / Σ Y_i`. Treating an axis's salience share as its admittance share is the
manuscript's assumption, not a measured fact, and it carries into P2 below. P1 and P3 do
not depend on it, which is why P1 is primary.

Fixed in advance:
- Epochs 1965–1994 and 1995–2024 (n = 30 each), the same split as TT-OOS-01.
- Linear detrend within epoch, mean-remove, Hann taper, periodogram via `numpy.fft.rfft`.
- `ω_0,k` = frequency of maximum spectral power in 0.05–0.5 cyc/yr, excluding DC and the
  lowest non-DC bin (trend residue).
- `δ_k = ω/ω_0,k − ω_0,k/ω` evaluated at the carrier `ω = 0.25` cyc/yr.
- Circular block bootstrap, 4000 reps, 5-yr blocks, seed 20260809, for intervals.
- Sexuality excluded — threshold-activated after 2003, absent from the early epoch.

## 4. Registered predictions

**P1 — Gender moves toward match (primary).** `|δ_gender|` is smaller in the late epoch
than the early epoch.
*Falsified if* `|δ_gender|` increases or is unchanged. A stable structural placement
predicts no change; the contested-axis reading predicts movement toward the chart centre.

**P2 — Gender admittance rises relative to race (secondary, confounded).**
`ρ_gender/ρ_race` is higher in the late epoch.
*Falsified if* flat or falling. Carries the salience-as-admittance assumption, so a hit
here without P1 is weak evidence.

**P3 — The move is gender-specific (discriminator).** The decrease in `|δ_gender|`
exceeds the decrease in `|δ_race|`.
*Falsified if* race moves toward match by as much or more, which would indicate a
system-wide carrier shift rather than a change in the gender branch.

**No re-splitting, no alternative detrending, no band re-selection if the result is null.**

## 5. Power

30 points per epoch gives 1/30 cyc/yr resolution. Gender's claimed `ω_0` sits at
0.167 cyc/yr and race's at 0.278, so both are resolvable but coarsely, and only a large
shift will register. TT-OOS-01's P2 was underpowered at this same n and the honest report
was a null. The same standard applies here: a wide bootstrap interval is reported as
inconclusive, not spun as support.

## 6. What each outcome means

- **P1 and P3 hold** — the gender branch is moving toward match, gender-specifically. The
  chart placement at `apx_extraction_chart.tex:353` is a snapshot of a moving quantity,
  and the contested-axis reading gains real support. It still would not establish who
  occupies which position; that needs the wealth data.
- **P1 fails** — the placement is stable, and the contested-axis reading loses its
  strongest available quantitative support. The hypothesis would then rest on the
  Condition-1 violation from the composition table alone.
- **P3 fails while P1 holds** — a system-wide shift, not a gender result. Report as such.
- **Wide intervals** — inconclusive, reported as inconclusive.
