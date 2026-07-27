#!/usr/bin/env python3
"""Check that every year cited in a story chapter module appears in its source slice.

The chapter modules under website/src/content/chapters/ are written by agents from
the per-chapter slices in Paper/chapters_src/. Dates are the failure mode that
matters most: an agent that knows a fact from outside the manuscript will happily
supply a plausible year the book never states. This catches that.

Usage:
    python3 tools/verify_chapter_facts.py            # all authored chapters
    python3 tools/verify_chapter_facts.py ch09       # one chapter

Exits non-zero when any year cannot be found in the chapter's own source, so it
can gate a wave of generated content before it is committed.

Regenerate the slices first if they are missing:
    python3 tools/slice_chapters.py --out Paper/chapters_src
    python3 tools/chapter_extract.py --src Paper/chapters_src
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "website/src/content/manifest.ts"
CHAPTERS = REPO / "website/src/content/chapters"
SLICES = REPO / "Paper/chapters_src"

YEAR_RE = re.compile(r"\b(1[0-9]{3}|20[0-2][0-9])\b")
ENTRY_RE = re.compile(r"id: '(\w+)',[\s\S]*?sourceFile: '([^']+)'")


def source_map() -> dict[str, str]:
    return dict(ENTRY_RE.findall(MANIFEST.read_text(encoding="utf-8")))


def main() -> int:
    wanted = sys.argv[1:]
    entries = source_map()
    failures = 0
    checked = 0

    for module in sorted(CHAPTERS.glob("ch*.ts")):
        chapter_id = module.name[:4]
        if wanted and chapter_id not in wanted:
            continue
        source_file = entries.get(chapter_id)
        if not source_file:
            print(f"{chapter_id}  SKIP — no manifest entry")
            continue
        slice_txt = SLICES / source_file.replace(".tex", ".txt")
        if not slice_txt.exists():
            print(f"{chapter_id}  SKIP — {slice_txt.name} missing (regenerate slices)")
            continue

        source = slice_txt.read_text(encoding="utf-8")
        years = sorted(set(YEAR_RE.findall(module.read_text(encoding="utf-8"))))
        missing = [y for y in years if y not in source]
        checked += 1
        if missing:
            failures += len(missing)
            print(f"{chapter_id}  UNVERIFIED: {' '.join(missing)}  ({module.name})")
        else:
            print(f"{chapter_id}  ok — {len(years)} years all present in source")

    print(f"\n{checked} chapters checked, {failures} unverified years")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
