"""S16-01/08/15 complex wage plane; S19-14 StatusWage dielectric model."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

STAT = "#B28DFF"
MAT = OK


def phasor_plane(origin=np.array([-2.0, -0.8, 0]), length=3.2):
    y_ax = m.Arrow(origin + m.DOWN * 2.2, origin + m.UP * (length + 0.4), buff=0, color=MAT, stroke_width=6)
    x_ax = m.Arrow(origin + m.LEFT * 0.3, origin + m.RIGHT * (length + 0.5), buff=0, color=STAT, stroke_width=6)
    y_lab = M(r"\psi_m", 48, MAT).next_to(y_ax.get_end(), m.LEFT, buff=0.25)
    x_lab = M(r"j\psi_s", 40, STAT).move_to(origin + m.RIGHT * (length + 0.9) + m.UP * 0.5)
    return origin, length, m.VGroup(y_ax, x_ax, y_lab, x_lab)


def at_ph(origin, length, theta_deg):
    th = np.radians(theta_deg)
    return origin + length * np.array([np.sin(th), np.cos(th), 0])


class ComplexWage(YTScene):
    SHOT = "S16-01"

    def shot_S16_01(self):
        head = T("KERNEL OBJECTIVE", 34, GOLD).to_edge(m.UP, buff=0.55)
        tau = m.DashedLine([-5.5, 2.0, 0], [5.5, 2.0, 0], color=GOLD, dash_length=0.12, stroke_width=4)
        tau_l = M(r"\tau", 48, GOLD).next_to(tau, m.LEFT, buff=0.15)
        ceiling = T("COHERENCE CEILING", 26, DIM, "NORMAL").next_to(tau, m.UP, buff=0.12)
        self.add(head, tau, tau_l, ceiling)
        self.until(self.at(0, "kernel"))
        threat = T("THREAT LEVEL BELOW τ", 30, OK).shift(m.DOWN * 1.5)
        self.play(m.FadeIn(threat), run_time=0.5)
        self.until(self.beat_end(0) - 0.3)

    def shot_S16_08(self):
        origin, L, axes = phasor_plane()
        head = T("COMPLEX WAGE · REACTIVE POWER", 32, GOLD, width=12.0).to_edge(m.UP, buff=0.5)
        theta = m.ValueTracker(38.0)
        w_arrow = m.always_redraw(lambda: m.Arrow(origin, at_ph(origin, L, theta.get_value()), buff=0, color=GOLD, stroke_width=8))
        self.add(head, axes, w_arrow)
        self.until(self.at(0, "reactive"))
        side = T("DEFLECTS CLASS MOMENTUM", 28, STAT).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(side), run_time=0.5)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "steady"))
        self.play(m.FadeOut(side), run_time=0.25)
        zero = T("ZERO MATERIAL WORK ALONG EXTRACTION CURRENT", 26, DIM, width=11.5).to_edge(m.DOWN, buff=0.4)
        self.play(m.FadeIn(zero), run_time=0.5)
        self.until(self.beat_end(1) - 0.3)

    def shot_S16_15(self):
        """S16-15 primary: microaggression trickle-charge through field collapse (S16-16–18 holds)."""
        head = T("SYSTEMIC INDUCTOR", 34, GOLD).to_edge(m.UP, buff=0.55)
        field = m.Rectangle(width=4.5, height=2.2, stroke_color=STAT, stroke_width=4, fill_color=NAVY2, fill_opacity=0.6)
        field.shift(m.DOWN * 0.3)
        flab = T("IDEOLOGICAL FIELD", 26, STAT).next_to(field, m.UP, buff=0.15)
        self.add(head, field, flab)
        self.until(self.at(0, "Microaggressions"))
        drops = m.VGroup(*[m.Dot(field.get_top() + m.DOWN * (0.3 + i * 0.35) + m.RIGHT * (i - 2) * 0.4,
                               radius=0.06, color=HER) for i in range(5)])
        self.play(m.LaggedStart(*[m.FadeIn(d) for d in drops], lag_ratio=0.15), run_time=0.8)
        self.until(self.at(1, "negligible"))
        big = T("ACCUMULATED FIELD MASSIVE", 28, GOLD).next_to(field, m.DOWN, buff=0.35)
        self.play(m.FadeIn(big), run_time=0.4)
        self.until(self.at(2, "mobilization"))
        spike = m.Arrow(field.get_bottom() + m.LEFT * 2.2, field.get_top() + m.LEFT * 2.2, color=HER, stroke_width=6)
        di = T("RAPID di/dt", 30, HER).next_to(spike, m.LEFT, buff=0.15)
        self.play(m.GrowArrow(spike), m.FadeIn(di), run_time=0.6)
        self.until(self.at(3, "collapse"))
        collapse = T("FIELD COMPELLED TO COLLAPSE", 28, HER).to_edge(m.DOWN, buff=0.4)
        self.play(m.FadeIn(collapse), field.animate.set_fill(HER, 0.35), run_time=0.7)
        self.until(self.beat_end(3) - 0.3)


class StatusWage(YTScene):
    SHOT = "S19-14"

    def shot_S19_14(self):
        eq = m.VGroup(M("W =", 72), M(r"\psi_m", 72, MAT), M("+", 72), M(r"j\psi_s", 72, STAT)).arrange(m.RIGHT, buff=0.2)
        eq.to_edge(m.UP, buff=0.75)
        head = T("COMPLEX WAGE", 34, GOLD).next_to(eq, m.UP, buff=0.2)
        self.add(head, eq)
        self.until(self.at(0, "complex"))
        real = T("REAL-POWER CHANNEL", 28, MAT).shift(m.LEFT * 3.0 + m.DOWN * 0.5)
        goods = m.VGroup(*[T(s, 24, MAT, "NORMAL") for s in ("SCHOOLS", "ROADS", "IMMUNITY")]).arrange(m.DOWN, buff=0.1)
        goods.next_to(real, m.DOWN, buff=0.2)
        self.play(m.FadeIn(real), m.LaggedStart(*[m.FadeIn(g) for g in goods], lag_ratio=0.2), run_time=0.9)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "status"))
        self.play(m.FadeOut(goods, real), run_time=0.3)
        react = T("REACTIVE jψ_s STORES FIELD ENERGY", 28, STAT, width=11.0).shift(m.UP * 0.8)
        deflect = m.Arrow([0, -1.0, 0], [2.2, -1.0, 0], color=STAT, stroke_width=6)
        self.play(m.FadeIn(react), m.GrowArrow(deflect), run_time=0.6)
        self.until(self.beat_end(1) - 0.3)

        self.until(self.at(2, "dielectric"))
        self.play(m.FadeOut(react, deflect), run_time=0.3)
        layer = m.RoundedRectangle(width=5.5, height=1.0, corner_radius=0.12, stroke_color=INK, stroke_width=4,
                                   fill_color=NAVY2, fill_opacity=1).shift(m.DOWN * 2.0)
        blab = T("BUFFER CLASS · DIELECTRIC", 28, INK).move_to(layer)
        self.play(m.FadeIn(layer, blab), run_time=0.6)
        self.until(self.beat_end(2) - 0.3)

        self.until(self.at(3, "blocks"))
        elite = T("E", 40, GOLD).shift(m.UP * 2.2)
        block = T("BLOCKS ARC TOWARD E", 26, GOLD).next_to(elite, m.DOWN, buff=0.2)
        lat = T("REDIRECTS CONFLICT LATERALLY", 26, HER).next_to(layer, m.DOWN, buff=0.25)
        self.play(m.FadeIn(elite, block, lat), run_time=0.6)
        self.until(self.beat_end(3) - 0.3)
