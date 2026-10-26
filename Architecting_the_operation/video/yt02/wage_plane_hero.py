"""YT02 SEG 10: complex-wage plane hero build (revision G)."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from common16x9 import BG, DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402
from layout_v2 import clamp_above_caption  # noqa: E402

MAT = OK
STAT = GOLD
ORIGIN = np.array([-1.35, 0.35, 0.0])
LENGTH = 2.85
A_VAL, B_VAL = 1.6, 1.1


def wage_point(theta_deg, origin=ORIGIN, length=LENGTH):
    th = np.radians(theta_deg)
    return origin + length * np.array([np.sin(th), -np.cos(th), 0.0])


class WagePlaneHero(YTScene):
    SHOT = "S10-06"

    def _build_rotated_plane(self, theta_deg=35.0):
        origin = ORIGIN
        length = LENGTH
        theta = m.ValueTracker(theta_deg)

        y_axis = m.Arrow(origin + m.UP * 2.2, origin + m.DOWN * 2.6, buff=0, color=MAT, stroke_width=6)
        x_axis = m.Arrow(origin + m.LEFT * 0.4, origin + m.RIGHT * 3.6, buff=0, color=STAT, stroke_width=6)
        y_lab = T("material ψₘ (+)", 26, MAT, width=3.2).next_to(y_axis, m.LEFT, buff=0.22)
        x_lab = T("status ψₛ (+)", 26, STAT, width=3.0).next_to(x_axis.get_end(), m.DOWN, buff=0.28)
        elite = T("ELITE", 26, GOLD).move_to(origin + m.UP * 3.05)
        q2 = m.Rectangle(
            width=2.8,
            height=1.55,
            fill_color=HER,
            fill_opacity=0.1,
            stroke_color=HER,
            stroke_width=2,
        ).move_to(origin + m.RIGHT * 1.4 + m.UP * 0.78)
        q2_lab = T("QUADRANT II", 24, HER).move_to(q2)

        def mat_pt():
            t = np.radians(theta.get_value())
            return origin + length * np.array([0.0, -np.cos(t), 0.0])

        def stat_pt():
            t = np.radians(theta.get_value())
            return origin + length * np.array([np.sin(t), 0.0, 0.0])

        arrow = m.always_redraw(lambda: m.Arrow(origin, wage_point(theta.get_value(), origin, length), buff=0, color=GOLD, stroke_width=8))
        proj_m = m.always_redraw(
            lambda: m.Line(
                origin,
                mat_pt(),
                color=MAT if np.cos(np.radians(theta.get_value())) >= 0 else HER,
                stroke_width=7,
            )
        )
        proj_s = m.always_redraw(lambda: m.Line(origin, stat_pt(), color=STAT, stroke_width=7))
        drop_m = m.always_redraw(lambda: m.DashedLine(mat_pt(), wage_point(theta.get_value(), origin, length), color=DIM, dash_length=0.1, stroke_width=2))
        drop_s = m.always_redraw(lambda: m.DashedLine(stat_pt(), wage_point(theta.get_value(), origin, length), color=DIM, dash_length=0.1, stroke_width=2))
        arc = m.always_redraw(
            lambda: m.Arc(
                radius=0.55,
                start_angle=-m.PI / 2,
                angle=np.radians(theta.get_value()),
                color=GOLD,
                stroke_width=4,
            ).shift(origin)
        )
        formulas = m.VGroup(
            m.MathTex(r"\psi_m", r"=", r"|W|", r"\cos\theta", font_size=34, color=MAT),
            m.MathTex(r"\psi_s", r"=", r"|W|", r"\sin\theta", font_size=34, color=STAT),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.18)
        formulas.move_to([5.15, -0.75, 0])
        eq = m.MathTex(r"W", r"=", r"\psi_m", r"+", r"j\psi_s", font_size=40, color=INK)
        eq.to_corner(m.UR, buff=0.38)
        for mob in (y_lab, x_lab, q2_lab, formulas, eq):
            clamp_above_caption(mob)

        grp = m.VGroup(
            y_axis, x_axis, y_lab, x_lab, elite, q2, q2_lab, arrow, proj_m, proj_s, drop_m, drop_s, arc, formulas, eq
        )
        return grp, theta, formulas

    def _number_line_scene(self):
        line = m.NumberLine(x_range=[-3, 3, 1], length=9, color=DIM, include_numbers=True)
        line.move_to([0, 0.2, 0])
        dot = m.Dot(color=GOLD).move_to(line.n2p(2))
        tag = T("one dimension · two directions", 28, INK, width=8.5).next_to(line, m.UP, buff=0.55)
        return line, dot, tag

    def _complex_intro(self):
        plane = m.ComplexPlane(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            x_length=7.2,
            y_length=7.2,
            background_line_style={"stroke_color": DIM, "stroke_width": 1, "stroke_opacity": 0.35},
        ).move_to([0, 0.15, 0])
        re = T("Re", 30, INK).next_to(plane.x_axis, m.DOWN, buff=0.12)
        im = T("Im", 30, INK).next_to(plane.y_axis, m.LEFT, buff=0.12)
        jlab = M(r"j=\sqrt{-1}", 40, GOLD).move_to([3.2, 2.35, 0])
        return plane, re, im, jlab

    def shot_S10_06(self):
        self.camera.background_color = BG
        line, dot, tag = self._number_line_scene()
        self.add(line, dot, tag)
        self.until(self.at(0, "line."))
        self.play(dot.animate.move_to(line.n2p(-2)), run_time=0.55)

        self.until(self.at(0, "perpendicular"))
        plane, re, im, jlab = self._complex_intro()
        self.play(m.FadeOut(line, dot, tag), m.FadeIn(plane, re, im), run_time=0.6)
        self.until(self.at(0, "square"))
        self.play(m.FadeIn(jlab), run_time=0.35)

        z_eq = m.MathTex("z", "=", "a", "+", "j b", font_size=42, color=INK).to_edge(m.UP, buff=0.35)
        self.until(self.at(0, "complex"))
        self.play(m.FadeIn(z_eq), run_time=0.35)
        tip = plane.n2p(complex(A_VAL, B_VAL))
        z_dot = m.Dot(tip, color=GOLD)
        z_arrow = m.Arrow(plane.n2p(0), tip, buff=0, color=GOLD, stroke_width=7)
        self.play(m.FadeIn(z_dot), m.GrowArrow(z_arrow), run_time=0.55)

        self.until(self.at(2, "rotate"))
        wage_eq = m.MathTex("W", "=", r"\psi_m", "+", r"j\psi_s", font_size=42, color=INK).move_to(z_eq)
        self.play(m.TransformMatchingTex(z_eq, wage_eq), run_time=0.75)
        w_re = T("material ψₘ", 28, MAT).move_to(re)
        w_im = T("status ψₛ", 28, STAT).move_to(im)
        self.play(m.Transform(re, w_re), m.Transform(im, w_im), run_time=0.55)

        rot_tag = M(r"\times(-j)", 44, GOLD).move_to([3.5, -1.2, 0])
        ghost = z_arrow.copy().set_opacity(0.25)
        self.play(
            m.Rotate(m.VGroup(plane, z_arrow, z_dot, w_re, w_im), -m.PI / 2, about_point=plane.n2p(0)),
            m.FadeIn(rot_tag, ghost),
            run_time=1.1,
        )
        self.until(self.at(3, "preserves"))
        inv = m.VGroup(M(r"|W|", 36, GOLD), M(r"\theta", 36, GOLD)).arrange(m.RIGHT, buff=0.35)
        inv.move_to([0, -1.85, 0])
        clamp_above_caption(inv)
        self.play(m.FadeIn(inv), run_time=0.4)

        wage_grp, theta, formulas = self._build_rotated_plane(35)
        self.play(
            m.FadeOut(plane, z_arrow, z_dot, w_re, w_im, rot_tag, ghost, inv, wage_eq),
            m.FadeIn(wage_grp),
            run_time=0.65,
        )
        targets = {
            "S10-11": 35.0,
            "S10-12": 35.0,
            "S10-16": 0.0,
            "S10-20": 90.0,
            "S10-23": 118.0,
            "S10-27": 90.0,
        }
        for k in range(1, len(self.run)):
            sid = self.run[k].id
            self.until(self.beat(k))
            ang = targets.get(sid, 35.0)
            anims = [theta.animate.set_value(ang)]
            if sid == "S10-11":
                anims.append(m.Indicate(formulas[0], color=MAT))
            if sid == "S10-12":
                anims.append(m.Indicate(formulas[1], color=STAT))
            self.play(*anims, run_time=0.42)
            self.until(self.beat_end(k) - 0.15)

    def shot_S10_11(self):
        wage_grp, theta, formulas = self._build_rotated_plane(50)
        self.camera.background_color = BG
        self.add(wage_grp)
        self.until(self.at(0, "magnitude"))
        self.play(m.Indicate(formulas[0], color=MAT), m.Indicate(formulas[1], color=STAT), run_time=0.55)
        self.until(self.beat_end(0) - 0.2)

    def shot_S10_16(self):
        wage_grp, theta, formulas = self._build_rotated_plane(0)
        note = T("θ = 0° · PURE MATERIAL", 28, MAT).move_to([4.2, -1.55, 0])
        clamp_above_caption(note)
        self.camera.background_color = BG
        self.add(wage_grp, note)
        for k, (cue, ang) in enumerate((("investment", 12), ("increases", 55), ("ninety", 90))):
            self.until(self.at(k, cue))
            self.play(theta.animate.set_value(ang), run_time=0.5)
        self.until(self.beat_end(2) - 0.2)

    def shot_S10_23(self):
        wage_grp, theta, formulas = self._build_rotated_plane(90)
        self.camera.background_color = BG
        self.add(wage_grp)
        self.until(self.at(0, "past"))
        self.play(theta.animate.set_value(118.0), run_time=0.8)
        self.until(self.beat_end(0) - 0.2)

    def shot_S10_27(self):
        wage_grp, theta, formulas = self._build_rotated_plane(90)
        self.camera.background_color = BG
        self.add(wage_grp)
        self.play(m.Indicate(formulas[1], color=STAT), run_time=0.5)
        self.until(self.beat_end(0) - 0.2)

    def shot_S10_20(self):
        wage_grp, theta, formulas = self._build_rotated_plane(90)
        react = T("REACTIVE POWER · ψₘ = 0", 28, STAT, width=5.5).move_to([4.15, -1.55, 0])
        clamp_above_caption(react)
        self.camera.background_color = BG
        self.add(wage_grp, react)
        self.until(self.at(0, "reactive"))
        self.play(m.Indicate(formulas[1], color=STAT), run_time=0.45)
        self.until(self.beat_end(1) - 0.15)
