# Dashboard fix pass 1

## Flicker investigation and render path

The author's concurrent render showed alternating empty blurred right panels and bottom strips. The inspected source had `useState` in `Dashboard` and `Instrument`. `onInteractiveModeChange` was called exclusively by hover, leave and settings events behind `clock.interactive`; the inspected files contained no layout effects. Consequently the proposed effect-driven layout race is unsupported by the source inspection. The precise browser root cause remains unconfirmed because Chromium rendering belongs to the orchestrator.

The concrete rendering hazards were backdrop-filtered compact cards inside clipped, positioned sections and three mounted mode layers per instrument. Inactive layers retained their full expanded/settings dimensions. Those conditions are consistent with a compositing fault; this is a diagnosis to test against the original pixels.

Changes remove these hazards from the non-interactive path:

- `Dashboard` selects a separate `InteractiveDashboard` only for an interactive clock. The frame component computes rail positions directly from layout coordinates, spec dimensions, forced modes and `resolveMode` weights.
- `Instrument` selects a separate interactive wrapper for its override state. The frame component uses the clock and numeric props. Mode layers with zero weight are omitted.
- Rendered `PanelContent` uses the authored translucent fill and hairline with both backdrop-filter properties set to `none`. Interactive compact panels retain the 6 px backdrop blur. This deliberately changes rendered glass softness to remove reliance on backdrop compositing.
- Every compact anchor uses the spec dimensions. Stack gaps and outer alignment come from `layout.json`.

`check_dashboard.mjs` launches two fresh Node processes, each loading a new bundled module graph and rendering 15 states through `react-dom/server`. It compares the actual markup for all four right panels and both strips, plus hashes of the full Dashboard. The states cover the four reference times, flight and mode-transition boundaries, and the expanded wage plane. Runtime traps reject `useState`, `useReducer`, `useEffect` and `useLayoutEffect`; positive-control components prove each trap throws. All tested non-interactive renders pass. These checks establish markup determinism. The orchestrator must verify the original alternating-pixel symptom with a concurrent render before the flicker diagnosis can be closed.

## Equal Earth and framing

Both world and Iberia now use `geoEqualEarth`. The world and moving regional views share one MapStage and the 50m atlas, so the flight has continuous projection and geometry. Camera zoom is a world-scale multiplier. `flyTo` retains its existing implementation; the episode now supplies correctly scaled endpoints. A 10 ms sampling check confirms monotonically increasing projection scale throughout the 6,200–8,400 ms flight. The previous projection crossfade is removed.

`MapFit.extent` accepts the requested geographic box, contains it with a uniform scale, and maps the requested centre to the clip centre. The Iberia input is centre [8, 24.2], extent [[−39.6, −0.6], [55.6, 49]]. Equal Earth's aspect ratio makes the exact old rectangular framing incompatible with this full latitude span at 1856 × 968. The implemented fit preserves the projection's proportions and contains the supplied extent. Actual midpoint bounds are longitude −57.8603…73.8603 at latitude 24.2, and latitude −0.6…52.2940 along the clip's vertical midline. This is a framing departure requiring author review.

All 17 waypoints are unchanged. The spline is reprojected before its control points are computed. Sampling the projected cubic curves, inverting each point, and testing against the 50m land geometry produces **0 land hits in 1,296 samples**. Label offsets are explicit relative to the reprojected markers. Lisbon and the other labels clear the compact rails, era strip and bottom strips. The compass remains at [−33, 21] in open Atlantic. Its projected centre is [345.259, 544.793] in map-local pixels. Rhumb hubs are reprojected from their original geographic coordinates.

`review/map-geometry-fix1.json` records the projection scale, camera, all waypoints, spline, labels, rhumb hubs, compass and measured bounds. The original handoff map files remain the reference for the prior approved equirectangular design.

## Coastlines and polity hook

Both views omit the internal-country-border layer. The engraved land silhouette supplies the coastline. Portugal retains its highlight and outline as requested.

`DashboardMap.polities` accepts a GeoJSON FeatureCollection. Each feature's properties may contain `style: {fill, stroke, strokeWidth, opacity}` and `label: {text, at: [longitude, latitude], color}`. The layer is drawn after land and Portugal, before the route. The check supplies a synthetic feature and verifies its style, label and layer order. Production polity data remains absent.

## Compact Interference

The existing dial and range remain in place. The added compact load row uses a real subscript, the range [0.10, 0.20], a 0–1 track and an orange pill with the same token styling as the expanded bar. The pill reads the log's `phi_load` range. Width remains 163 px; height grows from 96.8 to 142.8 px. The additional 46 px accommodates label, bar, endpoints and padding. Rail calculations read the new dimensions from `spec.json`.

## Expanded Complex Wage Plane

Read the supplied local HTML artifact's `buildStatic`, `clipDanger`, `elite`, dynamic drawing and readout code as source data. `dashboard/ComplexWagePlane.tsx` ports the drawing into deterministic React SVG. It includes the 420 px square plane, bronze grid, dashed clock with ticks and labels, rotated axes with real subscripts, red extraction arrow, green material arrow, clipped danger polygon and hatch, τ boundary, safe/unsafe magnitude arc, elite diamond, ideal dot, orange vector with an explicit SVG glow region, angle arc, origin and quadrant labels.

The 960 × 650 px card grows left/down to [922, 228] and ends at y = 878. The following oscillator restacks to y = 886 and ends at y = 974, inside the map clip. Readouts sit beside the plane, and the legend runs underneath. The artifact palette is preserved; installed IBM Plex fonts supply text. The artifact's handwritten font is represented by IBM Plex Sans to use the installed font set.

Model: M₀ = 60, τ = 40, a = 1, b = 0.7, status ceiling = 80. Log 2 supplies material 0 and status 60: θ = 90°, |W| = 60, clock 3:00, QI · Joint wage under the artifact's axis convention, M = 18, margin 22 below τ. Elite coordinates are status 80, material −36. The gauge preserves the artifact's 0–150 scale with a τ marker at 40. Compact and settings content retain their existing definitions.

`review/states.json` retains 500, 13000, 16000 and 21000 ms; cue times are unchanged. `review/stage_plan_wage-expanded.json` supplies an additional orchestrator inspection: render at 13000 ms with the expanded wage plane forced in R-02. The main review plan retains its original four-state sequence.

## Engine changes

Only these engine source files changed:

1. `video/src/stage/Instrument.tsx`: separate interactive state wrapper; pure numeric frame component; omit zero-weight mode layers. This removes state hooks and oversized inactive layers from rendered instruments.
2. `video/src/stage/MapStage.tsx`: add `equalEarth`; add optional uniformly scaled geographic fit extent and memo dependencies; export `useProjection` for projected GeoJSON polity paths; document extent/aspect semantics. Existing projection and fit modes retain their previous behaviour.

No packages were installed. Git and Chromium commands were omitted under the task's explicit restrictions. Site output and all reports stay inside the episode directory. The session log is local because the permitted scope excludes the vault.

## Validation

### Episode TypeScript

Exit 0.

```text
exit 0; no diagnostics
```

### Engine TypeScript and check-stage

Exit 0.

```text
> scriptcast-video@0.2.0 check-stage
> node scripts/run-check-stage.mjs

PASS: motion/fly-to, springs, cues, instrument growth, four map projections + fit, and MathText parsing.
```

### Dashboard geometry, structure and fresh-process determinism

Exit 0.

```text
PASS: 15 frames rendered twice in fresh Node processes; identical right-stack and strip markup / whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits; monotonic flight; label clearance; 14 deterministic timeline states; all 30 instrument modes; 420 px wage plane, model and rail bounds; polity layer.
```

### Plan compiler

Exit 0.

```text
wrote /Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json
```

### Render dry-run

Exit 0.

```text
STAGE_EPISODE_DIR=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Site build

Exit 0.

```text
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/assets/index-CY3r-dUZ.css                                       15.81 kB │ gzip:   2.09 kB
../../../TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/site-dist/assets/index-B0xUeI4h.js                                     1,299.86 kB │ gzip: 403.34 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 981ms
```

The engine check retains its legacy “four map projections” summary. The episode check exercises Equal Earth and the new extent fit directly. Vite reports the existing large-chunk warning for the bundled atlas and episode data. Browser pixel stability, text appearance, hover behaviour and revised framing remain assigned to the orchestrator.
