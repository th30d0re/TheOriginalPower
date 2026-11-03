import React from 'react';
import {useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {Edge, FLOOR, Frame, Phrases, SourceLine, Text, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, bookUrl, cornerQr} from './shared/QrMark';
import {WagePlane} from './shared/WagePlane';

export function TheWage(_props: SceneProps) {
  const ms = useStageMs();
  const firearmsAt = useCue('firearms').at;
  const enslavedAt = useCue('enslaved').at;
  const plantersAt = useCue('planters').at;
  const wageAt = useCue('wage').at;
  const patrolsAt = useCue('patrols').at;
  const masonAt = useCue('mason').at;
  const disarmAt = useCue('disarm').at;
  const sinkAt = useCue('sink').at;
  const dateAt = useCue('date').at;
  const lexingtonAt = useCue('lexington').at;
  const musketsAt = useCue('muskets').at;
  const captives = ms >= plantersAt && ms < wageAt;
  const plane = ms >= wageAt && ms < disarmAt;
  const mason = ms >= disarmAt && ms < lexingtonAt;
  const line = ms >= lexingtonAt;
  const lines: PhraseSpec[] = line
    ? [
        {id: 'ph-drew', at: lexingtonAt, text: 'Massachusetts already drew this line'},
        {id: 'ph-april', at: lexingtonAt, text: 'In Lexington, April 1775.'},
        {id: 'ph-marched', at: lexingtonAt, text: "The British marched on Lexington and Concord to take the colony's arms"},
        {id: 'ph-equivalent', at: musketsAt, text: 'the equivalent of an AR-15'},
      ]
      : mason
      ? [
          {id: 'ph-mason', at: masonAt, text: 'George Mason'},
          {id: 'ph-disarm', at: disarmAt, text: 'To disarm the people'},
          {id: 'ph-enslave', at: disarmAt, text: 'the best and most effective way to enslave them.'},
          {id: 'ph-sink', at: sinkAt, text: 'Weaken them, and let them sink.'},
          {id: 'ph-date', at: dateAt, text: 'the date in this law'},
        ]
      : plane
        ? [
            {id: 'ph-wage', at: wageAt, text: 'The White buffer class, as a wage'},
            {id: 'ph-patrols', at: patrolsAt, text: 'were the slave patrols'},
            {id: 'ph-mason', at: masonAt, text: 'George Mason'},
          ]
        : captives
          ? [
              {id: 'ph-held', at: plantersAt, text: 'The planters here held the enslaved population'},
              {id: 'ph-gap', at: plantersAt, text: 'with that same gap in force.'},
            ]
          : [
              {id: 'ph-sold', at: firearmsAt, text: 'sold firearms'},
              {id: 'ph-enslaved', at: enslavedAt, text: 'enslaved people'},
            ];
  const speech = captives || line;
  const packed = phraseBottom(lines, ms, {x: speech || mason ? 96 : 60, y: captives ? 360 : mason || line ? 220 : 148, w: speech || mason ? 880 : 960});
  const planeY = packed + 16;
  const yearY = 1460;
  return (
    <>
      {captives && (
        <>
          <Frame id="captive-card" x={60} y={160} w={960} h={1424} />
          <Edge id="captive-edge" x={60} y={160} h={1424} />
        </>
      )}
      {mason && (
        <>
          <Frame id="mason-card" x={60} y={160} w={960} h={1424} />
          <Edge id="mason-edge" x={60} y={160} h={1424} />
        </>
      )}
      {line && (
        <>
          <Frame id="lexington-card" x={60} y={160} w={960} h={1424} />
          <Edge id="lexington-edge" x={60} y={160} h={1424} />
        </>
      )}
      {ms >= firearmsAt && (
        <Phrases
          lines={lines}
          ms={ms}
          spread={speech}
          x={speech || mason ? 96 : 60}
          y={captives ? 360 : mason || line ? 220 : 148}
          w={speech || mason ? 880 : 960}
          bottom={speech ? 1460 : undefined}
        />
      )}
      {captives && (
        <Text id="arms-captives" text="Arms for captives" x={96} y={220} w={880} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {plane && (
        <>
          <Frame id="wage-ground" x={60} y={planeY} w={960} h={FLOOR - planeY} />
          <WagePlane x={80} y={planeY + 24} w={920} h={FLOOR - planeY - 48} />
        </>
      )}
      {mason && ms >= dateAt && (
        <>
          <Text id="year-1788" text="1788" x={120} y={yearY} w={280} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="year-august" text="August 1, 2024" x={420} y={yearY} w={520} size={56} kind="headline" weight={600} />
        </>
      )}
      {ms >= plantersAt && <QrMark id="book-qr" cue="planters" url={bookUrl} x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {ms >= plantersAt && <SourceLine at={plantersAt} text="The Original Power, Ch. 9, §9.3.6 Arms as a Wage" />}
    </>
  );
}
