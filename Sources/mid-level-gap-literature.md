# The Mid-Level Gap: Literature Review and Source Audit

**Research date:** 3 September 2026  
**Scope:** External evidence concerning career-level variation in racial and gender hiring or promotion, algorithmic and LLM hiring audits disaggregated by seniority, and the hypothesis that visible minority representation at the organizational apex can be symbolic or structurally constrained.

## Source-handling method

Every source treated as verified below was opened during this review. Each annotation identifies the artifact and access method. Search-result snippets were used only to locate artifacts. OCR from PDFs was used to locate passages; claims attributed to scanned or typeset PDFs were checked against the rendered page supplied by the publisher or repository. Provenance labels distinguish peer-reviewed scholarship, scholarly working papers or proceedings, and corporate research. `CANNOT CONFIRM` identifies claims for which the opened evidence was insufficient.

## Internal finding under review

The internal experiment ranked batches of ten synthetic résumés with four GPT models and selected up to four candidates at low, mid, and executive levels. Black-marked candidates received 46.67% of selections at the low level, 31.67% at the mid level, and 46.67% at the executive level; White-marked candidates received 53.33%, 68.33%, and 53.33%, respectively. The aggregate marker-category test was not significant, χ² = 2.547, *p* = .980. These figures were checked in the repository's precursor survey and study transcript. The synthetic profiles also differed in schools, affiliations, extracurricular activities, and experience. The pattern therefore cannot be identified as an isolated race effect.

## Q1. Is a worst-at-the-middle shape established in the literature?

**Answer: partially supported as a transition bottleneck, not established as a general representation curve.**

The strongest recurring finding concerns the first promotion into management. McKinsey and LeanIn.Org report that in 2024, 81 women were promoted to manager for every 100 men; the ratios were 89 for White women, 99 for Asian women, 54 for Black women, and 65 for Latinas. This is direct evidence of a racialized and gendered first-rung promotion barrier. The same report's representation series declines as seniority rises: women account for 48% of entry-level employees, 39% of managers, 37% of senior managers/directors, 34% of vice presidents, 29% of senior vice presidents, and 29% of the C-suite. Women of color decline from 19% at entry level to 13% at manager and 7% in the C-suite. The first transition can be the sharpest promotion barrier while the stock of representation remains lowest at the top.

For Black employees specifically, McKinsey's 2021 corporate pipeline has a limited nonmonotonic feature: Black representation falls from 12% at entry level to 7% at manager, remains approximately 4–5% across senior manager, vice-president, and senior-vice-president levels, and reaches 6% at the executive level. The report describes the entry-to-manager transition as a broken rung and cautions that executive-level variation widens as denominators become smaller. This evidence supports an early-management pinch and a modest apex rebound. It does not support executive parity: 6% executive representation remains half the 12% entry-level share.

Other evidence is monotonic. The Center for Talent Innovation reports Black representation of 10.0% among college-degree holders, 8.0% among professionals, 3.2% among executive or senior officials and managers, and 0.8% among Fortune 500 CEOs. Its categories do not isolate middle management, but the pattern directly contradicts an inference of near-parity at the apex.

The most relevant conventional hiring field experiment also cuts against a general worst-middle hypothesis. Weisshaar, Chavez, and Hutt sent 11,190 résumés for software-engineering positions and explicitly distinguished early-to-early, early-to-mid, and mid-to-mid transitions. Relative to White men, Black men had a 33.5% callback penalty in early-to-early applications. The Black–White male differences were not statistically significant in early-to-mid or mid-to-mid applications. This study identifies early-career discrimination and reduced measured discrimination in higher transitions within software engineering. It does not show a uniquely severe middle-level barrier.

**Assessment of the proposed interpretation:**

- The gender “broken rung” is well documented as a first-promotion rate disparity.
- Black pipeline evidence is not uniformly monotonic. McKinsey's corporate sample contains a small executive rebound, while the Center for Talent Innovation series falls through the CEO level. Neither source establishes near-parity at the apex.
- The internal experiment's executive near-parity is plausibly sensitive to its small selection counts, synthetic profile construction, and task design. External sources do not establish that its executive pattern is a tokenism effect.
- `CANNOT CONFIRM`: No opened source demonstrated a general U-shaped Black hiring curve in which entry and executive outcomes approach parity while mid-level outcomes are uniquely adverse.

## Q2. Do LLM or algorithmic hiring audits disaggregate demographic effects by seniority?

**Answer: no qualifying replication was found.** A qualifying study would report race or gender selection effects separately at multiple coherent career levels, such as entry, middle management, and executive. None of the opened LLM or algorithmic hiring audits supplied that comparison.

### Closest studies and why they do not qualify

| Study | Career-level content | Demographic audit | Result for this question |
|---|---|---|---|
| Pavlopoulos (2026) | Junior and mid-level résumé templates across six occupations | Race and gender contrasts in scores | Closest design. It estimates seniority as a pooled positive control and does not publish race- or gender-specific effects separately within junior and mid-level strata or a demographic-by-seniority interaction. |
| Armstrong et al. (2024) | Ten occupations include CEO and other roles; generated résumés are coded for seniority | Race and gender effects in selection and generation | Occupation and level are not crossed experimentally. Seniority is an outcome of résumé generation, not a stratum for selection auditing. |
| Bloomberg, Yin et al. (2024) | Four job advertisements include senior software engineer, HR business partner, retail manager, and financial analyst | Race and gender ranking patterns | Titles mix occupation and seniority. The study reports results by posting, so it cannot separate level from occupation or estimate an entry/mid/executive pattern. |
| Wilson and Caliskan (2024) | Nine occupational categories | Race, gender, and intersectional retrieval bias | No career-seniority variable or level-stratified estimates. A 2026 correction reverses the paper's original gender comparisons; the authors state that race and intersectional results were unaffected. |
| Gaebler et al. (2025) | K–12 teaching applications | Race and gender evaluation disparities | Single occupational setting with no career-level comparison. |
| Wang et al. (2024), JobFair | Hierarchical bias taxonomy across job-resume pairs | Gender bias | “Hierarchical” describes the audit taxonomy, not the organizational ladder. No seniority-stratified demographic estimates are reported. |

`CANNOT CONFIRM`: The search found no published LLM résumé-screening audit that independently reproduces the internal low/mid/executive curve. Pavlopoulos (2026) could test a junior-versus-mid interaction with its design, but the opened article does not report that interaction.

## Conventional hiring evidence relevant to level

Bertrand and Mullainathan's correspondence experiment found a White-name callback advantage across occupations and industries. Its official abstract states that the gap was uniform across occupation, industry, and employer size. The experiment does not organize vacancies by career seniority and cannot establish a mid-level effect.

Quillian, Pager, Hexel, and Midtbøen's meta-analysis covers 28 field experiments of hiring discrimination. It models occupational groups and time, not entry, middle-management, and executive strata. It supports the persistence of racial hiring discrimination and supplies no estimate of a mid-level trough.

The conventional literature reviewed here therefore yields three distinct propositions: an early-management promotion bottleneck in corporate pipeline research; early-career callback discrimination with attenuated differences in higher software-engineering transitions; and persistent average racial discrimination across field experiments. These propositions do not jointly establish a general worst-at-the-middle law.

## Tokenized-apex evidence

The phrase “token talking head” combines several claims that require separate evidence: demographic visibility, symbolic organizational response, constrained authority, and precarious tenure.

Kanter's tokenism analysis supports the first two mechanisms at the group level. In skewed groups, tokens experience heightened visibility, boundary polarization, stereotyping, and role entrapment. The article concerns women in male-dominated work groups and does not measure executive decision rights. It supports a mechanism of conspicuous representation under numerical scarcity.

Law and Tan provide the most direct contemporary evidence of symbolic top-level representation without organizational diffusion. Using Black Lives Matter protests as external pressure, they find increases in Black board representation accompanied by substitution away from other non-Black minority directors and no comparable improvement deeper in the organization. In their main specification, Black director representation rises by 0.213 percentage points, or 6.1% relative to the sample mean, while non-Black minority representation falls by 0.485 percentage points, or 7.5%. The study interprets this as visible board-level response with limited substantive workforce change. Board membership is an apex governance position; the paper does not show that individual Black directors lack formal authority.

Ryan and Haslam's glass-cliff study supplies evidence of precarious leadership appointment for women. Their FTSE 100 analysis found that companies appointing women to boards had experienced consistently poor stock performance during the preceding five months. This supports appointment into high-visibility roles under elevated failure risk. It does not establish powerless appointments and does not test racial minorities.

Cook and Glass examine every racial or ethnic minority CEO transition in Fortune 500 firms over a 15-year period. They report evidence contrary to a simple racial-minority glass-cliff prediction: minority CEOs were more likely to be promoted in strong-performing firms. When firm performance subsequently declined, minority CEOs were more likely to be replaced by White CEOs. This finding supports post-appointment vulnerability and cautions against treating glass-cliff appointment as universal.

**Conclusion on the apex thread:** External scholarship supports token visibility, symbolic top-level diversification that does not cascade through an organization, precarious appointments for women, and replacement vulnerability for racial-minority CEOs. `CANNOT CONFIRM`: The opened sources do not establish that the internal experiment's executive selections represent roles deliberately stripped of authority, nor do they establish that a small executive rebound in descriptive pipeline data consists of powerless minority appointees.

## Annotated sources

### Career pipelines and the broken rung

#### McKinsey & Company and LeanIn.Org. 2024. *Women in the Workplace 2024*. Corporate research report.

- **URL:** [https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace-2024](https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace-2024)
- **Artifact opened:** The official McKinsey report webpage was opened directly; the representation and promotion charts were read from Exhibits 1–3 and their accessible chart text.
- **Finding and location:** Exhibit 1 reports the 2024 representation ladder for all women; Exhibit 2 reports the race-by-gender ladder; Exhibit 3 reports promotions to manager per 100 men, including 54 for Black women and 65 for Latinas.
- **Relation to internal pattern:** Strong support for a first-promotion bottleneck. The representation series declines or plateaus toward the apex and does not reproduce a mid-level trough followed by near parity.
- **Provenance:** Corporate research; named organizational authors and disclosed survey/pipeline methodology.

#### McKinsey & Company. 2021. *Race in the Workplace: The Black Experience in the US Private Sector*. Corporate research report.

- **URL:** [PDF](https://www.mckinsey.com/~/media/McKinsey/Featured%20Insights/Diversity%20and%20Inclusion/Race%20in%20the%20workplace%20The%20Black%20experience%20in%20the%20US%20private%20sector/Race-in-the-workplace-The-Black-experience-in-the-US-private-sector-v3.pdf)
- **Artifact opened:** The official 71-page McKinsey PDF was opened directly and the relevant rendered pages were inspected.
- **Finding and location:** The narrative on printed pp. 29–35 and Exhibit 10 on printed p. 31 report 12% Black representation at entry level, 7% at manager, approximately 4–5% through the three upper-management tiers, and 6% at executive level. The report identifies the entry-to-manager broken rung and notes wider executive variation where the number of executives is smaller.
- **Relation to internal pattern:** Partial structural similarity: a steep early-management decline and a modest executive rebound. The executive level remains substantially underrepresented and does not approach entry-level representation.
- **Provenance:** Corporate research based on participating-company pipeline data.

#### Center for Talent Innovation. 2019. *Being Black in Corporate America: An Intersectional Exploration—Key Findings*. Corporate research report.

- **URL:** [PDF](https://coqual.org/wp-content/uploads/2020/09/CoqualBeingBlackinCorporateAmerica090720-1.pdf)
- **Artifact opened:** The report PDF hosted by Coqual, the successor organization, was opened directly and its rendered pages were inspected.
- **Finding and location:** Printed p. 2 reports Black shares of 10.0% among college-degree holders, 8.0% among professionals, 3.2% among executive or senior officials and managers, and 0.8% among Fortune 500 CEOs. Printed p. 12 describes the June 2019 survey of 3,736 U.S. college-educated employees, including 520 Black respondents.
- **Relation to internal pattern:** Contradicts near-parity at the apex and supplies no discrete mid-level estimate.
- **Provenance:** Corporate research with named research leads and a disclosed sample.

### Human correspondence audits and level transitions

#### Weisshaar, Katherine, Koji Chavez, and Tania Hutt. 2024. “Hiring Discrimination Under Pressures to Diversify: Gender, Race, and Diversity Commodification across Job Transitions in Software Engineering.” *American Sociological Review* 89 (3): 584–613.

- **DOI/URL:** [https://doi.org/10.1177/00031224241245706](https://doi.org/10.1177/00031224241245706); [publisher PDF](https://journals.sagepub.com/doi/pdf/10.1177/00031224241245706)
- **Artifact opened:** The full publisher PDF was opened directly; the design description and Table 2 were inspected.
- **Finding and location:** Printed pp. 585–586 define early-to-early, early-to-mid, and mid-to-mid applications. Table 2 on printed p. 594 reports callback rates of 15.4% for White men and 10.2% for Black men in early-to-early transitions, a 33.5% relative penalty. Black–White male differences are not statistically significant in the two higher transitions.
- **Relation to internal pattern:** Directly relevant level-disaggregated human audit. It locates the strongest racial penalty at the early level, not uniquely at mid-level.
- **Provenance:** Peer-reviewed field experiment.

#### Bertrand, Marianne, and Sendhil Mullainathan. 2004. “Are Emily and Greg More Employable Than Lakisha and Jamal? A Field Experiment on Labor Market Discrimination.” *American Economic Review* 94 (4): 991–1013.

- **DOI/URL:** [https://doi.org/10.1257/0002828042002561](https://doi.org/10.1257/0002828042002561)
- **Artifact opened:** The official American Economic Association article page and abstract were opened directly.
- **Finding and location:** The abstract on p. 991 reports a 50% callback advantage for White-sounding names and describes the racial gap as uniform across occupation, industry, and employer size.
- **Relation to internal pattern:** Establishes hiring discrimination but has no career-level stratification.
- **Provenance:** Peer-reviewed field experiment.

#### Quillian, Lincoln, Devah Pager, Ole Hexel, and Arnfinn H. Midtbøen. 2017. “Meta-analysis of Field Experiments Shows No Change in Racial Discrimination in Hiring over Time.” *Proceedings of the National Academy of Sciences* 114 (41): 10870–10875.

- **DOI/URL:** [https://doi.org/10.1073/pnas.1706255114](https://doi.org/10.1073/pnas.1706255114); [PubMed record](https://pubmed.ncbi.nlm.nih.gov/28900012/)
- **Artifact opened:** The PubMed bibliographic record and abstract and a repository copy of the full article PDF were opened.
- **Finding and location:** The abstract and methods describe a meta-analysis of 28 field experiments and occupational controls. The reported models do not estimate entry-, middle-, and executive-level effects.
- **Relation to internal pattern:** Supports persistent average racial discrimination; cannot confirm a mid-level shape.
- **Provenance:** Peer-reviewed meta-analysis.

### LLM and algorithmic hiring audits

#### Pavlopoulos, Vasileios. 2026. “Minimal but Conditional: Auditing Demographic Bias in Large Language Model Résumé Evaluation Across Commercial and Open-Weight Models.” *Analytics* 5 (3): 30.

- **DOI/URL:** [https://doi.org/10.3390/analytics5030030](https://doi.org/10.3390/analytics5030030); [publisher page](https://www.mdpi.com/2813-2203/5/3/30)
- **Artifact opened:** The official MDPI article page and the full HTML preprint underlying the published paper were opened directly.
- **Finding and location:** Table 1 reports strong pooled mid-versus-junior score effects across the three audited models, with standardized effects from *d* = 1.93 to 3.40 and adjusted *q* < .001. The Black–White pooled contrast is *d* = .03, *q* = .382. The article does not report demographic effects separately by junior and mid-level or a demographic-by-level interaction.
- **Relation to internal pattern:** Closest located LLM study by design; no independent test of the internal mid-level disparity.
- **Provenance:** Peer-reviewed journal article.

#### Armstrong, Lena, Abbey Liu, Stephen MacNeil, and Danaë Metaxa. 2024. “The Silicon Ceiling: Auditing GPT's Race and Gender Biases in Hiring.” *Proceedings of the 4th ACM Conference on Equity and Access in Algorithms, Mechanisms, and Optimization*, Article 2, 1–18.

- **DOI/URL:** [https://doi.org/10.1145/3689904.3694699](https://doi.org/10.1145/3689904.3694699); [full PDF](https://arxiv.org/pdf/2405.04412)
- **Artifact opened:** The official ACM DOI record and the complete author-posted PDF were opened; Figure 5 and Appendix Table 8 were inspected.
- **Finding and location:** Study 2 codes the seniority of model-generated résumés. Figure 5 on PDF p. 7 and Appendix Table 8 show a negative female-seniority coefficient that approaches conventional significance, β = −.488, *p* = .071. The selection audit does not cross demographic markers with advertised career level.
- **Relation to internal pattern:** Evidence about generative stereotyping of seniority, not level-specific résumé selection.
- **Provenance:** Peer-reviewed conference proceeding.

#### Yin, Leon, Davey Alba, and Leonardo Nicoletti. 2024. “OpenAI's GPT Is a Recruiter's Dream Tool. Tests Show There's Racial Bias.” *Bloomberg*, 7 March 2024.

- **URL:** [https://www.bloomberg.com/graphics/2024-openai-gpt-hiring-racial-discrimination/](https://www.bloomberg.com/graphics/2024-openai-gpt-hiring-racial-discrimination/)
- **Artifact opened:** The complete Bloomberg interactive article and methodology text were opened directly.
- **Finding and location:** The methodology section describes 1,000 rankings for each combination of model and four postings: HR business partner, senior software engineer, retail manager, and financial analyst. Results are organized by posting rather than by a common seniority scale.
- **Relation to internal pattern:** Includes a senior-titled role but confounds occupation and level; no career-level demographic comparison is available.
- **Provenance:** Investigative journalism with a disclosed audit method; not peer reviewed.

#### Wilson, Kyra, and Aylin Caliskan. 2024. “Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval.” *Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society* 7 (1): 1578–1590.

- **DOI/URL:** [https://doi.org/10.1609/aies.v7i1.31748](https://doi.org/10.1609/aies.v7i1.31748); [corrected PDF](https://arxiv.org/pdf/2407.20371)
- **Artifact opened:** The official conference record and the current full PDF were opened. The correction notice on PDF p. 1 and Figure 4 were inspected.
- **Finding and location:** Figure 4 reports White-preferred outcomes in 85.1% of 27 race comparisons and Black-preferred outcomes in 8.6%. The correction notice states that gender comparisons in prior versions were inverted by a coding error while race and intersectional results remained unaffected and were independently replicated. The design spans occupations without a career-level variable.
- **Relation to internal pattern:** Confirms that retrieval-based résumé screening can produce racial disparities; supplies no seniority disaggregation.
- **Provenance:** Peer-reviewed conference proceeding with a material post-publication correction disclosed by the authors.

#### Gaebler, Johann D., Sharad Goel, Aziz Z. Huq, and Prasanna Tambe. 2025. “Auditing Large Language Models for Race & Gender Disparities: Implications for Artificial Intelligence-Based Hiring.” *Behavioral Science & Policy* 10 (2): 46–55.

- **DOI/URL:** [https://doi.org/10.1177/23794607251320229](https://doi.org/10.1177/23794607251320229)
- **Artifact opened:** The official SAGE version-of-record page, abstract, publication metadata, and article text were opened directly.
- **Finding and location:** The study evaluates K–12 teaching applications and reports small demographic differences in model scores. Its design contains no career-level comparison.
- **Relation to internal pattern:** Relevant LLM application audit; no test of low-, mid-, and executive-level variation.
- **Provenance:** Peer-reviewed journal article; version of record published online in 2025.

#### Wang, Ze, Zekun Wu, Xin Guan, Michael Thaler, Adriano Koshiyama, Qinyang Lu, Sachin Beepath, Ediz Ertekin Jr., and Maria Perez-Ortiz. 2024. “JobFair: A Framework for Benchmarking Gender Hiring Bias in Large Language Models.” *Findings of the Association for Computational Linguistics: EMNLP 2024*, 3227–3246.

- **DOI/URL:** [https://doi.org/10.18653/v1/2024.findings-emnlp.184](https://doi.org/10.18653/v1/2024.findings-emnlp.184); [full PDF](https://aclanthology.org/2024.findings-emnlp.184.pdf)
- **Artifact opened:** The official ACL Anthology record and full proceedings PDF were opened directly.
- **Finding and location:** The framework's hierarchy distinguishes bias at the individual, group, and overall levels; the methods and results do not stratify candidates by organizational seniority.
- **Relation to internal pattern:** A broad gender-hiring benchmark with no career-ladder comparison.
- **Provenance:** Peer-reviewed conference proceeding.

### Tokenism, symbolic representation, and precarious leadership

#### Kanter, Rosabeth Moss. 1977. “Some Effects of Proportions on Group Life: Skewed Sex Ratios and Responses to Token Women.” *American Journal of Sociology* 82 (5): 965–990.

- **DOI/URL:** [https://doi.org/10.1086/226425](https://doi.org/10.1086/226425)
- **Artifact opened:** The official University of Chicago Press article record and abstract were opened directly.
- **Finding and location:** The abstract and theoretical development identify visibility, polarization, assimilation, and role entrapment as consequences of token status in skewed groups.
- **Relation to internal pattern:** Supplies a mechanism for high visibility under numerical scarcity. It does not measure executive authority or racialized hiring by level.
- **Provenance:** Peer-reviewed theoretical and qualitative article.

#### Law, Kelvin K. F., and Jingdan Tan. 2026. “Diversity Tokenism.” *Journal of Accounting Research* 64 (1): 317–355.

- **DOI/URL:** [https://doi.org/10.1111/1475-679X.70019](https://doi.org/10.1111/1475-679X.70019); [accepted full PDF](https://ira.lib.polyu.edu.hk/bitstream/10397/117562/1/Law_Diversity_Tokenism.pdf)
- **Artifact opened:** The complete accepted article PDF in the Hong Kong Polytechnic University repository was opened; the abstract, research design, Table 3, and organizational-level results were inspected.
- **Finding and location:** Table 3, panel A, printed pp. 336–337 reports a 0.213-percentage-point increase in Black director representation and a 0.485-percentage-point decrease in non-Black minority representation following protest pressure, equivalent to 6.1% and 7.5% of their respective sample means. The abstract and results report limited spillover to executives and the workforce.
- **Relation to internal pattern:** Direct evidence that visible apex diversification can be symbolic and decoupled from deeper organizational representation. It does not establish that selected directors lack individual authority.
- **Provenance:** Peer-reviewed quasi-experimental study.

#### Ryan, Michelle K., and S. Alexander Haslam. 2005. “The Glass Cliff: Evidence that Women Are Over-Represented in Precarious Leadership Positions.” *British Journal of Management* 16 (2): 81–90.

- **DOI/URL:** [https://doi.org/10.1111/j.1467-8551.2005.00433.x](https://doi.org/10.1111/j.1467-8551.2005.00433.x)
- **Artifact opened:** The official Wiley article record and abstract were opened through the publisher's indexed page.
- **Finding and location:** The abstract reports that FTSE 100 companies appointing women to boards had experienced consistently poor stock performance during the preceding five months.
- **Relation to internal pattern:** Supports precarious high-level appointment for women; does not establish symbolic authority or a racial executive rebound.
- **Provenance:** Peer-reviewed archival study.

#### Cook, Alison, and Christy M. Glass. 2014. “Analyzing Promotions of Racial/Ethnic Minority CEOs.” *Journal of Managerial Psychology* 29 (4): 440–454.

- **DOI/URL:** [https://doi.org/10.1108/JMP-02-2012-0066](https://doi.org/10.1108/JMP-02-2012-0066); [institutional record](https://digitalcommons.usu.edu/soca_facpub/36/)
- **Artifact opened:** The Utah State University institutional repository record and author-supplied abstract were opened directly.
- **Finding and location:** The abstract describes all racial or ethnic minority CEO transitions in Fortune 500 firms over 15 years. Minority CEOs were more likely to be promoted in strong-performing firms; under subsequent performance decline they were more likely to be replaced by White CEOs.
- **Relation to internal pattern:** Supplies evidence of post-appointment vulnerability while contradicting a universal minority glass-cliff appointment effect.
- **Provenance:** Peer-reviewed archival study.

## Bottom line for the manuscript

The internal results identify a descriptive mid-level trough in one synthetic LLM ranking design, not a demonstrated general law of racial hiring. External evidence firmly supports a broken first rung for women, with especially severe 2024 promotion ratios for Black women and Latinas. Black corporate-pipeline evidence shows a sharp entry-to-manager decline; one large McKinsey dataset contains a modest executive rebound, while other series continue downward to the CEO level. A conventional software-engineering correspondence audit finds its largest Black–White callback penalty at the early-career transition and no statistically significant Black–White male difference in its higher transitions. No located LLM hiring audit reports demographic effects across entry, mid, and executive levels, and the closest junior-versus-mid study does not publish the required interaction. Scholarship on tokenism and symbolic board diversification makes a constrained-apex interpretation theoretically plausible, but it does not identify the internal executive selections as powerless or tokenized. The manuscript should present the mid-level gap as a study-specific hypothesis requiring replication with race isolated from résumé credentials, larger samples, preregistered level definitions, and direct tests of demographic-by-seniority interactions.

## Evidentiary gaps

1. **No direct LLM replication.** No opened audit estimates race or gender effects separately across entry, middle, and executive hiring.
2. **No clean causal race contrast in the internal design.** Schools, affiliations, extracurricular activities, and experience vary with the racialized profiles.
3. **No general race-specific middle trough.** Available corporate reports disagree on whether a small apex rebound appears, and their level definitions and participating firms differ.
4. **No evidence that executive selections lack authority.** Tokenism, symbolic board response, and precarious tenure are adjacent mechanisms; they do not measure the authority attached to the internal study's hypothetical jobs.
5. **Small-denominator sensitivity remains unquantified.** McKinsey flags greater executive-level variability where counts are smaller, but the opened report does not supply the cell counts needed to model the internal executive rebound.
6. **Algorithmic studies confound level and occupation.** Bloomberg and Armstrong include differently senior roles, but they do not cross the same occupations with controlled seniority tiers.
7. **Gender evidence requires version control.** Wilson and Caliskan's current paper discloses an inversion in its original gender comparisons. Only the corrected artifact should be used; the authors report that race and intersectional results are unaffected.
8. **Original “concrete ceiling” evidence:** `CANNOT CONFIRM`. Secondary references to a Catalyst “concrete ceiling” formulation were located, but no accessible original artifact with a career-level empirical test was opened. It is excluded from the verified evidence above.
9. **Publication-date ambiguity:** Gaebler et al. appears in volume 10(2), associated with 2024, while the version of record was published online in March 2025. The citation uses 2025, the publisher's version-of-record date.

