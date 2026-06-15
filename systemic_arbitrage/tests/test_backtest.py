from __future__ import annotations

import math
import numpy as np
import pytest

from systemic_arbitrage.backtest import (
    _wilson_ci,
    _brier_score,
    promotion_decision,
)


def test_promotion_decision_passes():
    report = {
        "aggregate": {
            "edge_ci_excludes_zero": True,
            "brier_skill": 0.15,
            "beats_momentum": True,
            "beats_market": True,
        }
    }
    result = promotion_decision(report)
    assert result["promote"] is True
    assert "all gates passed" in result["reasons"]


def test_promotion_decision_fails_no_edge():
    report = {
        "aggregate": {
            "edge_ci_excludes_zero": False,
            "brier_skill": 0.15,
            "beats_momentum": True,
            "beats_market": True,
        }
    }
    result = promotion_decision(report)
    assert result["promote"] is False
    assert any("edge CI" in r for r in result["reasons"])


def test_promotion_decision_fails_negative_skill():
    report = {
        "aggregate": {
            "edge_ci_excludes_zero": True,
            "brier_skill": -0.05,
            "beats_momentum": True,
            "beats_market": False,
        }
    }
    result = promotion_decision(report)
    assert result["promote"] is False
    assert any("brier_skill" in r for r in result["reasons"])


def test_promotion_decision_fails_momentum():
    report = {
        "aggregate": {
            "edge_ci_excludes_zero": True,
            "brier_skill": 0.10,
            "beats_momentum": False,
            "beats_market": True,
        }
    }
    result = promotion_decision(report)
    assert result["promote"] is False
    assert any("momentum" in r for r in result["reasons"])


def test_wilson_ci_coverage():
    lo, hi = _wilson_ci(50, 100)
    assert lo < 0.5 < hi
    assert lo > 0.3 and hi < 0.7


def test_wilson_ci_zero_n():
    lo, hi = _wilson_ci(0, 0)
    assert math.isnan(lo) and math.isnan(hi)


def test_wilson_ci_perfect_hit():
    lo, hi = _wilson_ci(100, 100)
    # CI should be strictly positive and below 1
    assert lo > 0
    assert hi <= 1.0


def test_brier_score_perfect():
    probs = np.array([1.0, 0.0, 1.0, 0.0])
    outcomes = np.array([1.0, 0.0, 1.0, 0.0])
    assert abs(_brier_score(probs, outcomes)) < 1e-12


def test_brier_score_worst():
    probs = np.array([0.0, 1.0])
    outcomes = np.array([1.0, 0.0])
    assert abs(_brier_score(probs, outcomes) - 1.0) < 1e-12


def test_brier_score_coin():
    probs = np.full(100, 0.5)
    outcomes = np.concatenate([np.ones(50), np.zeros(50)])
    assert abs(_brier_score(probs, outcomes) - 0.25) < 1e-12


def test_brier_skill_positive_means_model_beats_market():
    # model closer to truth → lower Brier → skill > 0
    model = np.array([0.9, 0.1, 0.8, 0.2])
    market = np.array([0.5, 0.5, 0.5, 0.5])
    outcomes = np.array([1.0, 0.0, 1.0, 0.0])
    bs_model = _brier_score(model, outcomes)
    bs_market = _brier_score(market, outcomes)
    skill = 1 - bs_model / bs_market
    assert skill > 0
