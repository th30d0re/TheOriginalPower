"""Regression and provenance tests for the L3 refit-stability machinery."""

from __future__ import annotations

import json

import pytest

from systemic_arbitrage.calibration_map import CalibrationMap
from systemic_arbitrage.fit_coefficients import (
    L3_MAX_RELATIVE_CHANGE,
    REPLAY_SOURCE,
    check_l3_readiness,
    fit_coefficients,
    load_closed_trades,
    refit_stability,
    replay_backtest_trades,
)


def _frozen_trade_log(tmp_path):
    outcomes = "000100100000100001111100101011"
    path = tmp_path / "frozen_closed_trades.jsonl"
    records = []
    for index, outcome in enumerate(outcomes):
        ox = 0.05 + index * (0.80 / 29)
        delta_p = -1.0 + index * (2.0 / 29) + 0.3 * __import__("math").sin(index)
        records.append({
            "trade_id": f"frozen-{index:02d}",
            "closed": True,
            "resolution_outcome": int(outcome),
            "signal_snapshot": {
                "O_x": ox,
                "P_real": 1.0,
                "T": 1.0,
                "delta_P": delta_p,
            },
        })
    path.write_text("".join(json.dumps(record) + "\n" for record in records))
    return path


def test_fitted_coefficients_are_pinned_on_frozen_trade_log(tmp_path):
    records = load_closed_trades(_frozen_trade_log(tmp_path))
    calibration = CalibrationMap(
        a=-0.2,
        b=1.1,
        delta_p_mean=0.0,
        delta_p_std=0.7,
        n_samples=100,
        fitted=True,
    )

    fitted = fit_coefficients(records, calibration)

    assert fitted.alpha == pytest.approx(1.1322010576, abs=1e-7)
    assert fitted.beta == pytest.approx(0.8020199170, abs=1e-7)
    assert fitted.n_trades == 30


def test_replay_and_stability_are_deterministic_and_provenance_tagged():
    records, calibration = replay_backtest_trades()
    first = refit_stability(
        records, calibration, source=REPLAY_SOURCE, subset_size=100, n_refits=3, seed=7
    )
    second = refit_stability(
        records, calibration, source=REPLAY_SOURCE, subset_size=100, n_refits=3, seed=7
    )

    assert len(records) == 538
    assert all(record["source"] == REPLAY_SOURCE for record in records)
    assert all(record["snapshot"]["source"] == REPLAY_SOURCE for record in records)
    assert first.to_dict() == second.to_dict()
    assert first.source == REPLAY_SOURCE
    assert set(first.coefficients) == {"alpha", "beta"}
    assert all(
        result["threshold"] == L3_MAX_RELATIVE_CHANGE
        for result in first.coefficients.values()
    )


def test_readiness_excludes_replayed_closed_trades(tmp_path):
    path = tmp_path / "trades.jsonl"
    records = [
        {"closed": True, "source": REPLAY_SOURCE},
        {"closed": True},
        {"closed": False},
    ]
    path.write_text("".join(json.dumps(record) + "\n" for record in records))

    readiness = check_l3_readiness(path)

    assert readiness.genuine_closed_trades == 1
    assert readiness.required_closed_trades == 100
    assert readiness.met is False


def test_malformed_closed_trade_is_loud(tmp_path):
    path = tmp_path / "trades.jsonl"
    path.write_text('{"closed": true, "resolution_outcome": 1}\n')

    with pytest.raises(ValueError, match="lacks signal_snapshot"):
        load_closed_trades(path)


def test_corrupt_fitted_coefficient_file_is_loud(monkeypatch, tmp_path):
    from systemic_arbitrage.fit_coefficients import FittedCoefficients

    path = tmp_path / "fitted_coefficients.json"
    path.write_text('{"alpha": 1.0}')
    monkeypatch.setattr("systemic_arbitrage.fit_coefficients.COEFFICIENTS_PATH", path)

    with pytest.raises(ValueError, match="Invalid fitted coefficient file"):
        FittedCoefficients.load()
