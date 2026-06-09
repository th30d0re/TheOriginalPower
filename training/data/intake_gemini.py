#!/usr/bin/env python3
"""
Intake Gemini conversation exports into training examples.

Google Takeout exports Gemini chats as JSON files (typically one per
conversation). Each conversation contains a list of turns with user
and model messages.

Usage:
    # Place Gemini JSON exports in training/data/raw/gemini/
    python3 training/data/intake_gemini.py

Output: training/data/from_gemini.jsonl
"""

import json
import re
from pathlib import Path
from typing import List

RAW_DIR = Path("training/data/raw/gemini")
OUTPUT_FILE = Path("training/data/from_gemini.jsonl")

# Exclude generic pleasantries / low-value turns
SKIP_PATTERNS = [
    r"^hi\\b",
    r"^hello\\b",
    r"^thank you",
    r"^thanks",
    r"^you're welcome",
    r"^sure\\b",
    r"^got it",
    r"^ok\\b",
    r"^okay\\b",
    r"^no problem",
]
MIN_TURN_LEN = 120  # chars


def is_low_value(text: str) -> bool:
    text_lower = text.lower().strip()
    for pat in SKIP_PATTERNS:
        if re.search(pat, text_lower):
            return True
    return False


def parse_gemini_json(filepath: Path) -> List[dict]:
    """Parse a Gemini JSON export into prompt-completion pairs."""
    examples = []
    try:
        data = json.loads(filepath.read_text())
    except Exception as e:
        print(f"  Error parsing {filepath}: {e}")
        return examples

    # Google Takeout Gemini format: list of conversation objects
    # Each has "history" or "messages" with "role" and "text" or "parts"
    conversations = data if isinstance(data, list) else [data]

    for conv in conversations:
        turns = conv.get("history", conv.get("messages", conv.get("turns", [])))
        if not turns:
            continue

        # Extract user/model pairs
        user_text = None
        for turn in turns:
            role = turn.get("role", turn.get("author", "")).lower()
            text = turn.get("text", "")
            if not text and "parts" in turn:
                parts = turn["parts"]
                text = " ".join(str(p) for p in parts if isinstance(p, str))

            if role in ("user", "human", "you"):
                user_text = text.strip()
            elif role in ("model", "assistant", "gemini", "bot") and user_text:
                model_text = text.strip()
                if (len(user_text) >= 20 and len(model_text) >= MIN_TURN_LEN
                        and not is_low_value(user_text)
                        and not is_low_value(model_text)):
                    examples.append({
                        "prompt": user_text,
                        "completion": model_text,
                    })
                user_text = None

    return examples


def main():
    if not RAW_DIR.exists():
        print(f"Create {RAW_DIR} and place Gemini JSON exports there.")
        RAW_DIR.mkdir(parents=True, exist_ok=True)
        return

    all_examples = []
    json_files = sorted(RAW_DIR.glob("*.json"))
    print(f"Found {len(json_files)} Gemini JSON files in {RAW_DIR}")

    for filepath in json_files:
        print(f"  Processing {filepath.name}...")
        examples = parse_gemini_json(filepath)
        print(f"    → {len(examples)} Q&A pairs")
        all_examples.extend(examples)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in all_examples:
            f.write(json.dumps(ex) + '\n')

    print(f"\nWrote {len(all_examples)} examples to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
