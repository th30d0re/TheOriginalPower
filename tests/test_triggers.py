"""Tests for Phase 3 trigger engine stubs."""

import json

import pytest

from systemic_arbitrage.polymarket.client import PolymarketClient
from systemic_arbitrage.trigger_engine import (
    Side,
    Trigger,
    evaluate_triggers,
)


def _snapshot(ox: float, preal: float, tau: float, delta_p: float) -> dict:
    return {
        "O_x": ox,
        "P_real": preal,
        "T": preal,
        "V_E": 0.0,
        "tau": tau,
        "M_eff": preal * (1.0 - ox),
        "delta_P": delta_p,
        "demographic_gate": "unavailable",
    }


def test_heat_shield_reversal_trigger():
    config = {"trading": {"position_size_map": [
        {"threshold": 0.25, "size": 0},
        {"threshold": 0.75, "size": 50},
        {"threshold": 1.5, "size": 200},
        {"threshold": 999.0, "size": 500},
    ]}}
    snapshot = _snapshot(ox=0.2, preal=1.5, tau=1.0, delta_p=1.0)
    trades = evaluate_triggers(snapshot, config, demographic_gate="buffer_class_dominant")
    assert len(trades) == 1
    assert trades[0].trigger == Trigger.HEAT_SHIELD_REVERSAL
    assert trades[0].side == Side.LONG


def test_cointelpro_metric_trigger():
    config = {"trading": {"position_size_map": [
        {"threshold": 0.25, "size": 0},
        {"threshold": 0.75, "size": 50},
        {"threshold": 1.5, "size": 200},
        {"threshold": 999.0, "size": 500},
    ]}}
    snapshot = _snapshot(ox=0.2, preal=1.5, tau=1.0, delta_p=1.0)
    trades = evaluate_triggers(snapshot, config, demographic_gate="out_group_dominant")
    assert len(trades) == 2
    assert any(t.side == Side.SHORT and t.market_slug == "reform" for t in trades)
    assert any(t.side == Side.LONG and t.market_slug == "defense-surveillance-police" for t in trades)


def test_interference_spike_trigger():
    config = {"trading": {"position_size_map": [
        {"threshold": 0.25, "size": 0},
        {"threshold": 0.75, "size": 50},
        {"threshold": 1.5, "size": 200},
        {"threshold": 999.0, "size": 500},
    ]}}
    snapshot = _snapshot(ox=0.9, preal=0.2, tau=1.0, delta_p=0.5)
    trades = evaluate_triggers(snapshot, config, market_implied_change=0.20)
    assert len(trades) == 1
    assert trades[0].trigger == Trigger.INTERFERENCE_SPIKE
    assert trades[0].side == Side.SHORT


def test_no_trigger_when_thresholds_not_met():
    config = {"trading": {"position_size_map": [
        {"threshold": 0.25, "size": 0},
        {"threshold": 0.75, "size": 50},
        {"threshold": 1.5, "size": 200},
        {"threshold": 999.0, "size": 500},
    ]}}
    snapshot = _snapshot(ox=0.2, preal=0.2, tau=1.0, delta_p=0.0)
    trades = evaluate_triggers(snapshot, config)
    assert len(trades) == 0


def test_polymarket_client_dry_run(tmp_path):
    log_path = tmp_path / "paper_trades.jsonl"
    client = PolymarketClient(trade_log_path=log_path)
    from systemic_arbitrage.trigger_engine import IntendedTrade
    trade = IntendedTrade(
        trigger=Trigger.HEAT_SHIELD_REVERSAL,
        market_slug="reform",
        side=Side.LONG,
        notional_usd=100.0,
        reason="test",
    )
    record = client.place_trade(trade)
    assert record["side"] == "LONG"
    assert log_path.exists()
    lines = log_path.read_text().strip().splitlines()
    assert len(lines) == 1
    parsed = json.loads(lines[0])
    assert parsed["closed"] is False


def test_polymarket_client_live_raises(monkeypatch):
    monkeypatch.setenv("SYSTEMIC_ARBITRAGE_LIVE", "1")
    client = PolymarketClient()
    from systemic_arbitrage.trigger_engine import IntendedTrade
    trade = IntendedTrade(
        trigger=Trigger.HEAT_SHIELD_REVERSAL,
        market_slug="reform",
        side=Side.LONG,
        notional_usd=100.0,
        reason="test",
    )
    with pytest.raises(NotImplementedError):
        client.place_trade(trade)
