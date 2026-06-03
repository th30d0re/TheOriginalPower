"""Harness daemon entry point.

Start with:
    python -m harness.server
or via:
    make harness

Binds to 127.0.0.1:7331.
"""

from __future__ import annotations

import atexit
import json
import queue as _queue
from collections.abc import Iterator

from flask import Flask, Response, jsonify, request, stream_with_context

from . import auth, job_runner, scorer, store_manager
from .compute_probe import run_probe

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
        if not isinstance(weights.get(wk), (int, float)):
            return jsonify({"status": "error", "detail": f"weights.{wk} must be numeric"}), 400
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
    """
    body = request.get_json(silent=True) or {}
    text = body.get("text", "")
    if not text:
        return jsonify({"status": "error", "detail": "text is required"}), 400

    sha = store_manager.content_sha(text)
    if store_manager.check_duplicate(store_manager.INSTRUCTION_DATASET, sha):
        return jsonify({"status": "duplicate", "detail": "item rejected — duplicate content SHA"}), 409

    item = {
        "text":        text,
        "label":       body.get("label", ""),
        "source":      body.get("source", "eval_flag"),
        "content_sha": sha,
    }
    store_manager.append_item(store_manager.INSTRUCTION_DATASET, item)
    return jsonify({"status": "accepted", "content_sha": sha}), 201


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
# Curriculum / staging stubs
# ---------------------------------------------------------------------------

@app.post("/curriculum/ingest")
def curriculum_ingest():
    return _json_stub(
        {
            "ingest_id": None,
            "accepted": 0,
            "rejected": 0,
            "errors": [],
            "status": NOT_IMPLEMENTED,
        }
    )


@app.get("/staging")
def staging_list():
    return _json_stub({"items": []})


@app.post("/staging/promote")
def staging_promote():
    return _json_stub({"promoted": [], "failed": [], "status": NOT_IMPLEMENTED})


# ---------------------------------------------------------------------------
# CI / providers / train stubs
# ---------------------------------------------------------------------------

@app.post("/ci/run")
def ci_run():
    return _sse_stub(
        [
            ("job.started", {"job_id": None, "kind": "ci", "status": NOT_IMPLEMENTED}),
            (
                "ci.step",
                {
                    "job_id": None,
                    "step": None,
                    "name": None,
                    "status": NOT_IMPLEMENTED,
                },
            ),
            (
                "ci.complete",
                {
                    "job_id": None,
                    "passed": None,
                    "report": None,
                    "status": NOT_IMPLEMENTED,
                },
            ),
        ]
    )


@app.get("/providers")
def providers_list():
    return _json_stub(
        {
            "providers": [
                {
                    "id": "mlx",
                    "name": "MLX Local",
                    "executor": "mlx",
                    "available": True,
                    "models": [],
                },
                {
                    "id": "foundation_models",
                    "name": "Apple Foundation Models",
                    "executor": "fm",
                    "available": False,
                    "models": [],
                },
            ]
        }
    )


@app.post("/train")
def train_run():
    return _sse_stub(
        [
            ("job.started", {"job_id": None, "kind": "train", "status": NOT_IMPLEMENTED}),
            (
                "train.epoch",
                {
                    "job_id": None,
                    "epoch": 0,
                    "total_epochs": 0,
                    "train_loss": None,
                    "val_loss": None,
                    "status": NOT_IMPLEMENTED,
                },
            ),
            (
                "train.complete",
                {
                    "job_id": None,
                    "adapter_path": None,
                    "metadata": None,
                    "status": NOT_IMPLEMENTED,
                },
            ),
        ]
    )


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
    return _json_stub({"entries": []})


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
