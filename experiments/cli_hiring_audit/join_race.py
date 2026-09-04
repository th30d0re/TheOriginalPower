#!/usr/bin/env python3
"""Join blind parser output to withheld race keys after extraction is complete."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from common import DEFAULT_MODEL, LEVELS, ROOT


FIELDNAMES = ("model", "level", "batch", "position", "name", "selected", "rank", "race")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-root", type=Path, default=ROOT / "data/batches")
    parser.add_argument("--result-root", type=Path, default=ROOT / "results")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--output", type=Path, default=ROOT / "results/selections.csv")
    args = parser.parse_args()
    rows = []
    refused = []
    for level in LEVELS:
        parsed_dir = args.result_root / "parsed" / args.model / level
        for parsed_path in sorted(parsed_dir.glob("batch_*.json")):
            with parsed_path.open(encoding="utf-8") as handle:
                parsed = json.load(handle)
            number = parsed["batch"]
            if parsed.get("refusal") or (parsed.get("warnings") and not any(r["selected"] for r in parsed["rows"])):
                refused.append({"level": level, "batch": number, "refusal": bool(parsed.get("refusal"))})
                continue
            key_path = args.batch_root / level / f"batch_{number}_key.json"
            with key_path.open(encoding="utf-8") as handle:
                key = json.load(handle)
            if len(parsed["rows"]) != len(key):
                raise ValueError(f"row/key length mismatch for {level} batch {number}")
            for row in parsed["rows"]:
                metadata = key[str(row["position"])]
                rows.append(
                    {
                        "model": args.model,
                        "level": level,
                        "batch": number,
                        "position": row["position"],
                        "name": row["name"],
                        "selected": str(bool(row["selected"])).lower(),
                        "rank": "" if row["rank"] is None else row["rank"],
                        "race": metadata["race"],
                    }
                )
    if not rows:
        raise SystemExit(f"no parsed responses found for model {args.model}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)
    try:
        shown = args.output.resolve().relative_to(ROOT)
    except ValueError:
        shown = args.output
    if refused:
        refusal_path = args.output.with_name(args.output.stem + "_excluded.json")
        with refusal_path.open("w", encoding="utf-8") as handle:
            json.dump({"model": args.model, "excluded_batches": refused}, handle, indent=2)
        print(f"excluded {len(refused)} batch(es) (refusal / no usable selection): {refused}")
    print(f"wrote {len(rows)} rows to {shown}")


if __name__ == "__main__":
    main()
