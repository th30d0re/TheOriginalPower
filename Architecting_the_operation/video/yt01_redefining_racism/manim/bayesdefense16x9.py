"""S11-01 host wetware; S11-09 Bayesian prior swamp."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


class HostWetware(YTScene):
    SHOT = "S11-01"

    def shot_S11_01(self):
        brain = m.Circle(radius=2.05, stroke_color=OK, stroke_width=5, fill_color=NAVY2, fill_opacity=0.9)
        brain.shift(m.LEFT * 3.6 + m.UP * 0.1)
        brain_l = T("PATTERN RECOGNITION", 34, OK, width=4.2).next_to(brain, m.DOWN, buff=0.28)
        code = m.RoundedRectangle(width=5.2, height=1.65, corner_radius=0.12, stroke_color=HER, stroke_width=4,
                                  fill_color="#1a1020", fill_opacity=1)
        code_l = T("EXTRACTION CODE", 36, HER, width=4.8).move_to(code)
        code_g = m.VGroup(code, code_l).shift(m.RIGHT * 3.5 + m.UP * 0.45)
        arrow = m.Arrow(code_g.get_left(), brain.get_right() + m.UP * 0.12, buff=0.28, color=HER, stroke_width=6)
        head = T("EXECUTION SUBSTRATE", 44, GOLD).to_edge(m.UP, buff=0.42)
        self.add(head)
        self.play(m.FadeIn(brain), m.FadeIn(brain_l), run_time=0.7)
        self.until(self.at(0, "wetware"))
        self.play(m.FadeIn(code_g), m.GrowArrow(arrow), run_time=0.8)
        self.until(self.at(0, "brain"))

        # 1 — prediction, energy, coordination
        self.until(self.at(1, "prediction"))
        feats = m.VGroup(*[T(w, 34, DIM, "NORMAL") for w in ("FAST PREDICTION", "ENERGY SAVING", "COORDINATION")])
        feats.arrange(m.DOWN, buff=0.12, aligned_edge=m.LEFT).next_to(brain_l, m.DOWN, buff=0.22).align_to(brain, m.LEFT)
        self.play(m.FadeIn(feats), run_time=0.6)
        self.until(self.at(1, "adversarial"))

        # 2 — routed through racial partition
        self.until(self.at(2, "legally"))
        self.play(m.FadeOut(feats), run_time=0.35)
        route = m.RoundedRectangle(width=12.0, height=0.95, corner_radius=0.1, stroke_color=GOLD, stroke_width=4,
                                   fill_opacity=0)
        route_l = T("LEGALLY ENFORCED RACIAL PARTITION", 34, GOLD, width=11.5).move_to(route)
        route_g = m.VGroup(route, route_l).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeIn(route_g), arrow.animate.set_color(GOLD), run_time=0.7)
        self.until(self.at(2, "partition"))
        self.until(self.beat_end(2) - 0.3)


class BayesPriorSwamp(YTScene):
    SHOT = "S11-09"

    def shot_S11_09(self):
        head = T("BAYESIAN DEFENSE", 44, GOLD).to_edge(m.UP, buff=0.42)
        prior = m.Rectangle(width=2.6, height=3.2, stroke_color=HER, stroke_width=4, fill_color=HER, fill_opacity=0.35)
        prior_l = T("RACIAL PRIOR", 34, HER).next_to(prior, m.UP, buff=0.35)
        prior_g = m.VGroup(prior, prior_l).shift(m.LEFT * 4.2 + m.DOWN * 0.35)
        like = m.Rectangle(width=2.4, height=1.45, stroke_color=DIM, stroke_width=3, fill_color=NAVY2, fill_opacity=1)
        like_l = T("LIKELIHOOD", 34, DIM, "NORMAL").next_to(like, m.UP, buff=0.18)
        like_g = m.VGroup(like, like_l).shift(m.DOWN * 0.25)
        post = m.Rectangle(width=2.4, height=1.45, stroke_color=INK, stroke_width=3, fill_color=NAVY2, fill_opacity=1)
        post_l = T("PERCEPTION", 34, INK).next_to(post, m.UP, buff=0.18)
        post_g = m.VGroup(post, post_l).shift(m.RIGHT * 4.0 + m.DOWN * 0.25)
        eq = M(r"P(T\mid X,\Pi_{\text{race}})", 48, INK).next_to(head, m.DOWN, buff=0.32)
        self.add(head, eq)
        self.play(m.FadeIn(prior_g), run_time=0.7)
        self.until(self.at(0, "Bayesian"))
        self.play(m.FadeIn(like_g), m.FadeIn(post_g), run_time=0.6)
        self.until(self.at(0, "partition"))

        # 1 — excessive prior precision
        self.until(self.at(1, "precision"))
        heavy = T("INSTITUTIONAL REINFORCEMENT", 36, HER, width=12.0).to_edge(m.DOWN, buff=0.48)
        self.play(prior.animate.stretch_to_fit_height(3.5), prior_l.animate.shift(m.UP * 0.55), m.FadeIn(heavy), run_time=0.8)
        self.until(self.at(1, "reinforcement"))

        # 2 — prior overrides evidence
        self.until(self.at(2, "override"))
        self.play(like_g.animate.set_opacity(0.3), post.animate.set_fill(HER, 0.45), run_time=0.7)
        filt = T("OUT-GROUP HARM FILTERED", 36, HER).next_to(heavy, m.UP, buff=0.32)
        self.play(m.FadeIn(filt), run_time=0.5)
        self.until(self.at(2, "evidence"))
        self.until(self.beat_end(2) - 0.3)
