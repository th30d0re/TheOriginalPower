"""S04-01: racism as the chapter's primary test case."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, TEAL, YTScene  # noqa: E402

TIERS = ("Elite", "Puppet Class", "Enforcement Class", "Buffer Class", "Out-group")


def tier_stack(width=3.6, colors=(GOLD, DIM, TEAL, INK, HER)):
    boxes = m.VGroup()
    for name, col in zip(TIERS, colors):
        r = m.RoundedRectangle(width=width, height=0.82, corner_radius=0.1, stroke_color=col, stroke_width=3,
                               fill_color=NAVY2, fill_opacity=1)
        lab = T(name, 34, col, width=width - 0.25)
        lab.move_to(r)
        boxes.add(m.VGroup(r, lab))
    return boxes.arrange(m.DOWN, buff=0.14).move_to(m.LEFT * 4.0 + m.UP * 0.55)


def timeline():
    line = m.Line(m.LEFT * 6.2 + m.DOWN * 2.75, m.RIGHT * 6.2 + m.DOWN * 2.75, color=DIM, stroke_width=5)
    marks = m.VGroup()
    for label, x in (("COLONIAL", -4.8), ("1865", -1.6), ("1965", 1.6), ("PRESENT", 4.8)):
        tick = m.Line([x, -2.58, 0], [x, -2.92, 0], color=GOLD, stroke_width=4)
        marks.add(tick, T(label, 28, DIM, "NORMAL").next_to(tick, m.DOWN, buff=0.12))
    return m.VGroup(line, marks)


class RacialTestCase(YTScene):
    SHOT = "S04-01"

    def shot_S04_01(self):
        arch = tier_stack()
        head = T("PRIMARY TEST CASE", 44, GOLD).to_edge(m.UP, buff=0.45)
        self.add(head, arch)
        self.until(self.at(0, "colonial"))
        tl = timeline()
        self.play(m.FadeIn(tl, shift=m.UP * 0.15), run_time=0.9)
        self.until(self.at(0, "present"))

        self.until(self.at(1, "four"))
        comps = m.VGroup(*[T(t, 34, OK, width=2.6) for t in ("AUTONOMY", "EMPATHY", "IDEOLOGY", "CRITIQUE")])
        comps.arrange_in_grid(rows=2, cols=2, buff=(0.45, 0.28)).next_to(arch, m.RIGHT, buff=0.55).align_to(arch, m.UP)
        self.play(m.LaggedStart(*[m.FadeIn(c, shift=m.LEFT * 0.2) for c in comps], lag_ratio=0.2), run_time=1.0)
        self.until(self.at(1, "expanded"))
        field = m.Ellipse(width=1.4, height=0.7, color=HER, stroke_width=4).shift(m.RIGHT * 4.6 + m.DOWN * 0.2)
        self.play(
            field.animate.stretch_to_fit_width(3.6).stretch_to_fit_height(2.2),
            arch[-1][0].animate.set_stroke(HER, 5),
            run_time=1.2,
        )
        field_lab = T("O racialized", 34, HER).next_to(field, m.UP, buff=0.22)
        self.play(m.FadeIn(field_lab), run_time=0.35)
        self.until(self.beat_end(1) - 0.3)
