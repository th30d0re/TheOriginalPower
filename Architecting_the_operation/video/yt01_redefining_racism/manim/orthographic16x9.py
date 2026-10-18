"""Stepped prism pyramid (ep01_split geometry): S01-02 assembly, S03-50 orthographic illusion."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene3D  # noqa: E402

PAPER = "#F5F3F0"
NIGHT = "#030304"
ELITE = "#E6C26B"
PUPPET = "#9E7850"
FORCE = "#668099"
INK_FACE = "#141414"
D = m.DEGREES

# Base width 6.6 × S ≈ 60% of 14.22-unit frame width.
S = 1.38
PYRAMID_X = -2.0

TIER_META = (
    ("Out-group", PAPER),
    ("Buffer Class", INK),
    ("Enforcement Class", PAPER),
    ("Puppet Class", PAPER),
    ("Elite", INK),
)
LEGEND_YS = (-2.55, -1.35, -0.15, 1.05, 2.2)
LEADER_X0 = 2.6
LABEL_RIGHT = 6.35
LEGEND_LABEL_WIDTH = 3.55
STATUS_PANEL_Y = (-3.35, -3.85)


def _s(x):
    return x * S


def _prism(dimensions, color, center):
    box = m.Prism(
        dimensions=dimensions,
        fill_color=color,
        fill_opacity=1,
        stroke_width=0,
        shade_in_3d=False,
    )
    box.move_to(center)
    return box


def _half(color, x_center):
    return _prism([_s(22), _s(22), _s(0.08)], color, [x_center, 0, 0])


def _slab(width, color, z):
    return _prism([_s(width), _s(1.35), _s(0.42)], color, [PYRAMID_X, 0, _s(z)])


def _build_pyramid():
    """Out-group base through Elite — same stack as animations/ep01_split/scene.py."""
    slabs = [
        _slab(6.6, NIGHT, -0.55),
        _slab(5.6, PAPER, 0.15),
        _slab(4.5, FORCE, 0.85),
        _slab(3.5, PUPPET, 1.55),
        _slab(2.4, ELITE, 2.25),
    ]
    return m.VGroup(*slabs), slabs


def _legend_group():
    items = m.VGroup()
    for i, (name, color) in enumerate(TIER_META):
        y = LEGEND_YS[i]
        label = T(name, 36, color, "NORMAL", width=LEGEND_LABEL_WIDTH)
        label.move_to([LABEL_RIGHT, y, 0], aligned_edge=m.RIGHT)
        leader = m.Line(
            [LEADER_X0, y, 0],
            [label.get_left()[0] - 0.1, y, 0],
            stroke_color=DIM,
            stroke_width=1.5,
        )
        items.add(m.VGroup(leader, label))
    return items


def _horizontal_split():
    fw, fh = m.config.frame_width, m.config.frame_height
    top = m.Rectangle(width=fw + 0.2, height=fh / 2 + 0.05, fill_color=PAPER, stroke_width=0)
    top.move_to([0, fh / 4, 0])
    bottom = m.Rectangle(width=fw + 0.2, height=fh / 2 + 0.05, fill_color=NIGHT, stroke_width=0)
    bottom.move_to([0, -fh / 4, 0])
    return m.VGroup(top, bottom)


def _split_setup():
    white = _half(PAPER, -_s(11))
    black = _half(NIGHT, _s(11))
    halves = m.VGroup(black, white)

    in_proto = T("In-group", 40, INK_FACE)
    out_proto = T("Out-group", 40, PAPER)
    in_label = in_proto.copy().set_opacity(0)
    out_label = out_proto.copy().set_opacity(0)
    angle = m.ValueTracker(0)
    shown = m.ValueTracker(0)
    radius = m.ValueTracker(_s(2.4))

    def orbit(proto, sign):
        def upd(mobj):
            turned = proto.copy()
            turned.move_to([sign * radius.get_value(), 0, _s(0.3)])
            turned.set_opacity(shown.get_value())
            turned.rotate(angle.get_value(), about_point=m.ORIGIN)
            turned.rotate(-angle.get_value())
            mobj.become(turned)

        return upd

    in_label.add_updater(orbit(in_proto, -1))
    out_label.add_updater(orbit(out_proto, 1))
    return halves, white, in_label, out_label, angle, shown, radius


def _frame_solid(color):
    fw, fh = m.config.frame_width, m.config.frame_height
    rect = m.Rectangle(
        width=fw + 0.2,
        height=fh + 0.2,
        fill_color=color,
        fill_opacity=1,
        stroke_width=0,
    )
    return rect


class Orthographic16x9(YTScene3D):
    SOURCE = "Source: The Original Power, Ch. 2 · five-tier hierarchy"

    def _lights(self):
        self.add(
            m.AmbientLight(intensity=0.88),
            m.SunLight(5 * m.OUT + 4 * m.UP + 2 * m.RIGHT, intensity=0.18, shadows=False),
        )

    def _pyramid_camera(self, zoom=0.98):
        self.set_camera_orientation(
            phi=52 * D,
            theta=-68 * D,
            zoom=zoom,
            frame_center=[PYRAMID_X, 0, _s(0.72)],
        )

    def _add_legend(self):
        self.legend = _legend_group()
        for item in self.legend:
            item.set_opacity(0)
        self.flat(self.legend)
        return self.legend

    def _legend_opacity(self, focus_idx=None, all_on=False):
        anims = []
        for i, item in enumerate(self.legend):
            if all_on:
                op = 1.0
            elif focus_idx is None:
                op = 1.0
            elif i == focus_idx:
                op = 1.0
            else:
                op = 0.28
            anims.append(item.animate.set_opacity(op))
        return anims

    def _focus_tier(self, slabs, idx, slab_color=None):
        anims = []
        for i, slab in enumerate(slabs):
            slab_op = 1 if i == idx else 0.32
            anims.append(slab.animate.set_opacity(slab_op))
            if slab_color is not None and i == idx:
                anims.append(slab.animate.set_color(slab_color))
        anims.extend(self._legend_opacity(focus_idx=idx))
        self.play(*anims, run_time=0.5)

    def shot_S02_05(self):
        """YT02: assemble Figure 0.2, then walk the five structural tiers."""
        self._lights()
        tiers, slabs = _build_pyramid()
        for slab in slabs:
            slab.set_opacity(0)
        self.add(tiers)
        self._add_legend()
        self._pyramid_camera(zoom=0.98)

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
        adjacent.move_to([4.45, -3.25, 0])
        self.flat(adjacent)
        self.play(m.FadeIn(adjacent), run_time=0.4)
        self.until(self.beat_end(5) - 0.2)

    def shot_S01_02(self):
        self._lights()
        tiers, slabs = _build_pyramid()
        self.slabs = slabs
        self.out, self.buf, self.enf, self.pup, self.eli = slabs
        for slab in slabs:
            slab.set_opacity(0)

        halves, white, in_label, out_label, angle, shown, radius = _split_setup()
        self.add(halves, in_label, out_label)
        self.set_camera_orientation(phi=0.01, theta=-90 * D, zoom=1.48, frame_center=m.ORIGIN)
        shown.set_value(1)
        self.wait(0.05)

        self.play(shown.animate.set_value(1), run_time=0.35)
        self.until(self.at(0, "mathematically"))
        self.play(
            m.Rotate(halves, -m.PI / 2),
            angle.animate.set_value(-m.PI / 2),
            radius.animate.set_value(_s(1.35)),
            run_time=1.0,
        )
        in_label.clear_updaters()
        out_label.clear_updaters()
        self.play(
            m.FadeOut(halves),
            m.FadeOut(in_label),
            m.FadeOut(out_label),
            run_time=0.25,
        )
        self.add(tiers)
        self._add_legend()
        self._pyramid_camera(zoom=0.98)

        self.play(self.out.animate.set_opacity(1), run_time=0.4)
        self.play(self.buf.animate.set_opacity(1), run_time=0.38)
        for mob in (self.enf, self.pup, self.eli):
            self.play(mob.animate.set_opacity(1), run_time=0.35)
        self.play(*self._legend_opacity(all_on=True), run_time=0.35)
        self.until(self.at(0, "hierarchy"))

        # 1 — Elite extraction
        self.until(self.at(1, "Elite"))
        self._focus_tier(slabs, 4, ELITE)
        px = PYRAMID_X
        arrows = m.VGroup(
            *[
                m.Arrow3D([px, 0, z], [px, 0, _s(2.25) + _s(0.21)], color=GOLD, thickness=0.055)
                for z in (-_s(1.2), -_s(0.4))
            ]
        )
        self.play(m.Create(arrows), run_time=0.65)
        self.until(self.beat_end(1) - 0.25)
        self.remove(arrows)

        # 2 — Puppet Class / law
        self.until(self.at(2, "Puppet"))
        self._focus_tier(slabs, 3, PUPPET)
        law = T("LAW · POLICY", 34, PUPPET).move_to([PYRAMID_X, 3.15, 0])
        self.flat(law)
        self.play(m.FadeIn(law), run_time=0.4)
        self.until(self.beat_end(2) - 0.2)
        self.play(m.FadeOut(law), run_time=0.25)

        # 3 — Enforcement kinetic boundary
        self.until(self.at(3, "Enforcement"))
        self._focus_tier(slabs, 2, FORCE)
        bound = m.Line3D(
            [PYRAMID_X - _s(3.2), 0, _s(0.85)],
            [PYRAMID_X + _s(3.2), 0, _s(0.85)],
            color=HER,
            thickness=0.07,
        )
        self.play(m.Create(bound), run_time=0.55)
        self.until(self.beat_end(3) - 0.2)
        self.remove(bound)

        # 4 — Buffer suppression allocation
        self.until(self.at(4, "Buffer"))
        self._focus_tier(slabs, 1)
        alloc = m.Arrow3D(
            [PYRAMID_X + _s(3.0), 0, _s(0.15)],
            [PYRAMID_X, 0, _s(0.15)],
            color=GOLD,
            thickness=0.065,
        )
        self.play(m.Create(alloc), run_time=0.5)
        self.until(self.beat_end(4) - 0.2)

        # 5 — status wage, kinetic threat, material concessions (beside Buffer tier)
        self.until(self.at(5, "status"))
        panel_x = (LEADER_X0 + LABEL_RIGHT) / 2
        stat = T("STATUS WAGE", 32, GOLD, width=3.5).move_to([panel_x, STATUS_PANEL_Y[0], 0])
        mat = T("MATERIAL CONCESSIONS", 30, OK, width=3.5).move_to([panel_x, STATUS_PANEL_Y[1], 0])
        self.flat(stat, mat)
        self.play(m.FadeIn(stat), run_time=0.35)
        self.until(self.at(5, "kinetic"))
        gauge = m.Rectangle(
            width=2.6,
            height=0.38,
            stroke_color=HER,
            stroke_width=3,
            fill_color=NIGHT,
            fill_opacity=0.65,
        )
        fill = m.Rectangle(width=0.2, height=0.3, fill_color=HER, fill_opacity=1, stroke_width=0)
        gauge.move_to([panel_x, STATUS_PANEL_Y[1] - 0.55, 0])
        fill.align_to(gauge, m.LEFT).shift(m.RIGHT * 0.06)
        self.flat(gauge, fill)
        self.play(fill.animate.stretch_to_fit_width(2.15), run_time=0.55)
        self.until(self.at(5, "concessions"))
        self.play(m.FadeIn(mat), run_time=0.35)
        self.until(self.beat_end(5) - 0.2)
        self.play(m.FadeOut(stat), m.FadeOut(mat), m.FadeOut(gauge), m.FadeOut(fill), run_time=0.2)

        # 6 — sourced from O_racialized
        self.until(self.at(6, "sourced"))
        path = m.Arrow3D(
            [PYRAMID_X, 0, _s(-0.55)],
            [PYRAMID_X, 0, _s(0.15) - _s(0.21)],
            color=HER,
            thickness=0.065,
        )
        orace = M(r"O_{\text{racialized}}", 44, HER).move_to([PYRAMID_X, -3.05, 0])
        self.flat(orace)
        self.play(m.Create(path), m.FadeIn(orace), run_time=0.65)
        self.until(self.beat_end(6) - 0.2)
        self.play(m.FadeOut(orace), m.FadeOut(path), run_time=0.2)

        # 7 — Out-group base / compounding burden
        self.until(self.at(7, "base"))
        self._focus_tier(slabs, 0)
        self.until(self.at(7, "compounding"))
        layers = m.VGroup(
            *[
                m.Line3D(
                    [PYRAMID_X - _s(2.4) + i * _s(0.35), 0, _s(-0.55) - _s(0.12)],
                    [PYRAMID_X + _s(2.4) - i * _s(0.35), 0, _s(-0.55) - _s(0.12)],
                    color=DIM,
                    thickness=0.035,
                )
                for i in range(4)
            ]
        )
        self.play(m.Create(layers), run_time=0.55)
        self.until(self.beat_end(7) - 0.2)
        self.remove(layers)

        # 8 — connected extraction architecture
        self.until(self.at(8, "connected"))
        up = m.Arrow3D(
            [PYRAMID_X, 0, _s(-0.55) + _s(0.21)],
            [PYRAMID_X, 0, _s(2.25)],
            color=GOLD,
            thickness=0.075,
        )
        self.play(m.Create(up), run_time=0.65)
        self.until(self.beat_end(8) - 0.25)
        self.remove(up)

        # 9 — full architecture illuminated
        self.until(self.at(9, "stratified"))
        self.play(
            *[s.animate.set_opacity(1) for s in slabs],
            *self._legend_opacity(all_on=True),
            run_time=0.55,
        )
        arch = T("EXTRACTION ARCHITECTURE", 40, GOLD).move_to([PYRAMID_X, 3.2, 0])
        self.flat(arch)
        self.play(m.FadeIn(arch), run_time=0.4)
        self.until(self.beat_end(9) - 0.3)
        self.play(m.FadeOut(arch), run_time=0.25)

    def shot_S03_50(self):
        self._lights()
        tiers, slabs = _build_pyramid()
        for slab in slabs:
            slab.set_opacity(0)

        halves, white, in_label, out_label, angle, shown, radius = _split_setup()
        self.add(halves, in_label, out_label)
        self.set_camera_orientation(phi=0.01, theta=-90 * D, zoom=1.48, frame_center=m.ORIGIN)

        fill_white = _frame_solid(PAPER)
        fill_black = _frame_solid(NIGHT)
        fill_white.set_opacity(0)
        fill_black.set_opacity(0)
        cap_in = T("What the In-group looks like to the Out-group", 34, INK_FACE).to_edge(m.DOWN, buff=0.45)
        cap_out = T("What the Out-group looks like to the In-group", 34, PAPER).to_edge(m.DOWN, buff=0.45)
        cap_in.set_opacity(0)
        cap_out.set_opacity(0)
        self.flat(fill_white, fill_black, cap_in, cap_out)
        horiz = _horizontal_split()
        horiz.set_opacity(0)
        self.flat(horiz)

        self.play(shown.animate.set_value(1), run_time=0.45)

        self.until(self.at(0, "orthographic"))
        self.play(
            m.Rotate(halves, -m.PI / 2),
            angle.animate.set_value(-m.PI / 2),
            radius.animate.set_value(_s(1.35)),
            run_time=2.4,
        )

        self.play(
            in_label.animate.set_opacity(0),
            out_label.animate.set_opacity(0),
            run_time=0.12,
        )
        in_label.clear_updaters()
        out_label.clear_updaters()
        self.play(
            m.FadeOut(halves),
            m.FadeOut(in_label),
            m.FadeOut(out_label),
            horiz.animate.set_opacity(1),
            run_time=0.15,
        )

        self.until(self.at(0, "looking"))
        self.play(
            horiz.animate.set_opacity(0),
            fill_white.animate.set_opacity(1),
            run_time=0.2,
        )
        self.play(cap_in.animate.set_opacity(1), run_time=0.25)
        self.until(self.at(1, "below"))

        self.play(
            fill_white.animate.set_opacity(0),
            cap_in.animate.set_opacity(0),
            fill_black.animate.set_opacity(1),
            cap_out.animate.set_opacity(1),
            run_time=0.25,
        )
        self.until(self.at(1, "deeper"))

        self.play(
            m.FadeOut(fill_white),
            m.FadeOut(fill_black),
            m.FadeOut(cap_in),
            m.FadeOut(cap_out),
            m.FadeOut(horiz),
            run_time=0.2,
        )
        self.add(tiers)
        self._add_legend()
        out, buf, enf, pup, eli = slabs
        self.move_camera(
            phi=52 * D,
            theta=-68 * D,
            zoom=0.98,
            frame_center=[PYRAMID_X, 0, _s(0.72)],
            added_anims=[
                out.animate.set_opacity(1),
                buf.animate.set_opacity(1),
                enf.animate.set_opacity(1),
            ],
            run_time=2.2,
        )
        self.play(pup.animate.set_opacity(1), run_time=0.45)
        self.play(eli.animate.set_opacity(1), run_time=0.45)
        self.play(*self._legend_opacity(all_on=True), run_time=0.35)
        reveal = T("DEEPER ARCHITECTURE", 40, GOLD).move_to([PYRAMID_X, 3.15, 0])
        self.flat(reveal)
        self.play(m.FadeIn(reveal), run_time=0.4)
        self.until(self.beat_end(1) - 0.3)
