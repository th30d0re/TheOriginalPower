# Task — Ch. 21: promote the Law & Tan workforce-decline finding into the prose

## DO NOT COMMIT / BUILD / TOUCH GIT

- No `git`, `make`, `latexmk`. Orchestrator runs build + commit.
- Edit only `Paper/The_Original_Power.tex`. Append to `Sources/ch21-workforce-decline_FINDINGS.md`.
- Leave `.mcp.json`, `debate/`, everything else alone.

## Context

Commit `6c587ee` added the paragraph `\paragraph{The measured surface.}` to Chapter 21
("Porting the Legacy Code"). Its Law & Tan sentence currently reads:

> Law and Tan found that firms exposed to Black Lives Matter protest pressure added Black
> directors while non-Black minority representation declined; the accompanying executive and
> workforce estimates yielded no firm-wide diversity gain, a pattern they term ``diversity
> tokenism'' \cite{law_tan_diversity_tokenism}.

Your own verification memo `Sources/ch21-diversity-commodification_FINDINGS.md` (row on the
"no firm-wide diversity gain" claim) recorded that Table 3, panels B–C, printed pp. 337–338
of the version-of-record PDF shows: a marginal increase in Black-executive presence, a
significant decline in non-Black-minority executive representation, **no significant increase
in the percentage of Black executives**, **a significant decline in Black workforce
representation**, and no significant change in non-Black-minority workforce representation.

Emmanuel wants the Black-workforce decline stated directly rather than folded into "no
firm-wide diversity gain."

## Verify first

Re-open the Law & Tan version-of-record PDF (`10.1111/1475-679X.70019`; the HK PolyU
repository copy `https://ira.lib.polyu.edu.hk/bitstream/10397/117562/1/Law_Diversity_Tokenism.pdf`
is the one you used). Confirm, from Table 3 (panels B and C) and the surrounding text, the
**direction and statistical significance** of:

1. Black director / board representation change (should be a rise).
2. Non-Black minority board representation change (should be a decline).
3. Black executive representation change (should be not significant / marginal).
4. Black general-workforce representation change (should be a significant decline).

If any of these does not hold as stated, STOP and report it in the findings file. Do not
write a claim you cannot confirm against the table.

## The edit

Replace the Law & Tan sentence with a version that states the workforce decline directly.
Draft (adjust to the paragraph's voice; affirmative declaratives; no "not X but Y"):

> Law and Tan found that firms exposed to Black Lives Matter protest pressure raised Black
> board representation while non-Black minority board representation fell, Black executive
> representation held flat, and Black representation in the general workforce declined; they
> term this ``diversity tokenism'' \cite{law_tan_diversity_tokenism}.

Keep the rest of the paragraph unchanged. The following sentence ("The measured count
improves while the disadvantage moves across groups or organizational levels") still needs
to read correctly after the swap — confirm it does; lightly adjust only if the antecedent
breaks.

## Findings file — `Sources/ch21-workforce-decline_FINDINGS.md`

- The four-way verification: each claim, the table/panel/page, direction, significance,
  match or not.
- Exact before/after of the sentence.
- One-line confirmation the following sentence still parses.
- Rhetorical self-check.
- Confirm no git/make/build run.
