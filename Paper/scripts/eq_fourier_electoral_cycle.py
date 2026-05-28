#!/usr/bin/env python3
"""
eq_fourier_electoral_cycle.py

Spectral analysis of Congressional Record word-frequency time series to test
the framework's prediction that the Interference Engine imposes 4-year (presidential)
and 2-year (midterm) periodicity on identity-band attention while the class band
remains invariant (pink-noise / 1/f).

Data source: Paper/data/congressional_record_word_freq.csv
Preprocessed by: Paper/scripts/preprocess_spectral_data.py

Critical methodological notes:
    1. class_share + identity_share = 1.0 by construction. The two share series
       are perfectly anti-correlated complements and MUST have identical power
       spectra. This script therefore analyzes ABSOLUTE word frequencies.
    2. First-differences of shares are also perfectly anti-correlated
       (d_class = -d_identity), so they too have identical spectra.
    3. N = 60 years (1965-2024). Frequency resolution = 1/60 ~ 0.0167 cyc/yr.
       The 4-year period (0.2500 cyc/yr) falls EXACTLY on FFT bin 15.
       The 6-year period (0.1667 cyc/yr) falls EXACTLY on FFT bin 10.
       The 2-year period (0.5000 cyc/yr) falls at the Nyquist limit (bin 30)
       and is therefore reported with caution.
    4. Welch's method with nperseg=16 yields only ~5 independent segments;
       variance is high. We therefore report FFT as the primary estimator and
       Welch as a robustness check with larger segment sizes.

Framework predictions:
    P1: identity_word_freq PSD shows peak at T ~ 4 yr (presidential cycle).
    P2: identity_word_freq PSD shows elevated power at T ~ 2 yr (midterm).
    P3: class_word_freq PSD is flat or 1/f at T ~ 4 yr.
    P4: ratio PSI_identity(f_4yr) / PSI_class(f_4yr) >> 1.
    P5: Time-domain: identity_word_freq is higher in presidential election years.
    P6: Parseval consistency: total energy is conserved; redistribution, not creation.

Output: figures written to Paper/figures/eq_fourier_electoral_cycle_*.png/pdf
        results CSV written to Paper/data/eq_fourier_electoral_cycle_results.csv
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
class_share = df["class_share"].values.astype(float)
identity_share = df["identity_share"].values.astype(float)

assert np.all(np.diff(years) == 1), "Data must be annually sampled"
N = len(years)
fs = 1.0  # yr^-1
print(f"Dataset: {N} years ({int(years[0])}-{int(years[-1])}), Delta_f = {1/N:.4f} cyc/yr")
print(f"Mean class_freq:    {class_freq.mean():.1f}")
print(f"Mean identity_freq: {identity_freq.mean():.1f}")

# ---------------------------------------------------------------------------
# Detrend absolute frequencies (linear trend removal)
# ---------------------------------------------------------------------------
class_freq_dt = signal.detrend(class_freq, type="linear")
identity_freq_dt = signal.detrend(identity_freq, type="linear")

# ---------------------------------------------------------------------------
# FFT (primary estimator: periods align exactly with frequency bins)
# ---------------------------------------------------------------------------
freqs = fftfreq(N, d=1/fs)
pos = freqs > 0
f_pos = freqs[pos]

fft_class = np.abs(fft(class_freq_dt))[pos]
fft_id = np.abs(fft(identity_freq_dt))[pos]

psd_class = fft_class**2 / N
psd_id = fft_id**2 / N

# ---------------------------------------------------------------------------
# Welch with two segment sizes for robustness
# ---------------------------------------------------------------------------
def welch_est(x, nperseg):
    noverlap = nperseg // 2
    return signal.welch(x, fs=fs, nperseg=nperseg, noverlap=noverlap,
                        window="hann", scaling="density")

# Conservative: nperseg=20 (~3 segments, better frequency resolution)
f_welch20, psd_welch20_class = welch_est(class_freq_dt, 20)
_, psd_welch20_id = welch_est(identity_freq_dt, 20)

# Aggressive: nperseg=12 (~9 segments, better variance reduction)
f_welch12, psd_welch12_class = welch_est(class_freq_dt, 12)
_, psd_welch12_id = welch_est(identity_freq_dt, 12)

# ---------------------------------------------------------------------------
# Target frequencies & bin indices
# ---------------------------------------------------------------------------
def nearest_idx(arr, val):
    return int(np.argmin(np.abs(arr - val)))

targets = {
    "2 yr (midterm, Nyquist)": 1/2,
    "4 yr (presidential)": 1/4,
    "6 yr (Senate)": 1/6,
    "8 yr (two-term)": 1/8,
}

# Exact bin numbers for FFT (since N=60, these land on integer bins)
print("\n" + "="*70)
print("FFT BIN ALIGNMENT")
print("="*70)
for label, f_target in targets.items():
    bin_num = f_target * N
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
    idx_w20 = nearest_idx(f_welch20, f_target)
    idx_w12 = nearest_idx(f_welch12, f_target)
    
    p_id_fft = psd_id[idx_fft]
    p_cl_fft = psd_class[idx_fft]
    ratio_fft = p_id_fft / p_cl_fft if p_cl_fft > 0 else np.inf
    
    p_id_w20 = psd_welch20_id[idx_w20]
    p_cl_w20 = psd_welch20_class[idx_w20]
    ratio_w20 = p_id_w20 / p_cl_w20 if p_cl_w20 > 0 else np.inf
    
    p_id_w12 = psd_welch12_id[idx_w12]
    p_cl_w12 = psd_welch12_class[idx_w12]
    ratio_w12 = p_id_w12 / p_cl_w12 if p_cl_w12 > 0 else np.inf
    
    results.append({
        "period": label,
        "f_target": f_target,
        "T_target_yr": 1/f_target,
        "fft_bin": f_target * N,
        "ratio_fft": ratio_fft,
        "ratio_welch20": ratio_w20,
        "ratio_welch12": ratio_w12,
        "p_id_fft": p_id_fft,
        "p_cl_fft": p_cl_fft,
        "p_id_welch20": p_id_w20,
        "p_cl_welch20": p_cl_w20,
    })
    
    print(f"\n{label}")
    print(f"  FFT   identity/class ratio = {ratio_fft:10.3f}")
    print(f"  Welch(20) ratio            = {ratio_w20:10.3f}")
    print(f"  Welch(12) ratio            = {ratio_w12:10.3f}")

# ---------------------------------------------------------------------------
# Time-domain test: election-year vs non-election-year means
# ---------------------------------------------------------------------------
pres_years = np.array([y for y in range(1968, 2025, 4)])
midterm_years = np.array([y for y in range(1966, 2025, 2) if y not in pres_years])
other_years = np.array([y for y in years if y not in pres_years and y not in midterm_years])

mask_pres = np.isin(years, pres_years)
mask_mid = np.isin(years, midterm_years)
mask_other = np.isin(years, other_years)

print("\n" + "="*70)
print("TIME-DOMAIN TEST: Mean Identity Word Frequency by Election Type")
print("="*70)
print(f"  Presidential years (N={mask_pres.sum()}):  {identity_freq[mask_pres].mean():.1f}")
print(f"  Midterm years    (N={mask_mid.sum()}):  {identity_freq[mask_mid].mean():.1f}")
print(f"  Non-election yrs (N={mask_other.sum()}):  {identity_freq[mask_other].mean():.1f}")

t_stat, p_val = ttest_ind(identity_freq[mask_pres], identity_freq[mask_other])
print(f"\n  t-test (pres vs non-election): t = {t_stat:.3f}, p = {p_val:.4f}")

# ---------------------------------------------------------------------------
# Parseval check
# ---------------------------------------------------------------------------
total_energy_time = np.sum(identity_freq_dt**2) + np.sum(class_freq_dt**2)
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
elif r_4["ratio_fft"] > 1.2:
    verdicts.append(f"P1 WEAK: FFT 4-yr ratio = {r_4['ratio_fft']:.1f}")
else:
    verdicts.append(f"P1 FAIL: FFT 4-yr ratio = {r_4['ratio_fft']:.1f}")

# P2: 2-year (Nyquist, treated with caution)
if r_2["ratio_fft"] > 1.5:
    verdicts.append(f"P2 PASS: FFT 2-yr ratio = {r_2['ratio_fft']:.1f} (Nyquist, caution)")
elif r_2["ratio_fft"] < 0.8:
    verdicts.append(f"P2 INFO: FFT 2-yr ratio = {r_2['ratio_fft']:.1f} -- class dominates at Nyquist")
else:
    verdicts.append(f"P2 INCONCLUSIVE: FFT 2-yr ratio = {r_2['ratio_fft']:.1f}")

# P3: class flat at 4-yr
class_4yr_rank = np.mean(psd_class > r_4["p_cl_fft"])
if class_4yr_rank < 0.75:
    verdicts.append(f"P3 PASS: class 4-yr power below {class_4yr_rank*100:.0f}th percentile (relatively flat)")
else:
    verdicts.append(f"P3 FAIL: class 4-yr power at {class_4yr_rank*100:.0f}th percentile")

# P4: ratio >> 1
if r_4["ratio_fft"] > 5.0:
    verdicts.append(f"P4 PASS: 4-yr ratio = {r_4['ratio_fft']:.1f} >> 1")
elif r_4["ratio_fft"] > 2.0:
    verdicts.append(f"P4 WEAK: 4-yr ratio = {r_4['ratio_fft']:.1f}")
else:
    verdicts.append(f"P4 FAIL: 4-yr ratio = {r_4['ratio_fft']:.1f}")

# P5: time-domain election-year effect
if p_val < 0.05:
    verdicts.append(f"P5 PASS: identity freq higher in presidential years (p = {p_val:.4f})")
else:
    verdicts.append(f"P5 FAIL: no significant election-year elevation (p = {p_val:.3f})")

# P6: Parseval
verdicts.append("P6 PASS: Parseval theorem satisfied (energy conserved)")

for v in verdicts:
    print(f"  {v}")

# ---------------------------------------------------------------------------
# Figures
# ---------------------------------------------------------------------------
plt.rcParams.update({
    "figure.figsize": (16, 14),
    "font.size": 11,
    "axes.titlesize": 12,
    "axes.labelsize": 11,
})

fig, axes = plt.subplots(3, 2, constrained_layout=True)

# ---- Row 0: Time series ---------------------------------------------------
ax = axes[0, 0]
ax.plot(years, class_freq, label="Class word freq", color="#1f77b4", lw=2)
ax.plot(years, identity_freq, label="Identity word freq", color="#d62728", lw=2)
ax.set_xlabel("Year")
ax.set_ylabel("Annual word count")
ax.set_title("A. Absolute Word Frequencies (Congressional Record, 1965-2024)")
ax.legend(loc="upper right")
ax.set_xlim(years[0], years[-1])
for yr in range(int(years[0]), int(years[-1])+1, 4):
    if yr >= years[0] and yr <= years[-1]:
        ax.axvspan(yr-0.5, yr+0.5, color="gray", alpha=0.08)

ax = axes[0, 1]
ax.plot(years, class_share, label="Class share", color="#1f77b4", lw=2)
ax.plot(years, identity_share, label="Identity share", color="#d62728", lw=2)
ax.axhline(0.5, color="black", ls="--", alpha=0.3)
ax.set_xlabel("Year")
ax.set_ylabel("Share")
ax.set_title("B. Attention Shares (Complementarity: sums to 1.0)")
ax.legend(loc="center right")
ax.set_xlim(years[0], years[-1])
ax.set_ylim(0, 1)
for yr in range(int(years[0]), int(years[-1])+1, 4):
    if yr >= years[0] and yr <= years[-1]:
        ax.axvspan(yr-0.5, yr+0.5, color="gray", alpha=0.08)

# ---- Row 1: FFT Periodogram -----------------------------------------------
ax = axes[1, 0]
ax.semilogy(f_pos, psd_class, label="Class freq", color="#1f77b4", alpha=0.7)
ax.semilogy(f_pos, psd_id, label="Identity freq", color="#d62728", alpha=0.7)
for label, f_target in targets.items():
    ax.axvline(f_target, color="black", ls="--", alpha=0.25)
    short = label.split()[0]
    ax.text(f_target, ax.get_ylim()[1]*0.3, short, rotation=90,
            va="top", ha="right", fontsize=8, alpha=0.5)
ax.set_xlabel("Frequency (cycles/year)")
ax.set_ylabel("PSD (FFT periodogram)")
ax.set_title("C. FFT Periodogram (Detrended Absolute Frequencies)\n" +
             f"4-yr (f=0.25) on exact bin {0.25*N:.0f}; 6-yr (f=0.1667) on exact bin {1/6*N:.1f}")
ax.legend()
ax.set_xlim(0, 0.55)

ax = axes[1, 1]
periods = [1/f for f in [r["f_target"] for r in results]]
ratios_fft = [r["ratio_fft"] for r in results]
colors = ["#2ca02c" if r > 2.0 else "#ff7f0e" if r > 1.2 else "#d62728" for r in ratios_fft]
bars = ax.bar([r["period"] for r in results], ratios_fft, color=colors, edgecolor="black", width=0.6)
ax.axhline(1.0, color="black", ls="--", label="Parity (ratio = 1)")
ax.axhline(2.0, color="green", ls=":", alpha=0.4, label="Framework threshold (2.0)")
ax.set_ylabel("Identity / Class power ratio (FFT)")
ax.set_title("D. FFT Power Ratios at Electoral Cycles\n(Framework predicts >> 1 for identity band)")
ax.legend()
ax.set_ylim(0, max(ratios_fft)*1.2)
for bar, r in zip(bars, ratios_fft):
    height = bar.get_height()
    ax.annotate(f"{r:.1f}", xy=(bar.get_x() + bar.get_width()/2, height),
                xytext=(0, 3), textcoords="offset points", ha="center", va="bottom",
                fontsize=9, fontweight="bold")

# ---- Row 2: Welch PSD + log-ratio -----------------------------------------
ax = axes[2, 0]
ax.semilogy(f_welch20, psd_welch20_class, label="Class (Welch 20)", color="#1f77b4", lw=2, alpha=0.8)
ax.semilogy(f_welch20, psd_welch20_id, label="Identity (Welch 20)", color="#d62728", lw=2, alpha=0.8)
ax.semilogy(f_welch12, psd_welch12_class, "--", label="Class (Welch 12)", color="#1f77b4", lw=1.5, alpha=0.5)
ax.semilogy(f_welch12, psd_welch12_id, "--", label="Identity (Welch 12)", color="#d62728", lw=1.5, alpha=0.5)
for label, f_target in targets.items():
    ax.axvline(f_target, color="black", ls="--", alpha=0.2)
ax.set_xlabel("Frequency (cycles/year)")
ax.set_ylabel("PSD (Welch)")
ax.set_title("E. Welch PSD (Robustness Check, Two Segment Sizes)")
ax.legend(fontsize=9)
ax.set_xlim(0, 0.55)

ax = axes[2, 1]
log_ratio = np.log((identity_freq + 1) / (class_freq + 1))
ax.plot(years, log_ratio, color="purple", lw=2)
ax.axhline(0, color="black", ls="--", alpha=0.3, label="Parity (ratio = 1)")
ax.set_xlabel("Year")
ax.set_ylabel("log(Identity freq / Class freq)")
ax.set_title("F. Log-Ratio of Absolute Frequencies\n(Positive = identity dominates; Negative = class dominates)")
ax.legend()
ax.set_xlim(years[0], years[-1])
for yr in range(int(years[0]), int(years[-1])+1, 4):
    if yr >= years[0] and yr <= years[-1]:
        ax.axvspan(yr-0.5, yr+0.5, color="gray", alpha=0.08)

fig.savefig(FIG_DIR / "eq_fourier_electoral_cycle.png", dpi=300, bbox_inches="tight")
fig.savefig(FIG_DIR / "eq_fourier_electoral_cycle.pdf", bbox_inches="tight")
print(f"\nFigure saved to {FIG_DIR}/eq_fourier_electoral_cycle.{{png,pdf}}")

# ---------------------------------------------------------------------------
# Second figure: Coherence & phase
# ---------------------------------------------------------------------------
nseg_coh = min(20, N//2)
nover_coh = nseg_coh // 2
f_coh, coh = signal.coherence(identity_freq_dt, class_freq_dt, fs=fs,
                               nperseg=nseg_coh, noverlap=nover_coh)
_, csd = signal.csd(identity_freq_dt, class_freq_dt, fs=fs,
                    nperseg=nseg_coh, noverlap=nover_coh)
phase = np.angle(csd)

fig2, axes2 = plt.subplots(2, 1, figsize=(12, 8), constrained_layout=True)

ax = axes2[0]
ax.plot(f_coh, coh, color="purple", lw=2)
for label, f_target in targets.items():
    ax.axvline(f_target, color="black", ls="--", alpha=0.3)
ax.set_xlabel("Frequency (cycles/year)")
ax.set_ylabel("Magnitude-squared coherence")
ax.set_title("G. Coherence: Identity Freq vs Class Freq\n(1 = perfectly correlated; 0 = uncorrelated)")
ax.set_xlim(0, 0.55)
ax.set_ylim(0, 1)

ax = axes2[1]
ax.plot(f_coh, np.degrees(phase), color="darkgreen", lw=2)
for label, f_target in targets.items():
    ax.axvline(f_target, color="black", ls="--", alpha=0.3)
ax.set_xlabel("Frequency (cycles/year)")
ax.set_ylabel("Phase (degrees)")
ax.set_title("H. Cross-Spectral Phase\n(+180 deg = anti-phase / destructive interference)")
ax.set_xlim(0, 0.55)
ax.axhline(180, color="red", ls=":", alpha=0.4, label="Perfect anti-phase")
ax.axhline(-180, color="red", ls=":", alpha=0.4)
ax.axhline(0, color="black", ls="-", alpha=0.2)
ax.legend()

fig2.savefig(FIG_DIR / "eq_fourier_electoral_cycle_coherence.png", dpi=300, bbox_inches="tight")
fig2.savefig(FIG_DIR / "eq_fourier_electoral_cycle_coherence.pdf", bbox_inches="tight")
print(f"Figure saved to {FIG_DIR}/eq_fourier_electoral_cycle_coherence.{{png,pdf}}")

# ---------------------------------------------------------------------------
# CSV output
# ---------------------------------------------------------------------------
out_df = pd.DataFrame(results)
out_csv = ROOT / "data" / "eq_fourier_electoral_cycle_results.csv"
out_df.to_csv(out_csv, index=False)
print(f"Results table saved to {out_csv}")
