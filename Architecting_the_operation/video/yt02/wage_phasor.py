"""YT02 SEG 09: complex wage phasor and its historical regimes."""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

COMMON = Path(__file__).resolve().parents[1] / "yt01_redefining_racism/manim"
YT02 = Path(__file__).resolve().parent
sys.path.insert(0, str(COMMON))
sys.path.insert(0, str(YT02))
from common16x9 import BG, DIM, GOLD, HER, INK, M, OK, T, YTScene  # noqa: E402
from layout_v2 import clamp_above_caption  # noqa: E402

MAT = OK
STAT = GOLD
ORIGIN = np.array([-3.45, 0.05, 0.0])
LENGTH = 2.25


def phasor_tip(theta_deg, origin=ORIGIN, length=LENGTH):
    th = np.radians(theta_deg)
    return origin + length * np.array([np.sin(th), -np.cos(th), 0.0])


class WagePhasor(YTScene):
    """Positive ψ_m points down; θ opens from ψ_m toward ψ_s; Quadrant II is upper-right."""

    SHOT = "S09-01"

    def shot_S09_01(self):
        origin = ORIGIN
        length = LENGTH
        theta = m.ValueTracker(25.0)

        title = T("THE WAGE PHASOR", 42, GOLD).move_to([-2.6, 3.45, 0])
        equation_badge = T("EQUATION 3.5", 25, GOLD).move_to([4.15, 3.5, 0])
        equation = M(r"W = \psi_m + j\psi_s", 42, INK).move_to([4.15, 2.92, 0])
        y_axis = m.Arrow(origin + m.UP * 2.25, origin + m.DOWN * 2.25, buff=0, color=MAT, stroke_width=6)
        x_axis = m.Arrow(origin + m.LEFT * 0.2, origin + m.RIGHT * 3.35, buff=0, color=STAT, stroke_width=6)
        y_label = T("MATERIAL ψₘ (+)", 20, MAT).move_to([-5.25, -2.12, 0])
        x_label = T("ψₛ (+)", 23, STAT).move_to([-0.35, -0.42, 0])
        elite = T("ELITE · EXTRACTION ↑", 22, GOLD).move_to(origin + m.UP * 2.62)
        q2 = m.Rectangle(
            width=2.75,
            height=1.55,
            fill_color=HER,
            fill_opacity=0.09,
            stroke_color=HER,
            stroke_width=2,
        ).move_to(origin + m.RIGHT * 1.55 + m.UP * 1.18)
        q2_label = T("QUADRANT II", 20, HER).next_to(q2, m.UP, buff=0.08).align_to(q2, m.RIGHT)

        def mat_pt():
            t = np.radians(theta.get_value())
            return origin + length * np.array([0.0, -np.cos(t), 0.0])

        def stat_pt():
            t = np.radians(theta.get_value())
            return origin + length * np.array([np.sin(t), 0.0, 0.0])

        phasor = m.always_redraw(lambda: m.Arrow(origin, phasor_tip(theta.get_value(), origin, length), buff=0, color=GOLD, stroke_width=9))
        material = m.always_redraw(
            lambda: m.Line(
                origin,
                mat_pt(),
                color=MAT if np.cos(np.radians(theta.get_value())) >= 0 else HER,
                stroke_width=9,
            )
        )
        status = m.always_redraw(lambda: m.Line(origin, stat_pt(), color=STAT, stroke_width=9))
        material_drop = m.always_redraw(
            lambda: m.DashedLine(mat_pt(), phasor_tip(theta.get_value(), origin, length), color=DIM, stroke_width=3, dash_length=0.12)
        )
        status_drop = m.always_redraw(
            lambda: m.DashedLine(stat_pt(), phasor_tip(theta.get_value(), origin, length), color=DIM, stroke_width=3, dash_length=0.12)
        )
        theta_arc = m.always_redraw(
            lambda: m.Arc(
                radius=0.68,
                start_angle=-m.PI / 2,
                angle=np.radians(theta.get_value()),
                color=GOLD,
                stroke_width=5,
            ).shift(origin)
        )
        theta_label = M(r"\theta", 30, GOLD).move_to([3.2, 0.15, 0]).set_opacity(0)
        formulas = m.VGroup(
            m.MathTex(r"\psi_m", r"=", r"|W|", r"\cos\theta", font_size=38, color=MAT),
            m.MathTex(r"\psi_s", r"=", r"|W|", r"\sin\theta", font_size=38, color=STAT),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.2).move_to([4.15, 1.85, 0])
        regime = T("θ = 25° · QUADRANT I", 25, GOLD, width=4.5).move_to([4.15, 0.75, 0])
        history = T("VIRGINIA · MECHANICAL QUESTION", 24, DIM, width=11.8).move_to([0.0, -2.58, 0])

        historical_rail = m.Line([-5.8, -1.82, 0], [-0.45, -1.82, 0], color=DIM, stroke_width=3)
        pins = m.VGroup()
        for x, label in ((-5.0, "1705"), (-3.25, "1894–1965"), (-1.15, "POST-1965")):
            stem = m.Line([x, -1.92, 0], [x, -1.76, 0], color=GOLD, stroke_width=4)
            tag = T(label, 19, GOLD).next_to(stem, m.UP, buff=0.04)
            pins.add(m.VGroup(stem, tag))
        telemetry = T("Φ_load = 0.72   ·   ρ_τ = 0.68", 21, STAT).move_to([4.15, -0.05, 0])
        algebra = M(r"j\psi_s\cdot j\psi_s=-\psi_s^2", 28, HER).move_to([4.15, -0.75, 0])
        proxy_tags = T("SOUTHERN STRATEGY\nWAR ON DRUGS · 1994 CRIME BILL", 24, INK, width=4.7)
        proxy_tags.move_to([4.15, -1.35, 0])
        tier_badge = T("CONFIDENCE TIER 3 · ORDINAL REGIMES", 20, DIM, width=4.7).move_to([4.15, -1.35, 0])
        for mob in (historical_rail, pins, telemetry, algebra, proxy_tags, tier_badge):
            mob.set_opacity(0)
        for mob in (y_label, x_label, q2_label, regime, history, formulas, telemetry, elite):
            clamp_above_caption(mob)

        self.camera.background_color = BG
        self.add(title, equation, equation_badge, elite, q2, q2_label, y_axis, x_axis, y_label, x_label)
        self.add(material, status, material_drop, status_drop, phasor, theta_arc, theta_label, formulas, regime, history)
        self.add(historical_rail, pins, telemetry, algebra, proxy_tags, tier_badge)

        cues = [
            "Virginia", "Prediction", "Virginia", "statutory", "Virginia", "White", "shipped",
            "Mortality", "children", "servant", "Virginia,", "European", "families,", "Washington",
            "Elite", "compilation", "servants", "Council", "Punch", "Equation", "December",
            "paternity", "Maryland", "enslaved", "grievances", "solidarity", "Equation",
            "Equation", "Equation", "architecture", "Bacon's", "Grantham", "promises", "Allen",
            "compilation", "intermarriage", "mixed-race", "expectancy", "Equation", "Virginia",
            "Warren", "October",
        ]
        angles = [
            25, 25, 25, 25, 0, 35, 0, 90, 35, 35, 35, 35, 50, 65, 55, 0, 0, 48, 90, 90, 90,
            90, 112, 122, 125, 120, 90, 128, 118, 118, 90, 84, 90, 72, 108, 108, 118, 124, 128, 135, 132, 128,
        ]
        labels = [
            "VIRGINIA · MECHANICAL QUESTION", "SUPPRESSION ALLOCATION · TWO WAGE CHANNELS", "DU BOIS · PUBLIC AND PSYCHOLOGICAL WAGE",
            "EQUATION 3.5", "ONE REAL AXIS", "SECOND PERPENDICULAR AXIS", "MATERIAL AXIS · ψₘ DOWN",
            "PSYCHOLOGICAL AXIS · ψₛ RIGHT", "ONE COMPLEX WAGE", "MAGNITUDE + MIX", "VERTICAL PROJECTION",
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
            next_history = T(label, 26, INK, width=5.2).move_to(history)
            clamp_above_caption(next_history)
            if target == 0:
                regime_text, regime_color = "θ = 0° · MATERIAL", MAT
            elif target == 90:
                regime_text, regime_color = "θ = 90° · REACTIVE", STAT
            elif target > 90:
                regime_text, regime_color = "θ > 90° · QUADRANT II", HER
            else:
                regime_text, regime_color = "0° < θ < 90° · MIXED", GOLD
            next_regime = T(regime_text, 28, regime_color, width=5.0).move_to(regime)
            clamp_above_caption(next_regime)
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
                emphasis.extend([
                    m.Indicate(formulas[0].get_part_by_tex(r"\psi_m"), color=MAT),
                    m.Indicate(formulas[0].get_part_by_tex(r"\cos\theta"), color=GOLD),
                ])
            if k == 11:
                emphasis.extend([
                    m.Indicate(formulas[1].get_part_by_tex(r"\psi_s"), color=STAT),
                    m.Indicate(formulas[1].get_part_by_tex(r"\sin\theta"), color=GOLD),
                ])
            if k == 14:
                emphasis.append(tier_badge.animate.set_opacity(1))
            if k == 15:
                emphasis.append(tier_badge.animate.set_opacity(0))
            if k == 29:
                emphasis.append(m.Indicate(equation_badge, color=GOLD))
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
                *emphasis,
                run_time=0.42,
            )
        self.until(self.beat_end(41) - 0.2)
