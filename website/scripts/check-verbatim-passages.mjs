import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const cardsPath = path.join(repositoryRoot, 'website/src/content/equations/cards.ts');
const manuscriptPath = path.join(repositoryRoot, 'Paper/The_Original_Power.tex');
const equationsPath = path.join(repositoryRoot, 'equation_explorer/data/equations.json');

const [cardsSource, manuscript, equationsSource] = await Promise.all([
  readFile(cardsPath, 'utf8'),
  readFile(manuscriptPath, 'utf8'),
  readFile(equationsPath, 'utf8'),
]);

const cardPattern = /label: '([^']+)'[\s\S]*?verbatim: \{[\s\S]*?sourceLine: (\d+),[\s\S]*?source: String\.raw`([^`]*)`/g;
const matches = [...cardsSource.matchAll(cardPattern)];

if (matches.length !== 8) {
  throw new Error(`Expected 8 non-null verbatim passages, found ${matches.length}.`);
}

for (const match of matches) {
  const [, label, recordedLineText, source] = match;
  if (label === undefined || recordedLineText === undefined || source === undefined) {
    throw new Error('Malformed verbatim passage match.');
  }

  const offset = manuscript.indexOf(source);
  if (offset === -1) {
    throw new Error(`${label}: stored source is not a byte-exact manuscript substring.`);
  }

  const actualLine = manuscript.slice(0, offset).split('\n').length;
  const recordedLine = Number(recordedLineText);
  if (actualLine !== recordedLine) {
    throw new Error(`${label}: sourceLine ${recordedLine} does not match manuscript line ${actualLine}.`);
  }

  process.stdout.write(`PASS ${label} (line ${actualLine}, ${Buffer.byteLength(source, 'utf8')} bytes)\n`);
}

process.stdout.write(`PASS all ${matches.length} verbatim passages are byte-exact contiguous substrings.\n`);

const authoritativeEquations = new Map(JSON.parse(equationsSource).equations.map((equation) => [equation.label, equation.latex]));
const latexPattern = /label: '([^']+)',\s+latex: ('(?:\\.|[^'])+'),/g;
const latexMatches = [...cardsSource.matchAll(latexPattern)];

if (latexMatches.length !== 8) {
  throw new Error(`Expected 8 equation LaTeX entries, found ${latexMatches.length}.`);
}

for (const match of latexMatches) {
  const [, label, literal] = match;
  if (label === undefined || literal === undefined) throw new Error('Malformed equation LaTeX match.');
  const decoded = JSON.parse(`"${literal.slice(1, -1).replaceAll('"', '\\"')}"`);
  if (decoded !== authoritativeEquations.get(label)) {
    throw new Error(`${label}: card LaTeX differs from equation_explorer/data/equations.json.`);
  }
}

process.stdout.write('PASS all 8 equation LaTeX strings match the authoritative registry byte-for-byte.\n');
