import React, { useState } from 'react';
import type { FlashcardItem } from './flashcardService';

interface FlashcardViewProps {
  card: FlashcardItem;
  onRemembered: () => void;
  onForgotten: () => void;
  onSpeech?: (text: string) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  card,
  onRemembered,
  onForgotten,
  onSpeech,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAction = (callback: () => void) => {
    setIsFlipped(false);
    setTimeout(() => {
      callback();
    }, 150); // slight delay to reset flip state before transition
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Flashcard Component */}
      <div 
        onClick={handleFlip}
        className="w-full aspect-[4/3] relative cursor-pointer [perspective:1000px] select-none"
      >
        <div className={`w-full h-full relative duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* FRONT side */}
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between items-center [backface-visibility:hidden] shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {card.type === 'kanji' ? 'Chữ Kanji' : card.type === 'vocabulary' ? 'Từ vựng' : 'Cấu trúc ngữ pháp'}
            </span>
            <div className="text-center font-sans text-5xl font-bold text-slate-850 dark:text-slate-100 py-4">
              {card.front}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Bấm để lật thẻ</span>
          </div>

          {/* BACK side */}
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto custom-scroll shadow-sm">
            
            {/* Type & JLPT */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ý nghĩa chi tiết</span>
              {card.jlpt && (
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-black">
                  {card.jlpt}
                </span>
              )}
            </div>

            {/* Meanings & Readings */}
            <div className="flex-grow space-y-3 py-2">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Ý nghĩa</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
                  {card.back.meaning}
                </p>
              </div>

              {/* Kanji readings */}
              {card.type === 'kanji' && (
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-850 pt-2 text-[10px]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Âm On</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {card.back.onReadings?.join(' / ') || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Âm Kun</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {card.back.kunReadings?.join(' / ') || '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Vocab / Grammar details */}
              {card.back.reading && (
                <div className="border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cách đọc</span>
                  <p className="text-xs font-semibold text-slate-750 dark:text-slate-250">
                    {card.back.reading}
                  </p>
                </div>
              )}

              {card.back.structure && (
                <div className="border-t border-slate-100 dark:border-slate-850 pt-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cấu trúc kết hợp</span>
                  <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                    {card.back.structure}
                  </p>
                </div>
              )}

              {card.back.example && (
                <div className="border-t border-slate-100 dark:border-slate-850 pt-2 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Ví dụ mẫu</span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-100">
                    {card.back.example}
                  </p>
                  {card.back.exampleVi && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                      {card.back.exampleVi}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-2 mt-2 text-[9px] text-slate-400">
              {onSpeech && card.type === 'vocabulary' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeech(card.front);
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Phát âm chữ
                </button>
              ) : <div />}
              <span className="uppercase">Bấm để lật lại</span>
            </div>

          </div>
        </div>
      </div>

      {/* Buttons (Text only) */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleAction(onForgotten)}
          className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Chưa nhớ
        </button>
        <button
          onClick={() => handleAction(onRemembered)}
          className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          Đã nhớ
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
