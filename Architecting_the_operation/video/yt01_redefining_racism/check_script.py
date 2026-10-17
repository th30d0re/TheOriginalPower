"""Acceptance checks for the YT01 script (BRIEF.md, "Deliverables").

    python3 check_script.py ../../podcasts/YT01_what_racism_really_is.md

Exits non-zero on any error. Warnings are printed for a person to judge.
"""
import argparse
import re
import sys
from pathlib import Path

HEADER = re.compile(r"^(?:Emmanuel Theodore|Lee Atwater) \((\d{1,3}):(\d{2})\)\s*$")
SEG = re.compile(r"^<!-- SEG (\d{2}) ")
CONTRAST = re.compile(
    r"isn't|is not|not a |not the |not just|instead of|rather than|more than just|"
    r"doesn't|don't|n't just|only .{1,40} does|, not ", re.I)
UNSPEAKABLE = re.compile(r"[\\$^_{}≤≥∩∪⊂∅∝→←]|\bEq\.|\bFig\.")
REQUIRED = ([f"Equation 2.{i}" for i in range(1, 20)]
            + [f"Figure 2.{i}" for i in range(1, 10)] + ["Table 2.1", "Definition 2.3"])
MAX_WORDS = 45


def main(path, n_segments=23, required=REQUIRED):
    text = Path(path).read_text()
    body = re.sub(r"<!--\s*NOTES.*?-->", "", text, flags=re.S)
    lines = body.splitlines()
    turns, segs, errors, warns = [], [], [], []
    cur = None
    for n, line in enumerate(lines, 1):
        if m := SEG.match(line):
            segs.append(m.group(1))
            continue
        if m := HEADER.match(line):
            cur = {"line": n, "t": int(m.group(1)) * 60 + int(m.group(2)), "text": "", "seg": segs[-1] if segs else None}
            turns.append(cur)
        elif cur is not None and line.strip() and not line.startswith("<!--"):
            cur["text"] += " " + line.strip()
    expected = [f"{i:02d}" for i in range(n_segments)]
    if segs != expected:
        errors.append(f"segments {segs} != 00..{n_segments - 1:02d} in order")
    for a, b in zip(turns, turns[1:]):
        if b["t"] < a["t"]:
            errors.append(f"line {b['line']}: timestamp goes backwards")
    spoken = " ".join(t["text"] for t in turns)
    for req in required:
        if not re.search(re.escape(req) + r"\b", spoken):
            errors.append(f"missing reference: {req}")
    for t in turns:
        w = len(t["text"].split())
        if w > MAX_WORDS:
            warns.append(f"line {t['line']} (SEG {t['seg']}): {w} words")
        if t["text"].lstrip().startswith("[clip:"):
            continue  # archival recording: verbatim, not synthesized
        if UNSPEAKABLE.search(t["text"]):
            errors.append(f"line {t['line']}: unspeakable symbol: {t['text'][:80]}")
        for m in CONTRAST.finditer(t["text"]):
            warns.append(f"line {t['line']}: contrast? …{t['text'][max(0, m.start()-40):m.end()+40]}…")
    words = len(spoken.split())
    print(f"{len(turns)} turns, {len(segs)} segments, {words} words, ~{words/150:.0f} min at 150 wpm")
    for w in warns:
        print("warn:", w)
    for e in errors:
        print("ERROR:", e)
    return 1 if errors else 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--segments", type=int, default=23)
    ap.add_argument("--require", type=str, default=None)
    args = ap.parse_args()
    req = REQUIRED if args.require is None else [r.strip() for r in args.require.split(",") if r.strip()]
    sys.exit(main(args.path, n_segments=args.segments, required=req))

