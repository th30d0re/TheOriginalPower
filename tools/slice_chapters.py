#!/usr/bin/env python3
"""Slice Paper/The_Original_Power.tex into per-chapter .tex files + manifest.json.

Usage: python3 tools/slice_chapters.py --out <dir> [--tex Paper/The_Original_Power.tex]
"""
import argparse
import json
import re
from pathlib import Path

CHAPTER_RE = re.compile(r"^\s*\\chapter\{(.*)\}\s*$")


def slugify(title: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", title.lower()).strip("_")
    return slug[:max_len].rstrip("_")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tex", default="Paper/The_Original_Power.tex")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    src = Path(args.tex)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    lines = src.read_text(encoding="utf-8").splitlines(keepends=True)

    # Locate chapter starts (1-based line numbers).
    starts = []  # (line_idx, title)
    for i, line in enumerate(lines):
        m = CHAPTER_RE.match(line)
        if m:
            starts.append((i, m.group(1)))

    if not starts:
        raise SystemExit(f"no \\chapter{{}} lines found in {src}")

    # Front matter.
    front_end = starts[0][0]
    (out / "00_frontmatter.tex").write_text("".join(lines[:front_end]), encoding="utf-8")

    manifest = []
    for order, (start_idx, title) in enumerate(starts, 1):
        end_idx = starts[order][0] if order < len(starts) else len(lines)
        slug = slugify(title)
        fname = f"{order:02d}_{slug}.tex"
        (out / fname).write_text("".join(lines[start_idx:end_idx]), encoding="utf-8")
        manifest.append(
            {
                "order": order,
                "title": title,
                "slug": slug,
                "file": fname,
                "start_line": start_idx + 1,
                "end_line": end_idx,
            }
        )
        print(f"{order:02d}  L{start_idx + 1}-{end_idx}  {title}")

    (out / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"{len(manifest)} chapters -> {out}")


if __name__ == "__main__":
    main()
