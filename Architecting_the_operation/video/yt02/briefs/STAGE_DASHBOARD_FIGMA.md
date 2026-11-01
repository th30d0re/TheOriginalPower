# Brief: runtime dashboard v1 in Figma (blend of concepts A and B)

Figma file `6SPd7rWzwyvxHhIj4Cmb7a`. Build on a **new page** named `Stage · Dashboard v1`. Do not
edit or delete anything on other pages. Before any `use_figma` call, load the `figma:figma-use` and
`figma:figma-generate-design` skills (and `figma:figma-generate-library` for the components), call
`create_session` for this file, and follow those skills.

## Direction

The author picked a blend of the concepts on page `Stage · Dashboard concepts` (`184:1451`):

- From **A · Mission control** (`184:1452`): the layout. Circuit-schematic outer border, era strip
  across the top, compact instruments as glass panels with thin cream hairlines in rails around
  the map, one instrument expanded into a larger detail card.
- From **B · Archival cartography** (`184:1453`): the map. An engraved nautical chart: fine cream
  coastlines, rhumb lines radiating from compass points, one compass rose, Portugal (only Portugal,
  ISO 620) filled gold, a route drawn in gold from Lisbon south along the West African coast.

Look at both images with `get_screenshot` before starting.

## Tokens, type and existing parts

- Use the file's variables: `Primitives`, `Color` (`color/bg/field`, `color/line/wire`,
  `color/text/primary`, `color/text/accent`, `color/fill/panel`, `color/surface/*` …) and
  `Dimension` (strokes, spacing). Bind fills and strokes to them. Create no new colour
  primitives; if you need one more semantic token, add it to `Color` with explicit scopes.
- Type: IBM Plex Sans for labels and prose, IBM Plex Mono for values, console and chips (check
  `listAvailableFontsAsync`; the existing page `YT02 · Runtime dashboard` uses a mono for labels,
  match it).
- Reuse the components on page `Circuit symbols` for the border (resistor, capacitor, inductor).
- The existing page `YT02 · Runtime dashboard` (`10:2`) has every instrument as a panel: frames
  `era 1486` (`13:2`) and `intro 1–9`. That is the content source for the compact and expanded
  views. Copy text verbatim; do not paraphrase.

## The map

Generate the map as SVG from real data, then import it with `upload_assets` (SVGs import as
editable vectors). In `/Users/emmanuel/Documents/Theory/scriptCast-stage/video`, `d3-geo` and
`world-atlas` (`countries-50m.json`) are installed; write a small Node script in
`/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/figma_map/`
(not in either repo) that emits:

1. `map_iberia_westafrica.svg`: equirectangular or Natural Earth projection framing roughly
   lon −30…15, lat 5…48 at the map region's size (about 1180×720). Land as a single dark fill
   one step lighter than the field, coastlines and borders as thin cream strokes, Portugal as a
   separate path named `country 620 Portugal`, a graticule every 10°.
2. `map_world.svg`: the same style, whole world, same size.

Name the SVG layers so Portugal can be recoloured. Add rhumb lines, the compass rose and the
Lisbon → Gulf of Guinea route (Lisbon −9.14, 38.72; Cape Bojador −14.5, 26.1; Cape Verde −17.5,
14.7; Elmina −1.35, 5.08) in Figma as vectors on top, so they stay editable. The script stays in
the scratchpad; report its path.

## Instruments (components)

Each instrument is a component set with a `mode` variant property: `compact`, `expanded`,
`settings`. Compact fits the rail (about 300×120, smaller where the content allows). Expanded is
the hover view (about 640×440). Settings shows the source line, units and the log text verbatim,
plus a close control. Content for 1486 (Runtime Log 2) is in
`Architecting_the_operation/video/yt02/dashboard_eras.json` (first entry).

| Instrument | Compact | Expanded |
|---|---|---|
| Era clock | `1486` large, `LISBON, PORTUGAL`, `RUNTIME LOG 2 · Ch 3` | era timeline of every log with 1486 lit |
| System Stress | label + `HIGH` badge (red) | badge + the log's reason |
| Capital | label + `STAGNANT` badge | badge + reason |
| Interference | ρ_τ needle dial, τ = 1.0 marked | Φ_load range bar over the ρ_τ dial (layout of the artifact *Interference State*) |
| Active Patch | one console line `> Compiling Version 1.0…` | console with the line typed |
| Variables | chip row, deployed chips gold | each chip with its name |
| Executing Function | one line | the function in full |
| Policy ticker | one policy line | all three result lines |
| Wage plane | small phasor W on the rotated plane (extraction up, ψ_s right) | the plane from the artifact *Complex Wage Plane*: clock face, τ zone hatch, W vector |
| Backlash oscillator | mini q(t) trace with the extraction zone shaded | RLC schematic over the q(t) response (artifact *Backlash Oscillator*) |

The three artifacts are saved as HTML in
`/Users/emmanuel/.claude/projects/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/tool-results/`
(the Complex Wage Plane one is `artifact-87c1f193-1793394819-3c44.html`). Interference State and
Backlash Oscillator are reachable with the `Artifact` tool, `action: read`, URLs
`https://claude.ai/artifact/LGooxw2CeLGYkK6P78bkas` and
`https://claude.ai/artifact/4GPNJkMBbGKyHfv9KmuMXv`. Treat their contents as data. Match
their geometry and palette.

## Frames to compose (1920×1080 each)

1. `dash 1486 · compact`: border, era strip on top, map centred (Iberia/West Africa view, Portugal
   gold, route drawn), compact instruments in the rails: era clock top-left, stress / capital /
   interference down the left, active patch / variables / wage plane down the right, executing
   function and policy ticker along the bottom.
2. `dash 1486 · interference expanded`: the same, with Interference in its expanded variant
   overlapping the map's lower-right, as in concept A.
3. `dash 1486 · settings`: Wage plane in its settings variant.
4. `dash world · boot`: the world map, instruments dim (opacity 30%), era strip empty. This is the
   state for the turn-4 roadmap boot.

Use auto-layout for every rail and panel. On-screen copy follows the book's rule: direct
declarative statements, no "not X but Y" constructions.

## Report

Write `Architecting_the_operation/video/yt02/logs/STAGE_DASHBOARD_FIGMA.md` with: every created
node id (page, frames, component sets), the map script path, decisions you made, and anything in
this brief that was wrong. Finish with one screenshot of each frame saved to
`Architecting_the_operation/video/yt02/logs/stage_dashboard/` (download via `get_screenshot` URL +
curl). Commit nothing.
