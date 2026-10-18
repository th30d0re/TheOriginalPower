"""S03-25: axes affecting extraction intensity within O."""

import math
import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, T, YTScene  # noqa: E402

AXES = [
    "CAPITAL",
    "PHENOTYPE",
    "GENDER",
    "GEOGRAPHY",
    "LEGAL",
    "CREDENTIAL",
    "CRIMINALIZED",
]


class OutgroupAxes(YTScene):
    SHOT = "S03-25"
    SOURCE = "Source: The Original Power, Eq. outgroup-internal-partition"

    def shot_S03_27(self):
        head = T("OUT-GROUP INTERNAL PARTITIONS", 36, GOLD).to_edge(m.UP, buff=0.45)
        racial = m.RoundedRectangle(width=5.2, height=4.7, corner_radius=0.12, stroke_color=HER, stroke_width=4,
                                    fill_color=NAVY2, fill_opacity=0.55).shift(m.LEFT * 3.1)
        adjacent = m.RoundedRectangle(width=5.8, height=4.7, corner_radius=0.12, stroke_color=HIM, stroke_width=4,
                                      fill_color=NAVY2, fill_opacity=0.45).shift(m.RIGHT * 2.8)
        r_lab = M(r"O_{\mathrm{racialized}}", 42, HER).next_to(racial, m.UP, buff=0.15)
        a_lab = M(r"O_{\mathrm{adjacent},1\ldots m}", 40, HIM).next_to(adjacent, m.UP, buff=0.15)
        self.add(head)
        self.until(self.at(0, "American"))
        history = T("CHATTEL SLAVERY · JIM CROW · MASS CARCERALITY", 29, HER, width=4.7).move_to(racial)
        self.play(m.FadeIn(racial), m.FadeIn(r_lab), m.FadeIn(history), run_time=0.7)

        self.until(self.at(1, "adjacent"))
        groups = m.VGroup(
            T("INDIGENOUS · LAND", 27, INK),
            T("LATINO / ASIAN · LABOR + IMMIGRATION", 27, INK, width=5.2),
            T("EUROPEAN ARRIVALS · PRE-INCORPORATION", 27, INK, width=5.2),
        ).arrange(m.DOWN, buff=0.35).move_to(adjacent)
        self.play(m.FadeIn(adjacent), m.FadeIn(a_lab), m.LaggedStart(*[m.FadeIn(g) for g in groups], lag_ratio=0.15), run_time=0.8)

        self.until(self.at(2, "plays"))
        wedges = m.VGroup(
            m.Arrow(racial.get_right(), adjacent.get_left() + m.UP * 0.65, color=GOLD, stroke_width=5),
            m.Arrow(adjacent.get_left() + m.DOWN * 0.65, racial.get_right(), color=GOLD, stroke_width=5),
        )
        wedge_lab = T("DIFFERENTIAL CONCESSIONS · MODEL-MINORITY NARRATIVES · BORDER POLICING", 27, GOLD, width=11.5)
        wedge_lab.to_edge(m.DOWN, buff=0.35)
        self.play(m.LaggedStart(*[m.GrowArrow(a) for a in wedges], lag_ratio=0.2), m.FadeIn(wedge_lab), run_time=0.75)
        self.until(self.beat_end(2) - 0.2)

    def shot_S03_25(self):
        head = T("EXTRACTION INTENSITY AXES", 28, GOLD).to_edge(m.UP, buff=0.45)
        core = m.Circle(radius=0.95, stroke_color=HER, stroke_width=4, fill_color=NAVY2, fill_opacity=0.6)
        core_lab = M(r"O", 44, HER).move_to(core)
        core_group = m.VGroup(core, core_lab).move_to([0, 0.15, 0])
        orbit = m.VGroup()
        for i, ax in enumerate(AXES):
            ang = i * m.TAU / len(AXES) - m.PI / 2
            pos = [2.85 * math.cos(ang), 2.85 * math.sin(ang) + 0.15, 0]
            tag = T(ax, 28, INK, width=1.8)
            tag.move_to(pos)
            orbit.add(tag)
        self.add(head, core_group, orbit)
        self.until(self.at(0, "credentialing"))
        self.play(m.LaggedStart(*[m.FadeIn(t, scale=0.9) for t in orbit], lag_ratio=0.08), run_time=1.0)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "differently"))
        intensities = (0.35, 0.55, 0.75, 0.45, 0.9, 0.5, 0.65)
        anims = [orbit[i].animate.set_color(m.interpolate_color(INK, HER, intensities[i])) for i in range(len(AXES))]
        note = T("HETEROGENEOUS OUT-GROUP", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.5)
        self.play(m.AnimationGroup(*anims), m.FadeIn(note), run_time=0.7)
        self.until(self.beat_end(1) - 0.3)
