import React, { useState } from 'react';
import { useKanji } from '../../../hooks/useKanji';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { KanjiCard } from '../../kanji/components/KanjiCard';
import { VocabularyCard } from '../../vocabulary/components/VocabularyCard';
import { GrammarCard } from '../../grammar/components/GrammarCard';

type TabType = 'kanji' | 'vocab' | 'grammar' | 'wrong';

export const FavoritesPage: React.FC = () => {
  const { kanjiList } = useKanji();
  const { vocabList } = useVocabulary();
  const { grammarList } = useGrammar();
  const { 
    progress, 
    toggleFavoriteKanji, 
    markKanjiAsLearned, 
    toggleFavoriteVocab, 
    markVocabAsLearned, 
    toggleFavoriteGrammar, 
    markGrammarAsLearned,
    removeWrongQuizQuestion
  } = useStudyProgress();

  const [activeTab, setActiveTab] = useState<TabType>('kanji');

  // Filter lists based on favorite array in progress
  const favKanjis = kanjiList.filter(k => progress.favoriteKanji.includes(k.character));
  const favVocabs = vocabList.filter(v => progress.favoriteVocab.includes(v.id));
  const favGrammars = grammarList.filter(g => progress.favoriteGrammar.includes(g.id));
  const wrongQuestions = progress.wrongQuizQuestions || [];

  const tabs = [
    { value: 'kanji', label: 'Kanji yêu thích', count: favKanjis.length },
    { value: 'vocab', label: 'Từ vựng yêu thích', count: favVocabs.length },
    { value: 'grammar', label: 'Ngữ pháp yêu thích', count: favGrammars.length },
    { value: 'wrong', label: 'Cần ôn tập (Lỗi)', count: wrongQuestions.length },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Sổ tay ôn tập & Yêu thích
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Nơi lưu trữ các bài học yêu thích và theo dõi các câu làm sai để rèn luyện kỹ hơn.
        </p>
      </div>

      {/* Tab Switcher navigation */}
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as TabType)}
            className={`pb-2.5 text-xs font-semibold transition-colors relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.value
                ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b border-indigo-600 dark:border-indigo-400'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              activeTab === tab.value
                ? 'bg-indigo-50 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-450'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Dynamic Content Panels based on Active Tab */}
      <div className="pt-2">
        
        {/* KANJI TAB */}
        {activeTab === 'kanji' && (
          favKanjis.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl py-16 text-center">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Chưa có Kanji yêu thích nào</h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
                Nhấp lưu trên các thẻ Kanji trong danh sách bài học để đưa chúng vào sổ tay này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
              {favKanjis.map((kanji) => (
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
          )
        )}

        {/* VOCAB TAB */}
        {activeTab === 'vocab' && (
          favVocabs.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl py-16 text-center">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Chưa có Từ vựng yêu thích nào</h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
                Nhấp lưu trên các thẻ từ vựng trong danh sách bài học để đưa chúng vào sổ tay này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {favVocabs.map((vocab) => (
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
          )
        )}

        {/* GRAMMAR TAB */}
        {activeTab === 'grammar' && (
          favGrammars.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl py-16 text-center">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Chưa có Ngữ pháp yêu thích nào</h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
                Nhấp lưu trên các thẻ ngữ pháp trong danh sách bài học để đưa chúng vào sổ tay này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {favGrammars.map((grammar) => (
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
          )
        )}

        {/* WRONG QUESTIONS TAB */}
        {activeTab === 'wrong' && (
          wrongQuestions.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-xl py-16 text-center">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Sổ tay trống</h3>
              <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
                Khi bạn làm sai bất kỳ câu hỏi nào trong module Quiz, câu hỏi đó sẽ được tự động xếp vào đây để bạn dễ dàng rèn luyện lại.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden max-w-2xl mx-auto">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {wrongQuestions.map((q, index) => (
                  <div key={index} className="flex justify-between items-center px-5 py-4 gap-4">
                    <div className="flex gap-2.5">
                      <span className="text-xs font-bold text-rose-500 select-none">[!]</span>
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                        {q}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWrongQuizQuestion(q)}
                      className="px-2.5 py-1 bg-neutral-150 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-[10px] font-bold rounded cursor-pointer transition-colors"
                    >
                      Đã thuộc
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default FavoritesPage;
