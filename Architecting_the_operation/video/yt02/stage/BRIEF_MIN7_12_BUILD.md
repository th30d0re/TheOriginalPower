# Brief: build minutes seven to twelve (turns 35–62): foundation, then one package per run

The spec is `STORYBOARD_MIN7_12.md`; build it faithfully. The orchestrator has already done the
integration:
- `stage_ov.yaml` has shots `S00-35` … `S00-62`.
- `ov/stage_plan.json` is compiled, with 37 segments and every cue resolved.
- The 14 stub scenes are registered in `index.ts` under `min7_12/{e,f,g,h}/`.
- `min7_12/shared/index.ts` exists, empty.

Each run does **one stage**, named on the prompt's first line: `STAGE: FOUNDATION`, or
`STAGE: PACKAGE E`, `F`, `G` or `H`.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The orchestrator commits a clean checkpoint before every run, and its hash is on the prompt's
first lines. The dirty paths `.claude/launch.json`, `yt02/logs/…` and `tmp/` belong to the author,
or are another run's files. Leave them alone and do not treat them as blocking. The orchestrator
commits your result after review.

## Rules

- **Working directory:** `/Users/emmanuel/Documents/Theory/TheOriginalPower`. All paths below are
  under `Architecting_the_operation/video/yt02/stage/`.
- **Files you may write:**
  - **FOUNDATION** writes only:
    - `min7_12/shared/*`;
    - additions to `equations/terms.ts` for the storyboard's new symbols (L, R, C, q, V), each with
      a free palette slot. Never change an existing entry;
    - `tools/check_min7_12_shared.{tsx,mjs}`;
    - `FINDINGS_MIN7_12.md` §Foundation.
  - **PACKAGE X** writes only:
    - `min7_12/<x>/*`, replacing that package's stubs in place and keeping their export names;
    - `tools/check_min7_12_<x>.{tsx,mjs}`;
    - its own `## Package X` section of `FINDINGS_MIN7_12.md`.

    A package imports from `min7_12/shared/`, `min3_7/shared/` and `equations/`, and edits none
    of them. If a shared API is missing something, write that in the findings and work around it
    locally.
- **Read-only:** `index.ts`, `stage_ov.yaml`, `ov/stage_plan.json`, `firstminute/`, `minutetwo/`,
  `min3_7/`, `dashboard/`, `tools/layout_audit.ts`, and the engine at
  `/Users/emmanuel/Documents/Theory/scriptCast-stage/`.
- **Git and safety:**
  - no git commands that change state;
  - no `rm -rf`;
  - do not read `.env` or secrets;
  - no Chromium and no renders, which the orchestrator does;
  - never touch `outputs/YT02v2_ov/video/runs/`.
- **Findings:** write `FINDINGS_MIN7_12.md` early, and append to it as you go.

## The standard

The house style is the one in `min3_7/`. Read one finished scene per package before you start,
such as `min3_7/b/APAGroupDefinitions.tsx` and `min3_7/d/InstalledRacialPrior.tsx`, and their
checks.

- **Determinism:**
  - Every frame is a pure function of stage ms and the plan.
  - Use only `useCue`, `useStageMs` and `usePlan`, plus `useNotch` through `SceneBorder` or
    `StageSceneFrame`.
  - No React state, effects, refs or DOM measurement; no randomness and no `Date`. Pseudo-random
    layout comes from a seeded generator written in code.
- **Layout (enforced from the start):**
  - The safe area is x 60–1860, y 70–1010, kept clear of the notch zones: x 880–1040 within 90 px of
    the top and bottom edges.
  - No text box overlaps another text box, and no line or shape crosses a text box. A leader may
    touch a label's edge.
  - A picture that a beat replaces is fully absent (opacity 0) or in its own region.
  - Mark every text element and every major shape with `data-text` / `data-shape` and its box,
    for `tools/layout_audit.ts`.
  - Size the boxes from real glyph advances. IBM Plex Mono is 0.6 em per glyph; for IBM Plex Sans,
    leave room for wrapping.
- **Visuals:**
  - 1920 × 1080; dashboard tokens through `color()`; IBM Plex.
  - Body text at least 28 px, labels at least 20 px.
  - `MathText` for every subscript; no literal `_` on screen.
  - People are drawn only with `PersonMark` (head and shoulders).
  - Equations use `equations/EquationTerms`, `ColoredTerm` and `TermChip`, so each symbol keeps
    its registry colour and pulses on its spoken word.
  - Equation and figure numbers are the printed ones from `Paper/The_Original_Power.aux`:
    Eq. 2.11 and Eq. 2.12, Figure 2.6.
- **Beats:**
  - Every beat lands on its storyboard cue with a 300–700 ms entrance.
  - A scene that spans several turns stays one continuous picture.
  - Each scene reads as complete at its last frame.
- **Strings:**
  - Use the storyboard's on-screen strings verbatim.
  - Use direct declarative statements, with no antithesis. Run `tools/check_antithesis.py` (repo
    root) on every file you write.
  - The storyboard's §6 sourcing limits hold: no maternal-mortality numbers, and only the
    narration's IAT details.
- **No interaction hints** in the rendered path.

## STAGE: FOUNDATION

- Build the new shared components in storyboard §3 under `min7_12/shared/`, with their props:
  `EvidenceToken`, `SignalLane`, `QuestionHeader`, `TermTriad` and `GroupDirectionField`. Export
  them from `min7_12/shared/index.ts`.
- Extend `equations/terms.ts` with the storyboard's registry additions.
- Write `tools/check_min7_12_shared.{tsx,mjs}`, modelled on `tools/check_min3_7_shared.*`. Render
  each component in two or three states and assert:
  - two-process determinism;
  - the hook policy;
  - no literal underscores;
  - a clean layout audit.
- In `FINDINGS_MIN7_12.md` §Foundation, write each component's props contract. The package runs
  build against that text.

## STAGE: PACKAGE X

Replace the package's stubs with the scenes from the storyboard. Build every beat, string, layout
box and sweep it specifies.

Write `tools/check_min7_12_<x>.{tsx,mjs}`, modelled on `tools/check_min3_7_c.*`, which passes each
scene its real plan segment. Render at:
- the segment start;
- each cue + 700 ms;
- a 500 ms grid;
- the segment end − 1 frame.

Assert:
- two-process determinism;
- the hook, underscore and interaction-hint policies;
- every storyboard string present from its beat and absent before it;
- a clean layout audit (safe area, notch zones, collisions) at every sampled frame;
- for any equation, registry colours and pulses at cue + 200 ms.

## Done means (every stage)

All of these pass:
- **Episode tsc:**
  `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`
- **Your new check**, run with `node <path>/tools/check_….mjs`.
- **Every existing check, unchanged:**
  - `check_first_minute`, `check_roadmap_boot`, `check_minute_two` and `check_dashboard`;
  - `check_min3_7_shared` and `check_min3_7_a` through `check_min3_7_d`;
  - `check_equations`.
- **`check_antithesis.py`** on your files.

Append each check's tail to your findings section.
