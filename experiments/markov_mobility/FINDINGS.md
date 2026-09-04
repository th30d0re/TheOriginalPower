# Findings — Race-specific mobility Markov model

## Result

The fitted Black and White chains have different long-run distributions under repeated application of the published intergenerational transition matrices. At baseline, the stationary top-quintile share is 5.69% for Black children and 24.12% for White children, an 18.43-percentage-point gap.

The race-blind operator shifts 0.080586880806 of probability mass (8.06 percentage points) in every Q1 parent row from child Q1 to child Q5 for both matrices. The stationary top-share gap remains 17.53 percentage points; this is 95.08% of the baseline gap.

The targeted operator applies the same Q1→Q5 mass shift only to the Black matrix. It closes the fitted one-generation Q1→Q5 transition gap by construction. The stationary top-share gap falls to 15.84 percentage points, a 14.06% reduction from baseline.

## Fitted matrices

Rows are parent household-income quintiles; columns are child household-income quintiles. Published four-significant-digit cells were divided by their row sums. No smoothing was applied.

### Black

| Parent | Q1 | Q2 | Q3 | Q4 | Q5 |
|---:|---:|---:|---:|---:|---:|
| Q1 | 0.373337 | 0.380238 | 0.157716 | 0.063406 | 0.025303 |
| Q2 | 0.300800 | 0.359200 | 0.203900 | 0.093400 | 0.042700 |
| Q3 | 0.253225 | 0.315832 | 0.233323 | 0.128813 | 0.068807 |
| Q4 | 0.210400 | 0.277900 | 0.247100 | 0.162200 | 0.102400 |
| Q5 | 0.167083 | 0.214179 | 0.238476 | 0.200580 | 0.179682 |

### White

| Parent | Q1 | Q2 | Q3 | Q4 | Q5 |
|---:|---:|---:|---:|---:|---:|
| Q1 | 0.290471 | 0.246575 | 0.196080 | 0.160984 | 0.105889 |
| Q2 | 0.208779 | 0.217778 | 0.219678 | 0.206679 | 0.147085 |
| Q3 | 0.154685 | 0.182082 | 0.224078 | 0.244476 | 0.194681 |
| Q4 | 0.113900 | 0.142700 | 0.208300 | 0.268400 | 0.266700 |
| Q5 | 0.086509 | 0.098110 | 0.160416 | 0.243824 | 0.411141 |

Every fitted cell maps to its source row, source column, published value, raw row sum, and fitted value in `data/processed/transition_cells.csv`.

## Computed quantities

The first-passage quantity is the expected number of generational transitions to first reach Q5 from Q1. Mixing time is the smallest integer `t` at which the worst-case total-variation distance from stationarity is strictly below 1/4.

| Race | Stationary distribution Q1…Q5 | Stationary mean quintile | Q1→Q5 first passage | Mixing time |
|---|---|---:|---:|---:|
| Black | `[0.295482, 0.339830, 0.202724, 0.105044, 0.056920]` | 2.288091 | 21.090884 | 2 |
| White | `[0.159683, 0.169097, 0.199874, 0.230100, 0.241246]` | 3.224129 | 5.995967 | 1 |

## Policy operators

The operator amount, 0.080586880806, is the fitted White-minus-Black Q1-parent/Q5-child probability gap. `Δ[Q1,Q1] = -0.080586880806` and `Δ[Q1,Q5] = +0.080586880806`; all other entries are zero. `P′ = row_normalize(P + Δ)`.

| Scenario | Black stationary Q5 | White stationary Q5 | Q5 gap | Mean-quintile gap | Stationary TV distance |
|---|---:|---:|---:|---:|---:|
| Baseline | 0.056920 | 0.241246 | 0.184326 | 0.936038 | 0.309382 |
| Race-blind Δ on both | 0.082843 | 0.258107 | 0.175264 | 0.888114 | 0.297731 |
| Targeted Δ on Black only | 0.082843 | 0.241246 | 0.158403 | 0.820407 | 0.279497 |

The race-blind operator improves both chains' direct bottom-to-top flow. The matrices retain their different remaining rows and transition probabilities, so their invariant distributions remain separated. The targeted demonstration identifies the Q1→Q5 transition because the fitted White probability exceeds the fitted Black probability there and because that transition directly governs the first-passage endpoint used in this experiment.

## Per-claim data provenance

| Claim or quantity | Artifact opened | File / table / columns | Transformation | Provenance tier |
|---|---|---|---|---|
| All 50 fitted transition probabilities | Downloaded Opportunity Insights/Census CSV; independently matched to downloaded Stata release | `data/raw/oi_table_2.csv`, Online Data Table 2, rows `kid_race={Black,White}; gender=P`, columns `kfr_q[i]_cond_par_q[j]` | Parent rows divided by their published row sums | Primary/public statistical release |
| Meaning and orientation of each transition cell | Rendered pages 1–2 of downloaded codebook | `data/raw/oi_table_2_codebook.pdf`, Table 2 codebook | Direct reading of page images | Primary/public documentation |
| Stationary distributions, passage times, mixing times, policy gaps | The processed cells above | `data/processed/transition_cells.csv`, column `fitted_probability` | Deterministic linear algebra in `markov.py` | Derived from primary release |
| Conventional 5×5 parent-row/child-column shape | Rendered PDF page 38 (printed p. 37) | `data/raw/quintile_matrix_crosscheck_2026.pdf`, Appendix Tables A1–A2 | Shape/orientation cross-check only; no values used | Scholarly working paper |

Downloaded artifacts, exact URLs, retrieval dates, and SHA-256 hashes are recorded in `data/raw/SOURCES.md` and `data/processed/provenance.json`.

## Framework connection

In this finite-state model, policy is an operator on transition probabilities. Applying one identical operator to both race-specific matrices leaves a stationary racial gap because the operator changes one row while the remaining race-specific transition structure continues to determine the invariant distribution. This supplies a precise dynamical example of the manuscript's facial-neutrality claim. The demonstration establishes a property of these fitted chains under the stated perturbation. It does not identify a causal policy effect.

## Limitations / unverified

- The Opportunity Insights cells describe children in the study's primary analysis sample and are rounded to four significant digits. Row normalization corrects only the resulting deviations from one; no small-cell smoothing was used.
- The pooled-gender, household-income specification is one cohort design. The stationary distribution extrapolates the same transition kernel across indefinitely many generations and is not an observed population forecast.
- Quintiles discard within-quintile rank movement. The exercise does not fit a continuous-rank process.
- The policy operators are algebraic demonstrations. They do not estimate behavior, general-equilibrium responses, costs, or causal treatment effects.
- An incarceration/detachment state was omitted. A race-specific BJS snapshot is not, by itself, a transition probability aligned to these parent quintiles and cohort timing; converting one would introduce an unverified hazard and state-entry rule.
- The cross-check source confirms matrix shape and orientation only. Its cohorts and sample differ, and its cell values were not used.
- The downloaded Stata and CSV releases matched exactly in a local pandas comparison across all numeric fields. This check is reported in `results/validation.json`; it is a file-integrity cross-check, not an independent estimate.
