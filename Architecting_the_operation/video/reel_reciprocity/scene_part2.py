"""Faceless reel, part 2: "When sex becomes a chore."

Shares helpers and palette with scene.py. Beats are read from the part-2
voiceover manifest (outputs/REEL_reciprocity_p2/episode_manifest.json).

Render:
    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/reel_reciprocity/scene_part2.py \
        Part2 -r 1080x1920 --fps 30 -o outputs/REEL_reciprocity_p2/video/part2.mp4
"""

import json
import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scene import BG, DIM, GOLD, HER, HIM, INK, OK, ROOT, T, cite, qr  # noqa: E402

AUDIO = ROOT / "outputs/REEL_reciprocity_p2/REEL_reciprocity_p2.mp3"
_turns = json.loads((ROOT / "outputs/REEL_reciprocity_p2/episode_manifest.json").read_text())["turns"]
BEATS = [t["start_ms"] / 1000 for t in _turns]
END = _turns[-1]["end_ms"] / 1000

SOURCES = ("https://github.com/th30d0re/TheOriginalPower/blob/main/"
           "Architecting_the_operation/video/reel_reciprocity/citations_part2.md")
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"


class Part2(m.Scene):
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
        beats = [self.pickup, self.data, self.valid, self.his_side, self.service, self.spill,
                 self.calibrate, self.sequence, self.timeline, self.forcing, self.close]
        for i, beat in enumerate(beats):
            self.until(BEATS[i])
            beat(BEATS[i], BEATS[i + 1] if i + 1 < len(BEATS) else END)
            self.until((BEATS[i + 1] if i + 1 < len(BEATS) else END) - 0.4)
            self.clear_all()
        self.end_card()

    def pickup(self, t0, t1):
        tag = T("PART 2 OF 2", 34, DIM).to_edge(m.UP, buff=1.4)
        line = m.VGroup(T("TAKE SEX OFF", 54), T("THE CHORE CHART", 54, GOLD)).arrange(m.DOWN, buff=0.2)
        self.play(m.FadeIn(tag), m.FadeIn(line, shift=m.UP * 0.2), run_time=0.8)
        self.until(t0 + 3.1)
        reply = m.VGroup(T("FOR A LOT OF WOMEN,", 40), T("IT ALREADY IS A CHORE", 40, HER)).arrange(m.DOWN, buff=0.2)
        reply.shift(m.DOWN * 2.8)
        self.play(m.FadeIn(reply, shift=m.UP * 0.2))

    def data(self, t0, t1):
        head = T("IF IT DOESN'T PLEASE HER, IT'S LABOR", 32, HER).to_edge(m.UP, buff=1.4)
        self.until(t0 + 1.2)
        self.play(m.FadeIn(head))
        self.until(t0 + 5.2)
        axis = m.Line([-2.6, -2.2, 0], [2.6, -2.2, 0], stroke_color=DIM)
        bars = m.VGroup()
        for k, (lab, v, col) in enumerate([("STRAIGHT\nMEN", 95, HIM), ("STRAIGHT\nWOMEN", 65, HER)]):
            x = -1.3 + 2.6 * k
            h = 5.0 * v / 100
            b = m.Rectangle(width=1.5, height=h, fill_color=col, fill_opacity=1, stroke_width=0).move_to([x, -2.2 + h / 2, 0])
            bars.add(m.VGroup(b, T(f"{v}%", 44, col).next_to(b, m.UP, buff=0.15), T(lab, 28, INK).move_to([x, -2.9, 0])))
        sub = T("usually or always orgasm", 28, DIM, "NORMAL").next_to(head, m.DOWN, buff=0.25)
        src = cite("Frederick et al. (2018)\nArchives of Sexual Behavior", "https://doi.org/10.1007/s10508-017-0939-z")
        self.play(m.Create(axis), m.FadeIn(sub), m.FadeIn(src), run_time=0.6)
        self.play(m.LaggedStart(*[m.FadeIn(b[0], shift=m.UP * 0.3) for b in bars], lag_ratio=0.4), run_time=1.0)
        self.play(*[m.FadeIn(b[1:]) for b in bars], run_time=0.5)
        self.until(t0 + 10.7)
        third = T("1 IN 3 WOMEN DON'T USUALLY FINISH", 32, HER).move_to(head)
        self.play(m.Transform(head, third), m.FadeOut(sub), bars[1][0].animate.set_fill(opacity=0.55), run_time=0.6)

    def valid(self, t0, t1):
        items = ["DISHES", "LAUNDRY", "KIDS", "SCHEDULE", "SEX"]
        rows = m.VGroup(*[T(s, 36, HER if s == "SEX" else INK) for s in items]).arrange(m.DOWN, buff=0.35, aligned_edge=m.LEFT)
        boxes = m.VGroup(*[m.Square(0.45, color=DIM).next_to(r, m.LEFT, buff=0.3) for r in rows])
        g = m.VGroup(boxes, rows).move_to(m.UP * 0.6)
        head = T("THAT'S VALID", 44, OK).to_edge(m.UP, buff=1.4)
        checks = [m.Line(b.get_corner(m.DL) + m.UR * 0.1, b.get_corner(m.UR) + m.DL * 0.1, color=OK, stroke_width=6)
                  for b in boxes[:4]]
        self.play(m.FadeIn(head), m.FadeIn(g), run_time=0.5)
        self.play(m.LaggedStart(*[m.Create(c) for c in checks], lag_ratio=0.3), run_time=1.0)

    def his_side(self, t0, t1):
        hoop_xy = [(-2.4, -1.6), (-1.0, -0.9), (0.4, -0.2)]
        hoops = m.VGroup(*[m.Ellipse(width=0.5, height=1.2, color=HIM, stroke_width=6).move_to([x, y, 0]) for x, y in hoop_xy])
        labels = m.VGroup(*[T(s, 30, HIM).next_to(h, m.DOWN, buff=0.1) for s, h in zip(["DISHES", "DATE", "HOOPS"], hoops)])
        goal = m.RoundedRectangle(width=2.8, height=1.2, corner_radius=0.15, color=GOLD).move_to([2.4, 0.6, 0])
        gl = T("REWARD", 32, GOLD).move_to(goal)
        runner = m.Dot(radius=0.24, color=HIM).move_to([-3.4, -2.3, 0])
        head = T("HIS SIDE", 44).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(head), m.FadeIn(hoops), m.FadeIn(labels), m.FadeIn(goal, gl), m.FadeIn(runner), run_time=0.8)
        for x, y in hoop_xy + [(2.4, 1.3)]:
            self.play(m.MoveAlongPath(runner, m.ArcBetweenPoints(runner.get_center(), np.array([x, y + 0.2, 0]), angle=-1.6)),
                      run_time=0.6)
        self.until(t0 + 6.6)
        chore = T("ANOTHER\nCHORE", 30, HER).move_to(goal)
        self.play(m.Transform(gl, chore), goal.animate.set_color(HER), run_time=0.6)

    def service(self, t0, t1):
        head = T("THE PHYSICS OF IT", 44, GOLD).to_edge(m.UP, buff=0.8)
        off = m.ValueTracker(np.pi)  # her phase offset: pi = out of phase, 0 = locked
        ph = m.ValueTracker(0.0)

        def wave(f, color, y, width=5):
            return m.FunctionGraph(f, x_range=[-3.0, 3.0], color=color, stroke_width=width).shift(m.UP * y)

        him = m.always_redraw(lambda: wave(lambda x: 0.45 * np.sin(3 * x - ph.get_value()), HIM, 2.2))
        her = m.always_redraw(lambda: wave(lambda x: 0.45 * np.sin(3 * x - ph.get_value() + off.get_value()), HER, 0.6))
        tot = m.always_redraw(lambda: wave(lambda x: 0.45 * (np.sin(3 * x - ph.get_value())
                                                             + np.sin(3 * x - ph.get_value() + off.get_value())),
                                           GOLD, -1.5, 7))
        lab_him = T("HIM", 30, HIM).move_to([-2.6, 3.0, 0])
        lab_her = T("HER", 30, HER).move_to([-2.6, 1.4, 0])
        lab_sum = T("WHAT EACH OF YOU RECEIVES", 28, GOLD).move_to([0, -0.3, 0])
        self.play(m.FadeIn(head), run_time=0.5)
        self.add(him, her, tot)
        self.play(m.FadeIn(lab_him, lab_her, lab_sum), ph.animate.set_value(3), run_time=1.5, rate_func=m.linear)
        self.play(ph.animate.set_value(3 + 2.5 * (t0 + 7.0 - self.time)), run_time=max(0.1, t0 + 7.0 - self.time),
                  rate_func=m.linear)
        oop = T("OUT OF PHASE", 40, HER).shift(m.DOWN * 3.2)
        self.play(m.FadeIn(oop), ph.animate.increment_value(1.5), run_time=0.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * (t0 + 11.1 - self.time)), run_time=max(0.1, t0 + 11.1 - self.time),
                  rate_func=m.linear)
        both = T("A CHORE FOR BOTH", 34, HER).next_to(oop, m.DOWN, buff=0.2)
        self.play(m.FadeIn(both), ph.animate.increment_value(1.5), run_time=0.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * (t0 + 12.4 - self.time)), run_time=max(0.1, t0 + 12.4 - self.time),
                  rate_func=m.linear)
        wait = T("EACH WAITS FOR THE\nOTHER TO GO FIRST", 32, INK).next_to(both, m.DOWN, buff=0.25)
        self.play(m.FadeIn(wait), ph.animate.increment_value(1.5), run_time=0.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * (t0 + 15.5 - self.time)), run_time=max(0.1, t0 + 15.5 - self.time),
                  rate_func=m.linear)
        dense = T("ARE WE DENSE?", 48, GOLD).move_to(oop)
        self.play(m.FadeOut(oop), m.FadeOut(both), m.FadeOut(wait), m.FadeIn(dense), ph.animate.increment_value(1.2),
                  run_time=0.5, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * (t0 + 17.0 - self.time)), run_time=max(0.1, t0 + 17.0 - self.time),
                  rate_func=m.linear)
        self.play(off.animate.set_value(0), ph.animate.increment_value(5), m.FadeOut(dense),
                  run_time=2.0, rate_func=m.smooth)
        locked = T("PHASE-LOCKED", 40, OK).shift(m.DOWN * 3.2)
        self.play(m.FadeIn(locked), ph.animate.increment_value(1.5), run_time=0.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * (t0 + 23.0 - self.time)), run_time=max(0.1, t0 + 23.0 - self.time),
                  rate_func=m.linear)
        adds = T("THE CHORE CANCELS OUT,\nTHE SIGNAL ADDS UP", 32, GOLD).next_to(locked, m.DOWN, buff=0.25)
        self.play(m.FadeIn(adds), ph.animate.increment_value(1.5), run_time=0.6, rate_func=m.linear)
        self.play(ph.animate.increment_value(2.5 * max(0.1, t1 - 0.5 - self.time)), run_time=max(0.1, t1 - 0.5 - self.time),
                  rate_func=m.linear)

    def spill(self, t0, t1):
        rings = m.VGroup(*[m.Circle(radius=0.6 + 0.6 * k, stroke_color=DIM, stroke_width=5) for k in range(4)]).shift(m.UP * 1.6)
        core = T("SEX", 30, INK).move_to(rings)
        out = T("EVERYTHING ELSE", 26, DIM).next_to(rings, m.DOWN, buff=0.2)
        self.play(m.Create(rings), m.FadeIn(core, out), run_time=0.8)
        self.play(m.LaggedStart(*[r.animate.set_stroke(OK) for r in rings], lag_ratio=0.35), run_time=1.6)
        self.until(t0 + 4.6)
        top = T("THE MOST PHYSICALLY INTIMATE\nTHING TWO PEOPLE CAN DO", 30, INK).to_edge(m.UP, buff=0.7)
        self.play(m.FadeIn(top))
        self.until(t0 + 8.6)
        q = T("CAN'T SHOW UP HERE?\nWHERE ARE THEY SHOWING UP?", 30, GOLD).shift(m.DOWN * 2.4)
        self.play(m.FadeIn(q))
        self.until(t0 + 13.3)
        mono = m.VGroup(T("MONOGAMY:", 30, DIM), T("YOU'RE THEIR ONLY\nETHICAL OUTLET", 36, GOLD)).arrange(m.DOWN, buff=0.1).move_to(q)
        self.play(m.FadeOut(q), m.FadeIn(mono), run_time=0.5)
        self.until(t0 + 17.5)
        aff = m.VGroup(T("PEOPLE SEEKING AFFAIRS:", 28, DIM), T("#1 MOTIVE = SEXUAL DISSATISFACTION", 30, HER)).arrange(m.DOWN, buff=0.1)
        aff.move_to(q)
        src = cite("Selterman, Joel & Dale (2023), Ashley\nMadison users, mostly married men", "https://doi.org/10.1007/s10508-023-02573-y")
        self.play(m.FadeOut(mono), m.FadeIn(aff), m.FadeIn(src), run_time=0.5)
        self.until(t0 + 23.6)
        div = m.VGroup(T("DIVORCE INTERVIEWS:", 28, DIM), T("#1 FINAL STRAW = INFIDELITY", 30, HER)).arrange(m.DOWN, buff=0.1)
        div.next_to(aff, m.DOWN, buff=0.35)
        src2 = cite("Scott et al. (2013), 52 divorced\nindividuals (small sample)", "https://doi.org/10.1037/a0032025")
        self.play(m.FadeIn(div), m.FadeOut(src), m.FadeIn(src2), run_time=0.5)
        self.until(t0 + 29.2)
        end = T("RELATIONSHIP-ENDING", 44, HER).next_to(div, m.DOWN, buff=0.4)
        self.play(m.LaggedStart(*[r.animate.set_stroke(HER) for r in rings], lag_ratio=0.25), m.FadeIn(end), run_time=1.4)

    def calibrate(self, t0, t1):
        head = T("IT RUNS ON COMMUNICATION", 38, GOLD).to_edge(m.UP, buff=1.0)
        self.play(m.FadeIn(head), run_time=0.5)
        self.until(t0 + 4.0)
        fake = m.VGroup(T("58.8%", 72, HER), T("of women have faked it at least once", 30, INK, "NORMAL")).arrange(m.DOWN, buff=0.15)
        fake.shift(m.UP * 1.2)
        src = cite("Herbenick et al. (2019)\nArchives of Sexual Behavior", "https://doi.org/10.1007/s10508-019-01493-0")
        self.play(m.FadeIn(fake), m.FadeIn(src), run_time=0.6)
        bad = T("EVERY FAKE TRAINS HIM WRONG", 32, HER).next_to(fake, m.DOWN, buff=0.4)
        self.play(m.FadeIn(bad))
        self.until(t0 + 9.2)
        self.play(m.FadeOut(fake), m.FadeOut(bad), m.FadeOut(src), run_time=0.3)
        pts = json.loads((Path(__file__).resolve().parent / "fwb_comm_orgasm_points.json").read_text())["points"]
        jit = np.random.default_rng(7)  # jitter only, so overlapping 1-9 ratings stay visible

        def to_xy(c, o):
            return [-2.6 + 5.2 * (c - 1) / 8 + jit.normal(0, 0.06), -1.0 + 3.2 * (o - 1) / 8 + jit.normal(0, 0.06), 0]

        dots = m.VGroup(*[m.Dot(to_xy(c, o), radius=0.06, color=OK, fill_opacity=0.8) for c, o in pts])
        cs = np.array([c for c, _ in pts]); os_ = np.array([o for _, o in pts])
        k, b0 = np.polyfit(cs, os_, 1)
        line = m.Line([-2.6, -1.0 + 3.2 * (k * 1 + b0 - 1) / 8, 0], [2.6, -1.0 + 3.2 * (k * 9 + b0 - 1) / 8, 0],
                      color=GOLD, stroke_width=5)
        xl = T("comfortable saying what she wants →", 28, DIM, "NORMAL").move_to([0, -1.6, 0])
        yl = T("finishes more often ↑", 28, DIM, "NORMAL").move_to([0, 2.7, 0])
        r = T("r = .41", 36, GOLD).move_to([0, 3.6, 0])
        src2 = cite("Women in FWB, re-analysis of\nosf.io/pazmy (n = 100)", "https://osf.io/pazmy")
        self.play(m.LaggedStart(*[m.FadeIn(d) for d in dots], lag_ratio=0.03), m.FadeIn(xl, yl, src2), run_time=1.2)
        self.play(m.Create(line), m.FadeIn(r), run_time=0.6)
        self.until(t0 + 16.1)
        cal = T("TELL THEM, SO THEY CAN CALIBRATE", 34, OK).shift(m.DOWN * 2.6)
        self.play(m.Write(cal), run_time=0.8)

    def sequence(self, t0, t1):
        head = T("SEQUENCE KILLS IT", 44, HER).to_edge(m.UP, buff=1.4)
        q = m.VGroup(*[m.VGroup(m.RoundedRectangle(width=4.6, height=0.9, corner_radius=0.15, color=DIM), T(s, 28, INK))
                       for s in ["FIX THE CHORES FIRST", "THEN THE BEDROOM", "THEN MAYBE…"]]).arrange(m.DOWN, buff=0.3)
        for row in q:
            row[1].move_to(row[0])
        wl = T("WAITING LIST", 30, DIM).next_to(q, m.UP, buff=0.3)
        self.play(m.FadeIn(head), m.FadeIn(wl), m.LaggedStart(*[m.FadeIn(r) for r in q], lag_ratio=0.4), run_time=1.6)
        self.until(t0 + 8.7)
        end = m.VGroup(T("AT THE SAME TIME,", 40, OK), T("OR IT RUNS OUT", 40, GOLD)).arrange(m.DOWN, buff=0.15).shift(m.DOWN * 3.0)
        self.play(m.FadeIn(end, shift=m.UP * 0.2))

    def timeline(self, t0, t1):
        head = T("SET A REAL TIMELINE", 44, GOLD).to_edge(m.UP, buff=1.4)
        bar = m.Line([-3.0, 0, 0], [3.0, 0, 0], color=DIM, stroke_width=6)
        tick = m.Line([1.8, -0.4, 0], [1.8, 0.4, 0], color=HER, stroke_width=8)
        dl = T("DEADLINE", 32, HER).next_to(tick, m.UP, buff=0.15)
        now = m.Dot([-3.0, 0, 0], radius=0.16, color=INK)
        self.play(m.FadeIn(head), m.Create(bar), m.FadeIn(tick, dl, now), run_time=0.8)
        self.play(now.animate.move_to([1.6, 0, 0]), run_time=4.0, rate_func=m.linear)
        self.until(t0 + 8.1)
        tail = T("GET BACK TO WANTING THEM,\nOR BE HONEST THAT YOU CAN'T", 32, INK).shift(m.DOWN * 2.6)
        self.play(m.FadeIn(tail))

    def forcing(self, t0, t1):
        lines = m.VGroup(T("FORCING IT", 46, HER), T("SHOWS.", 46, HER)).arrange(m.DOWN, buff=0.15).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(lines, shift=m.UP * 0.2))
        self.until(t0 + 6.2)
        study = m.VGroup(T("121 COUPLES · 21 DAYS", 34, DIM),
                         T("partners read each other's", 34, INK, "NORMAL"),
                         T("reasons for sex accurately", 34, INK, "NORMAL")).arrange(m.DOWN, buff=0.15).shift(m.UP * 0.9)
        src = cite("Elsaadawy et al. (2022)\nJ. Social & Personal Relationships", "https://doi.org/10.1177/02654075211051788")
        self.play(m.FadeIn(study), m.FadeIn(src), run_time=0.6)
        self.until(t0 + 13.1)
        both = T("“GET IT OVER WITH” SEX\nLOWERS SATISFACTION FOR BOTH", 30, HER).shift(m.DOWN * 0.9)
        src2 = cite("Muise, Impett & Desmarais (2013)\nPers. & Social Psych. Bulletin", "https://doi.org/10.1177/0146167213490963")
        self.play(m.FadeIn(both), m.FadeOut(src), m.FadeIn(src2), run_time=0.6)
        self.until(t0 + 17.2)
        tell = m.VGroup(T("MEN CAN TELL.", 48, GOLD), T("WOMEN CAN TOO.", 40, OK)).arrange(m.DOWN, buff=0.15).shift(m.DOWN * 2.3)
        self.play(m.Write(tell), run_time=0.8)

    def close(self, t0, t1):
        a = T("CATCH IT EARLY", 50, GOLD).shift(m.UP * 3.6)
        self.play(m.FadeIn(a, shift=m.UP * 0.2), run_time=0.5)
        self.until(t0 + 2.0)
        bar = m.Line([-3.0, 2.2, 0], [3.0, 2.2, 0], color=DIM, stroke_width=8)
        grace = m.Line([-3.0, 2.2, 0], [0.6, 2.2, 0], color=OK, stroke_width=12)
        res = m.Line([0.6, 2.2, 0], [3.0, 2.2, 0], color=HER, stroke_width=12)
        gl = T("GRACE PERIOD", 26, OK).move_to([-1.2, 2.7, 0])
        rl = T("RESENTMENT", 26, HER).move_to([1.8, 2.7, 0])
        self.play(m.Create(bar), m.Create(grace), m.FadeIn(gl), run_time=0.8)
        self.play(m.Create(res), m.FadeIn(rl), run_time=0.6)
        self.until(t0 + 5.1)
        talk = T("TALK ABOUT YOURS OUT LOUD", 32, INK).shift(m.UP * 1.2)
        self.play(m.FadeIn(talk))
        self.until(t0 + 6.9)
        restart = m.VGroup(T("FAILING?", 38, HER), T("RESTART IT TOGETHER", 40, OK)).arrange(m.DOWN, buff=0.1).shift(m.DOWN * 0.3)
        self.play(m.FadeIn(restart, shift=m.UP * 0.2), run_time=0.6)
        self.until(t0 + 9.2)
        him = m.Dot([-1.2, -2.0, 0], radius=0.3, color=HIM)
        her = m.Dot([1.2, -2.0, 0], radius=0.3, color=HER)
        both = T("NEW? START BOTH TOGETHER", 34, GOLD).shift(m.DOWN * 2.9)
        self.play(m.FadeIn(him, her), m.FadeIn(both), run_time=0.5)
        self.until(t0 + 13.3)
        alone = T("NOBODY CARRIES THE RISK ALONE", 30, INK).shift(m.DOWN * 3.6)
        self.play(him.animate.move_to([-0.35, -2.0, 0]), her.animate.move_to([0.35, -2.0, 0]), m.FadeIn(alone), run_time=0.8)

    def end_card(self):
        cards = m.VGroup()
        for label, url in [("SOURCES", SOURCES), ("THE BOOK", BOOK)]:
            cards.add(m.VGroup(qr(url, side=2.6), T(label, 34, GOLD)).arrange(m.DOWN, buff=0.3))
        cards.arrange(m.DOWN, buff=0.8)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        self.play(m.FadeIn(cards), m.FadeIn(foot), run_time=0.5)
        self.wait(1.5)
