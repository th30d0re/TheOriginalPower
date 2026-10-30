# YT02v2 script pass from the 2026-10-28 notes

Read `Architecting_the_operation/video/yt02/briefs/F_AUTHOR_NOTES.md` first. It is the authority for what the author asked. This brief says which of those notes you implement and which you leave marked.

## Prohibitions

- Do not commit. Do not `git checkout`, `git reset`, `git revert`, or `git clean`. The podcast file already differs from HEAD (speaker timestamps). Keep the working tree. Do not restore HEAD.
- Do not pass `--overwrite` and do not run `scriptcast`, `scriptcast-stitch`, or any render. A full OmniVoice re-render is a later step. Write the command in the findings file and stop.
- Do not edit `scriptcast.toml` or either `voices*.yaml`. The global default stays Phonon until the author confirms. Document the per-episode `--voices Architecting_the_operation/scriptcast/voices.omnivoice.yaml` command in the findings.
- Do not edit `Paper/`, `outputs/`, the shotlist, card JSON, or `figma/`. Another agent owns those.
- Do not invent a quotation, a date, a case holding, or a statistic. If notes N11 (Lincoln), N15 (Bruen, MLK, 2020 surge by licensing regime) are not already in the manuscript or an episode script with a file:line you opened, leave a one-line HTML comment `<!-- FACT-HOLD: N15 Bruen -->` at the insertion point and do not speak the claim.
- Do not rename Puppet Class to "profit class." Note N10: speak "puppet class."

## Files you own

- `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`
- `Architecting_the_operation/scriptcast/pronunciations.yaml` — additive keys only, for the engine named `omnivoice` where that key style exists; otherwise change the script wording so the engine reads the words. Read the file’s header before adding a key. Do not delete existing keys.
- `Architecting_the_operation/video/yt02/logs/F_script.md` — write this first.
- `Architecting_the_operation/video/yt02/check_spoken_screen.py` — a read-only checker. It may read the shotlist and the script. It writes nothing except stdout.

## Established facts

- 561 speaker blocks. Block 357, line 1482, is the 922(g) sentence. Block 351 is the 1705 musket sentence. The author said "turn 351" while quoting 922(g). Edit line 1482.
- Line 2309 hands the Bayesian defense and the RLC derivations to another video. Note N23: that handoff comes out, and those derivations come in, copied from existing scripts.
- Line 424 is `Barbara J. Fields`. Line 280 is Susan Abulhawa and `d-hat-sub-state`. Line 887 contains the digit date `1441` that Phonon read as four forty-one.
- Rhetorical constraint for every new sentence: direct affirmative declarative statements. No "not merely X, but Y," no "more than just." After editing, run `python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` and rewrite every CERTAIN hit in the lines you added. REVIEW hits: read them, leave legitimate negations.

## Implement

1. Findings file first, with a checklist of N1–N25 and a status cell (done / hold / other agent).
2. N6: `Barbara J Fields` at line 424.
3. N4: after the equation at line 280, add spoken definitions. The hat is the unit direction. Name magnitude and the state/institution direction in words. Add an HTML comment `<!-- PACE: slow -->`. Add an OmniVoice-safe respelling for Abulhawa if a probe of the pronunciation helper shows the plain name is the failure; if you cannot probe, change only the script to a phonetic neighbor the author can approve and record that choice in the findings. Do not guess a pronunciation and present it as measured.
4. N12 dates: in sentences that are read aloud, write years of this episode’s Portugal sequence in words (`fourteen forty-one`) where the digits are the thing the engine misread. Keep the digit form in HTML comments if a citation needs it. Apply the same treatment to other four-digit years in spoken lines that are written as bare digits. Do not rewrite years that are already words.
5. N10: where a spoken line says `P-sub-puppet` or similar subscript speech for the tier names, say puppet class, enforcement class, buffer class. Leave the symbol in a comment if the card needs it.
6. N8: insert, before the orthographic segment (`<!-- SEG 07`), a passage that asks why ingroup and outgroup are not enough, names the oppressor/oppressed picture as the coarse binary, and builds two tiers then three then four then five using the wording you open in `ATO_EP02_preface.md` and `ATO_EP04_what_power_is.md`. Show the cone being built in the narration. At line 775, add that the cone was described earlier. Keep the orthographic section. New speaker blocks use the same `Emmanuel Theodore (mm:ss)` header shape; estimate the timestamp from the previous block and mark `<!-- TIME: estimate -->`.
7. N9: before `delta max equals zero` is used, one sentence that defines it. Do not introduce `E(t)`, circuit inputs, or the psychological wage in speech unless the sentence defines them. The card change is the other agent’s. You may add `<!-- CARD: define delta-max before showing E(t) -->`.
8. N14: before the phasor section, add the author’s path in his own voice: Du Bois’s public and psychological wage, two parts, complex number, phasor as the engineering picture. Quote Du Bois only in the form the manuscript or `ATO_EP01_authors_preface.md` already uses. Open that file and cite the line in an HTML comment.
9. N12 and N13: add the framing in the author’s voice at the Portugal open and at the Chesapeake / Bacon’s Rebellion passage, using claims already in the script or in `ATO_EP05_version_one.md`. The solidarity point and the "white" label as a post-rebellion construction are the author’s argument; write them as his narration. Lincoln stays FACT-HOLD unless you opened the sentence in-repo.
10. N15: at line 1482, add licensing regimes in the author’s voice as the same boundary mechanism, and the modern move of redefining who "the people" is or what a firearm is. Bruen, the QR code, the MLK permit, and the 2020 surge comparison stay FACT-HOLD comments unless you opened them in `Paper/` or `Paper/research/`.
11. N22: one sentence that this statement is the §2.2 definition and the book states a fuller definition later. Quote the later definition only if you opened it; otherwise FACT-HOLD the quotation and still say that a later definition exists only if you saw it. If you did not find it, write that in the findings and do not claim it in the script.
12. N23: delete the handoff at line 2309. Insert the Bayesian defense and the RLC derivations from the existing scripts you open. Record source file:line and a word count. If the lifted passage would push the episode well past two hours, include it anyway and record the estimate. The author accepted about two hours. Do not write a fresh derivation.
13. N5 and N3 are card fixes. Leave `<!-- CARD: N3 literature-ends -->` and `<!-- CARD: N5 eq 2.5 timing -->` at the spoken lines so the card agent can find them. Do not rewrite those sentences to match the wrong card.
14. Checker `check_spoken_screen.py`: read `YT02v2_shotlist.md` holds and the script. Print a line when a shot `**Note:**` names an on-screen phrase and that phrase’s significant words are absent from the script block for that shot id. Exit 0 always. This is a report, not a gate. Include the known misses as comments in the script output header: N3 wetware at literature-ends, N5 boundary card, N9 undefined E(t).

## Acceptance

- `python3 tools/check_antithesis.py Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` — no CERTAIN hits in lines you added.
- `python3 Architecting_the_operation/video/yt02/check_spoken_screen.py` runs and prints a report.
- `F_script.md` lists the OmniVoice render command and states that it was not run.
- `git diff --stat` shows no changes outside the files you own.

## Stop

Stop when the acceptance commands have been run and the findings file records their output. Do not render audio.

## Not yours

Slide geometry, Figma, the cone camera, clipping, and the OmniVoice render. The orchestrator runs the render after review.
