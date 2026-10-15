"""Write outputs/YT01/words.json, the per-turn word timings common16x9 reads.

The UEF reels' words.json held Whisper word times per turn, seconds from the turn's
start. ScriptCast's read-along job (`scriptcast-word-timings <episode> --script <md>`,
mlx whisper-small) already writes the same data to word_timings.json, keyed by turn id
in milliseconds; this converts it. Rerun both after a turn is re-rendered:

    .venv-voice/bin/scriptcast-word-timings outputs/YT01 --script Architecting_the_operation/podcasts/YT01_what_racism_really_is.md
    python3 Architecting_the_operation/video/yt01_redefining_racism/make_words.py
"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EP = ROOT / "outputs" / (sys.argv[1] if len(sys.argv) > 1 else "YT01")
manifest_path = EP / "episode_manifest.json"
manifest = json.loads(manifest_path.read_text())["turns"]
timings = json.loads((EP / "word_timings.json").read_text())
if timings.get("manifest_sha256") != hashlib.sha256(manifest_path.read_bytes()).hexdigest():
    print("warning: word_timings.json was made from a different manifest; rerun scriptcast-word-timings", file=sys.stderr)
out, missing = [], []
for turn in manifest:
    words = timings["turns"].get(turn["turn_id"])
    if not words:
        missing.append(turn["turn_index"])
        words = []
    out.append({"turn": turn["turn_index"], "turn_id": turn["turn_id"],
                "text": " ".join(w["text"] for w in words),
                "words": [{"w": w["text"], "t": round(w["start_ms"] / 1000, 3)} for w in words]})
(EP / "words.json").write_text(json.dumps(out, indent=1))
print(f"wrote {len(out)} turns to {EP / 'words.json'}" + (f"; no words for turns {missing}" if missing else ""))
sys.exit(1 if missing else 0)
