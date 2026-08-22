# TASK W3 — Upgrade story-mode equations to the card treatment

Three parts, in order. Part 1 improves the join, Part 2 builds the component,
Part 3 verifies it yourself in a browser.

Read `website/docs/W2-story-equation-join.md` and
`.codex/tasks/W1-equation-cards-pilot.md` first. The `/equations` pilot in
`website/src/components/EquationCards.tsx` is the reference implementation and is
already committed and working.

## Part 1 — raise the match rate, and stop hiding collisions

`website/scripts/w2_story_equation_join.py` produced: 103 story equation visuals,
67 exact registry matches, 41 with a validation record, 36 unmatched.

**Two defects to fix, then re-run it.**

**1a. Escaped newlines defeat the normalisation.** Seven of the 36 unmatched are
near-misses where the registry holds the same equation number and the LaTeX
differs only by escape handling. From the report:

```
story    ...\begin{aligned}>>>\n&\text{Exploitation}\ri...
registry ...\begin{aligned}>>>&\text{Exploitation}\righ...

story    ...}x\inE_{\text{imperial}}\>>>\[4pt]\text{Abstain}...
registry ...}x\inE_{\text{imperial}}\>>>[4pt]\text{Abstain}...
```

Normalisation strips whitespace via `\s+`, which does not match the two-character
escape sequence `\` + `n` as it appears in the module source, nor the `\\[4pt]`
line-break form. Extend it to handle both, re-run, and report the new counts.
**Do not loosen matching beyond escape handling** — no fuzzy or
similarity-threshold matching. An equation either matches exactly after
normalisation or it stays unmatched.

**1b. Registry collisions are silently resolved.** The report notes 11 pairs
whose normalised LaTeX collides — `E217` vs `E114`, `E218` vs `E115`, `E213` vs
`E118`, and others — and says "the first entry in `equations.json` order was
kept." That is a silent wrong-answer path: a story equation matching a colliding
form can be handed the wrong registry label, and therefore the wrong tier and the
wrong falsification condition.

Add a `collision` field to any entry whose normalised LaTeX matches more than one
registry id, listing all candidate ids. **An entry with an unresolved collision
must not be treated as `full`** — downgrade it and surface it in the report. A
missing tier is recoverable; a wrong one is not.

## Part 2 — the story equation card

Story mode is a **reading flow**, not a reference page. The full `/equations`
card — chips, decoder toggle, term detail, context box — is too heavy to drop
inline mid-scene. Build a **compact presentation that expands on demand**:
collapsed, it shows the equation with its symbols colour-coded and its tier
badge; expanded, it reveals the term glossary, the decoder, and the provenance.

Reuse `EquationCards.tsx`'s primitives — `colorizeLatex`, the palette, the term
detail, the source chips. **Extract what is shared rather than copying it.** Two
divergent colour-assignment implementations would be a bug waiting to happen.

Three states, driven by `enrichment` in `story-join.json`:

- **`full`** — tier badge, falsification, sources, symbols, decoder toggle
  (adapted / manuscript), term detail
- **`partial`** — symbols and term detail; **no tier badge, no falsification,
  no sources.** Render nothing rather than an empty section
- **`none`** — exactly the current plain rendering, untouched

Wire it through `SceneVisual.tsx`'s handling of `{ kind: 'equation' }`, matching
on `chapterFile` + `occurrence`. Do not change the `VisualSpec` type or edit any
`website/src/content/chapters/*.ts` module — the join is keyed to their current
contents and editing them invalidates it.

**Symbols.** `symbols.ts` covers only the eight pilot equations. Extend it to the
highest-frequency tokens across the newly matched set. **An unknown symbol must
render plainly — no chip, no colour, no placeholder gloss.** Do not invent a
meaning for a symbol you cannot source from the manuscript or
`systemic_arbitrage/variables.yaml`. Partial symbol coverage is expected and
fine; a fabricated definition is not.

Nothing regresses: `/equations` keeps working exactly as it does now.

## Part 3 — verify it in a browser yourself

**A dev server is already running at `http://localhost:5199`** — use it. Do not
start your own; a previous loop failed with `EPERM` trying to bind a Vite
listener. Network access is enabled for this task.

Drive a headless browser against `/story/<chapterId>` for chapters covering all
three enrichment states, and confirm: a `full` equation shows its tier and
falsification, a `partial` one shows no provenance block at all, a `none` one is
visually unchanged, expand/collapse works, and the decoder toggles both ways.

> **The trap that already cost this project a wasted loop.** React commits
> re-renders **asynchronously**. Clicking a control and reading the DOM in the
> same synchronous script returns the *pre-render* DOM, so a working feature
> looks completely dead. Verifying this way produced a confident, entirely false
> bug report against a correct component. **Always let a tick elapse between the
> click and the read** — `await new Promise(r => setTimeout(r, 0))`, a
> `MutationObserver`, or `waitFor` from `@testing-library`. If a control appears
> inert, re-check your measurement before concluding the code is broken.

Also add interaction tests in the `website/tests/*.test.tsx` vitest style that
click and assert the resulting render, covering all three states.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT edit `website/src/content/chapters/*.ts`, `Paper/`,
  `equation_explorer/`, `systemic_arbitrage/`, or `videolab/`.
- Do NOT change any `latex` value or any `verbatim.source` in `cards.ts`; they
  are verified byte-exact against the manuscript.
- Do NOT use fuzzy matching anywhere in the join.
- TypeScript strict mode. No `any`.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build && npm run test
```

Clean, plus your new tests, plus the verbatim checker still passing, plus the
join script still deterministic across two runs.

## Report

`website/docs/W3-findings.md`: the new match counts after the normalisation fix,
which collisions you surfaced and how they are handled, the symbol coverage you
reached and what you deliberately left ungloassed, and **exactly what you
exercised in the browser** — routes, states, and interactions. If you could not
verify something, say so plainly rather than implying you did.
