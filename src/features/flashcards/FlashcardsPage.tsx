import React, { useState } from 'react';
import { useKanji } from '../../hooks/useKanji';
import { useVocabulary } from '../../hooks/useVocabulary';
import { useGrammar } from '../../hooks/useGrammar';
import { useStudyProgress } from '../../hooks/useStudyProgress';
import { buildFlashcardDeck, type FlashcardItem, type FlashcardType } from './flashcardService';
import { FlashcardView } from './FlashcardView';
import { FlashcardSetup } from './FlashcardSetup';
import { FlashcardResult } from './FlashcardResult';
import { flashcardProgressService } from '../../services/flashcardProgressService';
import { Loader2 } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { kanjiList, loading: loadingKanji } = useKanji();
  const { vocabList, loading: loadingVocab } = useVocabulary();
  const { grammarList, loading: loadingGrammar } = useGrammar();
  const { progress } = useStudyProgress();

  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stage, setStage] = useState<'setup' | 'study' | 'summary'>('setup');

  // Setup form states
  const [selectedTypes, setSelectedTypes] = useState<FlashcardType[]>(['kanji']);
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'favorites' | 'not_remembered'>('all');

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    remembered: 0,
    forgotten: 0,
  });

  // Calculate forgotten count in service based on selected types
  const getForgottenIdsFromService = () => {
    let ids: string[] = [];
    selectedTypes.forEach(t => {
      ids = ids.concat(flashcardProgressService.getForgottenIds(t));
    });
    return ids;
  };

  const forgottenIds = getForgottenIdsFromService();

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
      mode: selectedMode,
      favoriteKanji: progress.favoriteKanji,
      favoriteVocab: progress.favoriteVocab,
      favoriteGrammar: progress.favoriteGrammar,
      forgottenIds: forgottenIds,
    });

    if (cards.length === 0) {
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
    flashcardProgressService.markRemembered(activeCard.sourceId, activeCard.type);
    setSessionStats(prev => ({ ...prev, remembered: prev.remembered + 1 }));
    advanceCard();
  };

  const handleForgotten = () => {
    const activeCard = deck[currentIdx];
    flashcardProgressService.markForgotten(activeCard.sourceId, activeCard.type);
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
        <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-600 animate-spin" />
        <span className="text-xs text-neutral-450 dark:text-neutral-500 font-medium">Đang đồng bộ hóa dữ liệu học...</span>
      </div>
    );
  }

  // Count matching pool dynamically in setup screen
  const dynamicCardsPool = buildFlashcardDeck(kanjiList, vocabList, grammarList, {
    types: selectedTypes,
    jlpt: selectedJlpt,
    mode: selectedMode,
    favoriteKanji: progress.favoriteKanji,
    favoriteVocab: progress.favoriteVocab,
    favoriteGrammar: progress.favoriteGrammar,
    forgottenIds: forgottenIds,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {stage === 'setup' && (
        <FlashcardSetup
          selectedTypes={selectedTypes}
          onToggleType={handleToggleType}
          selectedJlpt={selectedJlpt}
          onSelectJlpt={setSelectedJlpt}
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          forgottenCount={forgottenIds.length}
          availableCount={dynamicCardsPool.length}
          onStart={handleStartStudy}
        />
      )}

      {stage === 'study' && deck.length > 0 && (
        <div className="space-y-6 py-6 max-w-md mx-auto">
          {/* Study Progress Indicator */}
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none px-1">
            <span>Tiến trình: {currentIdx + 1} / {deck.length}</span>
            <button 
              onClick={handleRestart}
              className="hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors"
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
        <FlashcardResult
          rememberedCount={sessionStats.remembered}
          forgottenCount={sessionStats.forgotten}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default FlashcardsPage;
