# Brief: turn 4 · `RoadmapBoot`, the dashboard boots on the episode roadmap (YT02v2_ov, 0:50.1–1:14.0)

The author approved the instrument tray, so the next step is the first minute of the real episode
on Stage. Codex is building turns 0–3 and 5 at the same time from `BRIEF_FIRST_MINUTE.md`; read that
brief's "Rules" and "The contract" sections, because they apply to you too. You own turn 4. The
author chose option B in `../STAGE_PLAN.md` ("Decide 1"): the runtime dashboard powers up during the
roadmap. That makes it the episode's home base from minute one.

## Rules (override anything below)

- Working directory: `/Users/emmanuel/Documents/Theory/TheOriginalPower`.
- Write only these files:
  - `Architecting_the_operation/video/yt02/stage/firstminute/RoadmapBoot.tsx`, which replaces the
    stub; keep the export name `RoadmapBoot`.
  - New files under `stage/firstminute/roadmap/`, if you want them.
  - `stage/tools/check_roadmap_boot.mjs`.
  - Small additive changes in `stage/dashboard/` (see below).
- Do not edit `index.ts`, `Scenes.tsx`, `stage_ov.yaml`, the review plans, or Codex's files
  (`firstminute/*` other than yours).
- The engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/` is read-only.
- No git commands that change state; `git status` is fine.
- No `rm -rf`. Do not read `.env` or any secret.
- No Chromium and no Remotion renders. Plan compile and `--dry-run` are fine. Do not run the site
  build; Codex runs it and two concurrent builds collide.
- Never touch `outputs/YT02v2_ov/video/runs/`.
- On-screen text: direct declarative statements, with no "not X but Y" antithesis.
- Write `stage/FINDINGS_FIRST_MINUTE_T4.md` early and append to it as you go.

## Narration (turn 4, cue times within the turn)

"Then we state the book's vector definition, the conventional causal model we reject, the reversed
hypothesis, the two-set partition, the orthographic illusion, the five tiers, the set-resolution
ladder, three historical tests, the complex wage diagnostic, the American backlash record, the
runtime dashboard, the Interference Engine, and the rebuilt hierarchy."

The narration names **thirteen** items. The plan says fourteen; the transcript wins. The cues
`item01` … `item13` and `roadmapEnd` are in `stage_ov.yaml` and compiled in `ov/stage_plan.json`.
Each cue falls on the item's first content word: `item01` on "vector" at 1.1 s, … `item13` on
"rebuilt" at 22.2 s. `roadmapEnd` falls at the end of "hierarchy".

## The scene

The scene reuses the existing `Dashboard` (`dashboard/Dashboard.tsx`) and its boot props (`world`,
`empty`, `dim`, `lights`), as `DashboardBoot` in `Scenes.tsx` does. The rail indices are:

| Indices | Group | Panels |
|---|---|---|
| 0–4 | Left stack | Era clock, System Stress, Capital, Interference, Compass |
| 5–9 | Right stack | Active Patch, Variables, Executing Function, Policy ticker, Wage plane ("Buffer Class Wage") |
| 10–17 | Tray | Interference Engine, Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, Thyristor Latch, AC Extraction Meter, Snubber Circuit |

1. **Shot start.** The dashboard is in boot state: world map, era strip `empty` (no year is shown),
   and every panel dim (about 0.15).
2. **Boot console.** A glass console panel sits over the centre of the map, clear of both stacks
   and above the tray, about 760 × 640 at x ≈ 580–1340, y ≈ 150–790. Use `color/fill/panel-render`
   with `color/line/hairline`.
   - Header, in Plex Mono, 22 px with tracking: "EPISODE 1 · ROADMAP".
   - Then thirteen lines, one per item, in Plex Mono at about 26 px. Each line is a two-digit index
     plus the item label.
   - Each line types in on its cue: a deterministic character reveal over about 300 ms. Its status
     mark then turns gold.
   - The current line is the brightest. Earlier lines settle to `color/text/soft`. Later lines are
     not shown yet.
   - Labels, verbatim:
     1. `vector definition`
     2. `conventional causal model`, with a small red tag `rejected` (`color/marker/race`)
     3. `reversed hypothesis`
     4. `two-set partition`
     5. `orthographic illusion`
     6. `five tiers`
     7. `set-resolution ladder`
     8. `three historical tests`
     9. `complex wage diagnostic`
     10. `American backlash record`
     11. `runtime dashboard`
     12. `Interference Engine`
     13. `rebuilt hierarchy`
3. **Instruments power on where an item names one.**
   - **Panel lights:** when a line lands, the panel it names lights to full over about 400 ms:
     - `item06` → Five-Tier Cone (12)
     - `item09` → Wage plane (9)
     - `item10` → Backlash Oscillator (14)
   - **Wires:** a thin gold wire draws from the end of that console line to the panel, holds about
     1 s, then fades.
   - **`item11` "runtime dashboard":** the whole dashboard comes online.
     - Every remaining panel lights in a fast sweep in rail order over about 1.2 s.
     - The map rises to full brightness.
     - The era strip stays empty.
   - **`item12` "Interference Engine":** a gold outline pulses once on the Interference Engine tray
     cell (10).
   - **`item13`:** only the console line lands.
4. **`roadmapEnd`.** The console collapses over about 500 ms, shrinking toward the top centre and
   fading. The fully lit dashboard stands alone for the last frames before the hard cut to turn 5.

**Dashboard changes.** If you need a per-panel highlight (outline pulse) or a map-brightness
control, add **optional** props to `Dashboard`. The defaults must leave every existing render
identical, and `node stage/tools/check_dashboard.mjs` must still pass unchanged. List each change in
the findings.

The frame path must stay deterministic, exactly as in the dashboard:
- No `useState`, `useEffect`, refs or DOM measurement.
- No randomness and no `Date`.
- Every state is computed from stage ms and the cues.

## Checks (all must pass)

1. `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`. If errors are only in Codex's files, report them and continue.
2. `node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs`.
3. Write a new `tools/check_roadmap_boot.mjs`, modelled on `check_dashboard.mjs`. It renders static markup in Node at: shot start, each `itemNN` + 450 ms, `item11` + 1,300 ms, `roadmapEnd` + 600 ms, and shot end − 1 frame. It must assert:
   - Identical markup across two fresh processes.
   - No hooks beyond the engine's `useCue`/`useStageMs`/`usePlan` and those `Dashboard` already passes.
   - All thirteen labels appear by `item13` + 450 ms.
   - Each label is absent before its cue.
   - The console box does not overlap either stack or the tray.
   - No literal `_` in text nodes.
   - No interaction hints.
4. `PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/stage_ov.yaml -o Architecting_the_operation/video/yt02/stage/ov/stage_plan.json`, followed by `render <plan> -o /tmp/x.mp4 --dry-run`.

## Findings (`FINDINGS_FIRST_MINUTE_T4.md`)

- The beat timeline: each cue, what changes, and the panel index it touches.
- The console box geometry.
- Every `Dashboard` change.
- Any deviation from this brief.
- The tail of each check's output.
