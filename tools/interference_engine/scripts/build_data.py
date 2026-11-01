#!/usr/bin/env python3
"""Collect the spectral proxy series for the Interference Engine page.

Reads the three processed CSVs that Paper/scripts/spectral_fourier.ipynb uses
and writes one compact JSON file. With --embed, also rewrites the single
`var DATA=` line in the page so the page stays self-contained.

Usage:
  python3 tools/interference_engine/scripts/build_data.py Paper/data \
      tools/interference_engine/data/spectral_inputs.json \
      --embed tools/interference_engine/interference_engine.html
"""
import csv
import json
import sys
from pathlib import Path


def rows(path):
    with open(path, newline="") as fh:
        lines = [ln for ln in fh if ln.strip() and not ln.startswith("#")]
    return list(csv.DictReader(lines))


def main(argv):
    if len(argv) < 3:
        sys.exit(__doc__)
    data_dir, out = Path(argv[1]), Path(argv[2])
    gt = rows(data_dir / "google_trends_class_identity.csv")
    cr = rows(data_dir / "congressional_record_word_freq.csv")
    an = rows(data_dir / "anes_issue_salience.csv")
    payload = {
        "gt": {
            "start": gt[0]["date"],
            "dates": [r["date"] for r in gt],
            "cls": [float(r["class_signal_index"]) for r in gt],
            "idn": [float(r["identity_signal_index"]) for r in gt],
        },
        "cr": {
            "years": [int(r["year"]) for r in cr],
            "cls": [int(r["class_word_freq"]) for r in cr],
            "idn": [int(r["identity_word_freq"]) for r in cr],
        },
        "anes": {
            "years": [int(r["year"]) for r in an],
            "econ": [float(r["econ_salience_pct"]) for r in an],
            "race": [float(r["race_salience_pct"]) for r in an],
            "sol": [float(r["cross_group_solidarity_pct"]) for r in an],
        },
    }
    text = json.dumps(payload, separators=(",", ":"))
    out.write_text(text + "\n")
    print(f"wrote {out} ({len(text)} bytes): gt {len(gt)}, cr {len(cr)}, anes {len(an)} rows")
    if len(argv) >= 5 and argv[3] == "--embed":
        page = Path(argv[4])
        lines = page.read_text().split("\n")
        hits = [i for i, ln in enumerate(lines) if ln.startswith("var DATA=")]
        if len(hits) != 1:
            sys.exit(f"expected one 'var DATA=' line in {page}, found {len(hits)}")
        lines[hits[0]] = "var DATA=" + text + ";"
        page.write_text("\n".join(lines))
        print(f"embedded into {page}")


if __name__ == "__main__":
    main(sys.argv)
