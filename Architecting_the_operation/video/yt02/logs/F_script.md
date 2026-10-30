# YT02v2 Script Pass Findings — 2026-10-28

Model: OpenAI Codex (GPT-5)

## Scope and known screen misses

- N3: wetware appears on screen at “where the literature ends.”
- N5: the boundary / Equation 2.5 card timing does not follow the spoken definition.
- N9: `E(t)` appears on screen before the narration defines it.

## Author-note checklist

| Note | Status | Script-pass disposition |
|---|---|---|
| N1 | done | The per-episode OmniVoice command is documented below. No render ran. |
| N2 | done | The read-only spoken/screen checker was added and run. |
| N3 | other agent | `<!-- CARD: N3 literature-ends -->` marks the spoken line. |
| N4 | done | The narration defines magnitude, the state/institution direction, and the hat as a unit direction. The passage carries `<!-- PACE: slow -->`. |
| N5 | other agent | `<!-- CARD: N5 eq 2.5 timing -->` marks the spoken line. |
| N6 | done | The narration says “Barbara J Fields.” |
| N7 | other agent | The current S08-13 card placement remains unchanged. |
| N8 | done | A sourced passage builds two tiers, three tiers, four tiers, five tiers, and the cone before Segment 07. The orthographic passage refers to that earlier construction. |
| N9 | done | Delta-max is defined before use. The card marker requests its definition before `E(t)` appears. |
| N10 | done | Tier narration says Puppet Class, Enforcement Class, and Buffer Class. Symbols remain in HTML comments where useful for cards. |
| N11 | hold | `<!-- FACT-HOLD: N11 Lincoln -->` remains at the insertion point. No Lincoln claim was spoken. |
| N12 | done | Spoken bare four-digit years use word forms. The Portugal opening now supplies the author’s institutional framing from existing episode material. |
| N13 | done | The Chesapeake passage now states the shared conditions, solidarity, post-rebellion legal construction of the white label, and the author’s resulting political wariness. |
| N14 | done | The pre-phasor passage follows the author’s Du Bois path from the public and psychological wage through two components, a complex number, and the engineering phasor. |
| N15 | hold | The narration adds licensing regimes and boundary redefinition at the mechanism level. Bruen, the QR code, the MLK permit, and the 2020 licensing-regime comparison remain factual holds. |
| N16 | other agent | Card work. |
| N17 | other agent | Card work. |
| N18 | other agent | Card and manuscript-conflict review. |
| N19 | other agent | Card work. |
| N20 | other agent | Card and animation work. |
| N21 | other agent | Card and graph work. |
| N22 | done | The narration identifies the Section 2.2 statement and the fuller revised definition in the concluding chapter. The source comment cites `Paper/The_Original_Power.tex:14911-14915`. |
| N23 | done | The closing handoff was removed. Existing Bayesian-defense and RLC derivations now appear in the episode. |
| N24 | other agent | Card crop. |
| N25 | other agent | Cone camera implementation. |

## Source record

- Tier construction: `ATO_EP02_preface.md:340-358` and `ATO_EP04_what_power_is.md:310-355`.
- Portugal framing: the existing YT02 Portugal sequence and `ATO_EP05_version_one.md:166-250`.
- Du Bois-to-phasor path: `ATO_EP01_authors_preface.md:635-650` and `ATO_EP01_authors_preface.md:691-719`. The narration uses the source’s quoted form, “a sort of public and psychological wage.”
- Chesapeake framing: the existing YT02 Chesapeake sequence and `ATO_EP05_version_one.md` passages opened during the pass.
- Later definition: `Paper/The_Original_Power.tex:14911-14915`.
- Bayesian-defense lift: `YT01_what_racism_really_is.md:930-973`, 366 spoken words after headers and comments were excluded.
- RLC lift: `YT01_what_racism_really_is.md:1141-1238`, 826 spoken words after headers and comments were excluded.
- Total N23 lifted narration: 1,192 words.

The spoken-like count rose from 15,495 words at HEAD to 17,527 words in this pass. The prior 106-minute-50-second runtime projects to approximately 121 minutes at the same average pace. A 150-word-per-minute estimate gives approximately 117 minutes. The accepted derivations therefore keep the episode near two hours.

## Pronunciation decision

The pronunciation file requires calibrated entries and contains no existing `omnivoice` key style. No pronunciation helper binary was available for a probe. `pronunciations.yaml` remains unchanged. The script uses the explicitly unmeasured candidate “Susan Aboo-al-Hawa,” with an adjacent HTML comment requesting author approval. This spelling is a proposal and carries no measured-pronunciation claim.

## OmniVoice render command

The later render command is:

```bash
scriptcast --transcript Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md --episode-id YT02v2 --out-dir ./outputs --gap-ms 350 --voices Architecting_the_operation/scriptcast/voices.omnivoice.yaml --skip-als
```

This command was not run. No `--overwrite` flag was used. No audio or render output was created.

## Validation record

`python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`

```text
check-antithesis: no banned constructions found.
```

`make check-prose`

```text
check-antithesis: no banned constructions found.
```

The independent review followed `.codex/tasks/prose-antithesis-review.md` and reviewed the added script prose. Its result was 0 CERTAIN findings, 0 arguable findings, and 15 candidate constructions considered and cleared. The report is `/tmp/yt02v2_prose_antithesis_review.md`. The reviewer made no repository edits.

`python3 Architecting_the_operation/video/yt02/check_spoken_screen.py`

```text
# YT02v2 spoken/screen phrase report
# Known miss N3: wetware at literature-ends
# Known miss N5: boundary card timing
# Known miss N9: undefined E(t)
SUMMARY shots=561 mapped=561 unmapped=0 misses=178
```

The checker exited 0 as designed. Its detailed report includes the stale S15-22 handoff note for the card agent.

`python3 -c "compile(...)"`

```text
checker syntax: ok
```

`git diff --check` exited 0 with no output.

`git diff --stat` reported only the owned tracked script:

```text
.../podcasts/YT02_v2_what_racism_is.md | 1543 +++++++++++---------
1 file changed, 871 insertions(+), 672 deletions(-)
```

The large tracked diff includes the 560 pre-existing speaker-timestamp changes. The new checker and findings files are untracked owned files, so `git diff --stat` omits them. Pre-existing untracked briefs, other-agent logs, and `tmp/` remain untouched.
