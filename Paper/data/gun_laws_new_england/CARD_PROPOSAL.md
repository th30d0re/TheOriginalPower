# CARD_PROPOSAL — Chapter 135 rebuttal card

## Verdict

The results support a clean sentence, with one condition: the law-strength
half of the card must carry the control caveat, because the bivariate
association (r ≈ +0.29 in rank terms) and the controlled coefficient
(−0.004, p = 0.89) tell different parts of the story. Omitting the control
sentence would let the card be read as claiming strict laws reduce homicide,
which this dataset cannot support after controls. With the caveat included,
the copy below states exactly what the data show.

## Proposed card copy

**Headline:**

> New England's gun laws are strict. Its homicide rates are low. So is its poverty.

**Numbers block:**

> Across all 50 states + DC (crude rates, firearm homicide per 100,000,
> 2020–2024 pooled where available, else 2024):
>
> - Poverty rate vs firearm homicide: r = +0.72 [95% CI 0.56, 0.83], n = 51
> - Gun-law rank (Giffords, 1 = strictest) vs firearm homicide: r = +0.29
>   [0.01, 0.53], n = 50 — and with poverty and inequality controlled, the
>   law-rank coefficient falls to −0.004 (p = 0.89)
>
> New England, sorted by firearm homicide rate: NH 0.80 (F/#34), ME 1.41
> (C+/#21), MA 1.57 (A/#5), RI 1.69 (A-/#12), VT 1.90 (B-/#18), CT 2.78
> (A/#3).

**Sources line:**

> Sources: CDC NCIPC (dataset fpsi-y8tj, accessed 2026-09-24), Giffords Law
> Center Annual Gun Law Scorecard, Everytown Gun Law Rankings, Census Bureau
> SAIPE 2024. All rates are crude, not age-adjusted.

## Which correlations this rests on

- The headline and the first number rest on the poverty–homicide Pearson
  correlation on the primary homicide measure (r = +0.721, n = 51,
  p = 2.5e-09). It holds in the 2024 spec (r = +0.737) and the pooled spec
  (r = +0.708), and in Spearman form (rho = +0.72).
- The second number rests on the Giffords rank–homicide Pearson correlation
  on the primary measure (r = +0.289, n = 50, p = 0.042) and the controlled
  OLS coefficient on Giffords rank with poverty and Gini (−0.0042, p = 0.893,
  R² = 0.593).
- The New England list quotes `states.csv` values directly.

## What the card must not say

- It must not claim that strict gun laws cause low homicide. The bivariate
  association runs that way and vanishes under controls; causation is out of
  reach for a cross-section regardless.
- It must not claim that law strength is unrelated to homicide without the
  control clause. Bivariately, weaker-law states do show higher homicide
  (r ≈ +0.29), and the video has to own that number.
- It must not quote total firearm death rates as if they measured violence.
  In New England those rates are mostly suicide, and they rank the six states
  differently than homicide does.
