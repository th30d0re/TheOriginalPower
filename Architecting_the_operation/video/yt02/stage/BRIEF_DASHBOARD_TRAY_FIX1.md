# Brief: tray fix pass 1 (orchestrator's frame review of `dashboard_review_tray.mp4`)

Read `BRIEF_DASHBOARD_TRAY.md`, `FINDINGS_DASHBOARD_TRAY.md` and `dashboard/artifacts/CONTRACT.md`.
Same rules as before: write only inside `Architecting_the_operation/video/yt02/stage/`; engine
read-only; no git state changes; deterministic frame path; no Chromium (the orchestrator renders
and inspects). Run `git status` before and after; report anything outside `stage/`.

Frames were taken from the rendered review at the `review_tray/states.json` times. The checks
pass, but these four defects show on screen. Fix each in the view file (do not rewrite views);
keep every check passing.

## 1. Expanded content overflows the card (clipped at the bottom)

- **Thyristor Latch** (21.6 s): the lower panel "Where the latch can hold" runs past the card's
  bottom edge; its chart is cut off.
- **AC Extraction Meter** (24.1 s): the bottom panel "The Reparations Integral, 1619–2026" is cut
  off after its first line.

Every expanded and settings view must fit inside its content box (1368 × 828; the card is
`TRAY_EXPANDED_BOX` 1400 × 860). Reflow these two (shorter chart heights, two columns, or tighter
spacing) so all of the artifact's panels show in full. Then audit the other seven views' expanded
and settings layouts by arithmetic over their fixed sizes (sum of panel heights, paddings, gaps
against 828) and fix any other overflow. Add to `check_dashboard` a static assertion of each view's
declared layout height ≤ its content box, if the views expose their layout constants; otherwise
list the per-view sums in the findings.

## 2. Thyristor "Current through the latch" chart is empty

At 21.6 s the chart shows its axes, the I_H and threshold lines and the labels, but no current
trace. The artifact draws the current over time (its own simulation/curve code). Port that curve
as a static trace for the default state (I = 0.79 against I_H 0.30, LATCHED), memoised at module
level, and check the compact sparkline uses the same data.

## 3. Literal underscores in on-screen text

Interference Engine expanded summary line reads "p_τ = 0.77: kernel-safe …" and "the phase lever
falls from Φ_load = 0.15 to 0.03" with literal underscores (and "p" for ρ). Render these through
`MathText` with real subscripts (`ρ_τ`, `Φ_{load}`). Then grep every view and `PanelContent.tsx`
for rendered strings containing `_` (template literals and JSX text, not identifiers or data keys)
and fix each. Add a `check_dashboard` assertion that no rendered markup text node (any mode, any
instrument) contains `_` followed by a letter or `{`.

## 4. Backlash Oscillator header buttons collide with gear and close

At 19.1 s the preset buttons ("Impulse shock", "Initial charge Q", "Sustained drive") sit under the
card's gear and close controls. In the rendered path these presets are interactive controls:
hide them when `interactive` is false (show the active preset as a static label instead, if the
artifact names it). On the site, keep them clear of the gear/close area. Check the other eight
expanded headers for the same overlap with the top-right controls.

## Done means

Episode tsc, `check_dashboard` (with the new assertions), plan + render dry-run for `review/` and
`review_tray/`, site build. Append a "Fix pass 1" section to `FINDINGS_DASHBOARD_TRAY.md`: each
fix, the per-view layout height sums, any other overflow or underscore you found, and each
check's tail.
