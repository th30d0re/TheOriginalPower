"""S14-07 critical threshold τ and preemptive material wage."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402


class SuppressionEnvelope(YTScene):
    SHOT = "S14-07"

    def shot_S14_07(self):
        ax = m.Axes(
            x_range=[0, 8, 2], y_range=[0, 5, 1],
            x_length=10.8, y_length=5.2,
            axis_config={"color": DIM, "stroke_width": 2},
        ).shift(m.DOWN * 0.1)
        tau = 3.2
        tau_line = m.DashedLine(ax.c2p(0, tau), ax.c2p(8, tau), color=GOLD, dash_length=0.12, stroke_width=5)
        tau_lab = M(r"\tau", 52, GOLD).next_to(ax.c2p(0, tau), m.LEFT, buff=0.2)
        m_curve = ax.plot(lambda t: 0.35 * t + 0.4 + 0.08 * np.sin(t), x_range=[0, 7.8, 0.05], color=OK, stroke_width=7)
        s_curve = ax.plot(lambda t: 0.25 * t + 0.9, x_range=[0, 7.8, 0.05], color=HER, stroke_width=6)
        head = T("CRITICAL THRESHOLD τ", 44, GOLD).to_edge(m.UP, buff=0.48)
        m_lab = M(r"M(t)", 40, OK).to_corner(m.UL, buff=0.5).shift(m.DOWN * 0.25)
        s_lab = M(r"\Sigma_{\mathrm{sup}}(t)", 40, HER).next_to(m_lab, m.DOWN, buff=0.12, aligned_edge=m.LEFT)
        tlab = T("TIME", 34, DIM, "NORMAL").next_to(ax.x_axis, m.DOWN, buff=0.35)
        self.add(head, ax, tau_line, tau_lab, m_lab, s_lab, tlab)
        self.until(self.at(0, "threshold"))
        self.play(m.Create(m_curve), run_time=0.9)
        self.play(m.Create(s_curve), run_time=0.7)
        race = T("SOLIDARITY GROWTH VS SUPPRESSION", 36, INK, width=11.0).to_edge(m.DOWN, buff=0.42)
        cross = m.Dot(ax.c2p(5.2, tau), radius=0.12, color=GOLD)
        self.play(m.FadeIn(race, cross), run_time=0.5)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "material"))
        psi = M(r"\psi_m", 56, GOLD).shift(m.LEFT * 2.8 + m.DOWN * 2.2)
        pre = T("PREEMPTIVE MATERIAL WAGE", 36, GOLD).next_to(psi, m.RIGHT, buff=0.35)
        deploy = m.Arrow(ax.c2p(2.5, 2.0), ax.c2p(4.5, tau + 0.15), color=GOLD, stroke_width=5)
        self.play(m.FadeIn(psi, pre, deploy), s_curve.animate.set_stroke(width=9), run_time=0.75)
        self.until(self.at(1, "tau"))
        self.until(self.beat_end(1) - 0.3)

        self.until(self.at(2, "Buffer"))
        self.play(m.FadeOut(race, deploy), run_time=0.25)
        buf = T("EXTRACTED WEALTH → BUFFER CLASS", 36, OK, width=11.0).to_edge(m.DOWN, buff=0.42)
        flow = m.CurvedArrow(ax.c2p(6.5, 4.2), ax.c2p(3.0, 1.8), angle=-0.5, color=OK, stroke_width=5)
        self.play(m.FadeIn(buf, flow), m_curve.animate.set_stroke(width=9), run_time=0.65)
        self.until(self.beat_end(2) - 0.3)
