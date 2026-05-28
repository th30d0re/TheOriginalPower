#!/usr/bin/env python3
"""
eq_wavelet_amplitude_modulation.py

Continuous Wavelet Transform (CWT) analysis of Congressional Record identity-band
time series to test whether the 4-year spectral carrier's amplitude varies with
class-coherence threat over time.

Theory (from Chapter 21):
    The Interference Engine's 4-year carrier is predicted to be amplitude-modulated
    by class-coherence threat M(t). During high-threat periods (1968 MLK/riots,
    1994 Republican Revolution, 2020 BLM/pandemic), the Engine must inject more
    identity-band energy to prevent class solidarity from breaching threshold τ.
    During low-threat periods (1976 post-Watergate calm, 1996 Clinton boom,
    2012 Obama reelection), less injection is needed.

Method:
    1. Apply CWT with complex Morlet wavelet to detrended identity-band frequencies.
    2. Extract wavelet power at the 4-year scale as a function of time.
    3. Compute a class-coherence threat index from the class-band time series.
    4. Test correlation between 4-year wavelet power and threat index.

Data:
    Paper/data/congressional_record_word_freq.csv (annual, 1965-2024)

Output:
    Paper/figures/eq_wavelet_amplitude_modulation.png
    Paper/data/eq_wavelet_amplitude_modulation_results.csv

Dependencies:
    numpy, pandas, matplotlib, scipy, PyWavelets
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal
from scipy.stats import pearsonr, spearmanr
from pathlib import Path

try:
    import pywt
except ImportError:
    raise ImportError("PyWavelets is required. Install: pip install PyWavelets")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DATA_CSV = ROOT / "data" / "congressional_record_word_freq.csv"
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
df = pd.read_csv(DATA_CSV, comment="#")
years = df["year"].values.astype(float)
class_freq = df["class_word_freq"].values.astype(float)
identity_freq = df["identity_word_freq"].values.astype(float)

N = len(years)
dt = 1.0  # years between samples
fs = 1.0 / dt

print(f"Dataset: {N} years ({int(years[0])}-{int(years[-1])})")

# ---------------------------------------------------------------------------
# Detrend (linear trend removal)
# ---------------------------------------------------------------------------
class_freq_dt = signal.detrend(class_freq, type="linear")
identity_freq_dt = signal.detrend(identity_freq, type="linear")

# ---------------------------------------------------------------------------
# CWT with Complex Morlet Wavelet
# ---------------------------------------------------------------------------
# We use the complex Morlet wavelet (cmorB-C) with bandwidth B=1.5 and
# center frequency C=1.0. The relationship between scale s and period T is:
#   T ≈ s * 4π / (ω0 + sqrt(2 + ω0²))
# For cmor1.5-1.0, ω0 ≈ 6.2, giving T ≈ s * 1.03.
# So scale s ≈ 3.9 corresponds to T ≈ 4 years.
#
# With N=60 and dt=1, the minimum resolvable scale is ~2*dt = 2,
# and the maximum meaningful scale is ~N/4 = 15 (to avoid cone-of-influence
# contamination at the edges).

wavelet = "cmor1.5-1.0"
scales = np.arange(2, 20, 0.2)  # scales from 2 to 20 years, step 0.2

coef_identity, freqs = pywt.cwt(identity_freq_dt, scales, wavelet, sampling_period=dt)
coef_class, _ = pywt.cwt(class_freq_dt, scales, wavelet, sampling_period=dt)

# Convert scales to periods (years)
# For cmor wavelets, period = scale * sampling_period * pywt.central_frequency(wavelet)
# Actually pywt.scale2frequency gives the correct conversion
central_freq = pywt.central_frequency(wavelet)
periods = scales / (fs * central_freq)  # in years

print(f"Wavelet: {wavelet}")
print(f"Scales: {scales.min():.1f} to {scales.max():.1f}")
print(f"Periods: {periods.min():.1f} to {periods.max():.1f} years")
print(f"Central frequency: {central_freq:.4f}")

# ---------------------------------------------------------------------------
# Power computation
# ---------------------------------------------------------------------------
power_identity = np.abs(coef_identity) ** 2
power_class = np.abs(coef_class) ** 2

# ---------------------------------------------------------------------------
# Extract 4-year scale power envelope
# ---------------------------------------------------------------------------
# Find the scale closest to 4-year period
target_period = 4.0
idx_4yr = np.argmin(np.abs(periods - target_period))
actual_period_4yr = periods[idx_4yr]

power_4yr_identity = power_identity[idx_4yr, :]
power_4yr_class = power_class[idx_4yr, :]

print(f"\n4-year scale index: {idx_4yr}, actual period: {actual_period_4yr:.2f} years")

# ---------------------------------------------------------------------------
# Class-coherence threat index
# ---------------------------------------------------------------------------
# Theory: high class-coherence threat occurs when class-band language is
# elevated relative to trend (i.e., class_freq_dt > 0, meaning more class
# discourse than the secular trend predicts). We also incorporate the
# absolute class frequency as a proxy for mobilization potential.
#
# Threat index = detrended class frequency (positive = above-trend threat)
# We smooth with a 3-year centered window to reduce single-year noise.

threat_index_raw = class_freq_dt
threat_index = pd.Series(threat_index_raw).rolling(window=3, min_periods=1, center=True).mean().values

# Normalize threat index to z-score for interpretability
threat_index_z = (threat_index - threat_index.mean()) / threat_index.std()

# ---------------------------------------------------------------------------
# Correlation: 4-year power vs threat index
# ---------------------------------------------------------------------------
# Use Pearson and Spearman correlation
r_pearson, p_pearson = pearsonr(power_4yr_identity, threat_index)
r_spearman, p_spearman = spearmanr(power_4yr_identity, threat_index)

print(f"\nCorrelation: 4-year identity power vs class threat")
print(f"  Pearson:  r = {r_pearson:.3f}, p = {p_pearson:.3f}")
print(f"  Spearman: ρ = {r_spearman:.3f}, p = {p_spearman:.3f}")

# Also test with time-lagged threat (threat leads power by 1 year)
if N > 2:
    r_lag1, p_lag1 = pearsonr(power_4yr_identity[1:], threat_index[:-1])
    print(f"  Lag-1 (threat leads): r = {r_lag1:.3f}, p = {p_lag1:.3f}")

# ---------------------------------------------------------------------------
# High-threat vs low-threat period comparison
# ---------------------------------------------------------------------------
# Define high-threat years (known historical shocks)
high_threat_years = [1968, 1994, 2020]  # MLK/riots, Republican Revolution, BLM/pandemic
low_threat_years = [1976, 1996, 2012]   # post-Watergate calm, Clinton boom, Obama reelection

high_threat_mask = np.isin(years, high_threat_years)
low_threat_mask = np.isin(years, low_threat_years)

high_power = power_4yr_identity[high_threat_mask]
low_power = power_4yr_identity[low_threat_mask]

if len(high_power) > 0 and len(low_power) > 0:
    from scipy.stats import ttest_ind
    t_stat, t_p = ttest_ind(high_power, low_power)
    print(f"\nHigh-threat vs low-threat 4-year power:")
    print(f"  High-threat mean: {high_power.mean():.1f} (years: {list(years[high_threat_mask])})")
    print(f"  Low-threat mean:  {low_power.mean():.1f} (years: {list(years[low_threat_mask])})")
    print(f"  t-test: t = {t_stat:.2f}, p = {t_p:.3f}")

# ---------------------------------------------------------------------------
# Save results
# ---------------------------------------------------------------------------
results = pd.DataFrame({
    "year": years.astype(int),
    "identity_freq_dt": identity_freq_dt,
    "class_freq_dt": class_freq_dt,
    "threat_index": threat_index,
    "threat_index_z": threat_index_z,
    "power_4yr_identity": power_4yr_identity,
    "power_4yr_class": power_4yr_class,
})
results_path = ROOT / "data" / "eq_wavelet_amplitude_modulation_results.csv"
results.to_csv(results_path, index=False)
print(f"\nSaved results to {results_path}")

# ---------------------------------------------------------------------------
# Figure 1: Wavelet Power Spectrum (time-frequency heatmap)
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(3, 1, figsize=(12, 10), sharex=True,
                          gridspec_kw={"height_ratios": [1, 1, 1.2]})

# Panel A: Raw time series
ax = axes[0]
ax.plot(years, identity_freq_dt, "r-", linewidth=1.5, label="Identity band (detrended)")
ax.plot(years, class_freq_dt, "b-", linewidth=1.5, alpha=0.7, label="Class band (detrended)")
ax.axhline(0, color="k", linestyle="--", alpha=0.3)
ax.set_ylabel("Detrended word frequency")
ax.set_title("A. Congressional Record: Detrended Absolute Frequencies")
ax.legend(loc="upper left")
ax.grid(True, alpha=0.3)

# Panel B: Identity-band wavelet power spectrum
ax = axes[1]
# Use pcolormesh for smooth rendering
# X = years, Y = periods, C = power_identity
X, Y = np.meshgrid(years, periods)
im = ax.pcolormesh(X, Y, power_identity, cmap="hot", shading="auto")
ax.set_yscale("log")
ax.set_ylim(periods.min(), periods.max())
ax.set_ylabel("Period (years)")
ax.set_title("B. Identity-Band Wavelet Power Spectrum (Morlet CWT)")
# Mark the 4-year line
ax.axhline(4.0, color="cyan", linestyle="--", linewidth=1.5, alpha=0.8, label="4-year carrier")
ax.legend(loc="upper right")
cbar = plt.colorbar(im, ax=ax, orientation="vertical", pad=0.02)
cbar.set_label("Power")

# Panel C: 4-year power envelope vs threat index
ax = axes[2]
ax2 = ax.twinx()

# Normalize for visual comparison
power_norm = (power_4yr_identity - power_4yr_identity.min()) / (power_4yr_identity.max() - power_4yr_identity.min())
threat_norm = (threat_index - threat_index.min()) / (threat_index.max() - threat_index.min())

ax.fill_between(years, 0, power_norm, color="red", alpha=0.3, label="4-yr identity power")
ax.plot(years, power_norm, "r-", linewidth=2, label="4-yr identity power")
ax2.plot(years, threat_norm, "b--", linewidth=2, label="Class threat index")

# Mark high/low threat years
for yr in high_threat_years:
    ax.axvline(yr, color="darkred", linestyle=":", alpha=0.5)
for yr in low_threat_years:
    ax.axvline(yr, color="darkblue", linestyle=":", alpha=0.5)

ax.set_xlabel("Year")
ax.set_ylabel("4-Year Identity Power (normalized)", color="red")
ax2.set_ylabel("Class Threat Index (normalized)", color="blue")
ax.set_title(f"C. 4-Year Carrier Amplitude vs Class-Coherence Threat\n"
             f"Pearson r = {r_pearson:.3f} (p = {p_pearson:.3f})")
ax.set_xlim(years[0], years[-1])
ax.set_ylim(0, 1.1)
ax2.set_ylim(0, 1.1)
ax.grid(True, alpha=0.3)

# Combine legends
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, loc="upper left")

plt.tight_layout()
fig_path = FIG_DIR / "eq_wavelet_amplitude_modulation.png"
plt.savefig(fig_path, dpi=300, bbox_inches="tight")
plt.savefig(fig_path.with_suffix(".pdf"), bbox_inches="tight")
print(f"Saved figure to {fig_path}")
plt.close()

# ---------------------------------------------------------------------------
# Figure 2: Cone of Influence and significance
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Left: Full wavelet power with COI
ax = axes[0]
im = ax.pcolormesh(X, Y, power_identity, cmap="hot", shading="auto")
ax.set_yscale("log")
ax.set_ylim(periods.min(), periods.max())
ax.set_xlabel("Year")
ax.set_ylabel("Period (years)")
ax.set_title("Identity-Band Wavelet Power with Cone of Influence")
ax.axhline(4.0, color="cyan", linestyle="--", linewidth=1.5, alpha=0.8)

# Cone of Influence: e-folding time for Morlet is sqrt(2)*scale
coi = np.sqrt(2) * scales
# At each time point, the COI tells us which scales are reliable
# For visualization, we draw the COI boundary
coi_time = np.array([years[0] + coi[i] for i in range(len(scales))])
coi_time_end = np.array([years[-1] - coi[i] for i in range(len(scales))])
ax.fill_betweenx(periods, years[0], years[0] + np.sqrt(2) * periods, 
                  color="white", alpha=0.5, label="COI (unreliable)")
ax.fill_betweenx(periods, years[-1] - np.sqrt(2) * periods, years[-1], 
                  color="white", alpha=0.5)
ax.legend(loc="upper right")
plt.colorbar(im, ax=ax, label="Power")

# Right: Global wavelet power (average over time)
ax = axes[1]
global_power_identity = power_identity.mean(axis=1)
global_power_class = power_class.mean(axis=1)
ax.plot(periods, global_power_identity, "r-", linewidth=2, label="Identity band")
ax.plot(periods, global_power_class, "b-", linewidth=2, alpha=0.7, label="Class band")
ax.axvline(4.0, color="cyan", linestyle="--", linewidth=1.5, alpha=0.8, label="4-year carrier")
ax.axvline(6.0, color="green", linestyle="--", linewidth=1.5, alpha=0.8, label="6-year Senate")
ax.axvline(8.0, color="orange", linestyle="--", linewidth=1.5, alpha=0.8, label="8-year two-term")
ax.set_xlabel("Period (years)")
ax.set_ylabel("Global Wavelet Power")
ax.set_title("Global Wavelet Power Spectrum")
ax.set_xlim(periods.min(), periods.max())
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)

plt.tight_layout()
fig_path2 = FIG_DIR / "eq_wavelet_global_power.png"
plt.savefig(fig_path2, dpi=300, bbox_inches="tight")
plt.savefig(fig_path2.with_suffix(".pdf"), bbox_inches="tight")
print(f"Saved figure to {fig_path2}")
plt.close()

print("\n" + "=" * 60)
print("WAVELET ANALYSIS COMPLETE")
print("=" * 60)
