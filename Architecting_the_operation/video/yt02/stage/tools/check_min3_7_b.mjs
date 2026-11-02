import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=root+'tools/.check-min3-7-b.mjs';
await build({
  entryPoints:[root+'tools/check_min3_7_b.tsx'],
  outfile:bundle,
  bundle:true,
  platform:'node',
  format:'esm',
  packages:'bundle',
  nodePaths:['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],
  alias:{'@stage':'/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},
  banner:{js:'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
});
try{
  const snapshot=()=>JSON.parse(execFileSync(process.execPath,[bundle],{env:{...process.env,MIN3_7_B_SNAPSHOT:'1'},maxBuffer:32*1024*1024,encoding:'utf8'}));
  const first=snapshot(),second=snapshot();
  assert.deepEqual(first,second,'fresh-process Package B markup differs');
  console.log(`PASS: ${first.length} Package B frames rendered in two fresh processes; all markup hashes match.`);
  await import('./.check-min3-7-b.mjs');
}finally{
  unlinkSync(bundle);
}
