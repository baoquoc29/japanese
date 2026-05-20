import React from 'react';
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

  const typeOptions: { value: KanjiQuestionType[] | 'mixed'; label: string; desc: string }[] = [
    { value: 'mixed', label: 'Tổng hợp', desc: 'Ngẫu nhiên tất cả các dạng câu hỏi bên dưới' },
    { value: ['meaning'], label: 'Chọn ý nghĩa', desc: 'Nhìn chữ Kanji đoán ý nghĩa tiếng Việt tương ứng' },
    { value: ['reading'], label: 'Chọn cách đọc', desc: 'Nhìn chữ Kanji chọn âm On/Kun chính xác' },
    { value: ['kanji_by_meaning'], label: 'Chọn chữ Kanji', desc: 'Nhìn ý nghĩa chọn chữ Kanji chính xác' },
    { value: ['stroke_count'], label: 'Đếm nét viết', desc: 'Chọn tổng số nét viết chính xác của chữ Kanji' },
  ];

  const isTypeSelected = (val: KanjiQuestionType[] | 'mixed') =>
    JSON.stringify(questionType) === JSON.stringify(val);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in py-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-6 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Kiểm tra Kanji
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Thư viện chứa {kanjiCount} chữ Kanji đã sẵn sàng. Thiết lập cấu hình bài thi bên dưới.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
        {/* JLPT */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Cấp độ JLPT
          </label>
          <div className="flex flex-wrap gap-2">
            {jlptOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setJlpt(opt.value)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  jlpt === opt.value
                    ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 font-bold'
                    : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Số lượng câu hỏi
          </label>
          <div className="flex gap-2">
            {countOptions.map(c => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  questionCount === c
                    ? 'bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 font-bold'
                    : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {c} câu
              </button>
            ))}
          </div>
        </div>

        {/* Question Type */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Phương thức trắc nghiệm
          </label>
          <div className="grid grid-cols-1 gap-2">
            {typeOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setQuestionType(opt.value)}
                className={`flex items-center justify-between p-3.5 rounded-lg text-left border transition-colors cursor-pointer ${
                  isTypeSelected(opt.value)
                    ? 'bg-neutral-50 dark:bg-neutral-850/60 border-neutral-400 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold'
                    : 'bg-white border-neutral-200 dark:bg-zinc-900 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850/50'
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{opt.desc}</p>
                </div>
                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {isTypeSelected(opt.value) ? '[Đang chọn]' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart({ jlpt, questionCount, questionTypes: questionType })}
          className="w-full mt-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Bắt đầu làm bài
        </button>
      </div>
    </div>
  );
};

export default KanjiTestSetup;
