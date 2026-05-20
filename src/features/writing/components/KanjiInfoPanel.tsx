import React from 'react';
import type { Kanji } from '../../../types';
import { writingProgressService } from '../../../services/writingProgressService';

interface KanjiInfoPanelProps {
  kanji: Kanji;
}

export const KanjiInfoPanel: React.FC<KanjiInfoPanelProps> = ({ kanji }) => {
  const record = writingProgressService.getRecord(kanji.character);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
      {/* Large Kanji */}
      <div className="text-center">
        <div className="text-8xl font-black font-jp text-slate-800 dark:text-slate-100 select-none leading-none">
          {kanji.character}
        </div>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-3 capitalize">
          {kanji.meanings_vi.join(', ')}
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 capitalize">
          {kanji.meanings_en.join(', ')}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="px-3 py-1 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-black rounded-lg">
          {kanji.jlpt}
        </span>
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg">
          {kanji.stroke_count} nét
        </span>
        {record.completed && (
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg">
            ✓ Đã luyện
          </span>
        )}
      </div>

      {/* Readings */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-semibold">Âm ON:</span>
          <span className="text-slate-700 dark:text-slate-300 font-bold font-jp">
            {kanji.on_readings.join(', ') || '—'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-semibold">Âm KUN:</span>
          <span className="text-slate-700 dark:text-slate-300 font-bold font-jp">
            {kanji.kun_readings.join(', ') || '—'}
          </span>
        </div>
      </div>

      {/* Practice stats */}
      {(record.guidedCount > 0 || record.freeCount > 0) && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Lịch sử luyện</p>
          <div className="flex gap-3 text-xs">
            <span className="text-violet-600 dark:text-violet-400 font-bold">
              Có HD: {record.guidedCount} lần
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              Tự do: {record.freeCount} lần
            </span>
          </div>
        </div>
      )}

      {/* Example words */}
      {kanji.examples && kanji.examples.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Từ ví dụ</p>
          <div className="flex flex-wrap gap-1.5">
            {kanji.examples.slice(0, 4).map((ex, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold font-jp">
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanjiInfoPanel;
