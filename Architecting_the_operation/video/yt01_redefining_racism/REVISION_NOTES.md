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
