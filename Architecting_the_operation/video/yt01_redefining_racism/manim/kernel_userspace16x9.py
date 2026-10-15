"""S08-22 kernel locations; S20-01 kernel versus user-space diagnostic."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, M, NAVY2, OK, T, YTScene  # noqa: E402


def inner_layer(label, width=4.0, color=INK, fill="#1a1020"):
    box = m.RoundedRectangle(width=width, height=0.95, corner_radius=0.1, stroke_color=color, stroke_width=3,
                             fill_color=fill, fill_opacity=1)
    text = T(label, 34, color, width=width - 0.4).move_to(box)
    return m.VGroup(box, text)


def stack_layer(label, h=1.0, color=INK, fill=NAVY2):
    box = m.RoundedRectangle(width=11.2, height=h, corner_radius=0.12, stroke_color=color, stroke_width=3,
                             fill_color=fill, fill_opacity=1)
    text = T(label, 34, color, width=10.5).move_to(box)
    return m.VGroup(box, text)


class KernelAndUserSpace(YTScene):
    SHOT = "S08-22"

    def shot_S08_22(self):
        kernel = stack_layer("KERNEL · CONSTITUTION · PROPERTY LAW · 13TH EXCEPTION", 1.15, HER, "#1a1020")
        user = stack_layer("USER SPACE · VOTING · PROTEST · LAWSUITS · ELECTIONS", 1.0, OK, NAVY2)
        layers = m.VGroup(kernel, user).arrange(m.DOWN, buff=0.22).shift(m.DOWN * 0.1)
        since = T("SINCE 1619", 44, GOLD).to_edge(m.UP, buff=0.45)
        self.add(since)
        self.play(m.FadeIn(kernel), run_time=0.8)
        self.until(self.at(0, "kernel"))
        self.until(self.at(0, "clause"))

        # 1 — user space above
        self.until(self.at(1, "user"))
        self.play(m.FadeIn(user, shift=m.DOWN * 0.2), run_time=0.7)
        self.until(self.at(1, "space"))

        # 2 — access boundary
        self.until(self.at(2, "access"))
        wall = m.Line(kernel[0].get_left() + m.UP * 0.55, kernel[0].get_right() + m.UP * 0.55, color=HER, stroke_width=6)
        denied = T("ACCESS BOUNDARY", 34, HER).move_to(kernel[0].get_top() + m.UP * 0.38)
        loop = T("EXTRACTION LOOP", 30, GOLD, "NORMAL").next_to(layers, m.DOWN, buff=0.38)
        self.play(m.Create(wall), m.FadeIn(denied), m.FadeIn(loop), run_time=0.9)
        self.until(self.at(2, "participation"))
        self.until(self.beat_end(2) - 0.3)


class KernelUserSpace(YTScene):
    SHOT = "S20-01"

    def _base_layers(self):
        kernel = stack_layer("KERNEL · EXTRACTION CODE", 1.35, HER, "#1a1020")
        buffer = stack_layer("ABSORPTION BUFFER", 0.75, GOLD, "#1a1820")
        user = stack_layer("USER SPACE · REFORM TOOLS", 1.05, OK, NAVY2)
        layers = m.VGroup(kernel, buffer, user).arrange(m.DOWN, buff=0.18).shift(m.DOWN * 0.05)
        buffer[1].set_opacity(0)
        banner = T("KERNEL INFECTION · USER-SPACE TOOLS", 44, GOLD, width=12.0).to_edge(m.UP, buff=0.42)
        return m.VGroup(banner, layers), kernel, buffer, user

    def shot_S20_01(self):
        base, kernel, buffer, user = self._base_layers()
        conclusion = T("DIAGNOSTIC CONCLUSION", 36, GOLD).next_to(user, m.DOWN, buff=0.38)
        overlay = m.VGroup()
        self.add(base)
        self.play(m.FadeIn(base), m.FadeIn(conclusion), run_time=0.9)
        self.until(self.at(0, "tools"))

        self.until(self.at(1, "permissions"))
        self.play(m.FadeOut(conclusion), run_time=0.3)
        denied = T("PERMISSION DENIED", 36, HER).next_to(user, m.DOWN, buff=0.38)
        lock = m.Line(kernel[0].get_corner(m.DL) + m.DOWN * 0.12, kernel[0].get_corner(m.DR) + m.DOWN * 0.12,
                      color=HER, stroke_width=6)
        overlay.add(denied, lock)
        self.play(m.FadeIn(denied), m.Create(lock), user[0].animate.set_stroke(HER, 5), run_time=0.65)
        self.until(self.at(1, "interface"))

        self.until(self.at(2, "min"))
        self.play(m.FadeOut(denied), run_time=0.3)
        overlay.remove(denied)
        mm = M(r"\min\text{-management}", 52, GOLD).next_to(user, m.DOWN, buff=0.42)
        packet = m.RoundedRectangle(width=2.2, height=0.7, corner_radius=0.1, stroke_color=OK, stroke_width=3,
                                    fill_color=NAVY2, fill_opacity=1)
        p_l = T("REFORM", 34, OK).move_to(packet)
        packet_g = m.VGroup(packet, p_l).next_to(user, m.UP, buff=0.22)
        overlay.add(mm, packet_g)
        self.play(m.FadeIn(mm), m.FadeIn(packet_g, shift=m.DOWN * 0.15), run_time=0.55)
        self.until(self.at(2, "stress"))

        self.until(self.at(3, "resistance"))
        self.play(m.FadeOut(mm), run_time=0.3)
        overlay.remove(mm)
        gauge = m.Rectangle(width=4.5, height=0.42, stroke_color=DIM, stroke_width=3)
        fill = m.Rectangle(width=3.8, height=0.34, fill_color=OK, fill_opacity=1, stroke_width=0)
        fill.move_to(gauge.get_left() + m.RIGHT * 1.9)
        gauge_g = m.VGroup(gauge, fill).shift(m.LEFT * 2.4 + m.DOWN * 2.55)
        g_l = T("CLASS RESISTANCE", 30, DIM, "NORMAL").next_to(gauge_g, m.UP, buff=0.12)
        payload_g = inner_layer("EXTRACTION PAYLOAD", 4.0, HER).shift(m.RIGHT * 2.2 + m.DOWN * 2.45)
        row3 = m.VGroup(gauge_g, g_l, payload_g)
        overlay.add(row3)
        self.play(m.FadeIn(row3), run_time=0.6)
        self.play(fill.animate.stretch_to_fit_width(0.75).move_to(gauge.get_left() + m.RIGHT * 0.4), run_time=0.8)
        self.until(self.at(3, "intact"))

        self.until(self.at(4, "stress"))
        self.play(m.FadeOut(row3), run_time=0.3)
        overlay.remove(row3)
        self.play(buffer[0].animate.set_stroke(GOLD, 4), run_time=0.35)
        absorb_l = T("KERNEL ABSORBS REFORM", 34, GOLD).next_to(buffer[0], m.UP, buff=0.22)
        overlay.add(absorb_l)
        packet_g.generate_target()
        packet_g.target.scale(0.75).move_to(buffer[0].get_center())
        self.play(m.FadeIn(absorb_l), p_l.animate.set_opacity(0), m.MoveToTarget(packet_g), run_time=0.85)
        self.until(self.at(4, "reform"))

        self.until(self.at(5, "recompiles"))
        self.play(m.FadeOut(absorb_l), run_time=0.25)
        overlay.remove(absorb_l)
        footer = T("INTERFACE v2", 34, OK).next_to(user, m.DOWN, buff=0.42)
        overlay.add(footer)
        self.play(m.FadeIn(footer), run_time=0.4)
        self.until(self.at(5, "changes"))
        footer2 = T("INTERFACE v3", 34, GOLD).move_to(footer)
        self.play(m.ReplacementTransform(footer, footer2), run_time=0.5)
        cont = T("EXTRACTION CONTINUES", 36, GOLD).next_to(footer2, m.DOWN, buff=0.3)
        pulse = m.Arrow(kernel[0].get_top(), kernel[0].get_top() + m.UP * 0.55, buff=0.05, color=GOLD, stroke_width=5)
        overlay.add(cont, pulse)
        self.play(m.FadeIn(cont), m.GrowArrow(pulse), run_time=0.45)
        self.until(self.beat_end(5) - 0.3)
