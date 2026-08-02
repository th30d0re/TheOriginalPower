"""Apple Containerization command construction and execution."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Any, Sequence

from .config import Config


class ContainerError(RuntimeError):
    """A worker container could not be run."""


def fetch_argv(
    config: Config,
    job_dir: Path,
    url: str,
    cookie_file: Path | None = None,
) -> list[str]:
    """Build the credential-limited Stage A1 container command."""
    job_dir = job_dir.resolve()
    command = [
        config.container_cli,
        "run",
        "--rm",
        "-m",
        "4G",
        "-v",
        f"{job_dir}:/job",
    ]
    container_cookie: str | None = None
    if cookie_file is not None:
        cookie_file = cookie_file.resolve()
        # Two platform constraints shape this mount. Apple's container CLI only
        # bind-mounts directories, so a file source fails with "path ... is not a
        # directory". And yt-dlp rewrites its cookie jar on close, so a readonly
        # mount fails with "Read-only file system" *after* a successful download.
        # run_fetch therefore stages a throwaway copy holding this one cookie: the
        # container sees no other platform's session and cannot reach the real file.
        command.extend(
            [
                "--mount",
                f"type=bind,source={cookie_file.parent},target=/cookies",
            ]
        )
        container_cookie = f"/cookies/{cookie_file.name}"
    command.extend([config.image, "python3", "/app/fetch_job.py", "--job", "/job", "--url", url])
    if container_cookie is not None:
        command.extend(["--cookies", container_cookie])
    return command


def derive_argv(
    config: Config,
    job_dir: Path,
    *,
    frames: int = 12,
    scene_threshold: float = 0.3,
    min_interval: float = 2.0,
    ocr: bool = True,
    ocr_lang: str = "eng",
) -> list[str]:
    """Build the credential-free, restricted Stage B container command."""
    if frames < 1:
        raise ValueError("frames must be at least 1")
    command = [
        config.container_cli,
        "run",
        "--rm",
        "-m",
        "4G",
        "-v",
        f"{job_dir.resolve()}:/job",
        "--no-dns",
        "--cap-drop",
        "ALL",
        "--read-only",
        "--tmpfs",
        "/tmp",
        config.image,
        "python3",
        "/app/derive_job.py",
        "--job",
        "/job",
        "--frames",
        str(frames),
        "--scene-threshold",
        str(scene_threshold),
        "--min-interval",
        str(min_interval),
        "--ocr-lang",
        ocr_lang,
    ]
    if not ocr:
        command.append("--no-ocr")
    return command


def run(argv: Sequence[str], *, timeout: float | None = None) -> dict[str, Any]:
    """Run a container command and return the final JSON object from stdout."""
    try:
        completed = subprocess.run(
            list(argv),
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except FileNotFoundError as exc:
        raise ContainerError("Apple's container CLI is unavailable; install it and run `container system start`") from exc
    stdout_lines = [line for line in completed.stdout.splitlines() if line.strip()]
    if completed.returncode != 0:
        detail = completed.stderr.strip() or (stdout_lines[-1] if stdout_lines else "unknown container error")
        if "apiserver is not running" in detail.lower() or "operation not permitted" in detail.lower():
            detail = f"{detail}\nStart the service with `container system start`."
        raise ContainerError(detail)
    if not stdout_lines:
        raise ContainerError("worker produced no JSON result")
    try:
        result = json.loads(stdout_lines[-1])
    except json.JSONDecodeError as exc:
        raise ContainerError(f"worker returned invalid JSON: {stdout_lines[-1]}") from exc
    if not isinstance(result, dict):
        raise ContainerError("worker JSON result is not an object")
    if result.get("ok") is not True:
        raise ContainerError(str(result.get("error", "worker reported failure")))
    return result


def run_fetch(
    config: Config,
    job_dir: Path,
    url: str,
    cookie_file: Path | None = None,
) -> dict[str, Any]:
    """Run Stage A1, exposing at most one cookie file to the container."""
    if cookie_file is None:
        return run(fetch_argv(config, job_dir, url, None))

    # The cookie directory holds one file per platform. Bind-mounting it wholesale
    # would let a fetch for one platform read every other platform's session, so
    # stage the single needed cookie into a private 0700 directory and mount that.
    staging = Path(tempfile.mkdtemp(prefix="videolab-cookie-"))
    try:
        staged = staging / cookie_file.name
        shutil.copyfile(cookie_file, staged)
        os.chmod(staged, 0o600)
        return run(fetch_argv(config, job_dir, url, staged))
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def run_derive(
    config: Config,
    job_dir: Path,
    *,
    frames: int = 12,
    ocr: bool = True,
) -> dict[str, Any]:
    """Run Stage B."""
    return run(derive_argv(config, job_dir, frames=frames, ocr=ocr))


build_fetch_argv = fetch_argv
build_derive_argv = derive_argv
