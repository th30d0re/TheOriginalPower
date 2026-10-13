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

        # 6 ── the complex wage plane: material up (toward the Elite), status across
        PC = np.array([0.0, 2.55, 0])
        H = 1.25
        plane = m.VGroup(
            m.Arrow(PC + m.DOWN * H, PC + m.UP * H, buff=0, color=OK, stroke_width=4, max_tip_length_to_length_ratio=0.08),
            m.Arrow(PC + m.LEFT * H, PC + m.RIGHT * H, buff=0, color=STAT, stroke_width=4, max_tip_length_to_length_ratio=0.08))
        pl = m.VGroup(M(r"\psi_m", 40, OK).next_to(plane[0], m.UP, buff=0.05),
                      M(r"j\psi_s", 40, STAT).next_to(plane[1], m.RIGHT, buff=0.08))
        qpos = {1: (1, 1), 2: (1, -1), 3: (-1, -1), 4: (-1, 1)}   # (status sign, material sign)
        qlab = {k: T(["I", "II", "III", "IV"][k - 1], 30, DIM).move_to(PC + H * np.array([0.82 * sx, 0.3 * sy, 0]))
                for k, (sx, sy) in qpos.items()}
        self.until(self.cue(6, "complex"))
        self.play(m.GrowArrow(plane[0]), m.GrowArrow(plane[1]), m.FadeIn(pl), run_time=0.8)
        self.until(self.cue(6, "Four"))
        self.play(*[m.FadeIn(q) for q in qlab.values()], run_time=0.5)

        AY = -1.7   # trajectory arena center
        SC = 0.7

        def traj(Ev, Bv, T_end, v0=(0.0, 0.0), p0=(0.0, 0.0)):
            dt = 0.002
            p = np.array(p0, float)
            v = np.array(v0, float)
            pts = [p.copy()]
            for _ in range(int(T_end / dt)):
                a = np.array([v[1] * Bv, Ev - v[0] * Bv])
                v = v + a * dt
                p = p + v * dt
                pts.append(p.copy())
            return np.array(pts)[::10]

        def show(k, Ev, Bv, T_end, run_t, origin, color, v0=(0.0, 0.0)):
            pts = traj(Ev, Bv, T_end, v0)
            scr = [np.array([origin[0] + SC * x, origin[1] + SC * y, 0]) for x, y in pts]
            u = m.ValueTracker(1)
            path = m.always_redraw(lambda: m.VMobject(stroke_color=color, stroke_width=6).set_points_as_corners(scr[:max(2, int(u.get_value()))]))
            dot = m.always_redraw(lambda: m.Dot(scr[max(1, int(u.get_value())) - 1], radius=0.17, color=GOLD))
            sx, sy = qpos[k]
            wv = m.Arrow(PC, PC + 0.95 * H * np.array([sx, sy, 0]) / np.sqrt(2), buff=0, color=GOLD, stroke_width=7)
            hl = m.Square(side_length=H, stroke_width=0, fill_color=color, fill_opacity=0.18).move_to(PC + H / 2 * np.array([sx, sy, 0]))
            self.play(m.FadeIn(hl), m.GrowArrow(wv), qlab[k].animate.set_color(color), run_time=0.4)
            self.add(path, dot)
            self.play(u.animate.set_value(len(scr)), run_time=run_t, rate_func=m.linear)
            return m.VGroup(hl, wv), path, dot

        def drop(*mobs):
            self.play(*[m.FadeOut(x) for x in mobs], run_time=0.3)

        # 7 ── QI: both positive; the climb bends into horizontal drift
        self.until(self.cue(7, "quadrant"))
        q1, p1, d1 = show(1, 1.0, 1.2, 9.0, 4.0, (-3.2, AY - 1.2), OK)
        self.until(self.cue(7, "sideways"))
        c1 = m.VGroup(T("QUADRANT I", 44, OK), T("AIM UP, DRIFT SIDEWAYS", 34, OK)).arrange(m.DOWN, buff=0.1).move_to([0, -4.8, 0])
        self.play(m.FadeIn(c1), run_time=0.4)
        self.until(self.cue(7, "horizontal"))
        c1b = T("INTO THE PEOPLE NEXT TO YOU", 32, INK).next_to(c1, m.DOWN, buff=0.15)
        self.play(m.FadeIn(c1b), run_time=0.4)
        self.until(B[8] - 0.3)
        drop(q1, p1, d1, c1, c1b)

        # 8 ── QII: material negative, status swells: cyclotron in place
        self.until(self.cue(8, "Quadrant"))
        q2, p2, d2 = show(2, -0.25, 3.2, 10.0, max(1.5, self.cue(8, "spins") - self.time), (0.0, AY + 0.6), HER, v0=(3.0, 0.0))
        c2 = T("QUADRANT II · FASCISM", 44, HER).move_to([0, -4.9, 0])
        self.play(m.FadeIn(c2), run_time=0.4)
        c2b = T("ENDLESS CIRCLES\nZERO FORWARD PROGRESS", 34, INK).next_to(c2, m.DOWN, buff=0.15)
        self.play(m.FadeIn(c2b), run_time=0.4)
        self.until(B[9] - 0.3)
        drop(q2, p2, d2, c2, c2b)

        # 9 ── QIII: both negative: pushed down and degraded
        self.until(self.cue(9, "Quadrant"))
        q3, p3, d3 = show(3, -1.0, -1.2, 9.0, 3.5, (-3.2, AY + 1.4), "#B04A3A")
        self.until(self.cue(9, "Out"))
        c3 = T("QUADRANT III · OUT-GROUP", 40, "#E0907F").move_to([0, -4.9, 0])
        c3b = T("EXTRACTED AND DEGRADED\nWHERE RECLASSIFICATION SENDS YOU", 32, INK).next_to(c3, m.DOWN, buff=0.15)
        self.play(m.FadeIn(c3), m.FadeIn(c3b), run_time=0.4)
        self.until(B[10] - 0.3)
        drop(q3, p3, d3, c3, c3b)

        # 10 ── QIV: the conjugate; add it to QI and the deflection cancels
        self.until(self.cue(10, "Quadrant"))
        q4, p4, d4 = show(4, 1.0, -1.2, 9.0, 3.0, (3.2, AY - 1.2), HIM)
        self.until(self.cue(10, "conjugate"))
        c4 = M(r"W^{*} = \psi_m - j\psi_s", 52, HIM).move_to([0, -4.9, 0])
        self.play(m.FadeIn(c4), run_time=0.4)
        self.until(self.cue(10, "cancel"))
        c4b = M(r"W + W^{*} = 2\psi_m", 56, GOLD).move_to(c4)
        sumv = m.Arrow(PC, PC + 0.95 * H * m.UP, buff=0, color=GOLD, stroke_width=9)
        self.play(m.FadeOut(p4), m.FadeOut(d4), m.FadeOut(q4[1]), m.Transform(c4, c4b), m.GrowArrow(sumv), run_time=0.6)
        self.until(self.cue(10, "straight"))
        up = m.Arrow([0, AY - 2.0, 0], [0, AY + 2.4, 0], buff=0, color=GOLD, stroke_width=10)
        top = T("THE TOP", 30, GOLD).next_to(up, m.UP, buff=0.1)
        self.play(m.GrowArrow(up), run_time=1.0, rate_func=m.rush_into)
        self.play(m.FadeIn(top), run_time=0.3)
        sol = T("QUADRANT IV · SOLIDARITY", 40, HIM).next_to(c4, m.DOWN, buff=0.2)
        self.play(m.FadeIn(sol), run_time=0.4)
        self.end_card()
