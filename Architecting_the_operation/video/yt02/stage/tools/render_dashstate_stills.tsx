import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {ClockContext, PlanContext, type StagePlan} from '@stage';
import {Dashboard} from '../dashboard/Dashboard';

const root = path.resolve(import.meta.dirname, '..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'review/stage_plan.json'), 'utf8')) as StagePlan;
const outDir = path.join(root, 'tools/out/dashstate');
fs.mkdirSync(outDir, {recursive: true});

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const years = [1441, 1452, 1486, 1619] as const;

for (const year of years) {
  const markup = renderToStaticMarkup(
    <PlanContext.Provider value={plan}>
      <ClockContext.Provider value={{ms: 0, fps: 30, interactive: false}}>
        <Dashboard year={year} />
      </ClockContext.Provider>
    </PlanContext.Provider>
  );

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Dashboard ${year}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #0d1b2a; }
  sub { vertical-align: baseline; position: relative; top: .2em; }
</style>
</head>
<body>
  ${markup}
</body>
</html>`;

  const tmpHtml = path.join(outDir, `.tmp_${year}.html`);
  const outPng = path.join(outDir, `dashboard_${year}.png`);
  fs.writeFileSync(tmpHtml, html, 'utf8');

  try {
    execFileSync(CHROME, [
      '--headless',
      `--screenshot=${outPng}`,
      '--window-size=1920,1080',
      '--default-background-color=0d1b2a',
      tmpHtml,
    ], {stdio: 'pipe'});
  } finally {
    if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
  }

  const stat = fs.statSync(outPng);
  console.log(`PASS: Rendered ${outPng} (${(stat.size / 1024).toFixed(1)} KB) for year ${year}`);
}
