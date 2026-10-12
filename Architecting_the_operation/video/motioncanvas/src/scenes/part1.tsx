/**
 * Part 1 pilot in Motion Canvas: hook through the loop (turns 0–6).
 * Beats come from the scriptCast manifest (src/data/part1_beats.json);
 * cues inside a beat are word timings from the voiceover.
 */
import {Circle, Layout, Line, Node, Rect, Txt, TxtProps, makeScene2D} from '@motion-canvas/2d';
import {
  Reference,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  linear,
  sequence,
  useTime,
  waitFor,
} from '@motion-canvas/core';
import beats from '../data/part1_beats.json';
import {C, FONT} from './theme';

const B = beats.beats;

function* until(t: number) {
  const d = t - useTime();
  if (d > 0) yield* waitFor(d);
}

function T(props: TxtProps) {
  return <Txt fontFamily={FONT} fontWeight={800} fill={C.ink} fontSize={56} textAlign={'center'} {...props} />;
}

/** Each beat draws into its own group so it can fade out as one. */
function* clear(group: Reference<Node>, rt = 0.4) {
  yield* group().opacity(0, rt);
  group().remove();
}

export default makeScene2D(function* (view) {
  view.fill(C.bg);

  // 0 ── hook: top half stays clear for Instagram's comment sticker
  {
    const g = createRef<Node>();
    const arrow = createRef<Line>();
    const q = createRef<Layout>();
    view.add(
      <Node ref={g}>
        <Line ref={arrow} points={[[0, -60], [0, -300]]} stroke={C.gold} lineWidth={12} endArrow arrowSize={28} end={0} />
        <T text={'SHE SAID THIS'} fontSize={44} fill={C.gold} y={-10} opacity={0} />
        <T text={'PART 1 OF 2'} fontSize={40} fill={C.dim} y={830} opacity={0} />
        <Layout ref={q} layout direction={'column'} alignItems={'center'} gap={10} y={430} opacity={0}>
          <T text={'DO YOU THINK'} fontSize={96} />
          <T text={'MEN ARE'} fontSize={96} />
          <T text={'STUPID?'} fontSize={116} fill={C.her} />
        </Layout>
      </Node>,
    );
    yield* all(arrow().end(1, 0.6, easeOutCubic), ...g().children().slice(1, 3).map(n => n.opacity(1, 0.6)));
    yield* arrow().position.y(-30, 0.4).to(0, 0.4);
    yield* until(4.8);
    yield* all(q().opacity(1, 0.5), q().scale(0.9, 0).to(1, 0.6, easeOutCubic));
    yield* until(B[1] - 0.4);
    yield* clear(g);
  }

  // 1 ── the old script tips toward him, then the correction flips it
  {
    const t0 = B[1];
    const g = createRef<Node>();
    const beam = createRef<Node>();
    const title = createRef<Txt>();
    const sub = createRef<Txt>();
    const verdict = createRef<Txt>();
    view.add(
      <Node ref={g} opacity={0}>
        <T ref={title} text={'THE OLD MARRIAGE SCRIPT'} fontSize={60} y={-640} />
        <T ref={sub} text={'centered him · called it mutual'} fontSize={44} fontWeight={400} fill={C.dim} y={-560} opacity={0} />
        <Line points={[[0, 380], [0, -40]]} stroke={C.dim} lineWidth={10} />
        <Line points={[[-180, 380], [180, 380]]} stroke={C.dim} lineWidth={10} />
        <Node ref={beam} y={-40}>
          <Line points={[[-430, 0], [430, 0]]} stroke={C.ink} lineWidth={12} />
          <Rect x={-360} y={90} width={170} height={170} fill={C.him} radius={8}>
            <T text={'HIM'} fontSize={44} fill={C.bg} />
          </Rect>
          <Rect x={360} y={90} width={170} height={170} fill={C.her} radius={8}>
            <T text={'HER'} fontSize={44} fill={C.bg} />
          </Rect>
        </Node>
        <Circle size={28} fill={C.ink} y={-40} />
        <T ref={verdict} text={'A RERUN'} fontSize={80} fill={C.gold} y={640} opacity={0} />
      </Node>,
    );
    yield* g().opacity(1, 0.6);
    yield* beam().rotation(-18, 1.2, easeInOutCubic);
    yield* sub().opacity(1, 0.4);
    yield* until(t0 + 8.5);
    yield* all(
      beam().rotation(18, 1.6, easeInOutCubic),
      title().text('THE CORRECTION', 0.6),
      title().fill(C.her, 0.6),
      sub().text('flipped who extracts', 0.6),
    );
    yield* until(t0 + 13.0);
    yield* verdict().opacity(1, 0.5);
    yield* until(B[2] - 0.4);
    yield* clear(g);
  }

  // 2 ── sex work and the comment, same structure
  {
    const t0 = B[2];
    const g = createRef<Node>();
    const lane = (left: string, right: string, color: string, y: number) => (
      <Node y={y} opacity={0}>
        <Rect x={-260} width={360} height={170} radius={24} stroke={color} lineWidth={5}>
          <T text={left} fontSize={40} fill={color} />
        </Rect>
        <Line points={[[-70, 0], [70, 0]]} stroke={color} lineWidth={8} endArrow arrowSize={22} />
        <Rect x={260} width={360} height={170} radius={24} stroke={color} lineWidth={5}>
          <T text={right} fontSize={40} fill={color} />
        </Rect>
      </Node>
    );
    const l1 = lane('$ PAYMENT', 'SEX CENTERED\nON PAYER', C.him, -420);
    const l2 = lane('CHORES\nDATES\nEFFORT', 'ACCESS', C.her, 20);
    view.add(
      <Node ref={g}>
        <T text={'SEX WORK'} fontSize={50} fill={C.dim} y={-590} />
        {l1}
        <T text={'THE COMMENT'} fontSize={50} fill={C.dim} y={-150} opacity={0} />
        {l2}
        <T text={'SAME STRUCTURE'} fontSize={72} fill={C.gold} y={330} opacity={0} />
        <T text={'SOFT-CORE SEX WORK\nINSIDE A RELATIONSHIP'} fontSize={60} fill={C.her} y={560} opacity={0} />
      </Node>,
    );
    const [h1, n1, h2, n2, same, soft] = g().children();
    yield* all(h1.opacity(1, 0.4), n1.opacity(1, 0.8));
    yield* until(t0 + 7.0);
    yield* all(h2.opacity(1, 0.4), n2.opacity(1, 0.8));
    yield* until(t0 + 11.0);
    yield* all(same.opacity(1, 0.5), n1.scale(1.05, 0.3).to(1, 0.3), n2.scale(1.05, 0.3).to(1, 0.3));
    yield* until(t0 + 13.0);
    yield* soft.opacity(1, 0.5);
    yield* until(B[3] - 0.4);
    yield* clear(g);
  }

  // 3–4 ── lead-in, then the double dip
  {
    const g = createRef<Node>();
    view.add(
      <Layout ref={g} layout direction={'column'} alignItems={'center'} gap={14}>
        <T text={'AND THEN…'} fontSize={68} fill={C.dim} opacity={0} />
        <T text={'SHE EXPECTS THE BEDROOM'} fontSize={60} opacity={0} />
        <T text={'TO CENTER HER, AND ONLY HER'} fontSize={60} fill={C.her} opacity={0} />
      </Layout>,
    );
    const [a, b, c] = g().children();
    yield* a.opacity(1, 0.4);
    yield* waitFor(0.6);
    yield* all(b.opacity(1, 0.5), c.opacity(1, 0.5));
    yield* until(B[4] - 0.3);
    yield* clear(g, 0.3);

    const t0 = B[4];
    const d = createRef<Node>();
    const fills = [createRef<Rect>(), createRef<Rect>()];
    view.add(
      <Node ref={d}>
        <T text={'THE DOUBLE DIP'} fontSize={84} fill={C.gold} y={-640} />
        {['NON-SEXUAL\nCOMPENSATION', 'SEXUAL\nCOMPENSATION'].map((name, k) => (
          <Node x={-240 + 480 * k} y={-60}>
            <Rect width={200} height={600} stroke={C.dim} lineWidth={4} />
            <Rect ref={fills[k]} width={200} height={0} y={300} offsetY={1} fill={C.her} />
            <T text={name} fontSize={36} y={400} />
          </Node>
        ))}
        <T text={'BOTH FILL FOR HER'} fontSize={50} fill={C.her} y={460} opacity={0} />
        <T text={"CHARGE → HE'S THE CLIENT"} fontSize={46} fill={C.him} y={570} opacity={0} />
        <T text={'WANT SERVICE → SERVE BACK'} fontSize={46} fill={C.ok} y={640} opacity={0} />
        <T text={'PICK ONE.'} fontSize={80} fill={C.gold} y={740} opacity={0} />
      </Node>,
    );
    const kids = d().children();
    yield* fills[0]().height(590, 1.4, easeInOutCubic);
    yield* fills[1]().height(590, 1.4, easeInOutCubic);
    yield* kids[3].opacity(1, 0.4);
    yield* until(t0 + 7.5);
    yield* sequence(0.6, ...kids.slice(4).map(n => n.opacity(1, 0.5)));
    yield* until(B[5] - 0.4);
    yield* clear(d);
  }

  // 5 ── the prize: hoops, then the trophy becomes a work order
  {
    const t0 = B[5];
    const g = createRef<Node>();
    const runner = createRef<Circle>();
    const prize = createRef<Txt>();
    const label = createRef<Txt>();
    const hoops: [number, number, string][] = [[-330, 420, 'CHORES'], [-120, 300, 'DATES'], [90, 180, 'EFFORT']];
    view.add(
      <Node ref={g}>
        <T ref={label} text={'THE PRIZE'} fontSize={64} fill={C.gold} y={-640} />
        <Rect x={330} y={60} width={280} height={140} fill={'#2A2A2A'} stroke={C.dim} lineWidth={3} />
        <T ref={prize} text={'★'} fontSize={260} fill={C.gold} x={330} y={-110} />
        {hoops.map(([x, y, n]) => (
          <Node x={x} y={y}>
            <Circle width={70} height={170} stroke={C.her} lineWidth={7} />
            <T text={n} fontSize={36} fill={C.her} y={135} />
          </Node>
        ))}
        <Circle ref={runner} size={44} fill={C.him} x={-480} y={560} />
        <T text={"SET YOURSELF UP AS HIS PRIZE,\nHE'LL TREAT YOU LIKE HIS PRIZE"} fontSize={48} y={640} opacity={0} />
      </Node>,
    );
    const hop = function* (x: number, y: number) {
      const sx = runner().x(), sy = runner().y();
      const p = createSignal(0);
      runner().position(() => {
        const s = p();
        return [sx + (x - sx) * s, sy + (y - sy) * s - Math.sin(Math.PI * s) * 160];
      });
      yield* p(1, 0.6, linear);
      runner().position([x, y]);
    };
    for (const [x, y] of hoops) yield* hop(x, y - 10);
    yield* hop(330, -40);
    yield* until(t0 + 5.0);
    yield* all(
      prize().text('▤', 0.8),
      prize().fill(C.ink, 0.8),
      label().text('WORK ORDER: SECOND SHIFT', 0.8),
      label().fill(C.her, 0.8),
      ...g().children().slice(3, 7).map(n => n.opacity(0, 0.8)),
    );
    yield* until(t0 + 8.5);
    yield* g().children()[7].opacity(1, 0.5);
    yield* until(B[6] - 0.4);
    yield* clear(g);
  }

  // 6 ── the loop, in spoken order, lit on the words
  {
    const t0 = B[6];
    const R = 370;
    const cy = -230;
    const g = createRef<Node>();
    const prog = createSignal(0);
    const labels = ["SHE ISN'T\nSERVED IN BED", 'SO SHE\nCHARGES', 'HE\nSELF-CENTERS', 'SHE\nGETS LESS'];
    const cues = [2.4, 4.3, 7.4, 9.0];
    const angles = [-90, 0, 90, 180]; // clockwise from the top, y down
    const nodes = labels.map(() => createRef<Txt>());
    view.add(
      <Node ref={g}>
        <T text={'THE LOOP'} fontSize={72} fill={C.gold} y={-760} />
        <Circle size={R * 2} y={cy} stroke={C.dim} lineWidth={4} />
        <Circle size={R * 2} y={cy} stroke={C.her} lineWidth={14} startAngle={-90} endAngle={() => -90 + 360 * prog()} />
        <Circle
          size={30}
          fill={C.gold}
          position={() => {
            const a = ((-90 + 360 * prog()) * Math.PI) / 180;
            return [R * Math.cos(a), cy + R * Math.sin(a)];
          }}
          opacity={0}
        />
        {labels.map((l, k) => {
          const a = (angles[k] * Math.PI) / 180;
          return (
            <Rect fill={C.bg} padding={14} radius={10} x={R * Math.cos(a)} y={cy + R * Math.sin(a)} layout>
              <T ref={nodes[k]} text={l} fontSize={42} />
            </Rect>
          );
        })}
        <T text={'IT CAN START ANYWHERE'} fontSize={44} fontWeight={400} fill={C.dim} y={cy + R + 160} opacity={0} />
      </Node>,
    );
    const kids = g().children();
    yield* all(...kids.map(n => (n === kids[3] || n === kids[kids.length - 1] ? waitFor(0) : n.opacity(0, 0).to(1, 0.8))));
    yield* kids[kids.length - 1].opacity(1, 0.4);
    yield* until(t0 + cues[0]);
    kids[3].opacity(1);
    yield* all(nodes[0]().fill(C.her, 0.3), nodes[0]().scale(1.12, 0.25).to(1, 0.25));
    for (let k = 1; k < 4; k++) {
      yield* prog(k / 4, Math.max(0.2, t0 + cues[k] - useTime()), linear);
      yield* all(nodes[k]().fill(C.her, 0.3), nodes[k]().scale(1.12, 0.2).to(1, 0.2));
    }
    yield* prog(1, 0.9, linear);
    yield* nodes[0]().scale(1.15, 0.2).to(1, 0.2);
    yield* until(t0 + 10.5);
    yield* clear(g, 0.3);
  }

  // Pilot ends here; the rest of Part 1 is still the manimgx render.
  yield* waitFor(1);
});
