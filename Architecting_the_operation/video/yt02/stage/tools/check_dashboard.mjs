import {build} from '/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules/esbuild/lib/main.js';
import {unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({entryPoints:[root+'tools/check_dashboard.tsx'],outfile:root+'tools/.check-dashboard.mjs',bundle:true,platform:'node',format:'esm',packages:'bundle',nodePaths:['/Users/emmanuel/Documents/Theory/scriptCast-stage/video/node_modules'],alias:{'@stage':'/Users/emmanuel/Documents/Theory/scriptCast-stage/video/src/stage/api.ts'},banner:{js:'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'}});
try {await import('./.check-dashboard.mjs');} finally {unlinkSync(root+'tools/.check-dashboard.mjs');}
