import React, { useState, useEffect } from 'react';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { SearchInput } from '../../../components/SearchInput';
import { LevelFilter } from '../../../components/LevelFilter';
import { GrammarCard } from '../components/GrammarCard';

type JLPTLevel = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export const GrammarList: React.FC = () => {
  const { grammarList, loading, error, search } = useGrammar();
  const { progress, toggleFavoriteGrammar, markGrammarAsLearned } = useStudyProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<JLPTLevel>('ALL');

  // Trigger search on query or level change
  useEffect(() => {
    const levelParam = activeLevel === 'ALL' ? undefined : activeLevel;
    search(searchQuery, levelParam);
  }, [searchQuery, activeLevel, search]);

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Ngữ pháp tiếng Nhật
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tra cứu và học các cấu trúc câu tiếng Nhật từ N5 sơ cấp đến N1 nâng cao.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm mẫu cấu trúc ngữ pháp..."
          />
          <LevelFilter
            activeLevel={activeLevel}
            onChange={setActiveLevel}
          />
        </div>
      </div>

      {/* Main Grammar Grid Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Đang tải cấu trúc ngữ pháp...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-rose-200 bg-rose-50/20 dark:border-rose-900/30 rounded-xl">
          <p className="text-xs text-rose-600 dark:text-rose-450 font-bold">{error}</p>
        </div>
      ) : grammarList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl text-center">
          <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Không tìm thấy cấu trúc ngữ pháp nào</h3>
          <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc cấp độ khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grammarList.map((grammar) => (
            <GrammarCard
              key={grammar.id}
              grammar={grammar}
              isLearned={progress.learnedGrammar.includes(grammar.id)}
              isFavorite={progress.favoriteGrammar.includes(grammar.id)}
              onToggleFavorite={() => toggleFavoriteGrammar(grammar.id)}
              onToggleLearned={() => markGrammarAsLearned(grammar.id, !progress.learnedGrammar.includes(grammar.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GrammarList;
