"""Intraday risk gate for the paper-trading session."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class RiskState:
    daily_pnl_usd: float = 0.0
    consecutive_losses: int = 0
    trades_today: int = 0
    halted: bool = False
    halt_reason: str = ""


class RiskControls:
    """Enforce drawdown, streak, and size limits before each paper trade."""

    def __init__(self, config: dict) -> None:
        trading = config.get("trading", {})
        self._max_daily_drawdown: float = float(trading.get("max_daily_drawdown", 0.05))
        self._max_notional: float = float(trading.get("max_single_trade_notional", 500))
        self._kill_streak: int = int(trading.get("kill_switch_consecutive_losses", 3))
        # Daily-drawdown threshold in USD: fraction applied to max single notional as a proxy
        # for portfolio size.  Caller may pass a richer config to override.
        self._drawdown_usd_floor: float = (
            float(trading.get("portfolio_usd", self._max_notional * 10))
            * self._max_daily_drawdown
        )

    def check_trade(self, intended_notional: float, state: RiskState) -> tuple[bool, str]:
        """Return (allowed, reason). Blocks the trade on any active risk limit."""
        if state.halted:
            return False, f"session halted: {state.halt_reason}"
        if -state.daily_pnl_usd >= self._drawdown_usd_floor:
            return False, f"daily drawdown limit reached (pnl={state.daily_pnl_usd:.2f})"
        if state.consecutive_losses >= self._kill_streak:
            return False, f"consecutive-loss kill switch ({state.consecutive_losses} losses)"
        if intended_notional > self._max_notional:
            return False, (
                f"notional {intended_notional:.2f} exceeds cap {self._max_notional:.2f}"
            )
        return True, ""

    def record_fill(self, realized_pnl: float, state: RiskState) -> RiskState:
        """Update state after a fill. Halts if thresholds are crossed post-fill."""
        state.daily_pnl_usd += realized_pnl
        state.trades_today += 1
        if realized_pnl < 0:
            state.consecutive_losses += 1
        else:
            state.consecutive_losses = 0

        if state.consecutive_losses >= self._kill_streak and not state.halted:
            state.halted = True
            state.halt_reason = f"{state.consecutive_losses} consecutive losses"
        if -state.daily_pnl_usd >= self._drawdown_usd_floor and not state.halted:
            state.halted = True
            state.halt_reason = f"daily drawdown exceeded (pnl={state.daily_pnl_usd:.2f})"

        return state

    def reset_daily(self, state: RiskState) -> RiskState:
        """Reset intraday counters. Call at the start of each trading day."""
        state.daily_pnl_usd = 0.0
        state.consecutive_losses = 0
        state.trades_today = 0
        state.halted = False
        state.halt_reason = ""
        return state
