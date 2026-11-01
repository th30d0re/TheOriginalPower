# Findings — Dashboard Tray (always-on instrument tray, 2026-11-01)

**Date:** 2026-11-01
**Scope:** `/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/` only. Engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/` untouched. No git state changes. No Chromium or Remotion renders (plan compile and `--dry-run` only).

---

## 1. What Was Requested

Wire the nine model instruments into an always-on bottom tray:

1. **Layout:** left stack unchanged; right stack = Active Patch, Variables, Executing Function, Policy ticker (last two as compact one-line panels, expanded shows all three result lines); bottom strips removed; bottom tray of nine mini instruments (Complex Wage Plane, Interference Engine, Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, Thyristor Latch, AC Extraction Meter, Snubber Circuit) at x 36…1884, ~197 px cells with 8 px gaps, ~100 px tall, `color/fill/panel-render` recipe.
2. **Map:** keep Equal Earth and approved scale; re-frame so route (Lisbon → Elmina), labels and Portugal sit above the tray's top edge and clear of both stacks; re-run land-hit and label-collision checks.
3. **Tray wiring:** wrap the eight ported views (`dashboard/artifacts/<Name>View.tsx`) plus the existing Complex Wage Plane in the dashboard panel (`PanelContent` recipe), size cells, drive mode timelines from cues, register them.
4. **Modes per instrument:** `compact` (catalogue readout, 11 px mono title, mini-graphic, values via `MathText`), `expanded` (~1400 × 860 over the map growing from its tray cell, static in rendered path), `settings` (model parameters + verbatim sources text + manuscript line refs + "model default" line when the era mapping is a suggestion).
5. **Era mapping:** from `dashboard_eras.json` log 2 per the catalogue's "era-drivable" notes; where the mapping is a suggestion (Thyristor gate rule, Snubber event-only, Phase Coherence outside 1960–2030), show the artifact default and mark "model default". Never invent book values.
6. **Colours:** artifact ivory `#ECE7DC` → `color/text/primary`, gold `#D4A84B` → `color/fill/gold`. IBM Plex local fonts.
7. **Snubber conflict:** manuscript says arms raise V_br; real TVS clamps sooner at lower V_br. Show the manuscript's reading, note in settings, flag here.
8. **Review plan `review_tray/`** (~30 s): 1486 dashboard settled with tray, each tray instrument expands ~2.5 s and collapses (nine expansions), one settings view (Interference Engine) via gear. `review_tray/states.json` with settled times. Keep existing review working.
9. **Also fix:** interaction hints ("Click or drag…", arrow keys) must show only when the clock is interactive; apply to every ported artifact.
10. **Checks:** episode tsc, extended `tools/check_dashboard.mjs` (tray nine cells in order, all three modes per instrument, determinism covers tray, route above tray), plan + render dry-run for both review plans, site build.

---

## 2. Per-Instrument Port Summary

| Tray order | Instrument | Compact readout | Era mapping (log 2) | modelDefault | Deviations |
|---|---|---|---|---|---|
| 1 | Complex Wage Plane | mini plane + clock + ρτ | log 2 has no 1705 timeline point; retain fix-pass-3 `ψ_m = 0`, `ψ_s = 60` | true | interaction caption and SVG accessibility hint gated on `interactive` |
| 2 | Interference Engine | ρτ number + bar + mini phase circle | Φ_load/rho_tau midpoints, M₀ solved | false | — |
| 3 | Phase Coherence | 24-dot circle + Φ + r | pre-1960 → artifact default | true | — |
| 4 | Five-Tier Cone | five-disc stack + E vis % | tiers light from `variables_loaded` and `variables_deployed`; view geometry stays at artifact defaults | true | — |
| 5 | Compounding Ledger | 5-step staircase + O value | log 2 predates 1619 → baseline 1.00 | true | — |
| 6 | Backlash Oscillator | q(t) sparkline + ζ + period | no preset for log 2 → preset 0 | true | — |
| 7 | Thyristor Latch | LATCHED badge + I vs I_H | no log input; gate rule unapproved | true | — |
| 8 | AC Extraction Meter | mini phasor + cos θ + clock | log 2 sets display year 1486; electrical parameters stay at artifact defaults | true | — |
| 9 | Snubber Circuit | surge sparkline + energy bar | event-only (log 3 crash); log 2 default | true | V_br conflict note |

---

## 3. View Defects Found and Fixed

1. **Stale dashboard checker.** The snapshot branch asserted 11 panels and stopped at `actual: 18, expected: 11`. It now recognizes five left-stack panels, four right-stack panels and nine tray cells. Fresh-process comparison includes the full dashboard and hashes for all 27 tray mode renders.
2. **Non-interactive interaction hint.** The Complex Wage Plane caption was already gated, while the static SVG retained `aria-label="Wage plane. Use the arrow keys…"`. The static label now reads `Complex wage plane`. The checker rejects the words `drag`, `click`, `arrow keys` and `press` across every compact, expanded and settings tray render when `interactive` is false.
3. **Missing Complex Wage Plane default marker.** The settings view now states that log 2 predates the 1705 timeline and records the retained fix-pass-3 values `ψ_m = 0`, `ψ_s = 60`. The code uses those values in `wageModel`; it does not drive the view from a clamped 1705 timeline state.
4. **Stale map-check expectations.** Compass assertions still expected the earlier camera centre and zoom. They now derive the centre, zoom and scale-bar values from `iberiaCamera`. Route clearance uses the tray top at map-local `y = 860` and the current stack edges.
5. **Incomplete collision coverage.** The checker now tests route-label pairs, route labels against every panel, polity-label pairs, polity labels against route labels, and polity labels against every panel.
6. **Scratch verification files.** The useful static-render checks from `tools/smoke.mjs` and `tools/smoke_entry.tsx` were folded into `check_dashboard`; both scratch files were deleted.
7. **Generated geometry records.** `review/map-geometry-fix1.json` and `review/map-geometry-fix2.json` now describe the tray-era camera, route bounds and tray geometry.

### Audit results with no repair required

- Right stack: Active Patch `[1671, 96, 211, 60]`, Variables `[1729, 164, 153, 56]`, Executing Function `[1671, 228, 211, 40]`, Policy ticker `[1671, 276, 211, 40]`. The compact ticker shows the latest result. Its expanded view contains all three log-2 result lines.
- The former bottom strips are absent from the 18-panel rail.
- Every tray instrument expands to `[260, 138, 1400, 860]`. A midpoint render at 300 ms confirms that each card interpolates from its own tray cell upward and toward the shared centre box.
- Every settings view is reachable through the gear transition. Hover, compact click and close never select settings.
- The Snubber settings view already carries the manuscript/TVS `V_br` conflict note.

### Model-default cases at log 2

The settings view marks these eight cases with `Model default:`:

1. Complex Wage Plane — log 2 predates the 1705 timeline; fix-pass-3 values remain `ψ_m = 0`, `ψ_s = 60`.
2. Phase Coherence — 1486 is outside the 1960–2030 timeline.
3. Five-Tier Cone — loaded/deployed variables select tier indicators; the geometric model parameters remain defaults.
4. Compounding Ledger — 1486 precedes the 1619 shock sequence and shows normalized baseline `1.00`.
5. Backlash Oscillator — log 2 has no fitted shock preset and uses preset 0.
6. Thyristor Latch — the artifact defines no approved runtime-log gate mapping.
7. AC Extraction Meter — the display year is 1486 and the electrical parameters remain defaults.
8. Snubber Circuit — the artifact defines an event trigger for log 3 and no log-2 parameter mapping.

Interference Engine is the sole non-default tray instrument at log 2. It uses the log's `Φ_load` and `ρ_τ` midpoints and solves `M₀` with the artifact's default `u` and `η`.

### Author flag: Snubber `V_br`

The rendered settings note preserves the manuscript reading: arms and training raise `V_br`. The same note states the electrical consequence: a lower TVS breakdown voltage clamps sooner, while a higher value admits a larger surge before clamping. The two readings conflict and require an author decision.

## 4. Layout Geometry

| Element | Geometry | Result |
|---|---:|---|
| Frame | `1920 × 1080` | compact border unchanged |
| Tray | `x = 36…1884`, `y = 944…1044` | 1848 px span, 100 px high |
| Tray cells | `198.2222 × 100` | nine equal cells, 8 px gaps |
| Expanded/settings card | `[260, 138, 1400, 860]` | shared by all nine instruments |
| Map clip | screen `[32, 84, 1856, 968]` | tray top is map-local `y = 860` |
| Equal Earth fit | centre `[5°, 20°]`, `pxPerDeg = 19.5` | fit extent `[-31.75°, -1.21°]…[41.75°, 41.21°]` |
| Projection | scale `1137.9224`, zoom `3.3477554×` | approved Portugal scale retained |
| Visible midpoint extent | west `50.8511°W`, east `60.8511°E`, north `42.9821°N`, south `1.2100°S` | recorded in both geometry JSON files |
| Route bounds, map-local | `x = 540.14…821.86`, `y = 84.29…843.36` | route clears both stacks and ends 16.64 px above tray |
| Portugal mainland height | `102.18 px` | inside the approved `90…110 px` band |
| Portugal plus 1486 Moroccan enclave | `136.70 px` | inside the `126…154 px` band |

The route check sampled 1,296 cubic-curve points and found 0 land hits. All route labels end above map-local `y = 860`. Portugal, the four route labels and all 16 polity labels clear the tray and panel stacks. Pairwise label checks report 0 collisions.

## 5. Verification Check Tails

### Episode TypeScript

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage
exit 0; no diagnostics
```

### Dashboard checker

```text
PASS: 19 frames plus all 27 tray mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; right stack + 9-cell tray geometry; all 27 tray modes; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

### Existing review plan and dry-run

```text
wrote .../stage/review/stage_plan.json
episode: yt02_dashboard_review · duration: 24000 ms · frames: 720
STAGE_EPISODE_DIR=.../stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/yt02-dashboard-review.mp4 --props=.../stage/review/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Tray review plan and dry-run

```text
wrote .../stage/review_tray/stage_plan.json
episode: yt02_dashboard_tray_review · duration: 29300 ms · frames: 879
STAGE_EPISODE_DIR=.../stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/yt02-dashboard-tray-review.mp4 --props=.../stage/review_tray/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

Both render commands were emitted by `--dry-run`; neither command executed and Chromium remained closed.

### Site build

```text
✓ 259 modules transformed.
rendering chunks...
computing gzip size...
assets/index-DBt0f1ck.js  1,804.28 kB │ gzip: 531.91 kB
✓ built in 1.02s
```

Vite emitted its existing chunk-size warning for the 1.8 MB application bundle. The build exited 0 and wrote only to `stage/review/site-dist`.

## Fix pass 1 — rendered tray review

### Repairs

1. **Thyristor layout:** the expanded root now clips no content and uses a 370 px two-card row plus a 280 px bifurcation card. Its schematic, current chart, and bifurcation SVGs use fixed heights of 210, 190, and 160 px. The declared vertical total is 779 px inside the 828 px content box.
2. **AC layout:** the expanded root uses a 700 px main grid. The right column uses a 288 px waveform card, a 12 px gap, and a 400 px Reparations Integral card. Fixed SVG heights are 260 px for the phasor, 145 px for the waveform, and 110 px for the integral. The declared root total is 816 px.
3. **Thyristor trace:** the artifact reset history is ported as a module-cached 601-point default trace. The default values remain `I = 0.79`, `I_H = 0.30`, and `LATCHED`. Compact and expanded renders consume the same cached data.
4. **Mathematical text:** the Interference Engine verdict passes through `MathText`, uses `ρ_τ`, and spells the phase lever as `Φ_{load}`. The rendered-markup audit also found source paths and formulas in the Wage Plane, Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, Thyristor Latch, AC Extraction Meter, and Snubber Circuit views. Each now renders through `MathText`.
5. **Backlash header:** non-interactive renders show one static `Active preset · Impulse shock` label. Interactive site renders retain all three preset buttons and reserve 92 px at the right edge for the gear and close controls. The other eight headers contain no non-interactive control row in the reserved top-right area.

### Expanded and settings height audit

The checker owns the declared layout-height table and rejects any expanded or settings total above 828 px. Flexible columns below use the exact remainder after fixed padding, headers, and gaps.

| View | Expanded arithmetic | Settings arithmetic |
|---|---:|---:|
| Complex Wage Plane | fixed 828 px content grid | fixed 828 px content grid |
| Interference Engine | 382 + 14 + 432 = **828** | fixed 828 px two-column grid |
| Phase Coherence | 76 header + 10 gap + 742 main = **828** | 16 padding + 14 gap + 798 columns = **828** |
| Five-Tier Cone | 32 padding + 71 header + 12 gap + 713 main = **828** | 32 padding + 12 gap + 784 columns = **828** |
| Compounding Ledger | 62 header + 12 gap + 754 main = **828** | 32 padding + 16 gap + 780 columns = **828** |
| Backlash Oscillator | 32 padding + 796 column = **828** | 48 padding + 780 settings body = **828** |
| Thyristor Latch | 24 padding + 77 header + 28 gaps + 370 main + 280 bifurcation = **779** | 32 padding + 16 gap + 780 columns = **828** |
| AC Extraction Meter | 32 padding + 68 header + 16 gap + 700 main = **816** | 32 padding + 16 gap + 780 columns = **828** |
| Snubber Circuit | fixed 828 px full-height two-column grid | 32 padding + 16 gap + 780 columns = **828** |

No additional overflow appeared in the arithmetic audit. Settings layouts use parallel columns within their declared height. The Interference Engine, Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, and Snubber Circuit expanded views already bounded their main content with fixed or flex-remainder heights.

### Checker additions

- Every tray view declares expanded and settings totals in `TRAY_VIEW_LAYOUT_HEIGHTS`; all 18 totals must be at most 828 px.
- Every rendered tray mode is scanned for a markup text node containing `_` followed by a letter or `{`.
- Thyristor compact and expanded output must each expose the shared 601-point trace.
- Thyristor and AC markup must contain the audited fixed panel heights.
- Backlash non-interactive expanded output must contain only the active preset label.

### Verification tails

**Episode TypeScript**

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p .../stage
exit 0; no diagnostics
```

**Dashboard checker**

```text
PASS: 19 frames plus all 27 tray mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; right stack + 9-cell tray geometry; all 27 tray modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

**Review plans and render dry-runs**

```text
wrote .../stage/review/stage_plan.json
wrote .../stage/review_tray/stage_plan.json
review: yt02_dashboard_review · 24000 ms · 720 frames
review_tray: yt02_dashboard_tray_review · 29300 ms · 879 frames
Both --dry-run invocations emitted Remotion commands and exited 0. Chromium remained closed.
```

**Site build**

```text
✓ 259 modules transformed.
assets/index-Cn5ocv6T.js  1,805.80 kB │ gzip: 532.26 kB
✓ built in 1.10s
```

Vite emitted the existing chunk-size warning. The build exited 0 and wrote to `stage/review/site-dist`.

## Fix pass 2 — Buffer Class Wage returns to the right stack

### Layout

The right stack now contains five panels:

| Order | Panel | Box `[x, y, w, h]` |
|---:|---|---:|
| 1 | Active Patch | `[1671, 96, 211, 60]` |
| 2 | Variables | `[1729, 164, 153, 56]` |
| 3 | Executing Function | `[1671, 228, 211, 40]` |
| 4 | Policy ticker | `[1671, 276, 211, 40]` |
| 5 | Buffer Class Wage | `[1695, 324, 187, 120]` |

The Wage plane compact uses the handoff `Nodes` tree and retains the 84 px plane graphic, τ zone, W vector, and readouts. Its visible title is `Buffer Class Wage`. The title box is `[11, 9, 165, 14]`, which gives 11 px horizontal padding on both sides. Expanded and settings modes retain `[260, 138, 1400, 860]`. The expanded title remains `Complex Wage Plane`, and the settings title is `SETTINGS · BUFFER CLASS WAGE`.

The tray contains the eight requested artifacts in the requested order. Its fixed span is 1,848 px (`1884 − 36`). Seven 8 px gaps consume 56 px, leaving 1,792 px for cells. Each cell is therefore **224 px** wide. A 225 px cell width would require a 1,856 px span and a right edge at 1,892 px.

### Review plan

The Wage plane expansion remains at 4,000 ms and now grows from the right-stack box. The eight tray expansions and the Interference Engine settings step retain their cue times. `review_tray/states.json` records the settled Wage state as `right_stack_wage_plane_expanded` at 4,600 ms.

### Verification tails

**Episode TypeScript**

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p .../stage
exit 0; no diagnostics
```

**Dashboard checker**

```text
PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

**Plan compilation and render dry-runs**

```text
wrote .../stage/review/stage_plan.json
wrote .../stage/review_tray/stage_plan.json
review: yt02_dashboard_review · 24000 ms · 720 frames
review_tray: yt02_dashboard_tray_review · 29300 ms · 879 frames
Both --dry-run invocations emitted Remotion commands and exited 0. Chromium remained closed.
```

**Site build**

```text
✓ 259 modules transformed.
assets/index-D2JwB6gC.js  1,803.87 kB │ gzip: 531.84 kB
✓ built in 1.04s
```

Vite emitted the existing chunk-size warning. The build exited 0 and wrote to `stage/review/site-dist`.
