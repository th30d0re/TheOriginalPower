"""Host-side Whisper transcription and contract output rendering."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

from .asr_merge import (
    backfill_from_reference,
    coverage_warnings,
    drop_words_in_spans,
    fill_gaps,
    group_words_into_segments,
)

DEFAULT_MODEL = "mlx-community/whisper-large-v3-turbo"
PHONON_MODEL = "FermionResearch/Phonon-2"
PHONON_BIG_MODEL = "FermionResearch/Phonon-1-Big"


@dataclass(frozen=True)
class AsrResult:
    """Summary of a completed transcription."""

    engine: str
    model: str
    language: str | None
    segments: int
    dropped_segments: int


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _write_json(path: Path, value: Any) -> None:
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def _update_job(
    job_dir: Path,
    *,
    status: str,
    engine: str,
    model: str,
    language: str | None,
    dropped_segments: int,
    started_at: str,
    error: str | None,
    detail_extra: dict[str, Any] | None = None,
) -> None:
    path = job_dir / "job.json"
    if not path.is_file():
        return
    job = json.loads(path.read_text(encoding="utf-8"))
    detail = {
        "model": model,
        "language": language,
        "dropped_segments": dropped_segments,
    }
    if detail_extra:
        detail.update(detail_extra)
    job.setdefault("stages", {})["asr"] = {
        "status": status,
        "engine": engine,
        "detail": detail,
        "started_at": started_at,
        "ended_at": _utc_now() if status in {"ok", "error"} else None,
        "error": error,
    }
    _write_json(path, job)


def _normalized_result(raw: dict[str, Any]) -> dict[str, Any]:
    segments = [
        {
            "start": float(segment.get("start", 0.0)),
            "end": float(segment.get("end", 0.0)),
            "text": str(segment.get("text", "")).strip(),
        }
        for segment in raw.get("segments", [])
    ]
    text = str(raw.get("text", "")).strip()
    if not text:
        text = " ".join(segment["text"] for segment in segments).strip()
    language = raw.get("language")
    return {"text": text, "segments": segments, "language": language}


def _words(text: str) -> list[str]:
    return re.findall(r"[^\W_]+(?:['’][^\W_]+)*", text.casefold(), flags=re.UNICODE)


def _is_degenerate_segment(segment: dict[str, Any]) -> bool:
    words = _words(str(segment.get("text", "")))
    if not words:
        return False

    for width in range(1, min(4, len(words)) + 1):
        repetitions, remainder = divmod(len(words), width)
        if remainder == 0 and repetitions > 5:
            phrase = words[:width]
            if all(words[offset : offset + width] == phrase for offset in range(0, len(words), width)):
                return True

    duration = float(segment.get("end", 0.0)) - float(segment.get("start", 0.0))
    return duration <= 0.0 or len(words) / duration > 12.0


def _filter_degenerate_segments(result: dict[str, Any]) -> tuple[dict[str, Any], int]:
    segments = [segment for segment in result["segments"] if not _is_degenerate_segment(segment)]
    dropped_segments = len(result["segments"]) - len(segments)
    filtered = {
        **result,
        "text": " ".join(segment["text"] for segment in segments).strip(),
        "segments": segments,
    }
    return filtered, dropped_segments


def _mlx_transcribe(audio_path: Path, model: str) -> dict[str, Any]:
    import mlx_whisper

    return mlx_whisper.transcribe(
        str(audio_path),
        path_or_hf_repo=model,
        verbose=None,
        condition_on_previous_text=False,
        temperature=(0.0, 0.2, 0.4, 0.6, 0.8, 1.0),
        compression_ratio_threshold=2.4,
        no_speech_threshold=0.6,
    )


def _fallback_model(model: str) -> str:
    if model.endswith("whisper-large-v3-turbo"):
        return "turbo"
    return model.rsplit("/", 1)[-1].removeprefix("whisper-")


def _openai_transcribe(audio_path: Path, job_dir: Path, model: str) -> dict[str, Any]:
    executable = shutil.which("whisper")
    if executable is None:
        raise RuntimeError("OpenAI Whisper fallback is unavailable on PATH")
    with tempfile.TemporaryDirectory(prefix=".asr-work-", dir=job_dir) as temporary:
        command = [
            executable,
            str(audio_path),
            "--model",
            _fallback_model(model),
            "--device",
            "cpu",
            "--fp16",
            "False",
            "--output_dir",
            temporary,
            "--output_format",
            "json",
            "--verbose",
            "False",
        ]
        completed = subprocess.run(command, check=False, capture_output=True, text=True)
        if completed.returncode != 0:
            raise RuntimeError(completed.stderr.strip() or "OpenAI Whisper failed")
        result_path = Path(temporary) / f"{audio_path.stem}.json"
        if not result_path.is_file():
            raise RuntimeError("OpenAI Whisper produced no JSON transcript")
        return json.loads(result_path.read_text(encoding="utf-8"))


def _whisper_pass(
    audio_path: Path,
    job_dir: Path,
    model: str,
    transcriber: Callable[[Path, str], dict[str, Any]] | None = None,
) -> tuple[dict[str, Any], str, str, int]:
    engine = "mlx-whisper"
    try:
        raw = (transcriber or _mlx_transcribe)(audio_path, model)
    except Exception:
        engine = "openai-whisper"
        raw = _openai_transcribe(audio_path, job_dir, model)
    result, dropped = _filter_degenerate_segments(_normalized_result(raw))
    actual_model = model if engine == "mlx-whisper" else _fallback_model(model)
    return result, engine, actual_model, dropped


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.bind(("127.0.0.1", 0))
        return int(listener.getsockname()[1])


def _fermion_executable() -> str:
    executable = os.environ.get("VIDEOLAB_FERMION") or shutil.which("fermion")
    if not executable:
        raise RuntimeError("fermion is unavailable; set VIDEOLAB_FERMION or add it to PATH")
    return executable


def _wait_for_health(port: int, timeout: float = 120.0) -> None:
    deadline = time.monotonic() + timeout
    url = f"http://127.0.0.1:{port}/health"
    last_error: Exception | None = None
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1.0) as response:
                if response.status == 200:
                    return
        except (OSError, urllib.error.URLError) as exc:
            last_error = exc
        time.sleep(0.25)
    detail = f": {last_error}" if last_error else ""
    raise TimeoutError(f"fermion health check timed out after {timeout:g} seconds{detail}")


def _run_fermion_server(
    model: str,
    action: Callable[[int], Any],
    *,
    executable: str | None = None,
    process_factory: Callable[..., Any] = subprocess.Popen,
) -> Any:
    port = _free_port()
    process = process_factory(
        [executable or _fermion_executable(), "serve", model, "--port", str(port)],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        _wait_for_health(port)
        return action(port)
    finally:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=5)


def _post_audio(
    port: int, audio_path: Path, *, word_timestamps: bool
) -> dict[str, Any]:
    boundary = f"videolab-{os.getpid()}-{time.monotonic_ns()}"
    fields = [("response_format", "verbose_json")]
    if word_timestamps:
        fields.append(("timestamp_granularities[]", "word"))
    pieces: list[bytes] = []
    for name, value in fields:
        pieces.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                value.encode(),
                b"\r\n",
            ]
        )
    pieces.extend(
        [
            f"--{boundary}\r\n".encode(),
            (
                'Content-Disposition: form-data; name="file"; '
                f'filename="{audio_path.name}"\r\n'
            ).encode(),
            b"Content-Type: audio/wav\r\n\r\n",
            audio_path.read_bytes(),
            b"\r\n",
            f"--{boundary}--\r\n".encode(),
        ]
    )
    request = urllib.request.Request(
        f"http://127.0.0.1:{port}/v1/audio/transcriptions",
        data=b"".join(pieces),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120.0) as response:
        return json.loads(response.read().decode("utf-8"))


def _response_words(response: dict[str, Any], shift: float = 0.0) -> list[dict]:
    return [
        {
            "word": str(word.get("word", "")),
            "start": float(word.get("start", 0.0)) + shift,
            "end": float(word.get("end", 0.0)) + shift,
        }
        for word in response.get("words", [])
        if str(word.get("word", "")).strip()
    ]


def _slice_audio(audio_path: Path, output: Path, start: float, duration: float) -> None:
    executable = shutil.which("ffmpeg")
    if executable is None:
        raise RuntimeError("ffmpeg is unavailable on PATH")
    completed = subprocess.run(
        [
            executable,
            "-nostdin",
            "-y",
            "-ss",
            f"{start:.3f}",
            "-i",
            str(audio_path),
            "-t",
            f"{duration:.3f}",
            "-ac",
            "1",
            "-ar",
            "16000",
            str(output),
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "ffmpeg audio slice failed")


def _phonon_words(audio_path: Path) -> tuple[list[dict], list[list[dict]], float]:
    def transcribe_at_port(port: int) -> tuple[list[dict], list[list[dict]], float]:
        primary_response = _post_audio(port, audio_path, word_timestamps=True)
        primary = _response_words(primary_response)
        duration = float(primary_response.get("duration", 0.0))
        if duration <= 0.0:
            duration = max((float(word["end"]) for word in primary), default=0.0)
        passes: list[list[dict]] = []
        with tempfile.TemporaryDirectory(prefix=".phonon-windows-", dir=audio_path.parent) as temporary:
            temporary_path = Path(temporary)
            for pass_index, offset in enumerate((0.0, 5.0, 10.0)):
                pass_words: list[dict] = []
                window_index = 0
                start = offset
                while start < duration:
                    window_duration = min(15.0, duration - start)
                    window_path = temporary_path / f"pass-{pass_index}-{window_index}.wav"
                    _slice_audio(audio_path, window_path, start, window_duration)
                    response = _post_audio(port, window_path, word_timestamps=True)
                    for word in _response_words(response, shift=start):
                        midpoint = (float(word["start"]) + float(word["end"])) / 2.0
                        owned_start = 0.0 if window_index == 0 else start + 1.0
                        owned_end = duration if start + 15.0 >= duration else start + 14.0
                        if owned_start <= midpoint < owned_end:
                            pass_words.append(word)
                    start += 13.0
                    window_index += 1
                passes.append(pass_words)
        return primary, passes, duration

    return _run_fermion_server("phonon-2", transcribe_at_port)


def _big_text(audio_path: Path) -> str:
    def transcribe_at_port(port: int) -> str:
        response = _post_audio(port, audio_path, word_timestamps=False)
        return str(response.get("text", ""))

    return _run_fermion_server("phonon-1-big", transcribe_at_port)


def _timestamp(seconds: float, *, vtt: bool) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    whole_seconds, milliseconds = divmod(remainder, 1_000)
    separator = "." if vtt else ","
    return f"{hours:02d}:{minutes:02d}:{whole_seconds:02d}{separator}{milliseconds:03d}"


def _write_outputs(job_dir: Path, result: dict[str, Any]) -> None:
    segments = result["segments"]
    (job_dir / "transcript.txt").write_text(result["text"].strip() + "\n", encoding="utf-8")
    _write_json(job_dir / "transcript.json", result)
    srt_parts: list[str] = []
    vtt_parts = ["WEBVTT", ""]
    for index, segment in enumerate(segments, start=1):
        srt_parts.extend(
            [
                str(index),
                f"{_timestamp(segment['start'], vtt=False)} --> {_timestamp(segment['end'], vtt=False)}",
                segment["text"],
                "",
            ]
        )
        vtt_parts.extend(
            [
                f"{_timestamp(segment['start'], vtt=True)} --> {_timestamp(segment['end'], vtt=True)}",
                segment["text"],
                "",
            ]
        )
    (job_dir / "transcript.srt").write_text("\n".join(srt_parts), encoding="utf-8")
    (job_dir / "transcript.vtt").write_text("\n".join(vtt_parts), encoding="utf-8")


def transcribe(
    audio_path: Path,
    job_dir: Path,
    *,
    model: str = DEFAULT_MODEL,
    mlx_transcriber: Callable[[Path, str], dict[str, Any]] | None = None,
) -> AsrResult:
    """Transcribe audio with MLX, falling back to OpenAI Whisper when unavailable."""
    audio_path = audio_path.resolve()
    job_dir = job_dir.resolve()
    if not audio_path.is_file():
        raise FileNotFoundError(f"audio file does not exist: {audio_path}")
    job_dir.mkdir(parents=True, exist_ok=True)
    started_at = _utc_now()
    engine = "mlx-whisper"
    try:
        try:
            raw = (mlx_transcriber or _mlx_transcribe)(audio_path, model)
        except Exception:
            engine = "openai-whisper"
            raw = _openai_transcribe(audio_path, job_dir, model)
        result, dropped_segments = _filter_degenerate_segments(_normalized_result(raw))
        _write_outputs(job_dir, result)
        language = str(result["language"]) if result["language"] is not None else None
        actual_model = model if engine == "mlx-whisper" else _fallback_model(model)
        _update_job(
            job_dir,
            status="ok",
            engine=engine,
            model=actual_model,
            language=language,
            dropped_segments=dropped_segments,
            started_at=started_at,
            error=None,
        )
        return AsrResult(
            engine=engine,
            model=actual_model,
            language=language,
            segments=len(result["segments"]),
            dropped_segments=dropped_segments,
        )
    except Exception as exc:
        _update_job(
            job_dir,
            status="error",
            engine=engine,
            model=model,
            language=None,
            dropped_segments=0,
            started_at=started_at,
            error=str(exc),
        )
        raise


def transcribe_ensemble(
    audio_path: Path,
    job_dir: Path,
    *,
    model: str = DEFAULT_MODEL,
    whisper: Callable[[Path, str], dict[str, Any]] | None = None,
    phonon_words: Callable[[Path], tuple[list[dict], list[list[dict]], float]] | None = None,
    big_text: Callable[[Path], str] | None = None,
) -> AsrResult:
    """Transcribe with Whisper, Phonon-2 gap filling, and a Phonon-1-Big check."""
    audio_path = audio_path.resolve()
    job_dir = job_dir.resolve()
    if not audio_path.is_file():
        raise FileNotFoundError(f"audio file does not exist: {audio_path}")
    job_dir.mkdir(parents=True, exist_ok=True)
    started_at = _utc_now()

    try:
        whisper_result, whisper_engine, actual_model, dropped_segments = _whisper_pass(
            audio_path, job_dir, model, whisper
        )
    except Exception as exc:
        _update_job(
            job_dir,
            status="error",
            engine="mlx-whisper",
            model=model,
            language=None,
            dropped_segments=0,
            started_at=started_at,
            error=str(exc),
        )
        raise

    language = (
        str(whisper_result["language"])
        if whisper_result["language"] is not None
        else None
    )
    try:
        primary, passes, duration = (phonon_words or _phonon_words)(audio_path)
        merged_words, filled_gaps, unfilled_gaps = fill_gaps(primary, passes, duration)
        phonon_segments = group_words_into_segments(merged_words)
        candidate_segments, backfilled_segments = backfill_from_reference(
            phonon_segments, whisper_result["segments"]
        )
        inserted_segments = [
            segment
            for segment in candidate_segments
            if segment.get("engine") == "whisper"
        ]
        merged_words = drop_words_in_spans(
            merged_words,
            [
                (float(segment["start"]), float(segment["end"]))
                for segment in inserted_segments
            ],
        )
        segments = group_words_into_segments(merged_words) + inserted_segments
        segments.sort(key=lambda segment: float(segment.get("start", 0.0)))
    except Exception as exc:
        _write_outputs(job_dir, whisper_result)
        _update_job(
            job_dir,
            status="ok",
            engine=whisper_engine,
            model=actual_model,
            language=language,
            dropped_segments=dropped_segments,
            started_at=started_at,
            error=None,
            detail_extra={"ensemble_error": str(exc)},
        )
        return AsrResult(
            engine=whisper_engine,
            model=actual_model,
            language=language,
            segments=len(whisper_result["segments"]),
            dropped_segments=dropped_segments,
        )

    merged_text = " ".join(str(segment.get("text", "")) for segment in segments).strip()
    warnings: list[dict] = []
    coverage_error: str | None = None
    try:
        warnings = coverage_warnings(merged_text, (big_text or _big_text)(audio_path))
    except Exception as exc:
        coverage_error = str(exc)

    result = {
        "text": merged_text,
        "segments": segments,
        "language": whisper_result["language"],
        "engine": "ensemble",
        "words": merged_words,
    }
    _write_outputs(job_dir, result)
    detail: dict[str, Any] = {
        "phonon_model": PHONON_MODEL,
        "filled_gaps": filled_gaps,
        "unfilled_gaps": unfilled_gaps,
        "backfilled_segments": backfilled_segments,
        "coverage_warnings": warnings,
    }
    if coverage_error is not None:
        detail["coverage_check_error"] = coverage_error
    _update_job(
        job_dir,
        status="ok",
        engine="ensemble",
        model=actual_model,
        language=language,
        dropped_segments=dropped_segments,
        started_at=started_at,
        error=None,
        detail_extra=detail,
    )
    return AsrResult(
        engine="ensemble",
        model=actual_model,
        language=language,
        segments=len(segments),
        dropped_segments=dropped_segments,
    )


def main(argv: list[str] | None = None) -> int:
    """Run host transcription from the command line."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True, type=Path)
    parser.add_argument("--job", required=True, type=Path)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument(
        "--engine",
        choices=("whisper", "ensemble"),
        default=os.environ.get("VIDEOLAB_ASR_ENGINE", "whisper"),
    )
    args = parser.parse_args(argv)
    try:
        transcriber = transcribe_ensemble if args.engine == "ensemble" else transcribe
        result = transcriber(args.audio, args.job, model=args.model)
        print(json.dumps({"ok": True, **result.__dict__}, separators=(",", ":")))
        return 0
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, separators=(",", ":")))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
