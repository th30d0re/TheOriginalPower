"""S16-01/08/15 complex wage plane; S19-14 StatusWage dielectric model."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

STAT = "#B28DFF"
MAT = OK


def phasor_plane(origin=np.array([-0.2, -1.45, 0]), length=3.7):
    y_ax = m.Arrow(origin + m.DOWN * 1.05, origin + m.UP * (length + 0.25), buff=0, color=MAT, stroke_width=7)
    x_ax = m.Arrow(origin + m.LEFT * 0.3, origin + m.RIGHT * (length + 0.45), buff=0, color=STAT, stroke_width=7)
    y_lab = M(r"\psi_m", 52, MAT).next_to(y_ax.get_end(), m.LEFT, buff=0.28)
    x_lab = M(r"j\psi_s", 48, STAT).move_to(origin + m.RIGHT * (length + 0.95) + m.UP * 0.45)
    return origin, length, m.VGroup(y_ax, x_ax, y_lab, x_lab)


def at_ph(origin, length, theta_deg):
    th = np.radians(theta_deg)
    return origin + length * np.array([np.sin(th), np.cos(th), 0])


def build_systemic_inductor():
    """Large horizontal solenoid + ideological B-field ellipses (frame-filling)."""
    cy = -0.25
    n_loops = 22
    pitch = 0.46
    loop_r = 0.44
    x0 = -(n_loops - 1) * pitch / 2
    loops = m.VGroup(
        *[
            m.Arc(radius=loop_r, angle=m.PI, stroke_color=GOLD, stroke_width=5).shift(
                m.RIGHT * (x0 + i * pitch) + m.UP * cy
            )
            for i in range(n_loops)
        ]
    )
    span = n_loops * pitch
    lead_l = m.Line([x0 - 0.55, cy, 0], [x0, cy, 0], color=GOLD, stroke_width=5)
    lead_r = m.Line([x0 + (n_loops - 1) * pitch, cy, 0], [x0 + span * 0.52 + 0.4, cy, 0], color=GOLD, stroke_width=5)
    core = m.RoundedRectangle(
        width=span + 0.9,
        height=1.05,
        corner_radius=0.12,
        stroke_color=STAT,
        stroke_width=3,
        fill_color=NAVY2,
        fill_opacity=0.35,
    ).move_to([0, cy, 0])
    coil = m.VGroup(lead_l, loops, lead_r, core)
    coil.scale_to_fit_width(11.2)

    field_lines = m.VGroup()
    for ew, eh, yoff in [
        (3.2, 0.55, 0.55),
        (4.6, 0.75, 0.72),
        (6.2, 1.0, 0.95),
        (8.0, 1.35, 1.25),
        (10.0, 1.75, 1.55),
    ]:
        top = m.Ellipse(width=ew, height=eh, stroke_color=STAT, stroke_width=3, fill_opacity=0)
        top.move_to([0, cy + yoff, 0])
        field_lines.add(top)

    i_arrow = m.Arrow(coil.get_left() + m.LEFT * 0.55 + m.DOWN * 0.55, coil.get_left() + m.DOWN * 0.55, color=INK, stroke_width=6, buff=0.05)
    i_lab = M(r"I", 44, INK).next_to(i_arrow, m.LEFT, buff=0.15)
    l_sym = M(r"L", 48, GOLD).next_to(coil, m.RIGHT, buff=0.5)
    return coil, field_lines, i_arrow, i_lab, l_sym, cy


class ComplexWage(YTScene):
    SHOT = "S16-01"

    def shot_S16_01(self):
        head = T("KERNEL OBJECTIVE", 44, GOLD).to_edge(m.UP, buff=0.45)
        tau = m.DashedLine([-6.2, 1.55, 0], [6.2, 1.55, 0], color=GOLD, dash_length=0.14, stroke_width=5)
        tau_l = M(r"\tau", 56, GOLD).next_to(tau, m.LEFT, buff=0.18)
        ceiling = T("COHERENCE CEILING", 34, DIM, "NORMAL").next_to(tau, m.UP, buff=0.14)
        bar_w = 11.0
        bar = m.RoundedRectangle(
            width=bar_w,
            height=0.85,
            corner_radius=0.1,
            stroke_color=DIM,
            stroke_width=4,
            fill_color=NAVY2,
            fill_opacity=0.85,
        ).shift(m.DOWN * 1.35)
        fill_h = 0.42
        fill = m.Rectangle(width=bar_w - 0.2, height=fill_h, fill_color=OK, fill_opacity=0.9, stroke_width=0)
        fill.align_to(bar, m.DOWN).shift(m.UP * 0.12)
        bar_l = T("THREAT LEVEL", 34, INK).next_to(bar, m.UP, buff=0.12)
        self.add(head, tau, tau_l, ceiling, bar, fill, bar_l)
        self.until(self.at(0, "kernel"))
        threat = T("THREAT LEVEL BELOW τ", 36, OK).next_to(bar, m.DOWN, buff=0.45)
        self.play(m.FadeIn(threat), m.Indicate(fill, color=OK), run_time=0.55)
        self.until(self.beat_end(0) - 0.3)

    def shot_S16_08(self):
        origin, L, axes = phasor_plane()
        head = T("COMPLEX WAGE · REACTIVE POWER", 40, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        theta = m.ValueTracker(38.0)
        w_arrow = m.always_redraw(
            lambda: m.Arrow(origin, at_ph(origin, L, theta.get_value()), buff=0, color=GOLD, stroke_width=9)
        )
        w_lab = m.always_redraw(
            lambda: M("W", 52, GOLD).move_to(at_ph(origin, L, theta.get_value()) + m.UP * 0.35 + m.RIGHT * 0.2)
        )
        self.add(head, axes, w_arrow, w_lab)
        self.until(self.at(0, "reactive"))
        self.play(theta.animate.set_value(52.0), run_time=0.7)
        side = T("DEFLECTS CLASS MOMENTUM", 34, STAT).to_edge(m.DOWN, buff=0.42)
        perp = m.Arrow([5.2, -1.85, 0], [5.2, 0.15, 0], color=STAT, stroke_width=6, buff=0)
        self.play(m.GrowArrow(perp), m.FadeIn(side), run_time=0.55)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "steady"))
        self.play(m.FadeOut(side, perp), run_time=0.25)
        ext = m.Arrow([-5.0, -3.05, 0], [5.0, -3.05, 0], color=MAT, stroke_width=5)
        zero = T("ZERO MATERIAL WORK ALONG EXTRACTION CURRENT", 34, DIM, width=11.0).to_edge(m.DOWN, buff=0.32)
        self.play(m.GrowArrow(ext), m.FadeIn(zero), run_time=0.55)
        self.until(self.beat_end(1) - 0.3)

    def shot_S16_15(self):
        """S16-15 primary: microaggression trickle-charge through field collapse (S16-16–18 holds)."""
        head = T("SYSTEMIC INDUCTOR", 44, GOLD).to_edge(m.UP, buff=0.45)
        flab = T("IDEOLOGICAL FIELD B", 34, STAT).next_to(head, m.DOWN, buff=0.12)
        coil, field_lines, i_arrow, i_lab, l_sym, cy = build_systemic_inductor()
        coil.shift(m.DOWN * 0.15)
        field_lines.shift(m.DOWN * 0.15)
        i_arrow.shift(m.DOWN * 0.15)
        i_lab.shift(m.DOWN * 0.15)
        l_sym.next_to(coil, m.DOWN, buff=0.28)

        strength = m.ValueTracker(0.08)
        for line in field_lines:
            line.set_opacity(0.05)

        def refresh_fields():
            s = strength.get_value()
            for tier, line in enumerate(field_lines):
                line.set_opacity(float(np.clip(s * (1.15 - tier * 0.12), 0.04, 0.92)))
                line.set_stroke(width=2 + 4 * s)

        field_lines.add_updater(lambda mob: refresh_fields())

        scene = m.VGroup(coil, field_lines, i_arrow, i_lab, l_sym)
        self.add(head, flab, scene)
        self.until(self.at(0, "Microaggressions"))
        trickle = m.Dot([4.5, 2.6, 0], radius=0.1, color=HER)
        self.play(
            m.FadeIn(trickle),
            trickle.animate.move_to(coil.get_top() + m.UP * 0.05),
            strength.animate.set_value(0.2),
            run_time=0.65,
        )
        self.play(m.FadeOut(trickle), run_time=0.15)
        self.until(self.beat_end(0) - 0.25)

        self.until(self.at(1, "quantum"))
        quanta = m.VGroup()
        n_q = 9
        x_spread = np.linspace(-2.2, 2.2, n_q)
        for qi in range(n_q):
            q = m.Dot([x_spread[qi], 2.8, 0], radius=0.11, color=HER)
            quanta.add(q)
            self.add(q)
            target = coil.get_top() + m.RIGHT * (x_spread[qi] * 0.35) + m.UP * 0.08
            self.play(
                q.animate.move_to(target),
                strength.animate.set_value(0.22 + 0.72 * (qi + 1) / n_q),
                run_time=0.32,
            )
        neg = T("NEGLIGIBLE PER EVENT", 34, DIM).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(neg), run_time=0.35)
        self.until(self.at(1, "massive"))
        self.play(m.FadeOut(neg, quanta), run_time=0.3)
        big = T("ACCUMULATED FIELD MASSIVE", 40, GOLD).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(big), strength.animate.set_value(1.0), run_time=0.55)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "kinetic"))
        self.play(m.FadeOut(big), run_time=0.2)
        di_base = coil.get_right() + m.RIGHT * 0.55
        di_arrow = m.Arrow(di_base + m.DOWN * 1.35, di_base + m.UP * 1.35, color=HER, stroke_width=8, buff=0)
        di = M(r"\frac{di}{dt}", 48, HER).next_to(di_arrow, m.RIGHT, buff=0.22)
        mob = T("KINETIC MOBILIZATION", 34, HER).to_edge(m.DOWN, buff=0.38)
        self.play(m.GrowArrow(di_arrow), m.FadeIn(di, mob), i_arrow.animate.set_color(HER), run_time=0.65)
        self.until(self.beat_end(2) - 0.25)

        self.until(self.at(3, "collapse"))
        self.play(m.FadeOut(di_arrow, di, mob), run_time=0.2)
        collapse = T("FIELD COMPELLED TO COLLAPSE", 36, HER).to_edge(m.DOWN, buff=0.38)
        self.play(
            m.FadeIn(collapse),
            strength.animate.set_value(0.05),
            field_lines.animate.set_stroke(color=HER, width=2),
            coil.animate.set_stroke(color=HER, width=6),
            run_time=0.85,
        )
        self.until(self.beat_end(3) - 0.3)
        field_lines.clear_updaters()


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
        layer = m.RoundedRectangle(
            width=5.5,
            height=1.0,
            corner_radius=0.12,
            stroke_color=INK,
            stroke_width=4,
            fill_color=NAVY2,
            fill_opacity=1,
        ).shift(m.DOWN * 2.0)
        blab = T("BUFFER CLASS · DIELECTRIC", 28, INK).move_to(layer)
        self.play(m.FadeIn(layer, blab), run_time=0.6)
        self.until(self.beat_end(2) - 0.3)

        self.until(self.at(3, "blocks"))
        elite = T("E", 40, GOLD).shift(m.UP * 2.2)
        block = T("BLOCKS ARC TOWARD E", 26, GOLD).next_to(elite, m.DOWN, buff=0.2)
        lat = T("REDIRECTS CONFLICT LATERALLY", 26, HER).next_to(layer, m.DOWN, buff=0.25)
        self.play(m.FadeIn(elite, block, lat), run_time=0.6)
        self.until(self.beat_end(3) - 0.3)
