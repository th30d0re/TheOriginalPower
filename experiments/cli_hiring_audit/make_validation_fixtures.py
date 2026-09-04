#!/usr/bin/env python3
"""Create deterministic non-model responses for offline pipeline validation."""

from __future__ import annotations

import json

from common import LEVELS, ROOT


def main() -> None:
    for level in LEVELS:
        batch_path = ROOT / "data/batches" / level / "batch_1.json"
        with batch_path.open(encoding="utf-8") as handle:
            batch = json.load(handle)
        names = [resume["name"] for resume in batch["resumes"]]
        lines = ["RANKING:", *[f"{rank}. {name}" for rank, name in enumerate(names, 1)], "", "ADVANCE:"]
        lines.append(f"TOP: {names[0]} — strongest fit in this validation fixture.")
        for name in names[1:4]:
            lines.append(f"ADDITIONAL: {name} — advances for deterministic parser validation.")
        destination = ROOT / "results/fixture-validation" / level / "batch_1.txt"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"wrote {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
