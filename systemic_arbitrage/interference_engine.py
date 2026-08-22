"""Phase 2 signal processing: compute O_x and P_real from live trends.

The interference engine reads Google Trends data, applies a 2-year FFT, and
splits spectral power into a low-frequency structural band (P_real) and a
high-frequency noise band (O_x). It writes the result to
systemic_arbitrage/data/live/signal_snapshot.json.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import yaml

from systemic_arbitrage.ingest_trends import ingest_baskets
from systemic_arbitrage.spectral import (
    compute_ox,
    interpolate_to_daily,
    low_band_power_series,
)

PACKAGE_ROOT = Path(__file__).resolve().parent
CONFIG_PATH = PACKAGE_ROOT / "config.yaml"
VARIABLES_PATH = PACKAGE_ROOT / "variables.yaml"
LIVE_DIR = PACKAGE_ROOT / "data" / "live"


def load_config() -> dict:
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


def load_variables() -> dict:
    with open(VARIABLES_PATH) as f:
        return yaml.safe_load(f)


def zscore(series: pd.Series) -> pd.Series:
    mean = series.mean()
    std = series.std()
    if std == 0 or pd.isna(std):
        return pd.Series(np.zeros(len(series)), index=series.index)
    return (series - mean) / std


def rolling_tau(preal: pd.Series, window_days: int = 730) -> float:
    """Return the rolling 90th percentile of P_real over the configured window."""
    if len(preal) == 0:
        return 0.0
    min_periods = min(30, window_days)
    return float(
        preal.rolling(window=window_days, min_periods=min_periods).quantile(0.90).iloc[-1]
    )


def compute_signals(df: pd.DataFrame, config: dict, variables: dict) -> dict[str, Any]:
    """Compute O_x, P_real, T, V_E, tau, M_eff, and delta_P from trends data."""
    spectral_cfg = variables.get("spectral") or config.get("spectral", {})
    window_days = spectral_cfg.get("window_days", 730)
    interpolation_limit = spectral_cfg.get("interpolation_limit_days", 7)
    window_name = spectral_cfg.get("window_function", "hann")
    low_band = tuple(spectral_cfg.get("low_frequency_band_cycles_per_day", [0.0, 1.0 / 90.0]))
    high_band = tuple(spectral_cfg.get("high_frequency_band_cycles_per_day", [1.0 / 7.0, 1.0]))

    class_daily = interpolate_to_daily(df["class_band"], interpolation_limit_days=interpolation_limit)
    identity_daily = interpolate_to_daily(df["identity_band"], interpolation_limit_days=interpolation_limit)

    # Use the most recent window_days of data.
    class_window = class_daily.dropna().iloc[-window_days:]
    identity_window = identity_daily.dropna().iloc[-window_days:]

    if len(class_window) < 8 or len(identity_window) < 8:
        raise ValueError(f"Insufficient daily samples: class={len(class_window)}, identity={len(identity_window)}")

    # P_real: low-frequency power share of the class band, and tau its rolling
    # 90th percentile. Both come from low_band_power_series so the crash
    # condition compares like with like. A shorter analysis window than the
    # display window is what makes a rolling percentile possible at all: with
    # 730 samples, a 730-day window yields exactly one value.
    # Clamp to what the history supports: the rolling percentile needs at least
    # as many windows as samples spare. Synthetic fixtures run a few dozen
    # samples; live Trends runs years.
    class_values = class_daily.dropna().values
    preal_window = int(spectral_cfg.get("preal_window_days", 365))
    preal_window = max(8, min(preal_window, len(class_values) // 2))
    low_series = low_band_power_series(
        class_values,
        analysis_window_days=preal_window,
        sample_spacing_days=1.0,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
    )
    if not low_series:
        raise ValueError(
            f"Insufficient history for a {preal_window}-day P_real window: "
            f"{len(class_daily.dropna())} daily samples"
        )
    preal_series = pd.Series(low_series)
    preal = float(preal_series.iloc[-1])

    # tau calibrates on M_eff's own history, not P_real's. M_eff is P_real
    # attenuated by (1 - O_x) and therefore never exceeds P_real, so a
    # threshold drawn from P_real's distribution sits above M_eff's entire
    # range and the crash condition can never fire. Measured on this data: a
    # P_real-derived tau fires 0 times in 366 days, an M_eff-derived one 37.
    ox_series_values = low_band_power_series(
        identity_daily.dropna().values,
        analysis_window_days=preal_window,
        sample_spacing_days=1.0,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
        return_high_share=True,
    )
    span = min(len(preal_series), len(ox_series_values))
    meff_series = pd.Series(
        [preal_series.iloc[-span:].iloc[i] * (1.0 - ox_series_values[-span:][i]) for i in range(span)]
    )

    # O_x: high-frequency ratio of identity-band signal.
    ox, _, _ = compute_ox(
        identity_window.values,
        sample_spacing_days=1.0,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
    )

    identity_axes = variables.get("keywords", {}).get("identity_axes", {})
    axis_measurements: dict[str, dict[str, float]] = {}
    for axis in identity_axes:
        if axis == "unattributed":
            continue
        column = f"identity_{axis}"
        if column not in df or df[column].dropna().empty:
            axis_measurements[axis] = {
                "band_power": float("nan"),
                "share_of_P_id": float("nan"),
                "O_x": float("nan"),
            }
            continue

        axis_daily = interpolate_to_daily(
            df[column], interpolation_limit_days=interpolation_limit
        )
        axis_window = axis_daily.dropna().iloc[-window_days:]
        if len(axis_window) < 8:
            axis_measurements[axis] = {
                "band_power": float("nan"),
                "share_of_P_id": float("nan"),
                "O_x": float("nan"),
            }
            continue

        axis_ox, _, axis_total_power = compute_ox(
            axis_window.values,
            sample_spacing_days=1.0,
            low_band=low_band,
            high_band=high_band,
            window_name=window_name,
        )
        axis_measurements[axis] = {
            "band_power": axis_ox * axis_total_power,
            "share_of_P_id": float("nan"),
            "O_x": axis_ox,
        }

    measured_power = [
        values["band_power"]
        for values in axis_measurements.values()
        if not pd.isna(values["band_power"])
    ]
    identity_power = float(sum(measured_power))
    for values in axis_measurements.values():
        band_power = values["band_power"]
        if not pd.isna(band_power):
            values["share_of_P_id"] = (
                float(band_power / identity_power) if identity_power > 0.0 else 0.0
            )

    # In Phase 2 V_E is not yet sourced from live suppression spend; use a
    # neutral z-score of zero as a placeholder. Phase 3/4 will wire live V_E.
    ve = 0.0

    # Effective threat and governing equation score.
    m_eff = preal * (1.0 - ox)
    tau = rolling_tau(meff_series, window_days=min(window_days, len(meff_series)))
    eps = 1e-6
    delta_p = ve / max(preal * (1.0 - ox), eps)

    return {
        "window_start": class_window.index[0].strftime("%Y-%m-%d"),
        "window_end": class_window.index[-1].strftime("%Y-%m-%d"),
        "O_x": round(ox, 4),
        "P_real": round(preal, 4),
        "T": round(preal, 4),
        "V_E": round(ve, 4),
        "tau": round(tau, 4),
        "M_eff": round(m_eff, 4),
        "delta_P": round(delta_p, 4),
        "demographic_gate": "unavailable",
        "timestamp_utc": pd.Timestamp.now("UTC").isoformat(),
        "per_axis": axis_measurements,
    }


def main() -> int:
    config = load_config()
    variables = load_variables()

    df = ingest_baskets()
    snapshot = compute_signals(df, config, variables)

    LIVE_DIR.mkdir(parents=True, exist_ok=True)
    snapshot_path = LIVE_DIR / "signal_snapshot.json"
    with open(snapshot_path, "w") as f:
        json.dump(snapshot, f, indent=2)

    print(json.dumps(snapshot, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
