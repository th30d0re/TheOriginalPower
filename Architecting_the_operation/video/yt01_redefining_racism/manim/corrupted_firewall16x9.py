"""SEG 19 corrupted firewall: Buffer Class as Elite patch."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, NAVY2, OK, T, YTScene  # noqa: E402


def os_layer(y, label, color=INK, w=10.8, h=1.05):
    r = m.RoundedRectangle(
        width=w,
        height=h,
        corner_radius=0.12,
        stroke_color=color,
        stroke_width=4,
        fill_color=NAVY2,
        fill_opacity=0.9,
    )
    r.move_to([0, y, 0])
    t = T(label, 36, color, width=w - 0.6).move_to(r)
    return m.VGroup(r, t)


class CorruptedFirewall(YTScene):
    SOURCE = "Source: The Original Power, §2.3.9 Corrupted Firewall"

    def shot_S19_01(self):
        title = T("OPERATING SYSTEM FIREWALL", 44, GOLD).to_edge(m.UP, buff=0.55)
        fw = os_layer(2.05, "SECURITY LAYER", OK)
        app = os_layer(0.15, "USER APPLICATIONS", DIM, 10.2)
        kern = os_layer(-1.85, "KERNEL", HER, 9.2)
        self.add(title, fw, app, kern)
        self.until(self.at(0, "firewall"))
        self.until(self.at(0, "threats"))

        self.until(self.at(1, "Buffer"))
        patch = m.RoundedRectangle(
            width=6.2,
            height=0.85,
            corner_radius=0.1,
            stroke_color=GOLD,
            stroke_width=5,
            fill_color=HIM,
            fill_opacity=0.35,
        ).move_to([0, -0.85, 0])
        pl = T("BUFFER CLASS PATCH", 34, GOLD).move_to(patch)
        self.play(m.FadeIn(patch), m.FadeIn(pl), run_time=0.6)
        self.until(self.at(1, "installed"))

        self.until(self.at(2, "Bacon"))
        crash = T("1676 · BACON'S REBELLION", 34, HER).move_to([-5.0, -3.05, 0])
        self.play(m.FadeIn(crash), fw[0].animate.set_stroke(HER, 6), run_time=0.7)
        self.until(self.at(3, "burned"))
        fix = T("ARCHITECTURAL INTERVENTION", 34, GOLD).move_to([4.8, -3.05, 0])
        self.play(m.FadeIn(fix), run_time=0.4)

        self.until(self.at(4, "programming"))
        mask = T("ANTIVIRUS IDENTITY", 34, OK).to_corner(m.DR, buff=0.5)
        reveal = T("SECOND-MOST-EXPLOITED RESOURCE", 30, HER).move_to([-4.9, -3.35, 0])
        self.play(m.FadeIn(mask), run_time=0.4)
        self.play(m.FadeIn(reveal), mask.animate.set_opacity(0.35), run_time=0.6)
        wage = T("SUPPRESSION ALLOCATION · WHITENESS", 34, DIM).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(wage), run_time=0.4)
        self.until(self.beat_end(4) - 0.2)
