"""S09-16 Nat Turner falsification · tau-management response."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, T, YTScene  # noqa: E402


class MinimumForcing(YTScene):
    SHOT = "S09-16"

    def shot_S09_16(self):
        title = T("NAT TURNER · AUGUST 1831", 44, GOLD).to_edge(m.UP, buff=0.42)
        axes = m.Axes(x_range=[1825, 1835, 2], y_range=[0, 1.2, 0.4], x_length=10.8, y_length=4.6,
                      axis_config={"color": DIM, "stroke_width": 2, "include_tip": False})
        axes.shift(m.DOWN * 0.1 + m.LEFT * 0.05)
        risk = axes.plot(lambda x: 0.25 + 0.08 * (x - 1825), x_range=[1825, 1831], color=DIM, stroke_width=4)
        spike = m.Line(axes.c2p(1831, 0.25), axes.c2p(1831, 1.15), color=HER, stroke_width=8)
        spike_top = m.Dot(axes.c2p(1831, 1.15), color=HER, radius=0.1)
        xlab = T("YEAR", 34, DIM, "NORMAL").next_to(axes.x_axis, m.DOWN, buff=0.18)
        ylab = T("CLASS-COHERENCE RISK", 34, DIM, "NORMAL").next_to(axes, m.UP, buff=0.22)
        tau = m.DashedLine(axes.c2p(1825, 1.0), axes.c2p(1835, 1.0), color=GOLD, stroke_width=4)
        tau_l = M(r"\tau_{\text{management}}", 40, GOLD).next_to(axes.c2p(1833, 1.0), m.UP, buff=0.14)
        chart = m.VGroup(axes, xlab, ylab, risk, spike, spike_top, tau, tau_l)
        self.add(title)
        self.play(m.FadeIn(chart), run_time=0.9)
        self.until(self.at(0, "Nat"))
        response = m.RoundedRectangle(width=4.2, height=2.6, corner_radius=0.1, stroke_color=HER, stroke_width=3,
                                      fill_color=NAVY2, fill_opacity=0.95)
        response.shift(m.RIGHT * 4.85 + m.DOWN * 0.35)
        codes = m.VGroup(
            T("SLAVE CODES", 34, HER),
            T("TIGHTENED", 34, HER),
            T("LEGISLATIVE RESPONSE", 34, HER, width=3.8),
        )
        codes.arrange(m.DOWN, buff=0.18, aligned_edge=m.LEFT).move_to(response)
        response_g = m.VGroup(response, codes)
        self.play(m.FadeIn(response_g, shift=m.LEFT * 0.15), spike.animate.set_stroke(width=10), run_time=0.8)
        self.until(self.at(0, "tightening"))
        foot = T("τ-MANAGEMENT RESPONSE", 36, GOLD).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeOut(response_g), m.FadeIn(foot), run_time=0.5)
        self.until(self.at(0, "slave"))
        self.until(self.beat_end(0) - 0.3)
