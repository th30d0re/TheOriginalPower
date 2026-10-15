"""S03-25: axes affecting extraction intensity within O."""

import math
import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, T, YTScene  # noqa: E402

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
