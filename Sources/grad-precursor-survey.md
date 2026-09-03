# Graduate-Archive Precursor Survey

## Scope and artifact contact

This survey covers the six assigned papers and the requested ECE-education comparator. I opened the LaTeX source for every paper directly under `/Users/emmanuel/Documents/Grad/`. I also opened `ClassicalAI/Final/F1.py`, `ClassicalAI/Final/sentiment_analysis_results.txt`, the relevant cells of `NLP/Project/Evaluating_Fairness_in_Large_Language_Models_for_Hiring_Tasks-2.ipynb`, and the structure of `NLP/Project/real_data_hiring_results.json`. Manuscript attachment points come from `Paper/The_Original_Power.tex`, opened directly at lines 141–155, 4613–4639, 13039–13108, and 13975–14065. Numerical claims below report what these local artifacts state. I did not rerun either analysis or independently validate its source data. Provenance is therefore **unpublished course manuscript** unless stated otherwise.

## A. *The Calculus of Injustice*, v1

**Artifact.** `/Users/emmanuel/Documents/Grad/MPC/Final Paper/Paper.tex`, opened in full. The file is 203 lines; its filesystem creation date is 2023-12-13. The course archive identifies the setting as ELEC57255 Machine Perception and Cognition, Wentworth Institute of Technology, Fall 2023.

**Summary.** The paper argues that PCA and LDA can expose racial structure in a national fatal-police-shootings dataset, named in the source as `police_killings_MPV_modified_cleaned.csv` and attributed to the Washington Post through Kaggle. It normalizes numeric variables, computes principal components, fits LDA to race labels, predicts those labels on the same observations, and plots the first two PCA scores colored by predicted class. The headline result is a three-class picture: a White cluster and overlapping Black and Hispanic clusters. The paper reports no sample size, explained-variance percentages, held-out accuracy, uncertainty interval, or significance test. Its only numerical output is visual separation across two plotted principal components.

**Relation to the framework.** This is the document described at manuscript line 151: “The linear discriminant analysis produced a clean geometric result: racial groups separated in discriminant space, with the White cluster distinct from an overlapping Black and Hispanic cluster.” It also supports the archival claim that the paper cited *From Bias to Bytes* as prior work: the source names that paper in its literature review. Its plotting procedure does not establish the stronger claims at lines 151 and 153 that the partition appeared “as a geometric fact” or supplied “empirical confirmation.” The figure uses PCA coordinates and predicted LDA labels from an in-sample model; v2 identifies this as circular.

**Verdict: `PREFACE-LINEAGE`.** The paper is the named empirical precursor, and its historical role belongs in the Preface. Its analysis is too weak for chapter evidence.

**Confidence / caveats.** Low. The source omits the analytic sample size and validation metrics, drops categorical variables by selecting numeric columns, evaluates no held-out data, and colors observations by in-sample predicted class. The visual result demonstrates classifier output, not racial separation in observed outcome space. v2 directly reverses the v1 interpretation.

## B. *The Calculus of Injustice*, v2

**Artifact.** `/Users/emmanuel/Documents/Grad/MPC/Final Paper/Paper_v2.tex`, opened in full. The file is 325 lines; its filesystem creation and modification date is 2026-06-25. It is a post-course revision of the 2023 ELEC57255 project.

**Summary.** v2 replaces the single exploratory projection with three bounded analyses of Washington Post fatal-shooting incidents from January 2015 through December 2024, supplemented by ACS 2024 population denominators. The studied-race subset contains 9,046 of 10,430 incidents: 4,659 White, 2,486 Black, 1,717 Hispanic, and 184 Asian victims. Black people have a reported cumulative rate of 62.2 per million versus 24.3 for White people, giving a Black-to-White rate ratio of 2.56 (95% CI 2.43–2.68). Conditional on a fatal shooting, the adjusted Black-versus-White odds ratio for being unarmed is 1.20 (95% CI 0.91–1.59, p = 0.20). Cross-validated LDA reaches 56.5% ± 0.4% accuracy against a 51.5% majority baseline; the first two FAMD dimensions explain 13.5% of variance. Black and Hispanic recalls are 0.34 and 0.38, and the model never predicts the small Asian class.

**Relation to the framework.** v2 governs the accuracy of the Preface account at lines 151–155. It preserves a measured “shadow” through the 2.56 per-capita disparity and rejects the claimed clean multivariate partition. It also aligns with the enforcement-lethality case study at lines 4617–4639, especially: “Per-capita police killing rates by racial group provide a direct, measurable operationalization of this prediction.” That chapter already uses a longer 2013–2024 Mapping Police Violence series with annual population denominators and a reproducible manuscript dataset. Adding v2 there would be redundant and would introduce a weaker single-year denominator.

**Verdict: `PREFACE-LINEAGE`.** v2 supplies the responsible account of what the named empirical project ultimately established. The existing Chapter 6 evidence is stronger and should remain the chapter source.

**Confidence / caveats.** Moderate for descriptive disproportionality; low for causal claims. The rate ratio uses ten years of counts divided by one 2024 population estimate, so the levels are cumulative and only the ratio is interpretable. Population exposure cannot identify encounter-stage bias. The incident-only logistic model conditions on realized shootings and cannot identify the decision to use force. The v2 results were read from the manuscript and were not rerun in this survey.

## C. Earlier PCA/LDA group exercise

**Artifact.** `/Users/emmanuel/Documents/Grad/MPC/Group exercises/Homework/Linear Discriminant Report/Linear_Discriminant_Report.tex`, opened in full. The file is 208 lines; its filesystem creation date is 2023-11-19. It belongs to ELEC57255 Machine Perception and Cognition, Fall 2023.

**Summary.** This report is the immediate exercise-level precursor to v1. It applies the same PCA/LDA workflow to `police_killings_MPV_modified_cleaned.csv`, selects and normalizes numeric variables, trains LDA on racial labels, and plots two PCA components colored green for Black, blue for White, and orange for Hispanic predicted classes. It reports the same White-distinct and Black/Hispanic-overlap reading. It supplies no sample size, variance share, accuracy, baseline, confidence interval, or significance test. The two figures, code, and prose are substantially duplicated in v1.

**Relation to the framework.** It maps to the same Preface sentence at line 151 and adds no independent mechanism, dataset, or result. The archive shows the development sequence from exercise to final paper. The manuscript’s lineage concerns research documents that advanced the program; this exercise is a draft stage of the named final paper.

**Verdict: `NEITHER`.** It is provenance for v1 rather than a separate precursor or evidentiary source.

**Confidence / caveats.** Low. It has the same in-sample prediction-colored plot, numeric-only feature selection, missing sample description, and absent validation as v1. Treating it as corroboration would double-count one analysis.

## D. *Markov Models in Analysis of Systemic Inequalities*

**Artifact.** `/Users/emmanuel/Documents/Grad/MPC/Group exercises/Homework/Markov Model Application/Transitions and Probabilities: Applying Markov Models to Systemic Racism.tex`, opened in full. The file is 128 lines; its filesystem creation date is 2023-10-24. It belongs to ELEC57255 Machine Perception and Cognition, Fall 2023.

**Summary.** The exercise proposes race- and policy-conditioned Markov chains for employment and social mobility. It defines employed/unemployed transitions, gives an illustrative 5/100 = 0.05 job-loss transition, and specifies four income/education states with a 4 × 4 right-stochastic matrix. It suggests demographic observations, stationary distributions, first-hitting times, heatmaps, directed graphs, and mixing plots. The matrix is hypothetical. The paper uses no empirical dataset, estimates no race-specific transition probability, and reports no fitted result.

**Relation to the framework.** The source calls itself part of “the semester project focused on systemic racism and social inequalities.” It supplies an archival bridge between the proposal named at manuscript line 149 and the empirical paper named at line 151. Its state-transition conception anticipates the book’s use of policies as transition operators and its compounding-chain logic. No present equation reproduces this four-state chain, and the paper supplies no evidence for a current parameter. Its contribution belongs to the Preface narrative as the point where a static partition acquired temporal dynamics.

**Verdict: `PREFACE-LINEAGE`.** The exercise advances the formal program conceptually and deserves one concise beat in the Preface. Its hypothetical matrix cannot serve as chapter evidence.

**Confidence / caveats.** High confidence in the conceptual lineage; no empirical confidence. Every probability and state is illustrative. The paper contains no literature review or internal citation to *From Bias to Bytes*, so its position in the same project rests on its own “semester project” statement and its October 2023 archive date.

## E. *Sentiment and Ideological Bias Analysis in GPT Models*

**Artifact.** `/Users/emmanuel/Documents/Grad/ClassicalAI/Final/Final_Presentation/report.tex`, opened in full, plus `ClassicalAI/Final/sentiment_analysis_results.txt` and `ClassicalAI/Final/F1.py`. The report’s filesystem creation date is 2024-08-13. The surrounding archive contains COMP5700 and COMP5925 coursework; the final’s exact course code is `[uncertain]`.

**Summary.** The project sends all 62 Political Compass statements to five GPT variants—GPT-3.5-turbo-0125, GPT-4-turbo-preview, GPT-4-turbo, GPT-4o, and GPT-4o-mini—requests one of four agreement levels, requests explanations, and applies TextBlob polarity and subjectivity to those explanations. The saved results contain one complete 62-item block per model, plus one extra empty GPT-3.5 parsing artifact. Mean polarity ranges from 0.1312 for GPT-4-turbo to 0.1683 for GPT-3.5-turbo-0125; mean subjectivity ranges from 0.4884 for GPT-4-turbo-preview to 0.5251 for GPT-3.5-turbo-0125. The report states that models differ in economic and social position and tend toward neutral-to-positive sentiment.

**Relation to the framework.** The topic points toward Chapter 18’s Attractor Conjecture, especially line 13086: “Any system that maximizes engagement, profit, or stability on a historical dataset ... will converge on [the phase-loading vector].” The study does not test training-data inheritance, engagement optimization, racial partitioning, or phase loading. The implementation assigns every response the same scalar value on both the economic and social axes. It never maps individual Political Compass questions to the appropriate axis or direction. The resulting ideological coordinates cannot test the conjecture.

**Verdict: `NEITHER`.** The project is thematically adjacent to algorithmic ideology and lacks a valid operationalization of ideological position.

**Confidence / caveats.** Low. The prompt instrument is proprietary and lacks a documented scoring key in the archive. The code’s economic and social scores are identical by construction. GPT-4-turbo-preview produces numerous refusals that the parser does not normalize. TextBlob sentiment measures wording polarity and subjectivity, not ideological bias. The model versions, stochastic settings, replication counts, and inferential tests are insufficiently specified.

## F. *Exploring Bias and Fairness in Language Models Applied to Hiring*

**Artifact.** `/Users/emmanuel/Documents/Grad/NLP/Project/Report/Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`, opened in full, plus the relevant source and output cells in `NLP/Project/Evaluating_Fairness_in_Large_Language_Models_for_Hiring_Tasks-2.ipynb` and the structure of `NLP/Project/real_data_hiring_results.json`. The report’s filesystem creation date is 2024-12-05 and modification date is 2024-12-07. Its exact NLP course code is `[uncertain]`.

**Summary.** The study generates synthetic Black- and White-marked résumés using explicit affiliations, names, educational signals, extracurriculars, and mixed markers. Four GPT models rank batches of ten résumés and select up to four candidates for low-, mid-, and executive-level roles. The report states that Black selections were 46.67% at low level, 31.67% at mid level, and 46.67% at executive level; White selections were 53.33%, 68.33%, and 53.33%. Its aggregate marker-category test is χ² = 2.547, p = 0.980, indicating no statistically significant aggregate selection difference. The notebook also contains a real-résumé run using `UpdatedResumeDataSet.csv`: 97 batches were evaluated by each of four models, producing 388 batch evaluations in `real_data_hiring_results.json`. That run has occupational categories and résumé text without validated racial labels, and it does not support a race-comparison result in the report.

**Relation to the framework.** This project most directly realizes the proposal’s “automatic bias-detection capability” quoted at manuscript line 149. It also provides a limited test of Chapter 18 line 13064, where accumulated perceptions become “datasets, weights, scores, and automated decisions,” and line 13096, where the optimizer follows correlations in historical data. The controlled racial markers operationalize proxy transmission. The synthetic generation process also embeds unequal schools, affiliations, experience, and other qualifications, so the experiment does not isolate race cleanly. The aggregate null result complicates any claim of general model-wide racial selection bias.

**Verdict: `BOTH`.** It completes an applied promise from the proposal and supplies preliminary, explicitly low-confidence evidence for Chapter 18’s prior-inheritance mechanism.

**Ready BibTeX.** The AAAI-2025 formatting is a template; the artifact remains an unpublished 2024 course manuscript.

```bibtex
@unpublished{theodore_hiring_bias_2024,
  author = {Emmanuel Theodore},
  title  = {Exploring Bias and Fairness in Language Models Applied to Hiring},
  year   = {2024},
  note   = {Unpublished manuscript, Natural Language Processing course, Wentworth Institute of Technology}
}
```

**Exact `\cite` insertion point.** Insert a separate paragraph immediately after the existing “Illustrative instantiation” paragraph at `Paper/The_Original_Power.tex:13075`, before the paragraph beginning “The mathematical objectivity of the model” at line 13077:

```tex
An unpublished controlled résumé experiment provides a preliminary generative-model
instantiation. Four GPT models selected White-marked candidates for 68.33\% of
mid-level slots, compared with 53.33\% at the low and executive levels; the aggregate
difference across marker categories was not statistically significant
($\chi^2 = 2.547$, $p = 0.980$) \cite{theodore_hiring_bias_2024}.
\textbf{Confidence: Tier~3} --- unpublished synthetic-resume experiment; exploratory
career-level subgroup; non-significant aggregate test; qualifications were not held
constant across all racial-marker conditions.
```

**Confidence / caveats.** Low, appropriate to Tier 3. The reported career-level percentages are descriptive subgroup findings, the aggregate test is null, and the paper gives no career-level confidence intervals or corrected hypothesis tests. Résumés are synthetic and appear to vary in substantive qualifications alongside racial proxies. The paper describes mitigation techniques as applied, yet it reports no clear before/after mitigation results. The four-model pooling obscures model-specific effects. The real-résumé run confirms additional experimentation and provides no racial ground truth.

## Comparator: *AI Tools in ECE Education*

`/Users/emmanuel/Documents/Grad/Last_paper/paper.tex` confirms the orchestrator’s verdict. The August 2025 paper surveys GenAI tutoring, productivity, academic integrity, accessibility, cognitive debt, and infrastructure sustainability in ECE education. Its lineage connection is tangential: lines 119–122 discuss the siting of xAI infrastructure near a low-income Black community, and line 62 gives a personal music/DAW-to-op-amp design anecdote. It does not model extraction, test group partitioning, develop a bias detector, or advance the manuscript’s formal mechanism. **Verdict: `NEITHER`.**

## The v1 versus v2 *Calculus of Injustice* problem

**Finding.** v2 undercuts the Preface sentence as currently written. The current claim at line 151 says the analysis produced “a clean geometric result” and that racial groups “separated in discriminant space.” v2 states that the recorded features carry “little” group-identifying signal and calls the v1 plot circular. Its held-out accuracy is 56.5% against a 51.5% baseline, Black recall is 0.34, Hispanic recall is 0.38, and Asian recall is zero. The current line 153 repeats the unsupported characterization as “a geometric separation in outcome space.” The artifact supports descriptive per-capita disproportionality and weak feature separability.

**Recommendation: (b) soften the Preface wording.** The 2.56 rate ratio belongs in the revised description because it is the strongest result. It should not replace the “shadow” with a single statistic as option (c) proposes. The shadow is the bounded pattern: large per-capita disparity, modest incident-feature separability, and an explicit limit on causal identification.

**Recommended replacement for lines 151 and the LDA sentence in line 153:**

> The second document was empirical. *The Calculus of Injustice* applied population-rate analysis, principal component analysis, and linear discriminant analysis to a national dataset of fatal police shootings. Its revised analysis found that Black people were killed at 2.56 times the White per-capita rate, with a 95 percent confidence interval of 2.43 to 2.68. Recorded incident features carried modest group-identifying signal: cross-validated LDA accuracy reached 56.5 percent against a 51.5 percent majority baseline. The project detected a racial disparity in outcomes and established the limits of incident-only data for identifying bias in the decision to use force. The paper cited *From Bias to Bytes* as the prior work that had named the set-theoretic and machine-learning program. The disparity was the program’s first measured empirical shadow.
>
> The revised empirical result—the racial disparity in fatal-shooting rates, bounded by the data’s causal limits—is one anchor case in an archive of 146 anchor cases spanning five centuries of the extraction algorithm’s operation.

The summary line at manuscript line 155 remains accurate after this change: “*The Calculus of Injustice* detected the shadow.”

## Does the arc become three, four, or five papers?

**Recommendation: use a five-beat arc.** Count the book as the fifth beat: (1) *From Bias to Bytes* identifies the static structure and proposes an automatic detector; (2) the Markov exercise introduces temporal state transitions; (3) *The Calculus of Injustice*, represented by its corrected v2 findings, measures an empirical disparity and defines the data boundary; (4) the hiring project builds the proposed detector in a controlled LLM setting and obtains mixed, preliminary results; (5) *The Original Power* derives the mechanism. The ClassicalAI ideological-bias final remains outside the arc because its two-axis scoring is invalid.

**Draft Preface bridge after the paragraph on *From Bias to Bytes*:**

> A Markov-model exercise gave the proposed structure a time axis. It represented employment and social mobility as transitions among states conditioned by race and policy. Its probabilities were illustrative, and its contribution was conceptual: policy entered the program as an operator that changes the distribution of future states.

**Draft Preface bridge after the revised *Calculus of Injustice* paragraph:**

> A later natural-language-processing project returned to the proposal’s applied endpoint. *Exploring Bias and Fairness in Language Models Applied to Hiring* tested four GPT models on synthetic résumés carrying explicit and inferred racial markers. Low- and executive-level selections approached parity; mid-level selections were 68.33 percent White and 31.67 percent Black. The aggregate marker-category difference was not statistically significant. The experiment built the proposed detection apparatus and showed the level of control, replication, and uncertainty required to use it responsibly.

**Draft revised progression paragraph:**

> The progression from proposal to dynamic model, empirical measurement, applied audit, and formal derivation defines the framework’s method. *From Bias to Bytes* identified the structure. The Markov exercise introduced transition. *The Calculus of Injustice* detected a bounded empirical shadow. The hiring study tested the proposed detector and recorded a mixed result. *The Original Power* derives the mechanism that links those objects across historical time.

This version preserves the archive’s development and states the negative and null findings directly.

## Chronology and numbering

| Order | Document | Internal date/course evidence | Filesystem evidence | Assessment |
|---:|---|---|---|---|
| 1 | *From Bias to Bytes* | Named by v1 as prior work and by the Preface as the semester-project proposal. No source file, `\date`, course code, or direct timestamp was found in the Grad tree. | Absent from the searched `.tex`, `.md`, `.txt`, and `.ipynb` archive except for v1’s reference. | Before 2023-12-13; probably before the Markov exercise because that exercise refers to an existing semester project `[uncertain]`. |
| 2 | Markov exercise | ELEC57255 Machine Perception and Cognition, Fall 2023; header uses `\today`. | Created 2023-10-24 23:38; modified 2023-10-25 00:11. | First dated surviving formal-program exercise. |
| 3 | LDA exercise | ELEC57255 Machine Perception and Cognition, Fall 2023; `\date{\today}`. | Created 2023-11-19 21:14; modified 2023-11-20 00:17. | Direct draft precursor to v1. |
| 4 | *Calculus of Injustice* v1 | ELEC57255 Machine Perception and Cognition, Fall 2023; `\date{\today}`; explicitly cites *From Bias to Bytes*. | Created 2023-12-13 16:36; modified 2023-12-13 22:07. | Original named empirical paper. |
| 5 | ClassicalAI GPT-bias final | Archive covers COMP5700 and COMP5925; exact course assignment is `[uncertain]`; report has no `\date`. | Created 2024-08-13 03:08; modified 2024-08-13 23:54. The presentation metadata records 2024-08-13 creation and 2024-08-18 modification. | Later methodological branch; excluded from the lineage. |
| 6 | NLP hiring project | Natural Language Processing course, exact COMP number `[uncertain]`; report has no `\date`; AAAI 2025 is the template version, not publication status or paper year. | Created 2024-12-05 18:34; modified 2024-12-07 00:06. Notebook and results files run through 2024-12-12. | Applied continuation of the proposal’s detector goal. |
| 7 | *Calculus of Injustice* v2 | Post-course revision; `\date{\today}` supplies no fixed internal date. | Created and modified 2026-06-25 18:37. | Methodological correction of item 4; treat as the controlling version, not a new grad-school beat. |

The archive establishes the sequence Markov → LDA exercise → v1 through filesystem dates. v1 establishes that *From Bias to Bytes* preceded it. The available evidence does not fix whether *From Bias to Bytes* preceded the 2023-10-24 Markov exercise. The course identifier appears in two local forms: `MPC/AGENTS.md` says ELEC5725, while `MPC/Exams/Exam_1/Exam1.tex` prints ELEC57255. The contemporaneous exam is the stronger artifact, so this memo uses ELEC57255 and records the discrepancy. The ClassicalAI final’s exact placement between COMP5700 and COMP5925 remains unresolved. The NLP project’s exact COMP number remains unresolved. These gaps should remain explicit until a syllabus, transcript, learning-management export, or assignment cover sheet resolves them.
