# Brief: shot list for the YT02 v2 script

**Never run git. Write ONLY `Architecting_the_operation/video/YT02v2_shotlist.md` and
`Architecting_the_operation/video/yt02/NEW_SCENES_v2.md`. Edit nothing else, and create no files at the repo root.**

## Inputs
- Script: `Architecting_the_operation/podcasts/YT02_v2_what_racism_is.md` (16 segments, 561 turns).
- Recorded timings: `outputs/YT02v2/episode_manifest.json` (turn starts and durations).
- Format and rules of the existing shot list: `Architecting_the_operation/video/YT02_shotlist.md` and
  `Architecting_the_operation/video/yt02/SHOTLIST_V2_BRIEF.md`. **Copy the exact table/column format**, because the
  parser `load_shots()` in `Architecting_the_operation/video/yt01_redefining_racism/manim/common16x9.py` must
  read it.
- Author's visual feedback, which is binding: `Architecting_the_operation/video/yt02/REVISION_v2_FEEDBACK.md`,
  sections D, G and H.
- Verified page scans with pixel highlight boxes: `Architecting_the_operation/video/yt02/archive/SOURCES.md`.

## Rules
1. **Reuse first.** Where a v2 passage covers the same content as a v1 shot, reuse that v1 shot's file, scene and
   card ids unchanged: Figma cards `figma-card`, Figma scenes `figma`, manimgx scenes, and ext clips.
2. **Math must teach.** Every equation gets a manimgx term-highlight shot, never a static card. Each term lights
   up on the turn that names it. Before the RLC equation, give the components (R, L, C in this context), then the
   circuit, then the oscilloscope damping, then the equation.
3. **One pyramid** for the five tiers, used everywhere. The adjacent Out-group must stay inside the frame.
4. **Complex plane hero shot** (section G): one continuous manimgx scene that runs number line → plane →
   assign variables → quarter turn → invariants → θ sweep.
5. **Page scans** (section H): when a turn quotes a source listed VERIFIED in SOURCES.md, show the scan with its
   highlight box (file `ext`, scene = the image path), with a note giving the box.
6. **Atwater:** `[clip:atwater_1981]` plays over a held title card with name, date and source, plus captions.
7. **No overlaps:** captions get a reserved lower band; scene labels never enter it.
8. **No on-screen antithesis.** Say "cannabis". Use "tiers".

## NEW_SCENES_v2.md
List every shot whose scene does not exist yet, with:
- id;
- purpose;
- the turns it spans;
- the beats (which word triggers which element);
- the existing asset closest to it.
Order the list by segment.

## Check
Run `YT_EP=YT02v2 .venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check`.
It must parse every shot. Report its summary line, and the number of reused versus new shots, at the end of
NEW_SCENES_v2.md.
