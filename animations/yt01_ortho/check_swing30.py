#!/usr/bin/env python3
"""30 fps frame-step check: white/black share must change by <= 0.06 between frames."""
import subprocess
import sys
from pathlib import Path

mp4 = Path(__file__).resolve().parent / "yt01_ortho.mp4"
STEP_LIMIT = 0.06


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


def check_range(label, t0, t1, fps=30):
    times = []
    t = t0
    while t <= t1 + 1e-9:
        times.append(t)
        t += 1 / fps
    shares = [frame_shares(ti) for ti in times]
    max_dw = max_db = 0.0
    worst = None
    for i in range(1, len(times)):
        dw = abs(shares[i][0] - shares[i - 1][0])
        db = abs(shares[i][1] - shares[i - 1][1])
        if dw > max_dw:
            max_dw = dw
            if dw >= max_db:
                worst = (times[i - 1], times[i], "white", dw, shares[i - 1][0], shares[i][0])
        if db > max_db:
            max_db = db
            if db >= max_dw:
                worst = (times[i - 1], times[i], "black", db, shares[i - 1][1], shares[i][1])
    print(f"\n=== {label} ({t0}–{t1} s, {len(times)} frames) ===")
    print("t(s)   white%  black%")
    for ti, (ws, bs) in zip(times, shares):
        print(f"{ti:6.3f} {ws*100:6.2f} {bs*100:6.2f}")
    print(f"Max |Δwhite| = {max_dw:.4f}, Max |Δblack| = {max_db:.4f} (limit {STEP_LIMIT})")
    if worst:
        print(
            f"Largest step: {worst[2]} {worst[0]:.3f}→{worst[3]:.3f} "
            f"{worst[4]:.3f}→{worst[5]:.3f}"
        )
    ok = max_dw <= STEP_LIMIT and max_db <= STEP_LIMIT
    return ok, max_dw, max_db


def main():
    if not mp4.is_file():
        print(f"Missing {mp4}", file=sys.stderr)
        sys.exit(2)
    ok_rise, _, _ = check_range("Rise", 5.0, 7.0)
    ok_swing, _, _ = check_range("Swing", 10.5, 12.9)
    if ok_rise and ok_swing:
        print("\nPASS: all consecutive frame steps <=", STEP_LIMIT)
        sys.exit(0)
    print("\nFAIL: step above limit", STEP_LIMIT)
    sys.exit(1)


if __name__ == "__main__":
    main()
