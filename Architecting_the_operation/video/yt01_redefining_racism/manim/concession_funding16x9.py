"""S04-10: concession cost allocation and Elite extraction growth."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


class ConcessionFunding(YTScene):
    SHOT = "S04-10"

    def shot_S04_10(self):
        elite = T("Elite", 36, GOLD).move_to(m.UP * 2.85 + m.LEFT * 4.5)
        buf = m.RoundedRectangle(width=4.8, height=1.2, corner_radius=0.12, stroke_color=INK, stroke_width=3,
                                 fill_color=NAVY2, fill_opacity=1).move_to(m.LEFT * 2.8 + m.UP * 0.35)
        buf_lab = T("Buffer allocation", 34, INK).move_to(buf)
        out = m.RoundedRectangle(width=4.4, height=1.2, corner_radius=0.12, stroke_color=HER, stroke_width=3,
                                 fill_color=NAVY2, fill_opacity=1).move_to(m.RIGHT * 2.8 + m.DOWN * 2.15)
        out_lab = T("Out-group extraction", 34, HER, width=4.0).move_to(out)
        self.add(elite, m.VGroup(buf, buf_lab), m.VGroup(out, out_lab))
        self.until(self.at(0, "concession"))
        conc = T("CONCESSION", 36, OK).move_to(m.RIGHT * 0.2 + m.UP * 1.75)
        fund = m.CurvedArrow(out.get_top() + m.LEFT * 0.5, conc.get_bottom() + m.DOWN * 0.05,
                             angle=m.PI / 3, color=HER, stroke_width=6)
        self.play(m.FadeIn(conc), m.Create(fund), run_time=0.9)
        self.until(self.at(0, "absolute"))
        ax = m.Axes(x_range=[0, 4, 1], y_range=[0, 4, 1], x_length=3.4, y_length=2.3,
                    axis_config={"color": DIM, "stroke_width": 2}).move_to(m.RIGHT * 4.35 + m.UP * 1.65)
        curve = ax.plot(lambda x: 0.35 * x ** 1.4 + 0.4, color=GOLD, stroke_width=6)
        ax_lab = T("Elite extraction", 34, GOLD, "NORMAL").next_to(ax, m.DOWN, buff=0.15)
        inv = T("INVARIANT: COST ALLOCATION", 34, DIM).to_edge(m.UP, buff=0.5)
        self.play(m.Create(ax), m.Create(curve), m.FadeIn(ax_lab, inv), run_time=1.0)
        self.until(self.beat_end(0) - 0.2)

        self.until(self.at(1, "concrete"))
        trace = m.Arrow(buf.get_bottom(), out.get_top() + m.LEFT * 0.35, buff=0.12, color=HER, stroke_width=6)
        quest = T("WHO FUNDS THE CONCESSION?", 36, GOLD).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(quest), m.Indicate(buf, color=GOLD), m.GrowArrow(trace), run_time=1.1)
        self.until(self.beat_end(1) - 0.3)
