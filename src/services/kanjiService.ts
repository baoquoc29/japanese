import type { Kanji } from '../types';

let cachedKanji: Kanji[] | null = null;

export const kanjiService = {
  async getAllKanji(): Promise<Kanji[]> {
    if (cachedKanji) {
      return cachedKanji;
    }
    try {
      const response = await fetch('/data/kanji.json');
      if (!response.ok) {
        throw new Error(`Failed to load kanji data: ${response.statusText}`);
      }
      const data = await response.json();
      cachedKanji = data as Kanji[];
      return cachedKanji;
    } catch (error) {
      console.error('Error fetching kanji:', error);
      return [];
    }
  },

  async getKanjiByCharacter(character: string): Promise<Kanji | null> {
    const list = await this.getAllKanji();
    return list.find(k => k.character === character) || null;
  },

  async getKanjiByLevel(level: string): Promise<Kanji[]> {
    const list = await this.getAllKanji();
    return list.filter(k => k.jlpt === level);
  },

  async searchKanji(query: string, level?: string): Promise<Kanji[]> {
    let list = await this.getAllKanji();
    if (level) {
      list = list.filter(k => k.jlpt === level);
    }
    if (!query.trim()) {
      return list;
    }
    const cleanQuery = query.toLowerCase().trim();
    return list.filter(k => 
      k.character.includes(cleanQuery) ||
      k.meanings_vi.some(m => m.toLowerCase().includes(cleanQuery)) ||
      k.meanings_en.some(m => m.toLowerCase().includes(cleanQuery)) ||
      k.on_readings.some(on => on.toLowerCase().includes(cleanQuery)) ||
      k.kun_readings.some(kun => kun.toLowerCase().includes(cleanQuery))
    );
  }
};
export default kanjiService;
