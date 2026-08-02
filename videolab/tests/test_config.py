from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from videolab.config import DEFAULT_ASR_MODEL, DEFAULT_IMAGE, load_config


def test_defaults_are_rooted_in_videolab_and_home(tmp_path: Path) -> None:
    root = tmp_path / "videolab"
    home = tmp_path / "home"
    config = load_config({}, root=root, home=home)
    assert config.root == root.resolve()
    assert config.jobs_dir == (root / "jobs").resolve()
    assert config.private_jobs_dir == (root / "jobs-private").resolve()
    assert config.private_jobs_dir.stat().st_mode & 0o777 == 0o700
    assert config.cookie_dir == (home / ".config/videolab/cookies").resolve()
    assert config.image == DEFAULT_IMAGE
    assert config.asr_model == DEFAULT_ASR_MODEL


def test_environment_overrides_paths_and_runtime(tmp_path: Path) -> None:
    env = {
        "VIDEOLAB_ROOT": str(tmp_path / "root"),
        "VIDEOLAB_JOBS_DIR": str(tmp_path / "jobs"),
        "VIDEOLAB_PRIVATE_JOBS_DIR": str(tmp_path / "private"),
        "VIDEOLAB_COOKIE_DIR": str(tmp_path / "secrets"),
        "VIDEOLAB_IMAGE": "worker:test",
        "VIDEOLAB_CONTAINER_CLI": "/opt/container",
        "VIDEOLAB_VOICE_PYTHON": "/opt/voice/python",
        "VIDEOLAB_ASR_MODEL": "model/test",
    }
    config = load_config(env, home=tmp_path)
    assert config.root == (tmp_path / "root").resolve()
    assert config.jobs_dir == (tmp_path / "jobs").resolve()
    assert config.private_jobs_dir == (tmp_path / "private").resolve()
    assert config.cookie_dir == (tmp_path / "secrets").resolve()
    assert config.image == "worker:test"
    assert config.container_cli == "/opt/container"
    assert config.voice_python == Path("/opt/voice/python")
    assert config.asr_model == "model/test"


@pytest.mark.parametrize("domain", ["../cookies", "instagram.com/evil", ".instagram.com", "instagram..com"])
def test_cookie_file_rejects_unsafe_domains(tmp_path: Path, domain: str) -> None:
    config = load_config({}, root=tmp_path / "videolab", home=tmp_path)
    with pytest.raises(ValueError):
        config.cookie_file(domain)


def test_cookie_file_is_outside_project_by_default(tmp_path: Path) -> None:
    root = tmp_path / "videolab"
    config = load_config({}, root=root, home=tmp_path / "home")
    assert not config.cookie_file("instagram.com").is_relative_to(root)
