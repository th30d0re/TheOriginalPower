# YT01 ortho — revise run notes

Model: Composer. Date: 2026-10-15.

## Request

`REVISE_TASK.md`: slow the 3-D camera rise (5.1–6.9 s) and swing (10.6–12.8 s), adjust captions, enlarge tier labels, re-render, verify frames in `check/`, save project.

## Changes in `build.jsx`

- **Rise (5.1–6.9 s):** approach along Z from −5000 with delayed cosine tilt (6.15–6.95 s) so the gap and both slabs stay visible before the white underside seals the frame at 6.9 s.
- **White hold:** camera pose held 6.9–10.6 s (pitch +90°).
- **Swing (10.6–12.8 s):** cosine-shaped progress with `pow(raw, 0.72)`; camera passes through the corridor (`z` pull −520 at midpoint) so both slabs appear together (e.g. 11.4 s).
- **Black hold:** 12.8–13.4 s before pyramid pullback.
- **Captions:** white caption enters 6.6–6.9, exits 10.6–10.9; black caption enters 12.5–12.8, exits 13.4–13.7.
- **Tier labels:** text size 36 px (was 30).
- **Corridor readability:** flat unlit slab materials (same as ep01 references) so white/black holds stay clean; gap reads as navy between visible slab faces in perspective during the swing, without scene lights that grey out the fills.

## EffectCraft commands (final successful pass)

```bash
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"file.newProject"}'
python3 animations/yt01_ortho/ec.py --timeout 300 engine.execute '{"command":"file.runScript","params":{"path":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/build.jsx"}}'
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"renderQueue.add","params":{"comp":"YT01_Ortho","format":"h264","output":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/yt01_ortho.mp4","timeSpan":"comp"}}'
python3 animations/yt01_ortho/ec.py --timeout 3600 engine.execute '{"command":"renderQueue.render","params":{"wait":true}}'
python3 animations/yt01_ortho/ec.py engine.execute '{"command":"file.saveAs","params":{"path":"/Users/emmanuel/Documents/Theory/TheOriginalPower/animations/yt01_ortho/yt01_ortho.ecproj"}}'
```

Build output: `built YT01_Ortho, 22 layers, 18.1s`.

## ffprobe

```
width=1920 height=1080 r_frame_rate=30/1 duration=18.100000
```

## Spot-check frames (beat table)

| t (s) | bright (lum>200) | dark (lum<30) | pass |
|------:|-------------------:|--------------:|:-----|
| 0.5 | 50.0% | 49.9% | split |
| 6.8 | 99.7% | 0.1% | white fill |
| 10.0 | 99.7% | 0.1% | white hold |
| 12.9 | 0.1% | 99.7% | black fill |
| 17.5 | 8.9% | 78.7% | pyramid (non-navy span ~82.6% frame width) |

## Rise samples (5.0–7.0 s, every 0.2 s)

Pixels with luminance > 200 (white proxy), navy within ΔRGB 30 of `[0.06,0.09,0.17]`, mean luminance:

| t | bright % | navy % | mean lum |
|---|---------:|-------:|---------:|
| 5.0 | 75.7 | 0.1 | 181.6 |
| 5.4 | 61.0 | 26.5 | 152.9 |
| 5.8 | 49.5 | 50.5 | 131.3 |
| 6.2 | 37.2 | 62.7 | 105.2 |
| 6.4 | 51.9 | 48.1 | 136.5 |
| 6.6 | 100.0 | 0.0 | 239.0 |
| 6.8 | 99.7 | 0.1 | 238.5 |

Longest consecutive rise in bright% (step > 0.4%): **3** frames. Longest in mean lum (step > 0.35): **3** frames. The move is visibly gradual over ~1.8 s (navy 50% at 5.8 s; white seal completes 6.6–6.9 s). The last white coverage step is geometrically steep (underside fills the frame in one or two steps).

## Swing samples (10.4–13.0 s, every 0.2 s)

| t | white % | black % | navy % |
|---|--------:|--------:|-------:|
| 10.6 | 99.7 | 0.1 | 0.1 |
| 11.2 | 100.0 | 0.0 | 0.0 |
| 11.4 | 22.2 | 77.8 | 77.8 |
| 11.6 | 0.0 | 100.0 | 17.6 |
| 12.8 | 0.1 | 99.7 | 0.0 |

Longest consecutive growth in black% (step > 0.4%): **3** frames. **Max navy 77.8%** at 11.4 s (< 90% threshold). At 11.4 s both slab colors are present with navy gap (dual-slab beat). Black fill completes by 11.6–12.8 s.

## Errors during revise

- First revise attempt added lit materials; white/black holds turned grey and failed spot checks. Reverted to unlit cubes.
- Pre-5.1 camera at origin broke the 0.5 s split; restored `z = −5000` pose before rise.

## Artifacts

- `animations/yt01_ortho/yt01_ortho.mp4`
- `animations/yt01_ortho/yt01_ortho.ecproj`
- `animations/yt01_ortho/check/rise_*.png`, `swing_*.png`, spot PNGs

## Round 2 (deep corridor + even swing)

Model: Composer. Date: 2026-10-15.

**Unchanged:** rise (`cameraPoseAt` 5.1–6.9), white/black holds, captions, pyramid pullback, tier labels 36 px.

**Swing (10.6–12.8 s):**

- Buffer and Out-group slabs: **12× Z scale** during the swing (ramps down 12.8–13.4) so the corridor recedes along +Z.
- Camera: linear `u = (t−10.6)/2.2`; Y centers in the gap (`y = 0` for `0.12 ≤ u ≤ 0.88`); forward pull `z = −2400·sin(πu)`.
- Pitch: quick leave of +90° (`u < 0.06`), then **±6°** linear sweep for `0.06 ≤ u ≤ 0.96`, final snap to −90° in the last 0.04 of `u` (12.72–12.8 s).

Rebuilt with the same `ec.py` sequence as above; render ~11 s wall time.

### Swing verification (5 fps, 10.5–12.9 s)

Luminance proxies: white = lum > 200, black = lum < 30. Dual-slab frame = ≥ 15% white **and** ≥ 15% black.

| t | white % | black % | navy % | dual |
|---|--------:|--------:|-------:|:----:|
| 10.5 | 99.7 | 0.1 | 0.1 | |
| 10.7 | 99.7 | 0.1 | 0.1 | |
| 10.9 | 57.2 | 42.7 | 22.1 | ✓ |
| 11.1 | 52.5 | 47.4 | 22.0 | ✓ |
| 11.3 | 47.8 | 52.1 | 21.9 | ✓ |
| 11.5 | 43.2 | 56.8 | 21.9 | ✓ |
| 11.7 | 38.5 | 61.5 | 21.9 | ✓ |
| 11.9 | 33.8 | 66.2 | 21.9 | ✓ |
| 12.1 | 29.0 | 70.9 | 21.9 | ✓ |
| 12.3 | 24.3 | 75.6 | 22.0 | ✓ |
| 12.5 | 19.5 | 80.4 | 22.0 | ✓ |
| 12.7 | 16.6 | 83.1 | 21.9 | ✓ |
| 12.9 | 0.1 | 99.7 | 0.0 | |

**Max consecutive dual-slab frames (5 fps): 10** (threshold ≥ 6). Max navy during swing **22.1%** (thin horizon band). PNGs: `check/swing5_*.png`. Re-run: `python3 animations/yt01_ortho/check_swing5.py`.
