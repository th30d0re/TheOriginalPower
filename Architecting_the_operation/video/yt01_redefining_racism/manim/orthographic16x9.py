"""Five-tier cone: front assembly (S01-02) and orthographic illusion from below (S03-50)."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, OK, T, YTScene3D  # noqa: E402

PAPER = "#F2EFE8"
NIGHT = "#2E2E34"
ELITE = "#E6C26B"
PUPPET = "#9E7850"
FORCE = "#668099"
D = m.DEGREES
SCALE = 1.3

# (name, radius, z, color, label color)
TIERS = [
    ("Out-group", 3.0 * SCALE, -0.55 * SCALE, NIGHT, PAPER),
    ("Buffer Class", 2.45 * SCALE, 0.05 * SCALE, PAPER, "#141414"),
    ("Enforcement Class", 1.9 * SCALE, 0.6 * SCALE, FORCE, PAPER),
    ("Puppet Class", 1.35 * SCALE, 1.15 * SCALE, PUPPET, PAPER),
    ("Elite", 0.8 * SCALE, 1.7 * SCALE, ELITE, "#141414"),
]
H = 0.5 * SCALE


def tier(name, r, z, col, lcol):
    disc = m.Cylinder(radius=r, height=H, resolution=(2, 72), checkerboard_colors=False,
                      fill_color=col, fill_opacity=1, stroke_width=0)
    lab = T(name, 28, lcol, "NORMAL", width=2.2 * r)
    lab.rotate(m.PI / 2, axis=m.RIGHT).move_to([0, -r - 0.02, 0])
    disc.move_to([0, 0, z])
    lab.shift([0, 0, z])
    return m.Group(disc, lab)


class Orthographic16x9(YTScene3D):
    SOURCE = "Source: The Original Power, Ch. 2 · five-tier hierarchy"

    def _lights_and_tiers(self):
        self.set_camera_orientation(phi=72 * D, theta=-88 * D, zoom=0.92, frame_center=[0, 0, 0.75 * SCALE])
        self.add(m.AmbientLight(intensity=0.78),
                 m.SunLight(3 * m.OUT + 2 * m.LEFT - 4 * m.UP, intensity=0.32, shadows=False))
        self.tiers = [tier(*t) for t in TIERS]
        self.out, self.buf, self.enf, self.pup, self.eli = self.tiers
        for t in self.tiers:
            t.set_opacity(0)

    def _focus_tier(self, idx, color=None):
        anims = []
        for i, t in enumerate(self.tiers):
            op = 1 if i == idx else 0.28
            anims.append(t.animate.set_opacity(op))
            if color and i == idx:
                anims.append(t[0].animate.set_color(color))
        self.play(*anims, run_time=0.55)

    def shot_S01_02(self):
        self._lights_and_tiers()
        self.add(self.out)
        self.play(self.out.animate.set_opacity(1), run_time=0.5)
        self.until(self.at(0, "hierarchy"))
        for mob in (self.buf, self.enf, self.pup, self.eli):
            self.add(mob)
            self.play(mob.animate.set_opacity(1), run_time=0.45)

        # 1 — Elite extraction
        self.until(self.at(1, "Elite"))
        self._focus_tier(4, ELITE)
        arrows = m.VGroup(*[m.Arrow3D([0, 0, z], [0, 0, TIERS[4][2] + H / 2], color=GOLD, thickness=0.06)
                            for z in (-1.8 * SCALE, -1.0 * SCALE)])
        self.play(m.Create(arrows), run_time=0.7)
        self.until(self.beat_end(1) - 0.25)
        self.remove(arrows)

        # 2 — Puppet Class / law
        self.until(self.at(2, "Puppet"))
        self._focus_tier(3, PUPPET)
        law = T("LAW · POLICY", 30, PUPPET).move_to([3.8, 2.2, 0])
        self.flat(law)
        self.play(m.FadeIn(law), run_time=0.4)
        self.until(self.beat_end(2) - 0.2)
        self.play(m.FadeOut(law), run_time=0.25)

        # 3 — Enforcement kinetic boundary
        self.until(self.at(3, "Enforcement"))
        self._focus_tier(2, FORCE)
        bound = m.Line3D([-3.5, 0, TIERS[2][2]], [3.5, 0, TIERS[2][2]], color=HER, thickness=0.08)
        self.play(m.Create(bound), run_time=0.6)
        self.until(self.beat_end(3) - 0.2)
        self.remove(bound)

        # 4 — Buffer suppression allocation
        self.until(self.at(4, "Buffer"))
        self._focus_tier(1)
        alloc = m.Arrow3D([3.2, 0, TIERS[1][2]], [0, 0, TIERS[1][2]], color=GOLD, thickness=0.07)
        self.play(m.Create(alloc), run_time=0.5)
        self.until(self.beat_end(4) - 0.2)

        # 5 — status wage, kinetic threat, material concessions (one turn)
        self.until(self.at(5, "status"))
        stat = T("STATUS WAGE", 28, GOLD).move_to([-3.5, 2.5, 0])
        mat = T("MATERIAL CONCESSIONS", 26, OK).move_to([3.5, 2.5, 0])
        self.flat(stat, mat)
        self.play(m.FadeIn(stat), run_time=0.35)
        self.until(self.at(5, "kinetic"))
        gauge = m.Rectangle(width=2.4, height=0.35, stroke_color=HER, stroke_width=3, fill_color=NIGHT, fill_opacity=0.6)
        fill = m.Rectangle(width=0.2, height=0.28, fill_color=HER, fill_opacity=1, stroke_width=0)
        gauge.move_to([0, 3.0, 0])
        fill.align_to(gauge, m.LEFT).shift(m.RIGHT * 0.06)
        self.flat(gauge, fill)
        self.play(fill.animate.stretch_to_fit_width(2.0), run_time=0.6)
        self.until(self.at(5, "concessions"))
        self.play(m.FadeIn(mat), run_time=0.35)
        self.until(self.beat_end(5) - 0.2)
        self.play(m.FadeOut(stat), m.FadeOut(mat), m.FadeOut(gauge), m.FadeOut(fill), run_time=0.2)

        # 6 — sourced from O_racialized
        self.until(self.at(6, "sourced"))
        path = m.Arrow3D([0, 0, TIERS[0][2]], [0, 0, TIERS[1][2] - H / 2], color=HER, thickness=0.07)
        orace = M(r"O_{\text{racialized}}", 40, HER).move_to([0, -3.0, 0])
        self.flat(orace)
        self.play(m.Create(path), m.FadeIn(orace), run_time=0.7)
        self.until(self.beat_end(6) - 0.2)
        self.play(m.FadeOut(orace), m.FadeOut(path), run_time=0.2)

        # 7 — Out-group base / compounding burden
        self.until(self.at(7, "base"))
        self._focus_tier(0)
        self.until(self.at(7, "compounding"))
        layers = m.VGroup(*[m.Line3D([-2.5 + i * 0.4, 0, TIERS[0][2] - 0.15], [2.5 - i * 0.4, 0, TIERS[0][2] - 0.15],
                                       color=DIM, thickness=0.04) for i in range(4)])
        self.play(m.Create(layers), run_time=0.6)
        self.until(self.beat_end(7) - 0.2)
        self.remove(layers)

        # 8 — connected extraction architecture
        self.until(self.at(8, "connected"))
        up = m.Arrow3D([0, 0, TIERS[0][2] + H], [0, 0, TIERS[4][2]], color=GOLD, thickness=0.08)
        self.play(m.Create(up), run_time=0.7)
        self.until(self.beat_end(8) - 0.25)
        self.remove(up)

        # 9 — full architecture illuminated
        self.until(self.at(9, "stratified"))
        self.play(*[t.animate.set_opacity(1) for t in self.tiers], run_time=0.6)
        arch = T("EXTRACTION ARCHITECTURE", 32, GOLD).move_to([0, 3.2, 0])
        self.flat(arch)
        self.play(m.FadeIn(arch), run_time=0.4)
        self.until(self.beat_end(9) - 0.3)
        self.play(m.FadeOut(arch), run_time=0.25)

    def shot_S03_50(self):
        self._lights_and_tiers()
        for t in self.tiers:
            t.set_opacity(1)
        self.add(*self.tiers)

        # 0 — camera below Buffer, tiers align behind
        self.until(self.at(0, "below"))
        self.move_camera(phi=104 * D, theta=-90 * D, zoom=0.88, frame_center=[0, 0, 0.65 * SCALE],
                         added_anims=[self.out[1].animate.set_opacity(0), *[t[1].animate.set_opacity(0) for t in self.tiers[1:]]],
                         run_time=2.0)
        self.until(self.at(0, "align"))
        cap = T("ORTHOGRAPHIC PROJECTION", 36, GOLD).move_to([0, 3.1, 0])
        self.flat(cap)
        self.play(m.FadeIn(cap), run_time=0.35)
        self.move_camera(phi=179.5 * D, theta=-90 * D, zoom=0.82, focal_distance=200, run_time=2.2)
        self.until(self.beat_end(0) - 0.3)
        self.play(m.FadeOut(cap), run_time=0.2)

        # 1 — binary looks complete; change angle
        self.until(self.at(1, "complete"))
        ceiling = T("BINARY LOOKS COMPLETE", 34, INK).move_to([0, -2.9, 0])
        self.flat(ceiling)
        self.play(m.FadeIn(ceiling), run_time=0.4)
        self.until(self.at(1, "resolved"))
        self.play(m.FadeOut(ceiling), run_time=0.25)
        self.move_camera(phi=68 * D, theta=-42 * D, zoom=0.78, frame_center=[0, 0, 1.1 * SCALE],
                         added_anims=[*[t[1].animate.set_opacity(1) for t in self.tiers],
                                      *[t.animate.shift(m.OUT * 0.35 * i) for i, t in enumerate(self.tiers[1:], start=1)]],
                         run_time=2.0)
        reveal = T("DEEPER ARCHITECTURE", 36, GOLD).move_to([0, -3.0, 0])
        self.flat(reveal)
        self.play(m.FadeIn(reveal), run_time=0.4)
        self.until(self.beat_end(1) - 0.3)
