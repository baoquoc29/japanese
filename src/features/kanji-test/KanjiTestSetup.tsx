import React from 'react';
import type { Kanji } from '../../types';
import type { KanjiQuestionType } from './kanjiTestGenerator';

interface KanjiTestSetupProps {
  kanjiList: Kanji[];
  onStart: (config: {
    jlpt: string;
    questionCount: number;
    questionTypes: KanjiQuestionType[] | 'mixed';
  }) => void;
}

export const KanjiTestSetup: React.FC<KanjiTestSetupProps> = ({ onStart, kanjiList }) => {
  const [jlpt, setJlpt] = React.useState('all');
  const [questionCount, setQuestionCount] = React.useState(10);
  const [questionType, setQuestionType] = React.useState<KanjiQuestionType[] | 'mixed'>('mixed');

  // Sync Level Counts
  const counts = kanjiList.reduce((acc, k) => {
    const lvl = k.jlpt || 'N5';
    acc[lvl] = (acc[lvl] || 0) + 1;
    acc['all'] = (acc['all'] || 0) + 1;
    return acc;
  }, { all: 0, N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 } as Record<string, number>);

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

  const availableCount = counts[jlpt] || 0;
  const isStartDisabled = availableCount < 4;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Header */}
      <div className="text-center space-y-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-5 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          Kiểm tra Kanji
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Hệ thống câu hỏi tự động được đồng bộ trực tiếp từ bộ từ điển chữ Hán cá nhân của bạn.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-6">
        {/* JLPT */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Cấp độ JLPT
          </label>
          <div className="flex flex-wrap gap-2">
            {jlptOptions.map(opt => {
              const active = jlpt === opt.value;
              const count = counts[opt.value] || 0;
              return (
                <button
                  key={opt.value}
                  onClick={() => setJlpt(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 font-bold'
                      : 'bg-white border-neutral-200 text-neutral-500 dark:bg-zinc-900 dark:border-neutral-850 dark:text-neutral-450 hover:bg-neutral-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="ml-1 text-[9px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Số lượng câu hỏi
          </label>
          <div className="flex gap-2">
            {countOptions.map(c => {
              const active = questionCount === c;
              return (
                <button
                  key={c}
                  onClick={() => setQuestionCount(c)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-950 border-neutral-950 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 font-bold'
                      : 'bg-white border-neutral-200 text-neutral-500 dark:bg-zinc-900 dark:border-neutral-850 dark:text-neutral-450 hover:bg-neutral-50'
                  }`}
                >
                  {c} câu
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none">
            Phương thức trắc nghiệm
          </label>
          <div className="grid grid-cols-1 gap-2">
            {typeOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setQuestionType(opt.value)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isTypeSelected(opt.value)
                    ? 'bg-neutral-50 border-neutral-400 text-neutral-900 dark:bg-neutral-850 dark:border-neutral-700 dark:text-neutral-100'
                    : 'bg-white border-neutral-200 dark:bg-zinc-900 dark:border-neutral-850 hover:bg-neutral-50'
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="space-y-2">
          {isStartDisabled && (
            <p className="text-[10px] text-rose-500 text-center font-semibold">
              Cần tối thiểu 4 chữ Kanji trong kho để tạo đề thi cho cấp độ này.
            </p>
          )}
          <button
            onClick={() => onStart({ jlpt, questionCount, questionTypes: questionType })}
            disabled={isStartDisabled}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-950 text-white font-bold rounded-xl transition-all cursor-pointer text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanjiTestSetup;
