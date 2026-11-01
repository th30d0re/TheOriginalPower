# Brief: first-minute scenes, turns 0–3 and 5 (YT02v2_ov, 0:00–0:50.1 and 1:14.0–1:20.7)

The author approved the dashboard tray and moved to the next step: the first minute of the real
episode on Stage. Today these six turns show four static text cards. You build five of the six
scenes; Kimi builds turn 4 (`firstminute/RoadmapBoot.tsx`) at the same time from
`BRIEF_FIRST_MINUTE_T4.md`. Read `../STAGE_PLAN.md` ("First minute") for the storyboard. Where this
brief and the plan differ, this brief wins: it corrects the plan against the manuscript.

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The orchestrator committed the clean checkpoint for this task as `5942676`. It contains the stubs,
`stage_ov.yaml` and this brief. The remaining dirty paths are the author's own work, outside this
task's scope: `.claude/launch.json`, `yt02/logs/…` and `tmp/`. Leave them alone, and do not
treat them as blocking. They are not part of any file you edit. The orchestrator commits your
result after review. Skip the Obsidian session log; `FINDINGS_FIRST_MINUTE.md` is the session
record for this run.

## Rules

- Write only inside `Architecting_the_operation/video/yt02/stage/`. The engine at
  `/Users/emmanuel/Documents/Theory/scriptCast-stage/` is read-only.
- Your files: `firstminute/TitleOpen.tsx`, `DictionaryEntry.tsx`, `WhyLadder.tsx`,
  `LiteratureStack.tsx`, `Disclosure.tsx`, anything new under `firstminute/` (shared pieces,
  `firstminute/data/`), and `tools/check_first_minute.*`. Do not edit `firstminute/RoadmapBoot.tsx`,
  `dashboard/`, `Scenes.tsx`, `index.ts`, `stage_ov.yaml` or the review plans: Kimi and earlier
  passes own them. If you need a change there, write it in the findings instead.
- No git commands that change state. Run `git status` before and after; report anything you
  changed outside your files.
- No Chromium and no Remotion renders: the orchestrator renders and inspects. Plan compile and
  `render --dry-run` are fine.
- Never touch `outputs/YT02v2_ov/video/runs/`.

## The contract (already in place)

- `stage_ov.yaml` lists one shot per OV turn with its scene and named cues, resolved from
  `outputs/YT02v2_ov/word_timings.json`. Compiled plan: `ov/stage_plan.json` (0–81,190 ms with the
  OV audio). Read the cue names there; use `useCue('<name>')` (episode-absolute ms) from `@stage`.
  Do not hard-code times that a cue gives you; small fixed offsets after a cue are fine.
- Stub components for all six scenes are registered in `index.ts`. Replace your five stubs in
  place and keep each export name.
- **Deterministic frame path**, as in the dashboard: each frame is a pure function of stage ms and
  the plan. No `useState`/`useEffect`/`useLayoutEffect`/refs, no DOM measurement, no
  `Math.random`, no `Date`. Fixed pixel layout on the 1920 × 1080 canvas. Precompute anything
  heavy at module level.
- **Visual language:** the dashboard's own. Use `color('<token>')` from `../tokens` (field
  background `color/bg/field`, text `color/text/primary`/`soft`/`muted`, gold `color/fill/gold`,
  accent `color/text/accent`, red `color/marker/race` for the "fails"/"wrong" marks, panels
  `color/fill/panel-render` with `color/line/hairline`). Use `CompactBorder` from
  `../dashboard/CompactBorder` as the frame on every scene. Fonts: IBM Plex Sans and IBM Plex Mono
  (already loaded). Do not use the old `cards/LandscapeFrame.tsx`: it measures the DOM.
- **Text:** body text at least 28 px, labels at least 20 px, titles 64–96 px. Real subscripts via
  `MathText` (`ψ_m`, `ψ_s`); no literal `_` anywhere on screen. Every on-screen string is a direct
  declarative statement: no "not X but Y" or other corrective antithesis (AGENTS.md). Grep your
  strings before you finish.
- **Motion:** each beat lands on its cue, with an entrance of 300–700 ms (`cubicOut`, `progress`
  from `@stage`). Nothing moves between beats except slow drift where stated. Every scene reads as
  complete at its last frame, because the cut to the next turn is hard.
- **Site:** the same scenes run in the scroll site. Show no interaction hints.

## Scenes

Times below are seconds within the turn, for orientation; the cues carry the real values.

### Turn 0 · `TitleOpen` (0:00–0:13.5)

Narration: "I wrote The Original Power to answer one definitional question with archives,
equations, and tests. This episode is Episode one on the channel: what racism is, and why the
definition most of us were taught fails."

- `title` (0.5): the book title **The Original Power** sets in, large, centred high. Under it,
  smaller: "Emmanuel Theodore". (The narrator is credited as the book's author.)
- `archives` (3.5), `equations` (4.5), `tests` (5.4): three method tiles light one by one in a row
  under the title, each a glass panel with a drawn graphic and a one-word label:
  - **Archives:** a vector folio page with ruled lines, a wax seal and a dated header.
  - **Equations:** the complex wage `W = ψ_m + jψ_s` set in `MathText`, with a small phasor plane
    under it drawn to the axis convention used by the dashboard's Complex Wage Plane (ψ_s to the
    right; read `dashboard/ComplexWagePlane.tsx` and copy its orientation, do not invent one).
  - **Tests:** three short rows, each with a test mark: two pass ticks and one fail cross.
- `episode` (7.1): the three tiles fold up into a thin header strip under the title, and
  **Episode 1 · What Racism Is** lands as the main line.
- `definition` (10.4): a second line sets under it: "and why the definition most of us were taught
  fails".
- `fails` (12.2): a red marker underline draws under "the definition most of us were taught"
  (left to right, ~500 ms).

### Turn 1 · `DictionaryEntry` (0:13.5–0:26.9)

Narration: "The common definition is wrong. Here is why. Dictionary entries usually list individual
prejudice first and institutional pattern later. That order smuggles in a causal story before any
evidence appears."

The entry is the manuscript's own "typical definitional hierarchy"
(`Paper/The_Original_Power.tex` lines 1792–1799, §"Racism as Primary Example"). Use its wording; do
not quote any real dictionary.

- `common` (0.3): header "The common definition of racism".
- `wrong` (1.1): a red tag stamps beside the header: "wrong".
- `dictionary` (3.2): a dictionary-style entry builds in a panel: headword **rac·ism** *(noun)*, then
  sense **1** "Individual prejudice or discrimination based on race" and sense **2** "Belief in
  racial superiority".
- `individual` (5.1): sense 1 lights (gold rule at its left, text to full brightness).
- `institutional` (7.0): sense **3** fades in at the bottom, smaller and dimmer: "Systemic or
  institutional discrimination", with a small tag "if present at all".
- `order` (9.4): the sense numbers 1, 2, 3 lift out to the right of the panel.
- `causal` (10.5): they become an arrow chain, the conventional causal arrow of Eq. 1.3 (tex line
  ~1803): **Individual Prejudice → Discriminatory Actions → Systemic Outcomes**, labelled
  "causal story".
- `evidence` (11.9): an empty dashed slot appears beside the chain, labelled "evidence", and stays
  empty.
- Source line, bottom left, 20 px: "The Original Power, §Racism as Primary Example · Eq. 1.3".

Export the entry and the chain as a component with props for its state, because turn 2 reuses it.

### Turn 2 · `WhyLadder` (0:26.9–0:40.5)

Narration: "This episode asks why at every step. Why does the dictionary order matter? Why separate
bias from racism? Why did Virginia write racial law when solidarity threatened planters? Why does
reform produce backlash?"

- Shot start: open on turn 1's final state (entry, chain, empty evidence slot) at full size, and
  shrink it into thumbnail slot 1 by about 1.5 s. This makes the cut from turn 1 continuous.
- `header` (0.9): header "Why, at every step".
- `why1`–`why4` (2.4, 4.3, 6.6, 10.6): four rows land one by one. Each row is the spoken question
  verbatim, with a live thumbnail (about 320 × 180) to its left:
  1. "Why does the dictionary order matter?" with the shrunken entry from turn 1.
  2. "Why separate bias from racism?" with two separated boxes: **bias**, "a tendency in
     judgment" and **racism**, "psycho-legal social software". Both phrases come from the
     manuscript, line 243.
  3. "Why did Virginia write racial law when solidarity threatened planters?" with a map
     thumbnail of the Chesapeake. Draw coastlines only, from the same land data and Equal Earth
     projection that `dashboard/DashboardMap.tsx` uses, with no modern borders. Label it
     "Virginia · 1676". Start a slow deterministic zoom in on `why3` and settle by `virginia` +
     2 s.
  4. "Why does reform produce backlash?" with `BacklashOscillatorView` from
     `dashboard/artifacts/` in compact mode, labelled "reform → backlash". Read its props and
     `CONTRACT.md`.
- When a row lands, earlier rows dim slightly. The current row stays brightest.

### Turn 3 · `LiteratureStack` (0:40.5–0:50.1)

Narration: "We will walk established social science first: bias, prejudice, discrimination, and the
tripartite model. We will mark where that literature stops."

Content is from manuscript line 243. Keep its wording short and keep the citations.

- `established` (0.5): header "Established social science".
- `bias` (2.2), `prejudice` (3.1), `discrimination` (3.6): three blocks stack in the upper part of
  the frame, each with a one-line definition and a citation:
  - **Bias**: "a tendency to favor or disfavor people because of group membership". Greenwald &
    Banaji 1995.
  - **Prejudice**: "antipathy toward a group, grounded in a rigid, erroneous generalization".
    Allport 1954, p. 9.
  - **Discrimination**: "behavior that treats people differently because of group membership".
- `tripartite` (5.3): a bracket groups a row of three components under the stack, the book's
  three-part distinction: **thinking: stereotype**, **feeling: prejudice**, **behavior:
  discrimination**. Thin connectors run from "prejudice" and "discrimination" up to their blocks.
  Label: "Tripartite model · Fiske 1998". (The plan mapped bias to cognition. The manuscript
  pairs thinking with stereotype, so follow the manuscript.)
- `stops` (8.3): a gold boundary line draws across the lower third, labelled at its left end
  "where the literature stops". The region below it stays dark and empty.

### Turn 5 · `Disclosure` (1:14.0–1:20.7)

Narration: "This narration uses an artificial intelligence voice clone trained on my speech for
long-form exposition."

- This is a quiet, centred card with low motion. The sentence is set verbatim in about 40 px,
  fading in on `narration`, with "voice clone" in gold at `clone`.
- A thin waveform runs under the sentence: the real amplitude envelope of this turn's OV audio.
  Precompute it with a script in `tools/`, using ffmpeg on `outputs/YT02v2_ov/YT02v2_ov.mp3` over
  73,970–80,390 ms at one RMS value per video frame. Write the result to
  `firstminute/data/waveform_t5.json`, then draw it from that file. A playhead follows stage ms,
  and the played part of the waveform is brighter.
- Small line under it: "Narrator: Emmanuel Theodore, author of The Original Power".

## Checks (all must pass)

1. Episode tsc: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`
2. `node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs`. It must still
   pass; you have not touched the dashboard.
3. A new `tools/check_first_minute.mjs` (follow how `check_dashboard.mjs` renders to markup in
   Node) that, for each of your five scenes, does the following:
   - Renders static markup at these times, using the cues from `ov/stage_plan.json`: shot start,
     each cue + 800 ms, and shot end − 1 frame.
   - Asserts deterministic markup across two fresh processes.
   - Asserts no hook other than the engine's `useCue`/`useStageMs`/`usePlan`.
   - Asserts no literal `_` followed by a letter or `{` in text nodes.
   - Asserts no interaction hints.
   - Asserts every expected string from this brief is present at its beat.
4. Plan compile and dry-run:
   - `PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/stage_ov.yaml -o Architecting_the_operation/video/yt02/stage/ov/stage_plan.json`
   - The same module's `render <plan> -o /tmp/x.mp4 --dry-run`.
5. The site build, with the command used in the earlier `FINDINGS_DASHBOARD_*.md`, pointed at
   this episode.

Kimi works on `RoadmapBoot.tsx` in parallel. If tsc fails only inside that file, say so and keep
going.

## Findings

Write `FINDINGS_FIRST_MINUTE.md` with these parts:

- Each scene's beats and the cue each one uses.
- Every manuscript string you put on screen, with its tex line.
- Each deviation from this brief, with the reason.
- Your antithesis grep.
- The tail of each check's output.
