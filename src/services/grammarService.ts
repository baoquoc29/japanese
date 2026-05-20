import type { GrammarPoint } from '../types';

let cachedGrammar: GrammarPoint[] | null = null;

export const grammarService = {
  async getAllGrammar(): Promise<GrammarPoint[]> {
    if (cachedGrammar) {
      return cachedGrammar;
    }
    try {
      const response = await fetch('/data/grammar.json');
      if (!response.ok) {
        throw new Error(`Failed to load grammar data: ${response.statusText}`);
      }
      const data = await response.json();
      cachedGrammar = data as GrammarPoint[];
      return cachedGrammar;
    } catch (error) {
      console.error('Error fetching grammar:', error);
      return [];
    }
  },

  async getGrammarById(id: string): Promise<GrammarPoint | null> {
    const list = await this.getAllGrammar();
    return list.find(g => g.id === id) || null;
  },

  async searchGrammar(query: string, level?: string): Promise<GrammarPoint[]> {
    let list = await this.getAllGrammar();
    
    if (level) {
      list = list.filter(g => g.jlpt === level);
    }
    
    if (!query.trim()) {
      return list;
    }
    
    const cleanQuery = query.toLowerCase().trim();
    return list.filter(g => 
      g.pattern.includes(cleanQuery) ||
      g.meaning_vi.toLowerCase().includes(cleanQuery) ||
      (g.meaning_en && g.meaning_en.toLowerCase().includes(cleanQuery)) ||
      g.structure.toLowerCase().includes(cleanQuery)
    );
  }
};
export default grammarService;
