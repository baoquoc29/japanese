import React from 'react';

interface WritingModeTabsProps {
  mode: 'guided' | 'free';
  onModeChange: (mode: 'guided' | 'free') => void;
}

export const WritingModeTabs: React.FC<WritingModeTabsProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 w-full max-w-sm">
      <button
        onClick={() => onModeChange('guided')}
        className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
          mode === 'guided'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        Có hướng dẫn
      </button>
      <button
        onClick={() => onModeChange('free')}
        className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
          mode === 'free'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        Không hướng dẫn
      </button>
    </div>
  );
};

export default WritingModeTabs;
