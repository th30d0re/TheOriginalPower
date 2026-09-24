# Plan for Kimi: are Boston shootings still concentrated in formerly redlined neighborhoods?

Owner's question: overlay the 1938 HOLC redlining map of Boston with a map of shootings and
see whether shootings are still concentrated in the previously redlined communities. The
result may feed a card in the Chapter 135 rebuttal video (G-06 uses the HOLC map) and,
if it holds up, a Boston case in the manuscript.

Dispatch as three sequential runs, one stage each, with a commit-free check of the disk
between stages. Each stage stays well under Kimi's 900 s background-task ceiling. Use bare
`kimi -p "$(cat <stage prompt>)"`, no `--yolo`, `--auto` or `--print`.

## What already exists in this repo (reuse it, do not rebuild it)

The book already has an HOLC overlay pipeline, "CS9 Spatial Confluence", for six cities.

- Notebook: `Paper/scripts/eq47_51_spatial_overlay.ipynb`
- Fetch script: `Paper/scripts/fetch_spatial_data.py` (six-layer cache under `Paper/data/spatial/`)
- Helpers: `Paper/scripts/spatial_utils.py` (`load_holc`, `load_holc_crosswalk`,
  `load_tiger_tracts`, `load_acs`, `build_tract_panel`, `gva_to_tract_density`, folium overlays)
- Environment: `Paper/scripts/spatial_env.yml`; also `Paper/scripts/test_overlay.py`
- Data: `Paper/data/spatial/holc_<city>.geojson`, `acs_<city>.csv`, `merged_tract_panel_<city>.parquet`,
  `tiger_tracts_<state fips>.parquet`, national cache `_holc_national_cache.geojson` (72 MB)
- Manuscript references: `Paper/The_Original_Power.tex` around lines 9000 to 9075 (data sources,
  reproducibility paragraph, six per-city figures). Companion writeup:
  `Paper/Empirical_Validation_Companion.tex`. Related chapter: `Paper/chapter_environmental_racism.tex`
  (lines about redlining as a persistent state variable). The Baltimore panel exists; Boston does not.

Boston is missing. The task is to add Boston with real incident data.

## The integrity problem in the existing pipeline (read before touching anything)

`fetch_spatial_data.py` Layer 5 writes the firearm layer as **programmatic synthetic
incidents seeded inside a city bounding box** (`_write_gva_synthetic`, header
`source=modeled_synthetic_not_gun_violence_archive`). The book's reproducibility paragraph
says so, but the per-city figures and their percentages are built on that layer, so they do
not measure real shootings. Also, in the same script, EJScreen lead values and, as a last
resort, HOLC grades can be modeled stand-ins.

Rules for this task:

1. Use **only real data** for Boston. No synthetic, modeled, or bbox-seeded incidents, no
   placeholder HOLC polygons. If a real source cannot be fetched, stop and report.
2. Do not modify or rerun the existing six-city pipeline and do not edit any `.tex` file. Record
   in the findings file, as a separate item, that the existing firearm layer is synthetic and
   which manuscript figures depend on it. The owner decides what to do about that.
3. Every number in the results must trace to a file this task wrote from a downloaded source.

## Data sources (verify each; report the exact file, URL, date fetched and row counts)

- **HOLC polygons for Boston.** University of Richmond, Mapping Inequality (American
  Panorama). Boston polygons: try `https://dsl.richmond.edu/panorama/redlining/data/MA-Boston.geojson`
  (this URL answered HTTP 200 on 2026-09-24) or the national file already cached at
  `Paper/data/spatial/_holc_national_cache.geojson` filtered to city Boston, MA. Keep the grade
  (A, B, C, D), area name, and geometry. The map context page is
  `https://dsl.richmond.edu/panorama/redlining/map/MA/Boston/context`.
- **Shootings.** Analyze Boston (data.boston.gov, CKAN API
  `https://data.boston.gov/api/3/action/package_search?q=shootings`), Boston Police Department
  shooting incidents. Find the resource, check that each row has a date and a latitude and
  longitude, and record the year range. Use real coordinates only. If a shooting has no
  coordinates, count it and drop it from maps; report how many.
- **Census tract geometry and population.** Reuse `tiger_tracts` if a Massachusetts (state FIPS
  25) file is not cached, fetch the Census TIGER/Line 2020 tract shapes for Suffolk County
  (county FIPS 025) and the 2020 decennial population, or ACS 5-year tract population, from
  the Census API. Record which one.
- Optional, only if cleanly available: ACS tract poverty rate and percent Black for controls.

## Stage 1: data (one run)

Write `Paper/scripts/boston_holc_shootings.py` that downloads, caches under
`Paper/data/spatial/boston/`, and validates: HOLC polygons, shootings (raw and cleaned),
tracts with population. Output `Paper/data/spatial/boston/DATA_LOG.md` with sources, dates,
row counts, coordinate coverage per year, and any gaps. Stop condition: fewer than five years
of shootings with coordinates, or HOLC polygons not real Mapping Inequality shapes.

## Stage 2: analysis (one run)

Using only the Stage 1 files:

1. Spatial join each shooting to the HOLC polygon that contains it (grade A, B, C, D, or
   ungraded). Use one projected CRS (EPSG:26986, Massachusetts Mainland) for all area math.
2. For each grade compute: polygon area (km²), residents (areal-weight the tract population into
   the polygons and state the method and its error), shootings, shootings per km², and shootings
   per 10,000 residents per year. Report the citywide baseline the same way.
3. Rate ratios of each grade against grade A and B combined, with exact Poisson 95% confidence
   intervals. Do this for the whole window and by two- or three-year period to show whether the
   pattern is stable.
4. Report the ungraded share honestly. Boston's HOLC coverage does not include all of the
   present city, and later-annexed or unmapped areas are not "not redlined", they are unmapped.
5. A tract-level model as the robustness check: Poisson or negative-binomial regression of
   tract shooting counts on the tract's HOLC exposure (population-weighted share of D and C
   area), with log(population) offset, first alone and then adding poverty rate and percent
   Black. State the result plainly whether or not the HOLC coefficient survives the controls.
   Report spatial autocorrelation of the residuals (Moran's I with `libpysal`/`esda`).
6. Sensitivity: rerun steps 2 and 3 dropping the single densest tract cluster and using only
   the most recent five years.

Write `Paper/data/spatial/boston/RESULTS.md`: tables, sample sizes, the method for every
number, and a plain statement of what the data support. Wording rule for all text you write
(`AGENTS.md`): direct affirmative statements only, with the corrective-contrast constructions the rule lists removed; run
`python3 tools/check_antithesis.py` on your prose files before finishing. Interpretive limit to
state, not argue past: an association between HOLC grade and present shooting counts does not
separate redlining from the poverty, disinvestment and lead exposure that followed it. The
manuscript's own account is that those channels are the mechanism, so the finding reads as
persistence of concentration, not isolated causation.

## Stage 3: figures and outputs (one run)

1. `Paper/figures/boston_holc_shootings_map.png`: HOLC polygons in the standard HOLC colors
   (A green `#76a865`, B blue `#7cb9e8`, C yellow `#ffff99`, D red `#d9534f`), shootings as
   small semi-transparent points or a hexbin density, a clear legend, title with the year
   range and the count of plotted points. No basemap tiles that need a key.
2. `Paper/figures/boston_holc_shootings_rates.png`: bar chart of shootings per 10,000 residents
   per year by HOLC grade with the confidence intervals.
3. A 1080 x 1920 version of the map figure for the video (safe area: keep content between 14% and
   65% of the height and 6% from the sides), same data, larger type.
4. `Paper/chapter135_rebuttal_video/CARD_PROPOSAL_boston_holc.md`: if and only if RESULTS.md
   supports a clean one-sentence claim, propose a card (headline, two or three numbers, sources
   line) in the wording rules above. If the result is mixed, say so and propose nothing.
5. `Paper/scripts/boston_holc_shootings.py` runs end to end from the cached data and prints the
   RESULTS numbers, so the analysis is reproducible.

## Findings and final message

Append or create `Paper/data/spatial/boston/FINDINGS.md`: what was verified, what could not be,
the synthetic-firearm-layer note from the integrity section, and the raw output of the final
script run. Do not commit, do not delete anything, do not modify existing files in `Paper/`
except by adding the new files named above.
