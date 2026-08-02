from __future__ import annotations

from pathlib import Path

import json

import videolab.cli as cli
from videolab.config import Config
from videolab.containers import ContainerError


def _config(tmp_path: Path) -> Config:
    private = tmp_path / "jobs-private"
    private.mkdir()
    return Config(
        root=tmp_path,
        jobs_dir=tmp_path / "jobs",
        private_jobs_dir=private,
        cookie_dir=tmp_path / "cookies",
        image="worker",
        container_cli="container",
        voice_python=tmp_path / ".venv-voice" / "bin" / "python",
        asr_model="model",
    )


def _write_url_job(root: Path, slug: str, url: str) -> None:
    job_dir = root / slug
    job_dir.mkdir(parents=True)
    job = {
        "schema_version": 1, "slug": slug,
        "source": {"kind": "url", "platform": "instagram", "id": slug[10:],
                   "url": url, "path": None, "via": "self-dm"},
        "stages": {"fetch": {"detail": {"message_id": "invented-message",
                                           "timestamp": "2026-08-01T21:00:00Z"}}},
    }
    (job_dir / "job.json").write_text(json.dumps(job))


def test_ingest_dm_jobs_runs_full_pipeline_for_each_new_job(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    calls: list[tuple[Path, int, bool]] = []

    def fake_ingest_dms(**kwargs: object) -> list[str]:
        assert kwargs["all_threads"] is False
        return ["instagram-example-a", "instagram-example-b"]

    def fake_pipeline(
        received_config: Config, job_dir: Path, *, frames: int, ocr: bool
    ) -> None:
        assert received_config is config
        calls.append((job_dir, frames, ocr))

    monkeypatch.setattr(cli, "ingest_dms", fake_ingest_dms)  # type: ignore[attr-defined]
    monkeypatch.setattr(cli, "_run_post_fetch_pipeline", fake_pipeline)  # type: ignore[attr-defined]

    result = cli.ingest_dm_jobs(config)

    assert result == ["instagram-example-a", "instagram-example-b"]
    assert calls == [
        (config.private_jobs_dir / "instagram-example-a", 12, True),
        (config.private_jobs_dir / "instagram-example-b", 12, True),
    ]


def test_parser_exposes_dm_and_watch_commands() -> None:
    dm = cli.build_parser().parse_args(["ingest-dms", "--all-threads", "--limit", "3"])
    watch = cli.build_parser().parse_args(["watch", "install", "--interval-minutes", "8"])

    assert dm.all_threads is True and dm.limit == 3
    assert watch.watch_command == "install" and watch.interval_minutes == 8


def test_dm_url_fetch_failure_does_not_abort_batch(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    first = "instagram-FailingOne"
    second = "instagram-HealthyTwo"
    config.jobs_dir.mkdir()
    _write_url_job(config.jobs_dir, first, "https://instagram.com/reel/FailingOne/")
    _write_url_job(config.jobs_dir, second, "https://instagram.com/reel/HealthyTwo/")
    monkeypatch.setattr(cli, "ingest_dms", lambda **_kwargs: [first, second])
    fetched: list[str] = []

    def fake_fetch(*args: object, **_kwargs: object) -> dict[str, object]:
        slug = Path(args[1]).name
        fetched.append(slug)
        if slug == first:
            raise ContainerError("login required")
        return {"ok": True, "video": "media/video.mp4"}

    pipelined: list[str] = []
    monkeypatch.setattr(cli, "run_fetch", fake_fetch)
    monkeypatch.setattr(
        cli, "_run_post_fetch_pipeline",
        lambda _config, job_dir, **_kwargs: pipelined.append(job_dir.name),
    )
    result = cli.ingest_dm_jobs(config)

    assert result == [first, second]
    assert fetched == [first, second]
    assert pipelined == [second]
    failed = json.loads((config.jobs_dir / first / "job.json").read_text())
    assert failed["stages"]["fetch"]["status"] == "error"
    assert "videolab cookies refresh --browser safari --domain instagram.com" in failed["stages"]["fetch"]["error"]
    assert "Full Disk Access" in failed["stages"]["fetch"]["error"]
