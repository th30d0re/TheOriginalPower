"""Build the complete YT02v2 card list with per-turn beats and run durations.

    YT_EP=YT02v2 .venv-manimgx/bin/python \
      Architecting_the_operation/video/yt02/figma/card_beats_v2.py

Each Figma-card run receives its own frame while retaining the card stem as its
asset key. Beat times are relative to the run start and include the standard
0.25-second reveal offset.
"""
import json
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
MANIM = ROOT / "Architecting_the_operation/video/yt01_redefining_racism/manim"
sys.path.insert(0, str(MANIM))
os.environ.setdefault("YT_EP", "YT02v2")

from common16x9 import load_shots, runs_of  # noqa: E402


SHOTLIST = ROOT / "Architecting_the_operation/video/YT02v2_shotlist.md"
MANIFEST = ROOT / "outputs/YT02v2/episode_manifest.json"
CARDS = ROOT / "Architecting_the_operation/video/yt02/cards"
OUT = Path(__file__).resolve().parent / "v2/cards_v2.json"


def card_json_path(scene: str) -> Path:
    """Resolve figma-card scene paths (e.g. cards/v2/v2-S03-10.json) under yt02/cards/."""
    rel = scene.removeprefix("cards/")
    return CARDS / rel


def build_cards():
    shots = load_shots(SHOTLIST)
    turns = json.loads(MANIFEST.read_text())["turns"]
    cards = []
    for primary, run in runs_of(shots).items():
        first = run[0]
        if first.file != "figma-card":
            continue
        stem = Path(first.scene).stem
        card = json.loads(card_json_path(first.scene).read_text())
        t0 = turns[first.index]["start_ms"] / 1000
        after = run[-1].index + 1
        t1 = (turns[after]["start_ms"] if after < len(turns) else turns[-1]["end_ms"]) / 1000
        card["id"] = stem
        card["frame"] = f"card v2 {primary}"
        card["primary"] = primary
        card["beats"] = [
            round(turns[shot.index]["start_ms"] / 1000 - t0 + 0.25, 2)
            for shot in run
        ]
        if "revealTurns" in card:  # long runs: reveal item i on the turn its topic is spoken
            card["beats"] = [card["beats"][k] for k in card.pop("revealTurns")]
        card["duration"] = round(t1 - t0, 2)
        if "maxDuration" in card:  # Figma exports stop at 5 min; the editor holds the last frame for the rest
            cap = card.pop("maxDuration")
            card["duration"] = min(card["duration"], cap)
            card["beats"] = [b for b in card["beats"] if b < cap - 0.25]
        cards.append(card)
    assert len(cards) == 119, len(cards)
    return cards


if __name__ == "__main__":
    cards = build_cards()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n")
    print(f"{OUT}: {len(cards)} card runs")
