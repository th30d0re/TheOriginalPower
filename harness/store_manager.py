"""Store path constants and stub accessors for all harness JSONL stores.

All functions raise NotImplementedError — functional implementations come in T3+.
"""

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


def read_manifest() -> dict:
    raise NotImplementedError("store_manager.read_manifest is not implemented until T3")


def append_item(store: Path, item: dict) -> None:
    raise NotImplementedError("store_manager.append_item is not implemented until T3")


def read_staging() -> list:
    raise NotImplementedError("store_manager.read_staging is not implemented until T3")


def promote_staging_item(item_id: str) -> dict:
    raise NotImplementedError("store_manager.promote_staging_item is not implemented until T3")


def read_eval_thresholds() -> dict:
    raise NotImplementedError("store_manager.read_eval_thresholds is not implemented until T3")


def write_eval_thresholds(thresholds: dict) -> None:
    raise NotImplementedError("store_manager.write_eval_thresholds is not implemented until T3")


def read_audit_log(limit: int = 100) -> list:
    raise NotImplementedError("store_manager.read_audit_log is not implemented until T3")
