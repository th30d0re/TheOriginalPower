# ATO Episode 2 — Video Shot List

Companion to `../podcasts/ATO_EP02_preface.md`.

Graphics live here, never inside the script. scriptCast's markup tokenizer
(`scriptcast/markup.py`) only recognizes `[pause:NNNms]`, `[beat]`, `[emphasis]`
and `[tone]`. Any other bracketed tag falls through and gets spoken aloud by the TTS
engine, and any non-tag line inside a speaker turn is spoken too. So the script stays
pure speech and the video cues stay in this file.

## Alignment procedure

Cue anchors are the script's own header timestamps, and those are derived from measured
audio by `scriptcast-retime`. Episode 2 has not been rendered yet, so its
timestamps come from speaker rates measured on Episode 1 and carried forward in
`Architecting_the_operation/scriptcast/speaker_rates.json`. After the render, re-run:

```bash
scriptcast-retime Architecting_the_operation/podcasts/ATO_EP02_preface.md \
    --manifest outputs/ATO_EP02_local/episode_manifest.json \
    --shotlist Architecting_the_operation/video/ATO_EP02_shotlist.md --apply
```

That rewrites the script headers to the real offsets and moves every anchor and hold
below with them. An anchor that stops resolving to a real turn is reported as
UNRESOLVED rather than snapped to the nearest one; fix those by hand against the cue's
content.

## Provenance key

- `[book]` — stated in `Paper/The_Original_Power.tex`, cited by a phrase
  quoted from it: `"runs on human predictive cognition"`. The quote is the
  anchor because it survives editing the manuscript, and `shotspec.py`
  resolves it to a current line number in the generated spec. A bare line
  number (`:208`) still parses, and still goes stale the next time the
  chapter above it grows.
- `[data]` — computed from a CSV in `Paper/data/`.
- `[design]` — illustrative, no data claim. Must not carry axis numbers.

## Continuity with Episode 1

Reuse, do not redesign: the five-tier stack, the ψ phasor, the circuit vocabulary
plate, and the lower-third name cards. Episode 1 built those and this episode is the
payoff for several of them. New visual families introduced here: the software/wetware
stack, the fractal zoom, the transistor schematic, and the phase diagram.

---

## G-01 — Title card

- **Anchor:** `Toussaint (00:00)`
- **Hold:** through 00:09
- **Type:** static
- **Content:** *Architecting the Operation* / Episode 2 / "The Preface" /
  subtitle: What racism actually is.

## G-02 — Ten definitions

- **Anchor:** `Aisha (00:03)`
- **Hold:** through 00:13
- **Type:** text accumulation, then collision
- **Content:** the seven definitions Aisha reads land one at a time as separate cards.
  Prejudice plus power · Individual hatred · A system · Unconscious bias · A slur ·
  A hiring gap · A neighborhood.
- **Beat 2:** they slide toward one center point and overlap into an unreadable stack.
- **Note:** `[design]`. The unreadability is the argument. Do not resolve it.

## G-03 — Specification failure

- **Anchor:** `Toussaint (00:25)`
- **Hold:** through 00:32
- **Type:** split panel
- **Left:** an engineering spec sheet with a tolerance field left blank.
- **Right:** the same part manufactured three different ways, all of them "passing".
- **Note:** `[design]`.

## G-04 — The definition, stated

- **Anchor:** `Aisha (00:49)`
- **Hold:** through 01:02
- **Type:** the episode's thesis card. Hold it longer than feels comfortable.
- **Content:** RACISM = PSYCHO-LEGAL SOCIAL SOFTWARE, with the four code types listed
  beneath it (legal · institutional · cultural · affective) and a second line:
  runs on human predictive cognition — WETWARE.
- **Note:** `[book]` `"runs on human predictive cognition"`. Verbatim terms. Do not
  paraphrase this card. It states two of the three layers; G-04b supplies the third
  and the direction of control between them, so the two cues are a pair.

## G-04b — Three layers, and which way control runs

- **Anchor:** `Toussaint (00:59)`
- **Hold:** through 01:49
- **Type:** three stacked bands, built top down, then a control arrow
- **SOFTWARE:** statutes, ordinances, institutional procedure, and the cultural and
  affective material that carries them.
- **HARDWARE:** the physical structure of society the software builds and operates.
  Where people may live, where money moves, where enforcement sits, what a
  neighborhood is worth. The electrodynamic formalism describes this band — circuit
  topology, complex power signal, inductive kickback.
- **WETWARE:** human predictive cognition, one head at a time.
- **Beat 2:** a control arrow from SOFTWARE into HARDWARE, labeled the way it works in
  any computer. The field appears in the HARDWARE band as a consequence.
- **Beat 3:** a single particle enters the field in the HARDWARE band and its
  trajectory bends. The particle is labeled WETWARE.
- **Note:** `[book]` `Paper/The_Original_Power.tex:178`. The Preface names all three
  and the direction is Emmanuel's own statement of it on mic. Do not draw the three
  bands as peers; the arrow is the content.

## G-04c — The psychological wage touches all three

- **Anchor:** `Emmanuel Theodore (01:55)`
- **Hold:** through 06:15
- **Type:** the G-04b stack with one quantity traced through it
- **Beat 1:** ψ appears in the WETWARE band, where a listener expects it, labeled
  "what it feels like: status."
- **Beat 2:** it moves down into HARDWARE, relabeled "what it is: a field produced by
  the physical arrangement of the society." Housing, policing, what a room does.
- **Beat 3:** an arrow up from SOFTWARE, labeled "somebody legislated the arrangement."
- **Beat 4:** all three bands lit at once. Written in software. Instantiated as
  hardware. Experienced in wetware.
- **Note:** `[book]`. Reuse Episode 1's ψ phasor glyph exactly. This cue corrects a
  misfiling the series itself made in Episode 1, where ψ was introduced without the
  layer it belongs to, and Emmanuel says so on mic.

## G-05 — Two projects

- **Anchor:** `Aisha (03:10)`
- **Hold:** through 01:17
- **Type:** two columns, built in parallel
- **Left, MORAL FAILING:** intervention is persuasion. Tools: education, awareness,
  contact. Timescale: generations.
- **Right, EXECUTING CODE:** intervention is a patch. Tools: statute, audit,
  instrumentation. Timescale: a legislative session.
- **Note:** `[design]`. Both columns get equal weight and equal type size. This card
  poses the choice; it does not settle it.

## G-06 — Baltimore

- **Anchor:** `Toussaint (04:06)`
- **Hold:** through 02:20
- **Type:** the honesty beat of the cold open. Restrained. No dramatization.
- **Beat 1:** a single word on black — *Tonight, nothing.*
- **Beat 2:** the stop redrawn as a system output. One box labeled STOP with five
  upstream inputs feeding it: budget · staffing model · legal authorization ·
  political constituency · officer incentives.
- **Beat 3:** the officer box is removed and the STOP output is unchanged.
- **Note:** `[design]`. Show no faces, no uniforms, no vehicle, no city identifiers.
  The abstraction is the point and it is also the safeguard.

## G-07 — The four code types

- **Anchor:** `Toussaint (05:28)`
- **Hold:** through 02:52
- **Type:** four stacked bands, each labeled as Toussaint and Aisha name it
- **Legal:** statutes, ordinances, covenants, sentencing guidelines, zoning maps.
- **Institutional:** underwriting rules, admissions criteria, risk models, dispatch
  protocols.
- **Cultural:** what a society treats as normal.
- **Affective:** fear, disgust, loyalty, pride.
- **Note:** `[book]` `:178`.

## G-08 — What the code outputs

- **Anchor:** `Aisha (05:56)`
- **Hold:** through 06:15
- **Type:** four words arriving one at a time, large, on black
- **Content:** PERCEPTION · COMMON SENSE · THREAT DETECTION · SELECTIVE EMPATHY
- **Note:** `[book]` `"perception, common sense, threat detection"`, verbatim from the Preface. This is the card the episode
  will be clipped from. Design it to stand alone.

## G-09 — Wetware

- **Anchor:** `Aisha (07:10)`
- **Hold:** through 07:36
- **Type:** the substrate card, paired visually with G-04
- **Content:** a predictive, pattern-compressing neural network optimized for survival
  under uncertainty. Beneath it, the tradeoff stated as a dial with two ends:
  survival under uncertainty ←→ neutral truth-tracking under adversarial input.
  The needle sits hard against survival.
- **Note:** `[book]` `"a predictive, pattern-compressing neural network optimized"`.

## G-10 — Borrowed terms

- **Anchor:** `Aisha (07:54)`
- **Hold:** through 08:22
- **Type:** citation card, deliberately plain
- **Content:** ingroup / outgroup / ingroup bias, with the APA Dictionary definitions,
  then Tajfel and Turner 1979 and the five functions the sorting manages: trust,
  threat, cooperation, belonging, self-concept.
- **Note:** `[book]` `"trust, threat, cooperation, belonging"`. These are standard social-psychological terms before they
  are variables. The card exists so nobody thinks the book invented them.

## G-11 — Legacy code

- **Anchor:** `Toussaint (08:03)`
- **Hold:** through 08:56
- **Type:** three-panel progression
- **Panel 1:** small-group survival. The heuristic works.
- **Panel 2:** the same heuristic, unchanged, in a legal environment.
- **Panel 3:** an arrow labeled "malicious priors" feeding the heuristic from outside.
- **Note:** `[book]` `:215`. Do not draw a brain with a virus in it. The exploit is
  supplied input, and the graphic has to show the input arriving from elsewhere.

## G-12 — Testimony and schematic

- **Anchor:** `Emmanuel Theodore (09:18)`
- **Hold:** through 10:02
- **Type:** two documents side by side, equal size, neither one on top
- **Left:** TESTIMONY — what happened, at full resolution. Source of record.
- **Right:** SCHEMATIC — what produced it, compressed. Calibrated against the left.
- **Beat 2:** an arrow from left to right labeled "every coefficient comes from here."
- **Note:** `[design]`. Pays off at G-31. This is the episode's answer to its own
  hardest objection and the design should not be clever.

## G-13 — Where accountability sits

- **Anchor:** `Emmanuel Theodore (10:29)`
- **Hold:** through 11:29
- **Type:** the stack from G-11, with a marker moving up it
- **Content:** the marker starts on the reflex, then moves up to three labeled
  artifacts: the 1640 ruling · the redlining map · the risk-model threshold. Caption
  under each: authored, dated, signed.
- **Note:** `[book]`. The redlining map must be a generic depiction, not a real
  HOLC sheet for an identifiable neighborhood.

## G-14 — Fractal

- **Anchor:** `Toussaint (11:47)`
- **Hold:** through 12:03
- **Type:** continuous zoom, one unbroken move, no cuts
- **Content:** the same partition shape recurring at each scale in the Preface's own
  order. Empire → nation → city → school district → household → ballot line →
  a single reflex of suspicion.
- **Note:** `[book]` `:217`. The shape must be literally identical at every scale.
  Scale invariance is the claim and the graphic is the proof of concept.

## G-15 — Mind virus, and who hosts it

- **Anchor:** `Emmanuel Theodore (12:49)`
- **Hold:** through 13:47
- **Type:** the tier stack from Episode 1, with the install point marked
- **Content:** the virus payload lands on the Buffer Class band and is labeled "the
  belief that the partition is real and natural." The Out-group band is labeled
  "what the partition is executed against."
- **Note:** `[book]` `:217`. This cue answers a misreading that will otherwise cost
  the episode its audience. Build it so a viewer who watches with sound off still
  reads the direction correctly.

## G-16 — Two coupled runtimes

- **Anchor:** `Aisha (13:54)`
- **Hold:** through 14:22
- **Type:** two loops sharing an axle
- **Left loop, INSTITUTIONAL:** law, property, policing, finance.
- **Right loop, COGNITIVE:** fear, status, disgust, loyalty, selective empathy.
- **Beat 2:** arrows both ways between them. Law shapes the reflex, the reflex votes
  for the law.
- **Note:** `[book]` `"fear, status, disgust, loyalty"`.

## G-17 — Structural positions

- **Anchor:** `Toussaint (14:40)`
- **Hold:** through 15:25
- **Type:** one figure, several axes
- **Content:** a single unlabeled figure standing at the intersection of stacked axis
  bars — race, gender, class — with its position on each bar marked independently.
  On one it sits below the partition line, on another above.
- **Note:** `[book]` `:219`. Ties directly to Emmanuel's own statement of position in
  Episode 1 at 09:58. Consider a two-second recall of that episode's card.

## G-18 — The five tiers (master graphic)

- **Anchor:** `Toussaint (15:30)`
- **Hold:** through 16:19
- **Type:** the episode's spine. Builds one band at a time as each is named.
- **Content:** E, extracts value · Puppet Class, translates extraction into law and
  policy · Enforcement Class, actuates physically · Buffer Class, receives the
  suppression allocation · Out-group, bears the compounding burden.
- **Note:** `[book]` `"translates extraction into law and policy"`. Reuse Episode 1's stack geometry exactly. Every later cue
  in this episode recalls this one, so build it to survive being shown small.

## G-19 — Why five: three failures

- **Anchor:** `Emmanuel Theodore (16:38)`
- **Hold:** through 18:26
- **Type:** the stack from G-18 assembling itself through three broken drafts
- **Draft 1, two tiers:** Oppressor / Oppressed. Failure caption: predicts poor white
  communities accumulate wealth. Record disagrees.
- **Draft 2, three tiers:** Elite split from the In-group. Failure caption: nobody
  writes the statute, nobody enforces it.
- **Draft 3, five tiers:** Puppet and Enforcement added. Caption: minimum configuration
  the mathematics required.
- **Note:** `[book]` `"minimum configuration the mathematics required"`. The Appalachia claim is spoken as a directional structural
  point and carries no number on screen. Do not add one.

## G-20 — The four architectural components

- **Anchor:** `Toussaint (18:33)`
- **Hold:** through 18:53
- **Type:** four numbered cards, held as each is read
- **Content:** 1 asymmetric autonomy restriction · 2 selective empathy · 3 ideological
  justification through spurious claims · 4 resistance to structural critique.
- **Note:** `[book]` `"3) ideological justification through spurious claims"`. Verbatim.

## G-21 — John Punch, 1640

- **Anchor:** `Emmanuel Theodore (19:00)`
- **Hold:** through 20:06
- **Type:** court-record card, three rows, built as the sentence is read
- **Row 1:** the Scotsman — four additional years.
- **Row 2:** the Dutchman — four additional years.
- **Row 3:** John Punch — servitude for life.
- **Beat 2:** components 1 and 2 from G-20 light up against the rows. Component 3
  stays dark, with the caption: the court cited no theory, no scripture, no science.
- **Note:** `[book]` `Paper/The_Original_Power.tex:3190`. Three men, one act, one
  court, one day. No illustration of the men. The record is the graphic.

## G-22 — Causal order

- **Anchor:** `Emmanuel Theodore (20:25)`
- **Hold:** through 21:03
- **Type:** three-step arrow, the episode's most reusable card
- **Content:** Elite economic interest → systemic racialization → interpersonal
  prejudice. Beneath it, the dates: 1640 the ruling · 1662–1669 the statutes ·
  1705 the codes.
- **Note:** `[book]` `:3190`. The arrow runs left to right and never reverses. This
  inverts the order most viewers hold, so give it room.

## G-23 — The inversion

- **Anchor:** `Aisha (22:32)`
- **Hold:** through 22:52
- **Type:** two diagrams, the second replacing the first
- **Diagram 1, the intuitive picture:** power originating at the apex and flowing down.
- **Diagram 2, the Preface's picture:** the supply rail at the base, labeled with the
  kinetic labor, taxes, and physical output of the Out-group and Buffer Class, and the
  apex drawn as a small control input.
- **Note:** `[book]` `"The kinetic labor, taxes, and physical output"`. The most important cut in the episode. Make the swap
  abrupt.

## G-24 — The parasitic control layer

- **Anchor:** `Aisha (22:46)`
- **Hold:** through 23:44
- **Type:** the book's own schematic, animated
- **Content:** Figure P.1 from the manuscript. Transistor stage. Base current labeled
  laws, algorithms, media narratives. Supply rail labeled V_cc, the kinetic labor of
  O and I_buffer. Feedback path from the output back into the interference engine.
- **Note:** `[book]` `fig:parasitic_transistor`, `"Parasitic Control Layer.} The"`.
  Redraw it for screen legibility, keep every label the figure uses. This is the first
  time in the series that a figure from the book appears as itself.

## G-25 — Self-exciting generator

- **Anchor:** `Emmanuel Theodore (23:50)`
- **Hold:** through 24:34
- **Type:** loop animation over the G-24 schematic
- **Content:** a fraction of the output splits off and feeds the field coils. Three
  labels ride the loop: your labor is the supply · your taxes buy the enforcement ·
  your attention feeds the narrative layer.
- **Beat 2:** the compliance line is cut and the whole diagram goes dark.
- **Note:** `[book]` `:183`. The dark frame is where the episode's title card for
  clips should be pulled from.

## G-26 — Dynamical homology

- **Anchor:** `Aisha (24:53)`
- **Hold:** through 26:22
- **Type:** two systems, one equation
- **Content:** an electrodynamic control architecture on the left, a socioeconomic one
  on the right, and a single governing equation between them. Caption: the claim
  concerns the equations. The units are irrelevant to the homology.
- **Beat 2:** a pointer to Chapter 2 — augmented Lagrangian control system, with its
  falsification tests in the same chapter.
- **Note:** `[book]` `"The claim concerns the equations; the"`, `ch:lagrangian`. This is the
  joint the whole book hangs from. Label it as the place to attack.

## G-27 — Inductive kickback

- **Anchor:** `Aisha (26:30)`
- **Hold:** through 26:50
- **Type:** oscilloscope trace
- **Content:** steady current, an abrupt interruption, and the voltage spike that
  follows. Second label under the spike: backlash, predicted output.
- **Note:** `[book]` `:178`.

## G-28 — Destructive interference

- **Anchor:** `Toussaint (27:17)`
- **Hold:** through 28:09
- **Type:** wave animation, the episode's most technical graphic
- **Beat 1:** several waves of real amplitude, each labeled with an axis — race,
  gender, class, religion, identity.
- **Beat 2:** they arrive out of phase and the sum trace stays flat.
- **Beat 3:** the same waves brought into phase and the sum rises sharply.
- **Caption under beat 2:** politically hyperactive, structurally inert.
- **Note:** `[book]` `"race, gender, class, religion, identity"`. Beat 3 is the encouraging half and Emmanuel says so on
  mic. The amplitudes must be identical in both beats; only phase changes.

## G-29 — The expansion principle

- **Anchor:** `Aisha (29:30)`
- **Hold:** through 30:14
- **Type:** an animated boundary over a timeline
- **Content:** the In-group boundary drawn across the span the script names —
  Portuguese racialization, the invention of whiteness, the 13th Amendment loophole,
  redlining, the War on Drugs, the present. The boundary contracts at each step and
  the Out-group region grows.
- **Beat 2:** the Elite subset stays a fixed small area throughout.
- **Note:** `[book]` `"the invention of whiteness, the 13th Amendment"`. Structural and directional. Carry no percentages, no
  population figures, and no axis numbers on this card.

## G-30 — Confidence tiers

- **Anchor:** `Aisha (31:10)`
- **Hold:** through 31:50
- **Type:** three definition cards plus a count
- **Tier 1:** directly reported or transparently derivable from a peer-reviewed source
  or public dataset, with no undisclosed analytical step.
- **Tier 2:** public dataset with disclosed author operationalisation.
- **Tier 3:** ordinal or structural claim, no quantitative calibration attempted, basis
  stated.
- **Then:** 146 anchor cases · 146 historical events · every claim carries a
  falsification criterion.
- **Note:** `[book]` `"directly reported or transparently derivable from a"`. Verbatim definitions.

## G-31 — The loss

- **Anchor:** `Emmanuel Theodore (31:57)`
- **Hold:** through 32:32
- **Type:** callback to Episode 1's hiring-study card
- **Content:** the 2024 result, then the 2026 matched-pair replication at parity, then
  the book page where both are printed.
- **Note:** `[book]`. Episode 1 already stated both halves. Reuse that card exactly so
  the viewer recognizes it.

## G-32 — Two instruments, in order

- **Anchor:** `Toussaint (32:50)`
- **Hold:** through 33:39
- **Type:** sequence diagram, and the order is the content
- **Step 1, RADICAL EMPATHY (activation):** the viewer icon placed inside each of the
  five tiers in turn, with what gets mapped listed — incentives, risks, fears, rewards,
  constraints — and a second panel held alongside it: the full accounting of harm.
- **Step 2, VEIL OF IGNORANCE (computation):** tier, phenotype, and accumulated
  advantage strip away, and the architecture is judged on structure alone.
- **Note:** `[book]` `"the full accounting of harm"`, Rawls. Step 1 must visibly carry both panels. The second
  panel is what separates the instrument from excuse-making and Emmanuel says so.

## G-33 — The install point

- **Anchor:** `Toussaint (35:25)`
- **Hold:** through 35:41
- **Type:** the G-32 sequence with a friction meter running alongside it
- **Content:** as the viewer icon moves through the tiers, a resistance reading rises.
  Caption: feeling the resistance identifies the install point.
- **Note:** `[book]` `"Feeling the resistance identifies the install point"`.

## G-34 — The diagnostic question

- **Anchor:** `Toussaint (35:47)`
- **Hold:** through 36:00
- **Type:** text on black, no motion
- **Content:** *If you had no clue which tier you would wake up in, would you co-sign
  this architecture?*
- **Note:** `[book]` `"no clue which tier you would wake"`. Verbatim. Hold it in silence past the end of the line.

## G-35 — Innocence structurally unavailable

- **Anchor:** `Emmanuel Theodore (36:08)`
- **Hold:** through 36:34
- **Type:** the G-18 stack, every band marked
- **Content:** each tier gets one line. Out-group, extracted from. Buffer Class, paid
  to hold a line it did not draw. Enforcement, carries out policy it did not write.
  Puppet Class, executes a preference from above it. Elite, gates the whole thing.
- **Beat 2:** no band is left unmarked.
- **Note:** `[book]` `:219`.

## G-36 — Four parts

- **Anchor:** `Toussaint (36:41)`
- **Hold:** through 37:56
- **Type:** the book laid out as a life cycle, four segments
- **Content:** Specification and Origins, 1440s–1915 · The Installation, 1619–1865 ·
  Scaling and Runtime, 1865–present · Diagnostics and Output.
- **Note:** `[book]` `"Scaling and Runtime, 1865--Present"`. The ranges overlap by design and Part II opens inside
  Part I's range. They are era anchors rather than a partition of the timeline, per the
  convention in `AGENTS.md`, so do not draw them as adjacent non-overlapping bands.

## G-37 — Why a Preface

- **Anchor:** `Emmanuel Theodore (38:10)`
- **Hold:** through 38:43
- **Type:** two-column contract card
- **Left, THE PREFACE:** the specification. Terms, architecture, methodology. Nothing
  proved here.
- **Right, THE CHAPTERS:** the implementation. Every claim attached to a tier and a
  falsification criterion.
- **Note:** `[design]`.

## G-38 — Next episode

- **Anchor:** `Emmanuel Theodore (39:45)`
- **Hold:** through the end of the segment
- **Type:** end card
- **Content:** Episode 3, Chapter 0: System Initialization. The five nodes. The
  three-dimensional pyramid. The Tri-Modal Enclosure Model. The optical illusion that
  hides the apex from the base.
- **Note:** `[book]` `ch:system_init`.

---

## Sensitivity notes

- **G-06, Baltimore.** No faces, uniforms, vehicles, or city identifiers. The cue
  exists to answer an objection about usefulness, and any documentary footage would
  turn it into something else.
- **G-13, the redlining map.** Generic depiction only. Do not reproduce a real HOLC
  sheet for an identifiable neighborhood.
- **G-15, the mind virus.** The install point is the Buffer Class. A viewer watching
  with sound off must not be able to read this card as pointing at the Out-group.
- **G-19, Appalachia.** Spoken as a structural, directional claim. No figures on screen.
- **G-21, John Punch.** Court record only. Do not illustrate the three men.
- **G-29, expansion.** Directional only. No percentages or population counts.

## Open items

None. Both items logged on the first draft are resolved: the Preface's Part I range now
reads 1440s–1915 to match the part declaration, and Episode 1 now says Chapter Three.
