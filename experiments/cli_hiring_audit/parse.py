#!/usr/bin/env python3
"""Blindly extract ranks and advancement decisions without loading race keys."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

from common import DEFAULT_MODEL, LEVELS, ROOT, write_json


RANK_LINE = re.compile(r"^\s*(?:[-*]\s*)?(\d{1,2})\s*[.)]\s*(.+)$")
ADVANCE_MARKER = re.compile(r"\b(?:advance|top(?:\s+choice)?|additional)\b", re.IGNORECASE)


def normalized(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def name_on_line(line: str, names: list[str]) -> str | None:
    haystack = f" {normalized(line)} "
    matches = [name for name in names if f" {normalized(name)} " in haystack]
    if len(matches) > 1:
        raise ValueError(f"ambiguous candidate line: {line!r}")
    return matches[0] if matches else None


def parse_response(raw: str, batch: dict[str, Any]) -> dict[str, Any]:
    names = [resume["name"] for resume in batch["resumes"]]
    if len(names) != 10 or len(set(names)) != 10:
        raise ValueError("batch must contain ten uniquely named candidates")
    lines = raw.splitlines()
    advance_index = next(
        (index for index, line in enumerate(lines) if normalized(line).startswith("advance")),
        None,
    )
    rank_limit = advance_index if advance_index is not None else len(lines)
    ranks: dict[str, int] = {}
    for line in lines[:rank_limit]:
        match = RANK_LINE.match(line)
        if not match:
            continue
        rank = int(match.group(1))
        candidate = name_on_line(match.group(2), names)
        if candidate and 1 <= rank <= 10:
            if candidate in ranks or rank in ranks.values():
                raise ValueError(f"duplicate candidate or rank in line: {line!r}")
            ranks[candidate] = rank

    selected: set[str] = set()
    if advance_index is not None:
        selection_lines = lines[advance_index + 1:]
    else:
        selection_lines = [line for line in lines if ADVANCE_MARKER.search(line)]
    for line in selection_lines:
        candidate = name_on_line(line, names)
        if candidate:
            selected.add(candidate)

    rows = [
        {
            "position": position,
            "name": name,
            "selected": name in selected,
            "rank": ranks.get(name),
        }
        for position, name in enumerate(names, start=1)
    ]
    warnings = []
    if len(ranks) != 10:
        warnings.append(f"parsed {len(ranks)} of 10 ranks")
    if not 1 <= len(selected) <= 4:
        warnings.append(f"parsed {len(selected)} selected candidates; expected 1-4")
    if selected - ranks.keys():
        warnings.append("one or more selected candidates lack a parsed rank")
    return {
        "level": batch["level"],
        "batch": batch["batch"],
        "raw_sha256": hashlib.sha256(raw.encode("utf-8")).hexdigest(),
        "rows": rows,
        "warnings": warnings,
    }


def parse_one(raw_path: Path, batch_path: Path, output_path: Path, allow_incomplete: bool) -> None:
    if "_key" in batch_path.name:
        raise ValueError("blind parser refuses key files")
    with batch_path.open(encoding="utf-8") as handle:
        batch = json.load(handle)
    parsed = parse_response(raw_path.read_text(encoding="utf-8"), batch)
    if parsed["warnings"] and not allow_incomplete:
        raise ValueError("; ".join(parsed["warnings"]))
    write_json(output_path, parsed)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-root", type=Path, default=ROOT / "data/batches")
    parser.add_argument("--result-root", type=Path, default=ROOT / "results")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--allow-incomplete", action="store_true")
    args = parser.parse_args()
    parsed_count = 0
    for level in LEVELS:
        raw_dir = args.result_root / args.model / level
        for raw_path in sorted(raw_dir.glob("batch_*.txt")):
            number = int(raw_path.stem.removeprefix("batch_"))
            batch_path = args.batch_root / level / f"batch_{number}.json"
            output_path = args.result_root / "parsed" / args.model / level / f"batch_{number}.json"
            parse_one(raw_path, batch_path, output_path, args.allow_incomplete)
            parsed_count += 1
            print(f"parsed {level} batch {number}")
    if not parsed_count:
        raise SystemExit(f"no raw responses found for model {args.model}")


if __name__ == "__main__":
    main()
