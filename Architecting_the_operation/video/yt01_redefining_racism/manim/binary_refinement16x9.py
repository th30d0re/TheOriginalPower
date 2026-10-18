"""S03-01, S03-08, S03-17: coarse binary and In-group refinement."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def io_cells():
    i = m.RoundedRectangle(width=5.5, height=4.2, corner_radius=0.12, stroke_color=HIM, stroke_width=4,
                           fill_color=NAVY2, fill_opacity=0.5)
    o = m.RoundedRectangle(width=5.5, height=4.2, corner_radius=0.12, stroke_color=HER, stroke_width=4,
                           fill_color=NAVY2, fill_opacity=0.5)
    i_lab = M(r"I", 56, HIM).move_to(i)
    o_lab = M(r"O", 56, HER).move_to(o)
    pair = m.VGroup(m.VGroup(i, i_lab), m.VGroup(o, o_lab)).arrange(m.RIGHT, buff=0.35)
    u = m.Rectangle(width=12.0, height=4.8, stroke_color=DIM, stroke_width=2, fill_opacity=0)
    u.move_to(pair)
    return m.VGroup(u, pair)


def tier_stack():
    names = ["Elite", "Puppet Class", "Enforcement Class", "Buffer Class"]
    colors = [GOLD, DIM, INK, OK]
    boxes = m.VGroup(*[m.RoundedRectangle(width=4.2, height=0.72, corner_radius=0.08, stroke_color=c, stroke_width=3,
                                            fill_color=NAVY2, fill_opacity=1) for c in colors])
    labels = m.VGroup(*[T(n, 24, colors[i], width=3.8).move_to(boxes[i]) for i, n in enumerate(names)])
    stack = m.VGroup(*[m.VGroup(boxes[i], labels[i]) for i in range(4)]).arrange(m.DOWN, buff=0.12)
    return stack


class BinaryRefinement(YTScene):
    SOURCE = "Source: The Original Power, §2.1 Set-Resolution Ladder"

    def shot_S03_19(self):
        i_cell = m.RoundedRectangle(width=6.0, height=5.25, corner_radius=0.12, stroke_color=HIM, stroke_width=4,
                                    fill_color=NAVY2, fill_opacity=0.4).shift(m.LEFT * 2.7)
        o_cell = m.RoundedRectangle(width=4.3, height=5.25, corner_radius=0.12, stroke_color=HER, stroke_width=4,
                                    fill_color=NAVY2, fill_opacity=0.4).shift(m.RIGHT * 3.8)
        stack = tier_stack().scale(1.08).move_to(i_cell)
        o_lab = M(r"O", 56, HER).move_to(o_cell)
        i_lab = M(r"I", 48, HIM).next_to(i_cell, m.UP, buff=0.12)
        head = T("STRUCTURAL POSITIONS IN THE EXTRACTION CIRCUIT", 34, GOLD).to_edge(m.UP, buff=0.4)
        self.add(head, i_cell, o_cell, i_lab, o_lab)
        self.until(self.at(0, "structural"))
        self.play(m.LaggedStart(*[m.FadeIn(row) for row in stack], lag_ratio=0.12), run_time=0.85)

        self.until(self.at(1, "Elite"))
        self.play(m.Indicate(stack[0], color=GOLD), m.Indicate(stack[1], color=DIM), run_time=0.65)

        self.until(self.at(2, "Enforcement"))
        self.play(m.Indicate(stack[2], color=INK), m.Indicate(stack[3], color=OK), run_time=0.65)

        self.until(self.at(3, "decomposition"))
        bracket = m.Brace(stack, m.LEFT, color=HIM)
        payoffs = m.VGroup(*[
            m.Rectangle(width=w, height=0.18, fill_color=c, fill_opacity=0.9, stroke_width=0)
            for w, c in ((2.2, GOLD), (1.6, DIM), (1.15, INK), (0.75, OK))
        ])
        for bar, row in zip(payoffs, stack):
            bar.next_to(row, m.RIGHT, buff=0.18)
        self.play(m.GrowFromCenter(bracket), m.FadeIn(payoffs), run_time=0.65)
        self.until(self.beat_end(3) - 0.2)

    def shot_S03_01(self):
        field = io_cells().scale(0.95).move_to([0, 0.1, 0])
        head = T("COARSE PROJECTION", 34, DIM).to_edge(m.UP, buff=0.55)
        self.add(head, field)
        self.until(self.at(0, "resolution"))
        self.play(field[1][0][0].animate.set_stroke(HIM, 6), field[1][1][0].animate.set_stroke(HER, 6), run_time=0.6)
        self.until(self.beat_end(0) - 0.3)

    def shot_S03_08(self):
        field = io_cells().scale(0.9).move_to([0, 0.5, 0])
        dial = m.Arc(radius=0.5, start_angle=m.PI, angle=m.PI, stroke_color=GOLD, stroke_width=6)
        needle = m.Line(m.ORIGIN, m.UP * 0.45, color=GOLD, stroke_width=4)
        gauge = m.VGroup(dial, needle).move_to([0, -2.85, 0])
        coarse = T("COARSE", 30, GOLD).next_to(gauge, m.DOWN, buff=0.12)
        hidden_i = m.VGroup(T("DESIGNER", 20, DIM), T("ADMINISTRATOR", 20, DIM),
                            T("ENFORCER", 20, DIM), T("STATUS PAY", 20, DIM)).arrange(m.DOWN, buff=0.06)
        hidden_i.next_to(field, m.DOWN, buff=0.25).shift(m.LEFT * 2.2)
        hidden_i.set_opacity(0.15)
        hidden_o = m.VGroup(*[m.Rectangle(width=1.0, height=0.22, stroke_color=HER, fill_opacity=0.2) for _ in range(3)])
        hidden_o.arrange(m.DOWN, buff=0.06).next_to(field, m.DOWN, buff=0.25).shift(m.RIGHT * 2.2)
        hidden_o.set_opacity(0.15)
        self.add(field, gauge, coarse, hidden_i, hidden_o)
        self.until(self.at(0, "incomplete"))
        self.play(m.Rotate(needle, -m.PI / 3, about_point=dial.get_center()), run_time=0.5)
        self.until(self.beat_end(0) - 0.25)

        self.until(self.at(1, "designs"))
        self.play(hidden_i.animate.set_opacity(0.85), run_time=0.6)
        self.until(self.beat_end(1) - 0.2)

        self.until(self.at(2, "fractured"))
        self.play(hidden_o.animate.set_opacity(0.9), run_time=0.6)
        self.until(self.beat_end(2) - 0.3)

    def shot_S03_17(self):
        i_cell = m.RoundedRectangle(width=5.0, height=4.5, corner_radius=0.12, stroke_color=HIM, stroke_width=4,
                                    fill_color=NAVY2, fill_opacity=0.4).move_to([-3.2, 0, 0])
        i_lab = M(r"I", 48, HIM).next_to(i_cell, m.LEFT, buff=0.2)
        stack = tier_stack().move_to(i_cell)
        stack.set_opacity(0)
        self.add(i_cell, i_lab, stack)
        self.until(self.at(0, "hierarchy"))
        self.play(stack.animate.set_opacity(1).shift(m.DOWN * 0.1), run_time=1.0)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "maximal"))
        flow = m.Arrow(stack[0].get_top() + m.UP * 0.1, stack[0].get_top() + m.UP * 0.9, buff=0.05, color=GOLD, stroke_width=5)
        mat = T("MAXIMAL MATERIAL BENEFIT", 26, GOLD).next_to(i_cell, m.UP, buff=0.2)
        self.play(m.GrowArrow(flow), m.FadeIn(mat), run_time=0.7)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "suppression"))
        alloc = T("SUPPRESSION ALLOCATION", 28, OK).next_to(i_cell, m.DOWN, buff=0.25)
        self.play(m.FadeIn(alloc), run_time=0.7)
        self.until(self.beat_end(2) - 0.3)
