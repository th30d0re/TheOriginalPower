#!/usr/bin/env python3
"""Extract midpoint frames and OCR for the YT02v2 one turn per shot audit."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SHOTLIST = ROOT / "Architecting_the_operation/video/YT02v2_shotlist.md"
WORDS = ROOT / "outputs/YT02V2/words.json"
MANIFEST = ROOT / "outputs/YT02V2/episode_manifest.json"
PREVIEW = ROOT / "outputs/YT02V2/video/preview/960x540"
CARDS = ROOT / "Architecting_the_operation/video/yt02/cards"


def parse_shots() -> list[dict]:
    source = SHOTLIST.read_text()
    word_rows = json.loads(WORDS.read_text())
    turns = json.loads(MANIFEST.read_text())["turns"]
    blocks = re.split(r"(?=^## S\d{2}-\d{2} )", source, flags=re.M)
    segment = 0
    shots = []
    for block in blocks:
        heading = re.search(r"^## (S\d{2}-\d{2}) — (.+)$", block, re.M)
        if not heading:
            seg = re.search(r"<!-- SEG (\d{2})", block)
            if seg:
                segment = int(seg.group(1))
            continue
        sid, title = heading.groups()
        turn_index = len(shots)
        render = re.search(r"^- \*\*Render:\*\* `([^`]+)`", block, re.M)
        holds = re.search(r"^- \*\*Holds:\*\* `([^`]+)`", block, re.M)
        note = re.search(r"^- \*\*Note:\*\* (.+)$", block, re.M)
        turn = turns[turn_index]
        card_text = ""
        render_value = render.group(1) if render else ""
        card_match = re.fullmatch(r"figma-card:cards/([^/]+\.json)", render_value)
        if card_match:
            card_path = CARDS / card_match.group(1)
            if card_path.exists():
                card = json.loads(card_path.read_text())
                card_text = " | ".join(
                    str(card.get(k, ""))
                    for k in ("headline", "subhead", "columns", "items", "footer")
                    if card.get(k)
                )
        shots.append({
            "shot": sid,
            "segment": segment,
            "turn": turn_index,
            "start_ms": turn["start_ms"],
            "end_ms": turn["end_ms"],
            "first_15_words": " ".join(x["w"] for x in word_rows[turn_index]["words"][:15]),
            "turn_text": word_rows[turn_index]["text"],
            "render": render_value,
            "holds": holds.group(1) if holds else "",
            "title": title,
            "note": note.group(1) if note else "",
            "card_text": card_text,
        })
        seg = re.search(r"<!-- SEG (\d{2})", block)
        if seg:
            segment = int(seg.group(1))
    if len(shots) != len(turns):
        raise ValueError(f"shot list has {len(shots)} shots, manifest has {len(turns)} turns")
    return shots


def extract_one(row: dict, offset: float, scratch: Path) -> dict:
    video = PREVIEW / f"SEG{row['segment']:02d}.mp4"
    frame = scratch / f"{row['shot']}.png"
    seconds = offset + (row["end_ms"] - row["start_ms"]) / 2000
    command = [
        "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y",
        "-ss", f"{seconds:.3f}", "-i", str(video), "-frames:v", "1",
        "-vf", "scale=1440:-1", str(frame),
    ]
    subprocess.run(command, check=True)
    ocr_result = subprocess.run(
        ["tesseract", str(frame), "stdout", "--psm", "11"],
        capture_output=True, text=True,
    )
    row["midpoint_s"] = round((row["start_ms"] + row["end_ms"]) / 2000, 3)
    row["segment_offset_s"] = round(seconds, 3)
    row["ocr"] = re.sub(r"\s+", " ", ocr_result.stdout.strip())
    if ocr_result.returncode:
        row["ocr_error"] = ocr_result.stderr.strip()
    return row


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--only-segment", type=int, action="append")
    args = parser.parse_args()
    shots = parse_shots()
    if args.only_segment is not None:
        shots = [row for row in shots if row["segment"] in args.only_segment]
    segment_starts = {}
    for row in shots:
        segment_starts.setdefault(row["segment"], row["start_ms"])
    with tempfile.TemporaryDirectory(prefix="yt02_sync_frames_") as temp:
        scratch = Path(temp)
        jobs = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for row in shots:
                offset = (row["start_ms"] - segment_starts[row["segment"]]) / 1000
                jobs.append(pool.submit(extract_one, row, offset, scratch))
            rows = [job.result() for job in concurrent.futures.as_completed(jobs)]
    rows.sort(key=lambda row: row["turn"])
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
    print(f"audited {len(rows)} midpoint frames into {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
