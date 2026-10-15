"""S04-05: status wage and compound public wage."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def tier_box(label, w=4.0, color=INK):
    r = m.RoundedRectangle(width=w, height=1.05, corner_radius=0.12, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(label, 34, color, width=w - 0.35).move_to(r)
    return m.VGroup(r, t)


class StatusWage(YTScene):
    SHOT = "S04-05"

    def shot_S04_05(self):
        elite = tier_box("Elite", 3.2, GOLD).shift(m.UP * 2.35 + m.LEFT * 3.2)
        buf = tier_box("Buffer Class", 4.6, INK).shift(m.UP * 0.15)
        out = tier_box("Out-group", 3.8, HER).shift(m.DOWN * 2.35 + m.RIGHT * 4.2)
        boundary = m.DashedLine(buf.get_right() + m.RIGHT * 0.15, out.get_left() + m.LEFT * 0.15,
                                color=GOLD, dash_length=0.14, stroke_width=4)
        extract = m.Arrow(elite.get_bottom(), buf.get_top(), buff=0.12, color=HER, stroke_width=6)
        extract_lab = T("EXTRACTION", 34, HER, "NORMAL").next_to(extract, m.LEFT, buff=0.2)
        self.add(elite, buf, out, boundary)
        self.until(self.at(0, "status"))
        wage = M(r"\psi_s", 64, GOLD).shift(m.LEFT * 5.2 + m.UP * 0.15)
        wage_lab = T("STATUS WAGE", 34, GOLD).next_to(wage, m.DOWN, buff=0.14)
        link = m.Arrow(wage.get_right(), boundary.get_center() + m.LEFT * 0.25, buff=0.1, color=GOLD, stroke_width=5)
        self.play(m.FadeIn(wage, wage_lab), m.GrowArrow(link), run_time=0.9)
        self.until(self.at(0, "exploited"))
        stake = T("STAKE IN BOUNDARY", 34, OK).to_corner(m.DL, buff=0.55)
        self.play(m.FadeIn(stake), run_time=0.5)
        self.until(self.beat_end(0) - 0.2)

        self.until(self.at(1, "public"))
        pub = m.VGroup(*[tier_box(n, 2.6, DIM) for n in ("SCHOOLS", "COURTS", "POLICE")])
        pub.arrange(m.DOWN, buff=0.18).next_to(buf, m.RIGHT, buff=0.65)
        pub_head = T("PUBLIC", 34, DIM, "NORMAL").next_to(pub, m.UP, buff=0.12)
        compound = T("COMPOUND WAGE", 36, GOLD).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(pub_head, pub), run_time=0.8)
        self.until(self.at(1, "distinguish"))
        self.play(m.FadeIn(compound), wage.animate.scale(1.1), run_time=0.6)
        self.until(self.beat_end(1) - 0.3)
