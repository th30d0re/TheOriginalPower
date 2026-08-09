"""Regression coverage for the L9 identity-axis decomposition."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

import systemic_arbitrage.ingest_trends as trends
from systemic_arbitrage.interference_engine import compute_signals


FIXTURE_PATH = Path(__file__).parent / "fixtures" / "per_axis_golden.json"
LEGACY_IDENTITY_TERMS = ["woke", "crt", "transgender", "dei", "culture war"]
AXES = ("race", "gender", "religion", "sexuality", "nationality", "ability")


def _fixture() -> dict:
    return json.loads(FIXTURE_PATH.read_text())


def _frame(fixture: dict) -> pd.DataFrame:
    index = pd.date_range(
        fixture["start_date"], periods=len(fixture["class_band"]), freq="D"
    )
    columns = {
        key: values
        for key, values in fixture.items()
        if key == "class_band" or key.startswith("identity_")
    }
    return pd.DataFrame(columns, index=index)


def _variables() -> dict:
    return {
        "keywords": {
            "identity_axes": {
                **{axis: [f"{axis} term"] for axis in AXES},
                "unattributed": ["cross-axis term"],
            }
        }
    }


def _force_fallback(*args, **kwargs):
    raise RuntimeError("offline test")


def test_frozen_single_axis_sinusoid_dominates_share():
    fixture = _fixture()
    snapshot = compute_signals(_frame(fixture), fixture["config"], _variables())
    shares = {
        axis: measurement["share_of_P_id"]
        for axis, measurement in snapshot["per_axis"].items()
    }

    assert max(shares, key=shares.get) == fixture["expected_dominant_axis"]
    assert shares["race"] > 0.999999


def test_identity_band_is_backward_compatible_on_fallback(monkeypatch):
    monkeypatch.setattr(trends, "_fetch_batched_pytrends", _force_fallback)
    raw = trends.load_fallback_snapshot()
    expected = raw[LEGACY_IDENTITY_TERMS].mean(axis=1)

    actual = trends.ingest_baskets()["identity_band"]

    assert actual.dtype == expected.dtype
    assert np.max(np.abs(actual.to_numpy() - expected.to_numpy())) <= 1e-12


def test_unmeasured_axis_is_nan_and_excluded_from_denominator():
    fixture = _fixture()
    frame = _frame(fixture).drop(columns=["identity_gender"])

    per_axis = compute_signals(frame, fixture["config"], _variables())["per_axis"]

    assert np.isnan(per_axis["gender"]["band_power"])
    assert np.isnan(per_axis["gender"]["share_of_P_id"])
    assert per_axis["race"]["share_of_P_id"] == 1.0


def test_unattributed_never_enters_per_axis_sum():
    fixture = _fixture()
    frame = _frame(fixture)
    with_unattributed = compute_signals(frame, fixture["config"], _variables())["per_axis"]
    frame["identity_unattributed"] = 0.0
    without_unattributed = compute_signals(frame, fixture["config"], _variables())["per_axis"]

    assert "unattributed" not in with_unattributed
    assert with_unattributed == without_unattributed
