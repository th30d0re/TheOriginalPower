import React from 'react';
import {staticFile} from 'remotion';
import {cubicOut, progress, useCue, useStageMs} from '@stage';
import type {SceneProps} from '@stage';
import {color} from '../../../yt02/stage/tokens';
import {ClipFrames, clipEndMs} from './shared/ClipFrames';
import {FLOOR, Frame, HBar, HRule, Phrases, SourceLine, Text, VBar, blockHeight, phraseBottom, type PhraseSpec} from './shared/layout';
import {QrMark} from './shared/QrMark';

const GREEN_FRAMES = 386;

function ReceiptField({x, y, w, h}: {x: number; y: number; w: number; h: number}) {
  const cols = 54;
  const cellW = w / cols;
  const cellH = h / 62;
  const cells = [];
  for (let index = 0; index < 3324; index++) {
    const dim = index % 4 === 0 && index / 4 < 825;
    const col = index % cols;
    const row = Math.floor(index / cols);
    cells.push(
      <rect
        key={index}
        x={col * cellW + 0.6}
        y={row * cellH + 0.6}
        width={Math.max(1, cellW - 1.2)}
        height={Math.max(1, cellH - 1.2)}
        fill={color(dim ? 'color/text/dim' : 'color/fill/gold')}
      />,
    );
  }
  return (
    <svg data-shape="receipt-field" data-role="mark" data-layer="receipts" data-box={`${Math.round(x)} ${Math.round(y)} ${Math.round(w)} ${Math.round(h)}`} width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {cells}
    </svg>
  );
}

export function TheCheck({segment}: SceneProps) {
  const ms = useStageMs();
  const done = ms >= clipEndMs('bostopia_smith', segment.start_ms);
  const smithAt = useCue('smith').at;
  const septemberAt = useCue('september').at;
  const fiftyAt = useCue('fifty').at;
  const receiptAt = useCue('receipt').at;
  const lessAt = useCue('less').at;
  const repealAt = useCue('repeal').at;
  const toursAt = useCue('tours').at;
  const licenseAt = useCue('license').at;
  const greenAt = useCue('green').at;
  const virginiaAt = useCue('virginia').at;
  const fifteenAt = useCue('fifteen').at;
  const struckAt = useCue('struck').at;
  const wealthAt = useCue('wealth').at;
  const seventyAt = useCue('seventyeight').at;
  const arrivingAt = useCue('arriving').at;
  const showGreen = ms >= greenAt && ms < virginiaAt;
  const lines: PhraseSpec[] = [
    {id: 'ph-smith', at: smithAt, until: licenseAt, text: 'He names Smith and Wesson'},
    {id: 'ph-september', at: septemberAt, until: licenseAt, text: 'September 25th, 2024'},
    {id: 'ph-fifty', at: fiftyAt, until: licenseAt, text: 'Fifty thousand dollars'},
    {id: 'ph-receipt', at: receiptAt, until: licenseAt, text: 'That is one receipt'},
    {id: 'ph-less', at: lessAt, until: licenseAt, text: 'a hundred dollars or less'},
    {id: 'ph-repeal', at: repealAt, until: licenseAt, text: 'on the repeal'},
    {id: 'ph-tours', at: toursAt, until: licenseAt, text: 'the listening tours'},
    {id: 'ph-license', at: licenseAt, text: 'two hundred dollars or more'},
    {id: 'ph-virginia', at: virginiaAt, text: "Virginia's poll tax"},
    {id: 'ph-fifteen', at: fifteenAt, text: 'about fifteen dollars a year'},
    {id: 'ph-struck', at: struckAt, text: 'the Supreme Court struck it down'},
    {id: 'ph-wealth', at: wealthAt, text: 'Median net wealth in Massachusetts'},
    {id: 'ph-seventy', at: seventyAt, text: 'seventy-eight hundred'},
    {id: 'ph-arriving', at: arrivingAt, text: 'the one still arriving'},
  ];
  const packed = phraseBottom(lines, ms);
  const greenFrame = Math.min(GREEN_FRAMES, Math.max(1, Math.floor(((ms - greenAt) * 30) / 1000) + 1));
  if (showGreen) {
    return (
      <>
        <ClipFrames clip="bostopia_smith" startMs={segment.start_ms} />
        <img src={staticFile(`assets/clips/green/f${String(greenFrame).padStart(3, '0')}.jpg`)} alt="" style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, objectFit: 'cover'}} />
      </>
    );
  }
  const showReceipt = done && ms >= receiptAt && ms < licenseAt;
  const showLicense = done && ms >= licenseAt && ms < greenAt;
  const showFees = done && ms >= fifteenAt && ms < wealthAt;
  const showWealth = done && ms >= wealthAt;
  const receiptTop = packed + 20;
  const receiptLines = [
    {id: 'receipt-name', text: 'Smith and Wesson Brands', size: 40, kind: 'body' as const},
    {id: 'receipt-date', text: 'September 25th, 2024', size: 40, kind: 'body' as const},
    {id: 'receipt-committee', text: 'The Civil Rights Coalition', size: 40, kind: 'body' as const},
    {id: 'receipt-amount', text: '$50,000', size: 72, kind: 'headline' as const},
  ];
  const innerX = 200;
  const innerW = 680;
  let cursor = receiptTop + 36;
  const receiptPlaced = receiptLines.map(line => {
    const h = blockHeight(line.text, innerW, line.size);
    const placed = {...line, y: cursor, h};
    cursor += h + 18;
    return placed;
  });
  const receiptH = cursor - receiptTop + 24;
  const countY = receiptTop + receiptH + 16;
  const countH = blockHeight('2,499', 440, 64);
  const fieldY = countY + countH + 12;
  const fieldH = Math.max(120, FLOOR - fieldY);
  const feeHead = '+50% and +32.7%';
  const feeHeadH = blockHeight(feeHead, 960, 64);
  const feeRows = [
    {id: 'basic', text: 'Basic $80 to $150', amount: 150},
    {id: 'live', text: 'Live fire $120 to $199', amount: 199},
    {id: 'ltc', text: 'LTC fee $100', amount: 100},
  ];
  const feeTop = packed + 16;
  let feeY = feeTop + feeHeadH + 20;
  const feePlaced = feeRows.map(row => {
    const h = blockHeight(row.text, 960, 40);
    const placed = {...row, y: feeY, h, bar: Math.round(640 * row.amount / 199)};
    feeY += h + 8 + 28 + 18;
    return placed;
  });
  const cities = 'Boston, Weymouth, Quincy, Rockland, and Braintree already required it.';
  const citiesH = blockHeight(cities, 960, 40);
  const citiesY = Math.min(Math.max(feeY + 24, 1280), FLOOR - citiesH);
  const licenseText = '$200 or more';
  const licenseH = blockHeight(licenseText, 960, 84);
  const licenseY = packed + 24;
  const wealthTop = packed + 16;
  const wealthLabelH = blockHeight('$550,000', 420, 64);
  const familyH = blockHeight('white families', 420, 40);
  const wealthBase = 1520;
  const wealthFull = Math.max(160, wealthBase - (wealthTop + wealthLabelH + 8 + familyH + 20));
  const grow = cubicOut(progress(ms, wealthAt, wealthAt + 700));
  const whiteH = wealthFull * grow;
  const blackH = wealthFull * (7800 / 550000) * grow;
  return (
    <>
      <ClipFrames clip="bostopia_smith" startMs={segment.start_ms} />
      {done && <Phrases lines={lines} ms={ms} />}
      {showReceipt && (
        <>
          <Frame id="receipt-card" x={160} y={receiptTop} w={760} h={receiptH} />
          {receiptPlaced.map(line => (
            <Text key={line.id} id={line.id} text={line.text} x={innerX} y={line.y} w={innerW} size={line.size} kind={line.kind} weight={line.kind === 'headline' ? 600 : 500} ink={line.kind === 'headline' ? color('color/fill/gold') : color('color/text/primary')} />
          ))}
          <Text id="count-small" text="2,499" x={60} y={countY} w={440} size={64} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="count-all" text="3,324" x={540} y={countY} w={440} size={64} kind="headline" weight={600} />
          <ReceiptField x={60} y={fieldY} w={960} h={fieldH} />
          <SourceLine at={receiptAt} id="source-ocpf" text="Source: OCPF report 960537, receipt 17220407" until={licenseAt} w={600} />
        </>
      )}
      {showLicense && (
        <>
          <Text id="fee-floor" text={licenseText} x={60} y={licenseY} w={960} size={84} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <VBar id="license-bar" x={430} baseline={1500} w={160} h={Math.max(80, 1500 - (licenseY + licenseH + 24))} fill={color('color/fill/gold')} />
          <HRule id="license-base" x1={180} x2={900} y={1500} />
        </>
      )}
      {showFees && (
        <>
          <Text id="fee-jump" text={feeHead} x={60} y={feeTop} w={960} size={64} kind="headline" weight={600} ink={color('color/fill/gold')} />
          {feePlaced.map(row => (
            <React.Fragment key={row.id}>
              <Text id={`${row.id}-label`} text={row.text} x={60} y={row.y} w={960} size={40} kind="body" />
              <HBar id={`${row.id}-bar`} x={60} y={row.y + row.h + 8} w={row.bar} h={28} fill={color(row.id === 'live' ? 'color/fill/gold' : 'color/text/dim')} />
            </React.Fragment>
          ))}
          <Text id="already-required" text={cities} x={60} y={citiesY} w={960} size={40} kind="body" />
          <SourceLine at={fifteenAt} id="source-fire" text="Loretta Green · EOPSS live-fire report" w={580} />
          <QrMark id="report-qr" cue="fifteen" url="https://www.mass.gov/doc/section-152-live-firearms-report/download" x={676} y={1616} size={152} />
          <QrMark id="green-qr" cue="fifteen" url="https://www.instagram.com/reel/DfQYuKCBZGH/" x={848} y={1616} size={152} />
        </>
      )}
      {showWealth && (
        <>
          <Text id="wealth-white" text="$550,000" x={80} y={wealthTop} w={420} size={64} kind="headline" weight={600} ink={color('color/fill/gold')} />
          <Text id="wealth-white-who" text="white families" x={80} y={wealthTop + wealthLabelH + 8} w={420} size={40} kind="body" />
          <Text id="wealth-black" text="$7,800" x={560} y={wealthTop} w={420} size={64} kind="headline" weight={600} />
          <Text id="wealth-black-who" text="Black families" x={560} y={wealthTop + wealthLabelH + 8} w={420} size={40} kind="body" />
          <VBar id="wealth-white-bar" x={180} baseline={wealthBase} w={160} h={whiteH} fill={color('color/fill/gold')} layer="wealth" />
          <VBar id="wealth-black-bar" x={660} baseline={wealthBase} w={160} h={Math.max(blackH, 8)} fill={color('color/marker/race')} layer="wealth" />
          <HRule id="wealth-base" x1={120} x2={900} y={wealthBase} />
        </>
      )}
    </>
  );
}
