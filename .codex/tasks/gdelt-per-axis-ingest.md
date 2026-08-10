# Brief — GDELT per-axis ingest without BigQuery

## Goal

Populate `Paper/data/raw/gdelt_per_axis_raw.csv` with real monthly per-axis theme counts,
then produce the processed `Paper/data/gdelt_per_axis.csv`. Both files currently exist with
a header row and **no data**.

## Files you own

- `Paper/data/raw/gdelt_per_axis_raw.csv` — the output data
- `Paper/scripts/gdelt_fetch_fileserver.py` — a new script you write
- `Paper/audit/gdelt-ingest-findings.md` — your findings file

Do not modify `Paper/scripts/gdelt_per_axis_query.py`, `preprocess_spectral_data.py`, the
`Makefile`, or any `.tex`. **Do not run `git`.** The orchestrator reviews and commits.

## What is already established — do not re-derive

- `Paper/scripts/gdelt_per_axis_query.py` documents the target schema, the four-axis theme
  taxonomy, and the preprocessing contract. **Read it first.** Its theme taxonomy is
  authoritative; reuse it rather than inventing your own.
- Required raw columns, in order:
  `year_month, race_count, gender_count, religion_count, sexuality_count, total_count`
- `make data-refresh` runs `preprocess_spectral_data.py`, which turns the raw file into
  `Paper/data/gdelt_per_axis.csv` as shares. You may run that target to verify. Do not edit
  the preprocessor.
- **BigQuery is not available and is not to be used.** There are no GCP credentials on this
  machine (`.env` holds only `NYT_API_KEY`) and `gcloud` is not installed. Do not attempt
  to install it, create an account, or authenticate to anything.
- The GDELT **public file server needs no credentials**. Measured today, both return HTTP 200:
  - `http://data.gdeltproject.org/gdeltv2/masterfilelist.txt`
  - `http://data.gdeltproject.org/gkg/index.html` (v1 daily GKG, files like
    `20130401.gkg.csv.zip` and `20130401.gkgcounts.csv.zip`)

## Choose the lightest viable route, and say why

Several public routes exist and they differ enormously in cost. Probe before committing:

1. **v1 daily GKG** (`data.gdeltproject.org/gkg/`) — one file per day since 2013-04. Simple
   but large; check whether `gkgcounts` carries what you need before pulling full `gkg`.
2. **v2 15-minute files** via the masterfilelist — highest fidelity, ~350k files, almost
   certainly too heavy for this purpose.
3. **GDELT DOC 2.0 API** `mode=timelinevol` — returns volume timelines directly and is by
   far the cheapest if its coverage window and query semantics suit the taxonomy.

Pick one, document the choice and the rejected alternatives in the findings file with the
evidence that decided it. A cheaper route that yields the same monthly series is strictly
better.

**Determine the true coverage start empirically rather than trusting any docstring.**
`gdelt_per_axis_query.py` is internally inconsistent — its title says 1979–2024 while its
body says GKG v2 begins 2013-04. GKG carries the themes; the pre-2013 fallback it mentions
points at `gdelt-bq.full.events`, which is the Events table and does **not** carry the GKG
theme taxonomy. Report the actual first month with usable theme data.

## Constraints

- **Be polite to the server.** Rate-limit your requests, retry with backoff, and cache
  anything you download under a gitignored scratch path so a re-run does not refetch. Do not
  parallelise aggressively.
- Aim for monthly aggregates. Daily or 15-minute granularity is an intermediate, not output.
- If total volume would be unreasonable, **sample deliberately and say so** — for example
  one week per month, consistently applied and documented — rather than silently truncating
  the series.
- Never fabricate a row. A month with no retrievable data is omitted, and the gap is listed
  in the findings file.

## Acceptance test

1. `Paper/data/raw/gdelt_per_axis_raw.csv` has the six columns above and at least 100
   monthly rows with non-zero `total_count`.
2. Each axis count is ≤ `total_count` for every row.
3. `make data-refresh` runs clean and `Paper/data/gdelt_per_axis.csv` gains matching rows
   with shares in [0, 1].
4. Spot-check three months against the source and record the comparison in findings.

## Scope note — what this data is and is not for

This series resolves **high-frequency** structure: monthly sampling gives a Nyquist of
6 cyc/yr, which reaches the 2-year midterm cycle that `ch:spectral_carrier` left
indeterminate. It is **not** an instrument for decade-scale resonances, because frequency
resolution is set by total span and a ~12-year span gives ~0.079 cyc/yr. Do not describe it
as improving resolution at low frequencies, and do not compare it against the 60-year annual
congressional series on that basis.

## Findings file

Record: the route chosen and why, the rejected routes with evidence, true coverage start,
any sampling decision, every gap in the series, per-axis theme codes actually matched, and
anything in this brief that turned out to be wrong. Report disagreements there rather than
acting on them.
