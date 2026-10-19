#!/usr/bin/env python3
"""5 fps swing verification (10.5–12.9 s): dual-slab pixel counts."""
import subprocess
from pathlib import Path

mp4 = Path(__file__).resolve().parent / "yt01_ortho.mp4"
out_dir = Path(__file__).resolve().parent / "check"
out_dir.mkdir(parents=True, exist_ok=True)

NAVY = (0.06, 0.09, 0.17)


def near(c, ref, delta):
    return all(abs(c[i] - ref[i]) <= delta for i in range(3))


def lum(r, g, b):
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


times = [round(10.5 + i * 0.2, 1) for i in range(int((12.9 - 10.5) / 0.2) + 1)]
results = []
for t in times:
    png = out_dir / f"swing5_{t:.1f}.png"
    subprocess.run(
        ["ffmpeg", "-y", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", str(png)],
        capture_output=True,
        check=True,
    )
    raw = subprocess.check_output(
        [
            "ffmpeg",
            "-ss",
            f"{t:.3f}",
            "-i",
            str(mp4),
            "-frames:v",
            "1",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ],
        stderr=subprocess.DEVNULL,
    )
    n = len(raw) // 3
    w_pct = b_pct = n_pct = 0
    for i in range(0, len(raw), 3):
        r, g, b = raw[i] / 255, raw[i + 1] / 255, raw[i + 2] / 255
        L = lum(r, g, b)
        if L > 200 / 255:
            w_pct += 1
        if L < 30 / 255:
            b_pct += 1
        if near((r, g, b), NAVY, 0.12):
            n_pct += 1
    results.append((t, 100 * w_pct / n, 100 * b_pct / n, 100 * n_pct / n))

dual_run = max_dual = 0
print("t | white% | black% | navy% | dual(>=15% both)")
for t, w, b, nav in results:
    dual = w >= 15 and b >= 15
    if dual:
        dual_run += 1
        max_dual = max(max_dual, dual_run)
    else:
        dual_run = 0
    print(f"{t:4.1f} | {w:5.1f} | {b:5.1f} | {nav:5.1f} | {dual}")
print(f"\nMax consecutive dual-slab frames (5fps): {max_dual}")
