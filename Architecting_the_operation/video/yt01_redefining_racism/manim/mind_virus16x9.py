"""S07-07: fractal mind virus — institutional exploit on human cognition."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, NAVY2, T, TEAL, YTScene  # noqa: E402


def chip(label, color=INK, fill=NAVY2, w=4.8, h=0.95):
    box = m.RoundedRectangle(width=w, height=h, corner_radius=0.12, stroke_color=color, stroke_width=3,
                             fill_color=fill, fill_opacity=1)
    text = T(label, 34, color, width=w - 0.4).move_to(box)
    return m.VGroup(box, text)


class MindVirus(YTScene):
    SHOT = "S07-07"

    def shot_S07_07(self):
        title = T("FRACTAL MIND VIRUS", 44, GOLD).to_edge(m.UP, buff=0.45)
        inst = chip("INSTITUTIONAL EXPLOIT", GOLD, w=5.6)
        host = m.Ellipse(width=7.2, height=3.6, stroke_color=TEAL, stroke_width=4, fill_color=NAVY2, fill_opacity=0.92)
        host_l = T("HUMAN COGNITION", 36, TEAL).move_to(host)
        host_g = m.VGroup(host, host_l)
        inst.shift(m.UP * 1.75)
        host_g.shift(m.DOWN * 0.55)
        arrow = m.Arrow(inst.get_bottom(), host_g.get_top(), buff=0.14, color=GOLD, stroke_width=6,
                        max_tip_length_to_length_ratio=0.14)
        diagram = m.VGroup(inst, arrow, host_g)
        self.add(title)
        self.play(m.FadeIn(inst), m.FadeIn(host_g), m.GrowArrow(arrow), run_time=1.1)
        self.until(self.at(0, "cognition"))

        self.until(self.at(1, "Law"))
        law = chip("LAW → EXECUTABLE", HIM, w=5.0)
        upd = chip("INSTITUTIONS → CHANNELS", GOLD, w=5.4)
        wet = chip("SHORTCUTS → WETWARE", HER, w=5.2)
        row = m.VGroup(law, upd, wet).arrange(m.RIGHT, buff=0.22).scale_to_fit_width(12.2).next_to(host_g, m.DOWN, buff=0.12)
        self.play(m.LaggedStart(*[m.FadeIn(c, shift=m.DOWN * 0.15) for c in row], lag_ratio=0.18), run_time=1.0)
        self.until(self.at(1, "wetware"))

        self.until(self.at(2, "schools"))
        self.play(m.FadeOut(row), run_time=0.3)
        names = ("SCHOOLS", "CHURCHES", "PRESS", "COURTS", "PARTIES", "POLICE")
        channels = m.VGroup(*[chip(n, TEAL, w=2.85, h=0.82) for n in names])
        channels.arrange_in_grid(2, 3, buff=0.16).scale_to_fit_width(11.5).next_to(host_g, m.DOWN, buff=0.08)
        channels.shift(m.UP * 1.0)
        self.play(m.FadeIn(channels), run_time=0.8)
        self.play(
            m.LaggedStart(*[c[0].animate.set_stroke(GOLD, 5) for c in channels], lag_ratio=0.1),
            m.LaggedStart(*[c[0].animate.set_stroke(TEAL, 3) for c in channels], lag_ratio=0.1),
            run_time=1.4,
        )
        self.until(self.at(2, "cognition"))

        self.until(self.at(3, "diagnostic"))
        self.play(m.FadeOut(channels), m.FadeOut(inst), m.FadeOut(arrow), m.FadeOut(host_g), run_time=0.35)
        left = chip("POLICY PASSED", GOLD, w=4.4)
        right = chip("PRIOR INSTALLED", TEAL, w=4.4)
        pair = m.VGroup(left, right).arrange(m.RIGHT, buff=0.85).shift(m.DOWN * 0.1)
        self.play(m.FadeIn(pair, shift=m.UP * 0.2), run_time=0.8)
        self.until(self.beat_end(3) - 0.3)
