"""Tests for live_executor module."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

import pytest

from systemic_arbitrage.live_executor import (
    _check_promotion_gates,
    _require_live_flag,
    execute_live_session,
)


def test_require_live_flag_raises_when_unset(monkeypatch):
    monkeypatch.delenv("SYSTEMIC_ARBITRAGE_LIVE", raising=False)
    with pytest.raises(RuntimeError, match="SYSTEMIC_ARBITRAGE_LIVE=1"):
        _require_live_flag()


def test_require_live_flag_does_not_raise_when_set(monkeypatch):
    monkeypatch.setenv("SYSTEMIC_ARBITRAGE_LIVE", "1")
    _require_live_flag()


def _minimal_config(min_closed: int = 200) -> dict:
    return {
        "trading": {
            "promotion_gate": {
                "min_closed_trades": min_closed,
            }
        },
        "paths": {},
    }


def test_check_promotion_gates_fails_when_insufficient_closed_trades():
    config = _minimal_config(min_closed=200)
    with tempfile.TemporaryDirectory() as tmpdir:
        log_path = Path(tmpdir) / "trades.jsonl"
        records = [
            json.dumps({"closed": True, "pnl_usd": 5.0}) + "\n"
            for _ in range(10)
        ]
        log_path.write_text("".join(records))
        gates_pass, reasons = _check_promotion_gates(config, log_path)

    assert gates_pass is False
    assert any("min_closed_trades" in r for r in reasons)


def test_check_promotion_gates_fails_when_no_trade_log():
    config = _minimal_config(min_closed=200)
    gates_pass, reasons = _check_promotion_gates(config, Path("/nonexistent/trades.jsonl"))
    assert gates_pass is False
    assert any("min_closed_trades" in r for r in reasons)


def test_execute_live_session_raises_runtime_error_without_live_flag(monkeypatch):
    monkeypatch.delenv("SYSTEMIC_ARBITRAGE_LIVE", raising=False)
    config = _minimal_config()
    with pytest.raises(RuntimeError, match="SYSTEMIC_ARBITRAGE_LIVE=1"):
        execute_live_session(config=config, fitted_coefficients=None)


def test_execute_live_session_raises_not_implemented_after_gates_fail(monkeypatch):
    monkeypatch.setenv("SYSTEMIC_ARBITRAGE_LIVE", "1")
    config = _minimal_config(min_closed=200)
    with pytest.raises(RuntimeError, match="Promotion gates not met"):
        execute_live_session(
            config=config,
            fitted_coefficients=None,
        )
