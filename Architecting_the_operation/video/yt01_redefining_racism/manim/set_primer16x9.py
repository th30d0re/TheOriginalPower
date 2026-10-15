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

    def _footnote(self, text, color=GOLD):
        return T(text, 32, color, "NORMAL", width=4.0).move_to([4.25, 2.95, 0])

    def _swap_note(self, old, new):
        if old is None:
            self.play(m.FadeIn(new), run_time=0.25)
        else:
            self.remove(old)
            self.play(m.FadeIn(new), run_time=0.25)
        return new

    def _universe(self):
        u = m.Rectangle(width=UW, height=UH, stroke_color=DIM, stroke_width=3, fill_color=NAVY2, fill_opacity=0.12)
        u.move_to([0, -0.95, 0])
        u_lab = M(r"U", 44, INK).move_to(u.get_corner(m.UL) + m.DR * 0.45)
        return u, u_lab

    def shot_S02_01(self):
        key = T("NOTATION KEY", 44, GOLD).to_edge(m.UP, buff=0.45)
        u, u_lab = self._universe()
        note = None
        self.add(key, u, u_lab)
        self.until(self.at(0, "foundation"))
        self.until(self.beat_end(0) - 0.3)

        # 1 — set I with population
        self.until(self.at(1, "capital"))
        i_rect = m.RoundedRectangle(width=UW * 0.46, height=UH * 0.78, corner_radius=0.14,
                                    stroke_color=HIM, stroke_width=4, fill_color=NAVY2, fill_opacity=0.45)
        i_rect.move_to(u.get_center() + m.LEFT * UW * 0.22)
        i_lab = M(r"I", 44, HIM).next_to(i_rect, m.UP, buff=0.08)
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
        sub = M(r"E \subset I", 48, GOLD).move_to([4.85, 2.35, 0])
        self.play(m.FadeIn(e_rect), m.FadeIn(e_lab), m.FadeIn(e_pop), m.FadeIn(sub), run_time=0.75)
        self.until(self.beat_end(3) - 0.2)

        # 4 — example: every E member pulses
        self.until(self.at(4, "example"))
        self.play(m.LaggedStart(*[m.Indicate(d) for d in e_pop], lag_ratio=0.12), run_time=0.85)
        self.until(self.beat_end(4) - 0.2)

        # 5 — proper subset: I members outside E
        self.until(self.at(5, "implies"))
        outside = m.VGroup(*[d for d in pop if d.get_center()[0] > e_rect.get_right()[0] - 0.35])
        extra = m.Dot(radius=0.09, color=OK).move_to(i_rect.get_right() + m.LEFT * 0.55)
        outside.add(extra)
        self.play(m.LaggedStart(*[d.animate.set_color(OK) for d in outside], lag_ratio=0.08),
                  m.Indicate(i_rect), run_time=0.9)
        self.until(self.beat_end(5) - 0.2)

        # 6 — ∈ vs ⊂
        self.until(self.at(6, "distinct"))
        rel = M(r"x \in E,\quad E \subset I", 44, INK).move_to([0, 2.85, 0])
        note = self._swap_note(note, self._footnote("ELEMENT OF  ·  SUBSET OF", DIM))
        self.play(m.FadeIn(rel), run_time=0.55)
        self.until(self.beat_end(6) - 0.2)
        self.play(m.FadeOut(rel), run_time=0.25)

        sym_y = 2.85
        overlap = None

        # 7 — union
        self.until(self.at(7, "union"))
        self.play(m.FadeOut(sub), m.FadeOut(e_rect), m.FadeOut(e_lab), m.FadeOut(e_pop),
                  m.FadeOut(outside), run_time=0.25)
        o_rect = m.RoundedRectangle(width=UW * 0.46, height=UH * 0.78, corner_radius=0.14,
                                    stroke_color=HER, stroke_width=4, fill_color=NAVY2, fill_opacity=0.45)
        o_rect.move_to(u.get_center() + m.RIGHT * UW * 0.12)
        i_rect.move_to(u.get_center() + m.LEFT * UW * 0.12)
        o_lab = M(r"O", 44, HER).next_to(o_rect, m.UP, buff=0.08)
        o_pop = person_field(8, HER).scale(0.9).move_to(o_rect)
        overlap = m.Intersection(i_rect, o_rect, color=GOLD, fill_opacity=0.35, stroke_width=0)
        self.play(i_rect.animate.move_to(u.get_center() + m.LEFT * UW * 0.12),
                  m.FadeIn(o_rect), m.FadeIn(o_lab), m.FadeIn(o_pop), run_time=0.55)
        union_row, _ = sym_name(r"\cup", "UNION")
        union_row.move_to([0, sym_y, 0])
        self.play(m.FadeIn(overlap), m.FadeIn(union_row), run_time=0.65)
        self.until(self.beat_end(7) - 0.2)

        # 8 — intersection
        self.until(self.at(8, "intersection"))
        self.play(m.FadeOut(union_row), run_time=0.2)
        inter_row, _ = sym_name(r"\cap", "INTERSECTION")
        inter_row.move_to([0, sym_y, 0])
        lens = m.Intersection(i_rect, o_rect, color=GOLD, fill_opacity=0.65, stroke_color=GOLD, stroke_width=3)
        self.play(m.FadeIn(inter_row), m.Transform(overlap, lens), run_time=0.65)
        overlap = lens
        self.until(self.beat_end(8) - 0.2)

        # 9 — OR / AND
        self.until(self.at(9, "intersection"))
        or_lab = T("OR", 40, HIM).next_to(i_lab, m.DOWN, buff=0.12)
        and_lab = T("AND", 40, GOLD).move_to(overlap.get_center() + m.UP * 0.35)
        note = self._swap_note(note, self._footnote("OR  ·  AND"))
        self.play(m.FadeIn(or_lab), m.FadeIn(and_lab), run_time=0.55)
        self.until(self.beat_end(9) - 0.2)
        self.play(m.FadeOut(or_lab), m.FadeOut(and_lab), m.FadeOut(inter_row), m.FadeOut(overlap), run_time=0.3)
        overlap = None

        # 10 — empty set
        self.until(self.at(10, "empty"))
        empty_row, _ = sym_name(r"\varnothing", "EMPTY SET", math_size=72, color=DIM)
        empty_row.move_to([0, sym_y, 0])
        self.play(m.FadeOut(pop), m.FadeOut(o_pop), m.FadeIn(empty_row), run_time=0.55)
        self.until(self.beat_end(10) - 0.2)

        # 11 — disjoint I ∩ O = ∅
        self.until(self.at(11, "intersection"))
        self.play(i_rect.animate.shift(m.LEFT * 0.55), o_rect.animate.shift(m.RIGHT * 0.55),
                  i_lab.animate.shift(m.LEFT * 0.55), o_lab.animate.shift(m.RIGHT * 0.55),
                  m.FadeOut(empty_row), run_time=0.65)
        cap_eq = M(r"I \cap O = \varnothing", 52, GOLD).move_to([0, sym_y, 0])
        self.play(m.FadeIn(cap_eq), run_time=0.45)
        self.until(self.beat_end(11) - 0.2)

        # 12 — disjoint union glyph
        self.until(self.at(12, "dot"))
        dot_row, _ = sym_name(r"\dot\cup", "DISJOINT UNION", math_size=68)
        dot_row.move_to([0, sym_y, 0])
        self.play(m.FadeOut(cap_eq), m.FadeIn(dot_row), run_time=0.45)
        self.until(self.beat_end(12) - 0.2)

        # 13 — count once
        self.until(self.at(13, "twice"))
        pop_i = person_field(6, INK).scale(0.85).move_to(i_rect)
        pop_o = person_field(5, HER).scale(0.85).move_to(o_rect)
        self.play(m.FadeIn(pop_i), m.FadeIn(pop_o), run_time=0.35)
        count = M(r"1", 56, OK).move_to([0, sym_y, 0])
        note = self._swap_note(note, self._footnote("COUNT ONCE", OK))
        self.play(m.FadeOut(dot_row), pop_i[0].animate.move_to(i_rect.get_center()),
                  pop_o[0].animate.move_to(o_rect.get_center()), m.FadeIn(count), run_time=0.75)
        self.until(self.beat_end(13) - 0.2)
        self.play(m.FadeOut(count), m.FadeOut(pop_i), m.FadeOut(pop_o), run_time=0.25)

        # 14 — partition of U into I | O
        self.until(self.at(14, "partition"))
        if note is not None:
            self.play(m.FadeOut(note), run_time=0.15)
            note = None
        part_line = m.Line(u.get_top() + m.DOWN * 0.08, u.get_bottom() + m.UP * 0.08, color=GOLD, stroke_width=4)
        part_line.move_to(u.get_center())
        part_pop_i = person_field(10, INK).move_to(i_rect)
        part_pop_o = person_field(10, HER).move_to(o_rect)
        self.play(m.FadeOut(sub), m.FadeOut(e_lab), m.FadeOut(e_rect), m.FadeOut(e_pop),
                  m.Create(part_line), m.FadeIn(part_pop_i), m.FadeIn(part_pop_o), run_time=0.75)
        self.until(self.beat_end(14) - 0.2)

        # 15 — coverage + disjointness
        self.until(self.at(15, "disjointness"))
        note = self._swap_note(note, self._footnote("COVERAGE · DISJOINTNESS"))
        self.play(m.Indicate(u), m.Indicate(part_pop_i), m.Indicate(part_pop_o), run_time=1.0)
        self.until(self.beat_end(15) - 0.2)

        # 16 — one cell per projection
        self.until(self.at(16, "projection"))
        locks = m.VGroup()
        for d in part_pop_i:
            cell = m.Rectangle(width=0.35, height=0.35, stroke_color=HIM, stroke_width=2)
            cell.move_to(d)
            locks.add(cell)
        note = self._swap_note(note, self._footnote("ONE CELL PER PROJECTION", INK))
        self.play(m.FadeIn(locks), run_time=0.55)
        self.until(self.beat_end(16) - 0.2)
        self.play(m.FadeOut(locks), run_time=0.2)

        # 17 — refine I into four cells
        self.until(self.at(17, "refine"))
        refine = m.VGroup()
        for _ in range(4):
            cell = m.Rectangle(width=i_rect.width - 0.35, height=(i_rect.height - 0.5) / 4,
                                 stroke_color=GOLD, stroke_width=3, fill_color=NAVY2, fill_opacity=0.35)
            refine.add(cell)
        refine.arrange(m.DOWN, buff=0.06).move_to(i_rect)
        self.play(m.FadeIn(refine), run_time=0.65)
        self.until(self.beat_end(17) - 0.2)

        # 18 — race vs capital, then Eq. (binary-partition)
        self.until(self.at(18, "projection"))
        if note is not None:
            self.play(m.FadeOut(note), run_time=0.15)
            note = None
        race = T("RACE", 36, HIM).next_to(i_rect, m.DOWN, buff=0.12)
        cap_ax = T("CAPITAL", 36, HER).next_to(o_rect, m.DOWN, buff=0.12)
        person = m.Dot(radius=0.14, color=GOLD).move_to(i_rect.get_center())
        self.play(m.FadeIn(race), m.FadeIn(cap_ax), m.FadeIn(person), run_time=0.45)
        self.until(self.at(18, "capital"))
        self.play(person.animate.move_to(o_rect.get_center()), run_time=0.75)

        eq1 = M(r"U = I \,\dot\cup\, O", 56, INK)
        eq2 = M(r"I \cap O = \varnothing", 56, GOLD)
        eq_block = m.VGroup(eq1, eq2).arrange(m.DOWN, buff=0.55).move_to([0, 0.2, 0])
        diagram = m.VGroup(*[mob for mob in self.mobjects if mob is not eq_block])
        self.play(m.FadeOut(diagram), m.FadeIn(eq_block), run_time=0.9)
        self.until(self.beat_end(18) - 0.35)
