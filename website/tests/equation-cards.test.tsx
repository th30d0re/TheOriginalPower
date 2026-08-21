// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquationCards, { EquationCardView } from '../src/components/EquationCards';
import { equationCards, symbolsForCard, type EquationCard } from '../src/content/equations/cards';

const DECODER_MODE_KEY = 'uef-equation-decoder-mode';
const firstCard = equationCards[0];

if (firstCard === undefined) throw new Error('Equation card fixture is missing.');

const firstArticle = () => {
  const heading = within(document.body).getByRole('heading', { name: firstCard.title });
  const article = heading.closest('article');
  if (article === null) throw new Error('Equation card article is missing.');
  return article;
};

const buttonNamed = (article: HTMLElement, name: string) => {
  const button = Array.from(article.querySelectorAll<HTMLButtonElement>('button'))
    .find((item) => item.textContent?.trim() === name);
  if (button === undefined) throw new Error(`${name} button is missing.`);
  return button;
};

describe('equation card interactions', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  test('round-trips between adapted and manuscript renderings', async () => {
    const user = userEvent.setup();
    render(<EquationCards />);
    const article = firstArticle();

    expect(article.querySelector('.decoder-heading-row h3')?.textContent).toBe('Adapted explanation');
    expect(article.querySelector('.decoder-copy')?.textContent).toBe(firstCard.decoder.adapted.map((span) => span.text).join(''));

    await user.click(buttonNamed(article, 'Manuscript'));
    expect(article.querySelector('.decoder-heading-row h3')?.textContent).toBe('Manuscript passage');
    expect(article.querySelector('.manuscript-copy')?.textContent).toContain('Across the historical dataset of the Predatory Min-Max Function');
    expect(article.querySelector('.manuscript-copy cite')?.textContent).toBe(`Manuscript line ${firstCard.decoder.verbatim?.sourceLine}`);

    await user.click(buttonNamed(article, 'Adapted'));
    expect(article.querySelector('.decoder-heading-row h3')?.textContent).toBe('Adapted explanation');
    expect(article.querySelector('.decoder-copy')?.textContent).toBe(firstCard.decoder.adapted.map((span) => span.text).join(''));
  });

  test('persists the chosen mode and restores it on remount', async () => {
    const user = userEvent.setup();
    const mounted = render(<EquationCards />);

    await user.click(buttonNamed(firstArticle(), 'Manuscript'));
    expect(localStorage.getItem(DECODER_MODE_KEY)).toBe('manuscript');

    mounted.unmount();
    render(<EquationCards />);
    expect(firstArticle().querySelector('.decoder-heading-row h3')?.textContent).toBe('Manuscript passage');

    await user.click(buttonNamed(firstArticle(), 'Adapted'));
    expect(localStorage.getItem(DECODER_MODE_KEY)).toBe('adapted');
  });

  test('moves every selected-term marker to the clicked color index', async () => {
    const user = userEvent.setup();
    render(<EquationCards />);
    const article = firstArticle();
    const chips = article.querySelectorAll<HTMLButtonElement>('.term-chip');
    const selectedIndex = 2;
    const chosenChip = chips[selectedIndex];
    const symbols = symbolsForCard(firstCard);
    const chosenSymbol = symbols[selectedIndex];

    if (chosenChip === undefined || chosenSymbol === undefined) throw new Error('Selected-term fixture is missing.');
    await user.click(chosenChip);

    expect(article.querySelectorAll('.term-chip.is-selected')).toHaveLength(1);
    expect(chosenChip.classList.contains(`equation-symbol-color-${selectedIndex}`)).toBe(true);
    expect(chosenChip.classList.contains('is-selected')).toBe(true);

    const equationSelection = article.querySelector(`.equation-display .equation-symbol-color-${selectedIndex}.is-selected`);
    const decoderSelection = article.querySelector(`.decoder-symbol.equation-symbol-color-${selectedIndex}.is-selected`);
    const detail = article.querySelector('.equation-term-detail');
    expect(equationSelection).not.toBeNull();
    expect(decoderSelection).not.toBeNull();
    expect(detail?.classList.contains(`equation-symbol-color-${selectedIndex}`)).toBe(true);
    expect(detail?.querySelector('h3')?.textContent).toBe(chosenSymbol.name);
  });

  test('keeps the toggle visible and disables Manuscript when verbatim is null', () => {
    const cardWithoutVerbatim: EquationCard = {
      ...firstCard,
      decoder: { ...firstCard.decoder, verbatim: null },
    };

    render(<EquationCardView card={cardWithoutVerbatim} mode="adapted" setMode={vi.fn()} number={1} />);
    const article = firstArticle();
    expect(buttonNamed(article, 'Adapted')).toBeTruthy();
    expect(buttonNamed(article, 'Manuscript').disabled).toBe(true);
  });
});
