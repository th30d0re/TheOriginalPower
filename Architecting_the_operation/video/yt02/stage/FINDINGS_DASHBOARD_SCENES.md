# YT02 dashboard scenes

## Implementation

The episode exports `DashboardBoot` and `Dashboard1486` through `index.ts`. The dashboard assembles the compact border, era strip, engraved map, ten instruments, and bottom strips using the handoff coordinates. Each instrument has its own module under `dashboard/instruments/`; the shared `PanelContent` renderer reads the authored child boxes, fonts, colours, frames, rich-text runs, and settings template directly from `handoff/spec.json`.

`tools/gen_tokens.mjs` generates `tokens.ts` from the resolved colour and dimension tokens. `tools/svg_to_tsx.mjs` generates the inline `CompactBorder.tsx`, removes the canvas backdrop, removes repeated SVG IDs, and maps the wire paint to the semantic token. Both generators and outputs are present. Run each with Node from any directory.

The graphics implement the dial annulus, range, midpoint needle, threshold and ticks; the load bar; the wage plane, hatch, axes, clock face, vector and magnitude circle; the damped response with interpolated zero crossings; and the RLC vectors. The dial and bar read log 2 ranges from `dashboard_eras.json`. Other displayed copy and graphic parameters come directly from the frozen spec. Rich-text base/subscript groups use `MathText`; identifier underscores remain ordinary text. The dashboard applies the handoff's relative subscript baseline adjustment.

The map uses the 50m atlas for Iberia and the 110m atlas for boot. Projection, fit, clip, graticules, coastlines, country borders, Portugal highlight, rhumb hubs, compass rose, route, dashes, and coastal labels are live SVG. The waypoint and control-point check uses `map_overlay.json` as its numeric reference.

`Dashboard` accepts era, camera, route progress, dim opacity, per-instrument lights, forced modes, and mode timelines. The frozen content supports log 2; an unsupported log produces an explicit error. `Dashboard1486` accepts optional absolute camera keys through shot props. Its camera zoom values represent pixels per degree and feed `MapStage.fit`. Instrument timelines use absolute milliseconds. Cue names are `expand:<slug>`, `collapse:<slug>`, and `settings:<slug>`. Boot lighting uses `i1` through `i10` in left-stack, right-stack, bottom-strip order.

Stack positions interpolate with instrument heights. Site hover expansion and settings controls also update the stack positions. Left panels grow right/down, right panels left/down, and bottom strips upward from their outer corners.

## Review sequence

The silent synthetic episode lasts 24,000 ms, including the compiler's final 800 ms hold. Word timings are turn-relative. Shots are R-01 boot, R-02 compact and route, R-03 interference expansion/collapse, and R-04 wage settings/open/close.

| Reference | Absolute ms | Shot | Frame at 30 fps |
| --- | ---: | --- | ---: |
| dash_world_boot | 500 | R-01 | 15 |
| dash_1486_compact | 13000 | R-02 | 390 |
| dash_1486_interference_expanded | 16000 | R-03 | 480 |
| dash_1486_settings | 21000 | R-04 | 630 |

These times are stored in `review/states.json`. Boot lights begin at 800 ms and finish at 5,100 ms. The flight runs from 6,200 to 8,400 ms. The route draws from 8,600 to 12,000 ms. Interference expands at 14,500 ms and collapses at 18,000 ms. Wage settings open at 19,500 ms and close at 22,600 ms. Instrument transitions take 400 ms.

`review/stage.yaml` is a relative symlink to `../stage.yaml`. The compiler resolves the YAML path before setting `episode_dir`. This arrangement makes the requested review command resolve the actual episode root and lets the unmodified compiler set `STAGE_EPISODE_DIR` correctly. Synthetic manifests and the compiled plan remain in `review/`.

## Engine changes

Only two engine files changed. No packages were installed; package manifests and lockfiles were untouched.

### video/src/stage/Instrument.tsx

- Added opt-in `unstyled` rendering to remove the engine's fixed 20 px content inset and default panel chrome. The episode supplies its own precisely sized GlassPanel.
- Added optional section style and interactive-mode notification props. The notification lets the episode reflow siblings when a user expands a panel or opens settings.
- Raised interactive expanded panels above neighbouring panels.
- Styled the interactive gear/close control with the token colours and a 28 px button, and made the close action recognize timeline-driven settings. This button styling also applies to existing interactive instruments.

### video/src/stage/MapStage.tsx

- Corrected projection orientation: a positive clip angle selects globe rotation. D3 returns zero for equirectangular projection; the previous non-null condition incorrectly rotated it. The failed waypoint check measured Lisbon at x 658.991 instead of x 593.77. The corrected fit matches all 17 handoff points within 1e-8 px.
- Added opt-in engraved rendering: graticule and rhumb lines precede the land silhouette; country borders and highlights follow it. This provides separate coastline and country-border strokes.
- Added optional 110m resolution for the boot map. The existing 50m default remains.
- Added the handoff's full pole-to-pole, ten-degree graticule sampling in engraved mode.
- Added an opt-in engraved CompassRose with the authored cardinal/intercardinal radii, 82/66 px rings at a 70 px star radius, separate star stroke, and Mono north label.
- Added an explicit `handoff` spline convention using tension/3, alongside the existing cardinal convention. Added a masked dash overlay and rounded route caps. Existing callers retain cardinal interpolation; rounded caps apply to all Route instances.

## Departures and pending visual checks

- The flight blends the Natural Earth world view into the moving equirectangular view over its first 800 ms. `flyTo` controls the centre and scale. Both settled projections use their exact authored geometry.
- The expanded response plot uses the measured 604.8 px child box. The spec's narrative also mentions a 608 px plot with clipped overhang; the implementation follows the numeric box. The review states show the compact response plot.
- Country-border opacity uses the resolved `color/line/border` token, alpha 0.5. The map-generation script hardcodes 0.55. This follows the semantic token and map.json layer specification; the orchestrator should inspect this small handoff inconsistency during comparison.
- Site output was redirected to `review/site-dist` with `--outDir` to respect the permitted write scope. `STAGE_PLAN` points to the review plan, which is embedded in the build.
- Font CSS imports use the supplied absolute engine node_modules path because the episode has no node_modules and the host has no fontsource alias. The installed IBM Plex Sans 400, 500, 700, italic 400 and Mono 400/500 assets are used. The engine's existing Remotion font gate waits for `document.fonts.ready`.
- The generators and outputs are ready for the orchestrator to commit. Git commands were prohibited and were not run.
- Chromium was not launched. PNG pixel equivalence, browser text wrapping, glass backdrop blur, hover behaviour, and intermediate flight appearance require the orchestrator's render/browser pass. Server rendering checks structure and numeric geometry.
- The session log resides inside this episode directory because the requested vault location falls outside the permitted write scope.

## Validation

Episode TypeScript:

```text
npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage
exit 0; no diagnostics
```

Engine TypeScript and engine checks, from scriptCast-stage/video:

```text
npx tsc --noEmit -p .
exit 0; no diagnostics
npm run check-stage
PASS: motion/fly-to, springs, cues, instrument growth, four map projections + fit, and MathText parsing.
```

Episode geometry and structure:

```text
node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs
PASS: 17 projected waypoints; handoff route control points within 0.0051 px; four deterministic reference states; settings stack reflow; all 30 instrument modes render.
```

Review plan and dry-run:

```text
wrote Architecting_the_operation/video/yt02/stage/review/stage_plan.json
STAGE_EPISODE_DIR=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/review/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

Vite, from scriptCast-stage/video, with the absolute episode and review plan paths in `STAGE_EPISODE_DIR` and `STAGE_PLAN`:

```text
npx vite build --config site/vite.config.ts --outDir <episode>/review/site-dist
✓ 244 modules transformed.
Some chunks are larger than 500 kB after minification.
✓ built in 962ms; exit 0
```

The bundle-size warning reflects bundled atlas geometry and handoff content. Full build output is in `review/check-site.txt`. Episode check output is in `review/check-episode.txt` and `review/check-dashboard.txt`.

Prose validation: the file-specific antithesis checks passed. The reviewed dependency-installation sentence is factual negation. The independent reading pass reported 0 CERTAIN, 0 arguable, and 5 considered and cleared. The git-based make target was omitted under the task’s no-git rule.
