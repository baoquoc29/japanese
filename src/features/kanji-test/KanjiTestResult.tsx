import React from 'react';
import type { KanjiTestQuestion } from './kanjiTestGenerator';

interface KanjiTestResultProps {
  score: number;
  total: number;
  questions: KanjiTestQuestion[];
  answers: Record<string, string>;
  onRestart: () => void;
}

export const KanjiTestResult: React.FC<KanjiTestResultProps> = ({
  score,
  total,
  questions,
  answers,
  onRestart,
}) => {
  const percentage = Math.round((score / total) * 100);

  // Filter missed questions
  const missedQuestions = questions.filter(q => answers[q.id] !== q.correctAnswer);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6">
      {/* Header Result */}
      <div className="text-center space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Kết quả bài kiểm tra
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bạn đã hoàn thành trọn vẹn bài kiểm tra Kanji của mình.
        </p>
      </div>

      {/* Score Card Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Điểm số chính xác</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {score} / {total}
          </div>
          <span className="text-[10px] text-slate-550 dark:text-slate-400 block">Số câu trả lời đúng của bạn</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Tỷ lệ chính xác</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {percentage}%
          </div>
          <span className="text-[10px] text-slate-550 dark:text-slate-400 block">Độ bao phủ câu hỏi chính xác</span>
        </div>
      </div>

      {/* Review missed questions */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
          {missedQuestions.length === 0 ? '✓ Không có câu sai' : 'Danh sách câu sai cần ôn tập'}
        </h3>

        {missedQuestions.length > 0 ? (
          <div className="space-y-3">
            {missedQuestions.map((q) => {
              const selected = answers[q.id];
              return (
                <div 
                  key={q.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-3">
                      {q.kanji && (
                        <span className="text-2xl font-bold font-sans text-slate-850 dark:text-slate-150">
                          {q.kanji}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {q.prompt}
                      </span>
                    </div>
                    {q.explanation && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        Từ điển: {q.explanation}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs shrink-0 space-y-1">
                    <p className="text-rose-600 dark:text-rose-400">
                      Chọn sai: <span className="font-bold">{selected || 'Bỏ qua'}</span>
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      Đáp án đúng: <span className="font-bold">{q.correctAnswer}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Tuyệt vời! Bạn đã trả lời chính xác tất cả các câu hỏi.
            </p>
          </div>
        )}
      </div>

      {/* Action panel */}
      <div className="text-center pt-2">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
        >
          Làm bài kiểm tra mới
        </button>
      </div>
    </div>
  );
};

export default KanjiTestResult;
