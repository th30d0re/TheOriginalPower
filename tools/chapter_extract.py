#!/usr/bin/env python3
"""Convert per-chapter LaTeX slices (Paper/chapters_src/NN_*.tex) into plaintext
and a structured JSON inventory for downstream web-content agents.

Usage:
    python3 tools/chapter_extract.py --src Paper/chapters_src [--out Paper/chapters_src]

For every NN_*.tex in --src (skipping 00_frontmatter.tex), writes:
    NN_slug.txt             readable plaintext
    NN_slug.inventory.json  structured inventory

Standard library only. Python 3.11+.
"""

import argparse
import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MATH_ENVS = {"equation", "equation*", "align", "align*", "aligned", "gather"}

DROP_ENVS = {
    "figure", "table", "tikzpicture", "axis", "longtable",
    "tabular", "tabularx", "center", "minipage", "scope",
}

LIST_ENVS = {"itemize", "enumerate", "description"}
QUOTE_ENVS = {"quote", "quotation"}
KEEP_ENVS = {"document"}

MARKER_ENVS = {
    "definition": "DEFINITION",
    "keyinsight": "KEYINSIGHT",
    "historicalsource": "HISTORICALSOURCE",
    "theorem": "THEOREM",
    "conjecture": "CONJECTURE",
    "proof": "PROOF",
}

SECTIONS_MAP = {
    "chapter": 1,
    "section": 2,
    "subsection": 3,
    "subsubsection": 4,
}

UNWRAP_CMDS = {
    "textit", "textbf", "emph", "texttt", "textsc",
    "underline", "uline", "mbox", "text",
    "textrm", "textsf", "textnormal", "bfseries", "itshape",
}

DELETE_CMDS = {
    "label", "index", "hypertarget", "phantomsection",
    "vspace", "hspace", "centering", "noindent",
    "clearpage", "newpage", "pagebreak",
    "footnotesize", "small", "normalsize",
    "hfill", "vfill", "medskip", "bigskip", "smallskip", "par",
}

REF_CMDS = {"ref", "autoref", "eqref", "pageref"}

ESCAPES = {
    "%": "%", "&": "&", "_": "_", "$": "$", "#": "#",
    "{": "{", "}": "}", " ": " ", "\\": "\n",
    ",": "", ";": "", ":": "", "!": "", "-": "-",
}

CMD_RE = re.compile(r"\\([A-Za-z]+|[^\x00])")
BEGIN_RE = re.compile(r"\\begin\{([^}]*)\}")
MATH_PH_RE = re.compile("\x00M(\\d+)\x00")
USC_LIT_RE = re.compile(r"\b\d{1,3}(?:\s|~)*U\.S\.C\.")
LABEL_RE = re.compile(r"\\label\{([^}]*)\}")
HEADING_RE = re.compile(r"^(#{1,4})\s+(.*\S)\s*$")


# ---------------------------------------------------------------------------
# Per-chapter state
# ---------------------------------------------------------------------------

class Ctx:
    def __init__(self):
        self.math_store = []        # verbatim $...$ spans, indexed by placeholder
        self.eq_counter = 0
        self.equations = []
        self.runtime_logs = []
        self.definitions = []
        self.key_insights = []
        self.historical_sources = []
        self.theorems = []
        self.citations = set()
        self.usc_refs = set()
        self.figures = []
        self.footnotes = []


# ---------------------------------------------------------------------------
# Balanced-delimiter scanners
# ---------------------------------------------------------------------------

def extract_braced(text, i):
    """Extract a balanced {...} group starting at text[i] == '{'.
    Returns (inner, position_after_closing_brace). Backslash-escaped braces
    do not count toward depth. On unbalanced input, returns the rest."""
    if i >= len(text) or text[i] != "{":
        return None, i
    depth = 0
    start = i
    while i < len(text):
        c = text[i]
        if c == "\\":
            i += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start + 1:i], i + 1
        i += 1
    return text[start + 1:], len(text)


def extract_bracketed(text, i):
    """Extract a balanced [...] group starting at text[i] == '['.
    Braces inside are tracked so that ']' inside a {...} group does not
    close the bracket. Returns (inner, position_after_closing_bracket)."""
    if i >= len(text) or text[i] != "[":
        return None, i
    bdepth = 0
    cdepth = 0
    start = i
    while i < len(text):
        c = text[i]
        if c == "\\":
            i += 2
            continue
        if c == "{":
            cdepth += 1
        elif c == "}":
            cdepth -= 1
        elif cdepth == 0:
            if c == "[":
                bdepth += 1
            elif c == "]":
                bdepth -= 1
                if bdepth == 0:
                    return text[start + 1:i], i + 1
        i += 1
    return text[start + 1:], len(text)


def read_arg(text, p):
    """Read one LaTeX argument at p: optional whitespace, one optional
    [...] group, then a {...} group. Returns (inner_or_None, new_pos).
    When no braced argument is present, position is unchanged."""
    q = p
    while q < len(text) and text[q] in " \t\n":
        q += 1
    if q < len(text) and text[q] == "[":
        _, q = extract_bracketed(text, q)
        while q < len(text) and text[q] in " \t\n":
            q += 1
    if q < len(text) and text[q] == "{":
        return extract_braced(text, q)
    return None, p


def find_env_end(text, name, start):
    """Find the \\end{name} matching a \\begin{name}, counting same-name
    nesting. Returns (match_start, match_end) or None."""
    pat = re.compile(r"\\(begin|end)\{" + re.escape(name) + r"\}")
    depth = 1
    for m in pat.finditer(text, start):
        if m.group(1) == "begin":
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return m.start(), m.end()
    return None


# ---------------------------------------------------------------------------
# Comment stripping and math protection
# ---------------------------------------------------------------------------

def strip_comments(text):
    """A '%' not preceded by a backslash starts a comment to end of line."""
    out_lines = []
    for line in text.split("\n"):
        res = []
        i = 0
        while i < len(line):
            c = line[i]
            if c == "\\":
                res.append(line[i:i + 2])
                i += 2
                continue
            if c == "%":
                break
            res.append(c)
            i += 1
        out_lines.append("".join(res))
    return "\n".join(out_lines)


def find_math_close(text, start, delim):
    """Escape-aware scan for the closing delimiter of a math span.
    '\\' always escapes the next character, so '\\\\$' is a line break
    followed by a real math dollar while '\\$' is a literal dollar.
    For single '$', an empty span or a paragraph break before the closing
    dollar aborts the match (treated as a literal dollar sign)."""
    i = start
    n = len(text)
    while i < n:
        c = text[i]
        if c == "\\":
            i += 2
            continue
        if c == "$":
            if delim == "$$":
                if i + 1 < n and text[i + 1] == "$":
                    return i
                i += 1
                continue
            if i == start:
                return None
            return i
        if delim == "$" and c == "\n" and i + 1 < n and text[i + 1] == "\n":
            return None
        i += 1
    return None


def protect_math(text, ctx):
    """Replace $...$ and $$...$$ spans with \\x00M<n>\\x00 placeholders so
    later passes never touch math content. Escaped dollars (\\$) never open
    or close a span."""
    out = []
    i = 0
    n = len(text)
    while i < n:
        c = text[i]
        if c == "\\":
            out.append(text[i:i + 2])
            i += 2
            continue
        if c == "$":
            if text.startswith("$$", i):
                j = find_math_close(text, i + 2, "$$")
                if j is not None:
                    ctx.math_store.append(text[i:j + 2])
                    out.append("\x00M%d\x00" % (len(ctx.math_store) - 1))
                    i = j + 2
                    continue
            else:
                j = find_math_close(text, i + 1, "$")
                if j is not None:
                    ctx.math_store.append(text[i:j + 1])
                    out.append("\x00M%d\x00" % (len(ctx.math_store) - 1))
                    i = j + 1
                    continue
        out.append(c)
        i += 1
    return "".join(out)


def restore_math(text, ctx):
    def repl(m):
        idx = int(m.group(1))
        if 0 <= idx < len(ctx.math_store):
            return ctx.math_store[idx]
        return m.group(0)
    return MATH_PH_RE.sub(repl, text)


# ---------------------------------------------------------------------------
# Final text finishing
# ---------------------------------------------------------------------------

def finish_text(text, ctx):
    """Quote/dash/tilde replacement, math restoration, whitespace collapse."""
    text = text.replace("``", '"').replace("''", '"')
    text = text.replace("---", "\u2014")
    text = text.replace("--", "\u2013")
    text = text.replace("~", " ")
    text = restore_math(text, ctx)
    text = "\n".join(" ".join(l.split()) for l in text.split("\n"))
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def clean_title(raw):
    """Clean an environment optional-argument title: {,} is a literal comma."""
    if raw is None:
        return None
    t = raw.replace("{,}", "\x01")
    t = t.replace("{", "").replace("}", "")
    t = t.replace("\x01", ",")
    return " ".join(t.split()).strip()


# ---------------------------------------------------------------------------
# tcolorbox option parsing
# ---------------------------------------------------------------------------

def extract_title_option(opt):
    """Pull the value of the title= key out of a tcolorbox option list.
    The value may be braced and may span multiple lines."""
    if not opt:
        return None
    m = re.search(r"(?:^|,)\s*title\s*=", opt)
    if not m:
        return None
    p = m.end()
    while p < len(opt) and opt[p] in " \t\n":
        p += 1
    if p < len(opt) and opt[p] == "{":
        inner, _ = extract_braced(opt, p)
        return inner
    depth = 0
    start = p
    while p < len(opt):
        c = opt[p]
        if c == "\\":
            p += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif c == "," and depth == 0:
            break
        p += 1
    return opt[start:p]


# ---------------------------------------------------------------------------
# Environment processing
# ---------------------------------------------------------------------------

def extract_figure(body, ctx):
    cap = None
    m = re.search(r"\\caption\b", body)
    if m:
        raw, _ = read_arg(body, m.end())
        if raw is not None:
            cap = finish_text(process_inline(raw, ctx), ctx).strip()
    graphics = None
    m = re.search(r"\\includegraphics\b", body)
    if m:
        raw, _ = read_arg(body, m.end())
        if raw is not None:
            graphics = raw.strip()
    ctx.figures.append({"caption": cap, "graphics": graphics})


def render_list(body, ctx):
    items = list(re.finditer(r"\\item\b", body))
    if not items:
        return "\n\n" + convert(body, ctx).strip() + "\n\n"
    lines = []
    for idx, m in enumerate(items):
        p = m.end()
        label = None
        q = p
        while q < len(body) and body[q] in " \t":
            q += 1
        if q < len(body) and body[q] == "[":
            label, q = extract_bracketed(body, q)
        seg_end = items[idx + 1].start() if idx + 1 < len(items) else len(body)
        seg = convert(body[q:seg_end], ctx).strip()
        prefix = "- "
        if label is not None:
            prefix += clean_title(label) + ": "
        lines.append(prefix + seg)
    return "\n\n" + "\n".join(lines) + "\n\n"


def clean_log_title(raw, ctx):
    """Normalize a raw RUNTIME LOG title option to just the log subject, e.g.
    '1486 (LISBON, PORTUGAL)'. Tolerates numbering prefixes
    ('2. RUNTIME LOG: ...') and styling/chapter-reference suffixes."""
    m = re.search(r"RUNTIME LOG:\s*", raw)
    x = raw[m.end():] if m else raw
    x = x.split("---")[0]
    x = re.sub(r"\\ref\{[^}]*\}", "", x)
    x = restore_math(x, ctx)
    x = x.replace("\\rightarrow", "\u2192")
    x = x.replace("$", "")
    x = re.sub(r"\\[A-Za-z]+", "", x)
    x = x.replace("{,}", "\x01")
    x = x.replace("{", "").replace("}", "")
    x = x.replace("\x01", ",")
    x = " ".join(x.split()).strip(" -–—")
    return x.replace("--", "\u2013")


def handle_tcolorbox(opt, body, ctx):
    raw_title = extract_title_option(opt)
    inner = convert(body, ctx).strip()
    if raw_title and "RUNTIME LOG:" in raw_title:
        x = clean_log_title(raw_title, ctx)
        ctx.runtime_logs.append({"title": x, "text": finish_text(inner, ctx)})
        return "\n\n[[RUNTIMELOG: %s]]\n%s\n[[/END]]\n\n" % (x, inner)
    return "\n\n[[BOX]]\n%s\n[[/END]]\n\n" % inner


def dispatch_env(name, opt, body, ctx):
    """Returns replacement text, or None to leave the raw environment in place."""
    if name in MATH_ENVS:
        ctx.eq_counter += 1
        label = None
        latex = body
        lm = LABEL_RE.search(body)
        if lm:
            label = lm.group(1)
            latex = body[:lm.start()] + body[lm.end():]
        ctx.equations.append({
            "index": ctx.eq_counter,
            "env": name,
            "label": label,
            "latex": restore_math(latex, ctx).strip(),
        })
        return "\n\n[[EQ:%d]]\n\n" % ctx.eq_counter
    if name == "figure":
        extract_figure(body, ctx)
        return ""
    if name in DROP_ENVS:
        return ""
    if name in LIST_ENVS:
        return render_list(body, ctx)
    if name in QUOTE_ENVS or name in KEEP_ENVS:
        return "\n\n" + convert(body, ctx).strip() + "\n\n"
    if name in MARKER_ENVS:
        title = clean_title(opt)
        inner = convert(body, ctx).strip()
        record = (title + "\n\n" + inner) if title else inner
        record = finish_text(record, ctx)
        marker = MARKER_ENVS[name]
        if name == "definition":
            ctx.definitions.append({"kind": "definition", "text": record})
        elif name == "keyinsight":
            ctx.key_insights.append(record)
        elif name == "historicalsource":
            ctx.historical_sources.append(record)
        else:
            ctx.theorems.append({"kind": name, "text": record})
        title_line = (title + "\n") if title else ""
        return "\n\n[[%s]]\n%s%s\n[[/END]]\n\n" % (marker, title_line, inner)
    if name == "tcolorbox":
        return handle_tcolorbox(opt, body, ctx)
    return None


def process_environments(text, ctx):
    out = []
    i = 0
    while True:
        m = BEGIN_RE.search(text, i)
        if not m:
            out.append(text[i:])
            break
        name = m.group(1).strip()
        p = m.end()
        opt = None
        body_start = p
        q = p
        while q < len(text) and text[q] in " \t\n":
            q += 1
        if q < len(text) and text[q] == "[":
            opt, q2 = extract_bracketed(text, q)
            if opt is not None:
                body_start = q2
        found = find_env_end(text, name, body_start)
        if not found:
            # Malformed: leave the \begin{...} token in place and continue.
            out.append(text[i:m.end()])
            i = m.end()
            continue
        end_start, end_end = found
        body = text[body_start:end_start]
        replacement = dispatch_env(name, opt, body, ctx)
        if replacement is None:
            # Unknown environment: leave the raw text in place.
            out.append(text[i:end_end])
        else:
            out.append(text[i:m.start()])
            out.append(replacement)
        i = end_end
    return "".join(out)


# ---------------------------------------------------------------------------
# Inline command processing
# ---------------------------------------------------------------------------

def process_inline(text, ctx):
    out = []
    i = 0
    n = len(text)
    for m in CMD_RE.finditer(text):
        if m.start() < i:
            continue
        out.append(text[i:m.start()])
        name = m.group(1)
        p = m.end()
        if len(name) == 1 and not name.isalpha():
            out.append(ESCAPES.get(name, name))
            i = p
            continue
        if name == "S":
            out.append("\u00a7")
            i = p
            continue
        if name == "P":
            out.append("\u00b6")
            i = p
            continue
        # Consume a starred-variant marker (e.g. \section*, \vspace*).
        if p < n and text[p] == "*":
            p += 1
        if name in SECTIONS_MAP:
            arg, p2 = read_arg(text, p)
            if arg is None:
                i = p
                continue
            title = " ".join(process_inline(arg, ctx).split())
            out.append("\n\n" + "#" * SECTIONS_MAP[name] + " " + title + "\n\n")
            i = p2
            continue
        if name in UNWRAP_CMDS:
            arg, p2 = read_arg(text, p)
            if arg is None:
                i = p
                continue
            out.append(process_inline(arg, ctx))
            i = p2
            continue
        if name in DELETE_CMDS:
            _, p2 = read_arg(text, p)
            i = p2
            continue
        if name.startswith("cite"):
            arg, p2 = read_arg(text, p)
            if arg:
                for k in arg.split(","):
                    k = k.strip()
                    if k:
                        ctx.citations.add(k)
            i = p2
            continue
        if name in REF_CMDS:
            _, p2 = read_arg(text, p)
            out.append("(ref)")
            i = p2
            continue
        if name == "footnote":
            arg, p2 = read_arg(text, p)
            if arg is not None:
                inner = finish_text(process_inline(arg, ctx), ctx).strip()
                ctx.footnotes.append(inner)
            i = p2
            continue
        if name in ("textcolor", "colorbox", "href"):
            # Two-argument command: drop the first (color/URL), keep the text.
            _, p1 = read_arg(text, p)
            arg, p2 = read_arg(text, p1)
            if arg is not None:
                out.append(process_inline(arg, ctx))
                i = p2
            else:
                i = p1
            continue
        if name == "usclink":
            _, p1 = read_arg(text, p)
            a2, p2 = read_arg(text, p1)
            disp = process_inline(a2 or "", ctx)
            ctx.usc_refs.add(finish_text(disp, ctx).strip())
            out.append(disp)
            i = p2
            continue
        if name in ("uscinline", "uscquote"):
            a1, p2 = read_arg(text, p)
            if a1:
                ctx.usc_refs.add(a1.strip())
            i = p2
            continue
        if name in ("uscshowdiff", "uscevolution"):
            a1, p1 = read_arg(text, p)
            _, p2 = read_arg(text, p1)
            if a1:
                ctx.usc_refs.add(
                    finish_text(process_inline(a1, ctx), ctx).strip())
            i = p2
            continue
        if name in ("USCTag", "USCSourceNote"):
            i = p
            continue
        if name in ("ldots", "dots"):
            out.append("...")
            i = p
            continue
        if name == "item":
            out.append("\n- ")
            i = p
            continue
        # Unknown command: keep inner text of braced args, drop the name.
        # Bare unknown command: delete it.
        arg, p2 = read_arg(text, p)
        if arg is not None:
            out.append(process_inline(arg, ctx))
            i = p2
        else:
            i = p
    out.append(text[i:])
    return "".join(out)


# ---------------------------------------------------------------------------
# Full per-chapter pipeline
# ---------------------------------------------------------------------------

def convert(text, ctx):
    text = protect_math(text, ctx)
    text = process_environments(text, ctx)
    text = process_inline(text, ctx)
    return text


def convert_chapter(raw, stem):
    ctx = Ctx()
    for m in USC_LIT_RE.finditer(raw):
        ctx.usc_refs.add(re.sub(r"[\s~]+", " ", m.group(0)))
    text = strip_comments(raw)
    text = convert(text, ctx)
    text = finish_text(text, ctx)

    lines = text.split("\n")
    sections = []
    for lineno, line in enumerate(lines, 1):
        hm = HEADING_RE.match(line)
        if hm:
            sections.append({
                "level": len(hm.group(1)),
                "title": hm.group(2),
                "line": lineno,
            })
    chapter_title = next(
        (s["title"] for s in sections if s["level"] == 1), None)
    if chapter_title is None:
        chapter_title = stem.split("_", 1)[-1].replace("_", " ")

    word_count = len(text.split())
    inv = {
        "file": stem + ".tex",
        "chapter_title": chapter_title,
        "word_count": word_count,
        "sections": sections,
        "equations": ctx.equations,
        "runtime_logs": ctx.runtime_logs,
        "definitions": ctx.definitions,
        "key_insights": ctx.key_insights,
        "historical_sources": ctx.historical_sources,
        "theorems": ctx.theorems,
        "citations": sorted(ctx.citations),
        "usc_refs": sorted(ctx.usc_refs),
        "figures": ctx.figures,
        "footnotes": ctx.footnotes,
    }
    return text + "\n", inv


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="Extract plaintext and JSON inventories from chapter LaTeX slices.")
    ap.add_argument("--src", default="Paper/chapters_src",
                    help="Directory containing NN_*.tex chapter slices.")
    ap.add_argument("--out", default=None,
                    help="Output directory (default: same as --src).")
    args = ap.parse_args()

    src = Path(args.src)
    out = Path(args.out) if args.out else src
    out.mkdir(parents=True, exist_ok=True)

    files = sorted(
        f for f in src.glob("[0-9][0-9]_*.tex")
        if f.name != "00_frontmatter.tex")
    if not files:
        print("no chapter files found in %s" % src, file=sys.stderr)
        return 1

    total_words = 0
    total_eqs = 0
    for f in files:
        raw = f.read_text(encoding="utf-8", errors="replace")
        txt, inv = convert_chapter(raw, f.stem)
        (out / (f.stem + ".txt")).write_text(txt, encoding="utf-8")
        (out / (f.stem + ".inventory.json")).write_text(
            json.dumps(inv, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8")
        total_words += inv["word_count"]
        total_eqs += len(inv["equations"])
        print("%s: %d words, %d sections, %d equations, %d runtime logs, "
              "%d figures, %d citations" % (
                  f.name, inv["word_count"], len(inv["sections"]),
                  len(inv["equations"]), len(inv["runtime_logs"]),
                  len(inv["figures"]), len(inv["citations"])))
    print("TOTAL: %d chapters, %d words, %d equations"
          % (len(files), total_words, total_eqs))
    return 0


if __name__ == "__main__":
    sys.exit(main())
