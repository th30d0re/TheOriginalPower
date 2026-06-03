"""Curriculum ingestion module — NotebookLM CLI wrapper and adversarial reframing pipeline.

Provides:
    - Domain notebook registry backed by harness/data/curriculum_notebooks.json
    - nlm subprocess wrapper (nlm_run, nlm_add_source, nlm_ask_question, nlm_get_study_artifacts)
    - FRAMEWORK_QUESTIONS: question set for teacher-mode probing
    - reframe_to_training_pairs: builds instruction-tuning pairs from captured content
    - ingest_source: top-level job function submitted to job_runner
"""

from __future__ import annotations

import datetime
import json
import os
import subprocess
import uuid
from pathlib import Path
from typing import Any

from . import store_manager
from .scorer import SYSTEM_PROMPT

# ---------------------------------------------------------------------------
# Domain registry
# ---------------------------------------------------------------------------

DOMAINS: dict[str, str] = {
    "legal_history":         "Legal History",
    "engineering_physics":   "Engineering/Physics",
    "political_philosophy":  "Political Philosophy",
    "sociology_race":        "Sociology/Race",
}

_NOTEBOOKS_FILE = store_manager.DATA_DIR / "curriculum_notebooks.json"


def _read_notebooks() -> dict[str, str]:
    if not _NOTEBOOKS_FILE.exists():
        return {}
    try:
        return json.loads(_NOTEBOOKS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def _write_notebooks(data: dict[str, str]) -> None:
    store_manager.DATA_DIR.mkdir(parents=True, exist_ok=True)
    tmp = _NOTEBOOKS_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, _NOTEBOOKS_FILE)


def get_notebook_id(domain: str) -> str | None:
    """Return the persisted nlm notebook ID for *domain*, or None."""
    return _read_notebooks().get(domain)


def set_notebook_id(domain: str, nlm_id: str) -> None:
    """Persist *nlm_id* for *domain* atomically."""
    data = _read_notebooks()
    data[domain] = nlm_id
    _write_notebooks(data)


# ---------------------------------------------------------------------------
# nlm subprocess wrapper
# ---------------------------------------------------------------------------

def nlm_run(args: list[str], timeout: int = 300) -> tuple[bool, str]:
    """Thin wrapper around subprocess.run that captures stdout+stderr.

    Returns (success, output).
    """
    try:
        result = subprocess.run(
            ["nlm"] + args,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        output = result.stdout + result.stderr
        return result.returncode == 0, output
    except FileNotFoundError:
        return False, "nlm binary not found on PATH"
    except subprocess.TimeoutExpired:
        return False, f"nlm command timed out after {timeout}s"


def nlm_add_source(notebook_id: str, url: str) -> tuple[bool, str]:
    return nlm_run(
        ["source", "add", notebook_id, "--url", url, "--wait", "--wait-timeout", "600"],
        timeout=660,
    )


def nlm_ask_question(notebook_id: str, question: str) -> tuple[bool, str]:
    return nlm_run(["query", notebook_id, question], timeout=120)


def nlm_get_study_artifacts(notebook_id: str) -> tuple[bool, str]:
    return nlm_run(["notes", notebook_id], timeout=120)


# ---------------------------------------------------------------------------
# Framework question set
# ---------------------------------------------------------------------------

FRAMEWORK_QUESTIONS: list[str] = [
    "Map the primary actors in this source to the 5-tier ontology: "
    "identify which entities occupy the Extraction Kernel (Tier 1), "
    "Buffer Class (Tier 2-3), and Managed Population (Tier 4-5).",

    "Identify concrete instances of predatory min-max operations in this source — "
    "where is wealth extracted from one tier and concentrated in another, "
    "and what mechanisms enforce the asymmetry?",

    "Describe how tri-modal enclosure (physical, legal, epistemic) appears in this source. "
    "Which of the three modalities is dominant and what evidence supports that?",

    "What anti-extraction priors does this source reveal — beliefs, practices, or structures "
    "that constrain or resist extraction — and how are they undermined or co-opted?",

    "Synthesize the key structural finding of this source in terms of the framework: "
    "what does it reveal about the durability and maintenance of the extraction engine?",
]


# ---------------------------------------------------------------------------
# Adversarial reframing pipeline
# ---------------------------------------------------------------------------

def reframe_to_training_pairs(
    source_id: str,
    domain: str,
    item_type: str,
    raw_text: str,
) -> list[dict[str, Any]]:
    """Build instruction-tuning pairs from *raw_text*.

    Each pair follows the messages schema:
        [{"role": "system", "content": SYSTEM_PROMPT},
         {"role": "user",   "content": <text>}]

    Sets item_type, domain, content_sha, review_state="staged".
    """
    if not raw_text.strip():
        return []

    sha = store_manager.content_sha(raw_text)
    now = datetime.datetime.utcnow().isoformat() + "Z"

    pair: dict[str, Any] = {
        "id": str(uuid.uuid4()),
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": raw_text.strip()},
        ],
        "domain":       domain,
        "item_type":    item_type,
        "source_id":    source_id,
        "content_sha":  sha,
        "review_state": "staged",
        "created_at":   now,
    }
    return [pair]


# ---------------------------------------------------------------------------
# Main ingestion job
# ---------------------------------------------------------------------------

def ingest_source(
    event_queue,
    notebook_id: str,
    domain: str,
    url: str,
    source_id: str,
) -> None:
    """Job function submitted to job_runner.submit_job.

    Emits source.status events on *event_queue* throughout processing.
    Unparseable nlm output is routed to ERRORS_QUEUE, not dropped.
    """

    def emit(status: str, **extra: Any) -> None:
        payload: dict[str, Any] = {"source_id": source_id, "status": status}
        payload.update(extra)
        event_queue.put({"event": "source.status", "data": payload})

    emit("queued")

    # --- Add source ---
    emit("transcribing")
    success, output = nlm_add_source(notebook_id, url)
    if not success:
        emit("error", detail=output[:500])
        store_manager.append_item(store_manager.ERRORS_QUEUE, {
            "id":         str(uuid.uuid4()),
            "source_id":  source_id,
            "domain":     domain,
            "url":        url,
            "step":       "add_source",
            "output":     output[:2000],
            "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        })
        return

    pairs_added = 0

    # Treat the source-add output itself as a transcript artifact.
    transcript_text = output.strip()
    if transcript_text:
        for pair in reframe_to_training_pairs(source_id, domain, "transcript", transcript_text):
            result = store_manager.gated_append(store_manager.STAGING, pair)
            if result.get("accepted"):
                pairs_added += 1

    # --- Framework Q&A ---
    for question in FRAMEWORK_QUESTIONS:
        ok, qa_output = nlm_ask_question(notebook_id, question)
        if not ok or not qa_output.strip():
            store_manager.append_item(store_manager.ERRORS_QUEUE, {
                "id":         str(uuid.uuid4()),
                "source_id":  source_id,
                "domain":     domain,
                "step":       "ask_question",
                "question":   question,
                "output":     qa_output[:2000],
                "created_at": datetime.datetime.utcnow().isoformat() + "Z",
            })
            continue

        qa_text = f"Q: {question}\n\nA: {qa_output.strip()}"
        for pair in reframe_to_training_pairs(source_id, domain, "qa", qa_text):
            result = store_manager.gated_append(store_manager.STAGING, pair)
            if result.get("accepted"):
                pairs_added += 1

    # --- Study artifacts ---
    ok, artifacts_output = nlm_get_study_artifacts(notebook_id)
    if ok and artifacts_output.strip():
        for pair in reframe_to_training_pairs(
            source_id, domain, "study_artifact", artifacts_output.strip()
        ):
            result = store_manager.gated_append(store_manager.STAGING, pair)
            if result.get("accepted"):
                pairs_added += 1
    elif not ok:
        store_manager.append_item(store_manager.ERRORS_QUEUE, {
            "id":         str(uuid.uuid4()),
            "source_id":  source_id,
            "domain":     domain,
            "step":       "study_artifacts",
            "output":     artifacts_output[:2000],
            "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        })

    emit("ready", pairs_added=pairs_added)
