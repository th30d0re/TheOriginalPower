# Table 2.1 (S03-38) — full-frame grid layout

## Problem

1080p sheet review (`/tmp/s0338.png`): table ~60% frame width, body ~22 px, set-relationship math ~14 px tall (under 36 px floor). `fit_body()` was shrinking the whole grid.

## Changes

### `manim/cards16x9.py` (`kind_table` grid path)

- `TABLE_GRID_W = max(12.8, 90% of frame)`; columns **14% / 48% / 38%** (math column widest).
- `_table_math_cell`: `MathTex` at **≥40** `font_size`; width-fit scales **only** the math mob (height floor preserved).
- `_table_text_cell`: labels and column three at **≥32** with `min_size=32`, max two lines (truncate wrap overflow).
- `_fit_table_grid_vertical`: natural row heights, slack distributed into row panels, **bottom-anchored** above source (`foot_pad`); no `fit_body()` uniform scale on grid tables.
- Non-grid tables (`S11-06`, `S12-38`) unchanged.

### `cards/S03-38.json`

- Shortened column-three copy for two lines at 32 px.
- Long set relationships use `\\` line breaks in a single math cell where needed.

## Acceptance

```bash
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 03 --only S03-38 -j 1 --force -r 1920x1080
```

```text
S03-38: ok
layout: no problems in 19 samples
```

```bash
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 03 --only S03-38 -o /tmp/s0338.png -r 1920x1080
```

## Pixel measurements (1920×1080)

Frame extracted: `ffmpeg -ss 55 -i outputs/YT01/video/runs/1920x1080@15/S03-38.mp4 -frames:v 1 /tmp/s0338_frame.png`  
Cream-ink mask in the set-relationship column (x 316–1145).

| Metric | Measured |
|--------|----------|
| Table width | **1728 px (90.0% of 1920)** |
| Table left edge | 75 px |
| Math column width | 829 px |
| Data-row math bbox heights (4 rows) | **56, 47, 67, 60 px** |
| Row label text height (same bands) | 56, 47, 67, 23 px (band 3 label is one line) |
| Column-three text height | 43, 47, 42, 36 px |
| Table body vertical span (data rows) | ~541 px (~50% of frame) |

All set-relationship math crops **≥40 px** tall; label/detail crops **≥32 px** on multi-line rows.

## Regression (`-r 1920x1080 --force`)

| Primary | Layout log |
|---------|------------|
| S11-06 (table) | `layout: no problems in 4 samples` |
| S12-38 (table) | `layout: no problems in 7 samples` |

Row focus beats unchanged (first-column labels: `Coarse binary`, `In-group refinement`, …).
