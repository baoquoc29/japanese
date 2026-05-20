import type { Kanji, Vocabulary, GrammarPoint } from '../../types';

export type FlashcardType = 'kanji' | 'vocabulary' | 'grammar';

export interface FlashcardItem {
  id: string;
  type: FlashcardType;
  front: string;
  back: {
    meaning: string;
    reading?: string;
    onReadings?: string[];
    kunReadings?: string[];
    structure?: string;
    example?: string;
    exampleVi?: string;
  };
  jlpt?: string;
  sourceId: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function kanjiToFlashcards(kanjiList: Kanji[]): FlashcardItem[] {
  return kanjiList.map(k => ({
    id: `kanji-${k.character}`,
    type: 'kanji' as const,
    front: k.character,
    back: {
      meaning: k.meanings_vi?.join(', ') || k.meanings_en?.join(', ') || 'Chưa có nghĩa',
      onReadings: k.on_readings || [],
      kunReadings: k.kun_readings || [],
    },
    jlpt: k.jlpt,
    sourceId: k.character,
  }));
}

export function vocabToFlashcards(vocabList: Vocabulary[]): FlashcardItem[] {
  return vocabList.map(v => ({
    id: `vocab-${v.id}`,
    type: 'vocabulary' as const,
    front: v.word,
    back: {
      meaning: v.meanings_vi?.join(', ') || v.meanings_en?.join(', ') || 'Chưa có nghĩa',
      reading: v.reading || '',
      example: v.examples?.[0]?.ja || '',
      exampleVi: v.examples?.[0]?.vi || '',
    },
    jlpt: v.jlpt,
    sourceId: v.id,
  }));
}

export function grammarToFlashcards(grammarList: GrammarPoint[]): FlashcardItem[] {
  return grammarList.map(g => ({
    id: `grammar-${g.id}`,
    type: 'grammar' as const,
    front: g.pattern,
    back: {
      meaning: g.meaning_vi || g.meaning_en || 'Chưa có nghĩa',
      structure: g.structure || '',
      example: g.examples?.[0]?.ja || '',
      exampleVi: g.examples?.[0]?.vi || '',
    },
    jlpt: g.jlpt,
    sourceId: g.id,
  }));
}

export function buildFlashcardDeck(
  kanjiList: Kanji[],
  vocabList: Vocabulary[],
  grammarList: GrammarPoint[],
  options: {
    types: FlashcardType[];
    jlpt: string;
    mode: 'all' | 'favorites' | 'not_remembered' | 'wrong';
    favoriteKanji?: string[];
    favoriteVocab?: string[];
    favoriteGrammar?: string[];
    forgottenIds?: string[];
    wrongIds?: string[];
  }
): FlashcardItem[] {
  let cards: FlashcardItem[] = [];

  if (options.types.includes('kanji')) {
    cards = cards.concat(kanjiToFlashcards(kanjiList));
  }
  if (options.types.includes('vocabulary')) {
    cards = cards.concat(vocabToFlashcards(vocabList));
  }
  if (options.types.includes('grammar')) {
    cards = cards.concat(grammarToFlashcards(grammarList));
  }

  // Filter by JLPT
  if (options.jlpt !== 'all') {
    cards = cards.filter(c => c.jlpt === options.jlpt);
  }

  // Filter by mode
  if (options.mode === 'favorites') {
    cards = cards.filter(c => {
      if (c.type === 'kanji') return options.favoriteKanji?.includes(c.sourceId);
      if (c.type === 'vocabulary') return options.favoriteVocab?.includes(c.sourceId);
      if (c.type === 'grammar') return options.favoriteGrammar?.includes(c.sourceId);
      return true;
    });
  } else if (options.mode === 'not_remembered') {
    const forgotten = new Set(options.forgottenIds || []);
    cards = cards.filter(c => forgotten.has(c.sourceId) || forgotten.has(c.id));
  } else if (options.mode === 'wrong') {
    const wrong = new Set(options.wrongIds || []);
    cards = cards.filter(c => wrong.has(c.sourceId));
  }

  return shuffle(cards);
}
