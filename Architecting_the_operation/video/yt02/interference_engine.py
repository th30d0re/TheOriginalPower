"""YT02 SEG 12: destructive interference and the spectral evidence rail."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, OK, T, YTScene  # noqa: E402
from layout_v2 import clamp_above_caption  # noqa: E402

CYAN = "#5FA8D3"
STAT = "#B28DFF"


class InterferenceEngine(YTScene):
    SHOT = "S12-01"

    def shot_S12_01(self):
        title = T("THE INTERFERENCE ENGINE", 42, GOLD).to_edge(m.UP, buff=0.3)
        subtitle = T("ANTIPHASE COHERENCE CURRENTS", 27, DIM).next_to(title, m.DOWN, buff=0.1)
        phase = m.ValueTracker(0.2 * np.pi)

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
        property_labels = m.VGroup(
            T("CREDITORS / PROPRIETORS", 20, OK).move_to([-2.25, yj + 0.5, 0]),
            T("DEBTORS / PROPERTYLESS LABOR", 20, HER).move_to([-2.25, yk + 0.5, 0]),
        )
        property_labels.set_opacity(0)
        wave_j = m.always_redraw(
            lambda: m.FunctionGraph(
                lambda x: yj + 0.38 * np.sin(2.2 * x), x_range=[x0, x1], color=OK, stroke_width=6
            )
        )
        wave_k = m.always_redraw(
            lambda: m.FunctionGraph(
                lambda x: yk + 0.38 * np.sin(2.2 * x + phase.get_value()),
                x_range=[x0, x1], color=HER, stroke_width=6,
            )
        )
        wave_sum = m.always_redraw(
            lambda: m.FunctionGraph(
                lambda x: ys + 0.28 * (
                    np.sin(2.2 * x) + np.sin(2.2 * x + phase.get_value())
                ),
                x_range=[x0, x1], color=GOLD, stroke_width=7,
            )
        )
        phase_tag = m.always_redraw(
            lambda: m.VGroup(
                M(rf"\Delta\phi={phase.get_value() / np.pi:.2f}\pi", 34, HER),
                T("COHERENT SUM" if phase.get_value() < 0.8 * np.pi else "SUM ≈ 0", 26, GOLD),
            ).arrange(m.RIGHT, buff=0.3).move_to([-2.45, -1.75, 0])
        )

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
        chapter_badges = m.VGroup(*[
            T(label, 22, color) for label, color in (
                ("CH 0 · HARDWARE", GOLD), ("CH 14 · TWEEDISM", CYAN), ("CH 22 · SPECTRAL CARRIER", HER),
            )
        ]).arrange(m.DOWN, buff=0.1, aligned_edge=m.LEFT).move_to([5.55, 0.55, 0])
        chapter_badges.set_opacity(0)
        madison = T("NOVEMBER 1787 · MADISON · FEDERALIST No. 10", 22, INK, width=4.5)
        madison.move_to([5.55, -0.35, 0])
        madison.set_opacity(0)
        madison_axes = m.VGroup(
            *[T(name, 22, color, "NORMAL") for name, color in (
                ("RELIGION", STAT), ("REGION", CYAN), ("COMMERCE", GOLD), ("IDENTITY", HER),
            )]
        ).arrange(m.DOWN, buff=0.11, aligned_edge=m.LEFT).move_to([5.55, -1.35, 0])
        madison_axes.set_opacity(0)
        recursive_axes = m.VGroup(
            *[T(name, 22, color, "NORMAL") for name, color in (
                ("RACE", CYAN), ("GENDER", HER), ("RELIGION", STAT), ("NATIVITY", GOLD),
            )]
        ).arrange(m.DOWN, buff=0.11, aligned_edge=m.LEFT).move_to([5.55, -1.35, 0])
        recursive_axes.set_opacity(0)
        for mob in (chapter_badges, madison, madison_axes, recursive_axes):
            clamp_above_caption(mob)
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
        gate.set_opacity(0)
        gate_text.set_opacity(0)

        rail = m.RoundedRectangle(
            width=12.2,
            height=0.72,
            corner_radius=0.1,
            stroke_color=DIM,
            stroke_width=3,
            fill_color=NAVY2,
            fill_opacity=0.95,
        ).move_to([0, -2.55, 0])
        rail_text = T("SPECTRAL EVIDENCE · CHAPTER 22", 25, DIM, width=11.6).move_to(rail)
        rail.set_opacity(0)
        rail_text.set_opacity(0)
        beat = T("S12-01", 23, GOLD).move_to([5.9, -2.62, 0])
        status = T("SHARED MATERIAL LOSS", 26, INK, width=7.2).move_to([-2.5, -2.35, 0])

        spectral_panel = m.RoundedRectangle(
            width=4.8, height=4.35, corner_radius=0.12, stroke_color=DIM, stroke_width=3,
            fill_color=NAVY2, fill_opacity=0.96,
        ).move_to([4.15, -0.15, 0])
        spectral_panel.set_opacity(0)
        dataset = T("CONGRESSIONAL RECORD · 1965–2024 · N=60", 20, INK, width=4.35)
        dataset.next_to(spectral_panel, m.UP, buff=-0.34)
        dataset.set_opacity(0)
        threshold = m.DashedLine([2.15, -0.15, 0], [6.1, -0.15, 0], color=HER, stroke_width=3, dash_length=0.1)
        threshold_label = T("1.20", 20, HER).next_to(threshold, m.RIGHT, buff=0.06)
        threshold.set_opacity(0)
        threshold_label.set_opacity(0)
        bars = m.VGroup()
        bar_labels = ("4Y", "6Y", "8Y", "2Y-A", "2Y-W")
        bar_heights = (2.45, 2.2, 1.55, 0.22, 1.55)
        for i, (label, height) in enumerate(zip(bar_labels, bar_heights)):
            bar = m.Rectangle(width=0.52, height=height, fill_color=GOLD, fill_opacity=0.9, stroke_width=0)
            bar.move_to([2.65 + 0.76 * i, -1.55 + height / 2, 0])
            cap = T(label, 18, INK).next_to(bar, m.DOWN, buff=0.08)
            group = m.VGroup(bar, cap)
            group.set_opacity(0)
            bars.add(group)
        evidence_badge = T("CONFIDENCE TIER 2", 23, STAT).move_to([4.15, 1.45, 0])
        evidence_badge.set_opacity(0)
        frequencies = T("4Y · 0.25     6Y · 0.167     8Y · 0.125     2Y · 0.50", 19, GOLD, width=4.35)
        frequencies.move_to([4.15, 1.05, 0])
        frequencies.set_opacity(0)

        self.add(title, subtitle, baselines, labels, property_labels, wave_j, wave_k, wave_sum, phase_tag)
        self.add(elite, elite_text, sources, source_arrows, chapter_badges, madison, madison_axes, recursive_axes)
        self.add(status, beat, gate, gate_text, rail, rail_text)
        self.add(spectral_panel, dataset, threshold, threshold_label, bars, evidence_badge, frequencies)

        cues = [
            "dashboard", "instrument", "Stress", "Stress", "Capital", "Phi-load", "threshold",
            "Patch", "Variables", "Function", "wage", "Material", "fascism", "Result",
            "dashboard", "Log", "Phi-load", "Elite,", "Result", "Log", "Rho-tau",
            "Buffer", "function", "Log", "Phi-load", "wage", "function",
        ]
        states = [
            "SHARED MATERIAL LOSS", "INTERFERENCE ENGINE", "POLITICAL SPECIFICATION · 1787",
            "UNEQUAL PROPERTY DISTRIBUTION", "EXTENDED SPHERE · MULTIPLE AXES", "PHASED-ARRAY JAMMER",
            "EQUATION 0.15 · AXIS CURRENT", "EQUATION 0.16 · ELITE-NODE SUM", "FIGURE 0.6",
            "ANTIPHASE · DESTRUCTIVE SUM", "RECURSIVE PARTITION CHANNELS", "CLASS + IDENTITY POWER",
            "Φ_load = 0.92 · EQUATION 22.2", "0 ≤ Φ_load ≤ 1", "CONFIDENCE TIER 2 TEST",
            "PREDICTION THRESHOLD", "FALSIFICATION CRITERIA", "CONGRESSIONAL RECORD · 1965–2024 · N=60",
            "4-YEAR RATIO · 24.06", "6-YEAR 21.02 · 8-YEAR 12.86", "PARSEVAL · 0.9996",
            "NEGATIVE CONTROL · t=0.479 · p=0.634", "RAW-MEAN TEST · UNCONFIRMED",
            "ANNUAL MIDTERM · NYQUIST · 0.58", "WEEKLY GOOGLE TRENDS · 2004–2024",
            "2-YEAR MIDTERM RATIO · 12.82", "TIER 2 · PREDICTED CARRIERS PRESENT",
        ]

        current_eq = None
        rail_visible = False
        for k, (cue, label) in enumerate(zip(cues, states)):
            self.until(self.at(k, cue))
            animations = []
            if k == 1:
                animations.append(chapter_badges.animate.set_opacity(1))
            if k == 2:
                animations.extend([
                    chapter_badges.animate.set_opacity(0),
                    madison.animate.set_opacity(1),
                ])
            if k == 3:
                animations.extend([
                    m.Indicate(sources[0], color=CYAN), m.Indicate(sources[1], color=HER),
                    property_labels.animate.set_opacity(1),
                ])
            if k == 4:
                animations.extend([
                    madison.animate.set_opacity(0),
                    madison_axes.animate.set_opacity(1),
                ])
            if k == 5:
                animations.append(phase.animate.set_value(0.55 * np.pi))
            if k == 6:
                animations.extend([phase.animate.set_value(0.75 * np.pi), m.FadeIn(eq15)])
                current_eq = eq15
            if k == 7 and current_eq is not None:
                animations.append(m.Transform(current_eq, eq16))
            if k == 8:
                animations.append(phase.animate.set_value(np.pi))
            if k == 9:
                animations.append(m.Indicate(wave_sum, color=GOLD))
            if k == 10:
                animations.extend([madison_axes.animate.set_opacity(0), recursive_axes.animate.set_opacity(1)])
            if k == 11 and current_eq is not None:
                split_eq = M(r"P_{\mathrm{public}}(f)=P_{\mathrm{identity}}(f)+P_{\mathrm{class}}(f)", 32, GOLD)
                split_eq.move_to(current_eq)
                animations.append(m.Transform(current_eq, split_eq))
            if k == 12 and current_eq is not None:
                animations.append(m.Transform(current_eq, phi_eq))
            if k == 13:
                bounds = T("0.00 · CLASS LOCK                 1.00 · CANCELLATION", 21, STAT, width=6.8)
                bounds.move_to(status.get_center() + m.DOWN * 0.45)
                animations.append(m.FadeIn(bounds))
            if k == 14:
                animations.extend([
                    evidence_badge.animate.set_opacity(1), spectral_panel.animate.set_opacity(1),
                    rail.animate.set_opacity(1), rail_text.animate.set_opacity(1),
                ])
                rail_visible = True
            if k == 15:
                animations.extend([
                    gate.animate.set_opacity(1), gate_text.animate.set_opacity(1),
                    frequencies.animate.set_opacity(1),
                ])
            if k == 16:
                animations.extend([
                    m.Indicate(gate, color=HER), threshold.animate.set_opacity(1),
                    threshold_label.animate.set_opacity(1),
                ])
            if k == 17:
                animations.extend([
                    dataset.animate.set_opacity(1),
                    elite.animate.set_opacity(0), elite_text.animate.set_opacity(0),
                    sources.animate.set_opacity(0), source_arrows.animate.set_opacity(0),
                    recursive_axes.animate.set_opacity(0), madison.animate.set_opacity(0),
                ])
            if k == 18:
                animations.append(bars[0].animate.set_opacity(1))
            if k == 19:
                animations.extend([bars[1].animate.set_opacity(1), bars[2].animate.set_opacity(1)])
            if k == 20:
                animations.append(m.Indicate(spectral_panel, color=OK))
            if k == 21:
                animations.append(m.Indicate(bars[0], color=DIM))
            if k == 22:
                animations.append(bars[:3].animate.set_opacity(0.55))
            if k == 23:
                animations.append(bars[3].animate.set_opacity(1))
            if k == 24:
                dataset2 = T("GOOGLE TRENDS WEEKLY · 2004–2024 · 52 OBS/YR", 20, INK, width=4.35)
                dataset2.move_to(dataset)
                animations.append(m.Transform(dataset, dataset2))
            if k == 25:
                animations.append(bars[4].animate.set_opacity(1))
            if k == 26:
                animations.extend([bars.animate.set_opacity(1), m.Indicate(evidence_badge, color=STAT)])
            next_status = T(label, 26, INK, width=7.2).move_to(status)
            next_beat = T(f"S12-{k + 1:02d}", 23, GOLD).move_to(beat)
            animations.extend([m.Transform(status, next_status), m.Transform(beat, next_beat)])
            if rail_visible and k >= 18:
                next_rail = T(label, 25, GOLD if k != 22 else DIM, width=11.6).move_to(rail_text)
                animations.append(m.Transform(rail_text, next_rail))
            self.play(*animations, run_time=0.45)
        self.play(m.Indicate(wave_sum, color=GOLD), run_time=0.5)
        self.until(self.beat_end(26) - 0.2)
