# Brief B (Kimi): Phonon respellings for "Angolan" and "U.S.C." in YT02v2

## Rules
- **Never run git.** Leave every change uncommitted.
- **Edit only** `Architecting_the_operation/scriptcast/pronunciations.yaml`, plus your report.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/B_pronunciations.md`.
- Do not record audio. Do not touch the script, `outputs/` or `../scriptCast` (`~/Dev/Tools/scriptCast`).

## Problem
The YT02v2 narration is synthesized with the Phonon engine (`ptts`). Two words come out wrong:
- **"Angolan"** (script `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`, about line 1117) sounds like "angle-land". It should sound like "ang-GO-lan".
- **"U.S.C."** (about line 1482, "eighteen U.S.C. section nine twenty-two gee") is read as "United States". It should be read as the three letters "U S C".

## Task
1. **Learn the format.** Read `pronunciations.yaml`, especially the existing per-engine `phonon:` keys (psi-sub-m, rho-tau, pullman, geronimus). Then read how scriptCast applies them: `~/Dev/Tools/scriptCast/src/**/pronunciation.py`, the `respell()` and `_COMPOUND_RE` logic. Hyphenated and dotted keys behave differently, so confirm how a key with dots ("U.S.C.") is matched.
2. **Add the entries.**
   - Add an "Angolan" entry with a Phonon respelling, for example "ang-go-lun" or "an-GO-lun". Pick the spelling closest to how earlier entries steer Phonon.
   - Add a "U.S.C." entry with a Phonon respelling, such as "you ess see", that reads as three letters.
   - Find every occurrence of both words in the script, so the fix covers all of them, and list them in the report.
3. **Check the respelled text.** Run the respell function itself on each affected turn's text, using the editable install in `.venv-voice`. For example: `.venv-voice/bin/python -c "from scriptcast.pronunciation import ...; print(respell(text, table, 'phonon'))"`, with the real import path. Paste the before and after text for each turn into the report.
4. **Check for side effects.** Confirm that no other word in the script changes because of the new keys: diff the full respelled script against the respelled script without your keys.

## Report
- The entries you added.
- The turn indices and line numbers they affect.
- The before and after respelled text for each affected turn.
- The side-effect diff, which must be empty apart from the intended turns.
