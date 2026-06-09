#!/usr/bin/env python3
"""
Export Google Takeout training examples into the Obsidian vault as categorized markdown notes.

Reads: training/data/from_takeout.jsonl
Writes: ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/Original Power/06 Supporting Material/Google Takeout Research/<category>/<note>.md

Each note preserves the full prompt/completion exchange with YAML frontmatter tags.
"""

import json
import html
import re
from pathlib import Path
from datetime import datetime

# Paths
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
TAKEOUT_PATH = REPO_ROOT / "training" / "data" / "from_takeout.jsonl"
VAULT_ROOT = Path.home() / "Library" / "Mobile Documents" / "iCloud~md~obsidian" / "Documents" / "Root" / "Original Power"
OUTPUT_ROOT = VAULT_ROOT / "06 Supporting Material" / "Google Takeout Research"

# Ensure output root exists
OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)


def categorize_topic(topic: str) -> tuple[str, str]:
    """Return (folder_name, category_label) based on topic keywords."""
    t = topic.lower()

    # Legal cases and constitutional law
    if any(k in t for k in ["v ", " v.", "supreme court", "court of appeals", "circuit", "commonwealth", "district of columbia", "regents of", "buckley v", "skinner v", "bailey v", "barnes v", "felix"]):
        return "Legal Cases", "legal-cases"

    # Second Amendment / gun policy
    if any(k in t for k in ["gun", "firearm", "second amendment", "2a", "heller", "brueen", "mcdonald", "caetano", "massachusetts assault weapon", "concealed handgun", "shooting review", "gunshot detection", "nra"]):
        return "Gun Policy and Second Amendment", "gun-policy"

    # Haiti and Caribbean
    if any(k in t for k in ["haiti", "haitian", "caribbean", "du bois", "black reconstruction", "rigaud", "hispaniola", "france, haiti"]):
        return "Haiti and Caribbean History", "haiti-caribbean"

    # Racial framework / structural racism
    if any(k in t for k in ["structural racism", "systemic racism", "racialized", "racecraft", "redlining", "extraction kernel", "buffer class", "psychological wage", "mathematics of oppression", "root ledger", "racism is code", "racial threat", "redefining racism", "original power", "framework"]):
        return "Racial Framework and Analysis", "racial-framework"

    # Medical / health
    if any(k in t for k in ["myasthenia gravis", "bacterial vaginosis", "microbiome", "vagina", "semen", "ocular", "urologist", "medicine", "medication assisted", "maternal mortal", "lead exposure", "lead poisoning", "blood lead", "obesity", "health", "addiction", "opioid", "cannabis", "marijuana"]):
        return "Medical and Health Research", "medical-health"

    # 3D printing / manufacturing / materials
    if any(k in t for k in ["3d print", "pla", "petg", "abs", "asa", "filament", "additive manufacturing", "compliant mechanism", "fiber-reinforced", "composite", "enclosure", "fatigue life", "peel performance"]):
        return "3D Printing and Manufacturing", "3d-printing"

    # AI / LLM / technology
    if any(k in t for k in ["llm", "claude", "ai ", "artificial intelligence", "abliteration", "machine learning", "reinforcement learning", "cybersecurity", "microcontroller", "esp32", "arduino", "adc microphone", "digital signal"]):
        return "AI and Technology", "ai-technology"

    # Environmental / water / lead
    if any(k in t for k in ["water", "atmospheric water", "environmental", "life cycle", "sustainability", "pollution", "air lead", "urban rise and fall", "ecological knowledge", "sub-saharan"]):
        return "Environmental and Water", "environmental"

    # Intimate partner violence / domestic violence
    if any(k in t for k in ["intimate partner", "domestic violence", "ipv", "gbv", "gender-based"]):
        return "Intimate Partner Violence", "ipv"

    # Podcast / audio
    if ".m4a" in t or "podcast" in t or "episode" in t:
        return "Podcasts and Audio", "podcasts"

    # Political / economic / elections
    if any(k in t for k in ["project 2025", "election", "trump", "biden", "supreme court", "congress", "house committee", "amendment", "debt", "economic consequence", "strategic plan"]):
        return "Political and Economic", "political-economic"

    # Marriage / gender / sexuality
    if any(k in t for k in ["marriage", "gender", "sexuality", "homosexuality", "patriarchy", "black men", "masculinity"]):
        return "Gender Marriage and Sexuality", "gender-marriage"

    # Historical / slavery / empire
    if any(k in t for k in ["slave", "trans-atlantic", "bacon", "rebellion", "british colonial", "empire", "colonization", "french revolution"]):
        return "History and Empire", "history-empire"

    # Food / agriculture / urban policy
    if any(k in t for k in ["food", "urban", "city", "affordable housing", "transportation", "highway"]):
        return "Urban Policy and Food Systems", "urban-policy"

    # Default catch-all
    return "General Research", "general-research"


def sanitize_filename(topic: str) -> str:
    """Create a filesystem-safe filename from a topic."""
    # Remove file extensions and parenthetical duplicates
    cleaned = re.sub(r"\.(pdf|md|m4a|txt|jsonl)\b", "", topic, flags=re.IGNORECASE)
    cleaned = re.sub(r"\(\d+\)\s*$", "", cleaned).strip()
    cleaned = html.unescape(cleaned)
    # Replace unsafe chars
    cleaned = re.sub(r"[<>:/\\|?*\"\n\r]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    # Limit length
    if len(cleaned) > 80:
        cleaned = cleaned[:77] + "..."
    return cleaned if cleaned else "Untitled"


def write_note(topic: str, prompt: str, completion: str, category_folder: Path, used_names: set) -> Path:
    """Write a single markdown note, handling name collisions."""
    base_name = sanitize_filename(topic)
    name = base_name
    counter = 1
    while name in used_names:
        suffix = f" ({counter})"
        # Ensure total length stays reasonable
        trunc = base_name[:80 - len(suffix)] if len(base_name) + len(suffix) > 80 else base_name
        name = f"{trunc}{suffix}"
        counter += 1
    used_names.add(name)

    category_folder.mkdir(parents=True, exist_ok=True)
    filepath = category_folder / f"{name}.md"

    # Decode HTML entities in completion
    clean_completion = html.unescape(completion)

    topic_escaped = topic.replace('"', '\\"')
    frontmatter = f"""---
topic: "{topic_escaped}"
source: google-takeout
category: {category_folder.name}
exported: {datetime.now().isoformat()}
tags:
  - takeout
  - research
---

# {topic}

**Prompt:** {prompt}

## Response

{clean_completion}
"""

    filepath.write_text(frontmatter, encoding="utf-8")
    return filepath


def main():
    if not TAKEOUT_PATH.exists():
        print(f"Takeout file not found: {TAKEOUT_PATH}")
        return 1

    entries = []
    with open(TAKEOUT_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    print(f"Loaded {len(entries)} takeout entries")

    # Per-folder name tracker
    used_names_per_folder: dict[Path, set] = {}
    category_counts: dict[str, int] = {}

    for entry in entries:
        prompt = entry.get("prompt", "")
        completion = entry.get("completion", "")

        # Extract topic from prompt
        m = re.match(r"Discuss the following research on (.+)\.", prompt)
        if m:
            topic = m.group(1).strip()
        else:
            topic = prompt[:100]

        folder_name, _ = categorize_topic(topic)
        category_folder = OUTPUT_ROOT / folder_name
        used_names = used_names_per_folder.setdefault(category_folder, set())

        write_note(topic, prompt, completion, category_folder, used_names)
        category_counts[folder_name] = category_counts.get(folder_name, 0) + 1

    print(f"\nWrote {len(entries)} notes to:")
    print(f"  {OUTPUT_ROOT}")
    print("\nCategory breakdown:")
    for folder, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  {folder}: {count}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
