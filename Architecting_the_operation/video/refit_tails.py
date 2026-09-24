"""Recompute every segment's speech_duration_ms from the wav files on disk.

scriptCast's default trim (150 ms tail, 0.04 RMS threshold) clips word endings on
the emmanuel_theodore voice: the audio is in the wav, but stitch cuts at
speech_duration_ms. Every `scriptcast` invocation (including --precision-insert)
resets the manifest to the tight default, so run this after each one, then
relayout and stitch. No synthesis happens here.

    .venv-voice/bin/python Architecting_the_operation/video/refit_tails.py outputs/chapter135_reply
"""
import json
import sys
from pathlib import Path

import soundfile

from scriptcast.post_processor import _measure_speech_duration

TAIL_MS = 400
THRESHOLD = 0.03

episode = Path(sys.argv[1])
manifest_path = episode / "episode_manifest.json"
manifest = json.loads(manifest_path.read_text())

grew = 0
for turn in manifest["turns"]:
    for seg in turn["segments"]:
        audio, sr = soundfile.read(episode / seg["segment_wav"], dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        new = _measure_speech_duration(audio, sr, THRESHOLD, TAIL_MS)
        grew += new > seg["speech_duration_ms"]
        seg["speech_duration_ms"] = new

manifest_path.write_text(json.dumps(manifest, indent=2))
print(f"refit {sum(len(t['segments']) for t in manifest['turns'])} segments, {grew} grew")
