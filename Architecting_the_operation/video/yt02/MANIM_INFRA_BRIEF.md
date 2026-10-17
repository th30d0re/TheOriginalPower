# Brief: episode-aware manimgx engine for YT02, plus the two new YT02 scenes

**Never run git. Never edit `Paper/`. YT01 must keep working byte-for-byte the same: run
`edit16x9.py check` for YT01 before and after and confirm no change in its output.**

## 1. Episode-aware engine and editor

`video/yt01_redefining_racism/manim/common16x9.py` and `edit16x9.py` hard-code YT01: `SCRIPT`,
`SHOTLIST`, `outputs/YT01`, `EP = "YT01"`, the `YT01_SHOT` / `YT01_AUDIO` env vars, `YT` (card and
figure root). Add one switch: env `YT_EP` (default `YT01`). For `YT_EP=YT02` use
`podcasts/YT02_what_racism_is.md`, `video/YT02_shotlist.md`, `outputs/YT02`, card root
`video/yt02/`, and env vars `YT02_SHOT` / `YT02_AUDIO` (accept `YT_SHOT` for both). Keep every
YT01 default.

YT02's words: ScriptCast wrote `outputs/YT02/word_timings.json`; YT01's pipeline used
`yt01_redefining_racism/make_words.py` to make `words.json`. Make `make_words.py` episode-aware the
same way and produce `outputs/YT02/words.json` (526 turns; check against the manifest).

## 2. New Render targets in the editor

YT02 shot list (`video/YT02_shotlist.md`) uses two Figma targets besides `manim:`:
- `figma:<frame name>` and `figma-card:cards/<ID>.json`. Both are external clips exported from
  Figma to `outputs/YT02/video/figma/<slug>.mp4`, where slug = the frame name for `figma:` and
  `card-<ID>` for `figma-card:` (lowercase, spaces and `·` to `-`). Treat them exactly like the
  existing `ext:` path: conform to the run window; a missing file is reported by `check` and
  skipped by `render` with a clear message, never a crash.
- YT02 `manim:` targets name files relative to `video/` (`yt01_redefining_racism/manim/x.py`,
  `yt02/x.py`); resolve both.
`edit16x9.py check` under `YT_EP=YT02` must list exactly what is missing.

## 3. Two new scenes (manimgx, cues on spoken words via `self.at(k, "word")`, never seconds)

Create `video/yt02/wage_phasor.py` (class from the shot list) and `video/yt02/interference_engine.py`,
implementing every beat the shot list's inventory specifies for them. Follow YT01 scene style
(`common16x9.py` helpers, palette, `shot_<ID>` methods per run, holds give one visible change).
- **Wage phasor (SEG 09):** complex plane with **material on the vertical axis and psychological on
  the horizontal**; θ measured from the material axis; ψ_m = |W| cos θ on the vertical projection,
  ψ_s = |W| sin θ on the horizontal, both live as the arrow turns; θ = 0, 90°, Quadrant II; then
  each historical implementation the narration names. Equation 3.5 shown as `W = \psi_m + j\psi_s`.
- **Interference Engine (SEG 12):** two antiphase coherence traces i_j(t), i_k(t) and their sum near
  zero (Chapter 0's destructive-interference figure), then the axes and Madison per the shot list.
Render each run at preview size (`-r 960x540 --fps 15`) with `YT_EP=YT02` and check the storyboard;
renders need Metal, so run them outside any sandbox.

## Deliver

The edits above, the two scene files, and `video/yt02/logs/manim_infra.md` with: the YT01
before/after `check` output, the YT02 `check` output, the render tails of both new scenes, and a
list of the reused YT01 scene files the YT02 shot list names, with the YT02 shot IDs each must gain
(the next task ports them).
