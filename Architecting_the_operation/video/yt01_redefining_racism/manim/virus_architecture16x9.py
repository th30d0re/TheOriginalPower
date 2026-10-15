"""S07-01: fractal computer-virus diagnostic schematic."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, TEAL, YTScene  # noqa: E402


def inner_layer(label, width=4.8, color=INK, fill=NAVY2):
    box = m.RoundedRectangle(width=width, height=1.05, corner_radius=0.12, stroke_color=color, stroke_width=3,
                             fill_color=fill, fill_opacity=1)
    text = T(label, 34, color, width=width - 0.45).move_to(box)
    return m.VGroup(box, text)


def mini_schematic(scale=1.0, labeled=True):
    shell = m.RoundedRectangle(
        width=3.2 * scale, height=3.8 * scale, corner_radius=0.1, stroke_color=TEAL, stroke_width=2.5, fill_opacity=0
    )
    if labeled:
        layers = m.VGroup(
            inner_layer("PAYLOAD", 2.6 * scale, HER),
            inner_layer("REPLICATE", 2.6 * scale, OK),
            inner_layer("MUTATE", 2.6 * scale, GOLD),
        ).arrange(m.DOWN, buff=0.14 * scale)
    else:
        layers = m.VGroup(*[
            m.RoundedRectangle(width=2.2 * scale, height=0.55 * scale, corner_radius=0.08, stroke_color=c,
                               stroke_width=2, fill_color=NAVY2, fill_opacity=1)
            for c in (HER, OK, GOLD)
        ]).arrange(m.DOWN, buff=0.12 * scale)
    layers.move_to(shell)
    return m.VGroup(shell, layers)


class VirusArchitecture(YTScene):
    SHOT = "S07-01"

    def shot_S07_01(self):
        head = T("DIAGNOSTIC VIRUS MODEL", 44, GOLD).to_edge(m.UP, buff=0.45)
        host_shell = m.RoundedRectangle(width=5.6, height=4.6, corner_radius=0.14, stroke_color=TEAL, stroke_width=4,
                                        fill_color=NAVY2, fill_opacity=0.35)
        host_l = T("HOST LAYER", 34, TEAL).next_to(host_shell, m.UP, buff=0.12)
        payload = inner_layer("PAYLOAD", 4.6, HER)
        payload.move_to(host_shell.get_center() + m.UP * 0.55)
        host_g = m.VGroup(host_shell, host_l, payload).shift(m.LEFT * 2.85 + m.DOWN * 0.15)
        self.add(head, host_g)
        self.play(m.FadeIn(host_shell), m.FadeIn(host_l), m.FadeIn(payload, shift=m.DOWN * 0.12), run_time=1.0)
        self.until(self.at(0, "virus"))

        replicate = inner_layer("REPLICATION", 4.6, OK)
        replicate.move_to(host_shell.get_center() + m.DOWN * 0.55)
        net_nodes = m.VGroup(*[m.Circle(radius=0.28, color=OK, stroke_width=4, fill_opacity=0) for _ in range(6)])
        net_nodes.arrange_in_grid(2, 3, buff=0.42).shift(m.RIGHT * 3.35 + m.DOWN * 0.05)
        hijack = m.VGroup(*[
            m.Arrow(payload[0].get_right(), node.get_left(), buff=0.1, color=HER, stroke_width=5, max_tip_length_to_length_ratio=0.18)
            for node in net_nodes
        ])

        self.until(self.at(1, "hijacks"))
        self.play(m.FadeIn(replicate, shift=m.UP * 0.1), run_time=0.55)
        self.play(m.FadeIn(net_nodes), m.LaggedStart(*[m.GrowArrow(a) for a in hijack], lag_ratio=0.12), run_time=1.0)
        self.until(self.at(1, "scale"))

        mutate = inner_layer("MUTATION", 4.6, GOLD)
        mutate.move_to(host_shell.get_center() + m.DOWN * 1.65)
        sig_g = inner_layer("SIGNATURE", 3.0, GOLD).next_to(mutate, m.RIGHT, buff=0.65)
        core = inner_layer("CORE PAYLOAD", 3.4, HER).next_to(payload, m.RIGHT, buff=0.55)

        self.until(self.at(2, "mutates"))
        self.play(m.FadeOut(net_nodes), m.FadeOut(hijack), run_time=0.35)
        self.play(m.FadeIn(mutate), m.FadeIn(sig_g, shift=m.LEFT * 0.15), m.FadeIn(core), run_time=0.75)
        self.play(sig_g[1].animate.set_color(TEAL), sig_g[0].animate.set_stroke(TEAL, 4), run_time=0.55)
        self.until(self.at(2, "unchanged"))

        sockets = m.VGroup(*[T(label, 30, DIM, "NORMAL") for label in
                               ("EXTRACTION", "PARTITION", "ENFORCEMENT", "SUPPRESSION")])
        sockets.arrange(m.RIGHT, buff=0.55).to_edge(m.DOWN, buff=0.48)

        self.until(self.at(3, "component"))
        self.play(m.LaggedStart(*[m.FadeIn(s, shift=m.UP * 0.12) for s in sockets], lag_ratio=0.15), run_time=0.9)
        self.until(self.at(3, "diagnostic"))

        frames = m.VGroup()
        for i, sc in enumerate((1.0, 0.78, 0.58)):
            frame = m.RoundedRectangle(width=3.6 * sc, height=4.0 * sc, corner_radius=0.1, stroke_color=GOLD,
                                       stroke_width=3, fill_opacity=0)
            mini = mini_schematic(0.85 * sc, labeled=(i == 0))
            mini.move_to(frame)
            frames.add(m.VGroup(frame, mini))
        frames.arrange(m.RIGHT, buff=0.55)
        fractal_l = T("SELF-SIMILARITY", 36, GOLD)
        fractal = m.VGroup(frames, fractal_l).arrange(m.DOWN, buff=0.2).move_to(m.ORIGIN + m.DOWN * 0.15)

        virus_body = m.VGroup(replicate, mutate, core, sig_g)

        self.until(self.at(4, "Fractal"))
        self.play(
            m.FadeOut(head), m.FadeOut(host_g), m.FadeOut(virus_body), m.FadeOut(sockets),
            m.FadeIn(fractal), run_time=0.85,
        )
        self.until(self.at(4, "approximation"))

        def module_block(title, sub):
            outer = m.RoundedRectangle(width=4.6, height=1.35, corner_radius=0.12, stroke_color=GOLD, stroke_width=3,
                                       fill_color=NAVY2, fill_opacity=1)
            t1 = T(title, 34, INK, width=4.2).move_to(outer.get_center() + m.UP * 0.22)
            t2 = T(sub, 28, DIM, "NORMAL", width=4.0).move_to(outer.get_center() + m.DOWN * 0.28)
            return m.VGroup(outer, t1, t2)

        mods = m.VGroup(
            module_block("EXTRACTION", "LOCAL IMPL"),
            module_block("PARTITION", "LOCAL IMPL"),
            module_block("ENFORCEMENT", "LOCAL IMPL"),
            module_block("SUPPRESSION", "LOCAL IMPL"),
        ).arrange_in_grid(2, 2, buff=0.35).shift(m.RIGHT * 0.35 + m.DOWN * 0.05)
        use_l = T("RECURRING MODULES", 36, GOLD).to_edge(m.UP, buff=0.45)

        self.until(self.at(5, "extraction"))
        self.play(m.FadeOut(fractal), m.FadeIn(use_l), run_time=0.35)
        self.play(m.LaggedStart(*[m.FadeIn(b, scale=0.92) for b in mods], lag_ratio=0.12), run_time=0.9)
        self.until(self.beat_end(5) - 0.3)
