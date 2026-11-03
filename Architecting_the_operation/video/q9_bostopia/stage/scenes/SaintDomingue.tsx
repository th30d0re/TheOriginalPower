import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {Edge, Frame, HRule, Phrases, SourceLine, Text, VBar, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

export function SaintDomingue({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('bostopia_stockpile', segment.start_ms);
  const sourceAt = useCue('source').at;
  const bansAt = useCue('bans').at;
  const riflesAt = useCue('rifles').at;
  const againstAt = useCue('against').at;
  const privilegedAt = useCue('privileged').at;
  const protectorAt = useCue('protector').at;
  const early = done && ms >= sourceAt && ms < riflesAt;
  const bars = done && ms >= riflesAt && ms < againstAt;
  const position = done && ms >= againstAt;
  const lines: PhraseSpec[] = position
    ? [
        {id: 'ph-against', at: againstAt, text: 'arms against this government'},
        {id: 'ph-privileged', at: privilegedAt, text: 'A privileged position'},
        {id: 'ph-protector', at: protectorAt, text: 'Your protector'},
      ]
    : bars
      ? [
          {id: 'ph-cites', at: sourceAt, text: 'He cites no source.'},
          {id: 'ph-bans', at: bansAt, text: 'The state bans the AR-15'},
          {id: 'ph-percent', at: riflesAt, text: 'Rifles were 3 percent'},
        ]
      : [
          {id: 'ph-cites', at: sourceAt, text: 'He cites no source.'},
          {id: 'ph-bans', at: bansAt, text: 'The state bans the AR-15'},
        ];
  const packed = phraseBottom(lines, ms, bars ? undefined : {y: early && ms < bansAt ? 460 : 220});
  const head = 'Rifles, 3%';
  const sentence = '42% of that count names no firearm type.';
  const fbi = "the FBI's 2024 count";
  const headH = blockHeight(head, 900, 64);
  const sentH = blockHeight(sentence, 900, 44);
  const fbiH = blockHeight(fbi, 900, 40);
  const textY = packed + 20;
  const textEnd = textY + headH + 14 + sentH + 12 + fbiH;
  const base = 1496;
  const barMax = Math.max(64, base - textEnd - 20);
  const grow = cubicOut(progress(ms, riflesAt, riflesAt + 640));
  return (
    <>
      <ClipFrames clip="bostopia_stockpile" startMs={segment.start_ms} />
      {(early || position) && (
        <>
          <Frame id="speech-card" x={60} y={160} w={960} h={1424} />
          <Edge id="speech-edge" x={60} y={160} h={1424} />
        </>
      )}
      {early && ms < bansAt && (
        <Text id="no-source" text="No source." x={96} y={240} w={880} size={84} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {done && (
        <Phrases
          lines={lines}
          ms={ms}
          spread={early || position}
          x={early || position ? 96 : 60}
          y={early ? (ms >= bansAt ? 220 : 460) : position ? 220 : 148}
          w={early || position ? 880 : 960}
          bottom={early || position ? 1460 : undefined}
        />
      )}
      {bars && (
        <>
          <Text id="rifles-3" text={head} x={80} y={textY} w={900} size={64} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="unnamed-42" text={sentence} x={80} y={textY + headH + 14} w={900} size={44} kind="body" />
          <Text id="fbi-count" text={fbi} x={80} y={textY + headH + 14 + sentH + 12} w={900} size={40} kind="body" />
          <VBar id="bar-rifles" x={160} baseline={base} w={180} h={Math.max(12, barMax * (3 / 42) * grow)} fill={color('color/fill/gold')} />
          <VBar id="bar-unnamed" x={560} baseline={base} w={180} h={barMax * grow} fill={color('color/text/dim')} />
          <HRule id="rifle-base" x1={120} x2={900} y={base} />
          <Text id="label-rifles" text="3%" x={160} y={base + 16} w={180} size={40} kind="body" weight={600} />
          <Text id="label-unnamed" text="42%" x={560} y={base + 16} w={180} size={40} kind="body" weight={600} />
          <QrMark id="pew-qr" cue="rifles" url="https://www.pewresearch.org/short-reads/2025/03/05/what-the-data-says-about-gun-deaths-in-the-us/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
          <SourceLine at={riflesAt} text="Pew Research, FBI gun murders, 2024" />
        </>
      )}
    </>
  );
}
