# Brief: dashboard fix pass 2

Read `BRIEF_DASHBOARD_SCENES.md`, `FINDINGS_DASHBOARD_SCENES.md`, `BRIEF_DASHBOARD_FIX1.md` and
`FINDINGS_DASHBOARD_FIX1.md` first. Same rules: write only inside
`Architecting_the_operation/video/yt02/stage/` (book repo, `/Users/emmanuel/Documents/Theory/TheOriginalPower`);
the engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/` is read-only for
this pass (if something truly needs an engine change, describe it in the findings instead). No git.
Deterministic frame path (no hooks, no DOM measurement, no backdrop-filter in the rendered path).
Do not launch Chromium; the orchestrator renders. Run `git status` before and after and report
any file you touched outside `stage/`.

Checks you can run: `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`,
`node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs`, and the plan/dry-run
commands in `BRIEF_DASHBOARD_SCENES.md`.

## 1. Panel legibility without blur

Fix pass 1 removed `backdrop-filter` from rendered panels, so coastlines now run through panel
text ("1486", "System Stress", "Capital"). In the rendered (non-interactive) path, give every
compact, expanded and settings panel an opaque-enough fill: the field navy (`color/bg/field`
resolved value) at 0.88 alpha under the existing panel-wash tint, so map lines behind panels are
faint and never cross text visibly. Keep the hairline. The site (interactive) path may keep the
blur recipe. Add the new value as a semantic token in `tokens.ts` via `tools/gen_tokens.mjs`
overrides (do not edit `handoff/`), named `color/fill/panel-render`.

## 2. Iberia framing under Equal Earth

Fix pass 1 fitted the whole old extent and zoomed the view far out, so Portugal is small. Restore
the approved scale: Portugal's on-screen height in the settled 1486 state must be within ±10% of its
height in `handoff/png/dash_1486_compact.png` (measure it there: about 140 px), with Lisbon to
Elmina fully visible inside the map clip and clear of all panels, LISBON clear of the era strip
and the left stack, Elmina above the bottom strips. Crop the extent as needed (the eastern Sahara
and Arabia may leave the frame). Update `review/map-geometry-fix1.json` (or a `-fix2` copy) and
keep the route land-hit check at 0. `flyTo` from the world view must still not zoom out.

## 3. Compass becomes a widget

Author's note (2026-10-31): "The compass should be made a widget. It shouldn't be like how it is
now." Remove the compass rose drawn on the map. Add an eleventh instrument, `compass`, in the same
panel style as the others, with three modes:

- **compact**: a small compass rose (~56 px) with N, the map's centre coordinates in mono (e.g.
  `38.7°N 9.1°W`), and a scale bar in km correct for Equal Earth at the camera centre's latitude.
- **expanded**: a larger rose, camera centre and zoom, projection name (Equal Earth), the scale
  bar, the view's extent in degrees.
- **settings**: projection note (equal-area; Šavrič, Patterson and Jenny, 2018), data credits
  (Natural Earth, public domain; Cliopatria, CC BY 4.0, Bennett et al. 2025), units.

All values derive from the camera every frame, so the widget updates during the fly-to. Default
placement: bottom of the left stack (the author decides in review); restack from spec sizes.

## 4. Period polities for 1486 (Cliopatria)

Use the `polities` hook from fix pass 1. Data: Cliopatria (Seshat Global History Databank), CC BY
4.0, Zenodo record 13363121 (`cliopatria.geojson.zip`, ~300 MB; GitHub
`Seshat-Global-History-Databank/cliopatria` has the README and notebooks). Network is allowed for
this download only. Download to
`/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/scratchpad/cliopatria/`
(never into a repo). Write a script `tools/extract_polities.py` (stdlib + whatever is already
installed; stream the file if it is too large to load) that selects `Type == 'POLITY'` features
with `FromYear <= 1486 <= ToYear` intersecting lon −40…40, lat −5…55, simplifies geometry to about
0.05° tolerance, rounds coordinates to 3 decimals, and writes
`stage/data/polities_1486.geojson` (keep it under ~1 MB) plus `stage/data/POLITIES_SOURCES.md`
(dataset, version/DOI, licence, the exact filter, and the feature list with names and year
ranges). Verify the README's field names before relying on them.

Draw them in the 1486 view as thin dashed cream boundaries (no fill, low opacity) with small mono
labels for the major polities in view (Portugal, Castile, Aragon, Granada, the Marinid/Wattasid
state in Morocco, Mali, Songhai, Jolof, Benin, and any other polity Cliopatria has there); Portugal
keeps its gold fill, and Portugal's highlight should come from the period polygon if Cliopatria has
one for 1486, otherwise the current one. Labels must not collide with each other, the route labels
or panels. If Cliopatria lacks a polity named above, say so in the findings; do not invent
boundaries. The world boot view stays coastlines only.

## Done means

All checks above pass; `review/states.json` is updated if times moved; write
`FINDINGS_DASHBOARD_FIX2.md` with what changed per item, Portugal's measured height, the polity
list, the data credit line, anything you could not do, and each check's output tail.
