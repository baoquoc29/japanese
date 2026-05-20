import { useState, useEffect, useCallback } from 'react';
import type { GrammarPoint } from '../types';
import { grammarService } from '../services/grammarService';

export function useGrammar() {
  const [grammarList, setGrammarList] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllGrammar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await grammarService.getAllGrammar();
      setGrammarList(data);
      setError(null);
    } catch (e) {
      setError('Không thể tải dữ liệu ngữ pháp.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGrammar = useCallback(async (query: string, level?: string) => {
    setLoading(true);
    try {
      const filtered = await grammarService.searchGrammar(query, level);
      setGrammarList(filtered);
      setError(null);
    } catch (e) {
      setError('Có lỗi xảy ra khi tìm kiếm ngữ pháp.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllGrammar();
  }, [loadAllGrammar]);

  return {
    grammarList,
    loading,
    error,
    refresh: loadAllGrammar,
    search: searchGrammar,
  };
}
export default useGrammar;
