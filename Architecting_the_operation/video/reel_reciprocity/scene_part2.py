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
        beats = [self.pickup, self.dishes, self.data, self.valid, self.his_side, self.two_chores,
                 self.service, self.calibrate, self.sequence, self.timeline, self.forcing, self.close]
        for i, beat in enumerate(beats):
            self.until(BEATS[i])
            beat(BEATS[i], BEATS[i + 1] if i + 1 < len(BEATS) else END)
            self.until((BEATS[i + 1] if i + 1 < len(BEATS) else END) - 0.4)
            self.clear_all()
        self.end_card()

    def pickup(self, t0, t1):
        tag = T("PART 2", 34, DIM).to_edge(m.UP, buff=1.4)
        line = m.VGroup(T("TAKE SEX OFF", 54), T("THE CHORE CHART", 54, GOLD)).arrange(m.DOWN, buff=0.2)
        self.play(m.FadeIn(tag), m.FadeIn(line, shift=m.UP * 0.2), run_time=0.8)
        self.until(t0 + 4.6)
        reply = m.VGroup(T("FOR A LOT OF WOMEN,", 40), T("IT ALREADY IS A CHORE", 40, HER)).arrange(m.DOWN, buff=0.2)
        reply.shift(m.DOWN * 2.8)
        self.play(m.FadeIn(reply, shift=m.UP * 0.2))

    def dishes(self, t0, t1):
        plates = m.VGroup(*[m.Ellipse(width=2.6, height=0.6, color=INK, stroke_width=5).move_to([0, 0.2 + 0.32 * k, 0])
                            for k in range(6)])
        sink = m.RoundedRectangle(width=3.4, height=1.4, corner_radius=0.2, color=DIM).move_to([0, -0.4, 0])
        plates = m.VGroup(sink, plates)
        q = T("NOBODY WASHES DISHES FOR FUN", 34, DIM).to_edge(m.UP, buff=1.6)
        self.play(m.LaggedStart(*[m.FadeIn(p) for p in plates], lag_ratio=0.2), m.FadeIn(q), run_time=1.2)
        self.until(t0 + 7.2)
        a = T("“AT LEAST THIS ONE FEELS GOOD”", 36, GOLD).shift(m.DOWN * 2.6)
        self.play(m.Write(a), run_time=1.0)

    def data(self, t0, t1):
        head = T("IF IT DOESN'T PLEASE HER, IT'S LABOR", 32, HER).to_edge(m.UP, buff=1.4)
        self.until(t0 + 3.1)
        self.play(m.FadeIn(head))
        self.until(t0 + 10.3)
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

    def valid(self, t0, t1):
        items = ["DISHES", "LAUNDRY", "KIDS", "SCHEDULE", "SEX"]
        rows = m.VGroup(*[T(s, 36, HER if s == "SEX" else INK) for s in items]).arrange(m.DOWN, buff=0.35, aligned_edge=m.LEFT)
        boxes = m.VGroup(*[m.Square(0.45, color=DIM).next_to(r, m.LEFT, buff=0.3) for r in rows])
        g = m.VGroup(boxes, rows).move_to(m.UP * 0.6)
        head = T("THAT'S VALID", 44, OK).to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(head), m.FadeIn(g), run_time=0.8)
        checks = [m.Line(b.get_corner(m.DL) + m.UR * 0.1, b.get_corner(m.UR) + m.DL * 0.1, color=OK, stroke_width=6)
                  for b in boxes[:4]]
        self.play(m.LaggedStart(*[m.Create(c) for c in checks], lag_ratio=0.3), run_time=1.4)
        self.until(t0 + 4.0)
        lighter = T("A LIGHTER LOAD MAKES\nTHIS ONE LIGHTER", 34, OK).shift(m.DOWN * 3.2)
        self.play(m.FadeIn(lighter))

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
        self.until(t0 + 6.0)
        chore = T("ANOTHER\nCHORE", 30, HER).move_to(goal)
        self.play(m.Transform(gl, chore), goal.animate.set_color(HER), run_time=0.6)
        self.until(t0 + 10.0)
        dense = T("ARE WE DENSE?", 52, GOLD).shift(m.DOWN * 3.4)
        self.play(m.Write(dense), run_time=0.6)

    def two_chores(self, t0, t1):
        bed = m.RoundedRectangle(width=6.2, height=2.6, corner_radius=0.3, color=DIM).shift(m.DOWN * 0.2)
        cards = m.VGroup(*[m.VGroup(m.RoundedRectangle(width=2.4, height=1.2, corner_radius=0.15, color=c),
                                    T("CLOCKED IN", 26, c)) for c in (HIM, HER)]).arrange(m.RIGHT, buff=0.8).move_to(bed)
        for cd in cards:
            cd[1].move_to(cd[0])
        head = T("TWO CHORES, ONE BED", 44, HER).to_edge(m.UP, buff=1.6)
        self.play(m.Create(bed), m.FadeIn(head), run_time=0.8)
        self.play(m.LaggedStart(*[m.FadeIn(cd, shift=m.DOWN * 0.3) for cd in cards], lag_ratio=0.5), run_time=1.2)

    def service(self, t0, t1):
        head = T("BOTH SERVE, AT THE SAME TIME", 38, OK).to_edge(m.UP, buff=1.4)
        a = m.Dot([-2.4, 0.4, 0], radius=0.35, color=HIM)
        b = m.Dot([2.4, 0.4, 0], radius=0.35, color=HER)
        top = m.CurvedArrow([-2.0, 0.9, 0], [2.0, 0.9, 0], angle=-0.8, color=HIM)
        bot = m.CurvedArrow([2.0, -0.1, 0], [-2.0, -0.1, 0], angle=-0.8, color=HER)
        self.play(m.FadeIn(head), m.FadeIn(a, b), run_time=0.6)
        self.play(m.Create(top), m.Create(bot), run_time=1.2)
        self.until(t0 + 7.7)
        cancel = T("THE LABOR CANCELS OUT", 40, GOLD).shift(m.DOWN * 2.0)
        self.play(m.Write(cancel), run_time=0.8)
        self.until(t0 + 16.0)
        ph = m.ValueTracker(0.0)
        wave1 = m.always_redraw(lambda: m.FunctionGraph(lambda x: 0.3 * np.sin(3 * x - ph.get_value()),
                                                        x_range=[-2.4, 2.4], color=HIM).shift(m.DOWN * 3.4))
        wave2 = m.always_redraw(lambda: m.FunctionGraph(lambda x: 0.3 * np.sin(3 * x - ph.get_value()),
                                                        x_range=[-2.4, 2.4], color=HER).shift(m.DOWN * 3.45))
        lock = T("PHASE-LOCKED", 30, DIM).shift(m.DOWN * 4.3)
        self.add(wave1, wave2)
        self.play(ph.animate.set_value(10), m.FadeIn(lock), run_time=max(1.0, t1 - 0.6 - self.time), rate_func=m.linear)

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
        self.until(t0 + 10.6)
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
        self.until(t0 + 12.3)
        tail = T("FOREVER-MOVING GOALPOSTS\nARE EXTRACTION TOO", 32, HER).shift(m.DOWN * 2.6)
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
        a = T("CATCH IT EARLY", 50, GOLD).shift(m.UP * 3.4)
        self.play(m.FadeIn(a, shift=m.UP * 0.2))
        self.until(t0 + 3.2)
        b = T("PAST RESENTMENT: PART FAIRLY", 34, DIM).shift(m.UP * 2.2)
        self.play(m.FadeIn(b))
        self.until(t0 + 8.3)
        c = m.VGroup(T("RECIPROCITY", 56, OK), T("FROM DAY ONE", 56, OK)).arrange(m.DOWN, buff=0.15).shift(m.UP * 0.2)
        self.play(m.Write(c), run_time=0.9)
        self.until(t0 + 10.8)
        him = m.Dot([-1.2, -2.0, 0], radius=0.3, color=HIM)
        her = m.Dot([1.2, -2.0, 0], radius=0.3, color=HER)
        both = T("START BOTH TOGETHER", 36, GOLD).shift(m.DOWN * 3.0)
        self.play(m.FadeIn(him, her), m.FadeIn(both), run_time=0.5)
        self.until(t0 + 13.0)
        alone = T("NOBODY CARRIES THE RISK ALONE", 32, INK).shift(m.DOWN * 3.7)
        self.play(him.animate.move_to([-0.35, -2.0, 0]), her.animate.move_to([0.35, -2.0, 0]), m.FadeIn(alone), run_time=0.8)

    def end_card(self):
        cards = m.VGroup()
        for label, url in [("SOURCES", SOURCES), ("THE BOOK", BOOK)]:
            cards.add(m.VGroup(qr(url, side=2.6), T(label, 34, GOLD)).arrange(m.DOWN, buff=0.3))
        cards.arrange(m.DOWN, buff=0.8)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        self.play(m.FadeIn(cards), m.FadeIn(foot), run_time=0.5)
        self.wait(1.8)
