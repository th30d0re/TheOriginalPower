"""
boston_holc_shootings.py
------------------------

Stage 1 (data) for the Boston HOLC x shootings overlay.

Downloads and caches under Paper/data/spatial/boston/:

  1. HOLC 1938 area polygons for Boston from Mapping Inequality
     (University of Richmond, Digital Scholarship Lab / American Panorama).
  2. Boston Police Department shooting incidents with real coordinates:
     rows flagged SHOOTING in the Analyze Boston "Crime Incident Reports
     (August 2015 - To Date)" dataset (data.boston.gov, CKAN). The dedicated
     Analyze Boston "Shootings" victimization dataset is also downloaded for
     the record; it carries no coordinates, so it is logged and excluded
     from mapping.
  3. Census TIGER/Line 2020 tract geometry for Suffolk County MA
     (state FIPS 25, county FIPS 025).
  4. ACS 2024 5-year tract population, poverty, and race via the Census
     Reporter API (no key required). The Census Bureau API at
     api.census.gov redirected keyless requests to missing_key.html on
     2026-09-25, so ACS 5-year replaces the 2020 decennial for population.

Integrity rules enforced here:

  * Every layer is downloaded from the named public source. No synthetic,
    modeled, or bounding-box-seeded records are written.
  * Every cache file records its source URL, fetch timestamp, and SHA-256.
  * Stop conditions: fewer than five calendar years of shooting incidents
    with coordinates, or HOLC polygons that fail validation.

Outputs: raw + cleaned caches and DATA_LOG.md in Paper/data/spatial/boston/.

Usage: python3 Paper/scripts/boston_holc_shootings.py [--force]
"""

from __future__ import annotations

import hashlib
import io
import json
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import requests

try:
    import geopandas as gpd
except ImportError:  # pragma: no cover
    sys.exit("geopandas is required: pip install geopandas")

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "Paper" / "data" / "spatial" / "boston"

HOLC_URL = (
    "https://dsl.richmond.edu/panorama/redlining/static/citiesData/"
    "MABoston1938/geojson.json"
)
HOLC_CONTEXT_PAGE = "https://dsl.richmond.edu/panorama/redlining/map/MA/Boston/context"

CKAN_PACKAGE = "crime-incident-reports-august-2015-to-date-source-new-system"
CKAN_PACKAGE_SHOW = f"https://data.boston.gov/api/3/action/package_show?id={CKAN_PACKAGE}"
DEDICATED_SHOOTINGS_URL = (
    "https://data.boston.gov/dataset/e63a37e1-be79-4722-89e6-9e7e2a3da6d1/"
    "resource/73c7e069-701f-4910-986d-b950f46c91a1/download/tmpubomdjxf.csv"
)

TIGER_URL = "https://www2.census.gov/geo/tiger/TIGER2020/TRACT/tl_2020_25_tract.zip"
CENSUS_REPORTER_URL = (
    "https://api.censusreporter.org/1.0/data/show/latest"
    "?table_ids=B01003,B17001,B02001&geo_ids=140%7C05000US25025"
)

# Rough Boston sanity envelope for coordinate validation (generous).
BOSTON_BBOX = {"lat_min": 42.15, "lat_max": 42.50, "lon_min": -71.30, "lon_max": -70.85}

TRUTHY_SHOOTING = {"1", "Y", "YES", "TRUE", "T"}

HEADERS = {"User-Agent": "boston-holc-shootings-stage1/1.0 (research data fetch)"}

FETCH_META: list[dict] = []  # provenance records for DATA_LOG.md
MANIFEST_PATH = OUT_DIR / "fetch_manifest.json"


def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def _load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        return json.loads(MANIFEST_PATH.read_text())
    return {}


def _save_manifest(manifest: dict) -> None:
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")


def download(url: str, dest: Path, label: str, force: bool = False) -> Path:
    """Fetch url to dest (skip when cached unless force). Record provenance."""
    manifest = _load_manifest()
    if dest.exists() and not force:
        entry = manifest.get(dest.name)
        if entry is None:
            # File predates the manifest: the mtime is the original fetch time.
            mtime = datetime.fromtimestamp(dest.stat().st_mtime, timezone.utc)
            entry = {
                "url": url,
                "fetched_utc": mtime.isoformat(timespec="seconds"),
                "sha256": _sha256(dest),
                "bytes": dest.stat().st_size,
            }
            manifest[dest.name] = entry
            _save_manifest(manifest)
        FETCH_META.append({"label": label, "file": dest.name, **entry})
        print(f"[cache] {label}: {dest.name} ({dest.stat().st_size:,} bytes)")
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, headers=HEADERS, timeout=300, allow_redirects=True)
    r.raise_for_status()
    dest.write_bytes(r.content)
    entry = {
        "url": url,
        "final_url": r.url,
        "fetched_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "sha256": _sha256(dest),
        "bytes": dest.stat().st_size,
    }
    manifest[dest.name] = entry
    _save_manifest(manifest)
    FETCH_META.append({"label": label, "file": dest.name, **entry})
    print(f"[fetch] {label}: {dest.name} ({dest.stat().st_size:,} bytes)")
    return dest


# ---------------------------------------------------------------------------
# Layer 1: HOLC polygons
# ---------------------------------------------------------------------------

def fetch_holc(force: bool) -> dict:
    dest = OUT_DIR / "holc_boston_1938.geojson"
    download(HOLC_URL, dest, "HOLC Boston 1938 polygons (Mapping Inequality)", force)
    gdf = gpd.read_file(dest)
    grades = sorted(g for g in gdf["grade"].dropna().unique())
    geom_types = sorted(gdf.geometry.geom_type.unique())
    area_km2 = gdf.to_crs(26986).geometry.area.sum() / 1e6
    ok = (
        len(gdf) >= 30
        and {"A", "B", "C", "D"}.issubset(set(grades))
        and set(geom_types).issubset({"Polygon", "MultiPolygon"})
    )
    info = {
        "n_polygons": len(gdf),
        "grade_counts": gdf["grade"].fillna("ungraded").value_counts().to_dict(),
        "geom_types": geom_types,
        "total_area_km2": round(area_km2, 2),
        "labels": sorted(gdf["label"].astype(str).tolist()),
        "ok": ok,
    }
    print(f"[HOLC] {len(gdf)} polygons, grades={info['grade_counts']}, area={area_km2:.1f} km2")
    return info


# ---------------------------------------------------------------------------
# Layer 2: shootings
# ---------------------------------------------------------------------------

def _cir_resources() -> dict[str, str]:
    """Map year label -> CSV download URL from the live CKAN package record."""
    r = requests.get(CKAN_PACKAGE_SHOW, headers=HEADERS, timeout=60)
    r.raise_for_status()
    out = {}
    for res in r.json()["result"]["resources"]:
        name = (res.get("name") or "").strip()
        if res.get("format") != "CSV" or not name.startswith("Crime Incident Reports"):
            continue
        out[name] = res["url"]
    return out


def _valid_coords(lat, lon) -> bool:
    try:
        la, lo = float(lat), float(lon)
    except (TypeError, ValueError):
        return False
    if la == 0.0 and lo == 0.0:
        return False
    return (
        BOSTON_BBOX["lat_min"] <= la <= BOSTON_BBOX["lat_max"]
        and BOSTON_BBOX["lon_min"] <= lo <= BOSTON_BBOX["lon_max"]
    )


def fetch_shootings(force: bool) -> dict:
    # The dedicated victimization dataset: kept for the record, no coordinates.
    dedicated = OUT_DIR / "shootings_victimizations_no_coordinates.csv"
    download(DEDICATED_SHOOTINGS_URL, dedicated,
             "Analyze Boston 'Shootings' victimization dataset (no coordinates)", force)
    ded = pd.read_csv(dedicated)
    ded_years = sorted(pd.to_datetime(ded["shooting_date"], utc=True).dt.year.unique())

    resources = _cir_resources()
    raw_frames = []
    per_source_rows = {}
    for name, url in sorted(resources.items()):
        safe = name.replace("Crime Incident Reports - ", "").replace(" ", "_").lower()
        dest = OUT_DIR / f"cir_{safe}.csv"
        download(url, dest, f"Crime Incident Reports: {name}", force)
        df = pd.read_csv(dest, dtype=str, low_memory=False)
        per_source_rows[name] = len(df)
        flag = df["SHOOTING"].fillna("").str.strip().str.upper()
        shot = df[flag.isin(TRUTHY_SHOOTING)].copy()
        raw_frames.append(shot)

    raw = pd.concat(raw_frames, ignore_index=True)
    raw.to_csv(OUT_DIR / "shootings_raw.csv", index=False)

    # Clean: one row per incident, real coordinates required for mapping.
    raw["lat"] = pd.to_numeric(raw["Lat"], errors="coerce")
    raw["lon"] = pd.to_numeric(raw["Long"], errors="coerce")
    raw["coords_valid"] = [_valid_coords(a, b) for a, b in zip(raw["lat"], raw["lon"])]
    # 2015-2022 files carry naive local timestamps; 2023+ appends "+00". The HOUR
    # column matches the naive part (e.g. "22:44:00+00" with HOUR=22), so the
    # suffix is a formatting artifact; strip it and treat all times as local.
    raw["date"] = pd.to_datetime(
        raw["OCCURRED_ON_DATE"].astype(str).str.replace(r"\+00$", "", regex=True),
        errors="coerce",
    )
    raw["year"] = raw["YEAR"].astype(str).str.extract(r"(\d{4})")[0].astype("Int64")

    # Prefer coordinate-bearing rows when an incident has several flagged rows.
    raw_sorted = raw.sort_values("coords_valid", ascending=False)
    clean = raw_sorted.drop_duplicates(subset="INCIDENT_NUMBER", keep="first").copy()
    clean = clean.sort_values(["date", "INCIDENT_NUMBER"])
    clean_out = clean[
        ["INCIDENT_NUMBER", "date", "year", "DISTRICT", "OFFENSE_CODE",
         "OFFENSE_DESCRIPTION", "lat", "lon", "coords_valid"]
    ].rename(columns=str.lower)
    clean_out.to_csv(OUT_DIR / "shootings_clean.csv", index=False)

    per_year = (
        clean.groupby("year")["coords_valid"]
        .agg(incidents="count", with_coords="sum")
        .reset_index()
    )
    per_year["no_coords"] = per_year["incidents"] - per_year["with_coords"]
    per_year.to_csv(OUT_DIR / "shootings_per_year_coverage.csv", index=False)

    mapped = clean[clean["coords_valid"]]
    info = {
        "dedicated_rows": len(ded),
        "dedicated_years": [int(y) for y in ded_years],
        "cir_source_row_counts": per_source_rows,
        "flagged_rows": len(raw),
        "unique_incidents": len(clean),
        "incidents_with_coords": int(mapped.shape[0]),
        "incidents_no_coords": int((~clean["coords_valid"]).sum()),
        "dates_unparsed": int(clean["date"].isna().sum()),
        "date_min": str(clean["date"].min()),
        "date_max": str(clean["date"].max()),
        "per_year": per_year.to_dict(orient="records"),
        "year_range": [int(clean["year"].min()), int(clean["year"].max())],
        "ok": int((per_year["with_coords"] >= 10).sum()) >= 5,
    }
    print(
        f"[shootings] {info['unique_incidents']} unique incidents, "
        f"{info['incidents_with_coords']} with valid coords, "
        f"years {info['year_range'][0]}-{info['year_range'][1]}"
    )
    return info


# ---------------------------------------------------------------------------
# Layer 3: tract geometry + ACS population
# ---------------------------------------------------------------------------

def fetch_tracts_and_acs(force: bool) -> dict:
    tiger_zip = OUT_DIR / "tl_2020_25_tract.zip"
    download(TIGER_URL, tiger_zip, "TIGER/Line 2020 tracts, Massachusetts (state 25)", force)
    with zipfile.ZipFile(io.BytesIO(tiger_zip.read_bytes())) as zf:
        zf.extractall(OUT_DIR / "tiger_25")
    tracts = gpd.read_file(OUT_DIR / "tiger_25" / "tl_2020_25_tract.shp")
    suffolk = tracts[tracts["COUNTYFP"] == "025"].copy()
    suffolk.to_parquet(OUT_DIR / "tiger_tracts_25025.parquet")

    cr_dest = OUT_DIR / "censusreporter_acs_25025.json"
    download(CENSUS_REPORTER_URL, cr_dest, "Census Reporter ACS 5-year, Suffolk County tracts", force)
    cr = json.loads(cr_dest.read_text())
    release = cr["release"]["name"]
    rows = []
    for geoid, tables in cr["data"].items():
        est = lambda t, v: tables[t]["estimate"].get(f"{t}{v}")  # noqa: E731
        pop = est("B01003", "001")
        pov_univ, pov_below = est("B17001", "001"), est("B17001", "002")
        race_total, black = est("B02001", "001"), est("B02001", "003")
        rows.append(
            {
                "GEOID": geoid.replace("14000US", ""),
                "name": cr["geography"][geoid]["name"],
                "population": pop,
                "poverty_universe": pov_univ,
                "poverty_below": pov_below,
                "poverty_rate": (pov_below / pov_univ) if pov_univ else None,
                "race_total": race_total,
                "black": black,
                "pct_black": (black / race_total) if race_total else None,
            }
        )
    acs = pd.DataFrame(rows)
    acs.to_csv(OUT_DIR / "acs_2024_5yr_25025.csv", index=False)

    joined = suffolk.merge(acs, on="GEOID", how="left")
    pop_total = float(acs["population"].sum())
    info = {
        "tiger_tracts_state25": len(tracts),
        "suffolk_tracts": len(suffolk),
        "acs_release": release,
        "acs_tracts": len(acs),
        "acs_unmatched_tracts": int(joined["population"].isna().sum()),
        "suffolk_population_total": pop_total,
        "ok": len(suffolk) >= 200 and 600_000 <= pop_total <= 1_100_000
        and int(joined["population"].isna().sum()) == 0,
    }
    print(
        f"[tracts] Suffolk County: {len(suffolk)} tracts, ACS {release}, "
        f"population total {pop_total:,.0f}, unmatched {info['acs_unmatched_tracts']}"
    )
    return info


# ---------------------------------------------------------------------------
# DATA_LOG.md
# ---------------------------------------------------------------------------

def write_data_log(holc: dict, shot: dict, tracts: dict) -> None:
    lines = []
    add = lines.append
    add("# Boston HOLC x Shootings — Stage 1 Data Log")
    add("")
    add(f"Generated by `Paper/scripts/boston_holc_shootings.py` on "
        f"{datetime.now(timezone.utc).isoformat(timespec='seconds')}.")
    add("")
    add("Every layer below was downloaded from the named public source on the recorded "
        "date. This stage wrote no synthetic, modeled, or bounding-box-seeded records.")
    add("")
    add("## Files and provenance")
    add("")
    add("| file | source | fetched (UTC) | bytes | sha256 |")
    add("|---|---|---|---|---|")
    for m in FETCH_META:
        add(f"| `{m['file']}` | {m['url']} | {m['fetched_utc']} | {m['bytes']:,} | `{m['sha256'][:16]}…` |")
    add("")
    add("Fetch timestamps persist in `fetch_manifest.json`, so cached re-runs keep the "
        "original download date.")
    add("")
    add("## HOLC polygons (1938 Boston)")
    add("")
    add(f"- Source: Mapping Inequality, University of Richmond Digital Scholarship Lab, "
        f"per-city export `{HOLC_URL}` (map context page: {HOLC_CONTEXT_PAGE}).")
    add(f"- Polygons: {holc['n_polygons']}; grade counts: {holc['grade_counts']}.")
    add(f"- Geometry types: {holc['geom_types']}; total mapped area "
        f"{holc['total_area_km2']} km² (EPSG:26986).")
    add(f"- Area labels: {', '.join(holc['labels'])}.")
    add("- The `Commercial` and `Industrial` polygons carry no letter grade and are "
        "treated as ungraded in any downstream analysis.")
    add("")
    add("## Shootings")
    add("")
    add("- Source used for mapping: Analyze Boston (data.boston.gov) dataset "
      "\"Crime Incident Reports (August 2015 - To Date) (Source: New System)\", "
      "CKAN package id `crime-incident-reports-august-2015-to-date-source-new-system`. "
      "Rows with `SHOOTING` in {1, Y, YES, TRUE, T} are shooting incidents; each row "
      "carries `OCCURRED_ON_DATE`, `Lat`, and `Long`. Resource URLs were read from the "
      "live CKAN package record on the fetch date.")
    add(f"- The dedicated Analyze Boston \"Shootings\" victimization dataset "
        f"({shot['dedicated_rows']} rows, years "
        f"{min(shot['dedicated_years'])}–{max(shot['dedicated_years'])}) carries no "
        "coordinate columns, so it is cached for the record "
        "(`shootings_victimizations_no_coordinates.csv`) and excluded from mapping.")
    add(f"- Crime Incident Report source rows scanned per file: {shot['cir_source_row_counts']}.")
    add(f"- Flagged offense rows: {shot['flagged_rows']:,}; unique shooting incidents "
        f"after de-duplication on `INCIDENT_NUMBER`: {shot['unique_incidents']:,}.")
    add(f"- Incidents with valid coordinates inside the Boston envelope: "
        f"{shot['incidents_with_coords']:,}; incidents dropped from maps for missing or "
        f"invalid coordinates: {shot['incidents_no_coords']:,}.")
    add("")
    add("Coordinate coverage per year (incident level):")
    add("")
    add("| year | incidents | with coordinates | without coordinates |")
    add("|---|---|---|---|")
    for r in shot["per_year"]:
        add(f"| {r['year']} | {r['incidents']} | {r['with_coords']} | {r['no_coords']} |")
    add("")
    add("## Tract geometry and population")
    add("")
    add(f"- Geometry: Census TIGER/Line 2020 tract shapes (`{TIGER_URL}`), filtered to "
        f"Suffolk County (state FIPS 25, county FIPS 025): {tracts['suffolk_tracts']} of "
        f"{tracts['tiger_tracts_state25']} Massachusetts tracts.")
    add(f"- Population and controls: Census Reporter API, release "
        f"\"{tracts['acs_release']}\", tables B01003 (population), B17001 (poverty "
        f"status), B02001 (race) for {tracts['acs_tracts']} Suffolk County tracts "
        f"(`{CENSUS_REPORTER_URL}`). ACS 5-year replaces the 2020 decennial because "
        "api.census.gov redirected keyless requests to missing_key.html on the fetch "
        "date. Suffolk County population total in this release: "
        f"{tracts['suffolk_population_total']:,.0f}. Tracts without an ACS match: "
        f"{tracts['acs_unmatched_tracts']}.")
    add("")
    add("## Gaps and caveats")
    add("")
    add(f"- Incident dates run from {shot['date_min']} to {shot['date_max']}. The 2015 "
        "file begins in June (the new records system began in mid-2015) and the most "
        "recent year is year-to-date at the fetch date; both are partial years.")
    add(f"- Incidents with an unparseable date after cleaning: {shot['dates_unparsed']}. "
        "The 2023-and-later source file appends a `+00` suffix to timestamps; the HOUR "
        "column matches the naive part, so the suffix is a formatting artifact and all "
        "timestamps are treated as local wall time.")
    add("- Flagged incident counts per year rise from 170 in 2018 to 810 in 2019 and "
        "remain at the higher level through 2025. This discontinuity points to a "
        "flagging or recording practice change around 2019; period comparisons across "
        "that boundary carry that caveat.")
    add("- Coordinates are validated against a generous Boston envelope "
        f"({BOSTON_BBOX}); rows failing validation are dropped from maps and counted "
        "above.")
    add("- HOLC coverage reflects the 1938 survey map. Parts of the present city outside "
        "the mapped area are unmapped, which says nothing about their 1938 grade.")
    add("- Shooting incidents are incident reports flagged by BPD. Counts measure "
        "recorded incidents, which follow reporting and recording practice.")
    add("")
    (OUT_DIR / "DATA_LOG.md").write_text("\n".join(lines) + "\n")
    print(f"[log] wrote {OUT_DIR / 'DATA_LOG.md'}")


def main() -> int:
    force = "--force" in sys.argv
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    holc = fetch_holc(force)
    shot = fetch_shootings(force)
    tracts = fetch_tracts_and_acs(force)
    write_data_log(holc, shot, tracts)
    failures = [name for name, ok in
                [("HOLC", holc["ok"]), ("shootings", shot["ok"]), ("tracts/ACS", tracts["ok"])]
                if not ok]
    if failures:
        print(f"STOP: validation failed for: {', '.join(failures)}")
        return 1
    print("Stage 1 validation passed: real HOLC polygons, >=5 years of geocoded shootings, tract population complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
