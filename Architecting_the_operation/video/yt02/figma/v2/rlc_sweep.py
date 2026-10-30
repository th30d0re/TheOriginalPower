"""Damped responses of the series RLC circuit (Eq. 2.11) for the G11 Figma explainer.

    python3 Architecting_the_operation/video/yt02/figma/v2/rlc_sweep.py

Integrates L q'' + R q' + q / C = 0 from a reform shock q(0) = Q0, q'(0) = 0 (the book's undriven
case, Eq. 1.7b) for the baseline and for each parameter raised and lowered. The plot coordinates
for g_rlc.js (y pixels on a uniform t grid) are written to rlc_sweep.json next to this file, so the Figma curves are the computed
curves. Parameters are illustrative and dimensionless; the book gives no calibrated L, R or C.

Readouts per curve: damping ratio zeta = (R / 2) sqrt(C / L), the first overshoot below the
baseline (backlash depth, as a fraction of Q0), the 5 % settling time, and the ringing period.
"""
import json
from pathlib import Path

import numpy as np
from scipy.integrate import solve_ivp

HERE = Path(__file__).resolve().parent
BASE = {"L": 1.0, "R": 0.4, "C": 1.0}
Q0, T_END, N = 1.0, 30.0, 151
# Each sweep runs base → high → low → base; the values are the frames of that run.
SWEEPS = {
    "L": [1.0, 1.6, 2.5, 1.6, 1.0, 0.65, 0.4, 0.65, 1.0],
    "R": [0.4, 0.9, 1.5, 2.0, 2.8, 2.0, 1.5, 0.9, 0.4, 0.2, 0.1, 0.2, 0.4],
    "C": [1.0, 1.6, 2.5, 1.6, 1.0, 0.65, 0.4, 0.65, 1.0],
}
# Plot box in frame pixels, shared with g_rlc.js.
PLOT = {"x": 860, "y": 330, "w": 860, "h": 420, "qmin": -1.0, "qmax": 1.0}


def response(L, R, C, t=None):
    t = np.linspace(0, T_END, N) if t is None else t
    sol = solve_ivp(lambda _, y: [y[1], -(R * y[1] + y[0] / C) / L], (0, t[-1]), [Q0, 0.0],
                    t_eval=t, rtol=1e-9, atol=1e-12)
    return t, sol.y[0]


def metrics(L, R, C):
    zeta = R / 2 * np.sqrt(C / L)
    w0 = 1 / np.sqrt(L * C)
    # readouts on a long dense grid so slow overdamped curves settle inside it
    td, qd = response(L, R, C, np.linspace(0, 120, 24001))
    out = abs(min(qd.min(), 0.0)) / Q0
    outside = np.nonzero(np.abs(qd) > 0.05 * Q0)[0]
    settle = float(td[outside[-1] + 1]) if len(outside) and outside[-1] + 1 < len(td) else float("inf")
    period = float(2 * np.pi / (w0 * np.sqrt(1 - zeta ** 2))) if zeta < 1 else None
    return {"zeta": round(float(zeta), 3), "overshoot": round(float(out), 3), "settle": round(settle, 1),
            "period": round(period, 1) if period else None, "regime": "underdamped" if zeta < 1 else
            ("critically damped" if zeta == 1 else "overdamped")}


def to_px(t, q):
    # y in plot pixels (half-pixel precision) on the uniform t grid; g_rlc.js rebuilds the path from it
    y = (PLOT["qmax"] - q) / (PLOT["qmax"] - PLOT["qmin"]) * PLOT["h"]
    ys = [round(2 * float(v)) / 2 for v in y]
    return [int(v) if v == int(v) else v for v in ys]


def curve(L, R, C):
    t, q = response(L, R, C)
    return {"L": L, "R": R, "C": C, "ys": to_px(t, q), **metrics(L, R, C)}


def main():
    # curves holds each distinct parameter set once; sweeps lists the run order by curve key.
    curves = {"base": curve(**BASE)}
    sweeps = {}
    for key, vals in SWEEPS.items():
        sweeps[key] = []
        for v in vals:
            k = "base" if v == BASE[key] else f"{key}={v:g}"
            curves.setdefault(k, curve(**{**BASE, key: v}))
            sweeps[key].append(k)
    out = {"plot": PLOT, "t_end": T_END, "Q0": Q0, "base": BASE, "curves": curves, "sweeps": sweeps}
    (HERE / "rlc_sweep.json").write_text(json.dumps(out, separators=(",", ":")))
    for k, c in curves.items():
        print(f"{k:<7} ζ={c['zeta']:<6} overshoot={c['overshoot']:<6} settle={c['settle']:<5} "
              f"period={c['period']} {c['regime']}")


if __name__ == "__main__":
    main()
