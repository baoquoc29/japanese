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
      if (!Array.isArray(data)) {
        return [];
      }
      
      // Parse with fallback safety
      cachedKanji = data.map((item: any) => {
        const meanings_vi = Array.isArray(item.meanings_vi) 
          ? item.meanings_vi 
          : (Array.isArray(item.meanings_en) ? item.meanings_en : ['Chưa có nghĩa']);
          
        return {
          character: item.character || '',
          meanings_vi: meanings_vi,
          meanings_en: Array.isArray(item.meanings_en) ? item.meanings_en : [],
          on_readings: Array.isArray(item.on_readings) ? item.on_readings : [],
          kun_readings: Array.isArray(item.kun_readings) ? item.kun_readings : [],
          stroke_count: typeof item.stroke_count === 'number' ? item.stroke_count : 0,
          jlpt: item.jlpt || 'Unknown',
          unicode: item.unicode || '',
          examples: Array.isArray(item.examples) ? item.examples : [],
          grade: typeof item.grade === 'number' ? item.grade : undefined,
          han_viet: item.han_viet || ''
        } as Kanji;
      });
      
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
    if (level === 'ALL') return list;
    return list.filter(k => k.jlpt === level);
  },

  async searchKanji(query: string, level?: string): Promise<Kanji[]> {
    let list = await this.getAllKanji();
    if (level && level !== 'ALL') {
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
      k.kun_readings.some(kun => kun.toLowerCase().includes(cleanQuery)) ||
      ((k as any).han_viet && (k as any).han_viet.toLowerCase().includes(cleanQuery))
    );
  }
};

export default kanjiService;
