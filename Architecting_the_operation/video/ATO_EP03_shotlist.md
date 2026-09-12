# ATO Episode 3 — Video Shot List

Companion to `../podcasts/ATO_EP03_redefining_racism.md`.

Graphics live here, never inside the script. The voice pipeline's markup tokenizer
(`voice_pipeline/markup.py`) only recognizes `[pause:NNNms]`, `[beat]`, `[emphasis]`
and `[tone]`. Any other bracketed tag falls through and gets spoken aloud by the TTS
engine, and any non-tag line inside a speaker turn is spoken too. So the script stays
pure speech and the video cues stay in this file.

## Re-architecture note (this revision)

This episode was rebuilt around a four-level explanatory device — five-year-old,
high schooler, college, PhD — applied to every named mechanism in Chapter 2, on the
premise that this is likely the first episode most new listeners encounter (the
Preface and Chapter 1 run heavier on notation and reward readers already sold on the
math). The script is self-contained: it assumes no prior episode has been heard, and
contains no "last time" or episode-order reference. This shot list replaces the prior
revision in full; anchors and cue content below do not correspond to the earlier draft.

## Alignment procedure

Cue anchors are the script's own header timestamps, and those are derived from measured
audio by `tools/retime_script.py`. Episode 3 has not been rendered yet, so its
timestamps in the script are computed from word count at a fixed words-per-second rate,
not measured. After the render, re-run:

```bash
python3 tools/retime_script.py Architecting_the_operation/podcasts/ATO_EP03_redefining_racism.md \
    --manifest outputs/ATO_EP03_local/episode_manifest.json \
    --shotlist Architecting_the_operation/video/ATO_EP03_shotlist.md --apply
```

That rewrites the script headers to the real offsets and moves every anchor and hold
below with them. An anchor that stops resolving to a real turn is reported as
UNRESOLVED rather than snapped to the nearest one; fix those by hand against the cue's
content.

## Provenance key

- `[book]` — stated in `Paper/The_Original_Power.tex`, cited by line. Line numbers
  below are current as of the Chapter 2 factual brief (`notes/CH2_findings.md`,
  audited against lines 1567–2681) and will drift with any upstream manuscript edit.
- `[data]` — computed from a CSV in `Paper/data/`, or a number stated in-text and
  sourced to a named dataset (Census, BLS, BJS, Piketty-Saez-Zucman/WID, ANES).
- `[design]` — illustrative, no data claim. Must not carry axis numbers.

## Continuity with Episodes 1–2

Reuse, do not redesign: the five-tier pyramid stack, the ψ phasor, the circuit
vocabulary plate, and the lower-third name cards.

## New visual family: the Level Card

The episode's signature device. A compact badge, bottom-third, that flips through
four states every time the hosts run a concept through the four-level pass:

`AGE 5` → `HIGH SCHOOL` → `COLLEGE` → `PhD`

- **Type:** persistent badge, one of four states active at a time, color-shifts
  cooler as it climbs (warm amber at Age 5, through to cool blue-white at PhD).
- **Trigger:** flips the instant Toussaint says the level name ("Five year old,"
  "High schooler," "College," "PhD"). No separate cue entry is written per flip
  below — assume the Level Card is live and flipping through every "Concept" and
  "Module" block in the episode unless a cue below explicitly overrides or pauses it
  for a full-frame graphic.
- **Note:** `[design]`. This replaces the prior revision's "SYSTEM SCAN" HUD frame
  for the four-level segments; the HUD frame returns, scoped more narrowly, as the
  wrapper for the diagnostic-model section only (see G-19).

**Content-note handling.** One passage (G-24, the Thistlewood/Abba material) carries
graphic historical content that the audio track itself flags verbally (Toussaint's
spoken content note). The video should not add a second, redundant on-screen warning
card — hold on a plain, dark title-only frame (no imagery) for that turn instead of an
illustrative graphic. Do not render the acts described. The 1662 Virginia subroutine
beat (G-46) gets the same restrained treatment.

---

## G-01 — Title card

- **Anchor:** `Toussaint (00:00)`
- **Hold:** through 00:04
- **Type:** static
- **Content:** *Architecting the Operation* / Episode 3 / "Redefining Racism" /
  subtitle: Four ways to understand the machine.

## G-02 — Cold-open framing: three registers

- **Anchor:** `Emmanuel Theodore (00:39)`
- **Hold:** through 00:58
- **Type:** three-word stack, revealing one at a time
- **Content:** The claim. / The mechanism. / The proof.
- **Note:** `[design]`.

## G-03 — Level Card, first appearance (explainer beat)

- **Anchor:** `Aisha (01:02)`
- **Hold:** through 01:38
- **Type:** the Level Card animates through all four states once, slowly, as Toussaint
  names them, before it starts flipping fast for the rest of the episode
- **Content:** AGE 5 → HIGH SCHOOL → COLLEGE → PhD, each with a one-line gloss
  ("truth minus prerequisites" / "the everyday version" / "the structural claim" /
  "the citations and the falsification condition").
- **Note:** `[design]`. This is the only slow, explained pass; every later flip is
  fast and wordless.

## G-04 — Three-part episode map

- **Anchor:** `Aisha (01:42)`
- **Hold:** through 02:09
- **Type:** three-panel roadmap
- **Content:** 1. Binary → five-tier refinement · 2. The word rebuilt · 3. The
  diagnostic model (fractal computer virus).
- **Note:** `[design]`.

## G-05 — Coarse binary → five-tier refinement

- **Anchor:** `Emmanuel Theodore (03:33)`
- **Hold:** through 05:08
- **Type:** the five-tier pyramid stack, Episode 1's continuity asset, triggered here
  for the first time this episode
- **Content:** two-box coarse partition (in-group/out-group) resolving into Elite /
  Puppet / Enforcement / Buffer inside the in-group box, and a fan of adjacent
  out-group subgroups on the other side.
- **Note:** `[book]` continuity asset from Episode 1; `Paper/The_Original_Power.tex:1596,
  1633, 1656`.

## G-06 — Recursive local partition

- **Anchor:** `Emmanuel Theodore (05:48)`
- **Hold:** through 06:35
- **Type:** single figure, one silhouette, split by two overlapping colored fields
- **Content:** a blue field labeled "race axis: in-group" and a red field labeled
  "class axis: out-group" overlap on the same figure.
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:1673`.

## G-07 — Set-Resolution Ladder

- **Anchor:** `Emmanuel Theodore (06:36)`
- **Hold:** through 07:50
- **Type:** four-rung ladder table, matches the manuscript table
- **Content:** Coarse binary → In-group refinement → Out-group refinement →
  Recursive projection.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1675`.

## G-08 — Du Bois pull-quotes

- **Anchor:** `Aisha (08:13)`
- **Hold:** through 10:03
- **Type:** two sequential text cards, plain, book-page styled, held through both the
  College and PhD beats on this concept
- **Content:** "the public and psychological wage" / "the Propaganda of History" —
  both attributed on-card to Du Bois, *Black Reconstruction* (1935).
- **Note:** `[book]` `Paper/The_Original_Power.tex:1690–1699`.

## G-09 — Architecture vs. phenomenology note

- **Anchor:** `Toussaint (10:03)`
- **Hold:** through 10:19
- **Type:** small disclaimer card, understated
- **Content:** "Comparing architecture ≠ comparing suffering."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1700`.

## G-10 — Conventional causal arrow (struck through)

- **Anchor:** `Emmanuel Theodore (11:31)`
- **Hold:** through 12:24
- **Type:** three-box flow diagram, red, struck through on the reveal
- **Content:** Individual Prejudice → Discriminatory Actions → Systemic Outcomes.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1732` (Eq. 1.3).

## G-11 — Reversed causal arrow + Zurara/Fields

- **Anchor:** `Emmanuel Theodore (12:28)`
- **Hold:** through 13:51
- **Type:** three-box flow diagram, green, replacing G-10; archival-styled quote card
  follows in the same hold
- **Content:** Elite Economic Interests → Systemic Racialization → Interpersonal
  Prejudice; then "Gomes Eanes de Zurara, 1453 — commissioned chronicle" with the
  Fields quote beneath: "People are more readily perceived as inferior by nature
  when they are already seen as oppressed."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1736, 1738` (Eq. 1.4).

## G-12 — The -ism family

- **Anchor:** `Aisha (14:12)`
- **Hold:** through 14:39
- **Type:** four-word list, one word highlighted per beat
- **Content:** Capitalism · Feudalism · Colonialism · Racism — first three glossed
  "system," fourth corrected from "???" to "system."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1809`.

## G-13 — Hierarchy inversion

- **Anchor:** `Emmanuel Theodore (15:28)`
- **Hold:** through 16:35
- **Type:** the manuscript's own two-column inverted-pyramid figure, redrawn
- **Content:** Conventional (Individual Prejudice top, buried Systemic at bottom)
  next to Correct (Systemic Policies top, epiphenomenal Interpersonal Prejudice at
  bottom).
- **Note:** `[book]` `Paper/The_Original_Power.tex:1839`.

## G-14 — Fractal virus properties

- **Anchor:** `Emmanuel Theodore (17:23)`
- **Hold:** through 18:08
- **Type:** four-item checklist, ticking in as named
- **Content:** Hijacks resources · Replicates at every scale · Mutates its
  signature · Payload never changes.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1864`.

## G-15 — Biological Embedding, boxed definition

- **Anchor:** `Emmanuel Theodore (19:24)`
- **Hold:** through 21:00
- **Type:** the manuscript's own boxed-definition styling, verbatim, both sentences
  shown together
- **Content:** full text of the Biological Embedding definition, the bounding
  sentence ("race is not genetic...") visually distinct but present in the same
  frame.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1872–1880`. Never show the first
  half without the second, per the hazards audit.

## G-16 — Rootkit / kernel diagram

- **Anchor:** `Emmanuel Theodore (21:42)`
- **Hold:** through 22:22
- **Type:** OS-layer diagram, kernel space vs. user space
- **Content:** kernel space labeled "extraction code (law, property, exception
  clauses)"; user space labeled "voting, protest, lawsuits — cannot reach the layer
  below."
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:1900s`
  (kernel objective).

## G-17 — Antebellum cotton case study, chart

- **Anchor:** `Emmanuel Theodore (23:31)`
- **Hold:** through 26:36
- **Type:** dual-axis line chart, matches `figures/eq05_kernel_optimization.png`
- **Content:** cotton revenue (1840/1850/1860: $74.1M / $102.5M / $247.0M) on one
  axis; suppression-budget ratio (2.70% / 2.88% / 2.75%) on the other, band
  highlighted to show the < 0.2-point range. Nat Turner (1831) marked as an
  independent threshold-response event.
- **Note:** `[data]` `Paper/data/eq05_antebellum_cotton.csv`;
  `Paper/The_Original_Power.tex:2027` (Fig. eq05_kernel).

## G-18 — Pigmentation cline map

- **Anchor:** `Emmanuel Theodore (28:22)`
- **Hold:** through 29:49
- **Type:** world map with a smooth gradient overlay by latitude, plus two
  ancient-DNA markers (La Braña, Spain; Cheddar Man, Britain)
- **Content:** gradient bar labeled "UV exposure by latitude"; markers annotated
  with the dark-skin/light-eye finding at each site; the Seti I tomb referenced as a
  citation card (dynasty, one descriptive line), not a rendered image of human
  figures.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2038–2040`.

## G-19 — Kernel HUD wrapper (scoped to diagnostic-model interior)

- **Anchor:** `Toussaint (29:49)`
- **Hold:** through the end of Module 9 (`Emmanuel Theodore (69:06)`)
- **Type:** thin HUD-style frame (green monospace corner brackets, faint scanline
  texture), low opacity, wrapping the video for the interior of the diagnostic-model
  section — starting at the content note, not at the section's own opening, so the
  frame's first appearance is deliberately timed to the register shift
- **Content:** corner label "SYSTEM SCAN: REDEFINING_RACISM.CH2"; module names swap
  into the label as each one begins (ROOTKIT already passed; ZERO-DAY, BAYESIAN
  DEFENSE, POLYMORPHIC CODE, RLC BACKLASH, FRACTAL EXEC, LEXICAL FRACTAL, FIREWALL,
  Δmax=0).
- **Note:** `[design]`. Narrower in scope than the prior revision's HUD, which
  wrapped the whole diagnostic-model half; here it explicitly excludes the Level
  Card beats so the two devices never visually compete.

## G-20 — Content note, plain frame

- **Anchor:** `Toussaint (29:49)` (second beat, before Aisha's five-year-old line)
- **Hold:** through `Emmanuel Theodore (30:xx)` (the Thistlewood/Abba turn)
- **Type:** plain dark title-only card, no imagery, no animation
- **Content:** small, quiet text: "The historical record referenced here is
  graphic. Described, not shown." No further detail on screen.
- **Note:** hazards-audit item. Do not add a second visual description on top of the
  spoken one; do not resume the Level Card badge for this turn.

## G-21 — Botnet / node map

- **Anchor:** `Emmanuel Theodore` (final turn of Module 2, routing line: "Every
  plantation, a compromised node...")
- **Hold:** 12 seconds
- **Type:** node-and-edge network diagram
- **Content:** plantation nodes feeding lines into hub cities (Lisbon, London,
  Amsterdam, Wall Street), styled as a botnet C2 diagram.
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:2043`.

## G-22 — Bayesian prior + Tajfel result

- **Anchor:** `Emmanuel Theodore` (Module 3, PhD beat)
- **Hold:** through the Tajfel/coalition-tracking passage
- **Type:** equation-gloss card, then simple bar-choice diagram
- **Content:** gloss: "installed prior overrides raw evidence"; three allocation
  options (max joint profit / max in-group profit / max difference), "max
  difference" highlighted as the one chosen even at a loss; team-jersey
  coalition-tracking result shown as a second, smaller panel.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2049, 2054`.

## G-23 — LSD/DMN, flagged open question

- **Anchor:** `Emmanuel Theodore` (Module 3, LSD passage)
- **Hold:** 14 seconds
- **Type:** timeline strip, 1966 → 1970, ending on a "?" icon rather than a
  conclusion
- **Content:** 1966 protocol (91%) → CA criminalization → federal amendments → 1970
  Controlled Substances Act; final card: "Deliberate or emergent? Flagged, not
  resolved."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2056–2058`. Mandatory
  "flagged, not resolved" card per the hazards audit.

## G-24 — .exe recompile chains + gastronomic interface

- **Anchor:** `Aisha (26:51)` region → `Emmanuel Theodore (27:24)` (Module 4, College
  beat)
- **Hold:** through the PhD beat's opening
- **Type:** terminal/code-editor styled recompile animation, matching the G-19 HUD
  aesthetic
- **Content:** `Gastronomic_Interface` (Cartwright's "childlike Negro") as the
  founding version, then: `Chattel_Slavery.exe` → `Convict_Leasing.exe` /
  `Black_Codes.exe`; `Jim_Crow.exe` → `War_on_Drugs.exe` /
  `Mass_Incarceration.exe`; `Explicit_Discrimination.exe` → `Redlining.exe` /
  `Predatory_Lending.exe` / `Algorithmic_Bias.exe`.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2071–2076`, verbatim file names.

## G-25 — Interface-strategy optimizer + three cost tracks

- **Anchor:** `Emmanuel Theodore` (Module 4, PhD)
- **Hold:** through the Ehrlichman-quote beat
- **Type:** equation-gloss card, then three small trend arrows (coercive,
  legitimacy, economic)
- **Content:** four strategies (partition / integration / direct repression /
  externalization); all three costs rising through the mid-1950s–60s, then
  dropping sharply at the interface-swap point, labeled with named triggers (NAACP
  litigation, Brown v. Board, Birmingham, Cold War optics).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2082–2098`.

## G-26 — Ehrlichman quote, contested

- **Anchor:** `Emmanuel Theodore` (Module 4, PhD, Ehrlichman sentence)
- **Hold:** 10 seconds
- **Type:** quote card with a visible "disputed" annotation
- **Content:** the quote, attributed "reported by Dan Baum," with a small secondary
  line: "Ehrlichman's family and some Nixon-era defenders dispute this."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2101`. Mandatory dispute
  annotation.

## G-27 — Drug incarceration, sentencing disparity, Broward, Anslinger not-used

- **Anchor:** `Emmanuel Theodore` (Module 4, PhD, remainder)
- **Hold:** through the end of the PhD turn
- **Type:** bar chart + ratio callout, then two-date case card, then a quote card
  visibly failing a "verified" stamp
- **Content:** 38,680 (1972) → 480,519 (2002) drug-incarceration count; 100:1
  crack/powder ratio; *State v. Williams* → ~2,600 records sought vacated; Anslinger
  attribution stamped "UNVERIFIED — Penn State Special Collections," supportable
  narrower claim shown beneath.
- **Note:** `[data]` Caulkins & Chandler; USSC 2011 retroactivity report; `[book]`
  `Paper/The_Original_Power.tex:2103, 2105, 2106`. The Anslinger card exists to model
  the discipline being demonstrated — keep it explicit, do not quietly cut it.

## G-28 — Texas Observer, 2024

- **Anchor:** `Emmanuel Theodore (28:22)` region (Module 4 follow-up, Texas prison
  agribusiness beat)
- **Hold:** 10 seconds
- **Type:** single-fact card, present-tense framing
- **Content:** "24 Texas prison units still run agribusiness operations — 9 on
  former plantation land (2024)."
- **Note:** `[data]` Texas Observer, 2024.

## G-29 — RLC circuit diagram

- **Anchor:** `Emmanuel Theodore` (Module 5, "no equation yet, just the picture")
- **Hold:** through the end of Module 5's PhD turns; recurs as a static reference
  plate through the coil-gun extension
- **Type:** the manuscript's own series-RLC circuit schematic, redrawn cleanly
- **Content:** voltage source → resistor ("bureaucratic/carceral friction") →
  inductor ("cultural inertia") → capacitor ("token-reform absorption").
- **Note:** `[book]` `Paper/The_Original_Power.tex:2161–2172` (Fig. rlc_topology).

## G-30 — Damped oscillation trace, Shock 1 and Shock 2

- **Anchor:** `Emmanuel Theodore` (Module 5, "Walk shock one" / "Walk shock two")
- **Hold:** through the damping-ratio callout
- **Type:** the manuscript's own damped-sine oscillator plot, animated to draw left
  to right as narrated
- **Content:** baseline at $q=0$; Shock 1 (1865, large amplitude, overshoot labeled
  "Black Codes / Convict Leasing"); Shock 2 (1964, smaller amplitude, overshoot
  labeled "War on Drugs / Mass Incarceration"); damping-ratio tags (0.17 / 0.59 /
  0.97) at each event marker.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2163, 2226` (Fig.
  backlash_oscillator; ζ values).

## G-31 — Resonance / solidarity escape condition

- **Anchor:** `Emmanuel Theodore` (Module 5, escape-condition passage)
- **Hold:** through the caveat's opening line
- **Type:** two side-by-side traces — a single damped pulse ("isolated reform") vs.
  a sustained matched-frequency drive climbing without bound ("sustained,
  frequency-matched solidarity")
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:2189–2190`.

## G-32 — Agency disclaimer

- **Anchor:** `Emmanuel Theodore` (Module 5, "This invariant is a claim about the
  Elite's proportional share...")
- **Hold:** 16 seconds
- **Type:** text list, warm tone — deliberately breaks the HUD aesthetic for this
  one beat
- **Content:** Black Wall Street · NAACP litigation → *Brown v. Board* · Civil
  Rights Act victories · post-1965 Black professional middle class.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2192`. Mandatory inclusion; do not
  cut for time.

## G-33 — Post-1965 Backlash Wave, three-track chart

- **Anchor:** `Emmanuel Theodore` (Module 5, "The post-1965 Backlash Wave, fifty
  five years of data")
- **Hold:** through the Tier-one-confidence line
- **Type:** three-line chart, matches `figures/eq08_10_backlash_wave.png`
- **Content:** union density (28.4%→10.8%), top-decile wealth share (67.5%→76.5%),
  incarceration rate (108→358/100k; Black incarceration peak 3,074/100k in 2010),
  1965–2020.
- **Note:** `[data]` `Paper/data/eq08_10_backlash_wave.csv`;
  `Paper/The_Original_Power.tex:2265` (Fig. eq08_backlash).

## G-34 — Complex wage / reactive power

- **Anchor:** `Emmanuel Theodore` (Module 5 extension, College beat)
- **Hold:** through the PhD beat's opening
- **Type:** vector diagram, reusing the ψ phasor asset from Episode 1
- **Content:** a force vector and a velocity vector drawn perpendicular, labeled
  material (does work) and status (deflects only, zero material work).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2274–2286`.

## G-35 — Coil gun / energy recovery

- **Anchor:** `Emmanuel Theodore` (Module 5 extension, PhD, coil-gun sentence)
- **Hold:** through the end of that turn
- **Type:** multi-stage linear-accelerator schematic
- **Content:** labeled coils in sequence (Jim Crow → Southern Strategy → War on
  Drugs), with an energy-arrow flowing from each collapsing coil into the next
  one's charge.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2301–2318`.

## G-36 — Six-scale fractal zoom rail

- **Anchor:** `Emmanuel Theodore (53:41)` ("Six named scales map the same five
  roles...")
- **Hold:** through the end of Module 6, including the objection and phase-loading
  passages; persists as a side-rail, current level highlighted as narrated
- **Type:** vertical zoom rail, six labeled levels
- **Content:** WAN (global) → OS (national) → Subroutine (biological) →
  Application (intersectional) → Auto-exec (colorism) → [Lexical, added later at
  G-40].
- **Note:** `[book]` `Paper/The_Original_Power.tex:2474–2565` (isomorphism table).

## G-37 — WAN/OS scale detail

- **Anchor:** `Emmanuel Theodore (53:58)` / `(54:08)`
- **Hold:** through the national-level beat
- **Type:** two-panel world map + national map overlay
- **Content:** IMF/World Bank/comprador-government flows (global panel); redlining
  map + gerrymander district outline (national panel).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2478, 2482`.

## G-38 — Subroutine scale, content-sensitive

- **Anchor:** `Emmanuel Theodore (54:44)`
- **Hold:** through the end of that turn
- **Type:** plain text citation card, no imagery
- **Content:** "1662, Virginia: *partus sequitur ventrem* — child's status follows
  the mother's."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2492`. Do not illustrate the named
  acts of sexual violence; text citation only.

## G-39 — Application layer and auto-exec/colorism

- **Anchor:** `Emmanuel Theodore (55:13)` / `(55:14)`
- **Hold:** through the end of the colorism passage
- **Type:** overlapping-circles diagram, then a self-referencing loop diagram
- **Content:** race/gender/sexuality/disability circles, overlap regions shaded
  darker; a single out-group circle with an arrow looping back into itself,
  labeled "self-executing code."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2497, 2500–2501`.

## G-40 — Model minority objection + phase-loading operator

- **Anchor:** `Emmanuel Theodore (56:40)`
- **Hold:** through the end of Module 6
- **Type:** Q&A card, then timeline + rising line chart
- **Content:** "Objection: outperformance despite partition." / "Answer: calibration
  by insertion point, 1965 Immigration and Nationality Act." Then ERA (~1972) /
  Moral Majority (~1979) / Anita Bryant campaign (1977–79) markers; Φ_load line
  rising 0.078 → 0.214 (approx.) → 0.403.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2530–2537, 2554, 2557` (Tier 2,
  ordinal phase values — label the chart "ordinal index," not raw percentages).
  Mandatory inclusion of the objection card per the hazards audit.

## G-41 — Master/slave patent timeline

- **Anchor:** `Emmanuel Theodore (59:13)`
- **Hold:** through the accuracy-audit passage
- **Type:** timeline, 1904 → 2024, with a sharp step-change marked at 1976
- **Content:** 1904 "slave clock" coinage → pre-WWII neutral hydraulic-patent
  vocabulary → 1959 scare-quoted patent → 1976+ patent-search count (19,708
  documents) → deployment across named domains. Sixth scale label ("Lexical") slots
  into the G-36 rail here.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2570–2578`, citing
  `eglash_broken`.

## G-42 — Accuracy-audit quotes + Dartmouth 1964/1968

- **Anchor:** `Emmanuel Theodore (59:13)` (accuracy-audit sentence) → `(59:07)`
- **Hold:** through the professor-testimony beat
- **Type:** stacked quote cards, then archival terminal-text card
- **Content:** IDE documentation quote; the Black electrical engineer's flip-flop
  quote; the "runaway user program" quote (1964/1968) tagged "Mode 2: autonomous
  propagation"; the 1992 classroom testimony.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2580, 2582, 2585–2587, 2591–2592`.

## G-43 — Deprecation arc, 2003–2020

- **Anchor:** `Emmanuel Theodore (61:21)`
- **Hold:** through the end of that turn
- **Type:** timeline, three markers, ending on a gap callout
- **Content:** Nov. 2003 (LA County memo) → 2014–2018 (Django/Drupal/Redis/CouchDB/
  Python) → June–Oct. 2020 (GitHub `main`, Linux kernel, I²C v7). Gap callout: "17
  years from complaint to institutional shift."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2601–2608`.

## G-44 — Reflexive audit, the book on itself

- **Anchor:** `Emmanuel Theodore (62:37)`
- **Hold:** through the end of Module 7
- **Type:** text card, breaks the HUD frame briefly (drop the green scanline border
  for this one card)
- **Content:** "This book uses 'Elite,' not 'master class' — deliberately."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2632–2642`. Intentional visual
  break, not a rendering error.

## G-45 — Corrupted firewall diagram

- **Anchor:** `Emmanuel Theodore (64:04)`
- **Hold:** through the end of the College beat
- **Type:** firewall/network-security diagram, inverted (the "firewall" node facing
  the wrong direction)
- **Content:** the Buffer Class node positioned as if defending the perimeter, with
  a dashed arrow showing it is itself inside the extraction flow.
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:2644–2652`.

## G-46 — Status wage vs. material wage + SDO/RWA + three buffer functions

- **Anchor:** `Emmanuel Theodore (64:46)`
- **Hold:** through the end of Module 8
- **Type:** two-column comparison with funding-source footnote, then equation-gloss
  dial diagram, then a three-item checklist
- **Content:** Status wage (deference, courtesy titles, leniency — no material
  transfer) / Material wage (land grants, Social Security, GI Bill — funded by
  deeper out-group extraction, never by the Elite's own share); SDO and RWA shown as
  dials scaling the wage's effective value; Threat absorption · Perimeter defense ·
  Antivirus misdirection.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2655–2677`.

## G-47 — Malcolm X quote

- **Anchor:** `Emmanuel Theodore (66:47)`
- **Hold:** 9 seconds
- **Type:** full-frame quote card, held
- **Content:** "The white man will try to satisfy us with symbolic victories rather
  than economic equity and real Justice." — Malcolm X.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2680`.

## G-48 — Top 0.1% wealth share, falsification condition

- **Anchor:** `Emmanuel Theodore (67:21)`
- **Hold:** through the Great Compression setup
- **Type:** long-run line chart, 1913–present, with a shaded "violation zone"
  overlay showing what a real falsification would look like
- **Content:** top 0.1% wealth share since 1913; the New Deal/Great Compression dip
  (1935–1973, 25%→under 10%) highlighted as the candidate case, not yet resolved.
- **Note:** `[data]` `Paper/The_Original_Power.tex:2700s` (Δmax=0 falsifiability
  passage); Piketty-Saez-Zucman/WID series.

## G-49 — Great Compression, three-part rebuttal

- **Anchor:** `Emmanuel Theodore (68:07)` through `(67:44)`
- **Hold:** through the end of Module 9
- **Type:** three sequential annotation cards over the G-48 chart, appearing as each
  reason is narrated
- **Content:** 1. "Forced by convergent threats" (labor militancy, socialist
  option, Soviet alternative, anti-colonial movements). 2. "Every concession still
  ran through the racial partition" (GI Bill segregated locally, FHA built
  redlining, Social Security excluded agricultural/domestic work). 3. "Recovered on
  schedule after 1973" — the chart's post-1973 line climbing back toward the 1929
  peak.
- **Note:** `[book]` Δmax=0 falsifiability passage; GI Bill/FHA/Social Security
  exclusion citations per `notes/CH2_findings.md`.

## G-50 — Three modes diagram

- **Anchor:** `Emmanuel Theodore (70:36)`
- **Hold:** through the end of Module 10
- **Type:** three-panel diagram, stacked rather than side-by-side, showing the
  modes layering on top of each other over time
- **Content:** Intentional Design (Zurara 1453, 1705 Virginia Slave Codes,
  Three-Fifths Compromise) · Autonomous Propagation (1960s real-estate steering,
  no personal animus required) · Conscious Intervention (Ehrlichman, Atwater,
  reasoning on the record).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2750s` (three-modes
  methodological note).

## G-51 — Rapid-fire recap

- **Anchor:** `Toussaint (72:44)`
- **Hold:** through `Aisha (73:59)`
- **Type:** nine-item checklist, ticking in one per line as each host names it
- **Content:** the nine module names in order, each with its five-year-old gloss
  shown as a small caption beneath.
- **Note:** `[design]`. This is the only cue that references every module by name in
  one frame; keep it legible at a glance rather than dense.

## G-52 — Closing card

- **Anchor:** `Toussaint (76:53)`
- **Hold:** through the end
- **Type:** static
- **Content:** *Architecting the Operation* — "Redefining Racism," from *The
  Original Power*. Host card: Toussaint · Aisha · Emmanuel Theodore.
