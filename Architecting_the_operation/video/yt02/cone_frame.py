"""R5 cone frame: the manimgx cone shots wear the Figma frames' ground, border and circle geometry.

The five-tier cone is the one manimgx exception in an all-Figma episode, so a cut between a
cone shot and a Figma frame must not show: same background, same circuit border, and at the
out-group handoff the same circle, pixel for pixel.

    python cone_frame.py border <figma card clip>   # re-lift the border from a Figma clip

The border is drawn as traced vector outlines. A fixed-in-frame ImageMobject switches off the
3-D depth order in manimgx (tiers then draw in the order they were added, so a view from below
shows the apex on top), so the lifted bitmap is kept only as the tracing source.
"""

import sys
from pathlib import Path

import manimgx as m
import numpy as np

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))

from common16x9 import _norm  # noqa: E402

# Figma frames decode to RGB (11, 25, 41). Through the run encoder #0D1B2B decodes to the same
# three numbers (#0B1929 itself decodes two levels darker), so this is the source value.
FIGMA_BG = "#0D1B2B"
BORDER_INK = "#E6C899"
BORDER_PNG = YT02 / "cone_assets/figma_border.png"
BORDER_LOOPS = YT02 / "cone_assets/figma_border_loops.npz"  # outlines in 1920×1080 pixels
PX = 135.0  # pixels per scene unit at 1920×1080 (frame height 8)
# The border's inner edge, in scene units: everything the cone shots draw stays inside it.
SAFE_X, SAFE_Y = 6.1, 3.05

# Out-group → Figma pie handoff: the shot ends on this flat disc, centred in the frame.
HANDOFF_RADIUS = 2.8  # scene units: 378 px; clears the border's ground symbols top and bottom
HANDOFF_PX = dict(cx=960, cy=540, r=round(HANDOFF_RADIUS * PX))


class ConeFrame:
    """Mixin for a YTScene3D cone scene; list it before the scene base."""

    def begin(self):
        super().begin()
        self.camera.background_color = FIGMA_BG

    def add_border(self):
        border = m.VMobject(fill_color=BORDER_INK, fill_opacity=1, stroke_width=0)
        loops = np.load(BORDER_LOOPS)
        for name in loops.files:
            px = loops[name].astype(float)
            pts = np.column_stack([(px[:, 0] - 959.5) / PX, (539.5 - px[:, 1]) / PX, np.zeros(len(px))])
            border.start_new_path(pts[0])
            border.add_points_as_corners([*pts[1:], pts[0]])
        self.flat(border)
        return border

    def cue_any(self, *words, after=None, ks=None, fallback=None, lead=0.1):
        """The first spoken word starting with any of `words`, later than `after`.

        Searches the run's turns `ks` (all of them by default), so a beat follows its word
        when the script is reordered or a turn moves. `fallback` (a time) stands in when no
        word matches; without one a miss raises KeyError."""
        after = self.T0 if after is None else after
        keys = [_norm(w) for w in words]
        for k in ks if ks is not None else range(len(self.run_turns)):
            index = self.run_turns[k]
            start = self.BEATS[index]
            for word in self.WORDS[index]["words"]:
                t = start + max(0.0, word["t"] - lead)
                if t > after + 1e-6 and any(_norm(word["w"]).startswith(key) for key in keys):
                    return t
        if fallback is None:
            raise KeyError(f"{type(self).__name__}: none of {words} after {after:.2f}s")
        return fallback

    def turn_of(self, t):
        """The run-local index of the turn spoken at time `t`."""
        ks = [k for k in range(len(self.run_turns)) if self.BEATS[self.run_turns[k]] <= t + 1e-6]
        return ks[-1] if ks else 0


def _trace(alpha, level=0.5):
    """Closed outlines of alpha >= level by oriented marching squares, in pixels.

    Every loop keeps the ink on the same side, so holes wind against their outlines and fill
    correctly under either fill rule."""
    a = np.pad(alpha, 1)
    inside = a >= level
    case = inside[:-1, :-1] * 1 + inside[:-1, 1:] * 2 + inside[1:, 1:] * 4 + inside[1:, :-1] * 8
    ys, xs = np.nonzero((case > 0) & (case < 15))
    corners = {0: ((0, 0), (1, 0)), 1: ((1, 0), (1, 1)), 2: ((0, 1), (1, 1)), 3: ((0, 0), (0, 1))}
    table = {1: [(3, 0)], 2: [(0, 1)], 3: [(3, 1)], 4: [(1, 2)], 5: [(3, 0), (1, 2)], 6: [(0, 2)],
             7: [(3, 2)], 8: [(2, 3)], 9: [(2, 0)], 10: [(0, 1), (2, 3)], 11: [(2, 1)], 12: [(1, 3)],
             13: [(1, 0)], 14: [(0, 3)]}

    def key(x, y, e):
        return {0: ("h", x, y), 2: ("h", x, y + 1), 3: ("v", x, y), 1: ("v", x + 1, y)}[e]

    def point(x, y, e):
        (dx0, dy0), (dx1, dy1) = corners[e]
        p, q = a[y + dy0, x + dx0], a[y + dy1, x + dx1]
        t = 0.5 if p == q else (level - p) / (q - p)
        return (x + dx0 + t * (dx1 - dx0) - 1, y + dy0 + t * (dy1 - dy0) - 1)

    nxt, pts = {}, {}
    for x, y in zip(xs, ys):
        for e0, e1 in table[case[y, x]]:
            k0, k1 = key(x, y, e0), key(x, y, e1)
            nxt[k0], pts[k0], pts[k1] = k1, point(x, y, e0), point(x, y, e1)
    loops, seen = [], set()
    for start in nxt:
        loop, k = [], start
        while k not in seen and k in nxt:
            seen.add(k)
            loop.append(pts[k])
            k = nxt[k]
        if len(loop) >= 3:
            loops.append(_simplify(np.array(loop)))
    return loops


def _simplify(pts, tol=0.25):
    """Douglas–Peucker to a quarter pixel."""
    keep = np.zeros(len(pts), bool)
    keep[[0, -1]] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        seg = pts[j] - pts[i]
        rel = pts[i + 1:j] - pts[i]
        d = np.abs(seg[0] * rel[:, 1] - seg[1] * rel[:, 0]) / (np.hypot(*seg) or 1.0)
        k = int(d.argmax()) + i + 1
        if d.max() > tol:
            keep[k] = True
            stack += [(i, k), (k, j)]
    return pts[keep]


def lift_border(clip, out=BORDER_PNG, loops_out=BORDER_LOOPS):
    """Cut the circuit border out of a Figma clip frame as ink over alpha, then trace it."""
    import subprocess
    import tempfile

    from PIL import Image

    png = Path(tempfile.mkdtemp()) / "frame.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "4", "-i", str(clip), "-frames:v", "1",
                    "-pix_fmt", "rgb24", str(png)], check=True)
    a = np.asarray(Image.open(png).convert("RGB")).astype(float)
    bg = a[540, 20]
    band = np.zeros(a.shape[:2], bool)
    band[:150], band[960:], band[:, :130], band[:, 1790:] = True, True, True, True
    ink = a[255:262, 70:77].reshape(-1, 3).mean(0)  # inside the left arrowhead: solid ink
    v = ink - bg
    alpha = np.clip(((a - bg) @ v) / (v @ v), 0, 1) * band
    alpha[alpha < 0.03] = 0
    rgba = np.zeros(a.shape[:2] + (4,), np.uint8)
    rgba[..., :3] = np.clip(ink, 0, 255).round()
    rgba[..., 3] = (alpha * 255).round()
    Image.fromarray(rgba, "RGBA").save(out)
    np.savez_compressed(loops_out, *[loop.astype(np.float32) for loop in _trace(alpha)])
    return out, loops_out


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "border":
        print(lift_border(sys.argv[2]))
    else:
        print(__doc__)
