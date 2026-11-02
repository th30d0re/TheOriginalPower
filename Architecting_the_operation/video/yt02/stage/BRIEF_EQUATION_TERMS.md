# Brief: colour-coded equation terms that pulse on the spoken word (Eq. 2.8a and the Eq. 2.5 chain)

Read first:
- `BACKLOG.md`: the author's note.
- `BRIEF_MIN3_7_BUILD.md`: Rules, Checkpoint and The standard. Those rules hold here except where
  this brief widens the file list.
- `BRIEF_MIN3_7_FIX_CD.md`: the safe-area and no-collision rules, enforced by `tools/layout_audit.ts`.

## Goal

Equations should teach. Each symbol keeps one colour everywhere it appears. When the narration
names a symbol's meaning, the symbol pulses, wherever it is on screen. The terms come in first, each
with its meaning, and then the equation assembles from them. Narration timing is fixed, so build
pacing from the existing turn time and the turn-34 hold.

## Colour source (reuse the website)

- **Website code.** `website/src/components/EquationCards.tsx` colours symbols with `colorizeLatex`,
  using palette slots `equation-symbol-color-0…13`. The hex values for the dark theme are in
  `website/src/components/EquationCards.css` lines 425–438. Copy those 14 hex values into
  `stage/equations/palette.ts`, with a comment naming that source.
- **No website card exists for either equation.** Fix each symbol's slot in a Stage registry,
  `stage/equations/terms.ts`, so that a future website card can import the same slots:

| term id | shows as | meaning (manuscript, Paper/The_Original_Power.tex 2130) | slot |
|---|---|---|---|
| `X` | X | raw sensory input | 0 |
| `T` | T | threat/status interpretation | 2 |
| `PiRace` | Π_{race} (via `MathText`) | the installed racial prior | 1 |
| `i` | subscript i | the individual | 9 |
| `IndividualPrejudice` | Individual Prejudice | Eq. 2.5, term 1 | 13 |
| `DiscriminatoryActions` | Discriminatory Actions | Eq. 2.5, term 2 | 5 |
| `SystemicOutcomes` | Systemic Outcomes | Eq. 2.5, term 3 | 4 |

- **Uncoloured parts.** P, ∝, the bars, the parentheses and the arrows stay in the scene's normal
  text colour.

## Equations, verbatim from the manuscript

- **Eq. 2.8a** (`eq:1.5b-bayesian-prior`, line 2132). Printed number from
  `Paper/The_Original_Power.aux`.
  `P_i(T | X, Π_race) ∝ P(X | T) · P_i(T | Π_race)`
- **Eq. 2.5** (`eq:1.3-conventional-causal-arrow`, line 1806).
  `Individual Prejudice → Discriminatory Actions → Systemic Outcomes`

## Build

1. **`stage/equations/`** (new; you own it):
   - `palette.ts`, `terms.ts`.
   - `EquationTerms.tsx`: renders an equation from a token list (a symbol id or plain text) and
     takes a `pulses` map (`term id → cue ms[]`).
   - `TermChip.tsx`: a symbol and its meaning, for a legend row.
   - **Pulse:** over 600 ms from the cue, scale 1 → 1.12 → 1 and a glow in the term's own colour,
     peaking at about 200 ms. Use `cubicInOut`. It is a pure function of stage ms.
   - Determinism rules as always: no state, effects or refs, no DOM or KaTeX measurement, and
     `MathText` for subscripts. Every coloured term carries `data-term="<id>"` and a `data-text`
     box for the layout audit.
2. **`InstalledRacialPrior` (turns 33–34).**
   - **Turn 33:** introduce the terms as the narration names them, each with its chip:
     - "installed racial prior Pi-sub-race" → `PiRace`;
     - "Stereotypes … Bayesian priors" → the prior factor `P_i(T | Π_race)` (pulse its `T`, `i` and
       `PiRace` together);
     - "sensory evidence" → `X`;
     - "institutions … high weight" → `PiRace` again, linked to the precision gauge.
   - **`T` and `i`:** they are never spoken, so they come in with their chips at the factor that
     first contains them.
   - **Equation:** assemble it in the equation band from the coloured terms. Keep the existing
     sweep, plot and gauge behaviour exactly as it is.
   - **Turn 34:** the equation strip keeps the same colours.
   - **Plot curves:** where a curve stands for a factor, its label takes that factor's symbol
     colours. The curve strokes may keep their current colours.
3. **The Eq. 2.5 chain.**
   - **`SequenceAsTheory`, turns 11–12:** colour the three causal nodes with the registry slots.
     Pulse:
     - `IndividualPrejudice` on "personal hostility" and on "root cause";
     - `SystemicOutcomes` on "institutional patterns".
   - **`HeartsAudit`:** colour the formal statement "Individual Prejudice → Discriminatory Actions →
     Systemic Outcomes" by term. Pulse each term on its spoken word, if the narration of that turn
     names it.
   - **`DictionaryEntry`, turn 1:** the author has already approved this scene. Change only colour
     and pulse, and leave all geometry alone. Pulse "individual prejudice" (`IndividualPrejudice`)
     and "institutional pattern" (`SystemicOutcomes`) on their spoken words.
4. **Cues.** Read the word lists from `outputs/YT02v2_ov/word_timings.json`, keyed by turn id from
   `episode_manifest.json`. Where a cue you need is missing, add it to `stage_ov.yaml`:
   - turn-prefixed and unique, for example `t33Sensory`;
   - `at: start`;
   - additions only: change no existing cue and no shot.

   Then recompile the plan with the command in `BRIEF_MIN3_7_BUILD.md`. The diff of
   `ov/stage_plan.json` may add cue entries only.

## Files you may write

- `stage/equations/*` (new).
- `min3_7/d/InstalledRacialPrior.tsx`, `min3_7/d/sceneUtils.tsx`.
- `min3_7/a/SequenceAsTheory.tsx`, `min3_7/a/HeartsAudit.tsx`, `min3_7/a/PackageAVisuals.tsx`.
- `firstminute/DictionaryEntry.tsx`, with colour and pulse only.
- `stage_ov.yaml` (cue additions only) and `ov/stage_plan.json` (recompiled).
- `tools/check_equations.{tsx,mjs}` (new), plus the existing checks for scenes you touch. Only
  extend those checks; never weaken an assert.
- `FINDINGS_EQUATIONS.md` (new).

`min3_7/shared/`, `dashboard/`, `index.ts` and the engine stay read-only. Do not change git state.
Do not render.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The checkpoint hash is on the prompt's first line. The dirty paths `.claude/launch.json`,
`yt02/logs/…` and `tmp/` belong to the author. Leave them alone, and do not treat them as blocking.

## Done means

All of these pass:
- Episode tsc.
- **`check_equations`**, which asserts:
  - two-process determinism;
  - every `data-term` element uses its registry colour in every scene;
  - each pulse peaks within one frame of cue + 200 ms and sits at rest more than 600 ms from any of
    its cues;
  - every Eq. 2.8a and Eq. 2.5 string is verbatim, with the subscripts through `MathText`.
- `check_first_minute`, `check_roadmap_boot`, `check_minute_two`, `check_dashboard`,
  `check_min3_7_shared`, `check_min3_7_a`, `check_min3_7_b`, `check_min3_7_c` and `check_min3_7_d`,
  with the layout audit clean in every touched scene.
- The plan compile, adding cues only. List the added cues in the findings.
- `tools/check_antithesis.py` on every file you write.

Write `FINDINGS_EQUATIONS.md` with:
- the registry;
- the term → cue map for each scene;
- any narration word that has no on-screen term;
- each check's tail.
