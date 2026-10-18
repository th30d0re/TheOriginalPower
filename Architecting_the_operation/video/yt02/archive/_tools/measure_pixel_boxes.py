#!/usr/bin/env python3
"""Union bounding box for OCR words matching a phrase (tesseract TSV)."""
import csv
import subprocess
import sys
from pathlib import Path


def tesseract_tsv(image: Path) -> list[dict]:
    proc = subprocess.run(
        ["tesseract", str(image), "stdout", "tsv"],
        capture_output=True,
        text=True,
        check=True,
    )
    rows = []
    reader = csv.DictReader(proc.stdout.splitlines(), delimiter="\t")
    for row in reader:
        if row.get("level") != "5":
            continue
        try:
            rows.append(
                {
                    "text": row["text"],
                    "left": int(row["left"]),
                    "top": int(row["top"]),
                    "width": int(row["width"]),
                    "height": int(row["height"]),
                }
            )
        except (KeyError, ValueError):
            continue
    return rows


def union_box(words: list[dict]) -> tuple[int, int, int, int] | None:
    if not words:
        return None
    left = min(w["left"] for w in words)
    top = min(w["top"] for w in words)
    right = max(w["left"] + w["width"] for w in words)
    bottom = max(w["top"] + w["height"] for w in words)
    return left, top, right - left, bottom - top


def match_phrase(words: list[dict], phrase_tokens: list[str]) -> list[dict]:
    """Greedy match consecutive non-empty tokens (case-insensitive)."""
    texts = [w["text"].strip() for w in words if w["text"].strip()]
    joined = " ".join(texts).lower()
    phrase = " ".join(phrase_tokens).lower()
    if phrase not in joined:
        # sliding window on word list
        ptoks = [t.lower() for t in phrase_tokens]
        for i in range(len(words) - len(ptoks) + 1):
            window = words[i : i + len(ptoks)]
            wt = [w["text"].strip().lower() for w in window if w["text"].strip()]
            if len(wt) >= len(ptoks) and all(
                wt[j].startswith(ptoks[j][:3]) or ptoks[j].startswith(wt[j][:3])
                for j in range(min(len(wt), len(ptoks)))
            ):
                return window
        return []
    # map phrase back to word boxes: find start index in words list
    needle = phrase_tokens[0].lower()
    for i, w in enumerate(words):
        if w["text"].strip().lower().startswith(needle[:4]):
            chunk = []
            j = i
            for tok in phrase_tokens:
                while j < len(words) and not words[j]["text"].strip():
                    j += 1
                if j >= len(words):
                    break
                chunk.append(words[j])
                j += 1
            if len(chunk) == len(phrase_tokens):
                return chunk
    return []


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: measure_pixel_boxes.py <image> <phrase words...>", file=sys.stderr)
        sys.exit(2)
    image = Path(sys.argv[1])
    phrase = sys.argv[2:]
    words = tesseract_tsv(image)
    # use all level-5 words in order
    nonempty = [w for w in words if w["text"].strip()]
    matched = match_phrase(nonempty, phrase)
    box = union_box(matched)
    print(f"matched {len(matched)} words: {[w['text'] for w in matched]}")
    print(f"box {box}")


if __name__ == "__main__":
    main()
