import type { Kanji } from '../../types';

export type KanjiQuestionType = 'meaning' | 'reading' | 'kanji_by_meaning' | 'stroke_count';

export interface KanjiTestQuestion {
  id: string;
  type: KanjiQuestionType;
  prompt: string;
  kanji?: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function generateMeaningQuestion(kanji: Kanji, allKanji: Kanji[]): KanjiTestQuestion {
  const correctMeaning = kanji.meanings_vi?.[0] || kanji.meanings_en?.[0] || 'Không rõ';
  const distractors = shuffle(
    allKanji
      .filter(k => k.character !== kanji.character)
      .map(k => k.meanings_vi?.[0] || k.meanings_en?.[0] || 'Không rõ')
      .filter(m => m !== correctMeaning)
  ).slice(0, 3);

  const options = shuffle([correctMeaning, ...distractors]);

  return {
    id: `meaning-${kanji.character}-${Date.now()}`,
    type: 'meaning',
    prompt: 'Kanji này có nghĩa là gì?',
    kanji: kanji.character,
    correctAnswer: correctMeaning,
    options,
    explanation: `${kanji.character} = ${kanji.meanings_vi?.join(', ') || kanji.meanings_en?.join(', ')}`,
  };
}

function generateReadingQuestion(kanji: Kanji, allKanji: Kanji[]): KanjiTestQuestion {
  const onReading = kanji.on_readings?.[0] || '';
  const kunReading = kanji.kun_readings?.[0] || '';
  const correctReading = [onReading, kunReading].filter(Boolean).join(' / ') || 'Không rõ';

  const distractors = shuffle(
    allKanji
      .filter(k => k.character !== kanji.character)
      .map(k => {
        const on = k.on_readings?.[0] || '';
        const kun = k.kun_readings?.[0] || '';
        return [on, kun].filter(Boolean).join(' / ') || 'Không rõ';
      })
      .filter(r => r !== correctReading && r !== 'Không rõ')
  ).slice(0, 3);

  const options = shuffle([correctReading, ...distractors]);

  return {
    id: `reading-${kanji.character}-${Date.now()}`,
    type: 'reading',
    prompt: 'Cách đọc On/Kun nào thuộc Kanji này?',
    kanji: kanji.character,
    correctAnswer: correctReading,
    options,
    explanation: `${kanji.character}: ON ${kanji.on_readings?.join(', ') || '—'} / KUN ${kanji.kun_readings?.join(', ') || '—'}`,
  };
}

function generateKanjiByMeaningQuestion(kanji: Kanji, allKanji: Kanji[]): KanjiTestQuestion {
  const meaning = kanji.meanings_vi?.[0] || kanji.meanings_en?.[0] || 'Không rõ';
  const distractors = shuffle(
    allKanji
      .filter(k => k.character !== kanji.character)
      .map(k => k.character)
  ).slice(0, 3);

  const options = shuffle([kanji.character, ...distractors]);

  return {
    id: `kanji_by_meaning-${kanji.character}-${Date.now()}`,
    type: 'kanji_by_meaning',
    prompt: `Kanji nào có nghĩa là "${meaning}"?`,
    correctAnswer: kanji.character,
    options,
    explanation: `${kanji.character} = ${meaning}`,
  };
}

function generateStrokeCountQuestion(kanji: Kanji, allKanji: Kanji[]): KanjiTestQuestion {
  const correct = String(kanji.stroke_count);
  const allCounts = [...new Set(allKanji.map(k => k.stroke_count))].filter(c => c !== kanji.stroke_count);
  const distractorCounts = shuffle(allCounts).slice(0, 3).map(String);
  const options = shuffle([correct, ...distractorCounts]);

  return {
    id: `stroke_count-${kanji.character}-${Date.now()}`,
    type: 'stroke_count',
    prompt: 'Kanji này có bao nhiêu nét?',
    kanji: kanji.character,
    correctAnswer: correct,
    options,
    explanation: `${kanji.character} có ${kanji.stroke_count} nét.`,
  };
}

const generators: Record<KanjiQuestionType, (k: Kanji, all: Kanji[]) => KanjiTestQuestion> = {
  meaning: generateMeaningQuestion,
  reading: generateReadingQuestion,
  kanji_by_meaning: generateKanjiByMeaningQuestion,
  stroke_count: generateStrokeCountQuestion,
};

export function generateKanjiTest(
  allKanji: Kanji[],
  options: {
    jlpt: string;
    questionCount: number;
    questionTypes: KanjiQuestionType[] | 'mixed';
  }
): KanjiTestQuestion[] {
  let pool = allKanji;
  if (options.jlpt !== 'all') {
    pool = allKanji.filter(k => k.jlpt === options.jlpt);
  }

  if (pool.length < 4) return [];

  const count = Math.min(options.questionCount, pool.length);
  const selectedKanji = pickRandom(pool, count);

  const types: KanjiQuestionType[] =
    options.questionTypes === 'mixed'
      ? ['meaning', 'reading', 'kanji_by_meaning', 'stroke_count']
      : options.questionTypes;

  return selectedKanji.map((kanji, idx) => {
    const type = types[idx % types.length];
    return generators[type](kanji, pool);
  });
}
