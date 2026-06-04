"""CI runner — fan-out job function for the Counter-Interference pipeline.

Submitted to job_runner.submit_job. Mirrors the structure of curriculum.ingest_source.
"""

from __future__ import annotations

import datetime
import time
import uuid
from typing import Any

from . import ci_firewall, store_manager
from .providers import get_provider
from .providers import throttle_state

INTER_PROVIDER_DELAY_SECONDS: int = 2

# ---------------------------------------------------------------------------
# Module-level pending DPO buffer
# Populated by run_ci; consumed by /ci/review in server.py.
# ---------------------------------------------------------------------------

_pending_dpo: dict[str, dict] = {}


def get_pending_pair(pair_id: str) -> dict | None:
    """Return the pending DPO pair with *pair_id*, or None."""
    return _pending_dpo.get(pair_id)


def pop_pending_pair(pair_id: str) -> dict | None:
    """Remove and return the pending DPO pair with *pair_id*, or None."""
    return _pending_dpo.pop(pair_id, None)


def store_pending_pair(pair: dict) -> None:
    """Insert *pair* into the pending buffer keyed by its id."""
    _pending_dpo[pair["id"]] = pair


# ---------------------------------------------------------------------------
# Job function
# ---------------------------------------------------------------------------

def run_ci(
    event_queue,
    prompt: str,
    active_provider_ids: list[str],
    domain: str | None,
) -> None:
    """Job function submitted to job_runner.submit_job.

    Emits structured events on *event_queue* for each provider and on completion.
    """
    job_id = str(uuid.uuid4())

    def emit(event: str, **payload: Any) -> None:
        data: dict[str, Any] = {"job_id": job_id}
        data.update(payload)
        event_queue.put({"event": event, "data": data})

    emit("job.started", kind="ci")

    pairs_generated = 0

    for idx, provider_id in enumerate(active_provider_ids):
        # Human-paced throttling between providers (skip delay before first).
        if idx > 0:
            time.sleep(INTER_PROVIDER_DELAY_SECONDS)

        # Throttle check.
        if throttle_state.is_throttled(provider_id):
            countdown = throttle_state.throttle_countdown(provider_id)
            emit("ci.provider.skipped", provider_id=provider_id,
                 reason="throttled", countdown=countdown)
            continue

        provider = get_provider(provider_id)
        if provider is None or not provider._check_available():
            emit("ci.provider.unavailable", provider_id=provider_id)
            store_manager.append_item(store_manager.ERRORS_QUEUE, {
                "id":          str(uuid.uuid4()),
                "provider_id": provider_id,
                "step":        "availability_check",
                "error":       "provider unavailable or binary not on PATH",
                "created_at":  datetime.datetime.utcnow().isoformat() + "Z",
            })
            continue

        emit("ci.provider.running", provider_id=provider_id)
        result = provider.query(prompt)

        if result.status == "throttled":
            throttle_state.set_throttled(provider_id, duration_seconds=60)
            countdown = throttle_state.throttle_countdown(provider_id)
            emit("ci.provider.throttled", provider_id=provider_id, countdown=countdown)
            store_manager.append_item(store_manager.ERRORS_QUEUE, {
                "id":          str(uuid.uuid4()),
                "provider_id": provider_id,
                "step":        "query",
                "error":       result.error,
                "status":      "throttled",
                "created_at":  datetime.datetime.utcnow().isoformat() + "Z",
            })
            continue

        if result.status in ("failed", "unavailable"):
            emit("ci.provider.failed", provider_id=provider_id, error=result.error)
            store_manager.append_item(store_manager.ERRORS_QUEUE, {
                "id":          str(uuid.uuid4()),
                "provider_id": provider_id,
                "step":        "query",
                "error":       result.error,
                "status":      result.status,
                "created_at":  datetime.datetime.utcnow().isoformat() + "Z",
            })
            continue

        if result.status == "unparseable":
            emit("ci.provider.unparseable", provider_id=provider_id)
            store_manager.append_item(store_manager.ERRORS_QUEUE, {
                "id":          str(uuid.uuid4()),
                "provider_id": provider_id,
                "step":        "query",
                "error":       result.error,
                "status":      "unparseable",
                "created_at":  datetime.datetime.utcnow().isoformat() + "Z",
            })
            continue

        # Firewall pass.
        detected = ci_firewall.detect_obfuscation(result.raw)
        reconstruction = ci_firewall.reconstruct_framework(prompt, result.raw, detected)
        pair = ci_firewall.build_dpo_pair(
            prompt, provider_id, result.raw, reconstruction, domain
        )

        # Stash in pending buffer for /ci/review.
        store_pending_pair(pair)
        pairs_generated += 1

        emit(
            "ci.provider.result",
            provider_id=provider_id,
            raw=result.raw,
            detected=detected,
            reconstruction=reconstruction,
            pair_id=pair["id"],
        )

    emit("ci.complete", pairs_generated=pairs_generated)
