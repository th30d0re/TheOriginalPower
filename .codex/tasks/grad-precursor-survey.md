# Task — Grad-archive precursor survey for *The Original Power*

## DO NOT TOUCH GIT, DO NOT EDIT THE MANUSCRIPT

- Do **not** run any `git` command. The repo has uncommitted work; leave it alone.
- Do **not** edit `Paper/The_Original_Power.tex`, `Paper/references.bib`, or anything
  under `Paper/`, `chapters/`, `figures/`, `data/`.
- You write **exactly one file**: `Sources/grad-precursor-survey.md` (create it).
- Everything else is read-only. No builds, no `make`, no notebook execution.

## Why this task exists

*The Original Power* (`Paper/The_Original_Power.tex`) is a book-length formal framework
modelling systemic oppression as an elite-extraction algorithm. Its **Author's Preface**
(search `\chapter*{Author's Preface}`, around line 141) narrates the research program that
led to the book as a sequence of the author's own earlier papers:

1. *From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism and Social
   Inequalities* — the proposal. Named CRT + cognitive bias + McKelvey–Schofield + set
   theory; proposed modified Venn diagrams; named the In-group/Out-group binary; **"proposed
   an automatic bias-detection capability as the ultimate applied output."**
2. *The Calculus of Injustice* — empirical; PCA + LDA on a fatal-police-shootings dataset;
   "racial groups separated in discriminant space."
3. *The Original Power* — derives the mechanism.

Summary line the Preface uses: *"From Bias to Bytes identified the structure. The Calculus
of Injustice detected the shadow. This book derives the mechanism."*

The author has just located the full grad-school archive these papers came out of and wants
to know **which other papers in it belong in that lineage** — either named in the Preface,
or cited as evidence in a chapter, or neither.

Two chapters are the likely evidence-attach points for the AI/LLM papers:

- **Ch. 18 "The Algorithmic Epoch"** (`\label{ch:algorithmic_epoch}`, ~line 13038).
  §"Porting the Legacy Code" and §"The Attractor Conjecture". Eq.
  `eq:14.1-algo-prior-inheritance` claims a facially-neutral optimizer trained on historical
  data reproduces the racial partition. Its "Illustrative instantiation" para currently
  cites only COMPAS (ProPublica) and Gender Shades (Buolamwini/Gebru).
- **Ch. 19 "The Spectral Carrier"** (`\label{ch:spectral_carrier}`, ~line 13974) — empirical
  validation chapter, signal/spectral analysis of political-attention time series.

How the two existing precursors are handled in the Preface: **named in prose, italicised,
no `\cite`, no bib entry.** Other author works-in-progress that are used *as evidence*
(e.g. `theodore_missing_variable`, `spatial_confluence_forthcoming` in `references.bib`) get
a real bib entry. Both patterns are available; your job includes recommending which each
paper warrants.

## Author's standing instructions for any citation you propose

- Treat every one of these papers as **unpublished** (`@unpublished` / "Unpublished
  manuscript, <course>, Wentworth Institute of Technology, <year>"). The author published
  revised versions of some but wants the **source/grad version** cited, not the published one.
- Author name: **Emmanuel Theodore**.
- The manuscript's rhetorical constraint applies to any prose you draft: direct affirmative
  declaratives only. No "not merely X, it is Y", no corrective-contrast antithesis. See
  `AGENTS.md`.

## The files to read (all under `/Users/emmanuel/Documents/Grad/`)

Already assessed by the orchestrator as **relevant** — read each in full (PDF or .tex):

| # | Path | What it is (first-pass) |
|---|------|--------------------------|
| A | `MPC/Final Paper/Paper.tex` | *The Calculus of Injustice* — the v1 named in the Preface. Lit review explicitly cites *From Bias to Bytes*. |
| B | `MPC/Final Paper/Paper_v2.tex` | *The Calculus of Injustice* **v2** — heavily revised. Per-capita rate ratios w/ CIs (Black 2.56× white rate); logistic "unarmed\|shot" OR 1.20 (n.s.); **cross-validated LDA only 56.5% vs 51.5% baseline**; explicitly disclaims what incident-only data can show. |
| C | `MPC/Group exercises/Homework/Linear Discriminant Report/Linear_Discriminant_Report.tex` | Earlier group-exercise version of the PCA/LDA police analysis — same dataset, same green/blue/orange cluster-separation finding. |
| D | `MPC/Group exercises/Homework/Markov Model Application/Transitions and Probabilities: Applying Markov Models to Systemic Racism.tex` | "Markov Models in Analysis of Systemic Inequalities" — models employment / social-mobility as a Markov chain, transitions conditioned on race + policy; calls itself part of "the semester project focused on systemic racism." |
| E | `ClassicalAI/Final/Final_Presentation/report.tex` | "Sentiment and Ideological Bias Analysis in GPT Models" — runs the full Political Compass test through GPT-3.5-turbo / GPT-4-turbo / GPT-4o / GPT-4o-mini, measures economic + social bias and sentiment polarity/subjectivity of the models' explanations. Also read `ClassicalAI/Final/sentiment_analysis_results.txt` and `F1.py` if quick. |
| F | `NLP/Project/Report/Theodore_BiasFairnessLanguageModelsHiring_AAAI2025.tex` | "Exploring Bias and Fairness in Language Models Applied to Hiring" — synthetic résumés w/ racial markers → 4 GPT models rank/select for LL/ML/EL roles. Finding: LL & EL near parity, **ML skews ~68/32 white/Black**; aggregate χ²=2.547 p=0.980 (n.s.). NLP course project in AAAI-2025 style, **not published**. Also skim `NLP/Project/Evaluating_Fairness_in_Large_Language_Models_for_Hiring_Tasks-2.ipynb` and `NLP/Project/real_data_hiring_results.json` — there may be a **real-résumé** run (`UpdatedResumeDataSet.csv`), not only synthetic. Note it if so. |

One more to give a paragraph, not a full read:
`Grad/Last_paper/paper.tex` — "AI Tools in ECE Education" (GenAI in engineering pedagogy,
IEEE format, ~Aug 2025). Orchestrator's read: **not lineage material**, one tangential
equity point (data-centre siting near vulnerable communities) and a self-anecdote (music/DAW
→ op-amp filter design via AI). Confirm or challenge that verdict in one paragraph.

Ignore everything else in `Grad/` (search algorithms, PDDL planners, theorem prover,
robotics, power systems, VLSI, the HomeKit peephole master's project, the `chai_sorse`
SwiftUI app). Do not read the `.venv` / `openai-env` trees.

## What to produce — `Sources/grad-precursor-survey.md`

For **each** of A–F, a section with:

1. **One-paragraph summary** — thesis, method, dataset, headline result with numbers.
2. **Relation to the framework** — concrete. Which specific mechanism, equation label,
   section, or Preface claim does it seed, support, or complicate? Quote the manuscript
   line you're attaching to. If it maps to nothing real, say so plainly.
3. **Verdict** — one of: `PREFACE-LINEAGE` (belongs in the Author's Preface narrative) /
   `CHAPTER-EVIDENCE` (cite in a specific chapter, give the label + the sentence it
   attaches to) / `BOTH` / `NEITHER` — with a one-line reason.
4. **If CHAPTER-EVIDENCE or BOTH:** a ready `@unpublished` BibTeX entry (source version,
   Emmanuel Theodore, course + WIT + year), and the exact `\cite` insertion point.
5. **Confidence / caveats** — sample size, synthetic-vs-real data, statistical
   significance, anything that makes it weak evidence. Be a hard grader; the manuscript
   holds claims to explicit confidence tiers.

Then three cross-cutting sections:

6. **The v1 vs v2 *Calculus of Injustice* problem.** The Preface leans on the v1 framing
   ("racial groups separated in discriminant space" — a clean geometric result). v2 (file B)
   appears to walk that exact claim back (LDA 56.5% vs 51.5% baseline; "incident-only data
   cannot identify bias in the decision to use force"). **Does v2 undercut the Preface
   sentence?** Options: (a) Preface is fine as ordinal/structural, (b) soften the Preface
   wording, (c) cite v2's per-capita 2.56× ratio instead as the "shadow". Recommend one,
   with the redraft if (b) or (c). This is the single most important output.

7. **Does the arc become 3 → 4 → 5 papers?** The Preface currently runs proposal → empirical
   → book. Files D, E, F are candidate extra beats (Markov dynamics; LLM ideological bias;
   LLM hiring bias = the "automatic bias-detection capability" the proposal named but never
   built). Propose the revised arc if warranted, with draft Preface sentences (affirmative
   declarative, matching the existing Preface voice — read it first).

8. **Chronology + numbering.** Work out the actual order of: *From Bias to Bytes*, the
   Markov exercise, the LDA exercise, *Calculus of Injustice* v1, *Calculus of Injustice*
   v2, the ClassicalAI GPT-bias final, the NLP hiring project, using `\date`, course codes
   (COMP numbers), file mtimes (`ls -la`), and any internal "prior work" citations. State
   what you could and couldn't pin down. Note: *From Bias to Bytes* itself is **not** in the
   Grad tree as far as the orchestrator found — flag if you find it.

Keep the whole file under ~500 lines. Cite file paths and, for manuscript claims, line
numbers. Where you're guessing, mark it `[uncertain]`.
