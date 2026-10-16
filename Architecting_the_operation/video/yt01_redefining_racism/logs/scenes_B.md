# Group B scene findings (revision pass)

Metal render: ok (`.venv-manimgx`, 960×540@15). Sheet PNGs written to `/tmp/<run id>.png`.

| Run | Class | Status | Revision changes |
|-----|-------|--------|------------------|
| S04-01 | `RacialTestCase` | rendered · layout ok | Tier stack 3.6× width, 34 px labels, left-half layout; full-width timeline; component grid 34 px; `O racialized` ellipse grows on the right with label above |
| S04-05 | `StatusWage` | rendered · layout ok | Larger tier boxes (34 px); ψ_s at 64 px; public institutions column; compound wage beat; stake in bottom-left corner |
| S04-10 | `ConcessionFunding` | rendered · layout ok | 4.8 / 4.4 boxes, 34 px; extraction curve top-right; hold traces Buffer → Out-group with question banner |
| S04-16 | `PredatoryMinMax` | rendered · layout ok | 6.8×4.8 axes, 44 px title; CREATE / JUSTIFY / MAINTAIN highlight cycle |
| S05-01 | `CausalReversal` | rendered · layout ok | Dictionary stack → 12.8-wide horizontal chain, 36 px nodes |
| S05-21 | `CausalReversal` | rendered · layout ok | Three-box generative chain ≥3.9 wide; institutional shell on form box only |
| S05-22 | `CausalReversal` | rendered · layout 3 crossing flags | Figure 2.2 strike: thick red line at row centre (`row_strike_line`, z=10), `Create` on cue `crossed`; feedback = GPU-dashed `ArcBetweenPoints` + `ArrowTriangleTip` (orange, no fill), label *reinforcing feedback (cultivated)*; other beats unchanged |
| S05-33 | `MaintenanceMechanisms` | rendered · layout ok | 44 px heading; 4.6-wide modules; larger loop; cultivated-attitudes label under loop |
| S06-29 | `HierarchyInversion` | rendered · layout ok | Figure 2.3 rebuilt: 5.2-wide stacks, 34 px; conventional/correct titles; invert caption at bottom; per-shot reveals, downward sweep, left-side feedback arc |

## Cue words

Unchanged from first pass:

- S04-16 hold: `maintain`
- S05-22 shot 4: `recruits`
- S05-33: `amplify`

## Contract / copy

- On-screen labels unchanged: DISCRIMINATION (conventional middle box), ELITE INTERESTS (historical row), tier vocabulary per BRIEF.
- No edits to shared manim modules.

## S05-22 drawing fix (2026-10-16)

- **Strike-through:** was below the conventional row; now spans the row at `get_center()[1]` with `stroke_width=10`, added last in the scene so it draws over boxes and arrows; appears on `crossed`.
- **Feedback arc:** replaced `CurvedArrow` + `dashed_ratio` (filled gold band) with `dash_pattern` on a zero-fill arc (~35° bend, `ORANGE_FB`), small outlined tip, italic cultivated label per TikZ `fig:causal_reversal`.
- **Acceptance:** `edit16x9.py render 05 --only S05-22 -j 1 --force` → `ok`; sheet `/tmp/yt01_s05_22_fix.png` (8 tiles). Layout inspector reports 3× `Line runs through the text` for the intentional fig. 2.2 strike (was `no problems` when the line sat below the labels).

## Unfinished

Eight of nine Group B primaries end with `layout: no problems`; S05-22 retains the three strike-through crossing flags above.
