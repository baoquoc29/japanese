export interface WritingRecord {
  guidedCount: number;
  freeCount: number;
  lastPracticedAt: string;
  completed: boolean;
}

export interface WritingProgress {
  [character: string]: WritingRecord;
}

const STORAGE_KEY = 'nihongo-writing-progress';

export const writingProgressService = {
  getProgress(): WritingProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getRecord(character: string): WritingRecord {
    const progress = this.getProgress();
    return progress[character] || {
      guidedCount: 0,
      freeCount: 0,
      lastPracticedAt: '',
      completed: false,
    };
  },

  markPractice(character: string, mode: 'guided' | 'free'): void {
    const progress = this.getProgress();
    const record = progress[character] || {
      guidedCount: 0,
      freeCount: 0,
      lastPracticedAt: '',
      completed: false,
    };

    if (mode === 'guided') {
      record.guidedCount += 1;
    } else {
      record.freeCount += 1;
    }
    record.lastPracticedAt = new Date().toISOString();
    record.completed = true;

    progress[character] = record;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  getTotalPracticeCount(): number {
    const progress = this.getProgress();
    return Object.values(progress).reduce(
      (sum, r) => sum + r.guidedCount + r.freeCount,
      0
    );
  },
};

export default writingProgressService;
