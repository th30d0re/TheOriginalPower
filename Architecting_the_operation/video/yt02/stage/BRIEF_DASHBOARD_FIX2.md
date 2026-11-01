# Brief: dashboard fix pass 2 (draft, queued behind fix pass 1)

Same scope and rules as `BRIEF_DASHBOARD_SCENES.md` and `BRIEF_DASHBOARD_FIX1.md`.

## 1. Compass becomes a widget

Author's note (2026-10-31): "The compass should be made a widget. It shouldn't be like how it is
now." Remove the compass rose drawn on the map. Add an eleventh instrument, `compass`, in the same
glass-panel style as the others, with the three modes:

- **compact**: a small compass rose (~56 px) with N, plus the map's centre coordinates in mono
  (e.g. `38.7°N 9.1°W`) and a scale bar in km that is correct for Equal Earth at the current
  camera (scale varies with latitude on an equal-area projection: compute the bar at the camera
  centre's latitude and say so in the settings view).
- **expanded**: a larger rose, the current camera centre and zoom, the projection name (Equal
  Earth), the scale bar, and the extent of the view in degrees.
- **settings**: projection and its note (equal-area, Šavrič, Patterson and Jenny 2018), map data
  sources and their credits (Natural Earth; the period-boundary dataset once added), units.

All values derive from the camera each frame, so the widget updates during a fly-to. Place it in
a stack where it does not crowd the others (author decides final placement in review; default
bottom of the left stack) and restack from spec sizes. Keep the determinism rule from fix pass 1.

## 2. Period boundaries (pending the research in scratchpad findings_borders.md)

Supply period polities through the `polities` hook from fix pass 1, from the dataset the research
recommends, for 1486 first; credit it in the compass settings view.
