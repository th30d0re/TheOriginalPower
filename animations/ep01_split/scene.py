"""The orthographic split, drawn in ManimGX.

The white half fills in from the center. The divider turns until white is above
and black is below. The camera pulls back, and the three tiers that were above
the frame come into view. The white face is the buffer.

    manimgx inspect animations/ep01_split/scene.py OrthographicSplit -t 1.2,4,7.2,11,16.5,end
    manimgx render animations/ep01_split/scene.py OrthographicSplit --fps 30
"""

import manimgx as m

m.config.background_color = "#000000"

PAPER = "#F5F3F0"
INK = "#141414"
NIGHT = "#030304"
FIELD = "#75757A"
ELITE = "#E6C26B"
PUPPET = "#9E7850"
FORCE = "#668099"


def _half(color, center):
    box = m.Prism(
        dimensions=[22, 22, 0.08],
        fill_color=color,
        fill_opacity=1,
        stroke_width=0,
    )
    box.move_to(center)
    return box


def _slab(width, color, z):
    box = m.Prism(
        dimensions=[width, 1.35, 0.42],
        fill_color=color,
        fill_opacity=1,
        stroke_width=0,
    )
    box.move_to([0, 0, z])
    return box


def _face_label(text, color, z):
    label = m.Text(text, font_size=28, color=color)
    label.rotate(m.PI / 2, axis=m.RIGHT)
    label.move_to([0, -0.7, z])
    return label


class OrthographicSplit(m.ThreeDScene):
    def construct(self) -> None:
        self.set_camera_orientation(phi=0.01, theta=-90 * m.DEGREES, zoom=1.55)
        self.add(
            m.AmbientLight(intensity=0.92),
            m.SunLight(5 * m.OUT + 4 * m.UP + 2 * m.RIGHT, intensity=0.16, shadows=False),
        )

        white = _half(PAPER, [-11, 0, 0])
        black = _half(NIGHT, [11, 0, 0])
        halves = m.VGroup(black, white)
        white.scale(0.02, about_point=m.ORIGIN)

        in_proto = m.Text("In-group", font_size=36, color=INK)
        out_proto = m.Text("Out-group", font_size=36, color=PAPER)
        in_label = in_proto.copy().set_opacity(0)
        out_label = out_proto.copy().set_opacity(0)
        angle = m.ValueTracker(0)
        shown = m.ValueTracker(0)
        radius = m.ValueTracker(2.4)

        def orbit(proto, sign):
            def upd(mobj):
                turned = proto.copy()
                turned.move_to([sign * radius.get_value(), 0, 0.3])
                turned.set_opacity(shown.get_value())
                turned.rotate(angle.get_value(), about_point=m.ORIGIN)
                turned.rotate(-angle.get_value())
                mobj.become(turned)
            return upd

        in_label.add_updater(orbit(in_proto, -1))
        out_label.add_updater(orbit(out_proto, 1))

        ground = m.Prism(
            dimensions=[18, 10, 0.04],
            fill_color=FIELD,
            fill_opacity=0,
            stroke_width=0,
        ).move_to([0, 0, -1.6])

        buffer = _slab(5.6, PAPER, 0.15)
        out_slab = _slab(6.6, NIGHT, -0.55)
        enforce = _slab(4.5, FORCE, 0.85)
        puppet = _slab(3.5, PUPPET, 1.55)
        elite = _slab(2.4, ELITE, 2.25)
        tiers = m.VGroup(enforce, puppet, elite)
        for slab in (buffer, out_slab, *tiers):
            slab.set_opacity(0)

        names = m.VGroup(
            _face_label("Buffer", INK, 0.15),
            _face_label("Out-group", PAPER, -0.55),
            _face_label("Enforcement", PAPER, 0.85),
            _face_label("Puppet", PAPER, 1.55),
            _face_label("Elite", INK, 2.25),
        )
        names.set_opacity(0)

        self.add(ground, halves, in_label, out_label, buffer, out_slab, tiers, names)

        self.play(white.animate.scale(50, about_point=m.ORIGIN), run_time=1.25)
        self.play(shown.animate.set_value(1), run_time=0.7)
        self.wait(2.95)

        self.play(
            m.Rotate(halves, -m.PI / 2),
            angle.animate.set_value(-m.PI / 2),
            radius.animate.set_value(1.35),
            run_time=3.2,
        )
        self.wait(0.7)

        in_label.clear_updaters()
        out_label.clear_updaters()
        self.play(
            m.FadeOut(halves),
            m.FadeOut(in_label),
            m.FadeOut(out_label),
            run_time=0.2,
        )
        self.move_camera(
            phi=56 * m.DEGREES,
            theta=-70 * m.DEGREES,
            zoom=1.55,
            frame_center=[0, 0, 0.7],
            added_anims=[
                buffer.animate.set_opacity(1),
                out_slab.animate.set_opacity(1),
                ground.animate.set_opacity(1),
                enforce.animate.set_opacity(1),
                names[0].animate.set_opacity(1),
                names[1].animate.set_opacity(1),
                names[2].animate.set_opacity(1),
            ],
            run_time=3.6,
        )
        self.play(
            puppet.animate.set_opacity(1),
            names[3].animate.set_opacity(1),
            run_time=0.6,
        )
        self.play(
            elite.animate.set_opacity(1),
            names[4].animate.set_opacity(1),
            run_time=0.6,
        )
        self.wait(5.1)
