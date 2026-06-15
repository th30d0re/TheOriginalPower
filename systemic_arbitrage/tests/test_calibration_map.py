from __future__ import annotations

import numpy as np
import pytest

from systemic_arbitrage.calibration_map import CalibrationMap


def test_fit_linearly_separable():
    rng = np.random.default_rng(0)
    delta_p = np.concatenate([rng.normal(2.0, 0.3, 20), rng.normal(-2.0, 0.3, 20)])
    outcomes = np.concatenate([np.ones(20), np.zeros(20)])
    cal = CalibrationMap().fit(delta_p, outcomes)
    assert cal.fitted
    assert cal.n_samples == 40
    # positive delta_p should map to probability > 0.5
    assert cal.predict(2.0) > 0.5
    assert cal.predict(-2.0) < 0.5


def test_predict_in_unit_interval():
    rng = np.random.default_rng(1)
    delta_p = rng.normal(0, 1, 30)
    outcomes = (rng.uniform(size=30) > 0.5).astype(float)
    cal = CalibrationMap().fit(delta_p, outcomes)
    for v in np.linspace(-5, 5, 50):
        p = cal.predict(v)
        assert 0.0 < p < 1.0, f"predict({v}) = {p} not in (0, 1)"


def test_predict_batch_shape():
    rng = np.random.default_rng(2)
    delta_p = rng.normal(0, 1, 15)
    outcomes = (rng.uniform(size=15) > 0.5).astype(float)
    cal = CalibrationMap().fit(delta_p, outcomes)
    vals = np.linspace(-3, 3, 10)
    result = cal.predict_batch(vals)
    assert result.shape == (10,)
    assert np.all(result > 0) and np.all(result < 1)


def test_to_dict_from_dict_roundtrip():
    rng = np.random.default_rng(3)
    delta_p = rng.normal(0, 1, 20)
    outcomes = (rng.uniform(size=20) > 0.5).astype(float)
    cal = CalibrationMap().fit(delta_p, outcomes)
    d = cal.to_dict()
    cal2 = CalibrationMap.from_dict(d)
    assert cal2.a == cal.a
    assert cal2.b == cal.b
    assert cal2.delta_p_mean == cal.delta_p_mean
    assert cal2.delta_p_std == cal.delta_p_std
    assert cal2.n_samples == cal.n_samples
    assert cal2.fitted == cal.fitted
    assert abs(cal2.predict(0.5) - cal.predict(0.5)) < 1e-12


def test_fallback_with_fewer_than_5_samples():
    cal = CalibrationMap().fit(np.array([1.0, -1.0, 0.5]), np.array([1.0, 0.0, 1.0]))
    assert not cal.fitted
    # defaults: a=0, b=1 → predict(0) = 0.5
    assert abs(cal.predict(0.0) - 0.5) < 1e-6


def test_fallback_defaults_are_neutral():
    cal = CalibrationMap()
    # with a=0, b=1, delta_p_mean=0, delta_p_std=1: predict(0) = sigmoid(0) = 0.5
    assert abs(cal.predict(0.0) - 0.5) < 1e-6
