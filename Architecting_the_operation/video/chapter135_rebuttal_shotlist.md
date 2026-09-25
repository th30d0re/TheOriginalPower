# Chapter 135 / Question 9 reaction — Video Shot List (v2, reaction cut)

Companion to `../podcasts/chapter135_rebuttal_reply.md` and
`../../Paper/chapter135_rebuttal_video/citations.md`.

This replaces the v1 shot list (a standalone monologue). The piece is now a reaction
video: the source reel plays via the `The Reel` archive-engine turns (see
`Architecting_the_operation/archive/clips.yaml`, ids `reel_q1`/`reel_a1`/`reel_q2`/
`reel_a2`/`reel_close`), Emmanuel interrupts it four times, then delivers a longer
monologue once the reel finishes. During every `The Reel` turn, cut to the actual
source footage — no graphic needed there, the reel *is* the visual. The shots below
are the citation-card graphics that go over Emmanuel's own turns.

## Alignment procedure

Cue times are the script's source timestamps (real for the archive clips — they're
the actual registered clip lengths; estimated from the `emmanuel_theodore` calibrated
rate for the reaction/monologue turns). After the render:

```bash
.venv-voice/bin/python Architecting_the_operation/video/shotspec.py \
    Architecting_the_operation/video/chapter135_rebuttal_shotlist.md \
    --script Architecting_the_operation/podcasts/chapter135_rebuttal_reply.md \
    --manifest outputs/chapter135_reply/episode_manifest.json \
    --out Architecting_the_operation/video/specs/chapter135_rebuttal.json
```

## Provenance key

Same as v1: these are external sources, not manuscript citations, so every shot is
tagged `[source]` in its Note, which `shotspec.py` will flag as "no provenance tag" —
expected. The real citation is the card number in `citations.md`.

## Canvas & safe zone — this is a Reel, not a widescreen video

Every graphic below renders at **1080×1920 (9:16 portrait)**, not landscape. The
first generation pass (G-15 test) came back 16:9 and had to be redone — don't repeat
that. Per Meta's published Reels specs (confirmed 2026-09-23):

- **Top 14% (~270px):** reserved for username/audio label — keep empty.
- **Bottom 35% (~670px):** reserved for caption + audio track text — keep empty.
- **Bottom-right corner, deeper still (~40%/770px):** the like/comment/share/save
  button stack lives over the rightmost ~21% of the frame — keep that corner clearer
  than the flat bottom margin would suggest.
- **Each side, ~6% (~65px):** screen-edge buffer.
- **Net usable area:** roughly a 950×980px block, centered.

## Generated images — status (2026-09-23)

All 16 graphics were run through NotebookLM's Studio infographic generator (Gemini
under the hood), one text source per shot in the notebook at
https://notebooklm.google.com/notebook/e695c969-61c7-4e3a-961c-3a35e6a46499, saved to
`Architecting_the_operation/video/images/g02.png` through `g16.png` (no `g01.png` —
see below).

**Safe-zone reality check:** three separate attempts, including one with explicit
pixel-band instructions ("this region will be physically covered, do not draw in it"),
all still came back full-bleed edge-to-edge. This generator does not reliably respect
blank-margin instructions no matter how the prompt is phrased — treat that as a fixed
property of the tool, not something to keep re-prompting around. **The fix is in the
edit, not the generator:** scale each PNG to roughly 60–65% of the frame height and
center it over a solid or blurred backdrop when compositing, so the actual content
lands inside the safe zone regardless of what the source image does.

**G-01 is intentionally not AI-generated.** It's a freeze-frame annotation drawn over
the real paused reel footage (circling the actual "Yes on 9" signage), not a
synthesized scene — consistent with this pipeline's rule against generating imagery of
real events. Build it directly from the reel footage in the edit.

**G-04 was abandoned as an AI-generation target after two failed attempts.** Both
tries returned a meta-explainer *about* a minimal title card (headers like "Visual
Composition," "The Narrative Payoff") instead of the card itself — this generator
seems to specifically struggle with "produce literally nothing but three words"
requests. It's not worth a third round-trip: three words centered on a plain
background is a trivial text-tool job in any editor. Make it directly.

**G-02 needed one retry.** The first pass included an illustrated figure clearly
meant to read as Gov. Healey (feminine silhouette, blazer, crossed-out speech bubble)
— a fabricated depiction of a real, named public official, which this pipeline
doesn't allow regardless of style. The retry replaced it with a generic faceless
silhouette at a podium — acceptable, since nothing about it identifies a specific
real person. **Update, evening of 2026-09-23:** the v2 card's procedural body text
was rejected on review; G-02 was rebuilt as v3 with systemic-impact beats (Cards 17,
21, 23 — see the G-02 entry below and `g02_v3_source.md`) and regenerated the same
evening via the `nlm` CLI (source `989510c2`, artifact `99cc24f4`, portrait). The
v3 render is now `images/g02.png`; v2 is preserved as `images/g02_v2_backup.png`.

**Every other shot (G-03, G-05 through G-16) came back accurate and usable on the
first pass** — correct facts, correct framing, no real people, consistent dark-navy
flat-design style. That's a strong hit rate for one pass of prompting; the two misses
were specific and identifiable, not a sign the whole approach is unreliable.

**Batch v2, evening of 2026-09-23 — citation footers + QR placeholders.** G-05
through G-15 (excluding G-04) were regenerated via `regen_cited_cards.py` with a
printed "Sources:" line and a bottom-center QR placeholder box on every card, using
the per-card source texts now stored in `sources_v2/`. Every v1 render is preserved
as `images/gNN_v1_backup.png`; source/artifact IDs are in
`work/regen_cited_cards.jsonl`. Spot-checked after the run: G-06, G-10, G-12, G-13,
G-15 all factually accurate with footers and QR boxes present. G-05, G-07, G-08,
G-09, G-11, G-14 went through the same pipeline uninspected — eyeball them before
compositing. G-06's Boston-HOLC-map ⚠ was cleared later the same evening: the 1938
scan is pulled and verified (see the G-06 entry), so the map excerpt can be
composited into this card in the edit.


**Corrections pass, 2026-09-24 (this section supersedes the notes above where they
conflict):**
- "71 days" is **69 days** (Jul 25 to Oct 2). "Public convenience" was dropped as a
  stated reason; the reported reasons are "without delay" (AP) and time for agencies
  and municipalities to prepare (NBC Boston). Audio, script, Card 15 and G-10 all
  updated.
- "White registration barely moved" (Louisiana) was wrong: 164,088 (1897) to 125,437
  (1900), about -24%, after dipping to 74,133 in 1898. Script line, Card 16 and G-11
  corrected. Also fixed G-11's mislabeled years (1897 to 1900, not 1898 to 1901).
- **G-10 and G-11 are HTML-built cards** (`cards_html/`, headless Chrome to 1080x1920
  PNG), because NotebookLM's infographic generator failed four consecutive times on
  2026-09-24 (likely a daily quota; three failures were on the full source, one on a
  minimal source). Stale AI renders are kept as `g10_v2_stale_71days.png` and
  `g11_v2_stale_whitebarelymoved.png`. To re-render after editing the HTML:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1920
  --screenshot=images/g10.png file://$PWD/cards_html/g10.html`.
- **Two small known flaws in AI cards, not yet regenerated (generator blocked):**
  G-14's live-fire line is cut off ("Required for all new LTC applicants starting."
  with no date; should read August 1, 2024), and G-02's bottom panel labels the
  Ruger Mini-14 "Post-2024," which is muddled (the Mini-14 was never covered). Also
  G-02's 56%/48%/16% Pew figures were not independently re-checked in this pass.
- Reviewed by eye this pass: G-02, G-05, G-07, G-08, G-09, G-11, G-14 (all
  otherwise accurate); G-10 rebuilt.

Every shot's "Content" field below should be read as "arranged inside that centered
block," stacked vertically rather than side-by-side where the v1 landscape draft
assumed horizontal layout (G-15, G-12 particularly — both were designed as two-things-
side-by-side and need to become two-things-stacked, or shrunk to fit a square, for
portrait).

---

## G-01 — The wall behind them

- **Anchor:** `Emmanuel Theodore (00:15)`
- **Hold:** through 00:27
- **Type:** freeze-frame callout, drawn on the paused reel frame itself
- **Content:** Circle or highlight the "YES on 9 / FOR A SAFE MA" posters visible
  behind Healey and the interviewer. Caption: "Filmed at a Yes-on-9 press event."
- **Note:** `[source]` citations.md Card 9. This is the strongest single visual in
  the piece — it was confirmed by direct frame inspection, not inference. Don't
  undersell it with a small caption; this deserves the full freeze-frame treatment.

## G-02 — What a yes/no vote actually does

- **Anchor:** `Emmanuel Theodore (01:25)`
- **Hold:** through 01:37
- **Type:** title card, headline + three impact beats + citation footer (v3)
- **Content:** Headline: "A YES vote keeps Chapter 135 — including the expanded
  assault-weapons definition." Then three beats:
  1. The cutoff: "Owned before Aug 1, 2024? You keep your AR-15. Buying after?
     Banned outright."
  2. Who sits on which side: "Who already owns: white men 48%, nonwhite women 16%
     (Pew 2017). Who's buying next: 56% of Black non-owners see themselves owning a
     gun — the highest of any group (Pew 2023)."
  3. What the locked-out buyer gets: "The legal alternative fires the same round.
     The banned 'features' are the adjustability — the stock and grip geometry that
     lets a smaller shooter fit the rifle."
  Footer: "Sources: Pew Research 2017/2023 · Acts of 2024, Ch. 135 · mass.gov" plus
  a QR placeholder (QR composited in the edit, bottom-center, clear of the Reels
  button stack).
- **Note:** `[source]` citations.md Cards 2, 4, 17, 21, and 23. v3 (2026-09-23)
  replaces the procedural two-column layout — the systemic-impact version. Full
  generation brief for NotebookLM / ChatGPT / Arrow 2.0:
  `Architecting_the_operation/video/g02_v3_source.md`.

## G-03 — The question that wasn't asked

- **Anchor:** `Emmanuel Theodore (02:03)`
- **Hold:** through 02:07
- **Type:** build, contrast
- **Content:** Left: "What should schools/communities/mental health do?" (asked).
  Right, greyed out or with a strike-through until the reveal: "What should the
  *government* do?" (never asked).
- **Note:** `[source]` citations.md Card 9 (the reel itself,
  https://www.instagram.com/reel/DdoZBRXIbK5/). This is a close read of the reel's own
  transcript, not an external claim.

## G-27 — Intersectionality, defined

- **Anchor:** `Emmanuel Theodore (02:42)`
- **Type:** title card, two items
- **Content:** Coined by Kimberlé Crenshaw in 1989 ("Demarginalizing the Intersection of Race and Sex," University of Chicago Legal Forum); DeGraffenreid v. General Motors (E.D. Mo. 1976): Black women challenged layoffs and the court allowed a race claim or a sex claim, not a combination.
- **Note:** `[source]` citations.md Card 28. Sets up the later intersectional-harm line at 11:11.

## G-04 — Grandfather clause, teased

- **Anchor:** `Emmanuel Theodore (02:53)`
- **Hold:** through 02:59
- **Type:** text callout, no elaboration yet
- **Content:** "Grandfather clause." Hold it plain — the payoff comes at G-12/G-13.
- **Note:** `[design]` — a teaser, not a claim; nothing to cite. The claim it sets up
  is sourced at G-11 and G-12.

## G-23 — New England firearm homicide

- **Anchor:** `Emmanuel Theodore (04:41)`
- **Type:** stat bars, six states
- **Content:** Firearm homicide per 100,000, 2024 (crude): NH 0.8 (Giffords F), ME 1.1 (C+), RI 1.1 (A-), MA 1.4 (A), CT 1.9 (A), VT 1.9 (B-), each with its poverty rate.
- **Note:** `[data]` Paper/data/gun_laws_new_england/ (RESULTS.md, states.csv). NH and VT counts are 11 and 12 deaths; rates are crude, not age-adjusted.

## G-24 — Poverty tracks firearm homicide

- **Anchor:** `Emmanuel Theodore (04:43)`
- **Type:** scatter plot with the two coefficients
- **Content:** All 50 states + DC: poverty vs firearm homicide r = +0.72; Giffords law rank vs firearm homicide r = +0.29, and about zero after controlling for poverty and inequality.
- **Note:** `[data]` Paper/data/gun_laws_new_england/RESULTS.md and Paper/figures/gunlaws_ne_scatter_poverty.png.

## G-25 — What RAND's reviews find

- **Anchor:** `Emmanuel Theodore (04:44)`
- **Type:** title card, two items
- **Content:** Child-access prevention laws: supportive evidence they reduce firearm homicides and self-injuries among youth. Background checks: moderate evidence they reduce firearm and total homicides.
- **Note:** `[source]` citations.md Card 26.

## G-28 — Safe storage covers every owner

- **Anchor:** `Emmanuel Theodore (04:46)`
- **Type:** title card, three items
- **Content:** G.L. c.140 s.131L: firearm in a locked container or with a tamper-resistant lock unless under the owner's control; applies with or without minors in the home; standard-firearm penalty $1,000 to $7,500 or up to 1.5 years in jail.
- **Note:** `[source]` citations.md Card 30.

## G-29 — Background checks already run

- **Anchor:** `Emmanuel Theodore (04:47)`
- **Type:** title card, two items
- **Content:** Dealer sales: Form 4473 and a federal NICS check. Massachusetts private sales: only to a license holder, through the state's electronic registration system.
- **Note:** `[source]` citations.md Card 31.

## G-05 — Neighborhood disadvantage vs. poverty

- **Anchor:** `Emmanuel Theodore (04:07)`
- **Hold:** through 04:18
- **Type:** bar comparison
- **Content:** "~50-point gap in gun-violence exposure: high- vs. low-disadvantage
  neighborhoods" next to a much smaller bar: "5–10 points: household poverty alone."
- **Note:** `[source]` citations.md Card 10.

## G-26 — The 1938 redlining map and today's shootings

- **Anchor:** `Emmanuel Theodore (04:34)`
- **Type:** map with the rates by grade in the caption
- **Content:** Boston's 1938 HOLC grades with 2019-2025 shooting victimizations plotted; D 3.14, C 3.12, A and B 0.43 per 10,000 residents per year.
- **Note:** `[data]` citations.md Card 27; Paper/data/spatial/boston/RESULTS.md. Rate ratio C and D against A and B about 7 (95% intervals 4.07 to 14.86). The tract-level model does not separate the 1938 grade from later poverty and racial composition; the second spoken line states that limit.

## G-06 — Lead, redlining, and the timeline they share

- **Anchor:** `Emmanuel Theodore (04:18)`
- **Hold:** through 04:40
- **Type:** two-part card
- **Content:** "Reyes (2007): leaded-gasoline phase-out tied to a generation-later
  drop in violent crime." Paired with a Boston HOLC redlining map excerpt (Roxbury/
  Dorchester graded lower).
- **Note:** `[source]` citations.md Card 11 — ⚠ **cleared 2026-09-23**: the actual
  1938 Boston HOLC scan is pulled and verified (`images/holc_boston_1938_scan.jpg`,
  composite crop `images/holc_boston_1938_roxbury_dorchester.jpg`). Roxbury corridor
  graded D (red, zones D8/D9), Dorchester C (yellow, C8–C13), read directly off the
  scan. Composite the crop into this card in the edit with a "Mapping Inequality,
  University of Richmond" credit. Standing caveat holds: the redlining→lead→crime
  connection is the video's own argument; don't caption it as a proven
  Boston-specific study.

## G-07 — Baltimore: what actually worked

- **Anchor:** `Emmanuel Theodore (04:48)`
- **Hold:** through 04:55
- **Type:** stat card
- **Content:** "Baltimore homicides: 261 (2023) → 201 (2024), −23%. Credited to the
  Group Violence Reduction Strategy."
- **Note:** `[source]` citations.md Card 12.

## G-08 — NYC: what actually worked

- **Anchor:** `Emmanuel Theodore (05:04)`
- **Hold:** through 05:12
- **Type:** stat card
- **Content:** "NYC shootings down 3 years running. NYPD credits hot-spot policing
  and targeted enforcement against illegal guns."
- **Note:** `[source]` citations.md Card 13.

## G-09 — Article 48: how a referendum is supposed to work

- **Anchor:** `Emmanuel Theodore (05:51)`
- **Hold:** through 06:15
- **Type:** flow diagram, three steps
- **Content:** Law passes → 90-day clock starts → certified referendum petition
  stays the law until voters decide. Then a fourth box, in a different color:
  "UNLESS: emergency preamble."
- **Note:** `[source]` citations.md Card 14.

## G-10 — The timeline

- **Anchor:** `Emmanuel Theodore (06:23)`
- **Hold:** through 06:56
- **Type:** vertical timeline, this is the richest graphic in the cut
- **Content:** Jul 25, 2024 (signed) → Oct 2, 2024 (emergency preamble, "69 days
  later"; stated reasons "without delay" and time for agencies to prepare) → Oct 23,
  2024 (law's own original effective date) → Oct 2024 (93,229 signatures submitted)
  → Nov 22, 2024 (78,707 verified). Footer note on Article 48's stay.
- **Note:** `[source]` citations.md Card 15. Give this the longest hold of any
  graphic in the video if time allows — it's the evidentiary core of the "manufactured
  emergency" argument, and it's the one a hostile viewer will fact-check first.
  **Built as HTML, not AI-generated** (`cards_html/g10.html`, rendered with headless
  Chrome to `images/g10.png`): the NotebookLM generator failed four times in a row on
  2026-09-24, and the AI v2 render still said "71 days" and "public convenience".
  The stale render is kept as `images/g10_v2_stale_71days.png`.

## G-11 — Grandfather clauses, then

- **Anchor:** `Emmanuel Theodore (07:11)`
- **Hold:** through 07:35
- **Type:** stat card with a quote
- **Content:** Louisiana, 1898: cutoff Jan. 1, 1867. Black registration 130,344 →
  5,320 (three years). White registration: down ~24% (164,088 to 125,437, 1897 to 1900). Quote: *"racially neutral on
  its face"* — Guinn v. United States (1915).
- **Note:** `[source]` citations.md Card 16.

## G-12 — Grandfather clauses, now

- **Anchor:** `Emmanuel Theodore (07:46)`
- **Hold:** through 08:20
- **Type:** side-by-side, two identical rifles
- **Content:** Two identical rifle icons. Left, dated "Owned before Aug 1, 2024":
  "Grandfathered: you keep it." Right, "Acquired after": cannot be legally
  acquired; first offense carries a $1,000 to $10,000 fine or 1 to 10 years'
  imprisonment (G.L. c. 140, § 131M). Caption: same gun, only the date differs.
- **Note:** `[source]` citations.md Cards 17 and 25 (penalty). This is the equal-protection argument in
  one image; keep it uncluttered.

## G-13 — Who had guns, who's getting them, and the two-year lag

- **Anchor:** `Emmanuel Theodore (08:33)`
- **Hold:** through 09:47
- **Type:** timeline build, this is the second-richest graphic in the cut
- **Content:** "2020: Black gun buyers +58%. 2021: Black women gun owners +87%
  (NSSF)." Then a gap on the timeline labeled "Massachusetts: still 'may issue' for
  handguns." Then "June 2022: Bruen forces MA to 'shall issue.'" Caption underneath:
  rifles (FID card) were already close to automatic; a handgun (LTC) needed a police
  chief's personal sign-off until Bruen — a two-year state-specific lag behind a
  national trend.
- **Note:** `[source]` citations.md Cards 18, 19, and 22. The two-year gap between
  the 2020 national surge and the June 2022 Bruen ruling is the point of this graphic
  — don't compress it into a single beat, the gap itself is the evidence.

## G-14 — What it costs to get one

- **Anchor:** `Emmanuel Theodore (09:56)`
- **Hold:** through 10:17
- **Type:** receipt-style card
- **Content:** "$100 state application fee + $100–150 mandatory live-fire course."
- **Note:** `[source]` citations.md Card 20.

## G-15 — AR-15 vs. Mini-14

- **Anchor:** `Emmanuel Theodore (10:17)`
- **Hold:** through 10:58
- **Type:** side-by-side comparison
- **Content:** Two rifle silhouettes, same caliber label (5.56/.223) on both.
  Left: "AR-15 — BANNED." Right: "Ruger Mini-14 — not covered (named by the MA AG)."
  Caption: the difference is a feature list, not lethality.
- **Note:** `[source]` citations.md Card 21.

## G-22 — The roadmap

- **Anchor:** `Emmanuel Theodore (03:03)`
- **Type:** title card, six numbered items
- **Content:** "What the reel skipped": what drives violence; what works; the emergency preamble; the grandfather clause; who this law locks out; the feature ban.
- **Note:** `[design]` orientation card for the spoken roadmap line; states no facts, so no citation card. Each later card carries its own source and QR.

## G-17 — The law she never names

- **Anchor:** `Emmanuel Theodore (03:04)`
- **Hold:** through 03:50
- **Type:** title card
- **Content:** "Chapter 135 of the Acts of 2024 — An Act Modernizing Firearm Laws (House Bill 4885). Signed July 25, 2024. In effect immediately by emergency preamble."
- **Note:** `[source]` citations.md Card 1.

## G-18 — Boston is gentrifying

- **Anchor:** `Emmanuel Theodore (03:50)`
- **Hold:** through 04:00
- **Type:** stat card
- **Content:** "Boston: 3rd most intensely gentrified city in the U.S. (NCRC, 2013-2017). Gentrifying tracts average 77% people of color. Roxbury and Dorchester are among the neighborhoods affected."
- **Note:** `[source]` citations.md Card 24. States the study's findings only; the "priced out" framing is the speaker's own.

## G-19 — What the research points to

- **Anchor:** `Emmanuel Theodore (05:29)`
- **Hold:** through 05:51
- **Type:** title card, three items
- **Content:** Neighborhood disadvantage (about a 50-point gap in exposure, versus 5 to 10 points for household poverty); lead exposure (Reyes 2007); redlining (Boston's HOLC map, Roxbury graded Hazardous).
- **Note:** `[source]` citations.md Cards 10 and 11. Starts after the opinion line about reparations (05:24), which takes no citation card.

## G-20 — Before and after Bruen

- **Anchor:** `Emmanuel Theodore (09:37)`
- **Hold:** through 09:56
- **Type:** compare card
- **Content:** Before Bruen (to June 23, 2022): a handgun license (LTC) needed the police chief's approval and a "good reason"; rifles and shotguns (FID) had no such test. After Bruen: the LTC is issued unless the applicant is disqualified; the FID is unchanged.
- **Note:** `[source]` citations.md Card 22 (also Card 19).

## G-21 — Black women among the fastest-growing owners

- **Anchor:** `Emmanuel Theodore (10:50)`
- **Hold:** through 11:22
- **Type:** title card, two figures
- **Content:** "+87% gun ownership among Black women (NSSF, 2021)." "+58% Black gun buyers in 2020 (NSSF/CNN)."
- **Note:** `[source]` citations.md Cards 18 and 22. Card 18's caveat applies: one of the fastest-growing segments, not verified as the single fastest.

## G-16 — Close card

- **Anchor:** `Emmanuel Theodore (11:22)`
- **Hold:** through end
- **Type:** title + sources card
- **Content:** "Question 9, Nov. 3, 2026 — YES keeps Chapter 135. NO repeals it."
  Then: "Sources for everything in this video: [link to published citations deck]."
- **Note:** `[source]` citations.md Card 2 (Question 9 yes/no mechanics) — the "check my work" card. Same requirement as v1: don't ship
  without this resolving to something the audience can actually open.

---

## Editorial notes carried over from research

- Two spoken lines are the speaker's own stated opinion, not a sourced claim: "that's
  not how a democracy is supposed to work" (06:56) and "the real fix is reparations"
  (05:24). Don't put a citation card under either one — captioning an opinion as if
  it were sourced undercuts every card around it.
- G-06 and G-10 both carry a ⚠ from citations.md. Clear those before this goes public;
  they're the two most checkable claims in the piece and the ones most likely to get
  a "well, actually" in the replies.
