import { useState, useEffect, useCallback } from 'react';
import type { Kanji } from '../types';
import { kanjiService } from '../services/kanjiService';

export function useKanji() {
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllKanji = useCallback(async () => {
    setLoading(true);
    try {
      const data = await kanjiService.getAllKanji();
      setKanjiList(data);
      setError(null);
    } catch (e) {
      setError('Không thể tải dữ liệu Kanji.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchKanji = useCallback(async (query: string, level?: string) => {
    setLoading(true);
    try {
      const filtered = await kanjiService.searchKanji(query, level);
      setKanjiList(filtered);
      setError(null);
    } catch (e) {
      setError('Có lỗi xảy ra khi tìm kiếm.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllKanji();
  }, [loadAllKanji]);

  return {
    kanjiList,
    loading,
    error,
    refresh: loadAllKanji,
    search: searchKanji,
  };
}
export default useKanji;
