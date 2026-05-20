import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useKanji } from '../../../hooks/useKanji';
import { HanziWriterPractice } from '../components/HanziWriterPractice';
import { WritingModeTabs } from '../components/WritingModeTabs';
import { Loader2 } from 'lucide-react';
import type { Kanji } from '../../../types';
import { JlptLevelTabs } from '../../../components/common/JlptLevelTabs';
import { EmptyState } from '../../../components/common/EmptyState';
import type { JlptFilterLevel } from '../../../constants/jlpt';

export const WritingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { kanjiList, loading, error } = useKanji();
  
  const [selectedLevel, setSelectedLevel] = useState<JlptFilterLevel>('N5');
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [quickSearch, setQuickSearch] = useState('');
  const [writingMode, setWritingMode] = useState<'guided' | 'free'>('guided');

  // Sync Level Counts
  const counts = kanjiList.reduce((acc, k) => {
    const lvl = k.jlpt || 'N5';
    acc[lvl] = (acc[lvl] || 0) + 1;
    acc['ALL'] = (acc['ALL'] || 0) + 1;
    return acc;
  }, { ALL: 0, N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 } as Record<string, number>);

  // Level filtered list
  const levelFilteredKanji = kanjiList.filter(k => 
    selectedLevel === 'ALL' || k.jlpt === selectedLevel
  );

  // Search filter applied to level list
  const filteredQuickList = levelFilteredKanji.filter(k => 
    k.character.includes(quickSearch) ||
    k.meanings_vi.some(m => m.toLowerCase().includes(quickSearch.toLowerCase()))
  );

  // Auto-select first kanji of level or sync URL char
  useEffect(() => {
    if (kanjiList.length === 0) return;
    
    const urlChar = searchParams.get('char');
    if (urlChar) {
      const found = kanjiList.find(k => k.character === urlChar);
      if (found) {
        setSelectedKanji(found);
        // Sync level tab with selected Kanji level
        if (found.jlpt && selectedLevel !== 'ALL' && found.jlpt !== selectedLevel) {
          setSelectedLevel(found.jlpt as JlptFilterLevel);
        }
        return;
      } else {
        // Construct temporary object for arbitrary chars
        setSelectedKanji({
          character: urlChar,
          meanings_vi: ['Chữ ngoài N5-N1'],
          meanings_en: [],
          on_readings: [],
          kun_readings: [],
          stroke_count: 0,
          jlpt: 'N1',
          unicode: urlChar.charCodeAt(0).toString(16).toUpperCase(),
          examples: []
        });
        return;
      }
    }
    
    // If no URL char or URL char not in active level, pick the first in active level
    if (levelFilteredKanji.length > 0) {
      const isAlreadyInList = levelFilteredKanji.some(k => k.character === selectedKanji?.character);
      if (!isAlreadyInList) {
        setSelectedKanji(levelFilteredKanji[0]);
      }
    } else {
      setSelectedKanji(null);
    }
  }, [kanjiList, selectedLevel]);

  const handleSelectKanji = (kanji: Kanji) => {
    setSelectedKanji(kanji);
    setSearchParams({ char: kanji.character });
  };

  const handleNextKanji = () => {
    if (levelFilteredKanji.length === 0 || !selectedKanji) return;
    const currentIndex = levelFilteredKanji.findIndex(k => k.character === selectedKanji.character);
    const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % levelFilteredKanji.length : 0;
    handleSelectKanji(levelFilteredKanji[nextIndex]);
  };

  const handleLevelChange = (level: JlptFilterLevel) => {
    setSelectedLevel(level);
    setQuickSearch('');
    // Remove search param char when switching levels so it auto-selects first in new level
    setSearchParams({});
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5 select-none">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
            Tập viết Kanji
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Luyện thứ tự nét và ghi nhớ mặt chữ Nhật bằng canvas vẽ tay trực quan.
          </p>
        </div>
        <WritingModeTabs mode={writingMode} onModeChange={setWritingMode} />
      </div>

      {/* JLPT Levels Filter */}
      {!loading && !error && kanjiList.length > 0 && (
        <JlptLevelTabs 
          selectedLevel={selectedLevel} 
          onChange={handleLevelChange} 
          counts={counts}
        />
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-600 animate-spin" />
          <span className="text-xs text-neutral-450 dark:text-neutral-500 font-medium">Đang khởi động lớp viết Kanji...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-600 text-xs font-bold">{error}</div>
      ) : kanjiList.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 text-xs font-bold">Không có dữ liệu Kanji để tập viết.</div>
      ) : levelFilteredKanji.length === 0 ? (
        <EmptyState 
          title={`Chưa có dữ liệu Kanji JLPT ${selectedLevel}`} 
          description="Chúng tôi đang cập nhật dữ liệu phong phú cho cấp độ này. Vui lòng quay lại sau!" 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left panel: Quick Select list */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col h-[500px] lg:h-[600px]">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-3 select-none">
              Danh sách chữ Kanji ({levelFilteredKanji.length})
            </span>
            
            {/* mini search box */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Tìm nhanh..."
                value={quickSearch}
                onChange={e => setQuickSearch(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-250 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-neutral-800 dark:text-neutral-250 font-medium"
              />
            </div>

            {/* list */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-1 custom-scroll">
              {filteredQuickList.map(k => (
                <button
                  key={k.character}
                  onClick={() => handleSelectKanji(k)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    selectedKanji?.character === k.character
                      ? 'bg-neutral-50 dark:bg-neutral-850/60 border-neutral-350 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-bold'
                      : 'bg-white border-transparent dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-neutral-850/50 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="font-jp text-sm leading-none">{k.character}</span>
                  <span className="capitalize text-[9px] text-neutral-400 dark:text-neutral-500 truncate max-w-[70%] select-none">
                    {k.meanings_vi.slice(0, 1)}
                  </span>
                </button>
              ))}
              {filteredQuickList.length === 0 && (
                <div className="text-center py-4 text-neutral-400 text-[10px]">Không tìm thấy chữ này.</div>
              )}
            </div>
          </div>

          {/* Right panel: Active Practice Canvas */}
          <div className="lg:col-span-3">
            {selectedKanji ? (
              <HanziWriterPractice 
                kanji={selectedKanji} 
                mode={writingMode}
                onNext={handleNextKanji} 
              />
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Vui lòng chọn một chữ Kanji để bắt đầu</h3>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default WritingPage;
