import React from 'react';
import {BootIn, DrawLine, DrawRect, Flicker, FitBox, KitSound, StageSceneFrame, StickFigure, useCue, color, type SceneProps} from '@stage';

const frame = (ms: number) => Math.round(ms * 30 / 1000);

const Copy = ({at, box, children, size = 28, tone = 'color/text/primary'}: React.PropsWithChildren<{at: number; box: {x: number; y: number; w: number; h: number}; size?: number; tone?: string}>) => (
  <Flicker startFrame={frame(at)} durationFrames={14} beat>
    <div
      data-text="pred2-copy"
      data-box={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, font: `500 ${size}px "IBM Plex Sans"`, lineHeight: 1.2, color: color(tone)}}
    >
      {children}
    </div>
  </Flicker>
);

const Panel = ({box, at, accent = 'color/line/hairline-strong', beat = false}: {box: {x: number; y: number; w: number; h: number}; at: number; accent?: string; beat?: boolean}) => (
  <>
    <BootIn box={box} startFrame={frame(at)} durationFrames={20} mode="scan" strokeToken={accent} fillToken="color/fill/panel-render" glowToken="color/fill/gold" beat={beat}/>
    <DrawRect box={box} startFrame={frame(at)} durationFrames={20} strokeToken={accent} fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
  </>
);

export function PredictionTwo({segment}: SceneProps) {
  const cue = {
    prediction: useCue('t112Prediction').at,
    codification: useCue('t112Codification').at,
    solidarity: useCue('t112Solidarity').at,
    threats: useCue('t112Threats').at,
    statutory: useCue('t112Statutory').at,
    boundaries: useCue('t112Boundaries').at,
    white: useCue('t112White').at,
    buffer: useCue('t112Buffer').at,
    privileges: useCue('t112Privileges').at,
    enacted: useCue('t112Enacted').at,
    decades: useCue('t112Decades').at,
    joint: useCue('t112Joint').at,
    rebellions: useCue('t112Rebellions').at,
    crossRacial: useCue('t112CrossRacial').at,
    crises: useCue('t112Crises').at,
  };

  const header = {x: 120, y: 104, w: 1680, h: 72};
  const left = {x: 120, y: 220, w: 680, h: 600};
  const right = {x: 980, y: 220, w: 820, h: 600};

  return (
    <StageSceneFrame segment={segment}>
      <KitSound mode="beats">
        <Panel box={header} at={cue.prediction} beat/>
        <Copy at={cue.prediction} box={{x: 154, y: 124, w: 1020, h: 36}} size={30}>
          PREDICTION 2 · CODIFICATION FOLLOWS SOLIDARITY THREATS
        </Copy>
        <Copy at={cue.codification} box={{x: 1220, y: 128, w: 540, h: 28}} size={22} tone="color/fill/gold">
          COLONIAL VIRGINIA · 1676–1705
        </Copy>

        <Panel box={left} at={cue.solidarity} beat/>
        <FitBox
          text="SOLIDARITY THREAT"
          x={left.x + 36}
          y={left.y + 36}
          size={34}
          weight={600}
          tag="CATALYST"
          startFrame={frame(cue.solidarity)}
          durationFrames={18}
          textToken="color/text/primary"
          strokeToken="color/fill/gold"
          fillToken="color/fill/panel-render"
          accentToken="color/fill/gold"
          beat
        />
        <Copy at={cue.joint} box={{x: left.x + 36, y: left.y + 116, w: 608, h: 34}} size={26}>
          JOINT LABOR REBELLIONS
        </Copy>

        <StickFigure x={left.x + 230} y={left.y + 270} group="outgroup" emphasis={1} scale={1.5} animate startFrame={frame(cue.joint)} durationFrames={18}/>
        <StickFigure x={left.x + 370} y={left.y + 270} group="neutral" emphasis={1} scale={1.5} animate startFrame={frame(cue.crossRacial)} durationFrames={18}/>

        <DrawLine
          points={[[left.x + 140, left.y + 370], [left.x + 470, left.y + 370]]}
          startFrame={frame(cue.joint)}
          durationFrames={16}
          strokeToken="color/fill/gold"
          strokeWidth={4}
        />

        <Copy at={cue.rebellions} box={{x: left.x + 36, y: left.y + 400, w: 608, h: 32}} size={24} tone="color/fill/gold">
          1676 BACON'S REBELLION · UNIFIED LABOR
        </Copy>
        <Copy at={cue.crises} box={{x: left.x + 36, y: left.y + 448, w: 608, h: 64}} size={22} tone="color/text/soft">
          CROSS-RACIAL RESISTANCE CREATES AN EXISTENTIAL CRISIS FOR PLANTER RULE
        </Copy>

        <DrawLine
          points={[[810, 520], [960, 520]]}
          startFrame={frame(cue.decades)}
          durationFrames={16}
          strokeToken="color/fill/gold"
          strokeWidth={6}
          end="arrow"
          beat
        />
        <Copy at={cue.decades} box={{x: 800, y: 546, w: 180, h: 28}} size={20} tone="color/fill/gold">
          DECIMAL LAG
        </Copy>

        <Panel box={right} at={cue.statutory} accent="color/marker/race" beat/>

        <div style={{position: 'absolute', left: right.x + 36, top: right.y + 30, width: 748, height: 240}}>
          <DrawRect box={{x: 0, y: 0, w: 748, h: 240}} startFrame={frame(cue.statutory)} durationFrames={16} strokeToken="color/marker/race" fillToken="color/fill/panel-render" glowToken="color/marker/race"/>
          <FitBox
            text="STATUTORY BOUNDARIES"
            x={24}
            y={24}
            size={30}
            weight={600}
            tag="LAW"
            startFrame={frame(cue.boundaries)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/marker/race"
            fillToken="color/fill/panel-render"
            accentToken="color/marker/race"
            beat
          />
          <Copy at={cue.statutory} box={{x: 24, y: 86, w: 700, h: 30}} size={23}>
            1691/1705 VIRGINIA SLAVE CODES
          </Copy>
          <Copy at={cue.enacted} box={{x: 24, y: 130, w: 700, h: 56}} size={21} tone="color/text/soft">
            STRICT RACIAL BOUNDARIES AFTER A SOLIDARITY CRISIS
          </Copy>
        </div>

        <div style={{position: 'absolute', left: right.x + 36, top: right.y + 300, width: 748, height: 260}}>
          <DrawRect box={{x: 0, y: 0, w: 748, h: 260}} startFrame={frame(cue.buffer)} durationFrames={16} strokeToken="color/fill/gold" fillToken="color/fill/panel-render" glowToken="color/fill/gold"/>
          <FitBox
            text="WHITE BUFFER PRIVILEGES"
            x={24}
            y={24}
            size={30}
            weight={600}
            tag="BUFFER"
            startFrame={frame(cue.buffer)}
            durationFrames={16}
            textToken="color/text/primary"
            strokeToken="color/fill/gold"
            fillToken="color/fill/panel-render"
            accentToken="color/fill/gold"
            beat
          />
          <Copy at={cue.white} box={{x: 24, y: 86, w: 700, h: 30}} size={23}>
            CIVIC PREFERMENT FOR POOR WHITES
          </Copy>
          <Copy at={cue.privileges} box={{x: 24, y: 130, w: 700, h: 56}} size={21} tone="color/text/soft">
            ENFORCEMENT ROLES TO PATROL EXTRACTION
          </Copy>
        </div>

        <Copy at={cue.enacted} box={{x: 200, y: 864, w: 1520, h: 36}} size={26} tone="color/fill/gold">
          STATUTORY CODES ARE ENACTED IN RESPONSE TO SOLIDARITY THREATS
        </Copy>
      </KitSound>
    </StageSceneFrame>
  );
}
