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

/** One plotted series for the generic `series` chart. */
export interface ChartSeries {
  label: string;
  /** CSS color; defaults to the chapter accent when omitted. */
  color?: string;
  points: Array<{ x: number; y: number }>;
}

/** One rung of the five-tier extraction hierarchy. */
export interface Tier {
  /** Formal set symbol, e.g. 'E', 'P', 'F', 'I', 'O'. */
  symbol: string;
  name: string;
  description: string;
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
  /** The 3D interference engine (electoral carrier / field superposition). */
  | { kind: 'interference'; caption?: string }
  /** The Smith-chart-style extraction chart from Appendix H. */
  | { kind: 'extractionChart'; caption?: string }
  /** Generic quantitative line/area chart for empirical claims. */
  | {
      kind: 'series';
      series: ChartSeries[];
      xLabel?: string;
      yLabel?: string;
      /** Render filled areas under each line. */
      area?: boolean;
      caption?: string;
    }
  /** The five-tier hierarchy, revealed rung by rung on scroll. */
  | { kind: 'tierLadder'; tiers: Tier[]; caption?: string }
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

/** One line of a RUNTIME LOG box: a diagnostic field and its value. */
export interface RuntimeLogLine {
  field: string;
  value: string;
}

/**
 * Body content of a scene. The manuscript's own structural vocabulary —
 * RUNTIME LOG boxes, keyinsight/historicalsource callouts, and the
 * theorem-like environments — each map to a block kind so chapter modules keep
 * the source's shape instead of flattening everything into paragraphs.
 */
export type ContentBlock =
  /** Ordinary narrative paragraphs. */
  | { kind: 'prose'; paragraphs: string[] }
  /** Terminal-styled execution trace; opens most chapters in the manuscript. */
  | { kind: 'runtimeLog'; title: string; lines: RuntimeLogLine[] }
  /** Emphasised takeaway (manuscript `keyinsight`). */
  | { kind: 'insight'; heading?: string; paragraphs: string[] }
  /** Primary-source excerpt (manuscript `historicalsource`). */
  | { kind: 'source'; heading?: string; paragraphs: string[]; attribution?: string }
  /** Formal machinery (manuscript `definition`/`theorem`/`conjecture`/`proof`). */
  | {
      kind: 'formal';
      variant: 'definition' | 'theorem' | 'conjecture' | 'proof';
      label?: string;
      paragraphs: string[];
      equations?: Array<{ latex: string; label?: string }>;
    }
  /** Full-width typographic emphasis for a single load-bearing sentence. */
  | { kind: 'pullquote'; text: string; attribution?: string }
  /** A visual placed at an exact point in the body. */
  | { kind: 'visual'; spec: VisualSpec };

export interface Scene {
  /** Stable id unique within the chapter, e.g. 'the-buffer-class'. */
  id: string;
  title?: string;
  /**
   * Shorthand for a single leading prose block. The engine normalizes this
   * into `blocks`, so a scene may use `prose`, `blocks`, or both (prose first).
   * Affirmative declarative voice only — see AGENTS.md.
   */
  prose?: string[];
  /** Rich body content, rendered in order after any `prose`. */
  blocks?: ContentBlock[];
  /** Convenience visual rendered after the body. Use a `visual` block for precise placement. */
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
