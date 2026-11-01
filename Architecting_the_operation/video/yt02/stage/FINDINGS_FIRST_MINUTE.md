# First-Minute Scene Findings

Model: GPT-5 Codex

Scope: `TitleOpen`, `DictionaryEntry`, `WhyLadder`, `LiteratureStack`, and `Disclosure` for `YT02v2_ov` turns 0–3 and 5. `RoadmapBoot` remains under Kimi ownership.

## Scene Beats and Cues

All cue values are episode-absolute milliseconds from `ov/stage_plan.json`.

### Turn 0 · `TitleOpen`

| Cue | Time | Beat |
|---|---:|---|
| `title` | 460 | “The Original Power” and “Emmanuel Theodore” rise into the upper centre. |
| `archives` | 3,480 | The Archives tile enters with a ruled folio, dated header, and wax seal. |
| `equations` | 4,520 | The Equations tile enters with `W = ψ_m + jψ_s` in `MathText` and a phasor plane whose positive status axis points right and positive material axis points down. |
| `tests` | 5,360 | The Tests tile enters with two pass marks and one fail mark. |
| `episode` | 7,120 | The method tiles fold into a narrow strip and “Episode 1 · What Racism Is” enters. |
| `definition` | 10,360 | “and why the definition most of us were taught fails” enters. |
| `fails` | 12,220 | The red marker line draws beneath “the definition most of us were taught” over 500 ms. |

### Turn 1 · `DictionaryEntry`

| Cue | Time | Beat |
|---|---:|---|
| `common` | 13,840 | “The common definition of racism” enters. |
| `wrong` | 14,600 | The red “wrong” stamp enters. |
| `dictionary` | 16,720 | The `rac·ism` entry enters with senses 1 and 2. |
| `individual` | 18,620 | Sense 1 reaches full brightness and its gold rule completes. |
| `institutional` | 20,480 | Sense 3 and “if present at all” enter at reduced emphasis. |
| `order` | 22,880 | Sense numbers 1, 2, and 3 translate 735 px toward the causal area. |
| `causal` | 24,040 | The three-node conventional chain and “causal story” label enter. |
| `evidence` | 25,380 | The dashed evidence slot and manuscript source line enter. |

`DefinitionHierarchy`, `DefinitionSceneContent`, `DefinitionHierarchyState`, and `finalDefinitionState` provide the reusable entry and chain state consumed by turn 2.

### Turn 2 · `WhyLadder`

| Cue | Time | Beat |
|---|---:|---|
| shot start | 26,910 | Turn 1’s final entry and causal chain fill the frame. The shared component preserves the hard-cut continuity. |
| `header` | 27,790 | “Why, at every step” enters. The previous scene scales toward the first 320 × 180 thumbnail and settles by shot start + 1,500 ms. |
| `why1` | 29,290 | “Why does the dictionary order matter?” enters beside the live shrunken definition scene. |
| `why2` | 31,210 | “Why separate bias from racism?” enters with separate bias and racism boxes. |
| `why3` | 33,510 | The Virginia question enters with the Chesapeake coastline thumbnail. The deterministic map zoom begins. |
| `virginia` | 34,370 | “Virginia · 1676” remains visible while the zoom continues through `virginia + 2,000 ms`. |
| `why4` | 37,490 | The reform question enters with the compact `BacklashOscillatorView`. |
| `backlash` | 39,150 | The active fourth row and “reform → backlash” label remain at full emphasis. |

Each new row reduces the opacity of earlier rows. The Chesapeake path comes from `world-atlas` 50m land geometry, an Equal Earth projection, and a geographic clip around the Chesapeake. The generated path contains coastlines and contains no modern country-border layer.

### Turn 3 · `LiteratureStack`

| Cue | Time | Beat |
|---|---:|---|
| `established` | 40,990 | “Established social science” enters. |
| `bias` | 42,690 | The Bias block and Greenwald & Banaji citation enter. |
| `prejudice` | 43,610 | The Prejudice block and Allport citation enter. |
| `discrimination` | 44,170 | The Discrimination block enters. |
| `tripartite` | 45,790 | The thinking, feeling, and behavior row enters with its bracket, connectors, and Fiske citation. |
| `mark` | 47,910 | The completed literature stack holds while narration names the marking action. |
| `stops` | 48,870 | The gold boundary draws across the lower third and labels the stopping point. |

### Turn 5 · `Disclosure`

| Cue | Time | Beat |
|---|---:|---|
| `narration` | 74,130 | The disclosure sentence, 193-frame RMS waveform, and narrator credit fade in. |
| `clone` | 76,830 | “voice clone” transitions to gold over 450 ms. |
| `speech` | 78,190 | The disclosure and waveform continue through the spoken training-source phrase. |
| `disclosureEnd` | 80,030 | The completed card holds through the end of the spoken sentence. |

The waveform uses the 73,970–80,390 ms audio window. `tools/build_waveform_t5.mjs` runs `ffmpeg` with 1,600 samples per frame at 48 kHz and writes 193 linear RMS values to `firstminute/data/waveform_t5.json`. The playhead and played-wave brightness derive from stage milliseconds.

## Manuscript Strings on Screen

| On-screen string or construction | Manuscript location |
|---|---|
| “The Original Power” | `Paper/The_Original_Power.tex:143` |
| “Emmanuel Theodore” | `Paper/The_Original_Power.tex:144` |
| `W = ψ_m + jψ_s` | `Paper/The_Original_Power.tex:2873` |
| Positive `ψ_s` points right; positive `ψ_m` points down | `Paper/The_Original_Power.tex:2876–2883` |
| “Individual prejudice or discrimination based on race” | `Paper/The_Original_Power.tex:1795` |
| “Belief in racial superiority” | `Paper/The_Original_Power.tex:1796` |
| “Systemic or institutional discrimination” and “if present at all” | `Paper/The_Original_Power.tex:1797` |
| “Individual Prejudice → Discriminatory Actions → Systemic Outcomes” | `Paper/The_Original_Power.tex:1804–1807` |
| Bias as a tendency in judgment; the LiteratureStack’s full definition | `Paper/The_Original_Power.tex:243` |
| Racism as “psycho-legal social software” | `Paper/The_Original_Power.tex:243` |
| Prejudice as group antipathy grounded in a rigid, erroneous generalization | `Paper/The_Original_Power.tex:243` |
| Discrimination as behavior that treats people differently because of group membership | `Paper/The_Original_Power.tex:243` |
| Thinking: stereotype; feeling: prejudice; behavior: discrimination | `Paper/The_Original_Power.tex:243` |
| Greenwald & Banaji 1995; Allport 1954, p. 9; Fiske 1998 | `Paper/The_Original_Power.tex:243` |

The bias thumbnail uses the brief’s compact phrase “a tendency in judgment.” The LiteratureStack carries the brief’s full display wording. Both derive from the bias sentence at line 243.

## Deviations and Implementation Notes

Storyboard deviations: zero.

1. The Chesapeake geographic conversion runs in `firstminute/data/build_chesapeake_map.mjs`. The runtime scene imports the generated 5.6 kB clipped SVG path. This preserves the requested 50m land source and Equal Earth projection while keeping geographic processing outside the frame path.
2. The first site-build attempt exposed Vite’s package resolution boundary for a bare `topojson-client` import in an episode outside the engine package. Precomputation removed that runtime dependency. The final site build passed.
3. The site build wrote to a unique `/tmp/yt02-first-minute-site.*` directory. This preserved the task’s file-ownership boundary around the existing review directory.
4. Chromium inspection and Remotion frame rendering remain assigned to the orchestrator under the brief.

## Antithesis Review

`rg` scanned the five scene sources, `tools/check_first_minute.*`, and the Chesapeake generator with the prohibited-form patterns from `AGENTS.md`.

Result:

```text
no matches
```

The rendered-string checker also verifies the direct declarative strings at every beat. The independent prose review result is recorded after its completion below.

## Check Output Tails

### Episode TypeScript

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage
exit 0; no diagnostics
```

### First-Minute Checker

```text
PASS: 43 first-minute frames rendered in two fresh processes; all markup hashes match.
PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified.
```

### Dashboard Regression

```text
PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

### Waveform and Chesapeake Data

```text
wrote .../firstminute/data/waveform_t5.json (193 RMS frames)
wrote .../firstminute/data/chesapeake_coastline.json (5375 path characters)
```

### Plan Compile and Render Dry-Run

```text
wrote Architecting_the_operation/video/yt02/stage/ov/stage_plan.json
STAGE_EPISODE_DIR=.../stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=.../stage/ov/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Site Build

```text
✓ 267 modules transformed.
stage/default.json                                           2,216.81 kB │ gzip: 258.50 kB
assets/index-D2DsRSt0.js                                     1,832.19 kB │ gzip: 541.06 kB
✓ built in 1.09s
85 files emitted; exit 0
```

Vite emitted its existing chunk-size warning.


---

# Fix pass 1 (frame review of `first_minute_v0.mp4`)

Model: Kimi Code CLI. Brief: `BRIEF_FIRST_MINUTE_FIX1.md`. Every fix is in place; each
scene's beats and cues are unchanged. Layout constants are exported from the scene files
and asserted in `tools/check_first_minute.tsx`, so the geometry the check verifies is the
geometry the scenes render.

## Fix 1 · DictionaryEntry number gutter

`DictionaryEntry.tsx` gains an exported `DICTIONARY_LAYOUT` and `DICTIONARY_LIFT_X`.

- The panel's 55 px leftward shift now runs on the `order` progress (previously on
  `causal`), so the panel's right edge rests at x 965 before the numbers arrive.
- On `order` the sense numbers lift `translateX(850px)` into a gutter column at canvas
  x 985: clear of the shifted panel's right edge (965) and of every sense line (sense
  text ends at x 941). The 28 px mono digits occupy x 985–1002.
- On `causal` the chain draws at left 1050, right of the gutter, spanning 1050–1820.
- Vertical centring: entry panel top 262 → 325, chain top 300 → 363. The content column
  (entry 325–755, chain plus evidence slot 363–677) centres at y 540. The header (top
  105) and the source line (bottom 78) stay where they were.

## Fix 2 · TitleOpen sizing and centring

- Tiles are 340 × 240 at y 533–773, xs 350 / 790 / 1230 (row width 1220, centred), with
  the graphics scaled up inside: folio and tests SVGs 220 × 126 → 260 × 149, equation 27
  → 31 px with the phasor plane 180 × 65 → 205 × 74.
- The title block sits at top 306. The pre-fold block (title 306–463, tiles 533–773)
  centres at y ≈ 539.5.
- The post-fold block (title 306, folded strip 493–565, episode line 605, subtitle
  709–767) centres at y ≈ 536.5. Strip targets were recomputed for the 340-wide tiles:
  xs 643.2 / 878.2 / 1113.2, y 493, scale 0.48 × 0.30 (strip cells 163.2 × 72).
- The folio header "ARCHIVE · 1676" now sets at 9.5 px mono with letterSpacing 0.8 at
  x 62, ending near x 150, clear of the fold corner that begins at x 160.

Note on tile size: the brief asks for "about 340 × 240"; the previous tiles measured
360 × 250 in the code and the frames, so the enlargement went into the graphics and the
vertical centring, and the tiles keep the brief's stated dimensions.

## Fix 3 · WhyLadder alignment, map label, slot-1 caption

`WhyLadder.tsx` exports `WHY_LAYOUT`: the header and the thumbnail column share the left
edge x 240 (≥ 120); rows are 1540 wide with the question text at 365–1485 inside the row.

- The continuity shrink lands the turn-1 entry at (240, 224), on slot 1's thumbnail.
- "Virginia · 1676" carries a 196 × 30 backing plate (rx 4, `color/fill/panel-render`,
  1 px hairline) at x 8–204, y 140–170 inside the 320 × 180 thumbnail; the coastline no
  longer crosses the label.
- Slot 1 gains the caption "rac·ism · senses 1–3" (20 px mono, left 16, bottom 9 inside
  the thumbnail frame). It renders at the scene root with zIndex 3 because the continuity
  overlay sits at zIndex 2, and it dims in step with row 1.

## Fix 4 · LiteratureStack connectors and boundary

`LiteratureStack.tsx` exports `LITERATURE_LAYOUT`: blocks at y 196 / 316 / 436 (x 220,
w 1480, h 112), tripartite row at (330, 592) sized 1260 × 166, boundary at y 780 with
"where the literature stops" on its left end. The empty dark region below the boundary
measures 264 px (780–1044).

The two straight connector verticals are replaced by nested elbows, generated from the
constant so check and render share one source:

- feeling → Prejudice: (989, 610) → (989, 562) → (1730, 562) → (1730, 372) → (1700, 372)
- behavior → Discrimination: (1395.7, 610) → (1395.7, 578) → (1750, 578) → (1750, 492) →
  (1700, 492)

Each connector leaves its component's top, runs right to its gutter lane (1730 for
feeling, 1750 for behavior), rises, and enters the block's right edge at x 1700. The
feeling lane at y 562 and the behavior lane at y 578 both sit below the Discrimination
block (bottom edge 548), the feeling vertical at 1730 never descends to the behavior
lane, and both verticals run right of the stack (blocks end at x 1700). No segment
crosses text, a block, or the other connector; the check's segment–rect test asserts this
against the definition text column (x 530–1370) for every block.

## Fix 5 · RoadmapBoot standby state

Two optional `Dashboard` props; their defaults leave every existing render byte-identical
(`check_dashboard` passes unchanged):

1. `eraClockStandby?: boolean` — provides the new `EraClockStandbyContext` from
   `PanelContent.tsx`. When set, the Era clock compact panel renders "—" for the year and
   "STANDBY" for the place, with no log chip, and the Policy ticker's compact result line
   renders "—" (see the deviation below). The panel sizes and positions are unchanged.
2. `mapOutlineOnly?: boolean` — `DashboardMap` draws the world outline only: the polity
   layer, the Portugal gold highlight, and every map label are suppressed.

`RoadmapBoot` now renders
`<Dashboard world empty dim lights mapOpacity eraClockStandby mapOutlineOnly/>`; the era
strip stays empty as briefed, and all other instruments keep their values.

Deviation from the brief: the brief scoped the 1486 leak to the Era clock and the map.
The Policy ticker's compact result line reads "[POLICY] Casa dos Escravos (1486)
institutionalizes state-managed extraction. Vector established." — a third place the 1486
state shows, and one the mandated check ("1486" absent from every RoadmapBoot frame)
cannot pass with the ticker untouched. The ticker therefore takes the same standby
treatment under the same context. Every other instrument keeps its values.

## Fix 6 · Check additions

`tools/check_first_minute.tsx` now asserts, from the exported layout constants:

- the DictionaryEntry gutter (x 985) is clear of the shifted panel's right edge (965),
  the lift lands exactly on the gutter (`panelX + orderShiftX + numberInsetX +
  DICTIONARY_LIFT_X === gutterX`), and the chain (1050) draws right of the gutter;
- `WHY_LAYOUT.headerX === WHY_LAYOUT.columnX` and that edge is ≥ 120;
- `LITERATURE_LAYOUT.boundaryY` is within 760–800;
- no LiteratureStack connector segment intersects any block's definition text box
  (orthogonal segment–rect intersection over the exported polylines).

The stale `translateX(735px)` assertion now asserts `translateX(850px)` via
`DICTIONARY_LIFT_X`.

`tools/check_roadmap_boot.tsx` now asserts on every rendered frame: the tag-stripped
visible text contains no "1486", "LISBON", "PORTUGAL" or "RUNTIME LOG", and contains
"STANDBY". (The "1486"-prefixed digit strings inside map path `d` attributes are
coordinates; the assert runs on text nodes only.)

## Fix pass 1 check output tails

### Episode TypeScript

```text
$ npx --prefix …/scriptCast-stage/video tsc --noEmit -p …/yt02/stage
exit 0; no diagnostics
```

### First-Minute Checker

```text
PASS: 43 first-minute frames rendered in two fresh processes; all markup hashes match.
PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified; fix-pass-1 geometry: DictionaryEntry gutter x 985 clear of panel edge 965 with chain at 1050; WhyLadder header/column aligned at x 240; LiteratureStack boundary y 780 and elbow connectors clear of all block text boxes.
```

### Dashboard Regression

```text
PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

### RoadmapBoot Checker

```text
PASS: 17 RoadmapBoot frames rendered in two fresh Node processes with identical markup; state/effect/reducer/ref hooks trap on invocation.
PASS: RoadmapBoot renders 17 deterministic frames; 13 labels land on their cues and are absent before; console box 580–1340 × 150–790 clears stacks (317 / 1671) and tray (944); panels 12, 9, 14 light on items 06, 09, 10 with wires; item11 sweep complete by +1300 (map opacity 1); item12 pulse present; console collapsed by roadmapEnd+600; era strip empty throughout; Era clock on standby and map outline-only ("1486", "LISBON", "PORTUGAL", "RUNTIME LOG" absent from every frame); no literal underscores; no interaction hints.
```

### Plan Compile and Render Dry-Run

```text
wrote Architecting_the_operation/video/yt02/stage/ov/stage_plan.json   (byte-identical; git diff empty)
STAGE_EPISODE_DIR=.../stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=.../stage/ov/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Site Build

Fresh `/tmp` output directory (`/tmp/yt02-first-minute-fix1-site.0Db7we`):

```text
✓ 267 modules transformed.
stage/default.json                                           2,216.81 kB │ gzip: 258.50 kB
assets/index-BH83ifGA.js                                     1,838.55 kB │ gzip: 543.38 kB
✓ built in 1.07s
```

Vite emitted its existing chunk-size warning. The built bundle contains the new "STANDBY"
and "rac·ism · senses 1–3" strings.

### Git State

`git status --porcelain` shows modifications only in the permitted files
(`firstminute/*.tsx`, `dashboard/Dashboard.tsx`, `dashboard/DashboardMap.tsx`,
`dashboard/PanelContent.tsx`, `tools/check_first_minute.tsx`,
`tools/check_roadmap_boot.tsx`). The pre-existing dirty paths outside `stage/`
(`.claude/launch.json`, `yt02/logs/…`, `tmp/`) were left untouched. No git state was
changed.
