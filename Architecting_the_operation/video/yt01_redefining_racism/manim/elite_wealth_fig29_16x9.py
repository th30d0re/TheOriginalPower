"""SEG 20 Figure 2.9 — Elite wealth accumulation (rebuilt from tex coordinates)."""

import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import DIM, GOLD, HER, HIM, INK, M, T, YTScene  # noqa: E402

WEALTH = [
    (1913, 11.5), (1916, 13.0), (1919, 16.5), (1922, 17.0), (1925, 20.0),
    (1928, 23.5), (1929, 25.0), (1932, 22.5), (1935, 22.0), (1938, 20.5),
    (1941, 18.0), (1944, 14.5), (1947, 13.0), (1950, 12.5), (1953, 11.5),
    (1956, 11.0), (1959, 10.5), (1962, 10.0), (1965, 9.5), (1968, 9.0),
    (1971, 8.0), (1974, 7.5), (1977, 7.2), (1980, 7.8), (1983, 9.5),
    (1986, 12.0), (1989, 14.0), (1992, 14.0), (1995, 16.0), (1998, 18.5),
    (2001, 19.0), (2004, 20.0), (2007, 22.5), (2010, 20.0), (2013, 21.5),
    (2016, 22.5), (2019, 23.0), (2020, 24.0),
]


def wealth_chart():
    ax = m.Axes(
        x_range=[1910, 2022, 10],
        y_range=[0, 31, 5],
        x_length=10.8,
        y_length=5.4,
        axis_config={"color": DIM, "stroke_width": 2, "include_tip": False},
        x_axis_config={"include_numbers": False},
        y_axis_config={"include_numbers": False},
    )
    ax.move_to([0, -0.55, 0])
    xlab = T("YEAR", 34, DIM).next_to(ax.x_axis, m.DOWN, buff=0.22)
    ylab = T("TOP 0.1% WEALTH SHARE (%)", 34, DIM).next_to(ax.y_axis, m.LEFT, buff=0.35).rotate(90 * m.DEGREES)
    ticks_x = m.VGroup(
        *[T(str(y), 28, DIM).move_to(ax.c2p(y, 0)).shift(m.DOWN * 0.28) for y in (1913, 1929, 1973, 2020)]
    )
    ticks_y = m.VGroup(*[T(str(v), 28, DIM).move_to(ax.c2p(1910, v)).shift(m.LEFT * 0.32) for v in (0, 10, 20, 25)])

    def band(x0, x1, color, opacity):
        bl = ax.c2p(x0, 0)
        tr = ax.c2p(x1, 31)
        rect = m.Rectangle(
            width=tr[0] - bl[0],
            height=tr[1] - bl[1],
            stroke_width=0,
            fill_color=color,
            fill_opacity=opacity,
        )
        rect.move_to([(bl[0] + tr[0]) / 2, (bl[1] + tr[1]) / 2, 0])
        return rect

    blue = band(1935, 1973, HIM, 0.18)
    red = band(1973, 2020, HER, 0.12)
    ref = m.DashedLine(ax.c2p(1910, 25), ax.c2p(2022, 25), color=DIM, stroke_width=3)
    ref_l = T("GILDED AGE ≈ 25%", 28, DIM).next_to(ax.c2p(2014, 25), m.UP, buff=0.08)

    pts = [ax.c2p(x, y) for x, y in WEALTH]
    line = m.VMobject(color=HER, stroke_width=6)
    line.set_points_as_corners(pts)

    return ax, xlab, ylab, ticks_x, ticks_y, blue, red, ref, ref_l, line


def partial_line(ax, n_pts):
    pts = [ax.c2p(x, y) for x, y in WEALTH[:n_pts]]
    if len(pts) < 2:
        return m.Dot(pts[0], radius=0.06, color=HER) if pts else m.VMobject()
    seg = m.VMobject(color=HER, stroke_width=6)
    seg.set_points_as_corners(pts)
    return seg


class EliteWealthFig29(YTScene):
    SOURCE = "Source: Piketty, Saez & Zucman · Figure 2.9"

    def shot_S20_23(self):
        title = T("ELITE WEALTH · Δmax = 0", 40, GOLD).to_edge(m.UP, buff=0.48)
        ax, xlab, ylab, ticks_x, ticks_y, blue, red, ref, ref_l, full_line = wealth_chart()
        frame = m.VGroup(ax, xlab, ylab, ticks_x, ticks_y)
        qual = T("DATA APPROXIMATE · ORDINAL TRAJECTORY", 28, DIM).to_edge(m.DOWN, buff=0.38)
        self.add(title, frame, qual)

        self.until(self.at(0, "Figure"))
        self.until(self.at(1, "axis"))

        self.until(self.at(2, "approximate"))
        seg = partial_line(ax, 8)
        self.play(m.Create(seg), run_time=1.0)

        self.until(self.at(3, "Compression"))
        self.play(m.FadeIn(blue), run_time=0.5)
        seg2 = partial_line(ax, 22)
        self.play(m.Transform(seg, seg2), run_time=1.1)

        self.until(self.at(4, "recovery"))
        self.play(m.FadeIn(red), m.FadeIn(ref), m.FadeIn(ref_l), run_time=0.55)

        self.until(self.at(5, "twenty"))
        seg3 = partial_line(ax, len(WEALTH))
        self.play(m.Transform(seg, seg3), run_time=1.2)
        p29 = m.Dot(ax.c2p(1929, 25), color=GOLD, radius=0.09)
        l29 = T("1929 · 25%", 34, GOLD).next_to(p29, m.UP, buff=0.12)
        self.play(m.FadeIn(p29), m.FadeIn(l29), run_time=0.4)

        self.until(self.at(6, "markers"))
        for year, color in ((1929, INK), (1965, "#E8A04C"), (1973, INK), (1994, INK)):
            vline = m.DashedLine(ax.c2p(year, 0), ax.c2p(year, 28), color=color, stroke_width=2)
            self.play(m.FadeIn(vline), run_time=0.22)

        self.until(self.at(7, "2020"))
        p20 = m.Dot(ax.c2p(2020, 24), color=GOLD, radius=0.09)
        l20 = T("2020 · 24%", 34, GOLD).next_to(p20, m.LEFT, buff=0.15)
        self.play(m.FadeIn(p20), m.FadeIn(l20), run_time=0.45)

        self.until(self.at(8, "percentage"))
        restore = T("NEAR-RESTORATION TO 1929 PEAK", 34, INK).next_to(qual, m.UP, buff=0.12)
        self.play(m.FadeIn(restore), run_time=0.4)
        self.until(self.beat_end(8) - 0.2)
