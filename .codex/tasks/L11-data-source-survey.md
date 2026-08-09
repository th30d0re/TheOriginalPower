# TASK L11 — Find backtest-grade data to replace Google Trends

**This is the project's primary objective.** Everything downstream is blocked on
it. Do not implement an ingester. Produce a **verified, scored inventory** of
candidate data sources, where every entry has been fetched at least once by you.

## Why Trends is insufficient

`systemic_arbitrage/` currently measures every framework variable through Google
Trends keyword baskets. Trends is a **relative, sampled, re-normalized index**:

- Values are scaled 0–100 *within each request*, so two fetches are not
  comparable without an anchor term.
- The underlying sample is drawn per query; repeat requests return different
  numbers for the same window.
- There are no absolute counts and no revision history, so a value cannot be
  reconstructed as it stood on a past date.
- Low-volume terms are censored to zero — see `docs/L9-findings.md`, where 8 of
  10 tested terms returned flat zero across 2020–2026.

That is adequate to illustrate a shape. It cannot support a backtest whose
output is a trading decision.

**The registry already knows better.** Read `variables.yaml`: every symbol has a
`phase_1_sources` list naming real datasets — BLS strike statistics, DOJ
appropriations, OpenSecrets lobbying totals, BJS incarceration, 1033 transfers.
Phase 2 replaced all of them with keyword baskets. Phase 1's sources are tier-1
and tier-2 direct measurement; the Trends replacement is a tier-3 attention
proxy. Your job is to find what makes Phase 1's measurement quality available at
backtest frequency.

## The variables that need measuring

From `variables.yaml`. A candidate source is only interesting if it maps to one
of these:

| Symbol | What it must measure |
|---|---|
| `T` / `P_real` | Class-coherence pressure: strikes, union activity, material/economic anxiety |
| `O_x` | Identity-band salience, resolved across the six axes (see `docs/L9-findings.md`) |
| `V_E` | Elite suppression allocation — currently hardcoded to `0.0`, never wired |
| `tau` | Derived from `P_real`; needs no new source |
| outcomes | Resolved event markets for scoring |

## Candidates to probe

Start here. Add others you find; justify each addition.

**Class pressure (`T`, `P_real`)**
- Cornell ILR Labor Action Tracker — event-level strikes, US, free CSV
- BLS Work Stoppages series — major stoppages, long history
- FRED / **ALFRED** — union density, CPI, real wages, labor share, unemployment
- NLRB election petitions and unfair-labor-practice filings

**Identity salience (`O_x`)**
- **GDELT 2.0 GKG** — daily global news, theme-coded and tone-coded, absolute
  article counts, free bulk files plus BigQuery. Likely the strongest candidate:
  its theme taxonomy can be mapped onto the six axes without keyword guessing.
- **Wikipedia Pageviews API** — absolute daily views per article since 2015. No
  sampling, no renormalization, no censoring. The closest direct replacement for
  what Trends was being asked to do.
- Media Cloud API
- Legislative trackers (e.g. anti-trans bill counts by state and year) — these
  measure the *deployment* of an axis rather than attention to it, which is
  arguably closer to what the framework claims

**Suppression (`V_E`)**
- USAspending.gov API — federal assistance awards by program (Byrne JAG, COPS);
  real dollars, quarterly
- DLA LESO 1033 public transfer files — itemized, quarterly
- BJS incarceration series
- OpenSecrets / OpenFEC lobbying totals

**Outcomes**
- Kalshi (regulated, documented API, resolution history)
- Metaculus
- Manifold

## What you must record per source

A row with any field unverified is not done. Fetch it and report what you got,
not what the documentation claims.

1. **Probe result** — the request you made and the shape of what came back
   (rows, columns, date span actually returned).
2. **Coverage** — real start and end dates. Must cover the backtest window
   (2020-01-01 to 2026-01-01) to be usable now.
3. **Granularity** — daily / weekly / monthly / quarterly / event-level.
4. **Absolute or relative** — does it give counts or an index? Relative indices
   inherit the Trends problem.
5. **Latency** — how far behind real time is the most recent observation.
6. **Revision policy — read this one carefully.** Does the source revise past
   values? If it does and you cannot retrieve a **point-in-time vintage**, then
   using today's values in a backtest dated 2021 is **lookahead bias** and the
   result is worthless. FRED revises; ALFRED serves vintages. For every revising
   source, record whether a vintage API exists. Mark sources that revise without
   vintages as **unusable for backtesting** regardless of how good they look.
7. **Access** — auth required, API key, rate limits, bulk download available.
8. **Licence** — terms for research and for a book. Note anything that forbids
   redistribution, since some of this may end up in the manuscript.
9. **Axis mapping** — for identity sources, whether it can resolve the six axes
   separately or only in aggregate.

## Scoring

Score each source 0–5 on: coverage, granularity, absoluteness, point-in-time
availability, and axis resolution. **Point-in-time availability is a gate, not a
score** — a revising source with no vintages cannot pass regardless of its other
marks. Rank within each variable and name a single recommended primary plus one
fallback.

## Deliverables

1. `systemic_arbitrage/docs/DATA-SOURCES.md` — the scored inventory, one section
   per variable, with the probe evidence inline.
2. `systemic_arbitrage/probe_sources.py` — the probe script you actually ran.
   Deterministic, re-runnable, one function per source, each returning the
   recorded fields. It writes `docs/data_source_probes.json`. This is what makes
   the inventory auditable instead of a literature review.
3. `systemic_arbitrage/docs/L11-findings.md` — recommendation and reasoning:
   which source replaces Trends for each variable, what it costs to ingest, what
   remains unmeasurable, and the honest answer to **"can this support a backtest
   whose output is a trading decision?"**

## Hard constraints

- Network access is enabled for this task. Use it for **read-only GET requests
  to the public endpoints above and any public source you add**. Do not POST,
  do not authenticate with any credential found on this machine, do not send
  repository contents anywhere, and do not sign up for anything. If a source
  needs an API key, record that as a finding — do not go get one.
- Respect rate limits. Sleep between requests. A probe is one small sample, not
  a bulk download; do not pull multi-gigabyte GDELT archives.
- Do NOT run any `git` command.
- Do NOT edit `Paper/`.
- Do NOT modify `backtest.py`, `costs.py`, `risk_controls.py`, `paper_trader.py`,
  `live_executor.py`, or the `SYSTEMIC_ARBITRAGE_LIVE` gate.
- Do NOT change `variables.yaml` or any existing ingester. This loop surveys;
  a later loop implements.
- Do NOT write large data files into the repo. Probes keep samples small; if you
  need scratch space use `/tmp`.

## Verify

```bash
make arbitrage-test
```

170 tests pass today; all must still pass. Then run `probe_sources.py`
end-to-end and confirm it regenerates `docs/data_source_probes.json` without
hand-editing.

## Report honestly

Some of these will be dead ends — an API that now requires payment, a dataset
that stops in 2019, a source that revises silently. **Those are the most
valuable findings in the report.** Write down what failed and why. Do not fill a
row with documentation claims you could not confirm by fetching. The two prior
loops in this directory were worth merging precisely because they refused to
report numbers they had not measured.
