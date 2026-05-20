import React, { useState } from 'react';
import { useKanji } from '../../hooks/useKanji';
import type { Kanji } from '../../types';
import { DrawSearchCanvas } from './DrawSearchCanvas';
import type { DrawStroke } from './DrawSearchCanvas';
import { KanjiCandidateCard } from './KanjiCandidateCard';
import { recognizeByStrokeCount } from './drawRecognitionService';

export const DrawKanjiSearchPage: React.FC = () => {
  const { kanjiList } = useKanji();
  const [candidates, setCandidates] = useState<Kanji[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (strokes: DrawStroke[]) => {
    if (strokes.length === 0) {
      setCandidates([]);
      setHasSearched(false);
      return;
    }
    const results = recognizeByStrokeCount(strokes, kanjiList, 12);
    setCandidates(results);
    setHasSearched(true);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Tìm Kanji bằng nét vẽ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Vẽ phác thảo chữ Kanji bạn nhớ, hệ thống sẽ gợi ý các chữ có số nét tương đương.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Canvas */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center">
            <h2 className="text-xs font-semibold text-slate-405 dark:text-slate-500 uppercase tracking-wider mb-4 select-none">
              Khung vẽ tay Kanji
            </h2>
            <DrawSearchCanvas size={280} onSearch={handleSearch} />
          </div>

          {/* Info notice */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lưu ý: Hệ thống đang gợi ý dựa trên tổng số nét vẽ của bạn. Để có độ chính xác cao nhất, hãy vẽ đầy đủ và chính xác từng nét của chữ Kanji cần tra cứu.
            </p>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-405 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Kết quả tìm kiếm</span>
            {candidates.length > 0 && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full">
                Tìm thấy {candidates.length} chữ
              </span>
            )}
          </h2>

          {!hasSearched ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center h-[340px]">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Vui lòng vẽ chữ vào khung bên trái rồi nhấn <span className="font-bold text-slate-900 dark:text-white">"Tìm kiếm"</span>.
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center h-[340px]">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Không tìm thấy Kanji phù hợp.
              </p>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-2 max-w-[260px]">
                Hãy thử kiểm tra lại số nét vẽ hoặc vẽ lại rõ ràng hơn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
