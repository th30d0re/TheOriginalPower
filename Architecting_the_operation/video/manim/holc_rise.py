"""Boston's 1938 HOLC map rising into shooting rates, 2019-2025.

Heights are the grade-level rate (shootings per 10,000 residents per year,
Paper/data/spatial/boston/RESULTS.md, primary measure 2019-2025): every
neighborhood of a grade rises to that grade's rate, so the shot compares grades,
not individual neighborhoods.
"""
import json
from pathlib import Path

import manimgx as m

m.config.pixel_width, m.config.pixel_height = 1080, 1920
m.config.frame_height = 14.22  # frame_width follows the 9:16 aspect ratio (8.0)
m.config.background_color = "#0B1A2E"

RATES = {"A": 0.43, "B": 0.43, "C": 3.12, "D": 3.14, None: 1.36}  # A and B are combined in RESULTS.md
COLORS = {"A": "#76a865", "B": "#7cb9e8", "C": "#e8d44d", "D": "#d9534f", None: "#8a8f98"}
Z_PER_RATE = 0.3
WALLS = {"A": "#4f7343", "B": "#527c9c", "C": "#9c8e33", "D": "#923835", None: "#5c6066"}
CREAM = "#F4EBDD"

POLYS = json.loads((Path(__file__).parent / "holc_boston.json").read_text())


def grade_of(p):
    g = p["grade"]
    return g if g in RATES else None


def block(ring, height, color, wall):
    """Top face plus side walls of one extruded neighborhood."""
    top = [(x, y, height) for x, y in ring]
    parts = [m.Polygon(*top, fill_color=color, fill_opacity=1.0, stroke_color="#0B1A2E", stroke_width=1, shade_in_3d=True)]  # shaded paths are drawn by depth
    n = len(ring)
    for i in range(n):
        (x0, y0), (x1, y1) = ring[i], ring[(i + 1) % n]
        parts.append(m.Polygon((x0, y0, 0), (x1, y1, 0), (x1, y1, height), (x0, y0, height),
                               fill_color=wall, fill_opacity=1.0, stroke_width=0, shade_in_3d=True))
    return m.VGroup(*parts[1:], parts[0])  # top face last, drawn over its walls


class HolcRise(m.ThreeDScene):
    def construct(self) -> None:
        self.set_camera_orientation(phi=0, theta=-90 * m.DEGREES, zoom=1.0)

        flat = m.VGroup(*[block(p["ring"], 0.01, COLORS[grade_of(p)], WALLS[grade_of(p)]) for p in POLYS])
        tall = m.VGroup(*[block(p["ring"], RATES[grade_of(p)] * Z_PER_RATE, COLORS[grade_of(p)], WALLS[grade_of(p)]) for p in POLYS])
        for g in (flat, tall):
            g.scale(0.88, about_point=m.ORIGIN).shift(0.5 * m.UP)

        title = m.Text("Boston, 1938", font_size=64, color=CREAM, weight="BOLD").to_edge(m.UP, buff=2.2)
        sub = m.Text("The federal redlining map", font_size=38, color=CREAM).next_to(title, m.DOWN, buff=0.25)
        self.add_fixed_in_frame_mobjects(title, sub)
        self.play(m.FadeIn(flat), m.FadeIn(title), m.FadeIn(sub), run_time=1.2)
        self.wait(0.8)

        title2 = m.Text("Shootings, 2019-2025", font_size=50, color=CREAM, weight="BOLD").to_edge(m.UP, buff=2.2)
        sub2 = m.Text("per 10,000 residents a year", font_size=38, color=CREAM).next_to(title2, m.DOWN, buff=0.25)
        self.add_fixed_in_frame_mobjects(title2, sub2)
        self.remove(title2, sub2)
        self.move_camera(phi=48 * m.DEGREES, theta=-80 * m.DEGREES, zoom=0.9,
                         added_anims=[m.Transform(flat, tall), m.FadeOut(title), m.FadeOut(sub),
                                      m.FadeIn(title2), m.FadeIn(sub2)],
                         run_time=3.0)

        rows = m.VGroup(*[
            m.Text(t, font_size=40, color=c, weight="BOLD")
            for t, c in [("Graded D   3.14", COLORS["D"]), ("Graded C   3.12", COLORS["C"]),
                         ("Graded A and B   0.43", COLORS["B"])]
        ]).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.3).to_edge(m.DOWN, buff=1.9)
        note = m.Text("About 7 times the rate", font_size=44, color=CREAM, weight="BOLD").next_to(rows, m.UP, buff=0.45)
        self.add_fixed_in_frame_mobjects(rows, note)
        self.remove(rows, note)
        self.move_camera(theta=-100 * m.DEGREES, run_time=4.5,
                         added_anims=[m.FadeIn(rows, run_time=1.0), m.FadeIn(note, run_time=2.0)])
        self.wait(0.5)
