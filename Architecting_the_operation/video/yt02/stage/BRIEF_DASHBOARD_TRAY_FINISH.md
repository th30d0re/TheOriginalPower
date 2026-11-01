# Brief: finish the instrument tray (stage 4 of `BRIEF_DASHBOARD_TRAY.md`)

Kimi completed stages 1–3 of `BRIEF_DASHBOARD_TRAY.md` (committed as e60a5f4), then stopped
on its usage limit before stage 4. Read `BRIEF_DASHBOARD_TRAY.md`, the partial
`FINDINGS_DASHBOARD_TRAY.md`, and `git show --stat e60a5f4`.

These rules are unchanged from the earlier passes:

- Write only inside `Architecting_the_operation/video/yt02/stage/`.
- The engine is read-only.
- Do not run git commands that change state.
- Keep the frame path deterministic.
- Do not launch Chromium. The plan compile and `--dry-run` are allowed.

Run `git status` before you start and again when you finish. Report anything outside `stage/` that changed.

## State at handoff

- `tsc` for the episode passes.
- `node tools/check_dashboard.mjs` fails with `actual: 18, expected: 11`. The check still counts the old instrument set.
- Kimi left two scratch files in the repo: `tools/smoke.mjs` and `tools/smoke_entry.tsx`. Fold anything useful into `check_dashboard`, then delete both.

## Do

1. **Extend `tools/check_dashboard.mjs` for the new layout.** Assert each of the following:
   - The right stack and tray contain the new instrument set.
   - The tray has nine cells, in the brief's order, at about x 36…1884, with 8 px gaps and a height of about 100.
   - Every tray instrument renders compact, expanded and settings.
   - The settings view is reached only through the gear.
   - The rendered markup contains no interaction hint ("drag", "click", "arrow keys", "press") when `interactive` is false.
   - The determinism double-render covers the tray.
   - The route, its labels and Portugal sit above the tray's top edge and clear of both stacks.
   - The route land-hit count is 0.
   - No labels collide.
2. **Audit Kimi's work against the brief and fix defects in place.** List each fix in the findings.
   - Check that the right stack has Active Patch, Variables, Executing Function and Policy ticker, and that the bottom strips are gone.
   - Check that each expanded view is about 1400 × 860 and grows from its tray cell toward the centre.
   - Check that the Snubber settings view carries the V_br note.
   - Check that every "model default" case is marked in the settings view.
   - The findings table lists the Complex Wage Plane as model default because "log 2 predates 1705". Fix pass 3 drove it from log 2 with ψ_m 0 and ψ_s 60. Confirm which reading the code uses now and keep the fix-pass-3 values.
3. **Run every check in "Done means":**
   - Episode `tsc`.
   - `check_dashboard`.
   - Plan compile and render `--dry-run` for both `review/` and `review_tray/`. `review_tray` uses `stage_tray.yaml`. Confirm the existing review still compiles.
   - The site build.
4. **Complete `FINDINGS_DASHBOARD_TRAY.md`:**
   - Sections 3–5.
   - The layout geometry, including the tray box, the map extent and Portugal's on-screen height.
   - The defects you fixed.
   - The tail of each check's output.
   - The "model default" list.
   - The Snubber flag for the author.
