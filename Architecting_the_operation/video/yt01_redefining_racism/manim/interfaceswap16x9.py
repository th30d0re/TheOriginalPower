"""S12-01 Interface Swap intro; S12-05 exe recompile; S12-20 cost bars."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402


def exe_chip(name, color=INK):
    box = m.RoundedRectangle(width=7.8, height=1.05, corner_radius=0.1, stroke_color=color, stroke_width=3,
                             fill_color=NAVY2, fill_opacity=1)
    text = T(name, 34, color, width=7.2).move_to(box)
    return m.VGroup(box, text)


class InterfaceSwapIntro(YTScene):
    SHOT = "S12-01"

    def shot_S12_01(self):
        head = T("POLYMORPHIC VIRUS", 44, GOLD).to_edge(m.UP, buff=0.42)
        sig_a = exe_chip("SIGNATURE v1", OK)
        sig_b = exe_chip("SIGNATURE v2", GOLD)
        sig_c = exe_chip("SIGNATURE v3", OK)
        sigs = m.VGroup(sig_a, sig_b, sig_c).arrange(m.DOWN, buff=0.28).shift(m.LEFT * 3.2)
        payload = m.RoundedRectangle(width=4.6, height=3.0, corner_radius=0.14, stroke_color=HER, stroke_width=5,
                                     fill_color="#2a1018", fill_opacity=1)
        pay_l = T("PAYLOAD", 40, HER).move_to(payload)
        pay_l2 = T("UNCHANGED", 36, GOLD).next_to(payload, m.DOWN, buff=0.16)
        payload_g = m.VGroup(payload, pay_l, pay_l2).shift(m.RIGHT * 3.5)
        self.add(head, payload_g)
        self.play(m.FadeIn(sig_a), run_time=0.5)
        self.until(self.at(0, "signature"))
        self.play(m.ReplacementTransform(sig_a.copy(), sig_b), run_time=0.5)
        self.play(m.ReplacementTransform(sig_b.copy(), sig_c), run_time=0.5)
        self.add(sigs)
        self.until(self.at(0, "payload"))

        # 1 — Interface Swap label
        self.until(self.at(1, "Interface"))
        swap = T("INTERFACE SWAP", 40, GOLD).to_edge(m.DOWN, buff=0.4)
        iface = T("LEGAL JUSTIFICATION · VISIBLE INTERFACE", 34, DIM, "NORMAL").next_to(swap, m.UP, buff=0.22)
        self.play(m.FadeIn(iface), m.FadeIn(swap), payload.animate.set_stroke(width=6), run_time=0.7)
        self.until(self.at(1, "payload"))
        self.until(self.beat_end(1) - 0.3)


class ExeRecompile(YTScene):
    SHOT = "S12-05"

    def shot_S12_05(self):
        head = T("HOST ANTIVIRUS · RECOMPILE", 44, GOLD).to_edge(m.UP, buff=0.42)
        core = T("PAYLOAD SINCE 1450", 36, HER).shift(m.UP * 0.55)
        self.add(head, core)
        self.until(self.at(0, "payload"))
        chain = [
            ("CHATTEL_SLAVERY.EXE", "CONVICT_LEASING.EXE"),
            ("JIM_CROW.EXE", "WAR_ON_DRUGS.EXE"),
            ("EXPLICIT_DISCRIMINATION.EXE", "REDLINING.EXE"),
        ]
        row = exe_chip(chain[0][0], HER)
        row.next_to(core, m.DOWN, buff=0.75)
        self.play(m.FadeIn(row), run_time=0.5)
        self.until(self.at(0, "recompiles"))

        # 1 — chattel quarantine
        self.until(self.at(1, "Chattel"))
        nxt = exe_chip(chain[0][1], OK).move_to(row)
        self.play(m.Transform(row, nxt), run_time=0.7)
        self.until(self.at(1, "Black"))

        # 2 — Jim Crow
        self.until(self.at(2, "Jim"))
        nxt = exe_chip(chain[1][1], GOLD).move_to(row)
        self.play(m.Transform(row, nxt), run_time=0.7)
        self.until(self.at(2, "Mass"))

        # 3 — explicit discrimination
        self.until(self.at(3, "Explicit"))
        nxt = exe_chip("ALGORITHMIC_BIAS.EXE", OK).move_to(row)
        self.play(m.Transform(row, nxt), run_time=0.7)
        self.until(self.at(3, "Algorithmic"))
        self.until(self.beat_end(3) - 0.3)


class CostBarsOverTime(YTScene):
    SHOT = "S12-20"

    def _bars(self, coercive, legit, econ):
        labels = ("COERCIVE", "LEGITIMACY", "ECONOMIC")
        vals = (coercive, legit, econ)
        cols = (HER, GOLD, OK)
        group = m.VGroup()
        for lab, h, col in zip(labels, vals, cols):
            bar = m.Rectangle(width=2.2, height=h, fill_color=col, fill_opacity=0.85, stroke_width=0)
            bar.move_to(m.DOWN * h / 2)
            cap = T(lab, 34, INK, width=2.1).next_to(bar, m.DOWN, buff=0.55)
            group.add(m.VGroup(bar, cap))
        group.arrange(m.RIGHT, buff=0.75, aligned_edge=m.DOWN)
        return group

    def shot_S10_17(self):
        head = T("1954–1965 · JIM CROW COST SPIKE", 40, GOLD).to_edge(m.UP, buff=0.42)
        bars = self._bars(1.15, 1.25, 1.05).shift(m.DOWN * 0.35)
        ceiling = m.DashedLine([-5.1, 1.4, 0], [5.1, 1.4, 0], color=HER, stroke_width=4, dash_length=0.14)
        ceiling_l = T("UNSUSTAINABLE", 27, HER).next_to(ceiling, m.RIGHT, buff=0.15)
        self.add(head, ceiling, ceiling_l)
        self.until(self.at(0, "spiked"))
        self.play(m.FadeIn(bars), *[bar[0].animate.stretch_to_fit_height(2.1) for bar in bars], run_time=0.8)

        self.until(self.at(1, "Birmingham"))
        events = T("BIRMINGHAM · SELMA · COLD WAR LEGITIMACY", 30, GOLD).to_edge(m.DOWN, buff=0.42)
        self.play(bars[1][0].animate.stretch_to_fit_height(3.1), m.FadeIn(events), run_time=0.65)

        self.until(self.at(2, "boycotts"))
        self.play(bars[0][0].animate.stretch_to_fit_height(2.8), bars[2][0].animate.stretch_to_fit_height(2.65),
                  m.Indicate(ceiling, color=HER), run_time=0.7)

        self.until(self.at(3, "Interface"))
        swapped = self._bars(0.8, 0.55, 2.6).move_to(bars)
        label = T("EXPLICIT PARTITION → CRIMINAL / FISCAL PROXY", 32, GOLD, width=11.5).move_to(events)
        self.play(m.Transform(bars, swapped), m.Transform(events, label), run_time=0.8)
        self.until(self.beat_end(3) - 0.2)

    def shot_S12_20(self):
        head = T("JIM CROW → WAR ON DRUGS", 44, GOLD).to_edge(m.UP, buff=0.42)
        era = T("MID-1950s COSTS RISING", 36, DIM, "NORMAL").next_to(head, m.DOWN, buff=0.16)
        bars = self._bars(1.55, 1.65, 1.35).shift(m.DOWN * 0.2)
        self.add(head, era)
        self.play(m.FadeIn(bars), run_time=0.8)
        self.until(self.at(0, "Jim"))

        # 1 — Brown 1954
        self.until(self.at(1, "Brown"))
        mark = T("BROWN 1954", 36, GOLD).to_edge(m.DOWN, buff=0.48)
        self.play(bars[1][0].animate.stretch_to_fit_height(2.35), m.FadeIn(mark), run_time=0.7)
        self.until(self.at(1, "scrutiny"))

        # 2 — economic cost rising
        self.until(self.at(2, "Economic"))
        econ_note = T("ECONOMIC COST RISING", 36, OK).to_edge(m.DOWN, buff=0.48)
        self.play(m.FadeOut(mark), bars[2][0].animate.stretch_to_fit_height(2.35), m.FadeIn(econ_note), run_time=0.7)
        self.until(self.at(2, "integration"))

        # 3 — swap point
        self.until(self.at(3, "swap"))
        swap_bars = self._bars(0.65, 0.42, 2.85).move_to(bars)
        swap_l = T("INTERFACE SWAP", 40, GOLD).to_edge(m.DOWN, buff=0.48)
        self.play(m.FadeOut(econ_note), m.Transform(bars, swap_bars), m.FadeIn(swap_l), run_time=0.9)
        self.until(self.at(3, "zero"))
        self.until(self.beat_end(3) - 0.3)
