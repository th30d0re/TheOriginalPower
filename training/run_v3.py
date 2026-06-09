#!/usr/bin/env python3
"""
Run v3 training with expanded dataset.

Pipeline:
1. Build master dataset from all sources
2. Symlink train.jsonl / valid.jsonl for mlx_lm compatibility
3. Train Rank-32 LoRA on NPBP-abliterated base
4. Fuse adapters into final model
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "training" / "data"
ADAPTER_DIR = REPO_ROOT / "training" / "adapters"
FUSED_DIR = REPO_ROOT / "training" / "fused_models"
BASE_MODEL = "training/fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused"

# V3 configuration
V3_NAME = "gemma3_12b_npbp_abliterated_v3_v3_rank32_e5"
V3_ADAPTER_PATH = ADAPTER_DIR / V3_NAME


VENV_PYTHON = str(REPO_ROOT / ".venv-voice" / "bin" / "python3")

def run(cmd: list, cwd: Path = REPO_ROOT) -> int:
    # Use venv python for all commands
    if cmd[0] == sys.executable:
        cmd[0] = VENV_PYTHON
    print(f"\n$ {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=cwd)


def step_build_dataset() -> bool:
    print("=" * 60)
    print("STEP 1: Build master dataset")
    print("=" * 60)
    rc = run([sys.executable, "training/data/build_root_dataset.py"])
    if rc != 0:
        print("Dataset build failed")
        return False
    
    # Symlink for mlx_lm compatibility
    train_src = DATA_DIR / "master_train.jsonl"
    val_src = DATA_DIR / "master_val.jsonl"
    train_link = DATA_DIR / "train.jsonl"
    val_link = DATA_DIR / "valid.jsonl"
    
    for src, link in [(train_src, train_link), (val_src, val_link)]:
        if link.exists() or link.is_symlink():
            link.unlink()
        link.symlink_to(src.name)
        print(f"  Linked {link.name} -> {src.name}")
    
    # Count examples
    n_train = sum(1 for _ in train_src.open())
    n_val = sum(1 for _ in val_src.open())
    print(f"  Training examples: {n_train}")
    print(f"  Validation examples: {n_val}")
    return True


def step_train() -> bool:
    print("\n" + "=" * 60)
    print("STEP 2: Train v3 LoRA")
    print("=" * 60)
    
    cmd = [
        sys.executable, "training/train.py",
        "--model", str(BASE_MODEL),
        "--adapter-path", str(V3_ADAPTER_PATH),
        "--epochs", "5",
        "--batch-size", "1",
        "--grad-accumulation-steps", "16",
        "--learning-rate", "5e-6",
        "--lora-rank", "32",
        "--lora-dropout", "0.05",
        "--lora-scale", "4.0",
        "--max-seq-length", "2048",
        "--num-layers", "32",
        "--save-every", "100",
        "--steps-per-eval", "100",
        "--val-batches", "25",
        "--grad-checkpoint",
        "--seed", "42",
    ]
    rc = run(cmd)
    return rc == 0


def step_fuse() -> bool:
    print("\n" + "=" * 60)
    print("STEP 3: Fuse adapters")
    print("=" * 60)
    
    fused_path = FUSED_DIR / f"RootLedger-Gemma3-12B-NPBP-Abliterated-v3-v3-Rank32-Fused"
    cmd = [
        sys.executable, "-m", "mlx_lm.fuse",
        "--model", str(BASE_MODEL),
        "--adapter-path", str(V3_ADAPTER_PATH),
        "--save-path", str(fused_path),
    ]
    rc = run(cmd)
    if rc == 0:
        print(f"\nFused model saved to: {fused_path}")
    return rc == 0


def main():
    print("Root Ledger v3 Training Pipeline")
    print(f"Base model: {BASE_MODEL}")
    print(f"Output: {V3_ADAPTER_PATH}")
    
    if not step_build_dataset():
        return 1
    if not step_train():
        return 1
    if not step_fuse():
        return 1
    
    print("\n" + "=" * 60)
    print("v3 Training Complete!")
    print("=" * 60)
    print(f"Adapters: {V3_ADAPTER_PATH}")
    print(f"Fused:    {FUSED_DIR}/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-v3-Rank32-Fused")
    return 0


if __name__ == "__main__":
    sys.exit(main())
