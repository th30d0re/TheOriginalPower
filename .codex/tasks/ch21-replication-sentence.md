# Task — Ch. 21: add the matched-pair replication result

## DO NOT COMMIT / BUILD / TOUCH GIT. Edit only `Paper/The_Original_Power.tex` and
`Paper/references.bib`. Append notes to `Sources/ch21-replication_FINDINGS.md`.

## Context

The `\paragraph{Generative-model instantiation.}` in Chapter 21 (`ch:algorithmic_epoch`,
section "Porting the Legacy Code", ~line 13082) currently cites the 2024 course project
(`theodore_hiring_bias`): GPT-4o selected White-marked résumés for 68.33% of mid-level roles
vs 53.33% at entry/executive; aggregate χ² null; caveat "résumé qualifications were not held
constant across all marker conditions."

That caveat has now been tested. A 2026 matched-pair replication is committed in this repo at
`experiments/cli_hiring_audit/` (see its `FINDINGS.md`). Design: each résumé exists in a
Black-marked and White-marked version identical except the candidate name (Bertrand &
Mullainathan 2004 first names) and one affiliation token; 15 batches per level; run through
three CLIs — Claude (Sonnet), Gemini 3.1 Pro, Kimi k3.

**Result (from `experiments/cli_hiring_audit/analysis/pooled/summary.json` — open it and
confirm every number you cite):**
- Pooled Black share of advanced candidates: LL 50.0%, ML 50.7% (χ² p = 0.83), EL 51.1%
  (χ² p = 0.79).
- Logistic `selected ~ race*level` interaction: `race_black:level_ML` β = +0.044 (p = 0.88),
  `race_black:level_EL` β = +0.072 (p = 0.83).
- Per-model: every model at every level 50–52%, no χ² p below 0.71.
- The 2024 mid-level dip (31.67% Black) does not appear.
- Secondary: Gemini declined the ranking task at a rate that rose with seniority
  (LL 20%, ML 27%, EL 47%); Claude and Kimi never declined.

## The edit — `Paper/The_Original_Power.tex`

Insert into the existing paragraph, after the sentence ending
"...possible explanations for the career-level skew." and before "\textbf{Confidence: Tier~3}".
Then revise the Tier-3 caveat clause so it no longer implies the confound is untested.

Draft (match the paragraph's voice; affirmative declaratives; no "not X but Y"):

> A 2026 replication held résumé qualifications constant across the racial conditions,
> varying only the candidate's name and one affiliation, and ran the three career levels
> through Claude, Gemini, and Kimi. The Black share of advanced candidates was 50 to 51
> percent at every level, and the career-level effect did not recur
> \cite{theodore_hiring_replication_2026}. The models reproduced the credential structure of
> the résumé pool rather than a name-level preference. Gemini declined the ranking at a rate
> that rose with the seniority of the role.

Revise the Tier-3 line's final clause from
`r\'esum\'e qualifications were not held constant across all marker conditions`
to something like
`the career-level skew in the 2024 study is not separable from résumé-credential
differences that co-varied with race, and a controlled replication returned parity`.
Keep `\textbf{Confidence: Tier~3}` and the rest of that sentence.

## The edit — `Paper/references.bib`

Add, matching the style of `spatial_confluence_forthcoming` / `theodore_missing_variable`
(check them):

```bibtex
@unpublished{theodore_hiring_replication_2026,
  author = {Theodore, Emmanuel},
  title  = {Matched-Pair Replication of {LLM} Hiring Selection Across Career Levels and Vendors},
  year   = {2026},
  note   = {Author experiment. Harness, data, and analysis at \texttt{experiments/cli\_hiring\_audit/} in the manuscript repository; matched-pair design, four models across three vendors, pooled Black selection share 50--51\% at every career level.},
}
```

Confirm the key/DOI-free entry does not collide with an existing key.

## Findings file

- Per-number verification against `analysis/pooled/summary.json` and the per-model
  `summary.json` files.
- Exact before/after of the paragraph and the Tier-3 clause.
- The bib entry.
- Rhetorical self-check.
- Confirm no git/make/build run.
