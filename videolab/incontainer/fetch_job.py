#!/usr/bin/env python3
"""Fetch one public video into a videolab job directory."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yt_dlp


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _write_json(path: Path, value: Any) -> None:
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def _update_job(job_dir: Path, *, status: str, started_at: str, error: str | None) -> None:
    path = job_dir / "job.json"
    if not path.is_file():
        return
    job = json.loads(path.read_text(encoding="utf-8"))
    stages = job.setdefault("stages", {})
    previous = stages.get("fetch", {})
    stages["fetch"] = {
        "status": status,
        "engine": "yt-dlp",
        "detail": previous.get("detail", {}),
        "started_at": started_at,
        "ended_at": _utc_now() if status in {"ok", "error"} else None,
        "error": error,
    }
    _write_json(path, job)


class _StderrLogger:
    def debug(self, message: str) -> None:
        if not message.startswith("[debug]"):
            print(message, file=sys.stderr)

    def warning(self, message: str) -> None:
        print(message, file=sys.stderr)

    def error(self, message: str) -> None:
        print(message, file=sys.stderr)


def fetch(job_dir: Path, url: str, cookies: Path | None = None) -> dict[str, str | bool]:
    """Download *url* once and persist its complete yt-dlp information dictionary."""
    job_dir = job_dir.resolve()
    job_dir.mkdir(parents=True, exist_ok=True)
    media_dir = job_dir / "media"
    media_dir.mkdir(parents=True, exist_ok=True)
    if cookies is not None and not cookies.is_file():
        raise FileNotFoundError(f"cookie file does not exist: {cookies}")

    options: dict[str, Any] = {
        "format": "bv*+ba/b",
        "outtmpl": str(media_dir / "video.%(ext)s"),
        "merge_output_format": "mp4",
        "postprocessors": [{"key": "FFmpegVideoRemuxer", "preferedformat": "mp4"}],
        "quiet": True,
        "no_warnings": False,
        "noprogress": True,
        "logger": _StderrLogger(),
    }
    if cookies is not None:
        options["cookiefile"] = str(cookies)

    with yt_dlp.YoutubeDL(options) as downloader:
        info = downloader.extract_info(url, download=True)
    if not isinstance(info, dict):
        raise RuntimeError("yt-dlp returned no video information")

    video_path = media_dir / "video.mp4"
    if not video_path.is_file():
        candidates = sorted(media_dir.glob("video.*"))
        if len(candidates) == 1:
            candidates[0].replace(video_path)
        else:
            raise RuntimeError("yt-dlp completed without producing media/video.mp4")

    # A JSON round-trip preserves the source dictionary's keys and full strings.
    # default=str covers the rare yt-dlp helper value without mutating `info`.
    info_text = json.dumps(info, ensure_ascii=False, indent=2, default=str) + "\n"
    temporary = job_dir / ".source.info.json.tmp"
    temporary.write_text(info_text, encoding="utf-8")
    os.replace(temporary, job_dir / "source.info.json")
    return {"ok": True, "video": "media/video.mp4", "info": "source.info.json"}


def main(argv: list[str] | None = None) -> int:
    """Run the fetch entrypoint and emit its single machine-readable result line."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--job", required=True, type=Path)
    parser.add_argument("--url", required=True)
    parser.add_argument("--cookies", type=Path)
    try:
        args = parser.parse_args(argv)
    except SystemExit:
        print(json.dumps({"ok": False, "error": "invalid command arguments"}, separators=(",", ":")))
        return 1
    started_at = _utc_now()
    try:
        _update_job(args.job, status="pending", started_at=started_at, error=None)
        result = fetch(args.job, args.url, args.cookies)
        _update_job(args.job, status="ok", started_at=started_at, error=None)
        print(json.dumps(result, ensure_ascii=False, separators=(",", ":")))
        return 0
    except Exception as exc:
        message = str(exc) or exc.__class__.__name__
        try:
            _update_job(args.job, status="error", started_at=started_at, error=message)
        except Exception as update_error:
            print(f"could not update job state: {update_error}", file=sys.stderr)
        print(json.dumps({"ok": False, "error": message}, ensure_ascii=False, separators=(",", ":")))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
