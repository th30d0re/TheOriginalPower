"""Shared helpers for the UEF equation reels (vertical, voiced, manimgx).

Timing: each reel reads its voiceover manifest (turn start times) and words.json
(Whisper large-v3 word timings per turn), so cues follow the spoken words:

    self.until(self.cue(3, "cross"))   # absolute time of the word "cross" in turn 3
"""

import json
import re
import sys
from pathlib import Path

import manimgx as m

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "reel_reciprocity"))
from scene import BG, DIM, GOLD, HER, HIM, INK, OK, ROOT, T, qr  # noqa: E402,F401

STAT = "#B28DFF"
BOOK = "https://github.com/th30d0re/TheOriginalPower/releases"


def M(tex, size=72, color=INK):
    return m.MathTex(tex, font_size=size, color=color)


def _norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


class UEFReel(m.Scene):
    EP = ""          # outputs/<EP>
    SOURCE = ""      # end-card source line

    def setup_timing(self):
        ep = ROOT / "outputs" / self.EP
        turns = json.loads((ep / "episode_manifest.json").read_text())["turns"]
        self.BEATS = [t["start_ms"] / 1000 for t in turns]
        self.END = turns[-1]["end_ms"] / 1000
        self.WORDS = json.loads((ep / "words.json").read_text())
        self.AUDIO = ep / f"{self.EP}.mp3"

    def cue(self, turn, word, nth=0, lead=0.1):
        """Absolute time of the nth occurrence of `word` (prefix match) in `turn`."""
        target = _norm(word)
        hits = [w["t"] for w in self.WORDS[turn]["words"] if _norm(w["w"]).startswith(target)]
        if len(hits) <= nth:
            raise KeyError(f"{self.EP}: '{word}' #{nth} not in turn {turn}: {self.WORDS[turn]['text']}")
        return self.BEATS[turn] + max(0.0, hits[nth] - lead)

    def until(self, t):
        if t > self.time:
            self.wait(t - self.time)

    def clear_all(self, rt=0.4):
        if self.mobjects:
            self.play(*[m.FadeOut(x) for x in self.mobjects], run_time=rt)

    def begin(self):
        self.setup_timing()
        self.camera.background_color = BG
        if self.AUDIO.exists():
            self.add_sound(str(self.AUDIO))

    def end_card(self):
        self.until(self.END)
        self.clear_all()
        card = m.VGroup(qr(BOOK, side=3.0), T("THE BOOK", 36, GOLD)).arrange(m.DOWN, buff=0.3).shift(m.UP * 0.6)
        src = T(self.SOURCE, 30, DIM, "NORMAL").next_to(card, m.DOWN, buff=0.6)
        foot = T("Voice is AI-generated (a clone of mine)", 28, DIM, "NORMAL").to_edge(m.DOWN, buff=0.8)
        self.play(m.FadeIn(card), m.FadeIn(src), m.FadeIn(foot), run_time=0.5)
        self.wait(2.5)
