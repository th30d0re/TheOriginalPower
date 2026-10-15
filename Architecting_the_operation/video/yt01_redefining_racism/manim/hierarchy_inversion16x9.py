"""S06-29: Figure 2.3 definitional hierarchy inversion."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


def stack_block(labels, colors, x, widths=None):
    widths = widths or [5.2, 5.0, 4.6]
    blocks = m.VGroup()
    for lab, col, w in zip(labels, colors, widths):
        r = m.RoundedRectangle(width=w, height=1.05, corner_radius=0.1, stroke_color=col, stroke_width=3,
                               fill_color=NAVY2, fill_opacity=1)
        t = T(lab, 34, col, width=w - 0.25).move_to(r)
        blocks.add(m.VGroup(r, t))
    blocks.arrange(m.DOWN, buff=0.16).shift(m.RIGHT * x + m.UP * 0.15)
    return blocks


class HierarchyInversion(YTScene):
    SHOT = "S06-29"

    def shot_S06_29(self):
        card = self.card(0)
        head = T(card["headline"], 40, GOLD, width=12.5).to_edge(m.UP, buff=0.42)
        left = stack_block(
            ["INDIVIDUAL PREJUDICE", "BELIEF IN SUPERIORITY", "SYSTEMIC (IF PRESENT)"],
            [HER, HER, DIM],
            -3.85,
            [5.4, 5.2, 4.8],
        )
        right = stack_block(
            ["SYSTEMIC POLICIES", "IDEOLOGICAL NARRATIVES", "INTERPERSONAL PREJUDICE"],
            [OK, OK, OK],
            3.85,
            [5.0, 5.4, 5.2],
        )
        left_title = T("Conventional", 34, HER, "NORMAL").next_to(left, m.UP, buff=0.22)
        right_title = T("Correct", 34, OK, "NORMAL").next_to(right, m.UP, buff=0.22)
        arrow = m.Arrow(left.get_right() + m.RIGHT * 0.25, right.get_left() + m.LEFT * 0.25,
                        color=GOLD, stroke_width=6, buff=0.1)
        invert = T("MUST INVERT", 34, GOLD).move_to(m.DOWN * 3.05)
        buried = T("buried, rarely referenced", 28, HER, "NORMAL").next_to(left, m.DOWN, buff=0.28)
        buried.set_opacity(0)
        epip = T("epiphenomenal, downstream", 28, OK, "NORMAL").next_to(right, m.DOWN, buff=0.28)
        epip.set_opacity(0)
        sweep = m.VGroup(
            m.Arrow(right[0].get_bottom(), right[1].get_top(), buff=0.1, color=OK, stroke_width=5),
            m.Arrow(right[1].get_bottom(), right[2].get_top(), buff=0.1, color=OK, stroke_width=5),
        )
        sweep.set_opacity(0)
        fb_x = right[0].get_left()[0] - 0.65
        feedback = m.CurvedArrow(
            [fb_x, right[2].get_center()[1], 0],
            [fb_x, right[0].get_center()[1], 0],
            angle=m.PI / 2.15,
            color=GOLD,
            stroke_width=4,
            dashed_ratio=0.4,
        )
        feedback.set_opacity(0)
        self.add(head, left_title, right_title, left, right, arrow, invert, buried, epip, sweep, feedback)
        self.until(self.at(0, "invert"))

        self.until(self.at(1, "left"))
        self.play(buried.animate.set_opacity(1), left[-1].animate.set_opacity(0.4), run_time=0.7)

        self.until(self.at(2, "right"))
        self.play(epip.animate.set_opacity(1), run_time=0.6)

        self.until(self.at(3, "downward"))
        self.play(sweep.animate.set_opacity(1), m.LaggedStart(*[m.GrowArrow(s) for s in sweep], lag_ratio=0.4), run_time=0.95)

        self.until(self.at(4, "epiphenomenal"))
        self.play(
            feedback.animate.set_opacity(1),
            m.FadeOut(invert),
            m.Create(feedback),
            right[2][0].animate.set_stroke(OK, 5).set_fill(OK, 0.12),
            run_time=0.85,
        )
        self.until(self.beat_end(4) - 0.3)
