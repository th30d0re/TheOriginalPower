# Brief E (Codex, gpt-5.6-luna): re-record four YT02v2 turns with Phonon and rebuild the timings

## Rules
- **Never run git.**
- **Never pass `--overwrite`** to any scriptcast command. It once wiped `outputs/YT02v2/video`.
- **Touch only** these files under `outputs/YT02v2/`:
  - the audio scriptcast writes;
  - `episode_manifest.json`, `word_timings.json` and `YT02v2.mp3`;
  - the new verify JSON;
  - `outputs/YT02V2/words.json`.
- **Do not edit:**
  - anything under `outputs/YT02v2/video/` or `outputs/YT02V2/video/`;
  - the script;
  - `pronunciations.yaml`;
  - any repo source file.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/E_rerecord.md`.

## Turns to re-record
Re-record turns **336, 343, 357 and 449**, using the 0-based turn indices from `outputs/YT02V2/words.json`. Their script text has changed. Check that the script lines below match before you record:

| Turn | Script line (approx.) | Line starts |
|---|---|---|
| 336 | 1392 | "Theta begins on the vertical material axis. At zero degrees, the phasor points straight down" |
| 343 | 1421 | "Continue the rotation past ninety degrees. The phasor rises above" |
| 357 | 1482 | "Today the felony-in-possession bar in Title eighteen of the United States Code" |
| 449 | 1862 | "Material wage extends down the vertical axis" |

## Steps
Run each step from the repo root.

1. **Back up.** Create `outputs/_backups/YT02v2_pre_rerecord_20261026/` and copy `episode_manifest.json`, `word_timings.json` and `YT02v2.mp3` into it. Also copy `outputs/YT02V2/words.json` there.
2. **Record.** Phonon is deterministic and local.
   ```
   source .venv-voice/bin/activate
   T=Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md
   scriptcast --transcript $T --episode-id YT02v2 --out-dir ./outputs --gap-ms 350 --resume --regenerate-turns 336,343,357,449 --skip-als
   ```
3. **Relayout and stitch.**
   ```
   scriptcast-relayout outputs/YT02v2 --gap-ms 350
   scriptcast-stitch outputs/YT02v2 --pad-ms 350
   ```
4. **Word timings.** These can take a while. Never run them without the timeout; one run once hung for 29 hours.
   ```
   timeout 3600 scriptcast-word-timings outputs/YT02v2 --script $T
   YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/make_words.py
   ```
5. **Verify by ear.** Use Whisper medium, because the small model hallucinates loops.
   ```
   scriptcast-verify outputs/YT02v2 --transcript $T --model medium --turns 336,343,357,449 --json-out outputs/YT02v2/verify_rerecord_20261026.json
   ```
   - Each turn must score ≥ 0.95, with the new wording heard ("straight down", "rises above", "United States Code", "extends down").
   - **If a turn fails**, re-record it alone with a new seed:
     ```
     SCRIPTCAST_PHONON_SEED=<n> scriptcast ... --regenerate-turns <turn>
     ```
     Then redo steps 3–5. Try at most 3 seeds per turn.
6. **Check the outputs.**
   - `outputs/YT02v2/video` still exists.
   - Every turn in `outputs/YT02V2/words.json` has words.
   - Run `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check` and record its last line.

## Report
- The commands run and their last output lines.
- The new mp3 duration against the old one (6395.3 s).
- For each of the four turns: its old and new duration, plus the verify score and heard text.
- The seeds used, if any.
- The `check` result.
