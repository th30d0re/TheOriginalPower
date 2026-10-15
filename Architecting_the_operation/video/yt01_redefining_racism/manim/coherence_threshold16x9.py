"""S14-16 and S15-11 Figure 2.8 coherence vs suppression (illustrative)."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402


def fig28_axes():
    ax = m.Axes(
        x_range=[0, 10, 2], y_range=[0, 5, 1],
        x_length=10.8, y_length=5.0,
        axis_config={"color": DIM, "stroke_width": 2},
    ).shift(m.DOWN * 0.12)
    return ax


class CoherenceThreshold(YTScene):
    SHOT = "S14-16"

    def _build_fig28(self, badge_extra=False):
        ax = fig28_axes()
        tau = 3.0
        tau_line = m.DashedLine(ax.c2p(0, tau), ax.c2p(10, tau), color=GOLD, dash_length=0.08, stroke_width=5)
        tau_lab = M(r"\tau", 48, GOLD).next_to(ax.c2p(0, tau), m.LEFT, buff=0.18)
        m_line = ax.plot(
            lambda t: 1.2 + 0.22 * t + 0.15 * np.sin(0.9 * t), x_range=[0, 9.5, 0.05],
            color=OK, stroke_width=7,
        )
        s_line = ax.plot(
            lambda t: 1.8 + 0.12 * t + 0.35 * (t > 5) * (t - 5), x_range=[0, 9.5, 0.05],
            color=HER, stroke_width=6,
        )
        shock = m.Line(ax.c2p(5, 0), ax.c2p(5, 4.8), color=DIM, stroke_width=3)
        shock_lab = T("REFORM SHOCK", 34, DIM, "NORMAL").next_to(shock, m.UP, buff=0.08)
        ill = T("ILLUSTRATIVE CURVES", 34, GOLD)
        if badge_extra:
            badge = m.VGroup(
                T("POST-1965 COMPARISON", 34, OK),
                ill,
            ).arrange(m.DOWN, buff=0.1, aligned_edge=m.RIGHT)
        else:
            badge = ill
        badge.to_corner(m.DR, buff=0.35)
        head = T("FIGURE 2.8 · COHERENCE VS SUPPRESSION", 40, GOLD, width=11.5).to_edge(m.UP, buff=0.5)
        leg = m.VGroup(M(r"M(t)", 40, OK), M(r"\Sigma_{\mathrm{sup}}(t)", 40, HER)).arrange(m.RIGHT, buff=1.0)
        leg.to_edge(m.DOWN, buff=0.38)
        tlab = T("TIME", 34, DIM, "NORMAL").next_to(ax.x_axis, m.DOWN, buff=0.32)
        return head, ax, tau_line, tau_lab, m_line, s_line, shock, shock_lab, badge, leg, tlab

    def shot_S14_16(self):
        head, ax, tau_line, tau_lab, m_line, s_line, shock, shock_lab, badge, leg, tlab = self._build_fig28()
        self.add(head, ax, tau_line, tau_lab, tlab)
        self.until(self.at(0, "Figure"))
        self.play(m.Create(m_line), run_time=0.85)
        self.play(m.FadeIn(leg[0]), run_time=0.35)
        self.play(m.Create(s_line), run_time=0.75)
        self.play(m.FadeIn(leg[1]), run_time=0.35)
        self.until(self.at(0, "illustrative"))
        self.play(m.FadeIn(shock, shock_lab, badge), m.Indicate(tau_line, color=GOLD), run_time=0.7)
        self.until(self.beat_end(0) - 0.3)

    def shot_S15_11(self):
        head, ax, tau_line, tau_lab, m_line, s_line, shock, shock_lab, badge, leg, tlab = self._build_fig28(badge_extra=True)
        self.add(head, ax, tau_line, tau_lab, m_line, s_line, shock, shock_lab, leg, tlab)
        self.until(self.at(0, "Figure"))
        self.play(m.FadeIn(badge), run_time=0.45)
        self.until(self.at(0, "illustrative"))
        self.play(m.Indicate(s_line, color=HER), m.Indicate(m_line, color=OK), run_time=0.8)
        post = T("DIRECTIONAL POST-1965 RACE", 36, GOLD, width=11.0).to_edge(m.DOWN, buff=0.55)
        self.play(m.FadeIn(post), run_time=0.45)
        self.until(self.beat_end(0) - 0.3)
