"""Preprocess archived raw spectral exports into analysis-ready datasets.

Inputs:
    Paper/data/raw/google_trends_raw.csv
    Paper/data/raw/congressional_record_raw.csv
    Paper/data/raw/anes_momp_raw.csv
    Paper/data/raw/historical_shocks_raw.json
    Paper/data/raw/backlash_proxies_raw.csv
    Paper/data/raw/gdelt_per_axis_raw.csv         (optional; requires BigQuery retrieval)
    Paper/data/raw/nyt_per_axis_raw.csv           (optional; requires nyt_per_axis_query.py + API key)
    Paper/data/raw/scotus_keyword_counts_raw.csv  (optional; requires scotus_text_extract.py)

Outputs (written to Paper/data/):
    google_trends_class_identity.csv   (smoothed + gap-interpolated weekly indices)
    congressional_record_word_freq.csv (per-1000-words normalized annual rates)
    anes_issue_salience.csv            (biennial rows + annual linear-interpolated companion cols)
    historical_shocks.json             (verbatim pass-through; kept for pipeline symmetry)
    backlash_proxies.csv               (per-segment 0-100 min-max backlash index)
    gdelt_per_axis.csv                 (per-axis share of total GDELT news coverage, 2013–2024)
    nyt_per_axis.csv                   (per-axis share of total NYT coverage, 1979–2024, quarterly)
    scotus_keyword_counts.csv          (per-1000-words keyword counts, sorted by year)

This script performs ONLY deterministic preprocessing transformations on the
archived raw exports. It does not generate, calibrate, or fit signal values.

Run via: `make data-refresh`  (not run as part of `make empirical`).
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.signal import detrend


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data"


def _strip_comments(path: Path) -> pd.DataFrame:
    return pd.read_csv(path, comment="#")


def _write_with_header(df: pd.DataFrame, path: Path, header_lines: list[str]) -> None:
    with path.open("w") as fh:
        for line in header_lines:
            fh.write(line.rstrip("\n") + "\n")
        df.to_csv(fh, index=False)


def preprocess_google_trends() -> None:
    raw = _strip_comments(RAW / "google_trends_raw.csv")
    raw["date"] = pd.to_datetime(raw["date"])
    raw = raw.sort_values("date").reset_index(drop=True)
    full_index = pd.date_range(raw["date"].iloc[0], raw["date"].iloc[-1], freq="W-SUN")
    df = raw.set_index("date").reindex(full_index).interpolate(method="linear")
    df.index.name = "date"
    # Light 3-week rolling smoother to mute single-week scraping noise without
    # displacing the class/identity-band oscillations we care about.
    smoothed = df.rolling(window=3, min_periods=1, center=True).mean()
    smoothed = smoothed.round(3).reset_index()
    header = [
        "# processed: weekly Google Trends indices (0-100), smoothed and gap-filled",
        "# source_raw: Paper/data/raw/google_trends_raw.csv",
        "# transformations:",
        "#   1. reindex to uniform W-SUN weekly grid and linearly interpolate missing weeks",
        "#   2. 3-week centered rolling mean to suppress single-week scraping noise",
        "#   3. round to 3 decimals",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    _write_with_header(smoothed, OUT / "google_trends_class_identity.csv", header)
    print(f"wrote {OUT / 'google_trends_class_identity.csv'}")


def preprocess_congressional_record() -> None:
    raw = _strip_comments(RAW / "congressional_record_raw.csv")
    raw = raw.sort_values("year").reset_index(drop=True)
    # Normalize raw keyword counts to per-1000-total-basket-words so that the
    # time series reflects relative salience rather than the secular rise in
    # total Congressional Record length.
    total = raw["class_word_freq"] + raw["identity_word_freq"]
    processed = pd.DataFrame({
        "year": raw["year"].astype(int),
        "class_word_freq": raw["class_word_freq"].astype(int),
        "identity_word_freq": raw["identity_word_freq"].astype(int),
        "class_share": (raw["class_word_freq"] / total).round(4),
        "identity_share": (raw["identity_word_freq"] / total).round(4),
    })
    header = [
        "# processed: annual U.S. Congressional Record keyword counts + basket shares",
        "# source_raw: Paper/data/raw/congressional_record_raw.csv",
        "# transformations:",
        "#   1. sort ascending by year",
        "#   2. compute class_share, identity_share as fraction of (class+identity) basket totals",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    _write_with_header(processed, OUT / "congressional_record_word_freq.csv", header)
    print(f"wrote {OUT / 'congressional_record_word_freq.csv'}")


def preprocess_congressional_record_quarterly() -> None:
    """Process GovInfo quarterly document-count proxy into analysis-ready format."""
    src = RAW / "congressional_record_quarterly_raw.csv"
    if not src.exists():
        print(f"skip quarterly CREC: {src} not found (run govinfo_crec_quarterly_query.py)")
        return
    raw = _strip_comments(src)
    raw = raw.sort_values("year_quarter").reset_index(drop=True)
    # Filter out failed queries (-1) and drop them
    raw = raw[raw["class_doc_count"] >= 0]
    raw = raw[raw["identity_doc_count"] >= 0]
    if len(raw) == 0:
        print("skip quarterly CREC: no valid rows after filtering failed queries")
        return
    # Use document counts as the metric.  For spectral analysis, temporal
    # variation in document frequency correlates with word-frequency variation.
    total = raw["class_doc_count"] + raw["identity_doc_count"]
    processed = pd.DataFrame({
        "year_quarter": raw["year_quarter"],
        "class_doc_count": raw["class_doc_count"].astype(int),
        "identity_doc_count": raw["identity_doc_count"].astype(int),
        "class_share": (raw["class_doc_count"] / total).round(4),
        "identity_share": (raw["identity_doc_count"] / total).round(4),
    })
    header = [
        "# processed: quarterly U.S. Congressional Record document-count proxy + basket shares",
        "# source_raw: Paper/data/raw/congressional_record_quarterly_raw.csv",
        "# extraction_method: GovInfo API /collections/CREC/search (document-level counts)",
        "# transformations:",
        "#   1. sort ascending by year_quarter",
        "#   2. filter out failed API queries (count == -1)",
        "#   3. compute class_share, identity_share as fraction of basket totals",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    _write_with_header(processed, OUT / "congressional_record_quarterly.csv", header)
    print(f"wrote {OUT / 'congressional_record_quarterly.csv'}")


def preprocess_anes() -> None:
    raw = _strip_comments(RAW / "anes_momp_raw.csv")
    raw = raw.sort_values("year").reset_index(drop=True)
    # Annualize the biennial ANES frame via linear interpolation so the
    # downstream FFT can operate on a uniform 1-yr sampling grid.
    full_years = pd.RangeIndex(start=int(raw["year"].min()), stop=int(raw["year"].max()) + 1, step=1)
    annual = raw.set_index("year").reindex(full_years).interpolate(method="linear")
    annual.index.name = "year"
    annual = annual.round(3).reset_index()
    header = [
        "# processed: ANES MOMP + cross-group solidarity (annualized by linear interpolation)",
        "# source_raw: Paper/data/raw/anes_momp_raw.csv",
        "# transformations:",
        "#   1. sort ascending by year",
        "#   2. linearly interpolate biennial rows onto a uniform 1-year grid",
        "#   3. round values to 3 decimals",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    _write_with_header(annual, OUT / "anes_issue_salience.csv", header)
    print(f"wrote {OUT / 'anes_issue_salience.csv'}")


def preprocess_historical_shocks() -> None:
    src = RAW / "historical_shocks_raw.json"
    dst = OUT / "historical_shocks.json"
    shutil.copyfile(src, dst)
    # Round-trip to validate JSON structure.
    with dst.open() as fh:
        json.load(fh)
    print(f"wrote {dst}")


def preprocess_backlash_proxies() -> None:
    raw = _strip_comments(RAW / "backlash_proxies_raw.csv")
    raw = raw.sort_values(["shock_year", "year"]).reset_index(drop=True)
    # Per-segment min-max normalization onto a common 0-100 backlash index so
    # heterogeneous source units (thousands of Klan members vs. % poll approval)
    # can be compared on one Laplace-domain response axis.
    parts: list[pd.DataFrame] = []
    for shock, chunk in raw.groupby("shock_year", sort=False):
        lo = float(chunk["backlash_index"].min())
        hi = float(chunk["backlash_index"].max())
        denom = max(hi - lo, 1e-9)
        chunk = chunk.copy()
        chunk["backlash_index_norm"] = ((chunk["backlash_index"] - lo) / denom * 100.0).round(2)
        parts.append(chunk)
    processed = pd.concat(parts, ignore_index=True)
    header = [
        "# processed: per-segment 0-100 backlash index keyed to historical_shocks.json",
        "# source_raw: Paper/data/raw/backlash_proxies_raw.csv",
        "# transformations:",
        "#   1. sort ascending by (shock_year, year)",
        "#   2. per-shock min-max rescale of backlash_index -> backlash_index_norm in [0,100]",
        "#   3. round to 2 decimals",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    _write_with_header(processed, OUT / "backlash_proxies.csv", header)
    print(f"wrote {OUT / 'backlash_proxies.csv'}")


def preprocess_gdelt_per_axis() -> None:
    """Normalise GDELT per-axis raw counts to per-axis shares of total coverage.

    Requires Paper/data/raw/gdelt_per_axis_raw.csv, which is retrieved by
    Paper/scripts/gdelt_per_axis_query.py (BigQuery or manual console export).
    If the raw file is absent, this function prints a warning and skips silently
    so that `make data-refresh` does not fail for users without BigQuery access.
    """
    src = RAW / "gdelt_per_axis_raw.csv"
    if not src.exists():
        print(
            "preprocess_gdelt_per_axis: raw file not found — skipping.\n"
            "  To retrieve it, run:  python3 Paper/scripts/gdelt_per_axis_query.py\n"
            f"  Expected at: {src}"
        )
        return

    raw = _strip_comments(src)
    raw = raw.sort_values("year_month").reset_index(drop=True)

    total = raw["total_count"].replace(0, np.nan)
    processed = pd.DataFrame({
        "year_month": raw["year_month"],
        "race_share":      (raw["race_count"]     / total).round(6),
        "gender_share":    (raw["gender_count"]   / total).round(6),
        "religion_share":  (raw["religion_count"] / total).round(6),
        "sexuality_share": (raw["sexuality_count"]/ total).round(6),
        "total_count":     raw["total_count"].astype(int),
    })
    header = [
        "# processed: monthly GDELT GKG per-axis theme shares (fraction of total coverage)",
        "# source_raw: Paper/data/raw/gdelt_per_axis_raw.csv",
        "# source_upstream: GDELT Global Knowledge Graph v2, BigQuery public dataset",
        "# transformations:",
        "#   1. sort ascending by year_month",
        "#   2. compute race_share = race_count / total_count (and analogues for each axis)",
        "#   3. round to 6 decimal places",
        "#   4. replace zero total_count with NaN to avoid division artifacts",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    out = OUT / "gdelt_per_axis.csv"
    _write_with_header(processed, out, header)
    print(f"wrote {out}")


def preprocess_nyt_per_axis() -> None:
    """Normalise NYT per-axis quarterly article counts to per-axis shares of total.

    Requires Paper/data/raw/nyt_per_axis_raw.csv, produced by
    Paper/scripts/nyt_per_axis_query.py (needs a free NYT API key).
    Skips silently if the raw file is absent.

    Output columns: year_quarter, race_share, gender_share, religion_share,
                    sexuality_share, class_share, total_count.
    """
    src = RAW / "nyt_per_axis_raw.csv"
    if not src.exists():
        print(
            "preprocess_nyt_per_axis: raw file not found — skipping.\n"
            "  To retrieve it:  python3 Paper/scripts/nyt_per_axis_query.py --api-key YOUR_KEY\n"
            "  Register free at https://developer.nytimes.com/\n"
            f"  Expected at: {src}"
        )
        return

    raw = _strip_comments(src)
    # Drop any rows where retrieval failed (count == -1)
    raw = raw[(raw["race_count"] >= 0) & (raw["total_count"] > 0)].copy()
    raw = raw.sort_values("year_quarter").reset_index(drop=True)

    total = raw["total_count"].replace(0, np.nan)
    axes = ["race", "gender", "religion", "sexuality", "class"]
    processed = pd.DataFrame({"year_quarter": raw["year_quarter"]})
    for ax in axes:
        col = f"{ax}_count"
        if col in raw.columns:
            processed[f"{ax}_share"] = (raw[col] / total).round(6)
        else:
            processed[f"{ax}_share"] = np.nan
    processed["total_count"] = raw["total_count"].astype(int)

    header = [
        "# processed: quarterly NYT per-axis article count shares",
        "# source_raw: Paper/data/raw/nyt_per_axis_raw.csv",
        "# source_upstream: NYT Article Search API (developer.nytimes.com)",
        "# coverage: 1979-Q1 to 2024-Q4, quarterly",
        "# transformations:",
        "#   1. drop rows with failed retrieval (count == -1)",
        "#   2. sort ascending by year_quarter",
        "#   3. compute {axis}_share = {axis}_count / total_count",
        "#   4. round to 6 decimal places",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    out = OUT / "nyt_per_axis.csv"
    _write_with_header(processed, out, header)
    print(f"wrote {out}")


def preprocess_scotus_keyword_counts() -> None:
    """Sort and compute per-axis shares for SCOTUS keyword count data.

    Requires Paper/data/raw/scotus_keyword_counts_raw.csv, produced by
    Paper/scripts/scotus_text_extract.py.  If the raw file is absent this
    function skips silently so that `make data-refresh` does not fail on
    machines without the SCOTUS PDFs or pdfplumber installed.
    """
    src = RAW / "scotus_keyword_counts_raw.csv"
    if not src.exists():
        print(
            "preprocess_scotus_keyword_counts: raw file not found — skipping.\n"
            "  To generate it, run:  python3 Paper/scripts/scotus_text_extract.py\n"
            f"  Expected at: {src}"
        )
        return

    raw = _strip_comments(src)
    raw = raw.sort_values(["year", "case_name"]).reset_index(drop=True)

    id_per_1k = (
        raw["race_per_1k"] + raw["gender_per_1k"]
        + raw["religion_per_1k"] + raw["sexuality_per_1k"]
    )
    denom = (raw["class_per_1k"] + id_per_1k).replace(0, np.nan)
    processed = raw.copy()
    processed["class_share"]    = (raw["class_per_1k"]    / denom).round(4)
    processed["identity_share"] = (id_per_1k               / denom).round(4)
    header = [
        "# processed: SCOTUS per-1k-word keyword counts + basket shares",
        "# source_raw: Paper/data/raw/scotus_keyword_counts_raw.csv",
        "# source_upstream: Internet Archive SCOTUS PDFs (1873-2018), 55 opinions",
        "# transformations:",
        "#   1. sort ascending by (year, case_name)",
        "#   2. compute class_share = class_per_1k / (class_per_1k + identity_per_1k)",
        "#   3. compute identity_share = 1 - class_share",
        "#   4. round to 4 decimal places",
        "# preprocessed_by: Paper/scripts/preprocess_spectral_data.py",
    ]
    out = OUT / "scotus_keyword_counts.csv"
    _write_with_header(processed, out, header)
    print(f"wrote {out}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    preprocess_google_trends()
    preprocess_congressional_record()
    preprocess_congressional_record_quarterly()
    preprocess_anes()
    preprocess_historical_shocks()
    preprocess_backlash_proxies()
    preprocess_gdelt_per_axis()
    preprocess_nyt_per_axis()
    preprocess_scotus_keyword_counts()


if __name__ == "__main__":
    main()
