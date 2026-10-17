# Brief: YT02 shot list and card data

**Never run git. Never edit `Paper/` or anything under `video/yt01_redefining_racism/` (read only).
Write only `Architecting_the_operation/video/YT02_shotlist.md`, `Architecting_the_operation/video/yt02/cards/*.json`
and `Architecting_the_operation/video/yt02/logs/shotlist.md`.**

## Inputs

- Script: `Architecting_the_operation/podcasts/YT02_what_racism_is.md` (15 segments, 526 turns).
- Outline: `Architecting_the_operation/notes/YT02_outline.md` (what each segment shows).
- Format model: `Architecting_the_operation/video/YT01_shotlist.md` and the card JSON in
  `Architecting_the_operation/video/yt01_redefining_racism/cards/` (kinds: title, quote, source,
  compare, timeline, table, stat_bars, equation, figure). Use the same JSON schema.

## Format (same as YT01)

One `##` shot per script turn, in order, IDs `S<seg>-<nn>` (`S00-01` …). Each shot:

    ## S07-04 — Short title
    - **Anchor:** `Emmanuel Theodore (MM:SS)`   (the turn's header, verbatim)
    - **Type:** card | hold | scene | diagram
    - **Render:** <target>
    - **Holds:** `S07-03`                         (only for holds: the primary it continues)
    - **Note:** what changes on screen this turn. [book …] / [external …] provenance

Every hold must give its turn one visible change (a focus ring, the next row, a callout), so no
two consecutive turns look identical.

## Render targets (YT02 is hybrid: Figma for slides and cards, manimgx for math)

- `figma-card:cards/<ID>.json`: a card built by the Figma card generator from the JSON.
  Use for definitions, quotes, sources, timelines, tables, comparisons, section openers.
- `figma:<frame name>`: a scene already built in Figma. Use these exactly:
  - SEG 04: `figma:Scene · Orthographic illusion`
  - SEG 11: `figma:intro 1 · System Stress` … `figma:intro 9 · Result` (one per instrument
    turn), `figma:assembly`, then `figma:era 1486`, `era 1676`, `era 1704`, `era 1894`,
    `era 1968`, `era 1994`, `era 2010` for the era walk (holds within an era stay on its frame).
- `manim:<file>:<Scene>`: math and set diagrams. **Reuse YT01 scenes** in
  `video/yt01_redefining_racism/manim/` where the content matches; read each candidate's
  docstring, for example `recursive_partition16x9.py` (Equation 2.4), `causal_reversal16x9.py`
  (Figure 2.2), `causal_structure16x9.py`, `hierarchy_inversion16x9.py`,
  `complex_wage16x9.py`, `interference16x9.py`, `partition_redraw16x9.py`, `cline16x9.py`.
  For math that no scene covers, name a new scene `manim:yt02/<file>.py:<Scene>` and specify it in
  the inventory.
- New YT02 math scenes the outline already requires: the **wage phasor** for SEG 09 (material on
  the vertical axis, psychological horizontal, θ from the material axis; sweep 0° → 90° →
  Quadrant II; projections live) and the **Interference Engine** for SEG 12 (Chapter 0's two
  antiphase coherence traces summing to near zero).

## Cards

Write one JSON per primary card shot in `yt02/cards/`. All on-screen quotes are verbatim from the
book or from the cited external source; sources and page numbers on every card that makes a claim.
Equation cards use the printed equation numbers. No antithesis in on-screen text.

## End of the shot list: inventory

1. Count of shots by type and by render target.
2. Every `manim:` scene used: reused (file, class) or new (file, class, a spec of each beat
   keyed to the turn words, equations verbatim in LaTeX).
3. Every `figma:` frame used.

## Checks before you finish

- Shot count equals the script's turn count (526), anchors match the script headers in order.
- Every `figma-card:` target has its JSON; every reused `manim:` file and class exists.
- `python3 tools/check_antithesis.py Architecting_the_operation/video/YT02_shotlist.md` is clean.
- `logs/shotlist.md`: counts, any turn you could not ground, and the checks' output.
