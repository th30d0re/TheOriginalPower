#!/usr/bin/env python3
"""
Bulk download of U.S. Supreme Court opinion PDFs from Internet Archive.

Queries the IA 'us-supreme-court' collection via advancedsearch.php,
downloads the primary PDF for each item, and writes a manifest.

Usage:
    cd Paper && python3 scripts/download_ia_scotus_bulk.py [--max-items N] [--start-offset O]

Resumes automatically: skips items already present in the output directory.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "research" / "ia_scotus_pdfs_bulk"
MANIFEST_PATH = OUT_DIR / "bulk_manifest.json"

ADV_SEARCH = "https://archive.org/advancedsearch.php"
META_URL = "https://archive.org/metadata/{identifier}"
DOWNLOAD_URL = "https://archive.org/download/{identifier}/{filename}"

HEADERS = {"User-Agent": "Mozilla/5.0 (TheOriginalPower/1.0; research@example.com)"}


def ia_search(collection: str, offset: int, rows: int) -> dict:
    q = f"collection:{collection}"
    params = urllib.parse.urlencode({
        "q": q,
        "fl": "identifier,title,year",
        "rows": str(rows),
        "start": str(offset),
        "output": "json",
        "sort": "date+asc",
    })
    url = f"{ADV_SEARCH}?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


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

    # Prefer identifier.pdf, then largest PDF
    target = next((f for f in pdfs if f["name"].lower() == f"{identifier.lower()}.pdf"), None)
    if target is None:
        target = max(pdfs, key=lambda f: f.get("size", 0))
    return target["name"]


def download_file(identifier: str, filename: str, out_path: Path) -> bool:
    url = DOWNLOAD_URL.format(identifier=identifier, filename=filename)
    try:
        subprocess.run(
            ["curl", "-sL", "--max-time", "60", "-o", str(out_path), url],
            check=True,
        )
        return out_path.stat().st_size > 4096
    except Exception:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Bulk download SCOTUS PDFs from IA")
    parser.add_argument("--max-items", type=int, default=500, help="Max items to download")
    parser.add_argument("--start-offset", type=int, default=0, help="Search offset")
    parser.add_argument("--batch-size", type=int, default=50, help="Items per search request")
    parser.add_argument("--collection", default="us-supreme-court", help="IA collection name")
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST_PATH.read_text()) if MANIFEST_PATH.exists() else {}

    offset = args.start_offset
    downloaded = 0
    skipped = 0
    failed = 0

    print(f"Bulk downloading from collection: {args.collection}")
    print(f"Output directory: {OUT_DIR}")
    print(f"Target: {args.max_items} items (offset {offset})")
    print("-" * 60)

    while downloaded < args.max_items:
        batch_size = min(args.batch_size, args.max_items - downloaded)
        print(f"  Querying offset={offset}, rows={batch_size} ...")
        try:
            result = ia_search(args.collection, offset, batch_size)
        except Exception as e:
            print(f"  Search failed: {e}")
            break

        docs = result.get("response", {}).get("docs", [])
        if not docs:
            print("  No more results.")
            break

        for doc in docs:
            identifier = doc.get("identifier", "")
            if not identifier:
                continue

            if identifier in manifest and manifest[identifier].get("status") == "ok":
                skipped += 1
                continue

            pdf_name = get_primary_pdf(identifier)
            if not pdf_name:
                manifest[identifier] = {"status": "no_pdf", "meta": doc}
                failed += 1
                continue

            out_path = OUT_DIR / f"{identifier}.pdf"
            if out_path.exists() and out_path.stat().st_size > 4096:
                manifest[identifier] = {"status": "ok", "pdf": pdf_name, "meta": doc}
                skipped += 1
                continue

            ok = download_file(identifier, pdf_name, out_path)
            if ok:
                manifest[identifier] = {"status": "ok", "pdf": pdf_name, "meta": doc}
                downloaded += 1
                print(f"    [+] {identifier} ({pdf_name})")
            else:
                manifest[identifier] = {"status": "download_failed", "pdf": pdf_name, "meta": doc}
                failed += 1
                print(f"    [-] {identifier} FAILED")

            time.sleep(0.5)

        offset += len(docs)
        MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
        print(f"  Progress: downloaded={downloaded}, skipped={skipped}, failed={failed}")

    print("-" * 60)
    print(f"Done. downloaded={downloaded}, skipped={skipped}, failed={failed}")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
