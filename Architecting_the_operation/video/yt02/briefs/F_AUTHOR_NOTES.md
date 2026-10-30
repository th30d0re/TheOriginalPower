# YT02v2 author notes — 2026-10-28

Source: spoken review of the latest YT02v2 cut (Phonon narration, segment cuts under `outputs/YT02v2/video/preview/`). Speaker-block indexes below were checked against `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` (561 `Name (m:ss)` heads). Where the spoken turn number and the quoted sentence disagree, the sentence wins.

## N1 — Voice engine

Phonon is acceptable and has lost quality against the previous library. The previous library is OmniVoice.

- Current project default: `scriptcast.toml` `voices = "Architecting_the_operation/scriptcast/voices.phonon.yaml"`. Host `emmanuel_theodore` has `engine: "phonon"` (comment: chosen over OmniVoice by ear, 2026-10-22).
- Previous file: `Architecting_the_operation/scriptcast/voices.omnivoice.yaml`, host `engine: "omnivoice"`, reference `voices/candidates/emmanuel_expressive_clean.wav`.
- Manifest `outputs/YT02v2/episode_manifest.json`: `"engine": "archive, phonon"`, host engine `phonon`, `model_id` `prince-canuma/Kokoro-82M` (stale label from an earlier render).
- Do not pass `--overwrite` to scriptcast. It once wiped `outputs/YT02v2/video`.

## N2 — Screen must match speech

Whatever is on screen is spoken, except a short readable aside a viewer can take in while the narration continues. A full slide that is never discussed, swapped away in a couple of seconds, is a failure. Add a verification pass so this class of miss gets caught.

## N3 — "Where the literature ends"

Spoken at script line 261: "This is where the established literature ends." The card up at that moment is the wetware / psycho-legal social software contrast (shotlist `S01-48`, and the spoken wetware sentence is later, around line 300). The card does not match the sentence.

## N4 — Scalar versus vector, Susan Abulhawa

Script line 280. The name is Susan Abulhawa (heard as "Abuhava"). The equation is spoken as raw symbols: `R-sub-racism`, `M-sub-magnitude`, `d-hat-sub-state`, too fast. Slow this passage down. Say what the hat denotes. Define each symbol in the sentence or put the definition on the card. Synchronize the card to those definitions.

## N5 — About 12:35, system boundary and Equation 2.5

Manifest time 12:35 falls on speaker block 70 (line 295), which does not say "requirement to police a system boundary." The boundary card is on screen while the narration is elsewhere, and set theory is not in that sentence. Shotlist `S03-06` through `S03-09` reveal Individual Prejudice → Discriminatory Actions → Systemic Outcomes on Equation 2.5 off the words. Re-time those reveals to the words. The voice engine is changing, so re-time against the new read anyway.

## N6 — Barbara J. Fields

Script line 424: `Barbara J. Fields`. The period after `J` produces a long pause before Fields. Write `Barbara J Fields`.

## N7 — Card S08-13

The author already moved the testable archival quantitative claim on card S08-13. Keep that position.

## N8 — Order: coarse binary, then the cone, then orthographic

After ingroup/outgroup, the departure from the standard literature, and the reversed causal arrow:

1. Ask why ingroup and outgroup are not sufficient.
2. Show the coarse binary projection first. The oppressor/oppressed picture is the failure mode of that coarse cut. The pushback on that picture is correct: the categories are not uniform. A higher-resolution image is required.
3. Build two tiers, then three, then four, then five, in the progression already spoken in Architecting the Operation (start at `Architecting_the_operation/podcasts/ATO_EP02_preface.md` around the "two tiers" passage, and `ATO_EP04_what_power_is.md`). Build the cone. Show the cone. Then continue.
4. Do not play the orthographic projection before the five tiers exist.

At the orthographic section (speaker block 186, line 775, about 33:56), the cone has already been shown. Say that it was described earlier. State the reason, then the math that carries it.

## N9 — About 24:43, requirement three

Speaker block 133, line 558, is the Concession Theorem / `delta max equals zero`. Circuit inputs and outputs are on screen before this episode has said what a circuit is here. `E(t)` appears undefined. The psychological wage appears undefined. `delta max = 0` is defined in the next breath. Define a term before the card shows it. Start from `delta max`.

## N10 — How tier names are spoken

Say puppet class, enforcement class, buffer class. Do not say "P-sub-puppet." The subscript is notation. The voice note also says "profit class"; the book’s tier name is Puppet Class. Speak puppet class unless a manuscript line uses a different spoken form. Confirm in `Paper/The_Original_Power.tex` before changing the name.

## N11 — Examples before the refinement equations

Lead with cases, then the equation. The Know-Nothings and immigrants who were held outside and later entered the in-group. An Abraham Lincoln sentence about white people being treated as if they were black: use it only if an open artifact in this repo or a primary source states it. Say why the equation is the thing that explains the case.

## N12 — Portugal, 1441, and the cover story

Speaker block 213, line 887: `1441` is read as "four forty-one." Dates are spoken as fourteen forty-one. Prepare the listener: name the claim being answered (Black people owned slaves; Africans sold themselves into slavery), show the record, then say why that story was issued as cover. Dum Diversas and the papal bulls: the present form of "Africans sold themselves" is the current edition of that same justification. Draw the line Du Bois named as the propaganda of history from the 1450s through 2026. Use manuscript and episode wording. Do not invent a quotation.

## N13 — Chesapeake, spirited Europeans, class solidarity

Europeans spirited to the Chesapeake in conditions comparable to the Middle Passage are in the record. Say so. Similar conditions produce class solidarity. The racial line in Virginia was built after Bacon’s Rebellion to break that solidarity. A person of European descent has a reason to refuse the label "white," because that label was built for the break. Bias toward people who organize around that label can still be warranted. The lesson is the fracture.

## N14 — Wage phasor origin, about one hour

Before the phasor diagram: Du Bois named a public and psychological wage. The duality was missed, including by the author on an earlier pass. Two parts can sit in a tuple. One part is material. The other lives in people’s standing, so the book writes it as the imaginary component of a complex number. An engineering reading of that complex number is a phasor, which is why the plot looks the way it does. Source passages live in `ATO_EP01_authors_preface.md` and the EP04 register drafts. Re-open them.

## N15 — Arms: 922(g), licensing, Bruen, MLK

The author called this turn 351. The sentence he quoted is speaker block 357, line 1482:

> Today the felony-in-possession bar in Title eighteen of the United States Code, section nine twenty-two gee, paragraph one, combines with racially disparate drug felony pipelines to preserve a proxy arms boundary.

Block 351 (line 1452) is the 1705 musket freedom-dues sentence. Do not hang the 922(g) note on block 351.

Add, beside line 1482: licensing regimes were used the same way. New York State Rifle & Pistol Association v. Bruen struck the "may issue" licensing scheme. A QR code to the opinion is wanted. Black gun ownership surged in 2020; the author believes the surge differed between states that had licensing regimes and states that did not, and wants that checked before it is spoken. MLK applied for a pistol permit and was denied: speak it only after an artifact is opened.

Block 355 (line 1471) is the Dred Scott arms sentence. The author asked, under "turn 355," to say that modern gun control also works by changing who "the people" is (the felon bar) or by declaring the object not a firearm. Put that modern point with the 922(g) sentence. Dred Scott can carry one clause on who counted as "the people" for the right to bear arms, if the script’s existing source note already supports it.

## N16 — Turns 360 and 362 need their own cards

- Block 360, line 1493: arms boundary eroding, rifle bans. Own graphic.
- Block 362, line 1502: two-series anchor for psi-sub-m and psi-sub-s. Own Figma card and animation.

## N17 — Turn 442 runtime chips

Block 442, line 1833. Spoken conditions: stagnant, expanding, restructuring, at risk, threatened, peak. "Blocked" flashes at the start and is not in the sentence. Restructuring is missing. Threatened and peak are missing.

## N18 — Turns 449–450 phasor geometry, and log 3

Block 449, line 1861. Block 450, line 1865.

- "Value delivered" clips the bottom of the y-axis. Move it down.
- Psychological status runs to the right on the horizontal axis. (A verify log once heard "technical status" / "NEDA"; the script says psychological status and theta.)
- Theta at 90° is too short on screen.
- Quadrant two begins past 90°. The book calls that crossing the fascism threshold.
- Turn 450’s quadrant labels clip and overlap.
- Log 3 marks pure status at 90° (`phasor_builder.js` regime: `th === 90` → `pure status · ψ_m = 0`). The author says that is wrong for this log because the Second Amendment was a material concession. He believes the book may already have been updated. Check `Paper/The_Original_Power.tex` at the lines the shotlist cites (Ch 3, 2914–2925, and Compiled Runtime Log 2). If the manuscript still says pure status, report the conflict and do not silently retcon the book. The buffer-class phasor has to move across the logs. It currently barely moves.

## N19 — Turn 484 phase-gap clipping

The author says the card on screen during turn 484 shows "0.2 phase gap" clipped at the bottom. `cards_v2.json` has the string `0.2π phase gap`. Shrink it or move it so it sits inside the frame. Block 484’s spoken sentence (line 2006) is the Interference Engine intro, so confirm which card is actually held.

## N20 — Turns 488–495: equations named and not drawn

| Block | Line | Spoken object |
|---|---|---|
| 488 | 2022 | Madison as an active phased-array signal jammer |
| 489 | 2026 | Equation 0.15, grievance current `i_k(t)` |
| 492 | 2038 | 180° cancellation, Figure 0.6 |
| 494 | 2046 | Equation 22.1, discourse power split |
| 495 | 2050 | Equation 22.2, circular phase dispersion |

The author remembers Figure 0.6, Equation 0.5, and Equation 0.6 being listed without cards. Search the script before adding those numbers. Draw the equation that the sentence defines. Turn 492 wants a wave animation. Turn 495’s current card lists descriptions in prose. Put the expression on screen.

## N21 — Turn 498 and tables 501–503

Block 498, line 2062: Confidence Tier 2, spectral carrier. Show the data, including more than the sentence reads, for a viewer who wants it. Use graphs that exist in the book. Madison’s design as a phased-array jammer, a Fourier transform applied to political time series, and Kirchhoff’s laws applied at the Elite node are the demonstration. Show them.

Blocks 501–503, lines 2074–2082: Table 22.1 ratios (0.25 cycles/year, Senate 21.02, eight-year 12.86, Parseval 0.9996). Put the table on screen.

## N22 — Turn 515, two definitions

Block 515, line 2135 states the §2.2 definition. A later chapter states a fuller definition. Mention that the episode’s definition is the §2.2 form and that the book states a fuller one later. Quote the later one only from the manuscript.

## N23 — Turn 521, Bayesian defense stays in this episode

Block 521, line 2159 is step three of the §2.2 operational stack (naturalizing disparities). Hint that the Bayesian defense is how the prior gets into the person, and that this is the upstream of the individual prejudice named earlier. Do not deliver the whole defense here if the derivations land in their own section. Do not defer the topic off the episode.

Script line 2309 currently sends the viewer to a chapter walkthrough for the Bayesian defense derivations and the RLC electrodynamic mapping. Remove that handoff. Put the Bayesian defense and the RLC derivations in this episode. A cut near two hours is acceptable. Copy derivations from existing episode scripts and the manuscript. Do not write a new derivation from memory.

## N24 — Turn 525 / S14-16

"In group" is clipped on `S14-16`. Fix the crop.

## N25 — Orthographic illusion camera

This move does not exist yet. The author described it as:

1. A cone. White on the left, black on the right. Camera framed on the band between the out-group and the buffer class.
2. Rotate the cone 90° counterclockwise. The frame is tight enough to read as a white side and a black side. That image is the coarse binary projection.
3. Rotate 90° clockwise. The cone stands upright and the frame stays tight: buffer class on top, out-group on the bottom.
4. Move inside the cone between buffer and out-group. Pan up. The ceiling is flat. From the out-group looking up, the frame is the in-group.
5. Pan down. From the buffer class looking down, the frame is the group below.
6. Zoom out to the whole cone.

Existing cone code: `Architecting_the_operation/video/yt02/tier_cone.py`. A Remotion setup has been used under `Architecting_the_operation/video/yt01_redefining_racism/` (see `INFRA_TASK.md`). Search before creating a new project.
