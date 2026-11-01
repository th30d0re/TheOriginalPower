#!/usr/bin/env python3
"""
eq_fourier_australian_parliament.py

Spectral analysis of Australian House of Representatives Hansard debates
to test the cross-national validity of the electoral-carrier hypothesis.

Theory:
    The US Congressional Record shows a 24:1 identity/class power ratio at
    the 4-year presidential cycle. If this is a general property of electoral
    democracies (not an American artifact), Australia's House of Representatives
    (3-year maximum terms, typically 2.6-3.2 years) should show a corresponding
    peak at ~3 years, NOT at 4 years. If Australia also shows a 4-year peak,
    the electoral-cycle-specific hypothesis is falsified.

Data:
    Australian Parliamentary Debates (1998-2025) from Zenodo:
    https://zenodo.org/records/17351233
    Parquet format, parsed from official XML Hansard transcripts.

Methods:
    1. Annual keyword counts for class and identity bands
    2. FFT periodogram (primary estimator)
    3. Lomb-Scargle periodogram (robustness check for irregular sampling)
    4. Epoch analysis around actual election dates

Output:
    Paper/figures/eq_fourier_australian_parliament.png (and .pdf)
    Paper/data/eq_fourier_australian_parliament_results.csv (annual counts;
        written only when the parquet is read)
    Paper/data/eq_fourier_australian_parliament_ratios.csv (period ratios)

Usage:
    python3 Paper/scripts/eq_fourier_australian_parliament.py                 # parquet if present
    python3 Paper/scripts/eq_fourier_australian_parliament.py --from-results  # rerun spectra only
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal
from scipy.fft import rfft, rfftfreq
from scipy.signal import lombscargle
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from spectral_bins import target_bins, ratio_context, rank_of  # noqa: E402

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
DATA_PARQUET = Path("/tmp/australian_hansard.parquet")
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Australian federal election dates (House of Representatives)
# ---------------------------------------------------------------------------
# Source: Australian Electoral Commission
# https://www.aec.gov.au/Elections/Australian_Electoral_History/Federal_Election_Dates.htm
AUSTRALIAN_ELECTIONS = [
    "1998-10-03",
    "2001-11-10",
    "2004-10-09",
    "2007-11-24",
    "2010-08-21",
    "2013-09-07",
    "2016-07-02",
    "2019-05-18",
    "2022-05-21",
]

# ---------------------------------------------------------------------------
# Keyword baskets (English - same as US but adapted for Australian context)
# ---------------------------------------------------------------------------
CLASS_KEYWORDS = [
    "union", "strike", "minimum wage", "labour", "working class",
    "wages", "collective bargaining", "fair work", "industrial action",
    "income inequality", "wealth gap", "class warfare", "workers",
    "labour rights", "trade union",
]

IDENTITY_KEYWORDS = [
    "race", "racial", "racism", "gender", "sexism", "immigration",
    "immigrant", "religion", "religious", "sexuality", "lgbt",
    "transgender", "aboriginal", "torres strait", "indigenous",
    "multicultural", "asylum seeker", "refugee", "islam",
    "discrimination", "prejudice", "bigotry",
]

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
# Two entry points:
#   * the raw Zenodo parquet (keyword counting + spectral analysis), or
#   * --from-results / no parquet: rerun the spectral stage from the annual
#     counts this script already wrote to RESULTS_CSV. The parquet is not
#     tracked in git, so this keeps the spectral analysis reproducible.
RESULTS_CSV = ROOT / "data" / "eq_fourier_australian_parliament_results.csv"
FROM_RESULTS = "--from-results" in sys.argv or not DATA_PARQUET.exists()

if FROM_RESULTS:
    print(f"Loading annual counts from {RESULTS_CSV} (parquet not used)")
    _prev = pd.read_csv(RESULTS_CSV)
    years = [int(y) for y in _prev["year"]]
    class_counts = _prev["class_count"].to_numpy(dtype=float)
    identity_counts = _prev["identity_count"].to_numpy(dtype=float)
else:
    print(f"Loading {DATA_PARQUET}...")
    df = pd.read_parquet(DATA_PARQUET)
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")

    # ---------------------------------------------------------------------------
    # Extract annual counts
    # ---------------------------------------------------------------------------
    df["year"] = pd.to_datetime(df["date"]).dt.year

    # Combine all text fields
    if "body" in df.columns:
        text_col = "body"
    elif "text" in df.columns:
        text_col = "text"
    elif "speech" in df.columns:
        text_col = "speech"
    else:
        # Try to find a text column
        text_candidates = [c for c in df.columns if df[c].dtype == object and df[c].str.len().mean() > 50]
        text_col = text_candidates[0] if text_candidates else None
        print(f"Using text column: {text_col}")

    print(f"Text column: {text_col}")
    print(f"Sample text: {df[text_col].iloc[0][:200]}")

    # Count keyword occurrences per year
    def count_keywords(texts, keywords):
        """Count total occurrences of keywords in a series of texts."""
        total = 0
        for text in texts.dropna():
            text_lower = str(text).lower()
            for kw in keywords:
                total += text_lower.count(kw.lower())
        return total

    years = sorted(df["year"].unique())
    years = [y for y in years if 1998 <= y <= 2024]

    class_counts = []
    identity_counts = []

    for year in years:
        year_df = df[df["year"] == year]
        class_counts.append(count_keywords(year_df[text_col], CLASS_KEYWORDS))
        identity_counts.append(count_keywords(year_df[text_col], IDENTITY_KEYWORDS))
        print(f"{year}: class={class_counts[-1]:>5}, identity={identity_counts[-1]:>5}")

    class_counts = np.array(class_counts, dtype=float)
    identity_counts = np.array(identity_counts, dtype=float)

N = len(years)
fs = 1.0  # yr^-1

print(f"\nDataset: {N} years ({years[0]}-{years[-1]}), Delta_f = {1/N:.4f} cyc/yr")

# ---------------------------------------------------------------------------
# Detrend
# ---------------------------------------------------------------------------
class_dt = signal.detrend(class_counts, type="linear")
identity_dt = signal.detrend(identity_counts, type="linear")

# ---------------------------------------------------------------------------
# FFT Periodogram
# ---------------------------------------------------------------------------
# One-sided spectrum via rfft. The previous slice fft(...)[:N//2] dropped the
# highest positive bin for odd N (N = 27: f = 13/27 = 0.481 cyc/yr, 2.08 yr).
fft_class = rfft(class_dt)
fft_identity = rfft(identity_dt)

psd_class = np.abs(fft_class)**2 / N
psd_identity = np.abs(fft_identity)**2 / N
freqs = rfftfreq(N, d=1.0)
periods_fft = 1.0 / freqs[1:]  # skip DC

# ---------------------------------------------------------------------------
# Power ratios at key periods
# ---------------------------------------------------------------------------
# Each target period is reported at its exact bin when one exists (T = 3 yr at
# N = 27) and otherwise at both bracketing bins, each labelled with its true
# period. A target beyond Nyquist (T = 2 yr; Nyquist here is 2.08 yr) has only
# the last bin below it.
f_pos = freqs[1:]
CTX = ratio_context(f_pos, psd_identity[1:], psd_class[1:])
ratio_rows = []
for T in [2, 3, 4, 5, 6]:
    idx_list, on_grid = target_bins(f_pos, 1.0 / T)
    for i in idx_list:
        p_id, p_cl = psd_identity[1:][i], psd_class[1:][i]
        ratio = p_id / p_cl if p_cl > 0 else np.inf
        ratio_rows.append({"target_period_yr": T, "bin_period_yr": 1.0 / f_pos[i], "bin_freq": f_pos[i],
                           "on_grid": on_grid, "identity_psd": p_id, "class_psd": p_cl, "ratio": ratio,
                           "rank_among_bins": rank_of(CTX["ratios"], ratio), "n_bins": CTX["n_bins"]})
        print(f"T={T}yr: bin {1.0/f_pos[i]:.2f}yr ({'exact' if on_grid else 'bracketing'}): "
              f"identity/class ratio = {ratio:.2f} (rank {rank_of(CTX['ratios'], ratio)} of {CTX['n_bins']})")
print(f"All-bin context: median ratio {CTX['median']:.2f}; "
      f"{CTX['n_at_or_above']} of {CTX['n_bins']} bins >= {CTX['threshold']:.0f}")

# ---------------------------------------------------------------------------
# Lomb-Scargle Periodogram (robustness check)
# ---------------------------------------------------------------------------
# LS handles irregular sampling; we'll use it with the actual years
# Normalize years to start at 0
t_ls = np.array(years) - years[0]

# Frequency grid: 0.1 to 0.5 cyc/yr (periods 2 to 10 years)
freqs_ls = np.linspace(0.1, 0.5, 1000)
angular_freqs = 2 * np.pi * freqs_ls

# Lomb-Scargle requires normalization
class_norm = (class_dt - class_dt.mean()) / class_dt.std()
identity_norm = (identity_dt - identity_dt.mean()) / identity_dt.std()

power_ls_class = lombscargle(t_ls, class_norm, angular_freqs, normalize=True)
power_ls_identity = lombscargle(t_ls, identity_norm, angular_freqs, normalize=True)

periods_ls = 1.0 / freqs_ls

# ---------------------------------------------------------------------------
# Epoch analysis: align by election dates
# ---------------------------------------------------------------------------
election_years = [pd.to_datetime(d).year for d in AUSTRALIAN_ELECTIONS]

# Create election-year indicator
election_mask = np.isin(years, election_years)
post_election_mask = np.isin(years, [y+1 for y in election_years])
midterm_mask = np.isin(years, [y+2 for y in election_years])

print(f"\nElection years: {[y for y, m in zip(years, election_mask) if m]}")
print(f"Post-election years: {[y for y, m in zip(years, post_election_mask) if m]}")
print(f"Mid-term years: {[y for y, m in zip(years, midterm_mask) if m]}")

# Compute epoch means
epoch_identity = {
    "Election year": identity_counts[election_mask],
    "Post-election": identity_counts[post_election_mask],
    "Mid-term": identity_counts[midterm_mask],
}

epoch_class = {
    "Election year": class_counts[election_mask],
    "Post-election": class_counts[post_election_mask],
    "Mid-term": class_counts[midterm_mask],
}

print("\nEpoch analysis (identity band):")
for label, vals in epoch_identity.items():
    if len(vals) > 0:
        print(f"  {label}: mean={vals.mean():.1f}, n={len(vals)}")

print("\nEpoch analysis (class band):")
for label, vals in epoch_class.items():
    if len(vals) > 0:
        print(f"  {label}: mean={vals.mean():.1f}, n={len(vals)}")

# ---------------------------------------------------------------------------
# Save results
# ---------------------------------------------------------------------------
results = pd.DataFrame({
    "year": years,
    "class_count": class_counts,
    "identity_count": identity_counts,
    "class_dt": class_dt,
    "identity_dt": identity_dt,
    "election_year": election_mask,
})
if not FROM_RESULTS:
    results.to_csv(RESULTS_CSV, index=False)
    print(f"\nSaved results to {RESULTS_CSV}")
ratios_path = ROOT / "data" / "eq_fourier_australian_parliament_ratios.csv"
pd.DataFrame(ratio_rows).to_csv(ratios_path, index=False)
print(f"Saved period ratios to {ratios_path}")

# ---------------------------------------------------------------------------
# Figure
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Panel A: Time series
ax = axes[0, 0]
ax.plot(years, identity_counts, "r-o", linewidth=1.5, markersize=4, label="Identity band")
ax.plot(years, class_counts, "b-s", linewidth=1.5, markersize=4, alpha=0.7, label="Class band")
for ey in election_years:
    if ey in years:
        ax.axvline(ey, color="gray", linestyle=":", alpha=0.5)
ax.set_xlabel("Year")
ax.set_ylabel("Annual keyword count")
ax.set_title("A. Australian Hansard: Absolute Keyword Frequencies")
ax.legend(loc="upper left")
ax.grid(True, alpha=0.3)

# Panel B: FFT Periodogram
ax = axes[0, 1]
ax.plot(periods_fft, psd_identity[1:], "r-", linewidth=2, label="Identity band")
ax.plot(periods_fft, psd_class[1:], "b-", linewidth=2, alpha=0.7, label="Class band")
ax.axvline(3.0, color="green", linestyle="--", linewidth=1.5, alpha=0.8, label="3-yr (Aus cycle)")
ax.axvline(4.0, color="cyan", linestyle="--", linewidth=1.5, alpha=0.8, label="4-yr (US carrier)")
ax.set_xlabel("Period (years)")
ax.set_ylabel("Power")
ax.set_title("B. FFT Periodogram")
ax.set_xlim(2, 10)
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)

# Panel C: Lomb-Scargle Periodogram
ax = axes[1, 0]
ax.plot(periods_ls, power_ls_identity, "r-", linewidth=2, label="Identity band")
ax.plot(periods_ls, power_ls_class, "b-", linewidth=2, alpha=0.7, label="Class band")
ax.axvline(3.0, color="green", linestyle="--", linewidth=1.5, alpha=0.8, label="3-yr (Aus cycle)")
ax.axvline(4.0, color="cyan", linestyle="--", linewidth=1.5, alpha=0.8, label="4-yr (US carrier)")
ax.set_xlabel("Period (years)")
ax.set_ylabel("Lomb-Scargle Power")
ax.set_title("C. Lomb-Scargle Periodogram (Robustness Check)")
ax.set_xlim(2, 10)
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)

# Panel D: Epoch analysis
ax = axes[1, 1]
labels = ["Election\nyear", "Post-\nelection", "Mid-term"]
identity_means = [epoch_identity["Election year"].mean(),
                  epoch_identity["Post-election"].mean(),
                  epoch_identity["Mid-term"].mean()]
class_means = [epoch_class["Election year"].mean(),
               epoch_class["Post-election"].mean(),
               epoch_class["Mid-term"].mean()]

x = np.arange(len(labels))
width = 0.35
ax.bar(x - width/2, identity_means, width, label="Identity band", color="red", alpha=0.7)
ax.bar(x + width/2, class_means, width, label="Class band", color="blue", alpha=0.7)
ax.set_ylabel("Mean keyword count")
ax.set_title("D. Epoch Analysis by Election Cycle Phase")
ax.set_xticks(x)
ax.set_xticklabels(labels)
ax.legend()
ax.grid(True, alpha=0.3, axis="y")

plt.tight_layout()
fig_path = FIG_DIR / "eq_fourier_australian_parliament.png"
plt.savefig(fig_path, dpi=300, bbox_inches="tight")
plt.savefig(fig_path.with_suffix(".pdf"), bbox_inches="tight")
print(f"Saved figure to {fig_path}")
plt.close()

print("\n" + "=" * 60)
print("AUSTRALIAN PARLIAMENT ANALYSIS COMPLETE")
print("=" * 60)
