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

def normalize_text(text: str) -> str:
    """
    Canonical normalization for dedup: strip leading/trailing whitespace and
    collapse all internal whitespace runs (spaces, tabs, newlines) to a single
    space. Dedup operates on this representation so that formatting-only edits
    do not produce a new hash.
    """
    return " ".join(text.split())


def content_sha(text: str) -> str:
    """Return SHA-256 hex digest of the normalized form of *text* — the dedup key."""
    return hashlib.sha256(normalize_text(text).encode("utf-8")).hexdigest()


def check_duplicate(store: Path, sha: str) -> bool:
    """Return True if any line in the JSONL store has content_sha == sha."""
    for item in read_jsonl(store):
        if item.get("content_sha") == sha:
            return True
    return False


# ---------------------------------------------------------------------------
# Manifest upsert
# ---------------------------------------------------------------------------

def upsert_manifest(entry: dict) -> None:
    """
    Merge *entry* into the manifest JSON by its ``id`` field and write atomically.

    If the manifest already contains a record with the same ``id``, it is
    replaced in-place; otherwise the entry is appended.
    """
    if "id" not in entry:
        raise ValueError("manifest entry must contain an 'id' field")
    _ensure_data_dir()
    current = read_manifest()
    current[entry["id"]] = entry
    tmp = MANIFEST.with_suffix(".tmp")
    tmp.write_text(json.dumps(current, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, MANIFEST)


# ---------------------------------------------------------------------------
# Audit log append
# ---------------------------------------------------------------------------

def append_audit(entry: dict) -> None:
    """Append *entry* to the audit log."""
    append_item(AUDIT_LOG, entry)


# ---------------------------------------------------------------------------
# Gated append (dedup-on-entry for all write paths)
# ---------------------------------------------------------------------------

def gated_append(store: Path, item: dict) -> dict:
    """
    Append *item* to *store* only if no existing record shares the same
    ``content_sha``.

    The caller must have already computed ``item["content_sha"]`` before
    calling this function (or pass a ``content`` field from which the SHA
    is derived here).

    Returns:
        {"accepted": True}  — item was written and manifest updated.
        {"accepted": False, "reason": "duplicate", "existing_id": <id|None>}
    """
    sha = item.get("content_sha")
    if sha is None:
        raw = item.get("content", "")
        sha = content_sha(raw)
        item = {**item, "content_sha": sha}

    if check_duplicate(store, sha):
        existing_id: str | None = None
        for record in read_jsonl(store):
            if record.get("content_sha") == sha:
                existing_id = record.get("id")
                break
        return {"accepted": False, "reason": "duplicate", "existing_id": existing_id}

    append_item(store, item)

    manifest_entry = {
        "id": item.get("id", sha),
        "content_sha": sha,
        "store": str(store.name),
        "created_at": item.get("meta", {}).get("created_at") or item.get("created_at"),
    }
    upsert_manifest(manifest_entry)

    return {"accepted": True}
