# Running the YT02 Stage checks in a cloud container

The episode code hard-codes the author's machine paths: the `tsconfig.json` paths and the
font imports in `index.ts` point at `/Users/emmanuel/Documents/Theory/...`. Reproduce those paths
and the checks run unchanged. **Do not edit those paths in the repo.**

1. Clone the engine beside this repo, on its branch:
   `git clone --branch v0.3-stage --depth 1 https://github.com/th30d0re/scriptCast.git ../scriptCast-stage`
2. Recreate the author's paths with symlinks (use `sudo` if `/Users` is not writable):
   ```bash
   mkdir -p /Users/emmanuel/Documents/Theory
   ln -sfn "$(pwd)" /Users/emmanuel/Documents/Theory/TheOriginalPower
   ln -sfn "$(cd ../scriptCast-stage && pwd)" /Users/emmanuel/Documents/Theory/scriptCast-stage
   ```
3. Install the engine's video dependencies:
   `cd /Users/emmanuel/Documents/Theory/scriptCast-stage/video && npm ci`
   (use `npm install` if `npm ci` fails on the lockfile).
4. Run from `/Users/emmanuel/Documents/Theory/TheOriginalPower`:
   - Type-check:
     `npx --prefix /Users/emmanuel/Documents/Theory/scriptCast-stage/video tsc --noEmit -p Architecting_the_operation/video/yt02/stage`
   - Each scene check:
     `node Architecting_the_operation/video/yt02/stage/tools/check_<name>.mjs`
5. **Skip:**
   - The plan compile, which needs the author's Python venv. `stage_ov.yaml` does not change in
     this task.
   - Rendering, which needs Chrome. The orchestrator renders locally.
