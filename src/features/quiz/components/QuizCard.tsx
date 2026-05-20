import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
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
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/20';
      }
      if (isSelected && option !== question.answer) {
        return 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-2 ring-rose-500/20';
      }
      return 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 opacity-60';
    }

    if (isSelected) {
      return 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 scale-[1.01]';
    }

    return 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'kanji': return 'Kanji';
      case 'vocabulary': return 'Từ vựng';
      case 'grammar': return 'Ngữ pháp';
      default: return cat;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none max-w-xl mx-auto">
      
      {/* Progress header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-6">
        <div className="flex gap-2 items-center">
          <span className="px-2.5 py-0.5 text-xs font-black bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg capitalize">
            {getCategoryLabel(question.category)}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
            {question.difficulty}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 select-none">
          Câu {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question string */}
      <div className="mb-6 text-center">
        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 select-none">Câu hỏi</h4>
        <h3 className="text-2xl sm:text-3xl font-black font-sans text-slate-800 dark:text-slate-100 leading-normal px-2">
          {question.question}
        </h3>
      </div>

      {/* Answer options */}
      <div className="space-y-3.5 mb-6">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            disabled={isSubmitted}
            className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex justify-between items-center cursor-pointer ${getOptionStyle(option)}`}
          >
            <span className="font-sans leading-relaxed">{option}</span>
            {isSubmitted && option === question.answer && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            {isSubmitted && selectedOption === option && option !== question.answer && (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Footer toolbar actions */}
      <div className="flex justify-between items-center gap-4">
        {question.hint ? (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" /> {showHint ? "Ẩn gợi ý" : "Gợi ý"}
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
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-2xl transition-all cursor-pointer shadow-md shadow-indigo-500/10"
            >
              Trả lời
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl transition-all hover:scale-[1.02] cursor-pointer shadow-md shadow-indigo-500/10"
            >
              Tiếp tục <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hint panel */}
      {showHint && question.hint && (
        <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-xs font-medium text-amber-600 dark:text-amber-400 leading-relaxed animate-fade-in">
          💡 {question.hint}
        </div>
      )}
    </div>
  );
};
export default QuizCard;
