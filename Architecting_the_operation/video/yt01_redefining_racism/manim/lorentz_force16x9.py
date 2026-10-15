"""S16-10 Lorentz deflection and psychological wage analogy."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, OK, T, YTScene  # noqa: E402

STAT = "#B28DFF"


class LorentzForce(YTScene):
    SHOT = "S16-10"

    def shot_S16_10(self):
        head = T("LORENTZ FORCE", 34, GOLD).to_edge(m.UP, buff=0.55)
        charge = m.Dot([-2.5, -0.5, 0], radius=0.18, color=GOLD)
        path = m.TracedPath(charge.get_center, stroke_color=HER, stroke_width=4, dissipating_time=None)
        self.add(path)
        b_dots = m.VGroup(*[m.Dot([x, 0.8, 0], radius=0.08, color=STAT)
                            for x in np.arange(-5.0, 5.1, 1.0)])
        b_lab = T("CULTURAL FIELD B", 26, STAT).to_edge(m.UP, buff=1.35)
        self.add(head, b_dots, b_lab, charge)
        self.until(self.at(0, "Lorentz"))

        def updater(mob, dt):
            p = mob.get_center()
            v = np.array([1.0, 0.0, 0.0])
            f = np.array([0.0, -0.55, 0.0])
            mob.move_to(p + (v + f) * dt * 1.8)

        charge.add_updater(updater)
        self.add(charge)
        self.wait(2.0)
        charge.remove_updater(updater)
        perp = T("FORCE ⊥ VELOCITY", 28, STAT).to_edge(m.DOWN, buff=0.55)
        self.play(m.FadeIn(perp), run_time=0.4)
        self.until(self.beat_end(0) - 0.3)

        self.until(self.at(1, "kinetic"))
        self.play(m.FadeOut(perp), run_time=0.25)
        ke = T("KINETIC ENERGY UNCHANGED", 28, OK).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(ke), run_time=0.4)
        self.until(self.beat_end(1) - 0.3)

        self.until(self.at(2, "Buffer"))
        self.play(m.FadeOut(ke), run_time=0.25)
        buf = T("BUFFER CLASS DEFLECTED FROM SOLIDARITY", 28, HER, width=11.0).to_edge(m.DOWN, buff=0.4)
        sup = T("SUPERIORITY WITHOUT WEALTH", 26, STAT).next_to(buf, m.UP, buff=0.12)
        self.play(m.FadeIn(buf, sup), run_time=0.6)
        self.until(self.beat_end(2) - 0.3)
