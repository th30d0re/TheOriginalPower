#!/usr/bin/env python3
"""
eq_fourier_electoral_cycle_robustness.py

Robustness checks and trend analysis for the Congressional Record spectral data.

Analyses:
  1. Lomb-Scargle periodogram on annual Congressional Record data
     (robustness check against FFT; should reproduce 4-yr peak).
  2. OLS linear trends on class_share and identity_share (1965-2024).
  3. OLS trends on per-axis identity sub-bands (from model-based decomposition).

Inputs:
  Paper/data/congressional_record_word_freq.csv
  Paper/data/congressional_record_word_freq_per_axis.csv

Outputs:
  Paper/figures/eq_fourier_electoral_cycle_lomb_scargle.pdf
  Paper/data/eq_fourier_electoral_cycle_ols_trends.csv
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from scipy.signal import lombscargle
from scipy import stats

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
FIGS = ROOT / "figures"
OUT = DATA / "eq_fourier_electoral_cycle_ols_trends.csv"

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
cr = pd.read_csv(DATA / "congressional_record_word_freq.csv", comment="#")
cr = cr.sort_values("year").reset_index(drop=True)

cr_per_axis = pd.read_csv(DATA / "congressional_record_word_freq_per_axis.csv", comment="#")
cr_per_axis = cr_per_axis.sort_values("year").reset_index(drop=True)

t = cr["year"].values
class_share = cr["class_share"].values
identity_share = cr["identity_share"].values
class_freq = cr["class_word_freq"].values
identity_freq = cr["identity_word_freq"].values

N = len(t)
t_normalized = t - t.min()  # Lomb-Scargle uses angular frequencies

# ---------------------------------------------------------------------------
# 1. Lomb-Scargle periodogram (robustness check)
# ---------------------------------------------------------------------------
# Angular frequency grid: periods from 2 to 30 years
periods = np.linspace(2, 30, 500)
omega = 2 * np.pi / periods

# Normalize signals to zero mean for Lomb-Scargle
id_detrended = identity_freq - identity_freq.mean()
cl_detrended = class_freq - class_freq.mean()

# Lomb-Scargle requires time in consistent units; t_normalized is in years
ls_identity = lombscargle(t_normalized, id_detrended, omega, normalize=True)
ls_class = lombscargle(t_normalized, cl_detrended, omega, normalize=True)

# ---------------------------------------------------------------------------
# 2. OLS trends on aggregate shares
# ---------------------------------------------------------------------------
slope_class, intercept_class, r_class, p_class, se_class = stats.linregress(t, class_share)
slope_identity, intercept_identity, r_identity, p_identity, se_identity = stats.linregress(t, identity_share)

# ---------------------------------------------------------------------------
# 3. OLS trends on per-axis sub-bands (from model-based decomposition)
# ---------------------------------------------------------------------------
per_axis_cols = ["race_word_freq", "gender_word_freq", "sexuality_word_freq"]
ols_results = []
for col in per_axis_cols:
    s, i, r, p, se = stats.linregress(t, cr_per_axis[col].values)
    ols_results.append({
        "variable": col,
        "slope": s,
        "intercept": i,
        "r_value": r,
        "r_squared": r**2,
        "p_value": p,
        "std_err": se,
    })

# Also add aggregate trends
ols_results.append({
    "variable": "class_share",
    "slope": slope_class,
    "intercept": intercept_class,
    "r_value": r_class,
    "r_squared": r_class**2,
    "p_value": p_class,
    "std_err": se_class,
})
ols_results.append({
    "variable": "identity_share",
    "slope": slope_identity,
    "intercept": intercept_identity,
    "r_value": r_identity,
    "r_squared": r_identity**2,
    "p_value": p_identity,
    "std_err": se_identity,
})

ols_df = pd.DataFrame(ols_results)
ols_df.to_csv(OUT, index=False, float_format="%.6f")
print(f"OLS trends written to {OUT}")
print(ols_df.to_string(index=False))

# ---------------------------------------------------------------------------
# 4. Plot Lomb-Scargle
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(2, 1, figsize=(10, 7), sharex=True)

ax = axes[0]
ax.plot(periods, ls_identity, color="red", lw=1.2, label="Identity band")
ax.axvline(x=4, color="black", ls="--", lw=0.8, alpha=0.5)
ax.axvline(x=6, color="gray", ls="--", lw=0.8, alpha=0.5)
ax.set_ylabel("Normalised Lomb-Scargle power")
ax.set_title("Congressional Record: Lomb-Scargle Periodogram (robustness check)")
ax.legend(loc="upper right")
ax.set_xlim(2, 30)

ax = axes[1]
ax.plot(periods, ls_class, color="blue", lw=1.2, label="Class band")
ax.axvline(x=4, color="black", ls="--", lw=0.8, alpha=0.5, label="4-yr presidential")
ax.axvline(x=6, color="gray", ls="--", lw=0.8, alpha=0.5, label="6-yr Senate")
ax.set_xlabel("Period (years)")
ax.set_ylabel("Normalised Lomb-Scargle power")
ax.legend(loc="upper right")
ax.set_xlim(2, 30)

plt.tight_layout()
fig_path = FIGS / "eq_fourier_electoral_cycle_lomb_scargle.pdf"
plt.savefig(fig_path, dpi=300)
print(f"Figure saved to {fig_path}")

# ---------------------------------------------------------------------------
# 5. Plot OLS trends
# ---------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(10, 5))
ax.scatter(t, class_share, color="blue", s=30, alpha=0.6, label="Class share (data)")
ax.scatter(t, identity_share, color="red", s=30, alpha=0.6, label="Identity share (data)")
ax.plot(t, slope_class * t + intercept_class, color="blue", lw=1.5, ls="--",
        label=f"Class trend: slope={slope_class:.4f}/yr (p={p_class:.3f})")
ax.plot(t, slope_identity * t + intercept_identity, color="red", lw=1.5, ls="--",
        label=f"Identity trend: slope={slope_identity:.4f}/yr (p={p_identity:.3f})")
ax.set_xlabel("Year")
ax.set_ylabel("Share of (class + identity) basket")
ax.set_title("Congressional Record: OLS Linear Trends (1965-2024)")
ax.legend(loc="center left", bbox_to_anchor=(1, 0.5))
ax.set_xlim(1965, 2024)
ax.set_ylim(0, 1)
plt.tight_layout()
fig_path = FIGS / "eq_fourier_electoral_cycle_ols_trends.pdf"
plt.savefig(fig_path, dpi=300)
print(f"Figure saved to {fig_path}")
