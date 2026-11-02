# Brief: minutes 3–7, fix pass for packages C and D (frame review of `min3_7_CD_v1.mp4`)

Read these first:
- `BRIEF_MIN3_7_BUILD.md`: Rules, Checkpoint and The standard.
- `STORYBOARD_MIN3_7.md`: the sections for UsThemSorting, HostWetware, BiasDefinition,
  PredictiveCoding, ComputationalBias and InstalledRacialPrior.
- `FINDINGS_MIN3_7_C.md` and `FINDINGS_MIN3_7_D.md`.

**Files you may write:**
- `min3_7/c/*` and `min3_7/d/*`.
- `tools/check_min3_7_c.*`, `tools/check_min3_7_d.*` and `tools/layout_audit.*` (new).
- A "Fix pass 1" section in each of the two findings files.

`min3_7/shared/` is read-only; work around any problem locally. Do not change git state. Do not
render.

**Frames are attached to this prompt as images.** They come from
`outputs/YT02v2_ov/video/stage_runs/cd_v1/`, and each file is named
`e<episode-seconds>.png`. Look at every one before you change code. Package D's first run was cut
off by a usage limit before it finished. Its layout is unfinished, and its check stops at an
over-strict assert.

## The two rules this pass enforces, everywhere in C and D

1. **Safe area.** Every element sits inside x 60–1860, y 70–1010. Nothing may sit in the
   border-notch zones: x 880–1040 within 90 px of the top or bottom edge.
2. **No collisions.**
   - No text box overlaps another text box.
   - No line, curve or shape crosses a text box. A leader line may touch a label's edge.
   - When a beat replaces a picture, the old picture is **fully absent** (opacity 0) or clearly
     separated in its own region. Never leave it faint underneath.

## Layout audit (new)

Write `tools/layout_audit.ts(x)`. It exports a function that takes rendered static markup and
returns the absolute boxes of:
- every element marked `data-text`;
- every element marked `data-shape`, carrying `{x, y, w, h}`, with its opacity.

Mark every text element and every major shape in the C and D scenes with these attributes, plus
the box values from your layout constants. In `check_min3_7_c` and `check_min3_7_d`, at every
sampled frame, assert rule 1 for everything with opacity > 0.05, and rule 2 for every pair with
opacity > 0.05.

## Package C defects

- **`UsThemSorting`, turn 24 (`e294.png`).**
  - The function chips sit on the person marks and on the "US" and "THEM" titles: TRUST, THREAT
    DETECTION, SELF-CONCEPT, RECIPROCITY, BELONGING and BOUNDED GROUPS.
  - "SMALL BANDS + ALLIANCES" sits on marks.
  - The band ellipses overlap the marks.
  - Move the chips into the margins around the field, joined by leaders, and keep the "US" and
    "THEM" titles clear.
- **`HostWetware`, turns 25–27 (`e304.png`, `e314.png`, `e324.5.png`).**
  - The input labels "IN 1–4" sit on the input circles.
  - Small person glyphs overlap the network nodes.
  - At turn 27 the network and its labels stay faintly visible under the ancestral-band circle.
    "ALLY" and "STRANGER" are duplicated, and "UNKNOWN" sits under a glyph.
  - Give turn 27 a clean picture: hide the old state completely, or move it to a separate region.
- **`BiasDefinition`, turns 28–29 (`e335.5.png`, `e346.5.png`).**
  - The three concept blocks are empty boxes.
  - A large faint "PROCESS" panel sits behind everything, and the "ACT" box floats unattached.
  - In turn 29, the definition card is about 360 px tall with text in only its top 100 px, and a
    faint panel shows behind the sliders.
  - Size each block and card to its content, give each block its storyboard content, and remove
    the faint background panels.

## Package D defects

- **`PredictiveCoding`, turns 30–31 (`e360.png`, `e367.5.png`, `e382.png`).**
  - The question "Why does the brain carry bias at all?" renders at y ≈ 26, on the top border.
  - The precision gauge renders at the top-left corner, outside the safe area and over the
    title.
  - "GUESS" and "UPDATE" overlap curves.
  - "BIAS = A TILT IN THE STARTING ASSUMPTION" overlaps the panel title.
  - Re-lay the scene inside the safe area using the storyboard's layout boxes. Put the gauge in
    its storyboard box.
  - The check currently asserts that "POSTERIOR" is absent before `t33Bayesian`. The storyboard
    brings turn 31's plot back at `t33Book`, so drop that assertion, and keep only the
    assertions that match the storyboard.
- **`ComputationalBias`, turn 32 (`e392.png`, `e399.5.png`).**
  - The title "COMPUTER SCIENCE · TWO USES OF BIAS" sits on the top border, partly hidden.
  - The training-text strips render over the left panel and its title "NEURAL NETWORK BIAS
    TERM".
  - "CONSTANT INPUT" sits on network lines.
  - Give the strips their own region, feeding the right panel.
- **`InstalledRacialPrior`, turns 33–34 (`e405.png` to `e424.5.png`).**
  - **Equation band and gauge:**
    - At turn 33 the equation band is an empty box.
    - The gauge sits at the top-left, outside the safe area, over the equation.
    - Build the equation term by term as the storyboard specifies, in its band, with the gauge in
      its own box (x 1390–1760, y 320–700).
  - **Prior curve:** the prior is drawn as a flat red line at the top of the plot. It must be a
    Gaussian centred on the prior mean, the same family as the evidence curve.
  - **Plot labels:**
    - The "INSTITUTIONAL REINFORCEMENT" and "INSTALLED RACIAL PRIOR / Π_{race}" boxes sit on the
      curves.
    - The "α = 0 · EVIDENCE-LED" and "α = 1 · PRIOR-LED" labels float.
    - Put each label at the gauge end it describes, or at the plot edge, clear of the curves.
  - **Turn 34:**
    - The final-state cards "ACCURATE", "OUTDATED" and "EARNED BY REAL HISTORY", and the history
      ribbon, render at y 0–80 on the border.
    - The storyboard puts the cards at x 300–1620, y 690–880, so the lower half is empty now.
    - The sociology glyph is an empty 30 px box; draw the APA sorting-field glyph.
- **The sweep.** At α = 0 the posterior mode sits at the evidence. At α = 1 it sits near the
  prior, and the evidence curve stays fixed throughout. Keep this verified, and keep the
  "DERIVED" label.

## Done means

All of these pass:
- Episode tsc.
- `check_min3_7_c` and `check_min3_7_d`, with the layout audit at every sampled frame.
- `check_min3_7_a`, `check_min3_7_b`, `check_min3_7_shared`, `check_minute_two`,
  `check_first_minute`, `check_roadmap_boot` and `check_dashboard`.
- The plan compile, byte-identical.
- `check_antithesis.py` on the files you touched.

Then append "Fix pass 1" to each findings file.
