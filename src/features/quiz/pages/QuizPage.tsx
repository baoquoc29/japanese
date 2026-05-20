import React, { useState } from 'react';
import { useKanji } from '../../../hooks/useKanji';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useGrammar } from '../../../hooks/useGrammar';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { QuizCard } from '../components/QuizCard';
import type { QuizQuestion } from '../../../types';
import { 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  BookMarked,
  CheckCircle,
  XCircle
} from 'lucide-react';

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
        // We do Fill in the blank grammar question based on example sentences
        const example = g.examples[0];
        const correctPattern = g.pattern.replace('〜', '');
        
        // Let's create a blank inside sentence: e.g. "私は学生です。" -> "私は学生 [ ? ] 。"
        // Replace correctPattern with [ ... ]
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
      // Create quiz from wrong quiz questions in the past (wrongQuizQuestions)
      // Since wrongQuizQuestions contains plain text question names, we can look up matching elements or fallback to simple mixed questions.
      // For simplicity, we can shuffle Kanji, Vocab and Grammar N5 database and create a 10 question mixed quiz
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
      // Remove from wrong questions pool if it was there
      removeWrongQuizQuestion(q.question);
    } else {
      // Add to wrong questions queue for favorites/review module
      addWrongQuizQuestion(q.question);
    }

    setAnswersLog(prev => [...prev, { question: q, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Save result to localStorage
      addQuizResult(score, questions.length, category);
      setQuizState('completed');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-slate-100">
          Trắc nghiệm ôn tập
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Kiểm tra ngẫu nhiên và củng cố kiến thức chữ Hán, từ vựng hoặc cấu trúc ngữ pháp.
        </p>
      </div>

      {/* SETUP SCREEN */}
      {quizState === 'setup' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm space-y-6">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black font-display text-slate-800 dark:text-slate-100">Chọn chủ đề ôn tập</h2>
            <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">Hệ thống sẽ sinh ngẫu nhiên 10 câu hỏi trắc nghiệm từ bộ dữ liệu local.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kanji */}
            <button
              onClick={() => { setCategory('kanji'); generateQuiz('kanji'); }}
              disabled={kanjiList.length < 4}
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left hover:border-sky-500/40 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-sky-500 transition-colors">Quiz Chữ Hán</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Nghĩa chữ Kanji, âm đọc On/Kun</p>
              </div>
            </button>

            {/* Vocabulary */}
            <button
              onClick={() => { setCategory('vocabulary'); generateQuiz('vocabulary'); }}
              disabled={vocabList.length < 4}
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left hover:border-emerald-500/40 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">Quiz Từ vựng</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Dịch nghĩa từ vựng, cách đọc Kana</p>
              </div>
            </button>

            {/* Grammar */}
            <button
              onClick={() => { setCategory('grammar'); generateQuiz('grammar'); }}
              disabled={grammarList.length < 4}
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left hover:border-violet-500/40 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-violet-500 transition-colors">Quiz Ngữ pháp</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Điền mẫu ngữ pháp vào câu ví dụ</p>
              </div>
            </button>

            {/* Review mix */}
            <button
              onClick={() => { setCategory('review'); generateQuiz('review'); }}
              disabled={kanjiList.length < 4 && vocabList.length < 4}
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left hover:border-indigo-500/40 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">Ôn tập tổng hợp</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Xào trộn Kanji, từ vựng và ngữ pháp</p>
              </div>
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Thoát Quiz
            </button>
            <div className="text-xs font-bold text-slate-400">
              Điểm số: <span className="text-emerald-500 font-black text-sm">{score}</span>
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm space-y-6 text-center">
          <div>
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3 animate-bounce" />
            <h2 className="text-3xl font-black font-display text-slate-800 dark:text-slate-100">Hoàn thành bài Quiz!</h2>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1 capitalize">Chủ đề: {category === 'kanji' ? 'Chữ Hán' : category === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'}</p>
          </div>

          {/* Big Score Display */}
          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800/40 max-w-xs mx-auto">
            <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 font-display">
              {score}/{questions.length}
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
              {(score / questions.length) >= 0.8 ? "Tuyệt vời!" : (score / questions.length) >= 0.5 ? "Khá lắm!" : "Cần ôn tập thêm!"}
            </p>
          </div>

          {/* Breakdown Review of answers */}
          <div className="text-left space-y-3.5 max-w-lg mx-auto">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block select-none">Xem lại câu trả lời</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {answersLog.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between text-xs font-bold gap-3">
                  <div className="truncate max-w-[80%]">
                    <div className="text-slate-700 dark:text-slate-300 truncate leading-relaxed">{log.question.question}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Đáp án: {log.question.answer}</div>
                  </div>
                  {log.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center max-w-sm mx-auto pt-4 border-t border-slate-100 dark:border-slate-800/65">
            <button
              onClick={() => generateQuiz(category)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại
            </button>
            <button
              onClick={() => setQuizState('setup')}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-350 rounded-2xl text-xs font-extrabold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Menu chính
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuizPage;
