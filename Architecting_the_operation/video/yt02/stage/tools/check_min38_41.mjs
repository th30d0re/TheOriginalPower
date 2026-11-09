import {build} from '/Users/emmanuel/Dev/Tools/scriptCast/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = root + 'tools/.check-min38-41.mjs';
await build({
  entryPoints: [root + 'tools/check_min38_41.tsx'],
  outfile: bundle,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'bundle',
  loader: {'.geojson': 'json', '.mp3': 'file', '.css': 'empty', '.woff': 'empty', '.woff2': 'empty'},
  nodePaths: ['/Users/emmanuel/Dev/Tools/scriptCast/node_modules'],
  alias: {'@stage': '/Users/emmanuel/Dev/Tools/scriptCast/video/src/stage/api.ts', 'remotion': root + 'tools/remotion_stub.tsx'},
  banner: {js: 'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
});
try {
  const snapshot = () => JSON.parse(execFileSync(process.execPath, [bundle], {env: {...process.env, MIN38_41_SNAPSHOT: '1'}, maxBuffer: 32 * 1024 * 1024, encoding: 'utf8'}));
  const first = snapshot(), second = snapshot();
  assert.deepEqual(first, second, 'fresh-process min38_41 markup differs');
  console.log(`PASS: ${first.length} min38_41 frames rendered in two fresh processes; all markup hashes match.`);
  await import('./.check-min38-41.mjs');
} finally {
  unlinkSync(bundle);
}
