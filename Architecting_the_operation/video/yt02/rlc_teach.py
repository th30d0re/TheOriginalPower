"""YT02 SEG 05: RLC teaching sequence (components → circuit → scope → equation)."""

import sys
from pathlib import Path

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from backlash_oscillator16x9 import backlash_axes, partial_curve  # noqa: E402
from common16x9 import DIM, GOLD, INK, M, T, YTScene  # noqa: E402
from layout_v2 import assert_no_overlap, clamp_above_caption  # noqa: E402
from rlc_topology16x9 import COMPONENT_LABELS, part_glow, institutional_label  # noqa: E402

RLC_SVG = COMMON.parent / "figures/circuits/rlc_series.svg"
CIRCUIT_WIDTH = 11.5


def load_rlc_circuit():
    circuit = m.SVGMobject(str(RLC_SVG))
    circuit.scale_to_fit_width(CIRCUIT_WIDTH)
    circuit.move_to(m.DOWN * 0.2)
    parts = {
        "wires": circuit.submobjects[0],
        "V": m.VGroup(circuit.submobjects[1], circuit.submobjects[2]),
        "R": circuit.submobjects[3],
        "L": circuit.submobjects[4],
        "C": circuit.submobjects[5],
    }
    return circuit, parts

EQ211 = r"L\frac{d^2 q}{dt^2} + R\frac{dq}{dt} + \frac{1}{C}q = F_{\mathrm{shock}}(t)"


class RLCTeach(YTScene):
    SHOT = "S05-24"

    def _scope_panel(self):
        ax, base, eq_lab, tlab, ylab, _, _ = backlash_axes()
        panel = m.RoundedRectangle(
            width=5.2,
            height=3.1,
            corner_radius=0.1,
            stroke_color=DIM,
            stroke_width=2,
            fill_color="#16264A",
            fill_opacity=0.92,
        ).move_to([4.55, -0.35, 0])
        plot = m.VGroup(ax, base, eq_lab, tlab, ylab).scale(0.42).move_to(panel)
        t_end = m.ValueTracker(0.05)
        curve = m.always_redraw(lambda: partial_curve(ax, t_end.get_value()))
        scope_head = T("DAMPED RESPONSE", 24, GOLD).next_to(panel, m.UP, buff=0.08)
        return panel, plot, curve, t_end, scope_head

    def shot_S05_24(self):
        head = T("SERIES RLC · MAINTENANCE LAYER", 40, GOLD).to_edge(m.UP, buff=0.42)
        circuit, parts = load_rlc_circuit()
        circuit.scale(0.72).move_to([-2.2, 0.15, 0])
        panel, plot, curve, t_end, scope_head = self._scope_panel()
        panel.set_opacity(0)
        plot.set_opacity(0)
        curve.set_opacity(0)
        scope_head.set_opacity(0)

        eq = m.MathTex(
            EQ211,
            font_size=36,
            color=INK,
            substrings_to_isolate=["L", "R", "C"],
        )
        eq.move_to([0.0, -2.12, 0])
        eq.set_opacity(0)

        glow = side = None
        self.camera.background_color = "#0F1B33"
        self.add(head, circuit, panel, plot, curve, scope_head, eq)

        for cue, key in (("inertia", "L"), ("resistance", "R"), ("capacitance", "C")):
            self.until(self.at(0, cue))
            fade = []
            if glow is not None:
                fade = [m.FadeOut(glow, side)]
            glow = part_glow(parts[key], color=COMPONENT_LABELS[key][1])
            side = institutional_label(key, parts[key], circuit)
            clamp_above_caption(side)
            self.play(*fade, m.Create(glow), m.FadeIn(side), run_time=0.45)
            assert_no_overlap(self)

        self.until(self.at(0, "differential"))
        self.play(m.FadeOut(glow, side), m.Create(circuit), run_time=0.85)
        self.until(self.at(0, "dynamic"))
        self.play(
            panel.animate.set_opacity(1),
            plot.animate.set_opacity(1),
            curve.animate.set_opacity(1),
            scope_head.animate.set_opacity(1),
            t_end.animate.set_value(6.5),
            run_time=1.15,
        )
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)

        self.until(self.at(1, "requirements"))
        self.play(eq.animate.set_opacity(1), run_time=0.35)
        for term, cue in (("L", "mathematical"), ("R", "institutional"), ("C", "state")):
            self.until(self.at(1, cue))
            self.play(m.Indicate(eq.get_part_by_tex(term), color=COMPONENT_LABELS[term][1]), run_time=0.42)
        clamp_above_caption(eq)
        assert_no_overlap(self)
        self.until(self.beat_end(1) - 0.2)
