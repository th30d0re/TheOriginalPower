"""Generate Great Recession wealth comparison charts for Chapter 10.

Inputs:
  - Federal Reserve Distributional Financial Accounts CSV zip
  - Pew Research Center reported middle-income racial wealth figures

Outputs:
  - Curated CSVs in Paper/data/
  - PNG figures in Paper/figures/
"""

from __future__ import annotations

import io
import os
import zipfile
from pathlib import Path
from urllib.request import urlopen

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib-redefining-racism")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
FIG_DIR = ROOT / "figures"
DFA_URL = "https://www.federalreserve.gov/releases/z1/dataviz/download/zips/dfa.zip"
LOCAL_DFA_ZIP = Path("/tmp/dfa.zip")


matplotlib.rcParams.update(
    {
        "font.family": "serif",
        "font.size": 9,
        "axes.titlesize": 10,
        "axes.labelsize": 9,
        "xtick.labelsize": 8,
        "ytick.labelsize": 8,
        "legend.fontsize": 8,
        "figure.dpi": 170,
    }
)


def load_dfa_csv(name: str) -> pd.DataFrame:
    if LOCAL_DFA_ZIP.exists():
        payload = LOCAL_DFA_ZIP.read_bytes()
    else:
        with urlopen(DFA_URL, timeout=60) as response:
            payload = response.read()

    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        with zf.open(name) as fh:
            return pd.read_csv(fh)


def quarter_to_year(date: str) -> float:
    year, quarter = date.split(":Q")
    return int(year) + (int(quarter) - 1) / 4


def finish(fig: plt.Figure, filename: str) -> None:
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    fig.savefig(FIG_DIR / filename, bbox_inches="tight")
    plt.close(fig)


def save_csv(df: pd.DataFrame, filename: str) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATA_DIR / filename, index=False)


def money_label(value: float) -> str:
    if value >= 1_000_000:
        return f"${value / 1_000_000:.1f}M"
    return f"${value / 1_000:.0f}k"


def chart_hierarchy_wealth_brackets() -> None:
    levels = load_dfa_csv("dfa-networth-levels-detail.csv")
    latest_date = levels["Date"].iloc[-1]
    df = levels[levels["Date"].eq(latest_date)].set_index("Category")

    rows = [
        {
            "hierarchy_bracket": "Out-group extraction floor",
            "percentile_proxy": "Bottom 50%",
            "dfa_categories": "Bottom50",
            "net_worth_millions": df.loc["Bottom50", "Net worth"],
            "household_count": df.loc["Bottom50", "Household count"],
        },
        {
            "hierarchy_bracket": "Buffer Class",
            "percentile_proxy": "50th-90th",
            "dfa_categories": "Next40",
            "net_worth_millions": df.loc["Next40", "Net worth"],
            "household_count": df.loc["Next40", "Household count"],
        },
        {
            "hierarchy_bracket": "Puppet / managerial classes",
            "percentile_proxy": "90th-99.9th",
            "dfa_categories": "Next9 + RemainingTop1",
            "net_worth_millions": df.loc["Next9", "Net worth"] + df.loc["RemainingTop1", "Net worth"],
            "household_count": df.loc["Next9", "Household count"] + df.loc["RemainingTop1", "Household count"],
        },
        {
            "hierarchy_bracket": "True Elite",
            "percentile_proxy": "Top 0.1%",
            "dfa_categories": "TopPt1",
            "net_worth_millions": df.loc["TopPt1", "Net worth"],
            "household_count": df.loc["TopPt1", "Household count"],
        },
    ]
    out = pd.DataFrame(rows)
    out["Date"] = latest_date
    out["average_net_worth"] = out["net_worth_millions"] * 1_000_000 / out["household_count"]
    out["aggregate_share_pct"] = 100 * out["net_worth_millions"] / df["Net worth"].sum()
    out["mapping_note"] = (
        "Percentile groups are wealth-distribution proxies for structural roles; "
        "they are not identity-equivalent categories."
    )
    out = out[
        [
            "Date",
            "hierarchy_bracket",
            "percentile_proxy",
            "dfa_categories",
            "average_net_worth",
            "aggregate_share_pct",
            "household_count",
            "mapping_note",
        ]
    ].round({"average_net_worth": 2, "aggregate_share_pct": 2})
    save_csv(out, "eq10_hierarchy_wealth_brackets.csv")

    labels = [f"{row.hierarchy_bracket}\n({row.percentile_proxy})" for row in out.itertuples()]
    colors = ["#8b1e3f", "#2563eb", "#b45309", "#14532d"]
    x = np.arange(len(out))

    fig, ax = plt.subplots(figsize=(9.5, 5.2))
    bars = ax.bar(x, out["average_net_worth"], color=colors, width=0.66)
    ax.set_yscale("log")
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("Average net worth per household, log scale")
    ax.set_title(f"Wealth disparity by hierarchy-proxy bracket ({latest_date})")
    ax.grid(True, axis="y", color="#e5e7eb", which="both")
    ax.set_ylim(out["average_net_worth"].min() * 0.6, out["average_net_worth"].max() * 1.9)

    for bar, value, share in zip(bars, out["average_net_worth"], out["aggregate_share_pct"]):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            value * 1.18,
            f"{money_label(value)}\n{share:.1f}% share",
            ha="center",
            va="bottom",
            fontsize=8,
        )

    ratio = out.loc[out["hierarchy_bracket"].eq("True Elite"), "average_net_worth"].iloc[0] / out.loc[
        out["hierarchy_bracket"].eq("Out-group extraction floor"), "average_net_worth"
    ].iloc[0]
    ax.text(
        0.02,
        0.95,
        f"Top 0.1% average = {ratio:,.0f}x bottom-half average",
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=8,
        bbox={"boxstyle": "round,pad=0.3", "fc": "white", "ec": "#d1d5db", "lw": 0.8},
    )
    fig.subplots_adjust(bottom=0.22)
    fig.text(
        0.1,
        0.03,
        "Note: Percentiles are structural-role proxies, not identity-equivalent groups.",
        ha="left",
        va="bottom",
        fontsize=7.5,
        color="#4b5563",
    )
    finish(fig, "eq10_hierarchy_wealth_brackets.png")


def chart_hierarchy_wealth_brackets_over_time() -> None:
    levels = load_dfa_csv("dfa-networth-levels-detail.csv")
    levels["year"] = levels["Date"].map(quarter_to_year)
    totals = levels.groupby("Date", as_index=False)["Net worth"].sum().rename(columns={"Net worth": "total_net_worth"})

    specs = [
        ("Out-group extraction floor", "Bottom 50%", ["Bottom50"], "#8b1e3f"),
        ("Buffer Class", "50th-90th", ["Next40"], "#2563eb"),
        ("Puppet / managerial classes", "90th-99.9th", ["Next9", "RemainingTop1"], "#b45309"),
        ("True Elite", "Top 0.1%", ["TopPt1"], "#14532d"),
    ]
    rows = []
    for bracket, percentile, categories, color in specs:
        gdf = (
            levels[levels["Category"].isin(categories)]
            .groupby(["Date", "year"], as_index=False)[["Net worth", "Household count"]]
            .sum()
            .merge(totals, on="Date", how="left")
        )
        gdf["hierarchy_bracket"] = bracket
        gdf["percentile_proxy"] = percentile
        gdf["average_net_worth"] = gdf["Net worth"] * 1_000_000 / gdf["Household count"]
        gdf["aggregate_share_pct"] = 100 * gdf["Net worth"] / gdf["total_net_worth"]
        gdf["plot_color"] = color
        rows.append(gdf)

    out = pd.concat(rows, ignore_index=True)
    out["mapping_note"] = (
        "Percentile groups are wealth-distribution proxies for structural roles; "
        "they are not identity-equivalent categories."
    )
    out = out[
        [
            "Date",
            "year",
            "hierarchy_bracket",
            "percentile_proxy",
            "average_net_worth",
            "aggregate_share_pct",
            "Household count",
            "mapping_note",
        ]
    ].round({"average_net_worth": 2, "aggregate_share_pct": 2})
    save_csv(out, "eq10_hierarchy_wealth_brackets_over_time.csv")

    fig, ax = plt.subplots(figsize=(9.7, 5.4))
    ax.axvspan(2007.75, 2009.5, color="#d0d7de", alpha=0.45, lw=0)
    for bracket, percentile, _categories, color in specs:
        gdf = out[out["hierarchy_bracket"].eq(bracket)].sort_values("year")
        label = f"{bracket} ({percentile})"
        ax.plot(gdf["year"], gdf["average_net_worth"], lw=2.1, color=color, label=label)
        latest = gdf.iloc[-1]
        ax.text(
            latest["year"] + 0.15,
            latest["average_net_worth"],
            money_label(latest["average_net_worth"]),
            fontsize=7.5,
            va="center",
            color=color,
        )

    first_date = out["Date"].iloc[0]
    latest_date = out["Date"].iloc[-1]
    first = out[out["Date"].eq(first_date)].set_index("hierarchy_bracket")
    latest = out[out["Date"].eq(latest_date)].set_index("hierarchy_bracket")
    first_ratio = (
        first.loc["True Elite", "average_net_worth"] / first.loc["Out-group extraction floor", "average_net_worth"]
    )
    latest_ratio = (
        latest.loc["True Elite", "average_net_worth"] / latest.loc["Out-group extraction floor", "average_net_worth"]
    )

    ax.set_yscale("log")
    ax.set_xlim(out["year"].min(), out["year"].max() + 2.2)
    ax.set_ylabel("Average net worth per household, log scale")
    ax.set_title("Wealth disparity by hierarchy-proxy bracket over time")
    ax.grid(True, axis="y", color="#e5e7eb", which="both")
    ax.text(2008.55, ax.get_ylim()[1] / 1.7, "Great\nRecession", ha="center", va="top", fontsize=8, color="#4b5563")
    ax.text(
        0.02,
        0.95,
        f"Top 0.1% / bottom-half average: {first_ratio:,.0f}x ({first_date}) -> {latest_ratio:,.0f}x ({latest_date})",
        transform=ax.transAxes,
        ha="left",
        va="top",
        fontsize=8,
        bbox={"boxstyle": "round,pad=0.3", "fc": "white", "ec": "#d1d5db", "lw": 0.8},
    )
    ax.legend(loc="lower left", frameon=True)
    fig.subplots_adjust(bottom=0.16, right=0.84)
    fig.text(
        0.1,
        0.03,
        "Note: Percentiles are structural-role proxies, not identity-equivalent groups.",
        ha="left",
        va="bottom",
        fontsize=7.5,
        color="#4b5563",
    )
    finish(fig, "eq10_hierarchy_wealth_brackets_over_time.png")


def chart_wealth_shares() -> None:
    shares = load_dfa_csv("dfa-networth-shares.csv")
    shares["year"] = shares["Date"].map(quarter_to_year)
    shares = shares[(shares["year"] >= 2000) & (shares["year"] <= 2025.75)]

    pivot = shares.pivot(index=["Date", "year"], columns="Category", values="Net worth").reset_index()
    pivot["Top1"] = pivot["TopPt1"] + pivot["RemainingTop1"]
    pivot["Top10"] = pivot["Top1"] + pivot["Next9"]
    out = pivot[["Date", "year", "Bottom50", "Next40", "Top1", "Top10"]].copy()
    save_csv(out, "eq10_great_recession_wealth_shares.csv")

    fig, ax = plt.subplots(figsize=(9.2, 5.2))
    ax.axvspan(2007.75, 2009.5, color="#d0d7de", alpha=0.45, lw=0)
    ax.plot(out["year"], out["Top10"], lw=2.2, color="#14532d", label="Top 10%")
    ax.plot(out["year"], out["Next40"], lw=2.0, color="#2563eb", label="50th-90th percentiles")
    ax.plot(out["year"], out["Top1"], lw=2.0, color="#7c2d12", label="Top 1%")
    ax.plot(out["year"], out["Bottom50"], lw=2.4, color="#b91c1c", label="Bottom 50%")

    trough = out.loc[out["Bottom50"].idxmin()]
    ax.scatter([trough["year"]], [trough["Bottom50"]], color="#b91c1c", s=36, zorder=5)
    ax.annotate(
        f"Bottom 50% trough: {trough['Bottom50']:.1f}%",
        xy=(trough["year"], trough["Bottom50"]),
        xytext=(trough["year"] + 1.1, trough["Bottom50"] + 8),
        arrowprops={"arrowstyle": "->", "lw": 0.8, "color": "#555"},
        fontsize=8,
    )

    ax.text(2008.55, 71.5, "Great\nRecession", ha="center", va="top", fontsize=8, color="#4b5563")
    ax.set_title("Wealth-share recompile around the Great Recession")
    ax.set_ylabel("Share of aggregate household net worth (%)")
    ax.set_xlim(2000, 2026)
    ax.set_ylim(0, 75)
    ax.grid(True, axis="y", color="#e5e7eb")
    ax.legend(ncol=2, loc="lower right", frameon=True)
    finish(fig, "eq10_great_recession_wealth_shares.png")


def chart_racial_wealth() -> None:
    # Pew reports 2013 middle-income values and percentage losses from 2007:
    # Black: $33,600, down 47%; Hispanic: $38,900, down 55%; white: $131,900, down 31%.
    # 2016 recovery values are reported directly. All figures are in 2016 dollars.
    rows = [
        {"year": 2007, "group": "White", "median_wealth": 131900 / (1 - 0.31)},
        {"year": 2007, "group": "Black", "median_wealth": 33600 / (1 - 0.47)},
        {"year": 2007, "group": "Hispanic", "median_wealth": 38900 / (1 - 0.55)},
        {"year": 2013, "group": "White", "median_wealth": 131900},
        {"year": 2013, "group": "Black", "median_wealth": 33600},
        {"year": 2013, "group": "Hispanic", "median_wealth": 38900},
        {"year": 2016, "group": "White", "median_wealth": 154400},
        {"year": 2016, "group": "Black", "median_wealth": 38300},
        {"year": 2016, "group": "Hispanic", "median_wealth": 46000},
    ]
    df = pd.DataFrame(rows)
    df["median_wealth"] = df["median_wealth"].round(0).astype(int)
    df["source_note"] = "Pew Research Center 2017, middle-income households, 2016 dollars"
    save_csv(df, "eq10_great_recession_racial_wealth.csv")

    colors = {"White": "#4b5563", "Black": "#111827", "Hispanic": "#b45309"}
    fig, ax = plt.subplots(figsize=(8.8, 5.0))
    for group, gdf in df.groupby("group"):
        gdf = gdf.sort_values("year")
        ax.plot(gdf["year"], gdf["median_wealth"] / 1000, marker="o", lw=2.2, color=colors[group], label=group)
        for _, row in gdf.iterrows():
            ax.text(
                row["year"] + 0.06,
                row["median_wealth"] / 1000,
                f"${row['median_wealth']/1000:.0f}k",
                fontsize=7.5,
                va="center",
                color=colors[group],
            )

    ax.axvspan(2007.75, 2009.5, color="#d0d7de", alpha=0.35, lw=0)
    ax.set_title("Middle-income median wealth by race before and after the crash")
    ax.set_ylabel("Median net worth (thousands of 2016 dollars)")
    ax.set_xticks([2007, 2013, 2016])
    ax.set_xlim(2006.4, 2017.2)
    ax.grid(True, axis="y", color="#e5e7eb")
    ax.legend(loc="upper right", frameon=True)
    ax.text(2008.55, 187, "Recession", ha="center", va="top", fontsize=8, color="#4b5563")
    finish(fig, "eq10_great_recession_racial_wealth.png")


def chart_asset_composition() -> None:
    levels = load_dfa_csv("dfa-networth-levels-detail.csv")
    df = levels[levels["Date"].eq("2007:Q4")].copy()
    categories = ["Bottom50", "Next40", "Next9", "RemainingTop1", "TopPt1"]
    labels = {
        "Bottom50": "Bottom 50%",
        "Next40": "50th-90th",
        "Next9": "90th-99th",
        "RemainingTop1": "99th-99.9th",
        "TopPt1": "Top 0.1%",
    }
    df = df[df["Category"].isin(categories)].set_index("Category").loc[categories].reset_index()
    out = pd.DataFrame(
        {
            "group": df["Category"].map(labels),
            "real_estate_pct_assets": 100 * df["Real estate"] / df["Assets"],
            "equity_business_pct_assets": 100
            * (df["Corporate equities and mutual fund shares"] + df["Miscellaneous other equity"])
            / df["Assets"],
            "pensions_pct_assets": 100 * (df["DB pension entitlements"] + df["DC pension entitlements"]) / df["Assets"],
            "other_assets_pct_assets": 100
            * (
                df["Assets"]
                - df["Real estate"]
                - df["Corporate equities and mutual fund shares"]
                - df["Miscellaneous other equity"]
                - df["DB pension entitlements"]
                - df["DC pension entitlements"]
            )
            / df["Assets"],
            "liabilities_pct_assets": 100 * df["Liabilities"] / df["Assets"],
        }
    )
    out = out.round(2)
    save_csv(out, "eq10_great_recession_asset_composition.csv")

    fig, ax = plt.subplots(figsize=(9.3, 5.2))
    x = np.arange(len(out))
    stacks = [
        ("Real estate", "real_estate_pct_assets", "#f59e0b"),
        ("Equities/business", "equity_business_pct_assets", "#166534"),
        ("Pensions", "pensions_pct_assets", "#2563eb"),
        ("Other assets", "other_assets_pct_assets", "#9ca3af"),
    ]
    bottom = np.zeros(len(out))
    for label, col, color in stacks:
        ax.bar(x, out[col], bottom=bottom, width=0.68, label=label, color=color)
        bottom += out[col].to_numpy()
    ax.plot(x, out["liabilities_pct_assets"], color="#b91c1c", marker="D", lw=1.8, label="Liabilities / assets")
    ax.set_xticks(x)
    ax.set_xticklabels(out["group"], rotation=20, ha="right")
    ax.set_ylabel("Percent of group assets")
    ax.set_title("Portfolio structure at the edge of the crash (2007:Q4)")
    ax.set_ylim(0, 112)
    ax.grid(True, axis="y", color="#e5e7eb")
    ax.legend(ncol=3, loc="upper center", bbox_to_anchor=(0.5, -0.18), frameon=False)
    finish(fig, "eq10_great_recession_asset_composition.png")


def chart_debt_floor() -> None:
    levels = load_dfa_csv("dfa-networth-levels-detail.csv")
    df = levels[(levels["Category"].eq("Bottom50"))].copy()
    df["year"] = df["Date"].map(quarter_to_year)
    df = df[(df["year"] >= 2000) & (df["year"] <= 2025.75)].copy()
    for col in ["Assets", "Liabilities", "Net worth"]:
        df[f"{col.lower().replace(' ', '_')}_per_household"] = df[col] * 1_000_000 / df["Household count"]

    out = df[
        [
            "Date",
            "year",
            "assets_per_household",
            "liabilities_per_household",
            "net_worth_per_household",
            "Household count",
        ]
    ].copy()
    out = out.round(2)
    save_csv(out, "eq10_great_recession_debt_floor.csv")

    fig, ax = plt.subplots(figsize=(9.2, 5.2))
    ax.axvspan(2007.75, 2009.5, color="#d0d7de", alpha=0.45, lw=0)
    ax.axhline(0, color="#111827", lw=0.8)
    ax.plot(out["year"], out["assets_per_household"] / 1000, color="#2563eb", lw=2.0, label="Assets")
    ax.plot(out["year"], out["liabilities_per_household"] / 1000, color="#b91c1c", lw=2.0, label="Liabilities")
    ax.plot(out["year"], out["net_worth_per_household"] / 1000, color="#111827", lw=2.4, label="Net worth")
    trough = out.loc[out["net_worth_per_household"].idxmin()]
    ax.scatter([trough["year"]], [trough["net_worth_per_household"] / 1000], color="#111827", s=34, zorder=5)
    ax.annotate(
        f"net-worth floor: ${trough['net_worth_per_household']/1000:.1f}k",
        xy=(trough["year"], trough["net_worth_per_household"] / 1000),
        xytext=(trough["year"] + 1.0, trough["net_worth_per_household"] / 1000 + 24),
        arrowprops={"arrowstyle": "->", "lw": 0.8, "color": "#555"},
        fontsize=8,
    )
    ax.text(2008.55, 147, "Great\nRecession", ha="center", va="top", fontsize=8, color="#4b5563")
    ax.set_title("Bottom 50% balance-sheet floor")
    ax.set_ylabel("Average dollars per household (thousands)")
    ax.set_xlim(2000, 2026)
    ax.grid(True, axis="y", color="#e5e7eb")
    ax.legend(loc="upper left", frameon=True)
    finish(fig, "eq10_great_recession_debt_floor.png")


def main() -> None:
    chart_hierarchy_wealth_brackets()
    chart_hierarchy_wealth_brackets_over_time()
    chart_wealth_shares()
    chart_racial_wealth()
    chart_asset_composition()
    chart_debt_floor()


if __name__ == "__main__":
    main()
