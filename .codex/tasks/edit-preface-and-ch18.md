# Task — Preface correction + hiring-paper beat + Ch. 18 citation

## DO NOT COMMIT. DO NOT BUILD. DO NOT TOUCH GIT.

- No `git` commands. No `make`. No `latexmk`. No `pdftoppm`.
- The orchestrator runs the build and the commit after review.
- You edit exactly these files:
  - `Paper/The_Original_Power.tex`
  - `Paper/references.bib`
- Plus you create one findings file: `Sources/edit-preface-ch18_FINDINGS.md`.
- Leave every other file alone. The repo has unrelated uncommitted work in
  `.mcp.json` and `debate/police-origin.md` — do not stage, revert, or touch it.

## Rhetorical constraint — enforced, no exceptions

From `AGENTS.md`: *zero tolerance for formulaic antithesis, didactic contrasts, and
boilerplate juxtaposition. Eliminate corrective contrasts and pseudo-profound phrasing
("It is not merely X, it is Y", "More than just X..."). Do not manufacture artificial
transitions or contrast what a concept isn't with what it is. Direct, affirmative
declarative statements only.*

Every sentence you write or change must pass that test. A factual negation ("the aggregate
test was not significant") is fine. A rhetorical contrast ("not a clean result, but a
bounded one") is not — rewrite it as two affirmative statements.

## Factual-claim protocol — `AGENTS.md`, MANDATORY

You are adding statistics to `Paper/`. For **every number** you introduce, the findings
file must name the artifact you opened and the page/line where you read it. Artifacts:

- `/Users/emmanuel/Documents/Grad/MPC/Final Paper/Paper_v2.tex` — *Calculus of Injustice* v2
- `/Users/emmanuel/Documents/Grad/NLP/Project/Report/Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex`
  — the hiring paper (and `Sources/4_Exploring_Bias_and_Fairness_.pdf` is the same paper)
- The full assessment with quotes and line numbers is in `Sources/grad-precursor-survey.md` — read it first.

If a number you were told to use does not match what the artifact says, **stop and report
it in the findings file**. Do not "fix" it silently. "Cannot confirm" is a complete answer.

---

## Change 1 — Preface: correct the *Calculus of Injustice* paragraph

**File:** `Paper/The_Original_Power.tex`. Find the paragraph beginning
`The second document was empirical. \textit{The Calculus of Injustice} applied principal
component analysis and linear discriminant analysis` (≈ line 151).

**Problem.** It claims the LDA "produced a clean geometric result: racial groups separated
in discriminant space, with the White cluster distinct from an overlapping Black and
Hispanic cluster" and calls this "the structural signature of a shared systemic basin". The
author's own 2026 revision (`Paper_v2.tex`) shows that plot was circular — points coloured
by in-sample predicted class. Cross-validated, the discriminant signal is 56.5% against a
51.5% majority baseline (read this off `Paper_v2.tex` and confirm the exact figures). The
revision's real result is a per-capita disparity.

**Replace the paragraph with** (adjust wording to match the surrounding Preface voice;
keep it one paragraph, keep the *From Bias to Bytes* citation-of-prior-work sentence):

> The second document was empirical. *The Calculus of Injustice* analysed a national dataset
> of fatal police shootings, comparing group death counts against population denominators
> and testing how much racial signal the recorded incident features carry. Black people were
> killed at more than twice the White per-capita rate. The incident features themselves
> carried little group-identifying signal once the classifier was cross-validated, which set
> a clear limit on what incident-only data can establish about the decision to use force.
> The paper cited *From Bias to Bytes* as the prior work that had named the set-theoretic
> and machine-learning program. The per-capita disparity was that program's first measured
> empirical shadow.

**Do NOT put a hard rate-ratio number in the Preface.** Chapter 6's police-killings case
study (`\label{cs:police_killings}`, ≈ line 4613) reports a Black-to-White ratio of about
3.01 from a different dataset and denominator convention. "More than twice" is true under
both and creates no conflict. If you think a number is essential, report that in the
findings file instead of inserting one.

**Then** find the sentence in the next paragraph (≈ line 153) beginning
`The empirical LDA result---the racial partition as a geometric separation in outcome
space---is one anchor case`. Replace it with:

> The empirical disparity result — the racial gap in fatal-shooting rates, bounded by the
> limits of incident-only data — is one anchor case in an archive of 146 anchor cases
> spanning five centuries of the extraction algorithm's operation.

Also in that paragraph, the opening `executes what those two papers described` must become
`executes what those earlier papers described` (there are now three precursors, see Change 2).

## Change 2 — Preface: add the hiring paper as a fourth beat

**File:** `Paper/The_Original_Power.tex`. Insert a **new paragraph** immediately after the
corrected *Calculus of Injustice* paragraph (Change 1) and before the paragraph beginning
`\textit{The Original Power} executes what those earlier papers described`.

New paragraph (match Preface voice; affirmative declaratives only):

> The next document built the applied capability the proposal had named. *Exploring Bias and
> Fairness in Language Models Applied to Hiring* generated synthetic résumés carrying
> explicit and inferred racial markers and submitted them to four production language models
> for hiring decisions across career levels. Entry-level and executive-level selections held
> near demographic parity. Mid-level selections went to White candidates in roughly two
> cases out of three. The models received no racial instruction. They reproduced the
> disparity from the correlations already present in their training data, and they
> concentrated it at the career stage where advancement compounds. Aggregate significance
> testing across marker categories reported nothing; the skew appeared only after
> disaggregating by career level.

Confirm "roughly two cases out of three" against the paper's mid-level White selection
figure (the survey memo records 68.33%). If the paper's own number rounds differently, use
the paper's framing and note it.

**Then** update the progression paragraph (≈ line 155). Current text:

> The progression from proposal to empirical detection to formal derivation defines the
> framework's method: identify a structure, detect its empirical shadow, then derive the
> mechanism that produces both. \textit{From Bias to Bytes} identified the structure.
> \textit{The Calculus of Injustice} detected the shadow. This book derives the mechanism,
> and follows that mechanism to its conclusion.

Replace with:

> The progression from proposal to empirical detection to applied audit to formal derivation
> defines the framework's method: identify a structure, detect its empirical shadow, build
> the instrument that measures it, then derive the mechanism that produces all three.
> *From Bias to Bytes* identified the structure. *The Calculus of Injustice* detected the
> shadow. *Exploring Bias and Fairness in Language Models Applied to Hiring* built the
> detector and turned it on the machine substrate. This book derives the mechanism, and
> follows that mechanism to its conclusion.

## Change 3 — `references.bib`: add the entry

Match the style of the existing author entries — search `theodore_missing_variable` and
`spatial_confluence_forthcoming` in `Paper/references.bib` and follow whichever pattern
they use (`author = {Theodore, Emmanuel}`, unpublished type). Add:

```bibtex
@misc{theodore_hiring_bias,
  author = {Theodore, Emmanuel},
  title  = {Exploring Bias and Fairness in Language Models Applied to Hiring},
  year   = {2024},
  type   = {Unpublished manuscript},
  note   = {Natural Language Processing course project, Wentworth Institute of Technology},
}
```

Adjust the key and fields only if the existing entries use a different convention. Place it
near the other `theodore_*` entries or in the same thematic block as the algorithmic-bias
sources (`angwin_machine_bias`, `buolamwini_gender_shades`), whichever the file's ordering
suggests.

## Change 4 — Ch. 18: add the illustrative instantiation

**File:** `Paper/The_Original_Power.tex`. Find the paragraph beginning
`\paragraph{Illustrative instantiation.}` under `\section{Porting the Legacy Code...}`
(≈ line 13074) — the one citing ProPublica's COMPAS analysis and Buolamwini/Gebru. Insert a
**new paragraph immediately after it**, before the paragraph beginning
`The mathematical objectivity of the model then functions as the \textbf{Constitutional
Shield}` (≈ line 13077).

New paragraph:

> \paragraph{Generative-model instantiation.}
> A controlled résumé experiment extends the pattern to generative models. Four GPT models
> ranked synthetic résumés carrying explicit and inferred racial markers and selected
> candidates for roles at three career levels. White-marked candidates took 68.33\% of
> mid-level selections, against 53.33\% at the entry and executive levels. The aggregate
> difference across marker categories did not reach significance ($\chi^2 = 2.547$,
> $p = 0.980$) \cite{theodore_hiring_bias}. The models were given no racial instruction; the
> career-level skew tracks the correlations carried in their training corpus.
> \textbf{Confidence: Tier~3} --- unpublished synthetic-résumé experiment; exploratory
> career-level subgroup; non-significant aggregate test; résumé qualifications were not held
> constant across all marker conditions.

Verify `68.33`, `53.33`, `2.547`, `0.980` against the hiring paper before writing them.
Match the Tier-label and `\paragraph` formatting of the COMPAS paragraph exactly.

---

## Findings file — `Sources/edit-preface-ch18_FINDINGS.md`

- Per-claim artifact contact: every number, the file opened, the line/page it was read from,
  and whether it matched what this brief told you.
- The exact before/after text of each of the four changes.
- Any place the brief's wording collided with the Preface voice and how you resolved it.
- Anything you could not verify, or any number that did not match — list it plainly.
- Confirm you did not run git, make, or any build tool.
- A rhetorical-constraint self-check: quote any sentence you were unsure about and say why
  it passes.
