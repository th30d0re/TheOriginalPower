"""Chapter 0, video 1, drawn in ManimGX against the rendered voice.

The clips in voice/ch00_video_01 are the narration. This scene plays those
files. It does not call say(), which would speak the lines in another voice.

    manimgx inspect animations/ch00_system_init/scene.py ChapterZero
    manimgx render animations/ch00_system_init/scene.py ChapterZero --fps 30
"""

import json
from pathlib import Path

import manimgx as m

m.config.background_color = "#0B0C0F"

HERE = Path(__file__).resolve().parent
EP = HERE / "voice" / "ch00_video_01"
TURNS = json.loads((EP / "episode_manifest.json").read_text())["turns"]

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

EQ01 = (
    r"\vec{F}_{\mathrm{total}}=\mathbf{Q}\sum_{j=1}^{M}\vec{\mathcal{E}}_{\mathrm{mat}}^{(j)}"
    r"+\mathbf{Q}\left(\vec{v}\times\sum_{k=1}^{N}\rho_k\vec{B}_k\right)"
)
EQ01A = (
    r"\frac{\partial\vec{B}_k}{\partial t}=\eta_k\left(\mathbf{Q}\cdot"
    r"\sum_{j=1}^{M}\vec{\mathcal{E}}_{\mathrm{mat}}^{(j)}\right)-\lambda_k\vec{B}_k"
)
EQ02 = (
    r"\mathrm{Benefit}(E)\gg\mathrm{Benefit}(P)>\mathrm{Benefit}(F)"
    r">\mathrm{Benefit}(I)>\mathrm{Benefit}(O)"
)


def _fit(mob, width=12.2):
    if mob.width > width:
        mob.scale(width / mob.width)
    return mob


def _kicker(text):
    return m.Text(text, font_size=28, color=GOLD)


def _caption(text):
    return m.Text(text, font_size=28, color=MUTED)


def _bar(sym, name, role, fill, ink):
    body = m.RoundedRectangle(
        width=10.5, height=0.72, corner_radius=0.12,
        color=fill, fill_color=fill, fill_opacity=1, stroke_width=0,
    )
    mark = m.Text(sym, font_size=26, color=ink, weight="BOLD")
    title = m.Text(name, font_size=26, color=ink)
    detail = m.Text(role, font_size=20, color=ink)
    words = m.VGroup(mark, title, detail).arrange(m.RIGHT, buff=0.28)
    if words.width > 9.6:
        detail.scale_to_fit_width(max(1.5, 9.6 - mark.width - title.width - 0.8))
        words.arrange(m.RIGHT, buff=0.22)
    words.move_to(body)
    return m.VGroup(body, words)


class ChapterZero(m.Scene):
    """Manuscript boards, timed to the thirty-five rendered turns."""

    def construct(self) -> None:
        self.board = None
        self.cap = None
        self.hold(0)
        self.hold(1)
        self.layers(2)
        self.hold(3)
        self.eq_name(4)
        self.eq_write(5)
        self.recaption(6, "Q multiplies both terms. Only the electric term does economic work.")
        self.recaption(7, "The cross product stands orthogonal to velocity. Its work is zero.")
        self.recaption(8, "Software writes the charge. Wetware carries it. Hardware is the field.")
        self.speak(9, m.Indicate(self.eq))
        self.figure(10)
        self.eq1a_name(11)
        self.eq1a_write(12)
        self.recaption(13, "Eta is the fraction reinvested into the cultural field. Lambda is its decay.")
        self.recaption(14, "The field that divides the masses is funded by the extraction.")
        self.substrate(15)
        self.nodes(16)
        self.capital(23)
        self.hold(24)
        self.pyramid(25)
        self.circuit(26)
        self.eq2_name(32)
        self.eq2_write(33)
        self.recaption(34, "E sets the gradient. Each node below drops voltage. O is ground.")

    def speak(self, index, *anims, run_time=0.9):
        turn = TURNS[index]
        dur = turn["segments"][0]["duration_ms"] / 1000
        wav = EP / turn["segments"][0]["segment_wav"]
        self.add_sound(str(wav))
        spent = 0.0
        if anims:
            spent = min(run_time, dur)
            self.play(*anims, run_time=spent)
        if dur - spent > 0.03:
            self.wait(dur - spent)

    def hold(self, index):
        if self.board is None and index == 0:
            title = m.VGroup(
                _kicker("CHAPTER 0"),
                m.Text("System Initialization", font_size=54, color=PAPER),
                m.Text("The Geometry of Extraction", font_size=32, color=MUTED),
            ).arrange(m.DOWN, buff=0.28)
            self.speak(index, m.FadeIn(title, shift=0.15 * m.UP))
            self.board = title
            return
        self.speak(index)

    def enter(self, index, mob, writer=False, run_time=1.1):
        mob.move_to(0.35 * m.UP)
        anims = []
        if self.board is not None:
            anims.append(m.FadeOut(self.board))
        if self.cap is not None:
            anims.append(m.FadeOut(self.cap))
            self.cap = None
        anims.append(m.Write(mob) if writer else m.FadeIn(mob, shift=0.12 * m.UP))
        self.speak(index, *anims, run_time=run_time)
        self.board = mob

    def recaption(self, index, text):
        cap = _caption(text)
        cap.next_to(self.board, m.DOWN, buff=0.4)
        if cap.width > 12:
            cap.scale(12 / cap.width)
        old = getattr(self, "cap", None)
        anims = [m.FadeIn(cap)]
        if old is not None:
            anims.insert(0, m.FadeOut(old))
        self.speak(index, *anims, run_time=0.45)
        self.cap = cap

    def layers(self, index):
        block = m.VGroup(
            _kicker("TWO RESOLUTIONS"),
            m.Text("Software layer", font_size=40, color=PAPER),
            _caption("The interface recompiles. The kernel stays."),
            m.Text("Hardware layer", font_size=40, color=PAPER),
            _caption("The field equations the history instantiates."),
        ).arrange(m.DOWN, buff=0.22)
        self.enter(index, block)

    def eq_name(self, index):
        block = m.VGroup(
            _kicker("EQUATION 0.1"),
            m.Text("Unified Lorentz Force", font_size=42, color=PAPER),
        ).arrange(m.DOWN, buff=0.3)
        self.enter(index, block)

    def eq_write(self, index):
        eq = _fit(m.MathTex(EQ01, font_size=40, color=PAPER))
        block = m.VGroup(_kicker("EQUATION 0.1"), eq).arrange(m.DOWN, buff=0.45)
        self.eq = eq
        self.enter(index, block, writer=True, run_time=1.6)

    def figure(self, index):
        electric = [2.3, -1.15, 0]
        origin = [-2.6, -1.15, 0]
        total = [3.3, 1.55, 0]
        base = m.Arrow(origin, electric, color=BLUE, buff=0, stroke_width=5)
        side = m.DashedLine(electric, total, color=MUTED) if hasattr(m, "DashedLine") else m.Line(electric, total, color=MUTED)
        resultant = m.Arrow(origin, total, color=PAPER, buff=0, stroke_width=6)
        labels = m.VGroup(
            m.MathTex(r"\mathbf{Q}\sum\vec{\mathcal{E}}_{\mathrm{mat}}", font_size=28, color=BLUE).next_to(base, m.DOWN, buff=0.2),
            m.MathTex(r"\vec{F}_{\mathrm{total}}", font_size=30, color=GOLD).move_to([-0.2, 0.85, 0]),
            m.MathTex(r"\mathbf{Q}(\vec{v}\times\vec{B})", font_size=26, color=MUTED).next_to(side, m.RIGHT, buff=0.15),
        )
        head = m.VGroup(
            _kicker("FIGURE 0.1"),
            _caption("The unified Lorentz-force decomposition"),
        ).arrange(m.DOWN, buff=0.12).to_edge(m.UP, buff=0.35)
        diagram = m.VGroup(base, side, resultant, labels)
        block = m.VGroup(head, diagram)
        self.enter(index, block, run_time=1.3)

    def eq1a_name(self, index):
        block = m.VGroup(
            _kicker("EQUATION 0.1a"),
            m.Text("Self-exciting generator", font_size=40, color=PAPER),
        ).arrange(m.DOWN, buff=0.3)
        self.enter(index, block)

    def eq1a_write(self, index):
        eq = _fit(m.MathTex(EQ01A, font_size=38, color=PAPER))
        block = m.VGroup(_kicker("EQUATION 0.1a"), eq).arrange(m.DOWN, buff=0.45)
        self.enter(index, block, writer=True, run_time=1.5)

    def substrate(self, index):
        eq = _fit(m.MathTex(EQ01, font_size=34, color=PAPER))
        cap = _caption("Every later chapter instantiates this equation at another scale.")
        block = m.VGroup(_kicker("EQUATION 0.1"), eq, cap).arrange(m.DOWN, buff=0.4)
        self.enter(index, block, writer=True)

    def nodes(self, index):
        header = _kicker("FIVE STRUCTURAL POSITIONS")
        header.to_edge(m.UP, buff=0.4)
        specs = (
            ("E", "Elite", "the extraction beneficiary", GOLD, INK),
            ("P", "Puppet Class", "writes the policy, absorbs the blame", PUPPET, PAPER),
            ("F", "Enforcement", "makes the partition executable", FORCE, PAPER),
            ("I", "Buffer Class", "defends the line, receives the allocation", BUFFER, PAPER),
            ("O", "Out-group", "extractable, enclosed at the base", RED, PAPER),
        )
        anims = []
        if self.board is not None:
            anims.append(m.FadeOut(self.board))
        if self.cap is not None:
            anims.append(m.FadeOut(self.cap))
            self.cap = None
        anims.append(m.FadeIn(header))
        self.speak(index, *anims, run_time=0.5)
        bars = []
        for n, spec in enumerate(specs):
            bar = _bar(*spec)
            if bars:
                bar.next_to(bars[-1], m.DOWN, buff=0.14)
            else:
                bar.next_to(header, m.DOWN, buff=0.35)
            self.speak(17 + n, m.FadeIn(bar, shift=0.08 * m.UP), run_time=0.4)
            bars.append(bar)
        group = m.VGroup(header, *bars)
        self.board = group
        self.cap = None
        cap = _caption("Structural positions. A person can hold more than one.")
        cap.next_to(bars[-1], m.DOWN, buff=0.28)
        self.speak(22, m.FadeIn(cap), run_time=0.4)
        self.board = m.VGroup(group, cap)

    def capital(self, index):
        left = m.VGroup(
            m.Text("Capital", font_size=36, color=PAPER),
            _caption("Convertible reserve."),
            _caption("Net flow upward, toward E."),
        ).arrange(m.DOWN, buff=0.16)
        right = m.VGroup(
            m.Text("Capitalism", font_size=36, color=PAPER),
            _caption("The host operating system."),
            _caption("Ownership, accumulation, wage labor."),
        ).arrange(m.DOWN, buff=0.16)
        block = m.VGroup(left, right).arrange(m.RIGHT, buff=1.1)
        titled = m.VGroup(_kicker("DEFINITION"), block).arrange(m.DOWN, buff=0.5)
        self.enter(index, titled)

    def pyramid(self, index):
        apex, left, right = [0, 2.15, 0], [-3.1, -1.7, 0], [3.1, -1.7, 0]
        tri = m.Polygon(apex, left, right, color=PALE, stroke_width=2, fill_color="#16303F", fill_opacity=1)
        lines = []
        names = ("P", "F", "I", "O")
        for i, name in enumerate(names, start=1):
            t = i / 5
            y = apex[1] + (left[1] - apex[1]) * t
            x0 = apex[0] + (left[0] - apex[0]) * t
            x1 = apex[0] + (right[0] - apex[0]) * t
            lines.append(m.Line([x0, y, 0], [x1, y, 0], color=PALE, stroke_width=1.5))
        labels = m.VGroup(
            m.Text("E  Elite", font_size=26, color=PAPER).move_to([4.6, 1.7, 0]),
            m.Text("P  Puppet", font_size=26, color=PAPER).move_to([4.6, 0.85, 0]),
            m.Text("F  Enforcement", font_size=26, color=PAPER).move_to([4.6, 0.0, 0]),
            m.Text("I  Buffer", font_size=26, color=PAPER).move_to([4.6, -0.85, 0]),
            m.Text("O  Out-group", font_size=26, color=PAPER).move_to([4.6, -1.7, 0]),
        )
        head = m.VGroup(
            _kicker("FIGURE 0.2"),
            _caption("The five-tier pyramid"),
        ).arrange(m.DOWN, buff=0.1).to_edge(m.UP, buff=0.3)
        block = m.VGroup(head, tri, *lines, labels)
        self.enter(index, block, run_time=1.2)

    def circuit(self, index):
        specs = (
            ("E", "voltage source", GOLD, INK),
            ("P", "potential divider", PUPPET, PAPER),
            ("F", "current source", FORCE, PAPER),
            ("I", "dielectric", BUFFER, PAPER),
            ("O", "sink / ground", RED, PAPER),
        )
        boxes = []
        for sym, role, fill, ink in specs:
            body = m.RoundedRectangle(
                width=2.15, height=1.35, corner_radius=0.12,
                color=fill, fill_color=fill, fill_opacity=1, stroke_width=0,
            )
            mark = m.Text(sym, font_size=32, color=ink, weight="BOLD").move_to(body)
            detail = m.Text(role, font_size=24, color=PALE)
            cell = m.VGroup(body, mark, detail)
            boxes.append(cell)
        row = m.VGroup(*boxes).arrange(m.RIGHT, buff=0.38)
        for cell, (_, role, _, _) in zip(boxes, specs):
            cell[2].next_to(cell[0], m.DOWN, buff=0.14)
        head = _kicker("THE EXTRACTION CIRCUIT").next_to(row, m.UP, buff=0.55)
        block = m.VGroup(head, row)
        self.enter(index, block)
        for n in range(5):
            self.speak(27 + n, m.Indicate(boxes[n][0]))

    def eq2_name(self, index):
        block = m.VGroup(
            _kicker("EQUATION 0.2"),
            m.Text("Ordinal voltage drop", font_size=40, color=PAPER),
        ).arrange(m.DOWN, buff=0.3)
        self.enter(index, block)

    def eq2_write(self, index):
        eq = _fit(m.MathTex(EQ02, font_size=36, color=PAPER))
        block = m.VGroup(_kicker("EQUATION 0.2"), eq).arrange(m.DOWN, buff=0.45)
        self.enter(index, block, writer=True, run_time=1.4)
