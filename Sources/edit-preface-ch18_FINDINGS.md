# Findings — Preface Correction and Chapter 18 Hiring-Paper Citation

## Scope and artifact contact

I read `Sources/grad-precursor-survey.md` before the task specification and before editing. I then opened the following source artifacts directly:

- `/Users/emmanuel/Documents/Grad/MPC/Final Paper/Paper_v2.tex`, with numbered source lines.
- `/Users/emmanuel/Documents/Grad/MPC/Final Paper/Paper.tex`, with numbered source lines, for the retained lineage statement.
- `/Users/emmanuel/Documents/Grad/NLP/Project/Report/Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, with numbered source lines.
- `/Users/emmanuel/Documents/Grad/NLP/Project/Evaluating_Fairness_in_Large_Language_Models_for_Hiring_Tasks-2.ipynb`, with numbered raw JSON lines, for the recorded hiring prompt.

Both artifacts are **unpublished course manuscripts**. The numerical claims added to the manuscript therefore have unpublished-manuscript provenance. I did not rerun either analysis and did not validate the underlying datasets.

## Per-claim numerical verification

| Number or quantitative wording added | Artifact opened and location | Verification result |
|---|---|---|
| “more than twice the White per-capita rate” | `Paper_v2.tex`, lines 40–41 and 177–179 | **MATCH.** The source reports a Black-to-White rate ratio of 2.56, with a 95% CI of 2.43–2.68. The Preface intentionally omits the hard ratio. |
| Cross-validation characterization underlying “little group-identifying signal” | `Paper_v2.tex`, lines 45–48 and 235–242 | **MATCH.** The source reports 56.5% out-of-fold accuracy against a 51.5% majority baseline and explicitly describes the signal as “little.” These hard figures were checked and were not inserted in the Preface. |
| Four language models in the overall study | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 85–91; experiment notebook, raw JSON lines 15535–15554 | **MATCH WITH A SCOPE CORRECTION.** The paper names GPT-4o, GPT-4, GPT-4-Turbo, and GPT-3.5-Turbo. The notebook’s four-model loop belongs to the separate real-r\'esum\'e run. The career-level percentages came from GPT-4o alone, hard-coded at notebook line 16737. The manuscript now separates these facts. |
| Three career levels | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 105–110 and 400–404 | **MATCH.** The source names low-level, mid-level, and executive-level groups. |
| “roughly two cases out of three” | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 402–404 | **MATCH.** The reported mid-level White share is 68.33%, which supports this rounded wording. |
| 68.33% mid-level White selections | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 402–404 | **MATCH.** The source reports 68.33% White and 31.67% Black at the mid-level stage. |
| 53.33% White selections at entry and executive levels | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 402–404 | **MATCH.** The source reports 53.33% White at both low-level and executive-level stages. |
| χ² = 2.547 | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 354–367 | **MATCH.** The statistic appears in the prose at line 355 and the table at line 366. |
| p = 0.980 | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 354–368 | **MATCH.** The value appears in the prose at line 355 and the table at line 367; the source labels the result not significant. |
| 2024 bibliography year | `Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, lines 17–24; filesystem metadata inspected directly | **CANNOT CONFIRM FROM A SOURCE LINE.** The manuscript contains no paper date. Line 18 gives `TemplateVersion (2025.1)`, which identifies the template rather than publication year. The source file was created 2024-12-05 and modified 2024-12-07. The 2024 entry follows the task brief and archive provenance, not an internal date printed in the paper. |
| Tier 3 confidence label | Hiring manuscript, lines 22–30, 37–42, 74–91, 354–368, and 429–434 | **EDITORIAL PROVENANCE RATING.** Tier 3 is not a statistic reported by the source. It records the study’s unpublished status, synthetic design, aggregate null result, and stated limitations. |

The retained “146 anchor cases” and “five centuries” language already appeared in the paragraph before this edit. This pass moved that existing sentence and changed its description of the empirical result; it introduced neither count.

## Change 1 — Corrected *The Calculus of Injustice* account

### Before

```tex
The second document was empirical. \textit{The Calculus of Injustice} applied principal component analysis and linear discriminant analysis to a national dataset of fatal police shootings. The linear discriminant analysis produced a clean geometric result: racial groups separated in discriminant space, with the White cluster distinct from an overlapping Black and Hispanic cluster. That overlap was the structural signature of a shared systemic basin---the same force acting on both groups from the same direction. The paper cited \textit{From Bias to Bytes} as the prior work that had named the set-theoretic and machine learning program; the LDA result was the first empirical confirmation that the program was worth completing. The partition the proposal had named as a theoretical object appeared in the data as a geometric fact.
```

The following sentence also appeared in the next paragraph:

```tex
\textit{The Original Power} executes what those two papers described.
```

That paragraph ended with:

```tex
The empirical LDA result---the racial partition as a geometric separation in outcome space---is one anchor case in an archive of 146 anchor cases spanning five centuries of the extraction algorithm's operation.
```

### After

```tex
The second document was empirical. \textit{The Calculus of Injustice} analysed a national dataset of fatal police shootings, comparing group death counts against population denominators and testing how much racial signal the recorded incident features carry. Black people were killed at more than twice the White per-capita rate. The incident features themselves carried little group-identifying signal once the classifier was cross-validated, which set a clear limit on what incident-only data can establish about the decision to use force. The paper cited \textit{From Bias to Bytes} as the prior work that had named the set-theoretic and machine-learning program. The per-capita disparity was that program's first measured empirical shadow.
```

The opening sentence now reads:

```tex
\textit{The Original Power} executes what those earlier papers described.
```

The final sentence now reads:

```tex
The empirical disparity result---the racial gap in fatal-shooting rates, bounded by the limits of incident-only data---is one anchor case in an archive of 146 anchor cases spanning five centuries of the extraction algorithm's operation.
```

The revision is supported by `Paper_v2.tex`: lines 163–173 identify the circular in-sample method; lines 177–184 report the per-capita result and denominator limitation; lines 235–244 report the cross-validated result; and lines 268–278 state the incident-only inference boundary.

## Change 2 — Added the hiring-paper beat and revised the progression

### Before

There was no hiring-paper paragraph between the *Calculus of Injustice* paragraph and the paragraph beginning `\textit{The Original Power}`.

The progression paragraph read:

```tex
The progression from proposal to empirical detection to formal derivation defines the framework's method: identify a structure, detect its empirical shadow, then derive the mechanism that produces both. \textit{From Bias to Bytes} identified the structure. \textit{The Calculus of Injustice} detected the shadow. This book derives the mechanism, and follows that mechanism to its conclusion.
```

### After

```tex
The next document built the applied capability the proposal had named. \textit{Exploring Bias and Fairness in Language Models Applied to Hiring} evaluated four language models. Its career-level experiment submitted synthetic r\'esum\'es carrying explicit and inferred racial markers to GPT-4o. Entry-level and executive-level selections held near demographic parity. Mid-level selections went to White candidates in roughly two cases out of three. The recorded selection prompt contained no racial instruction. The disparity appeared at the career stage where advancement compounds. The aggregate marker-category test was not statistically significant; the skew appeared after disaggregation by career level.
```

```tex
The progression from proposal to empirical detection to applied audit to formal derivation defines the framework's method: identify a structure, detect its empirical shadow, build the instrument that measures it, then derive the mechanism that produces all three. \textit{From Bias to Bytes} identified the structure. \textit{The Calculus of Injustice} detected the shadow. \textit{Exploring Bias and Fairness in Language Models Applied to Hiring} built the detector and turned it on the machine substrate. This book derives the mechanism, and follows that mechanism to its conclusion.
```

The paper supports the synthetic-data and marker description at lines 38–40 and 74–83, the four-model description at lines 85–91, the three-level grouping at lines 105–113 and 400–404, and the disaggregated percentages at lines 402–406. Lines 354–368 and 394–395 support the aggregate null finding.

## Change 3 — Added the bibliography entry

### Before

No `theodore_hiring_bias` entry existed.

### After

```bibtex
@misc{theodore_hiring_bias,
  author       = {Theodore, Emmanuel},
  title        = {Exploring Bias and Fairness in Language Models Applied to Hiring},
  year         = {2024},
  type         = {Unpublished manuscript},
  note         = {Natural Language Processing course project, Wentworth Institute of Technology},
}
```

The entry is adjacent to `theodore_missing_variable` and follows its author and `@misc` conventions. The title and institutional affiliation match hiring-paper lines 22–29. The paper does not print a course name or a fixed year. “Natural Language Processing course project” comes from the archive context documented in `Sources/grad-precursor-survey.md`; 2024 comes from the source file’s filesystem dates. The AAAI 2025 marker at line 18 is a template version.

## Change 4 — Added the Chapter 18 generative-model instantiation

### Before

No generative-model paragraph appeared between `\paragraph{Illustrative instantiation.}` and the paragraph beginning `The mathematical objectivity of the model`.

### After

```tex
\paragraph{Generative-model instantiation.}
A controlled r\'esum\'e experiment extends the pattern to generative models. GPT-4o ranked synthetic r\'esum\'es carrying explicit and inferred racial markers and selected candidates for roles at three career levels. White-marked candidates took 68.33\% of mid-level selections, against 53.33\% at the entry and executive levels. The aggregate difference across marker categories did not reach significance ($\chi^2 = 2.547$, $p = 0.980$) \cite{theodore_hiring_bias}. The recorded selection prompt contained no racial instruction. The paper identifies differences in r\'esum\'e qualifications and White-associated attributes as possible explanations for the career-level skew. \textbf{Confidence: Tier~3} --- unpublished synthetic-r\'esum\'e experiment; exploratory career-level subgroup; non-significant aggregate test; r\'esum\'e qualifications were not held constant across all marker conditions.
```

The numerical support appears in hiring-paper lines 85–91, 105–110, 354–368, and 400–406. The caveat concerning qualifications follows line 406, which offers differing skills, educational backgrounds, and institutional affiliations as possible explanations, together with the synthetic-design limitations at lines 429–434.

## Wording and Preface-voice decisions

- I used the Preface’s British spelling `analysed` and its LaTeX convention `---` for em dashes.
- I rendered “résumé” as `r\'esum\'e` to remain consistent with portable LaTeX source.
- I replaced “reported nothing” with the clinically precise sentence “The aggregate marker-category test was not statistically significant.” This retains the brief’s meaning and directly matches the artifact.
- I kept “more than twice” in the Preface. The wording is supported by the 2.56 revision result and avoids conflict with the different Chapter 6 dataset and denominator convention.
- I kept the requested progression language and changed “those two papers” to “those earlier papers” after inserting the additional precursor.

## Unverified or bounded claims

1. **Bibliographic year:** The hiring paper contains no internal date. The 2024 year is supported by filesystem metadata and the precursor survey, not by a line printed in the artifact.
2. **No racial instruction:** The paper summarizes the model task at lines 86–90. The experiment notebook records the selection prompt directly at raw JSON lines 16720–16729: it instructs the model to evaluate the strongest overall profile using education, work experience, and skills and gives no racial selection instruction. The r\'esum\'es themselves contain racial markers, as the paper states at lines 74–83.
3. **Training-corpus mechanism:** Lines 38–40 and 47–51 describe historical-data inheritance as the study’s premise, while lines 406–407 state that the reasons for the skew are unclear and offer r\'esum\'e composition and correlated attributes as possible explanations. The experiment does not identify training-corpus correlations as the causal source of the disaggregated skew. I removed both causal training-corpus attributions after independent review.
4. **Aggregate-versus-disaggregated comparison:** The paper reports the aggregate chi-square result at lines 354–368 and the career-level percentages at lines 400–406. It does not report a career-level significance test. “The skew appeared after disaggregation” describes the reported percentages and does not claim subgroup statistical significance.
5. **Four-model scope conflict:** The hiring paper presents the evaluation as covering four models at lines 85–91. The notebook shows the four-model loop operating on `UpdatedResumeDataSet.csv` at raw JSON lines 15535–15554. The career-level synthetic experiment hard-codes `gpt-4o-2024-08-06` at line 16737, processes LL, ML, and EL at lines 16797–16807, and outputs the reported percentages at lines 17097–17110. The brief’s original wording joined the four-model count to the career-level percentages. The manuscript now states the overall four-model scope separately and attributes the career-level result to GPT-4o.

The remaining provenance limits are stated plainly.

## Independent verification

An independent reviewer was instructed that disagreement was valued and was authorized to reject the edit. The first review returned **DISAGREE**. It confirmed every inserted empirical statistic and rejected the causal training-corpus attribution, the unsupported “production” label, and the lack of direct artifact contact for the no-racial-instruction and lineage statements. I removed the causal attribution and “production” label, opened the recorded experiment prompt directly, and opened *The Calculus of Injustice* v1 directly. The v1 lineage statement appears at `Paper.tex` line 44. The prompt contains no racial selection instruction at notebook raw JSON lines 16720–16729. The second review returned **DISAGREE** after locating the four-model scope conflict in the notebook. I separated the overall four-model study description from the single-model career-level result in both manuscript passages and documented the conflict above.

The third independent review returned **AGREE**. It confirmed the model-scope correction, every inserted empirical number, the citation key and bibliography entry, paragraph placement, factual bounds, and rhetorical compliance.

## Rhetorical-constraint self-check

The changed prose contains no formulaic antithesis, corrective contrast, or “not merely X, but Y” construction. It uses direct declarative sentences.

The sentence that required the closest review was:

> The aggregate marker-category test was not statistically significant; the skew appeared after disaggregation by career level.

It passes because the first clause is a factual negation reporting the source’s null aggregate test. The semicolon links two reported levels of analysis without a corrective “not X but Y” formula.

The sentence “The incident features themselves carried little group-identifying signal once the classifier was cross-validated, which set a clear limit on what incident-only data can establish about the decision to use force” also passes. It states the measured classifier result and its documented inference boundary directly.

## Procedure confirmation

I did not run Git, Make, `latexmk`, `pdftoppm`, or any build tool. I did not edit or create any file outside:

- `Paper/The_Original_Power.tex`
- `Paper/references.bib`
- `Sources/edit-preface-ch18_FINDINGS.md`

No build or rendered-PDF check was performed, as required by the task.
