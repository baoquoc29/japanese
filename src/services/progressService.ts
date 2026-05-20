import type { StudyProgress } from '../types';

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

export const progressService = {
  getProgress(): StudyProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROGRESS));
        return INITIAL_PROGRESS;
      }
      const parsed = JSON.parse(data) as StudyProgress;
      // Make sure all required fields exist
      return {
        ...INITIAL_PROGRESS,
        ...parsed,
      };
    } catch (e) {
      console.error('Failed to read progress from localStorage, resetting...', e);
      return INITIAL_PROGRESS;
    }
  },

  saveProgress(progress: StudyProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  },

  updateStreak(progress: StudyProgress): StudyProgress {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastStudy = progress.lastStudyDate;

    if (!lastStudy) {
      return {
        ...progress,
        streak: 1,
        lastStudyDate: todayStr,
      };
    }

    if (lastStudy === todayStr) {
      // Already studied today, streak stays the same
      return progress;
    }

    const lastStudyDateObj = new Date(lastStudy);
    const todayDateObj = new Date(todayStr);
    
    // Calculate difference in days
    const diffTime = Math.abs(todayDateObj.getTime() - lastStudyDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = progress.streak;
    if (diffDays === 1) {
      // Studied yesterday, increment streak
      newStreak += 1;
    } else if (diffDays > 1) {
      // Missed a day or more, reset streak
      newStreak = 1;
    }

    return {
      ...progress,
      streak: newStreak,
      lastStudyDate: todayStr,
    };
  },

  markActivity(progress: StudyProgress): StudyProgress {
    const updated = this.updateStreak(progress);
    this.saveProgress(updated);
    return updated;
  }
};
export default progressService;
