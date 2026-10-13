"""UEF reel: the Complex Wage, W = psi_m + j psi_s (vertical, voiced).

Source: The_Original_Power.tex, eq. 2.2a-d and the phasor figure (lines ~2850-2925).
Axis convention follows the book: material wage psi_m on the VERTICAL axis,
status wage j psi_s on the HORIZONTAL axis, theta opening from the material axis.

Render:
    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/complex_wage.py \
        ComplexWage -r 1080x1920 --fps 30 -o outputs/UEF_complex_wage/video/complex_wage.mp4
"""

import json
import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "reel_reciprocity"))
from scene import BG, DIM, GOLD, HER, HIM, INK, OK, ROOT, T, qr  # noqa: E402

EP = ROOT / "outputs/UEF_complex_wage"
AUDIO = EP / "UEF_complex_wage.mp3"
_turns = json.loads((EP / "episode_manifest.json").read_text())["turns"]
BEATS = [t["start_ms"] / 1000 for t in _turns]
END = _turns[-1]["end_ms"] / 1000
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"

MAT = OK      # material wage (real)
STAT = "#B28DFF"  # status wage (imaginary)


def M(tex, size=72, color=INK):
    return m.MathTex(tex, font_size=size, color=color)


class ComplexWage(m.Scene):
    def until(self, t):
        if t > self.time:
            self.wait(t - self.time)

    def construct(self):
        self.camera.background_color = BG
        if AUDIO.exists():
            self.add_sound(str(AUDIO))

        # Phasor plane, shared by most beats. Origin low-left so Quadrant II (material < 0) fits below.
        O = np.array([-2.2, -0.2, 0])
        L = 3.6

        def at(theta_deg, r=L):
            th = np.radians(theta_deg)
            return O + r * np.array([np.sin(th), np.cos(th), 0])  # theta measured from the vertical (material) axis

        # 0 ── hook
        t0 = BEATS[0]
        hook = m.VGroup(T("EVERY SYSTEM OF EXTRACTION", 44), T("PAYS THE PEOPLE", 44), T("WHO GUARD IT", 44, GOLD)).arrange(m.DOWN, buff=0.15)
        self.play(m.FadeIn(hook, shift=m.UP * 0.2), run_time=0.8)
        self.until(t0 + 5.7)
        title = T("THE COMPLEX WAGE", 64, GOLD).to_edge(m.UP, buff=1.0)
        self.play(m.FadeOut(hook), m.Write(title), run_time=0.7)

        # 1 ── the equation, colored by part
        t0 = BEATS[1]
        eq = m.VGroup(M("W =", 96), M(r"\psi_m", 96, MAT), M("+", 96), M(r"j\,\psi_s", 96, STAT)).arrange(m.RIGHT, buff=0.25)
        eq.next_to(title, m.DOWN, buff=0.5)
        self.play(m.FadeIn(eq[0]), run_time=0.4)
        self.until(t0 + 0.7)
        mat_l = T("MATERIAL", 30, MAT).next_to(eq[1], m.DOWN, buff=0.15)
        self.play(m.FadeIn(eq[1]), m.FadeIn(mat_l), run_time=0.4)
        self.until(t0 + 1.3)
        self.play(m.FadeIn(eq[2]), run_time=0.2)
        self.until(t0 + 2.1)
        st_l = T("STATUS", 30, STAT).next_to(eq[3], m.DOWN, buff=0.15)
        self.play(m.FadeIn(eq[3]), m.FadeIn(st_l), run_time=0.4)
        self.until(BEATS[2] - 0.2)
        head = m.VGroup(title, eq)
        self.play(head.animate.scale(0.7).to_edge(m.UP, buff=0.5), m.FadeOut(mat_l), m.FadeOut(st_l), run_time=0.5)

        # 2 ── material axis (vertical)
        t0 = BEATS[2]
        y_axis = m.Arrow(O + m.DOWN * 2.6, O + m.UP * (L + 0.5), buff=0, color=MAT, stroke_width=6)
        y_lab = M(r"\psi_m", 64, MAT).next_to(y_axis.get_end(), m.LEFT, buff=0.4).shift(m.DOWN * 0.35)
        self.play(m.GrowArrow(y_axis), m.FadeIn(y_lab), run_time=0.8)
        self.until(t0 + 2.2)
        items = m.VGroup(*[T(s, 32, MAT) for s in ["LAND", "CREDIT", "WAGES", "LEGAL IMMUNITY"]]).arrange(m.DOWN, buff=0.2, aligned_edge=m.LEFT)
        items.move_to([1.6, 1.8, 0])
        for k, cue in enumerate([2.2, 2.9, 3.5, 4.0]):
            self.until(t0 + cue)
            self.play(m.FadeIn(items[k], shift=m.LEFT * 0.2), run_time=0.3)
        self.until(t0 + 7.4)
        paid = m.VGroup(T("PAID FOR WITH WEALTH", 28, DIM), T("EXTRACTED FROM THE OUT-GROUP", 28, HER)).arrange(m.DOWN, buff=0.08)
        paid.move_to([0, -4.0, 0])
        self.play(m.FadeIn(paid), run_time=0.5)
        self.until(BEATS[3] - 0.3)
        self.play(m.FadeOut(items), m.FadeOut(paid), run_time=0.3)

        # 3 ── status axis (horizontal), reactive power
        t0 = BEATS[3]
        x_axis = m.Arrow(O + m.LEFT * 0.4, O + m.RIGHT * (L + 0.8), buff=0, color=STAT, stroke_width=6)
        x_lab = M(r"j\psi_s", 64, STAT).next_to(x_axis.get_end(), m.DOWN, buff=0.4).shift(m.LEFT * 0.35)
        self.play(m.GrowArrow(x_axis), m.FadeIn(x_lab), run_time=0.8)
        self.until(t0 + 2.5)
        self.play(m.Indicate(head[1][3], color=STAT), m.Indicate(x_lab, color=STAT), run_time=0.6)
        self.until(t0 + 5.1)
        react = m.VGroup(T("j = REACTIVE POWER", 34, STAT), T("SUSTAINS THE FIELD, ZERO WORK", 30, INK)).arrange(m.DOWN, buff=0.1)
        react.move_to([0, -4.2, 0])
        self.play(m.FadeIn(react), run_time=0.5)
        self.until(t0 + 12.6)
        cost = T("COSTS THE ELITE NOTHING,\nPAYS NOTHING", 36, GOLD).next_to(react, m.DOWN, buff=0.3)
        self.play(m.FadeIn(cost), run_time=0.4)
        self.until(BEATS[4] - 0.3)
        self.play(m.FadeOut(react), m.FadeOut(cost), run_time=0.3)

        # 4 ── the phasor: length = payoff, angle from the material axis
        t0 = BEATS[4]
        theta = m.ValueTracker(40.0)
        W = m.always_redraw(lambda: m.Arrow(O, at(theta.get_value()), buff=0, color=GOLD, stroke_width=9))
        W_lab = m.always_redraw(lambda: M("W", 60, GOLD).move_to(
            at(theta.get_value(), L * 0.75) + 0.5 * np.array([np.cos(np.radians(theta.get_value())), -np.sin(np.radians(theta.get_value())), 0])))
        proj_m = m.always_redraw(lambda: m.DashedLine(at(theta.get_value()), O + m.UP * (L * np.cos(np.radians(theta.get_value()))),
                                                      color=MAT, stroke_width=3))
        proj_s = m.always_redraw(lambda: m.DashedLine(at(theta.get_value()), O + m.RIGHT * (L * np.sin(np.radians(theta.get_value()))),
                                                      color=STAT, stroke_width=3))
        self.until(t0 + 1.5)
        self.play(m.FadeIn(W), m.FadeIn(W_lab), run_time=0.6)
        self.add(proj_m, proj_s)
        self.until(t0 + 2.6)
        R = m.VGroup(T("LENGTH = SIZE OF THE PAYOFF", 30, GOLD), M(r"R = |W| = \sqrt{\psi_m^2 + \psi_s^2}", 52)).arrange(m.DOWN, buff=0.15)
        R.move_to([0, -4.0, 0])
        self.play(m.FadeIn(R), run_time=0.5)
        self.until(t0 + 4.8)
        arc = m.always_redraw(lambda: m.Arc(radius=1.4, start_angle=np.pi / 2, angle=-np.radians(theta.get_value()),
                                            color=INK, stroke_width=5).move_arc_center_to(O))
        th_l = m.always_redraw(lambda: M(r"\theta", 52).move_to(O + 2.0 * np.array([np.sin(np.radians(theta.get_value() / 2)),
                                                                                     np.cos(np.radians(theta.get_value() / 2)), 0])).set_opacity(float(np.clip((theta.get_value() - 15) / 10, 0, 1))))
        self.play(m.FadeIn(arc), m.FadeIn(th_l), run_time=0.5)
        self.until(t0 + 7.7)
        mode = T("θ = HOW THE SYSTEM IS RUNNING", 32, INK).move_to([0, -5.6, 0])
        self.play(m.FadeIn(mode), run_time=0.4)
        self.until(BEATS[5] - 0.3)
        self.play(m.FadeOut(R), m.FadeOut(mode), run_time=0.3)

        # 5 ── 0 degrees all material; 90 degrees all status (default mode)
        t0 = BEATS[5]
        tag = T("θ = 0°: ALL MATERIAL", 40, MAT).move_to([0, -4.0, 0])
        self.play(theta.animate.set_value(0), m.FadeIn(tag), run_time=0.9)
        self.until(t0 + 2.6)
        sub = T("REAL INVESTMENT", 32, INK).next_to(tag, m.DOWN, buff=0.15)
        self.play(m.FadeIn(sub), run_time=0.3)
        self.until(t0 + 3.9)
        tag2 = T("θ = 90°: ALL STATUS", 40, STAT).move_to(tag)
        sub2 = T("PURE PACIFICATION", 32, INK).move_to(sub)
        self.play(theta.animate.set_value(90), m.Transform(tag, tag2), m.Transform(sub, sub2), run_time=1.2)
        self.until(t0 + 7.8)
        dflt = T("THE DEFAULT MODE OF\nTHE EXTRACTION KERNEL", 32, GOLD).next_to(sub, m.DOWN, buff=0.3)
        self.play(m.FadeIn(dflt), run_time=0.4)
        self.until(BEATS[6] - 0.3)
        self.play(m.FadeOut(tag), m.FadeOut(sub), m.FadeOut(dflt), run_time=0.3)

        # 6 ── past 90 degrees: cos(theta) < 0, Quadrant II, fascism
        t0 = BEATS[6]
        cos_l = M(r"\theta > 90^\circ \;\Rightarrow\; \cos\theta < 0", 56).move_to([0, -4.0, 0])
        self.play(theta.animate.set_value(128), m.FadeIn(cos_l), run_time=1.6)
        self.until(t0 + 2.8)
        neg = T("MATERIAL WAGE GOES NEGATIVE", 32, HER).next_to(cos_l, m.DOWN, buff=0.25)
        self.play(m.FadeIn(neg), proj_m.animate.set_color(HER), run_time=0.5)
        self.until(t0 + 5.9)
        infl = T("WHILE THE STATUS WAGE INFLATES", 32, STAT).next_to(neg, m.DOWN, buff=0.15)
        self.play(m.FadeIn(infl), run_time=0.4)
        self.until(t0 + 9.6)
        fas = T("THE FRAMEWORK'S\nDEFINITION OF FASCISM", 40, HER).next_to(infl, m.DOWN, buff=0.35)
        self.play(m.Write(fas), run_time=0.8)
        self.until(BEATS[7] - 0.3)
        self.play(*[m.FadeOut(x) for x in (cos_l, neg, infl, fas)], run_time=0.3)

        # 7 ── square a pure status wage: (j psi_s)^2 = -psi_s^2
        t0 = BEATS[7]
        self.play(theta.animate.set_value(90), run_time=0.8)
        self.until(t0 + 1.8)
        sq = M(r"(j\psi_s)^2 = j^2\psi_s^2 = -\psi_s^2", 60).move_to([0, -4.0, 0])
        self.play(m.Write(sq), run_time=1.0)
        down = m.Arrow(O, O + m.DOWN * 2.4, buff=0, color=HER, stroke_width=9)
        self.play(m.GrowArrow(down), run_time=0.6)
        self.until(t0 + 3.7)
        dest = T("STATUS ALONE DESTROYS REAL WEALTH", 34, HER).next_to(sq, m.DOWN, buff=0.3)
        self.play(m.FadeIn(dest), run_time=0.4)
        self.until(BEATS[8] - 0.3)
        self.play(*[m.FadeOut(x) for x in self.mobjects], run_time=0.4)

        # 8 ── close
        t0 = BEATS[8]
        a = T("IT'S A MODEL", 56, GOLD).shift(m.UP * 1.6)
        b = T("FOR WHY PEOPLE DEFEND\nA WAGE THAT NEVER PAYS THEM", 40, INK)
        c = T("THE ORIGINAL POWER", 52, GOLD).shift(m.DOWN * 2.0)
        self.play(m.FadeIn(a), run_time=0.4)
        self.until(t0 + 1.1)
        self.play(m.FadeIn(b), run_time=0.5)
        self.until(t0 + 4.4)
        self.play(m.Write(c), run_time=0.7)
        self.until(END)
        self.play(*[m.FadeOut(x) for x in self.mobjects], run_time=0.4)

        # end card
        card = m.VGroup(qr(BOOK, side=3.0), T("THE BOOK", 36, GOLD)).arrange(m.DOWN, buff=0.3).shift(m.UP * 0.6)
        src = T("Source: The Original Power, eq. 2.2a–d", 28, DIM, "NORMAL").next_to(card, m.DOWN, buff=0.6)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        self.play(m.FadeIn(card), m.FadeIn(src), m.FadeIn(foot), run_time=0.5)
        self.wait(2.5)
