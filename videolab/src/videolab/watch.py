"""Install and inspect the macOS launchd job for DM ingestion."""

from __future__ import annotations

import json
import os
import plistlib
import shutil
import subprocess
from collections.abc import Callable, Sequence
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import Config


LABEL = "com.videolab.dmwatch"
PLIST_NAME = f"{LABEL}.plist"
LaunchRunner = Callable[[Sequence[str]], subprocess.CompletedProcess[str]]


def _default_runner(argv: Sequence[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        list(argv), capture_output=True, check=False, text=True, timeout=30
    )


_BASE_PATH = "/usr/bin:/bin:/usr/sbin:/sbin"


def _agent_path(which: Callable[[str], str | None] = shutil.which) -> str:
    """Build a PATH for the launch agent that can actually find instagram-cli.

    launchd does not inherit the interactive shell's PATH, so a Homebrew binary
    resolves in a terminal and vanishes under the agent. Resolve the tool now and
    pin its directory, falling back to the usual Homebrew prefixes.
    """
    directories: list[str] = []
    located = which("instagram-cli")
    if located:
        # Deliberately not resolve(): the Homebrew entry is an npm symlink into a
        # source checkout, and following it pins a directory holding no executable
        # of that name. PATH needs the directory the command is invoked from.
        directories.append(str(Path(located).parent))
    for fallback in ("/opt/homebrew/bin", "/usr/local/bin"):
        if fallback not in directories and Path(fallback).is_dir():
            directories.append(fallback)
    directories.append(_BASE_PATH)
    return os.pathsep.join(directories)


def _plist_path(home: Path | None = None) -> Path:
    return (home or Path.home()) / "Library" / "LaunchAgents" / PLIST_NAME


def build_watch_plist(config: Config, interval_minutes: int = 15) -> dict[str, Any]:
    """Build the launchd property list without writing or loading it."""

    if interval_minutes < 1:
        raise ValueError("interval_minutes must be positive")
    logs_dir = config.root / "logs"
    return {
        "Label": LABEL,
        "ProgramArguments": [
            str(config.voice_python.absolute()),
            "-m",
            "videolab",
            "ingest-dms",
        ],
        "EnvironmentVariables": {
            "PYTHONPATH": str((config.root / "src").resolve()),
            # launchd starts jobs with a minimal PATH (/usr/bin:/bin:/usr/sbin:/sbin),
            # so a Homebrew-installed instagram-cli is invisible to the agent even
            # though it resolves fine from an interactive shell. Pin the directory it
            # was found in at install time.
            "PATH": _agent_path(),
        },
        "StartInterval": interval_minutes * 60,
        "RunAtLoad": False,
        "StandardOutPath": str((logs_dir / "dmwatch.out.log").resolve()),
        "StandardErrorPath": str((logs_dir / "dmwatch.err.log").resolve()),
    }


def install_watch(
    config: Config,
    interval_minutes: int = 15,
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
) -> dict[str, Any]:
    """Write and load the launchd watcher."""

    document = build_watch_plist(config, interval_minutes)
    path = _plist_path(home)
    path.parent.mkdir(parents=True, exist_ok=True)
    (config.root / "logs").mkdir(parents=True, exist_ok=True)
    path.write_bytes(plistlib.dumps(document, fmt=plistlib.FMT_XML, sort_keys=False))

    execute = runner or _default_runner
    domain = f"gui/{os.getuid()}"
    loaded = execute(["launchctl", "bootstrap", domain, str(path)])
    if loaded.returncode != 0:
        loaded = execute(["launchctl", "load", str(path)])
    if loaded.returncode != 0:
        detail = (loaded.stderr or loaded.stdout or "launchctl failed").strip()
        raise RuntimeError(f"Cannot load {LABEL}: {detail}")
    return {"installed": True, "plist": str(path), "interval_minutes": interval_minutes}


def uninstall_watch(
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
) -> dict[str, Any]:
    """Unload and remove the watcher, including when it is already absent."""

    path = _plist_path(home)
    if not path.exists():
        return {"installed": False, "removed": False, "plist": str(path)}
    execute = runner or _default_runner
    target = f"gui/{os.getuid()}/{LABEL}"
    unloaded = execute(["launchctl", "bootout", target])
    if unloaded.returncode != 0 and path.exists():
        execute(["launchctl", "unload", str(path)])
    path.unlink(missing_ok=True)
    return {"installed": False, "removed": True, "plist": str(path)}


def _last_run(config: Config) -> str | None:
    logs = [
        path
        for path in (
            config.root / "logs" / "dmwatch.out.log",
            config.root / "logs" / "dmwatch.err.log",
        )
        if path.is_file()
    ]
    if not logs:
        return None
    modified = max(path.stat().st_mtime for path in logs)
    return datetime.fromtimestamp(modified, timezone.utc).isoformat().replace("+00:00", "Z")


def _last_ingest_counts(config: Config) -> dict[str, int]:
    """Read the most recent complete ingestion summary from watcher stdout."""

    counts = {"succeeded": 0, "failed": 0, "retrying": 0}
    path = config.root / "logs" / "dmwatch.out.log"
    if not path.is_file():
        return counts
    try:
        content = path.read_text(encoding="utf-8")
    except OSError:
        return counts
    decoder = json.JSONDecoder()
    position = 0
    summaries: list[dict[str, Any]] = []
    while position < len(content):
        start = content.find("{", position)
        if start < 0:
            break
        try:
            value, end = decoder.raw_decode(content, start)
        except json.JSONDecodeError:
            position = start + 1
            continue
        if isinstance(value, dict) and all(
            isinstance(value.get(key), list) for key in counts
        ):
            summaries.append(value)
        position = end
    if summaries:
        latest = summaries[-1]
        counts = {key: len(latest[key]) for key in counts}
    return counts


def watch_status(
    config: Config,
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
) -> dict[str, Any]:
    """Report watcher installation, load state, schedule, and local job count."""

    path = _plist_path(home)
    interval: int | None = None
    loaded = False
    if path.is_file():
        try:
            document = plistlib.loads(path.read_bytes())
            seconds = document.get("StartInterval")
            interval = int(seconds) // 60 if isinstance(seconds, int) else None
        except (OSError, plistlib.InvalidFileException, ValueError):
            interval = None
        execute = runner or _default_runner
        result = execute(["launchctl", "print", f"gui/{os.getuid()}/{LABEL}"])
        loaded = result.returncode == 0
    job_count = sum(1 for _ in config.private_jobs_dir.glob("*/job.json"))
    return {
        "installed": path.is_file(),
        "loaded": loaded,
        "interval_minutes": interval,
        "last_run": _last_run(config),
        "job_count": job_count,
        **_last_ingest_counts(config),
        "plist": str(path),
    }
