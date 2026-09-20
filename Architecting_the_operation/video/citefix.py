"""Find shot-list citations that no longer point at what they claim, and
repair the ones that can be repaired on evidence.

The lists cite the manuscript by line. The manuscript has been edited since
they were written, so the numbers have drifted, and `shotspec.py` cannot see
it: the line exists, so the citation passes. Checking that a file is that long
is not the same as checking that the line says what the shot says it says.

Two passes, and only the second one writes:

**Detect.** Every cited line is scored against its shot's distinctive words,
weighted by how rare each word is in the manuscript, so "McKelvey" counts and
"system" barely does. A line that shares nothing with its shot is reported.

**Repair, on evidence only.** A citation is rewritten when a phrase of four or
more words from the shot appears verbatim in the manuscript. That located line
is not a guess. Everything else is listed for a person, because a plausible
line is not a citation and an approximately correct citation is worse than an
obviously missing one in a book that argues about reading the record.

    python citefix.py specs/*.json              # report
    python citefix.py specs/*.json --apply      # rewrite the evidenced ones
"""
from __future__ import annotations

import argparse
import json
import math
import re
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BOOK_PATH = "Paper/The_Original_Power.tex"
BOOK = REPO / BOOK_PATH
MIN_PHRASE_WORDS = 4
MIN_PHRASE_CHARS = 22
# A phrase carrying only words that appear all over the book is not evidence.
MAX_LINE_FREQUENCY = 40

_WORD = re.compile(r"[A-Za-z][A-Za-z'\-]{3,}")
_STOP = set("""this that with from they them their there then than have has had
into over under about which what when where while because been being were was
your yours some most more much many each other another every both will would
could should shall might must does done doing said says say the and for but
not are you our its one two three four five line lines page card cards type
note content beat hold anchor caption label shot graphic build animate
animation screen frame panel state left right episode series viewer narration
script""".split())


def _terms(text: str) -> set[str]:
    return {w.lower() for w in _WORD.findall(text)} - _STOP


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", text.lower())).strip()


class Manuscript:
    def __init__(self, path: Path = BOOK):
        self.lines = path.read_text(errors="replace").splitlines()
        self.flat = [_normalize(line) for line in self.lines]
        counts: Counter[str] = Counter()
        for line in self.lines:
            counts.update(_terms(line))
        total = max(1, len(self.lines))
        self.idf = {w: math.log(total / (1 + c)) for w, c in counts.items()}
        self.frequency = counts

    def score(self, terms: set[str], line_number: int) -> float:
        if not terms or not 1 <= line_number <= len(self.lines):
            return 0.0
        present = _terms(self.lines[line_number - 1])
        total = sum(self.idf.get(w, 6.0) for w in terms)
        hit = sum(self.idf.get(w, 6.0) for w in terms & present)
        return hit / total if total else 0.0

    def _distinctive(self, phrase: str) -> bool:
        """A phrase is only evidence if it could not have landed anywhere.

        "at the intersection of" is four words and matches a passage about
        something else entirely. Require real content words, and at least one
        that is rare in the manuscript.
        """
        content = _terms(phrase)
        if len(content) < 3:
            return False
        return min(self.frequency.get(w, 0) for w in content) <= MAX_LINE_FREQUENCY

    def locate(self, text: str) -> tuple[int, str] | None:
        """The first line carrying a long enough verbatim phrase from `text`."""
        words = _normalize(text).split()
        for size in (7, 6, 5, MIN_PHRASE_WORDS):
            for start in range(len(words) - size + 1):
                phrase = " ".join(words[start:start + size])
                if len(phrase) < MIN_PHRASE_CHARS or not self._distinctive(phrase):
                    continue
                for number, line in enumerate(self.flat, start=1):
                    if phrase in line:
                        return number, phrase
        return None


def _shot_text(shot: dict) -> str:
    return " ".join([shot["title"], shot.get("type", ""),
                     *shot.get("described", {}).values()])


def review(spec_path: Path, book: Manuscript, stale_below: float) -> list[dict]:
    document = json.loads(spec_path.read_text())
    findings: list[dict] = []
    for shot in document["shots"]:
        text = _shot_text(shot)
        terms = _terms(text)
        stale = [c for c in shot["provenance"]["citations"]
                 if "line" in c and c["path"] == BOOK_PATH
                 and book.score(terms, c["line"]) < stale_below]
        if not stale:
            continue
        located = book.locate(text)
        for cite in stale:
            findings.append({
                "shot": shot["id"], "title": shot["title"], "cited": cite["line"],
                "cited_text": book.lines[cite["line"] - 1].strip()[:70],
                "line": located[0] if located else None,
                "phrase": located[1] if located else None,
            })
    return findings


def apply(shotlist: Path, findings: list[dict]) -> int:
    text = shotlist.read_text()
    changed = 0
    for finding in findings:
        if finding["line"] is None:
            continue
        old, new = finding["cited"], finding["line"]
        if old == new:
            continue
        for before, after in ((f"`:{old}`", f"`:{new}`"),
                              (f"The_Original_Power.tex:{old}`", f"The_Original_Power.tex:{new}`")):
            if before in text:
                text = text.replace(before, after, 1)
                changed += 1
                break
    if changed:
        shotlist.write_text(text)
    return changed


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("specs", nargs="+", type=Path)
    ap.add_argument("--stale-below", type=float, default=0.12)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    book = Manuscript()

    grand_total = grand_fixed = 0
    for spec in args.specs:
        findings = review(spec, book, args.stale_below)
        evidenced = [f for f in findings if f["line"] is not None]
        print(f"\n{spec.name}: {len(findings)} stale citation(s), "
              f"{len(evidenced)} locatable by a verbatim phrase")
        if not args.quiet:
            for f in findings:
                if f["line"]:
                    print(f"  fix {f['shot']:7s} :{f['cited']} -> :{f['line']}   "
                          f"matched {f['phrase']!r}")
                else:
                    print(f"  ??  {f['shot']:7s} :{f['cited']} no verbatim anchor; "
                          f"cited line reads {f['cited_text'][:44]!r}")
        grand_total += len(findings)
        grand_fixed += len(evidenced)
        if args.apply:
            shotlist = spec.parent.parent / spec.name.replace(".json", "_shotlist.md")
            if shotlist.exists():
                print(f"  wrote {apply(shotlist, findings)} change(s) to {shotlist.name}")
    print(f"\n{grand_fixed} of {grand_total} stale citations carry evidence; "
          f"{grand_total - grand_fixed} need a person.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
