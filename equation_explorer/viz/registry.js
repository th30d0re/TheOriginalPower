import { KERNEL_VIZ } from './kernel.js';
import { FIELD_VIZ } from './fields.js';
import { COMPLEX_VIZ } from './complexPower.js';
import { WAVE_VIZ } from './waves.js';
import { LAGRANGIAN_VIZ } from './lagrangian.js';

/* Registry of all 3D equation visualizations, keyed by equation id. */
export const VIZ = {
  ...KERNEL_VIZ,
  ...FIELD_VIZ,
  ...COMPLEX_VIZ,
  ...WAVE_VIZ,
  ...LAGRANGIAN_VIZ,
};
