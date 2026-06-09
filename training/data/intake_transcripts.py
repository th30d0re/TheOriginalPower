#!/usr/bin/env python3
"""
Intake Recorder and YouTube transcripts into training examples.

Handles:
- Plain text transcripts (.txt)
- VTT/SRT subtitle files (.vtt, .srt)
- Markdown transcripts (.md)

Segments long transcripts into thematic chunks and generates
prompt-completion pairs. Framework-specific terms boost chunk priority.

Usage:
    # Place transcript files in:
    #   training/data/raw/recorder/  (voice memos, interviews)
    #   training/data/raw/youtube/   (YouTube transcript exports)
    python3 training/data/intake_transcripts.py

Output: training/data/from_transcripts.jsonl
"""

import json
import re
from pathlib import Path
from typing import List, Tuple

RAW_DIRS = [Path("training/data/raw/recorder"), Path("training/data/raw/youtube")]
OUTPUT_FILE = Path("training/data/from_transcripts.jsonl")

# Framework-specific terms that signal high-value segments
FRAMEWORK_TERMS = [
    "extraction", "buffer class", "psychological wage", "elite", "out-group",
    "racism", "oppression", "systemic", "algorithm", "partition",
    "enclosure", "tri-modal", "variable swap", "reparations",
    "kinetic resistance", "electrodynamic", "circuit", "snubber",
    "bonilla-silva", "racecraft", "quantcrit", "iterated audit",
    "bacon's rebellion", "13th amendment", "redlining", "war on drugs",
    "tweedism", "holc", "mass incarceration", "colorblind",
]

CHUNK_SIZE = 2500
CHUNK_OVERLAP = 300
MIN_CHUNK_LEN = 400
MAX_EXAMPLES_PER_FILE = 15


def parse_vtt(text: str) -> str:
    """Extract plain text from VTT/SRT content."""
    lines = []
    for line in text.splitlines():
        line = line.strip()
        # Skip timestamps, cue IDs, WEBVTT header
        if not line or line.startswith("WEBVTT"):
            continue
        if re.match(r"^\\d+:\\d+:", line):
            continue
        if re.match(r"^\\d+$", line):
            continue
        lines.append(line)
    return " ".join(lines)


def score_chunk(text: str) -> int:
    """Score a text chunk by framework term density."""
    text_lower = text.lower()
    return sum(1 for term in FRAMEWORK_TERMS if term in text_lower)


def chunk_text(text: str) -> List[str]:
    """Split text into overlapping chunks at sentence boundaries."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        if end < len(text):
            for sep in ['. ', '? ', '! ', '\n\n', '\n']:
                pos = text.rfind(sep, start + CHUNK_SIZE - 200, end)
                if pos != -1:
                    end = pos + len(sep)
                    break
        chunk = text[start:end].strip()
        if len(chunk) >= MIN_CHUNK_LEN:
            chunks.append(chunk)
        start = end - CHUNK_OVERLAP
        if start >= len(text) - CHUNK_OVERLAP:
            break
    return chunks


def process_file(filepath: Path) -> List[dict]:
    """Process a single transcript file into training examples."""
    print(f"  Processing {filepath.name}...")

    try:
        text = filepath.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        text = filepath.read_text(encoding='latin-1')

    # Parse format
    if filepath.suffix.lower() in ('.vtt', '.srt'):
        text = parse_vtt(text)
    else:
        # Clean markdown/plaintext
        text = re.sub(r'\\[.*?\\]', '', text)  # remove markdown links
        text = re.sub(r'[#*_`]', '', text)      # remove markdown formatting

    chunks = chunk_text(text)
    if not chunks:
        print(f"    No usable chunks")
        return []

    # Sort by framework relevance score
    scored = [(score_chunk(c), c) for c in chunks]
    scored.sort(reverse=True)

    topic = filepath.stem.replace('_', ' ').replace('-', ' ')
    templates = [
        "Discuss {topic} in the context of systemic oppression analysis.",
        "Explain the framework concepts related to {topic}.",
        "Analyze {topic} using the Root Ledger model.",
    ]

    examples = []
    for i, (score, chunk) in enumerate(scored[:MAX_EXAMPLES_PER_FILE]):
        if score == 0:
            continue  # Skip chunks with no framework terms
        prompt = templates[i % len(templates)].format(topic=topic)
        examples.append({"prompt": prompt, "completion": chunk})

    print(f"    {len(text)} chars → {len(chunks)} chunks → {len(examples)} examples (top score: {scored[0][0] if scored else 0})")
    return examples


def main():
    all_examples = []
    total_files = 0

    for raw_dir in RAW_DIRS:
        if not raw_dir.exists():
            print(f"Create {raw_dir} and place transcript files there.")
            raw_dir.mkdir(parents=True, exist_ok=True)
            continue

        files = sorted(raw_dir.glob("*.txt")) + sorted(raw_dir.glob("*.md")) + sorted(raw_dir.glob("*.vtt")) + sorted(raw_dir.glob("*.srt"))
        print(f"\n{raw_dir.name}: {len(files)} files")
        total_files += len(files)

        for filepath in files:
            examples = process_file(filepath)
            all_examples.extend(examples)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in all_examples:
            f.write(json.dumps(ex) + '\n')

    print(f"\nProcessed {total_files} transcript files")
    print(f"Wrote {len(all_examples)} examples to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
