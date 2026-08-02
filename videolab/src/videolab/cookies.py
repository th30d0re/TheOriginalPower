"""Host-side browser cookie export."""

from __future__ import annotations

import os
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

    # Extract through yt-dlp's Python API rather than the command line. The CLI
    # path requires a downloadable URL, and a bare "https://<domain>/" is not one
    # — it fails with "Unsupported URL" before any cookie is written.
    try:
        from yt_dlp.cookies import YoutubeDLCookieJar, extract_cookies_from_browser
    except ImportError as exc:  # pragma: no cover - yt-dlp is a hard dependency
        raise CookieExportError("yt-dlp is not importable in this interpreter") from exc

    try:
        source_jar = extract_cookies_from_browser(browser)
    except Exception as exc:
        raise CookieExportError(
            f"could not read {browser} cookies: {exc}. Browser cookie stores are "
            "protected by macOS privacy controls — run this command from a terminal "
            "that has Full Disk Access. Safari's container stays unreadable even then."
        ) from exc

    wanted = domain.lower().lstrip(".")
    selected = YoutubeDLCookieJar()
    for cookie in source_jar:
        host = (cookie.domain or "").lower().lstrip(".")
        if host == wanted or host.endswith(f".{wanted}"):
            selected.set_cookie(cookie)

    count = sum(1 for _ in selected)
    if count == 0:
        raise CookieExportError(
            f"{browser} holds no cookies for {domain}. Log into https://{domain}/ in "
            f"{browser}, then run this again."
        )

    selected.save(str(temporary), ignore_discard=True, ignore_expires=True)
    if not temporary.is_file():
        raise CookieExportError("cookie file was not written")
    os.chmod(temporary, 0o600)
    os.replace(temporary, destination)
    os.chmod(destination, 0o600)
    return destination

