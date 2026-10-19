"""Faceless rebuttal reel. Vertical, voiced, manimgx.

Turns in Architecting_the_operation/podcasts/REEL_left_binary.md are the beat
clock. Render the voice first, then this scene.

    .venv-voice/bin/scriptcast \\
        --transcript Architecting_the_operation/podcasts/REEL_left_binary.md \\
        --episode-id REEL_left_binary --out-dir ./outputs --overwrite --skip-als
    .venv-manimgx/bin/manimgx render \\
        Architecting_the_operation/video/reel_left_binary/scene.py Reel \\
        -r 1080x1920 --fps 30 \\
        -o outputs/REEL_left_binary/reel_vfr.mp4
"""

import json
from pathlib import Path

import manimgx as m

ROOT = Path(__file__).resolve().parents[3]
EP = ROOT / "outputs" / "REEL_left_binary"

INK = "#F2EEE6"
DIM = "#8A867F"
GOLD = "#E9C46A"
HER = "#E07A5F"
OK = "#81B29A"
BG = "#121212"
PAPER = "#F2EFE8"
NIGHT = "#2E2E34"
ELITE = "#E6C26B"
PUPPET = "#9E7850"
FORCE = "#668099"
DARK = "#141414"


def T(s, size=40, color=INK, weight="BOLD", width=7.0):
    t = m.Text(s, font="Noto Sans", font_size=max(size, 28), color=color, weight=weight)
    if t.width > width:
        t.scale_to_fit_width(width)
    return t


def chip(word, fill, ink, w=3.15, h=1.35):
    box = m.Rectangle(width=w, height=h, fill_color=fill, fill_opacity=1, stroke_width=0)
    lab = T(word, 36, ink, width=w - 0.35)
    lab.move_to(box)
    return m.VGroup(box, lab)


def band(name, w, fill, ink):
    bar = m.Rectangle(width=w, height=0.86, fill_color=fill, fill_opacity=1, stroke_width=0)
    lab = T(name, 36, ink, width=w - 0.3)
    lab.move_to(bar)
    return m.VGroup(bar, lab)


class Reel(m.Scene):
    def until(self, t):
        if t > self.time:
            self.wait(t - self.time)

    def clear_all(self, rt=0.35):
        if self.mobjects:
            self.play(*[m.FadeOut(x) for x in list(self.mobjects)], run_time=rt)

    def construct(self):
        turns = json.loads((EP / "episode_manifest.json").read_text())["turns"]
        self.B = [t["start_ms"] / 1000 for t in turns]
        self.END = turns[-1]["end_ms"] / 1000 + 0.8
        self.camera.background_color = BG
        audio = EP / "REEL_left_binary.mp3"
        if audio.exists():
            self.add_sound(str(audio))
        self.clip()
        self.binary()
        self.institution()
        self.lens()
        self.architecture()
        self.correction()

    def clip(self):
        kicker = T("THE CLIP", 30, GOLD).move_to(m.UP * 4.6)
        block = m.VGroup(
            T("The American left", 52),
            T("dehumanizes whoever", 44),
            T("it ranks as oppressor.", 44),
        ).arrange(m.DOWN, buff=0.28)
        foot = T("Left against right. America as the frame.", 30, DIM, "NORMAL")
        foot.next_to(block, m.DOWN, buff=0.9)
        self.play(m.FadeIn(kicker), m.Write(block), run_time=1.4)
        self.play(m.FadeIn(foot), run_time=0.4)
        self.until(self.B[1] - 0.4)
        self.clear_all()

    def binary(self):
        self.until(self.B[1])
        head = T("LEFT AND RIGHT", 40).to_edge(m.UP, buff=2.4)
        left = chip("LEFT", PAPER, DARK)
        right = chip("RIGHT", NIGHT, PAPER)
        pair = m.VGroup(left, right).arrange(m.RIGHT, buff=0.28)
        pair.next_to(head, m.DOWN, buff=1.1)
        self.play(m.FadeIn(head), m.FadeIn(left, shift=m.LEFT * 0.25), m.FadeIn(right, shift=m.RIGHT * 0.25), run_time=0.7)
        merged = chip("ONE PROJECTION", GOLD, DARK, w=6.6, h=1.35)
        merged.move_to(pair)
        cap = T("America is the country inside it.", 32, DIM, "NORMAL")
        cap.next_to(pair, m.DOWN, buff=0.9)
        self.until(self.B[2] - 0.1)
        self.play(m.FadeOut(pair), m.FadeIn(merged), m.FadeIn(cap), run_time=0.7)
        self.until(self.B[3] - 0.4)
        self.clear_all()

    def institution(self):
        self.until(self.B[3])
        def row(k, head, body):
            key = T(k, 32, GOLD, width=1.15)
            text = m.VGroup(
                T(head, 30, DIM, "NORMAL", width=5.6),
                T(body, 42, width=5.6),
            ).arrange(m.DOWN, buff=0.06, aligned_edge=m.LEFT)
            return m.VGroup(key, text).arrange(m.RIGHT, buff=0.35, aligned_edge=m.UP)

        title = T("THE WORD HE USES", 36, GOLD)
        rows = m.VGroup(
            row("01", "THE WORD", "the left"),
            row("02", "THE INSTITUTION", "Democratic Party"),
            row("03", "THE ANALYSIS", "the Elite"),
        ).arrange(m.DOWN, buff=0.5, aligned_edge=m.LEFT)
        note = T("Democrats administer the order.", 32, DIM, "NORMAL")
        named = T("A leftist names the Elite.", 36, GOLD)
        block = m.VGroup(title, rows, note, named).arrange(m.DOWN, buff=0.48)
        block.center()
        self.play(m.FadeIn(title), run_time=0.3)
        self.play(m.FadeIn(rows[0]), run_time=0.45)
        self.until(self.B[4] - 0.05)
        self.play(m.FadeIn(rows[1]), m.FadeIn(note), run_time=0.5)
        self.until(self.B[5] - 0.05)
        self.play(m.FadeIn(rows[2]), m.FadeIn(named), run_time=0.5)
        self.until(self.B[6] - 0.4)
        self.clear_all()

    def lens(self):
        self.until(self.B[6])
        kicker = T("HE IS RIGHT ABOUT THE LENS", 36, GOLD)
        top = T("OPPRESSOR", 48, HER)
        bot = T("OPPRESSED", 48)
        axis = m.Arrow(m.UP * 0.05, m.DOWN * 0.95, color=DIM, buff=0, stroke_width=7)
        pair = m.VGroup(top, axis, bot).arrange(m.DOWN, buff=0.22)
        name = T("ORTHOGRAPHIC ILLUSION", 40, GOLD)
        sub = T("Five tiers. One line of sight.", 32, DIM, "NORMAL")
        block = m.VGroup(kicker, pair, name, sub).arrange(m.DOWN, buff=0.5)
        block.center()
        self.play(m.FadeIn(kicker), m.FadeIn(pair), run_time=0.7)
        self.until(self.B[7] - 0.05)
        self.play(m.Write(name), m.FadeIn(sub), run_time=0.8)
        self.until(self.B[8] - 0.4)
        self.clear_all()

    def architecture(self):
        self.until(self.B[8])
        specs = [
            ("ELITE", 2.15, ELITE, DARK),
            ("PUPPET", 3.15, PUPPET, PAPER),
            ("ENFORCEMENT", 4.15, FORCE, PAPER),
            ("BUFFER", 5.25, PAPER, DARK),
            ("OUT-GROUP", 6.35, NIGHT, PAPER),
        ]
        stack = m.VGroup(*[band(*s) for s in specs]).arrange(m.DOWN, buff=0.14)
        stack.move_to(m.DOWN * 0.15)
        eli, pup, enf, buf, out = stack
        upper = [eli, pup, enf]
        homes = [u.get_center().copy() for u in upper]

        title = T("FIVE TIERS", 40).move_to(m.UP * 5.55)
        sub = T("Seen from the side.", 30, DIM, "NORMAL").next_to(title, m.DOWN, buff=0.22)
        self.play(m.FadeIn(title), m.FadeIn(sub), m.FadeIn(stack, shift=m.UP * 0.2), run_time=0.8)

        self.until(self.B[9] - 0.15)
        ceiling = T("IN-GROUP", 36, DARK, width=4.6).move_to(buf)
        self.play(
            *[u.animate.move_to(buf.get_center()).set_opacity(0) for u in upper],
            buf[1].animate.set_opacity(0),
            m.FadeIn(ceiling),
            m.FadeOut(title),
            m.FadeOut(sub),
            run_time=1.5,
        )
        title = T("THE VIEW FROM BELOW", 38, GOLD).move_to(m.UP * 5.55)
        sub = T("The Buffer is the ceiling.", 30, DIM, "NORMAL").next_to(title, m.DOWN, buff=0.22)
        two = T("Society reads as two groups.", 32).move_to(m.DOWN * 5.7)
        self.play(m.FadeIn(title), m.FadeIn(sub), m.FadeIn(two), run_time=0.45)

        self.until(self.B[10] - 0.15)
        self.play(
            *[u.animate.move_to(h).set_opacity(1) for u, h in zip(upper, homes)],
            buf[1].animate.set_opacity(1),
            m.FadeOut(ceiling),
            m.FadeOut(title),
            m.FadeOut(sub),
            m.FadeOut(two),
            run_time=1.4,
        )
        title = T("CHANGE THE ANGLE", 40, GOLD).move_to(m.UP * 5.55)
        sub = T("The Elite returns to view.", 30, DIM, "NORMAL").next_to(title, m.DOWN, buff=0.22)
        self.play(m.FadeIn(title), m.FadeIn(sub), run_time=0.4)

        self.until(self.B[11] - 0.1)
        yb = buf.get_center()[1]
        attack = m.Arrow([-3.85, yb, 0], [-2.72, yb, 0], color=HER, buff=0, stroke_width=10)
        self.play(
            m.FadeOut(title),
            m.FadeOut(sub),
            m.GrowArrow(attack),
            run_time=0.6,
        )
        title = T("WHITENESS NAMES THE SYSTEM", 34).move_to(m.UP * 5.55)
        sub = T("The attack lands on the Buffer.", 30, HER, "NORMAL").next_to(title, m.DOWN, buff=0.22)
        self.play(m.FadeIn(title), m.FadeIn(sub), run_time=0.4)
        self.until(self.B[12] - 0.05)
        hold = T("The Elite is majority white.", 32, DIM, "NORMAL").move_to(m.DOWN * 5.35)
        hold2 = T("The position stays behind the ceiling.", 30, GOLD).next_to(hold, m.DOWN, buff=0.28)
        self.play(m.FadeIn(hold), run_time=0.35)
        self.until(self.B[13] - 0.05)
        self.play(m.FadeIn(hold2), run_time=0.35)

        self.until(self.B[14] - 0.1)
        ye = eli.get_center()[1]
        yo = out.get_center()[1]
        path = m.Arrow([3.55, yo, 0], [3.55, ye, 0], color=OK, buff=0.08, stroke_width=9)
        self.play(
            m.FadeOut(attack),
            m.FadeOut(title),
            m.FadeOut(sub),
            m.FadeOut(hold),
            m.FadeOut(hold2),
            m.GrowArrow(path),
            run_time=0.7,
        )
        title = T("SOLIDARITY CROSSES", 38, OK).move_to(m.UP * 5.7)
        sub = T("the Buffer.", 38, OK).next_to(title, m.DOWN, buff=0.12)
        pay = T("The allocation pays them to hold the line.", 30, DIM, "NORMAL")
        pay.move_to(m.DOWN * 5.7)
        self.play(m.FadeIn(title), m.FadeIn(sub), m.FadeIn(pay), run_time=0.45)
        self.until(self.B[15] - 0.4)
        self.clear_all()

    def correction(self):
        self.until(self.B[15])
        kicker = T("THE CORRECTION", 30, GOLD).move_to(m.UP * 3.2)
        a = T("NAME THE ELITE", 52)
        b = T("KEEP THE BUFFER", 52, OK)
        block = m.VGroup(a, b).arrange(m.DOWN, buff=0.35)
        block.next_to(kicker, m.DOWN, buff=0.7)
        src = T("The Original Power", 30, DIM, "NORMAL").move_to(m.DOWN * 4.6)
        rule = m.Line(m.LEFT * 1.4, m.RIGHT * 1.4, stroke_color=GOLD, stroke_width=2)
        rule.next_to(src, m.DOWN, buff=0.28).set_opacity(0)
        self.play(m.FadeIn(kicker), m.FadeIn(block), m.FadeIn(src), run_time=0.45)
        self.play(rule.animate.set_opacity(1), run_time=max(1.5, self.END - self.time), rate_func=m.linear)
