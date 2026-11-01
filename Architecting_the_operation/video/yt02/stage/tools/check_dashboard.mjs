import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({entryPoints:[root+'tools/check_dashboard.tsx'],outfile:root+'tools/.check-dashboard.mjs',bundle:true,platform:'node',format:'esm',packages:'bundle',nodePaths:['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],alias:{'@stage':'/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},banner:{js:'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'}});
try {
 const snapshot=()=>JSON.parse(execFileSync(process.execPath,[root+'tools/.check-dashboard.mjs'],{env:{...process.env,DASHBOARD_SNAPSHOT:'1'},maxBuffer:32*1024*1024,encoding:'utf8'}));
 const first=snapshot(),second=snapshot();
 assert.deepEqual(first,second,'fresh-process right stack / strips markup differs');
 console.log(`PASS: ${first.length} frames rendered twice in fresh Node processes; identical right-stack and strip markup / whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.`);
 await import('./.check-dashboard.mjs');
} finally {unlinkSync(root+'tools/.check-dashboard.mjs');}
