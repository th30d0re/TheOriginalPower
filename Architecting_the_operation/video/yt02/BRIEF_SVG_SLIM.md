# Brief: slim the YT02 design SVGs with SVGO, with zero visual change

The author cloned SVGO into the repo so the Figma-exported SVGs can be slimmed. Your job is to
shrink two folders of design SVGs and to prove, file by file, that every one renders
pixel-identical.

## Rules (override anything below)

- Working directory: `/Users/emmanuel/Documents/Theory/TheOriginalPower`.
- **Write only:**
  - the SVG files listed in Scope, rewritten in place;
  - `Architecting_the_operation/video/yt02/tools_svg/`: your config, scripts and report;
  - `Architecting_the_operation/video/yt02/FINDINGS_SVG_SLIM.md`;
  - scratch files under `/tmp/svg-slim-*`.
- **Do not touch:**
  - `Architecting_the_operation/video/yt02/stage/minutetwo/`: another Kimi agent is working there
    right now.
  - Any `.tsx`, `.ts` or `.mjs` file in `stage/`. One exception: if a check requires it, you may
    regenerate `stage/dashboard/CompactBorder.tsx` by running `stage/tools/svg_to_tsx.mjs`. That
    output must come out byte-identical (see check 3).
- **SVGO:** use the local clone, `node tools/svgo/bin/svgo.js` (SVGO 4.1.0, dependencies
  installed). Do not edit anything under `tools/svgo/`, and do not install SVGO globally.
- **Git:** no commands that change state; `git status` and `git diff --stat` are fine.
- **Safety:** no `rm -rf`. Do not read `.env` or secrets.
- **No browsers:** do not launch Chromium. A rasterizer is ready for you (see Verification).

## Checkpoint (AGENTS.md commit-before-destroy is satisfied)

The orchestrator committed a clean checkpoint before this run. The dirty paths outside your scope
are the author's own work: `.claude/launch.json`, `yt02/logs/…` and `tmp/`. So are the files the
minute-two agent is writing under `stage/minutetwo/`. Leave all of them alone, and do not treat
them as blocking. Every SVG you rewrite is tracked in git, so the original stays recoverable. Even
so, write each original to `/tmp/svg-slim-orig/<same relative path>` before you overwrite it.

## Scope

| Folder | Files | Size |
|---|---|---|
| `Architecting_the_operation/video/yt02/stage/handoff/svg/*.svg` | 36 | ≈ 4.0 MB |
| `Architecting_the_operation/video/yt02/figma/**/*.svg` | 121 | ≈ 1.0 MB |

These are Figma exports (dashboard instrument states, maps, cards).

Leave every other SVG in the repo alone:
- manim caches under `animations/*/media/`, which regenerate;
- `experiments/` matplotlib figures;
- the print `cover/`;
- QR codes;
- `website/`.

## Config

Write `tools_svg/svgo.config.mjs`. Start from `preset-default` and make it safe for these
consumers:

- Keep `viewBox`, `width` and `height`.
- Keep IDs that are referenced inside a file (`url(#…)`, `href="#…"`). The default `cleanupIds`
  already does this; confirm it.
- `stage/tools/svg_to_tsx.mjs` reads `handoff/svg/border-compact.svg` with case-sensitive regexes:
  `fill="#F5F5F5"` on a `<rect>`, and `"#E8C99B"` (matched with `/gi`). Read that script.
  - For that file, either exclude it from SVGO, or keep the attributes the regexes need.
  - Any change you make must leave the regenerated `CompactBorder.tsx` byte-identical (check 3).
- Floating-point precision: choose it so the pixel check passes. Start at
  `floatPrecision: 3` and raise it per file only where the check fails.
- Turn off any plugin that changes rendering for a file, and record which plugin and why.

## Verification (every file must pass before you keep its slim version)

The rasterizer is installed in `/tmp/svg-verify`, with `@resvg/resvg-js`, `pngjs` and
`pixelmatch` in its `node_modules`. Write `tools_svg/verify.mjs` with this logic:

1. Render the original and the slimmed SVG to PNG at their native size with resvg. Render maps
   and any file narrower than 1000 px at 2× as well, because thin strokes hide errors at 1×.
2. Compare the two images with pixelmatch at `threshold: 0`. A file passes only if **0 pixels
   differ**.
   - If the only failure is anti-aliasing noise, a file may pass with at most 0.01% of pixels
     differing and no pixel off by more than 8/255 per channel. List every such file and its
     numbers.
3. If a file fails, retry it with higher precision, then with fewer plugins. If it still fails,
   keep the original and report it.

Fonts: if a file contains `<text>`, give resvg the system fonts (`loadSystemFonts: true`) for both
renders, so they share the same fallback.

## Checks

1. **Pixel diff:** every file in scope is verified. Write `tools_svg/report.json` with one entry
   per file: path, bytes before, bytes after, percent saved, diff pixels, precision used, and
   pass/fail/kept-original.
2. **Totals:** bytes before and after for each folder, and overall.
3. **CompactBorder:** run `node Architecting_the_operation/video/yt02/stage/tools/svg_to_tsx.mjs`,
   then `git diff --exit-code Architecting_the_operation/video/yt02/stage/dashboard/CompactBorder.tsx`.
   It must report no diff.
4. **Existing checks:**
   - Episode tsc:
     `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`.
     If it fails only inside `stage/minutetwo/`, that is the other agent's work in progress;
     note it and continue.
   - `node Architecting_the_operation/video/yt02/stage/tools/check_dashboard.mjs`.
5. **Scope:** `git status --short` shows changes only to in-scope SVGs and your own new files.

## Findings (`FINDINGS_SVG_SLIM.md`)

- The final config, with each deviation from `preset-default` and its reason.
- The totals table.
- The 10 largest savings.
- Every file that kept its original or passed only under the anti-aliasing tolerance.
- The tail of each check's output.
- A one-line command to re-run the slim and verify on new exports.
