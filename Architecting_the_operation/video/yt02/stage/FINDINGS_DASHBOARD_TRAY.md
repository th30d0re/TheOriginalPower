# Findings — Dashboard Tray (always-on instrument tray, 2026-11-01)

**Date:** 2026-11-01
**Scope:** `/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/stage/` only. Engine at `/Users/emmanuel/Documents/Theory/scriptCast-stage/` untouched. No git state changes. No Chromium or Remotion renders (plan compile and `--dry-run` only).

---

## 1. What Was Requested

Wire the nine model instruments into an always-on bottom tray:

1. **Layout:** left stack unchanged; right stack = Active Patch, Variables, Executing Function, Policy ticker (last two as compact one-line panels, expanded shows all three result lines); bottom strips removed; bottom tray of nine mini instruments (Complex Wage Plane, Interference Engine, Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, Thyristor Latch, AC Extraction Meter, Snubber Circuit) at x 36…1884, ~197 px cells with 8 px gaps, ~100 px tall, `color/fill/panel-render` recipe.
2. **Map:** keep Equal Earth and approved scale; re-frame so route (Lisbon → Elmina), labels and Portugal sit above the tray's top edge and clear of both stacks; re-run land-hit and label-collision checks.
3. **Tray wiring:** wrap the eight ported views (`dashboard/artifacts/<Name>View.tsx`) plus the existing Complex Wage Plane in the dashboard panel (`PanelContent` recipe), size cells, drive mode timelines from cues, register them.
4. **Modes per instrument:** `compact` (catalogue readout, 11 px mono title, mini-graphic, values via `MathText`), `expanded` (~1400 × 860 over the map growing from its tray cell, static in rendered path), `settings` (model parameters + verbatim sources text + manuscript line refs + "model default" line when the era mapping is a suggestion).
5. **Era mapping:** from `dashboard_eras.json` log 2 per the catalogue's "era-drivable" notes; where the mapping is a suggestion (Thyristor gate rule, Snubber event-only, Phase Coherence outside 1960–2030), show the artifact default and mark "model default". Never invent book values.
6. **Colours:** artifact ivory `#ECE7DC` → `color/text/primary`, gold `#D4A84B` → `color/fill/gold`. IBM Plex local fonts.
7. **Snubber conflict:** manuscript says arms raise V_br; real TVS clamps sooner at lower V_br. Show the manuscript's reading, note in settings, flag here.
8. **Review plan `review_tray/`** (~30 s): 1486 dashboard settled with tray, each tray instrument expands ~2.5 s and collapses (nine expansions), one settings view (Interference Engine) via gear. `review_tray/states.json` with settled times. Keep existing review working.
9. **Also fix:** interaction hints ("Click or drag…", arrow keys) must show only when the clock is interactive; apply to every ported artifact.
10. **Checks:** episode tsc, extended `tools/check_dashboard.mjs` (tray nine cells in order, all three modes per instrument, determinism covers tray, route above tray), plan + render dry-run for both review plans, site build.

---

## 2. Per-Instrument Port Summary

(to be filled in as work proceeds)

| Tray order | Instrument | Compact readout | Era mapping (log 2) | modelDefault | Deviations |
|---|---|---|---|---|---|
| 1 | Complex Wage Plane | mini plane + clock + ρτ | log 2 predates 1705 minimum → model default (year slider min) | true | interactive caption gated on `interactive` |
| 2 | Interference Engine | ρτ number + bar + mini phase circle | Φ_load/rho_tau midpoints, M₀ solved | false | — |
| 3 | Phase Coherence | 24-dot circle + Φ + r | pre-1960 → artifact default | true | — |
| 4 | Five-Tier Cone | five-disc stack + E vis % | no numeric fields; tiers light from variables_deployed | true | — |
| 5 | Compounding Ledger | 5-step staircase + O value | log 2 predates 1619 → baseline 1.00 | true | — |
| 6 | Backlash Oscillator | q(t) sparkline + ζ + period | no preset for log 2 → preset 0 | true | — |
| 7 | Thyristor Latch | LATCHED badge + I vs I_H | no log input; gate rule unapproved | true | — |
| 8 | AC Extraction Meter | mini phasor + cos θ + clock | log 2 precedes 1619 → defaults | true | — |
| 9 | Snubber Circuit | surge sparkline + energy bar | event-only (log 3 crash); log 2 default | true | V_br conflict note |

---

## 3. View Defects Found and Fixed

(in progress)

## 4. Layout Geometry

(in progress)

## 5. Verification Check Tails

(in progress)
