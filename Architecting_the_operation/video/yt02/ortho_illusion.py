"""SEG 07: the orthographic illusion, projection, and deflection in one 3D run."""

import sys
from pathlib import Path

import manimgx as m
import numpy as np

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))

from common16x9 import DIM, GOLD, HER, LOG, T, YTScene3D  # noqa: E402
from orthographic16x9 import D, INK_FACE, PYRAMID_X, Orthographic16x9, S, _legend_group  # noqa: E402
from tier_pyramid import ELITE, FORCE, NIGHT, PAPER, PUPPET  # noqa: E402

# The book's 3-D model is a cone: E at the apex on the z-axis, O the enclosed base.
# Same heights as the YT01 slab stack, so the camera moves and callouts still frame it.
CONE_BASE_Z, CONE_APEX_Z, CONE_RADIUS = -0.76 * S, 2.95 * S, 2.6 * S
TIER_BANDS = ((-0.76, -0.34, NIGHT), (-0.06, 0.36, PAPER), (0.64, 1.06, FORCE),
              (1.34, 1.76, PUPPET), (2.04, 2.95, ELITE))


def _radius(z):
    return CONE_RADIUS * (CONE_APEX_Z - z) / (CONE_APEX_Z - CONE_BASE_Z)


def _cap(z, color):
    disc = m.Circle(radius=_radius(z), fill_color=color, fill_opacity=1, stroke_width=0)
    return disc.move_to([PYRAMID_X, 0, z])


def _frustum(z0, z1, color):
    """One conical tier: the side wall plus flat discs top and bottom."""
    side = m.Surface(
        lambda u, v: [PYRAMID_X + _radius(v) * np.cos(u), _radius(v) * np.sin(u), v],
        u_range=(0, m.TAU), v_range=(z0, z1), resolution=(48, 2),
        checkerboard_colors=False, fill_color=color, fill_opacity=1, stroke_width=0,
    )
    parts = [side, _cap(z0, color)]
    if _radius(z1) > 1e-3:
        parts.append(_cap(z1, color))
    return m.VGroup(*parts)


def _build_cone():
    """Out-group base through Elite apex, as five frustums with thin gaps."""
    tiers = [_frustum(z0 * S, z1 * S, color) for z0, z1, color in TIER_BANDS]
    return m.VGroup(*tiers), tiers


from cone_frame import SAFE_X, SAFE_Y, ConeFrame  # noqa: E402  (after _build_cone: cone_frame imports nothing from here)

OUT_TOP_Z, BUF_BOTTOM_Z, BUF_TOP_Z = TIER_BANDS[0][1] * S, TIER_BANDS[1][0] * S, TIER_BANDS[1][1] * S
TIER_GAP = (TIER_BANDS[1][0] - TIER_BANDS[0][1]) * S
# The whole cone inside the border, legend on the right.
WIDE = dict(phi=52 * D, theta=-68 * D, zoom=0.76, focal_distance=20, frame_center=[PYRAMID_X + 2.1, 0, 1.0])
# The coarse projection: close on the Buffer's lower rim, white above the line and black below.
CLOSE = dict(phi=86 * D, theta=-90 * D, zoom=4.2, focal_distance=20,
             frame_center=[PYRAMID_X, -_radius(BUF_BOTTOM_Z), BUF_BOTTOM_Z])
# Standing in a tier and turning the eyes: up from the Out-group, down from the Buffer. One move,
# mirrored, and close enough that the facing tier fills the frame.
LOOK_UP = dict(phi=178 * D, theta=-90 * D, zoom=3.2, focal_distance=20, frame_center=[PYRAMID_X, 0, OUT_TOP_Z])
LOOK_DOWN = dict(phi=2 * D, theta=-90 * D, zoom=3.2, focal_distance=20, frame_center=[PYRAMID_X, 0, BUF_BOTTOM_Z])


def _fast(t):
    return min(1.0, 4 * t)


class OrthoIllusion(ConeFrame, YTScene3D):
    """Continuous S07-01..S07-17 camera argument, bordered, on the Figma ground (R5, G17, G19)."""

    def next_cue(self, *words, slack=1.0):
        """The next spoken word starting with any of `words`; a missing word waits `slack` and warns."""
        now = self.T0 + self.time
        try:
            return self.cue_any(*words, after=now)
        except KeyError:
            LOG.warning("%s: none of %s after %.2fs; beat runs %.1fs later", type(self).__name__, words, now, slack)
            return now + slack

    def shot_S07_01(self):
        Orthographic16x9._lights(self)
        tiers, slabs = _build_cone()
        out, buf, enf, pup, eli = slabs
        for slab in slabs:
            slab.set_opacity(0)
        self.add(tiers)
        legend = _legend_group().shift(m.LEFT * 0.6).set_opacity(0)

        # The coarse projection fills the bordered frame: In-group I above the line, Out-group O below.
        half_w, half_h = 2 * SAFE_X, SAFE_Y
        white = m.Rectangle(width=half_w, height=half_h, fill_color=PAPER, fill_opacity=1, stroke_width=0)
        black = m.Rectangle(width=half_w, height=half_h, fill_color=NIGHT, fill_opacity=1, stroke_width=0)
        white.move_to([0, half_h / 2, 0])
        black.move_to([0, -half_h / 2, 0])
        in_mark = m.VGroup(T("In-group", 40, INK_FACE), m.MathTex("I", font_size=60, color=INK_FACE)).arrange(m.RIGHT, buff=0.3)
        out_mark = m.VGroup(T("Out-group", 40, PAPER), m.MathTex("O", font_size=60, color=PAPER)).arrange(m.RIGHT, buff=0.3)
        in_mark.move_to([0, half_h / 2, 0])
        out_mark.move_to([0, -half_h / 2, 0])
        binary = m.VGroup(white, black, in_mark, out_mark).set_opacity(0)
        self.flat(binary, legend)
        self.add_border()

        self.set_camera_orientation(**CLOSE)
        self.play(binary.animate.set_opacity(1), run_time=0.6)

        # Pull back: the flat blocks separate into tiers and the cone stands whole. No rotation.
        self.until(self.next_cue("separate", "pull", "back"))
        self.move_camera(**WIDE, added_anims=[m.FadeOut(binary, rate_func=_fast),
                                              *[s.animate(rate_func=_fast).set_opacity(1) for s in slabs]],
                         run_time=2.2)
        self.until(self.next_cue("apex", "Elite"))
        self.play(m.Indicate(eli, color=ELITE), legend.animate.set_opacity(1), run_time=0.8)

        # Up from the Out-group's place in the base: the Buffer's underside fills the view, white.
        self.until(self.next_cue("upward", "up"))
        self.move_camera(**LOOK_UP, added_anims=[out.animate.set_opacity(0), legend.animate.set_opacity(0)],
                         run_time=1.8)

        # The Flat Ceiling: ghost the Buffer and every higher tier sits centred behind it, on one axis.
        self.until(self.next_cue("Ceiling"))
        ceiling = T("FLAT CEILING", 40, INK_FACE).move_to([0, SAFE_Y - 0.5, 0])
        self.flat(ceiling)
        self.play(m.FadeIn(ceiling), run_time=0.6)
        self.until(self.next_cue("align"))
        self.play(buf.animate.set_opacity(0.08), enf.animate.set_opacity(0.4), pup.animate.set_opacity(0.55),
                  ceiling.animate.set_color(PAPER), run_time=0.7)
        self.until(self.cue_any("downward", after=self.T0 + self.time, fallback=self.T0 + self.time + 2.0) - 1.2)
        self.play(*[t.animate.set_opacity(1) for t in (buf, enf, pup)], m.FadeOut(ceiling), run_time=0.5)

        # The same move from the Buffer's place, eyes down: the Out-group's face fills the view, black.
        self.until(self.next_cue("downward", "down"))
        self.move_camera(**LOOK_DOWN, added_anims=[out.animate.set_opacity(1),
                                                    *[t.animate.set_opacity(0) for t in (buf, enf, pup, eli)]],
                         run_time=1.8)

        # Extraction leaves upward, outside the frame the observer holds.
        self.until(self.next_cue("extraction", "outside"))
        self.move_camera(phi=58 * D, theta=-90 * D, zoom=0.74, focal_distance=20, frame_center=[PYRAMID_X, 0, 0.6],
                         added_anims=[buf.animate.set_opacity(1), *[t.animate.set_opacity(0.12) for t in (enf, pup, eli)]],
                         run_time=1.0)
        extraction = m.VGroup(m.Arrow3D([PYRAMID_X, 0, 0.5], [PYRAMID_X, 0, CONE_APEX_Z + 0.75],
                                        color=GOLD, thickness=0.06))
        frame = m.Rectangle(width=7.4, height=3.0, stroke_color=PAPER, stroke_width=3).move_to([0, -1.25, 0])
        outside = T("EXTRACTION → E", 27, GOLD).move_to([3.9, 2.45, 0])
        self.flat(frame, outside)
        self.play(m.Create(extraction), m.FadeIn(frame), m.FadeIn(outside), run_time=0.5)

        # Wide architecture and a complete base-to-apex circuit.
        self.until(self.next_cue("Zoom", "full", "cone"))
        self.play(m.FadeOut(frame), m.FadeOut(outside), run_time=0.25)
        self.move_camera(**WIDE, added_anims=[*[s.animate.set_opacity(1) for s in slabs], legend.animate.set_opacity(1)],
                         run_time=1.2)
        self.until(self.next_cue("connected", "architecture"))
        self.play(m.Indicate(extraction, color=GOLD), run_time=0.75)

        # G19 — Elite, Puppet and Enforcement close into one block, the control node; the bottom two
        # tiers, alone, never see it.
        self.until(self.next_cue("alignment", "Obscuration"))
        control = m.VGroup(enf, pup, eli)
        self.play(pup.animate.shift(m.IN * TIER_GAP), eli.animate.shift(m.IN * 2 * TIER_GAP),
                  buf.animate.set_opacity(0.25), out.animate.set_opacity(0.25),
                  legend.animate.set_opacity(0), run_time=0.9)
        node = m.VGroup(T("CONTROL NODE", 34, GOLD),
                        m.MathTex(r"E \cup P_{\text{uppet}} \cup F_{\text{enforce}}", font_size=40, color=PAPER),
                        ).arrange(m.DOWN, buff=0.2).move_to([3.7, 1.2, 0])
        self.flat(node)
        self.play(m.Indicate(control, color=GOLD, scale_factor=1.05), m.FadeIn(node), run_time=0.9)
        self.until(self.next_cue("indistinguishable", "becomes"))
        self.play(m.Indicate(control, color=GOLD, scale_factor=1.05), run_time=0.8)
        self.play(m.Indicate(control, color=GOLD, scale_factor=1.05), run_time=0.8)
        self.until(self.next_cue("administer", "actors"))
        below = m.VGroup(m.MathTex(r"I_{\text{buffer}},\ O", font_size=40, color=PAPER),
                         T("the bottom two, alone", 27, DIM)).arrange(m.DOWN, buff=0.15).move_to([3.7, -1.3, 0])
        self.flat(below)
        self.play(control.animate.set_opacity(0.06), buf.animate.set_opacity(1), out.animate.set_opacity(1),
                  node.animate.set_opacity(0.35), m.FadeIn(below), run_time=0.9)
        self.until(self.beat_end(self.turn_of(self.T0 + self.time)) - 0.7)
        self.play(control.animate.set_opacity(1), pup.animate.shift(m.OUT * TIER_GAP),
                  eli.animate.shift(m.OUT * 2 * TIER_GAP), m.FadeOut(node), m.FadeOut(below),
                  legend.animate.set_opacity(1), run_time=0.6)

        # Base boundary and elevation ticks show two distinct geometric relations.
        self.until(self.next_cue("real", "boundary"))
        self.play(legend.animate.set_opacity(0), run_time=0.3)
        boundary = m.Line3D([PYRAMID_X - 3.8, 0, -0.9], [PYRAMID_X + 3.8, 0, -0.9],
                            color=HER, thickness=0.075)
        self.play(m.Create(boundary), run_time=0.65)
        self.until(self.next_cue("hierarchy"))
        axis = m.Line3D([PYRAMID_X - 3.95, 0, 0.1], [PYRAMID_X - 3.95, 0, 3.65],
                        color=PAPER, thickness=0.035)
        ticks = m.VGroup(*[
            m.Line3D([PYRAMID_X - 4.1, 0, z], [PYRAMID_X - 3.8, 0, z], color=GOLD, thickness=0.04)
            for z in (0.2, 1.15, 2.1, 3.05)
        ])
        self.play(m.Create(axis), m.LaggedStart(*[m.Create(t) for t in ticks], lag_ratio=0.12), run_time=0.9)

        # Fixed callouts distinguish projection from elevation.
        self.until(self.next_cue("Equation"))
        eq21 = m.VGroup(m.MathTex(r"\mathrm{Eq}\ 2.1", font_size=38, color=GOLD),
                        T("projection", 28, PAPER)).arrange(m.DOWN, buff=0.12).move_to([4.4, 1.75, 0])
        self.flat(eq21)
        self.play(m.FadeIn(eq21), run_time=0.6)
        self.until(self.next_cue("Equation"))
        eq22 = m.VGroup(m.MathTex(r"\mathrm{Eq}\ 2.2", font_size=38, color=HER),
                        T("elevation", 28, PAPER)).arrange(m.DOWN, buff=0.12).move_to([4.4, 0.25, 0])
        self.flat(eq22)
        self.play(m.FadeIn(eq22), run_time=0.6)

        # Vertical momentum hits the Buffer plane and bends ninety degrees.
        self.until(self.next_cue("Orthogonal", "Deflection"))
        self.play(m.FadeOut(eq21), m.FadeOut(eq22), *[t.animate.set_opacity(0.35) for t in slabs], run_time=0.4)
        up_arrow = m.Arrow3D([PYRAMID_X + 1.0, 0, -0.8], [PYRAMID_X + 1.0, 0, 0.05],
                             color=HER, thickness=0.075)
        deflect_plane = m.Rectangle(width=5.0, height=2.0, fill_color=PAPER, fill_opacity=0.12,
                                    stroke_color=GOLD, stroke_width=2).rotate(90 * D, axis=m.RIGHT)
        deflect_plane.move_to([PYRAMID_X, 0, 0.12])
        self.play(m.Create(up_arrow), m.FadeIn(deflect_plane), run_time=0.75)
        self.until(self.next_cue("horizontal"))
        across = m.Arrow3D([PYRAMID_X + 1.0, 0, 0.05], [PYRAMID_X + 3.35, 0, 0.05],
                           color=HER, thickness=0.075)
        self.play(m.Create(across), run_time=0.75)

        # The redirected vector terminates at the Buffer; the apex stays unchanged.
        self.until(self.next_cue("Kinetic", "Decoy"))
        decoy = T("KINETIC DECOY", 36, HER).move_to([4.4, 1.85, 0])
        self.flat(decoy)
        self.play(m.FadeIn(decoy), m.Indicate(buf, color=HER), run_time=0.75)

        # Projection and collision become one coupled local picture.
        self.until(self.next_cue("reinforce"))
        cone = m.Polygon([-0.7, -0.5, 0], [2.2, -1.35, 0], [2.2, 0.35, 0],
                         fill_color=HER, fill_opacity=0.12, stroke_color=HER, stroke_width=2)
        cone.move_to([1.15, -0.15, 0])
        self.flat(cone)
        self.play(m.FadeIn(cone), run_time=0.65)
        self.until(self.next_cue("collides"))
        self.play(m.Indicate(across, color=GOLD), m.Indicate(buf, color=HER), run_time=0.7)

        # The wide view keeps the local collision and the uninterrupted extraction.
        self.until(self.next_cue("wide"))
        self.play(m.FadeOut(decoy), m.FadeOut(cone), m.FadeOut(deflect_plane),
                  *[t.animate.set_opacity(1) for t in slabs], run_time=0.4)
        self.move_camera(**WIDE, run_time=1.0)
        self.until(self.next_cue("capture"))
        self.play(m.Indicate(extraction, color=GOLD), m.Indicate(across, color=HER), run_time=0.75)

        # Locate generation and assign the downstream functions.
        self.until(self.next_cue("generative"))
        query = m.Circle(radius=0.72, color=GOLD, stroke_width=5).move_to(eli.get_center())
        self.play(m.Create(query), m.Indicate(eli, color=ELITE), run_time=0.75)
        self.until(self.next_cue("absorb"))
        functions = m.VGroup(*[
            m.VGroup(m.MathTex(symbol, font_size=34, color=color), T(verb, 27, color)).arrange(m.RIGHT, buff=0.3)
            for symbol, verb, color in ((r"E", "generates", GOLD), (r"P_{\text{uppet}}", "transmits", PAPER),
                                        (r"F_{\text{enforce}}", "enforces", PAPER), (r"I_{\text{buffer}}", "absorbs", HER))
        ]).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.2).move_to([4.3, 1.1, 0])
        self.flat(functions)
        self.play(m.FadeIn(functions), run_time=0.7)
