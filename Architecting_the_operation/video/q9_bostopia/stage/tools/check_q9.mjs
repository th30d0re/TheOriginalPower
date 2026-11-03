import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));
const bundle = root + '.check-q9.mjs';
await build({
  entryPoints: [root + 'check_q9.tsx'],
  outfile: bundle,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'bundle',
  jsx: 'automatic',
  nodePaths: ['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],
  alias: {'@stage': '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},
  banner: {js: 'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
});
try {
  const snapshot = () => JSON.parse(execFileSync(process.execPath, [bundle], {env: {...process.env, Q9_SNAPSHOT: '1'}, maxBuffer: 64 * 1024 * 1024, encoding: 'utf8'}));
  const first = snapshot();
  const second = snapshot();
  assert.deepEqual(first, second, 'fresh-process Q9 markup differs');
  console.log(`PASS: ${first.length} Q9 frames rendered in two fresh processes; all markup hashes match.`);
  await import('./.check-q9.mjs');
} finally {
  unlinkSync(bundle);
}
