# Interference Engine

An instrument for the Interference Engine (`Paper/The_Original_Power.tex`, Model C, eqs. 8.12–8.16,
`:6914`–`:6946`; phase loading, eqs. 8.17 and 8.22, `:7195`–`:7210`). It joins the Engine's two levers
into one distance to τ, measures that distance with three earlier instruments, and reruns the
manuscript's spectral tests on the repository data.

- Published page (private until shared): https://claude.ai/artifact/AgvYcJfpeNKujrpzSsthiJ
- Local copy: open `interference_engine.html` in a browser. The data is embedded in the page.

## 1 · The Engine's state

**Readout.** The Engine keeps class solidarity below τ with two levers:
- the **spectral lever** u moves attention out of the class band (Model C);
- the **phase lever** Φ_load scatters the phases of the subgroups that stay in the class band.

The page joins them as

    ρ_τ = M₀ · P_class · (1 − Φ_load)²,   P_class = (1 − η)(1 − u).

N subgroup carriers with phases Φ_j add up to an amplitude N·(1 − Φ_load), so the coherent class
power scales as (1 − Φ_load)². M₀ is the class pressure before the Engine acts, in units of τ (log
slider). The crash condition is ρ_τ ≥ 1. The verdict states how far each lever must move to reach τ.
This joint measure is the page's construction; the manuscript states the two levers separately and
calls them "two faces of the same control".

Presets:
- **Pre-1964:** race axis only, Φ_load 0.078 (ANES).
- **Post-1980:** four axes added, Φ_load 0.403 (ANES).
- **Weimar 1932:** one channel, class/identity power 0.03.
- **Google Trends 2024:** class share 0.016.

Three earlier instruments measure the state:
- **Phase Coherence:** 24 subgroup phases on the unit circle, set to the current Φ_load, with their
  mean vector.
- **Interference State:** the ρ_τ dial with τ in red and a Φ_load bar. The runtime-log field plots
  each logged era's Φ_load × ρ_τ box (`tools/interference_state/data/runtime_log.json`) with the
  model's curve and point. For a selected log, the page computes the class pressure M₀ that the model
  needs to sit in that box: about 3–7 for the early logs (1–5) and about 23–575 for the late logs
  (14 on). Read through the model, the log says the Engine loads phases hardest in the eras when the
  class pressure is highest.
- **Backlash Oscillator:** four panels that add a kernel-breach shock to the current ρ_τ and let the
  Engine respond with each era's fitted transfer function (1865, 1964, 2008, 2020). Each panel reports
  the time above τ and the backlash dip. The 2020 fit's gain sits at the optimizer's upper bound
  (K ≈ 100,000), so that panel is the least reliable.

## 2 · Model C

A 60-year synthesized attention signal with unit total power: a class carrier at 1/4.2 per year, up to
six identity modes in the identity band, and a white noise floor. The page shows the PSD, the band
powers, ℛ_suppress, and a Parseval check. Which frequency goes to which axis is the page's choice.

## 3 · The measured spectra

The page uses the corrected methods of `Paper/scripts/spectral_fourier.ipynb` and
`Paper/scripts/eq_fourier_electoral_cycle.py`:
- **Google Trends, the Congressional Record, and ANES,** with band powers, within-series shares, and
  band-local peaks. A button removes the calendar cycle (mean ISO-week profile) from the Google Trends
  series.
- **Rolling 10-year windows** of Google Trends, including the identity series' own class-band power.
- **The electoral carrier table** for the Congressional Record, with the ratio and rank of every bin.

## Values the page reproduces (corrected manuscript)

| Quantity | Value |
|---|---|
| Google Trends class-band / identity-band power | 4.846 / 53.407 (ratio 11.0) |
| Same, calendar cycle removed | 4.854 / 30.663 (ratio 6.3); identity peak 1.91 yr |
| Own shares: class series / identity series | 74% in class band / 84% in identity band |
| Rolling class-band power, class share | 2.28 → 0.55; 0.073 → 0.016 |
| Identity series, class-band power (rolling) | 0.06 → 3.47; above the class series from 2019 |
| ANES class-band peaks (fs = 1) | 8.1 yr (economy), 4.1 yr (race) |
| Congressional Record ratios, 2 / 4 / 6 yr | 2.51 / 24.06 / 21.02 |
| Congressional Record, 8-yr bracketing bins | 12.86 (8.57 yr), 3,483 (7.50 yr) |
| All-bin context (30 bins) | median 5.18; 11 bins ≥ 20; the 4-yr bin ranks 10th |

## The corrections behind these values

Commits `f90812c` (scripts and notebook) and `ac313a6` (manuscript and PDF) on this branch:
1. The ANES file is on a 1-year grid; the notebook used fs = 0.5, which doubled every period.
2. `fftfreq` drops the positive Nyquist bin, so the "2-year" row was computed at 0.4833 per year. The
   scripts now use `rfftfreq`.
3. 1/8 per year has no bin at N = 60; the scripts now report both bracketing bins.
4. In the Google Trends script, Welch lookups for the 6-year and 8-year rows returned the 4-year bin
   and the DC bin. These rows are now marked as not resolved.
5. The notebook and scripts now report within-series shares, a seasonality-removed rerun, and the rank
   of each electoral ratio among all bins. Both Welch estimates at 0.25 per year fall below parity
   (0.18 and 0.69).
6. The Laplace pole plot now uses the fitted values (ζ = 0.17, 0.59, 0.70, 0.97).

## Rebuilding the embedded data

```bash
python3 tools/interference_engine/scripts/build_data.py Paper/data \
  tools/interference_engine/data/spectral_inputs.json \
  --embed tools/interference_engine/interference_engine.html
```
