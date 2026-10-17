# YT02 SEG 11 · Runtime dashboard (Figma)

The book's RUNTIME LOG boxes, shown as a live system readout that steps through the eras. Source:
the Compiled Runtime Log appendix (`Paper/The_Original_Power.tex`, `\chapter{Compiled Runtime Log}`),
each log also in situ in its chapter. **Every value on screen is verbatim from a log**; numbers
appear only where the log gives them.

## Layout (1920×1080, YT01 palette)

| Panel | Source field | Visual |
|---|---|---|
| Era header | log title (date, place) and chapter | large date, place under it; era band on a timeline strip across the top that fills as eras advance |
| System Stress | "System Stress (min: class resistance)" | level badge (MINIMAL / LOW / HIGH / CRITICAL) plus its one-line reason; CRITICAL pulses red |
| Capital | "Capital (max: extraction output)" | level badge (BLOCKED / STAGNANT / AT RISK / …) plus reason |
| Interference State | "Interference State (Φ_load, proximity to τ)" | Φ_load as a range bar on 0–1; ρ_τ as a dial with the crash threshold τ = 1.0 marked; both drawn only when the log states ranges, else the log's word state |
| Active Patch | "Active Patch" | console line, typed in |
| Variables | "Variables Loaded / Deployed This Cycle" | chips (E, O_racialized, I, I_buffer, P_uppet, F_enforce, W = jψ_s …); new chips light up gold, carried ones stay dim |
| Executing Function | "Executing Function" | one line |
| Result | the [POLICY] lines | ticker along the bottom, one policy per beat |

## Eras (one dashboard state each)

Log 2 · 1486 Lisbon (Ch 3) → Log 3 · 1676–1787 Virginia → Philadelphia (Ch 4) → Log 5 · 1704–1865
American South (Ch 9) → Log 9 · 1894–1965 post-emancipation containment (Ch 10) → Log 14 · 1968–1994
the recompile (Ch 12) → Log 15 · 1994–present terminal runtime (Ch 13) → Log 17 · algorithmic epoch
(Ch 17).

## Build

- One Figma frame per era state, with named layers (`stress badge`, `phi bar`, `rho dial`,
  `chip I_buffer`, `ticker 1` …) so `figma_cues.py` can cue each panel on the narration word that
  names it.
- Transitions between eras: values cross-fade in place; the ρ_τ needle sweeps; chips light in the
  order the log lists them. The 1676 state shows ρ_τ > 1.00 at the crash, then the post-patch range.
- Values come from a data file extracted from the logs (`dashboard_eras.json`), so a correction in
  the book flows into the frames by re-running the build.
