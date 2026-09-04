# Task — Experiment B: race-specific mobility Markov model

Full design context: `experiments/PLAN.md`, section "Experiment B". Read it first.

## Boundaries

- **Do not** run `git`. **Do not** touch `Paper/`, `.mcp.json`, `debate/`, or anything
  outside `experiments/markov_mobility/`.
- You create the directory `experiments/markov_mobility/` and everything in it.
- Network is ON — use it only to download the public datasets named below.
- You may create and use a local venv inside the directory
  (`experiments/markov_mobility/.venv`) or use `.venv` at repo root if it already has
  numpy/pandas/scipy/matplotlib. Do not add anything to repo-root requirements files.

## Anti-fabrication — `AGENTS.md`, MANDATORY

Every number in `FINDINGS.md` and every transition probability in the model must come from a
dataset you actually downloaded and can point to by file, table, and column. Record the
exact download URL, the file name, the retrieval date, and the specific columns used. If a
dataset you expected is not publicly downloadable, say so and use the next best documented
source. Do not synthesize a transition matrix from memory or from a paper's prose.

## Build

1. **Data.** Obtain race-specific parent→child income-rank (or quintile) transition data.
   Primary: Opportunity Insights, *Race and Economic Opportunity in the United States*
   (Chetty, Hendren, Jones, Porter 2020) — `https://opportunityinsights.org/data/`, the
   "Race and Economic Opportunity" table set. Find the table that gives, by child race,
   the distribution of child income rank conditional on parent income rank (or the
   quintile-to-quintile transition counts/rates). Cross-check the shape against one other
   public source if you can open one (PSID published transition matrices, or a
   peer-reviewed table). Save raw downloads under `data/raw/`, processed matrices under
   `data/processed/`.

2. **Fit** `P_black` and `P_white` as row-stochastic 5x5 quintile transition matrices.
   Document every cell's provenance (which data cell it came from, any smoothing).

3. **Compute**, per race, and write to `results/`:
   - stationary distribution (left eigenvector for eigenvalue 1),
   - expected first-passage time from bottom quintile to top quintile,
   - mixing time (e.g. total-variation distance to stationary < 1/4),
   - if you can obtain a documented public incarceration/detachment rate by race
     (BJS), add one lightly-absorbing state and report absorption probability from the
     bottom quintile; if the data is not cleanly available, skip this and say so.

4. **Policy-as-operator demonstration.** Construct `Delta` such that `P' = row_normalize(P + Delta)`
   applies the *same* operator to both `P_black` and `P_white` (race-blind by construction).
   Show the racial gap in the stationary distribution that persists under this race-blind
   `Delta`. Then construct a second `Delta` targeted at the specific transition that
   binds mobility for the disadvantaged matrix and show the gap it closes. Report both.

5. **Framework connection** (`FINDINGS.md`, one section): tie this to the manuscript's
   treatment of policy as an operator and its "facially neutral" claim - a race-blind
   operator that leaves the stationary racial gap intact is the dynamical statement of
   that claim. Keep it to what the model actually shows. Do not overclaim.

## Deliverables in `experiments/markov_mobility/`

- `README.md` - what this is, data sources with URLs + retrieval dates, how to run.
- `markov.py` - deterministic, single entry point, reproducible from `data/processed/`.
- `data/raw/`, `data/processed/`, `results/`, `figures/`.
- `FINDINGS.md` - per-claim data provenance table; the computed quantities; the two
  policy-operator results; the framework-connection section; a "limitations / unverified"
  section (small-cell smoothing, single-cohort data, rank vs quintile choice, etc.).

Do not run any build of the manuscript. Print MEMO-COMPLETE when `FINDINGS.md` is written.
