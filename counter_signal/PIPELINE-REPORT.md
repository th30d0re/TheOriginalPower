# Counter-Signal Pipeline Report

## Built

`compose.py` deterministically converts a `Brief` into a self-contained writing prompt. The prompt carries the grievance, every obligation, target theta and material component, axes to remove from the causal account, the identity-band gate condition, and the requirements for 90–150 seconds of plain TTS-ready copy.

`render.py` applies `counter_signal.lint.check` before any HTTP work and raises `GateRejected` for a failed script. Passing scripts are sent as JSON with the specified `VideoParams` fields through the standard-library `urllib.request` client. `MPT_BASE_URL` controls the service origin and defaults to `http://127.0.0.1:8080`.

`pipeline.py` processes one slug per invocation. It writes the brief and prompt, stops for a script when none is supplied, records the lexical gate result, and submits only passing scripts when `--render` is present. State is keyed by slug in `counter_signal/responses/state.json`. A completed render artifact prevents a repeated invocation from submitting the same reel again.

Tests cover obligation preservation in prompts, refusal before HTTP for a blocklisted script, render idempotence across two pipeline runs, and the prompt-only stopping point.

## MoneyPrinterTurbo Verification

No MoneyPrinterTurbo process responded at `http://127.0.0.1:8080` during implementation, so the live OpenAPI documentation and a real submission could not be verified. Tests make no network calls.

The implementation assumes the task's upstream-verified endpoint `POST /api/v1/videos` and its listed `VideoParams` field names are authoritative. It assumes the endpoint returns a JSON object.

## Gate Scope

The existing thresholds and public gate behavior are unchanged. The gate continues to enforce lexical necessary conditions. The prompt states a target angle for the writer and explicitly prohibits claiming a measured phase; the pipeline adds no phase estimator.
