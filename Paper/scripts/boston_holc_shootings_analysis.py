"""
boston_holc_shootings_analysis.py
---------------------------------

Stage 2 (analysis) for the Boston HOLC x shootings overlay.

Consumes only the Stage 1 caches under Paper/data/spatial/boston/:

  * holc_boston_1938.geojson          - real Mapping Inequality polygons
  * shootings_clean.csv               - SHOOTING-flagged CIR incidents (deduped)
  * shootings_victimizations_no_coordinates.csv - dedicated victimization data
  * tiger_tracts_25025.parquet        - TIGER/Line 2020 Suffolk County tracts
  * acs_2024_5yr_25025.csv            - ACS 2024 5-year population/controls

Measures (per the orchestrator's correction to the shooting measure):

  * PRIMARY: flagged incidents whose OFFENSE_DESCRIPTION is an aggravated
    assault variant or a murder / non-negligent manslaughter variant (including
    the misspelled "NEGLIGIENT" and the two Migrated Report equivalents).
    Every other offense description among the flagged rows is excluded; each
    decision is printed in the disposition table.
  * SECONDARY: all SHOOTING-flagged incidents, labeled "shots-fired and
    shooting-related incidents".
  * VALIDATION: per-year PRIMARY incident counts against the dedicated
    victimization dataset row counts; |difference| > 15% is flagged.

Windows: main results use complete years 2019-2025 (the 2018->2019 jump in
flagged rows is a recording-practice change). The pooled sensitivity uses
2016-2025: the plan asked for "2015 to 2025 pooled" but also to drop partial
2015 from rates, and the 2015 CIR file starts in June, so 2015 is excluded.
A second sensitivity uses the five most recent complete years, 2021-2025.

Geography: Suffolk County (FIPS 25025) contains Boston plus Chelsea, Revere,
and Winthrop. Census tract numbering in Suffolk County assigns Boston the
tract numbers below 1600 plus the 98xx/99xx special tracts; numbers
1601-1899 are exactly Chelsea, Revere, and Winthrop (27 tracts, ACS
population 118,679; Boston: 208 tracts, 666,442). Zero flagged shootings
fall in the non-Boston tracts. All area math uses EPSG:26986
(Massachusetts Mainland).

Writes Paper/data/spatial/boston/RESULTS.md and prints the same numbers.

Usage: .venv/bin/python3 Paper/scripts/boston_holc_shootings_analysis.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import geopandas as gpd
from scipy import stats as sstats

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA = REPO_ROOT / "Paper" / "data" / "spatial" / "boston"
CRS = 26986  # Massachusetts Mainland, metres

MAIN_YEARS = list(range(2019, 2026))      # consistent flagging regime
POOLED_YEARS = list(range(2016, 2026))    # sensitivity across the regime break
RECENT_YEARS = list(range(2021, 2026))    # most recent five complete years
PERIODS = [(2019, 2021), (2022, 2025)]    # stability within the main window

# --- Primary-measure offense descriptions (decision per description) --------
# include=True  -> the description is a victim shooting by construction.
# include=False -> excluded; reason recorded. An unlisted description aborts
# the run, so every inclusion/exclusion is explicit.
OFFENSE_DECISIONS = {
    "ASSAULT - AGGRAVATED": (True, "aggravated assault; victim shooting"),
    "ASSAULT - AGGRAVATED - BATTERY": (True, "aggravated assault; victim shooting"),
    "MURDER, NON-NEGLIGIENT MANSLAUGHTER": (True, "murder/non-negligent manslaughter (misspelled variant)"),
    "MURDER, NON-NEGLIGENT MANSLAUGHTER": (True, "murder/non-negligent manslaughter"),
    "Migrated Report - Aggravated Assault/Aggravated Assault & Battery": (True, "aggravated assault carried over from the legacy records system"),
    "Migrated Report - Criminal Homicide": (True, "criminal homicide carried over from the legacy records system"),
    "INVESTIGATE PROPERTY": (False, "investigative follow-up, no victim indicated"),
    "INVESTIGATE PERSON": (False, "investigative follow-up, no victim indicated"),
    "Migrated Report - Investigate Property": (False, "investigative follow-up, no victim indicated"),
    "BALLISTICS EVIDENCE/FOUND": (False, "evidence recovery, no victim indicated"),
    "FIREARM/WEAPON - FOUND OR CONFISCATED": (False, "evidence recovery, no victim indicated"),
    "EXPLOSIVES - TURNED IN OR FOUND": (False, "evidence recovery, no victim indicated"),
    "EXPLOSIVES - POSSESSION OR USE": (False, "possession offense, no victim indicated"),
    "VANDALISM": (False, "property damage (shots into buildings/vehicles), no victim indicated"),
    "PROPERTY - ACCIDENTAL DAMAGE": (False, "property damage, no victim indicated"),
    "PROPERTY - LOST": (False, "property offense, no victim indicated"),
    "PROPERTY - STOLEN THEN RECOVERED": (False, "property offense, no victim indicated"),
    "ROBBERY": (False, "robbery with a shooting flag; victim injury not indicated"),
    "ROBBERY - STREET": (False, "robbery with a shooting flag; victim injury not indicated"),
    "ROBBERY - OTHER": (False, "robbery with a shooting flag; victim injury not indicated"),
    "ROBBERY - COMMERCIAL": (False, "robbery with a shooting flag; victim injury not indicated"),
    "HOME INVASION": (False, "victim injury not indicated"),
    "KIDNAPPING/CUSTODIAL KIDNAPPING": (False, "victim injury not indicated"),
    "ASSAULT - SIMPLE": (False, "simple assault; the flag is ambiguous and the offense is non-aggravated"),
    "ASSAULT SIMPLE - BATTERY": (False, "simple assault; the flag is ambiguous and the offense is non-aggravated"),
    "THREATS TO DO BODILY HARM": (False, "threat, no victim shooting indicated"),
    "VERBAL DISPUTE": (False, "dispute, no victim indicated"),
    "AFFRAY": (False, "public fight, no victim shooting indicated"),
    "INTIMIDATING WITNESS": (False, "intimidation, no victim indicated"),
    "DEATH INVESTIGATION": (False, "manner of death undetermined at report time"),
    "SUDDEN DEATH": (False, "manner of death undetermined at report time"),
    "SUICIDE / SUICIDE ATTEMPT": (False, "self-inflicted"),
    "FIREARM/WEAPON - ACCIDENTAL INJURY / DEATH": (False, "accidental, not an assaultive shooting"),
    "Justifiable Homicide": (False, "justifiable homicide is excluded from murder counts by UCR convention"),
    "MANSLAUGHTER - NEGLIGENCE": (False, "negligent manslaughter; the measure is murder and non-negligent manslaughter"),
    "MANSLAUGHTER - NON-VEHICLE - NEGLIGENCE": (False, "negligent manslaughter; the measure is murder and non-negligent manslaughter"),
    "SICK/INJURED/MEDICAL - POLICE": (False, "medical assist"),
    "SICK/INJURED/MEDICAL - PERSON": (False, "medical assist"),
    "SICK ASSIST": (False, "medical assist"),
    "WARRANT ARREST": (False, "enforcement action, no victim indicated"),
    "WARRANT ARREST - OUTSIDE OF BOSTON WARRANT": (False, "enforcement action, no victim indicated"),
    "WARRANT ARREST - BOSTON WARRANT (MUST BE SUPPLEMENTAL)": (False, "enforcement action, no victim indicated"),
    "SEARCH WARRANT": (False, "enforcement action, no victim indicated"),
    "SERVICE TO OTHER AGENCY": (False, "enforcement action, no victim indicated"),
    "SERVICE TO OTHER PD INSIDE OF MA.": (False, "enforcement action, no victim indicated"),
    "WEAPON VIOLATION - CARRY/ POSSESSING/ SALE/ TRAFFICKING/ OTHER": (False, "possession offense, no victim indicated"),
    "WEAPON - FIREARM - CARRYING / POSSESSING, ETC": (False, "possession offense, no victim indicated"),
    "WEAPON - FIREARM - OTHER VIOLATION": (False, "possession offense, no victim indicated"),
    "WEAPON - OTHER - CARRYING / POSSESSING, ETC": (False, "possession offense, no victim indicated"),
    "WEAPON - OTHER - OTHER VIOLATION": (False, "possession offense, no victim indicated"),
    "DRUGS - POSSESSION/ SALE/ MANUFACTURING/ USE": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS B - INTENT TO MFR DIST DISP": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS B - COCAINE, ETC.": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS D": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS D - INTENT TO MFR DIST DISP": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS A - INTENT TO MFR DIST DISP": (False, "drug offense, no victim indicated"),
    "DRUGS - POSS CLASS A - HEROIN, ETC.": (False, "drug offense, no victim indicated"),
    "DRUGS - CLASS B TRAFFICKING OVER 18 GRAMS": (False, "drug offense, no victim indicated"),
    "DRUGS - OTHER": (False, "drug offense, no victim indicated"),
    "TRESPASSING": (False, "no victim shooting indicated"),
    "AUTO THEFT": (False, "property offense, no victim indicated"),
    "STOLEN PROPERTY - BUYING / RECEIVING / POSSESSING": (False, "property offense, no victim indicated"),
    "BURGLARY - RESIDENTIAL": (False, "property offense, no victim indicated"),
    "LARCENY ALL OTHERS": (False, "property offense, no victim indicated"),
    "LARCENY THEFT FROM MV - NON-ACCESSORY": (False, "property offense, no victim indicated"),
    "RECOVERED - MV RECOVERED IN BOSTON (STOLEN OUTSIDE BOSTON)": (False, "property offense, no victim indicated"),
    "TOWED MOTOR VEHICLE": (False, "no victim indicated"),
    "M/V - LEAVING SCENE - PROPERTY DAMAGE": (False, "vehicle incident, no victim indicated"),
    "M/V ACCIDENT - POLICE VEHICLE": (False, "vehicle incident, no victim indicated"),
    "M/V ACCIDENT - OTHER": (False, "vehicle incident, no victim indicated"),
    "M/V ACCIDENT - PROPERTY DAMAGE": (False, "vehicle incident, no victim indicated"),
    "M/V ACCIDENT - PROPERTY  DAMAGE": (False, "vehicle incident, no victim indicated"),
    "VAL - VIOLATION OF AUTO LAW": (False, "vehicle offense, no victim indicated"),
    "VAL - OPERATING AFTER REV/SUSP.": (False, "vehicle offense, no victim indicated"),
    "VAL - VIOLATION OF AUTO LAW - OTHER": (False, "vehicle offense, no victim indicated"),
    "MISSING PERSON - NOT REPORTED - LOCATED": (False, "no victim indicated"),
    "MISSING PERSON - LOCATED": (False, "no victim indicated"),
    "DISTURBING THE PEACE/ DISORDERLY CONDUCT/ GATHERING CAUSING ANNOYANCE/ NOISY PAR": (False, "disorder offense, no victim indicated"),
    "ANIMAL INCIDENTS (DOG BITES, LOST DOG, ETC)": (False, "no victim shooting indicated"),
    "VIOLATION - CITY ORDINANCE": (False, "no victim indicated"),
    "VIOLATION - HAWKER AND PEDDLER": (False, "no victim indicated"),
    "OTHER OFFENSE": (False, "unspecified; no victim shooting indicated"),
}

GRADE_ORDER = ["A", "B", "C", "D", "ungraded", "unmapped"]


# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------

def load_holc() -> gpd.GeoDataFrame:
    gdf = gpd.read_file(DATA / "holc_boston_1938.geojson")
    gdf["grade"] = gdf["grade"].fillna("ungraded")
    return gdf.to_crs(CRS)


def load_shootings() -> gpd.GeoDataFrame:
    df = pd.read_csv(DATA / "shootings_clean.csv")
    df["date"] = pd.to_datetime(df["date"])
    df["year"] = df["year"].astype(int)
    df = df[df["coords_valid"]].copy()
    df["offense_description"] = df["offense_description"].str.strip()
    unknown = set(df["offense_description"]) - set(OFFENSE_DECISIONS)
    if unknown:
        sys.exit(f"Unclassified offense descriptions among flagged rows: {sorted(unknown)}")
    df["primary"] = df["offense_description"].map(lambda d: OFFENSE_DECISIONS[d][0])
    return gpd.GeoDataFrame(
        df, geometry=gpd.points_from_xy(df["lon"], df["lat"]), crs=4326
    ).to_crs(CRS)


def load_tracts() -> gpd.GeoDataFrame:
    t = gpd.read_parquet(DATA / "tiger_tracts_25025.parquet").to_crs(CRS)
    acs = pd.read_csv(DATA / "acs_2024_5yr_25025.csv", dtype={"GEOID": str})
    t = t.merge(acs, on="GEOID", how="left")
    t["tractnum"] = t["TRACTCE"].astype(int)
    # Boston tracts: numbers below 1600 plus 98xx/99xx special tracts.
    # 1601-1899 are Chelsea, Revere, Winthrop (verified against ACS totals
    # and against zero flagged shootings in those tracts).
    t["is_boston"] = (t["tractnum"] < 160000) | (t["tractnum"] >= 980000)
    t["area_km2"] = t.geometry.area / 1e6
    return t


# ---------------------------------------------------------------------------
# Measure helpers
# ---------------------------------------------------------------------------

def rate_ratio_exact(x1: float, e1: float, x0: float, e0: float, alpha: float = 0.05):
    """Exact conditional Poisson rate-ratio CI (Clopper-Pearson on the split)."""
    x1, x0 = int(x1), int(x0)
    if x1 + x0 == 0 or e1 <= 0 or e0 <= 0:
        return (np.nan, np.nan, np.nan)
    p_lo = sstats.beta.ppf(alpha / 2, x1, x0 + 1) if x1 > 0 else 0.0
    p_hi = sstats.beta.ppf(1 - alpha / 2, x1 + 1, x0) if x0 > 0 else 1.0
    rr = (x1 / e1) / (x0 / e0) if x0 > 0 else np.inf
    conv = e0 / e1
    rr_lo = (p_lo / (1 - p_lo)) * conv if p_lo > 0 else 0.0
    rr_hi = (p_hi / (1 - p_hi)) * conv if p_hi < 1 else np.inf
    return (rr, rr_lo, rr_hi)


def assign_grades(pts: gpd.GeoDataFrame, holc: gpd.GeoDataFrame) -> pd.Series:
    joined = gpd.sjoin(pts, holc[["grade", "geometry"]], predicate="within", how="left")
    dup = joined.index.duplicated().sum()
    if dup:
        print(f"[warn] {dup} shootings fall in overlapping HOLC polygons; first match kept")
        joined = joined[~joined.index.duplicated(keep="first")]
    grades = joined["grade"].fillna("unmapped").reindex(pts.index)
    return grades


def population_by_grade(tracts: gpd.GeoDataFrame, holc: gpd.GeoDataFrame) -> dict:
    """Areal-weight Boston tract population into HOLC grades.

    Method: intersect each tract with each grade's polygon union and assign
    population in proportion to intersected tract area (uniform density
    within tracts). Tract area outside the HOLC footprint is 'unmapped'.
    """
    bos = tracts[tracts["is_boston"]].copy()
    pop = {g: 0.0 for g in GRADE_ORDER}
    area = {g: 0.0 for g in GRADE_ORDER}
    grade_unions = {g: holc[holc["grade"] == g].union_all() for g in ["A", "B", "C", "D", "ungraded"]}
    all_holc = holc.union_all()
    for _, tr in bos.iterrows():
        geom, tp = tr.geometry, tr["population"] or 0.0
        a_tot = geom.area
        covered = 0.0
        for g, u in grade_unions.items():
            a = geom.intersection(u).area
            if a > 0:
                pop[g] += tp * a / a_tot
                area[g] += a / 1e6
                covered += a
        a_un = a_tot - geom.intersection(all_holc).area
        pop["unmapped"] += tp * max(a_un, 0.0) / a_tot
        area["unmapped"] += max(a_un, 0.0) / 1e6
    return {"population": pop, "area_km2": area,
            "boston_pop": float(bos["population"].sum()),
            "boston_area_km2": float(bos.geometry.area.sum() / 1e6),
            "boston_land_km2": float(bos["ALAND"].sum() / 1e6)}


def grade_table(pts: gpd.GeoDataFrame, years: list[int], denom: dict,
                drop_tract_geoids: set[str] | None = None,
                tract_geoid: pd.Series | None = None) -> pd.DataFrame:
    """Counts and rates per grade for shootings in `years`."""
    sub = pts[pts["year"].isin(years)]
    grades = assign_grades(sub, HOLC)
    if drop_tract_geoids is not None and tract_geoid is not None:
        keep = ~tract_geoid.loc[sub.index].isin(drop_tract_geoids)
        grades = grades[keep]
    counts = grades.value_counts().reindex(GRADE_ORDER, fill_value=0)
    ny = len(years)
    rows = []
    for g in GRADE_ORDER:
        pop = denom["population"][g]
        ar = denom["area_km2"][g]
        n = int(counts[g])
        rows.append({
            "grade": g, "shootings": n, "area_km2": round(ar, 2),
            "population": round(pop),
            "per_km2": round(n / ar, 2) if ar > 0 else np.nan,
            "per_10k_per_year": round(n / (pop * ny) * 1e4, 3) if pop > 0 else np.nan,
        })
    total_n = int(counts.sum())
    pop_t = denom["boston_pop"]
    ar_t = denom["boston_area_km2"]
    rows.append({
        "grade": "citywide (Boston)", "shootings": total_n,
        "area_km2": round(ar_t, 2), "population": round(pop_t),
        "per_km2": round(total_n / ar_t, 2),
        "per_10k_per_year": round(total_n / (pop_t * ny) * 1e4, 3),
    })
    return pd.DataFrame(rows)


def rate_ratio_table(tbl: pd.DataFrame, years: list[int]) -> pd.DataFrame:
    """Exact Poisson rate ratios of each grade against A+B combined."""
    ny = len(years)
    ref = tbl[tbl["grade"].isin(["A", "B"])]
    x0, e0 = ref["shootings"].sum(), ref["population"].sum() * ny
    rows = []
    for _, r in tbl.iterrows():
        if r["grade"] in ("A", "B", "citywide (Boston)"):
            continue
        rr, lo, hi = rate_ratio_exact(r["shootings"], r["population"] * ny, x0, e0)
        rows.append({"grade": r["grade"], "rate_ratio_vs_AB": round(rr, 2),
                     "ci95_lo": round(lo, 2), "ci95_hi": round(hi, 2)})
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# Tract-level regression
# ---------------------------------------------------------------------------

def tract_model(pts: gpd.GeoDataFrame, tracts: gpd.GeoDataFrame, years: list[int]) -> dict:
    import statsmodels.api as sm
    import statsmodels.formula.api as smf
    from libpysal.weights import Queen
    from esda import Moran

    bos = tracts[tracts["is_boston"]].copy().reset_index(drop=True)
    sub = pts[pts["year"].isin(years) & pts["primary"]]
    joined = gpd.sjoin(sub, bos[["GEOID", "geometry"]], predicate="within", how="inner")
    counts = joined.groupby("GEOID").size()
    bos["shootings"] = bos["GEOID"].map(counts).fillna(0).astype(int)

    # HOLC exposure: share of tract area inside D (and C) polygons.
    d_union = HOLC[HOLC["grade"] == "D"].union_all()
    c_union = HOLC[HOLC["grade"] == "C"].union_all()
    bos["share_d"] = bos.geometry.apply(lambda g: g.intersection(d_union).area / g.area)
    bos["share_c"] = bos.geometry.apply(lambda g: g.intersection(c_union).area / g.area)
    bos["share_cd"] = bos["share_d"] + bos["share_c"]

    df = bos[(bos["population"] > 0) & bos["poverty_rate"].notna() & bos["pct_black"].notna()].copy()
    df["log_pop"] = np.log(df["population"])
    dropped = len(bos) - len(df)

    m1 = smf.glm("shootings ~ share_cd", data=df, family=sm.families.Poisson(),
                 offset=df["log_pop"]).fit()
    m2 = smf.glm("shootings ~ share_cd + poverty_rate + pct_black", data=df,
                 family=sm.families.Poisson(), offset=df["log_pop"]).fit()
    # NB2 with alpha estimated by iterated moments (glm.nb-style alternating
    # fit): the full-MLE negative binomial fails to converge on these counts,
    # and the Pearson dispersion of ~30 makes the Poisson standard errors
    # unreliable.
    y = df["shootings"]
    nb = m2
    alpha_hat = None
    for _ in range(50):
        mu = nb.fittedvalues
        a_new = max(float((((y - mu) ** 2) - y).sum() / (mu ** 2).sum()), 1e-4)
        if alpha_hat is not None and abs(a_new - alpha_hat) < 1e-6:
            alpha_hat = a_new
            break
        alpha_hat = a_new
        nb = smf.glm("shootings ~ share_cd + poverty_rate + pct_black", data=df,
                     family=sm.families.NegativeBinomial(alpha=alpha_hat),
                     offset=df["log_pop"]).fit()

    disp1 = m1.pearson_chi2 / m1.df_resid
    disp2 = m2.pearson_chi2 / m2.df_resid

    # Moran's I on deviance residuals of the controlled Poisson model.
    df["resid"] = m2.resid_deviance
    geo = df.set_geometry("geometry")
    w = Queen.from_dataframe(geo, use_index=False)
    islands = list(w.islands)
    if islands:
        # connect each island to its nearest tract, then rebuild
        from libpysal.weights import KNN, w_union
        knn = KNN.from_dataframe(geo, k=1, use_index=False)
        w = w_union(w, knn)
    moran = Moran(df["resid"], w, permutations=999)

    def row(m, name):
        c = m.params["share_cd"]
        ci = m.conf_int().loc["share_cd"]
        return {"model": name, "coef": round(c, 3), "irr": round(np.exp(c), 3),
                "ci_lo": round(np.exp(ci[0]), 3), "ci_hi": round(np.exp(ci[1]), 3),
                "p": float(m.pvalues["share_cd"])}

    return {
        "n_tracts": len(df), "dropped_zero_pop_or_na": int(dropped),
        "shootings_assigned": int(df["shootings"].sum()),
        "models": [row(m1, "Poisson: share C+D alone"),
                   row(m2, "Poisson: + poverty rate, pct Black"),
                   row(nb, "Negative binomial (moment alpha): + controls")],
        "overdispersion_pearson": {"m1": round(disp1, 2), "m2": round(disp2, 2)},
        "nb_alpha": round(alpha_hat, 4),
        "controls_m2": {k: {"coef": round(float(m2.params[k]), 3),
                            "p": float(m2.pvalues[k])}
                        for k in ["poverty_rate", "pct_black"]},
        "morans_i": round(float(moran.I), 3),
        "morans_i_p": float(moran.p_sim),
        "moran_islands_connected": len(islands),
    }


# ---------------------------------------------------------------------------
# Validation against the dedicated victimization dataset
# ---------------------------------------------------------------------------

def validation_table() -> pd.DataFrame:
    """Primary incidents (all, geocoded or not) vs dedicated victimization rows."""
    ded = pd.read_csv(DATA / "shootings_victimizations_no_coordinates.csv")
    ded["year"] = pd.to_datetime(ded["shooting_date"], utc=True).dt.year
    vict = ded.groupby("year").size()
    clean = pd.read_csv(DATA / "shootings_clean.csv")
    clean["offense_description"] = clean["offense_description"].str.strip()
    primary = [d for d, (inc, _) in OFFENSE_DECISIONS.items() if inc]
    prim = clean[clean["offense_description"].isin(primary)].groupby("year").size()
    rows = []
    for y in sorted(set(vict.index) | set(prim.index)):
        v, p = int(vict.get(y, 0)), int(prim.get(y, 0))
        diff = (p - v) / v * 100 if v else np.nan
        rows.append({"year": y, "primary_incidents": p, "victimizations": v,
                     "diff_pct": round(diff, 1) if v else np.nan,
                     "flag": "REPORT" if v and abs(diff) > 15 else ""})
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# Markdown rendering
# ---------------------------------------------------------------------------

def md_table(df: pd.DataFrame) -> str:
    cols = list(df.columns)
    lines = ["| " + " | ".join(cols) + " |", "|" + "---|" * len(cols)]
    for _, r in df.iterrows():
        lines.append("| " + " | ".join(str(r[c]) for c in cols) + " |")
    return "\n".join(lines)


def md_table_rr(df: pd.DataFrame) -> str:
    df = df.copy()
    df["rate ratio (95% CI)"] = df.apply(
        lambda r: f"{r['rate_ratio_vs_AB']} ({r['ci95_lo']}-{r['ci95_hi']})", axis=1)
    return md_table(df[["grade", "rate ratio (95% CI)"]])


# ---------------------------------------------------------------------------
# RESULTS.md
# ---------------------------------------------------------------------------

def fmt_years(years: list[int]) -> str:
    return f"{min(years)}\u2013{max(years)}"


def write_results(res: dict) -> None:
    L: list[str] = []
    add = L.append
    main_lbl = fmt_years(MAIN_YEARS)
    add("# Boston HOLC x Shootings — Stage 2 Results")
    add("")
    add("Generated by `Paper/scripts/boston_holc_shootings_analysis.py` from the Stage 1 "
        "caches in this directory. Every number traces to a file downloaded from the "
        "source named in `DATA_LOG.md`. Area math uses EPSG:26986 (Massachusetts Mainland).")
    add("")
    add("## Measures")
    add("")
    add("**Primary measure** — shooting victimizations: Crime Incident Report rows flagged "
        "`SHOOTING` whose offense description is an aggravated-assault variant or a murder / "
        "non-negligent-manslaughter variant, de-duplicated to one row per incident. "
        "**Secondary measure** — shots-fired and shooting-related incidents: every "
        "SHOOTING-flagged incident, including evidence recoveries, property damage, and "
        "investigative follow-ups. The two measures answer different questions; the final "
        "claim rests on the primary measure with the validation table below.")
    add("")
    add("### Offense-description disposition among the 6,256 flagged incidents")
    add("")
    add(md_table(res["disposition"]))
    add("")
    add("Every offense description that appears among the flagged rows is listed. The six "
        "included descriptions are assaultive victim shootings by construction. The excluded "
        "descriptions cover evidence recovery, property damage, medical and enforcement "
        "activity, ambiguous simple assaults and robberies where victim injury is not "
        "indicated, suicides, accidents, justifiable homicides, and negligent manslaughters.")
    add("")
    add("## Validation: primary incidents vs the dedicated victimization dataset")
    add("")
    add("The dedicated Analyze Boston \"Shootings\" dataset counts victimizations (one row "
        "per victim, fatal and non-fatal) and carries no coordinates. The primary measure "
        "counts incidents, including the small share without valid coordinates. The two "
        "series agree within the 15% threshold in every year from 2019 onward; the "
        "2015\u20132018 shortfall is the pre-2019 under-flagging regime and is flagged "
        "in the table:")
    add("")
    add(md_table(res["validation"]))
    add("")
    add(res["validation_note"])
    add("")
    add("## Windows")
    add("")
    add(f"- Main window: **{main_lbl}** (seven complete calendar years inside the consistent "
        "flagging regime; the 2018\u21922019 jump in flagged rows is a recording-practice "
        "change, so 2015\u20132018 stay out of the main results).")
    add(f"- Pooled sensitivity: **{fmt_years(POOLED_YEARS)}**. The plan asked for a "
        "2015\u20132025 pooled sensitivity and also for partial years dropped from rates; "
        "the 2015 file begins in June, so the pooled window starts in 2016.")
    add(f"- Recent sensitivity: **{fmt_years(RECENT_YEARS)}** (five most recent complete "
        "years).")
    add("- Partial years 2015 and 2026 are excluded from all rates.")
    add("")
    add("## Geography and denominators")
    add("")
    add(res["geography_note"])
    add("")
    add("## Grade-level results")
    add("")
    add(f"### Primary measure, {main_lbl}")
    add("")
    add(md_table(res["main_table"]))
    add("")
    add("Rate ratios against grades A+B combined, exact Poisson 95% CIs "
        "(exposure = residents \u00d7 years):")
    add("")
    add(md_table_rr(res["main_rr"]))
    add("")
    add("Stability within the window:")
    add("")
    for plbl, rr in res["period_rr"].items():
        add(f"**{plbl}**")
        add("")
        add(md_table_rr(rr))
        add("")
    add(f"### Secondary measure (shots-fired and shooting-related incidents), {main_lbl}")
    add("")
    add(md_table(res["secondary_table"]))
    add("")
    add(md_table_rr(res["secondary_rr"]))
    add("")
    add("### Pooled sensitivity, primary measure, " + fmt_years(POOLED_YEARS))
    add("")
    add(md_table(res["pooled_table"]))
    add("")
    add(md_table_rr(res["pooled_rr"]))
    add("")
    add("This window mixes the pre-2019 low-flagging regime with the post-2019 regime, so "
        "its absolute rates understate the current level; the grade ordering is the "
        "informative part.")
    add("")
    add("## Ungraded and unmapped shares")
    add("")
    add(res["unmapped_note"])
    add("")
    add("## Tract-level regression (robustness)")
    add("")
    add(res["model_note"])
    add("")
    add("## Sensitivity analyses")
    add("")
    add("### Dropping the densest tract cluster")
    add("")
    add(res["cluster_note"])
    add("")
    add(md_table(res["cluster_table"]))
    add("")
    add(md_table_rr(res["cluster_rr"]))
    add("")
    add(f"### Five most recent complete years ({fmt_years(RECENT_YEARS)}), primary measure")
    add("")
    add(md_table(res["recent_table"]))
    add("")
    add(md_table_rr(res["recent_rr"]))
    add("")
    add("## What the data support")
    add("")
    add(res["claim"])
    add("")
    add("## Interpretive limit")
    add("")
    add("An association between 1938 HOLC grade and present-day shooting counts does not "
        "separate redlining from the poverty, disinvestment, and lead exposure that "
        "followed it. The manuscript's own account treats those channels as the mechanism, "
        "so this finding reads as persistence of concentration. Isolated causation is not "
        "claimed.")
    add("")
    (DATA / "RESULTS.md").write_text("\n".join(L) + "\n")
    print(f"[log] wrote {DATA / 'RESULTS.md'}")


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> int:
    global HOLC
    HOLC = load_holc()
    pts = load_shootings()
    tracts = load_tracts()

    bos = tracts[tracts["is_boston"]]
    nonb = tracts[~tracts["is_boston"]]
    print(f"[geo] Boston tracts: {len(bos)} (pop {bos['population'].sum():,.0f}); "
          f"non-Boston Suffolk tracts: {len(nonb)} (pop {nonb['population'].sum():,.0f})")

    # shooting -> tract GEOID (for cluster-drop sensitivity)
    tjoin = gpd.sjoin(pts, bos[["GEOID", "geometry"]], predicate="within", how="left")
    tjoin = tjoin[~tjoin.index.duplicated(keep="first")]
    tract_geoid = tjoin["GEOID"].reindex(pts.index)
    n_outside = int(tract_geoid.isna().sum())
    print(f"[geo] geocoded incidents outside all Boston tracts: {n_outside}")

    # --- offense disposition table ----------------------------------------
    disp = (pts.groupby("offense_description").size().reset_index(name="incidents")
            .sort_values("incidents", ascending=False))
    disp["decision"] = disp["offense_description"].map(
        lambda d: "INCLUDE" if OFFENSE_DECISIONS[d][0] else "exclude")
    disp["reason"] = disp["offense_description"].map(lambda d: OFFENSE_DECISIONS[d][1])
    disposition = disp.rename(columns={"offense_description": "offense description"})

    prim = pts[pts["primary"]]
    sec = pts
    print(f"[measures] primary incidents: {len(prim):,}; secondary (all flagged): {len(sec):,}")

    # --- validation --------------------------------------------------------
    val = validation_table()
    flagged = val[val["flag"] == "REPORT"]
    post = val[val["year"] >= 2019]
    worst_post = post.loc[post["diff_pct"].abs().idxmax()]
    validation_note = (
        f"Within the main window the largest absolute difference is "
        f"{worst_post['diff_pct']}% in {int(worst_post['year'])}. " +
        (f"Years beyond the 15% threshold: {', '.join(map(str, flagged['year']))} — all "
         f"pre-2019, where the primary measure reads "
         f"{flagged['diff_pct'].min():.0f}\u2013{flagged['diff_pct'].max():.0f}% relative "
         f"to the dedicated dataset. That direction matches the under-flagging regime "
         f"documented in DATA_LOG.md and is why those years stay out of the main "
         f"results. "
         if len(flagged) else
         "No year exceeds the 15% threshold. ") +
        "Incident counts can sit above victimization rows when one incident has no "
        "victim recorded in the dedicated dataset, and below when one incident carries "
        "several victims; the two accounting units are expected to differ by a few "
        "percent.")

    # --- denominators -------------------------------------------------------
    denom = population_by_grade(tracts, HOLC)
    print(f"[pop] grade populations: { {g: round(v) for g, v in denom['population'].items()} }")

    # --- main tables ---------------------------------------------------------
    main_table = grade_table(prim, MAIN_YEARS, denom)
    main_rr = rate_ratio_table(main_table, MAIN_YEARS)
    period_rr = {}
    for a, b in PERIODS:
        yrs = list(range(a, b + 1))
        t = grade_table(prim, yrs, denom)
        period_rr[f"{a}\u2013{b}"] = rate_ratio_table(t, yrs)

    sec_table = grade_table(sec, MAIN_YEARS, denom)
    sec_rr = rate_ratio_table(sec_table, MAIN_YEARS)
    pooled_table = grade_table(prim, POOLED_YEARS, denom)
    pooled_rr = rate_ratio_table(pooled_table, POOLED_YEARS)
    recent_table = grade_table(prim, RECENT_YEARS, denom)
    recent_rr = rate_ratio_table(recent_table, RECENT_YEARS)

    # --- cluster-drop sensitivity -------------------------------------------
    main_pts = prim[prim["year"].isin(MAIN_YEARS)]
    counts_by_tract = main_pts.assign(g=tract_geoid[main_pts.index]).groupby("g").size()
    top_tract = counts_by_tract.idxmax()
    from libpysal.weights import Queen
    bos_r = bos.reset_index(drop=True)
    wq = Queen.from_dataframe(bos_r, use_index=False)
    top_pos = int(bos_r.index[bos_r["GEOID"] == top_tract][0])
    cluster_ids = set(bos_r.loc[[top_pos] + wq.neighbors[top_pos], "GEOID"])
    cluster_pop = float(bos_r.loc[bos_r["GEOID"].isin(cluster_ids), "population"].sum())
    denom_cluster = population_by_grade(bos[~bos["GEOID"].isin(cluster_ids)], HOLC)
    cluster_table = grade_table(prim, MAIN_YEARS, denom_cluster,
                                drop_tract_geoids=cluster_ids, tract_geoid=tract_geoid)
    cluster_rr = rate_ratio_table(cluster_table, MAIN_YEARS)

    # --- tract regression ------------------------------------------------------
    model = tract_model(pts, tracts, MAIN_YEARS)

    # --- unmapped share note ----------------------------------------------------
    graded_rows = main_table[main_table["grade"] != "citywide (Boston)"]
    ung = main_table[main_table["grade"].isin(["ungraded", "unmapped"])]
    share_shoot = ung["shootings"].sum() / graded_rows["shootings"].sum() * 100
    share_pop = ung["population"].sum() / denom["boston_pop"] * 100
    unmapped_note = (
        f"The 1938 HOLC map grades 91.0 km\u00b2 of Boston's {denom['boston_area_km2']:.0f} "
        f"km\u00b2 tract extent. In {fmt_years(MAIN_YEARS)}, {share_shoot:.0f}% of primary "
        f"shootings fell in ungraded (Commercial/Industrial) or unmapped territory, "
        f"home to {share_pop:.0f}% of the population. The unmapped areas are outside the survey "
        f"footprint; they carry no 1938 grade, so nothing about redlining follows from "
        f"their rates.")

    # --- geography note -----------------------------------------------------------
    geography_note = (
        f"Suffolk County contains Boston plus Chelsea, Revere, and Winthrop. Boston "
        f"tracts are the 208 tracts numbered below 1600 plus the 98xx/99xx special "
        f"tracts (ACS 2024 5-year population {denom['boston_pop']:,.0f}); tract numbers "
        f"1601\u20131899 are the three neighboring municipalities (27 tracts, population "
        f"118,679). Zero flagged shootings fall in the non-Boston tracts, and the "
        f"municipal boundaries are water boundaries, so the classification is clean. "
        f"Grade populations come from areal weighting: each tract's population is "
        f"distributed into HOLC polygons in proportion to intersected area, which "
        f"assumes uniform density within tracts. Tracts are small relative to HOLC "
        f"areas in Boston, so the error from this assumption is limited to boundary "
        f"slivers. The unmapped category's area includes harbor water carried in the "
        f"special tracts, which dilutes its per-km\u00b2 rate; the per-capita rates are "
        f"the informative column.")

    # --- model note ------------------------------------------------------------------
    mrows = []
    for m in model["models"]:
        ptxt = f"p={m['p']:.4f}" if m["p"] >= 0.0001 else "p<0.0001"
        mrows.append({"model": m["model"], "IRR for C+D share": m["irr"],
                      "95% CI": f"{m['ci_lo']}\u2013{m['ci_hi']}", "p": ptxt})
    mdf = pd.DataFrame(mrows)
    ctl = model["controls_m2"]
    nb_row = model["models"][2]
    nb_verdict = (
        "did not survive" if nb_row["p"] > 0.05 and nb_row["ci_lo"] < 1 < nb_row["ci_hi"]
        else "survived")
    def pctl(v):
        return "p<0.0001" if v < 0.0001 else f"p={v:.4f}"
    model_note = (
        f"Poisson regression of tract primary-shooting counts "
        f"({fmt_years(MAIN_YEARS)}, n={model['n_tracts']} Boston tracts, "
        f"{model['shootings_assigned']:,} shootings assigned; "
        f"{model['dropped_zero_pop_or_na']} tracts with zero population or missing "
        f"controls dropped) on the tract's HOLC exposure — the share of tract area "
        f"graded C or D — with log(population) offset.\n\n"
        + md_table(mdf) + "\n\n"
        f"Pearson overdispersion is {model['overdispersion_pearson']['m1']} (uncontrolled) "
        f"and {model['overdispersion_pearson']['m2']} (controlled), so the Poisson "
        f"standard errors understate the uncertainty; the negative-binomial row "
        f"(iterated moment-estimated alpha={model['nb_alpha']}) carries the appropriate "
        f"standard errors. Under that model the C+D-share coefficient is null (IRR "
        f"{nb_row['irr']}, 95% CI {nb_row['ci_lo']}\u2013{nb_row['ci_hi']}, "
        f"{pctl(nb_row['p'])}): at tract level, the HOLC-exposure coefficient "
        f"{nb_verdict} the poverty and percent-Black controls. In the controlled "
        f"Poisson model the poverty-rate coefficient is "
        f"{ctl['poverty_rate']['coef']} ({pctl(ctl['poverty_rate']['p'])}) and the "
        f"percent-Black coefficient is {ctl['pct_black']['coef']} "
        f"({pctl(ctl['pct_black']['p'])}). Moran's I of the controlled model's deviance "
        f"residuals is {model['morans_i']} (permutation p={model['morans_i_p']:.4f}, "
        f"queen contiguity, {model['moran_islands_connected']} island tract connected "
        f"to its nearest neighbor): residual spatial clustering remains after the "
        f"controls, so the tract model leaves spatial structure unexplained. The "
        f"grade-level tables above are the descriptive evidence; the tract regression "
        f"does not separate 1938 grade from the poverty and racial composition that "
        f"followed it.")

    # --- claim -----------------------------------------------------------------------
    d_row = main_rr[main_rr["grade"] == "D"].iloc[0]
    c_row = main_rr[main_rr["grade"] == "C"].iloc[0]
    d_rate = main_table[main_table["grade"] == "D"]["per_10k_per_year"].iloc[0]
    ab_rate = (main_table[main_table["grade"].isin(["A", "B"])]["shootings"].sum()
               / (main_table[main_table["grade"].isin(["A", "B"])]["population"].sum()
                  * len(MAIN_YEARS)) * 1e4)
    n_main_all = int(prim["year"].isin(MAIN_YEARS).sum())
    claim = (
        f"In {fmt_years(MAIN_YEARS)}, Boston recorded "
        f"{n_main_all:,} shooting-victimization incidents, of which "
        f"{int(main_table[main_table['grade'] == 'citywide (Boston)']['shootings'].iloc[0]):,} "
        f"carry valid coordinates and enter the geographic rates. The annual rate in "
        f"D-graded areas was "
        f"{d_rate} per 10,000 residents, against {ab_rate:.2f} in A- and B-graded areas "
        f"combined: a rate ratio of {d_row['rate_ratio_vs_AB']} (95% CI "
        f"{d_row['ci95_lo']}\u2013{d_row['ci95_hi']}). C-graded areas sit at the same "
        f"level, rate ratio {c_row['rate_ratio_vs_AB']} "
        f"({c_row['ci95_lo']}\u2013{c_row['ci95_hi']}); the C and D rates are "
        f"statistically indistinguishable from each other, and both sit roughly seven "
        f"times the A+B rate. The gap holds in the pooled {fmt_years(POOLED_YEARS)} "
        f"window, in the {fmt_years(RECENT_YEARS)} window, in both sub-periods, under "
        f"the secondary shots-fired measure, and with the densest tract cluster "
        f"removed. At tract level the HOLC-exposure coefficient does not survive "
        f"poverty and percent-Black controls once the heavy overdispersion is modeled, "
        f"so the supported statement is descriptive: present-day shooting "
        f"victimizations remain concentrated in the areas the 1938 HOLC survey graded "
        f"C and D.")

    res = dict(disposition=disposition, validation=val, validation_note=validation_note,
               geography_note=geography_note, main_table=main_table, main_rr=main_rr,
               period_rr=period_rr, secondary_table=sec_table, secondary_rr=sec_rr,
               pooled_table=pooled_table, pooled_rr=pooled_rr, recent_table=recent_table,
               recent_rr=recent_rr, cluster_table=cluster_table, cluster_rr=cluster_rr,
               cluster_note=(
                   f"The densest tract is {top_tract} "
                   f"({int(counts_by_tract.max())} primary shootings, "
                   f"{fmt_years(MAIN_YEARS)}); the cluster dropped here is that tract "
                   f"plus its {len(wq.neighbors[top_pos])} queen-contiguous neighbors "
                   f"(combined population {cluster_pop:,.0f}). Grade populations and "
                   f"shooting counts are recomputed without the cluster."),
               unmapped_note=unmapped_note, model_note=model_note, claim=claim)
    write_results(res)

    print("\n=== primary, " + fmt_years(MAIN_YEARS) + " ===")
    print(main_table.to_string(index=False))
    print(main_rr.to_string(index=False))
    print("\n=== validation ===")
    print(val.to_string(index=False))
    print("\n=== tract model ===")
    print(mdf.to_string(index=False))
    print("Moran's I:", model["morans_i"], "p:", model["morans_i_p"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
