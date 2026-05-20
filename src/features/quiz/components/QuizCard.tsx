import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../../types';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === question.answer;
    onAnswerSubmit(isCorrect);
  };

  const getOptionStyle = (option: string) => {
    const isSelected = selectedOption === option;
    
    if (isSubmitted) {
      if (option === question.answer) {
        return 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400';
      }
      if (isSelected && option !== question.answer) {
        return 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400';
      }
      return 'border-neutral-100 dark:border-neutral-850 text-neutral-400 opacity-60';
    }

    if (isSelected) {
      return 'border-indigo-600 bg-indigo-50/20 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-400';
    }

    return 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-850/50 text-neutral-800 dark:text-neutral-250 bg-white dark:bg-zinc-900';
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'kanji': return 'Chữ Hán';
      case 'vocabulary': return 'Từ vựng';
      case 'grammar': return 'Ngữ pháp';
      default: return cat;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl mx-auto">
      
      {/* Progress header */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-150 dark:border-neutral-800 mb-6 select-none">
        <div className="flex gap-1.5 items-center">
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
            {getCategoryLabel(question.category)}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">
            {question.difficulty}
          </span>
        </div>
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
          Câu {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question string */}
      <div className="mb-6 text-center">
        <h4 className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 select-none">Câu hỏi</h4>
        <h3 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-150 leading-relaxed px-2">
          {question.question}
        </h3>
      </div>

      {/* Answer options */}
      <div className="space-y-2.5 mb-6">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={isSubmitted}
              className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-semibold transition-colors duration-150 flex justify-between items-center cursor-pointer ${getOptionStyle(option)}`}
            >
              <span className="font-sans leading-relaxed">{option}</span>
              {isSubmitted && option === question.answer && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase select-none">[Đúng]</span>
              )}
              {isSubmitted && isSelected && option !== question.answer && (
                <span className="text-[10px] font-bold text-rose-500 uppercase select-none">[Sai]</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer toolbar actions */}
      <div className="flex justify-between items-center gap-4">
        {question.hint ? (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold rounded cursor-pointer transition-colors"
            >
              {showHint ? "Ẩn gợi ý" : "Gợi ý"}
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed text-white dark:text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Trả lời
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Tiếp tục
            </button>
          )}
        </div>
      </div>

      {/* Hint panel */}
      {showHint && question.hint && (
        <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-450 leading-relaxed animate-fade-in">
          Gợi ý: {question.hint}
        </div>
      )}
    </div>
  );
};

export default QuizCard;
