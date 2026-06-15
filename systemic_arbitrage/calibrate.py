"""Phase 1 historical calibration for the Systemic Arbitrage Engine.

Loads curated historical proxies and runs Test A (Concession vector,
1920–1935) and Test B (Neutralization vector, 1966–1971). Emits a JSON
report with pass/fail verdicts.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import yaml

PACKAGE_ROOT = Path(__file__).resolve().parent
DATA_HIST = PACKAGE_ROOT / "data" / "historical"
REPORTS_DIR = PACKAGE_ROOT / "data" / "reports"
CONFIG_PATH = PACKAGE_ROOT / "config.yaml"
VARIABLES_PATH = PACKAGE_ROOT / "variables.yaml"

ORDINAL_MAP = {"low": 1.0, "medium": 2.0, "high": 3.0}


def load_config() -> dict[str, Any]:
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def load_variables() -> dict[str, Any]:
    with open(VARIABLES_PATH) as f:
        return yaml.safe_load(f)


def load_historical_data() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    t_df = pd.read_csv(DATA_HIST / "T_proxy_annual.csv")
    ve_df = pd.read_csv(DATA_HIST / "V_E_proxy_annual.csv")
    e_df = pd.read_csv(DATA_HIST / "E_extraction_share.csv")
    comp_df = pd.read_csv(DATA_HIST / "mobilization_composition.csv")
    return t_df, ve_df, e_df, comp_df


def zscore(series: pd.Series) -> pd.Series:
    mean = series.mean()
    std = series.std()
    if std == 0 or pd.isna(std):
        return pd.Series(np.zeros(len(series)), index=series.index)
    return (series - mean) / std


def compute_t_composite(t_df: pd.DataFrame) -> pd.DataFrame:
    df = t_df.copy()
    df["strike_z"] = zscore(df["strike_days_idle"])
    df["union_z"] = zscore(df["union_density_pct"])
    df["mob_z"] = zscore(df["mobilization_index"])
    df["T"] = (df["strike_z"] + df["union_z"] + df["mob_z"]) / 3.0
    return df


def compute_ve_composite(ve_df: pd.DataFrame) -> pd.DataFrame:
    df = ve_df.copy()
    df["fbi_numeric"] = df["fbi_spend_ordinal"].map(ORDINAL_MAP)
    df["police_z"] = zscore(df["police_militarization_index"])
    df["fbi_z"] = zscore(df["fbi_numeric"])
    df["lobby_z"] = zscore(df["lobbying_index"])
    df["V_E"] = (df["police_z"] + df["fbi_z"] + df["lobby_z"]) / 3.0
    return df


def build_master_table(
    t_df: pd.DataFrame,
    ve_df: pd.DataFrame,
    e_df: pd.DataFrame,
    comp_df: pd.DataFrame,
) -> pd.DataFrame:
    t = compute_t_composite(t_df)
    ve = compute_ve_composite(ve_df)
    df = (
        t[["year", "T"]]
        .merge(ve[["year", "V_E"]], on="year")
        .merge(e_df[["year", "top_0_1_pct"]], on="year")
        .merge(comp_df[["year", "buffer_class_share", "out_group_share", "dominant_category"]], on="year")
    )
    # Phase 1: O_x is not used; set to 0 so M_eff = T.
    df["O_x"] = 0.0
    df["M_eff"] = df["T"] * (1.0 - df["O_x"])
    return df


def calibrate_tau(df: pd.DataFrame, test_a_window: list[int], test_b_window: list[int]) -> float:
    """Set tau to the lower of the two max effective threats observed just
    before each documented systemic response, plus a small threshold buffer so
    the anchor peaks sit just below the crash threshold.
    """
    a_slice = df[(df["year"] >= test_a_window[0]) & (df["year"] <= test_a_window[1])]
    b_slice = df[(df["year"] >= test_b_window[0]) & (df["year"] <= test_b_window[1])]
    # Use pre-response peak: through 1932 for Test A, through 1968 for Test B.
    a_peak = a_slice[a_slice["year"] <= 1932]["M_eff"].max()
    b_peak = b_slice[b_slice["year"] <= 1968]["M_eff"].max()
    return float(min(a_peak, b_peak) * 1.05)


def run_test_a(df: pd.DataFrame, tau: float, horizon_years: int) -> dict[str, Any]:
    window = df[(df["year"] >= 1920) & (df["year"] <= 1935)].copy()
    crossed = window[window["M_eff"] >= tau]
    predicted_response_year = int(crossed["year"].min()) if not crossed.empty else None

    extraction = window[["year", "top_0_1_pct"]].copy()
    extraction["delta"] = extraction["top_0_1_pct"].diff()
    pre_response = extraction[extraction["year"] <= 1935]
    max_fall_idx = pre_response["delta"].idxmin()
    max_fall_year = int(pre_response.loc[max_fall_idx, "year"]) if pd.notna(max_fall_idx) else None

    # Rebound: extraction share rises within horizon_years after the fall.
    rebound = False
    rebound_year = None
    if max_fall_year is not None:
        post = extraction[extraction["year"] > max_fall_year]
        horizon = post[post["year"] <= max_fall_year + horizon_years]
        if not horizon.empty and horizon["top_0_1_pct"].iloc[-1] > horizon["top_0_1_pct"].iloc[0]:
            rebound = True
            rebound_year = int(horizon["year"].iloc[-1])

    passed = (
        predicted_response_year is not None
        and abs(predicted_response_year - 1932) <= 2
        and max_fall_year is not None
        and rebound
    )

    return {
        "predicted_response_year": predicted_response_year,
        "actual_response_year": 1932,
        "extraction_share_max_fall_year": max_fall_year,
        "extraction_share_rebound": rebound,
        "extraction_share_rebound_year": rebound_year,
        "passed": passed,
    }


def run_test_b(df: pd.DataFrame, tau: float) -> dict[str, Any]:
    window = df[(df["year"] >= 1966) & (df["year"] <= 1971)].copy()
    # V_E growth must exceed T growth in the 1968-1971 sub-window.
    sub = window[window["year"] >= 1968]
    ve_growth = float(sub["V_E"].iloc[-1] - sub["V_E"].iloc[0])
    t_growth = float(sub["T"].iloc[-1] - sub["T"].iloc[0])

    # Extraction share must not fall below the Tier 1 trend (linear fit).
    extraction = window[["year", "top_0_1_pct"]].copy()
    x = extraction["year"].values
    y = extraction["top_0_1_pct"].values
    trend = np.polyval(np.polyfit(x, y, 1), x)
    extraction["trend"] = trend
    fell_below_trend = bool((extraction["top_0_1_pct"] < extraction["trend"] - 0.5).any())

    # M_eff must remain below tau while V_E rises.
    m_eff_below_tau = bool(window["M_eff"].max() < tau)

    # Identify the V_E spike year.
    spike_idx = window["V_E"].idxmax()
    predicted_ve_spike_year = int(window.loc[spike_idx, "year"]) if pd.notna(spike_idx) else None

    passed = ve_growth > t_growth and not fell_below_trend and m_eff_below_tau

    return {
        "predicted_ve_spike_year": predicted_ve_spike_year,
        "actual_ve_spike_year": 1969,
        "ve_growth_1968_1971": ve_growth,
        "t_growth_1968_1971": t_growth,
        "extraction_share_fell_below_trend": fell_below_trend,
        "m_eff_below_tau": m_eff_below_tau,
        "passed": passed,
    }


def main() -> int:
    config = load_config()
    variables = load_variables()
    t_df, ve_df, e_df, comp_df = load_historical_data()
    df = build_master_table(t_df, ve_df, e_df, comp_df)

    test_a_window = config["calibration"]["test_a_window"]
    test_b_window = config["calibration"]["test_b_window"]
    horizon_years = config["calibration"]["extraction_horizon_years"]

    tau = calibrate_tau(df, test_a_window, test_b_window)
    test_a = run_test_a(df, tau, horizon_years)
    test_b = run_test_b(df, tau)

    report = {
        "tau": round(tau, 4),
        "test_a": test_a,
        "test_b": test_b,
        "overall_pass": test_a["passed"] and test_b["passed"],
        "metadata": {
            "variables_version": variables.get("symbols", {}).get("T", {}).get("tier"),
            "calibration_mode": config["calibration"]["tau_calibration_mode"],
        },
    }

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / "calibration_report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    print(json.dumps(report, indent=2))

    if not report["overall_pass"]:
        print("\nCalibration FAILED", file=sys.stderr)
        return 1

    print("\nCalibration PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
