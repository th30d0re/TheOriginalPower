"""S05-33: cultivated maintenance mechanisms."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, TEAL, YTScene  # noqa: E402


def module_box(title, color):
    r = m.RoundedRectangle(width=4.6, height=1.25, corner_radius=0.12, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(title, 34, color, width=4.2).move_to(r)
    return m.VGroup(r, t)


class MaintenanceMechanisms(YTScene):
    SHOT = "S05-33"

    def shot_S05_33(self):
        loop = m.Circle(radius=1.75, color=GOLD, stroke_width=5).shift(m.RIGHT * 3.2 + m.DOWN * 0.35)
        loop_lab = T("MAINTENANCE LOOP", 36, GOLD).next_to(loop, m.DOWN, buff=0.22)
        sys_node = m.RoundedRectangle(width=5.2, height=1.3, corner_radius=0.12, stroke_color=INK, stroke_width=3,
                                      fill_color=NAVY2, fill_opacity=1).shift(m.LEFT * 3.5 + m.UP * 2.15)
        sys_lab = T("SYSTEMIC RACIALIZATION", 34, INK, width=4.8).move_to(sys_node)
        head = T("CULTIVATED MAINTENANCE", 44, GOLD).to_edge(m.UP, buff=0.42)
        self.add(head, loop, loop_lab, sys_node, sys_lab)
        self.until(self.at(0, "Bayesian"))
        mods = m.VGroup(
            module_box("BAYESIAN DEFENSE", TEAL),
            module_box("CORRUPTED FIREWALL", HER),
            module_box("PHASE LOADING", OK),
        ).arrange(m.DOWN, buff=0.4).shift(m.LEFT * 4.2 + m.DOWN * 0.85)
        mod_colors = (TEAL, HER, OK)
        arrows = m.VGroup(*[
            m.Arrow(mods[i].get_right(), loop.get_left() + m.UP * (0.75 - i * 0.75), buff=0.14,
                    color=mod_colors[i], stroke_width=5)
            for i in range(3)
        ])
        self.play(m.LaggedStart(*[m.FadeIn(mob, shift=m.RIGHT * 0.2) for mob in mods], lag_ratio=0.25), run_time=1.0)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in arrows], lag_ratio=0.2), run_time=0.9)
        self.until(self.at(0, "amplify"))
        cult = T("CULTIVATED ATTITUDES", 34, GOLD, width=5.8).move_to(m.RIGHT * 2.2 + m.DOWN * 2.85)
        self.play(m.FadeIn(cult), loop.animate.set_stroke(width=7), run_time=0.6)
        self.until(self.beat_end(0) - 0.3)
