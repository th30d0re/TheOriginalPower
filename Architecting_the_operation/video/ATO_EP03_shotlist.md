# ATO Episode 3 — Video Shot List

Companion to `../podcasts/ATO_EP03_redefining_racism.md`.

Graphics live here, never inside the script. The voice pipeline's markup tokenizer
(`voice_pipeline/markup.py`) only recognizes `[pause:NNNms]`, `[beat]`, `[emphasis]`
and `[tone]`. Any other bracketed tag falls through and gets spoken aloud by the TTS
engine, and any non-tag line inside a speaker turn is spoken too. So the script stays
pure speech and the video cues stay in this file.

## Alignment procedure

Cue anchors are the script's own header timestamps, and those are derived from measured
audio by `tools/retime_script.py`. Episode 3 has not been rendered yet, so its
timestamps in the script are hand-estimated at a words-per-second rate carried forward
from Episodes 1–2, not measured. After the render, re-run:

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
vocabulary plate, and the lower-third name cards. This episode is the first full
payoff of the circuit vocabulary Episode 1 introduced and Episode 2 previewed.

New visual families introduced here: the Set-Resolution Ladder, the causal-arrow
reversal diagram, the virus/kernel HUD frame that recurs as a wrapper for the whole
diagnostic-model half of the episode, the pigmentation-cline map, the RLC oscillator
trace, the six-scale fractal zoom, the master/slave lexical timeline, and the
top-0.1%-wealth-share chart.

**Content-note handling.** Two passages (G-23, the Thistlewood/Abba material; G-24 is
its recovery beat) carry graphic historical content that the audio track itself flags
verbally (Toussaint's spoken content note at 23:44). The video should not add a second,
redundant on-screen warning card — hold on a plain, dark title-only frame (no imagery)
for that turn instead of an illustrative graphic. Do not render the acts described.

---

## G-01 — Title card

- **Anchor:** `Toussaint (00:00)`
- **Hold:** through 00:14
- **Type:** static
- **Content:** *Architecting the Operation* / Episode 3 / "Redefining Racism" /
  subtitle: The word gets a specification.

## G-02 — Recap bridge from Episode 2

- **Anchor:** `Toussaint (00:00)` (second beat)
- **Hold:** through 00:23
- **Type:** small recap card, corner-anchored, fades under dialogue
- **Content:** "Racism = psycho-legal social software, running on wetware" — the
  Episode 2 thesis card, shown small and faded, not re-litigated.
- **Note:** `[book]` continuity only; do not re-derive.

## G-03 — Three-part episode map

- **Anchor:** `Aisha (00:32)`
- **Hold:** through 00:56
- **Type:** three-panel roadmap
- **Content:** 1. Binary → five-tier refinement · 2. The word rebuilt · 3. The
  diagnostic model (fractal computer virus).
- **Note:** `[design]`.

## G-04 — Shadow / projection

- **Anchor:** `Emmanuel Theodore (01:44)`
- **Hold:** through 01:55
- **Type:** simple animated diagram
- **Content:** a 3-D solid object casting a flat 2-D shadow on a wall; the shadow is
  labeled "in-group / out-group," the solid is labeled "full architecture."
- **Note:** `[design]`.

## G-05 — Coarse binary partition

- **Anchor:** `Aisha (01:31)`
- **Hold:** through 01:41
- **Type:** equation card
- **Content:** $U = I \,\dot\cup\, O$, $I \cap O = \varnothing$.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1596` (Eq. binary-partition).

## G-06 — Five-tier refinement (reuse from Ep. 1)

- **Anchor:** `Toussaint (02:16)`
- **Hold:** through 02:29
- **Type:** the five-tier pyramid stack, Episode 1's asset, re-triggered
- **Content:** Elite / Puppet / Enforcement / Buffer, stacked inside the coarse
  in-group box.
- **Note:** `[book]` continuity asset from Episode 1; `Paper/The_Original_Power.tex:1633`.

## G-07 — Out-group fracture

- **Anchor:** `Aisha (02:39)`
- **Hold:** through 02:53
- **Type:** matching stack on the out-group side
- **Content:** $O_{\text{racialized}}$ plus a fan of adjacent out-group subgroups,
  each labeled with one sorting axis: phenotype, gender, geography, legal status,
  credentialing, criminalized status.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1656`.

## G-08 — Recursive local partition

- **Anchor:** `Emmanuel Theodore (03:07)`
- **Hold:** through 03:36
- **Type:** single figure, one person, split by two overlapping colored fields
- **Content:** one silhouette; a blue field labeled "race axis: in-group" and a red
  field labeled "class axis: out-group" overlap on the same figure.
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:1673`
  (recursive-local-partition equation).

## G-09 — Set-Resolution Ladder

- **Anchor:** `Aisha (04:05)`
- **Hold:** through 04:23
- **Type:** four-rung ladder table, matches the manuscript table exactly
- **Content:** Coarse binary → In-group refinement → Out-group refinement →
  Recursive projection, each rung's "what becomes visible" column shown as it's
  named.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1675` (Table: Set-Resolution
  Ladder).

## G-10 — Du Bois pull-quotes

- **Anchor:** `Toussaint (04:59)`
- **Hold:** through 05:48
- **Type:** two sequential text cards, plain, book-page styled
- **Content:** "the public and psychological wage" / "the Propaganda of History" —
  both attributed on-card to Du Bois, *Black Reconstruction*.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1690–1699`.

## G-11 — Architecture vs. phenomenology note

- **Anchor:** `Toussaint (04:29)`
- **Hold:** through 04:41
- **Type:** small disclaimer card, understated
- **Content:** "Comparing architecture ≠ comparing suffering."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1700`.

## G-12 — Conventional causal arrow (struck through)

- **Anchor:** `Emmanuel Theodore (06:32)`
- **Hold:** through 06:52
- **Type:** three-box flow diagram, red, struck through on the reveal
- **Content:** Individual Prejudice → Discriminatory Actions → Systemic Outcomes.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1732` (Eq. 1.3, conventional
  causal arrow); mirrors the manuscript's own Figure: The Causal Reversal.

## G-13 — Reversed causal arrow

- **Anchor:** `Emmanuel Theodore (06:55)`
- **Hold:** through 07:04
- **Type:** three-box flow diagram, green, replacing G-12
- **Content:** Elite Economic Interests → Systemic Racialization → Interpersonal
  Prejudice.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1736` (Eq. 1.4).

## G-14 — Zurara, 1453

- **Anchor:** `Toussaint (07:08)`
- **Hold:** through 07:27
- **Type:** archival-styled text card
- **Content:** "Gomes Eanes de Zurara, 1453 — commissioned chronicle" with the
  Fields quote beneath: "People are more readily perceived as inferior by nature
  when they are already seen as oppressed."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1738`.

## G-15 — Feedback loop, added to the reversed arrow

- **Anchor:** `Aisha (08:07)`
- **Hold:** through 08:58
- **Type:** the G-13 diagram, with a dashed orange feedback arrow added, curving
  from "Interpersonal Prejudice" back to "Systemic Racialization"
- **Content:** label on the dashed arrow: "reinforcing feedback (cultivated, not
  original)."
- **Note:** `[book]` `Paper/The_Original_Power.tex:1745` mirrors the manuscript's
  Figure: Causal Reversal with Reinforcing Feedback.

## G-16 — The -ism family

- **Anchor:** `Toussaint (09:51)`
- **Hold:** through 10:15
- **Type:** four-word list, one word highlighted per beat
- **Content:** Capitalism · Feudalism · Colonialism · Racism — the first three
  glossed "system," the fourth glossed "???" then corrected to "system" on the
  next beat.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1809`.

## G-17 — Prejudice vs. racism, side by side

- **Anchor:** `Toussaint (10:33)`
- **Hold:** through 11:29
- **Type:** two-column definition card, held long
- **Content:** verbatim two definitions from the manuscript blockquote.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1804–1808`. Verbatim; do not
  paraphrase on-screen.

## G-18 — Hierarchy inversion (reuse Ep. 0 style)

- **Anchor:** `Aisha (11:52)`
- **Hold:** through 12:20
- **Type:** the manuscript's own two-column inverted-pyramid figure, redrawn
- **Content:** Conventional (Individual Prejudice top, buried Systemic at bottom)
  next to Correct (Systemic Policies top, epiphenomenal Interpersonal Prejudice
  at bottom).
- **Note:** `[book]` `Paper/The_Original_Power.tex:1839` (Figure: Inverting the
  Definitional Hierarchy).

## G-19 — Kernel HUD wrapper, first appearance

- **Anchor:** `Emmanuel Theodore (12:40)`
- **Hold:** through 13:08, then recurs as a low-opacity frame border for the rest
  of the diagnostic-model half of the episode (roughly 12:40 through 1:04:00)
- **Type:** a thin HUD-style frame (green monospace corner brackets, faint
  scanline texture) that wraps the video for the whole virus-model section
- **Content:** small corner label, "SYSTEM SCAN: REDEFINING_RACISM.CH2" that
  persists at low opacity; individual module names (ROOTKIT, ZERO-DAY, BAYESIAN
  DEFENSE, POLYMORPHIC CODE, RLC BACKLASH, FRACTAL EXEC, LEXICAL FRACTAL,
  FIREWALL) swap into the corner label as each subsection begins.
- **Note:** `[design]`. This is the episode's signature visual device; keep it
  subtle enough not to fight the content graphics layered on top of it.

## G-20 — Fractal virus properties

- **Anchor:** `Emmanuel Theodore (12:47)`
- **Hold:** through 13:04
- **Type:** four-item checklist, ticking in as named
- **Content:** Hijacks resources · Replicates at every scale · Mutates its
  signature · Payload never changes.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1864`.

## G-21 — Biological Embedding, boxed definition

- **Anchor:** `Aisha (13:51)`
- **Hold:** through 14:36
- **Type:** the manuscript's own boxed-definition styling, verbatim
- **Content:** full text of the Biological Embedding definition, with the second
  (bounding) sentence visually separated/emphasized from the first.
- **Note:** `[book]` `Paper/The_Original_Power.tex:1872–1880`. Verbatim, both
  sentences shown, per the hazards audit — never show the first half without the
  second.

## G-22 — Antebellum cotton case study, chart

- **Anchor:** `Toussaint (18:07)`
- **Hold:** through 18:32
- **Type:** dual-axis line chart, matches `figures/eq05_kernel_optimization.png`
- **Content:** cotton revenue (1840/1850/1860: $74.1M / $102.5M / $247.0M) on one
  axis; suppression-budget ratio (2.70% / 2.88% / 2.75%) on the other, band
  highlighted to show the < 0.2-point range.
- **Note:** `[data]` `Paper/data/eq05_antebellum_cotton.csv`;
  `Paper/The_Original_Power.tex:2027` (Fig. eq05_kernel).

## G-23 — Pigmentation cline map

- **Anchor:** `Aisha (21:56)`
- **Hold:** through 23:10
- **Type:** world map with a smooth gradient overlay by latitude, plus two
  ancient-DNA markers (La Braña, Spain; Cheddar Man, Britain) and the Seti I tomb
  procession image referenced, not reproduced in graphic detail
- **Content:** gradient bar labeled "UV exposure by latitude"; markers annotated
  with the dark-skin/light-eye finding at each site.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2038–2040`. Treat the Seti I
  reference as a citation card (tomb name, dynasty, one line of description) rather
  than a rendered image of human figures, to avoid implying a specific visual
  reconstruction the chapter doesn't provide.

## G-24 — Content note, plain frame

- **Anchor:** `Toussaint (23:20)`
- **Hold:** through 24:25
- **Type:** plain dark title-only card, no imagery, no animation
- **Content:** small, quiet text: "The historical record referenced here is
  graphic. Described, not shown." No further detail on screen — the audio itself
  carries the description at the level the manuscript uses.
- **Note:** hazards-audit item; see header note above. Do not add a second visual
  description on top of the spoken one.

## G-25 — Botnet / node map

- **Anchor:** `Emmanuel Theodore (24:29)`
- **Hold:** through 24:39
- **Type:** node-and-edge network diagram
- **Content:** plantation nodes feeding lines into hub cities (Lisbon, London,
  Amsterdam, Wall Street), styled as a botnet C2 diagram.
- **Note:** `[design]`, illustrating `[book]` `Paper/The_Original_Power.tex:2043`.

## G-26 — Bayesian prior equation

- **Anchor:** `Emmanuel Theodore (25:06)`
- **Hold:** through 25:24
- **Type:** equation card with plain-language gloss beneath it
- **Content:** $P_i(T \mid X, \Pi_{\text{race}}) \propto P(X \mid T)\,P_i(T \mid
  \Pi_{\text{race}})$ — gloss: "installed prior overrides raw evidence."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2054`.

## G-27 — Tajfel minimal-group result

- **Anchor:** `Aisha (25:56)`
- **Hold:** through 26:12
- **Type:** simple bar-choice diagram
- **Content:** three allocation options (max joint profit / max in-group profit /
  max difference), with "max difference" highlighted as the one chosen even at
  a loss.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2049`.

## G-28 — LSD/DMN, flagged open question

- **Anchor:** `Toussaint (26:49)`
- **Hold:** through 27:52
- **Type:** timeline strip, 1966 → 1970, ending on a "?" icon rather than a
  conclusion
- **Content:** 1966 IFAS protocol (91%) → CA criminalization → federal Drug Abuse
  Control Amendments → 1970 Controlled Substances Act; final card: "Mode 2 or
  Mode 3? Flagged, not resolved."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2056–2058`. The "flagged, not
  resolved" card is mandatory per the hazards audit — do not end this timeline on
  an implied conclusion.

## G-29 — .exe recompile chains

- **Anchor:** `Toussaint (29:06)`
- **Hold:** through 29:34
- **Type:** three sequential "file recompile" animations, terminal/code-editor
  styled, matching the G-19 HUD aesthetic
- **Content:** `Chattel_Slavery.exe` → `Convict_Leasing.exe` / `Black_Codes.exe`;
  `Jim_Crow.exe` → `War_on_Drugs.exe` / `Mass_Incarceration.exe`;
  `Explicit_Discrimination.exe` → `Redlining.exe` / `Predatory_Lending.exe` /
  `Algorithmic_Bias.exe`.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2071–2076`, verbatim file names.

## G-30 — Interface-strategy optimizer

- **Anchor:** `Toussaint (30:29)`
- **Hold:** through 30:47
- **Type:** equation + four-option menu
- **Content:** $S^*(t) = \arg\min_S[C_{\text{coercive}} + C_{\text{legitimacy}} +
  C_{\text{economic}}]$, with the four strategies (partition / integration /
  direct repression / externalization) listed beneath.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2082–2087` (Eqs. 1.6–1.7).

## G-31 — Jim Crow → War on Drugs, three cost tracks

- **Anchor:** `Aisha (31:06)`
- **Hold:** through 31:56
- **Type:** three small trend arrows (coercive, legitimacy, economic), all rising
  through the mid-1950s–60s, then all dropping sharply at the interface-swap point
- **Content:** labeled with the specific triggers named in dialogue (NAACP
  litigation, Brown v. Board, Birmingham, Cold War optics).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2091–2098`.

## G-32 — Ehrlichman quote, contested

- **Anchor:** `Emmanuel Theodore (32:03)`
- **Hold:** through 32:23
- **Type:** quote card with a visible "disputed" annotation, not a clean
  confession card
- **Content:** the quote, attributed "reported by Dan Baum," with a small
  secondary line: "Ehrlichman's family and some Nixon-era defenders dispute this."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2101`. The dispute annotation
  is mandatory per the hazards audit.

## G-33 — Drug incarceration + sentencing disparity

- **Anchor:** `Emmanuel Theodore (32:34)`
- **Hold:** through 33:06
- **Type:** bar chart + ratio callout
- **Content:** 38,680 (1972) → 480,519 (2002) drug-incarceration count; 100:1
  crack/powder sentencing ratio called out separately.
- **Note:** `[data]` Caulkins & Chandler; USSC 2011 retroactivity report;
  `Paper/The_Original_Power.tex:2103`.

## G-34 — Broward reverse-sting

- **Anchor:** `Toussaint (33:26)`
- **Hold:** through 33:49
- **Type:** two-date case card
- **Content:** *State v. Williams* (1993) → 2,600 records sought vacated (2024).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2105`.

## G-35 — The quote NOT used

- **Anchor:** `Aisha (34:10)`
- **Hold:** through 34:39
- **Type:** a quote card that visibly fails a "verified" stamp, crossed out
- **Content:** the Anslinger attribution, stamped "UNVERIFIED — Penn State
  Special Collections," with the supportable narrower claim shown beneath as
  the actual takeaway.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2106`. This card exists
  specifically to model the discipline the chapter is demonstrating — keep the
  "not used" framing explicit, don't just quietly cut the beat.

## G-36 — RLC circuit diagram

- **Anchor:** `Emmanuel Theodore (35:13)`
- **Hold:** through 35:36, recurs as a static reference plate through 41:15
- **Type:** the manuscript's own series-RLC circuit schematic, redrawn cleanly
- **Content:** voltage source → resistor (labeled "bureaucratic/carceral
  friction") → inductor (labeled "cultural inertia") → capacitor (labeled
  "token-reform absorption").
- **Note:** `[book]` `Paper/The_Original_Power.tex:2161–2172` (Fig.
  rlc_topology). Continuity asset for the rest of this subsection.

## G-37 — Damped oscillation trace, Shock 1

- **Anchor:** `Emmanuel Theodore (36:11)`
- **Hold:** through 37:02
- **Type:** the manuscript's own damped-sine oscillator plot, animated to draw
  left to right as narrated
- **Content:** baseline at $q=0$; Shock 1 arrow at 1865; overshoot dip labeled
  "Black Codes / Convict Leasing."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2163` (Fig.
  backlash_oscillator), first half only.

## G-38 — Damped oscillation trace, Shock 2

- **Anchor:** `Emmanuel Theodore (37:04)`
- **Hold:** through 38:00
- **Type:** continuation of G-37's animated draw
- **Content:** Shock 2 arrow at 1964, smaller amplitude than Shock 1; overshoot
  dip labeled "War on Drugs / Mass Incarceration"; damping-ratio callouts (ζ =
  0.17 / 0.59 / 0.97) appear as small numeric tags at each event marker.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2163`, second half; ζ values
  from `Paper/The_Original_Power.tex:2226` precision-qualifier paragraph.

## G-39 — Resonance / solidarity condition

- **Anchor:** `Emmanuel Theodore (38:22)`
- **Hold:** through 38:53
- **Type:** two side-by-side traces — a single damped pulse (labeled "isolated
  reform") vs. a sustained matched-frequency drive climbing without bound
  (labeled "sustained, frequency-matched solidarity")
- **Note:** `[design]`, illustrating `[book]`
  `Paper/The_Original_Power.tex:2189–2190` (resonance-escape condition).

## G-40 — Agency disclaimer

- **Anchor:** `Emmanuel Theodore (38:58)`
- **Hold:** through 39:29
- **Type:** text list, warm tone (not circuit-styled — deliberately breaks the
  HUD aesthetic for this one beat)
- **Content:** Black Wall Street · NAACP litigation → *Brown v. Board* · Civil
  Rights Act victories · post-1965 Black professional middle class.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2192`. Mandatory inclusion
  per the hazards audit — do not cut this beat for time.

## G-41 — Post-1965 Backlash Wave, three-track chart

- **Anchor:** `Toussaint (40:01)`
- **Hold:** through 40:32
- **Type:** three-line chart, matches `figures/eq08_10_backlash_wave.png`
- **Content:** union density (28.4%→10.8%), top-decile wealth share
  (67.5%→76.5%), incarceration rate (108→358/100k; Black incarceration
  peak 3,074/100k in 2010), 1965–2020.
- **Note:** `[data]` `Paper/data/eq08_10_backlash_wave.csv`;
  `Paper/The_Original_Power.tex:2265` (Fig. eq08_backlash).

## G-42 — Complex wage / reactive power

- **Anchor:** `Emmanuel Theodore (41:32)`
- **Hold:** through 41:55
- **Type:** vector diagram
- **Content:** a force vector and a velocity vector drawn perpendicular, labeled
  $\psi_m$ (material, does work) and $j\psi_s$ (status, deflects only).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2274–2286`, reusing the ψ
  phasor asset from Episode 1.

## G-43 — Coil gun / energy recovery

- **Anchor:** `Aisha (43:02)`
- **Hold:** through 43:35
- **Type:** multi-stage linear-accelerator schematic
- **Content:** four labeled coils in sequence (Slavery → Jim Crow → Mass
  Incarceration → Gig Economy), with an energy-arrow flowing from each collapsing
  coil into the next one's charge.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2301–2318`.

## G-44 — Six-scale fractal zoom, opening

- **Anchor:** `Emmanuel Theodore (43:44)`
- **Hold:** through 44:19, recurs as a persistent side-rail through the fractal
  subsection (roughly 43:44–49:00)
- **Type:** a vertical zoom rail, six labeled levels, current level highlighted
  as narrated
- **Content:** WAN (global) → OS (national) → Subroutine (biological) →
  Application (intersectional) → Auto-exec (colorism) → [Lexical, added later at
  G-51].
- **Note:** `[book]` `Paper/The_Original_Power.tex:2474–2565` (the isomorphism
  table); mirrors the manuscript's own longtable structure.

## G-45 — WAN/OS scale detail

- **Anchor:** `Aisha (44:03)`
- **Hold:** through 44:42
- **Type:** two-panel world map + national map overlay
- **Content:** IMF/World Bank/G7 flows (global panel); redlining map + gerrymander
  district outline (national panel).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2478, 2482`.

## G-46 — Subroutine scale, content-sensitive

- **Anchor:** `Toussaint (44:44)`
- **Hold:** through 45:15
- **Type:** plain text citation card, no imagery (matches G-24's restraint)
- **Content:** "1662, Virginia: *partus sequitur ventrem* — child's status follows
  the mother's."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2492`. Do not illustrate the
  named acts of sexual violence; text citation only.

## G-47 — Application / intersectional scale

- **Anchor:** `Toussaint (45:15)`
- **Hold:** through 45:44
- **Type:** overlapping-circles diagram
- **Content:** race / gender / sexuality / disability circles, overlap regions
  shaded darker to show compounding extraction.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2497`.

## G-48 — Auto-exec / colorism scale

- **Anchor:** `Emmanuel Theodore (45:49)`
- **Hold:** through 46:22
- **Type:** self-referencing loop diagram
- **Content:** a single out-group circle with an arrow looping from it back into
  itself, labeled "self-executing code."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2500–2501`.

## G-49 — Model minority objection

- **Anchor:** `Aisha (46:45)`
- **Hold:** through 47:31
- **Type:** Q&A card, objection stated then answered
- **Content:** "Objection: outperformance despite partition." / "Answer:
  calibration by insertion point, 1965 Immigration and Nationality Act."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2530–2537`. Mandatory
  inclusion per the hazards audit.

## G-50 — Phase-loading operator + ANES trajectory

- **Anchor:** `Toussaint (48:14)`
- **Hold:** through 48:53
- **Type:** timeline + rising line chart
- **Content:** ERA (~1972) / Moral Majority (~1979) / Anita Bryant campaign
  (1977–79) markers; Φ_load line rising 0.078 → 0.214 → 0.403.
- **Note:** `[data]` ANES cumulative file; `Paper/The_Original_Power.tex:2554,
  2557` (Tier 2, ordinal phase values — label the chart "ordinal index," not raw
  percentages).

## G-51 — Sixth scale added: lexical

- **Anchor:** `Aisha (49:00)`
- **Hold:** through 49:14
- **Type:** the G-44 zoom rail, sixth level slotted in at the bottom
- **Content:** "Lexical / Pedagogical" added beneath Auto-exec.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2609–2620` (extended table).

## G-52 — Master/slave patent timeline

- **Anchor:** `Emmanuel Theodore (49:17)`
- **Hold:** through 49:59
- **Type:** timeline, 1904 → 2024, with a sharp step-change marked at 1976
- **Content:** 1904 "slave clock" coinage → pre-WWII neutral hydraulic-patent
  vocabulary → 1959 scare-quoted patent → 1976+ patent-search count (19,708
  documents) → deployment across the named domains (hard drives, buses, DBs, CI,
  photography, rail, MIDI).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2570–2578`, citing
  `eglash_broken`.

## G-53 — Alternative vocabulary, already available

- **Anchor:** `Aisha (50:03)`
- **Hold:** through 50:22
- **Type:** word-pair list
- **Content:** primary/secondary · leader/follower · controller/target ·
  Mutteruhr/Tochteruhr · dochterklok · horloge-mère/horloge-fille.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2578`.

## G-54 — Accuracy audit quotes

- **Anchor:** `Emmanuel Theodore (50:33)`
- **Hold:** through 51:03
- **Type:** two stacked quote cards
- **Content:** PC Guide IDE documentation quote; the anonymous Black electrical
  engineer's flip-flop quote (both attributed as in the manuscript).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2580, 2582`.

## G-55 — Dartmouth 1964/1968, Mode 2 label

- **Anchor:** `Aisha (51:03)`
- **Hold:** through 51:47
- **Type:** archival terminal-text card
- **Content:** the "runaway user program" quote, dated 1964/1968, with a small
  "Mode 2: autonomous propagation" tag appended.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2585–2587`.

## G-56 — 1992 classroom testimony

- **Anchor:** `Aisha (51:52)`
- **Hold:** through 52:10
- **Type:** plain quote card, no imagery of the classroom
- **Content:** the professor's testimony, quoted, dated 1992.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2591–2592`.

## G-57 — Deprecation arc, 2003–2024

- **Anchor:** `Aisha (52:36)`
- **Hold:** through 53:25
- **Type:** timeline, three markers, ending on a 17-year gap callout
- **Content:** Nov. 2003 (LA County memo) → 2014–2018 (Django/Drupal/Redis/
  CouchDB/Python) → June–Oct. 2020 (GitHub `main`, Linux kernel, I²C v7, IETF).
  Gap callout: "17 years from complaint to institutional shift."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2601–2608`.

## G-58 — Reflexive audit, the book on itself

- **Anchor:** `Emmanuel Theodore (54:29)`
- **Hold:** through 54:44
- **Type:** text card, breaks the HUD frame briefly (drop the green scanline
  border for this one card)
- **Content:** "This book uses 'Elite,' not 'master class' — deliberately."
- **Note:** `[book]` `Paper/The_Original_Power.tex:2632–2642`. This beat is the
  episode's one moment of the model auditing itself; keep the visual break
  intentional, not a rendering error.

## G-59 — Corrupted firewall diagram

- **Anchor:** `Emmanuel Theodore (54:53)`
- **Hold:** through 55:38
- **Type:** firewall/network-security diagram, inverted (the "firewall" node
  shown facing the wrong direction)
- **Content:** the Buffer Class node positioned as if defending the perimeter,
  with a dashed arrow showing it is itself inside the extraction flow.
- **Note:** `[design]`, illustrating `[book]`
  `Paper/The_Original_Power.tex:2644–2652`.

## G-60 — Status wage vs. material wage

- **Anchor:** `Toussaint (55:38)`
- **Hold:** through 56:33
- **Type:** two-column comparison, with the funding-source footnote visible
- **Content:** Status wage (deference, courtesy titles, leniency — no material
  transfer) / Material wage (land grants, Social Security, GI Bill — funded by
  deeper $O_{\text{racialized}}$ extraction, never by $E$'s own share).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2655–2657` and its funding-
  mechanism footnote (~2665–2666).

## G-61 — SDO / RWA amplifier

- **Anchor:** `Toussaint (56:38)`
- **Hold:** through 57:05
- **Type:** equation + two-gauge dial diagram
- **Content:** $\psi_i^{\text{eff}}(t) = \psi(t)[1 + \alpha_S \text{SDO}_i(t) +
  \alpha_A \text{RWA}_i(t)]$, with SDO and RWA shown as dials that scale the wage's
  effective value.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2660`.

## G-62 — Three buffer functions

- **Anchor:** `Aisha (57:05)`
- **Hold:** through 57:53
- **Type:** three-item checklist
- **Content:** Threat absorption · Perimeter defense · Antivirus misdirection.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2669–2677`.

## G-63 — Malcolm X quote

- **Anchor:** `Emmanuel Theodore (58:02)`
- **Hold:** through 58:11
- **Type:** full-frame quote card, held
- **Content:** "The white man will try to satisfy us with symbolic victories
  rather than economic equity and real Justice." — Malcolm X.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2671`.

## G-64 — Falsifiability condition

- **Anchor:** `Emmanuel Theodore (58:48)`
- **Hold:** through 59:08
- **Type:** condition card, plain and precise (this is the episode's single most
  important "how would you know if this were wrong" beat — hold it longer than
  feels comfortable, matching the Episode 2 pattern for the thesis card)
- **Content:** Proxy: top-0.1% wealth share, 1913–present. Violation: sustained
  multi-decade decline, no interface swap, no recovery within 2–3 decades.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2679–2680`.

## G-65 — Elite wealth-share chart, full arc

- **Anchor:** `Toussaint (59:08)`
- **Hold:** through 01:00:44
- **Type:** the manuscript's own annotated 1913–2020 wealth-share chart, redrawn
- **Content:** matches `Paper/The_Original_Power.tex:2687` (Fig.
  elite_wealth_accumulation) exactly — Great Compression band (1935–1973),
  Kernel Recompile band (1973–2020), 1965 CRA→War on Drugs marker, 2020 endpoint
  approaching the 1929 Gilded Age peak.
- **Note:** `[data]` Piketty-Saez-Zucman/WID. This chart carries the three-part
  Great Compression rebuttal — do not simplify it to just the headline decline
  without the recovery half.

## G-66 — Three modes, methodological note

- **Anchor:** `Emmanuel Theodore (01:01:10)`
- **Hold:** through 01:03:15
- **Type:** three-panel card sequence, one per mode, each with its named
  historical anchor
- **Content:** Mode 1: Intentional Design (Zurara 1453 / Virginia 1705 / Three-
  Fifths Compromise). Mode 2: Autonomous Propagation (1960s redlining agent).
  Mode 3: Conscious Intervention (Ehrlichman, Atwater — both re-marked
  "reported"/"as narrated" consistent with G-32's caveat).
- **Note:** `[book]` `Paper/The_Original_Power.tex:2699–2708`.

## G-67 — Two objections answered

- **Anchor:** `Toussaint (01:03:19)`
- **Hold:** through 01:03:57
- **Type:** two-column rebuttal card
- **Content:** "Secret cabal?" → answered by Mode 2. / "No one chose this?" →
  answered by Modes 1 and 3.
- **Note:** `[book]` `Paper/The_Original_Power.tex:2710`.

## G-68 — HUD wrapper closes

- **Anchor:** `Aisha (01:04:00)`
- **Hold:** through 01:04:19
- **Type:** the G-19 HUD frame powers down / fades out
- **Content:** corner label reads "SCAN COMPLETE" before fading.
- **Note:** `[design]`. Closes the visual device opened at G-19.

## G-69 — Closing pull-back

- **Anchor:** `Emmanuel Theodore (01:04:57)`
- **Hold:** through end
- **Type:** the episode's two registers (an equation card and a plain quote
  card) shown side by side, then both fading to the sign-off card
- **Content:** the RLC governing equation (reused from G-36) beside a plain-text
  frame reading "one and the same object, at two different distances."
- **Note:** `[design]`, closing image for the episode's own final beat.

## G-70 — Sign-off card

- **Anchor:** `Toussaint (01:05:09)`
- **Hold:** through end
- **Type:** static, matches Episodes 1–2's sign-off card exactly
- **Content:** *Architecting the Operation* — Episode 3 — "Redefining Racism" —
  Open Source Republic.
