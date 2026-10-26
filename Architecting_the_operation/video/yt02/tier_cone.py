"""SEG 05: Requirement 1, the five structural tiers walked on the book's 3-D cone (Figure 0.2)."""

import sys
from pathlib import Path

import manimgx as m

YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(YT02))

from ortho_illusion import _build_cone  # noqa: E402  (also puts the YT01 manim dir on sys.path)
from common16x9 import HER, T  # noqa: E402
from orthographic16x9 import D, PYRAMID_X, Orthographic16x9  # noqa: E402
from tier_pyramid import ELITE, FORCE, NIGHT, PAPER, PUPPET  # noqa: E402


class TierCone(Orthographic16x9):
    """S05-05..S05-10: the cone assembles, then focus steps from the apex down to the base."""

    def shot_S05_05(self):
        self._lights()
        tiers, slabs = _build_cone()
        for slab in slabs:
            slab.set_opacity(0)
        self.add(tiers)
        self._add_legend()
        self.set_camera_orientation(phi=52 * D, theta=-68 * D, zoom=0.84, frame_center=[PYRAMID_X + 1.7, 0, 0.55])

        self.until(self.at(0, "Requirement"))
        self.play(
            m.LaggedStart(*[slab.animate.set_opacity(1) for slab in slabs], lag_ratio=0.16),
            *self._legend_opacity(all_on=True),
            run_time=1.25,
        )

        focus = (
            (1, "apex", 4, ELITE),
            (2, "Puppet", 3, PUPPET),
            (3, "Enforcement", 2, FORCE),
            (4, "Buffer", 1, PAPER),
            (5, "base", 0, NIGHT),
        )
        for k, cue, idx, color in focus:
            self.until(self.at(k, cue))
            self._focus_tier(slabs, idx, color)

        adjacent = T("O_racialized  +  adjacent Out-groups", 30, HER, width=5.5)
        adjacent.next_to(self.legend[0], m.DOWN, buff=0.35).align_to(self.legend[0], m.RIGHT)
        self.flat(adjacent)
        self.play(m.FadeIn(adjacent), run_time=0.4)
        self.until(self.beat_end(5) - 0.2)
