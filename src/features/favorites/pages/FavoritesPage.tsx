import React, { useState } from 'react';
import { useKanji } from '../../../hooks/useKanji';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { KanjiCard } from '../../kanji/components/KanjiCard';
import { VocabularyCard } from '../../vocabulary/components/VocabularyCard';
import { GrammarCard } from '../../grammar/components/GrammarCard';
import { Heart, Info, BookOpen, GraduationCap, BookMarked, AlertCircle } from 'lucide-react';

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
    { value: 'kanji', label: 'Kanji yêu thích', count: favKanjis.length, icon: BookOpen },
    { value: 'vocab', label: 'Từ vựng yêu thích', count: favVocabs.length, icon: GraduationCap },
    { value: 'grammar', label: 'Ngữ pháp yêu thích', count: favGrammars.length, icon: BookMarked },
    { value: 'wrong', label: 'Cần ôn tập (Sai)', count: wrongQuestions.length, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Sổ tay ôn tập & Yêu thích
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Nơi lưu trữ các bài học yêu thích của bạn và theo dõi các câu làm sai trong phần trắc nghiệm để ôn tập kỹ hơn.
        </p>
      </div>

      {/* Tab Switcher navigation */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as TabType)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl text-sm font-extrabold transition-all shrink-0 cursor-pointer border-b-2 ${
                activeTab === tab.value
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                activeTab === tab.value
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Panels based on Active Tab */}
      <div className="pt-4">
        
        {/* KANJI TAB */}
        {activeTab === 'kanji' && (
          favKanjis.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-12 text-center shadow-sm">
              <Info className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có Kanji yêu thích nào</h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                Nhấp vào biểu tượng trái tim trên các thẻ Kanji trong bài học để đưa chúng vào sổ tay này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-12 text-center shadow-sm">
              <Info className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có Từ vựng yêu thích nào</h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                Nhấp vào biểu tượng trái tim trên các thẻ từ vựng trong bài học để đưa chúng vào sổ tay này.
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-12 text-center shadow-sm">
              <Info className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có Ngữ pháp yêu thích nào</h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                Nhấp vào biểu tượng trái tim trên các thẻ ngữ pháp trong bài học để đưa chúng vào sổ tay này.
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-12 text-center shadow-sm">
              <Info className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Sổ tay trống!</h3>
              <p className="text-xs text-slate-450 dark:text-slate-550 mt-1 max-w-sm mx-auto">
                Khi làm sai bất kỳ câu hỏi nào trong module Quiz, câu hỏi đó sẽ được tự động xếp vào đây để bạn dễ dàng rèn luyện lại.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm max-w-2xl mx-auto">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {wrongQuestions.map((q, index) => (
                  <div key={index} className="flex justify-between items-center px-6 py-4.5 gap-4">
                    <div className="flex gap-3">
                      <span className="w-5 h-5 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        !
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWrongQuizQuestion(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl text-[10px] font-black cursor-pointer transition-colors shrink-0"
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
