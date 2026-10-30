# YT02v2_ov author notes — 2026-10-29

Source: the author's spoken review of the **YT02v2_ov** episode in ScriptCast, which plays the OV
run clips on the episode clock. The OV episode is the standard from now on.

- Episode: `outputs/YT02v2_ov/`. Script: `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md`. OV shot list: `Architecting_the_operation/video/YT02v2_ov_shotlist.md`.
- **Turn N is the 0-based `turn_index` in `outputs/YT02v2_ov/episode_manifest.json`**, and the Nth `## S..` block in the OV shot list. Turn 72 is S02-07, and turn 247 is S08-33.
- `Architecting_the_operation/video/yt02/feedback/OV_turn_map_2026-10-29.md` lists every turn named below. Each entry gives its `turn_id`, shot, current Render and spoken text.
- **Anchor every edit by turn_id and spoken text.** Script edits renumber turns.
- Book authority: `Paper/The_Original_Power.tex`. Nobody edits `Paper/`. Where a note goes past the book, write `BOOK-UPDATE?` with the tex line, and let the author decide.

The notes cover roughly the first half of the episode (turns 0–350). G4 and G6 apply to the whole episode.

## Standing rules (whole episode, every future episode)

- **R1 Register.** Use high-school vernacular as the baseline. Go up to college register only where the precision is needed. Be as precise as the claim needs. When that precision is dense, restate it once in plain words. Never use a big word for its own sake.
- **R2 No question-begging.** Never ask a question about a term, tier or arrow before the viewer has met it.
- **R3 Say why it matters.** When a step pays off an earlier definition, say so explicitly. Viewers will not make the connection unprompted, even on a third viewing.
- **R4 Show, don't describe.** Recreate every figure in Figma and highlight the part under discussion. Give every equation an animation of what it represents (a graph, a 3D graph or a chart), plus what happens when each variable changes. Show every table, and graph it when the data can be graphed. Render real subscripts and superscripts, never `_`.
- **R5 Platform.** Everything is 100% Figma, except the five-tier cone, which stays in manimgx. Cone shots get a border. They use the same background colour as the Figma frames. Their circle dimensions match the Figma frames, so a manim→Figma handoff looks continuous.
- **R6 Person.** Avoid first person outside the opening.
- **R7 Derive.** The book is not scripture. Deriving behaviour the equations imply is welcome when it is labeled as derived, e.g. RLC parameter changes.
- No formulaic antithesis (AGENTS.md), and that includes on-screen text.

## Notes

**G1 — Turn 72, S02-07 (`efe6af7b824b3692`).** The picture shows the Equation 4.2 Virginia 1691 boundary: the disjoint union and the null-set intersection of I and O. The narration is about formal institutionalization. The OV shot list maps a stale card (`cards/S02-13.json`) here. Fix the picture, then audit the OV card mapping for the same kind of drift.

**G2 — Turn 78 (`a3dbcab9e23797d0`).** "Why pause before stating the causal arrow?" begs the question, because the causal arrow has not been introduced. Delete the line or rewrite it.

**G3 — Turn 82 (`07a5ebb43195142c`).** It repeats turn 79. The departure from the conventional paradigm already happened at 79, where racism is classified only as a system. That is a new claim, and it can still be derived from the traditional literature. Keep the substance and say it once, more elegantly.

**G4 — Register audit, whole script (R1).** Example, turn 84 (`183ec8cf49df263a`): "a formal statement of directional causation designed to be tested against historical sequencing." Say it simply, e.g. as a formal claim with a direction that can be tested against the historical order. Audit every turn.

**G5 — Turns 98–100, Figure 2.2 (`c8a4cfdabb044e6c`, `2a0deb5b5c6527dd`, `88669e7f7aedee0f`).** The narration describes Figure 2.2 instead of showing it. Recreate Figure 2.2 in Figma: two solid forward arrows, with the dashed Reinforcing Feedback Loop arc underneath. Highlight each section as it is spoken. "This is not PowerPoint."

**G6 — Visual audit, whole episode (R4).** Inventory every figure, table and equation the episode names, and check how each is displayed and animated. Each equation needs a visualization and variable sweeps. Each table needs to be shown, and graphed if it can be.

**G7 — Turn 105 (`e86e41310cd4e4d9`), theory → history.** Before the switch, explicitly ask where anti-Black phenotypical prejudice began. The precise definitions built earlier now let us ask when these prejudices and biases started. This matters because "it has always been that way" is used against systemic accounts. Arguments built on the fallacy of folding racism, prejudice and bias into one word have been dismantled, but the episode never shows that it dismantles them. Do it here, and state why the separation of prejudice, bias, discrimination and racism matters.

**G8 — Falsifiable predictions table.** The row "Testable archival / qualitative claim" does not fit its row. Adjust the font or layout until it fits.

**G9 — Turn 117 (`fee6d621a9ecfaa2`).** "Why insist on a systems checklist before we name the tiers?" The viewer has not heard of tiers yet. Rewrite (R2).

**G10 — Reorder the build-up (turns ~117–193).** Keep turn 121, "What makes racism count as a system at all?" The author likes it. The new order:

1. definitions;
2. in-group and out-group;
3. Tajfel's minimal-group experiments. Today they sit at turns 145–146 (`2375d5c438abb062`, `6a34295d1e4219cd`). Move them back near the in-group/out-group definitions, as the experimental evidence for in-group/out-group theory, stated before the theory is expanded. This also fixes "Why start the ladder with Tajfel?", which begs the question.
4. a set-theory refresher: why sets, what a set is, Venn diagrams, disjoint sets, and how sets represent the in-group and out-group. Existing material: turns 150–151 (`6e45e116725a42ff`, `6919b2a099ee94a0`) and the `v2-S06-08` slides. Explain a set before any set appears on screen.
5. the in-group and out-group as sets (just I and O for now);
6. the orthographic illusion: coarse resolution and the binary (see G17);
7. the five tiers, with Equation 2.2, the refinement that becomes clear once the illusion breaks (turns 160–161, `95941864104ddc0b`, `8074f261e41ecd45`). The "why" has already been earned at this point, so drop "Why refine the In-group at all?".
8. set theory over the five tiers.

No equation is stated before it is shown.

**G11 — Turn 141, S05-24 (`6017b9e8036ac25d`), Equation 2.11 RLC.** Redraw S05-24 and its animation in Figma (it is manimgx today). Then sweep the parameters: raise or lower L, R and C, and show what happens to the damped response. The book may not go there. Derive it and label it as derived (R7).

**G12 — Cone shots for Equations 0.3, 2.1 and 2.2.**
- Show the five-tier cone in manimgx and highlight each tier as it is named.
- Every manim cone shot gets a border, zoomed in enough to fit. The background must match the Figma frames; it does not today.
- For the out-group decomposition: zoom to the top of the out-group so it reads as a circle, then hand off to Figma and decompose it with a pie-chart animation.
- The circle's dimensions must match exactly at the cut. The Figma style can morph after the cut.
- Keep the visual register cohesive with the complex-wage convention.

**G13 — Turn 182, Table 2.1 (`973d37e3a049e4b9`).** Use real subscripts instead of underscores. The superscripts already render; the subscripts do not.

**G14 — Turn 184 (`f596cbf44a15ea0e`).** For each level, e.g. "denial of systemic privilege", give an example of a popular public argument at that level.

**G15 — Around turn 193 (`ea7174ba77385db6`).** The tier decomposition switches to first person, which appears nowhere else. Fix it (R6).

**G16 — Enforcement tier history.** At first the Enforcement tier and the Buffer Class were synonymous, a four-tier hierarchy. The Enforcement tier was institutionalized after the 13th Amendment and its exception clause, as policing as we know it. The Buffer Class was no longer conscripted into slave patrols the same way, but could serve the same function, and be paid for it, through formal policing. The author says this is especially what the historical record shows in the South. Articulate it. Research first, and mark BOOK-UPDATE? if the book is silent.

**G17 — Orthographic illusion, turns 194–203 (`a2f5063440be3e08` … `cd0d010c78c151d3`), manimgx, bordered.**
- **New entry, turn 197.** Drop the left/right in-group/out-group layout. Open zoomed into the cone, so the viewer sees white on top and black on the bottom, split 50/50 along the horizontal. Label the In-group and Out-group with their set notation above and below. That is the coarse projection.
- **Turn 198.** Delete the narration "Rotate the image." Keep "the flat blocks separate into tiers" as the camera pulling back to reveal the cone.
- **Turn 199.** The camera moves to the out-group's position and looks up: white.
- **Pan downward.** The same move looking down: black. Today it is a different animation.

**G18 — Turn 200 (`94b9f78d780723c8`), more precise than the book, possibly BOOK-UPDATE?.** Many people in the out-group can see the Enforcement tier. Many can see the Buffer Class. Some can even see the Elite. The failure of the projection is a different one: without the framework, nobody can pin down where each member sits. Members also belong to the Buffer Class (the marginal in-group). They blend into other regions, even though the sets are disjoint. The discrete individuals rotate through structural positions.

**G19 — Turn 203 (`cd0d010c78c151d3`) animation.** The author calls the line brilliant. Pulse the Elite, Puppet and Enforcement tiers as one block, possibly merged into one slice: the control node. Show that the bottom two (marginal in-group and out-group) miss the control structure entirely.

**G20 — Audio.** Re-render turn 215 (`3809f4b7f0ee4c01`, an audio effect), turn 223 (`f11568aff8f736f4`, a glitch) and turn 327 (`8c624a021f9be379`, a bad stutter). Do it after the script pass, in the same render.

**G21 — Cinematic scenes: Nano Banana images, Figma for maps.**
- **225**: Antão Gonçalves, his ship, orders from Prince Henry to procure sea-wolf skins and oil, and his wish for promotion. A raiding party comes ashore, seizes two people and brings them back. This is the episode's first cinematic scene.
- **229**: the syndicate, men crowding together. A fleet of six caravels sails south; the map is Figma. The attack on coastal settlements, and the kidnapping of women and children.
- **231–233**: Nano Banana.
- **234**: a Figma map of the push south: Portugal, the routes, a military campaign.
- **235**: Nano Banana.
- **238–240**: the Pope issuing the bulls.
- **242**: Nano Banana.
- **248, 249**: quick ones.
- **284**: high-seas piracy.
- **294–296**: Nano Banana.
- **325**: Loving v. Virginia struck down. Prefer real archival images: search the repo's SCOTUS archive (`Paper/research/`) and public-domain sources first.

**G22 — After turn 236 (`f66836ca6674b549`), the firearms narrative.**
- Pause and dismantle the narrative that African states were primitive and lacked the technology for firearms.
- The author's claim: they had advanced metallurgy and could have made firearms. Their internal conflicts did not yet call for them. Europeans had the edge in that specific weapons technology. Firearms are the key destabilizer: they created a power vacuum.
- Foreshadow it at turns 234–235. Raiders first snatched people freely, then met organized resistance that inflicted heavy casualties despite firearms. That forced the switch to destabilization and a slaves-for-guns arms race.
- This dismantles "Africans sold themselves into slavery."
- It may already be in an Episode 3 deep dive; look there first. Fact-check everything.

**G23 — After turn 246 (`623341539ca77b3a`), Zurara.** Step back. Africans as one racial group, inferior, subhuman, beasts, technologically backward: that is Zuraran ideology carried to 2026. Tie it to the conflation just dismantled, general technological advancement read as firearm-specific advancement, a Zuraran conflation that persists today.

**G24 — Turn 247, S08-33 (`058e7216b599cade`).** The narration names separate dates, but the timeline shows one span. Show each step on the timeline: 1441, 1444 (syndicate and Lagos), 1452 and 1453. Then combine them into one span, "extraction before ideology".

**G25 — Turn 252 (`79306d1449b283e8`).**
- Go back to the in-group/out-group work and Tajfel. Once an out-group is excluded from the moral community, how badly can people treat it? That question leads into the zero-day exploit.
- Cover the exploit itself and what it does psychologically.
- Loop back to the Lagos spectators watching families separated (turn 232). Most were not disgusted, and the ones who were said nothing. Show how that justification starts.
- Take the psychological wage to that depth.

**G26 — Turn 257 (`1052dca74d05249b`), the cline.** Show it visually, with pictures: folate protection against vitamin D synthesis by latitude.

**G27 — After turn 261 (`026e2ea986cbbf30`), out of Africa.** The author still needs to research this. Humans evolved in Africa. Dark pigmentation was the first adaptation the first humans needed. Pigmentation changed with climate as people migrated. The irony: "we owe our humanity to our blackness". Africa's extreme genetic diversity makes lumping all Africans into one beastly group regressive, especially given how long African civilizations led European ones. Research it, report where it fails, and let the author check.

**G28 — Turn 327 slide (`v2-S09-43`, October 1705 Virginia Slave Codes).** Use subscripts instead of underscores, and regenerate the slide.

**G29 — Turn 331 (`98cbb21622bee3da`), statutes copied across states.** Add a Figma map of the United States showing the policies being copied. Optionally add states as experiments: a successful operation gets exported, so a failure like Virginia's stays local instead of central. Federalism and states' rights as the question of how to build a robust extraction system; after Bacon's Rebellion, many of those questions were answered quickly. Research the support (the Federalist Papers, and Brandeis's "laboratories" line) before it is spoken.

**G30 — Turns 341 onward, building the complex wage.** A Figma animation that physically shows the components (the number line and so on). It is a basic visual explainer to warm up the visual cortex before the geometry.

**G31 — Turns 343–345 (`23d776c709eb7d5b` … `f5a715548c800a6c`).** Turn 343's question is good. But the suppression allocation and the Du Bois wage were already introduced around turn 338 (`4966d617267f45ec`), and turn 345 restates them as if they were new. That is incoherent. Clean it up.

**G32 — Turn 350 (`6f57987c14083560`), the axes rotation.** The flipped axes are better now. Show the cross of axes itself rotating 90° clockwise, the lines turning with the arrow.
