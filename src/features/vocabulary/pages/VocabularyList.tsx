import React, { useState, useEffect } from 'react';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { SearchInput } from '../../../components/SearchInput';
import { LevelFilter } from '../../../components/LevelFilter';
import { VocabularyCard } from '../components/VocabularyCard';

type JLPTLevel = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type POSFilter = 'ALL' | 'noun' | 'verb-i' | 'verb-ii' | 'verb-iii' | 'adj-i' | 'adj-na' | 'adverb';

export const VocabularyList: React.FC = () => {
  const { vocabList, loading, error, search } = useVocabulary();
  const { progress, toggleFavoriteVocab, markVocabAsLearned } = useStudyProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<JLPTLevel>('ALL');
  const [activePOS, setActivePOS] = useState<POSFilter>('ALL');

  // Trigger search on inputs change
  useEffect(() => {
    const levelParam = activeLevel === 'ALL' ? undefined : activeLevel;
    const posParam = activePOS === 'ALL' ? undefined : activePOS;
    search(searchQuery, { level: levelParam, partOfSpeech: posParam });
  }, [searchQuery, activeLevel, activePOS, search]);

  const wordTypes = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'noun', label: 'Danh từ' },
    { value: 'verb-i', label: 'Động từ I' },
    { value: 'verb-ii', label: 'Động từ II' },
    { value: 'verb-iii', label: 'Động từ III' },
    { value: 'adj-i', label: 'Tính từ い' },
    { value: 'adj-na', label: 'Tính từ な' },
    { value: 'adverb', label: 'Trạng từ' },
  ];

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Từ vựng Nhật Bản
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tra cứu hệ thống từ vựng đầy đủ kèm Kana, giải nghĩa tiếng Việt và ví dụ minh họa.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
        
        {/* Row 1: Search and JLPT Level */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm Từ vựng, Hiragana, Romaji, Nghĩa..."
          />
          <LevelFilter
            activeLevel={activeLevel}
            onChange={setActiveLevel}
          />
        </div>

        {/* Row 2: Part Of Speech selector */}
        <div className="flex flex-col sm:flex-row items-baseline gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-850">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none shrink-0">Loại từ:</span>
          <div className="flex flex-wrap gap-1.5">
            {wordTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setActivePOS(type.value as POSFilter)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  activePOS === type.value
                    ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 font-semibold'
                    : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Vocabulary List Cards */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Đang tải danh sách từ vựng...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-rose-200 bg-rose-50/20 dark:border-rose-900/30 rounded-xl">
          <p className="text-xs text-rose-600 dark:text-rose-450 font-bold">{error}</p>
        </div>
      ) : vocabList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl text-center">
          <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Không tìm thấy từ vựng nào</h3>
          <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc lọc theo cấp độ khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocabList.map((vocab) => (
            <VocabularyCard
              key={vocab.id}
              vocab={vocab}
              isLearned={progress.learnedVocab.includes(vocab.id)}
              isFavorite={progress.favoriteVocab.includes(vocab.id)}
              onToggleFavorite={() => toggleFavoriteVocab(vocab.id)}
              onToggleLearned={() => markVocabAsLearned(vocab.id, !progress.learnedVocab.includes(vocab.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VocabularyList;
