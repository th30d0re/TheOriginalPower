#!/usr/bin/env python3
"""
Stratified bulk download of U.S. Supreme Court opinion PDFs from Internet Archive.

Fetches the COMPLETE metadata catalog for the 'us-supreme-court' collection
(125K+ items) in a single query, then samples stratified by year bins to ensure
temporal coverage for spectral analysis. Downloads only the selected items.

Usage:
    cd Paper && python3 scripts/download_ia_scotus_stratified.py [--total N] [--seed S]

Resumes automatically: skips items already present in the output directory.
"""
from __future__ import annotations

import argparse
import json
import random
import subprocess
import sys
import time
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "research" / "ia_scotus_pdfs_bulk"
MANIFEST_PATH = OUT_DIR / "stratified_manifest.json"
META_CACHE_PATH = OUT_DIR / "ia_scotus_full_catalog.json"

ADV_SEARCH = "https://archive.org/advancedsearch.php"
META_URL = "https://archive.org/metadata/{identifier}"
DOWNLOAD_URL = "https://archive.org/download/{identifier}/{filename}"

HEADERS = {"User-Agent": "Mozilla/5.0 (TheOriginalPower/1.0; research@example.com)"}

# Temporal bins for stratified sampling (year inclusive)
YEAR_BINS = [
    (1830, 1850),
    (1851, 1875),
    (1876, 1900),
    (1901, 1925),
    (1926, 1950),
    (1951, 1975),
    (1976, 2000),
    (2001, 2024),
]


def fetch_full_catalog() -> list[dict]:
    """Fetch all 125K+ metadata records in a single query."""
    if META_CACHE_PATH.exists():
        print(f"Using cached catalog: {META_CACHE_PATH}")
        with open(META_CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    print("Fetching full catalog from Internet Archive (125K+ items)...")
    params = "q=collection:us-supreme-court&fl=identifier,title,year&rows=130000&start=0&output=json"
    url = f"{ADV_SEARCH}?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    docs = data.get("response", {}).get("docs", [])
    print(f"  Received {len(docs)} items")

    META_CACHE_PATH.write_text(json.dumps(docs, indent=2), encoding="utf-8")
    print(f"  Cached to {META_CACHE_PATH}")
    return docs


def sample_by_year_bins(docs: list[dict], total_target: int, seed: int) -> list[dict]:
    """Stratified random sample across year bins."""
    random.seed(seed)

    # Group docs by year bin
    bin_docs: dict[tuple[int, int], list[dict]] = defaultdict(list)
    unbinned = 0
    for doc in docs:
        year = doc.get("year")
        if year is None:
            unbinned += 1
            continue
        for start, end in YEAR_BINS:
            if start <= year <= end:
                bin_docs[(start, end)].append(doc)
                break

    print(f"Catalog coverage: {len(docs)} total, {unbinned} without year")
    for b in YEAR_BINS:
        print(f"  {b[0]}-{b[1]}: {len(bin_docs[b])} items")

    # Calculate per-bin target
    n_bins = len(YEAR_BINS)
    base_per_bin = total_target // n_bins
    remainder = total_target % n_bins

    selected: list[dict] = []
    for i, b in enumerate(YEAR_BINS):
        target = base_per_bin + (1 if i < remainder else 0)
        available = bin_docs[b]
        if len(available) <= target:
            sample = available
            print(f"  [{b[0]}-{b[1]}] sampling ALL {len(available)} (target was {target})")
        else:
            sample = random.sample(available, target)
            print(f"  [{b[0]}-{b[1]}] sampled {target} from {len(available)}")
        selected.extend(sample)

    random.shuffle(selected)
    return selected


def get_primary_pdf(identifier: str) -> str | None:
    url = META_URL.format(identifier=identifier)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return None

    files = data.get("files", [])
    pdfs = [f for f in files if f.get("name", "").lower().endswith(".pdf")]
    if not pdfs:
        return None

    target = next(
        (f for f in pdfs if f["name"].lower() == f"{identifier.lower()}.pdf"), None
    )
    if target is None:
        target = max(pdfs, key=lambda f: f.get("size", 0))
    return target["name"]


def download_file(identifier: str, filename: str, out_path: Path) -> bool:
    url = DOWNLOAD_URL.format(identifier=identifier, filename=filename)
    try:
        subprocess.run(
            ["curl", "-sL", "--max-time", "120", "-o", str(out_path), url],
            check=True,
            timeout=180,
        )
        size = out_path.stat().st_size
        return size > 4096
    except Exception:
        if out_path.exists():
            out_path.unlink(missing_ok=True)
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Stratified SCOTUS PDF download from IA")
    parser.add_argument("--total", type=int, default=500, help="Total items to download")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for sampling")
    parser.add_argument("--skip-download", action="store_true", help="Only build catalog + sample, don't download")
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST_PATH.read_text()) if MANIFEST_PATH.exists() else {}

    docs = fetch_full_catalog()
    selected = sample_by_year_bins(docs, args.total, args.seed)

    print(f"\nSelected {len(selected)} items for download.")
    if args.skip_download:
        print("--skip-download set; exiting without downloading.")
        return

    downloaded = 0
    skipped = 0
    failed = 0

    for doc in selected:
        identifier = doc.get("identifier", "")
        year = doc.get("year", "?")
        if not identifier:
            continue

        if identifier in manifest and manifest[identifier].get("status") == "ok":
            skipped += 1
            continue

        out_path = OUT_DIR / f"{identifier}.pdf"
        if out_path.exists() and out_path.stat().st_size > 4096:
            manifest[identifier] = {"status": "ok", "meta": doc}
            skipped += 1
            continue

        pdf_name = get_primary_pdf(identifier)
        if not pdf_name:
            manifest[identifier] = {"status": "no_pdf", "meta": doc}
            failed += 1
            print(f"  [-] {identifier} (year={year}) — no PDF")
            continue

        ok = download_file(identifier, pdf_name, out_path)
        if ok:
            manifest[identifier] = {"status": "ok", "pdf": pdf_name, "meta": doc}
            downloaded += 1
            print(f"  [+] {identifier} (year={year}) — {pdf_name}")
        else:
            manifest[identifier] = {"status": "download_failed", "pdf": pdf_name, "meta": doc}
            failed += 1
            print(f"  [-] {identifier} (year={year}) — DOWNLOAD FAILED")

        if downloaded % 10 == 0:
            MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))

        time.sleep(0.5)

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    print(f"\nDone. downloaded={downloaded}, skipped={skipped}, failed={failed}")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
