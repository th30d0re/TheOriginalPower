"""S13-01 series RLC mapping; S13-06 Figure 2.5 element highlights."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def tier_row():
    labels = ("Elite", "Puppet Class", "Enforcement Class", "Buffer Class", "Out-group")
    colors = (GOLD, INK, OK, INK, HER)
    boxes = m.VGroup(*[
        m.VGroup(
            m.RoundedRectangle(width=2.1, height=0.5, corner_radius=0.08, stroke_color=c, stroke_width=2,
                               fill_color=NAVY2, fill_opacity=1),
            T(lab, 28, c, width=1.9).move_to([0, 0, 0]),
        ) for lab, c in zip(labels, colors)
    ])
    for g in boxes:
        g[1].move_to(g[0])
    boxes.arrange(m.DOWN, buff=0.1, aligned_edge=m.LEFT).shift(m.LEFT * 5.85 + m.UP * 0.15)
    return boxes


def rlc_loop(fig25=False):
    """Series V — R — L — C loop across the frame (circuitikz topology)."""
    y_top = 0.55
    x0, x1, x2, x3, x4 = -4.8, -2.0, 0.8, 3.6, 5.2
    wire_top = m.Line([x0, y_top, 0], [x4, y_top, 0], color=DIM, stroke_width=4)
    wire_r = m.Line([x4, y_top, 0], [x4, -1.85, 0], color=DIM, stroke_width=4)
    wire_bot = m.Line([x4, -1.85, 0], [x0, -1.85, 0], color=DIM, stroke_width=4)
    wire_l = m.Line([x0, -1.85, 0], [x0, y_top, 0], color=DIM, stroke_width=4)

    r = m.Rectangle(width=0.75, height=0.55, stroke_color=INK, stroke_width=4).move_to([x1, y_top, 0])
    r_zig = m.VGroup(*[
        m.Line(r.get_corner(m.DL) + m.RIGHT * i * 0.14 + m.UP * (i % 2) * 0.14,
             r.get_corner(m.DL) + m.RIGHT * (i + 1) * 0.14 + m.UP * ((i + 1) % 2) * 0.14,
             color=INK, stroke_width=3) for i in range(5)
    ])
    r_zig.move_to(r)
    r_sym = T("R", 40, INK).next_to(r, m.UP, buff=0.12)
    r_g = m.VGroup(r, r_zig, r_sym)

    coils = m.VGroup(*[
        m.Arc(radius=0.16, angle=m.PI, stroke_color=INK, stroke_width=3).shift(m.RIGHT * i * 0.28)
        for i in range(7)
    ])
    coils.move_to([x2, y_top, 0])
    l_sym = T("L", 40, INK).next_to(coils, m.UP, buff=0.12)
    l_g = m.VGroup(coils, l_sym)

    cap = m.VGroup(
        m.Line([-0.28, 0, 0], [0.28, 0, 0], color=INK, stroke_width=5),
        m.Line([-0.28, 0.22, 0], [0.28, 0.22, 0], color=INK, stroke_width=5),
    )
    cap.move_to([x3, y_top, 0])
    c_sym = T("C", 40, INK).next_to(cap, m.UP, buff=0.12)
    c_g = m.VGroup(cap, c_sym)

    bat = m.VGroup(
        m.Line([0, -0.45, 0], [0, 0.45, 0], color=GOLD, stroke_width=6),
        m.Line([-0.18, -0.28, 0], [0.18, -0.28, 0], color=GOLD, stroke_width=6),
    )
    bat.move_to([x0, -0.55, 0])
    v_sym = M(r"V(t)", 44, GOLD).next_to(bat, m.LEFT, buff=0.35)
    v_g = m.VGroup(bat, v_sym)

    wires = m.VGroup(wire_top, wire_r, wire_bot, wire_l)
    loop = m.VGroup(wires, r_g, l_g, c_g, v_g).shift(m.RIGHT * 0.55 + m.DOWN * 0.35)

    inst = {}
    if fig25:
        inst["R"] = T("BUREAUCRATIC +\nCARCERAL FRICTION", 34, HER, width=3.4).next_to(r_sym, m.UP, buff=0.55)
        inst["L"] = T("CULTURAL INERTIA +\nINSTITUTIONAL ENTRENCHMENT", 34, OK, width=3.6).next_to(l_sym, m.UP, buff=0.55)
        inst["C"] = T("TOKEN-REFORM\nABSORPTION CAPACITY", 34, INK, width=3.2).next_to(c_sym, m.UP, buff=0.55)

    return loop, {"R": r_g, "L": l_g, "C": c_g, "V": v_g, "r": r, "l": coils, "c": cap}, inst


class RLCTopology(YTScene):
    SHOT = "S13-01"

    def shot_S13_01(self):
        head = T("SERIES RLC TOPOLOGY", 44, GOLD).to_edge(m.UP, buff=0.5)
        tiers = tier_row()
        loop, _, _ = rlc_loop()
        supply = T("KINETIC SUPPLY", 34, GOLD, "NORMAL").next_to(loop[-1][0], m.DOWN, buff=0.55)
        self.add(head)
        self.play(m.FadeIn(tiers), run_time=0.7)
        self.until(self.at(0, "maps"))
        self.play(m.FadeIn(loop), m.FadeIn(supply), run_time=0.9)
        self.until(self.at(0, "backlash"))
        wire = m.CurvedArrow(tiers.get_right(), loop.get_left() + m.LEFT * 0.15, angle=-0.35, color=DIM, stroke_width=5)
        self.play(m.GrowArrow(wire), run_time=0.6)
        self.until(self.beat_end(0) - 0.3)

    def shot_S13_06(self):
        card = self.card()
        head = T(card["headline"].upper(), 44, GOLD, width=12.0).to_edge(m.UP, buff=0.48)
        loop, parts, inst = rlc_loop(fig25=True)
        self.add(head, loop)
        self.until(self.at(0, "Figure"))
        self.until(self.at(0, "topology"))
        side_label = None
        for k, cue in ((1, "resistor"), (2, "inductor"), (3, "capacitor")):
            self.until(self.at(k, cue))
            key = "R" if k == 1 else "L" if k == 2 else "C"
            body = parts[key][0] if key == "R" else parts[key][0]
            self.play(body.animate.set_stroke(GOLD, 8), run_time=0.45)
            lab = inst[key]
            if side_label:
                self.play(m.FadeOut(side_label), run_time=0.2)
            side_label = lab
            self.play(m.FadeIn(lab), run_time=0.45)
            self.until(self.beat_end(k) - 0.25)
            self.play(body.animate.set_stroke(INK, 4), run_time=0.25)
