import React from 'react';
import {DrawLine, FitBox, useCue, type SceneProps} from '@stage';
import {Copy, Panel, Scene, frame} from './shared';

export function AtlanticNetwork({segment}: SceneProps) {
  const c = {casa: useCue('t304Casa').at, registration: useCue('t304Registration').at, taxation: useCue('t304Taxation').at, authority: useCue('t304Authority').at, sao: useCue('t304Sao').at, sugar: useCue('t304Sugar').at, colonization: useCue('t304Colonization').at, Kongo: useCue('t304Kongo').at, Luanda: useCue('t304Luanda').at, port: useCue('t304Port').at, Spanish: useCue('t305Spanish').at, Hispaniola: useCue('t305Hispaniola').at, asiento: useCue('t305Asiento').at, shipment: useCue('t305Shipment').at, licence: useCue('t305Licence').at, engenho: useCue('t306Engenho').at, Vicente: useCue('t306Vicente').at, expansion: useCue('t306Expansion').at, driver: useCue('t306Driver').at, stressor: useCue('t306Stressor').at};
  const stations = [['CASA DOS ESCRAVOS', '1486', c.casa], ['SAO TOME', '1493', c.sao], ['HISPANIOLA', '1501 / 1518', c.Hispaniola], ['SAO VICENTE', '1532', c.Vicente], ['LUANDA', '1575', c.Luanda]] as const;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 104, w: 1680, h: 76}} at={c.casa}/>
    <Copy at={c.casa} box={{x: 152, y: 125, w: 1000, h: 36}} size={30}>ATLANTIC FISCAL NETWORK</Copy>
    <FitBox text="ROYAL AUTHORITY" x={1382} y={116} size={23} weight={600} tag="POWER" startFrame={frame(c.authority)} durationFrames={16} textToken="color/text/primary" strokeToken="color/marker/race" fillToken="color/fill/panel-render" accentToken="color/marker/race" beat/>
    <DrawLine points={[[250, 468], [1670, 468]]} startFrame={frame(c.casa)} durationFrames={26} strokeToken="color/fill/gold" glowToken="color/fill/gold" strokeWidth={5} end="arrow" beat/>
    {stations.map(([name, date, at], i) => <React.Fragment key={name}><Panel box={{x: 132 + i * 338, y: 330, w: 238, h: 110}} at={at} accent={i === 0 || i === 4 ? 'color/marker/race' : 'color/fill/gold'}/><Copy at={at} box={{x: 148 + i * 338, y: 352, w: 206, h: 24}} size={17} mono align="center" tone="color/text/dim">{date}</Copy><Copy at={at} box={{x: 148 + i * 338, y: 390, w: 206, h: 27}} size={18} align="center">{name}</Copy></React.Fragment>)}
    <Panel box={{x: 230, y: 690, w: 1460, h: 180}} at={c.engenho}/>
    <Copy at={c.engenho} box={{x: 270, y: 730, w: 420, h: 34}} size={28}>COMMERCIAL ENGENHO</Copy>
    <Copy at={c.expansion} box={{x: 770, y: 730, w: 400, h: 34}} size={28} align="center">SUGAR EXPANSION</Copy>
    <Copy at={c.stressor} box={{x: 1210, y: 730, w: 430, h: 34}} size={26} align="center" tone="color/marker/race">LABOR DEMAND</Copy>
    <DrawLine points={[[690, 754], [750, 754]]} startFrame={frame(c.expansion)} durationFrames={10} strokeToken="color/fill/gold" strokeWidth={4} end="arrow" beat/><DrawLine points={[[1170, 754], [1190, 754]]} startFrame={frame(c.stressor)} durationFrames={10} strokeToken="color/marker/race" strokeWidth={4} end="arrow" beat/>
  </Scene>;
}
