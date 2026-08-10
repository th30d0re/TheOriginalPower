# Brief — Reconcile the published per-axis natural frequencies

## The question

`Paper/apx_extraction_chart.tex:339-349` publishes a table of per-axis natural periods and
detunings, and Figure `fig:extraction_chart` computes its marker positions from them:

    Race       3.6 yr    omega/omega_0 = 0.900   delta = -0.211
    Gender     6.0 yr    omega/omega_0 = 1.500   delta = +0.833
    Sexuality  threshold-activated after 2003

An independent measurement (`Paper/prereg/tt-oos-02-RESULTS.md`, commit `bbabc51`) does not
reproduce them. Using a Hann-tapered periodogram on
`Paper/data/congressional_record_word_freq_per_axis.csv` shares, split 1965–1994 /
1995–2024, argmax in 0.05–0.50 cyc/yr:

    Gender   measured 10.0 yr  (0.100 cyc/yr) in BOTH epochs -> delta = +2.100
    Race     peak pinned at the 0.067 cyc/yr band floor, so >= 15 yr, edge-limited

Gender measures more than twice as far from match as published, on the same side.

**Determine which number is right, and why they differ. Report only — change nothing.**

## Lead hypothesis, to test first

`Paper/data/congressional_record_word_freq_per_axis.csv` carries this header:

    # Method: historical-event mixture model (see eq_fourier_per_axis.py)
    # Source aggregate: congressional_record_word_freq.csv

The per-axis series may therefore be a **model output synthesised from the aggregate**,
not an independent measurement. If so, its spectral peaks reflect the mixture model's
event priors rather than measured per-axis behaviour, and both the published table and the
TT-OOS-02 measurement may be reading artefacts of that model.

Establish this first. Read `Paper/scripts/eq_fourier_per_axis.py` and state plainly whether
the per-axis series is measured or synthesised, and if synthesised, what fixes its
frequency content.

## What to determine

1. **Provenance of the published numbers.** Which script, series, and method produced
   3.6 yr and 6.0 yr? Candidates: `Paper/scripts/eq_fourier_electoral_cycle.py`,
   `eq_fourier_per_axis.py`, `eq_fourier_electoral_cycle_robustness.py`,
   `spectral_fourier.ipynb`, and Chapter `ch:spectral_carrier`
   (`Paper/chapters_src/23_the_spectral_carrier_electoral_cycles_an.tex`). Cite file:line.
2. **Reproduce them.** Run the identified method and report whether 3.6 and 6.0 come out.
3. **Locate the divergence.** If they do not reproduce, identify the cause precisely —
   different series (aggregate vs per-axis), different estimator (Welch vs periodogram,
   window, zero-padding, detrending), different span, or a synthesised input.
4. **State the correct values**, with the method that produces them and its assumptions.
5. **Assess the figure.** Say whether `fig:extraction_chart`'s markers are correct as
   drawn, and if not, what the corrected `delta` values would be. Do not edit the figure.

## Constraints

- **Do not edit any `.tex` file.** Do not edit the figure. Do not modify existing scripts or
  any file in `Paper/data/`. This is a read-and-report task.
- **Do not run `make data-refresh`.** It currently corrupts
  `Paper/data/scotus_keyword_counts.csv` via a missing deduplication step — unrelated to
  this task and already tracked separately.
- Any new code you write for reproduction goes in
  `Paper/scripts/scratch_freq_reconcile.py`, which you own.
- **Do not run `git`.**

## Files you own

- `Paper/audit/per-axis-frequency-reconciliation.md` — your findings
- `Paper/scripts/scratch_freq_reconcile.py` — scratch reproduction code

## Acceptance

The findings file answers, with citations: is the per-axis series measured or synthesised;
what method produced the published periods; do they reproduce; if not, why not; what are the
correct values; and is the published figure right.

**An honest "the published numbers cannot be reproduced from anything in this repository" is
a fully acceptable outcome** and more useful than a forced reconciliation. So is "TT-OOS-02's
estimator is misspecified and the published values stand" — say so if that is what you find.
Do not shade toward either.

## Findings

Close with anything in this brief that turned out to be wrong, and any judgment calls you
made. Report disagreements there rather than acting on them.
