import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Kanji } from '../../types';

interface KanjiCandidateCardProps {
  kanji: Kanji;
}

export const KanjiCandidateCard: React.FC<KanjiCandidateCardProps> = ({ kanji }) => {
  const navigate = useNavigate();
  const isPlaceholder = kanji.meanings_vi?.[0] === 'Chữ ngoài N5-N1';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col justify-between hover:border-neutral-350 dark:hover:border-neutral-750 transition-colors">
      
      <div>
        {/* Kanji character rendering */}
        <div className="text-center py-2 select-none">
          <div className="text-5xl font-light font-jp text-neutral-900 dark:text-neutral-50 leading-none">
            {kanji.character}
          </div>
        </div>

        {/* Meaning */}
        <p className={`text-xs font-bold text-center capitalize truncate mt-2 ${
          isPlaceholder ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'
        }`}>
          {isPlaceholder ? 'Ngoài N5-N1' : (kanji.meanings_vi?.[0] || '—')}
        </p>

        {/* Readings */}
        {!isPlaceholder ? (
          <div className="mt-2 space-y-0.5 text-center text-[10px] text-neutral-500 dark:text-neutral-400 font-jp">
            <p className="truncate">
              <span className="font-bold text-[8px] uppercase tracking-wider text-neutral-400 mr-1 select-none">On</span>
              <span>{kanji.on_readings?.slice(0, 1).join(', ') || '—'}</span>
            </p>
            <p className="truncate">
              <span className="font-bold text-[8px] uppercase tracking-wider text-neutral-400 mr-1 select-none">Kun</span>
              <span>{kanji.kun_readings?.slice(0, 1).join(', ') || '—'}</span>
            </p>
          </div>
        ) : (
          <div className="h-6" /> // spacer for placeholder card
        )}

        {/* Badges row */}
        <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
            isPlaceholder
              ? 'bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-450'
              : 'bg-indigo-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 text-indigo-650 dark:text-indigo-400'
          }`}>
            {isPlaceholder ? 'Khác' : kanji.jlpt}
          </span>
          <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[9px] font-bold rounded">
            {kanji.stroke_count} nét
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 select-none">
        {isPlaceholder ? (
          <button
            onClick={() => navigate(`/writing?char=${encodeURIComponent(kanji.character)}`)}
            className="w-full py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[10px] font-bold transition-colors cursor-pointer text-center"
          >
            Luyện viết
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate(`/kanji/${encodeURIComponent(kanji.character)}`)}
              className="flex-1 py-1.5 border border-neutral-300 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-350 text-[10px] font-bold rounded cursor-pointer transition-colors text-center animate-delay-100"
            >
              Chi tiết
            </button>
            <button
              onClick={() => navigate(`/writing?char=${encodeURIComponent(kanji.character)}`)}
              className="flex-1 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[10px] font-bold transition-colors cursor-pointer text-center"
            >
              Luyện viết
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default KanjiCandidateCard;
