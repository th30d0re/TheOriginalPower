/** Dark-theme equation symbol colours from website/src/components/EquationCards.css, lines 425–438. */
export const EQUATION_PALETTE = [
  '#7dd3fc', '#fca5a5', '#fde047', '#86efac', '#c4b5fd', '#fdba74', '#f9a8d4',
  '#a5f3fc', '#d9f99d', '#e2e8f0', '#93c5fd', '#f0abfc', '#bef264', '#fda4af',
] as const;

export type EquationPaletteSlot = 0|1|2|3|4|5|6|7|8|9|10|11|12|13;

export const equationColor = (slot: number) => EQUATION_PALETTE[slot] ?? EQUATION_PALETTE[0];
