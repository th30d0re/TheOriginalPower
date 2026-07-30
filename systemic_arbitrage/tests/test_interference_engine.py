"""Golden-file coverage for interference and spectral signal processing."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from systemic_arbitrage.interference_engine import compute_signals
from systemic_arbitrage.spectral import compute_ox, compute_ox_preindex


FIXTURE_PATH = (
    Path(__file__).parent / "fixtures" / "interference_golden.json"
)


def _fixture() -> dict:
    return json.loads(FIXTURE_PATH.read_text())


def _frame(fixture: dict) -> pd.DataFrame:
    index = pd.date_range(
        fixture["start_date"], periods=len(fixture["class_band"]), freq="D"
    )
    return pd.DataFrame(
        {"class_band": fixture["class_band"],
         "identity_band": fixture["identity_band"]},
        index=index,
    )


def test_compute_signals_matches_golden_snapshot():
    fixture = _fixture()
    snapshot = compute_signals(
        _frame(fixture), fixture["config"], variables={}
    )
    pinned = {key: snapshot[key] for key in ("O_x", "P_real", "tau", "M_eff")}
    assert pinned == fixture["expected_signals"]


def test_fft_band_split_matches_golden_snapshot():
    fixture = _fixture()
    samples = np.asarray(fixture["identity_band"])
    spectral = fixture["config"]["spectral"]
    low_band = tuple(spectral["low_frequency_band_cycles_per_day"])
    high_band = tuple(spectral["high_frequency_band_cycles_per_day"])
    low, high, total, _, _ = compute_ox_preindex(
        samples, low_band=low_band, high_band=high_band
    )
    ox, preal_proxy, _ = compute_ox(
        samples, low_band=low_band, high_band=high_band
    )
    expected = fixture["expected_spectral"]

    assert low == pytest.approx(expected["low_power"])
    assert high == pytest.approx(expected["high_power"])
    assert total == pytest.approx(expected["total_power"])
    assert ox == pytest.approx(expected["O_x"])
    assert preal_proxy == pytest.approx(expected["P_real_proxy"])
