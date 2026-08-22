import storyJoinData from './story-join.json';
import { equationSymbols, type EquationSymbol } from './symbols';

export interface StoryValidationSource {
  name: string | null;
  type: string | null;
  url: string | null;
}

export interface StoryValidation {
  tier: 1 | 2 | 3;
  type: string | null;
  falsification: string | null;
  dataSources: readonly StoryValidationSource[];
  targetEvents: readonly string[];
  caseStudyLine: string | number | null;
  notebook: string | null;
}

export interface StoryEquationJoinEntry {
  chapterFile: string;
  chapterId: string;
  occurrence: number;
  storyLabel: string | null;
  storyCaption: string | null;
  latex: string;
  registry: {
    id: string;
    label: string;
    chapter: string;
    section: string;
    line: number;
    sourceFile: string;
  } | null;
  validation: StoryValidation | null;
  enrichment: 'full' | 'partial' | 'none';
  collision?: readonly string[];
}

export const storyEquationJoin = storyJoinData as readonly StoryEquationJoinEntry[];

export const findStoryEquation = (chapterFile: string, occurrence: number) =>
  storyEquationJoin.find((entry) => (
    entry.chapterFile === chapterFile && entry.occurrence === occurrence
  ));

export const chapterFileForStory = (chapterId: string) =>
  storyEquationJoin.find((entry) => entry.chapterId === chapterId)?.chapterFile;

const insideTextCommand = (latex: string, index: number) => {
  const start = latex.lastIndexOf('\\text{', index);
  if (start === -1) return false;
  const segment = latex.slice(start + 6, index);
  return [...segment].reduce((depth, character) => (
    character === '{' ? depth + 1 : character === '}' ? depth - 1 : depth
  ), 1) > 0;
};

export const isStandaloneSymbol = (latex: string, index: number, symbolLatex: string) => {
  if (symbolLatex.length !== 1 || !/[A-Za-z0-9]/.test(symbolLatex)) return true;
  const before = latex[index - 1] ?? '';
  const after = latex[index + 1] ?? '';
  return before !== '\\' && !/[A-Za-z0-9]/.test(before + after) && !insideTextCommand(latex, index);
};

const symbolRanges = (latex: string, entry: EquationSymbol): readonly [number, number][] => {
  const ranges: [number, number][] = [];
  let index = latex.indexOf(entry.latex);
  while (index !== -1) {
    if (isStandaloneSymbol(latex, index, entry.latex)) {
      ranges.push([index, index + entry.latex.length]);
    }
    index = latex.indexOf(entry.latex, index + entry.latex.length);
  }
  return ranges;
};

export const symbolsForLatex = (latex: string): readonly EquationSymbol[] => {
  const matches = Object.values(equationSymbols).map((entry) => ({
    entry,
    ranges: symbolRanges(latex, entry),
  })).filter(({ ranges }) => ranges.length > 0);

  return matches.filter(({ entry }) => !matches.some(({ entry: other }) => (
    other.latex.length > entry.latex.length && other.latex.includes(entry.latex)
  ))).map(({ entry }) => entry);
};
