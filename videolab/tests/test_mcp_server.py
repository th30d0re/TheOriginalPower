from __future__ import annotations

import json
from pathlib import Path

import pytest

import videolab.mcp_server as server


def _roots(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> tuple[Path, Path]:
    public = tmp_path / "jobs"
    private = tmp_path / "jobs-private"
    public.mkdir()
    private.mkdir()
    monkeypatch.setattr(server, "_jobs_root", lambda: public)
    monkeypatch.setattr(server, "_private_jobs_root", lambda: private)
    return public, private


def test_list_jobs_includes_both_roots_with_privacy_marker(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    public, private = _roots(tmp_path, monkeypatch)
    for root, slug in ((public, "file-example"), (private, "instagram-example")):
        job = root / slug
        job.mkdir()
        (job / "job.json").write_text(json.dumps({"slug": slug}), encoding="utf-8")
    assert [(row["slug"], row["private"]) for row in server.videolab_list_jobs()] == [
        ("file-example", False),
        ("instagram-example", True),
    ]


@pytest.mark.parametrize("root_name", ["jobs", "jobs-private"])
def test_job_dir_resolves_each_root(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, root_name: str
) -> None:
    public, private = _roots(tmp_path, monkeypatch)
    root = public if root_name == "jobs" else private
    job = root / "file-example"
    job.mkdir()
    assert server._job_dir("file-example") == job.resolve()


@pytest.mark.parametrize("root_name", ["jobs", "jobs-private"])
def test_job_dir_rejects_symlink_escape_from_each_root(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, root_name: str
) -> None:
    public, private = _roots(tmp_path, monkeypatch)
    outside = tmp_path / "outside"
    outside.mkdir()
    root = public if root_name == "jobs" else private
    (root / "file-escape").symlink_to(outside, target_is_directory=True)
    with pytest.raises(ValueError, match="outside the jobs directory"):
        server._job_dir("file-escape")
