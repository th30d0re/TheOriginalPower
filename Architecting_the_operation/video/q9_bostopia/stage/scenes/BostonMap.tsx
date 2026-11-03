import React from 'react';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {HRule, Phrases, SourceLine, Text, VBar, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

const RATES = [
  {id: 'd', label: 'D', value: '3.14', amount: 3.14},
  {id: 'c', label: 'C', value: '3.12', amount: 3.12},
  {id: 'ab', label: 'A and B', value: '0.43', amount: 0.43},
];

export function BostonMap(_props: SceneProps) {
  const ms = useStageMs();
  const bostonAt = useCue('boston').at;
  const gradedAt = useCue('graded').at;
  const sevenAt = useCue('seven').at;
  const democideAt = useCue('democide').at;
  const lines: PhraseSpec[] = [
    {id: 'ph-boston', at: bostonAt, text: 'Here in Boston'},
    {id: 'ph-graded', at: gradedAt, text: 'graded C and D'},
    {id: 'ph-seven', at: sevenAt, text: 'seven times the shooting rate'},
    {id: 'ph-democide', at: democideAt, text: 'State-sponsored democide'},
  ];
  const packed = phraseBottom(lines, ms);
  const title = '1938 Boston map';
  const titleH = blockHeight(title, 960, 56);
  const titleY = packed + 16;
  const per = 'Shootings per 10,000 residents per year.';
  const perH = blockHeight(per, 960, 40);
  const numH = blockHeight('3.14', 260, 48);
  const base = 1508;
  const barMax = 220;
  const numY = base - barMax - 10 - numH;
  const perY = numY - 12 - perH;
  const mapTop = titleY + titleH + 12;
  const mapH = Math.max(220, perY - 16 - mapTop);
  const mapW = 960;
  const mapX = 60;
  const grow = cubicOut(progress(ms, sevenAt, sevenAt + 700));
  const colW = 280;
  const gap = 20;
  const x0 = 60 + Math.floor((960 - (colW * 3 + gap * 2)) / 2);
  return (
    <>
      <Phrases lines={lines} ms={ms} />
      {ms >= bostonAt && (
        <Text id="map-title" text={title} x={60} y={titleY} w={960} size={56} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {ms >= bostonAt && (
        <img
          data-shape="holc-map"
          data-role="mark"
          data-layer="map"
          data-box={`${mapX} ${mapTop} ${mapW} ${mapH}`}
          src={staticFile('assets/frames/boston_holc_shootings_map.png')}
          alt=""
          style={{position: 'absolute', left: mapX, top: mapTop, width: mapW, height: mapH, objectFit: 'cover', objectPosition: 'center'}}
        />
      )}
      {ms >= sevenAt && (
        <>
          <Text id="per-capita" text={per} x={60} y={perY} w={960} size={40} kind="body" />
          {RATES.map((rate, index) => {
            const x = x0 + index * (colW + gap);
            const h = Math.max(8, barMax * (rate.amount / 3.14) * grow);
            return (
              <React.Fragment key={rate.id}>
                <Text id={`value-${rate.id}`} text={rate.value} x={x} y={numY} w={colW} size={48} kind="body" weight={600} />
                <VBar id={`bar-${rate.id}`} x={x + 70} baseline={base} w={140} h={h} fill={color(rate.id === 'ab' ? 'color/text/dim' : 'color/fill/gold')} />
                <Text id={`grade-${rate.id}`} text={rate.label} x={x} y={base + 14} w={colW} size={40} kind="body" weight={600} />
              </React.Fragment>
            );
          })}
          <HRule id="grade-base" x1={x0} x2={x0 + colW * 3 + gap * 2} y={base} />
        </>
      )}
      {ms >= bostonAt && <QrMark id="map-qr" cue="boston" url="https://dsl.richmond.edu/panorama/redlining/map/MA/Boston/context" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {ms >= bostonAt && <SourceLine at={bostonAt} text="Sources: Mapping Inequality · Analyze Boston · ACS 2024" w={760} />}
    </>
  );
}
