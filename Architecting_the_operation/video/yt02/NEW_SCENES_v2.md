# YT02v2 — new manimgx scenes

Primary runs whose `manim:` module or class is not built yet. Ordered by segment.

## S10-06 — `yt02/wage_plane_hero.py:WagePlaneHero`

- **purpose:** Single continuous complex-wage plane hero (revision G): number line → plane → vector → variable assign → quarter turn → invariants → θ sweep.
- **turns:** S10-06–S10-23 (holds on `S10-06`; global turns 326–343 for the plane build; caption band reserved below).
- **beats:**
  - **number line:** `NumberLine` −3…3; dot at +2 then −2 on “one line, two directions”.
  - **plane:** vertical through 0 → `ComplexPlane`; “j” on “square root of negative one”.
  - **vector:** z = a + jb dot → arrow; projections, |z|, θ; cos θ / sin θ on each projection.
  - **assign:** `TransformMatchingTex` z→W, a→ψ_m, b→ψ_s; axis labels Re→material ψ_m (green), Im→status ψ_s (gold).
  - **quarter turn:** `Rotate(plane_group, -π/2)` on “quarter turn clockwise”; show ×(−j); ghost prior arrow; Elite marker top, ψ_m down, ψ_s right.
  - **invariants:** |W| and θ before/after with equal signs; quadrant labels settle (Quadrant II upper-right).
  - **payoff:** θ sweeps 0°→>90° with `always_redraw` projections; land on Quadrant II extraction-up / status-right readout.
- **closest asset:** `yt02/wage_phasor.py:WagePhasor` (post-hero historical regimes); `yt01_redefining_racism/manim/complex_wage16x9.py:ComplexWage` (term-highlight patterns).

## Check summary

`edit16x9.py check`: **169 runs, 4 problems** (all four are missing `yt02/wage_plane_hero.py:WagePlaneHero` primary runs that share the hero render path until the module lands).

**Reused shots (render target on disk):** 544  
**New or missing-target shots:** 17 (hero run holds + primary, pending `wage_plane_hero.py`)  
**Total shots:** 561

`load_shots()` on `YT02v2_shotlist.md` returns **561** shots. Figma preview clips for this episode reuse `outputs/YT02/video/figma/` (symlink or copy into `outputs/YT02V2/video/figma/` before `check` if that folder is empty).
