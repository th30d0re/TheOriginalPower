"""S13-14 circuit equilibrium and shocks; S13-22 Figure 2.6 damped wave."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402

Q0, ALPHA, WD = 1.6, 0.35, 110.0
T_SHOCK1, T_SHOCK2 = 0.8, 4.0


def q_curve(t):
    return Q0 * np.exp(-ALPHA * t) * np.sin(WD * t)


def backlash_axes():
    ax = m.Axes(
        x_range=[0, 10, 2], y_range=[-1.12, 1.78, 0.5],
        x_length=11.2, y_length=5.2,
        axis_config={"color": DIM, "stroke_width": 2, "include_tip": False},
    ).shift(m.DOWN * 0.15)
    base = m.DashedLine(ax.c2p(0, 0), ax.c2p(10, 0), color=INK, dash_length=0.1, stroke_width=4)
    eq_lab = T("q = 0", 34, DIM, "NORMAL").next_to(ax.c2p(0, 0), m.LEFT, buff=0.55)
    tlab = T("TIME", 34, DIM, "NORMAL").next_to(ax.c2p(10, 0), m.DOWN, buff=0.45)
    ylab = M(r"q(t)", 44, INK).next_to(ax.y_axis, m.LEFT, buff=0.25)
    eq_zone = T("q > 0", 34, OK).to_corner(m.UR, buff=0.45).shift(m.LEFT * 0.5)
    ex_zone = T("q < 0", 34, HER).to_corner(m.DR, buff=0.45).shift(m.LEFT * 0.5)
    return ax, base, eq_lab, tlab, ylab, eq_zone, ex_zone


def partial_curve(ax, t_max):
    t_max = max(0.05, min(t_max, 9.95))
    return ax.plot(lambda t: q_curve(t), x_range=[0, t_max, 0.015], color=HER, stroke_width=6)


def envelope(ax, scale=1.0):
    ep = ax.plot(lambda t: scale * Q0 * np.exp(-ALPHA * t), x_range=[0, 9.8, 0.04], color=GOLD, stroke_width=4)
    en = ax.plot(lambda t: -scale * Q0 * np.exp(-ALPHA * t), x_range=[0, 9.8, 0.04], color=GOLD, stroke_width=4)
    return ep, en


class BacklashOscillator(YTScene):
    SHOT = "S13-14"

    def shot_S13_14(self):
        head = T("CIRCUIT EQUILIBRIUM", 44, GOLD).to_edge(m.UP, buff=0.48)
        ax, base, eq_lab, tlab, ylab, eq_zone, ex_zone = backlash_axes()
        t_end = m.ValueTracker(0.05)
        curve = m.always_redraw(lambda: partial_curve(ax, t_end.get_value()))
        self.add(head, ax, base, eq_lab, tlab, ylab, curve)

        self.until(self.at(0, "equilibrium"))
        self.play(m.FadeIn(eq_zone, ex_zone), run_time=0.5)
        self.until(self.at(0, "displacement"))
        disp = m.Arrow(ax.c2p(0.4, 0), ax.c2p(0.4, 1.1), color=OK, stroke_width=7, buff=0)
        self.play(m.GrowArrow(disp), run_time=0.55)
        self.until(self.beat_end(0) - 0.3)

        shot_notes = []
        shock1 = m.Arrow(ax.c2p(T_SHOCK1, 0), ax.c2p(T_SHOCK1, 1.28), color=HER, stroke_width=7, buff=0)
        s1_lab = T("1865 IMPULSE", 36, HER).to_edge(m.UP, buff=1.05)
        self.until(self.at(1, "1865"))
        self.play(m.FadeOut(disp), m.GrowArrow(shock1), m.FadeIn(s1_lab), t_end.animate.set_value(1.35), run_time=1.0)
        shot_notes.extend([s1_lab, shock1])
        self.until(self.beat_end(1) - 0.25)

        kick = M(r"-L\,\frac{di}{dt}", 44, GOLD).to_edge(m.UP, buff=1.05)
        kick_arrow = m.CurvedArrow(ax.c2p(1.8, 0.95), ax.c2p(2.6, 0.15), angle=0.35, color=DIM, stroke_width=4)
        self.until(self.at(2, "back"))
        self.play(m.FadeOut(*shot_notes), m.FadeIn(kick), m.Create(kick_arrow), t_end.animate.set_value(2.0), run_time=0.9)
        shot_notes = [kick, kick_arrow]
        self.until(self.beat_end(2) - 0.25)

        discharge = T("LC DISCHARGE", 36, DIM, "NORMAL").to_edge(m.UP, buff=1.05)
        self.until(self.at(3, "discharge"))
        self.play(m.FadeOut(*shot_notes), m.FadeIn(discharge), t_end.animate.set_value(2.55), run_time=0.85)
        shot_notes = [discharge]
        self.until(self.beat_end(3) - 0.25)

        os1 = T("BLACK CODES · CONVICT LEASING", 36, HER, width=11.0).to_edge(m.DOWN, buff=0.42)
        os1_pin = m.Line(ax.c2p(2.4, -0.08), ax.c2p(2.4, -0.65), color=HER, stroke_width=3)
        self.until(self.at(4, "Reconstruction"))
        self.play(m.FadeOut(*shot_notes), m.FadeIn(os1, os1_pin), t_end.animate.set_value(3.2), run_time=1.0)
        shot_notes = [os1, os1_pin]
        self.until(self.beat_end(4) - 0.25)

        shock2 = m.Arrow(ax.c2p(T_SHOCK2, 0), ax.c2p(T_SHOCK2, 0.52), color=OK, stroke_width=6, buff=0)
        s2_lab = T("1964 IMPULSE (SMALLER)", 36, OK).to_edge(m.DOWN, buff=0.42)
        self.until(self.at(5, "1964"))
        self.play(m.FadeOut(*shot_notes), m.GrowArrow(shock2), m.FadeIn(s2_lab), t_end.animate.set_value(4.8), run_time=1.0)
        shot_notes = [shock2, s2_lab]
        self.until(self.beat_end(5) - 0.25)

        os2 = T("WAR ON DRUGS · MASS INCARCERATION", 36, HER, width=11.0).to_edge(m.DOWN, buff=0.42)
        os2_pin = m.Line(ax.c2p(5.6, -0.05), ax.c2p(5.6, -0.32), color=HER, stroke_width=3)
        self.until(self.at(6, "Drugs"))
        self.play(m.FadeOut(*shot_notes), m.FadeIn(os2, os2_pin), t_end.animate.set_value(6.2), run_time=1.0)
        shot_notes = [os2, os2_pin]
        self.until(self.beat_end(6) - 0.25)

        iface = T("INTERFACE SWAP · CARCERAL PROXY", 36, GOLD, width=11.0).to_edge(m.DOWN, buff=0.42)
        self.until(self.at(7, "interface"))
        self.play(m.FadeOut(*shot_notes, ex_zone), m.FadeIn(iface), t_end.animate.set_value(8.5), run_time=1.1)
        self.until(self.beat_end(7) - 0.3)

    def shot_S13_22(self):
        card = self.card()
        head = T(card["headline"].upper(), 44, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        ax, base, eq_lab, tlab, ylab, eq_zone, ex_zone = backlash_axes()
        elite = T("ELITE EXTRACTION INVARIANT · Δmax = 0", 34, GOLD).to_edge(m.UP, buff=1.05)
        t_end = m.ValueTracker(0.05)
        full = m.always_redraw(lambda: partial_curve(ax, t_end.get_value()))
        ep, en = envelope(ax, 1.0)
        shock1 = m.Arrow(ax.c2p(T_SHOCK1, 0), ax.c2p(T_SHOCK1, 1.28), color=HER, stroke_width=7, buff=0)
        s1 = T("SHOCK 1 (1865)", 34, HER).next_to(ax.c2p(T_SHOCK1, 1.28), m.RIGHT, buff=0.15)
        shock2 = m.Arrow(ax.c2p(T_SHOCK2, 0), ax.c2p(T_SHOCK2, 0.52), color=HER, stroke_width=6, buff=0)
        s2 = T("SHOCK 2 (1964)", 34, HER).next_to(ax.c2p(T_SHOCK2, 0.52), m.RIGHT, buff=0.15)
        os1 = T("OVERSHOOT 1", 34, HER).next_to(ax.c2p(2.4, -0.78), m.RIGHT, buff=0.35)
        os2 = T("OVERSHOOT 2", 34, HER).next_to(ax.c2p(5.6, -0.38), m.RIGHT, buff=0.35)
        plot_core = m.VGroup(ax, base, eq_lab, tlab, ylab, full).shift(m.DOWN * 0.15)
        ann = m.VGroup(shock1, s1, shock2, s2, os1, os2)
        for mob in ann:
            mob.shift(m.DOWN * 0.15)
        self.add(head, elite, plot_core)
        self.until(self.at(0, "Figure"))
        self.play(t_end.animate.set_value(9.8), m.FadeIn(ann), run_time=1.4)
        self.until(self.at(0, "displacement"))
        self.until(self.beat_end(0) - 0.25)

        badge = T("ILLUSTRATIVE PARAMETERS", 36, GOLD).to_edge(m.DOWN, buff=0.38)
        params = M(r"Q_0=1.6,\ \alpha=0.35,\ \omega_d \approx 110", 44, INK).next_to(badge, m.UP, buff=0.2)
        self.until(self.at(1, "illustrative"))
        self.play(m.FadeOut(ann), m.FadeIn(badge, params), run_time=0.55)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "sustained"))
        self.play(m.FadeIn(ep, en), m.FadeOut(badge, params), run_time=0.5)
        foot = T("q(t) → 0 WITHOUT SUSTAINED V(t)", 36, OK, width=11.0).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(foot), run_time=0.45)
        self.until(self.beat_end(2) - 0.25)

        ep2, en2 = envelope(ax, 0.55)
        self.until(self.at(3, "alpha"))
        self.play(m.FadeOut(foot), m.FadeIn(ep2, en2), m.FadeOut(ep, en), run_time=0.55)
        foot = T("α RISES AS CARCERAL R EXPANDS", 36, HER, width=11.0).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(foot), m.Indicate(ep2, color=HER), run_time=0.45)
        self.until(self.beat_end(3) - 0.25)

        self.until(self.at(4, "moral"))
        self.play(m.FadeOut(foot), run_time=0.2)
        foot = T("DAMPED TRANSIENT TOWARD BASELINE", 36, GOLD, width=11.0).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(foot), m.Indicate(base, color=GOLD), run_time=0.55)
        self.until(self.beat_end(4) - 0.25)

        self.until(self.at(5, "restorative"))
        self.play(m.FadeOut(foot, ep2, en2), run_time=0.25)
        foot = T("RESTORATIVE DAMPING · ELITE SHARE HOLDS", 36, DIM, width=11.0).next_to(elite, m.DOWN, buff=0.15)
        elite_box = m.SurroundingRectangle(elite, color=GOLD, buff=0.08, stroke_width=4)
        self.play(m.FadeIn(foot, elite_box), plot_core.animate.shift(m.UP * 0.25), run_time=0.5)
        self.until(self.beat_end(5) - 0.3)
