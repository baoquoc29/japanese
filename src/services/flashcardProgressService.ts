export type FlashcardType = 'kanji' | 'vocabulary' | 'grammar';

export interface FlashcardProgressRecord {
  sourceId: string;
  type: FlashcardType;
  rememberedCount: number;
  forgottenCount: number;
  lastReviewedAt: string;
  status: 'new' | 'learning' | 'remembered' | 'forgotten';
}

const STORAGE_KEY = 'nihongo-flashcard-progress';

function getAll(): Record<string, FlashcardProgressRecord> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveAll(records: Record<string, FlashcardProgressRecord>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const flashcardProgressService = {
  getRecord(sourceId: string, type: FlashcardType): FlashcardProgressRecord {
    const all = getAll();
    const key = `${type}:${sourceId}`;
    return all[key] || {
      sourceId,
      type,
      rememberedCount: 0,
      forgottenCount: 0,
      lastReviewedAt: '',
      status: 'new' as const,
    };
  },

  markRemembered(sourceId: string, type: FlashcardType): void {
    const all = getAll();
    const key = `${type}:${sourceId}`;
    const record = all[key] || {
      sourceId,
      type,
      rememberedCount: 0,
      forgottenCount: 0,
      lastReviewedAt: '',
      status: 'new' as const,
    };
    record.rememberedCount += 1;
    record.lastReviewedAt = new Date().toISOString();
    record.status = 'remembered';
    all[key] = record;
    saveAll(all);
  },

  markForgotten(sourceId: string, type: FlashcardType): void {
    const all = getAll();
    const key = `${type}:${sourceId}`;
    const record = all[key] || {
      sourceId,
      type,
      rememberedCount: 0,
      forgottenCount: 0,
      lastReviewedAt: '',
      status: 'new' as const,
    };
    record.forgottenCount += 1;
    record.lastReviewedAt = new Date().toISOString();
    record.status = 'forgotten';
    all[key] = record;
    saveAll(all);
  },

  getForgottenIds(type: FlashcardType): string[] {
    const all = getAll();
    return Object.values(all)
      .filter(r => r.type === type && r.status === 'forgotten')
      .map(r => r.sourceId);
  },

  getStats(): { total: number; remembered: number; forgotten: number } {
    const all = getAll();
    const values = Object.values(all);
    return {
      total: values.length,
      remembered: values.filter(r => r.status === 'remembered').length,
      forgotten: values.filter(r => r.status === 'forgotten').length,
    };
  },
};

export default flashcardProgressService;
