import type { Kanji, Vocabulary, GrammarPoint, ExampleSentence } from '../types';

/**
 * Remove Vietnamese accents and convert to lowercase, trimmed string.
 */
export function normalizeText(input: string | null | undefined): string {
  if (input === null || input === undefined) return '';
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

/**
 * Checks if a Kanji matches a query string.
 */
export function matchesKanjiSearch(kanji: Kanji, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  // 1. Match Hán tự / character
  if (kanji.character.toLowerCase().includes(normalizedQuery)) return true;

  // 2. Match Hán Việt
  if ((kanji as any).han_viet && normalizeText((kanji as any).han_viet).includes(normalizedQuery)) return true;

  // 3. Match meanings (Vietnamese)
  if (
    kanji.meanings_vi &&
    kanji.meanings_vi.some((m) => normalizeText(m).includes(normalizedQuery))
  )
    return true;

  // 4. Match meanings (English)
  if (
    kanji.meanings_en &&
    kanji.meanings_en.some((m) => normalizeText(m).includes(normalizedQuery))
  )
    return true;

  // 5. Match On readings
  if (
    kanji.on_readings &&
    kanji.on_readings.some((r) => normalizeText(r).includes(normalizedQuery))
  )
    return true;

  // 6. Match Kun readings
  if (
    kanji.kun_readings &&
    kanji.kun_readings.some((r) => normalizeText(r).includes(normalizedQuery))
  )
    return true;

  // 7. Match stroke count (e.g. "4", "4 net", "4 net ve")
  const strokeMatch = normalizedQuery.match(/^(\d+)(?:\s*(?:net|nét|net ve|nét vẽ))?$/);
  if (strokeMatch) {
    const num = parseInt(strokeMatch[1], 10);
    if (kanji.stroke_count === num) return true;
  }

  return false;
}

/**
 * Checks if a Vocabulary item matches a query string.
 */
export function matchesVocabularySearch(vocab: Vocabulary, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  // 1. Match word (Kanji)
  if (vocab.word.toLowerCase().includes(normalizedQuery)) return true;

  // 2. Match reading (Kana)
  if (vocab.reading.toLowerCase().includes(normalizedQuery)) return true;

  // 3. Match romaji
  if (vocab.romaji && vocab.romaji.toLowerCase().includes(normalizedQuery)) return true;

  // 4. Match meanings (Vietnamese)
  if (
    vocab.meanings_vi &&
    vocab.meanings_vi.some((m) => normalizeText(m).includes(normalizedQuery))
  )
    return true;

  // 5. Match meanings (English)
  if (
    vocab.meanings_en &&
    vocab.meanings_en.some((m) => normalizeText(m).includes(normalizedQuery))
  )
    return true;

  // 6. Match part of speech
  if (
    vocab.partOfSpeech &&
    normalizeText(vocab.partOfSpeech).includes(normalizedQuery)
  )
    return true;

  return false;
}

/**
 * Checks if a Grammar item matches a query string.
 */
export function matchesGrammarSearch(grammar: GrammarPoint, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  // 1. Match pattern (e.g. 〜ことがある)
  if (grammar.pattern.toLowerCase().includes(normalizedQuery)) return true;

  // 2. Match meaning (Vietnamese)
  if (grammar.meaning_vi && normalizeText(grammar.meaning_vi).includes(normalizedQuery)) return true;

  // 3. Match meaning (English)
  if (grammar.meaning_en && normalizeText(grammar.meaning_en).includes(normalizedQuery)) return true;

  // 4. Match structure
  if (grammar.structure && normalizeText(grammar.structure).includes(normalizedQuery)) return true;

  // 5. Match examples
  if (
    grammar.examples &&
    grammar.examples.some(
      (ex: ExampleSentence) =>
        ex.ja.toLowerCase().includes(normalizedQuery) ||
        (ex.reading && ex.reading.toLowerCase().includes(normalizedQuery)) ||
        (ex.vi && normalizeText(ex.vi).includes(normalizedQuery))
    )
  )
    return true;

  return false;
}

/**
 * Simple filter helper by JLPT level.
 */
export function filterByJlpt<T extends { jlpt: string }>(
  items: T[],
  selectedLevel: string
): T[] {
  if (!selectedLevel || selectedLevel === 'ALL') return items;
  return items.filter((item) => item.jlpt === selectedLevel);
}

/**
 * Basic search sorting helper (exact start matches first).
 */
export function sortSearchResults<T>(
  items: T[],
  query: string,
  getStringField: (item: T) => string
): T[] {
  if (!query) return items;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return items;

  return [...items].sort((a, b) => {
    const valA = normalizeText(getStringField(a));
    const valB = normalizeText(getStringField(b));
    const startA = valA.startsWith(normalizedQuery);
    const startB = valB.startsWith(normalizedQuery);
    if (startA && !startB) return -1;
    if (!startA && startB) return 1;
    return valA.localeCompare(valB);
  });
}
