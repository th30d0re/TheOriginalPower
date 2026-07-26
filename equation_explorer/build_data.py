#!/usr/bin/env python3
"""Consolidate equation_audit_chunks/*.json into data/equations.json.

Book order is derived from the global LaTeX line numbers recorded in each
chunk, so chapters sort exactly as they appear in the manuscript.
"""
import json
import re
import glob
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
CHUNKS = os.path.join(ROOT, "..", "equation_audit_chunks")
OUT = os.path.join(ROOT, "data", "equations.json")

LABEL_RE = re.compile(r"\\label\{[^}]*\}")
ENV_RE = re.compile(r"\\begin\{(equation|align|gather|multline|eqnarray)\*?\}|\\end\{(equation|align|gather|multline|eqnarray)\*?\}")
# audit chunks store some line breaks as `\4pt]` instead of `\\[4pt]`
BROKEN_BREAK_RE = re.compile(r"\\(\d+(?:\.\d+)?(?:pt|em|ex))\]")
# and some as `\\[4pt` with the closing bracket dropped
UNTERMINATED_BREAK_RE = re.compile(r"(\\\\\[\d+(?:\.\d+)?(?:pt|em|ex))(?!\])")
ENV_SPAN_RE = re.compile(r"\\begin\{(\w+\*?)\}.*?\\end\{\1\}", re.DOTALL)


def clean_latex(raw: str) -> str:
    tex = LABEL_RE.sub("", raw)
    tex = ENV_RE.sub("", tex)
    tex = BROKEN_BREAK_RE.sub(r"\\\\[\1", tex)
    tex = UNTERMINATED_BREAK_RE.sub(r"\1]", tex)
    # KaTeX rejects alignment `&` outside an environment; wrap in aligned
    if "&" in ENV_SPAN_RE.sub("", tex):
        tex = "\\begin{aligned}\n" + tex + "\n\\end{aligned}"
    return tex.strip()


def main() -> None:
    records = []
    for path in sorted(glob.glob(os.path.join(CHUNKS, "*.json"))):
        with open(path, encoding="utf-8") as fh:
            records.extend(json.load(fh))

    chapter_first_line = {}
    for r in records:
        line = r.get("line", 0)
        if line <= 0:
            continue
        ch = r["chapter"]
        chapter_first_line[ch] = min(line, chapter_first_line.get(ch, line))

    chapter_order = sorted(chapter_first_line, key=chapter_first_line.get)
    chapter_index = {ch: i for i, ch in enumerate(chapter_order)}

    equations = []
    for r in records:
        latex = clean_latex(r.get("rendered") or r.get("raw_latex", ""))
        if not latex:
            continue
        equations.append({
            "id": r["id"],
            "chapter": r["chapter"],
            "chapterIndex": chapter_index[r["chapter"]],
            "section": r.get("section", ""),
            "label": r.get("label", ""),
            "line": r.get("line", 0),
            "latex": latex,
        })

    equations.sort(key=lambda e: e["line"])
    chapters = [{"index": i, "title": ch} for ch, i in
                sorted(chapter_index.items(), key=lambda kv: kv[1])]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump({"chapters": chapters, "equations": equations}, fh, indent=1)

    print(f"wrote {len(equations)} equations across {len(chapters)} chapters -> {OUT}")


if __name__ == "__main__":
    main()
