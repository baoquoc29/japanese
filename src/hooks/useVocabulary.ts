import { useState, useEffect, useCallback } from 'react';
import type { Vocabulary } from '../types';
import { vocabularyService } from '../services/vocabularyService';

export function useVocabulary() {
  const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllVocabulary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vocabularyService.getAllVocabulary();
      setVocabList(data);
      setError(null);
    } catch (e) {
      setError('Không thể tải dữ liệu từ vựng.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchVocabulary = useCallback(async (query: string, options?: { level?: string; partOfSpeech?: string }) => {
    setLoading(true);
    try {
      const filtered = await vocabularyService.searchVocabulary(query, options);
      setVocabList(filtered);
      setError(null);
    } catch (e) {
      setError('Có lỗi xảy ra khi tìm kiếm từ vựng.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllVocabulary();
  }, [loadAllVocabulary]);

  return {
    vocabList,
    loading,
    error,
    refresh: loadAllVocabulary,
    search: searchVocabulary,
  };
}
export default useVocabulary;
