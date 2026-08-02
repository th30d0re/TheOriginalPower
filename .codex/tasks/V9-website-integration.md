# TASK V9 — Bring videolab into the Original Power website with concept-driven widgets

You are working in the worktree on branch `agent/codex-V2`, reset to current `main`.
Read `videolab/CONTRACT.md` first, **including the new §12** on concept ids and LaTeX.

## Why

Job analyses currently live in JSON and a standalone HTML file. The website at
`website/` already holds a library of framework visualisations, and an analysis that
invokes the psychological wage should be able to show the phasor that explains it.

## What already exists — reuse, do not rebuild

| Asset | Use |
|---|---|
| `website/src/story/visuals/Equation.tsx` | KaTeX rendering with graceful fallback. Already correct. |
| `website/src/components/visualizations/PhasorResonance.tsx` | The $W = \psi_m + j\psi_s$ phasor with quadrant legend, already labelling the fascist inversion. |
| `InterferenceEngine3D`, `ExtractionChart`, `OutgroupExpansion`, `CompoundingMetrics`, `VennDiagram`, `Timeline` | Existing widgets to map concepts onto. |
| `website/src/story/visuals/TierLadder.tsx` | Tier classification display. |
| `katex` | Already a dependency. Do not add another math library. |

The site is React + TypeScript + Vite and builds clean with `npm run build`.

## 1. Data bridge

Add `videolab site export --out website/public/videolab/` producing:

- `jobs.json` — an array of job summaries plus full analysis payloads.
- `frames/<slug>/frame_XXXX.jpg` — frames copied and downscaled to 640px wide.

Gitignore `website/public/videolab/` — it carries media, which never enters git.
Private jobs are excluded unless `--include-private` is passed, matching `site build`.

## 2. Route and page

Add `/videolab` (index) and `/videolab/:slug` (detail) to `website/src/App.tsx`,
following the existing route style. The page loads `jobs.json` at runtime with
`fetch`. Match the visual language of the surrounding site rather than inventing a
new one — read `Dashboard.tsx` and the story pages first.

Detail layout mirrors the standalone viewer: header, stage strip, engagement,
transcript with `[MM:SS]` gutter, deduped OCR, frame gallery, analysis, tiers.
A missing engagement metric renders as `—`, never `0`.

## 3. LaTeX in analysis prose

Analysis strings contain math delimited by `$…$` (CONTRACT §12). Write a small
renderer that splits a string on those delimiters and passes the math spans to KaTeX
inline (`displayMode: false`), leaving prose as text. Reuse the parse/fallback
approach in `Equation.tsx`; on a KaTeX error show the raw LaTeX rather than breaking
the paragraph.

Every prose span must be inserted as text, never as HTML. The strings originate in
third-party media.

## 4. The concept registry — the point of this task

`framework_notes.concepts` is an array of stable ids (CONTRACT §12 lists the
vocabulary). Build `website/src/videolab/conceptRegistry.ts` mapping id → widget,
title, and a one-line explanation of what the widget shows.

Starting map; extend where an existing component fits:

| concept ids | widget |
|---|---|
| `complex_wage`, `phase_angle`, `fascism_threshold`, `squaring_property`, `conjugate_solidarity` | `PhasorResonance` |
| `interference_engine`, `orthogonal_deflection` | `InterferenceEngine3D` |
| `extraction_kernel` | `ExtractionChart` |
| `buffer_class` | `OutgroupExpansion` |
| `cyclotron_trap` | `PhasorResonance` |

An unmapped concept renders as a labelled chip with its description and no widget.
Never fail to render because a concept has no visual yet.

On the detail page, show the concepts this analysis declared as a row of chips, and
render the corresponding widgets beneath the analysis — each with a caption naming
the concept it illustrates. Deduplicate: two concepts mapping to the same widget
produce one instance carrying both captions.

**Load widgets with `React.lazy`.** The bundle already warns at 2.4 MB; pulling
three.js into the videolab route eagerly would make that materially worse.

## 5. Parameterise the phasor

`PhasorResonance` currently self-animates only. Add optional props — a fixed
`theta`, and a `caption` — while keeping the current animated behaviour as the
default when no `theta` is passed. Existing usages must not change behaviour. This
lets an analysis that establishes $\theta \to 90^{\circ}$ show the phasor held there
instead of spinning past it.

## Exit criteria

- `cd website && npm run build` succeeds with no new TypeScript errors.
- `PYTHONPATH=videolab/src /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m pytest videolab/tests/ -q` passes.
- A python test asserts `site export` writes `jobs.json` and per-slug frames, and
  excludes private jobs by default.
- Visiting `/videolab` lists jobs; `/videolab/instagram-DbaSgWUuwrx` shows its
  analysis, the nine declared concepts as chips, and at least the phasor widget.
- `$W + W^{*} = 2\psi_m$` inside an analysis string renders as math, not as literal
  dollar signs.
- Append a "Loop 9" section to `videolab/docs/V2-findings.md`.

## Constraints

Do not modify the pipeline modules beyond adding the `site export` subcommand. Do not
change existing website routes or components except the additive `PhasorResonance`
props. Do not add dependencies — everything needed is installed. Never write DM text,
usernames, or thread titles into findings, fixtures, or tests. Do not attempt
`git commit`.
