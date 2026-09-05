# TASK — Finish the counter-signal pipeline

You are in a dedicated git worktree on branch `agent/codex-countersignal`.
Commit there. Do not switch branches. Do not touch `main`.

## Context

`counter_signal/` already contains three modules. **Read them first — they are
the contract, do not modify their public behaviour:**

- `lexicon.py` — `densities(text) -> (psi_m, psi_s)`, `material_ratio(psi_m, psi_s)`
- `lint.py` — `check(script) -> GateResult(passed, psi_m, psi_s, ratio, blocked_terms, reasons)`
- `brief.py` — `build(slug) -> Brief`, and `python -m counter_signal.brief <slug>`

`Brief` carries: `slug, title, theta_in, psi_m_in, deflection_axes,
e_amplitude, kernel_named, target_theta_deg, target_psi_m, obligations,
grievance`.

The pipeline responds to a social video by rotating the complex wage phasor
toward the real axis: keep the grievance, drop the identity axis as the causal
variable, name who captured the value. `brief.build()` already emits those
obligations per clip.

## Build three modules

### 1. `counter_signal/compose.py`

`build_prompt(brief: Brief) -> str` — assemble a complete, self-contained script
-writing prompt from the Brief. **Deterministic string construction only.**

There is no LLM API key in this environment and you must not add a dependency on
one. This module produces the prompt; some other model writes the script.

The prompt must carry: the grievance to preserve, every obligation, the target
angle and psi_m, the axes to drop, and an explicit instruction that naming any
identity-band term fails the gate. Ask for 90–150 seconds of spoken copy, plain
sentences, no stage directions, because it goes to TTS verbatim.

CLI: `python -m counter_signal.compose <slug> [--out FILE]`.

### 2. `counter_signal/render.py`

Submit a script to a locally running MoneyPrinterTurbo.

- Base URL from `MPT_BASE_URL`, default `http://127.0.0.1:8080`
- `POST /api/v1/videos`

Exact `VideoParams` field names, verified against the upstream source:

    video_subject: str
    video_script: str = ""          # our script goes here, verbatim
    video_aspect: "9:16" | "16:9" | "1:1"     # default "9:16"
    voice_name: str = ""
    subtitle_enabled: bool = True
    video_source: str = "pexels"
    video_clip_duration: int = 5
    video_concat_mode: "random" | "sequential"

`submit(script, subject, **overrides) -> dict`. **Refuse to submit a script that
fails `lint.check`** — raise, do not warn. That refusal is the point of the
module.

Use `urllib.request` from the standard library. Do not add `requests` or any new
dependency. Confirm the endpoint path against `http://127.0.0.1:8080/docs` if a
server happens to be running; if not, code to the fields above and say in your
report that the path is unverified.

### 3. `counter_signal/pipeline.py`

`python -m counter_signal.pipeline --slug <slug> [--script FILE] [--render]`

**One reel per invocation, resumable**, mirroring `tools/chapter_deep_dive.py`
in this repo — read it for the pattern. State in
`counter_signal/responses/state.json`, keyed by slug, recording stage
(`briefed` / `composed` / `gated` / `rendered` / `failed`), the gate result, and
any error. Every step idempotent.

Artifacts under `counter_signal/responses/<slug>/`:

    brief.json    prompt.md    script.md    gate.json    render.json

Without `--script` it stops after writing `prompt.md` and reports that a script
is needed. With `--script` it gates, and renders only if `--render` is passed
and the gate passed.

## Hard constraints

1. **Do not weaken the gate.** `PSI_M_FLOOR = 2.0` and `MATERIAL_RATIO_FLOOR =
   0.65` are calibrated against 13 analyst-scored clips: they accept the one
   scored at 12 degrees and reject all twelve at 62 and above.
   `counter_signal/tests/test_gate.py` pins that separation. If a test of yours
   fails because the gate rejects your sample script, **fix the script, not the
   threshold.**
2. **Claim no phase measurement.** The gate enforces necessary conditions. A
   lexical proxy for the angle correlates at only r=0.43 with the analyst's, and
   scores two clips labelled 86 and 88 degrees at 0 because no status word
   matched. Do not add a function that returns a theta and presents it as
   measured.
3. Standard library plus what the repo already uses. No new packages.
4. Never make a network call in a test. Stub the HTTP layer.
5. `videolab/jobs/` is gitignored, so a worktree has only 4 job slugs. Tests that
   need the corpus must skip when it is absent, as `test_gate.py` does.

## Verify

    python -m pytest counter_signal/tests/ -q
    python -m counter_signal.brief instagram-DbYnLlBM1-z
    python -m counter_signal.compose instagram-DbYnLlBM1-z

Exit criteria:

1. All existing tests still pass, unchanged.
2. New tests cover: prompt contains every obligation; `render.submit` refuses a
   blocklisted script; pipeline is idempotent across two runs; pipeline without
   `--script` stops at `prompt.md`.
3. `python -m counter_signal.pipeline --slug instagram-DbYnLlBM1-z` runs clean
   and writes `brief.json` and `prompt.md`.
4. No new third-party dependency in any import.

## Commit

Scope `[counter-signal]`, using the `AGENTS.md` template with WHAT / WHY /
BUILD / RISK. Add `counter_signal/responses/` to `.gitignore` — those are
generated artifacts. Write `counter_signal/PIPELINE-REPORT.md` covering what you
built, what you could not verify without a running MoneyPrinterTurbo, and any
assumption about the endpoint.
