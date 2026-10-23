# Brief: the five-tier hierarchy becomes a 3-D cone; the Square Ceiling becomes the Flat Ceiling

Author decision (2026-10-22): the 3-D hierarchy model in *The Original Power* is a **cone**, sliced into five
tiers, with $E$ at the apex on the $z$-axis and $O$ as the enclosed base. Seen from inside $O$ looking up, the
underside of $I_{\text{buffer}}$ is a flat disc, so the **Square Ceiling** is renamed the **Flat Ceiling**. The
book already describes it as "the flat ceiling of $I_{\text{buffer}}$ pressing downward".

## Rules
- **Never run git.** Leave every change uncommitted for review.
- Edit only `Paper/The_Original_Power.tex`, then rebuild `Paper/The_Original_Power.pdf` with `make pdf-from-tex`.
- Follow `AGENTS.md`: use direct, affirmative declarative sentences, and no formulaic antithesis ("not X but Y",
  "more than just"). Do not add new claims.
- Keep every `\label` and `\ref` key unchanged (for example `fig:tier_pyramid`), so cross-references hold.

## Edits
1. Every mention of the 3-D model becomes a cone: "3-D pyramid" / "3-D Pyramid" → "3-D cone" / "3-D Cone",
   "the pyramid's apex" → "the cone's apex", "outside that pyramid" → "outside that cone", the section title
   "The Five Nodes and the 3-D Pyramid", the caption of `fig:tier_pyramid`, and the one at L13656.
   Candidate lines: 254–255, 486, 549, 553, 583, 765–775, 783, 2403, 13656, 13712–13726, 13757. Read each one in
   context. Keep "the flat 2-D triangle" at L254 and L13712: a cone seen side-on projects to a triangle, so the
   contrast still holds.
2. **Leave the 2-D figures alone.** L5664 and L9886–9919 draw a flat tiered triangle ("layered pyramid of
   extraction"), which is the side view. Keep those, unless a sentence there names the 3-D model.
3. "Square Ceiling" → "Flat Ceiling" at all 4 occurrences (L257, L771, L782, L13721), including the
   `\item[...]` term at L782 and the quoted form at L13721.
4. Where the text explains the illusion (L765–772, L13716–13722), add at most one sentence saying why the cone
   matters: the observer on the axis sees the disc-shaped underside of $I_{\text{buffer}}$ with every higher tier
   centred behind it, so the alignment of the proxies along the sightline is exact. Keep it declarative.
5. **Redraw `fig:tier_pyramid` (L557–585) as a cone in TikZ:**
   - apex at (0,4.8);
   - elliptical base centred at (0,0.6), x-radius 4.0, y-radius 0.9, with its back half dashed;
   - four elliptical tier cuts at the same heights as the current `\s` values, each ellipse scaled linearly
     toward the apex;
   - the same node labels and positions, and the same $z$ arrow;
   - light fills matching the current palette (blue!7 for the front, gray!16 for the shading).
6. Grep afterwards. No "pyramid" may remain that refers to the 3-D model, and no "Square Ceiling" may remain.

## Acceptance
- `make pdf-from-tex` succeeds with no new undefined references. Report the warning count before and after.
- Write `Paper/MS_REVISION_cone_REPORT.md`, listing every changed line (old → new, with the line number) and the
  page number of the redrawn figure in the PDF.
