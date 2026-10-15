"""S05-01, S05-21, S05-22: causal reversal diagrams and Figure 2.2."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


def chain_node(label, color=INK, w=3.8):
    r = m.RoundedRectangle(width=w, height=1.15, corner_radius=0.12, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(label, 36, color, width=w - 0.2).move_to(r)
    return m.VGroup(r, t)


def causal_row(labels, colors, y, strike=False, widths=None, arrows_visible=True):
    widths = widths or [3.8] * len(labels)
    nodes = m.VGroup(*[chain_node(lab, col, w) for lab, col, w in zip(labels, colors, widths)])
    nodes.arrange(m.RIGHT, buff=0.45).shift(m.UP * y)
    arrows = m.VGroup(*[m.Arrow(a.get_right(), b.get_left(), buff=0.1, color=colors[i], stroke_width=6)
                        for i, (a, b) in enumerate(zip(nodes, nodes[1:]))])
    if not arrows_visible:
        arrows.set_opacity(0)
    grp = m.VGroup(nodes, arrows)
    if strike:
        y_strike = nodes.get_bottom()[1] - 0.4
        line = m.Line([nodes.get_left()[0], y_strike, 0], [nodes.get_right()[0], y_strike, 0], color=HER, stroke_width=7)
        grp.add(line)
    return grp


class CausalReversal(YTScene):
    SHOT = "S05-01"

    def shot_S05_01(self):
        rows = m.VGroup(
            chain_node("INDIVIDUAL PREJUDICE", HER, 7.2),
            chain_node("BELIEF IN SUPERIORITY", DIM, 5.8),
            chain_node("SYSTEMIC DISCRIMINATION", DIM, 4.6),
        ).arrange(m.DOWN, buff=0.35).shift(m.DOWN * 0.15)
        head = T("DICTIONARY ORDER", 44, DIM).to_edge(m.UP, buff=0.5)
        self.add(head, rows)
        self.until(self.at(0, "reverse"))
        a = chain_node("INDIVIDUAL PREJUDICE", HER, 3.9)
        b = chain_node("DISCRIMINATORY ACTIONS", DIM, 4.2)
        c = chain_node("SYSTEMIC OUTCOMES", DIM, 3.9)
        chain = m.VGroup(a, b, c).arrange(m.RIGHT, buff=0.5).shift(m.UP * 0.2).scale_to_fit_width(12.8)
        arr = m.VGroup(*[m.Arrow(x.get_right(), y.get_left(), buff=0.12, color=HER, stroke_width=6)
                         for x, y in ((a, b), (b, c))])
        head2 = T("CONVENTIONAL CAUSAL CHAIN", 40, HER).move_to(head)
        self.play(m.ReplacementTransform(rows, chain), m.Transform(head, head2), run_time=1.4)
        self.play(m.LaggedStart(*[m.GrowArrow(ar) for ar in arr], lag_ratio=0.4), run_time=0.8)
        self.until(self.beat_end(0) - 0.3)

    def shot_S05_21(self):
        bias = chain_node("PRE-EXISTING BIAS", DIM, 3.9).shift(m.LEFT * 4.5)
        sys = chain_node("SYSTEMIC RACIALIZATION", GOLD, 4.4).shift(m.LEFT * 0.15)
        form = chain_node("DURABLE INSTITUTIONAL FORM", OK, 4.8).shift(m.RIGHT * 4.5)
        self.add(bias, sys, form)
        self.until(self.at(0, "recruits"))
        a1 = m.Arrow(bias.get_right(), sys.get_left(), buff=0.12, color=GOLD, stroke_width=6)
        self.play(m.GrowArrow(a1), run_time=0.7)
        self.until(self.at(0, "heritable"))
        a2 = m.Arrow(sys.get_right(), form.get_left(), buff=0.12, color=OK, stroke_width=6)
        shell = m.SurroundingRectangle(form[0], color=OK, buff=0.08, stroke_width=4, fill_opacity=0)
        self.play(m.GrowArrow(a2), m.Create(shell), run_time=0.9)
        self.until(self.beat_end(0) - 0.3)

    def shot_S05_22(self):
        card = self.card(0)
        head = T(card["headline"], 40, GOLD, width=12.5).to_edge(m.UP, buff=0.42)
        conv = causal_row(
            ["INDIVIDUAL PREJUDICE", "DISCRIMINATION", "SYSTEMIC OUTCOMES"],
            [HER, HER, HER],
            2.05,
            strike=True,
            widths=[3.7, 3.5, 3.7],
        )
        conv_lab = T("Conventional (incorrect)", 34, HER, "NORMAL")
        conv_block = m.VGroup(conv_lab, conv).arrange(m.DOWN, buff=0.22).to_edge(m.UP, buff=1.28)
        hist = causal_row(
            ["ELITE INTERESTS", "SYSTEMIC RACIALIZATION", "INTERPERSONAL PREJUDICE"],
            [OK, OK, OK],
            -2.05,
            widths=[3.6, 4.4, 4.0],
            arrows_visible=False,
        )
        hist_lab = T("Actual (historical)", 34, OK, "NORMAL")
        hist_block = m.VGroup(hist_lab, hist).arrange(m.DOWN, buff=0.22).shift(m.DOWN * 0.72)
        gap_top = conv_block.get_bottom() + m.DOWN * 0.15
        gap_bot = hist_lab.get_top() + m.UP * 0.12
        rev = m.Arrow(gap_top, gap_bot, color=DIM, stroke_width=7, buff=0.1, max_tip_length_to_length_ratio=0.14)
        rev_lab = T("Causal reversal", 34, DIM, "NORMAL").move_to(m.LEFT * 5.4 + m.UP * 0.15)
        hist_nodes = hist[0]
        feedback = m.CurvedArrow(
            hist_nodes[2].get_bottom() + m.DOWN * 0.15,
            hist_nodes[1].get_bottom() + m.DOWN * 0.15,
            angle=-m.PI / 2.6,
            color=GOLD,
            stroke_width=5,
            dashed_ratio=0.5,
        )
        feedback.set_opacity(0)
        fb_lab = T("reinforcing feedback", 34, GOLD, "NORMAL").next_to(feedback, m.DOWN, buff=0.14)
        fb_lab.set_opacity(0)
        bias_in = m.Arrow(hist_nodes[0].get_bottom() + m.DOWN * 0.55, hist_nodes[0].get_bottom(),
                          color=DIM, stroke_width=5)
        bias_in.set_opacity(0)
        bias_lab = T("ambient bias", 34, DIM, "NORMAL").next_to(bias_in, m.DOWN, buff=0.1)
        bias_lab.set_opacity(0)
        path_labels = m.VGroup(*[
            T(t, 34, GOLD).move_to([-2.5 + i * 2.5, -3.25, 0])
            for i, t in enumerate(("HIRING", "JURIES", "VOTERS"))
        ])
        path_labels.set_opacity(0)
        target = hist_nodes[2]
        ab = T("ANTIBODIES", 34, OK).next_to(target, m.UP, buff=0.72)
        ab.set_opacity(0)
        dots = m.VGroup(*[
            m.Dot(radius=0.1, color=OK).move_to(ab.get_top() + m.UP * 0.18 + m.RIGHT * (i - 1) * 0.24)
            for i in range(3)
        ])
        dots.set_opacity(0)
        self.add(head, conv_block, rev, rev_lab, hist_block, feedback, fb_lab, bias_in, bias_lab, path_labels, dots, ab)
        self.until(self.at(0, "crossed"))

        self.until(self.at(1, "bottom"))
        self.play(m.LaggedStart(*[a.animate.set_opacity(1) for a in hist[1]], lag_ratio=0.35), run_time=1.0)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in hist[1]], lag_ratio=0.35), run_time=0.9)

        self.until(self.at(2, "dashed"))
        self.play(feedback.animate.set_opacity(1), fb_lab.animate.set_opacity(1), m.Create(feedback), run_time=0.85)
        self.play(
            m.Indicate(hist_nodes[0], color=OK, scale_factor=1.04),
            m.Indicate(hist_nodes[1], color=OK, scale_factor=1.04),
            run_time=0.65,
        )

        self.until(self.at(3, "input"))
        self.play(m.Indicate(feedback, color=GOLD, scale_factor=1.08), run_time=0.75)

        self.until(self.at(4, "recruits"))
        self.play(bias_in.animate.set_opacity(1), bias_lab.animate.set_opacity(1), m.GrowArrow(bias_in), run_time=0.75)
        shell = m.SurroundingRectangle(hist_nodes[0][0], color=OK, buff=0.08, stroke_width=3, fill_opacity=0)
        self.play(m.Create(shell), run_time=0.5)

        self.until(self.at(5, "hiring"))
        self.play(m.FadeOut(rev_lab, fb_lab), path_labels.animate.set_opacity(1), run_time=0.65)

        self.until(self.at(6, "manager"))
        for lab in path_labels:
            self.play(lab.animate.set_color(OK).scale(1.12), run_time=0.35)
            self.play(lab.animate.set_color(GOLD).scale(1 / 1.12), run_time=0.2)

        self.until(self.at(7, "antibodies"))
        self.play(
            m.FadeOut(conv_block, feedback, fb_lab),
            dots.animate.set_opacity(1),
            ab.animate.set_opacity(1),
            target[0].animate.set_stroke(OK, 6),
            run_time=0.85,
        )
        self.until(self.beat_end(7) - 0.3)
