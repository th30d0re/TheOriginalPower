import React from 'react';

// Minimal remotion stub for node-side static markup checks. Stage clocks (ClockContext) supply
// all timing; these exports only satisfy the kit's hook calls outside a Remotion composition.
export const useCurrentFrame = () => 0;
export const useVideoConfig = () => ({fps: 30, width: 1920, height: 1080, durationInFrames: 900, id: 'check', defaultProps: {}});
export const AbsoluteFill = ({children, style}: React.PropsWithChildren<{style?: React.CSSProperties}>) => <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>;
export const Audio = () => null;
export const Sequence = ({children}: React.PropsWithChildren) => <>{children}</>;
export const Composition = () => null;
export const staticFile = (path: string) => path;
export const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />;
export const delayRender = () => 1;
export const continueRender = () => undefined;
export const cancelRender = () => undefined;
export const registerRoot = () => undefined;

// Minimal numeric port of remotion's interpolate: linear between adjacent stops, optional
// easing per segment, 'clamp' or 'extend' extrapolation on both ends (default 'extend').
export function interpolate(
  input: number,
  rangeIn: number[],
  rangeOut: number[],
  options?: {easing?: (t: number) => number; extrapolateLeft?: 'clamp' | 'extend'; extrapolateRight?: 'clamp' | 'extend'},
): number {
  if (rangeIn.length !== rangeOut.length || rangeIn.length < 2) {
    throw new Error('interpolate: input and output ranges must match and have at least two stops');
  }
  for (let i = 1; i < rangeIn.length; i++) {
    if (rangeIn[i] <= rangeIn[i-1]) throw new Error('interpolate: input range must be strictly increasing');
  }
  const ease = options?.easing ?? ((t: number) => t);
  const segment = (i: number, value: number) => {
    const t = (value - rangeIn[i-1]) / (rangeIn[i] - rangeIn[i-1]);
    return rangeOut[i-1] + ease(t) * (rangeOut[i] - rangeOut[i-1]);
  };
  if (input <= rangeIn[0]) {
    return (options?.extrapolateLeft ?? 'extend') === 'clamp' ? rangeOut[0] : segment(1, input);
  }
  for (let i = 1; i < rangeIn.length; i++) {
    if (input <= rangeIn[i]) return segment(i, input);
  }
  const last = rangeIn.length - 1;
  return (options?.extrapolateRight ?? 'extend') === 'clamp' ? rangeOut[last] : segment(last, input);
}
