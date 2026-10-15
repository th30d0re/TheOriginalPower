"""SEG 22 chapter close: equation rail recap."""

import json
import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, INK, M, T, YT, YTScene  # noqa: E402

RAIL = [
    ("2.1", "S03-02.json"),
    ("2.5", "S05-02.json"),
    ("2.6", "S05-09.json"),
    ("2.8", "S08-17.json"),
    ("2.10", "S12-12.json"),
    ("2.12", "S13-10.json"),
    ("2.13", "S14-01.json"),
    ("2.16", "S16-18.json"),
    ("2.19", "S17-52.json"),
]


def latex(card):
    return json.loads((YT / "cards" / card).read_text())["latex"]


def fit_eq(tex, width=10.8, size=54):
    mob = M(tex, size, INK)
    if mob.width > width:
        mob.scale_to_fit_width(width)
    return mob


class EqRecapClose(YTScene):
    SOURCE = "Source: The Original Power, Chapter 2 close"

    def shot_S22_02(self):
        head = T("CHAPTER 2 · EQUATION MAP", 44, GOLD).to_edge(m.UP, buff=0.55)
        labels = m.VGroup(*[T(f"Eq {n}", 30, DIM) for n, _ in RAIL])
        labels.arrange(m.DOWN, buff=0.22, aligned_edge=m.LEFT).to_edge(m.LEFT, buff=0.75).shift(m.DOWN * 0.15)
        panel = m.RoundedRectangle(
            width=9.6,
            height=4.6,
            corner_radius=0.14,
            stroke_color=DIM,
            stroke_width=2,
            fill_color="#16264A",
            fill_opacity=0.9,
        ).move_to([2.55, 0.05, 0])
        eq = fit_eq(latex(RAIL[0][1])).move_to(panel)
        self.add(head, labels, panel, eq)

        def highlight(i):
            for j, lbl in enumerate(labels):
                lbl.set_color(GOLD if j == i else DIM)

        def swap(card):
            nonlocal eq
            new = fit_eq(latex(card)).move_to(panel)
            self.play(m.Transform(eq, new), run_time=0.45)

        self.until(self.at(0, "Equations"))
        highlight(1)
        swap(RAIL[1][1])
        self.until(self.at(0, "reversed"))
        highlight(2)
        swap(RAIL[2][1])

        self.until(self.at(1, "threshold"))
        highlight(3)
        swap(RAIL[3][1])

        self.until(self.at(2, "Interface"))
        highlight(4)
        swap(RAIL[4][1])

        self.until(self.at(3, "through"))
        highlight(6)
        swap(RAIL[6][1])
        extras = m.VGroup()
        sub = fit_eq(latex("S14-05.json"), size=38).move_to(panel.get_bottom() + m.UP * 0.65)
        extras.add(sub)
        self.play(m.FadeIn(sub), run_time=0.3)

        self.until(self.at(4, "backlash"))
        self.play(m.FadeOut(extras), run_time=0.2)
        highlight(5)
        swap(RAIL[5][1])

        self.until(self.at(5, "through"))
        highlight(7)
        swap(RAIL[7][1])
        sub2 = fit_eq(latex("S16-37.json"), size=38).move_to(panel.get_bottom() + m.UP * 0.65)
        extras = m.VGroup(sub2)
        self.play(m.FadeIn(sub2), run_time=0.3)

        self.until(self.at(6, "phase"))
        self.play(m.FadeOut(extras), run_time=0.2)
        highlight(8)
        swap(RAIL[8][1])

        self.until(self.at(7, "delta"))
        badge = M(r"\Delta\max = 0", 58, GOLD).to_edge(m.DOWN, buff=0.42)
        note = T("CENTURY DATASET", 34, DIM).next_to(badge, m.RIGHT, buff=0.35)
        self.play(m.FadeIn(badge), m.FadeIn(note), run_time=0.4)
        self.until(self.beat_end(7) - 0.2)
