"""YT01 cards: every card kind in the shot list's JSON schema, drawn from the JSON alone.

    YT01_SHOT=S00-01 .venv-manimgx/bin/manimgx render <this file> CardScene -r 960x540 --fps 15

A card run is a card shot plus its holds. The card enters on the primary's turn, and its items
(table rows, bars, timeline events, figure callouts, equation terms) reveal one by one, each on
the first spoken word in the run that names it, so a hold that narrates row two moves the gold
focus to row two. Copy edits live in cards/<id>.json; this file never needs them.

Schema (logs/shotlist_findings.md): kind, headline, items [{title, detail, qrUrl?}], sources,
qrUrl; equation adds latex, number, terms [{latex, gloss}]; figure adds image, caption; quote adds
quote, attribution. Kinds: title, stat_bars, quote, table, equation, figure, source, compare,
timeline.
"""

import re
import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16x9 import BG, DIM, GOLD, INK, NAVY2, YT, YTScene, _norm, qr  # noqa: E402

FONT = "Noto Sans"
XL, XR, TOP, FOOT = -6.55, 6.55, 3.55, -3.55  # safe box on the 14.2 x 8 frame
BODY_TOP, BODY_BOTTOM = 2.25, -2.95
QR_SIDE = 1.25
STOP = set("""the a an of and or to in on is are was were be by for with as at that this it its from which into
their his her they them who what when than then also has have had not no one two three four five six
same each every these those there here over under between through within about after before during
while where whose most more less very only just such other another first second third would could
should will shall must does did been being can may might""".split())


# ── text ──────────────────────────────────────────────────────────────────

def text(s, size=36, color=INK, weight="NORMAL", slant="NORMAL"):
    return m.Text(s, font=FONT, font_size=max(size, 28), color=color, weight=weight, slant=slant)


def para(s, width, size=36, color=INK, weight="NORMAL", max_lines=4, slant="NORMAL", center=False):
    """Greedy word wrap measured on the real glyphs; shrinks the size until it fits max_lines."""
    s = " ".join(str(s).split())
    while True:
        lines, cur = [], ""
        for word in s.split(" "):
            trial = f"{cur} {word}".strip()
            if cur and text(trial, size, weight=weight, slant=slant).width > width:
                lines.append(cur)
                cur = word
            else:
                cur = trial
        if cur:
            lines.append(cur)
        if len(lines) <= max_lines or size <= 28:
            break
        size = max(28, int(size * 0.9))
    group = m.VGroup(*[text(line, size, color, weight, slant) for line in lines])
    group.arrange(m.DOWN, buff=0.13 * size / 36, aligned_edge=m.ORIGIN if center else m.LEFT)
    if group.width > width:
        group.scale_to_fit_width(width)
    return group


def tokens(s):
    out = []
    for w in re.split(r"[\s/·,;:()\[\]—–\-→=≈]+", str(s)):
        n = _norm(w)
        if (len(n) >= 4 and n not in STOP) or (n.isdigit() and len(n) >= 2):
            out.append(n)
    return out


def stat_value(detail):
    """(value, label) of a bar: the last percentage, else a leading number (after an optional 'ζ =')."""
    pcts = re.findall(r"(\d[\d,]*\.?\d*)\s*%", detail)
    if pcts:
        return float(pcts[-1].replace(",", "")), pcts[-1] + "%"
    hit = re.match(r"\s*(?:[^\d\s=]{1,6}\s*=\s*)?[$≈~]?\s*(\d[\d,]*\.?\d*)\s*(million|M|billion)?", detail)
    if hit:
        return float(hit.group(1).replace(",", "")), hit.group(0).strip()
    return None


class CardScene(YTScene):
    """Plays one card run: the primary card shot and its holds."""
    SHOT = "S00-01"

    def build(self):
        self.data = self.card(0)
        if self.data is None:
            raise ValueError(f"{self.primary}: Render line names no card JSON")
        kind = self.data["kind"]
        self.qr_used = False
        self.frame_card()
        getattr(self, f"kind_{kind}")()

    # ── timing ────────────────────────────────────────────────────────────

    def schedule(self, labels, fallbacks=None):
        """Absolute reveal time per label: the first spoken word in the run that names it,
        searched forward from the previous label's word (monotonic). Unnamed labels are
        spaced between their named neighbours."""
        n_shots, n = len(self.run_turns), len(labels)
        fallbacks = fallbacks or [None] * n
        found, pos = [None] * n, (0, -1)
        for i, label in enumerate(labels):
            for toks in (tokens(label), tokens(fallbacks[i] or "")):
                if not toks:
                    continue
                if n == n_shots and n > 1:
                    shots = [i]  # one item per shot: each item belongs to its own turn
                else:
                    shots = range(pos[0], max(pos[0] + 1, n_shots - max(0, (n - i - 1) // max(1, n // n_shots + 1))))
                for k in shots:
                    words = self.WORDS[self.run_turns[k]]["words"]
                    start = pos[1] + 1 if k == pos[0] else 0
                    for j in range(start, len(words)):
                        w = _norm(words[j]["w"])
                        if any(w == t or (len(t) >= 5 and len(w) >= 5 and w[:5] == t[:5]) for t in toks):
                            found[i] = (k, j, self.beat(k) + max(0.0, words[j]["t"] - 0.15))
                            break
                    if found[i]:
                        break
                if found[i]:
                    pos = found[i][:2]
                    break
        t0 = self.beat(0) + 0.9
        times = [f[2] if f else None for f in found]
        if n == n_shots and n > 1:  # unnamed rows of a one-row-per-turn card land on their turn
            times = [t if t is not None else self.beat(i) + (0.9 if i == 0 else 0.35) for i, t in enumerate(times)]
        for i in range(n):  # spread the rest between named neighbours
            if times[i] is None:
                prev = next((times[j] for j in range(i - 1, -1, -1) if times[j] is not None), t0 - 0.6)
                nxt_i = next((j for j in range(i + 1, n) if times[j] is not None), None)
                nxt = times[nxt_i] if nxt_i is not None else min(self.T1 - 0.8, prev + 2.0 * (n - i))
                gap = (nxt - prev) / ((nxt_i if nxt_i is not None else n) - i + 1)
                times[i] = prev + gap
        out, last = [], t0 - 0.6
        for t in times:  # headline first, then at least 0.45 s between reveals
            t = max(t, last + 0.45, t0 if not out else 0)
            out.append(t)
            last = t
        return out

    # ── frame: headline, rule, source line, QR ──────────────────────────

    def frame_card(self):
        d = self.data
        head_w = 12.9
        for size in (52, 46, 42):
            self.head = text(d["headline"], size, INK, "BOLD")
            if self.head.width <= head_w:
                break
        else:
            self.head = para(d["headline"], head_w, 44, INK, "BOLD", max_lines=2)
        self.head.move_to([XL, TOP, 0], aligned_edge=m.UL)
        self.rule = m.Rectangle(width=1.7, height=0.07, fill_color=GOLD, fill_opacity=1, stroke_width=0)
        self.rule.next_to(self.head, m.DOWN, buff=0.22, aligned_edge=m.LEFT)
        self.body_top = min(BODY_TOP, self.rule.get_bottom()[1] - 0.4)
        foot, self.foot_top = [], FOOT
        if d.get("sources"):
            src = para(d["sources"], 10.6 if d.get("qrUrl") else 12.6, 28, DIM, max_lines=2)
            src.move_to([XL, FOOT, 0], aligned_edge=m.DL)
            foot.append(src)
            self.foot_top = src.get_top()[1]
        if d.get("qrUrl"):
            code = qr(d["qrUrl"], side=QR_SIDE).move_to([XR, FOOT, 0], aligned_edge=m.DR)
            foot.append(code)
            self.qr_used = True
        self.foot = m.VGroup(*foot)
        self.until(self.beat(0))
        self.play(m.FadeIn(self.head, shift=m.UP * 0.15), m.GrowFromEdge(self.rule, m.LEFT),
                  *[m.FadeIn(f) for f in foot], run_time=0.6)

    def bottom(self):
        """The body's floor: above the source line, and above the corner QR when there is one."""
        floor = max(BODY_BOTTOM, self.foot_top + 0.2)
        return max(floor, FOOT + QR_SIDE + 0.1) if self.qr_used else floor

    def reveal(self, groups, labels, fallbacks=None, focus=None):
        """Fade groups in on their scheduled words; `focus(i)` returns animations that move the
        gold accent to item i."""
        times = self.schedule(labels, fallbacks)
        for i, (g, t) in enumerate(zip(groups, times)):
            self.until(t)
            anims = [m.FadeIn(g, shift=m.RIGHT * 0.15)]
            if focus:
                anims += focus(i)
            self.play(*anims, run_time=0.45)
        return times

    # ── kinds ─────────────────────────────────────────────────────────────

    def kind_title(self):
        d = self.data
        self.remove(self.head, self.rule)
        big = para(d["headline"], 12.4, 84, INK, "BOLD", max_lines=2, center=True)
        rule = m.Rectangle(width=2.4, height=0.09, fill_color=GOLD, fill_opacity=1, stroke_width=0)
        lines = m.VGroup()
        for it in d["items"]:
            row = m.VGroup(text(it["title"].upper(), 34, GOLD, "BOLD"))
            if it.get("detail"):
                row.add(para(it["detail"], 11.0, 36, INK, max_lines=2, center=True))
            lines.add(row.arrange(m.DOWN, buff=0.12))
        lines.arrange(m.DOWN, buff=0.35)
        block = m.VGroup(big, rule, lines).arrange(m.DOWN, buff=0.4).move_to([0, 0.35, 0])
        if block.height > 6.2:
            block.scale_to_fit_height(6.2)
        self.play(m.FadeIn(big, shift=m.UP * 0.2), m.GrowFromCenter(rule), run_time=0.7)
        if lines:
            self.reveal(list(lines), [it["title"] for it in d["items"]], [it.get("detail") for it in d["items"]])

    def rows(self, items, title_w=3.6, size=36, stacked=False):
        """Table rows: gold-able title column, wrapped detail, navy panel behind each row.
        Stacked rows put the title above a full-width detail, for dense tables."""
        width = XR - XL - 0.3
        out = m.VGroup()
        for it in items:
            if stacked:
                title = para(it.get("title", ""), width - 0.6, size, INK, "BOLD", max_lines=1)
                detail = para(it.get("detail", ""), width - 0.6, size - 2, INK, max_lines=3)
                h = title.height + detail.height + 0.42
            else:
                title = para(it.get("title", ""), title_w - 0.3, size, INK, "BOLD", max_lines=2)
                detail = para(it.get("detail", ""), width - title_w - 0.5, size - 2, INK, max_lines=3)
                h = max(title.height, detail.height) + 0.36
            panel = m.RoundedRectangle(width=width, height=h, corner_radius=0.1, fill_color=NAVY2, fill_opacity=1,
                                       stroke_color=NAVY2, stroke_width=2)
            if stacked:
                title.move_to(panel.get_corner(m.UL) + m.RIGHT * 0.3 + m.DOWN * 0.16, aligned_edge=m.UL)
                detail.next_to(title, m.DOWN, buff=0.1, aligned_edge=m.LEFT)
            else:
                title.move_to(panel.get_left() + m.RIGHT * 0.3, aligned_edge=m.LEFT)
                detail.move_to(panel.get_left() + m.RIGHT * (title_w + 0.2), aligned_edge=m.LEFT)
            out.add(m.VGroup(panel, title, detail))
        out.arrange(m.DOWN, buff=0.16)
        return out

    def fit_body(self, group, right_pad=0.0):
        top, bottom = self.body_top, self.bottom()
        if group.height > top - bottom:
            group.scale_to_fit_height(top - bottom)
        if group.width > XR - XL - right_pad:
            group.scale_to_fit_width(XR - XL - right_pad)
        group.move_to([XL + (XR - XL - right_pad) / 2, (top + bottom) / 2, 0])
        group.align_to([XL, 0, 0], m.LEFT)
        group.align_to([0, top, 0], m.UP)
        return group

    def focus_rows(self, rows):
        def focus(i):
            anims = []
            for j, r in enumerate(rows[: i + 1]):
                on = j == i
                anims += [r[0].animate.set_stroke(GOLD if on else NAVY2, 4 if on else 2),
                          r[1].animate.set_color(GOLD if on else INK)]
            return anims
        return focus

    def kind_table(self):
        items = self.data["items"]
        room = self.body_top - self.bottom()
        for size, stacked in ((36, False), (33, False), (30, False), (28, False), (30, True), (28, True)):
            tw = min(4.6, max(2.4, max(text(it.get("title", ""), size, weight="BOLD").width for it in items) + 0.6))
            rows = self.rows(items, title_w=tw, size=size, stacked=stacked)
            if rows.height <= room:
                break
        rows = self.fit_body(rows)
        self.reveal(list(rows), [it.get("title", "") for it in items], [it.get("detail") for it in items],
                    self.focus_rows(rows))

    def kind_source(self):
        items = self.data["items"]
        width = XR - XL - (QR_SIDE + 0.3 if self.qr_used else 0)
        rows = m.VGroup()
        for it in items:
            code = qr(it["qrUrl"], side=1.05 if len(items) <= 3 else 0.85) if it.get("qrUrl") else None
            w = width - (1.35 if code else 0) - 0.6
            body = m.VGroup(para(it.get("title", ""), w, 36, INK, "BOLD", max_lines=2),
                            para(it.get("detail", ""), w, 30, DIM, max_lines=2)).arrange(m.DOWN, buff=0.1, aligned_edge=m.LEFT)
            h = max(body.height, code.height if code else 0) + 0.3
            panel = m.RoundedRectangle(width=width, height=h, corner_radius=0.1, fill_color=NAVY2, fill_opacity=1,
                                       stroke_color=NAVY2, stroke_width=2)
            body.move_to(panel.get_left() + m.RIGHT * 0.3, aligned_edge=m.LEFT)
            row = m.VGroup(panel, body[0], body[1])
            if code:
                code.move_to(panel.get_right() + m.LEFT * 0.16, aligned_edge=m.RIGHT)
                row.add(code)
            rows.add(row)
        rows.arrange(m.DOWN, buff=0.16)
        rows = self.fit_body(rows)
        self.reveal(list(rows), [it.get("title", "") for it in items], [it.get("detail") for it in items],
                    self.focus_rows(rows))

    def kind_compare(self):
        items = self.data["items"]
        n = len(items)
        gap = 0.35
        w = (XR - XL - gap * (n - 1)) / n
        cols = m.VGroup()
        for it in items:
            title = para(it.get("title", ""), w - 0.5, 40, GOLD, "BOLD", max_lines=2)
            detail = para(it.get("detail", ""), w - 0.5, 34, INK, max_lines=5)
            inner = m.VGroup(title, detail).arrange(m.DOWN, buff=0.3, aligned_edge=m.LEFT)
            panel = m.RoundedRectangle(width=w, height=inner.height + 0.7, corner_radius=0.12, fill_color=NAVY2,
                                       fill_opacity=1, stroke_color=NAVY2, stroke_width=2)
            inner.move_to(panel.get_corner(m.UL) + m.DR * 0.35, aligned_edge=m.UL)
            cols.add(m.VGroup(panel, inner))
        hmax = max(c[0].height for c in cols)
        for c in cols:
            c[0].stretch_to_fit_height(hmax).align_to(c[1], m.UP).shift(m.UP * 0.35)
        cols.arrange(m.RIGHT, buff=gap, aligned_edge=m.UP)
        cols = self.fit_body(cols)

        def focus(i):
            return [c[0].animate.set_stroke(GOLD if j == i else NAVY2, 4 if j == i else 2) for j, c in enumerate(cols[: i + 1])]
        self.reveal(list(cols), [it.get("title", "") for it in items], [it.get("detail") for it in items], focus)

    def kind_timeline(self):
        items = self.data["items"]
        n = len(items)
        y = (self.body_top + self.bottom()) / 2 + 0.55
        line = m.Line([XL + 0.3, y, 0], [XR - 0.3, y, 0], color=DIM, stroke_width=4)
        span = (XR - XL - 0.6) / n
        events = m.VGroup()
        for i, it in enumerate(items):
            x = XL + 0.3 + span * (i + 0.5)
            dot = m.Dot([x, y, 0], radius=0.11, color=GOLD)
            year = para(it.get("title", ""), span - 0.25, 40, GOLD, "BOLD", max_lines=2, center=True)
            year.next_to(dot, m.UP, buff=0.3)
            detail = para(it.get("detail", ""), span - 0.3, 32, INK, max_lines=5, center=True)
            detail.next_to(dot, m.DOWN, buff=0.35)
            events.add(m.VGroup(dot, year, detail))
        self.play(m.Create(line), run_time=0.6)

        def focus(i):
            return [e[0].animate.scale(1.0).set_color(GOLD if j == i else DIM) for j, e in enumerate(events[: i + 1])]
        self.reveal(list(events), [it.get("title", "") for it in items], [it.get("detail") for it in items], focus)

    def kind_stat_bars(self):
        items = self.data["items"]
        vals = [stat_value(it.get("detail", "")) for it in items]
        numeric = [i for i, v in enumerate(vals) if v]
        if len(numeric) < 2:
            return self.kind_table()
        top = max(vals[i][0] for i in numeric)
        label_w = 3.2
        bar_w = XR - XL - label_w - 2.4
        groups = m.VGroup()
        for i, it in enumerate(items):
            if i in numeric:
                lab = para(it.get("title", ""), label_w - 0.2, 36, INK, "BOLD", max_lines=2)
                full = m.Rectangle(width=bar_w, height=0.5, fill_color=NAVY2, fill_opacity=1, stroke_width=0)
                bar = m.Rectangle(width=max(0.08, bar_w * vals[i][0] / top), height=0.5, fill_color=GOLD,
                                  fill_opacity=1, stroke_width=0)
                num = text(vals[i][1], 40, GOLD, "BOLD")
                rest = it.get("detail", "")
                note = para(rest, bar_w, 28, DIM, max_lines=1) if rest.strip() != vals[i][1] else m.VGroup()
                lab.move_to([XL, 0, 0], aligned_edge=m.LEFT)
                full.move_to([XL + label_w + bar_w / 2, 0, 0])
                bar.move_to(full.get_left(), aligned_edge=m.LEFT)
                num.next_to(full, m.RIGHT, buff=0.2)
                if num.width > 2.1:
                    num.scale_to_fit_width(2.1)
                if len(note):
                    note.next_to(full, m.DOWN, buff=0.1, aligned_edge=m.LEFT)
                groups.add(m.VGroup(lab, full, bar, num, note))
            else:
                groups.add(self.rows([it], title_w=label_w)[0])
        groups.arrange(m.DOWN, buff=0.38, aligned_edge=m.LEFT)
        groups = self.fit_body(groups)
        bars = {i: groups[i] for i in numeric}
        times = self.schedule([it.get("title", "") for it in items], [it.get("detail") for it in items])
        for i, (g, t) in enumerate(zip(groups, times)):
            self.until(t)
            if i in bars:
                lab, full, bar, num, note = g
                self.play(m.FadeIn(lab), m.FadeIn(full), m.GrowFromEdge(bar, m.LEFT), run_time=0.7)
                self.play(m.FadeIn(num), m.FadeIn(note), run_time=0.3)
            else:
                self.play(m.FadeIn(g, shift=m.RIGHT * 0.15), run_time=0.45)

    def kind_quote(self):
        d = self.data
        mark = text("“", 160, GOLD, "BOLD")
        body = para(d["quote"], 11.4, 50, INK, max_lines=5, slant="ITALIC")
        attrib = text("— " + d.get("attribution", ""), 34, GOLD, "BOLD") if d.get("attribution") else m.VGroup()
        notes = m.VGroup(*[para(f"{it.get('title', '')}: {it.get('detail', '')}".strip(": "), 11.4, 30, DIM, max_lines=2)
                           for it in d["items"]]).arrange(m.DOWN, buff=0.12, aligned_edge=m.LEFT)
        block = m.VGroup(body, attrib, notes).arrange(m.DOWN, buff=0.4, aligned_edge=m.LEFT)
        block = self.fit_body(block, right_pad=0)
        block.shift(m.RIGHT * 0.9)
        mark.next_to(body, m.LEFT, buff=0.15, aligned_edge=m.UP).shift(m.UP * 0.25)
        if block.get_right()[0] > XR:
            block.scale_to_fit_width(XR - block.get_left()[0])
        lines = list(body)
        span = max(1.2, min(4.0, (self.beat_end(0) - self.time - self.T0 - 1.5)))
        self.play(m.FadeIn(mark), m.LaggedStart(*[m.FadeIn(ln, shift=m.UP * 0.1) for ln in lines], lag_ratio=0.35),
                  run_time=span)
        if len(attrib):
            self.play(m.FadeIn(attrib), run_time=0.4)
        if len(notes):
            self.reveal(list(notes), [it.get("title", "") for it in d["items"]], [it.get("detail") for it in d["items"]])

    def kind_equation(self):
        d = self.data
        terms = d.get("terms", [])
        latex = " ".join(d["latex"].split())
        isolate = [t["latex"] for t in terms if t["latex"] in latex]
        try:
            eq = m.MathTex(latex, font_size=80, color=INK, substrings_to_isolate=isolate)
        except Exception:  # an isolation that splits a group LaTeX cannot typeset
            eq, isolate = m.MathTex(latex, font_size=80, color=INK), []
        number = text(f"({d['number']})", 34, DIM) if re.fullmatch(r"\d+\.\d+", str(d.get("number", ""))) else None
        eq_w = XR - XL - (2.2 if number else 0.4)
        if eq.width > eq_w:
            eq.scale_to_fit_width(eq_w)
        room = self.body_top - self.bottom()
        eq_hmax = min(2.2 if len(terms) <= 3 else 1.7, room * (0.42 if terms else 0.9))
        if eq.height > eq_hmax:
            eq.scale_to_fit_height(eq_hmax)
        cols = 2 if len(terms) > 3 else 1
        col_w = (XR - XL - 0.3) / cols
        sym_w = 2.4 if cols == 2 else 3.2
        rows = m.VGroup()
        for t in terms:
            sym = m.MathTex(" ".join(t["latex"].split()), font_size=48 if cols == 1 else 42, color=GOLD)
            if sym.width > sym_w:
                sym.scale_to_fit_width(sym_w)
            gloss = para(t["gloss"], col_w - sym_w - 0.7, 34 if cols == 1 else 30, INK, max_lines=2)
            sym.move_to([0, 0, 0], aligned_edge=m.LEFT)
            gloss.move_to([sym_w + 0.4, 0, 0], aligned_edge=m.LEFT)
            rows.add(m.VGroup(sym, gloss))
        if cols == 1:
            rows.arrange(m.DOWN, buff=0.22, aligned_edge=m.LEFT)
        else:
            half = (len(rows) + 1) // 2
            left = m.VGroup(*rows[:half]).arrange(m.DOWN, buff=0.22, aligned_edge=m.LEFT)
            right = m.VGroup(*rows[half:]).arrange(m.DOWN, buff=0.22, aligned_edge=m.LEFT)
            right.move_to(left.get_corner(m.UL) + m.RIGHT * col_w, aligned_edge=m.UL)
        if rows.height > room - eq.height - 0.6:
            rows.scale_to_fit_height(max(0.6, room - eq.height - 0.6))
        x_eq = -0.7 if number else 0
        if terms:
            eq.move_to([x_eq, self.body_top - eq.height / 2 - 0.15, 0])
            rows.next_to(eq, m.DOWN, buff=0.55)
            rows.align_to([XL + 0.3, 0, 0], m.LEFT)
        else:
            eq.move_to([x_eq, (self.body_top + self.bottom()) / 2, 0])
        if number:
            number.move_to([XR, eq.get_center()[1], 0], aligned_edge=m.RIGHT)
        self.play(m.Write(eq), *([m.FadeIn(number)] if number else []), run_time=1.4)
        if not terms:
            return
        parts = [eq.get_part_by_tex(t["latex"]) if t["latex"] in isolate else None for t in terms]
        y_mark = eq.get_bottom()[1] - 0.16
        marks = [m.Line([p.get_left()[0], y_mark, 0], [p.get_right()[0], y_mark, 0], color=GOLD,
                        stroke_width=5) if p is not None else None for p in parts]
        live = []

        def focus(i):
            anims = [eq.animate.set_color(INK)]
            for b in live:
                anims.append(m.FadeOut(b))
            live.clear()
            if parts[i] is not None:
                anims.append(parts[i].animate.set_color(GOLD))
                anims.append(m.GrowFromCenter(marks[i]))
                live.append(marks[i])
            for j, r in enumerate(rows[: i + 1]):
                anims.append(r[1].animate.set_color(INK if j == i else DIM))
            return anims
        self.reveal(list(rows), [t["gloss"] for t in terms], None, focus)
        self.until(self.T1 - 1.0)
        if live:
            self.play(*[m.FadeOut(b) for b in live], eq.animate.set_color(INK), run_time=0.5)

    def kind_figure(self):
        d = self.data
        items = d["items"]
        img = m.ImageMobject(str(YT / d["image"]))
        side_w = 4.4 if items else 0
        max_w = XR - XL - side_w - (0.35 if items else 0)
        room_top, room_bottom = self.body_top, self.bottom() + 0.55
        cap_h = para(d.get("caption", ""), max_w, 28, DIM, max_lines=2).height + 0.2 if d.get("caption") else 0
        img.scale_to_fit_height(room_top - room_bottom - cap_h + 0.55)
        if img.width > max_w:
            img.scale_to_fit_width(max_w)
        img.move_to([XL + img.width / 2, room_top - img.height / 2, 0])
        frame = m.SurroundingRectangle(img, color=NAVY2, buff=0.0, stroke_width=3)
        cap = para(d.get("caption", ""), max(img.width, max_w), 28, DIM, max_lines=2) if d.get("caption") else m.VGroup()
        if len(cap):
            cap.next_to(img, m.DOWN, buff=0.15, aligned_edge=m.LEFT)
        self.play(m.FadeIn(img), m.FadeIn(frame), m.FadeIn(cap), run_time=0.8)
        if not items:
            return
        call = m.VGroup()
        for it in items:
            bar = m.Rectangle(width=0.08, height=0.5, fill_color=GOLD, fill_opacity=1, stroke_width=0)
            body = m.VGroup(para(it.get("title", ""), side_w - 0.35, 34, GOLD, "BOLD", max_lines=2),
                            para(it.get("detail", ""), side_w - 0.35, 30, INK, max_lines=4)
                            ).arrange(m.DOWN, buff=0.08, aligned_edge=m.LEFT)
            bar.stretch_to_fit_height(body.height)
            call.add(m.VGroup(bar, body).arrange(m.RIGHT, buff=0.2, aligned_edge=m.UP))
        call.arrange(m.DOWN, buff=0.3, aligned_edge=m.LEFT)
        if call.height > room_top - room_bottom + 0.4:
            call.scale_to_fit_height(room_top - room_bottom + 0.4)
        call.move_to([XR - side_w / 2, room_top - call.height / 2, 0])
        call.align_to([XR - side_w, 0, 0], m.LEFT)

        def focus(i):
            return [c[1][0].animate.set_color(GOLD if j == i else INK) for j, c in enumerate(call[: i + 1])] + \
                   [c[0].animate.set_opacity(1 if j == i else 0.35) for j, c in enumerate(call[: i + 1])]
        self.reveal(list(call), [it.get("title", "") for it in items], [it.get("detail") for it in items], focus)
