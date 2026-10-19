# Brief: YT02v2 manimgx fixes

**Never run git. Do not touch `Paper/`, Figma or audio. Write only:**
- `Architecting_the_operation/video/yt02/*.py` (new files and edits);
- the `Render:` lines of `Architecting_the_operation/video/YT02v2_shotlist.md` for the shots named below;
- stills under `Architecting_the_operation/video/yt02/logs/stills_v2/`;
- the report `Architecting_the_operation/video/yt02/logs/manim_fix_v2.md`.

**Do not edit any file under `yt01_redefining_racism/`.** Import from it, or copy into `yt02/`.

Read first:
- `Architecting_the_operation/video/yt02/REVISION_v2_FEEDBACK.md`, sections D (items 22–25, 29), F and G;
- `Architecting_the_operation/video/yt02/NEW_SCENES_v2.md`;
- an existing scene's structure (`yt02/wage_phasor.py`), which shows how one class serves many shots via per-shot
  methods and the `YT02_SHOT` env var;
- `edit16x9.py` (in `yt01_redefining_racism/manim/`), which shows how runs are rendered.

The episode is `YT_EP=YT02v2`. Narration words and timings for any shot come from
`YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <seg> --only <primary>`.
Elements animate on the word that names them.

## Global rules
- **Caption band:** y below −2.9 (frame units) is reserved for captions. No scene element may enter it.
- **No overlaps:** no two text mobjects' bounding boxes may intersect on any frame. Add a helper
  `assert_no_overlap(scene)` in `yt02/layout_v2.py`, and call it at each hold.
- **Axis convention:** positive ψ_m points **down**, extraction (ψ_m < 0) points **up** toward the Elite, and
  ψ_s points right. θ is measured from +ψ_m (down) toward +ψ_s. Quadrant II sits upper-right.
- Use the YT02 palette from `common16x9.py`. On-screen text uses no antithesis.

## Tasks
1. **`yt02/wage_plane_hero.py:WagePlaneHero`.** Build the spec in NEW_SCENES_v2.md and feedback section G:
   number line → complex plane → z→W term assignment with `TransformMatchingTex` → `Rotate(-PI/2)` with ×(−j) →
   invariants → θ sweep with `always_redraw` projections. Cover shots S10-06, S10-11, S10-16 and S10-20.
   Afterwards, `edit16x9.py check` must report 0 problems.
2. **`yt02/wage_phasor.py`.** Convert it to the axis convention above (axes, quadrant labels, the θ arc, the Quadrant II
   box and the readouts). Fix the overlaps seen in v1 S09-01 and S09-36: "PSYCHOLOGICAL STATUS" against the θ-range
   label, "DEFERENCE · BADGE · RANK" against the caption, and the Φ_load/ρ_τ readouts against the Quadrant II label.
   Give the ψ_m = |W|cos θ and ψ_s = |W|sin θ equations term highlights on their words.
3. **`yt02/interference_engine.py`.** Fix the S12-05 overlaps, where the chapter labels (CH 0, CH 14, CH 22),
   "NOVEMBER 1787 · MADISON" and the axis list (RELIGION, REGION…) stack on each other. Give each group its own
   column or sequence them so each one fades before the next appears.
4. **`yt02/rlc_teach.py:RLCTeach`.** This is the teaching sequence for the first RLC appearance, the shots now
   rendering `rlc_topology16x9.py:RLCTopology`:
   - (a) each component alone, with its meaning in this framework: R = resistance/friction, L = inertia/induction,
     C = stored grievance/charge. Use the book's terms; read them from `rlc_topology16x9.py` and `Paper/The_Original_Power.tex`.
   - (b) the series circuit assembles.
   - (c) an oscilloscope trace shows the damped oscillation. Reuse `backlash_oscillator16x9.py`.
   - (d) the equation, with each term highlighted as it is named, while the circuit and the scope stay on screen.
   Point those shots' `Render:` lines at it.
5. **`yt02/tier_pyramid.py:TierPyramid`.** This is one pyramid for every five-tier shot rendered in manimgx (the
   tier walk-through shots S02-03 … that now use `orthographic16x9.py:Orthographic16x9`). It has five labeled tiers,
   and the adjacent Out-group sits fully inside the frame with a margin of at least 0.4. Point those shots at it.
   Leave the Figma ortho shots alone.

## Verification
For every new or edited scene, render a still at each shot's hold point with manimgx (shell unsandboxed). Save them
as `logs/stills_v2/<shot>.png`. Run `edit16x9.py check` with `YT_EP=YT02v2`.

The report lists:
- each file changed;
- each shot repointed;
- the still paths;
- the check summary;
- anything left undone.
