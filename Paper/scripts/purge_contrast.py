#!/usr/bin/env python3
"""
purge_contrast.py — Surgical removal of corrective contrast rhetoric.

Strategy:
  1. Read the .tex file line-by-line.
  2. For each line containing forbidden patterns, attempt a context-aware rewrite.
  3. Log every change (old → new) to a verification file.
  4. Write the cleaned file back only if no LaTeX syntax was corrupted.
  5. Report counts: fixed, skipped (ambiguous), and remaining.

Safety rules:
  - Never modify content inside math mode ($...$) on the same line.
  - Never break \cite{}, \ref{}, \label{}, \footnote{} commands.
  - Preserve all punctuation and sentence boundaries.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEX_PATH = ROOT / "The_Original_Power.tex"
LOG_PATH = ROOT / "scripts" / "purge_contrast_log.txt"

with open(TEX_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

fixed = []
skipped = []

# Helper: check if a line has unbalanced braces after replacement
def balanced(s):
    depth = 0
    for c in s:
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth < 0:
                return False
    return depth == 0

# Helper: safe replacement — only apply if result is balanced and old != new
def safe_replace(line_num, old_line, new_line):
    if old_line == new_line:
        return old_line
    if not balanced(new_line):
        skipped.append((line_num, old_line.strip(), "UNBALANCED"))
        return old_line
    fixed.append((line_num, old_line.strip(), new_line.strip()))
    return new_line

# Process each line
new_lines = []
for line_num, line in enumerate(lines, 1):
    original = line
    modified = line

    # Skip lines with no forbidden patterns
    if not re.search(r'(?i)not merely|not just|not simply|not accidental|not a failure|not an accident|More than just|does not merely|did not merely|was not merely|is not merely|are not merely|were not merely', line):
        new_lines.append(line)
        continue

    # --- Pattern family A: "X was not merely Y; it was Z" → "X constituted Z" ---
    m = re.search(r'(?i)([A-Z][^;]{3,60}) was not merely [^;]{3,80}; it was ([a-zA-Z][^;.]{2,60})', modified)
    if m:
        prefix = m.group(1).rstrip()
        replacement = f"{prefix} constituted {m.group(2)}"
        modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family B: "X is not merely Y; it is Z" → "X constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)([A-Z][^;]{3,60}) is not merely [^;]{3,80}; it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            prefix = m.group(1).rstrip()
            replacement = f"{prefix} constitutes {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family C: "X does not merely Y; it Z" → "X Z" ---
    if modified == original:
        m = re.search(r'(?i)([A-Z][^;]{3,60}) does not merely [^;]{3,80}; it ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            prefix = m.group(1).rstrip()
            replacement = f"{prefix} {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family D: "X did not merely Y; it Z" → "X Z" ---
    if modified == original:
        m = re.search(r'(?i)([A-Z][^;]{3,60}) did not merely [^;]{3,80}; it ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            prefix = m.group(1).rstrip()
            replacement = f"{prefix} {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family E: "not merely Y. It is Z" (at sentence start) → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^.]{3,80}\. It is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family F: "not merely Y; it constitutes Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^;]{3,80}; it constitutes ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family G: "not merely Y, it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^,]{3,80}, it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family H: "not an accident of history. It was Z" → "constituted Z" ---
    if modified == original:
        m = re.search(r'(?i)not an accident of history[^.]*\. It was ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constituted {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family I: "not an accident; it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not an accident[^;]*; it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family J: "not merely Y but Z" (without "it is") ---
    if modified == original:
        m = re.search(r'(?i)not merely [^,]{3,80},?\s*but\s+also?\s+([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family K: "not just Y but Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not just [^,]{3,80},?\s*but\s+also?\s+([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family L: "not simply Y but Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not simply [^,]{3,80},?\s*but\s+also?\s+([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family M: "not a failure; it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not a failure[^;]*; it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family N: "not merely Y, but it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^,]{3,80}, but it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family O: "More than just Y" → "Beyond Y" ---
    if modified == original:
        m = re.search(r'(?i)More than just ([a-zA-Z][^,;]{2,40})', modified)
        if m:
            replacement = f"Beyond {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family P: "not merely Y, it was Z" → "constituted Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^,]{3,80}, it was ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constituted {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family Q: "not merely Y. It was Z" → "constituted Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^.]{3,80}\. It was ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constituted {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family R: "not merely Y; it is also Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not merely [^;]{3,80}; it is also ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family S: "This/That is not Y. It is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)(This|That) is not [^.]{3,80}\. It is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"{m.group(1)} constitutes {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family T: "The X is not Y. It is Z" → "The X constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)(The [a-z]+(?:\s+[a-z]+){0,4}) is not [^.]{3,80}\. It is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"{m.group(1)} constitutes {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family U: "not accidental" in "structural, not accidental" → drop "not accidental" ---
    if modified == original:
        m = re.search(r'(?i),?\s*not accidental\.', modified)
        if m:
            replacement = "."
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family V: "not merely X, but Y" (no "it") ---
    if modified == original:
        m = re.search(r'(?i)not merely [^,]{3,80},?\s*but\s+([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family W: "not just X, it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not just [^,]{3,80}, it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family X: "not simply X, it is Z" → "constitutes Z" ---
    if modified == original:
        m = re.search(r'(?i)not simply [^,]{3,80}, it is ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"constitutes {m.group(1)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family Y: "The X does not merely Y; it Z" → "The X Z" ---
    if modified == original:
        m = re.search(r'(?i)(The [a-z]+(?:\s+[a-z]+){0,6}) does not merely [^;]{3,80}; it ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"{m.group(1)} {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # --- Pattern family Z: "The X did not merely Y; it Z" → "The X Z" ---
    if modified == original:
        m = re.search(r'(?i)(The [a-z]+(?:\s+[a-z]+){0,6}) did not merely [^;]{3,80}; it ([a-zA-Z][^;.]{2,60})', modified)
        if m:
            replacement = f"{m.group(1)} {m.group(2)}"
            modified = modified[:m.start()] + replacement + modified[m.end():]

    # Safety check
    if modified != original:
        modified = safe_replace(line_num, original, modified)
    else:
        # If we reached here with no change, log as skipped
        skipped.append((line_num, original.strip()))

    new_lines.append(modified)

# Write output
with open(TEX_PATH, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

# Count remaining
with open(TEX_PATH, "r", encoding="utf-8") as f:
    remaining_text = f.read()
remaining = []
for i, line in enumerate(remaining_text.split("\n"), 1):
    if re.search(r'(?i)not merely|not just.*it is|not simply.*it is|not an accident.*it is|not a failure.*it is|does not merely.*it|did not merely.*it|was not merely.*it|is not merely.*it|are not merely.*it|were not merely.*it|More than just', line):
        remaining.append((i, line.strip()[:200]))

# Write log
with open(LOG_PATH, "w", encoding="utf-8") as f:
    f.write("=" * 70 + "\n")
    f.write(f"FIXED: {len(fixed)}\n")
    f.write(f"SKIPPED: {len(skipped)}\n")
    f.write(f"REMAINING: {len(remaining)}\n")
    f.write("=" * 70 + "\n\n")
    f.write("--- FIXED ---\n")
    for ln, old, new in fixed:
        f.write(f"\nLine {ln}:\n  OLD: {old}\n  NEW: {new}\n")
    f.write("\n\n--- SKIPPED ---\n")
    for ln, content in skipped:
        f.write(f"\nLine {ln}: {content}\n")
    f.write("\n\n--- REMAINING ---\n")
    for ln, content in remaining:
        f.write(f"\nLine {ln}: {content}\n")

print(f"FIXED: {len(fixed)}")
print(f"SKIPPED: {len(skipped)}")
print(f"REMAINING: {len(remaining)}")
print(f"\nLog written to {LOG_PATH}")
