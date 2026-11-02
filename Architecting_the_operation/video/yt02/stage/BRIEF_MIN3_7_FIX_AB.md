# Brief: minutes 3–7, fix pass for packages A and B (frame review of `min3_7_AB_v1.mp4`)

Read `BRIEF_MIN3_7_BUILD.md` (Rules, Checkpoint, The standard), `STORYBOARD_MIN3_7.md`, and
`FINDINGS_MIN3_7_A.md` / `_B.md`.

Write only these files:
- `min3_7/a/*` and `min3_7/b/*`;
- `tools/check_min3_7_a.*` and `tools/check_min3_7_b.*`;
- a new "Fix pass 1" section in `FINDINGS_MIN3_7_A.md` and in `FINDINGS_MIN3_7_B.md`.

The shared components in `min3_7/shared/` are read-only. Work around any problem there locally.
Do not change git state. Do not render.

The render is `outputs/YT02v2_ov/video/stage_runs/min3_7_AB_v1.mp4`, starting at episode
138.667 s. Its frames are `stage_runs/ab_v1/e<episode-seconds>.png`.

**The rule this pass enforces everywhere: no text overlaps other text, and no line or shape
crosses text.** The checks pass today because they do not test this. Every fix below needs a
geometric assert built from the layout constants, at every sampled frame.

## Package A

1. **`SequenceAsTheory`, turn 12 (`e161.png`).**
   - Node titles wrap onto the subtitles below them. "Discriminatory Actions" overprints "causal
     node 2", and "INSTITUTIONAL PATTERNS" overprints "causal node 3". Give each node title room
     for two lines before its subtitle: widen the nodes, shorten the title box, or both.
   - The connectors from the numbered list cut through the list labels ("1. Individual
     Prejudice", "2. Belief in Superiority"). Start each connector at the right edge of its
     label block, with a gap of at least 12 px, and route it to its node without crossing any
     text.
2. **`HeartsAudit`, turn 13 (`e169.png`).** An empty outlined rectangle sits under the public-debate
   funnel. Remove it, or give it the content the storyboard assigns it.
3. **`TermsInOneBucket`, turn 16 (`e207.png`).**
   - At the end of the turn, the bucket's trapezoid lines run through the four term blocks.
   - The label "FOUR ANALYTICAL TERMS" sits on the bucket rim, and the dashed arcs cross the
     block borders and labels.
   - Re-lay the final state so that:
     - the bucket sits below the blocks, or the blocks sit inside it, with no stroke through a
       block;
     - the labels sit in clear space;
     - the question at the top, the blocks and the closing line "Exact words support formal
       analysis." form one vertically balanced composition with no large empty band.
   - The four blocks show only their titles with empty space below. Add each block's one-line
     summary from the storyboard, or shrink the blocks to fit their content.

## Package B

4. **`LiteratureHandoff`, turn 17 (`e215.png`, `e224.5.png`).**
   - The connector dots sit on the discipline labels ("EXPERIMENTAL PSYCHOLOGY", "SOCIAL
     PSYCHOLOGY"). Move each dot above its label.
   - The handoff chip "DISCRIMINATION · DIFFERENTIAL BEHAVIOR" overflows its chip. Size the
     chips to their text, or use the storyboard's short chip strings.
5. **`APAGroupDefinitions`, turns 19–21 (`e239.png`, `e251.png`, `e264.png`).**
   - **Field labels:** "DETACHMENT", "COMPETITION" and "OPPOSITION" sit on top of person marks
     and arrows. "MEMBERSHIP" and "PSYCHOLOGICAL IDENTIFICATION" sit on the circle's edge. Place
     every field label in clear space, joined to its subject by a short leader line if needed.
   - **Turn 21:** the "DERIVED ILLUSTRATION" allocation tray is drawn over the circle and the
     marks, and faded labels show through it. Give the tray its own area below or beside the
     field, so nothing sits under it. Make any label that has faded out fully absent rather than
     faint.
   - **Definition card:** the left definition card is about 640 px tall, but its text fills only
     the top 180 px. Size the card to its content, or use the space for the term's key words in
     larger type. Keep the layout balanced.
6. **`TajfelCitation`, turn 22 (`e275.png`).**
   - The narration names "Social Identity Theory" and "the psychology of intergroup relations",
     but the card shows neither, and its lower half is empty. Add two lines:
     - On `t22Theory`: a tag "SOCIAL IDENTITY THEORY".
     - On `t22Relations`: the line "in *The Social Psychology of Intergroup Relations*, ed.
       Austin & Worchel". The source is `Paper/references.bib` lines 4236–4244.
   - The exit connector may leave the plate only after `t22Relations`, and it must not cross the
     border's side elements. Stop it at x ≤ 1840.

## Done means

All of these pass:
- Episode tsc.
- `check_min3_7_a` and `check_min3_7_b`, with the new no-overlap asserts at every sampled frame.
- `check_min3_7_shared`, `check_minute_two`, `check_first_minute`, `check_roadmap_boot` and
  `check_dashboard`.
- The plan compile, byte-identical.
- `check_antithesis.py` on the files you touched.

Then append a "Fix pass 1" section to each findings file.
