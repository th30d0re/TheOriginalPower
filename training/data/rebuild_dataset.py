#!/usr/bin/env python3
"""
One-command dataset rebuild after adding new raw sources.

Run this after placing new exports in:
  - training/data/raw/gemini/       (Gemini JSON exports)
  - training/data/raw/recorder/     (Voice memo transcripts)
  - training/data/raw/youtube/      (YouTube transcript exports)

Pipeline:
  1. Run all intake scripts (Gemini, transcripts)
  2. Build master dataset
  3. Update symlinks for training
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = REPO_ROOT / "training" / "data"
V3_DATA_DIR = REPO_ROOT / "training" / "data_v3"

INTAKE_SCRIPTS = [
    "training/data/intake_gemini.py",
    "training/data/intake_transcripts.py",
]


def run(cmd: list, cwd: Path = REPO_ROOT) -> int:
    print(f"\n$ {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=cwd)


def main():
    print("=" * 60)
    print("Root Ledger Dataset Rebuild")
    print("=" * 60)

    # Step 1: Run intake scripts
    print("\n--- Step 1: Intake raw sources ---")
    for script in INTAKE_SCRIPTS:
        script_path = REPO_ROOT / script
        if script_path.exists():
            rc = run([sys.executable, str(script_path)])
            if rc != 0:
                print(f"Warning: {script} exited with code {rc}")
        else:
            print(f"  {script}: not found")

    # Step 2: Build master dataset
    print("\n--- Step 2: Build master dataset ---")
    rc = run([sys.executable, "training/data/build_root_dataset.py"])
    if rc != 0:
        print("Dataset build failed")
        return 1

    # Step 3: Update symlinks
    print("\n--- Step 3: Update training symlinks ---")
    V3_DATA_DIR.mkdir(parents=True, exist_ok=True)

    train_src = DATA_DIR / "master_train.jsonl"
    val_src = DATA_DIR / "master_val.jsonl"
    train_link = V3_DATA_DIR / "train.jsonl"
    val_link = V3_DATA_DIR / "valid.jsonl"

    for link in [train_link, val_link]:
        if link.exists() or link.is_symlink():
            link.unlink()

    train_link.symlink_to(train_src.relative_to(V3_DATA_DIR))
    val_link.symlink_to(val_src.relative_to(V3_DATA_DIR))

    print(f"  {train_link} -> {train_src.name}")
    print(f"  {val_link} -> {val_src.name}")

    # Summary
    n_train = sum(1 for _ in train_src.open())
    n_val = sum(1 for _ in val_src.open())

    print("\n" + "=" * 60)
    print("Dataset rebuild complete!")
    print("=" * 60)
    print(f"Training examples:   {n_train}")
    print(f"Validation examples: {n_val}")
    print(f"Total:               {n_train + n_val}")
    print(f"\nTraining data dir: {V3_DATA_DIR}")
    print("\nTo start training:")
    print("  python3 training/run_v3.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
