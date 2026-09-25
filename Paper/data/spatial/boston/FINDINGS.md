# Boston HOLC x Shootings — Findings

Status: **Stages 1 (data), 2 (analysis), and 3 (figures and outputs) complete.**

## What was verified (artifact contact)

- **HOLC 1938 Boston polygons.** Opened the downloaded GeoJSON
  `Paper/data/spatial/boston/holc_boston_1938.geojson` (55,203 bytes, fetched
  2026-09-25 from
  `https://dsl.richmond.edu/panorama/redlining/static/citiesData/MABoston1938/geojson.json`,
  the same endpoint the Mapping Inequality map application loads; located by reading the
  application bundle `index.js`). It contains 41 real Mapping Inequality area polygons:
  grades A:1, B:8, C:18, D:12, plus 2 ungraded (`Commercial`, `Industrial`). Area labels
  A1…D12 match the HOLC labeling scheme. Total mapped area 91.03 km² (EPSG:26986).
  Validation gate: all four grades present, all geometries (Multi)Polygon.
- **Shootings with real coordinates.** Opened the Analyze Boston (data.boston.gov)
  dataset "Crime Incident Reports (August 2015 - To Date) (Source: New System)", CKAN
  package `crime-incident-reports-august-2015-to-date-source-new-system`; resource URLs
  read from the live `package_show` record. Rows flagged `SHOOTING` in {1, Y, YES, TRUE,
  T} yield 7,018 offense rows, 6,256 unique incidents after de-duplication on
  `INCIDENT_NUMBER`, of which 6,110 carry coordinates inside the Boston envelope. Twelve
  calendar years (2015–2026) each have ≥100 geocoded incidents, clearing the five-year
  stop condition. Incident dates span 2015-06-16 to 2026-09-20; 2015 and 2026 are
  partial years.
- **Tract geometry and population.** Opened Census TIGER/Line 2020
  `tl_2020_25_tract.zip` (235 of 1,620 Massachusetts tracts lie in Suffolk County, FIPS
  25025) and the Census Reporter API response (release "ACS 2024 5-year", tables B01003,
  B17001, B02001; Suffolk County tract population total 785,121; zero unmatched tracts).

## What could not be verified / gaps

- The dedicated Analyze Boston "Shootings" victimization dataset (2,258 rows,
  2015–2026) has no coordinate columns. It is cached as
  `shootings_victimizations_no_coordinates.csv` and excluded from mapping. The mapping
  dataset therefore counts BPD incident reports flagged as shootings, a different
  accounting unit than victimizations.
- The plan's suggested URL `https://dsl.richmond.edu/panorama/redlining/data/MA-Boston.geojson`
  answers HTTP 200 but serves the site's single-page-app shell, not GeoJSON. The working
  per-city path is `…/static/citiesData/MABoston1938/geojson.json`.
- api.census.gov redirected keyless queries to `missing_key.html` on 2026-09-25, so
  population comes from the Census Reporter API (ACS 2024 5-year) instead of the 2020
  decennial. ACS 5-year estimates carry sampling error; margins of error are in the
  cached JSON under each table's `error` key.
- Flagged shooting counts jump from 170 (2018) to 810 (2019) and stay elevated through
  2025. This points to a BPD flagging or recording practice change around 2019; Stage 2
  should report periods within one regime or carry this caveat explicitly.
- HOLC coverage is the 1938 survey footprint (91.03 km² of the city's ~125 km² land
  area). Present-day areas outside the map are unmapped, not "not redlined".

## Integrity note: the existing six-city firearm layer is synthetic

`Paper/scripts/fetch_spatial_data.py` Layer 5 (`_write_gva_synthetic`, line 720) writes
`Paper/data/spatial/gva_incidents_<city>.csv` as deterministic, bounding-box-seeded
synthetic incidents. The header of every cached file confirms it, e.g.:

```
# source=modeled_synthetic_not_gun_violence_archive,seed=80057335,ucr_annual_murder_proxy=200,bbox,years=2014-2023
```

All six cached files (baltimore_md, detroit_mi, memphis_tn, milwaukee_wi, nashville_tn,
washington_dc) carry this header. These layers feed the tract firearm-density numbers in
the CS9 "Spatial Confluence" case study in `Paper/The_Original_Power.tex` (lines
~9019–9074): the "Numerical results" paragraph's GVA density ratios (≈1.12 Baltimore,
≈1.51 Nashville, ≈1.20 Memphis, ≈1.09 Detroit, ≈0.65 Washington DC, ≈0.62 Milwaukee) and
the six per-city figures `figures/spatial/cs9_overlay_{memphis_tn,detroit_mi,
nashville_tn,baltimore_md,washington_dc,milwaukee_wi}.png`, plus the firearm panel of
`figures/spatial/cs9_pooled_stats.png`. The manuscript discloses the modeling path in
the "Data-gap and modeled layers" paragraph (line ~9029), so the dependency is
documented in the text; the owner decides what to do about the percentages computed on
the synthetic layer. The Boston Stage 1 pipeline does not use, modify, or rerun that
layer. The same script can emit modeled EJScreen lead values and last-resort placeholder
HOLC polygons (line ~9029 describes both); those stand-ins are also out of scope here.

## Raw output of the final Stage 1 run

```
[cache] HOLC Boston 1938 polygons (Mapping Inequality): holc_boston_1938.geojson (55,203 bytes)
[HOLC] 41 polygons, grades={'C': 18, 'D': 12, 'B': 8, 'ungraded': 2, 'A': 1}, area=91.0 km2
[cache] Analyze Boston 'Shootings' victimization dataset (no coordinates): shootings_victimizations_no_coordinates.csv (215,851 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2015: cir_2015.csv (9,677,368 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2016: cir_2016.csv (17,704,002 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2017: cir_2017.csv (18,056,131 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2018: cir_2018.csv (17,694,727 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2019: cir_2019.csv (14,055,279 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2020: cir_2020.csv (12,626,067 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2021: cir_2021.csv (12,941,444 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2022: cir_2022.csv (13,201,623 bytes)
[cache] Crime Incident Reports: Crime Incident Reports - 2023 to Present: cir_2023_to_present.csv (55,290,195 bytes)
[shootings] 6256 unique incidents, 6110 with valid coords, years 2015-2026
[cache] TIGER/Line 2020 tracts, Massachusetts (state 25): tl_2020_25_tract.zip (4,402,386 bytes)
[cache] Census Reporter ACS 5-year, Suffolk County tracts: censusreporter_acs_25025.json (619,653 bytes)
[tracts] Suffolk County: 235 tracts, ACS ACS 2024 5-year, population total 785,121, unmatched 0
[log] wrote /Users/emmanuel/Documents/Theory/TheOriginalPower/Paper/data/spatial/boston/DATA_LOG.md
Stage 1 validation passed: real HOLC polygons, >=5 years of geocoded shootings, tract population complete.
```

## Files written by Stage 1 (all new; nothing existing modified)

- `Paper/scripts/boston_holc_shootings.py`
- `Paper/data/spatial/boston/holc_boston_1938.geojson`
- `Paper/data/spatial/boston/cir_{2015..2022,2023_to_present}.csv` (raw sources)
- `Paper/data/spatial/boston/shootings_victimizations_no_coordinates.csv` (record only)
- `Paper/data/spatial/boston/shootings_raw.csv`, `shootings_clean.csv`,
  `shootings_per_year_coverage.csv`
- `Paper/data/spatial/boston/tl_2020_25_tract.zip`, `tiger_25/` (extracted shapefile),
  `tiger_tracts_25025.parquet`
- `Paper/data/spatial/boston/censusreporter_acs_25025.json`, `acs_2024_5yr_25025.csv`
- `Paper/data/spatial/boston/fetch_manifest.json`, `DATA_LOG.md`, `FINDINGS.md`

---

# Stage 2 (analysis) — 2026-09-25

Script: `Paper/scripts/boston_holc_shootings_analysis.py` (new; runs from the Stage 1
caches only). Full results: `Paper/data/spatial/boston/RESULTS.md`.

## What was verified (artifact contact)

- **Corrected shooting measure.** Read every offense description among the 6,256 flagged
  incidents in `shootings_clean.csv` (file opened, value counts enumerated). The primary
  measure includes six descriptions — two aggravated-assault variants, two murder /
  non-negligent-manslaughter spellings (including "NEGLIGIENT"), and the two Migrated
  Report equivalents (aggravated assault, criminal homicide). All 80 observed
  descriptions carry an explicit include/exclude decision in RESULTS.md; an unlisted
  description aborts the script. Primary incidents: 1,793; secondary (all flagged):
  6,110.
- **Validation.** Primary incident counts per year were compared against the dedicated
  victimization dataset's row counts (file opened). Every year 2019–2025 agrees within
  the 15% threshold (worst: −10.2% in 2024). Years 2015–2018 read 34–60% below the
  dedicated dataset, matching the pre-2019 under-flagging regime documented above;
  they are flagged REPORT in the table and excluded from the main window.
- **Boston tract classification.** Suffolk County tracts include Chelsea, Revere, and
  Winthrop. Tract numbers 1601–1899 are exactly those municipalities (27 tracts, ACS
  population 118,679); Boston is the 208 tracts numbered below 1600 plus the 98xx/99xx
  special tracts (population 666,442). Zero flagged shootings fall in the non-Boston
  tracts, and the municipal boundaries are water boundaries.
- **Analysis gates.** `tools/check_antithesis.py` on RESULTS.md: no banned
  constructions; one REVIEW finding on the mandated interpretive-limit sentence
  (a plain factual negation, kept).

## What could not be verified / decisions made

- The plan's "2015 to 2025 pooled" sensitivity conflicts with "drop partial 2015 from
  rates" (the 2015 file starts in June). The pooled sensitivity uses 2016–2025; stated
  in RESULTS.md.
- Tract-level robustness: the HOLC C+D-share coefficient is strongly positive alone
  (IRR 6.38) and positive under controlled Poisson (IRR 1.83), but Pearson dispersion
  is 30 and the Poisson standard errors understate uncertainty. Under negative binomial
  (iterated moment alpha = 0.319; the full-MLE NB fails to converge on these counts)
  the coefficient is null (IRR 1.00, 95% CI 0.68–1.46, p = 0.999). Moran's I of the
  controlled residuals is 0.238 (p = 0.001). The supported claim is therefore
  descriptive concentration by grade, stated that way in RESULTS.md.
- Grade populations are areal-weighted from tracts (uniform density within tracts);
  the unmapped category's area includes harbor water from the special tracts, so its
  per-km² rate is diluted. Per-capita rates are the informative column.
- One geocoded incident falls outside all Boston tracts; it enters the citywide count
  and no tract.

## Raw output of the final Stage 2 run

```
[geo] Boston tracts: 208 (pop 666,442); non-Boston Suffolk tracts: 27 (pop 118,679)
[geo] geocoded incidents outside all Boston tracts: 1
[measures] primary incidents: 1,793; secondary (all flagged): 6,110
[pop] grade populations: {'A': 2979, 'B': 33900, 'C': 319307, 'D': 178175, 'ungraded': 58819, 'unmapped': 73263}
[log] wrote .../Paper/data/spatial/boston/RESULTS.md

=== primary, 2019–2025 ===
            grade  shootings  area_km2  population  per_km2  per_10k_per_year
                A          5      2.10        2979     2.39             2.397
                B          6      6.73      33900     0.89             0.253
                C        698     50.67     319307    13.78             3.123
                D        391     19.77     178175    19.78             3.135
         ungraded         56     11.55      58819     4.85             1.360
         unmapped         41    188.71      73263     0.22             0.799
citywide (Boston)       1197    279.53     666442     4.28             2.566
   grade  rate_ratio_vs_AB  ci95_lo  ci95_hi
       C              7.33     4.07    14.75
       D              7.36     4.07    14.86
ungraded              3.19     1.65     6.76
unmapped              1.88     0.95     4.05

=== validation ===
 year  primary_incidents  victimizations  diff_pct   flag
 2015                 99             245     -59.6 REPORT
 2016                149             226     -34.1 REPORT
 2017                155             260     -40.4 REPORT
 2018                129             203     -36.5 REPORT
 2019                188             190      -1.1
 2020                286             274       4.4
 2021                197             196       0.5
 2022                173             180      -3.9
 2023                140             143      -2.1
 2024                114             127     -10.2
 2025                124             120       3.3
 2026                 87              94      -7.4

=== tract model ===
                                       model  IRR for C+D share      95% CI        p
                    Poisson: share C+D alone              6.378 4.918–8.272 p<0.0001
          Poisson: + poverty rate, pct Black              1.833 1.411–2.383 p<0.0001
Negative binomial (moment alpha): + controls              1.000 0.683–1.464 p=0.9987
Moran's I: 0.238 p: 0.001
```

## Files written by Stage 2 (all new; nothing existing modified)

- `Paper/scripts/boston_holc_shootings_analysis.py`
- `Paper/data/spatial/boston/RESULTS.md`
- This section of `FINDINGS.md`

---

# Stage 3 (figures and outputs) — 2026-09-25

Script: `Paper/scripts/boston_holc_shootings_figures.py` (new). It imports the Stage 2
module, runs end to end from the Stage 1 caches with no network access, recomputes the
primary-measure 2019–2025 numbers, asserts they match RESULTS.md (grade counts A=5,
B=6, C=698, D=391, citywide 1,197; D rate ratio 7.36, 95% CI 4.07–14.86), and renders
the figures. On plan item 5 naming: the plan's Stage 3 text names
`boston_holc_shootings.py` for the cached-data reproduction run; that file is the Stage
1 fetch script and is unchanged. The reproduction requirement is met by the pair
`boston_holc_shootings_analysis.py` (prints the RESULTS.md tables from cache) and
`boston_holc_shootings_figures.py` (recomputes, asserts, and prints the same numbers,
then writes the figures).

## What was verified (artifact contact)

- Opened all three rendered PNGs after writing them. The map frames the HOLC polygons
  and shooting points (the tract set carries harbor water in the special tracts;
  framing on the full tract extent squeezed the land mass into a corner in the first
  render, so the display extent is the padded bounds of the polygons plus the points).
  HOLC colors are the standard set (A `#76a865`, B `#7cb9e8`, C `#ffff99`, D
  `#d9534f`). Titles carry the 2019–2025 window and the 1,197 plotted-point count.
  No basemap tiles.
- The rates figure plots per-10,000-residents-per-year by grade with exact Poisson
  95% CIs (chi-square inversion on the count; computed in the figures script, the one
  place these per-grade rate CIs appear — RESULTS.md carries the rate-ratio CIs).
  Citywide baseline drawn at 2.57.
- The vertical figure is exactly 1080x1920. All content (title, subtitle, map, legend)
  sits between 14% and 65% of the height and at least 6% from the sides; verified by
  measuring the rendered PNG (title top at 15.5% of the height, legend bottom at 64%).
- `tools/check_antithesis.py` on `CARD_PROPOSAL_boston_holc.md`: no banned
  constructions. The same check on this file: see below.
- The card is PROPOSED, because RESULTS.md supports the one-sentence claim. Its
  wording is limited to what RESULTS.md supports: the C and D rate ratios with their
  intervals against A+B, the persistence-of-concentration reading, and the tract-level
  caveat (negative binomial with controls: IRR 1.00, 95% CI 0.68–1.46).

## What could not be verified / decisions made

- The per-grade rate CIs in the rates figure are exact Poisson intervals around each
  grade's own rate; they do not account for the areal-weighting error in the
  population denominators. Stated in RESULTS.md (boundary slivers).
- The A-grade bar (n=5, population 2,979) sits at 2.40 with a CI of 0.78–5.60; the
  figure shows it as measured. The claim rests on the C and D rates against A+B
  combined, as in RESULTS.md.
- The map legend overlaps a thin strip of southwestern ungraded/unmapped territory in
  both map versions; no dense point cluster is hidden.

## Raw output of the final Stage 3 run

```
[reproduce] primary measure, 2019–2025: 1,197 geocoded shooting-victimization incidents plotted
            grade  shootings  area_km2  population  per_km2  per_10k_per_year
                A          5      2.10        2979     2.39             2.397
                B          6      6.73       33900     0.89             0.253
                C        698     50.67      319307    13.78             3.123
                D        391     19.77      178175    19.78             3.135
         ungraded         56     11.55       58819     4.85             1.360
         unmapped         41    188.71      73263     0.22             0.799
citywide (Boston)       1197    279.53      666442     4.28             2.566
   grade  rate_ratio_vs_AB  ci95_lo  ci95_hi
       C              7.33     4.07    14.75
       D              7.36     4.07    14.86
ungraded              3.19     1.65     6.76
unmapped              1.88     0.95     4.05
   grade  rate  ci_lo  ci_hi
       A 2.397  0.779  5.596
       B 0.253  0.093  0.550
       C 3.123  2.895  3.363
       D 3.135  2.832  3.462
ungraded 1.360  1.027  1.766
unmapped 0.799  0.574  1.085
[check] recomputed counts and the D-grade rate ratio match RESULTS.md
[figure] wrote .../Paper/figures/boston_holc_shootings_map.png
[figure] wrote .../Paper/figures/boston_holc_shootings_rates.png
[figure] wrote .../Paper/figures/boston_holc_shootings_map_vertical.png (1080x1920)
```

## Files written by Stage 3 (all new; nothing existing modified)

- `Paper/scripts/boston_holc_shootings_figures.py`
- `Paper/figures/boston_holc_shootings_map.png`
- `Paper/figures/boston_holc_shootings_rates.png`
- `Paper/figures/boston_holc_shootings_map_vertical.png`
- `Paper/chapter135_rebuttal_video/CARD_PROPOSAL_boston_holc.md`
- This section of `FINDINGS.md`
