export interface VideolabJob {
  slug: string;
  private: boolean;
  created_at: string;
  status: string;
  platform: string | null;
  title: string | null;
  creator: Record<string, unknown>;
  duration_seconds: number | null;
  engagement: Record<string, unknown>;
  concepts: string[];
  job: Record<string, unknown>;
  metadata: Record<string, unknown>;
  transcript: { text?: string; segments?: Array<Record<string, unknown>> };
  ocr: Array<Record<string, unknown>>;
  frames: Array<Record<string, unknown>>;
}

export function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function text(value: unknown, fallback = '—'): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export function seconds(value: unknown): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  const total = Math.max(0, Math.floor(value));
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
