#!/usr/bin/env python3
"""
scotus_lomb_scargle.py

Lomb-Scargle periodogram on annualized SCOTUS keyword counts.
Proper spectral estimator for non-uniformly sampled time series.

Input:  Paper/data/scotus_annual_keyword_counts.csv
Output: Paper/figures/spectral/scotus_lomb_scargle.pdf
        Paper/data/scotus_lomb_scargle_results.json

Methodology:
    1. Load annualized SCOTUS keyword counts (non-uniform years).
    2. Aggregate class vs identity bands per year.
    3. Lomb-Scargle on the raw (non-interpolated) annual time points.
    4. Compare power at electoral frequencies (4-yr, 6-yr, 8-yr).
    5. Report dominant periods per axis.

Advantage over FFT: No interpolation required; handles gaps natively.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.signal import lombscargle

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
IN_CSV = ROOT / "data" / "scotus_annual_keyword_counts.csv"
OUT_FIG = ROOT / "figures" / "spectral" / "scotus_lomb_scargle.pdf"
OUT_JSON = ROOT / "data" / "scotus_lomb_scargle_results.json"

ELECTORAL_PERIODS = {
    "2-year (Nyquist)": 2.0,
    "4-year (Presidential)": 4.0,
    "6-year (Senate)": 6.0,
    "8-year (Two-term)": 8.0,
    "10-year (Census/Redistrict)": 10.0,
    "12-year (3-term Senate)": 12.0,
}


def main() -> None:
    if not IN_CSV.exists():
        sys.exit(f"ERROR: {IN_CSV} not found. Run scotus_annualize.py first.")

    df = pd.read_csv(IN_CSV, comment="#")
    print(f"Loaded {len(df)} annual records from {df['year'].min()}-{df['year'].max()}")

    # Build aggregate identity band
    df["identity_per_1k"] = df["race_per_1k"] + df["gender_per_1k"] + df["religion_per_1k"] + df["sexuality_per_1k"]

    # Time points (years, centered for numerical stability)
    t_yr = df["year"].values.astype(float)
    t_centered = t_yr - t_yr.mean()

    # Signals (per-1k-word rates)
    signals = {
        "class": df["class_per_1k"].values,
        "identity": df["identity_per_1k"].values,
        "race": df["race_per_1k"].values,
        "gender": df["gender_per_1k"].values,
        "religion": df["religion_per_1k"].values,
        "sexuality": df["sexuality_per_1k"].values,
    }

    # Period grid: 2 to 50 years
    periods = np.linspace(2, 50, 2000)
    omega = 2 * np.pi / periods  # angular frequency

    results = {
        "n_samples": int(len(df)),
        "year_range": [int(df["year"].min()), int(df["year"].max())],
        "year_span": int(df["year"].max() - df["year"].min()),
        "method": "Lomb-Scargle (Scargle 1982)",
        "caveat": "Non-uniform sampling handled natively; no interpolation",
        "dominant_periods": {},
        "electoral_power": {},
    }

    pgrams = {}
    print("\nLomb-Scargle Results:")
    for name, signal in signals.items():
        # Zero-mean
        signal_zm = signal - np.mean(signal)
        pgram = lombscargle(t_centered, signal_zm, omega, normalize=True)
        pgrams[name] = pgram

        peak_idx = np.argmax(pgram)
        peak_period = float(periods[peak_idx])
        peak_power = float(pgram[peak_idx])
        results["dominant_periods"][name] = {"period": peak_period, "power": peak_power}
        print(f"  {name:12s} dominant period: {peak_period:.2f} yr (power={peak_power:.4f})")

    # Power at electoral frequencies
    print("\nPower at electoral frequencies:")
    for ename, target_T in ELECTORAL_PERIODS.items():
        target_omega = 2 * np.pi / target_T
        idx = int(np.argmin(np.abs(omega - target_omega)))
        actual_T = float(periods[idx])
        ep = {}
        for name in ["class", "identity"]:
            p = float(pgrams[name][idx])
            ep[name] = {"period": actual_T, "power": p}
        ratio = ep["identity"]["power"] / ep["class"]["power"] if ep["class"]["power"] > 0 else np.inf
        print(f"  {ename:25s} T={actual_T:.1f} yr | Class={ep['class']['power']:.4f} | Identity={ep['identity']['power']:.4f} | Ratio={ratio:.2f}")
        results["electoral_power"][ename] = ep
        results["electoral_power"][ename]["ratio"] = float(ratio)

    # Plot
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # Time series
    ax = axes[0, 0]
    ax.scatter(t_yr, df["class_per_1k"], c="blue", s=30, zorder=5, label="Class per 1k")
    ax.scatter(t_yr, df["identity_per_1k"], c="red", s=30, zorder=5, label="Identity per 1k")
    ax.plot(t_yr, df["class_per_1k"], "b-", alpha=0.3)
    ax.plot(t_yr, df["identity_per_1k"], "r-", alpha=0.3)
    ax.set_xlabel("Year")
    ax.set_ylabel("Occurrences per 1,000 words")
    ax.set_title(f"SCOTUS Annual Class vs Identity ({len(df)} yr, {df['year'].min()}-{df['year'].max()})")
    ax.legend(loc="best")
    ax.grid(True, alpha=0.3)

    # Lomb-Scargle periodogram (class vs identity)
    ax = axes[0, 1]
    ax.plot(periods, pgrams["class"], "b-", label="Class band", alpha=0.8)
    ax.plot(periods, pgrams["identity"], "r-", label="Identity band", alpha=0.8)
    for ename, target_T in ELECTORAL_PERIODS.items():
        ax.axvline(target_T, color="gray", linestyle="--", alpha=0.3)
        ax.text(target_T, ax.get_ylim()[1]*0.95, ename.split()[0], rotation=90, fontsize=6, ha="right", va="top")
    ax.set_xlabel("Period (years)")
    ax.set_ylabel("Normalised Lomb-Scargle Power")
    ax.set_title("Lomb-Scargle Periodogram: Class vs Identity")
    ax.set_xlim(2, 50)
    ax.legend(loc="best")
    ax.grid(True, alpha=0.3)

    # Per-axis periodogram
    ax = axes[1, 0]
    colors = {"race": "green", "gender": "purple", "religion": "orange", "sexuality": "brown"}
    for name, color in colors.items():
        ax.plot(periods, pgrams[name], color=color, label=name, alpha=0.7)
    for ename, target_T in ELECTORAL_PERIODS.items():
        ax.axvline(target_T, color="gray", linestyle="--", alpha=0.3)
    ax.set_xlabel("Period (years)")
    ax.set_ylabel("Normalised Lomb-Scargle Power")
    ax.set_title("Per-Axis Lomb-Scargle Periodogram")
    ax.set_xlim(2, 50)
    ax.legend(loc="best")
    ax.grid(True, alpha=0.3)

    # Dominant periods bar chart
    ax = axes[1, 1]
    names = list(results["dominant_periods"].keys())
    periods_bar = [results["dominant_periods"][n]["period"] for n in names]
    colors_bar = ["blue", "red", "green", "purple", "orange", "brown"]
    ax.barh(names, periods_bar, color=colors_bar[:len(names)])
    ax.set_xlabel("Dominant Period (years)")
    ax.set_title("Dominant Periods by Axis")
    ax.grid(True, alpha=0.3, axis="x")
    for i, (n, p) in enumerate(zip(names, periods_bar)):
        ax.text(p + 0.5, i, f"{p:.1f} yr", va="center", fontsize=8)

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
