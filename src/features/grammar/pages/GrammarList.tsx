import React, { useState, useEffect } from 'react';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { SearchInput } from '../../../components/SearchInput';
import { JlptLevelTabs } from '../../../components/common/JlptLevelTabs';
import { EmptyState } from '../../../components/common/EmptyState';
import { GrammarCard } from '../components/GrammarCard';
import { Pagination } from '../../../components/Pagination';
import { matchesGrammarSearch } from '../../../utils/searchUtils';
import type { JlptFilterLevel } from '../../../constants/jlpt';

export const GrammarList: React.FC = () => {
  const { grammarList, loading, error } = useGrammar();
  const { progress, toggleFavoriteGrammar, markGrammarAsLearned } = useStudyProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<JlptFilterLevel>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to page 1 when query or level filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeLevel]);

  // Sync Level Counts based on raw grammarList
  const counts = grammarList.reduce((acc, g) => {
    const lvl = g.jlpt || 'N5';
    acc[lvl] = (acc[lvl] || 0) + 1;
    acc['ALL'] = (acc['ALL'] || 0) + 1;
    return acc;
  }, { ALL: 0, N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 } as Record<string, number>);

  // Client-side filtering & searching
  const levelFilteredGrammar = grammarList.filter(g => 
    activeLevel === 'ALL' || g.jlpt === activeLevel
  );

  const searchedGrammar = levelFilteredGrammar.filter(g => 
    matchesGrammarSearch(g, searchQuery)
  );

  const totalPages = Math.ceil(searchedGrammar.length / itemsPerPage);
  const paginatedGrammar = searchedGrammar.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLevelChange = (level: JlptFilterLevel) => {
    setActiveLevel(level);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Ngữ pháp tiếng Nhật
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tra cứu và học các cấu trúc câu tiếng Nhật từ N5 sơ cấp đến N1 nâng cao.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl p-4 space-y-4">
        <div className="flex flex-col gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm mẫu cấu trúc ngữ pháp, nghĩa tiếng Việt, tiếng Anh hoặc ví dụ..."
          />
          <JlptLevelTabs
            selectedLevel={activeLevel}
            onChange={handleLevelChange}
            counts={counts}
          />
        </div>
      </div>

      {/* Main Grammar Grid Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <span className="text-xs text-neutral-450 dark:text-neutral-555 font-medium">Đang tải cấu trúc ngữ pháp...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-rose-200 bg-rose-50/20 dark:border-rose-900/30 rounded-xl">
          <p className="text-xs text-rose-600 dark:text-rose-450 font-bold">{error}</p>
        </div>
      ) : levelFilteredGrammar.length === 0 ? (
        <EmptyState
          title={`Chưa có dữ liệu cho cấu trúc cấp độ ${activeLevel}`}
          description="Nội dung ngữ pháp cấp độ này đang được chúng tôi biên soạn kỹ lưỡng để mang tới kiến thức học chuẩn xác nhất. Xin vui lòng quay lại sau!"
        />
      ) : searchedGrammar.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl text-center">
          <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Không tìm thấy cấu trúc ngữ pháp nào</h3>
          <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc lọc theo cấp độ khác.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGrammar.map((grammar) => (
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default GrammarList;
