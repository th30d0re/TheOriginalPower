// @vitest-environment jsdom

import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { equationCards } from '../src/content/equations/cards';
import SceneVisual from '../src/story/visuals/SceneVisual';

afterEach(cleanup);

const afterReactCommit = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const clickAndCommit = async (user: ReturnType<typeof userEvent.setup>, element: HTMLElement) => {
  await user.click(element);
  await afterReactCommit();
};

const buttonNamed = (container: HTMLElement, name: string) => {
  const button = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
    .find((candidate) => candidate.textContent?.trim() === name);
  if (button === undefined) throw new Error(`${name} button is missing.`);
  return button;
};

describe('story equation enrichment states', () => {
  test('full expands to tier, falsification, sources, and a two-way decoder', async () => {
    const user = userEvent.setup();
    const card = equationCards.find((candidate) => candidate.label === 'eq:6.12-capacity-compounding-full');
    if (card === undefined) throw new Error('Capacity-compounding fixture is missing.');

    render(
      <SceneVisual
        spec={{ kind: 'equation', latex: card.latex, label: 'eq. 1.1', caption: 'Enclosure score.' }}
        chapterFile="ch09_enforcement_engine.ts"
        equationOccurrence={0}
      />,
    );

    const figure = document.querySelector<HTMLElement>('[data-enrichment="full"]');
    if (figure === null) throw new Error('Full story equation is missing.');
    expect(within(figure).getByText(`Tier ${card.validation?.tier}`)).toBeTruthy();

    await clickAndCommit(user, within(figure).getByRole('button', { name: 'Expand equation details' }));
    expect(figure.querySelector('.falsification-box')?.textContent).toContain(card.validation?.falsification);
    expect(figure.querySelector('.equation-sources')).not.toBeNull();

    await clickAndCommit(user, buttonNamed(figure, 'Manuscript'));
    expect(figure.querySelector('.manuscript-copy')).not.toBeNull();
    await clickAndCommit(user, buttonNamed(figure, 'Adapted'));
    expect(figure.querySelector('.manuscript-copy')).toBeNull();

    await clickAndCommit(user, buttonNamed(figure, 'Collapse equation details'));
    expect(figure.querySelector('.story-equation-details')).toBeNull();
  });

  test('partial exposes terms without any provenance block', async () => {
    const user = userEvent.setup();
    render(
      <SceneVisual
        spec={{ kind: 'equation', latex: 'T = V_E + Q_{\\text{unknown}}', label: 'The Unified Lorentz Force' }}
        chapterFile="ch00_system_initialization.ts"
        equationOccurrence={0}
      />,
    );

    const figure = document.querySelector<HTMLElement>('[data-enrichment="partial"]');
    if (figure === null) throw new Error('Partial story equation is missing.');
    expect(figure.querySelector('.equation-tier')).toBeNull();
    await clickAndCommit(user, within(figure).getByRole('button', { name: 'Expand equation details' }));
    expect(figure.querySelector('.term-chip')).not.toBeNull();
    expect(figure.querySelectorAll('.term-chip')).toHaveLength(2);
    expect(figure.querySelectorAll('.equation-symbol')).toHaveLength(2);
    expect(figure.querySelector('.equation-term-detail')).not.toBeNull();
    expect(figure.querySelector('.story-equation-provenance')).toBeNull();
    expect(figure.querySelector('.falsification-box')).toBeNull();
    expect(figure.querySelector('.equation-sources')).toBeNull();
  });

  test('none preserves the existing plain equation rendering', () => {
    render(
      <SceneVisual
        spec={{ kind: 'equation', latex: 'O = 0', label: 'eq:german-liquidation-reclass' }}
        chapterFile="ch11_german_extraction.ts"
        equationOccurrence={0}
      />,
    );

    expect(document.querySelector('.story-equation-card')).toBeNull();
    expect(document.querySelector('.equation-figure')).not.toBeNull();
    expect(within(document.body).getByText('eq:german-liquidation-reclass')).toBeTruthy();
  });
});
