import React, { useState, useEffect } from 'react';
import { useKanji } from '../../hooks/useKanji';
import { useVocabulary } from '../../hooks/useVocabulary';
import { useGrammar } from '../../hooks/useGrammar';
import { useStudyProgress } from '../../hooks/useStudyProgress';
import { buildFlashcardDeck, type FlashcardItem, type FlashcardType } from './flashcardService';
import { FlashcardView } from './FlashcardView';
import { Loader2 } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { kanjiList, loading: loadingKanji } = useKanji();
  const { vocabList, loading: loadingVocab } = useVocabulary();
  const { grammarList, loading: loadingGrammar } = useGrammar();
  const { progress } = useStudyProgress();

  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stage, setStage] = useState<'setup' | 'study' | 'summary'>('setup');
  
  // Forgotten cards stored in localStorage for persistent review
  const [forgottenIds, setForgottenIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nihongo_flashcards_forgotten');
    return saved ? JSON.parse(saved) : [];
  });

  // Setup form states
  const [selectedTypes, setSelectedTypes] = useState<FlashcardType[]>(['kanji']);
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites' | 'not_remembered'>('all');

  // Stats for the current session
  const [sessionStats, setSessionStats] = useState({
    remembered: 0,
    forgotten: 0,
  });

  useEffect(() => {
    localStorage.setItem('nihongo_flashcards_forgotten', JSON.stringify(forgottenIds));
  }, [forgottenIds]);

  const handleToggleType = (type: FlashcardType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(prev => prev.filter(t => t !== type));
      }
    } else {
      setSelectedTypes(prev => [...prev, type]);
    }
  };

  const handleStartStudy = () => {
    const cards = buildFlashcardDeck(kanjiList, vocabList, grammarList, {
      types: selectedTypes,
      jlpt: selectedJlpt,
      mode: selectedMode === 'not_remembered' ? 'not_remembered' : selectedMode,
      favoriteKanji: progress.favoriteKanji,
      favoriteVocab: progress.favoriteVocab,
      favoriteGrammar: progress.favoriteGrammar,
      forgottenIds: forgottenIds,
    });

    if (cards.length === 0) {
      alert('Không tìm thấy thẻ nào phù hợp với bộ lọc đã chọn.');
      return;
    }

    setDeck(cards.slice(0, 30)); // limit to max 30 cards per study session for focus
    setCurrentIdx(0);
    setSessionStats({ remembered: 0, forgotten: 0 });
    setStage('study');
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRemembered = () => {
    const activeCard = deck[currentIdx];
    
    // Remove from forgotten list if remembered
    setForgottenIds(prev => prev.filter(id => id !== activeCard.id && id !== activeCard.sourceId));
    setSessionStats(prev => ({ ...prev, remembered: prev.remembered + 1 }));

    advanceCard();
  };

  const handleForgotten = () => {
    const activeCard = deck[currentIdx];
    
    // Add to forgotten list
    setForgottenIds(prev => {
      if (prev.includes(activeCard.id)) return prev;
      return [...prev, activeCard.id];
    });
    setSessionStats(prev => ({ ...prev, forgotten: prev.forgotten + 1 }));

    advanceCard();
  };

  const advanceCard = () => {
    if (currentIdx < deck.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStage('summary');
    }
  };

  const handleRestart = () => {
    setStage('setup');
    setDeck([]);
    setCurrentIdx(0);
  };

  const loading = loadingKanji || loadingVocab || loadingGrammar;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Đang đồng bộ hóa dữ liệu học...</span>
      </div>
    );
  }

  // Count matching pool dynamically in setup screen
  const dynamicCardsPool = buildFlashcardDeck(kanjiList, vocabList, grammarList, {
    types: selectedTypes,
    jlpt: selectedJlpt,
    mode: selectedMode === 'not_remembered' ? 'not_remembered' : selectedMode,
    favoriteKanji: progress.favoriteKanji,
    favoriteVocab: progress.favoriteVocab,
    favoriteGrammar: progress.favoriteGrammar,
    forgottenIds: forgottenIds,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {stage === 'setup' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fade-in py-6">
          <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Flashcards ôn tập
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hệ thống thẻ ghi nhớ thông minh giúp học từ vựng, chữ Kanji và ngữ pháp hiệu quả.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Deck types selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 select-none">
                Chủ đề học
              </label>
              <div className="flex gap-2">
                {(['kanji', 'vocabulary', 'grammar'] as const).map(type => {
                  const label = type === 'kanji' ? 'Chữ Kanji' : type === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp';
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggleType(type)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* JLPT options */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 select-none">
                Cấp độ JLPT
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map(level => {
                  const active = selectedJlpt === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedJlpt(level)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-700/80'
                      }`}
                    >
                      {level === 'all' ? 'Tất cả' : level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modes selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 select-none">
                Lọc nội dung
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['all', 'favorites', 'not_remembered'] as const).map(mode => {
                  const label = mode === 'all' ? 'Tất cả từ thuộc bộ lọc' : mode === 'favorites' ? 'Chỉ từ khóa yêu thích' : 'Chỉ từ đánh dấu chưa nhớ';
                  const active = selectedMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-100 border-slate-400 text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 font-semibold'
                          : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span>{label}</span>
                      {mode === 'not_remembered' && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full dark:bg-rose-950/20 dark:text-rose-450 font-bold">
                          {forgottenIds.length} thẻ
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic pool count indicator */}
            <div className="text-center text-[10px] text-slate-450 dark:text-slate-500 font-medium py-1">
              Bộ lọc hiện tại có <span className="font-bold text-slate-750 dark:text-slate-300">{dynamicCardsPool.length}</span> thẻ khả dụng
            </div>

            {/* Action */}
            <button
              onClick={handleStartStudy}
              disabled={dynamicCardsPool.length === 0}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer text-sm shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Bắt đầu ôn tập
            </button>
          </div>
        </div>
      )}

      {stage === 'study' && deck.length > 0 && (
        <div className="space-y-6 py-6 max-w-md mx-auto">
          {/* Study Progress Indicator */}
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider select-none px-1">
            <span>Tiến trình: {currentIdx + 1} / {deck.length}</span>
            <button 
              onClick={handleRestart}
              className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors"
            >
              Thoát ra
            </button>
          </div>

          {/* Flashcard Component */}
          <FlashcardView
            card={deck[currentIdx]}
            onRemembered={handleRemembered}
            onForgotten={handleForgotten}
            onSpeech={handleSpeech}
          />
        </div>
      )}

      {stage === 'summary' && (
        <div className="max-w-xl mx-auto space-y-8 animate-fade-in py-6">
          <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Hoàn thành ôn tập
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bạn đã ôn tập xong danh sách thẻ ghi nhớ trong phiên học này.
            </p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Đã ghi nhớ</span>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {sessionStats.remembered}
              </div>
              <span className="text-[9px] text-slate-450 dark:text-slate-500 block">Số thẻ được loại khỏi danh sách quên</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Chưa ghi nhớ</span>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                {sessionStats.forgotten}
              </div>
              <span className="text-[9px] text-slate-450 dark:text-slate-500 block">Số thẻ được thêm vào ôn tập lại</span>
            </div>
          </div>

          {/* Action */}
          <div className="text-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Chọn bộ thẻ mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
