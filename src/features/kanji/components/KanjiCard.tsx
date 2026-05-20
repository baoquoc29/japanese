import React from 'react';
import { Link } from 'react-router-dom';
import type { Kanji } from '../../../types';

interface KanjiCardProps {
  kanji: Kanji;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleLearned: (e: React.MouseEvent) => void;
}

export const KanjiCard: React.FC<KanjiCardProps> = ({
  kanji,
  isLearned,
  isFavorite,
  onToggleFavorite,
  onToggleLearned,
}) => {
  return (
    <div
      className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-350 dark:hover:border-neutral-750 transition-colors"
    >
      {/* Top Meta info */}
      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold select-none">
        <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-500 dark:text-neutral-400">
          {kanji.jlpt}
        </span>
        <span>{kanji.stroke_count} nét</span>
      </div>

      {/* Kanji & Meanings Block (Link to Detail) */}
      <Link to={`/kanji/${kanji.character}`} className="block py-4 text-center group">
        <div className="text-5xl font-light font-jp text-neutral-900 dark:text-neutral-50 group-hover:scale-105 transition-transform select-none leading-none mb-3">
          {kanji.character}
        </div>
        <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200 capitalize truncate">
          {kanji.meanings_vi.slice(0, 2).join(', ')}
        </h4>
      </Link>

      {/* On / Kun readings */}
      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1 py-2 border-t border-neutral-100 dark:border-neutral-850">
        <div className="truncate">
          <span className="font-bold text-[9px] uppercase tracking-wider text-neutral-400 mr-1 select-none">On</span>
          <span className="font-jp text-neutral-700 dark:text-neutral-350">{kanji.on_readings.slice(0, 2).join(', ') || '—'}</span>
        </div>
        <div className="truncate">
          <span className="font-bold text-[9px] uppercase tracking-wider text-neutral-400 mr-1 select-none">Kun</span>
          <span className="font-jp text-neutral-700 dark:text-neutral-350">{kanji.kun_readings.slice(0, 2).join(', ') || '—'}</span>
        </div>
      </div>

      {/* Actions & Status row */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between gap-1">
        {/* Toggle States as text buttons */}
        <div className="flex gap-1.5 text-[9px] font-bold select-none">
          <button
            onClick={onToggleLearned}
            className={`transition-colors cursor-pointer ${
              isLearned 
                ? 'text-indigo-600 dark:text-indigo-400' 
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

        {/* Detail Link Button */}
        <Link 
          to={`/kanji/${kanji.character}`}
          className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  );
};

export default KanjiCard;
