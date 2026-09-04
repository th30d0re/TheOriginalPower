# Findings: independent verification of four dated Author's Preface claims

Verifier: Codex (`gpt-5.6-sol`), dispatched 2026-09-04 under `AGENTS.md` →
"Factual Claims — Verification Protocol", Rule 4 (the verifier is never the
researcher). The researcher was Claude, in the same session.

Codex could not write this file itself: `.codex/tasks` was read-only in its sandbox.
Its verdict is transcribed here verbatim from its terminal output, unedited.

## Verdict by claim

| # | Claim | Verdict |
|---|---|---|
| 1 | Spanish-American War essay dated 30 January 2020 | **VERIFIED** |
| 2 | *The definition of racism should be changed… no seriously*, 11 May 2023, revised through Feb 2024, argues racism begins when race begins and that race was constructed to leverage In-group / Out-group sorting | **VERIFIED** |
| 3 | Became *Redefining Racism: A Mathematical and Historical Approach* by Feb 2024; abstract names set theory, discrete mathematics, historical analysis | **VERIFIED** |
| 4a | *From Bias to Bytes* drafted 6 October 2023 | **VERIFIED** (`2023-10-06T23:58:00Z`) |
| 4b | Title matches the Preface | **DISAGREE** |
| 5 | No chronological contradiction introduced in the Author's Preface | **VERIFIED** (none found) |
| 6 | Inserted LaTeX well-formed; `\label{ch:redefining}` exists | **VERIFIED** (label at line 1355) |

**Overall verdict: DISAGREE**, on claim 4b alone.

## The disagreement

The artifact's own title line reads *A Machine Learning-**d**riven Analysis of Systemic
Racism and Social Inequalities*. The manuscript writes *Machine Learning-**D**riven*.

This is a capitalisation difference of one letter, not a factual error, and it long
predates this session: the manuscript has carried title-case for this title since the
Preface was written, at a time when the source document could not be consulted because
no copy was known to exist.

**Left unchanged, pending Emmanuel's decision.** Two defensible positions:

1. **Keep title case.** The manuscript renders every document title in title case, and
   normalising capitalisation inside a cited title is ordinary editorial practice.
2. **Match the artifact.** The source is now in hand and quotable, and the Preface
   presents these as the documents' own titles.

Position 1 is the status quo and requires no edit. Position 2 is a one-character change
at `Paper/The_Original_Power.tex`, in the sentence beginning "The first document in that
program was a short proposal".

## What was opened, and how

Per Rule 1, verification required artifact contact. Each `.docx` is a ZIP; the
authoritative authoring date is `dcterms:created` in `docProps/core.xml`. Filesystem
mtimes are worthless for both folders, which are copies whose mtimes are the copy date.

```bash
unzip -p "<file>.docx" docProps/core.xml
unzip -p "<file>.docx" word/document.xml | sed 's/<[^>]*>/ /g' | tr -s ' '
```

Artifacts opened:

- `OneDrive_2_8-8-2026/spanish Amarican war report.docx`
- `OneDrive_2_8-8-2026/The definition of racism should be changed… no seriously.docx`
- `OneDrive_2_8-8-2026/Redefining Racism A Mathematical and Historical Approach.docx`
- `/Users/emmanuel/Documents/From Bias to Bytes.docx`
- `Paper/The_Original_Power.tex`
