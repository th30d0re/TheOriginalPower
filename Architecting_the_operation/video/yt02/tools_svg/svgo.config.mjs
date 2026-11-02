// SVGO configuration for the YT02 design SVGs.
// Used by tools_svg/slim.mjs, which derives per-file precision and reduced-plugin
// variants from makeConfig(). The default export is the canonical full config at
// floatPrecision 3, valid for the local CLI as well:
//   node tools/svgo/bin/svgo.js --config <this file> --input <svg> --output <svg>
//
// Safety decisions for the consumers of these files:
// - viewBox needs no override: preset-default in SVGO 4.1.0 has no removeViewBox
//   plugin, so viewBox (like width/height) is kept by default.
// - cleanupIds stays enabled with its default behavior, which removes only
//   unreferenced ids; ids referenced from url(#…), href="#…" and xlink:href
//   are preserved (99 figma files reference glyph ids through xlink:href).
// - convertPathData keeps its size wins but loses three sub-options:
//   convertToQ rewrites cubics as quadratics and changed the render on
//   figma/v2/assets_vec/vec.eq31.svg (5 px, 32/255 delta, at any precision);
//   makeArcs replaces arc-like curves with A commands under a 0.5%-of-radius
//   tolerance, which is lossy by design; collapseRepeated combined with
//   lineShorthands shifted map geometry on stage/handoff/svg/map.iberia.svg
//   (7790 px, 24/255 delta, at any precision) — disabling collapseRepeated is
//   the cheaper side of that interaction and removes it.
// - floatPrecision starts at 3; slim.mjs raises it per file only where the
//   pixel check fails.
// - border-compact.svg is excluded upstream in slim.mjs: svg_to_tsx.mjs parses
//   it with case-sensitive regexes.

const GEOMETRY_PLUGINS = [
  'convertPathData',
  'convertTransform',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'cleanupNumericValues',
  'mergePaths',
];

export function makeConfig(floatPrecision = 3, { reduced = false } = {}) {
  const overrides = {
    convertPathData: { floatPrecision, makeArcs: false, convertToQ: false, collapseRepeated: false },
    convertTransform: { floatPrecision },
    cleanupNumericValues: { floatPrecision },
  };
  if (reduced) {
    for (const name of GEOMETRY_PLUGINS) overrides[name] = false;
  }
  return {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: { overrides },
      },
    ],
  };
}

export default makeConfig(3);
