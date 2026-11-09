import React from 'react';
import {DrawLine, FitBox, useCue, useStageMs, type SceneProps} from '@stage';
import {EquationTerms} from '../equations';
import {Copy, Panel, Scene, frame} from './shared';

export function ArchiveSequence({segment}: SceneProps) {
  const ms = useStageMs();
  const c = {test: useCue('t300Test').at, prediction: useCue('t300Prediction').at, extraction: useCue('t300Extraction').at, doctrine: useCue('t300Doctrine').at, ledger: useCue('t300Ledger').at, institutions: useCue('t301Institutions').at, crown: useCue('t301Crown').at, papacy: useCue('t301Papacy').at, order: useCue('t301Order').at, merchants: useCue('t301Merchants').at, chronicler: useCue('t301Chronicler').at, customs: useCue('t301Customs').at, refutation: useCue('t302Refutation').at, phenotype: useCue('t302Phenotype').at, beneficiaries: useCue('t302Beneficiaries').at, chronological: useCue('t303Chronological').at, licensing: useCue('t303Licensing').at, elite: useCue('t303Elite').at};
  const sponsors = [['CROWN', c.crown], ['PAPACY', c.papacy], ['ORDER OF CHRIST', c.order], ['MERCHANTS', c.merchants], ['CHRONICLER', c.chronicler], ['CUSTOMS HOUSE', c.customs]] as const;
  return <Scene segment={segment}>
    <Panel box={{x: 120, y: 104, w: 1680, h: 76}} at={c.test}/>
    <Copy at={c.test} box={{x: 152, y: 124, w: 690, h: 36}} size={30}>TEST 1 · PORTUGUESE ORIGIN RECORD</Copy>
    <FitBox text="PREDICTION 1" x={1400} y={116} size={24} weight={600} tag="ARCHIVE" startFrame={frame(c.prediction)} durationFrames={16} textToken="color/text/primary" strokeToken="color/fill/gold" fillToken="color/fill/panel-render" accentToken="color/fill/gold" beat/>
    <DrawLine points={[[250, 390], [1660, 390]]} startFrame={frame(c.extraction)} durationFrames={20} strokeToken="color/line/hairline-strong" strokeWidth={3}/>
    {[['1441 / 1444', 'EXTRACTION', c.extraction, 270], ['1453', 'COMMISSIONED DOCTRINE', c.doctrine, 830], ['1486', 'ROYAL LICENSING', c.licensing, 1390]].map(([date, label, at, x]) => <React.Fragment key={String(label)}><Panel box={{x: Number(x), y: 292, w: 290, h: 160}} at={Number(at)} accent={label === 'COMMISSIONED DOCTRINE' ? 'color/marker/race' : 'color/fill/gold'}/><Copy at={Number(at)} box={{x: Number(x) + 22, y: 320, w: 246, h: 30}} size={23} mono align="center" tone="color/text/dim">{String(date)}</Copy><Copy at={Number(at)} box={{x: Number(x) + 22, y: 374, w: 246, h: 42}} size={22} align="center">{String(label)}</Copy></React.Fragment>)}
    <Panel box={{x: 120, y: 610, w: 1680, h: 190}} at={c.institutions}/>
    {sponsors.map(([label, at], i) => <React.Fragment key={label}><Panel box={{x: 158 + i * 270, y: 680, w: 230, h: 68}} at={at}/><Copy at={at} box={{x: 170 + i * 270, y: 704, w: 206, h: 24}} size={18} mono align="center">{label}</Copy></React.Fragment>)}
    <Panel box={{x: 370, y: 865, w: 1180, h: 76}} at={c.refutation} accent="color/marker/race"/>
    <Copy at={c.refutation} box={{x: 400, y: 888, w: 1120, h: 30}} size={22} align="center" tone="color/marker/race">NO COUNTEREXAMPLE</Copy>
    <EquationTerms equation="Eq. 3.10 · sponsor condition" ms={ms} box={{x: 650, y: 962, w: 620, h: 40}} fontSize={31} align="center" tokens={[{term: 'Elite'}, {text: ' sponsorship'}]} pulses={{Elite: [c.elite, c.beneficiaries]}}/>
  </Scene>;
}
