# L11 Findings — Backtest-Grade Replacements for Google Trends

## Recommendation

| Variable | Primary | Fallback | Current admission status |
|---|---|---|---|
| `T` / `P_real` | Wikipedia Pageviews with a versioned class-pressure article manifest | Cornell/Illinois Labor Action Tracker with archived snapshots and a 2020 supplement | Primary passes with revision caution; fallback currently fails |
| `O_x` | GDELT 2.0 GKG theme counts | Wikipedia Pageviews with six versioned axis manifests | Both pass; GDELT requires mapping validation |
| `V_E` | Senate/House LDA filings using posting-time and amendment chronology | BJS correctional population | Primary passes conditionally; fallback fails |
| outcomes | Kalshi historical markets | Manifold Markets | Both pass for final labels; neither probe establishes 2020 coverage |

`tau` remains derived from `P_real` and needs no independent source.

## What the survey changed

The Cornell tracker has a public JSON feed at `labor_actions.json`. The live feed contained 4,896 events from 2021-01-01 through 2026-08-06. Its annual report confirms retrospective additions to prior years. This makes it a strong direct-measure validation set and an inadmissible unsnapshotted feature source.

NLRB election results are public through paginated GETs. The live pages reported 34,934 event records spanning 1994-03-04 through 2026-08-07. Open cases and the absence of a vintage route trigger the point-in-time gate.

The BLS API was temporarily unavailable, FRED and ALFRED failed at transport, USAspending failed certificate validation, DLA returned 403, and the legislative tracker returned a Cloudflare challenge. These failures are recorded as operational findings. Their rows contain no inferred data fields.

OpenSecrets has ended its API offering. The live page states an April 15, 2025 discontinuation date. The official Senate/House LDA API provides the replacement: the probes reported 84,097 filings for 2020 and 55,371 for 2026, with quarterly periods, posting timestamps, dollar fields, amendment types, issues, clients, and government entities.

Metaculus now requires an authenticated account and API token. Kalshi and Manifold returned resolved-market records without authentication.

## Why each primary was selected

### T / P_real: Wikipedia Pageviews

No probed direct labor source passed both the full-window and point-in-time requirements. Wikipedia returned 2,412 daily observations for the single `Trade_union` test article across the complete window. The values are absolute user pageviews. A production measure would aggregate a frozen, version-controlled manifest of articles representing strikes, unions, inflation, real wages, rent stress, and layoffs.

This remains an attention measure. Its scale and reproducibility solve the sampling, request renormalization, censoring, and cross-request comparability defects in Trends. Its construct validity remains below event-level labor data. Cornell and NLRB should serve as external validation targets after their historical snapshots are secured.

### O_x: GDELT 2.0 GKG

GDELT returned 1,253 records × 27 fields for the 2020 boundary slice and 893 × 27 for the 2026 boundary slice. Both samples contained theme strings matching race, gender, religion, sexuality, nationality, and ability. The latest manifest timestamp was current within the probe hour. Timestamped bulk slices support point-in-time reconstruction.

The six-axis mapping requires a published codebook and a human-coded validation sample. Theme co-occurrence, source duplication, syndicated articles, global coverage, and changing source composition need explicit controls. The initial implementation should restrict geography, deduplicate URLs, aggregate absolute article counts daily, and preserve the exact theme mapping used for each backtest run.

Wikipedia is the fallback because it returned complete daily absolute data and permits a separate frozen article set for every axis. It carries stronger researcher-choice sensitivity than the GKG taxonomy.

### V_E: Senate/House LDA API

The LDA API is the only suppression-family candidate that returned full-window, absolute, timestamped records and a workable point-in-time rule. Filings and amendments have separate posting times. An as-of ingester can reconstruct the disclosure set available on each forecast date.

Nested registrant metadata in a historical filing can show a later update timestamp. Those nested current-state fields must be excluded. Features should use filing UUID, filing type, period, `dt_posted`, income, expenses, client as filed, issue codes, and amendment relationships available by the cutoff.

Lobbying intensity has limited specificity to suppression allocation. It measures elite political expenditure across many goals. A defensible `V_E` requires a suppression-related issue/program taxonomy validated against direct law-enforcement grants, 1033 transfers, and incarceration changes. The present source can wire a measured series and cannot establish that the series captures the framework variable adequately.

### Outcomes: Kalshi

Kalshi returned finalized historical-market records with 44 fields and cursor pagination. It is regulated and supplies explicit settlement fields. Final outcomes can score forecasts. Entry-price backtests require timestamped price or trade history acquired strictly before each simulated decision.

The probe established current historical availability and did not establish 2020 coverage. Manifold returned equivalent final-label fields and offers a usable fallback for later periods. Its play-money design and weaker resolution governance require a separate reliability flag.

## Ingestion cost

### GDELT

Observed compressed slice sizes were 5.29 MB and 3.77 MB. At 96 fifteen-minute slices per day, a naive full download implies roughly 0.36–0.51 GB per day and approximately 0.8–1.1 TB over the six-year window. This is an extrapolation from two measured slices. A practical ingester should stream each ZIP through temporary storage, retain only U.S.-relevant theme aggregates, and delete the raw slice after checksumming and aggregation. BigQuery may reduce transfer volume and introduces authentication and query cost; it was outside this task.

### Wikipedia

The single article probe returned 356 KB for 2,412 days. A 40–60 article manifest would produce roughly 14–21 MB at the observed response size before compression and batching. Implementation cost is low. Redirects, renames, disambiguation pages, and article-manifest versions require handling.

### Senate/House LDA

The reported annual populations are tens of thousands of filings. The API is paginated and nested responses are verbose. Initial ingestion is moderate: paginate by filing year and quarter, store immutable filing-level fields, normalize amendments, and compute as-of quarterly totals. Incremental updates can use posting time and filing UUID.

### Kalshi and Manifold

Outcome-label ingestion is moderate. It requires cursor pagination, market eligibility rules, duplicate/related-contract handling, cancellation and ambiguous-resolution exclusions, and separate timestamped price acquisition. Storage volume is small relative to GDELT.

## What remains unmeasurable

1. A direct, full-window, vintage-safe class-pressure series was not obtained. Wikipedia is an absolute attention proxy.
2. Historical Byrne JAG and COPS award flows were not fetched under GET-only access.
3. Historical 1033 transfer flow was not fetched. The attempted DLA file was blocked, and current snapshots would require archival reconstruction.
4. A point-in-time incarceration series through 2026 was not found. The fetched BJS file ends in 2022 and lacks vintages.
5. The GDELT theme-to-axis mapping has not been validated against human coding.
6. Outcome-market coverage for the entire 2020–2026 interval was not established.
7. Data-redistribution permission for Cornell, Kalshi, Manifold, and LDA-derived book tables requires explicit terms review or permission.

## Can this support a backtest whose output is a trading decision?

**No, in its current state.**

The inventory supports an auditable research backtest for `O_x` from GDELT, a reproducible attention-based `T/P_real` series from Wikipedia, a conditional lobbying-based `V_E` series from LDA filings, and final labels for later event-market periods. Three defects prevent a trading-grade claim:

1. `T/P_real` lacks a direct full-window primary that passes the vintage gate.
2. `V_E` lacks a validated link from general lobbying expenditure to suppression allocation.
3. The outcome probes do not establish resolved-market and entry-price coverage from 2020 onward.

A trading decision requires an as-of data contract for every feature, frozen mappings, source-health monitoring, a complete eligible-outcome universe, timestamped executable prices, transaction costs, and out-of-sample calibration. The current findings define the viable data path and the remaining empirical work.

## Required next implementation sequence

1. Build a small GDELT feasibility ingester for two weeks, validate six-axis mappings on a stratified article sample, and measure daily transfer/storage cost.
2. Freeze and review Wikipedia class and identity article manifests; test redirect and rename behavior across the full window.
3. Build an LDA filing-time reconstruction test that proves later registrant updates cannot enter historical feature rows.
4. Acquire dated Cornell snapshots or create a prospective snapshot schedule; locate an independent 2020 strike source.
5. Establish Kalshi and Manifold market availability, final outcomes, and pre-decision prices across every target date.
6. Run the first research backtest only after all feature rows carry a source timestamp, availability timestamp, mapping version, and vintage identifier.

---

# Reviewer's Addendum — independent re-probe

The survey above ran inside a sandbox. Five sources failed there for transport
reasons — TLS validation, 403, Cloudflare challenge — and those failures were
correctly recorded as operational rather than being filled in from
documentation. But they distorted the ranking, because the sources that failed
are precisely the ones offering **direct measurement** rather than attention
proxies. Re-probed from the host:

| Source | Sandbox result | Host re-probe |
|---|---|---|
| USAspending.gov | certificate validation failure | **HTTP 200, returns real awards** |
| FRED | transport failure | HTTP 400 — **API-key gated**, free registration, not broken |
| BLS | temporarily unavailable | genuinely down for maintenance — sandbox result confirmed |
| DLA LESO 1033 | 403 | 403 — **confirmed blocked**, not a sandbox artifact |

## Correction: `V_E` primary is USAspending, not lobbying disclosure

The report recommends Senate/House LDA filings for `V_E` while conceding that
lobbying "has limited specificity to suppression allocation" — it measures elite
political expenditure across every goal, of which suppression is one. That
concession is the right instinct, and it is decisive once USAspending is
reachable.

Verified live from the host, unauthenticated:

- **Byrne JAG (CFDA 16.738), FY2020** — City of Milwaukee $16,729,686.80;
  City of Charlotte $16,787,139.10.
- **COPS (CFDA 16.710), FY2025–26** — award `15JCOPS25GK01404CRIT` $4,375,000;
  `15JCOPS25GK01025PPSE` $1,500,000.

Both ends of the 2020–2026 window return itemized federal law-enforcement
funding in **dollars**. This is not a proxy for suppression allocation; within
the scope of federal grant flows it is the quantity itself, and it is what
`variables.yaml` already registers as the Phase-2 proxy for `V_E`
("Federal law-enforcement grants, 1033 program transfers, and incarceration
deltas"). `V_E` is currently hardcoded to `0.0` at `interference_engine.py:94`.

**Point-in-time.** Award records carry dated actions, so an as-of series can be
built by filtering on action date rather than reconstructing vintages. This must
be verified rather than assumed — retroactive corrections to award amounts are
the risk, and an ingester has to prove a later modification cannot leak into an
earlier feature row. Treat it as the same gate the LDA analysis applies to
nested registrant metadata.

**LDA keeps a role** as a distinct signal: lobbying intensity is elite political
spend, which is a different framework quantity from suppression allocation.
Recording it as its own series is more defensible than substituting it for `V_E`.

## Standing caution on `T` / `P_real`

Recommending Wikipedia Pageviews for `T`/`P_real` fixes reproducibility without
fixing construct validity — the report says so plainly, and that honesty is why
it should not be quietly adopted. Trends and Wikipedia are both attention
measures. `T` is defined in `variables.yaml` as class-coherence *pressure*, and
strike days idled is that quantity; pageviews for `Trade_union` are interest in
it.

Given BLS was down at probe time rather than gone, and FRED needs only a free
key, the direct sources are not ruled out — they are untested. Resolve them
before settling for an attention proxy on the one variable where the registry
already names a direct measurement. Accepting monthly granularity from BLS beats
daily granularity of the wrong construct.

## Verification of this survey

- `data_source_probes.json` regenerated end-to-end from
  `systemic_arbitrage.probe_sources`: 17 probes, no fatal errors, no hand-editing.
- `make arbitrage-test` — 170 passed.
- Wikipedia Pageviews independently confirmed: absolute daily counts, full window,
  no auth. The `Critical_race_theory` series runs 18,485 views in January 2020 to
  376,265 in January 2022, then decays — the magnitude Trends discards. Two
  ingestion rules: the most recent month is always partial and must be dropped,
  and article renames silently truncate a series.
