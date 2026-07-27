#!/usr/bin/env python3
"""Slice Paper/The_Original_Power.tex into per-chapter .tex files + manifest.json.

Usage: python3 tools/slice_chapters.py --out <dir> [--tex Paper/The_Original_Power.tex] [--no-expand]

Standalone ``\\input{...}`` lines are expanded inline before chapter boundaries
are located, so chapters that live in their own files are still sliced. Pass
--no-expand to keep the old behaviour of scanning the main file only.
"""
import argparse
import json
import re
from pathlib import Path

CHAPTER_RE = re.compile(r"^\s*\\chapter\{(.*)\}\s*$")
INPUT_RE = re.compile(r"^\s*\\input\{([^}]+)\}\s*$")
MAX_INPUT_DEPTH = 10


def slugify(title: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", title.lower()).strip("_")
    return slug[:max_len].rstrip("_")


def _resolve_input(name: str, base_dir: Path, repo_root: Path) -> Path | None:
    for root in (base_dir, repo_root):
        for candidate in (root / f"{name}.tex", root / name):
            if candidate.is_file():
                return candidate.resolve()
    return None


def expand_inputs(lines: list, base_dir: Path, repo_root: Path,
                  seen: set, depth: int = 0) -> list:
    """Splice standalone \\input{...} file contents into the line list.

    A file already present in ``seen`` is never expanded twice, and expansion
    stops past MAX_INPUT_DEPTH; unresolvable targets are left as-is.
    """
    out = []
    for line in lines:
        m = INPUT_RE.match(line)
        if m and depth < MAX_INPUT_DEPTH:
            resolved = _resolve_input(m.group(1), base_dir, repo_root)
            if resolved is not None and resolved not in seen:
                seen.add(resolved)
                sub = resolved.read_text(encoding="utf-8").splitlines(keepends=True)
                out.extend(expand_inputs(sub, resolved.parent, repo_root, seen, depth + 1))
                continue
        out.append(line)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tex", default="Paper/The_Original_Power.tex")
    ap.add_argument("--out", required=True)
    ap.add_argument("--no-expand", action="store_true",
                    help="Scan the main .tex only; do not expand \\input directives.")
    args = ap.parse_args()

    src = Path(args.tex)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    lines = src.read_text(encoding="utf-8").splitlines(keepends=True)

    expanded = not args.no_expand
    if expanded:
        # Line numbers below refer to the expanded document, not the main file.
        repo_root = Path(__file__).resolve().parent.parent
        lines = expand_inputs(lines, src.resolve().parent, repo_root,
                              seen={src.resolve()})

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
        entry = {
            "order": order,
            "title": title,
            "slug": slug,
            "file": fname,
            "start_line": start_idx + 1,
            "end_line": end_idx,
        }
        if expanded:
            entry["expanded"] = True
        manifest.append(entry)
        print(f"{order:02d}  L{start_idx + 1}-{end_idx}  {title}")

    payload = {"expanded": True, "chapters": manifest} if expanded else manifest
    (out / "manifest.json").write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"{len(manifest)} chapters -> {out}")


if __name__ == "__main__":
    main()
