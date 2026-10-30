# G_cinematic — cinematic scenes and maps for notes G21, G26, G29

Session: 2026-10-29. Figma file `6SPd7rWzwyvxHhIj4Cmb7a`, page "YT02v2 · Cinematic G" (page id `140:163`).
Clips live in `outputs/YT02V2/video/figma/` (1920×1080, 30 fps, h264), fetched with `fetch_clip.sh`. No existing clip was overwritten.
`G_research.md` did not exist during this session (only `G_research.agy.log`), so section 8 and section 10 are not applied. Re-check the maps and the illustration prompts once it lands.

## Credit spend and image route

- **Figma AI (Nano Banana via `generate_image`): 0 credits spent.** The single call (turn 225) was refused: `Insufficient Figma AI credits` (resets 2026-11-03T14:25Z).
- Per the orchestrator's re-route, the illustrations came from Gemini through `agy` (`gemini-3.8-flash-medium`, image-generator subagent, 1376×768 PNG each, one call per image, 6 in parallel). **11 of 12 generated on the first try, 0 regenerated.** Turn 294 (`chesapeake-bottom`) failed with `429 RESOURCE_EXHAUSTED` on `gemini-3.1-flash-image`; the quota resets about 2026-10-30T03:08Z. agy calls attempted: 13 (11 ok, 2 quota failures for 294).
- Images were placed with `upload_assets` (no AI credits), animated in Figma, exported with `export_video`. Figma rate-limits exports ("Too many video exports started"); export about 5 at a time with a minute between.
- PNGs: `Architecting_the_operation/video/yt02/figma/v2/assets_cine/<turn>-<slug>.png`.

## Delivered clips

| turn_id | Turn | Spoken text (start) | Figma node | Clip |
|---|---|---|---|---|
| `433fb3ab5452ab07` | 229 | "In fourteen forty-four, under the patronage of Prince Henry, merchants in the Algarve formed the Companhia de Lagos…" | `142:2` | `g-cine-229-fleet-map.mp4` (9.0 s) |
| `d13699ffd0668ddd` | 234 | "Immediately after fourteen forty-four, Portuguese raiders pushing south past the Senegal River encountered the organized military resistance of Wolof and Mandinka states." | `143:21535` | `g-cine-234-campaign-map.mp4` (8.0 s) |
| `1052dca74d05249b` | 257 | "The biological input supplied no natural binary. Julian Huxley called graded geographic variation a cline…" | `145:346` | `g-cine-257-cline-chart.mp4` (10.0 s) |
| `b19b89ab516124a7` | 325 | "The statute stood until Chief Justice Earl Warren and the United States Supreme Court struck it down in Loving v. Virginia on June 12, nineteen sixty-seven." | `143:28286` | `g-cine-325-loving-archival.mp4` (10.0 s) |
| `98cbb21622bee3da` | 331 | "Virginia's slave codes did not stay local. Colonies and later states copied statutory language…" | `143:24273` | `g-cine-331-statute-diffusion-map.mp4` (9.0 s) |

### Turn 229 — fleet map (Figma, programmatic)
- Six caravel icons leave Lagos on a dashed route along the Morocco/Sahara coast to the Arguin coast, staggered 0.3 s apart (`TRANSLATION_XY` keyframes). Lower third: "Lagos, Algarve · 1444".
- Data: Natural Earth 50m land (public domain), simplified (shapely tolerance 0.04°), equirectangular with cos(26°) scaling, imported as SVG. The route is schematic. Place coordinates are from general geography, not from a source.
- The narration for turn 229 also covers the syndicate crowd and the attack on coastal settlements. The map covers only the fleet sentence. Those two parts take the illustrations (scenes 2 and 3).

### Turn 234 — campaign map (Figma, programmatic)
- Portugal and Lisbon/Lagos, the dashed 1441–1444 route, an orange campaign arrow south past Arguin, and two resistance markers (Senegal River / Wolof states, Gambia River / Mandinka states) that scale in. Lower third: "Senegal River coast · after 1444".
- Same Natural Earth base and projection as turn 229. Marker positions are schematic. **The Mandinka marker at the Gambia River and the "organized armies" wording need the G_research check.**

### Turn 257 — cline chart (G26, Figma, programmatic)
- No openly licensed published figure was located, so I built the chart. It shows UV radiation falling and skin lightness rising with latitude 0–70°, a continuous gradient bar, and the folate/vitamin D explanation as three text blocks, plus a latitude scanner that sweeps across.
- **The curves are schematic.** Their shape follows Jablonski & Chaplin (2000), *J. Human Evolution* 39:57–106. I did not plot them from raw data, and the footer says so. For a data-faithful version, take the published R685/UVR values from that paper, or use the openly licensed PNAS 2010 Jablonski & Chaplin figure, after checking its licence.

### Turn 325 — Loving v. Virginia (archival)
- Real archival image used: page 6 of the *Transcript of Record*, Loving v. Virginia, No. 395, October Term 1966, U.S. Supreme Court. It shows the 1958 indictment ("cohabiting as man and wife, against the peace and dignity of the Commonwealth") and the January 6, 1959 judgment.
- Source file in the repo: `Paper/research/ia_scotus_pdfs/loving_v_virginia_1967.pdf` (PDF page 8 of 448), an Internet Archive scan (`micro_IA40386412_0091`) of the National Archives microfilm. Cropped copy: `Architecting_the_operation/video/yt02/archive/loving_395/loving_395_p6_crop.png`.
- Licence: a U.S. Supreme Court record is a government work, public domain; the National Archives catalog entry (identifier 7873519) is labelled "Public Domain, Free of Known Copyright Restrictions".
- No openly licensed photograph of the Lovings or the 1967 decision turned up. The widely used photos are Getty and Grey Villet/ICP, which are copyrighted. I generated no illustration for this turn.
- Motion: slow push and short pan on the page. Lower third: "Washington, D.C. · June 12, 1967".
- The clip shows the 1958–59 trial record, not the 1967 opinion text. If the author wants the opinion itself, `Paper/research/markdown_cases/loving_v_virginia_1967.md` holds the transcript text, and the opinion page can replace this crop.

### Turn 331 — statute diffusion map (G29)
- Natural Earth 50m admin-1 states (public domain), simplified (0.05°), equirectangular fit, west cropped at 100°W.
- **Checked against `G_research.md` §8 (final).** Pins and years: Virginia 1705 (origin, with the note "Bacon's Rebellion 1676"), North Carolina 1715 (VA 1705 → NC 1715), Maryland 1715 (dashed, marked as alignment with Virginia in the footer, since §8 says "regional sharing" and not copying), South Carolina 1696 · 1712 · 1740, Georgia 1755 (SC 1740 → GA 1755). A solid arrow from off-map Barbados 1661 points at South Carolina ("code copied to Carolina"). Title: "Barbados 1661 to Georgia 1755". The provisional footer is replaced by a sources line.
- Not on the map: the Brandeis "laboratories" line. §8 marks the Federalist Papers attribution DISAGREE, so the on-screen text names no source for the laboratory idea. Jamaica 1664/1684 is off-map and omitted.
- Research file errors to fix there: it dates the Stono Rebellion "1639" (it was 1739).

## Illustrated scenes (agy / Gemini image route)

Every prompt = common style block + scene text + "No text, labels, captions or lettering anywhere in the image." Full prompt strings: `logs/G_cinematic_prompts.md`.

| turn_id | Turn | PNG | Figma node | Clip | Lower third | Review |
|---|---|---|---|---|---|---|
| `2bef3733b2bee912` | 225 | `assets_cine/225-antao-1441-raid.png` | `149:1208` | `g-cine-225-antao-1441-raid.mp4` | Rio de Oro coast · 1441 | Accurate: Order of Christ cross on lateen sails, Sanhaja dress, camels, seals. The seizure is implied by the approach. |
| `433fb3ab5452ab07` | 229 | `assets_cine/229-lagos-syndicate.png` | `149:1260` | `g-cine-229-lagos-syndicate.mp4` | Lagos, Algarve · 1444 | Good. 15th-c. merchant dress, cross-sail caravels in the harbor. |
| `433fb3ab5452ab07` | 229 | `assets_cine/229-coastal-attack.png` | `149:1233` | `g-cine-229-coastal-attack.mp4` | West African coast · 1444 | Restrained. §10 does not rule out the huts; left as is. |
| `742f3e437ca0e500` | 231 | `assets_cine/231-lagos-landing-1444.png` | `149:1285` | `g-cine-231-lagos-landing-1444.mp4` | Lagos, Portugal · August 8, 1444 | Good. Captives in near-silhouette; whitewashed walled town. |
| `c03b1e265748a3b2` | 232 | `assets_cine/232-five-lots.png` | `149:1310` | `g-cine-232-five-lots.mp4` | Lagos, Portugal · 1444 | Good. Stakes and the mother-child gap carry the separation, no gore. |
| `1ea5088c3950ea4f` | 233 | `assets_cine/233-henry-quinto.png` | `149:1337` | `g-cine-233-henry-quinto.mp4` | Lagos, Portugal · 1444 | Mounted on a horse in the open field as Zurara describes; Order of Christ crosses correct. The dark cap reads as a helmet, which is acceptable. |
| `8bd9e4e225b2d801` | 235 | `assets_cine/235-poisoned-arrows.png` | `149:1362` | `g-cine-235-poisoned-arrows.mp4` | West African coast · after 1444 | Good. Mangrove shore, dugouts, arrows; crew unspecific. |
| `ddbb09b442535d14` | 238–240 | `assets_cine/238-nicholas-v-bulls.png` | `149:1387` | `g-cine-238-nicholas-v-bulls.mp4` | Rome · June 18, 1452 | §10 specifies the triple tiara (triregnum) and a red mozzetta. The pope wears a mitre: clear defect, regeneration queued with 294. |
| `2bf94b3148fd67c9` | 242 | `assets_cine/242-zurara-chronicler.png` | `149:1414` | `g-cine-242-zurara-chronicler.mp4` | Gomes Eanes de Zurara | Tiny map lettering slipped in despite the no-text clause; illegible at video size. Habit correct. |
| `3e58613955c2a7bf / 4eadb9f2aab74954` | 248–249 | `assets_cine/248-casa-dos-escravos.png` | `149:1439` | `g-cine-248-casa-dos-escravos.mp4` | Lisbon · 1486 | Good. Lisbon waterfront with castle hill. |
| `f12ff16daa7c925c` | 284 | `assets_cine/284-chesapeake-piracy.png` | `149:1464` | `g-cine-284-chesapeake-piracy.mp4` | Atlantic Ocean · 1619 | Two similar galleons; privateer and slave ship are not distinguishable. Acceptable atmosphere. |
| `42214e07347b0975 / 2eb89f9ac45edd1f / 82054a32786ea2e2` | 294–296 | `assets_cine/294-chesapeake-bottom.png` | `—` | `pending` | (none yet) | Not generated (quota). |

Animation: each frame is 1920×1080, 10 s, with one of three moves (push 1.0→1.14, pan ±60 px at 1.12×, pull-back 1.14→1.0) and a navy lower third that fades in at 0.5 s.

Turn 294 re-run after the quota reset (sandbox disabled): `sh <scratchpad>/gen/run.sh 294-chesapeake-bottom`, with the prompt from `G_cinematic_prompts.md` in `gen/294-chesapeake-bottom.prompt`. Then upload the PNG, copy the frame recipe from `g-cine-284-chesapeake-piracy` (node `149:1464`), set the lower third to "Chesapeake tobacco colony · 1600s", and export `g-cine-294-chesapeake-bottom.mp4`.

For turn 296, Washington's runaway advertisements are better built as a Figma text card (identical reward lines) than as a generated image, because image models garble type.

## Proposed shot-list Render, keyed by turn_id and spoken text

Render syntax follows the existing `figma:` entries. Pending-credit scenes are listed with their intended clip name so the orchestrator can reserve it.

| turn_id | Spoken text (anchor) | Proposed Render | Status |
|---|---|---|---|
| `2bef3733b2bee912` | "In fourteen forty-one, a young Portuguese captain named Antao Goncalves sailed to the Rio d'Ouro coast…" | `figma:g-cine-225-antao-1441-raid.mp4` | **made** |
| `433fb3ab5452ab07` | "In fourteen forty-four, under the patronage of Prince Henry, merchants in the Algarve formed the Companhia de Lagos…" | `figma:g-cine-229-lagos-syndicate.mp4`, then `figma:g-cine-229-fleet-map.mp4`, then `figma:g-cine-229-coastal-attack.mp4` | **made** (map + two illustrations) |
| `742f3e437ca0e500` | "On August 8, fourteen forty-four, Lancarote's fleet landed those 235 captives on the field outside Lagos…" | `figma:g-cine-231-lagos-landing-1444.mp4` | **made** |
| `c03b1e265748a3b2` | "The captives were divided into five lots on the beach, separating parents from children…" | `figma:g-cine-232-five-lots.mp4` | **made** |
| `1ea5088c3950ea4f` | "Prince Henry the Navigator attended the Lagos division mounted on a powerful horse…" | `figma:g-cine-233-henry-quinto.mp4` | **made** |
| `d13699ffd0668ddd` | "Immediately after fourteen forty-four, Portuguese raiders pushing south past the Senegal River…" | `figma:g-cine-234-campaign-map.mp4` | **made** |
| `8bd9e4e225b2d801` | "Poisoned arrows and shallow coastal waters killed European raiding parties…" | `figma:g-cine-235-poisoned-arrows.mp4` | **made** |
| `ddbb09b442535d14`, `923528ae0159c6ab`, `5859e3f3080a30d1` | "On June 18, fourteen fifty-two, Pope Nicholas V issued the bull Dum Diversas…" (one scene spans all three) | `figma:g-cine-238-nicholas-v-bulls.mp4` | **made** |
| `2bf94b3148fd67c9` | "King Afonso V and Prince Henry commissioned the royal chronicler Gomes Eanes de Zurara…" | `figma:g-cine-242-zurara-chronicler.mp4` | **made** |
| `3e58613955c2a7bf`, `4eadb9f2aab74954` | "…an officer of the same Military Order of Christ…" / "…establishing the Casa dos Escravos…" | `figma:g-cine-248-casa-dos-escravos.mp4` | **made** |
| `1052dca74d05249b` | "The biological input supplied no natural binary. Julian Huxley called graded geographic variation a cline…" | `figma:g-cine-257-cline-chart.mp4` | **made** (schematic curves) |
| `f12ff16daa7c925c` | "Why was there no statutory white tier in early Virginia?…" | `figma:g-cine-284-chesapeake-piracy.mp4` | **made** |
| `42214e07347b0975`, `2eb89f9ac45edd1f`, `82054a32786ea2e2` | "Because poor European servants and African laborers experienced the same whip…" | `figma:g-cine-294-chesapeake-bottom.mp4` | pending quota |
| `b19b89ab516124a7` | "The statute stood until Chief Justice Earl Warren and the United States Supreme Court struck it down in Loving v. Virginia…" | `figma:g-cine-325-loving-archival.mp4` | **made** |
| `98cbb21622bee3da` | "Virginia's slave codes did not stay local. Colonies and later states copied statutory language…" | `figma:g-cine-331-statute-diffusion-map.mp4` | **made, checked against §8** |

## Method and sources

- Coastlines and state boundaries: Natural Earth 50m `ne_50m_land` and `ne_50m_admin_1_states_provinces` (naturalearthdata.com, public domain), downloaded 2026-10-29, simplified with shapely, imported with `createNodeFromSvg`. Working files are in the session scratchpad, not in the repo.
- Palette: episode card palette (bg `#0D1B2A`, cream `#E8C99B`, orange `#E08A3C`, brown `#8A6A45`), Inter.
- Known rough edges: the 229 map's "Lagos" label sits close to the route line; the 331 map crops states west of 100°W; map frames end in a hard land edge at the side-panel boundary (hidden by the panel).
- New since the re-route: eleven PNGs in `figma/v2/assets_cine/`, eleven illustration clips (16 `g-cine-*` clips in total), `logs/G_cinematic_prompts.md`. Nothing in the podcast script, shot lists, cards, builders, manim files, `Paper/` or `scriptcast.toml` was changed. Nothing was committed. New files: five `g-cine-*` clips, `archive/loving_395/loving_395_p6_crop.png`, this log.

## §10 review pass (after G_research.md)
- 231 Lagos 1444: lateen-rigged ships, town walls, open sand. Matches §10 (sterncastle present, no high forecastle on the nearest hulls).
- 232 five lots: the field lies outside the walls, as Zurara says. Matches.
- 233 Henry: mounted, outside the walls. Matches.
- 284 Chesapeake piracy: two-masted and three-masted square-rigged ships fit 1619. Matches.
- 238 Nicholas V: mitre instead of triregnum. **Regenerate with 294 after the quota reset (about 03:08 UTC 2026-10-30).** Prompt change: "wearing the three-tiered papal tiara (triregnum) and a red mozzetta edged in ermine, scarlet cardinals around".
- 294 Chesapeake bottom: add to the prompt "English indentured servants and enslaved Africans working side by side in one field gang, unbleached linen shirts, straw hats, bare feet, split-rail fences, tidal river, tobacco barn".
- Turn 325: §10 lists a UPI press photo of the Lovings (Commons `Mildred_and_Richard_Loving_1967_by_UPI.jpg`) as public domain for lack of a copyright notice. I did not use it: I could not confirm the file or the licence from here, and a wire photo of real people is outside the illustration rule. The trial-record page stays.
