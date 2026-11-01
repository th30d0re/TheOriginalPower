# Compounding Ledger

An instrument for the compounding model, O_t = O_{t−1}·(1 − αP_t) (eq. 6.5), and the four-shock chain
(eqs. 6.8–6.12, `Paper/The_Original_Power.tex:5345`–`:5420`).

- Published page (private until shared): https://claude.ai/artifact/H2tpKbBBuYJmKrDuC38b8R
- Local copy: open `compounding_ledger.html` in a browser.

## What the page does

- **Waterfall** (linear or log scale) from the 1450 baseline of 1.0 to 0.019. The factors come from
  `Paper/data/eq33_cannabis_redlining.csv`: 0.09, 0.61, 0.48, and 0.73. Each factor has a slider and a
  "restore sourced values" button. An additive model gives 1 − (0.91 + 0.39 + 0.52 + 0.27) = −1.09, an
  impossible result.
- **Order.** Every order ends at the same value; the intermediate path differs (eq. 6.7).
- **Asymmetric shock** (eq. 6.6). The page divides the War on Drugs loss by the enforcement ratio
  (3.73× by default) to show the Buffer-Class factor at equal behavior. This is the page's reading of the
  equation, not a sourced Buffer-Class factor.
- **Latent and observed.** The chain's 0.019 against the SCF 2022 median wealth ratio, 15.75%
  ($44.89k / $285.01k) (`:5509`).
- **The memory gap** (`:5521`–`:5566`). e^(−λt) against the exact Mittag-Leffler function
  E_{1/2}(−λ√t) = e^{λ²t}·erfc(λ√t). At λ = 0.5 and 6 generations: 5.0% against 37.3%.

## Points for the manuscript

- The memory-gap figure draws a rational curve for E_{1/2}. The exact value at generation 6 (λ = 0.5)
  is 0.373; the rational curve gives about 0.19.
- `:5510` gives the white-to-Black wealth ratio as 1:6.35 (from $285.01k / $44.89k). `:5513` gives
  "median White household wealth ≈ 7.8× Black". The two figures do not agree.
