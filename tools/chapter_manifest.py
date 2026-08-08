#!/usr/bin/env python3
"""Emit a page-range manifest for The_Original_Power.pdf, one entry per unit.

A "unit" is a front-matter section, a chapter, or an appendix — every top-level
division a reader would recognize. Part dividers are folded into the chapter
that follows them, since a divider page carries no content of its own.

The ranges come from the PDF outline rather than the TeX, so they stay true to
whatever was actually built. Re-run after any rebuild that shifts pagination.

    python3 tools/chapter_manifest.py > Paper/research/chapter_deep_dives/manifest.json
"""
from __future__ import annotations

import json
import re
import subprocess
import sys

import pypdf

PDF = "Paper/The_Original_Power.pdf"
COVER_FRONT = 1          # bound cover page, not a unit
PART_RE = re.compile(r"^(I{1,3}|IV|V)\s")


def bibliography_start(last: int) -> int | None:
    """First page of the bibliography, which carries no outline entry.

    biblatex opens it with a `Bibliography` heading and running-heads every page
    after, so the first page whose text begins with that word starts the run.
    Without this the final appendix absorbs ~50 pages of references.
    """
    for p in range(last, max(last - 120, 1), -1):
        t = subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), PDF, "-"],
                           capture_output=True, text=True).stdout.lstrip()
        if not t.upper().startswith("BIBLIOGRAPHY"):
            return p + 1
    return None


def slug(s: str) -> str:
    s = re.sub(r"[^\w\s-]", "", s.lower())
    return re.sub(r"[\s_-]+", "-", s).strip("-")[:60]


def main() -> None:
    r = pypdf.PdfReader(PDF)
    last = len(r.pages)

    rows = []

    def walk(items, depth=0):
        for it in items:
            if isinstance(it, list):
                walk(it, depth + 1)
            elif depth <= 1:
                try:
                    rows.append((r.get_destination_page_number(it) + 1, it.title.strip()))
                except Exception:  # unresolvable destination
                    pass

    walk(r.outline)
    rows.sort()

    # Drop part dividers: they contribute a title page only.
    units = [(p, t) for p, t in rows if not PART_RE.match(t)]

    out = []
    # Everything between the cover and the first outline entry is front matter.
    if units and units[0][0] > COVER_FRONT + 1:
        out.append({"n": 0, "title": "Front Matter", "slug": "front-matter",
                    "start": COVER_FRONT + 1, "end": units[0][0] - 1})

    bib = bibliography_start(last - 1)   # last - 1: skip the bound back cover
    tail = (bib - 1) if bib else (last - 1)

    for i, (p, t) in enumerate(units):
        end = units[i + 1][0] - 1 if i + 1 < len(units) else tail
        out.append({"n": i + 1, "title": t, "slug": slug(t), "start": p, "end": end})

    # The bibliography is a reference list. Carry it so the ranges stay
    # contiguous and auditable, and mark it as no deep dive.
    if bib:
        out.append({"n": len(out), "title": "Bibliography", "slug": "bibliography",
                    "start": bib, "end": last - 1, "skip": True})

    for u in out:
        u["pages"] = u["end"] - u["start"] + 1
        u.setdefault("skip", False)

    bad = [u for u in out if u["pages"] < 1]
    if bad:
        sys.exit(f"non-positive page range: {bad}")

    json.dump({"pdf": PDF, "total_pages": last, "units": out}, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
