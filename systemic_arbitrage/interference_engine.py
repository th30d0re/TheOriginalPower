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
from systemic_arbitrage.spectral import compute_ox, interpolate_to_daily

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
    return float(preal.rolling(window=window_days, min_periods=30).quantile(0.90).iloc[-1])


def compute_signals(df: pd.DataFrame, config: dict, variables: dict) -> dict[str, Any]:
    """Compute O_x, P_real, T, V_E, tau, M_eff, and delta_P from trends data."""
    spectral_cfg = config.get("spectral", {})
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

    # P_real: low-frequency power of class-band signal, z-scored.
    _, preal_proxy, _ = compute_ox(
        class_window.values,
        sample_spacing_days=1.0,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
    )
    preal_series = zscore(class_window)
    preal = float(preal_series.iloc[-1])

    # O_x: high-frequency ratio of identity-band signal.
    ox, _, _ = compute_ox(
        identity_window.values,
        sample_spacing_days=1.0,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
    )

    # In Phase 2 V_E is not yet sourced from live suppression spend; use a
    # neutral z-score of zero as a placeholder. Phase 3/4 will wire live V_E.
    ve = 0.0

    # Effective threat and governing equation score.
    m_eff = preal * (1.0 - ox)
    tau = rolling_tau(preal_series, window_days=window_days)
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
