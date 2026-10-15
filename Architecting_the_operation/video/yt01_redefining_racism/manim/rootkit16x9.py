"""S08-11: resource-mining rootkit beneath the political interface."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


class ResourceMiningRootkit(YTScene):
    SHOT = "S08-11"

    def shot_S08_11(self):
        ui = m.RoundedRectangle(width=10.8, height=2.0, corner_radius=0.12, stroke_color=INK, stroke_width=3,
                                  fill_color=NAVY2, fill_opacity=1)
        ui_l = T("USER INTERFACE · ORDINARY POLITICS", 34, INK, width=10.0).move_to(ui)
        ui_g = m.VGroup(ui, ui_l).shift(m.UP * 1.25)
        kernel = m.RoundedRectangle(width=10.8, height=2.4, corner_radius=0.12, stroke_color=HER, stroke_width=4,
                                    fill_color="#1a0f1a", fill_opacity=1)
        k_l = T("EXTRACTION KERNEL · ROOTKIT", 34, HER, width=10.0).move_to(kernel)
        kernel_g = m.VGroup(kernel, k_l).shift(m.DOWN * 0.35)
        harvest = T("SURPLUS", 26, GOLD, "NORMAL").next_to(kernel_g, m.UP, buff=0.42).shift(m.RIGHT * 1.8)
        elite = T("ELITE", 30, GOLD).next_to(harvest, m.UP, buff=0.16)
        title = T("RESOURCE-MINING ROOTKIT", 44, GOLD).to_edge(m.UP, buff=0.45)
        self.add(title, kernel_g)
        self.play(m.FadeIn(ui_g, shift=m.DOWN * 0.3), run_time=0.7)
        self.until(self.at(0, "beneath"))
        self.play(title.animate.scale(0.85).to_edge(m.UP, buff=0.35), ui_g.animate.shift(m.UP * 0.85).set_opacity(0.35),
                  run_time=1.0)
        self.until(self.at(0, "interface"))

        # 1 — labor in, surplus to administrators
        self.until(self.at(1, "deepest"))
        self.play(m.FadeOut(ui_g), run_time=0.35)
        human = T("HUMAN LABOR", 30, OK).shift(m.LEFT * 3.5 + m.DOWN * 2.15)
        flow = m.Arrow(human.get_top(), kernel.get_left() + m.DOWN * 0.2, buff=0.1, color=OK, stroke_width=5)
        up_end = kernel.get_top() + m.UP * 1.05
        up = m.Line(kernel.get_top(), up_end, color=GOLD, stroke_width=5)
        harvest.move_to(up_end + m.RIGHT * 0.95)
        elite.next_to(harvest, m.UP, buff=0.16)
        self.play(m.FadeIn(human), m.GrowArrow(flow), run_time=0.8)
        self.until(self.at(1, "administrators"))
        self.play(m.Create(up), m.FadeIn(harvest), m.FadeIn(elite), run_time=0.7)
        self.until(self.beat_end(1) - 0.3)
