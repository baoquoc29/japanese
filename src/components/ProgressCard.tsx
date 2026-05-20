import React from 'react';
import { Flame, BookOpen, GraduationCap, Award } from 'lucide-react';
import { type StudyProgress } from '../types';

interface ProgressCardProps {
  progress: StudyProgress;
  totalKanji: number;
  totalVocab: number;
  totalGrammar: number;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  totalKanji,
  totalVocab,
  totalGrammar,
  className = '',
}) => {
  const kanjiPct = totalKanji > 0 ? Math.round((progress.learnedKanji.length / totalKanji) * 100) : 0;
  const vocabPct = totalVocab > 0 ? Math.round((progress.learnedVocab.length / totalVocab) * 100) : 0;
  const grammarPct = totalGrammar > 0 ? Math.round((progress.learnedGrammar.length / totalGrammar) * 100) : 0;

  const totalLearned = progress.learnedKanji.length + progress.learnedVocab.length + progress.learnedGrammar.length;
  const totalItems = totalKanji + totalVocab + totalGrammar;
  const overallPct = totalItems > 0 ? Math.round((totalLearned / totalItems) * 100) : 0;

  return (
    <div className={`glass-panel p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800/50 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Tiến độ tổng thể</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Bạn đã hoàn thành {overallPct}% chặng đường học</p>
          </div>
        </div>

        {/* Streak card */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/10">
          <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
          <div>
            <div className="text-lg font-extrabold leading-none">{progress.streak} ngày</div>
            <div className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80">Streak học tập!</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Kanji Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <BookOpen className="w-4 h-4 text-sky-500" /> Kanji
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {progress.learnedKanji.length}/{totalKanji} ({kanjiPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${kanjiPct}%` }}
            />
          </div>
        </div>

        {/* Vocabulary Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <GraduationCap className="w-4 h-4 text-emerald-500" /> Từ vựng
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {progress.learnedVocab.length}/{totalVocab} ({vocabPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${vocabPct}%` }}
            />
          </div>
        </div>

        {/* Grammar Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Award className="w-4 h-4 text-violet-500" /> Ngữ pháp
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {progress.learnedGrammar.length}/{totalGrammar} ({grammarPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${grammarPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressCard;
