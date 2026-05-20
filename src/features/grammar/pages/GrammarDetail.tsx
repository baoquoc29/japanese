import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { grammarService } from '../../../services/grammarService';
import { useStudyProgress } from '../../../hooks/useStudyProgress';
import type { GrammarPoint } from '../../../types';

export const GrammarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grammar, setGrammar] = useState<GrammarPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const { progress, toggleFavoriteGrammar, markGrammarAsLearned } = useStudyProgress();

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      const data = await grammarService.getGrammarById(id);
      setGrammar(data);
      setLoading(false);
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40">
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Đang tải chi tiết ngữ pháp...</span>
      </div>
    );
  }

  if (!grammar) {
    return (
      <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Không tìm thấy mẫu ngữ pháp này</h3>
        <button
          onClick={() => navigate('/grammar')}
          className="mt-4 px-4 py-2 border border-neutral-350 dark:border-neutral-700 hover:bg-neutral-55 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isFavorite = progress.favoriteGrammar.includes(grammar.id);
  const isLearned = progress.learnedGrammar.includes(grammar.id);

  return (
    <div className="space-y-6 py-2">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/grammar')}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary and Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <span className="px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
              JLPT {grammar.jlpt}
            </span>
            <h2 className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-50 mt-4 leading-normal">
              {grammar.pattern}
            </h2>
            <h3 className="text-sm font-semibold text-neutral-850 dark:text-neutral-200 mt-2 leading-relaxed">
              {grammar.meaning_vi}
            </h3>
            {grammar.meaning_en && (
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 capitalize">
                English: {grammar.meaning_en}
              </p>
            )}

            {/* Quick Actions (Text based buttons) */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-850">
              <button
                onClick={() => markGrammarAsLearned(grammar.id, !isLearned)}
                className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-colors cursor-pointer ${
                  isLearned 
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-350 dark:border-neutral-700 text-indigo-650 dark:text-indigo-400' 
                    : 'bg-white border-neutral-200 dark:bg-zinc-900 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {isLearned ? 'Đã thuộc ✓' : 'Chưa học'}
              </button>

              <button
                onClick={() => toggleFavoriteGrammar(grammar.id)}
                className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-colors cursor-pointer ${
                  isFavorite 
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-350 dark:border-neutral-700 text-rose-500' 
                    : 'bg-white border-neutral-200 dark:bg-zinc-900 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {isFavorite ? 'Đã lưu ★' : 'Yêu thích'}
              </button>
            </div>
          </div>

          {/* Usage notes */}
          {grammar.notes && (
            <div className="bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-2">
              <h4 className="text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase block select-none">
                Chú ý
              </h4>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-450 leading-relaxed">
                {grammar.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Structure and Examples */}
        <div className="lg:col-span-2 space-y-6">
          {/* Structure Box */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-3">
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider select-none">
              Cấu trúc kết hợp
            </h3>
            <div className="bg-neutral-50/50 dark:bg-neutral-950 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <code className="text-xs font-bold font-mono text-neutral-800 dark:text-neutral-200 break-words">
                {grammar.structure}
              </code>
            </div>
          </div>

          {/* Rich Examples Box */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Ví dụ thực hành
            </h3>
            
            <div className="space-y-3">
              {grammar.examples.map((ex, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-neutral-50/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg flex gap-3 items-start"
                >
                  <span className="w-5 h-5 border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5 select-none">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold font-sans text-neutral-900 dark:text-neutral-200 leading-relaxed">
                      {ex.ja}
                    </p>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500 font-sans">
                      {ex.reading}
                    </p>
                    <p className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 mt-1">
                      {ex.vi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default GrammarDetail;
