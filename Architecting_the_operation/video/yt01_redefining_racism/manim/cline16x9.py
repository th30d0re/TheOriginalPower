"""S10-05 cline gradient; S10-13 binary legal partition."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, T, YTScene  # noqa: E402

CLINE_COLORS = ["#3d2314", "#5c3a24", "#7a5238", "#9a7050", "#b88868", "#d4a888", "#e8c4a8"]


def cline_bar():
    segments = m.VGroup()
    for col in CLINE_COLORS:
        segments.add(m.Rectangle(width=1.45, height=0.85, fill_color=col, fill_opacity=1, stroke_width=0))
    segments.arrange(m.RIGHT, buff=0)
    rail = m.Line(segments.get_left() + m.LEFT * 0.2, segments.get_right() + m.RIGHT * 0.2, color=DIM, stroke_width=3)
    rail.next_to(segments, m.DOWN, buff=0.38)
    left = T("LATITUDE", 34, DIM, "NORMAL").next_to(rail, m.LEFT, buff=0.18)
    right = T("GRADIENT", 34, DIM, "NORMAL").next_to(rail, m.RIGHT, buff=0.18)
    group = m.VGroup(segments, rail, left, right)
    if group.width > 12.6:
        group.scale_to_fit_width(12.6)
    return group


class ClineGradient(YTScene):
    SHOT = "S10-05"

    def shot_S10_05(self):
        head = T("CONTINUOUS CLINE", 44, GOLD).to_edge(m.UP, buff=0.42)
        cline = cline_bar().shift(m.DOWN * 0.15)
        hux = T("HUXLEY 1938", 34, DIM, "NORMAL").next_to(cline, m.DOWN, buff=0.65)
        geo = T("SKIN COLOR · GEOGRAPHY", 34, INK).next_to(head, m.DOWN, buff=0.2)
        self.add(head, geo)
        self.play(m.FadeIn(cline), run_time=1.0)
        self.until(self.at(0, "gradient"))
        self.play(m.FadeIn(hux), run_time=0.5)
        self.until(self.at(0, "cline"))

        # 1 — hold returns after card shots; ancient DNA timeline on cline
        self.until(self.at(1, "Ancient"))
        timeline = cline[1].copy().set_color(GOLD).set_stroke(width=4)
        marks = m.VGroup(
            T("7 ka", 34, GOLD).move_to(timeline.point_from_proportion(0.22) + m.DOWN * 0.55),
            T("10 ka", 34, GOLD).move_to(timeline.point_from_proportion(0.55) + m.DOWN * 0.55),
            T("aDNA", 34, GOLD).move_to(timeline.point_from_proportion(0.78) + m.DOWN * 0.72),
        )
        dna = T("ANCIENT DNA TIMELINE", 36, GOLD).to_edge(m.DOWN, buff=0.4)
        self.play(m.FadeIn(timeline), m.FadeIn(marks), m.FadeIn(dna), run_time=0.8)
        self.until(self.at(1, "timeline"))
        self.until(self.beat_end(1) - 0.3)


class BinaryPartitionCut(YTScene):
    SHOT = "S10-13"

    def shot_S10_13(self):
        cline = cline_bar().shift(m.UP * 0.2)
        head = T("BINARY LEGAL PARTITION", 44, GOLD).to_edge(m.UP, buff=0.42)
        self.add(head, cline)
        self.until(self.at(0, "discrete"))
        blade = m.Line(cline[0].get_top() + m.UP * 0.5, cline[0].get_bottom() + m.DOWN * 0.5, color=HER, stroke_width=8)
        blade.move_to(cline[0].get_center() + m.RIGHT * 2.9)
        cut = T("LEGAL CUT", 36, HER).next_to(blade, m.UP, buff=0.18)
        left = T("CATEGORY A", 34, INK).next_to(cline, m.DOWN, buff=1.05).shift(m.LEFT * 3.2)
        right = T("CATEGORY B", 34, INK).next_to(cline, m.DOWN, buff=1.05).shift(m.RIGHT * 3.2)
        bio = T("BIOLOGY STAYS CONTINUOUS", 34, DIM, "NORMAL").to_edge(m.DOWN, buff=0.48)
        self.play(m.Create(blade), m.FadeIn(cut), run_time=0.7)
        self.play(m.FadeIn(left), m.FadeIn(right), m.FadeIn(bio), run_time=0.6)
        self.until(self.at(0, "partition"))

        # 1 — hold S10-21: permanent legal underclass
        self.until(self.at(1, "inescapable"))
        perm = T("PERMANENT LEGAL PARTITION", 36, HER, width=12.0).next_to(bio, m.UP, buff=0.38)
        self.play(m.FadeIn(perm, shift=m.UP * 0.1), blade.animate.set_stroke(width=10), run_time=0.7)
        self.until(self.at(1, "partition"))
        self.until(self.beat_end(1) - 0.3)
