from __future__ import annotations

import plistlib
import subprocess
from pathlib import Path
from typing import Any

from videolab.config import Config
from videolab.watch import build_watch_plist, install_watch, uninstall_watch, watch_status


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


def test_generated_plist_has_expected_safe_schedule(tmp_path: Path) -> None:
    document = build_watch_plist(_config(tmp_path), interval_minutes=23)

    assert document["StartInterval"] == 23 * 60
    assert document["RunAtLoad"] is False
    arguments = document["ProgramArguments"]
    assert arguments[-3:] == ["-m", "videolab", "ingest-dms"]
    assert "--all-threads" not in arguments
    assert "--mark-seen" not in arguments
    assert document["EnvironmentVariables"]["PYTHONPATH"].endswith("videolab/src")


def test_install_writes_plist_and_bootstraps(tmp_path: Path) -> None:
    config = _config(tmp_path)
    home = tmp_path / "home"
    launchctl = LaunchctlStub()

    result = install_watch(config, 9, home=home, runner=launchctl)

    path = Path(result["plist"])
    document = plistlib.loads(path.read_bytes())
    assert document["StartInterval"] == 540
    assert launchctl.calls[0][1] == "bootstrap"
    assert (config.root / "logs").is_dir()


def test_status_and_uninstall_are_clean_when_not_installed(tmp_path: Path) -> None:
    config = _config(tmp_path)
    home = tmp_path / "home"
    launchctl = LaunchctlStub()

    assert watch_status(config, home=home, runner=launchctl)["loaded"] is False
    assert uninstall_watch(home=home, runner=launchctl)["removed"] is False
    assert launchctl.calls == []
