"""S16-31 multi-stage coil gun / Interface Swap schematic."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402

STAT = "#B28DFF"
COILS = ("CHATTEL", "JIM CROW", "INCARCERATION", "GIG")


def coil_loops(active=False, dimmed=False):
    color = HER if active else (DIM if dimmed else GOLD)
    sw = 6 if active else 4
    loops = m.VGroup(
        *[m.Arc(radius=0.38, angle=m.PI, stroke_color=color, stroke_width=sw).shift(m.RIGHT * i * 0.34) for i in range(9)]
    )
    return loops


def coil_stage(label, x, y=-0.65):
    coil = coil_loops()
    coil.move_to([x, y, 0])
    txt = T(label, 34, INK, width=3.2).next_to(coil, m.DOWN, buff=0.22)
    cap = m.VGroup(
        m.Line([-0.22, 0, 0], [0.22, 0, 0], color=DIM, stroke_width=4),
        m.Line([-0.22, 0.18, 0], [0.22, 0.18, 0], color=DIM, stroke_width=4),
    ).next_to(coil, m.UP, buff=0.12)
    return m.VGroup(coil, cap, txt)


class CoilGunInterface(YTScene):
    SHOT = "S16-31"

    def shot_S16_31(self):
        head = T("INTERFACE SWAP · COIL GUN", 40, GOLD, width=12.0).to_edge(m.UP, buff=0.45)
        elite = T("Elite", 36, GOLD).shift(m.UP * 2.75)
        z_axis = m.Arrow([5.55, -1.85, 0], [5.55, 2.05, 0], color=GOLD, stroke_width=6, buff=0)
        zlab = T("WEALTH ↑", 34, GOLD).next_to(z_axis.get_end(), m.UP, buff=0.12)
        rail = m.Line([-5.8, 1.95, 0], [5.2, 1.95, 0], color=INK, stroke_width=5)
        xs = [-4.2, -1.2, 1.8, 4.8]
        stages = m.VGroup(*[coil_stage(lab, x) for lab, x in zip(COILS, xs)])
        barrel = m.RoundedRectangle(
            width=11.5,
            height=0.35,
            corner_radius=0.08,
            stroke_color=DIM,
            stroke_width=3,
            fill_color=NAVY2,
            fill_opacity=0.5,
        ).move_to([0.2, 1.95, 0])
        projectile = m.Dot([-5.4, 1.95, 0], radius=0.16, color=HER)
        examples = m.VGroup(
            T("ASSASSINATIONS", 34, HER),
            T("COINTELPRO", 34, HER),
            T("POLICE MILITARIZATION", 34, HER),
            T("MASS CARCERAL STATE", 34, HER),
        ).arrange(m.DOWN, buff=0.12, aligned_edge=m.LEFT)
        examples.move_to([0.0, -2.75, 0])
        self.add(head, elite, z_axis, zlab, barrel, rail, stages, projectile)
        footer = None

        def foot(text, color=OK):
            nonlocal footer
            mob = T(text, 34, color, width=11.0).to_edge(m.DOWN, buff=0.35)
            if footer:
                self.play(m.FadeOut(footer), run_time=0.2)
            footer = mob
            self.play(m.FadeIn(footer), run_time=0.35)

        self.until(self.at(0, "assassinations"))
        self.play(m.LaggedStart(*[m.FadeIn(e) for e in examples], lag_ratio=0.18), run_time=0.9)
        self.until(self.beat_end(0) - 0.25)

        self.until(self.at(1, "Interface"))
        self.play(m.FadeOut(examples), run_time=0.35)
        foot("MULTI-STAGE LINEAR ACCELERATOR")
        swap = T("INTERFACE SWAP", 36, STAT).shift(m.UP * 1.55)
        self.play(m.FadeIn(swap), run_time=0.4)
        self.until(self.beat_end(1) - 0.25)

        self.until(self.at(2, "coils"))
        self.play(m.Indicate(stages, color=GOLD), run_time=0.7)
        self.until(self.at(3, "projectile"))
        self.play(projectile.animate.move_to([4.2, 1.95, 0]), run_time=1.1)
        self.until(self.beat_end(3) - 0.25)

        self.until(self.at(4, "saturates"))
        self.play(m.FadeOut(swap), run_time=0.2)
        field = T("jψ_s SATURATES BUFFER", 34, STAT).shift(m.DOWN * 2.35)
        b_lines = m.VGroup(
            *[m.Arrow([x, -0.15, 0], [x, 1.35, 0], color=STAT, stroke_width=4, buff=0) for x in xs[:3]]
        )
        self.play(m.FadeIn(field), m.LaggedStart(*[m.GrowArrow(a) for a in b_lines], lag_ratio=0.15), run_time=0.65)
        self.until(self.beat_end(4) - 0.25)

        self.until(self.at(5, "Civil"))
        self.play(m.FadeOut(field, b_lines), run_time=0.25)
        jim = stages[1]
        new_coil = coil_loops(active=True)
        new_coil.move_to(jim[0].get_center())
        self.play(m.Transform(jim[0], new_coil), run_time=0.45)
        cut = T("JIM CROW COIL POWER CUT", 34, HER).next_to(jim, m.UP, buff=0.2)
        self.play(m.FadeIn(cut), run_time=0.4)
        self.until(self.at(5, "shut"))
        self.play(jim.animate.set_opacity(0.22), cut.animate.set_color(DIM), run_time=0.55)
        self.until(self.beat_end(5) - 0.25)

        self.until(self.at(6, "collapsed"))
        self.play(m.FadeOut(cut), run_time=0.2)
        if footer:
            self.play(m.FadeOut(footer), run_time=0.2)
            footer = None
        seg = T("SEGREGATION FIELD COLLAPSE", 34, HER).to_edge(m.DOWN, buff=0.38)
        collapse_rings = m.VGroup(
            *[
                m.Arc(radius=0.25 + k * 0.22, angle=m.PI, stroke_color=HER, stroke_width=4).move_to(
                    jim[0].get_center() + m.UP * 0.55
                )
                for k in range(3)
            ]
        )
        self.play(
            m.FadeIn(seg),
            m.LaggedStart(*[m.Create(ring) for ring in collapse_rings], lag_ratio=0.12),
            jim.animate.set_opacity(0.08),
            run_time=0.75,
        )
        self.until(self.beat_end(6) - 0.25)

        self.until(self.at(7, "fascist"))
        self.play(m.FadeOut(seg, collapse_rings), run_time=0.3)
        foot("WHITE FLIGHT · KKK · VIGILANTE PANIC", HER)
        backlash = m.VGroup(*[m.Dot([x, 1.35, 0], radius=0.1, color=HER) for x in [-2.5, -0.5, 1.5, 3.5]])
        self.play(m.LaggedStart(*[m.FadeIn(d, scale=1.8) for d in backlash], lag_ratio=0.1), run_time=0.55)
        self.until(self.beat_end(7) - 0.25)

        self.until(self.at(8, "flyback"))
        self.play(m.FadeOut(backlash), run_time=0.25)
        foot("FLYBACK → WASTE HEAT", DIM)
        diode = m.Polygon(
            [-0.25, 0.2, 0],
            [0.25, 0.2, 0],
            [0, -0.25, 0],
            color=DIM,
            fill_opacity=0.4,
            stroke_width=3,
        ).next_to(jim, m.DOWN, buff=0.85)
        self.play(m.FadeIn(diode), run_time=0.4)
        self.until(self.beat_end(8) - 0.25)

        self.until(self.at(9, "engineers"))
        self.play(m.FadeOut(diode), run_time=0.2)
        foot("ENERGY → NEXT COIL CAPACITORS", GOLD)
        pulse = m.Arrow(jim.get_center(), stages[2].get_center(), color=GOLD, stroke_width=7, buff=0.15)
        self.play(m.GrowArrow(pulse), stages[2][1].animate.set_stroke(color=GOLD, width=6), run_time=0.65)
        self.until(self.beat_end(9) - 0.25)

        self.until(self.at(10, "routed"))
        self.play(m.FadeOut(pulse), run_time=0.2)
        foot("SOUTHERN STRATEGY · POLICE MILITARIZATION")
        self.play(m.Indicate(stages[2], color=GOLD), run_time=0.55)
        self.until(self.beat_end(10) - 0.25)

        self.until(self.at(11, "Nixon"))
        foot("SOUTHERN STRATEGY · MILITARIZATION CAPITAL", GOLD)
        self.play(projectile.animate.move_to([5.0, 1.95, 0]), run_time=0.7)
        self.until(self.beat_end(11) - 0.25)

        self.until(self.at(12, "suppression"))
        foot("SUPPRESSION CAPITAL TRANSFER", GOLD)
        transfer = m.DashedLine(stages[2].get_center(), stages[3].get_center(), color=GOLD, dash_length=0.12, stroke_width=5)
        gig_hot = coil_loops(active=True)
        gig_hot.move_to(stages[3][0].get_center())
        self.play(m.Create(transfer), m.Transform(stages[3][0], gig_hot), run_time=0.55)
        self.play(m.Indicate(stages[3], color=HER), run_time=0.45)
        self.until(self.beat_end(12) - 0.25)

        self.until(self.at(13, "transfer"))
        foot("OBSOLETE HARDWARE CHARGES NEXT ITERATION", INK)
        self.play(
            stages[1].animate.set_opacity(0.05),
            stages[3][0].animate.set_color(HER),
            run_time=0.55,
        )
        self.until(self.beat_end(13) - 0.3)
