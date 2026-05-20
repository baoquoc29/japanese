import React, { useState } from 'react';
import { KanjiVGViewer } from './KanjiVGViewer';

interface StrokeOrderViewerProps {
  character: string;
  unicode?: string;
  size?: number;
}

export const StrokeOrderViewer: React.FC<StrokeOrderViewerProps> = ({
  character,
  size = 200,
}) => {
  const [activeTab, setActiveTab] = useState<'kanjivg' | 'animation'>('kanjivg');

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none animate-fade-in">
      {/* Navigation tabs for Stroke Order viewer */}
      <div className="flex border-b border-neutral-100 dark:border-neutral-800 w-full mb-4 no-print">
        <button
          onClick={() => setActiveTab('kanjivg')}
          className={`flex-1 pb-2 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'kanjivg'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          Sơ đồ nét KanjiVG (Chuẩn)
        </button>
        <button
          onClick={() => setActiveTab('animation')}
          className={`flex-1 pb-2 text-[11px] font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'animation'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          Minh họa nét vẽ
        </button>
      </div>

      {activeTab === 'kanjivg' ? (
        <div className="w-full flex flex-col items-center">
          <KanjiVGViewer character={character} size={size} mode="static" />
          <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold text-center mt-3 leading-relaxed">
            Sơ đồ phân tích thứ tự nét vẽ dựa trên tiêu chuẩn KanjiVG (Nhật Bản).
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <KanjiVGViewer character={character} size={size} mode="animate" />
          <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold text-center mt-3 leading-relaxed max-w-[280px]">
            * Hoạt ảnh vẽ nét động chuẩn 100% tiếng Nhật dựa trên KanjiVG.
          </p>
        </div>
      )}
    </div>
  );
};

export default StrokeOrderViewer;
