# Brief: minutes 7–12, fix pass for package F (frame review of `min7_12_F_v1.mp4`)

Read `BRIEF_MIN7_12_BUILD.md` (its Rules, Checkpoint and Standard all apply),
`STORYBOARD_MIN7_12.md` §ImplicitTrace, §IATLatency and §AllportQuestion, and
`FINDINGS_MIN7_12.md` §Package F.

**Files you may write:**
- `min7_12/f/*`;
- `tools/check_min7_12_f.*`;
- a "Fix pass 1" section in `FINDINGS_MIN7_12.md`.

**Frames:** the review frames are `outputs/YT02v2_ov/video/stage_runs/f_v1/e<episode-seconds>.jpg`,
and the render starts at episode 497.8 s. Open and look at every one before you change code.

**The problem:** the check passes, and the picture still does too little. The rule this pass adds:
**every box on screen holds its content at its last beat.** No panel, card or window may stay
empty or mostly empty. A container sized for content that never arrives is a defect. Size the
container to its content, or give it the storyboard's content. Add an assert to the check: for
every `data-shape` frame, the declared text boxes inside it cover enough of it at the scene's last
frame (a fill-ratio assert, with the threshold documented).

## Defects

1. **`ImplicitTrace`, turns 41–42 (`e500`, `e508`, `e515`, `e524`, `e531`).**
   - **Definition card:** it is ~340 px tall, with text only in its top 120 px. Size it to its
     content.
   - **Duplicate heading:** the "PAST EXPERIENCE" column shows the heading twice ("PAST
     EXPERIENCE" and "PAST EXPERIENCES"), and its three trace boxes are empty. Show the storyboard's
     trace tokens with their labels.
   - **Empty panel:** the "INTROSPECTIVELY UNIDENTIFIED TRACE" panel is an empty navy rectangle.
     Show the trace the storyboard describes, a faint path that steers the reaction.
   - **Turn 42:** the belief lane and the association lane float with large empty gaps. Lay out
     the turn-42 picture as one composition: the belief and the automatic association both feed
     the one person and the reaction. Keep it balanced in the frame.
2. **`IATLatency`, turns 43–45 (`e536`, `e545`, `e552`, `e558`).**
   - **Citation card:** its first state shows only "ANTHONY GREENWALD" in a large empty card.
     Build the card to its final size from the start, and fill it as the names are spoken.
   - **Stimulus window:** it is empty. Show the derived sorting trial: a face mark (`PersonMark`)
     and a word chip in the centre window, with the pairing labels on the left and right keys.
     These are derived illustrations with no test score, as the storyboard says.
   - **Turn 45:** the "FIELD-AUDIT MEASURE" rows are empty boxes, and the "BIAS" meter is an empty
     box. Give the audit rows their storyboard content, and draw the judgment-weighting meter with
     its needle at the joined reading.
   - **Sourcing:** remove "JPSP 74(6)" from the source line. Turn 43 may show only the narration's
     details: the three names, 1998, *Journal of Personality and Social Psychology*, and
     "Implicit Association Test". The source line reads "Greenwald, McGhee & Schwartz 1998 ·
     Journal of Personality and Social Psychology".
3. **`AllportQuestion`, turn 46 (`e563`, `e570`, `e578`).**
   - **Term blocks:** the bias and prejudice blocks show their icons and titles over empty space.
     Size them to their content, or add the one-line summaries "STARTING TENDENCY" and "GROUP
     ANTIPATHY", which the earlier turns already used.
   - **Allport card:** at `e578` it shows only "1954 · GORDON W. ALLPORT" in a large empty card.
     Show the full storyboard card: *The Nature of Prejudice*, p. 9, with its source line, sized
     to its content.

## Done means

All of these pass:
- episode tsc;
- `check_min7_12_f`, with the new fill-ratio assert;
- every other check listed in `BRIEF_MIN7_12_BUILD.md`;
- `check_antithesis.py` on your files.

Then append "Fix pass 1".
