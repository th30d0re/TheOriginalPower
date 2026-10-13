"""UEF reel: the driven harmonic oscillator and media resonance (UEF-14).

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/driven_oscillator.py DrivenOscillator \
        -r 1080x1920 --fps 30 -o outputs/UEF_driven_oscillator/video/driven_oscillator.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402

WR = 1.0  # resonant frequency (plot units)


def amp(w, g):
    return 1.0 / np.sqrt((WR ** 2 - w ** 2) ** 2 + (g * w) ** 2)


class DrivenOscillator(UEFReel):
    EP = "UEF_driven_oscillator"
    SOURCE = "Source: UEF draft §7.10, Eq. UEF-14"

    def construct(self):
        self.begin()
        B = self.BEATS
        title = T("THE DRIVEN OSCILLATOR", 54, GOLD).to_edge(m.UP, buff=1.0)
        q = T("WHY DOES PROPAGANDA HIT\nSOME PEOPLE SO HARD?", 40, INK).move_to([0, 1.0, 0])
        self.play(m.Write(title), m.FadeIn(q), run_time=0.8)
        self.until(B[1] - 0.3)
        self.play(m.FadeOut(q), run_time=0.3)

        # 1 ── the amplitude equation
        self.until(self.cue(1, "spring"))
        spring_y = m.ValueTracker(0.0)
        anchor = m.Line([-0.6, 3.0, 0], [0.6, 3.0, 0], color=DIM, stroke_width=6)
        spring = m.always_redraw(lambda: m.ParametricFunction(
            lambda t: np.array([0.25 * np.sin(14 * np.pi * t), 3.0 - t * (1.4 + spring_y.get_value()), 0]),
            t_range=[0, 1, 0.005], color=INK, stroke_width=3))
        mass = m.always_redraw(lambda: m.Dot([0, 3.0 - (1.4 + spring_y.get_value()) - 0.25, 0], radius=0.25, color=GOLD))
        self.play(m.FadeIn(anchor), m.FadeIn(spring), m.FadeIn(mass), run_time=0.5)
        self.play(spring_y.animate.set_value(0.3), run_time=0.3)
        self.play(spring_y.animate.set_value(-0.3), run_time=0.4)
        self.play(spring_y.animate.set_value(0.0), run_time=0.3)
        self.until(self.cue(1, "amplitude"))
        eq = M(r"A(\omega) = \frac{qE_0/m}{\omega_r^2 - \omega^2 + i\gamma\omega}", 64, GOLD).move_to([0, -0.4, 0])
        self.play(m.Write(eq), run_time=1.2)
        self.until(B[2] - 0.3)
        self.play(m.FadeOut(anchor), m.FadeOut(spring), m.FadeOut(mass), eq.animate.scale(0.75).next_to(title, m.DOWN, buff=0.35), run_time=0.4)

        # 2 ── resonance curve; drive frequency sweeps toward omega_r
        ax = m.Axes(x_range=[0, 2, 0.5], y_range=[0, 6, 2], x_length=6.4, y_length=4.4, tips=False,
                    axis_config={"color": DIM, "stroke_width": 3}).move_to([0, -0.4, 0])
        xl = M(r"\omega", 72).next_to(ax.x_axis, m.RIGHT, buff=0.15)
        yl = M(r"|A|", 44).next_to(ax.y_axis, m.UP, buff=0.1)
        wr_tick = m.DashedLine(ax.c2p(WR, 0), ax.c2p(WR, 6), color=DIM, stroke_width=3)
        wr_l = M(r"\omega_r", 44).next_to(ax.c2p(WR, 0), m.DOWN, buff=0.2)
        g = m.ValueTracker(0.2)
        curve = m.always_redraw(lambda: ax.plot(lambda w: min(amp(w, g.get_value()), 6.0), x_range=[0.05, 2.0, 0.005], color=HER, stroke_width=6))
        w = m.ValueTracker(0.3)
        probe = m.always_redraw(lambda: m.Dot(ax.c2p(w.get_value(), min(amp(w.get_value(), g.get_value()), 6.0)), radius=0.14, color=GOLD))
        self.until(B[2])
        self.play(m.Create(ax), m.FadeIn(xl, yl, wr_tick, wr_l), run_time=0.6)
        self.play(m.Create(curve), run_time=0.8)
        self.add(probe)
        self.until(self.cue(2, "approaches"))
        self.play(w.animate.set_value(0.97), run_time=max(0.5, self.cue(2, "spikes") - self.time), rate_func=m.smooth)
        spike = T("AMPLITUDE SPIKES", 36, HER).move_to([0, -3.5, 0])
        self.play(m.FadeIn(spike), run_time=0.3)
        self.until(self.cue(2, "Gamma"))
        gl = T("γ = DAMPING SETS THE PEAK", 32, INK).next_to(spike, m.DOWN, buff=0.2)
        self.play(m.FadeIn(gl), g.animate.set_value(0.6), run_time=1.0)
        self.play(g.animate.set_value(0.2), run_time=1.0)
        self.until(B[3] - 0.3)
        self.play(m.FadeOut(spike), m.FadeOut(gl), run_time=0.3)

        # 3 ── blue bends more than red: blue is nearer the glass's resonance
        self.until(self.cue(3, "blue"))
        red = m.VGroup(m.Dot(ax.c2p(0.3, 0), radius=0.14, color="#E4572E"), T("RED", 34, "#E4572E")).arrange(m.DOWN, buff=0.1)
        red.move_to(ax.c2p(0.3, 0) + m.DOWN * 0.55)
        blue = m.VGroup(m.Dot(ax.c2p(0.8, 0), radius=0.14, color="#4EA8DE"), T("BLUE", 34, "#4EA8DE")).arrange(m.DOWN, buff=0.1)
        blue.move_to(ax.c2p(0.8, 0) + m.DOWN * 0.55)
        self.play(m.FadeIn(red), m.FadeIn(blue), w.animate.set_value(0.8), run_time=0.8)
        note = T("BLUE SITS CLOSER TO\nTHE GLASS'S RESONANCE", 34, "#4EA8DE").move_to([0, -4.4, 0])
        self.play(m.FadeIn(note), run_time=0.4)
        self.until(B[4] - 0.3)
        self.play(m.FadeOut(red), m.FadeOut(blue), m.FadeOut(note), run_time=0.3)

        # 4 ── a population's resonance; propaganda tunes to it
        res = m.VGroup()
        for k, word in enumerate(["grievance", "identity", "anxiety"]):
            self.until(self.cue(4, word))
            t = T(word.upper(), 30, HER).move_to(ax.c2p(WR, 6) + m.UP * (0.4 + 0.42 * k))
            res.add(t)
            self.play(m.FadeIn(t), run_time=0.3)
        self.until(self.cue(4, "tunes"))
        tune = T("PROPAGANDA TUNES ω TO MATCH", 32, GOLD).move_to([0, -3.5, 0])
        self.play(m.FadeIn(tune), w.animate.set_value(1.0), run_time=1.2, rate_func=m.smooth)
        self.until(B[5] - 0.3)
        self.play(m.FadeOut(tune), run_time=0.3)

        # 5 ── small input, enormous response
        self.until(self.cue(5, "Small"))
        a = m.VGroup(T("SMALL INPUT →", 42, INK), T("ENORMOUS RESPONSE", 46, HER)).arrange(m.DOWN, buff=0.12)
        a.move_to([0, -3.6, 0])
        self.play(m.FadeIn(a), m.Indicate(probe, color=HER, scale_factor=2.0), run_time=0.8)
        self.until(self.cue(5, "radicalization"))
        rad = T("THE FRAMEWORK'S MODEL OF\nMEDIA RADICALIZATION", 34, GOLD).next_to(a, m.DOWN, buff=0.3)
        self.play(m.FadeIn(rad), run_time=0.5)
        self.end_card()
