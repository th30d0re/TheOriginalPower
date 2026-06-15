"""Tests for Phase 1 historical calibration."""

import json
from pathlib import Path

import pytest

from systemic_arbitrage.calibrate import (
    build_master_table,
    calibrate_tau,
    compute_t_composite,
    compute_ve_composite,
    load_historical_data,
    run_test_a,
    run_test_b,
)


def test_load_historical_data():
    t_df, ve_df, e_df, comp_df = load_historical_data()
    assert not t_df.empty
    assert not ve_df.empty
    assert not e_df.empty
    assert not comp_df.empty
    assert {"year"}.issubset(t_df.columns)
    assert {"year"}.issubset(ve_df.columns)


def test_composite_columns():
    t_df, ve_df, _, _ = load_historical_data()
    t = compute_t_composite(t_df)
    ve = compute_ve_composite(ve_df)
    assert "T" in t.columns
    assert "V_E" in ve.columns
    assert t["T"].notna().all()
    assert ve["V_E"].notna().all()


def test_tau_calibration():
    t_df, ve_df, e_df, comp_df = load_historical_data()
    df = build_master_table(t_df, ve_df, e_df, comp_df)
    tau = calibrate_tau(df, [1920, 1935], [1966, 1971])
    assert tau > 0
    assert df["M_eff"].max() >= tau


def test_test_a_concession_vector():
    t_df, ve_df, e_df, comp_df = load_historical_data()
    df = build_master_table(t_df, ve_df, e_df, comp_df)
    tau = calibrate_tau(df, [1920, 1935], [1966, 1971])
    result = run_test_a(df, tau, 10)
    assert result["passed"] is True
    assert result["predicted_response_year"] is not None
    assert abs(result["predicted_response_year"] - 1932) <= 2


def test_test_b_neutralization_vector():
    t_df, ve_df, e_df, comp_df = load_historical_data()
    df = build_master_table(t_df, ve_df, e_df, comp_df)
    tau = calibrate_tau(df, [1920, 1935], [1966, 1971])
    result = run_test_b(df, tau)
    assert result["passed"] is True
    assert result["ve_growth_1968_1971"] > result["t_growth_1968_1971"]
    assert result["m_eff_below_tau"] is True


def test_calibration_script_creates_report(tmp_path, monkeypatch):
    from systemic_arbitrage import calibrate as calibrate_module

    monkeypatch.setattr(calibrate_module, "REPORTS_DIR", tmp_path)
    code = calibrate_module.main()
    assert code == 0
    report_path = tmp_path / "calibration_report.json"
    assert report_path.exists()
    report = json.loads(report_path.read_text())
    assert report["overall_pass"] is True
    assert report["test_a"]["passed"] is True
    assert report["test_b"]["passed"] is True
