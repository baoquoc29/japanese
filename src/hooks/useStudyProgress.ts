import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { StudyProgress, QuizHistoryEntry } from '../types';
import { progressService } from '../services/progressService';

const STORAGE_KEY = 'nihongo_study_progress';

const INITIAL_PROGRESS: StudyProgress = {
  learnedKanji: [],
  learnedVocab: [],
  learnedGrammar: [],
  favoriteKanji: [],
  favoriteVocab: [],
  favoriteGrammar: [],
  wrongQuizQuestions: [],
  quizHistory: [],
  streak: 0,
  lastStudyDate: null,
};

export function useStudyProgress() {
  const [progress, setProgress] = useLocalStorage<StudyProgress>(STORAGE_KEY, INITIAL_PROGRESS);

  const toggleFavoriteKanji = useCallback((character: string) => {
    setProgress(prev => {
      const isFav = prev.favoriteKanji.includes(character);
      const favoriteKanji = isFav
        ? prev.favoriteKanji.filter(c => c !== character)
        : [...prev.favoriteKanji, character];
      
      const updated = { ...prev, favoriteKanji };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const markKanjiAsLearned = useCallback((character: string, isLearned: boolean) => {
    setProgress(prev => {
      const isCurrentlyLearned = prev.learnedKanji.includes(character);
      if (isCurrentlyLearned === isLearned) return prev;

      const learnedKanji = isLearned
        ? [...prev.learnedKanji, character]
        : prev.learnedKanji.filter(c => c !== character);

      const updated = { ...prev, learnedKanji };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const toggleFavoriteVocab = useCallback((id: string) => {
    setProgress(prev => {
      const isFav = prev.favoriteVocab.includes(id);
      const favoriteVocab = isFav
        ? prev.favoriteVocab.filter(vId => vId !== id)
        : [...prev.favoriteVocab, id];
      
      const updated = { ...prev, favoriteVocab };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const markVocabAsLearned = useCallback((id: string, isLearned: boolean) => {
    setProgress(prev => {
      const isCurrentlyLearned = prev.learnedVocab.includes(id);
      if (isCurrentlyLearned === isLearned) return prev;

      const learnedVocab = isLearned
        ? [...prev.learnedVocab, id]
        : prev.learnedVocab.filter(vId => vId !== id);

      const updated = { ...prev, learnedVocab };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const toggleFavoriteGrammar = useCallback((id: string) => {
    setProgress(prev => {
      const isFav = prev.favoriteGrammar.includes(id);
      const favoriteGrammar = isFav
        ? prev.favoriteGrammar.filter(gId => gId !== id)
        : [...prev.favoriteGrammar, id];
      
      const updated = { ...prev, favoriteGrammar };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const markGrammarAsLearned = useCallback((id: string, isLearned: boolean) => {
    setProgress(prev => {
      const isCurrentlyLearned = prev.learnedGrammar.includes(id);
      if (isCurrentlyLearned === isLearned) return prev;

      const learnedGrammar = isLearned
        ? [...prev.learnedGrammar, id]
        : prev.learnedGrammar.filter(gId => gId !== id);

      const updated = { ...prev, learnedGrammar };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const addQuizResult = useCallback((score: number, total: number, category: string) => {
    setProgress(prev => {
      const newEntry: QuizHistoryEntry = {
        date: new Date().toLocaleDateString('vi-VN'),
        score,
        total,
        category,
      };
      const updated = {
        ...prev,
        quizHistory: [newEntry, ...prev.quizHistory].slice(0, 50), // Keep last 50 attempts
      };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const addWrongQuizQuestion = useCallback((questionText: string) => {
    setProgress(prev => {
      if (prev.wrongQuizQuestions.includes(questionText)) return prev;
      const updated = {
        ...prev,
        wrongQuizQuestions: [...prev.wrongQuizQuestions, questionText],
      };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const removeWrongQuizQuestion = useCallback((questionText: string) => {
    setProgress(prev => {
      if (!prev.wrongQuizQuestions.includes(questionText)) return prev;
      const updated = {
        ...prev,
        wrongQuizQuestions: prev.wrongQuizQuestions.filter(q => q !== questionText),
      };
      return progressService.markActivity(updated);
    });
  }, [setProgress]);

  const resetAllProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
  }, [setProgress]);

  return {
    progress,
    toggleFavoriteKanji,
    markKanjiAsLearned,
    toggleFavoriteVocab,
    markVocabAsLearned,
    toggleFavoriteGrammar,
    markGrammarAsLearned,
    addQuizResult,
    addWrongQuizQuestion,
    removeWrongQuizQuestion,
    resetAllProgress,
  };
}
export default useStudyProgress;
