#!/usr/bin/env python3
"""
Intake Google Takeout NotebookLM and YouTube data directly from zip files.

Avoids filesystem encoding issues by reading files in-memory from the zip.
Processes JSON, HTML, and CSV files into training examples.

Usage:
    python3 training/data/intake_takeout.py

Output: training/data/from_takeout.jsonl
"""

import csv
import json
import re
import zipfile
from pathlib import Path
from typing import List, Dict

TAKEOUT_ZIPS = [
    Path.home() / "Downloads" / "takeout-20260607T222326Z-6-001.zip",
    Path.home() / "Downloads" / "takeout-20260607T222326Z-6-002.zip",
    Path.home() / "Downloads" / "takeout-20260607T222326Z-6-003.zip",
    Path.home() / "Downloads" / "takeout-20260607T222326Z-4-001.zip",
]
OUTPUT_FILE = Path("training/data/from_takeout.jsonl")

# Framework relevance terms for scoring
FRAMEWORK_TERMS = [
    "extraction", "buffer class", "psychological wage", "elite", "out-group",
    "racism", "oppression", "systemic", "algorithm", "partition",
    "enclosure", "tri-modal", "variable swap", "reparations",
    "kinetic resistance", "electrodynamic", "circuit", "snubber",
    "bonilla-silva", "racecraft", "quantcrit", "iterated audit",
    "bacon", "13th amendment", "redlining", "war on drugs",
    "tweedism", "holc", "incarceration", "colorblind",
    "redefining", "original power", "five-tier", "puppet class",
    "enforcement class", "root ledger", "mathematics of oppression",
]

SKIP_NOTEBOOKS = [
    "jamf", "resume strategy", "game engine", "terminal app",
    "firearm industry", "epstein", "sensory penis", "nixon v herndon",
    "marine infrared", "atlassian", "cfs r&d",
]


def is_framework_relevant(text: str) -> bool:
    text_lower = text.lower()
    return any(term in text_lower for term in FRAMEWORK_TERMS)


def is_framework_notebook(path: str) -> bool:
    path_lower = path.lower()
    return not any(skip in path_lower for skip in SKIP_NOTEBOOKS)


def clean_html(html: str) -> str:
    """Extract readable text from HTML."""
    # Remove script and style tags
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
    # Replace common block tags with newlines
    for tag in ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'li', 'tr', 'br']:
        html = re.sub(f'</{tag}>', '\n', html, flags=re.IGNORECASE)
        html = re.sub(f'<{tag}[^>]*>', '\n', html, flags=re.IGNORECASE)
    # Remove remaining tags
    html = re.sub(r'<[^>]+>', ' ', html)
    # Clean up whitespace
    html = re.sub(r'\n{3,}', '\n\n', html)
    html = re.sub(r' {2,}', ' ', html)
    return html.strip()


def parse_notebook_json(content: str, notebook_name: str) -> List[dict]:
    """Parse a NotebookLM notebook JSON file."""
    examples = []
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        return examples

    # Extract notes
    notes = data.get("notes", data.get("Notes", []))
    for note in notes:
        title = note.get("title", note.get("Title", ""))
        body = note.get("content", note.get("Content", note.get("text", note.get("Text", ""))))
        if body and len(body) > 200:
            prompt = f"Analyze the following from the '{notebook_name}' notebook: {title}".strip()
            examples.append({"prompt": prompt, "completion": body.strip()})

    # Extract chat history if present
    chats = data.get("chats", data.get("chatHistory", data.get("Chat History", [])))
    for chat in chats:
        user_msg = chat.get("user", chat.get("User", chat.get("query", chat.get("Query", ""))))
        model_msg = chat.get("model", chat.get("Model", chat.get("response", chat.get("Response", ""))))
        if user_msg and model_msg and len(model_msg) > 200:
            examples.append({"prompt": user_msg.strip(), "completion": model_msg.strip()})

    return examples


def parse_html_source(content: str, source_name: str) -> List[dict]:
    """Parse an HTML source document."""
    text = clean_html(content)
    if len(text) < 500:
        return []

    # Split into chunks
    chunks = []
    paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 100]
    chunk = ""
    for p in paragraphs:
        if len(chunk) + len(p) > 2000:
            if len(chunk) > 500:
                chunks.append(chunk)
            chunk = p
        else:
            chunk += "\n\n" + p if chunk else p
    if len(chunk) > 500:
        chunks.append(chunk)

    examples = []
    for i, chunk in enumerate(chunks[:5]):  # Max 5 chunks per source
        prompt = f"Discuss the following research on {source_name.replace('_', ' ')}."
        examples.append({"prompt": prompt, "completion": chunk})
    return examples


def parse_csv_content(content: str, source_name: str) -> List[dict]:
    """Parse CSV data (e.g., YouTube comments)."""
    examples = []
    try:
        lines = content.splitlines()
        if len(lines) < 2:
            return examples
        reader = csv.DictReader(lines)
        rows = list(reader)

        # YouTube comments CSV
        if "Comment" in rows[0] if rows else {}:
            comments = [r["Comment"] for r in rows if r.get("Comment") and len(r["Comment"]) > 50]
            if comments:
                text = "\n\n".join(comments[:20])
                examples.append({
                    "prompt": f"Analyze these YouTube comments related to {source_name}.",
                    "completion": text
                })

        # YouTube history CSV
        if "Title" in rows[0] if rows else {}:
            titles = [r["Title"] for r in rows if r.get("Title")]
            if titles:
                text = "\n".join(titles[:50])
                examples.append({
                    "prompt": f"Summarize these YouTube video topics related to {source_name}.",
                    "completion": text
                })
    except Exception:
        pass
    return examples


def process_zip(zip_path: Path) -> List[dict]:
    """Process a single Takeout zip file."""
    examples = []
    print(f"\nProcessing {zip_path.name}...")

    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue

                # Skip media files
                if any(info.filename.lower().endswith(ext) for ext in
                       ['.wav', '.png', '.pdf', '.mp3', '.m4a', '.jpg', '.jpeg',
                        '.mp4', '.mov', '.avi', '.gif', '.webp', '.heic']):
                    continue

                # Only process NotebookLM and YouTube data
                if 'NotebookLM' not in info.filename and 'YouTube' not in info.filename:
                    continue

                # Skip non-framework notebooks
                if 'NotebookLM' in info.filename and not is_framework_notebook(info.filename):
                    continue

                # Skip metadata-only JSON files (tiny)
                if info.file_size < 200:
                    continue

                try:
                    content = zf.read(info.filename).decode('utf-8', errors='replace')
                except Exception as e:
                    print(f"  Skip {info.filename}: {e}")
                    continue

                # Skip non-relevant content
                if not is_framework_relevant(content):
                    continue

                # Parse based on file type
                basename = Path(info.filename).name
                if info.filename.endswith('.json'):
                    # Determine if it's a notebook or source metadata
                    if 'metadata' in basename.lower():
                        continue  # Skip tiny metadata files
                    notebook_name = info.filename.split('/')[2] if len(info.filename.split('/')) > 2 else "NotebookLM"
                    exs = parse_notebook_json(content, notebook_name)
                elif info.filename.endswith('.html'):
                    source_name = Path(info.filename).stem
                    exs = parse_html_source(content, source_name)
                elif info.filename.endswith('.csv'):
                    source_name = Path(info.filename).stem
                    exs = parse_csv_content(content, source_name)
                else:
                    continue

                examples.extend(exs)
                if len(exs) > 0:
                    print(f"  +{len(exs)} from {info.filename[:80]}...")

    except Exception as e:
        print(f"Error processing {zip_path}: {e}")

    return examples


def main():
    print("Google Takeout Intake — NotebookLM & YouTube")
    print("=" * 50)

    all_examples = []
    for zip_path in TAKEOUT_ZIPS:
        if not zip_path.exists():
            print(f"Skip: {zip_path} not found")
            continue
        examples = process_zip(zip_path)
        all_examples.extend(examples)

    # Deduplicate
    seen = set()
    unique = []
    for ex in all_examples:
        key = ex["prompt"][:100].lower()
        if key not in seen:
            seen.add(key)
            unique.append(ex)

    print(f"\n{'=' * 50}")
    print(f"Total examples: {len(all_examples)}")
    print(f"After dedup: {len(unique)}")

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        for ex in unique:
            f.write(json.dumps(ex) + '\n')

    print(f"Wrote {len(unique)} examples to {OUTPUT_FILE}")
    if OUTPUT_FILE.exists():
        print(f"File size: {OUTPUT_FILE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
