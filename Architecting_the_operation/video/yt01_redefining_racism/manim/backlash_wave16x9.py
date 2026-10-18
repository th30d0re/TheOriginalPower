"""S15-10 Figure 2.7 four-panel backlash wave."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, OK, T, YT, YTScene  # noqa: E402


class BacklashWave(YTScene):
    SHOT = "S15-10"

    def shot_S10_36(self):
        head = T("FIGURE 2.7 · POST-1965 BACKLASH SERIES", 38, GOLD).to_edge(m.UP, buff=0.4)
        panel_specs = (
            ("UNION DENSITY", OK, (0.85, 0.25)),
            ("TOP-DECILE WEALTH", GOLD, (0.25, 0.75)),
            ("US INCARCERATION", HER, (0.2, 0.75)),
            ("BLACK INCARCERATION", INK, (0.15, 0.9)),
        )
        panels = m.VGroup()
        curves = []
        for label, color, (y0, y1) in panel_specs:
            frame = m.RoundedRectangle(width=5.8, height=2.35, corner_radius=0.1, stroke_color=color, stroke_width=3,
                                       fill_color="#16264A", fill_opacity=0.65)
            cap = T(label, 27, color).next_to(frame, m.UP, buff=0.1)
            line = m.Line(frame.get_corner(m.DL) + m.UP * (0.35 + y0),
                          frame.get_corner(m.DR) + m.UP * (0.35 + y1), color=color, stroke_width=6)
            panels.add(m.VGroup(frame, cap, line))
            curves.append(line)
        panels.arrange_in_grid(2, 2, buff=(0.55, 0.52)).shift(m.DOWN * 0.25)
        self.add(head)
        self.until(self.at(0, "Figure"))
        self.play(m.LaggedStart(*[m.FadeIn(p[0], p[1]) for p in panels], lag_ratio=0.12), run_time=0.8)

        self.until(self.at(1, "fell"))
        citations = T("BLS · TROY & SHEFLIN · WID · BJS · THE SENTENCING PROJECT", 27, DIM, width=12.0)
        citations.to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(citations), run_time=0.5)

        self.until(self.at(2, "231"))
        self.play(m.Create(panels[0][2]), m.Create(panels[1][2]), run_time=0.65)
        union_note = T("28.4% → 10.8%       67.5% → 76.5%", 28, GOLD).to_edge(m.DOWN, buff=0.38)
        self.play(m.Transform(citations, union_note), run_time=0.4)

        self.until(self.at(3, "588"))
        self.play(m.Create(panels[2][2]), run_time=0.55)
        overall = T("US INCARCERATION · 108 → 358 PER 100,000 · +231%", 28, HER).move_to(citations)
        self.play(m.Transform(citations, overall), run_time=0.45)

        self.until(self.at(4, "23"))
        peak = m.Dot(radius=0.12, color=HER).move_to(panels[3][0].get_top() + m.DOWN * 0.45 + m.RIGHT * 1.2)
        self.play(m.Create(panels[3][2]), m.FadeIn(peak), run_time=0.6)
        black = T("BLACK INCARCERATION · 588 → 3,074 → 1,821", 28, HER).move_to(citations)
        self.play(m.Transform(citations, black), run_time=0.45)

        self.until(self.at(5, "Biological"))
        envelope = T("Σ_sup > 23%       ELITE WEALTH +9 POINTS", 29, GOLD).move_to(citations)
        self.play(m.Transform(citations, envelope), m.Indicate(panels, color=GOLD), run_time=0.65)
        self.until(self.beat_end(5) - 0.2)

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
