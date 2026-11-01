# YT02v2_ov on Stage: code-driven picture, first minute

Status 2026-10-30. Review document: the decisions marked **Decide** are yours.

## How the pieces fit

- **Engine** (scriptCast, branch `v0.3-stage`, worktree `../scriptCast-stage`). "Stage" is a scene
  engine where every scene is a React/TypeScript component that reads episode-absolute
  milliseconds and named **cues**. A cue is a spoken word ("archives", "Portugal") resolved to
  its time from `outputs/YT02v2_ov/word_timings.json`. Two clocks drive the same scenes:
  Remotion renders the video; a Vite site drives them from scroll position or from the audio, with
  hover and click live on the instruments. Brief: `../scriptCast-stage/docs/briefs/stage-engine.md`
  (Codex is building it now).
- **Episode content** (this repo, `video/yt02/stage/`). `stage.yaml` lists one shot per OV turn
  (the same one-shot-per-turn standard as the shot list), the scene each shot uses, its props and
  its cue words. `scriptcast-stage plan` compiles it with the manifest and word timings into a
  plan; `scriptcast-stage render --per-shot` writes `S00-01.mp4 …` into a new
  `outputs/YT02v2_ov/video/stage_runs/`, never into `runs/`.
- **Figma** returns to design: tokens (colours, type, spacing) as Figma variables, one frame per
  scene state, and each instrument as a component with `compact / expanded / settings` variants.
  Code implements those frames; Figma stays the reference for review.
- **Cinematic stills** (Nano Banana) stay as images. Vectorising them later is a separate
  experiment.

## First minute: turns 0–5 (0:00–1:20.7)

The current picture for these six turns is four static text cards. Proposed scenes, with the cue
words that drive each beat (seconds within the turn):

| Turn | Window | Scene | Beats on spoken words |
|---|---|---|---|
| 0 | 0:00–0:13.5 | **TitleOpen** | "Original Power" 0.5: book title sets in. "archives" 3.5, "equations" 4.5, "tests" 5.4: three method tiles light one by one (archive folio, the equation W = ψ_m + jψ_s, a test with pass/fail ticks). "Episode" 7.1: tiles fold into a header strip and *Episode 1 · What Racism Is* lands. "fails" 12.2: a red marker underlines "the definition most of us were taught". |
| 1 | 0:13.5–0:26.9 | **DictionaryEntry** | "Dictionary" 3.2: a dictionary entry for *racism* builds, senses 1–3. "individual prejudice first" 5.1–6.1: Sense 1 lights at the top. "institutional pattern later" 7.0–8.1: Sense 3 fades in at the bottom, smaller. "order" 9.4: the numbers 1, 2, 3 lift out to the side. "causal story" 10.5: they join into an arrow chain marked cause → effect. "evidence" 11.9: an empty evidence slot appears beside the chain. |
| 2 | 0:26.9–0:40.5 | **WhyLadder** | Four *Why* lines, each landing on its "Why" (2.4, 4.3, 6.6, 10.6), each with a live thumbnail of the scene that answers it later: the dictionary entry from turn 1 shrinks into slot 1; a bias / racism split for slot 2; the dashboard map zooming to Virginia for slot 3 (first glimpse of the map); a reform → backlash pulse chart for slot 4. |
| 3 | 0:40.5–0:50.1 | **LiteratureStack** | "bias" 2.2, "prejudice" 3.1, "discrimination" 3.6: three blocks stack. "tripartite model" 5.3: a bracket groups them as affect, cognition, behaviour. "stops" 8.3: a boundary line draws across; the region past it stays dark and unlabelled, where the book's argument begins. |
| 4 | 0:50.1–1:14.0 | **Roadmap** | Fourteen items in 23.5 s, one every 1.7 s, each lighting on its own word ("vector definition" 1.1 … "rebuilt hierarchy" 22.2). See the decision below. |
| 5 | 1:14.0–1:20.7 | **Disclosure** | A quiet card: the narration uses an AI voice clone trained on the author's speech. A thin waveform runs under it. Low motion. |

All six keep the circuit-schematic frame (already in code as `LandscapeFrame.tsx`) and the navy,
cream and gold palette.

**Decide 1 — turn 4.** (A) *Route map*: the fourteen items as stations along a line that draws
itself, the camera travelling with it. Independent of the dashboard, so it can ship now.
(B) *Dashboard boot*: the runtime dashboard powers up and each named item registers as a tile in
its rail; "runtime dashboard" at 18.9 brings the map itself online. This makes the dashboard the
episode's home base from minute one, and it waits on the dashboard design. My pick is B, with A as
the fallback if the dashboard review runs long.

**Decide 2 — first-minute boundary.** I set it at turn 5 (1:20.7) so it ends on the disclosure,
before "So why does the dictionary list individual prejudice first?" opens the next beat.

## The runtime dashboard

### Instruments

Each instrument has a compact view (fits in the rail around the map), an expanded view (hover on
the site; cued in the video) and a settings view (gear button: sources, units, the log text
verbatim).

| Instrument | Source | Compact | Expanded |
|---|---|---|---|
| Era clock | Runtime Log title | year + place | era timeline with every log, current era lit |
| System Stress | "System Stress (min: class resistance)" | level badge | badge + the log's reason + history across eras |
| Capital | "Capital (max: extraction output)" | level badge | badge + reason + history |
| Interference | "Interference State (Φ_load, ρ_τ)" | ρ_τ needle dial with τ = 1.0 | Φ_load range bar, ρ_τ dial, the crash in 1676 |
| Active Patch | "Active Patch" | one console line | full console with patch history |
| Variables | "Variables Loaded / Deployed" | chip row, new chips gold | each chip with its definition and equation |
| Executing Function | "Executing Function" | one line | function + what it reads and writes |
| Policy ticker | the `[POLICY]` lines | ticker along the bottom | list with dates and citations |

Values stay verbatim from the logs (`dashboard_eras.json`, already extracted from the
manuscript). **Decide 3:** add instruments the logs do not carry? Candidates: the complex wage
phasor W = ψ_m + jψ_s (extraction up, ψ_s right, per the axis convention), the five-tier stack,
the U = I ⊔ O partition.

### Layout and camera

Map centred at about 60% of the width. Era clock and timeline across the top; three compact
instruments down each side; policy ticker and console along the bottom. Camera beats follow the
logs: world → Iberia (Lisbon 1441–1486) → the West African coast → the Atlantic → Virginia (1676)
→ Philadelphia (1787) → the American South → the United States.

The map is programmatic (`d3-geo` + Natural Earth data), so every zoom is exact and repeatable.
Modern borders are anachronistic for 1486 and 1676. **Decide 4:** modern borders with
period labels (fast), or period polygons for the colonies and kingdoms we name (more work, more
correct).

### Visual direction

Three Nano Banana concepts, generated through `agy`'s image-generator subagent (Figma's AI
credits are out until 2026-11-03), are on the Figma page **Stage · Dashboard concepts**
(`6SPd7rWzwyvxHhIj4Cmb7a`, page `184:1451`). They set the mood only; their text is garbled.
The existing panel-grid dashboard (page *YT02 · Runtime dashboard*, eight intro frames and seven
era frames) supplies the instrument content, including the Buffer Class wage phasor.

- **A · Mission control.** Gold line-art world map on navy, glass instrument panels with cream
  hairlines, circuit-schematic frame, era strip across the top. Closest to the current cards.
- **B · Archival cartography.** The map as an engraved nautical chart (rhumb lines, compass rose),
  instruments as flat brass-and-glass gauges and ledger plates, era ruler along the bottom. Leans
  into the five-century archive.
- **C · Oscilloscope.** A dot-matrix map in teal with gold heat over the active region,
  instruments as scope traces, a phasor plane, hairline tiles. Leans into the book's electrodynamic
  formalism.

Prompt A: *16:9 UI concept frame for a futuristic historical-systems monitoring dashboard,
"mission control" style. Deep navy background (#0f1b33). Center: a large flat vector world map
drawn in thin gold (#d9a441) line art with faint graticule, zoomed onto the Iberian Peninsula and
the West African coast; Portugal glows warm gold, a dotted maritime route arcs from Lisbon down the
African coast. Around the map, compact semi-transparent glass instrument panels with thin cream
(#f4ead2) borders: a stress badge reading HIGH in red, a capital status badge, a semicircular dial
with a needle and a red threshold mark at 1.0, a horizontal range bar 0 to 1, a small monospace
console, a row of variable chips some lit gold. One instrument in the lower right is expanded into
a larger detail card with a line chart. A thin era timeline across the top with ticks 1441, 1486,
1676, 1865, 1965, 1994, 1486 highlighted. The outer border is a thin circuit schematic with
resistor zigzags, capacitor plates and inductor coils in gold. Clean flat vector, crisp thin
strokes, legible, generous spacing, no photographs, no people, teal (#6ec3c0) secondary accent.*

Prompt B: *16:9 UI concept frame for a historical-systems dashboard, "archival cartography meets
instrument panel". Deep navy background (#0f1b33). Center: a world map rendered as an engraved
nautical chart, fine cream (#f4ead2) coastlines, rhumb lines and a compass rose, zoomed onto
Portugal, the Atlantic and the West African coast; Portugal filled warm gold (#d9a441); a sailing
route drawn in gold from Lisbon south along Africa. Around the map, compact instruments styled as
brass-and-glass gauges and plaques in flat vector: a round dial with a needle and a red (#e2573f)
danger arc, a vertical level meter, a ledger plate listing three dated policy lines, a row of
engraved token chips some lit. One gauge on the right is expanded into a detail card with a small
chart. An era ruler along the bottom with 1486 marked. Circuit-schematic ornament in the frame
corners. Elegant, legible, generous whitespace, no people, no photographs.*

Prompt C: *16:9 UI concept frame for a futuristic signal-analysis dashboard of world history,
"oscilloscope" style. Very deep navy background (#0b1428). Center: a world map made of a fine
dot-matrix of small glowing points, teal (#6ec3c0) land, zoomed onto Iberia and West Africa; the
dots inside Portugal brighten to gold (#d9a441) and a soft heat bloom spreads south along the
African coast. Around the map, compact tiles with hairline borders: an oscilloscope trace, a
phasor diagram on a complex plane, a semicircular gauge with a red threshold, a stacked bar of five
tiers, a monospace terminal, a row of variable chips with subscripts. One tile in the upper right
is expanded into a large panel with axes, gridlines and callouts. A thin timeline scrubber along
the bottom, 1486 highlighted. Precise flat vector UI, crisp hairlines, high contrast, restrained
glow, no people, no photographs.*

### Review loop

1. You pick a direction (or a blend) from the concepts.
2. I build it in Figma: tokens as variables, the map shell, every instrument as a component with
   its three variants, and one frame per camera beat for the Portugal sequence.
3. You review the Figma frames.
4. Codex implements the components on Stage from those frames; I render stills of the same states
   and compare them side by side with the Figma frames before you see them in motion.

## Order of work

1. Engine on `v0.3-stage` (running now), then a demo render to prove the clock, cues, map camera
   and an instrument changing modes.
2. First-minute scenes for turns 0–3 and 5 (independent of the dashboard), designed in Figma and
   built on Stage after your storyboard review.
3. Dashboard concepts → Figma → code, then turn 4 if you pick option B.
4. Render the first minute with the OV audio for your review in ScriptCast and on the site.
