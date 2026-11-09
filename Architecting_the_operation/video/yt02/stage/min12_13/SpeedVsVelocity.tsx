import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);
const Text = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => <Flicker startFrame={frame(at)} durationFrames={14} beat><div data-text="speed-velocity" data-box={`${box.x} ${box.y} ${box.w} ${box.h}`} style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.16, color: color(tone)}}>{children}</div></Flicker>;
const Panel = ({box, at}: {box: {x: number; y: number; w: number; h: number}; at: number}) => <><BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat/><DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken="color/line/hairline-strong" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/></>;

export function SpeedVsVelocity({segment}: SceneProps) {
  const cue = {physics: useCue('t65Physics').at, scalar: useCue('t65Scalar').at, size: useCue('t65Size').at, speed: useCue('t65Speed').at, speedometer: useCue('t65Speedometer').at, vector: useCue('t65Vector').at, both: useCue('t65Both').at, direction: useCue('t65Direction').at, velocity: useCue('t65Velocity').at, road: useCue('t65Road').at};
  const left = {x: 120, y: 210, w: 700, h: 650}, right = {x: 1100, y: 210, w: 700, h: 650};
  const leftBox = {x: 170, y: 390, w: 600, h: 310}, rightBox = {x: 1150, y: 390, w: 600, h: 310};

  // Speedometer geometry (semicircular dial on 0..120 scale)
  const cx = 470, cy = 640, rDial = 170;
  const majorVals = [0, 20, 40, 60, 80, 100, 120];
  const minorVals = [10, 30, 50, 70, 90, 110];
  const angleFor = (v: number) => Math.PI - (v / 120) * Math.PI;

  // Velocity coordinate box geometry (same 600x310 size and same 0..120 scale: 480px / 120 = 4px/unit)
  const ox = 1210, oy = 640, axisLen = 480;
  const vMag = 65;
  const vAngle = 28 * Math.PI / 180;
  const vLenPx = vMag * (axisLen / 120); // 260 px
  const vxEnd = ox + Math.round(vLenPx * Math.cos(vAngle));
  const vyEnd = oy - Math.round(vLenPx * Math.sin(vAngle));

  const needleAngle = angleFor(65);
  const needleTipX = cx + Math.round((rDial - 18) * Math.cos(needleAngle));
  const needleTipY = cy - Math.round((rDial - 18) * Math.sin(needleAngle));

  return <StageSceneFrame segment={segment}><KitSound mode="beats">
    <Text at={cue.physics} box={{x: 120, y: 106, w: 1680, h: 48}} size={34}>PHYSICS &amp; LINEAR ALGEBRA</Text>
    <Panel box={left} at={cue.scalar}/><Panel box={right} at={cue.vector}/>
    <FitBox text="SCALAR" x={left.x + 38} y={left.y + 34} size={38} weight={600} tag="TERM" startFrame={frame(cue.scalar)} durationFrames={18} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <Text at={cue.size} box={{x: 162, y: 340, w: 330, h: 36}} size={28}>SIZE ALONE</Text>

    {/* Left box: Speedometer */}
    <DrawRect box={leftBox} startFrame={frame(cue.speed)} durationFrames={18} strokeToken="color/line/hairline" fillToken="color/fill/panel-wash"/>
    <Flicker startFrame={frame(cue.speed)} durationFrames={20} beat>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
        {/* Semicircular dial arc */}
        <path d={`M ${cx - rDial} ${cy} A ${rDial} ${rDial} 0 0 1 ${cx + rDial} ${cy}`} fill="none" stroke={color('color/fill/gold')} strokeWidth="3"/>
        {/* Minor ticks */}
        {minorVals.map(v => {
          const a = angleFor(v);
          const x1 = cx + rDial * Math.cos(a), y1 = cy - rDial * Math.sin(a);
          const x2 = cx + (rDial - 10) * Math.cos(a), y2 = cy - (rDial - 10) * Math.sin(a);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color('color/line/hairline')} strokeWidth="2"/>;
        })}
        {/* Major ticks and numbers */}
        {majorVals.map(v => {
          const a = angleFor(v);
          const x1 = cx + rDial * Math.cos(a), y1 = cy - rDial * Math.sin(a);
          const x2 = cx + (rDial - 18) * Math.cos(a), y2 = cy - (rDial - 18) * Math.sin(a);
          const tx = cx + (rDial - 38) * Math.cos(a), ty = cy - (rDial - 38) * Math.sin(a);
          return <g key={v}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color('color/fill/gold')} strokeWidth="3"/>
            <text x={tx} y={ty} fontFamily="IBM Plex Mono" fontSize={16} fontWeight={500} fill={color('color/text/soft')} textAnchor="middle" dominantBaseline="central">{v}</text>
          </g>;
        })}
        {/* Pivot */}
        <circle cx={cx} cy={cy} r="9" fill={color('color/fill/gold')}/>
        {/* Digital speed readout */}
        <text x={cx} y={cy - 50} fontFamily="IBM Plex Mono" fontSize={28} fontWeight={600} fill={color('color/fill/gold')} textAnchor="middle">65 MPH</text>
      </svg>
    </Flicker>
    {/* Needle pointing to 65 */}
    <DrawLine points={[[cx, cy], [needleTipX, needleTipY]]} startFrame={frame(cue.speedometer)} durationFrames={16} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={4} beat/>
    <Text at={cue.speedometer} box={{x: 260, y: 726, w: 420, h: 38}} size={26} tone="color/text/soft">SPEEDOMETER · SPEED</Text>

    {/* Right box: Vector / Velocity on matching 600x310 box and matching 0..120 scale */}
    <FitBox text="VECTOR" x={right.x + 38} y={right.y + 34} size={38} weight={600} tag="TERM" startFrame={frame(cue.vector)} durationFrames={18} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <Text at={cue.both} box={{x: 1142, y: 340, w: 420, h: 36}} size={28}>SIZE + DIRECTION</Text>
    <DrawRect box={rightBox} startFrame={frame(cue.road)} durationFrames={18} strokeToken="color/line/hairline" fillToken="color/fill/panel-wash"/>
    <Flicker startFrame={frame(cue.road)} durationFrames={18} beat>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} aria-hidden="true">
        {/* Horizontal axis (0..120 scale, matching dial range) */}
        <line x1={ox} y1={oy} x2={ox + axisLen} y2={oy} stroke={color('color/line/hairline-strong')} strokeWidth="2.5"/>
        {/* Vertical axis */}
        <line x1={ox} y1={oy} x2={ox} y2={oy - 200} stroke={color('color/line/hairline-strong')} strokeWidth="2.5"/>
        {/* Ticks and scale numbers 0..120 on X-axis */}
        {majorVals.map(v => {
          const x = ox + (v / 120) * axisLen;
          return <g key={v}>
            <line x1={x} y1={oy} x2={x} y2={oy + 8} stroke={color('color/line/hairline-strong')} strokeWidth="2"/>
            <text x={x} y={oy + 22} fontFamily="IBM Plex Mono" fontSize={15} fontWeight={500} fill={color('color/text/muted')} textAnchor="middle">{v}</text>
          </g>;
        })}
      </svg>
    </Flicker>
    {/* Road path */}
    <DrawLine points={[[ox, oy], [ox + 130, oy - 70], [ox + 270, oy - 60], [ox + 460, oy - 190]]} startFrame={frame(cue.road)} durationFrames={25} strokeToken="color/line/wire" glowToken="color/fill/gold" strokeWidth={10}/>
    {/* Velocity vector: magnitude 65 along road direction */}
    <DrawLine points={[[ox, oy], [vxEnd, vyEnd]]} startFrame={frame(cue.velocity)} durationFrames={20} strokeToken="color/marker/race" glowToken="color/marker/race" strokeWidth={6} end="arrow" beat/>
    <Text at={cue.direction} box={{x: 1240, y: 726, w: 420, h: 38}} size={26} tone="color/text/soft">VELOCITY · SPECIFIC ROAD</Text>
  </KitSound></StageSceneFrame>;
}
