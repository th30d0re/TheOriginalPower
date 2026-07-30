"""Regression tests for the backtest-report calibration contract."""

from __future__ import annotations

import json

import pytest

from systemic_arbitrage import live_executor, paper_trader


LOADERS = (
    (paper_trader, paper_trader._load_calibration_map),
    (live_executor, live_executor._load_calibration_map),
)


def _fitted_map(a: float = 2.25) -> dict:
    return {"a": a, "b": -0.5, "delta_p_mean": 0.1,
            "delta_p_std": 0.2, "n_samples": 538, "fitted": True}


@pytest.mark.parametrize(("module", "loader"), LOADERS)
def test_loader_matches_backtest_output_filename(tmp_path, monkeypatch, module, loader):
    report = {"aggregate": {"calibration_final": _fitted_map()}}
    (tmp_path / "backtest_20260730_120000.json").write_text(json.dumps(report))
    monkeypatch.setattr(module, "_REPORTS_DIR", tmp_path)
    calibration = loader()
    assert calibration.fitted is True
    assert calibration.a == pytest.approx(2.25)


@pytest.mark.parametrize(("module", "loader"), LOADERS)
def test_loader_uses_aggregate_calibration_final(tmp_path, monkeypatch, module, loader):
    report = {
        "calibration_map": _fitted_map(a=99.0),
        "aggregate": {"calibration_final": _fitted_map(a=-0.4079275386)},
    }
    (tmp_path / "backtest_20260730_120001.json").write_text(json.dumps(report))
    monkeypatch.setattr(module, "_REPORTS_DIR", tmp_path)
    assert loader().a == pytest.approx(-0.4079275386)


@pytest.mark.parametrize(("module", "loader"), LOADERS)
def test_loader_warns_when_report_glob_is_empty(
    tmp_path, monkeypatch, caplog, module, loader,
):
    monkeypatch.setattr(module, "_REPORTS_DIR", tmp_path)
    assert loader().fitted is False
    assert "backtest_*.json" in caplog.text
    assert str(tmp_path) in caplog.text


@pytest.mark.parametrize(("module", "loader"), LOADERS)
def test_loader_warns_when_fitted_map_is_missing(
    tmp_path, monkeypatch, caplog, module, loader,
):
    path = tmp_path / "backtest_20260730_120002.json"
    path.write_text(json.dumps({"aggregate": {}}))
    monkeypatch.setattr(module, "_REPORTS_DIR", tmp_path)
    assert loader().fitted is False
    assert "aggregate.calibration_final" in caplog.text
