#!/usr/bin/env python3
"""
Build a curated dataset that keeps high-quality framework examples
and filters out generic noise.

Scoring: each example is ranked by framework term density.
Only top-scoring non-original examples are kept.

Usage:
    python3 training/data/build_curated_dataset.py

Output:
    training/data/curated_train.jsonl
    training/data/curated_val.jsonl
"""

import json
import random
from pathlib import Path
from typing import List, Dict

# --- Configuration ---
DATA_DIR = Path("training/data")
OUTPUT_TRAIN = DATA_DIR / "curated_train.jsonl"
OUTPUT_VAL = DATA_DIR / "curated_val.jsonl"
VAL_RATIO = 0.05
RANDOM_SEED = 42

# Framework-specific terms for scoring
FRAMEWORK_TERMS = [
    # E-operator
    "e_ψ", "e_ω", "e_σ", "defection cascade", "extraction kernel",
    # Core variables
    "buffer class", "psychological wage", "snubber circuit",
    "elite", "out-group", "in-group", "puppet class", "enforcement class",
    # QuantCrit / formal
    "quantcrit", "iterated audit", "racialized social system", "racecraft",
    # Historical mechanisms
    "bacon", "haitian", "kinship", "gendered axis", "holc", "redlining",
    "13th amendment", "tweedism", "war on drugs", "variable swap",
    # Electrodynamic analogies
    "electrodynamic", "voltage", "current", "resistance",
    "potential difference", "resource flow", "circuit", "impedance",
    # Thermodynamic analogies
    "thermodynamic", "entropy", "heat engine", "dissipative", "thermal",
    # Tactics / praxis
    "agnostic swarm", "vanguardism", "tactical doctrine", "jury nullification",
    "zugzwang",
    # Core framework
    "i_buffer", "o_racialized", "root ledger", "mathematics of oppression",
    "five-tier", "tri-modal", "enclosure", "partition", "reparations",
    "kinetic resistance", "complex power", "johnson theorem", "concession theorem",
    "fractal mind virus", "variable swap", "dc mode", "ac mode",
]

# Weighted terms (these count extra)
HIGH_VALUE_TERMS = [
    "extraction kernel", "buffer class", "psychological wage", "snubber circuit",
    "defection cascade", "e_ψ", "e_ω", "e_σ", "five-tier", "tri-modal",
    "root ledger", "mathematics of oppression",
]

# Sources to include
SOURCES = [
    ("train_original.jsonl", None, 1.0),     # recovered pre-expansion manual Q&A (1,943 ex)
    ("greek_boost.jsonl", None, 1.0),        # keep all
    ("from_latex.jsonl", 1500, 0.9),         # keep top 1500 by score
    ("from_notebooklm.jsonl", None, 1.0),    # keep all (only 50)
    ("from_pdfs.jsonl", 300, 0.7),           # keep top 300
    ("from_takeout.jsonl", 400, 0.7),        # keep top 400
]


def score_example(ex: dict) -> int:
    """Score an example by framework term density."""
    text = (ex.get("prompt", "") + " " + ex.get("completion", "")).lower()
    score = 0
    for term in FRAMEWORK_TERMS:
        if term.lower() in text:
            score += 2
    for term in HIGH_VALUE_TERMS:
        if term.lower() in text:
            score += 3
    # Bonus for mathematical notation
    if "\\(" in text or "\\[" in text or "$" in text:
        score += 2
    # Bonus for specific variable names
    for var in ["e_", "i_buffer", "o_racialized", "ρ_τ", "v_{cc}", "ψ"]:
        if var.lower() in text:
            score += 2
    return score


def load_jsonl(filepath: Path) -> List[dict]:
    items = []
    if not filepath.exists():
        return items
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                # Convert messages format
                if "messages" in obj:
                    msgs = obj["messages"]
                    user_msg = None
                    assistant_msg = None
                    for m in msgs:
                        if m.get("role") == "user":
                            user_msg = m.get("content", "")
                        elif m.get("role") == "assistant":
                            assistant_msg = m.get("content", "")
                    if user_msg and assistant_msg:
                        items.append({"prompt": user_msg, "completion": assistant_msg})
                elif "prompt" in obj and "completion" in obj:
                    items.append(obj)
            except json.JSONDecodeError:
                pass
    return items


def main():
    random.seed(RANDOM_SEED)
    all_examples = []
    source_counts = {}

    for filename, top_n, weight in SOURCES:
        filepath = DATA_DIR / filename
        items = load_jsonl(filepath)
        if not items:
            print(f"  {filename}: not found or empty")
            continue

        # Score and filter
        if top_n is not None and len(items) > top_n:
            scored = [(score_example(item), item) for item in items]
            scored.sort(key=lambda x: x[0], reverse=True)
            cutoff_score = scored[top_n - 1][0]
            kept = [item for score, item in scored if score >= cutoff_score]
            # If tie at cutoff, take all tied
            if len(kept) > top_n * 1.2:
                kept = [item for score, item in scored[:top_n]]
            print(f"  {filename}: {len(items)} → {len(kept)} (score cutoff: {cutoff_score})")
        else:
            kept = items
            print(f"  {filename}: {len(items)} (all kept)")

        source_counts[filename] = len(kept)
        all_examples.extend(kept)

    print(f"\nTotal before dedup: {len(all_examples)}")

    # Deduplicate by prompt
    seen = set()
    unique = []
    for ex in all_examples:
        key = ex["prompt"].lower()[:120]
        if key not in seen:
            seen.add(key)
            unique.append(ex)

    print(f"After dedup: {len(unique)}")

    # Shuffle and split
    random.shuffle(unique)
    val_size = max(1, int(len(unique) * VAL_RATIO))
    val_set = unique[:val_size]
    train_set = unique[val_size:]

    print(f"Split: {len(train_set)} train, {len(val_set)} validation")

    # Write
    with open(OUTPUT_TRAIN, 'w') as f:
        for ex in train_set:
            f.write(json.dumps(ex) + '\n')

    with open(OUTPUT_VAL, 'w') as f:
        for ex in val_set:
            f.write(json.dumps(ex) + '\n')

    print(f"\nWrote:")
    print(f"  {OUTPUT_TRAIN} ({OUTPUT_TRAIN.stat().st_size:,} bytes)")
    print(f"  {OUTPUT_VAL} ({OUTPUT_VAL.stat().st_size:,} bytes)")

    print("\nSource breakdown:")
    for src, count in source_counts.items():
        pct = count / len(unique) * 100
        print(f"  {src}: {count} ({pct:.1f}%)")

    # Show top-scoring examples by source
    print("\nTop-scoring examples per source:")
    for filename, top_n, weight in SOURCES:
        filepath = DATA_DIR / filename
        items = load_jsonl(filepath)
        if not items:
            continue
        scored = [(score_example(item), item) for item in items]
        scored.sort(key=lambda x: x[0], reverse=True)
        print(f"  {filename}: top score = {scored[0][0]}")


if __name__ == "__main__":
    main()
