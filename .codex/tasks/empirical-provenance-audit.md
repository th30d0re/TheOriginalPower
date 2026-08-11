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

## REVISION — the authoritative tier specification

The first pass scored `tier_supported` against the one-line gloss at
`Paper/The_Original_Power.tex:243` ("Tier 1: peer-reviewed quantitative"). That is not the
operative definition, and the resulting `MISLABELLED` verdicts must be re-derived.

**The authoritative spec is `Paper/The_Original_Power.tex:308-320.`** Use it verbatim:

- **Tier 1** — calibrated against at least one **peer-reviewed source OR public dataset**
  carrying a DOI or stable URL, where the number is **directly reported in that source, or
  directly and transparently derivable from its published figures**, such that a reader can
  verify it **without performing any undisclosed analytical step**.
- **Tier 2** — uses a publicly accessible dataset, but **the author performs the
  operationalisation and computation**, with the method disclosed in the case study or
  footnote so a reader holding the same dataset can reproduce it.
- **Tier 3** — an ordinal ordering or structural relationship for which **no quantitative
  calibration is possible or is attempted**, with the ordinal basis and its limits stated.

Three consequences for re-scoring:

1. **A scholarly monograph is a valid Tier 1 anchor.** Morgan (1975), James (1938),
   Piketty and similar are peer-reviewed sources. Do not downgrade on the grounds that a
   source is not a quantitative dataset. The test is whether the *number* is directly
   reported or transparently derivable from it.
2. **The absence of a producer script does not by itself force a downgrade.** A Tier 1
   claim whose value is directly reported in a cited source needs no producer. Reserve
   `UNTRACEABLE` for claims where neither a producer nor a disclosed derivation exists, so
   a reader cannot get from the cited source to the printed number.
3. **`nature` must be judged from the claim, not the source.** A claim is `ordinal` when it
   asserts an ordering rather than a magnitude — not merely because its source is a
   history book.

Keep the first pass's traceability findings, which are independent of this: the
`DOES-NOT-REPRODUCE` rows, the missing-producer records, and the `Paper/data/` header
survey. **Re-derive only `tier_supported` and `verdict`.**

Also record, as a finding in its own right: `Paper/The_Original_Power.tex:243` and
`:306` give **two different one-line tier definitions**, and neither matches the full spec
at `:308-320`. Report the inconsistency and quote all three. Do not edit them.

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
