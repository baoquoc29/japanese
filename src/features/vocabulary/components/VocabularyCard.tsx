import React from 'react';
import type { Vocabulary } from '../../../types';

interface VocabularyCardProps {
  vocab: Vocabulary;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToggleLearned: () => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocab,
  isLearned,
  isFavorite,
  onToggleFavorite,
  onToggleLearned,
}) => {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;

      const jaVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('ja'));
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API phát âm.');
    }
  };

  const getPartofSpeechLabel = (pos: string) => {
    switch (pos) {
      case 'noun': return 'Danh từ';
      case 'verb-i': return 'Động từ I';
      case 'verb-ii': return 'Động từ II';
      case 'verb-iii': return 'Động từ III';
      case 'adj-i': return 'Tính từ い';
      case 'adj-na': return 'Tính từ な';
      case 'adverb': return 'Trạng từ';
      default: return pos;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-350 dark:hover:border-neutral-750 transition-colors">
      
      <div>
        {/* Top row: badges + text toggles */}
        <div className="flex justify-between items-start mb-4 select-none">
          <div className="flex gap-1.5 text-[9px] font-bold">
            <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-500 dark:text-neutral-400">
              {vocab.jlpt}
            </span>
            <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 dark:text-neutral-500">
              {getPartofSpeechLabel(vocab.partOfSpeech)}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[9px] font-bold">
            <button
              onClick={onToggleLearned}
              className={`transition-colors cursor-pointer ${
                isLearned
                  ? 'text-indigo-650 dark:text-indigo-400'
                  : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-400'
              }`}
            >
              {isLearned ? 'Đã học' : 'Chưa học'}
            </button>
            <span className="text-neutral-200 dark:text-neutral-800">|</span>
            <button
              onClick={onToggleFavorite}
              className={`transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-rose-500'
                  : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-400'
              }`}
            >
              {isFavorite ? 'Yêu thích' : 'Lưu'}
            </button>
          </div>
        </div>

        {/* Word + Reading + Audio Button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-50">
                {vocab.word}
              </h3>
              <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                {vocab.romaji}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-550 dark:text-neutral-400 font-sans mt-0.5">
              {vocab.reading}
            </p>
          </div>
          
          {/* Plain Text Button for pronunciation (no icon) */}
          <button
            onClick={playAudio}
            className="px-2 py-1 border border-neutral-300 dark:border-neutral-750 hover:bg-neutral-55 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold rounded cursor-pointer transition-colors"
          >
            Nghe
          </button>
        </div>

        {/* Meanings */}
        <div className="space-y-1 mb-4">
          <h4 className="text-sm font-bold text-neutral-805 dark:text-neutral-200 capitalize">
            {vocab.meanings_vi.join(', ')}
          </h4>
          {vocab.meanings_en && vocab.meanings_en.length > 0 && (
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 capitalize">
              {vocab.meanings_en.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Examples Block */}
      {vocab.examples && vocab.examples.length > 0 && (
        <div className="bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 mt-2">
          <span className="text-[9px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block mb-1.5 select-none">
            Ví dụ
          </span>
          {vocab.examples.map((ex, index) => (
            <div key={index} className="space-y-0.5">
              <p className="text-xs font-bold font-sans text-neutral-800 dark:text-neutral-200 leading-relaxed">
                {ex.ja}
              </p>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans">
                {ex.reading}
              </p>
              <p className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-450 mt-0.5">
                {ex.vi}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default VocabularyCard;
