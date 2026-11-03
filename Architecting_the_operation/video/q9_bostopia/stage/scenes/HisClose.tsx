import React from 'react';
import {useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {Edge, FLOOR, Frame, Phrases, SourceLine, Text, layoutPhrases, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

function FourKinds({top}: {top: number}) {
  const gap = 32;
  const avail = FLOOR - top;
  const side = Math.max(120, Math.min(440, Math.floor((Math.min(avail, 960) - gap) / 2)));
  const grid = side * 2 + gap;
  const x0 = 60 + Math.floor((960 - grid) / 2);
  const y0 = Math.max(top, FLOOR - grid);
  return (
    <>
      {[0, 1, 2, 3].map(index => {
        const x = x0 + (index % 2) * (side + gap);
        const y = y0 + Math.floor(index / 2) * (side + gap);
        return (
          <div
            key={index}
            data-shape={`kind-${index + 1}`}
            data-role="mark"
            data-layer="kinds"
            data-box={`${x} ${y} ${side} ${side}`}
            style={{position: 'absolute', left: x, top: y, width: side, height: side, borderRadius: 12, background: color(index === 3 ? 'color/fill/gold' : 'color/fill/gold-wash'), border: `2px solid ${color('color/fill/gold')}`}}
          />
        );
      })}
    </>
  );
}

export function HisClose({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('bostopia_psychopaths', segment.start_ms);
  const caseAt = useCue('case').at;
  const questionAt = useCue('question').at;
  const mouthAt = useCue('mouth').at;
  const psychopathAt = useCue('psychopath').at;
  const fourAt = useCue('four').at;
  const libAt = useCue('libertarianism').at;
  const leftAt = useCue('left').at;
  const politics = done && ms >= libAt;
  const lines: PhraseSpec[] = politics
    ? [
        {id: 'ph-politics', at: libAt, text: 'The only politics he names.'},
        {id: 'ph-lib', at: libAt, text: 'Libertarianism'},
        {id: 'ph-answer', at: leftAt, text: 'This answer comes from the left.'},
      ]
    : [
        {id: 'ph-case', at: caseAt, text: 'closing his case'},
        {id: 'ph-question', at: questionAt, text: 'a yes on Question 9'},
        {id: 'ph-mouth', at: mouthAt, text: 'in his mouth'},
        {id: 'ph-psychopath', at: psychopathAt, text: 'makes you a psychopath'},
        {id: 'ph-four', at: fourAt, text: 'one of four kinds'},
      ];
  const spreadTop = ms >= leftAt ? 360 : 210;
  const laid = layoutPhrases(lines, ms, politics ? {x: 96, y: spreadTop, w: 880, spread: true, bottom: 1460} : undefined);
  const squares = done && ms >= fourAt && ms < libAt;
  return (
    <>
      <ClipFrames clip="bostopia_psychopaths" startMs={segment.start_ms} />
      {politics && (
        <>
          <Frame id="politics-card" x={60} y={160} w={960} h={1424} />
          <Edge id="politics-edge" x={60} y={160} h={1424} />
        </>
      )}
      {done && <Phrases lines={lines} ms={ms} spread={politics} x={politics ? 96 : 60} y={politics ? spreadTop : 148} w={politics ? 880 : 960} bottom={politics ? 1460 : undefined} />}
      {politics && ms >= leftAt && (
        <Text id="from-left" text="From the left" x={96} y={210} w={880} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {squares && <FourKinds top={laid.bottom + 28} />}
      {politics && <QrMark id="reel-qr" cue="libertarianism" url="https://www.instagram.com/reel/DfQS-mmArwS/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {politics && <SourceLine at={libAt} text="Source: @bostopianews, Question 9 reel, Nov. 2, 2026" />}
    </>
  );
}
