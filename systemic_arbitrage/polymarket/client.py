"""Thin Polymarket client abstraction.

The current implementation supports dry-run logging only. Live order placement
requires explicit opt-in via the SYSTEMIC_ARBITRAGE_LIVE environment variable
and a compliance review.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, TYPE_CHECKING

from systemic_arbitrage.trigger_engine import IntendedTrade

if TYPE_CHECKING:
    from systemic_arbitrage.costs import CostBreakdown

TRADE_LOG_PATH = Path(__file__).resolve().parents[1] / "data" / "paper_trades.jsonl"


class PolymarketClient:
    """Log paper trades to a JSONL file; raise on live orders without opt-in."""

    def __init__(self, trade_log_path: Path | None = None) -> None:
        self.trade_log_path = trade_log_path or TRADE_LOG_PATH
        self.live = os.environ.get("SYSTEMIC_ARBITRAGE_LIVE", "0") == "1"

    def submit_paper_trade(
        self,
        trade: IntendedTrade,
        model_prob: float,
        market_prob: float,
        edge: float,
        cost_breakdown: "CostBreakdown",
        signal_snapshot: dict,
    ) -> dict:
        """Write a fully-costed paper trade record to paper_trades.jsonl."""
        filled_notional = trade.notional_usd - cost_breakdown.slippage_usd

        record: dict[str, Any] = {
            "trade_id": str(uuid.uuid4()),
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            "trigger": trade.trigger.value,
            "market_slug": trade.market_slug,
            "side": trade.side.value,
            "intended_notional_usd": trade.notional_usd,
            "filled_notional_usd": filled_notional,
            "entry_probability": model_prob,
            "calibration_map_fitted": signal_snapshot.get("calibration_map_fitted", False),
            "market_prob_at_entry": market_prob,
            "edge_at_entry": edge,
            "realized_fee_usd": cost_breakdown.taker_fee_usd,
            "realized_slippage_usd": cost_breakdown.slippage_usd,
            "exit_probability": None,
            "pnl_usd": None,
            "closed": False,
            "signal_snapshot": {
                "O_x": signal_snapshot.get("O_x"),
                "P_real": signal_snapshot.get("P_real"),
                "delta_P": signal_snapshot.get("delta_P"),
                "model_prob": model_prob,
            },
        }

        self.trade_log_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.trade_log_path, "a") as f:
            f.write(json.dumps(record) + "\n")
        return record

    def close_trade(self, trade_id: str, exit_probability: float, resolution_outcome: int) -> dict:
        """Find the open trade by id, compute PnL, mark closed=True, rewrite the line."""
        if not self.trade_log_path.exists():
            raise ValueError(f"Trade log not found: {self.trade_log_path}")

        lines = self.trade_log_path.read_text().splitlines()
        updated_lines = []
        found = False
        result: dict = {}

        for line in lines:
            if not line.strip():
                updated_lines.append(line)
                continue
            record = json.loads(line)
            if record.get("trade_id") == trade_id:
                found = True
                total_cost_usd = record["realized_fee_usd"] + record["realized_slippage_usd"]
                filled = record["filled_notional_usd"]
                entry_prob = record["entry_probability"]
                if record["side"] == "LONG":
                    pnl = (resolution_outcome - entry_prob) * filled - total_cost_usd
                else:
                    pnl = (entry_prob - resolution_outcome) * filled - total_cost_usd
                record["exit_probability"] = exit_probability
                record["pnl_usd"] = pnl
                record["closed"] = True
                result = record
            updated_lines.append(json.dumps(record))

        if not found:
            raise ValueError(f"Trade {trade_id} not found in log")

        self.trade_log_path.write_text("\n".join(updated_lines) + "\n")
        return result

    def place_trade(self, trade: IntendedTrade, market_id: str = "") -> dict[str, Any]:
        """Kept for backward compatibility; delegates to submit_paper_trade with zero costs."""
        if self.live:
            raise NotImplementedError(
                "Live Polymarket trading is not yet implemented. "
                "Set SYSTEMIC_ARBITRAGE_LIVE=0 for paper trading."
            )

        from systemic_arbitrage.costs import CostBreakdown

        dummy_breakdown = CostBreakdown(
            taker_fee_usd=0.0,
            half_spread_usd=0.0,
            slippage_usd=0.0,
            total_usd=0.0,
            aborted=False,
            fill_notional_usd=trade.notional_usd,
        )
        return self.submit_paper_trade(
            trade=trade,
            model_prob=0.5,
            market_prob=0.5,
            edge=0.0,
            cost_breakdown=dummy_breakdown,
            signal_snapshot={},
        )
