# Revise the EffectCraft orthographic shot: make the 3-D camera moves visible

**Never run git. Do not touch `Paper/`. Write only files in `animations/yt01_ortho/`. Do not quit
EffectCraft; open/modify only this shot's project.**

Read `BRIEF.md`, `RUN_TASK.md`, `CONTROL_CHANNEL.md` and `RUN_NOTES.md`/`codex_run.log` (the last run
fixed build.jsx so it runs and rendered `yt01_ortho.mp4`; reuse that working build path and the same
channel commands to rebuild and render, starting from `file.newProject`).

The reviewer and the author watched the render. The beat order is right. The defect: the camera
moves are so fast they read as cuts. The rise into white takes ~0.5 s, and the white-to-black swing
passes through a single navy frame in ~0.17 s. The author asked for the camera to pan in 3-D "so that
you can actually see" it. Change:

1. **Rise (5.1 → 6.9 s):** a slow, eased tilt-and-rise that keeps the slabs in view: first both
   stacked slabs edge-on with the gap between them, then the white slab's underside swinging into
   view in perspective (a trapezoid growing) until it fills the frame at 6.9 s.
2. **Swing (10.6 → 12.8 s):** one continuous eased tilt from looking straight up at the white
   underside, down through a view where BOTH slabs are visible at once (white above, black below,
   the gap between them, in perspective), to looking straight down at the black top, filling the
   frame at 12.8 s. No frame may be background-only during the swing. Light the corridor so the gap
   reads as space (the slab edges visible), not as a navy band.
3. Captions: the white caption from 6.9 to 10.6, the black caption from 12.8 to 13.4. Keep them as
   they are otherwise.
4. **Final pyramid (from 13.4):** keep the continuous pull-back; frame it so the pyramid spans
   ≥ 60% of the frame width; tier labels ≥ 34 px (they are ~20 px now), all inside the frame.

Render again to `animations/yt01_ortho/yt01_ortho.mp4` (1920x1080, 30 fps, 18.1 s). Check: extract
frames every 0.2 s from 5.0 to 7.0 and from 10.4 to 13.0 into `check/`, and verify (by pixel
measurement) that the white or black area grows gradually across at least 8 consecutive frames in
each move and that no frame in the swing is ≥ 90% background navy. Save the project. Append the
changes and the check numbers to `RUN_NOTES.md`.

## Round 2 (reviewer frames at 5 fps from 10.5 to 12.9 s)

The rise and the final pyramid are now right; keep them exactly. The swing still reads as a flash:
white for ~0.6 s, then a flat navy frame, then black, with no geometry visible between. Make the
corridor between the slabs **deep** (the slabs extend far along the camera's forward axis, e.g.
10x their visible width) so that at the midpoint of the swing, looking straight along the gap, the
viewer sees the white slab's underside above and the black slab's top below, both receding in
perspective toward a vanishing point, with background visible only as a thin band at the horizon.
Spread the swing evenly over 10.6 → 12.8 s with a gentle ease (no fast middle), so at 5 fps there
are ≥ 6 consecutive frames in which both white and black are on screen at once. Verify that by
pixel counts (frames with ≥ 15% white AND ≥ 15% black) and report the count in RUN_NOTES.md.

## Round 3 (reviewer, frame-by-frame at 30 fps)

The swing contains two one-frame CUTS, which the author explicitly rejected: at 10.683 → 10.717 s the
white share drops 0.99 → 0.62 in one frame, and at 12.683 → 12.717 s white drops 0.16 → 0.00 (black
0.61 → 0.99) in one frame. The middle is a separate corridor pose with a ±6° pitch, so the camera
switches poses at both ends. Rebuild the swing as ONE continuous camera rotation:

- Make both slabs effectively unbounded around the camera during 10.6–12.8 (e.g. 50 000 units in X
  and Z) so no slab edge enters the frame, the camera at the centre of the gap between them.
- A single eased pitch interpolation from +90° (straight up: white fills) through 0° (horizon:
  white above, black below, the background as a thin band) to −90° (straight down: black fills),
  10.6 → 12.8 s, no position change, no other camera keyframes in that interval, no pose switch.
- Acceptance: sampling every frame at 30 fps from 10.5 to 12.9 s, the white share and the black share
  each change by at most 0.06 between consecutive frames (write `check_swing30.py` that prints the
  per-frame shares and the largest step, and exits non-zero above 0.06). Check the rise the same way
  from 5.0 to 7.0 s and fix any step above 0.06 there too.
Keep the split, the rotation, the captions and the final pyramid exactly as they are.
