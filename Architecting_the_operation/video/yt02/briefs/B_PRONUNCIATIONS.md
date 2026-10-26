# Brief B (Kimi): verify by ear, then fix the Phonon readings of "Angola" and "U.S.C." in YT02v2

## Rules
- **Never run git.** Leave every change uncommitted.
- **Edit only** `Architecting_the_operation/scriptcast/pronunciations.yaml`, plus your report.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/B_pronunciations.md`.
- Do not record audio. Do not edit the script, `outputs/` or `~/Dev/Tools/scriptCast`.

## Background
The narration is synthesized with the Phonon engine (`ptts`). Two readings were wrong in an earlier take:
- **Turn 269** once said "Angolan", which Phonon read as "angle-land". The script now says "twenty and odd captives from Angola". Nobody has verified the new take.
- **Turn 357** says "eighteen U.S.C. section nine twenty-two gee, paragraph one". It was heard as "United States". It should be read as the three letters "U S C".

Script: `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`. Recorded turns: `outputs/YT02v2/`.

## Task
1. **Listen with Whisper medium.** Use the medium model, because the small model hallucinates.
   ```
   .venv-voice/bin/scriptcast-verify outputs/YT02v2 --transcript Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md --model medium --turns 269,357 --json-out Architecting_the_operation/video/yt02/logs/B_verify.json
   ```
   Report what Whisper heard for "Angola" and for "U.S.C.".
2. **Fix the readings that are wrong.** For each reading still heard wrong, add a Phonon respelling to `pronunciations.yaml`.
   - **Format.** Follow the existing per-engine `phonon:` entries (psi-sub-m, rho-tau, pullman, lagos).
   - **Matching.** Read how scriptCast applies them (`~/Dev/Tools/scriptCast/src/**/pronunciation.py`: `respell()`, `_COMPOUND_RE`) to confirm how a dotted key such as "U.S.C." is matched.
   - **Spelling.** Candidate respellings:
     - "an-GO-luh" or "ang go la" for Angola;
     - "you ess see" for U.S.C.
3. **Show the respelled text.** Run the real `respell()` on each affected turn's text with the `.venv-voice` install. Paste the before and after into the report.
4. **Check for side effects.** Diff the respelled full script with and without your new keys. Only the intended turns may change.

## Report
For each turn, give:
- what Whisper heard;
- whether you changed anything, and the entry you added;
- the respelled before and after text.

Then list the turns that need re-recording, and the side-effect diff.
