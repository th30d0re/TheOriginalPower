#!/usr/bin/env python3
"""Build the equation catalog from the recursively expanded manuscript."""
from __future__ import annotations

import bisect
import glob
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent
PAPER_ROOT = REPO_ROOT / "Paper"
MANUSCRIPT = PAPER_ROOT / "The_Original_Power.tex"
CHUNKS = REPO_ROOT / "equation_audit_chunks"
OUT = ROOT / "data" / "equations.json"
MAX_INCLUDE_DEPTH = 32

LABEL_RE = re.compile(r"\\label\{([^}]*)\}")
ENV_RE = re.compile(
    r"\\begin\{((?:equation|align|gather|multline|eqnarray)\*?)\}"
    r"(.*?)\\end\{\1\}",
    re.DOTALL,
)
HEADING_RE = re.compile(r"\\(chapter|section|subsection)\*?\{")
INPUT_RE = re.compile(r"\\input\{([^}]+)\}")
ENV_WRAPPER_RE = re.compile(
    r"\\begin\{(equation|align|gather|multline|eqnarray)\*?\}"
    r"|\\end\{(equation|align|gather|multline|eqnarray)\*?\}"
)
BROKEN_BREAK_RE = re.compile(r"\\(\d+(?:\.\d+)?(?:pt|em|ex))\]")
UNTERMINATED_BREAK_RE = re.compile(r"(\\\\\[\d+(?:\.\d+)?(?:pt|em|ex))(?!\])")
ENV_SPAN_RE = re.compile(r"\\begin\{(\w+\*?)\}.*?\\end\{\1\}", re.DOTALL)


@dataclass(frozen=True)
class SourceSegment:
    text: str
    path: Path
    line: int


def uncommented_prefix(line: str) -> str:
    """Return the part before the first unescaped LaTeX comment marker."""
    for index, character in enumerate(line):
        if character == "%" and (index == 0 or line[index - 1] != "\\"):
            return line[:index]
    return line


def resolve_include(name: str) -> Path | None:
    candidate = (PAPER_ROOT / name).resolve()
    choices = (candidate, Path(f"{candidate}.tex"))
    for choice in choices:
        if choice.is_file() and (choice == PAPER_ROOT or PAPER_ROOT in choice.parents):
            return choice
    return None


def expand_inputs(
    path: Path,
    skipped: list[dict[str, object]],
    stack: tuple[Path, ...] = (),
    depth: int = 0,
) -> list[SourceSegment]:
    """Expand input commands while retaining physical-file provenance."""
    path = path.resolve()
    if depth > MAX_INCLUDE_DEPTH:
        skipped.append({"file": relative_source(path), "line": 0, "input": "", "reason": "maximum depth exceeded"})
        return []

    segments: list[SourceSegment] = []
    active_stack = stack + (path,)
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(keepends=True), 1):
        searchable = uncommented_prefix(line)
        cursor = 0
        for match in INPUT_RE.finditer(searchable):
            if match.start() > cursor:
                segments.append(SourceSegment(line[cursor:match.start()], path, line_number))
            target = resolve_include(match.group(1))
            if target is None:
                skipped.append({"file": relative_source(path), "line": line_number, "input": match.group(1), "reason": "unresolvable"})
            elif target in active_stack:
                skipped.append({"file": relative_source(path), "line": line_number, "input": match.group(1), "reason": "cycle"})
            else:
                segments.extend(expand_inputs(target, skipped, active_stack, depth + 1))
            cursor = match.end()
        if cursor < len(line):
            segments.append(SourceSegment(line[cursor:], path, line_number))
    return segments


def relative_source(path: Path) -> str:
    try:
        return path.resolve().relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def clean_latex(raw: str) -> str:
    tex = LABEL_RE.sub("", raw)
    tex = ENV_WRAPPER_RE.sub("", tex)
    tex = BROKEN_BREAK_RE.sub(r"\\\\[\1", tex)
    tex = UNTERMINATED_BREAK_RE.sub(r"\1]", tex)
    tex = tex.strip()
    if "&" in ENV_SPAN_RE.sub("", tex):
        tex = "\\begin{aligned}\n" + tex + "\n\\end{aligned}"
    return tex.strip()


def clean_legacy_latex(raw: str) -> str:
    """Retain the established byte representation for audited equations."""
    tex = LABEL_RE.sub("", raw)
    tex = ENV_WRAPPER_RE.sub("", tex)
    tex = BROKEN_BREAK_RE.sub(r"\\\\[\1", tex)
    tex = UNTERMINATED_BREAK_RE.sub(r"\1]", tex)
    if "&" in ENV_SPAN_RE.sub("", tex):
        tex = "\\begin{aligned}\n" + tex + "\n\\end{aligned}"
    return tex.strip()


def braced_argument(text: str, opening_brace: int) -> tuple[str, int]:
    depth = 0
    for index in range(opening_brace, len(text)):
        if text[index] == "{":
            depth += 1
        elif text[index] == "}":
            depth -= 1
            if depth == 0:
                return text[opening_brace + 1:index], index + 1
    return text[opening_brace + 1:], len(text)


def heading_events(text: str) -> list[tuple[int, str, str]]:
    events = []
    for match in HEADING_RE.finditer(text):
        title, _end = braced_argument(text, match.end() - 1)
        events.append((match.start(), match.group(1), title.strip()))
    return events


def legacy_catalog() -> tuple[dict[str, str], dict[str, str], int]:
    by_label: dict[str, str] = {}
    latex_by_label: dict[str, str] = {}
    maximum = 0
    for path in sorted(glob.glob(str(CHUNKS / "*.json"))):
        with open(path, encoding="utf-8") as handle:
            for record in json.load(handle):
                by_label[record.get("label", "")] = record["id"]
                latex_by_label[record.get("label", "")] = clean_legacy_latex(record.get("rendered") or record.get("raw_latex", ""))
                match = re.fullmatch(r"E(\d+)", record["id"])
                if match:
                    maximum = max(maximum, int(match.group(1)))
    return by_label, latex_by_label, maximum


def main() -> None:
    skipped: list[dict[str, object]] = []
    segments = expand_inputs(MANUSCRIPT, skipped)
    text = "".join(segment.text for segment in segments)
    starts: list[int] = []
    offset = 0
    for segment in segments:
        starts.append(offset)
        offset += len(segment.text)

    headings = heading_events(text)
    heading_index = 0
    chapter = "Front Matter"
    section = ""
    chapter_order: list[str] = []
    old_ids, old_latex, next_id = legacy_catalog()
    used_ids: set[str] = set()
    equations = []

    for match in ENV_RE.finditer(text):
        while heading_index < len(headings) and headings[heading_index][0] < match.start():
            _position, kind, title = headings[heading_index]
            if kind == "chapter":
                chapter = title
                section = ""
                if chapter not in chapter_order:
                    chapter_order.append(chapter)
            else:
                section = title
            heading_index += 1

        body = match.group(2)
        label_match = LABEL_RE.search(body)
        label = label_match.group(1) if label_match else ""
        legacy_id = old_ids.get(label)
        if legacy_id is not None and legacy_id not in used_ids:
            equation_id = legacy_id
        else:
            next_id += 1
            equation_id = f"E{next_id:03d}"
        used_ids.add(equation_id)

        segment_index = max(0, bisect.bisect_right(starts, match.start()) - 1)
        source = segments[segment_index]
        if chapter not in chapter_order:
            chapter_order.append(chapter)
        fresh_latex = clean_latex(body)
        legacy_latex = old_latex.get(label)
        latex = legacy_latex if (
            legacy_latex is not None
            and re.sub(r"\s+", "", legacy_latex) == re.sub(r"\s+", "", fresh_latex)
        ) else fresh_latex
        equations.append({
            "id": equation_id,
            "chapter": chapter,
            "section": section,
            "label": label,
            "line": source.line,
            "sourceFile": relative_source(source.path),
            "latex": latex,
        })

    chapter_index = {title: index for index, title in enumerate(chapter_order)}
    for equation in equations:
        equation["chapterIndex"] = chapter_index[equation["chapter"]]

    chapters = [{"index": index, "title": title} for title, index in chapter_index.items()]
    payload = {
        "build": {
            "rootFile": relative_source(MANUSCRIPT),
            "expandedCharacters": len(text),
            "skippedIncludes": skipped,
        },
        "chapters": chapters,
        "equations": equations,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"wrote {len(equations)} equations across {len(chapters)} chapters -> {OUT}")
    if skipped:
        print("skipped includes:")
        for item in skipped:
            print(f"- {item['file']}:{item['line']} input={item['input']!r} reason={item['reason']}")
    else:
        print("skipped includes: none")


if __name__ == "__main__":
    main()
