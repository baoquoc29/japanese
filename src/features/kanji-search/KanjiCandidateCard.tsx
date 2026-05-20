import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Kanji } from '../../types';

interface KanjiCandidateCardProps {
  kanji: Kanji;
}

export const KanjiCandidateCard: React.FC<KanjiCandidateCardProps> = ({ kanji }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 learning-card group">
      {/* Character */}
      <div className="text-center mb-3">
        <div className="text-5xl font-black font-jp text-slate-800 dark:text-slate-100 select-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {kanji.character}
        </div>
      </div>

      {/* Meaning */}
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 text-center capitalize truncate">
        {kanji.meanings_vi?.[0] || kanji.meanings_en?.[0] || '—'}
      </p>

      {/* Readings */}
      <div className="mt-2 space-y-0.5 text-center">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-jp">
          ON: {kanji.on_readings?.join(', ') || '—'}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-jp">
          KUN: {kanji.kun_readings?.join(', ') || '—'}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-black rounded">
          {kanji.jlpt}
        </span>
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded">
          {kanji.stroke_count} nét
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-3">
        <button
          onClick={() => navigate(`/kanji/${encodeURIComponent(kanji.character)}`)}
          className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
        >
          Chi tiết
        </button>
        <button
          onClick={() => navigate(`/writing?char=${encodeURIComponent(kanji.character)}`)}
          className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-750 text-white text-[10px] font-bold transition-colors cursor-pointer"
        >
          Luyện viết
        </button>
      </div>
    </div>
  );
};

export default KanjiCandidateCard;
