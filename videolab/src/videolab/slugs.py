"""Source identification and slug generation for videolab jobs.

Implements CONTRACT.md section 3. Slug generation is pure and total: the same
input always yields the same slug. No clock, no network, and no filesystem
access except the SHA-256 hash for local files.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Literal
from urllib.parse import ParseResult, parse_qs, urlparse


class UnsupportedSourceError(ValueError):
    """Raised when a source string matches no supported platform."""


@dataclass(frozen=True)
class Source:
    kind: Literal["url", "file", "dm"]
    platform: Literal["instagram", "x", "youtube", "tiktok", "file"]
    id: str
    url: str | None
    path: str | None


# CONTRACT.md §3 states the slug matches ^[a-z0-9][a-z0-9._-]{0,95}$, but the §4
# example slug is "instagram-DZtCPIRPT87" (mixed case). Platform ids such as
# Instagram shortcodes are case-sensitive, so the id is preserved verbatim and
# this regex is not enforced on the id portion. See docs/V1-findings.md.

_INSTAGRAM_HOSTS = {"instagram.com", "www.instagram.com", "m.instagram.com"}
_X_HOSTS = {"x.com", "www.x.com", "twitter.com", "www.twitter.com", "mobile.twitter.com"}
_YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"}
_YOUTUBE_SHORT_HOSTS = {"youtu.be", "www.youtu.be"}
_TIKTOK_HOSTS = {"tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com"}

_INSTAGRAM_ID_RE = re.compile(r"^/(?:reel|reels|p|tv)/([A-Za-z0-9_-]+)/?$")
_X_STATUS_RE = re.compile(r"^/[A-Za-z0-9_]+/status(?:es)?/(\d+)")
_YOUTUBE_SHORTS_RE = re.compile(r"^/(?:shorts|embed|live|v)/([A-Za-z0-9_-]+)")
_TIKTOK_VIDEO_RE = re.compile(r"^/@[^/]+/(?:video|photo)/(\d+)")


def parse_source(src: str) -> Source:
    """Parse a source string (URL or local path) into a :class:`Source`.

    Query strings are stripped before id extraction, so Instagram share
    parameters such as ``?igsh=...`` never reach the slug. Unknown hosts raise
    :class:`UnsupportedSourceError`.
    """
    src = src.strip()
    if not src:
        raise UnsupportedSourceError("empty source string")

    parsed = urlparse(src)
    if parsed.scheme in ("http", "https") and parsed.netloc:
        return _parse_url(parsed)

    # Anything without an http(s) scheme is treated as a local file path.
    path = Path(src)
    if not path.is_file():
        raise UnsupportedSourceError(f"not a supported URL and not a file: {src}")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return Source(
        kind="file",
        platform="file",
        id=digest[:12],
        url=None,
        path=str(path),
    )


def slug_for(source: Source) -> str:
    """Return the ``<platform>-<id>`` slug for a parsed source.

    The platform id is preserved verbatim because ids such as Instagram
    shortcodes are case-sensitive. See V1-findings.md for the contract-regex
    discrepancy this resolves.
    """
    return f"{source.platform}-{source.id}"


def _parse_url(parsed: ParseResult) -> Source:
    host = parsed.netloc.lower()
    path = parsed.path  # urlparse already excludes the query string.

    if host in _INSTAGRAM_HOSTS:
        m = _INSTAGRAM_ID_RE.match(path)
        if m:
            return _url_source("instagram", m.group(1), parsed)
    elif host in _X_HOSTS:
        m = _X_STATUS_RE.match(path)
        if m:
            return _url_source("x", m.group(1), parsed)
    elif host in _YOUTUBE_HOSTS:
        if path == "/watch":
            vid = parse_qs(parsed.query).get("v", [None])[0]
            if vid:
                return _url_source("youtube", vid, parsed)
        else:
            m = _YOUTUBE_SHORTS_RE.match(path)
            if m:
                return _url_source("youtube", m.group(1), parsed)
    elif host in _YOUTUBE_SHORT_HOSTS:
        m = re.match(r"^/([A-Za-z0-9_-]+)/?$", path)
        if m:
            return _url_source("youtube", m.group(1), parsed)
    elif host in _TIKTOK_HOSTS:
        m = _TIKTOK_VIDEO_RE.match(path)
        if m:
            return _url_source("tiktok", m.group(1), parsed)

    raise UnsupportedSourceError(f"unsupported source URL: {parsed.geturl()}")


def _url_source(platform: str, id_: str, parsed: ParseResult) -> Source:
    # Rebuild the URL without query string or fragment so share parameters
    # never propagate into job metadata.
    clean_url = parsed._replace(query="", fragment="").geturl()
    return Source(kind="url", platform=platform, id=id_, url=clean_url, path=None)
