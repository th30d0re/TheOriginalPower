# YT02 runtime dashboard: handoff pack (Figma to React/SVG)

Source: Figma file `6SPd7rWzwyvxHhIj4Cmb7a`, page `Stage · Dashboard v1` (`194:2`), state after fix pass 3 (author-approved). Nothing in the file was changed to produce this pack. Frames are 1920 x 1080; all numbers are px with the origin at the top-left.

## Files

| File | What it holds |
|---|---|
| `tokens.json` | Every variable (Primitives, Color, Dimension) resolved to hex + alpha + rgba(), CSS custom-property names, and every text style in use with where it is used. |
| `spec.json` | Per instrument (10) and mode (compact, expanded, settings): size, padding, spacing, radius, stroke, fill token, blur, every child with its box relative to the panel, fonts, colour tokens, subscript runs, and the geometry parameters for the dial, phasor plane, q(t) trace, Φ_load bar and RLC schematic. Settings variants share one template plus per-instrument strings. |
| `layout.json` | For the four frames: border, era strip (each tick label, active marker and dot), map clip rect, both stacks and every panel (instrument, mode, x, y, w, h, anchor and growth), bottom strips, dim opacity in the boot frame, z-order. |
| `map.json`, `map_overlay.json`, `build_maps.mjs` | Projection, scale, centre, clip, layer styles, rhumb lines, compass rose, route waypoints and curve recipe, markers, label placement, and the world view. `build_maps.mjs` is the authority (node script using d3-geo, topojson-client, world-atlas); `map_overlay.json` is its numeric output. |
| `svg/` | Figma SVG exports: `border-compact.svg`, `compass-rose.svg`, `era-strip.1486.svg`, `era-strip.empty.svg`, `<instrument>.<mode>.svg` for 10 instruments x 3 modes, plus `map.iberia.svg` and `map.world.svg` (script output: land, borders, graticule, Portugal). |
| `png/` | The four frames at 1x (1920 x 1080), the visual reference: `dash_1486_compact`, `dash_1486_interference_expanded`, `dash_1486_settings`, `dash_world_boot`. |

Instrument slugs: era-clock, system-stress, capital, interference, active-patch, variables, wage-plane, backlash-oscillator, executing-function, policy-ticker. Modes: compact, expanded, settings.

## Things a coder must know

1. **Fonts.** IBM Plex Sans (400, 500, 700, italic 400) for prose and IBM Plex Mono (400, 500) for labels, values, chips, console. Weights and sizes per node are in `spec.json`; the deduplicated list is `tokens.json` `textStyles`.
2. **Alpha-baked colour tokens.** Figma component instances ignore paint-level opacity on variable-bound paints (the main component renders it, an instance renders opacity 1). So every translucent colour is its own token with the alpha inside it (`color/fill/glass`, `color/line/hairline`, `color/text/muted`, and so on). In code use the rgba() value from `tokens.json`; do not combine a solid token with a separate opacity. The only node-level opacity in the design is 0.3 on dimmed panels in the boot frame.
3. **Glass panel recipe (compact).** fill `color/fill/panel-wash` (rgba(91,107,125,0.14)), 1 px inside border `color/line/hairline` (rgba(232,201,155,0.55)), radius 8, `backdrop-filter: blur(6px)` (Figma BACKGROUND_BLUR radius 12; its own SVG export writes blur(6px), which matches the render), padding 8 / 10, no fixed width or height. Expanded and settings cards use `color/fill/glass` (rgba(20,38,58,0.88)), a 1.6 px hairline, radius 10, no blur.
4. **Stroke offsets.** All panel strokes are inside strokes and count toward the padding, so child boxes in `spec.json` start at padding + stroke (10+1 compact, 16+1.6 = 17.6 expanded). Box x/y are relative to the panel's outer top-left.
5. **Subscripts were faked.** The Figma API has no baseline shift, so each subscript is a separate text node (70% size, explicit line height = 0.8 x its size) in a bottom-aligned row beside the base word, with word gaps from item spacing, not spaces. `spec.json` `richText` documents the recipe and gives the pixel box of every run; in React use `<sub>` (font-size .7em, relative top ~ .2em) and compare against those boxes. Subscripts: ρ_τ, Φ_load, ψ_m, ψ_s, jψ_s, O_racialized. In settings strings they appear as `_{...}`. Underscores in file and field names (`dashboard_eras.json`, `fields.system_stress`) are literal text.
6. **SVG exports.** Every export starts with a `<rect fill="#F5F5F5">` backdrop (the Figma canvas) that must be dropped. Text is outlined into paths (no `<text>`), so use `spec.json` for live text; the SVGs are for shapes, glass panels (`foreignObject` backdrop blur) and visual comparison. Expanded and settings SVGs are large (up to 300 KB) because of outlined text.
7. **Border.** `Frame/Border 16:9 · compact` (`232:163`): outer line 20 px inside the frame edge, stroke `stroke/chart` (1.6) in `color/line/wire`, corner clusters at 60%, edge symbols at 70%, no centre ornaments; it is drawn on top of everything. `svg/border-compact.svg` is the geometry. The spec border `Frame/Border 16:9` (`3:119`, 74 px inset) is for the cards and is not used here.
8. **Map.** Clip frame 1856 x 968 at (32, 84): equirectangular, 19.5 px/deg, centre lon 8 / lat 24.2, translate (928, 484). Route is a Catmull-Rom spline (tension 0.4) through the listed offshore waypoints, 0 land hits. The map is drawn from `build_maps.mjs`; rerun it rather than tracing the SVG if the framing changes. The boot frame uses Natural Earth 1 (110m).
9. **Dial, plane and trace are parametric.** Dial value to angle: `theta = PI*(1 + v/1.2)` (clockwise from +x, y down). Wage plane: screen x = ψ_s, screen y = ψ_m (down +), extraction points up, W = jψ_s = 60 units, τ zone from M = M0 − a·ψ_m − b·ψ_s with M0 60, τ 40, a 1, b 0.7. q(t) = exp(−αt)·sin(ω_d t) with ζ 0.17, ω_n 0.30 rad/yr, T 78.43 yr. Formulas, padding and stroke widths are in `spec.json`.
10. **Content is verbatim** from `Architecting_the_operation/video/yt02/dashboard_eras.json` (log 2, 1486) and the existing runtime-dashboard frames; source lines and units lines in the settings cards are authored wording (see `spec.json` settings content).

## Not exported

- No SVG of the four full frames (PNG references only; assemble the frames from the components using `layout.json`).
- Text in all SVG exports is outlined, not live (see note 6).
- The map layers inside the Iberia and World map components were not exported from Figma as one SVG; `svg/map.iberia.svg` and `svg/map.world.svg` are the script outputs that were imported into Figma, and the overlays (rhumb lines, route, rose, markers) are specified in `map.json` and `map_overlay.json`.
- No Figma text styles exist (type is set per node), and no Figma effect styles; the blur and strokes are described in `spec.json`.
