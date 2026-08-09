# L1 Holdout — Structural Triage

**Read this before labelling, not while labelling.** The 100 rows in
`holdout_l1_unlabelled.jsonl` are deliberately unannotated. Nothing here is
written into that file, and the labelling pass must stay blind: a row marked
"known defect" that gets labelled `FALSE` without being read produces a
precision number that measures this triage rather than the validator.

## What the structural audit already establishes

Two defect classes were identified in `docs/L1-findings.md` by source-level
inspection, before any model call. Their incidence in the holdout sample:

| Class | Rows |
|---|---:|
| Label collapse — target is `E071` or `E104`, or a multi-source `interference_spike` contract | 9 |
| `calibrates` edge whose source record declares `existing_case_study: false` | 15 |
| Both | 0 |
| **No known structural defect** | **76** |

**Label collapse.** `E071` carries 8 edges and `E104` carries 10, because
`eq:6.9`–`eq:6.11` and `eq:9.6`–`eq:9.9` resolve onto a neighbouring equation by
LaTeX containment. The graph erases the distinction between an equation and the
sub-equations printed inside it. Whether that makes a given edge false depends on
whether the sub-equation is genuinely part of the containing one — which is a
judgment call about the manuscript, not a mechanical test. Read these.

**Missing case study.** A `calibrates` edge asserts that a case study calibrates
an equation. Thirty-four of the 145 `calibrates` sources set
`existing_case_study: false` in their own frontmatter. A populated
`case_study_line` does not override the explicit Boolean.

## How to read the number you get

If every structurally defective row turns out to be `FALSE`, observed precision
cannot exceed **0.76** regardless of how well the validator performs. Treat 0.76
as the ceiling this sample can express, and interpret the exit criterion against
it. A precision near 0.76 means the validator is finding exactly the defects the
audit predicted; materially below means it is failing on rows with no known
problem, which is the result worth investigating.

## Reproducing this table

The triage is derived from `data/graph/framework_kg.json` and the frontmatter of
each row's `provenance` file. Graph edges key their relation as `type`; holdout
rows key it as `relation` — reading `relation` on a graph edge silently yields
`None` and makes every target look collapsed.
