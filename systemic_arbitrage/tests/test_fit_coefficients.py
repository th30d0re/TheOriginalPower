"""Tests for fit_coefficients module."""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

import numpy as np
import pytest

from systemic_arbitrage.calibration_map import CalibrationMap
from systemic_arbitrage.fit_coefficients import (
    FittedCoefficients,
    fit_from_closed_trades,
    recompute_delta_p,
)


def _make_calib_map() -> CalibrationMap:
    rng = np.random.default_rng(42)
    delta_ps = rng.uniform(-2, 2, 30)
    outcomes = (delta_ps > 0).astype(float)
    cal = CalibrationMap()
    cal.fit(delta_ps, outcomes)
    return cal


def _write_trade_log(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


def _make_closed_trade(outcome: int, ox: float = 0.1, preal: float = 0.4, ve: float = 0.6) -> dict:
    return {
        "trade_id": "test",
        "closed": True,
        "resolution_outcome": outcome,
        "pnl_usd": 10.0 if outcome == 1 else -5.0,
        "signal_snapshot": {
            "O_x": ox,
            "P_real": preal,
            "V_E": ve,
            "delta_P": ve / max(preal * (1.0 - ox), 1e-6),
            "model_prob": 0.65,
        },
    }


def test_recompute_delta_p_zero_ve():
    snapshot = {"O_x": 0.1, "P_real": 0.5, "V_E": 0.0}
    assert recompute_delta_p(snapshot, alpha=1.0, beta=1.0) == 0.0


def test_recompute_delta_p_alpha_changes_result():
    snapshot = {"O_x": 0.0, "P_real": 0.5, "V_E": 1.0}
    result_a1 = recompute_delta_p(snapshot, alpha=1.0, beta=0.0)
    result_a2 = recompute_delta_p(snapshot, alpha=2.0, beta=0.0)
    assert result_a1 != result_a2
    assert abs(result_a1 - 2.0) < 1e-9
    assert abs(result_a2 - 1.0) < 1e-9


def test_fit_from_closed_trades_returns_defaults_when_insufficient():
    calib = _make_calib_map()
    with tempfile.TemporaryDirectory() as tmpdir:
        log_path = Path(tmpdir) / "trades.jsonl"
        _write_trade_log(log_path, [_make_closed_trade(1) for _ in range(5)])
        result = fit_from_closed_trades(log_path, calib, min_trades=10)
    assert result.fitted is False
    assert result.n_trades == 5


def test_fit_from_closed_trades_no_file():
    calib = _make_calib_map()
    result = fit_from_closed_trades(Path("/nonexistent/trades.jsonl"), calib)
    assert result.fitted is False


def test_fitted_coefficients_round_trip():
    coeffs = FittedCoefficients(
        alpha=1.23,
        beta=0.87,
        n_trades=50,
        brier_skill_improvement=0.04,
        fitted=True,
    )
    restored = FittedCoefficients.from_dict(coeffs.to_dict())
    assert restored.alpha == pytest.approx(1.23)
    assert restored.beta == pytest.approx(0.87)
    assert restored.n_trades == 50
    assert restored.brier_skill_improvement == pytest.approx(0.04)
    assert restored.fitted is True


def test_fitted_coefficients_load_returns_defaults_when_no_file(monkeypatch, tmp_path):
    fake_path = tmp_path / "nonexistent.json"
    monkeypatch.setattr(
        "systemic_arbitrage.fit_coefficients.COEFFICIENTS_PATH",
        fake_path,
    )
    coeffs = FittedCoefficients.load()
    assert coeffs.fitted is False
    assert coeffs.alpha == pytest.approx(1.0)
    assert coeffs.beta == pytest.approx(1.0)


def test_fit_from_closed_trades_with_enough_data():
    calib = _make_calib_map()
    trades = (
        [_make_closed_trade(1, ox=0.05, preal=0.4, ve=0.8) for _ in range(8)]
        + [_make_closed_trade(0, ox=0.3, preal=0.6, ve=0.2) for _ in range(7)]
    )
    with tempfile.TemporaryDirectory() as tmpdir:
        log_path = Path(tmpdir) / "trades.jsonl"
        _write_trade_log(log_path, trades)
        result = fit_from_closed_trades(log_path, calib, min_trades=10)

    assert result.n_trades == 15
    assert isinstance(result.alpha, float)
    assert isinstance(result.beta, float)
    assert 0.1 <= result.alpha <= 5.0
    assert 0.0 <= result.beta <= 2.0
