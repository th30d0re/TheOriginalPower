"""SEG 17 phase loading (Equation 2.19) — ported from UEF interference reel."""

import sys
from pathlib import Path

import manimgx as m
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, OK, T, YTScene  # noqa: E402

PLANE_CENTER = np.array([3.85, -0.15, 0.0])
PLANE_R = 2.35


def phasor_group(n, spread, radius=PLANE_R * 0.88, color=OK):
    """spread=0 aligned; spread=1 uniform on circle."""
    g = m.VGroup()
    for j in range(n):
        ang = 0.0 if spread < 0.5 else 2 * np.pi * j / n
        tip = m.Arrow(
            m.ORIGIN,
            [radius * np.cos(ang), radius * np.sin(ang), 0],
            buff=0,
            color=color if spread < 0.5 else HER,
            stroke_width=6,
            max_tip_length_to_length_ratio=0.16,
        )
        g.add(tip)
    return g


def mean_phasor(n, spread, radius=PLANE_R * 0.55):
    if spread < 0.5:
        mag = radius
        ang = 0.0
        col = OK
    else:
        mag = radius * 0.08
        ang = 0.0
        col = HER
    return m.Arrow(
        m.ORIGIN,
        [mag * np.cos(ang), mag * np.sin(ang), 0],
        buff=0,
        color=col,
        stroke_width=8,
        max_tip_length_to_length_ratio=0.14,
    )


def equation_column(scene, k=0):
    data = scene.card(k)
    head = T(data["headline"], 36, GOLD, width=6.2).to_corner(m.UL, buff=0.55)
    eq = M(data["latex"], 46, INK)
    if eq.width > 6.4:
        eq.scale_to_fit_width(6.4)
    eq.next_to(head, m.DOWN, buff=0.35, aligned_edge=m.LEFT)
    return head, eq


class PhaseLoading(YTScene):
    SOURCE = "Source: The Original Power, Equation 2.19"

    def shot_S17_52(self):
        head, eq = equation_column(self, 0)
        plane = m.Circle(radius=PLANE_R, stroke_color=DIM, stroke_width=4).move_to(PLANE_CENTER)
        plab = T("UNIT PHASORS", 34, DIM).next_to(plane, m.UP, buff=0.22)
        self.add(head, eq, plane, plab)
        self.until(self.at(0, "Equation"))

        phi_j = M(r"\Phi_j=\sum_{k=1}^{K}\varphi_{k,j}", 40, INK).next_to(eq, m.DOWN, buff=0.45, aligned_edge=m.LEFT)
        self.play(m.FadeIn(phi_j), run_time=0.45)
        self.until(self.at(1, "subgroup"))

        phi_load = M(
            r"\Phi_{\text{load}}(t)=1-\left|\frac{1}{N}\sum_{j=1}^{N}e^{i\Phi_j}\right|",
            38,
            GOLD,
        ).next_to(phi_j, m.DOWN, buff=0.35, aligned_edge=m.LEFT)
        if phi_load.width > 6.4:
            phi_load.scale_to_fit_width(6.4)
        self.play(m.FadeIn(phi_load), run_time=0.45)
        self.until(self.at(2, "compound"))

        mean_eq = M(r"\frac{1}{N}\sum_{j=1}^{N}e^{i\Phi_j}", 42, INK).next_to(phi_load, m.DOWN, buff=0.35, aligned_edge=m.LEFT)
        self.play(m.FadeIn(mean_eq), run_time=0.45)
        self.until(self.at(3, "mean"))
        self.until(self.at(4, "complex"))

        ph = phasor_group(8, spread=0.0)
        ph.move_to(PLANE_CENTER)
        self.play(m.FadeIn(ph), run_time=0.55)
        self.until(self.at(5, "align"))

        mvec = mean_phasor(8, 0.0).move_to(PLANE_CENTER)
        status = T("MAX SOLIDARITY", 34, OK, width=4.2).move_to(PLANE_CENTER + m.DOWN * 2.75)
        self.play(m.GrowArrow(mvec), m.FadeIn(status), run_time=0.65)

        self.until(self.at(6, "uniform"))
        spread = phasor_group(10, spread=1.0).move_to(PLANE_CENTER)
        msmall = mean_phasor(10, 1.0).move_to(PLANE_CENTER)
        cancel = T("MAX CANCELLATION", 34, HER, width=4.2).move_to(status)
        self.play(m.Transform(ph, spread), m.Transform(mvec, msmall), m.Transform(status, cancel), run_time=1.0)

        self.until(self.at(7, "fragmentation"))
        self.play(m.FadeOut(status), run_time=0.25)
        era = T("1968–1990 · AXIS INJECTION", 36, GOLD, width=11).to_edge(m.DOWN, buff=0.45)
        axes_inj = m.VGroup(
            T("GENDER", 34, HIM),
            T("SEXUALITY", 34, HIM),
            T("RELIGION", 34, HIM),
        ).arrange(m.RIGHT, buff=0.55).next_to(era, m.UP, buff=0.22)
        self.play(m.FadeIn(era), m.FadeIn(axes_inj), run_time=0.55)
        self.until(self.beat_end(7) - 0.2)

    def shot_S17_65(self):
        data = self.card(0)
        head = T(data["headline"], 36, GOLD).to_edge(m.UP, buff=0.55)
        eq = M(data["latex"], 52, INK)
        if eq.width > 12:
            eq.scale_to_fit_width(12)
        eq.next_to(head, m.DOWN, buff=0.4)
        tier = T("CONFIDENCE TIER 3", 34, DIM).next_to(eq, m.DOWN, buff=0.35)
        self.add(head, eq, tier)
        self.until(self.at(0, "Tier"))

        plane = m.Circle(radius=2.0, stroke_color=DIM, stroke_width=4).move_to([2.8, -1.35, 0])
        plab = T("RACE AXIS", 34, DIM).next_to(plane, m.UP, buff=0.2)
        ax = m.Arrow(plane.get_center(), plane.get_center() + m.LEFT * 1.85, buff=0, color=HER, stroke_width=7)
        pi_l = M(r"\pi", 56, HER).next_to(ax, m.DOWN, buff=0.22)
        buf = T("I_buffer", 36, HIM).next_to(plane, m.RIGHT, buff=0.45)
        self.until(self.at(1, "working"))
        self.play(m.FadeIn(plane), m.FadeIn(plab), m.GrowArrow(ax), m.FadeIn(pi_l), m.FadeIn(buf), run_time=0.8)

        self.until(self.at(2, "anti"))
        note = T("ANTI-PHASE · SUPPRESSES SOLIDARITY", 34, HER).to_edge(m.DOWN, buff=0.5)
        self.play(m.FadeIn(note), run_time=0.4)
        self.until(self.beat_end(2) - 0.2)
