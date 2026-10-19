#!/usr/bin/env python3
"""Build SWING_PITCH table from a linear-pitch render (max 0.06 share step)."""
import json
import subprocess
import sys
from pathlib import Path

mp4 = Path(__file__).resolve().parent / "yt01_ortho.mp4"
T0, T1 = 10.6, 12.8
FPS = 30
STEP = 0.06


def lum(r, g, b):
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def frame_shares(t):
    raw = subprocess.check_output(
        [
            "ffmpeg",
            "-ss",
            f"{t:.6f}",
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
    w = b = 0
    for i in range(0, len(raw), 3):
        r, g, bch = raw[i] / 255, raw[i + 1] / 255, raw[i + 2] / 255
        L = lum(r, g, bch)
        if L > 200 / 255:
            w += 1
        if L < 30 / 255:
            b += 1
    return w / n, b / n


def main():
    n = int(round((T1 - T0) * FPS)) + 1
    times = [T0 + i / FPS for i in range(n)]
    pitches_lin = [90 - 180 * i / (n - 1) for i in range(n)]
    shares = [frame_shares(t) for t in times]

    raw = [90.0]
    for i in range(1, n):
        dp = pitches_lin[i] - pitches_lin[i - 1]
        dw = shares[i][0] - shares[i - 1][0]
        db = shares[i][1] - shares[i - 1][1]
        scale = 1.0
        if abs(dw) > STEP:
            scale = min(scale, STEP / abs(dw))
        if abs(db) > STEP:
            scale = min(scale, STEP / abs(db))
        raw.append(raw[-1] + dp * scale)

    end = raw[-1]
    target = -90.0
    if abs(end - 90) < 1e-6:
        pitches = [90.0] * n
    else:
        scale = (target - 90) / (end - 90)
        pitches = [90 + (r - 90) * scale for r in raw]

    out = Path(__file__).resolve().parent / "swing_pitch.json"
    out.write_text(json.dumps([round(p, 4) for p in pitches]))
    print(f"Wrote {len(pitches)} pitches to {out}")
    print(f"End pitch {pitches[-1]:.2f}")


if __name__ == "__main__":
    main()
