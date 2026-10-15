"""S01-28: Tri-Modal Enclosure specialization to O_racialized."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, TEAL, T, YTScene  # noqa: E402


def mode_box(label, color):
    r = m.RoundedRectangle(width=3.2, height=0.95, corner_radius=0.1, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(label, 24, color, width=2.8).move_to(r)
    return m.VGroup(r, t)


class EnclosureSpecialization(YTScene):
    SHOT = "S01-28"
    SOURCE = "Source: The Original Power, Ch. 2 · Tri-Modal Enclosure"

    def shot_S01_28(self):
        frame = m.RoundedRectangle(width=10.5, height=4.2, corner_radius=0.15, stroke_color=TEAL, stroke_width=3,
                                   fill_color=NAVY2, fill_opacity=0.35)
        frame.move_to([0, 0.55, 0])
        title = T("TRI-MODAL ENCLOSURE", 32, TEAL).to_edge(m.UP, buff=0.5)
        o_gen = M(r"O", 72, INK).move_to([-2.2, 0.55, 0])
        o_race = M(r"O_{\text{racialized}}", 58, HER).move_to([2.2, 0.55, 0])
        arrow = m.Arrow(o_gen.get_right(), o_race.get_left(), buff=0.2, color=GOLD, stroke_width=6)
        gloss = T("GENERAL OUT-GROUP", 24, DIM, "NORMAL").next_to(o_gen, m.DOWN, buff=0.35)
        self.add(title, frame, o_gen, gloss)
        self.until(self.at(0, "racialized"))
        self.play(m.GrowArrow(arrow), m.FadeIn(o_race), run_time=0.9)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "historically"))
        modes = m.VGroup(mode_box("PHYSICAL", HER), mode_box("ECONOMIC", GOLD), mode_box("IDEOLOGICAL", TEAL))
        modes.arrange(m.RIGHT, buff=0.3).move_to([0, -1.55, 0])
        load = T("RACIAL MECHANISMS PER MODE", 24, DIM, "NORMAL").to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(modes), m.FadeIn(load), run_time=0.9)
        self.until(self.beat_end(1) - 0.3)
