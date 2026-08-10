# TT-OOS-02 — Results

**Registration:** `Paper/prereg/tt-oos-02-gender-branch-trajectory.md`, commit `d6976d6`,
committed before the script was written and before the data was examined.
**Executed:** 2026-08-09, `Paper/scripts/tt_oos_02_gender_branch.py`
**Data:** `Paper/data/congressional_record_word_freq_per_axis.csv`, 1965–2024, n = 60.

> **CORRECTION 2026-08-10 — this test ran on synthesized data, and its results are
> diagnostics of a model rather than measurements of the world.**
>
> `Paper/data/congressional_record_word_freq_per_axis.csv` is not an observed per-axis
> series. `Paper/scripts/eq_fourier_per_axis.py:8-33` describes a **historical-event
> mixture model**: each sub-band is a logistic baseline plus Gaussian impulses whose
> centres, amplitudes, and widths are chosen from documented events (Ferguson 2014,
> #MeToo 2017, Obergefell 2015), with the three modelled curves converted to mixture
> weights and multiplied by the *observed aggregate*. The script disclaims ground-truth
> recovery explicitly.
>
> The frequency content of that series is therefore fixed by the modeller's chosen trends
> and event parameters. P1's stable `ω_0 = 0.100` in both epochs describes the mixture
> model's construction, not gender-axis behaviour. P2's rising `ρ_gender/ρ_race` is a
> property of the mixture weights. **Neither outcome is evidence about the world**, and
> the conclusion "the gender branch is not migrating toward match" is not supported by
> this test.
>
> The registration named the salience-as-admittance assumption but missed this one. The
> provenance header was visible in the file and I did not weigh it before registering.
> Re-running this test needs an observed per-axis series. See
> `Paper/audit/per-axis-frequency-reconciliation.md`.

## Verdict as registered

| | Prediction | Result |
|---|---|---|
| **P1** | `\|δ_gender\|` decreases (moves toward match) | **FAILS** — unchanged, drop = 0.0000 |
| **P2** | `ρ_gender/ρ_race` rises | **HOLDS** — 0.4523 → 1.2315 |
| **P3** | gender's move exceeds race's | **FAILS** — both zero |

## P1 fails on a real measurement

Measured `ω_0,gender = 0.1000` cyc/yr (10.0 yr) in **both** epochs, giving
`δ = +2.1000` in both and a drop of exactly zero.

An identical estimate in both epochs invites the suspicion that the estimator degenerated
to the band floor. A diagnostic of the normalized in-band spectra refutes that for gender:

    gender early   0.067:0.40  0.100:1.00  0.133:0.46  0.167:0.13  0.200:0.00
    gender late    0.067:0.70  0.100:1.00  0.133:0.50  0.167:0.50  0.200:0.31

Power rises into 0.100 and falls away on both sides, in both epochs. That is a genuine
interior resonance, stably located. **The gender branch's natural frequency does not move
across the series**, and P1 fails on measurement rather than artifact.

## P3 is uninformative — race is edge-limited

    race early     0.067:1.00  0.100:0.23  0.133:0.21  0.167:0.27  0.200:0.18
    race late      0.067:1.00  0.100:0.19  0.133:0.93  0.167:0.81  0.200:0.31

Race peaks at the band floor in both epochs, so its `ω_0` is bounded, not located — the
true value may lie below 0.05 cyc/yr. The registered discriminator compares two drops,
one of which is undefined. P3 is recorded as a failure because that is what was
registered; it carries no evidential weight either way.

## P2 holds, and it is the confounded one

`ρ_gender/ρ_race` rises from 0.4523 to 1.2315 — a 2.7× relative move, with the gender band
overtaking race in identity-band share. The direction matches the hypothesis.

The registration flagged this measure as carrying the salience-as-admittance assumption of
`xc.15`, and stated in advance that a P2 hit without P1 is weak evidence. That is exactly
the configuration obtained. Rising gender salience is consistent with a falling gender
branch impedance, and equally consistent with more gender legislation for reasons the
impedance model says nothing about. The unconfounded test is the one that failed.

Bootstrap on the primary quantity, 4000 reps, 5-yr blocks: observed drop `+0.0000`,
95% CI `[-2.6500, +3.1167]`, `P(drop > 0) = 0.487`. A coin flip.

## The consequential finding was not a registered prediction

The measured natural periods do not match the values the manuscript publishes:

| Axis | Manuscript (`apx_extraction_chart.tex:344`) | Measured here |
|---|---|---|
| Race | 3.6 yr → `δ = −0.211` | ≥ 15 yr, edge-limited (unresolved toward longer periods) |
| Gender | 6.0 yr → `δ = +0.833` | 10.0 yr → `δ = +2.100` |

At a 10-year natural period the gender branch sits **more than twice as far from match**
as the appendix states, and on the same side. The chart placements in
`Figure~\ref{fig:extraction_chart}` are computed from the published periods, so this
discrepancy propagates into the figure.

This is not a claim that the manuscript is wrong. Chapter `ch:spectral_carrier` derives
those periods by its own method, possibly on the aggregate identity band rather than the
per-axis decomposition, and possibly with different windowing. **The two methods need
reconciling**, and until they are, the per-axis placements should be treated as unresolved
rather than Tier 3.

## Bottom line for the contested-axis hypothesis

The prediction that distinguishes a moving buffer position from a stable one is P1, and it
failed on a clean measurement. The gender branch is not migrating toward match on this
series.

What survives is P2 — a large rise in gender's share of the identity band — which is
consistent with the hypothesis and also consistent with much simpler explanations, and
which the registration named in advance as the weak measure.

The Buffer Matching criterion remains untested. It requires gender-resolved wealth
accumulation net of labour contribution, and no such series exists in this repository.
Nothing here speaks to who occupies which position.
