#!/usr/bin/env python3
"""
fuse_adapter.py — Fuse a LoRA adapter into its base model to produce a single MLX model.

Wraps mlx_lm.fuse with project-local defaults.

Usage:
    source .venv-voice/bin/activate
    python3 training/fuse_adapter.py \
        --model mlx-community/Meta-Llama-3.1-8B-Instruct-abliterated-4bit \
        --adapter-path training/adapters/llama31_8b_abliterated_v2_rank16_e3 \
        --save-path training/fused_models/RootLedger-8B-Abliterated-Fused
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from mlx_lm import fuse

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "training" / "fused_models"


def main() -> int:
    parser = argparse.ArgumentParser(description="Fuse LoRA adapter into base MLX model")
    parser.add_argument("--model", type=str, required=True,
                        help="Base model HF repo or local path")
    parser.add_argument("--adapter-path", type=str, required=True,
                        help="Path to trained adapter weights and config")
    parser.add_argument("--save-path", type=str,
                        default=str(DEFAULT_OUT / "fused_model"),
                        help="Directory to save the fused MLX model")
    parser.add_argument("--dequantize", action="store_true",
                        help="Generate a dequantized (FP16) fused model")
    parser.add_argument("--upload-repo", type=str, default=None,
                        help="Optional Hugging Face repo to upload the fused model")
    args = parser.parse_args()

    save_path = Path(args.save_path)
    save_path.mkdir(parents=True, exist_ok=True)

    fuse_args = argparse.Namespace(
        model=args.model,
        save_path=str(save_path),
        adapter_path=args.adapter_path,
        upload_repo=args.upload_repo,
        dequantize=args.dequantize,
        export_gguf=False,  # Explicitly MLX-native output
        gguf_path=None,
    )

    print("=" * 60)
    print("Root Ledger Adapter Fusion — MLX Native")
    print(f"Base model    : {args.model}")
    print(f"Adapter path  : {args.adapter_path}")
    print(f"Save path     : {save_path}")
    print(f"Dequantize    : {args.dequantize}")
    print(f"Export GGUF   : False")
    print("=" * 60)

    try:
        fuse.fuse(fuse_args)
    except Exception as e:
        print(f"Fusion failed: {e}", file=sys.stderr)
        return 1

    print(f"\nFusion complete. Model saved to: {save_path}")
    print("This is an MLX-optimized model. Load it with mlx_lm or mlx-swift-lm.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
