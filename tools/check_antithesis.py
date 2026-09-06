"""Detect formulaic antithesis and corrective contrast in prose.

AGENTS.md, "Strict Rhetorical Constraints", bans formulaic antithesis, didactic
contrasts, and boilerplate juxtaposition: constructions that negate a strawman and
then affirm a replacement ("It is not merely X, it is Y", "More than just X...").
The rule is absolute and applies to every piece of prose this project produces —
manuscript, podcast script, post, video narration, README.

This script is the mechanical half of enforcement. It catches the fixed phrasings
reliably and flags the shape of the construction for review. It cannot judge whether
a negation is rhetorical or factual, so it separates what it is sure about from what
a human or a reviewing agent must read.

    python3 tools/check_antithesis.py FILE [FILE...]
    python3 tools/check_antithesis.py --changed        # files changed vs HEAD

Exit 1 if any CERTAIN finding survives. REVIEW findings never fail the run; they are
printed so somebody looks at them.

Silence a genuine false positive with a trailing comment on the line:
    ... prose ...   <!-- antithesis-ok: anaphora, deliberate repetition -->
A reason is required; the marker alone will not suppress.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ALLOW = re.compile(r"<!--\s*antithesis-ok:\s*\S+.*?-->", re.I)

# Fixed phrasings. These are the banned constructions themselves, not a heuristic
# for them, so a hit is a defect unless explicitly allowed.
CERTAIN = [
    (r"\bnot (?:merely|just|only|simply)\b(?![^.]*\?)", "not merely/just/only/simply"),
    (r"\bmore than (?:just|merely|simply)\b", "more than just"),
    (r"\bisn't\s+\w[^.,;]{0,60},\s*it'?s\b", "isn't X, it's Y"),
    (r"\bis not\s+\w[^.,;]{0,60},\s*(?:it is|it's|but)\b", "is not X, it is Y"),
    (r"\b(?:less|not so much) about\b[^.]{0,60}\bmore about\b", "less about X, more about Y"),
    (r"\bnot\b[^.]{0,60}\bbut rather\b", "not X but rather Y"),
]

# The shape of a corrective contrast: a negated predicate, a full stop, then a
# pronoun or article subject re-asserting. Often legitimate (plain factual
# negation, anaphora), so this is review-only.
REVIEW = [
    (r"\b(?:is|are|was|were|do|does|did|has|have|can|will)\s+not\b[^.]*\.\s+"
     r"(?:It|They|That|This|He|She|You|We|There|The)\b", "negate-then-affirm"),
    (r"\brather than\b", "rather than"),
    (r"\.\s+(?:Not|No)\s+[a-z]", "fragment negation"),
    (r"\bnever\b[^.]*\.\s+(?:It|They|That|This)\b", "never-then-affirm"),
]

CERTAIN = [(re.compile(p, re.I), n) for p, n in CERTAIN]
REVIEW = [(re.compile(p, re.I), n) for p, n in REVIEW]


def scan(path: Path) -> tuple[list, list]:
    certain, review = [], []
    for lineno, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip() or ALLOW.search(raw):
            continue
        line = ALLOW.sub("", raw)
        for rx, name in CERTAIN:
            for m in rx.finditer(line):
                certain.append((lineno, name, excerpt(line, m)))
        for rx, name in REVIEW:
            for m in rx.finditer(line):
                review.append((lineno, name, excerpt(line, m)))
    return certain, review


def excerpt(line: str, m: re.Match) -> str:
    return line[max(0, m.start() - 40):m.end() + 50].strip()


def changed_files() -> list[Path]:
    out = subprocess.run(
        ["git", "diff", "--name-only", "HEAD", "--", "*.tex", "*.md", "*.txt"],
        capture_output=True, text=True,
    ).stdout.split()
    return [Path(f) for f in out if Path(f).exists()]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*", type=Path)
    ap.add_argument("--changed", action="store_true", help="scan files changed vs HEAD")
    ap.add_argument("--quiet-review", action="store_true", help="print CERTAIN only")
    args = ap.parse_args()

    files = changed_files() if args.changed else args.files
    if not files:
        print("check-antithesis: no files to scan")
        return 0

    total_certain = 0
    for path in files:
        certain, review = scan(path)
        total_certain += len(certain)
        if certain:
            print(f"\n{path}: {len(certain)} CERTAIN")
            for lineno, name, frag in certain:
                print(f"  {path}:{lineno}  [{name}]\n      ...{frag}...")
        if review and not args.quiet_review:
            print(f"\n{path}: {len(review)} for review")
            for lineno, name, frag in review:
                print(f"  {path}:{lineno}  [{name}]\n      ...{frag}...")

    if total_certain:
        print(f"\ncheck-antithesis: FAIL — {total_certain} banned construction(s).")
        print("See AGENTS.md, 'Strict Rhetorical Constraints'. Rewrite as a direct")
        print("affirmative statement. To allow a genuine exception, append")
        print("<!-- antithesis-ok: reason --> to the line.")
        return 1

    print("check-antithesis: no banned constructions found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
