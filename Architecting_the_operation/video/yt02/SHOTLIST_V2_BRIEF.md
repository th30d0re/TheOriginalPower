# Brief: YT02 shot list, version 2 (replaces the templated version 1)

**HARD FILE RULES (no write sandbox): never run git; never edit `Paper/` or `video/yt01_redefining_racism/`;
write only `Architecting_the_operation/video/YT02_shotlist.md` (overwrite), `Architecting_the_operation/video/yt02/cards/*.json`
(delete the old 46 first: they are wrong), and `Architecting_the_operation/video/yt02/logs/shotlist_v2.md`.
No helper scripts in the repo; scratch goes in /tmp.**

## What was wrong with version 1 (do not repeat any of it)

- It chunked the script into fixed runs of five turns regardless of content.
- Cards were the narration pasted onto the screen: item titles were a timestamp plus the turn's first
  seven words; details were the full spoken sentence; headlines were "Segment · MM:SS".
- Notes were templates: "Advance the animation to beat 02; illuminate the cue '…'".

## The quality bar

Read `Architecting_the_operation/video/YT01_shotlist.md` (SEG 00–03 and SEG 12) and five YT01 cards
in `video/yt01_redefining_racism/cards/` (S03-02, S03-38, S12-29c, S12-30, S10-19). Every YT02 shot
must be at that level: a specific visual change tied to what that turn says.

## Rules

1. **Runs follow the ideas, not a counter.** A card or diagram lasts as long as the narration stays on
   its idea (1–8 turns). A new idea gets a new primary shot.
2. **On-screen text annotates; it never transcribes.** Card headlines name the idea ("Prejudice ·
   Allport 1954", "Dum Diversas, 1452"). Item titles ≤ 6 words; details ≤ 18 words; a definition or
   quotation is verbatim from its source and tagged. Never put a timestamp or a narration sentence
   on screen.
3. **Pick the kind by content:** `quote` for verbatim definitions and primary sources (with
   `quote`, `attribution`); `timeline` for dated sequences (1441 → 1453 → 1486; 1640 → 1705);
   `table` with `columns` for side-by-side structure (the dictionary order; thinking / feeling /
   behavior); `compare` for two or three contrasted things; `stat_bars` for numbers the book gives;
   `equation` (with `latex`, `number`, `terms`) whenever the narration names an equation by number;
   `source` for who-said-what; `title` for segment openers only.
4. **Every hold shows one specific change**, named in its Note: "Allport's 'faulty and inflexible
   generalization' underlines", "the 1705 node lights and its code text slides in". Holds of
   `figma-card` runs reveal the card's items in order, one per turn, so a card's item count should
   equal its run length where possible.
5. **Render targets** (unchanged from v1): `figma-card:cards/<ID>.json`; `figma:<frame>` for the
   built Figma scenes (`Scene · Orthographic illusion` in SEG 04; in SEG 11 `intro 1 · System
   Stress` … `intro 9 · Result`, `assembly`, `era 1486` … `era 2010`; map each SEG 11 turn to the
   instrument or era it describes); `manim:` for math and set diagrams, reusing YT01 scenes in
   `video/yt01_redefining_racism/manim/` only where the content truly matches (read the scene's
   docstring and `shot_*` methods). New math scenes: `manim:yt02/wage_phasor.py:WagePhasor`
   (SEG 09) and `manim:yt02/interference_engine.py:InterferenceEngine` (SEG 12); write their beats
   concretely in the inventory, keyed to the words of each turn (material on the vertical axis for
   the phasor).
6. Same `##` shot format, IDs `S<seg>-<nn>`, one shot per script turn (526), anchors verbatim.
   Card JSON uses the YT01 schema. Provenance tags on every Note. No formulaic antithesis.

## Checks before finishing

- 526 shots, anchors match the script in order; every `figma-card` JSON exists; every reused
  `manim:` file and class exists; no card text contains a timestamp or a sentence copied from the
  narration (compare each card string against the turn texts: no string over 12 words appears in
  the script verbatim, except tagged quotations).
- `python3 tools/check_antithesis.py` on the shot list and every card: clean.
- `logs/shotlist_v2.md`: counts by type, kind and target; the run list (primary, length, idea);
  the checks' output.
