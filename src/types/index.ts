export interface Kanji {
  character: string;
  meanings_vi: string[];
  meanings_en: string[];
  on_readings: string[];
  kun_readings: string[];
  stroke_count: number;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  grade?: number;
  unicode: string;
  examples: string[];
}

export interface ExampleSentence {
  ja: string;
  reading: string;
  vi: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meanings_vi: string[];
  meanings_en: string[];
  partOfSpeech: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: ExampleSentence[];
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  meaning_vi: string;
  meaning_en?: string;
  structure: string;
  examples: ExampleSentence[];
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'kanji_to_meaning' | 'kanji_to_reading' | 'meaning_to_kanji' | 'vocab_to_meaning' | 'vocab_to_reading' | 'grammar_fill_in';
  question: string;
  options: string[];
  answer: string;
  hint?: string;
  difficulty: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: 'kanji' | 'vocabulary' | 'grammar';
}

export interface QuizHistoryEntry {
  date: string;
  score: number;
  total: number;
  category: string;
}

export interface StudyProgress {
  learnedKanji: string[];      // Array of characters
  learnedVocab: string[];      // Array of vocab IDs
  learnedGrammar: string[];    // Array of grammar IDs
  favoriteKanji: string[];
  favoriteVocab: string[];
  favoriteGrammar: string[];
  wrongQuizQuestions: string[]; // List of question IDs or text that were answered incorrectly
  quizHistory: QuizHistoryEntry[];
  streak: number;
  lastStudyDate: string | null;
}
