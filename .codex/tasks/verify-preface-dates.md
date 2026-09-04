# Task: independently verify four dated claims added to the Author's Preface

You are the INDEPENDENT VERIFIER under `AGENTS.md` → "Factual Claims — Verification
Protocol". Rule 4: the verifier is never the researcher. Another agent produced these
dates. Your job is to check them against the actual artifacts and to **DISAGREE** if
they do not hold. Disagreement is a valued outcome, not a failure.

Rule 1: a claim is verified only when you have OPENED THE ACTUAL ARTIFACT and can name
it and the command you used. Model recall and plausibility are not evidence.

## Claims to check

Each `.docx` is a ZIP. Its authoritative creation date is `dcterms:created` inside
`docProps/core.xml`. **Filesystem mtimes are worthless here** — the OneDrive folder is a
2026 backup copy, so every file's mtime is the backup date, not the authoring date.

```bash
unzip -p "<file>.docx" docProps/core.xml
unzip -p "<file>.docx" word/document.xml | sed 's/<[^>]*>/ /g' | tr -s ' ' | head -c 2000
```

1. **`Paper/The_Original_Power.tex`** now says the Spanish-American War essay is
   "dated 30 January 2020".
   Artifact: `OneDrive_2_8-8-2026/spanish Amarican war report.docx`

2. It now says a document titled *The definition of racism should be changed… no
   seriously* was written **11 May 2023**, was **revised through February 2024**, and
   already argues that racism begins when race begins and that race was constructed to
   leverage In-group / Out-group sorting.
   Artifact: `OneDrive_2_8-8-2026/The definition of racism should be changed… no seriously.docx`
   Check the date, the last-modified date, AND that the body actually contains those
   two arguments. Quote the sentences you find, or report that they are absent.

3. It now says that by February 2024 this had become *Redefining Racism: A Mathematical
   and Historical Approach*, "whose abstract already names set theory, discrete
   mathematics, and historical analysis".
   Artifact: `OneDrive_2_8-8-2026/Redefining Racism A Mathematical and Historical Approach.docx`
   Confirm the created date and read the actual abstract. Do all three terms appear?

4. It now says the *From Bias to Bytes* proposal was "drafted 6 October 2023".
   Artifact: `/Users/emmanuel/Documents/From Bias to Bytes.docx`
   Confirm the created date, and confirm the document's own title line matches the title
   the Preface gives it: *From Bias to Bytes: A Machine Learning-Driven Analysis of
   Systemic Racism and Social Inequalities*.

## Also check

5. The Preface's surrounding prose still describes *From Bias to Bytes* as the first
   document of the formal program. Given claim 2, the redefinition work predates it by
   about five months. Read the whole Author's Preface (`Paper/The_Original_Power.tex`,
   the `\chapter*{Author's Preface}` section) and report whether the newly inserted
   paragraph creates any contradiction with what was already there. Quote anything that
   now reads as inconsistent.

6. Confirm the inserted LaTeX is well-formed: balanced braces, `\textit{}` closed,
   `\ref{ch:redefining}` is a label that exists somewhere in the manuscript.

## Rules

- **Run no `git` command.** Do not commit, stage, or revert anything.
- **Change no file.** You are reading and reporting only. If you believe an edit is
  needed, describe it; do not make it.
- Do not consult the web. These are private documents; the artifacts on disk are the
  only evidence.

## Output

Write `.codex/tasks/verify-preface-dates.findings.md` with one section per claim,
each carrying: VERIFIED / DISAGREE / CANNOT VERIFY, the exact command you ran, the raw
value you read, and a one-line judgement. End with an overall verdict and any
contradiction found under item 5.
