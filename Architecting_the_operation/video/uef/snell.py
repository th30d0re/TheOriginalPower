"""UEF reel: Snell's law at an institutional boundary (UEF-21).

Physics note: entering a denser medium (n1 < n2) never totally internally reflects;
the draft's TIR clause is logged in Paper/ERRATA.md #1. This reel shows normal
incidence passing straight through instead.

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/snell.py Snell \
        -r 1080x1920 --fps 30 -o outputs/UEF_snell/video/snell.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402

N1, N2 = 1.0, 1.6
P = np.array([0.0, -0.2, 0])   # point of incidence on the boundary
LEN = 3.2


class Snell(UEFReel):
    EP = "UEF_snell"
    SOURCE = "Source: UEF draft §7.13, Eq. UEF-21 (TIR clause corrected)"

    def construct(self):
        self.begin()
        B = self.BEATS
        th = m.ValueTracker(50.0)  # incidence angle from the normal, degrees

        def refr(t):
            return np.degrees(np.arcsin(N1 / N2 * np.sin(np.radians(t))))

        top = m.Rectangle(width=7.9, height=4.2, fill_color=OK, fill_opacity=0.06, stroke_width=0).move_to(P + m.UP * 2.1)
        bot = m.Rectangle(width=7.9, height=5.0, fill_color=HIM, fill_opacity=0.22, stroke_width=0).move_to(P + m.DOWN * 2.5)
        boundary = m.Line(P + m.LEFT * 3.95, P + m.RIGHT * 3.95, color=INK, stroke_width=4)
        normal = m.DashedLine(P + m.UP * 3.6, P + m.DOWN * 3.6, color=DIM, stroke_width=3)
        inc = m.always_redraw(lambda: m.Arrow(P + LEN * np.array([-np.sin(np.radians(th.get_value())), np.cos(np.radians(th.get_value())), 0]),
                                              P, buff=0, color=GOLD, stroke_width=8))
        out = m.always_redraw(lambda: m.Arrow(P, P + LEN * np.array([np.sin(np.radians(refr(th.get_value()))), -np.cos(np.radians(refr(th.get_value()))), 0]),
                                              buff=0, color=GOLD, stroke_width=8))
        straight = m.always_redraw(lambda: m.DashedLine(P, P + LEN * np.array([np.sin(np.radians(th.get_value())), -np.cos(np.radians(th.get_value())), 0]),
                                                        color=GOLD, stroke_width=3).set_stroke(opacity=0.45))

        # 0 ── Snell's law
        title = T("SNELL'S LAW", 56, GOLD).to_edge(m.UP, buff=0.7)
        self.play(m.Write(title), m.FadeIn(top), m.FadeIn(bot), m.Create(boundary), run_time=0.8)
        self.play(m.FadeIn(inc), run_time=0.4)
        self.play(m.FadeIn(out), run_time=0.4)
        self.until(self.cue(0, "Snell"))
        eq = M(r"n_1 \sin\theta_1 = n_2 \sin\theta_2", 66, INK).next_to(title, m.DOWN, buff=0.3)
        self.play(m.Write(eq), run_time=0.9)
        n1 = M(r"n_1", 48, OK).move_to(P + m.UP * 0.6 + m.RIGHT * 3.4)
        n2 = M(r"n_2 > n_1", 48, HIM).move_to(P + m.DOWN * 0.6 + m.RIGHT * 3.0)
        self.play(m.FadeIn(n1), m.FadeIn(n2), run_time=0.4)

        # 1 ── bends toward the normal
        self.until(self.cue(1, "normal"))
        self.play(m.Create(normal), m.FadeIn(straight), run_time=0.6)
        tn = T("BENDS TOWARD THE NORMAL", 34, GOLD).move_to([0, -4.6, 0])
        self.play(m.FadeIn(tn), run_time=0.4)
        self.until(B[2] - 0.3)
        self.play(m.FadeOut(tn), run_time=0.3)

        # 2 ── movement above, institution below
        self.until(self.cue(2, "movement"))
        mv = T("MOVEMENT · LOW n\nFAST AND LOOSE", 30, OK).move_to(P + m.UP * 2.6 + m.RIGHT * 2.0)
        self.play(m.FadeIn(mv), run_time=0.4)
        self.until(self.cue(2, "institution"))
        ins = T("INSTITUTION · HIGH n\nDENSE AND SLOW", 30, HIM).move_to(P + m.DOWN * 4.05)
        self.play(m.FadeIn(ins), run_time=0.4)

        # 3 ── energy steered away from its target
        self.until(self.cue(3, "steered"))
        tgt_pt = P + LEN * np.array([np.sin(np.radians(50)), -np.cos(np.radians(50)), 0])
        target = m.VGroup(m.Circle(radius=0.28, color=HER, stroke_width=5), m.Dot(radius=0.07, color=HER)).move_to(tgt_pt)
        tl = T("TARGET", 30, HER).next_to(target, m.DOWN, buff=0.15)
        self.play(m.FadeIn(target), m.FadeIn(tl), run_time=0.4)
        miss = T("STEERED AWAY FROM ITS TARGET", 34, HER).move_to([0, -5.6, 0])
        self.play(m.FadeIn(miss), m.Indicate(out, color=HER), run_time=0.7)
        self.until(B[4] - 0.3)
        self.play(m.FadeOut(miss), m.FadeOut(target), m.FadeOut(tl), run_time=0.3)

        # 4 ── head-on: no bending
        self.until(self.cue(4, "head"))
        self.play(th.animate.set_value(0.0), run_time=1.4, rate_func=m.smooth)
        ho = T("HEAD-ON, θ = 0°: NO BENDING", 38, GOLD).move_to([0, -5.6, 0])
        self.play(m.FadeIn(ho), run_time=0.4)
        self.until(B[5] - 0.3)
        self.play(m.FadeOut(ho), run_time=0.3)

        # 5 ── meet it directly
        self.until(self.cue(5, "directly"))
        self.play(th.animate.set_value(35.0), run_time=0.8)
        self.play(th.animate.set_value(0.0), run_time=0.8)
        dr = T("MEET THE INSTITUTION DIRECTLY,\nGET REDIRECTED LESS", 34, GOLD).move_to([0, -5.95, 0])
        self.play(m.FadeIn(dr), run_time=0.5)
        self.end_card()
