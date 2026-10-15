# YT01 orthographic illusion, EffectCraft build script

**Never run git. Do not touch `Paper/`. Write only `animations/yt01_ortho/build.jsx` and
`animations/yt01_ortho/NOTES.md`.**

Write an EffectCraft ExtendScript build script in the same style as the author's
`animations/ep01_cone/build.jsx` and `animations/ep01_split/build.jsx` (read both fully; they are
the API reference: comps, 3-D solids/text layers, a camera, keyframes with `keys()` and easing,
the colours). EffectCraft follows the After Effects scripting model.

Composition: 1920x1080, 30 fps, **18.1 s**, named `YT01_Ortho`. Times below are seconds from
the comp start and come from the voiceover's word timings; hit them within ±0.1 s.

| t (s) | narration | picture |
|---|---|---|
| 0.0 | "We can visualize this coarse projection…" | Full-frame split, frame filled: white `[0.96,0.95,0.92]` on the **left** labelled "In-group", black `[0.012,0.012,0.014]` on the **right** labelled "Out-group" (as at the start of ep01_split). |
| 2.3 | "…as an orthographic illusion." | The divider rotates (as in ep01_split) until white is **above** and black **below**. Done by 4.8. |
| 5.1–6.5 | "With the camera below the Buffer Class looking straight up" | The two halves are now two stacked 3-D slabs (white slab = In-group on top of the black slab = Out-group). The **camera physically moves in 3-D**: it tilts and rises until it looks straight up at the underside of the white slab, so by 6.5 the frame is entirely white. Caption, small, bottom centre: "What the In-group looks like to the Out-group". |
| 8.8 | "…the higher tiers align behind it." | Hold the white; the caption stays. |
| 11.6 | "…the binary looks complete from below." | The camera swings down in 3-D (a continuous move, no cut) until it looks straight down at the top of the black slab, frame entirely black by 12.6. Caption: "What the Out-group looks like to the In-group" (white text). |
| 13.4 | "The deeper architecture appears…" | The camera pulls back and up in one continuous move to a three-quarter view revealing the stepped pyramid: Out-group (black base), Buffer (white), Enforcement `[0.40,0.50,0.58]`, Puppet `[0.62,0.47,0.29]`, Elite `[0.90,0.76,0.42]` at the top, the three upper tiers having been above the frame the whole time (as in ep01_cone/ep01_split). The pyramid fills ≥ 60% of the frame width. Tier names as flat labels beside each tier, joined by a thin leader line, never on the faces, all inside the frame. |
| 16.9–18.1 | "…recursively resolved." | Hold the reveal. |

No hard cuts anywhere: every change is a camera or layer move. Background behind the pyramid at
the end: navy `[0.06,0.09,0.17]`. Text font as in ep01_cone.

At the end of the script, add the comp to the render queue with an H.264 output module writing
`animations/yt01_ortho/yt01_ortho.mp4` (look at how ep01_cone/ep01_split were rendered: if their
scripts do not render, write the render-queue calls the After Effects way and say so in NOTES.md),
and save the project as `animations/yt01_ortho/yt01_ortho.ecproj`.

NOTES.md: the beat table with the keyframe times you used, and anything in the API you were unsure of.
