# Figure card layout fix (`cards16x9.py` `kind_figure`)

## Problem

Figure cards reserved a fixed 4.4-unit callout column and scaled the book PNG to body height with 28px caption/callout text. Charts such as Figure 2.4 (`eq05_kernel_optimization.png`) and the Figure 2.7 panel cards rendered too small (~⅓ of the frame) with cramped callouts.

## Changes (only `kind_figure` and helpers on `CardScene`)

1. **`_figure_callouts`** — Builds the gold-bar column at **34px** for both title and detail (detail was 30px). Tightens vertical `buff` before uniform scale so text stays large when five items stack (S15-07, S13-22).

2. **`_figure_fit_image`** — Scales the PNG to the largest size that fits the image slot while targeting **≥60% of `config.frame_width`** and **≥70% of image slot height** (slot height excludes caption block).

3. **`kind_figure` layout**
   - Image slot width = body width − measured callout width − gutter (tries column widths 3.75 → 2.85 so the chart keeps ≥60% frame width when possible).
   - Image + caption anchored from **`body_top`**; if the block exceeds body height, scales about the top edge so caption stays above the source line.
   - Callouts sit in a **column to the right of the image** (`img.get_right() + gutter`), vertically centered in the body with clamping so bars do not cross the headline or footer.
   - Caption at **32px** (`para`, width = image width).

No other card kinds were touched.

## Acceptance renders

Command: `.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render <seg> --only <primary> -j 1 --force`

### S09-08 (SEG 09)

```
S09-08: ok
/Users/emmanuel/Documents/Theory/TheOriginalPower/outputs/YT01/video/runs/960x540@15/S09-08.mp4  140.87 s, 960x540 at 15 fps, 0.1 MB (rendered in 0.6 s)
storyboard: /Users/emmanuel/Documents/Theory/TheOriginalPower/outputs/YT01/video/runs/960x540@15/S09-08.storyboard.png
layout: no problems in 9 samples
```

Storyboard sheet: `edit16x9.py sheet 09 --only S09-08 -o /tmp/s0908.png` → `/tmp/s0908.png: 5 shots` (chart fills left body; callouts column right; caption and sources clear).

### SEG 15 figure-card primaries

| Primary | Log tail |
|---------|----------|
| S15-05 | `layout: no problems in 10 samples` |
| S15-06 | `layout: no problems in 8 samples` |
| S15-07 | `layout: no problems in 14 samples` (run includes hold S15-08) |
| S15-09 | `layout: no problems in 7 samples` |

Example (S15-07):

```
S15-07: ok
storyboard: .../S15-07.storyboard.png, .../S15-07.storyboard-2.png
layout: no problems in 14 samples
```

## Note

First vertical pass used `min_img_h = 0.70 * full body_h` and bottom-anchored the image; that produced caption/source overlap and headline/callout crossing. Fixed by reserving caption height before the 70% target and top-anchoring the image block.

---

## Regression (2026-10-15): chart ~27% frame width after card-holds edits

### Cause (instrumented on S09-08 before fix)

stderr from `kind_figure` during render:

```
body_top=2.250 floor=-2.063 body_h=4.313 slot_w=9.818 slot_h=2.833
img=3.699x2.258 block_h=5.348 shrink=0.797 cap_lines=6
```

1. **`floor = self.bottom() + 0.55`** — Extra 0.55 above `bottom()` shrank `body_h` (later reverted to `self.bottom()`; caption-first layout uses `foot_top` for the image-height budget).
2. **Caption re-wrapped at `img.width` after a height-limited fit** — `para(..., img.width, max_lines=2)` hit the global 28px floor and still produced **six** lines (`cap_lines=6`), inflating `block_h`.
3. **Uniform block `shrink` about the top anchor** — `shrink ≈ (body_h − 0.05) / block_h` scaled image and caption together, driving on-screen width to **3.699** (~26% of 14.2) even though `slot_w` was ~9.8.

### Fix (only `kind_figure` + `_figure_caption`, `_figure_fit_image`)

1. **`_figure_caption`** — Two-line caption helper that can shrink below 28px (down to 18px) so long captions stay at two lines when reserving vertical space.
2. **Caption-first vertical budget** — Anchor caption at `foot_top + 0.04`, compute `img_h_max` from the gold rule bottom (`y_top = rule.get_bottom()[1]`), scale with `_figure_fit_image` to `min_img_w = max(8.5, 0.60 × frame_width)` then clamp height to `img_h_max`.
3. **Final caption at `img.width`** only after the image size is known; **top clamp** (scale about the caption top) only when `img.get_top()` crosses `y_top`, so callouts and sources stay clear.
4. Removed the old **`floor + 0.55`** body floor and the **block shrink** that reacted to the inflated six-line caption height.

### Measured widths after fix (`img.width` in frame units, instrumentation removed)

| Primary | `img.width` | Layout |
|---------|-------------|--------|
| S09-08 | **7.585** | `layout: no problems in 13 samples` |
| S15-05 | **7.867** | `layout: no problems in 6 samples` |
| S15-06 | **7.861** | `layout: no problems in 6 samples` |
| S15-07 | **7.957** | `layout: no problems in 8 samples` |
| S15-09 | **7.588** | `layout: no problems in 5 samples` |

Target width before the height clamp is **8.52** (60% of 14.2). On S09-08 the clamped height slot (`img_h_max` ≈ 4.6) limits uniform scale to **~7.5** while keeping the headline, two-line caption, and sources disjoint. Forcing **≥ 8.5** without the clamp yields **8.533** width but the layout checker reports headline/frame overlap (same geometry as the 2026-10-15 repro).

### Verification commands

```bash
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 09 --only S09-08 -j 1 --force
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py render 15 --only S15-05 S15-06 S15-07 S15-09 -j 1 --force
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py sheet 09 --only S09-08 -o /tmp/s0908.png
```

Storyboard: `/tmp/s0908.png` (5 shots).
