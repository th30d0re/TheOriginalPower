"""Every quote card's text must be verbatim from Chapter 2 of the tex.

    python3 check_quotes.py        # lists quote cards whose text is not found verbatim

A quote card claims someone's exact words. Paraphrase belongs on a source or title card.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TEX = "\n".join((HERE.parents[2] / "Paper/The_Original_Power.tex").read_text().splitlines()[1620:2735])


def norm(s):
    s = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", s)
    s = re.sub(r"\[([a-z])\]", r"\1", s)            # Fields's "[p]eople"
    s = s.replace("``", '"').replace("''", '"').replace("---", " ").replace("--", " ")
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


tex = norm(TEX)
bad = 0
for f in sorted((HERE / "cards").glob("*.json")):
    d = json.loads(f.read_text())
    if d.get("kind") != "quote":
        continue
    q = norm(d.get("quote", "").strip(" .…"))
    if q not in tex:
        bad += 1
        print(f"{f.stem}: not verbatim | {d.get('quote','')[:80]} | {d.get('attribution','')}")
print(f"{bad} quote card(s) not verbatim")
sys.exit(1 if bad else 0)
