"""Convert paired em-dash asides to parentheses in the manuscript.

Emmanuel writes parentheticals with parentheses. Language models reach for the
em dash, and a page dense with them reads as machine-written whatever the
provenance. This finds the ones that are genuinely paired --- an aside opened
and closed by `---` inside a single sentence --- and rewrites those as
parentheses. A lone `---` marking a break stays put; that one is a real
punctuation choice rather than a bracketed aside.

    python3 tools/dash_to_parens.py                # report only
    python3 tools/dash_to_parens.py --apply
    python3 tools/dash_to_parens.py --show 40      # more samples

What it deliberately skips, because a wrong rewrite here is silent:

- LaTeX comment text, including the trailing comment on a code line.
- Anything inside math, `$...$` / `\\[...\\]` / equation environments.
- Verbatim and listing environments.
- En dashes (`--`), which carry numeric ranges like 1440s--1915.
- Any candidate whose inner text contains a sentence end, since that is two
  separate breaks rather than one aside.
- Any candidate whose inner text already contains parentheses, since converting
  would nest them.

It does NOT judge grammar. An aside that interrupts before a main clause often
wants a comma after the closing paren where the dash needed nothing. Read the
report; those are the ones to fix by hand.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TEX = Path("Paper/The_Original_Power.tex")

# An aside: --- text --- with no dash or newline inside, closed on the same line.
# Inner text may contain hyphens ("post-Bruen", "cross-class"); it may not
# contain another em dash. Excluding every hyphen missed a large share of
# genuine pairs on the first pass.
_ASIDE = re.compile(r"---(?!-)\s*((?:(?!---)[^\n]){1,220}?)\s*---(?!-)")
_MATH_ENV = re.compile(
    r"\\begin\{(equation\*?|align\*?|gather\*?|multline\*?|split|array|verbatim|lstlisting|Verbatim)\}"
)
_MATH_END = re.compile(
    r"\\end\{(equation\*?|align\*?|gather\*?|multline\*?|split|array|verbatim|lstlisting|Verbatim)\}"
)


def _strip_comment(line: str) -> str:
    """The code portion of a line, with the trailing LaTeX comment removed."""
    out = []
    i = 0
    while i < len(line):
        c = line[i]
        if c == "\\" and i + 1 < len(line):
            out.append(line[i : i + 2])
            i += 2
            continue
        if c == "%":
            break
        out.append(c)
        i += 1
    return "".join(out)


def _has_math(text: str) -> bool:
    return "$" in text or "\\(" in text or "\\[" in text


def find(lines: list[str]) -> list[tuple[int, str, str, int]]:
    """(line number, original line, rewritten line, asides converted)."""
    hits = []
    in_math = False
    for index, line in enumerate(lines, start=1):
        if _MATH_ENV.search(line):
            in_math = True
        if _MATH_END.search(line):
            in_math = False
            continue
        if in_math:
            continue
        code = _strip_comment(line)
        if not code.strip() or "---" not in code:
            continue

        replaced = []

        def swap(match: re.Match[str]) -> str:
            inner = match.group(1)
            # A sentence end inside means these are two breaks, not one aside.
            if re.search(r"[.!?]\s", inner) or _has_math(inner):
                return match.group(0)
            # An aside that already contains parentheses would nest them, which
            # reads worse than the dashes did. Leave those alone.
            if "(" in inner or ")" in inner:
                return match.group(0)
            replaced.append(inner)
            # Spacing is decided from this match's own neighbours. An earlier
            # version cleaned up spacing with a line-wide regex, which inserted
            # a space before every "(" on the line and turned math like
            # $C_{\text{coercive}}(S,t)$ into $C_{\text{coercive}} (S,t)$.
            before = match.string[: match.start()]
            after = match.string[match.end() :]
            lead = "" if (not before or before[-1].isspace()) else " "
            trail = " " if (after[:1].isalnum() or after[:1] == "\\") else ""
            return f"{lead}({inner}){trail}"

        new_code = _ASIDE.sub(swap, code)
        if not replaced:
            continue
        new_line = new_code + line[len(code) :]
        hits.append((index, line, new_line, len(replaced)))
    return hits


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", type=Path, default=TEX)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--show", type=int, default=15)
    args = ap.parse_args()

    lines = args.file.read_text().splitlines(keepends=True)
    hits = find([l.rstrip("\n") for l in lines])
    converted = sum(n for *_, n in hits)

    print(f"{len(hits)} line(s) with a convertible aside, {converted} aside(s) total\n")
    for number, old, new, _ in hits[: args.show]:
        for m in _ASIDE.finditer(_strip_comment(old)):
            print(f"  {number}: ---{m.group(1)[:80]}---")
        print(f"      -> {new.strip()[:150]}\n")
    if len(hits) > args.show:
        print(f"  ... and {len(hits) - args.show} more lines\n")

    if not args.apply:
        print("report only; pass --apply to write")
        return 0

    out = list(lines)
    for number, _, new, _n in hits:
        out[number - 1] = new + "\n"
    args.file.write_text("".join(out))
    print(f"rewrote {converted} aside(s) across {len(hits)} line(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
