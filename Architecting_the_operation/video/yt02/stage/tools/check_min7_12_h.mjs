import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundle = root + 'tools/.check-min7-12-h.mjs';
await build({
  entryPoints: [root + 'tools/check_min7_12_h.tsx'],
  outfile: bundle,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'bundle',
  loader: {'.geojson': 'json', '.mp3': 'file'},
  nodePaths: ['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],
  alias: {'@stage': '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},
  banner: {js: 'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
});
try {
  const snapshot = () => JSON.parse(execFileSync(process.execPath, [bundle], {env: {...process.env, MIN7_12_H_SNAPSHOT: '1'}, maxBuffer: 32 * 1024 * 1024, encoding: 'utf8'}));
  const first = snapshot(), second = snapshot();
  assert.deepEqual(first, second, 'fresh-process Package H markup differs');
  console.log(`PASS: ${first.length} Package H frames rendered in two fresh processes; all markup hashes match.`);
  await import('./.check-min7-12-h.mjs');
} finally {
  unlinkSync(bundle);
}
