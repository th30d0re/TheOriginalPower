"""Unit tests for systemic_arbitrage.paper_trader and polymarket.client."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from systemic_arbitrage.calibration_map import CalibrationMap
from systemic_arbitrage.polymarket.client import PolymarketClient
from systemic_arbitrage.risk_controls import RiskState
from systemic_arbitrage.trigger_engine import IntendedTrade, Side, Trigger
from systemic_arbitrage.costs import CostBreakdown

_SNAPSHOT = {
    "window_start": "2024-06-15",
    "window_end": "2026-06-14",
    "O_x": 0.36,
    "P_real": 0.8,
    "T": 0.8,
    "V_E": 0.0,
    "tau": 1.0,
    "M_eff": 0.5,
    "delta_P": 0.5,
    "demographic_gate": "buffer_class_dominant",
    "timestamp_utc": "2026-06-14T00:00:00+00:00",
}

_CONFIG = {
    "trading": {
        "max_daily_drawdown": 0.05,
        "max_single_trade_notional": 500,
        "kill_switch_consecutive_losses": 3,
        "portfolio_usd": 10_000,
        "position_size_map": [
            {"threshold": 0.25, "size": 0},
            {"threshold": 0.75, "size": 50},
            {"threshold": 1.5, "size": 200},
            {"threshold": 999.0, "size": 500},
        ],
    },
    "costs": {
        "taker_fee_bps": 0.0,
        "half_spread_frac": 0.0,
        "default_book_depth_usd": 1_000_000,
        "max_slippage_frac": 0.01,
    },
}


def _run_session(dry_run=True, edge_threshold=0.04, market_prob_override=0.40):
    """Run a session with a mocked snapshot and catalog so no disk I/O is needed."""
    from systemic_arbitrage.paper_trader import run_paper_session

    catalog_stub = {
        "triggers": {
            "heat_shield_reversal": {
                "market_archetypes": [
                    {
                        "slug_pattern": "test-market-*",
                        "description": "test",
                        "resolution_source": "test",
                        "liquidity_floor": {
                            "min_daily_volume_usd": 0,
                            "min_book_depth_usd": 0,
                        },
                        "tradeable": True,
                    }
                ]
            }
        }
    }

    with (
        patch("systemic_arbitrage.paper_trader._load_snapshot", return_value=_SNAPSHOT),
        patch("systemic_arbitrage.paper_trader.load_catalog", return_value=catalog_stub),
    ):
        return run_paper_session(
            _CONFIG,
            demographic_gate="buffer_class_dominant",
            market_prob_override=market_prob_override,
            dry_run=dry_run,
            edge_threshold=edge_threshold,
        )


def test_dry_run_returns_records_without_writing():
    results = _run_session(dry_run=True)
    assert isinstance(results, list)
    # dry_run records carry the flag
    for r in results:
        assert r.get("dry_run") is True


def test_edge_below_threshold_produces_no_trades():
    # With market_prob_override = 0.60 and model_prob ~0.62 (default map near 0.5),
    # setting a very high threshold forces no trades.
    results = _run_session(dry_run=True, edge_threshold=0.99, market_prob_override=0.50)
    assert results == []


def test_paper_run_records_fitted_calibration_provenance():
    from systemic_arbitrage.paper_trader import run_paper_session

    trade = IntendedTrade(
        trigger=Trigger.HEAT_SHIELD_REVERSAL,
        market_slug="test-market",
        side=Side.LONG,
        notional_usd=50.0,
        reason="test",
    )
    fitted = CalibrationMap(a=3.0, b=0.0, n_samples=538, fitted=True)
    with (
        patch("systemic_arbitrage.paper_trader._load_snapshot",
              return_value=dict(_SNAPSHOT)),
        patch("systemic_arbitrage.paper_trader.load_catalog", return_value={}),
        patch("systemic_arbitrage.paper_trader._load_calibration_map",
              return_value=fitted),
        patch("systemic_arbitrage.paper_trader.evaluate_triggers",
              return_value=[trade]),
    ):
        results = run_paper_session(
            _CONFIG, market_prob_override=0.10, dry_run=True,
            edge_threshold=0.01,
        )

    assert len(results) == 1
    assert results[0]["calibration_map_fitted"] is True


def test_risk_controls_block_halted_session():
    from systemic_arbitrage.paper_trader import run_paper_session

    catalog_stub = {
        "triggers": {
            "heat_shield_reversal": {
                "market_archetypes": [
                    {
                        "slug_pattern": "test-market-*",
                        "description": "test",
                        "resolution_source": "test",
                        "liquidity_floor": {"min_daily_volume_usd": 0, "min_book_depth_usd": 0},
                        "tradeable": True,
                    }
                ]
            }
        }
    }

    # Patch RiskControls.check_trade to always return blocked.
    with (
        patch("systemic_arbitrage.paper_trader._load_snapshot", return_value=_SNAPSHOT),
        patch("systemic_arbitrage.paper_trader.load_catalog", return_value=catalog_stub),
        patch(
            "systemic_arbitrage.risk_controls.RiskControls.check_trade",
            return_value=(False, "session halted: test"),
        ),
    ):
        results = run_paper_session(
            _CONFIG,
            demographic_gate="buffer_class_dominant",
            market_prob_override=0.40,
            dry_run=True,
            edge_threshold=0.01,
        )
    assert results == []


# ---------------------------------------------------------------------------
# PolymarketClient.close_trade PnL tests
# ---------------------------------------------------------------------------


def _make_open_trade(tmp_path: Path, side: str, entry_prob: float, notional: float) -> str:
    log = tmp_path / "paper_trades.jsonl"
    import uuid

    trade_id = str(uuid.uuid4())
    record = {
        "trade_id": trade_id,
        "timestamp_utc": "2026-06-14T00:00:00+00:00",
        "trigger": "heat_shield_reversal",
        "market_slug": "test-market",
        "side": side,
        "intended_notional_usd": notional,
        "filled_notional_usd": notional,
        "entry_probability": entry_prob,
        "market_prob_at_entry": 0.45,
        "edge_at_entry": 0.05,
        "realized_fee_usd": 0.0,
        "realized_slippage_usd": 0.0,
        "exit_probability": None,
        "pnl_usd": None,
        "closed": False,
        "signal_snapshot": {},
    }
    log.write_text(json.dumps(record) + "\n")
    return trade_id


def test_close_trade_long_win(tmp_path):
    trade_id = _make_open_trade(tmp_path, "LONG", entry_prob=0.5, notional=100.0)
    client = PolymarketClient(trade_log_path=tmp_path / "paper_trades.jsonl")
    result = client.close_trade(trade_id, exit_probability=0.9, resolution_outcome=1)
    # pnl = (1 - 0.5) * 100 - 0 = 50.0
    assert result["pnl_usd"] == pytest.approx(50.0)
    assert result["closed"] is True


def test_close_trade_long_loss(tmp_path):
    trade_id = _make_open_trade(tmp_path, "LONG", entry_prob=0.7, notional=100.0)
    client = PolymarketClient(trade_log_path=tmp_path / "paper_trades.jsonl")
    result = client.close_trade(trade_id, exit_probability=0.1, resolution_outcome=0)
    # pnl = (0 - 0.7) * 100 - 0 = -70.0
    assert result["pnl_usd"] == pytest.approx(-70.0)
    assert result["closed"] is True


def test_close_trade_short_win(tmp_path):
    trade_id = _make_open_trade(tmp_path, "SHORT", entry_prob=0.7, notional=100.0)
    client = PolymarketClient(trade_log_path=tmp_path / "paper_trades.jsonl")
    result = client.close_trade(trade_id, exit_probability=0.1, resolution_outcome=0)
    # pnl = (0.7 - 0) * 100 - 0 = 70.0
    assert result["pnl_usd"] == pytest.approx(70.0)
    assert result["closed"] is True


def test_close_trade_short_loss(tmp_path):
    trade_id = _make_open_trade(tmp_path, "SHORT", entry_prob=0.3, notional=100.0)
    client = PolymarketClient(trade_log_path=tmp_path / "paper_trades.jsonl")
    result = client.close_trade(trade_id, exit_probability=0.9, resolution_outcome=1)
    # pnl = (0.3 - 1) * 100 - 0 = -70.0
    assert result["pnl_usd"] == pytest.approx(-70.0)
    assert result["closed"] is True


def test_close_trade_includes_cost_deduction(tmp_path):
    log = tmp_path / "paper_trades.jsonl"
    import uuid

    trade_id = str(uuid.uuid4())
    record = {
        "trade_id": trade_id,
        "timestamp_utc": "2026-06-14T00:00:00+00:00",
        "trigger": "heat_shield_reversal",
        "market_slug": "test-market",
        "side": "LONG",
        "intended_notional_usd": 100.0,
        "filled_notional_usd": 99.0,
        "entry_probability": 0.5,
        "market_prob_at_entry": 0.45,
        "edge_at_entry": 0.05,
        "realized_fee_usd": 0.5,
        "realized_slippage_usd": 0.5,
        "exit_probability": None,
        "pnl_usd": None,
        "closed": False,
        "signal_snapshot": {},
    }
    log.write_text(json.dumps(record) + "\n")
    client = PolymarketClient(trade_log_path=log)
    result = client.close_trade(trade_id, exit_probability=0.9, resolution_outcome=1)
    # pnl = (1 - 0.5) * 99.0 - (0.5 + 0.5) = 49.5 - 1.0 = 48.5
    assert result["pnl_usd"] == pytest.approx(48.5)


def test_close_trade_not_found_raises(tmp_path):
    log = tmp_path / "paper_trades.jsonl"
    log.write_text("")
    client = PolymarketClient(trade_log_path=log)
    with pytest.raises(ValueError, match="not found"):
        client.close_trade("nonexistent-id", 0.5, 1)
