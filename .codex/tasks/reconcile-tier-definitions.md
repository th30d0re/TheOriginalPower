# Brief — Reconcile the confidence-tier definitions to one authority

## The problem

The manuscript defines its three confidence tiers in at least three places, and they do not
agree:

- `Paper/The_Original_Power.tex:243` — "Tier~1: peer-reviewed quantitative; Tier~2: public
  dataset with disclosed computation; Tier~3: ordinal or structural estimate"
- `Paper/The_Original_Power.tex:306` — "Tier 1 = multi-source quantitative alignment
  in-text; Tier 2 = mixed quantitative + structural diagnostics; Tier 3 = structurally
  supported but data-fragmented comparative estimate"
- `Paper/The_Original_Power.tex:308-320` — the full operational specification

The third is authoritative: line 306 itself introduces it as the expansion of the one-line
gloss into "a full, operationalisable specification."

The two short forms are looser paraphrases, and the one at `:243` is strict in a direction
the spec is not. Read literally it requires Tier 1 sources to be *quantitative datasets*,
which would condemn every Tier 1 claim anchored to a peer-reviewed monograph — Morgan
(1975), James (1938), Piketty. The operative spec permits those, requiring only that the
number be directly reported or transparently derivable.

An audit run against `:243` returned 100 false mislabels before the criterion was
corrected. A hostile reviewer would quote `:243` and then point at the Morgan-anchored
Tier 1 claims.

## Task

Make every tier definition in the manuscript consistent with the operational specification
at `:308-320`.

1. **Find them all.** The three above are known. Search the manuscript, `empirical_index.tex`,
   the Era-Level Calibration Matrix, the Empirical Methodology chapter, and the appendices
   for any other gloss, legend, or caption that defines or paraphrases the tiers. Report
   every one you find with `file:line`.
2. **Rewrite the paraphrases** so each is a faithful compression of the operative spec.
   Preserve the distinctions that matter: Tier 1 is *directly reported or transparently
   derivable from a peer-reviewed source or public dataset, with no undisclosed analytical
   step*; Tier 2 is *public dataset with the author's own disclosed operationalisation*;
   Tier 3 is *an ordinal or structural claim with no quantitative calibration attempted,
   its basis stated*.
3. **Leave the operative spec at `:308-320` unchanged.** It is the target, not the subject.

## Hard scope limit

**Do not change the tier assigned to any equation, figure, table, or claim.** Not one.

This task reconciles the *definitions* only. Re-tiering individual claims is a curatorial
judgment reserved to the author, and `Paper/audit/empirical-provenance-audit.md` already
records where mismatches sit. If you notice a claim whose tier looks wrong under the
reconciled definition, write it in your findings file and leave it alone.

Do not edit `Paper/empirical_index.tex` tier cells. If that file carries a *legend* rather
than a per-row tier, the legend is in scope and the rows are not.

## Prose constraint

`AGENTS.md` imposes a hard style rule: direct, affirmative declarative statements. No
formulaic antithesis, no corrective contrasts ("not merely X, but Y"). Match the
surrounding text.

## Acceptance

1. Every tier definition in the manuscript says the same thing, consistent with `:308-320`.
2. No tier assignment anywhere has changed. Verify with `git diff` before you finish and
   state in findings that you checked.
3. `make pdf-from-tex` compiles without error.

## Files

You may edit `Paper/The_Original_Power.tex` and, if it carries a legend,
`Paper/empirical_index.tex`. Nothing else. **Do not run `git`** — the orchestrator reviews
and commits.

Write `Paper/audit/tier-definition-reconciliation.md`: every definition found, what you
changed, confirmation that no tier assignment moved, and any claim whose tier looks wrong
under the reconciled definition — recorded, not acted on.
