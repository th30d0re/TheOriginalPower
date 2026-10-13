"""UEF reel: Maxwell's equations for institutional power (UEF-6).

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/maxwell.py Maxwell \
        -r 1080x1920 --fps 30 -o outputs/UEF_maxwell/video/maxwell.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402

EQS = [
    (r"\nabla \cdot \vec E = \dfrac{\rho_q}{\varepsilon_0}", OK),
    (r"\nabla \times \vec E = -\dfrac{\partial \vec B}{\partial t}", STAT),
    (r"\nabla \cdot \vec B = 0", GOLD),
    (r"\nabla \times \vec B = \mu_0 \vec J + \mu_0\varepsilon_0 \dfrac{\partial \vec E}{\partial t}", HIM),
]


class Maxwell(UEFReel):
    EP = "UEF_maxwell"
    SOURCE = "Source: UEF draft §1.6, Eq. UEF-6"

    def construct(self):
        self.begin()
        B = self.BEATS
        title = m.VGroup(T("MAXWELL'S EQUATIONS", 54, GOLD), T("FOR INSTITUTIONAL POWER", 38, INK)).arrange(m.DOWN, buff=0.15)
        self.play(m.Write(title), run_time=0.8)
        self.until(B[1] - 0.3)
        self.play(m.FadeOut(title[1]), title[0].animate.to_edge(m.UP, buff=0.8), run_time=0.4)

        # mini equation stack along the top-right that fills in as we go
        stack = m.VGroup(*[M(tex, 40, col) for tex, col in EQS]).arrange(m.DOWN, buff=0.25, aligned_edge=m.LEFT)
        stack.scale(1.6).move_to([0, 0.6, 0])

        def show_big(k, cue_word, label_lines):
            self.until(self.cue(k + 1, cue_word))
            num = T(["ONE", "TWO", "THREE", "FOUR"][k], 34, DIM).move_to([0, 3.0, 0])
            big = M(EQS[k][0], 84, EQS[k][1]).move_to([0, 1.4, 0])
            if big.width > 7.4:
                big.scale_to_fit_width(7.4)
            self.play(m.FadeIn(num), m.Write(big), run_time=0.9)
            return num, big

        def caption(lines, y=-2.0):
            g = m.VGroup(*[T(s, 34, c) for s, c in lines]).arrange(m.DOWN, buff=0.15).move_to([0, y, 0])
            self.play(m.FadeIn(g, shift=m.UP * 0.2), run_time=0.4)
            return g

        # 1 ── Gauss: assigned charge sources the field
        num, big = show_big(0, "divergence", None)
        q = m.Dot([0, -3.4, 0], radius=0.25, color=GOLD)
        rays = m.VGroup(*[m.Arrow(q.get_center(), q.get_center() + 1.1 * np.array([np.cos(a), np.sin(a), 0]), buff=0.28,
                                  color=OK, stroke_width=4) for a in np.linspace(0, 2 * np.pi, 9)[:-1]])
        self.play(m.FadeIn(q), m.LaggedStart(*[m.GrowArrow(r) for r in rays], lag_ratio=0.1), run_time=0.8)
        self.until(self.cue(1, "Assigned"))
        cap = caption([("ASSIGNED DEMOGRAPHIC CHARGE", OK), ("SOURCES THE INSTITUTIONAL FIELD", INK)], y=-1.4)
        self.until(B[2] - 0.3)
        self.play(*[m.FadeOut(x) for x in (num, big, q, rays, cap)], run_time=0.3)

        # 2 ── Faraday: changing cultural field induces a real force
        num, big = show_big(1, "curl", None)
        coil = m.Circle(radius=0.9, color=STAT, stroke_width=5).move_to([0, -3.3, 0])
        circ = m.CurvedArrow(coil.point_at_angle(0.3), coil.point_at_angle(2.6), angle=1.6, color=STAT, stroke_width=6)
        bdot = m.VGroup(m.Circle(radius=0.2, color=GOLD), m.Dot(radius=0.07, color=GOLD)).move_to(coil)
        self.play(m.Create(coil), m.FadeIn(bdot), run_time=0.5)
        self.play(bdot.animate.scale(1.8), m.Create(circ), run_time=0.8)
        self.until(self.cue(2, "changing"))
        cap = caption([("A CHANGING CULTURAL FIELD", STAT), ("INDUCES A REAL FORCE", INK)], y=-1.4)
        self.until(B[3] - 0.3)
        self.play(*[m.FadeOut(x) for x in (num, big, coil, circ, bdot, cap)], run_time=0.3)

        # 3 ── no monopoles: status superiority comes as a dipole
        num, big = show_big(2, "divergence", None)
        plus = m.VGroup(m.Circle(radius=0.45, color=GOLD, fill_opacity=0.25), T("STATUS", 30, GOLD))
        minus = m.VGroup(m.Circle(radius=0.45, color=HER, fill_opacity=0.25), T("OUT-GROUP\nDEGRADED", 28, HER))
        for g, x, side in ((plus, -1.1, m.LEFT), (minus, 1.1, m.RIGHT)):
            g[0].move_to([x, -3.0, 0])
            g[1].next_to(g[0], side, buff=0.2)
        loops = m.VGroup(*[m.ArcBetweenPoints(plus.get_center() + m.UP * 0.5, minus.get_center() + m.UP * 0.5, angle=-a, color=DIM, stroke_width=3)
                           for a in (0.6, 1.0)],
                         *[m.ArcBetweenPoints(plus.get_center() + m.DOWN * 0.5, minus.get_center() + m.DOWN * 0.5, angle=a, color=DIM, stroke_width=3)
                           for a in (0.6, 1.0)])
        self.until(self.cue(3, "monopoles"))
        self.play(m.FadeIn(plus), run_time=0.4)
        self.until(self.cue(3, "dipole"))
        self.play(m.FadeIn(minus), m.Create(loops), run_time=0.7)
        cap = caption([("STATUS SUPERIORITY ALWAYS", GOLD), ("COMES PAIRED WITH DEGRADATION", INK)], y=-1.4)
        self.until(self.cue(3, "One", nth=0) if any(w["w"].lower().startswith("one") for w in self.WORDS[3]["words"]) else B[4] - 1.5)
        alone = T("ONE POLE NEVER SHOWS UP ALONE", 30, HER).move_to([0, -4.9, 0])
        self.play(m.FadeIn(alone), run_time=0.4)
        self.until(B[4] - 0.3)
        self.play(*[m.FadeOut(x) for x in (num, big, plus, minus, loops, cap, alone)], run_time=0.3)

        # 4 ── Ampère-Maxwell: flows and rule changes generate the cultural field
        num, big = show_big(3, "curl", None)
        self.until(self.cue(4, "Flows"))
        j_cap = caption([("μ₀J: FLOWS OF CAPITAL AND PEOPLE", HIM)], y=-1.2)
        flow = m.VGroup(*[m.Arrow([-3.0, y, 0], [3.0, y, 0], buff=0, color=HIM, stroke_width=4) for y in (-2.4, -2.9)])
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in flow], lag_ratio=0.3), run_time=0.6)
        self.until(self.cue(4, "change", nth=1))
        e_cap = m.VGroup(T("∂E/∂t: A CHANGE IN THE RULES", 34, GOLD), T("BEFORE ANY MATERIAL CURRENT MOVES", 30, INK)).arrange(m.DOWN, buff=0.12)
        e_cap.move_to([0, -3.9, 0])
        self.play(m.FadeIn(e_cap), run_time=0.5)
        self.until(B[5] - 0.3)
        self.play(*[m.FadeOut(x) for x in (num, big, j_cap, flow, e_cap)], run_time=0.3)

        # 5 ── reform triggers backlash before material change
        self.until(self.cue(5, "backlash"))
        a = m.VGroup(T("REFORM", 44, OK), M(r"\Longrightarrow", 72), T("BACKLASH", 44, HER)).arrange(m.RIGHT, buff=0.3).move_to([0, 0.4, 0])
        self.play(m.FadeIn(a), run_time=0.6)
        self.until(self.cue(5, "field"))
        b = T("THE FIELD ANSWERS\nTHE CHANGE IN THE RULES", 40, GOLD).move_to([0, -1.6, 0])
        self.play(m.FadeIn(b, shift=m.UP * 0.2), run_time=0.5)
        self.until(B[6] - 0.3)
        self.play(m.FadeOut(a), m.FadeOut(b), run_time=0.3)

        # 6 ── four equations, one machine
        self.play(m.LaggedStart(*[m.FadeIn(e, shift=m.UP * 0.2) for e in stack], lag_ratio=0.25), run_time=1.2)
        self.until(self.cue(6, "machine"))
        one = T("FOUR EQUATIONS, ONE MACHINE", 44, GOLD).move_to([0, -3.4, 0])
        self.play(m.Write(one), run_time=0.7)
        self.end_card()
