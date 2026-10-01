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


def test_ensemble_backfills_unfilled_opening_gap(tmp_path: Path) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"
    job_dir.mkdir()
    (job_dir / "job.json").write_text(
        json.dumps({"schema_version": 1, "stages": {}}), encoding="utf-8"
    )
    opening = "it even said like this but this is directed at a certain part of my audience"

    def fake_whisper(_audio: Path, _model: str) -> dict[str, object]:
        return {
            "text": f"{opening} later words",
            "language": "en",
            "segments": [
                {"start": 0.0, "end": 4.4, "text": opening},
                {"start": 4.8, "end": 6.0, "text": "later words"},
            ],
        }

    def fake_phonon(_audio: Path) -> tuple[list[dict], list[list[dict]], float]:
        return ([{"word": "later", "start": 4.8, "end": 5.2}, {"word": "words", "start": 5.4, "end": 6.0}], [[]], 6.0)

    summary = asr.transcribe_ensemble(
        audio_path,
        job_dir,
        whisper=fake_whisper,
        phonon_words=fake_phonon,
        big_text=lambda _audio: f"{opening} later words",
    )

    transcript = json.loads((job_dir / "transcript.json").read_text(encoding="utf-8"))
    job = json.loads((job_dir / "job.json").read_text(encoding="utf-8"))
    assert summary.engine == "ensemble"
    assert transcript["segments"][0]["engine"] == "whisper"
    assert job["stages"]["asr"]["detail"]["backfilled_segments"] == 1


def test_ensemble_phonon_failure_writes_whisper_only_outputs(tmp_path: Path) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"
    job_dir.mkdir()
    (job_dir / "job.json").write_text(
        json.dumps({"schema_version": 1, "stages": {}}), encoding="utf-8"
    )

    def fake_whisper(_audio: Path, _model: str) -> dict[str, object]:
        return {
            "text": "stable whisper transcript",
            "language": "en",
            "segments": [{"start": 0.0, "end": 2.0, "text": "stable whisper transcript"}],
        }

    def failed_phonon(_audio: Path):
        raise RuntimeError("phonon unavailable")

    summary = asr.transcribe_ensemble(
        audio_path, job_dir, whisper=fake_whisper, phonon_words=failed_phonon
    )

    transcript = json.loads((job_dir / "transcript.json").read_text(encoding="utf-8"))
    job_stage = json.loads((job_dir / "job.json").read_text(encoding="utf-8"))["stages"]["asr"]
    assert summary.engine == "mlx-whisper"
    assert transcript == {
        "text": "stable whisper transcript",
        "segments": [{"start": 0.0, "end": 2.0, "text": "stable whisper transcript"}],
        "language": "en",
    }
    assert job_stage["status"] == "ok"
    assert job_stage["engine"] == "mlx-whisper"
    assert job_stage["detail"]["ensemble_error"] == "phonon unavailable"


def test_ensemble_keeps_merge_when_big_coverage_check_fails(tmp_path: Path) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"
    job_dir.mkdir()
    (job_dir / "job.json").write_text(
        json.dumps({"schema_version": 1, "stages": {}}), encoding="utf-8"
    )
    whisper = lambda _audio, _model: {
        "text": "merged transcript",
        "language": "en",
        "segments": [{"start": 0.0, "end": 1.0, "text": "merged transcript"}],
    }
    phonon = lambda _audio: (
        [
            {"word": "merged", "start": 0.0, "end": 0.4},
            {"word": "transcript", "start": 0.5, "end": 1.0},
        ],
        [],
        1.0,
    )

    asr.transcribe_ensemble(
        audio_path,
        job_dir,
        whisper=whisper,
        phonon_words=phonon,
        big_text=lambda _audio: (_ for _ in ()).throw(RuntimeError("big failed")),
    )

    transcript = json.loads((job_dir / "transcript.json").read_text(encoding="utf-8"))
    detail = json.loads((job_dir / "job.json").read_text(encoding="utf-8"))["stages"]["asr"]["detail"]
    assert transcript["engine"] == "ensemble"
    assert detail["coverage_check_error"] == "big failed"


def test_fermion_server_is_terminated_when_request_raises(monkeypatch) -> None:
    class FakeProcess:
        def __init__(self) -> None:
            self.terminated = False

        def terminate(self) -> None:
            self.terminated = True

        def wait(self, timeout: float) -> None:
            assert timeout == 5

    process = FakeProcess()
    monkeypatch.setattr(asr, "_free_port", lambda: 5278)
    monkeypatch.setattr(asr, "_wait_for_health", lambda _port: None)

    try:
        asr._run_fermion_server(
            "phonon-2",
            lambda _port: (_ for _ in ()).throw(RuntimeError("request failed")),
            executable="fermion",
            process_factory=lambda *_args, **_kwargs: process,
        )
    except RuntimeError as exc:
        assert str(exc) == "request failed"
    else:
        raise AssertionError("request failure did not propagate")

    assert process.terminated is True


def test_ensemble_backfill_replaces_overlapping_phonon_words(tmp_path: Path) -> None:
    audio_path = tmp_path / "audio.wav"
    audio_path.write_bytes(b"fixture")
    job_dir = tmp_path / "job"
    job_dir.mkdir()
    (job_dir / "job.json").write_text(
        json.dumps({"schema_version": 1, "stages": {}}), encoding="utf-8"
    )
    opening_words = (
        "male and female sexuality too and are shamed for having a lot of sex"
    ).split()
    overlap_words = "sex is treated as something that a man".split()
    primary = [
        {
            "word": word,
            "start": 29.8 + index * 0.6,
            "end": 30.2 + index * 0.6,
        }
        for index, word in enumerate(opening_words)
    ]
    primary.extend(
        {
            "word": word,
            "start": 38.3 + index * 0.2,
            "end": 38.7 + index * 0.2,
        }
        for index, word in enumerate(overlap_words)
    )
    primary.extend(
        [
            {"word": "following", "start": 43.0, "end": 43.4},
            {"word": "words", "start": 43.5, "end": 43.9},
        ]
    )
    sentence = (
        "Sex is treated as something that a man takes from a woman, "
        "as if it decreases her value."
    )

    def fake_whisper(_audio: Path, _model: str) -> dict[str, object]:
        return {
            "text": sentence,
            "language": "en",
            "segments": [{"start": 38.5, "end": 42.6, "text": sentence}],
        }

    def fake_phonon(_audio: Path) -> tuple[list[dict], list[list[dict]], float]:
        return primary, [], 44.0

    asr.transcribe_ensemble(
        audio_path,
        job_dir,
        whisper=fake_whisper,
        phonon_words=fake_phonon,
        big_text=lambda _audio: sentence,
    )

    transcript_text = (job_dir / "transcript.txt").read_text(encoding="utf-8")
    transcript = json.loads((job_dir / "transcript.json").read_text(encoding="utf-8"))
    assert transcript_text.count("Sex is treated as something that a man takes from a woman") == 1
    assert all(
        not (38.5 <= (float(word["start"]) + float(word["end"])) / 2.0 < 42.6)
        for word in transcript["words"]
    )
