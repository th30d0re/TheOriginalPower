"""S03-46: Figure 2.1 · Zooming the Binary."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HIM, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

I_TIERS = [
    (r"E", GOLD),
    (r"P_{\text{puppet}}", DIM),
    (r"F_{\text{enforce}}", INK),
    (r"I_{\text{buffer}}", OK),
]
O_TIERS = [
    (r"O_{\text{racialized}}", HER),
    (r"O_{\text{adjacent},j}", DIM),
    (r"O^{+}_{\alpha}\dot\cup O^{-}_{\alpha}", HER),
]


def tier_rows(symbols, stroke):
    rows = m.VGroup()
    for sym, col in symbols:
        row = m.RoundedRectangle(width=5.4, height=0.95, corner_radius=0.08, stroke_color=col, stroke_width=3,
                                 fill_color=NAVY2, fill_opacity=0.55)
        lab = M(sym, 34, col)
        lab.move_to(row)
        rows.add(m.VGroup(row, lab))
    rows.arrange(m.DOWN, buff=0.16)
    return rows


def macro_block(title, symbols, stroke):
    outer = m.RoundedRectangle(width=5.9, height=4.85, corner_radius=0.14, stroke_color=stroke, stroke_width=5,
                               fill_color=NAVY2, fill_opacity=0.25)
    head = M(title, 44, stroke).next_to(outer, m.UP, buff=0.12)
    rows = tier_rows(symbols, stroke).move_to(outer)
    return m.VGroup(outer, head, rows)


class ZoomingBinary(YTScene):
    SHOT = "S03-46"
    SOURCE = "Source: The Original Power, Figure 2.1"

    def shot_S03_46(self):
        card = self.card(0)
        head = T(card["headline"], 40, GOLD, width=12.4).to_edge(m.UP, buff=0.38)
        i_blk = macro_block(r"I", I_TIERS, HIM)
        o_blk = macro_block(r"O", O_TIERS, HER)
        fig = m.VGroup(i_blk, o_blk).arrange(m.RIGHT, buff=0.32).move_to([0, -0.05, 0])
        if fig.width > 12.8:
            fig.scale_to_fit_width(12.8)
        bound_start = i_blk[1].get_right() + m.RIGHT * 0.08
        bound_end = o_blk[1].get_left() + m.LEFT * 0.08
        bound = m.Arrow(
            bound_start, bound_end, color=GOLD, stroke_width=2.5, buff=0,
            max_tip_length_to_length_ratio=0.14, tip_length=0.14,
        )
        bound = m.DashedVMobject(bound, num_segments=40, dashed_ratio=0.55)
        bound_lab = T("boundary projection", 28, GOLD, "NORMAL").next_to(bound, m.UP, buff=0.1)
        self.add(head)
        self.until(self.at(0, "tiers"))
        self.play(m.FadeIn(fig), m.FadeIn(bound), m.FadeIn(bound_lab), run_time=0.75)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "Elite"))
        hi_e = m.SurroundingRectangle(i_blk[2][0][0], color=GOLD, buff=0.04, stroke_width=5)
        self.play(m.Create(hi_e), m.Indicate(i_blk[2][0]), run_time=0.55)
        self.until(self.at(1, "racialized"))
        hi_o = m.SurroundingRectangle(o_blk[2][0][0], color=HER, buff=0.04, stroke_width=5)
        self.play(m.Create(hi_o), m.Indicate(o_blk[2][0]), run_time=0.55)
        self.play(m.FadeOut(hi_e), m.FadeOut(hi_o), run_time=0.2)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "Adjacent"))
        self.play(m.Indicate(o_blk[2][1]), m.Indicate(o_blk[2][2]), run_time=0.7)
        arc_start = i_blk[0].get_bottom() + m.DOWN * 0.28 + m.RIGHT * 0.55
        arc_end = o_blk[0].get_bottom() + m.DOWN * 0.28 + m.LEFT * 0.55
        arc = m.Arrow(
            arc_start, arc_end, path_arc=-0.72, color=DIM, stroke_width=2.2, buff=0,
            max_tip_length_to_length_ratio=0.1, tip_length=0.14,
        )
        rec = m.VGroup(
            T("recursive partitions", 28, DIM, "NORMAL"),
            T("inside every tier", 28, DIM, "NORMAL"),
        ).arrange(m.DOWN, buff=0.05)
        rec.next_to(arc, m.DOWN, buff=0.08).shift(m.UP * 0.12)
        self.play(m.Create(arc), run_time=0.55)
        self.play(m.FadeIn(rec), run_time=0.35)
        self.until(self.beat_end(2) - 0.25)

        self.until(self.at(3, "advantage"))
        marker = m.Dot(radius=0.08, color=OK).move_to(o_blk[2][2][0].get_right() + m.RIGHT * 0.22)
        self.play(m.FadeIn(marker), run_time=0.5)
        frame = m.SurroundingRectangle(o_blk[0], color=HER, buff=0.05)
        self.play(m.Create(frame), run_time=0.4)
        self.until(self.beat_end(3) - 0.3)
