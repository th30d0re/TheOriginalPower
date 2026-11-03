import React from 'react';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Edge, FLOOR, Frame, HBar, Phrases, SourceLine, Text, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark} from './shared/QrMark';

export function TheReturn(_props: SceneProps) {
  const ms = useStageMs();
  const povertyAt = useCue('poverty').at;
  const pointAt = useCue('point').at;
  const zeroAt = useCue('zero').at;
  const storageAt = useCue('storage').at;
  const todayAt = useCue('today').at;
  const systemicAt = useCue('systemic').at;
  const standingAt = useCue('standing').at;
  const largerAt = useCue('larger').at;
  const vote = ms >= todayAt;
  const lines: PhraseSpec[] = vote
    ? [
        {id: 'ph-question', at: todayAt, text: 'on Question 9.'},
        {id: 'ph-racism', at: systemicAt, text: 'Racism, sexism, and systemic ableism.'},
        {id: 'ph-standing', at: standingAt, text: 'leaves safe storage and background checks standing.'},
        {id: 'ph-larger', at: largerAt, text: 'a larger change than that return contains.'},
      ]
    : [
        {id: 'ph-tracks', at: povertyAt, text: 'poverty tracks gun homicide'},
        {id: 'ph-point', at: pointAt, text: 'about point seven'},
        {id: 'ph-zero', at: zeroAt, text: 'essentially zero'},
        {id: 'ph-storage', at: storageAt, text: 'Safe storage and background checks'},
        {id: 'ph-rand', at: storageAt, text: 'the laws RAND finds work best'},
      ];
  const packed = phraseBottom(lines, ms, vote ? {x: 96, y: 420, w: 880} : undefined);
  const grow = cubicOut(progress(ms, povertyAt, povertyAt + 640));
  const collapse = cubicOut(progress(ms, zeroAt, zeroAt + 640));
  const title = 'Poverty r = +0.72';
  const titleH = blockHeight(title, 960, 56);
  const titleY = packed + 16;
  const barY = titleY + titleH + 12;
  const zeroH = blockHeight('About zero', 460, 56);
  const labelY = barY + 48;
  const bar2Y = ms >= zeroAt ? labelY + zeroH + 12 : barY + 48;
  const scatterY = bar2Y + 48 + 16;
  const scatterH = Math.max(240, FLOOR - scatterY);
  const scatterW = Math.min(960, Math.round(scatterH * 1080 / 1290));
  const scatterX = 60 + Math.round((960 - scatterW) / 2);
  const povertyW = Math.round(820 * grow);
  const gunW = Math.max(16, Math.round(820 * (0.29 / 0.72) * grow * (1 - collapse) + 28 * collapse));
  return (
    <>
      {vote && (
        <>
          <Frame id="vote-card" x={60} y={160} w={960} h={1424} />
          <Edge id="vote-edge" x={60} y={160} h={1424} />
          <Text id="vote-line" text="Today is voting day. Vote no." x={96} y={220} w={880} size={64} kind="headline" weight={600} ink={color('color/fill/gold')} />
        </>
      )}
      <Phrases lines={lines} ms={ms} spread={vote} x={vote ? 96 : 60} y={vote ? 420 : 148} w={vote ? 880 : 960} bottom={vote ? 1460 : undefined} />
      {!vote && ms >= povertyAt && (
        <>
          <Text id="poverty-r" text={title} x={60} y={titleY} w={960} size={56} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <HBar id="poverty-bar" x={60} y={barY} w={povertyW} h={36} fill={color('color/fill/gold')} layer="plot" />
          {ms >= zeroAt && (
            <>
              <Text id="gun-r" text="r = +0.29" x={60} y={labelY} w={460} size={56} kind="headline" weight={600} />
              <Text id="about-zero" text="About zero" x={540} y={labelY} w={460} size={56} kind="headline" weight={600} />
            </>
          )}
          <HBar id="gunlaw-bar" x={60} y={bar2Y} w={gunW} h={36} fill={color('color/text/dim')} layer="plot" />
          <img
            data-shape="state-scatter"
            data-role="mark"
            data-layer="scatter"
            data-box={`${scatterX} ${scatterY} ${scatterW} ${scatterH}`}
            src={staticFile('assets/frames/gunlaws_poverty_portrait.png')}
            alt=""
            style={{position: 'absolute', left: scatterX, top: scatterY, width: scatterW, height: scatterH, objectFit: 'contain'}}
          />
        </>
      )}
      {ms >= povertyAt && <SourceLine at={povertyAt} text="Sources: CDC · Census · RAND Gun Policy in America" w={580} />}
      {ms >= povertyAt && <QrMark id="cdc-qr" cue="poverty" url="https://data.cdc.gov/d/fpsi-y8tj" x={676} y={1616} size={152} />}
      {ms >= storageAt && <QrMark id="rand-qr" cue="storage" url="https://www.rand.org/research/gun-policy/analysis.html" x={848} y={1616} size={152} />}
    </>
  );
}
