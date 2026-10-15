"""S16-31 multi-stage coil gun / Interface Swap schematic."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402

STAT = "#B28DFF"
COILS = ("CHATTEL", "JIM CROW", "INCARCERATION", "GIG")


def coil_stage(label, x, active=False):
    coil = m.VGroup(*[m.Arc(radius=0.18, angle=m.PI, stroke_color=GOLD if active else DIM, stroke_width=3)
                      .shift(m.RIGHT * i * 0.2) for i in range(5)])
    coil.move_to([x, -0.5, 0])
    txt = T(label, 20, GOLD if active else INK, width=2.6).next_to(coil, m.DOWN, buff=0.15)
    return m.VGroup(coil, txt)


class CoilGunInterface(YTScene):
    SHOT = "S16-31"

    def shot_S16_31(self):
        head = T("INTERFACE SWAP · COIL GUN", 32, GOLD, width=12.0).to_edge(m.UP, buff=0.5)
        elite = T("Elite", 30, GOLD).shift(m.UP * 2.6)
        rail = m.Line([-5.5, 1.8, 0], [5.5, 1.8, 0], color=DIM, stroke_width=3)
        stages = m.VGroup(*[coil_stage(lab, -3.6 + i * 2.4) for i, lab in enumerate(COILS)])
        projectile = m.Dot([-4.8, 1.8, 0], radius=0.14, color=HER)
        zlab = T("WEALTH EXTRACTION ↑", 24, GOLD, width=10.0).next_to(elite, m.DOWN, buff=0.12)
        stages.scale_to_fit_width(10.5)
        self.add(head, elite, rail, stages, projectile, zlab)
        footer = None

        def foot(text, color=OK):
            nonlocal footer
            mob = T(text, 24, color, width=11.0).to_edge(m.DOWN, buff=0.38)
            if footer:
                self.play(m.FadeOut(footer), run_time=0.2)
            footer = mob
            self.play(m.FadeIn(footer), run_time=0.35)

        self.until(self.at(0, "assassinations"))

        self.until(self.at(1, "Interface"))
        foot("MULTI-STAGE LINEAR ACCELERATOR")
        self.until(self.at(2, "coils"))
        self.play(projectile.animate.move_to([2.0, 1.8, 0]), run_time=1.2)
        self.until(self.at(3, "projectile"))
        field = T("jψ_s SATURATES BUFFER", 26, STAT).shift(m.DOWN * 2.2)
        self.play(m.FadeIn(field), run_time=0.4)
        self.until(self.at(4, "saturates"))
        self.until(self.at(5, "Civil"))
        self.play(stages[1][0].animate.set_color(HER), run_time=0.5)
        cut = T("JIM CROW COIL POWER CUT", 26, HER).next_to(stages[1], m.UP, buff=0.15)
        self.play(m.FadeIn(cut), run_time=0.4)
        self.until(self.at(5, "shut"))
        self.play(stages[1].animate.set_opacity(0.25), run_time=0.6)

        self.until(self.at(6, "collapsed"))
        seg = T("SEGREGATION FIELD COLLAPSE", 26, HER).next_to(stages[1], m.DOWN, buff=0.55)
        self.play(m.FadeIn(seg), stages[1].animate.set_opacity(0.1), run_time=0.55)

        self.until(self.at(7, "fascist"))
        foot("WHITE FLIGHT · KKK · VIGILANTE PANIC", HER)
        self.until(self.at(8, "flyback"))
        foot("FLYBACK → WASTE HEAT", DIM)
        self.until(self.at(9, "engineers"))
        foot("ENERGY → NEXT COIL CAPACITORS", GOLD)
        self.until(self.at(10, "routed"))
        foot("SOUTHERN STRATEGY · POLICE MILITARIZATION")
        self.until(self.at(11, "Nixon"))
        foot("SOUTHERN STRATEGY · MILITARIZATION CAPITAL", GOLD)
        self.until(self.at(12, "suppression"))
        foot("SUPPRESSION CAPITAL TRANSFER", GOLD)
        self.until(self.at(13, "transfer"))
        foot("OBSOLETE HARDWARE CHARGES NEXT ITERATION", INK)
        self.until(self.beat_end(13) - 0.3)
