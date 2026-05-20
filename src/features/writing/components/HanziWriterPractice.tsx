import React, { useState } from 'react';
import { KanjiWritingCanvas } from './KanjiWritingCanvas';
import { StrokeOrderViewer } from '../../kanji/components/StrokeOrderViewer';
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
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const handleStrokeComplete = () => {
    // Simulated stroke progress
  };

  const handleShowAnswer = () => {
    setShowAnswerModal(!showAnswerModal);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Luyện viết chữ: <span className="text-indigo-650 dark:text-indigo-400 font-sans text-2xl ml-1">{kanji.character}</span>
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 capitalize">
          Ý nghĩa: {kanji.meanings_vi.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
        
        {/* Left Side: Stroke Order Animation or Free Mode instruction */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {mode === 'guided' ? (
            <StrokeOrderViewer 
              character={kanji.character} 
              unicode={kanji.unicode} 
            />
          ) : (
            <div className="w-full max-w-sm aspect-square bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">Chế độ tự viết</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                Hãy nhớ lại mặt chữ và thứ tự nét để vẽ chữ Kanji này mà không có gợi ý.
              </p>
              <div className="mt-4 text-[10px] text-slate-400">
                (Đổi sang "Có hướng dẫn" nếu cần xem nét vẽ)
              </div>
            </div>
          )}
          <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1 text-center max-w-[280px]">
            <div>Số nét: <span className="text-slate-700 dark:text-slate-350 font-bold">{kanji.stroke_count} nét</span></div>
            <div>Unicode: <span className="text-slate-700 dark:text-slate-350 font-mono font-bold">{kanji.unicode}</span></div>
          </div>
        </div>

        {/* Right Side: Handwriting Canvas */}
        <div className="flex flex-col items-center justify-center space-y-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/60 pt-6 md:pt-0 md:pl-8">
          <span className="text-xs font-bold text-slate-550 dark:text-slate-400 block mb-2 select-none">
            Khung tập viết:
          </span>
          <KanjiWritingCanvas 
            character={kanji.character} 
            canvasSize={256} 
            mode={mode}
            onStrokeComplete={handleStrokeComplete}
          />
          
          <div className="flex gap-2 w-full max-w-[280px] mt-2">
            <button
              onClick={handleShowAnswer}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/85 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {showAnswerModal ? "Ẩn từ điển" : "Xem từ điển"}
            </button>
            
            {onNext && (
              <button
                onClick={onNext}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Chữ tiếp theo
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Answer Preview overlay when "Show Answer" is toggled */}
      {showAnswerModal && (
        <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">Thông tin chi tiết chữ mẫu</h4>
          <div className="text-6xl font-sans text-slate-800 dark:text-slate-200 select-none mb-3">
            {kanji.character}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto space-y-1">
            <p>ON: {kanji.on_readings.join(' / ')}</p>
            <p>KUN: {kanji.kun_readings.join(' / ')}</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1">Ví dụ: {kanji.examples.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HanziWriterPractice;
