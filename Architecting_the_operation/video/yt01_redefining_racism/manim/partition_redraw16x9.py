"""S19-05a: Bacon's Rebellion — Elite redraws the partition (Equation 2.1 → 4.3)."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

UW, UH = 12.4, 5.2
I_W, O_W = 5.35, 5.35


def universe_frame():
    u = m.Rectangle(width=UW, height=UH, stroke_color=DIM, stroke_width=3, fill_color=NAVY2, fill_opacity=0.12)
    u.move_to([0, -0.25, 0])
    eq = M(r"U = I \,\dot\cup\, O", 52, INK)
    eq.next_to(u, m.UP, buff=0.18)
    gap = 0.32
    i_box = m.RoundedRectangle(
        width=I_W, height=UH * 0.84, corner_radius=0.12, stroke_color=HIM, stroke_width=4,
        fill_color=NAVY2, fill_opacity=0.35,
    )
    o_box = m.RoundedRectangle(
        width=O_W, height=UH * 0.84, corner_radius=0.12, stroke_color=HER, stroke_width=4,
        fill_color=NAVY2, fill_opacity=0.35,
    )
    i_box.move_to(u.get_center() + m.LEFT * (O_W / 2 + gap / 2))
    o_box.move_to(u.get_center() + m.RIGHT * (I_W / 2 + gap / 2))
    i_lab = M(r"I", 44, HIM).next_to(i_box, m.LEFT, buff=0.14)
    o_lab = M(r"O", 44, HER).next_to(o_box, m.RIGHT, buff=0.14)
    boundary = m.Line(i_box.get_right(), o_box.get_left(), color=GOLD, stroke_width=5)
    return m.VGroup(u, eq, i_box, o_box, i_lab, o_lab, boundary)


def labor_block(parent):
    outer = m.RoundedRectangle(
        width=4.35, height=3.05, corner_radius=0.12, stroke_color=INK, stroke_width=4,
        fill_color=NAVY2, fill_opacity=0.55,
    )
    outer.move_to(parent.get_center())
    lw = m.RoundedRectangle(
        width=2.05, height=2.85, corner_radius=0.08, stroke_color=HIM, stroke_width=3,
        fill_color=HIM, fill_opacity=0.18,
    )
    lb = m.RoundedRectangle(
        width=2.05, height=2.85, corner_radius=0.08, stroke_color=HER, stroke_width=3,
        fill_color=HER, fill_opacity=0.18,
    )
    halves = m.VGroup(lw, lb).arrange(m.RIGHT, buff=0.08).move_to(outer)
    split = m.Line(halves.get_top(), halves.get_bottom(), color=DIM, stroke_width=3)
    l_white = M(r"L_{\text{white}}", 36, HIM).move_to(lw)
    l_black = M(r"L_{\text{black}}", 36, HER).move_to(lb)
    field = m.VGroup(*[
        m.Line(
            halves.get_left() + m.RIGHT * (0.3 + 0.42 * j),
            halves.get_right() + m.LEFT * (0.3 + 0.32 * j),
            color=DIM,
            stroke_width=2,
        )
        for j in range(3)
    ]).shift(m.DOWN * 0.28)
    lab = T("Labor Class", 34, GOLD).next_to(outer, m.UP, buff=0.08)
    return m.VGroup(outer, halves, split, l_white, l_black, field, lab)


def i_tier_stack(i_box):
    symbols = [
        (r"E", GOLD),
        (r"P_{\text{puppet}}", DIM),
        (r"F_{\text{enforce}}", INK),
        (r"I_{\text{buffer}} \supseteq L_{\text{white}}", OK),
    ]
    rows = m.VGroup()
    for sym, col in symbols:
        row = m.RoundedRectangle(
            width=I_W * 0.82,
            height=0.66,
            corner_radius=0.08,
            stroke_color=col,
            stroke_width=3,
            fill_color=NAVY2,
            fill_opacity=0.7,
        )
        lab = M(sym, 36, col).move_to(row)
        if lab.width > row.width * 0.94:
            lab.scale_to_fit_width(row.width * 0.94)
        rows.add(m.VGroup(row, lab))
    rows.arrange(m.DOWN, buff=0.11).move_to(i_box)
    return rows


def psi_status_badge(buffer_row):
    psi = M(r"\psi_s", 44, GOLD)
    status = T("status wage", 36, INK)
    cost = T("costs E nothing", 36, OK)
    row = m.VGroup(psi, status, cost).arrange(m.RIGHT, buff=0.28)
    plate = m.RoundedRectangle(
        width=row.width + 0.42,
        height=row.height + 0.28,
        corner_radius=0.1,
        stroke_color=GOLD,
        stroke_width=3,
        fill_color=NAVY2,
        fill_opacity=0.92,
    )
    content = m.VGroup(plate, row)
    content.next_to(buffer_row[0], m.DOWN, buff=0.1)
    max_w = buffer_row[0].width * 0.98
    if content.width > max_w:
        content.scale_to_fit_width(max_w)
    return plate, psi, status, cost


def guarded_boundary_wall(i_box, o_box):
    y_top = i_box.get_top()[1] - 0.06
    y_bot = i_box.get_bottom()[1] + 0.06
    total_h = y_top - y_bot
    gap_mid = (i_box.get_right()[0] + o_box.get_left()[0]) / 2
    x_slab = gap_mid - 0.1
    slab = m.Rectangle(
        width=0.16,
        height=total_h,
        stroke_color=INK,
        stroke_width=2,
        fill_color=INK,
        fill_opacity=0.55,
    ).move_to([x_slab, (y_top + y_bot) / 2, 0])
    n = max(7, int(total_h / 0.42))
    step = total_h / n
    crenel = m.VGroup()
    for i in range(n):
        y = y_bot + (i + 0.5) * step
        tooth_w = 0.26 if i % 2 == 0 else 0.2
        tooth = m.Rectangle(
            width=tooth_w,
            height=step * 0.82,
            stroke_color=INK,
            stroke_width=2,
            fill_color=INK,
            fill_opacity=0.95,
        )
        x_off = 0.07 if i % 2 == 0 else -0.05
        tooth.move_to([x_slab + x_off, y, 0])
        crenel.add(tooth)
    wall = m.VGroup(slab, crenel)
    armed = T("armed", 36, HER)
    police = T("polices the boundary", 36, HER)
    # One line under the wall, clear of the tiers inside I.
    labels = m.VGroup(armed, police).arrange(m.RIGHT, buff=0.25)
    labels.next_to(slab, m.DOWN, buff=0.5)
    labels.set_x(slab.get_center()[0])
    return wall, labels, armed, police


class PartitionRedraw(YTScene):
    SHOT = "S19-05a"
    SOURCE = "Source: The Original Power, Ch. 4 · partition redraw"

    def shot_S19_05a(self):
        fig = universe_frame()
        u, eq, i_box, o_box, i_lab, o_lab, boundary = fig
        self.add(fig)
        self.until(self.at(0, "partition"))
        self.play(eq.animate.scale(1.06), run_time=0.45)
        self.until(self.beat_end(0) - 0.25)

        labor = labor_block(o_box)
        self.until(self.at(1, "Chapter"))
        self.play(m.FadeIn(labor), run_time=0.65)
        self.until(self.at(1, "fields"))
        self.play(labor[5].animate.set_stroke(INK, 4), run_time=0.35)
        self.until(self.beat_end(1) - 0.25)

        jamestown = T("1676 · Jamestown", 34, HER).move_to(o_box.get_top() + m.DOWN * 0.28)
        flame = m.Triangle(color=HER, fill_opacity=1, fill_color=HER).scale(0.16)
        flame.next_to(jamestown, m.RIGHT, buff=0.1)
        self.until(self.at(2, "Together"))
        self.play(
            labor[1].animate.set_stroke(GOLD, 5),
            labor[0].animate.set_stroke(GOLD, 5),
            run_time=0.5,
        )
        self.until(self.at(2, "burned"))
        self.play(m.FadeOut(labor[6]), m.FadeIn(flame), m.FadeIn(jamestown), run_time=0.55)
        self.until(self.beat_end(2) - 0.25)

        lw_half = labor[1][0]
        l_white_lab = labor[3]
        white_tag = T("White", 36, HIM)
        self.until(self.at(3, "redrew"))
        new_bound = m.CubicBezier(
            i_box.get_right() + m.UP * 0.95,
            i_box.get_right() + m.RIGHT * 0.55 + m.UP * 0.25,
            o_box.get_left() + m.LEFT * 0.55 + m.DOWN * 0.15,
            o_box.get_left() + m.DOWN * 0.85,
            color=GOLD,
            stroke_width=5,
        )
        self.play(m.Create(new_bound), boundary.animate.set_opacity(0.12), run_time=0.75)
        self.until(self.at(3, "moved"))
        buffer_slot = i_box.get_center() + m.DOWN * 0.55
        white_tag.move_to(buffer_slot + m.DOWN * 0.55)
        self.play(
            lw_half.animate.move_to(buffer_slot),
            l_white_lab.animate.move_to(buffer_slot),
            m.FadeIn(white_tag),
            run_time=0.85,
        )
        self.until(self.beat_end(3) - 0.25)

        tiers = i_tier_stack(i_box)
        o_race = m.RoundedRectangle(
            width=O_W * 0.86,
            height=UH * 0.52,
            corner_radius=0.1,
            stroke_color=HER,
            stroke_width=4,
            fill_color=HER,
            fill_opacity=0.25,
        )
        o_race.move_to(o_box.get_center())
        o_inner = m.VGroup(
            M(r"O_{\text{racialized}}", 40, HER),
            M(r"= L_{\text{black}}", 38, HER),
        ).arrange(m.DOWN, buff=0.1).move_to(o_race)
        lb_half = labor[1][1]
        l_black_lab = labor[4]
        self.until(self.at(4, "buffer"))
        self.play(
            m.FadeIn(tiers),
            m.FadeOut(l_white_lab, white_tag, lw_half),
            run_time=0.65,
        )
        self.until(self.at(4, "racialized"))
        self.play(
            m.FadeOut(labor[0], labor[2], labor[5], labor[6], flame, jamestown, labor[1], l_black_lab),
            lb_half.animate.move_to(o_race),
            m.FadeIn(o_race),
            m.FadeIn(o_inner),
            tiers[-1][0].animate.set_stroke(OK, 6),
            run_time=0.85,
        )
        self.until(self.beat_end(4) - 0.25)

        plate, psi_sym, status_txt, cost_txt = psi_status_badge(tiers[-1])
        self.until(self.at(5, "status"))
        self.play(m.FadeIn(plate), m.FadeIn(psi_sym), m.FadeIn(status_txt), run_time=0.45)
        self.until(self.at(5, "nothing"))
        self.play(m.FadeIn(cost_txt), tiers[-1][1].animate.set_color(GOLD), run_time=0.4)
        self.until(self.beat_end(5) - 0.25)

        wall, _, armed_lab, police_lab = guarded_boundary_wall(i_box, o_box)
        self.until(self.at(6, "armed"))
        self.play(m.FadeIn(wall), m.FadeIn(armed_lab), run_time=0.55)
        self.until(self.at(6, "police"))
        self.play(m.FadeIn(police_lab), run_time=0.45)
        self.until(self.beat_end(6) - 0.25)

        split_y = u.get_bottom()[1] + 0.12
        labor_line = m.DashedLine(
            [i_box.get_right()[0], split_y, 0],
            [o_race.get_left()[0], split_y, 0],
            color=HER,
            stroke_width=3,
            dash_length=0.1,
        )
        eq43 = M(
            r"\text{Buffer Created:}\quad I_{\text{poor}} \rightarrow \text{Defender of } E",
            44,
            GOLD,
        )
        if eq43.width > 10.5:
            eq43.scale_to_fit_width(10.5)
        eq_tag = T("Equation 4.3", 36, DIM)
        eq_block = m.VGroup(eq_tag, eq43).arrange(m.DOWN, buff=0.08)
        eq_block.to_edge(m.UP, buff=0.42)
        self.until(self.at(7, "Equation"))
        self.play(m.FadeOut(eq), m.FadeIn(eq_block), m.FadeIn(labor_line), run_time=0.65)
        self.until(self.at(7, "middle"))
        self.play(labor_line.animate.set_stroke(width=5), run_time=0.45)
        self.until(self.beat_end(7) - 0.2)
