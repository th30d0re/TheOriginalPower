"""S09-01 antebellum kernel case; S09-13 cotton gin confound."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


def bar_group(labels, heights, colors, width=1.75, label_size=34):
    bars = m.VGroup()
    for label, h, col in zip(labels, heights, colors):
        rect = m.Rectangle(width=width, height=h, fill_color=col, fill_opacity=0.85, stroke_width=0)
        rect.move_to(m.DOWN * h / 2)
        cap = T(label, label_size, INK, width=width - 0.1).next_to(rect, m.DOWN, buff=0.14)
        bars.add(m.VGroup(rect, cap))
    bars.arrange(m.RIGHT, buff=0.55, aligned_edge=m.DOWN)
    return bars


class KernelOptimizationCase(YTScene):
    SHOT = "S09-01"

    def shot_S09_01(self):
        title = T("ANTEBELLUM KERNEL CASE", 44, GOLD).to_edge(m.UP, buff=0.42)
        span = T("1840–1860 · COTTON ECONOMY", 34, DIM, "NORMAL").next_to(title, m.DOWN, buff=0.2)
        kernel = T("KERNEL OBJECTIVE", 34, HER).next_to(span, m.DOWN, buff=0.3)
        frame = m.RoundedRectangle(width=12.0, height=4.6, corner_radius=0.14, stroke_color=GOLD, stroke_width=2,
                                   fill_color=NAVY2, fill_opacity=0.35)
        frame.next_to(kernel, m.DOWN, buff=0.24)
        rev = bar_group(("1840", "1850", "1860"), (1.0, 1.38, 3.33), (OK, OK, OK), width=1.65, label_size=34)
        sup = bar_group(("2.70%", "2.88%", "2.75%"), (0.55, 0.58, 0.56), (HER, HER, HER), width=1.65, label_size=34)
        rev.scale(0.92).move_to(frame.get_center() + m.LEFT * 2.72 + m.DOWN * 0.3)
        sup.scale(0.92).move_to(frame.get_center() + m.RIGHT * 2.72 + m.DOWN * 0.3)
        rev_l = T("EXTRACTION REVENUE", 34, OK).next_to(rev, m.UP, buff=0.28)
        sup_l = T("SUPPRESSION RATIO", 34, HER).next_to(sup, m.UP, buff=0.28)
        link = m.Arrow(rev.get_right(), sup.get_left(), buff=0.35, color=GOLD, stroke_width=6)
        self.add(title, span, frame, kernel)
        self.play(m.FadeIn(rev_l), m.FadeIn(rev), m.FadeIn(sup_l), m.FadeIn(sup), run_time=1.0)
        self.until(self.at(0, "antebellum"))
        self.play(m.GrowArrow(link), run_time=0.7)
        scale = T("ENFORCEMENT SCALES WITH EXTRACTION", 34, GOLD, width=12.0).to_edge(m.DOWN, buff=0.4)
        self.play(m.FadeIn(scale, shift=m.UP * 0.15), run_time=0.6)
        self.until(self.at(0, "scaling"))
        self.until(self.beat_end(0) - 0.3)


class CottonGinConfound(YTScene):
    SHOT = "S09-13"

    def shot_S09_13(self):
        head = T("COTTON GIN CONFOUND", 44, GOLD).to_edge(m.UP, buff=0.42)
        gin = m.RoundedRectangle(width=4.2, height=2.9, corner_radius=0.12, stroke_color=INK, stroke_width=4,
                                 fill_color=NAVY2, fill_opacity=1)
        gin_l = T("COTTON GIN", 36, INK).move_to(gin)
        gin_g = m.VGroup(gin, gin_l).shift(m.LEFT * 3.8 + m.DOWN * 0.05)
        cost_line = T("HIGH PROCESSING COST", 34, DIM, "NORMAL", width=4.2).next_to(gin_g, m.DOWN, buff=0.5)
        arrow = m.Arrow(gin_g.get_bottom(), cost_line.get_top(), buff=0.12, color=OK, stroke_width=6)
        acreage_slot = m.VGroup().shift(m.RIGHT * 4.3 + m.DOWN * 0.05)
        self.add(head, gin_g, cost_line)
        self.until(self.at(0, "gin"))
        cost_new = T("LOWER PROCESSING COST", 34, OK, width=5.0).move_to(cost_line)
        self.play(m.ReplacementTransform(cost_line, cost_new), m.GrowArrow(arrow), run_time=0.85)
        self.until(self.at(0, "processing"))
        self.until(self.at(0, "profitable"))
        self.until(self.beat_end(0) - 0.35)

        # 1 — acreage expands; enslaved labor demand rises
        self.until(self.at(1, "acreage"))
        self.play(m.FadeOut(cost_new), m.FadeOut(arrow), run_time=0.35)
        fields = m.VGroup(*[m.Rectangle(width=1.2, height=0.78, fill_color=OK, fill_opacity=0.55, stroke_width=0)
                            for _ in range(12)])
        fields.arrange_in_grid(3, 4, buff=0.14).move_to(acreage_slot)
        field_l = T("PROFITABLE ACREAGE", 36, OK).next_to(fields, m.UP, buff=0.42)
        labor_bar = m.Rectangle(width=9.8, height=0.55, stroke_color=HER, stroke_width=3, fill_color=HER, fill_opacity=0.2)
        labor_fill = m.Rectangle(width=2.2, height=0.55, fill_color=HER, fill_opacity=0.9, stroke_width=0)
        labor_fill.align_to(labor_bar, m.LEFT)
        labor_g = m.VGroup(labor_bar, labor_fill).move_to(m.DOWN * 2.65)
        labor_l = T("ENSLAVED LABOR DEMAND", 36, HER).next_to(labor_g, m.UP, buff=0.28)
        self.play(m.FadeIn(field_l), m.FadeIn(fields, lag_ratio=0.08), gin_g.animate.shift(m.LEFT * 0.85), run_time=0.75)
        self.until(self.at(1, "extraction"))
        labor_target = labor_fill.copy().stretch_to_fit_width(7.8).align_to(labor_bar, m.LEFT)
        self.play(fields.animate.scale(1.18, about_point=fields.get_center()),
                  m.Transform(labor_fill, labor_target), m.FadeIn(labor_l), run_time=0.85)
        self.until(self.at(1, "enslaved"))
        self.until(self.beat_end(1) - 0.3)
