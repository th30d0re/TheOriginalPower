"""S03-31: recursive local partition X = X^+_α ⊔ X^-_α."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HIM, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

AXES = ["RACE", "CLASS", "GENDER", "IMMIGRATION", "CRIMINALIZED", "GEOGRAPHY", "CREDENTIALING", "POWER"]


class RecursivePartition(YTScene):
    SHOT = "S03-31"
    SOURCE = "Source: The Original Power, Eq. recursive-local-partition"

    def _local_split(self):
        outer = m.RoundedRectangle(width=5.5, height=3.8, corner_radius=0.12, stroke_color=DIM, stroke_width=3,
                                   fill_color=NAVY2, fill_opacity=0.3)
        plus = m.RoundedRectangle(width=2.3, height=3.2, corner_radius=0.1, stroke_color=HIM, stroke_width=3,
                                  fill_color=NAVY2, fill_opacity=0.5)
        minus = m.RoundedRectangle(width=2.3, height=3.2, corner_radius=0.1, stroke_color=HER, stroke_width=3,
                                   fill_color=NAVY2, fill_opacity=0.5)
        split = m.VGroup(plus, minus).arrange(m.RIGHT, buff=0.2).move_to(outer)
        plab = M(r"X^{+}_{\alpha}", 36, HIM).move_to(plus)
        mlab = M(r"X^{-}_{\alpha}", 36, HER).move_to(minus)
        xlab = M(r"X", 44, INK).next_to(outer, m.UP, buff=0.15)
        return m.VGroup(outer, split, plab, mlab, xlab)

    def shot_S03_31(self):
        fig = self._local_split().move_to([0, 0.2, 0])
        head = T("LOCAL PARTITION INSIDE X", 32, GOLD).to_edge(m.UP, buff=0.5)
        self.add(head, fig)
        self.until(self.at(0, "contain"))
        self.play(fig[1].animate.set_opacity(1), run_time=0.5)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "intersection"))
        self.until(self.at(1, "reconstruct"))
        self.play(fig[1][0].animate.shift(m.LEFT * 0.12), fig[1][1].animate.shift(m.RIGHT * 0.12), run_time=0.5)
        self.play(fig[1][0].animate.shift(m.RIGHT * 0.12), fig[1][1].animate.shift(m.LEFT * 0.12), run_time=0.5)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "include"))
        side = m.VGroup(T("α", 40, GOLD), T(AXES[0], 28, INK)).arrange(m.DOWN, buff=0.18)
        side.next_to(head, m.DOWN, buff=0.12)
        alpha, axis = side[0], side[1]
        self.play(m.FadeIn(side), run_time=0.4)
        self.until(self.at(2, "power"))
        self.play(axis.animate.become(T("INSTITUTIONAL POWER", 20, INK).move_to(axis)), run_time=0.35)
        self.until(self.beat_end(2) - 0.3)

        person = m.Dot(radius=0.07, color=GOLD).move_to(fig[1][0].get_corner(m.DL) + m.RIGHT * 0.35 + m.UP * 0.2)
        self.add(person)
        self.until(self.at(3, "projection"))
        self.play(person.animate.move_to(fig[1][1].get_corner(m.DL) + m.RIGHT * 0.35 + m.UP * 0.2), run_time=0.7)
        self.until(self.beat_end(3) - 0.25)

        self.until(self.at(4, "working"))
        race_i = T("RACE → I", 24, HIM).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(race_i), person.animate.move_to(fig[1][0].get_corner(m.DL) + m.RIGHT * 0.35 + m.UP * 0.2), run_time=0.6)
        self.until(self.at(4, "capital"))
        cap_o = T("CAPITAL → O", 24, HER).to_edge(m.DOWN, buff=0.42)
        self.play(m.Transform(race_i, cap_o),
                  person.animate.move_to(fig[1][1].get_corner(m.DL) + m.RIGHT * 0.35 + m.UP * 0.2), run_time=0.6)
        self.until(self.beat_end(4) - 0.25)

        self.until(self.at(5, "credentialed"))
        adv = m.Star(5, outer_radius=0.18, inner_radius=0.08, color=OK, fill_opacity=1).move_to(fig[1][0].get_corner(m.UR) + m.LEFT * 0.15)
        self.play(m.FadeIn(adv), run_time=0.5)
        self.until(self.beat_end(5) - 0.25)

        self.until(self.at(6, "flattening"))
        self.play(m.FadeOut(race_i), run_time=0.2)
        keep = T("INTERNAL PARTITIONS REMAIN", 28, GOLD).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(keep), run_time=0.4)
        self.until(self.beat_end(6) - 0.3)
