# Brief: cue the YT02 Figma scenes to the narration

**Never run git. Never edit `Paper/` or `video/yt01_redefining_racism/`. Write only the files named below.**

The Figma scenes for SEG 04 (orthographic illusion) and SEG 11 (runtime dashboard) were animated
as 9–12 s self-contained clips. Their runs last 10–189 s (table below). Each element must instead
move on the word that names it.

## 1. Extend `video/yt02/figma_cues.py` (keep every existing test passing)

Add two optional beat fields, both handled in the generated JS:

- `"subtree": true` — shift the node **and every descendant that has motion** by one delta, chosen
  so the earliest motion in the subtree lands on `at`. Use this for a dashboard panel so its chips,
  needle and tickers move with it.
- `"until": {"turn": k, "word": "w", "nth": 0}` — also rescale the node's motion linearly so its
  last keyframe / style end lands on that second cue (style `duration` scales too). Use this to
  spread the ortho `camera` rotation and the dashboard `rho needle` / `wage phasor` sweeps across
  the turns that describe them. Inside a subtree, `until` applies only to the named node.

A beat may also be `{"node": ..., "after": "<other node>", "gap": 0.6}` with no word: it lands
`gap` seconds after the other beat's `at`. Add tests for all three in
`video/yt02/tests/test_figma_cues.py`.

## 2. Write `video/yt02/figma/scene_cues_yt02.json`

`words`: `outputs/YT02/words.json`; `manifest`: `outputs/YT02/episode_manifest.json`. One scene per
Figma run. Print each run's turns with
`YT_EP=YT02 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns <seg> --only <primary>`
and read its Notes in `video/YT02_shotlist.md`. The frames' animated nodes are in
`video/yt02/figma/scene_nodes.json` (era frames share one panel layout described there).

| primary | frame | turns | run s |
|---|---|---|---|
| S04-01 | Scene · Orthographic illusion | 17 | 188.8 |
| S11-01 | intro 1 · System Stress | 4 | 42.2 |
| S11-05 … S11-10, S11-14 | intro 2 … intro 7, intro 9 | 1 each | 9–13 |
| S11-11 | intro 8 · Wage Phasor | 3 | 32.0 |
| S11-15 | assembly | 1 | 13.2 |
| S11-16, -20, -24, -28, -33, -37, -41 | era 1486 … era 2010 | 4–5 | 39–59 |

Rules: every animated top-level node gets a beat on the word in that run's narration that names it
(the instrument name, the level word, the chip's variable, the policy's year, "crash", "patch",
"material", "status"). When the narration never names a node, chain it with `after`. Panels in
era frames use `subtree: true`. The ortho camera uses `until` so the rotation spans the turns that
describe the projection, and the tier labels land on each tier's name. No beat lands after its
run ends.

## 3. Checks

- `python3 video/yt02/figma_cues.py video/yt02/figma/scene_cues_yt02.json --json /tmp/yt02_cues.json --js video/yt02/figma/scene_cues_yt02.js`
  runs clean (every word resolves) and each scene's `duration` equals its run length above.
- `python -m pytest video/yt02/tests/test_figma_cues.py` passes.
- Write `video/yt02/logs/scene_cues.md`: per scene, each beat's node, word, turn and `at`.
