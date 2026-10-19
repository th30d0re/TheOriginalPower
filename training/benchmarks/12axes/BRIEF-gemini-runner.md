# Gemini loop: `take_quiz.py`, the runner that makes a model take the 12 Axes quiz

## Prohibitions (read before anything else)
- **Do not run any `git` command.** This repo has many uncommitted user changes.
- **Write only the files under "Files you own".** Do not edit anything else in this repo, and do
  not edit anything in `/Users/emmanuel/Dev/Tools/TypeSafe` (you may read it).
- **Do not call `https://api.typesafe.ai`** or any paid API. Test the System One client against a
  fake local server you write.
- Do not delete files. Do not `pip install` into any existing venv; if a dependency is missing,
  record it in your findings file and stop that leg.

## Goal
A single script that runs a model over the quiz items and writes an answer key with a full
probability distribution per item, for two kinds of backend:
1. **`mlx`**: a local fine-tuned LLM (the RootLedger models in `training/fused_models/`), read
   through next-token probabilities, not generated text.
2. **`systemone`**: any server speaking TypeSafe's `/v1/systemone` wire format (hosted Jev, or the
   local `decider` server in the TypeSafe repo), using the **Score** question type.

Working directory: `/Users/emmanuel/Documents/Theory/TheOriginalPower/training/benchmarks/12axes/`.

## Read first
- `CONTRACT.md` here (binding: answer scale, key-file schema).
- `questions.tsv` and `score.py` here.
- MLX loading pattern already used in this repo: `training/inference_agent.py`.
- System One wire format and a working client with caching:
  `/Users/emmanuel/Dev/Tools/TypeSafe/Harness/fallacy/arms.py` (see `typesafe_key`, `typesafe_call`,
  lines ~27–170), and the docs `/Users/emmanuel/Dev/Tools/TypeSafe/Research/Sources/typesafe-docs/pages/primitives_score.md`
  and `.../pages/api.md` (if present; `ls` the directory). Copy the approach; do not import from that repo.

## Established facts (measured by the orchestrator, 2026-09-28)
- `mlx_lm` 0.31.3 is installed in `/Users/emmanuel/Documents/Theory/TheOriginalPower/.venv-voice`
  (`.venv-voice/bin/python -c 'import mlx_lm'` works). It is **not** in `.venv` or `.venv-harness`.
  Run the script with `.venv-voice/bin/python`.
- Default model: `training/fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-v4-Rank32-Fused`
  (6.2 GB, has `chat_template.jinja` and `tokenizer.json`).
- `questions.tsv` columns: `id, axis, agree_pole, text` (240 rows). `atomic.tsv`
  (`atomic_id, parent_id, axis, agree_pole, text`) and `framework_digest.md` are being written by a
  parallel loop and may not exist yet. Accept any TSV with an id column (`id` or `atomic_id`) and a
  `text` column.

## Specification
CLI (argparse):
```
take_quiz.py --backend {mlx,systemone} --items PATH --out keys/<run_name>.tsv
             [--digest PATH]        # text given to the model as context; optional for mlx, required for systemone
             [--model-path PATH]    # mlx; local dir or HF repo id already in the HF cache
             [--adapter-path PATH]  # mlx; LoRA/DoRA adapter dir applied at load (mlx_lm.load adapter_path)
             [--registry models.tsv --run NAME]   # mlx; take model_path/adapter_path from a row of models.tsv
             [--endpoint URL] [--model NAME] [--batch 40]   # systemone; endpoint default from TYPESAFE_BASE_URL or https://api.typesafe.ai
             [--limit N]            # first N items, for smoke tests
```
Output: TSV exactly per CONTRACT: `id, answer, p_SA, p_A, p_N, p_D, p_SD, expected, confidence`.
`answer` = argmax label. `expected` = Σ p × {SA:1, A:.75, N:.5, D:.25, SD:0}. Probabilities 4 d.p.,
summing to 1 ± 0.001. The output must be scoreable by `python3 score.py <out>` when `--items
questions.tsv` and no `--limit`.

`mlx` backend:
- Prompt per item (chat template applied with `add_generation_prompt=True`): an instruction to
  answer as the framework described in the digest (or, with no digest, "as the Root Ledger /
  Original Power framework"), the statement, and five options labelled `A` Strongly agree, `B`
  Agree, `C` Neutral or it depends, `D` Disagree, `E` Strongly disagree, asking for the letter only.
- Run one forward pass and read the **logits of the first generated token**. For each option take
  the log-sum-exp over every single-token encoding of that letter the tokenizer has (e.g. `A`,
  ` A`); softmax over the five. Do not generate text and parse it.
- **Cache the shared prompt prefix** (system text + digest) with mlx_lm's prompt cache and reuse it
  across items. The orchestrator will run ~11 models × 2 conditions × ~600 items, so per-item cost
  must be the item suffix, not the ~2.5k-token digest. Report per-item wall time with and without
  the digest.
- `models.tsv` (read-only, written by the orchestrator) lists the model roster: controls, fused
  fine-tune rungs, and "unfused" rows that load a base plus an adapter. Relative paths in it are
  relative to the repo root. Resolve HF repo ids from the local HF cache only; never download.
- Record in the output-side log the total probability mass the five letters held before
  renormalization (median and min across items). Low mass means the prompt format is failing.

`systemone` backend:
- One request per batch of `--batch` items: `state` = the digest text, one **Score** question per
  item, question id = item id, question text = the statement, criteria = five levels in order
  0 "Strongly disagree with the statement" … 4 "Strongly agree with the statement" (write level
  descriptions that say the reader is judging whether the *framework described in the state* would
  agree). Map level probabilities to SD…SA; `confidence` = the returned confidence.
- API key: `TYPESAFE_API_KEY`, else macOS keychain item `typesafe-api-key` (same as arms.py). Not
  needed when `--endpoint` is localhost.
- On-disk cache keyed by content hash (endpoint, model, questions JSON, state), under
  `cache/` here, so re-runs are free. Retries with backoff on 429/5xx.

## Files you own (in the 12axes directory)
`take_quiz.py`, `test_take_quiz.py`, `fixtures/` (tiny test digest and items), `cache/`,
`keys/smoke-*.tsv`, `FINDINGS-runner.md`.

## Acceptance (run these)
1. `test_take_quiz.py` (plain asserts or pytest, whichever runs under `.venv-voice/bin/python`):
   probability normalization, `expected` arithmetic, TSV schema, id-column detection for both TSV
   shapes, and the systemone client end-to-end against a fake server started in the test that
   returns Score answers in the documented response shape.
2. Real MLX smoke run: `.venv-voice/bin/python take_quiz.py --backend mlx --items questions.tsv
   --limit 12 --out keys/smoke-mlx.tsv` (no digest), and the same with `--digest fixtures/<your
   test digest>` to `keys/smoke-mlx-digest.tsv`. Report wall time per item and the letter-mass
   statistics in FINDINGS-runner.md.
3. Fusion equivalence smoke (12 items, no digest): run `--registry models.tsv --run gemma-v4` and
   `--run gemma-v4-unfused`, then the same with `adapter_path` swapped to
   `training/adapters/gemma3_12b_npbp_abliterated_v3_v4_rank32_e5` (pass `--model-path`/`--adapter-path`
   directly for that one; do not edit models.tsv). Report, per pair, max and mean |Δp| across the
   five options and the number of argmax disagreements. Which adapter reproduces the fused model is
   an open question; report the numbers, do not decide.
4. Show that a full-length key is scoreable: generate a synthetic 240-row key with your writer
   functions (not the model) and run `python3 score.py` on it.

## Not yours to claim
Full 240-item runs, runs with the real `framework_digest.md`, any hosted Jev call, and starting the
TypeSafe `decider` server. The orchestrator runs those.

## Stop conditions
- If the five letters hold < 0.5 median probability mass in the smoke run, try at most two prompt
  variants, report all three masses, and stop.
- If loading the model fails for memory or version reasons, record the exact error and stop the
  mlx leg; finish the systemone leg.

## Findings file
Write `FINDINGS-runner.md` early and update it as you go: what you built, commands run with their
real output, smoke results, anything in this brief or CONTRACT.md that was wrong or ambiguous.
