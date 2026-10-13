"""UEF reel: refractive index and the phase kick (UEF-11, UEF-12).

    .venv-manimgx/bin/manimgx render Architecting_the_operation/video/uef/phase_kick.py PhaseKick \
        -r 1080x1920 --fps 30 -o outputs/UEF_phase_kick/video/phase_kick.mp4
"""

import sys
from pathlib import Path

import numpy as np

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DIM, GOLD, HER, HIM, INK, OK, STAT, M, T, UEFReel  # noqa: E402

X0, X1 = -1.2, 1.2      # slab edges
YW = 0.4                 # wave baseline
K = 3.2                  # free-space wavenumber
AMP = 0.45


def wave_y(x, n, ph):
    """Continuous-phase wave: wavenumber K outside the slab, n*K inside, delayed after it."""
    if x < X0:
        p = K * x
    elif x <= X1:
        p = K * X0 + n * K * (x - X0)
    else:
        p = K * X0 + n * K * (X1 - X0) + K * (x - X1)
    return YW + AMP * np.sin(p - ph)


class PhaseKick(UEFReel):
    EP = "UEF_phase_kick"
    SOURCE = "Source: UEF draft §7.8, Eq. UEF-11 and UEF-12"

    def construct(self):
        self.begin()
        B = self.BEATS
        n = m.ValueTracker(1.0)
        ph = m.ValueTracker(0.0)
        slab = m.Rectangle(width=X1 - X0, height=2.4, fill_color=HIM, fill_opacity=0.12, stroke_color=HIM, stroke_width=3).move_to([0, YW, 0])
        layers = m.VGroup(*[m.Line([x, YW - 1.2, 0], [x, YW + 1.2, 0], color=HIM, stroke_width=2, stroke_opacity=0.5)
                            for x in np.linspace(X0, X1, 7)[1:-1]])
        wave = m.always_redraw(lambda: m.ParametricFunction(lambda t: np.array([t, wave_y(t, n.get_value(), ph.get_value()), 0]),
                                                            t_range=[-3.6, 3.6, 0.01], color=GOLD, stroke_width=5))
        ref = m.always_redraw(lambda: m.ParametricFunction(lambda t: np.array([t, wave_y(t, 1.0, ph.get_value()), 0]),
                                                           t_range=[X1, 3.6, 0.01], color=DIM, stroke_width=3).set_stroke(opacity=0.6))

        def run(tgt, extra=0.0):
            dur = max(0.2, tgt - self.time)
            self.play(ph.animate.increment_value(4.0 * dur), *([n.animate.set_value(extra)] if extra else []),
                      run_time=dur, rate_func=m.linear)

        # 0 ── light picks up phase kicks layer by layer
        title = T("THE PHASE KICK", 56, GOLD).to_edge(m.UP, buff=1.0)
        self.play(m.Write(title), m.FadeIn(slab), m.FadeIn(layers), run_time=0.8)
        self.add(wave)
        run(self.cue(0, "kicks"))
        kicks = m.VGroup(*[m.Dot([x, YW + 1.45, 0], radius=0.08, color=GOLD) for x in np.linspace(X0, X1, 7)[1:-1]])
        self.play(m.LaggedStart(*[m.FadeIn(k, scale=2) for k in kicks], lag_ratio=0.3), n.animate.set_value(1.6),
                  ph.animate.increment_value(5), run_time=1.6, rate_func=m.linear)
        run(B[1])

        # 1 ── n = c / v_p
        self.until(self.cue(1, "refractive"))
        eq1 = M(r"n = \frac{c}{v_p}", 96, GOLD).move_to([0, 3.4, 0])
        self.play(m.Write(eq1), ph.animate.increment_value(3), run_time=0.8, rate_func=m.linear)
        run(B[2])

        # 2 ── delta phi per layer
        self.until(self.cue(2, "kick"))
        eq2 = M(r"\Delta\phi = (n-1)\,k\,\Delta x", 76, OK).move_to([0, -2.8, 0])
        brace = m.Brace(m.Line([X0, YW - 1.3, 0], [X0 + (X1 - X0) / 6, YW - 1.3, 0]), m.DOWN, color=OK)
        bl = M(r"\Delta x", 40, OK).next_to(brace, m.DOWN, buff=0.05)
        self.play(m.Write(eq2), m.FadeIn(brace), m.FadeIn(bl), ph.animate.increment_value(3), run_time=0.8, rate_func=m.linear)
        run(B[3] - 0.3)
        self.play(m.FadeOut(brace), m.FadeOut(bl), m.FadeOut(eq2), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 3 ── crests bunch together; same wave, delayed on exit (ghost = no slab)
        self.until(self.cue(3, "crests"))
        self.add(ref)
        self.play(n.animate.set_value(2.4), ph.animate.increment_value(4), run_time=1.0, rate_func=m.linear)
        lag = T("SAME WAVE, NOW BEHIND", 32, INK).move_to([0, -3.0, 0])
        ghost = T("grey = without the medium", 26, DIM, "NORMAL").next_to(lag, m.DOWN, buff=0.12)
        self.play(m.FadeIn(lag), m.FadeIn(ghost), ph.animate.increment_value(2), run_time=0.5, rate_func=m.linear)
        run(B[4] - 0.3)
        self.play(m.FadeOut(lag), m.FadeOut(ghost), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 4 ── swap the glass for an institution
        names = ["NEWS ECOSYSTEM", "BUREAUCRACY", "COURT SYSTEM"]
        words = ["news", "bureaucracy", "court"]
        tags = m.VGroup()
        for k, (nm, w) in enumerate(zip(names, words)):
            self.until(self.cue(4, w))
            t = T(nm, 32, HIM).move_to([0, -2.6 - 0.55 * k, 0])
            tags.add(t)
            self.play(m.FadeIn(t), ph.animate.increment_value(2), run_time=0.5, rate_func=m.linear)
        run(B[5] - 0.3)
        self.play(m.FadeOut(tags), ph.animate.increment_value(1), run_time=0.3, rate_func=m.linear)

        # 5 ── every form, review, court date is a kick; in on time, out delayed
        lbls = T("FORM · REVIEW · COURT DATE", 34, HIM).move_to([0, YW - 1.7, 0])
        self.until(self.cue(5, "form"))
        self.play(m.FadeIn(lbls), m.LaggedStart(*[m.Indicate(l, color=GOLD) for l in layers], lag_ratio=0.2),
                  ph.animate.increment_value(4), run_time=1.0, rate_func=m.linear)
        self.until(self.cue(5, "delayed"))
        io = m.VGroup(T("IN ON TIME", 32, OK), M(r"\longrightarrow", 56), T("OUT DELAYED", 32, HER)).arrange(m.RIGHT, buff=0.25)
        io.move_to([0, -2.8, 0])
        self.play(m.FadeIn(io), ph.animate.increment_value(2), run_time=0.5, rate_func=m.linear)
        run(B[6] - 0.3)

        # 6 ── easier to cancel
        self.until(self.cue(6, "cancel"))
        canc = m.VGroup(T("A DELAYED SIGNAL IS", 34, INK), T("EASIER TO CANCEL", 44, HER)).arrange(m.DOWN, buff=0.1).move_to([0, -4.2, 0])
        self.play(m.FadeIn(canc), ph.animate.increment_value(2), run_time=0.5, rate_func=m.linear)
        run(self.END)
        self.end_card()
