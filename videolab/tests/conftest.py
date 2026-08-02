"""Shared fixtures: make src/ and incontainer/ importable, provide a sample job."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

import pytest

TESTS_DIR = Path(__file__).resolve().parent
VIDEOLAB_DIR = TESTS_DIR.parent

sys.path.insert(0, str(VIDEOLAB_DIR / "src"))
sys.path.insert(0, str(VIDEOLAB_DIR / "incontainer"))

FIXTURES_DIR = TESTS_DIR / "fixtures"


@pytest.fixture
def sample_job(tmp_path: Path) -> Path:
    """A hand-built instagram job directory copied into tmp space."""
    dst = tmp_path / "instagram-DZtCPIRPT87"
    shutil.copytree(FIXTURES_DIR / "sample_job", dst)
    return dst
