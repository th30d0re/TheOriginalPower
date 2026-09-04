#!/usr/bin/env python3
"""Assemble blinded batches of five complete matched pairs."""

from __future__ import annotations

import argparse
import json
import random
from pathlib import Path
from typing import Any

from common import LEVELS, ROOT, write_json


def load_pairs(path: Path) -> list[dict[str, Any]]:
    with path.open(encoding="utf-8") as handle:
        return [json.loads(line) for line in handle if line.strip()]


def assemble_level(pair_dir: Path, batch_root: Path, level: str, count: int, seed: int) -> None:
    pairs = load_pairs(pair_dir / f"{level}.jsonl")
    required = count * 5
    if required > len(pairs):
        raise ValueError(f"{level}: {count} batches require {required} pairs; only {len(pairs)} exist")
    rng = random.Random(seed + {"LL": 0, "ML": 10_000, "EL": 20_000}[level])
    chosen = rng.sample(pairs, required)
    output_dir = batch_root / level
    output_dir.mkdir(parents=True, exist_ok=True)
    for batch_index in range(count):
        entries: list[tuple[dict[str, Any], dict[str, str]]] = []
        batch_pairs = chosen[batch_index * 5:(batch_index + 1) * 5]
        for pair in batch_pairs:
            for race in ("black", "white"):
                entries.append(
                    (
                        pair[f"{race}_variant"],
                        {"pair_id": pair["pair_id"], "race": race},
                    )
                )
        rng.shuffle(entries)
        resumes = [resume for resume, _ in entries]
        key = {
            str(position): metadata
            for position, (_, metadata) in enumerate(entries, start=1)
        }
        batch_number = batch_index + 1
        write_json(
            output_dir / f"batch_{batch_number}.json",
            {"level": level, "batch": batch_number, "resumes": resumes},
        )
        write_json(output_dir / f"batch_{batch_number}_key.json", key)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pair-dir", type=Path, default=ROOT / "data/pairs")
    parser.add_argument("--batch-root", type=Path, default=ROOT / "data/batches")
    parser.add_argument("--count", type=int, default=15)
    parser.add_argument("--seed", type=int, default=20260903)
    args = parser.parse_args()
    if args.count < 1:
        parser.error("--count must be positive")
    for level in LEVELS:
        assemble_level(args.pair_dir, args.batch_root, level, args.count, args.seed)
        print(f"{level}: wrote {args.count} blinded batches")


if __name__ == "__main__":
    main()
