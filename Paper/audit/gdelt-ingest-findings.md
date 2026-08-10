# GDELT Per-Axis File-Server Ingest Findings

Model: GPT-5  
Execution date: 2026-08-09

## What Was Requested

Populate `Paper/data/raw/gdelt_per_axis_raw.csv` with real GDELT theme counts,
generate `Paper/data/gdelt_per_axis.csv`, avoid BigQuery, probe the three public
routes before selecting one, and record the route evidence, coverage, sampling,
gaps, taxonomy, and source spot checks.

## Correction Run

The authorized correction broadened the sexuality theme prefix from `LGBTQ` to
`LGBT`. The expression now matches the v1 archive's `LGBT` token, `LGBTQ`, and
tokens beginning with the same prefix. The retained 141-file cache was
re-aggregated without another download, and `make data-refresh` regenerated the
processed datasets.

The authorized provenance correction changed the generated
`Paper/data/gdelt_per_axis.csv` header. It now identifies GDELT 1.0 daily GKG
from the public file server, the single-day-per-month sample on the 15th, and
the 2013-04 through 2024-12 coverage span.

## Route Selected

The ingest uses the public GDELT 1.0 daily GKG archive at
`http://data.gdeltproject.org/gkg/`. It downloads the file for the 15th day of
each month from 2013-04 through 2024-12, reads `THEMES`, and weights each GKG
record by `NUMARTS`. The output therefore contains observed article counts for
one consistently selected calendar day per month. Counts are not extrapolated
to full-month estimates.

This route was the lightest route that exposed the authoritative GKG theme
field during execution. The completed cache contains 141 ZIP files and occupies
4.6 GiB. The script downloads sequentially, waits 0.5 seconds after each
uncached response, retries with exponential backoff, validates each ZIP, and
caches files at `/tmp/the-original-power-gdelt-cache/`.

The fixed date controls the sampling rule across the series. The 15th rotates
through weekdays over time and avoids month-boundary partial-day ambiguity. A
one-week-per-month sample would have required approximately seven times the
completed 4.6 GiB transfer. Full daily aggregation would have required roughly
30 times the completed transfer. The single-day sample preserves 141 monthly
observations within a reasonable public-server workload.

## Route Probes and Rejections

### GDELT 1.0 `gkgcounts`

`20130401.gkgcounts.csv.zip` was downloaded and inspected. Its columns are
`DATE`, `NUMARTS`, `COUNTTYPE`, `NUMBER`, `OBJECTTYPE`, geography fields,
`CAMEOEVENTIDS`, `SOURCES`, and `SOURCEURLS`. `COUNTTYPE` values include numeric
extractions such as `KILL` and `AFFECT`. The file has no `THEMES` column and
cannot implement the four-axis taxonomy. The corresponding full daily GKG file
contains `THEMES` and `NUMARTS`, so the full v1 daily file was selected.

### GDELT 2.0 15-minute GKG files

The public `masterfilelist.txt` was downloaded and measured. GKG v2 files begin
at `20150218230000.gkg.csv.zip`. Through 2024-12-31 the list contains 340,384 GKG
ZIP files totaling approximately 2.40 TiB compressed. A current probe entry was
2.2 MiB compressed and the first entry was 10.8 MiB compressed. This route has
lower historical coverage than v1 and an excessive file count and transfer
volume for monthly aggregation.

### GDELT DOC 2.0 API

The API was probed with `mode=timelinevolraw`, JSON output, and the authoritative
`theme:DISCRIMINATION` query. A 2017 year request returned HTTP 429 on the first
request and its delayed retry. A second probe used a single month
(2024-01), a descriptive user agent, a ten-second delay, and no automatic
retry; it also returned HTTP 429. The endpoint was therefore unavailable for
rate-limited research retrieval during execution. No DOC-derived values were
used.

## Coverage and Gaps

The v1 archive index ends at `20130401.gkg.csv.zip`; no earlier daily GKG file is
listed. That file was downloaded and confirmed to contain populated `THEMES`.
The true usable theme coverage start is therefore 2013-04-01. The first sampled
month is 2013-04 and the last is 2024-12.

All 141 requested sample dates were retrieved and parsed. There are no omitted
months or retrieval gaps in the output.

The brief's suggested pre-2013 Events fallback cannot supply this taxonomy.
The empirical file-server evidence supports 2013-04 as the start of usable GKG
theme data.

## Theme Matching

The ingest applies the following case-insensitive substring expressions. The
sexuality expression contains the authorized v1 correction:

| Axis | Expression applied to `THEMES` | v1 tokens observed in the probe |
|---|---|---|
| Race | `discrimination|civil_rights|race_relations|protest|racial|ethnicity` | `DISCRIMINATION`, `PROTEST`, `TAX_ETHNICITY`, and `TAX_ETHNICITY_*` |
| Gender | `women|gender_discrimination|feminism|sexual_harassment` | `TAX_FNCACT_WOMEN` and `MOVEMENT_WOMENS` through the `women` substring |
| Religion | `religion|religious_rights|evangelical|prayer` | `RELIGION`, `TAX_RELIGION`, and `TAX_RELIGION_*` |
| Sexuality | `lgbt|gay_rights|transgender|homosexual` | `LGBT` and tokens beginning with `LGBT` |

The `LGBT` prefix covers the v1 archive token, `LGBTQ`, and more specific theme
tokens sharing that prefix. Re-aggregation produces a positive sexuality count
in all 141 sampled months.

Each axis is counted once per GKG record when any expression term occurs.
`NUMARTS` supplies the record's article multiplicity for both the matched axis
and `total_count`. A document may contribute to multiple axes, so axis counts
are individually bounded by the denominator while their sum need not be.

## Source Spot Checks

Three cached source ZIPs were independently recomputed with an AWK scan of
`NUMARTS` and `THEMES`. Each result exactly matches the raw CSV row:

| Month / source date | Race | Gender | Religion | Sexuality | Total | Result |
|---|---:|---:|---:|---:|---:|---|
| 2013-04 / 2013-04-15 | 6,703 | 663 | 1,531 | 150 | 13,656 | exact match |
| 2018-06 / 2018-06-15 | 79,894 | 11,401 | 17,904 | 2,669 | 197,028 | exact match |
| 2024-12 / 2024-12-15 | 23,090 | 3,465 | 5,185 | 580 | 54,901 | exact match |

## Validation

`Paper/data/raw/gdelt_per_axis_raw.csv` has the required six columns in the
required order, 141 rows, 141 positive `total_count` values, and zero rows in
which an axis exceeds `total_count`. `sexuality_count` is positive in all 141
months, with a minimum of 71 and a maximum of 24,324.

`make data-refresh` completed successfully and wrote
`Paper/data/gdelt_per_axis.csv`. The processed file has 141 rows spanning
2013-04 through 2024-12. Every share is within `[0, 1]` and every denominator is
positive.

The processed file header identifies `GDELT 1.0 daily GKG, public file server`,
records `single day per month (15th)`, and gives the coverage as 2013-04 through
2024-12. These statements match the raw ingest route and observed output span.

The dataset provides monthly sampling for high-frequency analysis. Its total
span is about 11.75 years, giving frequency spacing of about 0.085 cycles per
year. The ingest does not improve low-frequency resolution and is not presented
as comparable to the 60-year annual congressional series on that basis.

## Challenges Encountered

1. The DOC API returned HTTP 429 for both rate-limited probes, preventing a
   semantics and coverage test of the cheapest candidate route.
2. `gkgcounts` lacked the required `THEMES` field despite its much smaller file
   size.
3. A March 2021 GKG record exceeded Python's default 128 KiB CSV field limit.
   The script now raises the limit to the platform maximum before parsing.
4. The original sexuality expression used `LGBTQ`, while the v1 archive exposes
   `LGBT`; the authorized prefix correction required a full cached
   re-aggregation.

## Next Ideas (6 Ideas)

1. Add a regression test requiring the sexuality basket to match representative
   `LGBT`, `LGBTQ`, and subtype tokens from the v1 schema.
2. Add an optional seven-day sampling mode for a future high-bandwidth run and
   quantify sampling variance against the one-day series.
3. Add incremental checkpoint output so a parser failure does not require local
   re-aggregation of every cached month.
4. Retry the DOC API during a documented low-load window and compare its raw
   timeline counts against the three source-file spot checks.
5. Measure weekday sensitivity by sampling a second fixed day from the cacheable
   archive and comparing per-axis shares.
6. Record per-token contribution counts during aggregation to audit broad
   substring matches such as `TAX_ETHNICITY_*` and `TAX_FNCACT_WOMEN`.
