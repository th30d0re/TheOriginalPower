#!/usr/bin/env python3
"""videolab stage B — derive: audio extraction, frame selection, OCR + dedupe.

Runs inside a Linux container with the Python standard library only. Shells out
to ``ffmpeg``/``ffprobe`` and ``tesseract``. Writes only under the job
directory, prints exactly one JSON line on stdout as its final action, sends
progress to stderr, and exits 0 on success / 1 on failure (CONTRACT.md §5).

Pure-logic units (text normalization, OCR dedupe, frame-cap spreading, frame
candidate selection) take data rather than file paths so they can be tested
without invoking ffmpeg.
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

DUPLICATE_RATIO = 0.92
CONTAINMENT_RATIO = 0.80
# Containment needs enough tokens to be meaningful; below this a two-word
# caption matches almost anything.
MIN_CONTAINMENT_TOKENS = 3
MIN_CONF = 40.0
# Timestamps closer than this are considered coincident; scene wins.
COINCIDENCE_WINDOW = 0.25

_PTS_TIME_RE = re.compile(r"pts_time:([0-9.]+)")
_NON_ALNUM_RE = re.compile(r"[^0-9a-z]+")
_WHITESPACE_RE = re.compile(r"\s+")
_TOKEN_RE = re.compile(r"[0-9a-z]+")


# ---------------------------------------------------------------------------
# Pure logic (no subprocess, no filesystem) — directly unit-testable.
# ---------------------------------------------------------------------------


def normalize_text(text: str) -> str:
    """Casefold, collapse whitespace, strip non-alphanumerics (CONTRACT §6)."""
    collapsed = _WHITESPACE_RE.sub(" ", text).strip().casefold()
    return _NON_ALNUM_RE.sub("", collapsed)


def tokenize(text: str) -> set[str]:
    """Casefolded word tokens: maximal runs of ``[0-9a-z]``."""
    return set(_TOKEN_RE.findall(text.casefold()))


@dataclass
class OcrRow:
    frame_index: int
    t_seconds: float
    text: str
    mean_conf: float
    duplicate_of: int | None = field(default=None)
    kept: bool = field(default=False)


def _is_duplicate(
    text_a: str,
    text_b: str,
    ratio_threshold: float,
    containment_ratio: float,
) -> bool:
    """Two rows are duplicates when either test fires (CONTRACT §6).

    The sequence ratio catches reorderings; token-set containment catches
    partial and garbled reads of the same caption (dropped leading words,
    inserted noise tokens), which drag the sequence ratio below threshold.
    """
    norm_a = normalize_text(text_a)
    norm_b = normalize_text(text_b)
    if not norm_a or not norm_b:
        return False
    if difflib.SequenceMatcher(None, norm_a, norm_b).ratio() >= ratio_threshold:
        return True
    tokens_a = tokenize(text_a)
    tokens_b = tokenize(text_b)
    if len(tokens_a) < MIN_CONTAINMENT_TOKENS or len(tokens_b) < MIN_CONTAINMENT_TOKENS:
        return False
    return len(tokens_a & tokens_b) / min(len(tokens_a), len(tokens_b)) >= containment_ratio


def _election_score(row: OcrRow) -> tuple[int, float]:
    """Canonical-election key: more content tokens, then higher confidence.

    Single-character tokens are OCR noise (`'F f ...'`, `'... zero S ...'`);
    counting them would elect garbled superset reads over the clean caption.
    """
    content_tokens = sum(1 for token in tokenize(row.text) if len(token) > 1)
    return (content_tokens, row.mean_conf)


def dedupe_ocr(
    rows: list[OcrRow],
    ratio_threshold: float = DUPLICATE_RATIO,
    containment_ratio: float = CONTAINMENT_RATIO,
) -> list[OcrRow]:
    """Cluster near-duplicate OCR rows and elect one canonical row per cluster.

    Every row is returned; dedupe marks, it does not drop. Rows with empty
    text or ``mean_conf < 40`` get ``text: ""`` and ``kept: False``. Selection
    runs in two passes: rows are clustered by pairwise duplicate matching
    (sequence ratio or token-set containment) against every cluster, then the
    best read of each cluster is elected canonical. The canonical row gets
    ``kept: True``; every other cluster member gets ``duplicate_of`` set to
    the canonical row's ``frame_index``.
    """
    valid: list[OcrRow] = []
    for row in rows:
        row.duplicate_of = None
        row.kept = False
        if not row.text.strip() or row.mean_conf < MIN_CONF:
            row.text = ""
            continue
        valid.append(row)

    clusters: list[list[OcrRow]] = []
    canonicals: list[OcrRow] = []
    for row in valid:
        for index, canonical in enumerate(canonicals):
            if _is_duplicate(row.text, canonical.text, ratio_threshold, containment_ratio):
                clusters[index].append(row)
                if _election_score(row) > _election_score(canonical):
                    canonicals[index] = row
                break
        else:
            clusters.append([row])
            canonicals.append(row)

    for cluster, canonical in zip(clusters, canonicals):
        canonical.kept = True
        for row in cluster:
            if row is not canonical:
                row.duplicate_of = canonical.frame_index
    return rows


def interval_timestamps(duration: float, min_interval: float) -> list[float]:
    """Fixed-interval floor: one candidate every ``min_interval`` seconds."""
    if min_interval <= 0:
        raise ValueError("min_interval must be positive")
    out: list[float] = []
    t = 0.0
    while t < duration:
        out.append(t)
        t += min_interval
    return out


def select_frame_candidates(
    scene_ts: list[float],
    interval_ts: list[float],
    coincidence_window: float = COINCIDENCE_WINDOW,
) -> list[tuple[float, str]]:
    """Union of scene-change and interval candidates, sorted by timestamp.

    Interval candidates within ``coincidence_window`` of a scene candidate are
    dropped; the scene candidate carries the frame.
    """
    scene_sorted = sorted(scene_ts)
    kept: list[tuple[float, str]] = [(t, "scene") for t in scene_sorted]
    for t in sorted(interval_ts):
        if any(abs(t - s) <= coincidence_window for s in scene_sorted):
            continue
        kept.append((t, "interval"))
    kept.sort(key=lambda item: item[0])
    return kept


def spread_cap(candidates: list[tuple[float, str]], cap: int) -> list[tuple[float, str]]:
    """Cap candidates by keeping an even spread across the duration.

    Truncating the tail would drop the end of the reel, where the claim often
    lands. The first and last candidates are always kept.
    """
    if cap <= 0:
        raise ValueError("cap must be positive")
    if len(candidates) <= cap:
        return list(candidates)
    last = len(candidates) - 1
    indices = [round(i * last / (cap - 1)) for i in range(cap)] if cap > 1 else [0]
    return [candidates[i] for i in indices]


# ---------------------------------------------------------------------------
# Subprocess wrappers (ffmpeg / tesseract).
# ---------------------------------------------------------------------------


def _decode(data: bytes) -> str:
    # Tool output can carry arbitrary bytes (tesseract prints raw memory in
    # some error paths); decoding must never crash the job.
    return data.decode("utf-8", errors="replace")


def _run(cmd: list[str], what: str) -> subprocess.CompletedProcess:
    proc = subprocess.run(cmd, capture_output=True)
    if proc.returncode != 0:
        raise RuntimeError(f"{what} failed ({proc.returncode}): {_decode(proc.stderr).strip()[:400]}")
    return proc


def probe_duration(video: Path) -> float:
    proc = _run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(video),
        ],
        "ffprobe",
    )
    return float(_decode(proc.stdout).strip())


def extract_audio(video: Path, audio: Path) -> None:
    """16 kHz mono PCM, matching Paper/research/video_transcripts/audio (§6)."""
    _run(
        [
            "ffmpeg", "-nostdin", "-y", "-i", str(video),
            "-vn", "-ac", "1", "-ar", "16000", str(audio),
        ],
        "audio extraction",
    )


def scene_timestamps(video: Path, threshold: float) -> list[float]:
    """Scene-change timestamps via ``select='gt(scene,<threshold>)'`` + showinfo."""
    proc = _run(
        [
            "ffmpeg", "-nostdin", "-i", str(video),
            "-vf", f"select='gt(scene,{threshold})',showinfo",
            "-f", "null", "-",
        ],
        "scene detection",
    )
    return [float(m.group(1)) for m in _PTS_TIME_RE.finditer(_decode(proc.stderr))]


def extract_frame(video: Path, t_seconds: float, out: Path) -> None:
    _run(
        [
            "ffmpeg", "-nostdin", "-y",
            "-ss", f"{t_seconds:.3f}", "-i", str(video),
            "-frames:v", "1", "-q:v", "2", str(out),
        ],
        f"frame extraction at {t_seconds:.2f}s",
    )


def ocr_frame(image: Path, lang: str) -> tuple[str, float]:
    """Return ``(text, mean_conf)`` for one frame via tesseract TSV output."""
    proc = _run(
        ["tesseract", str(image), "stdout", "-l", lang, "tsv"],
        f"tesseract on {image.name}",
    )
    words: list[str] = []
    confs: list[float] = []
    lines = _decode(proc.stdout).splitlines()
    header = lines[0].split("\t") if lines else []
    try:
        level_i = header.index("level")
        conf_i = header.index("conf")
        text_i = header.index("text")
    except ValueError:
        return "", 0.0
    for line in lines[1:]:
        cols = line.split("\t")
        if len(cols) <= max(level_i, conf_i, text_i):
            continue
        if cols[level_i] != "5":  # word level
            continue
        try:
            conf = float(cols[conf_i])
        except ValueError:
            continue
        word = cols[text_i].strip()
        if conf < 0 or not word:
            continue
        words.append(word)
        confs.append(conf)
    text = " ".join(words)
    mean_conf = round(sum(confs) / len(confs), 1) if confs else 0.0
    return text, mean_conf


# ---------------------------------------------------------------------------
# Job driver.
# ---------------------------------------------------------------------------


def _log(message: str) -> None:
    print(f"[derive] {message}", file=sys.stderr)


def run_job(
    job: Path,
    frames_cap: int,
    scene_threshold: float,
    min_interval: float,
    do_ocr: bool,
    ocr_lang: str,
) -> dict:
    media = job / "media"
    video = media / "video.mp4"
    if not video.is_file():
        raise RuntimeError(f"missing input video: {video}")

    audio = media / "audio.wav"
    frames_dir = media / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)

    _log("extracting audio (16 kHz mono)")
    extract_audio(video, audio)

    duration = probe_duration(video)
    _log(f"duration: {duration:.2f}s")

    scene_ts = scene_timestamps(video, scene_threshold)
    interval_ts = interval_timestamps(duration, min_interval)
    _log(f"candidates: {len(scene_ts)} scene + {len(interval_ts)} interval")

    candidates = select_frame_candidates(scene_ts, interval_ts)
    selected = spread_cap(candidates, frames_cap)
    _log(f"selected {len(selected)} frames (cap {frames_cap})")

    frames: list[dict] = []
    for index, (t, selected_by) in enumerate(selected, start=1):
        name = f"frame_{index:04d}.jpg"
        extract_frame(video, t, frames_dir / name)
        frames.append(
            {
                "index": index,
                "file": f"media/frames/{name}",
                "t_seconds": round(t, 2),
                "selected_by": selected_by,
            }
        )

    with (job / "frames.json").open("w", encoding="utf-8") as fh:
        json.dump({"schema_version": 1, "frames": frames}, fh, indent=2)
        fh.write("\n")

    ocr_rows = 0
    ocr_kept = 0
    with (job / "ocr.jsonl").open("w", encoding="utf-8") as fh:
        if do_ocr:
            rows: list[OcrRow] = []
            for frame in frames:
                text, mean_conf = ocr_frame(job / frame["file"], ocr_lang)
                rows.append(
                    OcrRow(
                        frame_index=frame["index"],
                        t_seconds=frame["t_seconds"],
                        text=text,
                        mean_conf=mean_conf,
                    )
                )
            dedupe_ocr(rows)
            for row in rows:
                fh.write(
                    json.dumps(
                        {
                            "frame_index": row.frame_index,
                            "t_seconds": row.t_seconds,
                            "text": row.text,
                            "mean_conf": row.mean_conf,
                            "duplicate_of": row.duplicate_of,
                            "kept": row.kept,
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                )
            ocr_rows = len(rows)
            ocr_kept = sum(1 for row in rows if row.kept)

    return {
        "ok": True,
        "frames": len(frames),
        "ocr_rows": ocr_rows,
        "ocr_kept": ocr_kept,
        "audio": "media/audio.wav",
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="videolab stage B — derive")
    parser.add_argument("--job", required=True, help="job directory")
    parser.add_argument("--frames", type=int, default=12, help="frame cap")
    parser.add_argument("--scene-threshold", type=float, default=0.3)
    parser.add_argument("--min-interval", type=float, default=2.0)
    parser.add_argument("--no-ocr", action="store_true")
    parser.add_argument("--ocr-lang", default="eng")
    args = parser.parse_args(argv)

    # Resolve symlinks (e.g. macOS /tmp -> /private/tmp): leptonica, and
    # therefore tesseract, refuses to open image files through symlinked
    # path components. Only resolved paths reach subprocesses; every path
    # written into JSON artifacts stays relative to the job directory.
    job = Path(args.job).resolve()
    try:
        result = run_job(
            job=job,
            frames_cap=args.frames,
            scene_threshold=args.scene_threshold,
            min_interval=args.min_interval,
            do_ocr=not args.no_ocr,
            ocr_lang=args.ocr_lang,
        )
    except Exception as exc:  # noqa: BLE001 — failure contract: one JSON line, exit 1
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1

    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    sys.exit(main())
