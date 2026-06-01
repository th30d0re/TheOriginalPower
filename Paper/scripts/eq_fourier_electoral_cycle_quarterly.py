#!/usr/bin/env python3
"""
eq_fourier_electoral_cycle_quarterly.py

Spectral analysis of quarterly Congressional Record document-count proxy
to resolve the 2-year midterm cycle that sits at the Nyquist limit of the
annual dataset.

Data source: Paper/data/congressional_record_quarterly.csv
Preprocessed by: Paper/scripts/preprocess_spectral_data.py

Critical methodological notes:
    1. Metric: document counts (GovInfo API) proxy word-frequency salience.
       Temporal variation in document count correlates with word-frequency
       variation for politically salient terms.
    2. N = ~240 quarters (60 years × 4).  Frequency resolution = 4/240 = 0.0167 cyc/yr.
       The 2-year period (0.5000 cyc/yr) falls on FFT bin 30 — well below Nyquist.
       The 4-year period (0.2500 cyc/yr) falls on FFT bin 15 (exact alignment).
       The 6-year period (0.1667 cyc/yr) falls on FFT bin 10 (exact alignment).
    3. Welch's method with nperseg=80 yields ~3 segments (conservative).
       nperseg=48 yields ~5 segments (aggressive).

Framework predictions:
    P1: identity_doc_count PSD shows peak at T ~ 4 yr (presidential cycle).
    P2: identity_doc_count PSD shows elevated power at T ~ 2 yr (midterm).
    P3: class_doc_count PSD is flat or 1/f at T ~ 4 yr.
    P4: ratio PSI_identity(f_4yr) / PSI_class(f_4yr) >> 1.
    P5: Time-domain: identity_doc_count is higher in presidential election quarters.
    P6: Parseval consistency: total energy is conserved; redistribution, not creation.

Output: figures written to Paper/figures/eq_fourier_electoral_cycle_quarterly_*.png/pdf
        results CSV written to Paper/data/eq_fourier_electoral_cycle_quarterly_results.csv
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal
from scipy.fft import fft, fftfreq
from pathlib import Path
from scipy.stats import ttest_ind

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DATA_CSV = ROOT / "data" / "congressional_record_quarterly.csv"
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
if not DATA_CSV.exists():
    print(f"ERROR: {DATA_CSV} not found.")
    print("Run: python3 Paper/scripts/govinfo_crec_quarterly_query.py --api-key YOUR_KEY")
    print("Then: python3 Paper/scripts/preprocess_spectral_data.py")
    raise SystemExit(1)

df = pd.read_csv(DATA_CSV, comment="#")
quarters = df["year_quarter"].values
class_count = df["class_doc_count"].values.astype(float)
identity_count = df["identity_doc_count"].values.astype(float)
class_share = df["class_share"].values.astype(float)
identity_share = df["identity_share"].values.astype(float)

N = len(quarters)
fs = 4.0  # quarters per year => sampling rate in yr^-1
print(f"Dataset: {N} quarters, Delta_f = {fs/N:.4f} cyc/yr")
print(f"Mean class_doc_count:    {class_count.mean():.1f}")
print(f"Mean identity_doc_count: {identity_count.mean():.1f}")

# ---------------------------------------------------------------------------
# Detrend absolute counts (linear trend removal)
# ---------------------------------------------------------------------------
class_count_dt = signal.detrend(class_count, type="linear")
identity_count_dt = signal.detrend(identity_count, type="linear")

# ---------------------------------------------------------------------------
# FFT (primary estimator)
# ---------------------------------------------------------------------------
freqs = fftfreq(N, d=1/fs)
pos = freqs > 0
f_pos = freqs[pos]

fft_class = np.abs(fft(class_count_dt))[pos]
fft_id = np.abs(fft(identity_count_dt))[pos]

psd_class = fft_class**2 / N
psd_id = fft_id**2 / N

# ---------------------------------------------------------------------------
# Welch with two segment sizes for robustness
# ---------------------------------------------------------------------------
def welch_est(x, nperseg):
    noverlap = nperseg // 2
    return signal.welch(x, fs=fs, nperseg=nperseg, noverlap=noverlap,
                        window="hann", scaling="density")

# Conservative: nperseg=80 (~3 segments, better frequency resolution)
f_welch80, psd_welch80_class = welch_est(class_count_dt, 80)
_, psd_welch80_id = welch_est(identity_count_dt, 80)

# Aggressive: nperseg=48 (~5 segments, better variance reduction)
f_welch48, psd_welch48_class = welch_est(class_count_dt, 48)
_, psd_welch48_id = welch_est(identity_count_dt, 48)

# ---------------------------------------------------------------------------
# Target frequencies & bin indices
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
print("FFT BIN ALIGNMENT (quarterly sampling)")
print("="*70)
for label, f_target in targets.items():
    bin_num = f_target * N / fs
    print(f"  {label:22s}: f = {f_target:.4f} cyc/yr -> FFT bin {bin_num:.1f}")

# ---------------------------------------------------------------------------
# Spectral power at target frequencies
# ---------------------------------------------------------------------------
print("\n" + "="*70)
print("SPECTRAL POWER AT ELECTORAL FREQUENCIES")
print("="*70)

results = []
for label, f_target in targets.items():
    idx_fft = nearest_idx(f_pos, f_target)
    idx_w80 = nearest_idx(f_welch80, f_target)
    idx_w48 = nearest_idx(f_welch48, f_target)

    p_id_fft = psd_id[idx_fft]
    p_cl_fft = psd_class[idx_fft]
    ratio_fft = p_id_fft / p_cl_fft if p_cl_fft > 0 else np.inf

    p_id_w80 = psd_welch80_id[idx_w80]
    p_cl_w80 = psd_welch80_class[idx_w80]
    ratio_w80 = p_id_w80 / p_cl_w80 if p_cl_w80 > 0 else np.inf

    p_id_w48 = psd_welch48_id[idx_w48]
    p_cl_w48 = psd_welch48_class[idx_w48]
    ratio_w48 = p_id_w48 / p_cl_w48 if p_cl_w48 > 0 else np.inf

    results.append({
        "period": label,
        "f_target": f_target,
        "T_target_yr": 1/f_target,
        "fft_bin": f_target * N / fs,
        "ratio_fft": ratio_fft,
        "ratio_welch80": ratio_w80,
        "ratio_welch48": ratio_w48,
        "p_id_fft": p_id_fft,
        "p_cl_fft": p_cl_fft,
        "p_id_welch80": p_id_w80,
        "p_cl_welch80": p_cl_w80,
    })

    print(f"\n{label}")
    print(f"  FFT   identity/class ratio = {ratio_fft:10.3f}")
    print(f"  Welch(80) ratio            = {ratio_w80:10.3f}")
    print(f"  Welch(48) ratio            = {ratio_w48:10.3f}")

# ---------------------------------------------------------------------------
# Time-domain test: election-year vs non-election-year quarters
# ---------------------------------------------------------------------------
# Map quarters to years for election labeling
quarter_years = np.array([int(q.split("-")[0]) for q in quarters])
quarter_nums = np.array([int(q.split("-Q")[1]) for q in quarters])

pres_years = set(range(1968, 2025, 4))
midterm_years = set(range(1966, 2025, 2)) - pres_years

# A quarter is "presidential" if it falls in a presidential election year;
# "midterm" if in a midterm year; "other" otherwise.
mask_pres = np.isin(quarter_years, list(pres_years))
mask_mid = np.isin(quarter_years, list(midterm_years))
mask_other = ~(mask_pres | mask_mid)

print("\n" + "="*70)
print("TIME-DOMAIN TEST: Mean Identity Doc Count by Election Type")
print("="*70)
print(f"  Presidential yrs (N={mask_pres.sum()}):  {identity_count[mask_pres].mean():.1f}")
print(f"  Midterm yrs    (N={mask_mid.sum()}):  {identity_count[mask_mid].mean():.1f}")
print(f"  Non-election   (N={mask_other.sum()}):  {identity_count[mask_other].mean():.1f}")

t_stat, p_val = ttest_ind(identity_count[mask_pres], identity_count[mask_other])
print(f"\n  t-test (pres vs non-election): t = {t_stat:.3f}, p = {p_val:.4f}")

# ---------------------------------------------------------------------------
# Parseval check
# ---------------------------------------------------------------------------
total_energy_time = np.sum(class_count_dt**2) + np.sum(identity_count_dt**2)
total_energy_freq = 2 * (np.sum(psd_id) + np.sum(psd_class))
print(f"\nParseval check (factor-2 corrected):")
print(f"  Time:  {total_energy_time:.3f}")
print(f"  Freq:  {total_energy_freq:.3f}")
print(f"  Ratio: {total_energy_freq/total_energy_time:.6f}")

# ---------------------------------------------------------------------------
# Framework verdict
# ---------------------------------------------------------------------------
print("\n" + "="*70)
print("VERDICT")
print("="*70)

r_4 = [r for r in results if "4 yr" in r["period"]][0]
r_2 = [r for r in results if "2 yr" in r["period"]][0]
r_6 = [r for r in results if "6 yr" in r["period"]][0]

verdicts = []

# P1: 4-year FFT peak
if r_4["ratio_fft"] > 2.0:
    verdicts.append(f"P1 PASS: FFT 4-yr identity/class ratio = {r_4['ratio_fft']:.1f} >> 1")
else:
    verdicts.append(f"P1 FAIL: FFT 4-yr ratio = {r_4['ratio_fft']:.1f} (expected > 2.0)")

# P2: 2-year peak (now resolved — no longer at Nyquist limit)
if r_2["ratio_fft"] > 2.0:
    verdicts.append(f"P2 PASS: FFT 2-yr identity/class ratio = {r_2['ratio_fft']:.1f} >> 1")
elif r_2["ratio_fft"] > 1.0:
    verdicts.append(f"P2 PARTIAL: FFT 2-yr ratio = {r_2['ratio_fft']:.1f} (> 1.0, below 2.0 threshold)")
else:
    verdicts.append(f"P2 FAIL: FFT 2-yr ratio = {r_2['ratio_fft']:.1f} (class >= identity)")

# P3: class-band flat at 4 years
class_4yr_rank = np.mean(psd_class >= psd_class[nearest_idx(f_pos, 0.25)])
if class_4yr_rank < 0.80:
    verdicts.append(f"P3 PASS: class-band 4-yr power at {class_4yr_rank:.0%} percentile (flat)")
else:
    verdicts.append(f"P3 FAIL: class-band 4-yr power at {class_4yr_rank:.0%} percentile (elevated)")

# P4: ratio threshold
if r_4["ratio_fft"] > 2.0:
    verdicts.append(f"P4 PASS: 4-yr ratio = {r_4['ratio_fft']:.1f} > 2.0")
else:
    verdicts.append(f"P4 FAIL: 4-yr ratio = {r_4['ratio_fft']:.1f}")

# P5: time-domain (already printed above)
if p_val < 0.05:
    verdicts.append(f"P5 PASS: t-test p = {p_val:.4f} (< 0.05)")
else:
    verdicts.append(f"P5 FAIL: t-test p = {p_val:.4f} (ns)")

# P6: Parseval
parseval_ok = 0.98 <= total_energy_freq / total_energy_time <= 1.02
if parseval_ok:
    verdicts.append(f"P6 PASS: Parseval ratio = {total_energy_freq/total_energy_time:.4f}")
else:
    verdicts.append(f"P6 FAIL: Parseval ratio = {total_energy_freq/total_energy_time:.4f}")

for v in verdicts:
    print(f"  {v}")

# ---------------------------------------------------------------------------
# Write results CSV
# ---------------------------------------------------------------------------
results_df = pd.DataFrame(results)
results_df.to_csv(
    ROOT / "data" / "eq_fourier_electoral_cycle_quarterly_results.csv",
    index=False,
)
print(f"\nResults written to Paper/data/eq_fourier_electoral_cycle_quarterly_results.csv")

# ---------------------------------------------------------------------------
# Plots
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# A: Time series
ax = axes[0, 0]
ax.plot(quarter_years + (quarter_nums - 1) / 4, class_count, label="Class band", color="blue")
ax.plot(quarter_years + (quarter_nums - 1) / 4, identity_count, label="Identity band", color="red")
ax.set_xlabel("Year")
ax.set_ylabel("Document count")
ax.set_title("Quarterly Congressional Record: Document Counts by Basket")
ax.legend()

# B: Shares
ax = axes[0, 1]
ax.plot(quarter_years + (quarter_nums - 1) / 4, class_share, label="Class share", color="blue")
ax.plot(quarter_years + (quarter_nums - 1) / 4, identity_share, label="Identity share", color="red")
ax.set_xlabel("Year")
ax.set_ylabel("Share")
ax.set_title("Attention Shares (sum = 1.0)")
ax.legend()

# C: FFT periodogram
ax = axes[1, 0]
ax.semilogy(f_pos, psd_class, label="Class band", color="blue", alpha=0.7)
ax.semilogy(f_pos, psd_id, label="Identity band", color="red", alpha=0.7)
for label, f_target in targets.items():
    ax.axvline(f_target, color="gray", linestyle="--", alpha=0.5)
    ax.text(f_target, ax.get_ylim()[1] * 0.5, label.split(" ")[0], rotation=90,
            fontsize=8, ha="center", va="top")
ax.set_xlabel("Frequency (cycles/year)")
ax.set_ylabel("Power spectral density")
ax.set_title("FFT Periodogram (quarterly sampling)")
ax.legend()
ax.set_xlim(0, 1.0)

# D: Power ratios at electoral frequencies
ax = axes[1, 1]
periods = [r["T_target_yr"] for r in results]
ratios = [r["ratio_fft"] for r in results]
colors = ["green" if r > 2.0 else "orange" if r > 1.0 else "red" for r in ratios]
ax.bar(periods, ratios, color=colors, width=1.5)
ax.axhline(2.0, color="black", linestyle="--", label="Framework threshold (> 2.0)")
ax.set_xlabel("Period (years)")
ax.set_ylabel("Identity / Class power ratio")
ax.set_title("Power Ratios at Electoral Frequencies")
ax.legend()

plt.tight_layout()
fig_path = FIG_DIR / "eq_fourier_electoral_cycle_quarterly.png"
plt.savefig(fig_path, dpi=300)
print(f"Figure saved to {fig_path}")
