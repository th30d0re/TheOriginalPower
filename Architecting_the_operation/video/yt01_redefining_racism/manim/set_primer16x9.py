"""S02-01: set-theory primer for Chapter 2 notation (19-shot run)."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HIM, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

UW, UH = 12.6, 5.6


def person_field(n, color=INK):
    g = m.VGroup(*[m.Dot(radius=0.09, color=color) for _ in range(n)])
    cols = min(4, max(2, n))
    rows = (n + cols - 1) // cols
    g.arrange_in_grid(rows, cols, buff=0.28)
    return g


def sym_name(tex, name, math_size=64, name_size=36, color=GOLD):
    sym = M(tex, math_size, color)
    lab = T(name, name_size, INK)
    row = m.VGroup(sym, lab).arrange(m.RIGHT, buff=0.45)
    return row, sym


class SetTheoryPrimer(YTScene):
    SHOT = "S02-01"
    SOURCE = "Source: The Original Power, Ch. 2 · set-theoretic primer"

    def _heading(self, title, math_line=None):
        parts = [T(title, 44, GOLD)]
        if math_line:
            parts.append(M(math_line, 40, INK))
        block = m.VGroup(*parts).arrange(m.DOWN, buff=0.18, aligned_edge=m.LEFT)
        block.to_edge(m.UP, buff=0.38)
        return block

    def _universe(self):
        u = m.Rectangle(width=UW, height=UH, stroke_color=DIM, stroke_width=3, fill_color=NAVY2, fill_opacity=0.12)
        u.move_to([0, -0.95, 0])
        u_lab = M(r"U", 40, INK).next_to(u, m.UP, buff=0.06).align_to(u, m.LEFT).shift(m.RIGHT * 0.35)
        return u, u_lab

    def _io_partition_pos(self, u):
        gap = 0.22
        i_pos = u.get_center() + m.LEFT * (UW * 0.24 + gap * 0.5)
        o_pos = u.get_center() + m.RIGHT * (UW * 0.24 + gap * 0.5)
        return i_pos, o_pos

    def _ab_example(self, center=(0, -0.2, 0)):
        a = m.Ellipse(width=5.0, height=3.6, stroke_color=HIM, stroke_width=4,
                      fill_color=HIM, fill_opacity=0.22)
        b = m.Ellipse(width=5.0, height=3.6, stroke_color=HER, stroke_width=4,
                      fill_color=HER, fill_opacity=0.22)
        a.move_to([center[0] - 1.05, center[1], 0])
        b.move_to([center[0] + 1.05, center[1], 0])
        a_lab = M(r"A", 44, HIM).next_to(a, m.UP, buff=0.12)
        b_lab = M(r"B", 44, HER).next_to(b, m.UP, buff=0.12)
        return m.VGroup(a, b, a_lab, b_lab)

    def _hero_eq21(self):
        row1 = m.VGroup(
            M(r"U", 76, INK),
            M(r"=", 76, INK),
            M(r"I", 76, HIM),
            M(r"\dot\cup", 76, GOLD),
            M(r"O", 76, HER),
        ).arrange(m.RIGHT, buff=0.28)
        row2 = m.VGroup(
            M(r"I", 76, HIM),
            M(r"\cap", 76, GOLD),
            M(r"O", 76, HER),
            M(r"=", 76, INK),
            M(r"\varnothing", 76, DIM),
        ).arrange(m.RIGHT, buff=0.28)
        return m.VGroup(row1, row2).arrange(m.DOWN, buff=0.65).move_to([0, 0.15, 0])

    def shot_S02_01(self):
        key = self._heading("NOTATION KEY")
        u, u_lab = self._universe()
        self.add(key, u, u_lab)
        self.until(self.at(0, "foundation"))
        self.until(self.beat_end(0) - 0.3)

        # 1 — set I with population
        self.until(self.at(1, "capital"))
        i_rect = m.RoundedRectangle(width=UW * 0.46, height=UH * 0.78, corner_radius=0.14,
                                    stroke_color=HIM, stroke_width=4, fill_color=NAVY2, fill_opacity=0.45)
        i_rect.move_to(u.get_center() + m.LEFT * UW * 0.22)
        i_lab = M(r"I", 44, HIM).next_to(i_rect, m.UP, buff=0.2)
        pop = person_field(12, INK).move_to(i_rect)
        self.play(m.FadeIn(i_rect), m.FadeIn(i_lab), m.FadeIn(pop), run_time=0.75)
        self.until(self.beat_end(1) - 0.2)

        # 2 — element of
        self.until(self.at(2, "element"))
        mark = M(r"\in", 48, GOLD).next_to(pop[0], m.UP, buff=0.18)
        self.play(pop[0].animate.set_color(GOLD).scale(1.4), m.FadeIn(mark), run_time=0.55)
        self.until(self.beat_end(2) - 0.2)
        self.play(m.FadeOut(mark), run_time=0.2)

        # 3 — E ⊂ I
        self.until(self.at(3, "subset"))
        e_rect = m.RoundedRectangle(width=2.6, height=1.85, corner_radius=0.12, stroke_color=GOLD, stroke_width=4,
                                    fill_color=NAVY2, fill_opacity=0.55)
        e_rect.move_to(i_rect.get_center() + m.LEFT * 0.55 + m.DOWN * 0.1)
        e_pop = person_field(5, GOLD).scale(0.85).move_to(e_rect)
        e_lab = M(r"E", 40, GOLD).next_to(e_rect, m.UP, buff=0.06)
        sub = M(r"E \subset I", 48, GOLD)
        sub.next_to(key, m.DOWN, buff=0.22).align_to(key, m.LEFT)
        self.play(m.FadeIn(e_rect), m.FadeIn(e_lab), m.FadeIn(e_pop), m.FadeIn(sub), run_time=0.75)
        self.until(self.beat_end(3) - 0.2)

        # 4 — example: every E member pulses (E only)
        self.until(self.at(4, "example"))
        self.play(
            pop.animate.set_opacity(0.25),
            e_rect.animate.set_stroke(width=6),
            m.LaggedStart(*[m.Indicate(d, scale_factor=1.35) for d in e_pop], lag_ratio=0.14),
            run_time=0.95,
        )
        self.until(self.beat_end(4) - 0.2)
        self.play(pop.animate.set_opacity(1), e_rect.animate.set_stroke(width=4), run_time=0.2)

        # 5 — proper subset: I members outside E
        self.until(self.at(5, "implies"))
        outside = m.VGroup(*[d for d in pop if d.get_center()[0] > e_rect.get_right()[0] - 0.35])
        extra = m.Dot(radius=0.09, color=OK).move_to(i_rect.get_right() + m.LEFT * 0.55)
        outside.add(extra)
        prop = M(r"\subset", 52, OK).next_to(i_rect, m.RIGHT, buff=0.12)
        self.play(
            e_pop.animate.set_opacity(0.35),
            m.LaggedStart(*[d.animate.set_color(OK).scale(1.25) for d in outside], lag_ratio=0.08),
            m.FadeIn(prop),
            run_time=0.9,
        )
        self.until(self.beat_end(5) - 0.2)
        self.play(m.FadeOut(prop), e_pop.animate.set_opacity(1), run_time=0.2)

        # 6 — ∈ vs ⊂
        self.until(self.at(6, "distinct"))
        self.play(m.FadeOut(sub), run_time=0.15)
        key2 = self._heading("NOTATION KEY", r"x \in E,\quad E \subset I")
        self.remove(key)
        self.add(key2)
        key = key2
        self.until(self.beat_end(6) - 0.2)

        sym_y = 2.45
        ab_center = (0, -1.05, 0)
        o_rect = o_lab = o_pop = None
        union_fill = None

        # 7 — union on generic A ∪ B only (U and I/O off screen)
        self.until(self.at(7, "union"))
        if len(key) > 1:
            self.play(m.FadeOut(key[1]), run_time=0.15)
        self.play(
            m.FadeOut(u), m.FadeOut(u_lab), m.FadeOut(i_rect), m.FadeOut(i_lab), m.FadeOut(pop),
            m.FadeOut(e_rect), m.FadeOut(e_lab), m.FadeOut(e_pop), m.FadeOut(outside),
            run_time=0.4,
        )
        self.clear()
        key = self._heading("NOTATION KEY")
        self.add(key)
        i_rect = m.RoundedRectangle(width=UW * 0.46, height=UH * 0.78, corner_radius=0.14,
                                    stroke_color=HIM, stroke_width=4, fill_color=NAVY2, fill_opacity=0.45)
        i_lab = M(r"I", 44, HIM)
        ab_demo = self._ab_example(ab_center)
        a_shape, b_shape = ab_demo[0], ab_demo[1]
        union_fill = m.Union(a_shape, b_shape, color=GOLD, fill_opacity=0.48, stroke_width=0)
        union_row, _ = sym_name(r"\cup", "UNION")
        union_row.move_to([0, sym_y, 0])
        self.play(m.FadeIn(ab_demo), m.FadeIn(union_fill), m.FadeIn(union_row), run_time=0.7)
        self.until(self.beat_end(7) - 0.2)

        # 8 — intersection lens on the same A ∩ B example
        self.until(self.at(8, "intersection"))
        ab_lens = m.Intersection(a_shape, b_shape, color=GOLD, fill_opacity=0.72, stroke_color=GOLD, stroke_width=3)
        inter_row, _ = sym_name(r"\cap", "INTERSECTION")
        inter_row.move_to([0, sym_y, 0])
        self.play(
            m.FadeOut(union_row), m.FadeOut(union_fill),
            m.FadeIn(ab_lens), m.FadeIn(inter_row),
            run_time=0.65,
        )
        self.until(self.beat_end(8) - 0.2)

        # 9 — OR / AND on A ∪ B example
        self.until(self.at(9, "intersection"))
        union_ghost = m.Union(a_shape, b_shape, color=HIM, fill_opacity=0.18, stroke_width=0)
        or_lab = T("OR", 36, HIM).move_to(union_ghost.get_center() + m.LEFT * 0.55)
        and_lab = T("AND", 36, GOLD).move_to(ab_lens.get_center() + m.UP * 0.35)
        self.play(m.FadeIn(union_ghost), m.FadeIn(or_lab), m.FadeIn(and_lab), run_time=0.55)
        self.until(self.beat_end(9) - 0.2)
        self.play(
            m.FadeOut(or_lab), m.FadeOut(and_lab), m.FadeOut(union_ghost),
            m.FadeOut(inter_row), m.FadeOut(ab_lens), m.FadeOut(ab_demo),
            run_time=0.35,
        )

        # 10 — empty set; restore U with disjoint I and O
        self.until(self.at(10, "empty"))
        i_pos, o_pos = self._io_partition_pos(u)
        o_rect = m.RoundedRectangle(width=UW * 0.46, height=UH * 0.78, corner_radius=0.14,
                                    stroke_color=HER, stroke_width=4, fill_color=NAVY2, fill_opacity=0.45)
        o_rect.move_to(o_pos)
        o_lab = M(r"O", 44, HER).next_to(o_rect, m.UP, buff=0.2)
        i_rect.move_to(i_pos)
        i_lab.next_to(i_rect, m.UP, buff=0.2)
        pop = person_field(12, INK).move_to(i_rect)
        o_pop = person_field(8, HER).scale(0.9).move_to(o_rect)
        empty_row, _ = sym_name(r"\varnothing", "EMPTY SET", math_size=72, color=DIM)
        empty_row.move_to([0, sym_y, 0])
        self.play(
            m.FadeIn(u), m.FadeIn(u_lab), m.FadeIn(i_rect), m.FadeIn(i_lab),
            m.FadeIn(o_rect), m.FadeIn(o_lab), m.FadeIn(pop), m.FadeIn(o_pop),
            m.FadeIn(empty_row),
            run_time=0.75,
        )
        self.until(self.beat_end(10) - 0.2)

        # 11 — I ∩ O = ∅ (boxes stay disjoint)
        self.until(self.at(11, "intersection"))
        cap_eq = M(r"I \cap O = \varnothing", 52, GOLD).move_to([0, sym_y, 0])
        self.play(m.FadeOut(empty_row), m.FadeIn(cap_eq), run_time=0.45)
        self.until(self.beat_end(11) - 0.2)

        # 12 — disjoint union glyph (large, between cells)
        self.until(self.at(12, "dot"))
        dot_sym = M(r"\dot\cup", 72, GOLD)
        dot_name = T("DISJOINT UNION", 34, INK)
        dot_row = m.VGroup(dot_sym, dot_name).arrange(m.RIGHT, buff=0.4)
        dot_row.move_to([0, 2.45, 0])
        self.play(m.FadeOut(cap_eq), m.FadeIn(dot_row), run_time=0.5)
        self.until(self.beat_end(12) - 0.2)

        # 13 — count once (dots travel; glyph clears)
        self.until(self.at(13, "twice"))
        lone_i = m.Dot(radius=0.12, color=INK).move_to([0, sym_y - 0.9, 0])
        lone_o = m.Dot(radius=0.12, color=HER).move_to([0, sym_y - 0.9, 0])
        count = M(r"\times 1", 64, OK).move_to([0, sym_y, 0])
        self.play(m.FadeOut(dot_row), m.FadeIn(lone_i), m.FadeIn(lone_o), run_time=0.25)
        self.play(
            lone_i.animate.move_to(i_rect.get_center()),
            lone_o.animate.move_to(o_rect.get_center()),
            m.FadeIn(count),
            run_time=0.75,
        )
        self.until(self.beat_end(13) - 0.2)
        self.play(m.FadeOut(count), m.FadeOut(lone_i), m.FadeOut(lone_o), run_time=0.25)

        # 14 — partition of U into I | O
        self.until(self.at(14, "partition"))
        x_mid = 0.5 * (i_rect.get_right()[0] + o_rect.get_left()[0])
        part_line = m.Line(
            [x_mid, u.get_top()[1] - 0.12, 0],
            [x_mid, u.get_bottom()[1] + 0.12, 0],
            color=GOLD,
            stroke_width=4,
        )
        part_pop_i = person_field(10, INK).move_to(i_rect)
        part_pop_o = person_field(10, HER).move_to(o_rect)
        self.play(m.Create(part_line), m.FadeIn(part_pop_i), m.FadeIn(part_pop_o), run_time=0.75)
        self.until(self.beat_end(14) - 0.2)

        # 15 — coverage + disjointness
        self.until(self.at(15, "disjointness"))
        self.play(m.Indicate(u), m.Indicate(part_pop_i), m.Indicate(part_pop_o), run_time=1.0)
        self.until(self.beat_end(15) - 0.2)

        # 16 — one cell per projection
        self.until(self.at(16, "projection"))
        locks = m.VGroup()
        for d in part_pop_i[:4]:
            cell = m.Rectangle(width=0.35, height=0.35, stroke_color=HIM, stroke_width=2)
            cell.move_to(d)
            locks.add(cell)
        self.play(m.FadeIn(locks), run_time=0.55)
        self.until(self.beat_end(16) - 0.2)
        self.play(m.FadeOut(locks), run_time=0.2)

        # 17 — refine I into four cells (inside I only)
        self.until(self.at(17, "refine"))
        inner_w = i_rect.width - 0.55
        inner_h = i_rect.height - 0.55
        refine = m.VGroup()
        for _ in range(4):
            cell = m.Rectangle(
                width=inner_w,
                height=inner_h / 4 - 0.05,
                stroke_color=GOLD,
                stroke_width=3,
                fill_color=NAVY2,
                fill_opacity=0.2,
            )
            refine.add(cell)
        refine.arrange(m.DOWN, buff=0.05).move_to(i_rect.get_center())
        self.play(m.FadeIn(refine), run_time=0.65)
        self.until(self.beat_end(17) - 0.2)

        # 18 — race vs capital, then Eq. (binary-partition)
        self.until(self.at(18, "projection"))
        race = T("RACE", 36, HIM).next_to(i_rect, m.DOWN, buff=0.12)
        cap_ax = T("CAPITAL", 36, HER).next_to(o_rect, m.DOWN, buff=0.12)
        person = m.Dot(radius=0.14, color=GOLD).move_to(i_rect.get_center() + m.UP * 0.15)
        self.play(m.FadeIn(race), m.FadeIn(cap_ax), m.FadeIn(person), run_time=0.45)
        self.until(self.at(18, "capital"))
        self.play(person.animate.move_to(o_rect.get_center() + m.UP * 0.15), run_time=0.75)

        eq_block = self._hero_eq21()
        keep = {eq_block}
        diagram = m.VGroup(*[mob for mob in self.mobjects if mob not in keep])
        self.play(m.FadeOut(diagram), m.FadeIn(eq_block), run_time=0.9)
        self.until(self.beat_end(18) - 0.35)
