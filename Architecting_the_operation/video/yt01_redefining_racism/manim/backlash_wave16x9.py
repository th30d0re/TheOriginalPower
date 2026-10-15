"""S15-10 Figure 2.7 four-panel backlash wave."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, OK, T, YT, YTScene  # noqa: E402


class BacklashWave(YTScene):
    SHOT = "S15-10"

    def shot_S15_10(self):
        card = self.card()
        head = T(card["headline"].upper(), 40, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        panels = []
        labels = ("(a) Φ_load", "(b) ψ_s", "(c) R(t)", "(d) Σ_sup")
        colors = (OK, GOLD, HER, INK)
        for i, letter in enumerate("abcd"):
            path = YT / f"figures/eq08_10_backlash_wave_panel_{letter}.png"
            img = m.ImageMobject(str(path))
            img.scale_to_fit_height(3.05)
            frame = m.RoundedRectangle(
                width=img.width + 0.25, height=img.height + 0.25,
                corner_radius=0.08, stroke_color=colors[i], stroke_width=3,
            )
            frame.move_to(img)
            cap = T(labels[i], 34, colors[i], "NORMAL").next_to(frame, m.DOWN, buff=0.1)
            panels.append(m.VGroup(frame, img, cap))
        grid = m.VGroup(*panels[:2]).arrange(m.RIGHT, buff=0.45)
        grid2 = m.VGroup(*panels[2:]).arrange(m.RIGHT, buff=0.45)
        board = m.VGroup(grid, grid2).arrange(m.DOWN, buff=0.35).shift(m.DOWN * 0.05)
        note = T("THREE SUPPRESSION COMPONENTS TRACKED", 36, DIM, width=11.0).to_edge(m.DOWN, buff=0.38)
        self.add(head, board)
        self.until(self.at(0, "Figure"))
        self.play(m.FadeIn(note), run_time=0.45)
        for p in panels:
            self.play(p[0].animate.set_stroke(width=6), run_time=0.25)
        self.until(self.at(0, "contracted"))
        highlight = T("UNION CONTRACT · CARCERAL EXPAND · WEALTH CONCENTRATE", 34, OK, width=11.5).next_to(note, m.UP, buff=0.12)
        self.play(m.FadeIn(highlight), panels[0][0].animate.set_stroke(OK, 8), panels[2][0].animate.set_stroke(HER, 8),
                  panels[1][0].animate.set_stroke(GOLD, 8), run_time=0.55)
        self.until(self.beat_end(0) - 0.3)
