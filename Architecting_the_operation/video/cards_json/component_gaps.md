# Component Gaps

1. **G-05 (Neighborhood disadvantage vs. poverty) - Single Bar Coloring**
   * **Issue**: `StatBarsCard` always renders the first bar in a `values` array as `p.mute` (grey). When trying to display two separate single-bar metrics that compare different concepts (High-disadvantage vs. Poverty), passing single-item arrays results in both bars being muted. We lose the `teal` and `gold` color distinction.
   * **Proposal**: Allow an overriding `barColors` prop or an option to disable the automatic index-0 muting when a group only contains one value.

2. **G-06, G-12, G-15 - SVG Asset Height Limitation**
   * **Issue**: The `svgAsset` slot in `Frame.tsx` is hardcoded to a 64px height. This is a severe limitation for visually important assets like the Boston HOLC map (G-06) or the detailed AR-15 vs. Mini-14 comparison (G-15). At 64px, technical silhouettes and map excerpts are barely legible on a phone screen.
   * **Proposal**: Add a `largeAsset` boolean prop to `BaseProps` to allow the SVG slot to consume more vertical space (e.g., 200px), or introduce a dedicated `ImageCard` / `DiagramCard` component.

3. **G-03 - Text Styling for Contrast**
   * **Issue**: The shot list requests the right-side text ("What should the government do?") to be "greyed out or with a strike-through until the reveal". `CompareCard` maps points directly into `<p>` tags without any per-item styling capabilities.
   * **Proposal**: Add a `textState` prop (e.g., `"muted"` or `"strikethrough"`) to the points in `CompareCard` to support these contrast builds.

4. **G-01 - Freeze-frame Annotation**
   * **Note**: G-01 is intentionally skipped as a JSON card. It requires a freeze-frame annotation drawn directly over the real paused reel frame, which falls outside the scope of synthesized JSON components and must be handled in the edit.
