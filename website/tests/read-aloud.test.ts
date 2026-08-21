import assert from 'node:assert/strict';
import test from 'node:test';
import { orderByDocumentElements } from '../src/videolab/readAloudOrder.ts';
import { latexToSpeech } from '../src/videolab/speechText.ts';

test('group play order follows document position when registration order differs', () => {
  const first = { fixtureId: 'first-in-document' };
  const second = { fixtureId: 'second-in-document' };
  const third = { fixtureId: 'third-in-document' };
  const played: string[] = [];
  const registrationOrder = [
    { id: 'third', element: third, play: () => played.push('third') },
    { id: 'first', element: first, play: () => played.push('first') },
    { id: 'second', element: second, play: () => played.push('second') },
  ];

  const readers = orderByDocumentElements(registrationOrder, [first, second, third]);
  readers.forEach((reader) => reader.play());

  assert.deepEqual(played, ['first', 'second', 'third']);
  assert.notDeepEqual(played, registrationOrder.map((reader) => reader.id));
});

test('converts the conjugate equation into clean spoken words', () => {
  const spoken = latexToSpeech('Therefore $W + W^{*} = 2\\psi_m$ under solidarity.');

  assert.equal(spoken, 'Therefore W plus W conjugate equals two psi m under solidarity.');
  assert.doesNotMatch(spoken, /[$\\^_]/);
});

test('speaks math spans that have no whole-span phrasing', () => {
  // Regression: an unmapped span was dropped entirely, leaving "With the wage is
  // symbolic." — grammatical damage is worse than clunky phrasing.
  const spoken = latexToSpeech('With $\\theta \\to 90^{\\circ}$ the wage is symbolic.');
  assert.equal(spoken, 'With theta approaching 90 degrees the wage is symbolic.');
});

test('degrades an unknown macro to something sayable', () => {
  const spoken = latexToSpeech('Some $\\unknownmacro{z}$ span.');
  assert.ok(!/[$\\^_{}]/.test(spoken), 'no LaTeX syntax survives');
  assert.ok(spoken.length > 0);
});
