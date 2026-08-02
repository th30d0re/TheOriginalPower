"""Host-side browser cookie export."""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

from .config import Config


class CookieExportError(RuntimeError):
    """Browser cookies could not be exported."""


def refresh_cookies(config: Config, *, browser: str, domain: str) -> Path:
    """Export browser cookies for *domain* to the protected host cookie directory."""
    if not browser or any(char not in "abcdefghijklmnopqrstuvwxyz0123456789_-+" for char in browser.lower()):
        raise ValueError(f"invalid browser name: {browser!r}")
    destination = config.cookie_file(domain)
    destination.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(destination.parent, 0o700)
    temporary = destination.with_name(f".{destination.name}.tmp")
    if temporary.exists():
        temporary.unlink()
    command = [
        "yt-dlp",
        "--cookies-from-browser",
        browser,
        "--cookies",
        str(temporary),
        "--simulate",
        "--no-warnings",
        f"https://{domain}/",
    ]
    completed = subprocess.run(command, check=False, capture_output=True, text=True)
    if completed.returncode != 0 or not temporary.is_file():
        temporary.unlink(missing_ok=True)
        detail = completed.stderr.strip() or "yt-dlp did not create a cookie file"
        raise CookieExportError(detail)
    os.chmod(temporary, 0o600)
    os.replace(temporary, destination)
    os.chmod(destination, 0o600)
    return destination

