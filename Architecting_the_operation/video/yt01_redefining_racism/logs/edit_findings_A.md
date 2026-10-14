# Part A editing findings

Model: GPT-5.6 Sol. Session date: 2026-10-14.

## What was requested

Complete the interrupted accuracy and style pass over segments 00–07 in `drafts/part_A.md`. Check every claim against `BRIEF.md` and Chapter 2, preserve required coverage, remove overclaiming language and repeated turns, and retain one pass through the Segment 07 runtime-layer table.

## Factual corrections

| Segment | Draft said | Chapter says | Correction and source |
|---|---|---|---|
| 01 | The Elite sits atop a pyramid. | The chapter defines a five-tier operational hierarchy. | Changed “pyramid” to “hierarchy.” TeX lines 1623–1627. |
| 01 | The Puppet Class writes rules that make extraction legal. | The Puppet Class translates Elite interests into law and policy. | Replaced the unsupported gloss with the chapter’s wording. TeX lines 1623–1627. |
| 01 | The Enforcement Class is the physical mechanism of the state. | The Enforcement Class physically actuates extraction and the boundary. | Attached the tier to extraction. TeX lines 1623–1627 and 1673–1677. |
| 01 | The suppression allocation comes from generic Out-group extraction. | The opening specifies racialized Out-group extraction. | Restored the racialized qualifier. TeX lines 1623–1627. |
| 01 | Autonomy restriction “heavily polices” the Out-group. | The chapter says it constrains Out-group freedom and preserves In-group freedom. | Removed the unsupported intensity claim. TeX lines 1627–1630. |
| 01 | Selective empathy treats In-group suffering as a crisis and Out-group suffering as a natural consequence of identity. | Selective empathy validates In-group suffering and dismisses or pathologizes Out-group harm. | Removed both unsupported additions. TeX lines 1629–1631. |
| 01 | The equations function “exactly” like formal logic and a later turn repeated the 146-case count. | They function as precision-forcing devices, as formal logic does in philosophy; calibration covers 146 anchor cases across 146 events. | Restored the qualifier and consolidated the count. TeX lines 1634–1638. |
| 02 | The subset sign was described as a sideways U. | The chapter uses the subset relation for E inside I; a union receives the U-shaped description in the primer. | Removed the misleading shape description. TeX lines 1623–1624 and 1664–1671. |
| 02 | A disjoint union was said to place everyone in one component. | Disjointness prevents overlap; full coverage comes from the partition equation. | Limited the claim to elements of the stated union. Standard notation allowed by the Segment 02 exception. |
| 03 | O was called the primary Out-group. | O is the full Out-group; O sub racialized is its primary extraction layer. | Corrected the set names. TeX lines 1682–1689. |
| 04 | The racialized Out-group had “consistently” expanded. | The chapter states that it has expanded over time. | Removed the unsupported consistency claim. TeX lines 1764–1767. |
| 04 | The racial In-group broadly receives the status-wage stake. | The public and psychological wage is granted to the Buffer Class, identified here as I minus E. | Attached the stake to the Buffer Class. TeX lines 1767–1770. |
| 04 | The architecture note described the book as measuring structural mechanisms. | The book analyzes design principles and does not measure magnitudes of suffering. | Replaced the measurement claim with the chapter’s scope. TeX lines 1773–1777. |
| 05 | Elite demand creates the system, which manufactures prejudice. | Elite economic interests produce systemic racialization, which cultivates interpersonal prejudice. | Restored the named terms and causal sequence. TeX lines 1797–1804. |
| 07 | The runtime table read uppercase Sigma and Delta as unqualified lowercase names. | The table uses uppercase Sigma sub sup and uppercase Delta of t. | Changed the spoken readings to “capital sigma” and “capital delta.” TeX lines 2001–2007. |

## Added items

No required content was missing. The pass corrected existing coverage and preserved Equations 2.1–2.6, Figures 2.1–2.3, Table 2.1, Definition 2.3, the named citations, and all required precision qualifiers.

## Repetition and template cuts

- Consolidated the duplicated 146-case explanation in Segment 01.
- Reduced the three-turn flattening-error recap in Segment 03 to one direct statement.
- Reduced the architecture-and-phenomenology recap in Segment 04 to two turns.
- Removed a repeated feedback-loop explanation in Segment 05.
- Removed the second row-by-row summary of the runtime-layer table at the end of Segment 07.
- Removed the repeated Figure 2.3 hierarchy walk and a templated judicial-row restatement.
- Replaced recurring “the sentence it says” constructions with direct equation readings.

## Ambiguities

1. The embodied-runtime row lists capital Delta of t. The adjacent canonical variable map omits its definition. The script reads the symbol and avoids assigning it an unsupported mechanism.
2. The chapter writes E subset I. The four-tier refinement makes E a strict part of I, while mathematical publishing conventions vary on whether the printed subset sign itself implies strictness.
3. `BRIEF.md` requires the orthographic view from below. Chapter 2 prose omits that camera construction. The narration retains it as a binding brief item.
4. The dictionary hierarchy is presented in the chapter as typical and carries no named dictionary survey. The script preserves that limited framing.

## Challenges encountered

1. The prior pass had expanded most required explanations, so the remaining task required separating useful detail from repeated paraphrase.
2. Several scope errors were small vocabulary shifts, including state versus extraction and lowercase versus uppercase spoken symbols.
3. The checker evaluates a complete 23-segment script, so its missing Segment 08–22 references are expected for this partial file.

## Validation

- `check_script.py`: 229 turns, 8 ordered segments, 5,077 words, monotonic timestamps, no long-turn warning, and no unspeakable-symbol error.
- Expected partial-file errors remain for Segments 08–22 and their equation and figure references.
- The sole contrast warning is the permitted factual evidence boundary: human studies do not justify genetic inheritance claims about cruelty or innocence.
- `tools/check_antithesis.py`: no banned constructions.
- The explicit banned-phrase search returned no matches.
- An independent read-only review identified eight remaining issues; all eight were resolved.
- Repository-wide `make check-prose` reached 104 CERTAIN findings in pre-existing modified files outside this two-file dispatch. The targeted two-file check passed.

## Next ideas

1. Re-time Segment 06 after its repeated Figure 2.3 turns were removed.
2. Confirm the intended meaning of capital Delta of t before final assembly.
3. Review the orthographic animation against its narration during shot-list production.
4. Run the complete-script checker after Parts B and C are assembled.
5. Verify TTS pronunciation of Ruiz-Narváez and Casa dos Escravos.
6. Audit cross-part terminology for capital Sigma, capital Delta, and capital Pi.
