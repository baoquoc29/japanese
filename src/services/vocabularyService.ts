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
      if (!Array.isArray(data)) {
        return [];
      }

      cachedVocab = data.map((item: any) => {
        const meanings_vi = Array.isArray(item.meanings_vi) 
          ? item.meanings_vi 
          : (Array.isArray(item.meanings_en) ? item.meanings_en : ['Chưa có nghĩa']);

        const examples = Array.isArray(item.examples) 
          ? item.examples.map((ex: any) => ({
              ja: ex.ja || '',
              reading: ex.reading || '',
              vi: ex.vi || ''
            }))
          : [];

        return {
          id: item.id || '',
          word: item.word || '',
          reading: item.reading || '',
          romaji: item.romaji || '',
          meanings_vi: meanings_vi,
          meanings_en: Array.isArray(item.meanings_en) ? item.meanings_en : [],
          partOfSpeech: item.partOfSpeech || '',
          jlpt: item.jlpt || 'Unknown',
          examples: examples
        } as Vocabulary;
      });

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

  async getVocabularyByLevel(level: string): Promise<Vocabulary[]> {
    const list = await this.getAllVocabulary();
    if (level === 'ALL') return list;
    return list.filter(v => v.jlpt === level);
  },

  async searchVocabulary(query: string, options?: { level?: string; partOfSpeech?: string }): Promise<Vocabulary[]> {
    let list = await this.getAllVocabulary();
    
    if (options?.level && options.level !== 'ALL') {
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
