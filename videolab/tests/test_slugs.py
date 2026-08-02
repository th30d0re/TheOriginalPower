"""Tests for videolab.slugs (CONTRACT §3)."""

from __future__ import annotations

import hashlib

import pytest

from videolab.slugs import Source, UnsupportedSourceError, parse_source, slug_for


def test_instagram_reel_strips_igsh_query() -> None:
    src = parse_source("https://www.instagram.com/reel/DZtCPIRPT87/?igsh=MWxtdncxeTg4YjRhOQ==")
    assert src.kind == "url"
    assert src.platform == "instagram"
    assert src.id == "DZtCPIRPT87"
    assert "igsh" not in (src.url or "")
    assert "?" not in (src.url or "")


def test_instagram_p_and_tv_links() -> None:
    assert parse_source("https://www.instagram.com/p/Cabc123_def/").id == "Cabc123_def"
    assert parse_source("https://www.instagram.com/tv/Cabc123/").platform == "instagram"


def test_x_and_twitter_status() -> None:
    for url in (
        "https://x.com/someuser/status/1878451234567890123",
        "https://twitter.com/someuser/status/1878451234567890123?s=20",
        "https://mobile.twitter.com/u/status/1878451234567890123",
    ):
        src = parse_source(url)
        assert src.platform == "x"
        assert src.id == "1878451234567890123"


def test_youtube_variants() -> None:
    src = parse_source("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=42s")
    assert src.platform == "youtube"
    assert src.id == "aqz-KE-bpKQ"
    assert parse_source("https://youtu.be/aqz-KE-bpKQ?si=xyz").id == "aqz-KE-bpKQ"
    assert parse_source("https://www.youtube.com/shorts/aqz-KE-bpKQ").id == "aqz-KE-bpKQ"


def test_tiktok_video() -> None:
    src = parse_source("https://www.tiktok.com/@someuser/video/7312345678901234567")
    assert src.platform == "tiktok"
    assert src.id == "7312345678901234567"


def test_unknown_host_raises() -> None:
    with pytest.raises(UnsupportedSourceError):
        parse_source("https://vimeo.com/12345")
    with pytest.raises(UnsupportedSourceError):
        parse_source("https://www.instagram.com/explore/")


def test_local_file_hashes_sha256(tmp_path) -> None:
    clip = tmp_path / "clip.mp4"
    clip.write_bytes(b"fake video bytes for hashing")
    src = parse_source(str(clip))
    assert src.kind == "file"
    assert src.platform == "file"
    assert src.id == hashlib.sha256(b"fake video bytes for hashing").hexdigest()[:12]
    assert src.path == str(clip)
    assert src.url is None


def test_missing_path_raises() -> None:
    with pytest.raises(UnsupportedSourceError):
        parse_source("/definitely/not/a/real/file.mp4")


def test_slug_format_and_determinism() -> None:
    src = parse_source("https://www.instagram.com/reel/DZtCPIRPT87/?igsh=abc")
    assert slug_for(src) == "instagram-DZtCPIRPT87"
    assert slug_for(src) == slug_for(parse_source("https://www.instagram.com/reel/DZtCPIRPT87/"))


def test_slug_for_dm_source() -> None:
    dm = Source(kind="dm", platform="instagram", id="thread123", url=None, path=None)
    assert slug_for(dm) == "instagram-thread123"
