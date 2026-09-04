# Experiments: rigorous redo of the two precursor studies

Two of Emmanuel's grad-school studies underpin material now in the manuscript. Both were
early, under-powered, and (in the LLM case) confounded. This directory holds the rigorous
redos. Nothing here is wired into the manuscript build; if results hold, a Chapter 21 update
and a `theodore_*` bib entry follow.

Source archive (do not modify): `~/Documents/Grad/NLP/Project/` and
`~/Documents/Grad/MPC/Group exercises/Homework/Markov Model Application/`.
Assessments: `../Sources/grad-precursor-survey.md`, `../Sources/mid-level-gap-literature.md`.

---

## Experiment A — Cross-vendor CLI hiring audit  (`cli_hiring_audit/`)

**Question.** Does the mid-level selection gap reproduce (a) with race isolated from
credentials, (b) in 2026 frontier models, (c) across vendors, not just OpenAI?

**Why CLI, not API.** The models under test are driven through their coding CLIs, which bill
against existing subscriptions. No metered API spend.

| Phase | Models under test (the "hiring managers") | CLI invocation |
|---|---|---|
| 1 | GPT-5.6 (`gpt-5.6-sol`) | `codex exec -m gpt-5.6-sol -s read-only "<prompt>" < /dev/null` |
| 2 | + Claude, Gemini, Kimi | `claude -p "<prompt>"` · `agy --print="<prompt>" --model gemini-3-pro` · `kimi --output-format text -p "<prompt>"` |

**Design fixes over the 2024 original.**

1. **Matched pairs.** Each résumé exists in a Black-marked and a White-marked version that
   are identical except for the name and one affiliation/school signal. Race is the only
   varied field. (The original varied credentials alongside race — its stated limitation.)
2. **Per-model analysis**, not four-model pooling.
3. **The interaction nobody has run.** Logistic regression `selected ~ race * level`, plus
   per-level bootstrap CIs on the Black selection share, Holm-Bonferroni across the three
   level comparisons. The literature pass found no published LLM audit that reports a
   demographic-by-seniority interaction.
4. **Deterministic settings** where the CLI exposes them; N batches per level with shuffled
   order; fixed seed for résumé assembly.
5. **Blind parse.** The name→race map is applied only after the selections are extracted, by
   a script that never sees the race labels during parsing.

**Procedure.** Reuse `datasets/{LL,ML,EL}.json` as the credential pool; rebuild them into
matched pairs. Per level: assemble batches of 10 (5 Black + 5 White matched pairs, shuffled),
prompt each CLI to rank most-to-least suitable and name a top pick plus up to three others
with a one-line rationale each. Parse selections, map to race, aggregate.

**Outputs.** `results/<model>/<level>_batches.jsonl` (raw), `results/selections.csv`,
`analysis/` (CIs, regression, figures), `FINDINGS.md` (does the ML pinch reproduce, per model
and pooled; cross-vendor consistency; comparison to the 2024 baseline).

**Cost/risk.** CLI-subscription usage only. No paid API. Kimi `-p` jobs must stay short
(900 s ceiling) — one batch per invocation, not one long job. Codex spawning the other CLIs
as subprocesses is fine; each carries its own auth.

---

## Experiment B — Race-specific mobility Markov model  (`markov_mobility/`)

**Question.** Restate the framework's "facially neutral" claim dynamically: can a policy that
looks neutral in aggregate transition flow still preserve the racial gap in the stationary
distribution?

**Data (public, no cost).** Opportunity Insights *Race and Economic Opportunity* publishes
race-by-parent-quintile → child-quintile transition matrices directly
(`https://opportunityinsights.org/data/`). Cross-check against PSID intragenerational
income-quintile transitions where available.

**Build.**

1. Fit race-specific transition matrices `P_black`, `P_white` over income quintiles (and, if
   the data support it, an education-state layer).
2. Compute per race: stationary distribution, first-passage time to the top quintile,
   mixing time, and — with a lightly absorbing "incarcerated / detached" state added from
   BJS data — absorption probability.
3. Model a policy as a perturbation `P -> P' = P + Δ`. Construct a `Δ` that is
   race-blind by construction (same operator applied to both matrices) and show the
   stationary racial gap that survives it. Contrast with a `Δ` targeted at the binding
   transition.
4. Connect to the manuscript's policy-as-operator formalism (the Markov exercise was the
   Preface beat we cut for lack of rigor; this is what would earn it back).

**Outputs.** `data/` (downloaded + processed), `markov.py` (deterministic, reproducible),
`figures/`, `FINDINGS.md`.

---

## Dispatch order

1. **B (Markov)** first — self-contained, no model calls, clean Codex loop with network on
   for the data download.
2. **A phase 1** — Codex builds the harness and runs GPT-5.6 only; verify the pipeline end
   to end on one vendor before fanning out.
3. **A phase 2** — add Claude / Gemini / Kimi once phase 1's parse and analysis are trusted.

Each phase is its own loop with a committed brief in `.codex/tasks/` and a `FINDINGS.md`.
Orchestrator reviews every `FINDINGS.md` and runs any manuscript-facing verification.
