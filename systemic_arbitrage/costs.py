"""Polymarket cost model for the systemic arbitrage engine."""

from __future__ import annotations

import math
from dataclasses import dataclass

DEFAULT_COST_CONFIG: dict = {
    "taker_fee_bps": 0.0,
    "max_slippage_frac": 0.01,
}


@dataclass
class CostBreakdown:
    taker_fee_usd: float
    half_spread_usd: float
    slippage_usd: float
    total_usd: float
    aborted: bool
    fill_notional_usd: float = 0.0


def compute_costs(
    fill_notional_usd: float,
    taker_fee_bps: float,
    half_spread_frac: float,
    book_depth_usd: float,
    slippage_rate: float = 0.5,
    max_slippage_frac: float = 0.01,
) -> CostBreakdown:
    """Compute the three cost components for a single fill."""
    taker_fee_usd = fill_notional_usd * (taker_fee_bps / 10_000.0)
    half_spread_usd = fill_notional_usd * half_spread_frac

    # Avoid division by zero on empty books — treat as worst-case abort.
    if book_depth_usd <= 0.0:
        return CostBreakdown(
            taker_fee_usd=taker_fee_usd,
            half_spread_usd=half_spread_usd,
            slippage_usd=0.0,
            total_usd=0.0,
            aborted=True,
            fill_notional_usd=fill_notional_usd,
        )

    slippage_frac = (fill_notional_usd / book_depth_usd) * slippage_rate
    aborted = slippage_frac > max_slippage_frac
    slippage_usd = fill_notional_usd * slippage_frac
    total_usd = taker_fee_usd + half_spread_usd + slippage_usd

    return CostBreakdown(
        taker_fee_usd=taker_fee_usd,
        half_spread_usd=half_spread_usd,
        slippage_usd=slippage_usd,
        total_usd=total_usd,
        aborted=aborted,
        fill_notional_usd=fill_notional_usd,
    )


def total_cost_prob_terms(
    breakdown: CostBreakdown,
    entry_prob: float,
) -> float:
    """Convert total USD cost to probability space.

    Returns cost as a fraction of potential payout:
        total_cost_usd / (fill_notional_usd / entry_prob)
    Returns inf if aborted.
    """
    if breakdown.aborted:
        return math.inf
    potential_payout_usd = breakdown.fill_notional_usd / entry_prob
    return breakdown.total_usd / potential_payout_usd


def load_cost_config(config: dict) -> dict:
    """Extract cost-relevant keys from the runtime config dict."""
    cost_section = config.get("costs", {})
    return {
        "taker_fee_bps": float(
            cost_section.get("taker_fee_bps", DEFAULT_COST_CONFIG["taker_fee_bps"])
        ),
        "max_slippage_frac": float(
            cost_section.get("max_slippage_frac", DEFAULT_COST_CONFIG["max_slippage_frac"])
        ),
    }
