export interface KanjiTestHistoryEntry {
  id: string;
  jlpt: string;
  totalQuestions: number;
  correctCount: number;
  wrongQuestionIds: string[];
  createdAt: string;
  questionTypes: string;
}

const STORAGE_KEY = 'nihongo-kanji-test-history';

export const kanjiTestHistoryService = {
  getHistory(): KanjiTestHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveResult(entry: KanjiTestHistoryEntry): void {
    const history = this.getHistory();
    history.unshift(entry);
    // Keep last 50 entries
    if (history.length > 50) history.length = 50;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  },

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default kanjiTestHistoryService;
