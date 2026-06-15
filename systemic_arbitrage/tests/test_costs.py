"""Unit tests for systemic_arbitrage.costs."""

import math

import pytest

from systemic_arbitrage.costs import (
    DEFAULT_COST_CONFIG,
    CostBreakdown,
    compute_costs,
    load_cost_config,
    total_cost_prob_terms,
)


def test_zero_cost_case():
    bd = compute_costs(
        fill_notional_usd=100.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=1_000_000.0,
        slippage_rate=0.5,
        max_slippage_frac=0.01,
    )
    assert bd.taker_fee_usd == pytest.approx(0.0)
    assert bd.half_spread_usd == pytest.approx(0.0)
    assert bd.slippage_usd == pytest.approx(0.005)
    assert bd.total_usd == pytest.approx(0.005)
    assert bd.aborted is False


def test_zero_cost_deep_book_no_abort():
    # With a truly negligible slippage (fill << book_depth), aborted stays False.
    bd = compute_costs(
        fill_notional_usd=1.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=1_000_000_000.0,
    )
    assert bd.aborted is False
    assert bd.total_usd == pytest.approx(5e-10, rel=1e-3)


def test_nonzero_taker_fee():
    bd = compute_costs(
        fill_notional_usd=1000.0,
        taker_fee_bps=20.0,  # 0.20 %
        half_spread_frac=0.0,
        book_depth_usd=1_000_000.0,
    )
    assert bd.taker_fee_usd == pytest.approx(2.0)
    assert bd.half_spread_usd == pytest.approx(0.0)


def test_half_spread_calculation():
    bd = compute_costs(
        fill_notional_usd=200.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.005,  # 0.5 %
        book_depth_usd=1_000_000.0,
    )
    assert bd.half_spread_usd == pytest.approx(1.0)


def test_slippage_linear_scaling():
    # slippage_frac = (100 / 10_000) * 0.5 = 0.005; slippage_usd = 100 * 0.005 = 0.5
    bd = compute_costs(
        fill_notional_usd=100.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=10_000.0,
        slippage_rate=0.5,
        max_slippage_frac=0.01,
    )
    assert bd.slippage_usd == pytest.approx(0.5)
    assert bd.aborted is False


def test_abort_when_slippage_exceeds_max():
    # slippage_frac = (500 / 1000) * 0.5 = 0.25 > 0.01 → abort
    bd = compute_costs(
        fill_notional_usd=500.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=1_000.0,
        slippage_rate=0.5,
        max_slippage_frac=0.01,
    )
    assert bd.aborted is True


def test_abort_at_exact_threshold_boundary():
    # slippage_frac = (200 / 10_000) * 0.5 = 0.01 — exactly at threshold, NOT aborted
    bd = compute_costs(
        fill_notional_usd=200.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=10_000.0,
        slippage_rate=0.5,
        max_slippage_frac=0.01,
    )
    assert bd.aborted is False


def test_total_cost_prob_terms_returns_inf_when_aborted():
    bd = compute_costs(
        fill_notional_usd=500.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=1_000.0,
        slippage_rate=0.5,
        max_slippage_frac=0.01,
    )
    assert bd.aborted is True
    assert total_cost_prob_terms(bd, entry_prob=0.6) == math.inf


def test_total_cost_prob_terms_correct_fraction():
    # total_usd = 2.0, fill_notional = 100.0, entry_prob = 0.5
    # potential_payout = 100 / 0.5 = 200
    # result = 2.0 / 200 = 0.01
    bd = compute_costs(
        fill_notional_usd=100.0,
        taker_fee_bps=20.0,  # 0.20% * 100 = 0.20 usd
        half_spread_frac=0.018,  # 1.8% * 100 = 1.80 usd
        book_depth_usd=1_000_000.0,  # slippage negligible
        slippage_rate=0.0,
    )
    # total = 0.20 + 1.80 + 0.0 = 2.0
    assert bd.total_usd == pytest.approx(2.0, abs=1e-6)
    result = total_cost_prob_terms(bd, entry_prob=0.5)
    assert result == pytest.approx(0.01)


def test_load_cost_config_defaults():
    cfg = load_cost_config({})
    assert cfg["taker_fee_bps"] == DEFAULT_COST_CONFIG["taker_fee_bps"]
    assert cfg["max_slippage_frac"] == DEFAULT_COST_CONFIG["max_slippage_frac"]


def test_load_cost_config_reads_values():
    cfg = load_cost_config({"costs": {"taker_fee_bps": 10.0, "max_slippage_frac": 0.02}})
    assert cfg["taker_fee_bps"] == pytest.approx(10.0)
    assert cfg["max_slippage_frac"] == pytest.approx(0.02)


def test_empty_book_aborts():
    bd = compute_costs(
        fill_notional_usd=100.0,
        taker_fee_bps=0.0,
        half_spread_frac=0.0,
        book_depth_usd=0.0,
    )
    assert bd.aborted is True
