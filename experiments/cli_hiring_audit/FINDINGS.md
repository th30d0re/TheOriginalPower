# Phase-One Findings — CLI Hiring Audit

Model used for implementation: Codex (GPT-5)

Date: 2026-09-03

## What Was Requested

Build the phase-one GPT-5.6 hiring-audit harness specified in `.codex/tasks/exp-cli-hiring-phase1.md`: matched-pair generation from the read-only Grad archive, fixed-seed batch assembly, a CLI model runner, blind parsing, post-parse race joining, statistical analysis, two or three real validation calls, and a full-sweep `run.sh`. The full 15-batch-per-level sweep was excluded from this phase.

The required boundaries were observed. No Git command or manuscript build was run. Nothing in `Paper/`, `.mcp.json`, `debate/`, or the Grad archive was modified. All written artifacts are inside `experiments/cli_hiring_audit/`.

## What Was Built

### Matched pairs

`build_pairs.py` read 200 source résumés from each of `LL.json`, `ML.json`, and `EL.json` and wrote 600 pair rows in total.

For every pair:

- Black-associated and White-associated first names are gender-matched entries from Bertrand and Mullainathan (2004), Appendix Table 1.
- Both variants use the same surname. The 18 first-name pairs combined with 12 surnames yield 216 unique names per race; the 200 rows at each level therefore have no repeated candidate names.
- Affiliation position zero is set to `Black Engineers Association` or `European Heritage Society`, following the original archived notebook’s explicit affiliation treatments.
- A recursive structural diff must equal exactly `affiliations.0` and `name`.
- Both permitted signals are masked before equality comparison and SHA-256 hashing.
- The masked Black and White hashes must match before the row is written.

Post-generation checks confirmed 200 unique pair IDs and 200 unique names per race at every level. Education, work experience, skills, and affiliation positions after zero were identical within all 600 pairs.

### Batches

`assemble_batches.py` generated the default 15 batches per level. Each batch contains both variants from five distinct pairs, giving ten résumés. Pair selection and position order use fixed seed `20260903` with stable level offsets. Integrity checks confirmed five complete Black/White pairs in every batch and no `race` or `pair_id` field in public résumé records.

### Runner and prompt

`run_model.py` exposes the required function:

```python
rank_batch(batch, level, model_cmd)
```

It renders ten plain numbered résumé blocks, invokes the command without a shell, supplies `/dev/null` through `subprocess.DEVNULL`, enforces a 900-second ceiling, returns raw stdout, and saves responses at `results/<model>/<level>/batch_N.txt`. The prompt requests a complete ten-name ranking plus a top choice and up to three additional candidates with one-sentence rationales.

### Blind parsing and race join

`parse.py` accepts only a public batch and raw response. It contains no key-loading path and explicitly rejects a batch filename containing `_key`. It extracts exact candidate names, ranks, and advancement decisions, records a raw-response SHA-256, and fails closed on incomplete output unless `--allow-incomplete` is supplied.

`join_race.py` separately loads parsed rows and withheld keys. It writes the exact requested columns to `results/selections.csv`:

```text
model,level,batch,position,name,selected,rank,race
```

### Analysis

`analyze.py` completed all requested operations:

- Black share among advanced candidates by level
- 1,000-replicate, fixed-seed batch-cluster bootstrap 95% intervals
- one 2×2 Pearson chi-square test per level
- logistic MLE for `selected ~ C(race) * C(level)` with White and LL references
- explicit `race_black:level_ML` and `race_black:level_EL` interaction terms
- Holm-Bonferroni adjustment across the three level tests
- comparisons with the 2024 LL 46.67%, ML 31.67%, and EL 46.67% baselines
- a descriptive mid-level-dip indicator
- JSON, Markdown, and SVG outputs

SciPy supplies optimization and probability functions. The SVG is written directly, avoiding the unusable local Matplotlib binary and any added dependency.

## Validation Results

### Real Codex calls

Exactly two real `codex exec` attempts were made, one for LL batch 1 and one for ML batch 1. Both failed before model inference with the same nested-runtime error:

```text
Error: failed to initialize in-process app-server client: Operation not permitted (os error 1)
```

No third call was made because the task directs the implementer not to fight nested CLI failure. No GPT-5.6 raw response was produced. Real-output parser accuracy therefore remains unconfirmed. The orchestrator must run `run.sh` directly in an environment where `codex exec` can initialize.

### Offline end-to-end check

Three deterministic responses, one per level, were written under the explicit model label `fixture-validation`. They are test fixtures and contain no model output. The pipeline recovered:

- 30 of 30 ranked candidates
- 12 of 12 advancement decisions
- 30 correctly positioned post-join race rows

The fixture analysis ran through all 1,000 bootstrap iterations, three chi-square calculations, Holm correction, logistic regression, Markdown report generation, and SVG generation. Its regression optimizer converged. Expected-cell warnings are correctly present because each level contains one fixture batch. The bootstrap intervals collapse to point values because batch-cluster resampling has only one cluster per level.

The fixture’s Black shares and mid-level-dip flag are software-test output with no empirical interpretation. They do not answer the study question.

## Pipeline Status

The construction, assembly, invocation, parsing, joining, and analysis components are implemented. Python compilation and structural integrity checks pass. `run.sh` passes shell syntax validation and announces 45 expected calls at the default batch count.

**The full sweep has NOT been run.**

The empirical mid-level dip remains unresolved. No GPT-5.6 hiring decision was generated in this session.

## Challenges Encountered

1. The archived notebook’s `get_african_american_name` and `get_caucasian_name` functions both draw generic Faker names; several cells confound the two labels with male versus female generation. A published, gender-matched first-name list was required.
2. Nested `codex exec` cannot initialize its in-process app-server client in the current sandbox. Two calls confirmed the same pre-inference failure.
3. The installed Matplotlib extension has an x86_64/arm64 architecture mismatch, and statsmodels is absent. The analysis uses SciPy for logistic MLE and emits dependency-free SVG.
4. One validation batch per level cannot support useful batch-cluster confidence intervals or stable inference. The generated warnings and full-sweep flag expose that limitation.
5. Public and key data needed strict physical and procedural separation. Parsing and joining are separate programs, and the parser has no key-discovery logic.
6. The source pool includes pre-existing demographic cues in fields shared by both variants. These cues are constant within each matched pair, but they may affect construct clarity across source résumés and warrant a phase-two sensitivity analysis.

## Next Ideas (6 Ideas)

1. Run `./run.sh` from the orchestrator context and manually inspect the first successful raw response before allowing all 45 calls to continue.
2. Add golden parser cases covering prose rankings, Markdown tables, tied ranks, initials, apostrophes, refusal text, and rationale lines that mention another candidate.
3. Add a paired sensitivity analysis, such as conditional logistic regression or McNemar tests, alongside the prespecified marginal chi-square results.
4. Audit constant background cues in education and secondary affiliations, then preregister a neutralized-pool sensitivity condition without altering the primary design.
5. Extend `join_race.py` with an explicit append/merge mode for phase-two vendors while retaining model-separated raw and parsed namespaces.
6. Record CLI version, prompt hash, batch hash, exit status, duration, and stderr metadata in sidecars for reproducible cross-vendor execution.
