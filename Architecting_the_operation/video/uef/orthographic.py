"""Original Power reel: the Orthographic Illusion, in 3-D (book §Elite Obscuration, eq. 14.5).

The opening follows animations/ep01_cone: the in-group/out-group split turns until
white sits above black, and the camera pulls back to reveal the stacked tiers. Then the
camera goes under the Buffer and looks straight up.

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/orthographic.py Orthographic \
        -r 1080x1920 --fps 30 -o outputs/UEF_orthographic_illusion/video/orthographic.mp4
"""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, INK, M, T, UEFReel3D  # noqa: E402

PAPER = "#F2EFE8"
NIGHT = "#2E2E34"
ELITE = "#E6C26B"
PUPPET = "#9E7850"
FORCE = "#668099"
D = m.DEGREES

# (name, radius, z, color, label color)
TIERS = [
    ("Out-group", 3.0, -0.55, NIGHT, PAPER),
    ("Buffer", 2.45, 0.05, PAPER, "#141414"),
    ("Enforcement", 1.9, 0.6, FORCE, PAPER),
    ("Puppet", 1.35, 1.15, PUPPET, PAPER),
    ("Elite", 0.8, 1.7, ELITE, "#141414"),
]
H = 0.5


def tier(name, r, z, col, lcol):
    disc = m.Cylinder(radius=r, height=H, resolution=(2, 72), checkerboard_colors=False,
                      fill_color=col, fill_opacity=1, stroke_width=0)
    lab = m.Text(name, font="Noto Sans", font_size=30, color=lcol)
    lab.scale(min(1.0, 1.5 * r / lab.width)).rotate(m.PI / 2, axis=m.RIGHT).move_to([0, -r - 0.01, 0])
    disc.move_to([0, 0, z])
    lab.shift([0, 0, z])
    return m.Group(disc, lab)


class Orthographic(UEFReel3D):
    EP = "UEF_orthographic_illusion"
    SOURCE = "Source: The Original Power, §Elite Obscuration, Eq. 14.5"

    def construct(self):
        self.begin()
        B = self.BEATS
        self.set_camera_orientation(phi=90 * D, theta=-90 * D, zoom=3.2, frame_center=[0, 0, -0.2])
        self.add(m.AmbientLight(intensity=0.78),
                 m.SunLight(3 * m.OUT + 2 * m.LEFT - 4 * m.UP, intensity=0.32, shadows=False))
        out, buf, enf, pup, eli = [tier(*t) for t in TIERS]
        upper = [enf, pup, eli]
        buf_name = buf[1]
        in_name = m.Text("In-group", font="Noto Sans", font_size=30, color="#141414").rotate(m.PI / 2, axis=m.RIGHT).move_to(buf_name)
        buf.remove(buf_name)
        buf.add(in_name)
        self.add(out, buf)

        # 0 ── the flat split: white grows from the center, black on the right
        white = m.Rectangle(width=16, height=16, fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to([-8, 0, 0])
        black = m.Rectangle(width=16, height=16, fill_color=NIGHT, fill_opacity=1, stroke_width=0).move_to([8, 0, 0])
        halves = m.VGroup(black, white)
        lin = T("In-group", 44, "#141414", "NORMAL").move_to([-2.0, 0, 0])
        lout = T("Out-group", 44, PAPER, "NORMAL").move_to([2.0, 0, 0])
        self.flat(halves, lin, lout)
        white.stretch(0.01, 0, about_point=m.ORIGIN)
        lin.set_opacity(0)
        lout.set_opacity(0)
        self.play(white.animate.stretch(100, 0, about_point=m.ORIGIN), run_time=1.2)
        self.play(lin.animate.set_opacity(1), lout.animate.set_opacity(1), run_time=0.6)

        # 1 ── the divider turns: white above, black below
        self.until(self.cue(1, "above") - 0.6)
        self.play(m.Rotate(halves, -m.PI / 2, about_point=m.ORIGIN),
                  lin.animate.move_to([0, 2.6, 0]), lout.animate.move_to([0, -2.6, 0]), run_time=2.4)

        # 2 ── zoom out: the halves were disks, seen edge-on
        self.until(self.cue(2, "Zoom"))
        self.play(halves.animate.set_opacity(0), lin.animate.set_opacity(0), lout.animate.set_opacity(0), run_time=0.4)
        self.remove(halves, lin, lout)
        self.move_camera(phi=70 * D, theta=-90 * D, zoom=1.55, frame_center=[0, 0, 0.6], run_time=3.0)
        self.until(self.cue(2, "classes"))
        for t in upper:
            t.shift(m.OUT * 0.8).set_opacity(0)
        self.add(*upper)

        # 3 ── name the tiers; each rises into place
        buf.remove(in_name)
        buf.add(buf_name)
        self.play(m.FadeOut(in_name), m.FadeIn(buf_name), run_time=0.4)
        for t, w in zip(upper, ["Enforcement", "Puppet", "Elite"]):
            self.until(self.cue(3, w))
            self.play(t.animate.shift(m.IN * 0.8).set_opacity(1), run_time=0.5)
        self.until(B[4] - 0.2)

        # 4 ── back under: looking up from inside the out-group
        self.until(self.cue(4, "straight") - 0.8)
        self.move_camera(phi=104 * D, theta=-90 * D, zoom=1.55, frame_center=[0, 0, 0.6],
                         added_anims=[out.animate.set_opacity(0), *[t[1].animate.set_opacity(0) for t in (buf, enf, pup, eli)]],
                         run_time=2.2)

        # 5 ── orthographic projection: flatten along the line of sight
        self.until(self.cue(5, "Orthographic"))
        cap = T("ORTHOGRAPHIC PROJECTION", 44, GOLD).move_to([0, 5.6, 0])
        self.flat(cap)
        cap.set_opacity(0)
        self.play(cap.animate.set_opacity(1), run_time=0.4)
        self.until(self.cue(5, "directly") - 0.3)
        self.move_camera(phi=179.9 * D, theta=-90 * D, zoom=1.45, focal_distance=200, run_time=3.0)

        # 6 ── the apex disappears: the ceiling
        self.until(self.cue(6, "ceiling", nth=1))
        sq = T("THE CEILING", 60, INK).move_to([0, -4.7, 0])
        two = T("SOCIETY LOOKS LIKE TWO GROUPS", 34, DIM).move_to([0, -5.5, 0])
        self.flat(sq, two)
        sq.set_opacity(0)
        two.set_opacity(0)
        self.play(sq.animate.set_opacity(1), cap.animate.set_opacity(0), run_time=0.5)
        self.until(self.cue(6, "two"))
        self.play(two.animate.set_opacity(1), run_time=0.4)
        self.until(B[7] - 0.3)
        self.play(sq.animate.set_opacity(0), two.animate.set_opacity(0), run_time=0.3)

        # 7 ── theta-collapse: four tiers on one line of sight
        sight = m.Line3D([0, 0, -1.3], [0, 0, 2.6], thickness=0.06, color=GOLD)
        self.until(self.cue(7, "Elite"))
        eq = M(r"\theta_E = \theta_P = \theta_F = \theta_I", 64, GOLD).move_to([0, 5.5, 0])
        ob = T("ELITE OBSCURATION", 40, INK).move_to([0, 4.6, 0])
        self.flat(eq, ob)
        eq.set_opacity(0)
        ob.set_opacity(0)
        self.add(sight)
        self.play(eq.animate.set_opacity(1), ob.animate.set_opacity(1), run_time=0.8)
        self.until(self.cue(7, "Four"))
        self.move_camera(phi=100 * D, theta=-90 * D, zoom=1.55, focal_distance=20, frame_center=[0, 0, 0.6],
                         added_anims=[t[0].animate.set_opacity(0.3) for t in (buf, enf, pup, eli)], run_time=1.6)
        self.until(self.cue(7, "block"))
        blk = T("FOUR TIERS · ONE BLOCK", 42, GOLD).move_to([0, -4.9, 0])
        self.flat(blk)
        blk.set_opacity(0)
        self.play(blk.animate.set_opacity(1), run_time=0.4)
        self.until(B[8] - 0.3)
        self.play(*[x.animate.set_opacity(0) for x in (eq, ob, blk)], run_time=0.3)
        self.remove(sight)

        # 8 ── momentum up the z-axis grounds out at the Puppet Class
        self.move_camera(phi=78 * D, theta=-90 * D, zoom=1.55, frame_center=[0, 0, 0.6],
                         added_anims=[out[0].animate.set_opacity(0.35), pup[0].animate.set_opacity(1), eli[0].animate.set_opacity(1),
                                      *[t[1].animate.set_opacity(1) for t in (out, buf, enf, pup, eli)]],
                         run_time=0.8)
        self.until(self.cue(8, "momentum"))
        shot = m.Arrow3D([0, 0, -2.4], [0, 0, 1.15 - H / 2], color=HER, thickness=0.09)
        self.play(m.Create(shot), run_time=max(0.6, self.cue(8, "Puppet") - self.time))
        self.play(pup[0].animate.set_color(HER), run_time=0.3)
        self.play(pup[0].animate.set_color(PUPPET), run_time=0.5)
        self.until(self.cue(8, "Hearings"))
        hs = T("HEARINGS · RESIGNATIONS · SETTLEMENTS", 38, INK).move_to([0, 3.7, 0])
        self.flat(hs)
        hs.set_opacity(0)
        self.play(hs.animate.set_opacity(1), run_time=0.4)
        self.until(self.cue(8, "grounds"))
        gr = T("THE ENERGY NEVER REACHES THE TOP", 38, HER).move_to([0, -4.9, 0])
        self.flat(gr)
        gr.set_opacity(0)
        self.play(gr.animate.set_opacity(1), shot.animate.set_color(DIM).set_opacity(0.4), run_time=0.8)
        self.until(B[9] - 0.3)
        self.play(hs.animate.set_opacity(0), gr.animate.set_opacity(0), shot.animate.set_opacity(0),
                  out[0].animate.set_opacity(1), buf[0].animate.set_opacity(1), enf[0].animate.set_opacity(1), run_time=0.3)
        self.remove(shot)

        # 9 ── step outside, change the angle: the tiers come apart
        self.until(self.cue(9, "outside"))
        self.move_camera(phi=72 * D, theta=-45 * D, zoom=1.3, frame_center=[0, 0, 1.3], run_time=2.2)
        self.until(self.cue(9, "apart"))
        self.play(*[t.animate.shift(m.OUT * 0.55 * k) for k, t in enumerate([buf, enf, pup, eli], start=1)], run_time=1.4)
        ca = T("CHANGE THE ANGLE", 50, GOLD).move_to([0, -5.3, 0])
        self.flat(ca)
        ca.set_opacity(0)
        self.play(ca.animate.set_opacity(1), run_time=0.4)
        self.end_card()
