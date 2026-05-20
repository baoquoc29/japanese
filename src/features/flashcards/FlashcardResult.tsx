import React from 'react';

interface FlashcardResultProps {
  rememberedCount: number;
  forgottenCount: number;
  onRestart: () => void;
}

export const FlashcardResult: React.FC<FlashcardResultProps> = ({
  rememberedCount,
  forgottenCount,
  onRestart,
}) => {
  const total = rememberedCount + forgottenCount;
  const accuracy = total > 0 ? Math.round((rememberedCount / total) * 100) : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
      <div className="text-center space-y-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-5 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Hoàn thành phiên ôn tập!
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Học tập thông minh giúp rèn luyện trí nhớ lâu dài. Dưới đây là kết quả của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Đã ghi nhớ</span>
          <div className="text-3xl font-extrabold text-indigo-650 dark:text-indigo-400 font-display">
            {rememberedCount}
          </div>
          <span className="text-[9px] text-neutral-450 dark:text-neutral-500 block">Số thẻ được nhớ thành công</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Chưa ghi nhớ</span>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-450 font-display">
            {forgottenCount}
          </div>
          <span className="text-[9px] text-neutral-450 dark:text-neutral-500 block">Số thẻ sẽ được đưa vào hàng đợi ôn lại</span>
        </div>
      </div>

      {/* Accuracy Indicator */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-550 uppercase tracking-wider block">Tỷ lệ nhớ</span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-none">
            {accuracy >= 80 ? 'Rất tốt! Hãy tiếp tục duy trì nhé.' : accuracy >= 50 ? 'Khá tốt! Hãy ôn tập đều đặn.' : 'Hãy thử lại để cải thiện trí nhớ.'}
          </p>
        </div>
        <div className="text-xl font-black text-neutral-850 dark:text-neutral-100 font-display">
          {accuracy}%
        </div>
      </div>

      {/* Action */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          Chọn bộ ôn tập khác
        </button>
      </div>
    </div>
  );
};

export default FlashcardResult;
