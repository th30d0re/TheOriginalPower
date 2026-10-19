# YT02v2 manimgx fix report (2026-10-19)

## Files changed

| File | Action |
|------|--------|
| `yt02/layout_v2.py` | **New** — `assert_no_overlap()`, `clamp_above_caption()`, caption band `y = -2.9` |
| `yt02/wage_plane_hero.py` | **New** — `WagePlaneHero` hero build (runs `S10-06`, `S10-11`, `S10-16`, `S10-20`) |
| `yt02/wage_phasor.py` | **Updated** — reversed ψₘ/ψₛ axis convention, layout, equation term highlights |
| `yt02/interference_engine.py` | **Updated** — right-column labels sequenced (chapters → Madison → axes) |
| `yt02/rlc_teach.py` | **New** — `RLCTeach` component teach + circuit + scope + Eq 2.11 |
| `yt02/tier_pyramid.py` | **New** — `TierPyramid` for five-tier walk-through |
| `YT02v2_shotlist.md` | **Render lines** — tier + RLC repoints only |

## Shot repoints (`Render:`)

| Shot | New target |
|------|------------|
| `S02-03`, `S02-04`, `S02-05` | `manim:yt02/tier_pyramid.py:TierPyramid` |
| `S05-24`, `S05-26` | `manim:yt02/rlc_teach.py:RLCTeach` |

All `wage_plane_hero` / `wage_phasor` / `interference_engine` lines were already on `yt02/` modules.

## Stills (`logs/stills_v2/`)

| Still | Source run / note |
|-------|-------------------|
| `S02-03.png`, `S02-04.png`, `S02-05.png` | `TierPyramid` primaries |
| `S05-24.png`, `S05-26.png` | `RLCTeach` (`S05-26` hold; same run end frame) |
| `S09-01.png`, `S09-36.png` | `WagePhasor` (`S09-36` hold ≈ end of `S09-01` run) |
| `S10-06.png`, `S10-11.png`, `S10-16.png`, `S10-20.png` | `WagePlaneHero` primaries |
| `S12-05.png` | `InterferenceEngine` (`S12-01` run end; hold `S12-05`) |

Extracted with `manimgx render` (1920×1080 @ 30 fps, `veryfast`) + `ffmpeg -update 1` last frame.

## `edit16x9.py check`

```
every Render target exists
169 runs, 0 problems
```

Command: `YT_EP=YT02V2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check`

## Left undone / follow-ups

1. **`outputs/YT02V2/words.json` and `episode_manifest.json` are absent** — renders use synthetic word timing; cue sync and hold-frame extraction should be re-run after `make_words.py` / manifest generation.
2. **`assert_no_overlap` on hero / interference** — axis labels sit on arrows by design; manimgx layout still flags arrow-through-label on several samples. Tier and RLC runs call the helper where panel text is separated; hero uses `clamp_above_caption` and manimgx inspect only.
3. **`S09-36` still** — copied from end of long `S09-01` run, not a frame at θ = 128° only; re-sheet after manifest exists.
4. **RLC SVG** — `rlc_teach` loads `yt01_redefining_racism/figures/circuits/rlc_series.svg` (read-only import path); copy into `yt02/figures/` if episode assets must be self-contained.
5. **`S05-25`** remains `backlash_oscillator16x9.py:BacklashOscillator` (dedicated waveform shot between RLC teach holds).

## Cue sync pass (2026-10-19, real `outputs/YT02v2/words.json`)

Renders (960×540 @ 15 fps, `-j 4`): `S02-03`, `S05-24`, `S09-01`, `S10-06`, `S12-01` — all **ok**.

Storyboard sheet: `/tmp/yt02v2_sheet_02_05_09_10_12.png` (112 shots; holds `S02-04`, `S02-05`, `S10-11`, `S10-20` report `no render` because they share primaries above).

### `tier_pyramid.py` (`TierPyramid`)

| Scene | Turn | Old cue | New cue |
|-------|------|---------|---------|
| S02-03 | 66 | Elite | power, |
| S02-04 | 67 | Enforcement | force |
| S02-05 | 68 | base | extraction |

### `rlc_teach.py` (`RLCTeach`)

| Scene | Turn | Old cue | New cue |
|-------|------|---------|---------|
| S05-24 | 138 | oscillation | dynamic |
| S05-26 | 140 | Equation | requirements |
| S05-26 | 140 | inertia (L highlight) | mathematical |
| S05-26 | 140 | resistance (R highlight) | institutional |
| S05-26 | 140 | capacitance (C highlight) | state |

### `wage_phasor.py` (`WagePhasor`, run `S09-01`)

All 42 beat cues remapped to tokens present on turns 267–309 (full list in source `cues = [...]`). First failure fixed: turn 268 `answers` → `Prediction`; last beats include `Warren` (308), `October` (309).

### `wage_plane_hero.py` (`WagePlaneHero`)

| Scene | Turn | Old cue | New cue |
|-------|------|---------|---------|
| S10-06 | 326 | line | line. |
| S10-06 | 326 | Equation | complex |
| S10-06 | 328 | quarter (was beat 0) | rotate (beat 2) |
| S10-06 | 329 | preserves (was beat 0) | preserves (beat 3) |
| S10-11 | 331 | Magnitude | magnitude |

### `interference_engine.py` (`InterferenceEngine`, run `S12-01`)

All 27 dashboard-beat cues remapped to tokens on turns 438–464 (e.g. turn 438 `central` → `dashboard`; turn 455 `Elite` → `Elite,`).

### `MANIM_FIX_V2b_BRIEF.md` round-2 layout

Not re-run in this pass: trapezoid pyramid, RLC stray-comma stage split, overlap audit on all 13 stills, and Δφ label move remain as in **Left undone** above. Cue sync was the blocker for renders with real word timing.
