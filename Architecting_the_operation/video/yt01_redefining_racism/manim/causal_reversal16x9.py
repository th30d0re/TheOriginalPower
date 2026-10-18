"""S05-01, S05-21, S05-22: causal reversal diagrams and Figure 2.2."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402

ORANGE_FB = "#B85C2A"


def chain_node(label, color=INK, w=3.8):
    r = m.RoundedRectangle(width=w, height=1.15, corner_radius=0.12, stroke_color=color, stroke_width=3,
                           fill_color=NAVY2, fill_opacity=1)
    t = T(label, 36, color, width=w - 0.2).move_to(r)
    return m.VGroup(r, t)


def causal_row(labels, colors, y, widths=None, arrows_visible=True):
    widths = widths or [3.8] * len(labels)
    nodes = m.VGroup(*[chain_node(lab, col, w) for lab, col, w in zip(labels, colors, widths)])
    nodes.arrange(m.RIGHT, buff=0.45).shift(m.UP * y)
    arrows = m.VGroup(*[m.Arrow(a.get_right(), b.get_left(), buff=0.1, color=colors[i], stroke_width=6)
                        for i, (a, b) in enumerate(zip(nodes, nodes[1:]))])
    if not arrows_visible:
        arrows.set_opacity(0)
    return m.VGroup(nodes, arrows)


def row_strike_line(row_grp, color=HER, stroke_width=10):
    """Thick strike through the row centre (book Figure 2.2), drawn above boxes and arrows."""
    row = m.VGroup(row_grp[0], row_grp[1])
    y = row.get_center()[1]
    x0, x1 = row.get_left()[0] - 0.3, row.get_right()[0] + 0.3
    line = m.Line([x0, y, 0], [x1, y, 0], color=color, stroke_width=stroke_width)
    line.set_z_index(10)
    return line


def dashed_feedback_arc(start, end, color=ORANGE_FB):
    """Thin dashed orange curved arrow, stroke only (no filled band under the arc)."""
    from manimgx.mobjects.shapes import dash_pattern

    bend = -0.58
    arc = m.ArcBetweenPoints(start, end, angle=bend, color=color, stroke_width=3, fill_opacity=0)
    arc.set_fill(opacity=0)
    arc.paint = arc.paint.but(dash=dash_pattern(26, 0.55, 0, False))
    arc.add_tip(tip_shape=m.ArrowTriangleTip, tip_length=0.18, tip_width=0.14)
    arc.set_fill(opacity=0)
    return arc


class CausalReversal(YTScene):
    SHOT = "S05-01"

    def shot_S05_10(self):
        head = T("EQUATION 2.5 · BOTTOM-UP AGGREGATION", 38, HER).to_edge(m.UP, buff=0.45)
        row = causal_row(
            ["INDIVIDUAL PREJUDICE", "DISCRIMINATORY ACTIONS", "SYSTEMIC OUTCOMES"],
            [HER, HER, HER], 0, widths=[3.8, 4.0, 3.8], arrows_visible=False,
        )
        self.add(head, row)
        self.until(self.at(0, "individuals"))
        self.play(m.LaggedStart(*[a.animate.set_opacity(1) for a in row[1]], lag_ratio=0.25), run_time=0.7)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in row[1]], lag_ratio=0.25), run_time=0.7)

        self.until(self.at(1, "intent"))
        court = T("EQUAL PROTECTION · INTENT TEST", 32, GOLD).next_to(row[0][0], m.DOWN, buff=0.55)
        bracket = m.SurroundingRectangle(row[0][0], color=GOLD, buff=0.12, stroke_width=5)
        self.play(m.Create(bracket), m.FadeIn(court), run_time=0.6)

        self.until(self.at(2, "policy"))
        spot = m.SurroundingRectangle(row[0][0], color=HER, buff=0.22, stroke_width=8)
        self.play(m.Transform(bracket, spot), row[0][1:].animate.set_opacity(0.35), run_time=0.55)

        self.until(self.at(3, "persuasion"))
        cure = T("MORAL PERSUASION · DIVERSITY WORKSHOPS · ATTITUDE ADJUSTMENT", 30, INK, width=12.0)
        cure.to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeOut(court), m.FadeIn(cure), run_time=0.55)
        self.until(self.beat_end(3) - 0.2)

    def shot_S06_04(self):
        head = T("FIGURE 2.2 · GENERATIVE CHAIN", 40, GOLD).to_edge(m.UP, buff=0.42)
        row = causal_row(
            ["ELITE ECONOMIC INTERESTS", "SYSTEMIC RACIALIZATION", "INTERPERSONAL PREJUDICE"],
            [OK, OK, OK], 0.25, widths=[3.9, 4.2, 4.1], arrows_visible=False,
        )
        self.add(head, row)
        self.until(self.at(0, "solid"))
        self.play(m.LaggedStart(*[a.animate.set_opacity(1) for a in row[1]], lag_ratio=0.25), run_time=0.65)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in row[1]], lag_ratio=0.25), run_time=0.75)

        self.until(self.at(1, "dashed"))
        nodes = row[0]
        feedback = dashed_feedback_arc(nodes[2].get_bottom() + m.DOWN * 0.3, nodes[1].get_bottom() + m.DOWN * 0.3)
        label = T("REINFORCING FEEDBACK LOOP", 30, ORANGE_FB).next_to(feedback, m.DOWN, buff=0.12)
        self.play(m.Create(feedback), m.FadeIn(label), run_time=0.7)

        self.until(self.at(2, "feeds"))
        self.play(m.Indicate(row[1], color=OK), m.Indicate(nodes[1], color=GOLD),
                  m.Indicate(nodes[2], color=ORANGE_FB), m.Indicate(feedback, color=ORANGE_FB), run_time=0.75)
        self.until(self.beat_end(2) - 0.2)

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
            widths=[3.7, 3.5, 3.7],
        )
        conv_lab = T("Conventional (incorrect)", 34, HER, "NORMAL")
        conv_block = m.VGroup(conv_lab, conv).arrange(m.DOWN, buff=0.22).to_edge(m.UP, buff=1.28)
        strike_line = row_strike_line(conv)
        strike_line.set_opacity(0)
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
        fb_drop = 0.32
        fb_start = hist_nodes[2].get_bottom() + m.DOWN * fb_drop
        fb_end = hist_nodes[1].get_bottom() + m.DOWN * fb_drop
        feedback = dashed_feedback_arc(fb_start, fb_end)
        feedback.set_stroke(opacity=0)  # stroke only: set_opacity would also raise the fill
        fb_lab = m.Text(
            "reinforcing feedback (cultivated)",
            font="Noto Sans",
            font_size=30,
            color=ORANGE_FB,
            slant=m.ITALIC,
        )
        if fb_lab.width > 11.0:
            fb_lab.scale_to_fit_width(11.0)
        fb_lab.next_to(feedback, m.DOWN, buff=0.12)
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
        self.add(head, conv_block, rev, rev_lab, hist_block, feedback, fb_lab, bias_in, bias_lab, path_labels, dots, ab, strike_line)
        self.until(self.at(0, "crossed"))
        self.play(strike_line.animate.set_opacity(1), m.Create(strike_line), run_time=0.65)

        self.until(self.at(1, "bottom"))
        self.play(m.LaggedStart(*[a.animate.set_opacity(1) for a in hist[1]], lag_ratio=0.35), run_time=1.0)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in hist[1]], lag_ratio=0.35), run_time=0.9)

        self.until(self.at(2, "dashed"))
        feedback.set_stroke(opacity=1)
        self.play(m.Create(feedback), fb_lab.animate.set_opacity(1), run_time=0.85)
        self.play(
            m.Indicate(hist_nodes[0], color=OK, scale_factor=1.04),
            m.Indicate(hist_nodes[1], color=OK, scale_factor=1.04),
            run_time=0.65,
        )

        self.until(self.at(3, "input"))
        self.play(m.Indicate(feedback, color=ORANGE_FB, scale_factor=1.08), run_time=0.75)

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
            m.FadeOut(conv_block, strike_line, feedback, fb_lab),
            dots.animate.set_opacity(1),
            ab.animate.set_opacity(1),
            target[0].animate.set_stroke(OK, 6),
            run_time=0.85,
        )
        self.until(self.beat_end(7) - 0.3)
