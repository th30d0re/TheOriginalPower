# YT02 runtime dashboard v1 (Figma build report)

File `6SPd7rWzwyvxHhIj4Cmb7a`. Page `Stage · Dashboard v1`, id `194:2`. Nothing on other pages was edited. Nothing committed.

## Node ids

Frames (1920x1080, y = 0 on the page):

| Frame | id | x |
|---|---|---|
| `dash 1486 · compact` | `207:20` | 0 |
| `dash 1486 · interference expanded` | `207:222` | 2120 |
| `dash 1486 · settings` | `207:453` | 4240 |
| `dash world · boot` | `207:672` | 6360 |

Component sets (variant property `mode` = `compact | expanded | settings`, except the era strip):

| Set | id |
|---|---|
| Era strip (`state` = `1486 | empty`) | `198:76` |
| Instrument/Era clock | `198:136` |
| Instrument/System Stress | `198:163` |
| Instrument/Capital | `198:190` |
| Instrument/Interference | `200:80` |
| Instrument/Active Patch | `199:46` |
| Instrument/Variables | `199:86` |
| Instrument/Wage plane | `202:95` |
| Instrument/Backlash oscillator | `206:80` |
| Instrument/Executing Function | `199:110` |
| Instrument/Policy ticker | `199:144` |

Other components: `Map/Iberia · West Africa` `195:22`, `Map/World` `196:11`, `Dashboard/Border` `197:2`.

## Map script

`/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/figma_map/build_maps.mjs`
Outputs in the same folder: `map_iberia_westafrica.svg`, `map_world.svg`, `map_overlay.json` (route, rhumb hubs, compass rose, named points in map pixels).
Uses d3-geo, topojson-client and world-atlas from `scriptCast-stage/video/node_modules`. Iberia map: equirectangular, 16.05 px/deg, centred on lon -7.5 / lat 26.5, visible lon about -43..28, lat 5..48 (Elmina keeps a 15 px margin). World map: Natural Earth 1, 110m atlas. SVG layers are named `graticule`, `land`, `borders`, `country 620 Portugal`. Rhumb lines (4 hubs x 16 lines), the compass rose, the route (spline through the four named points plus offshore waypoints) and the markers are Figma vectors inside `Map/Iberia · West Africa`.

## Screenshots

`Architecting_the_operation/video/yt02/logs/stage_dashboard/`: `dash_1486_compact.png`, `dash_1486_interference_expanded.png`, `dash_1486_settings.png`, `dash_world_boot.png`.

## Decisions

- Layout: inner content box x 76..1844. Rails 280 wide, map 1180x720 at (370,140), era strip at y 76, bottom row at y 874 (function 860 wide, policy 894 wide). Rails and the bottom row are auto-layout; rails use space-between.
- Border: new `Dashboard/Border` built from instances of `Circuit/Resistor`, `Circuit/Capacitor`, `Circuit/Coil` (0.55 scale) joined by auto-layout wire segments. The existing `Frame/Border 16:9` was not reused because its 74 px inset leaves too little room for the rails.
- Overlay cards (interference expanded, wage plane settings) sit at the map's lower right. The compact instance stays in its rail as the hover origin.
- Wage plane: artifact geometry (down = +psi_m, right = +psi_s, tau zone M0 60, tau 40, a 1, b 0.7). W = j psi_s, magnitude 60 for log 2 (pure status, theta 90 deg). Hatch lines are clipped analytically and drawn as vectors.
- Backlash oscillator uses the 1865 fitted shock (zeta 0.17, omega_n 0.30) for q(t). No log 2 value exists for it.
- Interference needle sits at the range midpoint 0.775, as in the artifact.
- Fonts: IBM Plex Sans for prose, IBM Plex Mono for labels, values, console and chips.
- Instruments dimmed in the boot frame with node opacity 0.3 on each instance. The era strip uses the `empty` variant (ruler only).
- Compact variants shown in the frames: stress, capital, patch, variables, wage plane, backlash, interference, era clock. Compact content differs from the expanded view where the brief says so (variables show symbols E, O_racialized, I; stress and capital show short labels).

## Where the brief did not match what the file does

1. Fonts: the existing page `YT02 · Runtime dashboard` uses Inter and Courier Prime. The brief asks for IBM Plex Sans and Mono, which are installed; I followed the brief.
2. Paint opacity on variable-bound paints is dropped by component instances (the master renders it, the instance renders opacity 1). A first compose showed solid red and gold blocks where badges and chips should be. I added 16 semantic tokens with baked alpha to the `Color` collection (explicit scopes, no new primitives): `color/fill/glass`, `color/fill/gold-wash`, `color/fill/red-wash`, `color/fill/red-faint`, `color/fill/rose`, `color/fill/divider`, `color/line/hairline`, `color/line/hairline-strong`, `color/line/graticule`, `color/line/border`, `color/line/hatch`, `color/line/chart-faint`, `color/line/accent-soft`, `color/text/muted`, `color/text/soft`, `color/text/faint`. The brief allowed one more token; the opacity problem needed these. Every paint in the components was rebound to them.
3. Palette: the Backlash artifact uses green for L. The file has no green, so L uses `color/marker/sexuality` (cyan).
4. Portugal (ISO 620) in the 50m atlas includes the Azores and Madeira, so the gold fill also colours those islands.
5. Era clock compact is 280x167, not 120 tall, and the executing function and policy compact variants are 860 and 894 wide (bottom rail). Expanded heights run 130..552, settings 303..387.
6. Settings content: the brief says "source line, units and the log text verbatim". Log text and the wage source line (`W = ψ_m + jψ_s · Log 2 · ordinal`) are verbatim from `dashboard_eras.json` and the existing frames. The source lines of the other instruments (`Runtime Log 2 · ch:portugal · dashboard_eras.json › field`) and every units line are my wording. The Backlash settings log text is the artifact's lede (no log 2 text exists for it).
7. The Backlash oscillator is not in the brief's frame placement list. I placed it at the bottom of the left rail to fill the space. The right rail has large gaps (three panels, space-between).
8. No text styles were created (all type is set per node, colours and strokes are bound to variables). Spacing variables bind panel padding and gaps where the value matches (8, 16, 24); odd paddings (4, 10) are literal because no tokens exist.
9. The SVG script was re-run after the first upload (graticule rebuilt so parallels end on the sphere edge). The world SVG in Figma is the re-run version; the Iberia SVG in Figma is from the first run (visually identical in frame).

## Fix pass 1

Screenshots in `logs/stage_dashboard/` were re-taken to the same four paths. Fonts and the opacity tokens were not touched.

### 1. Subscripts

The Plugin API has no baseline-shift or setter for OpenType sub features (`openTypeFeatures` is read-only), so a per-range size change cannot lower the baseline. Each affected text node was replaced by a hugging auto-layout row (wrapping when the original was a fill-width paragraph): base words as normal text, and each subscript as its own text node at 70% size with a reduced line height, bottom-aligned so its baseline sits lower than the base. Words are separated by item spacing (0.26 em sans, 0.6 em mono) because Figma trims trailing spaces. Fill variables, names and layout sizing were carried over.

Replaced in the component masters (17 text nodes, so every instance and all four frames follow): `ρ_τ` (compact readout), `ρ_τ = M(t)/τ`, `Φ_load` (row head), `Interference State (Φ_load, proximity to τ)` label, the interference log words (expanded and settings, including `ρ_τ=M(t)/τ`), the interference units line, `O_racialized` chip, `The Out-group (O_racialized)` chip, the variables settings log text, `W = jψ_s`, the wage axis labels `ψ_s (+) · 90°`, `ψ_m (+) · 6 o’clock`, `ψ_m (−) · 12 o’clock`, `W = ψ_m + jψ_s · Log 2 · ordinal` (expanded and settings), and the wage units line (`ψ_m, ψ_s`). `I_buffer` does not occur anywhere in the 1486 content.

Left as plain underscores on purpose (8 nodes): the settings source lines (`dashboard_eras.json › fields.system_stress`, `fields.capital`, `fields.active_patch`, `fields.variables_deployed`, `fields.executing_function`, `fields.results`, `fields.interference_state`, `title`). These are file and field identifiers, not math symbols. A sub-token rule limited to Greek symbols and single capital letters (O, I, E, W, F) decides what becomes a subscript, so identifiers are never converted. Limit: the `racialized` subscript in the compact chip is 8 px, small but legible at 1920.

### 2. Route

`build_maps.mjs` now routes by sea with the same projection (equirectangular, 16.05 px/deg, centre lon -7.5 / lat 26.5): Lisbon marker, Tagus mouth (-9.30, 38.64), Lisbon offshore (-9.6, 38.6), off Cape St Vincent (-9.5, 36.8), off Cape Cantin (-10.5, 32.5), Cape Bojador offshore (-15.2, 26.1), Cape Blanc (-17.5, 20.8), Cape Verde offshore (-18.0, 14.7), four offshore points round the Guinea / Sierra Leone bulge (-17.8, 11.2), (-15.8, 8.8), (-13.8, 7.0), (-11.6, 5.1), then (-9.4, 4.4), Cape Palmas (-7.9, 4.2), (-5.0, 4.3), (-2.6, 4.35), Elmina offshore (-1.35, 4.8). I added the Tagus mouth, the bulge points and the three Gulf of Guinea points to keep the spline off land; I raised three of them from lat 3.8-4.0 to 4.3-4.4 so the line stays inside the map frame (bottom edge is lat 4.07). The script samples the spline 40 times per segment against the 50m land polygon: 0 land hits. The vectors `route Lisbon to Gulf of Guinea` and `route dashes` in `Map/Iberia · West Africa` were replaced; the Bojador, Cape Verde and Elmina markers are unchanged on the coast. Cape Palmas to Elmina runs close to the bottom edge of the map frame.

### 3. Rails

Backlash oscillator compact moved from the left to the right rail in all four frames. Left rail: era clock, system stress, capital, interference. Right rail: active patch, variables, wage plane, backlash oscillator. Both rails are 720 high with a 14 px gap. Each panel is its natural height plus an equal share of the leftover (+38.8 px left, +44.3 px right), with content centred, so there are no empty bands. Panel heights: left 206 / 132 / 132 / 209, right 137 / 128 / 227 / 185. Those heights are fixed overrides on the instances; the components themselves are unchanged.

## Fix pass 2

Screenshots re-taken to the same four paths and viewed. Page ids unchanged. The scratchpad folder was wiped between passes, so `figma_map/build_maps.mjs` was recreated from the final script (same path; the `.svg` and `map_overlay.json` outputs were regenerated).

### 1. Border

All four frames use an instance of the spec component `Frame/Border 16:9` (`3:119`, Frames page), placed at 0,0 on top of the content and unmodified. `Dashboard/Border` (`197:2`) and its instances were deleted. The spec geometry fixes the inner area: wire at 74 from every edge, corner coil clusters down to y 175 at the left and right, and centre decorations that reach y 134 at the top and start at y 946 at the bottom (x 810..1110). Layout works around them:
- Era strip narrowed from 1768 to 1660 wide (x 130..1790, y 138..178) so it clears the corner coils and sits under the top centre decoration. The ruler ticks and the lit marker were regenerated for 1660.
- Panels sit 16 px inside the border (x 90 and 1830); the bottom strips end at y 984 (above the bottom capacitors) and sit inside the corner clusters (x 130 and 1790).

### 2. Compact variants (all HUG/HUG, no fixed heights, no per-instance overrides)

Padding 10 horizontal / 8 vertical, item spacing 2..6, label 11 px mono, fill `color/fill/panel-wash`, 1 px `color/line/hairline` stroke, corner radius 8, background blur 12 (the API accepted it). Measured sizes (w x h):

| Instrument | Measured | Brief target |
|---|---|---|
| Era clock | 281 x 89 | ~220 x 84 |
| System Stress | 113 x 62 | ~180 x 52 |
| Capital | 118 x 62 | ~180 x 52 |
| Interference | 163 x 97 | ~200 x 100 |
| Active Patch | 211 x 60 | ~240 x 48 |
| Variables | 153 x 56 | ~240 x 52 |
| Wage plane | 187 x 120 | ~200 x 100 |
| Backlash oscillator | 202 x 88 | ~200 x 84 |
| Executing Function (strip) | 554 x 39 | one line ~40 tall |
| Policy ticker (strip) | 707 x 36 | one line ~40 tall |

Over target: Era clock is wider because the place name and the log chip share one line (`LISBON, PORTUGAL` + `RUNTIME LOG 2 · Ch 3`) and the chip text is fixed. System Stress and Capital are 6..10 px taller than 52 because the 8 px vertical padding plus an 11 px label plus a 14 px badge needs 62. Wage plane is 20 px taller than 100 because the 84 px thumbnail plus label plus padding needs 120. Under target elsewhere because hugging removes the empty space.
The `O_racialized` chip subscript is 8 px.

### 3. Map first

Map component `Map/Iberia · West Africa` is `228:1211` (1772 x 824); `Map/World` is `226:934` (same size). In every frame the map instance is at x 74, y 182, w 1772, h 824: bounds 74..1846 by 182..1006, the whole area inside the border below the era strip. The first attempt at 1772 x 880 collided with the strip and the spec centre decoration, so the maps were regenerated at 1772 x 824.
- Iberia framing: equirectangular, 19.5 px/deg, centred lon 8 / lat 21.2, so the frame covers lon about -38..54 and lat about -0.1..42.3. Portugal, the whole route and its labels sit clear of every panel; the open Atlantic with the compass rose is under the left stack and the Levant under the right stack. Route: 0 land hits against the 50m polygon.
- Left stack (era clock, stress, capital, interference) at x 90, y 190, 8 px gaps, 281 x 334. Right stack (active patch, variables, wage plane, backlash) top-aligned at y 190, right-aligned to x 1830, 8 px gaps, 211 x 348. Executing function bottom-left (x 130, y 945, 554 x 39), policy ticker bottom-right (x 1083, y 948, 707 x 36). Each stack hugs its contents; the per-instance fixed heights from fix pass 1 are gone.

### 4. Expanded and settings

Expanded and settings variants keep their sizes (640 x 475 and 560 x 324). In frame 2 the expanded Interference card is the fourth child of the left stack in place of its compact instance (anchored at 90, 427, grows right and down). In frame 3 the Wage plane settings card is the third child of the right stack, right-aligned (anchored at the compact position's right edge, grows left). Other panels in each stack hug and stay put. Boot frame: all ten instruments at opacity 0.3, era strip in the `empty` variant, world map.

### Deviations to know

- The brief's era clock, stress, capital, variables and wage plane targets are not all met (table above); the 8 px / 10 px padding and 11 px label spec plus content size set the minimum.
- Panels over the map rely on `color/fill/panel-wash` (14% alpha) plus the 12 px blur for legibility; the blur renders ghosted map linework behind some panels.
- The expanded Interference card covers the Cape Bojador and Cape Verde labels and part of the route in frame 2, and the settings card covers part of the Middle East in frame 3 (both are overlays).

## Fix pass 3

Screenshots re-taken to the same four paths and viewed (all four frames).

### 1. Compact border

New component `Frame/Border 16:9 · compact`, id `232:163`, on the Frames page at (2100, 1300), 1920 x 1080. The spec border `Frame/Border 16:9` (`3:119`) is untouched. The compact one is a clone of the spec's own symbol vectors, re-laid out:
- Outer line inset 20 px (top y 20, bottom y 1060, left x 20, right x 1900; spec was 74).
- Corner coil/ground clusters uniformly rescaled to 60% about their corner (they stay within about x 2..44, y 2..90 at the top-left, mirrored at the other corners).
- Edge resistors, capacitors, coils, arrows and junctions at 70%, spaced along the new line lengths; wires rebuilt as continuous vectors between symbols.
- Both centre ornaments (top and bottom five-tier stacks) and the hidden old right column removed; the top and bottom lines run straight, with a coil each side of the centre.
- All 68 stroked vectors bound to `stroke/chart` (1.6) for weight and `color/line/wire` for colour (spec uses stroke/wire 3.2).
Uniform rescale was needed: resizing groups with rotated children (the vertical coils, resistors, capacitors) distorted them in the first attempt (`231:163`, deleted). All four frames use an instance of `232:163`.

### 2. Edge layout

- Era strip: 1800 wide (x 60..1860), y 38..78, just inside the top line (variants rebuilt for 1800: ruler ticks and the lit marker regenerated).
- Left stack at x 36, y 96 (281 x 334); right stack right edge at x 1882, y 96 (211 x 348). The y 96 start clears the corner clusters. Both stacks stay top-aligned with 8 px gaps.
- Bottom strips: executing function at x 60, y 1005 (554 x 39); policy ticker at x 1153..1860, y 1008 (707 x 36); both end at y 1044, above the bottom symbols (which start at y 1048).
- Map clip frame: x 32..1888, y 84..1052 (1856 x 968), 12 px inside the left and right lines and 8 px above the bottom line, so land never touches the border line. Map component `Map/Iberia · West Africa` `233:1204`, `Map/World` `233:1205`.

### 3. Map

- View centre lon 8, lat 24.2 (was lat 21.2), 19.5 px/deg, so the frame covers lon about -39.6..55.6 and lat about -0.6..49.0. Portugal and the LISBON label sit below the era strip with the Pyrenees, France and the Alps now visible.
- Compass rose moved to lon -33 / lat 21 (x 128, y 546 in the map frame): open Atlantic, clear of the Cape Verde islands, the Canaries, Madeira and the route.
- Route unchanged in lon/lat; re-run of the land check (spline sampled 40 points per segment against the 50m land polygon): 0 land hits. Labels: Lisbon, Cape Bojador and Cape Verde sit right of the left stack (x 337+ vs stack edge 317); Elmina clear of both bottom strips.
- Boot frame dimmed as before (opacity 0.3); expanded Interference (frame 2) and Wage plane settings (frame 3) cards in place as before.
