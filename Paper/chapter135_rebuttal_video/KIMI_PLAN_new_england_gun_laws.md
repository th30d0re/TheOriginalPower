# Plan for Kimi: New England gun-violence rates, gun-law strength, and poverty

Owner's intent for the Chapter 135 rebuttal video: compare firearm homicide rates across the
New England states (Massachusetts, Connecticut, Rhode Island, New Hampshire, Vermont, Maine), with a
short summary of each state's gun laws, and test what the data show about (a) gun-law strength and
firearm homicide, and (b) poverty and violence. The owner's working expectation is no relationship
for (a) and a correlation near 0.6 for (b). The task is to measure both and report what the data
show, including any result that differs from that expectation. A result that contradicts the
expectation is a valid result and goes into the findings unedited.

Run as two sequential runs (data, then analysis). Bare `kimi -p "$(cat <stage prompt>)"`, no
`--yolo`, `--auto` or `--print`. Do not commit.

## Rules

1. Real, published data only, each value traceable to a URL and access date. No estimates
   filled in from memory. If a value cannot be fetched, leave it blank and list it as a gap.
2. Do not modify existing files. Write new files under `Paper/data/gun_laws_new_england/`.
3. Prose follows `AGENTS.md`: direct affirmative statements. Run
   `python3 tools/check_antithesis.py` on every prose file you write.
4. Firearm homicide and firearm suicide are different measures. The rebuttal is about
   violence against others, so use **firearm homicide** (ICD-10 X93 to X95, Y35.0, and
   assault-by-firearm codes, as CDC defines it), not total firearm deaths, which is
   dominated by suicide in the low-homicide states. Report both, labeled, so the
   difference is visible.

## Variables (all 50 states plus DC, latest full year and a five-year average)

- **Firearm homicide rate per 100,000**, age-adjusted. Sources to try, in order: CDC WONDER
  (Underlying Cause of Death, wonder.cdc.gov, query by state and year), CDC NCHS state
  tables, or a published state compilation such as the Johns Hopkins Center for Gun
  Violence Solutions or KFF, each with URL. Record the years and the suppression rule for
  small counts (Vermont and other low-count states are flagged "unreliable" below 20 deaths;
  use the five-year pooled rate for those).
- **Gun-law strength**, from a named ranking with its own methodology, each with URL and year:
  Giffords Law Center Annual Gun Law Scorecard (letter grade and gun-law strength rank) and
  Everytown Gun Law Rankings. Record both; the analysis runs on each separately.
- **Poverty rate**, Census Bureau, ACS 5-year or SAIPE, same year window, with URL.
- Optional if cleanly available: median household income and the Gini index, ACS.

## Stage 1: data

Write `Paper/data/gun_laws_new_england/build_dataset.py` and produce `states.csv` (one row per
state and DC with every variable, year, source URL column) and `DATA_LOG.md` (sources, dates,
gaps, and every suppressed or unreliable value). Then a `NEW_ENGLAND_LAWS.md` with one short
paragraph per New England state summarizing its major gun laws in plain terms, each fact
with a source (state statute site or the Giffords/Everytown state page): permit to purchase,
assault-weapons ban, magazine limit, background checks on private sales, red-flag law,
waiting period, licensing of carry, and the date of any recent major change. Stop condition:
if firearm homicide by state cannot be obtained from a real source, stop and report.

## Stage 2: analysis

Using only the Stage 1 files, in `Paper/data/gun_laws_new_england/analysis.py`:

1. New England table: state, firearm homicide rate, total firearm death rate, gun-law
   rank and grade (both rankings), poverty rate. Sort by homicide rate.
2. All-states correlations with Pearson and Spearman coefficients, 95% confidence
   intervals (Fisher z or bootstrap), n, and p, for: gun-law strength vs firearm homicide;
   poverty vs firearm homicide. Do both for the latest year and the five-year average.
3. Repeat (2) with a control: firearm homicide on gun-law strength, then adding poverty,
   Gini if available, and percent urban. Report the coefficient on law strength before and
   after the controls. State plainly the direction and the size, whatever they are.
4. A short scatter plot for each correlation in `Paper/figures/`, labeled points for the New
   England states, HOLC-free, palette navy `#0f1b33`, cream `#f4ead2`, gold `#d9a441`,
   teal `#6ec3c0`, red `#e2573f`. Also a 1080 x 1920 card image for the video with the
   New England six in a compact table and the two correlation coefficients.
5. `RESULTS.md`: the numbers, the method, and three plain sentences on what the data
   support. Include the literature context in two or three sentences with sources: RAND's
   gun-policy review rates the evidence for specific laws (for example child-access
   prevention, permit-to-purchase, background checks) separately, and state-level
   cross-sections have known confounds (population density, poverty, illicit-market
   flows across state lines, small counts in the New England states). The video may
   claim what the data in `RESULTS.md` show and no more.
6. `CARD_PROPOSAL.md`: if and only if the results support a clean sentence, propose card
   copy (headline, numbers, sources line) in `AGENTS.md` style, and say which
   correlations it rests on. If the results are mixed, say so and propose nothing.

## Findings

`FINDINGS.md`: what was verified, what could not be, gaps, and the raw output of the final
`analysis.py` run.
