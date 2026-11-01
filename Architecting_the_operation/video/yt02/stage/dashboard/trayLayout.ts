import type {Rect} from '@stage';

// Always-on instrument tray: one row of eight mini instruments just above the bottom border
// line (border at y=1060), spanning the inner width x 36..1884. Equal 224px cells with 8px
// gaps, 100px tall; bottom edge y=1044 matches the old bottom strips' bottom edge.
export const TRAY = {
  left: 36,
  right: 1884,
  top: 944,
  height: 100,
  gap: 8,
  count: 8,
} as const;
export const TRAY_CELL_WIDTH = (TRAY.right - TRAY.left - TRAY.gap * (TRAY.count - 1)) / TRAY.count; // 224
export const trayCellRect = (i: number): Rect => ({
  x: TRAY.left + i * (TRAY_CELL_WIDTH + TRAY.gap),
  y: TRAY.top,
  width: TRAY_CELL_WIDTH,
  height: TRAY.height,
});

// Tray order, left to right (fix pass 2, 2026-11-01). The Wage plane returns to the right
// stack and keeps its fix-pass-3 expanded and settings implementation.
export const TRAY_INSTRUMENTS = [
  'Interference Engine',
  'Phase Coherence',
  'Five-Tier Cone',
  'Compounding Ledger',
  'Backlash oscillator',
  'Thyristor Latch',
  'AC Extraction Meter',
  'Snubber Circuit',
] as const;
