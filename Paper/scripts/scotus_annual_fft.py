#!/usr/bin/env python3
"""
scotus_annual_fft.py

Apply Congressional Record methodology (FFT Periodogram) to annualized SCOTUS data.

Input:  Paper/data/scotus_annual_keyword_counts.csv
Output: Paper/figures/spectral/scotus_annual_fft.pdf
        Paper/data/scotus_annual_fft_results.json

Methodology:
    1. Load annualized SCOTUS keyword counts.
    2. Handle NaN shares (years with zero class and zero identity counts).
    3. Create uniform annual grid via linear interpolation across gaps.
    4. Apply FFT Periodogram with linear detrending (same as CR analysis).
    5. Report dominant periods and compare to Lomb-Scargle results.

Caveats (Tier 2 -- exploratory):
    - Interpolation across gaps introduces spectral artifacts.
    - Only 55 annual samples across 191 years; many gaps.
    - FFT assumes uniform sampling; interpolation enforces this artificially.
    - Results should be treated as directional, not definitive.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from numpy.fft import fft, fftfreq

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
IN_CSV = ROOT / "data" / "scotus_annual_keyword_counts.csv"
OUT_FIG = ROOT / "figures" / "spectral" / "scotus_annual_fft.pdf"
OUT_JSON = ROOT / "data" / "scotus_annual_fft_results.json"


def main() -> None:
    if not IN_CSV.exists():
        sys.exit(f"ERROR: {IN_CSV} not found. Run scotus_annualize.py first.")

    df = pd.read_csv(IN_CSV, comment="#")
    print(f"Loaded {len(df)} annual records from {df['year'].min()}-{df['year'].max()}")

    # Create uniform annual grid
    years = np.arange(df["year"].min(), df["year"].max() + 1)
    full = pd.DataFrame({"year": years})
    merged = full.merge(df[["year", "class_per_1k", "race_per_1k", "gender_per_1k",
                              "religion_per_1k", "sexuality_per_1k", "total_words"]],
                        on="year", how="left")

    # Build aggregate identity band (same as CR: race+gender+religion+sexuality)
    df["identity_per_1k"] = df["race_per_1k"] + df["gender_per_1k"] + df["religion_per_1k"] + df["sexuality_per_1k"]
    merged = full.merge(df[["year", "class_per_1k", "identity_per_1k"]], on="year", how="left")

    # Linear interpolation across gaps
    merged["class_interp"] = merged["class_per_1k"].interpolate(method="linear")
    merged["identity_interp"] = merged["identity_per_1k"].interpolate(method="linear")

    n = len(merged)
    fs = 1.0  # 1 sample/year
    dt = 1.0

    # Extract signals
    class_signal = merged["class_interp"].values
    identity_signal = merged["identity_interp"].values

    # Linear detrend (same as CR analysis)
    class_detrended = class_signal - np.polyval(np.polyfit(np.arange(n), class_signal, 1), np.arange(n))
    identity_detrended = identity_signal - np.polyval(np.polyfit(np.arange(n), identity_signal, 1), np.arange(n))

    # FFT
    class_fft = fft(class_detrended)
    identity_fft = fft(identity_detrended)
    freqs = fftfreq(n, dt)

    # Positive frequencies only
    pos = freqs > 0
    freqs_pos = freqs[pos]
    class_psd = np.abs(class_fft[pos])**2 / n
    identity_psd = np.abs(identity_fft[pos])**2 / n

    # Dominant periods
    class_peak_idx = np.argmax(class_psd)
    identity_peak_idx = np.argmax(identity_psd)
    class_peak_period = 1.0 / freqs_pos[class_peak_idx] if freqs_pos[class_peak_idx] != 0 else np.inf
    identity_peak_period = 1.0 / freqs_pos[identity_peak_idx] if freqs_pos[identity_peak_idx] != 0 else np.inf

    print(f"\nFFT Results (N={n}, interpolated):")
    print(f"  Class-band dominant period: {class_peak_period:.2f} yr")
    print(f"  Identity-band dominant period: {identity_peak_period:.2f} yr")

    # Electoral frequencies
    electoral_freqs = {
        "2-year (Nyquist)": 0.5,
        "4-year (Presidential)": 0.25,
        "6-year (Senate)": 1/6,
        "8-year (Two-term)": 0.125,
    }
    print(f"\nPower at electoral frequencies:")
    results = {"n_samples": int(n), "year_range": [int(merged["year"].min()), int(merged["year"].max())],
               "interpolation": "linear", "caveat": "Tier 2 -- exploratory; interpolation across gaps introduces artifacts",
               "dominant_periods": {}, "electoral_power": {}}

    def nearest_idx(target_freq):
        return int(np.argmin(np.abs(freqs_pos - target_freq)))

    for name, f_target in electoral_freqs.items():
        idx = nearest_idx(f_target)
        actual_f = freqs_pos[idx]
        actual_period = 1.0 / actual_f if actual_f != 0 else np.inf
        class_p = float(class_psd[idx])
        identity_p = float(identity_psd[idx])
        ratio = identity_p / class_p if class_p > 0 else np.inf
        print(f"  {name}: f={actual_f:.4f} cyc/yr (T={actual_period:.1f} yr) | Class PSD={class_p:.4e} | Identity PSD={identity_p:.4e} | Ratio={ratio:.2f}")
        results["electoral_power"][name] = {
            "frequency": float(actual_f),
            "period": float(actual_period),
            "class_psd": class_p,
            "identity_psd": identity_p,
            "ratio": float(ratio),
        }

    results["dominant_periods"]["class"] = float(class_peak_period)
    results["dominant_periods"]["identity"] = float(identity_peak_period)

    # Plot
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # Time series (raw + interpolated)
    ax = axes[0, 0]
    ax.plot(merged["year"], merged["class_interp"], "b-", label="Class per 1k (interp)", alpha=0.7)
    ax.plot(merged["year"], merged["identity_interp"], "r-", label="Identity per 1k (interp)", alpha=0.7)
    ax.scatter(df["year"], df["class_per_1k"], c="blue", s=20, zorder=5, label="Class per 1k (raw)")
    ax.scatter(df["year"], df["identity_per_1k"], c="red", s=20, zorder=5, label="Identity per 1k (raw)")
    ax.set_xlabel("Year")
    ax.set_ylabel("Occurrences per 1,000 words")
    ax.set_title("SCOTUS Annual Class vs Identity Frequency (Raw + Interp)")
    ax.legend(loc="best", fontsize=8)
    ax.grid(True, alpha=0.3)

    # FFT Periodogram
    ax = axes[0, 1]
    ax.plot(freqs_pos, class_psd, "b-", label="Class band")
    ax.plot(freqs_pos, identity_psd, "r-", label="Identity band")
    for name, f_target in electoral_freqs.items():
        ax.axvline(f_target, color="gray", linestyle="--", alpha=0.4)
        ax.text(f_target, ax.get_ylim()[1]*0.9, name, rotation=90, fontsize=7, ha="right", va="top")
    ax.set_xlabel("Frequency (cyc/yr)")
    ax.set_ylabel("Power Spectral Density")
    ax.set_title("FFT Periodogram (Interpolated Annual SCOTUS)")
    ax.legend(loc="best")
    ax.grid(True, alpha=0.3)

    # Period view
    ax = axes[1, 0]
    periods = 1.0 / freqs_pos
    # Clip period view to 2-50 years for readability
    pmask = (periods >= 2) & (periods <= 50)
    ax.plot(periods[pmask], class_psd[pmask], "b-", label="Class band")
    ax.plot(periods[pmask], identity_psd[pmask], "r-", label="Identity band")
    for name, f_target in electoral_freqs.items():
        T = 1.0 / f_target
        ax.axvline(T, color="gray", linestyle="--", alpha=0.4)
        ax.text(T, ax.get_ylim()[1]*0.9, name, rotation=90, fontsize=7, ha="right", va="top")
    ax.set_xlabel("Period (years)")
    ax.set_ylabel("Power Spectral Density")
    ax.set_title("FFT Periodogram (Period View, 2-50 yr)")
    ax.legend(loc="best")
    ax.grid(True, alpha=0.3)

    # Parseval check
    ax = axes[1, 1]
    time_energy_class = np.sum(class_detrended**2)
    freq_energy_class = np.sum(class_psd) * n  # Multiply by N for positive frequencies
    time_energy_identity = np.sum(identity_detrended**2)
    freq_energy_identity = np.sum(identity_psd) * n
    parseval_class = freq_energy_class / time_energy_class if time_energy_class > 0 else np.nan
    parseval_identity = freq_energy_identity / time_energy_identity if time_energy_identity > 0 else np.nan
    ax.bar(["Class\n(time)", "Class\n(freq)", "Identity\n(time)", "Identity\n(freq)"],
           [time_energy_class, freq_energy_class, time_energy_identity, freq_energy_identity],
           color=["blue", "lightblue", "red", "lightcoral"])
    ax.set_ylabel("Energy")
    ax.set_title(f"Parseval Check: Class={parseval_class:.4f}, Identity={parseval_identity:.4f}")
    ax.grid(True, alpha=0.3, axis="y")

    plt.tight_layout()
    OUT_FIG.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT_FIG, dpi=300)
    print(f"\nSaved figure: {OUT_FIG}")

    # Write JSON
    with open(OUT_JSON, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Saved results: {OUT_JSON}")


if __name__ == "__main__":
    main()
