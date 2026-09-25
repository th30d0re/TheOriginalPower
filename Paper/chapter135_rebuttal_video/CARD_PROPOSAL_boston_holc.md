# Card proposal — Boston: the 1938 redlining map and today's shootings

Status: PROPOSED. RESULTS.md (`Paper/data/spatial/boston/RESULTS.md`) supports a clean
one-sentence claim on the primary measure for 2019–2025. The caveat block below is part
of the claim and runs with it.

## Headline

The 1938 redlining map of Boston still marks where shootings concentrate.

## Numbers

- Boston recorded 1,197 geocoded shooting-victimization incidents in 2019–2025
  (BPD Crime Incident Reports, primary measure: aggravated-assault and murder /
  non-negligent-manslaughter shootings).
- Areas the 1938 HOLC survey graded D ("hazardous"): 3.14 shooting victimizations per
  10,000 residents per year. Areas graded A and B combined: 0.43. Rate ratio 7.36
  (95% CI 4.07–14.86, exact Poisson).
- Areas graded C ("definitely declining"): 3.12 per 10,000 per year, rate ratio 7.33
  (95% CI 4.07–14.75). The C and D rates are statistically indistinguishable; both sit
  roughly seven times the A+B rate. 91% of the 1,197 incidents fall in C- or D-graded
  territory.
- The gap holds in the 2016–2025 pooled window, in 2021–2025, in both sub-periods,
  under the shots-fired secondary measure, and with the densest tract cluster removed.

## Caveat (part of the claim, not optional)

The tract-level model does not separate the 1938 grade from the poverty and racial
composition that followed it: with poverty rate and percent Black controlled and the
heavy overdispersion modeled (negative binomial), the HOLC-exposure coefficient is null
(IRR 1.00, 95% CI 0.68–1.46). The card claims persistence of concentration. It makes
no isolated-causation claim; poverty, disinvestment, and lead exposure are the
manuscript's stated mechanism.

## Sources

- HOLC 1938 Boston area polygons: Mapping Inequality, University of Richmond Digital
  Scholarship Lab (dsl.richmond.edu/panorama/redlining).
- Shootings: Analyze Boston (data.boston.gov), "Crime Incident Reports (August 2015 -
  To Date)", SHOOTING-flagged incidents with valid coordinates.
- Population: Census TIGER/Line 2020 tracts; ACS 2024 5-year via Census Reporter,
  areal-weighted into HOLC polygons.
- Analysis: `Paper/data/spatial/boston/RESULTS.md` (method per number).
- Figures: `Paper/figures/boston_holc_shootings_map.png`,
  `Paper/figures/boston_holc_shootings_rates.png`,
  `Paper/figures/boston_holc_shootings_map_vertical.png` (1080x1920).
