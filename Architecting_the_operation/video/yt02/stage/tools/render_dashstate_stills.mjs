import {build} from '/Users/emmanuel/Dev/Tools/scriptCast/node_modules/esbuild/lib/main.js';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = root + 'tools/.render-dashstate-stills.mjs';

await build({
  entryPoints: [root + 'tools/render_dashstate_stills.tsx'],
  outfile: bundle,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'bundle',
  loader: {'.geojson': 'json', '.mp3': 'file', '.css': 'empty', '.woff': 'empty', '.woff2': 'empty'},
  nodePaths: [
    '/Users/emmanuel/Dev/Tools/scriptCast/video/node_modules',
    '/Users/emmanuel/Dev/Tools/scriptCast/node_modules',
    '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules',
  ],
  alias: {
    '@stage': '/Users/emmanuel/Dev/Tools/scriptCast/video/src/stage/api.ts',
    'remotion': root + 'tools/remotion_stub.tsx',
  },
  banner: {js: 'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
});

try {
  execFileSync(process.execPath, [bundle], {stdio: 'inherit'});
} finally {
  unlinkSync(bundle);
}
