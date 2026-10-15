"""Report [book] provenance quotes in shot lists that do not appear in Chapter 2 of the tex.

    python3 check_provenance.py ../YT01_shotlist.md shards/SEG_*.md
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TEX = "\n".join((ROOT / "Paper/The_Original_Power.tex").read_text().splitlines()[1620:2735])


def norm(s):
    s = re.sub(r"\\(textbf|textit|emph|texttt)\{([^}]*)\}", r"\2", s)
    s = re.sub(r"\$[^$]*\$", " ", s)
    s = s.replace("---", " ").replace("--", " ").replace("``", '"').replace("''", '"')
    s = re.sub(r"[^a-z0-9 ]", " ", s.lower())
    return re.sub(r"\s+", " ", s).strip()


tex = norm(TEX)
bad = total = 0
for f in sys.argv[1:]:
    for m in re.finditer(r"\[book\]\s*[“\"]([^”\"]+)[”\"]", Path(f).read_text()):
        total += 1
        q = norm(m.group(1))
        if len(q.split()) < 4 or q not in tex:
            bad += 1
            print(f"{Path(f).name}: {m.group(1)[:90]}")
print(f"{bad} of {total} [book] quotes not found verbatim in Chapter 2")
sys.exit(1 if bad else 0)
