#!/usr/bin/env python3
"""
Strip hardcoded equation numbers from figure titles in Jupyter notebooks.
Uses nbformat to preserve schema validity.
"""
import re
import sys
from pathlib import Path

try:
    import nbformat
except ImportError:
    print("nbformat not available; install it with: pip install nbformat")
    sys.exit(1)

NOTEBOOK_DIR = Path(__file__).parent

# Match "Eq. 5: ", "Eq. 8–10: ", "Eq. 20 & 24: ", "Eq. 73–74: ",
# "Eq. 31 — ", "Eq. 12.7–12.9: ", "(a) Eq. 9.5: ", etc.
EQ_PREFIX_RE = re.compile(
    r"((?:\([a-z]\)\s+)?Eq\.\s*[0-9]+(?:\.[0-9]+)?(?:\s*[&–\-]\s*[0-9]+(?:\.[0-9]+)?)*\s*[:\-—]\s*)",
    re.IGNORECASE,
)

# Calls that generate visible text in output figures
TITLE_CALLS = (
    "plt.title", "fig.suptitle", "ax.set_title", "ax1.set_title",
    "ax2.set_title", "ax3.set_title", "ax4.set_title", "ax5.set_title",
)


def contains_title_call(text: str) -> bool:
    for line in text.splitlines():
        stripped = line.lstrip()
        if any(stripped.startswith(call) for call in TITLE_CALLS):
            return True
    return False


def fix_source(source: str) -> tuple[str, int]:
    lines = source.splitlines(keepends=True)
    new_lines = []
    changes = 0
    in_title_call = False
    for line in lines:
        original = line
        if not in_title_call:
            stripped = line.lstrip()
            if any(stripped.startswith(call) for call in TITLE_CALLS):
                in_title_call = True

        if in_title_call:
            new_line = EQ_PREFIX_RE.sub("", line)
            if new_line != original:
                changes += 1
                line = new_line
            # Heuristic: if line ends the call, exit
            if line.rstrip().endswith(")"):
                in_title_call = False

        new_lines.append(line)
    return "".join(new_lines), changes


def fix_notebook(path: Path) -> int:
    nb = nbformat.read(str(path), as_version=nbformat.NO_CONVERT)

    total_changes = 0
    for cell in nb.cells:
        if cell.cell_type != "code":
            continue
        new_source, changes = fix_source(cell.source)
        if changes:
            cell.source = new_source
            total_changes += changes

    if total_changes:
        nbformat.write(nb, str(path))
        print(f"  {path.name}: {total_changes} title(s) fixed")
    else:
        print(f"  {path.name}: no changes")
    return total_changes


def main():
    notebooks = sorted(NOTEBOOK_DIR.glob("eq*.ipynb"))
    total = 0
    for nb_path in notebooks:
        total += fix_notebook(nb_path)
    print(f"\nTotal changes: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
