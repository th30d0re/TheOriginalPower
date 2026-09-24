"""Check anchor proposals before any of them reaches a shot list.

The judgment of which passage supports which graphic is delegated. The
checking is not. Every rule the brief states is enforced here against the
manuscript itself, so a proposal that drifted from the instructions fails
loudly instead of quietly becoming a citation.

    python verify_anchors.py work/batches work/results
    python verify_anchors.py work/batches work/results --apply
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BOOK = REPO / "Paper" / "The_Original_Power.tex"
MARKUP = re.compile(r'[\\{}$"]')
MIN_WORDS, MAX_WORDS = 5, 15


def check(proposal: dict, task: dict, lines: list[str]) -> list[str]:
    faults: list[str] = []
    quote, line = proposal.get("quote"), proposal.get("line")

    if quote is None or line is None:
        if not (proposal.get("why") or "").strip():
            faults.append("declined without saying what is missing")
        return faults

    allowed = {c["line"] for c in task["candidates"]}
    if line not in allowed:
        faults.append(f"line {line} was not among the candidates offered")
    if not 1 <= line <= len(lines):
        return faults + [f"line {line} is outside the manuscript"]

    words = len(quote.split())
    if not MIN_WORDS <= words <= MAX_WORDS:
        faults.append(f"quote is {words} words, outside {MIN_WORDS}-{MAX_WORDS}")
    if MARKUP.search(quote):
        faults.append("quote carries LaTeX markup or a double quote")
    if quote not in lines[line - 1]:
        # The most important check: the words have to actually be there.
        faults.append("quote does not appear verbatim on the line it names")
    if not (proposal.get("why") or "").strip():
        faults.append("no rationale given")
    return faults


def load(path: Path) -> dict[str, dict]:
    rows = {}
    for raw in path.read_text().splitlines():
        raw = raw.strip()
        if not raw:
            continue
        try:
            row = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if "shot" in row:
            rows[row["shot"]] = row
    return rows


def apply_anchor(shotlist: Path, shot_id: str, cited: list[int], quote: str) -> bool:
    from citefix import _replace_in_shot
    text = shotlist.read_text()
    for line in cited:
        for before in (f"`:{line}`", f"`Paper/The_Original_Power.tex:{line}`"):
            updated, done = _replace_in_shot(text, shot_id, before, f'`"{quote}"`')
            if done:
                shotlist.write_text(updated)
                return True
    return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("batches", type=Path)
    ap.add_argument("results", type=Path)
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    lines = BOOK.read_text(errors="replace").splitlines()

    passed = declined = failed = missing = applied = 0
    for batch in sorted(args.batches.glob("batch_*.jsonl")):
        result = args.results / batch.name
        tasks = {json.loads(l)["shot"]: json.loads(l) for l in batch.read_text().splitlines() if l.strip()}
        if not result.exists():
            missing += len(tasks)
            print(f"{batch.name}: no result file")
            continue
        proposals = load(result)
        for shot_id, task in tasks.items():
            proposal = proposals.get(shot_id)
            if proposal is None:
                missing += 1
                print(f"  MISSING {shot_id}")
                continue
            faults = check(proposal, task, lines)
            if faults:
                failed += 1
                print(f"  REJECT  {shot_id}: {'; '.join(faults)}")
            elif proposal.get("quote") is None:
                declined += 1
            else:
                passed += 1
                if args.apply:
                    shotlist = args.batches.parent.parent / task["spec"].replace(".json", "_shotlist.md")
                    if apply_anchor(shotlist, shot_id, task["currently_cited"], proposal["quote"]):
                        applied += 1

    print(f"\n{passed} verified, {declined} declined as unsupported, "
          f"{failed} rejected, {missing} missing")
    if args.apply:
        print(f"{applied} anchor(s) written into the shot lists")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
