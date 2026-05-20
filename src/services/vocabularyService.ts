import type { Vocabulary } from '../types';

let cachedVocab: Vocabulary[] | null = null;

export const vocabularyService = {
  async getAllVocabulary(): Promise<Vocabulary[]> {
    if (cachedVocab) {
      return cachedVocab;
    }
    try {
      const response = await fetch('/data/vocabulary.json');
      if (!response.ok) {
        throw new Error(`Failed to load vocabulary data: ${response.statusText}`);
      }
      const data = await response.json();
      cachedVocab = data as Vocabulary[];
      return cachedVocab;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }
  },

  async getVocabularyById(id: string): Promise<Vocabulary | null> {
    const list = await this.getAllVocabulary();
    return list.find(v => v.id === id) || null;
  },

  async searchVocabulary(query: string, options?: { level?: string; partOfSpeech?: string }): Promise<Vocabulary[]> {
    let list = await this.getAllVocabulary();
    
    if (options?.level) {
      list = list.filter(v => v.jlpt === options.level);
    }
    
    if (options?.partOfSpeech) {
      list = list.filter(v => v.partOfSpeech === options.partOfSpeech);
    }
    
    if (!query.trim()) {
      return list;
    }
    
    const cleanQuery = query.toLowerCase().trim();
    return list.filter(v => 
      v.word.includes(cleanQuery) ||
      v.reading.includes(cleanQuery) ||
      v.romaji.toLowerCase().includes(cleanQuery) ||
      v.meanings_vi.some(m => m.toLowerCase().includes(cleanQuery)) ||
      v.meanings_en.some(m => m.toLowerCase().includes(cleanQuery))
    );
  }
};
export default vocabularyService;
