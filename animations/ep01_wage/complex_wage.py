# The complex wage, drawn with Manim.
# Cue times are the spoken line starts in ep01_wage_narration.wav.
#
#   .venv-manim/bin/manim --fps 30 -qh \
#       --media_dir animations/ep01_wage/media \
#       animations/ep01_wage/complex_wage.py ComplexWage

import json
from pathlib import Path

import numpy as np
from manim import (
    DOWN,
    DR,
    LEFT,
    PI,
    RIGHT,
    UL,
    UP,
    UR,
    Arc,
    Arrow,
    Axes,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    GrowArrow,
    Line,
    MathTex,
    MoveToTarget,
    Rectangle,
    ReplacementTransform,
    RightAngle,
    Rotate,
    RoundedRectangle,
    Scene,
    Text,
    ValueTracker,
    VGroup,
    always_redraw,
    config,
)

config.background_color = "#0B0C0F"

GOLD = "#E6C26B"
BLUE = "#8CBAD6"
PALE = "#C5D0DA"
RED = "#D16657"
PAPER = "#F4F1EA"
MUTED = "#9E9A90"
INK = "#1A1612"
BAR = "#3A3A40"

def _load_cues():
    manifest = json.loads((HERE / "voice/ep01_wage/episode_manifest.json").read_text())
    starts = [turn["start_ms"] / 1000.0 for turn in manifest["turns"]]
    end = manifest["turns"][-1]["end_ms"] / 1000.0 + 2.6
    return starts, end

# Real is vertical. Imaginary is horizontal. The scale fits 2ψm under the title.
PM = 1.50
PS = 1.02
R = float(np.hypot(PM, PS))
TH = float(np.arctan2(PS, PM))

HERE = Path(__file__).resolve().parent
NARRATION = HERE / "ep01_wage_narration.wav"
CUE, END = _load_cues()


def _arrow(start, end, color, width=7):
    length = np.linalg.norm(np.array(end) - np.array(start))
    if length < 0.06:
        return Dot(start, radius=0.01).set_opacity(0)
    return Arrow(
        start,
        end,
        buff=0,
        color=color,
        stroke_width=width,
        tip_length=0.16,
        max_tip_length_to_length_ratio=0.22,
        max_stroke_width_to_length_ratio=12,
    )


class ComplexWage(Scene):
    def construct(self):
        if NARRATION.exists():
            self.add_sound(str(NARRATION))

        self.title = Text("The complex wage", font_size=40, color=PAPER).to_edge(
            UP, buff=0.32
        )
        self.eq = None
        self.cap = None
        self.add(self.title)

        self.axes = Axes(
            x_range=[-4.2, 4.2, 1],
            y_range=[-2.3, 3.7, 1],
            x_length=11.0,
            y_length=5.15,
            tips=True,
            axis_config={
                "include_ticks": False,
                "color": "#6A6864",
                "stroke_width": 2,
            },
        ).shift(DOWN * 0.62)

        self.theta = ValueTracker(TH)
        self.real_len = ValueTracker(0.0)
        self.imag_len = ValueTracker(0.0)
        self.w_scale = ValueTracker(0.0)
        self.phase = ValueTracker(0.0)
        self.comps = ValueTracker(0.0)
        self.show_arc = ValueTracker(0.0)

        self._build_dynamic()

        self._currencies()
        self._dubois()
        self._scalar_sum()
        self._complex_plane()
        self._quarter_turn()
        self._real_axis()
        self._imag_axis()
        self._right_angle()
        self._polar()
        self._theta_zero()
        self._theta_ninety()
        self._quadrants()
        self._square()
        self._conjugate()
        self._ndim()
        self.until(END)

    def until(self, t):
        gap = t - self.time
        if gap > 1 / config.frame_rate:
            self.wait(gap)

    def banner(self, content, caption, math=True, run_time=0.4):
        if math:
            new_eq = MathTex(content, font_size=46, color=PAPER)
        else:
            new_eq = Text(content, font_size=34, color=PAPER)
        if new_eq.width > 12.6:
            new_eq.scale_to_fit_width(12.6)
        new_eq.next_to(self.title, DOWN, buff=0.16)
        new_cap = Text(caption, font_size=26, color=MUTED)
        if new_cap.width > 12.8:
            new_cap.scale_to_fit_width(12.8)
        new_cap.to_edge(DOWN, buff=0.28)
        anims = [FadeIn(new_eq), FadeIn(new_cap)]
        if self.eq is not None:
            anims.append(FadeOut(self.eq))
        if self.cap is not None:
            anims.append(FadeOut(self.cap))
        self.play(*anims, run_time=run_time)
        self.eq = new_eq
        self.cap = new_cap
        self.bring_to_front(self.title, self.eq, self.cap)

    def _origin(self):
        return self.axes.c2p(0, 0)

    def _pt(self, x, y):
        return self.axes.c2p(x, y)

    def _real_value(self):
        if self.phase.get_value() > 0.5:
            return R * np.cos(self.theta.get_value())
        return self.real_len.get_value()

    def _imag_value(self):
        if self.phase.get_value() > 0.5:
            return R * np.sin(self.theta.get_value())
        return self.imag_len.get_value()

    def _result_end(self):
        # Horizontal is jψs. Vertical is ψm. θ opens clockwise from up toward the right.
        if self.phase.get_value() > 0.5:
            th = self.theta.get_value()
            return (R * np.sin(th), R * np.cos(th))
        s = self.w_scale.get_value()
        return (PS * s, PM * s)

    def _build_dynamic(self):
        axes = self.axes

        def real_arrow():
            y = self._real_value()
            color = RED if y < -0.04 else GOLD
            arr = _arrow(self._origin(), self._pt(0, y), color, width=8)
            arr.set_opacity(self.comps.get_value())
            return arr

        def imag_arrow():
            x = self._imag_value()
            arr = _arrow(self._origin(), self._pt(x, 0), BLUE, width=8)
            arr.set_opacity(self.comps.get_value())
            return arr

        def result_arrow():
            x, y = self._result_end()
            color = RED if y < -0.04 else PAPER
            visible = 1.0 if self.phase.get_value() > 0.5 else self.w_scale.get_value()
            arr = _arrow(self._origin(), self._pt(x, y), color, width=6)
            arr.set_opacity(visible)
            return arr

        def arc():
            th = self.theta.get_value()
            if self.show_arc.get_value() < 0.5 or th < 0.12 or th > PI / 2 + 0.04:
                return Dot(self._origin(), radius=0.01).set_opacity(0)
            return Arc(
                radius=0.72,
                start_angle=PI / 2,
                angle=-th,
                arc_center=self._origin(),
                color=GOLD,
                stroke_width=3,
            )

        def corner():
            x = self._real_value()
            y = self._imag_value()
            if self.comps.get_value() < 0.4 or x < 0.25 or y < 0.25:
                return Dot(self._origin(), radius=0.01).set_opacity(0)
            horiz = Line(self._origin(), self._pt(1, 0))
            vert = Line(self._origin(), self._pt(0, 1))
            mark = RightAngle(horiz, vert, length=0.22, color=PAPER, stroke_width=2)
            mark.set_opacity(self.comps.get_value())
            return mark

        self.real_arrow = always_redraw(real_arrow)
        self.imag_arrow = always_redraw(imag_arrow)
        self.result_arrow = always_redraw(result_arrow)
        self.arc = always_redraw(arc)
        self.corner = always_redraw(corner)

    def _currencies(self):
        self.until(CUE[0] + 0.15)
        self.banner("two currencies", "material concessions, and status", math=False)
        self.card_m = self._card("Material", GOLD).move_to(LEFT * 2.15 + DOWN * 0.35)
        self.card_s = self._card("Status", BLUE).move_to(RIGHT * 2.15 + DOWN * 0.35)
        self.play(FadeIn(self.card_m), FadeIn(self.card_s), run_time=0.6)

    def _card(self, label, color):
        rect = RoundedRectangle(
            width=3.15,
            height=1.15,
            corner_radius=0.08,
            fill_color=color,
            fill_opacity=1,
            stroke_width=0,
        )
        name = Text(label, font_size=32, color=INK)
        return VGroup(rect, name)

    def _dubois(self):
        self.until(CUE[1])
        self.banner(
            "a public and psychological wage",
            "Du Bois, 1935",
            math=False,
        )

    def _scalar_sum(self):
        self.until(CUE[2])
        self.banner(
            r"\psi = \psi_m + \psi_s",
            "the payment collapses to a single size",
        )
        plus = MathTex("+", font_size=60, color=PAPER).move_to(DOWN * 0.35)
        self.play(FadeIn(plus), run_time=0.25)
        self.wait(0.55)
        bar = RoundedRectangle(
            width=4.4,
            height=0.16,
            corner_radius=0.04,
            fill_color=BAR,
            fill_opacity=1,
            stroke_width=0,
        )
        label = Text("one size", font_size=24, color=MUTED).next_to(bar, DOWN, buff=0.18)
        self.one = VGroup(bar, label).move_to(DOWN * 0.35)
        self.play(
            FadeOut(self.card_m),
            FadeOut(self.card_s),
            FadeOut(plus),
            FadeIn(self.one),
            run_time=0.7,
        )

    def _complex_plane(self):
        self.until(CUE[3])
        self.banner(r"W = \psi_m + j\psi_s", "the wage is a complex number")
        x_lab = VGroup(
            MathTex(r"j\psi_s", font_size=32, color=BLUE),
            Text("imaginary", font_size=20, color=BLUE),
        ).arrange(RIGHT, buff=0.1)
        x_lab.next_to(self.axes.x_axis.get_end(), DOWN, buff=0.12)
        y_lab = VGroup(
            MathTex(r"\psi_m", font_size=32, color=GOLD),
            Text("real", font_size=22, color=GOLD),
        ).arrange(RIGHT, buff=0.12)
        y_lab.next_to(self.axes.y_axis.get_end(), RIGHT, buff=0.14)
        self.x_lab = x_lab
        self.y_lab = y_lab
        self.play(FadeOut(self.one), Create(self.axes), run_time=0.9)
        self.play(FadeIn(x_lab), FadeIn(y_lab), run_time=0.35)
        self.add(self.real_arrow, self.imag_arrow, self.result_arrow, self.arc, self.corner)
        self.bring_to_front(self.title, self.eq, self.cap)

    def _quarter_turn(self):
        self.until(CUE[4])
        self.banner(
            "× j    rotates a quarter turn",
            "multiplying by j rotates a quarter turn",
            math=False,
        )
        unit = Arrow(
            self._origin(),
            self._pt(0, 1.05),
            buff=0,
            color=GOLD,
            stroke_width=7,
            tip_length=0.16,
        )
        self.play(GrowArrow(unit), run_time=0.35)
        self.play(Rotate(unit, -PI / 2, about_point=self._origin()), run_time=2.5)
        self.unit = unit

    def _real_axis(self):
        self.until(CUE[5])
        self.play(FadeOut(self.unit), run_time=0.2)
        self.banner(r"\psi_m \quad \text{real power}", "this component performs work")
        chips = VGroup(
            *[Text(word, font_size=20, color=MUTED) for word in ("land", "credit", "wages", "immunity")]
        ).arrange(DOWN, buff=0.16)
        chips.next_to(self._pt(0, PM * 0.78), RIGHT, buff=0.55)
        self.real_chips = chips
        self.play(
            self.comps.animate.set_value(1),
            self.real_len.animate.set_value(PM),
            FadeIn(chips),
            run_time=1.3,
        )

    def _imag_axis(self):
        self.until(CUE[6])
        self.banner(
            r"j\psi_s \quad \text{reactive power}",
            "holds a field. transfers zero wealth",
        )
        chips = VGroup(
            *[Text(word, font_size=20, color=MUTED) for word in ("deference", "titles", "standing")]
        ).arrange(RIGHT, buff=0.28)
        chips.next_to(self._pt(PS * 0.55, 0), DOWN, buff=0.38)
        self.imag_chips = chips
        self.play(self.imag_len.animate.set_value(PS), FadeIn(chips), run_time=1.3)

    def _right_angle(self):
        self.until(CUE[7])
        self.banner("a right angle", "off the material axis", math=False)
        self.play(FadeOut(self.imag_chips), FadeOut(self.real_chips), run_time=0.25)
        self.play(self.w_scale.animate.set_value(1), run_time=1.0)
        w_label = MathTex("W", font_size=34, color=PAPER)
        w_label.add_updater(lambda m: m.next_to(self._pt(*self._result_end()), UP, buff=0.1))
        self.w_label = w_label
        self.add(w_label)
        dot = Dot(self._origin(), radius=0.065, color=PAPER)
        tag = Text("buffer", font_size=22, color=PAPER)
        tag.add_updater(lambda m: m.next_to(dot, RIGHT, buff=0.1))
        self.add(dot, tag)
        self.play(dot.animate.move_to(self._pt(0, PM * 0.62)), run_time=1.15)
        self.play(dot.animate.move_to(self._pt(PS * 0.42, PM * 0.55)), run_time=1.5)
        tag.clear_updaters()
        self.play(FadeOut(dot), FadeOut(tag), run_time=0.3)

    def _polar(self):
        self.until(CUE[8])
        self.banner(
            r"W = R \angle \theta \qquad R = \sqrt{\psi_m^2 + \psi_s^2}",
            "a length, and a phase angle",
        )
        self.play(self.show_arc.animate.set_value(1), run_time=0.4)

    def _theta_zero(self):
        self.until(CUE[9])
        self.banner(r"\theta = 0^\circ", "the wage is entirely material")
        self.phase.set_value(1)
        self.theta.set_value(TH)
        self.play(self.theta.animate.set_value(0.001), run_time=1.5)
        self.play(FadeOut(self.w_label), run_time=0.2)
        self.w_label.clear_updaters()

    def _theta_ninety(self):
        self.until(CUE[10])
        self.banner(r"\theta = 90^\circ", "zero capital. the default")
        self.play(self.theta.animate.set_value(PI / 2), run_time=1.6)

    def _quad_label(self, numeral, line_a, line_b, x, y):
        lines = [
            Text(numeral, font_size=30, color=MUTED),
            Text(line_a, font_size=18, color=MUTED),
        ]
        if line_b:
            lines.append(Text(line_b, font_size=18, color=MUTED))
        label = VGroup(*lines).arrange(DOWN, buff=0.04)
        label.move_to(self._pt(x, y))
        return label

    def _focus_quad(self, index, angle):
        colors = [GOLD, RED, RED, PALE]
        anims = []
        if abs(self.theta.get_value() - angle) > 0.04:
            anims.append(self.theta.animate.set_value(angle))
        for i, label in enumerate(self.quad_labels):
            if i == index:
                anims.append(label.animate.set_color(colors[i]).set_opacity(1))
            else:
                anims.append(label.animate.set_color(MUTED).set_opacity(0.32))
        self.play(*anims, run_time=1.45)

    def _quadrants(self):
        self.until(CUE[11])
        self.banner(
            r"\mathrm{I}\rightarrow\mathrm{II}\rightarrow\mathrm{III}\rightarrow\mathrm{IV}",
            "theta walks the four quadrants",
        )
        self.quad_labels = [
            self._quad_label("I", "cooperative", "benefit", 2.55, 1.95),
            self._quad_label("II", "fascism", "", 2.7, -1.35),
            self._quad_label("III", "collapse", "", -2.7, -1.35),
            self._quad_label("IV", "reparative", "transition", -2.7, 1.85),
        ]
        for label in self.quad_labels:
            label.set_opacity(0.32)
        self.quad_group = VGroup(*self.quad_labels)
        self.play(
            FadeIn(self.quad_group),
            self.show_arc.animate.set_value(0),
            self.theta.animate.set_value(TH),
            run_time=1.3,
        )

        self.until(CUE[12])
        self.banner(r"\mathrm{Quadrant\ I}", "cooperative benefit")
        self._focus_quad(0, TH)

        self.until(CUE[13])
        self.banner(r"\mathrm{Quadrant\ II}", "in this framework, fascism")
        self._focus_quad(1, 2 * PI / 3)

        self.until(CUE[14])
        self.banner(r"\mathrm{Quadrant\ III}", "collapse")
        self._focus_quad(2, 5 * PI / 4)

        self.until(CUE[15])
        self.banner(r"\mathrm{Quadrant\ IV}", "reparative transition")
        self._focus_quad(3, 7 * PI / 4)

    def _square(self):
        self.until(CUE[16])
        self.banner(
            r"(j\psi_s)^2 = -\psi_s^2",
            "compounding symbolic status destroys real wealth",
        )
        forward = PI / 2
        while forward <= self.theta.get_value() + 0.05:
            forward += 2 * PI
        self.play(
            FadeOut(self.quad_group),
            self.theta.animate.set_value(forward),
            run_time=0.8,
        )
        self.theta.set_value(PI / 2)
        self.play(self.comps.animate.set_value(0), run_time=0.25)
        self.play(self.theta.animate.set_value(PI), run_time=3.2)

    def _conjugate(self):
        self.until(CUE[17])
        self.banner(
            r"W + W^\ast = 2\psi_m",
            "the status terms cancel. twice the material wage remains",
        )
        self.play(
            FadeOut(self.real_arrow),
            FadeOut(self.imag_arrow),
            FadeOut(self.result_arrow),
            FadeOut(self.arc),
            FadeOut(self.corner),
            run_time=0.35,
        )
        real = _arrow(self._origin(), self._pt(0, PM), GOLD, width=8)
        plus_axis = _arrow(self._origin(), self._pt(PS, 0), BLUE, width=8)
        minus_axis = _arrow(self._origin(), self._pt(-PS, 0), BLUE, width=8)
        wage = _arrow(self._origin(), self._pt(PS, PM), PAPER, width=6)
        conj = _arrow(self._origin(), self._pt(-PS, PM), PALE, width=6)
        plus_s = MathTex(r"+\psi_s", font_size=28, color=BLUE).next_to(self._pt(PS * 0.7, 0), DOWN, buff=0.16)
        minus_s = MathTex(r"-\psi_s", font_size=28, color=BLUE).next_to(self._pt(-PS * 0.7, 0), DOWN, buff=0.16)
        w_lab = MathTex("W", font_size=32, color=PAPER).next_to(self._pt(PS, PM), UR, buff=0.08)
        ws_lab = MathTex("W^\\ast", font_size=32, color=PALE).next_to(self._pt(-PS, PM), UL, buff=0.08)
        mark = RightAngle(
            Line(self._origin(), self._pt(1, 0)),
            Line(self._origin(), self._pt(0, 1)),
            length=0.22,
            color=PAPER,
            stroke_width=2,
        )
        self.play(
            FadeIn(real),
            FadeIn(plus_axis),
            FadeIn(minus_axis),
            FadeIn(wage),
            FadeIn(conj),
            FadeIn(plus_s),
            FadeIn(minus_s),
            FadeIn(w_lab),
            FadeIn(ws_lab),
            FadeIn(mark),
            run_time=0.7,
        )
        self.wait(1.3)
        doubled = _arrow(self._origin(), self._pt(0, 2 * PM), GOLD, width=8)
        two = MathTex(r"2\psi_m", font_size=34, color=GOLD).next_to(
            self._pt(0, 2 * PM * 0.72), RIGHT, buff=0.16
        )
        self.play(
            FadeOut(plus_axis),
            FadeOut(minus_axis),
            FadeOut(wage),
            FadeOut(conj),
            FadeOut(plus_s),
            FadeOut(minus_s),
            FadeOut(w_lab),
            FadeOut(ws_lab),
            FadeOut(mark),
            ReplacementTransform(real, doubled),
            FadeIn(two),
            run_time=0.9,
        )
        self.solidarity = VGroup(doubled, two)
        self.bring_to_front(self.title, self.eq, self.cap)

    def _ndim(self):
        # Equation E.4. Each axis is the pair (ψm,k + jk ψs,k), scaled by ρk.
        # Bar lengths picture the weight. They are not measurements.
        axes_named = (
            ("1", "race"),
            ("2", "gender"),
            ("3", "ability"),
            ("4", "sexuality"),
            ("5", "neurology"),
            ("6", "physicality"),
        )
        self.until(CUE[18])
        self.banner(
            r"W = \psi_m + j\psi_s",
            "one pair. material, then psychological",
        )

        self.until(CUE[19])
        self.banner(
            r"W = \sum_{k=1}^{N} \rho_k(\psi_{m,k} + j_k\psi_{s,k})",
            "the full complex wage",
        )
        self.play(
            FadeOut(self.solidarity),
            FadeOut(self.axes),
            FadeOut(self.x_lab),
            FadeOut(self.y_lab),
            run_time=0.45,
        )

        header = self._pair_header()
        self.term_rows = []
        self.gold_bars = []
        self.gold_slots = []
        self.blue_bars = []
        self.blue_slots = []
        self.term_rho = []
        for index, name in axes_named:
            row, gold, gold_slot, blue, blue_slot, rho = self._pair_row(index, name)
            self.term_rows.append(row)
            self.gold_bars.append(gold)
            self.gold_slots.append(gold_slot)
            self.blue_bars.append(blue)
            self.blue_slots.append(blue_slot)
            self.term_rho.append(rho)
            row.set_opacity(0)
            rho.set_opacity(0)
        real_sum = MathTex(
            r"\sum_k \rho_k\psi_{m,k}",
            font_size=26,
            color=GOLD,
        )
        real_sum.set_opacity(0)
        self.ledger = VGroup(header, *self.term_rows).arrange(
            DOWN, buff=0.11, aligned_edge=LEFT
        )
        self.ledger.move_to(DOWN * 0.05)
        real_sum.next_to(self.gold_slots[-1], DOWN, buff=0.16, aligned_edge=LEFT)
        self.real_sum = real_sum
        self.add(self.ledger, real_sum)

        self.until(CUE[20])
        self.banner(r"\psi_{m,k}", "material wages add on the real line")
        self.play(
            *[
                part.animate.set_opacity(1)
                for row in self.term_rows
                for part in (row[0], row[2])
            ],
            header.animate.set_opacity(1),
            run_time=0.7,
        )

        self.until(CUE[21])
        self.banner(
            r"j_k\psi_{s,k}",
            "the psychological wage, on its own axis",
        )
        self.play(
            *[row[3].animate.set_opacity(1) for row in self.term_rows],
            run_time=0.6,
        )

        self.until(CUE[22])
        self.banner(
            r"\psi_{s,k}",
            "each psychological wage stays on its own basis",
        )

        self.until(CUE[23])
        self.banner(r"\rho_k", "the weight scales the pair")
        self.play(
            *[rho.animate.set_opacity(1) for rho in self.term_rho],
            run_time=0.45,
        )

        self.until(CUE[24])
        self.banner(
            r"W = \sum_{k=1}^{N} \rho_k(\psi_{m,k} + j_k\psi_{s,k})",
            "schematic weights. the material wages add",
        )
        factors = (1.15, 0.9, 0.72, 0.55, 0.4, 0.8)
        gold_base = 1.85
        blue_base = 1.26
        targets = []
        for gold, gold_slot, blue, blue_slot, factor in zip(
            self.gold_bars,
            self.gold_slots,
            self.blue_bars,
            self.blue_slots,
            factors,
        ):
            gold.generate_target()
            gold.target.stretch_to_fit_width(gold_base * factor)
            gold.target.move_to(gold_slot.get_left(), aligned_edge=LEFT)
            blue.generate_target()
            blue.target.stretch_to_fit_width(blue_base * factor)
            blue.target.move_to(blue_slot.get_left(), aligned_edge=LEFT)
            targets.append(MoveToTarget(gold))
            targets.append(MoveToTarget(blue))
        self.play(*targets, self.real_sum.animate.set_opacity(1), run_time=1.3)
        self.bring_to_front(self.title, self.eq, self.cap)

    def _pair_header(self):
        blank = self._clear_box(1.55, 0.28)
        rho = self._clear_box(0.48, 0.28)
        gold = MathTex(r"\psi_{m,k}", font_size=24, color=GOLD)
        gold_box = self._clear_box(2.15, 0.28)
        gold.move_to(gold_box)
        blue = MathTex(r"\psi_{s,k}", font_size=24, color=BLUE)
        blue_box = self._clear_box(1.55, 0.28)
        blue.move_to(blue_box)
        header = VGroup(
            blank,
            rho,
            VGroup(gold_box, gold),
            VGroup(blue_box, blue),
        ).arrange(RIGHT, buff=0.14)
        header.set_opacity(0)
        return header

    def _clear_box(self, width, height):
        box = Rectangle(width=width, height=height, color="#0B0C0F")
        box.set_fill(opacity=0)
        box.set_stroke(width=0, opacity=0)
        return box

    def _meter(self, width, color, slot_width):
        slot = Rectangle(width=slot_width, height=0.12, color=BAR)
        slot.set_fill(BAR, opacity=1)
        slot.set_stroke(width=0, opacity=0)
        bar = Rectangle(
            width=width,
            height=0.12,
            color=color,
            fill_color=color,
            fill_opacity=1,
            stroke_width=0,
        )
        bar.move_to(slot.get_left(), aligned_edge=LEFT)
        return VGroup(slot, bar), bar, slot

    def _pair_row(self, index, name):
        label = Text(name, font_size=20, color=PALE)
        name_box = self._clear_box(1.55, 0.3)
        label.move_to(name_box)
        rho = MathTex(rf"\rho_{index}", font_size=24, color=PALE)
        rho_box = self._clear_box(0.48, 0.3)
        rho.move_to(rho_box)
        gold_group, gold, gold_slot = self._meter(1.85, GOLD, 2.15)
        blue_group, blue, blue_slot = self._meter(1.26, BLUE, 1.55)
        row = VGroup(
            VGroup(name_box, label),
            VGroup(rho_box, rho),
            gold_group,
            blue_group,
        ).arrange(RIGHT, buff=0.14)
        return row, gold, gold_slot, blue, blue_slot, rho
