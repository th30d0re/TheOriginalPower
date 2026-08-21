from __future__ import annotations

from http.cookiejar import Cookie, MozillaCookieJar
from pathlib import Path

import pytest
from yt_dlp import cookies as yt_cookies

from videolab.config import Config
from videolab.cookies import refresh_cookies


def _config(tmp_path: Path) -> Config:
    return Config(
        root=tmp_path,
        jobs_dir=tmp_path / "jobs",
        private_jobs_dir=tmp_path / "jobs-private",
        cookie_dir=tmp_path / "cookies",
        image="worker",
        container_cli="container",
        voice_python=tmp_path / "python",
        asr_model="model",
    )


def _cookie(name: str) -> Cookie:
    return Cookie(
        version=0, name=name, value="test-value", port=None, port_specified=False,
        domain=".instagram.com", domain_specified=True, domain_initial_dot=True,
        path="/", path_specified=True, secure=True, expires=None, discard=False,
        comment=None, comment_url=None, rest={}, rfc2109=False,
    )


def test_refresh_uses_existing_profile_and_warns_without_session_cookies(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    profile = tmp_path / "Chrome Canary" / "Default"
    profile.mkdir(parents=True)
    source = MozillaCookieJar()
    source.set_cookie(_cookie("csrftoken"))
    calls: list[tuple[str, str | None]] = []

    def fake_extract(browser: str, profile: str | None = None) -> MozillaCookieJar:
        calls.append((browser, profile))
        return source

    monkeypatch.setattr(yt_cookies, "extract_cookies_from_browser", fake_extract)

    with pytest.warns(RuntimeWarning, match=r"sessionid.*ds_user_id"):
        destination = refresh_cookies(
            _config(tmp_path), browser="chrome", domain="instagram.com", profile=profile
        )

    assert calls == [("chrome", str(profile.resolve()))]
    assert destination.is_file()
    assert destination.stat().st_mode & 0o777 == 0o600


def test_refresh_rejects_missing_profile(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="profile path does not exist"):
        refresh_cookies(
            _config(tmp_path),
            browser="chrome",
            domain="instagram.com",
            profile=tmp_path / "missing profile",
        )
