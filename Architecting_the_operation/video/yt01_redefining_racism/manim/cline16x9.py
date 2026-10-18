"""S10-05 cline gradient; S10-13 binary legal partition."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, T, YTScene  # noqa: E402

CLINE_COLORS = ["#3d2314", "#5c3a24", "#7a5238", "#9a7050", "#b88868", "#d4a888", "#e8c4a8"]


def cline_bar():
    segments = m.VGroup()
    for col in CLINE_COLORS:
        segments.add(m.Rectangle(width=1.72, height=1.05, fill_color=col, fill_opacity=1, stroke_width=0))
    segments.arrange(m.RIGHT, buff=0)
    rail = m.Line(segments.get_left() + m.LEFT * 0.15, segments.get_right() + m.RIGHT * 0.15, color=DIM, stroke_width=3)
    rail.next_to(segments, m.DOWN, buff=0.42)
    left = T("LATITUDE", 34, DIM, "NORMAL").next_to(rail, m.LEFT, buff=0.22)
    right = T("GRADIENT", 34, DIM, "NORMAL").next_to(rail, m.RIGHT, buff=0.22)
    group = m.VGroup(segments, rail, left, right)
    if group.width > 13.0:
        group.scale_to_fit_width(13.0)
    return group


class ClineGradient(YTScene):
    SHOT = "S10-05"

    def shot_S07_43(self):
        head = T("CONTINUOUS HUMAN PIGMENTATION CLINE", 40, GOLD).to_edge(m.UP, buff=0.4)
        cline = cline_bar().shift(m.UP * 0.25)
        uv = T("HIGH UV / LOW LATITUDE                                      LOW UV / HIGH LATITUDE", 28, DIM, width=12.3)
        uv.next_to(cline, m.DOWN, buff=0.55)
        self.add(head)
        self.until(self.at(0, "cline"))
        self.play(m.FadeIn(cline), m.FadeIn(uv), run_time=0.75)

        self.until(self.at(1, "folate"))
        folate = T("FOLATE PROTECTION", 30, HER).next_to(cline, m.DOWN, buff=1.15).shift(m.LEFT * 3.0)
        vitamin = T("VITAMIN D SYNTHESIS", 30, GOLD).next_to(cline, m.DOWN, buff=1.15).shift(m.RIGHT * 3.0)
        folate_curve = m.ArcBetweenPoints(cline.get_left(), cline.get_center(), angle=-0.55, color=HER, stroke_width=5)
        vitamin_curve = m.ArcBetweenPoints(cline.get_center(), cline.get_right(), angle=0.55, color=GOLD, stroke_width=5)
        self.play(m.FadeIn(folate), m.FadeIn(vitamin), m.Create(folate_curve), m.Create(vitamin_curve), run_time=0.65)

        self.until(self.at(2, "four"))
        loci = m.VGroup(*[m.Dot(radius=0.13, color=GOLD) for _ in range(4)])
        for dot, p in zip(loci, (0.16, 0.38, 0.62, 0.84)):
            dot.move_to(cline[1].point_from_proportion(p))
        stats = T("N = 2,092 · FOUR LOCI · ~29% VARIANCE", 29, GOLD).to_edge(m.DOWN, buff=0.35)
        self.play(m.LaggedStart(*[m.FadeIn(d) for d in loci], lag_ratio=0.15), m.FadeIn(stats), run_time=0.65)

        self.until(self.at(3, "Braña"))
        brana = T("LA BRAÑA · 7,000 YEARS · DARK-SKIN ALLELES + BLUE EYES", 28, INK, width=12.0).move_to(stats)
        self.play(m.Transform(stats, brana), run_time=0.55)

        self.until(self.at(4, "Cheddar"))
        cheddar = T("CHEDDAR MAN · DARK-TO-BLACK SKIN + BLUE/GREEN EYES", 28, INK, width=12.0).move_to(stats)
        self.play(m.Transform(stats, cheddar), m.Indicate(cline, color=GOLD), run_time=0.6)
        self.until(self.beat_end(4) - 0.2)

    def shot_S10_05(self):
        head = T("CONTINUOUS CLINE", 44, GOLD).to_edge(m.UP, buff=0.42)
        cline = cline_bar().shift(m.DOWN * 0.05)
        hux = T("HUXLEY 1938", 34, DIM, "NORMAL").next_to(cline[1], m.DOWN, buff=0.95)
        geo = T("SKIN COLOR · GEOGRAPHY", 34, INK).next_to(head, m.DOWN, buff=0.2)
        self.add(head, geo)
        self.play(m.FadeIn(cline), run_time=1.0)
        self.until(self.at(0, "gradient"))
        self.play(m.FadeIn(hux), run_time=0.5)
        self.until(self.at(0, "cline"))

        # 1 — hold returns after card shots; ancient DNA timeline on cline
        self.until(self.at(1, "Ancient"))
        self.play(m.FadeOut(hux), run_time=0.25)
        timeline = cline[1].copy().set_color(GOLD).set_stroke(width=4)
        rail_y = timeline.get_bottom()[1] - 0.55
        marks = m.VGroup(
            T("7 ka", 34, GOLD).move_to(timeline.point_from_proportion(0.2) + m.DOWN * 0.62),
            T("10 ka", 34, GOLD).move_to(timeline.point_from_proportion(0.48) + m.DOWN * 0.62),
            T("aDNA", 34, GOLD).move_to([timeline.point_from_proportion(0.78)[0], rail_y - 0.55, 0]),
        )
        dna = T("ANCIENT DNA TIMELINE", 36, GOLD).to_edge(m.DOWN, buff=0.48)
        self.play(m.FadeIn(timeline), m.FadeIn(marks), m.FadeIn(dna), run_time=0.8)
        self.until(self.at(1, "timeline"))
        self.until(self.beat_end(1) - 0.3)


class BinaryPartitionCut(YTScene):
    SHOT = "S10-13"

    def shot_S07_48(self):
        cline = cline_bar().shift(m.UP * 0.45)
        head = T("STATUTORY BINARY CUT", 42, GOLD).to_edge(m.UP, buff=0.4)
        self.add(head, cline)
        self.until(self.at(0, "binary"))
        blade = m.Line(cline[0].get_top() + m.UP * 0.55, cline[0].get_bottom() + m.DOWN * 0.55,
                       color=HER, stroke_width=9).move_to(cline[0])
        walls = m.VGroup(
            m.RoundedRectangle(width=5.7, height=2.25, corner_radius=0.08, stroke_color=INK, stroke_width=4),
            m.RoundedRectangle(width=5.7, height=2.25, corner_radius=0.08, stroke_color=INK, stroke_width=4),
        ).arrange(m.RIGHT, buff=0.2).move_to(cline)
        self.play(m.Create(blade), m.FadeIn(walls), run_time=0.75)

        self.until(self.at(1, "surveillance"))
        costs = T("CONVERSION / CONCEALMENT / INTERMARRIAGE → SURVEILLANCE COST", 29, DIM, width=12.2)
        costs.next_to(cline, m.DOWN, buff=0.65)
        marker = T("VISIBLE PHENOTYPE → PERSISTENT ASSIGNMENT", 30, GOLD).next_to(costs, m.DOWN, buff=0.28)
        self.play(m.FadeIn(costs), m.FadeIn(marker), run_time=0.6)

        self.until(self.at(2, "1449"))
        inherit = m.Arrow(walls[0].get_bottom(), walls[1].get_bottom(), path_arc=-0.7, color=GOLD, stroke_width=5)
        tag = T("1449 DESCENT LOGIC → ATLANTIC PLANTATION BONDAGE", 28, GOLD, width=11.5).to_edge(m.DOWN, buff=0.3)
        self.play(m.GrowArrow(inherit), m.Transform(marker, tag), run_time=0.65)

        self.until(self.at(3, "1441"))
        dates = T("1441 → 1444 → 1452/1455 → 1453 → 1486", 34, GOLD).move_to(marker)
        self.play(m.Transform(marker, dates), run_time=0.55)

        self.until(self.at(4, "continuous"))
        final = T("CONTINUOUS BODY · ADMINISTRATIVE CATEGORY + BOUNDARY + INHERITANCE + ENFORCEMENT", 28, INK, width=12.4)
        final.move_to(marker)
        self.play(m.Transform(marker, final), walls.animate.set_stroke(HER, 6), run_time=0.65)
        self.until(self.beat_end(4) - 0.2)

    def shot_S10_13(self):
        cline = cline_bar().shift(m.UP * 0.2)
        head = T("BINARY LEGAL PARTITION", 44, GOLD).to_edge(m.UP, buff=0.42)
        self.add(head, cline)
        self.until(self.at(0, "discrete"))
        blade = m.Line(cline[0].get_top() + m.UP * 0.5, cline[0].get_bottom() + m.DOWN * 0.5, color=HER, stroke_width=8)
        blade.move_to(cline[0].get_center() + m.RIGHT * 2.9)
        cut = T("LEGAL CUT", 36, HER).next_to(blade, m.UP, buff=0.18)
        left = T("CATEGORY A", 34, INK).next_to(cline, m.DOWN, buff=1.05).shift(m.LEFT * 3.2)
        right = T("CATEGORY B", 34, INK).next_to(cline, m.DOWN, buff=1.05).shift(m.RIGHT * 3.2)
        bio = T("BIOLOGY STAYS CONTINUOUS", 34, DIM, "NORMAL").to_edge(m.DOWN, buff=0.48)
        self.play(m.Create(blade), m.FadeIn(cut), run_time=0.7)
        self.play(m.FadeIn(left), m.FadeIn(right), m.FadeIn(bio), run_time=0.6)
        self.until(self.at(0, "partition"))

        # 1 — hold S10-21: permanent legal underclass
        self.until(self.at(1, "inescapable"))
        perm = T("PERMANENT LEGAL PARTITION", 36, HER, width=12.0).next_to(bio, m.UP, buff=0.38)
        self.play(m.FadeIn(perm, shift=m.UP * 0.1), blade.animate.set_stroke(width=10), run_time=0.7)
        self.until(self.at(1, "partition"))
        self.until(self.beat_end(1) - 0.3)
