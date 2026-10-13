"""Reel: impedance matching with a person. Smith chart, reflection, phase, conjugate match.

Physics follows the book's Extraction Chart appendix (Eq. XC.1-XC.3): Gamma = (z-1)/(z+1),
the unit disk, |Gamma| = 0 at the center and 1 on the rim. The walk-in is a two-element
match: along the r = 0.3 circle (series element) to the g = 1 circle, then along it (shunt
element) to the center.

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/impedance_match.py ImpedanceMatch \
        -r 1080x1920 --fps 30 -o outputs/REEL_impedance_match/video/impedance_match.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, M, T, UEFReel  # noqa: E402

C = np.array([0.0, -1.3, 0.0])   # chart center
R = 3.3                            # chart radius
LY = 4.3                           # transmission-line baseline
X0, X1 = -2.35, 2.35               # line ends: source, load
K = 2.6
ZL = 0.3 + 0.9j                    # their load


def tag(s, size=32, color=INK):
    t = T(s, size, color)
    t.add_background_rectangle(color="#121212", opacity=0.9, buff=0.08)
    return t


def gam(z):
    return (z - 1) / (z + 1)


def P(g):
    return C + R * np.array([g.real, g.imag, 0.0])


def curve(zs, color=DIM, width=2, opacity=0.55):
    pts = [P(gam(z)) for z in zs if abs(gam(z)) <= 1.0001]
    return m.VMobject(stroke_color=color, stroke_width=width).set_points_smoothly(pts).set_stroke(opacity=opacity)


def smith_grid():
    s = np.tan(np.linspace(-1.55, 1.55, 160))
    t = np.concatenate([np.linspace(0, 1, 40), np.tan(np.linspace(np.pi / 4, 1.555, 80))])
    g = m.VGroup(m.Circle(radius=R, color=INK, stroke_width=4).move_to(C),
                 m.Line(C + R * m.LEFT, C + R * m.RIGHT, color=DIM, stroke_width=2).set_stroke(opacity=0.55))
    for r in (0.3, 1.0, 3.0):
        g.add(curve(r + 1j * s))
    for x in (0.4, 1.0, 2.5):
        g.add(curve(t + 1j * x), curve(t - 1j * x))
    return g


class ImpedanceMatch(UEFReel):
    EP = "REEL_impedance_match"
    SOURCE = "Source: The Original Power, Extraction Chart"

    def construct(self):
        self.begin()
        B = self.BEATS
        ph = m.ValueTracker(0.0)       # travel
        gm = m.ValueTracker(0.72)      # reflected amplitude |Gamma|
        mix = m.ValueTracker(0.0)      # mixed-signal distortion on the source
        stand = m.ValueTracker(0.0)    # 0: incident and reflected drawn apart, 1: drawn as their sum

        def inc(x):
            return np.sin(K * x - ph.get_value()) + mix.get_value() * 0.8 * np.sin(2.7 * K * x - 1.9 * ph.get_value() + 1.3)

        def ref(x):
            return gm.get_value() * np.sin(K * (2 * X1 - x) - ph.get_value() + np.pi)

        def wave(f, y, color, w=5):
            return m.FunctionGraph(lambda x: y + 0.42 * f(x), x_range=[X0, X1, 0.02], color=color, stroke_width=w)

        s = stand
        w_inc = m.always_redraw(lambda: wave(inc, LY + 0.75 * (1 - s.get_value()), GOLD).set_stroke(opacity=1 - s.get_value()))
        w_ref = m.always_redraw(lambda: wave(ref, LY - 0.75 * (1 - s.get_value()), HER).set_stroke(opacity=1 - s.get_value()))
        w_sum = m.always_redraw(lambda: wave(lambda x: inc(x) + ref(x), LY, GOLD, 6).set_stroke(opacity=s.get_value()))
        src = m.VGroup(m.RoundedRectangle(width=1.3, height=1.0, corner_radius=0.15, color=GOLD, fill_opacity=0.15),
                       T("YOU", 32, GOLD)).move_to([X0 - 0.7, LY, 0])
        src[1].move_to(src[0])
        load = m.VGroup(m.RoundedRectangle(width=1.3, height=1.0, corner_radius=0.15, color=HIM, fill_opacity=0.15),
                        T("THEM", 32, HIM)).move_to([X1 + 0.7, LY, 0])
        load[1].move_to(load[0])

        def run(tgt):
            dur = max(0.2, tgt - self.time)
            self.play(ph.animate.increment_value(3.2 * dur), run_time=dur, rate_func=m.linear)

        def go(*anims, rt=0.5, **kw):
            self.play(*anims, ph.animate.increment_value(3.2 * rt), run_time=rt, rate_func=kw.get("rate_func", m.smooth))

        def cap(lines, y=-5.55):
            g = m.VGroup(*[T(a, sz, c) for a, sz, c in lines]).arrange(m.DOWN, buff=0.14).move_to([0, y, 0])
            go(m.FadeIn(g, shift=m.UP * 0.2), rt=0.4)
            return g

        # 0 ── a signal into a load it isn't matched to: part bounces back
        title = T("IMPEDANCE MATCHING", 54, GOLD).move_to([0, 6.35, 0])
        self.play(m.Write(title), m.FadeIn(src), m.FadeIn(load), run_time=0.8)
        self.add(w_inc, w_ref)
        self.until(self.cue(0, "bounces"))
        c0 = cap([("PART OF IT BOUNCES BACK", 40, HER), ("REFLECTION", 34, DIM)], y=1.6)
        run(B[1] - 0.3)
        go(m.FadeOut(c0), rt=0.3)

        # 1 ── the reflection coefficient; z = 1 gives Gamma = 0
        self.until(self.cue(1, "gamma"))
        eq = M(r"\Gamma = \frac{z - 1}{z + 1}", 96, INK).move_to([0, 0.9, 0])
        go(m.Write(eq), rt=0.9)
        self.until(self.cue(1, "When"))
        z1 = M(r"z = 1 \;\Rightarrow\; \Gamma = 0", 66, OK).move_to([0, -1.2, 0])
        go(m.FadeIn(z1), gm.animate.set_value(0.0), rt=1.2)
        self.until(self.cue(1, "absorbed"))
        c1 = cap([("EVERYTHING YOU SEND GETS ABSORBED", 36, OK), ("THAT'S A MATCH", 46, OK)], y=-2.9)
        run(B[2] - 0.3)
        go(m.FadeOut(c1), m.FadeOut(z1), eq.animate.scale(0.5).move_to([2.75, 2.55, 0]), rt=0.4)

        # 2 ── the Smith chart: center = match, rim = total reflection
        grid = smith_grid()
        self.until(self.cue(2, "Smith"))
        go(m.Create(grid), rt=1.4, rate_func=m.linear)
        self.until(self.cue(2, "center"))
        ctr = m.Dot(C, radius=0.12, color=OK)
        ctl = tag("MATCH  Γ = 0", 30, OK).next_to(ctr, m.DR, buff=0.12)
        go(m.FadeIn(ctr, scale=2), m.FadeIn(ctl), rt=0.5)
        self.until(self.cue(2, "rim"))
        rim = m.Circle(radius=R, color=HER, stroke_width=9).move_to(C)
        rl = tag("TOTAL REFLECTION  |Γ| = 1", 32, HER).move_to(C + m.DOWN * (R + 0.45))
        go(m.Create(rim), m.FadeIn(rl), rt=0.8)
        self.until(self.cue(2, "straight"))
        gL = gam(ZL)
        pt = m.Dot(P(gL), radius=0.16, color=HIM)
        ptl = tag("THEM, RIGHT NOW", 30, HIM).next_to(pt, m.RIGHT, buff=0.15)
        go(m.FadeIn(pt, scale=2), m.FadeIn(ptl), gm.animate.set_value(abs(gL)), rt=0.6)
        run(B[3] - 0.3)
        go(m.FadeOut(rim), m.FadeOut(rl), rt=0.3)

        # 3 ── reflected + sent = a standing wave
        self.add(w_sum)
        self.until(self.cue(3, "standing"))
        go(s.animate.set_value(1.0), rt=1.0)
        self.until(self.cue(3, "Same"))
        c3 = cap([("SAME ARGUMENT · SAME SPOT", 40, HER), ("EVERY WEEK", 34, DIM)])
        run(B[4] - 0.3)
        go(m.FadeOut(c3), rt=0.3)

        # 4 ── check the source: some of the reflection is your own signal
        self.until(self.cue(4, "check"))
        go(s.animate.set_value(0.0), src[0].animate.set_fill(GOLD, opacity=0.45), rt=0.8)
        self.until(self.cue(4, "own"))
        c4 = cap([("CHECK THE SOURCE FIRST", 42, GOLD), ("SOME OF WHAT BOUNCES", 36, INK), ("BACK IS YOURS", 36, INK)])
        self.until(self.cue(4, "saying"))
        sd = m.VGroup(T("SAYING", 34, GOLD), T("≠", 40, HER), T("DOING", 34, GOLD)).arrange(m.RIGHT, buff=0.25)
        sd.move_to([-0.8, LY - 1.45, 0])
        go(m.FadeIn(sd), mix.animate.set_value(1.0), gm.animate.set_value(0.9), rt=1.2)
        self.until(self.cue(4, "mismatch"))
        go(m.FadeOut(c4), rt=0.25)
        c4b = cap([("THE MIXED SIGNAL IS THE MISMATCH", 38, HER)])
        run(B[5] - 0.3)
        go(m.FadeOut(c4b), m.FadeOut(sd), mix.animate.set_value(0.0), gm.animate.set_value(abs(gL)),
           src[0].animate.set_fill(GOLD, opacity=0.15), rt=0.4)

        # 5 ── jumping to the center reflects even harder
        self.until(self.cue(5, "jump"))
        jump = m.Arrow(P(gL), C, buff=0.2, color=GOLD, stroke_width=8)
        go(m.GrowArrow(jump), rt=0.6)
        self.until(self.cue(5, "reflects"))
        far = P(0.97 * gL / abs(gL))
        go(m.FadeOut(jump), pt.animate.move_to(far), gm.animate.set_value(0.97), rt=0.6)
        c5 = cap([("A HUGE SIGNAL INTO A FAR LOAD", 34, INK), ("REFLECTS EVEN HARDER", 44, HER)])
        run(B[6] - 0.3)
        go(m.FadeOut(c5), pt.animate.move_to(P(gL)), gm.animate.set_value(abs(gL)), rt=0.4)

        # 6 ── walk it in: along r = 0.3 to the g = 1 circle, then along g = 1 to the center
        xt = m.ValueTracker(0.9)   # series reactance on the r = 0.3 circle
        bt = m.ValueTracker(0.0)   # added shunt susceptance on the g = 1 circle
        x_hit = np.sqrt(0.3 - 0.09)          # where r = 0.3 meets g = 1
        y_hit = 1 / (0.3 + 1j * x_hit)       # = 1 - j1.528

        def walker():
            if bt.get_value() == 0.0:
                return gam(0.3 + 1j * xt.get_value())
            y = y_hit + 1j * bt.get_value()
            return gam(1 / y)

        pt.add_updater(lambda d: d.move_to(P(walker())))
        gm.add_updater(lambda v: v.set_value(abs(walker())))
        trail = m.TracedPath(pt.get_center, stroke_color=GOLD, stroke_width=6)
        rc = curve(0.3 + 1j * np.tan(np.linspace(-1.55, 1.55, 160)), color=GOLD, width=3, opacity=0.9)
        gc = m.Circle(radius=R / 2, color=OK, stroke_width=3).move_to(C + R / 2 * m.LEFT)
        self.until(self.cue(6, "walk"))
        go(m.FadeOut(ptl), m.Create(rc), rt=0.6)
        self.add(trail)
        self.until(self.cue(6, "One"))
        go(xt.animate.set_value(x_hit), m.Create(gc), rt=max(0.6, self.cue(6, "next") - self.time))
        e1 = tag("STEP 1", 30, GOLD).next_to(pt, m.RIGHT, buff=0.2)
        go(m.FadeIn(e1), rt=0.3)
        bt.set_value(1e-6)
        go(bt.animate.set_value(-y_hit.imag), rt=max(0.8, self.cue(6, "land") + 0.6 - self.time))
        e2 = tag("STEP 2", 30, OK).next_to(C, m.UP + m.LEFT, buff=0.3)
        go(m.FadeIn(e2), m.Flash(C, color=OK), rt=0.4)
        self.until(self.cue(6, "plainly") - 0.6)
        c6 = cap([("SAY WHAT YOU NEED PLAINLY", 38, GOLD)])
        self.until(self.cue(6, "Make"))
        c6b = T("MAKE THE NEXT PLAN EASY TO KEEP", 36, OK).next_to(c6, m.DOWN, buff=0.15)
        go(m.FadeIn(c6b), rt=0.4)
        run(B[7] - 0.3)
        pt.clear_updaters()
        gm.clear_updaters()
        trail.clear_updaters()
        chart = m.VGroup(grid, ctr, ctl, rc, gc, trail, pt, e1, e2, eq)
        go(m.FadeOut(chart), m.FadeOut(c6), m.FadeOut(c6b), rt=0.4)

        # 7 ── phase: same frequency, timing off, they cancel; line up and they add
        dl = m.ValueTracker(np.pi)
        YA, YB, YS = 1.4, -0.4, -2.6
        pa = m.always_redraw(lambda: m.FunctionGraph(lambda x: YA + 0.4 * np.sin(K * x - ph.get_value()), x_range=[-3.4, 3.4],
                                                     color=GOLD, stroke_width=5))
        pb = m.always_redraw(lambda: m.FunctionGraph(lambda x: YB + 0.4 * np.sin(K * x - ph.get_value() + dl.get_value()),
                                                     x_range=[-3.4, 3.4], color=HIM, stroke_width=5))
        psum = m.always_redraw(lambda: m.FunctionGraph(
            lambda x: YS + 0.4 * (np.sin(K * x - ph.get_value()) + np.sin(K * x - ph.get_value() + dl.get_value())),
            x_range=[-3.4, 3.4], color=OK, stroke_width=7))
        la = T("YOU", 32, GOLD).move_to([-3.0, YA + 0.75, 0])
        lb = T("THEM", 32, HIM).move_to([-2.9, YB + 0.75, 0])
        ls = T("TOGETHER", 32, OK).move_to([-2.6, YS + 1.15, 0])
        self.until(self.cue(7, "phase"))
        ph_t = T("PHASE", 48, INK).move_to([0, 2.7, 0])
        go(m.FadeIn(ph_t), m.FadeIn(pa), m.FadeIn(pb), m.FadeIn(la), m.FadeIn(lb), rt=0.6)
        self.until(self.cue(7, "cancel"))
        go(m.FadeIn(psum), m.FadeIn(ls), rt=0.4)
        c7 = cap([("SAME FREQUENCY · TIMING OFF", 36, INK), ("THEY CANCEL", 44, HER)], y=-4.7)
        self.until(self.cue(7, "Match"))
        go(m.FadeOut(c7), dl.animate.set_value(0.0), rt=1.6)
        c7b = cap([("MATCH THEIR RHYTHM", 44, OK), ("WHEN THEY HAVE ROOM", 34, DIM), ("HOW THEY HEAR HARD NEWS", 34, DIM)], y=-4.7)
        run(B[8] - 0.3)
        go(*[m.FadeOut(x) for x in (pa, pb, psum, la, lb, ls, ph_t, c7b)], rt=0.4)

        # 8 ── the book: the system matches itself to you to extract; between people, both ways
        self.until(self.cue(8, "system"))
        sys_n = m.VGroup(m.Circle(radius=1.0, color=HER, fill_opacity=0.15), T("THE\nSYSTEM", 30, HER))
        you_n = m.VGroup(m.Circle(radius=1.0, color=GOLD, fill_opacity=0.15), T("YOU", 32, GOLD))
        sys_n.move_to([-2.0, 1.2, 0])
        you_n.move_to([2.0, 1.2, 0])
        a1 = m.Arrow(sys_n.get_right(), you_n.get_left(), buff=0.15, color=HER, stroke_width=7)
        go(m.FadeIn(sys_n), m.FadeIn(you_n), m.GrowArrow(a1), rt=0.6)
        self.until(self.cue(8, "extract"))
        ex = T("MATCHES ITSELF TO YOU · EXTRACTS", 32, HER).move_to([0, -0.3, 0])
        go(m.FadeIn(ex), rt=0.4)
        self.until(self.cue(8, "Between"))
        p1 = m.VGroup(m.Circle(radius=0.7, color=GOLD, fill_opacity=0.15), T("YOU", 32, GOLD)).move_to([-2.0, -2.6, 0])
        p2 = m.VGroup(m.Circle(radius=0.7, color=HIM, fill_opacity=0.15), T("THEM", 32, HIM)).move_to([2.0, -2.6, 0])
        a2 = m.DoubleArrow(p1.get_right(), p2.get_left(), buff=0.15, color=OK, stroke_width=7)
        go(m.FadeIn(p1), m.FadeIn(p2), m.GrowArrow(a2), rt=0.6)
        self.until(self.cue(8, "both"))
        bw = T("BETWEEN TWO PEOPLE: BOTH WAYS", 36, OK).move_to([0, -4.1, 0])
        go(m.FadeIn(bw), rt=0.4)
        run(B[9] - 0.3)
        go(*[m.FadeOut(x) for x in (sys_n, you_n, a1, ex, p1, p2, a2, bw)], rt=0.4)

        # 9 ── conjugate match: both tune toward each other until nothing bounces back
        grid2 = smith_grid()
        go(m.FadeIn(grid2), m.FadeIn(ctr), rt=0.5)
        zs = 0.3 - 0.9j
        u = m.ValueTracker(0.0)

        def path(z0, k):
            return gam(1 + (z0 - 1) * (1 - k))

        dy = m.always_redraw(lambda: m.Dot(P(path(zs, u.get_value())), radius=0.16, color=GOLD))
        dt = m.always_redraw(lambda: m.Dot(P(path(ZL, u.get_value())), radius=0.16, color=HIM))
        ly = tag("YOU", 32, GOLD).next_to(P(gam(zs)), m.RIGHT, buff=0.2)
        lt = tag("THEM", 32, HIM).next_to(P(gam(ZL)), m.RIGHT, buff=0.2)
        self.until(self.cue(9, "conjugate"))
        cj = M(r"Z_S = Z_L^{*}", 80, INK).move_to([0, 3.0, 0])
        go(m.FadeIn(dy), m.FadeIn(dt), m.FadeIn(ly), m.FadeIn(lt), m.Write(cj), rt=0.8)
        self.until(self.cue(9, "Both"))
        go(m.FadeOut(ly), m.FadeOut(lt), u.animate.set_value(1.0), gm.animate.set_value(0.0), rt=2.2)
        go(m.Flash(C, color=OK, flash_radius=0.6), rt=0.5)
        c9 = cap([("BOTH OF YOU TUNE", 50, OK), ("UNTIL NOTHING BOUNCES BACK", 34, INK)])
        run(self.END)
        self.end_card()
