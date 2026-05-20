import React, { useState, useEffect } from 'react';
import { useKanji } from '../../../hooks/useKanji';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { SearchInput } from '../../../components/SearchInput';
import { LevelFilter } from '../../../components/LevelFilter';
import { KanjiCard } from '../components/KanjiCard';
import { DrawKanjiSearchPage } from '../../kanji-search/DrawKanjiSearchPage';
import { Pagination } from '../../../components/Pagination';

type JLPTLevel = 'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type KanjiViewTab = 'LIST' | 'DRAW';

export const KanjiList: React.FC = () => {
  const { kanjiList, loading, error, search } = useKanji();
  const { progress, toggleFavoriteKanji, markKanjiAsLearned } = useStudyProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState<JLPTLevel>('ALL');
  const [activeTab, setActiveTab] = useState<KanjiViewTab>('LIST');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Trigger search on query or level change
  useEffect(() => {
    if (activeTab === 'LIST') {
      const levelParam = activeLevel === 'ALL' ? undefined : activeLevel;
      search(searchQuery, levelParam);
    }
  }, [searchQuery, activeLevel, activeTab, search]);

  // Reset to page 1 when query, filters, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeLevel, activeTab]);

  const totalPages = Math.ceil(kanjiList.length / itemsPerPage);
  const paginatedKanjis = kanjiList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      
      {/* ===== HEADER SECTION ===== */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Chữ Hán Kanji
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tra cứu, học tập cách đọc và cách viết của chữ Kanji từ cấp độ N5 đến N1.
        </p>
      </div>

      {/* ===== TAB SWITCHER ===== */}
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('LIST')}
          className={`pb-2.5 text-xs font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'LIST'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          Tra cứu theo danh sách
        </button>
        <button
          onClick={() => setActiveTab('DRAW')}
          className={`pb-2.5 text-xs font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'DRAW'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          Tìm bằng nét vẽ
        </button>
      </div>

      {/* ===== TAB CONTENT ===== */}
      {activeTab === 'DRAW' ? (
        <DrawKanjiSearchPage />
      ) : (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Tìm kiếm Kanji, âm On, âm Kun, hoặc nghĩa tiếng Việt..."
                />
              </div>
              <LevelFilter
                activeLevel={activeLevel}
                onChange={setActiveLevel}
              />
            </div>
          </div>

          {/* Loading & Error States */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-2">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Đang tải dữ liệu Kanji...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 border border-rose-200 bg-rose-50/20 dark:border-rose-900/30 rounded-xl">
              <p className="text-xs text-rose-600 dark:text-rose-450 font-bold">{error}</p>
            </div>
          ) : kanjiList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl text-center">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Không tìm thấy Kanji phù hợp</h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-xs">
                Vui lòng đổi từ khóa tìm kiếm hoặc chọn bộ lọc JLPT khác.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedKanjis.map((kanji) => (
                  <KanjiCard
                    key={kanji.character}
                    kanji={kanji}
                    isLearned={progress.learnedKanji.includes(kanji.character)}
                    isFavorite={progress.favoriteKanji.includes(kanji.character)}
                    onToggleFavorite={(e) => {
                      e.preventDefault();
                      toggleFavoriteKanji(kanji.character);
                    }}
                    onToggleLearned={(e) => {
                      e.preventDefault();
                      markKanjiAsLearned(kanji.character, !progress.learnedKanji.includes(kanji.character));
                    }}
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
      )}
    </div>
  );
};

export default KanjiList;
