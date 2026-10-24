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
from layout_v2 import clamp_above_caption  # noqa: E402
from rlc_topology16x9 import COMPONENT_LABELS, part_glow  # noqa: E402

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
    # The source SVG carries a trailing punctuation path after the circuit.
    # Retain only the wire and component paths used by the diagram.
    circuit.submobjects = circuit.submobjects[:6]
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
        ).move_to([3.85, 0.0, 0])
        plot = m.VGroup(ax, base, ylab).scale(0.34).move_to(panel.get_center() + m.DOWN * 0.12)
        t_end = m.ValueTracker(0.05)
        curve = m.always_redraw(lambda: partial_curve(ax, t_end.get_value()))
        scope_head = T("DAMPED RESPONSE", 24, GOLD).next_to(panel, m.UP, buff=0.12)
        return panel, plot, curve, t_end, scope_head

    def shot_S05_24(self):
        head = T("SERIES RLC · MAINTENANCE LAYER", 40, GOLD).to_edge(m.UP, buff=0.42)
        circuit, parts = load_rlc_circuit()
        circuit.scale(0.45).move_to([-3.45, 0.15, 0])
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
        eq.move_to([0.0, -2.42, 0])
        eq.set_opacity(0)

        glow = side = None
        self.camera.background_color = "#0F1B33"
        # The trace is always_redraw, which ignores set_opacity; it joins the scene with its panel.
        self.add(head, circuit, panel, plot, scope_head, eq)

        for cue, key in (("inertia", "L"), ("resistance", "R"), ("capacitance", "C")):
            self.until(self.at(0, cue))
            fade = []
            if glow is not None:
                fade = [m.FadeOut(glow, side)]
            glow = part_glow(parts[key], color=COMPONENT_LABELS[key][1])
            label_text, label_color = COMPONENT_LABELS[key]
            side = T(label_text, 23, label_color, width=4.9)
            side.next_to(parts[key], m.UP, buff=0.32)
            if side.get_left()[0] < -6.5:
                side.shift(m.RIGHT * (-6.5 - side.get_left()[0]))
            clamp_above_caption(side)
            self.play(*fade, m.Create(glow), m.FadeIn(side), run_time=0.45)

        self.until(self.at(0, "differential"))
        self.play(m.FadeOut(glow, side), m.Create(circuit), run_time=0.85)
        self.until(self.at(0, "dynamic"))
        self.add(curve)
        self.play(
            panel.animate.set_opacity(1),
            plot.animate.set_opacity(1),
            curve.animate.set_opacity(1),
            scope_head.animate.set_opacity(1),
            t_end.animate.set_value(6.5),
            run_time=1.15,
        )
        self.until(self.beat_end(0) - 0.2)

        # S05-25: the reform shock rings the circuit; the scope trace replays its damped response.
        self.until(self.at(1, "shock"))
        self.play(t_end.animate.set_value(0.05), run_time=0.3)
        self.play(t_end.animate.set_value(6.5), m.Indicate(scope_head, color=GOLD), run_time=1.6)
        self.until(self.at(1, "damped"))
        self.play(m.Indicate(curve, color=GOLD), run_time=0.6)

        # S05-26: the checklist closes on the equation, term by term.
        self.until(self.at(2, "requirements"))
        self.play(eq.animate.set_opacity(1), run_time=0.35)
        for term, cue in (("L", "mathematical"), ("R", "institutional"), ("C", "state")):
            self.until(self.at(2, cue))
            self.play(m.Indicate(eq.get_part_by_tex(term), color=COMPONENT_LABELS[term][1]), run_time=0.42)
        clamp_above_caption(eq)
        self.until(self.beat_end(2) - 0.2)
