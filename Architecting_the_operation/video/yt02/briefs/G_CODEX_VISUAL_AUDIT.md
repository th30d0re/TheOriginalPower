# G6 visual audit — every figure, table and equation in YT02v2_ov

## Hard rules

Read-only. Write exactly one file: `Architecting_the_operation/video/yt02/feedback/G_visual_audit.md`.

- Do not commit.
- Do not edit any other file.
- Do not render.
- Do not touch `Paper/` or `outputs/`. Reading them is fine.

Read `Architecting_the_operation/video/yt02/briefs/G_AUTHOR_NOTES.md`, rules R4 and R5.

## Inputs

- `outputs/YT02v2_ov/words.json`: list of `{turn, turn_id, text}`. `turn` is the OV turn N.
- `Architecting_the_operation/video/YT02v2_ov_shotlist.md`: the Nth `## S..` block is turn N. Its `**Render:**` is the picture. `**Holds:**` means it repeats its primary's picture.
- Cards: a `figma-card:cards/X.json` Render points at `Architecting_the_operation/video/yt02/cards/X.json`.
- `manim:yt02/foo.py:Class` points at `Architecting_the_operation/video/yt02/foo.py`.
- The book: `Paper/The_Original_Power.tex`, for the figure, table and equation content.

## Task

Find every turn whose spoken text names a figure ("Figure 2.2"), a table ("Table 2.1") or an equation ("Equation two point five", "Eq 3.5", "equation 2.11"), in either the digit or the spoken form. Also find every Render that shows an equation, table or figure even when the narration does not name it. For each item, write one table row:

| column | content |
|---|---|
| Item | e.g. `Eq 2.11` |
| What it is | its content from the tex, one line, with `tex:LINE` |
| Turns | the OV turns that speak it, and their turn_ids |
| Current picture | the Render, and what the card/scene actually shows (read the JSON or scene) |
| Shown? | `shown`, `described only` or `missing` |
| Animated? | `none`, `reveal only` or `visualized` (a graph, cone or plot showing behaviour) |
| Variable sweep? | yes/no |
| Subscripts | `ok`, or `underscore` when the text contains `_` where a subscript belongs |
| Proposal | the R4 visualization: for an equation, the plot type and which variables to sweep, and what the viewer should see change; for a table, whether it can be graphed and how; for a figure, the Figma recreation and which parts to highlight on which turn |
| Platform | Figma, or manimgx (the cone only) |
| Priority | P1 when the narration describes a visual that is not on screen; P2 when it is shown but not visualized; P3 polish |

Close with:

- counts per priority;
- a list of every card JSON containing `_` subscripts;
- every turn where the Render's content plainly does not match the narration. Turn 72 is a known example.

## Stop

Stop when the file exists and covers every item.
