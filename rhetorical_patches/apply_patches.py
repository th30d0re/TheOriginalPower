#!/usr/bin/env python3
"""Apply rhetorical patch chunks to Paper/The_Original_Power.tex.

Chunks are 1-indexed line ranges from the original file. The only preserved
gap is lines 314-319 (between front matter and Chapter 0).
"""

from pathlib import Path

ROOT = Path("/Users/emmanuel/Documents/Theory/Redefining_racism")
ORIG = ROOT / "Paper" / "The_Original_Power.tex"
PATCH_DIR = ROOT / "rhetorical_patches"
OUT = ORIG  # edit in place; rollback is at commit cb0f8b5

CHUNKS = [
    (1, 313, "chunk_01.tex"),
    (320, 1214, "chunk_02.tex"),
    (1215, 2429, "chunk_03.tex"),
    (2430, 3545, "chunk_04.tex"),
    (3546, 4053, "chunk_05.tex"),
    (4054, 4473, "chunk_06.tex"),
    (4474, 4894, "chunk_07.tex"),
    (4895, 6143, "chunk_08.tex"),
    (6144, 7842, "chunk_09.tex"),
    (7843, 9385, "chunk_10.tex"),
    (9386, 10536, "chunk_11.tex"),
    (10537, 11589, "chunk_12.tex"),
    (11590, 12887, "chunk_13.tex"),
    (12888, 14357, "chunk_14.tex"),
    (14358, 14903, "chunk_15.tex"),
    (14904, 15615, "chunk_16.tex"),
]


def read_lines(path: Path) -> list[str]:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().splitlines(keepends=True)


def main() -> None:
    original = read_lines(ORIG)
    if len(original) != 15615:
        raise ValueError(f"Expected 15615 lines, got {len(original)}")

    # Build new content.  Chunk ranges are 1-indexed inclusive.
    new: list[str] = []
    last_end = 0  # 0-indexed exclusive boundary of last emitted line

    for start_1, end_1, chunk_name in CHUNKS:
        start_0 = start_1 - 1
        # Preserve any original lines between the previous chunk and this one.
        if start_0 > last_end:
            new.extend(original[last_end:start_0])
        chunk_lines = read_lines(PATCH_DIR / chunk_name)
        new.extend(chunk_lines)
        last_end = end_1  # 0-indexed exclusive

    # Append any trailing original lines (should be none).
    if last_end < len(original):
        new.extend(original[last_end:])

    with open(OUT, "w", encoding="utf-8") as f:
        f.writelines(new)

    print(f"Wrote {len(new)} lines to {OUT}")


if __name__ == "__main__":
    main()
