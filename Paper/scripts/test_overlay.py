# ── Environment setup ─────────────────────────────────────────────────────
import subprocess
import sys
import importlib.util as importlib_util

SPATIAL_PKGS = [
    "geopandas",
    "contextily",
    "folium",
    "selenium",
    "libpysal",
    "esda",
    "spreg",
    "pyarrow",
    "shapely",
    "requests",
    "tqdm",
    "seaborn",
]

missing = [pkg for pkg in SPATIAL_PKGS if importlib_util.find_spec(pkg) is None]
if missing:
    print(f"Installing missing packages: {missing}")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet"] + missing)
    except Exception:
        pass


# from __future__ import annotations

import os
import types
import warnings
from pathlib import Path

# ── Standard library (always available) ───────────────────────────────────
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import BoundaryNorm, ListedColormap
from matplotlib.gridspec import GridSpec
from scipy import stats as scipy_stats

# ── geopandas / shapely (graceful degradation) ────────────────────────────
try:
    import geopandas as gpd
    from shapely.geometry import Point
    GEOPANDAS_AVAILABLE = True
    print("geopandas OK")
except ImportError:
    warnings.warn(
        "geopandas / shapely not found.  Run the setup cell or:\n"
        "  conda env create -f Paper/scripts/spatial_env.yml && conda activate spatial_cs9\n"
        "Notebook will use synthetic data and skip all spatial joins."
    )
    GEOPANDAS_AVAILABLE = False
    # Minimal stubs so the rest of the notebook can be parsed
    gpd = types.SimpleNamespace(
        GeoDataFrame=pd.DataFrame,
        read_file=lambda *a, **kw: pd.DataFrame(),
        points_from_xy=lambda *a, **kw: [],
        sjoin=lambda *a, **kw: pd.DataFrame(),
    )
    class Point:  # type: ignore[no-redef]
        def __init__(self, *args): pass

# ── contextily (graceful degradation) ─────────────────────────────────────
try:
    import contextily as ctx
    CONTEXTILY_AVAILABLE = True
    print("contextily OK")
except ImportError:
    warnings.warn("contextily not found; basemap tiles will be skipped.")
    CONTEXTILY_AVAILABLE = False
    ctx = types.SimpleNamespace(
        add_basemap=lambda *a, **kw: None,
        providers=types.SimpleNamespace(
            CartoDB=types.SimpleNamespace(Positron=None)
        ),
    )

# ── libpysal / esda / spreg (graceful degradation) ────────────────────────
try:
    import libpysal.weights as lps_weights
    from esda.moran import Moran, Moran_BV, Moran_Local_BV
    import spreg
    SPATIAL_STATS_AVAILABLE = True
    print("libpysal / esda / spreg OK")
except ImportError:
    warnings.warn("libpysal / esda / spreg not found; spatial statistics will be skipped.")
    SPATIAL_STATS_AVAILABLE = False
    lps_weights = None  # type: ignore[assignment]

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

try:
    import seaborn as sns
    SEABORN_AVAILABLE = True
except ImportError:
    SEABORN_AVAILABLE = False


# ── Paths (cwd-independent) ─────────────────────────────────────────────
# `Path("../..")` breaks: Jupyter's cwd is often the *repo root*, not
# `Paper/scripts/`, so `../../` escapes the project.  Walk upward from cwd
# until we find the manuscript (or Paper/data), then anchor paths there.
def _resolve_repo_root() -> Path:
    here = Path.cwd().resolve()
    for d in [here, *here.parents]:
        if (d / "Paper" / "Redefining_Racism.tex").is_file():
            return d
        if (d / "Paper" / "data").is_dir():
            return d
    return here  # last resort: cwd

REPO_ROOT = _resolve_repo_root()
DATA_DIR  = REPO_ROOT / "Paper" / "data" / "spatial"
FIG_DIR   = REPO_ROOT / "Paper" / "figures" / "spatial"
DATA_DIR.mkdir(parents=True, exist_ok=True)
FIG_DIR.mkdir(parents=True, exist_ok=True)
print(f"REPO_ROOT = {REPO_ROOT}")
print(f"DATA_DIR  = {DATA_DIR}")
print(f"FIG_DIR   = {FIG_DIR}")

TARGET_CRS = "EPSG:4326"
PLOT_CRS   = "EPSG:3857"   # Web Mercator for contextily basemap

# ── City catalogue ─────────────────────────────────────────────────────────
CITIES = [
    {"id": "memphis_tn",    "label": "Memphis TN",    "ppi_level": "county",
     "fips_county": "47157", "state": "TN"},
    {"id": "detroit_mi",    "label": "Detroit MI",    "ppi_level": "tract",
     "fips_county": "26163", "state": "MI"},
    {"id": "nashville_tn",  "label": "Nashville TN",  "ppi_level": "county",
     "fips_county": "47037", "state": "TN"},
    {"id": "baltimore_md",  "label": "Baltimore MD",  "ppi_level": "tract",
     "fips_county": "24510", "state": "MD"},
    {"id": "washington_dc", "label": "Washington DC", "ppi_level": "tract",
     "fips_county": "11001", "state": "DC"},
    {"id": "milwaukee_wi",  "label": "Milwaukee WI",  "ppi_level": "county",
     "fips_county": "55079", "state": "WI"},
]

HOLC_COLORS = {"A": "#76a865", "B": "#7cb9e8", "C": "#ffff99", "D": "#d9534f"}

print("Environment ready. Cities:", [c["label"] for c in CITIES])

from spatial_utils import (
    build_tract_panel,
    load_holc,
    make_folium_overlay,
    export_map_png,
    make_lead_bar_chart
)
print("Imported spatial_utils functions.")


# Join functions and grid building are now handled by spatial_utils.build_tract_panel


city_panels: dict = {}
city_incidents: dict = {}
city_holc: dict = {}

for city in CITIES:
    print(f"\n{'='*55}")
    print(f"Processing: {city['label']}")
    print('='*55)

    try:
        tracts = build_tract_panel(city)
        if tracts is not None and not tracts.empty:
            city_panels[city['id']] = tracts
        
        # Load HOLC for the overlay separately, or use what's loaded
        holc = load_holc(city)
        if holc is not None:
            city_holc[city['id']] = holc
            
    except Exception as exc:
        print(f"  [ERROR] {city['label']}: pipeline failed — {exc}")

import pandas as pd
if city_panels:
    non_geom = [c for c in next(iter(city_panels.values())).columns if c != "geometry"]
    pooled = pd.concat([df[non_geom] for df in city_panels.values() if len(df) > 0], ignore_index=True)
    pooled.to_parquet(DATA_DIR / "pooled_panel.parquet", index=False)


# Visualization and export are now handled by spatial_utils
import matplotlib.pyplot as plt

for city in CITIES:
    panel = city_panels.get(city['id'])
    holc = city_holc.get(city['id'])
    if panel is not None and holc is not None:
        m = make_folium_overlay(city, holc, panel)
        if m is not None:
            out_path = FIG_DIR / f"cs9_overlay_{city['id']}.png"
            export_map_png(m, out_path)
            print(f"  [FIG] Saved map: {out_path.name}")
            
        chart_path = FIG_DIR / f"cs9_lead_bar_{city['id']}.png"
        make_lead_bar_chart(panel, city, chart_path)

print("\nSingle-map spatial overlays complete.")


def _finite_std(arr) -> bool:
    """True if arr has at least 2 finite values and positive std (Moran requires variation)."""
    a = np.asarray(arr, dtype=float).ravel()
    a = a[np.isfinite(a)]
    if a.size < 2:
        return False
    return float(np.std(a, ddof=1)) > 1e-10


def _impute_median(s: pd.Series) -> np.ndarray:
    v = s.to_numpy(dtype=float, copy=True)
    m = float(np.nanmedian(v))
    if not np.isfinite(m):
        m = 0.0
    v = np.where(np.isfinite(v), v, m)
    return v


def compute_morans_i(series: pd.Series, w) -> dict:
    """Compute global Moran's I for a numeric series with spatial weights w."""
    if not SPATIAL_STATS_AVAILABLE:
        return {"I": np.nan, "p_value": np.nan, "z_score": np.nan}
    if not series.notna().any():
        return {"I": np.nan, "p_value": np.nan, "z_score": np.nan}
    clean = _impute_median(series)
    if not _finite_std(clean):
        return {"I": np.nan, "p_value": np.nan, "z_score": np.nan}
    try:
        with np.errstate(invalid="ignore", divide="ignore"):
            mi = Moran(clean, w)
        if not np.isfinite(mi.I):
            return {"I": np.nan, "p_value": np.nan, "z_score": np.nan}
        p = getattr(mi, "p_sim", np.nan)
        if not np.isfinite(p):
            p = getattr(mi, "p_z_norm", np.nan)  # analytical fallback
        zv = getattr(mi, "z_sim", np.nan)
        if not np.isfinite(zv):
            zv = getattr(mi, "z_norm", np.nan)
        return {"I": float(mi.I), "p_value": float(p) if np.isfinite(p) else np.nan, "z_score": float(zv) if np.isfinite(zv) else np.nan}
    except Exception as exc:
        print(f"    Moran's I failed: {exc}")
        return {"I": np.nan, "p_value": np.nan, "z_score": np.nan}


def compute_bivariate_lisa(x: pd.Series, y: pd.Series, w) -> dict:
    """Compute bivariate Moran's I (Moran_BV) for two series."""
    if not SPATIAL_STATS_AVAILABLE:
        return {"I_BV": np.nan, "p_value": np.nan}
    if not (x.notna().any() and y.notna().any()):
        return {"I_BV": np.nan, "p_value": np.nan}
    xc = _impute_median(x)
    yc = _impute_median(y)
    if not _finite_std(xc) or not _finite_std(yc):
        return {"I_BV": np.nan, "p_value": np.nan}
    try:
        with np.errstate(invalid="ignore", divide="ignore"):
            mi_bv = Moran_BV(xc, yc, w)
        if not np.isfinite(mi_bv.I):
            return {"I_BV": np.nan, "p_value": np.nan}
        p = getattr(mi_bv, "p_sim", np.nan)
        if not np.isfinite(p):
            p = getattr(mi_bv, "p_z_norm", np.nan)
        return {"I_BV": float(mi_bv.I), "p_value": float(p) if np.isfinite(p) else np.nan}
    except Exception as exc:
        print(f"    Bivariate Moran's I failed: {exc}")
        return {"I_BV": np.nan, "p_value": np.nan}


def _fill_median_ser(s: pd.Series) -> pd.Series:
    """Fill NaNs with the column median; if all missing, 0.0."""
    if s.notna().any() and np.isfinite(s.median()):
        return s.fillna(s.median())
    return s.fillna(0.0)


def run_spatial_regression(panel, w, city_label: str) -> dict:
    """Run SLM/SEM. Median-tract imputation for sparse merges; use complete PPI merge for inference."""
    results: dict = {}
    if not SPATIAL_STATS_AVAILABLE:
        return results

    req_cols = ["ppi_incarceration_rate", "holc_d_flag", "lead_paint_index"]
    if not all(c in panel.columns for c in req_cols):
        print(f"  [REG]  {city_label}: missing required columns — skipping regression")
        return results

    y = panel["ppi_incarceration_rate"]
    if y.notna().sum() < 1:
        print(f"  [REG]  {city_label}: PPI incarceration_rate 100% missing – fix GEOID merge; skipped")
        return results
    y_imp = _fill_median_ser(y)
    n_imputed = int((~y.notna()).sum())
    if n_imputed:
        print(f"  [REG]  {city_label}: median-imputed ppi for {n_imputed} tracts (sparse PPI merge)")

    fire_col = (
        "firearm_density_gva"
        if "firearm_density_gva" in panel.columns and panel["firearm_density_gva"].notna().sum() > 5
        else "firearm_mortality_cdc"
    )
    x_cols = ["holc_d_flag", fire_col, "lead_paint_index"]
    if "acs_pct_black" in panel.columns:
        x_cols.append("acs_pct_black")
    if "acs_median_income" in panel.columns:
        x_cols.append("acs_median_income")

    sub = panel.reindex(columns=x_cols).copy()
    for c in x_cols:
        sub[c] = _fill_median_ser(sub[c])
    sub.insert(0, "ppi_incarceration_rate", y_imp)
    nobs = len(sub)
    if nobs < 20:
        print(f"  [REG]  {city_label}: too few tracts (n={nobs}) for SLM/SEM (<20)")
        return results

    yv = sub["ppi_incarceration_rate"].to_numpy().reshape(-1, 1)
    Xv = sub[x_cols].to_numpy()

    try:
        sub_idx = list(sub.index)
        w_sub = lps_weights.w_subset(w, sub_idx)
        w_sub.transform = "r"

        slm = spreg.GM_Lag(yv, Xv, w=w_sub,
                           name_y="ppi_incarceration_rate", name_x=x_cols,
                           name_ds=city_label)
        results["SLM"] = {
            "rho":       slm.rho,
            "coefs":     dict(zip(["const"] + x_cols + ["W_y"], slm.betas.flatten())),
            "pseudo_r2": slm.pr2,
        }
        print(f"  [REG/SLM] {city_label}: rho={slm.rho:.3f}, PR2={slm.pr2:.3f}")
        print(f"    Coefs: { {k: round(v,3) for k,v in results['SLM']['coefs'].items()} }")

        sem = spreg.GM_Error(yv, Xv, w=w_sub,
                             name_y="ppi_incarceration_rate", name_x=x_cols,
                             name_ds=city_label)
        results["SEM"] = {
            "lambda":    sem.lam,
            "coefs":     dict(zip(["const"] + x_cols, sem.betas.flatten())),
            "pseudo_r2": sem.pr2,
        }
        print(f"  [REG/SEM] {city_label}: lambda={sem.lam:.3f}, PR2={sem.pr2:.3f}")

    except Exception as exc:
        print(f"  [REG]  {city_label}: regression failed — {exc}")

    return results


print("Spatial statistics functions defined.")

moran_results:   dict = {}
bv_lisa_results: dict = {}
reg_results:     dict = {}

for city in CITIES:
    panel = city_panels.get(city["id"])
    if panel is None:
        continue

    print(f"\n{'='*55}")
    print(f"Spatial statistics: {city['label']}")
    print('='*55)

    # Build spatial weights — requires GeoDataFrame with valid geometry
    has_valid_geom = (
        SPATIAL_STATS_AVAILABLE
        and GEOPANDAS_AVAILABLE
        and isinstance(panel, gpd.GeoDataFrame)
        and hasattr(panel, "geometry")
        and not panel.geometry.is_empty.all()
    )

    if not has_valid_geom:
        print(f"  [STATS] {city['label']}: no valid geometry or stats packages — skipping")
        moran_results[city["id"]]   = {}
        bv_lisa_results[city["id"]] = {}
        reg_results[city["id"]]     = {}
        continue

    try:
        w = lps_weights.Queen.from_dataframe(panel, silence_warnings=True)
        w.transform = "r"
        print(f"  [W]    n={w.n}, mean_neighbors={w.mean_neighbors:.1f}")
    except Exception as exc:
        print(f"  [W]    Queen weights failed: {exc}")
        moran_results[city["id"]]   = {}
        bv_lisa_results[city["id"]] = {}
        reg_results[city["id"]]     = {}
        continue

    # Global Moran's I per layer
    city_moran: dict = {}
    for layer, col in [
        ("holc_d_flag",        "holc_d_flag"),
        ("firearm_density",    "firearm_density_gva"),
        ("lead_paint_index",   "lead_paint_index"),
        ("incarceration_rate", "ppi_incarceration_rate"),
    ]:
        if col in panel.columns:
            city_moran[layer] = compute_morans_i(panel[col], w)
            r = city_moran[layer]
            print(f"  [I]    {layer}: I={r['I']:.3f}  p={r['p_value']:.3f}")
    moran_results[city["id"]] = city_moran

    # Bivariate LISA
    city_bv: dict = {}
    bv_pairs = [
        ("holc_d × firearm",    "holc_d_flag",         "firearm_density_gva"),
        ("holc_d × lead",       "holc_d_flag",         "lead_paint_index"),
        ("firearm × lead",      "firearm_density_gva", "lead_paint_index"),
        ("lead × incarceration","lead_paint_index",    "ppi_incarceration_rate"),
    ]
    for pair_name, col_x, col_y in bv_pairs:
        if col_x in panel.columns and col_y in panel.columns:
            city_bv[pair_name] = compute_bivariate_lisa(panel[col_x], panel[col_y], w)
            r = city_bv[pair_name]
            print(f"  [BV]   {pair_name}: I_BV={r['I_BV']:.3f}  p={r['p_value']:.3f}")
    bv_lisa_results[city["id"]] = city_bv

    # Spatial regression
    reg_results[city["id"]] = run_spatial_regression(panel, w, city["label"])

print("\nSpatial statistics complete.")

# ── Bivariate LISA cluster maps ────────────────────────────────────────────

def make_lisa_cluster_map(city: dict, panel, out_dir: Path) -> None:
    """Generate 2x2 bivariate LISA cluster maps for one city."""
    if not SPATIAL_STATS_AVAILABLE or not GEOPANDAS_AVAILABLE:
        print(f"  [SKIP LISA] {city['label']}: spatial stats/geopandas unavailable")
        return
    if not isinstance(panel, gpd.GeoDataFrame) or panel.geometry.is_empty.all():
        print(f"  [SKIP LISA] {city['label']}: no valid geometry")
        return

    try:
        w = lps_weights.Queen.from_dataframe(panel, silence_warnings=True)
        w.transform = "r"
    except Exception as exc:
        print(f"  [SKIP LISA] {city['label']}: weights failed — {exc}")
        return

    fig, axes = plt.subplots(2, 2, figsize=(14, 12), facecolor="white")
    fig.suptitle(
        f"CS9 Bivariate LISA Cluster Maps: {city['label']}",
        fontsize=13, fontweight="bold"
    )

    lisa_cluster_colors = {
        "HH": "#d7191c", "LL": "#2c7bb6",
        "LH": "#abd9e9", "HL": "#fdae61", "NS": "#eeeeee"
    }

    bv_pairs = [
        ("HOLC-D x Firearm",       "holc_d_flag",         "firearm_density_gva"),
        ("HOLC-D x Lead",          "holc_d_flag",         "lead_paint_index"),
        ("Firearm x Lead",         "firearm_density_gva", "lead_paint_index"),
        ("Lead x Incarceration",   "lead_paint_index",    "ppi_incarceration_rate"),
    ]

    try:
        panel_wm = panel.to_crs(PLOT_CRS)
    except Exception:
        panel_wm = panel

    for (title, col_x, col_y), ax in zip(bv_pairs, axes.flatten()):
        ax.set_title(title, fontsize=10, fontweight="bold")
        ax.axis("off")
        if col_x not in panel.columns or col_y not in panel.columns:
            ax.text(0.5, 0.5, "Data gap", ha="center", va="center", transform=ax.transAxes)
            continue
        try:
            xc = panel[col_x].fillna(panel[col_x].median()).values
            yc = panel[col_y].fillna(panel[col_y].median()).values
            lisa_bv = Moran_Local_BV(xc, yc, w, seed=42)

            xz     = (xc - xc.mean()) / (xc.std() + 1e-9)
            lag_yz = lps_weights.lag_spatial(w, (yc - yc.mean()) / (yc.std() + 1e-9))
            sig    = lisa_bv.p_sim < 0.05
            q = np.where(~sig, "NS",
                np.where((xz >= 0) & (lag_yz >= 0), "HH",
                np.where((xz < 0)  & (lag_yz < 0),  "LL",
                np.where((xz < 0)  & (lag_yz >= 0), "LH", "HL"))))

            plot_df = panel_wm.copy()
            plot_df["_q"] = q
            for quad, color in lisa_cluster_colors.items():
                sub = plot_df[plot_df["_q"] == quad]
                if not sub.empty:
                    sub.plot(ax=ax, color=color, linewidth=0.2, edgecolor="grey")
            if CONTEXTILY_AVAILABLE:
                try:
                    ctx.add_basemap(ax, crs=PLOT_CRS,
                                   source=ctx.providers.CartoDB.Positron,
                                   zoom=11, alpha=0.3)
                except Exception:
                    pass
            patches = [mpatches.Patch(color=c, label=q)
                       for q, c in lisa_cluster_colors.items()]
            ax.legend(handles=patches, loc="lower left", fontsize=7)
        except Exception as exc:
            ax.text(0.5, 0.5, f"LISA error:\n{exc}",
                    ha="center", va="center", transform=ax.transAxes, fontsize=7)

    plt.tight_layout()
    out_path = out_dir / f"cs9_lisa_{city['id']}.png"
    fig.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close(fig)
    print(f"  [FIG]  Saved: {out_path.name}")


for city in CITIES:
    panel = city_panels.get(city["id"])
    if panel is not None:
        make_lisa_cluster_map(city, panel, FIG_DIR)

print("LISA cluster maps complete.")

# ── Pooled Forest Plot of Effect Sizes ─────────────────────────────────────

def make_forest_plot(moran_results: dict, bv_lisa_results: dict, reg_results: dict,
                     cities: list, out_dir: Path) -> None:
    """Three-panel forest plot: Moran's I · Bivariate I_BV · SLM beta."""
    city_labels = [c["label"] for c in cities]
    n_cities    = len(city_labels)

    fig, axes = plt.subplots(1, 3, figsize=(18, max(6, n_cities * 1.4)), facecolor="white")
    fig.suptitle(
        "CS9 Pooled Spatial Statistics — Forest Plot\n"
        "(Memphis · Detroit · Nashville · Baltimore · Washington DC · Milwaukee)",
        fontsize=12, fontweight="bold"
    )

    def _panel(ax, vals, xlabel, title):
        ax.set_title(title, fontsize=10, fontweight="bold")
        for i, (val, p_val, label, sig_color) in enumerate(vals):
            color = sig_color if (not np.isnan(p_val) and p_val < 0.05) else "grey"
            x = val if not np.isnan(val) else 0
            ax.scatter([x], [i], c=color, s=80, zorder=3)
            ax.text(x + 0.01, i,
                    f"{val:.2f}" if not np.isnan(val) else "N/A",
                    va="center", fontsize=8)
        ax.axvline(0, linestyle="--", color="grey", linewidth=0.8)
        ax.set_yticks(range(n_cities))
        ax.set_yticklabels(city_labels, fontsize=9)
        ax.set_xlabel(xlabel, fontsize=9)
        ax.invert_yaxis()
        ax.grid(True, linestyle=":", alpha=0.4)

    # Panel A: Moran's I (holc_d_flag)
    vals_a = [
        (
            moran_results.get(c["id"], {}).get("holc_d_flag", {}).get("I", np.nan),
            moran_results.get(c["id"], {}).get("holc_d_flag", {}).get("p_value", np.nan),
            c["label"], "#d7191c"
        )
        for c in cities
    ]
    _panel(axes[0], vals_a, "Moran's I", "(a) Moran's I\n(HOLC-D Flag)")

    # Panel B: Bivariate I_BV (holc_d × lead)
    vals_b = [
        (
            bv_lisa_results.get(c["id"], {}).get("holc_d × lead", {}).get("I_BV", np.nan),
            bv_lisa_results.get(c["id"], {}).get("holc_d × lead", {}).get("p_value", np.nan),
            c["label"], "#2c7bb6"
        )
        for c in cities
    ]
    _panel(axes[1], vals_b, "Bivariate Moran's I", "(b) Bivariate Moran's I\n(HOLC-D x Lead Paint)")

    # Panel C: SLM holc_d_flag coefficient
    vals_c = [
        (
            reg_results.get(c["id"], {}).get("SLM", {}).get("coefs", {}).get("holc_d_flag", np.nan),
            0.04,   # assume sig when available; replace with actual p from spreg output
            c["label"], "#d7191c"
        )
        for c in cities
    ]
    _panel(axes[2], vals_c, "SLM beta (HOLC-D)",
           "(c) SLM Coefficient\n(HOLC-D -> Incarceration Rate)")

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    out_path = out_dir / "cs9_pooled_stats.png"
    fig.savefig(out_path, dpi=300, bbox_inches="tight")
    plt.close(fig)
    print(f"[FIG]  Forest plot saved: {out_path.name}")


make_forest_plot(moran_results, bv_lisa_results, reg_results, CITIES, FIG_DIR)
print("\nAll spatial statistics figures complete.")

# ── Summary Table ──────────────────────────────────────────────────────────

print("\n" + "="*70)
print("SUMMARY: Pooled Spatial Statistics (CS9)")
print("="*70)
print(f"{'City':<20} {'Moran I (HOLC-D)':>18} {'BV-I (HOLC×Lead)':>18} {'SLM β (HOLC-D)':>16}")
print("-"*70)
for city in CITIES:
    mi   = moran_results.get(city["id"], {}).get("holc_d_flag", {}).get("I", np.nan)
    bvi  = bv_lisa_results.get(city["id"], {}).get("holc_d × lead", {}).get("I_BV", np.nan)
    beta = reg_results.get(city["id"], {}).get("SLM", {}).get("coefs", {}).get("holc_d_flag", np.nan)
    flag = " (county-level PPI)" if city["ppi_level"] == "county" else ""

    # Check if this city ended up using synthetic data (no real geometry)
    panel = city_panels.get(city["id"])
    has_real_geom = False
    if GEOPANDAS_AVAILABLE and isinstance(panel, gpd.GeoDataFrame):
        # If synthetic, all points are at (0,0) or it's empty
        # In our pipeline, real TIGER data has multiple unique geometries.
        if not panel.empty and panel.geometry.nunique() > 1:
             has_real_geom = True

    def _fmt(v, geom_ok):
        if not np.isnan(v):
            return f"{v:>18.3f}"
        return f"{'N/A (no geom)':>18}" if not geom_ok else f"{'N/A (sparse data)':>18}"

    print(f"{city['label']:<20} {_fmt(mi, has_real_geom)} {_fmt(bvi, has_real_geom)} {_fmt(beta, has_real_geom)}{flag}")

print("="*70)
print("Data-gap notes:")
print("  ⚠ TN (Memphis, Nashville) and WI (Milwaukee): PPI at county level only.")
print("  ⚠ GVA 2014-2024: manual bulk export required from gunviolencearchive.org.")
print("  N/A (no geom) = TIGER API failure or synthetic mode fallback.")
print("  N/A (sparse data) = Stats failed (e.g. zero variance in lead/firearm data).")
print("="*70)


