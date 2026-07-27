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
import ch10 from './ch10_the_containment';
import ch14 from './ch14_tweedism';
import ch15 from './ch15_the_recompile';
import ch16 from './ch16_full_algorithm';
import ch18 from './ch18_kinetic_guarantee';
import ch19 from './ch19_the_contradiction';
import ch20 from './ch20_global_containment';
import ch21 from './ch21_algorithmic_epoch';
import ch22 from './ch22_spectral_carrier';
import ch23 from './ch23_post_kinetic_horizon';
import ch24 from './ch24_single_issue_trap';
import ch25 from './ch25_conclusion';
import apxA from './apxA_statutory_sources';
import apxB from './apxB_equation_registry';
import apxC from './apxC_compiled_runtime_log';
import apxD from './apxD_falsifiability';
import apxE from './apxE_geometric_algebra';
import apxF from './apxF_photon_model';
import apxG from './apxG_universality';

const modules: ChapterContent[] = [
  ch00, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch14,
  ch15, ch16, ch18, ch19, ch20, ch21, ch22, ch23, ch24, ch25, apxA, apxB,
  apxC, apxD, apxE, apxF, apxG,
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
