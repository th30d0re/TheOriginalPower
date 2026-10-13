"""UEF reel: the Unified Lorentz Force (book eq. 0.1; cyclotron from the UEF draft §5.1).

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/lorentz_force.py LorentzForce \
        -r 1080x1920 --fps 30 -o outputs/UEF_lorentz_force/video/lorentz_force.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402


class LorentzForce(UEFReel):
    EP = "UEF_lorentz_force"
    SOURCE = "Source: The Original Power, eq. 0.1\ncyclotron: UEF draft §5.1"

    def construct(self):
        self.begin()
        B = self.BEATS

        # 0 ── title
        title = T("THE UNIFIED LORENTZ FORCE", 54, GOLD).to_edge(m.UP, buff=1.0)
        self.until(self.cue(0, "Unified"))
        self.play(m.Write(title), run_time=0.8)

        # 1 ── the equation, built term by term
        lhs = M(r"\vec F_{\text{total}} =", 64)
        t1 = M(r"\mathbf{Q}\sum_j \vec{\mathcal{E}}^{(j)}_{\text{mat}}", 64, OK)
        plus = M("+", 64)
        t2 = M(r"\mathbf{Q}\Big(\vec v \times \sum_k \rho_k \vec B_k\Big)", 64, STAT)
        eq = m.VGroup(lhs, t1, plus, t2).arrange(m.RIGHT, buff=0.15).scale_to_fit_width(7.4).next_to(title, m.DOWN, buff=0.5)
        self.until(B[1])
        self.play(m.FadeIn(lhs), run_time=0.4)
        self.until(self.cue(1, "charge"))
        self.play(m.FadeIn(t1, shift=m.UP * 0.2), run_time=0.5)
        self.until(self.cue(1, "plus"))
        self.play(m.FadeIn(plus), m.FadeIn(t2, shift=m.UP * 0.2), run_time=0.6)

        # 2 ── Q is assigned
        self.until(self.cue(2, "assigned"))
        lab = T("Q = ASSIGNED CHARGE", 40, GOLD).shift(m.UP * 1.2)
        self.play(m.Indicate(t1, color=GOLD), m.Indicate(t2, color=GOLD), m.FadeIn(lab), run_time=0.8)
        self.until(self.cue(2, "law"))
        flow = m.VGroup(T("LAW", 40, INK), M(r"\longrightarrow", 64), T("PERSON", 40, INK)).arrange(m.RIGHT, buff=0.3).next_to(lab, m.DOWN, buff=0.5)
        self.play(m.FadeIn(flow), run_time=0.5)
        self.until(B[3] - 0.3)
        self.play(m.FadeOut(lab), m.FadeOut(flow), run_time=0.3)

        # 3 ── the electric term pushes the charge forward
        y0 = -1.4
        charge = m.Dot([-3.0, y0, 0], radius=0.22, color=GOLD)
        e_field = m.VGroup(*[m.Arrow([-3.4, y, 0], [3.4, y, 0], buff=0, color=OK, stroke_width=3, max_tip_length_to_length_ratio=0.03)
                             for y in (y0 - 1.0, y0 + 1.0)])
        e_lab = M(r"\vec{\mathcal{E}}_{\text{mat}}", 54, OK).move_to([2.8, y0 + 1.5, 0])
        self.until(self.cue(3, "material"))
        self.play(m.FadeIn(e_field), m.FadeIn(e_lab), m.FadeIn(charge), run_time=0.6)
        self.play(charge.animate.move_to([1.2, y0, 0]), run_time=2.2, rate_func=m.rush_into)
        self.until(self.cue(3, "only"))
        work = T("THE ONLY TERM THAT DOES REAL WORK", 34, OK).move_to([0, -3.8, 0])
        self.play(m.FadeIn(work), run_time=0.4)
        self.until(B[4] - 0.3)
        self.play(m.FadeOut(e_field), m.FadeOut(e_lab), m.FadeOut(work), charge.animate.move_to([0, y0, 0]), run_time=0.3)

        # 4 ── the magnetic cross product: perpendicular, zero work
        dots = m.VGroup(*[m.VGroup(m.Circle(radius=0.12, color=STAT, stroke_width=3), m.Dot(radius=0.04, color=STAT))
                          .move_to([x, y, 0]) for x in np.arange(-3.0, 3.1, 1.0) for y in np.arange(y0 - 1.8, y0 + 1.9, 1.2)])
        b_lab = T("CULTURAL FIELD B (OUT OF SCREEN)", 28, STAT).move_to([0, y0 + 2.3, 0])
        v = m.Arrow(charge.get_center(), charge.get_center() + m.RIGHT * 1.4, buff=0, color=GOLD, stroke_width=7)
        f = m.Arrow(charge.get_center(), charge.get_center() + m.DOWN * 1.2, buff=0, color=STAT, stroke_width=7)
        vl = M(r"\vec v", 48, GOLD).next_to(v, m.UP, buff=0.1)
        fl = M(r"\vec v \times \vec B", 44, STAT).next_to(f, m.LEFT, buff=0.2)
        fl = m.VGroup(m.BackgroundRectangle(fl, color="#121212", fill_opacity=1, buff=0.08), fl)
        self.until(B[4])
        self.play(m.FadeIn(dots), m.FadeIn(b_lab), run_time=0.6)
        self.play(m.GrowArrow(v), m.FadeIn(vl), run_time=0.4)
        self.until(self.cue(4, "perpendicular"))
        right = m.RightAngle(m.Line(charge.get_center(), v.get_end()), m.Line(charge.get_center(), f.get_end()), length=0.3, color=INK)
        self.play(m.GrowArrow(f), m.FadeIn(fl), m.Create(right), run_time=0.5)
        self.until(self.cue(4, "deflects"))
        zero = T("PERPENDICULAR TO MOTION\n= ZERO WORK", 38, STAT).move_to([0, -4.6, 0])
        self.play(m.FadeIn(zero), run_time=0.4)
        self.until(self.cue(4, "psychological"))
        psy = T("THE PSYCHOLOGICAL WAGE", 44, STAT).next_to(zero, m.DOWN, buff=0.3)
        self.play(m.Write(psy), run_time=0.6)
        self.until(B[5] - 0.3)
        self.play(*[m.FadeOut(x) for x in (v, f, vl, fl, right, zero, psy, charge, dots, b_lab)], run_time=0.3)

        # 5 ── self-excited: extraction funds the field
        ext = m.VGroup(m.RoundedRectangle(width=3.0, height=1.1, corner_radius=0.15, color=HER), T("EXTRACTION", 34, HER))
        ext[1].move_to(ext[0])
        ext.move_to([-1.9, -0.6, 0])
        fld = m.VGroup(m.RoundedRectangle(width=3.0, height=1.1, corner_radius=0.15, color=STAT), T("FIELD B", 34, STAT))
        fld[1].move_to(fld[0])
        fld.move_to([1.9, -0.6, 0])
        tap = m.CurvedArrow(ext[0].get_top() + m.RIGHT * 0.5, fld[0].get_top() + m.LEFT * 0.5, angle=-1.2, color=GOLD, stroke_width=6)
        tl = T("FEEDBACK TAP", 28, GOLD).next_to(tap, m.UP, buff=0.1)
        self.until(self.cue(5, "self"))
        self.play(m.FadeIn(ext), m.FadeIn(fld), run_time=0.4)
        self.until(self.cue(5, "funded"))
        self.play(m.Create(tap), m.FadeIn(tl), run_time=0.6)
        self.until(self.cue(5, "Culture"))
        items = m.VGroup(*[T(s, 30, INK) for s in ["CULTURE-WAR MEDIA", "CAMPAIGNS", "MILITARIZED POLICING"]]).arrange(m.DOWN, buff=0.15)
        items.move_to([0, -2.6, 0])
        self.play(m.LaggedStart(*[m.FadeIn(i) for i in items], lag_ratio=0.5), run_time=1.6)
        self.until(self.cue(5, "Cut"))
        cut = m.Cross(tap, stroke_color=HER, stroke_width=8)
        self.play(m.Create(cut), run_time=0.4)
        self.until(self.cue(5, "decays"))
        self.play(fld.animate.set_opacity(0.2), run_time=1.0)
        self.until(B[6] - 0.3)
        self.play(*[m.FadeOut(x) for x in (ext, fld, tap, tl, items, cut)], run_time=0.3)

        # 6 ── E -> 0, B up: cyclotron motion, endless circles in place
        c = np.array([0.0, -1.0, 0])
        r = 1.6
        ang = m.ValueTracker(0.0)
        self.until(self.cue(6, "Turn"))
        cond = M(r"\vec{\mathcal{E}}_{\text{mat}} \to 0,\quad \sum \rho_k \vec B_k \uparrow", 52).move_to([0, 1.8, 0])
        self.play(m.FadeIn(cond), run_time=0.5)
        self.until(self.cue(6, "cyclotron"))
        trail = m.always_redraw(lambda: m.Arc(radius=r, start_angle=-np.pi / 2, angle=min(ang.get_value(), 2 * np.pi - 1e-3) + 1e-3,
                                              color=STAT, stroke_width=5).move_arc_center_to(c))
        dot = m.always_redraw(lambda: m.Dot(c + r * np.array([np.cos(-np.pi / 2 + ang.get_value()), np.sin(-np.pi / 2 + ang.get_value()), 0]),
                                            radius=0.2, color=GOLD))
        center = m.Cross(stroke_color=DIM, stroke_width=4).scale(0.15).move_to(c)
        self.add(trail, dot, center)
        self.play(ang.animate.set_value(2 * np.pi), run_time=1.6, rate_func=m.linear)
        self.until(self.cue(6, "Endless"))
        loop = T("ENDLESS CIRCLES · HUGE ENERGY\nZERO FORWARD PROGRESS", 34, INK).move_to([0, -3.8, 0])
        self.play(m.FadeIn(loop), ang.animate.set_value(4 * np.pi), run_time=1.6, rate_func=m.linear)
        self.play(ang.animate.set_value(6 * np.pi), run_time=max(0.3, B[7] - 0.4 - self.time), rate_func=m.linear)

        # 7 ── Quadrant II
        self.until(self.cue(7, "Quadrant"))
        q2 = T("QUADRANT II: FASCISM", 52, HER).move_to([0, 3.0, 0])
        self.play(m.FadeOut(cond), m.FadeIn(q2), ang.animate.set_value(7 * np.pi), run_time=0.8, rate_func=m.linear)
        self.until(self.cue(7, "motion"))
        amnm = T("ALL MOTION, NO MOVEMENT", 46, GOLD).move_to(loop)
        self.play(m.Transform(loop, amnm), ang.animate.set_value(8 * np.pi), run_time=1.0, rate_func=m.linear)
        self.play(ang.animate.set_value(10 * np.pi), run_time=max(0.3, self.END - self.time), rate_func=m.linear)
        self.end_card()
