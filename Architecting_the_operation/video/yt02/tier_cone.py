"""SEG 05: Requirement 1, the five structural tiers walked on the book's 3-D cone (Figure 0.2)."""

import os
import sys
from pathlib import Path

import manimgx as m

YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(YT02))

from ortho_illusion import TIER_BANDS, _build_cone, _radius  # noqa: E402  (also puts the YT01 manim dir on sys.path)
from common16x9 import DIM, INK  # noqa: E402
from cone_frame import HANDOFF_RADIUS, ConeFrame  # noqa: E402
from orthographic16x9 import D, PYRAMID_X, S, Orthographic16x9  # noqa: E402
from tier_pyramid import ELITE, FORCE, NIGHT, PAPER, PUPPET  # noqa: E402

# Equation 2.2 refines I into the four In-group tiers; Equation 2.3 partitions O. One part per term,
# so each term lights with its tier.
EQ22 = (r"\operatorname{Refine}(I) =", "E", r"\dot\cup", r"P_{\text{uppet}}", r"\dot\cup",
        r"F_{\text{enforce}}", r"\dot\cup", r"I_{\text{buffer}}")
EQ22_TERM = {4: 1, 3: 3, 2: 5, 1: 7}  # slab index → part index
EQ23 = ("O =", r"O_{\text{racialized}}", r"\dot\cup", r"O_{\text{adjacent},1}", r"\dot\cup", r"\cdots",
        r"\dot\cup", r"O_{\text{adjacent},m}")
EQ_Y = 2.62
# The cone fits inside the border with the equation above it and the legend to its right.
WIDE = dict(phi=52 * D, theta=-68 * D, zoom=0.7, frame_center=[PYRAMID_X + 2.15, 0, 1.3])
OUT_TOP_Z = TIER_BANDS[0][1] * S
# Straight down on the Out-group: its silhouette (the base rim, 20 units from the camera and 0.58
# below the focal plane) projects to HANDOFF_RADIUS. Measured: 3.588 × 135 × zoom × 0.9718 px.
HANDOFF_ZOOM = HANDOFF_RADIUS / (_radius(TIER_BANDS[0][0] * S) * 20 / (20 + (TIER_BANDS[0][1] - TIER_BANDS[0][0]) * S))


N25_CAMERA_STORYBOARD = (
    {
        "cameras": (dict(phi=52 * D, theta=-68 * D, gamma=90 * D, zoom=1.65,
                         frame_center=[PYRAMID_X, 0, -0.2], run_time=0.8),),
        "opacity": {0: 1, 1: 1, 2: 1, 3: 1, 4: 1},
    },
    {
        "cameras": (dict(phi=52 * D, theta=-68 * D, gamma=0 * D, zoom=1.65,
                         frame_center=[PYRAMID_X, 0, -0.2], run_time=0.8),),
        "rotation": dict(angle=m.PI / 2, axis=m.UP, about_point=[PYRAMID_X, 0, 0], run_time=1.0),
        "binary": True,
    },
    {
        "cameras": (dict(phi=52 * D, theta=-68 * D, zoom=1.65,
                         frame_center=[PYRAMID_X, 0, -0.2], run_time=0.8),),
        "rotation": dict(angle=-m.PI / 2, axis=m.UP, about_point=[PYRAMID_X, 0, 0], run_time=1.0),
        "binary": False,
    },
    {
        "cameras": (
            dict(phi=80 * D, theta=-90 * D, zoom=1.5, focal_distance=0.65,
                 frame_center=[PYRAMID_X, 0, -0.15], run_time=0.8),
            dict(phi=178 * D, theta=-90 * D, zoom=1.5, focal_distance=0.65,
                 frame_center=[PYRAMID_X, 0, 0.1], run_time=1.0),
        ),
        "opacity": {0: 0.12},
    },
    {
        "cameras": (dict(phi=58 * D, theta=-90 * D, zoom=1.45, focal_distance=0.65,
                         frame_center=[PYRAMID_X, 0, -0.4], run_time=1.0),),
        "opacity": {0: 1},
    },
    {
        "cameras": (dict(phi=52 * D, theta=-68 * D, zoom=0.84, focal_distance=20,
                         frame_center=[PYRAMID_X + 1.7, 0, 0.55], run_time=1.4),),
        "opacity": {0: 1, 1: 1, 2: 1, 3: 1, 4: 1},
    },
)


class TierCone(ConeFrame, Orthographic16x9):
    """S05-05..S05-10: the cone assembles, then focus steps from the apex down to the base."""

    def _play_n25_camera(self, tiers, slabs):
        white = m.Rectangle(width=5.4, height=3.45, fill_color=PAPER, fill_opacity=1, stroke_width=0)
        black = m.Rectangle(width=5.4, height=3.45, fill_color=NIGHT, fill_opacity=1, stroke_width=0)
        white.move_to([-2.75, 0.25, 0])
        black.move_to([2.75, 0.25, 0])
        binary = m.VGroup(white, black).set_opacity(0)
        self.flat(binary)

        for beat in N25_CAMERA_STORYBOARD:
            for camera in beat["cameras"]:
                self.move_camera(**camera)
            if "rotation" in beat:
                self.play(m.Rotate(tiers, **beat["rotation"]))
            if "binary" in beat:
                self.play(binary.animate.set_opacity(1 if beat["binary"] else 0), run_time=0.3)
            if "opacity" in beat:
                self.play(*[slabs[i].animate.set_opacity(value) for i, value in beat["opacity"].items()], run_time=0.3)

    def _equation(self, parts):
        eq = m.MathTex(*parts, font_size=44, color=INK).move_to([0, EQ_Y, 0])
        self.flat(eq)
        return eq

    def _light_term(self, eq, idx, color):
        """The named term in cream, underlined in its tier's colour; the rest recede."""
        term = eq[idx]
        bar = m.Line(term.get_corner(m.DL) + m.DOWN * 0.1, term.get_corner(m.DR) + m.DOWN * 0.1,
                     stroke_color=color, stroke_width=6).set_opacity(0)
        self.flat(bar)
        anims = [part.animate.set_color(INK if i == idx else DIM).set_opacity(1 if i == idx else 0.45)
                 for i, part in enumerate(eq)]
        anims.append(bar.animate.set_opacity(1))
        if getattr(self, "term_bar", None) is not None:
            anims.append(self.term_bar.animate.set_opacity(0))
        self.term_bar = bar
        return anims

    def shot_S05_05(self):
        self._tier_build(start=(0, "Requirement"), k_eq=0, k_tiers=(1, 2, 3, 4), k_base=5)

    def shot_S07_26(self):
        # The G script (2026-10-29) moved the tier introductions after the illusion; the first
        # line names the cone, Equation 2.2 and the Elite together.
        self._tier_build(start=(0, "cone"), k_eq=0, k_tiers=(0, 1, 2, 3), k_base=4)

    def _tier_build(self, start, k_eq, k_tiers, k_base):
        self._lights()
        tiers, slabs = _build_cone()
        for slab in slabs:
            slab.set_opacity(0)
        self.add(tiers)
        self._add_legend()
        self.legend.shift(m.LEFT * 0.6 + m.DOWN * 0.5)
        self.add_border()
        self.set_camera_orientation(**WIDE)
        eq = self._equation(EQ22).set_opacity(0)

        self.until(self.at(*start))
        self.play(
            m.LaggedStart(*[slab.animate.set_opacity(1) for slab in slabs], lag_ratio=0.16),
            *self._legend_opacity(all_on=True),
            run_time=1.25,
        )
        self.until(self.cue_any("Equation", ks=[k_eq], fallback=self.beat(k_eq) + 6))
        self.play(eq.animate.set_opacity(1), run_time=0.6)

        # Each tier lights, on the cone, in the legend and in Equation 2.2, as the narration names it.
        focus = tuple(zip(k_tiers, (("apex", "Elite"), ("Puppet",), ("Enforcement",), ("Buffer",)),
                          (4, 3, 2, 1), (ELITE, PUPPET, FORCE, PAPER)))
        for k, cues, idx, color in focus:
            self.until(self.cue_any(*cues, ks=[k], fallback=self.beat(k)))
            self._focus_tier(slabs, idx, color)
            self.play(*self._light_term(eq, EQ22_TERM[idx], color), run_time=0.4)

        # The base: Equation 2.3 takes over, then the camera rises over the Out-group until its top
        # face reads as one flat circle, the circle the Figma pie chart decomposes.
        self.until(self.cue_any("base", "Out-group", ks=[k_base], fallback=self.beat(k_base)))
        self._focus_tier(slabs, 0, NIGHT)
        eq23 = self._equation(EQ23).set_opacity(0)
        self.play(m.FadeOut(eq), self.term_bar.animate.set_opacity(0), eq23.animate.set_opacity(1), run_time=0.5)
        self.term_bar = None
        self.until(self.cue_any("racialized", "Out-group", ks=[k_base], fallback=self.beat(k_base) + 1))
        self.play(*self._light_term(eq23, 1, PAPER), run_time=0.4)

        rise = self.cue_any("denoted", "sub", after=self.time + self.T0, ks=[k_base], fallback=self.beat(k_base) + 2)
        self.until(rise)
        self.move_camera(
            phi=0, theta=-90 * D, zoom=HANDOFF_ZOOM, focal_distance=20,
            frame_center=[PYRAMID_X, 0, OUT_TOP_Z],
            added_anims=[m.FadeOut(eq23), self.term_bar.animate.set_opacity(0), *[item.animate.set_opacity(0) for item in self.legend],
                         slabs[0].animate.set_opacity(1), *[s.animate.set_opacity(0) for s in slabs[1:]]],
            run_time=2.0,
        )
        disc = m.Circle(radius=HANDOFF_RADIUS, fill_color=NIGHT, fill_opacity=1, stroke_width=0).set_opacity(0)
        self.flat(disc)
        self.play(disc.animate.set_opacity(1), tiers.animate.set_opacity(0), run_time=0.45)
        self.handoff = disc
        self.until(self.beat_end(k_base) - 0.2)

        if os.environ.get("YT02V2_N25") == "1":
            self.remove(disc)
            self._play_n25_camera(tiers, slabs)
