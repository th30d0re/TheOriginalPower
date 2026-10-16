# YT01 scene insert — Bacon partition, gender hold, Eq 2.19 axes

Model: Composer

## Summary

Voiceover insert added run **S19-05a** (8 shots) and hold **S03-35a** inside **S03-31**. Equation **2.19** turn now names six identity axes on screen.

## Files changed

| File | Change |
|------|--------|
| `manim/partition_redraw16x9.py` | **New** `PartitionRedraw` · `shot_S19_05a` — universe + Eq 2.1, Labor Class split, Jamestown, boundary redraw, Eq 2.2 tiers / `O_{\text{racialized}}`, `\psi_s` badge, armed wall, Eq 4.3 close |
| `manim/recursive_partition16x9.py` | Hold **S03-35a** at shot index 5 (gender → `O_{\text{gendered}}`); credentialed / flattening shifted to indices 6–7 |
| `manim/interference16x9.py` | Shot 0: six axis labels (race, gender, orientation, ability, religion, nationality) on the phasor plane; panel fades before shot 1 |

## Acceptance (2026-10-16)

```
.venv-manimgx/bin/python Architecting_the_operation/video/yt01_redefining_racism/manim/edit16x9.py check
→ 235 runs, 0 problems

.venv-manimgx/bin/python .../edit16x9.py render 03 17 19 --force -j 3
→ all runs ok

Layout (960x540@15 logs):
- S03-31: layout: no problems in 33 samples
- S17-52: layout: no problems in 25 samples
- S19-05a: layout: no problems in 39 samples

Sheets: `/tmp/S19-05a.png`, `/tmp/S03-31.png`, `/tmp/S17-52.png` (8 tiles each; distinct beats per shot on visual review)
```

## Run notes

- **S19-05a**: Full-width `U` with `U = I \,\dot\cup\, O`; Chapter 4 labor partition animation through Equation 4.3 (`Buffer Created: I_{\text{poor}} \rightarrow \text{Defender of } E`). Book label in manuscript is `eq:3.3-race-destroys-class`; on-screen tag follows shot list “Equation 4.3”.
- **S03-35a**: Person-dot returns to local `I` under race, moves to local `O` under gender with `O_{\text{gendered}}`.
- **S17-52**: Axis names appear on cue words in shot 0; aligned/cancel phasor demos unchanged from shot 5 onward.

## Contract / cues

All `self.at(...)` targets resolve under `edit16x9.py check`. No edits outside owned manim files.

## S19-05a layout pass (2026-10-16, reviewer sheet)

**Owned file:** `manim/partition_redraw16x9.py` only.

**Fixes (beat order unchanged):**

| Issue | Change |
|-------|--------|
| L_white after move into I | Buffer tier label `I_{\text{buffer}} \supseteq L_{\text{white}}` (36 px MathTex, fit-to-row) |
| L_black in O_racialized | `O_{\text{racialized}}` + `= L_{\text{black}}` stacked inside the O box (40/38 px) |
| S19-05f ψ_s badge | Gold plate badge under `I_buffer`: `\psi_s` 44 px, “status wage” + “costs E nothing” 36 px |
| S19-05g armed boundary | Full-height crenellated wall on I→O face; “armed” / “polices the boundary” 36 px, clamped inside I |
| I tier names | All tier MathTex at 36 px |

**Verify:**

```
.venv-manimgx/bin/python .../edit16x9.py render 19 --only S19-05a -j 1 --force
→ S19-05a: ok

.venv-manimgx/bin/python .../edit16x9.py check 19 --only S19-05a
→ 0 problems

Sheet: /tmp/S19-05a.png (8 tiles S19-05a–h)
```

**Tile review:** e — tiers + `O_{\text{racialized}}` / `L_{\text{black}}`; f — ψ badge on buffer; g — full wall + labels; h — Eq 4.3 header, badge and wall retained. No overlaps on g/h at 85% frame pick.
