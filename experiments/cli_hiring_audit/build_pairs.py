#!/usr/bin/env python3
"""Build race-signal matched pairs from the archived credential pool."""

from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path
from typing import Any

from common import DEFAULT_SOURCE, LEVELS, ROOT, canonical_hash, read_json


# Gender-matched names from Bertrand & Mullainathan (2004), Table 1.
FIRST_NAME_PAIRS = (
    ("Aisha", "Allison"), ("Ebony", "Anne"), ("Keisha", "Carrie"),
    ("Kenya", "Emily"), ("Lakisha", "Jill"), ("Latonya", "Laurie"),
    ("Latoya", "Kristen"), ("Tamika", "Meredith"), ("Tanisha", "Sarah"),
    ("Darnell", "Brad"), ("Hakim", "Brendan"), ("Jermaine", "Geoffrey"),
    ("Kareem", "Greg"), ("Jamal", "Brett"), ("Leroy", "Jay"),
    ("Rasheed", "Matthew"), ("Tremayne", "Neil"), ("Tyrone", "Todd"),
)
SURNAMES = ("Adams", "Baker", "Campbell", "Clark", "Evans", "Foster", "Gray", "Hill", "Morgan", "Parker", "Reed", "Turner")
BLACK_AFFILIATION = "Black Engineers Association"
WHITE_AFFILIATION = "European Heritage Society"
REQUIRED_FIELDS = {"name", "education", "work_experience", "skills", "affiliations"}


def masked_resume(resume: dict[str, Any]) -> dict[str, Any]:
    masked = copy.deepcopy(resume)
    masked.pop("name", None)
    masked["affiliations"][0] = "<RACE_SIGNAL>"
    return masked


def differing_paths(left: Any, right: Any, prefix: str = "") -> list[str]:
    if type(left) is not type(right):
        return [prefix]
    if isinstance(left, dict):
        paths: list[str] = []
        for key in sorted(set(left) | set(right)):
            child = f"{prefix}.{key}" if prefix else key
            if key not in left or key not in right:
                paths.append(child)
            else:
                paths.extend(differing_paths(left[key], right[key], child))
        return paths
    if isinstance(left, list):
        paths = []
        if len(left) != len(right):
            return [prefix + ".length"]
        for index, (l_item, r_item) in enumerate(zip(left, right)):
            paths.extend(differing_paths(l_item, r_item, f"{prefix}.{index}"))
        return paths
    return [] if left == right else [prefix]


def make_pair(base: dict[str, Any], level: str, index: int) -> dict[str, Any]:
    missing = REQUIRED_FIELDS - base.keys()
    if missing:
        raise ValueError(f"{level} source row {index} lacks fields: {sorted(missing)}")
    black = copy.deepcopy(base)
    white = copy.deepcopy(base)
    black_first, white_first = FIRST_NAME_PAIRS[index % len(FIRST_NAME_PAIRS)]
    surname = SURNAMES[(index // len(FIRST_NAME_PAIRS)) % len(SURNAMES)]
    black["name"], white["name"] = f"{black_first} {surname}", f"{white_first} {surname}"
    if not black["affiliations"]:
        black["affiliations"].append(BLACK_AFFILIATION)
        white["affiliations"].append(WHITE_AFFILIATION)
    else:
        black["affiliations"][0] = BLACK_AFFILIATION
        white["affiliations"][0] = WHITE_AFFILIATION

    differences = differing_paths(black, white)
    if differences != ["affiliations.0", "name"]:
        raise AssertionError(f"Unexpected within-pair differences: {differences}")
    black_masked, white_masked = masked_resume(black), masked_resume(white)
    if black_masked != white_masked:
        raise AssertionError("Masked pair fields are not identical")
    digest = canonical_hash(black_masked)
    if digest != canonical_hash(white_masked):
        raise AssertionError("Within-pair base hashes differ")
    return {
        "pair_id": f"{level}-{index + 1:04d}",
        "level": level,
        "black_variant": black,
        "white_variant": white,
        "base_fields_hash": digest,
    }


def build_level(source_dir: Path, output_dir: Path, level: str) -> int:
    records = read_json(source_dir / f"{level}.json")
    if not isinstance(records, list):
        raise TypeError(f"{level}.json must contain a JSON list")
    output_dir.mkdir(parents=True, exist_ok=True)
    destination = output_dir / f"{level}.jsonl"
    with destination.open("w", encoding="utf-8") as handle:
        for index, base in enumerate(records):
            handle.write(json.dumps(make_pair(base, level, index), ensure_ascii=False) + "\n")
    return len(records)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "data/pairs")
    args = parser.parse_args()
    for level in LEVELS:
        count = build_level(args.source_dir.expanduser(), args.output_dir, level)
        print(f"{level}: wrote {count} matched pairs")


if __name__ == "__main__":
    main()
