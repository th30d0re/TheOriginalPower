"""Write outputs/<YT_EP>/words.json, the per-turn word timings common16x9 reads.

The UEF reels' words.json held Whisper word times per turn, seconds from the turn's
start. ScriptCast's read-along job (`scriptcast-word-timings <episode> --script <md>`,
mlx whisper-small) already writes the same data to word_timings.json, keyed by turn id
in milliseconds; this converts it. Rerun both after a turn is re-rendered:

    .venv-voice/bin/scriptcast-word-timings outputs/YT01 --script Architecting_the_operation/podcasts/YT01_what_racism_really_is.md
    python3 Architecting_the_operation/video/yt01_redefining_racism/make_words.py
"""
import hashlib
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EP_NAME = os.environ.get("YT_EP", sys.argv[1] if len(sys.argv) > 1 else "YT01").upper()
_SCRIPTS = {
    "YT01": "YT01_what_racism_really_is.md",
    "YT02": "YT02_what_racism_is.md",
    "YT02V2": "YT02_v2_what_racism_is.md",
}
if EP_NAME not in _SCRIPTS:
    sys.exit(f"YT_EP must be one of {sorted(_SCRIPTS)}, got {EP_NAME!r}")
EP = ROOT / "outputs" / EP_NAME
SCRIPT = ROOT / "Architecting_the_operation/podcasts" / _SCRIPTS[EP_NAME]
manifest_path = EP / "episode_manifest.json"
manifest = json.loads(manifest_path.read_text())["turns"]
timings = json.loads((EP / "word_timings.json").read_text())
if timings.get("manifest_sha256") != hashlib.sha256(manifest_path.read_bytes()).hexdigest():
    print("warning: word_timings.json was made from a different manifest; rerun scriptcast-word-timings", file=sys.stderr)
# Script text per turn, in manifest order, for turns Whisper cannot read (archival tape).
import re
_script = SCRIPT.read_text()
_texts = [re.sub(r"\[clip:[^\]]*\]\s*", "", b).strip() for b in
          re.findall(r"(?ms)^(?:Emmanuel Theodore|Lee Atwater) \(\d+:\d{2}\)\n(.*?)(?=^\S[^\n]* \(\d+:\d{2}\)\n|^<!--|\Z)", _script)]


def estimated(turn):
    """Spread the turn's script words over its duration by character position."""
    text = _texts[turn["turn_index"]] if turn["turn_index"] < len(_texts) else ""
    dur = turn["end_ms"] - turn["start_ms"]
    total = max(1, len(text))
    words, pos = [], 0
    for w in text.split():
        pos = text.index(w, pos)
        words.append({"text": w, "start_ms": int(dur * pos / total)})
        pos += len(w)
    return words


out, missing, estimated_turns = [], [], []
for turn in manifest:
    words = timings["turns"].get(turn["turn_id"])
    if not words:
        words = estimated(turn)
        (estimated_turns if words else missing).append(turn["turn_index"])
    out.append({"turn": turn["turn_index"], "turn_id": turn["turn_id"],
                "text": " ".join(w["text"] for w in words),
                "words": [{"w": w["text"], "t": round(w["start_ms"] / 1000, 3)} for w in words]})
(EP / "words.json").write_text(json.dumps(out, indent=1))
print(f"wrote {len(out)} turns to {EP / 'words.json'}" + (f"; estimated from the script for turns {estimated_turns}" if estimated_turns else "") + (f"; no words for turns {missing}" if missing else ""))
sys.exit(1 if missing else 0)
