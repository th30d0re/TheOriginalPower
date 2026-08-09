# L11 Verified Data-Source Inventory

Generated from `probe_sources.py` on 2026-08-09. Every source below received at least one live, unauthenticated GET. The complete machine record, including effective URLs, byte counts, curl exit codes, and errors, is in `data_source_probes.json`.

## Scoring and gate

Each dimension is scored 0–5: coverage of 2020-01-01 through 2026-01-01, temporal granularity, absolute measurement, point-in-time availability, and six-axis resolution. Axis resolution is zero for variables where it does not apply. Totals are descriptive. A point-in-time `FAIL` makes a source inadmissible for backtesting even when its total is high.

## T / P_real — class-coherence pressure

### Ranking

| Rank | Source | Coverage | Granularity | Absolute | PIT | Axes | Total | Gate |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Wikipedia Pageviews | 5 | 5 | 5 | 4 | 5 | 24 | PASS with caution |
| 2 | NLRB election results | 5 | 5 | 5 | 0 | 0 | 15 | FAIL |
| 3 | Cornell/Illinois Labor Action Tracker | 4 | 5 | 5 | 0 | 0 | 14 | FAIL |
| 4 | BLS Work Stoppages | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |
| 5 | FRED current series | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |
| 6 | ALFRED vintage series | 0 | 0 | 0 | 0 | 0 | 0 | FAIL operationally |

Primary: **Wikipedia Pageviews**, using a versioned article manifest for strikes, unions, inflation, rent, wages, layoffs, and related material-pressure concepts. Fallback: **Cornell/Illinois Labor Action Tracker**, conditional on archived dated snapshots and a separate 2020 source. The fallback currently fails the gate.

### Wikipedia Pageviews API

- Probe: `GET https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Trade_union/daily/20200101/20260809`
- Result: HTTP 200, 356,304 bytes, 2,412 JSON rows, 7 fields, observations from 2020-01-01 through 2026-08-08.
- Coverage and granularity: complete window; daily per article.
- Measurement: absolute user pageviews without request-relative normalization.
- Latency: one day in this probe.
- Revision/PIT: dated observations remain retrievable. The API exposes no formal vintage selector. The gate passes with reprocessing risk recorded.
- Access: no auth; bounded public REST GET.
- Licence: the response carries aggregate counts and no licence field. Attribute Wikimedia; exclude article content from redistribution.
- Mapping: curated article sets can separate all six identity axes and a class-pressure set. Article selection remains a model specification.

### NLRB recent election results

- Probes: `GET https://www.nlrb.gov/reports/graphs-data/recent-election-results/date_issued/asc/100` and the corresponding `/desc/100` request.
- Result: two HTTP 200 pages of 100 records. The pages report 34,934 total election-result records and bracket 1994-03-04 through 2026-08-07. Records include eligible voters, ballot totals, union votes, filing dates, and case status.
- Coverage and granularity: complete window; event-level.
- Measurement: absolute ballot and eligible-voter counts.
- Latency: two days.
- Revision/PIT: live records include open cases. No vintage or change-history endpoint appeared in the GET responses. Gate fails.
- Access: no auth; paginated HTML GET. The page exposes a workflow-generated CSV button.
- Licence: federal records; fetched pages state no redistribution restriction.
- Mapping: direct union activity; no identity-axis mapping.

### Cornell/Illinois Labor Action Tracker

- Probes: `GET https://striketracker.ilr.cornell.edu/labor_actions.json` and the live 2025 report page.
- Result: HTTP 200; 4,934,790-byte JSON object with 4,896 keyed events and 17 fields. Dated records span 2021-01-01 through 2026-08-06. The fetched report explicitly records additions to prior-year strike data.
- Coverage and granularity: event-level; 2020 is absent.
- Measurement: absolute events, participants, duration, demands, industry, location, and sources.
- Latency: latest event was three days old.
- Revision/PIT: prior years are revised and no vintage endpoint was found. Gate fails.
- Access: no auth; public JSON feed. The full response is 4.9 MB.
- Licence: citation guidance is present. A data licence is absent; book redistribution requires permission.
- Mapping: direct labor pressure; no identity-axis mapping.

### BLS Work Stoppages

- Probe: `GET https://api.bls.gov/publicAPI/v2/timeseries/data/WSU001?startyear=2020&endyear=2026`
- Result: HTTP 503, 5,726-byte maintenance HTML, zero observations.
- Coverage, granularity, measurement, latency, and revision: unverified because no data rows returned.
- Access: unauthenticated GET was operationally unavailable during both exploratory and final runs.
- Licence: no data or licence field returned.
- Gate: fails because the auditable probe could not fetch the source.

### FRED current series

- Probe: `GET https://fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE&cosd=2020-01-01&coed=2026-01-01`
- Result: curl exit 92, HTTP/2 internal error, zero bytes and zero observations.
- Coverage, granularity, measurement, latency, and licence: unverified from returned data.
- Revision/PIT: the requested current-series route contains no vintage parameter. Gate fails.
- Access: no auth route attempted; live transport failed.

### ALFRED vintage series

- Probe: `GET https://fred.stlouisfed.org/graph/alfredgraph.csv?id=UNRATE&vintage_date=2021-01-01&cosd=2020-01-01&coed=2021-01-01`
- Result: curl exit 92, HTTP/2 internal error, zero bytes and zero vintage observations.
- Coverage, granularity, measurement, latency, and licence: unverified from returned data.
- Revision/PIT: the request selected a 2021-01-01 vintage. Operational fetch failure prevents a pass.
- Access: no auth route attempted; live transport failed.

## O_x — six-axis identity salience

### Ranking

| Rank | Source | Coverage | Granularity | Absolute | PIT | Axes | Total | Gate |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | GDELT 2.0 GKG | 5 | 5 | 5 | 5 | 4 | 24 | PASS |
| 2 | Wikipedia Pageviews | 5 | 5 | 5 | 4 | 5 | 24 | PASS with caution |
| 3 | LGBTQ+ Legislation Tracker | 0 | 0 | 0 | 0 | 2 | 2 | FAIL |
| 4 | Media Cloud | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |

Primary: **GDELT 2.0 GKG**. Fallback: **Wikipedia Pageviews**.

### GDELT 2.0 GKG bulk files

- Probes: GETs for `20200101000000.gkg.csv.zip`, `20260101000000.gkg.csv.zip`, `lastupdate.txt`, and the project home page.
- Result: both ZIPs returned HTTP 200. The 2020 slice was 5,288,568 compressed bytes and expanded to 1,253 rows × 27 fields. The 2026 slice was 3,767,552 compressed bytes and expanded to 893 rows × 27 fields. The manifest reported `20260809150000` as the latest GKG timestamp.
- Coverage and granularity: fetched records at both window boundaries; 15-minute slices, aggregatable daily.
- Measurement: absolute article records with themes and tone.
- Latency: the manifest was current within the probe hour.
- Revision/PIT: timestamp-named bulk objects are point-in-time artifacts. Gate passes.
- Access: no auth; public ZIP bulk. Two slices totaled about 9 MB. BigQuery was excluded because the task forbids authentication.
- Licence: the fetched project page states that the database is free and open. Underlying article text remains third-party content and should not be redistributed.
- Axis mapping: both sampled archives contained theme strings matching all six axes. The score is 4 because a validated theme-to-axis codebook remains necessary.

### Wikipedia Pageviews as O_x fallback

The probe evidence is recorded under `T / P_real`. Separate versioned article manifests can resolve all six axes. Daily absolute counts satisfy frequency and scale requirements. The mapping remains attention-based and depends on article curation.

### LGBTQ+ Legislation Tracking Project

- Probe: `GET https://lgbtqlegislation.com/dashboard`
- Result: HTTP 403, 5,502-byte Cloudflare challenge, no bill rows.
- Coverage, granularity, counts, latency, revisions, and licence: unverified from data because the unattended GET was blocked.
- Access: browser challenge required; no authentication or bypass attempted.
- Axis mapping: project scope covers sexuality and gender identity. It cannot resolve all six axes.
- Gate: fails.

### Media Cloud

- Probes: legacy API GET, current search-API guide GET, and current terms GET.
- Result: the legacy `api.mediacloud.org` hostname did not resolve. The current guidance and terms pages returned HTTP 200. The terms permit reproduction of aggregate platform outputs and prohibit assuming rights to third-party story content.
- Coverage, granularity, counts, latency, and revisions: no live API data returned.
- Access: current guidance requires an account/API key; no credential was obtained or used.
- Axis mapping: unverified from live results.
- Gate: fails.

## V_E — elite suppression allocation

### Ranking

| Rank | Source | Coverage | Granularity | Absolute | PIT | Axes | Total | Gate |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Senate/House LDA API | 5 | 4 | 5 | 4 | 0 | 18 | PASS conditionally |
| 2 | BJS correctional population | 3 | 1 | 5 | 0 | 0 | 9 | FAIL |
| 3 | USAspending.gov | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |
| 4 | DLA LESO 1033 | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |
| 5 | OpenSecrets lobbying API | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |

Primary: **Senate/House Lobbying Disclosure Act API**, with filing-time restrictions. Fallback: **BJS correctional population**, suitable only as delayed contextual validation because it fails the vintage gate.

### Senate/House Lobbying Disclosure Act API

- Probes: GET filing pages for `filing_year=2020&page_size=2` and `filing_year=2026&page_size=2`.
- Result: both HTTP 200 JSON. The 2020 response reported 84,097 filings; the 2026 response reported 55,371. Each sampled filing had 30 top-level fields, including filing type, quarter, posting time, income, expenses, client, registrant, issues, lobbyists, and government entities.
- Coverage and granularity: full window bracketed; event-level filings organized quarterly.
- Measurement: absolute dollar and filing counts.
- Latency: 2026 records and posting timestamps were present.
- Revision/PIT: amendments are separate filing types with posting timestamps. Nested registrant objects can carry later updates; an ingester must exclude those mutable nested fields and apply amendment chronology as of each forecast date. Gate passes under that rule.
- Access: no auth; paginated JSON GET; `lda.senate.gov` redirected to `lda.gov`.
- Licence: the API response has no licence field. Preserve official filing attribution and confirm book reuse terms.
- Construct validity: lobbying intensity is an elite-allocation proxy with weaker specificity than law-enforcement grants or military transfers.

### BJS correctional-population key statistics

- Probe: `GET https://bjs.ojp.gov/document/keystatsupdate_2022.csv`
- Result: HTTP 200, 7,306 bytes, 60 CSV rows. The table covers 1980–2022 and identifies its version as 2024-09-06.
- Coverage and granularity: annual; observations stop in 2022.
- Measurement: absolute correctional-population counts.
- Latency: about four years.
- Revision/PIT: the current file has a version date and exposes no prior versions or vintage API. Gate fails.
- Access: no auth; small CSV.
- Licence: federal statistical table with requested source citation and no redistribution ban in the fetched file.

### USAspending.gov

- Probe: `GET https://api.usaspending.gov/api/v2/awards/last_updated/`
- Result: certificate validation failed before an HTTP response; zero bytes.
- Coverage, granularity, dollar fields, latency, revisions, and licence: unverified from returned data.
- Access: no authentication attempted.
- Gate: fails.

### DLA LESO 1033 transfer files

- Probe: direct GET for the public 2026 Q3 shipments/cancellations XLSX.
- Result: HTTP 403 HTML, 501 bytes, no spreadsheet rows.
- Coverage, granularity, values, latency, revision policy, and licence: unverified from returned data.
- Access: no auth; direct file blocked.
- Gate: fails.

### OpenSecrets lobbying API

- Probe: unauthenticated `getLobby` GET for a 2024 organization.
- Result: HTTP 200, 257,495 bytes of HTML instead of JSON. The fetched page states: “As of April 15, 2025, our API offerings have been discontinued.”
- Coverage and measurement: no rows returned.
- Access and gate: confirmed dead endpoint; fails.

OpenFEC was considered within this candidate family. Its live public surface measures campaign finance, not Lobbying Disclosure Act spending, so it was not scored as a lobbying-total source. The official LDA API was added because its fetched records directly contain lobbying filings and dollar fields.

## Outcomes — resolved event markets

### Ranking

| Rank | Source | Coverage | Granularity | Absolute | PIT | Axes | Total | Gate |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | Kalshi historical markets | 3 | 5 | 5 | 4 | 0 | 17 | PASS for labels |
| 2 | Manifold Markets | 2 | 5 | 5 | 3 | 0 | 15 | PASS with caution |
| 3 | Metaculus | 0 | 0 | 0 | 0 | 0 | 0 | FAIL |

Primary: **Kalshi historical markets**. Fallback: **Manifold Markets**.

### Kalshi historical markets

- Probe: `GET https://external-api.kalshi.com/trade-api/v2/historical/markets?limit=5`
- Result: HTTP 200, 13,222 bytes, five markets × 44 fields, plus a pagination cursor. The returned sample settled on 2026-06-09.
- Coverage: the response proves 2026 availability. It does not establish 2020 coverage.
- Granularity and measurement: market/event-level final outcomes, timestamps, prices, and contract-count fields.
- Latency: finalized recent markets are present.
- Revision/PIT: settlement timestamps and results support final scoring labels. The response exposed no separate resolution-vintage history.
- Access: no auth for market metadata; cursor pagination.
- Licence: no redistribution licence in the response; terms review is required before publishing raw records.

### Manifold Markets

- Probe: `GET https://api.manifold.markets/v0/search-markets?term=&filter=resolved&sort=resolve-date&limit=5`
- Result: HTTP 200, 4,944 bytes, five resolved markets × 28 fields, all resolved on 2026-08-09.
- Coverage: the sample confirms current resolution data and does not establish 2020 coverage.
- Granularity and measurement: event-level resolution fields and play-money volume.
- Revision/PIT: resolution timestamps are present; no correction-vintage history appeared. Gate passes with caution for final labels.
- Access: no auth; bounded public JSON GET.
- Licence: no redistribution licence in the response; confirm terms before book use.

### Metaculus

- Probe: `GET https://www.metaculus.com/api/posts/?limit=5&status=resolved`
- Result: HTTP 403, 134 bytes. The response states that the API is available only to authenticated users and requires an API token.
- Coverage and fields: no posts returned.
- Access and gate: excluded by the no-auth constraint; fails.
