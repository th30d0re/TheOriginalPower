import React from 'react';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {HRule, Phrases, SourceLine, Text, VBar, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

export function Paranoia(_props: SceneProps) {
  const ms = useStageMs();
  const womenAt = useCue('women').at;
  const jumpAt = useCue('eightyseven').at;
  const calledAt = useCue('paranoia').at;
  const lines: PhraseSpec[] = [
    {id: 'ph-women', at: womenAt, text: 'Gun ownership among Black women'},
    {id: 'ph-jump', at: jumpAt, text: 'eighty-seven percent'},
    {id: 'ph-called', at: calledAt, text: 'called it paranoia'},
  ];
  const packed = phraseBottom(lines, ms);
  const grow = cubicOut(progress(ms, jumpAt, jumpAt + 700));
  const base = 1508;
  let y = packed + 20;
  const stat = '+87%';
  const statH = blockHeight(stat, 960, 120);
  const note = 'Black women, gun ownership, 2021.';
  const noteH = blockHeight(note, 960, 44);
  const called = 'He called that record paranoia.';
  const calledH = ms >= calledAt ? blockHeight(called, 960, 56) : 0;
  const textBottom = ms >= jumpAt ? y + statH + 12 + noteH + (ms >= calledAt ? 16 + calledH : 0) : y;
  const barH = Math.max(80, base - textBottom - 36) * grow;
  return (
    <>
      <Phrases lines={lines} ms={ms} />
      {ms >= jumpAt && (
        <>
          <Text id="plus-87" text={stat} x={60} y={y} w={960} size={120} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="ownership-note" text={note} x={60} y={y + statH + 12} w={960} size={44} kind="body" />
        </>
      )}
      {ms >= calledAt && (
        <Text id="called-record" text={called} x={60} y={y + statH + 12 + noteH + 16} w={960} size={56} kind="headline" />
      )}
      {ms >= jumpAt && (
        <>
          <VBar id="ownership-bar" x={390} baseline={base} w={200} h={barH} fill={color('color/fill/gold')} />
          <HRule id="ownership-base" x1={180} x2={900} y={base} />
        </>
      )}
      {ms >= jumpAt && <QrMark id="nssf-qr" cue="eightyseven" url="https://www.kron4.com/hidden-history/black-history-month/gun-ownership-increasing-among-black-women/" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {ms >= jumpAt && <SourceLine at={jumpAt} text="Source: NSSF via KRON4" />}
    </>
  );
}
