"""Render the reel response with the local voice_pipeline MLX Aisha voice."""

from __future__ import annotations

import asyncio
import hashlib
import json
import re
import sys
from pathlib import Path

import numpy
import soundfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from voice_pipeline.engine import MLXChatterboxEngine
from voice_pipeline.models import VoiceConfig
from voice_pipeline.post_processor import process_segment


NOTE_PATH = ROOT / "thoghts" / "reel_DYh5spFJWkP_framework_response.md"
OUT_DIR = ROOT / "thoghts" / "voice_render_DYh5spFJWkP"
COMBINED_WAV = OUT_DIR / "chatgpt_perspective_aisha_mlx.wav"
MANIFEST_PATH = OUT_DIR / "manifest.json"
MODEL_ID = "mlx-community/Chatterbox-TTS-fp16"
SOURCE_RATE = 24_000
TARGET_RATE = 48_000
GAP_MS = 450


def _extract_voice_turns(markdown: str) -> list[tuple[str, str]]:
    marker = "## Voice Script"
    if marker not in markdown:
        raise RuntimeError(f"Missing {marker!r} section in {NOTE_PATH}")

    section = markdown.split(marker, maxsplit=1)[1].strip()
    header_re = re.compile(r"^Aisha \((\d{2}:\d{2})\)\s*$")
    turns: list[tuple[str, str]] = []
    current_timestamp: str | None = None
    current_lines: list[str] = []

    def flush() -> None:
        nonlocal current_timestamp, current_lines
        if current_timestamp is None:
            return
        text = " ".join(line.strip() for line in current_lines if line.strip()).strip()
        if text:
            turns.append((current_timestamp, text))
        current_timestamp = None
        current_lines = []

    for line in section.splitlines():
        match = header_re.match(line.strip())
        if match:
            flush()
            current_timestamp = match.group(1)
            continue
        if current_timestamp is not None:
            current_lines.append(line)
    flush()

    if not turns:
        raise RuntimeError("No Aisha turns found in voice script")
    return turns


async def main() -> None:
    markdown = NOTE_PATH.read_text(encoding="utf-8")
    turns = _extract_voice_turns(markdown)

    voice = VoiceConfig(
        speaker_id="aisha",
        name="Aisha",
        engine="mlx_chatterbox",
        reference_audio=str(ROOT / "voices" / "aisha_reference.wav"),
        character_profile="Black female perspective - sharp, insightful, direct",
        exaggeration=0.25,
    )
    engine = MLXChatterboxEngine(MODEL_ID)
    await engine.load()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    processed_arrays: list[numpy.ndarray] = []
    segment_records: list[dict[str, object]] = []
    silence = numpy.zeros(int(TARGET_RATE * GAP_MS / 1000), dtype=numpy.float32)

    for index, (timestamp, text) in enumerate(turns):
        raw_audio = await engine.synthesize_chunk(text, voice)
        turn_id = hashlib.sha256(f"aisha:{timestamp}:{text}".encode()).hexdigest()[:16]
        result = await process_segment(
            raw_audio,
            engine.sample_rate,
            TARGET_RATE,
            OUT_DIR,
            index,
            turn_id,
            0,
            "aisha",
            GAP_MS,
        )

        audio, sample_rate = soundfile.read(result.wav_path, dtype="float32")
        if sample_rate != TARGET_RATE:
            raise RuntimeError(f"Unexpected sample rate for {result.wav_path}: {sample_rate}")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        processed_arrays.append(audio)
        if index + 1 < len(turns):
            processed_arrays.append(silence)

        segment_records.append(
            {
                "turn_index": index,
                "source_timestamp": timestamp,
                "text": text,
                "wav_path": str(result.wav_path.relative_to(ROOT)),
                "duration_ms": result.duration_ms,
                "speech_duration_ms": result.speech_duration_ms,
                "checksum": result.checksum,
            }
        )

    combined = numpy.concatenate(processed_arrays)
    soundfile.write(COMBINED_WAV, combined, TARGET_RATE, subtype="PCM_16")

    manifest = {
        "source_note": str(NOTE_PATH.relative_to(ROOT)),
        "combined_wav": str(COMBINED_WAV.relative_to(ROOT)),
        "model_id": MODEL_ID,
        "engine": "voice_pipeline.engine.MLXChatterboxEngine",
        "voice_reference": str((ROOT / "voices" / "aisha_reference.wav").relative_to(ROOT)),
        "speaker": "Aisha",
        "sample_rate": TARGET_RATE,
        "gap_ms": GAP_MS,
        "duration_ms": int(len(combined) / TARGET_RATE * 1000),
        "segments": segment_records,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
