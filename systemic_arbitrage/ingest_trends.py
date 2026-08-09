"""Google Trends ingestion with offline CSV fallback.

The public pytrends interface is unofficial and rate-limited. When live fetching
fails, the module falls back to a committed snapshot in data/raw/ so the
spectral pipeline remains testable offline.
"""

from __future__ import annotations

import logging
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
logger = logging.getLogger(__name__)
TRENDS_REQUEST_LIMIT = 5
TRENDS_ANCHOR = "rent"


class AnchorScalingError(ValueError):
    """Raised when a Trends batch cannot be normalized through its anchor."""


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


def _build_axis_composite(
    df: pd.DataFrame,
    keywords: list[str],
    axis: str,
) -> pd.Series:
    """Average measured axis terms, warning for every absent configured term."""
    available = []
    for keyword in keywords:
        if keyword in df.columns:
            available.append(keyword)
        else:
            logger.warning("Identity axis %s is missing Trends term %s", axis, keyword)
    if not available:
        return pd.Series(float("nan"), index=df.index, dtype=float)
    return df[available].mean(axis=1)


def _identity_union(identity_axes: dict[str, list[str]]) -> list[str]:
    """Flatten configured identity terms and reject cross-list duplication."""
    terms = [term for axis_terms in identity_axes.values() for term in axis_terms]
    if len(terms) != len(set(terms)):
        duplicates = sorted({term for term in terms if terms.count(term) > 1})
        raise AssertionError(f"Identity terms assigned more than once: {duplicates}")
    return terms


def _fetch_batched_pytrends(
    keywords: list[str],
    timeframe: str,
    geo: str,
    proxy: Optional[str],
    anchor: str = TRENDS_ANCHOR,
) -> pd.DataFrame:
    """Fetch at most five terms per request and normalize through an anchor."""
    unique_keywords = list(dict.fromkeys(keywords))
    if anchor not in unique_keywords:
        raise AnchorScalingError(f"Shared Trends anchor {anchor!r} is not configured")

    non_anchor = [keyword for keyword in unique_keywords if keyword != anchor]
    payload_width = TRENDS_REQUEST_LIMIT - 1
    chunks = [non_anchor[i:i + payload_width] for i in range(0, len(non_anchor), payload_width)]
    if not chunks:
        chunks = [[]]

    combined: Optional[pd.DataFrame] = None
    reference_anchor_mean: Optional[float] = None
    for chunk in chunks:
        payload = [anchor, *chunk]
        fetched = fetch_pytrends(payload, timeframe=timeframe, geo=geo, proxy=proxy)
        if anchor not in fetched.columns:
            raise AnchorScalingError(f"Shared Trends anchor {anchor!r} missing from batch {payload}")
        anchor_values = fetched[anchor].dropna().astype(float)
        if anchor_values.empty or (anchor_values == 0.0).all():
            raise AnchorScalingError(f"Shared Trends anchor {anchor!r} is flat-zero in batch {payload}")

        anchor_mean = float(anchor_values.mean())
        if reference_anchor_mean is None:
            reference_anchor_mean = anchor_mean
            combined = fetched.copy()
            continue

        scaled = fetched.drop(columns=[anchor]).copy()
        scaled *= reference_anchor_mean / anchor_mean
        combined = combined.join(scaled, how="outer")

    if combined is None:  # pragma: no cover - chunks is always non-empty
        raise RuntimeError("No Trends batches were fetched")
    return combined


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
    """Return backward-compatible baskets plus per-axis identity composites.

    The function first attempts to fetch live data for all keywords. If that
    fails and fallback_on_error is True, it loads FALLBACK_CSV. The fallback
    file ships with the repository so tests run without network access.
    """
    variables = load_variables()
    class_keywords = variables.get("keywords", {}).get("class_band", [])
    identity_keywords = variables.get("keywords", {}).get("identity_band", [])
    identity_axes = variables.get("keywords", {}).get("identity_axes", {})
    axis_union = _identity_union(identity_axes)
    if set(axis_union) != set(identity_keywords):
        raise AssertionError(
            "keywords.identity_band must equal the union of identity_axes, including unattributed"
        )
    all_keywords = list(dict.fromkeys(class_keywords + identity_keywords))

    try:
        proxy = os.environ.get("PYTRENDS_PROXY")
        raw = _fetch_batched_pytrends(
            all_keywords,
            timeframe=timeframe,
            geo=geo,
            proxy=proxy,
        )
        if save:
            save_snapshot(raw)
    except AnchorScalingError:
        raise
    except Exception as exc:  # pragma: no cover - network path
        if not fallback_on_error:
            raise
        logger.warning(
            "Live Trends fetch failed (%s); loading fallback snapshot %s",
            exc, FALLBACK_CSV,
        )
        raw = load_fallback_snapshot()

    df = pd.DataFrame(index=raw.index)
    df["class_band"] = _build_composite(raw, class_keywords, "class_band")
    df["identity_band"] = _build_composite(raw, identity_keywords, "identity_band")
    for axis, axis_keywords in identity_axes.items():
        df[f"identity_{axis}"] = _build_axis_composite(raw, axis_keywords, axis)
    return df


def main() -> None:
    """CLI entry point for refreshing the raw snapshot."""
    df = ingest_baskets(save=True, fallback_on_error=False)
    print(df.head())
    print(f"\nSnapshot saved to {FALLBACK_CSV}")


if __name__ == "__main__":
    main()
