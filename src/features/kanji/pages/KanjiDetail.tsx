import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { kanjiService } from '../../../services/kanjiService';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import { StrokeOrderViewer } from '../components/StrokeOrderViewer';
import type { Kanji } from '../../../types';

export const KanjiDetail: React.FC = () => {
  const { character } = useParams<{ character: string }>();
  const navigate = useNavigate();
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [loading, setLoading] = useState(true);
  const { progress, toggleFavoriteKanji, markKanjiAsLearned } = useStudyProgress();

  useEffect(() => {
    const loadDetail = async () => {
      if (!character) return;
      setLoading(true);
      const data = await kanjiService.getKanjiByCharacter(character);
      setKanji(data);
      setLoading(false);
    };
    loadDetail();
  }, [character]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Đang tải chi tiết Kanji...</span>
      </div>
    );
  }

  if (!kanji) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Không tìm thấy Kanji này</h3>
        <button
          onClick={() => navigate('/kanji')}
          className="mt-4 px-4 py-2 border border-neutral-350 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-805 dark:text-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isFavorite = progress.favoriteKanji.includes(kanji.character);
  const isLearned = progress.learnedKanji.includes(kanji.character);

  return (
    <div className="space-y-8 py-2">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/kanji')}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
        >
          Quay lại Kanji
        </button>
      </div>

      {/* Dictionary Card Info */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* giant character */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-850 pb-6 md:pb-0 md:pr-8">
            <div className="text-8xl font-light font-jp text-neutral-900 dark:text-neutral-50 select-none leading-none">
              {kanji.character}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-neutral-400 font-semibold select-none">
              <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded">
                JLPT {kanji.jlpt}
              </span>
              <span>{kanji.stroke_count} nét</span>
            </div>
          </div>

          {/* info */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 capitalize">
                {kanji.meanings_vi.join(', ')}
              </h1>
              <p className="text-neutral-400 dark:text-neutral-500 text-xs font-medium capitalize mt-0.5">
                {kanji.meanings_en.join(', ')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-neutral-150 dark:border-neutral-800 rounded-lg p-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Âm On (音読み)</span>
                <span className="text-base font-bold font-sans text-neutral-800 dark:text-neutral-205">{kanji.on_readings.join(', ') || '—'}</span>
              </div>
              <div className="border border-neutral-150 dark:border-neutral-800 rounded-lg p-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Âm Kun (訓読み)</span>
                <span className="text-base font-medium font-sans text-neutral-800 dark:text-neutral-205">{kanji.kun_readings.join(', ') || '—'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons Row - simple, flat text-based button list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => markKanjiAsLearned(kanji.character, !isLearned)}
          className={`py-3 px-4 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${
            isLearned
              ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-350 dark:border-neutral-700 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-neutral-300 dark:text-neutral-400 hover:bg-neutral-50'
          }`}
        >
          {isLearned ? 'Đã học ✓' : 'Đánh dấu đã học'}
        </button>

        <button
          onClick={() => toggleFavoriteKanji(kanji.character)}
          className={`py-3 px-4 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${
            isFavorite
              ? 'bg-neutral-105 dark:bg-neutral-800 border-neutral-350 dark:border-neutral-700 text-rose-500'
              : 'bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-neutral-300 dark:text-neutral-400 hover:bg-neutral-50'
          }`}
        >
          {isFavorite ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích'}
        </button>

        <Link
          to={`/writing?char=${kanji.character}`}
          className="py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900 text-neutral-600 dark:text-neutral-400 font-bold text-xs hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 text-center"
        >
          Luyện viết chữ này
        </Link>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Info detail Card */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-850">
            Thông tin chi tiết
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Unicode</span>
                <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">U+{kanji.unicode.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Số nét</span>
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{kanji.stroke_count} nét</span>
              </div>
            </div>
            
            <div>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block select-none mb-1">Tất cả nghĩa tiếng Việt</span>
              <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold">
                {kanji.meanings_vi.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Stroke Order Viewer */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col justify-between min-h-[250px]">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-850 mb-4 select-none">
            Thứ tự nét viết (Hanzi Writer)
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <StrokeOrderViewer character={kanji.character} unicode={kanji.unicode} />
          </div>
        </div>
      </div>

      {/* Vocabulary examples */}
      {kanji.examples && kanji.examples.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-850">
            Từ vựng chứa chữ 「{kanji.character}」
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kanji.examples.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              >
                <div className="space-y-1">
                  <div className="text-base font-bold font-sans text-neutral-900 dark:text-neutral-200">{ex}</div>
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500">Từ vựng chứa chữ Hán liên quan</div>
                </div>
                <Link
                  to={`/vocabulary`}
                  className="text-[10px] font-semibold text-indigo-650 dark:text-indigo-400"
                >
                  Xem từ vựng
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default KanjiDetail;
