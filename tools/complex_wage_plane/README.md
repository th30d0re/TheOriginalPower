# Complex Wage Plane

An interactive instrument for the complex wage $W = \psi_m + j\psi_s$
(`Paper/The_Original_Power.tex`, eq. 2.2a). It draws the Argand plane the way the
manuscript does (`:2876`): $+\psi_m$ points down, $+\psi_s$ points right, and θ starts at
6 o'clock and grows counterclockwise. The phasor is the wage paid to the Buffer Class.

- Published page (private until shared): https://claude.ai/artifact/HmJrBgkVS9jeeWhkdGbXFJ
- Local copy: open `complex_wage_plane.html` in a browser. Fonts load from Google Fonts and
  fall back to system fonts offline. All data is embedded in the page.

## What the page contains

| Panel | What it does | Status |
|---|---|---|
| Wage vector, scenarios, routes | Move W, read θ, clock position, quadrant, and M | Manuscript conventions |
| τ model | M = M₀ − a·ψm − b·ψs; the τ zone is M > τ | Proposal (the manuscript gives no M(W) formula) |
| Firearms timeline | B and O access by year drive W from 1705 | Seed values are placeholders |
| Arms parity | ψm = k_m · Parity; Parity = P_fed(t) · (1 − h · ban) | Event dates documented; levels are ordinal (Tier 3) |
| State carry laws | B and O by state from RAND, 1979–2025 | Data (RAND 6.0), with scoring rules as proposals |
| Sensitive places and transit | Carry access lowered by transit commuting share by race | ACS data; ban coverage coded from sources |
| Grandfather clauses | q_B and q_O scale O's parity relative to B's | No data yet; both 0 |
| O arms parity and κ | M = M₀ + κ · O parity − a·ψm − b·ψs | κ = 0 by default |
| Saint-Domingue, 1789–1804 | Two Buffer phasors (gens de couleur libres, petits blancs); O mobilization and parity grow the τ zone | Dates documented; values illustrative |
| Decomposition | Shapley split of a change among B, O, F, and parity | Method |
| Calibration test | Fit M₀, a, b on runtime-log eras before 1966; test on later eras | Targets from the manuscript |
| Shock-timing check | Do gun restrictions follow shocks? | Repository data |
| Post-Bruen tests | RAND law counts; coded sensitive-places and assault-weapon outcomes | Coded from sources |

## Data

| File | Source | Built by |
|---|---|---|
| `data/states_carry.json` | RAND State Firearm Law Database 6.0 (TL-A243-2-v4, January 2026; laws as of September 1, 2025). Concealed-carry regime shares and assault-weapon-ban shares by state and year, 1979–2025. Population weights: 2024 values derived from `Paper/data/gun_laws_new_england/states.csv`. | `scripts/build_states.py` |
| `data/transit.json` | Census Bureau ACS 2024 5-year table-based summary files, tables B08105B (Black alone) and B08105H (White alone, not Hispanic): share of workers 16+ who commute by public transportation (line 004 / line 001). | `scripts/build_transit.py` |
| `data/bruen_test.json` | RAND 6.0: restrictive and permissive state laws in the 1,166 days before and after *Bruen* (June 23, 2022), by state. | `scripts/bruen_test.py` |
| `data/post_bruen_coding.csv` | Coded post-*Bruen* outcomes and transit bans for licensed carry, with a source for each row. Exported from the page's tables. | — |

The page also embeds data copied from the repository: `Paper/data/eq65_68_2a_case_law.csv`,
`Paper/data/eq63_mass_incarceration.csv`, `Paper/data/historical_shocks.json`, and the ρ_τ ranges in
the manuscript's Compiled Runtime Log (`:15361`–`:15515`).

### RAND terms

The RAND workbook is not in the repository. RAND provides it for noncommercial use and prohibits
posting it online. Download it from https://www.rand.org/pubs/tools/TLA243-2-v4.html. The derived
series in `data/states_carry.json` and `data/bruen_test.json` come from it; check RAND's terms before
any commercial use of the page or the book.

### Rules applied to the RAND carry data

1. Where two carry laws overlap, the most recently effective law sets the regime.
2. MO1072 is a permit to acquire a handgun filed under concealed carry. It is left out.
3. DC1063 is a repeal. DC counts as prohibited from 2009 to 2014.
4. Virginia has no carry law in the database before July 1995. It drops out of the national average
   before then.

Against a separate state-year panel, every difference (33 state-years: Missouri 24, DC 6,
Louisiana 2, Nebraska 1) comes from rules 1–3.

## Rebuilding

```bash
# RAND workbook path (download it first; see above)
X="TL-A243-2-v4 State Firearm Law Database 6.0.xlsx"
python3 scripts/build_states.py "$X" - ../../Paper/data/gun_laws_new_england/states.csv data/states_carry.json
# ACS files: acsdt5y2024-b08105b.dat and acsdt5y2024-b08105h.dat from
# https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/
python3 scripts/build_transit.py ACS_DIR "$X" data/transit.json
python3 scripts/bruen_test.py "$X" data/bruen_test.json
python3 scripts/embed_data.py          # writes the three data files back into the page
```

The scripts need `openpyxl`. Rebuilding from the committed inputs reproduces all three JSON files
byte for byte. `bruen_test.py` uses a fixed seed for its permutation test.

## Results so far

- **Carry law, 1979–2025.** The population under prohibited or may-issue carry fell from 92% to
  under 1%. By statute, B and O access converge after 1979; a remaining status gap must come from
  enforcement or practice.
- **Transit bans.** Where public transit is a sensitive place for licensed carry (New York, New Jersey,
  Maryland, Illinois), the B − O gap reopens. Black workers commute by transit at two to four times
  the rate of white non-Hispanic workers (New York: 37.1% against 11.8%).
- **Post-*Bruen* response.** Broad sensitive-places laws: 5 of the 6 states that *Bruen* forced to
  change, against 0 of 45 others. New or wider assault-weapon bans: 1 of 6 (Massachusetts) against 5 of
  45. The definitions were set after reading the forced states' laws, so this describes a pattern.
- **Calibration.** With arms parity on and the default weights, 2 of 4 held-out eras fall inside their
  ranges. The weights were not fitted; tuning them to the held-out eras would void the test.
- **Saint-Domingue.** In the illustration, the gens de couleur libres cross τ in 1791, return inside τ
  after the April 1792 decree, and cross again in 1802 without return. The positions are illustrative
  values, so they show the hypothesis and do not test it.

## Open items

- Code O's parity and the Buffer phasors for Saint-Domingue from sources.
- Code the crossing point, approach direction, and outcome for each historical breach.
- Estimate the g gap and q_O from data (prohibited-person rules, incarceration).
- Confirm Maryland's SB 1 effective date and transit coverage in California and Hawaii.
