# FigCraft Build Notes — YT02 SEG 11 Runtime Dashboard

## Summary and Timing

- **Session start:** 2026-10-17 12:59:36 EDT
- **Completion time:** 2026-10-17 13:21:10 EDT (total wall-clock duration: ~21.5 minutes, including binary diagnostics on the control server, command schema inspection, layout construction, shaped-text reflow, and visual verification of all exported PNGs).
- **Script execution time (`build_dashboard.py`):** 0.83 seconds end-to-end for 968 command invocations across 7 frames (`1920×1080`), prototype flow wiring, `.figcraft` native save, `.fig` export, and 7 full-resolution PNG exports.

---

## Root Cause of the `engine.execute` Timeout on `doc.list`

Sampling PID 92753 (`/Applications/FigCraft.app/Contents/MacOS/FigCraft`) with `/usr/bin/sample` and disassembling `figcraft::control_server::start` (`0x10024e878`) and `figcraft::control_server::drain_queue` (`0x1002751ec`) identified the exact mechanism behind the control-channel timeout:

1. **Queue Architecture:** The TCP listener thread (`figcraft-control`) accepts connections on `127.0.0.1:47831`, parses the incoming JSON-line request into a `figcraft_ui_egui::control::ControlRequest`, pushes it onto a shared `Arc<Mutex<Vec<ControlRequest>>>`, and calls `egui::Context::request_repaint()`.
2. **Main-Thread Drain Dependency:** The request queue is drained exclusively on the main UI thread inside `eframe::App::update` via `figcraft::control_server::drain_queue`.
3. **macOS Window Occlusion / App Nap:** When the FigCraft window is covered by another application window on macOS, AppKit marks the window occluded and suspends `CVDisplayLink` / `NSEvent` redraw delivery (`mach_msg2_trap` inside `ReceiveNextEventCommon`). While occluded, `eframe::App::update` never runs, `drain_queue` never executes, and every control-channel method (`engine.execute`, `ui.menu.invoke`, `ui.inspect`, `engine.commands`) blocks until the client times out.
4. **Fix Applied in `build_dashboard.py`:** Running `osascript -e 'tell application "FigCraft" to activate'` before issuing TCP requests brings the window to the foreground, keeps `eframe::App::update` active, and allows `engine.execute` to return in <1 ms per call.
5. **`engine.execute` vs. `ui.menu.invoke`:** Once the window is active, `engine.execute` is strictly preferable to `ui.menu.invoke` for automation. `engine.execute` returns the command's structured payload (such as `{"id": 2}` from `node.create`, the document array from `doc.list`, or the layer tree with shaped text bounding boxes from `node.get`), whereas `ui.menu.invoke` returns only `{"lastError": null, "ok": true}`. When no document is open, `engine.execute {"command": "doc.list", "params": {}}` returns `[]`.

---

## What Worked

- **Batch Execution (`command.batch`):** Grouping ~100–122 `node.create` calls per frame into a single `command.batch` request reduced per-frame creation time to ~50 ms and grouped each frame into a single undo step.
- **Two-Pass Shaped Text Measurement (`node.get` + `node.set`):** Creating text layers with `textAutoResize: "widthAndHeight"` causes FigCraft's text shaper to compute exact pixel bounds for proportional strings (`Φ_load`, `ρ_τ`, `W = jψ_s`, long variable descriptions). Querying the frame once via `node.get` and resizing each `chip <id>` pill via a batched `node.set` call produced exact padding and 10 px horizontal spacing across all seven eras.
- **Arc Geometry on Ellipses (`arcStart`, `arcSweep`, `arcInner`):** `node.create` with `type: "ellipse"` supports donut-sector parameters (`arcStart`, `arcSweep`, `arcInner`), enabling native vector rendering of the `ρ_τ` dial track (`135°` to `405°`), the red danger zone past `τ = 1.0`, and the active `ρ_τ` sector (`rho dial`).
- **SVG Path Vectors (`type: "vector"`):** `node.create` accepts SVG path strings (`M cx cy L tx ty`) with `strokeCap: "round"`, used for the `rho needle` and the 1676 `rho crash needle`.
- **Smart Animate Prototype Transitions (`proto.interaction.add`):** `figcraft_ui_egui::present::smart_interpolate` (`0x100f42a20`) walks `Document::subtree` and matches layers across frames via `figcraft_ui_egui::present::name_path` (`0x100f407e4`). Keeping identical layer names (`era band`, `stress badge`, `phi bar`, `rho dial`, `rho needle`, `chip I_buffer`, `ticker 1`–`ticker 4`, `warning banner`) across all seven frames enables smooth interpolation of position, dimensions, arc sweep, color, and opacity across `afterDelay` transitions.
- **Dual File Persistence (`file.saveAs` + `file.export`):** `file.saveAs` writes the lossless native document (`yt02_dashboard.figcraft`), and `file.export` with `format: "fig"` writes the `.fig` container (`yt02_dashboard.fig`).

---

## What Did Not Work / API Limitations Affecting the Spec

1. **No Timeline or Keyframe Animation API:** FigCraft 0.6.0 has no per-layer keyframe timeline (`manualKeyframeTracks` or `animationStyles`) and no MP4/video export command (`file.export` supports `png`, `jpg`, `svg`, `pdf`, `webp`, and `fig`). Motion in FigCraft is limited to prototype transitions (`smartAnimate`, `dissolve`, `push`, `slideIn`, `moveIn`) between top-level frames inside the interactive presenter (`proto.present`).
2. **Single Transition Duration per Frame-to-Frame Hop:** Because `afterDelay` triggers a single frame-level `smartAnimate` transition to the next era frame, every changed layer between two eras interpolates simultaneously over the shared `durationMs` window (`700 ms`). Staggering individual panel entrances on word-level audio cues (`figma_cues.py`) inside FigCraft requires decomposing each era into multiple intermediate sub-frames along the prototype chain.
3. **No Continuous Loop Animation for Pulsing Badges:** The spec calls for `CRITICAL` on the System Stress panel to pulse red. Without a keyframe loop or timeline oscillator, a static frame represents the pulse state through a high-contrast outer border (`stress pulse`) and translucent red halo (`stress badge halo`) that fade in and out across eras via `smartAnimate`.
4. **Single-State Frame Constraint for Era 1676 (`ρ_τ > 1.00 at crash, then [0.60, 0.75] post-patch`):** With one frame per era (`era 1676`), the dial cannot animate a two-stage sweep (first spiking past `1.00`, then settling to `[0.60, 0.75]`) inside `era 1676` alone without adding an intermediate frame. To preserve all verbatim data on `era 1676`, the dial renders both the red `ρ_τ>1.00 at crash` needle/callout past `τ = 1.0` and the gold `ρ_τ ∈ [0.60, 0.75] post-patch` sector and needle simultaneously.
5. **Font Availability (`Noto Sans`):** `text.fonts {}` enumerates system-installed fonts via CoreText. On this macOS host, regional Noto Sans scripts (`Noto Sans Adlam`, `Noto Sans Arabic`, etc.) are installed, while the base Latin `Noto Sans` family is absent from `/System/Library/Fonts` and `/Library/Fonts`. Setting `fontFamily: "Noto Sans"` on text nodes succeeds and persists the family name in the document model while rendering glyphs through FigCraft's built-in sans-serif fallback with full coverage of Greek (`Φ`, `ρ`, `τ`, `ψ`, `Γ`) and mathematical (`∈`, `→`) Unicode codepoints.
6. **`.fig` Export Warning:** `file.export {"format": "fig"}` succeeds and writes `yt02_dashboard.fig` (42,537 bytes), returning `"warnings": ["prototype device settings were left out"]`. The native `.figcraft` file (`yt02_dashboard.figcraft`) preserves the prototype device settings intact.

---

## Commands Used

Every control-channel method and engine command invoked during investigation and build:

### Top-Level Control Methods (`127.0.0.1:47831`)
- `ui.inspect`
- `ui.menu.invoke`
- `engine.commands`
- `engine.execute`

### Engine Commands (`engine.execute`)
1. `doc.list` — list open documents before cleanup
2. `file.close` — close existing tabs (`{"force": true}`)
3. `file.new` — create the `"YT02 Runtime Dashboard"` document
4. `page.rename` — name the page `"SEG 11 · Runtime Dashboard"`
5. `page.setBackground` — set canvas background to `#091020`
6. `text.fonts` — inspect installed font families
7. `node.create` — create top-level era frames (`frame`) and child layers (`rectangle`, `ellipse`, `vector`, `text`)
8. `command.batch` — batch layer creation and chip reflow updates per era frame
9. `node.get` — read shaped text widths and heights for exact chip pill sizing
10. `node.set` — apply exact `(x, y, width, height)` bounds to variable chips, dots, and labels
11. `proto.settings` — configure custom `1920×1080` prototype screen size
12. `proto.flow.add` — register `"YT02 SEG 11 Runtime Log Flow"` starting at `era 1486`
13. `proto.interaction.add` — wire `afterDelay` (`3500 ms`) + `smartAnimate` (`700 ms`, `easeInOut`) navigation edges from `era 1486` through `era 2010s`
14. `proto.present` — verify interactive prototype presenter state at `1920×1080`
15. `proto.closePreview` — close the presenter overlay after verification
16. `view.zoomFit` — fit all seven era frames in the canvas viewport
17. `file.saveAs` — save native `yt02_dashboard.figcraft`
18. `file.export` — export `yt02_dashboard.fig` and the `1920×1080` PNGs (`era_1486.png`, `era_1676.png`, `era_1704.png`, `era_1894.png`, `era_1968.png`, `era_1994.png`, `era_2010s.png`)

---

## Session Log

### 1. What Was Wrong / What Was Requested

The user requested building the YT02 SEG 11 Runtime Dashboard (`Architecting_the_operation/video/yt02/DASHBOARD_SPEC.md`) in FigCraft 0.6.0 purely through its TCP control channel (`127.0.0.1:47831`), using verbatim values from `Architecting_the_operation/video/yt02/dashboard_eras.json`. Deliverables under `Architecting_the_operation/video/yt02/figcraft/`:
- Seven `1920×1080` frames (`era 1486`, `era 1676`, `era 1704`, `era 1894`, `era 1968`, `era 1994`, `era 2010s`) with named layers (`stress badge`, `phi bar`, `rho dial`, `chip I_buffer`, `ticker 1`, etc.) in the YT01 color palette (`#0F1B33`, `#16264A`, `#F4EAD2`, `#9FB0CF`, `#D9A441`, `#E2573F`, `#5FA8D3`) and `Noto Sans`.
- A prototype flow stepping through the seven eras with `afterDelay` + `smartAnimate` transitions.
- Saved design files (`yt02_dashboard.fig` and `yt02_dashboard.figcraft`) and exported PNGs (`era_<year>.png`).
- Investigation of why `engine.execute` timed out on `doc.list` and documentation of all commands and API constraints.

### 2. How I Fixed It / What I Did

1. **Diagnosed Control Server Hang:** Sampled PID 92753 and inspected `figcraft::control_server` symbols in the binary. Determined that TCP requests queue into a mutex drained by `eframe::App::update` on the main thread, which macOS suspends when the window is occluded. Added an AppleScript activation call (`tell application "FigCraft" to activate`) to `FigCraftClient.activate_app()`.
2. **Inspected All 552 Engine Commands:** Queried `engine.commands` and reviewed parameter schemas for `node.create`, `node.set`, `command.batch`, `proto.interaction.add`, `proto.flow.add`, `proto.settings`, `file.saveAs`, and `file.export`.
3. **Built `build_dashboard.py`:** Implemented a deterministic builder script in `Architecting_the_operation/video/yt02/figcraft/build_dashboard.py` that reads `dashboard_eras.json` and constructs all seven era frames with consistent layer naming for `smartAnimate` and `figma_cues.py`.
4. **Refined Chip and Ticker Geometry:** Added `reflow_chips_from_shaped_bounds()` to query shaped text widths via `node.get` and resize each variable chip pill via `node.set`. Adjusted ticker row heights so Log 14's four `[POLICY]` lines and `WARNING` banner render with clean separation.
5. **Verified Outputs Visually:** Inspected all seven exported `1920×1080` PNGs and verified `proto.present` via `ui.inspect`.

### 3. Challenges Encountered

- **macOS Window Occlusion Blocking `eframe::App::update`:** Initial `ui.inspect` call timed out after 30 seconds because the FigCraft window was behind other windows. Activating the application via `osascript` immediately unblocked the main event loop and reduced command latency to sub-millisecond levels.
- **Proportional Glyph Widths in Variable Chips:** Initial character-count width estimation left tight right margins on bold strings with wide glyphs (`W`, `m`). Switching to a two-pass layout that reads shaped `width` and `height` from `node.get` eliminated estimation error.
- **Four-Policy + Warning Density in Era 1968:** Log 14 carries four `[POLICY]` items plus a `WARNING` field in `raw_fields`. Reserving `46 px` for the warning banner and tightening four-row ticker height to `28 px` with `5 px` vertical gaps prevented overlap inside the bottom `Result` panel.

### 4. Next Ideas (6 Ideas)

1. **Decouple `control_server` Queue Processing from Window Visibility in FigCraft:** Run document-level `engine.execute` commands on a background worker or wake the macOS run loop with an `NSApplication` custom event so headless/occluded control requests never block on `CVDisplayLink`.
2. **Sub-Frame Decomposition for Intra-Era Beats:** Generate intermediate frames per era (`era 1676 crash` → `era 1676 post-patch`, or one frame per `[POLICY]` ticker line) chained with short `afterDelay` + `smartAnimate` hops to approximate word-cued beat reveals inside FigCraft's presenter.
3. **Headless Frame Sequence Recorder for Prototype Transitions:** Add a control-channel command (`proto.exportVideo` or `proto.renderTransition`) that steps `figcraft_ui_egui::present::smart_interpolate` at `t = 0 .. 1` across `30 fps` steps and writes PNG frames or an MP4 clip directly to disk.
4. **Install Base `Noto Sans` OTF/TTF in `/Library/Fonts`:** Install `NotoSans-Regular.ttf` and `NotoSans-Bold.ttf` at the user font path so `text.fonts {"family": "Noto Sans"}` resolves native Noto metrics without falling back to the bundled sans-serif face.
5. **Preserve Prototype Device Settings in `.fig` Exporter:** Extend FigCraft's `.fig` serializer (`figcraft_format`) to include prototype device dimensions so `file.export {"format": "fig"}` completes with zero warnings.
6. **Automated Diff Check Against `dashboard_eras.json`:** Add a verification mode to `build_dashboard.py` that traverses `node.get` across all seven frames and asserts that every string in `dashboard_eras.json` matches the `characters` property of its target text layer verbatim.

---

## Round 2: Depth

### Empirical Schema Discovery (`effect.add`, `effect.set`, and `fills` Gradients)

Following the brief, schemas were discovered empirically on a temporary scratch rectangle via `effect.add` + `node.get` and SVG/paint probes, then deleted before building:

1. **Effect Objects (`dropShadow`, `innerShadow`, `noise`):**
   - Calling `effect.add {"ids": [id], "type": "dropShadow" | "innerShadow" | "noise"}` and reading back `node.get {"id": id}` revealed the exact JSON shapes written by FigCraft:
     - `dropShadow` / `innerShadow`:
       ```json
       {
         "type": "dropShadow",
         "color": {"r": 0.0, "g": 0.0, "b": 0.0, "a": 0.35},
         "offset": [0.0, 2.0],
         "radius": 4.0,
         "spread": 0.0,
         "showBehind": false,
         "blend": "normal",
         "visible": true
       }
       ```
     - `noise`:
       ```json
       {
         "type": "noise",
         "mode": "mono",
         "color": {"r": 0.1176, "g": 0.2039, "b": 0.3765, "a": 0.03},
         "secondary": {"r": 0.0235, "g": 0.0471, "b": 0.0941, "a": 0.03},
         "density": 0.20,
         "size": 0.5,
         "opacity": 0.03,
         "blend": "normal",
         "visible": true
       }
       ```
   - Both `effect.set {"ids": [id], "index": i, "effect": {...}}` and `node.create` / `node.set` with `"effects": [...]` require the `"type"` discriminator inside each effect object.
2. **Gradient Paint Objects (`fills`):**
   - FigCraft represents gradients with `"type": "gradient"` and `"kind": "linear" | "radial"`, using three normalized handle coordinates (`"from": [x0, y0]`, `"to": [x1, y1]`, and the required perpendicular handle `"width": [wx, wy]`):
     ```json
     {
       "type": "gradient",
       "kind": "linear",
       "from": [0.5, 0.0],
       "to": [0.5, 1.0],
       "width": [1.0, 0.0],
       "opacity": 1.0,
       "blend": "normal",
       "visible": true,
       "stops": [
         {"position": 0.0, "color": "#1B2E58"},
         {"position": 0.48, "color": "#16264A"},
         {"position": 1.0, "color": "#111E3B"}
       ]
     }
     ```
3. **Lower-Opacity Outlines (`strokes`):**
   - `node.create` and `node.set` accept `"strokes": [{"type": "solid", "color": "#5FA8D3", "opacity": 0.42, "visible": true, "blend": "normal"}]` alongside `"strokeWeight"`, enabling per-layer stroke alpha without altering fill opacity.

### Exact Depth System Values Applied in `build_dashboard.py`

1. **Level 0 — Background (Era Frames, `1920×1080`):**
   - **Radial Vignette (`fills`):** `kind: "radial"`, `from: [0.5, 0.5]`, `to: [0.96, 0.5]`, `width: [0.5, 0.96]`, stops at `0.0: #182B52` (lighter centre navy), `0.55: #0F1B33` (`BG`), and `1.0: #060C18` (deep corner navy).
   - **Anti-Banding Dither (`effect.add` + `effect.set`):** `type: "noise"`, `mode: "mono"`, `color: rgba("#1E3460", 0.03)`, `secondary: rgba("#060C18", 0.03)`, `density: 0.20`, `size: 0.5`, `opacity: 0.03`.
2. **Level 1 — Panels (`timeline strip`, `era header`, `active patch panel`, `stress panel`, `capital panel`, `variables panel`, `executing function panel`, `interference panel`, `result panel`):**
   - **Vertical Gradient (`fills`):** `kind: "linear"`, `from: [0.5, 0.0]`, `to: [0.5, 1.0]`, `width: [1.0, 0.0]`, stops at `0.0: #1B2E58`, `0.48: #16264A` (`PANEL`), `1.0: #111E3B`.
   - **Stacked Shadows & Top Highlight (`effects`):**
     - Wide ambient shadow: `dropShadow`, `offset: [0, 16]`, `radius: 40`, `color: rgba("#000000", 0.30)`.
     - Tight contact shadow: `dropShadow`, `offset: [0, 2]`, `radius: 4`, `color: rgba("#000000", 0.35)`.
     - Top 1 px inner highlight: `innerShadow`, `offset: [0, 1]`, `radius: 0.5`, `color: rgba("#F4EAD2", 0.06)`.
   - **Outlines (`strokes`):** Existing `1–2 px` outlines preserved at reduced opacity (`0.42` for `BLUE`, `0.62` for `GOLD`, `0.72` for `RED`). On `CRITICAL` stress frames, `stress pulse` carries `stroke_opacity: 0.55` and a red outer `dropShadow` glow (`offset: [0, 0]`, `radius: 24`, `alpha: 0.30`).
3. **Level 2 — Raised Elements (`era active marker`, `stress badge`, `capital badge`, deployed variable chips, `rho needle hub`, `era log badge`, `rho crash badge`, `rho postpatch badge`, `warning banner`):**
   - **Vertical Gradient Fills:**
     - `era active marker`: `#1D315C → #0D182E` (stroke `GOLD` `1.5 px` at `0.82` opacity).
     - `RED` badges (`CRITICAL`, `AT RISK`, `BLOCKED`): `#EB624A → #CF4932`.
     - `GOLD` badges (`HIGH`, `PEAK`, `STAGNANT`): `#E5B350 → #C6902E`.
     - `BLUE` badges (`MODERATE`, `EXPANDING`, `RESTRUCTURING`, `LOW`, `MINIMAL`): `#6EB6E0 → #4D93BD`.
     - Deployed chips (`highlight=True`): `#323035 → #28282B → #202024` (stroke `GOLD` `1.6 px` at `0.76` opacity).
     - `rho needle hub`: `#ECC05E → #D9A441 → #C68F2C` (stroke `INK` `2 px` at `0.88` opacity).
   - **Stronger Dual Shadow + Accent Glow + Top Highlight (`raised_effects`):**
     - Elevation shadow: `dropShadow`, `offset: [0, 6]`, `radius: 14`, `color: rgba("#000000", 0.46)`.
     - Contact shadow: `dropShadow`, `offset: [0, 2]`, `radius: 4`, `color: rgba("#000000", 0.38)`.
     - Outer accent glow: `dropShadow`, `offset: [0, 0]`, `radius: 18–20`, `color: rgba(accent_hex, 0.35–0.38)`.
     - Top inner highlight: `innerShadow`, `offset: [0, 1]`, `radius: 0.5`, `color: rgba("#FFFFFF", 0.09–0.20)`.
   - Loaded (non-deployed) chips use a recessed dark fill (`#070E1C → #0C172C`), `DIM` stroke at `0.34` opacity, `innerShadow` (`y: 2, blur: 4, alpha: 0.40`), and subtle contact `dropShadow` (`y: 2, blur: 4, alpha: 0.24`) so deployed chips stand out clearly at Level 2.
4. **Wells — Inset Containers (`phi bar track`, `rho dial track`, `active patch console`, `ticker 1..4 bg`, `interference text box`):**
   - **Recessed Darker Fill:** Vertical gradient `#070E1C → #0B1528` (`PANEL_DARK`) on rectangular wells and `#081121` on `rho dial track`.
   - **Inset Effects (`well_effects`):**
     - Recessed inner shadow: `innerShadow`, `offset: [0, 2]`, `radius: 6`, `color: rgba("#000000", 0.45)`.
     - Bottom lip rim light: `dropShadow`, `offset: [0, 1]`, `radius: 0`, `color: rgba("#F4EAD2", 0.04)`.
   - **Outlines:** Reduced stroke opacity (`0.28–0.55`).
5. **Data Glow — Live Readings (`phi bar`, `rho dial`, `rho needle`, `rho needle tip`, `rho threshold`, `rho crash needle`, `rho crash tip`):**
   - Dual-radius luminous `dropShadow` glow (`offset: [0, 0]`, outer `radius: 14–20` at `alpha: 0.42–0.52`, core `radius: 4–6` at `alpha: 0.28–0.35`) in the element's active semantic colour (`GOLD` `#D9A441` or `RED` `#E2573F`).
   - `rho needle` additionally carries a tight contact shadow (`offset: [0, 2]`, `radius: 4`, `rgba("#000000", 0.45)`) beneath its glow.
   - `phi bar` includes a top specular `innerShadow` (`offset: [0, 1]`, `radius: 0.5`, `rgba("#FFFFFF", 0.22)`).
6. **Text Crispness:**
   - Only `era date` carries a faint text `dropShadow` (`offset: [0, 2]`, `radius: 4`, `color: rgba("#000000", 0.24)`).
   - Every other text layer has zero effects, and no `layerBlur`, `backgroundBlur`, or `glass` effect is used on any layer.

### What FigCraft Could / Could Not Do in Round 2

- **Supported Natively:**
  - Path-accurate `innerShadow` and `dropShadow` on donut-sector ellipses (`arcStart`, `arcSweep`, `arcInner`), so both `rho dial track` (inset well) and `rho dial` (glowing sector) render curved shadows and glows along the exact arc geometry.
  - Stroke-accurate `dropShadow` on open SVG `vector` paths (`rho needle`, `rho crash needle`) and glyph-accurate `dropShadow` on `text` (`era date`).
  - Multiple stacked `dropShadow` and `innerShadow` entries per layer, rendered in list order.
- **Nuances & Constraints Observed:**
  - **Perpendicular Handle Requirement on Gradients:** Passing a gradient paint in `fills` without the `"width": [wx, wy]` 2-vector fails validation with ``invalid parameters: `fills` must be paints or colours``. Including `"width": [1.0, 0.0]` on vertical linear gradients and `"width": [0.5, 0.96]` on radial gradients resolves this.
  - **Frame-Level `noise` Composites Over Children:** Attaching `type: "noise"` to a `frame` applies the grain pass after compositing child layers. Using a high-luminance grain color (`#F4EAD2`) creates visible warm dots over dark wells; matching the grain color to the navy palette (`#1E3460` at `alpha: 0.03, density: 0.20`) dithers the 8-bit navy gradient without affecting text contrast or dark well purity.
  - **Linear Gradient Coordinate Mapping on Arc Ellipses:** On partial-arc ellipses (`arcSweep < 360`), gradient coordinates map to the full bounding box of the ellipse, so `rho dial track` and `rho dial` use solid fills (`#081121` and `GOLD`/`RED`) paired with `innerShadow` and `dropShadow` glows.

### Round 2 Session Log

1. **What Was Requested:** Add a three-level depth system (Level 0 radial vignette + optional low noise, Level 1 gradient panels with dual drop shadows + 1 px top inner highlight + lower-opacity outlines, Level 2 raised elements with stronger shadows + 16–24 px accent glows, inset wells with `y: 2, blur: 6, ~45%` black inner shadows and darker fills, and data glows on live readings) to `build_dashboard.py`, rebuild all 7 eras, overwrite `era_<year>.png`, save `yt02_dashboard_depth.figcraft`, and document the values in `NOTES.md`.
2. **How It Was Implemented:** Probed `effect.add`, `effect.set`, and `fills` on a scratch node via `node.get`; added reusable paint and effect builders (`radial_vignette_paint`, `linear_gradient_paint`, `panel_effects`, `raised_effects`, `well_effects`, `data_glow_effects`) to `build_dashboard.py`; rebuilt all 7 frames (`982` command invocations in `5.92s`), saved `yt02_dashboard_depth.figcraft`, and verified all 7 exported `1920×1080` PNGs.
3. **Challenges Encountered:** Identified the required `"width"` handle vector on gradient paints via SVG import round-tripping, and tuned the frame `noise` color from cream (`#F4EAD2`) to navy (`#1E3460`) so post-composite frame dithering leaves dark inset wells clean.
4. **Next Ideas:** (1) Expose angular/conic gradient (`kind: "angular"`) support along `rho dial` sectors; (2) add a `clipToBackground` flag on frame `noise` effects in FigCraft; (3) bind panel shadow elevations to reusable FigCraft `style.create {type: "effect"}` tokens; (4) test `smartAnimate` interpolation of `effects[i].radius` and `effects[i].color` across era transitions; (5) add per-frame thumbnail comparison strips; (6) verify `.fig` round-trip fidelity of `innerShadow` on arc ellipses.

