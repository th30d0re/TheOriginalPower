# Stage-kit motion notes

- `ImplicitTrace`: the Turn 41 and Turn 42 header panels boot with `BootIn` (`scan`); the Turn 42 person hub uses `StickFigure`. Beats: the Turn 41 header boot and Turn 42 header boot.
- `IATLatency`: the Turn 43, Turn 44, and Turn 45 primary panels boot with `BootIn` (`scan`); the sorting-task person uses `StickFigure`. Beats: the three primary panel boots.
- `AllportQuestion`: the question header and Allport citation card boot with `BootIn` (`scan`); the bias person mark uses `StickFigure`. Beats: the header boot and citation-card boot.

All kit starts use `Math.round(cueMs * 30 / 1000)` and the original 520 ms entrance duration converted to frames. Each scene root is wrapped in `KitSound mode="beats"`; no incidental motion emits sound.
