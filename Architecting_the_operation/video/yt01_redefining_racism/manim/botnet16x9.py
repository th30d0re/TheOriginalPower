"""S10-15 transatlantic botnet network."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, INK, NAVY2, OK, T, YTScene  # noqa: E402

HUBS = (
    ("AFRICA", -5.8, 0.35),
    ("CARIBBEAN", -2.4, -1.75),
    ("LISBON", 1.6, 1.45),
    ("LONDON", 3.4, 0.65),
    ("AMSTERDAM", 2.0, -1.55),
    ("WALL ST", 5.4, 0.2),
)


class TransatlanticBotnet(YTScene):
    SHOT = "S10-15"

    def _map(self):
        nodes = m.VGroup()
        labels = m.VGroup()
        for name, x, y in HUBS:
            dot = m.Dot([x, y, 0], radius=0.14, color=OK if name == "AFRICA" else GOLD)
            dirn = m.UP if y < 0 else m.DOWN
            lab = T(name, 34, INK, width=2.2).next_to(dot, dirn, buff=0.18)
            nodes.add(dot)
            labels.add(lab)
        edges = m.VGroup()
        africa = nodes[0]
        for i in range(1, len(nodes)):
            edges.add(m.CurvedArrow(africa.get_center(), nodes[i].get_center(), angle=-0.25 + i * 0.06,
                                    color=HER, stroke_width=4, tip_length=0.18))
        for edge in edges:
            edge.set_z_index(-2)
        for lab in labels:
            lab.set_z_index(2)
        for dot in nodes:
            dot.set_z_index(1)
        title = T("TRANSATLANTIC BOTNET", 44, GOLD).to_edge(m.UP, buff=0.42)
        elite = T("ELITE EXTRACTION ENGINE", 34, HER, "NORMAL").next_to(title, m.DOWN, buff=0.16)
        return m.VGroup(title, elite, nodes, labels, edges), nodes, labels, edges

    def shot_S10_15(self):
        base, nodes, labels, edges = self._map()
        proc = T("PROCESSING POWER", 36, OK).shift(m.DOWN * 2.85)
        head = m.VGroup(base[0], base[1], nodes)
        self.add(head)
        self.play(m.LaggedStart(*[m.GrowArrow(e) for e in edges], lag_ratio=0.12), run_time=0.9)
        self.play(m.FadeOut(edges), m.FadeIn(labels), m.FadeIn(proc), run_time=0.45)
        self.until(self.at(0, "botnet"))
        self.until(self.at(0, "processing"))

        # 1 — Middle Passage geometry on map
        self.until(self.at(1, "Middle"))
        hull = m.RoundedRectangle(width=2.4, height=0.65, corner_radius=0.06, stroke_color=HER, stroke_width=3,
                                  fill_color=NAVY2, fill_opacity=0.85)
        hull.move_to(nodes[1].get_center() + m.RIGHT * 1.55 + m.UP * 1.05)
        pack = T("PACKING GEOMETRY", 34, HER).next_to(hull, m.RIGHT, buff=0.22)
        self.play(m.FadeIn(hull), m.FadeIn(pack), run_time=0.7)
        self.until(self.at(1, "Passage"))

        # 2 — minimum resistance / force
        self.until(self.at(2, "resistance"))
        force = T("INSTRUMENTAL FORCE", 36, HER).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeIn(force), hull.animate.set_stroke(width=5), run_time=0.6)
        self.until(self.at(2, "force"))

        # 3 — commodity routes to finance hubs
        self.until(self.at(3, "sugar"))
        goods = T("SUGAR · TOBACCO · COTTON · RICE", 34, GOLD, width=12.0).to_edge(m.DOWN, buff=0.38)
        self.play(m.FadeOut(force), m.FadeOut(hull), m.FadeOut(pack), m.FadeIn(goods), run_time=0.6)
        for i in (2, 3, 4, 5):
            self.play(nodes[i].animate.scale(1.45), run_time=0.25)
            self.play(nodes[i].animate.scale(1 / 1.45), run_time=0.2)
        self.until(self.at(3, "Wall"))
        self.until(self.beat_end(3) - 0.3)
