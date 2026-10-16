"""S13-01 series RLC mapping; S13-06 Figure 2.5 element highlights."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YT, YTScene  # noqa: E402

SVG_PATH = YT / "figures/circuits/rlc_series.svg"
TIKZ_WIDTH = 7.2
CIRCUIT_WIDTH = 11.5

COMPONENT_LABELS = {
    "R": ("R · bureaucratic and carceral friction", HER),
    "L": ("L · cultural inertia and institutional entrenchment", OK),
    "C": ("C · token-reform absorption capacity", INK),
    "V": ("V(t) · kinetic supply", GOLD),
}


def load_rlc_circuit():
    """Book circuitikz SVG scaled to frame width; submobjects 1–2 source, 3 R, 4 L, 5 C, 0 wires."""
    circuit = m.SVGMobject(str(SVG_PATH))
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


def part_glow(part, color=GOLD):
    return m.SurroundingRectangle(
        part,
        color=color,
        buff=0.1,
        stroke_width=5,
        fill_color=color,
        fill_opacity=0.12,
        corner_radius=0.06,
    )


def institutional_label(key, part, circuit=None):
    text, color = COMPONENT_LABELS[key]
    lab = T(text, 34, color, width=5.8)
    if key == "V":
        lab.next_to(part, m.DOWN, buff=0.42)
        if circuit is not None and lab.get_left()[0] < -6.5:
            lab.next_to(circuit, m.DOWN, buff=0.35)
    else:
        lab.next_to(part, m.UP, buff=0.38)
    return lab


class RLCTopology(YTScene):
    SHOT = "S13-01"

    def shot_S13_01(self):
        head = T("SERIES RLC TOPOLOGY", 44, GOLD).to_edge(m.UP, buff=0.48)
        map_lab = T("EXTRACTION SYSTEM → SERIES RLC", 34, DIM, "NORMAL", width=11.0).next_to(
            head, m.DOWN, buff=0.2
        )
        circuit, parts = load_rlc_circuit()
        supply = institutional_label("V", parts["V"], circuit)
        self.add(head, map_lab)
        self.until(self.at(0, "maps"))
        self.play(m.Create(circuit), run_time=1.1)
        self.play(m.FadeIn(supply), run_time=0.45)
        self.until(self.at(0, "backlash"))
        pulse = part_glow(parts["V"])
        self.play(m.Create(pulse), run_time=0.55)
        self.until(self.beat_end(0) - 0.3)

    def shot_S13_06(self):
        card = self.card()
        head = T(card["headline"].upper(), 44, GOLD, width=12.0).to_edge(m.UP, buff=0.48)
        circuit, parts = load_rlc_circuit()
        self.add(head)
        self.until(self.at(0, "Figure"))
        self.until(self.at(0, "topology"))
        self.play(m.Create(circuit), run_time=1.0)
        self.until(self.beat_end(0) - 0.2)
        side_label = None
        glow = None
        for k, cue, key in ((1, "resistor", "R"), (2, "inductor", "L"), (3, "capacitor", "C")):
            self.until(self.at(k, cue))
            if glow is not None:
                self.play(m.FadeOut(glow), run_time=0.2)
            if side_label is not None:
                self.play(m.FadeOut(side_label), run_time=0.2)
            glow = part_glow(parts[key], color=COMPONENT_LABELS[key][1])
            side_label = institutional_label(key, parts[key])
            self.play(m.Create(glow), m.FadeIn(side_label), run_time=0.5)
            self.until(self.beat_end(k) - 0.25)
