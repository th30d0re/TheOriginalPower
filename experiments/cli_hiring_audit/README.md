# CLI hiring audit — phase 1

This directory implements Experiment A’s GPT-5.6 phase-one harness. It constructs matched résumé pairs, assembles blinded batches, invokes one model CLI per batch, parses decisions without race keys, joins race afterward, and runs the specified statistical analysis.

## Design

Each of the 200 source résumés at LL, ML, and EL becomes a pair. The variants share education, work experience, skills, and every affiliation except affiliation position zero. They differ in exactly two paths:

1. `name`
2. `affiliations.0`

`build_pairs.py` asserts those exact paths, masks them, asserts equality of the remaining structure, and records a canonical SHA-256 `base_fields_hash`. Names are gender-matched within pairs. A shared surname is used within each pair, so the experimentally varied name component is the first name. Unique first-name/surname combinations prevent ambiguous parsing within batches.

The first names come from Marianne Bertrand and Sendhil Mullainathan, “Are Emily and Greg More Employable Than Lakisha and Jamal? A Field Experiment on Labor Market Discrimination,” *American Economic Review* 94(4), 2004, Appendix Table 1. The working-paper artifact was inspected directly at [NBER Working Paper 9873](https://www.nber.org/papers/w9873). The affiliation swap—`Black Engineers Association` and `European Heritage Society`—comes from the archived project notebook, `Evaluating_Fairness_in_Large_Language_Models_for_Hiring_Tasks-2.ipynb`. The archive remains read-only.

Each batch contains both variants from five pairs. The ten positions are shuffled with seed `20260903`; the level-specific seed offsets are fixed. Public batch files contain only level, batch number, and résumé content. Separate `_key.json` files map position to pair ID and race.

## Requirements

- Python 3.11+
- NumPy
- SciPy
- an authenticated `codex` CLI for the phase-one sweep

Matplotlib and statsmodels are not required. The analysis fits the logistic MLE with SciPy and writes SVG directly.

## Full phase-one run

From this directory:

```bash
./run.sh
```

The script announces the estimated invocation count before starting. With the default 15 batches, it makes 45 CLI calls. It then performs the blind parse, joins race keys, and writes the analysis.

Useful overrides:

```bash
BATCH_COUNT=2 ./run.sh
MODEL=my-model MODEL_CMD='vendor-cli --flag' ./run.sh
```

The default phase-one command is passed without a shell:

```text
codex exec -m gpt-5.6-sol -s read-only "<prompt>" < /dev/null
```

`subprocess.DEVNULL` implements the input redirection. For a CLI that requires the prompt inside an option, use a literal `{prompt}` token, such as `MODEL_CMD='agy --print={prompt} --model gemini-3-pro'`.

## Individual stages

```bash
python3 build_pairs.py
python3 assemble_batches.py --count 15
python3 run_model.py --levels LL --batch 1
python3 parse.py --model gpt-5.6-sol
python3 join_race.py --model gpt-5.6-sol
python3 analyze.py
```

`parse.py` reads only public batches and raw response text. It never reads `_key.json`. By default it rejects incomplete output; `--allow-incomplete` records warnings for diagnosis. `join_race.py` is the first stage permitted to load race keys.

Outputs include:

- `data/pairs/{LL,ML,EL}.jsonl`
- `data/batches/{level}/batch_N.json` and withheld `batch_N_key.json`
- `results/<model>/<level>/batch_N.txt`
- `results/parsed/<model>/<level>/batch_N.json`
- `results/selections.csv`
- `analysis/summary.json` and `analysis/report.md`
- `figures/black_selection_share.svg`

## Validation fixtures

`make_validation_fixtures.py` creates three deterministic, explicitly non-model responses under `results/fixture-validation/`. These exercise parsing and analysis when nested CLI execution is unavailable. They are software-test fixtures and must not be interpreted as hiring-audit observations.

## Phase-two hook

The runner accepts arbitrary command strings and prompt placeholders. Phase two can invoke the same batches with separate model labels and result namespaces:

```bash
python3 run_model.py --model claude --model-cmd 'claude -p {prompt}'
python3 run_model.py --model gemini --model-cmd 'agy --print={prompt} --model gemini-3-pro'
python3 run_model.py --model kimi --model-cmd 'kimi --output-format text -p {prompt}'
```

Run `parse.py` and `join_race.py` per model. Cross-vendor aggregation should concatenate model-labeled selection rows before per-model and pooled analysis; it should preserve separate raw and parsed namespaces.
