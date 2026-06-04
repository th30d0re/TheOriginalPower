"""Harness daemon entry point.

Start with:
    python -m harness.server
or via:
    make harness

Binds to 127.0.0.1:7331.
"""

from __future__ import annotations

import atexit
import datetime
import json
import queue as _queue
import uuid
from collections.abc import Iterator

from flask import Flask, Response, jsonify, request, stream_with_context

from . import auth, ci_firewall, ci_runner, curator, curriculum, job_runner, scorer, store_manager, train_worker
from .compute_probe import run_probe
from .providers import ALL_PROVIDERS, get_provider
from .providers import throttle_state

VERSION = "0.1.0"
HOST = "127.0.0.1"
PORT = 7331

app = Flask(__name__)

NOT_IMPLEMENTED = "not_implemented"


# ---------------------------------------------------------------------------
# Auth middleware
# ---------------------------------------------------------------------------

@app.before_request
def _check_token():
    return auth.require_token()


# ---------------------------------------------------------------------------
# Stub helpers (retained for un-migrated routes)
# ---------------------------------------------------------------------------

def _json_stub(body: dict, status: int = 501) -> tuple[Response, int]:
    return jsonify(body), status


def _sse_stub(events: list[tuple[str, dict]], status: int = 501) -> Response:
    """Return an SSE body with contract-shaped events (stub, not yet functional)."""

    def stream() -> Iterator[str]:
        for event_type, payload in events:
            yield f"event: {event_type}\n"
            yield f"data: {json.dumps(payload, separators=(',', ':'))}\n\n"

    return Response(stream(), status=status, mimetype="text/event-stream")


# ---------------------------------------------------------------------------
# Functional routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return jsonify({"version": VERSION, "status": "ok"})


@app.get("/probe")
def probe():
    profile = run_probe()
    return jsonify(profile)


# ---------------------------------------------------------------------------
# Eval routes
# ---------------------------------------------------------------------------

@app.get("/eval/thresholds")
def eval_thresholds_get():
    return jsonify(store_manager.read_eval_thresholds())


@app.put("/eval/thresholds")
def eval_thresholds_put():
    body = request.get_json(silent=True) or {}
    required_keys = {"recall", "refusal", "classification", "lexicalFractal", "weights"}
    missing = required_keys - body.keys()
    if missing:
        return jsonify({"status": "error", "detail": f"missing keys: {sorted(missing)}"}), 400
    for key in required_keys - {"weights"}:
        if not isinstance(body[key], (int, float)):
            return jsonify({"status": "error", "detail": f"{key} must be numeric"}), 400
    weights = body.get("weights", {})
    for wk in ("recall", "refusal", "classification", "lexicalFractal"):
        v = weights.get(wk)
        if not isinstance(v, (int, float)):
            return jsonify({"status": "error", "detail": f"weights.{wk} must be numeric"}), 400
        if v < 0:
            return jsonify({"status": "error", "detail": f"weights.{wk} must be non-negative"}), 400
    total_w = sum(weights[wk] for wk in ("recall", "refusal", "classification", "lexicalFractal"))
    if total_w <= 0:
        return jsonify({"status": "error", "detail": "weights must sum to a positive total"}), 400
    store_manager.write_eval_thresholds(body)
    return jsonify(body)


@app.get("/eval/history")
def eval_history():
    return jsonify(store_manager.read_eval_history())


@app.post("/eval/run")
def eval_run():
    body = request.get_json(silent=True) or {}
    adapter = body.get("adapter")
    if not adapter:
        return jsonify({"status": "error", "detail": "adapter path required"}), 400
    model_id = body.get("model", scorer.DEFAULT_MODEL_ID)

    result = job_runner.submit_job(scorer.run_eval, adapter, model_id)
    if isinstance(result, dict) and result.get("status") == "busy":
        return jsonify({"status": "busy", "detail": "a job is already running"}), 409

    event_queue: _queue.Queue = result

    def _generate() -> Iterator[str]:
        while True:
            item = event_queue.get()
            if item is None:
                break
            payload = json.dumps(item, ensure_ascii=False)
            yield f"data: {payload}\n\n"

    response = Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
    )
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


@app.post("/eval/flag")
def eval_flag():
    """
    Ingest a flagged eval item with dedup-on-entry check.

    Body: {"text": "...", "label": "...", "source": "eval_flag"}

    Writes canonical instruction-dataset records compatible with the
    build_dataset_v2.py / training pipeline schema:

        {
          "id": "<uuid>",
          "messages": [
            {"role": "system",    "content": "<SYSTEM_PROMPT>"},
            {"role": "user",      "content": "<text>"}
          ],
          "meta": {
            "label":       "<label>",
            "source":      "eval_flag",
            "content_sha": "<sha of normalized text>",
            "created_at":  "<iso8601>"
          }
        }

    Dedup is computed on the normalized text (whitespace-collapsed) so
    formatting-only duplicates are rejected.
    """
    body = request.get_json(silent=True) or {}
    text = body.get("text", "")
    if not text:
        return jsonify({"status": "error", "detail": "text is required"}), 400

    sha = store_manager.content_sha(text)
    if store_manager.check_duplicate(store_manager.INSTRUCTION_DATASET, sha):
        return jsonify({"status": "duplicate", "detail": "item rejected — duplicate content SHA"}), 409

    item = {
        "id": str(uuid.uuid4()),
        "messages": [
            {"role": "system", "content": scorer.SYSTEM_PROMPT},
            {"role": "user",   "content": text},
        ],
        "meta": {
            "label":       body.get("label", ""),
            "source":      body.get("source", "eval_flag"),
            "content_sha": sha,
            "created_at":  datetime.datetime.utcnow().isoformat() + "Z",
        },
    }
    gate_result = curator.gate(item)
    if not gate_result.get("accepted"):
        return jsonify({
            "status":    "rejected",
            "invariant": gate_result.get("invariant"),
            "reason":    gate_result.get("reason"),
        }), 422

    store_manager.append_item(store_manager.INSTRUCTION_DATASET, item)
    return jsonify({"status": "accepted", "id": item["id"], "content_sha": sha}), 201


# ---------------------------------------------------------------------------
# Adapters
# ---------------------------------------------------------------------------

@app.post("/adapters/activate")
def adapters_activate():
    body = request.get_json(silent=True) or {}
    adapter = body.get("adapter")
    if not adapter:
        return jsonify({"status": "error", "detail": "adapter path required"}), 400

    history = store_manager.read_eval_history()
    passing = [
        run for run in history
        if run.get("adapter") == adapter and run.get("all_passed") is True
    ]

    if not passing:
        return jsonify({
            "status": "forbidden",
            "detail": "no passing eval run on record for this adapter",
        }), 403

    return jsonify({"status": "activated", "adapter": adapter})


# ---------------------------------------------------------------------------
# Curriculum / staging routes
# ---------------------------------------------------------------------------

_VALID_DOMAINS = set(curriculum.DOMAINS.keys())


@app.post("/curriculum/ingest")
def curriculum_ingest():
    body = request.get_json(silent=True) or {}
    domain = body.get("domain", "")
    url = body.get("url", "")
    source_id = body.get("source_id") or str(uuid.uuid4())

    if domain not in _VALID_DOMAINS:
        return jsonify({
            "status": "error",
            "detail": f"domain must be one of: {sorted(_VALID_DOMAINS)}",
        }), 400
    if not url:
        return jsonify({"status": "error", "detail": "url is required"}), 400

    notebook_id = curriculum.get_notebook_id(domain)
    if notebook_id is None:
        ok, output = curriculum.nlm_run(
            ["notebook", "create", curriculum.DOMAINS[domain]], timeout=60
        )
        if not ok:
            return jsonify({"status": "error", "detail": f"notebook create failed: {output[:300]}"}), 502
        for line in output.splitlines():
            if "ID:" in line:
                notebook_id = line.split("ID:")[1].strip()
                break
        if not notebook_id:
            notebook_id = output.strip().split()[-1] if output.strip() else str(uuid.uuid4())
        curriculum.set_notebook_id(domain, notebook_id)

    result = job_runner.submit_job(
        curriculum.ingest_source, notebook_id, domain, url, source_id
    )
    if isinstance(result, dict) and result.get("status") == "busy":
        return jsonify({"status": "busy", "detail": "a job is already running"}), 409

    event_queue: _queue.Queue = result

    def _generate() -> Iterator[str]:
        while True:
            item = event_queue.get()
            if item is None:
                break
            payload = json.dumps(item, ensure_ascii=False)
            yield f"data: {payload}\n\n"

    response = Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
    )
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


@app.get("/staging")
def staging_list():
    items = store_manager.read_staging()

    domain_filter = request.args.get("domain")
    review_state_filter = request.args.get("review_state")
    item_type_filter = request.args.get("item_type")

    if domain_filter:
        items = [i for i in items if i.get("domain") == domain_filter]
    if review_state_filter:
        items = [i for i in items if i.get("review_state") == review_state_filter]
    if item_type_filter:
        items = [i for i in items if i.get("item_type") == item_type_filter]

    return jsonify({"items": items, "total": len(items)})


@app.post("/staging/review")
def staging_review():
    body = request.get_json(silent=True) or {}
    ids = body.get("ids", [])
    if not isinstance(ids, list):
        return jsonify({"status": "error", "detail": "ids must be a list"}), 400

    reviewed = []
    not_found = []
    for item_id in ids:
        try:
            store_manager.review_staging_item(item_id)
            reviewed.append(item_id)
        except KeyError:
            not_found.append(item_id)

    return jsonify({"reviewed": reviewed, "not_found": not_found})


@app.post("/staging/promote")
def staging_promote():
    body = request.get_json(silent=True) or {}
    ids = body.get("ids", [])
    if not isinstance(ids, list):
        return jsonify({"status": "error", "detail": "ids must be a list"}), 400

    promoted = []
    rejected = []
    errors = []

    staging_items = {i.get("id"): i for i in store_manager.read_staging()}

    for item_id in ids:
        item = staging_items.get(item_id)
        if item is None:
            errors.append({"id": item_id, "error": "not found"})
            continue
        if item.get("review_state") != "reviewed":
            errors.append({
                "id":    item_id,
                "error": f"item must be reviewed before promotion (state={item.get('review_state')!r})",
            })
            continue

        gate_result = curator.gate(item)
        if not gate_result.get("accepted"):
            rejected.append({
                "id":        item_id,
                "invariant": gate_result.get("invariant"),
                "reason":    gate_result.get("reason"),
            })
            continue

        store_manager.append_item(store_manager.INSTRUCTION_DATASET, item)
        store_manager.promote_staging_item(item_id)
        promoted.append(item_id)

    return jsonify({"promoted": promoted, "rejected": rejected, "errors": errors})


# ---------------------------------------------------------------------------
# CI / providers routes
# ---------------------------------------------------------------------------

@app.get("/providers")
def providers_list():
    roster = []
    for provider in ALL_PROVIDERS:
        available = provider._check_available()
        throttled = throttle_state.is_throttled(provider.provider_id)
        countdown = throttle_state.throttle_countdown(provider.provider_id)
        roster.append({
            "id":                        provider.provider_id,
            "name":                      provider.display_name,
            "available":                 available,
            "throttled":                 throttled,
            "throttle_countdown_seconds": countdown,
            "last_error":                None,
        })
    return jsonify({"providers": roster})


@app.post("/ci/run")
def ci_run():
    body = request.get_json(silent=True) or {}
    prompt = body.get("prompt", "").strip()
    if not prompt:
        return jsonify({"status": "error", "detail": "prompt is required"}), 400

    requested_ids: list[str] | None = body.get("provider_ids")
    domain: str | None = body.get("domain")

    if requested_ids is not None:
        active_ids = [pid for pid in requested_ids if get_provider(pid) is not None]
    else:
        active_ids = [p.provider_id for p in ALL_PROVIDERS]

    result = job_runner.submit_job(ci_runner.run_ci, prompt, active_ids, domain)
    if isinstance(result, dict) and result.get("status") == "busy":
        return jsonify({"status": "busy", "detail": "a job is already running"}), 409

    event_queue = result

    def _generate() -> Iterator[str]:
        while True:
            item = event_queue.get()
            if item is None:
                break
            payload = json.dumps(item, ensure_ascii=False)
            yield f"data: {payload}\n\n"

    response = Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
    )
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


@app.post("/ci/review")
def ci_review():
    body = request.get_json(silent=True) or {}
    pair_id = body.get("pair_id", "")
    action = body.get("action", "")

    if not pair_id:
        return jsonify({"status": "error", "detail": "pair_id is required"}), 400
    if action not in ("accept", "discard"):
        return jsonify({"status": "error", "detail": "action must be 'accept' or 'discard'"}), 400

    if action == "discard":
        ci_runner.pop_pending_pair(pair_id)
        return jsonify({"status": "discarded"})

    # accept
    pair = ci_runner.pop_pending_pair(pair_id)
    if pair is None:
        return jsonify({"status": "error", "detail": "pair not found"}), 404

    gate_result = curator.gate(pair)
    if not gate_result.get("accepted"):
        # Re-insert so the overseer can see the invariant indicator.
        ci_runner.store_pending_pair(pair)
        return jsonify({
            "status":    "rejected",
            "invariant": gate_result.get("invariant"),
            "reason":    gate_result.get("reason"),
        })

    store_manager.gated_append(store_manager.DPO_PAIRS, pair)
    return jsonify({"status": "accepted", "id": pair_id})


@app.post("/ci/retry")
def ci_retry():
    body = request.get_json(silent=True) or {}
    prompt = body.get("prompt", "").strip()
    if not prompt:
        return jsonify({"status": "error", "detail": "prompt is required"}), 400

    provider_ids: list[str] = body.get("provider_ids", [])
    domain: str | None = body.get("domain")

    active_ids = [pid for pid in provider_ids if get_provider(pid) is not None]

    result = job_runner.submit_job(ci_runner.run_ci, prompt, active_ids, domain)
    if isinstance(result, dict) and result.get("status") == "busy":
        return jsonify({"status": "busy", "detail": "a job is already running"}), 409

    event_queue = result

    def _generate() -> Iterator[str]:
        while True:
            item = event_queue.get()
            if item is None:
                break
            payload = json.dumps(item, ensure_ascii=False)
            yield f"data: {payload}\n\n"

    response = Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
    )
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


@app.post("/train")
def train_run():
    body = request.get_json(silent=True) or {}
    adapter_path: str | None = body.get("adapter_path")
    model: str | None = body.get("model")
    data_dir: str | None = body.get("data_dir")
    epochs: int = int(body.get("epochs", 3))
    batch_size: int = int(body.get("batch_size", 4))
    lora_rank: int = int(body.get("lora_rank", 16))
    learning_rate: float = float(body.get("learning_rate", 1e-5))
    max_seq_length: int = int(body.get("max_seq_length", 2048))

    result = job_runner.submit_job(
        train_worker.run_train,
        adapter_path,
        model,
        data_dir,
        epochs,
        batch_size,
        lora_rank,
        learning_rate,
        max_seq_length,
    )
    if isinstance(result, dict) and result.get("status") == "busy":
        return jsonify({"status": "busy", "detail": "a job is already running"}), 409

    event_queue: _queue.Queue = result

    def _generate() -> Iterator[str]:
        while True:
            item = event_queue.get()
            if item is None:
                break
            payload = json.dumps(item, ensure_ascii=False)
            yield f"data: {payload}\n\n"

    response = Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
    )
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response


# ---------------------------------------------------------------------------
# Manifest / audit stubs
# ---------------------------------------------------------------------------

@app.get("/manifest")
def manifest_get():
    return _json_stub(
        {
            "schema_version": "0.1.0",
            "updated_at": None,
            "stores": {
                "instruction_dataset": {
                    "path": "instruction_dataset.jsonl",
                    "record_count": 0,
                },
                "dpo_pairs": {"path": "dpo_pairs.jsonl", "record_count": 0},
                "staging": {"path": "staging.jsonl", "record_count": 0},
                "errors_queue": {"path": "errors_queue.jsonl", "record_count": 0},
                "manifest": {"path": "manifest.json", "record_count": 0},
                "audit_log": {"path": "audit_log.jsonl", "record_count": 0},
                "eval_thresholds": {"path": "eval_thresholds.json", "record_count": 0},
            },
            "active_adapter": None,
        }
    )


@app.get("/audit")
def audit_get():
    try:
        limit = int(request.args.get("limit", 200))
    except (TypeError, ValueError):
        limit = 200
    entries = store_manager.read_audit_log(limit=limit)
    return jsonify({"entries": entries})


@app.post("/kill-switch")
def kill_switch():
    body = request.get_json(silent=True) or {}
    active = bool(body.get("active", False))
    curator.set_kill_switch(active)
    store_manager.append_audit({
        "id":           str(uuid.uuid4()),
        "mutation_ref": None,
        "invariant":    curator.HUMAN_KILL_SWITCH,
        "decision":     "armed" if active else "disarmed",
        "reason":       f"kill-switch set to {active} via API",
        "ts":           datetime.datetime.utcnow().isoformat() + "Z",
    })
    return jsonify({"active": active})


@app.get("/invariants")
def invariants_get():
    entries = store_manager.read_audit_log(limit=500)
    # Build per-invariant last-rejection map.
    last_rejection: dict[str, str] = {}
    for entry in reversed(entries):
        inv = entry.get("invariant")
        if entry.get("decision") == "rejected" and inv and inv not in last_rejection:
            last_rejection[inv] = entry.get("reason", "")

    result = []
    for name in curator.INVARIANT_NAMES:
        row: dict = {
            "name":    name,
            "holding": name not in last_rejection,
        }
        if name in last_rejection:
            row["last_rejection"] = last_rejection[name]
        if name == curator.HUMAN_KILL_SWITCH:
            armed = curator.is_kill_switch_active()
            row["armed"] = armed
            row["holding"] = not armed  # armed = not holding
        result.append(row)

    return jsonify({"invariants": result})


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

def main():
    job_runner.acquire_lock()
    atexit.register(job_runner.release_lock)

    token = auth.generate_token()
    print(f"Harness daemon v{VERSION} starting on {HOST}:{PORT}")
    print(f"Token written to: {auth.TOKEN_FILE}")
    print(f"Token hint (masked): {auth.mask_token(token)}")

    app.run(host=HOST, port=PORT, debug=False)


if __name__ == "__main__":
    main()
