"""Store path constants and accessors for all harness JSONL/JSON stores."""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

# Store file paths
INSTRUCTION_DATASET  = DATA_DIR / "instruction_dataset.jsonl"
DPO_PAIRS            = DATA_DIR / "dpo_pairs.jsonl"
STAGING              = DATA_DIR / "staging.jsonl"
ERRORS_QUEUE         = DATA_DIR / "errors_queue.jsonl"
MANIFEST             = DATA_DIR / "manifest.json"
AUDIT_LOG            = DATA_DIR / "audit_log.jsonl"
EVAL_THRESHOLDS      = DATA_DIR / "eval_thresholds.json"
EVAL_HISTORY         = DATA_DIR / "eval_history.jsonl"

_DEFAULT_THRESHOLDS = {
    "recall": 0.80,
    "refusal": 0.10,
    "classification": 0.75,
    "lexicalFractal": 0.70,
    "weights": {
        "recall": 0.25,
        "refusal": 0.25,
        "classification": 0.25,
        "lexicalFractal": 0.25,
    },
}


# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------

def _ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def read_jsonl(store: Path) -> list:
    """Read all lines from a JSONL file; return [] if absent or empty."""
    if not store.exists():
        return []
    lines = []
    with store.open("r", encoding="utf-8") as fh:
        for raw in fh:
            raw = raw.strip()
            if raw:
                try:
                    lines.append(json.loads(raw))
                except json.JSONDecodeError:
                    pass
    return lines


# ---------------------------------------------------------------------------
# Manifest
# ---------------------------------------------------------------------------

def read_manifest() -> dict:
    if not MANIFEST.exists():
        return {}
    try:
        return json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


# ---------------------------------------------------------------------------
# Generic append
# ---------------------------------------------------------------------------

def append_item(store: Path, item: dict) -> None:
    """Append a JSON line to *store*; create file and parent dirs if absent."""
    _ensure_data_dir()
    store.parent.mkdir(parents=True, exist_ok=True)
    with store.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(item, ensure_ascii=False) + "\n")


# ---------------------------------------------------------------------------
# Staging
# ---------------------------------------------------------------------------

def read_staging() -> list:
    return read_jsonl(STAGING)


def promote_staging_item(item_id: str) -> dict:
    """Find item in staging by id, set review_state='promoted', rewrite file, return item."""
    items = read_staging()
    target = None
    for item in items:
        if item.get("id") == item_id:
            item["review_state"] = "promoted"
            target = item
            break
    if target is None:
        raise KeyError(f"staging item not found: {item_id!r}")
    _ensure_data_dir()
    with STAGING.open("w", encoding="utf-8") as fh:
        for item in items:
            fh.write(json.dumps(item, ensure_ascii=False) + "\n")
    return target


# ---------------------------------------------------------------------------
# Eval thresholds
# ---------------------------------------------------------------------------

def read_eval_thresholds() -> dict:
    if not EVAL_THRESHOLDS.exists():
        return dict(_DEFAULT_THRESHOLDS)
    try:
        data = json.loads(EVAL_THRESHOLDS.read_text(encoding="utf-8"))
        return data
    except (json.JSONDecodeError, OSError):
        return dict(_DEFAULT_THRESHOLDS)


def write_eval_thresholds(thresholds: dict) -> None:
    """Write thresholds atomically (write to .tmp then rename)."""
    _ensure_data_dir()
    tmp = EVAL_THRESHOLDS.with_suffix(".tmp")
    tmp.write_text(json.dumps(thresholds, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, EVAL_THRESHOLDS)


# ---------------------------------------------------------------------------
# Audit log
# ---------------------------------------------------------------------------

def read_audit_log(limit: int = 100) -> list:
    """Read the last *limit* lines from audit_log.jsonl."""
    all_entries = read_jsonl(AUDIT_LOG)
    return all_entries[-limit:] if limit > 0 else all_entries


# ---------------------------------------------------------------------------
# Eval history
# ---------------------------------------------------------------------------

def read_eval_history() -> list:
    return read_jsonl(EVAL_HISTORY)


def append_eval_run(run: dict) -> None:
    """Append an EvalRun dict to eval_history.jsonl."""
    append_item(EVAL_HISTORY, run)


# ---------------------------------------------------------------------------
# Content dedup
# ---------------------------------------------------------------------------

def content_sha(text: str) -> str:
    """Return SHA-256 hex digest of *text* — the dedup key."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def check_duplicate(store: Path, sha: str) -> bool:
    """Return True if any line in the JSONL store has content_sha == sha."""
    for item in read_jsonl(store):
        if item.get("content_sha") == sha:
            return True
    return False
