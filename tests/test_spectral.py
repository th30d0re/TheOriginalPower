"""Tests for Phase 2 spectral signal processing."""

import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from systemic_arbitrage.interference_engine import compute_signals, load_config, load_variables
from systemic_arbitrage.spectral import compute_ox, interpolate_to_daily


def test_interpolate_to_daily():
    idx = pd.date_range("2024-01-01", periods=5, freq="W")
    series = pd.Series([1.0, 2.0, 3.0, 4.0, 5.0], index=idx)
    daily = interpolate_to_daily(series, interpolation_limit_days=7)
    assert len(daily) > len(series)
    assert daily.isna().sum() == 0


def test_compute_ox_pure_low_frequency():
    """A pure annual sine wave should yield O_x near zero."""
    t = np.arange(730)
    samples = np.sin(2 * np.pi * t / 365.0)
    ox, preal, total = compute_ox(samples)
    assert ox < 0.2
    assert preal > 0.6
    assert total > 0


def test_compute_ox_pure_high_frequency():
    """A pure 3-day oscillation should yield O_x near one."""
    t = np.arange(730)
    samples = np.sin(2 * np.pi * t / 3.0)
    ox, preal, total = compute_ox(samples)
    assert ox > 0.6
    assert preal < 0.3
    assert total > 0


def test_compute_ox_clipped_to_unit_interval():
    samples = np.random.rand(730)
    ox, _, _ = compute_ox(samples)
    assert 0.0 <= ox <= 1.0


def test_compute_signals_snapshot():
    config = load_config()
    variables = load_variables()
    n = config["spectral"]["window_days"]
    dates = pd.date_range(end=pd.Timestamp.today().normalize(), periods=n, freq="D")
    t = np.arange(n)

    # class_band: annual signal (low frequency)
    class_band = 50 + 30 * np.sin(2 * np.pi * t / 365) + np.random.normal(0, 2, n)
    # identity_band: weekly spikes (high frequency)
    identity_band = np.zeros(n)
    identity_band[::7] = np.random.uniform(40, 90, n // 7 + 1)[: n // 7 + 1]
    identity_band += np.random.normal(0, 2, n)

    df = pd.DataFrame(
        {"class_band": class_band, "identity_band": identity_band},
        index=dates,
    )
    snapshot = compute_signals(df, config, variables)

    assert "O_x" in snapshot
    assert "P_real" in snapshot
    assert "tau" in snapshot
    assert 0.0 <= snapshot["O_x"] <= 1.0
    assert snapshot["P_real"] != 0.0


def test_interference_engine_writes_snapshot(tmp_path, monkeypatch):
    from systemic_arbitrage import interference_engine as engine

    monkeypatch.setattr(engine, "LIVE_DIR", tmp_path)
    code = engine.main()
    assert code == 0
    snapshot_path = tmp_path / "signal_snapshot.json"
    assert snapshot_path.exists()
    snapshot = json.loads(snapshot_path.read_text())
    assert "O_x" in snapshot
    assert 0.0 <= snapshot["O_x"] <= 1.0
