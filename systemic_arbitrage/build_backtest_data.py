"""Build resolved_markets.csv for walk-forward backtesting.

Fetches closed Polymarket markets, classifies them by trigger type,
computes historical framework signals from Google Trends, and writes
systemic_arbitrage/data/backtest/resolved_markets.csv.

Usage:
    python systemic_arbitrage/build_backtest_data.py [--no-fetch]

    --no-fetch  Skip API calls; use cached polymarket_resolved.json and
                google_trends_historical.csv if they exist.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd

PACKAGE_ROOT = Path(__file__).resolve().parent
RAW_DIR      = PACKAGE_ROOT / "data" / "raw"
BACKTEST_DIR = PACKAGE_ROOT / "data" / "backtest"
POLY_CACHE   = RAW_DIR / "polymarket_resolved.json"
TRENDS_CACHE = RAW_DIR / "google_trends_historical.csv"
OUT_CSV      = BACKTEST_DIR / "resolved_markets.csv"

# ── Keyword classifiers ──────────────────────────────────────────────────────

LABOR_KW = [
    "minimum wage", "labor", "union", "nlrb", "worker", "wage",
    "paid leave", "strike", "collective bargaining", "employment",
    "workers", "inflation",
]
POLICE_KW = [
    "police", "surveillance", "incarceration", "prison", "criminal justice",
    "defund police", "gun control", "immigration", "border", "civil rights",
    "voting rights", "abortion", "roe", "supreme court", "legislation",
    "congress", "senate", "bill pass", "law pass", "act pass", "reform",
    "filibuster", "insurrection", "january 6",
]
NOISE_KW = [
    "transgender", "gender identity", "critical race", "woke ",
    "affirmative action", "dei ", "cancel culture", "pronouns",
    "drag queen", "culture war", "crt ", "diversity equity",
    "nonbinary", "sex ed", "book ban",
]


def _classify(question: str) -> str | None:
    q = question.lower()
    if any(kw in q for kw in LABOR_KW):  return "heat_shield_reversal"
    if any(kw in q for kw in POLICE_KW): return "cointelpro_metric"
    if any(kw in q for kw in NOISE_KW):  return "interference_spike"
    return None


# ── Step 1: Polymarket fetch ─────────────────────────────────────────────────

def fetch_polymarket(use_cache: bool) -> list[dict]:
    if use_cache and POLY_CACHE.exists():
        print(f"Using cached Polymarket data: {POLY_CACHE}")
        return json.loads(POLY_CACHE.read_text())

    import requests
    print("Fetching Polymarket resolved markets (this may take ~30s)...")
    all_markets: list[dict] = []
    for offset in range(0, 3000, 100):
        try:
            r = requests.get(
                f"https://gamma-api.polymarket.com/markets?closed=true&limit=100&offset={offset}",
                timeout=15,
            )
            batch = r.json()
        except Exception as exc:
            print(f"  API error at offset {offset}: {exc}")
            break
        if not batch:
            break
        all_markets.extend(batch)
        time.sleep(0.2)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    POLY_CACHE.write_text(json.dumps(all_markets))
    print(f"  Fetched {len(all_markets)} total markets; cached to {POLY_CACHE}")
    return all_markets


def classify_markets(all_markets: list[dict]) -> list[dict]:
    classified = []
    for m in all_markets:
        trigger = _classify(m.get("question", ""))
        if not trigger:
            continue
        try:
            vol = float(m.get("volumeNum") or 0)
            if vol < 1000:
                continue
            prices = (
                json.loads(m["outcomePrices"])
                if isinstance(m["outcomePrices"], str)
                else m["outcomePrices"]
            )
            outcome = int(float(prices[0]) > 0.5)
            start = (m.get("createdAt") or "")[:10]
            end   = (m.get("endDateIso") or m.get("endDate") or "")[:10]
            if not start or not end or end <= start:
                continue
            classified.append({
                "slug":      m["slug"],
                "trigger":   trigger,
                "question":  m["question"][:90],
                "end":       end,
                "start":     start,
                "outcome":   outcome,
                "liquidity": float(m.get("liquidityNum") or 0),
                "volume":    vol,
            })
        except Exception:
            continue
    return classified


# ── Step 2: Historical Google Trends ────────────────────────────────────────

def fetch_trends(use_cache: bool) -> pd.DataFrame:
    if use_cache and TRENDS_CACHE.exists():
        print(f"Using cached Trends data: {TRENDS_CACHE}")
        return pd.read_csv(TRENDS_CACHE, index_col=0, parse_dates=True)

    try:
        from pytrends.request import TrendReq
    except ImportError:
        print("pytrends not installed; using zero signals")
        return pd.DataFrame()

    print("Fetching historical Google Trends (2020–2026)...")
    pytrends = TrendReq(hl="en-US", tz=360)

    try:
        pytrends.build_payload(
            ["strike", "union", "wage", "inflation"],
            timeframe="2020-01-01 2026-01-01",
            geo="US",
        )
        class_df = pytrends.interest_over_time().drop(columns=["isPartial"], errors="ignore")
        class_df["class_band"] = class_df.mean(axis=1)
        time.sleep(3)

        pytrends.build_payload(
            ["transgender", "woke", "diversity", "critical race theory"],
            timeframe="2020-01-01 2026-01-01",
            geo="US",
        )
        id_df = pytrends.interest_over_time().drop(columns=["isPartial"], errors="ignore")
        id_df["identity_band"] = id_df.mean(axis=1)
    except Exception as exc:
        print(f"  pytrends error: {exc}; using zero signals")
        return pd.DataFrame()

    trends = class_df[["class_band"]].join(id_df[["identity_band"]], how="inner")
    std = trends["class_band"].std() + 1e-9
    trends["class_z"]  = (trends["class_band"] - trends["class_band"].mean()) / std
    total              = trends["class_band"] + trends["identity_band"] + 1e-9
    trends["O_x"]      = (trends["identity_band"] / total).clip(0, 1)
    trends["P_real"]   = trends["class_z"].clip(-3, 3)
    # V_E unknown historically; use structural pressure as delta_P proxy
    trends["delta_P"]  = trends["P_real"] * (1.0 - trends["O_x"])

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    trends.to_csv(TRENDS_CACHE)
    print(f"  Trends data saved to {TRENDS_CACHE} ({len(trends)} months)")
    return trends


def _signal_at(date_str: str, trends: pd.DataFrame) -> tuple[float, float, float]:
    if trends.empty:
        return 0.3, 0.0, 0.0
    try:
        dt = pd.Timestamp(date_str).to_period("M").to_timestamp()
        idx = trends.index.get_indexer([dt], method="nearest")[0]
        row = trends.iloc[idx]
        return float(row["O_x"]), float(row["P_real"]), float(row["delta_P"])
    except Exception:
        return 0.3, 0.0, 0.0


# ── Step 3: Assemble CSV ─────────────────────────────────────────────────────

def build_csv(classified: list[dict], trends: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for m in classified:
        ox, preal, dp = _signal_at(m["start"], trends)
        rows.append({
            "market_slug":          m["slug"],
            "trigger_type":         m["trigger"],
            "resolution_date":      m["end"],
            "resolution_outcome":   m["outcome"],
            "market_prob_at_entry": 0.50,
            "delta_p_at_entry":     round(dp, 4),
            "entry_date":           m["start"],
            "fill_notional_usd":    100.0,
            "book_depth_usd":       max(m["liquidity"], 1000.0),
            "half_spread_frac":     0.010,
        })
    df = pd.DataFrame(rows).sort_values("entry_date").reset_index(drop=True)
    BACKTEST_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT_CSV, index=False)
    return df


# ── Main ─────────────────────────────────────────────────────────────────────

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-fetch", action="store_true", help="Use cached API data")
    args = parser.parse_args(argv)
    use_cache = args.no_fetch

    all_markets = fetch_polymarket(use_cache)
    classified  = classify_markets(all_markets)

    print(f"\nClassified {len(classified)} markets:")
    for t in ["heat_shield_reversal", "cointelpro_metric", "interference_spike"]:
        subset = [m for m in classified if m["trigger"] == t]
        print(f"  {t}: {len(subset)}")

    trends = fetch_trends(use_cache)
    df = build_csv(classified, trends)

    print(f"\nWrote {len(df)} rows to {OUT_CSV}")
    print(df[["market_slug", "trigger_type", "entry_date", "resolution_outcome", "delta_p_at_entry"]].to_string())
    return 0


if __name__ == "__main__":
    sys.exit(main())
