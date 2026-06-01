#!/usr/bin/env python3
"""
eq_fourier_electoral_cycle_google_trends.py

High-frequency spectral validation using weekly Google Trends indices (2004-2024)
to resolve the 2-year midterm cycle that sits at the Nyquist limit of the annual
Congressional Record dataset.

Data source: Paper/data/google_trends_class_identity.csv
Preprocessed by: Paper/scripts/preprocess_spectral_data.py

Why Google Trends
-----------------
Google Trends provides weekly public-search-interest indices (0-100 scale) for
keyword baskets.  With f_s = 52 yr^-1, the Nyquist frequency is 26 cyc/yr—far
above the 0.5 cyc/yr midterm cycle.  The tradeoff is baseline length (20 years
vs 60) and metric type (relative search interest vs absolute word/document counts).
Google Trends captures public wetware response; Congressional Record captures
institutional discourse.  Divergence between the two substrates is itself
informative about how the Interference Engine operates across media channels.

Critical methodological notes:
    1. N = ~1096 weeks (2004-2024).  Frequency resolution = 52/1096 ≈ 0.047 cyc/yr.
       The 2-year period (0.5000 cyc/yr) falls near FFT bin 10.5 — not exact,
       but well resolved.  The 4-year period (0.2500 cyc/yr) falls near bin 5.3.
    2. Welch's method is the primary estimator for Google Trends because exact
       bin alignment is lost; the FFT serves as a cross-check.
    3. The 0-100 index scale is relative per query; absolute amplitude has no
       direct mapping to Congressional Record word frequencies.

Output: console summary (no figure by default; add --plot to generate)
        results CSV written to Paper/data/eq_fourier_electoral_cycle_google_trends_results.csv
"""

import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal
from scipy.fft import fft, fftfreq
from pathlib import Path
from scipy.stats import ttest_ind

ROOT = Path(__file__).resolve().parent.parent
DATA_CSV = ROOT / "data" / "google_trends_class_identity.csv"
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
df = pd.read_csv(DATA_CSV, comment="#")
dates = pd.to_datetime(df["date"])
class_idx = df["class_signal_index"].values.astype(float)
identity_idx = df["identity_signal_index"].values.astype(float)

N = len(dates)
fs = 52.0  # weeks per year
print(f"Dataset: {N} weeks ({dates.iloc[0].date()} to {dates.iloc[-1].date()})")
print(f"Sampling rate: {fs} yr^-1  |  Delta_f = {fs/N:.4f} cyc/yr  |  Nyquist = {fs/2:.1f} cyc/yr")

# ---------------------------------------------------------------------------
# Detrend
# ---------------------------------------------------------------------------
class_dt = signal.detrend(class_idx, type="linear")
identity_dt = signal.detrend(identity_idx, type="linear")

# ---------------------------------------------------------------------------
# FFT
# ---------------------------------------------------------------------------
freqs = fftfreq(N, d=1/fs)
pos = freqs > 0
f_pos = freqs[pos]

fft_class = np.abs(fft(class_dt))[pos]
fft_id = np.abs(fft(identity_dt))[pos]

psd_class = fft_class**2 / N
psd_id = fft_id**2 / N

# ---------------------------------------------------------------------------
# Welch
# ---------------------------------------------------------------------------
def welch_est(x, nperseg):
    noverlap = nperseg // 2
    return signal.welch(x, fs=fs, nperseg=nperseg, noverlap=noverlap,
                        window="hann", scaling="density")

f_welch208, psd_welch208_class = welch_est(class_dt, 208)  # ~4-yr segments
_                    , psd_welch208_id   = welch_est(identity_dt, 208)

f_welch104, psd_welch104_class = welch_est(class_dt, 104)  # ~2-yr segments
_                    , psd_welch104_id   = welch_est(identity_dt, 104)

# ---------------------------------------------------------------------------
# Target frequencies
# ---------------------------------------------------------------------------
def nearest_idx(arr, val):
    return int(np.argmin(np.abs(arr - val)))

targets = {
    "2 yr (midterm)": 1/2,
    "4 yr (presidential)": 1/4,
    "6 yr (Senate)": 1/6,
    "8 yr (two-term)": 1/8,
}

print("\n" + "="*70)
print("FFT BIN ALIGNMENT (weekly sampling)")
print("="*70)
for label, f_target in targets.items():
    bin_num = f_target * N / fs
    print(f"  {label:22s}: f = {f_target:.4f} cyc/yr -> near FFT bin {bin_num:.1f}")

# ---------------------------------------------------------------------------
# Spectral power at target frequencies
# ---------------------------------------------------------------------------
print("\n" + "="*70)
print("SPECTRAL POWER AT ELECTORAL FREQUENCIES")
print("="*70)

results = []
for label, f_target in targets.items():
    idx_fft = nearest_idx(f_pos, f_target)
    idx_w208 = nearest_idx(f_welch208, f_target)
    idx_w104 = nearest_idx(f_welch104, f_target)

    p_id_fft = psd_id[idx_fft]
    p_cl_fft = psd_class[idx_fft]
    ratio_fft = p_id_fft / p_cl_fft if p_cl_fft > 0 else np.inf

    p_id_w208 = psd_welch208_id[idx_w208]
    p_cl_w208 = psd_welch208_class[idx_w208]
    ratio_w208 = p_id_w208 / p_cl_w208 if p_cl_w208 > 0 else np.inf

    p_id_w104 = psd_welch104_id[idx_w104]
    p_cl_w104 = psd_welch104_class[idx_w104]
    ratio_w104 = p_id_w104 / p_cl_w104 if p_cl_w104 > 0 else np.inf

    results.append({
        "period": label,
        "f_target": f_target,
        "T_target_yr": 1/f_target,
        "ratio_fft": ratio_fft,
        "ratio_welch208": ratio_w208,
        "ratio_welch104": ratio_w104,
        "p_id_fft": p_id_fft,
        "p_cl_fft": p_cl_fft,
    })

    print(f"\n{label}")
    print(f"  FFT       identity/class ratio = {ratio_fft:10.2f}")
    print(f"  Welch(208) ratio               = {ratio_w208:10.2f}")
    print(f"  Welch(104) ratio               = {ratio_w104:10.2f}")

# ---------------------------------------------------------------------------
# Time-domain: presidential vs non-presidential years
# ---------------------------------------------------------------------------
years = dates.dt.year.values
pres_years = set(range(2004, 2025, 4))
mask_pres = np.isin(years, list(pres_years))
mask_other = ~mask_pres

print("\n" + "="*70)
print("TIME-DOMAIN: Mean Identity Search Index by Election Type")
print("="*70)
print(f"  Presidential years (N={mask_pres.sum()}): {identity_idx[mask_pres].mean():.2f}")
print(f"  Other years        (N={mask_other.sum()}): {identity_idx[mask_other].mean():.2f}")

t_stat, p_val = ttest_ind(identity_idx[mask_pres], identity_idx[mask_other])
print(f"\n  t-test (pres vs other): t = {t_stat:.3f}, p = {p_val:.4f}")

# ---------------------------------------------------------------------------
# Parseval
# ---------------------------------------------------------------------------
total_time = np.sum(class_dt**2) + np.sum(identity_dt**2)
total_freq = 2 * (np.sum(psd_id) + np.sum(psd_class))
print(f"\nParseval ratio: {total_freq/total_time:.6f}")

# ---------------------------------------------------------------------------
# Write results
# ---------------------------------------------------------------------------
results_df = pd.DataFrame(results)
results_df.to_csv(
    ROOT / "data" / "eq_fourier_electoral_cycle_google_trends_results.csv",
    index=False,
)
print(f"\nResults written to Paper/data/eq_fourier_electoral_cycle_google_trends_results.csv")

# ---------------------------------------------------------------------------
# Optional plot
# ---------------------------------------------------------------------------
parser = argparse.ArgumentParser()
parser.add_argument("--plot", action="store_true", help="Generate figure")
args = parser.parse_args()

if args.plot:
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # A: Time series
    ax = axes[0, 0]
    ax.plot(dates, class_idx, label="Class band", color="blue", alpha=0.7)
    ax.plot(dates, identity_idx, label="Identity band", color="red", alpha=0.7)
    ax.set_xlabel("Year")
    ax.set_ylabel("Search index (0-100)")
    ax.set_title("Google Trends Weekly Search Indices")
    ax.legend()

    # B: FFT periodogram
    ax = axes[0, 1]
    ax.semilogy(f_pos, psd_class, label="Class band", color="blue", alpha=0.7)
    ax.semilogy(f_pos, psd_id, label="Identity band", color="red", alpha=0.7)
    for label, f_target in targets.items():
        ax.axvline(f_target, color="gray", linestyle="--", alpha=0.5)
    ax.set_xlabel("Frequency (cycles/year)")
    ax.set_ylabel("PSD")
    ax.set_title("FFT Periodogram (weekly sampling)")
    ax.legend()
    ax.set_xlim(0, 1.0)

    # C: Welch PSD
    ax = axes[1, 0]
    ax.semilogy(f_welch208, psd_welch208_class, label="Class (208-wk)", color="blue", alpha=0.7)
    ax.semilogy(f_welch208, psd_welch208_id, label="Identity (208-wk)", color="red", alpha=0.7)
    for label, f_target in targets.items():
        ax.axvline(f_target, color="gray", linestyle="--", alpha=0.5)
    ax.set_xlabel("Frequency (cycles/year)")
    ax.set_ylabel("PSD (Welch)")
    ax.set_title("Welch PSD (208-week segments)")
    ax.legend()
    ax.set_xlim(0, 1.0)

    # D: Ratios
    ax = axes[1, 1]
    periods = [r["T_target_yr"] for r in results]
    ratios_w = [r["ratio_welch208"] for r in results]
    colors = ["green" if r > 2.0 else "orange" if r > 1.0 else "red" for r in ratios_w]
    ax.bar(periods, ratios_w, color=colors, width=1.5)
    ax.axhline(2.0, color="black", linestyle="--")
    ax.set_xlabel("Period (years)")
    ax.set_ylabel("Identity / Class power ratio")
    ax.set_title("Welch Power Ratios at Electoral Frequencies")

    plt.tight_layout()
    fig_path = FIG_DIR / "eq_fourier_electoral_cycle_google_trends.png"
    plt.savefig(fig_path, dpi=300)
    print(f"Figure saved to {fig_path}")
