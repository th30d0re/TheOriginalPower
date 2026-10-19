#!/usr/bin/env python3
"""take_quiz.py — Run language models or System One on the 12 Axes quiz.

Produces answer keys adhering to CONTRACT.md with full probability distributions.
Supports two backends:
1. 'mlx': Local fine-tuned or base models evaluated through next-token logits.
2. 'systemone': Hosted Jev or local decider servers speaking /v1/systemone via Score questions.
"""
from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import json
import os
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Prevent accidental HuggingFace downloads; resolve from local cache only.
os.environ["HF_HUB_OFFLINE"] = "1"

# Axis answer scale weights per CONTRACT.md
SCALE_WEIGHTS = {
    "SA": 1.0,
    "A": 0.75,
    "N": 0.5,
    "D": 0.25,
    "SD": 0.0,
}

# Ordered choice keys and labels
OPTION_LETTERS = ["A", "B", "C", "D", "E"]
LETTER_TO_LABEL = {
    "A": "SA",
    "B": "A",
    "C": "N",
    "D": "D",
    "E": "SD",
}
LEVEL_INDEX_TO_LABEL = {
    0: "SD",
    1: "D",
    2: "N",
    3: "A",
    4: "SA",
}

# Standard rubric criteria for System One Score questions
SCORE_CRITERIA = [
    "Strongly disagree: the framework described in the state directly rejects the statement.",
    "Disagree: the framework described in the state leans against the statement.",
    "Neutral or depends: the framework described in the state takes a neutral, conditional, or balanced stance.",
    "Agree: the framework described in the state leans in favor of the statement.",
    "Strongly agree: the framework described in the state directly supports the statement.",
]


def find_repo_root() -> Path:
    """Locate the repository root directory."""
    current = Path(__file__).resolve().parent
    for p in [current] + list(current.parents):
        if (p / "Paper").exists() and (p / "training").exists():
            return p
    return current.parents[2]


REPO_ROOT = find_repo_root()


def resolve_path(path_str: str, relative_to: Optional[Path] = None) -> str:
    """Resolve a file path against relative_to, CWD, or repo root."""
    p = Path(path_str)
    if p.is_absolute() and p.exists():
        return str(p.resolve())
    if relative_to and (relative_to / p).exists():
        return str((relative_to / p).resolve())
    cwd_p = Path.cwd() / p
    if cwd_p.exists():
        return str(cwd_p.resolve())
    repo_p = REPO_ROOT / p
    if repo_p.exists():
        return str(repo_p.resolve())
    return path_str


def load_items(path: str | Path, limit: Optional[int] = None) -> List[Tuple[str, str]]:
    """Load quiz items from a TSV file.

    Accepts any TSV with an identifier column ('id' or 'atomic_id') and a 'text' column.
    """
    p = Path(path)
    if not p.exists():
        resolved = Path(resolve_path(str(path)))
        if resolved.exists():
            p = resolved
        else:
            raise FileNotFoundError(f"Items file not found: {path}")

    items: List[Tuple[str, str]] = []
    with open(p, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        if reader.fieldnames is None:
            raise ValueError(f"Empty TSV file: {path}")

        id_col = None
        for candidate in ("id", "atomic_id"):
            if candidate in reader.fieldnames:
                id_col = candidate
                break

        if id_col is None:
            raise ValueError(
                f"Missing identifier column in {path}; expected 'id' or 'atomic_id', found {reader.fieldnames}"
            )
        if "text" not in reader.fieldnames:
            raise ValueError(
                f"Missing 'text' column in {path}; found {reader.fieldnames}"
            )

        for row in reader:
            qid = row[id_col].strip()
            text = row["text"].strip()
            if qid:
                items.append((qid, text))
            if limit is not None and len(items) >= limit:
                break

    return items


def compute_expected(
    p_sa: float, p_a: float, p_n: float, p_d: float, p_sd: float
) -> float:
    """Calculate the expected value as the weighted sum over the answer scale."""
    return (
        p_sa * SCALE_WEIGHTS["SA"]
        + p_a * SCALE_WEIGHTS["A"]
        + p_n * SCALE_WEIGHTS["N"]
        + p_d * SCALE_WEIGHTS["D"]
        + p_sd * SCALE_WEIGHTS["SD"]
    )


def format_key_row(
    item_id: str,
    p_sa: float,
    p_a: float,
    p_n: float,
    p_d: float,
    p_sd: float,
    confidence: Optional[float] = None,
) -> Dict[str, Any]:
    """Assemble an answer record meeting CONTRACT.md requirements."""
    dist = {"SA": p_sa, "A": p_a, "N": p_n, "D": p_d, "SD": p_sd}
    answer = max(dist.items(), key=lambda kv: kv[1])[0]
    expected = compute_expected(p_sa, p_a, p_n, p_d, p_sd)
    conf = confidence if confidence is not None else max(dist.values())
    return {
        "id": item_id,
        "answer": answer,
        "p_SA": round(p_sa, 4),
        "p_A": round(p_a, 4),
        "p_N": round(p_n, 4),
        "p_D": round(p_d, 4),
        "p_SD": round(p_sd, 4),
        "expected": round(expected, 4),
        "confidence": round(conf, 4),
    }


def write_key_file(out_path: str | Path, rows: List[Dict[str, Any]]) -> None:
    """Write output TSV with exactly the CONTRACT.md columns."""
    out = Path(out_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "id",
        "answer",
        "p_SA",
        "p_A",
        "p_N",
        "p_D",
        "p_SD",
        "expected",
        "confidence",
    ]
    with open(out, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter="\t", lineterminator="\n")
        writer.writerow(fieldnames)
        for r in rows:
            writer.writerow(
                [
                    r["id"],
                    r["answer"],
                    f"{r['p_SA']:.4f}",
                    f"{r['p_A']:.4f}",
                    f"{r['p_N']:.4f}",
                    f"{r['p_D']:.4f}",
                    f"{r['p_SD']:.4f}",
                    f"{r['expected']:.4f}",
                    f"{r['confidence']:.4f}",
                ]
            )


# -----------------------------------------------------------------------------
# System One Backend
# -----------------------------------------------------------------------------

def get_typesafe_api_key(endpoint: str) -> str:
    """Retrieve TypeSafe API key from environment or macOS keychain."""
    parsed = urllib.parse.urlparse(endpoint)
    hostname = (parsed.hostname or "").lower()
    if hostname in ("localhost", "127.0.0.1", "::1"):
        return os.environ.get("TYPESAFE_API_KEY", "")

    env_key = os.environ.get("TYPESAFE_API_KEY")
    if env_key:
        return env_key

    try:
        proc = subprocess.run(
            ["security", "find-generic-password", "-s", "typesafe-api-key", "-w"],
            capture_output=True,
            timeout=10,
        )
        if proc.returncode == 0 and proc.stdout.strip():
            return proc.stdout.decode().strip()
    except (subprocess.SubprocessError, OSError):
        pass

    raise SystemExit(
        "No TypeSafe API key. Set TYPESAFE_API_KEY or add typesafe-api-key to the macOS keychain."
    )


def _cache_key(*parts: Any) -> str:
    """Compute sha256 hash for disk caching."""
    hasher = hashlib.sha256()
    for i, p in enumerate(parts):
        if i > 0:
            hasher.update(b"\x1f")
        hasher.update(str(p).encode("utf-8"))
    return hasher.hexdigest()[:32]


def run_systemone_batch(
    endpoint: str,
    model: str,
    state: str,
    questions: Dict[str, Any],
    cache_dir: Path,
    api_key: str,
    max_retries: int = 5,
    timeout: int = 120,
) -> Dict[str, Any]:
    """Execute a single batched Score request against a /v1/systemone endpoint."""
    import requests

    endpoint_clean = endpoint.rstrip("/")
    if not endpoint_clean.endswith("/v1/systemone"):
        url = f"{endpoint_clean}/v1/systemone"
    else:
        url = endpoint_clean

    key = _cache_key(
        "systemone",
        url,
        model,
        json.dumps(questions, sort_keys=True),
        state,
    )
    cache_path = cache_dir / f"{key}.json"
    if cache_path.exists():
        try:
            return json.loads(cache_path.read_text(encoding="utf-8"))
        except Exception:
            pass

    payload = {
        "state": state,
        "model": model,
        "questions": questions,
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    delay = 1.0
    for attempt in range(max_retries):
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=timeout)
        except requests.RequestException as exc:
            if attempt == max_retries - 1:
                raise RuntimeError(
                    f"System One request failed after {max_retries} attempts: {exc}"
                )
            time.sleep(delay)
            delay *= 2.0
            continue

        if resp.status_code in (429, 500, 502, 503, 504, 529):
            if attempt == max_retries - 1:
                raise RuntimeError(
                    f"System One HTTP {resp.status_code} after {max_retries} attempts: {resp.text[:300]}"
                )
            time.sleep(delay)
            delay *= 2.0
            continue

        if resp.status_code >= 400:
            raise RuntimeError(
                f"System One HTTP {resp.status_code}: {resp.text[:400]}"
            )

        data = resp.json()
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(data), encoding="utf-8")
        return data

    raise RuntimeError("Exhausted retries calling System One")


def run_systemone(
    items: List[Tuple[str, str]],
    digest_text: str,
    endpoint: str,
    model: str,
    batch_size: int,
    cache_dir: Path,
) -> List[Dict[str, Any]]:
    """Evaluate items using the System One Score question format."""
    api_key = get_typesafe_api_key(endpoint)
    rows: List[Dict[str, Any]] = []

    for i in range(0, len(items), batch_size):
        chunk = items[i : i + batch_size]
        questions: Dict[str, Any] = {}
        for qid, text in chunk:
            questions[qid] = {
                "type": "score",
                "instructions": text,
                "criteria": SCORE_CRITERIA,
            }

        response = run_systemone_batch(
            endpoint=endpoint,
            model=model,
            state=digest_text,
            questions=questions,
            cache_dir=cache_dir,
            api_key=api_key,
        )

        answers = response.get("answers", {})
        for qid, _ in chunk:
            ans = answers.get(qid)
            if ans is None:
                raise RuntimeError(f"Missing answer for question {qid} in response")

            raw_probs = ans.get("probabilities", {})
            p_sd = float(raw_probs.get("0", raw_probs.get(0, 0.0)))
            p_d = float(raw_probs.get("1", raw_probs.get(1, 0.0)))
            p_n = float(raw_probs.get("2", raw_probs.get(2, 0.0)))
            p_a = float(raw_probs.get("3", raw_probs.get(3, 0.0)))
            p_sa = float(raw_probs.get("4", raw_probs.get(4, 0.0)))

            total = p_sd + p_d + p_n + p_a + p_sa
            if total > 0:
                p_sd /= total
                p_d /= total
                p_n /= total
                p_a /= total
                p_sa /= total
            else:
                p_sd = p_d = p_a = p_sa = 0.0
                p_n = 1.0

            conf = float(ans.get("confidence", max(p_sa, p_a, p_n, p_d, p_sd)))
            rows.append(format_key_row(qid, p_sa, p_a, p_n, p_d, p_sd, conf))

    return rows


# -----------------------------------------------------------------------------
# MLX Backend
# -----------------------------------------------------------------------------

def resolve_model_from_registry(
    registry_path: Path, run_name: str, repo_root: Path
) -> Tuple[str, Optional[str]]:
    """Extract model_path and adapter_path from models.tsv for a given run."""
    with open(registry_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if row.get("run") == run_name:
                m_path = row.get("model_path", "").strip()
                a_path = (row.get("adapter_path") or "").strip() or None
                resolved_m = resolve_path(m_path, repo_root)
                resolved_a = resolve_path(a_path, repo_root) if a_path else None
                return resolved_m, resolved_a

    raise ValueError(f"Run '{run_name}' not found in registry {registry_path}")


def get_single_token_letter_map(tokenizer: Any) -> Dict[str, List[int]]:
    """Collect all token IDs whose decoded output represents one of the five letters."""
    letter_map: Dict[str, set[int]] = {ch: set() for ch in OPTION_LETTERS}
    vocab = tokenizer.get_vocab() if hasattr(tokenizer, "get_vocab") else {}

    for letter in OPTION_LETTERS:
        for prefix in ("", " ", " "):
            toks = tokenizer.encode(prefix + letter, add_special_tokens=False)
            if len(toks) == 1:
                letter_map[letter].add(toks[0])

        for candidate in (letter, f" {letter}", f" {letter}", f"<0x{ord(letter):02X}>"):
            if candidate in vocab:
                letter_map[letter].add(vocab[candidate])

    return {ch: sorted(list(ids)) for ch, ids in letter_map.items()}


def format_mlx_prompts(
    statement: str, digest_text: Optional[str]
) -> Tuple[str, str]:
    """Format the shared prefix and item-specific prompt suffix."""
    if digest_text is not None and digest_text.strip():
        prefix_content = (
            "You are evaluating political statements according to the following framework digest:\n\n"
            f"{digest_text.strip()}"
        )
    else:
        prefix_content = (
            "You are evaluating political statements according to the Root Ledger / Original Power framework."
        )

    item_content = (
        f'Statement: "{statement.strip()}"\n\n'
        "Options:\n"
        "A) Strongly agree\n"
        "B) Agree\n"
        "C) Neutral or it depends\n"
        "D) Disagree\n"
        "E) Strongly disagree\n\n"
        "Respond with only the single letter (A, B, C, D, or E) corresponding to your answer.\n"
        "Answer:"
    )

    return prefix_content, item_content


def run_mlx(
    items: List[Tuple[str, str]],
    digest_text: Optional[str],
    model_path: str,
    adapter_path: Optional[str],
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Evaluate items using an MLX model with prompt caching and first-token logits."""
    import mlx.core as mx
    from mlx_lm import load
    from mlx_lm.models.cache import make_prompt_cache

    print(f"[MLX] Loading model from {model_path} ...", file=sys.stderr, flush=True)
    if adapter_path:
        print(f"[MLX] Applying adapter from {adapter_path} ...", file=sys.stderr, flush=True)
    model, tokenizer = load(
        model_path,
        adapter_path=adapter_path,
        tokenizer_config={"trust_remote_code": True},
    )

    letter_tokens = get_single_token_letter_map(tokenizer)
    all_letter_tids = [tid for tids in letter_tokens.values() for tid in tids]
    print(
        f"[MLX] Single-token mappings: "
        + ", ".join(f"{ch}={len(letter_tokens[ch])}" for ch in OPTION_LETTERS),
        file=sys.stderr,
        flush=True,
    )

    # Prepare prefix and prefill cache
    prefix_content, first_item_content = format_mlx_prompts(items[0][1], digest_text)
    full_sample = tokenizer.apply_chat_template(
        [{"role": "user", "content": f"{prefix_content}\n\n{first_item_content}"}],
        tokenize=False,
        add_generation_prompt=True,
    )
    split_str = "\n\n" + first_item_content
    idx = full_sample.find(split_str)
    if idx != -1:
        prefix_str = full_sample[: idx + 2]
    else:
        prefix_str = full_sample

    prefix_tokens = tokenizer.encode(prefix_str, add_special_tokens=False)
    prefix_arr = mx.array(prefix_tokens)[None]

    print(
        f"[MLX] Prefilling prompt cache ({len(prefix_tokens)} tokens) ...",
        file=sys.stderr,
        flush=True,
    )
    t_prefill_start = time.perf_counter()
    prefix_cache = make_prompt_cache(model)
    model(prefix_arr, cache=prefix_cache)
    mx.eval([c.state for c in prefix_cache])
    prefill_time_s = time.perf_counter() - t_prefill_start
    print(
        f"[MLX] Prompt cache ready in {prefill_time_s:.2f}s",
        file=sys.stderr,
        flush=True,
    )

    rows: List[Dict[str, Any]] = []
    item_latencies: List[float] = []
    raw_masses: List[float] = []

    for item_idx, (qid, text) in enumerate(items, start=1):
        _, item_content = format_mlx_prompts(text, digest_text)
        full_text = tokenizer.apply_chat_template(
            [{"role": "user", "content": f"{prefix_content}\n\n{item_content}"}],
            tokenize=False,
            add_generation_prompt=True,
        )
        full_toks = tokenizer.encode(full_text, add_special_tokens=False)
        item_toks = full_toks[len(prefix_tokens):]

        t0 = time.perf_counter()
        item_cache = copy.deepcopy(prefix_cache)
        out = model(mx.array(item_toks)[None], cache=item_cache)
        mx.eval(out)
        latency = time.perf_counter() - t0
        item_latencies.append(latency)

        last_logits = out[0, -1, :]
        probs_all = mx.softmax(last_logits)
        mx.eval(probs_all)

        total_mass = sum(probs_all[tid].item() for tid in all_letter_tids)
        raw_masses.append(total_mass)

        # Log-sum-exp over single-token encodings per option
        lse_vals = []
        for ch in OPTION_LETTERS:
            tids = letter_tokens[ch]
            sub_logits = mx.array([last_logits[tid] for tid in tids])
            lse_vals.append(mx.logsumexp(sub_logits).item())

        lse_arr = mx.array(lse_vals)
        norm_probs = mx.softmax(lse_arr)
        mx.eval(norm_probs)

        p_sa = float(norm_probs[0].item())
        p_a = float(norm_probs[1].item())
        p_n = float(norm_probs[2].item())
        p_d = float(norm_probs[3].item())
        p_sd = float(norm_probs[4].item())

        rows.append(format_key_row(qid, p_sa, p_a, p_n, p_d, p_sd))

        if item_idx % 10 == 0 or item_idx == len(items):
            print(
                f"[MLX] Completed {item_idx}/{len(items)} items (mean latency: {sum(item_latencies)/len(item_latencies)*1000:.1f}ms)",
                file=sys.stderr,
                flush=True,
            )

    sorted_masses = sorted(raw_masses)
    median_mass = (
        sorted_masses[len(sorted_masses) // 2]
        if sorted_masses
        else 0.0
    )
    min_mass = sorted_masses[0] if sorted_masses else 0.0

    stats = {
        "prefill_tokens": len(prefix_tokens),
        "prefill_time_s": prefill_time_s,
        "items_count": len(items),
        "mean_latency_s": sum(item_latencies) / max(len(item_latencies), 1),
        "median_mass": median_mass,
        "min_mass": min_mass,
        "all_masses": raw_masses,
        "all_latencies": item_latencies,
    }

    print(
        f"[MLX] Letter mass summary: median={median_mass:.4f}, min={min_mass:.4f}",
        file=sys.stderr,
        flush=True,
    )
    return rows, stats


# -----------------------------------------------------------------------------
# CLI Entry Point
# -----------------------------------------------------------------------------

def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run language models or System One on the 12 Axes quiz."
    )
    parser.add_argument(
        "--backend",
        choices=["mlx", "systemone"],
        required=True,
        help="Inference backend to execute.",
    )
    parser.add_argument(
        "--items",
        required=True,
        help="Path to questions TSV (e.g. questions.tsv or atomic.tsv).",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="Destination path for answer key TSV (e.g. keys/<run_name>.tsv).",
    )
    parser.add_argument(
        "--digest",
        default=None,
        help="Text file containing framework digest context. Optional for mlx, required for systemone.",
    )
    parser.add_argument(
        "--model-path",
        default=None,
        help="MLX model directory or HF repo ID in local cache.",
    )
    parser.add_argument(
        "--adapter-path",
        default=None,
        help="MLX LoRA/DoRA adapter directory applied at load time.",
    )
    parser.add_argument(
        "--registry",
        default=None,
        help="TSV file listing model configurations (e.g. models.tsv).",
    )
    parser.add_argument(
        "--run",
        default=None,
        help="Run identifier corresponding to a row in --registry.",
    )
    parser.add_argument(
        "--endpoint",
        default=os.environ.get("TYPESAFE_BASE_URL", "https://api.typesafe.ai"),
        help="System One endpoint URL.",
    )
    parser.add_argument(
        "--model",
        default=os.environ.get("TYPESAFE_MODEL", "jev-latest"),
        help="Model name for System One evaluation.",
    )
    parser.add_argument(
        "--batch",
        type=int,
        default=40,
        help="Batch size for System One evaluation (default: 40).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Process only the first N items, for smoke testing.",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)

    digest_text: Optional[str] = None
    if args.digest:
        digest_path = Path(resolve_path(args.digest))
        if not digest_path.exists():
            print(f"Error: digest file not found: {args.digest}", file=sys.stderr)
            return 1
        digest_text = digest_path.read_text(encoding="utf-8")
    elif args.backend == "systemone":
        print(
            "Error: --digest PATH is required for the systemone backend.",
            file=sys.stderr,
        )
        return 1

    items_path = resolve_path(args.items)
    items = load_items(items_path, limit=args.limit)
    if not items:
        print(f"Error: no items loaded from {args.items}", file=sys.stderr)
        return 1

    print(
        f"[RUNNER] Backend: {args.backend} | Items: {len(items)} | Out: {args.out}",
        file=sys.stderr,
        flush=True,
    )

    if args.backend == "systemone":
        cache_dir = Path(__file__).resolve().parent / "cache"
        rows = run_systemone(
            items=items,
            digest_text=digest_text or "",
            endpoint=args.endpoint,
            model=args.model,
            batch_size=args.batch,
            cache_dir=cache_dir,
        )
    elif args.backend == "mlx":
        model_path = args.model_path
        adapter_path = args.adapter_path

        if args.registry and args.run:
            reg_path = Path(resolve_path(args.registry))
            m_res, a_res = resolve_model_from_registry(
                reg_path, args.run, REPO_ROOT
            )
            model_path = m_res
            adapter_path = a_res
        elif not model_path:
            model_path = resolve_path(
                "training/fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-v4-Rank32-Fused"
            )

        if not model_path:
            print("Error: model_path could not be determined", file=sys.stderr)
            return 1

        rows, stats = run_mlx(
            items=items,
            digest_text=digest_text,
            model_path=model_path,
            adapter_path=adapter_path,
        )

    write_key_file(args.out, rows)
    print(
        f"[RUNNER] Successfully wrote {len(rows)} answers to {args.out}",
        file=sys.stderr,
        flush=True,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
