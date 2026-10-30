# YT02v2 card and phasor pass from the 2026-10-28 notes

Read `Architecting_the_operation/video/yt02/briefs/F_AUTHOR_NOTES.md`. You own the picture. Another agent owns the podcast script. Do not edit the script.

## Prohibitions

- Do not commit. Do not `git checkout`, `git reset`, `git revert`, or `git clean`.
- Do not edit `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`, `scriptcast.toml`, pronunciations, voice files, `Paper/`, or `outputs/`.
- Do not pass `--overwrite`. Do not run a full episode render or `scriptcast`.
- Do not create a new Remotion or Node project. Search first. If the camera move cannot be made in the existing cone code, write the storyboard and stop.
- Card S08-13: the author already repositioned the testable archival quantitative claim. Read the current JSON and keep that position. Likely path: `Architecting_the_operation/video/yt01_redefining_racism/cards/S08-13.json`. If a YT02 copy exists, preserve both.
- Log 3 at 90°: if `Paper/The_Original_Power.tex` still calls θ = 90° pure status with zero material wage, do not change the manuscript and do not pretend the card and the book agree. Write DISAGREE in the findings. You may add a log-specific label only with a comment that cites the line you opened and states the book conflict. The author’s claim is that the Second Amendment was a material concession, so log 3 is not pure status. Verify before changing the label.

## Files you own

- `Architecting_the_operation/video/yt02/figma/v2/phasor_builder.js`
- `Architecting_the_operation/video/yt02/figma/v2/phasor_spec.py`
- `Architecting_the_operation/video/yt02/figma/v2/phasor_specs.json`
- `Architecting_the_operation/video/yt02/figma/v2/cards_v2.json` — surgical edits only
- Card JSON under `Architecting_the_operation/video/yt02/cards/` and the S14-16 / S08-13 card files you locate
- `Architecting_the_operation/video/yt02/tier_cone.py` — only if you can add the camera storyboard without breaking the current cone
- `Architecting_the_operation/video/yt02/logs/F_cards.md` — write this first

Do not edit `YT02v2_shotlist.md`. Record proposed shotlist lines in `F_cards.md`.

## Established facts

- `phasor_builder.js` line 137: `th === 90` maps to `pure status · ψ_m = 0`, and `th > 90` maps to Quadrant II.
- `cards_v2.json` contains `0.2π phase gap: i₁(t) and i₂(t) align...` and a frame `card v2 S14-16`.
- Shotlist `S03-06` note: Equation 2.5 card opens on Individual Prejudice → Discriminatory Actions → Systemic Outcomes. Author says those terms are not timed to the words.
- Shotlist `S01-48` is "Separating host wetware from institutional code." The spoken line "This is where the established literature ends" is script line 261. The wetware sentence is later (around line 300). N3: the literature-ends moment must not show the wetware card.
- Turn 442 script line 1833 speaks: stagnant, expanding, restructuring, at risk, threatened, peak. "Blocked" is not in the sentence.
- Turn 449 script line 1861: material wage down the vertical axis, psychological status right along the horizontal axis, theta at ninety is pure status, Quadrant Two begins past ninety. "Value delivered" clips the bottom of the y-axis.

## Implement

Write `F_cards.md` first with a row per note: N3, N5, N7, N16, N17, N18, N19, N20, N21, N24, N25.

1. N18 clipping and overlap. In the phasor spec, move the "value delivered" label down so it clears the y-axis. Shorten or reflow theta-at-90 so it is readable. Separate Quadrant II labels so they do not overlap on the turn 450 frame. Psychological status runs along the horizontal axis to the right. Keep the fascism-threshold wording that the script speaks at line 1865.
2. N18 log 3. Open the manuscript passages the shotlist cites. Record what they say about 90° and about the Second Amendment. Then either update the log 3 phasor keyframes so the buffer-class phasor is not parked at pure status, with the comment and the citation, or stop that one edit and write DISAGREE. The buffer phasor has to change across logs. State the angle you set and why.
3. N19. Find the 0.2π phase-gap text and stop it clipping the bottom of its frame. Smaller type or a lower position. Record which shot is on screen at speaker block 484.
4. N17. Find the runtime-log card for turn 442. Remove the early "Blocked" state if it is a stray keyframe. Show restructuring, threatened, and peak, matching line 1833. If a label exists in the data and is not drawn, draw it. Do not invent extra regimes.
5. N24. `S14-16`: "in group" is cropped. Inset the label so the full words sit inside the frame.
6. N3. Retarget the card held at script line 261 so its visible words are the literature-ends sentence (bias, prejudice, discrimination as the interpersonal terms the literature defines). Move the wetware / social-software card to the later sentence that says those words (around line 300). Edit card JSON, not the script. Record the shot ids.
7. N5. Equation 2.5 reveals: Individual Prejudice, Discriminatory Actions, Systemic Outcomes each appear when the spoken line says them. Find the beat file (`card_beats` / cards json) and set the order to the words in `S03-06` through `S03-09`. Record the beat times you set.
8. N16, N20, N21. Add card JSON for the missing pictures, using the spoken sentences and equation strings already in the script. Do not invent coefficients.
   - Block 360 (line 1493) and block 362 (line 1502): one card each.
   - Block 489 (Eq 0.15), block 492 (wave / 180° cancellation, Fig 0.6), block 494 (Eq 22.1), block 495 (Eq 22.2 as an expression, not a prose list).
   - Block 498 and blocks 501–503: if Table 22.1 or the spectral figure already exists under `Paper/figures/` or the shotlist, point the card at it. If it does not, stub the card with the ratios the script already speaks (0.25 cycles/year, 21.02, 12.86, Parseval 0.9996) and write MISSING FIGURE in the findings. Do not fabricate a graph.
9. N25. Write the six-beat camera storyboard into `F_cards.md`. If `tier_cone.py` can express a camera on a cone, add the beats there as data the current renderer will not ignore, and say how to preview one frame. If it cannot, say so in one paragraph and stop. Do not scaffold a new app.

## Acceptance

- `F_cards.md` exists and has a row for each note above, including any DISAGREE.
- `node --check Architecting_the_operation/video/yt02/figma/v2/phasor_builder.js` exits 0 if you edited that file.
- `python3 -c "import json; json.load(open('Architecting_the_operation/video/yt02/figma/v2/cards_v2.json'))"` exits 0 if you edited that file.
- `git diff --stat` shows no changes to the podcast script, `Paper/`, or `outputs/`.

## Stop

Stop after the acceptance commands. Do not render video.

## Not yours

Narration wording, the OmniVoice re-render, and historical claims that are not already on a card.
