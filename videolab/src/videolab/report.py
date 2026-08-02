"""videolab stage D — report rendering (CONTRACT.md §§8, 9, 10).

Pure Python. No network, no model calls, no wall-clock. Every function is a
pure function of on-disk job state.

Three upstream bugs from the old URL-to-Text pipeline are deliberately not
reproduced (§8):

1. A missing view count is ``null``, never ``0``. ``0`` is a real value.
2. Descriptions are stored in full; hashtags derive from the complete string.
3. Exactly one ``extract_info`` per fetch — a fetch-stage concern, recorded
   here because it shaped the committed metadata this module reproduces.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Top-level key order of <slug>_metadata.json (CONTRACT §8). ``reel_id`` is
# inserted after ``platform`` only when platform == "instagram".
METADATA_KEY_ORDER = [
    "id",
    "slug",
    "url",
    "platform",
    "creator",
    "content",
    "engagement",
    "metadata",
    "transcription",
    "ocr",
    "frames",
    "dm_provenance",
    "content_analysis",
    "framework_notes",
    "tier_classification",
]

_HASHTAG_RE = re.compile(r"#\w+")

_PLATFORM_TITLES = {
    "instagram": "Instagram Reel",
    "x": "X Post",
    "youtube": "YouTube Video",
    "tiktok": "TikTok Video",
    "file": "Local File",
}


# ---------------------------------------------------------------------------
# On-disk state readers.
# ---------------------------------------------------------------------------


def _read_json(path: Path) -> Any:
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _read_text(path: Path) -> str | None:
    if not path.is_file():
        return None
    return path.read_text(encoding="utf-8").strip()


def _read_ocr_rows(job_dir: Path) -> list[dict]:
    path = job_dir / "ocr.jsonl"
    if not path.is_file():
        return []
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            rows.append(json.loads(line))
    return rows


def _default_jobs_root() -> Path:
    # report.py lives at <repo>/videolab/src/videolab/report.py; jobs live at
    # <repo>/videolab/jobs/.
    default = Path(__file__).resolve().parents[2] / "jobs"
    return Path(os.environ.get("VIDEOLAB_JOBS_DIR", default)).expanduser()


def _default_private_jobs_root() -> Path:
    default = Path(__file__).resolve().parents[2] / "jobs-private"
    return Path(os.environ.get("VIDEOLAB_PRIVATE_JOBS_DIR", default)).expanduser()


# ---------------------------------------------------------------------------
# Formatting helpers.
# ---------------------------------------------------------------------------


def format_mmss(t_seconds: float) -> str:
    """Format seconds as ``MM:SS``."""
    total = int(t_seconds)
    return f"{total // 60:02d}:{total % 60:02d}"


def extract_hashtags(description: str | None) -> list[str]:
    """Mechanically extract hashtags from the full, untruncated description."""
    if not description:
        return []
    return _HASHTAG_RE.findall(description)


# ---------------------------------------------------------------------------
# §8 — <slug>_metadata.json.
# ---------------------------------------------------------------------------


def build_metadata(job_dir: Path) -> dict:
    """Assemble the ordered metadata dict for one job directory."""
    job_dir = Path(job_dir)
    job = _read_json(job_dir / "job.json") or {}
    info = _read_json(job_dir / "source.info.json") or {}
    frames_doc = _read_json(job_dir / "frames.json") or {}
    ocr_rows = _read_ocr_rows(job_dir)
    transcript_text = _read_text(job_dir / "transcript.txt")
    dm = _read_json(job_dir / "dm.json")

    source = job.get("source") or {}
    stages = job.get("stages") or {}
    platform = source.get("platform")
    slug = job.get("slug") or job_dir.name

    description = info.get("description")  # stored in full, never truncated
    duration = info.get("duration")
    timestamp = info.get("timestamp")

    fetch_stage = stages.get("fetch") or {}
    asr_stage = stages.get("asr") or {}
    asr_detail = asr_stage.get("detail") or {}

    metadata: dict[str, Any] = {
        "id": source.get("id"),
        "slug": slug,
        "url": source.get("url"),
        "platform": platform,
    }
    if platform == "instagram":
        # Backward compatibility with the seven committed reel files.
        metadata["reel_id"] = source.get("id")

    metadata["creator"] = {
        "username": info.get("uploader_id"),
        "display_name": info.get("uploader"),
        "user_id": info.get("channel_id"),
    }
    metadata["content"] = {
        "title": info.get("title"),
        "description": description,
        "duration_seconds": duration,
        "duration_formatted": format_mmss(duration).lstrip("0").lstrip(":")
        if isinstance(duration, (int, float))
        else None,
    }
    # Absent metrics are null with no apology note (§8 bug 1). .get() returns
    # None for missing keys; a present 0 survives as a real measured zero.
    metadata["engagement"] = {
        "likes": info.get("like_count"),
        "comments_count": info.get("comment_count"),
        "play_count": info.get("play_count"),
        "views": info.get("view_count"),
        "shares": info.get("repost_count"),
        "saves": info.get("save_count"),
    }
    metadata["metadata"] = {
        "upload_date": info.get("upload_date"),
        "timestamp": timestamp,
        "posted_at_iso": _iso_from_epoch(timestamp),
        "instagram_media_id": info.get("media_id"),
        "instagram_media_pk": info.get("media_pk"),
        "product_type": info.get("product_type"),
        "media_type": info.get("media_type"),
        "fetched_at": fetch_stage.get("ended_at"),
        "metrics_source": fetch_stage.get("engine"),
    }
    metadata["transcription"] = {
        "full_text": transcript_text,
        "transcribed_by": asr_stage.get("engine") if transcript_text else None,
        "transcription_mode": "offline" if transcript_text else None,
        "model_size": asr_detail.get("model") if transcript_text else None,
        "language": asr_detail.get("language") if transcript_text else None,
    }
    metadata["ocr"] = {
        "total_rows": len(ocr_rows),
        "kept_rows": sum(1 for r in ocr_rows if r.get("kept")),
        "rows": ocr_rows,
    }
    metadata["frames"] = frames_doc.get("frames") or []
    metadata["dm_provenance"] = dm
    # Empty scaffold: videolab never invents interpretation (§8). Hashtags are
    # mechanical extraction from the full description, so they are pre-filled.
    metadata["content_analysis"] = {
        "primary_theme": None,
        "secondary_themes": [],
        "rhetorical_frame": None,
        "hashtags": extract_hashtags(description),
        "notable_speakers": [],
        "key_moments": [],
    }
    metadata["framework_notes"] = {}
    # Mechanical tier judgements only: machine-generated fields Tier 2,
    # interpretive fields Tier 3 (§8).
    metadata["tier_classification"] = {
        "transcript": "Tier 2",
        "ocr": "Tier 2",
        "platform_metrics": "Tier 2",
        "content_interpretation": "Tier 3",
        "justification": None,
    }
    return metadata


def _iso_from_epoch(timestamp: Any) -> str | None:
    if not isinstance(timestamp, (int, float)):
        return None
    dt = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


# ---------------------------------------------------------------------------
# §9 — <slug>.md.
# ---------------------------------------------------------------------------


def render_markdown(job_dir: Path) -> str:
    """Render the per-job markdown report mirroring reel_DZtCPIRPT87.md."""
    job_dir = Path(job_dir)
    meta = build_metadata(job_dir)
    job = _read_json(job_dir / "job.json") or {}
    stages = job.get("stages") or {}

    platform = meta["platform"]
    title_kind = _PLATFORM_TITLES.get(platform, "Video")
    creator = meta["creator"]
    content = meta["content"]
    engagement = meta["engagement"]
    inner_meta = meta["metadata"]
    transcription = meta["transcription"]
    ocr_rows: list[dict] = meta["ocr"]["rows"]
    frames: list[dict] = meta["frames"]
    hashtags = meta["content_analysis"]["hashtags"]

    uploader = "unknown"
    if creator["display_name"] and creator["username"]:
        uploader = f"{creator['display_name']} (@{creator['username']})"
    elif creator["username"]:
        uploader = f"@{creator['username']}"

    duration = content["duration_seconds"]
    duration_line = "unknown"
    if isinstance(duration, (int, float)):
        duration_line = f"{int(round(duration))} seconds (~{format_mmss(duration)})"

    posted = inner_meta["posted_at_iso"] or "unknown"
    fetched = (inner_meta["fetched_at"] or "unknown").split("T")[0]

    lines: list[str] = []
    lines.append(f"# {title_kind}: {meta['id']}")
    lines.append("")
    lines.append(f"- URL: {meta['url'] or meta.get('path') or 'local file'}")
    lines.append(f"- Video title: {content['title'] or 'unknown'}")
    lines.append(f"- Uploader: {uploader}")
    lines.append(f"- Duration: {duration_line}")
    lines.append(f"- Posted: {posted}")
    lines.append("")
    lines.append("## Data Sources (Mode Labels)")
    lines.append("")
    lines.append("| Section | Mode | Tool |")
    lines.append("|---|---|---|")
    lines.extend(_data_source_rows(stages, engagement))
    lines.append("")
    lines.append("## Video Metadata")
    lines.append("")
    lines.append(f"- Fetched at: {fetched}")
    lines.append(f"- Source: {inner_meta['metrics_source'] or 'local file'}")
    lines.append(f"- Shortcode: {meta['id']}")
    lines.append(f"- Uploader username: @{creator['username']}" if creator["username"] else "- Uploader username: unknown")
    lines.append(f"- Uploader display name: {creator['display_name'] or 'unknown'}")
    lines.append(f"- Duration: {duration} seconds" if duration is not None else "- Duration: unknown")
    lines.append(f"- Description: {json.dumps(content['description'], ensure_ascii=False)}")
    lines.append(f"- Hashtags: {' '.join(hashtags) if hashtags else 'none'}")
    lines.append("")
    lines.append("## Transcription")
    lines.append("")
    if transcription["full_text"]:
        lines.append(f"- Source: {transcription['transcribed_by']} (offline)")
        lines.append(f"- Model: {transcription['model_size'] or 'unknown'}")
        lines.append(f"- Language: {transcription['language'] or 'unknown'}")
        lines.append("")
        lines.append("### Full Transcript")
        lines.append("")
        lines.append(transcription["full_text"])
    else:
        lines.append("Transcript pending. Stage C (ASR) produces `transcript.txt`.")
    lines.append("")
    lines.append("## On-Screen Text (OCR)")
    lines.append("")
    kept_rows = [r for r in ocr_rows if r.get("kept")]
    if kept_rows:
        lines.append(f"{len(kept_rows)} unique caption rows after dedupe (token containment 0.80 / sequence ratio 0.92):")
        lines.append("")
        for row in kept_rows:
            lines.append(f"- [{format_mmss(row['t_seconds'])}] {row['text']}")
    elif ocr_rows:
        lines.append("All OCR rows are duplicates or empty; no unique on-screen text.")
    else:
        lines.append("OCR pending. Stage B (derive) produces `ocr.jsonl`.")
    lines.append("")
    lines.append("## Frames")
    lines.append("")
    if frames:
        lines.append(f"{len(frames)} frames selected (scene-change union fixed-interval floor):")
        lines.append("")
        lines.append("| # | t (s) | selected_by | file |")
        lines.append("|---|---|---|---|")
        for frame in frames:
            lines.append(
                f"| {frame['index']} | {frame['t_seconds']} | {frame['selected_by']} | `{frame['file']}` |"
            )
    else:
        lines.append("Frames pending. Stage B (derive) produces `frames.json`.")
    lines.append("")
    lines.append("## Content Analysis")
    lines.append("")
    lines.append("Empty scaffold. A model fills this section from the bundle;")
    lines.append("`videolab` emits no interpretation. Fields: `primary_theme`,")
    lines.append("`secondary_themes`, `rhetorical_frame`, `notable_speakers`, `key_moments`.")
    lines.append("")
    lines.append("## Framework Notes")
    lines.append("")
    lines.append("Empty scaffold. Framework analysis is authored downstream.")
    lines.append("")
    return "\n".join(lines)


def _data_source_rows(stages: dict, engagement: dict) -> list[str]:
    asr = stages.get("asr") or {}
    fetch = stages.get("fetch") or {}
    derive = stages.get("derive") or {}

    if asr.get("status") == "ok":
        transcript_mode = f"**{asr.get('engine', 'asr')} offline**"
        transcript_tool = f"`{asr.get('engine')}`"
    else:
        transcript_mode = "**Pending**"
        transcript_tool = "Stage C has not run"

    if fetch.get("status") == "ok":
        meta_mode = f"**{fetch.get('engine', 'fetch')}**"
        meta_tool = f"`{fetch.get('engine')}`"
    elif fetch.get("status") == "skipped":
        meta_mode = "**Local file**"
        meta_tool = "Stage A3 file-drop; no fetch"
    else:
        meta_mode = "**Pending**"
        meta_tool = "Stage A has not run"

    if derive.get("status") == "ok":
        ocr_mode = "**Offline**"
        ocr_tool = f"`{derive.get('engine', 'ffmpeg+tesseract')}`"
    else:
        ocr_mode = "**Pending**"
        ocr_tool = "Stage B has not run"

    metrics_present = any(v is not None for v in engagement.values())
    if metrics_present:
        metrics_mode = "**Platform API / scrape**"
        metrics_tool = "Engagement metrics recorded in metadata"
    else:
        metrics_mode = "**Unavailable**"
        metrics_tool = "No engagement metrics retrieved"

    return [
        f"| Transcript | {transcript_mode} | {transcript_tool} |",
        f"| Video metadata (title, duration, description) | {meta_mode} | {meta_tool} |",
        f"| On-screen text (OCR) | {ocr_mode} | {ocr_tool} |",
        f"| Platform metrics | {metrics_mode} | {metrics_tool} |",
        "| Content analysis | **Manual / Tier 3** | Model-classified thematic coding (pending) |",
    ]


# ---------------------------------------------------------------------------
# §10 — model bundle.
# ---------------------------------------------------------------------------


def render_bundle(slug: str, jobs_root: Path | None = None) -> str:
    """Render the single markdown string handed to a model for analysis.

    Pure function of on-disk state. Called by V3's MCP server.
    """
    public_root = Path(jobs_root) if jobs_root is not None else _default_jobs_root()
    private_root = (
        public_root.parent / "jobs-private"
        if jobs_root is not None
        else _default_private_jobs_root()
    )
    roots = (public_root, private_root)
    job_dir = next((root / slug for root in roots if (root / slug).is_dir()), None)
    if job_dir is None:
        searched = ", ".join(str(root) for root in roots)
        raise FileNotFoundError(f"no job directory for slug {slug!r} under {searched}")

    meta = build_metadata(job_dir)
    job = _read_json(job_dir / "job.json") or {}
    stages = job.get("stages") or {}

    creator = meta["creator"]
    content = meta["content"]
    inner_meta = meta["metadata"]
    ocr_rows: list[dict] = meta["ocr"]["rows"]
    frames: list[dict] = meta["frames"]
    hashtags = meta["content_analysis"]["hashtags"]
    transcript = meta["transcription"]["full_text"]

    lines: list[str] = []
    lines.append(f"# {slug}")
    lines.append("")
    lines.append(f"Source: {meta['url'] or 'local file'}")
    lines.append("")
    lines.append("## Metadata")
    lines.append("")
    lines.append(f"- Creator: {creator['display_name'] or 'unknown'} (@{creator['username'] or 'unknown'})")
    duration = content["duration_seconds"]
    lines.append(f"- Duration: {format_mmss(duration) if isinstance(duration, (int, float)) else 'unknown'}")
    lines.append(f"- Posted: {inner_meta['posted_at_iso'] or 'unknown'}")
    lines.append(f"- Description: {content['description'] or ''}")
    lines.append(f"- Hashtags: {' '.join(hashtags) if hashtags else 'none'}")
    lines.append("")
    lines.append("## Transcript")
    lines.append("")
    lines.append(transcript if transcript else "No transcript available.")
    lines.append("")
    lines.append("## On-Screen Text")
    lines.append("")
    kept_rows = [r for r in ocr_rows if r.get("kept")]
    if kept_rows:
        for row in kept_rows:
            lines.append(f"[{format_mmss(row['t_seconds'])}] {row['text']}")
    else:
        lines.append("No unique on-screen text.")
    lines.append("")
    lines.append("## Frames")
    lines.append("")
    if frames:
        stamps = ", ".join(format_mmss(f["t_seconds"]) for f in frames)
        lines.append(f"{len(frames)} frames at: {stamps}")
        lines.append("")
        lines.append("Frame images come from `videolab_get_frames`.")
    else:
        lines.append("No frames extracted.")
    lines.append("")
    lines.append("## Provenance")
    lines.append("")
    for stage_name in ("fetch", "derive", "asr", "report"):
        stage = stages.get(stage_name) or {}
        status = stage.get("status", "pending")
        engine = stage.get("engine") or "none"
        lines.append(f"- {stage_name}: {status} ({engine})")
    lines.append("")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Entry point.
# ---------------------------------------------------------------------------


def write_report(job_dir: Path) -> dict[str, Path]:
    """Write ``<slug>.md`` and ``<slug>_metadata.json`` into the job directory."""
    job_dir = Path(job_dir)
    metadata = build_metadata(job_dir)
    slug = metadata["slug"]

    md_path = job_dir / f"{slug}.md"
    md_path.write_text(render_markdown(job_dir), encoding="utf-8")

    json_path = job_dir / f"{slug}_metadata.json"
    with json_path.open("w", encoding="utf-8") as fh:
        json.dump(metadata, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    return {"markdown": md_path, "metadata": json_path}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="videolab stage D — report")
    parser.add_argument("--job", required=True, help="job directory")
    args = parser.parse_args(argv)
    paths = write_report(Path(args.job))
    print(json.dumps({"ok": True, "markdown": paths["markdown"].name, "metadata": paths["metadata"].name}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
