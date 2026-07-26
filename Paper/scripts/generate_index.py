#!/usr/bin/env python3
"""
generate_index.py — T4 skeleton equation index generator
==========================================================
Reads all YAML-frontmatter .md files in Paper/empirical_validations/,
validates required fields, and outputs Paper/empirical_index.tex — a
LaTeX longtable (5 columns) with one row per equation.

Usage (via Makefile):
    make index
    # or directly:
    python3 Paper/scripts/generate_index.py

Exit codes:
    0  — success (warnings for missing fields are acceptable at T4 stage)
    1  — parse error (YAML malformed; must be fixed before T9)
"""

from __future__ import annotations

import sys
import re
import textwrap
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR    = Path(__file__).resolve().parent
PAPER_DIR     = SCRIPT_DIR.parent
REGISTRY_DIR  = PAPER_DIR / "empirical_validations"
OUTPUT_TEX    = PAPER_DIR / "empirical_index.tex"

# ── Required fields (missing → warning, not error) ───────────────────────────
REQUIRED_FIELDS = [
    "label", "new_label", "chapter", "chapter_title",
    "line", "statement", "type", "tier", "status",
    "existing_case_study", "phase3_headline",
    "difficulty", "falsification",
]

# ── Tier descriptions ─────────────────────────────────────────────────────────
TIER_DESC = {
    1: "Peer-reviewed quantitative",
    2: "Public dataset + computation",
    3: "Ordinal / structural estimate",
}

# ── LaTeX helpers ─────────────────────────────────────────────────────────────

def _tex_escape(s: str) -> str:
    """Minimal LaTeX escaping for text content in table cells."""
    if not s:
        return ""
    s = str(s)
    replacements = [
        ("\\", r"\textbackslash{}"),
        ("&",  r"\&"),
        ("%",  r"\%"),
        ("$",  r"\$"),
        ("#",  r"\#"),
        ("_",  r"\_"),
        ("{",  r"\{"),
        ("}",  r"\}"),
        ("~",  r"\textasciitilde{}"),
        ("^",  r"\textasciicircum{}"),
    ]
    for old, new in replacements:
        s = s.replace(old, new)
    # pdflatex: Unicode → LaTeX **after** escaping so inserted `\\Gamma` etc. are not mangled.
    unicode_math = {
        "Σ": r"$\Sigma$",
        "σ": r"$\sigma$",
        "τ": r"$\tau$",
        "Φ": r"$\Phi$",
        "φ": r"$\phi$",
        "ρ": r"$\rho$",
        "ψ": r"$\psi$",
        "δ": r"$\delta$",
        "α": r"$\alpha$",
        "β": r"$\beta$",
        "γ": r"$\gamma$",
        "θ": r"$\theta$",
        "λ": r"$\lambda$",
        "μ": r"$\mu$",
        "ω": r"$\omega$",
        "Ω": r"$\Omega$",
        "Δ": r"$\Delta$",
        "Γ": r"$\Gamma$",
        "∈": r"$\in$",
        "∩": r"$\cap$",
        "∪": r"$\cup$",
        "∅": r"$\emptyset$",
        "∞": r"$\infty$",
        "≥": r"$\geq$",
        "≤": r"$\leq$",
        "≠": r"$\neq$",
        "≈": r"$\approx$",
        "→": r"$\rightarrow$",
        "←": r"$\leftarrow$",
        "…": r"\ldots",
        "\u2013": r"--",  # en dash
        "\u2014": r"---",  # em dash
        "\u2019": r"'",
        "\u201c": r"``",
        "\u201d": r"''",
    }
    for u, tex in unicode_math.items():
        s = s.replace(u, tex)
    return s


def _shorten(s: str, maxlen: int = 60) -> str:
    """Truncate and escape a string for a table cell."""
    if not s:
        return r"\textit{(pending)}"
    s = str(s).strip().replace("\n", " ")
    if len(s) > maxlen:
        s = s[:maxlen - 1] + "…"
    return _tex_escape(s)


def _breakable_label(label: str) -> str:
    r"""Escape an equation label and add zero-width break opportunities.

    Labels run to 47 characters (e.g. eq:12.9-multiplicative-intersection-
    compounding). In a fixed-width p{} column, \texttt has no hyphenation and no
    natural break points, so the cell overruns its column and prints on top of the
    next one. Inserting \discretionary{}{}{} after each ':', '-' and '.' lets TeX
    wrap the label inside its column without adding any visible character.
    """
    escaped = _tex_escape(label)
    for ch in (":", "-", "."):
        escaped = escaped.replace(ch, ch + r"\discretionary{}{}{}")
    return rf"\eqlab{{{escaped}}}"


def _tier_color(tier: int) -> str:
    """LaTeX color command for tier badge."""
    colors = {1: "green!60!black", 2: "blue!70!black", 3: "gray"}
    return colors.get(tier, "black")


def _status_badge(status: str) -> str:
    colors = {"complete": "green!60!black", "in_progress": "orange!80!black", "pending": "gray!60"}
    col = colors.get(status, "gray!60")
    return rf"\textcolor{{{col}}}{{\small\texttt{{{_tex_escape(status)}}}}}"


_VALID_LABEL_RE = re.compile(r"^[A-Za-z][A-Za-z0-9:_\-\.]*$")


def _looks_like_latex_label(s: str) -> bool:
    """True if case_study_line should be emitted as \\pageref{...}."""
    if not s or ":" not in s:
        return False
    # Numeric manuscript lines may contain ':' rarely; require letter-start segment before ':'
    return bool(re.match(r"^[A-Za-z][A-Za-z0-9_]*:.+$", s.strip()))


def _validate_label_key(s: str) -> str | None:
    """Return the raw label key if it is safe to use inside \\pageref{}, else None.

    LaTeX label keys must not contain unescaped special characters other than
    the handful that LaTeX allows in cross-reference keys (letters, digits,
    colon, underscore, hyphen, dot).  We validate the key directly rather than
    text-escaping it, because _tex_escape() would mangle underscores into
    ``\\_`` and break the cross-reference lookup.
    """
    if not s:
        return None
    # Strip surrounding whitespace that may have crept in from YAML parsing
    s = s.strip()
    if _VALID_LABEL_RE.match(s):
        return s
    return None


def _case_study_location_cell(rec: dict) -> str:
    """Case study column: pageref for LaTeX labels, else Ch.~n + line, else chapter only."""
    ch = rec.get("chapter", "?")
    csl = rec.get("case_study_line")
    if csl is None or (isinstance(csl, str) and not str(csl).strip()):
        return rf"Ch.~{_tex_escape(str(ch))}"
    s = str(csl).strip()
    if _looks_like_latex_label(s):
        # Use the raw validated key — do NOT text-escape it.  Escaping would
        # convert underscores to ``\_`` which would not match the original
        # \label{...} token and produce an unresolved reference.
        raw_key = _validate_label_key(s)
        if raw_key is not None:
            return rf"p.~\pageref{{{raw_key}}}"
        # Key contains characters unsafe for \pageref — fall through to
        # display as escaped text so the document still compiles.
        return rf"Ch.~{_tex_escape(str(ch))}, \textit{{(invalid label)}}"
    line_disp = s.lstrip("~")
    return rf"Ch.~{_tex_escape(str(ch))}, l.~{_tex_escape(line_disp)}"


def _primary_data_source_cell(rec: dict) -> str:
    """First data_sources[].name, else (ordinal) for Tier 3, else (pending)."""
    tier = int(rec.get("tier", 3))
    ds = rec.get("data_sources") or []
    if isinstance(ds, list) and ds:
        first = ds[0]
        if isinstance(first, dict):
            name = (first.get("name") or "").strip()
            if name:
                return _shorten(name, maxlen=52)
    if tier == 3:
        return r"\textit{(ordinal)}"
    return r"\textit{(pending)}"


def _tier_badge(tier: int) -> str:
    col = _tier_color(tier)
    return rf"\textcolor{{{col}}}{{\textbf{{T{tier}}}}}"


# ── Registry loader ───────────────────────────────────────────────────────────

def load_registry(registry_dir: Path) -> tuple[list[dict], list[str], list[str]]:
    """
    Load all eq_*.md files from registry_dir.
    Returns (records, warnings, errors).
    warnings: missing-field issues (acceptable at T4)
    errors:   parse failures (must fix before T9)
    """
    records: list[dict] = []
    warnings: list[str] = []
    errors:   list[str] = []

    md_files = sorted(registry_dir.glob("eq_*.md"))
    if not md_files:
        errors.append(f"No eq_*.md files found in {registry_dir}")
        return records, warnings, errors

    for fpath in md_files:
        raw = fpath.read_text(encoding="utf-8")
        # Split on YAML frontmatter delimiters
        parts = raw.split("---\n", 2)
        if len(parts) < 3:
            errors.append(f"{fpath.name}: could not find YAML frontmatter delimiters")
            continue
        try:
            fm = yaml.safe_load(parts[1])
        except yaml.YAMLError as exc:
            errors.append(f"{fpath.name}: YAML parse error — {exc}")
            continue
        if not isinstance(fm, dict):
            errors.append(f"{fpath.name}: frontmatter is not a YAML mapping")
            continue

        fm["_file"] = fpath.name
        records.append(fm)

        # Check required fields
        for field in REQUIRED_FIELDS:
            if field not in fm or fm[field] is None:
                warnings.append(f"{fpath.name}: missing field '{field}'")

    return records, warnings, errors


# ── LaTeX output ──────────────────────────────────────────────────────────────

_LONGTABLE_PREAMBLE = r"""% empirical_index.tex — auto-generated by Paper/scripts/generate_index.py
% Do NOT edit manually. Regenerate with: make index
%
% Columns: equation label | case study location | confidence tier (badge) |
%          primary data source | falsification (truncated)
%
% Include in main document with:
%   \input{empirical_index}
%
% Requires: longtable, booktabs, xcolor, array (loaded in main preamble)

\begingroup
\small
\setlength{\LTpre}{6pt}
\setlength{\LTpost}{6pt}
% Equation labels are long unbreakable \texttt strings (up to 47 chars). Without
% explicit break opportunities they overrun the label column and print on top of
% the case-study column. \eqlab emits the label with zero-width discretionary
% breaks after ':', '-' and '.', inserted by the generator.
\providecommand{\eqlab}[1]{\texttt{#1}}
\begin{longtable}{@{}%
  >{\raggedright\arraybackslash}p{3.2cm}
  >{\raggedright\arraybackslash}p{2.5cm}
  >{\centering\arraybackslash}p{1.0cm}
  >{\raggedright\arraybackslash}p{3.3cm}
  >{\raggedright\arraybackslash}p{5.2cm}@{}}
\textbf{Equation label} &
\textbf{Case study location} &
\textbf{Tier} &
\textbf{Primary data source} &
\textbf{Falsification (truncated)} \\
\endfirsthead
\textbf{Equation label} &
\textbf{Case study location} &
\textbf{Tier} &
\textbf{Primary data source} &
\textbf{Falsification (truncated)} \\
\endhead
\multicolumn{5}{r}{\small\itshape continued on next page} \\
\endfoot
\endlastfoot
"""

_LONGTABLE_SUFFIX = r"""\end{longtable}
\endgroup
"""


def build_longtable(records: list[dict]) -> str:
    """Build the longtable body from sorted records."""
    # Sort by chapter, then by file name (preserves within-chapter seq order)
    records_sorted = sorted(
        records,
        key=lambda r: (r.get("chapter", 0), r.get("_file", "")),
    )

    rows: list[str] = []
    prev_chapter = None

    for rec in records_sorted:
        ch = rec.get("chapter", "?")
        label = str(rec.get("new_label") or rec.get("label", ""))
        tier = int(rec.get("tier", 3))
        falsi = str(rec.get("falsification", "") or "")
        p3 = rec.get("phase3_headline", False)

        # Chapter separator row
        if ch != prev_chapter:
            ch_title = _tex_escape(str(rec.get("chapter_title", f"Chapter {ch}")))
            rows.append(
                rf"\multicolumn{{5}}{{l}}{{\small\bfseries Chapter {ch}: {ch_title}}} \\"
            )
            prev_chapter = ch

        # Compose label cell — bold for Phase 3 headlines
        label_cell = _breakable_label(label)
        if p3:
            label_cell = rf"\textbf{{{label_cell}}}"

        loc_cell = _case_study_location_cell(rec)
        tier_cell = _tier_badge(tier)
        src_cell = _primary_data_source_cell(rec)
        falsi_cell = _shorten(falsi, maxlen=72)

        row = f"{label_cell} & {loc_cell} & {tier_cell} & {src_cell} & {falsi_cell} \\\\"
        rows.append(row)

    return "\n".join(rows)


def write_tex(records: list[dict], n_valid: int, n_missing: int) -> None:
    body = build_longtable(records)
    n_complete = sum(1 for r in records if str(r.get("status", "")).strip() == "complete")
    comment_header = textwrap.dedent(f"""\
        % ── Empirical Validation Index ────────────────────────────────────────────
        % Equations: {len(records)} total | {n_valid} fully specified | {n_missing} with missing fields
        % status=complete: {n_complete} (abstract stats: N={len(records)}, M={n_complete})
        % Columns: label | case study location | tier (T1--T3 badge) | primary source | falsification
        % Tier legend: 1=peer-reviewed quantitative  2=public dataset  3=ordinal/structural
        % Bold label = Phase 3 headline equation
        % ──────────────────────────────────────────────────────────────────────────

    """)
    OUTPUT_TEX.write_text(
        comment_header + _LONGTABLE_PREAMBLE + body + "\n" + _LONGTABLE_SUFFIX,
        encoding="utf-8",
    )


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> int:
    print(f"generate_index.py — reading {REGISTRY_DIR} …")

    records, warnings, errors = load_registry(REGISTRY_DIR)

    # Report errors (fatal)
    if errors:
        print(f"\n  ERRORS ({len(errors)}) — must fix before T9:")
        for e in errors:
            print(f"    ✗ {e}")
        print("\nAborting: parse errors present.", file=sys.stderr)
        return 1

    # Count missing-field records
    missing_field_files: set[str] = set()
    for w in warnings:
        fname = w.split(":")[0]
        missing_field_files.add(fname)

    n_valid   = len(records) - len(missing_field_files)
    n_missing = len(missing_field_files)

    # Report warnings (non-fatal)
    if warnings:
        print(f"\n  Warnings ({len(warnings)}) — missing fields acceptable at T4 stage:")
        for w in warnings[:20]:
            print(f"    ⚠  {w}")
        if len(warnings) > 20:
            print(f"    … and {len(warnings)-20} more (see full list above)")

    # Generate output
    write_tex(records, n_valid, n_missing)

    # Summary
    by_type: dict[str, int] = {}
    by_tier: dict[int, int] = {}
    for r in records:
        t = str(r.get("type", "structural"))
        ti = int(r.get("tier", 3))
        by_type[t] = by_type.get(t, 0) + 1
        by_tier[ti] = by_tier.get(ti, 0) + 1

    print(f"\n  ─── Summary ───────────────────────────────────────────────")
    n_complete = sum(1 for r in records if str(r.get("status", "")).strip() == "complete")
    print(f"  Files parsed   : {len(records)}")
    print(f"  Fully specified: {n_valid}")
    print(f"  Missing fields : {n_missing}")
    print(f"  status=complete: {n_complete}  (abstract: N={len(records)} anchor cases, M={n_complete} historical events)")
    for t, n in sorted(by_type.items()):
        print(f"  type={t:<16}: {n}")
    for t, n in sorted(by_tier.items()):
        print(f"  tier={t}            : {n}")
    print(f"\n  Output → {OUTPUT_TEX}")
    print(f"  ─── Done ──────────────────────────────────────────────────")

    return 0


if __name__ == "__main__":
    sys.exit(main())
