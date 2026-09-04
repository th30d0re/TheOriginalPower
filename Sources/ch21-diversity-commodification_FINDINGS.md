# Chapter 21 Diversity-Commodification Findings

**Research date:** 3 September 2026  
**Scope:** Verification and insertion of one Chapter 21 paragraph and two bibliography records.  
**Provenance:** Both sources are peer-reviewed journal articles.  
**Verification standard:** The publisher artifacts were opened. Numerical claims from PDF text were checked against the relevant printed page images where a local PDF was available. OCR and extracted text served only as locators.

## Per-claim verification

| Claim | Artifact opened and access method | Location | Result |
|---|---|---|---|
| Weisshaar, Chavez, and Hutt sent 11,190 software-engineering résumés. | SAGE publisher PDF for DOI `10.1177/00031224241245706`, opened through the publisher article's **Download PDF** link in the web browser. | Printed p. 591, “Study 1: Establishing Hiring Discrimination Patterns Across Job Transitions”; Table 1 on printed p. 593 also reports 11,190 observations. | **MATCH.** |
| Early-to-early callback rates were 15.4% for White men and 10.2% for Black men. | Same SAGE publisher PDF. | Printed pp. 593–594; Table 2, panel A, printed p. 594. | **MATCH.** |
| The relative anti-Black-male callback penalty was 33.5%. | Same SAGE publisher PDF. | Narrative and Table 2, panel A, printed p. 594. The table reports −33.5% relative to White men. | **MATCH.** |
| Black–White male callback differences were statistically insignificant for early-to-mid and mid-to-mid transitions. | Same SAGE publisher PDF. | Table 2, panel A, printed p. 594, and narrative on printed pp. 594–595. Black men's rates are 15.2% versus 16.6% for White men in the early-to-mid transition and 20.9% versus 24.4% in the mid-to-mid transition; neither Black-male comparison carries a significance marker. | **MATCH.** |
| Weisshaar article metadata: 2024, volume 89, issue 3, pp. 584–613. | SAGE publisher PDF and SAGE article record for DOI `10.1177/00031224241245706`. | PDF title page, printed p. 584; publisher record's “Published In” metadata. | **MATCH.** |
| Law and Tan's main board specification reports +0.213 percentage points for Black directors and −0.485 percentage points for non-Black minority directors. | Wiley version-of-record PDF for DOI `10.1111/1475-679X.70019`, downloaded from the Hong Kong Polytechnic University repository and opened locally at `/tmp/ch21-verify/law-tan.pdf`. | Narrative on printed p. 336; Table 3, panel A, printed p. 337. Rendered images of printed pp. 336–338 were inspected. | **MATCH.** |
| The board-level shift produced no corresponding firm-wide diversity gain. | Same Wiley version-of-record PDF. | Abstract, printed pp. 317–318; results overview, printed pp. 319–320; Table 3, panels B and C, printed pp. 337–338. | **MATCH WITH QUALIFICATION.** The paper says board shifts “do not consistently extend” to executives or the workforce. Table 3 reports a marginal increase in Black-executive presence, a significant decline in non-Black-minority executive representation, no significant increase in the percentage of Black executives, a significant decline in Black workforce representation, and no significant change in non-Black-minority workforce representation. The manuscript therefore states “no firm-wide diversity gain” and does not state that every executive and workforce estimate was unchanged. |
| Law and Tan article metadata: volume 64, issue 1, 2026. | Wiley version-of-record PDF and Wiley DOI record. | PDF title page, printed p. 317: “Vol. 64 No. 1 March 2026”; Wiley DOI record. | **MATCH.** |
| Law and Tan page range is 317–355. | Wiley version-of-record PDF. | Printed first page 317 and printed final page 363; the PDF contains 47 pages. | **DOES NOT MATCH.** The verified range is **317–363**, which is used in `references.bib`. |

## Manuscript change: exact before and after

### Before

The insertion point contained this exact adjacency:

```tex
The paper identifies differences in r\'esum\'e qualifications and White-associated attributes as possible explanations for the career-level skew. \textbf{Confidence: Tier~3} --- unpublished synthetic-r\'esum\'e experiment; exploratory career-level subgroup; non-significant aggregate test; r\'esum\'e qualifications were not held constant across all marker conditions.

The mathematical objectivity of the model then functions as the \textbf{Constitutional Shield} (Section~\ref{sec:concession_theorem}) applied at the point of generation.
```

### After

The following paragraph now appears between them:

```tex
\paragraph{The measured surface.}
The human labor market already routes diversification pressure toward the levels where representation is counted. Weisshaar, Chavez, and Hutt sent 11{,}190 software-engineering r\'esum\'es and found the anti-Black-male callback penalty concentrated in early-career applications; Black--White male differences were statistically insignificant in the early-to-mid and mid-to-mid transitions, a pattern they term ``diversity commodification'' \cite{weisshaar_diversify_2024}. Law and Tan found that firms exposed to Black Lives Matter protest pressure added Black directors while non-Black minority representation declined; the accompanying executive and workforce estimates yielded no firm-wide diversity gain, a pattern they term ``diversity tokenism'' \cite{law_tan_diversity_tokenism}. The measured count improves while the disadvantage moves across groups or organizational levels. This is the Concession Theorem (Section~\ref{sec:concession_theorem}) operating through the labor market. A model trained on that market inherits the routing, and the exploratory, non-significant mid-level gap in the r\'esum\'e experiment above is consistent with the same mechanism without confirming it.
```

## Bibliography additions

```bibtex
@article{weisshaar_diversify_2024,
  author       = {Weisshaar, Katherine and Chavez, Koji and Hutt, Tania},
  title        = {Hiring Discrimination Under Pressures to Diversify: Gender, Race, and Diversity Commodification across Job Transitions in Software Engineering},
  journal      = {American Sociological Review},
  year         = {2024},
  volume       = {89},
  number       = {3},
  pages        = {584--613},
  doi          = {10.1177/00031224241245706},
}

@article{law_tan_diversity_tokenism,
  author       = {Law, Kelvin K. F. and Tan, Jingdan},
  title        = {Diversity Tokenism},
  journal      = {Journal of Accounting Research},
  year         = {2026},
  volume       = {64},
  number       = {1},
  pages        = {317--363},
  doi          = {10.1111/1475-679X.70019},
}
```

Neither citation key nor DOI existed in `Paper/references.bib` before this change.

## Concession Theorem cross-reference

The paragraph uses `Section~\ref{sec:concession_theorem}`. The label `sec:concession_theorem` occurs directly below `\section{The Concession Theorem: Historical Proof}` in `Paper/The_Original_Power.tex`. The equation inside the later theorem definition has the separate label `eq:12.2-concession-theorem`; the prose points to the full section, so the section label is the correct reference.

## Law and Tan year decision

The bibliography uses **2026**, the version-of-record issue year. The Wiley record says “First published: 01 October 2025,” while the version-of-record PDF identifies “Vol. 64 No. 1 March 2026.” The repository follows the issue/version-of-record year convention requested in the task.

## Rhetorical self-check

The sentence reviewed most closely was: “The measured count improves while the disadvantage moves across groups or organizational levels.” It states the documented routing directly and contains no corrective `not-X-but-Y` construction. The paragraph contains one factual negation: “non-significant,” describing the reported statistical result. No manufactured antithesis appears.

## Commands and files

No Git command, Make command, LaTeX command, or build command was run. Only the three authorized repository files were changed or created:

- `Paper/The_Original_Power.tex`
- `Paper/references.bib`
- `Sources/ch21-diversity-commodification_FINDINGS.md`

## Unverified remainder

None of the numerical or bibliographic claims added to the manuscript or bibliography remains unverified. The internal résumé experiment's mid-level pattern remains exploratory and unreplicated, as stated in the manuscript.
