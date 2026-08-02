"""Tests for videolab.report (CONTRACT §§8, 9, 10)."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from videolab.report import (
    METADATA_KEY_ORDER,
    build_metadata,
    extract_hashtags,
    format_mmss,
    render_bundle,
    render_markdown,
    write_report,
)


def _write_long_description_job(sample_job: Path, length: int) -> str:
    info_path = sample_job / "source.info.json"
    info = json.loads(info_path.read_text())
    body = "lorem ipsum dolor sit amet "
    description = (body * (length // len(body) + 1))[: length - 20] + " #finaltag #lastone"
    info["description"] = description
    info_path.write_text(json.dumps(info))
    return description


# ---------------------------------------------------------------------------
# §8 — metadata JSON.
# ---------------------------------------------------------------------------


def test_metadata_top_level_key_order(sample_job: Path) -> None:
    write_report(sample_job)
    metadata = json.loads((sample_job / "instagram-DZtCPIRPT87_metadata.json").read_text())
    expected = METADATA_KEY_ORDER[:4] + ["reel_id"] + METADATA_KEY_ORDER[4:]
    assert list(metadata.keys()) == expected


def test_reel_id_only_for_instagram(sample_job: Path) -> None:
    metadata = build_metadata(sample_job)
    assert metadata["reel_id"] == "DZtCPIRPT87"
    assert metadata["reel_id"] == metadata["id"]

    job = json.loads((sample_job / "job.json").read_text())
    job["source"]["platform"] = "youtube"
    (sample_job / "job.json").write_text(json.dumps(job))
    assert "reel_id" not in build_metadata(sample_job)


def test_missing_view_count_is_null_never_zero(sample_job: Path) -> None:
    # The fixture source.info.json deliberately omits play_count / view_count.
    metadata = build_metadata(sample_job)
    engagement = metadata["engagement"]
    assert engagement["play_count"] is None
    assert engagement["views"] is None
    assert engagement["likes"] == 1234
    assert engagement["comments_count"] == 56
    # The apology note explained a bug that no longer exists.
    assert "note" not in engagement


def test_present_zero_is_a_real_value(sample_job: Path) -> None:
    info_path = sample_job / "source.info.json"
    info = json.loads(info_path.read_text())
    info["view_count"] = 0
    info_path.write_text(json.dumps(info))
    assert build_metadata(sample_job)["engagement"]["views"] == 0


def test_long_description_round_trips_intact(sample_job: Path) -> None:
    description = _write_long_description_job(sample_job, 5000)
    write_report(sample_job)
    metadata = json.loads((sample_job / "instagram-DZtCPIRPT87_metadata.json").read_text())
    assert metadata["content"]["description"] == description
    assert not metadata["content"]["description"].endswith("...")
    # Hashtags derive from the complete string, including the tail.
    hashtags = metadata["content_analysis"]["hashtags"]
    assert "#finaltag" in hashtags
    assert "#lastone" in hashtags


def test_hashtag_extraction() -> None:
    assert extract_hashtags("text #misandryisreal #stophatingmen #men #equality") == [
        "#misandryisreal",
        "#stophatingmen",
        "#men",
        "#equality",
    ]
    assert extract_hashtags(None) == []
    assert extract_hashtags("no tags here") == []


def test_empty_scaffolds_stay_empty(sample_job: Path) -> None:
    metadata = build_metadata(sample_job)
    analysis = metadata["content_analysis"]
    assert analysis["primary_theme"] is None
    assert analysis["secondary_themes"] == []
    assert analysis["rhetorical_frame"] is None
    assert analysis["notable_speakers"] == []
    assert analysis["key_moments"] == []
    assert metadata["framework_notes"] == {}


def test_tier_classification_mechanical_prefill(sample_job: Path) -> None:
    tiers = build_metadata(sample_job)["tier_classification"]
    assert tiers["transcript"] == "Tier 2"
    assert tiers["ocr"] == "Tier 2"
    assert tiers["platform_metrics"] == "Tier 2"
    assert tiers["content_interpretation"] == "Tier 3"
    assert tiers["justification"] is None


def test_metadata_paths_are_relative(sample_job: Path) -> None:
    metadata = build_metadata(sample_job)
    for frame in metadata["frames"]:
        assert not frame["file"].startswith("/")


def test_write_report_outputs(sample_job: Path) -> None:
    paths = write_report(sample_job)
    assert paths["markdown"].name == "instagram-DZtCPIRPT87.md"
    assert paths["metadata"].name == "instagram-DZtCPIRPT87_metadata.json"
    assert paths["markdown"].is_file()
    assert paths["metadata"].is_file()


# ---------------------------------------------------------------------------
# §9 — markdown report.
# ---------------------------------------------------------------------------


def test_markdown_sections_in_order(sample_job: Path) -> None:
    md = render_markdown(sample_job)
    sections = [
        "# Instagram Reel: DZtCPIRPT87",
        "## Data Sources (Mode Labels)",
        "## Video Metadata",
        "## Transcription",
        "### Full Transcript",
        "## On-Screen Text (OCR)",
        "## Frames",
        "## Content Analysis",
        "## Framework Notes",
    ]
    positions = [md.index(s) for s in sections]
    assert positions == sorted(positions)


def test_markdown_data_sources_table(sample_job: Path) -> None:
    md = render_markdown(sample_job)
    assert "| Section | Mode | Tool |" in md
    assert "yt-dlp" in md
    assert "ffmpeg+tesseract" in md
    assert "mlx-whisper" in md
    assert "**Manual / Tier 3**" in md


def test_markdown_ocr_shows_only_non_duplicates(sample_job: Path) -> None:
    md = render_markdown(sample_job)
    assert "THEY DONT WANT YOU TO KNOW" in md
    assert "WAKE UP PEOPLE" in md
    # The lowercase duplicate row and the blanked low-confidence row are absent.
    assert "they don't want you to know" not in md


def test_markdown_full_description_not_truncated(sample_job: Path) -> None:
    description = _write_long_description_job(sample_job, 5000)
    md = render_markdown(sample_job)
    assert "#finaltag" in md
    assert description[:2000] in md


def test_format_mmss() -> None:
    assert format_mmss(0.0) == "00:00"
    assert format_mmss(65.9) == "01:05"
    assert format_mmss(176.033) == "02:56"


# ---------------------------------------------------------------------------
# §10 — model bundle.
# ---------------------------------------------------------------------------


def test_render_bundle_structure(sample_job: Path) -> None:
    bundle = render_bundle("instagram-DZtCPIRPT87", jobs_root=sample_job.parent)
    assert bundle.startswith("# instagram-DZtCPIRPT87")
    assert "https://www.instagram.com/reel/DZtCPIRPT87/" in bundle
    for section in ("## Metadata", "## Transcript", "## On-Screen Text", "## Frames", "## Provenance"):
        assert section in bundle
    positions = [bundle.index(s) for s in ("## Metadata", "## Transcript", "## On-Screen Text", "## Frames", "## Provenance")]
    assert positions == sorted(positions)


def test_render_bundle_resolves_public_and_private_roots(sample_job: Path) -> None:
    public_root = sample_job.parent / "jobs"
    private_root = sample_job.parent / "jobs-private"
    public_root.mkdir()
    private_root.mkdir()
    public_job = sample_job.rename(public_root / sample_job.name)
    public_bundle = render_bundle(sample_job.name, jobs_root=public_root)
    public_job.rename(private_root / sample_job.name)
    assert render_bundle(sample_job.name, jobs_root=public_root) == public_bundle


def test_render_bundle_only_non_duplicate_ocr(sample_job: Path) -> None:
    bundle = render_bundle("instagram-DZtCPIRPT87", jobs_root=sample_job.parent)
    ocr_section = bundle.split("## On-Screen Text")[1].split("## Frames")[0]
    assert "[00:00] THEY DONT WANT YOU TO KNOW" in ocr_section
    assert "[00:04] WAKE UP PEOPLE" in ocr_section
    assert "they don't want you to know" not in ocr_section
    # Only the two kept rows render.
    assert ocr_section.count("[00:") == 2


def test_render_bundle_filters_on_kept_not_duplicate_of(sample_job: Path) -> None:
    # A row with duplicate_of null but kept false (empty/low-conf write path)
    # must not render; only the explicit kept flag decides.
    ocr_path = sample_job / "ocr.jsonl"
    rows = [json.loads(line) for line in ocr_path.read_text().splitlines()]
    rows[3] = {**rows[3], "text": "GHOST CAPTION", "duplicate_of": None, "kept": False}
    ocr_path.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
    bundle = render_bundle("instagram-DZtCPIRPT87", jobs_root=sample_job.parent)
    assert "GHOST CAPTION" not in bundle
    assert "GHOST CAPTION" not in render_markdown(sample_job)
    assert build_metadata(sample_job)["ocr"]["kept_rows"] == 2


def test_render_bundle_frames_and_provenance(sample_job: Path) -> None:
    bundle = render_bundle("instagram-DZtCPIRPT87", jobs_root=sample_job.parent)
    assert "4 frames at: 00:00, 00:02, 00:04, 00:06" in bundle
    assert "videolab_get_frames" in bundle
    assert "- fetch: ok (yt-dlp)" in bundle
    assert "- derive: ok (ffmpeg+tesseract)" in bundle
    assert "- asr: ok (mlx-whisper)" in bundle
    assert "- report: pending" in bundle


def test_render_bundle_missing_job_raises(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError):
        render_bundle("instagram-nope", jobs_root=tmp_path)
