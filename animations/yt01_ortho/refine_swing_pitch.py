#!/usr/bin/env python3
"""Refine swing_pitch.json from current yt01_ortho.mp4 + embedded pitches."""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
mp4 = ROOT / "yt01_ortho.mp4"
build = ROOT / "build.jsx"
json_path = ROOT / "swing_pitch.json"
T0, T1 = 10.6, 12.8
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


def load_pitches():
    if json_path.is_file():
        return json.loads(json_path.read_text())
    text = build.read_text()
    m = re.search(r"var SWING_PITCH = \[([\s\S]*?)\];", text)
    if not m:
        raise SystemExit("SWING_PITCH not found")
    nums = re.findall(r"-?\d+\.?\d*", m.group(1))
    return [float(x) for x in nums]


def scale_to_end(pitches, end=-90.0):
    if abs(pitches[-1] - pitches[0]) < 1e-9:
        return pitches
    scale = (end - pitches[0]) / (pitches[-1] - pitches[0])
    return [pitches[0] + (p - pitches[0]) * scale for p in pitches]


def refine(pitches, shares):
    new = [pitches[0]]
    for i in range(1, len(pitches)):
        dp = pitches[i] - pitches[i - 1]
        dw = shares[i][0] - shares[i - 1][0]
        db = shares[i][1] - shares[i - 1][1]
        s = 1.0
        if abs(dw) > STEP:
            s = min(s, STEP / abs(dw))
        if abs(db) > STEP:
            s = min(s, STEP / abs(db))
        new.append(new[-1] + dp * s)
    return scale_to_end(new)


def patch_build(pitches):
    text = build.read_text()
    lines = []
    for i in range(0, len(pitches), 10):
        chunk = pitches[i : i + 10]
        lines.append("  " + ", ".join(f"{p:g}" for p in chunk) + ",")
    block = "var SWING_PITCH = [\n" + "\n".join(lines).rstrip(",") + "\n];"
    text = re.sub(r"var SWING_PITCH = \[[\s\S]*?\];", block, text)
    build.write_text(text)


def main():
    n = int(round((T1 - T0) * FPS)) + 1
    times = [T0 + i / FPS for i in range(n)]
    pitches = load_pitches()
    if len(pitches) != n:
        print(f"Pitch count {len(pitches)} != {n}", file=sys.stderr)
    shares = [frame_shares(t) for t in times]
    new = refine(pitches, shares)
    json_path.write_text(json.dumps([round(p, 4) for p in new]))
    patch_build(new)
    print(f"Refined {n} pitches; end {new[-1]:.2f}")


if __name__ == "__main__":
    main()
