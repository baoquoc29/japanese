import React from 'react';
import type { KanjiTestQuestion } from './kanjiTestGenerator';

interface KanjiQuestionCardProps {
  question: KanjiTestQuestion;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  questionIndex: number;
  totalQuestions: number;
}

export const KanjiQuestionCard: React.FC<KanjiQuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelect,
  questionIndex,
  totalQuestions,
}) => {
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 max-w-xl mx-auto shadow-sm">
      {/* Progress */}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
        <span>Câu hỏi {questionIndex + 1} / {totalQuestions}</span>
        <span>{question.type === 'meaning' ? 'Ý nghĩa Kanji' : question.type === 'reading' ? 'Cách đọc Kanji' : question.type === 'stroke_count' ? 'Đếm nét viết' : 'Chọn mặt chữ'}</span>
      </div>

      {/* Main Question Display */}
      <div className="text-center py-4 space-y-3">
        {question.kanji && (
          <div className="text-7xl font-sans text-slate-800 dark:text-slate-200 select-none font-bold">
            {question.kanji}
          </div>
        )}
        <p className="text-base font-bold text-slate-800 dark:text-slate-100">
          {question.prompt}
        </p>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === question.correctAnswer;
          
          let btnStyle = "border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300";
          if (isAnswered) {
            if (isCorrect) {
              // Highlight correct answer in emerald
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-300 font-semibold";
            } else if (isSelected) {
              // Highlight incorrect selection in rose
              btnStyle = "border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-650 dark:bg-rose-950/20 dark:text-rose-300 font-semibold";
            } else {
              btnStyle = "border-slate-150 dark:border-slate-850 opacity-40 text-slate-450 dark:text-slate-500 cursor-not-allowed";
            }
          }

          return (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => onSelect(opt)}
              className={`w-full py-3.5 px-4 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation when answered */}
      {isAnswered && question.explanation && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-center space-y-1 animate-fade-in">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Giải thích chi tiết</span>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default KanjiQuestionCard;
