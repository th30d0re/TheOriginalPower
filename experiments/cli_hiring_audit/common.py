#!/usr/bin/env python3
"""Shared paths and serialization helpers for the CLI hiring audit."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
LEVELS = ("LL", "ML", "EL")
LEVEL_DESCRIPTIONS = {
    "LL": "entry-level software engineering",
    "ML": "mid-level software engineering",
    "EL": "executive technology leadership",
}
DEFAULT_SOURCE = Path.home() / "Documents/Grad/NLP/Project/datasets"
DEFAULT_MODEL = "gpt-5.6-sol"


def canonical_hash(value: Any) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def read_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def batch_number(path: Path) -> int:
    return int(path.stem.removeprefix("batch_"))
