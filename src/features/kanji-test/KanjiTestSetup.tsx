import React from 'react';
import { BookOpen, GraduationCap, Layers, Hash } from 'lucide-react';
import type { KanjiQuestionType } from './kanjiTestGenerator';

interface KanjiTestSetupProps {
  onStart: (config: {
    jlpt: string;
    questionCount: number;
    questionTypes: KanjiQuestionType[] | 'mixed';
  }) => void;
  kanjiCount: number;
}

export const KanjiTestSetup: React.FC<KanjiTestSetupProps> = ({ onStart, kanjiCount }) => {
  const [jlpt, setJlpt] = React.useState('all');
  const [questionCount, setQuestionCount] = React.useState(10);
  const [questionType, setQuestionType] = React.useState<KanjiQuestionType[] | 'mixed'>('mixed');

  const jlptOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'N5', label: 'N5' },
    { value: 'N4', label: 'N4' },
    { value: 'N3', label: 'N3' },
    { value: 'N2', label: 'N2' },
    { value: 'N1', label: 'N1' },
  ];

  const countOptions = [5, 10, 20];

  const typeOptions: { value: KanjiQuestionType[] | 'mixed'; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'mixed', label: 'Tổng hợp', icon: <Layers className="w-5 h-5" />, desc: 'Ngẫu nhiên tất cả dạng' },
    { value: ['meaning'], label: 'Chọn nghĩa', icon: <BookOpen className="w-5 h-5" />, desc: 'Kanji → nghĩa tiếng Việt' },
    { value: ['reading'], label: 'Chọn cách đọc', icon: <GraduationCap className="w-5 h-5" />, desc: 'Kanji → On/Kun reading' },
    { value: ['kanji_by_meaning'], label: 'Chọn Kanji', icon: <span className="text-lg font-black font-jp">漢</span>, desc: 'Nghĩa → chọn Kanji đúng' },
    { value: ['stroke_count'], label: 'Đếm nét', icon: <Hash className="w-5 h-5" />, desc: 'Kanji → số nét đúng' },
  ];

  const isTypeSelected = (val: KanjiQuestionType[] | 'mixed') =>
    JSON.stringify(questionType) === JSON.stringify(val);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">📝</div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
          Kiểm tra Kanji
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {kanjiCount} chữ Kanji sẵn sàng — Chọn cấu hình bài kiểm tra
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* JLPT */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Cấp độ JLPT
          </label>
          <div className="flex flex-wrap gap-2">
            {jlptOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setJlpt(opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  jlpt === opt.value
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Số câu hỏi
          </label>
          <div className="flex gap-2">
            {countOptions.map(c => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  questionCount === c
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c} câu
              </button>
            ))}
          </div>
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Dạng câu hỏi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {typeOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setQuestionType(opt.value)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isTypeSelected(opt.value)
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className={`shrink-0 ${isTypeSelected(opt.value) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {opt.icon}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isTypeSelected(opt.value) ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart({ jlpt, questionCount, questionTypes: questionType })}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-indigo-500/20 text-base"
        >
          🚀 Bắt đầu kiểm tra
        </button>
      </div>
    </div>
  );
};

export default KanjiTestSetup;
