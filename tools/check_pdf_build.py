"""Check that a manuscript build actually succeeded.

latexmk exits zero on builds that are wrong in ways that matter: a missing
figure falls back to a placeholder, a broken `\\ref` renders as `??`, and a build
that never re-ran leaves yesterday's PDF in place looking fine. The exit code
sees none of that.

    python3 tools/check_pdf_build.py
    python3 tools/check_pdf_build.py --expect "the coupling among the three layers"

Pass `--expect` with a phrase you just added to the `.tex`. It is the only check
that proves the PDF in front of you was built from the sources in front of you.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

PDF = Path("Paper/The_Original_Power.pdf")
LOG = Path("Paper/The_Original_Power.log")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--expect", action="append", default=[],
                    help="Phrase that must appear in the rendered PDF. Repeatable.")
    ap.add_argument("--min-pages", type=int, default=1000)
    ap.add_argument("--allow-placeholders", type=int, default=1,
                    help="Known pending figures. The baseline is 1: the GDELT "
                         "per-axis PSD figure waits on a BigQuery run. Anything "
                         "above the baseline is a figure that fell back silently.")
    args = ap.parse_args()

    problems: list[str] = []
    if not PDF.exists():
        print(f"FAIL  {PDF} does not exist. latexmk deletes it when it dies; "
              f"see 'Rebuilding the PDF' in AGENTS.md.")
        return 1

    text = subprocess.run(["pdftotext", str(PDF), "-"],
                          capture_output=True, text=True).stdout
    # TeX turns straight quotes into typographic ones, so a --expect phrase
    # typed from the .tex source never matches the rendered text. Fold them.
    _QUOTE_FOLD = str.maketrans({"\u2019": "'", "\u2018": "'",
                                 "\u201c": '"', "\u201d": '"',
                                 "\u2014": "-", "\u2013": "-"})
    pages = text.count("\f")
    literal_qq = text.count("??")
    flat = re.sub(r"\s+", " ", text).translate(_QUOTE_FOLD)

    log = LOG.read_text(errors="replace") if LOG.exists() else ""
    counts = {
        "errors": len(re.findall(r"^! ", log, re.M)),
        "undefined refs": len(re.findall(r"LaTeX Warning: Reference .* undefined", log)),
        "undefined citations": len(re.findall(r"Citation .* undefined", log)),
    }
    # Twelve spectral figures are \IfFileExists-guarded and fall back silently.
    placeholder_hits = [
        flat[max(0, m.start() - 90) : m.start() + 60]
        for m in re.finditer(r"figure pending", flat, re.I)
    ]
    placeholders = len(placeholder_hits)

    print(f"pages                {pages}")
    for name, n in counts.items():
        print(f"{name:<20} {n}")
    print(f"literal ?? in pdf    {literal_qq}")
    print(f"figure placeholders  {placeholders} (baseline {args.allow_placeholders})")

    if pages < args.min_pages:
        problems.append(f"only {pages} pages; expected at least {args.min_pages}")
    for name, n in counts.items():
        if n:
            problems.append(f"{n} {name}")
    if literal_qq:
        problems.append(f"{literal_qq} literal ?? (an unresolved cross-reference)")
    if placeholders > args.allow_placeholders:
        problems.append(
            f"{placeholders} figure placeholders against a baseline of "
            f"{args.allow_placeholders}. The spectral figures are gitignored build "
            f"products of `make empirical`, and `make clean` removes them, so a new "
            f"placeholder usually means a figure fell back silently."
        )
        for hit in placeholder_hits:
            print(f"  placeholder: ...{hit.strip()}...")
    for phrase in args.expect:
        found = phrase.translate(_QUOTE_FOLD).lower() in flat.lower()
        print(f"expect               {'OK  ' if found else 'MISS'} {phrase[:60]}")
        if not found:
            problems.append(f"expected phrase absent, so the PDF predates your edit: {phrase[:60]}")

    if problems:
        print("\ncheck-pdf-build: FAIL")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("\ncheck-pdf-build: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
