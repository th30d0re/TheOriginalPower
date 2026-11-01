import type {Rect} from '@stage';

// Always-on instrument tray: one row of nine mini instruments just above the bottom border
// line (border at y=1060), spanning the inner width x 36..1884. Equal cells with 8px gaps,
// ~198 px each, 100 px tall; bottom edge y=1044 matches the old bottom strips' bottom edge.
export const TRAY = {
  left: 36,
  right: 1884,
  top: 944,
  height: 100,
  gap: 8,
  count: 9,
} as const;
export const TRAY_CELL_WIDTH = (TRAY.right - TRAY.left - TRAY.gap * (TRAY.count - 1)) / TRAY.count; // 198.2222
export const trayCellRect = (i: number): Rect => ({
  x: TRAY.left + i * (TRAY_CELL_WIDTH + TRAY.gap),
  y: TRAY.top,
  width: TRAY_CELL_WIDTH,
  height: TRAY.height,
});

// Tray order, left to right (brief 2026-11-01): Complex Wage Plane, Interference Engine,
// Phase Coherence, Five-Tier Cone, Compounding Ledger, Backlash Oscillator, Thyristor Latch,
// AC Extraction Meter, Snubber Circuit. The Wage plane keeps its fix-pass-3 implementation.
export const TRAY_INSTRUMENTS = [
  'Wage plane',
  'Interference Engine',
  'Phase Coherence',
  'Five-Tier Cone',
  'Compounding Ledger',
  'Backlash oscillator',
  'Thyristor Latch',
  'AC Extraction Meter',
  'Snubber Circuit',
] as const;
