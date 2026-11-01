# Interference Engine

An instrument for Model C, the Interference Engine as spectral redistribution
(`Paper/The_Original_Power.tex`, eqs. 8.12–8.16, `:6914`–`:6946`; Parseval, eq. 8.21, `:7089`). It also
reruns the manuscript's spectral tests on the repository data.

- Published page (private until shared): https://claude.ai/artifact/AgvYcJfpeNKujrpzSsthiJ
- Local copy: open `interference_engine.html` in a browser. The data is embedded in the page.

## What the page does

**Model C (top half).**
- The page synthesizes a 60-year attention signal with unit total power: a class carrier at 1/4.2 per
  year, up to six identity modes in the identity band, and a white noise floor.
- The Engine load u moves power from the carrier to the identity modes; total power stays constant.
- The page computes the PSD, P_class, P_id, and ℛ_suppress = P_class/P_id, plus a Parseval check (time
  variance against integrated spectrum). It compares P_class with τ.
- Presets: Unmanaged, Post-1965, Weimar 1932 (one channel, carrier/identity power set to 0.03 before
  noise and leakage; the measured ℛ is about 0.04), and Google Trends 2024 (class share 0.016).
- The frequency of each identity axis and the τ level (default 0.40) are the page's choices.

**Measured spectra (bottom half)**, with the notebook's method (`Paper/scripts/spectral_fourier.ipynb`:
linear detrend, Hann window, one-sided PSD, trapezoid band power):
- Google Trends, the Congressional Record, and ANES. For each series, the page shows both bands and its
  own share of power in each band.
- Rolling 10-year windows of Google Trends, 2014–2024.
- The electoral carrier table from Chapter 21 (`Paper/scripts/eq_fourier_electoral_cycle.py`: plain
  periodogram), with the ratio at every frequency bin.

## What the page reproduces

| Quantity | Published | Page |
|---|---|---|
| Google Trends class-band power (class series) | 4.85 | 4.846 |
| Google Trends identity-band power (identity series) | 53.4 | 53.407 |
| Ratio | 11.0 | 11.0 |
| Dominant periods, Google Trends | 4.2 yr, 1.0 yr | 4.20, 1.00 |
| Dominant periods, Congressional Record | 5.0 yr, 2.5 yr | 5.00, 2.50 |
| Rolling class-band power, 2014 → 2024 | 2.28 → 0.55 | 2.276 → 0.546 |
| Rolling class share, 2014 → 2024 | 0.073 → 0.016 | 0.073 → 0.016 |
| Electoral ratios, 2 / 4 / 6 / 8 yr | 0.58 / 24.06 / 21.02 / 12.86 | same |

## Points for the manuscript

1. **The Google Trends comparison pairs two series in two bands.** The 11.0 ratio compares class-band
   power of the class series with identity-band power of the identity series. Each series compared with
   itself:
   - the class series has 73.8% of its power in the class band and 0.8% in the identity band;
   - the identity series has 4.8% in the class band and 80.0% in the identity band.

   From 2019 on, the identity series carries more class-band power than the class series in every
   rolling window.
2. **The identity series peaks at exactly 1.00 year.** That is the period of an ordinary annual cycle in
   weekly search data. A seasonality-removed rerun would show whether the peak comes from the calendar.
3. **ANES sampling rate.** `anes_issue_salience.csv` is annualized (one row per year), but the notebook
   uses fs = 0.5. Every period on that frequency axis is therefore doubled. The published peaks (5.4 and
   8.1 years) reproduce only with fs = 0.5. With fs = 1, the class-band peaks are 8.1 years (economy) and
   4.1 years (race).
4. **Electoral table bins.** The 2-year row is computed at 0.4833 per year, not 0.5000: numpy's
   `fftfreq` has no positive Nyquist bin. The 8-year row is computed at 0.1167 per year, not 0.1250,
   because 1/8 falls between bins. At the exact 0.5000 bin the ratio is 2.51; at 0.1333 it is about
   3,483.
5. **The size of the electoral ratios.** Across all 30 bins, the median identity/class ratio is 6.07,
   and 11 bins reach 20 or more. A ratio above 20 is therefore common in these two series, and it does
   not single out the electoral frequencies by itself. The chapter's own robustness section already says
   that the Welch estimates are unstable and that P5 is not confirmed.
6. **The Laplace pole figure (`:7052`–`:7084`) uses older fits.** Its labels (ζ = 0.16, 0.54, 0.61,
   0.77; 2020 poles at −3.76 ± 3.07j) do not match the fits in the text (0.17, 0.59, 0.70, 0.97; 2020
   poles at −6.47 ± 1.56j).

## Rebuilding the embedded data

```bash
python3 tools/interference_engine/scripts/build_data.py Paper/data \
  tools/interference_engine/data/spectral_inputs.json \
  --embed tools/interference_engine/interference_engine.html
```
