# Brief — Provenance audit of the empirical layer

## The question

For every empirical artifact the manuscript presents, three things must be true:

1. **Traceable** — a named script or notebook produced it from a named input.
2. **Reproducible** — running that producer today yields what is committed.
3. **Correctly labelled** — its confidence tier matches what it actually is.

Determine where those break. **Report only. Change nothing.**

## Why — four confirmed instances, do not re-derive these

This audit exists because the same defect appeared four times in one evening, in
unrelated places:

- **Synthetic presented as observed.** `Paper/data/congressional_record_word_freq_per_axis.csv`
  is a historical-event mixture model (`Paper/scripts/eq_fourier_per_axis.py:8-33`) —
  logistic baselines plus Gaussian impulses hand-centred on chosen events — and it
  disclaims ground-truth recovery. It has been consumed downstream as measurement.
- **Exploratory presented as measured.** `fig:extraction_chart` labels markers "measured"
  that are Lomb–Scargle dominant peaks from a 57-case corpus.
- **Processed file does not reproduce from its own raw.**
  `Paper/data/scotus_keyword_counts.csv` has 59 rows; regenerating it from the committed
  `Paper/data/raw/scotus_keyword_counts_raw.csv` yields 74 undeduplicated per-document
  rows and changes `total_words` on 64 of 78 merged rows. A deduplication step is missing
  from `preprocess_spectral_data.py`.
- **False provenance header.** `Paper/data/gdelt_per_axis.csv` claimed BigQuery v2 for
  data pulled from a plain HTTP file server. Already corrected.

Treat these four as known. Find the rest.

## Scope — bounded deliberately

Auditing all 142 indexed equations is too large and most of the risk is concentrated.
Cover exactly:

1. **Every Tier 1 and Tier 2 entry** in `Paper/empirical_index.tex` — 34 T1 and 39 T2 by
   current count. These are the entries claiming calibrated measurement, so mislabelling
   costs most here. T3 entries are structural or ordinal; skip them.
2. **Every figure** in the manuscript and its appendices that plots data.
3. **Every file in `Paper/data/`** — does it carry a provenance header, does that header
   name a real producer, and does the producer exist.

## For each item, record

| Field | Meaning |
|---|---|
| `artifact` | equation label, figure label, or data filename |
| `producer` | the script/notebook that generates it, with `file:line`, or `UNKNOWN` |
| `input` | what it consumes, with path |
| `reproduces` | `YES` / `NO` / `NOT RUN` — and if `NOT RUN`, why |
| `nature` | `measured` / `modelled` / `exploratory` / `ordinal` |
| `tier_claimed` | T1 / T2 / T3 as the manuscript labels it |
| `tier_supported` | what the evidence actually supports |
| `verdict` | `OK` / `MISLABELLED` / `UNTRACEABLE` / `DOES-NOT-REPRODUCE` |

**Do not run producers that are slow or that write into `Paper/data/`.** In particular
**never run `make data-refresh`** — it currently corrupts
`Paper/data/scotus_keyword_counts.csv`. Where reproduction would require a write, mark
`NOT RUN` and say what would need to run. Static tracing is the default; execution is the
exception and only when it is read-only and cheap.

## Discipline

**Trace or mark UNKNOWN. Never infer a producer.** A plausible-looking attribution you
reasoned out rather than found makes the whole table untrustworthy. If a number appears in
the text with no derivable source, `UNTRACEABLE` is the correct and valuable answer.

An audit that comes back with many `UNTRACEABLE` rows is a fully acceptable outcome. So is
one that finds everything `OK`. Do not shade toward either.

## Output

`Paper/audit/empirical-provenance-audit.md` — the only file you create.

Lead with a summary: counts by verdict, then the `MISLABELLED` /
`DOES-NOT-REPRODUCE` / `UNTRACEABLE` rows first, since those are the actionable ones.
Close with a **Findings** section covering anything in this brief that was wrong, judgment
calls you made, and any systemic pattern you see across the failures.

## Constraints

- Read-only. Do not edit any `.tex`, script, or data file.
- **Do not run `git`.**
- Ignore `Paper/Redefining_Racism_BACKUP_pre_restructure.tex` and
  `Paper/Redefining_Racism_OpenDyslexic.tex` — superseded copies.
- Ignore `.worktrees/` — those are stale checkouts of this same repo.
