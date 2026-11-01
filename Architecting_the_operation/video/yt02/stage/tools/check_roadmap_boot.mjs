import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({entryPoints:[root+'tools/check_roadmap_boot.tsx'],outfile:root+'tools/.check-roadmap-boot.mjs',bundle:true,platform:'node',format:'esm',packages:'bundle',loader:{'.geojson':'json'},nodePaths:['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],alias:{'@stage':'/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},banner:{js:'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'}});
try {
 const snapshot=()=>JSON.parse(execFileSync(process.execPath,[root+'tools/.check-roadmap-boot.mjs'],{env:{...process.env,ROADMAP_BOOT_SNAPSHOT:'1'},maxBuffer:32*1024*1024,encoding:'utf8'}));
 const first=snapshot(),second=snapshot();
 assert.deepEqual(first,second,'fresh-process RoadmapBoot markup differs');
 console.log(`PASS: ${first.frames.length} RoadmapBoot frames rendered in two fresh Node processes with identical markup; state/effect/reducer/ref hooks trap on invocation.`);
 await import('./.check-roadmap-boot.mjs');
} finally {unlinkSync(root+'tools/.check-roadmap-boot.mjs');}
