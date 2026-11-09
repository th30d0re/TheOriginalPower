import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({entryPoints:[root+'tools/check_dashboard.tsx'],outfile:root+'tools/.check-dashboard.mjs',bundle:true,platform:'node',format:'esm',packages:'bundle',loader:{'.geojson':'json','.mp3':'file','.css':'empty','.woff':'empty','.woff2':'empty'},nodePaths:['/Users/emmanuel/Dev/Tools/scriptCast/video/node_modules','/Users/emmanuel/Dev/Tools/scriptCast/node_modules','/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],alias:{'@stage':'/Users/emmanuel/Dev/Tools/scriptCast/video/src/stage/api.ts','remotion':root+'tools/remotion_stub.tsx'},banner:{js:'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'}});
try {
 const snapshot=()=>JSON.parse(execFileSync(process.execPath,[root+'tools/.check-dashboard.mjs'],{env:{...process.env,DASHBOARD_SNAPSHOT:'1'},maxBuffer:32*1024*1024,encoding:'utf8'}));
 const first=snapshot(),second=snapshot();
 assert.deepEqual(first,second,'fresh-process stack / tray markup differs');
 console.log(`PASS: ${first.frames.length} frames plus all ${first.tray.length} tray mode renders and ${first.wage.length} moved Wage plane mode renders repeated in fresh Node processes; identical stack/tray markup and whole-Dashboard hashes; state/effect/reducer hooks trap on invocation.`);
 await import('./.check-dashboard.mjs');
} finally {unlinkSync(root+'tools/.check-dashboard.mjs');}
