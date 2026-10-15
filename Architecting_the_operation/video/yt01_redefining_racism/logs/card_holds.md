# Card hold beats (`cards16x9.py`)

## Change

`CardScene` now drives **one visible beat per run turn** via `play_run`: item reveals stay word-scheduled; extra holds get term highlights, gold focus rings, quote underlines, or a short lower-third callout. `kind_figure` layout from the parallel figure-card pass is unchanged.

## Acceptance commands

```text
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 16 --only S16-19 -j 1 --force
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 16 --only S16-19 -o /tmp/s1619.png
```

`check`: every Render target exists, 234 runs, 0 problems.

All **168** `CardScene` primaries re-rendered (`--force`, `-j 3`). **0** render failures.

## Runs checked (sheets + consecutive-tile diff)

| Primary | Shots | Layout (render log) | Consecutive identical tiles |
|---------|------:|---------------------|-----------------------------|
| S16-19 | 7 | `layout: no problems in 18 samples` | none |
| S09-08 | 5 | `layout: no problems in 13 samples` | none |
| S05-22 | 8 | `layout: no problems in 25 samples` | none |
| S17-04 | 15 | `layout: no problems in 31 samples` | none |
| S06-10 | 10 | `layout: no problems in 22 samples` | none |

Sheet: `/tmp/s1619.png` (7 shots).

## Render log tails (spot checks)

**S16-19**

```
/Users/emmanuel/Documents/Theory/TheOriginalPower/outputs/YT01/video/runs/960x540@15/S16-19.mp4  50.93 s, 960x540 at 15 fps, 0.2 MB (rendered in 0.6 s)
storyboard: .../S16-19.storyboard.png, .../S16-19.storyboard-2.png
layout: no problems in 18 samples
```

**S09-08**

```
.../S09-08.mp4  140.87 s, 960x540 at 15 fps, 0.1 MB (rendered in 0.6 s)
layout: no problems in 13 samples
```

**S05-22**

```
.../S05-22.mp4  82.33 s, 960x540 at 15 fps, 0.1 MB (rendered in 0.6 s)
layout: no problems in 25 samples
```

**S17-04**

```
.../S17-04.mp4  172.53 s, 960x540 at 15 fps, 0.2 MB (rendered in 1.1 s)
layout: no problems in 31 samples
```

**S06-10**

```
.../S06-10.mp4  112.33 s, 960x540 at 15 fps, 0.2 MB (rendered in 0.8 s)
layout: no problems in 22 samples
```

## Remainder

18 / 168 card runs still report a small number of layout inspector hits (mostly single text-on-text flags on dense table/title cards). None of the five long runs above. No consecutive-tile repeats in those runs after the hold pass.
