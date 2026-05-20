import React, { useState } from 'react';
import { useKanji } from '../../../hooks/useKanji';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { QuizCard } from '../components/QuizCard';
import type { QuizQuestion } from '../../../types';

type QuizState = 'setup' | 'active' | 'completed';
type QuizCategory = 'kanji' | 'vocabulary' | 'grammar' | 'review';

export const QuizPage: React.FC = () => {
  const { kanjiList } = useKanji();
  const { vocabList } = useVocabulary();
  const { grammarList } = useGrammar();
  const { addQuizResult, addWrongQuizQuestion, removeWrongQuizQuestion } = useStudyProgress();

  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [category, setCategory] = useState<QuizCategory>('kanji');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ question: QuizQuestion; isCorrect: boolean }[]>([]);

  // Function to shuffle array
  const shuffle = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Dynamic quiz questions generator
  const generateQuiz = (cat: QuizCategory) => {
    let generated: QuizQuestion[] = [];

    if (cat === 'kanji') {
      if (kanjiList.length < 4) return;
      const shuffledKanjis = shuffle(kanjiList);
      
      shuffledKanjis.slice(0, 10).forEach((k, idx) => {
        const typeRand = Math.random();
        
        if (typeRand < 0.33) {
          // Type 1: Kanji to Meaning
          const distractors = shuffle(kanjiList.filter(item => item.character !== k.character))
            .slice(0, 3)
            .map(item => item.meanings_vi.join(', '));
          
          generated.push({
            id: `q_kanji_m_${idx}_${Date.now()}`,
            type: 'kanji_to_meaning',
            question: `Chữ Kanji "${k.character}" có nghĩa là gì?`,
            options: shuffle([k.meanings_vi.join(', '), ...distractors]),
            answer: k.meanings_vi.join(', '),
            difficulty: k.jlpt,
            category: 'kanji',
            hint: `Âm ON: ${k.on_readings.join(', ')} | KUN: ${k.kun_readings.join(', ')}`
          });
        } else if (typeRand < 0.66) {
          // Type 2: Kanji to Reading (ON/KUN combined)
          const correctAnswer = k.kun_readings[0] || k.on_readings[0] || 'ひ';
          const distractors = shuffle(kanjiList.filter(item => item.character !== k.character))
            .slice(0, 3)
            .map(item => item.kun_readings[0] || item.on_readings[0] || 'ひと');

          generated.push({
            id: `q_kanji_r_${idx}_${Date.now()}`,
            type: 'kanji_to_reading',
            question: `Chữ Kanji "${k.character}" có cách đọc là gì?`,
            options: shuffle([correctAnswer, ...distractors]),
            answer: correctAnswer,
            difficulty: k.jlpt,
            category: 'kanji',
            hint: `Nghĩa: ${k.meanings_vi.join(', ')}`
          });
        } else {
          // Type 3: Meaning to Kanji
          const distractors = shuffle(kanjiList.filter(item => item.character !== k.character))
            .slice(0, 3)
            .map(item => item.character);

          generated.push({
            id: `q_meaning_k_${idx}_${Date.now()}`,
            type: 'meaning_to_kanji',
            question: `Chữ Kanji nào tương ứng với nghĩa "${k.meanings_vi[0]}"?`,
            options: shuffle([k.character, ...distractors]),
            answer: k.character,
            difficulty: k.jlpt,
            category: 'kanji',
            hint: `Cách đọc Kun: ${k.kun_readings.join(', ')}`
          });
        }
      });
    }

    else if (cat === 'vocabulary') {
      if (vocabList.length < 4) return;
      const shuffledVocab = shuffle(vocabList);

      shuffledVocab.slice(0, 10).forEach((v, idx) => {
        const typeRand = Math.random();
        
        if (typeRand < 0.5) {
          // Type 1: Vocab to Meaning
          const distractors = shuffle(vocabList.filter(item => item.id !== v.id))
            .slice(0, 3)
            .map(item => item.meanings_vi.join(', '));

          generated.push({
            id: `q_vocab_m_${idx}_${Date.now()}`,
            type: 'vocab_to_meaning',
            question: `Từ vựng "${v.word}" (${v.reading}) có nghĩa là gì?`,
            options: shuffle([v.meanings_vi.join(', '), ...distractors]),
            answer: v.meanings_vi.join(', '),
            difficulty: v.jlpt,
            category: 'vocabulary',
            hint: `Từ loại: ${v.partOfSpeech} | Romaji: ${v.romaji}`
          });
        } else {
          // Type 2: Vocab to Reading (Furiganas)
          const distractors = shuffle(vocabList.filter(item => item.id !== v.id))
            .slice(0, 3)
            .map(item => item.reading);

          generated.push({
            id: `q_vocab_r_${idx}_${Date.now()}`,
            type: 'vocab_to_reading',
            question: `Từ vựng "${v.word}" có cách đọc Kana là gì?`,
            options: shuffle([v.reading, ...distractors]),
            answer: v.reading,
            difficulty: v.jlpt,
            category: 'vocabulary',
            hint: `Nghĩa: ${v.meanings_vi.join(', ')}`
          });
        }
      });
    }

    else if (cat === 'grammar') {
      if (grammarList.length < 4) return;
      const shuffledGrammar = shuffle(grammarList);

      shuffledGrammar.slice(0, 10).forEach((g, idx) => {
        const example = g.examples[0];
        const correctPattern = g.pattern.replace('〜', '');
        const sentenceQuestion = example.ja.replace(correctPattern, ' [ ... ] ');

        const distractors = shuffle(grammarList.filter(item => item.id !== g.id))
          .slice(0, 3)
          .map(item => item.pattern.replace('〜', ''));

        generated.push({
          id: `q_grammar_f_${idx}_${Date.now()}`,
          type: 'grammar_fill_in',
          question: `Chọn mẫu cấu trúc phù hợp điền vào ô trống:\n"${sentenceQuestion}"`,
          options: shuffle([correctPattern, ...distractors]),
          answer: correctPattern,
          difficulty: g.jlpt,
          category: 'grammar',
          hint: `Nghĩa tiếng Việt của câu: ${example.vi} | Ý nghĩa ngữ pháp: ${g.meaning_vi}`
        });
      });
    }

    else if (cat === 'review') {
      const allKanjis = shuffle(kanjiList).slice(0, 4);
      const allVocabs = shuffle(vocabList).slice(0, 3);
      const allGrammars = shuffle(grammarList).slice(0, 3);

      allKanjis.forEach((k, idx) => {
        const distractors = shuffle(kanjiList.filter(item => item.character !== k.character)).slice(0, 3).map(item => item.meanings_vi.join(', '));
        generated.push({
          id: `q_rev_k_${idx}_${Date.now()}`,
          type: 'kanji_to_meaning',
          question: `Chữ Kanji "${k.character}" có nghĩa là gì?`,
          options: shuffle([k.meanings_vi.join(', '), ...distractors]),
          answer: k.meanings_vi.join(', '),
          difficulty: k.jlpt,
          category: 'kanji'
        });
      });

      allVocabs.forEach((v, idx) => {
        const distractors = shuffle(vocabList.filter(item => item.id !== v.id)).slice(0, 3).map(item => item.meanings_vi.join(', '));
        generated.push({
          id: `q_rev_v_${idx}_${Date.now()}`,
          type: 'vocab_to_meaning',
          question: `Từ vựng "${v.word}" (${v.reading}) có nghĩa là gì?`,
          options: shuffle([v.meanings_vi.join(', '), ...distractors]),
          answer: v.meanings_vi.join(', '),
          difficulty: v.jlpt,
          category: 'vocabulary'
        });
      });

      allGrammars.forEach((g, idx) => {
        const example = g.examples[0];
        const correctPattern = g.pattern.replace('〜', '');
        const sentenceQuestion = example.ja.replace(correctPattern, ' [ ... ] ');
        const distractors = shuffle(grammarList.filter(item => item.id !== g.id)).slice(0, 3).map(item => item.pattern.replace('〜', ''));
        generated.push({
          id: `q_rev_g_${idx}_${Date.now()}`,
          type: 'grammar_fill_in',
          question: `Chọn từ điền vào ô trống:\n"${sentenceQuestion}"`,
          options: shuffle([correctPattern, ...distractors]),
          answer: correctPattern,
          difficulty: g.jlpt,
          category: 'grammar'
        });
      });

      generated = shuffle(generated).slice(0, 10);
    }

    setQuestions(generated);
    setCurrentIdx(0);
    setScore(0);
    setAnswersLog([]);
    setQuizState('active');
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const q = questions[currentIdx];
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      removeWrongQuizQuestion(q.question);
    } else {
      addWrongQuizQuestion(q.question);
    }

    setAnswersLog(prev => [...prev, { question: q, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      addQuizResult(score, questions.length, category);
      setQuizState('completed');
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'kanji': return 'Chữ Hán';
      case 'vocabulary': return 'Từ vựng';
      case 'grammar': return 'Ngữ pháp';
      case 'review': return 'Tổng hợp';
      default: return cat;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Trắc nghiệm ôn tập
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Kiểm tra ngẫu nhiên và củng cố kiến thức chữ Hán, từ vựng hoặc cấu trúc ngữ pháp.
        </p>
      </div>

      {/* SETUP SCREEN */}
      {quizState === 'setup' && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-250">Chọn chủ đề ôn tập</h2>
            <p className="text-xs text-neutral-450 dark:text-neutral-500 max-w-xs mx-auto">Hệ thống sẽ sinh ngẫu nhiên 10 câu hỏi trắc nghiệm từ bộ dữ liệu local.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kanji */}
            <button
              onClick={() => { setCategory('kanji'); generateQuiz('kanji'); }}
              disabled={kanjiList.length < 4}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-750 bg-white dark:bg-zinc-900 text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">Quiz Chữ Hán</h3>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500">Nghĩa chữ Kanji, âm đọc On/Kun</p>
            </button>

            {/* Vocabulary */}
            <button
              onClick={() => { setCategory('vocabulary'); generateQuiz('vocabulary'); }}
              disabled={vocabList.length < 4}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-750 bg-white dark:bg-zinc-900 text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">Quiz Từ vựng</h3>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500">Dịch nghĩa từ vựng, cách đọc Kana</p>
            </button>

            {/* Grammar */}
            <button
              onClick={() => { setCategory('grammar'); generateQuiz('grammar'); }}
              disabled={grammarList.length < 4}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-750 bg-white dark:bg-zinc-900 text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">Quiz Ngữ pháp</h3>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500">Điền mẫu ngữ pháp vào câu ví dụ</p>
            </button>

            {/* Review mix */}
            <button
              onClick={() => { setCategory('review'); generateQuiz('review'); }}
              disabled={kanjiList.length < 4 && vocabList.length < 4}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-750 bg-white dark:bg-zinc-900 text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">Ôn tập tổng hợp</h3>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500">Xào trộn Kanji, từ vựng và ngữ pháp</p>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ SCREEN */}
      {quizState === 'active' && questions.length > 0 && (
        <div className="space-y-4">
          <div className="max-w-xl mx-auto flex justify-between items-center px-1">
            <button
              onClick={() => setQuizState('setup')}
              className="px-2.5 py-1 border border-neutral-300 dark:border-neutral-750 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-bold rounded cursor-pointer transition-colors"
            >
              Thoát Quiz
            </button>
            <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              Điểm: <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">{score}</span>
            </div>
          </div>

          <QuizCard
            question={questions[currentIdx]}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            onAnswerSubmit={handleAnswerSubmit}
            onNext={handleNext}
          />
        </div>
      )}

      {/* COMPLETED RESULT SCREEN */}
      {quizState === 'completed' && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-xl mx-auto space-y-6 text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Hoàn thành bài Quiz!</h2>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 capitalize">Chủ đề: {getCategoryLabel(category)}</p>
          </div>

          {/* Big Score Display */}
          <div className="py-4 px-6 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-850 max-w-[200px] mx-auto">
            <div className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 font-display">
              {score}/{questions.length}
            </div>
            <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-wider">
              {(score / questions.length) >= 0.8 ? "Xuất sắc" : (score / questions.length) >= 0.5 ? "Đạt yêu cầu" : "Cần ôn thêm"}
            </p>
          </div>

          {/* Breakdown Review of answers */}
          <div className="text-left space-y-2 max-w-md mx-auto">
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block select-none">Xem lại kết quả</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {answersLog.map((log, idx) => (
                <div key={idx} className="p-3 bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-lg flex items-center justify-between text-[11px] font-medium gap-3">
                  <div className="truncate max-w-[80%]">
                    <div className="text-neutral-800 dark:text-neutral-250 truncate leading-relaxed">{log.question.question}</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5">Đáp án: {log.question.answer}</div>
                  </div>
                  {log.isCorrect ? (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 uppercase shrink-0">[Đúng]</span>
                  ) : (
                    <span className="text-[9px] font-bold text-rose-500 uppercase shrink-0">[Sai]</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center max-w-sm mx-auto pt-4 border-t border-neutral-150 dark:border-neutral-800">
            <button
              onClick={() => generateQuiz(category)}
              className="flex-1 py-2 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Làm lại
            </button>
            <button
              onClick={() => setQuizState('setup')}
              className="flex-1 py-2 px-4 border border-neutral-300 dark:border-neutral-750 hover:bg-neutral-55 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
