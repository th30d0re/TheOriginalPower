"""YT02 SEG 12: destructive interference and the spectral evidence rail."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
sys.path.insert(0, str(COMMON))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

CYAN = "#5FA8D3"
STAT = "#B28DFF"


class InterferenceEngine(YTScene):
    SHOT = "S12-01"

    def shot_S12_01(self):
        title = T("THE INTERFERENCE ENGINE", 42, GOLD).to_edge(m.UP, buff=0.3)
        subtitle = T("ANTIPHASE COHERENCE CURRENTS", 27, DIM).next_to(title, m.DOWN, buff=0.1)

        x0, x1 = -6.15, 1.1
        yj, yk, ys = 1.7, 0.25, -1.2
        baselines = m.VGroup(
            m.Line([x0, yj, 0], [x1, yj, 0], color="#334766", stroke_width=2),
            m.Line([x0, yk, 0], [x1, yk, 0], color="#334766", stroke_width=2),
            m.Line([x0, ys, 0], [x1, ys, 0], color="#334766", stroke_width=2),
        )
        labels = m.VGroup(
            M(r"i_j(t)", 34, OK).move_to([x0 + 0.55, yj + 0.48, 0]),
            M(r"i_k(t)", 34, HER).move_to([x0 + 0.55, yk + 0.48, 0]),
            M(r"I_E(t)", 34, GOLD).move_to([x0 + 0.65, ys + 0.42, 0]),
        )
        wave_j = m.FunctionGraph(
            lambda x: yj + 0.38 * np.sin(2.2 * x), x_range=[x0, x1], color=OK, stroke_width=6
        )
        wave_k = m.FunctionGraph(
            lambda x: yk - 0.38 * np.sin(2.2 * x), x_range=[x0, x1], color=HER, stroke_width=6
        )
        wave_sum = m.FunctionGraph(
            lambda x: ys + 0.025 * np.sin(2.2 * x), x_range=[x0, x1], color=GOLD, stroke_width=7
        )
        phase_tag = m.VGroup(M(r"\Delta\phi=\pi", 38, HER), T("SUM ≈ 0", 28, GOLD)).arrange(
            m.RIGHT, buff=0.35
        ).move_to([-2.45, -2.05, 0])

        eq15 = M(r"i_k(t)=\rho_k A_k\cos(\omega t+\phi_k)", 38, INK).move_to([-2.5, 2.75, 0])
        eq16 = M(r"I_E(t)=\sum_{k=1}^{N} i_k(t)", 40, GOLD).move_to([-2.5, 2.75, 0])
        phi_eq = M(
            r"\Phi_{\mathrm{load}}(t)=1-\left|\frac{1}{N}\sum_{j=1}^{N}e^{i\Phi_j}\right|",
            38,
            STAT,
        ).move_to([-2.5, 2.75, 0])

        elite = m.RoundedRectangle(
            width=3.9,
            height=0.95,
            corner_radius=0.12,
            fill_color=NAVY2,
            fill_opacity=1,
            stroke_color=GOLD,
            stroke_width=4,
        ).move_to([4.25, 1.9, 0])
        elite_text = T("ELITE NODE  E", 30, GOLD).move_to(elite)
        sources = m.VGroup(
            T("BUFFER CLASS", 25, CYAN),
            T("OUT-GROUP", 25, HER),
        ).arrange(m.RIGHT, buff=0.5).move_to([4.25, 0.65, 0])
        source_arrows = m.VGroup(
            m.Arrow(sources[0].get_top(), elite.get_bottom() + m.LEFT * 0.65, color=CYAN, stroke_width=4),
            m.Arrow(sources[1].get_top(), elite.get_bottom() + m.RIGHT * 0.65, color=HER, stroke_width=4),
        )
        madison = T("MADISON · FEDERALIST No. 10 · 1787", 25, INK, width=4.5).move_to([4.25, -0.2, 0])
        axis_chips = m.VGroup(
            *[T(name, 22, color, "NORMAL") for name, color in (
                ("RELIGION", STAT), ("REGION", CYAN), ("COMMERCE", GOLD), ("IDENTITY", HER),
            )]
        ).arrange(m.DOWN, buff=0.11).move_to([4.25, -1.25, 0])
        gate = m.RoundedRectangle(
            width=4.7,
            height=1.05,
            corner_radius=0.12,
            stroke_color=HER,
            stroke_width=4,
            fill_color=NAVY2,
            fill_opacity=0.95,
        ).move_to([4.25, -2.35, 0])
        gate_text = T("FALSIFICATION GATE\n4-YEAR RATIO > 1.2", 25, HER, width=4.3).move_to(gate)

        rail = m.RoundedRectangle(
            width=12.2,
            height=0.72,
            corner_radius=0.1,
            stroke_color=DIM,
            stroke_width=3,
            fill_color=NAVY2,
            fill_opacity=0.95,
        ).to_edge(m.DOWN, buff=0.28)
        rail_text = T("SPECTRAL EVIDENCE · CHAPTER 22", 25, DIM, width=11.6).move_to(rail)
        beat = T("S12-01", 23, GOLD).to_edge(m.DOWN, buff=0.08).to_edge(m.RIGHT, buff=0.25)
        status = T("SHARED MATERIAL LOSS", 26, INK, width=7.2).move_to([-2.5, -2.55, 0])

        self.add(title, subtitle, elite, elite_text, sources, source_arrows, status, beat)

        cues = [
            "central", "answer", "political", "Madison", "prevent", "signal", "Equation", "Kirchhoff", "Figure",
            "grievance", "recursive", "frequency", "dispersion", "bounded", "Confidence", "falsification",
            "falsified", "Dataset", "ratios", "six-year", "Parseval", "negative", "unconfirmed", "annual",
            "resolve", "fifty-two", "results",
        ]
        states = [
            "SHARED MATERIAL LOSS", "INTERFERENCE ENGINE", "POLITICAL SPECIFICATION · 1787",
            "UNEQUAL PROPERTY DISTRIBUTION", "EXTENDED SPHERE · MULTIPLE AXES", "PHASED-ARRAY JAMMER",
            "EQUATION 0.15 · AXIS CURRENT", "EQUATION 0.16 · ELITE-NODE SUM", "FIGURE 0.6",
            "ANTIPHASE · DESTRUCTIVE SUM", "RECURSIVE PARTITION CHANNELS", "CLASS + IDENTITY POWER",
            "EQUATION 22.2 · PHASE DISPERSION", "0 ≤ Φ_load ≤ 1", "CONFIDENCE TIER 2 TEST",
            "PREDICTION THRESHOLD", "FALSIFICATION CRITERIA", "CONGRESSIONAL RECORD · 1965–2024 · N=60",
            "4-YEAR RATIO · 24.06", "6-YEAR 21.02 · 8-YEAR 12.86", "PARSEVAL · 0.9996",
            "NEGATIVE CONTROL · t=0.479 · p=0.634", "RAW-MEAN TEST · UNCONFIRMED",
            "ANNUAL MIDTERM · NYQUIST · 0.58", "WEEKLY GOOGLE TRENDS · 2004–2024",
            "2-YEAR MIDTERM RATIO · 12.82", "TIER 2 · PREDICTED CARRIERS PRESENT",
        ]

        current_eq = None
        traces_visible = False
        rail_visible = False
        for k, (cue, label) in enumerate(zip(cues, states)):
            self.until(self.at(k, cue))
            animations = []
            if k == 2:
                animations.append(m.FadeIn(madison))
            if k == 4:
                animations.append(m.FadeIn(axis_chips))
            if k == 6:
                animations.append(m.FadeIn(eq15))
                current_eq = eq15
            if k == 7 and current_eq is not None:
                animations.append(m.Transform(current_eq, eq16))
            if k == 8:
                animations.extend([m.FadeIn(baselines), m.FadeIn(labels), m.FadeIn(wave_j)])
            if k == 9:
                animations.extend([m.FadeIn(wave_k), m.FadeIn(wave_sum), m.FadeIn(phase_tag)])
                traces_visible = True
            if k == 10:
                animations.append(m.Indicate(axis_chips, color=STAT))
            if k == 12 and current_eq is not None:
                animations.append(m.Transform(current_eq, phi_eq))
            if k == 15:
                animations.extend([m.FadeIn(gate), m.FadeIn(gate_text)])
            if k == 16:
                animations.append(m.Indicate(gate, color=HER))
            if k == 17:
                animations.extend([m.FadeIn(rail), m.FadeIn(rail_text)])
                rail_visible = True
            next_status = T(label, 26, INK, width=7.2).move_to(status)
            next_beat = T(f"S12-{k + 1:02d}", 23, GOLD).move_to(beat)
            animations.extend([m.Transform(status, next_status), m.Transform(beat, next_beat)])
            if rail_visible and k >= 18:
                next_rail = T(label, 25, GOLD if k != 22 else DIM, width=11.6).move_to(rail_text)
                animations.append(m.Transform(rail_text, next_rail))
            self.play(*animations, run_time=0.45)

        if traces_visible:
            self.play(m.Indicate(wave_sum, color=GOLD), run_time=0.5)
        self.until(self.beat_end(26) - 0.2)
