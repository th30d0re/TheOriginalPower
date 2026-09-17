"""List a chapter's citations and flag the ones with audio we could play.

    python3 tools/chapter_audio_sources.py "Redefining Racism"
    python3 tools/chapter_audio_sources.py "Redefining Racism" --out notes/CH2_audio_sources.md

Finds the chapter in Paper/The_Original_Power.tex by title (never by line
number, since those drift), collects every \\cite key inside it, looks each up
in Paper/references.bib, and sorts them into:

  * audio likely: the entry itself is a recording, interview, podcast, speech,
    hearing, broadcast, or a video/audio link.
  * audio possible: the chapter quotes the source as something said aloud
    (interview, testimony, speech, "described", "said"), so a recording may
    exist even though the citation is to print.
  * print: everything else.

A flag is a lead, not a finding. Confirm the recording exists, and check the
exact words, before a clip goes in a script (tools/make_clip.py).
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEX = ROOT / "Paper" / "The_Original_Power.tex"
BIB = ROOT / "Paper" / "references.bib"

_AUDIO_WORDS = re.compile(
    r"podcast|interview|speech|address|testimony|hearing|radio|broadcast|recording|"
    r"audio|video|lecture|debate|remarks|oral history|episode|youtube|youtu\.be|vimeo|"
    r"c-span|npr|soundcloud|spotify|apple podcasts|archive\.org",
    re.I,
)
_SPOKEN_CONTEXT = re.compile(
    r"interview|testimony|testified|speech|remarked|admitted|admission|confess|"
    r"broadcast|in his own words|in her own words|podcast|on air|address to",
    re.I,
)
# A quotation introduced as something a named person said, with no citation
# nearby. Speeches and famous remarks are often quoted this way.
_UNCITED_QUOTE = re.compile(
    r"((?:[A-Z][\w.'-]*)(?:\s+[A-Z][\w.'-]*){0,3})\s+(?:[a-z]\w*\s+){0,2}"
    r"(?:said|observed|declared|stated|remarked|told|warned|asked|put it)[^`]{0,40}``([^']{10,220})''"
)


def chapter_text(title: str) -> str:
    tex = TEX.read_text()
    starts = [(m.start(), m.group(1)) for m in re.finditer(r"^\\chapter\{(.+?)\}\s*$", tex, re.M)]
    for i, (pos, name) in enumerate(starts):
        if title.lower() in name.lower():
            end = starts[i + 1][0] if i + 1 < len(starts) else len(tex)
            return tex[pos:end]
    raise SystemExit(f"no chapter title contains {title!r}")


def parse_bib() -> dict[str, dict[str, str]]:
    entries: dict[str, dict[str, str]] = {}
    for match in re.finditer(r"@(\w+)\s*\{\s*([^,\s]+)\s*,(.*?)\n\}", BIB.read_text(), re.S):
        kind, key, body = match.groups()
        fields = {"type": kind.lower()}
        for field in re.finditer(r"(\w+)\s*=\s*[{\"](.*?)[}\"]\s*,?\s*$", body, re.M):
            fields[field.group(1).lower()] = re.sub(r"[{}]", "", field.group(2)).strip()
        entries[key] = fields
    return entries


def cite_contexts(text: str) -> dict[str, list[str]]:
    contexts: dict[str, list[str]] = {}
    for match in re.finditer(r"\\cite[pt]?\*?(?:\[[^\]]*\])*\{([^}]+)\}", text):
        window = text[max(0, match.start() - 300) : match.start()]
        for key in (k.strip() for k in match.group(1).split(",")):
            contexts.setdefault(key, []).append(window)
    return contexts


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", help="Part of the chapter title.")
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    text = chapter_text(args.chapter)
    bib = parse_bib()
    contexts = cite_contexts(text)

    likely, possible, printed, missing = [], [], [], []
    for key, windows in sorted(contexts.items()):
        entry = bib.get(key)
        if entry is None:
            missing.append(key)
            continue
        described = " ".join(entry.get(f, "") for f in ("type", "title", "howpublished", "url", "note", "journal", "publisher"))
        label = f"{entry.get('author', '?')}. {entry.get('title', '?')}"
        where = entry.get("url") or entry.get("howpublished") or entry.get("journal") or entry.get("publisher", "")
        row = (key, label, where, len(windows))
        if _AUDIO_WORDS.search(described):
            likely.append(row)
        elif any(_SPOKEN_CONTEXT.search(w[-120:]) for w in windows):
            possible.append(row)
        else:
            printed.append(row)

    lines = [f"# Audio source leads: {args.chapter}", "",
             f"{len(contexts)} cited sources. Flags are leads; confirm the recording and the exact words before clipping.", ""]
    for heading, rows in (("Audio likely", likely), ("Audio possible", possible)):
        lines += [f"## {heading} ({len(rows)})", "", "| key | source | where | cites |", "|---|---|---|---|"]
        lines += [f"| `{k}` | {l} | {w} | {n} |" for k, l, w, n in rows]
        lines.append("")
    uncited = []
    for match in _UNCITED_QUOTE.finditer(text):
        if "\\cite" not in text[match.end() : match.end() + 250]:
            uncited.append((match.group(1), match.group(2)))
    lines += [f"## Quoted speakers with no citation ({len(uncited)})", "",
              "Often speeches or remarks; worth a search for the recording.", ""]
    for who, quote in uncited:
        clean = re.sub(r"\\text\w+|[{}\\]", "", quote)[:120]
        lines.append(f"- **{who}**: \u201c{clean}\u201d")
    lines.append("")
    lines += [f"## Print only ({len(printed)})", "", ", ".join(f"`{k}`" for k, *_ in printed), ""]
    if missing:
        lines += [f"## Cited but missing from references.bib ({len(missing)})", "", ", ".join(f"`{k}`" for k in missing), ""]
    report = "\n".join(lines)
    if args.out:
        args.out.write_text(report)
        print(f"wrote {args.out}")
    print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
