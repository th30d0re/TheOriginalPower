// Ordered registry of all story chapters. Chapters appear on the index and in
// prev/next navigation in this order. Add each chapter module here as it lands.
import type { ChapterContent } from '../types';
import ch00 from './ch00_system_initialization';

export const chapters: ChapterContent[] = [ch00];

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
