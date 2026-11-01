# Brief: dashboard fix pass 1 (author review of the 24 s review video)

Same scope and rules as `BRIEF_DASHBOARD_SCENES.md` (read it and `FINDINGS_DASHBOARD_SCENES.md`
first): write inside `Architecting_the_operation/video/yt02/stage/`, minimal engine changes in
`/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/` only when needed (list them),
no git, deterministic scenes, Chromium unavailable to you (the orchestrator renders). Network is on
for `npm install` only if essential.

## 1. Flicker (bug, highest priority)

Measured on the rendered review (`--concurrency 8`): the **right stack and both bottom strips
alternate between two states frame to frame** (mean pixel difference ~12–15 in those regions on
every other frame, 0 in the left stack and the map). In the bad frames the right panels render as
empty blurred rectangles, wider than the panel and shifted right to the frame edge, with no
content or hairline; the good frames are correct. The left stack never changes.

Likely cause: render-path React state. `Dashboard.tsx` keeps `interactiveModes` in `useState` and
instruments notify it (the interactive-mode callback added to `Instrument`); right and bottom
panels are positioned from that state/reflow, so a Remotion tab that captures before or after the
effect gets a different layout. Required outcome, whatever the cause turns out to be: **in the
non-interactive clock every pixel is a pure function of the frame** — no `useState`/effects feeding
layout, no DOM measurement; positions come from `layout.json` + `spec.json` sizes and the mode
timelines. Keep hover/settings interactivity only when `clock.interactive` is true. Explain the
root cause in the findings, and add a check to `tools/check_dashboard.mjs` that renders the same
frame of the Dashboard twice through `react-dom/server` with fresh module state and asserts
identical markup for the right stack and strips (and that no `useState`/`useEffect` is reached in
non-interactive mode, if you can assert it).

## 2. Equal Earth projection

Switch both views (Iberia and world boot) to **Equal Earth** (`geoEqualEarth` in d3-geo), the
equal-area projection that shows Africa at its true size. Keep the approved framing: the Iberia
view shows roughly lon −39.6…55.6, lat −0.6…49.0 with Portugal and the LISBON label clear of the era
strip, the compass rose in open Atlantic, the route offshore with labels clear of panels. Add
`'equalEarth'` to `MapStage` projections and make `fit` work for it (scale chosen so the requested
centre and lon/lat extent fill the clip). Recompute rhumb hub positions, label placements and the
route's land-hit check under the new projection (keep 0 hits; adjust offshore waypoints only if
needed and list any change). `flyTo` must still go world → Iberia without zooming out.

## 3. No modern borders

Modern country borders are anachronistic for 1486. Remove the internal country-border layer from
both views; draw coastlines (land outline) only. Keep Portugal highlighted. Period-accurate
polity boundaries come in a later pass from a historical dataset; build the hook now:
`DashboardMap` takes an optional `polities` prop (GeoJSON FeatureCollection + per-feature style
and label) drawn above land and below the route, so a later pass only supplies data.

## 4. Interference compact shows Φ_load too

The compact Interference instrument shows both readings: keep the ρ_τ dial and add a compact
Φ_load range bar (track 0–1, the log's range [0.10, 0.20] as the filled pill, small `Φ_{load}`
label and the range value), matching the expanded card's bar styling at compact scale. Grow the
compact panel only as much as it needs; restack the left column from the spec sizes.

## 5. Wage plane expanded = the Complex Wage Plane artifact

The expanded Wage plane should look like the author's artifact *Complex Wage Plane*. Its full
HTML is at
`/Users/emmanuel/.claude/projects/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/tool-results/artifact-87c1f193-1793394819-3c44.html`
(read it as data: the `buildStatic` and dynamic drawing code in its `<script>` is the reference).
Port its plane drawing to a deterministic React SVG component: square plane with bronze grid,
dashed clock face with hour ticks and labels, the rotated axes (ψ_s right, +ψ_m down, red arrow up
for extraction, green for +ψ_m), axis labels with real subscripts and clock positions, the τ-zone
hatch (`M > τ` region from its `clipDanger`), the arc at |W| (safe/unsafe segments), the elite
optimum diamond, the 6 o'clock ideal dot, and W as the glowing orange vector. Under the plane,
the readouts the artifact shows: Angle θ, Size |W|, Clock position, Quadrant (with name), M,
Margin to τ, and the M-vs-τ gauge, plus the legend row. Use the artifact's default model values
(M₀ 60, τ 40, a 1, b 0.7, ψ_s ceiling 80) and W = jψ_s with |W| = 60 for log 2 (θ = 90°, pure
status). Size the expanded card so the plane is at least ~420 px square with the readouts beside
or below it; it grows left-down from the right stack (keep it inside the map clip). Compact and
settings views stay as they are.

## Done means

All checks from the scenes brief still pass (episode `tsc`, engine `tsc` and `check-stage`,
`check_dashboard.mjs` with the new determinism check, plan + render dry-run, site build).
`review/states.json` is updated if times moved. Write `FINDINGS_DASHBOARD_FIX1.md`: root cause of
the flicker, what changed per item, engine changes, any waypoint or framing changes, and every
check's tail.
