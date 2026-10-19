#!/usr/bin/env python3
"""Refine RISE_GAP table (5.0–6.0 s) to cap luminance share steps."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
mp4 = ROOT / "yt01_ortho.mp4"
build = ROOT / "build.jsx"
json_path = ROOT / "rise_gap.json"
T0, T1 = 5.0, 6.0
FPS = 30
STEP = 0.055


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


def smooth(t, a, b):
    u = max(0.0, min(1.0, (t - a) / (b - a)))
    return u * u * u * (u * (u * 6 - 15) + 10)


def load_gap(n):
    if json_path.is_file():
        vals = json.loads(json_path.read_text())
        if len(vals) == n:
            return vals
    return [smooth(T0 + i / FPS, 5.0, 6.0) for i in range(n)]


def scale_to_end(vals, end=1.0):
    if abs(vals[-1] - vals[0]) < 1e-9:
        return vals
    scale = (end - vals[0]) / (vals[-1] - vals[0])
    return [vals[0] + (v - vals[0]) * scale for v in vals]


def refine(vals, shares):
    new = [vals[0]]
    for i in range(1, len(vals)):
        dv = vals[i] - vals[i - 1]
        dw = shares[i][0] - shares[i - 1][0]
        db = shares[i][1] - shares[i - 1][1]
        s = 1.0
        if abs(dw) > STEP:
            s = min(s, STEP / abs(dw))
        if abs(db) > STEP:
            s = min(s, STEP / abs(db))
        new.append(new[-1] + dv * s)
    return scale_to_end(new, 1.0)


def patch_build(vals):
    text = build.read_text()
    lines = []
    for i in range(0, len(vals), 12):
        chunk = vals[i : i + 12]
        lines.append("  " + ", ".join(f"{p:.5f}" for p in chunk) + ",")
    block = "var RISE_GAP = [\n" + "\n".join(lines).rstrip(",") + "\n];"
    text = re.sub(r"var RISE_GAP = \[[\s\S]*?\];", block, text)
    build.write_text(text)


def main():
    n = int(round((T1 - T0) * FPS)) + 1
    times = [T0 + i / FPS for i in range(n)]
    vals = load_gap(n)
    shares = [frame_shares(t) for t in times]
    new = refine(vals, shares)
    json_path.write_text(json.dumps([round(v, 5) for v in new]))
    patch_build(new)
    print(f"Refined {n} rise gap samples; end {new[-1]:.3f}")


if __name__ == "__main__":
    main()
