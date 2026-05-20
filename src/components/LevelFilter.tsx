import React from 'react';

type JLPTLevel = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

interface LevelFilterProps {
  activeLevel: JLPTLevel;
  onChange: (level: JLPTLevel) => void;
  className?: string;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({
  activeLevel,
  onChange,
  className = '',
}) => {
  const levels: JLPTLevel[] = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'];

  const getBadgeStyle = (level: JLPTLevel) => {
    if (activeLevel === level) {
      return 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105';
    }
    return 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900';
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${getBadgeStyle(level)}`}
        >
          {level === 'ALL' ? 'Tất cả' : level}
        </button>
      ))}
    </div>
  );
};
export default LevelFilter;
