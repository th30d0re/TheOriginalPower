# Brief: minutes 7–12, fix pass for package E or H (frame review of `min7_12_E_v1.mp4` / `min7_12_H_v1.mp4`)

The prompt's first line names the package: `PACKAGE: E` or `PACKAGE: H`. Do only that package.

Read these first:
- `BRIEF_MIN7_12_BUILD.md` (its Rules, Checkpoint and Standard all apply);
- your package's sections of `STORYBOARD_MIN7_12.md`;
- your section of `FINDINGS_MIN7_12.md`;
- `BRIEF_MIN7_12_FIX_F.md`, for the "every box holds its content" rule and its fill-ratio assert.
  Apply both here.

**Files you may write:**
- `min7_12/<x>/*`;
- `tools/check_min7_12_<x>.*`;
- a "Fix pass 1" section under your package in `FINDINGS_MIN7_12.md`.

**Frames:** the review frames are in `outputs/YT02v2_ov/video/stage_runs/e_v1/` and `h_v1/`.
They are named `e<episode-seconds>.jpg`; the RLC ones are `r<seconds>.jpg`. Open and look at
every one before you change code.

**Rules this pass adds, on top of the build brief:**
1. Every box holds its content at its last beat. No empty or mostly empty panels, cards or windows.
2. A label that has faded out is fully absent. No ghost text sits under other text.
3. No internal labels on screen: no turn numbers ("TURN 63"), cue names or file names.
4. Each scene's final frame is a balanced composition. No large empty band takes up more than
   about a third of the safe area.
5. An equation is the largest element in its beat. Eq. 2.8a, and Eq. 2.11 when it assembles, are
   set at 34 px or more, centred, with each term's chip above or beside it.

## Package E defects

- **`DocumentedExpectation`, turns 35–36 (`e428`, `e434`, `e441`, `e449`).**
  - **Small equation:** the Eq. 2.8a strip is small and left-aligned in an empty band. Set it
    centred at 34 px, as in turn 34, or drop it to a source-line reference if the storyboard
    allows.
  - **Empty card:** the "BLACK WOMEN" card is ~270 px tall, with content only at its top. Size it
    to its content.
  - **Series plot:** it is empty at `e441`. Draw it from the first frame of the NCHS beat. It must
    read as qualitative, with the label "QUALITATIVE · NO RATES SHOWN" and no axis numbers.
  - **Ghost label:** a faint "STARTING EXPECTATION" sits behind the plot's top right at `e449`.
    Remove it.
- **`InstalledRouting`, turn 37 (`e457`, `e463`).**
  - At `e457` the three right-hand boxes are empty frames. Draw each box only when its content
    arrives.
- **`RLCBridge`, turn 38 (`e470`, `e477`, `r473`, `r476`, `r479`).**
  - **Empty preview box:** the lower box stays empty until the last second. Bring the circuit or
    the preview in step with the spoken words: inductance, resistance and capacitance as each is
    said.
  - **Cramped close:** Eq. 2.11 is small (≈20 px) and squeezed under the component list, and the
    derived damping preview is a 60 px strip whose curve is almost flat, with crowded labels.
    Re-lay the final state so that:
    - Eq. 2.11 is large and centred;
    - the preview has at least 200 px of height, showing a visible underdamped curve (shock,
      overshoot, decay) with the "DERIVED" label and its R sweep;
    - the component list compresses to chips.
  - **Equation typesetting:** `Lq̈ + Rq̇ + (1/C)q = V(t)` has uneven gaps. Use `EquationTerms`
    tokens throughout, so the widths come from the glyph advances.
- **`ExplicitImplicitChannels`, turns 39–40 (`e483`, `e490`, `e496`).**
  - **Turn 39:** the "BIAS" card and the "EXPLICIT" lane float in the top half, and the implicit
    lane is missing at `e483`. Build both channels as the storyboard specifies, filling the frame.
  - **Citation card:** at `e490` it shows only the names in a ~300 px empty card. Build it to final
    size, filled as each element is spoken: names, 1995, title, and *Psychological Review*
    102(1), which is in references.bib 4226.

## Package H defects

- **`UnequalTreatment`, turns 55–56 (`e676`, `e683`, `e690`).**
  - **Empty cards:** the middle and right cards hold empty placeholder frames at `e676`, and the
    outer panel has ~120 px of empty space below the cards. Size the panel to its content.
  - **Treatment cards:** at `e690`, two of the four cards are present in a large empty panel, and
    a ghost header sits at its top left. Lay out all four card slots from the start, filled as each
    is spoken: verbal exclusion, worse customer service, biased grading, refusing to rent. Remove
    the ghost header.
- **`InterpersonalClass`, turns 57–61 (`e698`, `e705`, `e712`, `e718`, `e726`, `e735`).**
  - **Empty lower half:** at `e698` and `e735` the lower half is empty. Keep one full-frame
    composition through all five turns.
  - **Term blocks:** they have empty middles. Show the one-line summaries "STARTING TENDENCY",
    "GROUP ANTIPATHY" and "UNEQUAL TREATMENT".
  - **State-power rack (turn 60):** it is small, with faint items. Give it its own clear region
    and show all five items at full strength as each is spoken: state legislatures, appellate
    courts, police departments, credit markets, military force. Its title reads "REQUIRES ZERO
    CONTROL OVER".
  - **Ghost header:** at `e745` a faint "INTERPERSONAL CLASS OF SOCIAL BEHAVIOR" sits under "THE
    ORIGINAL POWER". Show one header.
- **`LiteratureBoundary`, turn 62 (`e745`, `e751`).**
  - **Empty lower panel:** the literature panel's lower half is empty. Size it to its content.
  - **Internal label:** "TURN 63 · STRUCTURAL ARGUMENT BEGINS" is an internal label, and the box
    under it is an empty dashed frame. Replace it with the storyboard's on-screen string for the
    hand-off to the book's structural argument ("THE ORIGINAL POWER · STRUCTURAL ARGUMENT", or the
    storyboard's exact wording). Show the next section's subject in the frame: racism as an
    institutional extraction system, stated in equations and tested against historical archives.

## Done means

All of these pass:
- episode tsc;
- your package's check, with the fill-ratio assert and an assert that no on-screen string matches
  `/\bturn \d+\b/i`;
- every other check listed in `BRIEF_MIN7_12_BUILD.md`;
- `check_antithesis.py` on your files.

Then append "Fix pass 1".
