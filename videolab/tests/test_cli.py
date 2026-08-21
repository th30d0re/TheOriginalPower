from __future__ import annotations

from pathlib import Path

import json

import videolab.cli as cli
from videolab.config import Config
from videolab.containers import ContainerError
from videolab.instagram import IngestBatch


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


def _ingest_batch(cursor: Path, slug: str, message_id: str = "opaque-message") -> IngestBatch:
    batch = IngestBatch(cursor_path=cursor)
    batch.append(slug)
    batch.message_ids.append((slug, message_id))
    return batch


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


def test_ingest_dm_jobs_does_not_run_pipeline_for_terminal_media(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    slug = "instagram-image"
    job_dir = config.private_jobs_dir / slug
    job_dir.mkdir()
    (job_dir / "job.json").write_text(json.dumps({
        "source": {"kind": "dm"},
        "stages": {"derive": {"status": "skipped", "detail": {"reason": "not_video: image/jpeg"}}},
    }))
    monkeypatch.setattr(cli, "ingest_dms", lambda **_kwargs: [slug])
    monkeypatch.setattr(
        cli,
        "_run_post_fetch_pipeline",
        lambda *_args, **_kwargs: (_ for _ in ()).throw(AssertionError("pipeline ran")),
    )

    result = cli.ingest_dm_jobs(config)

    assert result.succeeded == [slug]


def test_parser_exposes_dm_and_watch_commands() -> None:
    dm = cli.build_parser().parse_args(["ingest-dms", "--all-threads", "--limit", "3"])
    watch = cli.build_parser().parse_args(["watch", "install", "--interval-minutes", "8"])

    assert dm.all_threads is True and dm.limit == 3
    assert watch.watch_command == "install" and watch.interval_minutes == 8


def test_cookies_refresh_threads_profile_from_cli(
    tmp_path: Path, monkeypatch: object, capsys: object
) -> None:
    profile = tmp_path / "Chrome Canary" / "Default"
    profile.mkdir(parents=True)
    captured: dict[str, object] = {}

    def fake_refresh(config: Config, **kwargs: object) -> Path:
        captured.update(kwargs)
        destination = tmp_path / "cookies" / "instagram.com.txt"
        destination.parent.mkdir()
        destination.write_text("cookie jar")
        return destination

    monkeypatch.setattr(cli, "load_config", lambda: _config(tmp_path))
    monkeypatch.setattr(cli, "refresh_cookies", fake_refresh)

    assert cli.main([
        "cookies", "refresh", "--browser", "chrome", "--profile", str(profile),
        "--domain", "instagram.com",
    ]) == 0
    assert captured == {
        "browser": "chrome", "profile": profile, "domain": "instagram.com"
    }
    assert json.loads(capsys.readouterr().out)["ok"] is True


def test_doctor_rejects_login_required_from_authenticated_probe(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    monkeypatch.setattr(cli, "_check", lambda _command: (True, "ready"))

    def fake_run_lines(command: object) -> tuple[bool, list[str]]:
        assert command == ["instagram-cli", "inbox", "--limit", "1"]
        return True, ["HTTP 403", "login_required"]

    monkeypatch.setattr(cli, "_run_lines", fake_run_lines)

    auth = cli.doctor(config)["instagram_auth"]

    assert auth["ok"] is False
    assert "403" in auth["detail"] or "login_required" in auth["detail"]
    assert "instagram-cli auth login" in auth["detail"]


def test_doctor_preserves_account_detail_after_live_probe(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    monkeypatch.setattr(cli, "_check", lambda _command: (True, "ready"))
    monkeypatch.setattr(
        cli,
        "_run_lines",
        lambda _command: (True, ["Currently active account: @sample_owner"]),
    )

    assert cli.doctor(config)["instagram_auth"] == {
        "ok": True,
        "detail": "Currently active account: @sample_owner",
    }


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


def test_xpc_fetch_failure_stays_unseen_and_reports_retrying(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    config.jobs_dir.mkdir()
    slug = "instagram-TransientCase"
    cursor = tmp_path / "cursor.json"
    _write_url_job(config.jobs_dir, slug, "https://instagram.com/reel/TransientCase/")
    monkeypatch.setattr(cli, "ingest_dms", lambda **_kwargs: _ingest_batch(cursor, slug))
    monkeypatch.setattr(
        cli, "run_fetch", lambda *_args, **_kwargs: (_ for _ in ()).throw(
            ContainerError('interrupted: "XPC connection error: Connection invalid"')
        )
    )

    result = cli.ingest_dm_jobs(config)

    state = json.loads(cursor.read_text())
    assert "opaque-message" not in state["seen_message_ids"]
    assert result.retrying == [slug]
    assert result.failed == []
    error = json.loads((config.jobs_dir / slug / "job.json").read_text())["stages"]["fetch"]["error"]
    assert error.startswith('interrupted: "XPC connection error')
    assert "cookies refresh" not in error


def test_unsupported_url_marks_message_seen_and_reports_failed(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    config.jobs_dir.mkdir()
    slug = "instagram-PermanentCase"
    cursor = tmp_path / "cursor.json"
    _write_url_job(config.jobs_dir, slug, "https://instagram.com/reel/PermanentCase/")
    monkeypatch.setattr(cli, "ingest_dms", lambda **_kwargs: _ingest_batch(cursor, slug))
    monkeypatch.setattr(
        cli, "run_fetch", lambda *_args, **_kwargs: (_ for _ in ()).throw(
            ContainerError("Unsupported URL")
        )
    )

    result = cli.ingest_dm_jobs(config)

    state = json.loads(cursor.read_text())
    assert state["seen_message_ids"] == ["opaque-message"]
    assert result.failed == [slug]
    assert result.retrying == []


def test_transient_message_is_abandoned_on_fifth_attempt(
    tmp_path: Path, monkeypatch: object
) -> None:
    config = _config(tmp_path)
    config.jobs_dir.mkdir()
    slug = "instagram-RetryLimit"
    cursor = tmp_path / "cursor.json"
    _write_url_job(config.jobs_dir, slug, "https://instagram.com/reel/RetryLimit/")
    monkeypatch.setattr(cli, "ingest_dms", lambda **_kwargs: _ingest_batch(cursor, slug))
    monkeypatch.setattr(
        cli, "run_fetch", lambda *_args, **_kwargs: (_ for _ in ()).throw(
            ContainerError("temporary DNS failure")
        )
    )

    results = [cli.ingest_dm_jobs(config) for _ in range(5)]

    assert all(item.retrying == [slug] for item in results[:4])
    assert results[4].retrying == []
    assert results[4].failed == [slug]
    state = json.loads(cursor.read_text())
    assert state["attempts"] == {"opaque-message": 5}
    assert state["seen_message_ids"] == ["opaque-message"]
    assert state["abandoned_message_ids"] == ["opaque-message"]


def test_fetch_error_hints_follow_reported_evidence() -> None:
    container_error = cli.format_fetch_error(
        "instagram", 'interrupted: "XPC connection error: Connection invalid"'
    )
    auth_error = cli.format_fetch_error("instagram", "login required")

    assert container_error.startswith("interrupted:")
    assert "cookies refresh" not in container_error
    assert auth_error.startswith("login required")
    assert "videolab cookies refresh" in auth_error


def test_ingest_command_outputs_retrying_group(
    tmp_path: Path, monkeypatch: object, capsys: object
) -> None:
    result = cli.DMIngestResult(["instagram-Retrying"])
    result.retrying.append("instagram-Retrying")
    monkeypatch.setattr(cli, "load_config", lambda: _config(tmp_path))
    monkeypatch.setattr(cli, "ingest_dm_jobs", lambda *_args, **_kwargs: result)

    assert cli.main(["ingest-dms"]) == 0

    output = json.loads(capsys.readouterr().out)
    assert output["retrying"] == ["instagram-Retrying"]
    assert output["failed"] == []
    assert output["ok"] is False
