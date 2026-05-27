# Internet Archive — Supreme Court Cases Pull List
*For: The Original Power — The Physics of Oppression and the Engineering of Control*
*Compiled: 2026-04-22*

---

## Downloaded primary PDFs (local)

One consolidated PDF per case (the item’s `{identifier}.pdf` when present, otherwise the largest `.pdf` in the item) is stored here:

**`Paper/research/ia_scotus_pdfs/`**

- **Manifest:** `Paper/research/ia_scotus_pdfs/download_manifest.json` — status per case (`ok`, `ok_external`, `skipped_exists`, `no_search_results`, etc.), Internet Archive identifier when applicable, and download URL.
- **Regenerate / resume:** run from `Paper/`:

  `python3 scripts/download_ia_scotus_pdfs.py`

  Uses `curl` for HTTPS (works around broken Python certificate bundles on some macOS installs). Skips any file that already exists with size greater than 4 KiB. Two cases use **hard-coded fallback URLs** (see `EXTERNAL_PDF_URLS` in `scripts/download_ia_scotus_pdfs.py`) when the `us-supreme-court` Solr index does not resolve them.

**Two cases pulled from non-default sources (still valid primary PDFs):**

1. **Yick Wo v. Hopkins** (1886) — official **U.S. Reports** PDF from the Library of Congress: [usrep118356.pdf](https://tile.loc.gov/storage-services/service/ll/usrep/usrep118/usrep118356/usrep118356.pdf) (same reporter citation **118 U.S. 356**). The Internet Archive `us-supreme-court` collection does not index this volume under the party caption `Yick` + `Hopkins`.
2. **Foster v. Chatman** (2016) — Supreme Court **slip opinion** PDF on Internet Archive: [14-8349_6k47.pdf](https://archive.org/download/14-8349-6k-47/14-8349_6k47.pdf) (item [14-8349-6k-47](https://archive.org/details/14-8349-6k-47)). The full National Archives microfilm bundle was not retrievable via a `Foster` + `Chatman` title query; the slip is the authoritative opinion text for citation.

All **57** rows in the Quick-Reference table now have a corresponding PDF in this folder.

---

## Base Collection URL

**https://archive.org/details/us-supreme-court**

This is the root of the Internet Archive's U.S. Supreme Court collection. All case records, oral argument audio, briefs, and transcripts are housed here.

---

## Agent Download Protocol

> **Instructions for any AI model or researcher using this document:** Follow these steps exactly to locate and download a PDF for any case listed below.

### Step 1 — Navigate to the collection
Go to: **https://archive.org/details/us-supreme-court**

### Step 2 — Search for a specific case
Use this search URL pattern, replacing `CASE+NAME` with the case name (use `+` for spaces):

```
https://archive.org/search?query=CASE+NAME&and[]=collection%3A%22us-supreme-court%22
```

**Examples:**
- Plessy v. Ferguson → `https://archive.org/search?query=plessy+ferguson&and[]=collection%3A%22us-supreme-court%22`
- McCleskey v. Kemp → `https://archive.org/search?query=mccleskey+kemp&and[]=collection%3A%22us-supreme-court%22`
- Brown v. Board → `https://archive.org/search?query=brown+board+education&and[]=collection%3A%22us-supreme-court%22`
- Shelby County v. Holder → `https://archive.org/search?query=shelby+county+holder&and[]=collection%3A%22us-supreme-court%22`

### Step 3 — Open the item page
From search results, click the item title that matches the case and year. The item page URL will follow this pattern:
```
https://archive.org/details/[IDENTIFIER]
```

### Step 4 — Download the PDF
On the item page, look for the **"PDF"** option in the **"Download Options"** panel on the right side. Click it. The direct download URL follows this pattern:
```
https://archive.org/download/[IDENTIFIER]/[IDENTIFIER].pdf
```

You can also append `/[IDENTIFIER].pdf` directly to any item URL to attempt a direct PDF download.

### Step 5 — Alternative: U.S. Reports citation search
For pre-1955 cases with no audio, search by U.S. Reports citation:
```
https://archive.org/search?query="163+U.S.+537"&and[]=collection%3A%22us-supreme-court%22
```
Replace `163+U.S.+537` with the citation for the case you need (see the Citation column in the tables below).

---

## Format Notes by Era

| Era | What's Available |
|---|---|
| **1800s – 1954** | Printed briefs, records, written arguments, U.S. Reports volumes — no audio |
| **1955 – 2019** | Oral argument audio recordings (MP3/OGG) + transcripts + briefs + PDFs |
| **All eras** | The government's own briefs and appendices are among the most valuable sources — they document the Interface Swap logic in the state's own words |

---

---

## Priority Tier — Pull These First

Each of these is a documented kernel patch in the manuscript's formal timeline:

| # | Case | Year | Why It's a Priority |
|---|---|---|---|
| 1 | **United States v. Cruikshank** | 1876 | Colfax Massacre → judicial nullification of Black civil rights; the Court *itself* became enforcement of the Recompile |
| 2 | **Civil Rights Cases** | 1883 | "State action" firewall that blocked the 14th Amendment for 80 years |
| 3 | **Plessy v. Ferguson** | 1896 | The "separate but equal" kernel patch — the judicial codification of the Buffer Class partition |
| 4 | **Moore v. Dempsey** | 1923 | Elaine Massacre; due process granted *after* the union was already destroyed |
| 5 | **Shelley v. Kraemer** | 1948 | Restrictive covenant ruling that forced redlining to shift to FHA exclusion |
| 6 | **Brown v. Board of Education** | 1954 | The reform shock that triggered the War on Drugs recompile |
| 7 | **Milliken v. Bradley** | 1974 | Spatial containment legally entrenched after busing |
| 8 | **McCleskey v. Kemp** | 1987 | The Court's own acknowledgment — then burial — of statistical racism evidence |
| 9 | **Parents Involved v. Seattle** | 2007 | Roberts's *P*_gaslight statement in the official record: "The way to stop discrimination on the basis of race is to stop discriminating on the basis of race" |
| 10 | **Shelby County v. Holder** | 2013 | VRA preclearance gutted; Texas enacted suppression laws within hours of the ruling |

---

## Cluster 1 — Slaughterhouse to Plessy: Gutting the Reconstruction Amendments
*Relevant chapters: Enforcement & Reconstruction (Ch. 5–6)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Slaughterhouse Cases** | 1873 | 83 U.S. 36 | [Search](https://archive.org/search?query=slaughterhouse+cases&and[]=collection%3A%22us-supreme-court%22) | First ruling to gut the 14th Amendment's Privileges & Immunities clause — the original judicial patch on the Reconstruction Amendments |
| **United States v. Cruikshank** | 1876 | 92 U.S. 542 | [Search](https://archive.org/search?query=united+states+cruikshank&and[]=collection%3A%22us-supreme-court%22) | Direct judicial response to the Colfax Massacre; ruled the federal government couldn't protect Black citizens from private violence |
| **United States v. Reese** | 1876 | 92 U.S. 214 | [Search](https://archive.org/search?query=united+states+reese&and[]=collection%3A%22us-supreme-court%22) | Gutted the Enforcement Act of 1870; effectively nullified the 15th Amendment in practice |
| **Strauder v. West Virginia** | 1880 | 100 U.S. 303 | [Search](https://archive.org/search?query=strauder+west+virginia&and[]=collection%3A%22us-supreme-court%22) | Rare Reconstruction-era win — struck exclusion of Black jurors; later systematically evaded through "race-neutral" pretexts (the Batson → Purkett arc) |
| **Civil Rights Cases** | 1883 | 109 U.S. 3 | [Search](https://archive.org/search?query=civil+rights+cases+1883&and[]=collection%3A%22us-supreme-court%22) | Struck the Civil Rights Act of 1875; the Court installs the "state action" firewall that immunizes private discrimination |
| **Yick Wo v. Hopkins** | 1886 | 118 U.S. 356 | [Search](https://archive.org/search?query=yick+wo+hopkins&and[]=collection%3A%22us-supreme-court%22) | Established that facially neutral laws applied discriminatorily violate Equal Protection — then systematically ignored for a century (directly illustrates the Williams v. Mississippi Interface Swap thesis) |
| **Plessy v. Ferguson** | 1896 | 163 U.S. 537 | [Search](https://archive.org/search?query=plessy+ferguson&and[]=collection%3A%22us-supreme-court%22) | "Separate but equal" — the judicial codification of the Buffer Class partition |
| **Williams v. Mississippi** | 1898 | 170 U.S. 213 | [Search](https://archive.org/search?query=williams+mississippi+1898&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — the Interface Swap proof of concept; Court upholds poll tax/literacy test using race-neutral language |

---

## Cluster 2 — Peonage & Debt Slavery: The 13th Amendment Loophole in Court
*Relevant chapters: Enforcement Class & Convict Leasing (Ch. 6)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Bailey v. Alabama** | 1911 | 219 U.S. 219 | [Search](https://archive.org/search?query=bailey+alabama+peonage&and[]=collection%3A%22us-supreme-court%22) | Struck Alabama's peonage statute — but the ruling was narrowly applied and convict leasing continued through contract prison labor; the kernel adapted |
| **United States v. Reynolds** | 1914 | 235 U.S. 133 | [Search](https://archive.org/search?query=united+states+reynolds+1914&and[]=collection%3A%22us-supreme-court%22) | Struck the "surety" system (a refinement of peonage) — shows iterative kernel patching in real time |
| **Moore v. Dempsey** | 1923 | 261 U.S. 86 | [Search](https://archive.org/search?query=moore+dempsey&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — Elaine Massacre; due process ruling overturned convictions *after* the union was already destroyed and the labor system restored |

---

## Cluster 3 — The Reproductive Kernel: Eugenics in the Courts
*Relevant chapters: Gendered Kernel & Reproductive Coercion (Ch. 4)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Buck v. Bell** | 1927 | 274 U.S. 200 | [Search](https://archive.org/search?query=buck+bell+sterilization&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — Holmes's "three generations of imbeciles" ruling; the Court's judicial blessing of forced sterilization |
| **Skinner v. Oklahoma** | 1942 | 316 U.S. 535 | [Search](https://archive.org/search?query=skinner+oklahoma&and[]=collection%3A%22us-supreme-court%22) | Struck sterilization of *white* habitual criminals on equal protection grounds — note the asymmetry: *Buck v. Bell* (targeting poor/Black women) remains valid precedent while *Skinner* protected white men. The Δmax = 0 invariant is visible here |

---

## Cluster 4 — White Primaries & Voting Suppression
*Relevant chapters: Tweedism Filter (Ch. 7)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Nixon v. Herndon** | 1927 | 273 U.S. 536 | [Search](https://archive.org/search?query=nixon+herndon+white+primary&and[]=collection%3A%22us-supreme-court%22) | Struck Texas white primary — Democratic Party immediately reorganized as "private club" to evade |
| **Nixon v. Condon** | 1932 | 286 U.S. 73 | [Search](https://archive.org/search?query=nixon+condon+1932&and[]=collection%3A%22us-supreme-court%22) | Second white primary case — the Party reorganization evasion struck again |
| **Grovey v. Townsend** | 1935 | 295 U.S. 45 | [Search](https://archive.org/search?query=grovey+townsend&and[]=collection%3A%22us-supreme-court%22) | Court *reversed itself* and upheld the "private club" white primary — the kernel patched the evasion back in |
| **Smith v. Allwright** | 1944 | 321 U.S. 649 | [Search](https://archive.org/search?query=smith+allwright&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — finally struck the white primary; the system then pivoted to literacy tests, violence, and intimidation |

---

## Cluster 5 — Racial Classification & Who Counts as White
*Relevant chapters: Racialization Origin & Out-Group Boundary (Ch. 1–2)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Ozawa v. United States** | 1922 | 260 U.S. 178 | [Search](https://archive.org/search?query=ozawa+united+states&and[]=collection%3A%22us-supreme-court%22) | Court ruled Japanese immigrants are not "white persons" — judicial enforcement of the Out-group partition boundary |
| **United States v. Bhagat Singh Thind** | 1923 | 261 U.S. 204 | [Search](https://archive.org/search?query=bhagat+singh+thind&and[]=collection%3A%22us-supreme-court%22) | Court ruled high-caste Indian immigrants are not "white" despite being Caucasian — shows the Out-group boundary is political/economic, not scientific |
| **Korematsu v. United States** | 1944 | 323 U.S. 214 | [Search](https://archive.org/search?query=korematsu+united+states&and[]=collection%3A%22us-supreme-court%22) | Japanese internment; the Court applies its first use of "strict scrutiny" to *uphold* racial classification — the strict scrutiny framework was built to protect, not challenge, state racialization when Elite interests required it |

---

## Cluster 6 — NAACP Litigation Campaign & Brown
*Relevant chapters: Post-Brown Variable Swap (Ch. 8)*
*Note: Audio recordings available for all cases in this cluster (1955+)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Sweatt v. Painter** | 1950 | 339 U.S. 629 | [Search](https://archive.org/search?query=sweatt+painter&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — NAACP dismantling "separate but equal" in law schools |
| **McLaurin v. Oklahoma State Regents** | 1950 | 339 U.S. 637 | [Search](https://archive.org/search?query=mclaurin+oklahoma&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — graduate school segregation |
| **Brown v. Board of Education** | 1954 | 347 U.S. 483 | [Search](https://archive.org/search?query=brown+board+education&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — the Interface Swap trigger that forced the kernel to recompile as the War on Drugs |
| **Cooper v. Aaron** | 1958 | 358 U.S. 1 | [Search](https://archive.org/search?query=cooper+aaron+1958&and[]=collection%3A%22us-supreme-court%22) | Arkansas governor defied Brown; all 9 Justices signed — shows F_enforce apparatus's resistance to the reform shock |
| **Green v. County School Board** | 1968 | 391 U.S. 430 | [Search](https://archive.org/search?query=green+county+school+board&and[]=collection%3A%22us-supreme-court%22) | "Freedom of choice" desegregation plans struck; but the ruling produced white flight → Milliken backstep |

---

## Cluster 7 — Spatial Containment: Housing, Busing & School Funding
*Relevant chapters: Spatial Containment & Capture Variable (Ch. 6)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Shelley v. Kraemer** | 1948 | 334 U.S. 1 | [Search](https://archive.org/search?query=shelley+kraemer&and[]=collection%3A%22us-supreme-court%22) | Struck judicial *enforcement* of restrictive covenants — but private covenants remained; the redlining architecture shifted to FHA exclusion |
| **Jones v. Alfred H. Mayer Co.** | 1968 | 392 U.S. 409 | [Search](https://archive.org/search?query=jones+alfred+mayer&and[]=collection%3A%22us-supreme-court%22) | Ruled the Civil Rights Act of 1866 prohibits private housing discrimination — oral arguments directly address the 13th Amendment's scope |
| **Swann v. Charlotte-Mecklenburg** | 1971 | 402 U.S. 1 | [Search](https://archive.org/search?query=swann+charlotte+mecklenburg&and[]=collection%3A%22us-supreme-court%22) | Approved busing as a desegregation tool — but Milliken two years later made it dead letter in metropolitan areas |
| **Milliken v. Bradley** | 1974 | 418 U.S. 717 | [Search](https://archive.org/search?query=milliken+bradley&and[]=collection%3A%22us-supreme-court%22) | Blocked cross-district busing; Court drew the remedy boundary at district lines, ensuring white suburban flight permanently escaped desegregation orders — spatial containment legally entrenched |
| **San Antonio ISD v. Rodriguez** | 1973 | 411 U.S. 1 | [Search](https://archive.org/search?query=san+antonio+school+district+rodriguez&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — property-tax school funding upheld; the V_t recursive trap has its legal foundation here |

---

## Cluster 8 — Criminal Justice, the Drug War & the Carceral State
*Relevant chapters: Recompile & Mass Incarceration (Ch. 8–9)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Terry v. Ohio** | 1968 | 392 U.S. 1 | [Search](https://archive.org/search?query=terry+ohio+stop+frisk&and[]=collection%3A%22us-supreme-court%22) | Created "stop and frisk" on reasonable suspicion — the judicial infrastructure for dragnet enforcement of P_criminal |
| **McCleskey v. Kemp** | 1987 | 481 U.S. 279 | [Search](https://archive.org/search?query=mccleskey+kemp&and[]=collection%3A%22us-supreme-court%22) | Court acknowledged statistical racial disparity in capital sentencing but ruled it insufficient without proof of *specific* discriminatory intent — the "facially neutral + racially targeted = constitutional" thesis confirmed by SCOTUS itself |
| **Harmelin v. Michigan** | 1991 | 501 U.S. 957 | [Search](https://archive.org/search?query=harmelin+michigan&and[]=collection%3A%22us-supreme-court%22) | Upheld life without parole for first-offense cocaine possession — mandatory minimums architecture approved |
| **United States v. Armstrong** | 1996 | 517 U.S. 456 | [Search](https://archive.org/search?query=united+states+armstrong+selective+prosecution&and[]=collection%3A%22us-supreme-court%22) | Ruled defendants must produce "some evidence" of discriminatory prosecution before getting discovery — made McCleskey-style statistical evidence even harder to obtain |
| **Atwater v. City of Lago Vista** | 2001 | 532 U.S. 318 | [Search](https://archive.org/search?query=atwater+lago+vista&and[]=collection%3A%22us-supreme-court%22) | Allowed custodial arrest for minor traffic violations — the legal basis for pretextual arrests targeting the Out-group |
| **Hudson v. Michigan** | 2006 | 547 U.S. 586 | [Search](https://archive.org/search?query=hudson+michigan+exclusionary&and[]=collection%3A%22us-supreme-court%22) | Gutted the exclusionary rule for knock-and-announce violations — weakened the one enforcement mechanism that policed police |
| **Utah v. Strieff** | 2016 | 579 U.S. 232 | [Search](https://archive.org/search?query=utah+strieff&and[]=collection%3A%22us-supreme-court%22) | Extended the "good faith" exception to cover stops based on outstanding warrants; Sotomayor's dissent is the most precise judicial articulation of the carceral containment model in the record |

---

## Cluster 9 — Jury Selection & the McCleskey-Batson Complex
*Relevant chapters: Enforcement Class (Ch. 6)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Batson v. Kentucky** | 1986 | 476 U.S. 79 | [Search](https://archive.org/search?query=batson+kentucky&and[]=collection%3A%22us-supreme-court%22) | Struck race-based peremptory challenges — but Purkett v. Elem (1995) gutted it by accepting any race-neutral pretext, however implausible |
| **Purkett v. Elem** | 1995 | 514 U.S. 765 | [Search](https://archive.org/search?query=purkett+elem&and[]=collection%3A%22us-supreme-court%22) | Accepted "long hair, moustache, and beard" as sufficient race-neutral justification for striking a Black juror — the Yick Wo pattern completes its loop here |
| **Foster v. Chatman** | 2016 | 578 U.S. 488 | [Search](https://archive.org/search?query=foster+chatman&and[]=collection%3A%22us-supreme-court%22) | Struck Georgia's discriminatory jury selection 30 years after Batson; the prosecutor's notes showed racial intent clearly documented — confirms the system only yields when the paper trail is literally undeniable |

---

## Cluster 10 — Voting Rights: The Shelby County Arc
*Relevant chapters: Tweedism Filter (Ch. 7)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **South Carolina v. Katzenbach** | 1966 | 383 U.S. 301 | [Search](https://archive.org/search?query=south+carolina+katzenbach+voting+rights&and[]=collection%3A%22us-supreme-court%22) | Upheld the Voting Rights Act — oral arguments directly debate congressional power to override state voting laws |
| **Harper v. Virginia State Board of Elections** | 1966 | 383 U.S. 663 | [Search](https://archive.org/search?query=harper+virginia+poll+tax&and[]=collection%3A%22us-supreme-court%22) | Struck poll taxes for state elections — the 24th Amendment had only covered federal elections |
| **Crawford v. Marion County Election Board** | 2008 | 553 U.S. 181 | [Search](https://archive.org/search?query=crawford+marion+county+voter+id&and[]=collection%3A%22us-supreme-court%22) | Upheld Indiana's voter ID law; Court accepted "voter fraud" rationale with near-zero empirical evidence — the Interface Swap for 21st-century franchise suppression |
| **Shelby County v. Holder** | 2013 | 570 U.S. 529 | [Search](https://archive.org/search?query=shelby+county+holder&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — gutted VRA preclearance; suppression laws enacted within hours |
| **Abbott v. Perez** | 2018 | 585 U.S. 579 | [Search](https://archive.org/search?query=abbott+perez+texas+redistricting&and[]=collection%3A%22us-supreme-court%22) | Texas redistricting; Court shifted the burden of proof to challengers to show racial intent — the McCleskey pattern applied to gerrymandering |

---

## Cluster 11 — Campaign Finance & the Puppet Class
*Relevant chapters: Tweedism Filter (Ch. 7)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Buckley v. Valeo** | 1976 | 424 U.S. 1 | [Search](https://archive.org/search?query=buckley+valeo+campaign+finance&and[]=collection%3A%22us-supreme-court%22) | Equated campaign spending with free speech — the foundational move that made Citizens United possible |
| **Citizens United v. FEC** | 2010 | 558 U.S. 310 | [Search](https://archive.org/search?query=citizens+united+FEC&and[]=collection%3A%22us-supreme-court%22) | *Already cited in manuscript* — judicial installation of the corporate money filter on the Puppet Class selection mechanism |
| **McCutcheon v. FEC** | 2014 | 572 U.S. 185 | [Search](https://archive.org/search?query=mccutcheon+FEC+contribution+limits&and[]=collection%3A%22us-supreme-court%22) | Struck aggregate campaign contribution limits — oral arguments directly debate whether unlimited money in politics constitutes corruption |

---

## Cluster 12 — Affirmative Action as Concession & Counter-Reform
*Relevant chapters: Contradiction Theorem / Concession Variable (Ch. 11)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **Regents of University of California v. Bakke** | 1978 | 438 U.S. 265 | [Search](https://archive.org/search?query=regents+university+california+bakke&and[]=collection%3A%22us-supreme-court%22) | First affirmative action case; Powell's "diversity rationale" reframed the remedy as a benefit to *all* students — a concession that simultaneously de-radicalized the demand |
| **Grutter v. Bollinger** | 2003 | 539 U.S. 306 | [Search](https://archive.org/search?query=grutter+bollinger&and[]=collection%3A%22us-supreme-court%22) | Upheld law school affirmative action with a 25-year sunset — acknowledged racial inequality while promising it would be unnecessary within a generation |
| **Parents Involved in Community Schools v. Seattle** | 2007 | 551 U.S. 701 | [Search](https://archive.org/search?query=parents+involved+community+schools+seattle&and[]=collection%3A%22us-supreme-court%22) | Struck voluntary school integration programs; Roberts's "The way to stop discrimination on the basis of race is to stop discriminating on the basis of race" is the clearest judicial statement of the P_gaslight variable in the official record |
| **Fisher v. University of Texas** | 2016 | 579 U.S. 365 | [Search](https://archive.org/search?query=fisher+university+texas&and[]=collection%3A%22us-supreme-court%22) | Upheld UT's narrowly tailored affirmative action — the last win before SFFA |

---

## Cluster 13 — The 2nd Amendment & Selective Enforcement
*Relevant chapters: Kinetic Guarantee (Ch. 10)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **District of Columbia v. Heller** | 2008 | 554 U.S. 570 | [Search](https://archive.org/search?query=district+columbia+heller+second+amendment&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — established individual 2nd Amendment right |
| **McDonald v. City of Chicago** | 2010 | 561 U.S. 742 | [Search](https://archive.org/search?query=mcdonald+city+chicago+second+amendment&and[]=collection%3A%22us-supreme-court%22) | Incorporated Heller against the states via the 14th Amendment |
| **Caetano v. Massachusetts** | 2016 | 577 U.S. 411 | [Search](https://archive.org/search?query=caetano+massachusetts&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — selective non-application to assault weapons bans that the manuscript directly analyzes |

---

## Cluster 14 — Commerce Clause, Labor & Regulatory Rollback
*Relevant chapters: Recompile & Post-Civil Rights Backlash (Ch. 8–9)*

| Case | Year | Citation | Direct Search Link | Manuscript Relevance |
|---|---|---|---|---|
| **NLRB v. Jones & Laughlin Steel** | 1937 | 301 U.S. 1 | [Search](https://archive.org/search?query=NLRB+jones+laughlin+steel&and[]=collection%3A%22us-supreme-court%22) | Upheld NLRA — the one moment organized labor got kernel access; immediately countered by Taft-Hartley (1947) |
| **NFIB v. Sebelius** | 2012 | 567 U.S. 519 | [Search](https://archive.org/search?query=NFIB+sebelius+affordable+care+act&and[]=collection%3A%22us-supreme-court%22) | *Already cited* — Roberts contracted the Commerce Clause to limit Medicaid expansion; oral arguments contain the clearest modern judicial debate about limits of congressional power to address systemic inequality |

---

## Full Case Count

| Cluster | Cases |
|---|---|
| Cluster 1: Slaughterhouse to Plessy | 8 |
| Cluster 2: 13th Amendment Loophole | 3 |
| Cluster 3: Reproductive Kernel / Eugenics | 2 |
| Cluster 4: White Primaries | 4 |
| Cluster 5: Racial Classification | 3 |
| Cluster 6: NAACP Campaign & Brown | 5 |
| Cluster 7: Spatial Containment | 5 |
| Cluster 8: Carceral State / Drug War | 7 |
| Cluster 9: Jury Selection | 3 |
| Cluster 10: Voting Rights Arc | 5 |
| Cluster 11: Campaign Finance | 3 |
| Cluster 12: Affirmative Action | 4 |
| Cluster 13: 2nd Amendment | 3 |
| Cluster 14: Commerce Clause / Labor | 2 |
| **Total** | **57 cases** |

---

*Cases marked "Already cited in manuscript" confirm existing citations; all others are new additions that enhance the argument.*

---

## Quick-Reference: All 58 Search Links

| Case | Year | Direct Search |
|---|---|---|
| Slaughterhouse Cases | 1873 | [archive.org](https://archive.org/search?query=slaughterhouse+cases&and[]=collection%3A%22us-supreme-court%22) |
| United States v. Cruikshank | 1876 | [archive.org](https://archive.org/search?query=united+states+cruikshank&and[]=collection%3A%22us-supreme-court%22) |
| United States v. Reese | 1876 | [archive.org](https://archive.org/search?query=united+states+reese&and[]=collection%3A%22us-supreme-court%22) |
| Strauder v. West Virginia | 1880 | [archive.org](https://archive.org/search?query=strauder+west+virginia&and[]=collection%3A%22us-supreme-court%22) |
| Civil Rights Cases | 1883 | [archive.org](https://archive.org/search?query=civil+rights+cases+1883&and[]=collection%3A%22us-supreme-court%22) |
| Yick Wo v. Hopkins | 1886 | [archive.org](https://archive.org/search?query=yick+wo+hopkins&and[]=collection%3A%22us-supreme-court%22) |
| Plessy v. Ferguson | 1896 | [archive.org](https://archive.org/search?query=plessy+ferguson&and[]=collection%3A%22us-supreme-court%22) |
| Williams v. Mississippi | 1898 | [archive.org](https://archive.org/search?query=williams+mississippi+1898&and[]=collection%3A%22us-supreme-court%22) |
| Bailey v. Alabama | 1911 | [archive.org](https://archive.org/search?query=bailey+alabama+peonage&and[]=collection%3A%22us-supreme-court%22) |
| United States v. Reynolds | 1914 | [archive.org](https://archive.org/search?query=united+states+reynolds+1914&and[]=collection%3A%22us-supreme-court%22) |
| Ozawa v. United States | 1922 | [archive.org](https://archive.org/search?query=ozawa+united+states&and[]=collection%3A%22us-supreme-court%22) |
| Moore v. Dempsey | 1923 | [archive.org](https://archive.org/search?query=moore+dempsey&and[]=collection%3A%22us-supreme-court%22) |
| United States v. Bhagat Singh Thind | 1923 | [archive.org](https://archive.org/search?query=bhagat+singh+thind&and[]=collection%3A%22us-supreme-court%22) |
| Nixon v. Herndon | 1927 | [archive.org](https://archive.org/search?query=nixon+herndon+white+primary&and[]=collection%3A%22us-supreme-court%22) |
| Buck v. Bell | 1927 | [archive.org](https://archive.org/search?query=buck+bell+sterilization&and[]=collection%3A%22us-supreme-court%22) |
| Nixon v. Condon | 1932 | [archive.org](https://archive.org/search?query=nixon+condon+1932&and[]=collection%3A%22us-supreme-court%22) |
| Grovey v. Townsend | 1935 | [archive.org](https://archive.org/search?query=grovey+townsend&and[]=collection%3A%22us-supreme-court%22) |
| NLRB v. Jones & Laughlin Steel | 1937 | [archive.org](https://archive.org/search?query=NLRB+jones+laughlin+steel&and[]=collection%3A%22us-supreme-court%22) |
| Skinner v. Oklahoma | 1942 | [archive.org](https://archive.org/search?query=skinner+oklahoma&and[]=collection%3A%22us-supreme-court%22) |
| Korematsu v. United States | 1944 | [archive.org](https://archive.org/search?query=korematsu+united+states&and[]=collection%3A%22us-supreme-court%22) |
| Smith v. Allwright | 1944 | [archive.org](https://archive.org/search?query=smith+allwright&and[]=collection%3A%22us-supreme-court%22) |
| Shelley v. Kraemer | 1948 | [archive.org](https://archive.org/search?query=shelley+kraemer&and[]=collection%3A%22us-supreme-court%22) |
| Sweatt v. Painter | 1950 | [archive.org](https://archive.org/search?query=sweatt+painter&and[]=collection%3A%22us-supreme-court%22) |
| McLaurin v. Oklahoma State Regents | 1950 | [archive.org](https://archive.org/search?query=mclaurin+oklahoma&and[]=collection%3A%22us-supreme-court%22) |
| Brown v. Board of Education | 1954 | [archive.org](https://archive.org/search?query=brown+board+education&and[]=collection%3A%22us-supreme-court%22) |
| Cooper v. Aaron | 1958 | [archive.org](https://archive.org/search?query=cooper+aaron+1958&and[]=collection%3A%22us-supreme-court%22) |
| South Carolina v. Katzenbach | 1966 | [archive.org](https://archive.org/search?query=south+carolina+katzenbach+voting+rights&and[]=collection%3A%22us-supreme-court%22) |
| Harper v. Virginia State Board of Elections | 1966 | [archive.org](https://archive.org/search?query=harper+virginia+poll+tax&and[]=collection%3A%22us-supreme-court%22) |
| Green v. County School Board | 1968 | [archive.org](https://archive.org/search?query=green+county+school+board&and[]=collection%3A%22us-supreme-court%22) |
| Jones v. Alfred H. Mayer Co. | 1968 | [archive.org](https://archive.org/search?query=jones+alfred+mayer&and[]=collection%3A%22us-supreme-court%22) |
| Terry v. Ohio | 1968 | [archive.org](https://archive.org/search?query=terry+ohio+stop+frisk&and[]=collection%3A%22us-supreme-court%22) |
| Swann v. Charlotte-Mecklenburg | 1971 | [archive.org](https://archive.org/search?query=swann+charlotte+mecklenburg&and[]=collection%3A%22us-supreme-court%22) |
| San Antonio ISD v. Rodriguez | 1973 | [archive.org](https://archive.org/search?query=san+antonio+school+district+rodriguez&and[]=collection%3A%22us-supreme-court%22) |
| Milliken v. Bradley | 1974 | [archive.org](https://archive.org/search?query=milliken+bradley&and[]=collection%3A%22us-supreme-court%22) |
| Buckley v. Valeo | 1976 | [archive.org](https://archive.org/search?query=buckley+valeo+campaign+finance&and[]=collection%3A%22us-supreme-court%22) |
| Regents of University of California v. Bakke | 1978 | [archive.org](https://archive.org/search?query=regents+university+california+bakke&and[]=collection%3A%22us-supreme-court%22) |
| Batson v. Kentucky | 1986 | [archive.org](https://archive.org/search?query=batson+kentucky&and[]=collection%3A%22us-supreme-court%22) |
| McCleskey v. Kemp | 1987 | [archive.org](https://archive.org/search?query=mccleskey+kemp&and[]=collection%3A%22us-supreme-court%22) |
| Harmelin v. Michigan | 1991 | [archive.org](https://archive.org/search?query=harmelin+michigan&and[]=collection%3A%22us-supreme-court%22) |
| United States v. Armstrong | 1996 | [archive.org](https://archive.org/search?query=united+states+armstrong+selective+prosecution&and[]=collection%3A%22us-supreme-court%22) |
| Purkett v. Elem | 1995 | [archive.org](https://archive.org/search?query=purkett+elem&and[]=collection%3A%22us-supreme-court%22) |
| Atwater v. City of Lago Vista | 2001 | [archive.org](https://archive.org/search?query=atwater+lago+vista&and[]=collection%3A%22us-supreme-court%22) |
| Hudson v. Michigan | 2006 | [archive.org](https://archive.org/search?query=hudson+michigan+exclusionary&and[]=collection%3A%22us-supreme-court%22) |
| Parents Involved v. Seattle | 2007 | [archive.org](https://archive.org/search?query=parents+involved+community+schools+seattle&and[]=collection%3A%22us-supreme-court%22) |
| Crawford v. Marion County Election Board | 2008 | [archive.org](https://archive.org/search?query=crawford+marion+county+voter+id&and[]=collection%3A%22us-supreme-court%22) |
| District of Columbia v. Heller | 2008 | [archive.org](https://archive.org/search?query=district+columbia+heller+second+amendment&and[]=collection%3A%22us-supreme-court%22) |
| Citizens United v. FEC | 2010 | [archive.org](https://archive.org/search?query=citizens+united+FEC&and[]=collection%3A%22us-supreme-court%22) |
| McDonald v. City of Chicago | 2010 | [archive.org](https://archive.org/search?query=mcdonald+city+chicago+second+amendment&and[]=collection%3A%22us-supreme-court%22) |
| NFIB v. Sebelius | 2012 | [archive.org](https://archive.org/search?query=NFIB+sebelius+affordable+care+act&and[]=collection%3A%22us-supreme-court%22) |
| Shelby County v. Holder | 2013 | [archive.org](https://archive.org/search?query=shelby+county+holder&and[]=collection%3A%22us-supreme-court%22) |
| McCutcheon v. FEC | 2014 | [archive.org](https://archive.org/search?query=mccutcheon+FEC+contribution+limits&and[]=collection%3A%22us-supreme-court%22) |
| Grutter v. Bollinger | 2003 | [archive.org](https://archive.org/search?query=grutter+bollinger&and[]=collection%3A%22us-supreme-court%22) |
| Caetano v. Massachusetts | 2016 | [archive.org](https://archive.org/search?query=caetano+massachusetts&and[]=collection%3A%22us-supreme-court%22) |
| Fisher v. University of Texas | 2016 | [archive.org](https://archive.org/search?query=fisher+university+texas&and[]=collection%3A%22us-supreme-court%22) |
| Foster v. Chatman | 2016 | [archive.org](https://archive.org/search?query=foster+chatman&and[]=collection%3A%22us-supreme-court%22) |
| Utah v. Strieff | 2016 | [archive.org](https://archive.org/search?query=utah+strieff&and[]=collection%3A%22us-supreme-court%22) |
| Abbott v. Perez | 2018 | [archive.org](https://archive.org/search?query=abbott+perez+texas+redistricting&and[]=collection%3A%22us-supreme-court%22) |