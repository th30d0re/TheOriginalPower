"""Incremental word timings for outputs/YT02v2_ov.

scriptcast-word-timings writes its JSON only after every turn. This driver saves
a partial file after each chunk so a stopped run can be resumed.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EP = ROOT / "outputs" / "YT02v2_ov"
SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md"
PARTIAL = EP / "word_timings.partial.json"
FINAL = EP / "word_timings.json"
MODEL = "mlx-community/whisper-small-mlx"
CHUNK = 15


def atomic_write(path: Path, data: dict) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    os.replace(temporary, path)


def main() -> int:
    from scriptcast.parser import parse_transcript
    from scriptcast.project import current
    from scriptcast.tools.captions import transcribe
    from scriptcast.tools.word_timings import build_timings, transcribe_with_prompt

    original = (EP / "episode_manifest.json").read_bytes()
    manifest = json.loads(original)
    digest = hashlib.sha256(original).hexdigest()
    partial = {"manifest_sha256": digest, "model": MODEL, "turns": {}}
    if PARTIAL.exists():
        previous = json.loads(PARTIAL.read_text())
        if previous.get("manifest_sha256") == digest and previous.get("model") == MODEL:
            partial["turns"] = previous.get("turns", {})
        else:
            print("partial file is for a different manifest; starting over", flush=True)
    done = set(partial["turns"])
    pending = [turn["turn_index"] for turn in manifest["turns"] if turn["turn_id"] not in done]
    print(f"pending {len(pending)} of {len(manifest['turns'])}", flush=True)
    hints = ""
    try:
        from scriptcast.review import project_dir_from_voices, vocabulary_hints
        hints = vocabulary_hints(project_dir_from_voices(current(EP).voices))
    except Exception as exc:  # hints are optional
        print(f"vocabulary hints unavailable ({exc})", flush=True)
    print(f"hint chars {len(hints)}", flush=True)

    def transcribe_fn(audio, model):
        if hints:
            return transcribe_with_prompt(audio, model, initial_prompt=hints)
        return transcribe(audio, model)

    script_turns = parse_transcript(SCRIPT)
    for start in range(0, len(pending), CHUNK):
        chunk = set(pending[start:start + CHUNK])
        data = build_timings(EP, manifest, script_turns, MODEL, chunk, transcribe_fn=transcribe_fn)
        partial["turns"].update(data)
        atomic_write(PARTIAL, partial)
        print(f"saved {len(partial['turns'])}", flush=True)
    if (EP / "episode_manifest.json").read_bytes() != original:
        print("manifest changed during transcription", file=sys.stderr)
        return 1
    atomic_write(FINAL, partial)
    print(f"Wrote {len(partial['turns'])} turns to {FINAL}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
