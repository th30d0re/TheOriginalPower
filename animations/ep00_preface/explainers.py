# Preface explainers, drawn against the rendered episode.
# Audio slices are cut from outputs/ATO_EP02_local/ATO_EP02_local.mp3.
# Cue times are seconds from the start of each slice.
#
#   .venv-manim/bin/manim -qh --fps 30 --media_dir animations/ep00_preface/media \
#       animations/ep00_preface/explainers.py FiveTiers

import json
from pathlib import Path

import numpy as np
from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Arrow,
    Circle,
    Create,
    Axes,
    DashedLine,
    DecimalNumber,
    Dot,
    FadeIn,
    FadeOut,
    LaggedStart,
    Line,
    MathTex,
    PI,
    Polygon,
    Rectangle,
    RoundedRectangle,
    Scene,
    Text,
    ValueTracker,
    VGroup,
    VMobject,
    always_redraw,
    config,
)

config.background_color = "#0B0C0F"

GOLD = "#E6C26B"
BLUE = "#8CBAD6"
PALE = "#C5D0DA"
RED = "#D16657"
PAPER = "#F4F1EA"
MUTED = "#9E9A90"
INK = "#1A1612"
PUPPET = "#9E7850"
FORCE = "#617C94"
BUFFER = "#807660"

HERE = Path(__file__).resolve().parent
VOICE = HERE / "voice"

TIERS = (
    ("E", "Elite", "extracts value", GOLD, INK, 3.4),
    ("P", "Puppet Class", "writes law and policy", PUPPET, PAPER, 4.6),
    ("F", "Enforcement", "makes contact", FORCE, PAPER, 5.8),
    ("I", "Buffer Class", "receives the allocation", BUFFER, PAPER, 7.0),
    ("O", "Out-group", "bears the burden", RED, PAPER, 8.2),
)


def _label(text, size=28, color=PAPER, weight="NORMAL"):
    return Text(text, font_size=size, color=color, weight=weight)


def _bar(name, role, fill, ink, width):
    body = RoundedRectangle(
        width=width,
        height=0.78,
        corner_radius=0.08,
        stroke_width=0,
        fill_color=fill,
        fill_opacity=1,
    )
    title = Text(name, font_size=26, color=ink, weight="BOLD")
    detail = Text(role, font_size=18, color=ink)
    words = VGroup(title, detail).arrange(RIGHT, buff=0.28)
    if words.width > width - 0.4:
        detail.scale_to_fit_width(max(0.4, width - title.width - 0.7))
        words.arrange(RIGHT, buff=0.22)
    words.move_to(body)
    return VGroup(body, words)


def _stack(which):
    rows = VGroup()
    for spec in which:
        rows.add(_bar(spec[1], spec[2], spec[3], spec[4], spec[5]))
    rows.arrange(DOWN, buff=0.16)
    return rows


def _wave(phase, amp, y, color, x0=-4.4, x1=5.8, n=220):
    xs = np.linspace(x0, x1, n)
    pts = np.column_stack([
        xs,
        y + amp * np.sin(1.35 * xs + phase),
        np.zeros(n),
    ])
    mob = VMobject(stroke_color=color, stroke_width=3.5)
    mob.set_points_smoothly(pts)
    return mob


class TimedScene(Scene):
    audio_name = ""
    end = 1.0

    def setup(self):
        wav = VOICE / self.audio_name
        if wav.exists():
            self.add_sound(str(wav))

    def until(self, t):
        dt = t - self.time
        if dt > 0.03:
            self.wait(dt)

    def finish(self):
        self.until(self.end)


class FiveTiers(TimedScene):
    """Turns 102–109. Five positions, named in the Preface's order."""

    audio_name = "five_tiers.wav"
    end = 51.18

    def construct(self):
        header = _label("FIVE STRUCTURAL POSITIONS", 22, MUTED)
        header.to_edge(UP, buff=0.38)
        self.play(FadeIn(header), run_time=0.6)
        self.until(2.3)

        cues = (2.3, 10.0, 16.8, 25.3, 45.6)
        bars = []
        for i, (cue, spec) in enumerate(zip(cues, TIERS)):
            if i == 4:
                self.until(35.4)
                psi = MathTex(r"\psi", font_size=42, color=GOLD)
                psi.next_to(bars[3], RIGHT, buff=0.28)
                self.play(FadeIn(psi), run_time=0.35)
            self.until(cue)
            bar = _bar(spec[1], spec[2], spec[3], spec[4], spec[5])
            bar.move_to(UP * (2.05 - i * 0.96))
            bars.append(bar)
            self.play(FadeIn(bar, shift=UP * 0.08), run_time=0.4)
        self.finish()


class WhyFive(TimedScene):
    """Turns 112–119. Two tiers break, three tiers break, five holds."""

    audio_name = "why_five.wav"
    end = 107.65

    def construct(self):
        header = _label("WHY FIVE", 22, MUTED)
        header.to_edge(UP, buff=0.38)
        self.add(header)

        two = _stack((
            ("", "Oppressor", "receives the take", GOLD, INK, 7.2),
            ("", "Oppressed", "bears the burden", RED, PAPER, 7.2),
        ))
        cap = _label("Two tiers. The binary already in use.", 26, PALE)
        cap.next_to(two, DOWN, buff=0.45)
        block = VGroup(two, cap)
        self.play(FadeIn(block), run_time=0.7)

        self.until(7.5)
        fail = _label("The record disagrees. The surplus goes elsewhere.", 26, RED)
        fail.next_to(two, DOWN, buff=0.45)
        self.play(FadeOut(cap), FadeIn(fail), run_time=0.4)

        self.until(23.4)
        three = _stack((
            ("", "Elite", "split from the in-group", GOLD, INK, 4.2),
            ("", "In-group", "one remaining band", BUFFER, PAPER, 6.2),
            ("", "Out-group", "bears the burden", RED, PAPER, 7.6),
        ))
        cap3 = _label("Three tiers. Elite split from the in-group.", 26, PALE)
        cap3.next_to(three, DOWN, buff=0.4)
        self.play(FadeOut(block), FadeOut(fail), FadeIn(three), FadeIn(cap3), run_time=0.6)

        self.until(48.7)
        fail3 = _label("A statute needs a writer. Contact needs an actuator.", 26, RED)
        fail3.next_to(three, DOWN, buff=0.4)
        self.play(FadeOut(cap3), FadeIn(fail3), run_time=0.4)

        self.until(82.8)
        five = _stack(TIERS)
        five.scale(0.92)
        done = _label("Five. The minimum configuration that holds.", 26, GOLD)
        done.next_to(five, DOWN, buff=0.32)
        self.play(FadeOut(three), FadeOut(fail3), FadeIn(five), FadeIn(done), run_time=0.8)
        self.finish()


def _pt(x, y):
    return np.array([float(x), float(y), 0.0])


def _tri(tip, direction, size=0.16, color=PALE):
    tip = np.asarray(tip, dtype=float)
    d = np.asarray(direction, dtype=float)
    d = d / (np.linalg.norm(d) + 1e-9)
    n = np.array([-d[1], d[0], 0.0])
    back = tip - d * size
    return Polygon(
        tip,
        back + n * size * 0.42,
        back - n * size * 0.42,
        stroke_width=0,
        fill_color=color,
        fill_opacity=1,
        color=color,
    )


def _resistor(start, end, color=PALE, teeth=7, amp=0.11, stroke=2.6):
    start = np.asarray(start, dtype=float)
    end = np.asarray(end, dtype=float)
    delta = end - start
    length = float(np.linalg.norm(delta[:2]))
    direction = delta / length
    normal = np.array([-direction[1], direction[0], 0.0])
    lead = min(0.13, length * 0.16)
    body = length - 2 * lead
    pts = [start, start + direction * lead]
    for i in range(teeth):
        t = lead + body * (i + 0.5) / teeth
        sign = 1.0 if i % 2 == 0 else -1.0
        pts.append(start + direction * t + normal * sign * amp)
    pts.append(start + direction * (length - lead))
    pts.append(end)
    mob = VMobject(stroke_color=color, stroke_width=stroke)
    mob.set_points_as_corners(pts)
    return mob


def _supply_circuit():
    """NPN gate. VCC meets the collector at the bottom. The emitter arrow points out the top.

    The tap on the emitter output is a current divider. The thin wire runs left
    through R_b and into the base. The heavier shunt, R_s, leaves the tap on the
    right and returns to the collector wire.
    """
    bar = _pt(0.55, 0.12)
    c_term = bar + np.array([0.70, 0.84, 0.0])
    e_term = bar + np.array([0.70, -0.84, 0.0])
    circ = bar + np.array([0.24, 0.0, 0.0])
    radius = float(np.linalg.norm(c_term - circ))
    base_y = float(bar[1])
    cx = float(c_term[0])
    tap = _pt(cx, 2.08)
    node = _pt(-2.85, base_y)
    join_y = -1.52
    shunt_x = cx + 1.08

    ring = Circle(radius=radius, color=PALE, stroke_width=1.7).move_to(circ)
    spine = Line(bar + UP * 0.62, bar + DOWN * 0.62, color=PAPER, stroke_width=6)
    # Collector is the plain lead into VCC. The NPN arrow is the emitter, pointing out.
    coll = Line(bar + DOWN * 0.28, e_term, color=PALE, stroke_width=3.2)
    emit = Line(bar + UP * 0.28, c_term, color=PALE, stroke_width=3.2)
    e_dir = c_term - (bar + UP * 0.28)
    e_tip = (bar + UP * 0.28) + e_dir * 0.62
    e_arrow = _tri(e_tip, e_dir, size=0.18, color=PAPER)
    symbol = VGroup(ring, coll, emit, spine, e_arrow)

    rail = RoundedRectangle(
        width=11.4, height=0.62, corner_radius=0.08,
        stroke_width=0, fill_color=GOLD, fill_opacity=1,
    ).move_to(DOWN * 3.12)
    rail_text = VGroup(
        Text("supply", font_size=26, color=INK, weight="BOLD"),
        Text("Out-group and Buffer Class", font_size=20, color=INK),
    ).arrange(RIGHT, buff=0.28).move_to(rail)
    vcc = MathTex(r"V_{CC}", font_size=36, color=INK).move_to(rail)

    supply_wire = Line(e_term, _pt(cx, rail.get_top()[1]), color=GOLD, stroke_width=8)
    coll_wire = Line(c_term, _pt(cx, 2.52), color=GOLD, stroke_width=8)
    out = Arrow(
        _pt(cx, 2.52), _pt(cx, 3.12),
        buff=0, color=GOLD, stroke_width=8,
        max_tip_length_to_length_ratio=0.32,
        max_stroke_width_to_length_ratio=12,
    )
    base_in = Arrow(
        _pt(-6.45, base_y), bar,
        buff=0, color=BLUE, stroke_width=4,
        max_tip_length_to_length_ratio=0.035,
        max_stroke_width_to_length_ratio=10,
    )
    early = VGroup(rail, symbol, supply_wire, coll_wire, out, base_in)

    siphon = Line(tap, _pt(node[0], tap[1]), color=GOLD, stroke_width=3.2)
    tap_dot = Dot(tap, radius=0.058, color=GOLD)
    rb_drop = Line(
        _pt(node[0], tap[1]), _pt(node[0], tap[1] - 0.32),
        color=GOLD, stroke_width=3.2,
    )
    rb_joint = Dot(_pt(node[0], tap[1]), radius=0.048, color=GOLD)
    rb = _resistor(
        _pt(node[0], tap[1] - 0.30), _pt(node[0], base_y + 0.52),
        color=PALE, stroke=2.3, amp=0.09,
    )
    rb_down = Line(_pt(node[0], base_y + 0.52), node + UP * 0.16, color=GOLD, stroke_width=3.2)
    rb_head = _tri(node + UP * 0.05, DOWN, size=0.15, color=GOLD)
    node_dot = Dot(node, radius=0.052, color=BLUE)
    rb_lab = MathTex(r"R_b", font_size=26, color=GOLD).move_to(_pt(node[0] - 0.52, 1.12))
    trickle_wire = VGroup(siphon, rb_drop, rb, rb_down, rb_head, tap_dot, rb_joint, node_dot)

    shunt_leg = Line(tap, _pt(shunt_x, tap[1]), color=GOLD, stroke_width=5.2)
    rs_drop = Line(
        _pt(shunt_x, tap[1]), _pt(shunt_x, tap[1] - 0.30),
        color=GOLD, stroke_width=5.2,
    )
    rs_joint = Dot(_pt(shunt_x, tap[1]), radius=0.052, color=GOLD)
    shunt_r = _resistor(
        _pt(shunt_x, tap[1] - 0.28), _pt(shunt_x, 0.82),
        color=PALE, stroke=3.6, amp=0.13,
    )
    shunt_down = Line(_pt(shunt_x, 0.82), _pt(shunt_x, join_y), color=GOLD, stroke_width=5.2)
    shunt_return = Line(_pt(shunt_x, join_y), _pt(cx, join_y), color=GOLD, stroke_width=5.2)
    join_dot = Dot(_pt(cx, join_y), radius=0.05, color=GOLD)
    rs = MathTex(r"R_s", font_size=26, color=PALE).move_to(_pt(shunt_x + 0.46, 1.32))
    shunt = VGroup(shunt_leg, rs_drop, shunt_r, shunt_down, shunt_return, join_dot, rs_joint)
    feedback = VGroup(trickle_wire, shunt, rb_lab, rs)

    return {
        "rail_text": rail_text,
        "vcc": vcc,
        "early": early,
        "feedback": feedback,
        "shunt": shunt,
        "trickle_wire": trickle_wire,
        "rb_lab": rb_lab,
        "rs": rs,
        "tap": tap,
        "node": node,
        "bar": bar,
    }


def _supply_callouts(parts):
    base_tag = _label("transistor base", 20, BLUE).move_to(LEFT * 1.45 + DOWN * 0.42)
    ib = MathTex(r"I_b", font_size=28, color=BLUE).move_to(LEFT * 0.62 + UP * 0.58)
    layer = VGroup(
        _label("PARASITIC", 20, GOLD),
        _label("CONTROL LAYER", 20, GOLD),
    ).arrange(DOWN, buff=0.04).move_to(RIGHT * 5.15 + UP * 0.15)
    trickle = VGroup(
        _label("laws", 20, BLUE),
        _label("algorithms", 20, BLUE),
        _label("narratives", 20, BLUE),
    ).arrange(DOWN, aligned_edge=LEFT, buff=0.04)
    trickle.move_to(LEFT * 5.15 + UP * 0.78)
    div_label = _label("current divider", 18, GOLD)
    div_label.next_to(parts["tap"], UP, buff=0.16).shift(LEFT * 0.85)
    books = VGroup(
        _label("Labor is the supply.", 22, GOLD),
        _label("Taxes buy the enforcement.", 22, PALE),
        _label("Attention feeds the narrative.", 22, BLUE),
    ).arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to(LEFT * 3.7 + DOWN * 2.18)
    rail = parts["early"][0]
    loop_tag = _label("A fraction of the output returns to the base.", 24, GOLD)
    loop_tag.next_to(rail, DOWN, buff=0.08)
    gate = _label("The Elite gate the energy.", 28, PAPER)
    gate.next_to(rail, DOWN, buff=0.08)
    return {
        "base_tag": base_tag,
        "ib": ib,
        "layer": layer,
        "trickle": trickle,
        "div_label": div_label,
        "books": books,
        "loop_tag": loop_tag,
        "gate": gate,
    }


class SupplyRail(TimedScene):
    """Turns 150–164. The supply sits at the base. The apex gates it."""

    audio_name = "supply_rail.wav"
    end = 129.99

    def construct(self):
        header = _label("WHERE THE ENERGY COMES FROM", 22, MUTED)
        header.to_edge(UP, buff=0.32)
        self.play(FadeIn(header), run_time=0.45)

        apex = _bar("Elite", "pictured as the source", GOLD, INK, 3.6)
        below = _bar("Everyone below", "receives what is given", BUFFER, PAPER, 7.4)
        apex.move_to(UP * 1.15)
        below.move_to(DOWN * 1.35)
        down = Arrow(apex.get_bottom(), below.get_top(), buff=0.14, color=GOLD, stroke_width=8)
        flow = _label("power pushed downward", 22, GOLD)
        flow.next_to(down, RIGHT, buff=0.18)
        intuitive = VGroup(apex, below, down, flow)
        self.until(2.3)
        self.play(FadeIn(intuitive), run_time=0.55)

        self.until(9.0)
        self.play(FadeOut(intuitive), run_time=0.3)

        parts = _supply_circuit()
        words = _supply_callouts(parts)
        picture = parts["early"]
        rail_text = parts["rail_text"]
        vcc = parts["vcc"]
        feedback = parts["feedback"]
        picture.add(rail_text)
        gate = words["gate"]
        self.play(FadeIn(picture), FadeIn(gate), run_time=0.5)

        self.until(12.9)
        self.play(FadeOut(rail_text), FadeIn(vcc), run_time=0.35)

        self.until(23.0)
        base_tag = words["base_tag"]
        ib = words["ib"]
        self.play(FadeIn(base_tag), FadeIn(ib), run_time=0.3)

        self.until(34.3)
        layer = words["layer"]
        self.play(FadeIn(layer), run_time=0.35)

        self.until(45.1)
        trickle = words["trickle"]
        self.play(FadeOut(gate), FadeIn(trickle), run_time=0.35)

        self.until(86.9)
        div_label = words["div_label"]
        loop_tag = words["loop_tag"]
        self.play(
            LaggedStart(
                Create(parts["trickle_wire"]),
                Create(parts["shunt"]),
                lag_ratio=0.55,
            ),
            FadeIn(parts["rb_lab"]),
            FadeIn(parts["rs"]),
            FadeIn(div_label),
            FadeIn(loop_tag),
            run_time=1.6,
        )

        self.until(100.5)
        books = words["books"]
        self.play(FadeIn(books), run_time=0.4)

        self.until(119.4)
        line = _label("The architecture is powered by compliance.", 26, PAPER)
        line.next_to(picture[0], DOWN, buff=0.08)
        self.play(
            picture.animate.set_opacity(0.28),
            vcc.animate.set_opacity(0.28),
            feedback.animate.set_opacity(0.28),
            ib.animate.set_opacity(0.28),
            FadeOut(trickle), FadeOut(books), FadeOut(loop_tag), FadeOut(div_label),
            FadeOut(base_tag), FadeOut(layer),
            FadeIn(line),
            run_time=0.6,
        )
        self.finish()


class DestructiveInterference(TimedScene):
    """Turns 184–194. Same amplitudes. Phase is the variable."""

    audio_name = "interference.wav"
    end = 91.56

    def construct(self):
        header = _label("PHASE", 22, MUTED)
        header.to_edge(UP, buff=0.32)
        names = ("race", "gender", "class", "religion", "identity")
        colors = (GOLD, BLUE, PALE, "#C4A574", RED)
        bases = tuple(2 * np.pi * k / 5 for k in range(5))
        ys = (1.85, 1.15, 0.45, -0.25, -0.95)
        mix = ValueTracker(1.0)

        labels = VGroup(*[
            _label(name, 22, color) for name, color in zip(names, colors)
        ])
        for lab, y in zip(labels, ys):
            lab.move_to(LEFT * 5.55 + UP * y)
            lab.align_to(LEFT * 6.55, LEFT)

        # A time-based updater keeps the waits from freezing into one frame.
        # Relative phase stays in `mix`; the clock scrolls every trace together.
        clock = ValueTracker(0.0)
        clock.add_updater(lambda m, dt: m.increment_value(dt))
        self.add(clock)
        speed = 1.5

        def live_phase(offset):
            return offset * mix.get_value() - speed * clock.get_value()

        waves = always_redraw(lambda: VGroup(*[
            _wave(live_phase(phase), 0.22, y, color)
            for phase, y, color in zip(bases, ys, colors)
        ]))

        def sum_wave():
            acc = np.zeros(200)
            xs = np.linspace(-4.4, 4.45, 200)
            for phase in bases:
                acc = acc + 0.09 * np.sin(1.35 * xs + live_phase(phase))
            pts = np.column_stack([xs, -2.45 + acc, np.zeros(200)])
            mob = VMobject(stroke_color=GOLD, stroke_width=5)
            mob.set_points_smoothly(pts)
            return mob

        total = always_redraw(sum_wave)
        rule = DashedLine(
            _pt(-4.4, -2.15), _pt(4.45, -2.15),
            color=MUTED, stroke_width=1.6, dash_length=0.12,
        )
        tau = VGroup(
            _label("threshold", 16, MUTED),
            MathTex(r"\tau", font_size=30, color=PALE),
        ).arrange(RIGHT, buff=0.1)
        tau.next_to(rule, RIGHT, buff=0.16)
        sum_name = _label("sum", 22, GOLD).move_to(LEFT * 5.55 + DOWN * 2.55)

        self.play(FadeIn(header), FadeIn(labels), run_time=0.5)
        self.until(5.3)
        self.play(FadeIn(waves), run_time=0.4)
        self.until(14.2)
        caption = _label("Out of phase. The sum stays near zero.", 26, PALE)
        caption.to_edge(DOWN, buff=0.28)
        self.play(
            FadeIn(rule), FadeIn(tau), FadeIn(total), FadeIn(sum_name), FadeIn(caption),
            run_time=0.45,
        )

        self.until(33.9)
        hyper = _label("Politically hyperactive. Structurally inert.", 26, PAPER)
        hyper.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(caption), FadeIn(hyper), run_time=0.35)

        self.until(67.7)
        claim = _label("Real magnitudes. The meeting point is out of step.", 26, PALE)
        claim.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(hyper), FadeIn(claim), run_time=0.35)

        self.until(78.9)
        self.play(mix.animate.set_value(0.0), run_time=2.4)
        aligned = _label("The same energy, arriving in step.", 28, GOLD)
        aligned.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(claim), FadeIn(aligned), run_time=0.35)
        self.finish()


def _fit(mob, width):
    if mob.width > width:
        mob.scale_to_fit_width(width)
    return mob


def _caption(text, color=PALE, size=26):
    mob = _label(text, size, color)
    return _fit(mob, 12.6)


def _lorentz_equation():
    eq = MathTex(
        r"\vec{F}_{\mathrm{total}}",
        r"=",
        r"\mathbf{Q}",
        r"\sum_{j=1}^{M}",
        r"\vec{\mathcal{E}}_{\mathrm{mat}}^{(j)}",
        r"+",
        r"\mathbf{Q}",
        r"(",
        r"\vec{v}",
        r"\times",
        r"\sum_{k=1}^{N}",
        r"\rho_k",
        r"\vec{B}_k",
        r")",
        font_size=34,
    )
    colors = {
        0: GOLD,
        1: PALE,
        2: PAPER,
        3: PALE,
        4: BLUE,
        5: PALE,
        6: PAPER,
        7: PALE,
        8: PALE,
        9: PALE,
        10: PALE,
        11: GOLD,
        12: BLUE,
        13: PALE,
    }
    for i, color in colors.items():
        eq[i].set_color(color)
    return _fit(eq, 12.8)


def _focus_anims(eq, hot):
    anims = []
    for i, part in enumerate(eq):
        anims.append(part.animate.set_opacity(1.0 if i in hot else 0.16))
    return anims


def _into_page(center, radius=0.2, color=BLUE):
    ring = Circle(radius=radius, color=color, stroke_width=2.2).move_to(center)
    arm = 0.1
    a = Line(center + np.array([-arm, arm, 0]), center + np.array([arm, -arm, 0]), color=color, stroke_width=2.2)
    b = Line(center + np.array([arm, arm, 0]), center + np.array([-arm, -arm, 0]), color=color, stroke_width=2.2)
    return VGroup(ring, a, b)


def _arrow(start, end, color, width=5):
    return Arrow(
        start, end, buff=0, color=color, stroke_width=width,
        max_tip_length_to_length_ratio=0.16,
        max_stroke_width_to_length_ratio=8,
    )


def _lorentz_cues():
    manifest = json.loads((HERE / "voice" / "ep00_lorentz" / "episode_manifest.json").read_text())
    starts = [turn["start_ms"] / 1000.0 for turn in manifest["turns"]]
    end = manifest["turns"][-1]["end_ms"] / 1000.0 + 0.8
    return starts, end


class UnifiedLorentz(TimedScene):
    """Equation 0.1. Each symbol, then the two terms acting together.

    Cue times are the spoken line starts in voice/lorentz.wav.
    """

    audio_name = "lorentz.wav"
    end = 8.0

    def construct(self):
        cues, audio_end = _lorentz_cues()
        self.end = audio_end
        header = VGroup(
            _label("EQUATION 0.1", 22, GOLD),
            _label("UNIFIED LORENTZ FORCE", 22, MUTED),
        ).arrange(RIGHT, buff=0.32)
        header.to_edge(UP, buff=0.24)
        eq = _lorentz_equation()
        eq.next_to(header, DOWN, buff=0.22)
        self.play(FadeIn(header), FadeIn(eq), run_time=0.7)

        cap = _caption("The governing equation of the hardware layer.")
        cap.to_edge(DOWN, buff=0.28)
        self.play(FadeIn(cap), run_time=0.35)
        self.until(cues[1])

        board = VGroup()

        def place_cap(text, color=PALE):
            nonlocal cap
            nxt = _caption(text, color)
            nxt.to_edge(DOWN, buff=0.28)
            return nxt

        def show(new, text, hot, color=PALE, rt=0.45):
            nonlocal board, cap
            nxt = place_cap(text, color)
            self.play(
                *_focus_anims(eq, hot),
                FadeOut(board),
                FadeIn(new),
                FadeOut(cap),
                FadeIn(nxt),
                run_time=rt,
            )
            board = new
            cap = nxt

        # F_total. The label sits off the tip so it stays clear of the equation.
        origin = _pt(-1.7, -0.7)
        force = _arrow(origin, origin + np.array([3.5, 1.45, 0]), GOLD, width=7)
        force_name = MathTex(r"\vec{F}_{\mathrm{total}}", font_size=36, color=GOLD)
        force_name.next_to(force.get_end(), UP + LEFT, buff=0.12)
        show(
            VGroup(force, force_name),
            "Total force on the charged host.",
            {0},
            GOLD,
        )
        self.until(cues[2])

        # Q — three layers the charge couples
        layers = _stack((
            ("", "Software", "writes the partition", GOLD, INK, 7.4),
            ("", "Wetware", "carries the charge as a prior", BLUE, INK, 7.4),
            ("", "Hardware", "the field the host moves through", PALE, INK, 7.4),
        ))
        q_mark = MathTex(r"\mathbf{Q}", font_size=58, color=PAPER)
        q_mark.next_to(layers, LEFT, buff=0.42)
        q_board = VGroup(q_mark, layers)
        q_board.move_to(UP * 0.05)
        show(
            q_board,
            "Intersectional charge, assigned by the Mind Virus.",
            {2, 6},
        )
        self.until(cues[3])
        layers_cap = _caption("Software writes it. Wetware carries it. Hardware is the field.")
        layers_cap.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(cap), FadeIn(layers_cap), run_time=0.3)
        cap = layers_cap
        self.until(cues[4])
        legal = _caption("Legal code enters the person. Q is the charge on the host.")
        legal.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(cap), FadeIn(legal), run_time=0.3)
        cap = legal
        self.until(cues[5])
        scales = _caption("Q multiplies the material term and the cultural term.")
        scales.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(cap), FadeIn(scales), run_time=0.3)
        cap = scales
        self.until(cues[6])

        # Electric sum
        pieces = (("racial", 1.65, RED), ("gendered", 1.2, BLUE), ("class", 1.95, GOLD))
        x = -3.15
        y = 0.55
        chain = VGroup()
        for name, length, color in pieces:
            arr = _arrow(_pt(x, y), _pt(x + length, y), color, width=6)
            lab = _label(name, 20, color)
            lab.next_to(arr, UP, buff=0.1)
            chain.add(arr, lab)
            x += length
        axis_note = VGroup(
            MathTex(r"j = 1 \ldots M", font_size=30, color=PALE),
            _label("M counts the axes. Three are drawn.", 20, MUTED),
        ).arrange(DOWN, buff=0.08)
        axis_note.next_to(chain, DOWN, buff=0.42)
        e_sym = MathTex(r"\vec{\mathcal{E}}_{\mathrm{mat}}^{(j)}", font_size=34, color=BLUE)
        e_sym.next_to(chain, RIGHT, buff=0.35)
        electric = VGroup(chain, axis_note, e_sym)
        show(
            electric,
            "j indexes an axis. The arrow is the material-wage field on that axis.",
            {2, 3, 4},
            BLUE,
        )
        self.until(cues[7])
        work_line = _caption("The sum performs real economic work.")
        work_line.to_edge(DOWN, buff=0.28)
        total = _arrow(_pt(-3.15, -1.15), _pt(1.65, -1.15), GOLD, width=8)
        total_lab = MathTex(
            r"\sum_{j=1}^{M}\vec{\mathcal{E}}_{\mathrm{mat}}^{(j)}",
            font_size=30, color=GOLD,
        )
        total_lab.next_to(total, DOWN, buff=0.12)
        self.play(
            FadeIn(total), FadeIn(total_lab),
            FadeOut(cap), FadeIn(work_line),
            run_time=0.45,
        )
        self._keep(board, total, total_lab)
        cap = work_line
        self.until(cues[8])

        # Magnetic term: v, rho, B, cross product
        v_arrow = _arrow(_pt(-5.5, 0.15), _pt(-2.7, 0.15), PAPER, width=7)
        v_sym = MathTex(r"\vec{v}", font_size=34, color=PAPER).next_to(v_arrow, UP, buff=0.1)
        v_name = _label("class momentum", 18, MUTED).next_to(v_arrow, DOWN, buff=0.1)
        weights = (("race", 0.42, RED), ("gender", 0.33, BLUE), ("religion", 0.25, PALE))
        rows = VGroup()
        for name, rho, color in weights:
            bar = RoundedRectangle(
                width=2.3 * rho / 0.42, height=0.28, corner_radius=0.04,
                stroke_width=0, fill_color=color, fill_opacity=1,
            )
            word = _label(name, 18, color)
            val = Text(f"{rho:.2f}", font_size=18, color=MUTED)
            row = VGroup(word, bar, val).arrange(RIGHT, buff=0.16)
            rows.add(row)
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.14)
        rho_head = MathTex(r"\rho_k", font_size=30, color=GOLD)
        rho_head.next_to(rows, UP, buff=0.16).align_to(rows, LEFT)
        illus = _label("illustrative weights", 16, MUTED)
        illus.next_to(rows, DOWN, buff=0.12).align_to(rows, LEFT)
        weight_block = VGroup(rho_head, rows, illus)
        weight_block.move_to(RIGHT * 3.15 + UP * 0.35)
        k_note = MathTex(r"k = 1 \ldots N", font_size=26, color=PALE)
        k_note.next_to(rho_head, RIGHT, buff=0.28)
        weight_block.add(k_note)
        field_mark = _into_page(_pt(-4.05, 1.35), radius=0.18, color=BLUE)
        field_name = MathTex(r"\sum \rho_k \vec{B}_k", font_size=28, color=BLUE)
        field_name.next_to(field_mark, RIGHT, buff=0.16)
        field_dir = _label("into the page", 16, MUTED).next_to(field_mark, DOWN, buff=0.08)
        cross = _arrow(_pt(-2.7, 0.15), _pt(-2.7, 1.85), PALE, width=6)
        cross_name = MathTex(r"\vec{v}\times\sum\rho_k\vec{B}_k", font_size=26, color=PALE)
        cross_name.next_to(cross, RIGHT, buff=0.12)
        magnetic = VGroup(
            v_arrow, v_sym, v_name, weight_block, field_mark, field_name, field_dir,
        )
        show(
            magnetic,
            "v is class momentum. Bar length is the demographic weight on each cultural field.",
            {6, 8, 10, 11, 12},
        )
        self.until(cues[9])
        psych = _caption("Perpendicular to velocity. The psychological wage. Its work is zero.")
        psych.to_edge(DOWN, buff=0.28)
        self.play(
            FadeIn(cross), FadeIn(cross_name),
            *_focus_anims(eq, {6, 8, 9, 10, 11, 12}),
            FadeOut(cap), FadeIn(psych),
            run_time=0.45,
        )
        self._keep(board, cross, cross_name)
        cap = psych
        self.until(cues[10])

        # Vector addition, the book's decomposition
        o = _pt(-2.2, -0.85)
        fe = _arrow(o, o + np.array([4.3, 0, 0]), BLUE, width=7)
        fb = DashedLine(o + np.array([4.3, 0, 0]), o + np.array([4.3, 2.15, 0]), color=PALE, stroke_width=3, dash_length=0.12)
        fb_tip = _tri(o + np.array([4.3, 2.15, 0]), UP, size=0.16, color=PALE)
        ft = _arrow(o, o + np.array([4.3, 2.15, 0]), GOLD, width=7)
        fe_lab = VGroup(
            MathTex(r"\mathbf{Q}\sum\vec{\mathcal{E}}_{\mathrm{mat}}", font_size=26, color=BLUE),
            _label("real work", 18, BLUE),
        ).arrange(DOWN, buff=0.05)
        fe_lab.next_to(fe, DOWN, buff=0.14)
        fb_lab = VGroup(
            MathTex(r"\mathbf{Q}(\vec{v}\times\sum\rho_k\vec{B}_k)", font_size=24, color=PALE),
            _label("work = 0", 18, MUTED),
        ).arrange(DOWN, buff=0.06)
        fb_lab.next_to(fb, RIGHT, buff=0.18)
        ft_lab = MathTex(r"\vec{F}_{\mathrm{total}}", font_size=28, color=GOLD)
        ft_lab.move_to(o + np.array([0.55, 1.72, 0]))
        diagram = VGroup(fe, fe_lab, fb, fb_tip, fb_lab, ft, ft_lab)
        show(
            diagram,
            "The two terms add. The host feels the resultant.",
            set(range(14)),
            GOLD,
            rt=0.55,
        )
        self.until(cues[11])

        self._run_particle(
            eq, board, cap,
            cues[12] - cues[11],
            cues[13] - cues[12],
            cues[14] - cues[13],
        )

    def _run_particle(self, eq, board, cap, e_dur, b_dur, both_dur):
        # Field strengths scale with the spoken length of each line, so the
        # host still crosses the pane, still closes a circle, and still bends
        # inside the frame.
        te = max(e_dur, 1.2)
        v0 = 0.22
        need = 3.5 - v0 * te
        e_field = 0.04 if need <= 0 else max(0.03, 2 * need / te ** 2)
        tb = max(b_dur, 1.5)
        b_field = 2 * np.pi * 1.15 / tb
        vb = 0.92 * b_field
        k = max(both_dur, 2.0) / 4.0
        span = e_dur + b_dur + both_dur
        live = {
            "on": False,
            "t": 0.0,
            "mode": "E",
            "E": e_field,
            "B": 0.0,
            "x": -2.0,
            "y": 0.0,
            "vx": v0,
            "vy": 0.0,
            "work": 0.0,
            "samples": [],
            "trail": [],
        }
        resets = {
            "E": (e_field, 0.0, -2.0, 0.0, v0, 0.0),
            "B": (0.0, b_field, 0.0, -0.92, vb, 0.0),
            "both": (0.18 / k, 0.35 / k, -1.9, -1.2, 0.55, 0.0),
        }

        def reset(mode):
            e, b, x, y, vx, vy = resets[mode]
            live.update(E=e, B=b, x=x, y=y, vx=vx, vy=vy, mode=mode, trail=[])

        def step(dt):
            sub = 6
            h = dt / sub
            e = live["E"]
            b = live["B"]
            for _ in range(sub):
                vx = live["vx"] + 0.5 * e * h
                vy = live["vy"]
                theta = b * h
                c, s = np.cos(theta), np.sin(theta)
                vx, vy = c * vx - s * vy, s * vx + c * vy
                vx += 0.5 * e * h
                live["work"] += e * vx * h
                live["vx"] = vx
                live["vy"] = vy
                live["x"] += vx * h
                live["y"] += vy * h
            live["trail"].append((live["x"], live["y"]))
            if len(live["trail"]) > 700:
                live["trail"] = live["trail"][-700:]
            live["samples"].append((live["t"], live["work"]))

        driver = ValueTracker(0.0)

        def drive(m, dt):
            m.increment_value(dt)
            if not live["on"]:
                return
            live["t"] += dt
            step(dt)

        driver.add_updater(drive)
        self.add(driver)

        pane_c = _pt(-2.55, -0.15)

        def pane_pt(x, y):
            return pane_c + np.array([x, y, 0.0])

        frame = RoundedRectangle(
            width=5.15, height=3.85, corner_radius=0.08,
            stroke_color=MUTED, stroke_width=1.4, fill_opacity=0,
        ).move_to(pane_c)
        demo = _label("demonstration", 16, MUTED)
        demo.next_to(frame, UP, buff=0.08).align_to(frame, LEFT)

        def trail():
            pts = live["trail"]
            if len(pts) < 2:
                return VMobject()
            mob = VMobject(stroke_color=GOLD, stroke_width=3.2)
            mob.set_points_as_corners([pane_pt(x, y) for x, y in pts])
            return mob

        path = always_redraw(trail)
        dot = always_redraw(lambda: Dot(pane_pt(live["x"], live["y"]), radius=0.075, color=PAPER))

        def vel():
            speed = float(np.hypot(live["vx"], live["vy"]))
            if speed < 1e-4:
                return VMobject()
            start = pane_pt(live["x"], live["y"])
            direction = np.array([live["vx"], live["vy"], 0.0]) / speed
            return _arrow(start, start + direction * 0.55, PAPER, width=3)

        velocity = always_redraw(vel)

        axes = Axes(
            x_range=[0, max(span, 1.0), max(span / 3, 1.0)],
            y_range=[0, 1.4, 0.5],
            x_length=4.7,
            y_length=2.25,
            tips=False,
            axis_config={
                "color": MUTED,
                "stroke_width": 1.5,
                "include_ticks": False,
                "include_numbers": False,
            },
        )
        axes.move_to(RIGHT * 3.65 + UP * 0.62)
        bands = VGroup()
        bands_spec = (
            (0.0, e_dur, BLUE),
            (e_dur, e_dur + b_dur, PALE),
            (e_dur + b_dur, span, GOLD),
        )
        for t0, t1, color in bands_spec:
            p0 = axes.c2p(t0, 0)
            p1 = axes.c2p(t1, 1.4)
            rect = Rectangle(
                width=max(0.02, p1[0] - p0[0]),
                height=max(0.02, p1[1] - p0[1]),
                stroke_width=0,
                fill_color=color,
                fill_opacity=0.14,
            )
            rect.move_to((p0 + p1) / 2)
            bands.add(rect)
        for t in (e_dur, e_dur + b_dur):
            bands.add(DashedLine(axes.c2p(t, 0), axes.c2p(t, 1.4), color=MUTED, stroke_width=1.2, dash_length=0.08))
        phase_names = VGroup()
        for t0, t1, name in (
            (0.0, e_dur, "electric"),
            (e_dur, e_dur + b_dur, "magnetic"),
            (e_dur + b_dur, span, "both"),
        ):
            lab = _label(name, 15, MUTED)
            lab.move_to(axes.c2p((t0 + t1) / 2, 1.22))
            phase_names.add(lab)
        y_name = _label("material work", 16, GOLD).rotate(PI / 2)
        y_name.next_to(axes.y_axis, LEFT, buff=0.1)
        x_name = _label("time", 16, MUTED).next_to(axes.x_axis, DOWN, buff=0.1)

        def curve():
            samples = live["samples"]
            if len(samples) < 2:
                return VMobject()
            mob = VMobject(stroke_color=GOLD, stroke_width=3.5)
            mob.set_points_as_corners([axes.c2p(t, min(w, 1.38)) for t, w in samples])
            return mob

        work = always_redraw(curve)

        inset_o = _pt(2.85, -2.05)
        legend = VGroup(
            _label("electric", 15, BLUE),
            _label("magnetic", 15, PALE),
            _label("resultant", 15, GOLD),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.04)
        legend.move_to(inset_o + RIGHT * 1.55)

        def forces():
            group = VGroup()
            e_on = live["E"] > 0
            b_on = live["B"] > 0
            if e_on:
                group.add(_arrow(inset_o, inset_o + RIGHT * 0.7, BLUE, width=4))
            if b_on:
                vx, vy = live["vx"], live["vy"]
                raw = np.array([-live["B"] * vy, live["B"] * vx, 0.0])
                norm = float(np.linalg.norm(raw))
                if norm > 1e-6:
                    group.add(_arrow(inset_o, inset_o + raw / norm * 0.7, PALE, width=4))
            if e_on and b_on:
                vx, vy = live["vx"], live["vy"]
                raw = np.array([live["E"] - live["B"] * vy, live["B"] * vx, 0.0])
                norm = float(np.linalg.norm(raw))
                if norm > 1e-6:
                    group.add(_arrow(inset_o, inset_o + raw / norm * 0.85, GOLD, width=5))
            return group

        triad = always_redraw(forces)
        inset_name = _label("forces", 16, MUTED).move_to(inset_o + UP * 1.05)
        speed_name = _label("speed", 16, MUTED)
        speed_name.move_to(pane_c + np.array([0.95, -1.58, 0.0]))
        speed = DecimalNumber(0.25, num_decimal_places=2, font_size=24, color=PALE)
        speed.next_to(speed_name, RIGHT, buff=0.14)
        speed.add_updater(lambda m: m.set_value(float(np.hypot(live["vx"], live["vy"]))))

        picture = VGroup(
            frame, demo, bands, axes, phase_names, y_name, x_name,
            inset_name, speed_name, legend,
        )
        nxt = _caption("Electric field alone. Speed rises. Material work accumulates.", BLUE)
        nxt.to_edge(DOWN, buff=0.28)
        reset("E")
        t0 = self.time
        self.play(
            *_focus_anims(eq, {0, 4, 8, 12}),
            FadeOut(board),
            FadeIn(picture),
            FadeIn(path),
            FadeIn(dot),
            FadeIn(velocity),
            FadeIn(work),
            FadeIn(triad),
            FadeIn(speed),
            FadeOut(cap),
            FadeIn(nxt),
            run_time=0.5,
        )
        cap = nxt
        # The updater starts after the fade. A moving trail changes its point
        # count every frame, and FadeIn cannot interpolate that.
        live["on"] = True
        self.until(t0 + e_dur)
        reset("B")
        mag_cap = _caption("Magnetic field alone. Heading turns. Material work stays level.")
        mag_cap.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(cap), FadeIn(mag_cap), run_time=0.3)
        cap = mag_cap
        self.until(t0 + e_dur + b_dur)
        reset("both")
        both_cap = _caption("Both terms. The path bends. Material work keeps accumulating.", GOLD)
        both_cap.to_edge(DOWN, buff=0.28)
        self.play(FadeOut(cap), FadeIn(both_cap), run_time=0.3)
        cap = both_cap
        self.until(t0 + span)
        live["on"] = False
        close = _caption("One charge. Electric extraction. Magnetic deflection.", PAPER)
        close.to_edge(DOWN, buff=0.28)
        self.play(
            *_focus_anims(eq, set(range(14))),
            FadeOut(cap),
            FadeIn(close),
            run_time=0.4,
        )
        self.finish()

    def _keep(self, board, *mobs):
        """Parent freshly faded-in pieces to the current board.

        FadeIn registers them as their own scene objects. Left there, the next
        FadeOut of the board leaves them behind.
        """
        for mob in mobs:
            self.remove(mob)
        board.add(*mobs)
