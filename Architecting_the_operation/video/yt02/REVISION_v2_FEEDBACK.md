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
