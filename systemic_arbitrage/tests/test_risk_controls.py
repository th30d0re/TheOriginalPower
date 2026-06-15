"""Unit tests for systemic_arbitrage.risk_controls."""

from __future__ import annotations

import pytest

from systemic_arbitrage.risk_controls import RiskControls, RiskState

_CONFIG = {
    "trading": {
        "max_daily_drawdown": 0.05,
        "max_single_trade_notional": 500,
        "kill_switch_consecutive_losses": 3,
        "portfolio_usd": 10_000,
    }
}

# With portfolio_usd=10_000 and max_daily_drawdown=0.05, the drawdown floor is $500.


def _controls() -> RiskControls:
    return RiskControls(_CONFIG)


def test_fresh_state_allows_trade():
    rc = _controls()
    allowed, reason = rc.check_trade(100.0, RiskState())
    assert allowed is True
    assert reason == ""


def test_notional_cap_blocks_trade():
    rc = _controls()
    allowed, reason = rc.check_trade(501.0, RiskState())
    assert allowed is False
    assert "cap" in reason or "exceeds" in reason


def test_notional_at_exact_cap_is_allowed():
    rc = _controls()
    allowed, _ = rc.check_trade(500.0, RiskState())
    assert allowed is True


def test_halted_state_blocks_all():
    rc = _controls()
    state = RiskState(halted=True, halt_reason="test halt")
    allowed, reason = rc.check_trade(10.0, state)
    assert allowed is False
    assert "halted" in reason


def test_consecutive_loss_kill_switch_triggers_at_three():
    rc = _controls()
    state = RiskState()
    # Two losses — still allowed.
    state = rc.record_fill(-10.0, state)
    state = rc.record_fill(-10.0, state)
    assert state.halted is False
    # Third loss crosses the threshold.
    state = rc.record_fill(-10.0, state)
    assert state.halted is True
    assert state.consecutive_losses == 3
    allowed, _ = rc.check_trade(50.0, state)
    assert allowed is False


def test_win_resets_consecutive_losses():
    rc = _controls()
    state = RiskState()
    state = rc.record_fill(-10.0, state)
    state = rc.record_fill(-10.0, state)
    assert state.consecutive_losses == 2
    state = rc.record_fill(5.0, state)
    assert state.consecutive_losses == 0
    assert state.halted is False


def test_daily_drawdown_halt():
    rc = _controls()
    state = RiskState()
    # A single large loss that exceeds the $500 floor.
    state = rc.record_fill(-500.0, state)
    assert state.halted is True
    assert "drawdown" in state.halt_reason
    allowed, _ = rc.check_trade(10.0, state)
    assert allowed is False


def test_drawdown_check_in_check_trade_without_record_fill():
    rc = _controls()
    state = RiskState(daily_pnl_usd=-600.0)
    allowed, reason = rc.check_trade(10.0, state)
    assert allowed is False
    assert "drawdown" in reason


def test_reset_daily_clears_all_counters():
    rc = _controls()
    state = RiskState(
        daily_pnl_usd=-200.0,
        consecutive_losses=2,
        trades_today=5,
        halted=True,
        halt_reason="some reason",
    )
    state = rc.reset_daily(state)
    assert state.daily_pnl_usd == 0.0
    assert state.consecutive_losses == 0
    assert state.trades_today == 0
    assert state.halted is False
    assert state.halt_reason == ""


def test_trades_today_increments():
    rc = _controls()
    state = RiskState()
    rc.record_fill(10.0, state)
    rc.record_fill(-5.0, state)
    assert state.trades_today == 2
