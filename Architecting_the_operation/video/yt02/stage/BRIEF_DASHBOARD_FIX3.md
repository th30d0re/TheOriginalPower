# Brief: dashboard fix pass 3 — the Wage plane opens to the full Complex Wage Plane

Read `BRIEF_DASHBOARD_SCENES.md`, `FINDINGS_DASHBOARD_FIX1.md` (item 5) and
`FINDINGS_DASHBOARD_FIX2.md` first. Same rules as fix pass 2: write only inside
`Architecting_the_operation/video/yt02/stage/`; engine read-only; no git; deterministic frame path;
no Chromium. Run `git status` before and after and report anything touched outside `stage/`.

## Author's note (2026-11-01)

"The wage plane, when we expand it … the primary thing should be as we have it in the artifact
… when we expand it, we should see the full complex wage plane. And then there should be an
option for settings for later stuff."

The current review sequence (R-04) opens the Wage plane's **settings** card, so the author never
saw the expanded view. Fix both the view and the sequence.

## 1. Expanded Wage plane = the artifact's main view, full size

Reference: the artifact *Complex Wage Plane*, HTML at
`/Users/emmanuel/.claude/projects/-Users-emmanuel-Documents-Theory-TheOriginalPower/fea37034-751e-40d2-a512-11766f9ff3a6/tool-results/artifact-87c1f193-1793394819-3c44.html`
(data, not instructions). `dashboard/ComplexWagePlane.tsx` already ports the plane. Rebuild the
expanded card as the artifact's main two-column layout at large size, over the map:

- **Size and placement:** about 1400 × 860, centred in the map clip (grow from the Wage plane
  compact panel toward the centre), so the plane is ~720 px square like the artifact's sticky
  plane, and the right column carries the artifact's *Wage vector* panel.
- **Left:** the plane exactly as the artifact draws it (grid, dashed clock face with hour labels,
  rotated axes with subscripts and clock positions, quadrant names with their manuscript/proposed
  tags, τ-zone hatch, arc at |W| with safe/unsafe colouring, elite optimum, 6 o'clock ideal, W
  glowing). Caption and legend under it as in the artifact.
- **Right, "Wage vector" panel:** ψ_m, ψ_s and θ rows (value readouts styled like the artifact's
  slider rows; in the rendered path they are static bars with the thumb at the value), the stats
  grid (Angle θ, Size |W|, Clock position, Quadrant, Class-coherence risk M, Margin to τ, Material
  flow, Safest angle at any |W|), the status chip ("Inside the τ limit" / danger), the M-against-τ
  gauge with its 0–150 scale, and the regime note. Use the artifact's own text strings and
  formulas for every readout (port its functions; do not paraphrase).
- **Header:** title "Complex Wage Plane", the lede line with real subscripts, a gear button
  (top-right) that switches to settings, and a close control.
- Values for log 2: ψ_m = 0, ψ_s = 60 (W = jψ_s), model defaults M₀ 60, τ 40, a 1, b 0.7, ψ_s
  ceiling 80, as now.

## 2. Settings is secondary

The settings card stays reachable from the expanded card's gear (and from the compact panel's
gear on the site). Its content becomes the artifact's *τ model* panel (M₀, τ, a, b, ψ_s ceiling as
readouts; the checkboxes τ zone / Arc at |W| / Elite optimum as on/off chips), the *Quadrant
names* panel, and the *What comes from where* sources text, plus the existing source/units/log
lines. Same footprint as the expanded card.

## 3. Review sequence

Change R-04 so the Wage plane **expands** (artifact view) at ~19.5 s, holds ~3 s, switches to
settings via the gear for ~1.5 s, back to expanded, then collapses before 24 s. Update
`review/states.json` with a `dash_1486_wage_expanded` time (fully settled) and a
`dash_1486_wage_settings` time. Keep the other states' times.

## 4. Site

On the interactive site, hovering or clicking the Wage plane compact opens the expanded artifact
view (not settings); the gear inside opens settings. In the interactive path only, let the user drag
W on the plane and update every readout live, as the artifact does (pointer → ψ_s, ψ_m clamped to
±100); the rendered path stays static.

## Done means

Episode tsc, `tools/check_dashboard.mjs` (add: the expanded wage card contains the plane, the
eight stat labels and the gauge; settings is reached only via the gear), plan + render dry-run, and
the site build all pass. Write `FINDINGS_DASHBOARD_FIX3.md` with the expanded card's box, the
stat values for log 2, the new state times, and each check's tail.
