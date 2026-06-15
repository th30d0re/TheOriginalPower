"""Paper-trading session orchestrator.

Ties together: signal snapshot → trigger evaluation → edge check → risk check
→ paper trade submission.
"""

from __future__ import annotations

import json
import logging
import urllib.request
from pathlib import Path
from typing import Optional

from systemic_arbitrage.calibration_map import CalibrationMap
from systemic_arbitrage.costs import compute_costs, total_cost_prob_terms
from systemic_arbitrage.polymarket.client import PolymarketClient
from systemic_arbitrage.risk_controls import RiskControls, RiskState
from systemic_arbitrage.trigger_engine import evaluate_triggers, load_catalog

logger = logging.getLogger(__name__)

_PACKAGE_ROOT = Path(__file__).resolve().parent
_SNAPSHOT_PATH = _PACKAGE_ROOT / "data" / "live" / "signal_snapshot.json"
_REPORTS_DIR = _PACKAGE_ROOT / "data" / "reports"


def _load_snapshot() -> dict:
    return json.loads(_SNAPSHOT_PATH.read_text())


def _load_calibration_map() -> CalibrationMap:
    """Load CalibrationMap from most recent backtest report, or return default."""
    candidates = sorted(_REPORTS_DIR.glob("backtest_report*.json"), reverse=True)
    for path in candidates:
        try:
            data = json.loads(path.read_text())
            if "calibration_map" in data:
                return CalibrationMap.from_dict(data["calibration_map"])
        except Exception:
            continue
    # Fall back to default (identity logistic: predict returns ~0.5 for any input)
    return CalibrationMap()


def _fetch_market_prob(slug: str, timeout: float = 5.0) -> Optional[float]:
    url = f"https://gamma-api.polymarket.com/markets?slug={slug}"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            data = json.loads(r.read())
            if data and isinstance(data, list):
                return float(data[0].get("outcomePrices", ["0.5"])[0])
    except Exception:
        pass
    return None


def run_paper_session(
    config: dict,
    demographic_gate: Optional[str] = None,
    market_prob_override: Optional[float] = None,
    dry_run: bool = False,
    edge_threshold: float = 0.04,
) -> list[dict]:
    """Run one paper-trading session end-to-end."""
    snapshot = _load_snapshot()
    catalog = load_catalog()
    calibration_map = _load_calibration_map()
    risk_controls = RiskControls(config)
    risk_state = RiskState()
    client = PolymarketClient()

    trading = config.get("trading", {})
    cost_cfg = config.get("costs", {})
    taker_fee_bps = float(cost_cfg.get("taker_fee_bps", 0.0))
    half_spread_frac = float(cost_cfg.get("half_spread_frac", 0.0))
    book_depth_usd = float(cost_cfg.get("default_book_depth_usd", 50_000.0))
    max_slippage_frac = float(cost_cfg.get("max_slippage_frac", 0.01))

    trades = evaluate_triggers(
        snapshot,
        config,
        demographic_gate=demographic_gate,
        catalog=catalog,
    )

    delta_p = snapshot.get("delta_P", 0.0)
    model_prob = calibration_map.predict(delta_p)

    submitted: list[dict] = []

    for trade in trades:
        if market_prob_override is not None:
            market_prob = market_prob_override
        else:
            fetched = _fetch_market_prob(trade.market_slug)
            if fetched is None:
                logger.warning(
                    "Could not fetch market prob for %s; falling back to 0.50",
                    trade.market_slug,
                )
                market_prob = 0.50
            else:
                market_prob = fetched

        cost_breakdown = compute_costs(
            fill_notional_usd=trade.notional_usd,
            taker_fee_bps=taker_fee_bps,
            half_spread_frac=half_spread_frac,
            book_depth_usd=book_depth_usd,
            max_slippage_frac=max_slippage_frac,
        )

        cost_prob_terms = total_cost_prob_terms(cost_breakdown, model_prob)
        edge = (model_prob - market_prob) - cost_prob_terms

        if edge <= edge_threshold:
            logger.info(
                "Skip %s: edge %.4f <= threshold %.4f",
                trade.market_slug,
                edge,
                edge_threshold,
            )
            continue

        allowed, reason = risk_controls.check_trade(trade.notional_usd, risk_state)
        if not allowed:
            logger.warning("Trade blocked by risk controls: %s", reason)
            continue

        if dry_run:
            record = {
                "dry_run": True,
                "trigger": trade.trigger.value,
                "market_slug": trade.market_slug,
                "side": trade.side.value,
                "intended_notional_usd": trade.notional_usd,
                "model_prob": model_prob,
                "market_prob": market_prob,
                "edge": edge,
                "cost_breakdown": {
                    "taker_fee_usd": cost_breakdown.taker_fee_usd,
                    "slippage_usd": cost_breakdown.slippage_usd,
                    "total_usd": cost_breakdown.total_usd,
                    "aborted": cost_breakdown.aborted,
                },
            }
            logger.info("DRY RUN: would submit %s", record)
        else:
            record = client.submit_paper_trade(
                trade=trade,
                model_prob=model_prob,
                market_prob=market_prob,
                edge=edge,
                cost_breakdown=cost_breakdown,
                signal_snapshot=snapshot,
            )

        submitted.append(record)

    return submitted
