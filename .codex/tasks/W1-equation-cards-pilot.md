# TASK W1 — Equation cards pilot: eight equations, both decoder modes

Build a new `/equations` route in `website/` presenting framework equations as
self-contained cards with colour-linked symbols, a term glossary, and a
**plain-English decoder that toggles between adapted prose and verbatim
manuscript text**.

This is a **pilot on eight equations**, not all 239. The point is to settle the
data model and the interaction cheaply enough to throw away.

## Reference pattern

The layout being adapted (from a patent-explainer site) stacks, per equation:

1. Header — title, category tag, provenance badge
2. The equation, with each symbol colour-coded
3. `TERMS:` — a chip per symbol, colour-matched, selectable
4. **Plain English Decoder** — the equation as a sentence, with phrases
   highlighted in the matching colours
5. A detail panel for the selected term — symbol, name, description, units
6. A context box — background and significance

Selecting a term chip highlights that symbol in the equation, its phrase in the
decoder, and opens its detail panel. The colour is consistent across all three.

## The eight equations

Seven carry full registry data; the eighth deliberately does not.

| # | label | tier |
|---|---|---|
| 1 | `eq:12.5-haitian-theorem-nonkinetic` | 1 |
| 2 | `eq:6.12-capacity-compounding-full` | 1 |
| 3 | `eq:8.16-interference-control-objective` | 1 |
| 4 | `eq:8.17-circular-dispersion-operator` | 2 |
| 5 | `eq:6.8-capacity-chain-1619` | 2 |
| 6 | `eq:1.1-enclosure-score` | 3 |
| 7 | `eq:7.1-pullman-corollary` | 3 |
| 8 | `eq:2.2b-complex-wage-def` | **none — no registry record** |

**#8 is not a mistake.** The Complex Wage is one of the book's signature
equations and has no empirical-validation record, so no tier, falsification, or
sources. The card must degrade gracefully: omit those fields entirely rather than
rendering "unknown", "N/A", or an empty badge. Nothing may imply a tier it does
not have.

## Data sources

- **`equation_explorer/data/equations.json`** — `{chapters, equations}`; each
  equation has `id`, `label`, `latex`, `chapter`, `chapterIndex`, `section`, `line`.
  **`latex` is authoritative. Never retype an equation.**
- **`Paper/empirical_validations/eq_*.md`** — YAML frontmatter carrying `tier`,
  `type`, `status`, `data_sources` (objects with `name`, `type`, `url`),
  `falsification`, `target_events`, `case_study_line`, `notebook`.
  Join on `label`.
- **`Paper/The_Original_Power.tex`** — the manuscript, for verbatim text.
- **`systemic_arbitrage/variables.yaml`** — already carries `name`,
  `framework_meaning`, `units`, `tier` for `T`, `V_E`, `tau`, `O_x`, `P_real`,
  `M_eff`. **Reuse this schema for the symbol registry** rather than inventing one.

## What to produce

### 1. `website/src/content/equations/symbols.ts`

A registry of every symbol appearing in the eight equations. Per symbol:
`id`, `latex`, `name`, `plainPhrase` (the wording the decoder uses), `meaning`,
optional `units`, optional `sourceNote`.

Colours are assigned **per card at render time** from a fixed accessible palette,
not stored per symbol — the same symbol may appear in several cards and the
palette must stay legible in both light and dark themes.

### 2. `website/src/content/equations/cards.ts`

One entry per equation: the joined registry data, the ordered symbol list, and
both decoder variants.

**`decoder.adapted`** — your prose, obeying `AGENTS.md`: direct affirmative
declarative statements, no formulaic antithesis, no "It is not merely X, it is
Y". Mark which spans correspond to which symbol so the decoder can highlight
them.

**`decoder.verbatim`** — manuscript text that already glosses the equation,
taken from `Paper/The_Original_Power.tex` near the equation's `line`.

> **The verbatim text must be a byte-exact substring of the `.tex` source**, with
> LaTeX markup stripped only at render time. Do not paraphrase, do not stitch
> together non-contiguous sentences, do not "clean up" wording. Write a check
> script that reads each `verbatim.source` back out of the `.tex` and asserts the
> stored raw string appears there exactly; run it and report the result. If no
> suitable contiguous passage exists for an equation, set `verbatim: null` and
> have the toggle disable itself for that card. **A missing passage is a correct
> outcome; an invented one is not.**

Record `verbatim.sourceLine` so a reader can find it in the PDF.

### 3. `website/src/components/EquationCards.tsx` + route

New `/equations` route in `App.tsx`, following the existing route patterns.
Reuse existing components and CSS vocabulary rather than inventing a parallel
system — look at `SystemicArbitrageDashboard.tsx` for the card/badge/metric
idiom and `story/visuals/Equation.tsx` for KaTeX usage.

**KaTeX:** colour-coding needs `\htmlClass{}{}` / `\htmlData{}{}`, which require
`trust: true` and `strict: false` in the render options. The current call sites
pass neither, so those macros are silently dropped today. Do not enable `trust`
globally for arbitrary input — scope it to this component, whose LaTeX comes from
the repo.

**Decoder toggle:** a clearly labelled two-way control, `Adapted | Manuscript`.
Default to **Adapted**. Persist the choice in `localStorage`. When a card has no
verbatim passage, the control is disabled with a short reason rather than hidden.

**Provenance:** show `tier` as a badge and `falsification` in the context box.
The falsification condition is the most valuable field here — it is the book's
own epistemic anchor and has no analogue in the reference design. Give it real
visual weight. Render `data_sources` as numbered citation chips linking out via
their `url`.

**No live values.** The reference design shows a live simulator readout. Do not
add one. Most of these equations have no calibrated live measurement, and a
number beside an equation implies calibration the framework has not claimed.

### 4. Accessibility

Colour must not be the only channel linking a symbol to its phrase — pair it
with the selected/hover state and an `aria` relationship. Verify contrast in both
themes.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT edit `Paper/`, `systemic_arbitrage/`, `videolab/`, or
  `equation_explorer/`. They are read-only inputs.
- Do NOT invent an equation, a tier, a falsification condition, a data source, or
  a manuscript passage. Everything traces to a file in this repo or it does not
  appear.
- Do NOT modify the eight `latex` strings.
- TypeScript strict mode. No `any`.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build && npm run test
```

All clean. Plus your verbatim-substring check script, run and reported.

## Report

`website/docs/W1-findings.md`: the symbol registry schema, which equations had a
usable verbatim passage and which did not, how the adapted and verbatim modes
differ in practice, how card #8 degrades, and any place where the eight
equations' data was thinner than this brief assumed.
