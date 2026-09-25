# RESULTS — New England firearm homicide, gun-law strength, and poverty

Stage 2 of the Chapter 135 rebuttal analysis. Every number below is computed by
`analysis.py` from the Stage 1 files in this directory; the raw run output is in
`FINDINGS.md`. Sources, access dates, and suppression rules are in `DATA_LOG.md`.

**All CDC rates in this document are crude rates per 100,000 population, not
age-adjusted.** The plan asked for age-adjusted rates; CDC WONDER's web service
does not return state-level age-adjusted rates for this dataset, so Stage 1 used
the CDC NCIPC state dashboard's crude rates (documented in `DATA_LOG.md`). Where
a five-year pooled 2020–2024 homicide rate exists it is used; otherwise the 2024
rate is used (New Hampshire and Vermont, whose 2020 and 2021 counts were
suppressed as 1–9 deaths).

## The New England six

Sorted by firearm homicide rate (crude; pooled 2020–2024 where available, else
2024):

| State | FA homicide | FA homicide 2024 | Total FA deaths 2020–24 | Giffords | Everytown | Poverty 2024 (SAIPE) |
|-------|------------|------------------|--------------------------|----------|-----------|----------------------|
| New Hampshire | 0.80 (2024) | 0.8 | 10.07 | F / #34 | #43 | 7.3% |
| Maine | 1.41 (pooled) | 1.1 | 12.84 | C+ / #21 | #21 | 10.6% |
| Massachusetts | 1.57 (pooled) | 1.4 | 3.79 | A / #5 | #3 | 9.8% |
| Rhode Island | 1.69 (pooled) | 1.1 | 4.86 | A- / #12 | #13 | 12.0% |
| Vermont | 1.90 (2024) | 1.9 | 12.42 | B- / #18 | #17 | 9.3% |
| Connecticut | 2.78 (pooled) | 1.9 | 6.45 | A / #3 | #5 | 10.1% |

Total firearm death rates are dominated by suicide in these states, and the two
measures rank the six states differently. Maine has the second-lowest homicide
rate and the highest total firearm death rate in the group (13.0 in 2024, 12.84
pooled, both above Vermont's 11.7 and 12.42);
Massachusetts has the lowest total rate and sits in the middle on homicide. Any
comparison that quotes "gun deaths" for New England is quoting mostly suicide,
and it produces a different ranking than firearm homicide does.

Within New England, law strength and homicide run opposite to the national
bivariate pattern: New Hampshire holds the weakest rankings (Giffords F, #34;
Everytown #43) and the lowest homicide rate, while Connecticut holds top-tier
rankings (Giffords A, #3; Everytown #5) and the highest homicide rate of the
six. Six states are too few for inference; this paragraph describes the table.

## Correlations, all 50 states + DC

Gun-law rank runs 1 = strongest for both publications, so a **positive**
coefficient means states with weaker laws have higher homicide. Pearson CIs are
Fisher z; Spearman CIs are a 10,000-draw bootstrap. Poverty is SAIPE (2024 for
the 2024 spec; the 2020–2024 mean for the pooled and primary specs). DC has no
law ranking, so the law-strength rows run on n = 50 (48 for the pooled spec,
which also drops New Hampshire and Vermont).

### Primary homicide measure (pooled 2020–2024 where available, else 2024)

| Pair | Pearson r [95% CI] | Spearman rho [95% CI] | n | p (Pearson) |
|------|--------------------|-----------------------|---|-------------|
| Giffords rank vs homicide | +0.29 [+0.01, +0.53] | +0.25 [−0.03, +0.51] | 50 | 0.042 |
| Everytown rank vs homicide | +0.23 [−0.05, +0.48] | +0.17 [−0.13, +0.46] | 50 | 0.103 |
| Poverty vs homicide | **+0.72 [+0.56, +0.83]** | +0.72 [+0.53, +0.84] | 51 | 2.5e-09 |

### 2024 homicide rate

| Pair | Pearson r [95% CI] | Spearman rho [95% CI] | n | p (Pearson) |
|------|--------------------|-----------------------|---|-------------|
| Giffords rank vs homicide | +0.31 [+0.04, +0.54] | +0.30 [+0.01, +0.54] | 50 | 0.028 |
| Everytown rank vs homicide | +0.25 [−0.03, +0.50] | +0.21 [−0.10, +0.50] | 50 | 0.075 |
| Poverty vs homicide | +0.74 [+0.58, +0.84] | +0.65 [+0.43, +0.81] | 51 | 7.0e-10 |

### Pooled 2020–2024 homicide rate

| Pair | Pearson r [95% CI] | Spearman rho [95% CI] | n | p (Pearson) |
|------|--------------------|-----------------------|---|-------------|
| Giffords rank vs homicide | +0.30 [+0.02, +0.54] | +0.27 [−0.02, +0.53] | 48 | 0.035 |
| Everytown rank vs homicide | +0.27 [−0.02, +0.51] | +0.22 [−0.10, +0.50] | 48 | 0.069 |
| Poverty vs homicide | +0.71 [+0.53, +0.83] | +0.69 [+0.49, +0.83] | 49 | 1.2e-08 |

## Regressions: law rank before and after controls

OLS on the primary homicide measure (pooled where available, else 2024), per
rank position. Controls: SAIPE poverty rate (2020–2024 mean) and the ACS
2020–2024 Gini index. Percent urban is not in the Stage 1 files; that control
is a gap, listed in `FINDINGS.md`.

| Model | Law-rank coefficient | p | R² |
|-------|----------------------|---|----|
| Giffords rank alone | +0.071 | 0.042 | 0.084 |
| Giffords rank + poverty + Gini | −0.004 | 0.89 | 0.593 |
| Everytown rank alone | +0.057 | 0.103 | 0.054 |
| Everytown rank + poverty + Gini | −0.002 | 0.94 | 0.593 |

In the controlled models, poverty carries the association (coefficient ≈ +1.13
per percentage point, p ≈ 2e-6) and the Gini coefficient is not significant
(p ≈ 0.78). The same pattern holds for the 2024 and pooled specs (see
`FINDINGS.md`). The direction of the bivariate law-rank association is toward
stricter laws pairing with less homicide, and its size is weak (r ≈ 0.3). After
controls, the law-rank coefficient is statistically indistinguishable from zero.

## What the data support, in three sentences

1. Across the 50 states and DC, the poverty rate tracks the firearm homicide
   rate at r ≈ 0.72 (95% CI [0.56, 0.83], n = 51) — a strong, robust
   association that appears in every specification, above the 0.6 that was
   expected.
2. Gun-law strength ranks show a weak bivariate association with homicide
   (r ≈ 0.23–0.31 in rank terms, with stricter laws pairing with less
   homicide) that contradicts the expectation of no bivariate relationship, and
   the association disappears once poverty and inequality are controlled, which
   leaves this dataset unable to detect an independent effect of law strength
   in either direction.
3. Inside New England, the weakest-law state (New Hampshire) has the lowest
   firearm homicide rate and a top-ranked law state (Connecticut) has the
   highest, so a New-England-only table cannot argue that strict laws produce
   the region's low homicide rates; it also cannot argue the reverse, because
   six states settle nothing.

## Literature context

RAND's gun-policy review rates evidence law by law rather than ranking whole   <!-- antithesis-ok: factual description of RAND's per-policy method -->
states: it finds moderate evidence that background checks decrease firearm and
total homicides, limited evidence that licensing and permitting requirements
decrease firearm and total homicides, and moderate evidence that waiting
periods decrease total homicides
([rand.org/research/gun-policy/analysis.html](https://www.rand.org/research/gun-policy/analysis.html),
accessed 2026-09-24). Its 2023 update reports supportive evidence — RAND's
strongest designation — that child-access-prevention laws reduce firearm
homicides and self-injuries among youth
([RAND press release, 2023-01-10](https://www.rand.org/news/press/2023/01/10.html)).
State-level cross-sections like this one carry known confounds — population
density, poverty, illicit-market firearm flows across state lines, and small
death counts in low-population states — which is why RAND's favored designs are
within-state changes over time rather than fifty-state snapshots. The New   <!-- antithesis-ok: factual description of RAND's preferred study design -->
England counts are genuinely small: New Hampshire and Vermont had years
suppressed below 10 deaths, and their 2024 counts (11 and 12) sit near the
NCHS reliability floor of 20.

## Method notes

- Homicide measure: CDC NCIPC `FA_Homicide` (deaths from firearm homicide);
  total firearm deaths are the separate `FA_Deaths` measure and are reported
  alongside, labeled. Both are crude per 100,000.
- Pooled rate = sum of 2020–2024 deaths / sum of 2020–2024 Census population
  estimates × 100,000, computed only where all five yearly counts were
  unsuppressed.
- Figures: `Paper/figures/gunlaws_ne_scatter_{giffords,everytown,poverty}.png`
  and the 1080×1920 card `Paper/figures/gunlaws_ne_card.png`.
- The video may claim what appears in this file and no more.
