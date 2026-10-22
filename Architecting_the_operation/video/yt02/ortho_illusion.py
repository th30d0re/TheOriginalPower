"""SEG 07: the orthographic illusion, projection, and deflection in one 3D run."""

import sys
from pathlib import Path

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))

from common16x9 import DIM, GOLD, HER, INK, T, YTScene3D  # noqa: E402
from orthographic16x9 import (  # noqa: E402
    D,
    PYRAMID_X,
    Orthographic16x9,
    _build_pyramid,
    _horizontal_split,
    _legend_group,
    _split_setup,
)
from tier_pyramid import ELITE, FORCE, NIGHT, PAPER, PUPPET  # noqa: E402


class OrthoIllusion(YTScene3D):
    """Continuous S07-01..S07-17 camera argument."""

    def shot_S07_01(self):
        Orthographic16x9._lights(self)
        tiers, slabs = _build_pyramid()
        out, buf, enf, pup, eli = slabs
        for slab in slabs:
            slab.set_opacity(0)
        self.add(tiers)

        # Reuse the established projection helpers as the source geometry.
        halves, _white, _in_orbit, _out_orbit, _angle, _shown, _radius = _split_setup()
        horizontal_plane = _horizontal_split().set_opacity(0)
        legend = _legend_group().set_opacity(0)

        title = T("THE ORTHOGRAPHIC ILLUSION", 38, GOLD).move_to([0, 3.48, 0])
        in_box = m.Rectangle(width=5.4, height=3.45, fill_color=PAPER, fill_opacity=1, stroke_color=DIM, stroke_width=2)
        out_box = m.Rectangle(width=5.4, height=3.45, fill_color=NIGHT, fill_opacity=1, stroke_color=DIM, stroke_width=2)
        in_box.move_to([-2.75, 0.25, 0])
        out_box.move_to([2.75, 0.25, 0])
        in_mark = m.VGroup(T("In-group", 34, NIGHT), m.MathTex("I", font_size=54, color=NIGHT)).arrange(m.DOWN, buff=0.18)
        out_mark = m.VGroup(T("Out-group", 34, PAPER), m.MathTex("O", font_size=54, color=PAPER)).arrange(m.DOWN, buff=0.18)
        in_mark.move_to(in_box)
        out_mark.move_to(out_box)
        binary = m.VGroup(in_box, out_box, in_mark, out_mark)
        self.flat(binary, title, legend)

        self.set_camera_orientation(phi=0.01, theta=-90 * D, zoom=1.12, frame_center=m.ORIGIN)
        self.until(self.at(0, "binary"))
        self.play(m.FadeIn(binary), run_time=0.7)
        self.until(self.at(0, "illusion"))
        self.play(m.Indicate(title, color=GOLD), run_time=0.6)

        # 1 — reveal the actual pyramid from apex to base as each named region arrives.
        self.until(self.at(1, "pyramid"))
        self.play(m.FadeOut(binary), m.FadeOut(title), run_time=0.35)
        self.move_camera(phi=52 * D, theta=-68 * D, zoom=0.98,
                         frame_center=[PYRAMID_X, 0, 1.0], run_time=1.15)
        self.until(self.at(1, "Elite"))
        self.play(eli.animate.set_opacity(1), run_time=0.6)
        self.until(self.at(1, "Out-group"))
        self.play(m.LaggedStart(*[s.animate.set_opacity(1) for s in (pup, enf, buf, out)], lag_ratio=0.12),
                  legend.animate.set_opacity(1), run_time=1.1)

        # 2 — parallel sightlines meet a fixed projection plane and leave a binary shadow.
        self.until(self.at(2, "Orthographic"))
        self.play(legend.animate.set_opacity(0), run_time=0.3)
        plane = m.Rectangle(width=4.0, height=4.8, fill_color=DIM, fill_opacity=0.16,
                            stroke_color=PAPER, stroke_width=2).rotate(90 * D, axis=m.UP)
        plane.move_to([3.15, 0, 0.9])
        rays = m.VGroup(*[
            m.Line3D([PYRAMID_X - 2.4, y, z], [3.1, y, z], color=HER, thickness=0.025)
            for y, z in ((-0.5, -0.35), (0, 0.25), (0.5, 0.85), (0, 1.45))
        ])
        shadow = m.VGroup(
            m.Rectangle(width=1.0, height=2.0, fill_color=PAPER, fill_opacity=0.88, stroke_width=0),
            m.Rectangle(width=1.0, height=2.0, fill_color=NIGHT, fill_opacity=0.96, stroke_color=PAPER, stroke_width=1),
        ).arrange(m.RIGHT, buff=0).move_to([3.2, 0, 0.9]).rotate(90 * D, axis=m.UP)
        self.play(m.FadeIn(plane), run_time=0.45)
        self.until(self.at(2, "sight"))
        self.play(m.Create(rays), run_time=0.8)
        self.until(self.at(2, "overlap"))
        self.play(m.FadeIn(shadow), run_time=0.6)

        # 3 — head-on projection returns to the visible binary.
        self.until(self.at(3, "head-on"))
        self.play(m.FadeOut(plane), m.FadeOut(rays), m.FadeOut(shadow), run_time=0.35)
        self.move_camera(phi=90 * D, theta=-90 * D, zoom=1.12, frame_center=m.ORIGIN,
                         added_anims=[binary.animate.set_opacity(1), *[s.animate.set_opacity(0) for s in slabs]],
                         run_time=1.2)
        self.until(self.at(3, "vanishes"))
        self.play(m.Indicate(binary, scale_factor=1.03, color=GOLD), run_time=0.6)

        # 4 — an oblique camera restores depth and the gold-rimmed apex.
        self.until(self.at(4, "Rotate"))
        self.play(m.FadeOut(binary), run_time=0.3)
        self.move_camera(phi=55 * D, theta=-55 * D, zoom=0.98,
                         frame_center=[PYRAMID_X, 0, 1.0],
                         added_anims=[s.animate.set_opacity(1) for s in slabs], run_time=1.25)
        self.until(self.at(4, "apex"))
        apex_rim = m.SurroundingRectangle(eli, color=GOLD, buff=0.06, stroke_width=5)
        self.play(m.Create(apex_rim), m.Indicate(eli, color=ELITE), run_time=0.75)

        # 5 — occupy the base and look upward into the Buffer underside.
        self.until(self.at(5, "upward"))
        self.play(m.FadeOut(apex_rim), run_time=0.25)
        self.move_camera(phi=22 * D, theta=-90 * D, zoom=1.42,
                         frame_center=[PYRAMID_X, 0, 0.05], run_time=1.15)
        self.until(self.at(5, "Buffer"))
        self.play(m.Indicate(buf, color=PAPER), run_time=0.65)

        # 6 — the nearest surface becomes the Square Ceiling; upper tiers remain ghosts.
        self.until(self.at(6, "Square"))
        ceiling = T("SQUARE CEILING", 38, GOLD).move_to([4.65, 2.15, 0])
        ceiling_rule = m.Line([3.15, 1.78, 0], [6.15, 1.78, 0], color=GOLD, stroke_width=3)
        self.flat(ceiling, ceiling_rule)
        self.play(m.FadeIn(ceiling), m.Create(ceiling_rule),
                  *[s.animate.set_opacity(0.16) for s in (enf, pup, eli)], run_time=0.75)
        self.until(self.at(6, "binary"))
        self.play(m.Indicate(buf, color=GOLD), run_time=0.55)

        # 7 — reverse the look; extraction exits a visible frame above the observer.
        self.until(self.at(7, "downward"))
        self.play(m.FadeOut(ceiling), m.FadeOut(ceiling_rule), run_time=0.3)
        self.move_camera(phi=132 * D, theta=-70 * D, zoom=1.12,
                         frame_center=[PYRAMID_X, 0, -0.2], run_time=1.1)
        extraction = m.VGroup(*[
            m.Arrow3D([PYRAMID_X + dx, 0, -0.45], [PYRAMID_X + dx, 0, 3.45],
                      color=GOLD, thickness=0.055)
            for dx in (-0.42, 0.42)
        ])
        frame = m.Rectangle(width=9.5, height=5.25, stroke_color=PAPER, stroke_width=3)
        outside = T("EXTRACTION → E", 27, GOLD).move_to([4.85, 2.55, 0])
        self.flat(frame, outside)
        self.play(m.Create(extraction), m.FadeIn(frame), run_time=0.8)
        self.until(self.at(7, "outside"))
        self.play(m.FadeIn(outside), run_time=0.55)

        # 8 — wide architecture and a complete base-to-apex circuit.
        self.until(self.at(8, "Zoom"))
        self.play(m.FadeOut(frame), m.FadeOut(outside), run_time=0.25)
        Orthographic16x9._pyramid_camera(self, zoom=0.98)
        self.play(*[s.animate.set_opacity(1) for s in slabs], legend.animate.set_opacity(1), run_time=0.7)
        self.until(self.at(8, "connected"))
        self.play(m.Indicate(extraction, color=GOLD), run_time=0.75)

        # 9 — the sightline flashes through the intermediary tiers and ends below E.
        self.until(self.at(9, "Elite"))
        sightline = m.Arrow3D([PYRAMID_X, -4.0, -0.05], [PYRAMID_X, -0.25, 1.82],
                              color=HER, thickness=0.065)
        self.play(m.Create(sightline), run_time=0.7)
        self.until(self.at(9, "sightline"))
        self.play(m.LaggedStart(*[m.Indicate(s, color=HER) for s in (buf, enf, pup)], lag_ratio=0.15),
                  run_time=1.05)

        # 10 — base boundary and elevation ticks show two distinct geometric relations.
        self.until(self.at(10, "real"))
        self.play(legend.animate.set_opacity(0), run_time=0.3)
        boundary = m.Line3D([PYRAMID_X - 3.8, 0, -0.9], [PYRAMID_X + 3.8, 0, -0.9],
                            color=HER, thickness=0.075)
        self.play(m.Create(boundary), run_time=0.65)
        self.until(self.at(10, "hierarchy"))
        axis = m.Line3D([PYRAMID_X - 3.95, 0, 0.1], [PYRAMID_X - 3.95, 0, 3.65],
                        color=PAPER, thickness=0.035)
        ticks = m.VGroup(*[
            m.Line3D([PYRAMID_X - 4.1, 0, z], [PYRAMID_X - 3.8, 0, z], color=GOLD, thickness=0.04)
            for z in (0.2, 1.15, 2.1, 3.05)
        ])
        self.play(m.Create(axis), m.LaggedStart(*[m.Create(t) for t in ticks], lag_ratio=0.12), run_time=0.9)

        # 11 — fixed callouts distinguish projection from elevation.
        self.until(self.at(11, "two", nth=0))
        eq21 = m.VGroup(m.MathTex(r"\mathrm{Eq}\ 2.1", font_size=38, color=GOLD),
                        T("projection", 28, PAPER)).arrange(m.DOWN, buff=0.12).move_to([4.65, 1.75, 0])
        self.flat(eq21)
        self.play(m.FadeIn(eq21), run_time=0.6)
        self.until(self.at(11, "two", nth=1))
        eq22 = m.VGroup(m.MathTex(r"\mathrm{Eq}\ 2.2", font_size=38, color=HER),
                        T("elevation", 28, PAPER)).arrange(m.DOWN, buff=0.12).move_to([4.65, 0.25, 0])
        self.flat(eq22)
        self.play(m.FadeIn(eq22), run_time=0.6)

        # 12 — vertical momentum hits the Buffer plane and bends ninety degrees.
        self.until(self.at(12, "Orthogonal"))
        self.play(m.FadeOut(eq21), m.FadeOut(eq22), m.FadeOut(sightline), run_time=0.3)
        up_arrow = m.Arrow3D([PYRAMID_X + 1.0, 0, -0.8], [PYRAMID_X + 1.0, 0, 0.05],
                             color=HER, thickness=0.075)
        deflect_plane = m.Rectangle(width=5.0, height=2.0, fill_color=PAPER, fill_opacity=0.12,
                                    stroke_color=GOLD, stroke_width=2).rotate(90 * D, axis=m.RIGHT)
        deflect_plane.move_to([PYRAMID_X, 0, 0.12])
        self.play(m.Create(up_arrow), m.FadeIn(deflect_plane), run_time=0.75)
        self.until(self.at(12, "horizontal"))
        across = m.Arrow3D([PYRAMID_X + 1.0, 0, 0.05], [PYRAMID_X + 3.35, 0, 0.05],
                           color=HER, thickness=0.075)
        self.play(m.Create(across), run_time=0.75)

        # 13 — the redirected vector terminates at the Buffer; the apex stays unchanged.
        self.until(self.at(13, "Kinetic"))
        decoy = T("KINETIC DECOY", 36, HER).move_to([4.65, 1.85, 0])
        self.flat(decoy)
        self.play(m.FadeIn(decoy), m.Indicate(buf, color=HER), run_time=0.75)

        # 14 — projection and collision become one coupled local picture.
        self.until(self.at(14, "reinforce"))
        cone = m.Polygon([-0.7, -0.5, 0], [2.2, -1.35, 0], [2.2, 0.35, 0],
                         fill_color=HER, fill_opacity=0.12, stroke_color=HER, stroke_width=2)
        cone.move_to([1.15, -0.15, 0])
        self.flat(cone)
        self.play(m.FadeIn(cone), run_time=0.65)
        self.until(self.at(14, "collides"))
        self.play(m.Indicate(across, color=GOLD), m.Indicate(buf, color=HER), run_time=0.7)

        # 15 — wide view retains local collision and uninterrupted extraction.
        self.until(self.at(15, "wide"))
        self.play(m.FadeOut(decoy), m.FadeOut(cone), m.FadeOut(deflect_plane), run_time=0.3)
        self.move_camera(phi=52 * D, theta=-68 * D, zoom=0.82,
                         frame_center=[PYRAMID_X, 0, 1.0], run_time=1.0)
        self.until(self.at(15, "capture"))
        self.play(m.Indicate(extraction, color=GOLD), m.Indicate(across, color=HER), run_time=0.75)

        # 16 — locate generation and assign the downstream functions.
        self.until(self.at(16, "generative"))
        query = m.Circle(radius=0.72, color=GOLD, stroke_width=5).move_to(eli.get_center())
        self.play(m.Create(query), m.Indicate(eli, color=ELITE), run_time=0.75)
        self.until(self.at(16, "absorb"))
        functions = m.VGroup(
            T("E   generates", 27, GOLD),
            T("P   transmits", 27, PAPER),
            T("F   enforces", 27, PAPER),
            T("I_buffer   absorbs", 27, HER),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.2).move_to([4.5, 1.1, 0])
        self.flat(functions)
        self.play(m.FadeIn(functions), run_time=0.7)
        self.until(self.beat_end(16) - 0.2)
