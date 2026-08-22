# TASK W4 — The equation catalog is blind to 26 `\input` files

Two parts. Part 1 fixes a data gap that makes 26 story equations look unmatchable
when they are not. Part 2 extends symbol coverage using the result.

## Part 1 — rebuild the catalog with `\input` expansion

`equation_explorer/build_data.py` reads `Paper/The_Original_Power.tex` and emits
`equation_explorer/data/equations.json` (239 equations). **It never expands
`\input{}`.** The manuscript pulls in **26 `\input` files**, and measured:

```
main .tex             2,241,603 chars
with \input expanded  2,820,305 chars
```

So the catalog is built from roughly 79% of the book. Entire appendices are
invisible to it — `eq:tt.1-transform` and `eq:tt.2-invariance` from
`Paper/apx_theodore_transform.tex` are absent, for example.

This is why 26 story-mode equations show `enrichment: "none"`. They are **not
missing from the manuscript**. Probing the expanded text for the exact symbols
those equations use:

| story equation | hits in main .tex | hits when expanded |
|---|---:|---:|
| apxH `P_{\text{abs}}` | 0 | 2 |
| ch13 `\beta_{\text{bio}}` | 0 | 4 |
| ch11 `\psi_s^{\text{Aryan}}` | 0 | 1 |
| ch12 `C_{\text{shadow}}` | 1 | 28 |
| ch17 `\Phi_{\text{s2p}}` | 0 | 3 |
| ch17 `H_{\text{cascade}}` | 0 | 2 |

**What to do:**

1. Teach `build_data.py` to expand `\input{...}` recursively before extraction,
   resolving paths relative to `Paper/`, tolerating a missing `.tex` extension,
   and guarding against cycles and unbounded recursion. Skip an unresolvable
   include rather than crashing, and **list every skipped include in the report**.
2. Record provenance per equation: which file it actually came from and its line
   number **within that file**, not the offset in the expanded stream. A reader
   must be able to open the right file at the right line.
3. Re-run the builder. Report the new equation count against the current 239, and
   how many are newly visible.
4. Re-run `website/scripts/w2_story_equation_join.py` against the rebuilt
   catalog. Report the new full / partial / none split against the current
   46 / 31 / 26.

**Do not** hand-match any equation, and do not loosen the join's normalisation
beyond what it already does. If an equation still does not match after the
catalog is complete, it stays `none` and gets listed. Some of these will be
genuine web-only adaptations, and that is a legitimate result.

**Watch for new collisions.** The join already downgrades 2 entries whose
normalised LaTeX matches multiple registry ids. A larger catalog will likely
produce more. Every collision must be surfaced and downgraded out of `full`, not
silently resolved by file order — a wrong tier is worse than no tier.

## Part 2 — extend symbol coverage

`website/src/content/equations/symbols.ts` currently glosses 52 of 77 enriched
story visuals. With the catalog rebuilt, more visuals become enriched.

Extend the registry to cover the highest-frequency symbols across the newly
enriched set. Order the work by how often a symbol actually appears — the top
tokens across the manuscript are `\psi`, `\tau`, `O_{\text{racialized}}`,
`I_{\text{buffer}}`, `E`, `\mathcal{E}`, `F_{\text{enforce}}`, `S`, `\Phi`,
`\rho`, `\mathcal{L}`, `W`, `\mathcal{A}`, `P_{\text{lead}}`.

**Every gloss must be sourced.** Take `name`, `meaning`, and `units` from the
manuscript's own prose around the symbol's definition, or from
`systemic_arbitrage/variables.yaml`, which already carries exactly these fields
for `T`, `V_E`, `tau`, `O_x`, `P_real`, `M_eff`. Record where each gloss came
from in the findings.

**An unsourced symbol stays ungloassed.** It renders plainly — no chip, no
colour, no invented meaning. Partial coverage is the expected outcome and is
fine. Report the coverage you reached and name the symbols you deliberately left
alone and why.

## Hard constraints

- Do NOT run any `git` command.
- Do NOT edit `Paper/` — it is manuscript source and the authority here.
- Do NOT edit `website/src/content/chapters/*.ts`; the join is keyed to their
  current contents.
- Do NOT edit `systemic_arbitrage/` or `videolab/`.
- Do NOT change any `latex` value or any `verbatim.source` in `cards.ts`.
- Do NOT invent an equation, a tier, a falsification condition, or a symbol
  meaning. Everything traces to a file in this repo or it does not appear.
- TypeScript strict mode. No `any`.

## Verify

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json && npm run build && npm run test
python3 website/scripts/w2_story_equation_join.py   # twice — byte-identical
```

All clean, the verbatim checker still passing, and the catalog builder itself
deterministic across two runs.

A dev server is running at `http://localhost:5199`. Drive a headless browser
against `/story/ch13` and `/story/ch17` — both currently render only plain
equations — and confirm newly enriched ones now show their provenance.

> React commits re-renders **asynchronously**. Let a tick elapse between a click
> and reading the DOM. Verifying synchronously already produced one confident,
> entirely false bug report on this project.

If you cannot start a browser, say so plainly rather than implying you verified.

## Report

`website/docs/W4-findings.md`: the new equation count and what became visible,
the new join split, any skipped includes, any new collisions, the symbol coverage
reached with each gloss's source, and which equations remain unmatched with your
assessment of why.
