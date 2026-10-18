# YT02 v2 — author feedback on draft 1 (2026-10-18)

Source: the author's listen-through of `outputs/YT02/video/preview/960x540/YT02_full_draft1.mp4`.
Script: `Architecting_the_operation/podcasts/YT02_what_racism_is.md` (19,120 words). Line numbers below refer to that file.

## A. Positioning (script and metadata)

1. **This becomes Episode 1 of the channel.** It is the hook. The Chapter 2 walkthrough (current YT01) becomes the
   follow-on for viewers who want to go chapter by chapter. Renumber line 1 ("episode 2") and line 2126
   ("watch Episode 1 ... What Racism Really Is").
2. **Attribution.** The narrator is the author of *The Original Power*. Lines 1 and 54 name only the
   Architecting the Operation series. This video releases before Architecting the Operation.
3. **Open with a roadmap.** Say what the episode covers before SEG 01 starts.
4. **Storytelling: state the problem and ask why, out loud.** Open on "the common definition of racism is wrong;
   here is why," then pose each question explicitly ("why do we assign racism to this?") before answering it.
   The through-line of the whole episode is to always ask why. (Phrase these without formulaic antithesis.)
5. **Order: established material first, then the book's new material.** Mark the boundary on air ("this is where
   the established literature ends"). The current SEG 05 material belongs before the five-tier hierarchy is
   introduced. Introduce the five tiers **once** (they are currently introduced twice).
6. **Define racism by its vector definition before referencing it** (Eq 3.1 / Eq 25.1 appear only at line ~1976,
   after earlier references).
7. **Before the complex-number math, say why the diagnostic tool matters** and what it lets us observe.

## B. Content additions and corrections

8. **Bias, defined from three angles.** Keep the sociological definition, and add the neurological view (bias as part
   of the brain's decision-making wetware, predictive priors) and the computer-science view (neural networks are
   modelled on neurons; trained weights carry bias; LLMs show emergent social bias that resembles human bias).
   Bias is a property of inference and is not inherently bad. Ground this in the book's Bayesian Defense
   (§ "The Bayesian Defense: Hardwiring the Priors", tex ~L2113): the book places the harm in an institutionally
   installed prior given excessive precision, and it locates none in the inference machinery itself.
   - Example: Black women's wariness of the medical system is a bias, and it is an *earned* bias. It is a prior
     updated on documented harm and on ongoing maternal-mortality disparity (cite CDC/NCHS figures). Contrast it
     with Π_race, the installed prior.
   - Precision note for the CS segment: a network's "bias term" is an offset parameter. Social bias in LLMs comes
     from weights trained on human text. Name both and do not conflate them.
9. **Bring the Bayesian Defense into this episode**, since the RLC circuit is already in it.
10. **Material-wage calibration.** Line 1336 says "historical placement remains qualitative until a dataset supplies
    calibrated values." Revise it: firearms give a discrete, trackable class of concession (see Open question 2).
11. **1691/1705 indenture of mixed-race children (L1166):** add adult life expectancy in the 17th–18th-century
    Chesapeake so the length of the indenture lands. Source it (e.g. Walsh & Menard, "Death in the Chesapeake").
12. **Virginia slave codes spread to other colonies.** Add the policy-diffusion point ("a law passes in another state,
    then your state passes an almost identical one"). It happens today with gun law and abortion law. The system is
    functioning as designed.
13. **Jim Crow cost spike (L1462, Dudziak):** name the role of newly independent African nations on the world stage
    in threatening U.S. legitimacy. It is an instance of global Black solidarity.
14. **Atwater:** use the 1981 Lamis quote verbatim, with the tape audio, as in YT01 (L1482–1486 currently paraphrase).
15. **Case studies: say what the data licenses.** After each result, state plainly the boldest claim the data supports.
16. **Jevons Paradox (L1434):** add an on-screen definition card. Do not narrate it.
17. **Compulsory militia service** after the Buffer Class received the right to bear arms is a psychological wage
    tied to firearms. See Open question 2.
18. **Phasor axis disclaimer (L1248–1253):** make it exact. See Open question 1.

## C. Audio / pronunciation

19. "cognitive" glitches (tripartite division section, L176 area).
20. "Equation 2.19" is read as "two point nine … tine". Audit every two-digit equation number (2.10–2.19,
    22.2, 25.1, 0.15, 0.16, …) and write them as words in the TTS text.

## D. Visuals

21. **Dashboard schematic border (Figma).** In the inductive-coupling pair on the right side, the inductors face the
    same direction. They must face opposite directions, sit closer together, and match the left side's spacing.
    The left side is correct.
22. **One consistent pyramid** across the episode (several variants are in use now).
23. **First tier walk-through:** the adjacent Out-group is cut off at the frame edge.
24. **Math must teach.** Use the manimgx term-highlighting pattern from YT01: highlight each part of an equation
    as it is explained.
25. **RLC sequence.** Introduce each component in this context (resistor, inductor, capacitor), show the circuit,
    show the damped waveform on an oscilloscope, then show the equation. Then hold circuit + oscilloscope +
    equation together, varying terms and highlighting each one. This uses existing YT01 assets.
26. **Set introduction:** the text under the sets is not visible.
27. **Union glyph.** Cards S02-13, S03-12, S03-25, S03-30 use `\sqcup` (⊔). The book writes disjoint union as
    `\dot\cup` (∪ with a dot, tex L1654), as the earlier videos did. Switch every card to `\dot\cup`, and introduce
    each symbol (∪ with a dot, ∩, ∅, ∈, ⊂, \) on screen the first time it appears.
28. **Orthographic illusion (SEG 04)** is broken: animations clash, some do not run, and the camera rotation was
    stretched across the full 155 s, so it moves very slowly. A cream panel covers the left half mid-rotation.
    Re-cue it so each move is short and lands on its word.
29. **Overlay collisions (manimgx scenes).** Screenshots: S09-01 and S09-36 (wage phasor), S12-05 (interference engine).
    Lower-third captions ("VIRGINIA · MECHANICAL QUESTION", "NO INVENTED HISTORICAL θ",
    "NOVEMBER 1787 · MADISON · FEDERALIST No. 10") land on top of the axis labels and the chapter labels. The
    readouts (Φ_load, ρ_τ) overlap the Quadrant II label, and "PSYCHOLOGICAL STATUS" overlaps the θ range label.
    Give the scene's labels and the captions separate zones.
    The wage-phasor equations ψ_m = |W|cosθ and ψ_s = |W|sinθ should animate with term highlighting.
30. **Equation 2.5 card** (screenshot 1): the title and the "…AL PROTECTION · INTENT TEST" line are clipped off the frame.

## E. Open questions (author decisions)

1. **Axis convention.** Should the material axis be reversed so that extraction points up, toward the Elite?
2. **Firearms as a wage calibration.** Can the complex wage be calibrated on firearms?
3. **Gender-domain projection.** Does the downward racism vector resolve under the Theodore transform into the
   gender domain?

See the chat reply of 2026-10-18 for the analysis of each one. Record the decisions here before script v2 starts.

## F. Author decisions (2026-10-18)

- **Axis: reversed, in both the book and the video.** Positive ψ_m (value delivered down to the governed) points down;
  extraction points up toward the Elite; ψ_s points right. This is the standard plane turned a quarter turn clockwise
  (screen (x, y) = (ψ_s, −ψ_m), i.e. ×(−j)), so magnitudes, angles and orientation are all preserved. That sentence is
  the on-air disclaimer, replacing L1248–1253. Quadrant II now sits upper-right. Redraw every phasor shot
  (SEG 09 manimgx, dashboard intro 8, era wage panels). Book edit: `Paper/MS_REVISION_axis_arms_BRIEF.md`.
- **Arms are a joint material + status wage.** Arms are the only class of property the Bill of Rights guarantees
  the right to keep by name. The Second Amendment bars the government and protects "the people", and the fight is
  over who counts as "the people" (Dred Scott; § 922(g)(1) plus War on Drugs felony disparities).
  - At 1705 the wage sits in the first quadrant, drawn near 45° and labelled illustrative (no invented θ).
  - Compulsory militia and patrol service is Quadrant II inside one institution.
  - Today both components erode together: the arms boundary with the Out-group fails (ψ_s), and rifle bans target
    anti-state capacity (ψ_m).
  - The kinetic channel is a two-series calibration anchor.
  Replace L1336 accordingly. The video follows the book text once Codex's revision is verified.
- **Symbols:** introduce each set symbol on screen the first time it appears; disjoint union is ∪ with a dot.

## G. Hero shot: building the complex-wage plane (manimgx, replaces the static axis cards in SEG 09)

One continuous manimgx scene that builds the plane on screen. Every beat lands on its narration word.
1. **Number line.** A `NumberLine` fades in with ticks −3…3. A dot slides to +2, then to −2: "one dimension, two directions".
2. **Second dimension.** A vertical line grows out of 0, and the line becomes a `ComplexPlane` with the standard textbook
   layout (real axis horizontal, imaginary axis vertical, labels Re and Im). The j label pops in as "j = √−1".
3. **A number becomes a vector.** Plot z = a + jb as a dot, then an arrow from 0 to it. The dashed projections onto both
   axes draw in, |z| and θ are measured from Re, and cosθ / sinθ highlight in the formula as each projection lights.
4. **Assign the variables.** `TransformMatchingTex`: z → W, a → ψ_m, b → ψ_s. The axis labels morph Re → "material ψ_m"
   (green) and Im → "psychological ψ_s" (gold), with each term of W = ψ_m + jψ_s highlighted as it is named.
5. **The quarter turn.** The whole plane, with arrow, labels and projections attached, rotates 90° clockwise
   (`Rotate(plane_group, -PI/2)`) on "we turn the plane a quarter turn". While it rotates, show "× (−j)" multiplying W,
   and a ghost copy of the old arrow fades out. Then hold: extraction now points up toward an Elite marker at the top
   edge, value delivered points down, and status points right.
6. **Invariants check.** Flash |W| and θ before and after with equal signs: "every length, every angle, same
   handedness". The quadrant labels slide into their new screen positions, and Quadrant II settles upper-right.
7. **Payoff.** Sweep θ from 0° to past 90°: the arrow swings from down, through right, to up-right, with the
   projections tracking live (`always_redraw`). Land on "Quadrant II: material extracted upward, paid in status".

Style: 1080p30, the YT02 palette, smooth `rate_func`s, no static text walls. Captions go in a reserved lower band
that never overlaps the plane. This is the episode's "showing off the math" moment, so build it to look like it.

## H. Primary-source imagery (author request, 2026-10-18)

When the narration quotes a law, opinion or dataset, show the actual page. Use public-domain scans only, and keep the
provenance (source URL, volume, page, access date) in `video/yt02/archive/SOURCES.md`.

Shot pattern (manimgx): the scanned page fades in, a slow push-in moves toward the clause, and a gold highlight sweeps
across the exact line as it is read, with the citation in a lower-left tag. Hold for at least 3 s. Never crop out the
page header or the page number, because they are the receipt.

Already on disk (`Paper/research/kimi_sources/`):
- Hening vol. 1 p. 226, Act X of 1639/40: "ALL persons except negroes to be provided with arms" (page images).
- FBI Expanded Homicide Table 8, 2021–2025 (render as a table, with the rifle row highlighted).

To gather (public domain):
- Hening vol. 3: the 1705 Servants and Slaves act, §XXXV.
- Hening vol. 5: the 1738 militia act, §V.
- *Dred Scott* 60 U.S. 393, pp. 416–417 (the "keep and carry arms" passage).
- *Cruikshank* 92 U.S. 542 (scan already in `Paper/research/ia_scotus_pdfs/`).
- The Zurara chronicle, Dum Diversas, the 1662 *partus* act, and the 1691/1705 codes.
- Federalist No. 10 (first printing).
- Library of Congress photos for Jim Crow, Birmingham and Selma (check the rights field on each item).
- The Atwater/Lamis tape (audio).

Look for an image for every primary source the script cites; a document on screen persuades more than a paraphrase.
