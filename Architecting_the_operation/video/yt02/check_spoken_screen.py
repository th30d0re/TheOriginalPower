#!/usr/bin/env python3
"""Advisory spoken/screen phrase report for YT02v2.

Known misses from the 2026-10-28 author review:
- N3: wetware is on screen at "where the literature ends."
- N5: the boundary card is held away from its spoken definition.
- N9: E(t) appears on screen before the narration defines it.

The report is intentionally non-gating and always exits zero.
"""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SHOTLIST = ROOT / "Architecting_the_operation/video/YT02v2_shotlist.md"
SCRIPT = ROOT / "Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md"

SEGMENT_RE = re.compile(r"<!--\s*SEG\s+(\d+)")
SPEAKER_RE = re.compile(r"^[^<\n]+\(\d{1,3}:\d{2}\)\s*$")
SHOT_RE = re.compile(r"^##\s+(S\d{2}-\d{2})\b")
NOTE_RE = re.compile(r"^- \*\*Note:\*\*\s*(.+)$")
TOKEN_RE = re.compile(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*")

STOP_WORDS = {
    "about", "across", "after", "against", "along", "also", "before",
    "between", "book", "card", "chapter", "column", "during", "each",
    "equation", "figure", "first", "from", "highlight", "highlights",
    "hold", "holds", "illuminate", "illuminates", "introduces", "item",
    "main", "names", "note", "opens", "panel", "presents", "remains",
    "render", "reveals", "screen", "second", "section", "showing", "shows",
    "source", "states", "table", "term", "that", "their", "these", "third",
    "this", "through", "title", "while", "with", "within",
}


def normalize_tokens(text: str) -> set[str]:
    return {token.lower() for token in TOKEN_RE.findall(text)}


def significant_words(text: str) -> list[str]:
    words = []
    for token in TOKEN_RE.findall(text):
        word = token.lower()
        if len(word) < 4 or word in STOP_WORDS or word.isdigit():
            continue
        words.append(word)
    return list(dict.fromkeys(words))


def parse_script_blocks(text: str) -> dict[str, str]:
    blocks: dict[str, str] = {}
    segment: int | None = None
    ordinal = 0
    current_id: str | None = None
    current_lines: list[str] = []

    def finish() -> None:
        if current_id is not None:
            spoken = " ".join(
                line.strip()
                for line in current_lines
                if line.strip() and not line.lstrip().startswith("<!--")
            )
            blocks[current_id] = spoken

    for line in text.splitlines():
        segment_match = SEGMENT_RE.search(line)
        if segment_match:
            finish()
            segment = int(segment_match.group(1))
            ordinal = 0
            current_id = None
            current_lines = []
            continue

        if segment is not None and SPEAKER_RE.match(line):
            finish()
            ordinal += 1
            current_id = f"S{segment:02d}-{ordinal:02d}"
            current_lines = []
            continue

        if current_id is not None:
            current_lines.append(line)

    finish()
    return blocks


def parse_shot_notes(text: str) -> list[tuple[str, str]]:
    notes: list[tuple[str, str]] = []
    shot_id: str | None = None
    for line in text.splitlines():
        shot_match = SHOT_RE.match(line)
        if shot_match:
            shot_id = shot_match.group(1)
            continue
        note_match = NOTE_RE.match(line)
        if shot_id and note_match:
            note = re.sub(r"\s*\[[^]]+]\s*$", "", note_match.group(1)).strip()
            notes.append((shot_id, note))
    return notes


def named_phrases(note: str) -> list[str]:
    explicit = re.findall(r"`([^`]+)`|[\"“]([^\"”]+)[\"”]", note)
    phrases = [left or right for left, right in explicit if left or right]
    return phrases or [note]


def report() -> None:
    print("# YT02v2 spoken/screen phrase report")
    print("# Known miss N3: wetware at literature-ends")
    print("# Known miss N5: boundary card timing")
    print("# Known miss N9: undefined E(t)")

    script_blocks = parse_script_blocks(SCRIPT.read_text(encoding="utf-8"))
    shot_notes = parse_shot_notes(SHOTLIST.read_text(encoding="utf-8"))
    misses = 0
    mapped = 0
    unmapped = 0

    for shot_id, note in shot_notes:
        spoken = script_blocks.get(shot_id)
        if spoken is None:
            unmapped += 1
            print(f"UNMAPPED {shot_id}: no script block found")
            continue
        mapped += 1
        spoken_words = normalize_tokens(spoken)
        for phrase in named_phrases(note):
            words = significant_words(phrase)
            if len(words) < 2:
                continue
            if spoken_words.isdisjoint(words):
                misses += 1
                compact = " ".join(phrase.split())
                print(
                    f"MISS {shot_id}: screen words [{', '.join(words)}] "
                    f"absent from spoken block — {compact}"
                )

    print(
        f"SUMMARY shots={len(shot_notes)} mapped={mapped} "
        f"unmapped={unmapped} misses={misses}"
    )


def main() -> int:
    try:
        report()
    except Exception as error:  # The checker is a report, never a gate.
        print(f"REPORT ERROR: {error}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
