from __future__ import annotations

import json
import plistlib
import subprocess
from pathlib import Path
from typing import Any

from videolab.config import Config
from videolab.speech import (
    HEALTH_URL,
    build_speech_plist,
    install_speech,
    speech_status,
    uninstall_speech,
)


def _config(tmp_path: Path) -> Config:
    root = tmp_path / "repo" / "videolab"
    private = root / "jobs-private"
    private.mkdir(parents=True)
    return Config(
        root=root,
        jobs_dir=root / "jobs",
        private_jobs_dir=private,
        cookie_dir=tmp_path / "cookies",
        image="worker",
        container_cli="container",
        voice_python=tmp_path / "repo" / ".venv-voice" / "bin" / "python",
        asr_model="model",
    )


class LaunchctlStub:
    def __init__(self, returncode: int = 0) -> None:
        self.returncode = returncode
        self.calls: list[list[str]] = []

    def __call__(self, argv: Any) -> subprocess.CompletedProcess[str]:
        args = list(argv)
        self.calls.append(args)
        return subprocess.CompletedProcess(args, self.returncode, "", "")


class ResponseStub:
    def __init__(self, payload: dict[str, Any]) -> None:
        self.payload = payload

    def __enter__(self) -> ResponseStub:
        return self

    def __exit__(self, *_args: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.payload).encode()


def test_speech_plist_is_keepalive_daemon_with_absolute_paths(tmp_path: Path) -> None:
    config = _config(tmp_path)
    source = config.root / "siri-speech" / "Sources" / "main.swift"
    source.parent.mkdir(parents=True)
    source.write_text("print(\"ready\")", encoding="utf-8")
    developer_dir = tmp_path / "Xcode.app" / "Contents" / "Developer"
    developer_dir.mkdir(parents=True)
    staged = (
        tmp_path
        / "home"
        / "Library"
        / "Application Support"
        / "videolab"
        / "main.swift"
    )
    staged.parent.mkdir(parents=True)
    staged.write_text(source.read_text(encoding="utf-8"), encoding="utf-8")

    document = build_speech_plist(config, developer_dir, staged)

    assert document["RunAtLoad"] is True
    assert document["KeepAlive"] is True
    assert "StartInterval" not in document
    assert document["ProgramArguments"] == [
        "/usr/bin/swift",
        str(staged.resolve()),
    ]
    assert document["EnvironmentVariables"] == {
        "DEVELOPER_DIR": str(developer_dir.resolve())
    }
    assert document["StandardOutPath"] == str(
        (config.root / "logs" / "speech.out.log").resolve()
    )
    assert document["StandardErrorPath"] == str(
        (config.root / "logs" / "speech.err.log").resolve()
    )


def test_install_writes_interpreter_agent_and_bootstraps_temp_agent(tmp_path: Path) -> None:
    config = _config(tmp_path)
    home = tmp_path / "home"
    launchctl = LaunchctlStub()
    source = config.root / "siri-speech" / "Sources" / "main.swift"
    source.parent.mkdir(parents=True)
    source.write_text("print(\"ready\")", encoding="utf-8")
    developer_dir = tmp_path / "Xcode.app" / "Contents" / "Developer"
    developer_dir.mkdir(parents=True)
    staged_before_install = (
        home / "Library" / "Application Support" / "videolab" / "main.swift"
    )
    staged_before_install.parent.mkdir(parents=True)
    staged_before_install.write_text("outdated", encoding="utf-8")

    def selected_developer_dir(argv: Any) -> subprocess.CompletedProcess[str]:
        assert list(argv) == ["/usr/bin/xcode-select", "-p"]
        return subprocess.CompletedProcess(
            list(argv), 0, f"{developer_dir}\n", ""
        )

    result = install_speech(
        config,
        home=home,
        runner=launchctl,
        developer_runner=selected_developer_dir,
    )

    document = plistlib.loads(Path(result["plist"]).read_bytes())
    staged = Path(result["staged_source"])
    assert result["source"] == str(source.resolve())
    assert staged.read_text(encoding="utf-8") == source.read_text(encoding="utf-8")
    assert config.root.resolve() not in staged.resolve().parents
    assert document["ProgramArguments"] == ["/usr/bin/swift", str(staged)]
    assert document["EnvironmentVariables"]["DEVELOPER_DIR"] == str(
        developer_dir.resolve()
    )
    assert launchctl.calls[0][1] == "bootstrap"


def test_install_unloads_existing_temp_agent_before_replacing_it(
    tmp_path: Path,
) -> None:
    config = _config(tmp_path)
    home = tmp_path / "home"
    source = config.root / "siri-speech" / "Sources" / "main.swift"
    source.parent.mkdir(parents=True)
    source.write_text("print(\"ready\")", encoding="utf-8")
    developer_dir = tmp_path / "Xcode.app" / "Contents" / "Developer"
    developer_dir.mkdir(parents=True)
    path = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    path.parent.mkdir(parents=True)
    path.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))
    launchctl = LaunchctlStub()

    install_speech(
        config,
        home=home,
        runner=launchctl,
        developer_runner=lambda argv: subprocess.CompletedProcess(
            list(argv), 0, f"{developer_dir}\n", ""
        ),
    )

    assert launchctl.calls[0][:2] == ["launchctl", "bootout"]
    assert launchctl.calls[1][:2] == ["launchctl", "bootstrap"]


def test_status_is_not_ok_when_installed_helper_is_unreachable(tmp_path: Path) -> None:
    home = tmp_path / "home"
    path = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    path.parent.mkdir(parents=True)
    path.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))

    def refused(url: str, *, timeout: float) -> Any:
        assert url == HEALTH_URL
        assert timeout <= 1.0
        raise ConnectionRefusedError("connection refused")

    status = speech_status(home=home, runner=LaunchctlStub(), opener=refused)

    assert status["installed"] is True
    assert status["loaded"] is True
    assert status["ok"] is False
    assert status["health"]["ok"] is False
    assert "connection refused" in status["health"]["detail"]


def test_status_reports_parsed_health_payload(tmp_path: Path) -> None:
    home = tmp_path / "home"
    path = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    path.parent.mkdir(parents=True)
    path.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))
    payload = {
        "ok": True,
        "voice": "Voice 2",
        "identifier": "com.apple.siri.natural.Simone",
        "available": True,
    }

    status = speech_status(
        home=home,
        runner=LaunchctlStub(),
        opener=lambda *_args, **_kwargs: ResponseStub(payload),
    )

    assert status["ok"] is True
    assert status["health"] == payload


def test_status_reports_staged_source_content_drift(tmp_path: Path) -> None:
    config = _config(tmp_path)
    home = tmp_path / "home"
    source = config.root / "siri-speech" / "Sources" / "main.swift"
    source.parent.mkdir(parents=True)
    source.write_text("current", encoding="utf-8")
    staged = home / "Library" / "Application Support" / "videolab" / "main.swift"
    staged.parent.mkdir(parents=True)
    staged.write_text("old", encoding="utf-8")
    plist = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    plist.parent.mkdir(parents=True)
    plist.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))
    payload = {"ok": True, "available": True}

    status = speech_status(
        config,
        home=home,
        runner=LaunchctlStub(),
        opener=lambda *_args, **_kwargs: ResponseStub(payload),
    )
    assert status["ok"] is True
    assert status["stale_source"] is True
    assert "videolab speech install" in status["stale_source_remedy"]


def test_status_is_not_ok_and_surfaces_reason_when_voice_is_unavailable(
    tmp_path: Path,
) -> None:
    home = tmp_path / "home"
    path = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    path.parent.mkdir(parents=True)
    path.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))
    payload = {
        "ok": True,
        "available": False,
        "reason": "Siri Voice 2 is not visible to this process.",
    }

    status = speech_status(
        home=home,
        runner=LaunchctlStub(),
        opener=lambda *_args, **_kwargs: ResponseStub(payload),
    )

    assert status["installed"] is True
    assert status["loaded"] is True
    assert status["health"] == payload
    assert status["ok"] is False
    assert status["detail"] == payload["reason"]


def test_uninstall_removes_plist_and_staged_source(tmp_path: Path) -> None:
    home = tmp_path / "home"
    plist = home / "Library" / "LaunchAgents" / "com.videolab.speech.plist"
    plist.parent.mkdir(parents=True)
    plist.write_bytes(plistlib.dumps({"Label": "com.videolab.speech"}))
    staged = home / "Library" / "Application Support" / "videolab" / "main.swift"
    staged.parent.mkdir(parents=True)
    staged.write_text("deployed", encoding="utf-8")
    launchctl = LaunchctlStub()

    result = uninstall_speech(home=home, runner=launchctl)

    assert result["removed"] is True
    assert not plist.exists()
    assert not staged.exists()
    assert launchctl.calls[0][:2] == ["launchctl", "bootout"]
