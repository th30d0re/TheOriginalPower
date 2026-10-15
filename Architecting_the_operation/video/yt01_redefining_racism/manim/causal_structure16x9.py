"""S00-04 to S00-06: the dictionary hierarchy turns into the causal chain it hides.

    YT01_SHOT=S00-04 .venv-manimgx/bin/manimgx render <this file> CausalStructure -r 960x540 --fps 15
"""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, INK, NAVY2, T, YTScene  # noqa: E402


def node(label, width, color=INK, fill=NAVY2):
    box = m.RoundedRectangle(width=width, height=1.0, corner_radius=0.12, stroke_color=color, stroke_width=3,
                             fill_color=fill, fill_opacity=1)
    text = T(label, 34, color, width=width - 0.4).move_to(box)
    return m.VGroup(box, text)


class CausalStructure(YTScene):
    SHOT = "S00-04"

    def shot_S00_04(self):
        # 0 ── the dictionary's ranking, as the cold-open card left it
        rows = m.VGroup(node("INDIVIDUAL PREJUDICE", 7.6), node("BELIEF IN SUPERIORITY", 5.8),
                        node("SYSTEMIC DISCRIMINATION", 4.4, DIM)).arrange(m.DOWN, buff=0.35).shift(m.DOWN * 0.2)
        head = T("THE DICTIONARY ORDER", 36, DIM).to_edge(m.UP, buff=0.7)
        self.add(head, rows)
        self.until(self.at(0, "reverses"))
        system, ideology, prejudice = (node("SYSTEM", 3.0), node("IDEOLOGY", 3.0), node("PREJUDICE", 3.0))
        chain = m.VGroup(system, ideology, prejudice).arrange(m.RIGHT, buff=1.1).shift(m.UP * 0.3)
        arrows = m.VGroup(*[m.Arrow(a.get_right(), b.get_left(), buff=0.12, color=GOLD, stroke_width=6)
                            for a, b in ((system, ideology), (ideology, prejudice))])
        head2 = T("THE CAUSAL ORDER", 36, GOLD).move_to(head)
        self.play(m.ReplacementTransform(rows[2], system), m.ReplacementTransform(rows[1], ideology),
                  m.ReplacementTransform(rows[0], prejudice), m.Transform(head, head2), run_time=1.6)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in arrows], lag_ratio=0.5), run_time=0.9)
        self.until(self.at(0, "architecture"))
        arch = T("ARCHITECTURE OF CONTROL", 32, DIM, "NORMAL").next_to(chain, m.DOWN, buff=0.7)
        self.play(m.FadeIn(arch, shift=m.UP * 0.2), run_time=0.6)

        # 1 ── the systemic element is the primary operation
        self.until(self.at(1, "systemic"))
        self.play(m.FadeOut(arch), system[0].animate.set_stroke(GOLD, 6),
                  system[1].animate.set_color(GOLD), run_time=0.8)
        self.until(self.at(1, "primary"))
        primary = T("PRIMARY OPERATION", 34, GOLD).next_to(system, m.UP, buff=0.45)
        self.play(m.FadeIn(primary, shift=m.DOWN * 0.2), run_time=0.6)

        # 2 ── downstream products; pre-existing bias enters, attitudes loop back as maintenance
        self.until(self.at(2, "downstream"))
        down = T("DOWNSTREAM PRODUCTS", 30, DIM).next_to(m.VGroup(ideology, prejudice), m.UP, buff=0.5)
        self.play(m.FadeIn(down), ideology[0].animate.set_stroke(DIM), prejudice[0].animate.set_stroke(DIM), run_time=0.6)
        self.until(self.at(2, "pre"))
        bias = T("PRE-EXISTING BIAS", 30, INK, "NORMAL").move_to(system.get_bottom() + m.DOWN * 2.2)
        feed = m.Arrow(bias.get_top(), system.get_bottom(), buff=0.12, color=INK, stroke_width=5)
        self.play(m.FadeIn(bias, shift=m.UP * 0.2), m.GrowArrow(feed), run_time=0.8)
        self.until(self.at(2, "cultivates"))
        loop = m.CurvedArrow(prejudice.get_bottom() + m.DOWN * 0.1, system.get_bottom() + m.DOWN * 0.1 + m.RIGHT * 1.0,
                             angle=-m.PI * 0.45, color=GOLD, stroke_width=5)
        loop_label = T("MAINTENANCE", 30, GOLD).next_to(loop, m.DOWN, buff=0.15)
        self.play(m.Create(loop), run_time=1.2)
        self.play(m.FadeIn(loop_label), run_time=0.4)
        self.until(self.beat_end(2) - 0.4)
        self.play(*[mob.animate.set_opacity(0) for mob in self.mobjects], run_time=0.4)
