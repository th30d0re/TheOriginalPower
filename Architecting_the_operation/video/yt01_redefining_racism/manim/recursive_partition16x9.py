"""S03-31 to S03-37: Equation 2.4, the local partition inside any class X.

One class X split into its local In-group and Out-group on an axis alpha. The axis panel
on the right changes with the narration; a person moves between the cells as the
projection changes (race, then capital; race, then gender), so the same person lands in
I under one projection and in O under another.

    YT01_SHOT=S03-31 .venv-manimgx/bin/manimgx render <this file> RecursivePartition -r 960x540 --fps 15
"""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, NAVY2, OK, M, T, YTScene  # noqa: E402

CELL_W, CELL_H, GAP = 4.15, 4.3, 0.22
CX = -1.85                       # centre of the class box; the axis panel sits to its right
CY = -0.35


def cell(color, tex, caption):
    box = m.RoundedRectangle(width=CELL_W, height=CELL_H, corner_radius=0.14, stroke_color=color,
                             stroke_width=4, fill_color=NAVY2, fill_opacity=1)
    sym = M(tex, 50, color)
    cap = T(caption, 30, color, "NORMAL")
    head = m.VGroup(sym, cap).arrange(m.DOWN, buff=0.08).move_to(box.get_top() + m.DOWN * 0.72)
    return box, head


class RecursivePartition(YTScene):
    SHOT = "S03-31"

    def person(self, label):
        dot = m.Dot(radius=0.2, color=GOLD)
        tag = T(label, 30, INK, "NORMAL", width=CELL_W - 0.5)
        return m.VGroup(dot, tag.next_to(dot, m.DOWN, buff=0.14))

    def place(self, who, box, run_time=0.9):
        return who.animate(run_time=run_time).move_to(box.get_center() + m.DOWN * 0.45)

    def set_axis(self, value, color=GOLD):
        new = T(value, 40 if "\n" not in value else 34, color, width=3.7)
        new.next_to(self.axis_head, m.DOWN, buff=0.25)
        self.play(m.Transform(self.axis_value, new), run_time=0.45)

    def shot_S03_33(self):
        eq = M(r"X=X^{+}_{\alpha}\,\dot\cup\,X^{-}_{\alpha}", 58, GOLD).to_edge(m.UP, buff=0.42)
        outer = m.RoundedRectangle(width=8.8, height=4.8, corner_radius=0.15, stroke_color=INK, stroke_width=3,
                                   fill_color=NAVY2, fill_opacity=0.2).shift(m.LEFT * 1.5 + m.DOWN * 0.35)
        plus_box, plus_head = cell(HIM, r"X^{+}_{\alpha}", "locally advantaged")
        minus_box, minus_head = cell(HER, r"X^{-}_{\alpha}", "locally subordinated")
        plus_box.move_to(outer.get_center() + m.LEFT * 2.15)
        minus_box.move_to(outer.get_center() + m.RIGHT * 2.15)
        plus_head.move_to(plus_box.get_top() + m.DOWN * 0.72)
        minus_head.move_to(minus_box.get_top() + m.DOWN * 0.72)
        rail = m.VGroup(*[T(v, 25, DIM) for v in ("GENDER", "WEALTH", "CREDENTIALS", "RELIGION", "RECORD")])
        rail.arrange(m.DOWN, buff=0.18).next_to(outer, m.RIGHT, buff=0.35)
        self.add(eq, outer)
        self.until(self.at(0, "alpha"))
        self.play(m.LaggedStart(*[m.FadeIn(v) for v in rail], lag_ratio=0.12), run_time=0.65)

        self.until(self.at(1, "advantaged"))
        cut = m.Line(outer.get_top(), outer.get_bottom(), color=GOLD, stroke_width=6).move_to(outer)
        self.play(m.Create(cut), m.FadeIn(plus_box), m.FadeIn(minus_box), m.FadeIn(plus_head), m.FadeIn(minus_head), run_time=0.75)

        self.until(self.at(2, "gender"))
        target = T("I_buffer · α = GENDER", 30, GOLD).next_to(eq, m.DOWN, buff=0.15)
        self.play(m.FadeIn(target), rail[0].animate.set_color(GOLD), run_time=0.55)

        self.until(self.at(3, "men"))
        male = T("HEAD-OF-HOUSEHOLD AUTHORITY", 27, HIM, width=3.7).move_to(plus_box).shift(m.DOWN * 0.5)
        female = T("PROPERTY + REPRODUCTIVE SUBORDINATION", 27, HER, width=3.7).move_to(minus_box).shift(m.DOWN * 0.5)
        self.play(m.FadeIn(male), m.FadeIn(female), run_time=0.6)

        self.until(self.at(4, "property"))
        hcuts = m.VGroup(
            m.Line(plus_box.get_left(), plus_box.get_right(), color=DIM, stroke_width=4),
            m.Line(minus_box.get_left(), minus_box.get_right(), color=DIM, stroke_width=4),
        )
        self.play(m.Create(hcuts), rail[1].animate.set_color(GOLD), rail[-1].animate.set_color(GOLD), run_time=0.65)

        self.until(self.at(5, "credentialing"))
        target2 = T("O_racialized · α = CREDENTIALS / SKIN TONE", 30, GOLD, width=7.5).move_to(target)
        incorporated = m.SurroundingRectangle(plus_head, color=OK, buff=0.12, stroke_width=4)
        self.play(m.Transform(target, target2), m.Create(incorporated), rail[2].animate.set_color(GOLD), run_time=0.65)
        self.until(self.beat_end(5) - 0.2)

    def shot_S03_31(self):
        eq = M(r"X = X^{+}_{\alpha} \,\dot\cup\, X^{-}_{\alpha}, \qquad X^{+}_{\alpha} \cap X^{-}_{\alpha} = \varnothing", 54)
        eq.to_edge(m.UP, buff=0.42)
        num = T("Equation 2.4", 30, DIM, "NORMAL").next_to(eq, m.DOWN, buff=0.12)
        outer = m.RoundedRectangle(width=2 * CELL_W + GAP + 0.5, height=CELL_H + 0.5, corner_radius=0.2,
                                   stroke_color=INK, stroke_width=3).move_to([CX, CY, 0])
        x_lab = M("X", 56, INK).next_to(outer, m.LEFT, buff=0.22)
        plus_box, plus_head = cell(HIM, r"X^{+}_{\alpha}", "local In-group")
        minus_box, minus_head = cell(HER, r"X^{-}_{\alpha}", "local Out-group")
        plus_box.move_to([CX - (CELL_W + GAP) / 2, CY, 0])
        minus_box.move_to([CX + (CELL_W + GAP) / 2, CY, 0])
        plus_head.move_to(plus_box.get_top() + m.DOWN * 0.72)
        minus_head.move_to(minus_box.get_top() + m.DOWN * 0.72)
        self.plus_box, self.minus_box, self.minus_head = plus_box, minus_box, minus_head

        panel_x = outer.get_right()[0] + 2.05
        axis_head = self.axis_head = T("axis α", 34, DIM).move_to([panel_x, CY + 1.2, 0])
        self.axis_value = T("any axis", 40, GOLD, width=3.7).next_to(axis_head, m.DOWN, buff=0.25)

        # 0 -- any class X can be split on a narrower axis
        self.add(eq, num)
        self.until(self.at(0, "class"))
        self.play(m.Create(outer), m.FadeIn(x_lab), run_time=0.8)
        self.until(self.at(0, "local"))
        self.play(m.FadeIn(plus_box), m.FadeIn(minus_box), m.FadeIn(plus_head), m.FadeIn(minus_head),
                  run_time=0.9)
        self.until(self.at(0, "axis"))
        self.play(m.FadeIn(axis_head), m.FadeIn(self.axis_value), run_time=0.6)

        # 1 -- plus and minus, empty intersection, the union rebuilds X
        self.until(self.at(1, "plus"))
        self.play(m.Indicate(plus_head, color=HIM, scale_factor=1.1), run_time=0.7)
        self.until(self.at(1, "minus"))
        self.play(m.Indicate(minus_head, color=HER, scale_factor=1.1), run_time=0.7)
        self.until(self.at(1, "intersection"))
        seam = m.Line(plus_box.get_corner(m.UR) + m.RIGHT * GAP / 2, plus_box.get_corner(m.DR) + m.RIGHT * GAP / 2,
                      color=GOLD, stroke_width=6)
        empty = M(r"\cap = \varnothing", 46, GOLD).next_to(outer, m.DOWN, buff=0.22)
        self.play(m.Create(seam), m.FadeIn(empty), run_time=0.7)
        self.until(self.at(1, "union"))
        whole = m.SurroundingRectangle(outer, color=GOLD, buff=0.08, stroke_width=4)
        self.play(m.FadeOut(seam), m.Create(whole), run_time=0.7)
        self.until(self.at(1, "whole"))
        self.play(m.FadeOut(whole), m.FadeOut(empty), run_time=0.5)

        # 2 -- the axes the chapter lists
        for word, value in (("race", "race"), ("class", "class"), ("gender", "gender"),
                            ("immigration", "immigration status"), ("criminalized", "criminalized status"),
                            ("geography", "geography"), ("credentialing", "credentialing"),
                            ("institutional", "proximity to\ninstitutional power")):
            self.until(self.at(2, word))
            self.set_axis(value)

        # 3 -- the same person, different projections
        self.until(self.at(3, "same"))
        someone = self.person("one person")
        someone.move_to([CX, outer.get_top()[1] - 0.05, 0]).shift(m.UP * 0.01)
        self.play(m.FadeIn(someone, scale=0.6), run_time=0.5)
        self.until(self.at(3, "ingroup"))
        self.set_axis("projection A")
        self.play(self.place(someone, plus_box))
        self.until(self.at(3, "outgroup"))
        self.set_axis("projection B")
        self.play(self.place(someone, minus_box))

        # 4 -- the working-class white citizen: In-group by race, Out-group by capital
        self.until(self.at(4, "working"))
        citizen = self.person("working-class white citizen").move_to(someone)
        self.play(m.ReplacementTransform(someone, citizen), run_time=0.5)
        self.until(self.at(4, "racial"))
        self.set_axis("race")
        self.play(self.place(citizen, plus_box))
        self.until(self.at(4, "capital"))
        self.set_axis("capital\ncredentialing\ncriminalization")
        self.play(self.place(citizen, minus_box))

        # 5 -- the white woman: In-group by race, Out-group by gender (O_gendered)
        self.until(self.at(5, "gender"))
        woman = self.person("white woman").move_to(citizen)
        self.play(m.ReplacementTransform(citizen, woman), run_time=0.5)
        self.until(self.at(5, "racial"))
        self.set_axis("race")
        self.play(self.place(woman, plus_box))
        self.until(self.at(5, "gender", nth=1))
        self.set_axis("gender")
        gendered = M(r"O_{\text{gendered}}", 50, HER).move_to(self.minus_head)
        self.play(self.place(woman, minus_box), m.Transform(self.minus_head, gendered), run_time=0.9)
        self.until(self.at(5, "chapter"))
        ch8 = T("Chapter 8", 30, DIM, "NORMAL").next_to(self.minus_head, m.DOWN, buff=0.1)
        self.play(m.FadeIn(ch8), run_time=0.4)

        # 6 -- a credentialed member of the racialized Out-group, locally advantaged
        self.until(self.at(6, "credentialed"))
        self.set_axis("race")
        racialized = M(r"O_{\text{racialized}}", 50, HER).move_to(self.minus_head)
        member = self.person("credentialed member").move_to(woman)
        self.play(m.Transform(self.minus_head, racialized), m.FadeOut(ch8),
                  m.ReplacementTransform(woman, member), run_time=0.6)
        self.play(self.place(member, minus_box), run_time=0.7)
        self.until(self.at(6, "advantage"))
        perch = m.RoundedRectangle(width=CELL_W - 0.9, height=0.55, corner_radius=0.1, stroke_color=OK,
                                   stroke_width=3).move_to(minus_box.get_center() + m.UP * 0.55)
        perch_lab = T("local advantage", 30, OK, "NORMAL").move_to(perch)
        self.play(m.Create(perch), m.FadeIn(perch_lab), member.animate.next_to(perch, m.DOWN, buff=0.1),
                  run_time=0.8)

        # 7 -- both flattening errors resolved
        self.until(self.at(7, "flattening"))
        self.play(m.FadeOut(member), m.FadeOut(perch), m.FadeOut(perch_lab), run_time=0.4)
        self.until(self.at(7, "stratification"))
        strat = T("I is stratified", 36, HIM).next_to(outer, m.DOWN, buff=0.25).align_to(outer, m.LEFT)
        self.play(m.FadeIn(strat, shift=m.UP * 0.15), run_time=0.5)
        self.until(self.at(7, "heterogeneity"))
        hetero = T("O is heterogeneous", 36, HER).next_to(outer, m.DOWN, buff=0.25).align_to(outer, m.RIGHT)
        self.play(m.FadeIn(hetero, shift=m.UP * 0.15), run_time=0.5)
