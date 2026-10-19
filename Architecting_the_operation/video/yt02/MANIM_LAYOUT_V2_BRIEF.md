# Brief: YT02v2 manimgx layout fixes (Codex)

**Never run git. Edit only these files:**
- `Architecting_the_operation/video/yt02/wage_phasor.py`
- `Architecting_the_operation/video/yt02/interference_engine.py`
- `Architecting_the_operation/video/yt02/rlc_teach.py`
- `Architecting_the_operation/video/yt02/tier_pyramid.py`
- `Architecting_the_operation/video/yt02/layout_v2.py`

**Write** `Architecting_the_operation/video/yt02/logs/manim_layout_v2.md`. Do not touch `yt01_redefining_racism/`,
`Paper/`, the shot list, the cue words (they are now correct; keep every `self.at(k, "<word>")` word unchanged), or
the timing.

Context:
- `Architecting_the_operation/video/yt02/REVISION_v2_FEEDBACK.md`, items 22–25 and 29, and section F;
- `logs/manim_fix_v2.md`.

Axis convention (keep it): +ψ_m points down, extraction points up toward the Elite, ψ_s points right, and
Quadrant II sits upper-right. The caption band is y < −2.9: nothing goes there.

## Acceptance test: the storyboard overlap boxes
`manimgx inspect <scene.py>` (run it with `YT_EP=YT02v2` and the shot env var the scenes use, as
`edit16x9.py sheet` does) draws a red box around every layout problem and lists them. For every shot below, at every
sampled moment, the inspector must report **zero** problems of these kinds:
- text overlapping text;
- text overlapping a shape;
- anything outside the frame;
- anything in the caption band.

The only exemption is a label deliberately placed on its own axis line, and it must be whitelisted explicitly in
`layout_v2.py` with a comment.

Shots:
- S02-03, S02-04, S02-05 (TierPyramid)
- S05-24, S05-26 (RLCTeach)
- every WagePhasor shot in `Architecting_the_operation/video/YT02v2_shotlist.md` (at least S09-01, S09-36 and every
  hold)
- every InterferenceEngine shot (at least S12-01, S12-05, S12-13, S12-14 and the holds)

## Required changes
1. **WagePhasor.**
   - Title and "EQUATION 3.5" form the top band.
   - The W = ψ_m + jψ_s equation sits under "EQUATION 3.5" at the upper right.
   - The ELITE · EXTRACTION label sits at the top end of the vertical axis, clear of the title.
   - The ψ_s axis label goes below the axis line at its right end.
   - The cos/sin pair goes in a right-side column. The per-shot caption lines (e.g. "ROTATION REDISTRIBUTES") go in
     one fixed slot above the caption band.
   - Readouts (Φ_load, ρ_τ, θ) share one readout column.
   - The Quadrant II box covers no label.
2. **InterferenceEngine.**
   - The waves take the left 55%. The right column holds the Elite node and its labels.
   - Panels that arrive later (the "CONFIDENCE TIER 2" table, "SPECTRAL EVIDENCE · CHAPTER 22", the axis list)
     replace earlier right-column content (FadeOut, then FadeIn). They never stack over the waves or each other.
   - The Δφ, SUM and Φ_load readouts sit in a row below the third wave.
3. **RLCTeach.** On a 960×540 frame:
   - The circuit occupies the left half and the oscilloscope panel the right half, fully inside the frame.
   - Add the equation stage (S05-26): the series RLC equation from `rlc_topology16x9.py` / the book sits beneath both,
     and each term is highlighted on its cue word.
   - Component labels sit beside their components with no overlap. Remove the stray "," glyph at the right of the
     circuit.
4. **TierPyramid.**
   - A true pyramid: five stacked trapezoids with a shared slope, widest at the base, centered, about 70% of the
     usable height.
   - Labels sit to the right of the shape, joined by leader lines.
   - The adjacent Out-groups sit as a block beside the base, inside the frame.
   - Contrast is at least 4.5:1 for every label. Keep the existing light-up cues.

## Verify and report
- Render: `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 02 05 09 12 --only S02-03 S05-24 S09-01 S12-01 -r 960x540 --fps 15 -j 4`
- Sheet: `… sheet 02 05 09 12 --only <all shots above> -r 960x540 --fps 15`
- Check: `… check` must report 0 problems.

In the log, include:
- a per-shot table of inspector problem counts, before and after;
- the paths of the final storyboard PNGs;
- the check summary.

Stop only when every count is 0.
