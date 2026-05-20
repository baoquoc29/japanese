import React from 'react';
import { Link } from 'react-router-dom';
import type { GrammarPoint } from '../../../types';

interface GrammarCardProps {
  grammar: GrammarPoint;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToggleLearned: () => void;
}

export const GrammarCard: React.FC<GrammarCardProps> = ({
  grammar,
  isLearned,
  isFavorite,
  onToggleFavorite,
  onToggleLearned,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-350 dark:hover:border-neutral-750 transition-colors">
      
      <div>
        {/* Top Badges and Controls */}
        <div className="flex justify-between items-center mb-4 select-none">
          <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
            {grammar.jlpt}
          </span>
          
          <div className="flex items-center gap-1.5 text-[9px] font-bold">
            <button
              onClick={onToggleLearned}
              className={`transition-colors cursor-pointer ${
                isLearned
                  ? 'text-indigo-650 dark:text-indigo-400'
                  : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-400'
              }`}
            >
              {isLearned ? 'Đã học' : 'Chưa học'}
            </button>
            <span className="text-neutral-200 dark:text-neutral-800">|</span>
            <button
              onClick={onToggleFavorite}
              className={`transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-rose-500'
                  : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-400'
              }`}
            >
              {isFavorite ? 'Yêu thích' : 'Lưu'}
            </button>
          </div>
        </div>

        {/* Grammar Pattern & Meaning */}
        <div className="mb-4">
          <h3 className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100">
            {grammar.pattern}
          </h3>
          <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-2 leading-relaxed">
            {grammar.meaning_vi}
          </p>
        </div>

        {/* Structure Box */}
        <div className="bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 mb-4">
          <span className="text-[9px] font-bold tracking-wider text-neutral-450 dark:text-neutral-500 uppercase block mb-1 select-none">
            Kết hợp
          </span>
          <code className="text-xs font-bold font-mono text-neutral-750 dark:text-neutral-350 break-words">
            {grammar.structure}
          </code>
        </div>
      </div>

      {/* Action to details */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
        <span className="text-[10px] text-neutral-400 dark:text-neutral-550 font-medium">
          {grammar.examples.length} ví dụ câu
        </span>
        <Link
          to={`/grammar/${grammar.id}`}
          className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-805"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default GrammarCard;
