# YT01 scenes — revision pass (applies to every group)

Your first pass met the mechanical gate (renders, no layout problems). The reviewer looked at one
frame per shot and the visual bar is not met yet. Same rules as `SCENES_TASK.md` (own files only,
never run `git`, no helper files in the repo, never touch `Paper/`).

## See what the reviewer sees

```
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet <seg> --only <run id> -o /tmp/<id>.png
```

draws one tile per shot: the frame the viewer sees near the end of that shot's turn. Open the PNG
and judge your runs by it, after every change.

## Standards

1. **Fill the frame.** The main diagram spans at least ~10 of the 14.2 units of width, or ~5 of the
   8 units of height. Nothing clustered in a corner or a small central strip with empty navy
   around it. A heading at y ≈ 3.3, the diagram below it, using the space.
2. **Readable type.** Labels inside boxes ≥ 34 px (`T(..., 34)`); headings 44+; only footnotes,
   sources and axis ticks may sit at the 28 px minimum. No `MathTex` panel whose symbols render
   under ~40 px: give equations room.
3. **Every shot changes the picture.** One visible beat per turn, on a word of that turn: a new
   element, a transform, a highlight moving, a value changing. **No two consecutive tiles of a run
   in the sheet may look the same.** The shot's `Note` (printed by `turns`) is the spec for that
   beat: implement what it says.
4. **Nothing overlaps.** No text over images, no arrows through labels, no label fading under
   another. The inspector does not catch every overlap; the sheet does.
5. **Book figures are rebuilt**, never pasted page stills: draw the figure's own geometry and data
   from the TikZ/pgfplots in `Paper/The_Original_Power.tex` (read-only).

## Run-specific notes

### Group B
- S04-01: the five-tier stack is tiny in the top-left; make it large on the left half, timeline across the bottom, the O_racialized field visibly expanding on the right.
- S04-10, S04-16: axes and boxes are small; scale up. S05-01, S05-21: three-box chains are a thin strip; boxes ≥ 3.6 wide, 36 px.
- S05-22 (Figure 2.2): S05-23 to S05-26 are the same picture; each shot adds its beat per its Note. Fill the frame.
- S06-29 (Figure 2.3): small stacks, five near-identical shots; make the two hierarchies large and give each shot its beat.

### Group C
- S07-01: small box list; S07-05 shows empty rectangles; S07-06 is a bare word list. Build the virus schematic large and make each shot add its component.
- S07-07: small; S08-25/26: tiny dots and small equation boxes. Scale up.
- S20-01: seven shots (S20-01, S20-05 … S20-09) look the same. Give each its beat per its Note.

### Group F
- S17-52: the phasor circle is small and repeats over six shots; make the unit circle large beside the equation and give each shot its beat (arrows align, spread, cancel, the 1968–1990 dispersal).
- S19-01: stack small; scale up.
- S20-23 (Figure 2.9): **rebuild** as an animated line chart from the pgfplots coordinates in the tex (search `fig:elite_wealth_accumulation`, around lines 2620–2710): the top-0.1% wealth-share series, the 1935–1973 and 1973–2020 shaded eras, the dashed 25% line, the event markers; draw the line on its cue, mark ~25% in 1929 and ~24% in 2020. Text currently overlaps the image at S20-31.
- S21-01: twelve near-identical shots. Each turn changes something: the active mode's lane lights and an example from that turn appears in it.
- S22-02: the equation panel's math is small; make the current equation large.

Update your findings file `logs/scenes_<letter>.md` with what changed per run.

---

## Round 2: groups A, D, E (reviewer: sheets of SEG 02, 09, 13; judge your other segments the same way)

Every standard above applies. Run `sheet` on **every** segment you own, fix, re-render, re-sheet.

### Group A
- S02-01 (set primer, 19 shots): the box sits in a small central strip with the symbols (∪, ∩, ∅, the
  dotted cup) at ~30 px floating unlabeled. Make the universe box fill the frame, and give each symbol
  a large `MathTex` with its name beside it on its own turn. S02-04/05 and S02-13/14 are identical
  tiles: each needs its beat. From S02-15 on, translucent rectangles pile up across the I/E labels;
  replace them with one clean partition picture. The run must end on Equation 2.1 itself,
  `U = I \,\dot\cup\, O` and `I \cap O = \varnothing`, large, assembled from the symbols the
  primer just taught, so the viewer can read it aloud. Use `\dot\cup` (not a floating dot over U).
- Check S01-02 and S03-50 (orthographic cone, scale ~1.3x) and S03-46 (Figure 2.1 rebuild) against
  the standards; Figure 2.1 is two large side-by-side boxes (I with four tiers, O with three layers)
  filling the frame.

### Group D
- S09-13 / S09-14 are the same picture (GIN box and acreage grid, small, in the middle of the frame).
  S09-13 shows the gin lowering processing cost; S09-14 grows acreage and the enslaved-labor demand
  bar on its own word. Fill the frame. S09-16 (Nat Turner): the chart is small and the response label
  sits on top of the title; make the coherence-risk line large, the spike and the slave-code response
  on their words, labels clear of each other.
- Judge S10-01 to S12-20 the same way (zero-day, cline, botnet, Bayes, recompile, cost bars).

### Group E (your SEG 16 files are owned by another worker right now: touch only
`rlc_topology16x9.py`, `backlash_oscillator16x9.py`, `resonance_sweep16x9.py`,
`suppression_envelope16x9.py`, `coherence_threshold16x9.py`, `backlash_wave16x9.py`)
- S13-01 / S13-06 (Figure 2.5): the circuit is a small box; draw the series loop across the frame
  with the source, R, L and C large and their institutional labels (bureaucratic and carceral
  friction, cultural inertia and institutional entrenchment, token-reform absorption capacity)
  beside each part on its turn.
- S13-14 to S13-21: eight near-identical tiles of a static envelope. Each turn moves the charge:
  the 1865 impulse drives q up, the back-EMF overshoots into q < 0 (Black Codes, Convict Leasing
  labelled in the extraction zone), the 1964 smaller impulse, the second overshoot (War on Drugs,
  Mass Incarceration). Draw the curve as it happens, on the words.
- S13-22 to S13-26 (Figure 2.6): five identical tiles. Build the book's figure: the damped wave
  across the full width with the q = 0 extraction baseline, the decay envelope, the two shock and
  overshoot cycles labelled, "illustrative parameters" on screen; each turn adds or highlights one
  element (envelope, alpha rising as R expands, convergence to baseline).
- S13-27/28/29 (resonance): small; make the response curve large, sweep omega toward omega_0 on its
  word, show q_res and Q_f large.
- Judge SEG 14 and SEG 15 (envelope, Figure 2.8 race, backlash-wave panels) the same way.

---

## Round 3 (reviewer sheets of SEG 02 and SEG 13 after round 2)

### Group A: S02-01 primer
- **Mathematical error:** from S02-11 on, the I and O boxes overlap with a gold band, and the
  overlap stays on screen while the narration says "I intersection O equals the empty set" and
  "disjoint union". Show intersection on a separate generic example (two overlapping sets A and B)
  when the turn defines ∩; for I and O, slide the boxes apart on the empty-set turn so they share
  nothing, and keep them apart through the disjoint-union and partition turns.
- Headers collide: "NOTATION KEY" sits on top of `x \in E,\ E \subset I` and "ELEMENT OF · SUBSET OF"
  (S02-07 to S02-10); "OR · AND" floats unattached. One heading line, one symbol line under it.
- S02-04 and S02-05 are still identical; S02-13 and S02-14 nearly so.
- S02-18: the grid lines cross the gold band and the dots; clean them.
- S02-19 (end of the run): Equation 2.1 is small on an empty frame. Make it the hero: ≥ 72 px,
  centered, the symbols each tinted the colour the primer gave them.

### Group E: SEG 13
- **Wave bug:** S13-14 to S13-26 draw the damped oscillation as a solid red slab. The book's pgfplots
  expression `1.6 * exp(-0.35 * x) * sin(110 * x)` is in **degrees** (pgfplots' default), so the
  angular frequency is 110° per unit ≈ 1.92 rad per unit, about 3.4 cycles over x ∈ [0, 10]. You
  used 110 rad. Use `sin(np.radians(110 * x))`, draw a stroked curve (no fill), and let the
  envelope ±1.6 e^{-0.35x} sit dashed behind it.
- S13-01: the five-tier legend overlaps the circuit and "KINETIC SUPPLY". Drop the legend or move it
  clear; the circuit fills the frame.
- S13-04 / S13-05: the "Lowercase q of t represents the equality-surplus charge" callout runs over
  the term list. Give it its own line below the terms.
- S13-15 to S13-21: once the wave is a line, each turn's beat must still differ (the impulse, the
  overshoot into q < 0 with its label, the second smaller impulse, its overshoot).

### Group D (round 3; you may also edit the card JSON named here: cards/S10-12.json, cards/S10-19.json)
- **Misattribution, highest priority:** the S10-19 quote card presents the chapter's own sentence
  ("The chapter records infant killing and Darby's dose…") as a quote attributed to "Thomas
  Thistlewood diary". It is the book's summary, not Thistlewood's words. Make it a `source`-style
  card (no quote marks) attributed to *The Original Power*, §2.3.3, stating the documented facts in
  the chapter's terms; the 14,000-page diary is the record the book cites. Also fix the S10-20 tile,
  where footer lines overlap the source line.
- S10-12 (Yurco, Seti I Book of Gates) renders as a title over an empty frame: give it its body from
  the chapter (four peoples, Egyptians, Nubians, Asiatics, Libyans, arrayed by skin color in one
  procession; distinguished, none ranked).
- S10-05 / S10-10 (cline): "7 ka", "10 ka", "HUXLEY 1938" and "aDNA" collide; space them on the axis
  and make the gradient bar span the frame.
- S10-15 to S10-23 (botnet): small dots with no routes, and the "PACKING GEOMETRY" box sits on the
  city labels. Draw the network large (Africa to the Caribbean and the American plantations, output
  routed to Lisbon, London, Amsterdam, Wall Street) with routes animating on their words; put
  labels clear of each other.
- S09-16 (Nat Turner): the tau label is tiny and "…-MANAGEMENT RESPONSE" is clipped at the bottom.
- S10-01 (zero-day): the schematic crowds the left; fill the frame.
