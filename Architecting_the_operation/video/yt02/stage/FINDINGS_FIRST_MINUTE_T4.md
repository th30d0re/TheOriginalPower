# Findings — First minute, turn 4: `RoadmapBoot` (YT02v2_ov, 0:50.1–1:14.0)

Scene: `firstminute/RoadmapBoot.tsx`. The runtime dashboard powers up under a boot console
that types the thirteen-item episode roadmap on the `itemNN` cues. All times below are
episode-absolute ms from `ov/stage_plan.json`; in-turn seconds are relative to the shot
start at 50,100 ms.

## Beat timeline

| Cue | ms | in-turn | What changes | Panel (rail index) |
|---|---|---|---|---|
| shot start | 50100 | 0.000 | Boot state: world map at 0.30 brightness, era strip `empty`, all 18 panels dim 0.15. Glass console over the map centre with header "EPISODE 1 · ROADMAP", no lines yet. | — |
| item01 | 51160 | 1.060 | Line 01 types "vector definition" over 300 ms; status mark turns gold at +300. | — |
| item02 | 52720 | 2.620 | Line 02 types "conventional causal model"; red tag "rejected" (`color/marker/race`) appears when typing completes. | — |
| item03 | 55500 | 5.400 | Line 03 "reversed hypothesis". | — |
| item04 | 57450 | 7.350 | Line 04 "two-set partition". | — |
| item05 | 58860 | 8.760 | Line 05 "orthographic illusion". | — |
| item06 | 60540 | 10.440 | Line 06 "five tiers". Panel lights 0.15 → 1 over 400 ms. Gold wire draws from the console bottom edge down to the tray cell (+300..+550), holds 1 s, fades 300 ms. | Five-Tier Cone (12) |
| item07 | 62130 | 12.030 | Line 07 "set-resolution ladder". | — |
| item08 | 62940 | 12.840 | Line 08 "three historical tests". | — |
| item09 | 65300 | 15.200 | Line 09 "complex wage diagnostic". Panel lights over 400 ms. Wire from the console's right edge at the line's centre height to the panel's left edge. | Wage plane (9) |
| item10 | 67400 | 17.300 | Line 10 "American backlash record". Panel lights over 400 ms. Wire drops from the console bottom edge to the tray cell. | Backlash oscillator (14) |
| item11 | 69040 | 18.940 | Line 11 "runtime dashboard". The whole dashboard comes online: every panel sweeps to full in rail order (55.9 ms stagger, 250 ms fade each; complete at +1,200) and the map rises 0.30 → 1.00 over 1,200 ms. Era strip stays empty. | all 18 |
| item12 | 70640 | 20.540 | Line 12 "Interference Engine". Gold outline pulses once on the tray cell (+300..+1000, stroke opacity follows sin(πp), outline grows 3→8→3 px). | Interference Engine (10) |
| item13 | 72340 | 22.240 | Line 13 "rebuilt hierarchy". Only the console line lands. | — |
| roadmapEnd | 73320 | 23.220 | Console collapses over 500 ms (cubicInOut): fades and shrinks toward its top centre (scale → 0.08, translate up 60 px). | — |
| shot end − 1 frame | 73936.7 | 23.837 | Collapse long done (+500 < +650). The fully lit dashboard stands alone for the last frames before the hard cut to turn 5. | — |

Line brightness rule: the most recently cued line is `color/text/primary`; earlier lines
settle to `color/text/soft`; later lines are not rendered at all (the `data-roadmap-line`
element does not exist before its cue). Typing is a deterministic substring reveal: the
two-digit index types first, then the label, `floor(progress × length)` characters.

## Console box geometry

- Box: `left 580, top 150, width 760, height 640` (x 580–1340, y 150–790), fill
  `color/fill/panel-render`, 1 px `color/line/hairline` border, radius 8, padding 28,
  `pointerEvents: none`.
- Header block 56 px: "EPISODE 1 · ROADMAP" in IBM Plex Mono 22 px, letterSpacing 3,
  `color/text/muted`, over a hairline divider.
- Thirteen lines, 38 px rows: 12 px status-mark square (hairline outline; fills
  `color/fill/gold` when typing completes), two-digit index in `color/text/dim`, label at
  26 px IBM Plex Mono. Item 02 adds a small red "rejected" tag (16 px mono,
  `color/marker/race`, 1 px red border).
- Clearance (verified by `tools/check_roadmap_boot.mjs` against the live layout):
  left stack right edge is 317 (era clock, x 36 + w 281), right stack left edge is 1671,
  era strip bottom is 84, tray top is 944. Console x 580–1340 × y 150–790 clears all four.
- Wire endpoints: item06 → tray cell 2 top centre (612, 790) → (612, 944);
  item10 → tray cell 4 top centre (1076, 790) → (1076, 944); item09 → console right edge
  (1340, 557 = line 09 centre) → Wage plane left edge (1695, 384). Panel rects are computed
  at module level from `rail` + `instruments` with the same stacking formula
  `DashboardFrame` uses, so they track the layout automatically.

## Dashboard changes (additive; defaults leave existing renders byte-identical)

1. `dashboard/DashboardMap.tsx`: new optional prop `mapOpacity?: number`. When defined, the
   map wrapper div gains `opacity: <value>` as the last style key. When undefined, no style
   key is emitted, so `check_dashboard.mjs` markup is unchanged.
2. `dashboard/Dashboard.tsx`: `DashboardProps` gains `mapOpacity?: number`, destructured in
   `DashboardFrame` and passed through to `DashboardMap`. No default value is applied, so
   `DashboardBoot` / `Dashboard1486` / `check_dashboard` renders are identical.

No per-panel highlight prop was needed: the item12 outline pulse and the three wires are
drawn in a scene-level SVG overlay (`data-roadmap-wires`), positioned from the exported
`rail`/`trayCellRect` geometry.

## Deviations from the brief

1. **Tray wires start at the console's bottom edge**, at the target cell's centre x, rather
   than at the end of the line's text. A wire leaving the line text would cross the lines
   rendered below it (lines 07–13 sit between line 06 and the console's bottom edge). The
   right-stack wire (item09) does leave at the line's centre height, i.e. the end of the
   line, per the brief.
2. **Map brightness starts at 0.30.** The brief fixes the panels' boot dim at ~0.15 and
   says the map "rises to full brightness" at item11 without stating its boot level; 0.30
   keeps the world map readable under the console while still giving item11 a visible rise.
3. **The "rejected" tag is 16 px.** The first-minute contract floors labels at 20 px; the
   tag is a status chip alongside a 26 px line, sized with the dashboard's compact chips
   rather than the scene-label floor.
4. **Pinned "about" values:** panel light-up 400 ms; wire draw 250 ms starting when typing
   completes (+300), 1,000 ms hold, 300 ms fade; sweep 950 ms stagger + 250 ms fade = 1,200 ms
   total; pulse 700 ms; collapse 500 ms ending 150 ms before the cut.
5. **Status mark shape** (a 12 px square that fills gold) is my choice; the brief specifies
   only that a mark turns gold.

## Check output tails

1. `npx --prefix …/scriptCast-stage/video tsc --noEmit -p …/yt02/stage` — clean exit, no
   output (no errors in any file, including the parallel Codex files).
2. `node stage/tools/check_dashboard.mjs`:

   ```
   PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
   PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
   ```

3. `node stage/tools/check_roadmap_boot.mjs`:

   ```
   PASS: 17 RoadmapBoot frames rendered in two fresh Node processes with identical markup; state/effect/reducer/ref hooks trap on invocation.
   PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console box 580–1340 × 150–790 clears stacks (317 / 1671) and tray (944); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; no literal underscores; no interaction hints.
   ```

4. `scriptcast.tools.stage plan stage_ov.yaml -o ov/stage_plan.json` →
   `wrote …/ov/stage_plan.json` (byte-identical to the committed plan; `git diff` empty).
   `render …/ov/stage_plan.json -o /tmp/x.mp4 --dry-run` printed the Remotion command
   (Chrome executable, h264, concurrency 8) with no error.
5. `python3 tools/check_antithesis.py` on the new scene, check and this findings file:
   `no banned constructions found` (two REVIEW-class notes in this file, both factual
   qualifiers).

