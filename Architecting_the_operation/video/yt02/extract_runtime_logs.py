#!/usr/bin/env python3
"""Extract the Compiled Runtime Log appendix into dashboard_eras.json.

Parses every tcolorbox titled "N. RUNTIME LOG: ..." inside
\\chapter{Compiled Runtime Log} of Paper/The_Original_Power.tex and writes a
JSON list of era records for the YT02 runtime dashboard (see DASHBOARD_SPEC.md).
Stdlib only. Reads the manuscript; never writes to Paper/.

Field-label variants across logs (Variables Loaded / Variables Deployed /
Variables Deployed This Cycle / Variables Targeted) are preserved verbatim in
raw_fields. For the normalized fields dict, "Variables Targeted" maps to
variables_loaded and every label starting with "Variables Deployed" maps to
variables_deployed.
"""

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_TEX = REPO_ROOT / "Paper" / "The_Original_Power.tex"
DEFAULT_OUT = Path(__file__).resolve().parent / "dashboard_eras.json"

CHAPTER = r"\chapter{Compiled Runtime Log}"

GREEK = {
    "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "epsilon": "ε",
    "zeta": "ζ", "eta": "η", "theta": "θ", "iota": "ι", "kappa": "κ",
    "lambda": "λ", "mu": "μ", "nu": "ν", "xi": "ξ", "pi": "π", "rho": "ρ",
    "sigma": "σ", "tau": "τ", "phi": "φ", "chi": "χ", "psi": "ψ", "omega": "ω",
    "Gamma": "Γ", "Delta": "Δ", "Theta": "Θ", "Lambda": "Λ", "Xi": "Ξ",
    "Pi": "Π", "Sigma": "Σ", "Phi": "Φ", "Psi": "Ψ", "Omega": "Ω",
}

MATH_SYMS = {
    "in": "∈", "notin": "∉", "rightarrow": "→", "leftarrow": "←",
    "Rightarrow": "⇒", "cap": "∩", "cup": "∪", "setminus": "∖",
    "times": "×", "leq": "≤", "geq": "≥", "neq": "≠", "pm": "±",
    "infty": "∞", "sum": "∑", "prod": "∏", "partial": "∂",
}

ACCENTS = {
    "'": "́", "`": "̀", "^": "̂", "~": "̃", '"': "̈", "c": "̧",
}

UNWRAP_MACROS = (
    "textbf|textit|texttt|emph|text|mathrm|mathbf|mathit|mathcal|mathsf|vec|underline"
)
STYLE_MACROS = "bfseries|ttfamily|normalfont|small|footnotesize|large|Large|huge|centering|raggedright"


def _accent_repl(match):
    cmd, letter = match.group(1), match.group(2)
    return unicodedata.normalize("NFC", letter + ACCENTS[cmd])


def _math_to_plain(segment):
    """Flatten one $...$ math segment to readable unicode text."""
    t = segment
    t = re.sub(r"\\([A-Za-z]+)", lambda m: GREEK.get(m.group(1), m.group(0)), t)
    t = re.sub(
        r"\\([A-Za-z]+)",
        lambda m: MATH_SYMS.get(m.group(1), m.group(0)),
        t,
    )
    t = re.sub(r"\\(min|max|log|exp|sin|cos)\b", r"\1", t)

    def _script(match):
        sigil, body = match.group(1), match.group(2)
        body = body.replace("{", "").replace("}", "")
        if re.fullmatch(r"[A-Za-z0-9_.]+", body):
            return sigil + body
        return sigil + "(" + body + ")"

    t = re.sub(r"([_^])\{([^{}]*)\}", _script, t)
    t = re.sub(r"\\([{}])", r"\1", t)
    t = re.sub(r"\\([A-Za-z]+)", r"\1", t)
    t = t.replace("{", "").replace("}", "")
    return t


def latex_to_plain(text):
    """Convert a LaTeX fragment to plain readable text, keeping wording verbatim."""
    if not text:
        return ""
    s = text
    s = re.sub(r"\\(['`^\"~c])\{([A-Za-z])\}", _accent_repl, s)
    s = re.sub(r"\\(['`^\"~])([A-Za-z])", _accent_repl, s)
    s = s.replace("{,}", ",")
    s = s.replace("``", "“").replace("''", "”")
    s = s.replace("---", "—").replace("--", "–")
    s = re.sub(r"\\[lc]?dots\b", "…", s)
    s = re.sub(r"\\([%&$#_])", r"\1", s)
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r"\\(?:" + UNWRAP_MACROS + r")\{([^{}]*)\}", r"\1", s)
        s = re.sub(r"\\textcolor\{[^{}]*\}\{([^{}]*)\}", r"\1", s)
    s = re.sub(r"\\cite\w*\{[^{}]*\}", "", s)
    s = re.sub(r"\\ref\{([^{}]*)\}", r"\1", s)
    s = re.sub(r"\\label\{[^{}]*\}", "", s)
    s = s.replace(r"\S", "§")
    s = s.replace("~", " ")
    s = re.sub(r"\$([^$]*)\$", lambda m: _math_to_plain(m.group(1)), s)
    s = re.sub(r"\\(?:" + STYLE_MACROS + r")\b", "", s)
    s = s.replace(r"\{", "{").replace(r"\}", "}")
    s = s.replace("\\\\", " ")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


LEVEL_TOKEN = re.compile(r"[A-Z0-9][A-Z0-9\-+/%.]*")


def split_level(text):
    """Split "LEVEL --- reason" into {level, reason}.

    The level is the leading run of all-caps words before the first em dash.
    Falls back to the leading all-caps run when no dash is present; level is
    None when the value opens in lowercase.
    """
    if text is None:
        return None
    head, sep, tail = text.partition("—")
    tokens = head.split()
    level = []
    for tok in tokens:
        if LEVEL_TOKEN.fullmatch(tok) and any(c.isupper() for c in tok):
            level.append(tok)
        else:
            break
    if not level:
        return {"level": None, "reason": text}
    level_str = " ".join(level).rstrip(".")
    remainder = " ".join(tokens[len(level):])
    if sep:
        reason = (remainder + " — " + tail).strip(" —") if remainder else tail.strip()
    else:
        reason = remainder if remainder else text
    return {"level": level_str, "reason": reason}


NUM = r"(\d+(?:\.\d+)?)"


def parse_interference(text):
    """Extract phi_load / rho_tau ranges and the crash reading from the field text."""
    if text is None:
        return None
    text = text.replace("ρ_(τ)", "ρ_τ")
    out = {"text": text, "phi_load": None, "rho_tau": None, "rho_tau_crash": None}
    m = re.search(r"Φ_load\s*∈\s*\[" + NUM + r",\s*" + NUM + r"\]", text)
    if not m:
        m = re.match(r"\s*\[" + NUM + r",\s*" + NUM + r"\]", text)
    if m:
        out["phi_load"] = [float(m.group(1)), float(m.group(2))]
    m = re.search(r"ρ_τ\s*>\s*" + NUM + r"\s*at crash", text)
    if m:
        out["rho_tau_crash"] = float(m.group(1))
    m = re.search(
        r"ρ_τ(?:\s*=\s*M\(t\)\s*/\s*τ)?\s*∈\s*\[" + NUM + r",\s*" + NUM + r"\]", text
    )
    if m:
        out["rho_tau"] = [float(m.group(1)), float(m.group(2))]
    else:
        m = re.search(r"ρ_τ(?:\s*=\s*M\(t\)\s*/\s*τ)?\s*→\s*" + NUM, text)
        if m:
            out["rho_tau"] = [float(m.group(1)), float(m.group(1))]
        else:
            m = re.search(r"ρ_τ\s*=\s*" + NUM + r"(?![\d.])", text)
            if m:
                out["rho_tau"] = [float(m.group(1)), float(m.group(1))]
    return out


def split_variables(text):
    """Split a variables list on commas that sit outside parentheses."""
    if text is None:
        return []
    t = text.rstrip().rstrip(".")
    items, depth, current = [], 0, []
    for ch in t:
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth = max(0, depth - 1)
        if ch == "," and depth == 0:
            items.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
    if current:
        items.append("".join(current).strip())
    return [item for item in items if item]


RESULT_MARKER = re.compile(r"(?=\[[A-Z][A-Z ]+\])")


def split_results(text):
    """Split a Result field into one entry per bracketed [POLICY]-style item.

    Text preceding the first marker becomes its own entry; text following the
    last marker stays attached to that entry.
    """
    if text is None:
        return []
    parts = [part.strip() for part in RESULT_MARKER.split(text)]
    return [part for part in parts if part]


FIELD_RE = re.compile(r"^\\textbf\{([^{}]+)\}\s*(?:\((.*?)\))?\s*:\s*(.*)$", re.DOTALL)


def parse_fields(body):
    """Return (ordered_fields, raw_fields) for one tcolorbox body."""
    raw_fields = {}
    ordered = []
    if "\\begin{tabular}" in body:
        tab = re.search(
            r"\\begin\{tabular\}\{[^{}]*\}(.*?)\\end\{tabular\}", body, re.DOTALL
        )
        if tab:
            for row in re.split(r"\\\\", tab.group(1)):
                row = row.strip()
                if not row or "&" not in row:
                    continue
                key_tex, val_tex = row.split("&", 1)
                key = latex_to_plain(key_tex).rstrip(":").strip()
                raw_fields[key] = latex_to_plain(val_tex)
        return ordered, raw_fields
    body = re.sub(r"\\(?:" + STYLE_MACROS + r")\b", "", body)
    for chunk in re.split(r"\\\\", body):
        chunk = chunk.strip()
        match = FIELD_RE.match(chunk)
        if not match:
            continue
        label = match.group(1).strip()
        note = match.group(2)
        value = match.group(3).strip()
        ordered.append((label, note, value))
        head = f"({note.strip()}): " if note else ""
        raw_fields[label] = latex_to_plain(head + value)
    return ordered, raw_fields


def parse_box(options, body):
    """Parse one tcolorbox into an era record, or return None."""
    title_match = re.search(r"(?<![A-Za-z])title\s*=\s*(.*)$", options, re.DOTALL)
    if not title_match:
        return None
    raw_title = title_match.group(1).strip()
    num_match = re.match(r"(\d+)\.\s*RUNTIME LOG:\s*(.*)$", raw_title, re.DOTALL)
    if not num_match:
        return None
    log_n = int(num_match.group(1))
    rest = num_match.group(2).strip()
    chapter_label = None
    chap_match = re.search(
        r"\\normalfont\\small\s*---\s*Chapter\s*\\ref\{([^{}]+)\}\s*$", rest
    )
    if chap_match:
        chapter_label = chap_match.group(1)
        rest = rest[: chap_match.start()].rstrip()
    title = latex_to_plain(rest)

    ordered, raw_fields = parse_fields(body)

    def value_of(*labels):
        for label, _note, value in ordered:
            if label in labels:
                return latex_to_plain(value)
        return None

    def value_startswith(prefix):
        for label, _note, value in ordered:
            if label.startswith(prefix):
                return latex_to_plain(value)
        return None

    fields = {
        "system_stress": split_level(value_of("System Stress")),
        "capital": split_level(value_of("Capital")),
        "interference_state": parse_interference(value_of("Interference State")),
        "active_patch": value_of("Active Patch"),
        "variables_loaded": split_variables(
            value_of("Variables Loaded", "Variables Targeted")
        ),
        "variables_deployed": split_variables(value_startswith("Variables Deployed")),
        "executing_function": value_of("Executing Function", "Executed Function"),
        "results": split_results(value_of("Result", "Policies Executed")),
    }
    return {
        "log": log_n,
        "title": title,
        "chapter_label": chapter_label,
        "fields": fields,
        "raw_fields": raw_fields,
    }


def parse_runtime_logs(tex_path):
    """Parse every numbered RUNTIME LOG box in the Compiled Runtime Log chapter."""
    text = Path(tex_path).read_text(encoding="utf-8")
    start = text.index(CHAPTER)
    end = text.find(r"\chapter{", start + len(CHAPTER))
    section = text[start : end if end != -1 else len(text)]
    records = []
    box_re = re.compile(
        r"\\begin\{tcolorbox\}\[(.*?)\](.*?)\\end\{tcolorbox\}", re.DOTALL
    )
    for match in box_re.finditer(section):
        record = parse_box(match.group(1), match.group(2))
        if record:
            records.append(record)
    return records


def summary_line(record):
    fields = record["fields"]

    def level(key):
        value = fields[key]
        return value["level"] if value and value["level"] else "-"

    ist = fields["interference_state"] or {}

    def rng(key):
        value = ist.get(key)
        return f"[{value[0]:.2f}, {value[1]:.2f}]" if value else "-"

    crash = ist.get("rho_tau_crash")
    crash_text = f"{crash:.2f}" if crash is not None else "-"
    return (
        f"log {record['log']:>2} | {record['title']} | {record['chapter_label']} | "
        f"stress={level('system_stress')} | capital={level('capital')} | "
        f"phi={rng('phi_load')} | rho={rng('rho_tau')} | crash={crash_text} | "
        f"loaded={len(fields['variables_loaded'])} | "
        f"deployed={len(fields['variables_deployed'])} | "
        f"results={len(fields['results'])}"
    )


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--eras",
        default=None,
        help="Comma-separated log numbers to keep (e.g. 2,3,5,9,14,15,17). Default: all.",
    )
    parser.add_argument("--input", default=str(DEFAULT_TEX), help="Path to the .tex manuscript.")
    parser.add_argument("--output", default=str(DEFAULT_OUT), help="Path for the JSON output.")
    args = parser.parse_args(argv)

    records = parse_runtime_logs(Path(args.input))
    if args.eras:
        keep = {int(piece) for piece in args.eras.split(",") if piece.strip()}
        records = [record for record in records if record["log"] in keep]

    out_path = Path(args.output)
    out_path.write_text(
        json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    for record in records:
        print(summary_line(record))
    print(f"wrote {len(records)} era(s) -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
