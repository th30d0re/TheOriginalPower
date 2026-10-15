"""S10-01 zero-day exploit frame."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, T, YTScene  # noqa: E402


class ZeroDayExploit(YTScene):
    SHOT = "S10-01"

    def shot_S10_01(self):
        head = T("ZERO-DAY EXPLOIT", 44, GOLD).to_edge(m.UP, buff=0.42)
        host = m.RoundedRectangle(width=8.0, height=5.0, corner_radius=0.14, stroke_color=INK, stroke_width=4,
                                  fill_color=NAVY2, fill_opacity=1)
        host_l = T("TARGET SYSTEM", 36, INK).move_to(host)
        host_g = m.VGroup(host, host_l)
        vuln = m.Circle(radius=0.48, color=HER, stroke_width=5, fill_opacity=0.25, fill_color=HER)
        vuln.move_to(host.get_bottom() + m.DOWN * 0.38)
        vuln_l = T("UNKNOWN VULN", 34, HER).next_to(vuln, m.RIGHT, buff=0.22)
        target = m.VGroup(host_g, vuln, vuln_l)
        payload = m.RoundedRectangle(width=3.5, height=1.6, corner_radius=0.1, stroke_color=GOLD, stroke_width=4,
                                     fill_color="#2a1810", fill_opacity=1)
        p_l = T("PAYLOAD", 36, GOLD).move_to(payload)
        payload_g = m.VGroup(payload, p_l)
        patch = T("NO PATCH CATALOGUED", 34, DIM, "NORMAL").next_to(head, m.DOWN, buff=0.18)
        layout = m.VGroup(target, payload_g).arrange(m.RIGHT, buff=1.25, aligned_edge=m.UP)
        layout.scale_to_fit_width(12.0)
        layout.next_to(patch, m.DOWN, buff=0.42)
        payload_g.set_opacity(0)
        self.add(head, layout, patch)
        self.until(self.at(0, "zero"))
        trail = m.Arrow(payload_g.get_left(), vuln.get_top() + m.LEFT * 0.12, buff=0.18, color=HER, stroke_width=7)
        self.play(payload_g.animate.set_opacity(1), m.GrowArrow(trail), run_time=1.0)
        self.until(self.at(0, "payload"))
        hit = T("NO PREPARED DEFENSE", 36, HER).to_edge(m.DOWN, buff=0.42)
        self.play(m.FadeOut(vuln_l), m.FadeOut(vuln), m.FadeIn(hit), run_time=0.7)
        self.until(self.at(0, "defense"))
        self.until(self.beat_end(0) - 0.3)
