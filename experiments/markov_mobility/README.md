# Race-specific mobility Markov model

This experiment treats Opportunity Insights' pooled-gender, household-income quintile transition tables as race-specific Markov kernels. It computes invariant distributions, expected Q1-to-Q5 first-passage times, worst-case total-variation mixing times, and two policy-operator demonstrations.

## Data

The authoritative input is Opportunity Insights/Census Online Data Table 2, downloaded on 2026-09-03 from:

- CSV: https://www2.census.gov/ces/opportunity/table_2-3.csv
- Stata: https://www2.census.gov/ces/opportunity/table_2.dta
- Codebook: https://www2.census.gov/ces/opportunity/table_2.pdf

The fitted matrices use rows `kid_race=Black, gender=P` and `kid_race=White, gender=P`. For parent quintile `j` and child quintile `i`, the source column is `kfr_q[i]_cond_par_q[j]`: child household income conditional on parent household income. Complete hashes and the separate public shape cross-check are in `data/raw/SOURCES.md`.

Each of the 50 model cells is documented in `data/processed/transition_cells.csv`. Published values are rounded to four significant digits, so each five-cell parent row is divided by its observed row sum. This is the only fitting adjustment; no smoothing or imputation is used.

## Run

Python 3.11, NumPy 2.2.2, and the standard library are sufficient for the committed processed data:

```bash
python3 experiments/markov_mobility/markov.py
```

To regenerate processed cells from the downloaded CSV and then rerun every result:

```bash
python3 experiments/markov_mobility/markov.py --prepare
```

Outputs are overwritten deterministically in `results/`, `figures/`, and `FINDINGS.md`. The script reads only local files and performs no downloads.

## Output map

- `data/raw/`: downloaded primary files, codebook, and public matrix cross-check
- `data/processed/transition_cells.csv`: long-form fitted cells with source row and column
- `data/processed/provenance.json`: machine-readable source metadata
- `results/matrices.csv`: fitted 5×5 matrices
- `results/metrics_and_policy.json`: baseline metrics and both policy scenarios
- `results/validation.json`: stochasticity, checksums, and CSV/Stata equality check
- `figures/stationary_top_gap.svg`: policy-scenario stationary-gap comparison
- `FINDINGS.md`: numerical findings, claim-level provenance, framework connection, and limitations

## Interpretation boundary

Iteration of an intergenerational table is a mathematical extrapolation. The stationary vectors are properties of fixed fitted kernels. They are not population forecasts or causal policy estimates. The incarceration extension is omitted because a race-specific prevalence snapshot does not identify a cohort- and quintile-aligned state-entry probability.
