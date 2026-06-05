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

    # Build CLI argument list for mlx_lm.fuse.main()
    fuse_argv = [
        "mlx_lm.fuse",
        "--model", args.model,
        "--save-path", str(save_path),
        "--adapter-path", args.adapter_path,
    ]
    if args.dequantize:
        fuse_argv.append("--dequantize")
    if args.upload_repo:
        fuse_argv.extend(["--upload-repo", args.upload_repo])

    print("=" * 60)
    print("Root Ledger Adapter Fusion — MLX Native")
    print(f"Base model    : {args.model}")
    print(f"Adapter path  : {args.adapter_path}")
    print(f"Save path     : {save_path}")
    print(f"Dequantize    : {args.dequantize}")
    print(f"Export GGUF   : False")
    print("=" * 60)

    original_argv = sys.argv
    try:
        sys.argv = fuse_argv
        from mlx_lm import fuse as fuse_module
        fuse_module.main()
    except Exception as e:
        print(f"Fusion failed: {e}", file=sys.stderr)
        return 1
    finally:
        sys.argv = original_argv

    print(f"\nFusion complete. Model saved to: {save_path}")
    print("This is an MLX-optimized model. Load it with mlx_lm or mlx-swift-lm.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
