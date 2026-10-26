# Brief C (Codex, gpt-5.6-luna): fix the S10-16 cue indexes and list every preview-only cue

## Rules
- **Never run git.** Leave every change uncommitted.
- **Edit only** `Architecting_the_operation/video/yt02/wage_plane_hero.py` (and other manim scene files under `yt02/`, but only if step 2 finds other misses), plus your report.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/C_cue_fix.md`.
- Never edit the shot list, the script, `common16x9.py` or `edit16x9.py`.

## Problem
S10-16 used to hold S10-06. It now leads its own run of four turns, S10-16..S10-19, which are turns 336–339.

`WagePlaneHero.shot_S10_16` still cues:
- k = 0 "investment";
- k = 1 "increases";
- k = 2 "ninety".

Those words are spoken in turns k = 1, 2 and 3. Rendering with `YT_LENIENT_CUES=1` hides the misses:

```
preview cue 'investment' #0 missing in turn 336
```

## Task
1. **Fix `shot_S10_16`.** Shift its cues to k = 1, 2, 3 and end it on `self.beat_end(3) - 0.2`. Keep θ at 0° through turn k = 0 ("Theta begins …").
2. **Find every other miss.** Render every segment without the lenient setting and collect each cue that misses. `YT_PREVIEW_SLATE=1` turns a failed shot into a slate, so the run continues:
   ```
   YT_EP=YT02v2 YT_PREVIEW_SLATE=1 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 -r 960x540 --fps 15 -j 4
   ```
   Then grep the run logs under `outputs/YT02V2/video/runs/960x540@15/*.log` for `absent from turn` and `preview cue`.
3. **Fix each miss.** For every miss, change the cue to a word actually spoken in that turn, near the same moment. Use `edit16x9.py turns <seg>` to see each turn's words.
4. **Re-run** step 2 until no misses remain.

## Report
- Each fixed cue: shot, method, old word, new word, turn.
- The final grep output, which must be empty.
