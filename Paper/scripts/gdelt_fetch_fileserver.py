#!/usr/bin/env python3
"""Fetch a fixed-day monthly sample from the public GDELT v1 GKG archive.

The v1 daily GKG files expose the THEMES and NUMARTS fields needed to reproduce
the per-axis matching contract without BigQuery. Downloads are sequential,
rate-limited, retried with exponential backoff, and cached outside the repo.
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import sys
import time
import urllib.error
import urllib.request
import zipfile
from calendar import monthrange
from dataclasses import dataclass
from pathlib import Path


BASE_URL = "http://data.gdeltproject.org/gkg"
DEFAULT_CACHE = Path("/tmp/the-original-power-gdelt-cache")
DEFAULT_OUTPUT = Path(__file__).resolve().parents[1] / "data/raw/gdelt_per_axis_raw.csv"
FIELDS = (
    "year_month",
    "race_count",
    "gender_count",
    "religion_count",
    "sexuality_count",
    "total_count",
)
AXIS_PATTERNS = {
    "race_count": re.compile(
        r"discrimination|civil_rights|race_relations|protest|racial|ethnicity",
        re.IGNORECASE,
    ),
    "gender_count": re.compile(
        r"women|gender_discrimination|feminism|sexual_harassment", re.IGNORECASE
    ),
    "religion_count": re.compile(
        r"religion|religious_rights|evangelical|prayer", re.IGNORECASE
    ),
    "sexuality_count": re.compile(
        r"lgbt|gay_rights|transgender|homosexual", re.IGNORECASE
    ),
}

# Some GKG records contain source/theme fields larger than csv's 128 KiB default.
csv.field_size_limit(sys.maxsize)


@dataclass(frozen=True)
class MonthSample:
    year_month: str
    yyyymmdd: str


def iter_months(start: str, end: str, sample_day: int) -> list[MonthSample]:
    start_year, start_month = map(int, start.split("-"))
    end_year, end_month = map(int, end.split("-"))
    current = start_year * 12 + start_month - 1
    final = end_year * 12 + end_month - 1
    if current > final:
        raise ValueError("start month must not follow end month")

    samples: list[MonthSample] = []
    while current <= final:
        year, month_zero = divmod(current, 12)
        month = month_zero + 1
        day = min(sample_day, monthrange(year, month)[1])
        samples.append(MonthSample(f"{year:04d}-{month:02d}", f"{year:04d}{month:02d}{day:02d}"))
        current += 1
    return samples


def download(sample: MonthSample, cache_dir: Path, retries: int, delay: float) -> Path:
    cache_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{sample.yyyymmdd}.gkg.csv.zip"
    destination = cache_dir / filename
    if destination.exists() and zipfile.is_zipfile(destination):
        return destination
    if destination.exists():
        destination.unlink()

    url = f"{BASE_URL}/{filename}"
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "TheOriginalPower-GDELT-ingest/1.0 (academic research)"},
    )
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                payload = response.read()
            destination.write_bytes(payload)
            if not zipfile.is_zipfile(destination):
                destination.unlink(missing_ok=True)
                raise RuntimeError(f"invalid ZIP response from {url}")
            time.sleep(delay)
            return destination
        except (OSError, RuntimeError, urllib.error.URLError) as exc:
            destination.unlink(missing_ok=True)
            if attempt == retries:
                raise RuntimeError(f"failed after {retries + 1} attempts: {url}: {exc}") from exc
            wait = delay * (2 ** (attempt + 1))
            print(f"retrying {url} in {wait:.1f}s after {exc}", file=sys.stderr)
            time.sleep(wait)
    raise AssertionError("unreachable")


def aggregate(path: Path, sample: MonthSample) -> dict[str, int | str]:
    counts = {name: 0 for name in AXIS_PATTERNS}
    total = 0
    with zipfile.ZipFile(path) as archive:
        members = archive.namelist()
        if len(members) != 1:
            raise RuntimeError(f"expected one CSV in {path}, found {len(members)}")
        with archive.open(members[0]) as raw:
            text = io.TextIOWrapper(raw, encoding="utf-8", errors="replace", newline="")
            reader = csv.DictReader(text, delimiter="\t")
            required = {"NUMARTS", "THEMES"}
            if reader.fieldnames is None or not required.issubset(reader.fieldnames):
                raise RuntimeError(f"missing {sorted(required)} in {path}: {reader.fieldnames}")
            for row in reader:
                try:
                    weight = int(row["NUMARTS"] or "1")
                except ValueError as exc:
                    raise RuntimeError(f"invalid NUMARTS in {path}: {row['NUMARTS']!r}") from exc
                if weight < 1:
                    continue
                total += weight
                themes = row["THEMES"] or ""
                for name, pattern in AXIS_PATTERNS.items():
                    if pattern.search(themes):
                        counts[name] += weight

    result: dict[str, int | str] = {"year_month": sample.year_month, **counts, "total_count": total}
    for name in AXIS_PATTERNS:
        if int(result[name]) > total:
            raise RuntimeError(f"{name} exceeds total for {sample.year_month}")
    return result


def write_output(rows: list[dict[str, int | str]], output: Path, sample_day: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8", newline="") as handle:
        handle.write("# source: GDELT 1.0 daily GKG public file server\n")
        handle.write(f"# sampling: day {sample_day} of each month; counts weighted by NUMARTS\n")
        handle.write("# generated_by: Paper/scripts/gdelt_fetch_fileserver.py\n")
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default="2013-04", help="first month, YYYY-MM")
    parser.add_argument("--end", default="2024-12", help="last month, YYYY-MM")
    parser.add_argument("--sample-day", type=int, default=15, choices=range(1, 29))
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--retries", type=int, default=4)
    parser.add_argument("--request-delay", type=float, default=0.5)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    samples = iter_months(args.start, args.end, args.sample_day)
    rows: list[dict[str, int | str]] = []
    failures: list[str] = []
    for index, sample in enumerate(samples, start=1):
        print(f"[{index}/{len(samples)}] {sample.year_month} ({sample.yyyymmdd})", flush=True)
        try:
            archive = download(sample, args.cache_dir, args.retries, args.request_delay)
            row = aggregate(archive, sample)
        except RuntimeError as exc:
            failures.append(f"{sample.year_month}: {exc}")
            print(f"omitting {sample.year_month}: {exc}", file=sys.stderr)
            continue
        rows.append(row)

    write_output(rows, args.output, args.sample_day)
    print(f"wrote {len(rows)} rows to {args.output}")
    if failures:
        print("gaps:", file=sys.stderr)
        for failure in failures:
            print(f"  {failure}", file=sys.stderr)


if __name__ == "__main__":
    main()
