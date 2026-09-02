#!/usr/bin/env python3
"""Rewrite the LaTeX manuscript into a pandoc-ready body for EPUB conversion.

The manuscript uses constructs pandoc's LaTeX reader drops silently: TikZ/pgfplots
pictures, tcolorbox titles, LaTeX counters, and \\ref/\\eqref cross-references.
This script resolves all of them ahead of pandoc:

  * \\input and \\uscinline are expanded so every label is visible.
  * tikzpicture blocks are swapped for pre-rendered PNGs (see epub_build.sh).
  * LaTeX counters are simulated so 1131 cross-references resolve to real numbers,
    emitted as \\hyperlink/\\hypertarget pairs that pandoc turns into <a href="#id">.
  * Box environments keep their optional title via a nested `boxtitle` environment;
    pandoc maps unknown environments to <div class="..."> which the CSS then styles.

Usage: epub_prepare.py <paper-dir> <build-dir>
       epub_prepare.py --emit-tikz <tikz-dir> <paper-dir>
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

# Environments rendered as titled callout boxes.
BOX_ENVS = ("definition", "keyinsight", "historicalsource")
# Environments that carry a LaTeX counter.
THEOREM_ENVS = ("theorem", "conjecture")

# Commands stripped wholesale (print-only layout control).
STRIP_CMDS = [
    r"\\includepdf(\[[^\]]*\])?\{[^}]*\}",
    r"\\maketitle", r"\\frontmatter", r"\\mainmatter", r"\\backmatter",
    r"\\tableofcontents", r"\\listoffigures", r"\\listoftables",
    r"\\pagestyle\{[^}]*\}", r"\\thispagestyle\{[^}]*\}",
    r"\\markboth\{[^}]*\}\{[^}]*\}", r"\\markright\{[^}]*\}",
    r"\\addcontentsline\{[^}]*\}\{[^}]*\}\{(?:[^{}]|\{[^{}]*\})*\}",
    r"\\FloatBarrier", r"\\clearpage", r"\\newpage", r"\\cleardoublepage",
    r"\\begingroup", r"\\endgroup",
    # \clearpage/\cleardoublepage are stripped above, so \let is left bare.
    r"\\let\\cleardoublepage\\clearpage", r"\\let\b",
    r"\\printbibliography(\[[^\]]*\])?",
    r"\\vspace\*?\{[^}]*\}", r"\\hspace\*?\{[^}]*\}", r"\\vfill", r"\\hfill",
    r"\\centering", r"\\raggedright", r"\\noindent",
    r"\\setcounter\{[^}]*\}\{[^}]*\}", r"\\addtocounter\{[^}]*\}\{[^}]*\}",
    r"\\onehalfspacing", r"\\singlespacing", r"\\doublespacing",
    r"\\small", r"\\footnotesize", r"\\scriptsize", r"\\normalsize", r"\\large",
]


def brace_span(text: str, start: int) -> tuple[str, int]:
    """Read a balanced {...} group beginning at text[start] == '{'."""
    assert text[start] == "{"
    depth, i = 0, start
    while i < len(text):
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start + 1:i], i + 1
        i += 1
    raise ValueError("unbalanced brace")


def bracket_span(text: str, start: int) -> tuple[str | None, int]:
    """Read an optional [...] group at text[start] if present."""
    if start >= len(text) or text[start] != "[":
        return None, start
    depth, i = 0, start
    while i < len(text):
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                return text[start + 1:i], i + 1
        i += 1
    return None, start


def env_span(text: str, start: int, env: str) -> int:
    """Return index just past the \\end{env} matching the \\begin{env} at start."""
    b, e = "\\begin{%s}" % env, "\\end{%s}" % env
    depth, i = 0, start
    while True:
        nb, ne = text.find(b, i + 1), text.find(e, i + 1)
        if ne < 0:
            return len(text)
        if 0 <= nb < ne:
            depth += 1
            i = nb
        else:
            if depth == 0:
                return ne + len(e)
            depth -= 1
            i = ne


def expand_inputs(path: Path, root: Path, depth: int = 0) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    if depth > 12:
        return text

    def rep(m):
        name = m.group(1)
        for cand in (root / f"{name}.tex", root / name):
            if cand.is_file():
                return expand_inputs(cand, root, depth + 1)
        return m.group(0)

    return re.sub(r"\\input\{([^}]+)\}", rep, text)


def expand_usc(text: str, root: Path) -> str:
    """Inline \\uscinline/\\uscquote snippets and \\uscshowdiff verbatim diffs."""
    def rep_inline(m):
        stem = m.group(2)
        f = root / "usc_snippets" / f"{stem}.tex"
        return f.read_text(encoding="utf-8", errors="replace") if f.is_file() else ""

    text = re.sub(r"\\(uscinline|uscquote)\{([^}]+)\}", rep_inline, text)

    def rep_diff(m):
        title, rel = m.group(1), m.group(2)
        f = root / rel
        body = f.read_text(encoding="utf-8", errors="replace") if f.is_file() else ""
        return ("\\begin{uscdiff}\n\\begin{boxtitle}%s\\end{boxtitle}\n"
                "\\begin{verbatim}\n%s\n\\end{verbatim}\n\\end{uscdiff}\n" % (title, body))

    return re.sub(r"\\(?:uscshowdiff|uscevolution)\{((?:[^{}]|\{[^{}]*\})*)\}"
                  r"\{([^}]+)\}", rep_diff, text)


def resolve_iffileexists(text: str, root: Path) -> tuple[str, int, int]:
    """Evaluate \\IfFileExists{f}{then}{else} against the working tree.

    pandoc has no notion of this guard and silently drops the whole construct,
    which would cost the manuscript twelve spectral figures.
    """
    out, i, taken, skipped = [], 0, 0, 0
    while True:
        s = text.find("\\IfFileExists", i)
        if s < 0:
            break
        j = s + len("\\IfFileExists")
        try:
            fname, j = brace_span(text, j)
            yes, j = brace_span(text, j)
            no, j = brace_span(text, j)
        except (ValueError, AssertionError, IndexError):
            out.append(text[i:s + 1])
            i = s + 1
            continue
        exists = (root / fname.strip()).is_file()
        if exists:
            taken += 1
        else:
            skipped += 1
        out.append(text[i:s])
        out.append(yes if exists else no)
        i = j
    out.append(text[i:])
    return "".join(out), taken, skipped


def dedupe_labels(text: str) -> list[str]:
    """Make duplicate \\label keys unique, keeping the last (LaTeX \\ref target).

    The manuscript defines fig:per_axis_psd twice; emitting both as the same
    HTML id would be invalid XHTML and breaks the link.
    """
    keys = re.findall(r"\\label\{([^}]*)\}", text)
    dupes = {k for k in keys if keys.count(k) > 1}
    if not dupes:
        return []
    seen: dict[str, int] = {}
    total = {k: keys.count(k) for k in dupes}

    def rep(m):
        k = m.group(1)
        if k not in dupes:
            return m.group(0)
        seen[k] = seen.get(k, 0) + 1
        if seen[k] == total[k]:
            return m.group(0)
        return "\\label{%s__dup%d}" % (k, seen[k])

    return sorted(dupes), re.sub(r"\\label\{([^}]*)\}", rep, text)


def replace_tikz(text: str) -> tuple[str, int]:
    """Swap each tikzpicture for its pre-rendered PNG, in document order."""
    out, i, n = [], 0, 0
    while True:
        s = text.find("\\begin{tikzpicture}", i)
        if s < 0:
            break
        e = env_span(text, s, "tikzpicture")
        out.append(text[i:s])
        out.append("\\includegraphics{tikz/fig-%02d.png}" % n)
        n += 1
        i = e
    out.append(text[i:])
    return "".join(out), n


# --------------------------------------------------------------------------
# Counter simulation
# --------------------------------------------------------------------------

SCAN = re.compile(
    r"\\(part|chapter|section|subsection|subsubsection)\*?\s*(?:\[)?"
    r"|\\appendix\b"
    r"|\\begin\{(figure|table|longtable|equation|align|gather|multline|theorem|conjecture)\*?\}"
    r"|\\end\{(figure|table|longtable|equation|align|gather|multline|theorem|conjecture)\*?\}"
    r"|\\caption\s*(?:\[)?"
    r"|\\label\{([^}]*)\}"
    r"|\\setcounter\{(?P<ctr>chapter|part|section|equation|figure|table)\}"
    r"\{(?P<cval>-?\d+)\}"
    r"|\\\\"
)


def number_document(text: str) -> tuple[dict[str, str], set[str], dict[str, str]]:
    """Return label -> number, sectioning labels, and titles of unnumbered units.

    LaTeX cannot number a starred unit, so a \\label following \\chapter* or
    \\subsection* silently captures whatever counter was last set. The committed
    PDF shows the consequence: "Appendix E.3" and "Section 9.5" both point at
    starred headings. Those labels are recorded with their heading text instead,
    so the EPUB resolves them to the real target.
    """
    numbers: dict[str, str] = {}
    section_labels: set[str] = set()
    starred_titles: dict[str, str] = {}
    pending_title: str | None = None

    part = 0
    chapter = 0
    appendix = False
    sec = subsec = subsubsec = 0
    eq = fig = tab = thm = conj = 0
    stack: list[str] = []          # open numbered environments
    current = ("none", "")         # (kind, printed number) for bare \label
    started_body = False

    def chap_label() -> str:
        if appendix:
            return chr(ord("A") + chapter - 1) if chapter > 0 else "A"
        return str(chapter)

    for m in SCAN.finditer(text):
        tok = m.group(0)
        sect, benv, eenv, lab = m.group(1), m.group(2), m.group(3), m.group(4)

        ctr = m.groupdict().get("ctr")
        if ctr:
            # The manuscript opens with \setcounter{chapter}{-1}: chapter 0 is
            # "System Initialization", so every later number depends on this.
            val = int(m.group("cval"))
            if ctr == "chapter":
                chapter = val
            elif ctr == "part":
                part = val
            elif ctr == "section":
                sec = val
            elif ctr == "equation":
                eq = val
            elif ctr == "figure":
                fig = val
            elif ctr == "table":
                tab = val
            continue

        if tok.startswith("\\appendix"):
            appendix, chapter = True, 0
            continue

        if sect:
            starred = tok[len("\\" + sect):].startswith("*")
            j = m.end()
            if text[m.end() - 1:m.end()] == "[":
                _, j = bracket_span(text, m.end() - 1)
            title = ""
            if j < len(text) and text[j] == "{":
                try:
                    title, _ = brace_span(text, j)
                except ValueError:
                    title = ""
            pending_title = " ".join(title.split()) if starred else None
            if sect == "part":
                part += 1
                current = ("part", ROMAN[part] if part < len(ROMAN) else str(part))
            elif sect == "chapter":
                sec = subsec = subsubsec = 0
                eq = fig = tab = thm = conj = 0
                if starred:
                    current = ("chapter*", "")
                else:
                    chapter += 1
                    started_body = True
                    current = ("chapter", chap_label())
            elif sect == "section":
                subsec = subsubsec = 0
                if not starred:
                    sec += 1
                current = ("section", "%s.%d" % (chap_label(), sec))
            elif sect == "subsection":
                subsubsec = 0
                if not starred:
                    subsec += 1
                current = ("subsection", "%s.%d.%d" % (chap_label(), sec, subsec))
            elif sect == "subsubsection":
                if not starred:
                    subsubsec += 1
                current = ("subsubsection",
                           "%s.%d.%d.%d" % (chap_label(), sec, subsec, subsubsec))
            continue

        if benv:
            stack.append(benv)
            pending_title = None
            if benv in ("equation", "gather", "multline") and "*" not in tok:
                eq += 1
                current = ("equation", "%s.%d" % (chap_label(), eq))
            elif benv == "align" and "*" not in tok:
                eq += 1
                current = ("equation", "%s.%d" % (chap_label(), eq))
            elif benv == "theorem":
                thm += 1
                current = ("theorem", "%s.%d" % (chap_label(), thm))
            elif benv == "conjecture":
                conj += 1
                current = ("conjecture", "%s.%d" % (chap_label(), conj))
            continue

        if eenv:
            if stack and stack[-1] == eenv:
                stack.pop()
            continue

        if tok.startswith("\\caption"):
            pending_title = None
            if "figure" in stack:
                fig += 1
                current = ("figure", "%s.%d" % (chap_label(), fig))
            elif "table" in stack or "longtable" in stack:
                tab += 1
                current = ("table", "%s.%d" % (chap_label(), tab))
            continue

        if tok == "\\\\":
            # An aligned block numbers each row; approximate by advancing inside align.
            if stack and stack[-1] == "align":
                eq += 1
                current = ("equation", "%s.%d" % (chap_label(), eq))
            continue

        if lab is not None:
            kind, num = current
            if pending_title is not None:
                numbers[lab] = ""
                starred_titles[lab] = pending_title
            else:
                numbers[lab] = num
            if kind in ("part", "chapter", "section", "subsection",
                        "subsubsection", "chapter*"):
                section_labels.add(lab)
    return numbers, section_labels, starred_titles


# --------------------------------------------------------------------------
# Rewriting
# --------------------------------------------------------------------------

def rewrite_boxes(text: str) -> str:
    """Preserve optional titles on callout boxes and number theorem environments."""
    for env in BOX_ENVS:
        out, i = [], 0
        b = "\\begin{%s}" % env
        while True:
            s = text.find(b, i)
            if s < 0:
                break
            out.append(text[i:s])
            j = s + len(b)
            title, j = bracket_span(text, j)
            out.append(b + "\n")
            if title:
                out.append("\\begin{boxtitle}%s\\end{boxtitle}\n" % title)
            i = j
        out.append(text[i:])
        text = "".join(out)
    return text


def rewrite_theorems(text: str, numbers: dict[str, str]) -> str:
    for env, word in (("theorem", "Theorem"), ("conjecture", "Conjecture")):
        out, i = [], 0
        b = "\\begin{%s}" % env
        while True:
            s = text.find(b, i)
            if s < 0:
                break
            out.append(text[i:s])
            j = s + len(b)
            title, j = bracket_span(text, j)
            # Recover this environment's number from the label inside it, if any.
            end = env_span(text, s, env)
            lm = re.search(r"\\label\{([^}]*)\}", text[s:end])
            num = numbers.get(lm.group(1), "") if lm else ""
            head = "%s %s" % (word, num) if num else word
            if title:
                head += " (%s)" % title
            out.append(b + "\n\\begin{boxtitle}%s\\end{boxtitle}\n" % head)
            i = j
        out.append(text[i:])
        text = "".join(out)
    return text


def rewrite_tcolorbox(text: str) -> str:
    """Lift `title={...}` out of raw tcolorbox options into a boxtitle."""
    out, i = [], 0
    b = "\\begin{tcolorbox}"
    while True:
        s = text.find(b, i)
        if s < 0:
            break
        out.append(text[i:s])
        j = s + len(b)
        opts, j = bracket_span(text, j)
        title = ""
        if opts:
            tm = re.search(r"title=\{", opts)
            if tm:
                try:
                    title, _ = brace_span(opts, tm.end() - 1)
                except ValueError:
                    title = ""
        out.append(b + "\n")
        if title:
            out.append("\\begin{boxtitle}%s\\end{boxtitle}\n" % title)
        i = j
    out.append(text[i:])
    return "".join(out)


def rewrite_equations(text: str, numbers: dict[str, str]) -> str:
    """Turn numbered display math into a flex row carrying a visible number."""
    for env in ("equation", "align", "gather", "multline"):
        out, i = [], 0
        b = "\\begin{%s}" % env
        while True:
            s = text.find(b, i)
            if s < 0:
                break
            # Skip the starred form.
            if text[s + len(b):s + len(b) + 1] == "*":
                out.append(text[i:s + len(b) + 1])
                i = s + len(b) + 1
                continue
            e = env_span(text, s, env)
            body = text[s + len(b):e - len("\\end{%s}" % env)]
            labels = re.findall(r"\\label\{([^}]*)\}", body)
            body = re.sub(r"\\label\{[^}]*\}", "", body)
            num = numbers.get(labels[0], "") if labels else ""
            inner = body if env == "equation" else \
                "\\begin{aligned}%s\\end{aligned}" % body if env == "align" else body
            chunk = ["\\begin{numeq}\n"]
            for k in labels:
                chunk.append("\\hypertarget{%s}{}\n" % k)
            chunk.append("\\begin{eqbody}\n\\[%s\\]\n\\end{eqbody}\n" % inner)
            if num:
                chunk.append("\\begin{eqnum}(%s)\\end{eqnum}\n" % num)
            chunk.append("\\end{numeq}\n")
            out.append(text[i:s])
            out.append("".join(chunk))
            i = e
        out.append(text[i:])
        text = "".join(out)
    return text


def rewrite_refs(text: str, numbers: dict[str, str], section_labels: set[str],
                 starred_titles: dict[str, str]) -> str:
    def link_text(k: str) -> str:
        num = numbers.get(k, "")
        return num if num else starred_titles.get(k, "??")

    def ref(m):
        k = m.group(1)
        return "\\hyperlink{%s}{%s}" % (k, link_text(k))

    def eqref(m):
        k = m.group(1)
        t = link_text(k)
        return "\\hyperlink{%s}{(%s)}" % (k, t)

    text = re.sub(r"\\eqref\{([^}]*)\}", eqref, text)
    text = re.sub(r"\\(?:auto)?ref\{([^}]*)\}", ref, text)
    text = re.sub(r"\\hyperref\[([^\]]*)\]", lambda m: "\\hyperlink{%s}" % m.group(1), text)

    # Non-sectioning labels become explicit anchors; pandoc already uses a
    # sectioning \label as the heading id.
    def lab(m):
        k = m.group(1)
        return m.group(0) if k in section_labels else "\\hypertarget{%s}{}" % k

    return re.sub(r"\\label\{([^}]*)\}", lab, text)


TIKZ_PREAMBLE = r"""\documentclass[border=6pt]{standalone}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{amsmath,amssymb}
\usepackage{xcolor}
\usepackage{tikz}
\usetikzlibrary{shapes,positioning,calc,decorations.pathreplacing,patterns,%
shapes.geometric,arrows.meta}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\usepgfplotslibrary{fillbetween}
\usepackage{enumitem}
% The pictures size themselves off the book's text block, which `standalone`
% does not define.
\setlength{\textwidth}{6.3in}
\setlength{\linewidth}{6.3in}
\setlength{\columnwidth}{6.3in}
\renewcommand{\cite}[1]{}
\providecommand{\SourceNote}[1]{}
\begin{document}
"""


def emit_tikz(paper: Path, outdir: Path) -> int:
    """Write each tikzpicture as a standalone document for separate compilation.

    Order matches replace_tikz(), so fig-NN.png lines up with the NNth picture.
    """
    outdir.mkdir(parents=True, exist_ok=True)
    text = expand_inputs(paper / "The_Original_Power.tex", paper)
    n, i = 0, 0
    while True:
        s = text.find("\\begin{tikzpicture}", i)
        if s < 0:
            break
        e = env_span(text, s, "tikzpicture")
        (outdir / ("fig-%02d.tex" % n)).write_text(
            TIKZ_PREAMBLE + text[s:e] + "\n\\end{document}\n", encoding="utf-8")
        n += 1
        i = e
    return n


def main() -> int:
    if sys.argv[1] == "--emit-tikz":
        n = emit_tikz(Path(sys.argv[3]).resolve(), Path(sys.argv[2]).resolve())
        print("tikz standalone files : %d" % n)
        return 0

    paper = Path(sys.argv[1]).resolve()
    build = Path(sys.argv[2]).resolve()
    build.mkdir(parents=True, exist_ok=True)

    full = expand_inputs(paper / "The_Original_Power.tex", paper)
    full, n_tikz = replace_tikz(full)
    full = expand_usc(full, paper)
    full, n_kept, n_dropped = resolve_iffileexists(full, paper)

    # Number the body only: the preamble mentions \chapter inside \titleformat
    # and \titlespacing, which would otherwise advance the chapter counter.
    start = full.find("\\begin{document}") + len("\\begin{document}")
    text = full[start:full.rfind("\\end{document}")]

    dupes, text = dedupe_labels(text) or ([], text)

    numbers, section_labels, starred_titles = number_document(text)

    text = rewrite_equations(text, numbers)
    text = rewrite_theorems(text, numbers)
    text = rewrite_boxes(text)
    text = rewrite_tcolorbox(text)
    text = rewrite_refs(text, numbers, section_labels, starred_titles)

    for pat in STRIP_CMDS:
        text = re.sub(pat, "", text)

    # Vector figures are pre-rasterised by epub_build.sh: EPUB readers cannot
    # display a PDF image.
    def repoint(m):
        opts, tgt = m.group(1) or "", m.group(2)
        if tgt.startswith("figures/") and tgt.endswith(".pdf"):
            tgt = "img/" + tgt[len("figures/"):-4] + ".png"
        return "\\includegraphics%s{%s}" % (opts, tgt)

    text = re.sub(r"\\includegraphics(\[[^\]]*\])?\{([^}]+)\}", repoint, text)

    # The Ge'ez operator ships as a PDF glyph for print; EPUB uses the codepoint.
    # \\b will not do here: \TT is nearly always followed by "_", a word character.
    text = re.sub(r"\\TT(?![A-Za-z])", r"\\mathord{\\text{ተ}}", text)

    # texmath rejects these inside math; both are typography, not notation.
    text = re.sub(r"\$\s*\\S\s*\$", "§", text)
    text = re.sub(r"\\text\{([^{}]*)\}",
                  lambda m: "\\text{%s}" % m.group(1).replace("\\,", "\u2009"), text)

    body = text

    preamble = "\n".join([
        r"\newcommand{\SourceNote}[1]{\footnote{#1}}",
        r"\providecommand{\tightlist}{}",
        r"\providecommand{\USCTag}{annual/2025}",
        r"\providecommand{\usclink}[2]{\hyperlink{#1}{#2}}",
        "", ""])

    (build / "body.tex").write_text(preamble + body, encoding="utf-8")

    unresolved = sum(1 for k in re.findall(r"\\hyperlink\{([^}]*)\}", text)
                     if k not in numbers)
    print("tikz figures replaced : %d" % n_tikz)
    print("labels numbered       : %d" % len(numbers))
    print("  sectioning labels   : %d" % len(section_labels))
    print("unresolved hyperlinks : %d" % unresolved)
    print("starred targets fixed : %d" % len(starred_titles))
    print("IfFileExists kept/drop: %d / %d" % (n_kept, n_dropped))
    print("duplicate labels fixed: %s" % (", ".join(dupes) if dupes else "none"))
    print("body chars            : %d" % len(body))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
