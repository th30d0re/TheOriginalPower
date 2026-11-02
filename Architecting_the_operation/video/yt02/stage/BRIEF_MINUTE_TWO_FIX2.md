# Brief: minute two, fix pass 2 (frame review of `minutes_1_2_v2.mp4`)

The rules from `BRIEF_MINUTE_TWO_FIX1.md` apply unchanged:
- You may write `minutetwo/*`, `tools/check_minute_two.*` and a new "Fix pass 2" section of
  `FINDINGS_MINUTE_TWO.md`.
- No git state changes. The checkpoint is `e25421f`. The dirty paths outside your files belong
  to the author; leave them alone.
- Keep the frame path deterministic.
- No Chromium and no renders.

Frames are in `outputs/YT02v2_ov/video/stage_runs/m2_v2/`.

## 1. Wrapped definition lines start with a stray space

Fix pass 1 preserved the spaces at fragment joins. When a line wraps at a join, though, the
second line now begins with a visible leading space. In the Sense 1 card, for example, the
second line reads " directed against another person". The same happens with " among human
racial groups…" in Sense 2 and " across racial categories." in Sense 3.

Each join must render exactly one space mid-line, and no line may start with a space. One way is
to drop `pre-wrap` and render the fragments as plain inline spans inside a single normally wrapping
text block, with the joining space outside the fragment's opacity span as an ordinary collapsible
space.

Keep the exact-sentence asserts. Add one more: no rendered fragment span begins with whitespace
while it is the first visible item on its line. If line position cannot be known statically,
instead assert that no fragment string or span text node begins with a space, and that the
separators are plain text-node spaces between spans.

## 2. `FigureTwoThree`: the plate sits right of centre

After the rail flies in, the plate spans about x 440–1880, leaving roughly 420 px of empty space
on the left and 40 px on the right.

- From `t10Displays`, the plate eases to a horizontally centred position while the rail slots fly
  in, landing by `t10Order` + 600 ms.
- Its final horizontal margins must be equal within 8 px, inside the 1920 px frame.
- Keep the flight hand-off from fix pass 1: no overlapping text at any sampled frame. The flight
  targets move with the plate.

Add these asserts:
- The final plate's left and right margins are equal within 8 px.
- The ten flight samples still show no overlapping text.

## Done means

All of these pass:
- Episode tsc.
- `check_minute_two`.
- `check_first_minute`, `check_roadmap_boot` and `check_dashboard`.
- Plan compile, byte-identical.
- Site build into a fresh `/tmp` directory.

Then append "Fix pass 2" to `FINDINGS_MINUTE_TWO.md` with each check's tail.
