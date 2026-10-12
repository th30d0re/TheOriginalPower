"""Faceless reel, part 3: "Who goes first?"

Beats come from outputs/REEL_reciprocity_p3/episode_manifest.json; cues inside
a beat are word timings from the voiceover (Whisper large-v3).

Render:
    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/reel_reciprocity/scene_part3.py \
        Part3 -r 1080x1920 --fps 30 -o outputs/REEL_reciprocity_p3/video/part3.mp4
"""

import json
import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scene import BG, DIM, GOLD, HER, HIM, INK, OK, ROOT, T, cite, qr  # noqa: E402

AUDIO = ROOT / "outputs/REEL_reciprocity_p3/REEL_reciprocity_p3.mp3"
_turns = json.loads((ROOT / "outputs/REEL_reciprocity_p3/episode_manifest.json").read_text())["turns"]
BEATS = [t["start_ms"] / 1000 for t in _turns]
END = _turns[-1]["end_ms"] / 1000

SOURCES = ("https://github.com/th30d0re/TheOriginalPower/blob/main/"
           "Architecting_the_operation/video/reel_reciprocity/citations_part3.md")
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"
OSF = "https://osf.io/pazmy"


def box(text, color, w=None, h=None, size=34):
    t = T(text, size, color)
    r = m.SurroundingRectangle(t, buff=0.3, corner_radius=0.18, color=color, stroke_width=5)
    return m.VGroup(r, t)


class Part3(m.Scene):
    def until(self, t):
        if t > self.time:
            self.wait(t - self.time)

    def clear_all(self, rt=0.4):
        if self.mobjects:
            self.play(*[m.FadeOut(x) for x in self.mobjects], run_time=rt)

    def construct(self):
        self.camera.background_color = BG
        if AUDIO.exists():
            self.add_sound(str(AUDIO))
        beats = [self.question, self.sex_first, self.commit_first, self.either, self.fwb, self.pattern,
                 self.practice, self.escrow, self.grace, self.line, self.series, self.close]
        for i, beat in enumerate(beats):
            nxt = BEATS[i + 1] if i + 1 < len(BEATS) else END
            self.until(BEATS[i])
            beat(BEATS[i], nxt)
            self.until(nxt - 0.4)
            self.clear_all()
        self.end_card()

    def question(self, t0, t1):
        tag = T("PART 3", 34, DIM).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(tag), run_time=0.4)
        self.until(t0 + 1.8)
        q = T("WHO GOES FIRST?", 72, GOLD).shift(m.UP * 1.6)
        self.play(m.Write(q), run_time=0.6)
        a = box("SEX", HER).shift(m.LEFT * 1.8 + m.DOWN * 0.6)
        b = box("COMMITMENT", HIM).shift(m.RIGHT * 1.8 + m.DOWN * 0.6)
        self.until(t0 + 2.6)
        self.play(m.FadeIn(a, shift=m.UP * 0.2), run_time=0.3)
        self.play(m.FadeIn(b, shift=m.UP * 0.2), run_time=0.3)

    def sex_first(self, t0, t1):
        head = m.VGroup(T("SEX FIRST", 56, HER), T("SHE CARRIES THE RISK", 40, INK)).arrange(m.DOWN, buff=0.15)
        head.to_edge(m.UP, buff=1.0)
        self.play(m.FadeIn(head), run_time=0.5)
        self.until(t0 + 2.7)
        her = T("SHE WANTS: RELATIONSHIP", 34, HER).shift(m.UP * 1.6)
        him = T("HE WANTS: CASUAL", 34, HIM).next_to(her, m.DOWN, buff=0.25)
        self.play(m.FadeIn(her), run_time=0.4)
        self.until(t0 + 4.7)
        self.play(m.FadeIn(him), run_time=0.4)
        self.until(t0 + 7.0)
        sit = T("= SITUATIONSHIP", 46, GOLD).next_to(him, m.DOWN, buff=0.35)
        self.play(m.Write(sit), run_time=0.5)
        self.until(t0 + 8.4)
        self.play(m.FadeOut(her), m.FadeOut(him), m.FadeOut(sit), run_time=0.3)
        dots = m.VGroup(*[m.Dot(radius=0.13, color=INK) for _ in range(47)])
        dots.arrange_in_grid(rows=5, buff=0.32).shift(m.UP * 0.6)
        lab = T("47 HOPED IT WOULD\nBECOME A RELATIONSHIP", 36, INK).next_to(dots, m.DOWN, buff=0.4)
        src = cite("Longitudinal FWB study, re-analysis\nof osf.io/pazmy (median 11 months)", OSF)
        self.play(m.LaggedStart(*[m.FadeIn(d) for d in dots], lag_ratio=0.02), m.FadeIn(lab), m.FadeIn(src), run_time=1.2)
        self.until(t0 + 13.9)
        lit = [3, 11, 17, 24, 30, 38, 44]
        self.play(*[dots[k].animate.set_color(OK).scale(1.5) for k in lit],
                  *[d.animate.set_opacity(0.25) for k, d in enumerate(dots) if k not in lit], run_time=0.8)
        res = T("ABOUT A YEAR LATER: 7 HAD", 40, OK).next_to(lab, m.DOWN, buff=0.3)
        self.play(m.FadeIn(res), run_time=0.4)

    def commit_first(self, t0, t1):
        head = m.VGroup(T("COMMITMENT FIRST", 52, HIM), T("HE CARRIES THE RISK", 40, INK)).arrange(m.DOWN, buff=0.15)
        head.to_edge(m.UP, buff=1.0)
        self.play(m.FadeIn(head), run_time=0.5)
        self.until(t0 + 2.7)
        inv = box("INVESTS", HIM, w=3.0).shift(m.LEFT * 1.8 + m.UP * 1.0)
        wait = box("SEX: PENDING…", DIM, w=3.4).shift(m.RIGHT * 1.8 + m.UP * 1.0)
        self.play(m.FadeIn(inv), m.FadeIn(wait), run_time=0.5)
        self.until(t0 + 4.7)
        comp = T("COMPATIBLE?  UNKNOWN", 40, GOLD).shift(m.DOWN * 0.6)
        self.play(m.FadeIn(comp), run_time=0.4)
        self.until(t0 + 6.8)
        val = T("VALUED FOR WHAT HE PROVIDES", 40, HER).shift(m.DOWN * 2.0)
        self.play(m.FadeIn(val, shift=m.UP * 0.2), run_time=0.5)

    def either(self, t0, t1):
        scale = m.Line(m.LEFT * 2.6, m.RIGHT * 2.6, color=INK, stroke_width=8).shift(m.UP * 0.6)
        post = m.Line(m.UP * 0.6, m.DOWN * 1.6, color=DIM, stroke_width=8)
        load = m.Square(1.5, fill_color=GOLD, fill_opacity=1, stroke_width=0).move_to(scale.get_left() + m.RIGHT * 0.3 + m.DOWN * 0.8)
        rl = T("RISK", 28, BG).move_to(load)
        beam = m.VGroup(scale, load, rl)
        head = T("ONE PERSON CARRIES IT ALONE", 44, GOLD).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(head), m.FadeIn(post), m.FadeIn(beam), run_time=0.6)
        self.play(m.Rotate(beam, angle=0.35, about_point=m.UP * 0.6), run_time=0.8)
        self.until(t0 + 3.2)
        ext = T("THE SETUP EXTRACTION NEEDS", 40, HER).shift(m.DOWN * 2.8)
        self.play(m.Write(ext), run_time=0.6)

    def fwb(self, t0, t1):
        head = T("FRIENDS WITH BENEFITS", 52, OK).to_edge(m.UP, buff=1.2)
        sub = T("usually runs without the dating script", 30, DIM, "NORMAL").next_to(head, m.DOWN, buff=0.2)
        self.play(m.FadeIn(sub), run_time=0.4)
        self.until(t0 + 3.8)
        self.play(m.Write(head), run_time=0.6)
        self.until(t0 + 5.9)
        axis = m.Line([-2.4, -1.6, 0], [2.4, -1.6, 0], color=DIM)
        bars = m.VGroup()
        for k, (lab, col) in enumerate([("FWB", OK), ("MARRIED", HIM)]):
            b = m.Rectangle(width=1.4, height=3.4, fill_color=col, fill_opacity=1, stroke_width=0)
            b.move_to([-1.2 + 2.4 * k, -1.6 + 1.7, 0])
            bars.add(m.VGroup(b, T(lab, 32, INK).next_to(b, m.DOWN, buff=0.15)))
        sat = T("SEXUAL SATISFACTION:\nABOUT EQUAL", 38, GOLD).shift(m.UP * 2.7)
        src = cite("Birnie-Porter & Hunt (2015), N = 475\nCanadian J. of Human Sexuality", "https://doi.org/10.3138/cjhs.242-A5")
        self.play(m.Create(axis), m.LaggedStart(*[m.FadeIn(b, shift=m.UP * 0.3) for b in bars], lag_ratio=0.3),
                  m.FadeIn(sat), m.FadeIn(src), run_time=1.0)
        self.until(t0 + 14.5)
        alt = T("ANOTHER STUDY:\nLOWER THAN ROMANCE", 38, HER).move_to(sat)
        src2 = cite("Lehmiller, VanderDrift & Kelly (2014)\nJournal of Sex Research", "https://doi.org/10.1080/00224499.2012.719167")
        self.play(m.Transform(sat, alt), bars[0][0].animate.stretch_to_fit_height(2.6).align_to(axis, m.DOWN),
                  m.FadeOut(src), m.FadeIn(src2), run_time=0.7)
        self.until(t0 + 17.3)
        mix = T("DIFFERENT ARRANGEMENTS,\nMIXED TOGETHER", 36, GOLD).shift(m.DOWN * 3.3)
        self.play(m.FadeIn(mix), run_time=0.5)

    def pattern(self, t0, t1):
        head = T("THE PATTERN UNDERNEATH", 44, GOLD).to_edge(m.UP, buff=1.2)
        self.play(m.FadeIn(head), run_time=0.4)
        self.until(t0 + 1.6)
        ax_x = m.Line([-2.6, -0.8, 0], [2.6, -0.8, 0], color=DIM)
        ax_y = m.Line([-2.6, -0.8, 0], [-2.6, 2.4, 0], color=DIM)
        rise = m.Line([-2.4, -0.5, 0], [2.4, 2.0, 0], color=HER, stroke_width=8)
        xl = T("experience with the same partner →", 28, DIM, "NORMAL").next_to(ax_x, m.DOWN, buff=0.2)
        yl = T("her orgasm rate ↑", 28, DIM, "NORMAL").next_to(ax_y, m.UP, buff=0.2).align_to(ax_y, m.LEFT)
        src = cite("Armstrong, England & Fogarty (2012)\nAmerican Sociological Review", "https://doi.org/10.1177/0003122412445802")
        self.play(m.Create(ax_x), m.Create(ax_y), m.FadeIn(xl, yl, src), run_time=0.5)
        self.play(m.Create(rise), run_time=1.2)
        self.until(t0 + 6.1)
        fb = T("FAMILIARITY + FEEDBACK", 40, OK).shift(m.DOWN * 2.6)
        self.play(m.FadeIn(fb), run_time=0.4)
        self.until(t0 + 8.9)
        self.play(*[m.FadeOut(x) for x in (ax_x, ax_y, rise, xl, yl, src, fb)], run_time=0.3)
        pts = json.loads((Path(__file__).resolve().parent / "fwb_comm_orgasm_points.json").read_text())["points"]
        jit = np.random.default_rng(7)
        dots = m.VGroup(*[m.Dot([-2.6 + 5.2 * (c - 1) / 8 + jit.normal(0, 0.06), -1.0 + 3.2 * (o - 1) / 8 + jit.normal(0, 0.06), 0],
                                radius=0.06, color=OK, fill_opacity=0.8) for c, o in pts])
        cs = np.array([c for c, _ in pts]); os_ = np.array([o for _, o in pts])
        k, b0 = np.polyfit(cs, os_, 1)
        line = m.Line([-2.6, -1.0 + 3.2 * (k + b0 - 1) / 8, 0], [2.6, -1.0 + 3.2 * (9 * k + b0 - 1) / 8, 0], color=GOLD, stroke_width=5)
        xl2 = T("comfortable saying what she wants →", 28, DIM, "NORMAL").move_to([0, -1.6, 0])
        yl2 = T("finishes more often ↑", 28, DIM, "NORMAL").move_to([0, 2.7, 0])
        r = T("WOMEN IN FWB · r = .41", 34, GOLD).move_to([0, 3.5, 0])
        src2 = cite("Re-analysis of osf.io/pazmy\n(n = 100 women)", OSF)
        self.play(m.FadeOut(head), m.LaggedStart(*[m.FadeIn(d) for d in dots], lag_ratio=0.02),
                  m.FadeIn(xl2, yl2, r, src2), run_time=1.0)
        self.play(m.Create(line), run_time=0.5)

    def practice(self, t0, t1):
        a = m.VGroup(T("RECIPROCITY RUNS ON", 44, INK), T("PRACTICE + HONESTY", 56, OK)).arrange(m.DOWN, buff=0.15).shift(m.UP * 1.2)
        self.play(m.FadeIn(a, shift=m.UP * 0.2), run_time=0.5)
        self.until(t0 + 2.9)
        b = m.VGroup(T("COMMITMENT HELPS", 44, INK), T("WHEN IT BUYS YOU BOTH", 48, GOLD)).arrange(m.DOWN, buff=0.15).shift(m.DOWN * 1.4)
        self.play(m.FadeIn(b, shift=m.UP * 0.2), run_time=0.5)

    def escrow(self, t0, t1):
        head = T("COMMIT TO BOTH AT THE SAME TIME", 38, GOLD).to_edge(m.UP, buff=1.2)
        self.play(m.FadeIn(head), run_time=0.4)
        self.until(t0 + 2.7)
        vault = m.RoundedRectangle(width=3.4, height=2.2, corner_radius=0.25, color=GOLD, stroke_width=6).shift(m.UP * 0.4)
        vl = T("ESCROW", 40, GOLD).next_to(vault, m.UP, buff=0.2)
        a = T("RELATIONSHIP", 30, HIM).move_to([-2.2, -2.0, 0])
        b = T("SEX", 34, HER).move_to([2.4, -2.0, 0])
        self.play(m.Create(vault), m.FadeIn(vl, a, b), run_time=0.6)
        self.until(t0 + 3.7)
        self.play(a.animate.move_to(vault.get_center() + m.UP * 0.35), b.animate.move_to(vault.get_center() + m.DOWN * 0.35),
                  run_time=1.2)
        self.play(vault.animate.set_fill(GOLD, opacity=0.15), run_time=0.3)
        nb = T("NOBODY PAYS FIRST", 40, INK).shift(m.DOWN * 1.9)
        self.play(m.FadeIn(nb), run_time=0.4)
        self.until(t0 + 9.1)
        st = T("START BOTH IN THE SAME STEP", 40, OK).shift(m.DOWN * 3.0)
        self.play(m.FadeIn(st, shift=m.UP * 0.2), run_time=0.5)

    def grace(self, t0, t1):
        head = T("START SMALLER", 52, GOLD).to_edge(m.UP, buff=1.2)
        self.until(t0 + 2.3)
        self.play(m.FadeIn(head), run_time=0.4)
        self.until(t0 + 3.8)
        bar = m.Line([-3.0, 1.0, 0], [3.0, 1.0, 0], color=DIM, stroke_width=8)
        g = m.Line([-3.0, 1.0, 0], [0.6, 1.0, 0], color=OK, stroke_width=14)
        r = m.Line([0.6, 1.0, 0], [3.0, 1.0, 0], color=HER, stroke_width=14)
        gl = T("GRACE PERIOD", 30, OK).move_to([-1.2, 0.4, 0])
        rl = T("RESENTMENT", 30, HER).move_to([1.8, 0.4, 0])
        talk = T("TALK ABOUT IT OUT LOUD", 40, INK).shift(m.UP * 2.8)
        self.play(m.FadeIn(talk), m.Create(bar), m.Create(g), m.Create(r), m.FadeIn(gl, rl), run_time=0.8)
        self.until(t0 + 6.1)
        q = T("HOW LONG BEFORE\nRESENTMENT STARTS?", 38, GOLD).shift(m.DOWN * 0.8)
        self.play(m.FadeIn(q), run_time=0.4)
        self.until(t0 + 9.6)
        mark = m.VGroup(T("?", 64, GOLD), m.Line(m.UP * 0.3, m.DOWN * 0.3, color=GOLD, stroke_width=6))
        mark.arrange(m.DOWN, buff=0.05).move_to([-2.0, 1.55, 0])
        guess = T("UNSPOKEN, YOUR PARTNER\nHAS TO GUESS", 36, INK).shift(m.DOWN * 2.4)
        self.play(m.FadeIn(mark), m.FadeIn(guess), run_time=0.4)
        self.play(mark.animate.move_to([1.6, 1.55, 0]), run_time=1.4)
        self.play(mark.animate.move_to([-0.6, 1.55, 0]), run_time=1.0)

    def line(self, t0, t1):
        head = T("THE LINE EXISTS ANYWAY", 48, HER).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(head), run_time=0.4)
        self.until(t0 + 3.0)
        bars = m.VGroup(*[m.Rectangle(width=0.6, height=0.3 * 1.45 ** k, fill_color=HER, fill_opacity=1, stroke_width=0)
                          for k in range(7)]).arrange(m.RIGHT, buff=0.18, aligned_edge=m.DOWN).shift(m.DOWN * 0.6)
        lab = T("RESENTMENT, PAYING INTEREST", 36, HER).next_to(bars, m.DOWN, buff=0.4)
        self.play(m.LaggedStart(*[m.FadeIn(b, shift=m.UP * 0.2) for b in bars], lag_ratio=0.25), m.FadeIn(lab), run_time=2.4)

    def series(self, t0, t1):
        head = T("THE WHOLE SERIES", 52, GOLD).to_edge(m.UP, buff=1.2)
        self.play(m.FadeIn(head), run_time=0.4)
        self.until(t0 + 2.5)
        core = m.VGroup(m.Circle(radius=0.9, color=OK, stroke_width=6), T("SEX", 40, INK)).shift(m.UP * 1.8)
        cl = T("IS THE CORE", 36, OK).next_to(core, m.DOWN, buff=0.2)
        self.play(m.Create(core[0]), m.FadeIn(core[1], cl), run_time=0.6)
        self.until(t0 + 3.6)
        ph = m.ValueTracker(0.0)
        w1 = m.always_redraw(lambda: m.FunctionGraph(lambda x: 0.35 * np.sin(3 * x - ph.get_value()), x_range=[-2.8, 2.8],
                                                     color=HIM).shift(m.DOWN * 0.9))
        w2 = m.always_redraw(lambda: m.FunctionGraph(lambda x: 0.35 * np.sin(3 * x - ph.get_value()), x_range=[-2.8, 2.8],
                                                     color=HER).shift(m.DOWN * 0.95))
        same = T("SAME TIME, BOTH SIDES", 36, INK).shift(m.DOWN * 2.0)
        self.add(w1, w2)
        self.play(m.FadeIn(same), ph.animate.set_value(4), run_time=1.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * max(0.1, t0 + 6.7 - self.time)), run_time=max(0.1, t0 + 6.7 - self.time),
                  rate_func=m.linear)
        fr = T("FROM THE START, OR THE RESTART", 38, GOLD).shift(m.DOWN * 3.1)
        self.play(m.FadeIn(fr), ph.animate.increment_value(2), run_time=0.8, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * max(0.1, t1 - 0.5 - self.time)), run_time=max(0.1, t1 - 0.5 - self.time),
                  rate_func=m.linear)

    def close(self, t0, t1):
        lines = [(0.0, T("NAME YOUR GRACE PERIOD.", 50, OK)), (1.6, T("START TOGETHER.", 56, GOLD)),
                 (2.5, T("FIND SOMEONE WHO SHOWS UP\nWHEN YOU DO.", 46, INK))]
        g = m.VGroup(*[t for _, t in lines]).arrange(m.DOWN, buff=0.7)
        for at, t in lines:
            self.until(t0 + at)
            self.play(m.FadeIn(t, shift=m.UP * 0.2), run_time=0.5)

    def end_card(self):
        cards = m.VGroup()
        for label, url in [("SOURCES", SOURCES), ("THE BOOK", BOOK)]:
            cards.add(m.VGroup(qr(url, side=2.6), T(label, 34, GOLD)).arrange(m.DOWN, buff=0.3))
        cards.arrange(m.DOWN, buff=0.8)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        self.play(m.FadeIn(cards), m.FadeIn(foot), run_time=0.5)
        self.wait(3.0)
