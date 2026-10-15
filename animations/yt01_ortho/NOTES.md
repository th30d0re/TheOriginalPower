# YT01 orthographic illusion — build notes

Model: GPT-6 (Codex). Session date: 2026-10-15.

## Request and scope

Implement `BRIEF.md` as an 18.1-second, 1920 × 1080, 30 fps EffectCraft composition named `YT01_Ortho`. Deliver `build.jsx` and this file. The script must queue H.264 output and save an `.ecproj` project beside itself.

Both `animations/ep01_cone/build.jsx` and `animations/ep01_split/build.jsx` were read in full. Their primitive creation, transform access, text styling, and keyframe conventions provide the implementation reference.

## Implementation record

The scene contains five persistent, opaque cube primitives, one stack parent, one camera parent, one camera, and screen-space text and leaders: 22 layers total. The stack rotates from −90° to 0° around Z. The two lower tiers fill the opening frame with the specified white and black. Their separation creates a 1200-unit camera corridor. The three upper tiers remain outside the close view or occluded by the Buffer.

The camera advances 5000 units along Z and rises 140 units while pitching to +90°, looking vertically upward beneath the Buffer. Its parent then rotates through 180° and follows a shallow arc within the corridor to look vertically downward at the Out-group. The final withdrawal follows a single cubic Bézier path. The lower slabs reduce their height from 2200 to 460 units while all tiers settle into the pyramid.

Camera zoom remains 2400 throughout. A parent carries the camera's pitch, yaw, and physical translation; its local camera position and point of interest retain a stable forward axis through both vertical poses. Slab opacity remains at its default 100%. Text enters and leaves through position animation. Final leaders grow through scale animation.

### Beat table and keyframes

All times are seconds from the composition start. Motion curves use a quintic easing function sampled at 30 fps and written through `keys()`. Each moving interval includes both endpoints; constant sections bridge identical endpoint values. An additional key at 18.1 seconds preserves the final hold. The composition contains 543 rendered frames, with the final frame at 18.0667 seconds.

| Narration beat | Keyframe interval or hold | Picture |
|---|---|---|
| 0.0: “We can visualize this coarse projection…” | 0.0–2.3 hold | Full-frame white left / black right; “In-group” and “Out-group” already visible. |
| 2.3: “…as an orthographic illusion.” | 2.3–4.8 | Stack Z rotation −90° → 0°; white becomes the upper half. Upright opening labels follow the rotating halves. |
| 5.1–6.5: “With the camera below the Buffer Class looking straight up” | Slab separation 5.1–5.6; camera travel and pitch 5.1–6.5 | A 1200-unit corridor opens. Camera rises and advances into it, ending vertically upward. Opening labels leave during 5.1–5.5. |
| White-view caption | 6.2–6.5 entry; 6.5–11.6 hold | Small dark caption at bottom centre: “What the In-group looks like to the Out-group”. |
| 8.8: “…the higher tiers align behind it.” | 6.5–11.6 camera hold | White Buffer underside fills the frame; upper tiers remain occluded; caption stays. |
| 11.6: “…the binary looks complete from below.” | Camera swing 11.6–12.6 | Pitch +90° → −90° with continuous physical travel inside the corridor. White-view caption exits 11.6–11.9; black-view caption enters 12.3–12.6. |
| Black view and caption | 12.6–13.4 hold | Black Out-group top fills the frame. White caption: “What the Out-group looks like to the In-group”. |
| 13.4: “The deeper architecture appears…” | Camera withdrawal 13.4–16.5; tier settlement 14.4–16.5 | Continuous pullback and rise into a three-quarter pyramid view over navy. Black-view caption exits 13.4–13.7. |
| Tier labels | 16.5–16.9 | Flat “Out-group”, “Buffer”, “Enforcement”, “Puppet”, and “Elite” labels slide into a right-hand column; thin leaders grow beside their tiers. |
| 16.9–18.1: “…recursively resolved.” | 16.9–18.1 hold | Complete pyramid, five labels, and five leaders remain stationary. |

### Output and API uncertainties

The reference scripts contain neither render-queue calls nor project-save calls. This script therefore uses the After Effects-style `app.project.renderQueue.items.add(comp)`, `outputModule(1)`, `applyTemplate(...)`, `OutputModule.file`, `RenderQueueItem.render`, and `app.project.save(File)` interfaces requested by the brief. The queue span is 0.0–18.1 seconds. Execution queues the composition and saves the project; rendering can then be started from the host's queue.

Paths derive from `new File($.fileName).parent`. Running the script from its delivered location targets:

- `animations/yt01_ortho/yt01_ortho.mp4`
- `animations/yt01_ortho/yt01_ortho.ecproj`

H.264 selection prefers the exact `H.264` template and also accepts an installed template whose name identifies H.264. An unsupported template or queue operation is reported, project saving is attempted, and the script throws an explicit error. A successful queue entry requires an actual H.264 template in the host.

EffectCraft runtime support remains unverified for the queue APIs, `.ecproj` saving through `save(File)`, `$.fileName`, and the installed H.264 template. These are the delivery integration points that require host confirmation.

The scene also relies on After Effects-compatible parent-space camera and point-of-interest transforms, `Camera Options` → `Zoom`, `KeyframeInterpolationType.LINEAR`, `setInterpolationTypeAtKey`, and spatial-key setters. The reference demonstrates parenting and camera transforms; it does not exercise this vertical-camera rig or these interpolation setters. Material properties `Accepts Lights` and `Casts Shadows` follow the reference's property names and are applied to the cube primitives for flat colour. Their availability on EffectCraft primitives requires confirmation. Unsupported scene APIs raise an error during construction.

Both references leave the text font unset. This build preserves that default and uses their `TextDocument.__set` interface for size, fill, justification, and tracking. Actual glyph metrics and rendered colour remain host-dependent validation items.

## Validation and challenges

The script was executed against an in-memory After Effects-style mock to check JavaScript syntax, composition parameters, layer construction, keyframe insertion, queue configuration, and output paths. That mock validates script wiring and supplies the API methods; host support requires a separate EffectCraft run.

Final local checks passed: 1704 ordered transform keyframes, 26,607 ray samples, 2715 camera-versus-solid clearance checks, monotonic camera rise during 5.1–6.5, final leader clearance, and queue/save wiring. A simulated H.264-template failure confirmed that project saving is attempted before the explicit queue error is raised.

Numerical camera and geometry checks cover all 543 output frames. A 7 × 7 ray grid tests the rotating opening split and both full-colour holds. Camera clearance is checked against all five moving solids. The final projection puts the pyramid between x = 125.7 and 1495.9 pixels, giving a width of 1370.2 pixels, or 71.4% of the frame. Its vertical extent is y = 199.7–1025.2 pixels. Horizontal leader paths clear the projected tier faces. Labels use a common x = 1730-pixel centre; their baselines range from approximately 269.7 to 605.2 pixels.

These calculations assume the reference's centred primitive geometry, After Effects camera axes, and parent-transform conventions. EffectCraft execution, image inspection, encoded output, and project reopening remain unverified. The script has been authored for subsequent execution; this task creates the two requested source deliverables.

The initial repository inspection ran Git status and diff commands before the brief's prohibition was read. Further Git commands were excluded. This file carries the session record within the brief's two-file write scope. The prose checker is run with explicit file paths to preserve that scope.

`python3 tools/check_antithesis.py animations/yt01_ortho/build.jsx animations/yt01_ortho/NOTES.md` passed. An independent reading under `.codex/tasks/prose-antithesis-review.md` reported zero CERTAIN findings, zero arguable findings, and four passages considered and cleared.

## Next ideas (6 ideas)

1. Render the 0.0-second split in EffectCraft and inspect the divider.
2. Inspect the final vertical-camera poses for complete slab coverage.
3. Review the camera swing against the recorded narration.
4. Measure the rendered pyramid width and label margins.
5. Confirm the installed H.264 output template and encoding settings.
6. Reopen the saved project and inspect its render-queue entry.
