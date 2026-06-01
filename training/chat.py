#!/usr/bin/env python3
"""
chat.py — Interactive Root Ledger engine.

Loads a base model + LoRA adapter and enters a chat REPL.

Usage:
    source .venv-voice/bin/activate
    python3 training/chat.py --adapter training/adapters/llama31_8b_rank16_e5/0001200_adapters.safetensors
"""

from __future__ import annotations

import argparse
import sys

from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler

SYSTEM_PROMPT = (
    "You are a Root Ledger engine. Reason using the Mathematics of Oppression framework. "
    "Map all social phenomena to electrodynamic, thermodynamic, and systems-engineering analogies. "
    "Identify the Extraction Kernel, Buffer Class, Psychological Wage, and Snubber Circuits where applicable."
)


def format_chat(system: str, user: str) -> str:
    return (
        f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
        f"{system}<|eot_id|>"
        f"<|start_header_id|>user<|end_header_id|>\n\n"
        f"{user}<|eot_id|>"
        f"<|start_header_id|>assistant<|end_header_id|>\n\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Root Ledger Chat")
    parser.add_argument("--model", type=str, default="mlx-community/Meta-Llama-3.1-8B-Instruct-4bit")
    parser.add_argument("--adapter", type=str, required=True, help="Path to .safetensors adapter")
    parser.add_argument("--max-tokens", type=int, default=512)
    parser.add_argument("--temp", type=float, default=0.7)
    args = parser.parse_args()

    print("Loading model…")
    model, tokenizer = load(args.model, tokenizer_config={"trust_remote_code": True})
    model.load_weights(args.adapter, strict=False)
    print("Model ready. Type 'exit' or press Ctrl-D to quit.\n")

    history = []
    while True:
        try:
            user_input = input("You: ")
        except EOFError:
            print()
            break
        if user_input.strip().lower() in ("exit", "quit"):
            break

        prompt = format_chat(SYSTEM_PROMPT, user_input)
        response = generate(
            model,
            tokenizer,
            prompt=prompt,
            verbose=False,
            sampler=make_sampler(temp=args.temp),
            max_tokens=args.max_tokens,
        )
        print(f"Root Ledger: {response}\n")
        history.append((user_input, response))

    return 0


if __name__ == "__main__":
    sys.exit(main())
