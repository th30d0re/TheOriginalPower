"""S08-17: Equation 2.8 minimum forcing threshold with integral fill."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, T, YTScene  # noqa: E402

EQ_MAIN = (
    r"\mathcal{A}_{\text{abuse}}(t)"
    r"=\int_{0}^{t} \mathcal{E}_{\max}(s)\,ds"
    r"\quad \text{breach when} \quad"
    r"\mathcal{A}_{\text{abuse}}(t) \geq \tau_{\text{MFT}}"
)


class MinimumForcing(YTScene):
    SHOT = "S08-17"

    def _axes_fill(self):
        axes = m.Axes(x_range=[0, 10, 2], y_range=[0, 1.2, 0.4], x_length=9.2, y_length=3.6,
                      axis_config={"color": DIM, "stroke_width": 2, "include_tip": False})
        axes.shift(m.DOWN * 0.85 + m.LEFT * 0.2)
        curve = axes.plot(lambda x: 0.15 + 0.08 * x + 0.02 * x ** 1.3, x_range=[0, 10], color=HER)
        area = axes.get_area(curve, x_range=[0, 10], color=HER, opacity=0.35)
        tau = m.DashedLine(axes.c2p(0, 1.0), axes.c2p(10, 1.0), color=GOLD, stroke_width=3)
        tau_l = T("τ_MFT", 28, GOLD).next_to(tau, m.LEFT, buff=0.1)
        xlab = T("t", 28, DIM, "NORMAL").next_to(axes.x_axis, m.DOWN, buff=0.15)
        ylab = M(r"\mathcal{E}_{\max}", 36, DIM).next_to(axes.y_axis, m.LEFT, buff=0.15)
        return axes, curve, area, tau, tau_l, xlab, ylab

    def shot_S08_17(self):
        card = self.card()
        headline = T(card["headline"], 44, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        eq = M(EQ_MAIN, 48, INK).next_to(headline, m.DOWN, buff=0.35)
        if eq.width > 12.5:
            eq.scale_to_fit_width(12.5)
        self.add(headline)
        self.play(m.Write(eq), run_time=1.2)
        self.until(self.at(0, "threshold"))

        # 1 — highlight terms, area fills
        self.until(self.at(1, "integral"))
        axes, curve, area, tau, tau_l, xlab, ylab = self._axes_fill()
        chart = m.VGroup(axes, xlab, ylab, curve, tau, tau_l)
        chart.next_to(headline, m.DOWN, buff=0.45)
        tracker = m.ValueTracker(0.05)
        area = m.always_redraw(
            lambda: axes.get_area(curve, x_range=[0, tracker.get_value()], color=HER, opacity=0.4)
        )
        plot = m.VGroup(chart, area)
        self.play(m.FadeOut(eq), m.FadeOut(headline), m.FadeIn(plot), run_time=0.7)
        self.play(tracker.animate.set_value(10), run_time=2.0)
        self.until(self.at(1, "s"))

        # 2 — breach at tau_MFT
        self.until(self.at(2, "Breach"))
        breach = T("KINETIC BOUNDARY", 34, HER).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(breach, shift=m.UP * 0.15), tau.animate.set_stroke(HER, 5), run_time=0.7)
        self.until(self.at(2, "threshold"))

        # 3 — structural rupture (S08-21 hold; S08-20 card sits between in the edit)
        self.until(self.at(3, "rupture"))
        self.play(m.FadeOut(plot), m.FadeOut(breach), m.FadeOut(eq), m.FadeOut(headline), run_time=0.4)
        rupture = T("STRUCTURAL RUPTURE", 34, GOLD).shift(m.UP * 0.2)
        rational = T("COMPLIANCE VS RUPTURE", 28, DIM, "NORMAL").next_to(rupture, m.DOWN, buff=0.35)
        self.play(m.FadeIn(rupture), m.FadeIn(rational), run_time=0.6)
        self.until(self.beat_end(3) - 0.3)
