// Slims the YT02 design SVGs in place with the local SVGO clone and keeps only
// slim versions that verify pixel-identical via verify.mjs.
//
//   node tools_svg/slim.mjs           slim new exports, skip files already reported
//   node tools_svg/slim.mjs --force   restore every backup and re-slim from scratch
//
// Per file: back up the original to /tmp/svg-slim-orig/<repo-relative path>,
// then try floatPrecision 3, 4, 5 with the full preset, then a reduced plugin
// set (no geometry rewriting) at precision 5. The first attempt that verifies
// is written in place. A file that fails every attempt, or that would grow,
// keeps its original.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { makeConfig } from './svgo.config.mjs';
import { verifyPair, scopeFiles, REPO, YT02, BACKUP } from './verify.mjs';

const { optimize } = await import(
  pathToFileURL(path.join(REPO, 'tools/svgo/lib/svgo.js')).href
);

const WORK = '/tmp/svg-slim-work';
const REPORT = path.join(YT02, 'tools_svg/report.json');
const EXCLUDE = new Map([
  [
    'Architecting_the_operation/video/yt02/stage/handoff/svg/border-compact.svg',
    'excluded: stage/tools/svg_to_tsx.mjs reads it with case-sensitive regexes (fill="#F5F5F5")',
  ],
]);
const ATTEMPTS = [
  { precision: 3, reduced: false },
  { precision: 4, reduced: false },
  { precision: 5, reduced: false },
  { precision: 5, reduced: true },
];

const force = process.argv.includes('--force');
const prior = fs.existsSync(REPORT)
  ? JSON.parse(fs.readFileSync(REPORT, 'utf8'))
  : { entries: [] };
const priorByPath = new Map(prior.entries.map((e) => [e.path, e]));

const entries = [];
let done = 0;

for (const file of scopeFiles()) {
  const rel = path.relative(REPO, file);
  const backup = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(backup), { recursive: true });

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(file, backup);
  } else if (force) {
    fs.copyFileSync(backup, file);
  } else if (priorByPath.has(rel)) {
    entries.push(priorByPath.get(rel));
    continue;
  }

  const origBytes = fs.statSync(backup).size;
  const source = fs.readFileSync(backup, 'utf8');

  if (EXCLUDE.has(rel)) {
    entries.push({
      path: rel,
      bytesBefore: origBytes,
      bytesAfter: origBytes,
      pctSaved: 0,
      status: 'kept-original',
      reason: EXCLUDE.get(rel),
      precision: null,
      diffPixels: 0,
      maxChannelDelta: 0,
      checks: [],
    });
    continue;
  }

  let final = null;
  const attemptLog = [];
  for (const attempt of ATTEMPTS) {
    const cfg = makeConfig(attempt.precision, { reduced: attempt.reduced });
    let out;
    try {
      out = optimize(source, { ...cfg, path: file });
    } catch (err) {
      attemptLog.push({ ...attempt, error: String(err.message ?? err) });
      continue;
    }
    const workPath = path.join(WORK, rel);
    fs.mkdirSync(path.dirname(workPath), { recursive: true });
    fs.writeFileSync(workPath, out.data);
    const v = verifyPair(backup, workPath);
    attemptLog.push({
      ...attempt,
      bytes: Buffer.byteLength(out.data),
      status: v.status,
      diffPixels: v.diffPixels,
      maxChannelDelta: v.maxChannelDelta,
    });
    if (v.status !== 'fail') {
      final = { out, v, attempt };
      break;
    }
  }

  if (final && Buffer.byteLength(final.out.data) < origBytes) {
    fs.writeFileSync(file, final.out.data);
    const after = Buffer.byteLength(final.out.data);
    entries.push({
      path: rel,
      bytesBefore: origBytes,
      bytesAfter: after,
      pctSaved: +(((origBytes - after) / origBytes) * 100).toFixed(2),
      status: final.v.status,
      precision: final.attempt.precision,
      reducedPlugins: final.attempt.reduced || undefined,
      diffPixels: final.v.diffPixels,
      maxChannelDelta: final.v.maxChannelDelta,
      checks: final.v.checks,
      reason: final.v.status === 'pass-aa-tolerance' ? 'anti-aliasing noise within tolerance' : undefined,
    });
  } else {
    fs.copyFileSync(backup, file);
    const last = attemptLog.filter((a) => !a.error).at(-1) ?? {};
    entries.push({
      path: rel,
      bytesBefore: origBytes,
      bytesAfter: origBytes,
      pctSaved: 0,
      status: 'kept-original',
      reason: final
        ? 'slim output not smaller than original'
        : `pixel diff survived all attempts (last: ${last.status} diffPixels=${last.diffPixels} maxDelta=${last.maxChannelDelta})`,
      precision: null,
      diffPixels: last.diffPixels ?? 0,
      maxChannelDelta: last.maxChannelDelta ?? 0,
      checks: [],
      attempts: attemptLog,
    });
  }
  done++;
  if (done % 20 === 0) console.log(`… ${done} files processed`);
}

entries.sort((a, b) => a.path.localeCompare(b.path));

const sum = (pred) => {
  const sel = entries.filter(pred);
  return {
    files: sel.length,
    bytesBefore: sel.reduce((s, e) => s + e.bytesBefore, 0),
    bytesAfter: sel.reduce((m, e) => m + e.bytesAfter, 0),
  };
};
const totals = {
  handoff: sum((e) => e.path.includes('stage/handoff/svg/')),
  figma: sum((e) => e.path.includes('/figma/')),
  overall: sum(() => true),
};

const report = {
  generatedAt: new Date().toISOString(),
  svgoVersion: '4.1.0',
  baseConfig: 'preset-default, removeViewBox:false, floatPrecision:3, multipass',
  entries,
  totals,
};
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');

const kept = entries.filter((e) => e.status === 'kept-original').length;
const tol = entries.filter((e) => e.status === 'pass-aa-tolerance').length;
console.log(
  `done: ${entries.length} files, ${entries.length - kept - tol} exact pass, ${tol} AA tolerance, ${kept} kept-original`,
);
console.log(
  `overall ${totals.overall.bytesBefore} -> ${totals.overall.bytesAfter} bytes`,
);
