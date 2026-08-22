"""Install and inspect the macOS launchd daemon for Siri speech."""

from __future__ import annotations

import hashlib
import json
import os
import plistlib
import shutil
import subprocess
from collections.abc import Callable, Sequence
from pathlib import Path
from typing import Any
from urllib.request import urlopen

from .config import Config


LABEL = "com.videolab.speech"
PLIST_NAME = f"{LABEL}.plist"
SPEECH_PORT = 5277
HEALTH_URL = f"http://127.0.0.1:{SPEECH_PORT}/health"
HEALTH_TIMEOUT_SECONDS = 1.0
LaunchRunner = Callable[[Sequence[str]], subprocess.CompletedProcess[str]]
HealthOpener = Callable[..., Any]
SWIFT_SHIM = Path("/usr/bin/swift")
XCODE_SELECT = Path("/usr/bin/xcode-select")


def _default_runner(argv: Sequence[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        list(argv), capture_output=True, check=False, text=True, timeout=30
    )


def _plist_path(home: Path | None = None) -> Path:
    return (home or Path.home()) / "Library" / "LaunchAgents" / PLIST_NAME


def _staged_source_path(home: Path | None = None) -> Path:
    return (
        (home or Path.home())
        / "Library"
        / "Application Support"
        / "videolab"
        / "main.swift"
    )


def _content_hash(path: Path) -> str | None:
    if not path.is_file():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()


def speech_agent_installed(home: Path | None = None) -> bool:
    """Return whether the speech launch-agent plist exists."""

    return _plist_path(home).is_file()


def _selected_developer_dir(
    runner: LaunchRunner | None = None,
) -> Path:
    """Resolve the active Xcode directory that launchd must give the Swift shim."""

    result = (runner or _default_runner)([str(XCODE_SELECT), "-p"])
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "xcode-select failed").strip()
        raise RuntimeError(f"Cannot locate an active developer directory: {detail}")
    developer_dir = Path(result.stdout.strip())
    if not developer_dir.is_absolute() or not developer_dir.is_dir():
        raise RuntimeError(
            f"xcode-select returned an invalid developer directory: {developer_dir}"
        )
    return developer_dir.resolve()


def build_speech_plist(
    config: Config, developer_dir: Path, staged_source: Path | None = None
) -> dict[str, Any]:
    """Build the launchd property list without writing or loading it."""

    source = (
        staged_source or config.root / "siri-speech" / "Sources" / "main.swift"
    ).resolve()
    if not SWIFT_SHIM.is_file():
        raise ValueError(f"Apple Swift shim does not exist: {SWIFT_SHIM}")
    if not source.is_file():
        raise ValueError(f"speech helper source does not exist: {source}")
    resolved_developer_dir = developer_dir.resolve()
    if not resolved_developer_dir.is_dir():
        raise ValueError(
            f"developer directory does not exist: {resolved_developer_dir}"
        )
    logs_dir = config.root / "logs"
    return {
        "Label": LABEL,
        "ProgramArguments": [str(SWIFT_SHIM), str(source)],
        "EnvironmentVariables": {
            "DEVELOPER_DIR": str(resolved_developer_dir),
        },
        "RunAtLoad": True,
        "KeepAlive": True,
        "StandardOutPath": str((logs_dir / "speech.out.log").resolve()),
        "StandardErrorPath": str((logs_dir / "speech.err.log").resolve()),
    }


def install_speech(
    config: Config,
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
    developer_runner: LaunchRunner | None = None,
) -> dict[str, Any]:
    """Write and load an agent that runs the Apple-signed Swift interpreter."""

    developer_dir = _selected_developer_dir(developer_runner)
    source = (config.root / "siri-speech" / "Sources" / "main.swift").resolve()
    if not source.is_file():
        raise ValueError(f"speech helper source does not exist: {source}")
    staged_source = _staged_source_path(home)
    staged_source.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, staged_source)
    document = build_speech_plist(config, developer_dir, staged_source)

    path = _plist_path(home)
    execute = runner or _default_runner
    if path.exists():
        target = f"gui/{os.getuid()}/{LABEL}"
        unloaded = execute(["launchctl", "bootout", target])
        if unloaded.returncode != 0:
            execute(["launchctl", "unload", str(path)])
    path.parent.mkdir(parents=True, exist_ok=True)
    (config.root / "logs").mkdir(parents=True, exist_ok=True)
    path.write_bytes(plistlib.dumps(document, fmt=plistlib.FMT_XML, sort_keys=False))

    domain = f"gui/{os.getuid()}"
    loaded = execute(["launchctl", "bootstrap", domain, str(path)])
    if loaded.returncode != 0:
        loaded = execute(["launchctl", "load", str(path)])
    if loaded.returncode != 0:
        detail = (loaded.stderr or loaded.stdout or "launchctl failed").strip()
        raise RuntimeError(f"Cannot load {LABEL}: {detail}")
    return {
        "installed": True,
        "plist": str(path),
        "swift": str(SWIFT_SHIM),
        "source": str(source),
        "staged_source": str(staged_source),
        "developer_dir": str(developer_dir),
    }


def uninstall_speech(
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
) -> dict[str, Any]:
    """Unload and remove the speech agent, including when already absent."""

    path = _plist_path(home)
    staged_source = _staged_source_path(home)
    plist_exists = path.exists()
    staged_exists = staged_source.exists()
    if not plist_exists and not staged_exists:
        return {"installed": False, "removed": False, "plist": str(path)}
    execute = runner or _default_runner
    if plist_exists:
        target = f"gui/{os.getuid()}/{LABEL}"
        unloaded = execute(["launchctl", "bootout", target])
        if unloaded.returncode != 0 and path.exists():
            execute(["launchctl", "unload", str(path)])
    path.unlink(missing_ok=True)
    staged_source.unlink(missing_ok=True)
    return {"installed": False, "removed": True, "plist": str(path)}


def probe_speech_health(
    *, opener: HealthOpener = urlopen, timeout: float = HEALTH_TIMEOUT_SECONDS
) -> dict[str, Any]:
    """Read and validate the loopback helper's health response once."""

    try:
        with opener(HEALTH_URL, timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (OSError, TimeoutError, UnicodeError, json.JSONDecodeError) as exc:
        return {"ok": False, "detail": f"speech helper unreachable: {exc}"}
    if not isinstance(payload, dict):
        return {"ok": False, "detail": "speech helper returned a non-object health response"}
    if payload.get("ok") is not True:
        result = dict(payload)
        result["ok"] = False
        result.setdefault("detail", "speech helper reported unhealthy")
        return result
    return payload


def speech_status(
    config: Config | None = None,
    *,
    home: Path | None = None,
    runner: LaunchRunner | None = None,
    opener: HealthOpener = urlopen,
) -> dict[str, Any]:
    """Report installation, launchd load state, and live health."""

    path = _plist_path(home)
    root = config.root if config else Path(__file__).resolve().parents[2]
    source = (root / "siri-speech" / "Sources" / "main.swift").resolve()
    staged_source = _staged_source_path(home)
    stale_source = _content_hash(source) != _content_hash(staged_source)
    installed = path.is_file()
    loaded = False
    if installed:
        execute = runner or _default_runner
        result = execute(["launchctl", "print", f"gui/{os.getuid()}/{LABEL}"])
        loaded = result.returncode == 0
    health = probe_speech_health(opener=opener)
    available = health.get("available") is True
    ok = installed and loaded and health.get("ok") is True and available
    detail = None
    if not ok:
        detail = health.get("reason") or health.get("detail")
    return {
        "ok": ok,
        "installed": installed,
        "loaded": loaded,
        "health": health,
        "stale_source": stale_source,
        **(
            {"stale_source_remedy": "run `videolab speech install`"}
            if stale_source
            else {}
        ),
        **({"detail": detail} if detail else {}),
        "plist": str(path),
    }
