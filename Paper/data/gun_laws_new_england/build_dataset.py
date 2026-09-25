#!/usr/bin/env python3
"""Stage 1 dataset builder: New England gun-violence rebuttal (Chapter 135 video).

Builds states.csv — one row per state plus DC — from published sources only.
Every fetch is saved verbatim under sources/ so each value stays traceable to
its URL and access date.

Sources
-------
1. CDC NCIPC "Mapping Injury, Overdose, and Violence - State" (Socrata fpsi-y8tj):
   yearly firearm homicide (FA_Homicide) and all firearm injury deaths
   (FA_Deaths), counts and crude rates per 100,000, 2019-2024.
   https://data.cdc.gov/resource/fpsi-y8tj.csv
   Note: the CDC WONDER API refuses state-level grouping for the Underlying
   Cause of Death databases ("Only national data are available for this
   dataset when using the WONDER web service"), so this CDC-published state
   compilation is used instead. Its rates are crude, not age-adjusted.
2. Census Bureau SAIPE (Small Area Income and Poverty Estimates), state file:
   poverty rate (all ages) and median household income, 2020-2024.
   https://www2.census.gov/programs-surveys/saipe/datasets/
3. Census Bureau ACS 2024 5-year table-based summary files:
   B19013 (median household income), B19083 (Gini index).
   https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/
4. Census Bureau state population estimates NST-EST2024-ALLDATA.csv
   (POPESTIMATE2020-2024), used as denominators for five-year pooled rates.
5. Giffords Law Center Annual Gun Law Scorecard (current edition; previous
   editions listed on the page end at 2024): letter grade and gun-law
   strength rank, 50 states. https://giffords.org/lawcenter/resources/scorecard/
6. Everytown Gun Law Rankings 2026: gun-law rank (1 = strongest) and gun
   death rate rank, 50 states. https://everytownresearch.org/rankings/

Gaps recorded in DATA_LOG.md: DC is absent from both law rankings; CDC
suppresses counts under 10 (reported as "1-9", rate -999), which blocks the
five-year pooled rate for states with any suppressed year in 2020-2024.

Run:  python3 build_dataset.py   (requires the `requests` package)
"""

import csv
import datetime
import io
import json
import re
import sys
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent
SRC = HERE / "sources"
SRC.mkdir(exist_ok=True)

TODAY = datetime.date.today().isoformat()
HEADERS = {"User-Agent": "Mozilla/5.0 (research dataset build; contact: repository owner)"}

YEARS = ["2020", "2021", "2022", "2023", "2024"]
LATEST = "2024"

URL_CDC = "https://data.cdc.gov/resource/fpsi-y8tj.csv?$limit=5000&intent={intent}"
URL_CDC_META = "https://data.cdc.gov/api/views/fpsi-y8tj"
URL_SAIPE = "https://www2.census.gov/programs-surveys/saipe/datasets/{y}/{y}-state-and-county/est{yy}all.txt"
URL_ACS = "https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-{table}.dat"
URL_POPEST = "https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/state/totals/NST-EST2024-ALLDATA.csv"
URL_GIFFORDS = "https://giffords.org/lawcenter/resources/scorecard/"
URL_EVERYTOWN = "https://everytownresearch.org/rankings/"


def fetch(url, name, binary=False):
    r = requests.get(url, headers=HEADERS, timeout=120)
    r.raise_for_status()
    data = r.content if binary else r.text
    p = SRC / name
    p.write_bytes(r.content) if binary else p.write_text(data, encoding="utf-8")
    print(f"fetched {name:42s} {len(r.content):>9,} bytes  {url}")
    return data


# ---------------------------------------------------------------- CDC firearm data

def load_cdc(intent):
    text = fetch(URL_CDC.format(intent=intent), f"cdc_{intent}.csv")
    rows = list(csv.DictReader(io.StringIO(text)))
    out = {}  # (state_name, year) -> dict
    as_of = set()
    for r in rows:
        if r["period"] == "TTM":
            continue
        count_raw, rate_raw = r["count_sup"], r["rate"]
        out[(r["name"], r["period"])] = {
            "count": None if count_raw == "1-9" else int(count_raw),
            "count_raw": count_raw,
            "rate": None if float(rate_raw) < 0 else float(rate_raw),
            "rate_raw": rate_raw,
        }
        as_of.add(r["data_as_of"])
    return out, sorted(as_of)


# ---------------------------------------------------------------- Census populations

def load_popest():
    text = fetch(URL_POPEST, "census_NST-EST2024-ALLDATA.csv")
    pops = {}
    names = {}
    for r in csv.DictReader(io.StringIO(text)):
        if r["SUMLEV"] != "040":
            continue
        names[r["STATE"]] = r["NAME"]
        pops[r["NAME"]] = {y: int(r[f"POPESTIMATE{y}"]) for y in YEARS}
    return pops, names


# ---------------------------------------------------------------- SAIPE poverty / income

SAIPE_FIELD = {
    "state_fips": 0, "county_fips": 1,
    "n_poverty": 2, "poverty_rate": 5,            # all ages
    "median_hh_income": 20,                        # dollars
}

def load_saipe(year):
    yy = year[2:]
    text = fetch(URL_SAIPE.format(y=year, yy=yy), f"saipe_est{yy}all.txt")
    out = {}
    for line in text.splitlines():
        parts = line.split()
        if len(parts) < 30 or parts[1] != "0":
            continue  # state rows have county FIPS 000 (token "0")
        out[parts[0]] = {
            "poverty_rate": float(parts[SAIPE_FIELD["poverty_rate"]]),
            "median_hh_income": int(parts[SAIPE_FIELD["median_hh_income"]]),
        }
    return out


# ---------------------------------------------------------------- ACS table-based SF

def load_acs(table, col):
    text = fetch(URL_ACS.format(table=table), f"acs2024_5yr_{table}.dat")
    out = {}
    for line in text.splitlines()[1:]:
        geo, est, _moe = line.split("|")
        if geo.startswith("0400000US"):
            out[geo[-2:]] = None if est in ("", ".", "null") else float(est)
    return out


# ---------------------------------------------------------------- Giffords scorecard

def load_giffords():
    html = fetch(URL_GIFFORDS, "giffords_scorecard.html")
    rows = re.findall(
        r'data-state-name="([^"]+)"\s+data-grade=\'([A-F+-]+)\'\s+data-safety=\'?(\d+)\'?'
        r'\s+data-death=\'?(\d+)\'?\s+data-per100k=\'?([\d.]+|N/A)\'?', html)
    out = {}
    for name, grade, law_rank, death_rank, per100k in rows:
        out[name] = {"grade": grade, "law_rank": int(law_rank),
                     "death_rank": int(death_rank), "death_rate": per100k}
    prev = re.search(r"Previous Scorecards.*?scorecard(\d{4})", html)
    return out, (prev.group(1) if prev else "unknown")


# ---------------------------------------------------------------- Everytown rankings

def load_everytown():
    html = fetch(URL_EVERYTOWN, "everytown_rankings.html")
    rows = re.findall(
        r'rankings-table__rank"><span class="visually-hidden">#</span>(\d+)</span>'
        r'\s*<span class="rankings-table__state">([^<]+)</span>', html)
    # first table = gun law rank (1 = strongest laws); second = gun death rate rank (1 = highest)
    half = len(rows) // 2
    law = {name: int(rank) for rank, name in rows[:half]}
    death = {name: int(rank) for rank, name in rows[half:]}
    year = re.search(r"Gun Law Rankings (20\d\d)", html)
    return law, death, (year.group(1) if year else "unknown")


# ---------------------------------------------------------------- assemble

def main():
    access = TODAY

    fa_hom, asof_hom = load_cdc("FA_Homicide")
    fa_all, asof_all = load_cdc("FA_Deaths")
    pops, fips_names = load_popest()
    saipe = {y: load_saipe(y) for y in YEARS}
    acs_income = load_acs("b19013", "B19013_E001")
    acs_gini = load_acs("b19083", "B19083_E001")
    giffords, giffords_prev = load_giffords()
    et_law, et_death, et_year = load_everytown()

    meta = requests.get(URL_CDC_META, timeout=60).json()
    cdc_desc = meta.get("description", "")
    (SRC / "cdc_dataset_meta.json").write_text(json.dumps(meta, indent=1)[:8000], encoding="utf-8")

    gaps = []
    rows = []
    # Scope: 50 states + DC. Puerto Rico is in the popest file (SUMLEV 040) but is
    # outside the plan's scope and absent from the CDC state dataset.
    EXCLUDE = {"Puerto Rico"}
    state_rows = [(fips, name) for fips, name in sorted(fips_names.items()) if name not in EXCLUDE]
    for fips, name in state_rows:
        row = {"state": name, "state_fips": fips}
        for label, data in (("fa_homicide", fa_hom), ("fa_deaths", fa_all)):
            latest = data.get((name, LATEST), {})
            row[f"{label}_rate_{LATEST}"] = latest.get("rate")
            row[f"{label}_count_{LATEST}"] = latest.get("count_raw")
            counts = [data.get((name, y), {}).get("count") for y in YEARS]
            if all(c is not None for c in counts) and name in pops:
                pooled = sum(counts) / sum(pops[name][y] for y in YEARS) * 100000
                row[f"{label}_rate_2020_2024_pooled"] = round(pooled, 2)
                row[f"{label}_count_2020_2024"] = sum(counts)
                row[f"{label}_suppressed_years"] = ""
            else:
                row[f"{label}_rate_2020_2024_pooled"] = None
                known = [c for c in counts if c is not None]
                row[f"{label}_count_2020_2024"] = sum(known) if known else None
                supp = [y for y, c in zip(YEARS, counts) if c is None]
                row[f"{label}_suppressed_years"] = ";".join(supp)
                if supp:
                    gaps.append(f"{name}: {label} count suppressed (1-9) in {', '.join(supp)}"
                                f" -> five-year pooled rate not computable")

        s24 = saipe[LATEST].get(fips)
        row["poverty_rate_saipe_2024"] = s24["poverty_rate"] if s24 else None
        rates = [saipe[y].get(fips, {}).get("poverty_rate") for y in YEARS]
        if all(r is not None for r in rates):
            row["poverty_rate_saipe_2020_2024_mean"] = round(sum(rates) / len(rates), 2)
        else:
            row["poverty_rate_saipe_2020_2024_mean"] = None
            gaps.append(f"{name}: SAIPE poverty rate missing for some year in 2020-2024")
        row["median_hh_income_saipe_2024"] = s24["median_hh_income"] if s24 else None
        row["median_hh_income_acs2024_5yr"] = acs_income.get(fips)
        row["gini_acs2024_5yr"] = acs_gini.get(fips)

        g = giffords.get(name)
        row["giffords_grade"] = g["grade"] if g else None
        row["giffords_law_strength_rank"] = g["law_rank"] if g else None
        row["everytown_law_rank"] = et_law.get(name)
        row["everytown_gun_death_rank"] = et_death.get(name)
        if g is None:
            gaps.append(f"{name}: no Giffords scorecard grade/rank (rankings cover 50 states)")
        if row["everytown_law_rank"] is None:
            gaps.append(f"{name}: no Everytown gun law rank (rankings cover 50 states)")

        rows.append(row)

    src_cols = {
        "cdc": "https://data.cdc.gov/resource/fpsi-y8tj.csv (CDC NCIPC Mapping Injury, Overdose, and Violence - State)",
        "popest": URL_POPEST,
        "saipe": URL_SAIPE.format(y="2024", yy="24") + " (+ est20-est23 for the 2020-2024 mean)",
        "acs": "ACS 2024 5-year table-based SF, tables B19013 and B19083, " +
               "https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/",
        "giffords": URL_GIFFORDS,
        "everytown": URL_EVERYTOWN,
    }

    fields = ["state", "state_fips",
              "fa_homicide_rate_2024", "fa_homicide_count_2024",
              "fa_homicide_rate_2020_2024_pooled", "fa_homicide_count_2020_2024",
              "fa_homicide_suppressed_years",
              "fa_deaths_rate_2024", "fa_deaths_count_2024",
              "fa_deaths_rate_2020_2024_pooled", "fa_deaths_count_2020_2024",
              "fa_deaths_suppressed_years",
              "giffords_grade", "giffords_law_strength_rank",
              "everytown_law_rank", "everytown_gun_death_rank",
              "poverty_rate_saipe_2024", "poverty_rate_saipe_2020_2024_mean",
              "median_hh_income_saipe_2024", "median_hh_income_acs2024_5yr",
              "gini_acs2024_5yr",
              "source_firearm", "source_law_rankings", "source_poverty_income_gini",
              "access_date"]
    for r in rows:
        r["source_firearm"] = src_cols["cdc"] + f" | denominators for pooled rates: {src_cols['popest']}"
        r["source_law_rankings"] = src_cols["giffords"] + " | " + src_cols["everytown"]
        r["source_poverty_income_gini"] = src_cols["saipe"] + " | " + src_cols["acs"]
        r["access_date"] = access

    with open(HERE / "states.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"\nwrote states.csv: {len(rows)} rows x {len(fields)} columns")

    # DATA_LOG.md
    ne = ["Massachusetts", "Connecticut", "Rhode Island", "New Hampshire", "Vermont", "Maine"]
    ne_lines = []
    for r in rows:
        if r["state"] in ne:
            ne_lines.append(
                f"| {r['state']} | {r['fa_homicide_rate_2024']} ({r['fa_homicide_count_2024']}) "
                f"| {r['fa_deaths_rate_2024']} ({r['fa_deaths_count_2024']}) "
                f"| {r['fa_homicide_rate_2020_2024_pooled'] if r['fa_homicide_rate_2020_2024_pooled'] is not None else 'suppressed'} "
                f"| {r['giffords_grade']} / #{r['giffords_law_strength_rank']} "
                f"| #{r['everytown_law_rank']} | {r['poverty_rate_saipe_2024']}% |")

    gap_lines = "\n".join(f"- {g}" for g in sorted(set(gaps))) if gaps else "- None"

    log = f"""# DATA_LOG — gun_laws_new_england (Stage 1)

Generated by `build_dataset.py` on {access}. Every value in `states.csv` comes from one of the
sources below; raw downloads are stored verbatim in `sources/`.

## Sources

| # | Source | URL | Vintage / coverage | Access date |
|---|--------|-----|--------------------|-------------|
| 1 | CDC NCIPC, Mapping Injury, Overdose, and Violence — State (Socrata dataset fpsi-y8tj), suggested citation: "Centers for Disease Control and Prevention, National Center for Injury Prevention and Control, Mapping Injury, Overdose, and Violence Dashboard" | {URL_CDC.format(intent='FA_Homicide').replace('&','&')} | Yearly 2019–2024, 50 states + DC; FA_Homicide rows carry data_as_of {', '.join(asof_hom)}; FA_Deaths rows {', '.join(asof_all)} | {access} |
| 2 | Census Bureau, SAIPE state/county estimates | {URL_SAIPE.format(y='2024', yy='24')} (and est20all–est23all in the matching year folders) | 2020–2024 estimates; est24all.txt stamped 07JAN2026 | {access} |
| 3 | Census Bureau, ACS 2024 5-year table-based summary files, tables B19013 (median household income) and B19083 (Gini index) | {URL_ACS.format(table='b19013')} ; {URL_ACS.format(table='b19083')} | ACS 2020–2024 5-year estimates | {access} |
| 4 | Census Bureau, NST-EST2024-ALLDATA (state population estimates) | {URL_POPEST} | POPESTIMATE2020–2024 (Vintage 2024) | {access} |
| 5 | Giffords Law Center, Annual Gun Law Scorecard (current edition; the page lists 2024 and 2023 as previous editions; page modified 2026-02-20) | {URL_GIFFORDS} | 50 states; grade + gun law strength rank parsed from the page's map markup | {access} |
| 6 | Everytown for Gun Safety, Gun Law Rankings {et_year} | {URL_EVERYTOWN} | 50 states; gun law rank (1 = strongest) and gun death rate rank (1 = highest) | {access} |

## Definitions and methods

- `fa_homicide_*`: firearm homicide deaths (CDC intent label `FA_Homicide`; the dataset's data
  dictionary defines it as "deaths from firearm homicide"). `fa_deaths_*`: all firearm injury deaths
  (`FA_Deaths`: suicide, homicide, unintentional, legal intervention, undetermined). The two measures
  are reported separately throughout; firearm suicide is not mixed into either label.
- CDC rates are deaths per 100,000 people. The dictionary does not state age adjustment; spot checks
  (Arizona TTM 298 deaths vs population, Maine 2024 16/1.405M = 1.1, Vermont 2024 12/648k = 1.9) match
  crude rates, so these columns are labeled and used as crude rates. The plan asked for age-adjusted
  rates; the CDC WONDER API (the age-adjusted source) answered "Only national data are available for
  this dataset when using the WONDER web service" when asked to group the Underlying Cause of Death
  database by state, so state-level age-adjusted rates could not be obtained there. This is a
  documented deviation from the plan's preferred source order.
- Suppression: the CDC dataset reports counts below 10 as the string "1-9" and sets the rate to -999
  ("-999: Unstable Rate" per the data dictionary). Those cells are stored as blank count / blank rate
  in `states.csv`, with the year listed in `*_suppressed_years`.
- Five-year pooled rate 2020–2024 = sum of yearly death counts / sum of POPESTIMATE2020–2024 x 100,000
  (crude). Computed only when all five yearly counts are unsuppressed; otherwise blank and listed as a
  gap below.
- `poverty_rate_saipe_2024` is the SAIPE all-ages poverty rate; `poverty_rate_saipe_2020_2024_mean` is
  the arithmetic mean of the five annual SAIPE rates (SAIPE publishes no pooled poverty rate).
- Gun-law rankings: Giffords grade + gun law strength rank (1 = strongest); Everytown gun law rank
  (1 = strongest). DC is not graded or ranked by either publication.
- New England states: {', '.join(ne)}.

## Gaps and suppressed values

{gap_lines}

## New England preview (2024 homicide / total firearm death rates, 2020-2024 pooled homicide rate, rankings, poverty)

| State | FA homicide rate (count) | FA deaths rate (count) | Pooled FA homicide 2020-24 | Giffords grade / law rank | Everytown law rank | SAIPE poverty 2024 |
|-------|--------------------------|------------------------|----------------------------|---------------------------|--------------------|--------------------|
{chr(10).join(ne_lines)}
"""
    (HERE / "DATA_LOG.md").write_text(log, encoding="utf-8")
    print("wrote DATA_LOG.md")
    print("\n".join(sorted(set(gaps))))


if __name__ == "__main__":
    sys.exit(main())
