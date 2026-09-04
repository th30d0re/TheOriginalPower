# Task — Preface: name both titles of the first precursor

## DO NOT COMMIT / BUILD / TOUCH GIT. Edit only `Paper/The_Original_Power.tex`.

Append notes to `Sources/preface-both-titles_FINDINGS.md`.

## What

The Author's Preface (`\chapter*{Author's Preface}`, ≈ line 149) names the first precursor
as *From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism and Social
Inequalities*. The archived source file
`/Users/emmanuel/Documents/Theory/TheOriginalPower/OneDrive_2_8-8-2026/A Mathematical Model
for Analyzing Systems of Oppression with a Focus on Systemic Racism.docx` carries the
internal title *The Calculus of Discrimination: A Mathematical Model for Analyzing Systemic
Racism and Social Policies* (author: Emmanuel Theodore; structure: Project Statement /
Objective / Methodology / Expected Outcomes — a proposal). Same document, two titles.

Emmanuel wants **both** titles named.

## The edit

Current first sentence of that paragraph:

> The first document in that program was a short paper titled \textit{From Bias to Bytes: A
> Machine Learning-Driven Analysis of Systemic Racism and Social Inequalities}.

Rewrite it to name both titles in one affirmative sentence. Draft (adjust to Preface voice;
no "not X but Y"):

> The first document in that program was a short proposal that carried two titles across its
> drafts, \textit{From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism
> and Social Inequalities} and \textit{The Calculus of Discrimination: A Mathematical Model
> for Analyzing Systemic Racism and Social Policies}.

The rest of the paragraph (which begins "Its central bet was that systemic racism could be
formalized") stays exactly as is; check that "Its" still reads correctly with the new
opening sentence — it should, the antecedent is the proposal.

Every later reference in the Preface to "\textit{From Bias to Bytes}" (there are several —
grep for them) stays unchanged; that short form is fine once both titles are introduced.

## Verify

Open the .docx (use `textutil -convert txt -stdout "<path>"` or the docx skill) and confirm
the exact internal title string before you paste it. Report the exact title line you read
in the findings file.

## Findings file

- The exact title string read from the .docx, and where in the file it appears.
- Before/after of the sentence.
- Confirmation the following sentence still parses and later short-form references are untouched.
- No git/make/build run.
