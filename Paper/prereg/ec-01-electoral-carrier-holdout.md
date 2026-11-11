# EC-01 — Electoral Carrier Holdout (2026 Midterm Cycle)

**Status:** pre-registered, untested at time of commit
**Registered:** 2026-11-11
**Precedent:** `tt-oos-02-gender-branch-trajectory.md`
**Chapter under test:** Chapter 21, "The Spectral Carrier" (`The_Original_Power.tex`, `\label{ch:spectral_carrier}`), Section "High-Frequency Validation: Google Trends and the Resolved Midterm Cycle"

## 1. The hypothesis under test

Chapter 21 reports that weekly Google Trends identity-band search interest carries a 2-year
periodic component at the midterm frequency (identity/class Welch power ratio 12.8:1, 2004–2024).
The framework reads this as the Interference Engine phase-locked to the electoral clock.

EC-01 asks one narrow question: **does the 2-year component fitted on 2004–2024 extrapolate
into 2025–2026?** The 2026 midterm cycle is a holdout the fit has never seen.

## 2. What this test can and cannot decide

**It is not a prediction of the 2026 midterm.** The election result was known to the registrant
before registration. Nothing here predicts who won, by how much, or any seat count.

**It is post hoc in status and confirmatory in form.** The discourse data for 2025–2026 have not
been pulled into this repository, and no analysis of them has been run. The estimator,
thresholds, and kill conditions below are fixed before they are. The registrant knows the
election outcome. Any prior look at 2025–2026 Trends charts by the registrant is not recorded
here and, if it occurred, weakens the test.

**It cannot isolate the Interference Engine.** Elections drive public attention to election
topics with no Engine involved. A pass shows the carrier extrapolates. It does not show the
carrier has the cause the framework names.

## 3. Data and estimator (frozen)

- **Training data:** `Paper/data/google_trends_class_identity.csv`, weekly (W-SUN), 2004-01-04
  to 2024-12-29, 1,096 rows. SHA-256 `3021ae27122432b83237bc00ea1622e7bfea82e5daf3e896982f979c1bbca332`.
- **Columns:** `identity_signal_index` (test series), `class_signal_index` (control series).
- **Keyword baskets:** the baskets in `Paper/data/raw/google_trends_raw.csv` and
  `Paper/scripts/preprocess_spectral_data.py`, unchanged. Adding, dropping, or editing a keyword
  voids this registration.
- **Holdout data:** weekly series from 2025-01-05 to the last full week ending on or before the
  pull date, drawn with the same baskets. The pull date is recorded in the results file.
- **Scaling.** Trends renormalizes each pull to its own maximum. The holdout pull must include an
  overlap window, 2023-01-01 to 2024-12-29. Fit an OLS line from the new pull to the stored
  series on the overlap, and apply it to the holdout weeks. Record the slope and R².
- **Preprocessing:** identical to `preprocess_spectral_data.py` (weekly grid, linear
  interpolation, 3-week centered rolling mean).
- **Fit:** on the training window, remove a linear trend, then fit by least squares
  `y = a·cos(2πft) + b·sin(2πft) + c` with `t` in years, at `f = 0.50` cyc/yr. Repeat at
  `f = 0.43` and `f = 0.58` cyc/yr (periods 2.33 and 1.72 years) as specificity controls.
- **Extrapolation:** carry the training linear trend and each harmonic forward unchanged. Nothing
  is refit on the holdout.
- **Statistic:** Pearson `r` between the extrapolated harmonic and the holdout series after
  removing the extrapolated training trend. Significance by 1,000 random phase offsets of the
  harmonic, which keeps the series' autocorrelation.
- **Scripts:** `eq_fourier_electoral_cycle_google_trends.py` (SHA-256
  `1cdde11ba04e7a865fd24a6eade31eb11e2fac5d8a2d324aecda2a16c19e7c00`) and
  `preprocess_spectral_data.py` (SHA-256 `7c93f0dcc0c045fd7ebdb4887ff66b1a9f605f68be5d111c23b077ad6b865c1c`).
  The holdout script is new and is committed with the results.

If the Trends pull fails or the baskets cannot be reproduced, the test is not run. No substitute
data source is allowed.

## 4. Registered predictions

| | Prediction | Pass | Fail |
|---|---|---|---|
| **E1** | The 0.50 cyc/yr identity harmonic correlates with the 2025–2026 identity series | `r ≥ 0.30` and phase-offset `p < 0.05` | `r ≤ 0` |
| **E2** | Specificity: the 0.50 harmonic beats both neighbors | `r(0.50) > r(0.43)` and `r(0.50) > r(0.58)` | either neighbor ≥ `r(0.50)` |
| **E3** | Class control carries no 2-year signal | class `r(0.50) < 0.30` and `< ` identity `r(0.50)` | class `r(0.50) ≥ 0.30` |
| **E4** | Peak timing: the week of maximum identity index between 2026-07-01 and 2026-11-30 falls within ±6 weeks of the harmonic's maximum in that window | within ±6 weeks | outside ±6 weeks |

`0 < r < 0.30` on E1 is **inconclusive**.

## 5. Power

One new cycle. The holdout is about 98 weeks, under one full 2-year period, and the series is
smoothed, so independent samples are few. The phase-offset permutation handles the
autocorrelation. It does not create power. A pass here is weak evidence. A failure is informative.

## 6. What each outcome means

- **E1 to E4 all pass:** the 2-year carrier survived one holdout cycle. It does not mean the
  Engine exists, and it does not mean the framework predicts elections.
- **E1 fails:** the 2-year carrier fitted on 2004–2024 does not extrapolate. Chapter 21's
  midterm claim is reported as not replicated on 2025–2026.
- **E2 fails with E1 passing:** the fit is not specific to the electoral frequency. The chapter
  must not call it phase-locked.
- **E3 fails:** the class control carries the signal too, and P3-style selectivity is falsified on
  this substrate.
- **E4 alone fails:** amplitude extrapolates and timing does not. Report as a phase failure.

## 7. Forward prediction (registered now, evaluated later)

A true prediction needs a claim written before the event. **F1 and F2 are registered here with
direction only. Numeric thresholds are set by amendment, committed before 2027-01-01, using the
2004–2024 training window only.**

- **F1 (odd-year trough):** mean detrended identity index over 2027-03-01 to 2027-09-30 is below
  its mean over 2026-08-01 to 2026-11-30. Evaluated 2027-10.
- **F2 (2028 peak timing):** the week of maximum identity index between 2028-07-01 and 2028-11-30
  falls within ±6 weeks of the extrapolated 0.50 cyc/yr harmonic's maximum in that window.
  Evaluated 2028-12.

## 8. Outcome predictions (not registered)

No mapping from the framework's equations to a seat count, vote share, or winner exists. Any
outcome prediction for 2028 needs that mapping written, with inputs, outputs, and a worked
example on a past election, **before 2028-06-01**. Until it is, no outcome claim is made.

## 9. Provenance

Registered after a live debate shortly before 2026-11-11 in which a midterm prediction was claimed and no
dated record of one exists in the repository. This registration replaces that claim with a test
whose criteria precede the data.
