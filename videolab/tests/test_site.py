"""Tests for the self-contained videolab job viewer."""

from __future__ import annotations

import base64
import json
import re
from io import BytesIO
from pathlib import Path

from PIL import Image

from videolab.cli import build_parser, main
from videolab.config import load_config
from videolab.site import build_site


def _write_job(
    root: Path,
    slug: str,
    *,
    creator: str = "Ada Example",
    likes: int | None = 12,
    views: int | None = None,
    source_url: str = "https://example.test/video/1",
    created_at: str = "2026-08-02T12:00:00Z",
) -> Path:
    job_dir = root / slug
    frames_dir = job_dir / "media" / "frames"
    frames_dir.mkdir(parents=True)
    job = {
        "slug": slug,
        "created_at": created_at,
        "source": {"platform": "youtube", "url": source_url},
        "stages": {
            "fetch": {"status": "ok", "error": None},
            "derive": {"status": "ok", "error": None},
            "asr": {"status": "ok", "error": None},
            "report": {"status": "ok", "error": None},
        },
    }
    metadata = {
        "slug": slug,
        "url": source_url,
        "platform": "youtube",
        "creator": {"display_name": creator, "username": "invented_creator"},
        "content": {"duration_seconds": 62},
        "engagement": {
            "likes": likes,
            "comments_count": 0,
            "play_count": None,
            "views": views,
        },
        "metadata": {"posted_at_iso": "2026-08-01T10:00:00Z"},
        "content_analysis": {
            "primary_theme": None,
            "secondary_themes": [],
            "rhetorical_frame": None,
            "key_moments": [],
        },
        "framework_notes": {},
        "tier_classification": {
            "transcript": "Tier 2",
            "content_interpretation": "Tier 3",
            "justification": "Machine extraction with human interpretation.",
        },
    }
    (job_dir / "job.json").write_text(json.dumps(job), encoding="utf-8")
    (job_dir / f"{slug}_metadata.json").write_text(json.dumps(metadata), encoding="utf-8")
    (job_dir / "transcript.json").write_text(
        json.dumps({"segments": [{"start": 3, "end": 5, "text": "Invented transcript."}]}),
        encoding="utf-8",
    )
    (job_dir / "ocr.jsonl").write_text(
        "\n".join(
            [
                json.dumps({"t_seconds": 3, "text": "Visible words", "mean_conf": 88.5, "kept": True}),
                json.dumps({"t_seconds": 4, "text": "Repeated words", "mean_conf": 82, "kept": False}),
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    Image.new("RGB", (1000, 500), (30, 60, 90)).save(frames_dir / "frame_0001.png")
    (job_dir / "frames.json").write_text(
        json.dumps(
            {
                "frames": [
                    {
                        "index": 1,
                        "file": "media/frames/frame_0001.png",
                        "t_seconds": 3,
                        "selected_by": "scene",
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    return job_dir


def _config(tmp_path: Path):
    root = tmp_path / "videolab"
    jobs = root / "jobs"
    private = root / "jobs-private"
    jobs.mkdir(parents=True)
    return load_config(
        {
            "VIDEOLAB_ROOT": str(root),
            "VIDEOLAB_JOBS_DIR": str(jobs),
            "VIDEOLAB_PRIVATE_JOBS_DIR": str(private),
        },
        home=tmp_path,
    )


def test_build_site_is_self_contained_and_resizes_frames(tmp_path: Path) -> None:
    config = _config(tmp_path)
    _write_job(config.jobs_dir, "youtube-new")

    output = build_site(config)
    rendered = output.read_text(encoding="utf-8")

    without_anchor_urls = re.sub(r'href="https?://[^"]+"', "", rendered)
    assert "http://" not in without_anchor_urls
    assert "https://" not in without_anchor_urls
    assert "<link" not in rendered
    assert "<script src=" not in rendered
    match = re.search(r'src="data:image/jpeg;base64,([^"]+)"', rendered)
    assert match
    with Image.open(BytesIO(base64.b64decode(match.group(1)))) as embedded:
        assert embedded.width == 640
        assert embedded.format == "JPEG"


def test_untrusted_values_are_escaped_and_unsafe_urls_are_rejected(tmp_path: Path) -> None:
    config = _config(tmp_path)
    payload = "<script>alert(1)</script>"
    _write_job(config.jobs_dir, "youtube-hostile", creator=payload, source_url="javascript:alert(2)")

    rendered = build_site(config).read_text(encoding="utf-8")

    assert payload not in rendered
    assert "&lt;script&gt;alert(1)&lt;/script&gt;" in rendered
    assert "javascript:" not in rendered
    assert "innerHTML" not in rendered


def test_missing_metric_differs_from_genuine_zero(tmp_path: Path) -> None:
    config = _config(tmp_path)
    _write_job(config.jobs_dir, "youtube-metrics", likes=None, views=0)

    rendered = build_site(config).read_text(encoding="utf-8")

    assert re.search(r"<dt>Likes</dt><dd>—</dd>", rendered)
    assert re.search(r"<dt>Views</dt><dd>0</dd>", rendered)
    assert re.search(r"<dt>Comments</dt><dd>0</dd>", rendered)


def test_private_jobs_require_explicit_flag(tmp_path: Path) -> None:
    config = _config(tmp_path)
    _write_job(config.jobs_dir, "youtube-public")
    _write_job(config.private_jobs_dir, "youtube-private")

    public = build_site(config, tmp_path / "public.html").read_text(encoding="utf-8")
    combined = build_site(
        config, tmp_path / "combined.html", include_private=True
    ).read_text(encoding="utf-8")

    assert "youtube-public" in public
    assert "youtube-private" not in public
    assert "youtube-private" in combined
    assert "Private job" in combined


def test_jobs_are_newest_first_and_ocr_dedupe_is_explicit(tmp_path: Path) -> None:
    config = _config(tmp_path)
    _write_job(config.jobs_dir, "youtube-older", created_at="2026-08-01T12:00:00Z")
    _write_job(config.jobs_dir, "youtube-newer", created_at="2026-08-02T12:00:00Z")

    rendered = build_site(config).read_text(encoding="utf-8")

    assert rendered.index("youtube-newer") < rendered.index("youtube-older")
    assert "1 of 2 frames kept after dedupe" in rendered
    assert "Visible words" in rendered
    assert "Repeated words" not in rendered


def test_cli_site_build_parser_and_dispatch(tmp_path: Path, monkeypatch, capsys) -> None:
    args = build_parser().parse_args(["site", "build", "--include-private", "--out", "viewer.html"])
    assert args.command == "site"
    assert args.site_command == "build"
    assert args.include_private is True
    assert args.out == Path("viewer.html")

    config = _config(tmp_path)
    _write_job(config.jobs_dir, "youtube-cli")
    output = tmp_path / "viewer.html"
    monkeypatch.setattr("videolab.cli.load_config", lambda: config)

    assert main(["site", "build", "--out", str(output)]) == 0
    assert json.loads(capsys.readouterr().out) == {"ok": True, "file": str(output)}
    assert output.is_file()
