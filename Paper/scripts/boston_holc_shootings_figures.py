"""
boston_holc_shootings_figures.py
--------------------------------

Stage 3 (figures and outputs) for the Boston HOLC x shootings overlay.

Runs end to end from the Stage 1 caches under Paper/data/spatial/boston/
(no network access) and:

  * recomputes and prints the primary-measure RESULTS.md numbers for the
    main 2019-2025 window, so the figures and the analysis share one
    computation path;
  * writes Paper/figures/boston_holc_shootings_map.png (HOLC polygons in the
    standard HOLC colors, primary-measure shootings as semi-transparent
    points);
  * writes Paper/figures/boston_holc_shootings_rates.png (shootings per
    10,000 residents per year by grade with exact Poisson 95% CIs);
  * writes Paper/figures/boston_holc_shootings_map_vertical.png
    (1080 x 1920 video version; all content inside the safe band: 14%-65%
    of the height, 6% from the sides; larger type).

The computation reuses Paper/scripts/boston_holc_shootings_analysis.py
(same loaders, same offense decisions, same denominators). Area math uses
EPSG:26986 (Massachusetts Mainland). No basemap tiles.

Usage: .venv/bin/python3 Paper/scripts/boston_holc_shootings_figures.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.patches import Patch
from scipy import stats as sstats

sys.path.insert(0, str(Path(__file__).resolve().parent))
import boston_holc_shootings_analysis as ana  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[2]
FIG_DIR = REPO_ROOT / "Paper" / "figures"

HOLC_COLORS = {
    "A": "#76a865",
    "B": "#7cb9e8",
    "C": "#ffff99",
    "D": "#d9534f",
    "ungraded": "#bdbdbd",
}
HOLC_LEGEND_LABELS = {
    "A": "A — Best",
    "B": "B — Still desirable",
    "C": "C — Definitely declining",
    "D": "D — Hazardous",
    "ungraded": "Ungraded (Commercial/Industrial)",
}

YEARS = ana.MAIN_YEARS  # 2019-2025
YEAR_LBL = f"{min(YEARS)}\u2013{max(YEARS)}"


def exact_rate_ci(count: int, exposure: float, alpha: float = 0.05):
    """Exact Poisson CI for a rate: chi-square inversion on the count."""
    if exposure <= 0:
        return (np.nan, np.nan)
    lo = 0.5 * sstats.chi2.ppf(alpha / 2, 2 * count) / exposure if count > 0 else 0.0
    hi = 0.5 * sstats.chi2.ppf(1 - alpha / 2, 2 * (count + 1)) / exposure
    return (lo, hi)


def compute() -> dict:
    """Reproduce the main-window numbers from the cached data and print them."""
    ana.HOLC = ana.load_holc()
    pts = ana.load_shootings()
    tracts = ana.load_tracts()
    denom = ana.population_by_grade(tracts, ana.HOLC)

    prim = pts[pts["primary"]]
    main_pts = prim[prim["year"].isin(YEARS)].copy()
    table = ana.grade_table(prim, YEARS, denom)
    rr = ana.rate_ratio_table(table, YEARS)

    ny = len(YEARS)
    ci_rows = []
    for _, r in table.iterrows():
        if r["grade"] == "citywide (Boston)":
            continue
        lo, hi = exact_rate_ci(int(r["shootings"]), r["population"] * ny)
        ci_rows.append({"grade": r["grade"], "rate": r["per_10k_per_year"],
                        "ci_lo": round(lo * 1e4, 3), "ci_hi": round(hi * 1e4, 3)})
    rate_ci = pd.DataFrame(ci_rows)

    print(f"[reproduce] primary measure, {YEAR_LBL}: "
          f"{len(main_pts):,} geocoded shooting-victimization incidents plotted")
    print(table.to_string(index=False))
    print(rr.to_string(index=False))
    print(rate_ci.to_string(index=False))

    # Regression gate: the printed numbers must match RESULTS.md.
    expected = {
        ("C", "shootings"): 698, ("D", "shootings"): 391,
        ("A", "shootings"): 5, ("B", "shootings"): 6,
        ("citywide (Boston)", "shootings"): 1197,
    }
    for (grade, col), want in expected.items():
        got = int(table.loc[table["grade"] == grade, col].iloc[0])
        assert got == want, f"{grade} {col}: got {got}, RESULTS.md says {want}"
    d_rr = rr.loc[rr["grade"] == "D"].iloc[0]
    assert (d_rr["rate_ratio_vs_AB"], d_rr["ci95_lo"], d_rr["ci95_hi"]) == (7.36, 4.07, 14.86)
    print("[check] recomputed counts and the D-grade rate ratio match RESULTS.md")

    return {"holc": ana.HOLC, "tracts": tracts, "pts": main_pts,
            "table": table, "rr": rr, "rate_ci": rate_ci, "denom": denom}


# ---------------------------------------------------------------------------
# Map drawing
# ---------------------------------------------------------------------------

def draw_map(ax, res: dict, legend_fs: float, point_size: float):
    tracts = res["tracts"]
    holc = res["holc"]
    pts = res["pts"]

    bos = tracts[tracts["is_boston"]]
    bos.plot(ax=ax, facecolor="#f2f2f2", edgecolor="#cccccc", linewidth=0.3, zorder=1)
    for grade in ["A", "B", "C", "D", "ungraded"]:
        g = holc[holc["grade"] == grade]
        if len(g):
            g.plot(ax=ax, facecolor=HOLC_COLORS[grade], edgecolor="#333333",
                   linewidth=0.6, alpha=0.85 if grade in ("A", "B") else 0.75, zorder=2)
    ax.scatter(pts.geometry.x, pts.geometry.y, s=point_size, c="black",
               alpha=0.35, linewidths=0, zorder=3)

    # Display extent: the HOLC polygons and the shooting points, padded.
    # The Boston tract set includes harbor water carried in the special
    # tracts; framing on it would squeeze the land mass into a corner.
    hx0, hy0, hx1, hy1 = holc.total_bounds
    px0, py0, px1, py1 = pts.total_bounds
    x0, x1 = min(hx0, px0), max(hx1, px1)
    y0, y1 = min(hy0, py0), max(hy1, py1)
    pad_x, pad_y = (x1 - x0) * 0.06, (y1 - y0) * 0.06
    ax.set_xlim(x0 - pad_x, x1 + pad_x)
    ax.set_ylim(y0 - pad_y, y1 + pad_y)

    handles = [Patch(facecolor=HOLC_COLORS[g], edgecolor="#333333",
                     label=HOLC_LEGEND_LABELS[g]) for g in ["A", "B", "C", "D"]]
    handles.append(Patch(facecolor=HOLC_COLORS["ungraded"], edgecolor="#333333",
                         label=HOLC_LEGEND_LABELS["ungraded"]))
    handles.append(Patch(facecolor="#f2f2f2", edgecolor="#cccccc",
                         label="Outside the 1938 survey area"))
    handles.append(Line2D([0], [0], marker="o", color="none", markerfacecolor="black",
                          alpha=0.5, markersize=legend_fs * 0.45,
                          label=f"Shooting victimization ({YEAR_LBL})"))
    ax.legend(handles=handles, loc="lower left", fontsize=legend_fs,
              framealpha=0.92, edgecolor="#999999")
    ax.set_axis_off()
    ax.set_aspect("equal")
    ax.margins(0.02)


def write_map(res: dict) -> Path:
    fig, ax = plt.subplots(figsize=(11, 9))
    draw_map(ax, res, legend_fs=10, point_size=8)
    n = len(res["pts"])
    ax.set_title(
        f"Boston: 1938 HOLC grades and shooting victimizations, {YEAR_LBL}\n"
        f"{n:,} incidents plotted (primary measure; sources: Mapping Inequality, "
        f"Analyze Boston, ACS 2024 5-year)",
        fontsize=13)
    out = FIG_DIR / "boston_holc_shootings_map.png"
    fig.savefig(out, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"[figure] wrote {out}")
    return out


def write_map_vertical(res: dict) -> Path:
    # 1080 x 1920 exactly; content inside the safe band: 14%-65% of the
    # height and 6% from the sides. Figure fraction y: band is [0.35, 0.86].
    fig = plt.figure(figsize=(10.8, 19.2), dpi=100, facecolor="white")
    ax = fig.add_axes([0.06, 0.36, 0.88, 0.43])  # left, bottom, width, height
    draw_map(ax, res, legend_fs=19, point_size=14)
    n = len(res["pts"])
    fig.text(0.5, 0.845, "Boston: the 1938 redlining map\nand today's shootings",
             ha="center", va="top", fontsize=30, fontweight="bold")
    fig.text(0.5, 0.795,
             f"Shooting victimizations, {YEAR_LBL} — {n:,} incidents",
             ha="center", va="top", fontsize=21)
    out = FIG_DIR / "boston_holc_shootings_map_vertical.png"
    fig.savefig(out, dpi=100, facecolor="white")
    plt.close(fig)
    print(f"[figure] wrote {out} (1080x1920)")
    return out


# ---------------------------------------------------------------------------
# Rates bar chart
# ---------------------------------------------------------------------------

def write_rates(res: dict) -> Path:
    table = res["table"]
    rate_ci = res["rate_ci"].set_index("grade")
    city = table[table["grade"] == "citywide (Boston)"].iloc[0]

    grades = ["A", "B", "C", "D", "ungraded", "unmapped"]
    labels = ["A", "B", "C", "D", "Ungraded\n(Comm./Ind.)", "Outside 1938\nsurvey area"]
    colors = [HOLC_COLORS.get(g, "#e0e0e0") for g in grades]
    rows = table.set_index("grade")

    vals, err_lo, err_hi, counts = [], [], [], []
    for g in grades:
        v = rows.loc[g, "per_10k_per_year"]
        ci = rate_ci.loc[g]
        vals.append(v)
        err_lo.append(v - ci["ci_lo"])
        err_hi.append(ci["ci_hi"] - v)
        counts.append(int(rows.loc[g, "shootings"]))

    fig, ax = plt.subplots(figsize=(10, 6.5))
    x = np.arange(len(grades))
    bars = ax.bar(x, vals, color=colors, edgecolor="#333333", linewidth=0.8,
                  yerr=[err_lo, err_hi], capsize=5,
                  error_kw={"ecolor": "#222222", "linewidth": 1.4})
    for xi, v, ehi, n in zip(x, vals, err_hi, counts):
        ax.text(xi, v + ehi + 0.12, f"{v:.2f}\n(n={n:,})", ha="center", va="bottom",
                fontsize=9)
    ax.axhline(city["per_10k_per_year"], color="#555555", linestyle="--",
               linewidth=1.2)
    ax.text(len(grades) - 0.45, city["per_10k_per_year"] + 0.08,
            f"citywide {city['per_10k_per_year']:.2f}", ha="right", fontsize=9,
            color="#555555")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=10)
    ax.set_ylabel("Shooting victimizations per 10,000 residents per year")
    ax.set_xlabel("1938 HOLC grade")
    ax.set_ylim(0, max(v + e for v, e in zip(vals, err_hi)) + 0.9)
    ax.set_title(
        f"Boston shooting-victimization rate by 1938 HOLC grade, {YEAR_LBL}\n"
        "Primary measure; exact Poisson 95% confidence intervals; "
        "population areal-weighted from ACS 2024 5-year tracts",
        fontsize=12)
    ax.spines[["top", "right"]].set_visible(False)
    out = FIG_DIR / "boston_holc_shootings_rates.png"
    fig.savefig(out, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"[figure] wrote {out}")
    return out


def main() -> int:
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    res = compute()
    write_map(res)
    write_rates(res)
    write_map_vertical(res)
    return 0


if __name__ == "__main__":
    sys.exit(main())
