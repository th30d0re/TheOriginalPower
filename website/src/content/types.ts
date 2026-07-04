// Content schema for the chapter-by-chapter story mode.
// Every chapter is a data module conforming to ChapterContent; the engine in
// src/story/ renders it. Visual kinds resolve through src/story/visuals/SceneVisual.

export interface TimelineEvent {
  year: number;
  event: string;
  outgroup: string[];
}

export interface VennDiagramData {
  inGroup: { label: string; members: string[] };
  outGroup: { label: string; members: string[] };
  elite?: { label: string; members: string[] };
}

/** Discriminated union of every visual a scene can request. */
export type VisualSpec =
  | { kind: 'venn'; data: VennDiagramData; caption?: string }
  | { kind: 'timeline'; data: TimelineEvent[]; caption?: string }
  /** Self-contained D3 out-group growth chart (no data props yet). */
  | { kind: 'expansion'; caption?: string }
  /** Self-contained compounding-metrics explorer. */
  | { kind: 'compounding'; caption?: string }
  /** Self-contained phasor/resonance animation. */
  | { kind: 'phasor'; caption?: string }
  /** Manim MP4 from public/animations, e.g. src: '/animations/ComplexWage.mp4'. */
  | { kind: 'manim'; src: string; caption?: string }
  /** Display equation rendered with KaTeX (display mode). */
  | { kind: 'equation'; latex: string; label?: string; caption?: string }
  /** Escape hatch for bespoke chapter visuals registered by name. */
  | { kind: 'custom'; component: string; props?: Record<string, unknown>; caption?: string };

export interface KeyConcept {
  term: string;
  definition: string;
}

/** Verbatim manuscript excerpts + formal machinery behind a "Go deeper" expandable. */
export interface DeepDive {
  /** Toggle label; defaults to "Go deeper". */
  label?: string;
  passages: Array<{
    heading?: string;
    /** Verbatim manuscript paragraphs (plain text, LaTeX markup stripped). */
    paragraphs: string[];
  }>;
  equations?: Array<{ latex: string; label?: string; note?: string }>;
}

export interface Scene {
  /** Stable id unique within the chapter, e.g. 'the-buffer-class'. */
  id: string;
  title?: string;
  /** Adapted narrative paragraphs. Affirmative declarative voice only. */
  prose: string[];
  visual?: VisualSpec;
  keyConcepts?: KeyConcept[];
  deepDive?: DeepDive;
}

export interface ChapterMeta {
  /** Canonical id used in routes: 'ch00' … 'ch22'. */
  id: string;
  /** URL slug appended nowhere yet; kept for future pretty routes. */
  slug: string;
  /** Display number; 0 for System Initialization. */
  number: number;
  title: string;
  /** Human era span shown on cards and headers, e.g. '1676–1787'. */
  era: string;
  /** One-line hook for the story index card. */
  hook: string;
  epigraph?: { text: string; attribution?: string };
  /** CSS color used for the chapter's accent (progress rail, headings). */
  accentColor: string;
  heroVisual?: VisualSpec;
}

export interface ChapterContent {
  meta: ChapterMeta;
  scenes: Scene[];
}
