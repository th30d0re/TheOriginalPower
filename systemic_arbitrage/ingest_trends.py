"""Google Trends ingestion with offline CSV fallback.

The public pytrends interface is unofficial and rate-limited. When live fetching
fails, the module falls back to a committed snapshot in data/raw/ so the
spectral pipeline remains testable offline.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

import pandas as pd
import yaml

PACKAGE_ROOT = Path(__file__).resolve().parent
CONFIG_PATH = PACKAGE_ROOT / "config.yaml"
VARIABLES_PATH = PACKAGE_ROOT / "variables.yaml"
RAW_DIR = PACKAGE_ROOT / "data" / "raw"
FALLBACK_CSV = RAW_DIR / "google_trends_snapshot.csv"


def load_config() -> dict:
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def load_variables() -> dict:
    with open(VARIABLES_PATH) as f:
        return yaml.safe_load(f)


def _build_composite(df: pd.DataFrame, keywords: list[str], label: str) -> pd.Series:
    """Average available keyword columns into a single basket series."""
    available = [kw for kw in keywords if kw in df.columns]
    if not available:
        raise ValueError(f"None of the keywords for {label} found in columns: {df.columns.tolist()}")
    return df[available].mean(axis=1)


def fetch_pytrends(
    keywords: list[str],
    timeframe: str = "today 5-y",
    geo: str = "US",
    proxy: Optional[str] = None,
) -> pd.DataFrame:
    """Fetch normalized interest-over-time data from Google Trends.

    Raises ImportError if pytrends is not installed.
    Raises a subclass of Exception on rate limits or network errors.
    """
    from pytrends.request import TrendReq

    pytrends = TrendReq(hl="en-US", tz=360, proxies={"https": proxy} if proxy else None)
    pytrends.build_payload(keywords, cat=0, timeframe=timeframe, geo=geo)
    data = pytrends.interest_over_time()
    if data.empty:
        raise ValueError("pytrends returned empty interest-over_time data")
    data = data.drop(columns=["isPartial"]) if "isPartial" in data.columns else data
    data.index = pd.to_datetime(data.index)
    return data


def load_fallback_snapshot(path: Path = FALLBACK_CSV) -> pd.DataFrame:
    """Load a committed CSV snapshot for offline testing."""
    df = pd.read_csv(path, parse_dates=["date"], index_col="date")
    return df


def save_snapshot(df: pd.DataFrame, path: Path = FALLBACK_CSV) -> None:
    """Write a fetched DataFrame to the raw snapshot path."""
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path)


def ingest_baskets(
    timeframe: str = "today 5-y",
    geo: str = "US",
    save: bool = False,
    fallback_on_error: bool = True,
) -> pd.DataFrame:
    """Return a DataFrame with class_band and identity_band composite columns.

    The function first attempts to fetch live data for all keywords. If that
    fails and fallback_on_error is True, it loads FALLBACK_CSV. The fallback
    file ships with the repository so tests run without network access.
    """
    variables = load_variables()
    class_keywords = variables.get("keywords", {}).get("class_band", [])
    identity_keywords = variables.get("keywords", {}).get("identity_band", [])
    all_keywords = list(set(class_keywords + identity_keywords))

    try:
        proxy = os.environ.get("PYTRENDS_PROXY")
        raw = fetch_pytrends(all_keywords, timeframe=timeframe, geo=geo, proxy=proxy)
        if save:
            save_snapshot(raw)
    except Exception as exc:  # pragma: no cover - network path
        if not fallback_on_error:
            raise
        raw = load_fallback_snapshot()

    df = pd.DataFrame(index=raw.index)
    df["class_band"] = _build_composite(raw, class_keywords, "class_band")
    df["identity_band"] = _build_composite(raw, identity_keywords, "identity_band")
    return df


def main() -> None:
    """CLI entry point for refreshing the raw snapshot."""
    df = ingest_baskets(save=True, fallback_on_error=False)
    print(df.head())
    print(f"\nSnapshot saved to {FALLBACK_CSV}")


if __name__ == "__main__":
    main()
