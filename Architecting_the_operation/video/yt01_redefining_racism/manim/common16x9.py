"""Landscape scenes with UEF-compatible cues and segment-local script timing.

Turn indices are zero-based. ``cue(seg="03", turn=2, word="partition")``
resolves the third turn after the SEG 03 marker. ``cue(2, "partition")``
retains the global-turn API. Preview turns last six seconds.
"""

import json
import logging
import re
from pathlib import Path

import manimgx as m

ROOT = Path(__file__).resolve().parents[4]
SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT01_what_racism_really_is.md"
INK, DIM, GOLD = "#F2EEE6", "#8A867F", "#E9C46A"
HIM, HER, OK, BG = "#5FA8D3", "#E07A5F", "#81B29A", "#121212"
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"
LOG = logging.getLogger(__name__)
m.config.pixel_width, m.config.pixel_height = 1920, 1080
m.config.frame_height = 8.0


def T(text, size=40, color=INK, weight="BOLD", width=12.8):
    mob = m.Text(text, font="Noto Sans", font_size=max(size, 28), color=color, weight=weight)
    if mob.width > width:
        mob.scale_to_fit_width(width)
    return mob


def M(tex, size=72, color=INK):
    return m.MathTex(tex, font_size=size, color=color)


def qr(url, side=1.5):
    """UEF QR geometry, including its white plate and quiet zone."""
    import segno
    rows = [list(row) for row in segno.make(url, error="m").matrix]
    unit = side / (len(rows) + 4)
    code = m.VGroup()
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            if row[x]:
                stop = x
                while stop < len(row) and row[stop]:
                    stop += 1
                code.add(m.Rectangle(width=unit * (stop - x), height=unit,
                                     fill_color="#000000", fill_opacity=1, stroke_width=0)
                         .move_to([(x + 2 + (stop - x) / 2) * unit, -(y + 2.5) * unit, 0]))
                x = stop
            else:
                x += 1
    plate = m.Rectangle(width=side, height=side, fill_color="#FFFFFF", fill_opacity=1, stroke_width=0)
    plate.move_to([side / 2, -side / 2, 0])
    return m.VGroup(plate, code)


def _norm(word):
    return re.sub(r"[^a-z0-9]", "", word.lower())


def script_turns(path):
    """Return narration text and SEG-to-global-turn indices in source order."""
    if not path.exists():
        return [], {}
    turns, segments = [], {}
    segment, body = None, None

    def finish():
        if body is not None:
            index = len(turns)
            turns.append(" ".join(body).strip())
            if segment is not None:
                segments.setdefault(segment, []).append(index)

    # Retain marker boundaries while discarding all other HTML comments.
    text = re.sub(r"<!--(?!\s*SEG\s+\d+\b).*?-->", "", path.read_text(), flags=re.S)
    for line in text.splitlines():
        marker = re.match(r"\s*<!--\s*SEG\s+(\d+)\b", line)
        if marker:
            finish()
            body = None
            segment = marker.group(1).zfill(2)
            segments.setdefault(segment, [])
        elif re.match(r"^Emmanuel Theodore\s+\(\d+:\d{2}(?::\d{2})?\)\s*$", line):
            finish()
            body = []
        elif body is not None and line.strip():
            body.append(line.strip())
    finish()
    return turns, segments


class Timing:
    """Load manifests or construct deterministic, evenly spaced preview words."""

    def __init__(self, ep, script=SCRIPT, root=ROOT, placeholder_turns=(), segment="03", force_placeholder=False):
        self.ep = ep
        texts, self.segments = script_turns(Path(script))
        directory = Path(root) / "outputs" / ep
        manifest = directory / "episode_manifest.json"
        self.placeholder = force_placeholder or not manifest.exists() or not texts
        self.audio = directory / f"{ep}.mp3"
        self.synthetic_words = set()
        if self.placeholder:
            LOG.warning("%s: placeholder timing enabled; each turn lasts 6 s, words are evenly spaced", ep)
            if not texts:
                texts = list(placeholder_turns) or ["Preview turn"] * 10
                self.segments = {str(segment).zfill(2): list(range(len(texts)))}
            turns = [{"start_ms": i * 6000, "end_ms": (i + 1) * 6000, "text": text} for i, text in enumerate(texts)]
        else:
            turns = json.loads(manifest.read_text())["turns"]
            if not turns:
                raise ValueError(f"{ep}: manifest contains no turns")
            if texts and len(texts) != len(turns):
                raise ValueError(f"{ep}: script has {len(texts)} turns; manifest has {len(turns)}")
        self.beats = [turn["start_ms"] / 1000 for turn in turns]
        self.ends = [turn["end_ms"] / 1000 for turn in turns]
        self.end = self.ends[-1]
        word_file = directory / "words.json"
        if word_file.exists() and not self.placeholder:
            self.words = json.loads(word_file.read_text())
            if len(self.words) != len(turns):
                raise ValueError(f"{ep}: words.json and manifest turn counts differ")
        else:
            if not self.placeholder:
                LOG.warning("%s: words.json missing; evenly spacing words within manifest turns", ep)
            self.words = []
            for i, turn in enumerate(turns):
                text = texts[i] if i < len(texts) else turn.get("text", "Preview turn")
                tokens = text.split()
                span = self.ends[i] - self.beats[i]
                self.words.append({"text": text, "words": [{"w": word, "t": j * span / max(1, len(tokens))} for j, word in enumerate(tokens)]})
                self.synthetic_words.add(i)

    def index(self, turn, seg=None):
        if turn < 0:
            raise IndexError("Turn indices are zero-based and nonnegative")
        if seg is None:
            index = turn
        else:
            key = str(seg).zfill(2)
            if key not in self.segments:
                raise KeyError(f"{self.ep}: segment {key} is absent from the script")
            index = self.segments[key][turn]
        if index >= len(self.beats):
            raise IndexError(f"{self.ep}: turn {index} exceeds the available timing")
        return index

    def cue(self, turn, word, nth=0, lead=0.1, seg=None):
        if nth < 0 or not _norm(word):
            raise ValueError("Cue requires a word and a nonnegative occurrence")
        index = self.index(turn, seg)
        hits = [w["t"] for w in self.words[index]["words"] if _norm(w["w"]).startswith(_norm(word))]
        if len(hits) <= nth:
            if index in self.synthetic_words:
                LOG.warning("%s: preview cue %r #%d missing in turn %d; using turn midpoint", self.ep, word, nth, index)
                return self.beats[index] + max(0, (self.ends[index] - self.beats[index]) / 2 - lead)
            raise KeyError(f"{self.ep}: {word!r} #{nth} absent from turn {index}")
        return self.beats[index] + max(0, hits[nth] - lead)


class _YTMethods:
    EP = "YT01_what_racism_really_is"
    SOURCE = ""
    SCRIPT = SCRIPT
    PLACEHOLDER_TURNS = ()
    SEGMENT = "03"
    FORCE_PLACEHOLDER = False
    AUDIO_ENABLED = True

    def setup_timing(self):
        self.timing = Timing(self.EP, script=self.SCRIPT, placeholder_turns=self.PLACEHOLDER_TURNS,
                             segment=self.SEGMENT, force_placeholder=self.FORCE_PLACEHOLDER)
        self.BEATS, self.END, self.WORDS = self.timing.beats, self.timing.end, self.timing.words
        self.AUDIO = self.timing.audio

    def cue(self, turn, word, nth=0, lead=0.1, *, seg=None):
        return self.timing.cue(turn, word, nth=nth, lead=lead, seg=seg)

    def segment_beats(self, seg):
        return [self.BEATS[index] for index in self.timing.segments[str(seg).zfill(2)]]

    def until(self, time):
        if time > self.time:
            self.wait(time - self.time)

    def clear_all(self, rt=0.4):
        if self.mobjects:
            self.play(*[m.FadeOut(mob) for mob in self.mobjects], run_time=rt)

    def begin(self):
        self.setup_timing()
        self.camera.background_color = BG
        if self.AUDIO_ENABLED and not self.timing.placeholder and self.AUDIO.exists():
            self.add_sound(str(self.AUDIO))

    def flat(self, *mobs):
        self.add(*mobs)
        return mobs[0] if len(mobs) == 1 else mobs

    def end_card(self):
        self.until(self.END)
        self.clear_all()
        card = m.VGroup(qr(BOOK, side=2.1), T("THE BOOK", 36, GOLD)).arrange(m.DOWN, buff=0.25).shift(m.UP * 0.4)
        source = T(self.SOURCE, 28, DIM, "NORMAL").next_to(card, m.DOWN, buff=0.35)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.5)
        self.flat(card, source, foot)
        for mob in (card, source, foot):
            mob.set_opacity(0)
        self.play(*[mob.animate.set_opacity(1) for mob in (card, source, foot)], run_time=0.5)
        self.wait(2.5)


class YTScene(_YTMethods, m.Scene):
    """1920×1080 scene with segment-local word cues and a book QR end card."""


class YTScene3D(_YTMethods, m.ThreeDScene):
    """The same timing API with frame-fixed overlays for a 3-D camera."""

    def flat(self, *mobs):
        self.add_fixed_in_frame_mobjects(*mobs)
        return mobs[0] if len(mobs) == 1 else mobs
