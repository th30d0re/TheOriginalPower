"""Command-line interface for videolab."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence
from urllib.parse import parse_qs, urlparse

from .config import Config, load_config
from .containers import ContainerError, run_derive, run_fetch
from .cookies import refresh_cookies
from .report import write_report

try:
    from .slugs import Source, parse_source, slug_for
except ImportError:
    @dataclass(frozen=True)
    class Source:  # type: ignore[no-redef]
        kind: str
        platform: str
        id: str
        url: str | None
        path: str | None

    def parse_source(src: str) -> Source:
        path = Path(src).expanduser()
        if path.is_file():
            digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
            return Source("file", "file", digest, None, str(path.resolve()))
        parsed = urlparse(src)
        host = parsed.netloc.lower().removeprefix("www.")
        pieces = [piece for piece in parsed.path.split("/") if piece]
        if host in {"instagram.com", "youtube.com", "youtu.be", "x.com", "twitter.com", "tiktok.com"}:
            platform = "x" if host in {"x.com", "twitter.com"} else "youtube" if host in {"youtube.com", "youtu.be"} else host.split(".")[0]
            if host == "youtube.com" and parsed.path == "/watch":
                source_id = parse_qs(parsed.query).get("v", [""])[0]
            else:
                source_id = pieces[-1] if pieces else ""
            if not source_id:
                raise ValueError(f"source URL contains no video id: {src}")
            return Source("url", platform, source_id, src, None)
        raise ValueError(f"unsupported source: {src}")

    def slug_for(source: Source) -> str:
        return f"{source.platform}-{source.id}"


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _stage() -> dict[str, Any]:
    return {"status": "pending", "engine": None, "detail": {}, "started_at": None, "ended_at": None, "error": None}


def _create_job(config: Config, source: Source, slug: str) -> Path:
    job_dir = config.jobs_dir / slug
    job_dir.mkdir(parents=True, exist_ok=True)
    (job_dir / "media").mkdir(exist_ok=True)
    source_data = asdict(source)
    if source.kind == "file":
        source_data["path"] = "media/video.mp4"
    job = {
        "schema_version": 1,
        "slug": slug,
        "source": source_data,
        "created_at": _utc_now(),
        "stages": {name: _stage() for name in ("fetch", "derive", "asr", "report")},
    }
    (job_dir / "job.json").write_text(json.dumps(job, indent=2) + "\n", encoding="utf-8")
    return job_dir


def _cookie_domain(source: Source) -> str:
    return {
        "instagram": "instagram.com",
        "youtube": "youtube.com",
        "x": "x.com",
        "tiktok": "tiktok.com",
    }.get(source.platform, source.platform)


def _run_asr(config: Config, job_dir: Path) -> None:
    audio = job_dir / "media" / "audio.wav"
    environment = os.environ.copy()
    source_dir = str(config.root / "src")
    environment["PYTHONPATH"] = source_dir + (os.pathsep + environment["PYTHONPATH"] if environment.get("PYTHONPATH") else "")
    completed = subprocess.run(
        [
            str(config.voice_python),
            "-m",
            "videolab.asr",
            "--audio",
            str(audio),
            "--job",
            str(job_dir),
            "--model",
            config.asr_model,
        ],
        check=False,
        env=environment,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or completed.stdout.strip() or "host ASR failed")


def _record_stage(
    job_dir: Path,
    stage: str,
    *,
    status: str,
    engine: str,
    detail: dict[str, Any],
    started_at: str,
) -> None:
    """Rewrite one stage block in job.json, leaving the others untouched."""
    path = job_dir / "job.json"
    if not path.is_file():
        return
    job = json.loads(path.read_text(encoding="utf-8"))
    job.setdefault("stages", {})[stage] = {
        "status": status,
        "engine": engine,
        "detail": detail,
        "started_at": started_at,
        "ended_at": _utc_now(),
        "error": None,
    }
    path.write_text(json.dumps(job, indent=2) + "\n", encoding="utf-8")


def ingest(config: Config, src: str, *, frames: int, ocr: bool, asr_mode: str) -> str:
    """Run the A1/A3, B, and C stages for one source and return its slug."""
    if asr_mode == "container":
        raise ValueError("container ASR is unavailable; Stage C runs on the host with `--asr host`")
    source = parse_source(src)
    slug = slug_for(source)
    job_dir = _create_job(config, source, slug)
    if source.kind == "file":
        assert source.path is not None
        shutil.copy2(source.path, job_dir / "media" / "video.mp4")
        job_path = job_dir / "job.json"
        job = json.loads(job_path.read_text(encoding="utf-8"))
        now = _utc_now()
        job["stages"]["fetch"] = {"status": "skipped", "engine": "file-copy", "detail": {}, "started_at": now, "ended_at": now, "error": None}
        job_path.write_text(json.dumps(job, indent=2) + "\n", encoding="utf-8")
    else:
        assert source.url is not None
        cookie = config.cookie_file(_cookie_domain(source))
        run_fetch(config, job_dir, source.url, cookie if cookie.is_file() else None)
    derive_started = _utc_now()
    derive_result = run_derive(config, job_dir, frames=frames, ocr=ocr)
    _record_stage(
        job_dir,
        "derive",
        status="ok",
        engine="ffmpeg+tesseract",
        detail={k: v for k, v in derive_result.items() if k != "ok"},
        started_at=derive_started,
    )
    _run_asr(config, job_dir)
    # Stage D. Without this the pipeline produces transcripts and frames but
    # never the <slug>.md / <slug>_metadata.json pair the artifacts exist for.
    report_started = _utc_now()
    written = write_report(job_dir)
    _record_stage(
        job_dir,
        "report",
        status="ok",
        engine="videolab.report",
        detail={name: path.name for name, path in written.items()},
        started_at=report_started,
    )
    return slug


_ANSI = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")


def _run_lines(command: Sequence[str]) -> tuple[bool, list[str]]:
    """Run *command* and return its success flag with ANSI-stripped output lines."""
    try:
        completed = subprocess.run(list(command), check=False, capture_output=True, text=True, timeout=30)
    except (FileNotFoundError, subprocess.TimeoutExpired) as exc:
        return False, [str(exc)]
    cleaned = _ANSI.sub("", completed.stdout.strip() or completed.stderr.strip())
    return completed.returncode == 0, [line.strip() for line in cleaned.splitlines() if line.strip()]


def _check(command: Sequence[str]) -> tuple[bool, str]:
    # First line, not last: version banners put the version up front and trail
    # off into library and configure noise.
    ok, lines = _run_lines(command)
    return ok, lines[0] if lines else "no output"


def doctor(config: Config) -> dict[str, Any]:
    """Inspect local container, ASR, authentication, and cookie readiness."""
    status: dict[str, Any] = {}
    service_ok, service_detail = _check([config.container_cli, "system", "status"])
    if service_ok:
        # `system status` prints a field table whose first line is the header.
        service_detail = "apiserver running"
    else:
        service_detail = f"{service_detail}; run `container system start`"
    status["container_service"] = {"ok": service_ok, "detail": service_detail}
    image_ok, image_detail = _check([config.container_cli, "image", "inspect", config.image]) if service_ok else (False, "container service unavailable")
    if image_ok:
        # `image inspect` emits a JSON array; the first line is just "[".
        image_detail = config.image
    status["image"] = {"ok": image_ok, "detail": image_detail}
    # ffmpeg takes a single-dash -version; --version is parsed as an input option
    # and fails with "Error splitting the argument list".
    for tool, flag in (("ffmpeg", "-version"), ("tesseract", "--version")):
        ok, detail = _check([config.container_cli, "run", "--rm", config.image, tool, flag]) if image_ok else (False, "image unavailable")
        status[tool] = {"ok": ok, "detail": detail}
    mlx_ok, mlx_detail = _check(
        [
            str(config.voice_python),
            "-c",
            "import mlx; from importlib.metadata import version; print(version('mlx'))",
        ]
    )
    status["mlx"] = {"ok": mlx_ok, "detail": mlx_detail}
    whisper_ok, whisper_detail = _check(
        [str(config.voice_python), "-c", "import mlx_whisper; print('mlx-whisper ready')"]
    )
    status["mlx_whisper"] = {"ok": whisper_ok, "detail": whisper_detail}
    instagram_ok, instagram_lines = _run_lines(["instagram-cli", "auth", "whoami"])
    # whoami streams a "Fetching user..." progress line before the answer, so the
    # account line has to be picked out rather than taken positionally.
    instagram_detail = next(
        (line for line in reversed(instagram_lines) if "account" in line.lower()),
        instagram_lines[0] if instagram_lines else "no output",
    )
    if instagram_ok and "account" not in instagram_detail.lower():
        instagram_detail = "session active"
    if not instagram_ok:
        instagram_detail = f"{instagram_detail}; run `instagram-cli auth login`"
    status["instagram_auth"] = {"ok": instagram_ok, "detail": instagram_detail}
    cookies = []
    if config.cookie_dir.is_dir():
        now = datetime.now(timezone.utc).timestamp()
        for path in sorted(config.cookie_dir.glob("*.txt")):
            cookies.append({"file": path.name, "age_hours": round((now - path.stat().st_mtime) / 3600, 1), "mode": oct(path.stat().st_mode & 0o777)})
    status["cookies"] = cookies
    return status


def list_jobs(config: Config) -> list[dict[str, Any]]:
    """Return the public and local-only job inventory without reading media."""
    jobs = []
    for root, private in ((config.jobs_dir, False), (config.private_jobs_dir, True)):
        for path in sorted(root.glob("*/job.json")):
            try:
                job = json.loads(path.read_text(encoding="utf-8"))
                stages = {
                    name: value.get("status")
                    for name, value in job.get("stages", {}).items()
                }
                jobs.append(
                    {
                        "slug": job.get("slug", path.parent.name),
                        "created_at": job.get("created_at"),
                        "stages": stages,
                        "private": private,
                    }
                )
            except (OSError, json.JSONDecodeError):
                jobs.append(
                    {"slug": path.parent.name, "error": "invalid job.json", "private": private}
                )
    return sorted(jobs, key=lambda row: (str(row["slug"]), bool(row["private"])))


def build_parser() -> argparse.ArgumentParser:
    """Build the videolab argument parser."""
    parser = argparse.ArgumentParser(prog="videolab")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("doctor")
    ingest_parser = subparsers.add_parser("ingest")
    ingest_parser.add_argument("source")
    ingest_parser.add_argument("--frames", type=int, default=12)
    ingest_parser.add_argument("--no-ocr", action="store_true")
    ingest_parser.add_argument("--asr", choices=("host", "container"), default="host")
    subparsers.add_parser("list")
    cookies_parser = subparsers.add_parser("cookies")
    cookie_subparsers = cookies_parser.add_subparsers(dest="cookies_command", required=True)
    refresh_parser = cookie_subparsers.add_parser("refresh")
    refresh_parser.add_argument("--browser", default="safari")
    refresh_parser.add_argument("--domain", required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    """Run the videolab CLI."""
    args = build_parser().parse_args(argv)
    config = load_config()
    try:
        if args.command == "doctor":
            result: Any = doctor(config)
        elif args.command == "list":
            result = list_jobs(config)
        elif args.command == "cookies":
            path = refresh_cookies(config, browser=args.browser, domain=args.domain)
            result = {"ok": True, "file": str(path), "mode": "600"}
        else:
            result = {"ok": True, "slug": ingest(config, args.source, frames=args.frames, ocr=not args.no_ocr, asr_mode=args.asr)}
        print(json.dumps(result, indent=2))
        return 0
    except (ContainerError, RuntimeError, ValueError, OSError) as exc:
        print(f"videolab: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
