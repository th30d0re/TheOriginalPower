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
from collections.abc import Iterator

from flask import Flask, Response, jsonify, request

from . import auth, job_runner
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
# Stub helpers
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
# Eval stubs
# ---------------------------------------------------------------------------

@app.post("/eval/run")
def eval_run():
    return _sse_stub(
        [
            ("job.started", {"job_id": None, "kind": "eval", "status": NOT_IMPLEMENTED}),
            (
                "eval.progress",
                {
                    "job_id": None,
                    "step": 0,
                    "total": 0,
                    "prompt_id": None,
                    "label": None,
                    "status": NOT_IMPLEMENTED,
                },
            ),
            (
                "eval.complete",
                {
                    "job_id": None,
                    "run_id": None,
                    "results": [],
                    "status": NOT_IMPLEMENTED,
                },
            ),
        ]
    )


@app.get("/eval/history")
def eval_history():
    return _json_stub({"runs": []})


@app.get("/eval/thresholds")
def eval_thresholds_get():
    return _json_stub(
        {
            "coi_delta_max": 0.10,
            "min_clause_accuracy": None,
            "min_proxy_detection_accuracy": None,
        }
    )


@app.put("/eval/thresholds")
def eval_thresholds_put():
    body = request.get_json(silent=True) or {}
    return _json_stub(
        {
            "coi_delta_max": body.get("coi_delta_max", 0.10),
            "min_clause_accuracy": body.get("min_clause_accuracy"),
            "min_proxy_detection_accuracy": body.get("min_proxy_detection_accuracy"),
            "status": NOT_IMPLEMENTED,
        }
    )


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
# CI / providers / train / adapters stubs
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


@app.post("/adapters/activate")
def adapters_activate():
    body = request.get_json(silent=True) or {}
    return _json_stub(
        {
            "adapter_id": body.get("adapter_id"),
            "name": body.get("name"),
            "is_active": False,
            "metadata": None,
            "status": NOT_IMPLEMENTED,
        }
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
