# Preface Both Titles — Findings

## Source verification

Opened `OneDrive_2_8-8-2026/A Mathematical Model for Analyzing Systems of Oppression with a Focus on Systemic Racism.docx` with `textutil -convert txt -stdout`.

The exact internal title string is:

> The Calculus of Discrimination: A Mathematical Model for Analyzing Systemic Racism and Social Policies

It appears on the second extracted text line, immediately after `A Mathematical Model for Analyzing Systems of Oppression with a Focus on Systemic Racism` and immediately before the author line, `Emmanuel Theodore`.

An independent verifier opened the same DOCX with `textutil -convert txt -stdout`, inspected the edited TeX passage, and returned **AGREE** on the title transcription and the scope of the edit.

## Sentence edit

Before:

> The first document in that program was a short paper titled `\textit{From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism and Social Inequalities}`.

After:

> The first document in that program was a short proposal that carried two titles across its drafts, `\textit{From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism and Social Inequalities}` and `\textit{The Calculus of Discrimination: A Mathematical Model for Analyzing Systemic Racism and Social Policies}`.

## Continuity and scope checks

- The following sentence remains unchanged: `Its central bet was that systemic racism could be formalized: ...`
- `Its` still parses correctly because its antecedent is `a short proposal` in the revised opening sentence.
- The rest of the paragraph remains unchanged.
- The three later Preface references to `\textit{From Bias to Bytes}` remain unchanged at TeX lines 151, 155, and 157.
- No Git, Make, or build command was run.
