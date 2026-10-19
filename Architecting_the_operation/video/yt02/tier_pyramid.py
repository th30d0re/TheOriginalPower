"""Single five-tier pyramid for YT02v2 tier walk-through shots."""

import sys
from pathlib import Path

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from common16x9 import DIM, GOLD, HER, T, YTScene  # noqa: E402
from layout_v2 import assert_no_overlap  # noqa: E402

NIGHT = "#030304"
PAPER = "#F5F3F0"
FORCE = "#668099"
PUPPET = "#9E7850"
ELITE = "#E6C26B"

TIERS = (
    ("O_racialized · base labor", NIGHT, 0),
    ("Buffer Class · I_buffer", PAPER, 1),
    ("Enforcement · F_enforce", FORCE, 2),
    ("Puppet Class · law & policy", PUPPET, 3),
    ("Elite · E", ELITE, 4),
)
WIDTHS = (5.35, 4.45, 3.55, 2.65, 1.75)
HEIGHT = 0.78
GAP = 0.04
PYR_X = -2.2


class TierPyramid(YTScene):
    SHOT = "S02-03"

    def _build(self):
        slabs = m.VGroup()
        labels = m.VGroup()
        leaders = m.VGroup()
        y = -1.92
        for i, (text, color, idx) in enumerate(TIERS):
            lower = WIDTHS[i]
            upper = WIDTHS[i + 1] if i + 1 < len(WIDTHS) else 0.85
            slab = m.Polygon(
                [PYR_X - lower / 2, y - HEIGHT / 2, 0],
                [PYR_X + lower / 2, y - HEIGHT / 2, 0],
                [PYR_X + upper / 2, y + HEIGHT / 2, 0],
                [PYR_X - upper / 2, y + HEIGHT / 2, 0],
                fill_color=color,
                fill_opacity=1,
                stroke_color=DIM,
                stroke_width=2,
            )
            tag = T(text, 22, PAPER, width=3.25).move_to([2.25, y, 0])
            leader = m.Line(
                slab.get_right() + m.RIGHT * 0.08,
                tag.get_left() + m.LEFT * 0.16,
                color=PAPER,
                stroke_width=2,
            )
            slabs.add(slab)
            labels.add(tag)
            leaders.add(leader)
            y += HEIGHT + GAP
        adjacent_box = m.RoundedRectangle(
            width=2.65,
            height=0.62,
            corner_radius=0.1,
            stroke_color=HER,
            stroke_width=3,
            fill_opacity=0,
        ).move_to([5.05, -2.48, 0])
        adjacent_text = T("ADJACENT OUT-GROUPS", 20, PAPER, width=2.3).move_to(adjacent_box)
        adjacent = m.VGroup(adjacent_box, adjacent_text)
        return slabs, labels, leaders, adjacent

    def _focus(self, slabs, labels, idx):
        anims = []
        for i, (slab, lab) in enumerate(zip(slabs, labels)):
            op = 1.0 if i == idx else 0.28
            anims.extend([slab.animate.set_opacity(op), lab.animate.set_opacity(op)])
        return anims

    def shot_S02_03(self):
        title = T("FIVE-TIER HIERARCHY", 40, GOLD).to_edge(m.UP, buff=0.35)
        slabs, labels, leaders, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, leaders, labels, adjacent)
        for s in slabs:
            s.set_opacity(0.28)
        for lab in labels:
            lab.set_opacity(0.28)
        self.until(self.at(0, "power,"))
        self.play(*self._focus(slabs, labels, 4), run_time=0.55)
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)

    def shot_S02_04(self):
        title = T("FIVE-TIER HIERARCHY", 40, GOLD).to_edge(m.UP, buff=0.35)
        slabs, labels, leaders, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, leaders, labels, adjacent)
        self.play(*self._focus(slabs, labels, 2), run_time=0.35)
        self.until(self.at(0, "force"))
        self.play(m.Indicate(slabs[2], color=FORCE), run_time=0.5)
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)

    def shot_S02_05(self):
        title = T("FIVE-TIER HIERARCHY", 40, GOLD).to_edge(m.UP, buff=0.35)
        slabs, labels, leaders, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, leaders, labels, adjacent)
        self.until(self.at(0, "extraction"))
        self.play(*self._focus(slabs, labels, 0), m.Indicate(adjacent, color=HER), run_time=0.55)
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)
