# Brief: first-minute fix pass 1 (orchestrator's frame review of `first_minute_v0.mp4`)

Read `BRIEF_FIRST_MINUTE.md` (Rules, Checkpoint, The contract) and `FINDINGS_FIRST_MINUTE.md`. The
same rules apply:
- Write only the files named here plus `tools/check_first_minute.*`.
- Do not change git state.
- Keep the frame path deterministic.
- Do not launch Chromium.

The orchestrator committed the checkpoint as `e72217f`. Dirty paths outside `stage/` are the
author's own work; leave them alone.

The render is `outputs/YT02v2_ov/video/stage_runs/first_minute_v0.mp4`, and its frames are in
`stage_runs/fm_v0/`. The checks pass. The defects below show on screen.

Fix each defect in place, keeping each scene's beats and cues. Do not rewrite the scenes.

## 1. `DictionaryEntry`: the lifted sense numbers collide with the sense text

At `order` + 2 s (frame `t26.7.png`), the lifted "1" sits on the last letters of "Individual
prejudice or discrimination based on race". Give the numbers their own gutter column outside the
panel's right edge (x > 964), clear of every sense line. The numbers lift into that column on
`order`. On `causal`, the chain draws to the right of the gutter. No glyph may overlap another.

## 2. Compositions sit high, leaving the bottom third empty

**TitleOpen:**
- At `tests` + 1 s, the tiles end near y 325 and nothing sits below them.
- Enlarge the three method tiles to about 340 × 240, with the graphic scaled up inside each.
- Centre the title-plus-tiles block vertically in the frame.
- After `episode`, the block of title, folded strip, episode line and subtitle must also sit
  vertically centred, not top-weighted.
- In the archive tile, the folio's header text ("ARCHIVE · 1676") runs into the folded corner.
  Keep it inside the page.

**DictionaryEntry:** at the last frame the content ends near y 690. Shift the entry, gutter, chain
and evidence slot down so the composition's vertical centre is within ±40 px of 540. The header and
the source line stay where they are.

## 3. `WhyLadder`: alignment and the map label

- The header starts at x ≈ 260 and the thumbnail column at x ≈ 70. Align the header's left edge
  with the thumbnail column. Move the column in from the border to x ≥ 120.
- The label "Virginia · 1676" sits on the coastline. Give it a small backing plate in
  `color/fill/panel-render`, or place it over open water, so no coastline stroke crosses the text.
- The dictionary thumbnail in slot 1 is only a miniature. Keep the miniature, and add a one-line
  caption under it at 18–20 px: "rac·ism · senses 1–3". This matches the captions on slots 2–4.

## 4. `LiteratureStack`: a connector crosses text, and the boundary has no room

- The connector from the "prejudice" component runs up through the Discrimination block's
  definition text ("differ|ently"). Connectors must never cross text or another block. Route
  each connector as an elbow through a gutter to the right of the stack: out of the component's
  top, right to the gutter, up, then left into the block's right edge. Alternatively, drop the
  lines and light the matching block label gold in step with its component. Choose whichever
  reads more clearly.
- The boundary line sits at y ≈ 985, so almost no dark region shows below it. Tighten the stack and
  the tripartite row so the boundary lands at y 760–800, with an empty dark region of at least 180
  px under it. The label "where the literature stops" stays on the line's left end.

## 5. Check additions

Extend `tools/check_first_minute` with static geometry asserts from the layout constants:
- The DictionaryEntry number gutter does not overlap the panel.
- The WhyLadder header and thumbnails share a left edge, and that edge is ≥ 120.
- The LiteratureStack boundary y is between 760 and 800.
- No LiteratureStack connector segment intersects a block's text box.

## Done means

All of these pass:
- Episode tsc.
- `check_first_minute`.
- `check_dashboard`.
- Plan compile and `--dry-run` of `stage_ov.yaml`.
- The site build into a fresh `/tmp` directory.

Then append a "Fix pass 1" section to `FINDINGS_FIRST_MINUTE.md` with each fix, the new geometry,
and each check's tail.
