"""SEG 17 fractal execution: zoom, spanning tree, differential insertion."""

import sys
from pathlib import Path

import manimgx as m
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def tier_box(label, w=2.4, color=INK, fill=NAVY2):
    r = m.RoundedRectangle(width=w, height=0.75, corner_radius=0.1, stroke_color=color, stroke_width=3,
                           fill_color=fill, fill_opacity=1)
    t = T(label, 28, color, width=w - 0.3).move_to(r)
    return m.VGroup(r, t)


def nested_network(depth=4):
    g = m.VGroup()
    for i in range(depth):
        s = 4.8 - i * 0.95
        box = m.RoundedRectangle(width=s, height=s * 0.5, corner_radius=0.08,
                                 stroke_color=[GOLD, HIM, OK, HER][i % 4], stroke_width=2 + i,
                                 fill_color=NAVY2, fill_opacity=0.35)
        g.add(box)
    g.arrange(m.DOWN, buff=0.05)
    return g


def tree_at_e():
    root = tier_box("E", 1.6, GOLD)
    root.move_to([0, 2.6, 0])
    kids = m.VGroup(*[tier_box(n, 2.0, DIM) for n in ("Puppet", "Enforcement", "Buffer", "Out-group")])
    kids.arrange(m.RIGHT, buff=0.35).move_to([0, 0.2, 0])
    leaves = m.VGroup(*[tier_box("node", 1.3, DIM) for _ in range(6)])
    leaves.arrange_in_grid(2, 3, buff=(0.3, 0.25)).scale(0.85).move_to([0, -2.2, 0])
    arrows = m.VGroup()
    for mob in list(kids) + list(leaves):
        arrows.add(m.Arrow(root.get_bottom(), mob.get_top(), buff=0.08, color=GOLD, stroke_width=4, max_tip_length_to_length_ratio=0.12))
    cap = T("DIRECTED SPANNING TREE", 32, GOLD).to_edge(m.UP, buff=0.55)
    return m.VGroup(cap, root, arrows, kids, leaves)


class FractalExecution(YTScene):
    SOURCE = "Source: The Original Power, §2.3.7 Fractal Execution"

    def shot_S17_01(self):
        head = T("FRACTAL VIRUS", 38, GOLD).to_edge(m.UP, buff=0.5)
        net = nested_network().scale(0.72).move_to([0, -0.15, 0])
        sub = T("LOCAL VARIATION · SAME KERNEL", 24, DIM).next_to(net, m.DOWN, buff=0.18)
        self.add(head, net, sub)
        self.until(self.at(0, "fractal"))
        self.play(net.animate.scale(0.92), run_time=0.5)
        self.until(self.at(0, "variation"))

        self.until(self.at(1, "network"))
        wan = T("GLOBAL WAN", 28, HIM).move_to([-4.5, 2.0, 0])
        loc = T("LOCAL DRIVE", 28, OK).move_to([4.5, -2.7, 0])
        rep = T("REPLICATION", 26, GOLD).move_to([0, -0.5, 0])
        self.play(m.FadeIn(wan), m.FadeIn(loc), m.FadeIn(rep), run_time=0.9)
        self.until(self.at(1, "drive"))

        self.until(self.at(2, "market"))
        self.play(m.FadeOut(wan), m.FadeOut(loc), m.FadeOut(rep), m.FadeOut(sub), m.FadeOut(net), run_time=0.5)
        veil = T("MARKET FORCES · INDIVIDUAL CHOICE · CULTURAL PREFERENCE", 24, DIM, width=11)
        veil.move_to([0, -2.2, 0])
        mask = T("LOCALLY RATIONAL · GLOBALLY HIDDEN", 28, HER).to_edge(m.DOWN, buff=0.45)
        self.play(m.FadeIn(veil), m.FadeIn(mask), run_time=0.7)
        self.until(self.beat_end(2) - 0.3)

    def shot_S17_25(self):
        tree = tree_at_e()
        self.add(tree)
        self.until(self.at(0, "directed"))
        note = T("REACHES EVERY RESOLUTION", 32, INK).to_edge(m.DOWN, buff=0.55)
        self.play(m.FadeIn(note), run_time=0.5)
        self.until(self.at(0, "resolution"))
        self.until(self.beat_end(0) - 0.2)

    def shot_S17_39(self):
        head = T("DIFFERENTIAL INSERTION", 40, GOLD).to_edge(m.UP, buff=0.6)
        floor = m.Rectangle(width=10, height=0.12, fill_color=HER, fill_opacity=1, stroke_width=0)
        floor.move_to([0, -2.4, 0])
        fl = T("EXTRACTION FLOOR · OUT-GROUP", 28, HER).next_to(floor, m.DOWN, buff=0.2)
        buf = tier_box("BUFFER TIER INSERTION", 5.2, OK)
        buf.move_to([0, -0.6, 0])
        elite = tier_box("ELITE ROOT", 3.2, GOLD)
        elite.move_to([0, 2.0, 0])
        arr = m.Arrow(elite.get_bottom(), buf.get_top(), color=GOLD, stroke_width=5, buff=0.15)
        cap = T("AGGREGATE METRICS · INSERTION POINT", 26, DIM).next_to(elite, m.UP, buff=0.2)
        self.add(head, floor, fl, buf, elite, arr, cap)
        self.until(self.at(0, "differential"))
        self.play(buf[0].animate.set_stroke(OK, 6), run_time=0.6)
        self.until(self.at(0, "metrics"))
        self.until(self.beat_end(0) - 0.2)
