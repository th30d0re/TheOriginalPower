#!/usr/bin/env python3
"""
Export ChatGPT conversations and Twitter/X tweets into the Obsidian vault.

Sources:
  - ChatGPT: ~/Downloads/conversations.json
  - ChatGPT: ~/Downloads/23ab4c59db939236fa61a921e14f7a466f75f9c0e78eb7bbd968bb2ce68685d8-2025-11-06-19-18-32-ada321d2a4e444df85c17b7c46e5e758/conversations.json
  - Twitter:  ~/Dev/tulu/data/Twitter_Backups/tweets_combined.csv

Output:
  ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/Original Power/06 Supporting Material/ChatGPT Conversations/<category>/<title>.md
  ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Root/Original Power/06 Supporting Material/Twitter Archive/<YYYY-MM>/<tweet_id>.md
"""

import ast
import csv
import json
import re
import html
from pathlib import Path
from datetime import datetime
from typing import List, Tuple

# Paths
HOME = Path.home()
VAULT_ROOT = HOME / "Library" / "Mobile Documents" / "iCloud~md~obsidian" / "Documents" / "Root" / "Original Power"
CHATGPT_ROOT = VAULT_ROOT / "06 Supporting Material" / "ChatGPT Conversations"
TWITTER_ROOT = VAULT_ROOT / "06 Supporting Material" / "Twitter Archive"

CHATGPT_SOURCES = [
    HOME / "Downloads" / "conversations.json",
    HOME / "Downloads" / "23ab4c59db939236fa61a921e14f7a466f75f9c0e78eb7bbd968bb2ce68685d8-2025-11-06-19-18-32-ada321d2a4e444df85c17b7c46e5e758" / "conversations.json",
]
TWITTER_CSV = HOME / "Dev" / "tulu" / "data" / "Twitter_Backups" / "tweets_combined.csv"


def ensure_dirs():
    CHATGPT_ROOT.mkdir(parents=True, exist_ok=True)
    TWITTER_ROOT.mkdir(parents=True, exist_ok=True)


def sanitize_filename(name: str) -> str:
    if not name:
        return "Untitled"
    cleaned = html.unescape(name)
    cleaned = re.sub(r"[<>:/\\|?*\"\n\r]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    if len(cleaned) > 80:
        cleaned = cleaned[:77] + "..."
    return cleaned or "Untitled"


def categorize_chatgpt(title: str, text_preview: str) -> str:
    t = (title + " " + text_preview).lower()

    if any(k in t for k in ["racism", "haiti", "haitian", "elite", "extraction", "buffer class", "oppression", "systemic", "framework", "original power", "root ledger", "mathematics of oppression", "defection cascade", "snubber", "psychological wage", "redlining", "reparations", "bacon", "kinship", "enclosure"]):
        return "Framework and Research"

    if any(k in t for k in ["python", "swift", "code", "api", "json", "programming", "developer", "github", "docker", "server", "database", "react", "typescript", "javascript", "ml", "llm", "ai ", "neural", "algorithm", "function", "class ", "module", "package", "deploy"]):
        return "Coding and Engineering"

    if any(k in t for k in ["cover letter", "resume", "interview", "job", "salary", "hr ", "hiring", "linkedin", "career", "manager", "work ", "email", "client", "contract", "invoice"]):
        return "Career and Work"

    if any(k in t for k in ["dating", "relationship", "bianca", "love", "girlfriend", "boyfriend", "wife", "husband", "marriage", "breakup", "jealousy", "rizz", "profile", "tinder", "hinge", "bumble"]):
        return "Relationships and Personal"

    if any(k in t for k in ["essay", "write", "story", "poem", "lyrics", "rap", "song", "speech", "caption", "caption", "creative", "art", "midjourney", "dalle", "image"]):
        return "Creative Writing"

    if any(k in t for k in ["medical", "health", "doctor", "symptom", "disease", "diagnosis", "medication", "pain", "injury", "vitamin", "diet", "workout", "gym", "fitness"]):
        return "Health and Wellness"

    if any(k in t for k in ["money", "tax", "insurance", "loan", "mortgage", "invest", "stock", "crypto", "budget", "credit", "bank", "car ", "apartment", "lease", "rent", "travel", "flight", "hotel"]):
        return "Finance and Life Admin"

    return "General"


def reconstruct_thread(mapping: dict) -> List[Tuple[str, str, float]]:
    """Reconstruct a ChatGPT conversation thread from mapping graph.
    Returns list of (role, content, create_time) tuples."""
    # Find root
    root_id = None
    for mid, node in mapping.items():
        if node.get("parent") is None:
            root_id = mid
            break
    if not root_id:
        return []

    thread = []
    visited = set()

    # Iterative BFS/DFS to avoid recursion limit and cycles
    stack = list(mapping.get(root_id, {}).get("children", []))
    while stack:
        node_id = stack.pop(0)  # BFS preserves order
        if node_id in visited:
            continue
        visited.add(node_id)

        node = mapping.get(node_id)
        if not node:
            continue
        msg = node.get("message") or {}
        author = msg.get("author") or {}
        role = author.get("role", "unknown")
        content_obj = msg.get("content") or {}
        parts = content_obj.get("parts") if isinstance(content_obj.get("parts"), list) else []
        text = "\n".join(str(p) for p in parts if isinstance(p, str))
        text = html.unescape(text).strip()
        create_time = msg.get("create_time") or 0.0

        if role in ("user", "assistant") and text:
            thread.append((role, text, create_time))

        for child_id in node.get("children", []):
            if child_id not in visited:
                stack.append(child_id)

    return thread


def write_chatgpt_note(conversation: dict, category_folder: Path, used_names: set) -> Path:
    title = conversation.get("title") or "Untitled"
    safe_title = sanitize_filename(title)

    name = safe_title
    counter = 1
    while name in used_names:
        suffix = f" ({counter})"
        trunc = safe_title[:80 - len(suffix)] if len(safe_title) + len(suffix) > 80 else safe_title
        name = f"{trunc}{suffix}"
        counter += 1
    used_names.add(name)

    category_folder.mkdir(parents=True, exist_ok=True)
    filepath = category_folder / f"{name}.md"

    mapping = conversation.get("mapping", {})
    thread = reconstruct_thread(mapping)

    # Build preview for categorization
    preview = " ".join(text[:200] for _, text, _ in thread[:3])
    folder_name = categorize_chatgpt(title, preview)
    actual_folder = CHATGPT_ROOT / folder_name
    actual_folder.mkdir(parents=True, exist_ok=True)
    actual_filepath = actual_folder / f"{name}.md"

    conv_id = conversation.get("conversation_id") or conversation.get("id", "")
    create_time = conversation.get("create_time", 0.0)
    create_date = datetime.fromtimestamp(create_time).isoformat() if create_time else ""
    model = conversation.get("default_model_slug", "")

    lines = [f"---"]
    lines.append(f'title: "{title.replace(chr(34), chr(92)+chr(34))}"')
    lines.append(f"source: chatgpt")
    lines.append(f"category: {folder_name}")
    if conv_id:
        lines.append(f"conversation_id: {conv_id}")
    if create_date:
        lines.append(f"created: {create_date}")
    if model:
        lines.append(f"model: {model}")
    lines.append(f"messages: {len(thread)}")
    lines.append(f"exported: {datetime.now().isoformat()}")
    lines.append(f"tags:")
    lines.append(f"  - chatgpt")
    lines.append(f"  - conversation")
    lines.append(f"---")
    lines.append("")
    lines.append(f"# {title}")
    lines.append("")

    for role, text, _ in thread:
        header = "## User" if role == "user" else "## Assistant"
        lines.append(header)
        lines.append("")
        lines.append(text)
        lines.append("")

    actual_filepath.write_text("\n".join(lines), encoding="utf-8")
    return actual_filepath


def parse_twitter_date(date_str: str) -> Tuple[str, str]:
    """Parse Twitter date like 'Sat Feb 01 15:32:13 +0000 2025' into (folder, iso)."""
    try:
        dt = datetime.strptime(date_str, "%a %b %d %H:%M:%S +0000 %Y")
        folder = dt.strftime("%Y-%m")
        iso = dt.isoformat()
        return folder, iso
    except Exception:
        return "unknown", ""


def write_tweet_note(row: dict, month_folder: Path, used_names: set) -> Path:
    tweet_id = row.get("id", "unknown")
    name = f"tweet_{tweet_id}"
    counter = 1
    original_name = name
    while name in used_names:
        name = f"{original_name}_{counter}"
        counter += 1
    used_names.add(name)

    month_folder.mkdir(parents=True, exist_ok=True)
    filepath = month_folder / f"{name}.md"

    created_at = row.get("created_at", "")
    folder, iso_date = parse_twitter_date(created_at)
    text = row.get("text", "")
    retweets = row.get("retweets", "")
    likes = row.get("likes", "")
    replies = row.get("replies", "")
    hashtags = row.get("hashtags", "")
    mentions = row.get("mentions", "")
    media = row.get("media", "")

    def yaml_list(csv_val: str) -> str:
        try:
            parsed = ast.literal_eval(csv_val)
            if isinstance(parsed, list):
                if not parsed:
                    return "[]"
                items = ", ".join(f'"{item}"' for item in parsed)
                return f"[{items}]"
        except Exception:
            pass
        return f'"{csv_val}"'

    lines = [f"---"]
    lines.append(f"tweet_id: {tweet_id}")
    lines.append(f"source: twitter")
    lines.append(f"created: {iso_date}")
    lines.append(f"retweets: {retweets}")
    lines.append(f"likes: {likes}")
    lines.append(f"replies: {replies}")
    lines.append(f"hashtags: {yaml_list(hashtags)}")
    if mentions:
        lines.append(f"mentions: {yaml_list(mentions)}")
    if media:
        lines.append(f"media: {yaml_list(media)}")
    lines.append(f"exported: {datetime.now().isoformat()}")
    lines.append(f"tags:")
    lines.append(f"  - twitter")
    lines.append(f"  - tweet")
    lines.append(f"---")
    lines.append("")
    lines.append(f"# Tweet {tweet_id}")
    lines.append("")
    lines.append(text)
    lines.append("")
    if media:
        lines.append(f"**Media:** {media}")

    filepath.write_text("\n".join(lines), encoding="utf-8")
    return filepath


def export_chatgpt():
    total = 0
    category_counts = {}
    used_names_per_folder: dict[Path, set] = {}

    for src_path in CHATGPT_SOURCES:
        if not src_path.exists():
            print(f"  ChatGPT source not found: {src_path}")
            continue

        print(f"Loading ChatGPT export: {src_path}")
        with open(src_path, "r", encoding="utf-8") as f:
            conversations = json.load(f)

        for conv in conversations:
            title = conv.get("title") or "Untitled"
            mapping = conv.get("mapping", {})
            thread = reconstruct_thread(mapping)
            preview = " ".join(text[:200] for _, text, _ in thread[:3])
            folder_name = categorize_chatgpt(title, preview)
            category_folder = CHATGPT_ROOT / folder_name
            used_names = used_names_per_folder.setdefault(category_folder, set())

            write_chatgpt_note(conv, category_folder, used_names)
            category_counts[folder_name] = category_counts.get(folder_name, 0) + 1
            total += 1

    print(f"\nExported {total} ChatGPT conversations")
    for folder, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  {folder}: {count}")


def export_twitter():
    if not TWITTER_CSV.exists():
        print(f"  Twitter CSV not found: {TWITTER_CSV}")
        return

    total = 0
    month_counts = {}
    used_names_per_folder: dict[Path, set] = {}

    with open(TWITTER_CSV, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            created_at = row.get("created_at", "")
            month_folder_name, _ = parse_twitter_date(created_at)
            month_folder = TWITTER_ROOT / month_folder_name
            used_names = used_names_per_folder.setdefault(month_folder, set())

            write_tweet_note(row, month_folder, used_names)
            month_counts[month_folder_name] = month_counts.get(month_folder_name, 0) + 1
            total += 1

    print(f"\nExported {total} tweets")
    for month, count in sorted(month_counts.items()):
        print(f"  {month}: {count}")


def main():
    ensure_dirs()
    print("Exporting ChatGPT conversations...")
    export_chatgpt()
    print("\nExporting Twitter archive...")
    export_twitter()
    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
