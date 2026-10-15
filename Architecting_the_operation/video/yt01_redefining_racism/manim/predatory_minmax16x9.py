"""S04-16: Predatory Min-Max Function."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


class PredatoryMinMax(YTScene):
    SHOT = "S04-16"

    def shot_S04_16(self):
        ax = m.Axes(x_range=[0, 5, 1], y_range=[0, 5, 1], x_length=6.8, y_length=4.8,
                    axis_config={"color": DIM, "stroke_width": 2}).shift(m.DOWN * 0.25)
        x_lab = T("CLASS RESISTANCE", 34, HER, "NORMAL").next_to(ax.x_axis, m.DOWN, buff=0.28)
        y_lab = T("ELITE EXTRACTION", 34, GOLD, "NORMAL").next_to(ax.y_axis, m.LEFT, buff=0.22).rotate(m.PI / 2)
        title = T("PREDATORY MIN-MAX", 44, GOLD).to_edge(m.UP, buff=0.45)
        self.add(title, ax, x_lab, y_lab)
        self.until(self.at(0, "optimizes"))
        max_curve = ax.plot(lambda x: 4.2 - 0.55 * x, color=GOLD, stroke_width=7)
        min_curve = ax.plot(lambda x: 0.6 + 0.35 * x, color=HER, stroke_width=6)
        self.play(m.Create(max_curve), run_time=0.8)
        self.until(self.at(0, "resistance"))
        self.play(m.Create(min_curve), run_time=0.8)
        self.until(self.beat_end(0) - 0.2)

        self.until(self.at(1, "architecture"))
        ops = m.VGroup(T("CREATE", 36, OK), T("JUSTIFY", 36, GOLD), T("MAINTAIN", 36, INK))
        ops.arrange(m.RIGHT, buff=1.4).to_edge(m.UP, buff=0.45)
        cases = T("SLAVERY · JIM CROW · MASS INCARCERATION", 28, DIM, "NORMAL").next_to(ops, m.DOWN, buff=0.38)
        self.play(m.FadeOut(title), m.FadeIn(ops, cases), run_time=0.7)
        self.until(self.at(1, "maintain"))
        for i in range(3):
            self.play(*[ops[j].animate.set_opacity(1.0 if j == i else 0.35) for j in range(3)], run_time=0.35)
        self.play(*[ops[j].animate.set_opacity(1.0) for j in range(3)], run_time=0.25)
        self.until(self.beat_end(1) - 0.3)
