"""Host-side Whisper transcription and contract output rendering."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

DEFAULT_MODEL = "mlx-community/whisper-large-v3-turbo"


@dataclass(frozen=True)
class AsrResult:
    """Summary of a completed transcription."""

    engine: str
    model: str
    language: str | None
    segments: int


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
    started_at: str,
    error: str | None,
) -> None:
    path = job_dir / "job.json"
    if not path.is_file():
        return
    job = json.loads(path.read_text(encoding="utf-8"))
    job.setdefault("stages", {})["asr"] = {
        "status": status,
        "engine": engine,
        "detail": {"model": model, "language": language},
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


def _mlx_transcribe(audio_path: Path, model: str) -> dict[str, Any]:
    import mlx_whisper

    return mlx_whisper.transcribe(str(audio_path), path_or_hf_repo=model, verbose=None)


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
        result = _normalized_result(raw)
        _write_outputs(job_dir, result)
        language = str(result["language"]) if result["language"] is not None else None
        actual_model = model if engine == "mlx-whisper" else _fallback_model(model)
        _update_job(
            job_dir,
            status="ok",
            engine=engine,
            model=actual_model,
            language=language,
            started_at=started_at,
            error=None,
        )
        return AsrResult(engine=engine, model=actual_model, language=language, segments=len(result["segments"]))
    except Exception as exc:
        _update_job(
            job_dir,
            status="error",
            engine=engine,
            model=model,
            language=None,
            started_at=started_at,
            error=str(exc),
        )
        raise


def main(argv: list[str] | None = None) -> int:
    """Run host transcription from the command line."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True, type=Path)
    parser.add_argument("--job", required=True, type=Path)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args(argv)
    try:
        result = transcribe(args.audio, args.job, model=args.model)
        print(json.dumps({"ok": True, **result.__dict__}, separators=(",", ":")))
        return 0
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, separators=(",", ":")))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
