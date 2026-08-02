"""Configuration and path resolution for videolab."""

from __future__ import annotations

import os
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

DEFAULT_IMAGE = "videolab-worker:latest"
DEFAULT_ASR_MODEL = "mlx-community/whisper-large-v3-turbo"


@dataclass(frozen=True)
class Config:
    """Resolved videolab runtime settings."""

    root: Path
    jobs_dir: Path
    private_jobs_dir: Path
    cookie_dir: Path
    image: str
    container_cli: str
    voice_python: Path
    asr_model: str

    @property
    def incontainer_dir(self) -> Path:
        """Return the directory containing container entrypoint scripts."""
        return self.root / "incontainer"

    @property
    def containerfile(self) -> Path:
        """Return the worker Containerfile path."""
        return self.root / "containerfiles" / "Containerfile.worker"

    def cookie_file(self, domain: str) -> Path:
        """Return the cookie file for a validated domain name."""
        if not domain or any(char not in "abcdefghijklmnopqrstuvwxyz0123456789.-" for char in domain.lower()):
            raise ValueError(f"invalid cookie domain: {domain!r}")
        if domain.startswith(".") or domain.endswith(".") or ".." in domain:
            raise ValueError(f"invalid cookie domain: {domain!r}")
        return self.cookie_dir / f"{domain.lower()}.txt"


def _default_voice_python(root: Path) -> Path:
    for parent in (root.parent, *root.parents):
        candidate = parent / ".venv-voice" / "bin" / "python"
        if candidate.exists():
            return candidate
    return Path(sys.executable)


def load_config(
    env: Mapping[str, str] | None = None,
    *,
    root: Path | None = None,
    home: Path | None = None,
) -> Config:
    """Resolve settings from explicit values, environment variables, and defaults."""
    values = os.environ if env is None else env
    default_root = Path(__file__).resolve().parents[2]
    resolved_root = Path(values.get("VIDEOLAB_ROOT", root or default_root)).expanduser().resolve()
    resolved_home = Path(values.get("VIDEOLAB_HOME", home or Path.home())).expanduser().resolve()
    jobs_dir = Path(values.get("VIDEOLAB_JOBS_DIR", resolved_root / "jobs")).expanduser().resolve()
    private_jobs_dir = Path(
        values.get("VIDEOLAB_PRIVATE_JOBS_DIR", resolved_root / "jobs-private")
    ).expanduser().resolve()
    private_jobs_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    private_jobs_dir.chmod(0o700)
    cookie_dir = Path(
        values.get("VIDEOLAB_COOKIE_DIR", resolved_home / ".config" / "videolab" / "cookies")
    ).expanduser().resolve()
    container_cli = values.get("VIDEOLAB_CONTAINER_CLI", shutil.which("container") or "container")
    voice_python = Path(
        values.get("VIDEOLAB_VOICE_PYTHON", _default_voice_python(resolved_root))
    ).expanduser()
    return Config(
        root=resolved_root,
        jobs_dir=jobs_dir,
        private_jobs_dir=private_jobs_dir,
        cookie_dir=cookie_dir,
        image=values.get("VIDEOLAB_IMAGE", DEFAULT_IMAGE),
        container_cli=container_cli,
        voice_python=voice_python,
        asr_model=values.get("VIDEOLAB_ASR_MODEL", DEFAULT_ASR_MODEL),
    )


get_config = load_config
