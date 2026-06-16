"""Build resolved_markets.csv for walk-forward backtesting.

Searches Polymarket for closed markets matching framework trigger keywords,
fetches each market's REAL point-in-time entry price from the Polymarket
CLOB price-history API, computes historical framework signals from Google
Trends, and writes systemic_arbitrage/data/backtest/resolved_markets.csv.

Real CLOB price history only exists for markets created during/after
Polymarket's CLOB era (~2024 onward) — markets are restricted to
created_at >= 2024-01-01 for this reason.

Usage:
    python systemic_arbitrage/build_backtest_data.py [--no-fetch]

    --no-fetch  Skip API calls; use cached search/candidate/price-history
                JSON and google_trends_historical.csv if they exist.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import numpy as np
import pandas as pd

PACKAGE_ROOT = Path(__file__).resolve().parent
RAW_DIR      = PACKAGE_ROOT / "data" / "raw"
BACKTEST_DIR = PACKAGE_ROOT / "data" / "backtest"
SEARCH_CACHE     = RAW_DIR / "polymarket_search_events.json"
CANDIDATES_CACHE = RAW_DIR / "candidates_2024plus.json"
ENTRY_PRICE_CACHE = RAW_DIR / "markets_with_entry_price.json"
TRENDS_CACHE = RAW_DIR / "google_trends_historical.csv"
OUT_CSV      = BACKTEST_DIR / "resolved_markets.csv"

MIN_VOLUME_USD = 1000.0
MIN_CREATED_AT = "2024-01-01"  # Polymarket CLOB price history starts here

SEARCH_KEYWORDS = [
    "minimum wage", "labor union", "strike", "collective bargaining",
    "police reform", "defund police", "gun control", "immigration",
    "voting rights", "abortion", "supreme court", "civil rights",
    "transgender", "critical race theory", "affirmative action",
    "diversity equity inclusion", "cancel culture", "culture war",
    "border wall", "filibuster", "january 6",
]

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


# ── Step 1: Polymarket keyword search ────────────────────────────────────────

def fetch_search_events(use_cache: bool) -> list[dict]:
    if use_cache and SEARCH_CACHE.exists():
        print(f"Using cached Polymarket search results: {SEARCH_CACHE}")
        return json.loads(SEARCH_CACHE.read_text())

    import requests
    print("Searching Polymarket for trigger-relevant events...")
    all_events: dict[str, dict] = {}
    for kw in SEARCH_KEYWORDS:
        try:
            r = requests.get(
                "https://gamma-api.polymarket.com/public-search",
                params={"q": kw, "limit_per_type": 100},
                timeout=20,
            )
            for ev in r.json().get("events", []):
                all_events[ev["id"]] = ev
        except Exception as exc:
            print(f"  search error for '{kw}': {exc}")
        time.sleep(0.2)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    SEARCH_CACHE.write_text(json.dumps(list(all_events.values())))
    print(f"  Found {len(all_events)} unique events; cached to {SEARCH_CACHE}")
    return list(all_events.values())


def classify_markets(events: list[dict]) -> list[dict]:
    if CANDIDATES_CACHE.exists():
        cached = json.loads(CANDIDATES_CACHE.read_text())
        print(f"Using cached classified candidates: {CANDIDATES_CACHE}")
        return cached

    candidates = []
    seen_slugs: set[str] = set()
    for ev in events:
        for m in ev.get("markets", []):
            if not m.get("closed"):
                continue
            created = (m.get("createdAt") or "")[:10]
            if not created or created < MIN_CREATED_AT:
                continue
            trigger = _classify(m.get("question", ""))
            if not trigger:
                continue
            slug = m.get("slug")
            if not slug or slug in seen_slugs:
                continue
            try:
                vol = float(m.get("volumeNum") or 0)
                if vol < MIN_VOLUME_USD:
                    continue
                prices = (
                    json.loads(m["outcomePrices"])
                    if isinstance(m["outcomePrices"], str)
                    else m["outcomePrices"]
                )
                outcome = int(float(prices[0]) > 0.5)
                end = (m.get("endDateIso") or m.get("endDate") or "")[:10]
                if not end or end <= created:
                    continue
                clob_raw = m.get("clobTokenIds")
                clob_ids = json.loads(clob_raw) if isinstance(clob_raw, str) else clob_raw
                if not clob_ids:
                    continue
            except Exception:
                continue
            seen_slugs.add(slug)
            candidates.append({
                "slug":       slug,
                "trigger":    trigger,
                "question":   m["question"][:90],
                "end":        end,
                "start":      created,
                "outcome":    outcome,
                "liquidity":  float(m.get("liquidityNum") or 0),
                "volume":     vol,
                "clob_token": clob_ids[0],
            })

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    CANDIDATES_CACHE.write_text(json.dumps(candidates))
    print(f"  Classified {len(candidates)} candidates; cached to {CANDIDATES_CACHE}")
    return candidates


# ── Step 1b: real entry prices from CLOB price history ──────────────────────

def fetch_entry_prices(candidates: list[dict], use_cache: bool) -> list[dict]:
    if use_cache and ENTRY_PRICE_CACHE.exists():
        print(f"Using cached entry prices: {ENTRY_PRICE_CACHE}")
        return json.loads(ENTRY_PRICE_CACHE.read_text())

    import requests

    def _fetch_one(c: dict) -> dict | None:
        for attempt in range(3):
            try:
                r = requests.get(
                    "https://clob.polymarket.com/prices-history",
                    params={"market": c["clob_token"], "interval": "max", "fidelity": 1440},
                    timeout=15,
                )
                hist = r.json().get("history", [])
                if not hist:
                    return None
                return {**c, "market_prob_at_entry": float(hist[0]["p"]), "n_price_points": len(hist)}
            except Exception:
                time.sleep(0.5 * (attempt + 1))
        return None

    print(f"Fetching real CLOB entry prices for {len(candidates)} markets...")
    results = []
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = {ex.submit(_fetch_one, c): c for c in candidates}
        for fut in as_completed(futs):
            res = fut.result()
            if res:
                results.append(res)

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    ENTRY_PRICE_CACHE.write_text(json.dumps(results))
    print(f"  {len(results)}/{len(candidates)} markets had real price history; cached to {ENTRY_PRICE_CACHE}")
    return results


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

def build_csv(priced: list[dict], trends: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for m in priced:
        ox, preal, dp = _signal_at(m["start"], trends)
        rows.append({
            "market_slug":          m["slug"],
            "trigger_type":         m["trigger"],
            "resolution_date":      m["end"],
            "resolution_outcome":   m["outcome"],
            "market_prob_at_entry": round(m["market_prob_at_entry"], 4),
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

    events     = fetch_search_events(use_cache)
    classified = classify_markets(events)
    priced     = fetch_entry_prices(classified, use_cache)

    print(f"\nClassified {len(classified)} markets; {len(priced)} have real CLOB entry prices:")
    for t in ["heat_shield_reversal", "cointelpro_metric", "interference_spike"]:
        subset = [m for m in priced if m["trigger"] == t]
        print(f"  {t}: {len(subset)}")

    trends = fetch_trends(use_cache)
    df = build_csv(priced, trends)

    print(f"\nWrote {len(df)} rows to {OUT_CSV}")
    print(df[["market_slug", "trigger_type", "entry_date", "resolution_outcome", "delta_p_at_entry"]].to_string())
    return 0


if __name__ == "__main__":
    sys.exit(main())
