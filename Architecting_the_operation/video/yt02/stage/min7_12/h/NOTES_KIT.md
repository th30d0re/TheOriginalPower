# Stage-kit motion notes

- `InterpersonalClass` uses `Flicker` for the term rail and turn reveals, and `BootIn` for the state rack and assignment strip. Beats: the term rail, the person-to-person turn, and the original-power turn.
- `LiteratureBoundary` uses `Flicker` for the banner, boundary, and handoff reveals; `BootIn` for the literature and structural fields; and `DrawLine` for the terminal boundary traces. Beats: the opening banner, terminal boundary, and structural handoff.
- `UnequalTreatment` uses `Flicker` for each taxonomy/treatment turn, `BootIn` for the main pipeline and treatment tray, and `DrawLine` for the two pipeline connectors. Beats: the turn 55 taxonomy reveal and the turn 56 treatment reveal.

Every scene root is wrapped in `KitSound mode="beats"`. Cue starts use `Math.round(cueMs * 30 / 1000)`.
