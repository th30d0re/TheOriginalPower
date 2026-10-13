"""Long-form reel: the Interference Engine, in 3-D.

A port of website/src/components/visualizations/InterferenceEngine3D.tsx: the same twelve axes
and carrier intensities, the same radiating E⊥B wave arms, the same worker integration
F = q(E + v × Σ ρ_k B_k) with velocity damping ζ, the same resonance response A(ω, ζ), and the
same quadrant names. Website y (up) is manimgx z here.

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/interference_engine.py InterferenceEngine \
        -r 1080x1920 --fps 30 -o outputs/UEF_interference_engine/video/interference_engine.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, INK, M, T, UEFReel3D  # noqa: E402

D = m.DEGREES
BGC = "#02040A"
CYAN = "#22D3EE"
RED = "#EF4444"
AMBER = "#FBBF24"

AXES = [  # name, color, 4-yr carrier intensity, measured
    ("Race", "#EF4444", 1.0, True), ("Ethnicity", "#FB7185", 0.85, False), ("Class", "#F59E0B", 0.6, True),
    ("Sex", "#EC4899", 0.18, False), ("Gender", "#A855F7", 0.15, True), ("Sexuality", "#D946EF", 0.72, True),
    ("Disability", "#10B981", 0.4, False), ("Neurodivergence", "#14B8A6", 0.3, False), ("Religion", "#EAB308", 0.25, False),
    ("Age", "#F97316", 0.35, False), ("Body / height", "#3B82F6", 0.25, False), ("Nationality", "#06B6D4", 0.6, False),
]
QUADS = [("QI · COOPERATIVE", CYAN), ("QII · FASCIST INVERSION", RED), ("QIII · COLLAPSE", "#B91C1C"), ("QIV · REPARATIVE", "#38BDF8")]
WORKERS = [(1.0, 1.2, 0.0, 1.4), (0.8, -1.0, 0.6, 1.5), (1.2, 0.2, -1.1, 1.3),
           (0.9, -0.7, -0.8, 1.6), (1.1, 0.9, 0.9, 1.35), (0.75, -1.3, 0.1, 1.45)]
OMEGA0 = 2.0
PER_WEDGE = 2
RS = np.linspace(0.35, 6.2, 40)
KK = 2.6


def resonance(w, z):
    a = 1 / (np.sqrt((OMEGA0 ** 2 - w ** 2) ** 2 + (2 * z * OMEGA0 * w) ** 2) or 1)
    peak = 1 / (2 * z * OMEGA0 ** 2 * np.sqrt(max(1e-6, 1 - z ** 2)))
    return min(1.0, a / peak)


def shade(hexcol, dl, ds=0.0):
    import colorsys
    r, g, b = (int(hexcol[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    r, g, b = colorsys.hls_to_rgb(h, float(np.clip(l + dl, 0, 1)), float(np.clip(s + ds, 0, 1)))
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


class InterferenceEngine(UEFReel3D):
    EP = "UEF_interference_engine"
    SOURCE = "Source: The Original Power, eq. 0.1, eq. 8.12-8.16, Ch. 21; UEF draft §IX"

    # ── live parameters (the website's sliders) ───────────────────────────────
    def params(self):
        self.t = 0.0
        self.R = m.ValueTracker(2.0)
        self.theta = m.ValueTracker(60.0)
        self.omega = m.ValueTracker(2.0)
        self.zeta = m.ValueTracker(0.15)
        self.fon = m.ValueTracker(1.0)        # fields on/off (the status wage, switched)
        self.speed = m.ValueTracker(1.0)
        self.rho = [m.ValueTracker(a[2]) for a in AXES]

    def psiM(self):
        return self.R.get_value() * np.cos(self.theta.get_value() * D)

    def drive(self):
        return resonance(self.omega.get_value(), self.zeta.get_value())

    def netB(self):
        n = len(AXES)
        R, w, dr, f = self.R.get_value(), self.omega.get_value(), self.drive(), self.fon.get_value()
        b = np.zeros(3)
        for k in range(n):
            a = k / n * 2 * np.pi
            mag = self.rho[k].get_value() * np.sin(self.t * w + k) * R * (0.3 + 0.9 * dr) * f
            b[0] += np.cos(a) * mag
            b[1] += np.sin(a) * mag
        return b

    # ── the engine's geometry ─────────────────────────────────────────────────
    def build_engine(self):
        self.rings = m.VGroup(*[m.Circle(radius=0.7 + i * 0.42, stroke_width=2,
                                         color="#7F1D1D" if i % 2 == 0 else "#1E3A8A")
                                .set_stroke(opacity=max(0.04, 0.45 / (1 + (0.7 + i * 0.42) * 0.55)))
                                .shift(m.IN * 0.15) for i in range(14)])
        self.axis_line = m.DashedLine([0, 0, -4], [0, 0, 4], color=CYAN, stroke_width=2).set_stroke(opacity=0.5)
        self.e_arrow = m.Line(m.ORIGIN, m.OUT, color=CYAN, stroke_width=10)
        self.e_tip = m.Dot3D(m.OUT, radius=0.12, color=CYAN)
        self.bob = m.Sphere(radius=0.36, resolution=(12, 12), fill_color=m.WHITE, checkerboard_colors=False)
        self.halo = m.Sphere(radius=0.62, resolution=(12, 12), fill_color="#BFE9FF", fill_opacity=0.22, checkerboard_colors=False)
        self.arms = []
        for k, (name, col, inten, meas) in enumerate(AXES):
            e_col = shade(col, 0.1, 0 if meas else -0.28)
            b_col = shade(col, -0.16, -0.05 if meas else -0.33)
            for j in range(PER_WEDGE):
                e = m.VMobject(stroke_color=e_col, stroke_width=4)
                b = m.VMobject(stroke_color=b_col, stroke_width=4)
                self.arms.append((k, j, e, b))
        self.arm_group = m.VGroup(*[x for a in self.arms for x in a[2:]])
        self.update_engine(0)

    def update_engine(self, dt):
        self.t += dt * self.speed.get_value()
        t, R, w, th, dr, f = self.t, self.R.get_value(), self.omega.get_value(), self.theta.get_value() * D, self.drive(), self.fon.get_value()
        n = len(AXES)
        span = 2 * np.pi / n * 0.72
        ramp = np.minimum(1, RS / 1.4)
        decay = 2.0 / (1.0 + RS)
        for k, j, e, b in self.arms:
            rho = self.rho[k].get_value()
            amp0 = (0.5 + 0.25 * R) * (0.04 + 0.96 * rho) * (0.3 + 0.9 * dr) * f
            phi = k / n * 2 * np.pi + (j / (PER_WEDGE - 1) - 0.5) * span
            c, s = np.cos(phi), np.sin(phi)
            off = amp0 * ramp * decay * np.sin(w * t - KK * RS)
            cx, cy = RS * c, RS * s
            e.set_points_as_corners(np.stack([cx, cy, off], 1))
            b.set_points_as_corners(np.stack([cx - off * s, cy + off * c, np.zeros_like(RS)], 1))
            iB = (0.14 + 0.82 * rho) * (1 if AXES[k][3] else 0.82)
            e.set_stroke(opacity=f * min(1, iB * (0.5 + 0.5 * abs(np.cos(th)))))
            b.set_stroke(opacity=f * min(1, iB * (0.4 + 0.6 * abs(np.sin(th)))))
        zb = (0.45 + 0.15 * R) * (0.3 + 0.9 * dr) * np.sin(w * t) * (0.25 + 0.75 * f)
        self.bob.move_to([0, 0, zb])
        self.halo.move_to([0, 0, zb])
        pm = self.psiM()
        col = RED if pm < 0 else CYAN
        tip = np.array([0, 0, 1.4 * pm + (0.001 if pm >= 0 else -0.001)])
        self.e_arrow.put_start_and_end_on(m.ORIGIN, tip).set_color(col)
        self.e_tip.move_to(tip).set_color(col)

    # ── buffer-class workers: live Lorentz integration (website ChargeParticle) ─
    def add_worker(self, i):
        q, x0, y0, v0 = WORKERS[i]
        dot = m.Sphere(radius=0.13, resolution=(8, 8), fill_color=AMBER, checkerboard_colors=False).move_to([x0, y0, -2.5])
        w = {"q": q, "x0": x0, "y0": y0, "v0": v0, "pos": np.array([x0, y0, -2.5]), "vel": np.array([0, 0, v0]), "dot": dot}
        w["trail"] = m.TracedPath(dot.get_center, dissipating_time=2.4, stroke_color=AMBER, stroke_width=4)
        self.workers.append(w)
        self.add(w["trail"], dot)
        return w

    def step_workers(self, dt):
        if dt <= 0:
            return
        E = np.array([0, 0, self.psiM()])
        Bv = self.netB()
        z = self.zeta.get_value()
        for w in self.workers:
            for _ in range(2):
                h = dt / 2
                F = w["q"] * (E + np.cross(w["vel"], Bv))
                w["vel"] = (w["vel"] + F * h) * np.exp(-2 * z * h)
                sp = np.linalg.norm(w["vel"])
                if sp > 6:
                    w["vel"] *= 6 / sp
                w["pos"] = w["pos"] + w["vel"] * h
            p = w["pos"]
            if np.linalg.norm(p) > 6 or p[2] > 4.2 or p[2] < -4.2:
                w["pos"] = np.array([w["x0"], w["y0"] + np.random.uniform(-0.25, 0.25), -2.5])
                w["vel"] = np.array([0, 0, w["v0"]])
                w["dot"].move_to(w["pos"])
                self.remove(w["trail"])
                w["trail"] = m.TracedPath(w["dot"].get_center, dissipating_time=2.4, stroke_color=AMBER, stroke_width=4)
                self.add(w["trail"])
            w["dot"].move_to(w["pos"])

    # ── flat overlays ─────────────────────────────────────────────────────────
    def show_flat(self, *mobs, rt=0.4):
        self.flat(*mobs)
        for x in mobs:
            x.set_opacity(0)
        self.play(*[x.animate.set_opacity(1) for x in mobs], run_time=rt)

    def hide_flat(self, *mobs, rt=0.3):
        self.play(*[x.animate.set_opacity(0) for x in mobs], run_time=rt)
        self.remove(*mobs)

    def caption(self, lines, y=4.7):
        g = m.VGroup(*[T(s, sz, c) for s, sz, c in lines]).arrange(m.DOWN, buff=0.12).move_to([0, y, 0])
        self.show_flat(g)
        return g

    def legend(self):
        rows = []
        for k, (name, col, inten, meas) in enumerate(AXES):
            sw = m.Square(side_length=0.28, fill_color=col, fill_opacity=1 if meas else 0.45, stroke_width=0)
            nm = T(name + ("" if meas else "*"), 28, col, "NORMAL")
            nm.scale_to_fit_height(0.27)
            rows.append(m.VGroup(sw, nm).arrange(m.RIGHT, buff=0.12))
        left = m.VGroup(*rows[:6]).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.24).move_to([-3.6, -4.95, 0], aligned_edge=m.LEFT)
        right = m.VGroup(*rows[6:]).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.24).move_to([0.1, -4.95, 0], aligned_edge=m.LEFT)
        bars = m.VGroup()
        for k, row in enumerate(rows):
            x0 = (-1.25 if k < 6 else 2.85)
            y = row.get_center()[1]
            bars.add(m.Line([x0, y, 0], [x0 + 0.85, y, 0], color=AXES[k][1], stroke_width=10))
        self.bar_x0 = [(-1.25 if k < 6 else 2.85) for k in range(12)]
        self.bars = bars
        head = T("FIELD WEIGHTS ρₖ  (4-YEAR CARRIER POWER)", 28, DIM, "NORMAL").move_to([0, -3.15, 0])
        foot = T("* estimated · no spectral series yet", 26, DIM, "NORMAL").move_to([0, -6.8, 0])
        return m.VGroup(head, left, right, bars, foot), rows

    def sync_bars(self, _dt=0):
        for k, bar in enumerate(self.bars):
            y = bar.get_start()[1]
            x0 = self.bar_x0[k]
            bar.put_start_and_end_on([x0, y, 0], [x0 + 0.02 + 0.85 * self.rho[k].get_value(), y, 0])

    def phasor_panel(self):
        PC = np.array([-1.9, -4.75, 0])
        RP = 1.55
        sc = RP / 4.0
        ax = m.VGroup(m.Line(PC + m.LEFT * RP, PC + m.RIGHT * RP, color="#334155", stroke_width=3),
                      m.Line(PC + m.DOWN * RP, PC + m.UP * RP, color="#334155", stroke_width=3))
        lab = m.VGroup(T("Re ψₘ", 26, CYAN, "NORMAL").next_to(PC + m.RIGHT * RP, m.DOWN, buff=0.1),
                       T("Im ψₛ", 26, "#A855F7", "NORMAL").next_to(PC + m.UP * RP, m.RIGHT, buff=0.1))

        def quad():
            return int(((self.theta.get_value() % 360) // 90)) % 4

        def shade_q():
            q = quad()
            sx = 1 if q in (0, 3) else -1
            sy = 1 if q in (0, 1) else -1
            return m.Square(side_length=RP, stroke_width=0, fill_color=QUADS[q][1], fill_opacity=0.16).move_to(PC + RP / 2 * np.array([sx, sy, 0]))

        def vec():
            th = self.theta.get_value() * D
            tip = PC + sc * self.R.get_value() * np.array([np.cos(th), np.sin(th), 0])
            return m.VGroup(m.Line(PC, tip, color=QUADS[quad()][1], stroke_width=7), m.Dot(tip, radius=0.09, color=QUADS[quad()][1]))

        sh = m.always_redraw(shade_q)
        v = m.always_redraw(vec)
        circ = m.always_redraw(lambda: m.Circle(radius=sc * self.R.get_value(), color="#1E293B", stroke_width=2).move_to(PC))
        RX = 1.75
        w_eq = M(r"W = \psi_m + j\psi_s", 44, INK).move_to([RX, -3.7, 0])
        qtxt = m.always_redraw(lambda: T(QUADS[quad()][0], 30, QUADS[quad()][1], width=4.0).move_to([RX, -4.55, 0]))
        tt = m.always_redraw(lambda: T(f"θ = {self.theta.get_value() % 360:.0f}°", 30, INK, "NORMAL").move_to([RX, -5.2, 0]))
        pm = m.always_redraw(lambda: T(f"ψₘ = {self.psiM():+.2f}" + ("  extraction" if self.psiM() < 0 else ""), 28,
                                       RED if self.psiM() < 0 else CYAN, "NORMAL").move_to([RX, -5.75, 0]))
        return m.VGroup(sh, ax, circ, v, lab, w_eq, qtxt, tt, pm)

    def resonance_panel(self):
        O = np.array([-3.1, -6.1, 0])
        Wd, Ht = 6.2, 2.1
        sx = lambda w: O[0] + (w - 0.5) / 4.5 * Wd
        sy = lambda a: O[1] + a * Ht
        base = m.Line([O[0], O[1], 0], [O[0] + Wd, O[1], 0], color="#334155", stroke_width=3)
        w0 = m.DashedLine([sx(OMEGA0), O[1], 0], [sx(OMEGA0), O[1] + Ht + 0.1, 0], color="#475569", stroke_width=3)
        w0l = M(r"\omega_0", 36, DIM).next_to([sx(OMEGA0), O[1], 0], m.DOWN, buff=0.1)
        curve = m.always_redraw(lambda: m.VMobject(stroke_color=RED, stroke_width=5).set_points_smoothly(
            [np.array([sx(w), sy(resonance(w, self.zeta.get_value())), 0]) for w in np.linspace(0.5, 5.0, 90)]))
        dot = m.always_redraw(lambda: m.Dot([sx(self.omega.get_value()), sy(self.drive()), 0], radius=0.12, color=AMBER))
        ttl = M(r"A(\omega) = \frac{1}{\sqrt{(\omega_0^2-\omega^2)^2 + (2\zeta\omega_0\omega)^2}}", 40, INK).move_to([0, -3.45, 0])
        rd = m.always_redraw(lambda: T(f"ω = {self.omega.get_value():.1f}   ζ = {self.zeta.get_value():.2f}   A = {100 * self.drive():.0f}%",
                                       28, AMBER, "NORMAL").move_to([0, -6.75, 0]))
        return m.VGroup(base, w0, w0l, curve, dot, ttl, rd)

    # ── the reel ──────────────────────────────────────────────────────────────
    def construct(self):
        self.begin()
        self.camera.background_color = BGC
        B = self.BEATS
        self.params()
        self.workers = []
        self.set_camera_orientation(phi=64 * D, theta=-62 * D, zoom=0.86, frame_center=[0, 0, -0.55])
        self.add(m.AmbientLight(intensity=0.85))
        self.build_engine()
        self.add(self.rings, self.axis_line, self.arm_group, self.e_arrow, self.e_tip, self.halo, self.bob)
        self.add_updater(self.update_engine)
        self.add_updater(self.step_workers)
        self.begin_ambient_camera_rotation(rate=0.07)

        # 0 ── cold open: the engine running, three workers caught in it
        for i in range(3):
            self.add_worker(i)
        title = T("THE INTERFERENCE ENGINE", 54, GOLD).move_to([0, 6.4, 0])
        self.show_flat(title, rt=0.8)
        self.until(self.cue(0, "Interference") - 0.1)
        sub = T("PHASED-ARRAY SIGNAL JAMMING", 32, DIM).move_to([0, 5.75, 0])
        self.show_flat(sub)

        # 1 ── the governing equation; reset to an empty field
        self.until(B[1] - 0.3)
        for w in self.workers:
            self.remove(w["dot"], w["trail"])
        self.workers = []
        self.play(self.fon.animate.set_value(0.0), run_time=0.6)
        self.until(self.cue(1, "Force"))
        eq = M(r"\vec F = q\vec E + q\Big(\vec v \times \sum_k \rho_k \vec B_k\Big)", 60, INK).move_to([0, 4.7, 0])
        self.show_flat(eq, rt=0.9)

        # 2 ── each B_k is an axis; rho_k is the weight (website legend)
        leg, rows = self.legend()
        self.until(self.cue(2, "Each"))
        self.flat(leg)
        for x in leg:
            x.set_opacity(0)
        self.play(leg[0].animate.set_opacity(1), run_time=0.3)
        self.play(m.LaggedStart(*[r.animate.set_opacity(1) for r in rows], lag_ratio=0.12),
                  run_time=max(1.0, self.cue(2, "how") - self.time - 0.2))
        self.sync_bars()
        self.play(leg[3].animate.set_opacity(1), leg[4].animate.set_opacity(1), run_time=0.5)
        self.bars.add_updater(lambda _m: self.sync_bars())

        # 3 ── one worker; material field only: straight up
        self.until(self.cue(3, "worker"))
        self.add_worker(0)
        self.until(self.cue(3, "only"))
        c3 = self.caption([("q E · THE ONLY TERM THAT DOES REAL WORK", 34, CYAN)], y=3.75)
        self.until(B[4] - 0.3)
        self.hide_flat(c3)

        # 4 ── switch on the fields; one source, pumped at the electoral carrier
        self.until(self.cue(4, "switch"))
        self.play(self.fon.animate.set_value(1.0), run_time=2.0)
        self.until(self.cue(4, "source"))
        c4 = self.caption([("ONE SOURCE · THE WAGE W(t)", 36, "#BFE9FF"), ("PUMPED AT THE ELECTORAL CARRIER ω", 30, DIM)], y=3.6)
        self.until(B[5] - 0.3)
        self.hide_flat(c4)

        # 5 ── the cross product: the climb bends into a spiral
        self.until(self.cue(5, "sideways") - 0.8)
        self.play(self.theta.animate.set_value(80), self.R.animate.set_value(3.0), run_time=0.8)
        c5 = self.caption([("v × B HITS SIDEWAYS", 38, "#A855F7")], y=3.75)
        self.until(self.cue(5, "Enormous"))
        c5b = T("ENORMOUS ENERGY · ALMOST NO CLIMB", 32, INK).next_to(c5, m.DOWN, buff=0.12)
        self.show_flat(c5b)
        self.until(B[6] - 0.3)
        self.hide_flat(c5, c5b)

        # 6 ── a population: six workers, one trap
        self.until(self.cue(6, "more"))
        for i in range(1, 6):
            self.add_worker(i)
            self.wait(0.25)
        self.until(self.cue(6, "whole"))
        c6 = self.caption([("SAME FIELDS · EVERY WORKER", 38, AMBER)], y=3.75)
        self.until(B[7] - 0.3)
        self.hide_flat(c6, eq)

        # 7 ── the source is the complex wage: the phasor panel replaces the legend
        self.until(self.cue(7, "complex"))
        self.bars.clear_updaters()
        self.hide_flat(leg)
        ph = self.phasor_panel()
        self.flat(ph)
        self.play(m.FadeIn(ph), run_time=0.6)
        self.until(self.cue(7, "four"))
        self.play(self.theta.animate.set_value(60 + 360), run_time=2.4, rate_func=m.smooth)
        self.theta.set_value(60)
        self.R.set_value(2.0)

        # 8-10 ── the quadrant cycle
        self.until(self.cue(8, "Quadrant"))
        self.play(self.theta.animate.set_value(40), run_time=1.0)
        self.until(self.cue(9, "Quadrant"))
        self.play(self.theta.animate.set_value(140), run_time=1.6)
        self.until(self.cue(9, "dragged"))
        self.play(self.R.animate.set_value(3.0), run_time=1.2)
        self.until(self.cue(10, "Quadrant"))
        self.play(self.theta.animate.set_value(225), run_time=1.4)
        self.until(self.cue(10, "Quadrant", nth=1))
        self.play(self.theta.animate.set_value(320), self.R.animate.set_value(2.0), run_time=1.6)
        self.until(B[11] - 0.4)
        self.play(self.theta.animate.set_value(420), run_time=0.4)
        self.theta.set_value(60)

        # 11 ── resonance: the engine tunes its timing
        self.until(self.cue(11, "timing"))
        self.play(m.FadeOut(ph), run_time=0.3)
        self.remove(ph)
        self.omega.set_value(0.9)
        rp = self.resonance_panel()
        self.flat(rp)
        self.play(m.FadeIn(rp), run_time=0.5)
        self.until(self.cue(11, "Drive"))
        self.play(self.omega.animate.set_value(2.0), run_time=2.2, rate_func=m.smooth)
        self.until(self.cue(11, "damping"))
        self.play(self.zeta.animate.set_value(0.4), run_time=0.8)
        self.play(self.zeta.animate.set_value(0.08), run_time=1.2)
        self.until(B[12] - 0.3)
        self.play(m.FadeOut(rp), self.zeta.animate.set_value(0.15), run_time=0.3)
        self.remove(rp)

        # 12 ── the measured schedule: 24:1 at the presidential cycle (Ch. 21)
        self.until(self.cue(12, "measured"))
        plate = m.Rectangle(width=8.2, height=4.4, fill_color=BGC, fill_opacity=0.92, stroke_width=0).move_to([0, -4.9, 0])
        hd = T("POWER AT THE 4-YEAR CYCLE", 36, INK).move_to([0, -3.3, 0])
        src = T("Congressional Record, 1965-2024", 28, DIM, "NORMAL").move_to([0, -3.85, 0])
        self.show_flat(plate, hd, src)
        L = 5.2 / 24.06
        bid = m.Rectangle(width=0.02, height=0.6, fill_color=RED, fill_opacity=1, stroke_width=0).move_to([-1.6, -4.75, 0], aligned_edge=m.LEFT)
        bcl = m.Rectangle(width=L, height=0.6, fill_color="#3B82F6", fill_opacity=1, stroke_width=0).move_to([-1.6, -5.75, 0], aligned_edge=m.LEFT)
        lid = T("IDENTITY", 28, RED).next_to(bid, m.LEFT, buff=0.15).set_x(-2.75)
        lcl = T("CLASS", 28, "#3B82F6").next_to(bcl, m.LEFT, buff=0.15).set_x(-2.75)
        self.show_flat(bcl, lcl, bid, lid)
        self.until(self.cue(12, "every"))
        self.play(bid.animate.stretch_to_fit_width(5.2).move_to([-1.6, -4.75, 0], aligned_edge=m.LEFT), run_time=1.6)
        self.until(self.cue(12, "24"))
        r24 = T("24 : 1", 64, RED).move_to([1.6, -5.75, 0])
        self.show_flat(r24)
        self.until(B[13] - 0.3)
        self.hide_flat(plate, hd, src, bid, bcl, lid, lcl, r24)

        # 13 ── the jammer: solidarity forms on one axis; the engine reweights
        self.flat(leg)
        self.sync_bars()
        self.bars.add_updater(lambda _m: self.sync_bars())
        self.play(*[x.animate.set_opacity(1) for x in leg], run_time=0.4)
        self.until(self.cue(13, "solidarity"))
        CL, RA, NA = 2, 0, 11
        c13 = self.caption([("SOLIDARITY FORMING ON CLASS", 34, AXES[CL][1])], y=3.75)
        self.play(self.rho[CL].animate.set_value(1.0), run_time=1.0)
        self.until(self.cue(13, "engine"))
        self.play(self.rho[CL].animate.set_value(0.2), self.rho[NA].animate.set_value(1.0), self.rho[RA].animate.set_value(1.0),
                  self.rho[1].animate.set_value(1.0), run_time=1.6)
        self.until(self.cue(13, "jammer"))
        c13b = T("A PHASED-ARRAY JAMMER", 40, RED).next_to(c13, m.DOWN, buff=0.12)
        self.show_flat(c13b)
        self.until(B[14] - 0.3)
        self.hide_flat(c13, c13b)

        # 14 ── the expendable node: a small-rho axis driven to the limit (UEF Thm 9.1)
        SM = 4
        self.until(self.cue(14, "small"))
        hl = m.SurroundingRectangle(rows[SM], color=AXES[SM][1], buff=0.06)
        self.flat(hl)
        self.play(m.Create(hl), run_time=0.4)
        self.until(self.cue(14, "limit"))
        self.play(self.rho[SM].animate.set_value(1.0), self.R.animate.set_value(3.2), run_time=1.2)
        c14 = self.caption([("A SMALL GROUP · FULL VOLTAGE", 38, AXES[SM][1])], y=3.75)
        self.until(self.cue(14, "cost"))
        c14b = T("THEY PAY THE COST · EVERYONE ELSE GETS THE DISTRACTION", 26, INK).next_to(c14, m.DOWN, buff=0.12)
        self.show_flat(c14b)
        self.until(B[15] - 0.3)
        self.hide_flat(c14, c14b, hl)

        # 15 ── the way out: reject the status wage; the fields switch off
        self.until(self.cue(15, "way"))
        self.play(*[r.animate.set_value(a[2]) for r, a in zip(self.rho, AXES)], self.R.animate.set_value(2.0), run_time=0.6)
        self.until(self.cue(15, "conjugate"))
        c15 = self.caption([("REJECT THE STATUS WAGE", 36, CYAN)], y=3.75)
        c15e = M(r"W + W^{*} = 2\psi_m", 56, CYAN).next_to(c15, m.DOWN, buff=0.15)
        self.show_flat(c15e)
        self.until(self.cue(15, "switched") - 0.2)
        self.play(self.fon.animate.set_value(0.0), self.theta.animate.set_value(0.0), *[r.animate.set_value(0.0) for r in self.rho],
                  run_time=2.0)

        # 16 ── straight up, together
        self.until(self.cue(16, "Straight"))
        self.hide_flat(c15, c15e)
        c16 = self.caption([("EVERY VECTOR POINTING AT THE TOP", 36, AMBER)], y=3.75)
        self.until(self.cue(16, "funded"))
        c16b = T("FUNDED BY THE EXTRACTION IT PROTECTS", 30, INK).next_to(c16, m.DOWN, buff=0.12)
        self.show_flat(c16b)
        self.until(self.END)
        self.stop_ambient_camera_rotation()
        self.bars.clear_updaters()
        self.updaters.clear()
        self.end_card()
