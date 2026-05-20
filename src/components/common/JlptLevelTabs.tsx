import React from 'react';
import { JLPT_LEVELS, type JlptFilterLevel } from '../../constants/jlpt';

interface JlptLevelTabsProps {
  selectedLevel: JlptFilterLevel;
  onChange: (level: JlptFilterLevel) => void;
  includeAll?: boolean;
  counts?: Record<string, number>;
}

export const JlptLevelTabs: React.FC<JlptLevelTabsProps> = ({
  selectedLevel,
  onChange,
  includeAll = true,
  counts,
}) => {
  const levels: JlptFilterLevel[] = includeAll ? ['ALL', ...JLPT_LEVELS] : [...JLPT_LEVELS];

  return (
    <div className="flex flex-wrap gap-2 pb-2 select-none border-b border-neutral-100 dark:border-neutral-850/60 w-full">
      {levels.map((level) => {
        const isActive = selectedLevel === level;
        const count = counts ? counts[level] : undefined;
        
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              isActive
                ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 font-bold'
                : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-350 dark:bg-zinc-900 dark:border-neutral-800 dark:text-neutral-450 dark:hover:text-neutral-200'
            }`}
          >
            <span>
              {level === 'ALL' ? 'Tất cả' : level}
            </span>
            {count !== undefined && (
              <span className={`ml-1 px-1 py-0.2 rounded text-[9px] font-bold ${
                isActive 
                  ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950'
                  : 'bg-neutral-100 text-neutral-450 dark:bg-neutral-800 dark:text-neutral-500'
              }`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default JlptLevelTabs;
