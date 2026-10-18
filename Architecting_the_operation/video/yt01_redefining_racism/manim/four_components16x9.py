"""S01-19: four structural components as a reinforcing loop."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, T, YTScene  # noqa: E402

COMPONENTS = [
    "AUTONOMY RESTRICTION",
    "SELECTIVE EMPATHY",
    "IDEOLOGICAL JUSTIFICATION",
    "RESISTANCE TO CRITIQUE",
]


def comp_node(label, color=INK):
    r = m.RoundedRectangle(width=2.55, height=0.85, corner_radius=0.1, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(label, 28, color, width=2.3).move_to(r)
    return m.VGroup(r, t)


class FourComponentLoop(YTScene):
    SHOT = "S01-19"
    SOURCE = "Source: The Original Power, Ch. 2 · architecture of control"

    def shot_S02_11(self):
        nodes = m.VGroup(*[comp_node(c, col) for c, col in zip(COMPONENTS, (HER, INK, GOLD, DIM))])
        nodes.arrange(m.RIGHT, buff=0.18).scale_to_fit_width(12.4).move_to([0, 0.55, 0])
        head = T("FOUR OPERATIONAL MODULES", 36, GOLD).to_edge(m.UP, buff=0.5)
        arrows = m.VGroup(*[
            m.Arrow(a.get_right(), b.get_left(), buff=0.06, color=GOLD, stroke_width=4)
            for a, b in zip(nodes, nodes[1:])
        ])
        loop = m.CurvedArrow(
            nodes[-1].get_bottom(), nodes[0].get_bottom(), angle=-m.PI / 2.5, color=GOLD, stroke_width=4
        ).shift(m.DOWN * 0.55)
        self.add(head)
        self.until(self.at(0, "four"))
        self.play(m.LaggedStart(*[m.FadeIn(n) for n in nodes], lag_ratio=0.12), run_time=0.8)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in arrows], lag_ratio=0.15), m.Create(loop), run_time=0.8)

        self.until(self.at(1, "movement"))
        pair = m.SurroundingRectangle(m.VGroup(nodes[0], nodes[1]), color=HER, buff=0.12, stroke_width=5)
        detail = T("MOVEMENT · PROPERTY · REPRODUCTION   /   SELECTIVE EMPATHY", 30, INK, width=12.0)
        detail.to_edge(m.DOWN, buff=0.45)
        self.play(m.Create(pair), m.FadeIn(detail), run_time=0.65)
        self.until(self.beat_end(1) - 0.2)

    def shot_S01_19(self):
        nodes = m.VGroup(*[comp_node(c, col) for c, col in zip(COMPONENTS, (HER, INK, GOLD, DIM))])
        nodes.arrange(m.RIGHT, buff=0.18).scale_to_fit_width(12.4).move_to([0, 0.55, 0])
        head = T("FOUR STRUCTURAL COMPONENTS", 32, GOLD).to_edge(m.UP, buff=0.55)
        self.add(head, nodes)
        self.until(self.at(0, "Together"))
        fwd = m.VGroup(*[m.Arrow(a.get_right(), b.get_left(), buff=0.06, color=GOLD, stroke_width=4, max_tip_length_to_length_ratio=0.15)
                         for a, b in zip(nodes, nodes[1:])])
        loop = m.CurvedArrow(nodes[-1].get_bottom() + m.DOWN * 0.05, nodes[0].get_bottom() + m.DOWN * 0.05,
                             angle=-m.PI / 2.5, color=GOLD, stroke_width=4)
        loop.shift(m.DOWN * 0.55)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in fwd], lag_ratio=0.2), m.Create(loop), run_time=1.0)
        verbs = T("RESTRICT · REGULATE · JUSTIFY · DEFLECT", 26, DIM, "NORMAL").to_edge(m.DOWN, buff=0.48)
        self.play(m.FadeIn(verbs), run_time=0.4)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "individual"))
        ind = comp_node("INDIVIDUAL BEHAVIOR", HER)
        ind[1].scale(1.08)
        ind.move_to([0, -2.05, 0])
        dart = m.Arrow(nodes[3].get_bottom(), ind.get_top(), buff=0.1, color=HER, stroke_width=5)
        maint = T("STRUCTURAL MAINTENANCE", 28, GOLD).next_to(ind, m.DOWN, buff=0.18)
        self.play(m.FadeIn(ind), m.GrowArrow(dart), run_time=0.7)
        self.until(self.at(1, "system"))
        self.play(m.FadeIn(maint), run_time=0.8)
        self.until(self.beat_end(1) - 0.3)
