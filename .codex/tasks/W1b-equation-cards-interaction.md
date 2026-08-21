# TASK W1b — The equation cards render correctly and respond to nothing

Follow-up to `.codex/tasks/W1-equation-cards-pilot.md`, merged in the working
tree. **The data layer is correct and verified — do not redo it.** The
interaction layer does not work.

## What is already right (do not regress)

Verified independently, not from the report:

- All eight verbatim passages are **byte-exact contiguous substrings** of
  `Paper/The_Original_Power.tex`, checked with a script written separately from
  yours, including the recorded `sourceLine` values. No fabrication.
- All eight `latex` strings match `equations.json`.
- Colour-coding works: `\htmlClass` renders, producing
  `equation-symbol equation-symbol-color-N` inside the KaTeX output, matched by
  `term-chip`, `decoder-symbol`, and `equation-term-detail` with the same index.
  The visual language is right.
- Card 8 (Complex Wage) degrades correctly: no tier badge, no falsification, no
  sources, no placeholders.
- `tier-1` badges, `citation-chip` links, and the falsification block all render.
- The adapted prose reads correctly and obeys AGENTS.md.

## The defect

**Clicking does nothing.** Measured on a freshly restarted dev server and a fresh
page load of `/equations`, on the first card:

```
initial        decoder-copy   "For each non-kinetic reform, the measured change i…"
-> Manuscript  decoder-copy   "For each non-kinetic reform, the measured change i…"   (unchanged)
-> Adapted     decoder-copy   "For each non-kinetic reform, the measured change i…"   (unchanged)

term chip 3 clicked:
  before  term-chip equation-symbol-color-0 is-selected
  after   term-chip equation-symbol-color-0 is-selected                              (unchanged)
```

Two independent controls, same failure. Also reproduced with a **real browser
click** (not a synthetic `.click()`), so it is not an event-dispatch artifact of
the test.

Additional evidence: `localStorage` key `uef-equation-decoder-mode` is written
once with `"adapted"` and never updated by either button.

So the component renders its initial state correctly and never commits an
update. Symptoms point at one root cause covering both controls — for example
state derived once and read from a constant at render time rather than from the
state the handlers set, handlers bound to a value that never feeds the render, or
selection held somewhere the rendering subtree does not subscribe to.

**Diagnose it rather than patching each control.** Two unrelated controls failing
identically is one bug.

## Why the test suite missed it

`npm run test` passes and `tsc` is clean. The existing tests cover data shape,
not interaction. Add tests that **click and assert the resulting render**:

- clicking `Manuscript` renders the verbatim passage; clicking `Adapted` renders
  the adapted prose; the mode round-trips both ways
- the chosen mode persists to `localStorage` and is restored on remount
- clicking term chip *n* moves `is-selected` to the chip, its symbol inside the
  equation, its decoder phrase, and the detail panel — all to
  `equation-symbol-color-n`
- a card whose `verbatim` is `null` disables the toggle rather than hiding it

A test asserting "the button exists" is what let this through.

## One more thing to check

The dev server logged, during an earlier hot reload:

```
TypeError: String.raw(...) is not a function
  at /src/content/equations/cards.ts:279:574
[vite] Failed to reload /src/App.tsx
```

The current file has no `${` sequences and line 279 is shorter than that column,
so this looks like a stale module from an intermediate edit rather than a live
defect. **Confirm that** — load `cards.ts` from a cold start and verify it
evaluates cleanly. If a passage ever needs a literal backtick or `${`,
`String.raw` will not save you; the verbatim strings come from LaTeX and this
will recur as the pilot expands beyond eight equations. Say in the findings how
you have guarded against it.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT change any of the eight `latex` strings or any `verbatim.source` value.
  They are verified byte-exact; altering one silently breaks provenance.
- Do NOT edit `Paper/`, `systemic_arbitrage/`, `videolab/`, or `equation_explorer/`.
- Do NOT restyle the cards. The visual design is settled; this is a behaviour fix.
- TypeScript strict mode. No `any`.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build && npm run test
```

Clean, plus the new interaction tests, plus the verbatim checker still passing.

State plainly whether you exercised the running page in a browser. If you could
not, say so — the previous round reported green tests on a component whose
controls did nothing.

## Report

Append to `website/docs/W1-findings.md`: the single root cause, why it affected
both controls, and what the new tests assert.
