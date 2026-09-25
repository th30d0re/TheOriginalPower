#!/usr/bin/env python3
"""Stage 2 analysis: New England firearm homicide, gun-law strength, and poverty.

Reads only Stage 1 files in this directory (states.csv). Produces:
  - New England table (stdout)
  - all-states correlations: Pearson (Fisher z 95% CI) and Spearman
    (bootstrap 95% CI), for 2024, the 2020-2024 pooled average, and the
    primary measure (pooled where it exists, 2024 otherwise)
  - OLS regressions of firearm homicide on gun-law rank, without and with
    controls (poverty, Gini; percent urban is not in the Stage 1 files and is
    reported as a gap)
  - scatter plots and a 1080x1920 card in Paper/figures/

All CDC rates here are CRUDE rates per 100,000 (see DATA_LOG.md), not
age-adjusted.
"""

import pathlib

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy import stats

HERE = pathlib.Path(__file__).resolve().parent
FIGDIR = HERE.parents[1] / "figures"
FIGDIR.mkdir(parents=True, exist_ok=True)

NEW_ENGLAND = ["Massachusetts", "Connecticut", "Rhode Island",
               "New Hampshire", "Vermont", "Maine"]

NAVY = "#0f1b33"
CREAM = "#f4ead2"
GOLD = "#d9a441"
TEAL = "#6ec3c0"
RED = "#e2573f"

BOOTSTRAP_N = 10_000
RNG = np.random.default_rng(42)


def pearson_with_ci(x, y):
    """Pearson r with Fisher-z 95% CI."""
    r, p = stats.pearsonr(x, y)
    n = len(x)
    z = np.arctanh(r)
    se = 1.0 / np.sqrt(n - 3)
    lo, hi = z - 1.96 * se, z + 1.96 * se
    return r, np.tanh(lo), np.tanh(hi), n, p


def spearman_with_ci(x, y):
    """Spearman rho with percentile-bootstrap 95% CI."""
    rho, p = stats.spearmanr(x, y)
    n = len(x)
    boots = []
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    for _ in range(BOOTSTRAP_N):
        idx = RNG.integers(0, n, n)
        if len(np.unique(x[idx])) < 2 or len(np.unique(y[idx])) < 2:
            continue
        boots.append(stats.spearmanr(x[idx], y[idx]).statistic)
    lo, hi = np.percentile(boots, [2.5, 97.5])
    return rho, lo, hi, n, p


def corr_block(df, xcol, ycol, label, out):
    d = df[[xcol, ycol]].dropna()
    r, rlo, rhi, n, rp = pearson_with_ci(d[xcol], d[ycol])
    rho, slo, shi, _, sp = spearman_with_ci(d[xcol], d[ycol])
    out.append(
        f"{label}\n"
        f"  Pearson  r = {r:+.3f}  95% CI [{rlo:+.3f}, {rhi:+.3f}]  n = {n}  p = {rp:.4g}\n"
        f"  Spearman rho = {rho:+.3f}  95% CI [{slo:+.3f}, {shi:+.3f}]  n = {n}  p = {sp:.4g}"
    )
    return dict(label=label, pearson=r, plo=rlo, phi=rhi, n=n, p=rp,
                spearman=rho, slo=slo, shi=shi, sp=sp)


def ols_block(df, ycol, xcols, label, out):
    d = df[[ycol] + xcols].dropna()
    X = sm.add_constant(d[xcols])
    m = sm.OLS(d[ycol], X).fit()
    out.append(f"{label}  (n = {len(d)}, R^2 = {m.rsquared:.3f})")
    for term in xcols:
        out.append(
            f"  {term}: coef = {m.params[term]:+.4f}  "
            f"SE = {m.bse[term]:.4f}  p = {m.pvalues[term]:.4g}"
        )
    return m


def scatter(df, xcol, xlabel, outpath, title):
    d = df[["state", xcol, "hom_primary"]].dropna()
    ne = d["state"].isin(NEW_ENGLAND)
    label_offsets = {
        "Massachusetts": (8, -16),
        "Connecticut": (8, 6),
        "Rhode Island": (10, 2),
        "New Hampshire": (8, 6),
        "Vermont": (-14, 8),
        "Maine": (-4, -18),
    }
    fig, ax = plt.subplots(figsize=(10, 7))
    fig.patch.set_facecolor(CREAM)
    ax.set_facecolor(CREAM)
    ax.scatter(d.loc[~ne, xcol], d.loc[~ne, "hom_primary"],
               s=42, color=NAVY, alpha=0.65, label="Other states + DC",
               edgecolors="none")
    ax.scatter(d.loc[ne, xcol], d.loc[ne, "hom_primary"],
               s=90, color=RED, edgecolors=NAVY, linewidths=0.8,
               label="New England", zorder=3)
    slope, intercept, *_ = stats.linregress(d[xcol], d["hom_primary"])
    xs = np.linspace(d[xcol].min(), d[xcol].max(), 100)
    ax.plot(xs, intercept + slope * xs, color=TEAL, lw=2,
            label=f"OLS fit (slope {slope:+.3f})")
    for _, row in d.loc[ne].iterrows():
        ax.annotate(row["state"], (row[xcol], row["hom_primary"]),
                    textcoords="offset points",
                    xytext=label_offsets.get(row["state"], (7, 6)),
                    fontsize=9, color=NAVY)
    ax.set_xlabel(xlabel, color=NAVY)
    ax.set_ylabel("Firearm homicide rate per 100,000 (crude;\n"
                  "2020-2024 pooled where available, else 2024)", color=NAVY)
    ax.set_title(title, color=NAVY)
    for spine in ax.spines.values():
        spine.set_color(NAVY)
    ax.tick_params(colors=NAVY)
    leg = ax.legend(facecolor=CREAM, edgecolor=NAVY, labelcolor=NAVY)
    fig.tight_layout()
    fig.savefig(outpath, dpi=200, facecolor=CREAM)
    plt.close(fig)


def main():
    df = pd.read_csv(HERE / "states.csv")
    df["hom_primary"] = df["fa_homicide_rate_2020_2024_pooled"].fillna(
        df["fa_homicide_rate_2024"])
    df["hom_primary_source"] = np.where(
        df["fa_homicide_rate_2020_2024_pooled"].notna(),
        "pooled 2020-2024", "2024 only")

    out = []
    out.append("=" * 78)
    out.append("STAGE 2 ANALYSIS - New England firearm homicide, gun-law strength, poverty")
    out.append("All CDC rates are CRUDE per 100,000 (not age-adjusted; see DATA_LOG.md).")
    out.append("Gun-law ranks: 1 = strongest laws (Giffords and Everytown). A negative")
    out.append("correlation with homicide means stronger laws associate with less homicide.")
    out.append("=" * 78)

    # ---------------------------------------------------------------- 1. NE table
    out.append("\n## 1. NEW ENGLAND TABLE (sorted by firearm homicide rate)\n")
    ne = df[df["state"].isin(NEW_ENGLAND)].copy()
    ne = ne.sort_values("hom_primary")
    header = (f"{'State':<15}{'FA hom (src)':<22}{'FA hom 2024':<12}"
              f"{'FA deaths 2024':<15}{'FA deaths pooled':<17}"
              f"{'Giffords':<12}{'Everytown':<10}{'Poverty 2024':<13}{'Poverty 5yr'}")
    out.append(header)
    for _, r in ne.iterrows():
        out.append(
            f"{r['state']:<15}"
            f"{r['hom_primary']:>5.2f} ({r['hom_primary_source']}){'':<2}"
            f"{r['fa_homicide_rate_2024']:>9.1f}  "
            f"{r['fa_deaths_rate_2024']:>12.1f}  "
            f"{r['fa_deaths_rate_2020_2024_pooled']:>14.2f}  "
            f"{str(r['giffords_grade']) + '/#' + str(int(r['giffords_law_strength_rank'])):<12}"
            f"#{int(r['everytown_law_rank']):<9}"
            f"{r['poverty_rate_saipe_2024']:>10.1f}%  "
            f"{r['poverty_rate_saipe_2020_2024_mean']:>9.2f}%"
        )
    out.append("\nNote: total firearm death rates are dominated by suicide in the")
    out.append("low-homicide states; homicide and total-death rates rank the six states")
    out.append("differently. Maine has the second-lowest homicide rate and the highest")
    out.append("total firearm death rate in New England; Massachusetts has the lowest")
    out.append("total rate and a middle homicide rate.")

    # ------------------------------------------------------- 2. correlations
    corr_results = {}
    specs = [
        ("2024", "fa_homicide_rate_2024", "poverty_rate_saipe_2024"),
        ("pooled 2020-2024", "fa_homicide_rate_2020_2024_pooled",
         "poverty_rate_saipe_2020_2024_mean"),
        ("primary (pooled else 2024)", "hom_primary",
         "poverty_rate_saipe_2020_2024_mean"),
    ]
    out.append("\n## 2. ALL-STATES CORRELATIONS (50 states + DC where available)\n")
    for spec_name, homcol, povcol in specs:
        out.append(f"--- Homicide measure: {spec_name} ---")
        corr_results[spec_name] = {}
        corr_results[spec_name]["giffords"] = corr_block(
            df, "giffords_law_strength_rank", homcol,
            "Giffords law-strength rank vs firearm homicide", out)
        corr_results[spec_name]["everytown"] = corr_block(
            df, "everytown_law_rank", homcol,
            "Everytown gun-law rank vs firearm homicide", out)
        corr_results[spec_name]["poverty"] = corr_block(
            df, povcol, homcol, "SAIPE poverty rate vs firearm homicide", out)
        n_pool = df[homcol].notna().sum()
        out.append(f"(states with a {spec_name} homicide rate: {n_pool})\n")

    # ------------------------------------------------------- 3. regressions
    out.append("\n## 3. OLS: FIREARM HOMICIDE ON LAW RANK, WITHOUT AND WITH CONTROLS")
    out.append("Controls available in Stage 1 files: SAIPE poverty rate, ACS Gini index.")
    out.append("Percent urban: NOT in Stage 1 files - reported as a gap.\n")
    reg_results = {}
    for spec_name, homcol, povcol in specs:
        for rank_name, rankcol in [("Giffords", "giffords_law_strength_rank"),
                                   ("Everytown", "everytown_law_rank")]:
            m1 = ols_block(df, homcol, [rankcol],
                           f"[{spec_name}] {homcol} ~ {rankcol}", out)
            m2 = ols_block(df, homcol, [rankcol, povcol, "gini_acs2024_5yr"],
                           f"[{spec_name}] {homcol} ~ {rankcol} + poverty + Gini", out)
            reg_results[(spec_name, rank_name)] = (
                m1.params[rankcol], m1.pvalues[rankcol],
                m2.params[rankcol], m2.pvalues[rankcol])
            out.append(
                f"  -> {rank_name} coefficient {m1.params[rankcol]:+.4f} alone vs "
                f"{m2.params[rankcol]:+.4f} with controls\n")

    # ------------------------------------------------------- 4. figures
    scatter(df, "giffords_law_strength_rank",
            "Giffords gun-law strength rank (1 = strongest)",
            FIGDIR / "gunlaws_ne_scatter_giffords.png",
            "Gun-law strength vs firearm homicide (Giffords rank)")
    scatter(df, "everytown_law_rank",
            "Everytown gun-law rank (1 = strongest)",
            FIGDIR / "gunlaws_ne_scatter_everytown.png",
            "Gun-law strength vs firearm homicide (Everytown rank)")
    scatter(df, "poverty_rate_saipe_2020_2024_mean",
            "Poverty rate, SAIPE 2020-2024 mean (%)",
            FIGDIR / "gunlaws_ne_scatter_poverty.png",
            "Poverty vs firearm homicide")
    out.append("Scatter plots written to:")
    for f in ["gunlaws_ne_scatter_giffords.png", "gunlaws_ne_scatter_everytown.png",
              "gunlaws_ne_scatter_poverty.png"]:
        out.append(f"  Paper/figures/{f}")

    # ------------------------------------------------------- card (1080x1920)
    g = corr_results["primary (pooled else 2024)"]["giffords"]
    p = corr_results["primary (pooled else 2024)"]["poverty"]
    _, _, g_coef_ctrl, g_p_ctrl = reg_results[("primary (pooled else 2024)",
                                               "Giffords")]
    fig = plt.figure(figsize=(10.8, 19.2), dpi=100)
    fig.patch.set_facecolor(NAVY)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_facecolor(NAVY)
    ax.axis("off")
    ax.text(0.06, 0.95, "New England: gun laws,\nhomicide, and poverty",
            color=CREAM, fontsize=28, fontweight="bold", va="top")
    ax.text(0.06, 0.885, "Firearm homicide rate per 100,000 (crude; 2020-2024 pooled\n"
                         "where available, else 2024). Total firearm deaths are mostly suicide.",
            color=TEAL, fontsize=14, va="top")
    cols = ["State", "FA hom", "FA deaths", "Giffords", "Poverty"]
    rows = []
    for _, r in ne.iterrows():
        rows.append([r["state"],
                     f"{r['hom_primary']:.2f}",
                     f"{r['fa_deaths_rate_2020_2024_pooled']:.1f}",
                     f"{r['giffords_grade']} (#{int(r['giffords_law_strength_rank'])})",
                     f"{r['poverty_rate_saipe_2024']:.1f}%"])
    table = ax.table(cellText=rows, colLabels=cols,
                     bbox=[0.06, 0.52, 0.88, 0.30], cellLoc="center")
    table.auto_set_font_size(False)
    table.set_fontsize(14)
    for (r_i, c_i), cell in table.get_celld().items():
        cell.set_edgecolor(GOLD)
        if r_i == 0:
            cell.set_facecolor(GOLD)
            cell.set_text_props(color=NAVY, fontweight="bold")
        else:
            cell.set_facecolor(CREAM if r_i % 2 else "#ece0c6")
            cell.set_text_props(color=NAVY)
    ax.text(0.06, 0.44, "All 50 states + DC, correlation with firearm homicide:",
            color=CREAM, fontsize=17, va="top")
    ax.text(0.06, 0.405,
            f"Gun-law rank (Giffords):  r = {g['pearson']:+.2f} "
            f"[{g['plo']:+.2f}, {g['phi']:+.2f}]  (n = {g['n']})",
            color=TEAL, fontsize=15, va="top")
    ax.text(0.06, 0.378,
            f"Poverty rate (SAIPE):        r = {p['pearson']:+.2f} "
            f"[{p['plo']:+.2f}, {p['phi']:+.2f}]  (n = {p['n']})",
            color=TEAL, fontsize=15, va="top")
    ax.text(0.06, 0.338,
            "Rank 1 = strictest laws, so a positive r means weaker laws track\n"
            "more homicide. With poverty and inequality (Gini) controlled, the\n"
            f"law-rank coefficient falls to about zero ({g_coef_ctrl:+.3f}, "
            f"p = {g_p_ctrl:.2f}).",
            color=GOLD, fontsize=13, va="top")
    ax.text(0.08, 0.10,
            "Sources: CDC NCIPC (fpsi-y8tj), Giffords Law Center scorecard,\n"
            "Everytown rankings, Census SAIPE. Rates are crude, not age-adjusted.\n"
            "Accessed 2026-09-24.",
            color="#9aa7bd", fontsize=12, va="top")
    fig.savefig(FIGDIR / "gunlaws_ne_card.png", dpi=100, facecolor=NAVY)
    plt.close(fig)
    out.append("  Paper/figures/gunlaws_ne_card.png (1080x1920)")

    print("\n".join(out))


if __name__ == "__main__":
    main()
