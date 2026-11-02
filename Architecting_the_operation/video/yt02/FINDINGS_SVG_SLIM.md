# Findings: YT02 design SVGs slimmed with SVGO (2026-11-01)

**Scope:** `stage/handoff/svg` (36 files) and `figma/**` (121 files), per `BRIEF_SVG_SLIM.md`.
156 files were rewritten. `border-compact.svg` was left byte-identical, because
`stage/tools/svg_to_tsx.mjs` reads it with exact-string regexes.

## Result

| Folder | Before | After | Saved |
|---|---|---|---|
| `figma/` | 781 KB | 469 KB | 39.9% |
| `stage/handoff/svg/` | 3,938 KB | 2,765 KB | 29.8% |
| **Total** | **4,720 KB** | **3,234 KB** | **31.5%** |

**Verification:**
- **Check run:** the orchestrator ran it independently after the run. It compared each rewritten
  file against its `git HEAD` original with `tools_svg/verify.mjs` `verifyPair`: resvg at 1×, and
  also at 2× for maps and for files under 1,000 px wide, then pixelmatch at threshold 0.
- **Result:** all 156 files are **pixel-identical**, with 0 differing pixels and 0 within tolerance.
- **Borders:** `CompactBorder.tsx` and `CardBorder.tsx` regenerate byte-identical.
- **Dashboard check:** `check_dashboard` passes.

## Config (`tools_svg/svgo.config.mjs`)

- **Base:** `preset-default` with `multipass`.
- **Precision:** `floatPrecision` 3 on `convertPathData`, `convertTransform` and
  `cleanupNumericValues`.
- **`convertPathData`:** keeps arcs, Q curves and repeated commands as they are (`makeArcs`,
  `convertToQ` and `collapseRepeated` are off). Those conversions shifted rasterization.
- **Fallback ladder in `slim.mjs`, per file:**
  1. precision 3;
  2. precision 4;
  3. precision 5;
  4. precision 5 with the geometry plugins off (`convertPathData`, `convertTransform`,
     `convertShapeToPath`, `convertEllipseToCircle`, `cleanupNumericValues`, `mergePaths`);
  5. keep the original.
- **Precision-4 files:** `era-clock.compact`, `executing-function.compact` and
  `wage-plane.compact`. At precision 3 these three differed in 7 anti-aliasing pixels (max
  5/255), so the orchestrator re-slimmed them at precision 4, which is exact.

## Notes

- Kimi wrote the config, the ladder and `report.json`, and slimmed the files. It then hit its weekly
  usage limit during a per-plugin bisect. The `report.json` entries for the three precision-4
  files predate the re-slim.
- The `*.qr.svg` files under `figma/v2/assets` were in scope and slimmed. They are
  pixel-identical, so they still scan.

## Re-run on new exports

```bash
node Architecting_the_operation/video/yt02/tools_svg/slim.mjs && node Architecting_the_operation/video/yt02/tools_svg/verify.mjs
```
