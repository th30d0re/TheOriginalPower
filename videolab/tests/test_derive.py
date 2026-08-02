"""Tests for derive_job: OCR dedupe, frame selection, and the CLI contract.

Pure-logic units are tested without ffmpeg. Integration tests generate a tiny
fixture clip with ``ffmpeg -f lavfi -i testsrc`` and never touch the network.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

import derive_job
from derive_job import (
    OcrRow,
    dedupe_ocr,
    interval_timestamps,
    normalize_text,
    select_frame_candidates,
    spread_cap,
)

DERIVE_SCRIPT = Path(derive_job.__file__)

FFMPEG = shutil.which("ffmpeg")
FFPROBE = shutil.which("ffprobe")
TESSERACT = shutil.which("tesseract")

requires_ffmpeg = pytest.mark.skipif(
    not (FFMPEG and FFPROBE), reason="ffmpeg/ffprobe not installed"
)
requires_ocr = pytest.mark.skipif(
    not (FFMPEG and FFPROBE and TESSERACT), reason="ffmpeg/tesseract not installed"
)


# ---------------------------------------------------------------------------
# OCR dedupe — the highest-value unit (CONTRACT §6).
# ---------------------------------------------------------------------------


def test_normalize_text() -> None:
    assert normalize_text("  THEY   DON'T\nWant You!! ") == "theydontwantyou"
    assert normalize_text("") == ""


def test_dedupe_marks_exact_rows() -> None:
    rows = [
        OcrRow(1, 0.0, "THEY DONT WANT YOU TO KNOW", 90.0),
        OcrRow(2, 1.0, "they don't want you to know!", 88.0),  # dup of 1
        OcrRow(3, 2.0, "THEY DONT WANT YOU TO KNOW.", 70.0),   # dup of 1
        OcrRow(4, 3.0, "WAKE UP", 95.0),                       # new kept row
        OcrRow(5, 4.0, "wake up!!", 80.0),                     # dup of 4
        OcrRow(6, 5.0, "", 0.0),                               # empty: never kept
        OcrRow(7, 6.0, "WAKE UP", 20.0),                       # low conf: never kept
        OcrRow(8, 7.0, "wake up", 90.0),                       # dup of 4
    ]
    result = dedupe_ocr(rows)
    assert [r.duplicate_of for r in result] == [None, 1, 1, None, 4, None, None, 4]
    assert [r.kept for r in result] == [True, False, False, True, False, False, False, False]
    # Mark, never drop: every frame still has a row.
    assert len(result) == 8
    # Exactly rows 1 and 4 survive as kept.
    kept = [r.frame_index for r in result if r.kept]
    assert kept == [1, 4]
    # Empty and low-confidence rows are blanked.
    assert result[5].text == ""
    assert result[6].text == ""


def test_dedupe_garbled_variants_cluster_to_full_caption() -> None:
    # The five rows reel_DZe71fExaH3 left kept under the old algorithm: one
    # burned-in caption, read partially and garbled by tesseract.
    rows = [
        OcrRow(1, 0.0, "resistaniie as a Muslim in this Universe", 80.8),
        OcrRow(2, 14.0, "Becoming a vessel of zero resistance as a Muslim in this universe", 93.7),
        OcrRow(3, 116.0, "resistance as a Muslim in this Universe", 92.5),
        OcrRow(4, 130.0, "F f Becoming a vessel of zero resistance as a Muslim in this universe", 87.2),
        OcrRow(5, 146.0, "vessel of zero S a Muslim in this Universe", 95.3),
    ]
    result = dedupe_ocr(rows)
    survivors = [r for r in result if r.kept]
    assert len(survivors) == 1
    # The canonical row is the clean full caption; the 'F f' noise tokens and
    # row 5's higher confidence do not elect a worse read.
    assert survivors[0].frame_index == 2
    assert survivors[0].text == "Becoming a vessel of zero resistance as a Muslim in this universe"
    for row in result:
        if row is not survivors[0]:
            assert row.duplicate_of == 2


def test_dedupe_alternating_captions_two_survivors() -> None:
    # Captions alternate A, B, A, B; last-kept-only matching re-kept A on
    # every return.
    rows = [
        OcrRow(1, 0.0, "THE CLAIM LANDS AT THE END", 90.0),
        OcrRow(2, 1.0, "WAKE UP AND PAY ATTENTION NOW", 91.0),
        OcrRow(3, 2.0, "the claim lands at the end!", 88.0),   # dup of 1
        OcrRow(4, 3.0, "Wake up and pay attention now.", 89.0),  # dup of 2
    ]
    result = dedupe_ocr(rows)
    assert [r.duplicate_of for r in result] == [None, None, 1, 2]
    assert [r.frame_index for r in result if r.kept] == [1, 2]


def test_dedupe_short_rows_do_not_match() -> None:
    # Below the 3-token floor containment is skipped, so an unrelated
    # two-word caption survives.
    rows = [
        OcrRow(1, 0.0, "WAKE UP", 90.0),
        OcrRow(2, 1.0, "CALM DOWN", 90.0),
    ]
    result = dedupe_ocr(rows)
    assert [r.kept for r in result] == [True, True]
    assert [r.duplicate_of for r in result] == [None, None]


def test_dedupe_ratio_threshold_boundary() -> None:
    base = "THE CLAIM LANDS AT THE END OF THE REEL"
    # Two substantive words changed: 5/7 token containment and a sequence
    # ratio below 0.92 — stays kept.
    altered = "THE CLAIM FALLS AT THE END OF THE ROAD"
    rows = [OcrRow(1, 0.0, base, 90.0), OcrRow(2, 1.0, altered, 90.0)]
    result = dedupe_ocr(rows)
    assert result[1].kept is True
    # Pure punctuation noise: identical normalized text, marked duplicate.
    noisy = "The claim lands at the end of the reel..."
    rows2 = [OcrRow(1, 0.0, base, 90.0), OcrRow(2, 1.0, noisy, 90.0)]
    assert dedupe_ocr(rows2)[1].duplicate_of == 1


# ---------------------------------------------------------------------------
# Frame selection.
# ---------------------------------------------------------------------------


def test_interval_timestamps() -> None:
    assert interval_timestamps(6.0, 2.0) == [0.0, 2.0, 4.0]
    assert interval_timestamps(5.0, 2.0) == [0.0, 2.0, 4.0]
    with pytest.raises(ValueError):
        interval_timestamps(6.0, 0.0)


def test_select_frame_candidates_union_sorted() -> None:
    candidates = select_frame_candidates([4.1, 1.9], [0.0, 2.0, 4.0])
    # Interval candidates within the coincidence window of a scene are dropped.
    assert candidates == [(0.0, "interval"), (1.9, "scene"), (4.1, "scene")]


def test_spread_cap_spans_full_duration() -> None:
    candidates = [(i * 0.5, "interval") for i in range(40)]  # 0.0 .. 19.5
    kept = spread_cap(candidates, 12)
    assert len(kept) == 12
    timestamps = [t for t, _ in kept]
    assert timestamps[0] == candidates[0][0]
    assert timestamps[-1] == candidates[-1][0]
    assert timestamps == sorted(timestamps)
    # Even spread: gaps differ by at most one candidate step.
    indices = [candidates.index(item) for item in kept]
    gaps = [b - a for a, b in zip(indices, indices[1:])]
    assert max(gaps) - min(gaps) <= 1


def test_spread_cap_noop_under_cap() -> None:
    candidates = [(0.0, "scene"), (2.0, "interval")]
    assert spread_cap(candidates, 12) == candidates
    assert spread_cap(candidates, 2) == candidates


# ---------------------------------------------------------------------------
# CLI contract (CONTRACT §5) — generated fixture clip, no network.
# ---------------------------------------------------------------------------


def _make_job(tmp_path: Path) -> Path:
    job = tmp_path / "instagram-testclip"
    media = job / "media"
    media.mkdir(parents=True)
    # The clip carries a sine audio track: the CONTRACT §6 audio command
    # (`-vn`) fails on a silent testsrc-only clip, and real reels have audio.
    subprocess.run(
        [
            FFMPEG, "-nostdin", "-y",
            "-f", "lavfi", "-i", "testsrc=duration=6:size=320x240:rate=10",
            "-f", "lavfi", "-i", "sine=frequency=440:duration=6",
            "-pix_fmt", "yuv420p", "-shortest", str(media / "video.mp4"),
        ],
        check=True,
        capture_output=True,
    )
    return job


def _run_derive(job: Path, *extra: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(DERIVE_SCRIPT), "--job", str(job), *extra],
        capture_output=True,
        text=True,
    )


@requires_ocr
def test_derive_cli_full_run(tmp_path: Path) -> None:
    job = _make_job(tmp_path)
    proc = _run_derive(job, "--frames", "8", "--min-interval", "1.5")
    assert proc.returncode == 0, proc.stderr

    # Exactly one JSON line on stdout, as the final action.
    stdout_lines = [line for line in proc.stdout.splitlines() if line.strip()]
    assert len(stdout_lines) == 1
    result = json.loads(stdout_lines[0])
    assert result["ok"] is True
    assert result["audio"] == "media/audio.wav"
    assert result["frames"] > 0
    assert result["frames"] <= 8

    # Audio: 16 kHz mono PCM.
    audio = job / "media" / "audio.wav"
    assert audio.is_file()
    probe = subprocess.run(
        [
            FFPROBE, "-v", "error", "-select_streams", "a:0",
            "-show_entries", "stream=sample_rate,channels",
            "-of", "json", str(audio),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    stream = json.loads(probe.stdout)["streams"][0]
    assert stream["sample_rate"] == "16000"
    assert stream["channels"] == 1

    # frames.json: schema, relative paths, renumbered from 1, sorted.
    frames_doc = json.loads((job / "frames.json").read_text())
    assert frames_doc["schema_version"] == 1
    frames = frames_doc["frames"]
    assert len(frames) == result["frames"]
    assert [f["index"] for f in frames] == list(range(1, len(frames) + 1))
    assert [f["t_seconds"] for f in frames] == sorted(f["t_seconds"] for f in frames)
    for frame in frames:
        assert frame["selected_by"] in ("scene", "interval")
        assert not frame["file"].startswith("/")
        assert (job / frame["file"]).is_file()

    # ocr.jsonl: one row per frame, in frame order, all contract keys.
    ocr_lines = (job / "ocr.jsonl").read_text().splitlines()
    assert len(ocr_lines) == len(frames)
    for i, line in enumerate(ocr_lines, start=1):
        row = json.loads(line)
        assert row["frame_index"] == i
        assert set(row) == {"frame_index", "t_seconds", "text", "mean_conf", "duplicate_of", "kept"}
    assert result["ocr_rows"] == len(frames)

    # Progress went to stderr only.
    assert "[derive]" in proc.stderr


@requires_ffmpeg
def test_derive_cli_no_ocr(tmp_path: Path) -> None:
    job = _make_job(tmp_path)
    proc = _run_derive(job, "--frames", "4", "--no-ocr")
    assert proc.returncode == 0, proc.stderr
    result = json.loads(proc.stdout.strip())
    assert result["ok"] is True
    assert result["ocr_rows"] == 0
    assert result["ocr_kept"] == 0
    assert (job / "ocr.jsonl").is_file()


@requires_ffmpeg
def test_derive_cli_missing_video_fails(tmp_path: Path) -> None:
    job = tmp_path / "empty-job"
    job.mkdir()
    proc = _run_derive(job)
    assert proc.returncode == 1
    result = json.loads(proc.stdout.strip())
    assert result["ok"] is False
    assert "video" in result["error"].lower()
