# ATO Episode 1 — Video Shot List

Companion to `../podcasts/ATO_EP01_authors_preface.md`.

Graphics live here, never inside the script. The voice pipeline's markup tokenizer
(`voice_pipeline/markup.py`) only recognizes `[pause:NNNms]`, `[beat]`, `[emphasis]`
and `[tone]`. Any other bracketed tag falls through and gets spoken aloud by the TTS
engine, and any non-tag line inside a speaker turn is spoken too. So the script stays
pure speech and the video cues stay in this file.

## Alignment procedure

Cue times below are the script's source timestamps. They are approximate. After the
audio renders, take the real times from the manifest:

```bash
python -m voice_pipeline --transcript Architecting_the_operation/podcasts/ATO_EP01_authors_preface.md --episode-id ATO_EP01 --out-dir ./outputs
```

The manifest carries `turn_index`, `speaker_id`, `source_timestamp`, `start_ms`, and
`end_ms` per turn. Match `source_timestamp` to the cue's "Anchor" field and read the
real `start_ms`. The FCPXML export drops the audio onto a Final Cut timeline in the
same order, so graphics drop onto the video track above it at those offsets.

## Provenance key

- `[book]` — stated in `Paper/The_Original_Power.tex`, cited by line.
- `[data]` — computed from a CSV in `Paper/data/`.
- `[design]` — illustrative, no data claim. Must not carry axis numbers.

---

## G-01 — Title card

- **Anchor:** `Emmanuel Theodore (00:00)`
- **Hold:** through 00:14
- **Type:** static
- **Content:** *Architecting the Operation* / Episode 1 / "The Author's Preface" /
  subtitle: How a history essay became an equation.

## G-02 — The electron question

- **Anchor:** `Emmanuel Theodore (00:24)`
- **Hold:** through 01:07
- **Type:** the episode's cold open. Three beats, and this is the most important
  graphic in the cut.
- **Beat 1:** a video call. Two faces, two continents, a line between them.
- **Beat 2:** zoom through the phone to silicon. Charge moving through gates in exact
  patterns. Counter running into the billions per second.
- **Beat 3:** hold on the precision, then cut hard to black and the question in text:
  *So why can we not do this with systemic oppression?*
- **Note:** Emmanuel's own founding question, told on-mic for the first time. Pays off
  at G-33a. Build the two graphics as a matched pair.

## G-02b — Meet the voices

- **Anchor:** `Toussaint (02:26)`
- **Hold:** through 03:50
- **Type:** name cards, one per speaker, held while each one speaks
- **Toussaint:** the historical and structural throughline. Where a structure came
  from, who built it, what it did on a given date.
- **Aisha:** the mathematics and the evidence. Sets, equations, datasets, and what
  would have to be true for a claim to be wrong.
- **Emmanuel Theodore:** author. Writes it, and steps in when the sentence is his.
- **Note:** first episode only. Later episodes reuse a compressed two-second version
  or drop it entirely. Give each card the speaker's own accent color and reuse those
  colors wherever a speaker is identified for the rest of the season.

## G-03 — The loop we are stuck in

- **Anchor:** `Emmanuel Theodore (01:07)`
- **Hold:** through 01:49
- **Type:** closed cycle, then a comparison
- **Cycle:** the system is broken → reform it → the system is broken → reform it.
  A second arrow labeled "human nature, therefore inevitable" exits to "change hearts
  and minds, one person at a time, forever."
- **Cut to:** a processor die shot. Caption: tens of billions of transistors. Specified,
  simulated, fabricated, tested.
- **Note:** `[design]`. Do not put a transistor count on screen unless it names a real
  part. The narration says "tens of billions," which is safe as stated.

## G-04 — Sociopolitical engineering

- **Anchor:** `Emmanuel Theodore (05:33)`
- **Type:** three-row build, one row per line of narration
- **Rows:** Social science → observes the trend. Political science → argues the cause.
  Sociopolitical engineering → derives the mechanism, predicts the next state.
- **Note:** the term is Emmanuel's, used on-mic. Set the third row in the series accent
  color; it is the thesis of the whole show.

## G-04b — Two front pieces

- **Anchor:** `Toussaint (06:04)`
- **Hold:** through 06:27
- **Type:** book-spread diagram, two facing pages
- **Left page:** AUTHOR'S PREFACE → the build log. Four documents, five years. Marked
  THIS EPISODE.
- **Right page:** PREFACE → the framework. Software, wetware, five tiers. Marked
  EPISODE 2.
- **Note:** `[book]` `Paper/The_Original_Power.tex:141` and `:164`.

## G-04c — New tool, same target

- **Anchor:** `Emmanuel Theodore (07:07)`
- **Hold:** through 07:48
- **Type:** repeating pattern
- **Content:** a row of course-assignment cards, each labeled with a different method,
  every one of them with an arrow pointing at the same target: systemic oppression.
  Caption: no plan, a standing habit.
- **Note:** Emmanuel's on-mic account. This card exists to puncture the tidiness of the
  published preface, so keep it plain and a little scrappy.

## G-04d — The domain break

- **Anchor:** `Emmanuel Theodore (08:14)`
- **Hold:** through 09:25
- **Type:** two-axis diagram, abstract, no people depicted
- **Content:** RACIAL AXIS, two figures, shared vocabulary, communication succeeds.
  GENDERED AXIS, the same two figures, the same structure present, communication fails.
- **Note:** Emmanuel's account of a private relationship. Keep this card fully abstract.
  No names, no photographs, no relationship imagery. The card carries the structural
  failure and nothing else. See the sensitivity note at the foot of this file.

## G-04e — The Theodore Transform

- **Anchor:** `Emmanuel Theodore (09:48)`
- **Hold:** through 10:10
- **Type:** transform diagram, matching the Laplace framing in the narration
- **Content:** a structure established on the racial axis, an operator box labeled with
  the transform, the same structure re-expressed on the gendered axis. Caption: the
  representation changes, the structure it carries stays fixed.
- **Note:** `[book]` `Paper/apx_theodore_transform.tex`. Tier 3, structural. The
  appendix's own analogy is the Laplace transform from time domain to frequency domain,
  so the narration and the source agree.

## G-04f — Title lineage

- **Anchor:** `Emmanuel Theodore (11:29)`
- **Hold:** through 11:55
- **Type:** left-to-right progression with one branch
- **Content:** an unpublished manuscript on the gendered axis, shelved, drawn greyed and
  set aside. Arrow via the transform to REDEFINING RACISM → THE MATHEMATICS OF
  OPPRESSION → THE ORIGINAL POWER, with "electrodynamic formalism" annotating the last
  step. A dotted forward arrow to THE GENDER WARS, marked in progress.
- **Content, second row:** Redefining Racism shown collapsing into Chapter 1 of the
  finished book, with the other chapters growing out from it.
- **Note:** `[book]` for the chapter (`Paper/The_Original_Power.tex:1350`). The two
  earlier titles appear nowhere in the manuscript today. See the open manuscript item in
  `../notes/` before treating this card as sourced from the book.

## G-04g — The bad year

- **Anchor:** `Emmanuel Theodore (12:18)`
- **Hold:** through 12:59
- **Type:** three losses on a short timeline, stated plainly
- **Content:** a compressed calendar. Relationship ends. Tariffs land on electronics,
  the industry contracts, the job goes. The car is wrecked. Then a flat bar running
  more than a year, labeled: no work, severance exhausted.
- **Note:** Emmanuel's own account. Keep the typography plain and resist any visual
  drama. The narration is already unadorned and the card should match it.

## G-04h — The floor

- **Anchor:** `Emmanuel Theodore (13:05)`
- **Hold:** through 14:22
- **Type:** the hardest card in the episode to get right
- **Content:** a warehouse aisle at night, abstract or silhouetted. Overlay a single
  line: master's degree in engineering, overnight shift, 3 a.m.
- **Then:** headphones appear, and go unused. Caption: he spent the shifts inside the
  framework.
- **Do not:** show recognizable faces, coworkers, teenagers, or Amazon branding. The
  narration explicitly refuses to make the people on that floor the point, and the
  visual must refuse it too. A card that reads as "look how far he fell" contradicts
  the line he actually says.
- **Note:** `[design]`. Nothing on this card is a claim about a named company.

## G-04i — I see you

- **Anchor:** `Emmanuel Theodore (14:31)`
- **Hold:** through 15:18
- **Type:** the turn from subject to author
- **Content:** the extraction diagram from G-10 fades up, and a single marker lands on
  the buffer band, labeled "reclassified." Then the whole diagram redraws itself as a
  schematic under a drafting hand.
- **Caption:** the mechanism ran on him, and he drew it.
- **Note:** Emmanuel's framing on-mic. The manuscript does predict expansion of the
  extracted set beyond its initial boundary (`Paper/The_Original_Power.tex:9735`), so
  the structural echo is real. Present it as his reading of his own experience rather
  than as a calibrated result.

## G-04j — The constraint

- **Anchor:** `Emmanuel Theodore (15:18)`
- **Hold:** through 15:51
- **Type:** two-panel, and it is the episode's ethical hinge
- **Left:** MOTIVE. I want this to be true.
- **Right:** CONSTRAINT. Every claim carries a confidence tier and a falsification
  criterion.
- **Caption:** built so the motive cannot decide the result.
- **Note:** this card sets up G-29 and the lost test at G-28. Use the same visual
  language in all three so the callback is unmistakable.

## G-04k — The rooms

- **Anchor:** `Emmanuel Theodore (16:21)`
- **Hold:** through 17:59
- **Type:** stylized live-audio room, abstract
- **Content:** a circle of anonymous speaker bubbles, one of them his. Then a counter
  of rooms entered, climbing. Then a running list captioned "defect reports," each
  entry a gap an opponent found in a standard argument.
- **Do not:** name, depict, or identify any opponent. See the editorial note below on
  the Arbery reference.
- **Note:** Emmanuel's account. The card's job is that the framework was hardened
  adversarially, in public, against hostile audiences, before it was written down.

## G-04l — Removal from the moral community

- **Anchor:** `Emmanuel Theodore (18:44)`
- **Hold:** through 19:45
- **Type:** boundary diagram, three beats. This is the conceptual core of the segment.
- **Beat 1:** a closed boundary labeled THE MORAL COMMUNITY, with figures inside it and
  a caption: inside this line a person registers as fully human and receives the
  protections that follow.
- **Beat 2:** the boundary redraws, and a group is now outside it. Nothing about the
  figures changed. The line moved.
- **Beat 3:** an arrow labeled "your morality" bounces off the boundary and fails to
  reach the excluded group. Caption: the morality still functions and stops applying.
- **Note:** `[book]`. "Moral community" is the manuscript's own term, used throughout
  (`Paper/The_Original_Power.tex:2474`, `:2481`, `:2496`, `:2646`, `:9378`), and
  section `:2497` is titled "The Invention of Race as Moral Exclusion." Use the book's
  wording on the card.

## G-04m — The Veil of Ignorance

- **Anchor:** `Emmanuel Theodore (19:45)`
- **Hold:** through 20:33
- **Type:** five-position rotation
- **Content:** the five tiers arranged around a ring, Elite, Puppet Class, Enforcement
  Class, Buffer Class, Out-group. A viewpoint marker moves into each in turn. Then the
  labels black out and the marker's position becomes unknown.
- **Caption:** if you did not know which tier you would wake up in, would you co-sign
  this architecture.
- **Note:** `[book]` `Paper/The_Original_Power.tex:205`. The manuscript is explicit
  that this is diagnostic with no prescriptive aim, and that radical empathy is the
  activation step while the Veil is the computation step. Keep both halves.

## G-04n — Derive it from economics alone

- **Anchor:** `Emmanuel Theodore (20:45)`
- **Hold:** through 22:11
- **Type:** the strongest analytical card in the episode
- **Beat 1:** the objection, in quotation marks: "This is not racism, this is
  economics."
- **Beat 2:** a model diagram with a component labeled RACIAL ANIMUS visibly removed
  from it, leaving only capital, agenda control, the boundary-defense payment, and the
  cost of coordination.
- **Beat 3:** run the model. The full tier architecture reassembles anyway.
- **Caption:** the machine requires nobody to hate anyone.
- **Note:** this is the argument that answers the most common public objection to
  structural analysis, and the episode should give it the most screen time of any
  single card in the origin segment.

## G-05 — The four-step method (master graphic)

- **Anchor:** `Aisha (22:28)`
- **Type:** horizontal four-stage pipeline, builds one stage at a time
- **Stages:** 1 Identify a structure · 2 Detect its empirical shadow · 3 Build the
  instrument that measures it · 4 Derive the mechanism that produces all three
- **Note:** `[book]` `Paper/The_Original_Power.tex:157`. This is the spine of the
  episode. Build it once here, then recall it as a small persistent corner marker at
  04:18, 16:15, 20:03 and 25:36 with the active stage lit. Reprise it full-screen at
  31:39.

## G-06 — The astronomy analogy

- **Anchor:** `Toussaint (22:37)`
- **Type:** four small illustrations in a row, matching G-05's four stages
- **Content:** look at the stars → build the telescope → catch the blurry shadow →
  write the law of gravitation.
- **Note:** `[design]`. Keep the same four column positions as G-05 so the mapping
  reads without a caption.

## G-07 — Douglass and Môle-Saint-Nicolas

- **Anchor:** `Toussaint (23:37)`
- **Hold:** through 24:20
- **Type:** map, animated in three beats
- **Content:** Caribbean map. Pin Môle-Saint-Nicolas on Haiti's northwest peninsula.
  Arrow from Washington to the pin labeled "diplomatic pressure, naval force behind
  it." Then a struck-through arrow with the date, July 1891, resignation.
- **Caption strip:** Frederick Douglass, U.S. Minister to Haiti, 1889–1891.
- **Note:** `[book]` `Paper/The_Original_Power.tex:145`.

## G-08 — Extraction, isolated

- **Anchor:** `Aisha (24:20)`
- **Type:** reduction animation. The map from G-07 dissolves into three labeled boxes.
- **Content:** RESOURCE: the port. INSTRUMENT: racial hierarchy, national origin.
  GOAL: geopolitical extraction.
- **Note:** `[book]`. This is the episode's first demonstration of stripping narrative
  to mechanism. The dissolve is the argument, so let it play.

## G-09 — The justification layer

- **Anchor:** `Toussaint (24:42)`
- **Hold:** through 25:26
- **Type:** two-layer stack diagram
- **Content:** Lower layer, HARDWARE: extraction. Upper layer, SOFTWARE: ideological
  justification, with Social Darwinism named inside it.
- **Note:** `[book]`. Reuse this stack shape in Episode 2 for the software/wetware
  distinction. It should read as the same visual family.

## G-10 — The Du Bois triangle

- **Anchor:** `Aisha (25:59)`
- **Hold:** through 26:46
- **Type:** animated triangle, three beats
- **Beat 1:** Elite at apex. Colonial subjects at base. A thick arrow of extracted
  wealth running base to apex.
- **Beat 2:** Domestic workers appear as a band across the middle.
- **Beat 3:** A thin branch splits off the main arrow and terminates in the middle
  band. Label it "the dividend."
- **Caption strip:** W. E. B. Du Bois, "The African Roots of War," 1915.
- **Note:** `[book]` `Paper/The_Original_Power.tex:145`. This graphic is the visual
  ancestor of the psychological wage in G-19. Keep the geometry identical so the
  callback lands.

## G-11 — Variance and invariant

- **Anchor:** `Toussaint (27:25)`
- **Type:** side-by-side
- **Left:** 1891 Haiti and 1915 colonial Africa as two dissimilar scenes, tagged
  "the historian studies this: the variance."
- **Right:** both scenes collapsed to the identical G-10 triangle, tagged "the
  engineer studies this: the invariant."

## G-12 — One algorithm, three dialects

- **Anchor:** `Aisha (27:43)`
- **Type:** three inputs, one output
- **Content:** Theology / Pseudoscience / Bureaucratic statute all feed one box, and
  one arrow leaves it: systematic transfer of wealth and power upward.
- **Note:** `[book]`.

## G-13 — Power obfuscation

- **Anchor:** `Emmanuel Theodore (28:29)`
- **Hold:** through 22:31
- **Type:** before/after, animated
- **Before:** apex extracts directly from base. Pressure arrows from the base point
  straight up at a clearly visible apex.
- **After:** an intermediary band is inserted and paid a share. Base pressure arrows
  bend sideways into that band. The apex fades toward invisibility.
- **Note:** `[book]` for the structure, Emmanuel's on-mic framing for the name. This
  is the episode's single most important idea and it earns the most motion.

## G-14 — The proposal, two titles

- **Anchor:** `Toussaint (29:31)`
- **Type:** document card
- **Content:** the two draft titles, verbatim:
  *From Bias to Bytes: A Machine Learning-Driven Analysis of Systemic Racism and Social
  Inequalities* and *The Calculus of Discrimination: A Mathematical Model for Analyzing
  Systemic Racism and Social Policies*.
- **Note:** `[book]` `Paper/The_Original_Power.tex:149`. Spell "Bytes" correctly. Every
  AI transcript of this project has mangled it.

## G-15 — Four ingredients

- **Anchor:** `Toussaint (30:14)`
- **Type:** 2×2 grid
- **Content:** Critical Race Theory · Cognitive bias research · McKelvey–Schofield
  Chaos Theorem · Set-theoretic mathematics.
- **Note:** `[book]` `:149`. Dim the two on the left at 12:01 when narration moves to
  the two that get unpacked.

## G-16 — Why multidimensional voting has no center

- **Anchor:** `Aisha (30:56)`
- **Hold:** through 25:24
- **Type:** the episode's most demanding build. Three beats.
- **Beat 1:** a single axis, budget from $10M to $1B, with a median voter marked and a
  stable outcome at the center.
- **Beat 2:** a second and third axis appear (timeline, geographic allocation). The
  median point visibly fails to exist.
- **Beat 3:** three options A, B, C in a cycle, arrows A→B→C→A, captioned "rock, paper,
  scissors, inside a legislature."
- **Note:** `[book]` `:149`, `:155`. Beat 2 is the load-bearing one. If a viewer only
  understands that adding dimensions destroys the median, the segment worked.

## G-17 — The agenda setter

- **Anchor:** `Aisha (32:04)`
- **Hold:** through 26:09
- **Type:** path animation over the G-16 beat 3 cycle
- **Content:** a start node and a target node. Animate a legal sequence of pairwise
  majority votes that walks from start to target. Tick each step "majority rule ✓".
  End card: every step legitimate, destination chosen in advance.
- **Note:** `[book]`. This is the mechanism the book later formalizes as the
  Agenda-Setter Trap, so hold the visual vocabulary for G-19.

## G-18 — The admission

- **Anchor:** `Aisha (33:44)`
- **Type:** full-screen pull quote
- **Content:** "The mathematics it promised was absent from its pages."
- **Note:** `[book]` `Paper/The_Original_Power.tex:149`, verbatim. Let it sit in
  silence against the `[beat]` in the script.

## G-19 — Lost document

- **Anchor:** `Emmanuel Theodore (34:23)`
- **Type:** archive inventory list
- **Content:** rows with check marks — The Calculus of Injustice (v1 2023, v2 2026) ·
  Exploring Bias and Fairness in Language Models Applied to Hiring (2024) · datasets,
  notebooks, slides, recording. Final row, greyed with a missing-file mark: From Bias
  to Bytes — no surviving source.
- **Note:** `[book]` for the citation lineage; the missing-source fact is Emmanuel's
  own archive state. Do not imply it was destroyed. It is unrecovered.

## G-20 — The empirical shadow

- **Anchor:** `Toussaint (35:37)`
- **Hold:** through 29:19
- **Type:** bar chart, per-capita fatal police shootings
- **Data:** `Paper/data/eq27_police_killings.csv`, 2013–2024 means, deaths per million:
  Black 7.00 · Native American 6.55 · Hispanic 2.89 · White 2.32 · Asian 0.91.
  Black-to-White ratio of means, 3.01.
- **Caption the Preface claim exactly:** "more than twice the White per-capita rate."
  The 3.01 figure is the book's own 2013–2024 chapter series and is a wider window than
  the Preface sentence describes, so label the chart with its years and source.
- **Note:** `[data]` + `[book]` `Paper/The_Original_Power.tex:151` and `:4631`. Cite the
  Mapping Police Violence dataset and ACS denominators from the CSV header comments.

## G-21 — The null result

- **Anchor:** `Aisha (36:10)`
- **Type:** contrast card, deliberately anticlimactic
- **Content:** left, the G-20 bars, labeled "macro: large, stable disparity." Right, a
  classifier-performance panel at chance, labeled "incident features: little
  group-identifying signal, cross-validated."
- **Note:** `[book]` `:151`. Do not dramatize the right panel. The honesty is the point.

## G-22 — The casino

- **Anchor:** `Toussaint (37:05)`
- **Hold:** through 31:25
- **Type:** two-scale animation
- **Scale 1:** a high-speed camera over one craps table. Physics readouts all normal.
  Verdict stamp: THE ROLL IS FAIR.
- **Scale 2:** pull back to the whole floor and a year of payouts. Verdict stamp: THE
  HOUSE WINS.
- **Closing frame:** the advantage sits in the rules, the odds, and who is at the
  table.
- **Note:** `[design]`. The analogy is the transcript's and it is the best explanatory
  device in the episode. Use invented chips and payouts only, never real statistics.

## G-23 — Upstream of the encounter

- **Anchor:** `Toussaint (38:05)`
- **Type:** left-to-right funnel
- **Content:** housing policy → patrol allocation → neighborhood saturation →
  enforcement selection → THE ENCOUNTER. A dashed box around the final stage labeled
  "the only stage incident-only data can see."
- **Note:** `[book]` `:151`.

## G-24 — The mirror

- **Anchor:** `Toussaint (39:16)`
- **Type:** simple flow
- **Content:** human archive (internet text, corporate documents, historical records)
  → training → model → measured behavior. Caption: the model is a mirror held to the
  archive, not a witness with an opinion.

## G-25 — Career-level results

- **Anchor:** `Aisha (40:07)`
- **Hold:** through 33:52
- **Type:** three-bar chart, White-marked share of selections by career stage
- **Data:** Entry 53.33% · Mid 68.33% · Executive 53.33%. GPT-4o, synthetic résumés,
  explicit and inferred racial markers, no racial instruction in the prompt.
- **Note:** `[book]` `Paper/The_Original_Power.tex:13083`. Draw a 50% parity reference
  line. Career-level percentages are GPT-4o only; the paper's four-model framing covers
  the wider study, so do not attribute these three numbers to four models.

## G-26 — Where advancement compounds

- **Anchor:** `Aisha (40:32)`
- **Type:** career ladder, three rungs annotated
- **Content:** Entry — the system takes in labor. Mid — equity, network access,
  authority over others' work, advantage compounds. Executive — small, already
  filtered. Highlight the middle rung.
- **Note:** `[book]` `:153`.

## G-27 — The aggregate test passes

- **Anchor:** `Toussaint (41:13)`
- **Type:** two-state card
- **State 1:** AGGREGATE AUDIT. χ² = 2.547, p = 0.980. Stamp: NOT SIGNIFICANT.
- **State 2:** the same data split by career level, revealing the G-25 bars.
  Caption: Simpson's paradox.
- **Note:** `[book]` `:13083`, `:153`.

## G-28 — What the replication found

- **Anchor:** `Toussaint (42:25)`
- **Hold:** through 36:19
- **Type:** before/after comparison, and this card must be as prominent as G-25
- **2024 study:** career-level skew present. Confound: résumé qualifications differed
  across racial conditions. Confidence: Tier 3.
- **2026 replication:** matched pairs, qualifications held constant, only name and one
  affiliation varied. Claude, Gemini, Kimi. Pooled Black share of advanced candidates
  50–51% at every career level. Career-level effect did not recur.
- **Note:** `[book]` `Paper/The_Original_Power.tex:13083`. The Kimi sweep ended before
  the executive level; say so in small type if the card has room. Never show G-25
  without G-28 available in the same cut.

## G-29 — Falsifiability

- **Anchor:** `Emmanuel Theodore (43:34)`
- **Type:** index-row mock, three sample rows
- **Content:** columns for Equation · Confidence tier · Primary data source ·
  Falsification criterion. Populate from the Empirical Validation Index.
- **Note:** `[book]` `Paper/The_Original_Power.tex:245`. Pairs with G-04j; use the same
  two-panel language so the constraint set up at 13:33 visibly closes here. Tier 1,
  directly reported or
  transparently derivable from a peer-reviewed source or public dataset. Tier 2, public
  dataset with disclosed operationalisation. Tier 3, ordinal or structural, no
  quantitative calibration attempted.

## G-30 — The three sets

- **Anchor:** `Aisha (44:41)`
- **Hold:** through 38:24
- **Type:** set diagram with notation
- **Content:** E, the Elite. O_racialized, the Out-group. I_buffer, the Buffer Class.
- **Note:** `[book]` `:155`. Use the manuscript's exact subscripts. Episode 2 expands
  these into the five-tier hierarchy, so build this diagram to be extended rather than
  replaced.

## G-31 — The Agenda-Setter Trap

- **Anchor:** `Toussaint (45:37)`
- **Hold:** through 39:44
- **Type:** three beats over the G-30 diagram
- **Beat 1:** the agenda setter from G-17 reappears at E.
- **Beat 2:** I_buffer and O_racialized are outlined together, labeled "numerical
  majority. Coordination is the optimal strategy."
- **Beat 3:** a question mark over the coordination link. Caption: so why is it rare.
- **Note:** `[book]` `:155`, Tweedism chapter.

## G-32 — Psi, the psychological wage

- **Anchor:** `Aisha (46:24)`
- **Hold:** through 40:31
- **Type:** the payoff of the whole episode. Recall G-10 exactly, then formalize it.
- **Content:** the Du Bois triangle fades in. The "dividend" branch relabels to ψ. Then
  the coordination link between I_buffer and O_racialized breaks. Caption: ψ forecloses
  the one defense the chaos theorem identifies.
- **Note:** `[book]` `:155`. The geometry must match G-10 frame for frame. That match is
  the argument that Du Bois described this in 1915.

## G-33 — Geometry of extraction

- **Anchor:** `Toussaint (47:44)`
- **Type:** directed graph
- **Content:** nodes across society, directed edges, no closed loops, all paths
  terminating at a root node. Animate flow from the margins upward.
- **Note:** `[book]` `:155`. Directed spanning-tree proofs and partition theorems.

## G-34 — The circuit

- **Anchor:** `Aisha (48:11)`
- **Hold:** through 42:08
- **Type:** circuit schematic mapped onto the G-33 graph
- **Content:** Voltage, the systemic pressure driving extraction. Current, the flow of
  extracted labor and capital. Resistance, the mechanisms that route the flow and stop
  it returning downward.
- **Note:** `[book]` `Paper/The_Original_Power.tex:384` and the substrate-independence
  note. Caption it as a dynamical homology, equivalent governing equations, and keep
  the word "metaphor" off this card entirely. The book's claim is stronger than that
  and the narration says so.

## G-33a — The analogy was never an analogy

- **Anchor:** `Emmanuel Theodore (48:56)`
- **Hold:** through 50:41
- **Type:** direct callback to G-02, and the emotional peak of the episode
- **Beat 1:** replay the closing frame of G-02, the question on black.
- **Beat 2:** the circuit schematic from G-34 fades up behind the question and the two
  register as the same diagram.
- **Beat 3:** a word list, each term shown moving from the social column to the physics
  column: current, resistance, potential, field, force, power, conductor, ground,
  charge. Caption: physics borrowed these from social power, and not the other way
  round.
- **Note:** `[book]` `Paper/The_Original_Power.tex:384`, the historical-inversion
  argument and the substrate-independence note. This is the single strongest moment in
  the episode. Cut G-02 and G-33a together and treat them as one asset.

## G-35 — The linchpin

- **Anchor:** `Emmanuel Theodore (49:20)`
- **Type:** timeline with a single connecting arc
- **Content:** 1915, Du Bois, the dividend. → 2020, the observation layer. → the ψ term.
  → the electrodynamic formalism. One arc from the first point to the last.
- **Note:** Emmanuel's on-mic account of his own path. Label it as such.

## G-36 — 146 anchor cases

- **Anchor:** `Aisha (51:45)`
- **Hold:** through 52:17
- **Type:** dense grid, 146 cells across a five-century timeline
- **Content:** highlight the fatal-shooting case as one cell. Each cell carries a
  confidence tier, a data source, and a falsification criterion.
- **Note:** `[book]` `:155`, `:245`, `:1365`. If cell-level detail is available from the
  Empirical Validation Index, color the grid by tier.

## G-37 — Method reprise

- **Anchor:** `Aisha (52:17)`
- **Hold:** through 52:52
- **Type:** G-05 full-screen, now with each stage labeled by its document
- **Content:** Identify → the Spanish-American War essay. Detect → The Calculus of
  Injustice. Build the instrument → the hiring paper. Derive → *The Original Power*.
- **Note:** `[book]` `:157`.

## G-38 — Next episode

- **Anchor:** `Emmanuel Theodore (54:43)`
- **Type:** end card
- **Content:** Episode 2, the Preface. Psycho-legal social software. Wetware. The
  fractal mind virus. The five-tier hierarchy. Second card: The Gender Wars, in
  progress, the transform running in the other direction.
- **Note:** `[book]` `Paper/The_Original_Power.tex:166` onward.

---

## Drafting the graphics with NotebookLM

Each entry above is written to be pasted as a brief. A workable loop:

1. Give the notebook the Author's Preface text plus the specific `[book]` lines cited
   in the cue, and nothing else. Narrow sources produce fewer invented details.
2. Ask for the graphic's content as structured text — labels, rows, axis values, the
   order of build beats. Ask for text, not an image.
3. Check every number against the `[data]` and `[book]` fields here. The AI transcripts
   of this project have consistently corrupted the names: "From Bias to Bytes" became
   "bites" and "bikes", Du Bois became "du guac", McKelvey–Schofield became "mchelvy
   showfield", and Emmanuel Theodore became "Fyodor". Assume name-level corruption in
   any generated draft.
4. Build the final asset from the checked text.

`Paper/data/*.csv` is the source of truth for anything with an axis. Charts drawn from
a chat response rather than the CSV do not go in the episode.

---

## Editorial note on the synthetic-voice disclosure

At 03:29 Aisha states on-mic that she and Toussaint are synthetic voices reading
Emmanuel's words. It sits in the introductions because the episode makes a virtue of
publishing what it would be easier to omit, including a test Emmanuel ran and lost, and
a listener works it out eventually anyway.

It is one turn and it lifts cleanly if the show would rather not foreground it. Cutting
it changes the framing of the whole series, so it is Emmanuel's call rather than a
production detail.

---

## Sensitivity note, G-04d and the origin segment

The origin segment (05:22 to 10:10 in the script) draws on a private relationship
involving a real person who is not part of this project and cannot respond to it.

The script as written carries the **mechanism** and omits the identifying and intimate
detail. No name, no sexual specifics, and an explicit on-mic line stating that the
segment describes a communication failure rather than delivering a verdict on another
person. G-04d is abstract for the same reason: two unlabeled figures and two axes.

That is a floor, not a ceiling. Raising the level of personal detail is Emmanuel's call
alone. Lowering it further is always available and costs the episode nothing structural,
because the load-bearing claim is that a framework which communicated on one axis failed
on another, and that failure created the requirement for the transform. That claim
survives at any level of personal detail, including none.

## Editorial notes on the bad-year segment, G-04g to G-04j

Three deliberate choices, each reversible on request.

**The tariffs are unnamed.** The script says tariffs landed on electronics and the
industry contracted. No administration is named. The episode argues that the mechanism
is impersonal and adapts to whoever holds power, so attaching the layoff to one
president slightly undercuts the thesis in the same breath that it lands the story.
Naming it is available and it is a factual matter of public record.

**Amazon is named once, as an employer, and never characterized.** The narration says
the work is physically hard, the hours run against the body, and the conditions are what
they are. It makes no claim about labor practices at a named company, which keeps a
defamation-shaped risk out of a published episode without softening anything Emmanuel
actually experienced.

**The Arbery reference is unnamed.** The script says Emmanuel debated an immediate
family member of one of the men convicted of murdering Ahmaud Arbery. It does not give
her name, and G-04k depicts no opponent. She is a private individual who is not part of
this project, the detail carries its full weight without identification, and naming her
alongside a claim about who won a debate invites a dispute that has nothing to do with
the framework. Naming is available on request.

**The condescension guard is explicit and on-mic.** Emmanuel flagged the concern
himself. The script carries a sentence stating that the observation is about conditions
and not about the people on that floor, and that they were doing exactly what he was
doing. Removing that sentence changes what the segment means, so it should stay unless
he replaces it with something that does the same work.
