"""Single five-tier pyramid for YT02v2 tier walk-through shots."""

import sys
from pathlib import Path

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from common16x9 import DIM, GOLD, HER, INK, T, YTScene  # noqa: E402
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
WIDTHS = (5.8, 4.9, 3.9, 2.9, 1.9)
HEIGHT = 0.62
GAP = 0.08
PYR_X = -2.35


class TierPyramid(YTScene):
    SHOT = "S02-03"

    def _build(self):
        slabs = m.VGroup()
        labels = m.VGroup()
        y = -1.55
        for i, (text, color, idx) in enumerate(TIERS):
            w = WIDTHS[i]
            rect = m.RoundedRectangle(
                width=w,
                height=HEIGHT,
                corner_radius=0.08,
                fill_color=color,
                fill_opacity=1,
                stroke_color=DIM,
                stroke_width=2,
            )
            rect.move_to([PYR_X, y, 0])
            tag = T(text, 22, INK if color == PAPER else PAPER, width=w - 0.35)
            tag.move_to(rect)
            slabs.add(rect)
            labels.add(tag)
            y += HEIGHT + GAP
        adjacent = T("adjacent Out-groups", 26, HER, width=3.4)
        adjacent.next_to(slabs[0], m.RIGHT, buff=0.55)
        if adjacent.get_right()[0] > 6.7:
            adjacent.shift(m.LEFT * (adjacent.get_right()[0] - 6.7))
        if adjacent.get_left()[0] < -6.7 + 0.4:
            adjacent.shift(m.RIGHT * (-6.7 + 0.4 - adjacent.get_left()[0]))
        return slabs, labels, adjacent

    def _focus(self, slabs, labels, idx):
        anims = []
        for i, (slab, lab) in enumerate(zip(slabs, labels)):
            op = 1.0 if i == idx else 0.28
            anims.extend([slab.animate.set_opacity(op), lab.animate.set_opacity(op)])
        return anims

    def shot_S02_03(self):
        title = T("FIVE-TIER HIERARCHY", 40, GOLD).to_edge(m.UP, buff=0.35)
        slabs, labels, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, labels, adjacent)
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
        slabs, labels, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, labels, adjacent)
        self.play(*self._focus(slabs, labels, 2), run_time=0.35)
        self.until(self.at(0, "force"))
        self.play(m.Indicate(slabs[2], color=FORCE), run_time=0.5)
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)

    def shot_S02_05(self):
        title = T("FIVE-TIER HIERARCHY", 40, GOLD).to_edge(m.UP, buff=0.35)
        slabs, labels, adjacent = self._build()
        self.camera.background_color = "#0F1B33"
        self.add(title, slabs, labels, adjacent)
        self.until(self.at(0, "extraction"))
        self.play(*self._focus(slabs, labels, 0), m.Indicate(adjacent, color=HER), run_time=0.55)
        assert_no_overlap(self)
        self.until(self.beat_end(0) - 0.2)
