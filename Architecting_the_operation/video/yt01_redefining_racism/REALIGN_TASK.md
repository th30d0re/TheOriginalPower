# Realign SEG 16 and SEG 17 shots to their turns

**Never run git. Never touch `Paper/`. No helper scripts in the repo (use /tmp). Write only
the files listed under "Owned files".** Same rules as `SCENES_TASK.md` and `REVISION_NOTES.md`.

## The defect (diagnosed by the reviewer)

In `Architecting_the_operation/video/YT01_shotlist.md`, a run of shots in SEG 16 and SEG 17
carries the spec (title, Note, and in places Type/Render/Holds) of the **next** turn. Print
each turn's words next to its Note with:

    .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 16
    .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 17

- **SEG 16, S16-14 through S16-55:** the Note on S16-k describes the narration of S16-(k+1).
  Correct spec for S16-k is the old spec of S16-(k−1). S16-14 needs a new spec: the narration
  glosses L (cultural inertia) and I (current) in U = ½LI², so it is a hold of the S16-13
  equation card that highlights those two terms. S16-55 receives the old S16-54 spec merged
  with its own old Note (both describe its turn). S16-56 is already correct.
- **SEG 17, S17-07 through S17-14:** same defect. S17-07 takes the old S17-06 spec, and so on;
  S17-15 merges the old S17-14 Note ("bucking") with its own. S17-05, S17-06 and S17-16 onward
  are correct.
- **Content warning placement:** the content-warning card must be on screen during S17-10
  ("A content warning applies to the third scale…"), and the 1662 *partus sequitur ventrem*
  card starts at S17-11. Today the warning is `cards/S17-09.json` and the 1662 card is
  `cards/S17-10.json`; S17-09 is the redlining/gerrymandering turn and belongs to the
  fractal / five-scale run.
- **Render vs Holds conflicts:** several holds name one scene in `Render` and a card primary
  of a different scene in `Holds` (S16-14–S16-17 render ComplexWage but hold card S16-13;
  S17-05–S17-09 render FractalExecution but hold card S17-04). A hold renders with its
  primary's scene, so `Render` must equal the primary's `Render`. Where the Note needs a
  different scene, make that shot a primary of the scene it names (and its following holds
  point at it). Group E's S16-13 run overwrote the card run's output for this reason.

## What to do

1. Fix the shot list for those ranges: every shot's spec describes its own turn; every hold's
   `Render` equals its primary's; `Holds` points at the right primary. Keep Anchors exactly.
2. Card JSON follows its shot id: when a card primary's id changes, move the JSON to the new
   id (rename in descending order so nothing is overwritten), update the `Render` paths, and
   fix any item whose reveal word is no longer in its turn.
3. Scene code: in the owned scene files, every `shot_S16_xx` / `shot_S17_xx` method and every
   `self.at(k, "word")` cue must match the corrected runs (a primary's id may have changed;
   a beat that now belongs to the next shot moves to that shot's index with a word from that
   turn). Never hard-code seconds.
4. Re-render every affected run and check its sheet:

        .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check
        .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 16 17 -j 2
        .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 16 -o /tmp/seg16.png
        .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 17 -o /tmp/seg17.png

   Pass = `check` clean, every run `ok` with `layout: no problems`, and each tile in the
   sheets shows what its turn says.

## Owned files

- `Architecting_the_operation/video/YT01_shotlist.md`: only the SEG 16 and SEG 17 sections.
- `Architecting_the_operation/video/yt01_redefining_racism/cards/S16-*.json`, `cards/S17-*.json`.
- `Architecting_the_operation/video/yt01_redefining_racism/manim/complex_wage16x9.py`,
  `lorentz_force16x9.py`, `coil_gun16x9.py`, `fractal16x9.py`.
- Findings: `Architecting_the_operation/video/yt01_redefining_racism/logs/realign_16_17.md`:
  the old-to-new mapping for every changed shot, every renamed card, every changed method,
  and the render/check output tails.
