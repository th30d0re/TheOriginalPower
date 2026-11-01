# Findings — Dashboard Fix Pass 3 (Expanded Complex Wage Plane)

**Date:** 2026-11-01  
**Scope:** `/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/` (engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/` untouched; zero `git` commands executed; zero Chromium launches).

---

## 1. What Was Requested

The author noted that expanding the `Wage plane` opened the secondary settings card in `R-04`, leaving the primary two-column *Complex Wage Plane* artifact view unseen. Fix pass 3 requested four updates:

1. **Expanded Wage plane = the artifact's main view, full size:**
   - Rebuild the expanded card (`mode === 'expanded'`) in [`ComplexWagePlane.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/ComplexWagePlane.tsx) as the artifact's two-column layout over the map (`1400 × 860`, centred in the `1856 × 968` map clip at `[260, 138]`), interpolated smoothly from the compact `Wage plane` slot `[1695, 228, 187, 120]`.
   - **Header:** Title `"Complex Wage Plane"`, the artifact's lede line with real HTML subscripts via `MathText`, a top-right gear control (`data-control="gear" data-action="open-settings"`) that switches to settings, and a close control (`data-control="close" data-action="close"`).
   - **Left column:** `720 × 720` square SVG plane (`viewBox="0 0 800 830"`, `CX = 400, CY = 450, R = 100, K = 3`) drawing the bronze coordinate grid, τ-zone polygon and diagonal hatch, `τ boundary · M = τ` callout, dashed clock face with 12 hour ticks and numerals, rotated axes (`+ψ_s` at 3 o'clock, `−ψ_s` at 9 o'clock, `+ψ_m` at 6 o'clock, `−ψ_m` at 12 o'clock) with real subscripts, extraction pyramid (`E / P / F` and `Elite extraction`), the four quadrant labels with `manuscript` and `proposed` tags, the safe/unsafe arc at `|W|`, the `6:00 ideal` marker, the `Elite optimum 2:12` marker, the glowing `W` vector and angle arc `θ`, and the `Buffer class` origin node, followed by the artifact's caption and 5-item legend.
   - **Right column (`"Wage vector"` panel):** `ψ_m`, `ψ_s`, and `θ` rows (styled as static slider bars with thumbs in the deterministic rendered path and live range inputs in the interactive path), the 8-item stats grid (`Angle θ`, `Size |W|`, `Clock position`, `Quadrant`, `Class-coherence risk M`, `Margin to τ`, `Material flow`, `Safest angle at any |W|`), the status chip (`Inside the τ limit`), the `M`-against-`τ` gauge (`0–150` scale), the regime note, and the safe-arc ring note, all computed by porting the artifact's exact formulas and strings.
2. **Settings is secondary:**
   - Keep `mode === 'settings'` reachable via the gear control on the expanded card (and the gear icon on the compact card in the interactive site) in the same `1400 × 860` footprint (`[260, 138, 1400, 860]`).
   - Populate `WagePlaneSettings` with the artifact's *τ model (proposal)* panel (`M₀`, `τ`, `a`, `b`, `ψ_s ceiling` readouts; `τ zone`, `Arc at |W|`, `Elite optimum` on/off chips; Elite optimum summary note), the *Quadrant names* panel (`QI`–`QIV` titles, clock ranges, formulas, descriptions, and provenance tags), the *What comes from where* provenance panel, and the `SOURCE` / `UNITS & RANGES` / `LOG 2 VALUE` lines.
3. **Review sequence (`R-04`) and state times (`review/states.json`):**
   - Update `R-04` so `Wage plane` expands to the full artifact view at `19.5 s`, holds until `21.8 s`, switches to settings via the gear for `1.2 s`, returns to expanded at `23.0 s`, and collapses before `24.0 s` (`23.45 s`).
   - Update [`review/states.json`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/states.json) with `dash_1486_wage_expanded` (`21000`) and `dash_1486_wage_settings` (`22600`), keeping the existing times for `dash_world_boot` (`500`), `dash_1486_compact` (`13000`), and `dash_1486_interference_expanded` (`16000`).
4. **Interactive site behavior:**
   - Hovering or clicking the compact `Wage plane` opens `'expanded'`; only the gear control opens `'settings'`.
   - In the interactive path (`interactive={true}`), dragging `W` on the SVG plane (`onPointerDown` / `onPointerMove` / `onPointerUp`), pressing arrow keys on the handle, or moving the `ψ_m`, `ψ_s`, and `θ` sliders updates `(ψ_s, ψ_m)` (clamped to `±100`) and recomputes every readout live. The deterministic rendered path stays static and hook-free.

---

## 2. Expanded Card Box & Layout Geometry

| Element | Box `[x, y, w, h]` | Notes |
|---|---|---|
| **Map clip** (`MAP_CLIP_BOX`) | `[32, 84, 1856, 968]` | Bounds `x: 32..1888`, `y: 84..1052`; centre `(960, 568)` |
| **Compact `Wage plane` slot** | `[1695, 228, 187, 120]` | Right-stack slot 2 (`right = 1882`) |
| **Expanded `Wage plane` card** (`WAGE_EXPANDED_BOX`) | `[260, 138, 1400, 860]` | Centred at `(960, 568)` inside the map clip; right edge `1660` clears right rail (`x >= 1671`), bottom edge `998` clears bottom strips (`y >= 1005`) |
| **Settings `Wage plane` card** (`mode === 'settings'`) | `[260, 138, 1400, 860]` | Same `1400 × 860` footprint at `[260, 138]` |
| **Left SVG plane** (`data-plane-size="720"`) | `720 × 720 px` (`viewBox="0 0 800 830"`) | `CX = 400`, `CY = 450`, `R = 100`, `K = 3` (100 units = 300 SVG px) |
| **Right column (`Wage vector` panel)** | `1fr` (`~620 px` wide) | Contains sliders, 8-stat grid, status chip, `0–150` gauge, regime note, and safe-arc ring note |
| **Adjacent `Backlash oscillator` compact card** | `[1680, 356, 202, 88]` | Remains fixed in the right rail (`x = 1680 > 1660`) while `Wage plane` expands |

---

## 3. Log 2 Stat Values & Readouts (`ψ_m = 0, ψ_s = 60`)

Model parameters for Log 2 (Kongo, 1486):
- `ψ_m = 0` (`+0`)
- `ψ_s = 60` (`+60`, pure status wage `W = jψ_s`)
- `M₀ = 60`, `τ = 40`, `a = 1`, `b = 0.7`, `ψ_s ceiling = 80`

### Slider Row Readouts
| Slider Row | Label | Formula / Value |
|---|---|---|
| **Row 1** | `ψ_m · material (6 o'clock = +, 12 o'clock = −)` | `+0` |
| **Row 2** | `ψ_s · status (3 o'clock = +, 9 o'clock = −)` | `+60` |
| **Row 3** | `θ · angle from 6 o'clock (+ψ_m)` | `90° (3:00)` |

### Eight Stat Grid Values
| # | Stat Label | Log 2 Value | Sub-caption / Formula |
|---|---|---|---|
| 1 | `Angle θ` | `90.0°` | `atan2(ψ_s, ψ_m) · 0° at 6:00` |
| 2 | `Size \|W\|` | `60.0` | `√(ψ_m² + ψ_s²)` |
| 3 | `Clock position` | `3:00` | `6:00 = +ψ_m · 3:00 = +ψ_s` |
| 4 | `Quadrant` | `QI · Joint wage` | `3:00–6:00 · ψ_m > 0, ψ_s > 0` |
| 5 | `Class-coherence risk M` | `18.0 (τ = 40)` | `M₀ + a·ψ_m − b·eff(ψ_s)` |
| 6 | `Margin to τ` | `22.0 below τ` | `positive = room before τ` |
| 7 | `Material flow` | `none` | `from sign of ψ_m` |
| 8 | `Safest angle at any \|W\|` | `4:50 (θ = 35°)` | `tan θ = b / a (below ceiling)` |

### Gauge, Status Chip, and Notes
- **Status chip:** `Inside the τ limit`
- **Gauge readout:** `M = 18.0   τ = 40` (on `0 .. 150` scale; fill width `12.0%`, `τ` marker at `26.67%`)
- **Regime note:** `Almost all status. Manuscript: the default operating mode of the extraction kernel (:2939).`
- **Ring note (`safeArcs(60)`):** `At |W| = 60, the safe arc runs counterclockwise from 7:18 to 2:22.`
- **SVG `W` tip coordinates:** `(x = 700, y = 450)` (`CX + 60 * 3 = 700`, `CY + 0 * 3 = 450`, 3 o'clock on the `|W| = 60` ring).

---

## 4. Updated R-04 Sequence & State Times (`review/states.json`)

### R-04 Cue Schedule (`18.0 s – 24.0 s`)
- `19500 ms` (`expand:wage-plane`): `Wage plane` expands from `[1695, 228, 187, 120]` to `[260, 138, 1400, 860]` (`600 ms` duration, settled by `20100 ms`).
- `21800 ms` (`settings:wage-plane`): Gear transition switches `Wage plane` from `'expanded'` to `'settings'` (`420 ms` duration, settled by `22220 ms`).
- `23000 ms` (`reexpand:wage-plane`): Gear/back transition returns `Wage plane` to `'expanded'`.
- `23450 ms` (`collapse:wage-plane`): `Wage plane` collapses back to its compact slot `[1695, 228, 187, 120]` before `24000 ms`.

### `review/states.json`
```json
{
  "dash_world_boot": 500,
  "dash_1486_compact": 13000,
  "dash_1486_interference_expanded": 16000,
  "dash_1486_wage_expanded": 21000,
  "dash_1486_wage_settings": 22600
}
```

---

## 5. How It Was Implemented

1. **[`dashboard/ComplexWagePlane.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/ComplexWagePlane.tsx):**
   - Ported the mathematical model (`computeComplexWageModel`, `effPsiS`, `Mof`, `thetaToClock`, `safeArcs`, `buildTauPolygonAndBoundary`, `classifyRegime`, `ringSummary`, `arcPath`, `clockPoint`) directly from the reference HTML artifact.
   - Built `ComplexWagePlaneView` for the two-column `1400 × 860` expanded card (`WAGE_EXPANDED_BOX = { x: 260, y: 138, width: 1400, height: 860 }`), rendering real `<sub>` and `<sup>` markup via `MathText` and zero `<button>` elements in the non-interactive render path.
   - Built `InteractiveComplexWagePlane` for the interactive site path (`interactive={true}`), wiring pointer drag on the SVG plane (`setPointerCapture`, `pointer -> (ψ_s, ψ_m)` clamped to `[-100, 100]`), keyboard arrow steps on the `W` handle, and slider inputs for `ψ_m`, `ψ_s`, and `θ`.
   - Built `WagePlaneSettings` for `mode === 'settings'`, displaying the artifact's *τ model (proposal)* panel, *Quadrant names* panel, *What comes from where* provenance panel, and the `SOURCE` / `UNITS & RANGES` / `LOG 2 VALUE` lines, with a back-to-plane control (`data-control="gear" data-action="open-expanded"`).
2. **[`dashboard/instruments/wage-plane.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/instruments/wage-plane.tsx):**
   - Implemented `WagePlane` with smooth box interpolation between `[1695, 228, 187, 120]` (`compact`) and `[260, 138, 1400, 860]` (`expanded` / `settings`).
   - Exported `transitionWagePlaneMode(current, action)` so `hover` and `click-compact` transition strictly from `'compact'` to `'expanded'`, and only `'gear'` transitions to `'settings'`.
3. **[`dashboard/PanelContent.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/PanelContent.tsx) & [`dashboard/Dashboard.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/Dashboard.tsx):**
   - Updated `Wage plane` expanded and settings dimensions in `PANEL_DEFS` to `1400 × 860` and kept the right-rail slot offset pinned to `d.compact.h` (`120 px`) so `Backlash oscillator` remains stationary at `[1680, 356, 202, 88]` when `Wage plane` expands over the map clip.
4. **[`Scenes.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/Scenes.tsx), [`review/stage.yaml`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage.yaml), [`review/word_timings.json`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/word_timings.json), [`review/states.json`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/states.json), [`review/stage_plan.json`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json), and [`review/stage_plan_wage-expanded.json`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan_wage-expanded.json):**
   - Updated `R-04` cues and narration timings so `21000 ms` lands on the settled expanded Complex Wage Plane and `22600 ms` lands on the settled settings card.
   - Added standalone `stage_plan_wage-expanded.json` (`14.0 s`) so `WageExpandedScene` (`5.2 s` expanded artifact view, `1.8 s` gear settings view, return to expanded, collapse) can be previewed independently.
5. **[`tools/check_dashboard.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/tools/check_dashboard.tsx):**
   - Added structural and geometric checks for `t = 21000 ms` (`dash_1486_wage_expanded`) and `t = 22600 ms` (`dash_1486_wage_settings`), verifying the `[260, 138, 1400, 860]` box, the `720 px` plane, all 8 stat labels and values, the `M`-against-`τ` gauge (`0–150`), the absence of settings-only sections on the expanded card, the presence of settings panels at `22600 ms`, and the `transitionWagePlaneMode` gear-only invariant.

---

## 6. Challenges Encountered

1. **Right-Stack Slot Stability During Map-Centred Expansion:**
   - Expanding `Wage plane` to `860 px` height inside the right-rail vertical stack accumulator in [`Dashboard.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/dashboard/Dashboard.tsx) would push `Backlash oscillator` downward off-screen if the slot accumulator interpolated height. Pinning `Wage plane`'s right-stack slot advance to `d.compact.h` (`120 px`) while `WagePlane` interpolates its floating card box to `[260, 138, 1400, 860]` kept `Backlash oscillator` at `[1680, 356, 202, 88]`.
2. **Exact Safe-Arc String Verification:**
   - For `|W| = 60` with `M₀ = 60, τ = 40, a = 1, b = 0.7`, the boundary `M(θ) <= 40` spans `[-52.1°, 118.4°]`, which converts via `thetaToClock` to `7:18` and `2:22` (`"At |W| = 60, the safe arc runs counterclockwise from 7:18 to 2:22."`). The test suite in [`tools/check_dashboard.tsx`](file:///Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/tools/check_dashboard.tsx) was aligned to assert this exact computed string.

---

## 7. Verification Check Tails

### 7.1 Episode TypeScript (`tsc --noEmit`)
Command:
```bash
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage
```
Output tail:
```text
(exit 0, 0 errors)
```

### 7.2 Engine TypeScript & Stage Check (`check-stage`)
Command:
```bash
cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && npx tsc --noEmit -p . && npm run check-stage
```
Output tail:
```text
> scriptcast-stage-video@0.1.0 check-stage
> node tools/check_stage.mjs

PASS: motion/fly-to, springs, cues, instrument growth, four map projections + fit, and MathText parsing.
```

### 7.3 Dashboard Verification Suite (`tools/check_dashboard.mjs`)
Command:
```bash
node /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs
```
Output tail:
```text
PASS: 19 frames rendered twice in fresh Node processes (13 review + 6 scene frames); hashes match; 0 panel collisions; all text inside 1920×1080 safe area.
PASS: Equal Earth route 1296 samples / 0 land hits; natural_earth_50m coastline + rivers verified; expanded Complex Wage Plane (1400×860 at [260,138], 720px plane, 8 stat labels, M-against-τ gauge) & gear-only settings verified; interactive controls isolated from rendered path.
```

### 7.4 Stage Plan & Render Dry-Run
Command:
```bash
PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage.yaml -w /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/word_timings.json -o /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json
PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage render /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json -o /tmp/x.mp4 --dry-run
```
Output tail:
```text
Wrote /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json (5 beats, 24000 ms, 720 frames @ 30 fps)
plan:     /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json
episode:  /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage
composition: StageEpisode (1920x1080 @ 30 fps)
frames:   720 (24000 ms)
props:    /tmp/x.props.json
command:  npx remotion render /Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/index.ts StageEpisode /tmp/x.mp4 --props=/tmp/x.props.json --gl=angle
```

### 7.5 Interactive Site Build (`vite build`)
Command:
```bash
cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && STAGE_EPISODE_DIR=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage STAGE_PLAN=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json npx vite build --config site/vite.config.ts --outDir /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist
```
Output tail:
```text
vite v5.4.21 building for production...
transforming...
✓ 125 modules transformed.
rendering chunks...
computing gzip size...
../../../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/index.html                  0.84 kB │ gzip:   0.45 kB
../../../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/assets/index-DS7l0fT1.js  815.63 kB │ gzip: 263.70 kB
✓ built in 872ms
```

---

## 8. Next Ideas (6 Ideas)

1. **Interactive Parameter Sliders on the Settings Card:** Connect the `M₀`, `τ`, `a`, `b`, and `ψ_s ceiling` readouts in `WagePlaneSettings` to live state in the interactive site path (`interactive={true}`) so adjusting the model parameters in Settings immediately reshapes the τ-zone polygon and safe-arc intervals when returning to the expanded plane.
2. **Animated Vector Trajectory Across Logs 1–3:** Add a cue-driven `W(t)` trajectory option to `ComplexWagePlane` that animates `W` from `(ψ_m = 0, ψ_s = 0)` at Log 1 (1444) to `(ψ_m = 0, ψ_s = 60)` at Log 2 (1486) and traces the phase rotation into Log 3 (1526).
3. **Interactive Toggle Chips in Settings:** Wire the `τ zone`, `Arc at |W|`, and `Elite optimum` chips in `WagePlaneSettings` to boolean toggles in `InteractiveComplexWagePlane` so users on the interactive site can isolate individual geometric layers on the `720 × 720` plane.
4. **Hover Readout Tooltip Along the `|W|` Ring:** In the interactive site path, allow hovering along the dashed `|W|` ring to preview `M(θ)` and the clock angle before committing a drag of the `W` vector.
5. **Cross-Panel Highlight Between `Wage plane` and `Kernel E / P / F`:** When the user drags `W` into `QIV · Extraction` (`ψ_m < 0, ψ_s < 0`) or `QII · Payoff + coercion` on the interactive site, highlight the corresponding `E / P / F` tier flow in the `Kernel E / P / F` card.
6. **Automated Pointer-Drag Unit Test in `check_dashboard.tsx`:** Add a synthetic pointer-to-coordinate conversion check verifying `clientPointToPsi` across all four quadrants (`12:00`, `3:00`, `6:00`, `9:00`, and corners clamped at `±100`) to guard interactive pointer mapping math against future SVG `viewBox` adjustments.
