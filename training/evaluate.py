#!/usr/bin/env python3
"""
evaluate.py — Qualitative evaluation harness for Root Ledger adapters.

Loads a base model + LoRA adapter and runs framework-specific prompts,
printing raw outputs for inspection.

Usage:
    source .venv-voice/bin/activate
    python3 training/evaluate.py --adapter training/adapters/llama31_8b_rank16_e5/adapters.safetensors
    python3 training/evaluate.py --adapter training/adapters/llama31_8b_rank16_e5/0001200_adapters.safetensors
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import mlx.core as mx
from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler
from mlx_lm.tuner.utils import load_adapters

# ── Prompts ───────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = (
    "You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. "
    "Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. "
    "Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable."
)

TEST_PROMPTS = [
    {
        "id": "crime_bill",
        "label": "1994 Crime Bill Analysis",
        "prompt": "Evaluate the 1994 Crime Bill using the Root Ledger framework.",
    },
    {
        "id": "aru_pullman",
        "label": "ARU / j² = -1",
        "prompt": "How does the ARU Pullman Strike demonstrate j² = -1?",
    },
    {
        "id": "redlining",
        "label": "Redlining / Casimir Cavity",
        "prompt": "Define redlining as a Sociological Casimir Cavity.",
    },
    {
        "id": "haitian_theorem",
        "label": "Haitian Theorem / Non-kinetic Reform",
        "prompt": "Why does non-kinetic reform fail to reduce Elite extraction share? Cite the Haitian Theorem.",
    },
    {
        "id": "silicon_immunity",
        "label": "Silicon Immunity Theorem",
        "prompt": "Explain the Silicon Immunity Theorem and its implications for AI alignment.",
    },
    {
        "id": "baseline",
        "label": "Baseline / What is racism?",
        "prompt": "What is racism?",
    },
    {
        "id": "clause_diagnosis",
        "label": "Clause Diagnosis",
        "prompt": 'Diagnose the following statutory clause: "If any slave resist his master... shall chance to die, that neither the master... shall be liable to any punishment therefor."',
    },
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def format_chat(system: str, user: str) -> str:
    """Format as Llama-3.1 Instruct chat template."""
    return (
        f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
        f"{system}<|eot_id|>"
        f"<|start_header_id|>user<|end_header_id|>\n\n"
        f"{user}<|eot_id|>"
        f"<|start_header_id|>assistant<|end_header_id|>\n\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Root Ledger Adapter Evaluation")
    parser.add_argument(
        "--model",
        type=str,
        default="mlx-community/Meta-Llama-3.1-8B-Instruct-4bit",
        help="Base model path or HF repo",
    )
    parser.add_argument(
        "--adapter",
        type=str,
        default="training/adapters/llama31_8b_rank16_e5/adapters.safetensors",
        help="Path to LoRA adapter weights (.safetensors)",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=512,
        help="Maximum tokens to generate per response",
    )
    parser.add_argument(
        "--temp",
        type=float,
        default=0.7,
        help="Sampling temperature",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Optional JSON file to write results",
    )
    args = parser.parse_args()

    adapter_path = Path(args.adapter)
    if not adapter_path.exists():
        print(f"Adapter not found: {adapter_path}", file=sys.stderr)
        return 1

    print("=" * 70)
    print("Root Ledger Evaluation Harness")
    print(f"Model : {args.model}")
    print(f"Adapter: {adapter_path}")
    print("=" * 70)

    print("\nLoading model…")
    model, tokenizer = load(args.model, tokenizer_config={"trust_remote_code": True})

    # Load adapter weights into the model
    if adapter_path.is_dir():
        load_adapters(model, str(adapter_path))
    else:
        # mlx_lm.load_adapters expects a directory with adapter_config.json + adapters.safetensors
        # If a single file is passed, load it manually
        model.load_weights(str(adapter_path), strict=False)

    results: list[dict] = []

    for item in TEST_PROMPTS:
        chat_prompt = format_chat(SYSTEM_PROMPT, item["prompt"])
        print(f"\n--- [{item['id']}] {item['label']} ---")
        print(f"Prompt: {item['prompt']}")
        print("Response:")

        response = generate(
            model,
            tokenizer,
            prompt=chat_prompt,
            verbose=False,
            sampler=make_sampler(temp=args.temp),
            max_tokens=args.max_tokens,
        )
        print(response)
        results.append(
            {
                "id": item["id"],
                "label": item["label"],
                "prompt": item["prompt"],
                "response": response,
            }
        )

    if args.output:
        out_path = Path(args.output)
        out_path.write_text(
            json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        print(f"\nResults written to {out_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
