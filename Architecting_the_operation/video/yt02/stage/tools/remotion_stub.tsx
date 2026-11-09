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
export const delayRender = () => 1;
export const continueRender = () => undefined;
export const cancelRender = () => undefined;
export const registerRoot = () => undefined;
