import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useKanji } from '../../../hooks/useKanji';
import { HanziWriterPractice } from '../components/HanziWriterPractice';
import { WritingModeTabs } from '../components/WritingModeTabs';
import { Loader2 } from 'lucide-react';
import type { Kanji } from '../../../types';

export const WritingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { kanjiList, loading, error } = useKanji();
  
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [quickSearch, setQuickSearch] = useState('');
  const [writingMode, setWritingMode] = useState<'guided' | 'free'>('guided');

  // Get active char from URL or select first one in list
  useEffect(() => {
    if (kanjiList.length === 0) return;
    
    const urlChar = searchParams.get('char');
    if (urlChar) {
      const found = kanjiList.find(k => k.character === urlChar);
      if (found) {
        setSelectedKanji(found);
        return;
      }
    }
    
    // Default fallback to first element
    setSelectedKanji(kanjiList[0]);
  }, [kanjiList, searchParams]);

  const handleSelectKanji = (kanji: Kanji) => {
    setSelectedKanji(kanji);
    setSearchParams({ char: kanji.character });
  };

  const handleNextKanji = () => {
    if (kanjiList.length === 0 || !selectedKanji) return;
    const currentIndex = kanjiList.findIndex(k => k.character === selectedKanji.character);
    const nextIndex = (currentIndex + 1) % kanjiList.length;
    handleSelectKanji(kanjiList[nextIndex]);
  };

  const filteredQuickList = kanjiList.filter(k => 
    k.character.includes(quickSearch) ||
    k.meanings_vi.some(m => m.toLowerCase().includes(quickSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-55">
            Tập viết Kanji
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Luyện thứ tự nét và ghi nhớ mặt chữ Nhật bằng canvas vẽ tay trực quan.
          </p>
        </div>
        <WritingModeTabs mode={writingMode} onModeChange={setWritingMode} />
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Đang khởi động lớp viết Kanji...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-600 font-medium">{error}</div>
      ) : kanjiList.length === 0 ? (
        <div className="text-center py-20 text-slate-500">Không có dữ liệu Kanji để tập viết.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left panel: Quick Select list */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col h-[500px] lg:h-[600px]">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3 select-none">
              Danh sách chữ Kanji
            </span>
            
            {/* mini search box */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Tìm nhanh..."
                value={quickSearch}
                onChange={e => setQuickSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* list */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-1 custom-scroll">
              {filteredQuickList.map(k => (
                <button
                  key={k.character}
                  onClick={() => handleSelectKanji(k)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    selectedKanji?.character === k.character
                      ? 'bg-slate-105 border-slate-300 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-bold'
                      : 'bg-white border-transparent dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="font-sans text-base">{k.character}</span>
                  <span className="capitalize text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[70%]">
                    {k.meanings_vi.slice(0, 1)} ({k.jlpt})
                  </span>
                </button>
              ))}
              {filteredQuickList.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-[10px]">Không tìm thấy chữ này.</div>
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
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-450">Vui lòng chọn một chữ Kanji để bắt đầu</h3>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default WritingPage;
