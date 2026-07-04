// Per-chapter reading progress persisted in localStorage.
// ChapterPage writes; StoryIndex reads.

const KEY = 'op-story-progress-v1';

export type ChapterProgress = 'unread' | 'visited' | 'completed';

type ProgressMap = Record<string, ChapterProgress>;

function load(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ProgressMap;
  } catch {
    return {};
  }
}

function save(map: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // storage unavailable (private mode) — progress is a nicety, not a requirement
  }
}

export function getProgress(chapterId: string): ChapterProgress {
  return load()[chapterId] ?? 'unread';
}

export function getAllProgress(): ProgressMap {
  return load();
}

export function markVisited(chapterId: string) {
  const map = load();
  if (map[chapterId] !== 'completed') {
    map[chapterId] = 'visited';
    save(map);
  }
}

export function markCompleted(chapterId: string) {
  const map = load();
  map[chapterId] = 'completed';
  save(map);
}
