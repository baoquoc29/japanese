import React, { useState } from 'react';
import { useKanji } from '../../hooks/useKanji';
import { generateKanjiTest, type KanjiTestQuestion } from './kanjiTestGenerator';
import { KanjiTestSetup } from './KanjiTestSetup';
import { KanjiQuestionCard } from './KanjiQuestionCard';
import { KanjiTestResult } from './KanjiTestResult';
import { Loader2 } from 'lucide-react';

export const KanjiTestPage: React.FC = () => {
  const { kanjiList, loading, error } = useKanji();
  const [stage, setStage] = useState<'setup' | 'active' | 'result'>('setup');
  const [questions, setQuestions] = useState<KanjiTestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const handleStartTest = (config: {
    jlpt: string;
    questionCount: number;
    questionTypes: any;
  }) => {
    const testQuestions = generateKanjiTest(kanjiList, {
      jlpt: config.jlpt,
      questionCount: config.questionCount,
      questionTypes: config.questionTypes,
    });
    setQuestions(testQuestions);
    setCurrentIdx(0);
    setAnswers({});
    setScore(0);
    setStage('active');
  };

  const handleSelectAnswer = (answer: string) => {
    const currentQuestion = questions[currentIdx];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStage('result');
    }
  };

  const handleRestart = () => {
    setStage('setup');
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400">Đang khởi tạo danh sách đề thi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-rose-600 font-medium">
        Lỗi tải dữ liệu kiểm tra: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      {stage === 'setup' && (
        <KanjiTestSetup 
          onStart={handleStartTest} 
          kanjiList={kanjiList} 
        />
      )}

      {stage === 'active' && questions.length > 0 && (
        <div className="space-y-6">
          <KanjiQuestionCard
            question={questions[currentIdx]}
            selectedAnswer={answers[questions[currentIdx].id] || null}
            onSelect={handleSelectAnswer}
            questionIndex={currentIdx}
            totalQuestions={questions.length}
          />
          {answers[questions[currentIdx].id] !== undefined && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
              </button>
            </div>
          )}
        </div>
      )}

      {stage === 'result' && (
        <KanjiTestResult
          score={score}
          total={questions.length}
          questions={questions}
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default KanjiTestPage;
