# Brief: YT02v2 manimgx fixes, round 2 (defects from review)

Same file rules as `Architecting_the_operation/video/yt02/MANIM_FIX_V2_BRIEF.md`. Never run git.

Claude reviewed `logs/stills_v2/` and found these defects. Fix each one, re-render the same stills, and report.

1. **`tier_pyramid.py:TierPyramid` (S02-03/04/05).** It must be a real pyramid: five stacked trapezoids, widest at the
   bottom, centered, filling about 70% of the frame height above the caption band.
   - Labels sit **outside** the shape on the right, each joined to its tier by a leader line: E · Elite, P · Puppet
     Class, F · Enforcement Class, I_buffer · Buffer Class.
   - O_racialized sits at the base, with the adjacent Out-groups as a smaller block beside it, fully in frame.
   - Every label must have a contrast ratio of at least 4.5:1 against what is behind it. The current Buffer Class
     label (white on cream) is unreadable.
   - Each tier lights up on the word that names it.
2. **`rlc_teach.py:RLCTeach` (S05-24/26).** Hold stills show a bare circuit with a stray "," glyph. Each shot must show
   its own stage:
   - S05-24: the components, each labeled with its meaning in the framework (R, L, C), brought in one at a time.
   - S05-26: the circuit on the left, an oscilloscope panel on the right drawing the damped trace, and the equation
     beneath with the current term highlighted.
   Remove the stray glyph. Every label is readable at 960×540.
3. **`wage_phasor.py` (S09-01, S09-36 and every shot it serves).**
   - "W = ψ_m + jψ_s" overlaps "ELITE · EXTRACTION": move the equation to the upper right, under "EQUATION 3.5".
   - "PSYCHOLOGICAL STATUS ψ_s (+j) / DEFERENCE · BADGE · RANK" overlaps "ψ_s = |W| sin θ": put the axis label at
     the right end of the ψ_s axis, below the axis line, and move the cos/sin pair to a right-side column clear of it.
   - The Quadrant II box must not cover any axis label.
4. **`interference_engine.py` (S12-05).** "Δφ = 0.20π" sits on the gold wave: move it below the third wave's
   trough.
5. **The overlap check must actually run.**
   - `layout_v2.assert_no_overlap` must compare the bounding boxes of every Text, Tex and MathTex pair present at each
     hold, in every scene, including the hero.
   - Remove the skips. Where a label intentionally sits on an axis line, exempt lines, never other text.
   - Run it on all 13 stills and paste the result (pairs found / 0) into `logs/manim_fix_v2.md`.

Then run `YT_EP=YT02v2 … edit16x9.py check` again, which must report 0 problems.
