# Brief A (Codex, gpt-5.6-sol, high effort): make every phasor direction in the YT02v2 script match the rotated convention

## Rules
- **Never run git.** Leave every change uncommitted.
- **Edit only** `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`, plus your report.
- **Report:** write it to `Architecting_the_operation/video/yt02/logs/A_narration_direction.md`.
- Never edit `Paper/`, the audio, any shot list or any scene file.
- **Prose rules:**
  - Write in the author's voice: direct, declarative sentences, with no formulaic antithesis ("not X but Y", "more than just").
  - Write numbers and symbols the way the script already speaks them: "psi-sub-m", "ninety degrees", "Quadrant two".
  - Keep each edited turn about the same length, within ±15% of its words. Each turn is already recorded, and its picture is timed to it.

## The convention (the episode teaches it at turns 328–330, and the book agrees)
- The plane is the Argand plane turned a quarter turn clockwise, so screen x = ψ_s and y = −ψ_m.
- Positive ψ_m (material value delivered down to the governed tier) points **down**. Material extraction points **up**, toward the Elite.
- Positive ψ_s (psychological status) points **right**.
- θ is measured from the downward ψ_m axis toward ψ_s:
  - θ = 0° points straight **down** (pure material);
  - θ = 90° points right (pure status, ψ_m = 0);
  - θ > 90° rises **above** the horizontal axis into Quadrant II, which sits **upper-right**. There ψ_m < 0: material flows up toward the Elite while ψ_s stays positive.
- The source of the convention is `Paper/The_Original_Power.tex`, Eq. 3.5 and the Complex Suppression Allocation. Read the relevant passages.

## Task
1. **Find every direction statement.** Search the whole script for any sentence that places the phasor, θ, ψ_m, ψ_s, a quadrant, or extraction in a direction: up/down, above/below, left/right, clockwise, rises/drops, and so on. Known conflicts:
   - "At zero degrees, the phasor points straight up" (the turn beginning "Theta begins on the vertical material axis", about line 1392);
   - "The phasor drops below the horizontal line into the framework's Quadrant II regime" (about line 1421).

   Check every other hit too, across all segments.
2. **Rewrite conflicting sentences.** Rewrite each one so it is correct under the convention. Change only the direction wording, and keep each sentence's meaning and rhythm.
3. **Preserve manim cue words.** Some turns drive manim cues. In `Architecting_the_operation/video/yt02/wage_plane_hero.py` and `wage_phasor.py`, every `self.at(k, "<word>")` and every cue word in `V2_STATES` must still appear in its turn. Find each edited turn's shot id with:
   ```
   YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py turns 10
   ```
   If you must remove a cue word, say so in the report, and name the method and the replacement word that now appears in the turn.

## Report
For each edited turn, give:
- its line number;
- its first five words;
- the old and new sentence;
- the word counts before and after;
- the cue words checked.

Also list every direction statement you checked and left unchanged, with one line on why it is already correct.
