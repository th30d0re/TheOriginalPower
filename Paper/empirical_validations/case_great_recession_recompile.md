---
label: cs:great_recession_recompile
chapter: 10
chapter_title: "The Full Algorithm: Demographic Paradox, Cannibalization, and the 5-Tier Reveal (1994--Present)"
statement: |
  The Great Recession functioned as a systemic recompile: housing-led household wealth destruction was routed downward into O_racialized and lower I_buffer, while state-backed asset recovery preserved the Delta-max invariant at the top.
type: quantitative
tier: 1
status: complete
existing_case_study: true
phase3_headline: false
target_events:
  - "Great Recession 2007--2009"
  - "Household balance-sheet recovery 2010--2016"
  - "Federal Reserve DFA wealth-share recovery 2007--2025"
data_sources:
  - {name: "Federal Reserve Distributional Financial Accounts", type: "public dataset", url: "https://www.federalreserve.gov/releases/z1/dataviz/dfa/index.html"}
  - {name: "Congressional Budget Office family wealth distribution report", type: "public report", url: "https://www.cbo.gov/publication/60807"}
  - {name: "Pew Research Center SCF analysis of post-recession wealth", type: "public analysis", url: "https://www.pewresearch.org/short-reads/2017/11/01/how-wealth-inequality-has-changed-in-the-u-s-since-the-great-recession-by-race-ethnicity-and-income/"}
  - {name: "Pfeffer, Danziger, and Schoeni 2013", type: "peer-reviewed", doi: "10.1177/0002716213497452"}
difficulty: M
notebook: "eq10_great_recession_charts.py"
data_files:
  - "eq10_great_recession_wealth_shares.csv"
  - "eq10_great_recession_racial_wealth.csv"
  - "eq10_great_recession_asset_composition.csv"
  - "eq10_great_recession_debt_floor.csv"
figures:
  - "eq10_great_recession_wealth_shares.png"
  - "eq10_great_recession_racial_wealth.png"
  - "eq10_great_recession_asset_composition.png"
  - "eq10_great_recession_debt_floor.png"
falsification: "Falsified if the 2007--2012 period showed durable reduction in top-tier wealth share, no disproportionate housing-wealth loss among lower-wealth households, no racialized wealth-loss gradient, and no asset-market recovery concentrated among equity- and real-estate-owning tiers."
---

# Notes

**Description**: Case-level validation of the Chapter 10 kernel objective and cannibalization transition. The Great Recession is treated as an empirical recompile event: household balance sheets below the apex absorbed the crash, while the post-crisis recovery restored asset-owning tiers.

**Primary charts**:
- `fig:great_recession_wealth_shares`
- `fig:great_recession_asset_composition`
- `fig:great_recession_debt_floor`
- `fig:great_recession_racial_wealth`

**Classification rationale**: Type=quantitative, Tier=1 because all charted values are either directly drawn from Federal Reserve DFA public data or derived from Pew's published SCF percentages and dollar values, with CBO and peer-reviewed PSID/SCF evidence used as independent validation.
