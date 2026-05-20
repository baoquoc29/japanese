import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKanji } from '../hooks/useKanji';
import { useVocabulary } from '../hooks/useVocabulary';
import { useGrammar } from '../hooks/useGrammar';
import { useStudyProgress } from '../hooks/useStudyProgress';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { kanjiList } = useKanji();
  const { vocabList } = useVocabulary();
  const { grammarList } = useGrammar();
  const { progress } = useStudyProgress();

  const jlptLevels = [
    { level: 'N5', label: 'Cơ bản', desc: 'Chữ Hán, từ vựng và ngữ pháp nhập môn', border: 'border-neutral-200 dark:border-neutral-800', active: true },
    { level: 'N4', label: 'Sơ cấp', desc: 'Giao tiếp đời sống hàng ngày', border: 'border-neutral-200 dark:border-neutral-800', active: true },
    { level: 'N3', label: 'Trung cấp', desc: 'Đọc hiểu báo chí đơn giản', border: 'border-neutral-200 dark:border-neutral-800', active: false },
    { level: 'N2', label: 'Trung cao cấp', desc: 'Tiếng Nhật học thuật & công việc', border: 'border-neutral-200 dark:border-neutral-800', active: false },
    { level: 'N1', label: 'Cao cấp', desc: 'Thành thạo tiếng Nhật', border: 'border-neutral-200 dark:border-neutral-800', active: false },
  ];

  return (
    <div className="space-y-16 py-4">
      
      {/* ===== HERO SECTION ===== */}
      <section className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
                Học tiếng Nhật dễ hơn mỗi ngày
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-xl">
                Luyện Kanji, từ vựng, ngữ pháp và viết chữ Nhật ngay trên trình duyệt. 
                Nền tảng học liệu tinh gọn, tập trung và hoàn toàn miễn phí.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/kanji')}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Bắt đầu học
              </button>
              <button
                onClick={() => navigate('/writing')}
                className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Luyện viết Kanji
              </button>
            </div>
          </div>

          {/* Right: Modern & Minimalist Kanji Card */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-xl p-8 border border-neutral-200 dark:border-neutral-850 w-full max-w-xs text-center">
              <div className="text-7xl font-light font-jp text-neutral-900 dark:text-neutral-50 select-none mb-4">日</div>
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-250">ngày / mặt trời</div>
              <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">にち・ひ</div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="px-2 py-0.5 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-medium rounded">JLPT N5</span>
                <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">4 nét</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STUDY MODULES ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Nội dung học tập
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Lựa chọn chuyên mục để rèn luyện kỹ năng</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Kanji Card */}
          <div 
            onClick={() => navigate('/kanji')}
            className="learning-card bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                Chữ Hán Kanji
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Ghi nhớ mặt chữ, cách đọc On/Kun và ý nghĩa tiếng Việt của {kanjiList.length}+ chữ Hán.
              </p>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-6">
              Học ngay
            </div>
          </div>

          {/* Vocabulary Card */}
          <div 
            onClick={() => navigate('/vocabulary')}
            className="learning-card bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                Từ vựng
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Học từ vựng chia theo cấp độ JLPT, đính kèm cách đọc Kana và âm thanh mẫu chuẩn.
              </p>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-6">
              Học ngay
            </div>
          </div>

          {/* Grammar Card */}
          <div 
            onClick={() => navigate('/grammar')}
            className="learning-card bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                Ngữ pháp
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Củng cố {grammarList.length}+ cấu trúc ngữ pháp thông qua các ví dụ ngắn gọn, thực tế và dễ tiếp thu.
              </p>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-6">
              Học ngay
            </div>
          </div>

          {/* Writing Card */}
          <div 
            onClick={() => navigate('/writing')}
            className="learning-card bg-white dark:bg-zinc-900 p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50">
                Luyện viết
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Viết Kanji theo nét chuẩn hoặc tự do tập luyện ngay trên canvas kỹ thuật số.
              </p>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-6">
              Luyện tập
            </div>
          </div>
        </div>
      </section>

      {/* ===== JLPT PATH ===== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Lộ trình JLPT
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Định hướng các cấp bậc kiểm tra năng lực Nhật ngữ</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {jlptLevels.map((jlpt) => {
            const levelKanji = kanjiList.filter(k => k.jlpt === jlpt.level);
            const levelLearnedCount = levelKanji.filter(k => progress.learnedKanji.includes(k.character)).length;
            const levelTotalCount = levelKanji.length;
            const percentage = levelTotalCount > 0 ? Math.round((levelLearnedCount / levelTotalCount) * 100) : 0;

            return (
              <div
                key={jlpt.level}
                onClick={() => navigate('/kanji')}
                className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800/80 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 font-display">{jlpt.level}</h3>
                    {jlpt.active && (
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                        Đang học
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-neutral-750 dark:text-neutral-300">{jlpt.label}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">{jlpt.desc}</p>
                </div>
                
                {/* Progress bar (Thin and simple, no colors/gradients) */}
                <div className="mt-6 space-y-1.5">
                  <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full progress-bar-fill"
                      style={{ width: jlpt.active ? `${percentage}%` : '0%' }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                    {jlpt.active ? `${percentage}% hoàn thành` : 'Chưa mở'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== YOUR PROGRESS ===== */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Tiến độ học tập
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Streak */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Học liên tiếp</div>
            <div className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mt-2">{progress.streak} ngày</div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-1">Duy trì thói quen mỗi ngày</p>
          </div>

          {/* Kanji learned */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Chữ Hán đã học</div>
            <div className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mt-2">{progress.learnedKanji.length} chữ</div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-1">trên tổng số {kanjiList.length} chữ</p>
          </div>

          {/* Vocab learned */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Từ vựng đã học</div>
            <div className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mt-2">{progress.learnedVocab.length} từ</div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-1">trên tổng số {vocabList.length} từ</p>
          </div>

          {/* Quiz done */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bài trắc nghiệm</div>
            <div className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mt-2">{progress.quizHistory.length} lần</div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-550 mt-1">Luyện tập ghi nhớ kiến thức</p>
          </div>
        </div>
      </section>

      {/* ===== RECENT QUIZ ===== */}
      {progress.quizHistory && progress.quizHistory.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Kết quả trắc nghiệm gần đây
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {progress.quizHistory.slice(0, 6).map((history, idx) => (
              <div key={idx} className="shrink-0 w-44 bg-white dark:bg-zinc-900 rounded-xl p-4 border border-neutral-200/80 dark:border-neutral-800/80">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {history.category === 'kanji' ? 'Chữ Hán' : history.category === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'}
                </div>
                <div className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mt-1.5">
                  {history.score}/{history.total}
                </div>
                <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">{history.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
