# Card runs: every hold changes the picture

**Never run git. Never touch `Paper/`. No helper files in the repo (use /tmp). Edit only
`Architecting_the_operation/video/yt01_redefining_racism/manim/cards16x9.py`; you may also
edit card JSON in `.../cards/` where a hold needs a field to point at.** Same standards as
`REVISION_NOTES.md` rule 3: no two consecutive tiles of a run in the sheet may look the same.

## The defect

`CardScene` reveals a card's items on the words that name them, but a run often has more
holds than items: the narration keeps explaining what is already on screen. Example: the
Equation 2.16 card run (primary `S16-19`, holds through `S16-25`) shows seven identical
tiles. 445 of the 703 shots are card shots, so this is the biggest visual gap left.

## What to build

For each hold that would otherwise repeat the previous frame, give it one visible beat on a
word of its own turn, chosen in this order:

1. **Equation cards:** move the highlight to the term the turn names (match each term's
   `gloss` words or symbol name against the turn's words, the way items are revealed now);
   when the turn reads the whole equation, highlight the full equation; when it states
   what the equation predicts, show the card's `reading` line (or the turn's key phrase if
   the card has none) as a callout under the equation.
2. **Table, stat_bars, compare, timeline, source cards:** move a gold focus ring to the
   row, bar, column or entry the turn names.
3. **Quote cards:** underline the quoted phrase the turn repeats.
4. **Otherwise:** pull up a one-line key phrase from the turn (at most 8 words, verbatim
   from the turn text, no antithesis) as a lower-third callout, replaced on each hold.

Cues stay word-driven (`self.at(k, word)`), never seconds. Keep each card's layout as it is.

## Acceptance (run yourself, outside any sandbox; renders need Metal)

    .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check
    .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 16 --only S16-19 -j 1
    .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 16 --only S16-19 -o /tmp/s1619.png

Then re-render every CardScene run in all segments (`render 00 01 ... 22 -j 3`, CardScene
runs only, `--force`), and sheet four other long card runs from different segments. Pass =
every run `ok` with `layout: no problems`, and no two consecutive tiles identical in the
sheets you checked. Findings: `.../logs/card_holds.md` with the runs you checked and their
render tails.
