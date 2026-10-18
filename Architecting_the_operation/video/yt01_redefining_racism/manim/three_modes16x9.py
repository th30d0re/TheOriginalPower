"""SEG 21 three modes of operation: design, propagation, intervention."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, NAVY2, OK, T, YTScene  # noqa: E402

MODES = (
    ("MODE 1", "INTENTIONAL DESIGN", "Virus is written", GOLD),
    ("MODE 2", "AUTONOMOUS PROPAGATION", "Virus replicates", OK),
    ("MODE 3", "CONSCIOUS INTERVENTION", "Update server", HER),
)

EXAMPLES = (
    "THREE MODES ACROSS RUNTIME",
    "INTENTIONAL DESIGN · WRITTEN VIRUS",
    "AUTONOMOUS PROPAGATION · REPLICATES",
    "SCHOOLS · MARKETS · COURTS · NORMS",
    "COLORISM · SELF-EXECUTING CODE",
    "CONSCIOUS INTERVENTION · PATCHES",
    "SUPER TUESDAY 2020 · 48 HOURS",
    "CRITICAL JUNCTURES · COORDINATED REPAIR",
    "APPEARS NATURAL · NO ONE'S FAULT",
    "ORDINARY PROFESSIONALS · LOCAL INCENTIVES",
    "GRADIENT · NO COMPLETE MAP",
    "MODE 2 · DECENTRALIZED RUNTIME",
)


class ThreeModes(YTScene):
    SOURCE = "Source: The Original Power, §2.3.11 Conspiracy or Emergence"

    def _lanes(self):
        lanes = m.VGroup()
        for i, (num, name, tag, col) in enumerate(MODES):
            box = m.RoundedRectangle(
                width=4.0,
                height=5.6,
                corner_radius=0.14,
                stroke_color=col,
                stroke_width=3,
                fill_color=NAVY2,
                fill_opacity=0.88,
            )
            labels = m.VGroup(
                T(num, 34, col),
                T(name, 30, INK, width=3.6),
                T(tag, 28, DIM, width=3.6),
            ).arrange(m.DOWN, buff=0.28)
            labels.move_to(box)
            lanes.add(m.VGroup(box, labels))
        lanes.arrange(m.RIGHT, buff=0.38).move_to([0, 0.35, 0])
        head = T("THREE MODES · HIERARCHICAL", 44, GOLD).to_edge(m.UP, buff=0.55)
        example = T(EXAMPLES[0], 34, INK, width=12.5).to_edge(m.DOWN, buff=0.48)
        return head, lanes, example

    def _focus(self, lanes, idx):
        anims = []
        cols = [GOLD, OK, HER]
        for i, lane in enumerate(lanes):
            w = 7 if i == idx else 3
            op = 1.0 if i == idx else 0.45
            anims.append(lane[0].animate.set_stroke(cols[i], w).set_fill(opacity=0.88 if i == idx else 0.55))
            anims.append(lane[1].animate.set_opacity(op))
        return anims

    def shot_S14_11(self):
        head, lanes, example = self._lanes()
        self.add(head, lanes, example)
        self.until(self.at(0, "Mode"))
        labels = T("DESIGN      →      PROPAGATION      →      INTERVENTION", 31, GOLD, width=12.0).move_to(example)
        self.play(m.Transform(example, labels), m.LaggedStart(*[m.Indicate(l) for l in lanes], lag_ratio=0.2), run_time=0.85)

        self.until(self.at(1, "case"))
        handoff = m.Arrow(lanes[0].get_right(), lanes[1].get_left(), color=GOLD, stroke_width=6)
        note = T("INHERITED INSTITUTIONAL FIRMWARE · CASE-BY-CASE MODE", 30, INK, width=11.5).move_to(example)
        self.play(*self._focus(lanes, 1), m.GrowArrow(handoff), m.Transform(example, note), run_time=0.7)
        self.until(self.beat_end(1) - 0.2)

    def shot_S21_01(self):
        head, lanes, example = self._lanes()
        self.add(head, lanes, example)
        self.until(self.at(0, "conspiracy"))

        self.until(self.at(1, "Mode"))
        ex1 = T(EXAMPLES[1], 34, GOLD, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 0), m.Transform(example, ex1), run_time=0.55)

        self.until(self.at(2, "Mode"))
        ex2 = T(EXAMPLES[2], 34, OK, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 1), m.Transform(example, ex2), run_time=0.55)

        self.until(self.at(3, "runtime"))
        ex3 = T(EXAMPLES[3], 34, OK, width=12.5).move_to(example)
        self.play(m.Transform(example, ex3), run_time=0.45)

        self.until(self.at(4, "colorism"))
        ex4 = T(EXAMPLES[4], 34, HER, width=12.5).move_to(example)
        self.play(m.Transform(example, ex4), lanes[1][0].animate.set_stroke(HER, 6), run_time=0.5)

        self.until(self.at(5, "Mode"))
        ex5 = T(EXAMPLES[5], 34, HER, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 2), m.Transform(example, ex5), run_time=0.55)

        self.until(self.at(6, "Tuesday"))
        ex6 = T(EXAMPLES[6], 34, HER, width=12.5).move_to(example)
        self.play(m.Transform(example, ex6), run_time=0.45)

        self.until(self.at(7, "junctures"))
        ex7 = T(EXAMPLES[7], 34, GOLD, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 2), m.Transform(example, ex7), run_time=0.45)

        self.until(self.at(8, "natural"))
        ex8 = T(EXAMPLES[8], 34, OK, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 1), m.Transform(example, ex8), run_time=0.55)

        self.until(self.at(9, "professionals"))
        ex9 = T(EXAMPLES[9], 34, INK, width=12.5).move_to(example)
        self.play(m.Transform(example, ex9), run_time=0.45)

        self.until(self.at(10, "malice"))
        ex10 = T(EXAMPLES[10], 34, DIM, width=12.5).move_to(example)
        self.play(m.Transform(example, ex10), run_time=0.45)

        self.until(self.at(11, "conspiracy"))
        ex11 = T(EXAMPLES[11], 34, OK, width=12.5).move_to(example)
        self.play(*self._focus(lanes, 1), m.Transform(example, ex11), run_time=0.55)
        self.until(self.beat_end(11) - 0.2)
