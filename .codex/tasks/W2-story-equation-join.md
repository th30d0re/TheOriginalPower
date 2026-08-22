# TASK W2 — Join story-mode equations to the equation registry

Deterministic data task. Write **one script**, run it, emit **one JSON file** and
**one report**. No React, no styling, no component work.

## The problem

`website/src/content/chapters/*.ts` contains **102 equation visuals** across 27
chapters, shaped like:

```ts
{ kind: 'equation', latex: '...', label: 'eq. 19.1', caption: '...' }
```

The `label` is a **display string** ("eq. 19.1", "The Vector Equation of
Racism"), not a registry key. So the join must be on **LaTeX content**.

Measured already, and your script must reproduce these numbers or explain the
difference:

| | count |
|---|---:|
| equation visuals parsed | 102 |
| exact registry match (normalised LaTeX) | 66 |
| of those, with an empirical-validation record | 40 |
| tier 1 / tier 2 / tier 3 | 10 / 7 / 23 |
| matched, no record | 26 |
| unmatched | 36 |

Normalisation that produced them: unescape doubled backslashes, strip all
whitespace, drop `\label{...}` and `\tag{...}`.

## Inputs (all read-only)

- `website/src/content/chapters/*.ts` — the story modules
- `equation_explorer/data/equations.json` — `{chapters, equations}`, each with
  `id`, `label`, `latex`, `chapter`, `chapterIndex`, `section`, `line`
- `Paper/empirical_validations/eq_*.md` — YAML frontmatter with `tier`, `type`,
  `data_sources` (objects with `name`, `type`, `url`), `falsification`,
  `target_events`, `case_study_line`, `notebook`. Join on its `label`.

## Output 1 — `website/src/content/equations/story-join.json`

One entry per story equation visual, in a stable order (chapter file, then
position in file). Each entry carries:

- `chapterFile`, `chapterId`, `occurrence` (0-based index within the file)
- `storyLabel`, `storyCaption`, `latex` (**verbatim, exactly as it appears in
  the module — do not normalise the stored value**)
- `registry`: `{ id, label, chapter, section, line }` or `null`
- `validation`: `{ tier, type, falsification, dataSources, targetEvents,
  caseStudyLine, notebook }` or `null`
- `enrichment`: one of `"full"` (registry + validation), `"partial"` (registry
  only), `"none"` (no registry match)

The consumer must be able to locate the exact visual to upgrade from
`chapterFile` + `occurrence` without re-parsing the module.

## Output 2 — `website/docs/W2-story-equation-join.md`

- The counts table your script produced.
- **Every one of the 36 unmatched equations listed individually**, with its
  chapter file, story label, and LaTeX. This list is the most useful part of the
  report: some will be near-misses that normalisation should have caught, some
  will be web-only adaptations with no manuscript equivalent, and some may
  indicate a registry gap. Where you can tell which, say so. Where you cannot,
  say that instead of guessing.
- The 26 matched-but-unvalidated equations listed by registry label, since they
  mark equations the book displays but has not tiered.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT modify `website/src/content/chapters/*.ts`, `Paper/`,
  `equation_explorer/`, `systemic_arbitrage/`, or `videolab/`. Every input is
  read-only. This task **reads and reports**; a later task edits.
- Do NOT invent a match. If normalisation does not produce an exact hit, the
  entry is `"none"` and goes in the unmatched list. Fuzzy or "close enough"
  matching is forbidden — a wrong join would attach the wrong tier and
  falsification condition to an equation, which is worse than no join.
- The script must be **deterministic and re-runnable**: running it twice
  produces byte-identical output.

## Verify

Run the script twice and confirm the JSON is byte-identical. Report the counts
you got. If they differ from the table above, do not adjust your script to force
a match — report the difference and your explanation.

## Report

The markdown file is the report. Keep it factual.
