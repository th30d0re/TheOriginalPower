import React from 'react';
import {useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {Edge, FLOOR, Frame, Phrases, SourceLine, Text, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

export function TheRight({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('bostopia_libertarian', segment.start_ms);
  const privilegeAt = useCue('privilege').at;
  const safetyAt = useCue('safety').at;
  const unalienableAt = useCue('unalienable').at;
  const declarationAt = useCue('declaration').at;
  const permissionAt = useCue('permission').at;
  const lockeAt = useCue('locke').at;
  const libertyAt = useCue('liberty').at;
  const animalsAt = useCue('animals').at;
  const firearmAt = useCue('firearm').at;
  const worseAt = useCue('worse').at;
  const preyAt = useCue('prey').at;
  const privilege = done && ms >= privilegeAt && ms < unalienableAt;
  const word = done && ms >= unalienableAt && ms < lockeAt;
  const account = done && ms >= lockeAt;
  const lines: PhraseSpec[] = account
    ? [
        {id: 'ph-nature', at: lockeAt, text: 'the state of nature'},
        {id: 'ph-liberty', at: libertyAt, text: 'the liberty to defend their right'},
        {id: 'ph-animals', at: animalsAt, text: 'other animals carry that same charge'},
        {id: 'ph-firearm', at: firearmAt, text: 'built the firearm'},
        {id: 'ph-worse', at: worseAt, text: 'a worse condition than the state of nature'},
        {id: 'ph-prey', at: preyAt, text: 'when he pleases'},
      ]
    : word
      ? [
          {id: 'ph-holds', at: unalienableAt, text: 'The right to defend yourself is unalienable'},
          {id: 'ph-declaration', at: declarationAt, text: 'The Declaration uses that word.'},
          {id: 'ph-before', at: unalienableAt, text: 'before any government recognizes it'},
          {id: 'ph-permission', at: permissionAt, text: 'is a permission'},
        ]
      : [
          {id: 'ph-privilege', at: privilegeAt, text: 'He calls the right a privilege.'},
          {id: 'ph-safety', at: safetyAt, text: "billed to everyone else's safety."},
        ];
  const quote = ms >= preyAt
    ? 'Hand the force to the legislator, and he can make a prey of them when he pleases.'
    : ms >= animalsAt
      ? 'Other animals carry that charge.'
      : 'He called the condition before government the state of nature.';
  const quoteSize = quote.length > 70 ? 56 : 64;
  const packed = phraseBottom(lines, ms, account ? {x: 96, y: 200, w: 880} : undefined);
  const cardY = Math.max(packed + 20, 520);
  const cardH = FLOOR - cardY;
  const quoteH = blockHeight(quote, 800, quoteSize);
  const quoteY = cardY + Math.max(48, Math.round((cardH - quoteH) / 2));
  const speech = privilege || word;
  return (
    <>
      <ClipFrames clip="bostopia_libertarian" startMs={segment.start_ms} />
      {speech && (
        <>
          <Frame id="speech-card" x={60} y={160} w={960} h={1424} />
          <Edge id="speech-edge" x={60} y={160} h={1424} />
        </>
      )}
      {word && (
        <Text id="unalienable-word" text="Unalienable" x={96} y={220} w={880} size={84} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {done && ms >= privilegeAt && (
        <Phrases
          lines={lines}
          ms={ms}
          spread={speech}
          x={account ? 96 : 96}
          y={word ? 420 : account ? 200 : 240}
          w={880}
          bottom={speech ? 1460 : undefined}
        />
      )}
      {account && (
        <>
          <Frame id="quote-card" x={96} y={cardY} w={880} h={cardH} />
          <Text id="locke-quote" text={quote} x={136} y={quoteY} w={800} size={quoteSize} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <QrMark id="locke-qr" cue="locke" url="https://press-pubs.uchicago.edu/founders/documents/v1ch17s5.html" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
          <SourceLine at={lockeAt} text="Locke, Second Treatise, §137, Founders' Constitution" />
        </>
      )}
    </>
  );
}
