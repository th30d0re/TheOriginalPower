"""Verify that every YT02v2 scene cue word occurs in its selected turn."""
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[5]
SPEC = Path(__file__).with_name("scene_cues_yt02v2.json")


def norm(value):
    return re.sub(r"[^a-z0-9]", "", value.lower())


spec = json.loads(SPEC.read_text())
words = json.loads((ROOT / spec["words"]).read_text())
checked = 0
for scene in spec["scenes"]:
    for beat in scene["beats"]:
        for cue in (beat, beat.get("until")):
            if not cue or "word" not in cue:
                continue
            global_turn = scene["turns"][cue["turn"]]
            available = [word["w"] for word in words[global_turn]["words"]]
            hits = [word for word in available if norm(word).startswith(norm(cue["word"]))]
            nth = cue.get("nth", 0)
            assert len(hits) > nth, (
                scene["frame"], beat["node"], global_turn, cue["word"], available
            )
            checked += 1
print(f"PASS: {checked} word cues across {len(spec['scenes'])} scenes")
