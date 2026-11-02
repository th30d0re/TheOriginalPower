# Brief: build minutes three to seven (turns 11–34) — foundation, then one package per run

The spec is `STORYBOARD_MIN3_7.md`; build it faithfully. The orchestrator has already done the
integration:
- `stage_ov.yaml` has shots `S00-11` … `S00-34`, and `ov/stage_plan.json` is compiled.
- Each scene has an `instance`, so a scene that spans several turns runs as one segment from its
  first shot's start to its last shot's end.
- Twelve stub scenes are registered in `index.ts` under `min3_7/{a,b,c,d}/`.

Each run of this brief does **one stage**, named on the first line of the prompt:
`STAGE: FOUNDATION`, or `STAGE: PACKAGE A`, `B`, `C` or `D`.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The orchestrator commits a clean checkpoint before every run. Its hash is given on the prompt's
first lines. Dirty paths outside your files are the author's own work or another run's:
`.claude/launch.json`, `yt02/logs/…` and `tmp/`. Leave them alone and do not treat them as
blocking. The orchestrator commits your result after review.

## Rules

- **Working directory:** `/Users/emmanuel/Documents/Theory/TheOriginalPower`.
- **Files you may write:**
  - FOUNDATION writes only `stage/min3_7/shared/*`, `stage/tools/check_min3_7_shared.*` and
    `stage/FINDINGS_MIN3_7.md`.
  - PACKAGE X writes only:
    - `stage/min3_7/<x>/*`, replacing that package's three stubs in place and keeping their export
      names;
    - `stage/tools/check_min3_7_<x>.*`;
    - its own `## Package X` section of `stage/FINDINGS_MIN3_7.md`.
  - A package may import `min3_7/shared/*` but must not edit it. If the shared API is missing
    something, write it in the findings and work around it locally.
- **Read-only:** `index.ts`, `stage_ov.yaml`, `ov/stage_plan.json`, `firstminute/`, `minutetwo/`,
  `dashboard/`, and the engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/`.
- **Git and safety:**
  - No git commands that change state.
  - No `rm -rf`.
  - Do not read `.env` or secrets.
  - No Chromium and no renders; the orchestrator renders.
  - Never touch `outputs/YT02v2_ov/video/runs/`.
- **Findings:** write `FINDINGS_MIN3_7.md` early and append to it as you go.

## The standard (same as minutes one and two)

Read `BRIEF_FIRST_MINUTE.md` "The contract" and `BRIEF_MINUTE_TWO.md`, then look at
`firstminute/` and `minutetwo/` for the house style.

- **Determinism:** every frame is a pure function of stage ms and the plan.
  - Use only the engine hooks `useCue`, `useStageMs`, `usePlan`, plus `useNotch` through
    `SceneBorder`.
  - No React state, effects, refs or DOM measurement.
  - No randomness and no `Date`.
  - Precompute at module level. Any pseudo-random layout, such as person marks, comes from a fixed
    seeded generator written in code.
- **Frame:** every scene renders `SceneBorder` with its `segment`. These scenes have no map, so
  the notch holds.
- **Visuals:**
  - Fixed 1920 × 1080 canvas.
  - Use the dashboard tokens through `color()` from `../../tokens`.
  - IBM Plex.
  - Body text at least 28 px, labels at least 20 px.
  - `MathText` (from `@stage`) for every subscript; no literal `_` on screen.
  - Write "Π" with the subscript "race" as `MathText` "Π_{race}".
- **Beats:** every beat lands on its storyboard cue with a 300–700 ms entrance.
  - A scene that spans several turns stays one continuous picture.
  - Each scene must read as complete at its last frame.
- **Strings:** the on-screen strings are the storyboard's, verbatim.
  - Equation numbers must be the printed ones: Eq. 2.5 and Eq. 2.8a. Look up any other number in
    `Paper/The_Original_Power.aux`, never from a `\label` name.
  - Use direct declarative statements, with no antithesis. Run `tools/check_antithesis.py` on
    every file you write.
- **No interaction hints** in the rendered path.

## STAGE: FOUNDATION

Build the shared components in the storyboard's §3 under `min3_7/shared/`, with the props the
storyboard lists:

- `StageSceneFrame`
- `SourceLine`
- `TermBlock`
- `DefinitionCard`
- `CitationCard`
- `UsThemSortingField`
- `PersonMark`
- `NeuralField`
- `PredictiveUpdatePlot`
- `PrecisionGauge`
- `TrainingTextStrip`

Requirements:

- **`PredictiveUpdatePlot`** draws the evidence likelihood, the prior and the posterior as
  Gaussians on one axis. The posterior is computed as the precision-weighted product, so the
  mean is `(μ_e τ_e + μ_p τ_p) / (τ_e + τ_p)` and the precision is `τ_e + τ_p`. Map the
  normalized `precision` α in [0, 1] to the prior's precision so that α = 0 gives a posterior
  mode at the evidence (within 2% of the axis) and α = 1 gives one near the prior (within 5%).
  Document the mapping.
- **`index.ts`:** export everything from `min3_7/shared/index.ts`.
- **`tools/check_min3_7_shared.{tsx,mjs}`:** render each component in two or three
  representative states to static markup, and assert:
  - two-process determinism;
  - the hook policy;
  - no literal underscores;
  - the PredictiveUpdatePlot posterior-mode bounds at α = 0, 0.5 and 1;
  - that the posterior mode moves monotonically as α rises.
- **Findings:** write the props contract of each component in `FINDINGS_MIN3_7.md` §Foundation.
  The package runs build against that text.

## STAGE: PACKAGE X

Replace the package's three stubs with the scenes from the storyboard's sections for those scenes.
Build every beat, string, layout box and equation sweep the storyboard specifies.

Write `tools/check_min3_7_<x>.{tsx,mjs}`. Model it on `check_minute_two`, passing each scene its
real plan segment. Render at:
- segment start;
- each cue + 700 ms;
- segment end − 1 frame.

Assert:
- two-process determinism;
- the hook policy;
- no literal underscores;
- no interaction hints;
- every storyboard string present from its beat and absent before it;
- any layout-overlap rules the storyboard states;
- that no text box overlaps another text box at any sampled frame, using layout constants.

## Done means (every stage)

All of these pass:
- Episode tsc:
  `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`.
- Your new check.
- `check_first_minute`, `check_roadmap_boot`, `check_minute_two` and `check_dashboard`,
  unchanged.
- The plan compile, byte-identical:
  `PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/stage_ov.yaml -o Architecting_the_operation/video/yt02/stage/ov/stage_plan.json`.
- `tools/check_antithesis.py` on your files.

Append each check's tail to your findings section.
