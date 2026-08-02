from __future__ import annotations

import json
import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from videolab import asr


def test_mlx_transcribe_passes_decoding_guards(tmp_path: Path, monkeypatch) -> None:
    captured: dict[str, object] = {}

    def fake_transcribe(audio: str, **kwargs: object) -> dict[str, object]:
        captured.update({"audio": audio, **kwargs})
        return {"text": "", "segments": []}

    monkeypatch.setitem(sys.modules, "mlx_whisper", SimpleNamespace(transcribe=fake_transcribe))
    audio_path = tmp_path / "audio.wav"
    asr._mlx_transcribe(audio_path, "model/test")

    assert captured == {
        "audio": str(audio_path),
        "path_or_hf_repo": "model/test",
        "verbose": None,
        "condition_on_previous_text": False,
        "temperature": (0.0, 0.2, 0.4, 0.6, 0.8, 1.0),
        "compression_ratio_threshold": 2.4,
        "no_speech_threshold": 0.6,
    }


def test_filter_drops_repeated_phrase_and_implausible_speech_rate() -> None:
    result = {
        "text": "raw decoder text",
        "language": "en",
        "segments": [
            {"start": 0.0, "end": 8.0, "text": "to process " * 6},
            {"start": 8.0, "end": 8.1, "text": "thirteen words fit inside this tiny segment and make its speech rate clearly impossible now"},
            {"start": 9.0, "end": 12.0, "text": "within fracturing tawakkul"},
        ],
    }

    filtered, dropped_segments = asr._filter_degenerate_segments(result)

    assert dropped_segments == 2
    assert filtered["segments"] == [
        {"start": 9.0, "end": 12.0, "text": "within fracturing tawakkul"}
    ]
    assert filtered["text"] == "within fracturing tawakkul"


def test_transcribe_removes_degenerate_segment_from_all_outputs_and_records_count(tmp_path: Path) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"
    job_dir.mkdir()
    (job_dir / "job.json").write_text(
        json.dumps({"schema_version": 1, "stages": {}}), encoding="utf-8"
    )

    def fake_mlx(_audio_path: Path, _model: str) -> dict[str, object]:
        return {
            "text": "within fracturing tawakkul " + "to process " * 20,
            "language": "en",
            "segments": [
                {"start": 0.0, "end": 3.0, "text": "within fracturing tawakkul"},
                {"start": 3.0, "end": 3.2, "text": "to process " * 20},
            ],
        }

    summary = asr.transcribe(audio_path, job_dir, mlx_transcriber=fake_mlx)

    assert summary.segments == 1
    assert summary.dropped_segments == 1
    assert (job_dir / "transcript.txt").read_text(encoding="utf-8") == "within fracturing tawakkul\n"
    transcript_json = json.loads((job_dir / "transcript.json").read_text(encoding="utf-8"))
    assert [segment["text"] for segment in transcript_json["segments"]] == [
        "within fracturing tawakkul"
    ]
    assert "to process" not in (job_dir / "transcript.srt").read_text(encoding="utf-8")
    assert "to process" not in (job_dir / "transcript.vtt").read_text(encoding="utf-8")
    job = json.loads((job_dir / "job.json").read_text(encoding="utf-8"))
    assert job["stages"]["asr"]["detail"]["dropped_segments"] == 1


def test_openai_fallback_uses_the_same_filter(tmp_path: Path, monkeypatch) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"

    def unavailable_mlx(_audio_path: Path, _model: str) -> dict[str, object]:
        raise RuntimeError("MLX unavailable")

    monkeypatch.setattr(
        asr,
        "_openai_transcribe",
        lambda *_args: {
            "text": "continued " * 6,
            "language": "en",
            "segments": [{"start": 0.0, "end": 5.0, "text": "continued " * 6}],
        },
    )

    summary = asr.transcribe(audio_path, job_dir, mlx_transcriber=unavailable_mlx)

    assert summary.engine == "openai-whisper"
    assert summary.segments == 0
    assert summary.dropped_segments == 1
    assert (job_dir / "transcript.txt").read_text(encoding="utf-8") == "\n"
