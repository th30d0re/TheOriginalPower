# Brief: minutes 7–12, design pass for one package (after Flash fix pass 1)

The prompt's first line names the package: `PACKAGE: E`, `F` or `H`. Do only that package.

Read these first:
- `BRIEF_MIN7_12_BUILD.md` (its Rules, Checkpoint and Standard all apply);
- `BRIEF_MIN7_12_FIX_EH.md` and `BRIEF_MIN7_12_FIX_F.md`, which list the rules the first fix pass
  added. Keep every one of them;
- your package's storyboard sections and findings.

**Files you may write:**
- `min7_12/<x>/*`;
- `tools/check_min7_12_<x>.*`;
- a "Design pass" section under your package in `FINDINGS_MIN7_12.md`.

**Frames:** the current frames are in `outputs/YT02v2_ov/video/stage_runs/v2/e<episode-seconds>.jpg`.
Open and look at every one for your package before you change code.

**What this pass is for:** the bookkeeping is fixed. This pass is about design. Every scene should
read as one deliberate composition that fills the safe area, and its picture should carry the
idea of the narration.

**Rules this pass enforces:**
1. **Composition.** At every beat's settled state, content spans at least ~70% of the safe area's
   height. A picture that sits in the top half with an empty bottom half is a defect. Rebalance
   it: scale up, re-lay as a vertical flow, or centre it.
2. **Cards fit their text.** A citation or definition card is no more than ~40 px taller than its
   final text block. Build it at final size from its first beat, and fill it as each element is
   spoken.
3. **Size floor.** Body text is at least 28 px and labels at least 20 px, with no exceptions. Where
   a list does not fit at that size, reduce the list to chips or re-lay it.

## Package E (turns 35–40)

- **`RLCBridge` close (`e476`, `e479`).**
  - The component list is set at ~13 px. Re-lay it as five term chips (`TermChip`) at the floor
    sizes.
  - Set Eq. 2.11 at 40 px or more, centred, using `EquationTerms` tokens. Its terms are
    `Lq̈ + Rq̇ + (1/C)q = V(t)`.
  - Keep the derived damping preview at its current readable height.
- **`ExplicitImplicitChannels`, the Greenwald & Banaji card (`e490`, `e496`).**
  - It is ~300 px tall with content in its top third. Size it to its content.
  - Its full content: the names, 1995, the title, and *Psychological Review* 102(1) (bib 4226).
  - Pair it with the explicit/implicit picture so the frame is balanced.
- **`DocumentedExpectation` (`e434`).**
  - The "BLACK WOMEN" card sits at the top left with empty space below it. Rebalance the three
    panels into one row of equal height, or into one flow.

## Package F (turns 41–46)

- **`ImplicitTrace`, turn 41 (`e508`).**
  - The "PAST EXPERIENCE" column repeats its heading inside its chips ("PAST EXPERIENCE" ×3). Give
    the chips distinct trace content: "accumulated surroundings", "repeated exposure",
    "stored association".
  - The "REACTION" column is empty between "+ FAVORABLE" and "− UNFAVORABLE". Show the reaction
    needle, or a scale, being steered by the trace.
- **`ImplicitTrace`, turn 42 (`e524`, `e531`).**
  - The picture fills only the top 40% of the frame. Re-lay it as one centred composition: the
    belief lane and the association lane converge on the person, and the reaction sits below
    them.
- **`IATLatency` (`e552`, `e558`).**
  - The word window shows the placeholder "STIMULUS". Show a neutral example word chip instead,
    such as "pleasant" or "unpleasant". Remove the internal labels "TARGET GLYPH" and "VALENCE
    WORD".
  - The latency panel's lower half is empty. Size it to its two bars.
- **`AllportQuestion` (`e578`).**
  - The Allport card shows only "1954 · GORDON W. ALLPORT". Add *The Nature of Prejudice* and
    "p. 9" (bib 4207), and size the card to its content.

## Package H (turns 55–62)

- **`UnequalTreatment`, turn 55 (`e683`).**
  - The three-stage path fills only the top half. Rebalance it so the path is centred and larger.
- **`InterpersonalClass`, turns 57–58 (`e712`).**
  - The lower third is empty. Scale the group field up, or centre the composition.

## Done means

All of these pass:
- episode tsc;
- your check, with every earlier assert kept, plus:
  - a vertical-span assert for rule 1;
  - a card-fit assert for rule 2;
  - a minimum-font assert for rule 3, read from the declared text sizes;
- every other check listed in `BRIEF_MIN7_12_BUILD.md`;
- `check_antithesis.py` on your files.
