"""Landscape scenes with UEF-compatible cues and segment-local script timing.

Turn indices are zero-based. ``cue(seg="03", turn=2, word="partition")``
resolves the third turn after the SEG 03 marker. ``cue(2, "partition")``
retains the global-turn API. Preview turns last six seconds.

Runs (the render unit). Every shot in the selected episode's shot list is one script turn, in
order. A *run* is a primary shot plus every hold that points at it (``Holds:``),
including holds that return after other shots. One render covers one run, from the
primary's turn start to the start of the turn after its last hold; the editor
(``edit16x9.py``) cuts each shot's window out of it. A scene picks its run from the
episode-specific shot environment variable (a primary shot id), else the first run in the
shot list for this file and class, and calls ``shot_<id>`` (``shot_S03_08``), or
``build()`` when no such method exists. Inside a run:

    self.beat(k)            # absolute start of the run's k-th shot (0 = primary)
    self.at(k, "word")      # absolute time of a word in the run's k-th shot's turn
    self.until(t)           # wait until absolute time t (render time is t - T0)
    self.say(k)             # the k-th shot's spoken text, for reading cues

Times stay absolute (episode seconds), so cues read the live manifest at render time.
"""

import json
import logging
import math
import os
import re
from dataclasses import dataclass
from pathlib import Path

import manimgx as m

ROOT = Path(__file__).resolve().parents[4]
VIDEO_ROOT = ROOT / "Architecting_the_operation/video"
EP_NAME = os.environ.get("YT_EP", "YT01").upper()
_EPISODES = {
    # name: (script, shot list, asset folder)
    "YT01": ("YT01_what_racism_really_is.md", "YT01_shotlist.md", "yt01_redefining_racism"),
    "YT02": ("YT02_what_racism_is.md", "YT02_shotlist.md", "yt02"),
    "YT02V2": ("YT02_v2_what_racism_is.md", "YT02v2_shotlist.md", "yt02"),
}
if EP_NAME not in _EPISODES:
    raise ValueError(f"YT_EP must be one of {sorted(_EPISODES)}, got {EP_NAME!r}")
_script, _shotlist, _assets = _EPISODES[EP_NAME]
SCRIPT = ROOT / "Architecting_the_operation/podcasts" / _script
SHOTLIST = VIDEO_ROOT / _shotlist
HERE = Path(__file__).resolve().parent
YT = VIDEO_ROOT / _assets
# Palette of the ScriptCast cards (video/src/theme.ts): navy ground, cream type, gold accent.
INK, DIM, GOLD = "#F4EAD2", "#9FB0CF", "#D9A441"
HIM, HER, OK, BG = "#5FA8D3", "#E2573F", "#5FC27E", "#0F1B33"
NAVY2, TEAL = "#16264A", "#6EC3C0"
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


@dataclass
class Shot:
    id: str
    seg: str
    index: int  # global turn index (shot order)
    type: str
    file: str
    scene: str
    card: str | None
    holds: str | None
    title: str
    note: str
    method: str | None = None  # Render token `as=<id>`: play that shot's method (a reused scene)

    @property
    def primary(self):
        return self.holds or self.id


def load_shots(path=SHOTLIST):
    """Every shot in the shot list, in turn order."""
    text = Path(path).read_text()
    shots = []
    for b in re.finditer(r"(?ms)^## (S(\d\d)-\d\d[a-z]?)(?: — (.*?))?\n(.*?)(?=^## |\Z)", text):
        sid, seg, title, body = b.groups()

        def field(name):
            hit = re.search(rf"\*\*{name}:\*\* (.*)", body)
            return hit.group(1).strip() if hit else ""

        render = field("Render").strip("`")
        card = None
        if render.startswith("manim:"):
            parts = render.removeprefix("manim:").split()
            file, _, scene = parts[0].partition(":") if parts else ("", "", "")
            method = next((t[3:] for t in parts[1:] if t.startswith("as=")), None)
            rest = [t for t in parts[1:] if not t.startswith("as=")]
            card = rest[0] if rest else None
        else:
            method = None
            file, _, scene = render.partition(":")
        shots.append(Shot(sid, seg, len(shots), field("Type"), file, scene,
                          card, field("Holds").strip("`") or None,
                          (title or "").strip(), field("Note"), method))
    return shots


def runs_of(shots, file=None, scene=None):
    """{primary id: [shots]} in shot-list order, optionally for one file and class."""
    out = {}
    for shot in shots:
        if (file is None or shot.file == file) and (scene is None or shot.scene == scene):
            out.setdefault(shot.primary, []).append(shot)
    return out


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
        elif re.match(r"^(?:Emmanuel Theodore|Lee Atwater)\s+\(\d+:\d{2}(?::\d{2})?\)\s*$", line):
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
                raise ValueError(f"{ep}: words.json and manifest turn counts differ; rerun make_words.py")
            stale = [i for i, (w, t) in enumerate(zip(self.words, turns))
                     if w.get("turn_id") and t.get("turn_id") and w["turn_id"] != t["turn_id"]]
            if stale:
                raise ValueError(f"{ep}: words.json is stale for turns {stale[:8]}; rerun make_words.py")
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
            if index in self.synthetic_words or os.environ.get("YT_LENIENT_CUES"):
                LOG.warning("%s: preview cue %r #%d missing in turn %d; using turn midpoint", self.ep, word, nth, index)
                return self.beats[index] + max(0, (self.ends[index] - self.beats[index]) / 2 - lead)
            raise KeyError(f"{self.ep}: {word!r} #{nth} absent from turn {index}")
        return self.beats[index] + max(0, hits[nth] - lead)


class _YTMethods:
    EP = EP_NAME
    SOURCE = ""
    SCRIPT = SCRIPT
    PLACEHOLDER_TURNS = ()
    SEGMENT = "03"
    FORCE_PLACEHOLDER = False
    AUDIO_ENABLED = True
    END_CARD = False

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
        """Wait until absolute episode time `time` (seconds)."""
        target = time - self.T0
        if target > self.time + 1e-9:
            self.wait(target - self.time)

    # ── runs ──────────────────────────────────────────────────────────────
    T0 = 0.0
    SHOT = None  # default primary shot id when the episode shot variable is unset

    def setup_run(self):
        """Resolve this render's run and its window [T0, T1] on the frame grid."""
        fps = float(m.config.frame_rate)
        self.fps = fps
        try:
            shots = load_shots()
        except FileNotFoundError:
            shots = []
        scene_path = Path(__import__("inspect").getfile(type(self))).resolve()
        try:
            relative = scene_path.relative_to(VIDEO_ROOT)
            scene_file = relative.name if self.EP == "YT01" and relative.parent == Path("yt01_redefining_racism/manim") else relative.as_posix()
        except ValueError:
            scene_file = scene_path.name
        mine = runs_of(shots, scene_file, type(self).__name__)
        want = os.environ.get(f"{self.EP}_SHOT") or os.environ.get("YT_SHOT") or self.SHOT
        if want and want not in mine:
            hit = next((s for s in shots if s.id == want), None)
            if hit is None or hit.primary not in mine:
                raise KeyError(f"{type(self).__name__}: no run {want!r} in the shot list for this scene")
            want = hit.primary
        self.primary = want or next(iter(mine), None)
        self.run = mine.get(self.primary, [])
        self.all_shots = shots
        if not self.run or self.timing.placeholder or len(shots) != len(self.BEATS):
            self.T0, self.T1, self.run_turns = 0.0, self.END, list(range(len(self.BEATS)))
            return
        frame = lambda t: math.floor(t * fps + 0.5)  # noqa: E731
        first, last = self.run[0].index, self.run[-1].index
        self.T0 = frame(self.BEATS[first]) / fps
        stop = self.BEATS[last + 1] if last + 1 < len(self.BEATS) else self.END + 1.0
        self.T1 = frame(stop) / fps
        self.run_turns = [s.index for s in self.run]

    def beat(self, k=0):
        return self.BEATS[self.run_turns[k]]

    def beat_end(self, k=0):
        i = self.run_turns[k]
        return self.BEATS[i + 1] if i + 1 < len(self.BEATS) else self.END

    def at(self, k, word, nth=0, lead=0.1):
        return self.timing.cue(self.run_turns[k], word, nth=nth, lead=lead)

    def say(self, k=0):
        return self.WORDS[self.run_turns[k]]["text"]

    def card(self, k=0):
        """The card JSON named by the run's k-th shot (the primary's by default)."""
        name = self.run[k].card if self.run else None
        return json.loads((YT / name).read_text()) if name else None

    def construct(self):
        self.begin()
        alias = next((s.method for s in self.run if s.id == self.primary and s.method), None)
        name = "shot_" + (alias or self.primary or "").replace("-", "_")
        getattr(self, name, self.build)()
        self.finish()

    def build(self):
        raise NotImplementedError(f"{type(self).__name__} has no shot_{self.primary} or build()")

    def finish(self):
        self.until(self.T1)

    def clear_all(self, rt=0.4):
        if self.mobjects:
            self.play(*[m.FadeOut(mob) for mob in self.mobjects], run_time=rt)

    def begin(self):
        self.setup_timing()
        self.setup_run()
        self.camera.background_color = BG
        # Run renders are silent; edit16x9.py lays the voiceover under the cut.
        if self.AUDIO_ENABLED and os.environ.get(f"{self.EP}_AUDIO") and not self.timing.placeholder and self.AUDIO.exists():
            from manimgx.audio.sound import Sound
            self.add_sound(Sound(str(self.AUDIO)).trim(self.T0, self.T1))

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
