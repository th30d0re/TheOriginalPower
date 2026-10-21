"""V2 cue-aligned set operations illustration for the set theory narration."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "yt01_redefining_racism" / "manim"))
from common16x9 import GOLD, HER, HIM, INK, M, NAVY2, T, YTScene  # noqa: E402


class SetOperationsV2(YTScene):
    """Show the set terms as they are spoken across turns S06-08 to S06-11."""

    def shot_S06_08(self):
        head = T("FOUR SET OPERATIONS", 38, GOLD).to_edge(m.UP, buff=0.45)
        universe = m.Rectangle(width=11.8, height=4.7, stroke_color=INK, stroke_width=3,
                               fill_color=NAVY2, fill_opacity=0.12).move_to([0, -0.45, 0])
        a = m.Circle(radius=1.45, stroke_color=HIM, stroke_width=4,
                     fill_color=HIM, fill_opacity=0.24).move_to([-1.05, -0.4, 0])
        b = m.Circle(radius=1.45, stroke_color=HER, stroke_width=4,
                     fill_color=HER, fill_opacity=0.24).move_to([1.05, -0.4, 0])
        labels = m.VGroup(M(r"A", 42, HIM).move_to(a), M(r"B", 42, HER).move_to(b))
        self.add(head, universe)
        self.until(self.at(0, "operations"))
        self.play(m.Create(a), m.Create(b), m.FadeIn(labels), run_time=0.7)

        self.until(self.at(1, "subset"))
        subset = m.Circle(radius=0.6, stroke_color=GOLD, stroke_width=4,
                          fill_color=GOLD, fill_opacity=0.35).move_to(a.get_center())
        subset_label = M(r"A\subset U", 38, GOLD).to_edge(m.DOWN, buff=0.45)
        self.play(m.Create(subset), m.FadeIn(subset_label), run_time=0.55)
        self.until(self.beat_end(1) - 0.2)
        self.play(m.FadeOut(subset), m.FadeOut(subset_label), run_time=0.2)

        self.until(self.at(2, "union"))
        union_label = M(r"A\cup B", 42, GOLD).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(union_label), a.animate.set_fill(opacity=0.42),
                  b.animate.set_fill(opacity=0.42), run_time=0.5)
        self.until(self.beat_end(2) - 0.2)
        self.play(m.FadeOut(union_label), run_time=0.2)

        self.until(self.at(3, "intersection"))
        overlap = m.Intersection(a, b, color=GOLD, fill_opacity=0.8,
                                 stroke_color=GOLD, stroke_width=3)
        inter_label = M(r"A\cap B", 42, GOLD).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(overlap), m.FadeIn(inter_label), run_time=0.5)
        self.until(self.beat_end(3) - 0.2)
