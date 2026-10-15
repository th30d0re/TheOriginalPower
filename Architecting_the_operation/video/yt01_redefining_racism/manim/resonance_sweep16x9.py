"""S13-27 resonance condition; S13-28 |q_res| and quality factor."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402

WR = 1.0


def amp(w, g=0.25):
    return 1.0 / np.sqrt((WR ** 2 - w ** 2) ** 2 + (g * w) ** 2)


class ResonanceSweep(YTScene):
    SHOT = "S13-27"

    def _res_axes(self):
        ax = m.Axes(
            x_range=[0, 2, 0.5], y_range=[0, 5.5, 1],
            x_length=10.5, y_length=5.0,
            axis_config={"color": DIM, "stroke_width": 2},
        ).shift(m.DOWN * 0.1)
        wr = m.DashedLine(ax.c2p(WR, 0), ax.c2p(WR, 5.5), color=GOLD, stroke_width=4)
        wlab = M(r"\omega_0 = 1/\sqrt{LC}", 44, GOLD).next_to(ax.c2p(WR, 0), m.DOWN, buff=0.3)
        xlab = M(r"\omega", 40, DIM).next_to(ax.x_axis, m.RIGHT, buff=0.2)
        ylab = M(r"|q_{\mathrm{res}}|", 40, INK).next_to(ax.y_axis, m.UP, buff=0.15)
        curve = ax.plot(lambda w: min(amp(w), 5.2), x_range=[0.05, 1.95, 0.008], color=HER, stroke_width=7)
        return ax, wr, wlab, xlab, ylab, curve

    def shot_S13_27(self):
        head = T("RESONANCE ESCAPE", 44, GOLD).to_edge(m.UP, buff=0.48)
        ax, wr, wlab, xlab, ylab, curve = self._res_axes()
        w = m.ValueTracker(0.25)
        probe = m.always_redraw(
            lambda: m.Dot(ax.c2p(w.get_value(), min(amp(w.get_value()), 5.2)), radius=0.14, color=GOLD)
        )
        self.add(head, ax, wr, wlab, xlab, ylab, curve, probe)
        self.until(self.at(0, "omega"))
        self.play(w.animate.set_value(0.98), run_time=1.2, rate_func=m.smooth)
        peak = M(r"|q_{\mathrm{res}}|", 48, GOLD).to_corner(m.UR, buff=0.5)
        self.play(m.FadeIn(peak), run_time=0.35)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "synchronized"))
        self.play(m.FadeOut(peak, wlab), run_time=0.25)
        coord = T("SYNCHRONIZED KINETIC COORDINATION", 36, OK, width=11.0).to_edge(m.DOWN, buff=0.42)
        imp = T("EFFECTIVE IMPEDANCE → R ALONE", 34, GOLD).next_to(coord, m.UP, buff=0.12)
        self.play(m.FadeIn(coord, imp), run_time=0.6)
        self.until(self.beat_end(1) - 0.3)

    def shot_S13_28(self):
        card = self.card()
        head = T(card["headline"].upper(), 44, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        ax, wr, wlab, xlab, ylab, curve = self._res_axes()
        ax.shift(m.LEFT * 3.2)
        wr.shift(m.LEFT * 3.2)
        wlab.shift(m.LEFT * 3.2)
        xlab.shift(m.LEFT * 3.2)
        ylab.shift(m.LEFT * 3.2)
        curve.shift(m.LEFT * 3.2)
        eq_panel = m.VGroup().shift(m.RIGHT * 3.0)
        eq = M(r"|q_{\mathrm{res}}| = \frac{V_0}{R\,\omega_0}", 56, INK)
        cancel = M(r"\omega L = 1/(\omega C)", 48, DIM)
        eq_panel.add(eq, cancel).arrange(m.DOWN, buff=0.45).shift(m.RIGHT * 3.0 + m.UP * 0.35)
        self.add(head, ax, wr, wlab, xlab, ylab, curve)
        self.until(self.at(0, "resonance"))
        self.play(m.Write(eq), run_time=1.0)
        self.until(self.at(0, "cancel"))
        self.play(m.FadeIn(cancel), run_time=0.5)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "Quality"))
        qf = M(r"Q_f = \frac{1}{R}\sqrt{\frac{L}{C}}", 56, GOLD).move_to(eq_panel)
        scale = T("RESONANT AMPLITUDE SCALES WITH Q_f", 36, OK, width=5.5).next_to(qf, m.DOWN, buff=0.35)
        self.play(m.FadeOut(eq, cancel), m.FadeIn(qf, scale), run_time=0.75)
        self.play(curve.animate.set_stroke(width=10), run_time=0.4)
        self.until(self.beat_end(1) - 0.3)
