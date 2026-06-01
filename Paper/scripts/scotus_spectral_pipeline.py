#!/usr/bin/env python3
"""
scotus_spectral_pipeline.py

One-command pipeline to run the full SCOTUS spectral analysis chain on the
expanded corpus (or any corpus state).

Steps:
    1. Annualize: extract text, count keywords, aggregate by year.
    2. FFT Periodogram: interpolated uniform-grid spectral analysis.
    3. Lomb-Scargle: native non-uniform spectral analysis.
    4. Summary report: key metrics, dominant periods, electoral power.

Usage:
    cd Paper && python3 scripts/scotus_spectral_pipeline.py
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SCRIPTS = [
    ("Annualize", ROOT / "scripts" / "scotus_annualize.py"),
    ("FFT", ROOT / "scripts" / "scotus_annual_fft.py"),
    ("Lomb-Scargle", ROOT / "scripts" / "scotus_lomb_scargle.py"),
]

RESULT_FILES = {
    "fft": ROOT / "data" / "scotus_annual_fft_results.json",
    "lomb": ROOT / "data" / "scotus_lomb_scargle_results.json",
}


def run_step(name: str, script: Path) -> bool:
    print(f"\n{'='*60}")
    print(f"STEP: {name}")
    print(f"{'='*60}")
    if not script.exists():
        print(f"ERROR: script not found: {script}")
        return False
    result = subprocess.run([sys.executable, str(script)], cwd=ROOT)
    return result.returncode == 0


def print_summary() -> None:
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")

    for label, path in [("FFT", RESULT_FILES["fft"]), ("Lomb-Scargle", RESULT_FILES["lomb"])]:
        if not path.exists():
            print(f"\n{label}: results not found ({path})")
            continue
        with open(path) as f:
            data = json.load(f)
        print(f"\n{label}:")
        print(f"  Samples: {data.get('n_samples', 'N/A')}")
        print(f"  Year range: {data.get('year_range', 'N/A')}")
        print(f"  Dominant periods: {data.get('dominant_periods', {})}")
        if "electoral_power" in data:
            print(f"  Electoral power ratios:")
            for ename, ep in data["electoral_power"].items():
                if isinstance(ep, dict) and "ratio" in ep:
                    print(f"    {ename}: Identity/Class = {ep['ratio']:.2f}")


def main() -> int:
    all_ok = True
    for name, script in SCRIPTS:
        if not run_step(name, script):
            all_ok = False
            print(f"WARNING: {name} step failed; continuing...")

    print_summary()

    if all_ok:
        print(f"\n{'='*60}")
        print("PIPELINE COMPLETE")
        print(f"{'='*60}")
        return 0
    else:
        print(f"\n{'='*60}")
        print("PIPELINE COMPLETE WITH WARNINGS")
        print(f"{'='*60}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
