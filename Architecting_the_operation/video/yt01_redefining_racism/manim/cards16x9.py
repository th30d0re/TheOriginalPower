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
FRAME_W = 1920 / 1080 * 8.0  # manim frame width (≈14.2)
TABLE_GRID_W = max(12.8, FRAME_W * 0.90)
BODY_TOP, BODY_BOTTOM = 2.25, -2.95
QR_SIDE = 1.25
_INLINE_MATH = re.compile(r"\$([^$]+)\$")

STOP = set("""the a an of and or to in on is are was were be by for with as at that this it its from which into
their his her they them who what when than then also has have had not no one two three four five six
same each every these those there here over under between through within about after before during
while where whose most more less very only just such other another first second third would could
should will shall must does did been being can may might""".split())


# ── text ──────────────────────────────────────────────────────────────────

def _math_spans(s):
    """Split on $...$; return None when the string has no math delimiters."""
    s = str(s)
    if not _INLINE_MATH.search(s):
        return None  # no $...$ pair; a lone "$" is currency
    spans, pos = [], 0
    for hit in _INLINE_MATH.finditer(s):
        if hit.start() > pos:
            spans.append(("text", s[pos:hit.start()]))
        spans.append(("math", hit.group(1).strip()))
        pos = hit.end()
    if pos < len(s):
        spans.append(("text", s[pos:]))
    return spans or None


def _mathtex(tex, size, color):
    tex = " ".join(str(tex).split())
    try:
        return m.MathTex(tex, font_size=max(size, 28), color=color)
    except Exception:
        return text(tex.replace("\\", ""), size, color)


def inline(s, size=36, color=INK, weight="NORMAL", slant="NORMAL"):
    """One line: Text spans plus MathTex for each $...$ segment, baseline-aligned."""
    spans = _math_spans(s)
    if spans is None:
        return text(s, size, color, weight, slant)
    pieces = []
    for kind, chunk in spans:
        if kind == "text" and chunk:
            pieces.append(text(chunk, size, color, weight, slant))
        elif kind == "math" and chunk:
            pieces.append(_mathtex(chunk, size, color))
    if not pieces:
        return m.VGroup()
    row = m.VGroup(*pieces)
    row.arrange(m.RIGHT, buff=0.05, aligned_edge=m.DOWN)
    return row


def _mixed_tokens(s):
    spans = _math_spans(s) or [("text", str(s))]
    tokens = []
    for kind, chunk in spans:
        if kind == "math":
            tokens.append(("math", chunk))
        else:
            chunk = " ".join(chunk.split())
            for word in chunk.split(" ") if chunk else []:
                tokens.append(("text", word))
    return tokens


def _inline_from_tokens(toks, size, color, weight, slant):
    out = ""
    for kind, chunk in toks:
        if kind == "math":
            out += f"${chunk}$"
        else:
            out += (" " if out and not out.endswith("$") else "") + chunk
    return inline(out, size, color, weight, slant)


def _line_width_tokens(toks, width, size, color, weight, slant):
    mob = _inline_from_tokens(toks, size, color, weight, slant)
    if mob.width > width:
        mob.scale_to_fit_width(width)
    return mob.width


def text(s, size=36, color=INK, weight="NORMAL", slant="NORMAL"):
    if _math_spans(s) is not None:
        return inline(s, size, color, weight, slant)
    return m.Text(s, font=FONT, font_size=max(size, 28), color=color, weight=weight, slant=slant)


def para(s, width, size=36, color=INK, weight="NORMAL", max_lines=4, slant="NORMAL", center=False, min_size=28):
    """Greedy word wrap measured on the real glyphs; shrinks the size until it fits max_lines."""
    s = " ".join(str(s).split())
    floor = max(28, min_size)
    if _math_spans(s) is None:
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
            if len(lines) <= max_lines or size <= floor:
                break
            size = max(floor, int(size * 0.9))
        group = m.VGroup(*[text(line, size, color, weight, slant) for line in lines])
    else:
        while True:
            lines, cur = [], []
            for tok in _mixed_tokens(s):
                trial = cur + [tok]
                if cur and _line_width_tokens(trial, width, size, color, weight, slant) > width:
                    lines.append(cur)
                    cur = [tok]
                else:
                    cur = trial
            if cur:
                lines.append(cur)
            if len(lines) <= max_lines or size <= floor:
                break
            size = max(floor, int(size * 0.9))
        rendered = [_inline_from_tokens(toks, size, color, weight, slant) for toks in lines]
        group = m.VGroup(*rendered)
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

    def _schedule_found(self, labels, fallbacks=None):
        """Per-item (turn index, word index, absolute time) when a label first names itself."""
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
        return found

    def schedule(self, labels, fallbacks=None):
        """Absolute reveal time per label: the first spoken word in the run that names it,
        searched forward from the previous label's word (monotonic). Unnamed labels are
        spaced between their named neighbours."""
        n_shots, n = len(self.run_turns), len(labels)
        fallbacks = fallbacks or [None] * n
        found = self._schedule_found(labels, fallbacks)
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

    def _match_time_on_turn(self, k, label, fallback=None):
        for toks in (tokens(label), tokens(fallback or "")):
            if not toks:
                continue
            words = self.WORDS[self.run_turns[k]]["words"]
            for wd in words:
                w = _norm(wd["w"])
                if any(w == t or (len(t) >= 5 and len(w) >= 5 and w[:5] == t[:5]) for t in toks):
                    return self.beat(k) + max(0.0, wd["t"] - 0.15)
        return None

    def _item_shots(self, labels, fallbacks=None):
        found = self._schedule_found(labels, fallbacks)
        n_shots, n = len(self.run_turns), len(labels)
        shots = []
        for i, hit in enumerate(found):
            if hit:
                shots.append(hit[0])
            elif n == n_shots and n > 1:
                shots.append(min(i, n_shots - 1))
            else:
                shots.append(0)
        return shots

    def _turn_cue(self, k, labels, fallbacks, shots, revealed):
        fallbacks = fallbacks or [None] * len(labels)
        for i, lab in enumerate(labels):
            if shots[i] == k and i not in revealed:
                hit = self._match_time_on_turn(k, lab, fallbacks[i])
                if hit is not None:
                    return hit
        for i, lab in enumerate(labels):
            hit = self._match_time_on_turn(k, lab, fallbacks[i])
            if hit is not None:
                return hit
        return self.beat(k) + (0.9 if k == 0 else 0.35)

    def _match_score_turn(self, k, label, fallback=None):
        said = {_norm(w["w"]) for w in self.WORDS[self.run_turns[k]]["words"]}
        score = 0
        for t in tokens(label) + tokens(fallback or ""):
            if t in said or any(len(t) >= 5 and len(s) >= 5 and s[:5] == t[:5] for s in said):
                score += 1
        return score

    def _best_item_on_turn(self, k, labels, fallbacks=None):
        fallbacks = fallbacks or [None] * len(labels)
        best_i, best = None, 0
        for i, lab in enumerate(labels):
            s = self._match_score_turn(k, lab, fallbacks[i])
            if s > best:
                best, best_i = s, i
        return best_i

    def key_phrase(self, k, max_words=8):
        picked = []
        for word in self.say(k).split():
            if not picked and _norm(word) in STOP:
                continue
            picked.append(word)
            if len(picked) >= max_words:
                break
        return " ".join(picked)

    def _callout_anims(self, phrase, anchor=None):
        phrase = " ".join(str(phrase).split())
        if not phrase:
            return []
        mob = para(phrase, XR - XL - 0.5, 28, GOLD, "BOLD", max_lines=1)
        if anchor is not None:
            mob.next_to(anchor, m.DOWN, buff=0.28, aligned_edge=m.LEFT)
            if mob.get_bottom()[1] < self.foot_top + 0.05:
                mob.shift(m.UP * (self.foot_top + 0.05 - mob.get_bottom()[1]))
        elif self.data.get("sources"):
            y = self.foot_top - 0.14 - mob.height / 2
            mob.move_to([(XL + XR) / 2, y, 0])
        else:
            y = max(FOOT + 0.55, self.bottom() - 0.12)
            mob.move_to([(XL + XR) / 2, y, 0])
        out = []
        if getattr(self, "_callout_mob", None) is not None:
            out.append(m.FadeOut(self._callout_mob))
        out.append(m.FadeIn(mob, shift=m.UP * 0.08))
        self._callout_mob = mob
        return out

    def _default_hold(self, k, labels, fallbacks, focus, revealed, state):
        """Focus ring or lower-third when a turn would otherwise repeat the frame."""
        if not revealed:
            return []
        kind = self.data.get("kind")
        i = self._best_item_on_turn(k, labels, fallbacks)
        if focus and kind in ("table", "stat_bars", "compare", "timeline", "source", "figure"):
            pool = sorted(revealed)
            if not pool:
                return []
            if i is None or state.get("focus") == i:
                i = pool[(k + 1) % len(pool)] if len(pool) > 1 else pool[0]
            state["focus"] = i
            return focus(i)
        elif i is not None and focus and state.get("focus") != i:
            state["focus"] = i
            return focus(i)
        phrase = self.data.get("reading") or self.key_phrase(k)
        if phrase and state.get("callout") != phrase:
            state["callout"] = phrase
            return self._callout_anims(phrase)
        alt = self.key_phrase(k, max_words=6)
        if alt and alt != phrase and state.get("callout") != alt:
            state["callout"] = alt
            return self._callout_anims(alt)
        return []

    def play_run(self, groups, labels, fallbacks=None, focus=None, turn=None, reveal_item=None):
        """One visible beat per run turn: item reveals plus hold accents on extra turns.
        Several items may share one turn; each gets its own until() on the matched word."""
        labels = list(labels)
        fallbacks = fallbacks or [None] * len(labels)
        shots = self._item_shots(labels, fallbacks)
        revealed, state = set(), {"focus": None, "callout": None}
        self._callout_mob = None
        for k in range(len(self.run_turns)):
            new_on_turn = False
            for i, g in enumerate(groups):
                if shots[i] == k and i not in revealed:
                    self.until(self._turn_cue(k, labels, fallbacks, shots, revealed))
                    anims = reveal_item(i, g) if reveal_item else [m.FadeIn(g, shift=m.RIGHT * 0.15)]
                    if focus:
                        anims += focus(i)
                    if anims:
                        self.play(*anims, run_time=0.45)
                    revealed.add(i)
                    state["focus"] = i
                    new_on_turn = True
            if turn and not new_on_turn:
                self.until(self._turn_cue(k, labels, fallbacks, shots, revealed))
                anims = turn(k, revealed, state) or []
                if anims:
                    self.play(*anims, run_time=0.45)
            elif not turn and not new_on_turn:
                self.until(self._turn_cue(k, labels, fallbacks, shots, revealed))
                anims = self._default_hold(k, labels, fallbacks, focus, revealed, state)
                if anims:
                    self.play(*anims, run_time=0.45)
        return shots

    def reveal(self, groups, labels, fallbacks=None, focus=None, turn=None):
        """Fade groups in on their scheduled words; optional per-turn hold accents."""
        return self.play_run(groups, labels, fallbacks, focus, turn)

    def play_hold_turns(self, turn, start_k=1):
        """Hold accents from turn ``start_k`` through the run end (after main content is on screen)."""
        state = {"focus": None, "callout": None, "ul": None}
        for k in range(start_k, len(self.run_turns)):
            self.until(self._turn_cue(k, [], [], [], set()))
            anims = turn(k, set(), state) or []
            if anims:
                self.play(*anims, run_time=0.45)

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
                anims += [r[0].animate.set_stroke(GOLD if on else NAVY2, 4 if on else 2)]
                for k in range(1, len(r)):
                    anims += [r[k].animate.set_color(GOLD if on else INK)]
            return anims
        return focus

    def _table_col_widths(self, ncols, total_w):
        if ncols == 3:
            return [total_w * 0.14, total_w * 0.48, total_w * 0.38]
        return [total_w / ncols] * ncols

    def _table_math_cell(self, cell, width, min_font=40):
        """Set-relationship column: MathTex ≥ min_font; width-fit scales the mob, not a parent group."""
        s = str(cell).strip()
        spans = _math_spans(s)
        min_h = min_font / (m.config.pixel_height / m.config.frame_height)
        if spans and not any(kind == "text" and chunk.strip() for kind, chunk in spans):
            tex = " ".join(chunk for kind, chunk in spans if kind == "math")
            mob = _mathtex(tex, min_font, INK)
            if mob.width > width:
                scale = width / mob.width
                if mob.height * scale >= min_h * 0.98:
                    mob.scale(scale)
            return mob
        mob = inline(s, min_font, INK)
        if mob.width > width:
            scale = width / mob.width
            if mob.height * scale >= min_h * 0.98:
                mob.scale(scale)
        return mob

    def _table_text_cell(self, cell, width, size, weight="NORMAL", max_lines=2):
        size = max(size, 32)
        mob = para(cell, width, size, INK, weight, max_lines=max_lines, min_size=32)
        if len(mob) > max_lines:
            mob = m.VGroup(*mob[:max_lines])
        return mob

    def _table_grid_row(self, cells, col_ws, label_size=32, math_min=40, header=False, row_h=None):
        width = sum(col_ws)
        ncols = len(col_ws)
        mobs = []
        for i, cell in enumerate(cells[:ncols]):
            pad = 0.20
            w = col_ws[i] - pad
            if header:
                weight = "BOLD"
                if i == 1 and _math_spans(str(cell)):
                    mobs.append(self._table_math_cell(cell, w, min_font=32))
                else:
                    mobs.append(self._table_text_cell(cell, w, label_size, weight, max_lines=2))
            elif i == 1:
                mobs.append(self._table_math_cell(cell, w, min_font=math_min))
            else:
                weight = "BOLD" if i == 0 else "NORMAL"
                mobs.append(self._table_text_cell(cell, w, label_size, weight, max_lines=2))
        while len(mobs) < ncols:
            mobs.append(m.VGroup())
        pad_v, pad_h = 0.18, 0.14
        content_h = max((m.height for m in mobs if len(m)), default=0) + pad_v
        h = max(row_h or 0, content_h)
        panel = m.RoundedRectangle(width=width, height=h, corner_radius=0.1, fill_color=NAVY2, fill_opacity=1,
                                   stroke_color=NAVY2, stroke_width=2)
        for i, mob in enumerate(mobs):
            if not len(mob):
                continue
            x = panel.get_left()[0] + pad_h + sum(col_ws[:i])
            y_top = panel.get_top()[1] - (h - mob.height) / 2
            mob.move_to([x, y_top, 0], aligned_edge=m.UL)
        return m.VGroup(panel, *mobs)

    def _build_table_grid(self, columns, items):
        width = TABLE_GRID_W
        ncols = len(columns) if columns else max(len(it.get("cells") or []) for it in items)
        col_ws = self._table_col_widths(ncols, width)
        header = self._table_grid_row(columns, col_ws, label_size=32, math_min=32, header=True) if columns else m.VGroup()
        rows = m.VGroup()
        for it in items:
            cells = it.get("cells")
            if not cells:
                cells = [it.get("title", ""), it.get("detail", "")]
            rows.add(self._table_grid_row(cells, col_ws, label_size=32, math_min=40))
        rows.arrange(m.DOWN, buff=0.10)
        return header, rows, col_ws

    def _fit_table_grid_vertical(self, header, body, col_ws, columns, items, room):
        gap_hdr, row_gap = 0.08, 0.06
        n = len(items)
        if not n:
            return m.VGroup(header, body).arrange(m.DOWN, buff=gap_hdr) if len(header) else body
        if columns:
            header = self._table_grid_row(columns, col_ws, label_size=28, math_min=28, header=True)
        hdr_h = header[0].height if len(header) else 0
        min_heights = []
        for it in items:
            cells = it.get("cells")
            if not cells:
                cells = [it.get("title", ""), it.get("detail", "")]
            row = self._table_grid_row(cells, col_ws, label_size=32, math_min=40)
            min_heights.append(row[0].height)
        min_body = sum(min_heights) + row_gap * max(0, n - 1)
        foot_pad = 0.20
        slack = room - foot_pad - hdr_h - gap_hdr - min_body
        extra = slack / n if slack > 0 and n else 0
        new_rows = m.VGroup()
        for it, mh in zip(items, min_heights):
            cells = it.get("cells")
            if not cells:
                cells = [it.get("title", ""), it.get("detail", "")]
            new_rows.add(self._table_grid_row(cells, col_ws, label_size=32, math_min=40, row_h=mh + extra))
        new_rows.arrange(m.DOWN, buff=row_gap)
        block = m.VGroup(header, new_rows).arrange(m.DOWN, buff=gap_hdr) if len(header) else new_rows
        block.align_to([XL, self.bottom() + foot_pad, 0], m.DOWN)
        block.align_to([XL, 0, 0], m.LEFT)
        return block

    def kind_table(self):
        d = self.data
        items = d["items"]
        columns = d.get("columns")
        grid = columns or any(isinstance(it.get("cells"), list) for it in items)
        room = self.body_top - self.bottom()
        if grid:
            header, body, col_ws = self._build_table_grid(columns or [], items)
            block = self._fit_table_grid_vertical(header, body, col_ws, columns or [], items, room)
            if columns:
                self.play(m.FadeIn(block[0]), run_time=0.35)
                body_out = block[1]
            else:
                body_out = block
            labels = []
            fallbacks = []
            for it in items:
                cells = it.get("cells") or [it.get("title", ""), it.get("detail", "")]
                labels.append(cells[0])
                fallbacks.append(cells[1] if len(cells) > 1 else it.get("detail"))
            self.reveal(list(body_out), labels, fallbacks, self.focus_rows(body_out))
            return
        for size, stacked in ((36, False), (33, False), (30, False), (28, False), (30, True), (28, True)):
            tw = min(4.6, max(2.4, max(inline(it.get("title", ""), size, INK, "BOLD").width for it in items) + 0.6))
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

        def focus_bar(i):
            anims = []
            for j, g in enumerate(groups):
                if j not in bars:
                    continue
                lab, full, bar, num, note = g
                on = j == i
                anims += [lab.animate.set_color(GOLD if on else INK),
                          full.animate.set_stroke(GOLD if on else NAVY2, 4 if on else 0)]
            return anims

        def reveal_bar(i, g):
            if i in bars:
                lab, full, bar, num, note = g
                return [m.FadeIn(lab), m.FadeIn(full), m.GrowFromEdge(bar, m.LEFT), m.FadeIn(num), m.FadeIn(note)]
            return [m.FadeIn(g, shift=m.RIGHT * 0.15)]

        self.play_run(groups, [it.get("title", "") for it in items], [it.get("detail") for it in items],
                      focus_bar, reveal_item=reveal_bar)

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
        self._quote_underlines = []

        def quote_turn(k, revealed, state):
            if k == 0 and not len(notes):
                return []
            phrase = self.key_phrase(k, max_words=6)
            if not phrase:
                return []
            ul = self._quote_underline(body, phrase, state)
            return ul or self._callout_anims(phrase)

        self.play_hold_turns(quote_turn, start_k=1)

    def _quote_underline(self, body, phrase, state):
        phrase_norm = [_norm(w) for w in phrase.split()]
        if not phrase_norm:
            return []
        lines = list(body)
        for ln in lines:
            line_words = re.findall(r"\S+", ln.text)
            norms = [_norm(w) for w in line_words]
            for start in range(len(norms)):
                if norms[start:start + len(phrase_norm)] == phrase_norm:
                    key = (ln.text, start)
                    if state.get("ul") == key:
                        return []
                    state["ul"] = key
                    # approximate underline from character width
                    pre = " ".join(line_words[:start])
                    hit = " ".join(line_words[start:start + len(phrase_norm)])
                    x0 = ln.get_left()[0] + (text(pre + " ", ln.font_size).width if pre else 0)
                    x1 = x0 + text(hit, ln.font_size).width
                    y = ln.get_bottom()[1] - 0.04
                    line = m.Line([x0, y, 0], [x1, y, 0], color=GOLD, stroke_width=4)
                    out = []
                    if self._quote_underlines:
                        out.append(m.FadeOut(m.VGroup(*self._quote_underlines)))
                        self._quote_underlines.clear()
                    out.append(m.GrowFromCenter(line))
                    self._quote_underlines.append(line)
                    return out
        return []

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
        eq_state = {"mode": None}

        def _clear_eq_marks():
            anims = [eq.animate.set_color(INK)]
            for b in live:
                anims.append(m.FadeOut(b))
            live.clear()
            return anims

        def focus(i):
            anims = _clear_eq_marks()
            if parts[i] is not None:
                anims.append(parts[i].animate.set_color(GOLD))
                anims.append(m.GrowFromCenter(marks[i]))
                live.append(marks[i])
            for j, r in enumerate(rows):
                anims.append(r[1].animate.set_color(INK if j == i else DIM))
            eq_state["mode"] = ("term", i)
            return anims

        def _full_equation():
            anims = _clear_eq_marks()
            anims.append(eq.animate.set_color(GOLD))
            for r in rows:
                anims.append(r[1].animate.set_color(DIM))
            eq_state["mode"] = "full"
            return anims

        read_anchor = rows if len(rows) else eq

        def equation_turn(k, revealed, state):
            if eq_state["mode"] == "full" and d.get("reading"):
                phrase = d["reading"]
            elif any(w in self.say(k).lower() for w in ("predict", "induces", "generates", "opposes", "force", "charge")):
                phrase = d.get("reading") or self.key_phrase(k)
            else:
                phrase = None
            if phrase and state.get("callout") != phrase:
                state["callout"] = phrase
                return _clear_eq_marks() + self._callout_anims(phrase, anchor=read_anchor)
            i = self._best_item_on_turn(k, [t["gloss"] for t in terms], [t["latex"] for t in terms])
            if i is not None and eq_state["mode"] != ("term", i):
                return focus(i)
            said = self.say(k).lower()
            if any(tok in said for tok in ("nabla", "equation", "faraday", "induction", "times")) or (
                    len(terms) >= 2 and self._match_score_turn(k, " ".join(t["gloss"] for t in terms)) >= 2
            ):
                if eq_state["mode"] != "full":
                    return _full_equation()
            if i is not None:
                return focus(i)
            phrase = self.key_phrase(k)
            if phrase and state.get("callout") != phrase:
                state["callout"] = phrase
                return _clear_eq_marks() + self._callout_anims(phrase, anchor=read_anchor)
            return []

        self.play_run(list(rows), [t["gloss"] for t in terms], [t["latex"] for t in terms], focus, equation_turn)
        self.until(self.T1 - 1.0)
        if live:
            self.play(*[m.FadeOut(b) for b in live], eq.animate.set_color(INK), run_time=0.5)

    def _figure_callouts(self, items, col_w, room_h, buff=0.22):
        """Gold-bar callout column for figure cards; stays at 34 px until height forces shrink."""
        call = m.VGroup()
        text_w = col_w - 0.35
        for it in items:
            bar = m.Rectangle(width=0.08, height=0.5, fill_color=GOLD, fill_opacity=1, stroke_width=0)
            body = m.VGroup(
                para(it.get("title", ""), text_w, 34, GOLD, "BOLD", max_lines=2),
                para(it.get("detail", ""), text_w, 34, INK, max_lines=3),
            ).arrange(m.DOWN, buff=0.08, aligned_edge=m.LEFT)
            bar.stretch_to_fit_height(body.height)
            call.add(m.VGroup(bar, body).arrange(m.RIGHT, buff=0.18, aligned_edge=m.UP))
        call.arrange(m.DOWN, buff=buff, aligned_edge=m.LEFT)
        if call.height > room_h and buff > 0.12:
            return self._figure_callouts(items, col_w, room_h, buff=buff - 0.04)
        if call.height > room_h:
            call.scale_to_fit_height(room_h)
        return call

    def _figure_caption(self, s, width, size=32):
        """Two-line figure caption; shrinks below the global 28px para floor when needed."""
        s = " ".join(str(s).split())
        if not s:
            return m.VGroup()
        for try_sz in range(size, 17, -1):
            lines, cur = [], ""
            for word in s.split(" "):
                trial = f"{cur} {word}".strip()
                if cur and text(trial, try_sz).width > width:
                    lines.append(cur)
                    cur = word
                else:
                    cur = trial
            if cur:
                lines.append(cur)
            if len(lines) <= 2:
                group = m.VGroup(*[text(line, try_sz, DIM) for line in lines[:2]])
                group.arrange(m.DOWN, buff=0.13 * try_sz / 36, aligned_edge=m.LEFT)
                if group.width > width:
                    group.scale_to_fit_width(width)
                return group
        lines = lines[:2]
        group = m.VGroup(*[text(line, 18, DIM) for line in lines])
        group.arrange(m.DOWN, buff=0.08, aligned_edge=m.LEFT)
        if group.width > width:
            group.scale_to_fit_width(width)
        return group

    def _figure_fit_image(self, img, slot_w, slot_h, min_w, min_h):
        """Scale to target chart width, then uniform clamp to the image-height slot."""
        if img.width <= 0 or img.height <= 0:
            return img
        tgt_w = min(slot_w, min_w) if min_w > 0 else slot_w
        img.scale(tgt_w / img.width)
        if slot_h > 0 and img.height > slot_h:
            img.scale(slot_h / img.height)
        if img.width > slot_w:
            img.scale_to_fit_width(slot_w)
        return img

    def kind_figure(self):
        d = self.data
        items = d.get("items") or []
        room_top = self.body_top
        floor = self.bottom()
        body_h = max(0.5, room_top - floor)
        body_w = XR - XL
        frame_w = m.config.frame_width
        min_img_w = max(8.5, 0.60 * frame_w)
        gutter = 0.38
        cap_buff = 0.08

        img = m.ImageMobject(str(YT / d["image"]))
        call = m.VGroup()
        if items:
            for try_w in (3.75, 3.45, 3.15, 2.85):
                call = self._figure_callouts(items, try_w, body_h - 0.1)
                slot_w = body_w - call.width - gutter
                if slot_w >= min_img_w * 0.92:
                    break
            slot_w = max(0.5, body_w - call.width - gutter)
        else:
            slot_w = body_w

        y_top = self.rule.get_bottom()[1]
        cap_anchor = self.foot_top + 0.03
        cap = self._figure_caption(d.get("caption", ""), slot_w) if d.get("caption") else m.VGroup()
        if len(cap):
            cap.move_to([XL, cap_anchor, 0], aligned_edge=m.DL)
            img_h_max = max(0.5, y_top - cap.get_top()[1] - cap_buff)
        else:
            img_h_max = max(0.5, y_top - floor)
        slot_h = img_h_max
        self._figure_fit_image(img, slot_w, slot_h, min(min_img_w, slot_w), 0.0)
        if len(cap):
            cap = self._figure_caption(d.get("caption", ""), img.width)
            cap.move_to([XL, cap_anchor, 0], aligned_edge=m.DL)
            img.next_to(cap, m.UP, buff=cap_buff, aligned_edge=m.LEFT)
            if img.get_top()[1] > y_top + 0.01:
                avail = max(0.1, y_top - cap.get_top()[1] - cap_buff)
                s = min(1.0, avail / img.height)
                img.scale(s, about_point=[img.get_center()[0], cap.get_top()[1] + cap_buff, 0])
                cap = self._figure_caption(d.get("caption", ""), img.width)
                cap.move_to([XL, cap_anchor, 0], aligned_edge=m.DL)
                img.next_to(cap, m.UP, buff=cap_buff, aligned_edge=m.LEFT)
        else:
            img.move_to([XL + (slot_w if items else body_w) / 2, floor + img_h_max / 2, 0])
            img.align_to([XL, 0, 0], m.LEFT)
            if img.get_top()[1] > y_top + 0.02:
                img.scale_to_fit_height(y_top - floor)
                img.move_to([XL + img.width / 2, floor + (y_top - floor) / 2, 0])
                img.align_to([XL, 0, 0], m.LEFT)

        frame = m.SurroundingRectangle(img, color=NAVY2, buff=0.0, stroke_width=3)
        self.play(m.FadeIn(img), m.FadeIn(frame), m.FadeIn(cap), run_time=0.8)
        if not items:
            return

        cy = (room_top + self.bottom()) / 2
        half = min(call.height / 2, (room_top - floor) / 2 - 0.05)
        call.move_to([img.get_right()[0] + gutter + call.width / 2, cy, 0])
        call.align_to([img.get_right()[0] + gutter, 0, 0], m.LEFT)
        if call.get_top()[1] > room_top - 0.05:
            call.shift(m.DOWN * (call.get_top()[1] - room_top + 0.05))
        if call.get_bottom()[1] < floor + 0.05:
            call.shift(m.UP * (floor + 0.05 - call.get_bottom()[1]))
        if call.get_right()[0] > XR - 0.05:
            call.shift(m.LEFT * (call.get_right()[0] - XR + 0.05))

        def focus(i):
            return [c[1][0].animate.set_color(GOLD if j == i else INK) for j, c in enumerate(call[: i + 1])] + \
                   [c[0].animate.set_opacity(1 if j == i else 0.35) for j, c in enumerate(call[: i + 1])]
        self.reveal(list(call), [it.get("title", "") for it in items], [it.get("detail") for it in items], focus)
