import React from 'react';
import type { FlashcardType } from './flashcardService';

interface FlashcardSetupProps {
  selectedTypes: FlashcardType[];
  onToggleType: (type: FlashcardType) => void;
  selectedJlpt: string;
  onSelectJlpt: (jlpt: string) => void;
  selectedMode: 'all' | 'favorites' | 'not_remembered';
  onSelectMode: (mode: 'all' | 'favorites' | 'not_remembered') => void;
  forgottenCount: number;
  availableCount: number;
  onStart: () => void;
}

export const FlashcardSetup: React.FC<FlashcardSetupProps> = ({
  selectedTypes,
  onToggleType,
  selectedJlpt,
  onSelectJlpt,
  selectedMode,
  onSelectMode,
  forgottenCount,
  availableCount,
  onStart,
}) => {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
      <div className="text-center space-y-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-5 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Thẻ ghi nhớ ôn tập
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Ôn tập từ vựng, Kanji và ngữ pháp theo phương pháp lặp lại ngắt quãng (Spaced Repetition).
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-6">
        {/* Deck types selection */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Chủ đề ôn tập
          </label>
          <div className="flex gap-2">
            {(['kanji', 'vocabulary', 'grammar'] as const).map(type => {
              const label = type === 'kanji' ? 'Chữ Kanji' : type === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp';
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => onToggleType(type)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 font-bold'
                      : 'bg-white border-neutral-200 text-neutral-500 dark:bg-zinc-900 dark:border-neutral-850 dark:text-neutral-450 hover:bg-neutral-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* JLPT options */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Cấp độ JLPT
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map(level => {
              const active = selectedJlpt === level;
              return (
                <button
                  key={level}
                  onClick={() => onSelectJlpt(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 font-bold'
                      : 'bg-white border-neutral-200 text-neutral-500 dark:bg-zinc-900 dark:border-neutral-850 dark:text-neutral-450 hover:bg-neutral-55'
                  }`}
                >
                  {level === 'all' ? 'Tất cả' : level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modes selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Lọc thẻ học
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(['all', 'favorites', 'not_remembered'] as const).map(mode => {
              const label = mode === 'all' ? 'Tất cả thẻ thuộc phạm vi bộ lọc' : mode === 'favorites' ? 'Chỉ những thẻ yêu thích' : 'Chỉ các thẻ chưa nhớ (cần học lại)';
              const active = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onSelectMode(mode)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-50 border-neutral-400 text-neutral-900 dark:bg-neutral-850 dark:border-neutral-700 dark:text-neutral-100'
                      : 'bg-white border-neutral-200 dark:bg-zinc-900 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-850/50 text-neutral-550 dark:text-neutral-400'
                  }`}
                >
                  <span>{label}</span>
                  {mode === 'not_remembered' && (
                    <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-150 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 font-bold">
                      {forgottenCount} thẻ
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic pool count indicator */}
        <div className="text-center text-[10px] text-neutral-450 dark:text-neutral-500 font-medium py-1 select-none">
          Có <span className="font-bold text-neutral-750 dark:text-neutral-300">{availableCount}</span> thẻ phù hợp điều kiện
        </div>

        {/* Action */}
        <button
          onClick={onStart}
          disabled={availableCount === 0}
          className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 text-white font-bold rounded-xl transition-all cursor-pointer text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Bắt đầu ôn tập
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetup;
