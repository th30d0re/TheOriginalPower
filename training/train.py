#!/usr/bin/env python3
"""
train.py — MLX LoRA fine-tuning runner for the Root Ledger adversarial alignment protocol.

Wraps mlx_lm.lora.run() with project-specific defaults and a JSONL training logger.

Usage:
    source .venv-voice/bin/activate
    python3 training/train.py --model mlx-community/Llama-3.1-8B-4bit --epochs 3
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import time
from pathlib import Path
from types import SimpleNamespace

# mlx_lm must be installed
from mlx_lm import lora
from mlx_lm.tuner.callbacks import TrainingCallback

# ── Paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT    = Path(__file__).resolve().parent.parent
DEFAULT_DATA = REPO_ROOT / "training" / "data"
DEFAULT_OUT  = REPO_ROOT / "training" / "adapters"


# ── Callback that streams metrics to JSONL ────────────────────────────────────

class JSONLLogger(TrainingCallback):
    def __init__(self, log_path: Path):
        self.log_path = log_path
        self.start_time = time.time()
        # truncate on fresh run
        self.log_path.write_text("", encoding="utf-8")

    def on_train_loss_report(self, info: dict):
        entry = {
            "step": info.get("step"),
            "train_loss": info.get("loss"),
            "learning_rate": info.get("learning_rate"),
            "elapsed_sec": time.time() - self.start_time,
        }
        with self.log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")

    def on_val_loss_report(self, info: dict):
        entry = {
            "step": info.get("step"),
            "val_loss": info.get("loss"),
            "val_perplexity": info.get("perplexity"),
            "elapsed_sec": time.time() - self.start_time,
        }
        with self.log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")


# ── Defaults derived from mlx_lm.lora.CONFIG_DEFAULTS ─────────────────────────

DEFAULTS = {
    "train": True,
    "fine_tune_type": "lora",
    "optimizer": "adam",
    "optimizer_config": {"adam": {}, "adamw": {}, "muon": {}, "sgd": {}, "adafactor": {}},
    "seed": 42,
    "num_layers": 32,
    "batch_size": 4,
    "learning_rate": 1e-5,
    "steps_per_report": 10,
    "steps_per_eval": 100,
    "save_every": 100,
    "val_batches": 25,
    "max_seq_length": 2048,
    "grad_checkpoint": False,
    "grad_accumulation_steps": 4,
    "clear_cache_threshold": 0,
    "lr_schedule": None,
    "lora_parameters": {"rank": 16, "dropout": 0.05, "scale": 2.0},
    "mask_prompt": False,
    "report_to": None,
    "project_name": None,
    "resume_adapter_file": None,
    "test": False,
    "test_batches": 500,
    "config": None,
    "hf_dataset": False,
}


def estimate_iters(data_dir: Path, batch_size: int, epochs: int, grad_accum: int) -> int:
    train_file = data_dir / "train.jsonl"
    if not train_file.exists():
        raise FileNotFoundError(f"{train_file} not found")
    n = sum(1 for _ in train_file.open("r", encoding="utf-8"))
    effective_batch = batch_size * grad_accum
    steps_per_epoch = math.ceil(n / effective_batch)
    return steps_per_epoch * epochs


def build_args(**overrides) -> SimpleNamespace:
    kwargs = {**DEFAULTS, **overrides}
    return SimpleNamespace(**kwargs)


def main() -> int:
    parser = argparse.ArgumentParser(description="Root Ledger LoRA Training")
    parser.add_argument("--model", type=str, default="mlx-community/Meta-Llama-3.1-8B-Instruct-4bit",
                        help="Base model HF repo or local path")
    parser.add_argument("--data", type=str, default=str(DEFAULT_DATA),
                        help="Directory containing train.jsonl and valid.jsonl")
    parser.add_argument("--adapter-path", type=str, default=str(DEFAULT_OUT / "run_default"),
                        help="Output directory for adapters")
    parser.add_argument("--epochs", type=int, default=3,
                        help="Training epochs (used to estimate --iters)")
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--grad-accumulation-steps", type=int, default=4)
    parser.add_argument("--learning-rate", type=float, default=1e-5)
    parser.add_argument("--max-seq-length", type=int, default=2048)
    parser.add_argument("--lora-rank", type=int, default=16)
    parser.add_argument("--lora-dropout", type=float, default=0.05)
    parser.add_argument("--lora-scale", type=float, default=2.0)
    parser.add_argument("--num-layers", type=int, default=32,
                        help="Number of transformer layers to adapt")
    parser.add_argument("--save-every", type=int, default=100)
    parser.add_argument("--steps-per-eval", type=int, default=100)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--iters", type=int, default=None,
                        help="Override automatic iteration estimate")
    args = parser.parse_args()

    data_dir = Path(args.data)
    iters = args.iters or estimate_iters(
        data_dir, args.batch_size, args.epochs, args.grad_accumulation_steps
    )
    print(f"Auto-estimated iterations: {iters} ({args.epochs} epochs)")

    adapter_path = Path(args.adapter_path)
    adapter_path.mkdir(parents=True, exist_ok=True)

    log_file = adapter_path / "training_log.jsonl"
    callback = JSONLLogger(log_file)

    run_args = build_args(
        model=args.model,
        data=args.data,
        adapter_path=str(adapter_path),
        iters=iters,
        batch_size=args.batch_size,
        grad_accumulation_steps=args.grad_accumulation_steps,
        learning_rate=args.learning_rate,
        max_seq_length=args.max_seq_length,
        num_layers=args.num_layers,
        save_every=args.save_every,
        steps_per_eval=args.steps_per_eval,
        seed=args.seed,
        lora_parameters={
            "rank": args.lora_rank,
            "dropout": args.lora_dropout,
            "scale": args.lora_scale,
        },
    )

    print("=" * 60)
    print("Root Ledger Adversarial Alignment Protocol — Training Start")
    print(f"Model : {args.model}")
    print(f"Data  : {args.data}")
    print(f"Out   : {adapter_path}")
    print(f"Iters : {iters}")
    print("=" * 60)

    # Patch load() so base models without chat_template still work with ChatDataset
    _orig_load = lora.load
    _template_path = Path(__file__).resolve().parent / "llama31_chat_template.jinja"

    def _patched_load(path, tokenizer_config=None, **kwargs):
        model, tokenizer = _orig_load(path, tokenizer_config=tokenizer_config, **kwargs)
        if tokenizer.chat_template is None and _template_path.exists():
            tokenizer.chat_template = _template_path.read_text(encoding="utf-8")
            print("[PATCH] Injected chat_template for base model")
        return model, tokenizer

    lora.load = _patched_load

    try:
        lora.run(run_args, training_callback=callback)
    except KeyboardInterrupt:
        print("\nTraining interrupted by user.")
        return 130

    print(f"\nTraining complete. Adapters saved to {adapter_path}")
    print(f"Loss log: {log_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
