# Brief: SEG 07 orthographic illusion as a real 3D manimgx scene

Run from the repo root, outside any sandbox (Metal):

```bash
codex exec -m gpt-5.6-sol -s danger-full-access -C /Users/emmanuel/Documents/Theory/TheOriginalPower "Carry out Architecting_the_operation/video/yt02/ORTHO_SCENE_BRIEF.md exactly." < /dev/null > Architecting_the_operation/video/yt02/logs/ortho_scene.codex.out 2>&1
```

## Rules
- **Never run git.** Leave every change uncommitted.
- Create `Architecting_the_operation/video/yt02/ortho_illusion.py`. Edit only that file and the 17 `S07-xx`
  blocks of `Architecting_the_operation/video/YT02v2_shotlist.md`.
- Never edit `Paper/`, the script, the audio, `common16x9.py`, `edit16x9.py`, or any `yt01_redefining_racism/`
  scene. Import from them.
- On-screen text: no formulaic antithesis ("not X but Y"); say "tiers", never "jobs".

## Why
The Figma scene `Scene · Orthographic illusion` (node 5:2) cannot do this job. It is a 2D frame whose only camera
motion is a 1.2 s scale, then a hold to 188.8 s. It has no rotation, sightline, Square Ceiling, deflection or
decoy element, and its captions sit on top of its In-group/Out-group labels at y≈470–551. The illusion is a 3D
idea (a pyramid seen head-on collapses into a flat binary), so it belongs in a `ThreeDScene`.

## Build
`class OrthoIllusion(YTScene3D)` with **one** method, `shot_S07_01`, covering the whole run S07-01..S07-17 (one
continuous camera, beats 0–16). Reuse the YT01 geometry instead of redrawing it:
`from orthographic16x9 import _build_pyramid, _split_setup, _horizontal_split, _legend_group, PYRAMID_X, D, ...`
and copy `Orthographic16x9._lights` / `_pyramid_camera`. Use the same tier colours (ELITE, PUPPET, FORCE, PAPER,
NIGHT) as the episode's single pyramid (`yt02/tier_pyramid.py`), so the viewer sees the same object.

Every move is short (0.6–1.6 s) and lands on its word with `self.until(self.at(k, "<word>"))`. Never stretch one
animation across a beat. Hold still between moves. Cue words below are spoken in that turn; verify each one with
`YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 7`.

| beat | shot | cue word(s) | picture |
|---|---|---|---|
| 0 | S07-01 | "binary", "illusion" | Flat head-on view: two blocks, white In-group I left, black Out-group O right, labels under each. Title "THE ORTHOGRAPHIC ILLUSION". |
| 1 | S07-02 | "pyramid", "Elite", "Out-group" | Camera orbits to the 3D pyramid (phi≈52°, theta≈−68°); tiers fade up apex→base on each named tier. |
| 2 | S07-03 | "Orthographic", "sightline"/"sight", "overlap" | Parallel projection rays draw along the camera axis onto a 2D plane at the side; the plane shows the shadow. |
| 3 | S07-04 | "head-on", "vanishes" | Camera returns head-on (theta→−90°, phi→90°): the tiers overlap into the two flat blocks of beat 0. |
| 4 | S07-05 | "Rotate", "apex" | Orbit 35° off-axis; blocks separate in depth; the Elite apex rises into view (gold rim). |
| 5 | S07-06 | "upward", "Buffer" | Camera drops into the base and tilts up; the underside of the Buffer slab fills the frame. |
| 6 | S07-07 | "Square Ceiling", "binary" | Callout "SQUARE CEILING" tags the Buffer underside; ghosted P/F/E tiers stacked exactly behind it. |
| 7 | S07-08 | "downward", "outside the frame" | Camera at Buffer level tilts down to O_racialized; gold extraction arrows rise to E outside the framed region (show a frame rectangle so "outside" reads). |
| 8 | S07-09 | "Zoom out", "connected" | Pull back to the full pyramid; continuous upward extraction circuit pulses base→apex. |
| 9 | S07-10 | "Elite Obscuration", "sightline" | One sightline vector pierces I_buffer, F, P in turn (each flashes), stopping short of E. |
| 10 | S07-11 | "real boundary", "hierarchy" | The I/O boundary line glows at the base; elevation ticks I→E light up the vertical axis. |
| 11 | S07-12 | "two point one", "two point two" | Split callouts: shadow plane tagged "Eq 2.1 · projection", vertical stack tagged "Eq 2.2 · elevation" (MathTex, terms highlighted as named). |
| 12 | S07-13 | "Orthogonal Deflection", "horizontal" | Upward momentum arrow from O aims at E, hits a deflection plane under I_buffer, bends 90° into the horizontal plane. |
| 13 | S07-14 | "Kinetic Decoy" | The deflected arrow strikes the Buffer block; badge "KINETIC DECOY"; apex stays untouched. |
| 14 | S07-15 | "reinforce", "collides" | Sightline cone (beat 9) and collision arrow (beat 12) lock together between I_buffer and O. |
| 15 | S07-16 | "wide shot", "capture" | Full 3D wide shot: collision at the base, extraction rising uninterrupted to E. |
| 16 | S07-17 | "generative force", "absorb" | Gold query ring on E; labels "transmit · enforce · absorb" on P/F, I_buffer, O. |

Layout: labels and callouts use `self.flat(...)` (fixed in frame) and live in a right-hand column or a top band.
Lower-third captions own y < −3.0 and nothing else goes there. No text overlaps a tier face or another label.

## Shot list
Point the run at the new scene. S07-01: `- **Render:** \`manim:yt02/ortho_illusion.py:OrthoIllusion\``, Type
`scene`. S07-02..S07-17: Type `hold`, the same Render, `- **Holds:** \`S07-01\``. Rewrite each block's Note to
describe its beat from the table above. Leave Anchor lines unchanged.

## Acceptance
1. `YT_EP=YT02v2 ... edit16x9.py check` reports 0 problems.
2. Render SEG 07 with **strict** cues (no `YT_LENIENT_CUES`):
   `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 7 -r 960x540 --fps 15 -j 4`.
   It must finish without KeyError or IndexError.
3. `manimgx inspect` storyboard of the run reports 0 overlap problems.
4. Extract one frame at each beat's cue time from the render with ffmpeg into
   `Architecting_the_operation/video/yt02/logs/stills_ortho/beat_NN.png` (17 files).
5. Write `Architecting_the_operation/video/yt02/logs/ortho_scene.md`: per beat, the cue word, its time, the still
   path, and one line on what is on screen.
