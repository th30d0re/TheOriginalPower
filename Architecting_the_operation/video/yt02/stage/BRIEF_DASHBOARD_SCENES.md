# Brief: the runtime dashboard as Stage scenes (YT02)

You are building the episode side of the YT02 runtime dashboard in React/SVG on the Stage engine.
The design is approved and frozen in Figma; your job is a faithful rebuild from the handoff pack.

## Read first

- `Architecting_the_operation/video/yt02/stage/handoff/README.md`, then `layout.json`, `spec.json`,
  `tokens.json`, `map.json`, `map_overlay.json`, and the four reference PNGs in `handoff/png/`.
  The PNGs are the visual target.
- Engine: `/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts` and the
  modules it exports (`MapStage` with engraved layers and `fit`, `CompassRose`, `Route`, `flyTo`,
  `Instrument` with `grow`, `GlassPanel`, `MathText`, `useCue`, `useStageMs`, tokens). Read
  `docs/briefs/stage-engine.md` and `stage-dashboard-engine.md` there for the contracts. The demo
  episode `video/episodes/_demo/` shows how an episode plugs in (`index.ts` exporting `scenes`,
  `stage.yaml`, synthetic manifest and word timings).

## Rules

- Write only inside `Architecting_the_operation/video/yt02/stage/` (book repo), except: you may
  make **minimal** engine fixes in `/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/`
  and `video/package.json`/lockfile if the episode cannot be built otherwise; list every engine
  change in the findings file with the reason. Never edit other files in either repo. No git.
- Network is on only to `npm install` in `scriptCast-stage/video`: `@fontsource/ibm-plex-sans`
  weights 700 and italic 400 are already in the installed 5.1.1 package; just import them. Install
  nothing else unless it is essential, and say so.
- Deterministic scenes: no CSS transitions, `Math.random`, `Date.now`, `requestAnimationFrame`.
- Chromium cannot launch in your sandbox; do not run `remotion render/still`. The orchestrator
  renders and compares against the PNGs.
- On-screen copy is verbatim from `handoff/spec.json` / `dashboard_eras.json`. Subscripts use
  `MathText` markup (`ρ_τ`, `Φ_{load}`, `O_{racialized}`, `W = jψ_s`), never literal underscores.

## Build

Episode directory `Architecting_the_operation/video/yt02/stage/`:

1. `tokens.ts`: generated from `handoff/tokens.json` by a small script `tools/gen_tokens.mjs`
   (commit the script and its output) so a Figma token change flows through by re-running it.
   Provide a `Tokens` object for the engine's `TokensContext` plus the dashboard's own semantic
   names.
2. `dashboard/` components, one file each:
   - `CompactBorder.tsx`: the compact border as an inline React SVG generated from
     `handoff/svg/border-compact.svg` by `tools/svg_to_tsx.mjs` (drop the `#F5F5F5` backdrop rect,
     keep paths, map the wire colour to the token). The other SVGs with outlined text are reference
     only; build text live.
   - `EraStrip.tsx`: ticks, the seven log labels, active marker; props `activeLog` and
     `empty` (boot).
   - `DashboardMap.tsx`: `MapStage` in the engraved style with the exact projection, `fit`
     (19.5 px/deg at lon 8 / lat 24.2), clip rect, layer styles, rhumb centres and spokes,
     `CompassRose` and `Route` (the 17 waypoints, tension 0.4, markers and labels) from `map.json`
     and `map_overlay.json`; Portugal (ISO 620) highlight; a `world` view for boot. Camera and
     route `draw` progress come in as props so the scene can fly and draw on cues.
   - `instruments/<slug>.tsx` for the ten instruments (era-clock, system-stress, capital,
     interference, active-patch, variables, wage-plane, backlash-oscillator, executing-function,
     policy-ticker). Each renders `compact`, `expanded` and `settings` content from `spec.json`
     (sizes, padding, radius, strokes, fonts, colours, child boxes) inside `Instrument` +
     `GlassPanel`. Graphics are parametric (README note 9): the ρ_τ dial (range arc, needle at the
     range midpoint, τ = 1.0 mark), the Φ_load bar, the wage plane (screen x = ψ_s, screen y = ψ_m
     positive down, τ-zone hatch, W = jψ_s), the q(t) trace (formula and parameters in the spec),
     the RLC schematic. Values come from `dashboard_eras.json` log 2 where the log has them.
   - `Dashboard.tsx`: assembles border, era strip, map, the two stacks and the bottom strips from
     `layout.json`. Props: `era` (log id), `camera` keys / route draw / instrument modes, all
     resolvable from cues; `dim` (0..1) for boot; per-instrument `mode` timelines with the `grow`
     directions in `layout.json`; on the site, hover expands and the gear opens settings.
3. Scenes in `index.ts`: `DashboardBoot` (world view, instruments dimmed, era strip empty;
   instruments light one by one on cues `i1`…`i10` in rail order), `Dashboard1486` (fly from world
   to the Iberia view on cue `fly`, draw the route over the shot from cue `route`, cue-driven
   expansions `expand:<slug>` / `collapse:<slug>` / `settings:<slug>`), registered by name.
4. Review episode `review/`: `stage.yaml`, synthetic `episode_manifest.json` and
   `word_timings.json` (turn-relative, like `_demo`) for a ~24 s sequence that hits the four Figma
   states in order: boot (world, dim, instruments lighting) → fly to 1486 compact → route draws →
   Interference expands → collapses → Wage plane settings opens → closes. Name the shots
   `R-01`…`R-04` matching the four PNGs, and put the exact ms where each matching Figma state is
   fully settled in `review/states.json` (`{"dash_1486_compact": ms, …}`) so the orchestrator can
   render stills there and diff against the PNGs.
5. Type-checking: `stage/tsconfig.json` that extends
   `/Users/emmanuel/Documents/Theory/scriptCast-stage/video/tsconfig.json` with `paths` for `@stage`
   and `@episode` pointing at the engine and this directory, so
   `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`
   passes.

## Done means

- The `tsc` command above passes, and the engine's own checks still pass
  (`cd scriptCast-stage/video && npx tsc --noEmit -p . && npm run check-stage`).
- `PYTHONPATH=/Users/emmanuel/Documents/Theory/scriptCast-stage /Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice/bin/python -m scriptcast.tools.stage plan Architecting_the_operation/video/yt02/stage/review/stage.yaml`
  writes a plan, and `… render <plan> -o /tmp/x.mp4 --dry-run` prints the argv with
  `STAGE_EPISODE_DIR` set to the `stage/` directory.
- `STAGE_EPISODE_DIR=<abs stage dir> npx vite build --config site/vite.config.ts` in
  `scriptCast-stage/video` succeeds.
- `Architecting_the_operation/video/yt02/stage/FINDINGS_DASHBOARD_SCENES.md`: what you built, every
  place you departed from the spec and why, engine changes (if any), the states.json times, and
  each check's output tail.
