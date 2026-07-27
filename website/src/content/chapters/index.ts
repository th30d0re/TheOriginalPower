// Registry of authored story chapters.
//
// Add each chapter module to `modules` as it lands — order does not matter here.
// The exported `chapters` array is sorted by the chapter's position in
// content/manifest.ts, which is the single source of truth for book order, so
// the index page and prev/next navigation stay correct even when chapters are
// written out of sequence.
import type { ChapterContent } from '../types';
import { manifest } from '../manifest';
import ch00 from './ch00_system_initialization';
import ch01 from './ch01_dynamical_systems';
import ch02 from './ch02_redefining_racism';
import ch03 from './ch03_version_1_0';
import ch04 from './ch04_bacons_rebellion';
import ch05 from './ch05_constitutional_kernel';
import ch06 from './ch06_haitian_export';
import ch07 from './ch07_architecture_of_kinship';
import ch08 from './ch08_gendered_axis';
import ch09 from './ch09_enforcement_engine';

const modules: ChapterContent[] = [
  ch00, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09,
];

const orderOf = (id: string) => {
  const i = manifest.findIndex((e) => e.id === id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

export const chapters: ChapterContent[] = [...modules].sort(
  (a, b) => orderOf(a.meta.id) - orderOf(b.meta.id),
);

// Each chapter module restates the metadata declared in the manifest. Warn in
// development when the two drift apart rather than letting the index and the
// chapter header disagree silently.
if (import.meta.env.DEV) {
  for (const chapter of modules) {
    const entry = manifest.find((e) => e.id === chapter.meta.id);
    if (!entry) {
      console.warn(`[chapters] "${chapter.meta.id}" has no manifest entry.`);
      continue;
    }
    const drifted = (['slug', 'number', 'title', 'era', 'hook', 'accentColor'] as const).filter(
      (key) => chapter.meta[key] !== entry[key],
    );
    if (drifted.length > 0) {
      console.warn(
        `[chapters] "${chapter.meta.id}" diverges from the manifest on: ${drifted.join(', ')}`,
      );
    }
  }
}

export function getChapter(id: string): ChapterContent | undefined {
  return chapters.find((c) => c.meta.id === id);
}

export function getAdjacent(id: string): {
  prev?: ChapterContent;
  next?: ChapterContent;
} {
  const i = chapters.findIndex((c) => c.meta.id === id);
  if (i === -1) return {};
  return { prev: chapters[i - 1], next: chapters[i + 1] };
}
