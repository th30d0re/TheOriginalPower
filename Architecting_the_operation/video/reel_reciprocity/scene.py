"""Faceless reel: "Do You Think Men Are Stupid?" (reciprocity reply).

Each beat is pinned to its voiceover turn's start time from
outputs/REEL_reciprocity/episode_manifest.json, so a re-render that shifts
turns only needs BEATS updated.

Render (vertical 1080x1920):
    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/reel_reciprocity/scene.py \
        Reel -r 1080x1920 --fps 30 -o outputs/REEL_reciprocity/reel.mp4
"""

import json
from pathlib import Path

import numpy as np

import manimgx as m

ROOT = Path(__file__).resolve().parents[3]
AUDIO = ROOT / "outputs/REEL_reciprocity/REEL_reciprocity.mp3"

# Turn start times (s), read from the voiceover manifest.
_turns = json.loads((ROOT / "outputs/REEL_reciprocity/episode_manifest.json").read_text())["turns"]
BEATS = [t["start_ms"] / 1000 for t in _turns]
END = _turns[-1]["end_ms"] / 1000 + 0.5

INK = "#F2EEE6"
DIM = "#8A867F"
HIM = "#5FA8D3"
HER = "#E07A5F"
GOLD = "#E9C46A"
OK = "#81B29A"
BG = "#121212"

W = 3.6  # usable half-width in a 9:16 frame


def T(s, size=40, color=INK, weight="BOLD", width=2 * W):
    t = m.Text(s, font="Noto Sans", font_size=max(size, 28), color=color, weight=weight)
    if t.width > width:
        t.scale_to_fit_width(width)
    return t


def qr(url, side=1.5):
    """A scannable QR code on a white plate, drawn from segno's module matrix."""
    import segno

    rows = [list(r) for r in segno.make(url, error="m").matrix]
    n = len(rows) + 4  # two-module quiet zone each side
    u = side / n
    code = m.VGroup()
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            if row[x]:
                run = x
                while run < len(row) and row[run]:
                    run += 1
                code.add(m.Rectangle(width=u * (run - x), height=u, fill_color="#000000", fill_opacity=1,
                                     stroke_width=0).move_to([(x + 2 + (run - x) / 2) * u, -(y + 2.5) * u, 0]))
                x = run
            else:
                x += 1
    plate = m.Rectangle(width=side, height=side, fill_color="#FFFFFF", fill_opacity=1, stroke_width=0)
    plate.move_to([side / 2, -side / 2, 0])
    return m.VGroup(plate, code)


def cite(s, url):
    text = T(s, size=28, color=DIM, weight="NORMAL", width=2 * W - 2.0)
    code = qr(url)
    g = m.VGroup(text, code).arrange(m.RIGHT, buff=0.35)
    return g.to_edge(m.DOWN, buff=0.7)


class Reel(m.Scene):
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
        plan = [(0, self.hook), (1, self.history), (2, self.lanes), (3, self.double_dip), (5, self.prize),
                (6, self.loop), (7, self.chores), (8, self.personal), (9, self.trickle), (10, self.core),
                (11, self.christian), (12, self.close)]
        for i, beat in plan:
            self.until(BEATS[i])
            beat()
        self.until(END)
        self.end_card()

    # 0 ── hook. Instagram overlays the linked comment sticker in the top half, so leave it clear.
    def hook(self):
        point = m.Arrow(m.DOWN * 0.2, m.UP * 1.3, color=GOLD, buff=0, stroke_width=8)
        note = T("SHE SAID THIS", 30, GOLD).next_to(point, m.DOWN, buff=0.2)
        part = T("PART 1 OF 2", 30, DIM).to_edge(m.DOWN, buff=0.9)
        self.play(m.GrowArrow(point), m.FadeIn(note), m.FadeIn(part), run_time=0.6)
        self.play(point.animate.shift(m.UP * 0.25), rate_func=m.there_and_back, run_time=0.8)
        self.until(5.2)
        q = m.VGroup(T("DO YOU THINK", 60), T("MEN ARE", 60), T("STUPID?", 72, HER)).arrange(m.DOWN, buff=0.2)
        q.shift(m.DOWN * 2.6)
        self.play(m.Write(q), run_time=1.2)
        self.until(BEATS[1] - 0.4)
        self.clear_all()

    # 1 ── the old script, then the flip
    def history(self):
        t0 = BEATS[1]
        P = m.UP * 0.3
        post = m.Line(m.DOWN * 2.2, P, stroke_color=DIM, stroke_width=6)
        hub = m.Dot(P, radius=0.14, color=INK)
        base = m.Line(m.LEFT * 1.2 + m.DOWN * 2.2, m.RIGHT * 1.2 + m.DOWN * 2.2, stroke_color=DIM, stroke_width=6)
        beam = m.VGroup(
            m.Line(P + m.LEFT * 3, P + m.RIGHT * 3, stroke_color=INK, stroke_width=8),
            m.Square(1.1, fill_color=HIM, fill_opacity=1, stroke_width=0).move_to(P + m.LEFT * 2.45 + m.DOWN * 0.55),
            m.Square(1.1, fill_color=HER, fill_opacity=1, stroke_width=0).move_to(P + m.RIGHT * 2.45 + m.DOWN * 0.55),
        )
        lbl_him = T("HIM", 30, BG).move_to(beam[1])
        lbl_her = T("HER", 30, BG).move_to(beam[2])
        beam.add(lbl_him, lbl_her)
        title = T("THE OLD MARRIAGE SCRIPT", 40).to_edge(m.UP, buff=1.6)
        self.play(m.FadeIn(post, base, beam), m.Write(title), run_time=1.0)
        self.add(hub)
        self.play(m.Rotate(beam, angle=0.32, about_point=P), run_time=1.2)
        sub = T("centered him · called it mutual", 30, DIM, "NORMAL").next_to(title, m.DOWN)
        self.play(m.FadeIn(sub))
        self.until(t0 + 8.5)
        title2 = T("THE CORRECTION", 40, HER).move_to(title)
        sub2 = T("flipped who extracts", 30, DIM, "NORMAL").move_to(sub)
        self.play(m.Rotate(beam, angle=-0.64, about_point=P),
                  m.Transform(title, title2), m.Transform(sub, sub2), run_time=1.6)
        self.until(t0 + 13.0)
        verdict = T("A RERUN", 50, GOLD).shift(m.DOWN * 4.2)
        self.play(m.Write(verdict), run_time=1.0)
        self.until(BEATS[2] - 0.4)
        self.clear_all()

    # 2 ── two lanes, same shape
    def lanes(self):
        t0 = BEATS[2]

        def lane(left, right, color, y):
            ta = T(left, 30, color, width=2.4)
            tb = T(right, 30, color, width=2.4)
            a = m.SurroundingRectangle(ta, buff=0.25, corner_radius=0.2, color=color).move_to([-2.15, y, 0])
            b = m.SurroundingRectangle(tb, buff=0.25, corner_radius=0.2, color=color).move_to([2.15, y, 0])
            ta.move_to(a); tb.move_to(b)
            ar = m.Arrow(a.get_right(), b.get_left(), buff=0.08, color=color, max_tip_length_to_length_ratio=0.35)
            return m.VGroup(a, ta, ar, b, tb)

        h1 = T("SEX WORK", 34, DIM).move_to([0, 4.6, 0])
        l1 = lane("$ PAYMENT", "SEX CENTERED\nON PAYER", HIM, 3.3)
        self.play(m.FadeIn(h1), m.LaggedStart(*[m.FadeIn(x) for x in l1], lag_ratio=0.25), run_time=2.0)
        self.until(t0 + 7.0)
        h2 = T("THE COMMENT", 34, DIM).move_to([0, 1.0, 0])
        l2 = lane("CHORES\nDATES\nEFFORT", "ACCESS", HER, -0.3)
        self.play(m.FadeIn(h2), m.LaggedStart(*[m.FadeIn(x) for x in l2], lag_ratio=0.25), run_time=2.0)
        self.until(t0 + 11.0)
        same = T("SAME STRUCTURE", 46, GOLD).move_to([0, -2.3, 0])
        self.play(m.Indicate(l1, color=GOLD), m.Indicate(l2, color=GOLD), m.Write(same), run_time=1.4)
        self.until(t0 + 13.0)
        final = T("SOFT-CORE SEX WORK\nINSIDE A RELATIONSHIP", 40, HER).move_to([0, -3.9, 0])
        self.play(m.FadeIn(final, shift=m.UP * 0.2))
        self.until(BEATS[3] - 0.4)
        self.clear_all()

    # 3 ── double dip meters
    def double_dip(self):
        lead = m.VGroup(T("AND THEN…", 44, DIM), T("SHE EXPECTS THE BEDROOM", 40), T("TO CENTER HER, AND ONLY HER", 40, HER))
        lead.arrange(m.DOWN, buff=0.2)
        self.play(m.FadeIn(lead[0]), run_time=0.4)
        self.wait(0.6)
        self.play(m.FadeIn(lead[1:], shift=m.UP * 0.2), run_time=0.6)
        self.until(BEATS[4] - 0.3)
        self.play(m.FadeOut(lead), run_time=0.3)
        t0 = BEATS[4]
        names = ["NON-SEXUAL\nCOMPENSATION", "SEXUAL\nCOMPENSATION"]
        meters = m.VGroup()
        fills = []
        for k, name in enumerate(names):
            x = -1.6 + 3.2 * k
            frame = m.Rectangle(width=1.4, height=4.0, stroke_color=DIM).move_to([x, 0.6, 0])
            fill = m.Rectangle(width=1.4, height=0.01, fill_color=HER, fill_opacity=1, stroke_width=0)
            fill.align_to(frame, m.DOWN).set_x(x)
            lab = T(name, 24, INK).next_to(frame, m.DOWN, buff=0.25)
            meters.add(frame, lab)
            fills.append((fill, frame))
        title = T("THE DOUBLE DIP", 54, GOLD).to_edge(m.UP, buff=1.6)
        self.play(m.Write(title), m.FadeIn(meters), *[m.FadeIn(f) for f, _ in fills], run_time=1.0)
        for f, frame in fills:
            target = m.Rectangle(width=1.4, height=3.9, fill_color=HER, fill_opacity=1, stroke_width=0)
            target.align_to(frame, m.DOWN).set_x(frame.get_x())
            self.play(m.Transform(f, target), run_time=1.6)
        who = T("BOTH FILL FOR HER", 32, HER).shift(m.DOWN * 2.9)
        self.play(m.FadeIn(who))
        self.until(t0 + 7.5)
        pick = m.VGroup(T("CHARGE → HE'S THE CLIENT", 32, HIM),
                        T("WANT SERVICE → SERVE BACK", 32, OK),
                        T("PICK ONE.", 52, GOLD)).arrange(m.DOWN, buff=0.25).shift(m.DOWN * 4.3)
        self.play(m.LaggedStart(*[m.FadeIn(p) for p in pick], lag_ratio=0.6), run_time=3.0)
        self.until(BEATS[5] - 0.4)
        self.clear_all()

    # 4 ── the prize becomes a work order
    def prize(self):
        t0 = BEATS[5]
        podium = m.Rectangle(width=2.0, height=1.0, fill_color="#2A2A2A", fill_opacity=1, stroke_color=DIM).move_to([2.3, -0.4, 0])
        star = m.Star(n=5, outer_radius=1.0, fill_color=GOLD, fill_opacity=1, stroke_width=0).next_to(podium, m.UP, buff=0.15)
        lab = T("THE PRIZE", 40, GOLD).to_edge(m.UP, buff=1.8)
        hoop_xy = [(-2.4, -3.0), (-1.0, -2.3), (0.4, -1.6)]
        hoops = m.VGroup()
        for (x, y), name in zip(hoop_xy, ["CHORES", "DATES", "EFFORT"]):
            hoops.add(m.VGroup(m.Ellipse(width=0.5, height=1.2, color=HER, stroke_width=6).move_to([x, y, 0]),
                               T(name, 28, HER).move_to([x, y - 1.0, 0])))
        runner = m.Dot(radius=0.24, color=HIM).move_to([-3.6, -3.4, 0])
        self.play(m.FadeIn(podium), m.GrowFromCenter(star), m.Write(lab),
                  m.LaggedStart(*[m.FadeIn(h) for h in hoops], lag_ratio=0.3), m.FadeIn(runner), run_time=1.2)
        stops = [[x, y, 0] for x, y in hoop_xy] + [list(podium.get_top() + m.UP * 0.25)]
        for k, (x, y, _) in enumerate(stops):
            dest = np.array([x, y, 0]) + m.UP * 0.25
            hop = m.ArcBetweenPoints(runner.get_center(), dest, angle=-1.6)
            self.play(m.MoveAlongPath(runner, hop), run_time=0.75)
            if k < 3:
                self.play(m.Indicate(hoops[k][0], color=GOLD), run_time=0.35)
        self.until(t0 + 5.0)
        order = m.VGroup(
            m.Rectangle(width=2.6, height=3.0, fill_color=INK, fill_opacity=1, stroke_width=0),
        )
        lines = m.VGroup(*[m.Line(m.LEFT * 0.9, m.RIGHT * 0.9, stroke_color=DIM) for _ in range(4)])
        lines.arrange(m.DOWN, buff=0.35)
        order.add(lines.move_to(order[0]))
        order.move_to(star).shift(m.UP * 0.4)
        lab2 = T("WORK ORDER: SECOND SHIFT", 40, HER).move_to(lab)
        self.play(m.ReplacementTransform(star, order), m.Transform(lab, lab2),
                  m.FadeOut(hoops), m.FadeOut(runner), run_time=1.4)
        self.until(t0 + 8.5)
        tag = T("SET YOURSELF UP AS HIS PRIZE,\nHE'LL TREAT YOU LIKE HIS PRIZE", 32, INK).shift(m.DOWN * 4.0)
        self.play(m.FadeIn(tag, shift=m.UP * 0.2))
        self.until(BEATS[6] - 0.4)
        self.clear_all()

    # 5 ── the loop, then the data
    def loop(self):
        t0 = BEATS[6]
        labels = ["RAISED ON\n“CONQUEST”", "SHE CHARGES\nFOR IT", "HE\nSELF-CENTERS", "SHE DOESN'T\nFINISH"]
        r = 2.5
        c = m.UP * 1.6
        angles = [np.pi / 2, 0, -np.pi / 2, np.pi]
        nodes = m.VGroup()
        for lab, a in zip(labels, angles):
            p = c + r * np.array([np.cos(a), np.sin(a), 0])
            t = T(lab, 28, INK, width=2.6)
            plate = m.BackgroundRectangle(t, color=BG, fill_opacity=1, buff=0.12)
            nodes.add(m.VGroup(plate, t).move_to(p))
        ring = m.Circle(radius=r, stroke_color=DIM, stroke_width=3).move_to(c)
        title = T("THE LOOP", 46, GOLD).to_edge(m.UP, buff=0.9)
        self.play(m.Create(ring), m.Write(title), run_time=1.0)
        self.play(m.LaggedStart(*[m.FadeIn(n) for n in nodes], lag_ratio=0.5), run_time=2.4)
        prog = m.ValueTracker(0.0)

        def ang():
            return np.pi / 2 - 2 * np.pi * prog.get_value()

        trail = m.always_redraw(lambda: m.Arc(radius=r, start_angle=np.pi / 2, angle=-2 * np.pi * max(prog.get_value(), 1e-3),
                                              stroke_color=HER, stroke_width=9).move_arc_center_to(c))
        pulse = m.always_redraw(lambda: m.Dot(c + r * np.array([np.cos(ang()), np.sin(ang()), 0]), color=GOLD, radius=0.16))

        for k, n in enumerate(nodes):
            n[1].add_updater(lambda mob, k=k: mob.set_color(HER if prog.get_value() >= k / 4 - 1e-6 else INK))
        self.add(trail, pulse); self.bring_to_front(nodes)
        start = T("IT CAN START ANYWHERE", 30, DIM, "NORMAL")
        start.next_to(ring, m.DOWN, buff=1.1)
        self.play(m.FadeIn(start))
        self.play(prog.animate.set_value(1.0), run_time=6.0, rate_func=m.linear)
        for n in nodes:
            n[1].clear_updaters()
        self.until(t0 + 10.4)
        self.clear_all(0.3)
        # Armstrong, England & Fogarty (2012): women's orgasm at last sex.
        head = T("WOMEN'S ORGASM AT LAST SEX", 36).to_edge(m.UP, buff=1.6)
        axis = m.Line([-2.6, -2.2, 0], [2.6, -2.2, 0], stroke_color=DIM)
        bars = m.VGroup()
        for k, (lab, v, col) in enumerate([("HOOKUP", 42, HER), ("RELATIONSHIP", 74, OK)]):
            x = -1.3 + 2.6 * k
            h = 5.0 * v / 100
            b = m.Rectangle(width=1.5, height=h, fill_color=col, fill_opacity=1, stroke_width=0)
            b.move_to([x, -2.2 + h / 2, 0])
            bars.add(m.VGroup(b, T(f"~{v}%", 40, col).next_to(b, m.UP, buff=0.15),
                              T(lab, 24, INK).move_to([x, -2.6, 0])))
        src = cite("Armstrong, England & Fogarty (2012)\nAmerican Sociological Review", "https://doi.org/10.1177/0003122412445802")
        self.play(m.Write(head), m.Create(axis), run_time=0.8)
        self.play(m.LaggedStart(*[m.GrowFromEdge(b[0], m.DOWN) if hasattr(m, "GrowFromEdge") else m.FadeIn(b[0]) for b in bars], lag_ratio=0.4),
                  run_time=1.4)
        self.play(*[m.FadeIn(b[1:]) for b in bars], m.FadeIn(src), run_time=0.6)
        self.until(t0 + 15.0)
        self.clear_all(0.3)
        reg = m.VGroup(T("WHEN WOMEN REGRET", 40), T("A HOOKUP,", 40),
                       T("IT'S MOSTLY BECAUSE", 40), T("THE SEX DIDN'T SERVE THEM", 40, HER)).arrange(m.DOWN, buff=0.2)
        src2 = cite("Sagioglou & Dick (2026)\nArchives of Sexual Behavior", "https://doi.org/10.1007/s10508-025-03380-3")
        self.play(m.FadeIn(reg, shift=m.UP * 0.2), m.FadeIn(src2), run_time=0.8)
        self.until(BEATS[7] - 0.4)
        self.clear_all()

    # 6 ── chores move desire, not the bed
    def chores(self):
        t0 = BEATS[7]

        def dial(x, name, col):
            arc = m.Arc(radius=1.3, start_angle=0, angle=np.pi, stroke_color=DIM, stroke_width=6).move_to([x, 0.8, 0])
            pivot = arc.get_center() + m.DOWN * 0.65
            needle = m.Line(pivot, pivot + m.LEFT * 1.1 + m.UP * 0.25, stroke_color=col, stroke_width=8)
            lab = T(name, 30, col).move_to([x, -0.4, 0])
            return arc, needle, pivot, lab

        a1, n1, p1, l1 = dial(-1.8, "DESIRE", OK)
        a2, n2, p2, l2 = dial(1.8, "ORGASM", HER)
        head = T("HOUSEWORK", 50, GOLD).to_edge(m.UP, buff=1.6)
        self.play(m.Write(head), m.FadeIn(a1, n1, l1, a2, n2, l2), run_time=1.0)
        src = cite("Harris, Gormezano & van Anders (2022)\nArchives of Sexual Behavior", "https://doi.org/10.1007/s10508-022-02397-2")
        self.play(m.FadeIn(src), run_time=0.5)
        # "Chores move desire" (3.8 s): the desire needle moves on the words.
        self.until(t0 + 3.8)
        self.play(m.Rotate(n1, angle=-1.9, about_point=p1), m.Indicate(l1, color=OK), run_time=1.0)
        # "Reciprocity moves what happens in the bed" (5.3 s): the orgasm needle moves on reciprocity.
        self.until(t0 + 5.3)
        only = T("RECIPROCITY MOVES THE BED", 46, OK).shift(m.DOWN * 3.0)
        self.play(m.Rotate(n2, angle=-1.9, about_point=p2), n2.animate.set_color(OK), l2.animate.set_color(OK),
                  m.Write(only), run_time=1.2)
        self.until(BEATS[8] - 0.4)
        self.clear_all()

    # 7 ── where I'm standing (plain type)
    def personal(self):
        t0 = BEATS[8]
        lines = [
            (0.4, T("I center my partner's pleasure.", 40, INK, "NORMAL")),
            (4.6, T("So in this model, I pay twice.", 40, INK, "NORMAL")),
            (8.4, T("And I still get told I took something.", 40, HER, "NORMAL")),
            (12.0, T("That trains reciprocity out of men.", 40, GOLD, "BOLD")),
        ]
        g = m.VGroup(*[t for _, t in lines]).arrange(m.DOWN, buff=0.6, aligned_edge=m.LEFT)
        for at, t in lines:
            self.until(t0 + at)
            self.play(m.FadeIn(t, shift=m.UP * 0.15), run_time=0.6)
        self.until(BEATS[9] - 0.4)
        self.clear_all()

    # 8 ── trickle-down: Reaganomics as the signature of extraction
    def trickle(self):
        t0 = BEATS[9]
        top = m.RoundedRectangle(width=3.4, height=1.0, corner_radius=0.2, color=HIM).move_to([0, 3.2, 0])
        bot = m.RoundedRectangle(width=3.4, height=1.0, corner_radius=0.2, color=HER).move_to([0, -1.2, 0])
        tt = T("FIXED CHORES", 32, HIM).move_to(top)
        tb = T("THE BEDROOM", 32, HER).move_to(bot)
        drip = m.DashedLine(top.get_bottom(), bot.get_top() + m.UP * 1.6, color=DIM, stroke_width=5)
        self.play(m.FadeIn(top, tt, bot, tb), m.Create(drip), run_time=1.2)
        drops = m.VGroup(*[m.Dot(top.get_bottom() + m.DOWN * 0.2, radius=0.1, color=HIM) for _ in range(3)])
        self.play(m.LaggedStart(*[d.animate.move_to(drip.get_end()).set_opacity(0) for d in drops], lag_ratio=0.35),
                  run_time=2.0)
        self.until(t0 + 3.5)
        rg = T("THIS IS REAGANOMICS", 44, GOLD).move_to([0, -3.2, 0])
        self.play(m.Write(rg), run_time=0.8)
        self.until(t0 + 6.7)
        self.clear_all(0.3)
        head = m.VGroup(T("TAX CUTS FOR THE RICH", 38), T("50 YEARS · 18 COUNTRIES", 30, DIM, "NORMAL")).arrange(m.DOWN, buff=0.15)
        head.to_edge(m.UP, buff=1.4)
        rows = m.VGroup()
        for name, col, up in [("INEQUALITY", HER, True), ("GROWTH", DIM, False), ("JOBS", DIM, False)]:
            lab = T(name, 34, col).move_to([-1.5, 0, 0])
            ar = m.Arrow([0.6, -0.5 if up else 0, 0], [2.6, 0.6 if up else 0, 0], color=col, buff=0, stroke_width=8)
            rows.add(m.VGroup(lab, ar))
        rows.arrange(m.DOWN, buff=0.9).shift(m.DOWN * 0.2)
        src = cite("Hope & Limberg (2022)\nSocio-Economic Review", "https://doi.org/10.1093/ser/mwab061")
        self.play(m.FadeIn(head), m.FadeIn(src), run_time=0.6)
        self.until(t0 + 11.1)
        self.play(m.FadeIn(rows[0][0]), m.GrowArrow(rows[0][1]), run_time=0.6)
        self.until(t0 + 12.4)
        self.play(m.LaggedStart(*[m.AnimationGroup(m.FadeIn(r[0]), m.GrowArrow(r[1])) for r in rows[1:]], lag_ratio=0.4),
                  run_time=1.0)
        self.until(t0 + 15.0)
        self.clear_all(0.3)
        sig = T("THE SIGNATURE OF EXTRACTION", 40, GOLD).to_edge(m.UP, buff=1.4)
        self.play(m.Write(sig), run_time=0.8)
        steps = [(17.6, "1  COLLECT UP FRONT", INK), (18.4, "2  PROMISE IT'LL TRICKLE DOWN", INK),
                 (20.2, "3  MOVE THE GOALPOSTS", HER)]
        col = m.VGroup(*[T(txt, 32, c) for _, txt, c in steps]).arrange(m.DOWN, buff=0.45, aligned_edge=m.LEFT)
        col.next_to(sig, m.DOWN, buff=0.8)
        post = m.VGroup(m.Line([-0.6, 0, 0], [-0.6, 1.2, 0]), m.Line([0.6, 0, 0], [0.6, 1.2, 0]),
                        m.Line([-0.6, 0.4, 0], [0.6, 0.4, 0])).set_stroke(GOLD, 7).move_to([0, -2.6, 0])
        for (at, _, _), t in zip(steps, col):
            self.until(t0 + at)
            self.play(m.FadeIn(t, shift=m.RIGHT * 0.2), run_time=0.4)
            if t is col[0]:
                self.play(m.FadeIn(post), run_time=0.3)
        self.play(post.animate.shift(m.RIGHT * 2.6), run_time=0.9)
        self.until(t0 + 21.9)
        big = m.Circle(radius=1.4, color=DIM, stroke_width=4).move_to([0, -2.4, 0])
        small = m.Circle(radius=0.45, color=HER, stroke_width=5).move_to(big)
        same = T("SAME LOOP, SMALLER SCALE", 36, HER).to_edge(m.DOWN, buff=1.2)
        self.play(m.FadeOut(post), m.Create(big), run_time=0.4)
        self.play(m.TransformFromCopy(big, small), m.FadeIn(same), run_time=0.8)
        self.until(BEATS[10] - 0.4)
        self.clear_all()

    # 9 ── sex is the core
    def core(self):
        t0 = BEATS[10]
        rings = m.VGroup(*[m.Circle(radius=0.8 + 0.85 * k, stroke_color=OK, stroke_width=5) for k in range(4)])
        labels = m.VGroup(T("SEX", 36, INK),
                          T("EVERYTHING ELSE", 30, DIM).next_to(rings, m.DOWN, buff=0.3))
        m.VGroup(rings, labels).shift(m.UP * 0.6)
        flow = T("THE FLOW STARTS IN THE BEDROOM", 34, OK).to_edge(m.UP, buff=1.0)
        self.play(m.LaggedStart(*[m.Create(r) for r in rings], lag_ratio=0.3), m.FadeIn(labels), m.FadeIn(flow),
                  run_time=1.6)
        self.until(t0 + 4.8)
        self.play(m.LaggedStart(*[r.animate.set_stroke(GOLD) for r in rings], lag_ratio=0.35), run_time=1.8)
        tag = T("A RECIPROCAL CORE BUILDS\nA RECIPROCAL RELATIONSHIP", 32, OK).shift(m.DOWN * 4.4)
        self.play(m.FadeIn(tag))
        self.until(BEATS[11] - 0.4)
        self.clear_all()

    # 10 ── if you're a Christian
    def christian(self):
        t0 = BEATS[11]
        tag = T("IF YOU'RE A CHRISTIAN", 44, GOLD).to_edge(m.UP, buff=1.8)
        verse = m.VGroup(T("“each spouse's body", 40, INK, "NORMAL"),
                         T("belongs to the other”", 40, INK, "NORMAL")).arrange(m.DOWN, buff=0.2)
        self.play(m.Write(tag), run_time=0.8)
        vsrc = cite("1 Corinthians 7:4", "https://www.biblegateway.com/passage/?search=1+Corinthians+7%3A4")
        self.play(m.FadeIn(verse, shift=m.UP * 0.2), m.FadeIn(vsrc))
        base = T("RECIPROCITY IS THE BASELINE", 34, OK).next_to(verse, m.DOWN, buff=0.6)
        self.play(m.FadeIn(base))
        self.until(t0 + 8.0)
        men = T("men broke it for centuries", 34, HIM, "NORMAL").shift(m.DOWN * 3.0)
        self.play(m.FadeIn(men))
        self.until(t0 + 10.5)
        nox = T("it still binds everyone", 40, HER).next_to(men, m.DOWN, buff=0.2)
        self.play(m.Write(nox))
        self.until(BEATS[12] - 0.4)
        self.clear_all()

    # 11 ── secular, framework, close
    def close(self):
        t0 = BEATS[12]
        sec = m.VGroup(T("IF YOU'RE SECULAR", 40, GOLD), T("autonomy is shared:", 34, INK, "NORMAL"),
                       T("mutual consent, both ways", 34, OK, "NORMAL")).arrange(m.DOWN, buff=0.2)
        sec.to_edge(m.UP, buff=1.4)
        self.play(m.FadeIn(sec, shift=m.UP * 0.2))
        self.until(t0 + 4.2)
        head = T("IN MY FRAMEWORK", 40, GOLD).shift(m.DOWN * 0.2)
        ax = m.Line(m.LEFT * 0.0, m.UP * 1.0, stroke_color=INK, stroke_width=6)
        ant1 = m.VGroup(ax.copy(), m.Line(m.UP * 1.0, m.UP * 1.0 + m.LEFT * 0.4 + m.DOWN * 0.3, stroke_color=INK, stroke_width=6),
                        m.Line(m.UP * 1.0, m.UP * 1.0 + m.RIGHT * 0.4 + m.DOWN * 0.3, stroke_color=INK, stroke_width=6))
        ant1.move_to([-2.9, -2.1, 0])
        ant2 = ant1.copy().move_to([2.9, -2.1, 0])
        ph = m.ValueTracker(0.0)
        wave = m.always_redraw(lambda: m.FunctionGraph(
            lambda x: 0.35 * np.sin(3 * x - ph.get_value()), x_range=[-2.4, 2.4], color=OK).shift(m.DOWN * 1.8))
        cap = T("an antenna receives only what it can transmit", 26, DIM, "NORMAL").shift(m.DOWN * 3.3)
        self.play(m.FadeIn(head), m.FadeIn(ant1, ant2), run_time=0.8)
        self.add(wave)
        self.play(ph.animate.set_value(12), m.FadeIn(cap), run_time=5.0, rate_func=m.linear)
        self.until(t0 + 11.2)
        self.clear_all(0.3)
        word = T("RECIPROCAL", 80, OK)
        self.play(m.Write(word), run_time=0.8)
        self.until(t0 + 12.6)
        end = m.VGroup(T("TAKE SEX OFF", 54), T("THE CHORE CHART", 54, GOLD)).arrange(m.DOWN, buff=0.2)
        self.play(word.animate.shift(m.UP * 2.2).scale(0.6), m.FadeIn(end, shift=m.UP * 0.2), run_time=0.8)

    # end card, silent: sources and the book
    def end_card(self):
        self.clear_all()
        sources = "https://github.com/th30d0re/TheOriginalPower/blob/main/Architecting_the_operation/video/reel_reciprocity/citations.md"
        book = "https://github.com/th30d0re/TheOriginalPower/releases"
        cards = m.VGroup()
        for label, url in [("SOURCES", sources), ("THE BOOK", book)]:
            cards.add(m.VGroup(qr(url, side=2.6), T(label, 34, GOLD)).arrange(m.DOWN, buff=0.3))
        cards.arrange(m.DOWN, buff=0.8)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        nxt = m.VGroup(T("PART 2:", 30, DIM), T("WHEN SEX BECOMES A CHORE", 32, OK)).arrange(m.DOWN, buff=0.1)
        cards.shift(m.UP * 0.5)
        nxt.next_to(cards, m.DOWN, buff=0.5)
        self.play(m.FadeIn(cards), m.FadeIn(nxt), m.FadeIn(foot), run_time=0.5)
        self.wait(4.0)

