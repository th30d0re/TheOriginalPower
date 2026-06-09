#!/usr/bin/env python3
"""
inference_agent.py — JSON-RPC inference agent for fused MLX models.

Usage:
    .venv-voice/bin/python3 training/inference_agent.py --model-path PATH

Protocol (line-delimited JSON over stdin/stdout):
    Request:  {"history": [{"role": "user", "content": "..."}], "max_tokens": 512, "temp": 0.7}
    Response: {"response": "...", "tokens": 127, "duration_ms": 2840}
    Error:    {"error": "..."}
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler


def run_agent(model_path: str) -> int:
    print(f"[AGENT] Loading model from {model_path} ...", file=sys.stderr, flush=True)
    model, tokenizer = load(model_path, tokenizer_config={"trust_remote_code": True})
    print("[AGENT] Model loaded. Waiting for requests.", file=sys.stderr, flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            req = json.loads(line)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}), flush=True)
            continue

        history = req.get("history", [])
        max_tokens = req.get("max_tokens", 512)
        temp = req.get("temp", 0.7)
        top_p = req.get("top_p", 0.9)

        try:
            if tokenizer.chat_template is not None:
                prompt = tokenizer.apply_chat_template(
                    history, tokenize=False, add_generation_prompt=True
                )
            else:
                # Fallback for models without chat template
                parts = []
                for msg in history:
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                    parts.append(f"{role}: {content}")
                parts.append("assistant: ")
                prompt = "\n\n".join(parts)

            start = time.perf_counter()
            sampler = make_sampler(temp, top_p=top_p)
            response = generate(
                model,
                tokenizer,
                prompt=prompt,
                max_tokens=max_tokens,
                sampler=sampler,
                verbose=False,
            )
            duration_ms = int((time.perf_counter() - start) * 1000)

            # Rough token count — mlx_lm doesn't return it directly
            tokens = len(tokenizer.encode(response, add_special_tokens=False))

            print(
                json.dumps(
                    {"response": response, "tokens": tokens, "duration_ms": duration_ms}
                ),
                flush=True,
            )
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)

    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="MLX Inference Agent")
    parser.add_argument("--model-path", type=str, required=True)
    args = parser.parse_args()
    return run_agent(args.model_path)


if __name__ == "__main__":
    sys.exit(main())
