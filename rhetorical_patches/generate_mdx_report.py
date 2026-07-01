#!/usr/bin/env python3
"""Generate an MDX report of the rhetorical edit pass.

The report contains per-chunk ratings, audit issues, and before/after excerpts
from the git diff.
"""

import subprocess
from pathlib import Path
import difflib

ROOT = Path("/Users/emmanuel/Documents/Theory/Redefining_racism")
PATCH_DIR = ROOT / "rhetorical_patches"
ORIG_FILE = ROOT / "Paper" / "The_Original_Power.tex"

CHUNKS = [
    (1, 313, "Front matter", "Author's Preface, Preface, Empirical Methodology start"),
    (320, 1214, "Chapter 0", "System Initialization"),
    (1215, 2429, "Chapters 1–2", "Dynamical Systems + Redefining Racism"),
    (2430, 3545, "Chapters 3–5", "Version 1.0 + Bacon's Rebellion + Constitutional Kernel"),
    (3546, 4053, "Chapters 6–7", "Haitian Export + Architecture of Kinship"),
    (4054, 4473, "Chapter 8a", "Gendered Axis (first half)"),
    (4474, 4894, "Chapter 8b", "Gendered Axis (second half)"),
    (4895, 6143, "Chapters 9–10", "Enforcement Engine + Containment"),
    (6144, 7842, "Chapter 11", "Tweedism"),
    (7843, 9385, "Chapter 12", "Recompile"),
    (9386, 10536, "Chapter 13", "Full Algorithm"),
    (10537, 11589, "Chapter 14", "Kinetic Guarantee"),
    (11590, 12887, "Chapter 15", "Contradiction"),
    (12888, 14357, "Chapters 16–17", "Global Containment + Algorithmic Epoch"),
    (14358, 14903, "Chapters 18–21", "Spectral Carrier through Conclusion"),
    (14904, 15615, "Appendices", ""),
]

RATINGS = {
    1: ("5", "Excellent"),
    2: ("4", "Good"),
    3: ("3", "Acceptable"),
    4: ("3", "Acceptable"),
    5: ("3", "Acceptable"),
    6: ("4", "Good"),
    7: ("3", "Acceptable"),
    8: ("3", "Acceptable"),
    9: ("3", "Acceptable"),
    10: ("4", "Good"),
    11: ("4", "Good"),
    12: ("4", "Good"),
    13: ("3", "Acceptable"),
    14: ("3", "Acceptable"),
    15: ("4", "Good"),
    16: ("5", "Excellent"),
}

AUDIT_ISSUES = {
    1: ["No issues found."],
    2: [
        "Line 803: residual 'does not imply' corrective contrast.",
        "~Line 1182: duplicated/malformed sentence after edit. FIXED: removed duplicate fragment.",
        "Line 1199: residual negative claim about Elite micromanagement.",
    ],
    3: [
        "Line 1792: likely copy-paste error ('class could not be changed through migration' should be 'economic mobility').",
        "Lines 1327, 1494, 1577, 1660, 1786, 1871, 2075, 2154, 2381, 2420: residual definitions by negation / corrective contrasts.",
    ],
    4: [
        "Lines 2471, 2658: residual 'not X, but Y' and 'While X, Y'.",
        "Lines 2619, 2834, 2943, 2960: sentence-initial 'But' pivots.",
    ],
    5: [
        "Line 4018: redundancy/meaning artifact around coverture transition.",
        "Lines 3548, 3552, 3566, 3579, 3588, 3602, 3661, 3778, 3810, 3922, 3994: residual contrasts, clichés ('terrain'), intensifiers ('simply').",
    ],
    6: [
        "Line 4135: 'strict, not rhetorical' corrective contrast.",
        "Line 4429: 'coded as X when it is Y' corrective contrast.",
        "Lines 4253, 4417, 4423: sentence-initial 'But' pivots.",
    ],
    7: [
        "Lines 4667, 4768, 4810: residual corrective contrasts / definitions by negation.",
    ],
    8: [
        "Lines 5453, 5549: strong claims needing source verification (Lüderitz-to-Auschwitz prototype; Tulsa death toll).",
        "Lines 5248–5253, 5263–5268, 5290–5292: tense shifts in historical lists.",
        "Lines 5232, 5288, 5370, 5515, 5678: residual corrective contrasts.",
    ],
    9: [
        "Lines 6146, 6299, 6435, 7253, 7280, 7335, 7436, 7607, 7617, 7764: residual corrective contrasts / definitions by negation.",
    ],
    10: [
        "Lines 7893, 8202, 8843, 9129–9130, 9291: residual corrective contrasts / intensifiers.",
        "Lines 8250, 8329: borderline 'robust' / 'not only' usages.",
        "Lines 8852/8856: 'paradigm' inside a coined term.",
    ],
    11: [
        "Line 9539: definition by negation around 'terminal phase'.",
        "Lines 9620, 9808, 9860, 10501: sentence-initial intensifiers ('Critically,' / 'Crucially,').",
        "Line 10088: sentence-initial 'While X, Y' pivot.",
    ],
    12: [
        "Line 11068: cliché 'navigating'.",
        "Lines 11162, 11260, 11377: sentence-initial 'But' pivots.",
        "Lines 11345, 11371, 11504: residual corrective contrasts / definitions by negation.",
    ],
    13: [
        "Line 11618: 'The law does not regulate conduct; it regulates class membership' corrective contrast.",
        "Lines 11735, 12056, 12283: residual definitions by negation.",
        "Lines 11908, 11980: sentence-initial 'Crucially,'.",
        "Line 12485: dangling referent / meaning continuity issue.",
    ],
    14: [
        "~Lines 13199–13202: duplicated malformed LaTeX sentence. FIXED: removed malformed duplicate.",
        "~Line 14089: FFT bin claim. VERIFIED: bin 30 is correct for fs=4 yr^-1, N=240, f=0.5 cyc/yr (k = f*N/fs = 30).",
        "Line 12993: tense shift in theorem statements.",
        "Lines 12891, 13054, 13162, 13410, 13423, 13477, 13555, 13615, 13643, 13673, 13675, 13689, 13726, 13807, 13881, 13995, 14057: residual contrasts / clichés.",
    ],
    15: [
        "Lines 14410, 14428: tense inconsistencies.",
        "Line 14415: sentence-initial 'Moreover,' transition.",
        "Line 14726: 'landscape' in technical context (borderline).",
    ],
    16: ["No issues found."],
}


def get_original_lines() -> list[str]:
    result = subprocess.run(
        ["git", "show", "HEAD:Paper/The_Original_Power.tex"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    return result.stdout.splitlines(keepends=True)


def get_patched_lines() -> list[str]:
    with open(ORIG_FILE, "r", encoding="utf-8") as f:
        return f.read().splitlines(keepends=True)


def chunk_diff(original: list[str], patched: list[str], start_1: int, end_1: int) -> str:
    start_0 = start_1 - 1
    end_0 = end_1  # exclusive
    orig_chunk = original[start_0:end_0]
    # patched chunk: find the corresponding slice. Because earlier chunks may have
    # changed length, we must compute the new position. We do this by aligning
    # via line content around the boundaries (the first/last lines of the chunk
    # are preserved unless edited at the very edge).
    # Simpler: since chunks are applied by replacing original slices, the patched
    # file is a concatenation. We can reconstruct the patched chunk by taking the
    # lines that came from the patch file for this chunk.
    patch_file = PATCH_DIR / f"chunk_{start_1:02d}.tex" if start_1 != 1 else PATCH_DIR / "chunk_01.tex"
    # Map chunk index:
    idx = next(i for i, (s, e, _, _) in enumerate(CHUNKS) if s == start_1) + 1
    patch_file = PATCH_DIR / f"chunk_{idx:02d}.tex"
    with open(patch_file, "r", encoding="utf-8") as f:
        patched_chunk = f.read().splitlines(keepends=True)
    diff = list(difflib.unified_diff(orig_chunk, patched_chunk, lineterm=""))
    return "\n".join(diff)


def _join_lines(lines: list[str]) -> str:
    """Join source lines into a readable paragraph, adding spaces at wraps."""
    import re
    # Diff output lines have no trailing newlines; insert a space between
    # consecutive source lines and collapse any double spaces that result.
    text = " ".join(lines)
    text = re.sub(r" +", " ", text)
    return text.strip()


def extract_hunks(diff_text: str, max_hunks: int = 3) -> list[tuple[str, str]]:
    """Return list of (before_snippet, after_snippet) from unified diff.

    Only hunks that contain actual changes are returned.
    """
    hunks = []
    lines = diff_text.splitlines()
    i = 0
    while i < len(lines) and len(hunks) < max_hunks:
        if lines[i].startswith("@@"):
            before = []
            after = []
            has_change = False
            i += 1
            while i < len(lines) and not lines[i].startswith("@@"):
                line = lines[i]
                if line.startswith("-") and not line.startswith("---"):
                    before.append(line[1:])
                    has_change = True
                elif line.startswith("+") and not line.startswith("+++"):
                    after.append(line[1:])
                    has_change = True
                elif line.startswith(" "):
                    before.append(line[1:])
                    after.append(line[1:])
                i += 1
            if has_change:
                before_txt = _join_lines(before)
                after_txt = _join_lines(after)
                if before_txt or after_txt:
                    hunks.append((before_txt, after_txt))
        else:
            i += 1
    return hunks


def main() -> None:
    original = get_original_lines()
    patched = get_patched_lines()

    lines = []
    lines.append("# Rhetorical Edit Audit Report\n")
    lines.append("**File:** `Paper/The_Original_Power.tex`\n")
    lines.append(f"**Original lines:** {len(original)} | **Patched lines:** {len(patched)} | **Net change:** {len(patched) - len(original)}\n")
    lines.append("**Commit checkpoint:** `cb0f8b5` (pre-edit state preserved on `HEAD`)\n\n")

    lines.append("## Overall Ratings\n")
    lines.append("| # | Section | Lines | Rating | Verdict |\n")
    lines.append("|---|---------|-------|--------|---------|\n")
    for idx, (start, end, title, desc) in enumerate(CHUNKS, 1):
        rating, verdict = RATINGS[idx]
        lines.append(f"| {idx} | {title}: {desc} | {start}–{end} | {rating}/5 | {verdict} |\n")
    lines.append("\n")

    for idx, (start, end, title, desc) in enumerate(CHUNKS, 1):
        rating, verdict = RATINGS[idx]
        lines.append(f"## {idx}. {title}: {desc}\n\n")
        lines.append(f"**Lines:** {start}–{end}  \n")
        lines.append(f"**Audit rating:** {rating}/5 ({verdict})\n\n")

        lines.append("### Audit issues\n")
        for issue in AUDIT_ISSUES.get(idx, ["No issues noted."]):
            lines.append(f"- {issue}\n")
        lines.append("\n")

        diff_text = chunk_diff(original, patched, start, end)
        hunks = extract_hunks(diff_text, max_hunks=3)
        if hunks:
            lines.append("### Before / after excerpts\n")
            for h_idx, (before, after) in enumerate(hunks, 1):
                lines.append(f"#### Change {h_idx}\n")
                lines.append("**Before:**\n")
                lines.append("```tex\n")
                lines.append(before[:800] + ("\n..." if len(before) > 800 else "\n"))
                lines.append("```\n\n")
                lines.append("**After:**\n")
                lines.append("```tex\n")
                lines.append(after[:800] + ("\n..." if len(after) > 800 else "\n"))
                lines.append("```\n\n")
        else:
            lines.append("*No substantive changes in this chunk.*\n\n")

    report_path = ROOT / "rhetorical_audit_report.mdx"
    with open(report_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print(f"Wrote report to {report_path}")


if __name__ == "__main__":
    main()
