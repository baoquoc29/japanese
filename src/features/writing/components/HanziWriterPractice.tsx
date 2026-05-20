import React, { useState, useEffect } from 'react';
import { KanjiWritingCanvas } from './KanjiWritingCanvas';
import { KanjiVGViewer } from '../../kanji/components/KanjiVGViewer';
import { writingProgressService } from '../../../services/writingProgressService';
import type { Kanji } from '../../../types';

interface HanziWriterPracticeProps {
  kanji: Kanji;
  mode?: 'guided' | 'free';
  onNext?: () => void;
}

export const HanziWriterPractice: React.FC<HanziWriterPracticeProps> = ({
  kanji,
  mode = 'guided',
  onNext,
}) => {
  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);
  const [hasPracticed, setHasPracticed] = useState<boolean>(false);

  // Reset state when character or mode changes
  useEffect(() => {
    setHasPracticed(false);
    setShowAnswerModal(false);
  }, [kanji.character, mode]);

  const handleStrokeComplete = () => {
    if (!hasPracticed) {
      setHasPracticed(true);
      writingProgressService.markPractice(kanji.character, mode);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswerModal(prev => !prev);
  };

  const record = writingProgressService.getRecord(kanji.character);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 select-none animate-fade-in">
      
      {/* Kanji Title header bar */}
      <div className="text-center mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <h3 className="text-xl font-bold text-neutral-850 dark:text-neutral-100">
          Chữ đang học: <span className="text-indigo-600 dark:text-indigo-400 font-sans text-2xl ml-1 font-jp">{kanji.character}</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 capitalize font-medium">
          Ý nghĩa: {kanji.meanings_vi.join(', ')}
        </p>
        <div className="flex gap-2 justify-center items-center mt-2 flex-wrap text-[10px] text-neutral-450 font-bold">
          <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
            JLPT {kanji.jlpt}
          </span>
          <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
            {kanji.stroke_count} nét
          </span>
          {record.completed && (
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
              ✓ Đã luyện ({record.guidedCount + record.freeCount} lần)
            </span>
          )}
        </div>
      </div>

      {/* Main interactive area: Left = sample player, Right = canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
        
        {/* Left: KanjiVG Dynamic sample player */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-bold text-neutral-450 dark:text-neutral-500 block mb-1 select-none">
            Hoạt ảnh mẫu nét vẽ:
          </span>
          <KanjiVGViewer character={kanji.character} size={200} mode="animate" />
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 space-y-1 text-center font-bold">
            <div>Unicode: <span className="font-mono text-neutral-600 dark:text-neutral-400">{kanji.unicode || `U+${kanji.character.charCodeAt(0).toString(16).toUpperCase()}`}</span></div>
          </div>
        </div>

        {/* Right: Tracing / Drawing Canvas */}
        <div className="flex flex-col items-center justify-center space-y-4 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-850 pt-6 md:pt-0 md:pl-8">
          <div className="flex flex-col items-center w-full">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block mb-2 select-none">
              {mode === 'guided' ? 'Bảng tập viết (Đồ theo chữ mẫu mờ):' : 'Bảng tập viết tự do (Tự nhớ mặt chữ):'}
            </span>
            <KanjiWritingCanvas
              character={kanji.character}
              canvasSize={256}
              mode={mode}
              onStrokeComplete={handleStrokeComplete}
            />
          </div>

          {/* Action controls */}
          <div className="flex gap-2.5 w-full max-w-[280px] mt-2 no-print">
            <button
              onClick={handleShowAnswer}
              className={`flex-1 py-2.5 px-4 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showAnswerModal
                  ? 'bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200'
                  : 'bg-white border-neutral-200 text-neutral-600 dark:bg-zinc-900 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-850/50'
              }`}
            >
              {showAnswerModal ? 'Ẩn chi tiết từ điển' : 'Tra cứu từ điển'}
            </button>
            
            {onNext && (
              <button
                onClick={onNext}
                className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Chữ tiếp theo
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Dictionary Info section */}
      {showAnswerModal && (
        <div className="mt-8 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center animate-fade-in">
          <h4 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3 select-none">Thông tin chi tiết chữ mẫu</h4>
          <div className="text-7xl font-sans text-neutral-800 dark:text-neutral-150 select-none mb-4 font-jp">
            {kanji.character}
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto space-y-2 text-left bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-neutral-800 p-4 rounded-xl">
            <p className="flex justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-1.5">
              <span className="font-bold text-neutral-450 dark:text-neutral-500">Âm ON:</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 font-jp">{kanji.on_readings.join(' / ') || '—'}</span>
            </p>
            <p className="flex justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-1.5">
              <span className="font-bold text-neutral-450 dark:text-neutral-500">Âm KUN:</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 font-jp">{kanji.kun_readings.join(' / ') || '—'}</span>
            </p>
            {kanji.examples && kanji.examples.length > 0 && (
              <div className="pt-1">
                <span className="font-bold text-neutral-450 dark:text-neutral-500 block mb-1">Ví dụ:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {kanji.examples.map((ex, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-750 dark:text-neutral-300 rounded font-medium text-[11px] font-jp">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HanziWriterPractice;
