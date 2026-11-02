# Brief: minute two, fix pass 1 (orchestrator's frame review of `minutes_1_2_v1.mp4`)

Read these first:
- `BRIEF_MINUTE_TWO.md`, for its Rules and The contract. Both still apply.
- `FINDINGS_MINUTE_TWO.md`.
- The code in `minutetwo/`.

## Rules

- **Files you may write:** `minutetwo/*`, `tools/check_minute_two.*`, and the "Fix pass 1"
  section of `FINDINGS_MINUTE_TWO.md`. Do not edit `dashboard/`, `firstminute/`, `index.ts` or
  `stage_ov.yaml`.
- **Git:** no state changes. The orchestrator committed the checkpoint as `089b1b8`.
- **Leave alone, not blocking:** dirty paths outside your files are the author's work or another
  agent's, for example `.claude/launch.json`, `logs/`, `tmp/`, and SVGs under `handoff/svg` or
  `figma/`.
- **Rendering:** keep the frame path deterministic. No Chromium, no renders.
- **Frames to inspect:** the render is
  `outputs/YT02v2_ov/video/stage_runs/minutes_1_2_v1.mp4`. Frames are in `stage_runs/m2_v1/`.
- **Border:** the scenes now use `SceneBorder` with the animated tier notch. Keep it.

## 1. Spaces between phrase fragments are lost

The phrase-by-phrase definitions render with the spaces at fragment joins missing. The rendered
text reads:
- "hostility,or"
- "personon"
- "beliefor doctrineholding"
- "groupsdetermine"
- "practicesthat"

The fragment strings carry their leading spaces (for example `' or discrimination'`), but the
layout drops them, probably because each fragment is its own inline-block or flex item.

Fix this in all four sense scenes so every join renders exactly one space. Use the pattern you
judge cleanest, for example `white-space: pre-wrap` on fragments, or fragments as plain inline
spans inside one text block.

Extend `check_minute_two` to assert that the plain text of each definition at its last cue + 700
ms equals the full sentence with single spaces:
- **Sense 1:** "individual prejudice, hostility, or discrimination directed against another person
  on the basis of race or ethnicity."
- **Sense 2:** "an ideological belief or doctrine holding that built-in biological differences
  among human racial groups determine cultural or intellectual achievement."
- **Sense 3:** "institutional or systemic practices that produce unequal outcomes across racial
  categories."

Use the exact sentence strings your scenes render, but a check must catch a missing or doubled
space.

## 2. `SenseThree`: the network wires run through the nodes

The institution nodes draw over their connecting wires with no fill, so each wire passes visibly
through the boxes. Draw the wires first, then draw each node with an opaque fill in
`color/bg/field` and its hairline stroke. A wire may then touch a node's edge, but no wire may be
visible inside a node. Also make sure no two wires cross inside the network area.

## 3. `FigureTwoThree`: the flight's text overlaps the layer text

At `t10Displays` + ~0.9 s, the flying rail slot "2 ideological belief / a belief" is drawn on top of
"2. Belief in Superiority", and the two texts overlap. Restructure the hand-off so that no frame
shows two texts overlapping:
1. The slot's text fades out during the first ~40% of its flight. Only the slot frame travels.
2. The frame lands on its layer box.
3. The layer label fades in after the frame lands.

Extend the check: at 10 evenly spaced frames between `t10Displays` and `t10Pyramid`, no rail-slot
text box intersects a layer text box while both have opacity > 0.05. Use the layout constants.

## 4. `FigureTwoThree`: the bracket keeps the untapered width

After `t10Pyramid` the gold highlight bracket still spans the full 598 px width while the layers
taper. Animate the bracket to hug the tapered pyramid's outer bound, which is the widest layer plus
16 px, or redraw it as the pyramid outline in gold. Either way, the highlight must read as wrapping
the inverted pyramid.

## Done means

All of these pass:
- Episode `tsc`.
- `check_minute_two`, with the new asserts.
- `check_first_minute`, `check_roadmap_boot` and `check_dashboard`, unchanged.
- The plan compile, byte-identical.
- The site build into a fresh `/tmp` directory.

Then append "Fix pass 1" to `FINDINGS_MINUTE_TWO.md`, with each fix and each check's tail.
