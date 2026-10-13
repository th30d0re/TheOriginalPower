"""UEF reel: interference and the Interference Engine (UEF-20).

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/interference.py Interference \
        -r 1080x1920 --fps 30 -o outputs/UEF_interference/video/interference.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402

K = 2.4
A = 0.42


class Interference(UEFReel):
    EP = "UEF_interference"
    SOURCE = "Source: UEF draft §7.12, Eq. UEF-20"

    def construct(self):
        self.begin()
        B = self.BEATS
        ph = m.ValueTracker(0.0)      # travel
        dl = m.ValueTracker(0.0)      # phase difference delta
        Y1, Y2, YS = 1.8, 0.2, -2.0

        def wv(y, d, color, scale=1.0, width=5):
            return m.FunctionGraph(lambda x: y + scale * A * np.sin(K * x - ph.get_value() + d), x_range=[-3.4, 3.4], color=color,
                                   stroke_width=width)

        w1 = m.always_redraw(lambda: wv(Y1, 0.0, OK))
        w2 = m.always_redraw(lambda: wv(Y2, dl.get_value(), HIM))
        ws = m.always_redraw(lambda: m.FunctionGraph(
            lambda x: YS + A * (np.sin(K * x - ph.get_value()) + np.sin(K * x - ph.get_value() + dl.get_value())),
            x_range=[-3.4, 3.4], color=GOLD, stroke_width=7))
        plus = M("+", 90, DIM).move_to([-3.6, (Y1 + Y2) / 2, 0])
        eqs = M("=", 110, DIM).move_to([-3.6, (Y2 + YS) / 2, 0])
        sl = T("SUM", 28, GOLD).move_to([-2.9, YS - 1.2, 0])

        def run(tgt):
            dur = max(0.2, tgt - self.time)
            self.play(ph.animate.increment_value(3.0 * dur), run_time=dur, rate_func=m.linear)

        # 0 ── the intensity equation
        title = T("INTERFERENCE", 56, GOLD).to_edge(m.UP, buff=0.8)
        eq = M(r"I = I_1 + I_2 + 2\sqrt{I_1 I_2}\,\cos\delta", 64, INK).next_to(title, m.DOWN, buff=0.35)
        self.play(m.Write(title), run_time=0.6)
        self.add(w1, w2)
        self.play(m.FadeIn(plus), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        self.until(self.cue(0, "intensity"))
        self.play(m.Write(eq), ph.animate.increment_value(3), run_time=1.0, rate_func=m.linear)
        run(B[1])

        # 1 ── aligned: constructive
        self.until(self.cue(1, "Line"))
        self.add(ws)
        self.play(m.FadeIn(eqs), m.FadeIn(sl), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        self.until(self.cue(1, "Constructive"))
        con = m.VGroup(M(r"\delta = 0", 52, OK), T("CONSTRUCTIVE", 40, OK)).arrange(m.RIGHT, buff=0.4).move_to([0, -3.9, 0])
        self.play(m.FadeIn(con), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        run(B[2] - 0.3)
        self.play(m.FadeOut(con), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 2 ── half a cycle: destructive
        self.until(self.cue(2, "Offset"))
        self.play(dl.animate.set_value(np.pi), ph.animate.increment_value(4), run_time=1.4, rate_func=m.linear)
        self.until(self.cue(2, "Destructive"))
        des = m.VGroup(M(r"\delta = \pi", 52, HER), T("DESTRUCTIVE", 40, HER)).arrange(m.RIGHT, buff=0.4).move_to([0, -3.9, 0])
        self.play(m.FadeIn(des), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        run(B[3] - 0.3)
        self.play(m.FadeOut(des), dl.animate.set_value(0.0), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 3 ── solidarity is a wave; the Engine injects a counter-wave
        self.until(self.cue(3, "solidarity"))
        l1 = T("SOLIDARITY", 30, OK).move_to([2.8, Y1 + 0.75, 0])
        self.play(m.FadeIn(l1), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        self.until(self.cue(3, "injects"))
        l2 = T("COUNTER-WAVE\n(INTERFERENCE ENGINE)", 30, HER).move_to([1.6, Y2 - 0.95, 0])
        self.play(m.FadeIn(l2), dl.animate.set_value(np.pi), ph.animate.increment_value(4), run_time=1.4, rate_func=m.linear)
        self.until(self.cue(3, "zero"))
        zero = T("THE SUM GOES TO ZERO", 38, HER).move_to([0, -3.9, 0])
        self.play(m.FadeIn(zero), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        run(B[4] - 0.3)
        self.play(m.FadeOut(zero), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 4 ── loud and moving nothing
        self.until(self.cue(4, "loud"))
        loud = T("FEELS LOUD · MOVES NOTHING", 38, INK).move_to([0, -3.9, 0])
        self.play(m.FadeIn(loud), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        self.until(self.cue(4, "flat"))
        flat = T("THE ENERGY IS THERE.\nTHE SUM IS FLAT.", 36, GOLD).next_to(loud, m.DOWN, buff=0.25)
        self.play(m.FadeIn(flat), ph.animate.increment_value(1.5), run_time=0.5, rate_func=m.linear)
        run(B[5] - 0.3)
        self.play(m.FadeOut(loud), m.FadeOut(flat), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 5 ── the answer is phase: show up together
        self.until(self.cue(5, "phase"))
        l2b = T("SOLIDARITY, IN PHASE", 30, OK).move_to(l2)
        self.play(dl.animate.set_value(0.0), m.Transform(l2, l2b), ph.animate.increment_value(4), run_time=1.4, rate_func=m.linear)
        self.until(self.cue(5, "Show"))
        show = T("SHOW UP TOGETHER", 52, GOLD).move_to([0, -3.9, 0])
        self.play(m.Write(show), ph.animate.increment_value(2), run_time=0.7, rate_func=m.linear)
        run(self.END)
        self.end_card()
