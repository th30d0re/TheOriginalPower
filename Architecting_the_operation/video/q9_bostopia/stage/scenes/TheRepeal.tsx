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
  const showDate = ms >= augustAt;
  const dateH = blockHeight('August 1, 2024', 960, 72);
  const blockTop = packed + 16;
  const blockH = FLOOR - blockTop - (showDate ? dateH + 24 : 0);
  const dateY = FLOOR - dateH;
  const panelY = packed + 16;
  const panelH = FLOOR - panelY;
  const partsList = [
    {
      image: 'assets/parts/stock.png',
      title: 'Adjustable stock',
      detail: 'Changes the length of pull, so a smaller frame gets a proper fit',
    },
    {
      image: 'assets/parts/pistol_grip.png',
      title: 'Pistol grip',
      detail: 'Easier to control, with a natural hand and wrist position',
    },
    {
      image: 'assets/parts/forward_grip.png',
      title: 'Forward grip',
      detail: 'Gives the support hand a place to steady the rifle',
    },
    {
      image: 'assets/parts/threaded_barrel.png',
      title: 'Threaded barrel',
      detail: 'Accepts a flash suppressor or muzzle brake',
    },
    {
      image: 'assets/parts/shroud.png',
      title: 'Barrel shroud',
      detail: "Shields the bearer's hand from heat",
    },
  ];
  const rowH = Math.floor((panelH - 16) / 5);
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
          <div
            data-shape="ruger-ar-plate"
            data-role="frame"
            data-box={box(60, blockTop, 960, blockH)}
            style={{
              position: 'absolute',
              left: 60,
              top: blockTop,
              width: 960,
              height: blockH,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              data-shape="ruger-vs-ar"
              data-role="mark"
              data-box={box(80, blockTop + 10, 920, blockH - (showDate ? dateH + 32 : 20))}
              src={staticFile('assets/frames/ruger_vs_ar15.jpg')}
              alt="Ruger Mini-14 vs AR-15"
              style={{
                width: 920,
                maxHeight: blockH - (showDate ? dateH + 32 : 20),
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          </div>
          {showDate && (
            <Text id="august-date" text="August 1, 2024" x={60} y={dateY} w={960} size={72} kind="headline" weight={600} ink={color('color/fill/gold')} />
          )}
        </>
      )}
      {parts && (
        <div
          data-shape="parts-plate"
          data-role="frame"
          data-box={box(60, panelY, 960, panelH)}
          style={{
            position: 'absolute',
            left: 60,
            top: panelY,
            width: 960,
            height: panelH,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {partsList.map((part, index) => (
            <div
              key={part.title}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: rowH,
                padding: '8px 16px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: 220,
                  height: rowH - 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img
                  src={staticFile(part.image)}
                  alt=""
                  style={{
                    maxWidth: 210,
                    maxHeight: rowH - 16,
                    objectFit: 'contain',
                    filter: 'brightness(1.8) contrast(1.1) drop-shadow(0 0 6px rgba(244,234,210,0.5))',
                  }}
                />
              </div>
              <div style={{flex: 1, paddingLeft: 24}}>
                <div style={{fontSize: 40, fontWeight: 700, color: color('color/fill/gold'), lineHeight: 1.15}}>
                  {part.title}
                </div>
                <div style={{fontSize: 28, color: color('color/text/primary'), marginTop: 6, lineHeight: 1.25}}>
                  {part.detail}
                </div>
              </div>
              {index < partsList.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 16,
                    right: 16,
                    height: 1,
                    background: color('color/line/hairline'),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {ms >= miniAt && ms < stockAt && (
        <>
          <QrMark id="notice-qr" cue="mini14" url="https://www.mass.gov/enforcing-the-massachusetts-assault-weapons-ban" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
          <SourceLine at={miniAt} text="Source: Massachusetts Attorney General, 2016 notice" />
        </>
      )}
      {ms >= stockAt && (
        <>
          <QrMark id="c121-qr" cue="stock" url="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXX/Chapter140/Section121" x={cornerQr.x} y={cornerQr.y} size={cornerQr.size} />
          <SourceLine at={stockAt} text="Source: G.L. c.140, § 121 (the five features)" />
        </>
      )}
    </>
  );
}
