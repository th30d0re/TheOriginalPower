"""Spectral utilities for the interference engine.

Provides FFT-based decomposition of time-series signals into low-frequency
(structural) and high-frequency (noise) power bands.
"""

from __future__ import annotations

from typing import Tuple

import numpy as np
import pandas as pd
from numpy.fft import rfft, rfftfreq


def interpolate_to_daily(
    series: pd.Series,
    interpolation_limit_days: int = 7,
) -> pd.Series:
    """Resample a series to a daily index and interpolate gaps up to the limit.

    Parameters
    ----------
    series:
        Datetime-indexed numeric series.
    interpolation_limit_days:
        Maximum consecutive missing days to interpolate.

    Returns
    -------
    Daily series with gaps filled up to the limit.
    """
    if not isinstance(series.index, pd.DatetimeIndex):
        series.index = pd.to_datetime(series.index)
    daily = series.resample("D").mean()
    return daily.interpolate(method="linear", limit=interpolation_limit_days)


def apply_window(samples: np.ndarray, window_name: str = "hann") -> np.ndarray:
    """Apply a named window to a 1-D sample array."""
    if window_name == "hann":
        return samples * np.hanning(len(samples))
    if window_name == "hamming":
        return samples * np.hamming(len(samples))
    if window_name == "blackman":
        return samples * np.blackman(len(samples))
    return samples


def band_power(
    freqs: np.ndarray,
    spectrum: np.ndarray,
    low_cycles_per_day: float,
    high_cycles_per_day: float,
) -> float:
    """Return total power in a frequency band [low, high] cycles per day."""
    mask = (freqs >= low_cycles_per_day) & (freqs <= high_cycles_per_day)
    return float(np.sum(np.abs(spectrum[mask]) ** 2))


def compute_ox_preindex(
    samples: np.ndarray,
    sample_spacing_days: float = 1.0,
    low_band: Tuple[float, float] = (0.0, 1.0 / 90.0),
    high_band: Tuple[float, float] = (1.0 / 7.0, 1.0),
    window_name: str = "hann",
) -> Tuple[float, float, float, np.ndarray, np.ndarray]:
    """Compute low-frequency, high-frequency, and total FFT power.

    Returns
    -------
    low_power:
        Power in the low-frequency band (structural signal).
    high_power:
        Power in the high-frequency band (noise).
    total_power:
        Total power across all observed frequencies.
    freqs:
        FFT frequency bins in cycles per day.
    spectrum:
        Windowed FFT spectrum.
    """
    samples = np.asarray(samples, dtype=float)
    n = len(samples)
    if n < 8:
        raise ValueError(f"Need at least 8 samples for FFT, got {n}")

    windowed = apply_window(samples, window_name=window_name)
    spectrum = rfft(windowed)
    freqs = rfftfreq(n, d=sample_spacing_days)

    low_power = band_power(freqs, spectrum, low_band[0], low_band[1])
    high_power = band_power(freqs, spectrum, high_band[0], high_band[1])
    total_power = float(np.sum(np.abs(spectrum) ** 2))

    return low_power, high_power, total_power, freqs, spectrum


def compute_ox(
    samples: np.ndarray,
    sample_spacing_days: float = 1.0,
    low_band: Tuple[float, float] = (0.0, 1.0 / 90.0),
    high_band: Tuple[float, float] = (1.0 / 7.0, 1.0),
    window_name: str = "hann",
) -> Tuple[float, float, float]:
    """Compute the Orthographic Index O_x and real momentum P_real proxy.

    Returns
    -------
    ox:
        High-frequency power ratio, clipped to [0, 1].
    preal_proxy:
        Low-frequency power normalized by total power.
    total_power:
        Total FFT power for diagnostics.
    """
    low_power, high_power, total_power, _, _ = compute_ox_preindex(
        samples,
        sample_spacing_days=sample_spacing_days,
        low_band=low_band,
        high_band=high_band,
        window_name=window_name,
    )
    if total_power <= 0:
        return 0.0, 0.0, 0.0
    ox = np.clip(high_power / total_power, 0.0, 1.0)
    preal_proxy = low_power / total_power
    return float(ox), float(preal_proxy), float(total_power)
