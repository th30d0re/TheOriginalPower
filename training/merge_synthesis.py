#!/usr/bin/env python3
"""
merge_synthesis.py — Inject framework_synthesis_v3.jsonl into the main dataset.

Usage:
    source .venv-voice/bin/activate
    python3 training/merge_synthesis.py
"""
from __future__ import annotations

import json
import random
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "training" / "data"
SYNTHESIS_PATH = DATA_DIR / "framework_synthesis_v3.jsonl"
TRAIN_PATH = DATA_DIR / "train.jsonl"
VALID_PATH = DATA_DIR / "valid.jsonl"

random.seed(42)


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    records = []
    for line in path.read_text(encoding="utf-8").strip().splitlines():
        if line:
            records.append(json.loads(line))
    return records


def main() -> int:
    if not SYNTHESIS_PATH.exists():
        print(f"Synthesis file not found: {SYNTHESIS_PATH}", file=sys.stderr)
        return 1

    synthesis = load_jsonl(SYNTHESIS_PATH)
    if not synthesis:
        print("No records in synthesis file.", file=sys.stderr)
        return 1

    train = load_jsonl(TRAIN_PATH)
    valid = load_jsonl(VALID_PATH)

    # Append synthesis to training set (or split if you prefer)
    # Given the small size (14 examples), dump all into train to avoid losing them
    # in a tiny validation slice.
    combined = train + synthesis

    # Optional: reshuffle to prevent synthesis examples from clustering at the end
    random.shuffle(combined)

    with TRAIN_PATH.open("w", encoding="utf-8") as f:
        for r in combined:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    # Keep validation untouched
    with VALID_PATH.open("w", encoding="utf-8") as f:
        for r in valid:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"Injected {len(synthesis)} synthesis examples.")
    print(f"Train: {len(combined)} | Val: {len(valid)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
