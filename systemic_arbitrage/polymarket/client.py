"""Thin Polymarket client abstraction.

The current implementation supports dry-run logging only. Live order placement
requires explicit opt-in via the SYSTEMIC_ARBITRAGE_LIVE environment variable
and a compliance review.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from systemic_arbitrage.trigger_engine import IntendedTrade

TRADE_LOG_PATH = Path(__file__).resolve().parents[1] / "data" / "paper_trades.jsonl"


class PolymarketClient:
    """Log paper trades to a JSONL file; raise on live orders without opt-in."""

    def __init__(self, trade_log_path: Path | None = None) -> None:
        self.trade_log_path = trade_log_path or TRADE_LOG_PATH
        self.live = os.environ.get("SYSTEMIC_ARBITRAGE_LIVE", "0") == "1"

    def place_trade(self, trade: IntendedTrade, market_id: str = "") -> dict[str, Any]:
        """Record a paper trade or raise if live mode is requested."""
        if self.live:
            raise NotImplementedError(
                "Live Polymarket trading is not yet implemented. "
                "Set SYSTEMIC_ARBITRAGE_LIVE=0 for paper trading."
            )

        record = {
            "trade_id": "paper-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f"),
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            "trigger": trade.trigger.value,
            "market_slug": trade.market_slug,
            "market_id": market_id,
            "side": trade.side.value,
            "notional_usd": trade.notional_usd,
            "entry_probability": None,
            "exit_probability": None,
            "pnl_usd": None,
            "closed": False,
            "reason": trade.reason,
        }

        self.trade_log_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.trade_log_path, "a") as f:
            f.write(json.dumps(record) + "\n")
        return record
