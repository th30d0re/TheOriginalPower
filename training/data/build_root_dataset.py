#!/usr/bin/env python3
"""
Build the master training dataset by combining all sources.

Sources:
- train.jsonl (original manual Q&A)
- greek_boost.jsonl (E-operator notation drill)
- from_latex.jsonl (LaTeX book source)
- from_notebooklm.jsonl (NotebookLM synthesized responses)
- from_pdfs.jsonl (PDF source documents)
- (optional) from_gemini.jsonl (user-provided Gemini exports)

Applies quality filters, deduplication, and train/validation split.
"""

import json
import random
import sys
from pathlib import Path
from typing import List, Dict

# --- Configuration ---
DATA_DIR = Path("training/data")
MASTER_TRAIN = DATA_DIR / "master_train.jsonl"
MASTER_VAL = DATA_DIR / "master_val.jsonl"
MASTER_COMBINED = DATA_DIR / "master_all.jsonl"
VAL_RATIO = 0.05
RANDOM_SEED = 42

# Source files to combine
SOURCES = [
    ("train.jsonl", 1.0),
    ("greek_boost.jsonl", 1.0),
    ("from_latex.jsonl", 1.0),
    ("from_notebooklm.jsonl", 1.0),
    ("from_pdfs.jsonl", 1.0),
    ("from_gemini.jsonl", 1.0),      # optional: place in training/data/raw/gemini/
    ("from_transcripts.jsonl", 1.0), # optional: place in training/data/raw/recorder/ or youtube/
    ("from_takeout.jsonl", 1.0),     # processed from Google Takeout zips
]

# Quality filters
MIN_PROMPT_LEN = 10
MIN_COMPLETION_LEN = 80
MAX_COMPLETION_LEN = 6000
MAX_TOTAL_LEN = 8000


def load_jsonl(filepath: Path) -> List[dict]:
    """Load a JSONL file, skipping malformed lines.
    Handles both prompt/completion and messages (chat) formats."""
    if not filepath.exists():
        return []
    items = []
    with open(filepath) as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                # Convert messages format to prompt/completion
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
                print(f"  Skip malformed line {i} in {filepath.name}")
    return items


def is_quality_example(ex: dict) -> bool:
    """Check if an example passes quality filters."""
    prompt = ex.get("prompt", "")
    completion = ex.get("completion", "")
    
    if not prompt or not completion:
        return False
    if len(prompt) < MIN_PROMPT_LEN:
        return False
    if len(completion) < MIN_COMPLETION_LEN:
        return False
    if len(completion) > MAX_COMPLETION_LEN:
        return False
    if len(prompt) + len(completion) > MAX_TOTAL_LEN:
        return False
    
    # Reject generic/empty completions
    completion_lower = completion.lower()
    if completion_lower.count("the") / max(len(completion.split()), 1) > 0.3:
        # Too many filler words - heuristic for garbage
        pass  # Not rejecting, just noting
    
    return True


def format_for_mlx(ex: dict) -> dict:
    """Format example for MLX training (chat template)."""
    prompt = ex["prompt"].strip()
    completion = ex["completion"].strip()
    
    # Ensure prompt ends with a question indicator if it doesn't already
    if not prompt.endswith(("?", ".", "!")):
        prompt += "."
    
    return {
        "prompt": prompt,
        "completion": completion,
    }


def main():
    random.seed(RANDOM_SEED)
    
    all_examples: List[dict] = []
    source_counts: Dict[str, int] = {}
    
    print("Loading sources...")
    for filename, weight in SOURCES:
        filepath = DATA_DIR / filename
        items = load_jsonl(filepath)
        if not items:
            print(f"  {filename}: not found or empty")
            continue
        
        # Apply quality filter
        quality_items = [ex for ex in items if is_quality_example(ex)]
        rejected = len(items) - len(quality_items)
        
        print(f"  {filename}: {len(items)} loaded, {rejected} rejected, {len(quality_items)} kept")
        
        # Sample by weight (if weight < 1.0, downsample)
        if weight < 1.0:
            n_keep = max(1, int(len(quality_items) * weight))
            quality_items = random.sample(quality_items, n_keep)
        
        source_counts[filename] = len(quality_items)
        all_examples.extend(quality_items)
    
    print(f"\nTotal before dedup: {len(all_examples)}")
    
    # Deduplicate by prompt (case-insensitive, first 100 chars)
    seen = set()
    unique = []
    for ex in all_examples:
        key = ex["prompt"].lower()[:120]
        if key not in seen:
            seen.add(key)
            unique.append(ex)
    
    print(f"After dedup: {len(unique)}")
    
    # Format for MLX
    formatted = [format_for_mlx(ex) for ex in unique]
    
    # Shuffle and split
    random.shuffle(formatted)
    val_size = max(1, int(len(formatted) * VAL_RATIO))
    val_set = formatted[:val_size]
    train_set = formatted[val_size:]
    
    print(f"\nSplit: {len(train_set)} train, {len(val_set)} validation")
    
    # Write files
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(MASTER_TRAIN, 'w') as f:
        for ex in train_set:
            f.write(json.dumps(ex) + '\n')
    
    with open(MASTER_VAL, 'w') as f:
        for ex in val_set:
            f.write(json.dumps(ex) + '\n')
    
    with open(MASTER_COMBINED, 'w') as f:
        for ex in formatted:
            f.write(json.dumps(ex) + '\n')
    
    # Summary
    print(f"\nWrote:")
    print(f"  {MASTER_TRAIN} ({MASTER_TRAIN.stat().st_size:,} bytes)")
    print(f"  {MASTER_VAL} ({MASTER_VAL.stat().st_size:,} bytes)")
    print(f"  {MASTER_COMBINED} ({MASTER_COMBINED.stat().st_size:,} bytes)")
    
    print("\nSource breakdown:")
    for src, count in source_counts.items():
        pct = count / len(unique) * 100
        print(f"  {src}: {count} ({pct:.1f}%)")
    
    # Estimate training time (rough)
    est_mins = len(train_set) * 0.03  # ~3s per example per epoch on M2 Max
    print(f"\nEstimated training time per epoch: ~{est_mins/60:.1f} hours")


if __name__ == "__main__":
    main()
