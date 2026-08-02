// Whole-span phrasings, used when an equation reads better as a written-out sentence
// than as the sum of its tokens.
const SPOKEN_PHRASES: Readonly<Record<string, string>> = {
  'W + W^{*} = 2\\psi_m': 'W plus W conjugate equals two psi m',
  'W^{*}': 'W conjugate',
};

// Token substitutions applied inside any span with no whole-span phrasing.
// Longest keys are applied first so \psi_m wins over \psi.
const SPOKEN_TOKENS: Readonly<Record<string, string>> = {
  '\\psi_m': 'psi m',
  '\\psi_s': 'psi s',
  '\\rho_k': 'rho k',
  '\\vec{E}': 'the material field',
  '\\vec{B}': 'the cultural field',
  '\\approx': 'is approximately',
  '\\theta': 'theta',
  '\\psi': 'psi',
  '\\rho': 'rho',
  '\\circ': 'degrees',
  '\\times': 'cross',
  '\\cdot': 'times',
  '\\to': 'approaching',
  '\\sum': 'the sum of',
  '\\ldots': 'and so on',
  '^{*}': ' conjugate',
  '+': ' plus ',
  '=': ' equals ',
};

function speakSpan(latex: string): string {
  const trimmed = latex.trim();
  const phrase = SPOKEN_PHRASES[trimmed];
  if (phrase) return phrase;

  let spoken = trimmed;
  for (const token of Object.keys(SPOKEN_TOKENS).sort((a, b) => b.length - a.length)) {
    spoken = spoken.split(token).join(` ${SPOKEN_TOKENS[token]} `);
  }

  // Strip the LaTeX syntax that carries no sound: braces, sub/superscript markers,
  // and any command that had no mapping.
  spoken = spoken
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}^_$\\]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Dropping the span entirely would leave an ungrammatical sentence — "With the wage
  // is symbolic." Say something neutral instead.
  return spoken || 'an equation';
}

export function latexToSpeech(text: string): string {
  return text
    .replace(/\$([^$]+)\$/g, (_match, latex: string) => speakSpan(latex))
    .replace(/\s+([,.;!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function splitIntoSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  return normalized.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean)
    ?? [normalized];
}
