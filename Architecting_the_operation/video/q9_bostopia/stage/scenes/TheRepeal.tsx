import React from 'react';
import {staticFile} from 'remotion';
import {useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {Edge, FLOOR, Frame, Phrases, SourceLine, Text, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark, cornerQr} from './shared/QrMark';

const box = (x: number, y: number, w: number, h: number) => `${Math.round(x)} ${Math.round(y)} ${Math.round(w)} ${Math.round(h)}`;

function RifleMark({id, x, y, w, h, wood}: {id: string; x: number; y: number; w: number; h: number; wood?: boolean}) {
  const stock = color(wood ? 'color/fill/panel' : 'color/fill/gold');
  const metal = color('color/text/primary');
  const barrel = color('color/text/dim');
  return (
    <svg data-shape={id} data-role="mark" data-layer="rifles" data-box={box(x, y, w, h)} width={w} height={h} viewBox="0 0 220 150" style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <rect x={108} y={46} width={104} height={14} rx={3} fill={barrel} />
      <rect x={74} y={32} width={56} height={42} rx={4} fill={metal} />
      <rect x={8} y={wood ? 28 : 36} width={wood ? 88 : 64} height={wood ? 54 : 38} rx={6} fill={stock} />
      {wood && <rect x={108} y={58} width={52} height={20} rx={3} fill={stock} />}
      {!wood && <rect x={84} y={74} width={18} height={66} rx={4} fill={stock} />}
      {!wood && <rect x={106} y={74} width={20} height={70} rx={4} fill={stock} />}
    </svg>
  );
}

export function TheRepeal({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('bostopia_abusers', segment.start_ms);
  const abusesAt = useCue('abuses').at;
  const gunAt = useCue('gun').at;
  const bearAt = useCue('bear').at;
  const jailAt = useCue('jail').at;
  const everyoneAt = useCue('everyone').at;
  const repealsAt = useCue('repeals').at;
  const strictAt = useCue('strict').at;
  const bannedAt = useCue('banned').at;
  const noticeAt = useCue('notice').at;
  const miniAt = useCue('mini14').at;
  const withoutAt = useCue('without').at;
  const augustAt = useCue('august').at;
  const tighteningAt = useCue('tightening').at;
  const stockAt = useCue('stock').at;
  const gripAt = useCue('grip').at;
  const shooterAt = useCue('shooter').at;
  const landsAt = useCue('lands').at;
  const protectingAt = useCue('protecting').at;
  const schoolAt = useCue('school').at;
  const grant = done && ms >= jailAt && ms < repealsAt;
  const speech = done && ms >= repealsAt && ms < miniAt;
  const rifles = done && ms >= miniAt && ms < stockAt;
  const parts = done && ms >= stockAt;
  const lines: PhraseSpec[] = parts
    ? [
        {id: 'ph-stock', at: stockAt, text: 'an adjustable stock'},
        {id: 'ph-grip', at: gripAt, text: 'a grip'},
        {id: 'ph-shooter', at: shooterAt, text: 'a smaller or disabled shooter'},
        {id: 'ph-lands', at: landsAt, text: 'lands on women'},
        {id: 'ph-protecting', at: protectingAt, text: 'disabled people protecting themselves'},
        {id: 'ph-school', at: schoolAt, text: 'hiding abuse from a school'},
      ]
    : rifles
      ? [
          {id: 'ph-round', at: miniAt, text: 'fires the same round'},
          {id: 'ph-without', at: withoutAt, text: 'People without counsel'},
          {id: 'ph-keep', at: augustAt, text: 'you can register it and keep it'},
          {id: 'ph-tight', at: tighteningAt, text: 'the tightening is written against.'},
        ]
      : speech
        ? [
            {id: 'ph-repeals', at: repealsAt, text: 'A no vote repeals the 2024 act.'},
            {id: 'ph-strict', at: strictAt, text: 'that law was already strict.'},
            {id: 'ph-banned', at: bannedAt, text: 'banned by name'},
            {id: 'ph-notice', at: noticeAt, text: 'issued a notice'},
          ]
        : [
            {id: 'ph-abuses', at: abusesAt, until: everyoneAt, text: 'abuses his family'},
            {id: 'ph-gun', at: gunAt, until: everyoneAt, text: 'should lose the gun'},
            {id: 'ph-bear', at: bearAt, until: everyoneAt, text: 'the ability to bear any arm'},
            {id: 'ph-jail', at: jailAt, until: everyoneAt, text: 'put in jail for abuse'},
            {id: 'ph-everyone', at: everyoneAt, text: 'everyone who votes no'},
          ];
  const spread = grant || speech;
  const packed = phraseBottom(lines, ms, spread ? {x: 96, y: grant ? 420 : 220, w: 880} : undefined);
  const nameH = blockHeight('Mini-14', 440, 72);
  const sameH = blockHeight('Same round.', 960, 64);
  const dateH = blockHeight('August 1, 2024', 960, 72);
  const showDate = ms >= augustAt;
  const footerH = sameH + (showDate ? 16 + dateH : 0);
  const figW = 460;
  const naturalFig = Math.round(figW * 150 / 220);
  const room = FLOOR - (packed + 16) - nameH - 12 - 16 - footerH;
  const figH = Math.max(160, Math.min(naturalFig, room));
  const blockH = nameH + 12 + figH + 16 + footerH;
  const blockTop = Math.max(packed + 16, FLOOR - blockH);
  const nameY = blockTop;
  const figY = nameY + nameH + 12;
  const sameY = figY + figH + 16;
  const dateY = sameY + sameH + 16;
  const head = 'Stock and grip';
  const headH = blockHeight(head, 960, 72);
  const headY = packed + 16;
  const panelY = headY + headH + 16;
  const panelH = Math.max(1, FLOOR - panelY);
  const pad = 28;
  const innerW = 960 - pad * 2;
  const innerH = panelH - pad * 2;
  const colW = (innerW - 24) / 2;
  let stockW = colW;
  let stockH = stockW * 849 / 1500;
  if (stockH > innerH) {
    stockH = innerH;
    stockW = stockH * 1500 / 849;
  }
  let gripH = innerH;
  let gripW = gripH * 786 / 1014;
  if (gripW > colW) {
    gripW = colW;
    gripH = gripW * 1014 / 786;
  }
  const stockX = 60 + pad + (colW - stockW) / 2;
  const gripX = 60 + pad + colW + 24 + (colW - gripW) / 2;
  const stockImgY = panelY + pad + (innerH - stockH) / 2;
  const gripImgY = panelY + pad + (innerH - gripH) / 2;
  return (
    <>
      <ClipFrames clip="bostopia_abusers" startMs={segment.start_ms} />
      {(grant || speech) && (
        <>
          <Frame id="speech-card" x={60} y={160} w={960} h={1424} />
          <Edge id="speech-edge" x={60} y={160} h={1424} />
        </>
      )}
      {grant && (
        <Text id="lose-gun" text="He should lose the gun." x={96} y={220} w={880} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
      )}
      {done && (
        <Phrases lines={lines} ms={ms} spread={spread} x={spread ? 96 : 60} y={grant ? 420 : speech ? 220 : 148} w={spread ? 880 : 960} bottom={spread ? 1460 : undefined} />
      )}
      {rifles && (
        <>
          <Text id="ar-name" text="AR-15" x={60} y={nameY} w={440} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="mini-name" text="Mini-14" x={560} y={nameY} w={440} size={72} kind="headline" weight={600} />
          <RifleMark id="ar-fig" x={60} y={figY} w={figW} h={figH} />
          <RifleMark id="mini-fig" x={560} y={figY} w={figW} h={figH} wood />
          <Text id="same-round" text="Same round." x={60} y={sameY} w={960} size={64} kind="headline" weight={600} />
          {showDate && (
            <Text id="august-date" text="August 1, 2024" x={60} y={dateY} w={960} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
          )}
        </>
      )}
      {parts && (
        <>
          <Text id="parts-title" text={head} x={60} y={headY} w={960} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <div data-shape="parts-plate" data-role="frame" data-box={box(60, panelY, 960, panelH)} style={{position: 'absolute', left: 60, top: panelY, width: 960, height: panelH, background: color('color/text/primary'), borderRadius: 8}} />
          <img data-shape="stock-photo" data-role="mark" data-layer="parts" data-box={box(stockX, stockImgY, stockW, stockH)} src={staticFile('assets/parts/stock.png')} alt="" style={{position: 'absolute', left: stockX, top: stockImgY, width: stockW, height: stockH, objectFit: 'contain'}} />
          <img data-shape="grip-photo" data-role="mark" data-layer="parts" data-box={box(gripX, gripImgY, gripW, gripH)} src={staticFile('assets/parts/pistol_grip.png')} alt="" style={{position: 'absolute', left: gripX, top: gripImgY, width: gripW, height: gripH, objectFit: 'contain'}} />
        </>
      )}
      {ms >= miniAt && <QrMark id="notice-qr" cue="mini14" url="https://www.mass.gov/enforcing-the-massachusetts-assault-weapons-ban" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />}
      {ms >= miniAt && <SourceLine at={miniAt} text="Source: Massachusetts Attorney General, 2016 notice" />}
    </>
  );
}
