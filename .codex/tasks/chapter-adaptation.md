# TASK — Adapt one manuscript chapter into an interactive web chapter

You are writing **one** TypeScript content module for the interactive website
that renders the book *The Original Power* chapter by chapter. Another agent is
working on a different chapter in this same working tree at the same time.

Your dispatch message names your chapter id (e.g. `ch03`). Everything else is here.

## Read first, in this order

1. `website/src/content/types.ts` — the content schema. **Fixed contract. Never modify.**
2. `website/src/content/chapters/ch00_system_initialization.ts` — **the reference
   implementation.** Match its structure, granularity, comment header, and voice.
3. `website/src/content/manifest.ts` — find your chapter's entry. It gives you the
   exact `id`, `slug`, `number`, `title`, `era`, `hook`, `accentColor` to use, and
   the `sourceFile` naming your source slice.
4. `AGENTS.md` — the project rules. The rhetorical constraint is binding on every
   sentence you write.

## Your source material

Under `Paper/chapters_src/` (gitignored, generated), for your `sourceFile` stem:

- `<stem>.txt` — the chapter as plaintext. Markers in the text tell you what the
  manuscript structure was:
  - `[[EQ:n]]` — a display equation was here; equation `n` is in the inventory.
  - `[[RUNTIMELOG: <title>]] … [[/END]]` — a RUNTIME LOG diagnostic box.
  - `[[KEYINSIGHT]] … [[/END]]`, `[[HISTORICALSOURCE]] … [[/END]]`,
    `[[DEFINITION]] / [[THEOREM]] / [[CONJECTURE]] / [[PROOF]] … [[/END]]`.
  - `## `, `### `, `#### ` — section headings.
- `<stem>.inventory.json` — structured extraction: `sections`, `equations`
  (with verbatim `latex` and `label`), `runtime_logs`, `definitions`,
  `key_insights`, `historical_sources`, `theorems`, `citations`, `figures`.
- `<stem>.tex` — the raw LaTeX slice. Consult it whenever the plaintext is
  ambiguous or looks mangled; the extractor is imperfect and some LaTeX leaks
  through. **The .tex is the authority.**

## What you produce

Exactly one new file: `website/src/content/chapters/<id>_<slug_with_underscores>.ts`
(e.g. `ch03_version_1_0.ts`), with a `const` typed as `ChapterContent` and a
default export. Open it with a comment header naming the source slice, exactly as
`ch00_system_initialization.ts` does.

**Do not modify `website/src/content/chapters/index.ts`** — the orchestrator wires
your module into the registry. Do not create or modify any other file.

## Content rules

**Fidelity.** Every claim, date, number, name, and citation must come from your
source slice. Invent nothing. If the manuscript does not say it, it does not go on
the page. Where you compress, compress by selection, never by extrapolation.

**Voice (AGENTS.md, non-negotiable).** Direct, affirmative declarative statements.
Zero formulaic antithesis. Never write "It is not merely X, it is Y", "More than
just X", "This isn't about X — it's about Y", or any corrective-contrast
construction. Do not manufacture transitions. State what is.

**The word "power" (AGENTS.md, standing rule).** Read the "The Word 'Power'"
section of AGENTS.md before writing. Short version: English *power* runs back
through Latin *potis* to PIE \*poti-, "lord, master" — the capacity sense is
derived from the mastery sense, not the reverse. Where your chapter's argument
turns on what power *is*, you may let that inheritance show. Constraints: at most
once or twice per chapter and most chapters not at all; resonance comes from the
etymology being load-bearing, never from ornamental language; and never write
"power literally means domination", which is false — write the derivation. Verbatim
`deepDive` passages are never edited to satisfy this.

**Shape.** 6–12 scenes. Each scene is one idea: a `title`, 2–4 adapted paragraphs,
optionally one visual, optionally key concepts, optionally one deep dive. Target a
12–20 minute read. The full text lives in the PDF; your job is the spine plus the
machinery, not a reproduction.

**Adapted prose vs. verbatim.** `prose` and `blocks[].paragraphs` are *adapted for
screen*: shorter sentences, LaTeX symbols spelled out in words where they read
badly, no cross-references to sections or figures the website does not have
(the extractor renders those as `(ref)` — drop the sentence or rewrite it without
the reference). `deepDive.passages[].paragraphs` are *verbatim manuscript text*
with LaTeX markup stripped and nothing else changed.

**Blocks.** Map the manuscript's own structures onto the block kinds:
- `[[RUNTIMELOG]]` → `{ kind: 'runtimeLog' }`. Split the box into `lines` of
  `{ field, value }` — the source writes them as `Field: value` pairs
  (System Stress, Capital, Interference State, Variables Deployed, Policy Result…).
  Strip the parenthetical math from the field name and keep it in the value if it
  carries meaning. **Every chapter that has a RUNTIME LOG must render it** — it is
  the signature element of the book.
- `[[KEYINSIGHT]]` → `{ kind: 'insight' }` (its first line is usually the heading).
- `[[HISTORICALSOURCE]]` → `{ kind: 'source' }`.
- `[[DEFINITION]]`/`[[THEOREM]]`/`[[CONJECTURE]]`/`[[PROOF]]` → `{ kind: 'formal' }`
  with the matching `variant`.
- A single load-bearing sentence → `{ kind: 'pullquote' }`. At most one per chapter.

**Equations.** Copy `latex` verbatim from the inventory. In a TypeScript string
every backslash doubles: `\vec{F}` becomes `'\\vec{F}'`. Use the `label` field for
the equation number (e.g. `'eq. 2.1'`), not the raw `eq:` key. Only include
equations that carry the argument; a chapter needs 2–5, not all of them.

**Visuals.** At most one per scene. The available `kind` values are fixed by
`VisualSpec` in `types.ts` — read it and use only those. `equation`, `tierLadder`,
`timeline`, `venn`, `series`, `insight`-adjacent visuals, the self-contained
`expansion` / `compounding` / `phasor` / `interference` / `extractionChart`, and
`manim` (only these files exist: ComplexWage, DrivenHarmonicOscillator,
InterferenceIntensity, MaxwellEquations, PhaseKick, SnellsLaw, UnifiedLorentzForce
— at `/animations/<Name>.mp4`). For `timeline` and `series`, every data point must
come from your source. **Do not invent data to fill a chart.** If the chapter has
no quantitative series in the source, use no chart. Never add a new `kind`.

## Hard constraints

- Do NOT run any `git` command. Do not commit, branch, stage, or stash.
- Do NOT run `npm run build` or `npm run dev` — other agents share this tree.
- Do NOT modify any file other than the single new chapter module you create.
- Do NOT edit `Paper/` — it is manuscript source.
- TypeScript strict mode. No `any`. Curly quotes in prose (`’`, `“`, `”`) are fine
  and preferred; make sure they are valid inside the string literal you choose.

## Verify before finishing

```bash
cd website && npx tsc --noEmit -p tsconfig.app.json
```

This typechecks the whole project, so you may see errors in *other* chapter
modules that other agents are still writing. Ignore those. **Zero errors in your
own file** is the bar. Re-run until your file is clean.

Then report: the file you created, its scene count, which block kinds and visuals
you used, and the typecheck result.
