# Card reveal timing — S12-29c (multi-item, single-turn)

## Symptom

Timeline card **S12-29c** (one run shot on turn 353, three items: 1954 / 1968 / 1981) revealed all events by ~2 s. Turn-relative `words.json` timings are correct (`1954` 1.67 s, `1968` 5.91 s, `cutting` 24.62 s for the 1981 row via detail fallback). `tokens()` / `_norm()` match those words when tested in isolation.

## Cause

`_schedule_found` and `_match_time_on_turn` already assign the right absolute times. For a single-turn run, `_item_shots` correctly maps every item to shot index `k = 0`.

`play_run` called `self.until(_turn_cue(...))` **once per run turn**, then looped over **all** items with `shots[i] == k` and batched their reveal animations into a **single** `self.play(..., run_time=0.45)`. After the first `until` (first unrevealed item, ~1.5 s for `1954`), items 1 and 2 were faded in immediately with item 0. Scheduling was fine; playback collapsed same-turn items into one beat.

## Fix

In `cards16x9.py` `play_run`, move `until(_turn_cue(...))` **inside** the per-item loop so each unrevealed item on turn `k` waits for its own matched word before `play`. Hold / `turn` callbacks still use one `until` at the start of a turn when no item reveals on that turn (unchanged for multi-turn cards).

## Verification

Rendered with:

```bash
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render <seg> --only <id> -j 1 --force
```

| Card | Segment | Check |
|------|---------|--------|
| S12-29c | 12 | Primary fix |
| S09-02 | 09 | Multi-turn table regression |
| S16-19 | 16 | Equation + holds |
| S03-38 | 03 | Full-frame table grid |

**S12-29c** (`outputs/YT01/video/runs/960x540@15/S12-29c.mp4`, 52.3 s): `ffmpeg -i … -vf fps=1` (no `-ss`; seeking is unreliable on these encodes). First visual changes at ~1 s (headline), ~2 s (1954 only), ~6 s (+1968), ~25 s (+1981 / “Cutting taxes…”). Confirmed with `select=gte(t\,N)` stills: t≈5 one dot; t≈6 two dots; t≈24 two dots; t≈25 three dots.

**Regressions:** fps=1 frame hashes show staggered reveals (not one burst at t≈2): S09-02 changes at ~1, 2, 12, 14, 15 s among others; S16-19 at ~1, 2, 7, 13, …; S03-38 at ~1, 4, 10, 11, … — consistent with per-turn or per-word pacing unchanged for multi-shot runs.
