"""S08-25: stationary leaders — Elite outside follower feedback."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def eq_block(tex, label, color=INK, width=6.4):
    cap = T(label, 30, DIM, "NORMAL")
    box = m.RoundedRectangle(width=width, height=1.25, corner_radius=0.12, stroke_color=color, stroke_width=3,
                             fill_color=NAVY2, fill_opacity=1)
    math = M(tex, 48, color).move_to(box)
    if math.width > width - 0.5:
        math.scale_to_fit_width(width - 0.5)
    cap.next_to(box, m.LEFT, buff=0.22)
    return m.VGroup(cap, box, math)


class StationaryLeaders(YTScene):
    SHOT = "S08-25"

    def shot_S08_25(self):
        title = T("STATIONARY LEADERS", 44, GOLD).to_edge(m.UP, buff=0.45)
        elite = m.Circle(radius=0.78, color=GOLD, stroke_width=5, fill_color=NAVY2, fill_opacity=1)
        elite_l = T("ELITE", 34, GOLD).next_to(elite, m.DOWN, buff=0.16)
        elite_g = m.VGroup(elite, elite_l).shift(m.LEFT * 3.2 + m.UP * 0.55)
        followers = m.VGroup(*[m.Circle(radius=0.48, color=INK, stroke_width=3, fill_opacity=0) for _ in range(4)])
        followers.arrange(m.RIGHT, buff=0.95).shift(m.LEFT * 3.2 + m.DOWN * 1.55)
        fb = m.DashedLine(elite.get_left() + m.LEFT * 0.2, followers.get_left() + m.LEFT * 0.35 + m.UP * 0.5,
                          color=DIM, stroke_width=2)
        fb_l = T("FOLLOWER FEEDBACK", 28, DIM, "NORMAL").next_to(elite_g, m.RIGHT, buff=0.35)
        diag = m.VGroup(elite_g, followers, fb, fb_l)
        self.add(title, diag)
        self.play(m.FadeIn(diag), run_time=0.85)
        self.until(self.at(0, "feedback"))

        self.until(self.at(1, "equations"))
        leader_eq = eq_block(r"{}_{0}D_t^{\alpha} q_i(t) = 0", "LEADER", GOLD)
        follower_eq = eq_block(r"\dot x_i = f(x_i, u_i)", "FOLLOWER", INK)
        eq_g = m.VGroup(leader_eq, follower_eq).arrange(m.DOWN, buff=0.55).move_to(m.ORIGIN + m.DOWN * 0.15)
        if eq_g.width > 12.5:
            eq_g.scale_to_fit_width(12.5)
        closed = T("NO USER INPUT u_i", 34, HER).to_edge(m.DOWN, buff=0.42)
        u_note = T("u_i ON FOLLOWERS ONLY", 30, OK, "NORMAL").next_to(follower_eq, m.DOWN, buff=0.28)

        self.play(m.FadeOut(diag), m.FadeIn(eq_g, shift=m.LEFT * 0.2), run_time=0.65)
        self.until(self.at(1, "follower"))
        self.play(m.FadeIn(u_note), m.FadeIn(closed), run_time=0.75)
        self.until(self.at(1, "kernel"))
        self.until(self.beat_end(1) - 0.3)
