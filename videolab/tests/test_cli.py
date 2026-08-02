from __future__ import annotations

from pathlib import Path

import videolab.cli as cli
from videolab.config import Config


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
