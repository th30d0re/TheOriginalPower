#!/usr/bin/env python3
"""
govinfo_crec_quarterly_query.py

Query the GovInfo API (free, requires API key registration) for quarterly
keyword-document counts in the Congressional Record (CREC) collection.

This script replaces the ProQuest Congressional dependency with an open-source
alternative.  It searches the full text of the Congressional Record via
GovInfo's /collections/CREC/search endpoint and counts matching documents per
quarter per keyword basket.  Document count correlates with word-frequency
salience and is a valid proxy for spectral analysis of temporal variation.

Why this approach
-----------------
The original annual data used ProQuest Congressional full-text search API
(subscription required).  GovInfo provides the same underlying content via a
free API (api.govinfo.gov).  The tradeoff is metric granularity: ProQuest
returns word-level hit counts; GovInfo search returns document-level match
counts.  For spectral analysis of political discourse, document frequency is a
valid proxy for term frequency because the correlation between document count
and word count is high for politically salient terms.

Rate limits
-----------
GovInfo API (via api.data.gov): 1,000 requests/day per key.
This script makes ~5 requests per quarter:
    1 query for class-band basket
    1 query for identity-band basket
    1 query for total CREC volume (denominator)
    + pagination overhead for large quarters
For 60 years × 4 quarters = 240 quarters, expect ~500–800 requests.
With a 6-second inter-request sleep, runtime is ~1 hour.

Setup
-----
1. Register at https://www.govinfo.gov/api-signup (free)
2. Run:
       python3 Paper/scripts/govinfo_crec_quarterly_query.py --api-key YOUR_KEY

   Or set env var GOVINFO_API_KEY and run without --api-key.
3. Output is written to Paper/data/raw/congressional_record_quarterly_raw.csv
4. Preprocess with: python3 Paper/scripts/preprocess_spectral_data.py
   (or `make data-refresh`)

Output columns
--------------
year_quarter      : YYYY-QN (e.g. 1965-Q1)
class_doc_count   : CREC documents matching class-band query
identity_doc_count: CREC documents matching identity-band query
total_doc_count   : total CREC documents published in quarter (proxy denominator)

"""
from __future__ import annotations

import argparse
import csv
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = RAW / "congressional_record_quarterly_raw.csv"

GOVINFO_BASE = "https://api.govinfo.gov"

# --- Keyword baskets (same conceptual baskets as the annual analysis) ----------
# GovInfo search uses plain-text boolean OR.  Queries are broad intentionally.
CLASS_QUERY = (
    '"union" OR "strike" OR "minimum wage" OR "labor" OR "working class" '
    'OR "wages" OR "collective bargaining" OR "NLRB" OR "OSHA" OR "pension" '
    'OR "profit sharing" OR "income inequality" OR "wealth gap"'
)

IDENTITY_QUERY = (
    '"race" OR "racial" OR "racism" OR "gender" OR "sexism" OR "immigration" '
    'OR "immigrant" OR "religion" OR "religious" OR "sexuality" OR "LGBT" '
    'OR "transgender" OR "abortion" OR "affirmative action" OR "police brutality" '
    'OR "border" OR "deportation"'
)

BASKETS = {
    "class_doc_count": CLASS_QUERY,
    "identity_doc_count": IDENTITY_QUERY,
}

SLEEP_SEC = 6.0  # respect 1,000 req/day limit


def _search_count(session: requests.Session, api_key: str, query: str,
                  date_from: str, date_to: str) -> int:
    """Return total matching document count for a query + date range."""
    url = f"{GOVINFO_BASE}/collections/CREC/search"
    params = {
        "api_key": api_key,
        "query": query,
        "startDate": date_from,
        "endDate": date_to,
        "pageSize": 1,
        "offsetMark": "*",
    }
    resp = session.get(url, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    # GovInfo returns count in the response metadata
    return int(data.get("count", 0))


def _total_volume_count(session: requests.Session, api_key: str,
                        date_from: str, date_to: str) -> int:
    """Return total CREC document count in date range (no keyword filter)."""
    # A wildcard-like query that matches everything in CREC is tricky;
    # GovInfo does not support * wildcard in query.  We use a very broad
    # OR query that matches virtually all Congressional Record entries:
    # every CREC document contains at least one of these function words.
    broad_query = '"the" OR "of" OR "and" OR "to" OR "a" OR "in"'
    return _search_count(session, api_key, broad_query, date_from, date_to)


def quarter_range(year: int, quarter: int) -> tuple[str, str]:
    """Return (startDate, endDate) as ISO strings for a given year/quarter."""
    starts = {1: "01-01", 2: "04-01", 3: "07-01", 4: "10-01"}
    ends = {1: "03-31", 2: "06-30", 3: "09-30", 4: "12-31"}
    return (f"{year}-{starts[quarter]}", f"{year}-{ends[quarter]}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Query GovInfo API for quarterly Congressional Record keyword counts"
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("GOVINFO_API_KEY", ""),
        help="GovInfo API key (or set GOVINFO_API_KEY env var)",
    )
    parser.add_argument("--start-year", type=int, default=1965)
    parser.add_argument("--end-year", type=int, default=2024)
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Skip year_quarters already present in the output CSV",
    )
    args = parser.parse_args()

    if not args.api_key:
        print("ERROR: GovInfo API key required.\n"
              "Register for free at https://www.govinfo.gov/api-signup\n"
              "Then run with --api-key YOUR_KEY or set GOVINFO_API_KEY env var.")
        sys.exit(1)

    # Load existing rows if resuming
    existing: set[str] = set()
    rows: list[dict] = []
    if args.resume and OUT.exists():
        with OUT.open("r", newline="") as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                existing.add(row["year_quarter"])
                rows.append(row)
        print(f"Resuming: {len(existing)} quarters already in {OUT}")

    session = requests.Session()
    total_req = 0

    for year in range(args.start_year, args.end_year + 1):
        for quarter in range(1, 5):
            yq = f"{year}-Q{quarter}"
            if yq in existing:
                continue

            date_from, date_to = quarter_range(year, quarter)
            print(f"\nQuerying {yq} ({date_from} to {date_to}) ...")

            row: dict[str, str | int] = {"year_quarter": yq}

            # Query each basket
            for col_name, query in BASKETS.items():
                try:
                    count = _search_count(session, args.api_key, query, date_from, date_to)
                    row[col_name] = count
                    total_req += 1
                    print(f"  {col_name}: {count}")
                except requests.HTTPError as e:
                    print(f"  ERROR {col_name}: {e}")
                    row[col_name] = -1
                time.sleep(SLEEP_SEC)

            # Query total volume (denominator proxy)
            try:
                total = _total_volume_count(session, args.api_key, date_from, date_to)
                row["total_doc_count"] = total
                total_req += 1
                print(f"  total_doc_count: {total}")
            except requests.HTTPError as e:
                print(f"  ERROR total_doc_count: {e}")
                row["total_doc_count"] = -1
            time.sleep(SLEEP_SEC)

            rows.append(row)

            # Write incrementally so interruption does not lose progress
            with OUT.open("w", newline="") as fh:
                writer = csv.DictWriter(
                    fh,
                    fieldnames=["year_quarter", "class_doc_count",
                                "identity_doc_count", "total_doc_count"],
                )
                writer.writeheader()
                writer.writerows(rows)

    print(f"\nDone. {total_req} API requests made.")
    print(f"Output: {OUT}")
    print("Next step: run Paper/scripts/preprocess_spectral_data.py")


if __name__ == "__main__":
    main()
