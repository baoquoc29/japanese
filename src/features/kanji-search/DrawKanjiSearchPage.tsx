import React, { useState, useEffect } from 'react';
import { useKanji } from '../../hooks/useKanji';
import type { Kanji } from '../../types';
import { DrawSearchCanvas } from './DrawSearchCanvas';
import type { DrawStroke } from './DrawSearchCanvas';
import { KanjiCandidateCard } from './KanjiCandidateCard';
import { recognizeHandwriting } from './drawRecognitionService';
import { JlptLevelTabs } from '../../components/common/JlptLevelTabs';
import type { JlptFilterLevel } from '../../constants/jlpt';

export const DrawKanjiSearchPage: React.FC = () => {
  const { kanjiList } = useKanji();
  const [selectedLevel, setSelectedLevel] = useState<JlptFilterLevel>('ALL');
  const [candidates, setCandidates] = useState<Kanji[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStrokes, setCurrentStrokes] = useState<DrawStroke[]>([]);

  // Sync Level Counts from local dictionary
  const counts = kanjiList.reduce((acc, k) => {
    const lvl = k.jlpt || 'N5';
    acc[lvl] = (acc[lvl] || 0) + 1;
    acc['ALL'] = (acc['ALL'] || 0) + 1;
    return acc;
  }, { ALL: 0, N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 } as Record<string, number>);

  const performSearch = async (strokes: DrawStroke[], level: JlptFilterLevel) => {
    if (strokes.length === 0) {
      setCandidates([]);
      setHasSearched(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const filteredDict = level === 'ALL' 
        ? kanjiList 
        : kanjiList.filter(k => k.jlpt === level);
        
      const results = await recognizeHandwriting(strokes, filteredDict, 12);
      
      // Filter out any standalone custom Kanji if they don't match the active level
      const finalResults = level === 'ALL'
        ? results
        : results.filter(k => k.jlpt === level);
        
      setCandidates(finalResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error during handwriting recognition:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (strokes: DrawStroke[]) => {
    setCurrentStrokes(strokes);
    performSearch(strokes, selectedLevel);
  };

  // Re-trigger search when level changes if user has already drawn
  useEffect(() => {
    if (currentStrokes.length > 0) {
      performSearch(currentStrokes, selectedLevel);
    }
  }, [selectedLevel]);

  const handleLevelChange = (level: JlptFilterLevel) => {
    setSelectedLevel(level);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto py-2">
      {/* Header Info */}
      <div className="space-y-2 pb-2 select-none">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Vẽ nét chữ Kanji trực quan để tra cứu nhanh thông tin, phiên âm và ví dụ câu.
        </p>
      </div>

      {/* JLPT Levels Filter */}
      <JlptLevelTabs 
        selectedLevel={selectedLevel} 
        onChange={handleLevelChange} 
        counts={counts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Left column: Canvas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col items-center">
            <h2 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 select-none">
              Khung vẽ Kanji
            </h2>
            <DrawSearchCanvas size={280} onSearch={handleSearch} />
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg select-none">
            <span className="text-[9px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1">Hướng dẫn</span>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-450 leading-relaxed">
              Nhấn giữ chuột trái (hoặc chạm màn hình) để bắt đầu vẽ. Hệ thống sử dụng công nghệ nhận diện nét vẽ kết hợp thuật toán sắp xếp độ lệch số nét để gợi ý chữ Kanji bạn đang tìm kiếm chính xác nhất.
            </p>
          </div>
        </div>

        {/* Right column: Results */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center justify-between select-none">
            <span>Kết quả tìm kiếm ({selectedLevel === 'ALL' ? 'Tất cả' : selectedLevel})</span>
            {candidates.length > 0 && !isSearching && (
              <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded text-[9px] font-bold">
                Tìm thấy {candidates.length} chữ
              </span>
            )}
          </h2>

          {isSearching ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center h-[340px]">
              <p className="text-xs text-neutral-450 dark:text-neutral-550 font-medium">
                Đang nhận diện chữ viết tay của bạn...
              </p>
            </div>
          ) : !hasSearched ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center h-[340px]">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-xs">
                Vui lòng vẽ chữ vào khung bên trái rồi nhấn <span className="font-bold text-neutral-900 dark:text-white">"Tìm kiếm"</span>.
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center h-[340px]">
              <p className="text-xs text-neutral-600 dark:text-neutral-450 font-bold">
                Không tìm thấy Kanji phù hợp
              </p>
              <p className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1 max-w-[240px]">
                Hãy thử vẽ nét rõ ràng hơn hoặc chuyển đổi sang cấp độ JLPT khác để xem kết quả.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {candidates.map(k => (
                <KanjiCandidateCard key={k.character} kanji={k} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawKanjiSearchPage;
