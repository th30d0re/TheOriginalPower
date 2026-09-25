"""Portrait poverty vs firearm homicide scatter for the video card (navy background).

Reads Paper/data/gun_laws_new_england/states.csv (50 states + DC), the same file the
analysis uses. New England states are labelled. Writes a PNG sized for a full-width
video background.
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "gun_laws_new_england" / "states.csv"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "figures" / "gunlaws_ne_card_portrait.png"
NAVY, CREAM, GOLD, MUTE = "#0f1b33", "#f3e9d2", "#d9a441", "#9fb0cf"
NE = {"Massachusetts": "MA", "Connecticut": "CT", "Rhode Island": "RI", "New Hampshire": "NH", "Vermont": "VT", "Maine": "ME"}
OFFSETS = {"MA": (8, -16), "CT": (10, 8), "RI": (10, -4), "NH": (8, 8), "VT": (-42, 10), "ME": (-42, -18)}

df = pd.read_csv(CSV, dtype={"state_fips": str})
x = df["poverty_rate_saipe_2020_2024_mean"].astype(float)
y = df["fa_homicide_rate_2020_2024_pooled"].astype(float).fillna(df["fa_homicide_rate_2024"].astype(float))
df["y_plot"] = y
ok = x.notna() & y.notna()
slope, icpt = np.polyfit(x[ok], y[ok], 1)
r = float(np.corrcoef(x[ok], y[ok])[0, 1])

fig, ax = plt.subplots(figsize=(7.2, 8.6), dpi=150, facecolor=NAVY)
ax.set_facecolor(NAVY)
ne = df["state"].isin(NE) & ok
ax.scatter(x[ok & ~ne], y[ok & ~ne], s=70, color=MUTE, alpha=0.85, label="Other states + DC")
ax.scatter(x[ne], y[ne], s=150, color="#e4572e", edgecolor=CREAM, linewidth=1.4, label="New England", zorder=3)
xs = np.linspace(x[ok].min(), x[ok].max(), 50)
ax.plot(xs, slope * xs + icpt, color="#6fc7b5", linewidth=3, label=f"Trend, r = +{r:.2f}")
for _, row in df[ne].iterrows():
    dx, dy = OFFSETS[NE[row["state"]]]
    ax.annotate(NE[row["state"]], (row["poverty_rate_saipe_2020_2024_mean"], row["y_plot"]),
                textcoords="offset points", xytext=(dx, dy), color=CREAM, fontsize=15, fontweight="bold")
ax.set_xlabel("Poverty rate, 2020–2024 mean (%)", color=CREAM, fontsize=17, labelpad=8)
ax.set_ylabel("Firearm homicide per 100,000 (crude)", color=CREAM, fontsize=17, labelpad=8)
ax.tick_params(colors=CREAM, labelsize=15)
for s in ax.spines.values():
    s.set_color(MUTE)
ax.grid(color=MUTE, alpha=0.18)
leg = ax.legend(loc="upper left", fontsize=15, facecolor=NAVY, edgecolor=MUTE, labelcolor=CREAM)
fig.tight_layout()
fig.savefig(OUT, dpi=150, facecolor=NAVY)
print(OUT, f"n={int(ok.sum())} r={r:.3f}")
