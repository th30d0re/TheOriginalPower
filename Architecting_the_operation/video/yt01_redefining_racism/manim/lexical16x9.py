"""SEG 18 lexical fractal: partition vocabulary in technical domains."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, INK, NAVY2, T, YTScene  # noqa: E402

TERMS = ("DATABASE", "SERIAL BUS", "CLOCK", "BUILD NODE", "HYDRAULIC", "FLIP-FLOP")


class LexicalFractal(YTScene):
    SOURCE = "Source: The Original Power, §2.3.8 Lexical Fractal"

    def shot_S18_01(self):
        head = T("LEXICAL FRACTAL", 44, GOLD).to_edge(m.UP, buff=0.6)
        kernel = m.RoundedRectangle(width=3.6, height=0.85, corner_radius=0.12, stroke_color=GOLD, stroke_width=3,
                                    fill_color=NAVY2, fill_opacity=1).move_to([-4.0, 0.6, 0])
        kl = T("EXTRACTION KERNEL", 26, GOLD).next_to(kernel, m.DOWN, buff=0.2)
        vocab = T("TECHNICAL VOCABULARY", 28, INK).move_to([2.4, 2.2, 0])
        nodes = m.VGroup(*[T(t, 24, DIM) for t in TERMS])
        nodes.arrange_in_grid(2, 3, buff=(0.6, 0.45)).move_to([2.2, -0.35, 0])
        self.add(head, kernel, kl, vocab, nodes)
        self.until(self.at(0, "vocabulary"))
        self.until(self.at(1, "institutions"))
        self.until(self.at(2, "colonizes"))

        self.until(self.at(3, "subconscious"))
        mode = T("MODE 2 · AUTONOMOUS PROPAGATION", 32, GOLD).to_edge(m.DOWN, buff=0.55)
        self.play(m.FadeIn(mode), run_time=0.5)
        self.until(self.at(4, "centralized"))
        self.until(self.at(5, "gradient"))
        self.until(self.at(6, "pipelines"))

        self.until(self.at(7, "sixth"))
        row = T("SIXTH SCALE · INSTITUTIONAL PUBLICATION", 28, INK).next_to(mode, m.UP, buff=0.35)
        self.play(m.FadeIn(row), run_time=0.4)
        self.until(self.beat_end(7) - 0.2)
