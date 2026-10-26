# Brief D (Kimi, swarm mode): audit every Note in the YT02v2 shot list against what the shot renders

## Rules
- **Never run git.** Leave every change uncommitted.
- **Edit only** the `- **Note:**` lines of `Architecting_the_operation/video/YT02v2_shotlist.md`, plus your report.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/D_notes_audit.md`.
- Never change a heading, Anchor, Type, Render or Holds line.
- **On-screen and descriptive text rules:**
  - direct, declarative phrasing, with no formulaic antithesis ("not X but Y", "more than just");
  - "tiers", never "jobs";
  - the 3-D model is a cone;
  - the disjoint union is ∪̇.

## Why
The shot list was remapped from v1, and many Notes describe a different shot. For example, S10-20, S10-23 and S10-27 describe Southern Strategy cards, but they render the wage plane. A Note must say what the viewer sees during that shot.

## How to judge each shot
Get each shot's turn and words from:
```
YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <seg>
```
for segments 0–15. Its Render line says what plays. A hold plays its primary's Render at that turn.

| Render | Read this to see what it shows |
|---|---|
| `figma-card:cards/<path>.json` | The card JSON. Item i reveals on the run's turn i, and the last item absorbs the remaining turns. |
| `manim:<file>:<Class> [as=<id>]` | The method `shot_<id>` (the `as=` id, or else the primary's id) in that file. Note what appears at this turn's index k. |
| `figma:<frame name>` | Frame-level shots. Describe them from their existing Note and the narration; do not invent details. |
| `ext:<image>` | An archive page image. Name the document and page from the file path. |

## Task
Use your **AgentSwarm** tool with one worker per segment (16 workers, read-only explore). Each worker returns one row per shot in its segment:
- shot id;
- verdict: OK, or STALE with a reason;
- a proposed Note.

Then apply the STALE rewrites yourself in one pass over the file:
- One or two sentences per Note.
- Keep the existing `[book …]` tags when they still cite the right place.
- Do not add tags you cannot trace.

## Report
- A count of OK and STALE shots per segment.
- A table of every rewrite: shot, old Note, new Note.
- A confirmation that only Note lines changed, from `diff` of the line prefixes.
