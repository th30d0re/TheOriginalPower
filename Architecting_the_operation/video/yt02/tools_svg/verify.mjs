// Pixel-identity verification for the SVG slim.
// Renders original and slimmed SVG with resvg and compares with pixelmatch at
// threshold 0. Maps and files narrower than 1000 px are additionally compared
// at 2x, where thin strokes expose rounding drift.
//
// Importable (used by slim.mjs) and runnable standalone:
//   node tools_svg/verify.mjs     re-verifies every backup in /tmp/svg-slim-orig
//                                 against the working tree, exit 1 on any failure.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/tmp/svg-verify/package.json');
const { Resvg } = require('@resvg/resvg-js');
const pixelmatchMod = require('pixelmatch');
const pixelmatch = pixelmatchMod.default ?? pixelmatchMod;
const { PNG } = require('pngjs');

export const REPO = '/Users/emmanuel/Documents/Theory/TheOriginalPower';
export const YT02 = path.join(REPO, 'Architecting_the_operation/video/yt02');
export const BACKUP = '/tmp/svg-slim-orig';

export const AA_MAX_PCT = 0.0001; // 0.01% of pixels
export const AA_MAX_CHANNEL_DELTA = 8; // per channel, out of 255

export function scopeFiles() {
  const out = [];
  const handoff = path.join(YT02, 'stage/handoff/svg');
  for (const f of fs.readdirSync(handoff)) {
    if (f.endsWith('.svg')) out.push(path.join(handoff, f));
  }
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.svg')) out.push(p);
    }
  };
  walk(path.join(YT02, 'figma'));
  return out.sort();
}

function render(svg, scale, loadFonts) {
  return new Resvg(svg, {
    fitTo: { mode: 'zoom', value: scale },
    font: { loadSystemFonts: loadFonts },
  }).render();
}

function compareAtScale(origSvg, slimSvg, scale, loadFonts) {
  const a = PNG.sync.read(Buffer.from(render(origSvg, scale, loadFonts).asPng()));
  const b = PNG.sync.read(Buffer.from(render(slimSvg, scale, loadFonts).asPng()));
  const base = { scale, width: a.width, height: a.height };
  if (a.width !== b.width || a.height !== b.height) {
    return {
      ...base,
      sizeMismatch: true,
      slimWidth: b.width,
      slimHeight: b.height,
      diffPixels: a.width * a.height,
      totalPixels: a.width * a.height,
      maxChannelDelta: 255,
    };
  }
  const diffPixels = pixelmatch(a.data, b.data, null, a.width, a.height, {
    threshold: 0,
    includeAA: true,
  });
  let maxChannelDelta = 0;
  if (diffPixels > 0) {
    for (let i = 0; i < a.data.length; i += 4) {
      for (let c = 0; c < 4; c++) {
        const d = Math.abs(a.data[i + c] - b.data[i + c]);
        if (d > maxChannelDelta) maxChannelDelta = d;
      }
    }
  }
  return {
    ...base,
    sizeMismatch: false,
    diffPixels,
    totalPixels: a.width * a.height,
    maxChannelDelta,
  };
}

// Returns { status: 'pass' | 'pass-aa-tolerance' | 'fail', checks, diffPixels, maxChannelDelta }.
export function verifyPair(origPath, slimPath) {
  const origSvg = fs.readFileSync(origPath, 'utf8');
  const slimSvg = fs.readFileSync(slimPath, 'utf8');
  const loadFonts = /<text[\s>]/.test(origSvg) || /<text[\s>]/.test(slimSvg);
  const checks = [compareAtScale(origSvg, slimSvg, 1, loadFonts)];
  const first = checks[0];
  const isMap = /map/i.test(path.basename(origPath));
  if (!first.sizeMismatch && (first.width < 1000 || isMap)) {
    checks.push(compareAtScale(origSvg, slimSvg, 2, loadFonts));
  }
  let status = 'pass';
  let sawDiff = false;
  for (const c of checks) {
    if (c.sizeMismatch) {
      status = 'fail';
      continue;
    }
    if (c.diffPixels > 0) {
      sawDiff = true;
      const pct = c.diffPixels / c.totalPixels;
      if (!(pct <= AA_MAX_PCT && c.maxChannelDelta <= AA_MAX_CHANNEL_DELTA)) {
        status = 'fail';
      }
    }
  }
  if (status === 'pass' && sawDiff) status = 'pass-aa-tolerance';
  const worst = checks.reduce((m, c) => (c.diffPixels > m.diffPixels ? c : m));
  const maxChannelDelta = Math.max(...checks.map((c) => c.maxChannelDelta));
  return { status, checks, diffPixels: worst.diffPixels, maxChannelDelta };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = scopeFiles();
  let failed = 0;
  let tolerated = 0;
  for (const file of files) {
    const rel = path.relative(REPO, file);
    const backup = path.join(BACKUP, rel);
    if (!fs.existsSync(backup)) {
      console.error(`NO BACKUP  ${rel}`);
      failed++;
      continue;
    }
    const v = verifyPair(backup, file);
    if (v.status === 'fail') {
      failed++;
      console.error(`FAIL       ${rel}  diffPixels=${v.diffPixels} maxDelta=${v.maxChannelDelta}`);
    } else if (v.status === 'pass-aa-tolerance') {
      tolerated++;
      console.log(`TOLERATED  ${rel}  diffPixels=${v.diffPixels} maxDelta=${v.maxChannelDelta}`);
    }
  }
  console.log(`verified ${files.length} files: ${files.length - failed - tolerated} exact, ${tolerated} within AA tolerance, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
