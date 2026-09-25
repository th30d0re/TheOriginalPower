# Link Check — chapter135 rebuttal video

Checked: 2026-09-25

## 1. https://www.law.cornell.edu/uscode/text/18/922

- **Status:** OK (page loads, full statute text returned)
- **Page title:** 18 U.S. Code § 922 — Unlawful acts (Cornell LII)
- **Claim:** Subsection (t) requires a federal background check (NICS) before a licensed dealer transfers a firearm to an unlicensed person.
- **Verdict:** SUPPORTED. Subsection (t) exists (added by Pub. L. 103–159, the Brady Handgun Violence Prevention Act) and governs NICS checks by licensed importers/manufacturers/dealers before transferring a firearm to an unlicensed person, referencing the "national instant criminal background check system" established under section 103 of the Brady Act (34 U.S.C. § 40901). The extracted text included the amendment history confirming subsec. (t) and its NICS context, even where the subsection body itself was truncated in extraction.
- **Corrected URL:** not needed.

## 2. https://www.census.gov/programs-surveys/saipe.html

- **Status:** OK (page loads)
- **Page title:** Small Area Income and Poverty Estimates (SAIPE) Program (U.S. Census Bureau)
- **Claim:** This is the Census Bureau's Small Area Income and Poverty Estimates program page, source of state poverty rates.
- **Verdict:** SUPPORTED. The page describes the SAIPE program, which "produces single-year estimates of income and poverty for all U.S. states and counties as well as estimates of school-age children in poverty for all 13,000+ school districts." State poverty rates are among its core outputs.
- **Corrected URL:** not needed.

## 3. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4213687

- **Status:** URL live but fetch blocked (HTTP 403 / Cloudflare "Just a moment..." for both FetchURL and curl with browser UA). Identity verified through independent sources instead.
- **Page title:** "2021 National Firearms Survey: Updated Analysis Including Types of Firearms Owned" — William English (Georgetown University, McDonough School of Business)
- **Claim:** William English, "2021 National Firearms Survey: Updated Analysis Including Types of Firearms Owned" (Georgetown), reporting that 42.2% of gun owners are female and giving AR-15-style ownership by race.
- **Verdict:** SUPPORTED (by secondary verification, not direct artifact contact). A 9th Circuit Excerpts of Record filing (Michel & Associates, Case 23-55805, 2023-11-21) cites: "English, William, 2021 National Firearms Survey: Updated Analysis Including ... Electronic copy available at: https://ssrn.com/abstract=4213687" — confirming the abstract ID maps to the named paper. The 42.2%-female figure is quoted from the survey by numerous independent sources (e.g. a Supreme Court amicus brief in 21-1194, Shooting Industry Magazine, Washington Times, AmmoLand): "57.8% are male; 42.2% are female." The updated analysis (Sept. 28, 2022) adds firearm-type breakdowns including AR-15-style rifles (30.2% of gun owners have owned one) with demographic breakdowns that include race.
- **Caveat:** SSRN itself was not opened directly; treat as verified-by-citation. Note the same paper also exists under abstract_id 4109494 (original 2022 posting).
- **Corrected URL:** not needed.

## 4. https://giffords.org/lawcenter/resources/scorecard/ and https://everytownresearch.org/rankings/

### 4a. https://giffords.org/lawcenter/resources/scorecard/

- **Status:** OK (page loads)
- **Page title:** Annual Gun Law Scorecard — "Grading the States" (GIFFORDS Law Center)
- **Claim:** Annual gun law scorecard page carrying state grades or ranks.
- **Verdict:** SUPPORTED. The page is the Giffords annual Gun Law Scorecard: "Each year, GIFFORDS experts analyze every gun law in every state... points are tallied to determine grades and rankings." It offers a per-state map plus a sortable table with Grade, Gun Law Strength, Gun Death Rank, and Gun Death Rate, and notes 15 years of publication (2025 edition: 13 states at A/A-, 24 at F).
- **Corrected URL:** not needed.

### 4b. https://everytownresearch.org/rankings/

- **Status:** OK (page loads)
- **Page title:** Gun Law Rankings (Everytown Research & Policy)
- **Claim:** Annual gun law rankings page carrying state grades or ranks.
- **Verdict:** SUPPORTED. The page presents the Everytown Gun Law Rankings, comparing all 50 states on the "top 50 gun safety policies," assigning each state a Gun Law Strength score and grouping them into tiers (National Leaders, Making Progress, Missing Key Laws, Weak Systems, National Failures), cross-referenced with CDC WONDER gun death rates.
- **Corrected URL:** not needed.

## 5. https://data.cdc.gov/d/fpsi-y8tj

- **Status:** OK (page loads; interactive content thin, so dataset metadata was pulled via the Socrata API at https://data.cdc.gov/api/views/fpsi-y8tj.json)
- **Page title:** "Mapping Injury, Overdose, and Violence - State" (CDC data.cdc.gov)
- **Claim:** CDC NCIPC firearm mortality data for states.
- **Verdict:** SUPPORTED. Dataset name: "Mapping Injury, Overdose, and Violence - State"; attribution: "CDC National Center for Injury Prevention and Control (NCIPC) based on National Center for Health Statistics (NCHS), National Vital Statistics System (NVSS) data"; category: Injury & Violence. The description states it "contains death counts and death rates for drug overdose, suicide, homicide and firearm injuries by state of residence," grouped yearly and trailing twelve months, with columns GEOID, NAME, Intent, Period, Count, Rate, Data_As_Of, TTM_Date_Range.
- **Corrected URL:** not needed. Note: the dataset covers more than firearm mortality (also overdose, suicide, homicide), so citing it specifically for firearm deaths should reference the firearm mechanism rows.

## Re-check 2026-09-25 — https://www.census.gov/programs-surveys/saipe.html

- **Status:** OK (page loads; program description returned)
- **Page title:** Small Area Income and Poverty Estimates (SAIPE) Program (U.S. Census Bureau)
- **Claim:** This is the Census Bureau's Small Area Income and Poverty Estimates program page, source of state poverty rates.
- **Verdict:** SUPPORTED. The fetched page states that the SAIPE program "produces single-year estimates of income and poverty for all U.S. states and counties as well as estimates of school-age children in poverty for all 13,000+ school districts." State poverty rates are a core output of the program described on this page.
- **Corrected URL:** not needed.

## Re-check 2026-09-25 — https://www.law.cornell.edu/uscode/text/18/922

- **Status:** OK (page loads; Cornell LII full statute page returned, including amendment history for subsection (t))
- **Page title:** 18 U.S. Code § 922 — Unlawful acts (Cornell LII)
- **Claim:** Subsection (t) requires a federal background check (NICS) before a licensed dealer transfers a firearm to an unlicensed person.
- **Verdict:** SUPPORTED. Subsection (t), added by Pub. L. 103–159 § 102(b) (Brady Handgun Violence Prevention Act, 1993), requires a licensed importer, manufacturer, or dealer to contact the national instant criminal background check system (established under Brady Act § 103, now 34 U.S.C. § 40901) before transferring a firearm to a person who is not licensed. The fetched page confirms subsection (t) and its NICS framework through the statutory notes and amendment history (including 2022 amendments to (t)(1)–(5)); the subsection body was truncated in extraction, consistent with entry 1 above.
- **Corrected URL:** not needed.

## Re-check 2026-09-25 — https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4213687

- **Status:** URL live but direct fetch blocked (HTTP 403 from SSRN for FetchURL). Identity and content verified through independent artifacts instead.
- **Page title:** "2021 National Firearms Survey: Updated Analysis Including Types of Firearms Owned" — William English (Georgetown University, McDonough School of Business)
- **Claim:** William English, "2021 National Firearms Survey: Updated Analysis Including Types of Firearms Owned" (Georgetown), reporting that 42.2% of gun owners are female and giving AR-15-style ownership by race.
- **Verdict:** SUPPORTED (verified by citation, not direct artifact contact). A 9th Circuit Excerpts of Record filing (Michel & Associates, Case 23-55805, filed 2023-11-21) cites: "English, William, 2021 National Firearms Survey: Updated Analysis Including ... Electronic copy available at: https://ssrn.com/abstract=4213687" — the abstract ID maps to the named paper. The 42.2%-female figure ("57.8% of gun owners are male, 42.2% are female") is quoted from the survey by independent sources including the Washington Times (2021-10-05), Second Call Defense, and a California Baptist University repository copy. The paper's AR-15-by-race table is reproduced in the same litigation record (e.g. Michel & Associates declaration of George M. Lee, 2023-03-31; Exhibit 1, 2024-09-06): White 29.6% (95% CI 28.9–30.4), Black 34.0% (CI 31.0–...), with Hispanic and Asian rows following — the paper does give AR-15-style ownership by race.
- **Caveat:** SSRN was not opened directly; verification rests on court filings that quote the paper and name the SSRN ID. The 2021 Georgetown affiliation is as stated.
- **Corrected URL:** not needed.

## Re-check 2026-09-25 — https://giffords.org/lawcenter/resources/scorecard/ and https://everytownresearch.org/rankings/

### 4a re-check. https://giffords.org/lawcenter/resources/scorecard/

- **Status:** OK (page loads, full extracted text returned)
- **Page title:** Annual Gun Law Scorecard — "Grading the States" (GIFFORDS Law Center)
- **Claim:** Annual gun law scorecard page carrying state grades or ranks.
- **Verdict:** SUPPORTED. The page states: "Each year, GIFFORDS experts analyze every gun law in every state... points are tallied to determine grades and rankings." It presents an interactive map and a sortable table of all 50 states with Grade, Gun Law Strength, Gun Death Rank, and Gun Death Rate columns, a Compare States tool, and 2025 edition results (13 states at A or A-, 24 states at F). It also notes 15 years of publication.
- **Corrected URL:** not needed.

### 4b re-check. https://everytownresearch.org/rankings/

- **Status:** OK (page loads, full extracted text returned)
- **Page title:** Gun Law Rankings (Everytown Research & Policy)
- **Claim:** Annual gun law rankings page carrying state grades or ranks.
- **Verdict:** SUPPORTED. The page presents the Everytown Gun Law Rankings 2026, scoring all 50 states on the "top 50 gun safety policies" with a Gun Law Strength score, and grouping states into ranked tiers (National Leaders, Making Progress, Missing Key Laws, Weak Systems, National Failures), cross-referenced with CDC WONDER gun death rates through 2024.
- **Corrected URL:** not needed.

### 5. https://data.cdc.gov/d/fpsi-y8tj

- **Status:** OK (page loads; dataset metadata confirmed via the Socrata API at /api/views/fpsi-y8tj.json)
- **Page title:** Mapping Injury, Overdose, and Violence - State (data.cdc.gov)
- **Claim:** CDC NCIPC firearm mortality data for states.
- **Verdict:** SUPPORTED. Attribution reads "CDC National Center for Injury Prevention and Control (NCIPC) based on National Center for Health Statistics (NCHS), National Vital Statistics System (NVSS) data," and the description states the file "contains death counts and death rates for drug overdose, suicide, homicide and firearm injuries by state of residence," grouped yearly and by trailing twelve months. State-level firearm mortality data from CDC NCIPC is exactly what this dataset provides.
- **Corrected URL:** not needed.
