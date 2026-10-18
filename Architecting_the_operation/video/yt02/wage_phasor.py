"""YT02 SEG 09: complex wage phasor and its historical regimes."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
sys.path.insert(0, str(COMMON))
from common16x9 import BG, DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402

MAT = OK
STAT = GOLD


class WagePhasor(YTScene):
    """Material stays vertical; status stays horizontal; theta starts at material."""

    SHOT = "S09-01"

    def shot_S09_01(self):
        origin = np.array([-2.25, -0.8, 0.0])
        length = 3.25
        theta = m.ValueTracker(25.0)

        title = T("THE WAGE PHASOR", 42, GOLD).to_edge(m.UP, buff=0.35)
        equation = M(r"W = \psi_m + j\psi_s", 58, INK).next_to(title, m.DOWN, buff=0.16)
        y_axis = m.Arrow(origin + m.DOWN * 2.0, origin + m.UP * 3.65, buff=0, color=MAT, stroke_width=6)
        x_axis = m.Arrow(origin + m.LEFT * 2.25, origin + m.RIGHT * 4.6, buff=0, color=STAT, stroke_width=6)
        y_label = T("MATERIAL ψₘ (+1)\nINCOME · LAND · HEALTHCARE · SECURITY", 24, MAT, width=4.6)
        y_label.next_to(y_axis.get_end(), m.LEFT, buff=0.18)
        x_label = T("PSYCHOLOGICAL STATUS ψₛ (+j)\nDEFERENCE · BADGE · RANK", 24, STAT, width=5.0)
        x_label.next_to(x_axis.get_end(), m.DOWN, buff=0.18)
        q2 = m.Rectangle(
            width=4.55,
            height=1.95,
            fill_color=HER,
            fill_opacity=0.09,
            stroke_color=HER,
            stroke_width=2,
        ).move_to(origin + m.RIGHT * 2.275 + m.DOWN * 0.975)
        q2_label = T("QUADRANT II · ψₘ < 0 · ψₛ > 0", 25, HER).move_to(origin + m.RIGHT * 2.25 + m.DOWN * 1.65)

        def point():
            angle = np.radians(theta.get_value())
            return origin + length * np.array([np.sin(angle), np.cos(angle), 0.0])

        def material_point():
            angle = np.radians(theta.get_value())
            return origin + length * np.array([0.0, np.cos(angle), 0.0])

        def status_point():
            angle = np.radians(theta.get_value())
            return origin + length * np.array([np.sin(angle), 0.0, 0.0])

        phasor = m.always_redraw(lambda: m.Arrow(origin, point(), buff=0, color=GOLD, stroke_width=9))
        material = m.always_redraw(
            lambda: m.Line(
                origin,
                material_point(),
                color=MAT if np.cos(np.radians(theta.get_value())) >= 0 else HER,
                stroke_width=9,
            )
        )
        status = m.always_redraw(lambda: m.Line(origin, status_point(), color=STAT, stroke_width=9))
        material_drop = m.always_redraw(
            lambda: m.DashedLine(material_point(), point(), color=DIM, stroke_width=3, dash_length=0.12)
        )
        status_drop = m.always_redraw(
            lambda: m.DashedLine(status_point(), point(), color=DIM, stroke_width=3, dash_length=0.12)
        )
        theta_arc = m.always_redraw(
            lambda: m.Arc(
                radius=0.72,
                start_angle=np.pi / 2 - np.radians(theta.get_value()),
                angle=np.radians(theta.get_value()),
                color=GOLD,
                stroke_width=5,
            ).shift(origin)
        )
        theta_label = M(r"\theta", 38, GOLD).move_to(origin + np.array([0.72, 0.75, 0]))
        formulas = m.VGroup(
            M(r"\psi_m = |W|\cos\theta", 42, MAT),
            M(r"\psi_s = |W|\sin\theta", 42, STAT),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.25).move_to([4.25, 0.7, 0])
        regime = T("θ = 25° · QUADRANT I", 30, GOLD, width=5.5).move_to([4.15, -1.0, 0])
        history = T("VIRGINIA · MECHANICAL QUESTION", 27, DIM, width=5.6).move_to([4.15, -1.65, 0])
        beat = T("S09-01", 25, GOLD).to_edge(m.DOWN, buff=0.22).to_edge(m.RIGHT, buff=0.35)
        equation_badge = T("EQUATION 3.5", 25, GOLD).to_edge(m.UP, buff=0.42).to_edge(m.RIGHT, buff=0.35)

        historical_rail = m.Line([-5.4, -3.05, 0], [4.6, -3.05, 0], color=DIM, stroke_width=3)
        pins = m.VGroup()
        for x, label in ((-3.8, "1705"), (0.0, "1894–1965"), (3.4, "POST-1965")):
            stem = m.Line([x, -3.25, 0], [x, -2.78, 0], color=GOLD, stroke_width=4)
            tag = T(label, 22, GOLD).next_to(stem, m.DOWN, buff=0.04)
            pins.add(m.VGroup(stem, tag))
        telemetry = T("Φ_load = 0.72   ·   ρ_τ = 0.68", 25, STAT).move_to([0.0, -2.55, 0])
        algebra = M(r"j\psi_s\cdot j\psi_s=-\psi_s^2", 34, HER).move_to([4.05, -2.25, 0])
        proxy_tags = T("SOUTHERN STRATEGY · WAR ON DRUGS · 1994 CRIME BILL · 2008 BAILOUT", 22, INK, width=10.8)
        proxy_tags.move_to([0.0, -2.55, 0])
        tier_badge = T("CONFIDENCE TIER 3 · ORDINAL REGIMES", 23, DIM).move_to([4.15, -2.25, 0])
        for mob in (historical_rail, pins, telemetry, algebra, proxy_tags, tier_badge):
            mob.set_opacity(0)

        self.camera.background_color = BG
        self.add(title, equation, equation_badge, q2, q2_label, y_axis, x_axis, y_label, x_label)
        self.add(material, status, material_drop, status_drop, phasor, theta_arc, theta_label, formulas, regime, history, beat)
        self.add(historical_rail, pins, telemetry, algebra, proxy_tags, tier_badge)

        cues = [
            "Virginia", "answers", "Du", "Equation", "ordinary", "complex", "material", "psychological",
            "Equation", "arrow", "vertical", "horizontal", "Magnitude", "systems", "angle", "Theta",
            "investment", "increases", "ninety", "reactive", "culture", "psychological", "rotation", "cosine",
            "Buffer", "tuning", "default", "fascism", "direction", "historical", "Runtime", "codes", "mixed",
            "containment", "housing", "ranges", "legal", "exemplars", "incarceration", "deindustrialization",
            "status", "Equation",
        ]
        angles = [
            25, 25, 25, 25, 0, 35, 0, 90, 35, 35, 35, 35, 50, 65, 55, 0, 0, 48, 90, 90, 90,
            90, 112, 122, 125, 120, 90, 128, 118, 118, 90, 84, 90, 72, 108, 108, 118, 124, 128, 135, 132, 128,
        ]
        labels = [
            "VIRGINIA · MECHANICAL QUESTION", "SUPPRESSION ALLOCATION · TWO WAGE CHANNELS", "DU BOIS · PUBLIC AND PSYCHOLOGICAL WAGE",
            "EQUATION 3.5", "ONE REAL AXIS", "SECOND PERPENDICULAR AXIS", "MATERIAL AXIS · VERTICAL",
            "PSYCHOLOGICAL AXIS · HORIZONTAL", "ONE COMPLEX WAGE", "MAGNITUDE + MIX", "VERTICAL PROJECTION",
            "HORIZONTAL PROJECTION", "MAGNITUDE AND ANGLE", "EQUAL MAGNITUDE · DIFFERENT MIX",
            "ORDINAL REGIMES", "θ = 0° · PURE MATERIAL", "MATERIAL INVESTMENT", "ROTATION REDISTRIBUTES",
            "θ = 90° · ψₘ = 0", "REACTIVE POWER", "CULTURE-WAR FIELD", "ZERO-CAPITAL STATUS ALLOCATION",
            "ROTATE PAST 90°", "NEGATIVE MATERIAL COMPONENT", "LOSS + SYMBOLIC RANK", "SYSTEM TUNING",
            "θ = 90° · FASCISM THRESHOLD", "QUADRANT II · BUFFER CANNIBALIZATION", "QUALITATIVE PLACEMENT", "HISTORICAL MARKERS",
            "LOG 3 · 1705 · W = jψₛ", "1705 · MATERIAL AND LEGAL PRIVILEGES", "1705 · MIXED ALLOCATION",
            "1894–1965 · CONTAINMENT", "PARTITIONED CREDIT + PROTECTION", "NO INVENTED HISTORICAL θ",
            "AFTER 1965 · PROXY CHANNELS", "FACIALLY NEUTRAL EXEMPLARS", "CARCERAL + FINANCIAL PROXIES",
            "MATERIAL PROJECTION CROSSES ZERO", "STATUS REMAINS POSITIVE", "ONE ROTATING CONTRACT",
        ]

        for k, (cue, target, label) in enumerate(zip(cues, angles, labels)):
            self.until(self.at(k, cue))
            next_history = T(label, 27, INK, width=5.7).move_to(history)
            if target == 0:
                regime_text, regime_color = "θ = 0° · MATERIAL", MAT
            elif target == 90:
                regime_text, regime_color = "θ = 90° · REACTIVE", STAT
            elif target > 90:
                regime_text, regime_color = "θ > 90° · QUADRANT II", HER
            else:
                regime_text, regime_color = "0° < θ < 90° · MIXED", GOLD
            next_regime = T(regime_text, 30, regime_color, width=5.5).move_to(regime)
            next_beat = T(f"S09-{k + 1:02d}", 25, GOLD).move_to(beat)
            emphasis = []
            if k in {3, 8, 41}:
                emphasis.append(m.Indicate(equation, color=GOLD))
            if k in {6, 10}:
                emphasis.append(m.Indicate(y_axis, color=MAT))
            if k in {7, 11, 18, 40}:
                emphasis.append(m.Indicate(x_axis, color=STAT))
            if k == 1:
                emphasis.append(m.Indicate(equation_badge, color=GOLD))
            if k == 2:
                emphasis.extend([m.Indicate(material, color=MAT), m.Indicate(status, color=STAT)])
            if k == 10:
                emphasis.append(m.Indicate(formulas[0], color=MAT))
            if k == 11:
                emphasis.append(m.Indicate(formulas[1], color=STAT))
            if k == 14:
                emphasis.append(tier_badge.animate.set_opacity(1))
            if k == 15:
                emphasis.append(tier_badge.animate.set_opacity(0))
            if k == 29:
                emphasis.extend([historical_rail.animate.set_opacity(1), pins.animate.set_opacity(1)])
            if k in {30, 32}:
                emphasis.append(m.Indicate(pins[0], color=GOLD))
            if k == 33:
                emphasis.append(m.Indicate(pins[1], color=GOLD))
            if k == 34:
                emphasis.append(algebra.animate.set_opacity(1))
            if k == 35:
                emphasis.extend([algebra.animate.set_opacity(0), telemetry.animate.set_opacity(1)])
            if k == 36:
                emphasis.extend([telemetry.animate.set_opacity(0), m.Indicate(pins[2], color=GOLD)])
            if k == 37:
                emphasis.append(proxy_tags.animate.set_opacity(1))
            if k == 38:
                emphasis.extend([m.Indicate(material, color=HER), m.Indicate(status, color=STAT)])
            if k == 41:
                emphasis.extend([m.Indicate(pins, color=GOLD), m.Indicate(equation_badge, color=GOLD)])
            self.play(
                theta.animate.set_value(target),
                m.Transform(history, next_history),
                m.Transform(regime, next_regime),
                m.Transform(beat, next_beat),
                *emphasis,
                run_time=0.42,
            )
        self.until(self.beat_end(41) - 0.2)
