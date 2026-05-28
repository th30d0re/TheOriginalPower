#!/usr/bin/env python3
"""
eq_scotus_electromagnetic_conversion.py

Convert the acoustic SCOTUS per-axis spectral results into the electromagnetic
carrier formalism. Treats each identity axis as a driven resonant mode B_k with
natural frequency f_k, driven by the 4-year electoral carrier f_c = 0.25 cyc/yr.
"""

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPECTRAL_JSON = ROOT / "data" / "scotus_spectral_results.json"
FIG_DIR = ROOT / "figures"
FIG_DIR.mkdir(exist_ok=True)

with open(SPECTRAL_JSON) as fh:
    scotus_data = json.load(fh)

periods = scotus_data["analysis_2_lomb_scargle"]["per_axis_dominant_periods"]
valid_axes = {k: v for k, v in periods.items() 
              if not scotus_data["analysis_2_lomb_scargle"]["per_axis_boundary_artifact"][k]}

T_c = 4.0
f_c = 1.0 / T_c
omega_c = 2 * np.pi * f_c

results = []
for axis, T_k in valid_axes.items():
    f_k = 1.0 / T_k
    omega_k = 2 * np.pi * f_k
    f_beat = abs(f_k - f_c)
    T_beat = 1.0 / f_beat if f_beat > 0 else np.inf
    Z_mag = abs(f_c - f_k) / f_k
    phase_distance = (omega_k - omega_c) / omega_c
    gamma = 0.4
    Q = omega_k / (2 * gamma)
    bandwidth = f_k / Q if Q > 0 else np.inf
    results.append({
        "axis": axis,
        "T_natural_yr": T_k,
        "f_natural_cyc_yr": f_k,
        "f_beat_cyc_yr": f_beat,
        "T_beat_yr": T_beat,
        "Z_normalized": Z_mag,
        "phase_distance_relative": phase_distance,
        "Q_factor": Q,
        "bandwidth_cyc_yr": bandwidth,
    })

df = pd.DataFrame(results)
out_csv = ROOT / "data" / "eq_scotus_electromagnetic_conversion.csv"
df.to_csv(out_csv, index=False)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes_colors = {"race": "#d62728", "gender": "#9467bd", "religion": "#8c564b"}

ax = axes[0, 0]
for _, row in df.iterrows():
    color = axes_colors.get(row["axis"], "gray")
    ax.barh(row["axis"], row["f_natural_cyc_yr"], color=color, alpha=0.7)
ax.axvline(f_c, color="cyan", linestyle="--", linewidth=2, label=f"Carrier ({T_c}-yr)")
ax.set_xlabel("Natural frequency (cyc/yr)")
ax.set_title("A. Per-Axis Natural Frequencies vs 4-Yr Carrier")
ax.legend(loc="lower right")
ax.grid(True, alpha=0.3, axis="x")

ax = axes[0, 1]
beat_periods = df["T_beat_yr"].values
beat_labels = df["axis"].values
colors = [axes_colors.get(a, "gray") for a in beat_labels]
bars = ax.bar(beat_labels, beat_periods, color=colors, alpha=0.7)
ax.set_ylabel("Beat period (years)")
ax.set_title("B. Amplitude Envelope Modulation (Beating)")
ax.grid(True, alpha=0.3, axis="y")
for bar, val in zip(bars, beat_periods):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f"{val:.1f} yr",
            ha="center", va="bottom", fontsize=10)

ax = axes[1, 0]
Z_vals = df["Z_normalized"].values
bars = ax.bar(beat_labels, Z_vals, color=colors, alpha=0.7)
ax.set_ylabel("Normalized impedance |Z_k|")
ax.set_title("C. Axis Impedance (Drive Difficulty)")
ax.grid(True, alpha=0.3, axis="y")
for bar, val in zip(bars, Z_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01, f"{val:.3f}",
            ha="center", va="bottom", fontsize=10)

ax = axes[1, 1]
Q_vals = df["Q_factor"].values
bw_vals = df["bandwidth_cyc_yr"].values
x = np.arange(len(beat_labels))
width = 0.35
ax.bar(x - width/2, Q_vals, width, label="Q factor", color=colors, alpha=0.7)
ax2 = ax.twinx()
ax2.bar(x + width/2, bw_vals, width, label="Bandwidth", color=colors, alpha=0.4, hatch="//")
ax.set_ylabel("Q factor", color="black")
ax2.set_ylabel("Bandwidth (cyc/yr)", color="gray")
ax.set_xticks(x)
ax.set_xticklabels(beat_labels)
ax.set_title("D. Resonance Quality Factor & Bandwidth")
ax.grid(True, alpha=0.3, axis="y")

plt.tight_layout()
fig_path = FIG_DIR / "eq_scotus_electromagnetic_conversion.png"
plt.savefig(fig_path, dpi=300, bbox_inches="tight")
plt.savefig(fig_path.with_suffix(".pdf"), bbox_inches="tight")
print(f"Saved figure to {fig_path}")
plt.close()

print("\nELECTROMAGNETIC CONVERSION COMPLETE")
for _, row in df.iterrows():
    print(f"{row['axis']}: T_nat={row['T_natural_yr']:.2f}yr, T_beat={row['T_beat_yr']:.1f}yr, Z={row['Z_normalized']:.3f}")
