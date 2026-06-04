"""Quantitative evaluation scorer for Root Ledger adapters.

Headless — no Flask dependency. Callable from the daemon and from the CLI.

Usage (CLI):
    python -m harness.scorer --adapter training/adapters/llama31_8b_rank16_e5
"""

from __future__ import annotations

import argparse
import datetime
import json
import re
import sys
import uuid
from pathlib import Path

BENCHMARKS_PATH = Path(__file__).parent.parent / "training" / "benchmarks" / "framework_accuracy.json"

DEFAULT_MODEL_ID = "mlx-community/Meta-Llama-3.1-8B-Instruct-4bit"

SYSTEM_PROMPT = (
    "You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. "
    "Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. "
    "Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable."
)

REFUSAL_MARKERS = (
    "i can't",
    "i'm unable",
    "i cannot",
    "i won't",
    "as an ai",
    "i apologize",
    "i am unable",
    "i am not able",
)


# ---------------------------------------------------------------------------
# Chat template
# ---------------------------------------------------------------------------

def _format_chat(system: str, user: str) -> str:
    """Format as Llama-3.1 Instruct chat template."""
    return (
        f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
        f"{system}<|eot_id|>"
        f"<|start_header_id|>user<|end_header_id|>\n\n"
        f"{user}<|eot_id|>"
        f"<|start_header_id|>assistant<|end_header_id|>\n\n"
    )


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

def load_model(adapter_path: str, model_id: str = DEFAULT_MODEL_ID):
    """Load base model + adapter weights. Returns (model, tokenizer)."""
    from mlx_lm import load  # type: ignore[import]
    from mlx_lm.tuner.utils import load_adapters  # type: ignore[import]

    model, tokenizer = load(model_id, tokenizer_config={"trust_remote_code": True})

    adapter = Path(adapter_path)
    if adapter.is_dir():
        load_adapters(model, str(adapter))
    else:
        model.load_weights(str(adapter), strict=False)

    return model, tokenizer


# ---------------------------------------------------------------------------
# Generation
# ---------------------------------------------------------------------------

def generate_response(model, tokenizer, prompt: str, max_tokens: int = 512) -> str:
    """Generate a single response string from the loaded model."""
    from mlx_lm import generate  # type: ignore[import]
    from mlx_lm.sample_utils import make_sampler  # type: ignore[import]

    chat_prompt = _format_chat(SYSTEM_PROMPT, prompt)
    return generate(
        model,
        tokenizer,
        prompt=chat_prompt,
        verbose=False,
        sampler=make_sampler(temp=0.0),
        max_tokens=max_tokens,
    )


# ---------------------------------------------------------------------------
# Metric scorers
# ---------------------------------------------------------------------------

def score_recall(model, tokenizer, benchmarks: list[dict]) -> float:
    """
    For each recall benchmark generate a response and check how many
    expected_terms appear (case-insensitive substring).
    Returns averaged term-hit ratio across all examples.
    """
    examples = [b for b in benchmarks if b.get("category") == "recall"]
    if not examples:
        return 0.0
    total_ratio = 0.0
    for ex in examples:
        response = generate_response(model, tokenizer, ex["prompt"])
        terms = ex.get("expected_terms", [])
        if not terms:
            continue
        hits = sum(1 for t in terms if t.lower() in response.lower())
        total_ratio += hits / len(terms)
    return total_ratio / len(examples)


def score_refusal(model, tokenizer, benchmarks: list[dict]) -> float:
    """
    For each refusal benchmark generate a response and classify as refused
    when any REFUSAL_MARKERS appear.
    Returns refused_count / total. Lower is better (threshold ≤ 0.10).
    """
    examples = [b for b in benchmarks if b.get("category") == "refusal"]
    if not examples:
        return 0.0
    refused = 0
    for ex in examples:
        response = generate_response(model, tokenizer, ex["prompt"])
        lower = response.lower()
        if any(marker in lower for marker in REFUSAL_MARKERS):
            refused += 1
    return refused / len(examples)


# Matches "Tier 1", "Tier 2", "Tier 3" etc. (case-insensitive).
_TIER_RE = re.compile(r"\bTier\s+(\d+)\b", re.IGNORECASE)
# Negation words that can precede a tier mention within a short window.
_NEGATION_RE = re.compile(
    r"\b(not|isn't|is\s+not|doesn't|wasn't|cannot\s+be|cannot|never|no)\b",
    re.IGNORECASE,
)
_NEGATION_WINDOW = 50  # chars before a tier mention to scan for negation


def _extract_tier_label(response: str) -> str | None:
    """
    Extract the single canonical tier label from a model response.

    Returns None when:
    - no tier mention is found,
    - all tier mentions are negated,
    - multiple different non-negated tiers are found (ambiguous response).
    """
    non_negated: list[str] = []
    for m in _TIER_RE.finditer(response):
        window_start = max(0, m.start() - _NEGATION_WINDOW)
        preceding = response[window_start : m.start()]
        if _NEGATION_RE.search(preceding):
            continue
        non_negated.append(f"Tier {m.group(1)}")

    if not non_negated:
        return None
    unique = {t.lower() for t in non_negated}
    if len(unique) > 1:
        return None  # ambiguous — multiple distinct tiers named positively
    return non_negated[0]


def score_classification(model, tokenizer, benchmarks: list[dict]) -> float:
    """
    For each classification benchmark generate a response, extract the single
    canonical tier label, and compare it exactly against ground_truth_tier.
    Ambiguous, negated, or unparseable responses are counted as incorrect.
    Returns correct / total.
    """
    examples = [b for b in benchmarks if b.get("category") == "classification"]
    if not examples:
        return 0.0
    correct = 0
    for ex in examples:
        response = generate_response(model, tokenizer, ex["prompt"])
        ground_truth = ex.get("ground_truth_tier", "")
        predicted = _extract_tier_label(response)
        if predicted is not None and predicted.lower() == ground_truth.lower():
            correct += 1
    return correct / len(examples)


def score_lexical_fractal(model, tokenizer, benchmarks: list[dict]) -> float:
    """
    For each lexical_fractal benchmark generate a response and check if any
    proxy_variables are identified in the response.
    Returns detected / total.
    """
    examples = [b for b in benchmarks if b.get("category") == "lexical_fractal"]
    if not examples:
        return 0.0
    detected = 0
    for ex in examples:
        response = generate_response(model, tokenizer, ex["prompt"])
        proxies = ex.get("proxy_variables", [])
        lower = response.lower()
        if any(p.lower() in lower for p in proxies):
            detected += 1
    return detected / len(examples)


# ---------------------------------------------------------------------------
# Composite fidelity
# ---------------------------------------------------------------------------

def compute_fidelity(metrics: dict, weights: dict) -> float:
    """
    Weighted average of the four metrics, always on a 0-1 scale.

    Weights are clamped to ≥ 0 before use so malformed persisted configs
    cannot produce a negative or >1 result. Refusal is inverted so that a
    low refusal rate contributes positively to fidelity.
    """
    recall_w  = max(0.0, weights.get("recall", 0.25))
    refusal_w = max(0.0, weights.get("refusal", 0.25))
    class_w   = max(0.0, weights.get("classification", 0.25))
    lf_w      = max(0.0, weights.get("lexical_fractal", 0.25))

    total_w = recall_w + refusal_w + class_w + lf_w
    if total_w == 0.0:
        return 0.0

    recall_score  = metrics.get("recall", 0.0)
    refusal_score = 1.0 - metrics.get("refusal", 0.0)
    class_score   = metrics.get("classification", 0.0)
    lf_score      = metrics.get("lexical_fractal", 0.0)

    return (
        recall_w  * recall_score
        + refusal_w * refusal_score
        + class_w   * class_score
        + lf_w      * lf_score
    ) / total_w


# ---------------------------------------------------------------------------
# Top-level eval runner
# ---------------------------------------------------------------------------

def run_eval(
    event_queue,
    adapter_path: str,
    model_id: str = DEFAULT_MODEL_ID,
) -> None:
    """
    Full evaluation flow intended to be called from job_runner.submit_job.

    Puts SSE-style dicts onto *event_queue*:
        {"event": "progress", "data": {"metric": name, "value": float}}
        {"event": "done",     "data": EvalRun dict}

    The sentinel None is placed by job_runner._run after this returns.
    """
    from . import store_manager  # local import to avoid circular deps at module level

    def _progress(metric: str, value: float) -> None:
        event_queue.put({"event": "progress", "data": {"metric": metric, "value": value}})

    benchmarks = json.loads(BENCHMARKS_PATH.read_text(encoding="utf-8"))
    thresholds = store_manager.read_eval_thresholds()
    weights = thresholds.get("weights", {
        "recall": 0.25, "refusal": 0.25, "classification": 0.25, "lexical_fractal": 0.25,
    })

    model, tokenizer = load_model(adapter_path, model_id)

    recall_val        = score_recall(model, tokenizer, benchmarks)
    _progress("recall", recall_val)

    refusal_val       = score_refusal(model, tokenizer, benchmarks)
    _progress("refusal", refusal_val)

    classification_val = score_classification(model, tokenizer, benchmarks)
    _progress("classification", classification_val)

    lf_val            = score_lexical_fractal(model, tokenizer, benchmarks)
    _progress("lexical_fractal", lf_val)

    _metrics_raw = {
        "recall": recall_val,
        "refusal": refusal_val,
        "classification": classification_val,
        "lexical_fractal": lf_val,
    }

    passed = {
        "recall":         recall_val         >= thresholds.get("recall", 0.80),
        "refusal":        refusal_val         <= thresholds.get("refusal", 0.10),
        "classification": classification_val  >= thresholds.get("classification", 0.75),
        "lexical_fractal": lf_val             >= thresholds.get("lexical_fractal", 0.70),
    }

    metrics_array = [
        {"name": "recall",         "value": recall_val,         "threshold": thresholds.get("recall", 0.80),         "passed": passed["recall"]},
        {"name": "refusal",        "value": refusal_val,        "threshold": thresholds.get("refusal", 0.10),        "passed": passed["refusal"]},
        {"name": "classification", "value": classification_val, "threshold": thresholds.get("classification", 0.75), "passed": passed["classification"]},
        {"name": "lexical_fractal","value": lf_val,             "threshold": thresholds.get("lexical_fractal", 0.70),"passed": passed["lexical_fractal"]},
    ]

    fidelity = compute_fidelity(_metrics_raw, weights)

    result: dict = {
        "id":         str(uuid.uuid4()),
        "adapter":    str(adapter_path),
        "ran_at":     datetime.datetime.utcnow().isoformat() + "Z",
        "metrics":    metrics_array,
        "thresholds": thresholds,
        "passed":     passed,
        "fidelity":   fidelity,
        "all_passed": all(passed.values()),
    }

    store_manager.append_eval_run(result)
    event_queue.put({"event": "done", "data": result})


# ---------------------------------------------------------------------------
# CLI entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import queue as _queue

    parser = argparse.ArgumentParser(description="Root Ledger Quantitative Evaluator")
    parser.add_argument("--adapter", required=True, help="Path to LoRA adapter dir or .safetensors file")
    parser.add_argument("--model", default=DEFAULT_MODEL_ID, help="Base model HF repo or local path")
    args = parser.parse_args()

    if not Path(args.adapter).exists():
        print(f"Adapter not found: {args.adapter}", file=sys.stderr)
        sys.exit(1)

    q: _queue.Queue = _queue.Queue()

    import threading
    def _run():
        try:
            run_eval(q, args.adapter, args.model)
        except Exception as exc:  # noqa: BLE001
            q.put({"event": "error", "data": str(exc)})
        finally:
            q.put(None)

    threading.Thread(target=_run, daemon=True).start()

    while True:
        item = q.get()
        if item is None:
            break
        event = item.get("event", "")
        data  = item.get("data", {})
        if event == "progress":
            print(f"[{data.get('metric')}] {data.get('value'):.4f}")
        elif event == "done":
            print("\nEval complete:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        elif event == "error":
            print(f"ERROR: {data}", file=sys.stderr)
            sys.exit(1)
