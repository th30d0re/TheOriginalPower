# Brief: tray fix pass 2. The wage plane returns to the right stack as "Buffer Class Wage"

Read these first: `FINDINGS_DASHBOARD_TRAY.md`, `BRIEF_DASHBOARD_FIX3.md` and the code in `dashboard/`.

The usual rules apply:
- Write only inside `Architecting_the_operation/video/yt02/stage/`.
- The engine is read-only.
- Do not change git state.
- Keep the frame path deterministic.
- Do not launch Chromium.

Run `git status` before and after, and report anything you touched outside `stage/`.

## Author's notes (2026-11-01, on `dashboard_review_tray_fix1.mp4`)

> "the wage pane one … the W is getting cut off a bit. It doesn't have padding on the left side.
> And also, I don't know why we moved it away from where it was on the right side under results.
> Also, it should be like the buffer class wage. It should be the title of it."

## 1. Move it back to the right stack, under Result

The Wage plane leaves the tray and returns to the right stack. The right stack becomes, top to bottom:
1. Active Patch
2. Variables
3. Executing Function
4. Policy ticker (its compact shows "RESULT")
5. Wage plane

The Wage plane is right-aligned like the others and stacked 8 px below the Policy ticker.

- **Compact view:** use the right-stack compact from before the tray (commit `f94a379`). That is the Figma compact: `spec.instruments['Wage plane'].compact`, 187 × 120, rendered by `Nodes` from `handoff/spec.json`. It has the 84 px mini plane with the τ zone and W, plus its readouts, all with the spec's 8/10/8/10 padding. Remove the tray-sized compact override in `wagePlaneSpec`.
  - If you keep `WagePlaneCompact` for anything, it needs real padding: at least 10 px left and right inside the panel. The W, the plane frame and the title must not touch or cross the panel edge.
- **Expanded and settings:** both keep the fix-pass-3 behaviour and the centred `WAGE_EXPANDED_BOX`, `[260, 138, 1400, 860]`. The card grows from the right-stack panel toward the centre.

## 2. Title: "Buffer Class Wage"

- The compact panel's title text changes from "Wage plane" / "WAGE PLANE" to **Buffer Class Wage**. Keep the spec's title font and colour.
- The expanded card keeps the artifact's own title, "Complex Wage Plane".
- The settings title becomes "SETTINGS · BUFFER CLASS WAGE".
- Internal keys (`'Wage plane'`, the slug `wage-plane`, cue names) stay unchanged so the plans keep working.

## 3. The tray becomes eight cells

The tray keeps x 36…1884, 8 px gaps and a height of 100. With `count: 8`, each cell is 225 px wide. The order is:
1. Interference Engine
2. Phase Coherence
3. Five-Tier Cone
4. Compounding Ledger
5. Backlash Oscillator
6. Thyristor Latch
7. AC Extraction Meter
8. Snubber Circuit

Each compact content box stays centred in its cell.

## 4. Indices, checks and the review plan

- `Dashboard.tsx` hard-codes rail index ranges: 0–4 are the left stack, 5–8 the right stack, 9+ the tray. Make the ranges follow the new composition: right stack 5–9, tray 10–17. Grow directions:
  - Right stack: left-down.
  - Wage plane: grows toward the centre box.
  - Tray: centre.
- Update `tools/check_dashboard.tsx`/`.mjs` for the new layout:
  - The right stack has five panels in the order above.
  - The Wage plane compact is 187 × 120, has the title "Buffer Class Wage", and has ≥ 10 px of horizontal padding.
  - The tray has eight cells in order.
  - Count 24 tray mode renders.
  - The determinism double-render covers the moved panel.
  - The route, its labels and the polity labels stay clear of the taller right stack. Re-run the land-hit and label checks.
- `review_tray/`: keep the Wage plane's expand step (it expands from the right stack now). Keep the eight tray expansions and the Interference Engine settings. Recompute `review_tray/states.json`.
- The existing `review/` plan must still compile.

## Done means

All of the following pass:
- Episode `tsc`
- `check_dashboard`
- Plan compile and render `--dry-run` for `review/` and `review_tray/`
- The site build

Then append a "Fix pass 2" section to `FINDINGS_DASHBOARD_TRAY.md`. It must give:
- The right-stack panel boxes.
- The Wage plane compact box and its padding.
- The new tray cell width.
- The tail of each check's output.
