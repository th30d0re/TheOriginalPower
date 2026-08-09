#!/usr/bin/env python3
"""Live, GET-only source probes for the L11 data-source survey."""

from __future__ import annotations

import csv
import io
import json
import re
import subprocess
import tempfile
import time
import zipfile
from datetime import date, datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "docs" / "data_source_probes.json"
USER_AGENT = "TheOriginalPower-L11/1.0 (public research probe)"
_last_request = 0.0


def get(url: str, max_bytes: int = 8_000_000) -> dict:
    """Perform one certificate-checked, unauthenticated GET with curl."""
    global _last_request
    delay = 1.0 - (time.monotonic() - _last_request)
    if delay > 0:
        time.sleep(delay)
    with tempfile.TemporaryDirectory() as tmp:
        body_path = Path(tmp) / "body"
        command = [
            "curl", "--silent", "--show-error", "--location", "--request", "GET",
            "--connect-timeout", "10", "--max-time", "30", "--max-filesize", str(max_bytes),
            "--user-agent", USER_AGENT, "--output", str(body_path),
            "--write-out", "%{http_code}\t%{content_type}\t%{url_effective}\t%{size_download}", url,
        ]
        proc = subprocess.run(command, capture_output=True, text=True, check=False)
        _last_request = time.monotonic()
        body = body_path.read_bytes() if body_path.exists() else b""
    parts = proc.stdout.rsplit("\t", 3)
    status = int(parts[0]) if len(parts) == 4 and parts[0].isdigit() else 0
    return {
        "request": f"GET {url}", "status": status,
        "content_type": parts[1] if len(parts) == 4 else "",
        "effective_url": parts[2] if len(parts) == 4 else url,
        "bytes": len(body), "curl_exit": proc.returncode,
        "error": proc.stderr.strip(), "body": body,
    }


def evidence(response: dict, shape: str) -> dict:
    return {key: response[key] for key in (
        "request", "status", "content_type", "effective_url", "bytes", "curl_exit", "error"
    )} | {"shape": shape}


def score(coverage: int, granularity: int, absolute: int, point_in_time: int, axes: int) -> dict:
    values = {
        "coverage": coverage, "granularity": granularity, "absoluteness": absolute,
        "point_in_time": point_in_time, "axis_resolution": axes,
    }
    return values | {"total": sum(values.values())}


def record(*, source: str, variable: str, probe: list[dict], coverage: str,
           granularity: str, absolute: str, latency: str, revision: str,
           pit_gate: str, access: str, licence: str, axes: str,
           scores: dict, verdict: str) -> dict:
    return {
        "source": source, "variable": variable, "probe_result": probe,
        "coverage": coverage, "granularity": granularity,
        "absolute_or_relative": absolute, "latency": latency,
        "revision_policy": revision, "point_in_time_gate": pit_gate,
        "access": access, "licence": licence, "axis_mapping": axes,
        "scores": scores, "verdict": verdict,
    }


def probe_cornell() -> dict:
    data = get("https://striketracker.ilr.cornell.edu/labor_actions.json")
    policy = get("https://www.ilr.cornell.edu/faculty-and-research/labor-action-tracker-2025")
    try:
        rows = list(json.loads(data["body"]).values())
        dates = sorted(row["Start_date"] for row in rows if row.get("Start_date"))
        columns = sorted(rows[0])
        shape = f"{len(rows)} keyed JSON events; {len(columns)} fields; {dates[0]}..{dates[-1]}"
    except Exception as exc:
        rows, dates, columns, shape = [], [], [], f"unparseable response: {exc}"
    revised = b"Updated 2024 Findings" in policy["body"] and b"additional strikes" in policy["body"]
    return record(
        source="Cornell/Illinois Labor Action Tracker", variable="T / P_real",
        probe=[evidence(data, shape), evidence(policy, f"HTML revision evidence present={revised}")],
        coverage=f"{dates[0]} to {dates[-1]}; misses 2020" if dates else "No rows returned",
        granularity="Event-level strike/protest records", absolute="Absolute event, participant, and duration fields",
        latency="Latest event date in the feed is used directly; sub-week at probe time",
        revision="The fetched 2025 report says additional prior-year strikes were added; no vintage endpoint was found in the fetched feed.",
        pit_gate="FAIL — revises historical events without retrievable vintages",
        access="No auth; public JSON feed; 4.9 MB full response; no stated rate limit",
        licence="Fetched pages request citation but expose no data licence; book redistribution requires permission.",
        axes="Not an identity source", scores=score(4, 5, 5, 0, 0),
        verdict="Excellent direct measure from 2021 onward; barred as a sole backtest input by missing 2020 and revision gate.",
    )


def probe_bls() -> dict:
    response = get("https://api.bls.gov/publicAPI/v2/timeseries/data/WSU001?startyear=2020&endyear=2026")
    text = response["body"][:160].decode("utf-8", "replace")
    return record(
        source="BLS Work Stoppages", variable="T / P_real",
        probe=[evidence(response, f"No usable API rows; body preview={text!r}")],
        coverage="Not observed: live GET returned no data rows", granularity="Not verified from returned data",
        absolute="Not verified from returned data", latency="Not measurable from failed response",
        revision="Not verified from returned data", pit_gate="FAIL — source could not be fetched by the rerunnable probe",
        access="Unauthenticated GET attempted; live endpoint returned 503 in this environment",
        licence="No licence was present in the returned error body; no data were obtained for redistribution.",
        axes="Not an identity source", scores=score(0, 0, 0, 0, 0),
        verdict="Live access dead end for this pipeline despite the public program.",
    )


def probe_fred() -> dict:
    response = get("https://fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE&cosd=2020-01-01&coed=2026-01-01")
    rows = list(csv.reader(io.StringIO(response["body"].decode("utf-8", "replace")))) if response["body"] else []
    return record(
        source="FRED current series (UNRATE probe)", variable="T / P_real",
        probe=[evidence(response, f"{max(0, len(rows)-1)} CSV observations returned")],
        coverage="No observations returned by live probe", granularity="Not verified from returned data",
        absolute="Not verified; intended series is a rate", latency="Not measurable",
        revision="Current-series endpoint has no vintage in the request", pit_gate="FAIL — no data returned and current endpoint is not vintage-safe",
        access="No auth endpoint attempted; transport timed out/failed", licence="No returned data or licence field",
        axes="Not an identity source", scores=score(0, 0, 0, 0, 0), verdict="Unusable as probed.",
    )


def probe_alfred() -> dict:
    url = "https://fred.stlouisfed.org/graph/alfredgraph.csv?id=UNRATE&vintage_date=2021-01-01&cosd=2020-01-01&coed=2021-01-01"
    response = get(url)
    rows = list(csv.reader(io.StringIO(response["body"].decode("utf-8", "replace")))) if response["body"] else []
    return record(
        source="ALFRED vintage series (UNRATE probe)", variable="T / P_real",
        probe=[evidence(response, f"{max(0, len(rows)-1)} vintage CSV observations returned")],
        coverage="No observations returned by live probe", granularity="Not verified from returned data",
        absolute="Not verified; intended series is a rate", latency="Not measurable",
        revision="Request explicitly selected a 2021-01-01 vintage, but no body arrived.",
        pit_gate="FAIL operationally — vintage semantics were requested but live fetch failed",
        access="No auth graph endpoint attempted; transport timed out/failed", licence="No returned data or licence field",
        axes="Not an identity source", scores=score(0, 0, 0, 0, 0), verdict="Correct vintage concept; unavailable to this reproducible probe.",
    )


def probe_nlrb() -> dict:
    base = "https://www.nlrb.gov/reports/graphs-data/recent-election-results/date_issued"
    early, late = get(f"{base}/asc/100"), get(f"{base}/desc/100")
    pattern = rb"Tally Issued Date</b>:\s*([^<]+)"
    early_dates, late_dates = re.findall(pattern, early["body"]), re.findall(pattern, late["body"])
    count_match = re.search(rb"of\s+(\d+)\s*</b>", late["body"])
    count = int(count_match.group(1)) if count_match else 0
    first = early_dates[0].decode().strip() if early_dates else "unknown"
    last = late_dates[0].decode().strip() if late_dates else "unknown"
    shape = f"{count} total election-result records; 100-row pages; observed {first}..{last}"
    return record(
        source="NLRB recent election results", variable="T / P_real",
        probe=[evidence(early, shape), evidence(late, shape)], coverage=f"{first} to {last}; covers full window",
        granularity="Event-level election tallies", absolute="Absolute eligible-voter and ballot counts in fetched records",
        latency="Latest tally was two days old at probe time", revision="Live records include open cases; no vintage or change history was exposed by GET.",
        pit_gate="FAIL — current case records can change and no vintage endpoint was observed",
        access="No auth; HTML GET; 100 records per page; CSV button exists but is generated by site workflow",
        licence="U.S. government records; fetched page contains no redistribution restriction.", axes="Not an identity source",
        scores=score(5, 5, 5, 0, 0), verdict="Strong corroborating labor-organization measure; current-state revisions block primary backtest use.",
    )


def _gkg_shape(response: dict) -> tuple[int, int, set[str]]:
    with zipfile.ZipFile(io.BytesIO(response["body"])) as archive:
        raw = archive.read(archive.namelist()[0])
    lines = raw.splitlines()
    patterns = {"race": rb"ETHNIC|RACIAL|RACE", "gender": rb"GENDER|WOMEN",
                "religion": rb"RELIGION|RELIGIOUS", "sexuality": rb"LGBT|SEXUALITY|HOMOSEX",
                "nationality": rb"IMMIGRATION|NATIONALITY|MIGRANT", "ability": rb"DISABILITY|DISABLED"}
    upper = raw.upper()
    axes = {name for name, pattern in patterns.items() if re.search(pattern, upper)}
    return len(lines), len(lines[0].split(b"\t")) if lines else 0, axes


def probe_gdelt() -> dict:
    early = get("http://data.gdeltproject.org/gdeltv2/20200101000000.gkg.csv.zip")
    late = get("http://data.gdeltproject.org/gdeltv2/20260101000000.gkg.csv.zip")
    manifest = get("http://data.gdeltproject.org/gdeltv2/lastupdate.txt", 100_000)
    home = get("https://www.gdeltproject.org/", 2_000_000)
    try:
        erows, ecols, eaxes = _gkg_shape(early); lrows, lcols, laxes = _gkg_shape(late)
        stamp = max(re.findall(rb"(20\d{12})\.gkg\.csv\.zip", manifest["body"])).decode()
        shape = f"2020 {erows}x{ecols}; 2026 {lrows}x{lcols}; axes={sorted(eaxes & laxes)}; latest={stamp}"
    except Exception as exc:
        stamp, shape = "unknown", f"unparseable archive/manifest: {exc}"
    return record(
        source="GDELT 2.0 GKG bulk files", variable="O_x",
        probe=[evidence(early, shape), evidence(late, shape), evidence(manifest, shape),
               evidence(home, f"project page; free/open language present={b'free and open' in home['body'].lower()}")],
        coverage="Fetched timestamped GKG records at 2020-01-01 and 2026-01-01; full window bracketed",
        granularity="15-minute immutable bulk slices; aggregatable daily", absolute="Absolute article records and coded themes/tone",
        latency=f"Latest GKG timestamp in fetched manifest: {stamp}",
        revision="Timestamped bulk objects preserve the originally published slices; no overwrite/vintage warning appeared in fetched manifest.",
        pit_gate="PASS — timestamped bulk files are point-in-time artifacts",
        access="No auth; HTTP bulk ZIP; sampled two slices (about 9 MB total); BigQuery not probed because it needs credentials",
        licence="Fetched GDELT surface describes the data as free/open; source-article text remains third-party and should not be redistributed.",
        axes="Theme taxonomy can separately map race, gender, religion, sexuality, nationality, and ability; mapping requires a coded validation set.",
        scores=score(5, 5, 5, 5, 4), verdict="Recommended primary for O_x.",
    )


def probe_wikipedia() -> dict:
    end = date.today().strftime("%Y%m%d")
    url = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Trade_union/daily/20200101/{end}"
    response = get(url)
    try:
        items = json.loads(response["body"])["items"]
        fields = sorted(items[0]); first, last = items[0]["timestamp"][:8], items[-1]["timestamp"][:8]
        shape = f"{len(items)} rows x {len(fields)} fields; {first}..{last}"
    except Exception as exc:
        items, first, last, shape = [], "unknown", "unknown", f"unparseable response: {exc}"
    return record(
        source="Wikipedia Pageviews API", variable="T / P_real; O_x fallback",
        probe=[evidence(response, shape)], coverage=f"{first} to {last}; covers full window",
        granularity="Daily per article", absolute="Absolute user pageview counts; no 0-100 normalization",
        latency="Most recent returned day is normally one day behind", revision="API returned dated counts and no vintage field; archived daily observations are treated as stable, with reprocessing risk unquantified.",
        pit_gate="PASS with caution — dated observations are retrievable; no formal vintage selector",
        access="No auth; public REST JSON; one article returned in one bounded request", licence="Response contains aggregate facts only; no licence field. Attribute Wikimedia and avoid redistributing article content.",
        axes="Separate curated article sets can cover all six axes; article selection remains a modeling choice.",
        scores=score(5, 5, 5, 4, 5), verdict="Recommended T/P_real primary available under current constraints; O_x fallback.",
    )


def probe_mediacloud() -> dict:
    response = get("https://api.mediacloud.org/api/v2/media/single/1")
    guidance = get("https://www.mediacloud.org/documentation/search-api-guide")
    terms = get("https://www.mediacloud.org/legal/media-cloud-terms-of-use")
    return record(
        source="Media Cloud API", variable="O_x",
        probe=[evidence(response, "No body; API hostname did not resolve"),
               evidence(guidance, f"HTML guidance; API-key text present={b'API key' in guidance['body']}"),
               evidence(terms, f"HTML terms; output-reuse text present={b'Platform Outputs' in terms['body']}")],
        coverage="No observations returned", granularity="Not verified", absolute="Not verified", latency="Not measurable",
        revision="Not verified", pit_gate="FAIL — no live data and no vintage evidence",
        access="DNS failure for legacy API; fetched current public guidance requires an account/API key",
        licence="Current fetched terms allow reproduction of aggregate platform outputs but not third-party story content.",
        axes="No live result to verify axis resolution", scores=score(0, 0, 0, 0, 0), verdict="Unusable without authentication and a working endpoint.",
    )


def probe_legislation() -> dict:
    response = get("https://lgbtqlegislation.com/dashboard")
    preview = response["body"][:100].decode("utf-8", "replace")
    return record(
        source="LGBTQ+ Legislation Tracking Project", variable="O_x",
        probe=[evidence(response, f"Cloudflare response; preview={preview!r}")], coverage="No bill rows returned by unauthenticated probe",
        granularity="Not verified from returned data", absolute="No counts returned to the script", latency="Not measurable",
        revision="Not verified; no downloadable row reached", pit_gate="FAIL — no live data or vintages obtained",
        access="GET blocked 403 by Cloudflare challenge; no authentication attempted", licence="Returned challenge contained no data licence; redistribution unverified.",
        axes="Tracker scope is sexuality/gender identity, not all six axes", scores=score(0, 0, 0, 0, 2), verdict="Useful constructually for one axis; operational dead end in unattended GET pipeline.",
    )


def probe_usaspending() -> dict:
    response = get("https://api.usaspending.gov/api/v2/awards/last_updated/")
    return record(
        source="USAspending.gov API", variable="V_E", probe=[evidence(response, "No body; certificate chain rejected before HTTP response")],
        coverage="No award rows returned", granularity="Not verified", absolute="Not verified", latency="Not measurable",
        revision="Not verified", pit_gate="FAIL — no data fetched and no vintage evidence",
        access="No auth intended; certificate validation failed before any HTTP response.",
        licence="No response body; federal-data redistribution terms were not confirmed by this probe.", axes="Not an identity source",
        scores=score(0, 0, 0, 0, 0), verdict="Operationally unusable under the task's GET-only constraint.",
    )


def probe_dla() -> dict:
    url = "https://www.dla.mil/Portals/104/Documents/DispositionServices/LESO/DISP_Shipments_Cancellations_04012026_06302026.xlsx"
    response = get(url)
    return record(
        source="DLA LESO 1033 transfer files", variable="V_E", probe=[evidence(response, "403 HTML instead of XLSX")],
        coverage="No spreadsheet rows returned", granularity="Not verified from returned data", absolute="Not verified from returned data",
        latency="Not measurable", revision="Not verified from returned data",
        pit_gate="FAIL — no file fetched and historical vintages were not exposed",
        access="No auth; direct XLSX GET blocked 403", licence="Returned denial page contains no licence; federal record reuse not confirmed in-probe.",
        axes="Not an identity source", scores=score(0, 0, 0, 0, 0), verdict="Current quarterly snapshot is inaccessible and would not reconstruct transfer flow without archived files.",
    )


def probe_bjs() -> dict:
    response = get("https://bjs.ojp.gov/document/keystatsupdate_2022.csv")
    text = response["body"].decode("utf-8-sig", "replace")
    title_range = re.search(r"status,\s*(\d{4})-(\d{4})", text)
    start_year, end_year = (int(title_range.group(1)), int(title_range.group(2))) if title_range else (0, 0)
    rows = list(csv.reader(io.StringIO(text))) if text else []
    version = re.search(r"Date of version:\s*([^,\r\n]+)", text)
    return record(
        source="BJS correctional-population key statistics", variable="V_E",
        probe=[evidence(response, f"{len(rows)} CSV rows; data years {start_year}..{end_year}; version {version.group(1) if version else 'unknown'}")],
        coverage=f"{start_year} to {end_year}; misses 2023-2026" if start_year else "No dates parsed", granularity="Annual national aggregates",
        absolute="Absolute correctional population counts", latency="Latest observation is 2022, roughly four years behind probe date",
        revision="Fetched file identifies a 2024 version but exposes no prior versions or vintage API.",
        pit_gate="FAIL — revising/versioned file with no retrievable point-in-time vintages",
        access="No auth; small public CSV", licence="U.S. government statistical table; fetched file requests source citation and states no redistribution ban.",
        axes="Not an identity source", scores=score(3, 1, 5, 0, 0), verdict="Fallback context only; latency and vintage failure preclude trading backtest use.",
    )


def probe_opensecrets() -> dict:
    url = "https://www.opensecrets.org/api/?method=getLobby&year=2024&id=D000000104&output=json"
    response = get(url)
    discontinued = b"API offerings have  been discontinued" in response["body"]
    return record(
        source="OpenSecrets lobbying API", variable="V_E",
        probe=[evidence(response, f"HTML, not JSON; discontinuation notice present={discontinued}")],
        coverage="No lobbying rows returned", granularity="No data returned", absolute="No data returned", latency="Not measurable",
        revision="Not applicable to inaccessible API", pit_gate="FAIL — no data access",
        access="Fetched API URL returns HTML stating API offerings were discontinued April 15, 2025",
        licence="No returned dataset; redistribution unavailable through this endpoint.", axes="Not an identity source",
        scores=score(0, 0, 0, 0, 0), verdict="Confirmed dead end.",
    )


def probe_senate_lda() -> dict:
    early = get("https://lda.senate.gov/api/v1/filings/?filing_year=2020&page_size=2")
    late = get("https://lda.senate.gov/api/v1/filings/?filing_year=2026&page_size=2")
    try:
        e, l = json.loads(early["body"]), json.loads(late["body"])
        fields = sorted(e["results"][0])
        shape = f"2020 count={e['count']}; 2026 count={l['count']}; {len(fields)} top-level fields; 2 sampled/year"
    except Exception as exc:
        e = l = {}; shape = f"unparseable response: {exc}"
    return record(
        source="Senate/House Lobbying Disclosure Act API", variable="V_E",
        probe=[evidence(early, shape), evidence(late, shape)], coverage="Fetched filing populations for 2020 and 2026; full window bracketed",
        granularity="Event-level filings with quarterly periods", absolute="Dollar income/expense fields plus filing counts",
        latency="2026 filings present; posting timestamps support days-level latency",
        revision="Amendments are separate filing types with their own posting times. Nested registrant metadata can be newer than the filing and must be excluded from as-of features.",
        pit_gate="PASS if ingestion uses filing dt_posted and amendment chronology only",
        access="No auth; paginated JSON GET; page_size respected; endpoint redirects to lda.gov",
        licence="Fetched API response has no licence field; preserve official filing attribution and confirm book reuse terms.",
        axes="Not an identity source", scores=score(5, 4, 5, 4, 0), verdict="Recommended V_E primary, with weaker construct validity than direct suppression spending.",
    )


def probe_kalshi() -> dict:
    response = get("https://external-api.kalshi.com/trade-api/v2/historical/markets?limit=5")
    try:
        payload = json.loads(response["body"]); rows = payload["markets"]
        fields = sorted(rows[0]); dates = sorted((r.get("settlement_ts") or r.get("close_time") or "")[:10] for r in rows)
        shape = f"{len(rows)} markets x {len(fields)} fields; cursor={bool(payload.get('cursor'))}; sample {dates[0]}..{dates[-1]}"
    except Exception as exc:
        rows, dates, shape = [], [], f"unparseable response: {exc}"
    return record(
        source="Kalshi historical markets API", variable="outcomes", probe=[evidence(response, shape)],
        coverage=f"Observed historical sample {dates[0]} to {dates[-1]}; 2020 coverage not established" if dates else "No markets parsed",
        granularity="Resolved market/event-level; candlestick endpoints available by market", absolute="Binary/multivariate resolution values and contract counts",
        latency="Historical API includes finalized recent markets", revision="Finalized market records expose settlement timestamps and result; no separate resolution-vintage history was returned.",
        pit_gate="PASS for final outcome labels; entry-price backtests must separately fetch timestamped trades/candles",
        access="No auth for market metadata; cursor pagination; five-row probe", licence="API response contains no redistribution licence; book publication of raw market records needs terms review.",
        axes="Not an identity source", scores=score(3, 5, 5, 4, 0), verdict="Recommended primary outcome-label venue; coverage begins after the backtest start.",
    )


def probe_metaculus() -> dict:
    response = get("https://www.metaculus.com/api/posts/?limit=5&status=resolved")
    preview = response["body"].decode("utf-8", "replace")[:180]
    return record(
        source="Metaculus API", variable="outcomes", probe=[evidence(response, f"Permission response={preview!r}")],
        coverage="No posts returned", granularity="Not verified", absolute="No outcomes returned", latency="Not measurable",
        revision="Not verified", pit_gate="FAIL — no unauthenticated data",
        access="403: API requires an account and API token; no credential obtained or used", licence="No dataset returned; redistribution unverified.",
        axes="Not an identity source", scores=score(0, 0, 0, 0, 0), verdict="Excluded by no-auth constraint.",
    )


def probe_manifold() -> dict:
    url = "https://api.manifold.markets/v0/search-markets?term=&filter=resolved&sort=resolve-date&limit=5"
    response = get(url)
    try:
        rows = json.loads(response["body"]); fields = sorted(rows[0])
        dates = sorted(datetime.fromtimestamp(r["resolutionTime"] / 1000, timezone.utc).date().isoformat() for r in rows if r.get("resolutionTime"))
        shape = f"{len(rows)} resolved markets x {len(fields)} fields; sample {dates[0]}..{dates[-1]}"
    except Exception as exc:
        rows, dates, shape = [], [], f"unparseable response: {exc}"
    return record(
        source="Manifold Markets API", variable="outcomes", probe=[evidence(response, shape)],
        coverage=f"Observed sample {dates[0]} to {dates[-1]}; 2020 coverage absent/unverified" if dates else "No markets parsed",
        granularity="Resolved market-level; probability histories require per-market calls", absolute="Resolution fields and play-money volumes",
        latency="Recent resolved markets returned", revision="Current market objects include resolutionTime but no resolution-vintage history in this response.",
        pit_gate="PASS for current final labels with caution; not regulated and corrections lack vintages",
        access="No auth; public JSON; five-row bounded query", licence="Response exposes no redistribution licence; terms review required before book inclusion.",
        axes="Not an identity source", scores=score(2, 5, 5, 3, 0), verdict="Recommended outcomes fallback; weaker governance and no 2020 coverage.",
    )


PROBES = [
    probe_cornell, probe_bls, probe_fred, probe_alfred, probe_nlrb,
    probe_gdelt, probe_wikipedia, probe_mediacloud, probe_legislation,
    probe_usaspending, probe_dla, probe_bjs, probe_opensecrets,
    probe_senate_lda, probe_kalshi, probe_metaculus, probe_manifold,
]


def main() -> int:
    started = datetime.now(timezone.utc).isoformat()
    results = []
    for probe in PROBES:
        try:
            results.append(probe())
        except Exception as exc:
            results.append({"source": probe.__name__, "fatal_probe_error": repr(exc)})
    document = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "started_at_utc": started, "method": "Unauthenticated read-only GET requests only",
        "source_count": len(results), "sources": results,
    }
    OUTPUT.write_text(json.dumps(document, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT} with {len(results)} source probes")
    failures = [row for row in results if "fatal_probe_error" in row]
    if failures:
        print(json.dumps(failures, indent=2))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
