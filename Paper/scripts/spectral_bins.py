"""Frequency-bin helpers shared by the electoral-cycle spectral scripts.

Two problems motivated this module:

1. ``scipy.fft.fftfreq`` returns the Nyquist bin of an even-length series as a
   *negative* frequency, so filtering ``freqs > 0`` silently drops it. A lookup
   of 0.5 cyc/yr on annual data then lands on the neighbouring bin
   (0.4833 cyc/yr for N = 60). ``rfftfreq`` keeps the Nyquist bin.
2. A target frequency that is not a multiple of fs/N (for example 1/8 cyc/yr
   with N = 60) has no bin of its own. A nearest-bin lookup picks one of the
   two neighbours without saying so. ``target_bins`` returns the exact bin when
   one exists and both bracketing bins otherwise, so each script can report
   which frequency it actually measured.
"""

import numpy as np


def target_bins(freqs, f_target, rtol=1e-6):
    """Return (indices, on_grid) for a target frequency on a frequency grid.

    ``on_grid`` is True when a bin lies within ``rtol`` (relative) of the
    target; ``indices`` then holds that one bin. Otherwise ``indices`` holds the
    two bins that bracket the target (one when the target lies outside the grid).
    """
    freqs = np.asarray(freqs, dtype=float)
    diff = np.abs(freqs - f_target)
    i = int(np.argmin(diff))
    if diff[i] <= rtol * max(abs(f_target), 1e-12):
        return [i], True
    lo = np.searchsorted(freqs, f_target) - 1
    idx = [k for k in (lo, lo + 1) if 0 <= k < len(freqs)]
    return idx, False


def ratio_context(freqs, p_num, p_den, f_lo=0.0, f_hi=np.inf, threshold=20.0):
    """Summarise the numerator/denominator power ratio across all bins.

    Returns a dict with the per-bin ratios (positive frequencies within
    [f_lo, f_hi]), their median, the number of bins at or above ``threshold``,
    and the total bin count. A single-bin periodogram ratio scatters widely,
    so a ratio at one target frequency is only informative against this
    distribution.
    """
    freqs = np.asarray(freqs, dtype=float)
    mask = (freqs > 0) & (freqs >= f_lo) & (freqs <= f_hi)
    r = np.asarray(p_num, dtype=float)[mask] / np.asarray(p_den, dtype=float)[mask]
    return {
        "freqs": freqs[mask],
        "ratios": r,
        "median": float(np.median(r)),
        "n_at_or_above": int(np.sum(r >= threshold)),
        "n_bins": int(r.size),
        "threshold": threshold,
    }


def rank_of(ratios, value):
    """Rank (1 = largest) of ``value`` among ``ratios``."""
    return int(np.sum(np.asarray(ratios) > value)) + 1


def welch_ratio_at(freqs, p_num, p_den, f_target):
    """Ratio p_num/p_den at the Welch bin for ``f_target``, or NaN if unresolved.

    A Welch estimate with segment length L has bin spacing fs/L. A target is
    *resolved* only when the nearest bin is not the DC bin and lies within half
    a bin spacing of the target. Otherwise a nearest-bin lookup silently
    measures a different frequency (for example the DC bin for a 6-year cycle
    with 2-year segments), so the ratio is returned as NaN.

    Returns (ratio, f_used, resolved).
    """
    freqs = np.asarray(freqs, dtype=float)
    i = int(np.argmin(np.abs(freqs - f_target)))
    df = freqs[1] - freqs[0] if freqs.size > 1 else np.inf
    resolved = freqs[i] > 0 and abs(freqs[i] - f_target) <= df / 2 + 1e-12
    den = float(np.asarray(p_den)[i])
    ratio = float(np.asarray(p_num)[i]) / den if den > 0 else np.inf
    return (ratio if resolved else float("nan")), float(freqs[i]), bool(resolved)
