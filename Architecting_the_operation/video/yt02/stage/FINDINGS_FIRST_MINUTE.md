# First-Minute Scene Findings

Model: GPT-5 Codex

Scope: `TitleOpen`, `DictionaryEntry`, `WhyLadder`, `LiteratureStack`, and `Disclosure` for `YT02v2_ov` turns 0–3 and 5. `RoadmapBoot` remains under Kimi ownership.

## Scene Beats and Cues

All cue values are episode-absolute milliseconds from `ov/stage_plan.json`.

### Turn 0 · `TitleOpen`

| Cue | Time | Beat |
|---|---:|---|
| `title` | 460 | “The Original Power” and “Emmanuel Theodore” rise into the upper centre. |
| `archives` | 3,480 | The Archives tile enters with a ruled folio, dated header, and wax seal. |
| `equations` | 4,520 | The Equations tile enters with `W = ψ_m + jψ_s` in `MathText` and a phasor plane whose positive status axis points right and positive material axis points down. |
| `tests` | 5,360 | The Tests tile enters with two pass marks and one fail mark. |
| `episode` | 7,120 | The method tiles fold into a narrow strip and “Episode 1 · What Racism Is” enters. |
| `definition` | 10,360 | “and why the definition most of us were taught fails” enters. |
| `fails` | 12,220 | The red marker line draws beneath “the definition most of us were taught” over 500 ms. |

### Turn 1 · `DictionaryEntry`

| Cue | Time | Beat |
|---|---:|---|
| `common` | 13,840 | “The common definition of racism” enters. |
| `wrong` | 14,600 | The red “wrong” stamp enters. |
| `dictionary` | 16,720 | The `rac·ism` entry enters with senses 1 and 2. |
| `individual` | 18,620 | Sense 1 reaches full brightness and its gold rule completes. |
| `institutional` | 20,480 | Sense 3 and “if present at all” enter at reduced emphasis. |
| `order` | 22,880 | Sense numbers 1, 2, and 3 translate 735 px toward the causal area. |
| `causal` | 24,040 | The three-node conventional chain and “causal story” label enter. |
| `evidence` | 25,380 | The dashed evidence slot and manuscript source line enter. |

`DefinitionHierarchy`, `DefinitionSceneContent`, `DefinitionHierarchyState`, and `finalDefinitionState` provide the reusable entry and chain state consumed by turn 2.

### Turn 2 · `WhyLadder`

| Cue | Time | Beat |
|---|---:|---|
| shot start | 26,910 | Turn 1’s final entry and causal chain fill the frame. The shared component preserves the hard-cut continuity. |
| `header` | 27,790 | “Why, at every step” enters. The previous scene scales toward the first 320 × 180 thumbnail and settles by shot start + 1,500 ms. |
| `why1` | 29,290 | “Why does the dictionary order matter?” enters beside the live shrunken definition scene. |
| `why2` | 31,210 | “Why separate bias from racism?” enters with separate bias and racism boxes. |
| `why3` | 33,510 | The Virginia question enters with the Chesapeake coastline thumbnail. The deterministic map zoom begins. |
| `virginia` | 34,370 | “Virginia · 1676” remains visible while the zoom continues through `virginia + 2,000 ms`. |
| `why4` | 37,490 | The reform question enters with the compact `BacklashOscillatorView`. |
| `backlash` | 39,150 | The active fourth row and “reform → backlash” label remain at full emphasis. |

Each new row reduces the opacity of earlier rows. The Chesapeake path comes from `world-atlas` 50m land geometry, an Equal Earth projection, and a geographic clip around the Chesapeake. The generated path contains coastlines and contains no modern country-border layer.

### Turn 3 · `LiteratureStack`

| Cue | Time | Beat |
|---|---:|---|
| `established` | 40,990 | “Established social science” enters. |
| `bias` | 42,690 | The Bias block and Greenwald & Banaji citation enter. |
| `prejudice` | 43,610 | The Prejudice block and Allport citation enter. |
| `discrimination` | 44,170 | The Discrimination block enters. |
| `tripartite` | 45,790 | The thinking, feeling, and behavior row enters with its bracket, connectors, and Fiske citation. |
| `mark` | 47,910 | The completed literature stack holds while narration names the marking action. |
| `stops` | 48,870 | The gold boundary draws across the lower third and labels the stopping point. |

### Turn 5 · `Disclosure`

| Cue | Time | Beat |
|---|---:|---|
| `narration` | 74,130 | The disclosure sentence, 193-frame RMS waveform, and narrator credit fade in. |
| `clone` | 76,830 | “voice clone” transitions to gold over 450 ms. |
| `speech` | 78,190 | The disclosure and waveform continue through the spoken training-source phrase. |
| `disclosureEnd` | 80,030 | The completed card holds through the end of the spoken sentence. |

The waveform uses the 73,970–80,390 ms audio window. `tools/build_waveform_t5.mjs` runs `ffmpeg` with 1,600 samples per frame at 48 kHz and writes 193 linear RMS values to `firstminute/data/waveform_t5.json`. The playhead and played-wave brightness derive from stage milliseconds.

## Manuscript Strings on Screen

| On-screen string or construction | Manuscript location |
|---|---|
| “The Original Power” | `Paper/The_Original_Power.tex:143` |
| “Emmanuel Theodore” | `Paper/The_Original_Power.tex:144` |
| `W = ψ_m + jψ_s` | `Paper/The_Original_Power.tex:2873` |
| Positive `ψ_s` points right; positive `ψ_m` points down | `Paper/The_Original_Power.tex:2876–2883` |
| “Individual prejudice or discrimination based on race” | `Paper/The_Original_Power.tex:1795` |
| “Belief in racial superiority” | `Paper/The_Original_Power.tex:1796` |
| “Systemic or institutional discrimination” and “if present at all” | `Paper/The_Original_Power.tex:1797` |
| “Individual Prejudice → Discriminatory Actions → Systemic Outcomes” | `Paper/The_Original_Power.tex:1804–1807` |
| Bias as a tendency in judgment; the LiteratureStack’s full definition | `Paper/The_Original_Power.tex:243` |
| Racism as “psycho-legal social software” | `Paper/The_Original_Power.tex:243` |
| Prejudice as group antipathy grounded in a rigid, erroneous generalization | `Paper/The_Original_Power.tex:243` |
| Discrimination as behavior that treats people differently because of group membership | `Paper/The_Original_Power.tex:243` |
| Thinking: stereotype; feeling: prejudice; behavior: discrimination | `Paper/The_Original_Power.tex:243` |
| Greenwald & Banaji 1995; Allport 1954, p. 9; Fiske 1998 | `Paper/The_Original_Power.tex:243` |

The bias thumbnail uses the brief’s compact phrase “a tendency in judgment.” The LiteratureStack carries the brief’s full display wording. Both derive from the bias sentence at line 243.

## Deviations and Implementation Notes

Storyboard deviations: zero.

1. The Chesapeake geographic conversion runs in `firstminute/data/build_chesapeake_map.mjs`. The runtime scene imports the generated 5.6 kB clipped SVG path. This preserves the requested 50m land source and Equal Earth projection while keeping geographic processing outside the frame path.
2. The first site-build attempt exposed Vite’s package resolution boundary for a bare `topojson-client` import in an episode outside the engine package. Precomputation removed that runtime dependency. The final site build passed.
3. The site build wrote to a unique `/tmp/yt02-first-minute-site.*` directory. This preserved the task’s file-ownership boundary around the existing review directory.
4. Chromium inspection and Remotion frame rendering remain assigned to the orchestrator under the brief.

## Antithesis Review

`rg` scanned the five scene sources, `tools/check_first_minute.*`, and the Chesapeake generator with the prohibited-form patterns from `AGENTS.md`.

Result:

```text
no matches
```

The rendered-string checker also verifies the direct declarative strings at every beat. The independent prose review result is recorded after its completion below.

## Check Output Tails

### Episode TypeScript

```text
$ npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage
exit 0; no diagnostics
```

### First-Minute Checker

```text
PASS: 43 first-minute frames rendered in two fresh processes; all markup hashes match.
PASS: 43 cue-derived frames; five scene contracts, manuscript strings, real subscripts, hook policy, underscore policy, and interaction-hint policy verified.
```

### Dashboard Regression

```text
PASS: 19 frames plus all 24 tray mode renders and 3 moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.
PASS: Equal Earth route 1296 samples / 0 land hits, bounds 540.14..821.86 × 84.29..843.36 above tray y=860; Portugal height 102.18px mainland (136.7px with 1486 Moroccan enclave); 18 deterministic timeline states; 5-panel right stack + 8-cell tray geometry; all 24 tray modes plus 3 Wage plane modes; 18 declared layouts ≤ 828px; no literal underscore text; shared 601-point Thyristor traces; Backlash static active preset; gear-only settings; no rendered interaction hints; 75 polities with 16 non-colliding labels.
```

### Waveform and Chesapeake Data

```text
wrote .../firstminute/data/waveform_t5.json (193 RMS frames)
wrote .../firstminute/data/chesapeake_coastline.json (5375 path characters)
```

### Plan Compile and Render Dry-Run

```text
wrote Architecting_the_operation/video/yt02/stage/ov/stage_plan.json
STAGE_EPISODE_DIR=.../stage npx --no-install remotion render src/stage/index.ts StageEpisode /private/tmp/x.mp4 --props=.../stage/ov/stage_plan.json --timeout=120000 --codec h264 --concurrency=8 '--browser-executable=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Site Build

```text
✓ 267 modules transformed.
stage/default.json                                           2,216.81 kB │ gzip: 258.50 kB
assets/index-D2DsRSt0.js                                     1,832.19 kB │ gzip: 541.06 kB
✓ built in 1.09s
85 files emitted; exit 0
```

Vite emitted its existing chunk-size warning.
