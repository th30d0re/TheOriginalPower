"""
spatial_utils.py
----------------

Utility module for the CS9 Spatial Confluence case study.
Extracts and formalises data-loading, geometry, and visualization logic.
"""

import sys
import os
import logging
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# 1. Imports and availability flags
# ---------------------------------------------------------------------------

try:
    import geopandas as gpd
    GEOPANDAS_AVAILABLE = True
except ImportError:
    GEOPANDAS_AVAILABLE = False
    log.warning("geopandas unavailable")

try:
    import folium
    import folium.plugins
    FOLIUM_AVAILABLE = True
except ImportError:
    FOLIUM_AVAILABLE = False
    log.warning("folium unavailable")

try:
    import selenium.webdriver
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    log.warning("selenium unavailable")

try:
    import contextily as cx
    CONTEXTILY_AVAILABLE = True
except ImportError:
    CONTEXTILY_AVAILABLE = False
    log.warning("contextily unavailable")

try:
    import matplotlib
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
    log.warning("matplotlib unavailable")

# ---------------------------------------------------------------------------
# 2. Path resolution and constants
# ---------------------------------------------------------------------------

def resolve_repo_root() -> Path:
    """Walk up from __file__ or cwd until Paper/ and Makefile are found."""
    try:
        start = Path(__file__).resolve().parent
    except NameError:
        start = Path.cwd()
        
    curr = start
    for _ in range(10):
        if (curr / "Paper").is_dir() and (curr / "Makefile").is_file():
            return curr
        curr = curr.parent
    return start

_REPO_ROOT = resolve_repo_root()
DATA_DIR = _REPO_ROOT / "Paper" / "data" / "spatial"

# Import compatibility check
_scripts_dir = str(_REPO_ROOT / "Paper" / "scripts")
if _scripts_dir not in sys.path:
    sys.path.insert(0, _scripts_dir)

# Constants
CITIES = [
    {
        "id": "memphis_tn",
        "label": "Memphis TN",
        "state": "TN",
        "fips_state": "47",
        "fips_county": "47157",   # Shelby County
        "holc_id": "memphis",
        "holc_city": "Memphis",
        "ppi_level": "county",   # TN county-level fallback
        "gva_city": "Memphis",
        "gva_state": "TN",
        "lat_min": 35.0,
        "lat_max": 35.25,
        "lon_min": -90.1,
        "lon_max": -89.8,
        "ucr_annual_murder_proxy": 150,
    },
    {
        "id": "detroit_mi",
        "label": "Detroit MI",
        "state": "MI",
        "fips_state": "26",
        "fips_county": "26163",   # Wayne County
        "holc_id": "detroit",
        "holc_city": "Detroit",
        "ppi_level": "tract",
        "gva_city": "Detroit",
        "gva_state": "MI",
        "lat_min": 42.25, "lat_max": 42.45, "lon_min": -83.30, "lon_max": -82.90,
        "ucr_annual_murder_proxy": 260,
    },
    {
        "id": "nashville_tn",
        "label": "Nashville TN",
        "state": "TN",
        "fips_state": "47",
        "fips_county": "47037",   # Davidson County
        "holc_id": "nashville",
        "holc_city": "Nashville",
        "ppi_level": "county",   # TN county-level fallback
        "gva_city": "Nashville",
        "gva_state": "TN",
        "lat_min": 36.05, "lat_max": 36.20, "lon_min": -86.95, "lon_max": -86.50,
        "ucr_annual_murder_proxy": 100,
    },
    {
        "id": "baltimore_md",
        "label": "Baltimore MD",
        "state": "MD",
        "fips_state": "24",
        "fips_county": "24510",   # Baltimore city
        "holc_id": "baltimore",
        "holc_city": "Baltimore",
        "ppi_level": "tract",
        "gva_city": "Baltimore",
        "gva_state": "MD",
        "lat_min": 39.20, "lat_max": 39.40, "lon_min": -76.75, "lon_max": -76.50,
        "ucr_annual_murder_proxy": 200,
        # Tighter Folium framing: default centroid+zoom leaves much of the canvas as Chesapeake Bay
        # and peripheral sprawl relative to the HOLC×firearm core.
        "overlay_fit_bounds": [[39.23, -76.72], [39.37, -76.585]],
    },
    {
        "id": "washington_dc",
        "label": "Washington DC",
        "state": "DC",
        "fips_state": "11",
        "fips_county": "11001",   # DC (single county equivalent)
        "holc_id": "washington_dc",
        "holc_city": "Washington",
        "holc_state": "DC",
        "ppi_level": "tract",
        "gva_city": "Washington",
        "gva_state": "DC",
        "lat_min": 38.80, "lat_max": 39.00, "lon_min": -77.20, "lon_max": -76.90,
        "ucr_annual_murder_proxy": 130,
    },
    {
        "id": "milwaukee_wi",
        "label": "Milwaukee WI",
        "state": "WI",
        "fips_state": "55",
        "fips_county": "55079",   # Milwaukee County
        "holc_id": "milwaukee",
        "holc_city": "Milwaukee",
        "ppi_level": "county",   # WI county-level fallback
        "gva_city": "Milwaukee",
        "gva_state": "WI",
        "lat_min": 42.90, "lat_max": 43.20, "lon_min": -88.20, "lon_max": -87.80,
        "ucr_annual_murder_proxy": 110,
        # Folium framing: Milwaukee County parcels extend far east over Lake Michigan; union
        # centroid + zoom 11 wastes most of the canvas on empty water unless we clamp bounds.
        "overlay_fit_bounds": [[42.95, -88.02], [43.135, -87.895]],
    },
]

HOLC_COLORS = {
    "A": "#76a865",
    "B": "#7cb9e8",
    "C": "#ffff99",
    "D": "#d9534f"
}

TARGET_CRS = "EPSG:4326"
PLOT_CRS = "EPSG:3857"

# ---------------------------------------------------------------------------
# 3. GEOID utility
# ---------------------------------------------------------------------------

def norm_geoid_11(s: pd.Series) -> pd.Series:
    if s is None or s.empty:
        log.warning("norm_geoid_11: received empty or None series")
        return s
    
    # Strip non-digits and zero-pad to 11
    s_norm = s.astype(str).str.replace(r'\D', '', regex=True)
    s_norm = s_norm.str.zfill(11)
    return s_norm.astype(pd.StringDtype())

# ---------------------------------------------------------------------------
# 4. Data loaders
# ---------------------------------------------------------------------------

def _read_holc_features(city: dict, data_dir: Path) -> 'gpd.GeoDataFrame | None':
    if not GEOPANDAS_AVAILABLE:
        log.warning("_read_holc_features: geopandas unavailable")
        return None
    path = data_dir / f"holc_{city['id']}.geojson"
    if not path.exists():
        log.warning(f"_read_holc_features: {path} not found")
        return None
        
    try:
        import json
        with path.open(encoding='utf-8') as f:
            data = json.load(f)
        for feature in data.get('features', []):
            ds = feature.get('properties', {}).get('_data_source', '')
            if 'modeled' in ds or 'placeholder' in ds:
                log.error(f"Rerun `fetch_spatial_data.py` to refresh HOLC cache for {city['id']}")
                return None
    except Exception as e:
        log.warning(f"_read_holc_features: could not parse json from {path}: {e}")
        return None
        
    gdf = gpd.read_file(path)
    
    # Normalise grade
    for col in ["holc_grade", "grade", "HOLC_grade", "Grade"]:
        if col in gdf.columns:
            gdf["grade"] = gdf[col]
            break
            
    return gdf

def load_holc(city: dict, data_dir: Path = None) -> 'gpd.GeoDataFrame | None':
    data_dir = data_dir or DATA_DIR
    gdf = _read_holc_features(city, data_dir)
    if gdf is None:
        return None
            
    gdf = gdf[gdf.get("_dissolved", True) == True]
    
    if gdf.crs:
        gdf = gdf.to_crs(TARGET_CRS)
    else:
        gdf = gdf.set_crs(TARGET_CRS)
        
    return gdf

def load_holc_crosswalk(city: dict, data_dir: Path = None) -> 'gpd.GeoDataFrame | None':
    data_dir = data_dir or DATA_DIR
    gdf = _read_holc_features(city, data_dir)
    if gdf is None:
        return None
            
    gdf = gdf[gdf.get("_dissolved", False) == False]
    return gdf

def load_tiger_tracts(city: dict, data_dir: Path = None) -> 'gpd.GeoDataFrame | None':
    if not GEOPANDAS_AVAILABLE:
        log.warning("load_tiger_tracts: geopandas unavailable")
        return None
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"tiger_tracts_{city['fips_state']}.parquet"
    if not path.exists():
        log.warning(f"load_tiger_tracts: {path} not found")
        return None
        
    gdf = gpd.read_parquet(path)
    county_fips = city['fips_county'][2:]
    gdf = gdf[gdf['COUNTYFP'] == county_fips].copy()
    gdf['GEOID'] = norm_geoid_11(gdf['GEOID'])
    
    if gdf.crs:
        gdf = gdf.to_crs(TARGET_CRS)
    else:
        gdf = gdf.set_crs(TARGET_CRS)
    return gdf

def load_acs(city: dict, data_dir: Path = None) -> 'pd.DataFrame | None':
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"acs_{city['id']}.csv"
    if not path.exists():
        log.warning(f"load_acs: {path} not found")
        return None
        
    # Read CSV, skip lines starting with #
    with path.open() as f:
        lines = [line for line in f if not line.strip().startswith('#')]
    import io
    df = pd.read_csv(io.StringIO(''.join(lines)))
    
    rename_map = {
        'B02001_001E': 'acs_total_pop',
        'B02001_003E': 'acs_black_pop',
        'B19013_001E': 'acs_median_income'
    }
    df = df.rename(columns=rename_map)
    df['acs_total_pop'] = pd.to_numeric(df.get('acs_total_pop'), errors='coerce')
    df['acs_black_pop'] = pd.to_numeric(df.get('acs_black_pop'), errors='coerce')
    df['acs_median_income'] = pd.to_numeric(df.get('acs_median_income'), errors='coerce')
    df['acs_pct_black'] = df['acs_black_pop'] / df['acs_total_pop']
    
    if 'GEO_ID' in df.columns and 'GEOID' not in df.columns:
        df['GEOID'] = df['GEO_ID'].astype(str).str.replace('1400000US', '')
    df['GEOID'] = norm_geoid_11(df['GEOID'])
    return df

def load_ejscreen(city: dict, data_dir: Path = None) -> 'pd.DataFrame | None':
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"ejscreen_{city['id']}.csv"
    if not path.exists():
        log.warning(f"load_ejscreen: {path} not found")
        return None
        
    with path.open() as f:
        lines = [line for line in f if not line.strip().startswith('#')]
    import io
    df = pd.read_csv(io.StringIO(''.join(lines)))
    
    rename_map = {
        'ID': 'GEOID',
        'LDPNT': 'lead_paint_index',
        'PTRAF': 'highway_buffer_proxy'
    }
    df = df.rename(columns=rename_map)
    
    for col in ['lead_paint_index', 'highway_buffer_proxy']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    df['GEOID'] = norm_geoid_11(df['GEOID'])
    return df

def load_gva(city: dict, data_dir: Path = None) -> 'pd.DataFrame | None':
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"gva_incidents_{city['id']}.csv"
    if not path.exists():
        log.warning(f"load_gva: {path} not found")
        return None
        
    text = path.read_text(encoding='utf-8')
    if "DATA_GAP" in text:
        log.warning("load_gva: file contains DATA_GAP")
        return None
        
    lines = [line for line in text.splitlines() if not line.strip().startswith('#')]
    import io
    df = pd.read_csv(io.StringIO('\n'.join(lines)))
    
    for col in ['latitude', 'longitude', 'n_killed']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
    return df

def load_cdc_wonder(city: dict, data_dir: Path = None) -> 'pd.DataFrame | None':
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"cdc_wonder_firearm_{city['id']}.csv"
    if not path.exists():
        log.warning(f"load_cdc_wonder: {path} not found")
        return None
        
    text = path.read_text(encoding='utf-8')
    if "DATA_GAP" in text:
        log.warning("load_cdc_wonder: file contains DATA_GAP")
        return None
        
    lines = [line for line in text.splitlines() if not line.strip().startswith('#')]
    import io
    df = pd.read_csv(io.StringIO('\n'.join(lines)))
    
    if 'rate_per_100k' in df.columns:
        df['rate_per_100k'] = pd.to_numeric(df['rate_per_100k'], errors='coerce')
    return df

def load_ppi(city: dict, data_dir: Path = None) -> 'pd.DataFrame | None':
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"ppi_{city['id']}.csv"
    if not path.exists():
        log.warning(f"load_ppi: {path} not found")
        return None
        
    with path.open() as f:
        lines = [line for line in f if not line.strip().startswith('#')]
    import io
    df = pd.read_csv(io.StringIO(''.join(lines)))
    
    if 'GEOID' in df.columns:
        df['GEOID'] = norm_geoid_11(df['GEOID'])
    if 'rate_per_1000' in df.columns:
        df['rate_per_1000'] = pd.to_numeric(df['rate_per_1000'], errors='coerce')
    return df

# ---------------------------------------------------------------------------
# 5. Geometry and join functions
# ---------------------------------------------------------------------------

def gva_to_tract_density(gva_df: 'pd.DataFrame | None', tracts: 'gpd.GeoDataFrame') -> pd.Series:
    zero_series = pd.Series(0.0, index=tracts['GEOID'], name='firearm_density_gva')
    if gva_df is None or not GEOPANDAS_AVAILABLE:
        return zero_series
        
    gva_df = gva_df.dropna(subset=['latitude', 'longitude']).copy()
    if gva_df.empty:
        return zero_series
        
    pts = gpd.GeoDataFrame(
        gva_df, 
        geometry=gpd.points_from_xy(gva_df.longitude, gva_df.latitude),
        crs=TARGET_CRS
    )
    
    joined = gpd.sjoin(pts, tracts, how='inner', predicate='within')
    counts = joined.groupby('GEOID').size()
    
    # Normalise by area (km^2)
    tracts_proj = tracts.to_crs(PLOT_CRS)
    areas_km2 = tracts_proj.set_index('GEOID').geometry.area / 1e6
    
    density = counts / areas_km2
    return density.reindex(tracts['GEOID']).fillna(0.0).rename('firearm_density_gva')

def disaggregate_cdc_to_tracts(cdc_df: 'pd.DataFrame | None', tract_panel: 'gpd.GeoDataFrame') -> pd.Series:
    zero_series = pd.Series(0.0, index=tract_panel['GEOID'], name='firearm_rate_weighted')
    if cdc_df is None or 'acs_pct_black' not in tract_panel.columns:
        return zero_series
        
    county_rate = cdc_df['rate_per_100k'].mean()
    if pd.isna(county_rate):
        return zero_series
        
    panel_df = tract_panel.set_index('GEOID')
    weight = panel_df['acs_pct_black'].fillna(0) * (1 + panel_df['holc_d_flag'].fillna(0))
    sum_weight = weight.sum()
    if sum_weight == 0:
        return zero_series
        
    weight_norm = weight / sum_weight
    rate_weighted = weight_norm * county_rate * len(panel_df)
    return rate_weighted.rename('firearm_rate_weighted')


def _merge_holc_grades_from_polygons(
    tracts: "gpd.GeoDataFrame", city: dict, data_dir: Path
) -> "gpd.GeoDataFrame":
    """
    Assign tract-level holc_grade using dissolved HOLC polygons (representative point ∈ polygon).

    Used when American Panorama tract-crosswalk fragments (GEOID / pct_tract) are unavailable,
    e.g. Washington DC polygons supplied via vendor GeoJSON.
    """
    if not GEOPANDAS_AVAILABLE:
        tracts["holc_grade"] = None
        tracts["holc_d_flag"] = 0
        return tracts

    holc_d = load_holc(city, data_dir)
    if holc_d is None or holc_d.empty:
        tracts["holc_grade"] = None
        tracts["holc_d_flag"] = 0
        return tracts
    if "grade" not in holc_d.columns:
        log.warning("Dissolved HOLC GeoJSON missing grade column — cannot join tracts")
        tracts["holc_grade"] = None
        tracts["holc_d_flag"] = 0
        return tracts

    pts = tracts[["GEOID", "geometry"]].copy()
    try:
        pts["geometry"] = pts.geometry.representative_point()
    except Exception:  # noqa: BLE001
        pts["geometry"] = pts.geometry.centroid

    joined = gpd.sjoin(
        pts,
        holc_d[["geometry", "grade"]],
        how="left",
        predicate="within",
    )
    grades = (
        joined.reset_index(drop=True)[["GEOID", "grade"]]
        .drop_duplicates(subset=["GEOID"], keep="first")
        .rename(columns={"grade": "holc_grade"})
    )
    out = tracts.drop(columns=["holc_grade", "holc_d_flag"], errors="ignore").merge(
        grades, on="GEOID", how="left"
    )
    out["holc_d_flag"] = (out["holc_grade"] == "D").astype(int)
    cov = float(out["holc_grade"].notna().mean() * 100) if len(out) else 0.0
    log.info(
        "build_tract_panel: polygon HOLC join coverage %.1f%% (%d / %d tracts) for %s",
        cov,
        int(out["holc_grade"].notna().sum()),
        len(out),
        city.get("id"),
    )
    return out


def build_tract_panel(city: dict, data_dir: Path = None) -> 'gpd.GeoDataFrame | None':
    tracts = load_tiger_tracts(city, data_dir)
    if tracts is None:
        log.warning("build_tract_panel: Could not load TIGER tracts")
        return None
        
    cw = load_holc_crosswalk(city, data_dir)
    if cw is not None and not cw.empty and 'GEOID' in cw.columns:
        cw['GEOID'] = norm_geoid_11(cw['GEOID'])
        if 'pct_tract' in cw.columns:
            cw['pct_tract'] = pd.to_numeric(cw['pct_tract'], errors='coerce')
            idx = cw.groupby('GEOID')['pct_tract'].idxmax()
            dom_grades = cw.loc[idx, ['GEOID', 'grade']].rename(columns={'grade': 'holc_grade'})
        else:
            # Fallback if no pct_tract
            dom_grades = cw.groupby('GEOID').first().reset_index()[['GEOID', 'grade']].rename(columns={'grade': 'holc_grade'})
            
        tracts = tracts.merge(dom_grades, on='GEOID', how='left')
        tracts['holc_d_flag'] = (tracts['holc_grade'] == 'D').astype(int)
    else:
        log.warning(
            "HOLC tract crosswalk missing or lacks GEOID — using dissolved polygon join for %s",
            city.get("id"),
        )
        tracts = _merge_holc_grades_from_polygons(tracts, city, data_dir)
    acs = load_acs(city, data_dir)
    if acs is not None:
        tracts = tracts.merge(acs[['GEOID', 'acs_total_pop', 'acs_black_pop', 'acs_pct_black', 'acs_median_income']], on='GEOID', how='left')
        
    ejs = load_ejscreen(city, data_dir)
    if ejs is not None:
        tracts = tracts.merge(ejs[['GEOID', 'lead_paint_index', 'highway_buffer_proxy']], on='GEOID', how='left')
        
    gva = load_gva(city, data_dir)
    tracts = tracts.merge(gva_to_tract_density(gva, tracts).reset_index(), on='GEOID', how='left')
    
    cdc = load_cdc_wonder(city, data_dir)
    tracts = tracts.merge(disaggregate_cdc_to_tracts(cdc, tracts).reset_index(), on='GEOID', how='left')
    
    ppi = load_ppi(city, data_dir)
    if ppi is not None:
        tracts = tracts.merge(ppi[['GEOID', 'rate_per_1000']].rename(columns={'rate_per_1000': 'ppi_incarceration_rate'}), on='GEOID', how='left')
        
    # Log hit-rates summary
    hit_rates = {
        'HOLC': tracts['holc_grade'].notna().mean() * 100 if 'holc_grade' in tracts else 0,
        'ACS': tracts['acs_total_pop'].notna().mean() * 100 if 'acs_total_pop' in tracts else 0,
        'EJScreen': tracts['lead_paint_index'].notna().mean() * 100 if 'lead_paint_index' in tracts else 0,
        'GVA': tracts['firearm_density_gva'].notna().mean() * 100 if 'firearm_density_gva' in tracts else 0,
        'CDC': tracts['firearm_rate_weighted'].notna().mean() * 100 if 'firearm_rate_weighted' in tracts else 0,
        'PPI': tracts['ppi_incarceration_rate'].notna().mean() * 100 if 'ppi_incarceration_rate' in tracts else 0,
    }
    log.info(f"build_tract_panel: Merge hit-rates: {hit_rates}")
    
    return tracts

# ---------------------------------------------------------------------------
# 6. Folium map functions
# ---------------------------------------------------------------------------

def make_folium_overlay(city: dict, holc_gdf: 'gpd.GeoDataFrame', tract_panel: 'gpd.GeoDataFrame', heat_weights: list[tuple] | None = None) -> 'folium.Map | None':
    if not FOLIUM_AVAILABLE:
        log.warning("make_folium_overlay: folium unavailable")
        return None
        
    fit_bounds = city.get("overlay_fit_bounds")

    centroid = tract_panel.geometry.unary_union.centroid
    zoom_start = int(city.get("overlay_zoom_start", 11))
    if fit_bounds:
        lat_lo, lon_lo = fit_bounds[0]
        lat_hi, lon_hi = fit_bounds[1]
        m = folium.Map(
            location=[(lat_lo + lat_hi) / 2, (lon_lo + lon_hi) / 2],
            zoom_start=max(zoom_start, 12),
            tiles="CartoDB Positron",
        )
    else:
        m = folium.Map(
            location=[centroid.y, centroid.x],
            zoom_start=zoom_start,
            tiles="CartoDB Positron",
        )
    
    # Tract boundaries
    folium.GeoJson(
        tract_panel,
        name="Tract Boundaries",
        style_function=lambda x: {'color': 'gray', 'weight': 0.5, 'fillOpacity': 0},
        control=True,
    ).add_to(m)
    
    # HOLC grades
    for grade, hex_color in HOLC_COLORS.items():
        grade_gdf = holc_gdf[holc_gdf['grade'] == grade]
        if not grade_gdf.empty:
            fg = folium.FeatureGroup(name=f"HOLC Grade {grade}")
            folium.GeoJson(
                grade_gdf,
                style_function=lambda x, c=hex_color: {
                    'fillColor': c,
                    'color': c,
                    'weight': 1,
                    'fillOpacity': 0.35,
                }
            ).add_to(fg)
            fg.add_to(m)
            
    # Heat map weights: prefer CDC-weighted tract rate when present, else GVA density
    rate_col = (
        "firearm_rate_weighted"
        if "firearm_rate_weighted" in tract_panel.columns
        and tract_panel["firearm_rate_weighted"].notna().any()
        else (
            "firearm_density_gva"
            if "firearm_density_gva" in tract_panel.columns
            else None
        )
    )

    if heat_weights is None:
        heat_weights = []
        if rate_col is not None:
            for _, row in tract_panel.dropna(subset=[rate_col]).iterrows():
                if row[rate_col] > 0:
                    heat_weights.append(
                        [row.geometry.centroid.y, row.geometry.centroid.x, float(row[rate_col])]
                    )
                
    if heat_weights:
        folium.plugins.HeatMap(
            heat_weights,
            name="Firearm Rate Heatmap",
            gradient={0.4: "purple", 0.65: "orange", 1.0: "red"}
        ).add_to(m)
        
    # Legend overlay
    legend_html = '''
    <div style="position: fixed; 
                bottom: 50px; left: 50px; width: 150px; height: 160px; 
                border:2px solid grey; z-index:9999; font-size:14px;
                background-color: white; opacity: 0.9; padding: 10px;">
        <b>HOLC Grades</b><br>
        <i style="background:#76a865;width:15px;height:15px;float:left;margin-right:5px;opacity:0.7;"></i> A (Best)<br>
        <i style="background:#7cb9e8;width:15px;height:15px;float:left;margin-right:5px;opacity:0.7;"></i> B<br>
        <i style="background:#ffff99;width:15px;height:15px;float:left;margin-right:5px;opacity:0.7;"></i> C<br>
        <i style="background:#d9534f;width:15px;height:15px;float:left;margin-right:5px;opacity:0.7;"></i> D (Hazardous)<br>
        <hr style="margin:5px 0;">
        <b>Firearm Rate</b><br>
        <i style="background:linear-gradient(to right, purple, orange, red);width:100%;height:10px;float:left;"></i>
    </div>
    '''
    m.get_root().html.add_child(folium.Element(legend_html))

    folium.LayerControl().add_to(m)

    if fit_bounds:
        m.fit_bounds(fit_bounds)

    return m

def export_map_png(folium_map: 'folium.Map', out_path: Path, delay: int = 5, driver=None) -> Path | None:
    if not SELENIUM_AVAILABLE:
        log.warning("export_map_png: Selenium unavailable — saving HTML only")
        html_path = out_path.with_suffix('.html')
        folium_map.save(str(html_path))
        return None
        
    html_tmp = out_path.with_suffix('.tmp.html')
    folium_map.save(str(html_tmp))
    
    created_driver = False
    try:
        if driver is None:
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver import Chrome
            opts = Options()
            opts.add_argument('--headless')
            opts.add_argument('--window-size=1920,1080')
            driver = Chrome(options=opts)
            created_driver = True
            
        driver.get(f"file://{html_tmp.absolute()}")
        import time
        time.sleep(delay)
        driver.save_screenshot(str(out_path))
        return out_path
    except Exception as exc:
        log.warning(f"export_map_png: PNG export failed ({exc}) — falling back to HTML")
        html_path = out_path.with_suffix('.html')
        folium_map.save(str(html_path))
        return None
    finally:
        if html_tmp.exists():
            html_tmp.unlink()
        if created_driver and driver is not None:
            driver.quit()

# ---------------------------------------------------------------------------
# 7. Chart function
# ---------------------------------------------------------------------------

def make_lead_bar_chart(tract_panel: 'gpd.GeoDataFrame', city: dict, out_path: Path) -> Path | None:
    """Computes median lead paint index by HOLC grade and produces a bar chart."""
    if not MATPLOTLIB_AVAILABLE:
        log.warning("make_lead_bar_chart: matplotlib unavailable")
        return None
        
    if 'holc_grade' not in tract_panel.columns or 'lead_paint_index' not in tract_panel.columns:
        return None
        
    df = tract_panel.dropna(subset=['holc_grade', 'lead_paint_index'])
    if df.empty:
        return None
        
    medians = df.groupby('holc_grade')['lead_paint_index'].median()
    grades = [g for g in ['A', 'B', 'C', 'D'] if g in medians.index]
    vals = [medians[g] for g in grades]
    colors = [HOLC_COLORS[g] for g in grades]
    
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(grades, vals, color=colors, edgecolor='black', alpha=0.8)
    ax.set_xlabel("HOLC Grade")
    ax.set_ylabel("Lead Paint Index (EJScreen)")
    ax.set_title(f"Median Lead Paint Index by Redlining Grade - {city['label']}")
    
    # Hide top/right spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.savefig(out_path, dpi=300)
    plt.close(fig)
    return out_path
