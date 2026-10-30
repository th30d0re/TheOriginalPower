# G_cone — five-tier cone shots for G12, G17, G19 (R5) — 2026-10-29

Scope: the manimgx cone runs `S05-05` (TierCone, turns 121–126) and `S07-01` (OrthoIllusion, turns 194–210).
Nothing committed. `common16x9.py` is untouched; the other party's uncommitted N25 storyboard in `tier_cone.py` is kept,
still gated by `YT02V2_N25=1`.

## Files

| file | change |
|---|---|
| `yt02/cone_frame.py` (new) | R5 frame for every cone shot: Figma background, the Figma circuit border as vectors, safe area, handoff circle constants, `cue_any` (the next spoken word from a list, searched across the run's turns, so beats follow the words when the script is reordered). `python cone_frame.py border <figma clip>` re-lifts the border. |
| `yt02/cone_assets/figma_border.png` (new) | Border lifted from `outputs/YT02v2/video/figma/card-s01-01.mp4` as ink over alpha. Tracing source only. |
| `yt02/cone_assets/figma_border_loops.npz` (new) | That border traced to 40 closed outlines (1,929 points, 1920×1080 px). This is what the scenes draw. |
| `yt02/tier_cone.py` | `TierCone(ConeFrame, Orthographic16x9)`: G12. The other party's N25 storyboard is kept. |
| `yt02/ortho_illusion.py` | `OrthoIllusion(ConeFrame, YTScene3D)`: G17 and G19, bordered. Imports trimmed to what is used. |
| `yt02/logs/G_cone/` | Sheets and probe frames checked (below). |

## R5 frame (both runs)

- **Background.** Figma clips decode to RGB (11, 25, 41) at every sampled point. `#0B1929` renders two levels darker
  through the run encoder, so the source value is **`#0D1B2B`**, which decodes to exactly (11, 25, 41). Verified on
  the final S05-05 and S07-01 runs. The old manim ground `#0F1B33` decoded to (12, 25, 48).
- **Border.** This is the Figma border (component `3:119`, ink `#E6C899`), lifted from a card clip and traced to vectors.
  Against the Figma frame it differs by 1.07 levels on average; the residue is edge anti-aliasing. The border is
  drawn on top and stays on for the whole shot. All content sits inside ±6.1 × ±3.05 scene units.
- **manimgx bug (worth knowing for any 3-D scene).** A fixed-in-frame `ImageMobject` turns off the 3-D depth order.
  Tiers then draw in the order they were added. From above this hides, but a view from below shows the apex on top.
  It still happens when the image is added first. Vector mobjects are unaffected, which is why the border is traced.
  Repro: `ImageMobject` plus `add_fixed_in_frame_mobjects` plus `_build_cone()`, viewed at `phi=178°`.

## G12 — TierCone, run S05-05 (turns 121–126)

- The cone is reframed (`WIDE`: zoom 0.70, centre `[PYRAMID_X+2.15, 0, 1.3]`) to fit inside the border. The legend
  moves 0.6 left and 0.5 down, clear of the right border and the equation.
- **Equation 2.2** (`Refine(I) = E ⊔ P_uppet ⊔ F_enforce ⊔ I_buffer`, the book's `eq:refined-five-tier-partition`)
  appears at "Equation" in turn 121. Each tier then lights at the word that names it, in three places at once: on the
  cone, in the legend, and in the equation. In the equation the named term turns cream with an underline in the tier's
  colour, and the other terms recede. Cues: apex/Elite (122), Puppet (123), Enforcement (124), Buffer (125).
- **Equation 2.3** (`O = O_racialized ⊔ O_adjacent,1 ⊔ ⋯ ⊔ O_adjacent,m`) replaces 2.2 at "base" (126). `O_racialized`
  lights at "racialized".
- **Out-group decomposition.** At "denoted" the camera rises over 2.0 s to straight above the Out-group. The equation,
  legend and upper four tiers fade during the rise. The Out-group's silhouette is then exactly the handoff circle. A
  flat disc of the same size crossfades in over 0.45 s while the 3-D cone fades out. The shot ends on that circle and
  holds it to the end of the run.
- The old "O_racialized + adjacent Out-groups" caption (it had an underscore, against R4) is gone. Eq 2.3 replaces it.
- **"Equation 0.3" in G12.** The book's Eq 0.3 is `eq:0.3-drude-conductivity` (printed as 0.7). The out-group partition
  is **Eq 2.3**, so I read G12's "0.3" as 2.3 (or Figure 0.3). The author should confirm.

### Circle handoff geometry (for the Figma pie-chart frame)

Measured on the final rendered frame of `S05-05.mp4` (`logs/G_cone/S05-05_handoff_frame.png`):

| | value |
|---|---|
| frame | 1920×1080 |
| centre | **(960, 540)** px (measured 959.5, 539.0) |
| radius | **378 px** (diameter 756; scene units 2.8 = `HANDOFF_RADIUS`) |
| bounding box | x 582–1337, y 162–916 |
| fill | `#030304` (NIGHT), no stroke; decodes to (2, 2, 2) |
| background | `#0D1B2B` source, decodes (11, 25, 41), identical to the Figma frames |
| border | the standard Figma border, present at the cut on both sides |
| nothing else on screen | the equation and legend are gone before the circle lands |

- The Figma pie frame should open on that exact circle: a centred disc 756 px across, `#030304`, with the standard
  border, then decompose it.
- Timing on the current audio: the rise starts at 1536.91 s ("denoted"). The circle is complete at **≈1539.36 s**,
  just before "alongside" (1539.47 s), the word where the adjacent Out-groups are named.

## G17 — OrthoIllusion, run S07-01 (turns 194–203)

- **Entry (coarse projection).** The bordered frame opens filled 50/50 on the horizontal: white above with
  "In-group *I*", black below with "Out-group *O*". The left/right layout and the "THE ORTHOGRAPHIC ILLUSION" title are
  gone. The camera waits underneath, close on the Buffer's lower rim.
- **Pull-back, no rotate.** At "separate", the camera pulls back over 2.2 s to the whole cone. The flat blocks fade as
  the tiers fade in, so the blocks separate into tiers. At "apex"/"Elite" the apex pulses and the legend comes in.
  The old projection-plane/rays beat and the head-on return are removed.
- **Looking up.** At "upward" the camera goes to the Out-group's place, with the Out-group itself hidden, and looks
  straight up (`phi=178°`, zoom 3.2). The Buffer's underside fills the frame: white. At "Ceiling", "FLAT CEILING"
  appears. At "align", the Buffer ghosts to 0.08 and Enforcement and Puppet go half-transparent, which shows every
  higher tier stacked on one axis behind the ceiling.
- **Looking down.** At "downward", the same move is mirrored. The camera goes to the Buffer's place, with the Buffer
  and everything above it hidden, and looks straight down (`phi=2°`, same zoom). The Out-group fills the frame: black.
  At "extraction" the camera eases back so the Out-group and Buffer sit inside a white frame, while the gold extraction
  arrow leaves it upward, labelled "EXTRACTION → E".
- The later beats are kept but re-cued by word (`next_cue`), kept inside the border, and given real subscripts:
  wide shot, boundary and elevation ticks, Eq 2.1/2.2 callouts, orthogonal deflection, kinetic decoy, collision, and
  generate/transmit/enforce/absorb.

## G19 — turn 203 (`cd0d010c78c151d3`)

- At "alignment" (or "Obscuration"), Puppet and Elite drop to close the gaps above Enforcement. The three tiers become
  one solid block and the bottom two dim to 0.25. "CONTROL NODE / E ∪ P_uppet ∪ F_enforce" appears, and the block
  pulses gold.
- It pulses twice more at "indistinguishable".
- At "administer", the control node ghosts to 0.06 and the Buffer and Out-group return to full, captioned
  "I_buffer, O / the bottom two, alone". This is the view from the bottom two with no control structure in it.
- 0.7 s before the turn ends, the block re-separates and everything restores.

## Renders and checks

Only my two primaries were rendered (`edit16x9.py render <seg> --only <primary> -r 1920x1080 --fps 30 --force`). The
previous clips are backed up at
`/private/tmp/claude-501/-Users-emmanuel-Documents-Theory-TheOriginalPower/a966f00a-d586-435a-bb9b-2fe4db8206bc/scratchpad/backup/`.

- `outputs/YT02v2_ov/video/runs/1920x1080@30/S05-05.mp4`: 77.57 s, the same window as before. No warnings in the log.
- `outputs/YT02v2_ov/video/runs/1920x1080@30/S07-01.mp4`: 254.40 s, the same window. No warnings in the log; every cue
  word was found.
- Sheets checked: `logs/G_cone/sheet_S05-05.png` (6 shots) and `logs/G_cone/sheet_S07-01.png` (17 shots).
- Probe frames between sheet samples: `logs/G_cone/S07-01_probe_look_up_down_control_node.png` (white look-up, black
  look-down, extraction frame, control-node merge).

Known limits:

- With the **current** audio, turns 195–197 (cone description, projection, head-on) play over the binary entry,
  because the pull-back waits for "separate" in 198. That is the order G17 asks for. It reads right once the reordered
  script lands.
- Light 3-D shading makes the Out-group's side wall read grey just before the flat disc covers it. The crossfade
  takes 0.45 s.

## Proposed shot-list changes (keyed by turn_id, current spoken text)

| turn | turn_id | shot | proposed note |
|---|---|---|---|
| 121 | `dc9048e590104e27` | S05-05 | "What makes racism count as a system at all? …" The bordered five-tier cone assembles on the Figma ground. Equation 2.2 appears at "Equation two point two". [book Ch 0, Fig 0.2; §2.1, Eq 2.2] |
| 122 | `7ff543d5814f3c80` | S05-06 (hold) | "At the apex sits the Elite tier…" The Elite lights on the cone and in the legend; the *E* term lights in Eq 2.2. |
| 123 | `78e7fe0297c108f6` | S05-07 (hold) | "Below the Elite sits the Puppet Class…" The Puppet tier and the *P*<sub>uppet</sub> term light. |
| 124 | `2f908ba878638487` | S05-08 (hold) | "Next sits the Enforcement Class…" The Enforcement tier and the *F*<sub>enforce</sub> term light. |
| 125 | `2509237c61af7d25` | S05-09 (hold) | "Beneath them sits the Buffer Class…" The Buffer tier and the *I*<sub>buffer</sub> term light. |
| 126 | `67581ab6ddc0c1d5` | S05-10 (hold) | "At the base sits the racialized Out-group, denoted O-sub-racialized, alongside adjacent Out-groups…" Eq 2.3 replaces 2.2. At "denoted" the camera rises over the Out-group until it reads as one flat circle (centre 960,540, r 378 px). **Cut to the Figma pie at "alongside" (≈1539.4 s)**, which decomposes that circle into *O*<sub>racialized</sub> and the adjacent Out-groups. If the shot list cannot cut inside a turn, the pie starts at turn 127; the cone holds the circle until then, so either cut matches. [book §2.1, Eq 2.3] |
| 194 | `a2f5063440be3e08` | S07-01 | Bordered and zoomed into the cone: white In-group *I* above, black Out-group *O* below, split 50/50 on the horizontal. This is the coarse projection. |
| 195 | `74dc3b00af954620` | S07-02 (hold) | Holds the binary until the pull-back. Recommend moving this cone description after turn 198, or folding it into 198. |
| 196 | `a98ca690a11f1dda` | S07-03 (hold) | Holds the binary. The rays/projection-plane visual is gone, so the narration should describe coarse resolution instead. |
| 197 | `a1cb5ec57c4c5582` | S07-04 (hold) | The binary close-up (G17's new entry). |
| 198 | `f752296d45ac9aa3` | S07-05 (hold) | At "separate" the camera pulls back and the blocks separate into the cone's tiers; at "apex" the Elite pulses. No rotation. |
| 199 | `a9d3679ca1557bee` | S07-06 (hold) | At "upward" the camera moves to the Out-group's place and looks straight up: the Buffer's underside fills the frame, white. |
| 200 | `94b9f78d780723c8` | S07-07 (hold) | "FLAT CEILING" at "Ceiling"; at "align" the Buffer ghosts and the higher tiers show stacked on the same axis. |
| 201 | `04db51716979d53e` | S07-08 (hold) | At "downward", the same move mirrored from the Buffer's place, looking down: the Out-group fills the frame, black. At "extraction" the camera eases back and the extraction arrow leaves the white frame upward. |
| 202 | `c881f64242f58f1b` | S07-09 (hold) | Unchanged: the wide cone and the extraction circuit. |
| 203 | `cd0d010c78c151d3` | S07-10 (hold) | G19: Elite, Puppet and Enforcement close into one block, the CONTROL NODE (*E* ∪ *P*<sub>uppet</sub> ∪ *F*<sub>enforce</sub>), and pulse. Then the control node ghosts out and the bottom two, *I*<sub>buffer</sub> and *O*, stand alone. |

## Narration the script pass must match

These are the cue words the scenes look for. Each is matched as a word prefix, and the search runs forward across
turns, so the turn order can change. If a cue word disappears in S07-01, that beat fires 1 s late and the render log warns. In S05-05, a missing tier word falls back to the start of its turn.

- **Turn 121:** keep the word "Equation" (Eq 2.2 appears there).
- **Turns 122–125:** each turn names its tier: "apex" or "Elite", "Puppet", "Enforcement", "Buffer".
- **Turn 126:**
  - say "base" (or "Out-group"), then "racialized";
  - then "denoted" (or "sub"), where the rise starts, about 2.5 s before the circle completes;
  - name the adjacent Out-groups after that, since the Figma pie shows them.
- **Turn 197:** "head-on" and "on one side … on the other" no longer match the picture. Suggested: *"Zoomed in close,
  the cone becomes two flat groups: a white In-group above the line and a Black Out-group below it. The vertical
  command structure vanishes."*
- **Turn 198:** **drop "Rotate the image."** Keep "separate" and "apex". Suggested: *"Pull the camera back. The flat
  blocks separate into tiers, and the Elite apex emerges above the proxies that had concealed it."*
- **Turn 199:** keep "upward", e.g. *"Pan upward from the Out-group's position inside the base."*
- **Turn 200:** keep "Ceiling" and "align".
- **Turn 201:** keep "downward" and then "extraction". It must say "downward" before "extraction", and "downward" must
  come after "Ceiling".
- **Turn 202:** keep "Zoom" (or "full"/"cone") and "connected" (or "architecture").
- **Turn 203:**
  - "alignment" (or "Obscuration") triggers the merge;
  - "indistinguishable" (or "becomes") triggers the pulse;
  - "administer" (or "actors") triggers the bottom-two view.
- **Turns 204–210**, in order:
  - "real" or "boundary", then "hierarchy";
  - "Equation" twice (Eq 2.1, then Eq 2.2);
  - "Orthogonal" or "Deflection", then "horizontal";
  - "Kinetic" or "Decoy";
  - "reinforce", then "collides";
  - "wide", then "capture";
  - "generative", then "absorb".
- **Turns 195–196:** they now play over the binary until the reorder lands. If they stay, the projection sentence
  should match the zoomed-in binary, for example coarse resolution showing one boundary, and avoid "head-on".
